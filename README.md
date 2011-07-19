# GOAL: Make `<video>` and `<audio>` easy. One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: GPLv2/MIT
* Meaning: Please use this everywhere and it'd be swell if you'd 
link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [mikesten](https://github.com/mikesten), [sylvinus](https://github.com/sylvinus), [mattfarina](https://github.com/mattfarina), [romaninsh](https://github.com/romaninsh), [fmalk](https://github.com/fmalk), [jeffrafter](https://github.com/jeffrafter), [sompylasar](https://github.com/sompylasar), [andyfowler](https://github.com/andyfowler), [RobRoy](https://github.com/RobRoy), [jakearchibald](https://github.com/jakearchibald), [seanhellwig](https://github.com/seanhellwig), [CJ-Jackson](https://github.com/CJ-Jackson), [kaichen](https://github.com/kaichen)


## Installation and Usage

_MediaElementPlayer: HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

### 1. Add Script and Stylesheet

	<script src="jquery.js"></script>
	<script src="mediaelement-and-player.min.js"></script>
	<link rel="stylesheet" href="mediaelementplayer.css" />

### 2. Option A: Single H.264 file

If your users have JavaScript and Flash, this is the easist route for all browsers and mobile devices.
	
	<video src="myvideo.mp4" width="320" height="240"></video>

### 2. Option B: Multiple codecs with Flash fall-through when JavaScript is disabled

This includes multiple codecs for various browsers (H.264 for IE and Safari, WebM for Chrome, Firefox 4, and Opera, Ogg for Firefox 3) as well as a Flash fallback for non HTML5 browsers with JavaScript disabled.

	<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
		<source type="video/mp4" src="myvideo.mp4" />
		<source type="video/webm" src="myvideo.webm" />
		<source type="video/ogg" src="myvideo.ogv" />
		<object width="320" height="240" type="application/x-shockwave-flash" data="flashmediaelement.swf">
			<param name="movie" value="flashmediaelement.swf" /> 
			<param name="flashvars" value="controls=true&amp;poster=myvideo.jpg&amp;file=myvideo.mp4" /> 		
			<img src="myvideo.jpg" width="320" height="240" title="No video playback capabilities" />
		</object>
	</video>

### 3. Run startup script

Make sure this is not in the `<head>` tag or iOS 3 will fail.

	<script>
	// jQuery method
	$('video').mediaelementplayer();
	</script>
	
	<script>
	// normal JavaScript 
	var player = new MediaElementPlayer('#player');
	</script>	

## How it Works: 
_MediaElement.js: HTML5 `<video>` and `<audio>` shim_

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. 
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.

	<script src="mediaelement.js"></script>
	<video src="myvideo.mp4" width="320" height="240"></video>
	
	<script>
	var v = document.getElementsByTagName("video")[0];
	new MediaElement(v, {success: function(media) {
		media.play();
	}});
	</script>

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.

### Version History

*2.x.0 (proposed)*

* dynamic player creatoin: from `<a href="media.mp4">video</a>` and `<div class="mejs"></div>` specifying src in JavaScript
* horizontal volume control
* remove jQuery dependency
* deeper WebVTT support (alignment, color, etc.)

*2.1.7 (2011/07/19) - 35.9kb*

* fixed mute button (kaichen)
* added alwaysShowControls option (kaichen)
* forceful padding override on buttons
* started "ender" branch to experiment with removing jQuery dependency and baking in ender.js
* updated the use of `type` javascript option with src is present
* remove preload="none" hack for Chrome now that it supports it (note: Chrome still strangely fires a 'loadstart' event)
* added hooks for other jQuery compatible libraries like [ender.js](http://enderjs.com)
* Wordpress: if you don't specify a file extension, mejs will look for attached files and use them [video src="/wp-content/uploads/myfile"]
* Wordpress: option to select a 'skin'
* Wordpress: option to select audio width/height

*2.1.6 (2011/06/14) - 35.5kb*

* fix errors when the progress bar isn't present
* buttons are now actual `<button>` tags which allows tabbed controls (for better accessibility and possible ARIA support)
* fix problems with low volume in Flash on startup (startVolume was sometimes 0!)
* updated a few places to use jQuery 1.6's new prop/attr methods
* updated skins to account for new `<button>` (still need highlighted style)

*2.1.5 (2011/05/28) - 35.2kb*

* minor fix for controls not showing time or duration
* when switching files, the Flash plugin now forcibly stops downliading

*2.1.4 (2011/05/20) - 35.2kb*

* fixed display of hours
* fixed Flash audio bug where pausing when the file wasn't fully loaded would cause the progress bar to go offscreen
* fixed Flash video bug where percent loaded was always 100%
* fixed Flash audio bug where pressing pause, then play would always restart playback from the beginning
* startVolume works more clearly in plugins (esp. Opera and Linux)
* tracks support no longer refers to WebSRT, but is more generic for WebVTT (not all features of WebVTT are supported yet)
* fixed fullscreen in Safari OS X 10.5 (which doens't really support true fullscreen)
* Flash and Silverlight can now start downloading if preload="auto" or preload="metadata" (warning: preload="metadata" will load the entire thing)

*2.1.3 (2011/04/12) - 35.8kb*

* added support for hours in time format (00:00:00) and an alwaysShowHours option to force hours to always show
* removed some duplicate flash events
* added 'seeking' event to Flash/SL (already had 'seeked')

*2.1.2 (2011/03/23) - 34.4kb*

* fixed IE6 and IE7 caption position
* fixed IE7 failure in certain places
* changed browser UA detection to use only lowercase (iPhone iphone)
* fixed Flash audio loaded bug (reporting 0 after loaded)
* added removeEventListener to shims
* new rail-resizing code

*2.1.1 (2011/03/07) - 33.5kb*

* added 'loadeddata' event to Flash and Silverlight
* switched to flashvars parameter to support Apache's mod_security
* better flash fullscreen support
* added flv-x to flash's accepted types
* Fixed a bug in poster sizing (only affected IE)
* added "isFullScreen" property to media objects (like Safari's webkitDisplayingFullscreen)
* controls start hidden with autoplay
* fixed  iOS loading issues (success wasn't firing, other errors)
* fixed IE6 when using new MediaElementPlayer(), rather than jQuery

*2.1.0 (2011/02/23) - 32.9kb*

* Updated control styles for a cleaner look
* Added loadeddata and canplay events to Flash and Silverlight
* Added loading indicator to MediaElementPlayer
* Added stop button (pause, then return to currentTime:0)
* IE6/7 CSS updates
* Poster is now forced to the size of the player (could be updated to be proportional if someone wants to add that)
* Updated Flash ended event to account for buffering weirdness
* Fixed a track text hovering problem

*2.0.7 (2011/02/13) - 31.9kb*

* Added 'mode' option to force native (HTML5) or shim (Flash,Silverlight) modes
* Fixed audio seeking bug in Flash (thanks Andy!)
* Fixed startVolume not working in Flash
* Overrided Chrome's autoplay since it doesn't always work

*2.0.6 (2011/02/04) - 31.7kb*

* Whitespace cleanup on files
* Preventing flash/sl plugins from reinitializing when they are removed by another script
* Fixed IE JavaScript errors in Flash fallback (seen in Wordpress)
* Added 'play' event to Silverlight to prevent errors

*2.0.5 (2011/01/25) - 31.7kb*

* Added error object to player
* Adjusted popup timer and progress bar
* Fixed media URL escaping
* Stopped sending poster to plugin
* Silverlight culture update
* Added back reference check (also makes jQuery usage easier)
* Added stop() function to mediaelement
* timerupdate still fires when paused (plugins)
* Added Security.allowDomain("*") to Flash so it can be used on different domains
* Fixed progress bar for Firefox 3 with Ogg files
* Prevented Flash from re-creating the player when show/hide restarts it
* Fixed initial volume level in non-HTML5 players
* Made PNG8 versions of controls images (for IE6)

*2.0.4 (2011/01/14) - 31.2kb*

* Fixed a major bug in plugin detection.

*2.0.3 (2011/01/13) - 31.2kb*

* changed IE Flash insertion to include me-plugin CSS class
* changed player error handling
* fixed a bug in the Silverlight player related to URLs

*2.0.2 (2010/12/31) - 31.1kb*

* Changed HTML escape method to encodeURICompnent
* Flash-based RMTP support (contributor: sylvinus)
* Fixed Wordpress loop bug
* Changed time popup to move with mouse instead of currentTime
* added enablePluginSmoothing (Flash)
* Added some "play" "playing" event duplication to Flash

*2.0.1 (2010/12/20) - XX.Xkb*

* Changed Flash to allow cross domain video
* Added 'click' event to Flash and Silverlight
* Updated autoplay attribute detection

*2.0.0 (2010/12/13) - 30.8kb*

* Reorganized MediaElementPlayer code to allow each button to become a pluggable feature that can be removed or overrided
* Enabled a no JavaScript version to support Video for Everybody nested syntax (optional)
* Enabled drag on progress bar
* Preload="none" is default for Flash and Silverlight
* Preload="none" enabled on Google Chrome
* Added skins to download
* Support for skin swapping
* Updated volume handle controls
* Update progress controls display
* Exposed MediaElement API methods on player
* Adjusted layout for IE6

*1.1.7 (2010/11/29) - 29.8kb*

* Fixed bug with `<track>` loading on `<audio>` player

*1.1.6 (2010/11/23) - 29.8kb*

* Chapters support `<track kind="chapters" />`

*1.1.5 (2010/11/21) - 29.8kb*

* Workaround for IE issues when accidentally placed inside `<p>` tag
* Fixed silverlight pause state reporting
* Switched back to Flash as default
* Removed requirement for Google translate API `<script>` (direct JSONP call)
* Added googleApiKey option

*1.1.4 (2010/11/21) - 29.5kb*

* Added Default volume level to options (0.8)
* Fix for IE volume slider positioning
* Fix for IE tracks parsing (replacement String.split)
* Changed namespace from html5 to mejs
* Remove all showMessage references
* Controls show again after playback ends

*1.1.3 (2010/11/20) - 29.0kb*

* Change to fallback mechanism and styling (Windows Phone 7)

*1.1.2 (2010/11/19) - 28.9kb*

* Removed messages, added big play button
* Google translate now supports more than 1000 characters
* Added a dropdownlist of languages from which the user can select
* Added timerUpdate option to set the millisecond speed of timeupdate events
* Updated the media file and examples

*1.1.1 (2010/11/18) - 27.1kb*

* added captioning support via the `<track>` tag (thanks to [Playr](http://www.delphiki.com/html5/playr) for the example)
* added auto-translation support via Google translate API

*1.1.0 (2010/11/17) - 22.6kb*

* Total re-oganization of MediaElement, MediaElementPlayer, and supporting objects
* Updated CSS to a cleaner look, with better IE support & big play button
* Simplified all plugin and version detection
* Added loop option (useful for audio files)
* Added the ability to turn each control button on/off
* Added canPlayType to PluginMediaElement
* Updated setSrc to take multiple sources

*1.0.7 (2010/11/16) - 18.15kb*

* Total re-oganization of MediaElement code
* JSLint compliant, YUI compliant

*1.0.6 (2010/11/15) - 17.96kb*

* Rebuilt PluginDetection (removed SWFObject and Microsoft code)
* More JSLint compatible (still a few iterations to get there)
* Added jQuery 1.4.4

*1.0.5 (2010/11/10 later on)*

* Fixed a problem with the *.min.js files
* Added jQuery 1.4.3

*1.0.4 (2010/11/10) - 18.32kb*

* Fixed Flash display when `<video>` did not match actual dimensions
* autosizing in Flash and Silverlight
* added options for defaultVideoWidth, defaultVideoHeight when `<video>` `height` and `width` are not set
* included minified versions using YUI compressor

*1.0.3 (2010/09/24)*

* changes in poster handling
* fix IE9 startup bug (its 'play' event fires wrongly it seems)
* fixed Flock, Opera sizing bugs
* fixed audio ended bug in special cases under Flash
* added default height/width when they are not specified in attributes

*1.0.2 (2010/09/17)*

* minor updates to support IE9 beta1

*1.0.1 (2010/09/13)*

* added native fullscreen support for Safari 5 (via webkitEnterFullScreen)

*1.0.0 (2010/08/09)*

* initial release

###TODO

2.2 features
* Error handling
* Flash/SL error codes
* Add dynamic creation support
* Inline volume slider?
* Postroll
* Flash StageVideo?
* Support 100% width and height?