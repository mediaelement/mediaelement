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
					newRenderer = newRendererType.create(mediaElement, renderOptions, mediaFiles);
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
				dmPlayer.addEventListener('ad_start', function () {
					var event = mejs.Utils.createEvent('play', dmPlayer);
					mediaElement.dispatchEvent(event);

					event = mejs.Utils.createEvent('progress', dmPlayer);
					mediaElement.dispatchEvent(event);

					event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('ad_timeupdate', function () {
					var event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('ad_pause', function () {
					var event = mejs.Utils.createEvent('pause', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('ad_end', function () {
					var event = mejs.Utils.createEvent('ended', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
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
(function (win, doc, mejs, undefined) {

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
		hasPluginVersion: function (plugin, v) {
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
		addPlugin: function (p, pluginName, mimeType, activeX, axDetect) {
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
		detectPlugin: function (pluginName, mimeType, activeX, axDetect) {

			var version = [0, 0, 0],
				description,
				i,
				ax;

			// Firefox, Webkit, Opera
			if (typeof(this.nav.plugins) !== 'undefined' && typeof this.nav.plugins[pluginName] === 'object') {
				description = this.nav.plugins[pluginName].description;
				if (description && !(typeof this.nav.mimeTypes != 'undefined' && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
					version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
					for (i = 0; i < version.length; i++) {
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
				catch (e) {
				}
			}
			return version;
		}
	};

	/**
	 * Add Flash detection
	 *
	 */
	mejs.PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
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
				assignGettersSetters = function (propName) {

					// add to flash state that we will store
					flash.flashState[propName] = null;

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					flash['get' + capName] = function () {

						if (flash.flashApi !== null) {

							if (flash.flashApi['get_' + propName] !== undefined) {
								var value = flash.flashApi['get_' + propName](); //t.flashState['_' + propName];

								//

								// special case for buffered to conform to HTML5's newest
								if (propName === 'buffered') {
									//

									return {
										start: function () {
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

					flash['set' + capName] = function (value) {
						

						if (propName === 'src') {
							value = mejs.Utils.absolutizeUrl(value);
						}

						// send value to Flash
						if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
							flash.flashApi['set_' + propName](value);
						} else {
							// store for after "READY" event fires
							flash.flashApiStack.push({
								type: 'set',
								propName: propName,
								value: value
							});
						}
					};

				}
				;
			for (i = 0, il = props.length; i < il; i++) {
				assignGettersSetters(props[i]);
			}

			// add mediaElements for native methods
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the native HTMLMediaElement
					flash[methodName] = function () {
						

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
							flash.flashApiStack.push({
								type: 'call',
								methodName: methodName
							});
						}
					};

				}
				;
			methods.push('stop');
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// add a ready method that Flash can call to
			win['__ready__' + flash.id] = function () {

				flash.flashReady = true;
				flash.flashApi = document.getElementById('__' + flash.id);

				var event = mejs.Utils.createEvent('rendererready', flash);
				mediaElement.dispatchEvent(event);

				// do call stack
				for (var i = 0, il = flash.flashApiStack.length; i < il; i++) {

					var stackItem = flash.flashApiStack[i];

					

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						flash['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			};

			win['__event__' + flash.id] = function (eventName, message) {

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

			var settings = [
				'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
				'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"',
				'id="__' + flash.id + '"',
				'width="' + flashWidth + '"',
				'height="' + flashHeight + '"'
			];

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			flash.flashWrapper.innerHTML =
				'<object ' + settings.join(' ') + '>' +
				'<param name="movie" value="' + flash.options.pluginPath + flash.options.filename + '?x=' + (new Date()) + '" />' +
				'<param name="flashvars" value="' + flashVars.join('&amp;') + '" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000000" />' +
				'<param name="wmode" value="transparent" />' +
				'<param name="allowScriptAccess" value="always" />' +
				'<param name="allowFullScreen" value="true" />' +
				'<div>' + mejs.i18n.t('mejs.install-flash') + '</div>' +
				'</object>'
			;

			flash.flashNode = flash.flashWrapper.lastChild;

			flash.hide = function () {
				if (isVideo) {
					flash.flashNode.style.position = 'absolute';
					flash.flashNode.style.width = '1px';
					flash.flashNode.style.height = '1px';
					try {
						flash.flashNode.style.clip = 'rect(0 0 0 0);';
					} catch (e) {
					}
				}
			};
			flash.show = function () {
				if (isVideo) {
					flash.flashNode.style.position = '';
					flash.flashNode.style.width = '';
					flash.flashNode.style.height = '';
					try {
						flash.flashNode.style.clip = '';
					} catch (e) {
					}
				}
			};
			flash.setSize = function (width, height) {
				flash.flashNode.style.width = width + 'px';
				flash.flashNode.style.height = height + 'px';

				if (flash.flashApi !== null) {
					flash.flashApi.fire_setSize(width, height);
				}
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

	var hasFlash = mejs.PluginDetector.hasPluginVersion('flash', [10, 0, 0]);

	if (hasFlash) {

		/**
		 * Register media type based on URL structure if Flash is detected
		 *
		 */
		mejs.Utils.typeChecks.push(function (url) {

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
			canPlayType: function (type) {
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
			canPlayType: function (type) {
				var supportedMediaTypes = ['audio/hls', 'video/hls', 'application/x-mpegURL',
					'application/x-mpegurl', 'vnd.apple.mpegURL'];

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
			canPlayType: function (type) {
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
				prefix: 'flash_audio',
				filename: 'mediaelement-flash-audio.swf'
			},
			/**
			 * Determine if a specific element type can be played with this render
			 *
			 * @param {String} type
			 * @return {Boolean}
			 */
			canPlayType: function (type) {
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
			canPlayType: function (type) {
				var supportedMediaTypes = ['audio/ogg', 'audio/oga', 'audio/ogv'];

				return (hasFlash && supportedMediaTypes.indexOf(type) > -1);
			},

			create: FlashMediaElementRenderer.create
		};
		mejs.Renderers.add(FlashMediaElementAudioOggRenderer);

		// Register Flash renderer if Flash was found
		window.FlashMediaElementRenderer = mejs.FlashMediaElementRenderer = FlashMediaElementRenderer;

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
	if (typeof mejsL10n !== 'undefined') {
		i18n.locale.language = mejsL10n.language;
	}

	// Register variable
	mejs.i18n = i18n;


}(document, window, mejs));

// i18n fixes for compatibility with WordPress
;(function (mejs, undefined) {

	"use strict";

	if (typeof mejsL10n !== 'undefined') {
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
 *   mediaelement-i18n.js
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
			"mejs.install-flash": "You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/",

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
if (jQuery !== undefined) {
	mejs.$ = jQuery;
} else if (Zepto !== undefined) {
	mejs.$ = Zepto;

	// define `outerWidth` method which has not been realized in Zepto
	Zepto.fn.outerWidth = function (includeMargin) {
		var width = $(this).width();
		if (includeMargin) {
			width += parseInt($(this).css('margin-right'), 10);
			width += parseInt($(this).css('margin-left'), 10);
		}
		return width;
	};

} else if (ender !== undefined) {
	mejs.$ = ender;
}
(function (mejs, $, win, doc, undefined) {

	// default player values
	mejs.MepDefaults = {
		// url to poster (to fix iOS 3.x)
		poster: '',
		// When the video is ended, we can show the poster.
		showPosterWhenEnded: false,
		// default if the <video width> is not specified
		defaultVideoWidth: 480,
		// default if the <video height> is not specified
		defaultVideoHeight: 270,
		// if set, overrides <video width>
		videoWidth: -1,
		// if set, overrides <video height>
		videoHeight: -1,
		// default if the user doesn't specify
		defaultAudioWidth: 400,
		// default if the user doesn't specify
		defaultAudioHeight: 30,
		// default amount to move back when back key is pressed
		defaultSeekBackwardInterval: function (media) {
			return (media.duration * 0.05);
		},
		// default amount to move forward when forward key is pressed
		defaultSeekForwardInterval: function (media) {
			return (media.duration * 0.05);
		},
		// set dimensions via JS instead of CSS
		setDimensions: true,
		// width of audio player
		audioWidth: -1,
		// height of audio player
		audioHeight: -1,
		// initial volume when the player starts (overridden by user cookie)
		startVolume: 0.8,
		// useful for <audio> player loops
		loop: false,
		// rewind to beginning when media ends
		autoRewind: true,
		// resize to media dimensions
		enableAutosize: true,
		/*
		 * Time format to use. Default: 'mm:ss'
		 * Supported units:
		 *   h: hour
		 *   m: minute
		 *   s: second
		 *   f: frame count
		 * When using 'hh', 'mm', 'ss' or 'ff' we always display 2 digits.
		 * If you use 'h', 'm', 's' or 'f' we display 1 digit if possible.
		 *
		 * Example to display 75 seconds:
		 * Format 'mm:ss': 01:15
		 * Format 'm:ss': 1:15
		 * Format 'm:s': 1:15
		 */
		timeFormat: '',
		// forces the hour marker (##:00:00)
		alwaysShowHours: false,
		// show framecount in timecode (##:00:00:00)
		showTimecodeFrameCount: false,
		// used when showTimecodeFrameCount is set to true
		framesPerSecond: 25,
		// automatically calculate the width of the progress bar based on the sizes of other elements
		autosizeProgress: true,
		// Hide controls when playing and mouse is not over the video
		alwaysShowControls: false,
		// Display the video control
		hideVideoControlsOnLoad: false,
		// Enable click video element to toggle play/pause
		clickToPlayPause: true,
		// Time in ms to hide controls
		controlsTimeoutDefault: 1500,
		// Time in ms to trigger the timer when mouse moves
		controlsTimeoutMouseEnter: 2500,
		// Time in ms to trigger the timer when mouse leaves
		controlsTimeoutMouseLeave: 1000,
		// force iPad's native controls
		iPadUseNativeControls: false,
		// force iPhone's native controls
		iPhoneUseNativeControls: false,
		// force Android's native controls
		AndroidUseNativeControls: false,
		// features to show
		features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
		// only for dynamic
		isVideo: true,
		// stretching modes (auto, fill, responsive, none)
		stretching: 'auto',
		// turns keyboard support on and off for this instance
		enableKeyboard: true,
		// when this player starts, it will pause other players
		pauseOtherPlayers: true,
		// array of keyboard actions such as play/pause
		keyActions: [
			{
				keys: [
					32, // SPACE
					179 // GOOGLE play/pause button
				],
				action: function (player, media, key, event) {

					if (!mejs.MediaFeatures.isFirefox) {
						if (media.paused || media.ended) {
							media.play();
						} else {
							media.pause();
						}
					}
				}
			},
			{
				keys: [38], // UP
				action: function (player, media, key, event) {
					player.container.find('.mejs-volume-slider').css('display', 'block');
					if (player.isVideo) {
						player.showControls();
						player.startControlsTimer();
					}

					var newVolume = Math.min(media.volume + 0.1, 1);
					media.setVolume(newVolume);
				}
			},
			{
				keys: [40], // DOWN
				action: function (player, media, key, event) {
					player.container.find('.mejs-volume-slider').css('display', 'block');
					if (player.isVideo) {
						player.showControls();
						player.startControlsTimer();
					}

					var newVolume = Math.max(media.volume - 0.1, 0);
					media.setVolume(newVolume);
				}
			},
			{
				keys: [
					37, // LEFT
					227 // Google TV rewind
				],
				action: function (player, media, key, event) {
					if (!isNaN(media.duration) && media.duration > 0) {
						if (player.isVideo) {
							player.showControls();
							player.startControlsTimer();
						}

						// 5%
						var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
						media.setCurrentTime(newTime);
					}
				}
			},
			{
				keys: [
					39, // RIGHT
					228 // Google TV forward
				],
				action: function (player, media, key, event) {
					if (!isNaN(media.duration) && media.duration > 0) {
						if (player.isVideo) {
							player.showControls();
							player.startControlsTimer();
						}

						// 5%
						var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
						media.setCurrentTime(newTime);
					}
				}
			},
			{
				keys: [70], // F
				action: function (player, media, key, event) {
					if (!event.ctrlKey) {
						if (typeof player.enterFullScreen != 'undefined') {
							if (player.isFullScreen) {
								player.exitFullScreen();
							} else {
								player.enterFullScreen();
							}
						}
					}
				}
			},
			{
				keys: [77], // M
				action: function (player, media, key, event) {
					player.container.find('.mejs-volume-slider').css('display', 'block');
					if (player.isVideo) {
						player.showControls();
						player.startControlsTimer();
					}
					if (player.media.muted) {
						player.setMuted(false);
					} else {
						player.setMuted(true);
					}
				}
			}
		]
	};

	mejs.mepIndex = 0;

	mejs.players = {};

	/**
	 *
	 * @param {Object} obj
	 * @param {String} type
	 * @param {Function} fn
	 */
	mejs.addEvent = function (obj, type, fn) {
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
		} else if (obj.attachEvent) {
			obj['e' + type + fn] = fn;
			obj[type + fn] = function () {
				obj['e' + type + fn](window.event);
			};
			obj.attachEvent('on' + type, obj[type + fn]);
		}

	};

	/**
	 *
	 * @param {Object} obj
	 * @param {String} type
	 * @param {Function} fn
	 */
	mejs.removeEvent = function (obj, type, fn) {

		if (obj.removeEventListener) {
			obj.removeEventListener(type, fn, false);
		} else if (obj.detachEvent) {
			obj.detachEvent('on' + type, obj[type + fn]);
			obj[type + fn] = null;
		}
	};

	/**
	 *
	 * @param {String} className
	 * @param {HTMLElement} node
	 * @param {String} tag
	 * @return {HTMLElement[]}
	 */
	mejs.getElementsByClassName = function getElementsByClassName(className, node, tag) {

		if (node === undefined || node === null) {
			node = document;
		}
		if (node.getElementsByClassName !== undefined && node.getElementsByClassName !== null) {
			return node.getElementsByClassName(className);
		}
		if (tag === undefined || tag === null) {
			tag = '*';
		}

		var classElements = [];
		var j = 0, teststr;
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;

		for (i = 0; i < elsLen; i++) {
			if (els[i].className.indexOf(className) != -1) {
				teststr = "," + els[i].className.split(" ").join(",") + ",";
				if (teststr.indexOf("," + className + ",") != -1) {
					classElements[j] = els[i];
					j++;
				}
			}
		}
		return classElements;
	};

	/**
	 * Wrap a MediaElement object in player controls
	 *
	 * @constructor
	 * @param {HTMLElement} node
	 * @param {Object} o
	 * @return {?MediaElementPlayer}
	 */
	mejs.MediaElementPlayer = function (node, o) {

		// enforce object, even without "new" (via John Resig)
		if (!(this instanceof mejs.MediaElementPlayer)) {
			return new mejs.MediaElementPlayer(node, o);
		}

		var t = this;

		// these will be reset after the MediaElement.success fires
		t.$media = t.$node = $(node);
		t.node = t.media = t.$media[0];

		if (!t.node) {
			return null;
		}

		// check for existing player
		if (typeof t.node.player != 'undefined') {
			return t.node.player;
		}


		// try to get options from data-mejsoptions
		if (o === undefined) {
			o = t.$node.data('mejsoptions');
		}

		// extend default options
		t.options = $.extend({}, mejs.MepDefaults, o);

		if (!t.options.timeFormat) {
			// Generate the time format according to options
			t.options.timeFormat = 'mm:ss';
			if (t.options.alwaysShowHours) {
				t.options.timeFormat = 'hh:mm:ss';
			}
			if (t.options.showTimecodeFrameCount) {
				t.options.timeFormat += ':ff';
			}
		}

		mejs.Utility.calculateTimeFormat(0, t.options, t.options.framesPerSecond || 25);

		// unique ID
		t.id = 'mep_' + mejs.mepIndex++;

		// add to player array (for focus events)
		mejs.players[t.id] = t;

		// start up
		t.init();

		return t;
	};

	/**
	 * @constructor
	 * @class {mejs.MediaElementPlayer}
	 */
	mejs.MediaElementPlayer.prototype = {

		hasFocus: false,

		controlsAreVisible: true,

		init: function () {

			var
				t = this,
				mf = mejs.MediaFeatures,
				// options for MediaElement (shim)
				meOptions = $.extend({}, t.options, {
					success: function (media, domNode) {
						t.meReady(media, domNode);
					},
					error: function (e) {
						t.handleError(e);
					}
				}),
				tagName = t.media.tagName.toLowerCase();

			t.isDynamic = (tagName !== 'audio' && tagName !== 'video');

			if (t.isDynamic) {
				// get video from src or href?
				t.isVideo = t.options.isVideo;
			} else {
				t.isVideo = (tagName !== 'audio' && t.options.isVideo);
			}

			// use native controls in iPad, iPhone, and Android
			if ((mf.isiPad && t.options.iPadUseNativeControls) || (mf.isiPhone && t.options.iPhoneUseNativeControls)) {

				// add controls and stop
				t.$media.attr('controls', 'controls');

				// attempt to fix iOS 3 bug
				//t.$media.removeAttr('poster');
				// no Issue found on iOS3 -ttroxell

				// override Apple's autoplay override for iPads
				if (mf.isiPad && t.media.getAttribute('autoplay') !== null) {
					t.play();
				}

			} else if (mf.isAndroid && t.options.AndroidUseNativeControls) {

				// leave default player

			} else if (t.isVideo || (!t.isVideo && t.options.features.length)) {

				// DESKTOP: use MediaElementPlayer controls

				// remove native controls
				t.$media.removeAttr('controls');
				var videoPlayerTitle = t.isVideo ?
					mejs.i18n.t('mejs.video-player') : mejs.i18n.t('mejs.audio-player');
				// insert description for screen readers
				$('<span class="mejs-offscreen">' + videoPlayerTitle + '</span>').insertBefore(t.$media);
				// build container
				t.container =
					$('<div id="' + t.id + '" class="mejs-container ' + (mejs.MediaFeatures.svg ? 'svg' : 'no-svg') +
						'" tabindex="0" role="application" aria-label="' + videoPlayerTitle + '">' +
						'<div class="mejs-inner">' +
						'<div class="mejs-mediaelement"></div>' +
						'<div class="mejs-layers"></div>' +
						'<div class="mejs-controls"></div>' +
						'<div class="mejs-clear"></div>' +
						'</div>' +
						'</div>')
					.addClass(t.$media[0].className)
					.insertBefore(t.$media)
					.focus(function (e) {
						if (!t.controlsAreVisible && !t.hasFocus && t.controlsEnabled) {
							t.showControls(true);
							// In versions older than IE11, the focus causes the playbar to be displayed
							// if user clicks on the Play/Pause button in the control bar once it attempts
							// to hide it
							if (!t.hasMsNativeFullScreen) {
								// If e.relatedTarget appears before container, send focus to play button,
								// else send focus to last control button.
								var btnSelector = '.mejs-playpause-button > button';

								if (mejs.Utility.isNodeAfter(e.relatedTarget, t.container[0])) {
									btnSelector = '.mejs-controls .mejs-button:last-child > button';
								}

								var button = t.container.find(btnSelector);
								button.focus();
							}
						}
					});

				// When no elements in controls, hide bar completely
				if (!t.options.features.length) {
					t.container.css('background', 'transparent').find('.mejs-controls').hide();
				}

				if (t.isVideo && t.options.stretching === 'fill' && !t.container.parent('mejs-fill-container').length) {
					// outer container
					t.outerContainer = t.$media.parent();
					t.container.wrap('<div class="mejs-fill-container"/>');
				}

				// add classes for user and content
				t.container.addClass(
					(mf.isAndroid ? 'mejs-android ' : '') +
					(mf.isiOS ? 'mejs-ios ' : '') +
					(mf.isiPad ? 'mejs-ipad ' : '') +
					(mf.isiPhone ? 'mejs-iphone ' : '') +
					(t.isVideo ? 'mejs-video ' : 'mejs-audio ')
				);


				// move the <video/video> tag into the right spot
				t.container.find('.mejs-mediaelement').append(t.$media);

				// needs to be assigned here, after iOS remap
				t.node.player = t;

				// find parts
				t.controls = t.container.find('.mejs-controls');
				t.layers = t.container.find('.mejs-layers');

				// determine the size

				/* size priority:
				 (1) videoWidth (forced),
				 (2) style="width;height;"
				 (3) width attribute,
				 (4) defaultVideoWidth (for unspecified cases)
				 */

				var tagType = (t.isVideo ? 'video' : 'audio'),
					capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);


				if (t.options[tagType + 'Width'] > 0 || t.options[tagType + 'Width'].toString().indexOf('%') > -1) {
					t.width = t.options[tagType + 'Width'];
				} else if (t.media.style.width !== '' && t.media.style.width !== null) {
					t.width = t.media.style.width;
				} else if (t.media.getAttribute('width') !== null) {
					t.width = t.$media.attr('width');
				} else {
					t.width = t.options['default' + capsTagName + 'Width'];
				}

				if (t.options[tagType + 'Height'] > 0 || t.options[tagType + 'Height'].toString().indexOf('%') > -1) {
					t.height = t.options[tagType + 'Height'];
				} else if (t.media.style.height !== '' && t.media.style.height !== null) {
					t.height = t.media.style.height;
				} else if (t.$media[0].getAttribute('height') !== null) {
					t.height = t.$media.attr('height');
				} else {
					t.height = t.options['default' + capsTagName + 'Height'];
				}

				t.initialAspectRatio = t.height / t.width;

				// set the size, while we wait for the plugins to load below
				t.setPlayerSize(t.width, t.height);

				// create MediaElementShim
				meOptions.pluginWidth = t.width;
				meOptions.pluginHeight = t.height;
			}
			// Hide media completely for audio that doesn't have any features
			else if (!t.isVideo && !t.options.features.length) {
				t.$media.hide();
			}

			// create MediaElement shim
			mejs.MediaElement(t.$media[0], meOptions);

			if (typeof(t.container) !== 'undefined' && t.options.features.length && t.controlsAreVisible) {
				// controls are shown when loaded
				t.container.trigger('controlsshown');
			}
		},

		showControls: function (doAnimation) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (t.controlsAreVisible)
				return;

			if (doAnimation) {
				t.controls
				.removeClass('mejs-offscreen')
				.stop(true, true).fadeIn(200, function () {
					t.controlsAreVisible = true;
					t.container.trigger('controlsshown');
				});

				// any additional controls people might add and want to hide
				t.container.find('.mejs-control')
				.removeClass('mejs-offscreen')
				.stop(true, true).fadeIn(200, function () {
					t.controlsAreVisible = true;
				});

			} else {
				t.controls
				.removeClass('mejs-offscreen')
				.css('display', 'block');

				// any additional controls people might add and want to hide
				t.container.find('.mejs-control')
				.removeClass('mejs-offscreen')
				.css('display', 'block');

				t.controlsAreVisible = true;
				t.container.trigger('controlsshown');
			}

			t.setControlsSize();

		},

		hideControls: function (doAnimation) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (!t.controlsAreVisible || t.options.alwaysShowControls || t.keyboardAction || t.media.paused || t.media.ended)
				return;

			if (doAnimation) {
				// fade out main controls
				t.controls.stop(true, true).fadeOut(200, function () {
					$(this)
					.addClass('mejs-offscreen')
					.css('display', 'block');

					t.controlsAreVisible = false;
					t.container.trigger('controlshidden');
				});

				// any additional controls people might add and want to hide
				t.container.find('.mejs-control').stop(true, true).fadeOut(200, function () {
					$(this)
					.addClass('mejs-offscreen')
					.css('display', 'block');
				});
			} else {

				// hide main controls
				t.controls
				.addClass('mejs-offscreen')
				.css('display', 'block');

				// hide others
				t.container.find('.mejs-control')
				.addClass('mejs-offscreen')
				.css('display', 'block');

				t.controlsAreVisible = false;
				t.container.trigger('controlshidden');
			}
		},

		controlsTimer: null,

		startControlsTimer: function (timeout) {

			var t = this;

			timeout = typeof timeout != 'undefined' ? timeout : t.options.controlsTimeoutDefault;

			t.killControlsTimer('start');

			t.controlsTimer = setTimeout(function () {
				//
				t.hideControls();
				t.killControlsTimer('hide');
			}, timeout);
		},

		killControlsTimer: function (src) {

			var t = this;

			if (t.controlsTimer !== null) {
				clearTimeout(t.controlsTimer);
				delete t.controlsTimer;
				t.controlsTimer = null;
			}
		},

		controlsEnabled: true,

		disableControls: function () {
			var t = this;

			t.killControlsTimer();
			t.hideControls(false);
			this.controlsEnabled = false;
		},

		enableControls: function () {
			var t = this;

			t.showControls(false);

			t.controlsEnabled = true;
		},

		// Sets up all controls and events
		meReady: function (media, domNode) {

			var
				t = this,
				mf = mejs.MediaFeatures,
				autoplayAttr = domNode.getAttribute('autoplay'),
				autoplay = !(autoplayAttr === undefined || autoplayAttr === null || autoplayAttr === 'false'),
				featureIndex,
				feature,
				isNative = t.media.id.match(/(native|html5)/)
				;

			// make sure it can't create itself again if a plugin reloads
			if (t.created) {
				return;
			} else {
				t.created = true;
			}

			t.media = media;
			t.domNode = domNode;

			if (!(mf.isAndroid && t.options.AndroidUseNativeControls) && !(mf.isiPad && t.options.iPadUseNativeControls) && !(mf.isiPhone && t.options.iPhoneUseNativeControls)) {

				// In the event that no features are specified for audio,
				// create only MediaElement instance rather than
				// doing all the work to create a full player
				if (!t.isVideo && !t.options.features.length) {

					// force autoplay for HTML5
					if (autoplay && isNative) {
						t.play();
					}


					if (t.options.success) {

						if (typeof t.options.success === 'string') {
							window[t.options.success](t.media, t.domNode, t);
						} else {
							t.options.success(t.media, t.domNode, t);
						}
					}

					return;
				}

				// two built in features
				t.buildposter(t, t.controls, t.layers, t.media);
				t.buildkeyboard(t, t.controls, t.layers, t.media);
				t.buildoverlays(t, t.controls, t.layers, t.media);

				// grab for use by features
				t.findTracks();

				// add user-defined features/controls
				for (featureIndex in t.options.features) {
					feature = t.options.features[featureIndex];
					if (t['build' + feature]) {
						try {
							t['build' + feature](t, t.controls, t.layers, t.media);
						} catch (e) {
							// TODO: report control error
							//throw e;
							
							
						}
					}
				}

				t.container.trigger('controlsready');

				// reset all layers and controls
				t.setPlayerSize(t.width, t.height);
				t.setControlsSize();


				// controls fade
				if (t.isVideo) {

					if (mejs.MediaFeatures.hasTouch && !t.options.alwaysShowControls) {

						// for touch devices (iOS, Android)
						// show/hide without animation on touch

						t.$media.bind('touchstart', function () {

							// toggle controls
							if (t.controlsAreVisible) {
								t.hideControls(false);
							} else {
								if (t.controlsEnabled) {
									t.showControls(false);
								}
							}
						});

					} else {

						// create callback here since it needs access to current
						// MediaElement object
						t.clickToPlayPauseCallback = function () {
							//

							if (t.options.clickToPlayPause) {
								var
									button = t.$media.closest('.mejs-container').find('.mejs-overlay-button'),
									pressed = button.attr('aria-pressed')
									;
								if (t.media.paused && pressed) {
									t.pause();
								} else if (t.media.paused) {
									t.play();
								} else {
									t.pause();
								}

								button.attr('aria-pressed', !pressed);
							}
						};

						// click to play/pause
						t.media.addEventListener('click', t.clickToPlayPauseCallback, false);

						// show/hide controls
						t.container
						.bind('mouseenter', function () {
							if (t.controlsEnabled) {
								if (!t.options.alwaysShowControls) {
									t.killControlsTimer('enter');
									t.showControls();
									t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
								}
							}
						})
						.bind('mousemove', function () {
							if (t.controlsEnabled) {
								if (!t.controlsAreVisible) {
									t.showControls();
								}
								if (!t.options.alwaysShowControls) {
									t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
								}
							}
						})
						.bind('mouseleave', function () {
							if (t.controlsEnabled) {
								if (!t.media.paused && !t.options.alwaysShowControls) {
									t.startControlsTimer(t.options.controlsTimeoutMouseLeave);
								}
							}
						});
					}

					if (t.options.hideVideoControlsOnLoad) {
						t.hideControls(false);
					}

					// check for autoplay
					if (autoplay && !t.options.alwaysShowControls) {
						t.hideControls();
					}

					// resizer
					if (t.options.enableAutosize) {
						t.media.addEventListener('loadedmetadata', function (e) {
							// if the <video height> was not set and the options.videoHeight was not set
							// then resize to the real dimensions
							if (t.options.videoHeight <= 0 && !t.domNode.getAttribute('height') && !isNaN(e.target.videoHeight)) {
								t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
								t.setControlsSize();
								t.media.setSize(e.target.videoWidth, e.target.videoHeight);
							}
						}, false);
					}
				}

				// EVENTS

				// FOCUS: when a video starts playing, it takes focus from other players (possibly pausing them)
				t.media.addEventListener('play', function () {
					var playerIndex;

					t.hasFocus = true;

					// go through all other players
					for (playerIndex in mejs.players) {
						var p = mejs.players[playerIndex];
						if (p.id !== t.id && t.options.pauseOtherPlayers && !p.paused && !p.ended) {
							p.pause();
							p.hasFocus = false;
						}
					}

				}, false);

				// ended for all
				t.media.addEventListener('ended', function (e) {
					if (t.options.autoRewind) {
						try {
							t.media.setCurrentTime(0);
							// Fixing an Android stock browser bug, where "seeked" isn't fired correctly after ending the video and jumping to the beginning
							window.setTimeout(function () {
								$(t.container).find('.mejs-overlay-loading').parent().hide();
							}, 20);
						} catch (exp) {

						}
					}

					if (typeof t.media.stop === 'function') {
						t.media.stop();
					} else {
						t.media.pause();
					}

					if (t.setProgressRail) {
						t.setProgressRail();
					}
					if (t.setCurrentRail) {
						t.setCurrentRail();
					}

					if (t.options.loop) {
						t.play();
					} else if (!t.options.alwaysShowControls && t.controlsEnabled) {
						t.showControls();
					}
				}, false);

				// resize on the first play
				t.media.addEventListener('loadedmetadata', function () {

					mejs.Utility.calculateTimeFormat(t.duration, t.options, t.options.framesPerSecond || 25);

					if (t.updateDuration) {
						t.updateDuration();
					}
					if (t.updateCurrent) {
						t.updateCurrent();
					}

					if (!t.isFullScreen) {
						t.setPlayerSize(t.width, t.height);
						t.setControlsSize();
					}
				}, false);

				// Only change the time format when necessary
				var duration = null;
				t.media.addEventListener('timeupdate', function () {
					if (duration !== this.duration) {
						duration = this.duration;
						mejs.Utility.calculateTimeFormat(duration, t.options, t.options.framesPerSecond || 25);

						// make sure to fill in and resize the controls (e.g., 00:00 => 01:13:15
						if (t.updateDuration) {
							t.updateDuration();
						}
						if (t.updateCurrent) {
							t.updateCurrent();
						}
						t.setControlsSize();

					}
				}, false);

				t.container.focusout(function (e) {
					if (e.relatedTarget) { //FF is working on supporting focusout https://bugzilla.mozilla.org/show_bug.cgi?id=687787
						var $target = $(e.relatedTarget);
						if (t.keyboardAction && $target.parents('.mejs-container').length === 0) {
							t.keyboardAction = false;
							if (t.isVideo && !t.options.alwaysShowControls) {
								t.hideControls(true);
							}

						}
					}
				});

				// webkit has trouble doing this without a delay
				setTimeout(function () {
					t.setPlayerSize(t.width, t.height);
					t.setControlsSize();
				}, 50);

				// adjust controls whenever window sizes (used to be in fullscreen only)
				t.globalBind('resize', function () {

					// don't resize for fullscreen mode
					if (!(t.isFullScreen || (mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen))) {
						t.setPlayerSize(t.width, t.height);
					}

					// always adjust controls
					t.setControlsSize();
				});

				// This is a work-around for a bug in the YouTube iFrame player, which means
				//	we can't use the play() API for the initial playback on iOS or Android;
				//	user has to start playback directly by tapping on the iFrame.
				if (t.media.id.match(/youtube_iframe/) && ( mf.isiOS || mf.isAndroid )) {
					t.container.find('.mejs-overlay-play').hide();
					t.container.find('.mejs-poster').hide();
				}
			}

			// force autoplay for HTML5
			if (autoplay && isNative) {
				t.play();
			}

			if (t.options.success) {

				if (typeof t.options.success === 'string') {
					window[t.options.success](t.media, t.domNode, t);
				} else {
					t.options.success(t.media, t.domNode, t);
				}
			}
		},

		handleError: function (e) {
			var t = this;

			if (t.controls) {
				t.disableControls();
			}

			// Tell user that the file cannot be played
			if (t.options.error) {
				t.options.error(e);
			}
		},

		setPlayerSize: function (width, height) {
			var t = this;

			if (!t.options.setDimensions) {
				return false;
			}

			if (typeof width != 'undefined') {
				t.width = width;
			}

			if (typeof height != 'undefined') {
				t.height = height;
			}

			// check stretching modes
			switch (t.options.stretching) {
				case 'fill':
					// The 'fill' effect only makes sense on video; for audio we will set the dimensions
					if (t.isVideo) {
						this.setFillMode();
					} else {
						this.setDimensions(t.width, t.height);
					}
					break;
				case 'responsive':
					this.setResponsiveMode();
					break;
				case 'none':
					this.setDimensions(t.width, t.height);
					break;
				// This is the 'auto' mode
				default:
					if (this.hasFluidMode() === true) {
						this.setResponsiveMode();
					} else {
						this.setDimensions(t.width, t.height);
					}
					break;
			}
		},

		hasFluidMode: function () {
			var t = this;

			// detect 100% mode - use currentStyle for IE since css() doesn't return percentages
			return (t.height.toString().indexOf('%') > -1 || (t.$node.css('max-width') !== 'none' && t.$node.css('max-width') !== t.width) || (t.$node[0].currentStyle && t.$node[0].currentStyle.maxWidth === '100%'));
		},

		setResponsiveMode: function () {
			var t = this;

			// do we have the native dimensions yet?
			var nativeWidth = (function () {
				if (t.isVideo) {
					if (t.media.videoWidth && t.media.videoWidth > 0) {
						return t.media.videoWidth;
					} else if (t.media.getAttribute('width') !== null) {
						return t.media.getAttribute('width');
					} else {
						return t.options.defaultVideoWidth;
					}
				} else {
					return t.options.defaultAudioWidth;
				}
			})();

			var nativeHeight = (function () {
				if (t.isVideo) {
					if (t.media.videoHeight && t.media.videoHeight > 0) {
						return t.media.videoHeight;
					} else if (t.media.getAttribute('height') !== null) {
						return t.media.getAttribute('height');
					} else {
						return t.options.defaultVideoHeight;
					}
				} else {
					return t.options.defaultAudioHeight;
				}
			})();

			// Use media aspect ratio if received; otherwise, the initially stored initial aspect ratio
			var
				aspectRatio = (function () {
					ratio = 1;
					if (!t.isVideo) {
						return ratio;
					}

					if (t.media.videoWidth && t.media.videoWidth > 0 && t.media.videoHeight && t.media.videoHeight > 0) {
						ratio = t.media.videoHeight / t.media.videoWidth;
					} else {
						ratio = t.initialAspectRatio;
					}

					if (isNaN(ratio) || ratio < 0.01 || ratio > 100) {
						ratio = 1;
					}

					return ratio;
				})(),
				parentWidth = t.container.parent().closest(':visible').width(),
				parentHeight = t.container.parent().closest(':visible').height(),
				newHeight = t.isVideo || !t.options.autosizeProgress ? parseInt(parentWidth * aspectRatio, 10) : nativeHeight;

			// If we were unable to compute newHeight, get the container height instead
			if (isNaN(newHeight)) {
				newHeight = parentHeight;
			}

			if (t.container.parent().length > 0 && t.container.parent()[0].tagName.toLowerCase() === 'body') { // && t.container.siblings().count == 0) {
				parentWidth = $(window).width();
				newHeight = $(window).height();
			}

			if (newHeight && parentWidth) {

				// set outer container size
				t.container
				.width(parentWidth)
				.height(newHeight);

				// set native <video> or <audio> and shims
				t.$media.add(t.container.find('.mejs-shim'))
				.width('100%')
				.height('100%');

				// if shim is ready, send the size to the embeded plugin
				if (t.isVideo) {
					if (t.media.setSize) {
						t.media.setSize(parentWidth, newHeight);
					}
				}

				// set the layers
				t.layers.children('.mejs-layer')
				.width('100%')
				.height('100%');
			}
		},

		setFillMode: function () {
			var t = this,
				parent = t.outerContainer;

			// Remove the responsive attributes in the event they are there
			if (t.$node.css('height') !== 'none' && t.$node.css('height') !== t.height) {
				t.$node.css('height', '');
			}
			if (t.$node.css('max-width') !== 'none' && t.$node.css('max-width') !== t.width) {
				t.$node.css('max-width', '');
			}

			if (t.$node.css('max-height') !== 'none' && t.$node.css('max-height') !== t.height) {
				t.$node.css('max-height', '');
			}

			if (t.$node[0].currentStyle) {
				if (t.$node[0].currentStyle.height === '100%') {
					t.$node[0].currentStyle.height = '';
				}
				if (t.$node[0].currentStyle.maxWidth === '100%') {
					t.$node[0].currentStyle.maxWidth = '';
				}
				if (t.$node[0].currentStyle.maxHeight === '100%') {
					t.$node[0].currentStyle.maxHeight = '';
				}
			}

			if (!parent.width()) {
				parent.height(t.$media.width());
			}

			if (!parent.height()) {
				parent.height(t.$media.height());
			}

			var parentWidth = parent.width(),
				parentHeight = parent.height();

			t.setDimensions('100%', '100%');

			// This prevents an issue when displaying poster
			t.container.find('.mejs-poster img').css('display', 'block');

			targetElement = t.container.find('object, embed, iframe, video');

			// calculate new width and height
			var initHeight = t.height,
				initWidth = t.width,
				// scale to the target width
				scaleX1 = parentWidth,
				scaleY1 = (initHeight * parentWidth) / initWidth,
				// scale to the target height
				scaleX2 = (initWidth * parentHeight) / initHeight,
				scaleY2 = parentHeight,
				// now figure out which one we should use
				bScaleOnWidth = scaleX2 > parentWidth === false,
				finalWidth = bScaleOnWidth ? Math.floor(scaleX1) : Math.floor(scaleX2),
				finalHeight = bScaleOnWidth ? Math.floor(scaleY1) : Math.floor(scaleY2);

			if (bScaleOnWidth) {
				targetElement.height(finalHeight).width(parentWidth);
				if (t.media.setSize) {
					t.media.setSize(parentWidth, finalHeight);
				}
			} else {
				targetElement.height(parentHeight).width(finalWidth);
				if (t.media.setSize) {
					t.media.setSize(finalWidth, parentHeight);
				}
			}

			targetElement.css({
				'margin-left': Math.floor((parentWidth - finalWidth) / 2),
				'margin-top': 0
			});
		},

		setDimensions: function (width, height) {
			var t = this;

			t.container
			.width(width)
			.height(height);

			t.layers.children('.mejs-layer')
			.width(width)
			.height(height);
		},

		setControlsSize: function () {
			var t = this,
				usedWidth = 0,
				railWidth = 0,
				rail = t.controls.find('.mejs-time-rail'),
				total = t.controls.find('.mejs-time-total'),
				others = rail.siblings(),
				lastControl = others.last(),
				lastControlPosition = null,
				avoidAutosizeProgress = t.options && !t.options.autosizeProgress
			;

			// skip calculation if hidden
			if (!t.container.is(':visible') || !rail.length || !rail.is(':visible')) {
				return;
			}

			// allow the size to come from custom CSS
			if (t.options && !t.options.autosizeProgress) {
				// Also, frontends devs can be more flexible
				// due the opportunity of absolute positioning.
				railWidth = parseInt(rail.css('width'), 10);
			}

			// attempt to autosize
			if (railWidth === 0 || !railWidth) {

				// find the size of all the other controls besides the rail
				others.each(function () {
					var $this = $(this);
					if ($this.css('position') != 'absolute' && $this.is(':visible')) {
						usedWidth += $(this).outerWidth(true);
					}
				});

				// fit the rail into the remaining space
				railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.width());
			}

			// resize the rail,
			// but then check if the last control (say, the fullscreen button) got pushed down
			// this often happens when zoomed
			do {
				// outer area
				// we only want to set an inline style with the width of the rail
				// if we're trying to autosize.
				if (!avoidAutosizeProgress) {
					rail.width(railWidth);
				}
				// dark space
				total.width(railWidth - (total.outerWidth(true) - total.width()));

				if (lastControl.css('position') != 'absolute') {
					lastControlPosition = lastControl.length ? lastControl.position() : null;
					railWidth--;
				}
			} while (lastControlPosition !== null && lastControlPosition.top.toFixed(2) > 0 && railWidth > 0);

			t.container.trigger('controlsresize');
		},


		buildposter: function (player, controls, layers, media) {
			var t = this,
				poster =
					$('<div class="mejs-poster mejs-layer">' +
						'</div>')
					.appendTo(layers),
				posterUrl = player.$media.attr('poster');

			// prioriy goes to option (this is useful if you need to support iOS 3.x (iOS completely fails with poster)
			if (player.options.poster !== '') {
				posterUrl = player.options.poster;
			}

			// second, try the real poster
			if (posterUrl) {
				t.setPoster(posterUrl);
			} else {
				poster.hide();
			}

			media.addEventListener('play', function () {
				poster.hide();
			}, false);

			if (player.options.showPosterWhenEnded && player.options.autoRewind) {
				media.addEventListener('ended', function () {
					poster.show();
				}, false);
			}
		},

		setPoster: function (url) {
			var t = this,
				posterDiv = t.container.find('.mejs-poster'),
				posterImg = posterDiv.find('img');

			if (posterImg.length === 0) {
				posterImg = $('<img width="100%" height="100%" alt="" />').appendTo(posterDiv);
			}

			posterImg.attr('src', url);
			posterDiv.css({'background-image': 'url(' + url + ')'});
		},

		buildoverlays: function (player, controls, layers, media) {
			var t = this;
			if (!player.isVideo)
				return;

			var
				loading =
					$('<div class="mejs-overlay mejs-layer">' +
						'<div class="mejs-overlay-loading"><span></span></div>' +
						'</div>')
					.hide() // start out hidden
					.appendTo(layers),
				error =
					$('<div class="mejs-overlay mejs-layer">' +
						'<div class="mejs-overlay-error"></div>' +
						'</div>')
					.hide() // start out hidden
					.appendTo(layers),
				// this needs to come last so it's on top
				bigPlay =
					$('<div class="mejs-overlay mejs-layer mejs-overlay-play">' +
						'<div class="mejs-overlay-button" role="button" aria-label="' + mejs.i18n.t('mejs.play') + '" aria-pressed="false"></div>' +
						'</div>')
					.appendTo(layers)
					.bind('click', function () {	 // Removed 'touchstart' due issues on Samsung Android devices where a tap on bigPlay started and immediately stopped the video
						if (t.options.clickToPlayPause) {

							var
								button = t.$media.closest('.mejs-container').find('.mejs-overlay-button'),
								pressed = button.attr('aria-pressed')
							;

							if (media.paused) {
								media.play();
							} else {
								media.pause();
							}

							button.attr('aria-pressed', !!pressed);
						}
					});

			/*
			 if (mejs.MediaFeatures.isiOS || mejs.MediaFeatures.isAndroid) {
			 bigPlay.remove();
			 loading.remove();
			 }
			 */


			// show/hide big play button
			media.addEventListener('play', function () {
				bigPlay.hide();
				loading.hide();
				controls.find('.mejs-time-buffering').hide();
				error.hide();
			}, false);

			media.addEventListener('playing', function () {
				bigPlay.hide();
				loading.hide();
				controls.find('.mejs-time-buffering').hide();
				error.hide();
			}, false);

			media.addEventListener('seeking', function () {
				loading.show();
				controls.find('.mejs-time-buffering').show();
			}, false);

			media.addEventListener('seeked', function () {
				loading.hide();
				controls.find('.mejs-time-buffering').hide();
			}, false);

			media.addEventListener('pause', function () {
				if (!mejs.MediaFeatures.isiPhone) {
					bigPlay.show();
				}
			}, false);

			media.addEventListener('waiting', function () {
				loading.show();
				controls.find('.mejs-time-buffering').show();
			}, false);


			// show/hide loading
			media.addEventListener('loadeddata', function () {
				// for some reason Chrome is firing this event
				//if (mejs.MediaFeatures.isChrome && media.getAttribute && media.getAttribute('preload') === 'none')
				//	return;

				loading.show();
				controls.find('.mejs-time-buffering').show();
				// Firing the 'canplay' event after a timeout which isn't getting fired on some Android 4.1 devices (https://github.com/johndyer/mediaelement/issues/1305)
				if (mejs.MediaFeatures.isAndroid) {
					media.canplayTimeout = window.setTimeout(
						function () {
							if (document.createEvent) {
								var evt = document.createEvent('HTMLEvents');
								evt.initEvent('canplay', true, true);
								return media.dispatchEvent(evt);
							}
						}, 300
					);
				}
			}, false);
			media.addEventListener('canplay', function () {
				loading.hide();
				controls.find('.mejs-time-buffering').hide();
				clearTimeout(media.canplayTimeout); // Clear timeout inside 'loadeddata' to prevent 'canplay' to fire twice
			}, false);

			// error handling
			media.addEventListener('error', function (e) {
				t.handleError(e);
				loading.hide();
				bigPlay.hide();
				error.show();
				error.find('.mejs-overlay-error').html("Error loading this resource");
			}, false);

			media.addEventListener('keydown', function (e) {
				t.onkeydown(player, media, e);
			}, false);
		},

		buildkeyboard: function (player, controls, layers, media) {

			var t = this;

			t.container.keydown(function () {
				t.keyboardAction = true;
			});

			// listen for key presses
			t.globalBind('keydown', function (event) {
				player.hasFocus = $(event.target).closest('.mejs-container').length !== 0 &&
					$(event.target).closest('.mejs-container').attr('id') === player.$media.closest('.mejs-container').attr('id');
				return t.onkeydown(player, media, event);
			});


			// check if someone clicked outside a player region, then kill its focus
			t.globalBind('click', function (event) {
				player.hasFocus = $(event.target).closest('.mejs-container').length !== 0;
			});

		},
		onkeydown: function (player, media, e) {
			if (player.hasFocus && player.options.enableKeyboard) {
				// find a matching key
				for (var i = 0, il = player.options.keyActions.length; i < il; i++) {
					var keyAction = player.options.keyActions[i];

					for (var j = 0, jl = keyAction.keys.length; j < jl; j++) {
						if (e.keyCode === keyAction.keys[j]) {
							if (typeof(e.preventDefault) === "function") e.preventDefault();
							keyAction.action(player, media, e.keyCode, e);
							return false;
						}
					}
				}
			}

			return true;
		},

		findTracks: function () {
			var t = this,
				tracktags = t.$media.find('track');

			// store for use by plugins
			t.tracks = [];
			tracktags.each(function (index, track) {

				track = $(track);

				t.tracks.push({
					srclang: (track.attr('srclang')) ? track.attr('srclang').toLowerCase() : '',
					src: track.attr('src'),
					kind: track.attr('kind'),
					label: track.attr('label') || '',
					entries: [],
					isLoaded: false
				});
			});
		},
		changeSkin: function (className) {
			this.container[0].className = 'mejs-container ' + className;
			this.setPlayerSize(this.width, this.height);
			this.setControlsSize();
		},
		play: function () {
			this.load();
			this.media.play();
		},
		pause: function () {
			try {
				this.media.pause();
			} catch (e) {
			}
		},
		load: function () {
			if (!this.isLoaded) {
				this.media.load();
			}

			this.isLoaded = true;
		},
		setMuted: function (muted) {
			this.media.setMuted(muted);
		},
		setCurrentTime: function (time) {
			this.media.setCurrentTime(time);
		},
		getCurrentTime: function () {
			return this.media.currentTime;
		},
		setVolume: function (volume) {
			this.media.setVolume(volume);
		},
		getVolume: function () {
			return this.media.volume;
		},
		setSrc: function (src) {
			t.media.setSrc(src);
		},
		remove: function () {
			var t = this, featureIndex, feature;

			t.container.prev('.mejs-offscreen').remove();

			// invoke features cleanup
			for (featureIndex in t.options.features) {
				feature = t.options.features[featureIndex];
				if (t['clean' + feature]) {
					try {
						t['clean' + feature](t);
					} catch (e) {
						// TODO: report control error
						//throw e;
						//
						//
					}
				}
			}

			// grab video and put it back in place
			if (!t.isDynamic) {
				t.$media.prop('controls', true);
				// detach events from the video
				// TODO: detach event listeners better than this;
				//		 also detach ONLY the events attached by this plugin!
				t.$node.clone().insertBefore(t.container).show();
				t.$node.remove();
			} else {
				t.$node.insertBefore(t.container);
			}

			var isNative = t.media.id.match(/(native|html5)/);

			if (!isNative) {
				t.media.remove();
			}

			// Remove the player from the mejs.players object so that pauseOtherPlayers doesn't blow up when trying to pause a non existent Flash API.
			delete mejs.players[t.id];

			if (typeof t.container === 'object') {
				t.container.remove();
			}
			t.globalUnbind();
			delete t.node.player;
		},
		rebuildtracks: function () {
			var t = this;
			t.findTracks();
			t.buildtracks(t, t.controls, t.layers, t.media);
		},
		resetSize: function () {
			var t = this;
			// webkit has trouble doing this without a delay
			setTimeout(function () {
				//
				t.setPlayerSize(t.width, t.height);
				t.setControlsSize();
			}, 50);
		}
	};

	(function () {
		var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;

		function splitEvents(events, id) {
			// add player ID as an event namespace so it's easier to unbind them all later
			var ret = {d: [], w: []};
			$.each((events || '').split(' '), function (k, v) {
				var eventname = v + '.' + id;
				if (eventname.indexOf('.') === 0) {
					ret.d.push(eventname);
					ret.w.push(eventname);
				}
				else {
					ret[rwindow.test(v) ? 'w' : 'd'].push(eventname);
				}
			});
			ret.d = ret.d.join(' ');
			ret.w = ret.w.join(' ');
			return ret;
		}

		mejs.MediaElementPlayer.prototype.globalBind = function (events, data, callback) {
			var t = this;
			var doc = t.node ? t.node.ownerDocument : document;

			events = splitEvents(events, t.id);
			if (events.d) $(doc).bind(events.d, data, callback);
			if (events.w) $(window).bind(events.w, data, callback);
		};

		mejs.MediaElementPlayer.prototype.globalUnbind = function (events, callback) {
			var t = this;
			var doc = t.node ? t.node.ownerDocument : document;

			events = splitEvents(events, t.id);
			if (events.d) $(doc).unbind(events.d, callback);
			if (events.w) $(window).unbind(events.w, callback);
		};
	})();

	// turn into jQuery plugin
	if (typeof $ != 'undefined') {
		$.fn.mediaelementplayer = function (options) {
			if (options === false) {
				this.each(function () {
					var player = $(this).data('mediaelementplayer');
					if (player) {
						player.remove();
					}
					$(this).removeData('mediaelementplayer');
				});
			}
			else {
				this.each(function () {
					$(this).data('mediaelementplayer', new mejs.MediaElementPlayer(this, options));
				});
			}
			return this;
		};


		$(document).ready(function () {
			// auto enable using JSON attribute
			$('.mejs-player').mediaelementplayer();
		});
	}

	// push out to window
	window.MediaElementPlayer = mejs.MediaElementPlayer;

})(mejs, mejs.$, window, document);

/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		playText: '',
		/**
		 * @type {String}
		 */
		pauseText: ''
	});

	$.extend(MediaElementPlayer.prototype, {
		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 * @public
		 */
		buildplaypause: function(player, controls, layers, media) {
			var 
				t = this,
				op = t.options,
				playTitle = op.playText ? op.playText : mejs.i18n.t('mejs.play'),
				pauseTitle = op.pauseText ? op.pauseText : mejs.i18n.t('mejs.pause'),
				play =
				$('<div class="mejs-button mejs-playpause-button mejs-play" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + playTitle + '" aria-label="' + pauseTitle + '"></button>' +
				'</div>')
				.appendTo(controls)
				.click(function(e) {
					e.preventDefault();
				
					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}
					
					return false;
				}),
				play_btn = play.find('button');


			/**
			 * @private
			 * @param {String} which - token to determine new state of button
			 */
			function togglePlayPause(which) {
				if ('play' === which) {
					play.removeClass('mejs-play').addClass('mejs-pause');
					play_btn.attr({
						'title': pauseTitle,
						'aria-label': pauseTitle
					});
				} else {
					play.removeClass('mejs-pause').addClass('mejs-play');
					play_btn.attr({
						'title': playTitle,
						'aria-label': playTitle
					});
				}
			}

			togglePlayPause('pse');

			media.addEventListener('play',function() {
				togglePlayPause('play');
			}, false);
			media.addEventListener('playing',function() {
				togglePlayPause('play');
			}, false);


			media.addEventListener('pause',function() {
				togglePlayPause('pse');
			}, false);
			media.addEventListener('paused',function() {
				togglePlayPause('pse');
			}, false);
		}
	});
	
})(mejs.$);

/**
 * Stop button
 *
 * This feature enables the displaying of a Stop button in the control bar, which basically pauses the media and rewinds
 * it to the initial position.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		stopText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildstop: function (player, controls, layers, media) {
			var
				t = this,
				stopTitle = t.options.stopText ? t.options.stopText : mejs.i18n.t('mejs.stop');

			$('<div class="mejs-button mejs-stop-button mejs-stop">' +
				'<button type="button" aria-controls="' + t.id + '" title="' + stopTitle + '" aria-label="' + stopTitle + '"></button>' +
				'</div>')
			.appendTo(controls)
			.click(function () {
				if (!media.paused) {
					media.pause();
				}
				if (media.currentTime > 0) {
					media.setCurrentTime(0);
					media.pause();
					controls.find('.mejs-time-current').width('0px');
					controls.find('.mejs-time-handle').css('left', '0px');
					controls.find('.mejs-time-float-current').html(mejs.Utility.secondsToTimeCode(0, player.options.alwaysShowHours));
					controls.find('.mejs-currenttime').html(mejs.Utility.secondsToTimeCode(0, player.options.alwaysShowHours));
					layers.find('.mejs-poster').show();
				}
			});
		}
	});

})(mejs.$);

/**
 * Progress/loaded bar
 *
 * This feature creates a progress bar with a slider in the control bar, and updates it based on native events.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * Enable tooltip that shows time in progress bar
		 * @type {Boolean}
		 */
		enableProgressTooltip: true,
		/**
		 * @type {String}
		 */
		progressHelpText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildprogress: function (player, controls, layers, media) {

			var
				t = this,
				mouseIsDown = false,
				mouseIsOver = false,
				lastKeyPressTime = 0,
				startedPaused = false,
				autoRewindInitial = player.options.autoRewind,
				progressTitle = t.options.progressHelpText ? t.options.progressHelpText : mejs.i18n.t('mejs.time-help-text'),
				tooltip = player.options.enableProgressTooltip ? '<span class="mejs-time-float">' +
				'<span class="mejs-time-float-current">00:00</span>' +
				'<span class="mejs-time-float-corner"></span>' +
				'</span>' : "";

			$('<div class="mejs-time-rail">' +
				'<span  class="mejs-time-total mejs-time-slider">' +
				//'<span class="mejs-offscreen">' + progressTitle + '</span>' +
				'<span class="mejs-time-buffering"></span>' +
				'<span class="mejs-time-loaded"></span>' +
				'<span class="mejs-time-current"></span>' +
				'<span class="mejs-time-handle"></span>' +
				tooltip +
				'</span>' +
				'</div>')
			.appendTo(controls);
			controls.find('.mejs-time-buffering').hide();

			t.total = controls.find('.mejs-time-total');
			t.loaded = controls.find('.mejs-time-loaded');
			t.current = controls.find('.mejs-time-current');
			t.handle = controls.find('.mejs-time-handle');
			t.timefloat = controls.find('.mejs-time-float');
			t.timefloatcurrent = controls.find('.mejs-time-float-current');
			t.slider = controls.find('.mejs-time-slider');

			/**
			 *
			 * @private
			 * @param {Event} e
			 */
			var handleMouseMove = function (e) {

					var offset = t.total.offset(),
						width = t.total.width(),
						percentage = 0,
						newTime = 0,
						pos = 0,
						x;

					// mouse or touch position relative to the object
					if (e.originalEvent && e.originalEvent.changedTouches) {
						x = e.originalEvent.changedTouches[0].pageX;
					} else if (e.changedTouches) { // for Zepto
						x = e.changedTouches[0].pageX;
					} else {
						x = e.pageX;
					}

					if (media.duration) {
						if (x < offset.left) {
							x = offset.left;
						} else if (x > width + offset.left) {
							x = width + offset.left;
						}

						pos = x - offset.left;
						percentage = (pos / width);
						newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

						// seek to where the mouse is
						if (mouseIsDown && newTime !== media.currentTime) {
							media.setCurrentTime(newTime);
						}

						// position floating time box
						if (!mejs.MediaFeatures.hasTouch) {
							t.timefloat.css('left', pos);
							t.timefloatcurrent.html(mejs.Utility.secondsToTimeCode(newTime, player.options.alwaysShowHours));
							t.timefloat.show();
						}
					}
				},
				/**
				 * Update elements in progress bar for accessibility purposes only when player is paused.
				 *
				 * This is to avoid attempts to repeat the time over and over again when media is playing.
				 * @private
				 */
				updateSlider = function () {

					var seconds = media.currentTime,
						timeSliderText = mejs.i18n.t('mejs.time-slider'),
						time = mejs.Utility.secondsToTimeCode(seconds, player.options.alwaysShowHours),
						duration = media.duration;

					t.slider.attr({
						'role': 'slider',
						'tabindex': 0
					});
					if (media.paused) {
						t.slider.attr({
							'aria-label': timeSliderText,
							'aria-valuemin': 0,
							'aria-valuemax': duration,
							'aria-valuenow': seconds,
							'aria-valuetext': time
						});
					} else {
						t.slider.removeAttr('aria-label aria-valuemin aria-valuemax aria-valuenow aria-valuetext');
					}
				},
				/**
				 *
				 * @private
				 */
				restartPlayer = function () {
					var now = new Date();
					if (now - lastKeyPressTime >= 1000) {
						media.play();
					}
				};

			// Events
			t.slider.bind('focus', function (e) {
				player.options.autoRewind = false;
			});

			t.slider.bind('blur', function (e) {
				player.options.autoRewind = autoRewindInitial;
			});

			t.slider.bind('keydown', function (e) {

				if ((new Date() - lastKeyPressTime) >= 1000) {
					startedPaused = media.paused;
				}

				if (t.options.keyActions.length) {

					var keyCode = e.keyCode,
						duration = media.duration,
						seekTime = media.currentTime,
						seekForward = player.options.defaultSeekForwardInterval(media),
						seekBackward = player.options.defaultSeekBackwardInterval(media);

					switch (keyCode) {
						case 37: // left
						case 40: // Down
							seekTime -= seekBackward;
							break;
						case 39: // Right
						case 38: // Up
							seekTime += seekForward;
							break;
						case 36: // Home
							seekTime = 0;
							break;
						case 35: // end
							seekTime = duration;
							break;
						case 32: // space
							if (!mejs.Utility.isFirefox) {
								if (media.paused) {
									media.play();
								} else {
									media.pause();
								}
							}
							return;
						case 13: // enter
							if (media.paused) {
								media.play();
							} else {
								media.pause();
							}
							return;
						default:
							return;
					}


					seekTime = seekTime < 0 ? 0 : (seekTime >= duration ? duration : Math.floor(seekTime));
					lastKeyPressTime = new Date();
					if (!startedPaused) {
						media.pause();
					}

					if (seekTime < media.duration && !startedPaused) {
						setTimeout(restartPlayer, 1100);
					}

					media.setCurrentTime(seekTime);

					e.preventDefault();
					e.stopPropagation();
				}
			});


			// handle clicks
			t.total
			.bind('mousedown touchstart', function (e) {
				// only handle left clicks or touch
				if (e.which === 1 || e.which === 0) {
					mouseIsDown = true;
					handleMouseMove(e);
					t.globalBind('mousemove.dur touchmove.dur', function (e) {
						handleMouseMove(e);
					});
					t.globalBind('mouseup.dur touchend.dur', function (e) {
						mouseIsDown = false;
						if (t.timefloat !== undefined) {
							t.timefloat.hide();
						}
						t.globalUnbind('.dur');
					});
				}
			})
			.bind('mouseenter', function (e) {
				mouseIsOver = true;
				t.globalBind('mousemove.dur', function (e) {
					handleMouseMove(e);
				});
				if (t.timefloat !== undefined && !mejs.MediaFeatures.hasTouch) {
					t.timefloat.show();
				}
			})
			.bind('mouseleave', function (e) {
				mouseIsOver = false;
				if (!mouseIsDown) {
					t.globalUnbind('.dur');
					if (t.timefloat !== undefined) {
						t.timefloat.hide();
					}
				}
			});

			// loading
			media.addEventListener('progress', function (e) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
			}, false);

			// current time
			media.addEventListener('timeupdate', function (e) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
				updateSlider(e);
			}, false);

			t.container.on('controlsresize', function (e) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
			});
		},

		/**
		 * Calculate the progress on the media and update progress bar's width
		 *
		 * @param {Event} e
		 */
		setProgressRail: function (e) {

			var
				t = this,
				target = (e !== undefined) ? e.target : t.media,
				percent = null;

			// newest HTML5 spec has buffered array (FF4, Webkit)
			if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
				// account for a real array with multiple values - always read the end of the last buffer
				percent = target.buffered.end(target.buffered.length - 1) / target.duration;
			}
			// Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
			// to be anything other than 0. If the byte count is available we use this instead.
			// Browsers that support the else if do not seem to have the bufferedBytes value and
			// should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
			else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
				percent = target.bufferedBytes / target.bytesTotal;
			}
			// Firefox 3 with an Ogg file seems to go this way
			else if (e && e.lengthComputable && e.total !== 0) {
				percent = e.loaded / e.total;
			}

			// finally update the progress bar
			if (percent !== null) {
				percent = Math.min(1, Math.max(0, percent));
				// update loaded bar
				if (t.loaded && t.total) {
					t.loaded.width(t.total.width() * percent);
				}
			}
		},
		/**
		 * Update the slider's width depending on the current time
		 *
		 */
		setCurrentRail: function () {

			var t = this;

			if (t.media.currentTime !== undefined && t.media.duration) {

				// update bar and handle
				if (t.total && t.handle) {
					var
						newWidth = Math.round(t.total.width() * t.media.currentTime / t.media.duration),
						handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2);

					t.current.width(newWidth);
					t.handle.css('left', handlePos);
				}
			}

		}
	});
})(mejs.$);

/**
 * Current/duration times
 *
 * This feature creates/updates the duration and progress times in the control bar, based on native events.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * The initial duration
		 * @type {Number}
		 */
		duration: 0,
		/**
		 * @type {String}
		 */
		timeAndDurationSeparator: '<span> | </span>'
	});


	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Current time constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildcurrent: function(player, controls, layers, media) {
			var t = this;
			
			$('<div class="mejs-time" role="timer" aria-live="off">' +
					'<span class="mejs-currenttime">' + 
						mejs.Utility.secondsToTimeCode(0, player.options.alwaysShowHours) +
                    '</span>'+
				'</div>')
			.appendTo(controls);
			
			t.currenttime = t.controls.find('.mejs-currenttime');

			media.addEventListener('timeupdate',function() {
				if (t.controlsAreVisible) {
					player.updateCurrent();
				}

			}, false);
		},

		/**
		 * Duration time constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildduration: function(player, controls, layers, media) {
			var t = this;
			
			if (controls.children().last().find('.mejs-currenttime').length > 0) {
				$(t.options.timeAndDurationSeparator +
					'<span class="mejs-duration">' + 
						mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours) +
					'</span>')
					.appendTo(controls.find('.mejs-time'));
			} else {

				// add class to current time
				controls.find('.mejs-currenttime').parent().addClass('mejs-currenttime-container');
				
				$('<div class="mejs-time mejs-duration-container">'+
					'<span class="mejs-duration">' + 
						mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours) +
					'</span>' +
				'</div>')
				.appendTo(controls);
			}
			
			t.durationD = t.controls.find('.mejs-duration');

			media.addEventListener('timeupdate',function() {
				if (t.controlsAreVisible) {
					player.updateDuration();
				}
			}, false);
		},

		/**
		 * Update the current time and output it in format 00:00
		 *
		 */
		updateCurrent:  function() {
			var t = this;
			
			var currentTime = t.media.currentTime;
			
			if (isNaN(currentTime)) {
				currentTime = 0;
			}

			if (t.currenttime) {
				t.currenttime.html(mejs.Utility.secondsToTimeCode(currentTime, t.options.alwaysShowHours));
			}
		},

		/**
		 * Update the duration time and output it in format 00:00
		 *
		 */
		updateDuration: function() {
			var t = this;
			
			var duration = t.media.duration;

			if (isNaN(duration) || duration == Infinity || duration < 0) {
				t.media.duration = t.options.duration = duration = 0;
			}

			if (t.options.duration > 0) {
				duration = t.options.duration;
			}

			//Toggle the long video class if the video is longer than an hour.
			t.container.toggleClass("mejs-long-video", duration > 3600);
			
			if (t.durationD && duration > 0) {
				t.durationD.html(mejs.Utility.secondsToTimeCode(duration, t.options.alwaysShowHours));
			}		
		}
	});

})(mejs.$);

/**
 * Volume button
 *
 * This feature enables the displaying of a Volume button in the control bar, and also contains logic to manipulate its
 * events, such as sliding up/down (or left/right, if vertical), muting/unmuting media, etc.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		muteText: mejs.i18n.t('mejs.mute-toggle'),
		/**
		 * @type {String}
		 */
		allyVolumeControlText: mejs.i18n.t('mejs.volume-help-text'),
		/**
		 * @type {Boolean}
		 */
		hideVolumeOnTouchDevices: true,
		/**
		 * @type {String}
		 */
		audioVolume: 'horizontal',
		/**
		 * @type {String}
		 */
		videoVolume: 'vertical'
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 * @public
		 */
		buildvolume: function (player, controls, layers, media) {

			// Android and iOS don't support volume controls
			if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices)
				return;

			var t = this,
				mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume,
				mute = (mode === 'horizontal') ?

					// horizontal version
					$('<div class="mejs-button mejs-volume-button mejs-mute">' +
						'<button type="button" aria-controls="' + t.id +
						'" title="' + t.options.muteText +
						'" aria-label="' + t.options.muteText +
						'"></button>' +
						'</div>' +
						'<a href="javascript:void(0);" class="mejs-horizontal-volume-slider">' + // outer background
						'<span class="mejs-offscreen">' + t.options.allyVolumeControlText + '</span>' +
						'<div class="mejs-horizontal-volume-total"></div>' + // line background
						'<div class="mejs-horizontal-volume-current"></div>' + // current volume
						'<div class="mejs-horizontal-volume-handle"></div>' + // handle
						'</a>'
					)
					.appendTo(controls) :

					// vertical version
					$('<div class="mejs-button mejs-volume-button mejs-mute">' +
						'<button type="button" aria-controls="' + t.id +
						'" title="' + t.options.muteText +
						'" aria-label="' + t.options.muteText +
						'"></button>' +
						'<a href="javascript:void(0);" class="mejs-volume-slider">' + // outer background
						'<span class="mejs-offscreen">' + t.options.allyVolumeControlText + '</span>' +
						'<div class="mejs-volume-total"></div>' + // line background
						'<div class="mejs-volume-current"></div>' + // current volume
						'<div class="mejs-volume-handle"></div>' + // handle
						'</a>' +
						'</div>')
					.appendTo(controls),
				volumeSlider = t.container.find('.mejs-volume-slider, .mejs-horizontal-volume-slider'),
				volumeTotal = t.container.find('.mejs-volume-total, .mejs-horizontal-volume-total'),
				volumeCurrent = t.container.find('.mejs-volume-current, .mejs-horizontal-volume-current'),
				volumeHandle = t.container.find('.mejs-volume-handle, .mejs-horizontal-volume-handle'),

				/**
				 * @private
				 * @param {Number} volume
				 * @param {Boolean} secondTry
				 */
				positionVolumeHandle = function (volume, secondTry) {

					if (!volumeSlider.is(':visible') && secondTry === undefined) {
						volumeSlider.show();
						positionVolumeHandle(volume, true);
						volumeSlider.hide();
						return;
					}

					// correct to 0-1
					volume = Math.max(0, volume);
					volume = Math.min(volume, 1);

					// adjust mute button style
					if (volume === 0) {
						mute.removeClass('mejs-mute').addClass('mejs-unmute');
						mute.children('button').attr('title', mejs.i18n.t('mejs.unmute')).attr('aria-label', mejs.i18n.t('mejs.unmute'));
					} else {
						mute.removeClass('mejs-unmute').addClass('mejs-mute');
						mute.children('button').attr('title', mejs.i18n.t('mejs.mute')).attr('aria-label', mejs.i18n.t('mejs.mute'));
					}

					// top/left of full size volume slider background
					var totalPosition = volumeTotal.position();

					// position slider
					if (mode === 'vertical') {
						var
							// height of the full size volume slider background
							totalHeight = volumeTotal.height(),

							// the new top position based on the current volume
							// 70% volume on 100px height == top:30px
							newTop = totalHeight - (totalHeight * volume);

						// handle
						volumeHandle.css('top', Math.round(totalPosition.top + newTop - (volumeHandle.height() / 2)));

						// show the current visibility
						volumeCurrent.height(totalHeight - newTop);
						volumeCurrent.css('top', totalPosition.top + newTop);
					} else {
						var
							// height of the full size volume slider background
							totalWidth = volumeTotal.width(),

							// the new left position based on the current volume
							newLeft = totalWidth * volume;

						// handle
						volumeHandle.css('left', Math.round(totalPosition.left + newLeft - (volumeHandle.width() / 2)));

						// resize the current part of the volume bar
						volumeCurrent.width(Math.round(newLeft));
					}
				},
				/**
				 * @private
				 */
				handleVolumeMove = function (e) {

					var
						volume = null,
						totalOffset = volumeTotal.offset()
					;

					// calculate the new volume based on the most recent position
					if (mode === 'vertical') {

						var
							railHeight = volumeTotal.height(),
							newY = e.pageY - totalOffset.top
						;

						volume = (railHeight - newY) / railHeight;

						// the controls just hide themselves (usually when mouse moves too far up)
						if (totalOffset.top === 0 || totalOffset.left === 0) {
							return;
						}

					} else {
						var
							railWidth = volumeTotal.width(),
							newX = e.pageX - totalOffset.left
						;

						volume = newX / railWidth;
					}

					// ensure the volume isn't outside 0-1
					volume = Math.max(0, volume);
					volume = Math.min(volume, 1);

					// position the slider and handle
					positionVolumeHandle(volume);

					// set the media object (this will trigger the `volumechanged` event)
					if (volume === 0) {
						media.setMuted(true);
					} else {
						media.setMuted(false);
					}
					media.setVolume(volume);
				},
				mouseIsDown = false,
				mouseIsOver = false;

			// SLIDER
			mute.hover(function () {
				volumeSlider.show();
				mouseIsOver = true;
			}, function () {
				mouseIsOver = false;

				if (!mouseIsDown && mode === 'vertical') {
					volumeSlider.hide();
				}
			});

			/**
			 * @private
			 */
			var updateVolumeSlider = function () {

				var volume = Math.floor(media.volume * 100);

				volumeSlider.attr({
					'aria-label': mejs.i18n.t('mejs.volume-slider'),
					'aria-valuemin': 0,
					'aria-valuemax': 100,
					'aria-valuenow': volume,
					'aria-valuetext': volume + '%',
					'role': 'slider',
					'tabindex': 0
				});

			};

			// Events
			volumeSlider
				.bind('mouseover', function () {
					mouseIsOver = true;
				})
				.bind('mousedown', function (e) {
					handleVolumeMove(e);
					t.globalBind('mousemove.vol', function (e) {
						handleVolumeMove(e);
					});
					t.globalBind('mouseup.vol', function () {
						mouseIsDown = false;
						t.globalUnbind('.vol');

						if (!mouseIsOver && mode === 'vertical') {
							volumeSlider.hide();
						}
					});
					mouseIsDown = true;

					return false;
				})
				.bind('keydown', function (e) {

					if (t.options.keyActions.length) {
						var
							keyCode = e.keyCode,
							volume = media.volume
							;
						switch (keyCode) {
							case 38: // Up
								volume = Math.min(volume + 0.1, 1);
								break;
							case 40: // Down
								volume = Math.max(0, volume - 0.1);
								break;
							default:
								return true;
						}

						mouseIsDown = false;
						positionVolumeHandle(volume);
						media.setVolume(volume);
						return false;
					}
				});

			// MUTE button
			mute.find('button').click(function () {
				media.setMuted(!media.muted);
			});

			//Keyboard input
			mute.find('button').bind('focus', function () {
				volumeSlider.show();
			});

			// listen for volume change events from other sources
			media.addEventListener('volumechange', function (e) {
				if (!mouseIsDown) {
					if (media.muted) {
						positionVolumeHandle(0);
						mute.removeClass('mejs-mute').addClass('mejs-unmute');
					} else {
						positionVolumeHandle(media.volume);
						mute.removeClass('mejs-unmute').addClass('mejs-mute');
					}
				}
				updateVolumeSlider(e);
			}, false);

			// mutes the media and sets the volume icon muted if the initial volume is set to 0
			if (player.options.startVolume === 0) {
				media.setMuted(true);
			}

			// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
			var isNative = t.media.id.match(/(native|html5)/);

			if (isNative) {
				media.setVolume(player.options.startVolume);
			}

			t.container.on('controlsresize', function () {
				if (media.muted) {
					positionVolumeHandle(0);
					mute.removeClass('mejs-mute').addClass('mejs-unmute');
				} else {
					positionVolumeHandle(media.volume);
					mute.removeClass('mejs-unmute').addClass('mejs-mute');
				}
			});
		}
	});

})(mejs.$);

