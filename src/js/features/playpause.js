'use strict';

import document from 'global/document';
import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';
import {isString} from '../utils/general';
import {addClass, removeClass} from '../utils/dom';
import {generateControlButton} from '../utils/generate';

/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */

// Feature configuration
Object.assign(config, {
	/**
	 * @type {?String}
	 */
	playText: null,
	/**
	 * @type {?String}
	 */
	pauseText: null
});

Object.assign(MediaElementPlayer.prototype, {
	/**
	 * Feature constructor.
	 *
	 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 * @param {HTMLElement} controls
	 * @param {HTMLElement} layers
	 * @param {HTMLElement} media
	 * @public
	 */
	buildplaypause (player, controls, layers, media)  {
		const
			t = this,
			op = t.options,
			playTitle = isString(op.playText) ? op.playText : i18n.t('mejs.play'),
			pauseTitle = isString(op.pauseText) ? op.pauseText : i18n.t('mejs.pause'),
			play = document.createElement('div')
		;

		play.className = `${t.options.classPrefix}button ${t.options.classPrefix}playpause-button ${t.options.classPrefix}play`;
		play.innerHTML = generateControlButton(t.id, pauseTitle, playTitle, `${t.media.options.iconSprite}`, ['icon-play', 'icon-pause', 'icon-replay'], `${t.options.classPrefix}`);
		play.addEventListener('click', () => {
			if (t.paused) {
				t.play(true);
			} else {
				t.pause(true);
			}
		});

		const playBtn = play.querySelector('button');
		t.addControlElement(play, 'playpause');

		/**
		 * @private
		 * @param {String} which - token to determine new state of button
		 */
		function togglePlayPause (which) {
			removeClass(play, `${t.options.classPrefix}play`);
			removeClass(play, `${t.options.classPrefix}replay`);
			removeClass(play, `${t.options.classPrefix}pause`);

			if ('play' === which) {
				addClass(play, `${t.options.classPrefix}pause`);
				playBtn.setAttribute('title', pauseTitle);
				playBtn.setAttribute('aria-label', pauseTitle);
			} else if('pse' === which) {
				addClass(play, `${t.options.classPrefix}play`);
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
			} else {
				addClass(play, `${t.options.classPrefix}replay`);
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
			}
		}

		togglePlayPause('pse');

		media.addEventListener('loadedmetadata', () => {
			// `loadedmetadata` in Flash is executed simultaneously with `play`, so avoid it
			if (media.rendererName.indexOf('flash') === -1) {
				togglePlayPause('pse');
			}
		});
		media.addEventListener('play', () => {
			togglePlayPause('play');
		});
		media.addEventListener('playing', () => {
			togglePlayPause('play');
		});
		media.addEventListener('pause', () => {
			togglePlayPause('pse');
		});
		media.addEventListener('ended', () => {
			if (!player.options.loop) {
				// timeout for IE11
				setTimeout(() => {
					togglePlayPause('replay');
				}, 0);
			}
		});
	}
});
