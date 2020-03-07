'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from './mejs';
import {createEvent} from '../utils/general';
import {getTypeFromFile, formatType, absolutizeUrl} from '../utils/media';
import {renderer} from './renderer';
import {IS_IOS} from '../utils/constants';

/**
 * Media Core
 *
 * This class is the foundation to create/render different media formats.
 * @class MediaElement
 */
class MediaElement {

	/**
	 *
	 * @param {String|Node} idOrNode
	 * @param {Object} options
	 * @param {Object[]} sources
	 * @returns {Element|*}
	 */
	constructor (idOrNode, options, sources) {

		const t = this;

		sources = Array.isArray(sources) ? sources : null;

		t.defaults = {
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
			pluginPath: 'build/',
			/**
			 * Flag in `<object>` and `<embed>` to determine whether to use local or CDN
			 * Possible values: 'always' (CDN version) or 'sameDomain' (local files)
			 */
			shimScriptAccess: 'sameDomain'
		};

		options = Object.assign(t.defaults, options);

		// create our node (note: older versions of iOS don't support Object.defineProperty on DOM nodes)
		t.mediaElement = document.createElement(options.fakeNodeName);

		let
			id = idOrNode,
			error = false
		;

		if (typeof idOrNode === 'string') {
			t.mediaElement.originalNode = document.getElementById(idOrNode);
		} else {
			t.mediaElement.originalNode = idOrNode;
			id = idOrNode.id;
		}

		if (t.mediaElement.originalNode === undefined || t.mediaElement.originalNode === null) {
			return null;
		}

		t.mediaElement.options = options;
		id = id || `mejs_${(Math.random().toString().slice(2))}`;

		// change id
		t.mediaElement.originalNode.setAttribute('id', `${id}_from_mejs`);

		// to avoid some issues with Javascript interactions in the plugin, set `preload=none` if not set
		// only if video/audio tags are detected
		const tagName = t.mediaElement.originalNode.tagName.toLowerCase();
		if (['video', 'audio'].indexOf(tagName) > -1 && !t.mediaElement.originalNode.getAttribute('preload')) {
			t.mediaElement.originalNode.setAttribute('preload', 'none');
		}

		// add next to this one
		t.mediaElement.originalNode.parentNode.insertBefore(t.mediaElement, t.mediaElement.originalNode);

		// insert this one inside
		t.mediaElement.appendChild(t.mediaElement.originalNode);

		/**
		 * Convert a non-SSL URL to BLOB to avoid issues with regular media types playing under a SSL website
		 * @see https://poodll.com/ios-10-and-html5-video-and-html5-audio-on-https-sites/
		 * @private
		 */
		const processURL = (url, type) => {
			if (window.location.protocol === 'https:' && url.indexOf('http:') === 0 && IS_IOS && mejs.html5media.mediaTypes.indexOf(type) > -1) {
				const xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
					if (this.readyState === 4 && this.status === 200) {
						const
							url = window.URL || window.webkitURL,
							blobUrl = url.createObjectURL(this.response)
						;
						t.mediaElement.originalNode.setAttribute('src', blobUrl);
						return blobUrl;
					}
					return url;
				};
				xhr.open('GET', url);
				xhr.responseType = 'blob';
				xhr.send();
			}

			return url;
		};

		let mediaFiles;

