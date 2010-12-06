(function($) {
	// loop toggle
	MediaElementPlayer.prototype.buildloop = function(player, controls, layers, media) {
		var loop = 	
			$('<div class="mejs-button mejs-loop ' + ((player.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off') + '">' +
				'<span></span>' +
			'</div>')
			.appendTo(controls)
			.click(function() {
				player.options.loop = !player.options.loop;
				if (player.options.loop) {
					loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
				} else {
					loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
				}
			});		
	}
})(jQuery);