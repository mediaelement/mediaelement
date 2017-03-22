'use strict';

/**
 * SoundCloud renderer
 *
 * Uses <iframe> approach and uses SoundCloud Widget API to manipulate it.
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
const SoundCloudApi = {
	/**
	 * @type {Boolean}
	 */
	isSDKStarted: false,
	/**
	 * @type {Boolean}
	 */
	isSDKLoaded: false,
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

		if (SoundCloudApi.isLoaded) {
			SoundCloudApi.createIframe(settings);
		} else {
			SoundCloudApi.loadIframeApi();
			SoundCloudApi.iframeQueue.push(settings);
		}
	},

	/**
	 * Load SoundCloud API script on the header of the document
	 *
	 */
	loadIframeApi: () => {
		if (!SoundCloudApi.isSDKStarted) {

			const
				head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script")
			;

			let done = false;

			script.src = '//w.soundcloud.com/player/api.js';

			// Attach handlers for all browsers
			// Is onload enough now? do IE9 support it?
			script.onload = script.onreadystatechange = () => {
				if (!done && (!SoundCloudApi.readyState || SoundCloudApi.readyState === "loaded" || SoundCloudApi.readyState === "complete")) {
					done = true;
					SoundCloudApi.apiReady();

					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;
					script.remove();
				}
			};
			head.appendChild(script);
			SoundCloudApi.isSDKStarted = true;
		}
	},

	/**
	 * Process queue of SoundCloud <iframe> element creation
	 *
	 */
	apiReady: () => {
		SoundCloudApi.isLoaded = true;
		SoundCloudApi.isSDKLoaded = true;

		while (SoundCloudApi.iframeQueue.length > 0) {
			const settings = SoundCloudApi.iframeQueue.pop();
			SoundCloudApi.createIframe(settings);
		}
	},

	/**
	 * Create a new instance of SoundCloud Widget player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to create <iframe>
	 */
	createIframe: (settings) => {
		const player = SC.Widget(settings.iframe);
		window['__ready__' + settings.id](player);
	}
};