		if (sources !== null) {
			mediaFiles = sources;
		} else if (t.mediaElement.originalNode !== null) {

			mediaFiles = [];

			switch (t.mediaElement.originalNode.nodeName.toLowerCase()) {
				case 'iframe':
					mediaFiles.push({
						type: '',
						src: t.mediaElement.originalNode.getAttribute('src')
					});
					break;
				case 'audio':
				case 'video':
					const
						sources = t.mediaElement.originalNode.children.length,
						nodeSource = t.mediaElement.originalNode.getAttribute('src')
					;

					// Consider if node contains the `src` and `type` attributes
					if (nodeSource) {
						const
							node = t.mediaElement.originalNode,
							type = formatType(nodeSource, node.getAttribute('type'))
						;
						mediaFiles.push({
							type: type,
							src: processURL(nodeSource, type)
						});
					}

					// test <source> types to see if they are usable
					for (let i = 0; i < sources; i++) {
						const n = t.mediaElement.originalNode.children[i];
						if (n.tagName.toLowerCase() === 'source') {
							const
								src = n.getAttribute('src'),
								type = formatType(src, n.getAttribute('type'))
							;
							mediaFiles.push({type: type, src: processURL(src, type)});
						}
					}
					break;
			}
		}

		t.mediaElement.id = id;
		t.mediaElement.renderers = {};
		t.mediaElement.events = {};
		t.mediaElement.promises = [];
		t.mediaElement.renderer = null;
		t.mediaElement.rendererName = null;

		/**
		 * Determine whether the renderer was found or not
		 *
		 * @public
		 * @param {String} rendererName
		 * @param {Object[]} mediaFiles
		 * @return {Boolean}
		 */
		t.mediaElement.changeRenderer = (rendererName, mediaFiles) => {

			const
				t = this,
				// If the first element of `mediaFiles` contain more than `src` and `type`
				// pass the entire object; otherwise, just `src`
				media = Object.keys(mediaFiles[0]).length > 2 ? mediaFiles[0] : mediaFiles[0].src
			;

			// check for a match on the current renderer
			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
				t.mediaElement.renderer.name === rendererName) {
				t.mediaElement.renderer.pause();
				if (t.mediaElement.renderer.stop) {
					t.mediaElement.renderer.stop();
				}
				t.mediaElement.renderer.show();
				t.mediaElement.renderer.setSrc(media);
				return true;
			}

