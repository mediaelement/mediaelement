/*
	https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-reference
*/
(function(win, doc, shimi, undef) {

// register youtube type
mejs.Utils.typeChecks.push(function(url) {

	url = new String(url).toLowerCase();

	if (url.indexOf('facebook') > -1) {
		return 'video/x-facebook';
	} else {
		return null;
	}
});

// YouTube Flash and Iframe API
FacebookApi = {
	isIframeStarted: false,
	isIframeLoaded: false,

	iframeQueue: [],
	enqueueIframe: function(yt) {

		if (this.isLoaded) {
			this.createIframe(yt);
		} else {
			this.loadIframeApi();
			this.iframeQueue.push(yt);
		}
	},

	loadIframeApi: function() {
		if (!this.isIframeStarted) {
			var tag = document.createElement('script');
			tag.src = "//connect.facebook.net/en_US/sdk.js";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			this.isIframeStarted = true;
		}
	},

	iFrameReady: function() {

		this.isLoaded = true;
		this.isIframeLoaded = true;

		while (this.iframeQueue.length > 0) {
			var settings = this.iframeQueue.pop();
			this.createIframe(settings);
		}
	},

	createIframe: function(settings) {

		console.log('creating iframe', settings);

		var player = new YT.Player(settings.containerId, settings);
	},

	// src
	getFacebookVideoId: function(url) {
		// https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjohndyer%2Fvideos%2F10107816243681884%2F&show_text=0&width=640
		// https://www.facebook.com/johndyer/videos/10107816243681884/

		// TEMP
		var facebookVideoId = "10107816243681884";
	}
};

// IFRAME
window['fbAsyncInit'] = function() {
	console.log('fbAsyncInit');
	//YouTubeApi.iFrameReady();
}

FacebookRenderer = {
	name: 'facebook',

	// if Flash is installed, returns an array of video types
	canPlayType: function(type) {
		var mediaTypes = ['video/facebook','video/x-facebook'];

		return mediaTypes.indexOf(type) > -1;
	},
	options: {
		prefix: 'facebook'
	},

	create: function (mediaElement, options, mediaFiles) {

		// exposed object
		var fbWrapper = {};
		fbWrapper.options = options;
		fbWrapper.id = mediaElement.id + '_' + options.prefix;
		fbWrapper.mediaElement = mediaElement;

		// API objects
		var
			fbApi = null,
			fbDiv = null,
			apiStack = [],
			paused = true,
			ended = false,
			hasStartedPlaying = false,
			src = '';

		// wrappers for get/set
		var props = mejs.html5media.properties;
		for (var i=0, il=props.length; i<il; i++) {

			// wrap in function to retain scope
			(function(propName) {

				// add to flash state that we will store

				var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

				fbWrapper['get' + capName] = function() {
					
					console.log('FB.get' + propName, fbApi.getDuration());
					
					if (fbApi !== null) {
						var value = null;

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
								return fbApi.isMuted(); // ?

							case 'buffered':
								return {
									start: function(index) {
										return 0;
									},
									end: function (index) {
										return 0;
									},
									length: 1
								};
							case 'src':
								return src;
						}

						return value;
					} else {
						return null;
					}
				}

				fbWrapper['set' + capName] = function(value) {
					//console.log('[' + options.prefix + ' set]: ' + propName + ' = ' + value, t.flashApi);

					if (fbApi !== null) {

						// do somethign
						switch (propName) {

							case 'src':
								var url = typeof value == 'string' ? value : value[0].src;

								createFacebookEmbed(url);

								// sad :(
								break;

							case 'currentTime':
								fbApi.seek(value);
								break;

							case 'muted':
								if (value) {
									fbApi.mute(); // ?
								} else {
									fbApi.unMute(); // ?
								}
								setTimeout(function() {
									mediaElement.dispatchEvent({type:'volumechange'});
								}, 50);
								break;

							case 'volume':
								fbApi.setVolume(value);
								setTimeout(function() {
									mediaElement.dispatchEvent({type:'volumechange'});
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
		for (var i=0, il=methods.length; i<il; i++) {
			(function(methodName) {

				// run the method on the native HTMLMediaElement
				fbWrapper[methodName] = function() {
					console.log('[' + options.prefix + ' ' + methodName + '()]', fbApi);

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

			})(methods[i]);
		}
		

		function sendEvents(events) {
			for (var i=0, il=events.length; i<il; i++) {
				var event = mejs.Utils.createEvent(events[i], fbWrapper);
				mediaElement.dispatchEvent(event);
			}
		}		

		function createFacebookEmbed(url) {

			// create facebook div
			fbDiv = doc.createElement('div');
			fbDiv.id = fbWrapper.id;
			fbDiv.className = "fb-video" ;
			fbDiv.setAttribute("data-href", url); // mediaFiles[0].src; // "https://www.facebook.com/facebook/videos/10153231379946729/";
			fbDiv.setAttribute("data-width", mediaElement.originalNode.width);
			fbDiv.setAttribute("data-allowfullscreen", "true");

			mediaElement.originalNode.parentNode.insertBefore(fbDiv, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			// attach to window
			window.fbAsyncInit = function() {
				FB.init({
					appId      : '{your-app-id}',
					xfbml      : true,
					version    : 'v2.5'
				});

				// Get Embedded Video Player API Instance
				FB.Event.subscribe('xfbml.ready', function(msg) {

					console.log("Facebook ready event", msg);

					if (msg.type === 'video') {

						// get object
						fbApi = msg.instance;

						// do call stack
						for (var i=0, il=apiStack.length; i<il; i++) {

							var stackItem = apiStack[i];

							console.log('stack', stackItem.type);

							if (stackItem.type === 'set') {
								var propName = stackItem.propName,
									capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

								fbWrapper['set' + capName](stackItem.value);
							} else if (stackItem.type === 'call') {
								fbWrapper[stackItem.methodName]();
							}
						}

						console.log('FB INIT');
						sendEvents(['rendererready','ready','loadeddata','canplay']);

						fbApi.subscribe('startedPlaying', function() {
							console.log('FB EVENT','startedPlaying');
							if (!hasStartedPlaying) {
								sendEvents(['loadedmetadata']);
								hasStartedPlaying = true;
							}
							paused = false;
							ended = false;
							sendEvents(['play', 'playing']);
						});
						fbApi.subscribe('paused', function() {
							console.log('FB EVENT','paused');
							paused = true;
							ended = false;
							sendEvents(['paused']);
						});
						fbApi.subscribe('finishedPlaying', function() {
							paused = false;
							ended = true;
							sendEvents(['ended']);
						});
						fbApi.subscribe('startedBuffering', function() {
							sendEvents(['progress']);
						});
						fbApi.subscribe('finishedBuffering', function() {
							//sendEvents(['buffered']);
						});
					}
				});
			};

			//
			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}

		if (mediaFiles.length > 0) {
			createFacebookEmbed(mediaFiles[0].src);
		}


		// send it off for async loading and creation
		//YouTubeApi.enqueueIframe(youtubeSettings);


		fbWrapper.setSize = function(width, height) {
		}
		fbWrapper.hide = function() {
			fbWrapper.stopInterval();
			fbWrapper.pause();
			if (fbDiv) {
				fbDiv.style.display = 'none';
			}
		}
		fbWrapper.show = function() {
			if (fbDiv) {
				fbDiv.style.display = '';
			}
		}
		fbWrapper.destroy = function() {
			//youTubeApi.destroy();
		}
		fbWrapper.interval = null;

		fbWrapper.startInterval = function() {
			// create timer
			youtube.interval = setInterval(function() {

				var event = mejs.Utils.createEvent('timeupdate', fbWrapper);
				mediaElement.dispatchEvent(event);

			}, 250);
		}
		fbWrapper.stopInterval = function() {
			if (youtube.interval) {
				clearInterval(youtube.interval);
			}
		}

		return fbWrapper;
	}
};

// filtering out IE6-8
// IE6-7 don't have postMessage so don't support <iframe> API
// IE8 doesn't fire the onReady event, so it doens't work - not sure if Google problem or not.
if (window.postMessage && typeof window.addEventListener) {
	mejs.Renderers.add(FacebookRenderer);
}

})(window, document, window.mejs || {});