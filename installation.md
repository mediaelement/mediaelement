# Installation

## 0. Setup MIME-types (optional)
On Linux/Apache servers, create a filed called .htaccess with the following text and upload it to the root of your website
```
AddType video/ogg .ogv
AddType video/mp4 .mp4
AddType video/webm .webm
```
On Windows/IIS servers, please follow Microsoft's instructions on how to add/edit MIME types on [IIS6](http://www.microsoft.com/technet/prodtechnol/WindowsServer2003/Library/IIS/eb5556e2-f6e1-4871-b9ca-b8cf6f9c8134.mspx?mfr=true) and [IIS7](https://technet.microsoft.com/en-us/library/cc725608(v=ws.10).aspx).

If you are working with local files and plan to test Flash playback, make sure you go to the [Flash Security Settings](http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html) page and add your working directory. Also, things tend to work best when you use absolute paths.

For more information about how to set up a server to serve media properly and other general and useful topics about dealing with HTML5 video, [this article](http://ronallo.com/blog/html5-video-everything-i-needed-to-know) is a good start point.

## 1. Add Script and Stylesheet
```html
<script src="jquery.js"></script>
<script src="mediaelement-and-player.min.js"></script>
<link rel="stylesheet" href="mediaelementplayer.css" />
```

Note: to support IE6-8, this code must appear in the `<head>` tag. If you cannot place the MediaElement.js code in the `<head>` you need to install something like [html5shiv](https://github.com/afarkas/html5shiv).

If you wish to install the sources in different folders (i.e., all Javascript files in a _js_, all CSS in a _styles_, Flash/Silverlight files in _plugins_, etc.), add the following CSS update after the _mediaelementplayer.css_ reference (**only if the images are not in the same folder as the stylesheet**):
```html
<link rel="stylesheet" href="/path/to/mediaelementplayer.css" />

<style>
.mejs-overlay-loading, .mejs-container .mejs-controls, 
.mejs-controls .mejs-volume-button .mejs-volume-slider,
.mejs-controls .mejs-captions-button .mejs-captions-selector,
.mejs-captions-text, .mejs-controls .mejs-sourcechooser-button .mejs-sourcechooser-selector,
.mejs-postroll-layer, .mejs-postroll-close,
.mejs-controls .mejs-speed-button .mejs-speed-selector {
    background: url("/path/to/background.png");
}

.no-svg .mejs-overlay-button {
    background-image: url("/path/to/bigplay.png");
}

.no-svg .mejs-controls .mejs-button button {
	background-image: url("/path/to/controls.png");
}

.mejs-controls .mejs-button.mejs-jump-forward-button {
    background: transparent url("/path/to/jumpforward.png") no-repeat 3px 3px;
}

.mejs-controls .mejs-button.mejs-skip-back-button {
    background: transparent url("/path/to/skipback.png") no-repeat 3px 3px;
}

.mejs-overlay-button {
    background: url("/path/to/bigplay.svg") no-repeat;
}

.mejs-controls .mejs-button button {
    background: transparent url("/path/to/controls.svg") no-repeat;
}
</style>
```

## 2. Add `<video>` or `<audio>` tags
If your users have JavaScript and/or Flash, the easiest route for all browsers and mobile devices is to use a single MP4 or MP3 file.

```html	
<video src="myvideo.mp4" width="320" height="240"></video>
```
```html	
<audio src="myaudio.mp3"></audio>
```

### Optional: multiple codecs
This includes multiple codecs for various browsers (H.264 for IE9+, Safari, and Chrome, WebM for Firefox 4 and Opera, Ogg for Firefox 3).

```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	<source type="video/webm" src="myvideo.webm" />
	<source type="video/ogg" src="myvideo.ogv" />
</video>
```

### Optional: Browsers with JavaScript disabled
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

## 3. Startup

### Automatic start
You can avoid running any startup scripts by added `class="mejs-player"` to the `<video>` or `<audio>` tag. Options can be added using the `data-mejsoptions` attribute
```html	
<video src="myvideo.mp4" width="320" height="240" 
		class="mejs-player" 
		data-mejsoptions='{"alwaysShowControls": true}'></video>
```

### Normal JavaScript
```html
<script>
var player = new MediaElementPlayer('#player', {success: function(mediaElement, originalNode) {
	// do things
}});
</script>	
```

### jQuery plugin
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

**NOTE:** If sources are installed in different folders, only update the ```pluginPath``` option with the location of the Flash/Silverlight files. Also, update ```flashName``` and ```silverlightName``` options **only if those files were renamed**.
```html
<script>
$('#mediaplayer').mediaelementplayer({
    pluginPath: '/path/to/flash_silverlight_folder',
    
    // Optional: the name of both files is different than 'flashmediaelement.swf' and 'silverlightmediaelement.xap', respectively.
    flashName: 'newflashname.swf',
    silverlightName: 'newsilverlightname.xap',
    
    success: function(mediaElement, originalNode) {
	// do things
    }
});
```