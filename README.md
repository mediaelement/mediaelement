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

<a id="browser-support"></a>
## Browser and Device support

Format | Support
------ | -------
**mp4** | Please visit http://caniuse.com/#feat=mpeg4 for comprehensive information
**webm** | Please visit http://caniuse.com/#feat=webm for comprehensive information
**mp3** | Please visit http://caniuse.com/#feat=mp3 for comprehensive information
**m3u8** | Safari and iOS (native); all browsers that support **Flash** (version 10 or later)
**rtmp/flv** | All browsers that support **Flash** (version 10 or later)
**wmv/wma** | All browsers that support **Silverlight**
**YouTube** | All browsers since it uses `iframe` tag

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

New features and pending bugs can be found at [TODO list](TODO.md).
