'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import i18n from '../core/i18n';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
import {NAV, IS_IE} from '../utils/constants';
import {typeChecks, absolutizeUrl} from '../utils/media';

/**
 * Shim that falls back to Flash if a media type is not supported.
 *
 * Any format not supported natively, including, RTMP, FLV, HLS and M(PEG)-DASH (if browser does not support MSE),
 * will play using Flash.
 */


/**
 * Core detector, plugins are added below
 *
 */
export const PluginDetector = {
	/**
	 * Cached version numbers
	 * @type {Array}
	 */
	plugins: [],

	/**
	 * Test a plugin version number
	 * @param {String} plugin - In this scenario 'flash' will be tested
	 * @param {Array} v - An array containing the version up to 3 numbers (major, minor, revision)
	 * @return {Boolean}
	 */
	hasPluginVersion: (plugin, v) => {
		const pv = PluginDetector.plugins[plugin];
		v[1] = v[1] || 0;
		v[2] = v[2] || 0;
		return (pv[0] > v[0] || (pv[0] === v[0] && pv[1] > v[1]) || (pv[0] === v[0] && pv[1] === v[1] && pv[2] >= v[2]));
	},

	/**
	 * Detect plugin and store its version number
	 *
	 * @see PluginDetector.detectPlugin
	 * @param {String} p
	 * @param {String} pluginName
	 * @param {String} mimeType
	 * @param {String} activeX
	 * @param {Function} axDetect
	 */
	addPlugin: (p, pluginName, mimeType, activeX, axDetect) => {
		PluginDetector.plugins[p] = PluginDetector.detectPlugin(pluginName, mimeType, activeX, axDetect);
	},

	/**
	 * Obtain version number from the mime-type (all but IE) or ActiveX (IE)
	 *
	 * @param {String} pluginName
	 * @param {String} mimeType
	 * @param {String} activeX
	 * @param {Function} axDetect
	 * @return {int[]}
	 */
	detectPlugin: (pluginName, mimeType, activeX, axDetect) => {

		let
			version = [0, 0, 0],
			description,
			ax
		;

		// Firefox, Webkit, Opera; avoid MS Edge since `plugins` cannot be accessed
		if (NAV.plugins !== null && NAV.plugins !== undefined && typeof NAV.plugins[pluginName] === 'object') {
			description = NAV.plugins[pluginName].description;
			if (description && !(typeof NAV.mimeTypes !== 'undefined' && NAV.mimeTypes[mimeType] && !NAV.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (let i = 0, total = version.length; i < total; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
			// Internet Explorer / ActiveX
		} else if (window.ActiveXObject !== undefined) {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			}
			catch (e) {
				console.log(e);
			}
		}
		return version;
	}
};

/**
 * Add Flash detection
 *
 */
PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', (ax) => {
	// adapted from SWFObject
	let
		version = [],
		d = ax.GetVariable("$version")
	;

	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

const FlashMediaElementRenderer = {

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		const flash = {};

		// store main variable
		flash.options = options;
		flash.id = mediaElement.id + '_' + flash.options.prefix;
		flash.mediaElement = mediaElement;

		// insert data
		flash.flashState = {};
		flash.flashApi = null;
		flash.flashApiStack = [];

		// mediaElements for get/set
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {

				// add to flash state that we will store
				flash.flashState[propName] = null;

				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				flash[`get${capName}`] = () => {

					if (flash.flashApi !== null) {

						if (flash.flashApi['get_' + propName] !== undefined) {
							const value = flash.flashApi['get_' + propName]();

							// special case for buffered to conform to HTML5's newest
							if (propName === 'buffered') {
								return {
									start: () => {
										return 0;
									},
									end: () => {
										return value;
									},
									length: 1
								};
							}

							return value;
						} else {
							return null;
						}

					} else {
						return null;
					}
				};

				flash[`set${capName}`] = (value) => {
					if (propName === 'src') {
						value = absolutizeUrl(value);
					}

					// send value to Flash
					if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
						flash.flashApi['set_' + propName](value);
					} else {
						// store for after "READY" event fires
						flash.flashApiStack.push({
							type: 'set',
							propName: propName,
							value: value
						});
					}
				};

			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		// add mediaElements for native methods
		const
			methods = mejs.html5media.methods,
			assignMethods = (methodName) => {

				// run the method on the native HTMLMediaElement
				flash[methodName] = () => {

					if (flash.flashApi !== null) {

						// send call up to Flash ExternalInterface API
						if (flash.flashApi[`fire_${methodName}`]) {
							try {
								flash.flashApi[`fire_${methodName}`]();
							} catch (e) {
								console.log(e);
							}

						} else {
							console.log('flash', 'missing method', methodName);
						}
					} else {
						// store for after "READY" event fires
						flash.flashApiStack.push({
							type: 'call',
							methodName: methodName
						});
					}
				};

			}
			;
		methods.push('stop');
		for (let i = 0, total = methods.length; i < total; i++) {
			assignMethods(methods[i]);
		}

		// give initial events like in others renderers
		const initEvents = ['rendererready'];

		for (let i = 0, total = initEvents.length; i < total; i++) {
			const event = createEvent(initEvents[i], flash);
			mediaElement.dispatchEvent(event);
		}

		// add a ready method that Flash can call to
		window[`__ready__${flash.id}`] = () => {

			flash.flashReady = true;
			flash.flashApi = document.getElementById(`__${flash.id}`);

			// do call stack
			if (flash.flashApiStack.length) {
				for (let i = 0, total = flash.flashApiStack.length; i < total; i++) {

					const stackItem = flash.flashApiStack[i];

					if (stackItem.type === 'set') {
						const
							propName = stackItem.propName,
							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`
						;

						flash[`set${capName}`](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			}
		};

		window[`__event__${flash.id}`] = (eventName, message) => {

			const event = createEvent(eventName, flash);
			event.message = message || '';

			// send event from Flash up to the mediaElement
			flash.mediaElement.dispatchEvent(event);
		};

		// insert Flash object
		flash.flashWrapper = document.createElement('div');

		// If the access script flag does not have any of the valid values, set to `sameDomain` by default
		if (!['always', 'sameDomain'].includes(flash.options.shimScriptAccess)) {
			flash.options.shimScriptAccess = 'sameDomain';
		}

		const
			autoplay = mediaElement.originalNode.autoplay,
			flashVars = [`uid=${flash.id}`, `autoplay=${autoplay}`, `allowScriptAccess=${flash.options.shimScriptAccess}`],
			isVideo = mediaElement.originalNode !== null && mediaElement.originalNode.tagName.toLowerCase() === 'video',
			flashHeight = (isVideo) ? mediaElement.originalNode.height : 1,
			flashWidth = (isVideo) ? mediaElement.originalNode.width : 1;

		if (mediaElement.originalNode.getAttribute('src')) {
			flashVars.push(`src=${mediaElement.originalNode.getAttribute('src')}`);
		}

		if (flash.options.enablePseudoStreaming === true) {
			flashVars.push(`pseudostreamstart=${flash.options.pseudoStreamingStartQueryParam}`);
			flashVars.push(`pseudostreamtype=${flash.options.pseudoStreamingType}`);
		}

		mediaElement.appendChild(flash.flashWrapper);

		if (mediaElement.originalNode !== null) {
			mediaElement.originalNode.style.display = 'none';
		}

		let settings = [];

		if (IS_IE) {
			const specialIEContainer = document.createElement('div');
			flash.flashWrapper.appendChild(specialIEContainer);

			settings = [
				'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
				'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"',
				`id="__${flash.id }"`,
				`width="${flashWidth}"`,
				`height="${flashHeight}"`
			];

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			specialIEContainer.outerHTML = `<object ${settings.join(' ')}>` +
				`<param name="movie" value="${flash.options.pluginPath}${flash.options.filename}?x=${new Date()}" />` +
				`<param name="flashvars" value="${flashVars.join('&amp;')}" />` +
				`<param name="quality" value="high" />` +
				`<param name="bgcolor" value="#000000" />` +
				`<param name="wmode" value="transparent" />` +
				`<param name="allowScriptAccess" value="${flash.options.shimScriptAccess}" />` +
				`<param name="allowFullScreen" value="true" />` +
				`<div>${i18n.t('mejs.install-flash')}</div>` +
			`</object>`;

		} else {

			settings = [
				`id="__${flash.id}"`,
				`name="__${flash.id}"`,
				'play="true"',
				'loop="false"',
				'quality="high"',
				'bgcolor="#000000"',
				'wmode="transparent"',
				`allowScriptAccess="${flash.options.shimScriptAccess}"`,
				'allowFullScreen="true"',
				'type="application/x-shockwave-flash"',
				'pluginspage="//www.macromedia.com/go/getflashplayer"',
				`src="${flash.options.pluginPath}${flash.options.filename}"`,
				`flashvars="${flashVars.join('&')}"`,
				`width="${flashWidth}"`,
				`height="${flashHeight}"`
			];

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			flash.flashWrapper.innerHTML = `<embed ${settings.join(' ')}>`;
		}

		flash.flashNode = flash.flashWrapper.lastChild;

		flash.hide = () => {
			if (isVideo) {
				flash.flashNode.style.display = 'none';
			}
		};
		flash.show = () => {
			if (isVideo) {
				flash.flashNode.style.display = '';
			}
		};
		flash.setSize = (width, height) => {
			flash.flashNode.style.width = `${width}px`;
			flash.flashNode.style.height = `${height}px`;

			if (flash.flashApi !== null && typeof flash.flashApi.fire_setSize === 'function') {
				flash.flashApi.fire_setSize(width, height);
			}
		};

		flash.destroy = () => {
			flash.flashNode.remove();
		};


		if (mediaFiles && mediaFiles.length > 0) {
			for (let i = 0, total = mediaFiles.length; i < total; i++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					flash.setSrc(mediaFiles[i].src);
					break;
				}
			}
		}

		return flash;
	}
};

const hasFlash = PluginDetector.hasPluginVersion('flash', [10, 0, 0]);

if (hasFlash) {

	/**
	 * Register media type based on URL structure if Flash is detected
	 *
	 */
	typeChecks.push((url) => {

		url = url.toLowerCase();

		if (url.startsWith('rtmp')) {
			if (url.includes('.mp3')) {
				return 'audio/rtmp';
			} else {
				return 'video/rtmp';
			}
		} else if (url.includes('.oga') || url.includes('.ogg')) {
			return 'audio/ogg';
		} else if (url.includes('.m3u8')) {
			return 'application/x-mpegURL';
		} else if (url.includes('.mpd')) {
			return 'application/dash+xml';
		} else if (url.includes('.flv')) {
			return 'video/flv';
		}else {
			return null;
		}

	});

	// VIDEO
	const FlashMediaElementVideoRenderer = {
		name: 'flash_video',

		options: {
			prefix: 'flash_video',
			filename: 'mediaelement-flash-video.swf',
			enablePseudoStreaming: false,
			// start query parameter sent to server for pseudo-streaming
			pseudoStreamingStartQueryParam: 'start',
			// pseudo streaming type: use `time` for time based seeking (MP4) or `byte` for file byte position (FLV)
			pseudoStreamingType: 'byte'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: (type) => ['video/mp4', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4', 'video/flv',
			'video/x-flv'].includes(type.toLowerCase()),

		create: FlashMediaElementRenderer.create

	};
	renderer.add(FlashMediaElementVideoRenderer);

	// HLS
	const FlashMediaElementHlsVideoRenderer = {
		name: 'flash_hls',

		options: {
			prefix: 'flash_hls',
			filename: 'mediaelement-flash-video-hls.swf'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: (type) => ['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls',
			'video/hls'].includes(type.toLowerCase()),

		create: FlashMediaElementRenderer.create
	};
	renderer.add(FlashMediaElementHlsVideoRenderer);

	// M(PEG)-DASH
	const FlashMediaElementMdashVideoRenderer = {
		name: 'flash_dash',

		options: {
			prefix: 'flash_dash',
			filename: 'mediaelement-flash-video-mdash.swf'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: (type) => ['application/dash+xml'].includes(type.toLowerCase()),

		create: FlashMediaElementRenderer.create
	};
	renderer.add(FlashMediaElementMdashVideoRenderer);

	// AUDIO
	const FlashMediaElementAudioRenderer = {
		name: 'flash_audio',

		options: {
			prefix: 'flash_audio',
			filename: 'mediaelement-flash-audio.swf'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: (type) => ['audio/mp3'].includes(type.toLowerCase()),

		create: FlashMediaElementRenderer.create
	};
	renderer.add(FlashMediaElementAudioRenderer);

	// AUDIO - ogg
	const FlashMediaElementAudioOggRenderer = {
		name: 'flash_audio_ogg',

		options: {
			prefix: 'flash_audio_ogg',
			filename: 'mediaelement-flash-audio-ogg.swf'
		},
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Boolean}
		 */
		canPlayType: (type) => ['audio/ogg', 'audio/oga', 'audio/ogv'].includes(type.toLowerCase()),

		create: FlashMediaElementRenderer.create
	};
	renderer.add(FlashMediaElementAudioOggRenderer);
}