/**
 * Fullscreen button
 *
 * This feature creates a button to toggle fullscreen on video; it considers a variety of possibilities when dealing with it
 * since it is not consistent across browsers. It also accounts for triggering the event through Flash shim.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {Boolean}
		 */
		usePluginFullScreen: true,
		/**
		 * @type {String}
		 */
		fullscreenText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * @type {Boolean}
		 */
		isFullScreen: false,
		/**
		 * @type {Boolean}
		 */
		isNativeFullScreen: false,
		/**
		 * @type {Boolean}
		 */
		isInIframe: false,
		/**
		 * @type {Boolean}
		 */
		isPluginClickThroughCreated: false,
		/**
		 * Possible modes
		 * (1) 'native-native'  HTML5 video  + browser fullscreen (IE10+, etc.)
		 * (2) 'plugin-native'  plugin video + browser fullscreen (fails in some versions of Firefox)
		 * (3) 'fullwindow'     Full window (retains all UI)
		 * (4) 'plugin-click'   Flash 1 - click through with pointer events
		 * (5) 'plugin-hover'   Flash 2 - hover popup in flash (IE6-8)
		 *
		 * @type {String}
		 */
		fullscreenMode: '',
		/**
		 *
		 */
		containerSizeTimeout: null,

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildfullscreen: function (player, controls, layers, media) {

			if (!player.isVideo)
				return;

			player.isInIframe = (window.location != window.parent.location);

			// detect on start
			media.addEventListener('loadstart', function () {
				player.detectFullscreenMode();
			});

			// build button
			var t = this,
				hideTimeout = null,
				fullscreenTitle = t.options.fullscreenText ? t.options.fullscreenText : mejs.i18n.t('mejs.fullscreen'),
				fullscreenBtn =
					$('<div class="mejs-button mejs-fullscreen-button">' +
						'<button type="button" aria-controls="' + t.id + '" title="' + fullscreenTitle + '" aria-label="' + fullscreenTitle + '"></button>' +
						'</div>')
					.appendTo(controls)
					.on('click', function () {

						// toggle fullscreen
						var isFullScreen = (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || player.isFullScreen;

						if (isFullScreen) {
							player.exitFullScreen();
						} else {
							player.enterFullScreen();
						}
					})
					.on('mouseover', function () {

						// very old browsers with a plugin
						if (t.fullscreenMode === 'plugin-hover') {
							if (hideTimeout !== null) {
								clearTimeout(hideTimeout);
								hideTimeout = null;
							}

							var buttonPos = fullscreenBtn.offset(),
								containerPos = player.container.offset();

							media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, true);
						}

					})
					.on('mouseout', function () {

						if (t.fullscreenMode === 'plugin-hover') {
							if (hideTimeout !== null) {
								clearTimeout(hideTimeout);
							}

							hideTimeout = setTimeout(function () {
								media.hideFullscreenButton();
							}, 1500);
						}

					});


			player.fullscreenBtn = fullscreenBtn;

			t.globalBind('keydown', function (e) {
				if (e.keyCode === 27 && ((mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || t.isFullScreen)) {
					player.exitFullScreen();
				}
			});

			t.normalHeight = 0;
			t.normalWidth = 0;

			// setup native fullscreen event
			if (mejs.MediaFeatures.hasTrueNativeFullScreen) {

				//
				/**
				 * Detect any changes on fullscreen
				 *
				 * Chrome doesn't always fire this in an `<iframe>`
				 * @private
				 */
				var fullscreenChanged = function () {
					if (player.isFullScreen) {
						if (mejs.MediaFeatures.isFullScreen()) {
							player.isNativeFullScreen = true;
							// reset the controls once we are fully in full screen
							player.setControlsSize();
						} else {
							player.isNativeFullScreen = false;
							// when a user presses ESC
							// make sure to put the player back into place
							player.exitFullScreen();
						}
					}
				};

				player.globalBind(mejs.MediaFeatures.fullScreenEventName, fullscreenChanged);
			}

		},

		/**
		 * Detect the type of fullscreen based on browser's capabilities
		 *
		 * @return {String}
		 */
		detectFullscreenMode: function () {

			var
				t = this,
				mode = '',
				features = mejs.MediaFeatures,
				isNative = t.media.id.match(/(native|html5)/)
				;

			if (features.hasTrueNativeFullScreen && isNative) {
				mode = 'native-native';
			} else if (features.hasTrueNativeFullScreen && !isNative && !features.hasFirefoxPluginMovingProblem) {
				mode = 'plugin-native';
			} else if (t.usePluginFullScreen) {
				if (mejs.MediaFeatures.supportsPointerEvents) {
					mode = 'plugin-click';
					// this needs some special setup
					t.createPluginClickThrough();
				} else {
					mode = 'plugin-hover';
				}

			} else {
				mode = 'fullwindow';
			}


			t.fullscreenMode = mode;
			return mode;
		},

		/**
		 *
		 */
		createPluginClickThrough: function () {

			var t = this;

			// don't build twice
			if (t.isPluginClickThroughCreated) {
				return;
			}

			// allows clicking through the fullscreen button and controls down directly to Flash

			/*
			 When a user puts his mouse over the fullscreen button, we disable the controls so that mouse events can go down to flash (pointer-events)
			 We then put a divs over the video and on either side of the fullscreen button
			 to capture mouse movement and restore the controls once the mouse moves outside of the fullscreen button
			 */

			var fullscreenIsDisabled = false,
				restoreControls = function () {
					if (fullscreenIsDisabled) {
						// hide the hovers
						for (var i in hoverDivs) {
							hoverDivs[i].hide();
						}

						// restore the control bar
						t.fullscreenBtn.css('pointer-events', '');
						t.controls.css('pointer-events', '');

						// prevent clicks from pausing video
						t.media.removeEventListener('click', t.clickToPlayPauseCallback);

						// store for later
						fullscreenIsDisabled = false;
					}
				},
				hoverDivs = {},
				hoverDivNames = ['top', 'left', 'right', 'bottom'],
				i, len,
				positionHoverDivs = function () {
					var fullScreenBtnOffsetLeft = fullscreenBtn.offset().left - t.container.offset().left,
						fullScreenBtnOffsetTop = fullscreenBtn.offset().top - t.container.offset().top,
						fullScreenBtnWidth = fullscreenBtn.outerWidth(true),
						fullScreenBtnHeight = fullscreenBtn.outerHeight(true),
						containerWidth = t.container.width(),
						containerHeight = t.container.height();

					for (i in hoverDivs) {
						hoverDivs[i].css({position: 'absolute', top: 0, left: 0}); //, backgroundColor: '#f00'});
					}

					// over video, but not controls
					hoverDivs.top
					.width(containerWidth)
					.height(fullScreenBtnOffsetTop);

					// over controls, but not the fullscreen button
					hoverDivs.left
					.width(fullScreenBtnOffsetLeft)
					.height(fullScreenBtnHeight)
					.css({top: fullScreenBtnOffsetTop});

					// after the fullscreen button
					hoverDivs.right
					.width(containerWidth - fullScreenBtnOffsetLeft - fullScreenBtnWidth)
					.height(fullScreenBtnHeight)
					.css({
						top: fullScreenBtnOffsetTop,
						left: fullScreenBtnOffsetLeft + fullScreenBtnWidth
					});

					// under the fullscreen button
					hoverDivs.bottom
					.width(containerWidth)
					.height(containerHeight - fullScreenBtnHeight - fullScreenBtnOffsetTop)
					.css({top: fullScreenBtnOffsetTop + fullScreenBtnHeight});
				};

			t.globalBind('resize', function () {
				positionHoverDivs();
			});

			for (i = 0, len = hoverDivNames.length; i < len; i++) {
				hoverDivs[hoverDivNames[i]] = $('<div class="mejs-fullscreen-hover" />').appendTo(t.container).mouseover(restoreControls).hide();
			}

			// on hover, kill the fullscreen button's HTML handling, allowing clicks down to Flash
			fullscreenBtn.on('mouseover', function () {

				if (!t.isFullScreen) {

					var buttonPos = fullscreenBtn.offset(),
						containerPos = player.container.offset();

					// move the button in Flash into place
					media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, false);

					// allows click through
					t.fullscreenBtn.css('pointer-events', 'none');
					t.controls.css('pointer-events', 'none');

					// restore click-to-play
					t.media.addEventListener('click', t.clickToPlayPauseCallback);

					// show the divs that will restore things
					for (i in hoverDivs) {
						hoverDivs[i].show();
					}

					positionHoverDivs();

					fullscreenIsDisabled = true;
				}

			});

			// restore controls anytime the user enters or leaves fullscreen
			media.addEventListener('fullscreenchange', function (e) {
				t.isFullScreen = !t.isFullScreen;
				// don't allow plugin click to pause video - messes with
				// plugin's controls
				if (t.isFullScreen) {
					t.media.removeEventListener('click', t.clickToPlayPauseCallback);
				} else {
					t.media.addEventListener('click', t.clickToPlayPauseCallback);
				}
				restoreControls();
			});


			// the mouseout event doesn't work on the fullscren button, because we already killed the pointer-events
			// so we use the document.mousemove event to restore controls when the mouse moves outside the fullscreen button

			t.globalBind('mousemove', function (e) {

				// if the mouse is anywhere but the fullsceen button, then restore it all
				if (fullscreenIsDisabled) {

					var fullscreenBtnPos = fullscreenBtn.offset();


					if (e.pageY < fullscreenBtnPos.top || e.pageY > fullscreenBtnPos.top + fullscreenBtn.outerHeight(true) ||
						e.pageX < fullscreenBtnPos.left || e.pageX > fullscreenBtnPos.left + fullscreenBtn.outerWidth(true)
					) {

						fullscreenBtn.css('pointer-events', '');
						t.controls.css('pointer-events', '');

						fullscreenIsDisabled = false;
					}
				}
			});


			t.isPluginClickThroughCreated = true;
		},
		/**
		 * Feature destructor.
		 *
		 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 */
		cleanfullscreen: function (player) {
			player.exitFullScreen();
		},

		/**
		 *
		 */
		enterFullScreen: function () {

			var
				t = this,
				isNative = t.media.id.match(/html5/)
				;

			if (mejs.MediaFeatures.isiOS && mejs.MediaFeatures.hasiOSFullScreen && typeof t.media.webkitEnterFullscreen === 'function') {
				t.media.webkitEnterFullscreen();
				return;
			}

			// set it to not show scroll bars so 100% will work
			$(document.documentElement).addClass('mejs-fullscreen');

			// store sizing
			t.normalHeight = t.container.height();
			t.normalWidth = t.container.width();


			// attempt to do true fullscreen
			if (t.fullscreenMode === 'native-native' || t.fullscreenMode === 'plugin-native') {

				mejs.MediaFeatures.requestFullScreen(t.container[0]);
				//return;

				if (t.isInIframe) {
					// sometimes exiting from fullscreen doesn't work
					// notably in Chrome <iframe>. Fixed in version 17
					setTimeout(function checkFullscreen() {

						if (t.isNativeFullScreen) {
							var percentErrorMargin = 0.002, // 0.2%
								windowWidth = $(window).width(),
								screenWidth = screen.width,
								absDiff = Math.abs(screenWidth - windowWidth),
								marginError = screenWidth * percentErrorMargin;

							// check if the video is suddenly not really fullscreen
							if (absDiff > marginError) {
								// manually exit
								t.exitFullScreen();
							} else {
								// test again
								setTimeout(checkFullscreen, 500);
							}
						}

					}, 1000);
				}

			} else if (t.fullscreeMode === 'fullwindow') {
				// move into position

			}

			// make full size
			t.container
			.addClass('mejs-container-fullscreen')
			.width('100%')
			.height('100%');

			// Only needed for safari 5.1 native full screen, can cause display issues elsewhere
			// Actually, it seems to be needed for IE8, too
			//if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
			t.containerSizeTimeout = setTimeout(function () {
				t.container.css({width: '100%', height: '100%'});
				t.setControlsSize();
			}, 500);
			//}

			if (isNative) {
				t.$media
				.width('100%')
				.height('100%');
			} else {
				t.container.find('iframe, embed, object')
				.width('100%')
				.height('100%');

				t.media.setSize(screen.width, screen.height);

			}

			t.layers.children('div')
			.width('100%')
			.height('100%');

			if (t.fullscreenBtn) {
				t.fullscreenBtn
				.removeClass('mejs-fullscreen')
				.addClass('mejs-unfullscreen');
			}

			t.setControlsSize();
			t.isFullScreen = true;

			t.container.find('.mejs-captions-text').css('font-size', screen.width / t.width * 1.00 * 100 + '%');
			t.container.find('.mejs-captions-position').css('bottom', '45px');

			t.container.trigger('enteredfullscreen');
		},

		/**
		 *
		 */
		exitFullScreen: function () {

			var
				t = this,
				isNative = t.media.id.match(/(native|html5)/)
				;

			// Prevent container from attempting to stretch a second time
			clearTimeout(t.containerSizeTimeout);

			// come out of native fullscreen
			if (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen)) {
				mejs.MediaFeatures.cancelFullScreen();
			}

			// restore scroll bars to document
			$(document.documentElement).removeClass('mejs-fullscreen');

			t.container
			.removeClass('mejs-container-fullscreen')
			.width(t.normalWidth)
			.height(t.normalHeight);

			if (isNative) {
				t.$media
				.width(t.normalWidth)
				.height(t.normalHeight);
			} else {
				t.container.find('iframe, embed, object')
				.width(t.normalWidth)
				.height(t.normalHeight);

				t.media.setSize(t.normalWidth, t.normalHeight);
			}

			t.layers.children('div')
			.width(t.normalWidth)
			.height(t.normalHeight);

			t.fullscreenBtn
			.removeClass('mejs-unfullscreen')
			.addClass('mejs-fullscreen');

			t.setControlsSize();
			t.isFullScreen = false;

			t.container.find('.mejs-captions-text').css('font-size', '');
			t.container.find('.mejs-captions-position').css('bottom', '');

			t.container.trigger('exitedfullscreen');
		}
	});

})(mejs.$);

