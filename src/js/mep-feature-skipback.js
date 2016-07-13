(function($) {
	// skip back button

	$.extend(mejs.MepDefaults, {
		skipBackInterval: 30,
		// %1 will be replaced with skipBackInterval in this string
		skipBackText: mejs.i18n.t('Skip back %1 seconds')
	});

	$.extend(MediaElementPlayer.prototype, {
		buildskipback: function(player, controls, layers, media) {
			var
				t = this,
				// Replace %1 with skip back interval
				backText = t.options.skipBackText.replace('%1', t.options.skipBackInterval),
				// create the loop button
				loop =
				$('<div class="mejs-button mejs-skip-back-button">' +
					'<button type="button" aria-controls="' + t.id + '" title="' + backText + '" aria-label="' + backText + '">' + t.options.skipBackInterval + '</button>' +
				'</div>')
				// append it to the toolbar
				.appendTo(controls)
				// add a click toggle event
				.click(function() {
					media.setCurrentTime(Math.max(media.currentTime - t.options.skipBackInterval, 0));
					$(this).find('button').blur();
				});
		}
	});

})(mejs.$);
