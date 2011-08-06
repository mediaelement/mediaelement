/*
* ContextMenu Plugin
* 
*
*/

	
mejs.MepDefaults.contextMenuItems = [
	// demo of a fullscreen option
	{ 
		render: function(player) {
			
			// check for fullscreen plugin
			if (typeof player.enterFullScreen == 'undefined')
				return null;
		
			if (player.isFullScreen) {
				return "Turn off Fullscreen";
			} else {
				return "Go Fullscreen";
			}
		},
		click: function(player) {
			if (player.isFullScreen) {
				player.exitFullScreen();
			} else {
				player.enterFullScreen();
			}
		}
	}
	,
	// demo of a mute/unmute button
	{ 
		render: function(player) {
			if (player.media.muted) {
				return "Unmute";
			} else {
				return "Mute";
			}
		},
		click: function(player) {
			if (player.media.muted) {
				player.setMuted(false);
			} else {
				player.setMuted(true);
			}
		}
	},
	// separator
	{
		isSeparator: true
	}
	,
	// demo of simple download video
	{ 
		render: function(player) {
			return "Download Video";
		},
		click: function(player) {
			window.location.href = player.media.currentSrc;
		}
	}	

];


(function($) {



	MediaElementPlayer.prototype.buildcontextmenu = function(player, controls, layers, media) {
		
		// create context menu
		player.contextMenu = $('<div class="mejs-contextmenu"></div>')
							.appendTo($('body'))
							.hide();
		
		// create events for showing context menu
		player.container.bind('contextmenu', function(e) {
			e.preventDefault();
			player.renderContextMenu(e.clientX, e.clientY);
			return false;
		});
		player.container.bind('click', function() {
			player.contextMenu.hide();
		});	
	}
	
	MediaElementPlayer.prototype.renderContextMenu = function(x,y) {
		
		// alway re-render the items so that things like "turn fullscreen on" and "turn fullscreen off" are always written correctly
		var t = this,
			html = '',
			items = t.options.contextMenuItems;
		
		for (var i=0, il=items.length; i<il; i++) {
			
			if (items[i].isSeparator) {
				html += '<div class="mejs-contextmenu-separator"></div>';
			} else {
			
				var rendered = items[i].render(t);
			
				// render can return null if the item doesn't need to be used at the moment
				if (rendered != null) {
					html += '<div class="mejs-contextmenu-item" data-itemindex="' + i + '">' + rendered + '</div>';
				}
			}
		}
		
		// position and show the context menu
		t.contextMenu
			.empty()
			.append($(html))
			.css({top:y, left:x})
			.show()
			
		// bind events
		t.contextMenu.find('.mejs-contextmenu-item').click(function() {
			// which one is this?
			var itemIndex = parseInt( $(this).data('itemindex'), 10 );
			
			// perform click action
			t.options.contextMenuItems[itemIndex].click(t);
			
			// close
			t.contextMenu.hide();
		});
		
	}
	
})(mejs.$);