'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';

/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * @type {String}
	 */
	playText: '',
	/**
	 * @type {String}
	 */
	pauseText: ''
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
	buildplaypause: function (player, controls, layers, media)  {
		let
			t = this,
			op = t.options,
			playTitle = op.playText ? op.playText : i18n.t('mejs.play'),
			pauseTitle = op.pauseText ? op.pauseText : i18n.t('mejs.pause'),
			play =
				$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}playpause-button ` +
					`${t.options.classPrefix}play">` +
					`<button type="button" aria-controls="${t.id}" title="${playTitle}" aria-label="${pauseTitle}"></button>` +
				`</div>`)
				.appendTo(controls)
				.click(() => {
					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}
				}),
			play_btn = play.find('button');


		/**
		 * @private
		 * @param {String} which - token to determine new state of button
		 */
		function togglePlayPause (which) {
			if ('play' === which) {
				play.removeClass(`${t.options.classPrefix}play`)
				.removeClass(`${t.options.classPrefix}replay`)
				.addClass(`${t.options.classPrefix}pause`);
				play_btn.attr({
					'title': pauseTitle,
					'aria-label': pauseTitle
				});
			} else {
				play.removeClass(`${t.options.classPrefix}pause`)
				.removeClass(`${t.options.classPrefix}replay`)
				.addClass(`${t.options.classPrefix}play`);
				play_btn.attr({
					'title': playTitle,
					'aria-label': playTitle
				});
			}
		}

		togglePlayPause('pse');

		media.addEventListener('play', () => {
			togglePlayPause('play');
		}, false);
		media.addEventListener('playing', () => {
			togglePlayPause('play');
		}, false);


		media.addEventListener('pause', () => {
			togglePlayPause('pse');
		}, false);
		media.addEventListener('paused', () => {
			togglePlayPause('pse');
		}, false);

		media.addEventListener('ended', () => {

			if (!player.options.loop) {
				play.removeClass(`${t.options.classPrefix}pause`)
				.removeClass(`${t.options.classPrefix}play`)
				.addClass(`${t.options.classPrefix}replay`);
			}

		}, false);
	}
});


