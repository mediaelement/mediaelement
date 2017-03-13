'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
import {HAS_MSE} from '../utils/constants';
import {typeChecks} from '../utils/media';

/**
 * Native HLS renderer
 *
 * Uses DailyMotion's hls.js, which is a JavaScript library which implements an HTTP Live Streaming client.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with m3u8 files the same way Flash version of Hls does.
 * @see https://github.com/dailymotion/hls.js
 *
 */
const NativeHls = {
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
	 *
	 * @param {Object} settings - an object with settings needed to load an HLS player instance
	 */
	prepareSettings: (settings) => {
		if (NativeHls.isLoaded) {
			NativeHls.createInstance(settings);
		} else {
			NativeHls.loadScript(settings);
			NativeHls.creationQueue.push(settings);
		}
	},

	/**
	 * Load hls.js script on the header of the document
	 *
	 * @param {Object} settings - an object with settings needed to load an HLS player instance
	 */
	loadScript: (settings) => {

		// Skip script loading since it is already loaded
		if (typeof Hls !== 'undefined') {
			NativeHls.createInstance(settings);
		} else if (!NativeHls.isMediaStarted) {

			settings.options.path = typeof settings.options.path === 'string' ?
				settings.options.path : '//cdn.jsdelivr.net/hls.js/latest/hls.min.js';

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
					NativeHls.mediaReady();
					script.onload = script.onreadystatechange = null;
				}
			};

			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
			NativeHls.isMediaStarted = true;
		}
	},

	/**
	 * Process queue of HLS player creation
	 *
	 */
	mediaReady: () => {
		NativeHls.isLoaded = true;
		NativeHls.isMediaLoaded = true;

		while (NativeHls.creationQueue.length > 0) {
			const settings = NativeHls.creationQueue.pop();
			NativeHls.createInstance(settings);
		}
	},

	/**
	 * Create a new instance of HLS player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to instantiate HLS object
	 * @return {Hls}
	 */
	createInstance: (settings) => {
		console.log(settings.options);
		const player = new Hls(settings.options);
		window['__ready__' + settings.id](player);
		return player;
	}
};

const HlsNativeRenderer = {
	name: 'native_hls',

	options: {
		prefix: 'native_hls',
		hls: {
			// Special config: used to set the local path/URL of hls.js library
			path: '//cdn.jsdelivr.net/hls.js/latest/hls.min.js',
			// To modify more elements from hls.js,
			// see https://github.com/dailymotion/hls.js/blob/master/API.md#user-content-fine-tuning
			autoStartLoad: false,
			debug: false
		}
	},

	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {Boolean}
	 */
	canPlayType: (type) => HAS_MSE && ['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls',
		'video/hls'].includes(type.toLowerCase()),

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
			id = mediaElement.id + '_' + options.prefix,
			preload = originalNode.getAttribute('preload'),
			autoplay = originalNode.getAttribute('autoplay')
		;

		let
			hlsPlayer = null,
			node = null
		;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);
		options.autoStartLoad = (preload === 'auto');

		// WRAPPERS for PROPs
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => hlsPlayer !== null ? node[propName] : null;

				node[`set${capName}`] = (value) => {
					if (!mejs.html5media.readOnlyProperties.includes(propName)) {
						if (hlsPlayer !== null) {
							node[propName] = value;

							if (propName === 'src') {

								hlsPlayer.destroy();
								hlsPlayer = NativeHls.createInstance({
									options: options.hls,
									id: id
								});

								hlsPlayer.attachMedia(node);
								hlsPlayer.loadSource(value);

								if (autoplay) {
									hlsPlayer.on(hlsEvents.MANIFEST_PARSED, () => {
										node.play();
									});
								}
							}
						}
					}
				};

			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all HLS events
		window['__ready__' + id] = (_hlsPlayer) => {

			mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;

			const
				events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']),
				hlsEvents = Hls.Events,
				assignEvents = (eventName) => {

					if (eventName === 'loadedmetadata') {

						hlsPlayer.detachMedia();

						const url = node.src;

						hlsPlayer.attachMedia(node);
						hlsPlayer.loadSource(url);
						if (autoplay) {
							hlsPlayer.on(hlsEvents.MANIFEST_PARSED, () => {
								node.play();
							});
						}
					}

					node.addEventListener(eventName, (e) => {
						// copy event
						const event = document.createEvent('HTMLEvents');
						event.initEvent(e.type, e.bubbles, e.cancelable);
						mediaElement.dispatchEvent(event);
					});

				}
			;

			for (let i = 0, total = events.length; i < total; i++) {
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
			let recoverDecodingErrorDate, recoverSwapAudioCodecDate;
			const assignHlsEvents = function (e, data) {
				const event = createEvent(e, node);
				event.data = data;
				mediaElement.dispatchEvent(event);

				if (e === 'hlsError') {
					console.error(e, data);

					// borrowed from http://dailymotion.github.io/hls.js/demo/
					if (data.fatal) {
						switch (data.type) {
							case 'mediaError':
								const now = new Date().getTime();
								if (!recoverDecodingErrorDate || (now - recoverDecodingErrorDate) > 3000) {
									recoverDecodingErrorDate = new Date().getTime();
									hlsPlayer.recoverMediaError();
								} else if (!recoverSwapAudioCodecDate || (now - recoverSwapAudioCodecDate) > 3000) {
									recoverSwapAudioCodecDate = new Date().getTime();
									console.warn('Attempting to swap Audio Codec and recover from media error');
									hlsPlayer.swapAudioCodec();
									hlsPlayer.recoverMediaError();
								} else {
									console.error('Cannot recover, last media error recovery failed');
								}
								break;
							case 'networkError':
								console.error('Network error');
								break;
							default:
								hlsPlayer.destroy();
								break;

						}
					}
				}
			};

			for (const eventType in hlsEvents) {
				if (hlsEvents.hasOwnProperty(eventType)) {
					hlsPlayer.on(hlsEvents[eventType], assignHlsEvents);
				}
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

		if (preload !== 'auto') {
			node.addEventListener('play', () => {
				hlsPlayer.startLoad();
			}, false);

			node.addEventListener('pause', () => {
				hlsPlayer.stopLoad();
			}, false);
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		NativeHls.prepareSettings({
			options: options.hls,
			id: id
		});

		// HELPER METHODS
		node.setSize = (width, height) => {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = () => {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = () => {
			node.style.display = '';
			return node;
		};

		node.destroy = () => {
			hlsPlayer.destroy();
		};

		node.stop = () => {
			hlsPlayer.stopLoad();
		};

		const event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native HLS type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('.m3u8') ? 'application/x-mpegURL' : null;
});

renderer.add(HlsNativeRenderer);