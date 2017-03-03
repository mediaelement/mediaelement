'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {IS_ANDROID, IS_IOS} from '../utils/constants';
import {isString} from '../utils/general';

/**
 * Volume button
 *
 * This feature enables the displaying of a Volume button in the control bar, and also contains logic to manipulate its
 * events, such as sliding up/down (or left/right, if vertical), muting/unmuting media, etc.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * @type {?String}
	 */
	muteText: null,
	/**
	 * @type {?String}
	 */
	unmuteText: null,
	/**
	 * @type {?String}
	 */
	allyVolumeControlText: null,
	/**
	 * @type {Boolean}
	 */
	hideVolumeOnTouchDevices: true,
	/**
	 * @type {String}
	 */
	audioVolume: 'horizontal',
	/**
	 * @type {String}
	 */
	videoVolume: 'vertical'
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
	 * @public
	 */
	buildvolume: function (player, controls, layers, media)  {

		// Android and iOS don't support volume controls
		if ((IS_ANDROID || IS_IOS) && this.options.hideVolumeOnTouchDevices) {
			return;
		}

		const
			t = this,
			mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume,
			muteText = isString(t.options.muteText) ? t.options.muteText : i18n.t('mejs.mute'),
			unmuteText = isString(t.options.unmuteText) ? t.options.unmuteText : i18n.t('mejs.unmute'),
			volumeControlText = isString(t.options.allyVolumeControlText) ? t.options.allyVolumeControlText : i18n.t('mejs.volume-help-text'),
			mute = (mode === 'horizontal') ?

				// horizontal version
				$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}volume-button ${t.options.classPrefix}mute">` +
					`<button type="button" aria-controls="${t.id}" title="${muteText}" aria-label="${muteText}" tabindex="0"></button>` +
				`</div>` +
				`<a href="javascript:void(0);" class="${t.options.classPrefix}horizontal-volume-slider">` +
					`<span class="${t.options.classPrefix}offscreen">${volumeControlText}</span>` +
					`<div class="${t.options.classPrefix}horizontal-volume-total">` +
						`<div class="${t.options.classPrefix}horizontal-volume-current"></div>` +
						`<div class="${t.options.classPrefix}horizontal-volume-handle"></div>` +
					`</div>` +
				`</a>`)
				.appendTo(controls) :

				// vertical version
				$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}volume-button ${t.options.classPrefix}mute">` +
					`<button type="button" aria-controls="${t.id}" title="${muteText}" aria-label="${muteText}" tabindex="0"></button>` +
					`<a href="javascript:void(0);" class="${t.options.classPrefix}volume-slider">` +
						`<span class="${t.options.classPrefix}offscreen">${volumeControlText}</span>` +
						`<div class="${t.options.classPrefix}volume-total">` +
							`<div class="${t.options.classPrefix}volume-current"></div>` +
							`<div class="${t.options.classPrefix}volume-handle"></div>` +
						`</div>` +
					`</a>` +
				`</div>`)
		;

		t.addControlElement(mute, 'volume');

		const
			volumeSlider = t.container.find(`.${t.options.classPrefix}volume-slider, 
				.${t.options.classPrefix}horizontal-volume-slider`),
			volumeTotal = t.container.find(`.${t.options.classPrefix}volume-total, 
				.${t.options.classPrefix}horizontal-volume-total`),
			volumeCurrent = t.container.find(`.${t.options.classPrefix}volume-current, 
				.${t.options.classPrefix}horizontal-volume-current`),
			volumeHandle = t.container.find(`.${t.options.classPrefix}volume-handle, 
				.${t.options.classPrefix}horizontal-volume-handle`),

			/**
			 * @private
			 * @param {Number} volume
			 */
			positionVolumeHandle = (volume) => {

				// correct to 0-1
				volume = Math.max(0, volume);
				volume = Math.min(volume, 1);

				// adjust mute button style
				if (volume === 0) {
					mute.removeClass(`${t.options.classPrefix}mute`).addClass(`${t.options.classPrefix}unmute`);
					mute.children('button').attr({
						title: unmuteText,
						'aria-label': unmuteText,
					});
				} else {
					mute.removeClass(`${t.options.classPrefix}unmute`).addClass(`${t.options.classPrefix}mute`);
					mute.children('button').attr({
						title: muteText,
						'aria-label': muteText,
					});
				}

				const volumePercentage = `${(volume * 100)}%`;

				// position slider
				if (mode === 'vertical') {
					volumeCurrent.css({
						bottom: '0',
						height: volumePercentage
					});
					volumeHandle.css({
						bottom: volumePercentage,
						marginBottom: `${(-volumeHandle.height() / 2)}px`
					});
				} else {
					volumeCurrent.css({
						left: '0',
						width: volumePercentage
					});
					volumeHandle.css({
						left: volumePercentage,
						marginLeft: `${(-volumeHandle.width() / 2)}px`
					});
				}
			},
			/**
			 * @private
			 */
			handleVolumeMove = (e) => {

				let
					volume = null,
					totalOffset = volumeTotal.offset()
				;

				// calculate the new volume based on the most recent position
				if (mode === 'vertical') {

					const
						railHeight = volumeTotal.height(),
						newY = e.pageY - totalOffset.top
					;

					volume = (railHeight - newY) / railHeight;

					// the controls just hide themselves (usually when mouse moves too far up)
					if (totalOffset.top === 0 || totalOffset.left === 0) {
						return;
					}

				} else {
					const
						railWidth = volumeTotal.width(),
						newX = e.pageX - totalOffset.left
					;

					volume = newX / railWidth;
				}

				// ensure the volume isn't outside 0-1
				volume = Math.max(0, volume);
				volume = Math.min(volume, 1);

				// position the slider and handle
				positionVolumeHandle(volume);

				// set the media object (this will trigger the `volumechanged` event)
				if (volume === 0) {
					media.setMuted(true);
				} else {
					media.setMuted(false);
				}
				media.setVolume(volume);
			}
		;

		let
			mouseIsDown = false,
			mouseIsOver = false
		;

		// SLIDER
		mute
			.on('mouseenter focusin', () => {
				volumeSlider.show();
				mouseIsOver = true;
			})
			.on('mouseleave focusout', () => {
				mouseIsOver = false;

				if (!mouseIsDown && mode === 'vertical') {
					volumeSlider.hide();
				}
			});

		/**
		 * @private
		 */
		let updateVolumeSlider = () => {

			const volume = Math.floor(media.volume * 100);

			volumeSlider.attr({
				'aria-label': i18n.t('mejs.volume-slider'),
				'aria-valuemin': 0,
				'aria-valuemax': 100,
				'aria-valuenow': volume,
				'aria-valuetext': `${volume}%`,
				'role': 'slider',
				'tabindex': -1
			});

		};

		// Events
		volumeSlider
			.on('mouseover', () => {
				mouseIsOver = true;
			})
			.on('mousedown', (e) => {
				handleVolumeMove(e);
				t.globalBind('mousemove.vol', (e) => {
					handleVolumeMove(e);
				});
				t.globalBind('mouseup.vol', () => {
					mouseIsDown = false;
					t.globalUnbind('mousemove.vol mouseup.vol');

					if (!mouseIsOver && mode === 'vertical') {
						volumeSlider.hide();
					}
				});
				mouseIsDown = true;

				return false;
			})
			.on('keydown', (e) => {

				if (t.options.keyActions.length) {
					let
						keyCode = e.which || e.keyCode || 0,
						volume = media.volume
					;
					switch (keyCode) {
						case 38: // Up
							volume = Math.min(volume + 0.1, 1);
							break;
						case 40: // Down
							volume = Math.max(0, volume - 0.1);
							break;
						default:
							return true;
					}

					mouseIsDown = false;
					positionVolumeHandle(volume);
					media.setVolume(volume);
					return false;
				}
			});

		// MUTE button
		mute.find('button').on('click', () => {
			media.setMuted(!media.muted);
		}).on('focus', () => {
			if (mode === 'vertical') {
				volumeSlider.show();
			}
		}).on('blur', () => {
			if (mode === 'vertical') {
				volumeSlider.hide();
			}
		});

		// listen for volume change events from other sources
		media.addEventListener('volumechange', (e) => {
			if (!mouseIsDown) {
				if (media.muted) {
					positionVolumeHandle(0);
					mute.removeClass(`${t.options.classPrefix}mute`).addClass(`${t.options.classPrefix}unmute`);
				} else {
					positionVolumeHandle(media.volume);
					mute.removeClass(`${t.options.classPrefix}unmute`).addClass(`${t.options.classPrefix}mute`);
				}
			}
			updateVolumeSlider(e);
		}, false);

		// mutes the media and sets the volume icon muted if the initial volume is set to 0
		if (player.options.startVolume === 0) {
			media.setMuted(true);
		}

		// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
		let isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null;

		if (isNative) {
			media.setVolume(player.options.startVolume);
		}

		t.container.on('controlsresize', () => {
			if (media.muted) {
				positionVolumeHandle(0);
				mute.removeClass(`${t.options.classPrefix}mute`)
				.addClass(`${t.options.classPrefix}unmute`);
			} else {
				positionVolumeHandle(media.volume);
				mute.removeClass(`${t.options.classPrefix}unmute`)
				.addClass(`${t.options.classPrefix}mute`);
			}
		});
	}
});


