
/*
extension methods to <video> or <audio> object to bring it into parity with PluginMediaElement (see below)
*/
mejs.HtmlMediaElement = {
	pluginType: 'native',

	setCurrentTime: function (time) {
		this.currentTime = time;
	},
	
	setMuted: function (muted) {
		this.muted = muted;
	},
	
	setVolume: function (volume) {
		this.volume = volume;
	},

	// This can be a url string
	// or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]
	setSrc: function (url) {
		if (typeof url == 'string') {
			this.src = url;
		} else {
			var i, media;
			
			for (i=0; i<url.length; i++) {
				media = url[i];
				if (this.canPlayType(media.type)) {
					this.src = media.src;
				}
			}			
		}
	},

	setVideoSize: function (width, height) {
		this.width = width;
		this.height = height;
	}
};

/*
Mimics the <video/audio> element by calling Flash's External Interface or Silverlights [ScriptableMember]
*/
mejs.PluginMediaElement = function (pluginid, pluginType) {
	this.id = pluginid;
	this.pluginType = pluginType;
	this.events = {};
};

// JavaScript values and ExternalInterface methods that match HTML5 video properties methods
// http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/fl/video/FLVPlayback.html
// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html	
mejs.PluginMediaElement.prototype = {

	// special
	pluginElement: null,
	pluginType: '',

	// not implemented :(
	playbackRate: -1,
	defaultPlaybackRate: -1,
	seekable: [],
	played: [],

	// HTML5 read-only properties
	paused: true,
	ended: false,
	seeking: false,
	duration: 0,

	// HTML5 get/set properties, but only set (updated by event handlers)
	muted: false,
	volume: 1,
	currentTime: 0,

	// HTML5 methods
	play: function () {
		if (this.pluginApi != null) {
			this.pluginApi.playMedia();
			this.paused = false;
		}
	},
	load: function () {
		if (this.pluginApi != null) {
			this.pluginApi.loadMedia();
			this.paused = false;
		}
	},
	pause: function () {
		if (this.pluginApi != null) {
			this.pluginApi.pauseMedia();
			this.paused = true;
		}
	},	
	canPlayType: function(type) {
		var i,
			j,
			pluginInfo,
			pluginVersions = mejs.plugins[this.pluginType];	
			
		for (i=0; i<pluginVersions.length; i++) {
			pluginInfo = pluginVersions[i];
			
			// test if user has the correct plugin version
			if (mejs.PluginDetector.hasPluginVersion(this.pluginType, pluginInfo.version)) {
			
				// test for plugin playback types
				for (j=0; j<pluginInfo.types.length; j++) {
					// find plugin that can play the type
					if (type == pluginInfo.types[j]) {
						return true;
					}
				}
			}
		}	
		
		return false;
	},

	// custom methods since not all JavaScript implementations support get/set
	
	// This can be a url string
	// or an array [{src:'file.mp4',type:'video/mp4'},{src:'file.webm',type:'video/webm'}]	
	setSrc: function (url) {
		if (typeof url == 'string') {
			this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(url));
		} else {
			var i, media;
			
			for (i=0; i<url.length; i++) {
				media = url[i];
				if (this.canPlayType(media.type)) {
					this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(media.src));
				}
			}			
		}	
		
	},
	setCurrentTime: function (time) {
		if (this.pluginApi != null) {
			this.pluginApi.setCurrentTime(time);
			this.currentTime = time;
		}
	},
	setVolume: function (volume) {
		if (this.pluginApi != null) {
			this.pluginApi.setVolume(volume);
			this.volume = volume;
		}
	},
	setMuted: function (muted) {
		if (this.pluginApi != null) {
			this.pluginApi.setMuted(muted);	
			this.muted = muted;
		}
	},

	// additional non-HTML5 methods
	setVideoSize: function (width, height) {					
		if ( this.pluginElement.style) {
			this.pluginElement.style.width = width + 'px';
			this.pluginElement.style.height = height + 'px';						
		}
		if (this.pluginApi != null) {
			this.pluginApi.setVideoSize(width, height);
		}
	},
	
	setFullscreen: function (fullscreen) {
		if (this.pluginApi != null) {
			this.pluginApi.setFullscreen(fullscreen);
		}
	},

	// start: fake events
	addEventListener: function (eventName, callback, bubble) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(callback);
	},		
	dispatchEvent: function (eventName) {
		var i,
			args,
			callbacks = this.events[eventName];
			
		if (callbacks) {
			args = Array.prototype.slice.call(arguments, 1);
			for (i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(null, args);
			}
		}
	}
	// end: fake events
};
