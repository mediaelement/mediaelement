'use strict';

/**
 * Twitch renderer
 *
 * Uses <iframe> approach and uses Twitch API to manipulate it.
 * @see https://github.com/justintv/Twitch-API/blob/master/embed-video.md
 */
const twitchApi = {
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

		// Check whether Twitch API is already loaded.
		twitchApi.isLoaded = typeof Twitch !== 'undefined';

		if (twitchApi.isLoaded) {
			twitchApi.createIframe(settings);
		} else {
			twitchApi.loadIframeApi();
			twitchApi.iframeQueue.push(settings);
		}
	},

	/**
	 * Load Twitch API script on the header of the document
	 *
	 */
	loadIframeApi: () => {
		if (!twitchApi.isIframeStarted) {

			const
				script = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0]
				;

			let done = false;

			script.src = '//player.twitch.tv/js/embed/v1.js';

			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function () {
				if (!done && (!this.readyState || this.readyState === undefined ||
					this.readyState === 'loaded' || this.readyState === 'complete')) {
					done = true;
					twitchApi.iFrameReady();
					script.onload = script.onreadystatechange = null;
				}
			};
			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
			twitchApi.isIframeStarted = true;
		}
	},

	/**
	 * Process queue of Twitch <iframe> element creation
	 *
	 */
	iFrameReady: () => {

		twitchApi.isLoaded = true;
		twitchApi.isIframeLoaded = true;

		while (twitchApi.iframeQueue.length > 0) {
			const settings = twitchApi.iframeQueue.pop();
			twitchApi.createIframe(settings);
		}
	},

	/**
	 * Create a new instance of Twitch API player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to create <iframe>
	 */
	createIframe: (settings) => {
		const player = new Twitch.Player(settings.id, settings);
		window['__ready__' + settings.id](player);
	},

	/**
	 * Extract ID from Twitch to be loaded through API
	 * Valid URL format(s):
	 *  - https://player.twitch.tv/?video=40464143
	 *  - https://www.twitch.tv/40464143
	 *  - https://player.twitch.tv/?channel=monserrat
	 *  - https://www.twitch.tv/monserrat
	 *
	 * @param {String} url - Twitch full URL to grab the number Id of the source
	 * @return {int}
	 */
	getTwitchId: (url) => {

		let twitchId = '';

		if (url.indexOf('?') > 0) {
			twitchId = twitchApi.getTwitchIdFromParam(url);
			if (twitchId === '') {
				twitchId = twitchApi.getTwitchIdFromUrl(url);
			}
		} else {
			twitchId = twitchApi.getTwitchIdFromUrl(url);
		}

		return twitchId;
	},

	/**
	 * Get ID from URL with format:
	 *  - https://player.twitch.tv/?channel=monserrat
	 *  - https://player.twitch.tv/?video=40464143
	 *
	 * @param {String} url
	 * @returns {string}
	 */
	getTwitchIdFromParam: (url) => {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		const
			parts = url.split('?'),
			parameters = parts[1].split('&')
		;

		let twitchId = '';

		for (let i = 0, total = parameters.length; i < total; i++) {
			const paramParts = parameters[i].split('=');
			if (paramParts[0].includes('channel=')) {
				twitchId = paramParts[1];
				break;
			} else if (paramParts[0].includes('video=')) {
				twitchId = `v${paramParts[1]}`;
				break;
			}
		}


		return twitchId;
	},

	/**
	 * Get ID from URL with formats:
	 *  - https://www.twitch.tv/40464143
	 *  - https://www.twitch.tv/monserrat
	 *
	 * @param {String} url
	 * @return {?String}
	 */
	getTwitchIdFromUrl: (url) => {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		const parts = url.split('?');
		url = parts[0];
		const id = url.substring(url.lastIndexOf('/') + 1);
		return id.match(/^\d+$/i) !== null ? 'v' + id : id;
	},

	/**
	 * Determine whether media is channel or video based on Twitch ID
	 *
	 * @see getTwitchId()
	 * @param {String} id
	 * @returns {String}
	 */
	getTwitchType: (id) => {
		return id.match(/^v\d+/i) !== null ? 'video' : 'channel';
	}
};

