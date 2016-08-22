# `<video>` and `<audio>` made easy. 

One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: [MIT](http://johndyer.mit-license.org/)
* Meaning: Use everywhere, keep copyright, it'd be swell if you'd link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [all contributors](https://github.com/johndyer/mediaelement/graphs/contributors)


## Installation and Usage

_MediaElementPlayer: HTML5 `<video>` and `<audio>` player_

A complete HTML/CSS audio/video player built on top `MediaElement.js` and `jQuery`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

## Change Log

Changes available at [Change Log](changelog.md)

## Installation

The full documentation on how to install MediaElementJs is available at [Installation](installation.md)

## How it Works: 
_MediaElement.js: HTML5 `<video>` and `<audio>` shim_

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using. 
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.

To know which plugin you are using (native, Flash, Silverlight, etc.), use an instance of the player and use the **pluginType** property for it.
```html
<script src="mediaelement.js"></script>
<video src="myvideo.mp4" width="320" height="240"></video>

<script>
var v = document.getElementsByTagName("video")[0];
new MediaElement(v, {success: function(media) {
	media.play();
	
	console.log(media.pluginType);
}});
</script>
```
You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.

## Building MediaElement.js

When developing MediaElement, make changes to the files in the `/src/` directory (not `/build/`) and test the changes with `/test/test.html`.

To compile the changes

1. Install `node.js` with `npm` https://nodejs.org/
2. At the command prompt type `npm install` which will download all the necessary tools
3. Type `grunt` to build MediaElement.js
4. To compile the Flash swf, you'll need to install Flex 4.6. See instructions in Gruntfile.js for details.

## API and Configuration Parameters
   
`MediaElement.js` has many options that you can take advantage from. Visit [API and Configuration Parameters](api.md) for more details.
