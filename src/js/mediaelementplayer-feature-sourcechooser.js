/**
 * Source chooser button
 *
 * This feature creates a button to speed media in different levels.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		sourcechooserText: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildsourcechooser: function (player, controls, layers, media) {

			var
				t = this,
				sourceTitle = t.options.sourcechooserText ? t.options.sourcechooserText : mejs.i18n.t('mejs.source-chooser'),
				hoverTimeout
			;

			// add to list
			var sources = [];

			for (var j in this.node.children) {
				var s = this.node.children[j];
				if (s.nodeName === 'SOURCE') {
					sources.push(s);
				}
			}

			if (sources.length <= 1) {
				return;
			}

			player.sourcechooserButton =
				$('<div class="mejs-button mejs-sourcechooser-button">' +
					'<button type="button" role="button" aria-haspopup="true" aria-owns="' + t.id + '" title="' + sourceTitle + '" aria-label="' + sourceTitle + '"></button>' +
					'<div class="mejs-sourcechooser-selector mejs-offscreen" role="menu" aria-expanded="false" aria-hidden="true">' +
					'<ul>' +
					'</ul>' +
					'</div>' +
					'</div>')
				.appendTo(controls)

				// hover
				.hover(function () {
					clearTimeout(hoverTimeout);
					player.showSourcechooserSelector();
				}, function () {
					hoverTimeout = setTimeout(function () {
						player.hideSourcechooserSelector();
					}, 500);
				})

				// keyboard menu activation
				.on('keydown', function (e) {
					var keyCode = e.keyCode;

					switch (keyCode) {
						case 32: // space
							if (!mejs.MediaFeatures.isFirefox) { // space sends the click event in Firefox
								player.showSourcechooserSelector();
							}
							$(this).find('.mejs-sourcechooser-selector')
							.find('input[type=radio]:checked').first().focus();
							break;
						case 13: // enter
							player.showSourcechooserSelector();
							$(this).find('.mejs-sourcechooser-selector')
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
				.on('focusout', mejs.Utility.debounce(function (e) { // Safari triggers focusout multiple times
					// Firefox does NOT support e.relatedTarget to see which element
					// just lost focus, so wait to find the next focused element
					setTimeout(function () {
						var parent = $(document.activeElement).closest('.mejs-sourcechooser-selector');
						if (!parent.length) {
							// focus is outside the control; close menu
							player.hideSourcechooserSelector();
						}
					}, 0);
				}, 100))

				// handle clicks to the source radio buttons
				.delegate('input[type=radio]', 'click', function () {
					// set aria states
					$(this).attr('aria-selected', true).attr('checked', 'checked');
					$(this).closest('.mejs-sourcechooser-selector').find('input[type=radio]').not(this).attr('aria-selected', 'false').removeAttr('checked');

					var src = this.value;

					if (media.currentSrc !== src) {
						var currentTime = media.currentTime;
						var paused = media.paused;
						media.pause();
						media.setSrc(src);
						media.load();

						media.addEventListener('loadedmetadata', function (e) {
							media.currentTime = currentTime;
						}, true);

						var canPlayAfterSourceSwitchHandler = function (e) {
							if (!paused) {
								media.play();
							}
							media.removeEventListener("canplay", canPlayAfterSourceSwitchHandler, true);
						};
						media.addEventListener('canplay', canPlayAfterSourceSwitchHandler, true);
						media.load();
					}
				})

				// Handle click so that screen readers can toggle the menu
				.delegate('button', 'click', function (e) {
					if ($(this).siblings('.mejs-sourcechooser-selector').hasClass('mejs-offscreen')) {
						player.showSourcechooserSelector();
						$(this).siblings('.mejs-sourcechooser-selector').find('input[type=radio]:checked').first().focus();
					} else {
						player.hideSourcechooserSelector();
					}
				});

			for (var i in sources) {
				var src = sources[i];
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
		addSourceButton: function (src, label, type, isCurrent) {
			var t = this;
			if (label === '' || label === undefined) {
				label = src;
			}
			type = type.split('/')[1];

			t.sourcechooserButton.find('ul').append(
				$('<li>' +
					'<input type="radio" name="' + t.id + '_sourcechooser" id="' + t.id + '_sourcechooser_' + label + type + '" role="menuitemradio" value="' + src + '" ' + (isCurrent ? 'checked="checked"' : '') + 'aria-selected="' + isCurrent + '"' + ' />' +
					'<label for="' + t.id + '_sourcechooser_' + label + type + '" aria-hidden="true">' + label + ' (' + type + ')</label>' +
					'</li>')
			);

			t.adjustSourcechooserBox();

		},

		/**
		 *
		 */
		adjustSourcechooserBox: function () {
			var t = this;
			// adjust the size of the outer box
			t.sourcechooserButton.find('.mejs-sourcechooser-selector').height(
				t.sourcechooserButton.find('.mejs-sourcechooser-selector ul').outerHeight(true)
			);
		},

		/**
		 *
		 */
		hideSourcechooserSelector: function () {

			var t = this;

			if (t.sourcechooserButton === undefined || !t.sourcechooserButton.find('.mejs-sourcechooser-selector').find('input[type=radio]').length) {
				return;
			}

			this.sourcechooserButton.find('.mejs-sourcechooser-selector')
			.addClass('mejs-offscreen')
			.attr('aria-expanded', 'false')
			.attr('aria-hidden', 'true')
			.find('input[type=radio]') // make radios not focusable
			.attr('tabindex', '-1');
		},

		/**
		 *
		 */
		showSourcechooserSelector: function () {

			var t = this;

			if (t.sourcechooserButton === undefined || !t.sourcechooserButton.find('.mejs-sourcechooser-selector').find('input[type=radio]').length) {
				return;
			}

			this.sourcechooserButton.find('.mejs-sourcechooser-selector')
			.removeClass('mejs-offscreen')
			.attr('aria-expanded', 'true')
			.attr('aria-hidden', 'false')
			.find('input[type=radio]')
			.attr('tabindex', '0');
		}
	});

})(mejs.$);
