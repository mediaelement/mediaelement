/*!
 * MediaElement.js
 * http://www.mediaelement.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2016, John Dyer (http://j.hn/)
 * License: MIT
 *
 */
// Namespace
window.mejs = window.mejs || {};

// version number
mejs.version = '3.0-alpha';

/**
 * MediaElement utilities
 *
 * This file contains global functions and polyfills needed to support old browsers.
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * @class {mejs.Utility}
	 * @class {mejs.Utils}
	 */
	mejs.Utility = mejs.Utils = {
		/**
		 * @type {Function[]}
		 */
		typeChecks: [],

		/**
		 *
		 * @param {Object} obj
		 * @param {String} name
		 * @param {Function} onGet
		 * @param {Function} onSet
		 */
		addProperty: function (obj, name, onGet, onSet) {

			// wrapper functions
			var
				oldValue = obj[name],
				getFn = function () {
					return onGet.apply(obj, [oldValue]);
				},
				setFn = function (newValue) {
					oldValue = onSet.apply(obj, [newValue]);
					return oldValue;
				};

			// Modern browsers, IE9+ (IE8 only works on DOM objects, not normal JS objects)
			if (Object.defineProperty) {

				Object.defineProperty(obj, name, {
					get: getFn,
					set: setFn
				});

				// Older Firefox
			} else if (obj.__defineGetter__) {

				obj.__defineGetter__(name, getFn);
				obj.__defineSetter__(name, setFn);

				// IE6-7
				// must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
			} else {

				var onPropertyChange = function (event) {

					//

					if (event.propertyName === name) {

						// temporarily remove the event so it doesn't fire again and create a loop
						obj.detachEvent('onpropertychange', onPropertyChange);

						// get the changed value, run it through the set function
						var newValue = setFn(obj[name]);

						// restore the get function
						obj[name] = getFn;
						obj[name].toString = function () {
							return getFn().toString();
						};

						// restore the event
						obj.attachEvent('onpropertychange', onPropertyChange);
					}
				};

				try {
					obj[name] = getFn;
					obj[name].toString = function () {
						return getFn().toString();
					};
				} catch (ex) {
					
				}

				// add the property event change only once
				obj.attachEvent('onpropertychange', onPropertyChange);
			}
		},

		/**
		 *
		 * @param {String} eventName
		 * @param {HTMLElement} target
		 * @return {Object}
		 */
		createEvent: function (eventName, target) {
			var event = null;

			if (doc.createEvent) {
				event = doc.createEvent('Event');
				event.initEvent(eventName, true, false);
				event.target = target;
				//} else if (doc.createEventObject) {
				//	event = doc.createEventObject();
			} else {
				event = {};
			}
			event.type = eventName;
			event.target = target;

			return event;
		},

		/**
		 * Return the mime part of the type in case the attribute contains the codec
		 * (`video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`)
		 *
		 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
		 * @param {String} type
		 * @return {String}
		 */
		getMimeFromType: function (type) {
			if (type && ~type.indexOf(';')) {
				return type.substr(0, type.indexOf(';'));
			} else {
				return type;
			}
		},

		/**
		 * Get the format of a specific media, either based on URL or its mime type
		 *
		 * @param {String} url
		 * @param {String} type
		 * @return {String}
		 */
		formatType: function (url, type) {

			// if no type is supplied, fake it with the extension
			if (url && !type) {
				return this.getTypeFromFile(url);
			} else {
				return this.getMimeFromType(type);
			}
		},

		/**
		 * Get the type of media based on URL structure
		 *
		 * @param {String} url
		 * @return {String}
		 */
		getTypeFromFile: function (url) {

			var type = null;

			// do type checks first
			for (var i = 0, il = this.typeChecks.length; i < il; i++) {
				type = this.typeChecks[i](url);

				if (type !== null) {
					return type;
				}
			}

			// the do standard extension check
			var ext = this.getExtension(url),
				normalizedExt = this.normalizeExtension(ext);

			type = (/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + normalizedExt;

			return type;
		},

		/**
		 * Get media file extension from URL
		 *
		 * @param {String} url
		 * @return {String}
		 */
		getExtension: function (url) {
			var withoutQuerystring = url.split('?')[0],
				ext = ~withoutQuerystring.indexOf('.') ? withoutQuerystring.substring(withoutQuerystring.lastIndexOf('.') + 1) : '';

			return ext;
		},

		/**
		 * Get standard extension of a media file
		 *
		 * @param {String} extension
		 * @return {String}
		 */
		normalizeExtension: function (extension) {

			switch (extension) {
				case 'mp4':
				case 'm4v':
					return 'mp4';
				case 'webm':
				case 'webma':
				case 'webmv':
					return 'webm';
				case 'ogg':
				case 'oga':
				case 'ogv':
					return 'ogg';
				default:
					return extension;
			}
		},

		/**
		 *
		 * @param {String} url
		 * @return {String}
		 */
		encodeUrl: function (url) {
			return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
		},

		/**
		 *
		 * @param {String} output
		 * @return {string}
		 */
		escapeHTML: function (output) {
			return output.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
		},

		/**
		 *
		 * @param {String} url
		 * @return {String}
		 */
		absolutizeUrl: function (url) {
			var el = doc.createElement('div');
			el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
			return el.firstChild.href;
		},

		/**
		 * Format a numeric time in format '00:00:00'
		 *
		 * @param {number} time
		 * @param {Boolean} forceHours
		 * @param {Boolean} showFrameCount
		 * @param {number} fps - Frames per second
		 * @return {String}
		 */
		secondsToTimeCode: function (time, forceHours, showFrameCount, fps) {
			//add framecount
			if (showFrameCount === undefined) {
				showFrameCount = false;
			} else if (fps === undefined) {
				fps = 25;
			}

			var hours = Math.floor(time / 3600) % 24,
				minutes = Math.floor(time / 60) % 60,
				seconds = Math.floor(time % 60),
				frames = Math.floor(((time % 1) * fps).toFixed(3)),
				result =
					( (forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '') +
					(minutes < 10 ? '0' + minutes : minutes) + ':' +
					(seconds < 10 ? '0' + seconds : seconds) +
					((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');

			return result;
		},

		/**
		 * Convert a '00:00:00' tiem string into seconds
		 *
		 * @param {String} time
		 * @param {Boolean} forceHours
		 * @param {Boolean} showFrameCount
		 * @param {number} fps - Frames per second
		 * @return {number}
		 */
		timeCodeToSeconds: function (time, forceHours, showFrameCount, fps) {
			if (showFrameCount === undefined) {
				showFrameCount = false;
			} else if (fps === undefined) {
				fps = 25;
			}

			// 00:00:00		HH:MM:SS
			// 00:00 		MM:SS
			// 00			SS

			var parts = time.split(':'),
				hours = 0,
				minutes = 0,
				frames = 0,
				seconds = 0;

			switch (parts.length) {
				default:
				case 1:
					seconds = parseInt(parts[0], 10);
					break;
				case 2:
					minutes = parseInt(parts[0], 10);
					seconds = parseInt(parts[1], 10);

					break;
				case 3:
				case 4:
					hours = parseInt(parts[0], 10);
					minutes = parseInt(parts[1], 10);
					seconds = parseInt(parts[2], 10);
					frames = showFrameCount ? parseInt(parts[3]) / fps : 0;
					break;

			}

			seconds = ( hours * 3600 ) + ( minutes * 60 ) + seconds + frames;

			return seconds;
		},

		/**
		 * Merge the contents of two or more objects together into the first object
		 *
		 * @return {Object}
		 */
		extend: function () {
			// borrowed from ender
			var options, name, src, copy,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;

			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== "object" && typeof target !== "function") {
				target = {};
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				options = arguments[i];
				if (options !== null && options !== undefined) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		/**
		 * Calculate the time format to use
		 *
		 * There is a default format set in the options but it can be incomplete, so it is adjusted according to the media
		 * duration. Format: 'hh:mm:ss:ff'
		 * @param {number} time
		 * @param {Object} options
		 * @param {number} fps - Frames per second
		 */
		calculateTimeFormat: function (time, options, fps) {
			if (time < 0) {
				time = 0;
			}

			if (fps === undefined) {
				fps = 25;
			}

			var format = options.timeFormat,
				firstChar = format[0],
				firstTwoPlaces = (format[1] == format[0]),
				separatorIndex = firstTwoPlaces ? 2 : 1,
				separator = ':',
				hours = Math.floor(time / 3600) % 24,
				minutes = Math.floor(time / 60) % 60,
				seconds = Math.floor(time % 60),
				frames = Math.floor(((time % 1) * fps).toFixed(3)),
				lis = [
					[frames, 'f'],
					[seconds, 's'],
					[minutes, 'm'],
					[hours, 'h']
				];

			// Try to get the separator from the format
			if (format.length < separatorIndex) {
				separator = format[separatorIndex];
			}

			var required = false;

			for (var i = 0, len = lis.length; i < len; i++) {
				if (format.indexOf(lis[i][1]) !== -1) {
					required = true;
				}
				else if (required) {
					var hasNextValue = false;
					for (var j = i; j < len; j++) {
						if (lis[j][0] > 0) {
							hasNextValue = true;
							break;
						}
					}

					if (!hasNextValue) {
						break;
					}

					if (!firstTwoPlaces) {
						format = firstChar + format;
					}
					format = lis[i][1] + separator + format;
					if (firstTwoPlaces) {
						format = lis[i][1] + format;
					}
					firstChar = lis[i][1];
				}
			}
			options.currentTimeFormat = format;
		},

		/**
		 * Convert Society of Motion Picture and Television Engineers (SMTPE) time code into seconds
		 *
		 * @param {String} SMPTE
		 * @return {number}
		 */
		convertSMPTEtoSeconds: function (SMPTE) {
			if (typeof SMPTE !== 'string')
				return false;

			SMPTE = SMPTE.replace(',', '.');

			var secs = 0,
				decimalLen = (SMPTE.indexOf('.') != -1) ? SMPTE.split('.')[1].length : 0,
				multiplier = 1;

			SMPTE = SMPTE.split(':').reverse();

			for (var i = 0; i < SMPTE.length; i++) {
				multiplier = 1;
				if (i > 0) {
					multiplier = Math.pow(60, i);
				}
				secs += Number(SMPTE[i]) * multiplier;
			}
			return Number(secs.toFixed(decimalLen));
		},
		// taken from underscore
		debounce: function (func, wait, immediate) {
			var timeout;
			return function () {
				var context = this, args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		},
		/**
		 * Returns true if targetNode appears after sourceNode in the dom.
		 * @param {HTMLElement} sourceNode - the source node for comparison
		 * @param {HTMLElement} targetNode - the node to compare against sourceNode
		 */
		isNodeAfter: function (sourceNode, targetNode) {
			return !!(
				sourceNode &&
				targetNode &&
				typeof sourceNode.compareDocumentPosition === 'function' &&
				sourceNode.compareDocumentPosition(targetNode) & Node.DOCUMENT_POSITION_PRECEDING
			);
		}
	};

	/**
	 * @class {mejs.MediaFeatures}
	 * @class {mejs.Features}
	 */
	mejs.MediaFeatures = mejs.Features = (function () {

		var features = {},
			nav = win.navigator,
			ua = nav.userAgent.toLowerCase(),
			html5Elements = ['source', 'track', 'audio', 'video'],
			video = null;

		// for IE
		for (var i = 0, il = html5Elements.length; i < il; i++) {
			video = doc.createElement(html5Elements[i]);
		}

		features.isiPad = (ua.match(/ipad/i) !== null);
		features.isiPhone = (ua.match(/iphone/i) !== null);
		features.isiOS = features.isiPhone || features.isiPad;
		features.isAndroid = (ua.match(/android/i) !== null);
		features.isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1 || nav.appName.toLowerCase().match(/trident/gi) !== null);
		features.isChrome = (ua.match(/chrome/gi) !== null);
		features.isFirefox = (ua.match(/firefox/gi) !== null);

		/*
		 Possibly add back in when needed
		 features.isSafari = ua.match(/safari/gi) !== null && !features.isChrome;
		 features.isOpera = (ua.match(/opera/gi) !== null);
		 features.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
		 features.isWebkit = (ua.match(/webkit/gi) !== null);
		 features.isGecko = (ua.match(/gecko/gi) !== null) && !features.isWebkit;

		 */

		// borrowed from Modernizr
		features.hasTouch = ('ontouchstart' in win);
		features.svg = !!doc.createElementNS && !!doc.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

		features.supportsPointerEvents = (function () {
			var
				element = doc.createElement('x'),
				documentElement = doc.documentElement,
				getComputedStyle = win.getComputedStyle,
				supports
				;

			if (!('pointerEvents' in element.style)) {
				return false;
			}

			element.style.pointerEvents = 'auto';
			element.style.pointerEvents = 'x';
			documentElement.appendChild(element);
			supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
			documentElement.removeChild(element);
			return !!supports;
		})();


		// Older versions of Firefox can't move plugins around without it resetting,
		features.hasFirefoxPluginMovingProblem = false;

		// Detect native JavaScript fullscreen (Safari/Firefox only, Chrome still fails)

		// iOS
		features.hasiOSFullScreen = (video.webkitEnterFullscreen !== undefined);

		// W3C
		features.hasNativeFullscreen = (video.requestFullscreen !== undefined);

		// webkit/firefox/IE11+
		features.hasWebkitNativeFullScreen = (video.webkitRequestFullScreen !== undefined);
		features.hasMozNativeFullScreen = (video.mozRequestFullScreen !== undefined);
		features.hasMsNativeFullScreen = (video.msRequestFullscreen !== undefined);

		features.hasTrueNativeFullScreen =
			(features.hasWebkitNativeFullScreen || features.hasMozNativeFullScreen || features.hasMsNativeFullScreen);
		features.nativeFullScreenEnabled = features.hasTrueNativeFullScreen;

		// Enabled?
		if (features.hasMozNativeFullScreen) {
			features.nativeFullScreenEnabled = doc.mozFullScreenEnabled;
		} else if (features.hasMsNativeFullScreen) {
			features.nativeFullScreenEnabled = doc.msFullscreenEnabled;
		}

		if (features.isChrome) {
			features.hasiOSFullScreen = false;
		}

		if (features.hasTrueNativeFullScreen) {

			features.fullScreenEventName = '';
			if (features.hasWebkitNativeFullScreen) {
				features.fullScreenEventName = 'webkitfullscreenchange';

			} else if (features.hasMozNativeFullScreen) {
				features.fullScreenEventName = 'mozfullscreenchange';

			} else if (features.hasMsNativeFullScreen) {
				features.fullScreenEventName = 'MSFullscreenChange';
			}

			features.isFullScreen = function () {
				if (features.hasMozNativeFullScreen) {
					return doc.mozFullScreen;

				} else if (features.hasWebkitNativeFullScreen) {
					return doc.webkitIsFullScreen;

				} else if (features.hasMsNativeFullScreen) {
					return doc.msFullscreenElement !== null;
				}
			};

			features.requestFullScreen = function (el) {

				if (features.hasWebkitNativeFullScreen) {
					el.webkitRequestFullScreen();
				} else if (features.hasMozNativeFullScreen) {
					el.mozRequestFullScreen();
				} else if (features.hasMsNativeFullScreen) {
					el.msRequestFullscreen();
				}
			};

			features.cancelFullScreen = function () {
				if (features.hasWebkitNativeFullScreen) {
					doc.webkitCancelFullScreen();

				} else if (features.hasMozNativeFullScreen) {
					doc.mozCancelFullScreen();

				} else if (features.hasMsNativeFullScreen) {
					doc.msExitFullscreen();

				}
			};
		}

		// OS X 10.5 can't do this even if it says it can :(
		if (features.hasiOSFullScreen && ua.match(/mac os x 10_5/i)) {
			features.hasNativeFullScreen = false;
			features.hasiOSFullScreen = false;
		}

		// Test if Media Source Extensions are supported by browser
		features.hasMse = ('MediaSource' in win);

		features.supportsMediaTag = (video.canPlayType !== undefined || features.hasMse);

		return features;
	})();

})(window, document, window.mejs || {});
/**
 * MediaElement core
 *
 * This file is the foundation to create/render the media.
 */
(function (win, doc, mejs, undefined) {

	"use strict";

	// Basic HTML5 settings
	mejs.html5media = {
		/**
		 * @type {String[]}
		 */
		properties: [
			// GET/SET
			'volume', 'src', 'currentTime', 'muted',

			// GET only
			'duration', 'paused', 'ended',

			// OTHERS
			'error', 'currentSrc', 'networkState', 'preload', 'buffered', 'bufferedBytes', 'bufferedTime', 'readyState', 'seeking',
			'initialTime', 'startOffsetTime', 'defaultPlaybackRate', 'playbackRate', 'played', 'seekable', 'autoplay', 'loop', 'controls'
		],
		/**
		 * @type {String[]}
		 */
		methods: [
			'load', 'play', 'pause', 'canPlayType'
		],
		/**
		 * @type {String[]}
		 */
		events: [
			'loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'pause', 'loadedmetadata',
			'loadeddata', 'waiting', 'playing', 'canplay', 'canplaythrough', 'seeking', 'seeked', 'timeupdate', 'ended',
			'ratechange', 'durationchange', 'volumechange'
		],
		/**
		 * @type {String[]}
		 */
		mediaTypes: [
			'audio/mp3', 'audio/ogg', 'audio/oga', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/mpeg', 'audio/mp4',
			'video/mp4', 'video/webm', 'video/ogg'
		]
	};


	// List of possible renderers (HTML5, Flash, YouTube, Soundcloud, pure JS, etc.)
	mejs.Renderers = {

		/**
		 * Store render(s) data
		 * @type {Object[]}
		 */
		renderers: {},

		/**
		 * List the specific renders to be used; ordered as they are processed
		 *
		 * @type {String[]}
		 */
		order: [],

		/**
		 * Register a new renderer
		 * @param {Object} renderer - An object with all the rendered information (name REQUIRED)
		 */
		add: function (renderer) {
			this.renderers[renderer.name] = renderer;
			this.order.push(renderer.name);
		},

		/**
		 * Loop through renderers available and determine the proper one to use
		 *
		 * The mechanism that will determine if the renderer is the correct one is the `canPlay` method
		 * inside of each renderer file.
		 * @param {Object[]} mediaFiles - A list of source and type obtained from video/audio/source tags: [{src:'',type:''}]
		 * @param {?String[]} renderers - Optional list of pre-selected renderers
		 * @return {?Object}
		 */
		selectRenderer: function (mediaFiles, renderers) {

			var
				t = this,
				i,
				il,
				j,
				jl,
				rendererName,
				renderer
			;

			// First attempt: check if there are matches with specified ones
			if (renderers !== undefined && renderers !== null) {
				for (i = 0, il = renderers.length; i < il; i++) {
					rendererName = renderers[i];
					renderer = t.renderers[rendererName];

					for (j = 0, jl = mediaFiles.length; j < jl; j++) {
						if (renderer.canPlayType(mediaFiles[j].type)) {
							return {
								rendererName: rendererName,
								src: mediaFiles[j].src
							};
						}
					}
				}
			}
			// Second attempt: check matches with all available renderers specified via `mejs.Renderers.order`
			else {
				for (i = 0, il = t.order.length; i < il; i++) {
					rendererName = t.order[i];
					renderer = t.renderers[rendererName];

					for (j = 0, jl = mediaFiles.length; j < jl; j++) {
						if (renderer.canPlayType(mediaFiles[j].type)) {
							 return {
								rendererName: rendererName,
								src: mediaFiles[j].src
							};
						}
					}
				}
			}

			return null;
		}
	};

	// Basic defaults for MediaElement
	mejs.MediaElementOptionsDefaults = {
		/**
		 * List of the renderers to use
		 * @type {String[]}
		 */
		renderers: [],
		/**
		 * Name of MediaElement container
		 * @type {String}
		 */
		fakeNodeName: 'mediaelementwrapper',
		/**
		 * The path where shims are located
		 * @type {String}
		 */
		pluginPath: 'build/'
	};

	/**
	 * Create a fake DOM element with properties that look like a real HTMLMediaElement
	 * with all its methods/properties/events.
	 *
	 * @constructor
	 * @param {{String|HTMLElement}} idOrNode
	 * @param {Object} options
	 * @return {HTMLElement}
	 */
	mejs.MediaElement = function (idOrNode, options) {

		options = mejs.Utils.extend(mejs.MediaElementOptionsDefaults, options);

		// create our node (note: older versions of iOS don't support Object.defineProperty on DOM nodes)
		var mediaElement = doc.createElement(options.fakeNodeName);

		mediaElement.options = options;

		var id = idOrNode;

		if (typeof idOrNode === 'string') {
			mediaElement.originalNode = doc.getElementById(idOrNode);
		} else {
			mediaElement.originalNode = idOrNode;
			id = idOrNode.id;
		}

		id = id || 'mejs_' + Math.random().toString().slice(2);

		if (mediaElement.originalNode !== undefined && mediaElement.originalNode !== null && mediaElement.appendChild) {
			// change id
			mediaElement.originalNode.setAttribute('id', id + '_from_mejs');

			// add next to this one
			mediaElement.originalNode.parentNode.insertBefore(mediaElement, mediaElement.originalNode);

			// insert this one inside
			mediaElement.appendChild(mediaElement.originalNode);
		} else {
			// TODO: where to put the node?
		}

		mediaElement.id = id;

		mediaElement.renderers = {};
		mediaElement.renderer = null;
		mediaElement.rendererName = null;

		// add properties get/set
		var
			props = mejs.html5media.properties,
			i,
			il,
			assignGettersSetters = function(propName) {
				// src is a special one below
				if (propName !== 'src') {

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1),

						getFn = function () {
							//

							if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
								return mediaElement.renderer['get' + capName]();

								//return mediaElement.renderer[propName];
							} else {
								return null;
							}
						},
						setFn = function (value) {
							//

							if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
								mediaElement.renderer['set' + capName](value);

								//mediaElement.renderer[propName] = value;
							}
						};

					mejs.Utils.addProperty(mediaElement, propName, getFn, setFn);

					mediaElement['get' + capName] = getFn;
					mediaElement['set' + capName] = setFn;
				}
			};
		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// special .src property
		var getSrc = function () {

				if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
					return mediaElement.renderer.getSrc();
				} else {
					return null;
				}
			},
			setSrc = function (value) {

				var renderInfo,
					mediaFiles = [];

				// clean up URLs
				if (typeof value === 'string') {
					mediaFiles.push({
						src: value,
						type: mejs.Utils.getTypeFromFile(value)
					});
				} else {
					for (i = 0, il = value.length; i < il; i++) {

						var src = mejs.Utils.absolutizeUrl(value[i].src),
							type = value[i].type;

						mediaFiles.push({
							src: src,
							type: (type === '' || type === null || type === undefined) ? mejs.Utils.getTypeFromFile(src) : type
						});

					}
				}

				//

				// find a renderer and URL match
				renderInfo = mejs.Renderers.selectRenderer(mediaFiles,
					(options.renderers.length ? options.renderers : null));

				//
				var event;

				// did we find a renderer?
				if (renderInfo === null) {
					event = doc.createEvent("HTMLEvents");
					event.initEvent('error', false, false);
					event.message = 'No renderer found';
					mediaElement.dispatchEvent(event);
					return;
				}

				// turn on the renderer (this checks for the existing renderer already)
				mediaElement.changeRenderer(renderInfo.rendererName, mediaFiles);

				if (mediaElement.renderer === undefined || mediaElement.renderer === null) {
					event = doc.createEvent("HTMLEvents");
					event.initEvent('error', false, false);
					event.message = 'Error creating renderer';
					mediaElement.dispatchEvent(event);
				}
			};

		mejs.Utils.addProperty(mediaElement, 'src', getSrc, setSrc);
		mediaElement.getSrc = getSrc;
		mediaElement.setSrc = setSrc;

		// add methods
		var
			methods = mejs.html5media.methods,
			assignMethods = function (methodName) {
				// run the method on the current renderer
				mediaElement[methodName] = function () {
					
					if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
						return mediaElement.renderer[methodName](arguments);
					} else {
						return null;
					}
				};

			}
		;
		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// IE && iOS
		if (!mediaElement.addEventListener) {

			mediaElement.events = {};

			// start: fake events
			mediaElement.addEventListener = function (eventName, callback) {
				// create or find the array of callbacks for this eventName
				mediaElement.events[eventName] = mediaElement.events[eventName] || [];

				// push the callback into the stack
				mediaElement.events[eventName].push(callback);
			};
			mediaElement.removeEventListener = function (eventName, callback) {
				// no eventName means remove all listeners
				if (!eventName) {
					mediaElement.events = {};
					return true;
				}

				// see if we have any callbacks for this eventName
				var callbacks = mediaElement.events[eventName];
				if (!callbacks) {
					return true;
				}

				// check for a specific callback
				if (!callback) {
					mediaElement.events[eventName] = [];
					return true;
				}

				// remove the specific callback
				for (var i = 0, il = callbacks.length; i < il; i++) {
					if (callbacks[i] === callback) {
						mediaElement.events[eventName].splice(i, 1);
						return true;
					}
				}
				return false;
			};

			/**
			 *
			 * @param {Event} event
			 */
			mediaElement.dispatchEvent = function (event) {

				var i,
					//args,
					callbacks = mediaElement.events[event.type];

				//

				if (callbacks) {
					//args = Array.prototype.slice.call(arguments, 1);
					for (i = 0, il = callbacks.length; i < il; i++) {

						//

						callbacks[i].apply(null, [event]);
					}
				}
			};
		}

		/**
		 * Determine whether the renderer was found or not
		 *
		 * @param {String} rendererName
		 * @param {Object[]} mediaFiles
		 * @return {Boolean}
		 */
		mediaElement.changeRenderer = function (rendererName, mediaFiles) {

			// check for a match on the current renderer
			if (mediaElement.renderer !== undefined && mediaElement.renderer !== null && mediaElement.renderer.name === rendererName) {

				

				mediaElement.renderer.show();
				mediaElement.renderer.setSrc(mediaFiles[0].src);

				return true;
			}

			// if existing renderer is not the right one, then hide it
			if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {

				

				mediaElement.renderer.pause();
				if (mediaElement.renderer.stop) {
					mediaElement.renderer.stop();
				}
				mediaElement.renderer.hide();
			}

			// see if we have the renderer already created
			var newRenderer = mediaElement.renderers[rendererName],
				newRendererType = null;

			if (newRenderer !== undefined && newRenderer !== null) {
				

				newRenderer.show();

				newRenderer.setSrc(mediaFiles[0].src);

				mediaElement.renderer = newRenderer;
				return true;
			}

			var rendererArray = mediaElement.options.renderers.length > 0 ? mediaElement.options.renderers : mejs.Renderers.order;

			// find the desired renderer in the array of possible ones
			for (var index in rendererArray) {

				if (rendererArray[index] === rendererName) {

					// create the renderer
					newRendererType = mejs.Renderers.renderers[rendererArray[index]];

					var renderOptions = mejs.Utils.extend({}, mediaElement.options, newRendererType.options);
					newRenderer = new newRendererType.create(mediaElement, renderOptions, mediaFiles);
					newRenderer.name = rendererName;

					//

					// store for later
					mediaElement.renderers[newRendererType.name] = newRenderer;
					mediaElement.renderer = newRenderer;
					mediaElement.rendererName = rendererName;
					newRenderer.show();


					return true;
				}
			}

			

			return false;
		};

		/**
		 * Set the element dimensions based on selected renderer's setSize method
		 *
		 * @param {number} width
		 * @param {number} height
		 */
		mediaElement.setSize = function (width, height) {
			if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
				mediaElement.renderer.setSize(width, height);
			}
		};

		// find <source> elements
		if (mediaElement.originalNode !== null) {
			var mediaFiles = [];

			switch (mediaElement.originalNode.nodeName.toLowerCase()) {

				case 'iframe':
					mediaFiles.push({type: '', src: mediaElement.originalNode.getAttribute('src')});

					break;

				case 'audio':
				case 'video':
					var
						n,
						src,
						type,
						sources = mediaElement.originalNode.childNodes.length,
						nodeSource = mediaElement.originalNode.getAttribute('src')
						;

					// Consider if node contains the `src` and `type` attributes
					if (nodeSource) {
						mediaFiles.push({
							type: mejs.Utility.getTypeFromFile(nodeSource) || '',
							src: nodeSource
						});
					}

					// test <source> types to see if they are usable
					for (i = 0; i < sources; i++) {
						n = mediaElement.originalNode.childNodes[i];
						if (n.nodeType == 1 && n.tagName.toLowerCase() === 'source') {
							src = n.getAttribute('src');
							type = mejs.Utils.formatType(src, n.getAttribute('type'));

							mediaFiles.push({type: type, src: src});
						}
					}
					break;
			}

			if (mediaFiles.length > 0) {
				

				// set src
				mediaElement.src = mediaFiles;
			}
		}

		// TEMP
		//mediaElement.load();

		if (options.success) {
			options.success(mediaElement, mediaElement.originalNode);
		}

		// if (options.error) {
		// 	options.error(mediaElement, mediaElement.originalNode);
		// }

		return mediaElement;
	};

	/**
	 * Export MediaElement variable globally
	 * @type {MediaElement}
	 */
	window.MediaElement = mejs.MediaElement;

})(window, document, window.mejs || {});
/**
 * Native HTML5 Renderer
 *
 * Wraps the native HTML5 <audio> or <video> tag and bubbles its properties, events, and methods up to the mediaElement.
 */
