'use strict';

import {config} from '../player';
import MediaElementPlayer from '../player';
import i18n from '../core/i18n';

/**
 * Speed button
 *
 * This feature creates a button to speed media in different levels.
 */


// Feature configuration
Object.assign(config, {
	/**
	 * The speeds media can be accelerated
	 *
	 * Supports an array of float values or objects with format
	 * [{name: 'Slow', value: '0.75'}, {name: 'Normal', value: '1.00'}, ...]
	 * @type {{String[]|Object[]}}
	 */
	speeds: ['2.00', '1.50', '1.25', '1.00', '0.75'],
	/**
	 * @type {String}
	 */
	defaultSpeed: '1.00',
	/**
	 * @type {String}
	 */
	speedChar: 'x',
	/**
	 * @type {String}
	 */
	speedText: ''
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
	buildspeed: function (player, controls, layers, media)  {
		let
			t = this,
			isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null
			;

		if (!isNative) {
			return;
		}

		let
			playbackSpeed,
			inputId,
			speedTitle = t.options.speedText ? t.options.speedText : i18n.t('mejs.speed-rate'),
			speeds = [],
			defaultInArray = false,
			getSpeedNameFromValue = (value) => {
				for (let i = 0, len = speeds.length; i < len; i++) {
					if (speeds[i].value === value) {
						return speeds[i].name;
					}
				}
			}
		;

		for (let i = 0, len = t.options.speeds.length; i < len; i++) {
			let s = t.options.speeds[i];

			if (typeof(s) === 'string') {
				speeds.push({
					name: `${s}${t.options.speedChar}`,
					value: s
				});
				if (s === t.options.defaultSpeed) {
					defaultInArray = true;
				}
			}
			else {
				speeds.push(s);
				if (s.value === t.options.defaultSpeed) {
					defaultInArray = true;
				}
			}
		}

		if (!defaultInArray) {
			speeds.push({
				name: t.options.defaultSpeed + t.options.speedChar,
				value: t.options.defaultSpeed
			});
		}

		speeds.sort((a, b) => {
			return parseFloat(b.value) - parseFloat(a.value);
		});

		t.clearspeed(player);

		player.speedButton =
			$(`<div class="${t.options.classPrefix}button ${t.options.classPrefix}speed-button">` +
				`<button type="button" aria-controls="${t.id}" title="${speedTitle}" ` +
					`aria-label="${speedTitle}">${getSpeedNameFromValue(t.options.defaultSpeed)}</button>` +
				`<div class="${t.options.classPrefix}speed-selector ${t.options.classPrefix}offscreen">` +
					`<ul class="${t.options.classPrefix}speed-selector-list"></ul>` +
				`</div>` +
			`</div>`)
		.appendTo(controls);

		for (let i = 0, il = speeds.length; i<il; i++) {

			inputId = `${t.id}-speed-${speeds[i].value}`;

			player.speedButton.find('ul').append(
				$(`<li class="${t.options.classPrefix}speed-selector-list-item">` +
					`<input class="${t.options.classPrefix}speed-selector-input" type="radio" name="${t.id}_speed"` +
					`disabled="disabled" value="${speeds[i].value}" id="${inputId}"  ` +
					`${(speeds[i].value === t.options.defaultSpeed ? ' checked="checked"' : '')}/>` +
					`<label class="${t.options.classPrefix}speed-selector-label` +
						`${(speeds[i].value === t.options.defaultSpeed ? ` ${t.options.classPrefix}speed-selected` : '')}">` +
						`${speeds[i].name}</label>` +
				`</li>`)
			);
		}

		playbackSpeed = t.options.defaultSpeed;

		// Enable inputs after they have been appended to controls to avoid tab and up/down arrow focus issues
		$.each(player.speedButton.find('input[type="radio"]'), function() {
			$(this).prop('disabled', false);
		});

		player.speedSelector = player.speedButton.find(`.${t.options.classPrefix}speed-selector`);

		// hover or keyboard focus
		player.speedButton
		.on('mouseenter focusin', () => {
			player.speedSelector.removeClass(`${t.options.classPrefix}offscreen`)
				.height(player.speedSelector.find('ul').outerHeight(true))
				.css('top', (-1 * player.speedSelector.height()) + 'px')
			;
		})
		.on('mouseleave focusout', (e) => {
			player.speedSelector.addClass(`${t.options.classPrefix}offscreen`);
		})
		// handle clicks to the language radio buttons
		.on('click', 'input[type=radio]', function() {
			let
				self = $(this),
				newSpeed = self.val()
				;

			playbackSpeed = newSpeed;
			media.playbackRate = parseFloat(newSpeed);
			player.speedButton
				.find('button').html(getSpeedNameFromValue(newSpeed))
				.end()
				.find(`.${t.options.classPrefix}speed-selected`)
				.removeClass(`${t.options.classPrefix}speed-selected`)
				.end()
				.find('input[type="radio"]')
			;

			self.prop('checked', true)
				.siblings(`.${t.options.classPrefix}speed-selector-label`)
				.addClass(`${t.options.classPrefix}speed-selected`);
		})
		.on('click', `.${t.options.classPrefix}speed-selector-label`, function() {
			$(this).siblings('input[type="radio"]').trigger('click');
		})
		//Allow up/down arrow to change the selected radio without changing the volume.
		.on('keydown', (e) => {
			e.stopPropagation();
		});

		media.addEventListener('loadedmetadata', (e) => {
			if (playbackSpeed) {
				media.playbackRate = parseFloat(playbackSpeed);
			}
		}, true);
	},
	/**
	 * Feature destructor.
	 *
	 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 */
	clearspeed: function (player)  {
		if (player) {
			if (player.speedButton) {
				player.speedButton.remove();
			}
			if (player.speedSelector) {
				player.speedSelector.remove();
			}
		}
	}
});