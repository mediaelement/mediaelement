/*!
 * Media Element
 * HTML5 <video> libary
 * http://mediaelementjs.com/
 *
 * Creates a JavaScript object that mimics HTML5 media objects
 * through a Flash->JavaScript|Silverlight bridge
 *
 * Copyright 2010, John Dyer
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thursday June 17 11:22:48 2010 -0600
 */
 
/* TODO
 - progress events (these have changed in the HTML5 spec)
 - poster in flash (do in HTML)
*/


(function () {
		// for testing
    if (typeof window.console == 'undefined') window.console = { log: function () { } };

    // for IE<9
    var mediaElements = ['audio', 'video', 'source'];
    for (var x in mediaElements)
        document.createElement(mediaElements[x]);

    // Namespace
    var html5 = {};

    // media types. Flash is the default, but you can re-order these to make Silverlight the default
    var mediaTypes = [
			  { pluginType: 'flash', version: '9.0.124', type: 'video/mp4' }
			, { pluginType: 'flash', version: '9.0.124', type: 'audio/mp3' }
			, { pluginType: 'flash', version: '9.0.124', type: 'audio/flv' }
			, { pluginType: 'flash', version: '9.0.124', type: 'video/flv' }
			//,{pluginType: 'flash', version: '11.0.0', type: 'video/webm'} // for future reference	
			, { pluginType: 'silverlight', version: '4.0', type: 'video/mp4' }
			, { pluginType: 'silverlight', version: '4.0', type: 'video/wmv' }
			, { pluginType: 'silverlight', version: '4.0', type: 'audio/mp3' }
			];


    // Flash version detection from SwfObject 2.2
    /* Centralized function for browser feature detection
    - User agent string detection is only used when no good alternative is possible
    - Is executed directly for optimal performance
    */
    var UNDEF = "undefined",
    OBJECT = "object",
    SHOCKWAVE_FLASH = "Shockwave Flash",
    SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
    FLASH_MIME_TYPE = "application/x-shockwave-flash",
    EXPRESS_INSTALL_ID = "SWFObjectExprInst",
    ON_READY_STATE_CHANGE = "onreadystatechange",

    win = window,
    doc = document,
    nav = navigator,

    ua = function () {
        var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = ! +"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0, 0, 0],
			d = null;
        if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
            d = nav.plugins[SHOCKWAVE_FLASH].description;
            if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                plugin = true;
                ie = false; // cascaded feature detection for Internet Explorer
                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
            }
        }
        else if (typeof win.ActiveXObject != UNDEF) {
            try {
                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                if (a) { // a will return null when ActiveX is disabled
                    d = a.GetVariable("$version");
                    if (d) {
                        ie = true; // cascaded feature detection for Internet Explorer
                        d = d.split(" ")[1].split(",");
                        playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
            }
            catch (e) { }
        }
        return { w3: w3cdom, pv: playerVersion, wk: webkit, ie: ie, win: windows, mac: mac };
    } ();
    function hasFlashPlayerVersion(rv) {
        var pv = ua.pv, v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = parseInt(v[2], 10) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    // silverlight version detection from Microsoft
    var Silverlight = {};
    Silverlight.isInstalled = function (b) {
        if (b == undefined) b = null;
        var a = false,
        m = null;
        try {
            var i = null,
            j = false;
            if (window.ActiveXObject) try {
                i = new ActiveXObject("AgControl.AgControl");
                if (b === null) a = true;
                else if (i.IsVersionSupported(b)) a = true;
                i = null
            } catch (l) {
                j = true
            } else j = true;
            if (j) {
                var k = navigator.plugins["Silverlight Plug-In"];
                if (k) if (b === null) a = true;
                else {
                    var h = k.description;
                    if (h === "1.0.30226.2") h = "2.0.30226.2";
                    var c = h.split(".");
                    while (c.length > 3) c.pop();
                    while (c.length < 4) c.push(0);
                    var e = b.split(".");
                    while (e.length > 4) e.pop();
                    var d, g, f = 0;
                    do {
                        d = parseInt(e[f]);
                        g = parseInt(c[f]);
                        f++
                    } while (f < e.length && d === g);
                    if (d <= g && !isNaN(d)) a = true
                }
            }
        } catch (l) {
            a = false
        }
        return a
    };

    function hasPluginVersion(plugin, rv) {
        switch (plugin) {
            case 'flash':
                return hasFlashPlayerVersion(rv);
            case 'silverlight':
                return Silverlight.isInstalled(rv);
            default:
                return false;
        }
    }
    
    // determine paths
    function getScriptPath(scriptName) {
        var path = '';
        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf(scriptName) > -1) {
                path = scripts[i].src.substring(0, scripts[i].src.indexOf(scriptName));
            }
        }

        return path;
    }
    var path = getScriptPath('mediaelement.js');    

    var mediaElementDefaults = {
			  enablePluginDebug: false
			, type: ''
			, flashUrl: path + 'flashmediaelement.swf'
			, silverlightUrl: path + 'silverlightmediaelement.xap'
			, ready: function () { }
    }

    /*
    Determines if a browser supports the <video> or <audio> element
    and either returns the native element or a Flash/Silverlight version that 
    mimics HTML5 MediaElements
    */
    html5.MediaElement = function (el, o) {
    
			

        // find element
        var mediaElement = el;
        if (typeof el == 'string')
            mediaElement = document.getElementById(el);

        var isVideo = (mediaElement.tagName.toLowerCase() == 'video');
        
        console.log('setup media element', el.id);

        // extend options
        var options = mediaElementDefaults;
        for (var prop in o) {
            options[prop] = o[prop];
        }

        // media type settings
        var supportsMediaTag = (typeof mediaElement.canPlayType != 'undefined');
        var canPlayMedia = false;
        var urlForPlugin = '';
        var pluginType = '';
        
        function testMedia(type, src) {
					// test for HTML media playback
					if (supportsMediaTag && mediaElement.canPlayType(type).replace(/no/,'') != '') {
						canPlayMedia = true;

													
					} else {
				
						// test for plugin playback types			
						for (var fi = mediaTypes.length - 1; fi >= 0; fi--) {
							// find plugin that can play the type
							if (type == mediaTypes[fi].type && hasPluginVersion(mediaTypes[fi].pluginType, mediaTypes[fi].version)) {
								urlForPlugin = src;
								pluginType = mediaTypes[fi].pluginType;
							}
						}
						
					}        
        }

				// supplied type overrides all HTML
				if (options.type != '') {
					testMedia(options.type, null);
				
				// test for src attribute first
				} else if (mediaElement.src != '') {
					
					
					var src = mediaElement.src;
					var type = mediaElement.getAttribute('type');
					
					console.log('testing src', src, type);
					
					if (src && !type) {
						// fake a type
						var extension = src.substring(src.lastIndexOf('.')+1);
						type = ((isVideo) ? 'video' : 'audio') + '/' + extension;
					}
					
					testMedia(type, src);
				
				// then test for <source> elements
				} else {
					// test <source> types to see if they are usable
					// pull out one Flash can use
					for (var i = 0; i < mediaElement.childNodes.length; i++) {
						var el = mediaElement.childNodes[i];

						if (el.nodeType == 1 && el.tagName.toLowerCase() == 'source') {
							var type = el.getAttribute('type');
							var src = el.getAttribute('src');

							testMedia(type, src);
						}
					}
				}
				
				// Special case for Safari without Quicktime (happens on both Mac and PC).
				// Safari just acts like <video> tags are invalid HTML
        if (!supportsMediaTag && navigator.userAgent.indexOf('Safari') > -1) {
						mediaElement.innerHTML = 'You need to install Quicktime for Safari to operate properly. Weird, huh?';
						return;
        }
        
        // Special case for Android which sadly does not report on media.canPlayType()
        // It's always a blank string (as of Android 2.1, tested on Samsung Captivate)
        if (navigator.userAgent.indexOf('Android') > -1) {
						canPlayMedia = true;						
				}
        
        // use native <audio> or <video> with existing media
        if (canPlayMedia) {

            // add methods to video object to bring it into parity with Flash Object  
            for (var m in html5.HtmlMediaElement) {
                mediaElement[m] = html5.HtmlMediaElement[m];
            }

            // make sure it autoplays on slow connections
            var hasStarted = false;
            var autoplay = (mediaElement.getAttribute('autoplay') != null);

            if (autoplay) {
                function checkForPlaying() {
                    if (!hasStarted) {
                        mediaElement.play();
                    }
                }
                var evts = 'progress timeupdate'.split(' ');
                function addCheckEvents() {
                    for (var i in evts) {
                        mediaElement.addEventListener(evts[i], checkForPlaying);
                    }
                }
                function removeCheckEvents() {
                    for (var i in evts) {
                        mediaElement.removeEventListener(evts[i], checkForPlaying);
                    }
                }
                addCheckEvents();
                mediaElement.addEventListener('playing', function () {
                    hasStarted = true;
                    removeCheckEvents();
                });
            }

            // fire ready code
            options.ready(mediaElement, mediaElement);

            // return normal media element
            return mediaElement;

        // replace with plug version that mimics HTML media
        } else if (pluginType != '') {

            var width = 1;
            var height = 1;
            var pluginid = mediaElement.getAttribute('id') + '_plugin_' + pluginType;
            var mediaUrl = (urlForPlugin != null) ? absolutizeUrl(urlForPlugin) : '';
            var posterUrl = (mediaElement.getAttribute('poster') == null) ? mediaElement.getAttribute('poster') : '';
            var autoplay = (mediaElement.getAttribute('autoplay') != null);

            if (mediaElement.tagName.toLowerCase() == 'video') {
                height = mediaElement.height;
                width = mediaElement.width;
            }

            // register wrapper
            var pluginMediaElement = html5.PluginMediaElement(pluginid, pluginType);
            pluginMediaElement.ready = options.ready;
            html5.MediaPluginBridge.registerPluginElement(pluginid, pluginMediaElement, mediaElement);


            // create wrapper <div>
            var container = document.createElement('div');
            // must be added to DOM before inserting HTML for IE
            mediaElement.parentNode.insertBefore(container, mediaElement);
            //mediaElement.parentNode.replaceChild(mediaElement, container);    

            // flash/silverlight vars
            var initVars = ((options.enablePluginDebug) ? 'debug=true&' : '') +
										'id=' + pluginid +
										'&file=' + mediaUrl +
										'&poster=' + posterUrl +
										'&autoplay=' + autoplay +
										'&width=' + width +
										'&height=' + height
										;

            var html = '';
            switch (pluginType) {
                case 'silverlight':
                    container.innerHTML =
'<object data="data:application/x-silverlight-2," type="application/x-silverlight-2"\
id="' + pluginid + '" width="' + width + '" height="' + height + '">\
<param name="initParams" value="' + initVars.replace(/&/gi, ',') + '" />\
<param name="windowless" value="true" />\
<param name="background" value="black" />\
<param name="minRuntimeVersion" value="4.0.50401.0" />\
<param name="autoUpgrade" value="true" />\
<param name="source" value="' + options.silverlightUrl + '" />\
</object>';
                    break;

                case 'flash':

                    if (navigator.appName.indexOf("Microsoft") != -1) {
                        container.outerHTML =
'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"\
id="' + pluginid + '" width="' + width + '" height="' + height + '"> \
<param name="movie" value="' + options.flashUrl + '?x=' + (new Date()) + '" /> \
<param name="flashvars" value="' + initVars + '" /> \
<param name="quality" value="high" /> \
<param name="bgcolor" value="#000000" /> \
<param name="wmode" value="transparent" /> \
<param name="allowScriptAccess" value="sameDomain" /> \
<param name="allowFullScreen" value="true" /> \
</object>';

                    } else {

                        container.innerHTML =
'<embed name="' + pluginid + '" \
play="true" \
loop="false" \
quality="high" \
bgcolor="#000000" \
wmode="transparent" \
allowScriptAccess="sameDomain" \
allowFullScreen="true" \
type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" \
src="' + options.flashUrl + '?' + initVars + '" \
width="' + width + '" \
height="' + height + '"></embed>';
                    }
                    break;

            }
						// hide original element
            mediaElement.style.display = 'none';

            // return fake media object	
            return pluginMediaElement;
        } else {
            mediaElement.innerHTML = 'No compatible player found for your browser.'
        }
    }

    /*
    extension methods to <video> or <audio> object to bring it into parity with PluginMediaElement (see below)
    */
    html5.HtmlMediaElement = {

        pluginType: 'native'

			, setCurrentTime: function (time) {
				this.currentTime = time;
			}
			, setMuted: function (muted) {
				this.muted = muted;
			}
			, setVolume: function (volume) {
				this.volume = volume;
			}
			, loadMedia: function (url) {
				this.src = url;
				this.load();
			}
			, setVideoSize: function (width, height) {
				this.width = width;
				this.height = height;
			}			
    }

    /*
    Mimics the <video> element by calling Flash's External Interface
    */
    html5.PluginMediaElement = function (pluginid, pluginType) {

        var events = {};

        // JavaScript values and ExternalInterface methods that match HTML5 video properties methods
        // http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/fl/video/FLVPlayback.html
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html	
        return {

          // special
            id: pluginid
					, pluginType: pluginType
					, pluginElement: null

					// not implemented :(
					, playbackRate: -1
					, defaultPlaybackRate: -1
					, seekable: []
					, played: []

					// HTML5 read-only properties
					, paused: true
					, ended: false
					, seeking: false
					, duration: 0

					// HTML5 get/set properties, but only set (updated by event handlers)
					, muted: false
					, volume: 1
					, currentTime: 0

									// HTML methods
					, play: function (url) {
							this.pluginElement.playMedia(url);
							this.paused = false;
					}
					, loadMedia: function (url) {
							this.pluginElement.loadMedia(url);
							this.paused = false;
					}
					, pause: function () {
							this.pluginElement.pauseMedia();
							this.paused = true;
					}
					, stop: function () {
							this.pluginElement.stopMedia();
							this.paused = true;
					}

									// custom methods since not all JavaScript implementations support get/set
					, setCurrentTime: function (time) {
							this.pluginElement.setCurrentTime(time);
							this.currentTime = time;
					}

					, setVolume: function (volume) {
							this.pluginElement.setVolume(volume);
							this.volume = volume;
					}

					, setVideoSize: function (width, height) {
							//this.pluginElement.width = width;
							//this.pluginElement.height = height;
							this.pluginElement.style.width = width + 'px';
							this.pluginElement.style.height = height + 'px';

							this.pluginElement.setVideoSize(width, height);
					}		

					, setMuted: function (muted) {
							this.pluginElement.setMuted(muted);
							this.muted = muted;
					}

					, setFullscreen: function (fullscreen) {
							this.pluginElement.setFullscreen(fullscreen);
					}

									// start: fake events
					, addEventListener: function (eventName, callback, bubble) {
							events[eventName] = events[eventName] || [];
							events[eventName].push(callback);
					}
					, dispatchEvent: function (eventName) {

							var i, callbacks = events[eventName], args;
							if (callbacks) {
									args = Array.prototype.slice.call(arguments, 1);
									for (i = 0; i < callbacks.length; i++) {
											callbacks[i].apply(null, args);
									}
							}
					}
        }
    };


    // Flash makes calls through this object to the fake <video> object
    html5.MediaPluginBridge = (function () {

        var pluginMediaElements = [];
        var mediaElements = [];

        return {
            registerPluginElement: function (id, pluginMediaElement, mediaElement) {
                pluginMediaElements[id] = pluginMediaElement;
                mediaElements[id] = mediaElement;
            }

            // when Flash is ready, it calls out to this method
					, initPlugin: function (id) {

							//console.log('initPlugin',id);
							var pluginMediaElement = pluginMediaElements[id];
							var mediaElement = mediaElements[id];

							// find the javascript bridge
							switch (pluginMediaElement.pluginType) {
									case "flash":
											// magic
											if (navigator.appName.indexOf("Microsoft") != -1) {
													pluginMediaElement.pluginElement = window[id];
											} else {
													pluginMediaElement.pluginElement = document[id];
											}
											break;
									case "silverlight":
											var sl = document.getElementById(pluginMediaElement.id);
											pluginMediaElement.pluginElement = sl.Content.SilverlightApp;

											break;
							}



							if (pluginMediaElement.ready)
									pluginMediaElement.ready(pluginMediaElement, mediaElement);
					}

					// receives events from FLASH and translates them to HTML5 media events
					// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html		
					, fireEvent: function (id, eventName, values) {
							//console.log('pluginevent', id, eventName, values);		

							var pluginMediaElement = pluginMediaElements[id];
							pluginMediaElement.ended = false;
							pluginMediaElement.paused = false;

							// fake event object to mimic real HTML media event.
							var e = {
									type: eventName,
									srcElement: pluginMediaElement
							};

							// attach all values to element and event object
							for (var i in values) {
									pluginMediaElement[i] = values[i];
									e[i] = values[i];
							}

							pluginMediaElement.dispatchEvent(e.type, e);
					}
        };

    } ());

    // silverlight requires window.method. It apparently doesn't understand window.object.method
    // also it doesn't like to pass raw JSON data (AFAIK)
    window.html5_MediaPluginBridge_initPlugin = function (id) {
        //console.log(id);
        html5.MediaPluginBridge.initPlugin(id);
    }
    window.html5_MediaPluginBridge_fireEvent = function (id, eventName, values) {
        //console.log(id);
        var jsonString = values.substring(1, values.length - 1);
        var jsonValues = eval('(' + jsonString + ')');

        html5.MediaPluginBridge.fireEvent(id, eventName, jsonValues);
    }


    function escapeHTML(s) {
        return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
    }
    function absolutizeUrl(url) {
        var el = document.createElement('div');
        el.innerHTML = '<a href="' + escapeHTML(url) + '">x</a>';
        return el.firstChild.href;
    }

    window.html5 = html5;
    window.MediaElement = html5.MediaElement;
})();