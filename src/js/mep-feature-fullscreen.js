(function($) {
	mejs.MediaElementDefaults.forcePluginFullScreen = false;
	
	MediaElementPlayer.prototype.isFullScreen = false;
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
					player.exitFullScreen();				
				}
			});
		}

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
					var isFullScreen = (mejs.MediaFeatures.hasNativeFullScreen) ?
									document.webkitIsFullScreen :
									player.isFullScreen;													
					
					if (isFullScreen) {
						player.exitFullScreen();
					} else {						
						player.enterFullScreen();
					}
				});
		
		player.enterFullScreen = function() {
			
			// firefox can't adjust plugin sizes without resetting :(
			if (player.pluginType !== 'native' && (mejs.MediaFeatures.isFirefox || player.options.forcePluginFullScreen)) {
				media.setFullscreen(true);
				//player.isFullScreen = true;
				return;
			}		
			
			// attempt to set fullscreen
			if (mejs.MediaFeatures.hasNativeFullScreen) {
				player.container[0].webkitRequestFullScreen();									
			}
								
			// store overflow 
			docStyleOverflow = docElement.style.overflow;
			// set it to not show scroll bars so 100% will work
			docElement.style.overflow = 'hidden';				
		
			// store
			normalHeight = player.container.height();
			normalWidth = player.container.width();

			// make full size
			container
				.addClass('mejs-container-fullscreen')
				.width('100%')
				.height('100%')
				.css('z-index', 1000);
				//.css({position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', width: '100%', height: '100%', 'z-index': 1000});				
				
			if (player.pluginType === 'native') {
				player.$media
					.width('100%')
					.height('100%');
			} else {
				container.find('object embed')
					.width('100%')
					.height('100%');
				player.media.setVideoSize($(window).width(),$(window).height());
			}
			
			layers.children('div')
				.width('100%')
				.height('100%');

			fullscreenBtn
				.removeClass('mejs-fullscreen')
				.addClass('mejs-unfullscreen');

			player.setControlsSize();
			player.isFullScreen = true;
		};
		player.exitFullScreen = function() {

			// firefox can't adjust plugins
			if (player.pluginType !== 'native' && mejs.MediaFeatures.isFirefox) {				
				media.setFullscreen(false);
				//player.isFullScreen = false;
				return;
			}		
		
			// come outo of native fullscreen
			if (mejs.MediaFeatures.hasNativeFullScreen && document.webkitIsFullScreen) {							
				document.webkitCancelFullScreen();									
			}	

			// restore scroll bars to document
			docElement.style.overflow = docStyleOverflow;					
				
			container
				.removeClass('mejs-container-fullscreen')
				.width(normalWidth)
				.height(normalHeight)
				.css('z-index', 1);
				//.css({position: '', left: '', top: '', right: '', bottom: '', overflow: 'inherit', width: normalWidth + 'px', height: normalHeight + 'px', 'z-index': 1});
			
			if (player.pluginType === 'native') {
				player.$media
					.width(normalWidth)
					.height(normalHeight);
			} else {
				container.find('object embed')
					.width(normalWidth)
					.height(normalHeight);
					
				player.media.setVideoSize(normalWidth, normalHeight);
			}				

			layers.children('div')
				.width(normalWidth)
				.height(normalHeight);

			fullscreenBtn
				.removeClass('mejs-unfullscreen')
				.addClass('mejs-fullscreen');

			player.setControlsSize();
			player.isFullScreen = false;
		};
		
		$(window).bind('resize',function (e) {
			player.setControlsSize();
		});		

		$(document).bind('keydown',function (e) {
			if (player.isFullScreen && e.keyCode == 27) {
				player.exitFullScreen();
			}
		});
			
	}

})(mejs.$);