(function (win, doc, mejs, undefined) {

	var HtmlMediaElement = {

		name: 'html5',

		options: {
			prefix: 'html5'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {String}
		 */
		canPlayType: function (type) {

			var mediaElement = doc.createElement('video');

			if (mediaElement.canPlayType) {
				return mediaElement.canPlayType(type).replace(/no/, '');
			} else {
				return '';
			}
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var node = null,
				id = mediaElement.id + '_html5';

			// CREATE NODE
			if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {

				node = document.createElement('audio');
				mediaElement.appendChild(node);

			} else {
				node = mediaElement.originalNode;
			}

			node.setAttribute('id', id);

			// WRAPPERS for PROPs
			var
				props = mejs.html5media.properties,
				i,
				il,
				assignGettersSetters = function (propName) {
					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					node['get' + capName] = function () {
						return node[propName];
					};

					node['set' + capName] = function (value) {
						node[propName] = value;
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			var
				events = mejs.html5media.events,
				assignEvents = function (eventName) {

					node.addEventListener(eventName, function (e) {
						// copy event

						var event = doc.createEvent('HTMLEvents');
						event.initEvent(e.type, e.bubbles, e.cancelable);
						event.srcElement = e.srcElement;
						event.target = e.srcElement;

						//var ev = mejs.Utils.extend({}, e);

						mediaElement.dispatchEvent(event);
					});

				}
			;
			events = events.concat(['click', 'mouseover', 'mouseout']);

			for (i = 0, il = events.length; i < il; i++) {
				assignEvents(events[i]);
			}

			// HELPER METHODS
			node.setSize = function (width, height) {
				node.style.width = width + 'px';
				node.style.height = height + 'px';

				return node;
			};

			node.hide = function () {
				node.style.display = 'none';

				return node;
			};

			node.show = function () {
				node.style.display = '';

				return node;
			};

			if (mediaFiles && mediaFiles.length > 0) {
				for (i = 0, il = mediaFiles.length; i < il; i++) {
					if (mejs.Renderers.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
						node.src = mediaFiles[i].src;
						break;
					}
				}
			}

			var event = mejs.Utils.createEvent('rendererready', node);
			mediaElement.dispatchEvent(event);

			return node;
		}
	};

	mejs.Renderers.add(HtmlMediaElement);

	window.HtmlMediaElement = mejs.HtmlMediaElement = HtmlMediaElement;

})(window, document, window.mejs || {});
/**
 * Native HLS renderer
 *
 * Uses DailyMotion's hls.js, which is a JavaScript library which implements an HTTP Live Streaming client.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with m3u8 files the same way Flash version of Hls does.
 * @see https://github.com/dailymotion/hls.js
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register Native HLS type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('m3u8') > -1) {
			return 'application/x-mpegURL';
		} else {
			return null;
		}
	});

	var NativeHls = {
		/**
		 * @type {Boolean}
		 */
		isMediaStarted: false,
		/**
		 * @type {Boolean}
		 */
		isMediaLoaded: false,
		/**
		 * @type {Array}
		 */
		creationQueue: [],

		/**
		 * Create a queue to prepare the loading of an HLS source
		 * @param {Object} settings - an object with settings needed to load an HLS player instance
		 */
		prepareSettings: function (settings) {
			if (this.isLoaded) {
				this.createInstance(settings);
			} else {
				this.loadScript();
				this.creationQueue.push(settings);
			}
		},

		/**
		 * Load hls.js script on the header of the document
		 *
		 */
		loadScript: function () {
			if (!this.isMediaStarted) {

				var
					script = doc.createElement('script'),
					firstScriptTag = doc.getElementsByTagName('script')[0],
					done = false;

				script.src = 'https://cdn.jsdelivr.net/hls.js/latest/hls.min.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === undefined ||
						this.readyState === 'loaded' || this.readyState === 'complete')) {
						done = true;
						NativeHls.mediaReady();
						script.onload = script.onreadystatechange = null;
					}
				};

				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				this.isMediaStarted = true;
			}
		},

		/**
		 * Process queue of HLS player creation
		 *
		 */
		mediaReady: function () {
			this.isLoaded = true;
			this.isMediaLoaded = true;

			while (this.creationQueue.length > 0) {
				var settings = this.creationQueue.pop();
				this.createInstance(settings);
			}
		},

		/**
		 * Create a new instance of HLS player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to instantiate HLS object
		 */
		createInstance: function (settings) {
			var player = new Hls(settings.options);
			win['__ready__' + settings.id](player);
		}
	};

	var HlsNativeRenderer = {
		name: 'native_hls',

		options: {
			prefix: 'native_hls',
			/**
			 * Custom configuration for HLS player
			 *
			 * @see https://github.com/dailymotion/hls.js/blob/master/API.md#user-content-fine-tuning
			 * @type {Object}
			 */
			hls: {
				autoStartLoad: true,
				startPosition: -1,
				capLevelToPlayerSize: false,
				debug: false,
				maxBufferLength: 30,
				maxMaxBufferLength: 600,
				maxBufferSize: 60 * 1000 * 1000,
				maxBufferHole: 0.5,
				maxSeekHole: 2,
				seekHoleNudgeDuration: 0.01,
				maxFragLookUpTolerance: 0.2,
				liveSyncDurationCount: 3,
				liveMaxLatencyDurationCount: 10,
				enableWorker: true,
				enableSoftwareAES: true,
				manifestLoadingTimeOut: 10000,
				manifestLoadingMaxRetry: 6,
				manifestLoadingRetryDelay: 500,
				manifestLoadingMaxRetryTimeout: 64000,
				levelLoadingTimeOut: 10000,
				levelLoadingMaxRetry: 6,
				levelLoadingRetryDelay: 500,
				levelLoadingMaxRetryTimeout: 64000,
				fragLoadingTimeOut: 20000,
				fragLoadingMaxRetry: 6,
				fragLoadingRetryDelay: 500,
				fragLoadingMaxRetryTimeout: 64000,
				startFragPrefech: false,
				appendErrorMaxRetry: 3,
				enableCEA708Captions: true,
				stretchShortVideoTrack: true,
				forceKeyFrameOnDiscontinuity: true,
				abrEwmaFastLive: 5.0,
				abrEwmaSlowLive: 9.0,
				abrEwmaFastVoD: 4.0,
				abrEwmaSlowVoD: 15.0,
				abrEwmaDefaultEstimate: 500000,
				abrBandWidthFactor: 0.8,
				abrBandWidthUpFactor: 0.7
			}
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {

			var mediaTypes = ['application/x-mpegURL', 'application/x-mpegurl', 'vnd.apple.mpegURL',
				'audio/mpegURL', 'audio/hls', 'video/hls'];
			return mejs.MediaFeatures.hasMse && mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var
				node = null,
				originalNode = mediaElement.originalNode,
				i,
				il,
				id = mediaElement.id + '_' + options.prefix,
				hlsPlayer,
				stack = {}
				;

			node = originalNode.cloneNode(true);
			options = mejs.Utils.extend(options, mediaElement.options);

			// WRAPPERS for PROPs
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {
					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					node['get' + capName] = function () {
						if (hlsPlayer !== null) {
							return node[propName];
						} else {
							return null;
						}
					};

					node['set' + capName] = function (value) {
						if (hlsPlayer !== null) {
							node[propName] = value;

							if (propName === 'src') {

								hlsPlayer.detachMedia();
								hlsPlayer.attachMedia(node);

								hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function () {
									hlsPlayer.loadSource(value);
								});
							}
						} else {
							// store for after "READY" event fires
							stack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// Initial method to register all HLS events
			win['__ready__' + id] = function (_hlsPlayer) {

				mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;

				

				// do call stack
				for (i = 0, il = stack.length; i < il; i++) {

					var stackItem = stack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						node['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						node[stackItem.methodName]();
					}
				}

				// BUBBLE EVENTS
				var
					events = mejs.html5media.events, hlsEvents = Hls.Events,
					assignEvents = function (eventName) {

						if (eventName === 'loadedmetadata') {

							hlsPlayer.detachMedia();

							var url = node.src;

							hlsPlayer.attachMedia(node);
							hlsPlayer.on(hlsEvents.MEDIA_ATTACHED, function () {
								hlsPlayer.loadSource(url);
							});
						}

						node.addEventListener(eventName, function (e) {
							// copy event
							var event = doc.createEvent('HTMLEvents');
							event.initEvent(e.type, e.bubbles, e.cancelable);
							event.srcElement = e.srcElement;
							event.target = e.srcElement;

							mediaElement.dispatchEvent(event);
						});

					}
				;

				events = events.concat(['click', 'mouseover', 'mouseout']);

				for (i = 0, il = events.length; i < il; i++) {
					assignEvents(events[i]);
				}

				/**
				 * Custom HLS events
				 *
				 * These events can be attached to the original node using addEventListener and the name of the event,
				 * not using Hls.Events object
				 * @see https://github.com/dailymotion/hls.js/blob/master/src/events.js
				 * @see https://github.com/dailymotion/hls.js/blob/master/src/errors.js
				 * @see https://github.com/dailymotion/hls.js/blob/master/API.md#runtime-events
				 * @see https://github.com/dailymotion/hls.js/blob/master/API.md#errors
				 */
				var assignHlsEvents = function (e, data) {
					var event = mejs.Utils.createEvent(e, node);
					mediaElement.dispatchEvent(event);

					if (e === 'ERROR') {

						// Destroy instance of player if unknown error found
						if (data.fatal && e === Hls.ErrorTypes.OTHER_ERROR) {
							hlsPlayer.destroy();
						}

						console.error(e, data);
					}
				};

				for (var eventType in hlsEvents) {
					if (hlsEvents.hasOwnProperty(eventType)) {
						hlsPlayer.on(hlsEvents[eventType], assignHlsEvents);
					}
				}
			};

			var filteredAttributes = ['id', 'src', 'style'];
			for (var j = 0, total = originalNode.attributes.length; j < total; j++) {
				var attribute = originalNode.attributes[j];
				if (attribute.specified && filteredAttributes.indexOf(attribute.name) === -1) {
					node.setAttribute(attribute.name, attribute.value);
				}
			}

			node.setAttribute('id', id);
			if (mediaFiles && mediaFiles.length > 0) {
				for (i = 0, il = mediaFiles.length; i < il; i++) {
					if (mejs.Renderers.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
						node.setAttribute('src', mediaFiles[i].src);
						break;
					}
				}
			}
			node.className = '';

			originalNode.parentNode.insertBefore(node, originalNode);
			originalNode.removeAttribute('autoplay');
			originalNode.style.display = 'none';

			NativeHls.prepareSettings({
				options: options.hls,
				id: id
			});

			// HELPER METHODS
			node.setSize = function (width, height) {
				node.style.width = width + 'px';
				node.style.height = height + 'px';

				return node;
			};

			node.hide = function () {
				node.pause();
				node.style.display = 'none';
				return node;
			};

			node.show = function () {
				node.style.display = '';
				return node;
			};

			node.destroy = function () {
				hlsPlayer.destroy();
			};

			var event = mejs.Utils.createEvent('rendererready', node);
			mediaElement.dispatchEvent(event);

			return node;
		}
	};

	mejs.Renderers.add(HlsNativeRenderer);

})(window, document, window.mejs || {});
/**
 * Native M-Dash renderer
 *
 * Uses dash.js, a reference client implementation for the playback of MPEG DASH via Javascript and compliant browsers.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with mpd files.
 * @see https://github.com/Dash-Industry-Forum/dash.js
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register Native M(PEG)-Dash type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('mpd') > -1) {
			return 'application/dash+xml';
		} else {
			return null;
		}
	});

	var NativeDash = {
		/**
		 * @type {Boolean}
		 */
		isMediaLoaded: false,
		/**
		 * @type {Array}
		 */
		creationQueue: [],

		/**
		 * Create a queue to prepare the loading of an HLS source
		 * @param {Object} settings - an object with settings needed to load an HLS player instance
		 */
		prepareSettings: function (settings) {
			if (this.isLoaded) {
				this.createInstance(settings);
			} else {
				this.loadScript();
				this.creationQueue.push(settings);
			}
		},

		/**
		 * Load dash.all.min.js script on the header of the document
		 *
		 */
		loadScript: function () {
			if (!this.isScriptLoaded) {

				var
					script = doc.createElement('script'),
					firstScriptTag = doc.getElementsByTagName('script')[0],
					done = false;

				script.src = 'https://cdn.dashjs.org/latest/dash.all.min.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === undefined ||
						this.readyState === 'loaded' || this.readyState === 'complete')) {
						done = true;
						NativeDash.mediaReady();
						script.onload = script.onreadystatechange = null;
					}
				};

				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				this.isScriptLoaded = true;
			}
		},

		/**
		 * Process queue of Dash player creation
		 *
		 */
		mediaReady: function () {

			this.isLoaded = true;
			this.isScriptLoaded = true;

			while (this.creationQueue.length > 0) {
				var settings = this.creationQueue.pop();
				this.createInstance(settings);
			}
		},

		/**
		 * Create a new instance of Dash player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to instantiate HLS object
		 */
		createInstance: function (settings) {

			var player = dashjs.MediaPlayer().create();
			win['__ready__' + settings.id](player);
		}
	};

	var DashNativeRenderer = {
		name: 'native_mdash',

		options: {
			prefix: 'native_mdash',
			dash: {}
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {

			var mediaTypes = ['application/dash+xml'];
			return mejs.MediaFeatures.hasMse && mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var
				node = null,
				originalNode = mediaElement.originalNode,
				i,
				il,
				id = mediaElement.id + '_' + options.prefix,
				dashPlayer,
				stack = {}
				;

			node = originalNode.cloneNode(true);

			// WRAPPERS for PROPs
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {
					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					node['get' + capName] = function () {
						if (dashPlayer !== null) {
							return node[propName];
						} else {
							return null;
						}
					};

					node['set' + capName] = function (value) {
						if (dashPlayer !== null) {
							if (propName === 'src') {

								dashPlayer.attachSource(value);

								if (node.getAttribute('autoplay')) {
									node.play();
								}
							}

							node[propName] = value;
						} else {
							// store for after "READY" event fires
							stack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// Initial method to register all M-Dash events
			win['__ready__' + id] = function (_dashPlayer) {

				mediaElement.dashPlayer = dashPlayer = _dashPlayer;

				// By default, console log is off
				dashPlayer.getDebug().setLogToBrowserConsole(false);


				

				// do call stack
				for (i = 0, il = stack.length; i < il; i++) {

					var stackItem = stack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						node['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						node[stackItem.methodName]();
					}
				}

				// BUBBLE EVENTS
				var
					events = mejs.html5media.events, dashEvents = dashjs.MediaPlayer.events,
					assignEvents = function (eventName) {

						if (eventName === 'loadedmetadata') {
							dashPlayer.initialize(node, node.src, false);
						}

						node.addEventListener(eventName, function (e) {
							// copy event

							var event = doc.createEvent('HTMLEvents');
							event.initEvent(e.type, e.bubbles, e.cancelable);
							event.srcElement = e.srcElement;
							event.target = e.srcElement;

							mediaElement.dispatchEvent(event);
						});

					}
				;

				events = events.concat(['click', 'mouseover', 'mouseout']);

				for (i = 0, il = events.length; i < il; i++) {
					assignEvents(events[i]);
				}

				/**
				 * Custom M(PEG)-DASH events
				 *
				 * These events can be attached to the original node using addEventListener and the name of the event,
				 * not using dashjs.MediaPlayer.events object
				 * @see http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html
				 */
				var assignMdashEvents = function (e, data) {
					var event = mejs.Utils.createEvent(e, node);
					mediaElement.dispatchEvent(event);

					if (e === 'error') {
						console.error(e, data);
					}
				};
				for (var eventType in dashEvents) {
					if (dashEvents.hasOwnProperty(eventType)) {
						dashPlayer.on(dashEvents[eventType], assignMdashEvents);
					}
				}
			};

			var filteredAttributes = ['id', 'src', 'style'];
			for (var j = 0, total = originalNode.attributes.length; j < total; j++) {
				var attribute = originalNode.attributes[j];
				if (attribute.specified && filteredAttributes.indexOf(attribute.name) === -1) {
					node.setAttribute(attribute.name, attribute.value);
				}
			}

			node.setAttribute('id', id);

			if (mediaFiles && mediaFiles.length > 0) {
				for (i = 0, il = mediaFiles.length; i < il; i++) {
					if (mejs.Renderers.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
						node.setAttribute('src', mediaFiles[i].src);
						break;
					}
				}
			}

			node.className = '';

			originalNode.parentNode.insertBefore(node, originalNode);
			originalNode.removeAttribute('autoplay');
			originalNode.style.display = 'none';

			NativeDash.prepareSettings({
				options: options.dash,
				id: id
			});

			// HELPER METHODS
			node.setSize = function (width, height) {
				node.style.width = width + 'px';
				node.style.height = height + 'px';

				return node;
			};

			node.hide = function () {
				node.pause();
				node.style.display = 'none';
				return node;
			};

			node.show = function () {
				node.style.display = '';
				return node;
			};

			var event = mejs.Utils.createEvent('rendererready', node);
			mediaElement.dispatchEvent(event);

			return node;
		}
	};

	mejs.Renderers.add(DashNativeRenderer);

})(window, document, window.mejs || {});
/**
 * YouTube renderer
 *
 * Uses <iframe> approach and uses YouTube API to manipulate it.
 * Note: IE6-7 don't have postMessage so don't support <iframe> API, and IE8 doesn't fire the onReady event,
 * so it doesn't work - not sure if Google problem or not.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register YouTube type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('youtube') > -1 || url.indexOf('youtu.be') > -1) {
			return 'video/youtube';
		} else {
			return null;
		}
	});

	var YouTubeApi = {
		/**
		 * @type {Boolean}
		 */
		isIframeStarted: false,
		/**
		 * @type {Boolean}
		 */
		isIframeLoaded: false,
		/**
		 * @type {Array}
		 */
		iframeQueue: [],

		/**
		 * Create a queue to prepare the creation of <iframe>
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load YouTube API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isIframeStarted) {
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/player_api';
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				this.isIframeStarted = true;
			}
		},

		/**
		 * Process queue of YouTube <iframe> element creation
		 *
		 */
		iFrameReady: function () {

			this.isLoaded = true;
			this.isIframeLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of YouTube API player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {

			

			return new YT.Player(settings.containerId, settings);
		},

		/**
		 * Extract ID from YouTube's URL to be loaded through API
		 * Valid URL format(s):
		 * - http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
		 * - http://www.youtube.com/v/VIDEO_ID?version=3
		 * - http://youtu.be/Djd6tPrxc08
		 *
		 * @param {String} url
		 * @return {string}
		 */
		getYouTubeId: function (url) {

			var youTubeId = "";

			if (url.indexOf('?') > 0) {
				// assuming: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
				youTubeId = YouTubeApi.getYouTubeIdFromParam(url);

				// if it's http://www.youtube.com/v/VIDEO_ID?version=3
				if (youTubeId === '') {
					youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
				}
			} else {
				youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
			}

			return youTubeId;
		},

		/**
		 * Get ID from URL with format: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
		 *
		 * @param {String} url
		 * @returns {string}
		 */
		getYouTubeIdFromParam: function (url) {

			var youTubeId = '',
				parts = url.split('?'),
				parameters = parts[1].split('&');

			for (var i = 0, il = parameters.length; i < il; i++) {
				var paramParts = parameters[i].split('=');
				if (paramParts[0] === 'v') {
					youTubeId = paramParts[1];
					break;
				}
			}

			return youTubeId;
		},

		/**
		 * Get ID from URL with formats
		 *  - http://www.youtube.com/v/VIDEO_ID?version=3
		 *  - http://youtu.be/Djd6tPrxc08
		 * @param {String} url
		 * @return {?String}
		 */
		getYouTubeIdFromUrl: function (url) {

			if (url === undefined || url === null) {
				return null;
			}

			var parts = url.split('?');

			url = parts[0];

			return url.substring(url.lastIndexOf('/') + 1);
		}
	};

	/*
	 * Register YouTube API event globally
	 *
	 */
	win.onYouTubePlayerAPIReady = function () {
		
		YouTubeApi.iFrameReady();
	};

	var YouTubeIframeRenderer = {
		name: 'youtube_iframe',

		options: {
			prefix: 'youtube_iframe'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/youtube', 'video/x-youtube'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			// exposed object
			var youtube = {};
			youtube.options = options;
			youtube.id = mediaElement.id + '_' + options.prefix;
			youtube.mediaElement = mediaElement;

			// API objects
			var apiStack = [],
				youTubeApi = null,
				youTubeApiReady = false,
				paused = true,
				ended = false,
				youTubeIframe = null,
				i,
				il;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					youtube['get' + capName] = function () {
						if (youTubeApi !== null) {
							var value = null;

							// figure out how to get youtube dta here
							switch (propName) {
								case 'currentTime':
									return youTubeApi.getCurrentTime();

								case 'duration':
									return youTubeApi.getDuration();

								case 'volume':
									return youTubeApi.getVolume();

								case 'paused':
									

									return paused;

								case 'ended':
									return ended;

								case 'muted':
									return youTubeApi.isMuted(); // ?

								case 'buffered':
									var percentLoaded = youTubeApi.getVideoLoadedFraction(),
										duration = youTubeApi.getDuration();
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return percentLoaded * duration;
										},
										length: 1
									};
								case 'src':
									return youTubeApi.getVideoUrl();
							}

							return value;
						} else {
							return null;
						}
					};

					youtube['set' + capName] = function (value) {
						//

						if (youTubeApi !== null) {

							// do something
							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src,
										videoId = YouTubeApi.getYouTubeId(url);

									if (mediaElement.getAttribute('autoplay')) {
										youTubeApi.loadVideoById(videoId);
									} else {
										youTubeApi.cueVideoById(videoId);
									}
									break;

								case 'currentTime':
									youTubeApi.seekTo(value);
									break;

								case 'muted':
									if (value) {
										youTubeApi.mute(); // ?
									} else {
										youTubeApi.unMute(); // ?
									}
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', youtube);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								case 'volume':
									youTubeApi.setVolume(value);
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', youtube);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								default:
									
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add wrappers for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the native HTMLMediaElement
					youtube[methodName] = function () {
						

						if (youTubeApi !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return youTubeApi.playVideo();
								case 'pause':
									return youTubeApi.pauseVideo();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// CREATE YouTube
			var youtubeContainer = doc.createElement('div');
			youtubeContainer.id = youtube.id;
			mediaElement.originalNode.parentNode.insertBefore(youtubeContainer, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			var
				height = mediaElement.originalNode.height,
				width = mediaElement.originalNode.width,
				videoId = YouTubeApi.getYouTubeId(mediaFiles[0].src),
				youtubeSettings = {
					id: youtube.id,
					containerId: youtubeContainer.id,
					videoId: videoId,
					height: height,
					width: width,
					playerVars: {
						controls: 0,
						rel: 0,
						disablekb: 1,
						showinfo: 0,
						modestbranding: 0,
						html5: 1,
						playsinline: 1
					},
					origin: win.location.host,
					events: {
						onReady: function (e) {

							youTubeApiReady = true;
							mediaElement.youTubeApi = youTubeApi = e.target;
							mediaElement.youTubeState = youTubeState = {
								paused: true,
								ended: false
							};

							// do call stack
							for (i = 0, il = apiStack.length; i < il; i++) {

								var stackItem = apiStack[i];

								

								if (stackItem.type === 'set') {
									var propName = stackItem.propName,
										capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

									youtube['set' + capName](stackItem.value);
								} else if (stackItem.type === 'call') {
									youtube[stackItem.methodName]();
								}
							}

							// a few more events
							youTubeIframe = youTubeApi.getIframe();

							

							var
								events = ['mouseover', 'mouseout'],
								assignEvents = function (e) {

									

									var event = mejs.Utils.createEvent(e.type, youtube);

									mediaElement.dispatchEvent(event);
								}
							;

							for (var j in events) {
								var eventName = events[j];
								mejs.addEvent(youTubeIframe, eventName, assignEvents);
							}

							// send init events
							var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

							for (i = 0, il = initEvents.length; i < il; i++) {
								var event = mejs.Utils.createEvent(initEvents[i], youtube);
								mediaElement.dispatchEvent(event);
							}
						},
						onStateChange: function (e) {

							// translate events
							var events = [];

							switch (e.data) {
								case -1: // not started
									events = ['loadedmetadata'];
									paused = true;
									ended = false;
									break;

								case 0: // YT.PlayerState.ENDED
									events = ['ended'];
									paused = false;
									ended = true;

									youtube.stopInterval();
									break;

								case 1:	// YT.PlayerState.PLAYING
									events = ['play', 'playing'];
									paused = false;
									ended = false;

									youtube.startInterval();

									break;

								case 2: // YT.PlayerState.PAUSED
									events = ['pause'];
									paused = true;
									ended = false;

									youtube.stopInterval();
									break;

								case 3: // YT.PlayerState.BUFFERING
									events = ['progress'];
									paused = false;
									ended = false;

									break;
								case 5: // YT.PlayerState.CUED
									events = ['loadeddata', 'loadedmetadata', 'canplay'];
									paused = true;
									ended = false;

									break;
							}

							// send events up
							for (var i = 0, il = events.length; i < il; i++) {
								var event = mejs.Utils.createEvent(events[i], youtube);
								mediaElement.dispatchEvent(event);
							}

						}
					}
				};

			// send it off for async loading and creation
			YouTubeApi.enqueueIframe(youtubeSettings);

			youtube.onEvent = function (eventName, player, _youTubeState) {
				
				if (_youTubeState !== null && _youTubeState !== undefined) {
					mediaElement.youTubeState = youTubeState = _youTubeState;
				}

			};

			youtube.setSize = function (width, height) {
				youTubeApi.setSize(width, height);
			};
			youtube.hide = function () {
				youtube.stopInterval();
				youtube.pause();
				if (youTubeIframe) {
					youTubeIframe.style.display = 'none';
				}
			};
			youtube.show = function () {
				if (youTubeIframe) {
					youTubeIframe.style.display = '';
				}
			};
			youtube.destroy = function () {
				youTubeApi.destroy();
			};
			youtube.interval = null;

			youtube.startInterval = function () {
				// create timer
				youtube.interval = setInterval(function () {

					var event = mejs.Utils.createEvent('timeupdate', youtube);
					mediaElement.dispatchEvent(event);

				}, 250);
			};
			youtube.stopInterval = function () {
				if (youtube.interval) {
					clearInterval(youtube.interval);
				}
			};

			return youtube;
		}
	};

	if (window.postMessage && typeof window.addEventListener) {
		mejs.Renderers.add(YouTubeIframeRenderer);
	}

})(window, document, window.mejs || {});
/**
 * Vimeo renderer
 *
 * Uses <iframe> approach and uses Vimeo API to manipulate it.
 * All Vimeo calls return a Promise so this renderer accounts for that
 * to update all the necessary values to interact with MediaElement player.
 * Note: IE8 implements ECMAScript 3 that does not allow bare keywords in dot notation;
 * that's why instead of using .catch ['catch'] is being used.
 * @see https://github.com/vimeo/player.js
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register Vimeo type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('vimeo') > -1) {
			return 'video/vimeo';
		} else {
			return null;
		}
	});

	var vimeoApi = {

		/**
		 * @type {Boolean}
		 */
		isIframeStarted: false,
		/**
		 * @type {Boolean}
		 */
		isIframeLoaded: false,
		/**
		 * @type {Array}
		 */
		iframeQueue: [],

		/**
		 * Create a queue to prepare the creation of <iframe>
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load Vimeo API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {

			if (!this.isIframeStarted) {

				var
					script = doc.createElement('script'),
					firstScriptTag = doc.getElementsByTagName('script')[0],
					done = false;

				script.src = 'https://player.vimeo.com/api/player.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === undefined ||
						this.readyState === "loaded" || this.readyState === "complete")) {
						done = true;
						vimeoApi.iFrameReady();
						script.onload = script.onreadystatechange = null;
					}
				};
				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				this.isIframeStarted = true;
			}
		},

		/**
		 * Process queue of Vimeo <iframe> element creation
		 *
		 */
		iFrameReady: function () {

			this.isLoaded = true;
			this.isIframeLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of Vimeo API player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {
			var player = new Vimeo.Player(settings.iframe);
			win['__ready__' + settings.id](player);
		},

		/**
		 * Extract numeric value from Vimeo to be loaded through API
		 * Valid URL format(s):
		 *  - https://player.vimeo.com/video/59777392
		 *
		 * @param {String} url - Vimeo full URL to grab the number Id of the source
		 * @return {int}
		 */
		getVimeoId: function (url) {
			if (url === undefined || url === null) {
				return null;
			}

			var parts = url.split('?');

			url = parts[0];

			return parseInt(url.substring(url.lastIndexOf('/') + 1));
		},

		/**
		 * Generate custom errors for Vimeo based on the API specifications
		 *
		 * @see https://github.com/vimeo/player.js#error
		 * @param {Object} error
		 */
		errorHandler: function (error) {
			switch (error.name) {
				case 'TypeError':
					// the id was not a number
					break;

				case 'PasswordError':
					// the video is password-protected and the viewer needs to enter the
					// password first
					break;

				case 'PrivacyError':
					// the video is password-protected or private
					break;

				case 'RangeError':
					// the time was less than 0 or greater than the video’s duration
					break;

				case 'InvalidTrackLanguageError':
					// no track was available with the specified language
					break;

				case 'InvalidTrackError':
					// no track was available with the specified language and kind
					break;

				default:
					// some other error occurred
					break;
			}
		}
	};

	/*
	 * Register Vimeo event globally
	 *
	 */
	win.onVimeoPlayerAPIReady = function () {
		
		vimeoApi.iFrameReady();
	};

	var vimeoIframeRenderer = {

		name: 'vimeo_iframe',

		options: {
			prefix: 'vimeo_iframe'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/vimeo', 'video/x-vimeo'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			// exposed object
			var
				apiStack = [],
				vimeoApiReady = false,
				vimeo = {},
				vimeoPlayer = null,
				paused = true,
				volume = 1,
				oldVolume = volume,
				currentTime = 0,
				bufferedTime = 0,
				ended = false,
				duration = 0,
				url = "",
				i,
				il;

			vimeo.options = options;
			vimeo.id = mediaElement.id + '_' + options.prefix;
			vimeo.mediaElement = mediaElement;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					vimeo['get' + capName] = function () {
						if (vimeoPlayer !== null) {
							var value = null;

							switch (propName) {
								case 'currentTime':
									return currentTime;

								case 'duration':
									return duration;

								case 'volume':
									return volume;
								case 'muted':
									return volume === 0;
								case 'paused':
									return paused;

								case 'ended':
									return ended;

								case 'src':
									return url;

								case 'buffered':
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return bufferedTime * duration;
										},
										length: 1
									};
							}

							return value;
						} else {
							return null;
						}
					};

					vimeo['set' + capName] = function (value) {

						if (vimeoPlayer !== null) {

							// do something
							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src,
										videoId = vimeoApi.getVimeoId(url);

									vimeoPlayer.loadVideo(videoId).then(function () {
										if (mediaElement.getAttribute('autoplay')) {
											vimeoPlayer.play();
										}

									})['catch'](function (error) {
										vimeoApi.errorHandler(error);
									});
									break;

								case 'currentTime':
									vimeoPlayer.setCurrentTime(value).then(function () {
										currentTime = value;
										setTimeout(function () {
											var event = mejs.Utils.createEvent('timeupdate', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									})['catch'](function (error) {
										vimeoApi.errorHandler(error);
									});
									break;

								case 'volume':
									vimeoPlayer.setVolume(value).then(function () {
										volume = value;
										oldVolume = volume;
										setTimeout(function () {
											var event = mejs.Utils.createEvent('volumechange', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									})['catch'](function (error) {
										vimeoApi.errorHandler(error);
									});
									break;

								case 'loop':
									vimeoPlayer.setLoop(value)['catch'](function (error) {
										vimeoApi.errorHandler(error);
									});
									break;
								case 'muted':
									
									if (value) {
										vimeoPlayer.setVolume(0).then(function () {
											volume = 0;
											setTimeout(function () {
												var event = mejs.Utils.createEvent('volumechange', vimeo);
												mediaElement.dispatchEvent(event);
											}, 50);
										})['catch'](function (error) {
											vimeoApi.errorHandler(error);
										});
									} else {
										vimeoPlayer.setVolume(oldVolume).then(function () {
											volume = oldVolume;
											setTimeout(function () {
												var event = mejs.Utils.createEvent('volumechange', vimeo);
												mediaElement.dispatchEvent(event);
											}, 50);
										})['catch'](function (error) {
											vimeoApi.errorHandler(error);
										});
									}
									break;
								default:
									
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add wrappers for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the Soundcloud API
					vimeo[methodName] = function () {

						if (vimeoPlayer !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return vimeoPlayer.play();
								case 'pause':
									return vimeoPlayer.pause();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// Initial method to register all Vimeo events when initializing <iframe>
			win['__ready__' + vimeo.id] = function (_vimeoPlayer) {

				vimeoApiReady = true;
				mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

				

				// do call stack
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						vimeo['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						vimeo[stackItem.methodName]();
					}
				}

				var vimeoIframe = doc.getElementById(vimeo.id), events;

				// a few more events
				events = ['mouseover', 'mouseout'];

				var assignEvents = function (e) {
					var event = mejs.Utils.createEvent(e.type, vimeo);
					mediaElement.dispatchEvent(event);
				};

				for (var j in events) {
					var eventName = events[j];
					mejs.addEvent(vimeoIframe, eventName, assignEvents);
				}

				// Vimeo events
				vimeoPlayer.on('loaded', function () {

					vimeoPlayer.getDuration().then(function (loadProgress) {

						if (duration > 0) {
							bufferedTime = duration * loadProgress;
						}

						var event = mejs.Utils.createEvent('timeupdate', vimeo);
						mediaElement.dispatchEvent(event);

					})['catch'](function (error) {
						vimeoApi.errorHandler(error);
					});

					vimeoPlayer.getDuration().then(function (seconds) {

						duration = seconds;

						var event = mejs.Utils.createEvent('loadedmetadata', vimeo);
						mediaElement.dispatchEvent(event);
					})['catch'](function (error) {
						vimeoApi.errorHandler(error);
					});

					vimeoPlayer.getVideoUrl().then(function (_url) {
						url = _url;
					});
				});

				vimeoPlayer.on('progress', function () {

					paused = vimeo.mediaElement.getPaused();

					vimeoPlayer.getDuration().then(function (loadProgress) {

						duration = loadProgress;

						if (duration > 0) {
							bufferedTime = duration * loadProgress;
						}

					})['catch'](function (error) {
						vimeoApi.errorHandler(error);
					});

					var event = mejs.Utils.createEvent('timeupdate', vimeo);
					mediaElement.dispatchEvent(event);
				});
				vimeoPlayer.on('timeupdate', function () {

					paused = vimeo.mediaElement.getPaused();
					ended = false;

					vimeoPlayer.getCurrentTime().then(function (seconds) {
						currentTime = seconds;
					});

					var event = mejs.Utils.createEvent('timeupdate', vimeo);
					mediaElement.dispatchEvent(event);

				});
				vimeoPlayer.on('play', function () {
					paused = false;
					ended = false;

					vimeoPlayer.play()['catch'](function (error) {
						vimeoApi.errorHandler(error);
					});

					event = mejs.Utils.createEvent('play', vimeo);
					mediaElement.dispatchEvent(event);
				});
				vimeoPlayer.on('pause', function () {
					paused = true;
					ended = false;

					vimeoPlayer.pause()['catch'](function (error) {
						vimeoApi.errorHandler(error);
					});

					event = mejs.Utils.createEvent('pause', vimeo);
					mediaElement.dispatchEvent(event);
				});
				vimeoPlayer.on('ended', function () {
					paused = false;
					ended = true;

					var event = mejs.Utils.createEvent('ended', vimeo);
					mediaElement.dispatchEvent(event);
				});

				// give initial events
				events = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

				for (i = 0, il = events.length; i < il; i++) {
					var event = mejs.Utils.createEvent(events[i], vimeo);
					mediaElement.dispatchEvent(event);
				}
			};

			var
				height = mediaElement.originalNode.height,
				width = mediaElement.originalNode.width,
				vimeoContainer = doc.createElement('iframe')
				;

			// Create Vimeo <iframe> markup
			vimeoContainer.setAttribute('id', vimeo.id);
			vimeoContainer.setAttribute('width', width);
			vimeoContainer.setAttribute('height', height);
			vimeoContainer.setAttribute('frameBorder', '0');
			vimeoContainer.setAttribute('src', mediaFiles[0].src);
			vimeoContainer.setAttribute('webkitallowfullscreen', '');
			vimeoContainer.setAttribute('mozallowfullscreen', '');
			vimeoContainer.setAttribute('allowfullscreen', '');

			mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			vimeoApi.enqueueIframe({
				iframe: vimeoContainer,
				id: vimeo.id
			});

			vimeo.hide = function () {
				vimeo.pause();
				if (vimeoPlayer) {
					vimeoContainer.style.display = 'none';
				}
			};
			vimeo.setSize = function (width, height) {
				vimeoContainer.setAttribute('width', width);
				vimeoContainer.setAttribute('height', height);
			};
			vimeo.show = function () {
				if (vimeoPlayer) {
					vimeoContainer.style.display = '';
				}
			};

			return vimeo;
		}

	};

	mejs.Renderers.add(vimeoIframeRenderer);

})(window, document, window.mejs || {});
/**
 * DailyMotion renderer
 *
 * Uses <iframe> approach and uses DailyMotion API to manipulate it.
 * @see https://developer.dailymotion.com/player
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register DailyMotion type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('dailymotion.com') > -1 || url.indexOf('dai.ly') > -1) {
			return 'video/dailymotion';
		} else {
			return null;
		}
	});

	var DailyMotionApi = {
		/**
		 * @type {Boolean}
		 */
		isSDKStarted: false,
		/**
		 * @type {Boolean}
		 */
		isSDKLoaded: false,
		/**
		 * @type {Array}
		 */
		iframeQueue: [],

		/**
		 * Create a queue to prepare the creation of <iframe>
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load DailyMotion API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isSDKStarted) {
				var e = document.createElement('script');
				e.async = true;
				e.src = 'https://api.dmcdn.net/all.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(e, s);
				this.isSDKStarted = true;
			}
		},

		/**
		 * Process queue of DailyMotion <iframe> element creation
		 *
		 */
		apiReady: function () {

			this.isLoaded = true;
			this.isSDKLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of DailyMotion API player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {

			

			var
				//id = settings.id,
				player = DM.player(settings.container, {
					height: '100%', // settings.height,
					width: '100%', //settings.width,
					video: settings.videoId,
					params: {
						chromeless: 1,
						api: 1,
						info: 0,
						logo: 0,
						related: 0
					},
					origin: location.host
				});

			player.addEventListener('apiready', function () {
				

				win['__ready__' + settings.id](player, {paused: true, ended: false});
			});
		},

		/**
		 * Extract ID from DailyMotion's URL to be loaded through API
		 * Valid URL format(s):
		 * - http://www.dailymotion.com/embed/video/x35yawy
		 * - http://dai.ly/x35yawy
		 *
		 * @param {String} url
		 * @return {String}
		 */
		getDailyMotionId: function (url) {
			var
				parts = url.split('/'),
				last_part = parts[parts.length - 1],
				dash_parts = last_part.split('_')
				;

			return dash_parts[0];
		}
	};

	/*
	 * Register DailyMotion event globally
	 *
	 */
	win.dmAsyncInit = function () {
		
		DailyMotionApi.apiReady();
	};

	var DailyMotionIframeRenderer = {
		name: 'dailymotion_iframe',

		options: {
			prefix: 'dailymotion_iframe'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/dailymotion', 'video/x-dailymotion'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var dm = {};

			dm.options = options;
			dm.id = mediaElement.id + '_' + options.prefix;
			dm.mediaElement = mediaElement;

			var
				apiStack = [],
				dmPlayerReady = false,
				dmPlayer = null,
				dmIframe = null,
				i,
				il,
				events
				;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					dm['get' + capName] = function () {
						if (dmPlayer !== null) {
							var value = null;

							// figure out how to get dm dta here
							switch (propName) {
								case 'currentTime':
									return dmPlayer.currentTime;

								case 'duration':
									return isNaN(dmPlayer.duration) ? 0 : dmPlayer.duration;

								case 'volume':
									return dmPlayer.volume;

								case 'paused':
									return dmPlayer.paused;

								case 'ended':
									return dmPlayer.ended;

								case 'muted':
									return dmPlayer.muted;

								case 'buffered':
									var percentLoaded = dmPlayer.bufferedTime,
										duration = dmPlayer.duration;
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return percentLoaded / duration;
										},
										length: 1
									};
								case 'src':
									return mediaElement.originalNode.getAttribute('src');
							}

							return value;
						} else {
							return null;
						}
					};

					dm['set' + capName] = function (value) {
						//

						if (dmPlayer !== null) {

							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src;

									dmPlayer.load(DailyMotionApi.getDailyMotionId(url));
									break;

								case 'currentTime':
									dmPlayer.seek(value);
									break;

								case 'muted':
									if (value) {
										dmPlayer.setMuted(true);
									} else {
										dmPlayer.setMuted(false);
									}
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', dm);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								case 'volume':
									dmPlayer.setVolume(value);
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', dm);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								default:
									
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add wrappers for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the native HTMLMediaElement
					dm[methodName] = function () {
						

						if (dmPlayer !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return dmPlayer.play();
								case 'pause':
									return dmPlayer.pause();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// Initial method to register all DailyMotion events when initializing <iframe>
			win['__ready__' + dm.id] = function (_dmPlayer) {

				dmPlayerReady = true;
				mediaElement.dmPlayer = dmPlayer = _dmPlayer;

				

				// do call stack
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						dm['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						dm[stackItem.methodName]();
					}
				}

				dmIframe = doc.getElementById(dm.id);

				// a few more events
				events = ['mouseover', 'mouseout'];
				var assignEvent = function (e) {
					var event = mejs.Utils.createEvent(e.type, dm);

					mediaElement.dispatchEvent(event);
				};
				for (var j in events) {
					var eventName = events[j];
					mejs.addEvent(dmIframe, eventName, assignEvent);
				}

				// BUBBLE EVENTS up
				events = mejs.html5media.events;
				events = events.concat(['click', 'mouseover', 'mouseout']);
				var assignNativeEvents = function (eventName) {

					// Deprecated event; not consider it
					if (eventName !== 'ended') {

						dmPlayer.addEventListener(eventName, function (e) {
							// copy event
							var event = mejs.Utils.createEvent(e.type, dmPlayer);
							mediaElement.dispatchEvent(event);
						});
					}

				};

				for (i = 0, il = events.length; i < il; i++) {
					assignNativeEvents(events[i]);
				}

				// Custom DailyMotion events
				dmPlayer.addEventListener('video_start', function () {
					var event = mejs.Utils.createEvent('play', dmPlayer);
					mediaElement.dispatchEvent(event);

					event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('video_end', function () {
					var event = mejs.Utils.createEvent('ended', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('progress', function () {
					var event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('durationchange', function () {
					event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});


				// give initial events
				var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

				for (var i = 0, il = initEvents.length; i < il; i++) {
					var event = mejs.Utils.createEvent(initEvents[i], dm);
					mediaElement.dispatchEvent(event);
				}
			};

			var dmContainer = doc.createElement('div');
			dmContainer.id = dm.id;
			mediaElement.appendChild(dmContainer);
			if (mediaElement.originalNode) {
				dmContainer.style.width = mediaElement.originalNode.style.width;
				dmContainer.style.height = mediaElement.originalNode.style.height;
			}
			//mediaElement.originalNode.parentNode.insertBefore(dmContainer, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			var
				videoId = DailyMotionApi.getDailyMotionId(mediaFiles[0].src),
				dmSettings = {
					id: dm.id,
					container: dmContainer,
					videoId: videoId
				};

			DailyMotionApi.enqueueIframe(dmSettings);

			dm.hide = function () {
				dm.stopInterval();
				dm.pause();
				if (dmIframe) {
					dmIframe.style.display = 'none';
				}
			};
			dm.show = function () {
				if (dmIframe) {
					dmIframe.style.display = '';
				}
			};
			dm.setSize = function(width, height) {
				dmIframe.width = width;
				dmIframe.height = height;
			};
			dm.destroy = function () {
				dmPlayer.destroy();
			};
			dm.interval = null;

			dm.startInterval = function () {
				dm.interval = setInterval(function () {
					DailyMotionApi.sendEvent(dm.id, dmPlayer, 'timeupdate', {
						paused: false,
						ended: false
					});
				}, 250);
			};
			dm.stopInterval = function () {
				if (dm.interval) {
					clearInterval(dm.interval);
				}
			};

			return dm;
		}
	};

	mejs.Renderers.add(DailyMotionIframeRenderer);

})(window, document, window.mejs || {});
/**
 * Facebook renderer
 *
 * It creates an <iframe> from a <div> with specific configuration.
 * @see https://developers.facebook.com/docs/plugins/embedded-video-player
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register Facebook type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('facebook') > -1) {
			return 'video/facebook';
		} else {
			return null;
		}
	});

	var FacebookRenderer = {
		name: 'facebook',

		options: {
			prefix: 'facebook',
			facebook: {
				appId: '{your-app-id}',
				xfbml: true,
				version: 'v2.6'
			}
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/facebook', 'video/x-facebook'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var
				fbWrapper = {},
				fbApi = null,
				fbDiv = null,
				apiStack = [],
				paused = true,
				ended = false,
				hasStartedPlaying = false,
				src = '',
				eventHandler = {},
				i,
				il
				;

			fbWrapper.options = options;
			fbWrapper.id = mediaElement.id + '_' + options.prefix;
			fbWrapper.mediaElement = mediaElement;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					fbWrapper['get' + capName] = function () {

						if (fbApi !== null) {
							var value = null;

							// figure out how to get youtube dta here
							switch (propName) {
								case 'currentTime':
									return fbApi.getCurrentPosition();

								case 'duration':
									return fbApi.getDuration();

								case 'volume':
									return fbApi.getVolume();

								case 'paused':
									return paused;

								case 'ended':
									return ended;

								case 'muted':
									return fbApi.isMuted();

								case 'buffered':
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return 0;
										},
										length: 1
									};
								case 'src':
									return src;
							}

							return value;
						} else {
							return null;
						}
					};

					fbWrapper['set' + capName] = function (value) {

						if (fbApi !== null) {

							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src;

									// Only way is to destroy instance and all the events fired,
									// and create new one
									fbDiv.parentNode.removeChild(fbDiv);
									createFacebookEmbed(url, options.facebook);

									// This method reloads video on-demand
									FB.XFBML.parse();

									break;

								case 'currentTime':
									fbApi.seek(value);
									break;

								case 'muted':
									if (value) {
										fbApi.mute();
									} else {
										fbApi.unmute();
									}
									setTimeout(function () {
										mediaElement.dispatchEvent({type: 'volumechange'});
									}, 50);
									break;

								case 'volume':
									fbApi.setVolume(value);
									setTimeout(function () {
										mediaElement.dispatchEvent({type: 'volumechange'});
									}, 50);
									break;

								default:
									
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add wrappers for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the native HTMLMediaElement
					fbWrapper[methodName] = function () {

						if (fbApi !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return fbApi.play();
								case 'pause':
									return fbApi.pause();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}


			/**
			 * Dispatch a list of events
			 *
			 * @private
			 * @param {Array} events
			 */
			function sendEvents(events) {
				for (var i = 0, il = events.length; i < il; i++) {
					var event = mejs.Utils.createEvent(events[i], fbWrapper);
					mediaElement.dispatchEvent(event);
				}
			}

			/**
			 * Determine if an object contains any elements
			 *
			 * @see http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
			 * @param {Object} instance
			 * @return {Boolean}
			 */
			function isEmpty(instance) {
				for (var key in instance) {
					if (instance.hasOwnProperty(key)) {
						return false;
					}
				}

				return true;
			}

			/**
			 * Create a new Facebook player and attach all its events
			 *
			 * This method creates a <div> element that, once the API is available, will generate an <iframe>.
			 * Valid URL format(s):
			 *  - https://www.facebook.com/johndyer/videos/10107816243681884/
			 *
			 * @param {String} url
			 * @param {Object} config
			 */
			function createFacebookEmbed(url, config) {

				fbDiv = doc.createElement('div');
				fbDiv.id = fbWrapper.id;
				fbDiv.className = "fb-video";
				fbDiv.setAttribute("data-href", url);
				fbDiv.setAttribute("data-width", mediaElement.originalNode.width);
				fbDiv.setAttribute("data-allowfullscreen", "true");

				mediaElement.originalNode.parentNode.insertBefore(fbDiv, mediaElement.originalNode);
				mediaElement.originalNode.style.display = 'none';

				/*
				 * Register Facebook API event globally
				 *
				 */
				win.fbAsyncInit = function () {

					FB.init(config);

					FB.Event.subscribe('xfbml.ready', function (msg) {

						

						if (msg.type === 'video') {

							fbApi = msg.instance;

							// remove previous listeners
							var fbEvents = ['startedPlaying', 'paused', 'finishedPlaying', 'startedBuffering', 'finishedBuffering'];
							for (i = 0, il = fbEvents.length; i < il; i++) {
								var event = fbEvents[i], handler = eventHandler[event];
								if (!isEmpty(handler) && typeof handler.removeListener === 'function') {
									handler.removeListener(event);
								}
							}

							// do call stack
							for (var i = 0, il = apiStack.length; i < il; i++) {

								var stackItem = apiStack[i];

								

								if (stackItem.type === 'set') {
									var propName = stackItem.propName,
										capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

									fbWrapper['set' + capName](stackItem.value);
								} else if (stackItem.type === 'call') {
									fbWrapper[stackItem.methodName]();
								}
							}

							
							sendEvents(['rendererready', 'ready', 'loadeddata', 'canplay']);

							// Custom Facebook events
							eventHandler.startedPlaying = fbApi.subscribe('startedPlaying', function () {
								
								if (!hasStartedPlaying) {
									sendEvents(['loadedmetadata', 'timeupdate']);
									hasStartedPlaying = true;
								}
								paused = false;
								ended = false;
								sendEvents(['play', 'playing', 'timeupdate']);
							});
							eventHandler.paused = fbApi.subscribe('paused', function () {
								
								paused = true;
								ended = false;
								sendEvents(['paused']);
							});
							eventHandler.finishedPlaying = fbApi.subscribe('finishedPlaying', function () {
								paused = false;
								ended = true;
								sendEvents(['ended']);
							});
							eventHandler.startedBuffering = fbApi.subscribe('startedBuffering', function () {
								sendEvents(['progress', 'timeupdate']);
							});
							eventHandler.finishedBuffering = fbApi.subscribe('finishedBuffering', function () {
								sendEvents(['progress', 'timeupdate']);
							});
						}
					});
				};

				(function (d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {
						return;
					}
					js = d.createElement(s);
					js.id = id;
					js.src = 'https://connect.facebook.net/en_US/sdk.js';
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}

			if (mediaFiles.length > 0) {
				createFacebookEmbed(mediaFiles[0].src, options.facebook);
			}

			fbWrapper.hide = function () {
				fbWrapper.stopInterval();
				fbWrapper.pause();
				if (fbDiv) {
					fbDiv.style.display = 'none';
				}
			};
			fbWrapper.show = function () {
				if (fbDiv) {
					fbDiv.style.display = '';
				}
			};
			fbWrapper.setSize = function(width, height) {
				// Buggy and difficult to resize on-the-fly
			};
			fbWrapper.destroy = function () {
			};
			fbWrapper.interval = null;

			fbWrapper.startInterval = function () {
				// create timer
				fbWrapper.interval = setInterval(function () {
					var event = mejs.Utils.createEvent('timeupdate', fbWrapper);
					mediaElement.dispatchEvent(event);
				}, 250);
			};
			fbWrapper.stopInterval = function () {
				if (fbWrapper.interval) {
					clearInterval(fbWrapper.interval);
				}
			};

			return fbWrapper;
		}
	};

	mejs.Renderers.add(FacebookRenderer);

})(window, document, window.mejs || {});
/**
 * SoundCloud renderer
 *
 * Uses <iframe> approach and uses SoundCloud Widget API to manipulate it.
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register SoundCloud type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('soundcloud.com') > -1) {
			return 'video/soundcloud';
		} else {
			return null;
		}
	});

	var SoundCloudApi = {
		/**
		 * @type {Boolean}
		 */
		isSDKStarted: false,
		/**
		 * @type {Boolean}
		 */
		isSDKLoaded: false,
		/**
		 * @type {Array}
		 */
		iframeQueue: [],

		/**
		 * Create a queue to prepare the creation of <iframe>
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load SoundCloud API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isSDKStarted) {
				// https://developers.soundcloud.com/docs/api/html5-widget#methods
				var head = doc.getElementsByTagName("head")[0] || document.documentElement,
					script = doc.createElement("script"),
					done = false;

				script.src = 'https://w.soundcloud.com/player/api.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
						done = true;
						SoundCloudApi.apiReady();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if (head && script.parentNode) {
							head.removeChild(script);
						}
					}
				};
				head.appendChild(script);
				this.isSDKStarted = true;
			}
		},

		/**
		 * Process queue of SoundCloud <iframe> element creation
		 *
		 */
		apiReady: function () {

			

			this.isLoaded = true;
			this.isSDKLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of SoundCloud Widget player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {

			//

			var player = SC.Widget(settings.iframe);
			win['__ready__' + settings.id](player);
		}
	};

	var SoundCloudIframeRenderer = {
		name: 'soundcloud_iframe',

		options: {
			prefix: 'soundcloud_iframe'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/soundcloud', 'video/x-soundcloud'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var sc = {};

			// store main variable
			sc.options = options;
			sc.id = mediaElement.id + '_' + options.prefix;
			sc.mediaElement = mediaElement;

			// create our fake element that allows events and such to work
			// insert data
			var apiStack = [],
				scPlayerReady = false,
				scPlayer = null,
				scIframe = null,

				currentTime = 0,
				duration = 0,
				bufferedTime = 0,
				paused = true,
				volume = 0,
				muted = false,
				ended = false,
				i,
				il;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					sc['get' + capName] = function () {
						if (scPlayer !== null) {
							var value = null;

							// figure out how to get dm dta here
							switch (propName) {
								case 'currentTime':
									return currentTime;

								case 'duration':
									return duration;

								case 'volume':
									return volume;

								case 'paused':
									return paused;

								case 'ended':
									return ended;

								case 'muted':
									return muted; // ?

								case 'buffered':
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return bufferedTime * duration;
										},
										length: 1
									};
								case 'src':
									return (scIframe) ? scIframe.src : '';
							}

							return value;
						} else {
							return null;
						}
					};

					sc['set' + capName] = function (value) {
						//

						if (scPlayer !== null) {

							// do something
							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src;

									scPlayer.load(url);
									break;

								case 'currentTime':
									scPlayer.seekTo(value * 1000);
									break;

								case 'muted':
									if (value) {
										scPlayer.setVolume(0); // ?
									} else {
										scPlayer.setVolume(1); // ?
									}
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', sc);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								case 'volume':
									scPlayer.setVolume(value);
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', sc);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								default:
									
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add wrappers for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the Soundcloud API
					sc[methodName] = function () {
						

						if (scPlayer !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return scPlayer.play();
								case 'pause':
									return scPlayer.pause();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// add a ready method that SC can fire
			win['__ready__' + sc.id] = function (_scPlayer) {

				scPlayerReady = true;
				mediaElement.scPlayer = scPlayer = _scPlayer;

				

				// do call stack
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						sc['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						sc[stackItem.methodName]();
					}
				}

				// SoundCloud properties are async, so we don't fire the event until the property callback fires

				scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
					paused = false;
					ended = false;

					scPlayer.getPosition(function (_currentTime) {
						currentTime = _currentTime / 1000;
						var event = mejs.Utils.createEvent('timeupdate', sc);
						mediaElement.dispatchEvent(event);
					});
				});

				scPlayer.bind(SC.Widget.Events.PAUSE, function () {
					paused = true;

					var event = mejs.Utils.createEvent('pause', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.PLAY, function () {
					paused = false;
					ended = false;

					var event = mejs.Utils.createEvent('play', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.FINISHED, function () {
					paused = false;
					ended = true;

					var event = mejs.Utils.createEvent('ended', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.READY, function () {
					scPlayer.getDuration(function (_duration) {
						duration = _duration / 1000;

						var event = mejs.Utils.createEvent('loadedmetadata', sc);
						mediaElement.dispatchEvent(event);
					});
				});
				scPlayer.bind(SC.Widget.Events.LOAD_PROGRESS, function () {
					scPlayer.getDuration(function (loadProgress) {
						if (duration > 0) {
							bufferedTime = duration * loadProgress;

							var event = mejs.Utils.createEvent('progress', sc);
							mediaElement.dispatchEvent(event);
						}
					});
					scPlayer.getDuration(function (_duration) {
						duration = _duration;

						var event = mejs.Utils.createEvent('loadedmetadata', sc);
						mediaElement.dispatchEvent(event);
					});
				});

				// give initial events
				var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

				for (var i = 0, il = initEvents.length; i < il; i++) {
					var event = mejs.Utils.createEvent(initEvents[i], sc);
					mediaElement.dispatchEvent(event);
				}
			};

			// container for API API
			scIframe = doc.createElement('iframe');
			scIframe.id = sc.id;
			scIframe.width = 10;
			scIframe.height = 10;
			scIframe.frameBorder = 0;
			scIframe.style.visibility = 'hidden';
			scIframe.src = mediaFiles[0].src;
			mediaElement.appendChild(scIframe);

			mediaElement.originalNode.style.display = 'none';

			var
				scSettings = {
					iframe: scIframe,
					id: sc.id
				};

			SoundCloudApi.enqueueIframe(scSettings);

			sc.setSize = function (width, height) {
				// nothing here, audio only
			};
			sc.hide = function () {
				sc.pause();
				if (scIframe) {
					scIframe.style.display = 'none';
				}
			};
			sc.show = function () {
				if (scIframe) {
					scIframe.style.display = '';
				}
			};
			sc.destroy = function () {
				scPlayer.destroy();
			};

			return sc;
		}
	};

	mejs.Renderers.add(SoundCloudIframeRenderer);

})(window, document, window.mejs || {});
/**
 * Shim that falls back to Flash if a media type is not supported.
 *
 * Any format not supported natively, including, RTMP, FLV, HLS and M(PEG)-DASH (if browser does not support MSE),
 * will play using Flash.
 */
(function(win, doc, mejs, undefined) {

	/**
	 * Core detector, plugins are added below
	 *
	 */
	mejs.PluginDetector = {

		/**
		 * @type {String}
		 */
		nav: win.navigator,
		/**
		 * @type {String}
		 */
		ua: win.navigator.userAgent.toLowerCase(),
		/**
		 * Cached version numbers
		 * @type {Array}
		 */
		plugins: [],

		/**
		 * Test a plugin version number
		 * @param {String} plugin - In this scenario 'flash' will be tested
		 * @param {Array} v - An array containing the version up to 3 numbers (major, minor, revision)
		 * @return {Boolean}
		 */
		hasPluginVersion: function(plugin, v) {
			var pv = this.plugins[plugin];
			v[1] = v[1] || 0;
			v[2] = v[2] || 0;
			return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2]));
		},

		/**
		 * Detect plugin and store its version number
		 *
		 * @see mejs.PluginDetector.detectPlugin
		 * @param {String} p
		 * @param {String} pluginName
		 * @param {String} mimeType
		 * @param {String} activeX
		 * @param {Function} axDetect
		 */
		addPlugin: function(p, pluginName, mimeType, activeX, axDetect) {
			this.plugins[p] = this.detectPlugin(pluginName, mimeType, activeX, axDetect);
		},

		/**
		 * Obtain version number from the mime-type (all but IE) or ActiveX (IE)
		 *
		 * @param {String} pluginName
		 * @param {String} mimeType
		 * @param {String} activeX
		 * @param {Function} axDetect
		 * @return {int[]}
		 */
		detectPlugin: function(pluginName, mimeType, activeX, axDetect) {

			var version = [0,0,0],
				description,
				i,
				ax;

			// Firefox, Webkit, Opera
			if (typeof(this.nav.plugins) !== 'undefined' && typeof this.nav.plugins[pluginName] === 'object') {
				description = this.nav.plugins[pluginName].description;
				if (description && !(typeof this.nav.mimeTypes != 'undefined' && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
					version = description.replace(pluginName, '').replace(/^\s+/,'').replace(/\sr/gi,'.').split('.');
					for (i=0; i<version.length; i++) {
						version[i] = parseInt(version[i].match(/\d+/), 10);
					}
				}
			// Internet Explorer / ActiveX
			} else if (typeof(window.ActiveXObject) !== 'undefined') {
				try {
					ax = new ActiveXObject(activeX);
					if (ax) {
						version = axDetect(ax);
					}
				}
				catch (e) { }
			}
			return version;
		}
	};

	/**
	 * Add Flash detection
	 *
	 */
	mejs.PluginDetector.addPlugin('flash','Shockwave Flash','application/x-shockwave-flash','ShockwaveFlash.ShockwaveFlash', function(ax) {
		// adapted from SWFObject
		var version = [],
			d = ax.GetVariable("$version");
		if (d) {
			d = d.split(" ")[1].split(",");
			version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
		}
		return version;
	});

	var FlashMediaElementRenderer = {

		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var flash = {},
				i,
				il;

			// store main variable
			flash.options = options;
			flash.id = mediaElement.id + '_' + flash.options.prefix;
			flash.mediaElement = mediaElement;

			// insert data
			flash.flashState = {};
			flash.flashApi = null;
			flash.flashApiStack = [];

			// mediaElements for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function(propName) {

					// add to flash state that we will store
					flash.flashState[propName] = null;

					var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

					flash['get' + capName] = function() {

						if (flash.flashApi !== null) {

							if (flash.flashApi['get_' + propName] !== undefined) {
								var value = flash.flashApi['get_' + propName](); //t.flashState['_' + propName];

								//

								// special case for buffered to conform to HTML5's newest
								if (propName === 'buffered') {
									//

									return  {
										start: function() {
											return 0;
										},
										end: function () {
											return value;
										},
										length: 1
									};
								}

								return value;
							} else {
								

								return null;
							}
						} else {
							return null;
						}
					};

					flash['set' + capName] = function(value) {
						

						if (propName === 'src') {
							value = mejs.Utils.absolutizeUrl(value);
						}

						// send value to Flash
						if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
							flash.flashApi['set_' + propName](value);
						} else {
							// store for after "READY" event fires
							flash.flashApiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				}
			;
			for (i=0, il=props.length; i<il; i++) {
				assignGettersSetters(props[i]);
			}

			// add mediaElements for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function(methodName) {

					// run the method on the native HTMLMediaElement
					flash[methodName] = function() {
						

						if (flash.flashApi !== null) {
							// send call up to Flash ExternalInterface API
							if (flash.flashApi['fire_' + methodName]) {
								try {
									flash.flashApi['fire_' + methodName]();
								} catch (e) {
									
								}

							} else {
								
							}
						} else {
							// store for after "READY" event fires
							//
							flash.flashApiStack.push({type: 'call', methodName: methodName});
						}
					};

				}
			;
			methods.push('stop');
			for (i=0, il=methods.length; i<il; i++) {
				assignMethods(methods[i]);
			}

			// add a ready method that Flash can call to
			win['__ready__' + flash.id] = function() {

				flash.flashReady = true;
				flash.flashApi = document.getElementById('__' + flash.id);

				var event = mejs.Utils.createEvent('rendererready', flash);
				mediaElement.dispatchEvent(event);

				// do call stack
				for (var i=0, il=flash.flashApiStack.length; i<il; i++) {

					var stackItem = flash.flashApiStack[i];

					

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

						flash['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			};

			win['__event__' + flash.id] = function(eventName, message) {

				var event = mejs.Utils.createEvent(eventName, flash);
				event.message = message;

				// send event from Flash up to the mediaElement
				flash.mediaElement.dispatchEvent(event);
			};

			// insert Flash object
			flash.flashWrapper = document.createElement('div');

			var
				flashVars = ['uid=' + flash.id,],
				isVideo = mediaElement.originalNode !== null && mediaElement.originalNode.tagName.toLowerCase() === 'video',
				flashHeight = (isVideo) ? mediaElement.originalNode.height : 1,
				flashWidth = (isVideo) ? mediaElement.originalNode.width : 1;

			if (flash.options.enablePseudoStreaming === true) {
				flashVars.push('pseudostreamstart=' + flash.options.pseudoStreamingStartQueryParam);
				flashVars.push('pseudostreamtype=' + flash.options.pseudoStreamingType);
			}

			mediaElement.appendChild(flash.flashWrapper);

			if (isVideo && mediaElement.originalNode !== null) {
				mediaElement.originalNode.style.display = 'none';
			}

			var settings = [];

			if (mejs.Features.isIE) {
				var specialIEContainer = doc.createElement('div');
				flash.flashWrapper.appendChild(specialIEContainer);

				settings = [
					'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
					'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"',
					'id="__' + flash.id + '"',
					'width="' + flashWidth + '"',
					'height="' + flashHeight + '"'
				];

				if (!isVideo) {
					settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
				}

				specialIEContainer.outerHTML =
					'<object ' + settings.join(' ') + '>' +
						'<param name="movie" value="' + flash.options.pluginPath + flash.options.filename + '?x=' + (new Date()) + '" />' +
						'<param name="flashvars" value="' + flashVars.join('&amp;') + '" />' +
						'<param name="quality" value="high" />' +
						'<param name="bgcolor" value="#000000" />' +
						'<param name="wmode" value="transparent" />' +
						'<param name="allowScriptAccess" value="always" />' +
						'<param name="allowFullScreen" value="true" />' +
					'</object>';

			} else {

				settings = [
					'id="__' + flash.id + '"',
					'name="__' + flash.id + '"',
					'play="true"',
					'loop="false"',
					'quality="high"',
					'bgcolor="#000000"',
					'wmode="transparent"',
					'allowScriptAccess="always"',
					'allowFullScreen="true"',
					'type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer"',
					'src="' + flash.options.pluginPath + flash.options.filename + '"',
					'flashvars="' + flashVars.join('&') + '"',
					'width="' + flashWidth + '"',
					'height="' + flashHeight + '"'
				];

				if (!isVideo) {
					settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
				}

				flash.flashWrapper.innerHTML =
					'<embed '+ settings.join(' ') + '></embed>';
			}

			flash.flashNode = flash.flashWrapper.lastChild;

			flash.hide = function() {
				if (isVideo) {
					flash.flashNode.style.position = 'absolute';
					flash.flashNode.style.width = '1px';
					flash.flashNode.style.height = '1px';
					try {
						flash.flashNode.style.clip = 'rect(0 0 0 0);';
					} catch (e){}
				}
			};
			flash.show = function() {
				if (isVideo) {
					flash.flashNode.style.position = '';
					flash.flashNode.style.width = '';
					flash.flashNode.style.height = '';
					try {
						flash.flashNode.style.clip = '';
					} catch (e) {}
				}
			};
			flash.setSize = function(width, height) {
				flash.flashNode.style.width = width + 'px';
				flash.flashNode.style.height = height + 'px';

				flash.flashApi.fire_setSize(width, height);
			};


			if (mediaFiles && mediaFiles.length > 0) {

				for (i = 0, il = mediaFiles.length; i < il; i++) {
					if (mejs.Renderers.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
						
						flash.setSrc(mediaFiles[i].src);
						flash.load();
						break;
					}
				}
			}

			return flash;
		}
	};

	var hasFlash = mejs.PluginDetector.hasPluginVersion('flash',[10,0,0]);

	if (hasFlash) {

		/**
		 * Register media type based on URL structure if Flash is detected
		 *
		 */
		mejs.Utils.typeChecks.push(function(url) {

			url = url.toLowerCase();

			if (url.indexOf('rtmp') > -1) {
				if (url.indexOf('.mp3') > -1) {
					return 'audio/rtmp';
				} else {
					return 'video/rtmp';
				}
			} else if (url.indexOf('.oga') > -1 || url.indexOf('.ogg') > -1) {
				return 'audio/ogg';
			} else if (url.indexOf('.m3u8') > -1) {
				return 'application/x-mpegURL';
			} else if (url.indexOf('.mpd') > -1) {
				return 'application/dash+xml';
			} else {
				return null;
			}
		});

		// VIDEO
		var FlashMediaElementVideoRenderer = {
			name: 'flash_video',

			options: {
				prefix: 'flash_video',
				filename: 'mediaelement-flash-video.swf',
				enablePseudoStreaming: true,
				// start query parameter sent to server for pseudo-streaming
				pseudoStreamingStartQueryParam: 'start',
				// pseudo streaming type: use `time` for time based seeking (MP4) or `byte` for file byte position (FLV)
				pseudoStreamingType: 'byte'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function(type) {
				var supportedMediaTypes = ['video/mp4', 'video/flv', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4'];

				return (hasFlash && supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create

		};
		mejs.Renderers.add(FlashMediaElementVideoRenderer);

		// HLS
		var FlashMediaElementHlsVideoRenderer = {
			name: 'flash_hls',

			options: {
				prefix: 'flash_hls',
				filename: 'mediaelement-flash-video-hls.swf'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function(type) {
				var supportedMediaTypes = ['audio/hls', 'video/hls', 'application/x-mpegURL', 'vnd.apple.mpegURL'];

				return (supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create
		};
		mejs.Renderers.add(FlashMediaElementHlsVideoRenderer);

		// M(PEG)-DASH
		var FlashMediaElementMdashVideoRenderer = {
			name: 'flash_mdash',

			options: {
				prefix: 'flash_mdash',
				filename: 'mediaelement-flash-video-mdash.swf'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function(type) {
				var supportedMediaTypes = ['application/dash+xml'];

				return (hasFlash && supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create
		};
		mejs.Renderers.add(FlashMediaElementMdashVideoRenderer);

		// AUDIO
		var FlashMediaElementAudioRenderer = {
			name: 'flash_audio',

			options: {
				prefix: 'flash_audio_ogg',
				filename: 'mediaelement-flash-audio.swf'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function(type) {
				var supportedMediaTypes = ['audio/mp3'];

				return (hasFlash && supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create
		};
		mejs.Renderers.add(FlashMediaElementAudioRenderer);

		// AUDIO - ogg
		var FlashMediaElementAudioOggRenderer = {
			name: 'flash_audio_ogg',

			options: {
				prefix: 'flash_audio_ogg',
				filename: 'mediaelement-flash-audio-ogg.swf'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function(type) {
				var supportedMediaTypes = ['audio/ogg','audio/oga', 'audio/ogv'];

				return (hasFlash && supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create
		};
		mejs.Renderers.add(FlashMediaElementAudioOggRenderer);

		// Register Flash renderer if Flash was found
		window.FlashMediaElementRenderer = mejs.FlashMediaElementRenderer = FlashMediaElementRenderer;

	} else {

		// Possible errors:
		// 1) Flash is not installed or disabled
		// 2) Flash is not the version required
		var error = (mejs.PluginDetector.plugins.flash[0] === 0 &&
			mejs.PluginDetector.plugins.flash[1] === 0 &&
			mejs.PluginDetector.plugins.flash[2] === 0) ?
			'Make sure you have Flash enabled; otherwise, download the latest version from https://get.adobe.com/flashplayer/' :
			'Current version of Flash is not up-to-date. Download the latest version from https://get.adobe.com/flashplayer/'
		;

		console.error(error);
	}

})(window, document, window.mejs || {});
/**
 * Localize strings
 *
 * Include translations from JS files and method to pluralize properly strings.
 *
 */
(function (doc, win, mejs, undefined) {

	var i18n = {
		/**
		 * @type {String}
		 */
		'default': 'en',

		/**
		 * @type {String[]}
		 */
		locale: {
			language: (mejs.i18n && mejs.i18n.locale.language) || '',
			strings: (mejs.i18n && mejs.i18n.locale.strings) || {}
		},

		/**
		 * Filters for available languages.
		 *
		 * This plural forms are grouped in family groups based on
		 * https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
		 * with some additions and corrections according to the Localization Guide list
		 * (http://localization-guide.readthedocs.io/en/latest/l10n/pluralforms.html)
		 *
		 * Arguments are dynamic following the structure:
		 * - argument1 : Number to determine form
		 * - argument2...argumentN: Possible matches
		 *
		 * @type {Function[]}
		 */
		pluralForms: [
			// 0: Chinese, Japanese, Korean, Persian, Turkish, Thai, Lao, Aymará,
			// Tibetan, Chiga, Dzongkha, Indonesian, Lojban, Georgian, Kazakh, Khmer, Kyrgyz, Malay,
			// Burmese, Yakut, Sundanese, Tatar, Uyghur, Vietnamese, Wolof
			function () {
				return arguments[1];
			},
			// 1: Danish, Dutch, English, Faroese, Frisian, German, Norwegian, Swedish, Estonian, Finnish,
			// Hungarian, Basque, Greek, Hebrew, Italian, Portuguese, Spanish, Catalan, Afrikaans,
			// Angika, Assamese, Asturian, Azerbaijani, Bulgarian, Bengali, Bodo, Aragonese, Dogri,
			// Esperanto, Argentinean Spanish, Fulah, Friulian, Galician, Gujarati, Hausa,
			// Hindi, Chhattisgarhi, Armenian, Interlingua, Greenlandic, Kannada, Kurdish, Letzeburgesch,
			// Maithili, Malayalam, Mongolian, Manipuri, Marathi, Nahuatl, Neapolitan, Norwegian Bokmal,
			// Nepali, Norwegian Nynorsk, Norwegian (old code), Northern Sotho, Oriya, Punjabi, Papiamento,
			// Piemontese, Pashto, Romansh, Kinyarwanda, Santali, Scots, Sindhi, Northern Sami, Sinhala,
			// Somali, Songhay, Albanian, Swahili, Tamil, Telugu, Turkmen, Urdu, Yoruba
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 2: French, Brazilian Portuguese, Acholi, Akan, Amharic, Mapudungun, Breton, Filipino,
			// Gun, Lingala, Mauritian Creole, Malagasy, Maori, Occitan, Tajik, Tigrinya, Uzbek, Walloon
			function () {
				var args = arguments;
				if ([0, 1].indexOf(args[0]) > -1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 3: Latvian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] !== 0) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 4: Scottish Gaelic
			function () {
				var args = arguments;
				if (args[0] === 1 || args[0] === 11) {
					return args[1];
				} else if (args[0] === 2 || args[0] === 12) {
					return args[2];
				} else if (args[0] > 2 && args[0] < 20) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 5:  Romanian
			function () {
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 0 || (args[0] % 100 > 0 && args[0] % 100 < 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 6: Lithuanian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] % 10 >= 2 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return [3];
				}
			},
			// 7: Belarusian, Bosnian, Croatian, Serbian, Russian, Ukrainian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 8:  Slovak, Czech
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] >= 2 && args[0] <= 4) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 9: Polish
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 10: Slovenian
			function () {
				var args = arguments;
				if (args[0] % 100 === 1) {
					return args[2];
				} else if (args[0] % 100 === 2) {
					return args[3];
				} else if (args[0] % 100 === 3 || args[0] % 100 === 4) {
					return args[4];
				} else {
					return args[1];
				}
			},
			// 11: Irish Gaelic
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] > 2 && args[0] < 7) {
					return args[3];
				} else if (args[0] > 6 && args[0] < 11) {
					return args[4];
				} else {
					return args[5];
				}
			},
			// 12: Arabic
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else if (args[0] === 1) {
					return args[2];
				} else if (args[0] === 2) {
					return args[3];
				} else if (args[0] % 100 >= 3 && args[0] % 100 <= 10) {
					return args[4];
				} else if (args[0] % 100 >= 11) {
					return args[5];
				} else {
					return args[6];
				}
			},
			// 13: Maltese
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 0 || (args[0] % 100 > 1 && args[0] % 100 < 11)) {
					return args[2];
				} else if (args[0] % 100 > 10 && args[0] % 100 < 20) {
					return args[3];
				} else {
					return args[4];
				}

			},
			// 14: Macedonian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1) {
					return args[1];
				} else if (args[0] % 10 === 2) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 15:  Icelandic
			function () {
				var args = arguments;
				if (args[0] !== 11 && args[0] % 10 === 1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// New additions

			// 16:  Kashubian
			// Note: in https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
			// Breton is listed as #16 but in the Localization Guide it belongs to the group 2
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 17:  Welsh
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] !== 8 && args[0] !== 11) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 18:  Javanese
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 19:  Cornish
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] === 3) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 20:  Mandinka
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else if (args[0] === 1) {
					return args[2];
				} else {
					return args[3];
				}
			}
		],
		/**
		 * Get specified language
		 *
		 */
		getLanguage: function () {
			var language = i18n.locale.language || i18n['default'];
			return /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/.exec(language) ? language : i18n['default'];
		},

		/**
		 * Translate a string to a specified language, including optionally a number to pluralize translation
		 *
		 * @param {String} message
		 * @param {Number} pluralParam
		 * @return {String}
		 */
		t: function (message, pluralParam) {

			if (typeof message === 'string' && message.length) {

				var
					language = i18n.getLanguage(),
					str,
					pluralForm,
					/**
					 * Modify string using algorithm to detect plural forms.
					 *
					 * @private
					 * @see http://stackoverflow.com/questions/1353408/messageformat-in-javascript-parameters-in-localized-ui-strings
					 * @param {String|String[]} input   - String or array of strings to pick the plural form
					 * @param {Number} number           - Number to determine the proper plural form
					 * @param {Number} form             - Number of language family to apply plural form
					 * @return {String}
					 */
					plural = function (input, number, form) {

						if (typeof input !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
							return input;
						}

						if (typeof input === 'string') {
							return input;
						}

						// Perform plural form or return original text
						return i18n.pluralForms[form].apply(null, [number].concat(input));
					},
					/**
					 *
					 * @param {String} input
					 * @return {String}
					 */
					escapeHTML = function (input) {
						var map = {
							'&': '&amp;',
							'<': '&lt;',
							'>': '&gt;',
							'"': '&quot;'
						};

						return input.replace(/[&<>"]/g, function(c) {
							return map[c];
						});
					}
					;

				// Fetch the localized version of the string
				if (i18n.locale.strings && i18n.locale.strings[language]) {
					str = i18n.locale.strings[language][message];
					if (typeof pluralParam === 'number') {
						pluralForm = i18n.locale.strings[language]['mejs.plural-form'];
						str = plural.apply(null, [str, pluralParam, pluralForm]);
					}
				}

				// Fallback to default language if requested uid is not translated
				if (!str && i18n.locale.strings && i18n.locale.strings[i18n['default']]) {
					str = i18n.locale.strings[i18n['default']][message];
					if (typeof pluralParam === 'number') {
						pluralForm = i18n.locale.strings[i18n['default']]['mejs.plural-form'];
						str = plural.apply(null, [str, pluralParam, pluralForm]);

					}
				}

				// As a last resort, use the requested uid, to mimic original behavior of i18n utils (in which uid was the english text)
				str = str || message;

				// Replace token
				if (typeof pluralParam === 'number') {
					str = str.replace('%1', pluralParam);
				}

				return escapeHTML(str);

			}

			return message;
		}

	};

	// i18n fixes for compatibility with WordPress
	if (mejsL10n !== undefined) {
		i18n.locale.language = mejsL10n.language;
	}

	// Register variable
	mejs.i18n = i18n;


}(document, window, mejs));

// i18n fixes for compatibility with WordPress
;(function (mejs, undefined) {

	"use strict";

	if (mejsL10n !== undefined) {
		mejs[mejsL10n.lang] = mejsL10n.strings;
	}

}(mejs.i18n.locale.strings));
/*!
 * This is a i18n.locale language object.
 *
 * English; This can serve as a template for other languages to translate
 *
 * @author
 *   TBD
 *   Sascha Greuel (Twitter: @SoftCreatR)
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
(function (exports) {
	"use strict";

	if (exports.en === undefined) {
		exports.en = {
			"mejs.plural-form": 1,

			// me-shim
			"mejs.download-file": "Download File",

			// mep-feature-contextmenu
			"mejs.fullscreen-off": "Turn off Fullscreen",
			"mejs.fullscreen-on": "Go Fullscreen",
			"mejs.download-video": "Download Video",

			// mep-feature-fullscreen
			"mejs.fullscreen": "Fullscreen",

			// mep-feature-jumpforward
			"mejs.time-jump-forward": ["Jump forward 1 second", "Jump forward %1 seconds"],

			// mep-feature-playpause
			"mejs.play": "Play",
			"mejs.pause": "Pause",

			// mep-feature-postroll
			"mejs.close": "Close",

			// mep-feature-progress
			"mejs.time-slider": "Time Slider",
			"mejs.time-help-text": "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.",

			// mep-feature-skipback
			"mejs.time-skip-back": ["Skip back 1 second", "Skip back %1 seconds"],

			// mep-feature-tracks
			"mejs.captions-subtitles": "Captions/Subtitles",
			"mejs.none": "None",

			// mep-feature-volume
			"mejs.mute-toggle": "Mute Toggle",
			"mejs.volume-help-text": "Use Up/Down Arrow keys to increase or decrease volume.",
			"mejs.unmute": "Unmute",
			"mejs.mute": "Mute",
			"mejs.volume-slider": "Volume Slider",

			// mep-player
			"mejs.video-player": "Video Player",
			"mejs.audio-player": "Audio Player",

			// mep-feature-ads
			"mejs.ad-skip": "Skip ad",
			"mejs.ad-skip-info": ["Skip in 1 second", "Skip in %1 seconds"],

			// mep-feature-sourcechooser
			"mejs.source-chooser": "Source Chooser",

			// mep-feature-stop
			"mejs.stop": "Stop",

			// mep-tracks
			"mejs.afrikaans": "Afrikaans",
			"mejs.albanian": "Albanian",
			"mejs.arabic": "Arabic",
			"mejs.belarusian": "Belarusian",
			"mejs.bulgarian": "Bulgarian",
			"mejs.catalan": "Catalan",
			"mejs.chinese": "Chinese",
			"mejs.chinese-simplified": "Chinese (Simplified)",
			"mejs.chinese-traditional": "Chinese (Traditional)",
			"mejs.croatian": "Croatian",
			"mejs.czech": "Czech",
			"mejs.danish": "Danish",
			"mejs.dutch": "Dutch",
			"mejs.english": "English",
			"mejs.estonian": "Estonian",
			"mejs.filipino": "Filipino",
			"mejs.finnish": "Finnish",
			"mejs.french": "French",
			"mejs.galician": "Galician",
			"mejs.german": "German",
			"mejs.greek": "Greek",
			"mejs.haitian-creole": "Haitian Creole",
			"mejs.hebrew": "Hebrew",
			"mejs.hindi": "Hindi",
			"mejs.hungarian": "Hungarian",
			"mejs.icelandic": "Icelandic",
			"mejs.indonesian": "Indonesian",
			"mejs.irish": "Irish",
			"mejs.italian": "Italian",
			"mejs.japanese": "Japanese",
			"mejs.korean": "Korean",
			"mejs.latvian": "Latvian",
			"mejs.lithuanian": "Lithuanian",
			"mejs.macedonian": "Macedonian",
			"mejs.malay": "Malay",
			"mejs.maltese": "Maltese",
			"mejs.norwegian": "Norwegian",
			"mejs.persian": "Persian",
			"mejs.polish": "Polish",
			"mejs.portuguese": "Portuguese",
			"mejs.romanian": "Romanian",
			"mejs.russian": "Russian",
			"mejs.serbian": "Serbian",
			"mejs.slovak": "Slovak",
			"mejs.slovenian": "Slovenian",
			"mejs.spanish": "Spanish",
			"mejs.swahili": "Swahili",
			"mejs.swedish": "Swedish",
			"mejs.tagalog": "Tagalog",
			"mejs.thai": "Thai",
			"mejs.turkish": "Turkish",
			"mejs.ukrainian": "Ukrainian",
			"mejs.vietnamese": "Vietnamese",
			"mejs.welsh": "Welsh",
			"mejs.yiddish": "Yiddish"
		};
	}
}(mejs.i18n.locale.strings));
