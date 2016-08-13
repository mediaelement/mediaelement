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

### 0. Setup MIME-types (optional)
On Linux/Apache servers, create a filed called .htaccess with the following text and upload it to the root of your website
```
AddType video/ogg .ogv
AddType video/mp4 .mp4
AddType video/webm .webm
```
On Windows/IIS servers, please follow Microsoft's instructions on how to add/edit MIME types on [IIS6](http://www.microsoft.com/technet/prodtechnol/WindowsServer2003/Library/IIS/eb5556e2-f6e1-4871-b9ca-b8cf6f9c8134.mspx?mfr=true) and [IIS7](https://technet.microsoft.com/en-us/library/cc725608(v=ws.10).aspx).

If you are working with local files and plan to test Flash playback, make sure you go to the [Flash Security Settings](http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html) page and add your working directory. Also, things tend to work best when you use absolute paths.

For more information about how to set up a server to serve media properly and other general and useful topics about dealing with HTML5 video, [this article](http://ronallo.com/blog/html5-video-everything-i-needed-to-know) is a good start point.

### 1. Add Script and Stylesheet
```html
<script src="jquery.js"></script>
<script src="mediaelement-and-player.min.js"></script>
<link rel="stylesheet" href="mediaelementplayer.css" />
```

Note: to support IE6-8, this code must appear in the `<head>` tag. If you cannot place the MediaElement.js code in the `<head>` you need to install something like [html5shiv](https://github.com/afarkas/html5shiv).

### 2. Add `<video>` or `<audio>` tags
If your users have JavaScript and/or Flash, the easiest route for all browsers and mobile devices is to use a single MP4 or MP3 file.

```html	
<video src="myvideo.mp4" width="320" height="240"></video>
```
```html	
<audio src="myaudio.mp3"></audio>
```

#### Optional: multiple codecs
This includes multiple codecs for various browsers (H.264 for IE9+, Safari, and Chrome, WebM for Firefox 4 and Opera, Ogg for Firefox 3).

```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	<source type="video/webm" src="myvideo.webm" />
	<source type="video/ogg" src="myvideo.ogv" />
</video>
```

#### Optional: Browsers with JavaScript disabled
In very rare cases, you might have a non-HTML5 browser with Flash turned on and JavaScript turned off. In that specific case, you can also include the Flash `<object>` code.
```html
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
```

### 3. Startup

#### Automatic start
You can avoid running any startup scripts by added `class="mejs-player"` to the `<video>` or `<audio>` tag. Options can be added using the `data-mejsoptions` attribute
```html	
<video src="myvideo.mp4" width="320" height="240" 
		class="mejs-player" 
		data-mejsoptions='{"alwaysShowControls": true}'></video>
```

#### Normal JavaScript
```html
<script>
var player = new MediaElementPlayer('#player', {success: function(mediaElement, originalNode) {
	// do things
}});
</script>	
```

#### jQuery plugin
```html
<script>
$('#mediaplayer').mediaelementplayer({success: function(mediaElement, originalNode) {
	// do things
}});

// To access player after its creation through jQuery use:
var player = $('#mediaplayer')[0].player;

// With iOS (iPhone), since it defaults always to QuickTime, you access the player directly;
// i.e., if you wanna exit fullscreen on iPhone using the player, use this:
var player = $('#mediaplayer')[0];
player.webkitExitFullScreen();
 
</script>
```

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
