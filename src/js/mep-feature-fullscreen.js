(function($) {
	
	$.extend(mejs.MepDefaults, {
		forcePluginFullScreen: false,
		newWindowUrl: ''
	});
	
	$.extend(MediaElementPlayer.prototype, {
		
		isFullScreen: false,
		
		docStyleOverflow: null,
		
		isInIframe: false,
		
		buildfullscreen: function(player, controls, layers, media) {

			if (!player.isVideo)
				return;
				
			player.isInIframe = (window.location != window.parent.location);
				
			// native events
			if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
				//player.container.bind(mejs.MediaFeatures.fullScreenEventName, function(e) {
				player.container.bind('webkitfullscreenchange', function(e) {
				
					if (mejs.MediaFeatures.isFullScreen()) {
						// reset the controls once we are fully in full screen
						player.setControlsSize();
					} else {				
						// when a user presses ESC
						// make sure to put the player back into place								
						player.exitFullScreen();				
					}
				});
			}

			var t = this,		
				normalHeight = 0,
				normalWidth = 0,
				container = player.container,						
				fullscreenBtn = 
					$('<div class="mejs-button mejs-fullscreen-button">' + 
						'<button type="button" aria-controls="' + t.id + '" title="Fullscreen"></button>' + 
					'</div>')
					.appendTo(controls)
					.click(function() {
						var isFullScreen = (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || player.isFullScreen;													
						
						if (isFullScreen) {
							player.exitFullScreen();
						} else {						
							player.enterFullScreen();
						}
					});
			
			player.fullscreenBtn = fullscreenBtn;	

			$(document).bind('keydown',function (e) {
				if (((mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || t.isFullScreen) && e.keyCode == 27) {
					player.exitFullScreen();
				}
			});
				
		},
		enterFullScreen: function() {
			
			var t = this;
			
			// store overflow 
			docStyleOverflow = document.documentElement.style.overflow;
			// set it to not show scroll bars so 100% will work
			document.documentElement.style.overflow = 'hidden';				
		
			// store sizing
			normalHeight = t.container.height();
			normalWidth = t.container.width();
			
			
			// attempt to do true fullscreen (Safari 5.1 and Firefox Nightly only for now)
			if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
						
				mejs.MediaFeatures.requestFullScreen(t.container[0]);
				//return;
				
			} else if (mejs.MediaFeatures.hasSemiNativeFullScreen) {
				t.media.webkitEnterFullscreen();
				return;
			}
			
			// check for iframe launch
			if (t.isInIframe && t.options.newWindowUrl !== '') {
				t.pause();
				//window.open(t.options.newWindowUrl, t.id, 'width=' + t.width + ',height=' + t.height + ',resizable=yes,scrollbars=no,status=no,toolbar=no');
				window.open(t.options.newWindowUrl, t.id, 'top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight + ',resizable=yes,scrollbars=no,status=no,toolbar=no');
				
				return;
			}
			
			// full window code
			
			// firefox+flash can't adjust plugin sizes without resetting :(
			if (t.media.pluginType !== 'native' && (mejs.MediaFeatures.isFirefox || t.options.forcePluginFullScreen)) {
				t.media.setFullscreen(true);
				//player.isFullScreen = true;
				return;
			}

			// make full size
			t.container
				.addClass('mejs-container-fullscreen')
				.width('100%')
				.height('100%');
				//.css({position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', width: '100%', height: '100%', 'z-index': 1000});				
			setTimeout(function() {
				t.container.css({width: '100%', height: '100%'});
			}, 500);
			//console.log('fullscreen', t.container.width());
				
			if (t.pluginType === 'native') {
				t.$media
					.width('100%')
					.height('100%');
			} else {
				t.container.find('object embed')
					.width('100%')
					.height('100%');
				t.media.setVideoSize($(window).width(),$(window).height());
			}
			
			t.layers.children('div')
				.width('100%')
				.height('100%');

			if (t.fullscreenBtn) {
				t.fullscreenBtn
					.removeClass('mejs-fullscreen')
					.addClass('mejs-unfullscreen');
			}

			t.setControlsSize();
			t.isFullScreen = true;
		},
		
		exitFullScreen: function() {
			
			var t = this;		
		
			// firefox can't adjust plugins
			if (t.media.pluginType !== 'native' && mejs.MediaFeatures.isFirefox) {				
				t.media.setFullscreen(false);
				//player.isFullScreen = false;
				return;
			}		
		
			// come outo of native fullscreen
			if (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen)) {
				mejs.MediaFeatures.cancelFullScreen();
			}	

			// restore scroll bars to document
			document.documentElement.style.overflow = docStyleOverflow;					
				
			t.container
				.removeClass('mejs-container-fullscreen')
				.width(normalWidth)
				.height(normalHeight)
				.css('z-index', 1);
				//.css({position: '', left: '', top: '', right: '', bottom: '', overflow: 'inherit', width: normalWidth + 'px', height: normalHeight + 'px', 'z-index': 1});
			
			if (t.pluginType === 'native') {
				t.$media
					.width(normalWidth)
					.height(normalHeight);
			} else {
				t.container.find('object embed')
					.width(normalWidth)
					.height(normalHeight);
					
				t.media.setVideoSize(normalWidth, normalHeight);
			}				

			t.layers.children('div')
				.width(normalWidth)
				.height(normalHeight);

			t.fullscreenBtn
				.removeClass('mejs-unfullscreen')
				.addClass('mejs-fullscreen');

			t.setControlsSize();
			t.isFullScreen = false;
		}	
	});

})(mejs.$);