/**
 * Speed button
 *
 * This feature creates a button to speed media in different levels.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * The speeds media can be accelerated
		 *
		 * Supports an array of float values or objects with format
		 * [{name: 'Slow', value: '0.75'}, {name: 'Normal', value: '1.00'}, ...]
		 * @type {{String[]|Object[]}}
		 */
		speeds: ['2.00', '1.50', '1.25', '1.00', '0.75'],
		/**
		 * @type {String}
		 */
		defaultSpeed: '1.00',
		/**
		 * @type {String}
		 */
		speedChar: 'x'

	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildspeed: function(player, controls, layers, media) {
			var
				t = this,
				isNative = t.media.id.match(/(native|html5)/)
			;

			if (!isNative) {
				return;
			}

			var
				speedButton = null,
				speedSelector = null,
				playbackSpeed = null,
				inputId = null;

			var speeds = [];
			var defaultInArray = false;
			for (var i=0, len=t.options.speeds.length; i < len; i++) {
				var s = t.options.speeds[i];
				if (typeof(s) === 'string'){
					speeds.push({
						name: s + t.options.speedChar,
						value: s
					});
					if(s === t.options.defaultSpeed) {
						defaultInArray = true;
					}
				}
				else {
					speeds.push(s);
					if(s.value === t.options.defaultSpeed) {
						defaultInArray = true;
					}
				}
			}

			if (!defaultInArray) {
				speeds.push({
					name: t.options.defaultSpeed + t.options.speedChar,
					value: t.options.defaultSpeed
				});
			}

			speeds.sort(function(a, b) {
				return parseFloat(b.value) - parseFloat(a.value);
			});

			var getSpeedNameFromValue = function(value) {
				for(i=0,len=speeds.length; i <len; i++) {
					if (speeds[i].value === value) {
						return speeds[i].name;
					}
				}
			};

			var html = '<div class="mejs-button mejs-speed-button">' +
						'<button type="button">' + getSpeedNameFromValue(t.options.defaultSpeed) + '</button>' +
						'<div class="mejs-speed-selector">' +
						'<ul>';

			for (i = 0, il = speeds.length; i<il; i++) {
				inputId = t.id + '-speed-' + speeds[i].value;
				html += '<li>' +
							'<input type="radio" name="speed" ' +
										'value="' + speeds[i].value + '" ' +
										'id="' + inputId + '" ' +
										(speeds[i].value === t.options.defaultSpeed ? ' checked' : '') +
										' />' +
							'<label for="' + inputId + '" ' +
										(speeds[i].value === t.options.defaultSpeed ? ' class="mejs-speed-selected"' : '') +
										'>' + speeds[i].name + '</label>' +
						'</li>';
			}
			html += '</ul></div></div>';

			speedButton = $(html).appendTo(controls);
			speedSelector = speedButton.find('.mejs-speed-selector');

			playbackSpeed = t.options.defaultSpeed;

			media.addEventListener('loadedmetadata', function(e) {
				if (playbackSpeed) {
					media.playbackRate = parseFloat(playbackSpeed);
				}
			}, true);

			speedSelector
				.on('click', 'input[type="radio"]', function() {
					var newSpeed = $(this).attr('value');
					playbackSpeed = newSpeed;
					media.playbackRate = parseFloat(newSpeed);
					speedButton.find('button').html(getSpeedNameFromValue(newSpeed));
					speedButton.find('.mejs-speed-selected').removeClass('mejs-speed-selected');
					speedButton.find('input[type="radio"]:checked').next().addClass('mejs-speed-selected');
				});
			speedButton
				.one( 'mouseenter focusin', function() {
					speedSelector
						.height(
							speedButton.find('.mejs-speed-selector ul').outerHeight(true) +
							speedButton.find('.mejs-speed-translations').outerHeight(true))
						.css('top', (-1 * speedSelector.height()) + 'px');
				});
		}
	});

})(mejs.$);

