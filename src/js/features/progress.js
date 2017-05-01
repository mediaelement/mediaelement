'use strict';

// import window from 'global/window';
import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {IS_FIREFOX, IS_IOS, IS_ANDROID} from '../utils/constants';
import {secondsToTimeCode} from '../utils/time';
import {offset, addClass, removeClass, hasClass} from '../utils/dom';

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
	enableProgressTooltip: true,

	/**
	 * Enable smooth behavior when hovering progress bar
	 * @type {Boolean}
	 */
	useSmoothHover: true
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
	buildprogress (player, controls, layers, media)  {

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
			rail = document.createElement('div')
		;

		rail.className = `${t.options.classPrefix}time-rail`;
		rail.innerHTML = `<span class="${t.options.classPrefix}time-total ${t.options.classPrefix}time-slider">` +
			`<span class="${t.options.classPrefix}time-buffering"></span>` +
			`<span class="${t.options.classPrefix}time-loaded"></span>` +
			`<span class="${t.options.classPrefix}time-current"></span>` +
			`<span class="${t.options.classPrefix}time-hovered no-hover"></span>` +
			`<span class="${t.options.classPrefix}time-handle"><span class="${t.options.classPrefix}time-handle-content"></span></span>` +
			`${tooltip}` +
		`</span>`;

		t.addControlElement(rail, 'progress');

		controls.querySelector(`.${t.options.classPrefix}time-buffering`).style.display = 'none';

		t.rail = controls.querySelector(`.${t.options.classPrefix}time-rail`);
		t.total = controls.querySelector(`.${t.options.classPrefix}time-total`);
		t.loaded = controls.querySelector(`.${t.options.classPrefix}time-loaded`);
		t.current = controls.querySelector(`.${t.options.classPrefix}time-current`);
		t.handle = controls.querySelector(`.${t.options.classPrefix}time-handle`);
		t.timefloat = controls.querySelector(`.${t.options.classPrefix}time-float`);
		t.timefloatcurrent = controls.querySelector(`.${t.options.classPrefix}time-float-current`);
		t.slider = controls.querySelector(`.${t.options.classPrefix}time-slider`);
		t.hovered = controls.querySelector(`.${t.options.classPrefix}time-hovered`);
		t.newTime = 0;
		t.forcedHandlePause = false;
		t.setTransformStyle = (element, value) => {
			element.style.transform = value;
			element.style.webkitTransform = value;
			element.style.MozTransform = value;
			element.style.msTransform = value;
			element.style.OTransform = value;
		};

		/**
		 *
		 * @private
		 * @param {Event} e
		 */
		let handleMouseMove = (e) => {

				const
					totalStyles = getComputedStyle(t.total),
					offsetStyles = offset(t.total),
					width = parseFloat(totalStyles.width),
					transform = (() => {
						if (totalStyles.webkitTransform !== undefined) {
							return 'webkitTransform';
						} else if (totalStyles.mozTransform !== undefined) {
							return 'mozTransform ';
						} else if (totalStyles.oTransform !== undefined) {
							return 'oTransform';
						} else if (totalStyles.msTransform !== undefined) {
							return 'msTransform';
						} else {
							return 'transform';
						}
					})(),
					cssMatrix = (() => {
						if ('WebKitCSSMatrix' in window) {
							return 'WebKitCSSMatrix';
						} else if ('MSCSSMatrix' in window) {
							return 'MSCSSMatrix';
						} else if ('CSSMatrix' in window) {
							return 'CSSMatrix';
						}
					})()
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
					if (x < offsetStyles.left) {
						x = offsetStyles.left;
					} else if (x > width + offsetStyles.left) {
						x = width + offsetStyles.left;
					}

					pos = x - offsetStyles.left;
					percentage = (pos / width);
					t.newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

					// fake seek to where the mouse is
					if (mouseIsDown && media.currentTime !== null && t.newTime.toFixed(4) !== media.currentTime.toFixed(4)) {
						t.setCurrentRailHandle(t.newTime);
						t.updateCurrent(t.newTime);
					}

					// position floating time box
					if (!IS_IOS && !IS_ANDROID && t.timefloat) {
						if (pos < 0){
							pos = 0;
						}
						if (t.options.useSmoothHover && cssMatrix !== null && typeof window[cssMatrix] !== 'undefined') {
							const
								matrix = new window[cssMatrix](getComputedStyle(t.handle)[transform]),
								handleLocation = matrix.m41,
								hoverScaleX = pos/parseFloat(getComputedStyle(t.total).width) - handleLocation/parseFloat(getComputedStyle(t.total).width)
							;
							
							t.hovered.style.left = `${handleLocation}px`;
							t.setTransformStyle(t.hovered,`scaleX(${hoverScaleX})`);
							t.hovered.setAttribute('pos', pos);

							if (hoverScaleX >= 0) {
								removeClass(t.hovered, 'negative');
							} else {
								addClass(t.hovered, 'negative');
							}
						}

						t.timefloat.style.left = `${pos}px`;
						t.timefloatcurrent.innerHTML = secondsToTimeCode(t.newTime, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength);
						t.timefloat.style.display = 'block';
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

				t.slider.setAttribute('role', 'slider');
				t.slider.tabIndex = 0;

				if (media.paused) {
					t.slider.setAttribute('aria-label', timeSliderText);
					t.slider.setAttribute('aria-valuemin', 0);
					t.slider.setAttribute('aria-valuemax', duration);
					t.slider.setAttribute('aria-valuenow', seconds);
					t.slider.setAttribute('aria-valuetext', time);
				} else {
					t.slider.removeAttribute('aria-label');
					t.slider.removeAttribute('aria-valuemin');
					t.slider.removeAttribute('aria-valuemax');
					t.slider.removeAttribute('aria-valuenow');
					t.slider.removeAttribute('aria-valuetext');
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

				if (mouseIsDown && media.currentTime !== null && t.newTime.toFixed(4) !== media.currentTime.toFixed(4)) {
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
		t.slider.addEventListener('focus', () => {
			player.options.autoRewind = false;
		});
		t.slider.addEventListener('blur', () => {
			player.options.autoRewind = autoRewindInitial;
		});
		t.slider.addEventListener('keydown', (e) => {

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
		});

		const events = ['mousedown', 'touchstart'];

		// Required to manipulate mouse movements that require drag 'n' drop properly
		t.slider.addEventListener('dragstart', () => false);

		for (let i = 0, total = events.length; i < total; i++) {
			t.slider.addEventListener(events[i], (e) => {
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
						const endEvents = ['mouseup', 'touchend'];

						for (let j = 0, totalEvents = endEvents.length; j < totalEvents; j++) {
							t.container.addEventListener(endEvents[j], (event) => {
								const target = event.target;
								if (target === t.slider || target.closest(`.${t.options.classPrefix}time-slider`)) {
									handleMouseMove(event);
								}
							});
						}
						t.globalBind('mouseup.dur touchend.dur', () => {
							handleMouseup();
							mouseIsDown = false;
							if (t.timefloat) {
								t.timefloat.style.display = 'none';
							}
							t.globalUnbind('mousemove.dur touchmove.dur mouseup.dur touchend.dur');
						});
					}
				}
			});
		}
		t.slider.addEventListener('mouseenter', (e) => {
			if (e.target === t.slider && media.duration !== Infinity) {
				t.container.addEventListener('mousemove', (event) => {
					const target = event.target;
					if (target === t.slider || target.closest(`.${t.options.classPrefix}time-slider`)) {
						handleMouseMove(event);
					}
				});
				if (t.timefloat && !IS_IOS && !IS_ANDROID) {
					t.timefloat.style.display = 'block';
				}
				if (t.hovered && !IS_IOS && !IS_ANDROID && t.options.useSmoothHover) {
					removeClass(t.hovered, 'no-hover');
				}
			}
		});
		t.slider.addEventListener('mouseleave', () => {
			if (media.duration !== Infinity) {
				if (!mouseIsDown) {
					t.globalUnbind('mousemove.dur');
					if (t.timefloat) {
						t.timefloat.style.display = 'none';
					}
					if (t.hovered && t.options.useSmoothHover) {
						addClass(t.hovered, 'no-hover');
					}
				}
			}
		});

		// loading
		// If media is does not have a finite duration, remove progress bar interaction
		// and indicate that is a live broadcast
		media.addEventListener('progress', (e) => {
			const broadcast = controls.querySelector(`.${t.options.classPrefix}broadcast`);
			if (media.duration !== Infinity) {
				if (broadcast) {
					t.slider.style.display = '';
					broadcast.remove();
				}

				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
			} else if (!broadcast) {
				const label = document.createElement('span');
				label.className = `${t.options.classPrefix}broadcast`;
				label.innerText = i18n.t('mejs.live-broadcast');
				t.slider.style.display = 'none';
			}
		});

		// current time
		media.addEventListener('timeupdate', (e) => {
			const broadcast = controls.querySelector(`.${t.options.classPrefix}broadcast`);
			if (media.duration !== Infinity ) {
				if (broadcast) {
					t.slider.style.display = '';
					broadcast.remove();
				}

				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
				updateSlider(e);
			} else if (!broadcast) {
				const label = document.createElement('span');
				label.className = `${t.options.classPrefix}broadcast`;
				label.innerText = i18n.t('mejs.live-broadcast');
				controls.querySelector(`.${t.options.classPrefix}time-rail`).appendChild(label);
				t.slider.style.display = 'none';
			}
		});

		t.container.addEventListener('controlsresize', (e) => {
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
	setProgressRail (e)  {

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
				t.setTransformStyle(t.loaded,`scaleX(${percent})`);
			}
		}
	},
	/**
	 * Update the slider's width depending on the time assigned
	 *
	 * @param {Number} fakeTime
	 */
	setCurrentRailHandle (fakeTime) {
		const t = this;
		t.setCurrentRailMain(t, fakeTime);
	},
	/**
	 * Update the slider's width depending on the current time
	 *
	 */
	setCurrentRail () {
		const t = this;
		t.setCurrentRailMain(t);
	},
	/**
	 * Method that handles the calculation of the width of the rail.
	 *
	 * @param {MediaElementPlayer} t
	 * @param {?Number} fakeTime
	 */
	setCurrentRailMain (t, fakeTime) {
		if (t.media.currentTime !== undefined && t.media.duration) {
			const nTime = (typeof fakeTime === 'undefined') ? t.media.currentTime : fakeTime;


			// update bar and handle
			if (t.total && t.handle) {

				const tW = parseFloat(getComputedStyle(t.total).width);

				let
					newWidth = Math.round(tW * nTime / t.media.duration),
					handlePos = newWidth - Math.round(t.handle.offsetWidth / 2)
				;

				handlePos = (handlePos < 0) ? 0 : handlePos;
				t.setTransformStyle(t.current,`scaleX(${newWidth/tW})`);
				t.setTransformStyle(t.handle,`translateX(${handlePos}px)`);

				if (t.options.useSmoothHover && !hasClass(t.hovered, 'no-hover')) {
					let pos = parseInt(t.hovered.getAttribute('pos'));
					pos = (isNaN(pos)) ? 0 : pos;

					const hoverScaleX = pos/tW - handlePos/tW;

					t.hovered.style.left = `${handlePos}px`;
					t.setTransformStyle(t.hovered,`scaleX(${hoverScaleX})`); 

					if (hoverScaleX >= 0) {
						removeClass(t.hovered, 'negative');
					} else {
						addClass(t.hovered, 'negative');
					}
				}

			}
		}
	}
});
