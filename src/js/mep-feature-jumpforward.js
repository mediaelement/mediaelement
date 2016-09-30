(function($) {
	// Jump forward button

	$.extend(mejs.MepDefaults, {
		jumpForwardInterval: 30,
		// %1 will be replaced with jumpForwardInterval in this string
		jumpForwardText: ''
	});

	$.extend(MediaElementPlayer.prototype, {
		buildjumpforward: function(player, controls, layers, media) {
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
				.click(function() {
                    if (media.duration) {
                        media.setCurrentTime(Math.min(media.currentTime + t.options.jumpForwardInterval, media.duration));
                        $(this).find('button').blur();
                    }
				});
		}
	});

})(mejs.$);
