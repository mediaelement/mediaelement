'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
import {HAS_MSE} from '../utils/constants';
import {typeChecks} from '../utils/media';

/**
 * Native FLV renderer
 *
 * Uses flv.js, which is a JavaScript library which implements mechanisms to play flv files inspired by flv.js.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * Currently, it can only play files with the same origin.
 *
 * @see https://github.com/Bilibili/flv.js
 *
 */
const NativeFlv = {
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
	 * Create a queue to prepare the loading of an FLV source
	 * @param {Object} settings - an object with settings needed to load an FLV player instance
	 */
	prepareSettings: (settings) => {
		if (NativeFlv.isLoaded) {
			NativeFlv.createInstance(settings);
		} else {
			NativeFlv.loadScript(settings);
			NativeFlv.creationQueue.push(settings);
		}
	},

	/**
	 * Load flv.js script on the header of the document
	 *
	 * @param {Object} settings - an object with settings needed to load an FLV player instance
	 */
	loadScript: (settings) => {

		// Skip script loading since it is already loaded
		if (typeof flvjs !== 'undefined') {
			NativeFlv.createInstance(settings);
		} else if (!NativeFlv.isMediaStarted) {

			settings.options.path = typeof settings.options.path === 'string' ?
				settings.options.path : '//cdnjs.cloudflare.com/ajax/libs/flv.js/1.1.0/flv.min.js';

			const
				script = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0]
			;

			let done = false;

			script.src = settings.options.path;

			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function () {
				if (!done && (!this.readyState || this.readyState === undefined ||
					this.readyState === 'loaded' || this.readyState === 'complete')) {
					done = true;
					NativeFlv.mediaReady();
					script.onload = script.onreadystatechange = null;
				}
			};

			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
			NativeFlv.isMediaStarted = true;
		}
	},

	/**
	 * Process queue of FLV player creation
	 *
	 */
	mediaReady: () => {
		NativeFlv.isLoaded = true;
		NativeFlv.isMediaLoaded = true;

		while (NativeFlv.creationQueue.length > 0) {
			const settings = NativeFlv.creationQueue.pop();
			NativeFlv.createInstance(settings);
		}
	},

	/**
	 * Create a new instance of FLV player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to instantiate FLV object
	 */
	createInstance: (settings) => {
		const player = flvjs.createPlayer(settings.options);
		window[`__ready__${settings.id}`](player);
	}
};

const FlvNativeRenderer = {
	name: 'native_flv',

	options: {
		prefix: 'native_flv',
		flv: {
			// Special config: used to set the local path/URL of flv.js library
			path: '//cdnjs.cloudflare.com/ajax/libs/flv.js/1.1.0/flv.min.js',
			// To modify more elements from FLV player,
			// see https://github.com/Bilibili/flv.js/blob/master/docs/api.md#config
			cors: true
		}
	},
	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {Boolean}
	 */
	canPlayType: (type) => HAS_MSE && ['video/x-flv', 'video/flv'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		const
			originalNode = mediaElement.originalNode,
			id = `${mediaElement.id}_${options.prefix}`
		;

		let
			node = null,
			flvPlayer
		;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => flvPlayer !== null ? node[propName] : null;

				node[`set${capName}`] = (value) => {
					if (!mejs.html5media.readOnlyProperties.includes(propName)) {
						if (flvPlayer !== null) {
							node[propName] = value;

							if (propName === 'src') {
								flvPlayer.unload();
								flvPlayer.detachMediaElement();
								flvPlayer.attachMediaElement(node);
								flvPlayer.load();
							}
						}
					}
				};

			}
			;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all FLV events
		window['__ready__' + id] = (_flvPlayer) => {

			mediaElement.flvPlayer = flvPlayer = _flvPlayer;

			const
				events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']),
				assignEvents = (eventName) => {

					if (eventName === 'loadedmetadata') {

						flvPlayer.unload();
						flvPlayer.detachMediaElement();
						flvPlayer.attachMediaElement(node);
						flvPlayer.load();
					}

					node.addEventListener(eventName, (e) => {
						const event = document.createEvent('HTMLEvents');
						event.initEvent(e.type, e.bubbles, e.cancelable);
						mediaElement.dispatchEvent(event);
					});

				}
			;

			for (let i = 0, total = events.length; i < total; i++) {
				assignEvents(events[i]);
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (let i = 0, total = mediaFiles.length; i < total; i++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		// Options that cannot be overridden
		options.flv.type = 'flv';
		options.flv.url = node.getAttribute('src');

		NativeFlv.prepareSettings({
			options: options.flv,
			id: id
		});

		// HELPER METHODS
		node.setSize = (width, height) => {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = () => {
			flvPlayer.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = () => {
			node.style.display = '';
			return node;
		};

		node.destroy = () => {
			flvPlayer.destroy();
		};

		const event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native FLV type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('.flv') ? 'video/flv' : null;
});

renderer.add(FlvNativeRenderer);
