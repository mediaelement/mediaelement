(function($) {
	// @note: found somewhere on stackoverflow,
	// don't know who wrote it. It just enables the 
	// opportunity to notify listener just before
	// a element is removed with jquerys remove() 
	var oldClean = jQuery.cleanData;
    $.cleanData = function( elems ) {
        for ( var i = 0, elem;
        (elem = elems[i]) !== undefined; i++ ) {
            $(elem).triggerHandler("destroyed");
            //$.event.remove( elem, 'destroyed' );
        }
        oldClean(elems);
    };
})(mejs.$);


(function($) {
	// keep instances of mediaelementplayer so that 
	// the me obj is also removed when the video DOM
	// element is removed.
	var instances = [];

	var methods = {
		teardown : function() {
			var i = instances.length;
			if (i < 1) return false;
			
			var acteur;
			while (i--) {
				if (this !== $(instances[i]).get(0)) continue;
				else acteur = $(instances[i]).get(0).player;
				// @see: mep-player.js (remove methods)
				if (acteur.media.pluginType == 'flash') acteur.media.remove();
				if (!acteur.isDynamic) acteur.$node.insertBefore(acteur.container);
				acteur.container.remove();
				// can delete user-defined properties
				delete window.mejs.players[i];
				delete acteur;
				break;
			}
			return true;
		},
		init : function(options) {
			return this.each(function() {
				instances.push(this);
				new mejs.MediaElementPlayer(this, options)
				$(this).bind('destroyed.mediaelementplayer', methods.teardown);
			});
		},
		destroy : function() {
			return this.each(function() {
				$(window).unbind('.mediaelementplayer');
				methods.teardown.apply(this);
			});
		}
	};


	// turn into jQuery plugin
	$.fn.mediaelementplayer = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.mediaelementplayer');
		}
	};
	
	
	// auto enable using JSON attribute
	$(document).ready(function() {
		$('.mejs-player').mediaelementplayer('init');
	});

})(mejs.$); 