/**
 * Closed Captions (CC) button
 *
 * This feature enables the displaying of a CC button in the control bar, and also contains the methods to start media
 * with a certain language (if available), toggle captions, etc.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * Default language to start media using ISO 639-2 Language Code List (en, es, it, etc.)
		 * @see https://www.loc.gov/standards/iso639-2/php/code_list.php
		 * @type {String}
		 */
		startLanguage: '',
		/**
		 * @type {String}
		 */
		tracksText: '',
		/**
		 * Avoid to screen reader speak captions over an audio track.
		 *
		 * @type {Boolean}
		 */
		tracksAriaLive: false,
		/**
		 * Remove the [cc] button when no track nodes are present
		 * @type {Boolean}
		 */
		hideCaptionsButtonWhenEmpty: true,
		/**
		 * Change captions to pop-up if true and only one track node is found
		 * @type {Boolean}
		 */
		toggleCaptionsButtonWhenOnlyOne: false,
		/**
		 * @type {String}
		 */
		slidesSelector: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * @type {Boolean}
		 */
		hasChapters: false,

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildtracks: function(player, controls, layers, media) {
			if (player.tracks.length === 0) {
				return;
			}

			var
				t = this,
				attr = t.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : '',
				tracksTitle = t.options.tracksText ? t.options.tracksText : mejs.i18n.t('mejs.captions-subtitles'),
				i,
				kind
			;

			// If browser will do native captions, prefer mejs captions, loop through tracks and hide
			if (t.domNode.textTracks) {
				for (i = t.domNode.textTracks.length - 1; i >= 0; i--) {
					t.domNode.textTracks[i].mode = "hidden";
				}
			}

			t.cleartracks(player);
			player.chapters =
					$('<div class="mejs-chapters mejs-layer"></div>')
						.prependTo(layers).hide();
			player.captions =
					$('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" ' +
					attr + '><span class="mejs-captions-text"></span></div></div>')
						.prependTo(layers).hide();
			player.captionsText = player.captions.find('.mejs-captions-text');
			player.captionsButton =
					$('<div class="mejs-button mejs-captions-button">'+
						'<button type="button" aria-controls="' + t.id + '" title="' + tracksTitle + '" aria-label="' + tracksTitle + '"></button>'+
						'<div class="mejs-captions-selector">'+
							'<ul>'+
								'<li>'+
									'<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_none" value="none" checked="checked" />' +
									'<label for="' + player.id + '_captions_none">' + mejs.i18n.t('mejs.none') +'</label>'+
								'</li>'	+
							'</ul>'+
						'</div>'+
					'</div>')
						.appendTo(controls);


			var subtitleCount = 0;
			for (i=0; i<player.tracks.length; i++) {
				kind = player.tracks[i].kind;
				if (kind === 'subtitles' || kind === 'captions') {
					subtitleCount++;
				}
			}

			// if only one language then just make the button a toggle
			if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitleCount === 1){
				// click
				player.captionsButton.on('click',function() {
					if (player.selectedTrack === null) {
						lang = player.tracks[0].srclang;
					} else {
						lang = 'none';
					}
					player.setTrack(lang);
				});
			} else {
				// hover or keyboard focus
				player.captionsButton.on( 'mouseenter focusin', function() {
					$(this).find('.mejs-captions-selector').removeClass('mejs-offscreen');
				})

				// handle clicks to the language radio buttons
				.on('click','input[type=radio]',function() {
					lang = this.value;
					player.setTrack(lang);
				});

				player.captionsButton.on( 'mouseleave focusout', function() {
					$(this).find(".mejs-captions-selector").addClass("mejs-offscreen");
				});

			}

			if (!player.options.alwaysShowControls) {
				// move with controls
				player.container
					.bind('controlsshown', function () {
						// push captions above controls
						player.container.find('.mejs-captions-position').addClass('mejs-captions-position-hover');

					})
					.bind('controlshidden', function () {
						if (!media.paused) {
							// move back to normal place
							player.container.find('.mejs-captions-position').removeClass('mejs-captions-position-hover');
						}
					});
			} else {
				player.container.find('.mejs-captions-position').addClass('mejs-captions-position-hover');
			}

			player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;

			// add to list
			var total = player.tracks.length;

			for (i = 0; i < total; i++) {
				kind = player.tracks[i].kind;
				if (kind === 'subtitles' || kind === 'captions') {
					player.addTrackButton(player.tracks[i].srclang, player.tracks[i].label);
				}
			}

			// start loading tracks
			player.loadNextTrack();

			media.addEventListener('timeupdate',function() {
				player.displayCaptions();
			}, false);

			if (player.options.slidesSelector !== '') {
				player.slidesContainer = $(player.options.slidesSelector);

				media.addEventListener('timeupdate',function() {
					player.displaySlides();
				}, false);

			}

			media.addEventListener('loadedmetadata', function() {
				player.displayChapters();
			}, false);

			player.container.hover(
				function () {
					// chapters
					if (player.hasChapters) {
						player.chapters.removeClass('mejs-offscreen');
						player.chapters.fadeIn(200).height(player.chapters.find('.mejs-chapter').outerHeight());
					}
				},
				function () {
					if (player.hasChapters && !media.paused) {
						player.chapters.fadeOut(200, function() {
							$(this).addClass('mejs-offscreen');
							$(this).css('display','block');
						});
					}
				});

			t.container.on('controlsresize', function() {
				t.adjustLanguageBox();
			});

			// check for autoplay
			if (player.node.getAttribute('autoplay') !== null) {
				player.chapters.addClass('mejs-offscreen');
			}
		},

		/**
		 * Feature destructor.
		 *
		 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 */
		cleartracks: function(player){
			if (player) {
				if (player.captions) {
					player.captions.remove();
				}
				if (player.chapters) {
					player.chapters.remove();
				}
				if (player.captionsText) {
					player.captionsText.remove();
				}
				if (player.captionsButton) {
					player.captionsButton.remove();
				}
			}
		},

		/**
		 *
		 * @param {String} lang
		 */
		setTrack: function(lang){

			var
				t = this,
				i
			;

			if (lang === 'none') {
				t.selectedTrack = null;
				t.captionsButton.removeClass('mejs-captions-enabled');
			} else {
				for (i=0; i<t.tracks.length; i++) {
					if (t.tracks[i].srclang === lang) {
						if (t.selectedTrack === null)
							t.captionsButton.addClass('mejs-captions-enabled');
						t.selectedTrack = t.tracks[i];
						t.captions.attr('lang', t.selectedTrack.srclang);
						t.displayCaptions();
						break;
					}
				}
			}
		},

		/**
		 *
		 */
		loadNextTrack: function() {
			var t = this;

			t.trackToLoad++;
			if (t.trackToLoad < t.tracks.length) {
				t.isLoadingTrack = true;
				t.loadTrack(t.trackToLoad);
			} else {
				// add done?
				t.isLoadingTrack = false;

				t.checkForTracks();
			}
		},

		/**
		 *
		 * @param index
		 */
		loadTrack: function(index){
			var
				t = this,
				track = t.tracks[index],
				after = function() {

					track.isLoaded = true;

					t.enableTrackButton(track.srclang, track.label);

					t.loadNextTrack();

				}
			;

			// Load content of caption to mimic default native behavior
			$.ajax({
				url: track.src,
				dataType: 'text',
				success: function(d) {

					// parse the loaded file
					if (typeof d === "string" && (/<tt\s+xml/ig).exec(d)) {
						track.entries = mejs.TrackFormatParser.dfxp.parse(d);
					} else {
						track.entries = mejs.TrackFormatParser.webvtt.parse(d);
					}

					after();

					if (track.kind === 'chapters') {
						t.media.addEventListener('play', function() {
							if (t.media.duration > 0) {
								t.displayChapters(track);
							}
						}, false);
					}

					if (track.kind === 'slides') {
						t.setupSlides(track);
					}
				},
				error: function() {
					t.removeTrackButton(track.srclang);
					t.loadNextTrack();
				}
			});
		},

		/**
		 *
		 * @param {String} lang - The language code
		 * @param {String} label
		 */
		enableTrackButton: function(lang, label) {
			var t = this;

			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}

			t.captionsButton
				.find('input[value=' + lang + ']')
					.prop('disabled',false)
				.siblings('label')
					.html(label);

			// auto select
			if (t.options.startLanguage === lang) {
				$('#' + t.id + '_captions_' + lang).prop('checked', true).trigger('click');
			}

			t.adjustLanguageBox();
		},

		/**
		 *
		 * @param {String} lang
		 */
		removeTrackButton: function(lang) {
			var t = this;

			t.captionsButton.find('input[value=' + lang + ']').closest('li').remove();

			t.adjustLanguageBox();
		},

		/**
		 *
		 * @param {String} lang - The language code
		 * @param {String} label
		 */
		addTrackButton: function(lang, label) {
			var t = this;
			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}

			t.captionsButton.find('ul').append(
				$('<li>'+
					'<input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_' + lang + '" value="' + lang + '" disabled="disabled" />' +
					'<label for="' + t.id + '_captions_' + lang + '">' + label + ' (loading)' + '</label>'+
				'</li>')
			);

			t.adjustLanguageBox();

			// remove this from the dropdownlist (if it exists)
			t.container.find('.mejs-captions-translations option[value=' + lang + ']').remove();
		},

		/**
		 *
		 */
		adjustLanguageBox:function() {
			var t = this;
			// adjust the size of the outer box
			t.captionsButton.find('.mejs-captions-selector').height(
				t.captionsButton.find('.mejs-captions-selector ul').outerHeight(true) +
				t.captionsButton.find('.mejs-captions-translations').outerHeight(true)
			);
		},

		/**
		 *
		 */
		checkForTracks: function() {
			var
				t = this,
				hasSubtitles = false
			;

			// check if any subtitles
			if (t.options.hideCaptionsButtonWhenEmpty) {
				for (var i=0; i<t.tracks.length; i++) {
					var kind = t.tracks[i].kind;
					if ((kind === 'subtitles' || kind === 'captions') && t.tracks[i].isLoaded) {
						hasSubtitles = true;
						break;
					}
				}

				if (!hasSubtitles) {
					t.captionsButton.hide();
					t.setControlsSize();
				}
			}
		},

		/**
		 *
		 */
		displayCaptions: function() {

			if (this.tracks === undefined)
				return;

			var
				t = this,
				i,
				track = t.selectedTrack
			;

			if (track !== null && track.isLoaded) {
				for (i=0; i<track.entries.times.length; i++) {
					if (t.media.currentTime >= track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop) {
						// Set the line before the timecode as a class so the cue can be targeted if needed
						t.captionsText.html(track.entries.text[i]).attr('class', 'mejs-captions-text ' + (track.entries.times[i].identifier || ''));
						t.captions.show().height(0);
						return; // exit out if one is visible;
					}
				}
				t.captions.hide();
			} else {
				t.captions.hide();
			}
		},

		/**
		 *
		 * @param {HTMLElement} track
		 */
		setupSlides: function(track) {
			var t = this;

			t.slides = track;
			t.slides.entries.imgs = [t.slides.entries.text.length];
			t.showSlide(0);

		},

		/**
		 *
		 * @param {Number} index
		 */
		showSlide: function(index) {
			if (this.tracks === undefined || this.slidesContainer === undefined) {
				return;
			}

			var t = this,
				url = t.slides.entries.text[index],
				img = t.slides.entries.imgs[index];

			if (img === undefined || img.fadeIn === undefined) {

				t.slides.entries.imgs[index] = img = $('<img src="' + url + '">')
						.on('load', function() {
							img.appendTo(t.slidesContainer)
								.hide()
								.fadeIn()
								.siblings(':visible')
									.fadeOut();

						});

			} else {

				if (!img.is(':visible') && !img.is(':animated')) {

					//

					img.fadeIn()
						.siblings(':visible')
							.fadeOut();
				}
			}

		},

		/**
		 *
		 */
		displaySlides: function() {

			if (this.slides === undefined) {
				return;
			}

			var
				t = this,
				slides = t.slides,
				i
			;

			for (i=0; i<slides.entries.times.length; i++) {
				if (t.media.currentTime >= slides.entries.times[i].start && t.media.currentTime <= slides.entries.times[i].stop){

					t.showSlide(i);

					return; // exit out if one is visible;
				}
			}
		},

		/**
		 *
		 */
		displayChapters: function() {
			var
				t = this,
				i;

			for (i=0; i<t.tracks.length; i++) {
				if (t.tracks[i].kind === 'chapters' && t.tracks[i].isLoaded) {
					t.drawChapters(t.tracks[i]);
					t.hasChapters = true;
					break;
				}
			}
		},

		/**
		 *
		 * @param {Object} chapters
		 */
		drawChapters: function(chapters) {
			var
				t = this,
				i,
				dur,
				percent = 0,
				usedPercent = 0,
				total = chapters.entries.times.length
			;

			t.chapters.empty();

			for (i = 0; i<total; i++) {
				dur = chapters.entries.times[i].stop - chapters.entries.times[i].start;
				percent = Math.floor(dur / t.media.duration * 100);
				if (percent + usedPercent > 100 || // too large
					i === chapters.entries.times.length-1 && percent + usedPercent < 100) // not going to fill it in
					{
					percent = 100 - usedPercent;
				}
				//width = Math.floor(t.width * dur / t.media.duration);
				//left = Math.floor(t.width * chapters.entries.times[i].start / t.media.duration);
				//if (left + width > t.width) {
				//	width = t.width - left;
				//}

				t.chapters.append( $(
					'<div class="mejs-chapter" rel="' + chapters.entries.times[i].start + '" style="left: ' + usedPercent.toString() + '%;width: ' + percent.toString() + '%;">' +
						'<div class="mejs-chapter-block' + ((i==chapters.entries.times.length-1) ? ' mejs-chapter-block-last' : '') + '">' +
							'<span class="ch-title">' + chapters.entries.text[i] + '</span>' +
							'<span class="ch-time">' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].start, t.options.alwaysShowHours) + '&ndash;' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].stop, t.options.alwaysShowHours) + '</span>' +
						'</div>' +
					'</div>'));
				usedPercent += percent;
			}

			t.chapters.find('div.mejs-chapter').click(function() {
				t.media.setCurrentTime( parseFloat( $(this).attr('rel') ) );
				if (t.media.paused) {
					t.media.play();
				}
			});

			t.chapters.show();
		}
	});

	/**
	 * Map all possible languages with their respective code
	 *
	 * @constructor
	 */
	mejs.language = {
		codes:  {
			af: mejs.i18n.t('mejs.afrikaans'),
			sq: mejs.i18n.t('mejs.albanian'),
			ar: mejs.i18n.t('mejs.arabic'),
			be: mejs.i18n.t('mejs.belarusian'),
			bg: mejs.i18n.t('mejs.bulgarian'),
			ca: mejs.i18n.t('mejs.catalan'),
			zh: mejs.i18n.t('mejs.chinese'),
			'zh-cn': mejs.i18n.t('mejs.chinese-simplified'),
			'zh-tw': mejs.i18n.t('mejs.chines-traditional'),
			hr: mejs.i18n.t('mejs.croatian'),
			cs: mejs.i18n.t('mejs.czech'),
			da: mejs.i18n.t('mejs.danish'),
			nl: mejs.i18n.t('mejs.dutch'),
			en: mejs.i18n.t('mejs.english'),
			et: mejs.i18n.t('mejs.estonian'),
			fl: mejs.i18n.t('mejs.filipino'),
			fi: mejs.i18n.t('mejs.finnish'),
			fr: mejs.i18n.t('mejs.french'),
			gl: mejs.i18n.t('mejs.galician'),
			de: mejs.i18n.t('mejs.german'),
			el: mejs.i18n.t('mejs.greek'),
			ht: mejs.i18n.t('mejs.haitian-creole'),
			iw: mejs.i18n.t('mejs.hebrew'),
			hi: mejs.i18n.t('mejs.hindi'),
			hu: mejs.i18n.t('mejs.hungarian'),
			is: mejs.i18n.t('mejs.icelandic'),
			id: mejs.i18n.t('mejs.indonesian'),
			ga: mejs.i18n.t('mejs.irish'),
			it: mejs.i18n.t('mejs.italian'),
			ja: mejs.i18n.t('mejs.japanese'),
			ko: mejs.i18n.t('mejs.korean'),
			lv: mejs.i18n.t('mejs.latvian'),
			lt: mejs.i18n.t('mejs.lithuanian'),
			mk: mejs.i18n.t('mejs.macedonian'),
			ms: mejs.i18n.t('mejs.malay'),
			mt: mejs.i18n.t('mejs.maltese'),
			no: mejs.i18n.t('mejs.norwegian'),
			fa: mejs.i18n.t('mejs.persian'),
			pl: mejs.i18n.t('mejs.polish'),
			pt: mejs.i18n.t('mejs.portuguese'),
			ro: mejs.i18n.t('mejs.romanian'),
			ru: mejs.i18n.t('mejs.russian'),
			sr: mejs.i18n.t('mejs.serbian'),
			sk: mejs.i18n.t('mejs.slovak'),
			sl: mejs.i18n.t('mejs.slovenian'),
			es: mejs.i18n.t('mejs.spanish'),
			sw: mejs.i18n.t('mejs.swahili'),
			sv: mejs.i18n.t('mejs.swedish'),
			tl: mejs.i18n.t('mejs.tagalog'),
			th: mejs.i18n.t('mejs.thai'),
			tr: mejs.i18n.t('mejs.turkish'),
			uk: mejs.i18n.t('mejs.ukrainian'),
			vi: mejs.i18n.t('mejs.vietnamese'),
			cy: mejs.i18n.t('mejs.welsh'),
			yi: mejs.i18n.t('mejs.yiddish')
		}
	};

	/*
	Parses WebVTT format which should be formatted as
	================================
	WEBVTT

	1
	00:00:01,1 --> 00:00:05,000
	A line of text

	2
	00:01:15,1 --> 00:02:05,000
	A second line of text

	===============================

	Adapted from: http://www.delphiki.com/html5/playr
	*/
	mejs.TrackFormatParser = {
		webvtt: {
			/**
			 * @type {String}
			 */
			pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

			/**
			 *
			 * @param {String} trackText
			 * @returns {{text: Array, times: Array}}
			 */
			parse: function(trackText) {
				var
					i = 0,
					lines = mejs.TrackFormatParser.split2(trackText, /\r?\n/),
					entries = {text:[], times:[]},
					timecode,
					text,
					identifier;
				for(; i<lines.length; i++) {
					timecode = this.pattern_timecode.exec(lines[i]);

					if (timecode && i<lines.length) {
						if ((i - 1) >= 0 && lines[i - 1] !== '') {
							identifier = lines[i - 1];
						}
						i++;
						// grab all the (possibly multi-line) text that follows
						text = lines[i];
						i++;
						while(lines[i] !== '' && i<lines.length){
							text = text + '\n' + lines[i];
							i++;
						}
						text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
						// Text is in a different array so I can use .join
						entries.text.push(text);
						entries.times.push(
						{
							identifier: identifier,
							start: (mejs.Utility.convertSMPTEtoSeconds(timecode[1]) === 0) ? 0.200 : mejs.Utility.convertSMPTEtoSeconds(timecode[1]),
							stop: mejs.Utility.convertSMPTEtoSeconds(timecode[3]),
							settings: timecode[5]
						});
					}
					identifier = '';
				}
				return entries;
			}
		},
		// Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
		dfxp: {
			/**
			 *
			 * @param {String} trackText
			 * @returns {{text: Array, times: Array}}
			 */
			parse: function(trackText) {
				trackText = $(trackText).filter("tt");
				var
					i = 0,
					container = trackText.children("div").eq(0),
					lines = container.find("p"),
					styleNode = trackText.find("#" + container.attr("style")),
					styles,
					text,
					entries = {text:[], times:[]};


				if (styleNode.length) {
					var attributes = styleNode.removeAttr("id").get(0).attributes;
					if (attributes.length) {
						styles = {};
						for (i = 0; i < attributes.length; i++) {
							styles[attributes[i].name.split(":")[1]] = attributes[i].value;
						}
					}
				}

				for(i = 0; i<lines.length; i++) {
					var style;
					var _temp_times = {
						start: null,
						stop: null,
						style: null
					};
					if (lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("begin"));
					if (!_temp_times.start && lines.eq(i-1).attr("end")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i-1).attr("end"));
					if (lines.eq(i).attr("end")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("end"));
					if (!_temp_times.stop && lines.eq(i+1).attr("begin")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i+1).attr("begin"));
					if (styles) {
						style = "";
						for (var _style in styles) {
							style += _style + ":" + styles[_style] + ";";
						}
					}
					if (style) _temp_times.style = style;
					if (_temp_times.start === 0) _temp_times.start = 0.200;
					entries.times.push(_temp_times);
					text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.text.push(text);
				}
				return entries;
			}
		},
		/**
		 *
		 * @param {String} text
		 * @param {String} regex
		 * @returns {Array}
		 */
		split2: function (text, regex) {
			// normal version for compliant browsers
			// see below for IE fix
			return text.split(regex);
		}
	};

	// test for browsers with bad String.split method.
	if ('x\n\ny'.split(/\n/gi).length != 3) {
		// add super slow IE8 and below version
		mejs.TrackFormatParser.split2 = function(text, regex) {
			var
				parts = [],
				chunk = '',
				i;

			for (i=0; i<text.length; i++) {
				chunk += text.substring(i,i+1);
				if (regex.test(chunk)) {
					parts.push(chunk.replace(regex, ''));
					chunk = '';
				}
			}
			parts.push(chunk);
			return parts;
		};
	}

})(mejs.$);

