(function($) {
	// PLAY/pause BUTTON
	MediaElementPlayer.prototype.buildplaypause = function(player, controls, layers, media) {
		var play = 
			$('<div class="mejs-button mejs-playpause-button mejs-play">' +
				'<span></span>' +
			'</div>')
			.appendTo(controls)
			.click(function() {
				if (media.paused) {
					media.play();
				} else {
					media.pause();
				}
			});

		media.addEventListener('play',function() {
			play.removeClass('mejs-play').addClass('mejs-pause');
		}, false);
		media.addEventListener('playing',function() {
			play.removeClass('mejs-play').addClass('mejs-pause');
		}, false);


		media.addEventListener('pause',function() {
			play.removeClass('mejs-pause').addClass('mejs-play');
		}, false);
		media.addEventListener('paused',function() {
			play.removeClass('mejs-pause').addClass('mejs-play');
		}, false);



	}
})(jQuery);