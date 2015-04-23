(function($) {
	// Jump forward button

	$.extend(mejs.MepDefaults, {
		jumpForwardInterval: 30,
		// %1 will be replaced with jumpForwardInterval in this string
		jumpForwardText: mejs.i18n.t('Jump forward %1 seconds')
	});

	$.extend(MediaElementPlayer.prototype, {
		buildjumpforward: function(player, controls, layers, media) {
			var
				t = this,
				// Replace %1 with skip back interval
				forwardText = t.options.jumpForwardText.replace('%1', t.options.jumpForwardInterval),
				// create the loop button
				loop =
				$('<div class="mejs-button mejs-jump-forward-button">' +
					'<button type="button" aria-controls="' + t.id + '" title="' + forwardText + '" aria-label="' + forwardText + '">' + t.options.jumpForwardInterval + '</button>' +
				'</div>')
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

})(mejs.$);