const SoundCloudIframeRenderer = {
	name: 'soundcloud_iframe',

	options: {
		prefix: 'soundcloud_iframe'
	},

	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {Boolean}
	 */
	canPlayType: (type) => ['video/soundcloud', 'video/x-soundcloud'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		// create our fake element that allows events and such to work
		const
			sc = {},
			apiStack = [],
			readyState = 4,
			autoplay = mediaElement.originalNode.autoplay
		;

		let
			duration = 0,
			currentTime = 0,
			bufferedTime = 0,
			volume = 1,
			muted = false,
			paused = true,
			ended = false,
			scPlayer = null,
			scIframe = null
		;

		// store main variable
		sc.options = options;
		sc.id = mediaElement.id + '_' + options.prefix;
		sc.mediaElement = mediaElement;

		// wrappers for get/set
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {

				// add to flash state that we will store

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				sc[`get${capName}`] = () => {
					if (scPlayer !== null) {
						const value = null;

						// figure out how to get dm dta here
						switch (propName) {
							case 'currentTime':
								return currentTime;

							case 'duration':
								return duration;

							case 'volume':
								return volume;

							case 'paused':
								return paused;

							case 'ended':
								return ended;

							case 'muted':
								return muted; // ?

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
							case 'src':
								return (scIframe) ? scIframe.src : '';

							case 'readyState':
								return readyState;
						}

						return value;
					} else {
						return null;
					}
				};

				sc[`set${capName}`] = (value) => {

					if (scPlayer !== null) {

						// do something
						switch (propName) {

							case 'src':
								const url = typeof value === 'string' ? value : value[0].src;

								scPlayer.load(url);

								if (autoplay) {
									scPlayer.play();
								}
								break;

							case 'currentTime':
								scPlayer.seekTo(value * 1000);
								break;

							case 'muted':
								if (value) {
									scPlayer.setVolume(0); // ?
								} else {
									scPlayer.setVolume(1); // ?
								}
								setTimeout(() => {
									const event = mejs.Utils.createEvent('volumechange', sc);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'volume':
								scPlayer.setVolume(value);
								setTimeout(() => {
									const event = mejs.Utils.createEvent('volumechange', sc);
									mediaElement.dispatchEvent(event);
								}, 50);
								break;

							case 'readyState':
								const event = mejs.Utils.createEvent('canplay', sc);
								mediaElement.dispatchEvent(event);
								break;

							default:
								console.log('sc ' + sc.id, propName, 'UNSUPPORTED property');
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

				// run the method on the Soundcloud API
				sc[methodName] = () => {

					if (scPlayer !== null) {

						// DO method
						switch (methodName) {
							case 'play':
								return scPlayer.play();
							case 'pause':
								return scPlayer.pause();
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

		// add a ready method that SC can fire
		window['__ready__' + sc.id] = (_scPlayer) => {

			mediaElement.scPlayer = scPlayer = _scPlayer;

			if (autoplay) {
				scPlayer.play();
			}

			// do call stack
			if (apiStack.length) {
				for (let i = 0, total = apiStack.length; i < total; i++) {

					const stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						const propName = stackItem.propName,
							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

						sc[`set${capName}`](stackItem.value);
					} else if (stackItem.type === 'call') {
						sc[stackItem.methodName]();
					}
				}
			}

			// SoundCloud properties are async, so we don't fire the event until the property callback fires
			scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, () => {
				paused = false;
				ended = false;

				scPlayer.getPosition((_currentTime) => {
					currentTime = _currentTime / 1000;
					const event = mejs.Utils.createEvent('timeupdate', sc);
					mediaElement.dispatchEvent(event);
				});
			});

			scPlayer.bind(SC.Widget.Events.PAUSE, () => {
				paused = true;

				const event = mejs.Utils.createEvent('pause', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.PLAY, () => {
				paused = false;
				ended = false;

				const event = mejs.Utils.createEvent('play', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.FINISHED, () => {
				paused = false;
				ended = true;

				const event = mejs.Utils.createEvent('ended', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.READY, () => {
				scPlayer.getDuration((_duration) => {
					duration = _duration / 1000;

					const event = mejs.Utils.createEvent('loadedmetadata', sc);
					mediaElement.dispatchEvent(event);
				});
			});
			scPlayer.bind(SC.Widget.Events.LOAD_PROGRESS, () => {
				scPlayer.getDuration((loadProgress) => {
					if (duration > 0) {
						bufferedTime = duration * loadProgress;

						const event = mejs.Utils.createEvent('progress', sc);
						mediaElement.dispatchEvent(event);
					}
				});
				scPlayer.getDuration((_duration) => {
					duration = _duration;

					const event = mejs.Utils.createEvent('loadedmetadata', sc);
					mediaElement.dispatchEvent(event);
				});
			});

			// give initial events
			const initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

			for (let i = 0, total = initEvents.length; i < total; i++) {
				const event = mejs.Utils.createEvent(initEvents[i], sc);
				mediaElement.dispatchEvent(event);
			}
		};

		// container for API API
		scIframe = document.createElement('iframe');
		scIframe.id = sc.id;
		scIframe.width = 10;
		scIframe.height = 10;
		scIframe.frameBorder = 0;
		scIframe.style.visibility = 'hidden';
		scIframe.src = mediaFiles[0].src;
		scIframe.scrolling = 'no';

		mediaElement.appendChild(scIframe);
		mediaElement.originalNode.style.display = 'none';

		const scSettings = {
			iframe: scIframe,
			id: sc.id
		};

		SoundCloudApi.enqueueIframe(scSettings);

		sc.setSize = () => {};
		sc.hide = () => {
			sc.pause();
			if (scIframe) {
				scIframe.style.display = 'none';
			}
		};
		sc.show = () => {
			if (scIframe) {
				scIframe.style.display = '';
			}
		};
		sc.destroy = () => {
			scPlayer.destroy();
		};

		return sc;
	}
};

/**
 * Register SoundCloud type based on URL structure
 *
 */
mejs.Utils.typeChecks.push((url) => {
	url = url.toLowerCase();
	return (url.includes('//soundcloud.com') || url.includes('//w.soundcloud.com')) ? 'video/x-soundcloud' : null;
});

mejs.Renderers.add(SoundCloudIframeRenderer);