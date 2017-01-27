# Usage

* [Automatic start](#automatic)
* [Vanilla JavaScript](#vanilla)
* [jQuery](#jquery)
* [NPM/Meteor](#npm-meteor)
* [RequireJS](#requirejs)
* [Use of Renderers](#renderers-usage)

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.

<a id="automatic"></a>
## Automatic start
You can avoid running any startup scripts by added `class="mejs-player"` to the `<video>` or `<audio>` tag. Options can be added using the `data-mejsoptions` attribute.
```html	
<video src="myvideo.mp4" width="320" height="240" 
		class="mejs-player" 
		data-mejsoptions='{"pluginPath": "/path/to/shims/", "alwaysShowControls": "true"}'></video>
```

<a id="vanilla"></a>
## Vanilla JavaScript
```html
<script>
var player = new MediaElementPlayer('#player', {pluginPath: "/path/to/shims/", success: function(mediaElement, originalNode) {
	// do things
}});
</script>	
```

<a id="jquery"></a>
## jQuery
```html
<script>
$('#mediaplayer').mediaelementplayer({pluginPath: "/path/to/shims/", success: function(mediaElement, originalNode) {
	// do things
}});

// To access player after its creation through jQuery use:
var playerId = $('#mediaplayer').closest('.mejs__container').attr('id');
// or $('#mediaplayer').closest('.mejs-container').attr('id') in "legacy" stylesheet

var player = mejs.players[playerId];

// With iOS (iPhone), since it defaults always to QuickTime, you access the player directly;
// i.e., if you wanna exit fullscreen on iPhone using the player, use this:
var player = $('#mediaplayer')[0];
player.webkitExitFullScreen();
 
</script>
```

<a id="npm-meteor"></a>
## NPM/Meteor
```javascript
// To import only MediaElement class
import 'mediaelement/standalone';

// To import only MediaElementPlayer class and $.fn.mediaelementplayer plugin
import 'mediaelement/player';

// To import all the plugin (you will have access to the MediaElement and MediaElementPlayer classes
// and $.fn.mediaelementplayer plugin)
import 'mediaelement/all';
```

**IMPORTANT**: In order to use the `$.fn.mediaelementplayer` plugin, you will need to import jQuery as well in your bundle like follows:

1. Create a `jquery-global.js` file that contains:
```javascript
'use strict';

import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
```
2. Import the `jquery-global.js` along with the desired package
```javascript
'use strict';

import '/path/to/jquery-global';
import 'mediaelement/all'; // or import `mediaelement/player`;
```

<a id="requirejs"></a>
## RequireJS
With RequireJS, you will need the following setup if you are planning to use HLS, M(PEG)-DASH or FLV, given the way the packages are bundled.

To make it work, install via NPM any of the external libraries you will need (i.e., HLS.js).
```
npm install hls.js
```
In your code, include a `shim` for the external library and then assign the exported variable to the global scope.
```javascript
requirejs.config({
    // Other configuration
    shim: {
    	// Other shims
        'path/to/hls': {deps: ['require'], exports: "Hls"},
    }
});

// Later on the code...
require(['path/to/hls'], function (Hls) {
        window.Hls = Hls;

        require(['path/to/mediaelement-and-player'], function (MediaElementPlayer) {

            var player = new MediaElementPlayer('media-id', {
            	// Player configuration
            });
        });
    });

```

**IMPORTANT NOTE:** To keep Flash shims working you **MUST** setup the path where the shims are via `pluginPath`, and do not forget to add a slash at the end of the string. Please refer to the examples above. In Meteor, the right path to be used is `/packages/johndyer_mediaelement/build/`;

<a id="renderers-usage"></a>
## Use of Renderers

By default, all the renderers will be called by their IDs and the plugin will try to detect the best one. 

However, if you need to use just a subset of renderers in a specific order, you must list their IDs using `renderers` option when configuring your player.

```javascript

// Use globally native M(PEG)-DASH renderer first, then Flash shim 
mejs.Renderers.order = ['native_dash', 'flash_dash'];

$('video, audio').mediaelementplayer({
    // Use only M(PEG)DASH renderers
    renderers: ['native_dash', 'flash_dash'],
    ...
});
```

`MediaElement` can call methods from the current renderer's API (if any) by invoking its own API instance, a special object attached to the `MediaElement` instance. Keep in mind that some methods won't work if they are not bound to an event. An example using native HLS:
```javascript
$('video').mediaelementplayer({
    pluginPath: '../build/',
    // All the config related to HLS
    hls: {
        debug: true,
        autoStartLoad: false
    },
    
    // More configuration parameters...
    
    success: function(media, node) {
    	
    	// Since it could be that the HLS element is not yet loaded, use a setInterval method to check when it's ready
    	// and then destroy it; this applies to the native renderers (HLS, DASH and FLV)
    	
    	var interval = setInterval(function () {
        
    		// media.hlsPlayer is the instance of HLS.js in MediaElement
    		// each one of the renderers has a player instance
    		// See `Use of Renderers` above for more information
            if (media.hlsPlayer !== undefined) {
            	
            	media.hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function() {
            		// All the code when this event is reached...
                    console.log('Media attached!');
                });
                
                // Manifest file was parsed, invoke loading method
                media.hlsPlayer.on('hlsManifestParsed', function() {
            		// All the code when this event is reached...
            		console.log()
            
                });
                
            	media.hlsPlayer.on(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {
            		// All the code when this event is reached...
            		console.log(data);
                });


                // clear interval
                clearInterval(interval);

            }
            
        }, 500); 
    }
});
```
<a id="renderers-list"></a>
Below are listed the renderers with their IDs and player instance to execute other methods from APIs.

Renderer | ID | API instance | Reference
-------- | --- | ------------ | ----------
Native video/audio | `html5` | --- | ---
HLS native | `native_hls` | `hlsPlayer` | https://github.com/dailymotion/hls.js
M(PEG)-DASH native | `native_dash` | `dashPlayer` | https://github.com/Dash-Industry-Forum/dash.js
FLV native | `native_flv` | `flvPlayer` | https://github.com/Bilibili/flv.js
SoundCloud | `soundcloud_iframe` | `scPlayer` | https://developers.soundcloud.com/docs/api/html5-widget
Facebook | `facebook` | --- | --- 
Vimeo | `vimeo_iframe` | `vimeoPlayer` | https://github.com/vimeo/player.js
YouTube | `youtube_iframe` | `youTubeApi` | https://developers.google.com/youtube/iframe_api_reference
DailyMotion | `dailymotion_iframe` | `dmPlayer` | https://developer.dailymotion.com/player 
Video shim (MP4/RTMP) | `flash_video` | --- | ---
Audio shim (MP3) | `flash_audio` | --- | ---
Audio shim (OGG) | `flash_audio_ogg` | --- | ---
HLS shim | `flash_hls` | --- | ---
M(PEG)-DASH shim | `flash_dash` | --- | ---


________
[Back to Main](../README.md)