/**
 * Loop button
 *
 * This feature creates a loop button in the control bar to toggle its behavior. It will restart media once finished
 * if activated
 */
(function($) {

	$.extend(MediaElementPlayer.prototype, {
		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildloop: function(player, controls, layers, media) {
			var 
				t = this,
				// create the loop button
				loop = 
				$('<div class="mejs-button mejs-loop-button ' + ((player.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off') + '">' +
					'<button type="button" aria-controls="' + t.id + '" title="Toggle Loop" aria-label="Toggle Loop"></button>' +
				'</div>')
				// append it to the toolbar
				.appendTo(controls)
				// add a click toggle event
				.click(function() {
					player.options.loop = !player.options.loop;
					if (player.options.loop) {
						loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
					} else {
						loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
					}
				});
		}
	});
	
})(mejs.$);

/**
 * Source chooser button
 *
 * This feature creates a button to speed media in different levels.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		sourcechooserText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildsourcechooser: function (player, controls, layers, media) {

			var
				t = this,
				sourceTitle = t.options.sourcechooserText ? t.options.sourcechooserText : mejs.i18n.t('mejs.source-chooser'),
				hoverTimeout
			;

			// add to list
			var sources = [];

			for (var j in this.node.children) {
				var s = this.node.children[j];
				if (s.nodeName === 'SOURCE') {
					sources.push(s);
				}
			}

			if (sources.length <= 1) {
				return;
			}

			player.sourcechooserButton =
				$('<div class="mejs-button mejs-sourcechooser-button">' +
					'<button type="button" role="button" aria-haspopup="true" aria-owns="' + t.id + '" title="' + sourceTitle + '" aria-label="' + sourceTitle + '"></button>' +
					'<div class="mejs-sourcechooser-selector mejs-offscreen" role="menu" aria-expanded="false" aria-hidden="true">' +
					'<ul>' +
					'</ul>' +
					'</div>' +
					'</div>')
				.appendTo(controls)

				// hover
				.hover(function () {
					clearTimeout(hoverTimeout);
					player.showSourcechooserSelector();
				}, function () {
					hoverTimeout = setTimeout(function () {
						player.hideSourcechooserSelector();
					}, 500);
				})

				// keyboard menu activation
				.on('keydown', function (e) {
					var keyCode = e.keyCode;

					switch (keyCode) {
						case 32: // space
							if (!mejs.MediaFeatures.isFirefox) { // space sends the click event in Firefox
								player.showSourcechooserSelector();
							}
							$(this).find('.mejs-sourcechooser-selector')
							.find('input[type=radio]:checked').first().focus();
							break;
						case 13: // enter
							player.showSourcechooserSelector();
							$(this).find('.mejs-sourcechooser-selector')
							.find('input[type=radio]:checked').first().focus();
							break;
						case 27: // esc
							player.hideSourcechooserSelector();
							$(this).find('button').focus();
							break;
						default:
							return true;
					}
				})

				// close menu when tabbing away
				.on('focusout', mejs.Utility.debounce(function (e) { // Safari triggers focusout multiple times
					// Firefox does NOT support e.relatedTarget to see which element
					// just lost focus, so wait to find the next focused element
					setTimeout(function () {
						var parent = $(document.activeElement).closest('.mejs-sourcechooser-selector');
						if (!parent.length) {
							// focus is outside the control; close menu
							player.hideSourcechooserSelector();
						}
					}, 0);
				}, 100))

				// handle clicks to the source radio buttons
				.delegate('input[type=radio]', 'click', function () {
					// set aria states
					$(this).attr('aria-selected', true).attr('checked', 'checked');
					$(this).closest('.mejs-sourcechooser-selector').find('input[type=radio]').not(this).attr('aria-selected', 'false').removeAttr('checked');

					var src = this.value;

					if (media.currentSrc !== src) {
						var currentTime = media.currentTime;
						var paused = media.paused;
						media.pause();
						media.setSrc(src);
						media.load();

						media.addEventListener('loadedmetadata', function (e) {
							media.currentTime = currentTime;
						}, true);

						var canPlayAfterSourceSwitchHandler = function (e) {
							if (!paused) {
								media.play();
							}
							media.removeEventListener("canplay", canPlayAfterSourceSwitchHandler, true);
						};
						media.addEventListener('canplay', canPlayAfterSourceSwitchHandler, true);
						media.load();
					}
				})

				// Handle click so that screen readers can toggle the menu
				.delegate('button', 'click', function (e) {
					if ($(this).siblings('.mejs-sourcechooser-selector').hasClass('mejs-offscreen')) {
						player.showSourcechooserSelector();
						$(this).siblings('.mejs-sourcechooser-selector').find('input[type=radio]:checked').first().focus();
					} else {
						player.hideSourcechooserSelector();
					}
				});

			for (var i in sources) {
				var src = sources[i];
				if (src.type !== undefined && src.nodeName === 'SOURCE' && media.canPlayType !== null) {
					player.addSourceButton(src.src, src.title, src.type, media.src === src.src);
				}
			}

		},

		/**
		 *
		 * @param {String} src
		 * @param {String} label
		 * @param {String} type
		 * @param {Boolean} isCurrent
		 */
		addSourceButton: function (src, label, type, isCurrent) {
			var t = this;
			if (label === '' || label === undefined) {
				label = src;
			}
			type = type.split('/')[1];

			t.sourcechooserButton.find('ul').append(
				$('<li>' +
					'<input type="radio" name="' + t.id + '_sourcechooser" id="' + t.id + '_sourcechooser_' + label + type + '" role="menuitemradio" value="' + src + '" ' + (isCurrent ? 'checked="checked"' : '') + 'aria-selected="' + isCurrent + '"' + ' />' +
					'<label for="' + t.id + '_sourcechooser_' + label + type + '" aria-hidden="true">' + label + ' (' + type + ')</label>' +
					'</li>')
			);

			t.adjustSourcechooserBox();

		},

		/**
		 *
		 */
		adjustSourcechooserBox: function () {
			var t = this;
			// adjust the size of the outer box
			t.sourcechooserButton.find('.mejs-sourcechooser-selector').height(
				t.sourcechooserButton.find('.mejs-sourcechooser-selector ul').outerHeight(true)
			);
		},

		/**
		 *
		 */
		hideSourcechooserSelector: function () {

			var t = this;

			if (t.sourcechooserButton === undefined || !t.sourcechooserButton.find('.mejs-sourcechooser-selector').find('input[type=radio]').length) {
				return;
			}

			this.sourcechooserButton.find('.mejs-sourcechooser-selector')
			.addClass('mejs-offscreen')
			.attr('aria-expanded', 'false')
			.attr('aria-hidden', 'true')
			.find('input[type=radio]') // make radios not focusable
			.attr('tabindex', '-1');
		},

		/**
		 *
		 */
		showSourcechooserSelector: function () {

			var t = this;

			if (t.sourcechooserButton === undefined || !t.sourcechooserButton.find('.mejs-sourcechooser-selector').find('input[type=radio]').length) {
				return;
			}

			this.sourcechooserButton.find('.mejs-sourcechooser-selector')
			.removeClass('mejs-offscreen')
			.attr('aria-expanded', 'true')
			.attr('aria-hidden', 'false')
			.find('input[type=radio]')
			.attr('tabindex', '0');
		}
	});

})(mejs.$);

