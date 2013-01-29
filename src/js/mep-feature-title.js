(function($) {

	$.extend(MediaElementPlayer.prototype, {
		buildtitle : function(player, controls, layers, media) {
		    $('<div class="mejs-title">'+
		        '<div class="mejs-title-playlist"></div>' +
		        '<div class="mejs-title-track"></div>' +
            '</div>')
                .appendTo(layers);
            
		    var title = player.$media.attr('title');
		    
		    // prioriy goes to option
			if (player.options.title != undefined) {
				title = player.options.title;
			
			// second, try the real title attribute
			} else if(title == undefined) {
			
			    // finally, use the source file name
			    var path = media.src.split('/');
			    title = path[path.length-1];
			}
			
		    player.setTrackTitle(title);
		},
		setTrackTitle: function(title){
		    this.container.find('.mejs-title-track').text(title);
		    return this;
		},
		setPlaylistTitle: function(title){
		    this.container.find('.mejs-title-playlist').text(title);
		    return this;
		}
    });
    
})(mejs.$);
