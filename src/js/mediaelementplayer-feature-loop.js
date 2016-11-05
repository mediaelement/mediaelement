/**
 * Loop button
 *
 * This feature creates a loop button in the control bar to toggle its behavior. It will restart media once finished
 * if activated
 */
(function($) {

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
		buildloop: function(player, controls, layers, media) {
			var
				t = this,
				// create the loop button
				loop =
				$('<div class="mejs__button mejs__loop-button ' + ((player.options.loop) ? 'mejs__loop-on' : 'mejs__loop-off') + '">' +
					'<button type="button" aria-controls="' + t.id + '" title="Toggle Loop" aria-label="Toggle Loop"></button>' +
				'</div>')
				// append it to the toolbar
				.appendTo(controls)
				// add a click toggle event
				.click(function() {
					player.options.loop = !player.options.loop;
					if (player.options.loop) {
						loop.removeClass('mejs__loop-off').addClass('mejs__loop-on');
					} else {
						loop.removeClass('mejs__loop-on').addClass('mejs__loop-off');
					}
				});
		}
	});

})(mejs.$);
