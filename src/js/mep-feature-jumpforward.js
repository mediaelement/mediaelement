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
				defaultTitle = mejs.i18n.t('mejs.time-jump-forward', t.options.jumpForwardInterval),
				forwardTitle = t.options.jumpForwardText ? t.options.jumpForwardText : defaultTitle,
				// create the loop button
				loop =
				$('<div class="mejs-button mejs-jump-forward-button">' +
					'<button type="button" aria-controls="' + t.id + '" title="' + forwardTitle + '" aria-label="' + forwardTitle + '">' + t.options.jumpForwardInterval + '</button>' +
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
