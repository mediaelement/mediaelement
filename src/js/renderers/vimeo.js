'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent, addEvent} from '../utils/dom';
import {typeChecks} from '../utils/media';

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
const vimeoApi = {

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
	enqueueIframe: (settings) => {

		if (vimeoApi.isLoaded) {
			vimeoApi.createIframe(settings);
		} else {
			vimeoApi.loadIframeApi();
			vimeoApi.iframeQueue.push(settings);
		}
	},

	/**
	 * Load Vimeo API script on the header of the document
	 *
	 */
	loadIframeApi: () => {

		if (!vimeoApi.isIframeStarted) {

			let
				script = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0],
				done = false;

			script.src = '//player.vimeo.com/api/player.js';

			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = () => {
				if (!done && (!vimeoApi.readyState || vimeoApi.readyState === undefined ||
					vimeoApi.readyState === "loaded" || vimeoApi.readyState === "complete")) {
					done = true;
					vimeoApi.iFrameReady();
					script.onload = script.onreadystatechange = null;
				}
			};
			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
			vimeoApi.isIframeStarted = true;
		}
	},

	/**
	 * Process queue of Vimeo <iframe> element creation
	 *
	 */
	iFrameReady: () => {

		vimeoApi.isLoaded = true;
		vimeoApi.isIframeLoaded = true;

		while (vimeoApi.iframeQueue.length > 0) {
			let settings = vimeoApi.iframeQueue.pop();
			vimeoApi.createIframe(settings);
		}
	},

	/**
	 * Create a new instance of Vimeo API player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to create <iframe>
	 */
	createIframe: (settings) => {
		let player = new Vimeo.Player(settings.iframe);
		window['__ready__' + settings.id](player);
	},

	/**
	 * Extract numeric value from Vimeo to be loaded through API
	 * Valid URL format(s):
	 *  - https://player.vimeo.com/video/59777392
	 *  - https://vimeo.com/59777392
	 *
	 * @param {String} url - Vimeo full URL to grab the number Id of the source
	 * @return {int}
	 */
	getVimeoId: (url) => {
		if (url === undefined || url === null) {
			return null;
		}

		let parts = url.split('?');

		url = parts[0];

		return parseInt(url.substring(url.lastIndexOf('/') + 1));
	},

	/**
	 * Generate custom errors for Vimeo based on the API specifications
	 *
	 * @see https://github.com/vimeo/player.js#error
	 * @param {Object} error
	 * @param {Object} target
	 */
	errorHandler: (error, target) => {
		let event = createEvent('error', target);
		event.message = error.name + ': ' + error.message;
		mediaElement.dispatchEvent(event);
	}
};

