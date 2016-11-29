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
				renderer,
				rendererList = renderers !== undefined && renderers !== null && renderers.length ? renderers : t.order
			;

			for (i = 0, il = rendererList.length; i < il; i++) {
				rendererName = rendererList[i];
				renderer = t.renderers[rendererName];

				if (renderer !== null && renderer !== undefined) {
					for (j = 0, jl = mediaFiles.length; j < jl; j++) {
						if (typeof renderer.canPlayType === 'function' && typeof mediaFiles[j].type === 'string' &&
							renderer.canPlayType(mediaFiles[j].type)) {
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
							if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
								return mediaElement.renderer['get' + capName]();

								//return mediaElement.renderer[propName];
							} else {
								return null;
							}
						},
						setFn = function (value) {
							if (mediaElement.renderer !== undefined && mediaElement.renderer !== null) {
								mediaElement.renderer['set' + capName](value);
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
						type: value ? mejs.Utils.getTypeFromFile(value) : ''
					});
				} else {
					for (i = 0, il = value.length; i < il; i++) {

						var src = mejs.Utils.absolutizeUrl(value[i].src),
							type = value[i].type;

						mediaFiles.push({
							src: src,
							type: (type === '' || type === null || type === undefined) && src ? mejs.Utils.getTypeFromFile(src) : type
						});

					}
				}

				// Ensure that the original gets the first source found
				if (mediaFiles[0].src) {
					mediaElement.originalNode.setAttribute('src', mediaFiles[0].src);
				} else {
					mediaElement.originalNode.setAttribute('src', '');
				}

				// find a renderer and URL match
				renderInfo = mejs.Renderers.selectRenderer(mediaFiles,
					(options.renderers.length ? options.renderers : null));

				var event;

				// Ensure that the original gets the first source found
				if (mediaFiles[0].src) {
					mediaElement.originalNode.setAttribute('src', mediaFiles[0].src);
				} else {
					mediaElement.originalNode.setAttribute('src', '');
				}

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
					if (mediaElement.renderer !== undefined && mediaElement.renderer !== null &&
						mediaElement.renderer[methodName]) {
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

				var
					i,
					callbacks = mediaElement.events[event.type]
				;

				if (callbacks) {
					//args = Array.prototype.slice.call(arguments, 1);
					for (i = 0, il = callbacks.length; i < il; i++) {
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
				mediaElement.renderer.pause();
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
				mediaElement.rendererName = rendererName;
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
						var node = mediaElement.originalNode;
						mediaFiles.push({
							type: mejs.Utils.formatType(nodeSource, node.getAttribute('type')),
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
				mediaElement.src = mediaFiles;
			}
		}

		if (options.success) {
			options.success(mediaElement, mediaElement.originalNode);
		}

		// @todo: Verify if this is needed
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