/*
* ContextMenu Plugin
* 
*
*/

(function($) {

$.extend(mejs.MepDefaults,
	{ 'contextMenuItems': [
		// demo of a fullscreen option
		{ 
			render: function(player) {
				
				// check for fullscreen plugin
				if (player.enterFullScreen === undefined)
					return null;
			
				if (player.isFullScreen) {
					return mejs.i18n.t('mejs.fullscreen-off');
				} else {
					return mejs.i18n.t('mejs.fullscreen-on');
				}
			},
			click: function(player) {
				if (player.isFullScreen) {
					player.exitFullScreen();
				} else {
					player.enterFullScreen();
				}
			}
		},
		// demo of a mute/unmute button
		{ 
			render: function(player) {
				if (player.media.muted) {
					return mejs.i18n.t('mejs.unmute');
				} else {
					return mejs.i18n.t('mejs.mute');
				}
			},
			click: function(player) {
				if (player.media.muted) {
					player.setMuted(false);
				} else {
					player.setMuted(true);
				}
			}
		},
		// separator
		{
			isSeparator: true
		},
		// demo of simple download video
		{ 
			render: function(player) {
				return mejs.i18n.t('mejs.download-video');
			},
			click: function(player) {
				window.location.href = player.media.currentSrc;
			}
		}	
	]}
);


	$.extend(MediaElementPlayer.prototype, {
		buildcontextmenu: function(player, controls, layers, media) {
			
			// create context menu
			player.contextMenu = $('<div class="mejs-contextmenu"></div>')
								.appendTo($('body'))
								.hide();
			
			// create events for showing context menu
			player.container.bind('contextmenu', function(e) {
				if (player.isContextMenuEnabled) {
					e.preventDefault();
					player.renderContextMenu(e.clientX-1, e.clientY-1);
					return false;
				}
			});
			player.container.bind('click', function() {
				player.contextMenu.hide();
			});	
			player.contextMenu.bind('mouseleave', function() {

				//
				player.startContextMenuTimer();
				
			});		
		},

		cleancontextmenu: function(player) {
			player.contextMenu.remove();
		},
		
		isContextMenuEnabled: true,
		enableContextMenu: function() {
			this.isContextMenuEnabled = true;
		},
		disableContextMenu: function() {
			this.isContextMenuEnabled = false;
		},
		
		contextMenuTimeout: null,
		startContextMenuTimer: function() {
			//
			
			var t = this;
			
			t.killContextMenuTimer();
			
			t.contextMenuTimer = setTimeout(function() {
				t.hideContextMenu();
				t.killContextMenuTimer();
			}, 750);
		},
		killContextMenuTimer: function() {
			var timer = this.contextMenuTimer;
			
			//
			
			if (timer !== null && timer !== undefined) {
				clearTimeout(timer);
				timer = null;
			}
		},		
		
		hideContextMenu: function() {
			this.contextMenu.hide();
		},
		
		renderContextMenu: function(x,y) {
			
			// alway re-render the items so that things like "turn fullscreen on" and "turn fullscreen off" are always written correctly
			var t = this,
				html = '',
				items = t.options.contextMenuItems;
			
			for (var i=0, il=items.length; i<il; i++) {
				
				if (items[i].isSeparator) {
					html += '<div class="mejs-contextmenu-separator"></div>';
				} else {
				
					var rendered = items[i].render(t);
				
					// render can return null if the item doesn't need to be used at the moment
					if (rendered !== null && rendered !== undefined) {
						html += '<div class="mejs-contextmenu-item" data-itemindex="' + i + '" id="element-' + (Math.random()*1000000) + '">' + rendered + '</div>';
					}
				}
			}
			
			// position and show the context menu
			t.contextMenu
				.empty()
				.append($(html))
				.css({top:y, left:x})
				.show();
				
			// bind events
			t.contextMenu.find('.mejs-contextmenu-item').each(function() {
							
				// which one is this?
				var $dom = $(this),
					itemIndex = parseInt( $dom.data('itemindex'), 10 ),
					item = t.options.contextMenuItems[itemIndex];
				
				// bind extra functionality?
				if (typeof item.show != 'undefined')
					item.show( $dom , t);
				
				// bind click action
				$dom.click(function() {			
					// perform click action
					if (typeof item.click != 'undefined')
						item.click(t);
					
					// close
					t.contextMenu.hide();				
				});				
			});	
			
			// stop the controls from hiding
			setTimeout(function() {
				t.killControlsTimer('rev3');	
			}, 100);
						
		}
	});
	
})(mejs.$);
/**
 * Skip back button
 *
 * This feature creates a button to rewind media a specific number of seconds.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {Number}
		 */
		skipBackInterval: 30,
		/**
		 * @type {String}
		 */
		skipBackText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildskipback: function(player, controls, layers, media) {
			var
				t = this,
				defaultTitle = mejs.i18n.t('mejs.time-skip-back', t.options.skipBackInterval),
				skipTitle = t.options.skipBackText ? t.options.skipBackText.replace('%1', t.options.skipBackInterval) : defaultTitle,
				// create the loop button
				loop =
					$('<div class="mejs-button mejs-skip-back-button">' +
						'<button type="button" aria-controls="' + t.id + '" title="' + skipTitle + '" aria-label="' + skipTitle + '">' + t.options.skipBackInterval + '</button>' +
					'</div>')
					// append it to the toolbar
					.appendTo(controls)
					// add a click toggle event
					.click(function() {
						if (media.duration) {
							media.setCurrentTime(Math.max(media.currentTime - t.options.skipBackInterval, 0));
							$(this).find('button').blur();
						}
					});
		}
	});

})(mejs.$);

