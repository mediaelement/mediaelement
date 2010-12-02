(function($) {
	// current and duration 00:00 / 00:00
	MediaElementPlayer.prototype.buildcurrent = function(player, controls, layers, media) {
		$('<div class="mejs-time">'+
				'<span class="mejs-currenttime">00:00</span>'+
			'</div>')
			.appendTo(controls);
			
		media.addEventListener('timeupdate',function() {
			if (media.currentTime) {
				controls.find('.mejs-currenttime').html(mejs.Utility.secondsToTimeCode(media.currentTime));
			}		
		}, false);			
	};
	
	MediaElementPlayer.prototype.buildduration = function(player, controls, layers, media) {
		if (controls.children().last().find('.mejs-currenttime').length > 0) {
			$(' <span> | </span> '+
			   '<span class="mejs-duration">00:00</span>')
				.appendTo(controls.find('.mejs-time'));			
		} else {
		
			$('<div class="mejs-time">'+
				'<span class="mejs-duration">00:00</span>'+
			'</div>')
			.appendTo(controls);
		}
		
		media.addEventListener('timeupdate',function() {
			if (media.duration) {
				controls.find('.mejs-duration').html(mejs.Utility.secondsToTimeCode(media.duration));
			}
		}, false);			
	};	

})(jQuery);