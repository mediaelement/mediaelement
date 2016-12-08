/**
 * SoundCloud renderer
 *
 * Uses <iframe> approach and uses SoundCloud Widget API to manipulate it.
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register SoundCloud type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('soundcloud.com') > -1) {
			return 'video/x-soundcloud';
		} else {
			return null;
		}
	});

	var SoundCloudApi = {
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
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load SoundCloud API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isSDKStarted) {

				var head = doc.getElementsByTagName("head")[0] || document.documentElement,
					script = doc.createElement("script"),
					done = false;

				script.src = 'https://w.soundcloud.com/player/api.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
						done = true;
						SoundCloudApi.apiReady();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if (head && script.parentNode) {
							head.removeChild(script);
						}
					}
				};
				head.appendChild(script);
				this.isSDKStarted = true;
			}
		},

		/**
		 * Process queue of SoundCloud <iframe> element creation
		 *
		 */
		apiReady: function () {
			this.isLoaded = true;
			this.isSDKLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of SoundCloud Widget player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {
			var player = SC.Widget(settings.iframe);
			win['__ready__' + settings.id](player);
		}
	};

	var SoundCloudIframeRenderer = {
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
		canPlayType: function (type) {
			var mediaTypes = ['video/soundcloud', 'video/x-soundcloud'];

			return mediaTypes.indexOf(type) > -1;
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Object} options All the player configuration options passed through constructor
		 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var sc = {};

			// store main variable
			sc.options = options;
			sc.id = mediaElement.id + '_' + options.prefix;
			sc.mediaElement = mediaElement;

			// create our fake element that allows events and such to work
			var apiStack = [],
				scPlayerReady = false,
				scPlayer = null,
				scIframe = null,

				currentTime = 0,
				duration = 0,
				bufferedTime = 0,
				paused = true,
				volume = 1,
				muted = false,
				ended = false,
				i,
				il;

			// wrappers for get/set
			var
				props = mejs.html5media.properties,
				assignGettersSetters = function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					sc['get' + capName] = function () {
						if (scPlayer !== null) {
							var value = null;

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
										start: function () {
											return 0;
										},
										end: function () {
											return bufferedTime * duration;
										},
										length: 1
									};
								case 'src':
									return (scIframe) ? scIframe.src : '';
							}

							return value;
						} else {
							return null;
						}
					};

					sc['set' + capName] = function (value) {

						if (scPlayer !== null) {

							// do something
							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src;

									scPlayer.load(url);
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
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', sc);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								case 'volume':
									scPlayer.setVolume(value);
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', sc);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								default:
									console.log('sc ' + sc.id, propName, 'UNSUPPORTED property');
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
			var
				methods = mejs.html5media.methods,
				assignMethods = function (methodName) {

					// run the method on the Soundcloud API
					sc[methodName] = function () {

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
			for (i = 0, il = methods.length; i < il; i++) {
				assignMethods(methods[i]);
			}

			// add a ready method that SC can fire
			win['__ready__' + sc.id] = function (_scPlayer) {

				scPlayerReady = true;
				mediaElement.scPlayer = scPlayer = _scPlayer;

				// do call stack
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						sc['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						sc[stackItem.methodName]();
					}
				}

				// SoundCloud properties are async, so we don't fire the event until the property callback fires
				scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
					paused = false;
					ended = false;

					scPlayer.getPosition(function (_currentTime) {
						currentTime = _currentTime / 1000;
						var event = mejs.Utils.createEvent('timeupdate', sc);
						mediaElement.dispatchEvent(event);
					});
				});

				scPlayer.bind(SC.Widget.Events.PAUSE, function () {
					paused = true;

					var event = mejs.Utils.createEvent('pause', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.PLAY, function () {
					paused = false;
					ended = false;

					var event = mejs.Utils.createEvent('play', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.FINISHED, function () {
					paused = false;
					ended = true;

					var event = mejs.Utils.createEvent('ended', sc);
					mediaElement.dispatchEvent(event);
				});
				scPlayer.bind(SC.Widget.Events.READY, function () {
					scPlayer.getDuration(function (_duration) {
						duration = _duration / 1000;

						var event = mejs.Utils.createEvent('loadedmetadata', sc);
						mediaElement.dispatchEvent(event);
					});
				});
				scPlayer.bind(SC.Widget.Events.LOAD_PROGRESS, function () {
					scPlayer.getDuration(function (loadProgress) {
						if (duration > 0) {
							bufferedTime = duration * loadProgress;

							var event = mejs.Utils.createEvent('progress', sc);
							mediaElement.dispatchEvent(event);
						}
					});
					scPlayer.getDuration(function (_duration) {
						duration = _duration;

						var event = mejs.Utils.createEvent('loadedmetadata', sc);
						mediaElement.dispatchEvent(event);
					});
				});

				// give initial events
				var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

				for (var i = 0, il = initEvents.length; i < il; i++) {
					var event = mejs.Utils.createEvent(initEvents[i], sc);
					mediaElement.dispatchEvent(event);
				}
			};

			// container for API API
			scIframe = doc.createElement('iframe');
			scIframe.id = sc.id;
			scIframe.width = 10;
			scIframe.height = 10;
			scIframe.frameBorder = 0;
			scIframe.style.visibility = 'hidden';
			scIframe.src = mediaFiles[0].src;
			scIframe.scrolling = 'no';
			mediaElement.appendChild(scIframe);

			mediaElement.originalNode.style.display = 'none';

			var
				scSettings = {
					iframe: scIframe,
					id: sc.id
				};

			SoundCloudApi.enqueueIframe(scSettings);

			sc.setSize = function (width, height) {
				// nothing here, audio only
			};
			sc.hide = function () {
				sc.pause();
				if (scIframe) {
					scIframe.style.display = 'none';
				}
			};
			sc.show = function () {
				if (scIframe) {
					scIframe.style.display = '';
				}
			};
			sc.destroy = function () {
				scPlayer.destroy();
			};

			return sc;
		}
	};

	mejs.Renderers.add(SoundCloudIframeRenderer);

})(window, document, window.mejs || {});