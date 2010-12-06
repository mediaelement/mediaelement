(function($) {
	// progress/loaded bar
	MediaElementPlayer.prototype.buildprogress = function(player, controls, layers, media) {
			
		$('<div class="mejs-time-rail">'+
			'<span class="mejs-time-total">'+
				'<span class="mejs-time-loaded"></span>'+
				'<span class="mejs-time-current"></span>'+
				'<span class="mejs-time-handle"></span>'+
				'<span class="mejs-time-float">' + 
					'<span class="mejs-time-float-current">00:00</span>' + 
					'<span class="mejs-time-float-corner"></span>' + 
				'</span>'+
			'</span>'+
		'</div>')
			.appendTo(controls);
			
		var total = controls.find('.mejs-time-total'),
			loaded  = controls.find('.mejs-time-loaded'),
			current  = controls.find('.mejs-time-current'),
			handle  = controls.find('.mejs-time-handle'),
			timefloat  = controls.find('.mejs-time-float'),
			timefloatcurrent  = controls.find('.mejs-time-float-current'),
			setProgress = function(e) {
				var
					target = e.target,
					percent = null;
				
				// Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
				// to be anything other than 0. If the byte count is available we use this instead.
				// Browsers that support the else if do not seem to have the bufferedBytes value and
				// should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
				if (target && target.bytesTotal != undefined && target.bytesTotal > 0 && target.bufferedBytes != undefined) {
					percent = target.bufferedBytes / target.bytesTotal;
				}
				// need to account for a real array with multiple values (only Firefox 4 has this so far)
				else if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
					percent = target.buffered.end(0) / target.duration;
				}

				if (percent !== null) {
					// update loaded bar
					loaded.width(total.width() * percent);			
				}				
			}, 
			setCurrentTime = function(e) {
					
				if (media.currentTime && media.duration) {
				
					// update bar and handle				
					var 
						newWidth = total.width() * media.currentTime / media.duration,
						handlePos = newWidth - (handle.outerWidth(true) / 2);
				
					current.width(newWidth);
					handle.css('left', handlePos);
					timefloat.css('left', handlePos);
					timefloatcurrent.html( mejs.Utility.secondsToTimeCode(media.currentTime) );
				}				
			
			},
			handleMouseMove = function (e) {
				// mouse position relative to the object
				var x = e.pageX,
					offset = total.offset(),
					width = total.outerWidth(),
					percentage = ((x - offset.left) / width),
					newTime = percentage * media.duration;

				media.setCurrentTime(newTime);
			},
			mouseIsDown = false;
	
		// handle clicks
		//controls.find('.mejs-time-rail').delegate('span', 'click', handleMouseMove);
		total
			.bind('mousedown', function (e) {
				handleMouseMove(e);
				mouseIsDown = true;
				return false;
			});
			
		$(document)
			.bind('mouseup', function (e) {
				mouseIsDown = false;
				//handleMouseMove(e);
			})
			.bind('mousemove', function (e) {
				if (mouseIsDown) {
					handleMouseMove(e);
				}
			});		
		
		// loading
		media.addEventListener('progress', function (e) {								
			setProgress(e);
		}, false);

		// current time
		media.addEventListener('timeupdate', function(e) {
			setProgress(e);
			setCurrentTime(e);
		}, false);
	}
	
})(jQuery);