const TwitchIframeRenderer = {
	name: 'twitch_iframe',

	options: {
		prefix: 'twitch_iframe',
	},

	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {Boolean}
	 */
	canPlayType: (type) => ['video/twitch', 'video/x-twitch'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		// API objects
		const
			twitch = {},
			apiStack = [],
			readyState = 4,
			twitchId = twitchApi.getTwitchId(mediaFiles[0].src)
		;

		let
			twitchPlayer = null,
			paused = true,
			ended = false,
			hasStartedPlaying = false,
			volume = 1,
			duration = Infinity,
			time = 0
		;

		twitch.options = options;
		twitch.id = mediaElement.id + '_' + options.prefix;
		twitch.mediaElement = mediaElement;

		// wrappers for get/set
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {

				// add to flash state that we will store

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				twitch[`get${capName}`] = () => {
					if (twitchPlayer !== null) {
						const value = null;

						// figure out how to get Twitch dta here
						switch (propName) {
							case 'currentTime':
								time = twitchPlayer.getCurrentTime();
								return time;

							case 'duration':
								duration = twitchPlayer.getDuration();
								return duration;

							case 'volume':
								volume = twitchPlayer.getVolume();
								return volume;

							case 'paused':
								paused = twitchPlayer.isPaused();
								return paused;

							case 'ended':
								ended = twitchPlayer.getEnded();
								return ended;

							case 'muted':
								return twitchPlayer.getMuted();

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

								return (twitchApi.getTwitchType(twitchId) === 'channel') ?
									twitchPlayer.getChannel() : twitchPlayer.getVideo();

							case 'readyState':
								return readyState;
						}

						return value;
					} else {
						return null;
					}
				};

				twitch[`set${capName}`] = (value) => {

					if (twitchPlayer !== null) {

						// do something
						switch (propName) {

							case 'src':
								const
									url = typeof value === 'string' ? value : value[0].src,
									videoId = twitchApi.getTwitchId(url)
								;

								if (twitchApi.getTwitchType(twitchId) === 'channel') {
									twitchPlayer.setChannel(videoId);
								} else {
									twitchPlayer.setVideo(videoId);
								}
								break;

							case 'currentTime':
								twitchPlayer.seek(value);
								setTimeout(() => {
									const event = mejs.Utils.createEvent('timeupdate', twitch);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'muted':
								twitchPlayer.setMuted(value);
								setTimeout(() => {
									const event = mejs.Utils.createEvent('volumechange', twitch);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'volume':
								volume = value;
								twitchPlayer.setVolume(value);
								setTimeout(() => {
									const event = mejs.Utils.createEvent('volumechange', twitch);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;
							case 'readyState':
								const event = mejs.Utils.createEvent('canplay', twitch);
								mediaElement.dispatchEvent(event);
								break;

							default:
								console.log('Twitch ' + twitch.id, propName, 'UNSUPPORTED property');
								break;
						}

					} else {
						// store for after "READY" event fires
						apiStack.push({type: 'set', propName: propName, value: value});
					}
				};

			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		const
			methods = mejs.html5media.methods,
			assignMethods = (methodName) => {

				// run the method on the native HTMLMediaElement
				twitch[methodName] = () => {

					if (twitchPlayer !== null) {

						// DO method
						switch (methodName) {
							case 'play':
								paused = false;
								return twitchPlayer.play();
							case 'pause':
								paused = true;
								return twitchPlayer.pause();
							case 'load':
								return null;

						}

					} else {
						apiStack.push({type: 'call', methodName: methodName});
					}
				};

			}
		;

		for (let i = 0, total = methods.length; i < total; i++) {
			assignMethods(methods[i]);
		}

		/**
		 * Dispatch a list of events
		 *
		 * @private
		 * @param {Array} events
		 */
		function sendEvents (events) {
			for (let i = 0, total = events.length; i < total; i++) {
				const event = mejs.Utils.createEvent(events[i], twitch);
				mediaElement.dispatchEvent(event);
			}
		}

		// Initial method to register all Twitch events when initializing <iframe>
		window['__ready__' + twitch.id] = (_twitchPlayer) => {

			mediaElement.twitchPlayer = twitchPlayer = _twitchPlayer;

			// do call stack
			if (apiStack.length) {
				for (let i = 0, total = apiStack.length; i < total; i++) {

					const stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						const propName = stackItem.propName,
							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

						twitch[`set${capName}`](stackItem.value);
					} else if (stackItem.type === 'call') {
						twitch[stackItem.methodName]();
					}
				}
			}

			const twitchIframe = document.getElementById(twitch.id).firstChild;
			twitchIframe.style.width = '100%';
			twitchIframe.style.height = '100%';

			// a few more events
			let events = ['mouseover', 'mouseout'];

			const assignEvents = (e) => {
				const event = createEvent(e.type, twitch);
				mediaElement.dispatchEvent(event);
			};

			for (let i = 0, total = events.length; i < total; i++) {
				twitchIframe.addEventListener(events[i], assignEvents, false);
			}

			let timer;

			// Twitch events
			twitchPlayer.addEventListener('ready', () => {
				paused = false;
				ended = false;
				sendEvents(['rendererready', 'loadedmetadata', 'loadeddata', 'canplay']);

			});
			twitchPlayer.addEventListener('play', () => {
				if (!hasStartedPlaying) {
					hasStartedPlaying = true;
				}
				paused = false;
				ended = false;
				sendEvents(['play', 'playing', 'progress']);

				// Workaround to update progress bar
				timer = setInterval(() => {
					twitchPlayer.getCurrentTime();
					sendEvents(['timeupdate']);
				}, 250);

			});
			twitchPlayer.addEventListener('pause', () => {
				paused = true;
				ended = false;
				if (!twitchPlayer.getEnded()) {
					sendEvents(['pause']);
				}

			});
			twitchPlayer.addEventListener('ended', () => {
				paused = true;
				ended = true;
				sendEvents(['ended']);
				clearInterval(timer);
				hasStartedPlaying = false;
				timer = null;
			});
		};

		// CREATE Twitch
		const
			height = mediaElement.originalNode.height,
			width = mediaElement.originalNode.width,
			twitchContainer = document.createElement('div'),
			type = twitchApi.getTwitchType(twitchId),
			twitchSettings = {
				id: twitch.id,
				width: width,
				height: height,
				playsinline: false,
				autoplay: mediaElement.originalNode.autoplay
			}
		;

		twitchSettings[type] = twitchId;
		twitchContainer.id = twitch.id;
		twitchContainer.style.width = '100%';
		twitchContainer.style.height = '100%';

		mediaElement.originalNode.parentNode.insertBefore(twitchContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';
		mediaElement.originalNode.autoplay = false;

		// send it off for async loading and creation
		twitchApi.enqueueIframe(twitchSettings);

		twitch.setSize = (width, height) => {
			if (twitchApi !== null && !isNaN(width) && !isNaN(height)) {
				twitchContainer.setAttribute('width', width);
				twitchContainer.setAttribute('height', height);
			}
		};
		twitch.hide = () => {
			twitch.pause();
			twitchContainer.style.display = 'none';
		};
		twitch.show = () => {
			twitchContainer.style.display = '';
		};
		twitch.destroy = () => {};

		return twitch;
	}
};

mejs.Utils.typeChecks.push((url) => {
	url = url.toLowerCase();
	return (url.includes('//www.twitch.tv') || url.includes('//player.twitch.tv')) ? 'video/x-twitch' : null;
});

mejs.Renderers.add(TwitchIframeRenderer);