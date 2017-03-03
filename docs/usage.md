# Usage

* [Initialize player](#initialize)
    * [Automatic start](#automatic)
    * [Vanilla JavaScript](#vanilla)
    * [jQuery](#jquery)
    * [NPM/Meteor](#npm-meteor)
    * [RequireJS](#requirejs)
* [Use Renderers](#renderers-usage)
* [Destroy player](#destroy)
* [Responsive grid](#grid)


<a id="initialize"></a>
## Initialize player

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.

## Standalone
```html
<script>

    var player = new MediaElement('player', {
    	pluginPath: "/path/to/shims/", 
    	success: function(mediaElement, originalNode) {
            // do things
            
        }
    });

</script>
```

<a id="automatic"></a>
### Automatic start
You can avoid running any startup scripts by adding `class="mejs__player"` to the `<video>` or `<audio>` tag. All the player configuration can be added through `data-mejsoptions` attribute.
```html	
<video src="myvideo.mp4" width="320" height="240" 
		class="mejs__player" 
		data-mejsoptions='{"pluginPath": "/path/to/shims/", "alwaysShowControls": "true"}'></video>
```

<a id="vanilla"></a>
### Vanilla JavaScript
```html
<script>

    var player = new MediaElementPlayer('player', {
    	pluginPath: "/path/to/shims/", 
    	success: function(mediaElement, originalNode) {
	        // do things
        }
    });
    
</script>	
```

<a id="jquery"></a>
### jQuery
```html
<script>

    $('#mediaplayer').mediaelementplayer({
    	pluginPath: "/path/to/shims/", 
    	success: function(mediaElement, originalNode) {
	        // do things
        }
    });

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
### NPM/Meteor
```javascript
// To import only MediaElement class
import 'mediaelement/standalone';

// To import only MediaElementPlayer class and $.fn.mediaelementplayer plugin 
// (includes the HTML5 and Flahs renderers ONLY)
import 'mediaelement/player';

// To import all the plugin (you will have access to the MediaElement and MediaElementPlayer classes,
// $.fn.mediaelementplayer plugin, all the native renderers, YouTube and Flash shims)
import 'mediaelement/full';

// To import renderers (i.e., Vimeo)
import 'mediaelement/build/renderers/vimeo';

// To import languages (i.e., Spanish)
import 'mediaelement/build/lang/es';
// Later on the code you need to use mejs.i18n.language('es') to set the language 
```

**IMPORTANT**: To ensure you can use the `$.fn.mediaelementplayer` plugin, you will need to import jQuery as well in your bundle like follows:

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
import 'mediaelement/full'; // or import `mediaelement/player`;
```

<a id="requirejs"></a>
### RequireJS
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
## Use Renderers

After the `MediaElement` package has been loaded, include any renderer(s) you are planning to use that not part of the main bundle (`mediaelement-and-player.js`). For example, to include Vimeo and Twitch support:

```html
<script src="/path/to/mediaelement-and-player.min.js"></script>
<script src="/path/to/renderers/vimeo.min.js"></script>
<script src="/path/to/renderers/twitch.min.js"></script>
```
By default, all the renderers will be called by their IDs and the plugin will try to detect the best one. 

However, if you need to use just a subset of renderers in a specific order, you must list their IDs using `renderers` option when configuring your player.

```javascript

// Use globally native M(PEG)-DASH renderer first, then Flash shim 
mejs.Renderers.order = ['native_dash', 'flash_dash'];

$('video, audio').mediaelementplayer({
    renderers: ['native_dash', 'flash_dash'], // Use only M(PEG)DASH renderers
    // More configuration
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
    	
    	// Since it could be that the HLS element is not yet loaded, use a `setInterval()` method to check when 
    	// it's ready and then destroy it; this applies to the native renderers (HLS, DASH and FLV)
    	var interval = setInterval(function () {
        
    		// media.hlsPlayer is the instance of HLS.js in MediaElement
    		// each one of the renderers has a player instance
    		// See `Use of Renderers` above for more information
            if (media.rendererName === 'native_hls' && media.hlsPlayer !== undefined) {
            	
            	// clear interval to stop checking if HLS object is available
                clearInterval(interval);
            	
            	media.hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function() {
            		// All the code when this event is reached...
                    console.log('Media attached!');
                });
                
                // Manifest file was parsed, invoke loading method
                media.hlsPlayer.on('hlsManifestParsed', function() {
            		// All the code when this event is reached...
            		console.log('Manifest parsed!');
            
                });
                
            	media.hlsPlayer.on(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {
            		// All the code when this event is reached...
            		console.log(data);
                });
            }
            
        }, 500); 
    }
});
```
<a id="renderers-list"></a>
Below are listed the renderers with their IDs and player instance to execute other methods from APIs.

Renderer | ID | API instance | Reference | MIME Type(s) 
-------- | --- | ------------ | -------- | --------- 
Native video/audio | `html5` | --- | --- | video/mp4, audio/mp4, video/webm, audio/mpeg, audio/mp3, audio/ogg, audio/oga, video/ogg
HLS native | `native_hls` | `hlsPlayer` | [`hls.js` API](https://github.com/dailymotion/hls.js/blob/master/doc/API.md) | application/x-mpegURL, vnd.apple.mpegURL
M(PEG)-DASH native | `native_dash` | `dashPlayer` | [`dash.js` Documentation](http://cdn.dashjs.org/latest/jsdoc/index.html) | application/dash+xml
FLV native | `native_flv` | `flvPlayer` | [`flv.js` API](https://github.com/Bilibili/flv.js/blob/master/docs/api.md) | video/flv
SoundCloud | `soundcloud_iframe` | `scPlayer` | [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget) | video/soundcloud, video/x-soundcloud
Facebook | `facebook` | --- | --- | video/facebook, video/x-facebook
Vimeo | `vimeo_iframe` | `vimeoPlayer` | [Vimeo Player API](https://github.com/vimeo/player.js) | video/vimeo, video/x-vimeo
YouTube | `youtube_iframe` | `youTubeApi` | [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) | video/youtube, video/x-youtube
DailyMotion | `dailymotion_iframe` | `dmPlayer` | [Dailymotion Player API](https://developer.dailymotion.com/player#player-api) | video/dailymotion, video/x-dailymotion
Twitch | `twitch_iframe` | `twitchPlayer` | [Twitch Emded API](https://github.com/justintv/Twitch-API/blob/master/embed-video.md) | video/twitch, video/x-twitch
Video shim  | `flash_video` | --- | --- | video/mp4, video/rtmp, audio/rtmp, rtmp/mp4, audio/mp4 
Audio shim | `flash_audio` | --- | --- | audio/mp3
OGG Audio shim  | `flash_audio_ogg` | --- | --- | audio/ogg, audio/oga
HLS shim | `flash_hls` | --- | --- | application/x-mpegURL, vnd.apple.mpegURL
M(PEG)-DASH shim | `flash_dash` | --- | --- |application/dash+xml

To know how well-supported are each one of the formats, visit http://caniuse.com/

**IMPORTANT**: Only renderers prefixed as __native__, YouTube, and Flash shim, are integrated by default on the player. The rest of the renderers are stored in the `build/renderers` folder.


**Notes** 
* Support for `wmv` and `wma` has been dropped since most of the major players are not supporting it as well.
* `ogg` formats will not play consistently in all browsers so it is strongly recommended a MP3 fallback for audio, or MP4 for video.
* `wav` and `webm` formats will only play on Browsers that support it natively since there is currently no Flash fallback to allow them to play in other browsers.
* `flv` and `mpd` will not work on iOS since it doesn't support MSE; for `mpd` use a `m3u8` fallback.


<a id="destroy"></a>
## Destroy player

In order to destroy the player, you must pause the player and then invoke the `remove()` method.
```javascript

var player = new MediaElementPlayer('#player');

// Using jQuery:
// var playerId = $('#mediaplayer').closest('.mejs__container').attr('id');
// var player = mejs.players[playerId];


if (!player.paused) {
        player.pause();	
}

player.remove();

// If you wanna destroy COMPLETELY the player (including also the `video` tag) use the above and also the following:
var videos = document.getElementsByTagName('video');
for( var i = 0, total = videos.length; i < total; i++ ){ 
        videos[i].parentNode.removeChild(videos[i]);
}


// Using jQuery:
// $('video').each(function() {
//         $(this).remove();
// });
```

Same code can be used for `<audio>` elements.

<a id="grid"></a>
## Responsive grid

Since `MediaElement` can adapt its size to be responsive, some might be tempted to use CSS or Javascript to create a responsive grid of videos. 

So far, right now the best plugin to be used with `MediaElement` for this task has been [Flexr](http://flexrgrid.com/).
________
[Back to Main](../README.md)
