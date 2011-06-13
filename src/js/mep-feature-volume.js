(function($) {
	MediaElementPlayer.prototype.buildvolume = function(player, controls, layers, media) {
		var mute = 
			$('<div class="mejs-button mejs-volume-button mejs-mute">'+
				'<button type="button"></button>'+
				'<div class="mejs-volume-slider">'+ // outer background
					'<div class="mejs-volume-total"></div>'+ // line background
					'<div class="mejs-volume-current"></div>'+ // current volume
					'<div class="mejs-volume-handle"></div>'+ // handle
				'</div>'+
			'</div>')
			.appendTo(controls),
		volumeSlider = mute.find('.mejs-volume-slider'),
		volumeTotal = mute.find('.mejs-volume-total'),
		volumeCurrent = mute.find('.mejs-volume-current'),
		volumeHandle = mute.find('.mejs-volume-handle'),

		positionVolumeHandle = function(volume) {

			var 
				top = volumeTotal.height() - (volumeTotal.height() * volume);

			// handle
			volumeHandle.css('top', top - (volumeHandle.height() / 2));

			// show the current visibility
			volumeCurrent.height(volumeTotal.height() - top + parseInt(volumeTotal.css('top').replace(/px/,''),10));
			volumeCurrent.css('top',  top);
		},
		handleVolumeMove = function(e) {
			var
				railHeight = volumeTotal.height(),
				totalOffset = volumeTotal.offset(),
				totalTop = parseInt(volumeTotal.css('top').replace(/px/,''),10),
				newY = e.pageY - totalOffset.top,
				volume = (railHeight - newY) / railHeight

			// TODO: handle vertical and horizontal CSS
			// only allow it to move within the rail
			if (newY < 0)
				newY = 0;
			else if (newY > railHeight)
				newY = railHeight;

			// move the handle to match the mouse
			volumeHandle.css('top', newY - (volumeHandle.height() / 2) + totalTop );

			// show the current visibility
			volumeCurrent.height(railHeight-newY);
			volumeCurrent.css('top',newY+totalTop);

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
		positionVolumeHandle(player.options.startVolume);
		
		// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
		if (media.pluginType === 'native') {
			media.setVolume(player.options.startVolume);
		}
	}

})(jQuery);