			// if existing renderer is not the right one, then hide it
			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
				t.mediaElement.renderer.pause();
				if (t.mediaElement.renderer.stop) {
					t.mediaElement.renderer.stop();
				}
				t.mediaElement.renderer.hide();
			}

			// see if we have the renderer already created
			let
				newRenderer = t.mediaElement.renderers[rendererName],
				newRendererType = null
			;

			if (newRenderer !== undefined && newRenderer !== null) {
				newRenderer.show();
				newRenderer.setSrc(media);
				t.mediaElement.renderer = newRenderer;
				t.mediaElement.rendererName = rendererName;
				return true;
			}

			const rendererArray = t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers :
				renderer.order;

			// find the desired renderer in the array of possible ones
			for (let i = 0, total = rendererArray.length; i < total; i++) {
				const index = rendererArray[i];

				if (index === rendererName) {
					const rendererList = renderer.renderers;
					newRendererType = rendererList[index];

					const renderOptions = Object.assign(newRendererType.options, t.mediaElement.options);
					newRenderer = newRendererType.create(t.mediaElement, renderOptions, mediaFiles);
					newRenderer.name = rendererName;

					// store for later
					t.mediaElement.renderers[newRendererType.name] = newRenderer;
					t.mediaElement.renderer = newRenderer;
					t.mediaElement.rendererName = rendererName;
					newRenderer.show();
					return true;
				}
			}

			return false;
		};

		/**
		 * Set the element dimensions based on selected renderer's setSize method
		 *
		 * @public
		 * @param {Number} width
		 * @param {Number} height
		 */
		t.mediaElement.setSize = (width, height) => {
			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
				t.mediaElement.renderer.setSize(width, height);
			}
		};

		/**
		 *
		 * @public
		 * @param {String} message
		 * @param {Object[]} urlList
		 */
		t.mediaElement.generateError = (message, urlList) => {
			message = message || '';
			urlList = Array.isArray(urlList) ? urlList : [];
			const event = createEvent('error', t.mediaElement);
			event.message = message;
			event.urls = urlList;
			t.mediaElement.dispatchEvent(event);
			error = true;
		};

		const
			props = mejs.html5media.properties,
			methods = mejs.html5media.methods,
			addProperty = (obj, name, onGet, onSet) => {

				// wrapper functions
				let oldValue = obj[name];
				const
					getFn = () => onGet.apply(obj, [oldValue]),
					setFn = (newValue) => {
						oldValue = onSet.apply(obj, [newValue]);
						return oldValue;
					};

				Object.defineProperty(obj, name, {
					get: getFn,
					set: setFn
				});
			},
			assignGettersSetters = (propName) => {
				if (propName !== 'src') {

					const
						capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`,
						getFn = () => (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
							typeof t.mediaElement.renderer[`get${capName}`] === 'function') ? t.mediaElement.renderer[`get${capName}`]() : null,
						setFn = (value) => {
							if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
								typeof t.mediaElement.renderer[`set${capName}`] === 'function') {
								t.mediaElement.renderer[`set${capName}`](value);
							}
						};

					addProperty(t.mediaElement, propName, getFn, setFn);
					t.mediaElement[`get${capName}`] = getFn;
					t.mediaElement[`set${capName}`] = setFn;
				}
			},
			// `src` is a property separated from the others since it carries the logic to set the proper renderer
			// based on the media files detected;
			// `setSrc` can accept a URL string, an object with at least `src` or an Array of objects
			getSrc = () => (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) ? t.mediaElement.renderer.getSrc() : null,
			setSrc = (value) => {
				const mediaFiles = [];

				if (typeof value === 'string') {
					mediaFiles.push({
						src: value,
						type: value ? getTypeFromFile(value) : ''
					});
				} else if (typeof value === 'object' && value.src !== undefined) {
					const
						src = absolutizeUrl(value.src),
						type = value.type,
						media = Object.assign(value, {
							src: src,
							type: (type === '' || type === null || type === undefined) && src ?
								getTypeFromFile(src) : type
						})
					;
					mediaFiles.push(media);

				} else if (Array.isArray(value)) {
					for (let i = 0, total = value.length; i < total; i++) {

						const
							src = absolutizeUrl(value[i].src),
							type = value[i].type,
							media = Object.assign(value[i], {
								src: src,
								type: (type === '' || type === null || type === undefined) && src ?
									getTypeFromFile(src) : type
							})
						;

						mediaFiles.push(media);
					}
				}

				// find a renderer and URL match
				let
					renderInfo = renderer.select(mediaFiles,
						(t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : [])),
					event
				;

				// Ensure that the original gets the first source found
				if (!t.mediaElement.paused && !(t.mediaElement.src == null || t.mediaElement.src === '')) {
					t.mediaElement.pause();
					event = createEvent('pause', t.mediaElement);
					t.mediaElement.dispatchEvent(event);
				}
				t.mediaElement.originalNode.src = (mediaFiles[0].src || '');

				// At least there must be a media in the `mediaFiles` since the media tag can come up an
				// empty source for starters
				if (renderInfo === null && mediaFiles[0].src) {
					t.mediaElement.generateError('No renderer found', mediaFiles);
					return;
				}

				// turn on the renderer (this checks for the existing renderer already)
				var shouldChangeRenderer = !(mediaFiles[0].src == null || mediaFiles[0].src === '');
				return shouldChangeRenderer ? t.mediaElement.changeRenderer(renderInfo.rendererName, mediaFiles) : null;
			},
			triggerAction = (methodName, args) => {
				try {
                        // Sometimes, playing native DASH media might throw `DOMException: The play() request was interrupted`.
                        // Add this for native HLS playback as well
                        if (methodName === 'play' &&
                        (t.mediaElement.rendererName === 'native_dash' || t.mediaElement.rendererName === 'native_hls' || t.mediaElement.rendererName === 'vimeo_iframe')) {
						const response = t.mediaElement.renderer[methodName](args);
						if (response && typeof response.then === 'function') {
							response.catch(() => {
								if (t.mediaElement.paused) {
									setTimeout(() => {
										const tmpResponse = t.mediaElement.renderer.play();
										if (tmpResponse !== undefined) {
											// Final attempt: pause the media if not paused
											tmpResponse.catch(() => {
												if (!t.mediaElement.renderer.paused) {
													t.mediaElement.renderer.pause();
												}
											});
										}
									}, 150);
								}
							});
						}
					} else {
						t.mediaElement.renderer[methodName](args);
					}
				} catch (e) {
					t.mediaElement.generateError(e, mediaFiles);
				}
			},
			assignMethods = (methodName) => {
				t.mediaElement[methodName] = (...args) => {
					if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
						typeof t.mediaElement.renderer[methodName] === 'function') {
						if (t.mediaElement.promises.length) {
							Promise.all(t.mediaElement.promises).then(() => {
								triggerAction(methodName, args);
							}).catch((e) => {
								t.mediaElement.generateError(e, mediaFiles);
							});
						} else {
							triggerAction(methodName, args);
						}
					}
					return null;
				};
			};

		// Assign all methods/properties/events to fake node if renderer was found
		addProperty(t.mediaElement, 'src', getSrc, setSrc);
		t.mediaElement.getSrc = getSrc;
		t.mediaElement.setSrc = setSrc;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		for (let i = 0, total = methods.length; i < total; i++) {
			assignMethods(methods[i]);
		}

		// start: fake events
		t.mediaElement.addEventListener = (eventName, callback) => {
			// create or find the array of callbacks for this eventName
			t.mediaElement.events[eventName] = t.mediaElement.events[eventName] || [];

			// push the callback into the stack
			t.mediaElement.events[eventName].push(callback);
		};
		t.mediaElement.removeEventListener = (eventName, callback) => {
			// no eventName means remove all listeners
			if (!eventName) {
				t.mediaElement.events = {};
				return true;
			}

			// see if we have any callbacks for this eventName
			const callbacks = t.mediaElement.events[eventName];

			if (!callbacks) {
				return true;
			}

			// check for a specific callback
			if (!callback) {
				t.mediaElement.events[eventName] = [];
				return true;
			}

			// remove the specific callback
			for (let i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === callback) {
					t.mediaElement.events[eventName].splice(i, 1);
					return true;
				}
			}
			return false;
		};

		/**
		 *
		 * @param {Event} event
		 */
		t.mediaElement.dispatchEvent = (event) => {
			const callbacks = t.mediaElement.events[event.type];
			if (callbacks) {
				for (let i = 0; i < callbacks.length; i++) {
					callbacks[i].apply(null, [event]);
				}
			}
		};

		/**
		 * Remove `mediaelement` completely and restore original media tag
		 */
		t.mediaElement.destroy = () => {
			const mediaElement = t.mediaElement.originalNode.cloneNode(true);
			const wrapper = t.mediaElement.parentElement;
			mediaElement.removeAttribute('id');
			mediaElement.remove();
			t.mediaElement.remove();
			wrapper.appendChild(mediaElement);
		};

		// Set the best match based on renderers
		if (mediaFiles.length) {
			t.mediaElement.src = mediaFiles;
		}

		if (t.mediaElement.promises.length) {
			Promise.all(t.mediaElement.promises)
			.then(() => {
				if (t.mediaElement.options.success) {
					t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
				}
			}).catch(() => {
				if (error && t.mediaElement.options.error) {
					t.mediaElement.options.error(t.mediaElement, t.mediaElement.originalNode);
				}
			});
		} else {
			if (t.mediaElement.options.success) {
				t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
			}

			if (error && t.mediaElement.options.error) {
				t.mediaElement.options.error(t.mediaElement, t.mediaElement.originalNode);
			}
		}

		return t.mediaElement;
	}
}

window.MediaElement = MediaElement;
mejs.MediaElement = MediaElement;

export default MediaElement;
