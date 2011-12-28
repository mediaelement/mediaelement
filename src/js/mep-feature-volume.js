(function($) {

	$.extend(mejs.MepDefaults, {
		muteText: 'Mute Toggle',
		hideVolumeOnTouchDevices: true
	});

	$.extend(MediaElementPlayer.prototype, {
		buildvolume: function(player, controls, layers, media) {
			
			// Android and iOS don't support volume controls
			if (mejs.MediaFeatures.hasTouch && this.options.hideVolumeOnTouchDevices)
				return;
			
			var t = this,
				mute = 
				$('<div class="mejs-button mejs-volume-button mejs-mute">'+
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.muteText + '"></button>'+
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

				if (!volumeSlider.is(':visible')) {
					volumeSlider.show();
					positionVolumeHandle(volume);
					volumeSlider.hide()
					return;
				}

				var 
				
					// height of the full size volume slider background
					totalHeight = volumeTotal.height(),
					
					// top/left of full size volume slider background
					totalPosition = volumeTotal.position(),
					
					// the new top position based on the current volume
					// 70% volume on 100px height == top:30px
					newTop = totalHeight - (totalHeight * volume);

				// handle
				volumeHandle.css('top', totalPosition.top + newTop - (volumeHandle.height() / 2));

				// show the current visibility
				volumeCurrent.height(totalHeight - newTop );
				volumeCurrent.css('top', totalPosition.top + newTop);
			},
			handleVolumeMove = function(e) {
				var
					railHeight = volumeTotal.height(),
					totalOffset = volumeTotal.offset(),
					totalTop = parseInt(volumeTotal.css('top').replace(/px/,''),10),
					newY = e.pageY - totalOffset.top,
					volume = (railHeight - newY) / railHeight
					
				// the controls just hide themselves (usually when mouse moves too far up)
				if (totalOffset.top == 0 || totalOffset.left == 0)
					return;
					
				// 0-1
				volume = Math.max(0,volume);
				volume = Math.min(volume,1);						

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
			mouseIsDown = false,
			mouseIsOver = false;

			// SLIDER
			mute
				.hover(function() {
					volumeSlider.show();
					mouseIsOver = true;
				}, function() {
					mouseIsOver = false;	
						
					if (!mouseIsDown)	{
						volumeSlider.hide();
					}
				});
			
			volumeSlider
				.bind('mouseover', function() {
					mouseIsOver = true;	
				})
				.bind('mousedown', function (e) {
					handleVolumeMove(e);
					mouseIsDown = true;
						
					return false;
				});
				
			$(document)
				.bind('mouseup', function (e) {
					mouseIsDown = false;
					
					if (!mouseIsOver) {
						volumeSlider.hide();
					}
				})
				.bind('mousemove', function (e) {
					if (mouseIsDown) {
						handleVolumeMove(e);
					}
				});


			// MUTE button
			mute.find('button').click(function() {

				media.setMuted( !media.muted );
				
			});

			// listen for volume change events from other sources
			media.addEventListener('volumechange', function(e) {
				if (!mouseIsDown) {
					if (media.muted) {
						positionVolumeHandle(0);
						mute.removeClass('mejs-mute').addClass('mejs-unmute');
					} else {
						positionVolumeHandle(media.volume);
						mute.removeClass('mejs-unmute').addClass('mejs-mute');
					}
				}
			}, false);

			// set initial volume
			//console.log('init volume',player.options.startVolume);
			positionVolumeHandle(player.options.startVolume);
			
			// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
			if (media.pluginType === 'native') {
				media.setVolume(player.options.startVolume);
			}
		}
	});
	
})(mejs.$);
