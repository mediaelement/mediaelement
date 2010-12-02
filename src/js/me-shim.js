

// Handles calls from Flash/Silverlight and reports them as native <video/audio> events and properties
mejs.MediaPluginBridge = {

	pluginMediaElements:{},
	htmlMediaElements:{},

	registerPluginElement: function (id, pluginMediaElement, htmlMediaElement) {
		this.pluginMediaElements[id] = pluginMediaElement;
		this.htmlMediaElements[id] = htmlMediaElement;
	},

	// when Flash/Silverlight is ready, it calls out to this method
	initPlugin: function (id) {
		
		var pluginMediaElement = this.pluginMediaElements[id],
			htmlMediaElement = this.htmlMediaElements[id];
	
		// find the javascript bridge
		switch (pluginMediaElement.pluginType) {
			case "flash":					
				pluginMediaElement.pluginElement = pluginMediaElement.pluginApi = document.getElementById(id);
				break;
			case "silverlight":
				pluginMediaElement.pluginElement = document.getElementById(pluginMediaElement.id);
				pluginMediaElement.pluginApi = pluginMediaElement.pluginElement.Content.SilverlightApp;
				break;
		}

		if (pluginMediaElement.success) {
			pluginMediaElement.success(pluginMediaElement, htmlMediaElement);
		}
	},

	// receives events from Flash/Silverlight and sends them out as HTML5 media events
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html
	fireEvent: function (id, eventName, values) {

		var
			e,
			i,
			bufferedTime,
			pluginMediaElement = this.pluginMediaElements[id];
		
		pluginMediaElement.ended = false;
		pluginMediaElement.paused = true;

		// fake event object to mimic real HTML media event.
		e = {
			type: eventName,
			target: pluginMediaElement
		};

		// attach all values to element and event object
		for (i in values) {
			pluginMediaElement[i] = values[i];
			e[i] = values[i];
		}

		// fake the newer W3C buffered TimeRange (loaded and total have been removed)
		bufferedTime = values.bufferedTime || 0;
		
		e.target.buffered = e.buffered = {
			start: function(index) {
				return 0;
			},
			end: function (index) {
				return bufferedTime;
			},
			length: 1
		};

		pluginMediaElement.dispatchEvent(e.type, e);
	}
};

