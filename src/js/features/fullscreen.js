'use strict';

import window from 'global/window';
import document from 'global/document';
import i18n from '../core/i18n';
import {config} from '../player';
import MediaElementPlayer from '../player';
import * as Features from '../utils/constants';
import {isString} from '../utils/general';


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
	fullscreenText: null
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
	 * (4) 'plugin-click'   Flash 1 - click through with pointer events
	 * (5) 'plugin-hover'   Flash 2 - hover popup in flash (IE6-8)
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
	 * @param {$} controls
	 * @param {$} layers
	 * @param {HTMLElement} media
	 */
	buildfullscreen: function (player, controls, layers, media)  {

		if (!player.isVideo) {
			return;
		}

		player.isInIframe = (window.location !== window.parent.location);

		// detect on start
		media.addEventListener('loadstart', () => {
			player.detectFullscreenMode();
		});

		let hideTimeout = null;

		// build button
		const
			t = this,
			fullscreenTitle = isString(t.options.fullscreenText) ? t.options.fullscreenText : i18n.t('mejs.fullscreen'),
			fullscreenBtn =
				$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}fullscreen-button">` +
					`<button type="button" aria-controls="${t.id}" title="${fullscreenTitle}" aria-label="${fullscreenTitle}" tabindex="0"></button>` +
				`</div>`)
		;

		t.addControlElement(fullscreenBtn, 'fullscreen');

		fullscreenBtn
			.on('click', () => {

				// toggle fullscreen
				let isFullScreen = (Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN) || player.isFullScreen;

				if (isFullScreen) {
					player.exitFullScreen();
				} else {
					player.enterFullScreen();
				}
			})
			.on('mouseover', () => {

				// very old browsers with a plugin
				if (t.fullscreenMode === 'plugin-hover') {
					if (hideTimeout !== null) {
						clearTimeout(hideTimeout);
						hideTimeout = null;
					}

					let buttonPos = fullscreenBtn.offset(),
						containerPos = player.container.offset();

					media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, true);
				}

			})
			.on('mouseout', () => {

				if (t.fullscreenMode === 'plugin-hover') {
					if (hideTimeout !== null) {
						clearTimeout(hideTimeout);
					}

					hideTimeout = setTimeout(() => {
						media.hideFullscreenButton();
					}, 1500);
				}

			});

		player.fullscreenBtn = fullscreenBtn;

		t.globalBind('keydown', (e) => {
			let key = e.which || e.keyCode || 0;
			if (key === 27 && ((Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN) || t.isFullScreen)) {
				player.exitFullScreen();
			}
		});

		t.normalHeight = 0;
		t.normalWidth = 0;

		// setup native fullscreen event
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN) {

			//
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

	/**
	 * Detect the type of fullscreen based on browser's capabilities
	 *
	 * @return {String}
	 */
	detectFullscreenMode: function ()  {

		const
			t = this,
			isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null
		;

		let mode = '';

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && isNative) {
			mode = 'native-native';
		} else if (Features.HAS_TRUE_NATIVE_FULLSCREEN && !isNative) {
			mode = 'plugin-native';
		} else if (t.usePluginFullScreen) {
			if (Features.SUPPORT_POINTER_EVENTS) {
				mode = 'plugin-click';
				// this needs some special setup
				t.createPluginClickThrough();
			} else {
				mode = 'plugin-hover';
			}

		} else {
			mode = 'fullwindow';
		}


		t.fullscreenMode = mode;
		return mode;
	},

	/**
	 *
	 */
	createPluginClickThrough: function ()  {

		const t = this;

		// don't build twice
		if (t.isPluginClickThroughCreated) {
			return;
		}

		// allows clicking through the fullscreen button and controls down directly to Flash

		/*
		 When a user puts his mouse over the fullscreen button, we disable the controls so that mouse events can go down to flash (pointer-events)
		 We then put a divs over the video and on either side of the fullscreen button
		 to capture mouse movement and restore the controls once the mouse moves outside of the fullscreen button
		 */

		let fullscreenIsDisabled = false,
			restoreControls = () => {
				if (fullscreenIsDisabled) {
					// hide the hovers
					for (let i in hoverDivs) {
						hoverDivs[i].hide();
					}

					// restore the control bar
					t.fullscreenBtn.css('pointer-events', '');
					t.controls.css('pointer-events', '');

					// prevent clicks from pausing video
					t.media.removeEventListener('click', t.clickToPlayPauseCallback);

					// store for later
					fullscreenIsDisabled = false;
				}
			},
			hoverDivs = {},
			hoverDivNames = ['top', 'left', 'right', 'bottom'],
			positionHoverDivs = () => {
				let fullScreenBtnOffsetLeft = t.fullscreenBtn.offset().left - t.container.offset().left,
					fullScreenBtnOffsetTop = t.fullscreenBtn.offset().top - t.container.offset().top,
					fullScreenBtnWidth = t.fullscreenBtn.outerWidth(true),
					fullScreenBtnHeight = t.fullscreenBtn.outerHeight(true),
					containerWidth = t.container.width(),
					containerHeight = t.container.height();

				for (let hover in hoverDivs) {
					hover.css({position: 'absolute', top: 0, left: 0}); //, backgroundColor: '#f00'});
				}

				// over video, but not controls
				hoverDivs.top
					.width(containerWidth)
					.height(fullScreenBtnOffsetTop);

				// over controls, but not the fullscreen button
				hoverDivs.left
					.width(fullScreenBtnOffsetLeft)
					.height(fullScreenBtnHeight)
					.css({top: fullScreenBtnOffsetTop});

				// after the fullscreen button
				hoverDivs.right
					.width(containerWidth - fullScreenBtnOffsetLeft - fullScreenBtnWidth)
					.height(fullScreenBtnHeight)
					.css({
						top: fullScreenBtnOffsetTop,
						left: fullScreenBtnOffsetLeft + fullScreenBtnWidth
					});

				// under the fullscreen button
				hoverDivs.bottom
					.width(containerWidth)
					.height(containerHeight - fullScreenBtnHeight - fullScreenBtnOffsetTop)
					.css({top: fullScreenBtnOffsetTop + fullScreenBtnHeight});
			};

		t.globalBind('resize', () => {
			positionHoverDivs();
		});

		for (let i = 0, len = hoverDivNames.length; i < len; i++) {
			hoverDivs[hoverDivNames[i]] = $(`<div class="${t.options.classPrefix}fullscreen-hover" />`)
				.appendTo(t.container).mouseover(restoreControls).hide();
		}

		// on hover, kill the fullscreen button's HTML handling, allowing clicks down to Flash
		t.fullscreenBtn.on('mouseover', () => {

			if (!t.isFullScreen) {

				let
					buttonPos = t.fullscreenBtn.offset(),
					containerPos = t.container.offset()
				;

				// move the button in Flash into place
				t.media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, false);

				// allows click through
				t.fullscreenBtn.css('pointer-events', 'none');
				t.controls.css('pointer-events', 'none');

				// restore click-to-play
				t.media.addEventListener('click', t.clickToPlayPauseCallback);

				// show the divs that will restore things
				for (let i = 0, total = hoverDivs.length; i < total; i++) {
					hoverDivs[i].show();
				}

				positionHoverDivs();

				fullscreenIsDisabled = true;
			}

		});

		// restore controls anytime the user enters or leaves fullscreen
		t.media.addEventListener('fullscreenchange', () => {
			t.isFullScreen = !t.isFullScreen;
			// don't allow plugin click to pause video - messes with
			// plugin's controls
			if (t.isFullScreen) {
				t.media.removeEventListener('click', t.clickToPlayPauseCallback);
			} else {
				t.media.addEventListener('click', t.clickToPlayPauseCallback);
			}
			restoreControls();
		});


		// the mouseout event doesn't work on the fullscren button, because we already killed the pointer-events
		// so we use the document.mousemove event to restore controls when the mouse moves outside the fullscreen button

		t.globalBind('mousemove', (e) => {

			// if the mouse is anywhere but the fullsceen button, then restore it all
			if (fullscreenIsDisabled) {

				const fullscreenBtnPos = t.fullscreenBtn.offset();

				if (e.pageY < fullscreenBtnPos.top || e.pageY > fullscreenBtnPos.top + t.fullscreenBtn.outerHeight(true) ||
					e.pageX < fullscreenBtnPos.left || e.pageX > fullscreenBtnPos.left + t.fullscreenBtn.outerWidth(true)) {
					t.fullscreenBtn.css('pointer-events', '');
					t.controls.css('pointer-events', '');
					fullscreenIsDisabled = false;
				}
			}
		});


		t.isPluginClickThroughCreated = true;
	},
	/**
	 * Feature destructor.
	 *
	 * Always has to be prefixed with `clean` and the name that was used in features list
	 * @param {MediaElementPlayer} player
	 */
	cleanfullscreen: function (player)  {
		player.exitFullScreen();
	},

	/**
	 *
	 */
	enterFullScreen: function ()  {

		const
			t = this,
			isNative = t.media.rendererName !== null && t.media.rendererName.match(/(html5|native)/) !== null
		;

		if (Features.IS_IOS && Features.HAS_IOS_FULLSCREEN && typeof t.media.webkitEnterFullscreen === 'function') {
			t.media.webkitEnterFullscreen();
			return;
		}

		// set it to not show scroll bars so 100% will work
		$(document.documentElement).addClass(`${t.options.classPrefix}fullscreen`);

		// store sizing
		t.normalHeight = t.container.height();
		t.normalWidth = t.container.width();


		// attempt to do true fullscreen
		if (t.fullscreenMode === 'native-native' || t.fullscreenMode === 'plugin-native') {

			Features.requestFullScreen(t.container[0]);

			if (t.isInIframe) {
				// sometimes exiting from fullscreen doesn't work
				// notably in Chrome <iframe>. Fixed in version 17
				setTimeout(function checkFullscreen () {

					if (t.isNativeFullScreen) {
						let percentErrorMargin = 0.002, // 0.2%
							windowWidth = $(window).width(),
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

		} else if (t.fullscreeMode === 'fullwindow') {
			// move into position

		}

		// make full size
		t.container
			.addClass(`${t.options.classPrefix}container-fullscreen`)
			.width('100%')
			.height('100%');

		// Only needed for safari 5.1 native full screen, can cause display issues elsewhere
		// Actually, it seems to be needed for IE8, too
		t.containerSizeTimeout = setTimeout(() => {
			t.container.css({width: '100%', height: '100%'});
			t.setControlsSize();
		}, 500);

		if (isNative) {
			t.$media
				.width('100%')
				.height('100%');
		} else {
			t.container.find('iframe, embed, object, video')
				.width('100%')
				.height('100%');
		}

		if (t.options.setDimensions && typeof t.media.setSize === 'function') {
			t.media.setSize(screen.width, screen.height);
		}

		t.layers.children('div')
			.width('100%')
			.height('100%');

		if (t.fullscreenBtn) {
			t.fullscreenBtn
				.removeClass(`${t.options.classPrefix}fullscreen`)
				.addClass(`${t.options.classPrefix}unfullscreen`);
		}

		t.setControlsSize();
		t.isFullScreen = true;

		let zoomFactor = Math.min(screen.width / t.width, screen.height / t.height);
		t.container.find(`.${t.options.classPrefix}captions-text`).css('font-size', zoomFactor * 100 + '%');
		t.container.find(`.${t.options.classPrefix}captions-text`).css('line-height', 'normal');
		t.container.find(`.${t.options.classPrefix}captions-position`).css('bottom', '45px');

		t.container.trigger('enteredfullscreen');
	},

	/**
	 *
	 */
	exitFullScreen: function ()  {

		const
			t = this,
			isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null
			;

		// Prevent container from attempting to stretch a second time
		clearTimeout(t.containerSizeTimeout);

		// come out of native fullscreen
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && (Features.IS_FULLSCREEN || t.isFullScreen)) {
			Features.cancelFullScreen();
		}

		// restore scroll bars to document
		$(document.documentElement).removeClass(`${t.options.classPrefix}fullscreen`);

		t.container.removeClass(`${t.options.classPrefix}container-fullscreen`);

		if (t.options.setDimensions) {
			t.container
				.width(t.normalWidth)
				.height(t.normalHeight);
			if (isNative) {
				t.$media
				.width(t.normalWidth)
				.height(t.normalHeight);
			} else {
				t.container.find('iframe, embed, object, video')
					.width(t.normalWidth)
					.height(t.normalHeight);
			}

			if (typeof t.media.setSize === 'function') {
				t.media.setSize(t.normalWidth, t.normalHeight);
			}

			t.layers.children('div')
				.width(t.normalWidth)
				.height(t.normalHeight);
		}

		t.fullscreenBtn
			.removeClass(`${t.options.classPrefix}unfullscreen`)
			.addClass(`${t.options.classPrefix}fullscreen`);

		t.setControlsSize();
		t.isFullScreen = false;

		t.container.find(`.${t.options.classPrefix}captions-text`).css('font-size', '');
		t.container.find(`.${t.options.classPrefix}captions-text`).css('line-height', '');
		t.container.find(`.${t.options.classPrefix}captions-position`).css('bottom', '');

		t.container.trigger('exitedfullscreen');
	}
});
