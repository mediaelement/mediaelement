// 'use strict';
//
// import {config} from '../player';
// import MediaElementPlayer from '../player';
// import {renderer} from '../core/renderer';
//
// /**
//  * VR support
//  *
//  * This feature loads the proper libraries to use VR videos.
//  */
//
//
// // Feature configuration
// Object.assign(config, {
// 	/**
// 	 * @type {Boolean}
// 	 */
// 	supportVR: false,
// 	/**
// 	 * https://developers.google.com/vr/concepts/vrview-web#vr_view
// 	 */
// 	vr: {
// 		image: '',
// 		is_stereo: true,
// 		is_autopan_off: true,
// 		is_debug: false,
// 		is_vr_off: false,
// 		default_yaw: 0,
// 		is_yaw_only: false
// 	}
// });
//
// Object.assign(MediaElementPlayer.prototype, {
//
// 	/**
// 	 * Feature constructor.
// 	 *
// 	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
// 	 * @param {MediaElementPlayer} player
// 	 * @param {$} controls
// 	 * @param {$} layers
// 	 * @param {HTMLElement} media
// 	 */
// 	buildvr: function (player, controls, layers, media) {
//
// 		let t = this;
//
// 		if (!t.isVideo || !t.options.supportVR || (t.isVideo && t.media.rendererName !== null &&
// 			!t.media.rendererName.match(/(native|html5)/))) {
// 			return;
// 		}
//
// 		let
// 			url = media.getSrc(),
// 			mediaFiles = [{src: url, type: mejs.Utility.getTypeFromFile(url)}]
// 		;
//
// 		let renderInfo = renderer.select(mediaFiles, ['vr']);
// 		media.changeRenderer(renderInfo.rendererName, mediaFiles);
// 	}
// });
