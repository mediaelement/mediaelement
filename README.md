# ![MediaElementJS](https://cloud.githubusercontent.com/assets/910829/22357262/e6cf32b4-e404-11e6-876b-59afa009f65c.png)

One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: [MIT](http://johndyer.mit-license.org/)
* Meaning: Use everywhere, keep copyright, it'd be swell if you'd link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [all contributors](https://github.com/johndyer/mediaelement/graphs/contributors)
* Currently maintained by Rafael Miranda (@ron666)

[![GitHub Version](https://img.shields.io/npm/v/mediaelement.svg)](https://github.com/johndyer/mediaelement)
[![Build Status](https://img.shields.io/travis/johndyer/mediaelement.svg)](https://travis-ci.org/johndyer/mediaelement)
[![Coverage Status](https://img.shields.io/coveralls/johndyer/mediaelement.svg)](https://coveralls.io/github/johndyer/mediaelement)
[![MIT License](https://img.shields.io/npm/l/mediaelement.svg)](https://johndyer.mit-license.org/)

# Table of Contents

* [Introduction](#intro)
* [Browser and Device support](#browser-support)
* [What's New on `MediaElement.js` version 3.0](#new-features)
* [Migrating from `2.x` to `3.x` version](#migration)
* [Browser and Device support](#browser-support)
* [Installation and Usage](#installation)
* [API and Configuration](#api)
* [Guidelines for Contributors](#guidelines)
* [Change Log](#changelog)
* [TODO list](#todo)

<a id="intro"></a>
## Introduction

_MediaElementPlayer: HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

`MediaElement.js` is a set of custom Flash plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. 
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) on all browsers.

<a id="new-features"></a>
## * What's New on `MediaElement.js` version 3.0

* Introduction of `Renderers`, pluggable code that allows the introduction of new media formats in an easier way.

* Refactor code in `ES2015` notation and added [Travis CI](https://travis-ci.org/johndyer/mediaelement) and [Coveralls](https://coveralls.io/github/johndyer/mediaelement) support

* Ability to play Facebook, SoundCloud, M(PEG)-DASH using [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for native support and [dash.as](https://github.com/castlabs/dashas) for Flash fallback.

* Code completely documented using [JSDoc](http://usejsdoc.org/) notation.

* Updated styles for control bar.

* Introduction of BEM naming convention for player classes, and backward compatibility with "legacy" stylesheet.

* Addition of native HLS using [hls.js](https://github.com/dailymotion/hls.js) library.

* Updated player for Vimeo by removing the use of `Froogaloop` and integrating the new [Player API](https://github.com/vimeo/player.js).
 
* Removed Silverlight shim, as well as IE8 and older browsers support.

* Integration of [JSLint](https://github.com/douglascrockford/JSLint) to ensure code quality and better error checking for development.

For more information, please consult [Change Log](changelog.md)

<a id="migration"></a>
## * IMPORTANT: Migrating from `2.x` to `3.x` version

In order to successfully install `3.x` in an existing setup, you must consider the following guidelines:

1. If your installation relies on the legacy player classes (i.e., `mejs-player`, `mejs-container`, etc.), you **must** set up the proper namespace. In `2.x`, the default namespace is `mejs-` but now is `mejs__`. In order to set up a new namespace (or the legacy one), use the `classPrefix` configuration, and make sure you use the `mediaelementplayer-legacy` stylesheet provided in the `/build/` folder.

2. You **must** set up now the path for the Flash shims if they are not in the same folder as the JS files. To do this, set the path via the `pluginPath` configuration. In the same topic, if you need to support browsers with Javascript disabled, you **must** reference the correct Flash shim, since in `2.x` there was only a single Flash shim and in `3.x` it was split to target specific media types. Check the [Browsers with JavaScript disabled](docs/installation.md#disabled-javascript) section for more details.
 
3. If you need to force the Flash shim, the way to do it in `3.x` version is to use the `renderers` configuration and list them in an array.

4. `pluginType` was removed to favor `rendererName`. If you rely on that element, just create conditionals based on the renderer ID (all listed [here](docs/usage.md#renderers-list)). For example:

```javascript
$('video, audio').mediaelementplayer({
        // Configuration
        success: function(media) {
                var isNative = media.rendererName.match(/html5|native/);
                
                var isYoutube = media.rendererName.match(/youtube/);
                
                // etc.
        }
});
```

**It is strongly recommended to read the documentation to get the most out of this package**. Visit [here](docs) to start.

<a id="browser-support"></a>
## Browser and Device support

In general, `MediaElement` supports **IE9+, MS Edge, Chrome, Firefox, Safari, iOS 8+** and **Android 4.0+**.

Format | MIME Type | Support
------ | --------- | -------
mp4 | video/mp4, audio/mp4, audio/mpeg | Please visit http://caniuse.com/#feat=mpeg4 for comprehensive information
webm | video/webm | Please visit http://caniuse.com/#feat=webm for comprehensive information
mp3 | audio/mp3 | Please visit http://caniuse.com/#feat=mp3 for comprehensive information
ogg/ogv | audio/ogg, audio/oga, video/ogg | Please visit http://caniuse.com/#search=ogg for comprehensive information
wav | audio/wav, audio/x-wav, audio/wave, audio/x-pn-wav | Please visit http://caniuse.com/#feat=wav for comprehensive information
m3u8 | application/x-mpegURL, vnd.apple.mpegURL, audio/mpegURL, audio/hls, video/hls | Safari and iOS (native); browsers that support MSE through `hls.js` library; rest of the browsers that support `Flash` (version 10 or later)
mpd | application/dash+xml | Browsers that support MSE through `dash.js` library; rest of the browsers that support `Flash` (version 10 or later)
flv | video/flv | Browsers that support MSE through `flv.js` library; rest of the browsers that support `Flash` (version 10 or later)
rtmp | video/mp4, video/rtmp, audio/rtmp, rtmp/mp4, audio/mp4 | All browsers that support `Flash` (version 10 or later)
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

The full documentation on how to install `MediaElement.js` is available at [Installation](docs/installation.md).

A brief guide on how to create and use instances of `MediaElement` available at [Usage](docs/usage.md).

<a id="api"></a>
## API and Configuration
   
`MediaElement.js` has many options that you can take advantage from. Visit [API and Configuration](docs/api.md) for more details.

<a id="guidelines"></a>
## Guidelines for Contributors

If you want to contribute to improve this package, please read [Guidelines](docs/guidelines.md).

<a id="changelog"></a>
## Change Log

Changes available at [Change Log](changelog.md)

<a id="todo"></a>
## TODO list

**IMPORTANT:** Before posting an issue, it is strongly encouraged to read the whole documentation since it covers the majority of scenarios exposed in prior issues. 

New features and pending bugs can be found at [TODO list](TODO.md).