/**
 * Jump forward button
 *
 * This feature creates a button to forward media a specific number of seconds.
 */
(function ($) {
	// Jump forward button

	$.extend(mejs.MepDefaults, {
		/**
		 * @type {Number}
		 */
		jumpForwardInterval: 30,
		/**
		 * @type {String}
		 */
		jumpForwardText: ''
	});

	$.extend(MediaElementPlayer.prototype, {
		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildjumpforward: function (player, controls, layers, media) {
			var
				t = this,
				defaultTitle = mejs.i18n.t('mejs.time-jump-forward', t.options.jumpForwardInterval),
				forwardTitle = t.options.jumpForwardText ? t.options.jumpForwardText.replace('%1', t.options.jumpForwardInterval) : defaultTitle,
				// create the loop button
				loop =
					$('<div class="mejs-button mejs-jump-forward-button">' +
						'<button type="button" aria-controls="' + t.id + '" title="' + forwardTitle + '" aria-label="' + forwardTitle + '">' + t.options.jumpForwardInterval + '</button>' +
						'</div>')
					// append it to the toolbar
					.appendTo(controls)
					// add a click toggle event
					.click(function () {
						if (media.duration) {
							media.setCurrentTime(Math.min(media.currentTime + t.options.jumpForwardInterval, media.duration));
							$(this).find('button').blur();
						}
					});
		}
	});

})(mejs.$);

