(function($) {
	
	// options
	$.extend(mejs.MepDefaults, {
		duration: -1
	});


	// current and duration 00:00 / 00:00
	$.extend(MediaElementPlayer.prototype, {
		buildcurrent: function(player, controls, layers, media) {
			var t = this;
			
			$('<div class="mejs-time">'+
					'<span class="mejs-currenttime">' + (t.secondsToTimeCode(0))+ '</span>'+
			  '</div>')
			  .appendTo(controls);
			
			t.currenttime = t.controls.find('.mejs-currenttime');

			media.addEventListener('timeupdate',function() {
				player.updateCurrent();
			}, false);
		},


		buildduration: function(player, controls, layers, media) {
			var t = this;
			
			if (controls.children().last().find('.mejs-currenttime').length > 0) {
				$(' <span> | </span> '+
					'<span class="mejs-duration">' + 
						(t.options.duration > 0 ? 
							mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25) :
				   			((player.options.alwaysShowHours ? '00:' : '') + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')) 
				   		) + 
					'</span>')
					.appendTo(controls.find('.mejs-time'));
			} else {

				// add class to current time
				controls.find('.mejs-currenttime').parent().addClass('mejs-currenttime-container');
				
				$('<div class="mejs-time mejs-duration-container">'+
					'<span class="mejs-duration">' + 
						(t.options.duration > 0 ? 
							mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25) :
				   			((player.options.alwaysShowHours ? '00:' : '') + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')) 
				   		) + 
					'</span>' +
				'</div>')
				.appendTo(controls);
			}
			
			t.durationD = t.controls.find('.mejs-duration');

			media.addEventListener('timeupdate',function() {
				player.updateDuration();
			}, false);
		},
		
		updateCurrent:  function() {
			var t = this;

			if (t.currenttime) {
				t.currenttime.html(t.secondsToTimeCode(t.media.currentTime));
			}
		},
		
		updateDuration: function() {	
			var t = this;
			
			if (t.media.duration && t.durationD) {
				t.durationD.html(mejs.Utility.secondsToTimeCode(t.media.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
			}		
		},
		
		// timecodeStart is set in smpte format: HH:MM:SS:FF via options
		// 
		//
		// notes:
		//		if timecodeStart is set, assume alwaysShowHours is also set
		//		drop :FF for now
		//		don't use for duration
		//		unknown impact on chapter/VTT
		secondsToTimeCode: function(time) {
		
			function pp(number) { return ((number < 10) ? '0' : '') + number; }
	
			var t = this;
			
			if (typeof t.timecodeStartComps == 'undefined') {
				if (typeof t.options.timecodeStart != 'undefined') {
					t.timecodeStartComps = $.map(t.options.timecodeStart.split(':'), function (s) { return +s });
				} else {
					t.timecodeStartComps = [0,0,0,0];
				}
			}

			if (time<0) return "--:--:--";
			var components = [];
			components[0] = pp(Math.floor(time / 3600) + t.timecodeStartComps[0]);
			components[1] = pp(Math.floor((time % 3600) / 60) + t.timecodeStartComps[1]);
			components[2] = pp(Math.floor(time % 60) + t.timecodeStartComps[2]);
			return components.join(':');
		}
	});

})(mejs.$);