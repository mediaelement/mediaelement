'use strict';

import window from 'global/window';

// Namespace
let mejs = {};

// version number
mejs.version = '3.0.0';

// Basic HTML5 settings
mejs.html5media = {
	/**
	 * @type {String[]}
	 */
	properties: [
		// GET/SET
		'volume', 'src', 'currentTime', 'muted',

		// GET only
		'duration', 'paused', 'ended',

		// OTHERS
		'error', 'currentSrc', 'networkState', 'preload', 'buffered', 'bufferedBytes', 'bufferedTime', 'readyState', 'seeking',
		'initialTime', 'startOffsetTime', 'defaultPlaybackRate', 'playbackRate', 'played', 'seekable', 'autoplay', 'loop', 'controls'
	],
	/**
	 * @type {String[]}
	 */
	methods: [
		'load', 'play', 'pause', 'canPlayType'
	],
	/**
	 * @type {String[]}
	 */
	events: [
		'loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'pause', 'loadedmetadata',
		'loadeddata', 'waiting', 'playing', 'canplay', 'canplaythrough', 'seeking', 'seeked', 'timeupdate', 'ended',
		'ratechange', 'durationchange', 'volumechange'
	],
	/**
	 * @type {String[]}
	 */
	mediaTypes: [
		'audio/mp3', 'audio/ogg', 'audio/oga', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/mpeg', 'audio/mp4',
		'video/mp4', 'video/webm', 'video/ogg'
	]
};

window.mejs = mejs;

export default mejs;