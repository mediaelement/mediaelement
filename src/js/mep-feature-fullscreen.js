(function($) {
	MediaElementPlayer.prototype.buildfullscreen = function(player, controls, layers, media) {

		if (!player.isVideo)
			return;
			
		// native events
		if (mejs.MediaFeatures.hasNativeFullScreen) {
			player.container.bind('webkitfullscreenchange', function(e) {
			
				if (document.webkitIsFullScreen) {
					// reset the controls once we are fully in full screen
					player.setControlsSize();
				} else {				
					// when a user presses ESC
					// make sure to put the player back into place								
					exitFullscreen();				
				}
			});
		}

		var 			
			normalHeight = 0,
			normalWidth = 0,
			container = player.container,
			fullscreenBtn = 
				$('<div class="mejs-button mejs-fullscreen-button"><button type="button"></button></div>')
				.appendTo(controls)
				.click(function() {
					var goFullscreen = (mejs.MediaFeatures.hasNativeFullScreen) ?
									!document.webkitIsFullScreen :
									!media.isFullScreen;
					setFullScreen(goFullscreen);
				}),
			setFullScreen = function(goFullScreen) {
				switch (media.pluginType) {
					case 'flash':
					case 'silverlight':
						media.setFullscreen(goFullScreen);
						break;
					case 'native':
						
						if (goFullScreen) {
							enterFullscreen();
						} else {
							exitFullscreen();
						}
				}
			},
			enterFullscreen = function() {
				// attempt to set fullscreen
				if (mejs.MediaFeatures.hasNativeFullScreen) {
					player.container[0].webkitRequestFullScreen();									
				}
			
				// store
				normalHeight = player.$media.height();
				normalWidth = player.$media.width();

				// make full size
				container
					.addClass('mejs-container-fullscreen')
					.width('100%')
					.height('100%')
					.css('z-index', 1000);

				player.$media
					.width('100%')
					.height('100%');


				layers.children('div')
					.width('100%')
					.height('100%');

				fullscreenBtn
					.removeClass('mejs-fullscreen')
					.addClass('mejs-unfullscreen');

				player.setControlsSize();
				media.isFullScreen = true;
			},
			exitFullscreen = function() {

				// attempt to set fullscreen
				if (mejs.MediaFeatures.hasNativeFullScreen && document.webkitIsFullScreen) {							
					document.webkitCancelFullScreen();									
				}			
			
				container
					.removeClass('mejs-container-fullscreen')
					.width(normalWidth)
					.height(normalHeight)
					.css('z-index', 1);

				player.$media
					.width(normalWidth)
					.height(normalHeight);

				layers.children('div')
					.width(normalWidth)
					.height(normalHeight);

				fullscreenBtn
					.removeClass('mejs-unfullscreen')
					.addClass('mejs-fullscreen');

				player.setControlsSize();
				media.isFullScreen = false;
			};

		$(document).bind('keydown',function (e) {
			if (media.isFullScreen && e.keyCode == 27) {
				setFullScreen(false);
			}
		});

	}

})(mejs.$);