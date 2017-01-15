'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';

/**
 * Postroll plugin
 *
 * This feature allows the injection of any HTML content in an independent layer once the media finished.
 * To activate it, one of the nodes contained in the `<video>` tag must be
 * `<link href="/path/to/action_to_display_content" rel="postroll">`
 */


// Feature configuration
Object.assign(config, {
	/**
	 * @type {String}
	 */
	postrollCloseText: ''
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
	buildpostroll: function (player, controls, layers, media)  {
		let
			t = this,
			postrollTitle = t.options.postrollCloseText ? t.options.postrollCloseText : i18n.t('mejs.close'),
			postrollLink = t.container.find('link[rel="postroll"]').attr('href');

		if (postrollLink !== undefined) {
			player.postroll =
				$(`<div class="${t.options.classPrefix}postroll-layer ${t.options.classPrefix}layer">` +
					`<a class="${t.options.classPrefix}postroll-close" onclick="$(this).parent().hide();return false;">` +
						`${postrollTitle}` +
					`</a>` +
					`<div class="${t.options.classPrefix}postroll-layer-content"></div>` +
				`</div>`)
				.prependTo(layers).hide();

			t.media.addEventListener('ended', () => {
				$.ajax({
					dataType: 'html',
					url: postrollLink,
					success: function (data, textStatus)  {
						layers.find(`.${t.options.classPrefix}postroll-layer-content`).html(data);
					}
				});
				player.postroll.show();
			}, false);
		}
	}
});