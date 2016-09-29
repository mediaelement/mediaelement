/**
 * Jump forward button
 *
 * This feature creates a button to forward media a specific number of seconds.
 */
(function ($) {
	// Jump forward button

	$.extend(mejs.MepDefaults, {
		/**
		 * @type {Number}
		 */
		jumpForwardInterval: 30,
		/**
		 * @type {String}
		 */
		jumpForwardText: ''
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
		buildjumpforward: function (player, controls, layers, media) {
			var
				t = this,
				forwardTitle = t.options.jumpForwardText ? t.options.jumpForwardText : mejs.i18n.t('mejs.time-jump-forward'),
				// Replace %1 with skip back interval
				forwardText = forwardTitle.replace('%1', forwardTitle),
				// create the loop button
				loop =
					$('<div class="mejs-button mejs-jump-forward-button">' +
						'<button type="button" aria-controls="' + t.id + '" title="' + forwardText + '" aria-label="' + forwardText + '">' + t.options.jumpForwardInterval + '</button>' +
						'</div>')
					// append it to the toolbar
					.appendTo(controls)
					// add a click toggle event
					.click(function () {
						if (media.duration) {
							media.setCurrentTime(Math.min(media.currentTime + t.options.jumpForwardInterval, media.duration));
							$(this).find('button').blur();
						}
					});
		}
	});

})(mejs.$);
