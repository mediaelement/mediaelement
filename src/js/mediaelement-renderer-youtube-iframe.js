/**
 * YouTube renderer
 *
 * Uses <iframe> approach and uses YouTube API to manipulate it.
 * Note: IE6-7 don't have postMessage so don't support <iframe> API, and IE8 doesn't fire the onReady event,
 * so it doesn't work - not sure if Google problem or not.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
(function (win, doc, mejs, undefined) {

	/**
	 * Register YouTube type based on URL structure
	 *
	 */
	mejs.Utils.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.indexOf('youtube') > -1 || url.indexOf('youtu.be') > -1) {
			return 'video/youtube';
		} else {
			return null;
		}
	});

	var YouTubeApi = {
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
		enqueueIframe: function (settings) {

			if (this.isLoaded) {
				this.createIframe(settings);
			} else {
				this.loadIframeApi();
				this.iframeQueue.push(settings);
			}
		},

		/**
		 * Load YouTube API's script on the header of the document
		 *
		 */
		loadIframeApi: function () {
			if (!this.isIframeStarted) {
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/player_api';
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				this.isIframeStarted = true;
			}
		},

		/**
		 * Process queue of YouTube <iframe> element creation
		 *
		 */
		iFrameReady: function () {

			this.isLoaded = true;
			this.isIframeLoaded = true;

			while (this.iframeQueue.length > 0) {
				var settings = this.iframeQueue.pop();
				this.createIframe(settings);
			}
		},

		/**
		 * Create a new instance of YouTube API player and trigger a custom event to initialize it
		 *
		 * @param {Object} settings - an object with settings needed to create <iframe>
		 */
		createIframe: function (settings) {

			console.log('creating iframe', settings);

			return new YT.Player(settings.containerId, settings);
		},

		/**
		 * Extract ID from YouTube's URL to be loaded through API
		 * Valid URL format(s):
		 * - http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
		 * - http://www.youtube.com/v/VIDEO_ID?version=3
		 * - http://youtu.be/Djd6tPrxc08
		 *
		 * @param {String} url
		 * @return {string}
		 */
		getYouTubeId: function (url) {

			var youTubeId = "";

			if (url.indexOf('?') > 0) {
				// assuming: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
				youTubeId = YouTubeApi.getYouTubeIdFromParam(url);

				// if it's http://www.youtube.com/v/VIDEO_ID?version=3
				if (youTubeId === '') {
					youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
				}
			} else {
				youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
			}

			return youTubeId;
		},

		/**
		 * Get ID from URL with format: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
		 *
		 * @param {String} url
		 * @returns {string}
		 */
		getYouTubeIdFromParam: function (url) {

			var youTubeId = '',
				parts = url.split('?'),
				parameters = parts[1].split('&');

			for (var i = 0, il = parameters.length; i < il; i++) {
				var paramParts = parameters[i].split('=');
				if (paramParts[0] === 'v') {
					youTubeId = paramParts[1];
					break;
				}
			}

			return youTubeId;
		},

		/**
		 * Get ID from URL with formats
		 *  - http://www.youtube.com/v/VIDEO_ID?version=3
		 *  - http://youtu.be/Djd6tPrxc08
		 * @param {String} url
		 * @return {?String}
		 */
		getYouTubeIdFromUrl: function (url) {

			if (url == undefined || url == null) {
				return null;
			}

			var parts = url.split('?');

			url = parts[0];

			return url.substring(url.lastIndexOf('/') + 1);
		}
	};

	/*
	 * Register YouTube API event globally
	 *
	 */
	win['onYouTubePlayerAPIReady'] = function () {
		console.log('onYouTubePlayerAPIReady');
		YouTubeApi.iFrameReady();
	};

	var YouTubeIframeRenderer = {
		name: 'youtube_iframe',

		options: {
			prefix: 'youtube_iframe'
		},

		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: function (type) {
			var mediaTypes = ['video/youtube', 'video/x-youtube'];

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

			// exposed object
			var youtube = {};
			youtube.options = options;
			youtube.id = mediaElement.id + '_' + options.prefix;
			youtube.mediaElement = mediaElement;

			// API objects
			var apiStack = [],
				youTubeApi = null,
				youTubeApiReady = false,
				paused = true,
				ended = false,
				youTubeIframe = null,
				i,
				il;

			// wrappers for get/set
			var props = mejs.html5media.properties;
			for (i = 0, il = props.length; i < il; i++) {

				// wrap in function to retain scope
				(function (propName) {

					// add to flash state that we will store

					var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

					youtube['get' + capName] = function () {
						if (youTubeApi !== null) {
							var value = null;

							// figure out how to get youtube dta here
							switch (propName) {
								case 'currentTime':
									return youTubeApi.getCurrentTime();

								case 'duration':
									return youTubeApi.getDuration();

								case 'volume':
									return youTubeApi.getVolume();

								case 'paused':
									console.log('YT paused', youTubeState);

									return paused;

								case 'ended':
									return ended;

								case 'muted':
									return youTubeApi.isMuted(); // ?

								case 'buffered':
									var percentLoaded = youTubeApi.getVideoLoadedFraction(),
										duration = youTubeApi.getDuration();
									return {
										start: function () {
											return 0;
										},
										end: function () {
											return percentLoaded * duration;
										},
										length: 1
									};
								case 'src':
									return youTubeApi.getVideoUrl();
							}

							return value;
						} else {
							return null;
						}
					};

					youtube['set' + capName] = function (value) {
						//console.log('[' + options.prefix + ' set]: ' + propName + ' = ' + value, t.flashApi);

						if (youTubeApi !== null) {

							// do something
							switch (propName) {

								case 'src':
									var url = typeof value === 'string' ? value : value[0].src,
										videoId = YouTubeApi.getYouTubeId(url);

									if (mediaElement.getAttribute('autoplay')) {
										youTubeApi.loadVideoById(videoId);
									} else {
										youTubeApi.cueVideoById(videoId);
									}
									break;

								case 'currentTime':
									youTubeApi.seekTo(value);
									break;

								case 'muted':
									if (value) {
										youTubeApi.mute(); // ?
									} else {
										youTubeApi.unMute(); // ?
									}
									setTimeout(function () {
										mediaElement.dispatchEvent({type: 'volumechange'});
									}, 50);
									break;

								case 'volume':
									youTubeApi.setVolume(value);
									setTimeout(function () {
										mediaElement.dispatchEvent({type: 'volumechange'});
									}, 50);
									break;

								default:
									console.log('youtube ' + id, propName, 'UNSUPPORTED property');
							}

						} else {
							// store for after "READY" event fires
							apiStack.push({type: 'set', propName: propName, value: value});
						}
					}

				})(props[i]);
			}

			// add wrappers for native methods
			var methods = mejs.html5media.methods;
			for (i = 0, il = methods.length; i < il; i++) {
				(function (methodName) {

					// run the method on the native HTMLMediaElement
					youtube[methodName] = function () {
						console.log('[' + options.prefix + ' ' + methodName + '()]');

						if (youTubeApi !== null) {

							// DO method
							switch (methodName) {
								case 'play':
									return youTubeApi.playVideo();
								case 'pause':
									return youTubeApi.pauseVideo();
								case 'load':
									return null;

							}

						} else {
							apiStack.push({type: 'call', methodName: methodName});
						}
					};

				})(methods[i]);
			}

			// CREATE YouTube
			var youtubeContainer = doc.createElement('div');
			youtubeContainer.id = youtube.id;
			mediaElement.originalNode.parentNode.insertBefore(youtubeContainer, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			var
				height = mediaElement.originalNode.height,
				width = mediaElement.originalNode.width,
				videoId = YouTubeApi.getYouTubeId(mediaFiles[0].src),
				defaultVars = {
					controls: 0,
					rel: 0,
					disablekb: 1,
					showinfo: 0,
					modestbranding: 0,
					html5: 1,
					playsinline: 1
				},
				youtubeSettings = {
					id: youtube.id,
					containerId: youtubeContainer.id,
					videoId: videoId,
					height: height,
					width: width,
					playerVars: mejs.Utility.extend({}, defaultVars, youtube.options.youTubeVars),
					origin: location.host,
					events: {
						onReady: function (e) {

							youTubeApiReady = true;
							mediaElement.youTubeApi = youTubeApi = e.target;
							mediaElement.youTubeState = youTubeState = {
								paused: true,
								ended: false
							};

							// do call stack
							for (i = 0, il = apiStack.length; i < il; i++) {

								var stackItem = apiStack[i];

								console.log('stack', stackItem.type);

								if (stackItem.type === 'set') {
									var propName = stackItem.propName,
										capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

									youtube['set' + capName](stackItem.value);
								} else if (stackItem.type === 'call') {
									youtube[stackItem.methodName]();
								}
							}

							// a few more events
							youTubeIframe = youTubeApi.getIframe();

							console.log('iframe', youTubeIframe);

							var events = ['mouseover', 'mouseout'];

							for (var j in events) {
								var eventName = events[j];
								mejs.addEvent(youTubeIframe, eventName, function (e) {

									console.log('youtube iframe', e.type);

									var event = mejs.Utils.createEvent(e.type, youtube);

									mediaElement.dispatchEvent(event);
								});
							}

							// send init events
							var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

							for (i = 0, il = initEvents.length; i < il; i++) {
								var event = mejs.Utils.createEvent(initEvents[i], youtube);
								mediaElement.dispatchEvent(event);
							}
						},
						onStateChange: function (e) {

							// translate events
							var events = [];

							switch (e.data) {
								case -1: // not started
									events = ['loadedmetadata'];
									paused = true;
									ended = false;
									break;

								case 0: // YT.PlayerState.ENDED
									events = ['ended'];
									paused = false;
									ended = true;

									youtube.stopInterval();
									break;

								case 1:	// YT.PlayerState.PLAYING
									events = ['play', 'playing'];
									paused = false;
									ended = false;

									youtube.startInterval();

									break;

								case 2: // YT.PlayerState.PAUSED
									events = ['pause'];
									paused = true;
									ended = false;

									youtube.stopInterval();
									break;

								case 3: // YT.PlayerState.BUFFERING
									events = ['progress'];
									paused = false;
									ended = false;

									break;
								case 5: // YT.PlayerState.CUED
									events = ['loadeddata', 'loadedmetadata', 'canplay'];
									paused = true;
									ended = false;

									break;
							}

							// send events up
							for (var i = 0, il = events.length; i < il; i++) {
								var event = mejs.Utils.createEvent(events[i], youtube);
								mediaElement.dispatchEvent(event);
							}

						}
					}
				};

			// send it off for async loading and creation
			YouTubeApi.enqueueIframe(youtubeSettings);

			youtube.onEvent = function (eventName, player, _youTubeState) {
				console.log('yt event', eventName);
				if (_youTubeState != null) {
					mediaElement.youTubeState = youTubeState = _youTubeState;
				}

			};

			youtube.setSize = function (width, height) {
				youTubeApi.setSize(width, height);
			};
			youtube.hide = function () {
				youtube.stopInterval();
				youtube.pause();
				if (youTubeIframe) {
					youTubeIframe.style.display = 'none';
				}
			};
			youtube.show = function () {
				if (youTubeIframe) {
					youTubeIframe.style.display = '';
				}
			};
			youtube.destroy = function () {
				youTubeApi.destroy();
			};
			youtube.interval = null;

			youtube.startInterval = function () {
				// create timer
				youtube.interval = setInterval(function () {

					var event = mejs.Utils.createEvent('timeupdate', youtube);
					mediaElement.dispatchEvent(event);

				}, 250);
			};
			youtube.stopInterval = function () {
				if (youtube.interval) {
					clearInterval(youtube.interval);
				}
			};

			return youtube;
		}
	};

	if (window.postMessage && typeof window.addEventListener) {
		mejs.Renderers.add(YouTubeIframeRenderer);
	}

})(window, document, window.mejs || {});