'use strict';

import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import {secondsToTimeCode} from '../utils/time';
import {addClass, toggleClass} from '../utils/dom';

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
	buildcurrent (player, controls, layers, media)  {
		const
			t = this,
			time = document.createElement('div')
		;

		time.className = `${t.options.classPrefix}time`;
		time.setAttribute('role', 'timer');
		time.setAttribute('aria-live', 'off');
		time.innerHTML = `<span class="${t.options.classPrefix}currenttime">${secondsToTimeCode(0, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength)}</span>`;

		t.addControlElement(time, 'current');

		media.addEventListener('timeupdate', () => {
			if (t.controlsAreVisible) {
				player.updateCurrent();
			}

		});
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
	buildduration (player, controls, layers, media)  {

		const
			t = this,
			currTime = controls.lastChild.querySelector('.' + t.options.classPrefix + 'currenttime')
		;

		if (currTime) {
			controls.querySelector(`.${t.options.classPrefix}time`).innerHTML +=
				`${t.options.timeAndDurationSeparator}<span class="${t.options.classPrefix}duration">` +
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength)}</span>`;

		} else {

			// add class to current time
			if (controls.querySelector(`.${t.options.classPrefix}currenttime`)) {
				addClass(controls.querySelector(`.${t.options.classPrefix}currenttime`).parentNode, `${t.options.classPrefix}currenttime-container`);
			}

			const duration = document.createElement('div');
			duration.className = `${t.options.classPrefix}time ${t.options.classPrefix}duration-container`;
			duration.innerHTML = `<span class="${t.options.classPrefix}duration">` +
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength)}</span>`;

			t.addControlElement(duration, 'duration');
		}

		media.addEventListener('timeupdate', () => {
			if (t.controlsAreVisible) {
				player.updateDuration();
			}
		});
	},

	/**
	 * Update the current time and output it in format 00:00
	 *
	 */
	updateCurrent ()  {
		const t = this;

		let currentTime = t.media.currentTime;

		if (isNaN(currentTime)) {
			currentTime = 0;
		}

		if (t.controls.querySelector(`.${t.options.classPrefix}currenttime`)) {
			t.controls.querySelector(`.${t.options.classPrefix}currenttime`).innerText = secondsToTimeCode(currentTime, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength);
		}
	},

	/**
	 * Update the duration time and output it in format 00:00
	 *
	 */
	updateDuration ()  {
		const t = this;

		let duration = t.media.duration;

		if (isNaN(duration) || duration === Infinity || duration < 0) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}

		const timecode = secondsToTimeCode(duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength);

		// Toggle long-video class if time code is >5 digits (MM:SS)
		if (timecode.length > 5) {
			toggleClass(t.container, `${t.options.classPrefix}long-video`);
		}

		if (t.controls.querySelector(`.${t.options.classPrefix}duration`) && duration > 0) {
			t.controls.querySelector(`.${t.options.classPrefix}duration`).innerHTML = timecode;
		}
	}
});


