(function($) {
	// STOP BUTTON
	MediaElementPlayer.prototype.buildstop = function(player, controls, layers, media) {
		var stop = 
			$('<div class="mejs-button mejs-stop-button mejs-stop">' +
				'<span></span>' +
			'</div>')
			.appendTo(controls)
			.click(function() {
				if (!media.paused) {
					media.pause();
				}
				if (media.currentTime > 0) {
					media.setCurrentTime(0);	
					controls.find('.mejs-time-current').width('0px');
					controls.find('.mejs-time-handle').css('left', '0px');
					controls.find('.mejs-time-float-current').html( mejs.Utility.secondsToTimeCode(0) );
					controls.find('.mejs-currenttime').html( mejs.Utility.secondsToTimeCode(0) );					
					layers.find('.mejs-poster').show();
				}
			});
	}
})(jQuery);