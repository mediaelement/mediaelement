'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import {secondsToTimeCode} from '../utils/time';

/**
 * Current/duration times
 *
 * This feature creates/updates the duration and progress times in the control bar, based on native events.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * The initial duration
	 * @type {Number}
	 */
	duration: 0,
	/**
	 * @type {String}
	 */
	timeAndDurationSeparator: '<span> | </span>'
});


Object.assign(MediaElementPlayer.prototype, {

	/**
	 * Current time constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {$} controls
	 * @param {$} layers
	 * @param {HTMLElement} media
	 */
	buildcurrent: function (player, controls, layers, media)  {
		const
			t = this,
			time = $(`<div class="${t.options.classPrefix}time" role="timer" aria-live="off">` +
				`<span class="${t.options.classPrefix}currenttime">${secondsToTimeCode(0, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength)}</span>` +
			`</div>`)
		;

		t.addControlElement(time, 'current');

		t.currenttime = t.controls.find(`.${t.options.classPrefix}currenttime`);

		media.addEventListener('timeupdate', () => {
			if (t.controlsAreVisible) {
				player.updateCurrent();
			}

		}, false);
	},

	/**
	 * Duration time constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {$} controls
	 * @param {$} layers
	 * @param {HTMLElement} media
	 */
	buildduration: function (player, controls, layers, media)  {

		const t = this;

		if (controls.children().last().find(`.${t.options.classPrefix}currenttime`).length > 0) {
			const duration = $(`${t.options.timeAndDurationSeparator}<span class="${t.options.classPrefix}duration">` +
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength)}</span>`);

			duration.appendTo(controls.find(`.${t.options.classPrefix}time`));

		} else {

			// add class to current time
			controls.find(`.${t.options.classPrefix}currenttime`).parent()
				.addClass(`${t.options.classPrefix}currenttime-container`);

			const duration = $(`<div class="${t.options.classPrefix}time ${t.options.classPrefix}duration-container">` +
				`<span class="${t.options.classPrefix}duration">` +
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength)}</span>` +
			`</div>`);

			t.addControlElement(duration, 'duration');
		}

		t.durationD = t.controls.find(`.${t.options.classPrefix}duration`);

		media.addEventListener('timeupdate', () => {
			if (t.controlsAreVisible) {
				player.updateDuration();
			}
		}, false);
	},

	/**
	 * Update the current time and output it in format 00:00
	 *
	 */
	updateCurrent: function ()  {
		const t = this;

		let currentTime = t.media.currentTime;

		if (isNaN(currentTime)) {
			currentTime = 0;
		}

		if (t.currenttime) {
			t.currenttime.html(secondsToTimeCode(currentTime, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength));
		}
	},

	/**
	 * Update the duration time and output it in format 00:00
	 *
	 */
	updateDuration: function ()  {
		const t = this;

		let duration = t.media.duration;

		if (isNaN(duration) || duration === Infinity || duration < 0) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}
		let timecode = secondsToTimeCode(duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength);
		/* Toggle long-video class if time code is >5 digits (MM:SS) */
		t.container.toggleClass(`${t.options.classPrefix}long-video`, timecode.length > 5);

		if (t.durationD && duration > 0) {
			t.durationD.html(timecode);
		}
	}
});


