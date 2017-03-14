'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {IS_FIREFOX, IS_IOS, IS_ANDROID} from '../utils/constants';
import {secondsToTimeCode} from '../utils/time';

/**
 * Progress/loaded bar
 *
 * This feature creates a progress bar with a slider in the control bar, and updates it based on native events.
 */

// Feature configuration
Object.assign(config, {
	/**
	 * Enable tooltip that shows time in progress bar
	 * @type {Boolean}
	 */
	enableProgressTooltip: true
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
	buildprogress: function (player, controls, layers, media)  {

		let
			lastKeyPressTime = 0,
			mouseIsDown = false,
			startedPaused = false
		;

		const
			t = this,
			autoRewindInitial = player.options.autoRewind,
			tooltip = player.options.enableProgressTooltip ?
				`<span class="${t.options.classPrefix}time-float">` +
					`<span class="${t.options.classPrefix}time-float-current">00:00</span>` +
					`<span class="${t.options.classPrefix}time-float-corner"></span>` +
				`</span>` : "",
			rail = $(`<div class="${t.options.classPrefix}time-rail">` +
				`<span class="${t.options.classPrefix}time-total ${t.options.classPrefix}time-slider">` +
					`<span class="${t.options.classPrefix}time-buffering"></span>` +
					`<span class="${t.options.classPrefix}time-loaded"></span>` +
					`<span class="${t.options.classPrefix}time-current"></span>` +
					`<span class="${t.options.classPrefix}time-handle"></span>` +
					`${tooltip}` +
				`</span>` +
			`</div>`)
		;

		t.addControlElement(rail, 'progress');

		controls.find(`.${t.options.classPrefix}time-buffering`).hide();

		t.rail = controls.find(`.${t.options.classPrefix}time-rail`);
		t.total = controls.find(`.${t.options.classPrefix}time-total`);
		t.loaded = controls.find(`.${t.options.classPrefix}time-loaded`);
		t.current = controls.find(`.${t.options.classPrefix}time-current`);
		t.handle = controls.find(`.${t.options.classPrefix}time-handle`);
		t.timefloat = controls.find(`.${t.options.classPrefix}time-float`);
		t.timefloatcurrent = controls.find(`.${t.options.classPrefix}time-float-current`);
		t.slider = controls.find(`.${t.options.classPrefix}time-slider`);
		t.newTime = 0;
		t.forcedHandlePause = false;

		/**
		 *
		 * @private
		 * @param {Event} e
		 */
		let handleMouseMove = (e) => {

				const
					offset = t.total.offset(),
					width = t.total.width()
				;

				let
					percentage = 0,
					pos = 0,
					x
				;

				// mouse or touch position relative to the object
				if (e.originalEvent && e.originalEvent.changedTouches) {
					x = e.originalEvent.changedTouches[0].pageX;
				} else if (e.changedTouches) { // for Zepto
					x = e.changedTouches[0].pageX;
				} else {
					x = e.pageX;
				}

				if (media.duration) {
					if (x < offset.left) {
						x = offset.left;
					} else if (x > width + offset.left) {
						x = width + offset.left;
					}

					pos = x - offset.left;
					percentage = (pos / width);
					t.newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

					// fake seek to where the mouse is 
					if (mouseIsDown && media.currentTime !== null && t.newTime.toFixed(4) !== media.currentTime.toFixed(4)) {
						t.setCurrentRailHandle(t.newTime);
						t.updateCurrent(t.newTime);
					}

					// position floating time box
					if (!IS_IOS && !IS_ANDROID) {
						t.timefloat.css('left', pos);
						t.timefloatcurrent.html(secondsToTimeCode(t.newTime, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength));
						t.timefloat.show();
					}
				}
			},
			/**
			 * Update elements in progress bar for accessibility purposes only when player is paused.
			 *
			 * This is to avoid attempts to repeat the time over and over again when media is playing.
			 * @private
			 */
			updateSlider = () => {

				const
					seconds = media.currentTime,
					timeSliderText = i18n.t('mejs.time-slider'),
					time = secondsToTimeCode(seconds, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength),
					duration = media.duration
				;

				t.slider.attr({
					'role': 'slider',
					'tabindex': 0
				});
				if (media.paused) {
					t.slider.attr({
						'aria-label': timeSliderText,
						'aria-valuemin': 0,
						'aria-valuemax': duration,
						'aria-valuenow': seconds,
						'aria-valuetext': time
					});
				} else {
					t.slider.removeAttr('aria-label aria-valuemin aria-valuemax aria-valuenow aria-valuetext');
				}
			},
			/**
			 *
			 * @private
			 */
			restartPlayer = () => {
				let now = new Date();
				if (now - lastKeyPressTime >= 1000) {
					media.play();
				}
			},
			handleMouseup = () => {

				if (mouseIsDown && t.newTime.toFixed(4) !== media.currentTime.toFixed(4)) {
					media.setCurrentTime(t.newTime);
					player.setCurrentRail();
					t.updateCurrent(t.newTime);
				}
				if (t.forcedHandlePause) {
					t.media.play();
				}
				t.forcedHandlePause = false;
			};

		// Events
		t.slider.on('focus', () => {
			player.options.autoRewind = false;
		}).on('blur', () => {
			player.options.autoRewind = autoRewindInitial;
		}).on('keydown', (e) => {

			if ((new Date() - lastKeyPressTime) >= 1000) {
				startedPaused = media.paused;
			}

			if (t.options.keyActions.length) {

				const
					keyCode = e.which || e.keyCode || 0,
					duration = media.duration,
					seekForward = player.options.defaultSeekForwardInterval(media),
					seekBackward = player.options.defaultSeekBackwardInterval(media)
				;

				let seekTime = media.currentTime;

				switch (keyCode) {
					case 37: // left
					case 40: // Down
						if (media.duration !== Infinity) {
							seekTime -= seekBackward;
						}
						break;
					case 39: // Right
					case 38: // Up
						if (media.duration !== Infinity) {
							seekTime += seekForward;
						}
						break;
					case 36: // Home
						seekTime = 0;
						break;
					case 35: // end
						seekTime = duration;
						break;
					case 32: // space
						if (!IS_FIREFOX) {
							if (media.paused) {
								media.play();
							} else {
								media.pause();
							}
						}
						return;
					case 13: // enter
						if (media.paused) {
							media.play();
						} else {
							media.pause();
						}
						return;
					default:
						return;
				}


				seekTime = seekTime < 0 ? 0 : (seekTime >= duration ? duration : Math.floor(seekTime));
				lastKeyPressTime = new Date();
				if (!startedPaused) {
					media.pause();
				}

				if (seekTime < media.duration && !startedPaused) {
					setTimeout(restartPlayer, 1100);
				}

				media.setCurrentTime(seekTime);

				e.preventDefault();
				e.stopPropagation();
			}
		}).on('mousedown touchstart', (e) => {
			t.forcedHandlePause = false;
			if (media.duration !== Infinity) {
				// only handle left clicks or touch
				if (e.which === 1 || e.which === 0) {

					if (!media.paused) {
						t.media.pause();
						t.forcedHandlePause = true;
					}

					mouseIsDown = true;
					handleMouseMove(e);
					t.globalBind('mousemove.dur touchmove.dur', (e) => {
						handleMouseMove(e);
					});
					t.globalBind('mouseup.dur touchend.dur', () => {
						handleMouseup();
						mouseIsDown = false;
						if (t.timefloat !== undefined) {
							t.timefloat.hide();
						}
						t.globalUnbind('mousemove.dur touchmove.dur mouseup.dur touchend.dur');
					});
				}
			}
		}).on('mouseenter', () => {
			if (media.duration !== Infinity) {
				t.globalBind('mousemove.dur', (e) => {
					handleMouseMove(e);
				});
				if (t.timefloat !== undefined && !IS_IOS && !IS_ANDROID) {
					t.timefloat.show();
				}
			}
		}).on('mouseleave', () => {
			if (media.duration !== Infinity) {
				if (!mouseIsDown) {
					t.globalUnbind('mousemove.dur');
					if (t.timefloat !== undefined) {
						t.timefloat.hide();
					}
				}
			}
		});

		// loading
		// If media is does not have a finite duration, remove progress bar interaction
		// and indicate that is a live broadcast
		media.addEventListener('progress', (e) => {
			if (media.duration !== Infinity) {

				if (controls.find(`.${t.options.classPrefix}broadcast`).length) {
					t.slider.show();
					controls.find(`.${t.options.classPrefix}broadcast`).remove();
				}

				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
			} else if (!controls.find(`.${t.options.classPrefix}broadcast`).length) {
				controls.find(`.${t.options.classPrefix}time-rail`).append(`<span class="${t.options.classPrefix}broadcast">${i18n.t('mejs.live-broadcast')}</span>`);
				t.slider.hide();
			}
		}, false);

		// current time
		media.addEventListener('timeupdate', (e) => {
			if (media.duration !== Infinity ) {

				if (controls.find(`.${t.options.classPrefix}broadcast`).length) {
					t.slider.show();
					controls.find(`.${t.options.classPrefix}broadcast`).remove();
				}

				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
				updateSlider(e);
			} else if (!controls.find(`.${t.options.classPrefix}broadcast`).length) {
				controls.find(`.${t.options.classPrefix}time-rail`).append(`<span class="${t.options.classPrefix}broadcast">${i18n.t('mejs.live-broadcast')}</span>`);
				t.slider.hide();
			}
		}, false);

		t.container.on('controlsresize', (e) => {
			if (media.duration !== Infinity) {
				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
			}
		});
	},

	/**
	 * Calculate the progress on the media and update progress bar's width
	 *
	 * @param {Event} e
	 */
	setProgressRail: function (e)  {

		let percent = null;

		const
			t = this,
			target = (e !== undefined) ? e.target : t.media
		;

		// newest HTML5 spec has buffered array (FF4, Webkit)
		if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
			// account for a real array with multiple values - always read the end of the last buffer
			percent = target.buffered.end(target.buffered.length - 1) / target.duration;
		}
		// Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
		// to be anything other than 0. If the byte count is available we use this instead.
		// Browsers that support the else if do not seem to have the bufferedBytes value and
		// should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
		else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
			percent = target.bufferedBytes / target.bytesTotal;
		}
		// Firefox 3 with an Ogg file seems to go this way
		else if (e && e.lengthComputable && e.total !== 0) {
			percent = e.loaded / e.total;
		}

		// finally update the progress bar
		if (percent !== null) {
			percent = Math.min(1, Math.max(0, percent));
			// update loaded bar
			if (t.loaded && t.total) {
				t.loaded.width(`${(percent * 100)}%`);
			}
		}
	},
	/**
	 * Update the slider's width depending on the time assigned
	 *
	 * @param {Number} fakeTime
	 */
	setCurrentRailHandle: function (fakeTime) {
		const t = this;
		t.setCurrentRailMain(t, fakeTime);
	},
	/**
	 * Update the slider's width depending on the current time
	 *
	 */
	setCurrentRail: function () {
		const t = this;
		t.setCurrentRailMain(t);
	},
	/**
	 * Method that handles the calculation of the width of the rail.
	 *
	 * @param {MediaElementPlayer} t
	 * @param {?Number} fakeTime
	 */
	setCurrentRailMain: function (t, fakeTime) {
		if (t.media.currentTime !== undefined && t.media.duration) {
			const nTime = (typeof fakeTime === 'undefined') ? t.media.currentTime : fakeTime;

			// update bar and handle
			if (t.total && t.handle) {
				let
					newWidth = Math.round(t.total.width() * nTime / t.media.duration),
					handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2)
				;

				newWidth = nTime / t.media.duration * 100;
				t.current.width(newWidth + '%');
				t.handle.css('left', handlePos);
			}
		}
	}
});