const vimeoIframeRenderer = {

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
	canPlayType: (type) => ['video/vimeo', 'video/x-vimeo'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		// exposed object
		let
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
			readyState = 4,
			i,
			il
		;

		vimeo.options = options;
		vimeo.id = mediaElement.id + '_' + options.prefix;
		vimeo.mediaElement = mediaElement;

		// wrappers for get/set
		let
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				vimeo[`get${capName}`] = () => {
					if (vimeoPlayer !== null) {
						let value = null;

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
								vimeoPlayer.getVideoUrl().then((_url) => {
									url = _url;
								});

								return url;
							case 'buffered':
								return {
									start: () => {
										return 0;
									},
									end: () => {
										return bufferedTime * duration;
									},
									length: 1
								};
							case 'readyState':
								return readyState;
						}

						return value;
					} else {
						return null;
					}
				};

				vimeo[`set${capName}`] = (value) => {

					if (vimeoPlayer !== null) {

						// do something
						switch (propName) {

							case 'src':
								let url = typeof value === 'string' ? value : value[0].src,
									videoId = vimeoApi.getVimeoId(url);

								vimeoPlayer.loadVideo(videoId).then(() => {
									if (mediaElement.getAttribute('autoplay')) {
										vimeoPlayer.play();
									}

								})['catch']((error) => {
									vimeoApi.errorHandler(error, vimeo);
								});
								break;

							case 'currentTime':
								vimeoPlayer.setCurrentTime(value).then(() => {
									currentTime = value;
									setTimeout(() => {
										let event = createEvent('timeupdate', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								})['catch']((error) => {
									vimeoApi.errorHandler(error, vimeo);
								});
								break;

							case 'volume':
								vimeoPlayer.setVolume(value).then(() => {
									volume = value;
									oldVolume = volume;
									setTimeout(() => {
										let event = createEvent('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								})['catch']((error) => {
									vimeoApi.errorHandler(error, vimeo);
								});
								break;

							case 'loop':
								vimeoPlayer.setLoop(value)['catch']((error) => {
									vimeoApi.errorHandler(error, vimeo);
								});
								break;
							case 'muted':
								if (value) {
									vimeoPlayer.setVolume(0).then(() => {
										volume = 0;
										setTimeout(() => {
											let event = createEvent('volumechange', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									})['catch']((error) => {
										vimeoApi.errorHandler(error, vimeo);
									});
								} else {
									vimeoPlayer.setVolume(oldVolume).then(() => {
										volume = oldVolume;
										setTimeout(() => {
											let event = createEvent('volumechange', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									})['catch']((error) => {
										vimeoApi.errorHandler(error, vimeo);
									});
								}
								break;
							case 'readyState':
								let event = createEvent('canplay', vimeo);
								mediaElement.dispatchEvent(event);
								break;
							default:
								console.log('vimeo ' + vimeo.id, propName, 'UNSUPPORTED property');
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
		let
			methods = mejs.html5media.methods,
			assignMethods = (methodName) => {
				vimeo[methodName] = () => {

					if (vimeoPlayer !== null) {

						// DO method
						switch (methodName) {
							case 'play':
								paused = false;
								return vimeoPlayer.play();
							case 'pause':
								paused = true;
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
		window['__ready__' + vimeo.id] = (_vimeoPlayer) => {

			vimeoApiReady = true;
			mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

			// do call stack
			if (apiStack.length) {
				for (i = 0, il = apiStack.length; i < il; i++) {

					let stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						let propName = stackItem.propName,
							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

						vimeo[`set${capName}`](stackItem.value);
					} else if (stackItem.type === 'call') {
						vimeo[stackItem.methodName]();
					}
				}
			}

			let vimeoIframe = document.getElementById(vimeo.id), events;

			// a few more events
			events = ['mouseover', 'mouseout'];

			const assignEvents = (e) => {
				let event = createEvent(e.type, vimeo);
				mediaElement.dispatchEvent(event);
			};

			for (let j in events) {
				let eventName = events[j];
				addEvent(vimeoIframe, eventName, assignEvents);
			}

			// Vimeo events
			vimeoPlayer.on('loaded', () => {

				vimeoPlayer.getDuration().then((loadProgress) => {

					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
					}

					let event = createEvent('loadedmetadata', vimeo);
					mediaElement.dispatchEvent(event);

				})['catch']((error) => {
					vimeoApi.errorHandler(error, vimeo);
				});
			});

			vimeoPlayer.on('progress', () => {
				vimeoPlayer.getDuration().then((loadProgress) => {

					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
					}

					let event = createEvent('progress', vimeo);
					mediaElement.dispatchEvent(event);

				})['catch']((error) => {
					vimeoApi.errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('timeupdate', () => {
				vimeoPlayer.getCurrentTime().then((seconds) => {
					currentTime = seconds;
				});

				let event = createEvent('timeupdate', vimeo);
				mediaElement.dispatchEvent(event);

			});
			vimeoPlayer.on('play', () => {
				paused = false;
				ended = false;
				let event = createEvent('play', vimeo);
				mediaElement.dispatchEvent(event);

				event = createEvent('playing', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('pause', () => {
				paused = true;
				ended = false;

				let event = createEvent('pause', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('ended', () => {
				paused = false;
				ended = true;

				let event = createEvent('ended', vimeo);
				mediaElement.dispatchEvent(event);
			});

			// give initial events
			events = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

			for (i = 0, il = events.length; i < il; i++) {
				let event = createEvent(events[i], vimeo);
				mediaElement.dispatchEvent(event);
			}
		};

		let
			height = mediaElement.originalNode.height,
			width = mediaElement.originalNode.width,
			vimeoContainer = document.createElement('iframe'),
			standardUrl = '//player.vimeo.com/video/' + vimeoApi.getVimeoId(mediaFiles[0].src),
			queryArgs = mediaFiles[0].src.includes('?') ? `?${mediaFiles[0].src.slice(mediaFiles[0].src.indexOf('?') + 1)}` : ''
		;

		// Create Vimeo <iframe> markup
		vimeoContainer.setAttribute('id', vimeo.id);
		vimeoContainer.setAttribute('width', width);
		vimeoContainer.setAttribute('height', height);
		vimeoContainer.setAttribute('frameBorder', '0');
		vimeoContainer.setAttribute('src', `${standardUrl}${queryArgs}`);
		vimeoContainer.setAttribute('webkitallowfullscreen', '');
		vimeoContainer.setAttribute('mozallowfullscreen', '');
		vimeoContainer.setAttribute('allowfullscreen', '');

		mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		vimeoApi.enqueueIframe({
			iframe: vimeoContainer,
			id: vimeo.id
		});

		vimeo.hide = () => {
			vimeo.pause();
			if (vimeoPlayer) {
				vimeoContainer.style.display = 'none';
			}
		};
		vimeo.setSize = (width, height) => {
			vimeoContainer.setAttribute('width', width);
			vimeoContainer.setAttribute('height', height);
		};
		vimeo.show = () => {
			if (vimeoPlayer) {
				vimeoContainer.style.display = '';
			}
		};

		return vimeo;
	}

};

/**
 * Register Vimeo type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('//player.vimeo') || url.includes('vimeo.com') ? 'video/x-vimeo' : null;
});

renderer.add(vimeoIframeRenderer);