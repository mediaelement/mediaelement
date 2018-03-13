'use strict';

/**
 * Vimeo renderer
 *
 * Uses <iframe> approach and uses Vimeo API to manipulate it.
 * All Vimeo calls return a Promise so this renderer accounts for that
 * to update all the necessary values to interact with MediaElement player.
 * Note: IE8 implements ECMAScript 3 that does not allow bare keywords in dot notation;
 * that's why instead of using .catch .catch is being used.
 * @see https://github.com/vimeo/player.js
 *
 */
const VimeoApi = {

	promise: null,

	/**
	 * Create a queue to prepare the creation of <iframe>
	 *
	 * @param {Object} settings - an object with settings needed to create <iframe>
	 */
	load: (settings) => {

		if (typeof Vimeo !== 'undefined') {
			VimeoApi._createPlayer(settings);
		} else {
			VimeoApi.promise = VimeoApi.promise || mejs.Utils.loadScript('https://player.vimeo.com/api/player.js');
			VimeoApi.promise.then(() => {
				VimeoApi._createPlayer(settings);
			});
		}
	},

	/**
	 * Create a new instance of Vimeo API player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to create <iframe>
	 */
	_createPlayer: (settings) => {
		const player = new Vimeo.Player(settings.iframe);
		window[`__ready__${settings.id}`](player);
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

		const parts = url.split('?');
		url = parts[0];
		return parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
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
	canPlayType: (type) => ~['video/vimeo', 'video/x-vimeo'].indexOf(type.toLowerCase()),

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
			apiStack = [],
			vimeo = {},
			readyState = 4
		;

		let
			paused = true,
			volume = 1,
			oldVolume = volume,
			currentTime = 0,
			bufferedTime = 0,
			ended = false,
			duration = 0,
			vimeoPlayer = null,
			url = ''
		;

		vimeo.options = options;
		vimeo.id = mediaElement.id + '_' + options.prefix;
		vimeo.mediaElement = mediaElement;

		/**
		 * Generate custom errors for Vimeo based on the API specifications
		 *
		 * @see https://github.com/vimeo/player.js#error
		 * @param {Object} error
		 */
		const errorHandler = (error) => {
			mediaElement.generateError(`Code ${error.name}: ${error.message}`, mediaFiles);
		};

		// wrappers for get/set
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				vimeo[`get${capName}`] = () => {
					if (vimeoPlayer !== null) {
						const value = null;

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
								}).catch((error) => errorHandler(error));
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
						switch (propName) {
							case 'src':
								const url = typeof value === 'string' ? value : value[0].src,
									videoId = VimeoApi.getVimeoId(url);

								vimeoPlayer.loadVideo(videoId).then(() => {
									if (mediaElement.originalNode.autoplay) {
										vimeoPlayer.play();
									}
								}).catch((error) => errorHandler(error));
								break;
							case 'currentTime':
								vimeoPlayer.setCurrentTime(value).then(() => {
									currentTime = value;
									setTimeout(() => {
										const event = mejs.Utils.createEvent('timeupdate', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								}).catch((error) => errorHandler(error));
								break;
							case 'volume':
								vimeoPlayer.setVolume(value).then(() => {
									volume = value;
									oldVolume = volume;
									setTimeout(() => {
										const event = mejs.Utils.createEvent('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								}).catch((error) => errorHandler(error));
								break;
							case 'loop':
								vimeoPlayer.setLoop(value).catch((error) => errorHandler(error));
								break;
							case 'muted':
								if (value) {
									vimeoPlayer.setVolume(0).then(() => {
										volume = 0;
										setTimeout(() => {
											const event = mejs.Utils.createEvent('volumechange', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									}).catch((error) => errorHandler(error));
								} else {
									vimeoPlayer.setVolume(oldVolume).then(() => {
										volume = oldVolume;
										setTimeout(() => {
											const event = mejs.Utils.createEvent('volumechange', vimeo);
											mediaElement.dispatchEvent(event);
										}, 50);
									}).catch((error) => errorHandler(error));
								}
								break;
							case 'readyState':
								const event = mejs.Utils.createEvent('canplay', vimeo);
								mediaElement.dispatchEvent(event);
								break;
							default:
								console.log('vimeo ' + vimeo.id, propName, 'UNSUPPORTED property');
								break;
						}
					} else {
						apiStack.push({type: 'set', propName: propName, value: value});
					}
				};

			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		const
			methods = mejs.html5media.methods,
			assignMethods = (methodName) => {
				vimeo[methodName] = () => {
					if (vimeoPlayer !== null) {
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

		for (let i = 0, total = methods.length; i < total; i++) {
			assignMethods(methods[i]);
		}

		window['__ready__' + vimeo.id] = (_vimeoPlayer) => {

			mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

			// do call stack
			if (apiStack.length) {
				for (let i = 0, total = apiStack.length; i < total; i++) {
					const stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						const propName = stackItem.propName,
							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

						vimeo[`set${capName}`](stackItem.value);
					} else if (stackItem.type === 'call') {
						vimeo[stackItem.methodName]();
					}
				}
			}

			if (mediaElement.originalNode.muted) {
				vimeoPlayer.setVolume(0);
				volume = 0;
			}

			const vimeoIframe = document.getElementById(vimeo.id);
			let events;

			// a few more events
			events = ['mouseover', 'mouseout'];

			const assignEvents = (e) => {
				const event = mejs.Utils.createEvent(e.type, vimeo);
				mediaElement.dispatchEvent(event);
			};

			for (let i = 0, total = events.length; i < total; i++) {
				vimeoIframe.addEventListener(events[i], assignEvents, false);
			}

			// Vimeo events
			vimeoPlayer.on('loaded', () => {
				vimeoPlayer.getDuration().then((loadProgress) => {
					duration = loadProgress;
					if (duration > 0) {
						bufferedTime = duration * loadProgress;
						if (mediaElement.originalNode.autoplay) {
							paused = false;
							ended = false;
							const event = mejs.Utils.createEvent('play', vimeo);
							mediaElement.dispatchEvent(event);
						}
					}

				}).catch((error) => {
					errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('progress', () => {
				vimeoPlayer.getDuration().then((loadProgress) => {
					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
						if (mediaElement.originalNode.autoplay) {
							const initEvent = mejs.Utils.createEvent('play', vimeo);
							mediaElement.dispatchEvent(initEvent);

							const playingEvent = mejs.Utils.createEvent('playing', vimeo);
							mediaElement.dispatchEvent(playingEvent);
						}
					}

					const event = mejs.Utils.createEvent('progress', vimeo);
					mediaElement.dispatchEvent(event);

				}).catch((error) => errorHandler(error));
			});
			vimeoPlayer.on('timeupdate', () => {
				vimeoPlayer.getCurrentTime().then((seconds) => {
					currentTime = seconds;
					const event = mejs.Utils.createEvent('timeupdate', vimeo);
					mediaElement.dispatchEvent(event);
				}).catch((error) => errorHandler(error));
			});
			vimeoPlayer.on('play', () => {
				paused = false;
				ended = false;
				const event = mejs.Utils.createEvent('play', vimeo);
				mediaElement.dispatchEvent(event);

				const playingEvent = mejs.Utils.createEvent('playing', vimeo);
				mediaElement.dispatchEvent(playingEvent);
			});
			vimeoPlayer.on('pause', () => {
				paused = true;
				ended = false;

				const event = mejs.Utils.createEvent('pause', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('ended', () => {
				paused = false;
				ended = true;

				const event = mejs.Utils.createEvent('ended', vimeo);
				mediaElement.dispatchEvent(event);
			});

			events = ['rendererready', 'loadedmetadata', 'loadeddata', 'canplay'];

			for (let i = 0, total = events.length; i < total; i++) {
				const event = mejs.Utils.createEvent(events[i], vimeo);
				mediaElement.dispatchEvent(event);
			}
		};

		const
			height = mediaElement.originalNode.height,
			width = mediaElement.originalNode.width,
			vimeoContainer = document.createElement('iframe'),
			standardUrl = `https://player.vimeo.com/video/${VimeoApi.getVimeoId(mediaFiles[0].src)}`
		;

		let queryArgs = ~mediaFiles[0].src.indexOf('?') ? `?${mediaFiles[0].src.slice(mediaFiles[0].src.indexOf('?') + 1)}` : '';
		if (queryArgs && mediaElement.originalNode.autoplay && queryArgs.indexOf('autoplay') === -1) {
			queryArgs += '&autoplay=1';
		}
		if (queryArgs && mediaElement.originalNode.loop && queryArgs.indexOf('loop') === -1) {
			queryArgs += '&loop=1';
		}

		// Create Vimeo <iframe> markup
		vimeoContainer.setAttribute('id', vimeo.id);
		vimeoContainer.setAttribute('width', width);
		vimeoContainer.setAttribute('height', height);
		vimeoContainer.setAttribute('frameBorder', '0');
		vimeoContainer.setAttribute('src', `${standardUrl}${queryArgs}`);
		vimeoContainer.setAttribute('webkitallowfullscreen', 'true');
		vimeoContainer.setAttribute('mozallowfullscreen', 'true');
		vimeoContainer.setAttribute('allowfullscreen', 'true');

		mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		VimeoApi.load({
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

		vimeo.destroy = () => {};

		return vimeo;
	}
};

/**
 * Register Vimeo type based on URL structure
 *
 */
mejs.Utils.typeChecks.push((url) => /(\/\/player\.vimeo|vimeo\.com)/i.test(url) ? 'video/x-vimeo' : null);

mejs.Renderers.add(vimeoIframeRenderer);
