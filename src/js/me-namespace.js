/*!
* Media Element
* HTML5 <video> and <audio> shim and player
* http://mediaelementjs.com/
*
* Creates a JavaScript object that mimics HTML5 media object
* for browsers that don't understand HTML5 or can't play the provided codec
* Can also play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
*
* Copyright 2010, John Dyer
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/

// Namespace
var mejs = mejs || {};

// version number
mejs.version = '2.0.0';

// player number (for missing, same id attr)
mejs.meIndex = 0;

// media types accepted by plugins
mejs.plugins = {
	silverlight: [
		{version: [3,0], types: ['video/mp4','video/m4v','video/mov','video/wmv','audio/wma','audio/m4a','audio/mp3','audio/wav']}
	],
	flash: [
		{version: [9,0,124], types: ['video/mp4','video/m4v','video/mov','video/flv','audio/flv','audio/mp3','audio/m4a']}		
		//,{version: [11,0], types: ['video/webm'} // for future reference
	]
};