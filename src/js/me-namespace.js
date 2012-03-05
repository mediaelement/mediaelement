// Namespace
var mejs = mejs || {};

// version number
mejs.version = '2.7.0';

// player number (for missing, same id attr)
mejs.meIndex = 0;

// media types accepted by plugins
mejs.plugins = {
	silverlight: [
		{version: [3,0], types: ['video/mp4','video/m4v','video/mov','video/wmv','audio/wma','audio/m4a','audio/mp3','audio/wav','audio/mpeg']}
	],
	flash: [
		{version: [9,0,124], types: ['video/mp4','video/m4v','video/mov','video/flv','video/x-flv','audio/flv','audio/x-flv','audio/mp3','audio/m4a','audio/mpeg']}
		//,{version: [12,0], types: ['video/webm']} // for future reference (hopefully!)
	],
	youtube: [
		{version: null, types: ['video/youtube']}
	],
	vimeo: [
		{version: null, types: ['video/vimeo']}
	]
};