(function($) {
	MediaElementPlayer.prototype.buildfullscreen = function(player, controls, layers, media) {
			
		if (!player.isVideo)
			return;
	
		var 
			isFullScreen = false,
			normalHeight = 0,
			normalWidth = 0,	
			container = player.container,
			fullscreenBtn = 	
				$('<div class="mejs-fullscreen-button"><span></span></div>')
				.appendTo(controls)
				.click(function() {
					setFullScreen(!isFullScreen);
				}),				
			setFullScreen = function(goFullScreen) {				
				switch (media.pluginType) {
					case 'flash':
					case 'silverlight':
						media.setFullscreen(goFullScreen);
						break;
					case 'native':

						if (mejs.MediaFeatures.hasNativeFullScreen) {								
							if (goFullScreen) {
								media.webkitEnterFullScreen();
							} else {
								media.webkitExitFullScreen();
							}							
						} else {			
							if (goFullScreen) {

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
							} else {

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
							}
						}
				}								
				isFullScreen = goFullScreen;
			};
		
		$(document).bind('keydown',function (e) {
			if (isFullScreen && e.keyCode == 27) {
				setFullScreen(false);
			}
		});
		
	}


})(jQuery);