# `MediaElement.js`: `<video>` and `<audio>` made easy. 

One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: [MIT](http://johndyer.mit-license.org/)
* Meaning: Use everywhere, keep copyright, it'd be swell if you'd link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [all contributors](https://github.com/johndyer/mediaelement/graphs/contributors)

# Table of Contents

* [Introduction](#intro)
* [Browser and Device support](#browser-support)
* [What's New on `MediaElement.js` version 3.0](#migration)
* [Installation and Usage](#installation)
* [API and Configuration](#api)
* [Guidelines for Contributors](#guidelines)
* [Change Log](#changelog)
* [TODO list](#todo)

<a id="intro"></a>
## Introduction

_MediaElementPlayer: HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. 
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.

<a id="migration"></a>
## * What's New on `MediaElement.js` version 3.0

* Introduction of `Renderers`, pluggable code that allows the introduction of new media formats in an easier way.

* Ability to play Facebook, SoundCloud, M(PEG)-DASH using [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for native support and [dash.as](https://github.com/castlabs/dashas) for Flash fallback.

* Code completely documented using [JSDoc](http://usejsdoc.org/) notation.

* Addition of native HLS using [hls.js](https://github.com/dailymotion/hls.js) library.

* Updated player for Vimeo by removing the use of `Froogaloop` and integrating the new [Player API](https://github.com/vimeo/player.js).

* Deprecated use of `pluginType` element.
 
* Removed Silverlight shim, as well as IE8 and older browsers support.

* Integration of [JSLint](https://github.com/douglascrockford/JSLint) to ensure code quality and better error checking for development.

For more information, please consult [Change Log](changelog.md)


<a id="browser-support"></a>
## Browser and Device support

In general, `MediaElement` supports IE9+, MS Edge, Chrome, Firefox, Safari, iOS 8+ and Android 4.0+

Format | MIME Type | Support
------ | --------- | -------
mp4 | video/mp4, audio/mp4, audio/mpeg | Please visit http://caniuse.com/#feat=mpeg4 for comprehensive information
webm | video/webm | Please visit http://caniuse.com/#feat=webm for comprehensive information
mp3 | audio/mp3 | Please visit http://caniuse.com/#feat=mp3 for comprehensive information
ogg/ogv | audio/ogg, audio/oga, video/ogg | Please visit http://caniuse.com/#search=ogg for comprehensive information
wav | audio/wav, audio/x-wav, audio/wave, audio/x-pn-wav | Please visit http://caniuse.com/#feat=wav for comprehensive information
m3u8 | application/x-mpegURL, vnd.apple.mpegURL, audio/mpegURL, audio/hls, video/hls | Safari and iOS (native); browsers that support MSE through `hls.js` library; rest of the browsers that support `Flash` (version 10 or later)
mpd | application/dash+xml | Browsers that support MSE through `dash.js` library; rest of the browsers that support `Flash` (version 10 or later)
rtmp/flv | video/mp4, video/flv, video/rtmp, audio/rtmp, rtmp/mp4, audio/mp4 | All browsers that support `Flash` (version 10 or later) and native on MediaSource supported Browsers http://caniuse.com/#feat=mediasource
youtube | video/youtube, video/x-youtube | All browsers that support `window.postMessage`; Flash deprecated.
vimeo | video/vimeo, video/x-vimeo | All browsers that support `iframe` tag and HTML5
facebook | video/facebook, video/x-facebook | All browsers that support `iframe` tag and HTML5
dailymotion | video/dailymotion, video/x-dailymotion | All browsers that support `iframe` tag and HTML5
soundcloud | video/soundcloud, video/x-soundcloud | All browsers that support `iframe` tag and HTML5

**Notes** 
* Support for `wmv` and `wma` has been dropped since most of the major players are not supporting it as well.
* `ogg` formats won’t play consistently in all browsers so it is strongly recommended a MP3 fallback for audio, or MP4 for video.
* `wav` formats will only play on Browsers that support it natively since there is currently no Flash fallback to allow them to play in other browsers.

<a id="installation"></a>
## Installation and Usage

The full documentation on how to install `MediaElement.js` is available at [Installation](installation.md).

A brief guide on how to create and use instances of `MediaElement` available at [Usage](usage.md).

<a id="api"></a>
## API and Configuration
   
`MediaElement.js` has many options that you can take advantage from. Visit [API and Configuration](api.md) for more details.

<a id="guidelines"></a>
## Guidelines for Contributors

If you want to contribute to improve this package, please read [Guidelines](guidelines.md).

<a id="changelog"></a>
## Change Log

Changes available at [Change Log](changelog.md)

<a id="todo"></a>
## TODO list

**IMPORTANT:** Before posting an issue, it is strongly encouraged to read the whole documentation since it covers the majority of scenarios exposed in prior issues. 

New features and pending bugs can be found at [TODO list](TODO.md).
