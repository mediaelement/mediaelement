'use strict';

import window from 'global/window';
import document from 'global/document';
import i18n from '../core/i18n';
import {config} from '../player';
import MediaElementPlayer from '../player';
import * as Features from '../utils/constants';
import {isString, createEvent} from '../utils/general';
import {addClass, removeClass} from '../utils/dom';
import {getTypeFromFile} from '../utils/media';


/**
 * Fullscreen button
 *
 * This feature creates a button to toggle fullscreen on video; it considers a letiety of possibilities when dealing with it
 * since it is not consistent across browsers. It also accounts for triggering the event through Flash shim.
 */

// Feature configuration
Object.assign(config, {
	/**
	 * @type {Boolean}
	 */
	usePluginFullScreen: true,
	/**
	 * @type {?String}
	 */
	fullscreenText: null,
	/**
	 * @type {Boolean}
	 */
	useFakeFullscreen: false
});

Object.assign(MediaElementPlayer.prototype, {
	/**
	 * @type {Boolean}
	 */
	isFullScreen: false,
	/**
	 * @type {Boolean}
	 */
	isNativeFullScreen: false,
	/**
	 * @type {Boolean}
	 */
	isInIframe: false,
	/**
	 * @type {Boolean}
	 */
	isPluginClickThroughCreated: false,
	/**
	 * Possible modes
	 * (1) 'native-native'  HTML5 video  + browser fullscreen (IE10+, etc.)
	 * (2) 'plugin-native'  plugin video + browser fullscreen (fails in some versions of Firefox)
	 * (3) 'fullwindow'     Full window (retains all UI)
	 *
	 * @type {String}
	 */
	fullscreenMode: '',
	/**
	 *
	 */
	containerSizeTimeout: null,

	/**
	 * Feature constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 */
	buildfullscreen (player)  {
		if (!player.isVideo) {
			return;
		}

		player.isInIframe = (window.location !== window.parent.location);

		player.detectFullscreenMode();

		const
			t = this,
			fullscreenTitle = isString(t.options.fullscreenText) ? t.options.fullscreenText : i18n.t('mejs.fullscreen'),
			fullscreenBtn = document.createElement('div')
		;

		fullscreenBtn.className = `${t.options.classPrefix}button ${t.options.classPrefix}fullscreen-button`;
		fullscreenBtn.innerHTML = `<button type="button" aria-controls="${t.id}" title="${fullscreenTitle}" aria-label="${fullscreenTitle}" tabindex="0"></button>`;
		t.addControlElement(fullscreenBtn, 'fullscreen');

		fullscreenBtn.addEventListener('click', () => {
			// toggle fullscreen
			const isFullScreen = (Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN) || player.isFullScreen;

			if (isFullScreen) {
				player.exitFullScreen();
			} else {
				player.enterFullScreen();
			}
		});

		player.fullscreenBtn = fullscreenBtn;

		t.options.keyActions.push({
			keys: [70], // F
			action: (player, media, key, event) => {
				if (!event.ctrlKey) {
					if (typeof player.enterFullScreen !== 'undefined') {
						if (player.isFullScreen) {
							player.exitFullScreen();
						} else {
							player.enterFullScreen();
						}
					}
				}
			}
		});

		t.exitFullscreenCallback = (e) => {
			const key = e.which || e.keyCode || 0;
			if (t.options.enableKeyboard && key === 27 && ((Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN) || t.isFullScreen)) {
				player.exitFullScreen();
			}
		};

		t.globalBind('keydown', t.exitFullscreenCallback);

		t.normalHeight = 0;
		t.normalWidth = 0;

		// setup native fullscreen event
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN) {
			/**
			 * Detect any changes on fullscreen
			 *
			 * Chrome doesn't always fire this in an `<iframe>`
			 * @private
			 */
			const fullscreenChanged = () => {
				if (player.isFullScreen) {
					if (Features.isFullScreen()) {
						player.isNativeFullScreen = true;
						// reset the controls once we are fully in full screen
						player.setControlsSize();
					} else {
						player.isNativeFullScreen = false;
						// when a user presses ESC
						// make sure to put the player back into place
						player.exitFullScreen();
					}
				}
			};

			player.globalBind(Features.FULLSCREEN_EVENT_NAME, fullscreenChanged);
		}
	},
	cleanfullscreen (player)  {
		player.exitFullScreen();
		player.globalUnbind('keydown', player.exitFullscreenCallback);
	},

	/**
	 * Detect the type of fullscreen based on browser's capabilities
	 *
	 * @return {String}
	 */
	detectFullscreenMode ()  {
		const
			t = this,
			isNative = t.media.rendererName !== null && /(native|html5)/i.test(t.media.rendererName)
		;

		let mode = '';

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && isNative) {
			mode = 'native-native';
		} else if (Features.HAS_TRUE_NATIVE_FULLSCREEN && !isNative) {
			mode = 'plugin-native';
		} else if (t.usePluginFullScreen && Features.SUPPORT_POINTER_EVENTS) {
			mode = 'plugin-click';
		}

		t.fullscreenMode = mode;
		return mode;
	},

	/**
	 *
	 */
	enterFullScreen ()  {
		const
			t = this,
			isNative = t.media.rendererName !== null && /(html5|native)/i.test(t.media.rendererName),
			containerStyles = getComputedStyle(t.getElement(t.container))
		;

		if (!t.isVideo) {
			return;
		}

		// iOS allows playing fullscreen ONLY on `video` tag, so check if the source can go fullscreen on iOS
		// and if the player can play the current source
		if (t.options.useFakeFullscreen === false && Features.IS_IOS && Features.HAS_IOS_FULLSCREEN &&
			typeof t.media.originalNode.webkitEnterFullscreen === 'function' &&
			t.media.originalNode.canPlayType(getTypeFromFile(t.media.getSrc()))) {
			t.media.originalNode.webkitEnterFullscreen();
			return;
		}

		// set it to not show scroll bars so 100% will work
		addClass(document.documentElement, `${t.options.classPrefix}fullscreen`);
		addClass(t.getElement(t.container), `${t.options.classPrefix}container-fullscreen`);

		// store sizing
		t.normalHeight = parseFloat(containerStyles.height);
		t.normalWidth = parseFloat(containerStyles.width);

		// attempt to do true fullscreen
		if (t.fullscreenMode === 'native-native' || t.fullscreenMode === 'plugin-native') {
			Features.requestFullScreen(t.getElement(t.container));

			if (t.isInIframe) {
				// sometimes exiting from fullscreen doesn't work
				// notably in Chrome <iframe>. Fixed in version 17
				setTimeout(function checkFullscreen () {

					if (t.isNativeFullScreen) {
						let percentErrorMargin = 0.002, // 0.2%
							windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
							screenWidth = screen.width,
							absDiff = Math.abs(screenWidth - windowWidth),
							marginError = screenWidth * percentErrorMargin;

						// check if the video is suddenly not really fullscreen
						if (absDiff > marginError) {
							// manually exit
							t.exitFullScreen();
						} else {
							// test again
							setTimeout(checkFullscreen, 500);
						}
					}
				}, 1000);
			}
		}

		// make full size
		t.getElement(t.container).style.width = '100%';
		t.getElement(t.container).style.height = '100%';

		// Only needed for safari 5.1 native full screen, can cause display issues elsewhere
		// Actually, it seems to be needed for IE8, too
		t.containerSizeTimeout = setTimeout(() => {
			t.getElement(t.container).style.width = '100%';
			t.getElement(t.container).style.height = '100%';
			t.setControlsSize();
		}, 500);

		if (isNative) {
			t.node.style.width = '100%';
			t.node.style.height = '100%';
		} else {
			const elements = t.getElement(t.container).querySelectorAll('embed, object, video'), total = elements.length;
			for (let i = 0; i < total; i++) {
				elements[i].style.width = '100%';
				elements[i].style.height = '100%';
			}
		}

		if (t.options.setDimensions && typeof t.media.setSize === 'function') {
			t.media.setSize(screen.width, screen.height);
		}

		const layers = t.getElement(t.layers).children, total = layers.length;
		for (let i = 0; i < total; i++) {
			layers[i].style.width = '100%';
			layers[i].style.height = '100%';
		}

		if (t.fullscreenBtn) {
			removeClass(t.fullscreenBtn, `${t.options.classPrefix}fullscreen`);
			addClass(t.fullscreenBtn, `${t.options.classPrefix}unfullscreen`);
		}

		t.setControlsSize();
		t.isFullScreen = true;

		const
			zoomFactor = Math.min(screen.width / t.width, screen.height / t.height),
			captionText = t.getElement(t.container).querySelector(`.${t.options.classPrefix}captions-text`)
		;
		if (captionText) {
			captionText.style.fontSize = `${(zoomFactor * 100)}%`;
			captionText.style.lineHeight = 'normal';
			t.getElement(t.container).querySelector(`.${t.options.classPrefix}captions-position`).style.bottom =
				`${(((screen.height - t.normalHeight) / 2) - (t.getElement(t.controls).offsetHeight / 2) + zoomFactor + 15)}px`;
		}
		const event = createEvent('enteredfullscreen', t.getElement(t.container));
		t.getElement(t.container).dispatchEvent(event);
	},

	/**
	 *
	 */
	exitFullScreen ()  {
		const
			t = this,
			isNative = t.media.rendererName !== null && /(native|html5)/i.test(t.media.rendererName)
		;

		if (!t.isVideo) {
			return;
		}

		// Prevent container from attempting to stretch a second time
		clearTimeout(t.containerSizeTimeout);

		// come out of native fullscreen
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && (Features.IS_FULLSCREEN || t.isFullScreen)) {
			Features.cancelFullScreen();
		}

		// restore scroll bars to document
		removeClass(document.documentElement, `${t.options.classPrefix}fullscreen`);
		removeClass(t.getElement(t.container), `${t.options.classPrefix}container-fullscreen`);

		if (t.options.setDimensions) {
			t.getElement(t.container).style.width = `${t.normalWidth}px`;
			t.getElement(t.container).style.height = `${t.normalHeight}px`;

			if (isNative) {
				t.node.style.width = `${t.normalWidth}px`;
				t.node.style.height = `${t.normalHeight}px`;
			} else {
				const elements = t.getElement(t.container).querySelectorAll('embed, object, video'), total = elements.length;
				for (let i = 0; i < total; i++) {
					elements[i].style.width = `${t.normalWidth}px`;
					elements[i].style.height = `${t.normalHeight}px`;
				}
			}

			if (typeof t.media.setSize === 'function') {
				t.media.setSize(t.normalWidth, t.normalHeight);
			}

			const layers = t.getElement(t.layers).children, total = layers.length;
			for (let i = 0; i < total; i++) {
				layers[i].style.width = `${t.normalWidth}px`;
				layers[i].style.height = `${t.normalHeight}px`;
			}
		}

		if (t.fullscreenBtn) {
			removeClass(t.fullscreenBtn, `${t.options.classPrefix}unfullscreen`);
			addClass(t.fullscreenBtn, `${t.options.classPrefix}fullscreen`);
		}

		t.setControlsSize();
		t.isFullScreen = false;

		const captionText = t.getElement(t.container).querySelector(`.${t.options.classPrefix}captions-text`);
		if (captionText) {
			captionText.style.fontSize = '';
			captionText.style.lineHeight = '';
			t.getElement(t.container).querySelector(`.${t.options.classPrefix}captions-position`).style.bottom = '';
		}
		const event = createEvent('exitedfullscreen', t.getElement(t.container));
		t.getElement(t.container).dispatchEvent(event);
	}
});
