# API and Configuration

* [Configuration](#development)
    * [Standalone](#standalone)
    * [MediaElementPlayer](#player)
* [API](#api)
    * [Properties](#properties)
    * [Methods](#methods)
    * [Events](#events)


<a id="configuration"></a>
## Configuration

<a id="standalone"></a>
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
// Extra configuration for YouTube <iframe>
youtubeIframeVars: {},
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
// custom error message in case media cannot be played; otherwise, Download File
// link will be displayed
customError: "",
success: function (mediaElement, domObject) { },
error: function () { }
```

<a id="player"></a>
### MediaElementPlayer

Including the above, `MediaElementPlayer` object allows the following extra configuration elements.

```javascript
// url to poster (to fix iOS 3.x)
poster: '',
// When the video is ended, we can show the poster.
showPosterWhenEnded: false,
// default if the <video width> is not specified
defaultVideoWidth: 480,
// default if the <video height> is not specified
defaultVideoHeight: 270,
// if set, overrides <video width>
videoWidth: -1,
// if set, overrides <video height>
videoHeight: -1,
// default if the user doesn't specify
defaultAudioWidth: 400,
// default if the user doesn't specify
defaultAudioHeight: 30,
// default amount to move back when back key is pressed
defaultSeekBackwardInterval: function(media) {
  return (media.duration * 0.05);
},
// default amount to move forward when forward key is pressed
defaultSeekForwardInterval: function(media) {
	return (media.duration * 0.05);
},
// set dimensions via JS instead of CSS
setDimensions: true,
// width of audio player
audioWidth: -1,
// height of audio player
audioHeight: -1,
// initial volume when the player starts (overrided by user cookie)
startVolume: 0.8,
// useful for <audio> player loops
loop: false,
// rewind to beginning when media ends
autoRewind: true,
// resize to media dimensions
enableAutosize: true,
/*
 * Time format to use. Default: 'mm:ss'
 * Supported units:
 *   h: hour
 *   m: minute
 *   s: second
 *   f: frame count
 * When using 'hh', 'mm', 'ss' or 'ff' we always display 2 digits.
 * If you use 'h', 'm', 's' or 'f' we display 1 digit if possible.
 *
 * Example to display 75 seconds:
 * Format 'mm:ss': 01:15
 * Format 'm:ss': 1:15
 * Format 'm:s': 1:15
 */
timeFormat: '',
// forces the hour marker (##:00:00)
alwaysShowHours: false,
// show framecount in timecode (##:00:00:00)
showTimecodeFrameCount: false,
// used when showTimecodeFrameCount is set to true
framesPerSecond: 25,
// automatically calculate the width of the progress bar based on the sizes of other elements
autosizeProgress : true,
// Hide controls when playing and mouse is not over the video
alwaysShowControls: false,
// Display the video control
hideVideoControlsOnLoad: false,
// Enable click video element to toggle play/pause
clickToPlayPause: true,
// force iPad's native controls
iPadUseNativeControls: false,
// force iPhone's native controls
iPhoneUseNativeControls: false,
// force Android's native controls
AndroidUseNativeControls: false,
// features to show
features: ['playpause','current','progress','duration','tracks','volume','fullscreen'],
// only for dynamic
isVideo: true,
// stretching modes (auto, fill, responsive, none)
stretching: 'auto',
// turns keyboard support on and off for this instance
enableKeyboard: true,
// whenthis player starts, it will pause other players
pauseOtherPlayers: true,
// array of keyboard actions such as play pause
// Accepts array of objects in format: {keys: [1,2,3...], action: function(player, media) { ... }}
keyActions: [...]
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
// Enable tooltip that shows time in progress bar
enableProgressTooltip: true,
// Specify the color of marker
markerColor: '#E9BC3D',
// Specify marker times in seconds 
markers: [],
// Callback function invoked when a marker position is reached
markerCallback: function(media, time) {}
// Customizable text elements
// NOTE: They won't be translated if set through here, unless the proper translation is added
playText: '',
pauseText: '',
tracksText: '',
postrollCloseText: '',
muteText: '',
allyVolumeControlText: '',
fullscreenText: '',
skipBackText: '',
sourcechooserText: '',
```

<a id="api"></a>
## API

MediaElementPlayer is a complete audio and video player, but you can also use just the MediaElement object which replaces `<video>` and `<audio>` with a Flash player that mimics the properties, methods, and events of HTML MediaElement API.

<a id="properties"></a>
### Properties
All properties are listed in https://www.w3.org/2010/05/video/mediaevents.html; they can be accessed through an instance of player as described [here](usage.md).

<a id="methods"></a>
### Methods

Method | Description
-------- | ------------
load() | Reload the audio/video element; also, it is used to update the audio/video element after changing the source or other settings
play() | Start playing the audio/video
pause() | Halt (pauses) the currently playing audio or video
stop() | **Only** present to support Flash RTMP streaming in MediaElementPlayer. The equivalent for other scenarios is "pause"
remove() | Destroy the video/audio player instance

**Note:** ```canPlayType()``` method is used internally and accounts for other types of media to be played (such as HLS, RTMP, etc.); ```addTextTrack()``` is replaced also with more code to manage clsoed captioning and tracks. For that reason, they are not listed.

<a id="events"></a>
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

For a more comprehensive list of events and more deatiled information about them, please check the [Event summary](https://www.w3.org/TR/html5/embedded-content-0.html#mediaevents) page.
________
[Back to Main](README.md)
