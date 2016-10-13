# Usage

* [Automatic start](#automatic)
* [Vanilla JavaScript](#vanilla)
* [jQuery](#jquery)
* [Use of Renderers](#renderers-usage)

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.

<a id="automatic"></a>
## Automatic start
You can avoid running any startup scripts by added `class="mejs-player"` to the `<video>` or `<audio>` tag. Options can be added using the `data-mejsoptions` attribute.
```html	
<video src="myvideo.mp4" width="320" height="240" 
		class="mejs-player" 
		data-mejsoptions='{"alwaysShowControls": true}'></video>
```

<a id="vanilla"></a>
## Vanilla JavaScript
```html
<script>
var player = new MediaElementPlayer('#player', {success: function(mediaElement, originalNode) {
	// do things
}});
</script>	
```

<a id="jquery"></a>
## jQuery
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

<a id="renderers-usage"></a>
## Use of Renderers

By default, all the renderers will be called and the plugin will try to detect the best one for your needs. 

However, if you want to use a specific render, or a subset, and also give them priority, you must indicate it **BEFORE** instantiating the player by using `mejs.Renderers.order` in the order you desire.

```javascript

// Use native renderer first, then Flash shim for M(PEG)-DASH
mejs.Renderers.order = ['native_mdash', 'flash_mdash'];

$('video, audio').mediaelementplayer();

```

________
[Back to Main](README.md)