/*
Default options
*/
mejs.MediaElementDefaults = {
	// shows debug errors on screen
	enablePluginDebug: false,
	// remove or reorder to change plugin priority
	plugins: ['flash','silverlight'],
	// specify to force MediaElement into a mode
	type: '',
	// path to Flash and Silverlight plugins
	pluginPath: mejs.Utility.getScriptPath(['mediaelement.js','mediaelement.min.js','mediaelement-and-player.js','mediaelement-and-player.min.js']),
	// name of flash file
	flashName: 'flashmediaelement.swf',
	// name of silverlight file
	silverlightName: 'silverlightmediaelement.xap',
	// default if the <video width> is not specified
	defaultVideoWidth: 480,
	// default if the <video height> is not specified		
	defaultVideoHeight: 270,
	// overrides <video width>
	pluginWidth: -1,
	// overrides <video height>		
	pluginHeight: -1,
	// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
	// larger number is less accurate, but less strain on plugin->JavaScript bridge
	timerRate: 250,
	success: function () { },
	error: function () { }
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash/Silverlight version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function (el, o) {	
	mejs.HtmlMediaElementShim.create(el,o);
};

mejs.HtmlMediaElementShim = {		

	create: function(el, o) {			
		var
			options = mejs.MediaElementDefaults,
			htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,					
			isVideo = (htmlMediaElement.tagName.toLowerCase() == 'video'),			
			supportsMediaTag = (typeof(htmlMediaElement.canPlayType) != 'undefined'),
			playback = {method:'', url:''},
			poster = htmlMediaElement.getAttribute('poster'),
			autoplay =  htmlMediaElement.getAttribute('autoplay'),
			preload =  htmlMediaElement.getAttribute('preload'),
			prop;

		// extend options
		for (prop in o) {
			options[prop] = o[prop];
		}
		
		// check for real poster
		poster = (typeof poster == 'undefined' || poster === null) ? '' : poster;
		preload = (typeof preload == 'undefined' || preload === null || preload === 'false') ? 'none' : preload;
		autoplay = (typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false') ? '' : autoplay;
		
		// test for HTML5 and plugin capabilities
		playback = this.determinePlayback(htmlMediaElement, options, isVideo, supportsMediaTag);

		if (playback.method == 'native') {
			// add methods to native HTMLMediaElement
			this.updateNative( htmlMediaElement, options);				
		} else if (playback.method !== '') {
			// create plugin to mimic HTMLMediaElement
			this.createPlugin( htmlMediaElement, options, isVideo, playback.method, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url).replace('&','%26') : '', poster, autoplay, preload);
		} else {
			// boo, no HTML5, no Flash, no Silverlight.
			this.createErrorMessage( htmlMediaElement, options, (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '', poster );
		}			
	},
	
	determinePlayback: function(htmlMediaElement, options, isVideo, supportsMediaTag) {
		
		var
			mediaFiles = [],
			i,
			j,
			k,	
			l,			
			n,
			url,
			type,
			result = { method: '', url: ''},
			src = htmlMediaElement.getAttribute('src'),
			pluginName,
			pluginVersions,
			pluginInfo;
		
		// STEP 1: Get Files from <video src> or <source src>
		
		// supplied type overrides all HTML
		if (typeof (options.type) != 'undefined' && options.type !== '') {								
			mediaFiles.push({type:options.type, url:null});

		// test for src attribute first
		} else if (src  != 'undefined' && src  !== null) {
			url = htmlMediaElement.getAttribute('src');
			type = this.checkType(url, htmlMediaElement.getAttribute('type'), isVideo);
			mediaFiles.push({type:type, url:url});

		// then test for <source> elements
		} else {
			// test <source> types to see if they are usable
			for (i = 0; i < htmlMediaElement.childNodes.length; i++) {
				n = htmlMediaElement.childNodes[i];
				if (n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
					url = n.getAttribute('src');
					type = this.checkType(url, n.getAttribute('type'), isVideo);
					mediaFiles.push({type:type, url:url});
				}							
			}			
		}
		
		// STEP 2: Test for playback method
	
		// test for native playback first
		if (supportsMediaTag) {
			for (i=0; i<mediaFiles.length; i++) {
				if (htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== '') {
					result.method = 'native';
					result.url = mediaFiles[i].url;					
					return result;
				}
			}
		}

		
		// if native playback didn't work, then test plugins		
		for (i=0; i<mediaFiles.length; i++) {
			type = mediaFiles[i].type;
			
			// test all plugins in order of preference [silverlight, flash]
			for (j=0; j<options.plugins.length; j++) {
				
				pluginName = options.plugins[j];
				
				// test version of plugin (for future features)
				pluginVersions = mejs.plugins[pluginName];				
				for (k=0; k<pluginVersions.length; k++) {
					pluginInfo = pluginVersions[k];
					
					// test if user has the correct plugin version
					if (mejs.PluginDetector.hasPluginVersion(pluginName, pluginInfo.version)) {
					
						// test for plugin playback types
						for (l=0; l<pluginInfo.types.length; l++) {
							// find plugin that can play the type
							if (type == pluginInfo.types[l]) {
								result.method = pluginName;
								result.url = mediaFiles[i].url;					
								return result;
							}
						}
					}
				}
			}
		}
		
		// what if there's nothing to play? just grab the first available
		if (result.method === '') {
			result.url = mediaFiles[0].url;
		}
		
		return result;			
		
	},
	
	checkType: function(url, type, isVideo) {
		var ext;
		
		// if no type is supplied, fake it with the extension
		if (url && !type) {
			ext = url.substring(url.lastIndexOf('.') + 1);
			return ((isVideo) ? 'video' : 'audio') + '/' + ext;
		} else {
			return type;
		}
	},
	
	createErrorMessage: function(htmlMediaElement, options, downloadUrl, poster) {
		var errorContainer = document.createElement('div');
		errorContainer.className = 'me-cannotplay';
		
		try {
			errorContainer.style.width = htmlMediaElement.width + 'px';
			errorContainer.style.height = htmlMediaElement.height + 'px';
		} catch (e) {}
					
		errorContainer.innerHTML = (poster !== '') ?
			'<a href="' + downloadUrl + '"><img src="' + poster + '" /></a>' :
			'<a href="' + downloadUrl + '"><span>Download File</span></a>';
		
		htmlMediaElement.parentNode.insertBefore(errorContainer, htmlMediaElement);
		htmlMediaElement.style.display = 'none';

		options.error(htmlMediaElement);		
	},
	
	createPlugin:function(htmlMediaElement, options, isVideo, pluginType, mediaUrl, poster, autoplay, preload) {
	
		var width = 1,
			height = 1,
			pluginid = 'me_' + pluginType + '_' + (mejs.meIndex++),
			pluginMediaElement = new mejs.PluginMediaElement(pluginid, pluginType),
			container = document.createElement('div'),
			node,
			initVars;
			
		// check for placement inside a <p> tag (sometimes WYSIWYG editors do this)
		node = htmlMediaElement.parentNode;
		while (node !== null && node.tagName.toLowerCase() != 'body') {
			if (node.parentNode.tagName.toLowerCase() == 'p') {
				node.parentNode.parentNode.insertBefore(node, node.parentNode);
				break;
			}
			node = node.parentNode;
		}			

		if (isVideo) {
			width = (options.videoWidth > 0) ? options.videoWidth : (htmlMediaElement.getAttribute('width') !== null) ? htmlMediaElement.getAttribute('width') : options.defaultVideoWidth;
			height = (options.videoHeight > 0) ? options.videoHeight : (htmlMediaElement.getAttribute('height') !== null) ? htmlMediaElement.getAttribute('height') : options.defaultVideoHeight;				
		} else {
			if (options.enablePluginDebug) {
				width = 320;
				height = 240;					
			}
		}

		// register plugin
		pluginMediaElement.success = options.success;
		mejs.MediaPluginBridge.registerPluginElement(pluginid, pluginMediaElement, htmlMediaElement);

		// add container (must be added to DOM before inserting HTML for IE)
		container.className = 'me-plugin';			
		htmlMediaElement.parentNode.insertBefore(container, htmlMediaElement);

		// flash/silverlight vars
		initVars = [
			'id=' + pluginid,
			'poster=' + poster,
			'isvideo=' + isVideo.toString(),
			'autoplay=' + autoplay,
			'preload=' + preload,
			'width=' + width,			
			'timerrate=' + options.timerRate,
			'height=' + height];

		if (mediaUrl !== null) {
			initVars.push('file=' + mediaUrl);
		}
		if (options.enablePluginDebug) {
			initVars.push('debug=true');
		}
		
		switch (pluginType) {
			case 'silverlight':
				container.innerHTML =
'<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + pluginid + '" name="' + pluginid + '" width="' + width + '" height="' + height + '">' +
'<param name="initParams" value="' + initVars.join(',') + '" />' +
'<param name="windowless" value="true" />' +
'<param name="background" value="black" />' +
'<param name="minRuntimeVersion" value="3.0.0.0" />' +
'<param name="autoUpgrade" value="true" />' +
'<param name="source" value="' + options.pluginPath + options.silverlightName + '" />' +
'</object>';
					break;

			case 'flash':

				if (mejs.MediaFeatures.isIE) {
					container.outerHTML =
'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' +
'id="' + pluginid + '" width="' + width + '" height="' + height + '">' +
'<param name="movie" value="' + options.pluginPath + options.flashName + '?x=' + (new Date()) + '" />' +
'<param name="flashvars" value="' + initVars.join('&') + '" />' +
'<param name="quality" value="high" />' +
'<param name="bgcolor" value="#000000" />' +
'<param name="wmode" value="transparent" />' +
'<param name="allowScriptAccess" value="sameDomain" />' +
'<param name="allowFullScreen" value="true" />' +
'</object>';

				} else {

					container.innerHTML =
'<embed id="' + pluginid + '" name="' + pluginid + '" ' +
'play="true" ' +
'loop="false" ' +
'quality="high" ' +
'bgcolor="#000000" ' +
'wmode="transparent" ' +
'allowScriptAccess="sameDomain" ' +
'allowFullScreen="true" ' +
'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ' +
'src="' + options.pluginPath + options.flashName + '?' + initVars.join('&') + '" ' +
'width="' + width + '" ' +
'height="' + height + '"></embed>';
				}
				break;
		}
		// hide original element
		htmlMediaElement.style.display = 'none';
		
		// FYI: options.success will be fired by the MediaPluginBridge
	},
	
	updateNative: function(htmlMediaElement, options) {

		// add methods to video object to bring it into parity with Flash Object
		for (var m in mejs.HtmlMediaElement) {
			htmlMediaElement[m] = mejs.HtmlMediaElement[m];
		}
		
		// fire success code
		options.success(htmlMediaElement, htmlMediaElement);		
	}
};


window.mejs = mejs;
window.MediaElement = mejs.MediaElement;