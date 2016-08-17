# API and Configuration Parameters

## Configuration

### Standalone

As a standalone library, _MediaElement.js_ can be configured using the following settings.

```javascript
// allows testing on HTML5, flash, silverlight
// auto: attempts to detect what the browser can do
// auto_plugin: prefer plugins and then attempt native HTML5
// native: forces HTML5 playback
// shim: disallows HTML5, will attempt either Flash or Silverlight
// none: forces fallback view
mode: 'auto',
// remove or reorder to change plugin priority and availability
plugins: ['flash','silverlight','youtube','vimeo'],
// shows debug errors on screen
enablePluginDebug: false,
// use plugin for browsers that have trouble with Basic Authentication on HTTPS sites
httpsBasicAuthSite: false,
// overrides the type specified, useful for dynamic instantiation
type: '',
// path to Flash and Silverlight plugins
pluginPath: mejs.Utility.getScriptPath(['mediaelement.js','mediaelement.min.js','mediaelement-and-player.js','mediaelement-and-player.min.js']),
// name of flash file
flashName: 'flashmediaelement.swf',
// streamer for RTMP streaming
flashStreamer: '',
// set to 'always' for CDN version
flashScriptAccess: 'sameDomain',	
// turns on the smoothing filter in Flash
enablePluginSmoothing: false,
// enabled pseudo-streaming (seek) on .mp4 files
enablePseudoStreaming: false,
// start query parameter sent to server for pseudo-streaming
pseudoStreamingStartQueryParam: 'start',
// name of silverlight file
silverlightName: 'silverlightmediaelement.xap',
// default if the <video width> is not specified
defaultVideoWidth: 480,
// default if the <video height> is not specified
defaultVideoHeight: 270,
// overrides <video width>
pluginWidth: -1,
// overrides <video height>
pluginHeight: -1,
// additional plugin variables in 'key=value' form
pluginVars: [],	
// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
// larger number is less accurate, but less strain on plugin->JavaScript bridge
timerRate: 250,
// initial volume for player
startVolume: 0.8,
success: function (mediaElement, domObject) { },
error: function () { }
```

### MediaElementPlayer

Including the above, `MediaElementPlayer` object allows the following extra configuration elements.

```javascript
// Start point to detect changes on media time duration
duration: -1,
// Separator between the current time and the total duration of media being played
timeAndDurationSeparator: '<span> | </span>',
// Touch devices (specially mobile devices) have different way to handle volume, 
// so no need to display it
hideVolumeOnTouchDevices: true,
// Position of volume slider on audio element
audioVolume: 'horizontal',
// Position of volume slider on video element
videoVolume: 'vertical',
// Flag to activate detection of Pointer events when on fullscreen mode
usePluginFullScreen: true,
// Enable speeding media; accounts for strings or objects like
// [{name: 'Slow', value: '0.75'}, {name: 'Normal', value: '1.00'}, ...]
speeds: ['2.00', '1.50', '1.25', '1.00', '0.75'],
// Initial speed of media
defaultSpeed: '1.00',	
// Character used to stop speeding media
speedChar: 'x',
// Automatically turn on a <track>
startLanguage: '',
// By default, no WAI-ARIA live region - don't make a
// screen reader speak captions over an audio track.
tracksAriaLive: false,
// Option to remove the [cc] button when no <track kind="subtitles"> are present
hideCaptionsButtonWhenEmpty: true,
// If true and we only have one track, change captions to popup
toggleCaptionsButtonWhenOnlyOne: false,
// #id or .class
slidesSelector: '',
// Milliseconds to skip back media
skipBackInterval: 30,
// The following items are set for accessibility purposes in different elements of the player
playText: mejs.i18n.t('Play'),
pauseText: mejs.i18n.t('Pause'),
stopText: mejs.i18n.t('Stop'),
tracksText: mejs.i18n.t('Captions/Subtitles'),
postrollCloseText: mejs.i18n.t('Close'),
progessHelpText: mejs.i18n.t('Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.'),
allyVolumeControlText: mejs.i18n.t('Use Up/Down Arrow keys to increase or decrease volume.'),
muteText: mejs.i18n.t('Mute Toggle'),
fullscreenText: mejs.i18n.t('Fullscreen'),
skipBackText: mejs.i18n.t('Skip back %1 seconds'), // %1 will be replaced with skipBackInterval in this string
```

## API

MediaElementPlayer is a complete audio and video player, but you can also use just the MediaElement object which replaces `<video>` and `<audio>` with a Flash player that mimics the properties, methods, and events of HTML MediaElement API.

### Properties
All properties are listed in https://www.w3.org/2010/05/video/mediaevents.html; they can be accessed through an instance of player as described [here](README.md#user-content-3-startup).

### Methods

Method | Description
-------- | ------------
load | Reload the audio/video element; also, it is used to update the audio/video element after changing the source or other settings
play | Start playing the audio/video
pause | Halt (pauses) the currently playing audio or video
stop | **Only** present to support Flash RTMP streaming in MediaElementPlayer. The equivalent for other scenarios is "pause"

**Note:** canPlayType() method is used internally and accounts for other types of media to be played (such as HLS, RTMP, etc.); addTextTrack() is replaced also with more code to manage clsoed captioning and tracks. For that reason, they are not listed.

### Events

Event | Action(s) executed when...
----- | ----------- 
loadeddata | Media data is loaded
loadedmetadata | Meta data (like dimensions and duration) are loaded
progress | Browser is in the process of getting the media data
timeupdate | The playing position has changed (like when the user fast forwards to a different point in the media)
seeked | The seeking attribute is set to false indicating that seeking has ended
canplay | A file is ready to start playing (when it has buffered enough to begin)
play | The media is ready to start playing
playing	| The media actually has started playing
pause | The media is paused either by the user or programmatically
ended | The media has reach the end (a useful event for messages like "thanks for listening")
volumechange | Volume is changed (including setting the volume to "mute")
