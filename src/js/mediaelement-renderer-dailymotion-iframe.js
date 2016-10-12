/**
 * DailyMotion renderer
 *
 * Uses <iframe> approach and uses DailyMotion API to manipulate it.
 * @see https://developer.dailymotion.com/player
 *
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register DailyMotion type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('dailymotion.com') > -1 || url.indexOf('dai.ly') > -1) {
			return 'video/dailymotion';
		} else {
			return null;
		}
	});

	var DailyMotionApi = {
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
		 * Load DailyMotion API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isSDKStarted) {
				var e = document.createElement('script');
				e.async = true;
				e.src = 'https://api.dmcdn.net/all.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(e, s);
				this.isSDKStarted = true;
			}
		},

		/**
		 * Process queue of DailyMotion <iframe> element creation
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
		 * Create a new instance of DailyMotion API player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {

			console.log('creating iframe', settings);

			var
				//id = settings.id,
				player = DM.player(settings.container, {
					height: '100%', // settings.height,
					width: '100%', //settings.width,
					video: settings.videoId,
					params: {
						chromeless: 1,
						api: 1,
						info: 0,
						logo: 0,
						related: 0
					},
					origin: location.host
				});

			player.addEventListener('apiready', function () {
				console.log('DM api ready');

				win['__ready__' + settings.id](player, {paused: true, ended: false});
			});
		},

		/**
		 * Extract ID from DailyMotion's URL to be loaded through API
		 * Valid URL format(s):
		 * - http://www.dailymotion.com/embed/video/x35yawy
		 * - http://dai.ly/x35yawy
		 *
		 * @param {String} url
		 * @return {String}
		 */
		getDailyMotionId: function (url) {
			var
				parts = url.split('/'),
				last_part = parts[parts.length - 1],
				dash_parts = last_part.split('_')
				;

			return dash_parts[0];
		}
	};

	/*
	 * Register DailyMotion event globally
	 *
	 */
	win['dmAsyncInit'] = function () {
		console.log('dmAsyncInit');
		DailyMotionApi.apiReady();
	};

	var DailyMotionIframeRenderer = {
		name: 'dailymotion_iframe',

		options: {
			prefix: 'dailymotion_iframe'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/dailymotion', 'video/x-dailymotion'];

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

			var dm = {};

			dm.options = options;
			dm.id = mediaElement.id + '_' + options.prefix;
			dm.mediaElement = mediaElement;

			var
				apiStack = [],
				dmPlayerReady = false,
				dmPlayer = null,
				dmIframe = null,
				i,
				il,
				events
				;

			// wrappers for get/set
			var props = mejs.html5media.properties;
			for (i = 0, il = props.length; i < il; i++) {

				// wrap in function to retain scope
				(function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					dm['get' + capName] = function () {
						if (dmPlayer !== null) {
							var value = null;

							// figure out how to get dm dta here
							switch (propName) {
								case 'currentTime':
									return dmPlayer.currentTime;

								case 'duration':
									return isNaN(dmPlayer.duration) ? 0 : dmPlayer.duration;

								case 'volume':
									return dmPlayer.volume;

								case 'paused':
									return dmPlayer.paused;

								case 'ended':
									return dmPlayer.ended;

								case 'muted':
									return dmPlayer.muted;

								case 'buffered':
									var percentLoaded = dmPlayer.bufferedTime,
										duration = dmPlayer.duration;
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return percentLoaded / duration;
										},
										length: 1
									};
								case 'src':
									return mediaElement.originalNode.getAttribute('src');
							}

							return value;
						} else {
							return null;
						}
					};

					dm['set' + capName] = function (value) {
						//console.log('[' + options.prefix + ' set]: ' + propName + ' = ' + value, t.flashApi);

						if (dmPlayer !== null) {

							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src;

									dmPlayer.load(DailyMotionApi.getDailyMotionId(url));
									break;

								case 'currentTime':
									dmPlayer.seek(value);
									break;

								case 'muted':
									if (value) {
										dmPlayer.setMuted(true);
									} else {
										dmPlayer.setMuted(false);
									}
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', dm);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								case 'volume':
									dmPlayer.setVolume(value);
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', dm);
										mediaElement.dispatchEvent(event);
									}, 50);
									break;

								default:
									console.log('dm ' + id, propName, 'UNSUPPORTED property');
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					};

				})(props[i]);
			}

			// add wrappers for native methods
			var methods = mejs.html5media.methods;
			for (i = 0, il = methods.length; i < il; i++) {
				(function (methodName) {

					// run the method on the native HTMLMediaElement
					dm[methodName] = function () {
						console.log('[' + options.prefix + ' ' + methodName + '()]');

						if (dmPlayer !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return dmPlayer.play();
								case 'pause':
									return dmPlayer.pause();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				})(methods[i]);
			}

			// Initial method to register all DailyMotion events when initializing <iframe>
			win['__ready__' + dm.id] = function (_dmPlayer) {

				dmPlayerReady = true;
				mediaElement.dmPlayer = dmPlayer = _dmPlayer;

				console.log('dm ready', dmPlayer);

				// do call stack
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					console.log('stack', stackItem.type);

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
							capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

						dm['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						dm[stackItem.methodName]();
					}
				}

				dmIframe = doc.getElementById(dm.id);

				// a few more events
				events = ['mouseover', 'mouseout'];
				for (var j in events) {
					var eventName = events[j];
					mejs.addEvent(dmIframe, eventName, function (e) {
						var event = mejs.Utils.createEvent(e.type, dm);

						mediaElement.dispatchEvent(event);
					});
				}

				// BUBBLE EVENTS up
				events = mejs.html5media.events;
				events = events.concat(['click', 'mouseover', 'mouseout']);

				for (i = 0, il = events.length; i < il; i++) {
					(function (eventName) {

						// Deprecated event; not consider it
						if (eventName !== 'ended') {

							dmPlayer.addEventListener(eventName, function (e) {
								// copy event
								var event = mejs.Utils.createEvent(e.type, dmPlayer);
								mediaElement.dispatchEvent(event);
							});
						}

					})(events[i]);
				}

				// Custom DailyMotion events
				dmPlayer.addEventListener('video_start', function () {
					var event = mejs.Utils.createEvent('play', dmPlayer);
					mediaElement.dispatchEvent(event);

					event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('video_end', function () {
					var event = mejs.Utils.createEvent('ended', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('progress', function () {
					var event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});
				dmPlayer.addEventListener('durationchange', function () {
					event = mejs.Utils.createEvent('timeupdate', dmPlayer);
					mediaElement.dispatchEvent(event);
				});


				// give initial events
				var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

				for (var i = 0, il = initEvents.length; i < il; i++) {
					var event = mejs.Utils.createEvent(initEvents[i], dm);
					mediaElement.dispatchEvent(event);
				}
			};

			var dmContainer = doc.createElement('div');
			dmContainer.id = dm.id;
			mediaElement.appendChild(dmContainer);
			if (mediaElement.originalNode) {
				dmContainer.style.width = mediaElement.originalNode.style.width;
				dmContainer.style.height = mediaElement.originalNode.style.height;
			}
			//mediaElement.originalNode.parentNode.insertBefore(dmContainer, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			var
				videoId = DailyMotionApi.getDailyMotionId(mediaFiles[0].src),
				dmSettings = {
					id: dm.id,
					container: dmContainer,
					videoId: videoId
				};

			DailyMotionApi.enqueueIframe(dmSettings);

			dm.hide = function () {
				dm.stopInterval();
				dm.pause();
				if (dmIframe) {
					dmIframe.style.display = 'none';
				}
			};
			dm.show = function () {
				if (dmIframe) {
					dmIframe.style.display = '';
				}
			};
			dm.destroy = function () {
				dmPlayer.destroy();
			};
			dm.interval = null;

			dm.startInterval = function () {
				dm.interval = setInterval(function () {
					DailyMotionApi.sendEvent(dm.id, dmPlayer, 'timeupdate', {
						paused: false,
						ended: false
					});
				}, 250);
			};
			dm.stopInterval = function () {
				if (dm.interval) {
					clearInterval(dm.interval);
				}
			};

			return dm;
		}
	};

	mejs.Renderers.add(DailyMotionIframeRenderer);

})(window, document, window.mejs || {});