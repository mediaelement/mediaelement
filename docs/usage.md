# Usage

* [Initialize player](#initialize)
	* [Automatic start](#automatic)
	* [Vanilla JavaScript](#vanilla)
	* [jQuery](#jquery)
	* [NPM/Meteor](#npm-meteor)
	* [RequireJS](#requirejs)
	* [React](#react)
* [Use Renderers](#renderers-usage)
* [Use `stretching` modes](#stretching-modes)
* [Responsive grid](#grid)
* [Setting new captions](#captions)
* [Destroy player](#destroy)


<a id="initialize"></a>
## Initialize player

You can use this as a standalone library if you wish, or just stick with the full MediaElementPlayer.
**IMPORTANT:** If you use `flash_video` renderer, it's always recommended to use `media.load()` inside the `success` callback to ensure that RTMP and FLV will play properly. 

## Standalone
```html
<script>
	// You can use either a string for the player ID (i.e., `player`), 
	// or `document.querySelector()` for any selector
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
	// You can use either a string for the player ID (i.e., `player`), 
	// or `document.querySelector()` for any selector
	var player = new MediaElementPlayer('player', {
		pluginPath: "/path/to/shims/",
	// When using `MediaElementPlayer`, an `instance` argument
	// is available in the `success` callback
		success: function(mediaElement, originalNode, instance) {
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
	// When using jQuery's `mediaelementplayer`, an `instance` argument
	// is available in the `success` callback
		success: function(mediaElement, originalNode, instance) {
			// do things
		}
	});
</script>
```

<a id="npm-meteor"></a>
### NPM/Meteor
```javascript
// To import only MediaElement class
import 'mediaelement/standalone';

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
import 'mediaelement'; // or import `mediaelement/standalone` if you only want the shim but not the full player;
```

<a id="requirejs"></a>
### RequireJS
With `Require.js`, you will need the following setup if you are planning to use HLS, M(PEG)-DASH or FLV, given the way the packages are bundled.

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
        	// If you only need the shim and not the player, use
        	//'path/to/mediaelement': {deps: ['require'], exports: "MediaElement"}
        	'path/to/mediaelement-and-player': {deps: ['require'], exports: "MediaElementPlayer"}
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


<a id="react"></a>
### React
With `React.js`, you will need to install the external libraries the same way as `Require`.

Once installed through NPM, you will be able to create your component using `MediaElement`. As an example:

**MediaElement.js**
```javascript
import React, { Component } from 'react';
import flvjs from 'flv.js';
import hlsjs from 'hls.js';
import 'mediaelement';

// Import stylesheet and shims
import 'mediaelement/build/mediaelementplayer.min.css';
import 'mediaelement/build/mediaelement-flash-video.swf';

export default class MediaElement extends Component {

	state = {}

	success(media, node, instance) {
		// Your action when media was successfully loaded
	}

	error(media) {
		// Your action when media had an error loading
	}

	render() {

		const
			props = this.props,
			sources = JSON.parse(props.sources),
			tracks = JSON.parse(props.tracks),
			sourceTags = [],
			tracksTags = []
		;

		for (let i = 0, total = sources.length; i < total; i++) {
			const source = sources[i];
			sourceTags.push(`<source src="${source.src}" type="${source.type}">`);
		}

		for (let i = 0, total = tracks.length; i < total; i++) {
			const track = tracks[i];
			tracksTags.push(`<track src="${track.src}" kind="${track.kind}" srclang="${track.lang}"${(track.label ? ` label=${track.label}` : '')}>`);
		}

		const
			mediaBody = `${sourceTags.join("\n")}
				${tracksTags.join("\n")}`,
			mediaHtml = props.mediaType === 'video' ?
				`<video id="${props.id}" width="${props.width}" height="${props.height}"${(props.poster ? ` poster=${props.poster}` : '')}
					${(props.controls ? ' controls' : '')}${(props.preload ? ` preload="${props.preload}"` : '')}>
					${mediaBody}
				</video>` :
				`<audio id="${props.id}" width="${props.width}" controls>
					${mediaBody}
				</audio>`
		;

		return (<div dangerouslySetInnerHTML={{__html: mediaHtml}}></div>);

	}

	componentDidMount() {

		const {MediaElementPlayer} = global;
		
		if (!MediaElementPlayer) {
			return;
		}

		const options = Object.assign({}, JSON.parse(this.props.options), {
			// Read the Notes below for more explanation about how to set up the path for shims
			pluginPath: './static/media/',
			success: (media, node, instance) => this.success(media, node, instance),
			error: (media, node) => this.error(media, node)
		});
		
		window.flvjs = flvjs;
		window.Hls = hlsjs;
		this.setState({player: new MediaElementPlayer(this.props.id, options)});
	}

	componentWillUnmount() {
		if (this.state.player) {
			this.state.player.remove();
			this.setState({player: null});
		}
	}
}
```

So you can use your component like as follows.

**App.js**
```javascript
import React, { Component } from 'react';
import './App.css';
import MediaElement from './MediaElement';

export default class App extends Component {

	// Other code

	render() {
		const
			sources = [
				{src: 'http://www.streambox.fr/playlists/test_001/stream.m3u8', type: 'application/x-mpegURL'},
				{src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4'},
				{src: 'rtmp://firehose.cul.columbia.edu:1935/vod/mp4:sample.mp4', type: 'video/rtmp'}
			],
			config = {},
			tracks = {}
		;

		return (
		<MediaElement
		   id="player1"
		   mediaType="video"
		   preload="none"
		   controls
		   width="640"
		   height="360"
		   poster=""
		   sources={JSON.stringify(sources)}
		   options={JSON.stringify(config)}
		   tracks={JSON.stringify(tracks)}
		/>);
	}
}
```

**IMPORTANT NOTES**
* If you want to support Flash renderers, you **MUST** activate a file loader in WebPack's configuration file in order to send the shims to the correct location (`./static/media/` in the example above). Something like this:
```javascript
module: {
	// All previous code
	loaders: [
		// All previous loaders
		{
			test: /\.swf$/,
			loader: 'file',
			query: {
					name: 'static/media/[name].[ext]'
			}
		}
	]
}
```
* For other renderers that cannot be installed through NPM, such as YouTube, you might need to load their script through `componentDidMount` method:
```javascript
componentDidMount() {
	let loaded = false;
	if (!loaded) {
		const tag = document.createElement('script');
		tag.src = '//www.youtube.com/player_api';
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		loaded = true;
	}
}
```

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

`MediaElement` can invoke methods from the current renderer's API. An example using native HLS:
```javascript
$('video').mediaelementplayer({
	pluginPath: '../build/',
	// All the config related to HLS
	hls: {
		debug: true
	},
	// More configuration parameters...

	success: function(media, node, instance) {
		// Use the conditional to detect if you are using `native_hls` renderer for that given media;
		// otherwise, you don't need it
		if (Hls !== undefined) {
			media.addEventListener(Hls.Events.MEDIA_ATTACHED, function () {
				// All the code when this event is reached...
				console.log('Media attached!');
			});

			// Manifest file was parsed, invoke loading method
			media.addEventListener(Hls.Events.MANIFEST_PARSED, function () {
				// All the code when this event is reached...
				console.log('Manifest parsed!');

			});

			media.addEventListener(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {
				// All the code when this event is reached...
				console.log(data);
			});
		}
	}
});
```
<a id="renderers-list"></a>
Below are listed the renderers with their IDs and player instance to execute other methods from APIs.

Renderer | ID | Reference | MIME Type(s)
--- | -- | --- | ---
Native video/audio | `html5` | --- | video/mp4, audio/mp4, video/webm, audio/mpeg, audio/mp3, audio/ogg, audio/oga, video/ogg
HLS native | `native_hls` | [`hls.js` API](https://github.com/dailymotion/hls.js/blob/master/doc/API.md) | application/x-mpegURL, vnd.apple.mpegURL
M(PEG)-DASH native | `native_dash` | [`dash.js` Documentation](http://cdn.dashjs.org/latest/jsdoc/index.html) | application/dash+xml
FLV native | `native_flv` | [`flv.js` API](https://github.com/Bilibili/flv.js/blob/master/docs/api.md) | video/flv
SoundCloud | `soundcloud_iframe` | [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget) | video/soundcloud, video/x-soundcloud
Facebook | `facebook` | --- | video/facebook, video/x-facebook
Vimeo | `vimeo_iframe` | [Vimeo Player API](https://github.com/vimeo/player.js) | video/vimeo, video/x-vimeo
YouTube | `youtube_iframe` | [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) | video/youtube, video/x-youtube
DailyMotion | `dailymotion_iframe` | [Dailymotion Player API](https://developer.dailymotion.com/player#player-api) | video/dailymotion, video/x-dailymotion
Twitch | `twitch_iframe` | [Twitch Emded API](https://github.com/justintv/Twitch-API/blob/master/embed-video.md) | video/twitch, video/x-twitch
Video shim  | `flash_video` | --- | video/mp4, video/rtmp, audio/rtmp, rtmp/mp4, audio/mp4
Audio shim | `flash_audio` | --- | audio/mp3
OGG Audio shim  | `flash_audio_ogg` | --- | audio/ogg, audio/oga
HLS shim | `flash_hls` | [FlasHLS Events](https://github.com/mangui/flashls/blob/dev/API.md) | application/x-mpegURL, vnd.apple.mpegURL
M(PEG)-DASH shim | `flash_dash` | --- |application/dash+xml

To know how well-supported are each one of the formats, visit http://caniuse.com/

**IMPORTANT NOTES** 
1. Only renderers prefixed as __native__, YouTube, and Flash shim, are integrated by default on the player. The rest of the renderers are stored in the `build/renderers` folder.
2. For `flash_hls`, you can use the events listed on https://github.com/mangui/flashls/blob/dev/API.md by prepending __on__ followed by the event name in camelcase notation; 
i.e., to call `FRAGMENT_PLAYING`, you need to write `onFragmentPlaying` on JS. The events that return objects will have the info in the `data` attribute of the object; the rest, on the `message` attribute. 


**Notes**
* Support for `wmv` and `wma` has been dropped since most of the major players are not supporting it as well.
* `ogg` formats will not play consistently in all browsers so it is strongly recommended a MP3 fallback for audio, or MP4 for video.
* `wav` and `webm` formats will only play on Browsers that support it natively since there is currently no Flash fallback to allow them to play in other browsers.
* `flv` and `mpd` will not work on iOS since it doesn't support MSE; for `mpd` use a `m3u8` fallback.
* Soundcloud can play with `html5` renderer using the following URL format: `https://api.soundcloud.com/tracks/XXX/stream?client_id=XXX`


<a id="streching-modes"></a>
## Use `stretching` modes

`MediaElementPlayer` accepts 4 different stretching modes. The following table describes how to set each one of them.

Mode |  Setup
---- | -------
auto | Mode by default, this mode checks if there are any elements in the `video`/`audio` tag to turn the _responsive_ mode; if not, will set it up in _none_ mode.
responsive | Can be turned on by setting `max-width: 100%` style (inline, or in the stylesheet), or `width="100%" height="100%"` attributes in the `video`/`audio` tag. In Javascript, set in the player's configuration `stretching: 'responsive'` (preferred) or `videoWidth: '100%' videoHeight: '100%'`.
fill | This mode will crop the video to adapt it to the dimensions of the parent container by only setting up `stretching: 'fill'`. It is encouraged to set up the parent's `height` to `100%` to make it work as expected.
none | Use `width` and `height` attributes specified in the `video`/`audio` tags and no `max-width: 100%` or `width="100%" height="100%"` attributes; otherwise, use the `stretching: 'none'` configuration element to achieve this.


<a id="grid"></a>
## Responsive grid

Since `MediaElement` can adapt its size to be responsive, some might be tempted to use CSS or Javascript to create a responsive grid of videos.

So far, right now the best plugin to be used with `MediaElement` for this task has been [Flexr](http://flexrgrid.com/).


<a id="captions"></a>
## Setting new captions

With `MediaElementPlayer`, the way to do it is just setting the new values for required attributes (`srclang`, `kind` and `src`) and optionally, `label`,
in the `track` tags for all browsers **EXCEPT Safari Desktop**.

With Safari Desktop in its latest version, due to a keyboard trap issue generated when appending the original `video` tag containing `track` element during the construction
of the player, it is necessary to create `track` tags with the attributes specified above, and override the `trackFiles` array.
```javascript
var player = new MediaElementPlayer('#player');

const track = document.createElement('track');
track.kind = 'subtitles';
track.label = 'English';
track.src = '/path/to/captions.vtt';
track.srclang = 'en';

// In this example, we are assuming there is only one `track` tag;
// if there are more, implement your logic to override the necessary one(s)
if (player.trackFiles !== null) {
	player.trackFiles = [track];
}
```

Once you set up the new values for the track attributes, or defined the workflow for Safari, it is required to register the new track(s) as follows:
```javascript
player.findTracks();
// This way we are ensuring ALL tracks are being loaded, starting from the first one
player.loadTrack(0);
// Set the default language using the ID of the language.
// Check the radio buttons generated by the player to see the ID you want to set, or use `none`
player.setTrack('mep_0_track_0_subtitles_en');
```

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
// 	$(this).remove();
// });
```

Same code can be used for `<audio>` elements.

________
[Back to Main](../README.md)
