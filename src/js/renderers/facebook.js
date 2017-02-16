'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {isObjectEmpty} from '../utils/general';
import {createEvent} from '../utils/dom';
import {typeChecks} from '../utils/media';

/**
 * Facebook renderer
 *
 * It creates an <iframe> from a <div> with specific configuration.
 * @see https://developers.facebook.com/docs/plugins/embedded-video-player
 */
const FacebookRenderer = {
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
	canPlayType: (type)  => ['video/facebook', 'video/x-facebook'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles)  => {

		let
			fbWrapper = {},
			fbApi = null,
			fbDiv = null,
			apiStack = [],
			paused = true,
			ended = false,
			hasStartedPlaying = false,
			src = '',
			eventHandler = {},
			readyState = 4,
			i,
			il
		;

		options = Object.assign(options, mediaElement.options);
		fbWrapper.options = options;
		fbWrapper.id = mediaElement.id + '_' + options.prefix;
		fbWrapper.mediaElement = mediaElement;

		// wrappers for get/set
		let
			props = mejs.html5media.properties,
			assignGettersSetters = (propName)  => {

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				fbWrapper[`get${capName}`] = () => {

					if (fbApi !== null) {
						let value = null;

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
									start: () => {
										return 0;
									},
									end: () => {
										return 0;
									},
									length: 1
								};
							case 'src':
								return src;

							case 'readyState':
								return readyState;
						}

						return value;
					} else {
						return null;
					}
				};

				fbWrapper[`set${capName}`] = (value)  => {

					if (fbApi !== null) {

						switch (propName) {

							case 'src':
								let url = typeof value === 'string' ? value : value[0].src;

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
								setTimeout(() => {
									let event = createEvent('volumechange', fbWrapper);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'volume':
								fbApi.setVolume(value);
								setTimeout(() => {
									let event = createEvent('volumechange', fbWrapper);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'readyState':
								let event = createEvent('canplay', vimeo);
								mediaElement.dispatchEvent(event);
								break;

							default:
								console.log('facebook ' + fbWrapper.id, propName, 'UNSUPPORTED property');
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
			assignMethods = (methodName)  => {

				// run the method on the native HTMLMediaElement
				fbWrapper[methodName] = () => {

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
		function sendEvents (events) {
			for (let i = 0, il = events.length; i < il; i++) {
				let event = mejs.Utils.createEvent(events[i], fbWrapper);
				mediaElement.dispatchEvent(event);
			}
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
		function createFacebookEmbed (url, config) {

			src = url;

			fbDiv = document.createElement('div');
			fbDiv.id = fbWrapper.id;
			fbDiv.className = "fb-video";
			fbDiv.setAttribute("data-href", url);
			fbDiv.setAttribute("data-allowfullscreen", "true");
			fbDiv.setAttribute("data-controls", "false");

			mediaElement.originalNode.parentNode.insertBefore(fbDiv, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			/*
			 * Register Facebook API event globally
			 *
			 */
			window.fbAsyncInit = () => {

				FB.init(config);

				FB.Event.subscribe('xfbml.ready', (msg) => {

					if (msg.type === 'video') {

						fbApi = msg.instance;

						// Set proper size since player dimensions are unknown before this event
						let
							fbIframe = fbDiv.getElementsByTagName('iframe')[0],
							width = parseInt(window.getComputedStyle(fbIframe, null).width),
							height = parseInt(fbIframe.style.height)
						;

						fbWrapper.setSize(width, height);

						sendEvents(['mouseover', 'mouseout']);

						// remove previous listeners
						let fbEvents = ['startedPlaying', 'paused', 'finishedPlaying', 'startedBuffering', 'finishedBuffering'];
						for (i = 0, il = fbEvents.length; i < il; i++) {
							let
								event = fbEvents[i],
								handler = eventHandler[event]
							;
							if (handler !== undefined && handler !== null &&
								!isObjectEmpty(handler) && typeof handler.removeListener === 'function') {
								handler.removeListener(event);
							}
						}

						// do call stack
						if (apiStack.length) {
							for (i = 0, il = apiStack.length; i < il; i++) {

								let stackItem = apiStack[i];

								if (stackItem.type === 'set') {
									let
										propName = stackItem.propName,
										capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`
									;

									fbWrapper[`set${capName}`](stackItem.value);

								} else if (stackItem.type === 'call') {
									fbWrapper[stackItem.methodName]();
								}
							}
						}

						sendEvents(['rendererready', 'ready', 'loadeddata', 'canplay', 'progress']);
						sendEvents(['loadedmetadata', 'timeupdate', 'progress']);

						let timer;

						// Custom Facebook events
						eventHandler.startedPlaying = fbApi.subscribe('startedPlaying', () => {
							if (!hasStartedPlaying) {
								hasStartedPlaying = true;
							}
							paused = false;
							ended = false;
							sendEvents(['play', 'playing', 'timeupdate']);

							// Workaround to update progress bar
							timer = setInterval(() => {
								fbApi.getCurrentPosition();
								sendEvents(['timeupdate']);
							}, 250);
						});
						eventHandler.paused = fbApi.subscribe('paused', () => {
							paused = true;
							ended = false;
							sendEvents(['pause']);
						});
						eventHandler.finishedPlaying = fbApi.subscribe('finishedPlaying', () => {
							paused = true;
							ended = true;

							// Workaround to update progress bar one last time and trigger ended event
							timer = setInterval(() => {
								fbApi.getCurrentPosition();
								sendEvents(['timeupdate', 'ended']);
							}, 250);

							clearInterval(timer);
							timer = null;
						});
						eventHandler.startedBuffering = fbApi.subscribe('startedBuffering', () => {
							sendEvents(['progress', 'timeupdate']);
						});
						eventHandler.finishedBuffering = fbApi.subscribe('finishedBuffering', () => {
							sendEvents(['progress', 'timeupdate']);
						});


					}
				});
			};

			(((d, s, id) => {
				let js;
				let fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = '//connect.facebook.net/en_US/sdk.js';
				fjs.parentNode.insertBefore(js, fjs);
			})(document, 'script', 'facebook-jssdk'));
		}

		if (mediaFiles.length > 0) {
			createFacebookEmbed(mediaFiles[0].src, fbWrapper.options.facebook);
		}

		fbWrapper.hide = () => {
			fbWrapper.stopInterval();
			fbWrapper.pause();
			if (fbDiv) {
				fbDiv.style.display = 'none';
			}
		};
		fbWrapper.show = () => {
			if (fbDiv) {
				fbDiv.style.display = '';
			}
		};
		fbWrapper.setSize = (width, height) => {
			if (fbApi !== null && !isNaN(width) && !isNaN(height)) {
				fbDiv.setAttribute('width', width);
				fbDiv.setAttribute('height', height);
			}
		};
		fbWrapper.destroy = () => {
		};
		fbWrapper.interval = null;

		fbWrapper.startInterval = () => {
			// create timer
			fbWrapper.interval = setInterval(() => {
				let event = createEvent('timeupdate', fbWrapper);
				mediaElement.dispatchEvent(event);
			}, 250);
		};
		fbWrapper.stopInterval = () => {
			if (fbWrapper.interval) {
				clearInterval(fbWrapper.interval);
			}
		};

		return fbWrapper;
	}
};

/**
 * Register Facebook type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('//www.facebook') ? 'video/x-facebook' : null;
});

renderer.add(FacebookRenderer);