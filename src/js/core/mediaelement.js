'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from './mejs';
import {getTypeFromFile, formatType, absolutizeUrl} from '../utils/media';
import {renderer} from './renderer';

/**
 * Media Core
 *
 * This class is the foundation to create/render different media formats.
 * @class MediaElement
 */
class MediaElement {

	constructor (idOrNode, options) {

		const t = this;

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
		t.mediaElement.options = options;

		let id = idOrNode;

		if (typeof idOrNode === 'string') {
			t.mediaElement.originalNode = document.getElementById(idOrNode);
		} else {
			t.mediaElement.originalNode = idOrNode;
			id = idOrNode.id;
		}

		id = id || `mejs_${(Math.random().toString().slice(2))}`;

		if (t.mediaElement.originalNode !== undefined && t.mediaElement.originalNode !== null &&
			t.mediaElement.appendChild) {
			// change id
			t.mediaElement.originalNode.setAttribute('id', `${id}_from_mejs`);

			// to avoid some issues with Javascript interactions in the plugin, set `preload=none` if not set
			// only if video/audio tags are detected
			const tagName = t.mediaElement.originalNode.tagName.toLowerCase();
			if (['video', 'audio'].includes(tagName) && !t.mediaElement.originalNode.getAttribute('preload')) {
				t.mediaElement.originalNode.setAttribute('preload', 'none');
			}

			// add next to this one
			t.mediaElement.originalNode.parentNode.insertBefore(t.mediaElement, t.mediaElement.originalNode);

			// insert this one inside
			t.mediaElement.appendChild(t.mediaElement.originalNode);
		} else {
			// TODO: where to put the node?
		}

		t.mediaElement.id = id;
		t.mediaElement.renderers = {};
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

			const t = this;

			// check for a match on the current renderer
			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
				t.mediaElement.renderer.name === rendererName) {
				t.mediaElement.renderer.pause();
				if (t.mediaElement.renderer.stop) {
					t.mediaElement.renderer.stop();
				}
				t.mediaElement.renderer.show();
				t.mediaElement.renderer.setSrc(mediaFiles[0].src);
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
				newRenderer.setSrc(mediaFiles[0].src);
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

					// create the renderer
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
		 * @param {number} width
		 * @param {number} height
		 */
		t.mediaElement.setSize = (width, height) => {
			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
				t.mediaElement.renderer.setSize(width, height);
			}
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
						getFn = () => (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) ? t.mediaElement.renderer[`get${capName}`]() : null,
						setFn = (value) => {
							if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
								t.mediaElement.renderer[`set${capName}`](value);
							}
						};

					addProperty(t.mediaElement, propName, getFn, setFn);
					t.mediaElement[`get${capName}`] = getFn;
					t.mediaElement[`set${capName}`] = setFn;
				}
			},
			// `src` is a property separated from the others since it carries the logic to set the proper renderer
			// based on the media files detected
			getSrc = () => (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) ? t.mediaElement.renderer.getSrc() : null,
			setSrc = (value) => {

				const mediaFiles = [];

				// clean up URLs
				if (typeof value === 'string') {
					mediaFiles.push({
						src: value,
						type: value ? getTypeFromFile(value) : ''
					});
				} else {
					for (let i = 0, total = value.length; i < total; i++) {

						const
							src = absolutizeUrl(value[i].src),
							type = value[i].type
						;

						mediaFiles.push({
							src: src,
							type: (type === '' || type === null || type === undefined) && src ?
								getTypeFromFile(src) : type
						});

					}
				}

				// find a renderer and URL match
				let
					renderInfo = renderer.select(mediaFiles,
						(t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : [])),
					event
				;

				// Ensure that the original gets the first source found
				t.mediaElement.originalNode.setAttribute('src', (mediaFiles[0].src || ''));

				// did we find a renderer?
				if (renderInfo === null) {
					event = document.createEvent('HTMLEvents');
					event.initEvent('error', false, false);
					event.message = 'No renderer found';
					t.mediaElement.dispatchEvent(event);
					return;
				}

				// turn on the renderer (this checks for the existing renderer already)
				t.mediaElement.changeRenderer(renderInfo.rendererName, mediaFiles);

				if (t.mediaElement.renderer === undefined || t.mediaElement.renderer === null) {
					event = document.createEvent('HTMLEvents');
					event.initEvent('error', false, false);
					event.message = 'Error creating renderer';
					t.mediaElement.dispatchEvent(event);
				}
			},
			assignMethods = (methodName) => {
				// run the method on the current renderer
				t.mediaElement[methodName] = (...args) => {
					return (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null &&
					typeof t.mediaElement.renderer[methodName] === 'function') ?
						t.mediaElement.renderer[methodName](args) : null;
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

		// IE && iOS
		t.mediaElement.events = {};

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

		if (t.mediaElement.originalNode !== null) {
			const mediaFiles = [];

			switch (t.mediaElement.originalNode.nodeName.toLowerCase()) {

				case 'iframe':
					mediaFiles.push({
						type: '',
						src: t.mediaElement.originalNode.getAttribute('src')
					});

					break;

				case 'audio':
				case 'video':
					let
						n,
						src,
						type,
						sources = t.mediaElement.originalNode.childNodes.length,
						nodeSource = t.mediaElement.originalNode.getAttribute('src')
						;

					// Consider if node contains the `src` and `type` attributes
					if (nodeSource) {
						const node = t.mediaElement.originalNode;
						mediaFiles.push({
							type: formatType(nodeSource, node.getAttribute('type')),
							src: nodeSource
						});
					}

					// test <source> types to see if they are usable
					for (let i = 0; i < sources; i++) {
						n = t.mediaElement.originalNode.childNodes[i];
						if (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'source') {
							src = n.getAttribute('src');
							type = formatType(src, n.getAttribute('type'));
							mediaFiles.push({type: type, src: src});
						}
					}
					break;
			}

			if (mediaFiles.length > 0) {
				t.mediaElement.src = mediaFiles;
			}
		}

		if (t.mediaElement.options.success) {
			t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
		}

		// @todo: Verify if this is needed
		// if (t.mediaElement.options.error) {
		// 	t.mediaElement.options.error(this.mediaElement, this.mediaElement.originalNode);
		// }

		return t.mediaElement;
	}
}

window.MediaElement = MediaElement;

export default MediaElement;
