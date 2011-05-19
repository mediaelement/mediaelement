(function($) {
	// current and duration 00:00 / 00:00
	MediaElementPlayer.prototype.buildcurrent = function(player, controls, layers, media) {
		$('<div class="mejs-time">'+
				'<span class="mejs-currenttime">' + (player.options.alwaysShowHours ? '00:' : '') + '00:00</span>'+
			'</div>')
			.appendTo(controls);

		media.addEventListener('timeupdate',function() {
			player.updateCurrent();
		}, false);
	};

	MediaElementPlayer.prototype.buildduration = function(player, controls, layers, media) {
		if (controls.children().last().find('.mejs-currenttime').length > 0) {
			$(' <span> | </span> '+
			   '<span class="mejs-duration">' + (player.options.alwaysShowHours ? '00:' : '') + '00:00</span>')
				.appendTo(controls.find('.mejs-time'));
		} else {

			$('<div class="mejs-time">'+
				'<span class="mejs-duration">' + (player.options.alwaysShowHours ? '00:' : '') + '00:00</span>'+
			'</div>')
			.appendTo(controls);
		}

		media.addEventListener('timeupdate',function() {
			player.updateDuration();
		}, false);
	};
	
	MediaElementPlayer.prototype.updateCurrent = function() {
		var t = this;

		t.controls.find('.mejs-currenttime').html(mejs.Utility.secondsToTimeCode(t.media.currentTime | 0, t.options.alwaysShowHours || t.media.duration > 3600 ));
	}
	MediaElementPlayer.prototype.updateDuration = function() {	
		var t = this;
		
		if (t.media.duration) {
			t.controls.find('.mejs-duration').html(mejs.Utility.secondsToTimeCode(t.media.duration, t.options.alwaysShowHours));
		}		
	};	

})(jQuery);