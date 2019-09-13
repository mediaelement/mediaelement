'use strict';

import window from 'global/window';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
import {HAS_MSE} from '../utils/constants';
import {typeChecks} from '../utils/media';
import {loadScript} from '../utils/dom';

/**
 * Native HLS renderer
 *
 * Uses DailyMotion's hls.js, which is a JavaScript library which implements an HTTP Live Streaming client.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with m3u8 files the same way Flash version of Hls does.
 * @see https://github.com/video-dev/hls.js
 *
 */
const NativeHls = {

	promise: null,

	/**
	 * Create a queue to prepare the loading of an HLS source
	 *
	 * @param {Object} settings - an object with settings needed to load an HLS player instance
	 */
	load: (settings) => {
		if (typeof Hls !== 'undefined') {
			NativeHls.promise = new Promise((resolve) => {
				resolve();
			}).then(() => {
				NativeHls._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ?
				settings.options.path : 'https://cdn.jsdelivr.net/npm/hls.js@latest';

			NativeHls.promise = NativeHls.promise || loadScript(settings.options.path);
			NativeHls.promise.then(() => {
				NativeHls._createPlayer(settings);
			});
		}

		return NativeHls.promise;
	},

	/**
	 * Create a new instance of HLS player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to instantiate HLS object
	 * @return {Hls}
	 */
	_createPlayer: (settings) => {
		const player = new Hls(settings.options);
		window[`__ready__${settings.id}`](player);
		return player;
	}
};

const HlsNativeRenderer = {
	name: 'native_hls',
	options: {
		prefix: 'native_hls',
		hls: {
			// Special config: used to set the local path/URL of hls.js library
			path: 'https://cdn.jsdelivr.net/npm/hls.js@latest',
			// To modify more elements from hls.js,
			// see https://github.com/video-dev/hls.js/blob/master/doc/API.md#fine-tuning
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
	canPlayType: (type) => HAS_MSE && ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls',
		'video/hls'].indexOf(type.toLowerCase()) > -1,

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
			autoplay = originalNode.autoplay
		;

		let
			hlsPlayer = null,
			node = null,
			index = 0,
			total = mediaFiles.length
		;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);
		options.hls.autoStartLoad = ((preload && preload !== 'none') || autoplay);

		const
			props = mejs.html5media.properties,
			events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(e => e !== 'error'),
			attachNativeEvents = (e) => {
				const event = createEvent(e.type, mediaElement);
				mediaElement.dispatchEvent(event);
			},
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => hlsPlayer !== null ? node[propName] : null;

				node[`set${capName}`] = (value) => {
					if (mejs.html5media.readOnlyProperties.indexOf(propName) === -1) {
						if (propName === 'src') {
							node[propName] = typeof value === 'object' && value.src ? value.src : value;
							if (hlsPlayer !== null) {
								hlsPlayer.destroy();
								for (let i = 0, total = events.length; i < total; i++) {
									node.removeEventListener(events[i], attachNativeEvents);
								}
								hlsPlayer = NativeHls._createPlayer({
									options: options.hls,
									id: id
								});
								hlsPlayer.loadSource(value);
								hlsPlayer.attachMedia(node);
							}
						} else {
							node[propName] = value;
						}
					}
				};
			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		window['__ready__' + id] = (_hlsPlayer) => {
			mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;
			const
				hlsEvents = Hls.Events,
				assignEvents = (eventName) => {
					if (eventName === 'loadedmetadata') {
						const url = mediaElement.originalNode.src;
						hlsPlayer.detachMedia();
						hlsPlayer.loadSource(url);
						hlsPlayer.attachMedia(node);
					}

					node.addEventListener(eventName, attachNativeEvents);
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
			 * @see https://github.com/video-dev/hls.js/blob/master/src/events.js
			 * @see https://github.com/video-dev/hls.js/blob/master/src/errors.js
			 * @see https://github.com/video-dev/hls.js/blob/master/doc/API.md#runtime-events
			 * @see https://github.com/video-dev/hls.js/blob/master/doc/API.md#errors
			 */
			let recoverDecodingErrorDate, recoverSwapAudioCodecDate;
			const assignHlsEvents = function (name, data) {
				if (name === 'hlsError') {
					console.warn(data);
					data = data[1];

					// borrowed from https://video-dev.github.io/hls.js/demo
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
									const message = 'Cannot recover, last media error recovery failed';
									mediaElement.generateError(message, node.src);
									console.error(message);
								}
								break;
							case 'networkError':
								if (data.details === 'manifestLoadError') {
									if (index < total && mediaFiles[(index + 1)] !== undefined) {
										node.setSrc(mediaFiles[index++].src);
										node.load();
										node.play();
									} else {
										const message = 'Network error';
										mediaElement.generateError(message, mediaFiles);
										console.error(message);
									}
								} else {
									const message = 'Network error';
									mediaElement.generateError(message, mediaFiles);
									console.error(message);
								}
								break;
							default:
								hlsPlayer.destroy();
								break;
						}
						return;
					}
				}
				const event = createEvent(name, mediaElement);
				event.data = data;
				mediaElement.dispatchEvent(event);
			};

			for (const eventType in hlsEvents) {
				if (hlsEvents.hasOwnProperty(eventType)) {
					hlsPlayer.on(hlsEvents[eventType], (...args) => assignHlsEvents(hlsEvents[eventType], args));
				}
			}
		};

		if (total > 0) {
			for (; index < total; index++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		if (preload !== 'auto' && !autoplay) {
			node.addEventListener('play', () => {
				if (hlsPlayer !== null) {
					hlsPlayer.startLoad();
				}
			});

			node.addEventListener('pause', () => {
				if (hlsPlayer !== null) {
					hlsPlayer.stopLoad();
				}
			});
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		node.setSize = (width, height) => {
			node.style.width = `${width}px`;
			node.style.height = `${height}px`;
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
			if (hlsPlayer !== null) {
				hlsPlayer.stopLoad();
				hlsPlayer.destroy();
			}
		};

		const event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeHls.load({
			options: options.hls,
			id: id
		}));

		return node;
	}
};

/**
 * Register Native HLS type based on URL structure
 *
 */
typeChecks.push((url) => ~(url.toLowerCase()).indexOf('.m3u8') ? 'application/x-mpegURL' : null);

renderer.add(HlsNativeRenderer);
