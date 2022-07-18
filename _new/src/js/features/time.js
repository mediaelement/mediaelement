'use strict';

import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import {secondsToTimeCode} from '../utils/time';
import {addClass, removeClass} from '../utils/dom';

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
	 * @param {HTMLElement} controls
	 * @param {HTMLElement} layers
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
		time.innerHTML = `<span class="${t.options.classPrefix}currenttime">${secondsToTimeCode(0, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength, player.options.timeFormat)}</span>`;

		t.addControlElement(time, 'current');
		player.updateCurrent();
		t.updateTimeCallback = () => {
			if (t.controlsAreVisible) {
				player.updateCurrent();
			}
		};
		media.addEventListener('timeupdate', t.updateTimeCallback);
	},
	cleancurrent (player, controls, layers, media) {
		media.removeEventListener('timeupdate', player.updateTimeCallback);
	},

	/**
	 * Duration time constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {HTMLElement} controls
	 * @param {HTMLElement} layers
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
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat)}</span>`;

		} else {
			// add class to current time
			if (controls.querySelector(`.${t.options.classPrefix}currenttime`)) {
				addClass(controls.querySelector(`.${t.options.classPrefix}currenttime`).parentNode, `${t.options.classPrefix}currenttime-container`);
			}

			const duration = document.createElement('div');
			duration.className = `${t.options.classPrefix}time ${t.options.classPrefix}duration-container`;
			duration.innerHTML = `<span class="${t.options.classPrefix}duration">` +
				`${secondsToTimeCode(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat)}</span>`;

			t.addControlElement(duration, 'duration');
		}

		t.updateDurationCallback = () => {
			if (t.controlsAreVisible) {
				player.updateDuration();
			}
		};

		media.addEventListener('timeupdate', t.updateDurationCallback);
	},
	cleanduration (player, controls, layers, media) {
		media.removeEventListener('timeupdate', player.updateDurationCallback);
	},

	/**
	 * Update the current time and output it in format 00:00
	 *
	 */
	updateCurrent ()  {
		const t = this;

		let currentTime = t.getCurrentTime();

		if (isNaN(currentTime)) {
			currentTime = 0;
		}

		const timecode = secondsToTimeCode(currentTime, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat);

		// Toggle long-video class if time code is >5 digits (MM:SS)
		if (timecode.length > 5) {
			addClass(t.getElement(t.container), `${t.options.classPrefix}long-video`);
		} else {
			removeClass(t.getElement(t.container), `${t.options.classPrefix}long-video`);
		}

		if (t.getElement(t.controls).querySelector(`.${t.options.classPrefix}currenttime`)) {
			t.getElement(t.controls).querySelector(`.${t.options.classPrefix}currenttime`).innerText = timecode;

		}
	},

	/**
	 * Update the duration time and output it in format 00:00
	 *
	 */
	updateDuration ()  {
		const t = this;

		let duration = t.getDuration();

		if (t.media !== undefined && (isNaN(duration) || duration === Infinity || duration < 0)) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}

		const timecode = secondsToTimeCode(duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat);

		// Toggle long-video class if time code is >5 digits (MM:SS)
		if (timecode.length > 5) {
			addClass(t.getElement(t.container), `${t.options.classPrefix}long-video`);
		} else {
			removeClass(t.getElement(t.container), `${t.options.classPrefix}long-video`);
		}

		if (t.getElement(t.controls).querySelector(`.${t.options.classPrefix}duration`) && duration > 0) {
			t.getElement(t.controls).querySelector(`.${t.options.classPrefix}duration`).innerHTML = timecode;
		}
	}
});
