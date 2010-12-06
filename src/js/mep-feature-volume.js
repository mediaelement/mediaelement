(function($) {
	MediaElementPlayer.prototype.buildvolume = function(player, controls, layers, media) {
		var mute = 	
			$('<div class="mejs-button mejs-volume-button mejs-mute">'+
				'<span></span>'+
				'<div class="mejs-volume-slider">'+
					'<div class="mejs-volume-rail">'+
						'<div class="mejs-volume-handle"></div>'+
					'</div>'+
				'</div>'+
			'</div>')
			.appendTo(controls),
		volumeSlider = mute.find('.mejs-volume-slider'),
		volumeRail = mute.find('.mejs-volume-rail'),
		volumeHandle = mute.find('.mejs-volume-handle'),
		
		positionVolumeHandle = function(volume) {				
			volumeHandle.css('top', volumeRail.height() - (volumeRail.height() * volume) - (volumeHandle.height() / 2));
		},
		handleVolumeMove = function(e) {
			var	
				railHeight = volumeRail.height(),
				newY = e.pageY - volumeRail.offset().top,
				volume = (railHeight - newY) / railHeight
			
			// TODO: handle vertical and horizontal CSS
			// only allow it to move within the rail
			if (newY < 0)
				newY = 0;
			else if (newY > railHeight)
				newY = railHeight;

			// move the handle to match the mouse
			volumeHandle.css('top', newY - (volumeHandle.height() / 2));

			// set mute status
			if (volume == 0) {
				media.setMuted(true);
				mute.removeClass('mejs-mute').addClass('mejs-unmute');
			} else {
				media.setMuted(false);
				mute.removeClass('mejs-unmute').addClass('mejs-mute');
			}
			
			volume = Math.max(0,volume);
			volume = Math.min(volume,1);
			
			// set the volume
			media.setVolume(volume);
		},
		mouseIsDown = false;

		// SLIDER
		volumeSlider
			.bind('mousedown', function (e) {
				handleVolumeMove(e);
				mouseIsDown = true;
				return false;
			});
		$(document)
			.bind('mouseup', function (e) {
				mouseIsDown = false;
			})
			.bind('mousemove', function (e) {
				if (mouseIsDown) {
					handleVolumeMove(e);
				}
			});
				
			
		// MUTE button
		mute.find('span').click(function() {
			if (media.muted) {
				media.setMuted(false);
				mute.removeClass('mejs-unmute').addClass('mejs-mute');
				positionVolumeHandle(1);
			} else {
				media.setMuted(true);
				mute.removeClass('mejs-mute').addClass('mejs-unmute');
				positionVolumeHandle(0);
			}				
		});
		
		// listen for volume change events from other sources
		media.addEventListener('volumechange', function(e) {
			if (!mouseIsDown) {
				positionVolumeHandle(e.target.volume);
			}
		}, true);
		
		// set initial volume
		//player.options.startVolume = Math.min(Math.max(0,player.options.startVolume),1);		
		media.setVolume(player.options.startVolume);		
	}

})(jQuery);