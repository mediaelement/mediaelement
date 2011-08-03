(function($) {
	MediaElementPlayer.prototype.buildfullscreen = function(player, controls, layers, media) {

		if (!player.isVideo)
			return;

		var 			
			normalHeight = 0,
			normalWidth = 0,
			container = player.container,
			docElement = document.documentElement,
			docStyleOverflow,
			parentWindow = window.parent,
			parentiframes,			
			iframe,
			fullscreenBtn = 
				$('<div class="mejs-button mejs-fullscreen-button"><button type="button"></button></div>')
				.appendTo(controls)
				.click(function() {
					var goFullscreen = (mejs.MediaFeatures.hasNativeFullScreen) ?
									!media.webkitDisplayingFullscreen :
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
						
						
					
					
						if (mejs.MediaFeatures.hasNativeFullScreen) {
							if (goFullScreen) {
								media.webkitEnterFullScreen();
								media.isFullScreen = true;
							} else {
								media.webkitExitFullScreen();
								media.isFullScreen = false;
							}
						} else {
							if (goFullScreen) {
								
								// store overflow 
								docStyleOverflow = docElement.style.overflow;
								// set it to not show scroll bars so 100% will work
								docElement.style.overflow = 'hidden';
								
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
							} else {
								
								
								// restore scroll bars to document
								docElement.style.overflow = docStyleOverflow;													
							
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
							}
						}
				}				
			};

		$(document).bind('keydown',function (e) {
			if (media.isFullScreen && e.keyCode == 27) {
				setFullScreen(false);
			}
		});
			
	}

})(mejs.$);