'use strict';

import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {IS_ANDROID, IS_IOS} from '../utils/constants';
import {isString, createEvent} from '../utils/general';
import {addClass, removeClass, offset} from '../utils/dom';

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
	buildvolume (player, controls, layers, media) {

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
			mute = document.createElement('div')
			;

		mute.className = `${t.options.classPrefix}button ${t.options.classPrefix}volume-button ${t.options.classPrefix}mute`;
		mute.innerHTML = mode === 'horizontal' ?
			`<button type="button" aria-controls="${t.id}" title="${muteText}" aria-label="${muteText}" tabindex="0"></button>` :
			`<button type="button" aria-controls="${t.id}" title="${muteText}" aria-label="${muteText}" tabindex="0"></button>` +
			`<a href="javascript:void(0);" class="${t.options.classPrefix}volume-slider">` +
				`<span class="${t.options.classPrefix}offscreen">${volumeControlText}</span>` +
				`<div class="${t.options.classPrefix}volume-total">` +
					`<div class="${t.options.classPrefix}volume-current"></div>` +
					`<div class="${t.options.classPrefix}volume-handle"></div>` +
				`</div>` +
			`</a>`;

		t.addControlElement(mute, 'volume');

		// horizontal version
		if (mode === 'horizontal') {
			const anchor = document.createElement('a');
			anchor.className = `${t.options.classPrefix}horizontal-volume-slider`;
			anchor.href = 'javascript:void(0);';
			anchor.innerHTML += `<span class="${t.options.classPrefix}offscreen">${volumeControlText}</span>` +
				`<div class="${t.options.classPrefix}horizontal-volume-total">` +
				`<div class="${t.options.classPrefix}horizontal-volume-current"></div>` +
				`<div class="${t.options.classPrefix}horizontal-volume-handle"></div>` +
				`</div>`;
			mute.parentNode.insertBefore(anchor, mute.nextSibling);
		}

		const
			volumeSlider = mode === 'vertical' ? t.container.querySelector(`.${t.options.classPrefix}volume-slider`) :
				t.container.querySelector(`.${t.options.classPrefix}horizontal-volume-slider`),
			volumeTotal = mode === 'vertical' ? t.container.querySelector(`.${t.options.classPrefix}volume-total`) :
				t.container.querySelector(`.${t.options.classPrefix}horizontal-volume-total`),
			volumeCurrent = mode === 'vertical' ? t.container.querySelector(`.${t.options.classPrefix}volume-current`) :
				t.container.querySelector(`.${t.options.classPrefix}horizontal-volume-current`),
			volumeHandle = mode === 'vertical' ? t.container.querySelector(`.${t.options.classPrefix}volume-handle`) :
				t.container.querySelector(`.${t.options.classPrefix}horizontal-volume-handle`),
			button = mute.firstElementChild,

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
					removeClass(mute, `${t.options.classPrefix}mute`);
					addClass(mute, `${t.options.classPrefix}unmute`);
					const button = mute.firstElementChild;
					button.setAttribute('title', unmuteText);
					button.setAttribute('aria-label', unmuteText);
				} else {
					removeClass(mute, `${t.options.classPrefix}unmute`);
					addClass(mute, `${t.options.classPrefix}mute`);
					const button = mute.firstElementChild;
					button.setAttribute('title', muteText);
					button.setAttribute('aria-label', muteText);
				}

				const
					volumePercentage = `${(volume * 100)}%`,
					volumeStyles = getComputedStyle(volumeHandle)
				;

				// position slider
				if (mode === 'vertical') {
					volumeCurrent.style.bottom = 0;
					volumeCurrent.style.height = volumePercentage;
					volumeHandle.style.bottom = volumePercentage;
					volumeHandle.style.marginBottom = `${(-parseFloat(volumeStyles.height) / 2)}px`;
				} else {
					volumeCurrent.style.left = 0;
					volumeCurrent.style.width = volumePercentage;
					volumeHandle.style.left = volumePercentage;
					volumeHandle.style.marginLeft = `${(-parseFloat(volumeStyles.width) / 2)}px`;
				}
			},
			/**
			 * @private
			 */
			handleVolumeMove = (e) => {

				const
					totalOffset = offset(volumeTotal),
					volumeStyles = getComputedStyle(volumeTotal)
				;

				let volume = null;

				// calculate the new volume based on the most recent position
				if (mode === 'vertical') {

					const
						railHeight = parseFloat(volumeStyles.height),
						newY = e.pageY - totalOffset.top
					;

					volume = (railHeight - newY) / railHeight;

					// the controls just hide themselves (usually when mouse moves too far up)
					if (totalOffset.top === 0 || totalOffset.left === 0) {
						return;
					}

				} else {
					const
						railWidth = parseFloat(volumeStyles.width),
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

				e.preventDefault();
				e.stopPropagation();
			}
		;

		mute.addEventListener('mouseenter', (e) => {
			if (e.target === mute) {
				volumeSlider.style.display = 'block';
				mouseIsOver = true;
				e.preventDefault();
				e.stopPropagation();
			}
		});
		mute.addEventListener('focusin', () => {
			volumeSlider.style.display = 'block';
			mouseIsOver = true;
		});
		mute.addEventListener('mouseleave', () => {
			mouseIsOver = false;
			if (!mouseIsDown && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});
		mute.addEventListener('focusout', () => {
			mouseIsOver = false;
			if (!mouseIsDown && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});
		mute.addEventListener('keydown', (e) => {

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

				e.preventDefault();
				e.stopPropagation();
			}
		});

		let
			mouseIsDown = false,
			mouseIsOver = false,

			/**
			 * @private
			 */
			updateVolumeSlider = () => {
				const volume = Math.floor(media.volume * 100);
				volumeSlider.setAttribute('aria-label', i18n.t('mejs.volume-slider'));
				volumeSlider.setAttribute('aria-valuemin', 0);
				volumeSlider.setAttribute('aria-valuemax', 100);
				volumeSlider.setAttribute('aria-valuenow', volume);
				volumeSlider.setAttribute('aria-valuetext', `${volume}%`);
				volumeSlider.setAttribute('role', 'slider');
				volumeSlider.tabIndex = -1;
			}
		;

		// Events
		volumeSlider.addEventListener('dragstart', () => false);

		volumeSlider.addEventListener('mouseover', () => {
			mouseIsOver = true;
		});
		volumeSlider.addEventListener('mousedown', (e) => {
			handleVolumeMove(e);
			t.globalBind('mousemove.vol', (event) => {
				const target = event.target;
				if (mouseIsDown && (target === volumeSlider ||
					target.closest((mode === 'vertical' ? `.${t.options.classPrefix}volume-slider` :
					`.${t.options.classPrefix}horizontal-volume-slider`)))) {
					handleVolumeMove(event);
				}
			});
			t.globalBind('mouseup.vol', () => {
				mouseIsDown = false;
				t.globalUnbind('mousemove.vol mouseup.vol');

				if (!mouseIsOver && mode === 'vertical') {
					volumeSlider.style.display = 'none';
				}
			});
			mouseIsDown = true;

			e.preventDefault();
			e.stopPropagation();
		});

		// MUTE button
		button.addEventListener('click', () => {
			media.setMuted(!media.muted);
			const event = createEvent('volumechange', media);
			media.dispatchEvent(event);
		});
		button.addEventListener('focus', () => {
			if (mode === 'vertical') {
				volumeSlider.style.display = 'block';
			}
		});
		button.addEventListener('blur', () => {
			if (mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});

		// listen for volume change events from other sources
		media.addEventListener('volumechange', (e) => {
			if (!mouseIsDown) {
				if (media.muted) {
					positionVolumeHandle(0);
					removeClass(mute, `${t.options.classPrefix}mute`);
					addClass(mute, `${t.options.classPrefix}unmute`);
				} else {
					positionVolumeHandle(media.volume);
					removeClass(mute, `${t.options.classPrefix}unmute`);
					addClass(mute, `${t.options.classPrefix}mute`);
				}
			}
			updateVolumeSlider(e);
		});

		// mutes the media and sets the volume icon muted if the initial volume is set to 0
		if (player.options.startVolume === 0) {
			media.setMuted(true);
		}

		// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
		const isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null;

		if (isNative) {
			media.setVolume(player.options.startVolume);
		}

		t.container.addEventListener('controlsresize', () => {
			if (media.muted) {
				positionVolumeHandle(0);
				removeClass(mute, `${t.options.classPrefix}mute`);
				addClass(mute, `${t.options.classPrefix}unmute`);
			} else {
				positionVolumeHandle(media.volume);
				removeClass(mute, `${t.options.classPrefix}unmute`);
				addClass(mute, `${t.options.classPrefix}mute`);
			}
		});
	}
});


