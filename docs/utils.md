# Utilities/Features

* [Utilities](#utils)
	* [DOM](#dom)
	* [General](#general)
	* [Media](#media)
	* [Time](#time)
* [Features](#features)

<a id="utils"></a>
## Utilities
All the utilities can be accessed through the `mejs.Utils.{name}` element.

<a id="dom"></a>
### DOM
`MediaElement.js` has already polyfills to use some of the methods that jQuery provided for matching/manipulating/AJAX-calling DOM.

However, some of those methods are not possible to match natively, so `MediaElement.js` has created them.

Method | Description
------ | --------
offset(element) |  Obtain the `top` and `left` coordinates of `element`
hasClass(element, className) | Check if `element` has the `className` class defined
addClass(element, className) | Add the `className` class to `element`
removeClass(element, className) | Remove the `className` class to `element`
toggleClass(element, className) | Add/remove `className` class from `element`
fadeIn(element, duration, callback) | Show `element` within a certain `duration` time (default: `400`), and once it is shown, execute `callback` (if any)
fadeOut(element, duration, callback) | Hide `element` within a certain `duration` time (default: `400`), and once it is hidden, execute `callback` (if any)
siblings(element, filter) | Obtain all the siblings from `element` based on `filter` selector (if any)
visible(element) | Check if `element` is visible; this goes beyond checking if element has `display: none`, since also `visibility: hidden` is considered as not visible
ajax(url, dataType, success, error) | Wrapper to execute an AJAX request to a certain `url`, specifying its `type` (`text`, `html`, `json`, `xml`) and execute either `success` or `error` callbacks

<a id="general"></a>
### General

Sometimes, common tasks like escaping HTML or checking if a value is a certain type, are needed. `MediaElement.js` has also implemented some methods to achieve them.

Method | Description
------ | --------
escapeHTML(input) | Escape `&, <, >, "` characters from `input` to avoid XSS attacks
debounce(callback, wait, immediate) | Execute `callback` in a specific period of `wait` time, or bypasses the time if `immediate` is `true` (default: `false`)
isObjectEmpty(object) | Check if `object` is empty
splitEvents(events, id) | Split a string of `events` separated by spaces into `document` (d) and `window` (w) events. An `id` can be passed to append a namespace
createEvent(eventName, target) | Wrapper of `CustomEvent` class to create a event, passing a `eventName` and a possible `target`
isNodeAfter(sourceNode, targetNode) | Check if `targetNode` appears after `sourceNode` in the DOM
isString(input) | Determine if an `input` value is a string

<a id="media"></a>
### Media

Method | Description
------ | --------
absolutizeUrl(path) | Append the full URL of a given `path`
formatType(url, type) | Obtain the format of a specific media, based on `url` and additionally its MIME `type`
getMimeFromType(type) | Obtain the correct MIME part of the `type` in case the attribute contains a codec (`video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`)
getTypeFromFile(url) | Obtain the type of media based on `url` structure
getExtension(url) | Obtain media file extension from `url`
normalizeExtension(extension) | Obtain the standard extension of a media `extension`


<a id="time"></a>
### Time

Method | Description
------ | --------
secondsToTimeCode(time, forceHours, showFrameCount, fps, secondsDecimalLength) | Format a numeric `time` in format '00:00:00', potentially showing hours if `forceHours` is set to `true`, and the frame count if `showFrameCount` is `true`. Also, frames per second (`fps`, by default `25`) can be specified, and also the number of decimals to display if any (`secondsDecimalLength`)
timeCodeToSeconds(time, fps) | Convert a '00:00:00' `time` string into seconds. Also, frames per second (`fps`, by default `25`) can be specified
calculateTimeFormat(time, options, fps) | Calculate the time format to use given the player `options`. The `time` argument ideally should be a number, but if not, it will default to `0`. Also, frames per second (`fps`, by default `25`) can be specified
convertSMPTEtoSeconds(SMPTE) | Convert a Society of Motion Picture and Television Engineers (`SMTPE`) time code into seconds

<a id="features"></a>
## Features

`MediaElement.js` has some flags/methods to determine which browser the user is in, some elements to determine the type of fullscreen the browser supports, etc.

All of these elements can be accessed by using `mejs.Features.{name}`. The following list shows all the possible features.

* mejs.Features.isiPad
* mejs.Features.isiPhone
* mejs.Features.isiOS
* mejs.Features.isAndroid
* mejs.Features.isIE
* mejs.Features.isEdge
* mejs.Features.isChrome
* mejs.Features.isFirefox
* mejs.Features.isSafari
* mejs.Features.isStockAndroid
* mejs.Features.hasMSE
* mejs.Features.supportsNativeHLS
* mejs.Features.supportsPointerEvents
* mejs.Features.hasiOSFullScreen
* mejs.Features.hasNativeFullscreen
* mejs.Features.hasWebkitNativeFullScreen
* mejs.Features.hasMozNativeFullScreen
* mejs.Features.hasMsNativeFullScreen
* mejs.Features.hasTrueNativeFullScreen
* mejs.Features.nativeFullScreenEnabled
* mejs.Features.fullScreenEventName
* mejs.Features.isFullScreen()
* mejs.Features.requestFullScreen()
* mejs.Features.cancelFullScreen()
