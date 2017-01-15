'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';

/**
 * Jump forward button
 *
 * This feature creates a button to forward media a specific number of seconds.
 */

// Jump forward button

Object.assign(config, {
	/**
	 * @type {Number}
	 */
	jumpForwardInterval: 30,
	/**
	 * @type {String}
	 */
	jumpForwardText: ''
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
	buildjumpforward: function (player, controls, layers, media)  {
		let
			t = this,
			defaultTitle = i18n.t('mejs.time-jump-forward', t.options.jumpForwardInterval),
			forwardTitle = t.options.jumpForwardText ? t.options.jumpForwardText.replace('%1', t.options.jumpForwardInterval) : defaultTitle;

		$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}jump-forward-button">` +
			`<button type="button" aria-controls="${t.id}" title="${forwardTitle}" ` +
			`aria-label="${forwardTitle}">${t.options.jumpForwardInterval}</button>` +
		`</div>`)
		// append it to the toolbar
		.appendTo(controls)
		// add a click toggle event
		.click(function() {
			if (media.duration) {
				media.setCurrentTime(Math.min(media.currentTime + t.options.jumpForwardInterval, media.duration));
				$(this).find('button').blur();
			}
		});
	}
});