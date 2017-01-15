'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {debounce} from '../utils/general';

/**
 * Source chooser button
 *
 * This feature creates a button to speed media in different levels.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * @type {String}
	 */
	sourcechooserText: ''
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
	buildsourcechooser: function (player, controls, layers, media)  {

		let
			t = this,
			sourceTitle = t.options.sourcechooserText ? t.options.sourcechooserText : i18n.t('mejs.source-chooser'),
			hoverTimeout
		;

		// add to list
		let sources = [];

		for (let j in this.node.children) {
			let s = this.node.children[j];
			if (s.nodeName === 'SOURCE') {
				sources.push(s);
			}
		}

		if (sources.length <= 1) {
			return;
		}

		player.sourcechooserButton =
			$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}sourcechooser-button">` +
				`<button type="button" role="button" aria-haspopup="true" aria-owns="${t.id}" title="${sourceTitle}"` +
					`aria-label="${sourceTitle}"></button>` +
				`<div class="${t.options.classPrefix}sourcechooser-selector ${t.options.classPrefix}offscreen" role="menu"` +
					`aria-expanded="false" aria-hidden="true">` +
					`<ul></ul>` +
				`</div>` +
			`</div>`)
			.appendTo(controls)

			// hover
			.hover(() => {
				clearTimeout(hoverTimeout);
				player.showSourcechooserSelector();
			}, () => {
				hoverTimeout = setTimeout(() => {
					player.hideSourcechooserSelector();
				}, 500);
			})

			// keyboard menu activation
			.on('keydown', function(e) {
				let keyCode = e.which || e.keyCode || 0;

				switch (keyCode) {
					case 32: // space
						if (!mejs.MediaFeatures.isFirefox) { // space sends the click event in Firefox
							player.showSourcechooserSelector();
						}
						$(this).find(`.${t.options.classPrefix}sourcechooser-selector`)
							.find('input[type=radio]:checked').first().focus();
						break;
					case 13: // enter
						player.showSourcechooserSelector();
						$(this).find(`.${t.options.classPrefix}sourcechooser-selector`)
							.find('input[type=radio]:checked').first().focus();
						break;
					case 27: // esc
						player.hideSourcechooserSelector();
						$(this).find('button').focus();
						break;
					default:
						return true;
				}
			})

			// close menu when tabbing away
			.on('focusout', debounce(() => { // Safari triggers focusout multiple times
				// Firefox does NOT support e.relatedTarget to see which element
				// just lost focus, so wait to find the next focused element
				setTimeout(() => {
					let parent = $(document.activeElement).closest(`.${t.options.classPrefix}sourcechooser-selector`);
					if (!parent.length) {
						// focus is outside the control; close menu
						player.hideSourcechooserSelector();
					}
				}, 0);
			}, 100))

			// handle clicks to the source radio buttons
			.on('click', 'input[type=radio]', function() {
				// set aria states
				$(this).attr('aria-selected', true).attr('checked', 'checked');
				$(this).closest(`.${t.options.classPrefix}sourcechooser-selector`)
					.find('input[type=radio]')
					.not(this)
					.attr('aria-selected', 'false')
					.removeAttr('checked');

				let src = this.value;

				if (media.currentSrc !== src) {
					let currentTime = media.currentTime;
					let paused = media.paused;
					media.pause();
					media.setSrc(src);
					media.load();

					media.addEventListener('loadedmetadata', (e) => {
						media.currentTime = currentTime;
					}, true);

					let canPlayAfterSourceSwitchHandler = (e) => {
						if (!paused) {
							media.play();
						}
						media.removeEventListener('canplay', canPlayAfterSourceSwitchHandler, true);
					};
					media.addEventListener('canplay', canPlayAfterSourceSwitchHandler, true);
					media.load();
				}
			})

			// Handle click so that screen readers can toggle the menu
			.on('click', 'button', function() {
				if ($(this).siblings(`.${t.options.classPrefix}sourcechooser-selector`).hasClass(`${t.options.classPrefix}offscreen`)) {
					player.showSourcechooserSelector();
					$(this).siblings(`.${t.options.classPrefix}sourcechooser-selector`)
						.find('input[type=radio]:checked').first().focus();
				} else {
					player.hideSourcechooserSelector();
				}
			});

		for (let i in sources) {
			let src = sources[i];
			if (src.type !== undefined && src.nodeName === 'SOURCE' && media.canPlayType !== null) {
				player.addSourceButton(src.src, src.title, src.type, media.src === src.src);
			}
		}

	},

	/**
	 *
	 * @param {String} src
	 * @param {String} label
	 * @param {String} type
	 * @param {Boolean} isCurrent
	 */
	addSourceButton: function (src, label, type, isCurrent)  {
		let t = this;
		if (label === '' || label === undefined) {
			label = src;
		}
		type = type.split('/')[1];

		t.sourcechooserButton.find('ul').append(
			$(`<li>` +
				`<input type="radio" name="${t.id}_sourcechooser" id="${t.id}_sourcechooser_${label}${type}"` +
				`role="menuitemradio" value="${src}" ${(isCurrent ? 'checked="checked"' : '')} aria-selected="${isCurrent}"/>` +
				`<label for="${t.id}_sourcechooser_${label}${type}" aria-hidden="true">${label} (${type})</label>` +
			`</li>`)
		);

		t.adjustSourcechooserBox();

	},

	/**
	 *
	 */
	adjustSourcechooserBox: function ()  {
		let t = this;
		// adjust the size of the outer box
		t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector`).height(
			t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector ul`).outerHeight(true)
		);
	},

	/**
	 *
	 */
	hideSourcechooserSelector: function ()  {

		let t = this;

		if (t.sourcechooserButton === undefined ||
			!t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector`).find('input[type=radio]').length) {
			return;
		}

		t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector`)
			.addClass(`${t.options.classPrefix}offscreen`)
			.attr('aria-expanded', 'false')
			.attr('aria-hidden', 'true')
			.find('input[type=radio]') // make radios not focusable
			.attr('tabindex', '-1');
	},

	/**
	 *
	 */
	showSourcechooserSelector: function ()  {

		let t = this;

		if (t.sourcechooserButton === undefined || !t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector`).find('input[type=radio]').length) {
			return;
		}

		t.sourcechooserButton.find(`.${t.options.classPrefix}sourcechooser-selector`)
			.removeClass(`${t.options.classPrefix}offscreen`)
			.attr('aria-expanded', 'true')
			.attr('aria-hidden', 'false')
			.find('input[type=radio]')
			.attr('tabindex', '0');
	}
});