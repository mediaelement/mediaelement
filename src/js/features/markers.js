'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';

/**
 * Markers plugin
 *
 * This feature allows you to add Visual Cues in the progress time rail.
 * This plugin also lets you register a custom callback function that will be called every time the play position reaches a marker.
 * Marker position and a reference to the MediaElement Player object is passed to the registered callback function for
 * any post processing. Marker color is configurable.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * Default marker color
	 * @type {String}
	 */
	markerColor: '#E9BC3D',
	/**
	 * @type {Number[]}
	 */
	markers: [],
	/**
	 * @type {Function}
	 */
	markerCallback: function ()  {
	}
});

Object.assign(MediaElementPlayer.prototype, {
	/**
	 * Feature constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {$} controls
	 * @param {$} layers
	 * @param {HTMLElement} media
	 */
	buildmarkers: function (player, controls, layers, media)  {

		if (!player.options.markers.length) {
			return;
		}

		let
			t = this,
			currentPos = -1,
			currentMarker = -1,
			lastPlayPos = -1, // Track backward seek
			lastMarkerCallBack = -1 // Prevents successive firing of callbacks
		;

		for (let i = 0, total = player.options.markers.length; i < total; ++i) {
			controls.find(`.${t.options.classPrefix}time-total`)
				.append('<span class="' + `${t.options.classPrefix}time-marker"></span>`);
		}

		media.addEventListener('durationchange', () => {
			player.setmarkers(controls);
		});
		media.addEventListener('timeupdate', () => {
			currentPos = Math.floor(media.currentTime);
			if (lastPlayPos > currentPos) {
				if (lastMarkerCallBack > currentPos) {
					lastMarkerCallBack = -1;
				}
			} else {
				lastPlayPos = currentPos;
			}

			if (player.options.markers.length) {
				for (let i = 0; i < player.options.markers.length; ++i) {
					currentMarker = Math.floor(player.options.markers[i]);
					if (currentPos === currentMarker && currentMarker !== lastMarkerCallBack) {
						player.options.markerCallback(media, media.currentTime); //Fires the callback function
						lastMarkerCallBack = currentMarker;
					}
				}
			}

		}, false);

	},
	/**
	 * Create markers in the progress bar
	 *
	 * @param {$} controls
	 */
	setmarkers: function (controls)  {
		let
			t = this,
			left
		;

		for (let i = 0, total = t.options.markers.length; i < total; ++i) {
			if (Math.floor(t.options.markers[i]) <= t.media.duration && Math.floor(t.options.markers[i]) >= 0) {
				left = 100 * Math.floor(t.options.markers[i]) / t.media.duration;
				$(controls.find(`.${t.options.classPrefix}time-marker`)[i]).css({
					'width': '1px',
					'left': `${left}%`,
					'background': t.options.markerColor
				});
			}
		}

	}
});