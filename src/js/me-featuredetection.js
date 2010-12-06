		
// special case for Android which sadly doesn't implement the canPlayType function (always returns '')
if (mejs.PluginDetector.ua.match(/Android 2\.[12]/) !== null) {
	HTMLMediaElement.canPlayType = function(type) {
		return (type.match(/video\/(mp4|m4v)/gi) !== null) ? 'probably' : '';
	};
}

// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
	init: function() {
		var
			nav = mejs.PluginDetector.nav,
			ua = mejs.PluginDetector.ua,
			i,
			v,
			html5Elements = ['source','track','audio','video'];
		
		// detect browsers
		this.isiPad = (ua.match(/iPad/i) !== null);
		this.isiPhone = (ua.match(/iPhone/i) !== null);
		this.isAndroid = (ua.match(/Android/i) !== null);
		this.isIE = (nav.appName.indexOf("Microsoft") != -1);
		this.isChrome = (ua.match(/Chrome/gi) !== null);
		
		// create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
		for (i=0; i<html5Elements.length; i++) {
			v = document.createElement(html5Elements[i]);
		}
		
		// detect native JavaScript fullscreen (Safari only, Chrome fails)
		this.hasNativeFullScreen = (typeof v.webkitEnterFullScreen !== 'undefined');
		if (this.isChrome) {
			this.hasNativeFullScreen = false;
		}
	}
};
mejs.MediaFeatures.init();
