# GOAL: Make `<video>` and `<audio>` easy. One file. Any browser. Same UI.

* Author: [John Dyer](http://johndyer.name/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: GPLv2/MIT
* Meaning: Please use this everywhere and it'd be swell if you'd 
link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)

## Part 1: MediaElement.js
_HTML5 `<video>` and `<audio>` shim_

`MediaElement.js` wraps the HTML5 media API around Flash and/or Silverlight plugins for browsers that don't support HTML5 or don't support the media codecs you're using. 

	<script src="mediaelement.js"></script>
	<video src="myvideo.mp4" width="320" height="240"></video>
	
	<script>
	var v = document.getElementsByTagName("video")[0];
	new MediaElement(v, {success: function(media) {
		media.play();
	}});
	</script>

## Part 2: MediaElementPlayer.js

_HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top  `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

	<script src="jquery.js"></script>
	<script src="mediaelement.js"></script>
	<script src="mediaelementplayer.js"></script>
	<link rel="stylesheet" href="mediaelementplayer.css" />

	<video id="v1" src="myvideo.mp4" width="320" height="240"></video>

	<script>
	$('video').mediaelementplayer();
	// OR
	new MediaElementPlayer('#v1');
	</script>

### Version History

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