# `<video>` and `<audio>` made easy. One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: MIT
* Meaning: Use everywhere, keep copyright, it'd be swell if you'd link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [mikesten](https://github.com/mikesten), [sylvinus](https://github.com/sylvinus), [mattfarina](https://github.com/mattfarina), [romaninsh](https://github.com/romaninsh), [fmalk](https://github.com/fmalk), [jeffrafter](https://github.com/jeffrafter), [sompylasar](https://github.com/sompylasar), [andyfowler](https://github.com/andyfowler), [RobRoy](https://github.com/RobRoy), [jakearchibald](https://github.com/jakearchibald), [seanhellwig](https://github.com/seanhellwig), [CJ-Jackson](https://github.com/CJ-Jackson), [kaichen](https://github.com/kaichen), [gselva](https://github.com/gselva), [erktime](https://github.com/erktime), [bradleyboy](https://github.com/bradleyboy), [kristerkari](https://github.com/kristerkari), [rmhall](https://github.com/rmhall), [tantalic](https://github.com/tantalic), [madesign](http://github.com/madesign), [aschempp](http://github.com/aschempp), [gavinlynch](https://github.com/gavinlynch), [Birol2010](http://github.com/Birol2010), tons of others (see pulls)


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

*Proposed features*

* deeper WebVTT support (alignment, color, etc.) - include captionator
* Full support for Ender.js, including mediaelement-and-player-standalone which includes ender.
* thin line when controls are off
* system-wide events
* playlist builder
* Ogg/Theora playback
* Better alignment with native MediaElement (using shimichanga.com techniques)	

*2.11.0 (2012/03/13)*

* Preroll ads manager
* VAST ads plugin (sponsored by Minito Video)
* Slides `<track>` type (non-standard HTML5 use)
* Calculate rails size only with visible elements (romanbsd) (https://github.com/johndyer/mediaelement/pull/773)
* Round calculations of progress bar to prevent fractions (romanbsd) (https://github.com/johndyer/mediaelement/pull/768)
* Fix AndroidUseNativeControls (LeResKP) (https://github.com/johndyer/mediaelement/pull/749)
* Muting the volume icon if startVolume is set to 0 (heartcode) (https://github.com/johndyer/mediaelement/pull/747)
* Make YouTube URL protocol relative (strworkstation) (https://github.com/johndyer/mediaelement/pull/761)
* Prevent Flash audio player from sending too many 'progress' events (johndyer)
* Properly clean up player when calling MediaElementPlayer.remove() (odnamrataizem) (https://github.com/johndyer/mediaelement/pull/779)
* Add "mejs-shim" class to all shims to prevent improper resizing (JeffreyATW) (https://github.com/johndyer/mediaelement/pull/789)
* Bug fix for the error "this.pluginApi.pauseMedia is not a function" when using the flash player and removing the dom element. (Jmaharman) https://github.com/johndyer/mediaelement/pull/788
* Make possible to open youtube links as audio only (Seb33300) https://github.com/johndyer/mediaelement/pull/784
* Add a few basic Jasmine tests (msgilligan) https://github.com/johndyer/mediaelement/pull/781
* Add option to hide the video controls on load (eResKP) https://github.com/johndyer/mediaelement/pull/780#issuecomment-14781622
* [cc] button can now be a toggle when there's just one track (LeResKP) https://github.com/johndyer/mediaelement/pull/793
* fixed error when srclang was missing

*2.10.3 (2012/01/27)*

* Fix broken scrollbar from API reference error (peterbrook) (https://github.com/johndyer/mediaelement/pull/739)

*2.10.2 (2013/01/26)*

* The project is now MIT-only, instead of dual licensed MIT and GPL (just as jQuery has done: http://jquery.org/license/)
* Fix audio height in 100% mode (https://github.com/johndyer/mediaelement/pull/667)
* Make rewinding at the end optional (https://github.com/johndyer/mediaelement/pull/725)
* Bugfix: attributes for PluginMediaElement (https://github.com/johndyer/mediaelement/pull/722)
* Add mejs-long-video class when capture is 1hr or longer, custom styles (https://github.com/johndyer/mediaelement/pull/715)
* Fix for dragging playhead horizontally off the video (https://github.com/johndyer/mediaelement/pull/711)
* Align timing of captions with show/hide controls (https://github.com/johndyer/mediaelement/pull/708)
* Missing semicolon (https://github.com/johndyer/mediaelement/pull/737)
* Don't send timeupdate event after ended event (https://github.com/johndyer/mediaelement/pull/727)
* Added option to disable pause/play on main div click (https://github.com/johndyer/mediaelement/pull/735)

*2.10.1 (2012/12/31)*

* New postroll feature (https://github.com/johndyer/mediaelement/pull/660)
* PluginMediaElement click-to-pause behavior doesn't work (https://github.com/johndyer/mediaelement/pull/691)
* Use the normal CSS property name after the vendor prefix (https://github.com/johndyer/mediaelement/pull/686) 
* Select first source that is supported by the browser (https://github.com/johndyer/mediaelement/pull/679)
* fixed outerWidth for jQuery 1.8 compatiability (https://github.com/johndyer/mediaelement/pull/680)
* Fix for Issue #676 when Stop button does not behaves as expected in selected browsers (https://github.com/johndyer/mediaelement/pull/678)
* Fix source switching on Webkit in SourceChooser (https://github.com/johndyer/mediaelement/pull/675)
* Better 100% mode handling within non-visible container (https://github.com/johndyer/mediaelement/pull/668)
* Display chapter tracks for late-loading video sources, including YouTube (https://github.com/johndyer/mediaelement/pull/665)
* Added SVG Stop icon (https://github.com/johndyer/mediaelement/pull/696)
* Added SVG source chooser icon (https://github.com/johndyer/mediaelement/pull/669)
* Adding rounding to volume slider left, top, and and width setters (https://github.com/johndyer/mediaelement/pull/684)
* Display chapter tracks for late-loading video sources, including YouTube (https://github.com/johndyer/mediaelement/pull/665)

*2.10.0 (2012/11/23)*

* Support of matchMedia where possible	[zachleat]
* Fix for 100% audio using correct sizing [dougwilson]
* SVG icons for better Retina support [johndyer]
* Localized buttons [latzt] https://github.com/johndyer/mediaelement/pull/627
* Volume handle doesn't set initial position properly [JeffreyATW] https://github.com/johndyer/mediaelement/pull/625
* Cleaned up some CSS whitespace https://github.com/johndyer/mediaelement/pull/656
* Vimeo - updated to iframe code (from old megaloop)

*2.9.5 (2012/09/26)*

* Fixed faulty FlashMediaElement.swf (due to Git program mashing it)
* Fixed track element issues introduced by DFXP captions

*2.9.4 (2012/09/24)*

* Improved RTMP parsing [pansapien] https://github.com/johndyer/mediaelement/pull/574
* Added `flashStreamer` option to separate streamer from file
* Raise an error for unknown video size in Flash [denmarkin] https://github.com/johndyer/mediaelement/pull/571
* Fix for alwaysShowControls with keyboard interaction [peterh-capella] https://github.com/johndyer/mediaelement/pull/569
* Support for DFXP captions [justinl-capella] https://github.com/johndyer/mediaelement/pull/420

*2.9.3 (2012/08/23) *

* Allows use of `style="max-width: 100%;"` for responsive video
* Added type to source buttons in mep-feature-sourcechooser.js:48 [flamadiddle ]
* Fix use of inArray and $ in src/js/me-shim.js [lftl, Seb33300, eusonic and others] (this was a regression bug from another fix)
* Fixing syntax error in events demo [JeffreyATW]

*2.9.2 (2012/07/06) *

* Added a few height checks (from Joe Anderson)
* Removed console.log statements
* Better file MIME type detection when the "type" attribute is not set (Seb33300)
* Pass the event keyCode to the keyActions handler, and make seek interval configurable (bborn)
* Responsive flash fix, YouTube edits (heikki)
* New `auto_plugin` mode that starts with plugins then tries HTML5 (savil)

*2.9.1 (2012/06/01)*

* Fixed Firefox 10+ Fullscreen error

*2.9.0 (2012/05/31)*

* Fixed pointer-events detection in IE9 (when using Flash mode or YouTube)
* YouTube now shows annotations (using YouTube player rather than chromeless)
* Fix play/pause when clicking on video when overlays are displayed [markomarkovic]
* Dont listen to mouse events when there's not a reason to [neverarriving]
* Adding CSS animated buffer to the time rail [neverarriving]
* Fix for box-sizing: border-box from cutting off time text. [MatthewCallis]

*2.8.2 (2012/05/15)*

* Fixed volume slider bug when initially hidden
* Fixed YouTube size problems in Flash mode

*2.8.1 (2012/04/19)*

* Flash fullscreen: video not fullsized
* Flash fullscreen: youtube controls not working

*2.8.0 (2012/04/17)*

* Revamped YouTube to work using the Flash shim so that it supports fullscreen
* Fix for `remove()` method (lennym)
* Fix possible issue with ContextMenu ( quangvhg)
* Fix for stop button ( slavva97)
* Type on `var` and `;` (lennym)
* Fix for keyboard support forward and backward (myffical)

*2.7.0 (2012/03/12)*

* Added horizontal volume control, the new default for audio (based on work by [gavinlynch](http://github.com/gavinlynch))
* Possible issues with &lt; IE8 centering resolved
* Full set of controls under Silverlight ([Birol2010](https://github.com/Birol2010/))
* YouTube fix [raknam]
* shim now has a .tagName property, and other DOM-like methods [tantalic]
* Poster display fix when HTML5, Flash, and Silverlight are all missing	 [bruha]
* Source Chooser plugin [markomarkovic]
* Fix for flash audio mute [lbernau]

*2.6.5 (2012/02/01)*

* Removed iOS 3.x poster code [xtat] [James Cross]
* Fixed bug when player is initially hidden in `display:none;`
* Workaround for when inside an `<iframe>` and Chrome doesn't correctly report exiting from fullscreen

*2.6.4 (2012/01/10)*

* Fixed a Flash bug when one video ended and another was loaded through `setSrc()` and `load()`
* Option for markup between current time and duration [tantalic]

*2.6.3 (2012/01/08)*

* Sending all options to Flash including colors

*2.6.2 (2012/01/06)*

* Fixed Flash fullscreen button inside an `<iframe>`
* Fixed flash auto starting in 100% mode

*2.6.1 (2012/01/03)*

* Updated Opera's Flash Fullscreen support (apparently, it doesn't like pointer-events:none with Flash)
* Added a `fullscreenchange` event to Flash to better track events

*2.6.0 (2011/12/27)*

* added major updates to Flash fullscreen mode controls [rmhall]
* added sneaky `pointer-events: none` to allow Flash to enter fullscreen in one clean click
* added missing CSS3 gradients syntaxes (kristerkari)[https://github.com/johndyer/mediaelement/pull/339]
* added check for left offset to detect when mousedrag exceeds top boundary [jmcneese](https://github.com/johndyer/mediaelement/pull/335)

*2.5.0 (2011/12/15) - 56kb*

* Flash fullscreen now works on hover, so it's much easier to use. For Firefox it's always on, but for others `usePluginFullScreen:true` option
* For the audio player, Flash objects are positioned outside the main `<div>` which allows the player to be hidden without breaking flash
* Volume controls was adjusted slightly
* Removed Google translate features (Google killed the API)

*2.4.3 (2011/12/10)*

* keyboard controls are now an array, allowing multiple keys to do the same thing
* support for Google TV keybuttons (based on above)
* arrow keys now move when paused
* floating time is now handled via JavaScript instead of CSS :hover (and removed from touch devices)

*2.4.2 (2011/12/06) - 57.3kb*

* keyboard controls (up/down controls volume, left/right seeks, space play/pause, f goes fullscreen)
* `<audio>` now works with 100% for responsive layouts [283](https://github.com/johndyer/mediaelement/issues/283)
* Support for auto start with class `mejs-player` and `data-mejsoptions` e.g. `<video src="media.mp4" class="mejs-player" data-mejsoptions='{"features":["playpause","progress","volume"}, "success": "myCallback"}'><video>`
* With multiple players on a page, when one starts the others pause (toggle `pauseOtherPlayers: true`) [285](https://github.com/johndyer/mediaelement/issues/285)

*2.4.1 (2011/12/05) - 55.7kb*

* Fixed fullscreen bug with Firefox (with Video for Everybody syntax) [270](https://github.com/johndyer/mediaelement/issues/270)
* Added `remove()` method to `MediaElement` and `MediaElementPlayer` to safely remove Flash (from IE) [111](https://github.com/johndyer/mediaelement/issues/111)
* Added a demo of MEJS skins to the /demo/ folder 
* Closed issue with `ended` event in Flash (my example works) [246](https://github.com/johndyer/mediaelement/issues/246)
* Flash has better support for `preload="auto"` [290](https://github.com/johndyer/mediaelement/issues/290)

*2.4.0 (2011/11/28) - 54.9kb*

* Integration with YouTube API (and intial support for Vimeo API) : http://mediaelementjs.com/examples/?name=youtube
* Catch when Google Translate fails due to API limits

*2.3.3 (2011/11/21) - 49.4kb*

* removed volume controls for touch devices (Android and iOS require hardware volume)
* set a timeout to hide controls on touch devices
* fixed timecode bug with :09 (used radix)
* fixed bug when long videos end: (try/catch)
* fixed issue with `alwaysShowControls`
* removed a `console.log` in fullscreen that broke IE

*2.3.2 (2011/11/12) 49.6kb*

* removed `http` from Flash and Silverlight embeds to support SSL
* fixed a possible bug when neither `src` nor `type` was specified
* turned off useCapture for a few events

*2.3.1 (2011/11/07)*

* Another set of changes to handle various browser native fullscreen issues
* New control behavior for touch enabled devices (iPad, Android tablets)
* Bug fix for Flash (bradleyboy)

*2.3.0 (2011/11/01) - 48.5kb*

* Fixed bug when fullscreen was called before play pressed
* Additional classes mejs-audio, mejs-video, mejs-ios, mejs-iphone, mejs-ipad, mejs-android added to contianing `<div>` for styles
* IE9 can't use `<video width="100%">` so you must use either options ({videoHeight:'100%'}) or inline style `<video style="width:100%;height:100%;">` 
* updated fullscreen code for Safari (erktime)
* loading indicators shows during 'waiting' event
* iOS and Android now show "big play" button again (sometimes overlaps on iPhone)

*2.2.5 (2011/10/14)*

* fix for Flash fallback in certain scenarios (IE RegExp problem, Firefox fullscreen Flash issue)
* adjustments for floating time indicator

*2.2.4 (2011/10/10)*

* True FullScreen support in Firefox (nightly) and Chrome (Canary)
* more updates for 100% mode
* enableContextMenu(), disableContextMenu() methods
* change to poster code to let it be set later

*2.2.3 (2011/10/07b) - 45.8kb*

* updated accessibility again for JAWS and NVDA (thanks to twitter.com/mohammed0204)
* added CSS class `<html class="mejs-embed">` for `<iframe>` embeds

*2.2.2 (2011/10/07) - 45.8kb*

* added support for <del>`<video width="100%" height="100%"></video>`</del> `<video style="width:100%;height:100%"></video>` (i.e. responsive/adaptive players)
* added :focus state for buttons to improve accessibility
* added title and aria-controls attributes to buttons to improve accessibility 
* changed when loading circle appears (WebKit fires the 'loadstart' event differently than FF or IE)

*2.2.1 (2011/10/06) - 44.1kb*

* fixed a bug with fullscreen that caused IE to completely mess up it layout
* fixed another bug with fullscreen and z-index

*2.2.0 (2011/10/04)*

* controls now display on iPad, iPhone, and Android. Can be turned off using (iPadForceNativeControls:true)
* fullscreen support for iPad (different from true fullscreen on Safari 5.1)
* added frameaccurate timecode (via gselva)
* added contextmenu as a feature. if turned on the default includes: fullscreen toggle, mute toggle, and media download
* updated WebVTT support (still had some SRT formatting restrictions)
* dynamic player creation: from `<a href="media.mp4">video</a>` and `<div class="mejs"></div>` specifying type (string or array)
* Fixed bug where Flash couldn't go fullscreen with track chapters
* fixed a bug with Flash fullscreen ratios
* controls now disappear on timeout when mouse is idle (useful for fullscreen)
* enableControls() and disableControls() (for pre/post roll scenarios)
* added an autoplay override (especially for WebKit browsers)
* fixed functionality of mute toggling
* reorganized plugins to use $.extend
* updating functionality of loading graphic to account for various browser inconsistencies (loadstart event)

*2.1.9 (2011/08/04) - 36.9kb*

* fixed Android 2.1 and 2.2 playing problems (still need a good 2.3 and 3.0 device. hint. hint.)

*2.1.8 (2011/08/03) - 36.9kb*

* True fullscreen for Safari 5.1
* Flash/Silverlight fullscreen is now "full window" (except for Firefox which cannot handle adjusting Flash without reloading it)

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

2.x features
* HTML5 error handling
* Flash/SL error codes
* Postroll
* Flash StageVideo?
