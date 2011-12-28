(function($) {
	
	$.extend(mejs.MepDefaults, {
		usePluginFullScreen: false,
		newWindowCallback: function() { return '';},
		fullscreenText: 'Fullscreen'
	});
	
	$.extend(MediaElementPlayer.prototype, {
		
		isFullScreen: false,
		
		isNativeFullScreen: false,
		
		docStyleOverflow: null,
		
		isInIframe: false,
		
		buildfullscreen: function(player, controls, layers, media) {

			if (!player.isVideo)
				return;
				
			player.isInIframe = (window.location != window.parent.location);
				
			// native events
			if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
				
				player.container.bind(mejs.MediaFeatures.fullScreenEventName, function(e) {
				//player.container.bind('webkitfullscreenchange', function(e) {
				
					
					if (mejs.MediaFeatures.isFullScreen()) {
						player.isNativeFullScreen = true;
						// reset the controls once we are fully in full screen
						player.setControlsSize();
					} else {
						player.isNativeFullScreen = false;
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
						'<button type="button" aria-controls="' + t.id + '" title="' + t.options.fullscreenText + '"></button>' + 
					'</div>')
					.appendTo(controls);
				
				if (t.media.pluginType === 'native' || (!t.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox)) {
					
					fullscreenBtn.click(function() {
						var isFullScreen = (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || player.isFullScreen;													
						
						if (isFullScreen) {
							player.exitFullScreen();
						} else {						
							player.enterFullScreen();
						}
					});
					
				} else {

					var hideTimeout = null,
						isIE8orLower = true;
						
					if (isIE8orLower) {
						fullscreenBtn
							.mouseover(function() {
								
								if (hideTimeout !== null) {
									clearTimeout(hideTimeout);
									delete hideTimeout;
								}
								
								var buttonPos = fullscreenBtn.offset(),
									containerPos = player.container.offset();
									
								media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top);
							
							})
							.mouseout(function() {
							
								if (hideTimeout !== null) {
									clearTimeout(hideTimeout);
									delete hideTimeout;
								}
								
								hideTimeout = setTimeout(function() {	
									media.hideFullscreenButton();
								}, 1500);
								
								
							});
					} else {
						
						// reset
						t.controls.click(function() {
							t.controls.css('pointer-events','');
							fullscreenBtn.css('pointer-events','');
						});
						t.container.mouseleave(function() {
							t.controls.css('pointer-events','');
							fullscreenBtn.css('pointer-events','');
						});
						
						fullscreenBtn
							.mouseover(function() {
								
								fullscreenBtn.css('pointer-events','none');
								t.controls.css('pointer-events','none');
							
							})
							.mouseout(function() {
							
								fullscreenBtn.css('pointer-events','');
								t.controls.css('pointer-events','');
								
							});
					}
				}
			
			player.fullscreenBtn = fullscreenBtn;	

			$(document).bind('keydown',function (e) {
				if (((mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen()) || t.isFullScreen) && e.keyCode == 27) {
					player.exitFullScreen();
				}
			});
				
		},
		enterFullScreen: function() {
			
			var t = this;
			
			// firefox+flash can't adjust plugin sizes without resetting :(
			if (t.media.pluginType !== 'native' && (mejs.MediaFeatures.isFirefox || t.options.usePluginFullScreen)) {
				//t.media.setFullscreen(true);
				//player.isFullScreen = true;
				return;
			}			
						
			// store overflow 
			docStyleOverflow = document.documentElement.style.overflow;
			// set it to not show scroll bars so 100% will work
			document.documentElement.style.overflow = 'hidden';			
		
			// store sizing
			normalHeight = t.container.height();
			normalWidth = t.container.width();
			
			// attempt to do true fullscreen (Safari 5.1 and Firefox Nightly only for now)
			if (t.media.pluginType === 'native') {
				if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
							
					mejs.MediaFeatures.requestFullScreen(t.container[0]);
					//return;
					
				} else if (mejs.MediaFeatures.hasSemiNativeFullScreen) {
					t.media.webkitEnterFullscreen();
					return;
				}
			}
			
			// check for iframe launch
			if (t.isInIframe) {
				var url = t.options.newWindowCallback(this);
				
				
				if (url !== '') {
					
					// launch immediately
					if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
						t.pause();
						window.open(url, t.id, 'top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight + ',resizable=yes,scrollbars=no,status=no,toolbar=no');
						return;
					} else {
						setTimeout(function() {
							if (!t.isNativeFullScreen) {
								t.pause();
								window.open(url, t.id, 'top=0,left=0,width=' + screen.availWidth + ',height=' + screen.availHeight + ',resizable=yes,scrollbars=no,status=no,toolbar=no');								
							}
						}, 250);
					}
				}	
				
			}
			
			// full window code

			

			// make full size
			t.container
				.addClass('mejs-container-fullscreen')
				.width('100%')
				.height('100%');
				//.css({position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, overflow: 'hidden', width: '100%', height: '100%', 'z-index': 1000});				

			// Only needed for safari 5.1 native full screen, can cause display issues elsewhere
			// Actually, it seems to be needed for IE8, too
			//if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
				setTimeout(function() {
					t.container.css({width: '100%', height: '100%'});
					t.setControlsSize();
				}, 500);
			//}
				
			if (t.pluginType === 'native') {
				t.$media
					.width('100%')
					.height('100%');
			} else {
				t.container.find('object, embed, iframe')
					.width('100%')
					.height('100%');
					
				//if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
					t.media.setVideoSize($(window).width(),$(window).height());
				//}
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
				.height(normalHeight);
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
