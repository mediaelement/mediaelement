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
var playerId = $('#mediaplayer').closest('.mejs-container').attr('id');
var player = mejs.players[playerId];

// With iOS (iPhone), since it defaults always to QuickTime, you access the player directly;
// i.e., if you wanna exit fullscreen on iPhone using the player, use this:
var player = $('#mediaplayer')[0];
player.webkitExitFullScreen();
 
</script>
```

<a id="renderers-usage"></a>
## Use of Renderers

By default, all the renderers will be called by their IDs and the plugin will try to detect the best one. 

However, if you need to use **globally** just a subset of renderers in a specific order, you must list their IDs **BEFORE** instantiating the player by using `mejs.Renderers.order` in the order you desire.

```javascript

// Use globally native M(PEG)-DASH renderer first, then Flash shim 
mejs.Renderers.order = ['native_mdash', 'flash_mdash'];

$('video, audio').mediaelementplayer({...});

```

Also, if you need to indicate specific renders **per player instance**, use the `renderers` option when configuring player.

```javascript

// Use ONLY in video player 1 native M(PEG)-DASH renderer first, then Flash shim if firts one not found
$('#video1').mediaelementplayer({
    renderers: ['native_mdash', 'flash_mdash'],
    ...
});

// Use ONLY in video player 2 native HTML5 renderer first, then Flash shim if firts one not found
$('#video2').mediaelementplayer({
     renderers: ['html5', 'flash_video'],
     ...
 });
```

`MediaElement` can call methods from the current renderer's API (if any) by invoking its own API instance, a special object attached to the `MediaElement` instance. Keep in mind that some methods won't work if they are not bound to an event. An example using native HLS:
```javascript
$('video').mediaelementplayer({
    pluginPath: '../build/',
    hls: {
        debug: true,
        // HLS is not gonna start loading immediatly 
        autoStartLoad: false
    },
    
    // More configuration parameters
    
    success: function(media, node) {
    
        media.addEventListener('hlsMediaAttached', function() {
        
            console.log('Media attached!');
        });
        
        // Manifest file was parsed, invoke loading method
        media.addEventListener('hlsManifestParsed', function() {
        
            // hlsPlayer is the instance of HLS.js in MediaElement
            media.hlsPlayer.startLoad();
    
        });
    }
});
```

Below are listed the renderers with their IDs and player instance to execute other methods from APIs.

Renderer | ID | API instance | Reference
-------- | --- | ------------ | ----------
Native video/audio | `html5` | --- | ---
HLS native | `native_hls` | `hlsPlayer` | https://github.com/dailymotion/hls.js
M(PEG)-DASH native | `native_mdash` | `dashPlayer` | https://github.com/Dash-Industry-Forum/dash.js
SoundCloud | `soundcloud_iframe` | `scPlayer` | https://developers.soundcloud.com/docs/api/html5-widget
Facebook | `facebook` | --- | --- 
Vimeo | `vimeo_iframe` | `vimeoPlayer` | https://github.com/vimeo/player.js
YouTube | `youtube_iframe` | `youTubeApi` | https://developers.google.com/youtube/iframe_api_reference
DailyMotion | `dailymotion_iframe` | `dmPlayer` | https://developer.dailymotion.com/player 
Video shim (MP4/RTMP) | `flash_video` | --- | ---
Audio shim (MP3) | `flash_audio` | --- | ---
Audio shim (OGG) | `flash_audio_ogg` | --- | ---
HLS shim | `flash_hls` | --- | ---
M(PEG)-DASH shim | `flash_mdash` | --- | ---

________
[Back to Main](README.md)