/**
 * Postroll plugin
 *
 * This feature allows the injection of any HTML content in an independent layer once the media finished.
 * To activate it, one of the nodes contained in the `<video>` tag must be
 * `<link href="/path/to/action_to_display_content" rel="postroll">`
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		postrollCloseText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildpostroll: function(player, controls, layers, media) {
			var
				t = this,
				postrollTitle = t.options.postrollCloseText ? t.options.postrollCloseText : mejs.i18n.t('mejs.close'),
				postrollLink = t.container.find('link[rel="postroll"]').attr('href');

			if (postrollLink !== undefined) {
				player.postroll =
					$('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + postrollTitle + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(layers).hide();

				t.media.addEventListener('ended', function (e) {
					$.ajax({
						dataType: 'html',
						url: postrollLink,
						success: function (data, textStatus) {
							layers.find('.mejs-postroll-layer-content').html(data);
						}
					});
					player.postroll.show();
				}, false);
			}
		}
	});

})(mejs.$);
/**
 * Markers plugin
 *
 * This feature allows you to add Visual Cues in the progress time rail.
 * This plugin also lets you register a custom callback function that will be called every time the play position reaches a marker.
 * Marker position and a reference to the MediaElement Player object is passed to the registered callback function for
 * any post processing. Marker color is configurable.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * Default marker color
		 * @type {String}
		 */
		markerColor: '#E9BC3D',
		/**
		 * @type {Number[]}
		 */
		markers: [],
		/**
		 * @type {Function}
		 */
		markerCallback: function () {
		}
	});

	$.extend(MediaElementPlayer.prototype, {
		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildmarkers: function (player, controls, layers, media) {
			var
				t = this,
				i = 0,
				currentPos = -1,
				currentMarker = -1,
				lastPlayPos = -1, //Track backward seek
				lastMarkerCallBack = -1; //Prevents successive firing of callbacks

			for (i = 0; i < player.options.markers.length; ++i) {
				controls.find('.mejs-time-total').append('<span class="mejs-time-marker"></span>');
			}

			media.addEventListener('durationchange', function (e) {
				player.setmarkers(controls);
			});
			media.addEventListener('timeupdate', function (e) {
				currentPos = Math.floor(media.currentTime);
				if (lastPlayPos > currentPos) {
					if (lastMarkerCallBack > currentPos) {
						lastMarkerCallBack = -1;
					}
				} else {
					lastPlayPos = currentPos;
				}

				for (i = 0; i < player.options.markers.length; ++i) {
					currentMarker = Math.floor(player.options.markers[i]);
					if (currentPos === currentMarker && currentMarker !== lastMarkerCallBack) {
						player.options.markerCallback(media, media.currentTime); //Fires the callback function
						lastMarkerCallBack = currentMarker;
					}
				}

			}, false);

		},
		/**
		 * Create markers in the progress bar
		 *
		 * @param {$} controls
		 */
		setmarkers: function (controls) {
			var t = this,
				i = 0,
				left;

			for (i = 0; i < t.options.markers.length; ++i) {
				if (Math.floor(t.options.markers[i]) <= t.media.duration && Math.floor(t.options.markers[i]) >= 0) {
					left = 100 * Math.floor(t.options.markers[i]) / t.media.duration;
					$(controls.find('.mejs-time-marker')[i]).css({
						"width": "1px",
						"left": left + "%",
						"background": t.options.markerColor
					});
				}
			}

		}
	});

})(mejs.$);