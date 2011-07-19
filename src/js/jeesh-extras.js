(function($) {

	// borrowed from jQuery (no deep, bad fake object detection)
	$.ender({extend: function() {
		var options, name, src, copy, 
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;	

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target !== "function" ) {
			target = {};
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;		
	}});

	// outerWidth
	$.ender({outerWidth: function(margin) {
		var fp = parseFloat;
		return fp(this.width()) 
				+ (margin ? fp(this.css('margin-left')) + fp(this.css('margin-right')) : 0)
				+ fp(this.css('padding-left'))+ fp(this.css('padding-right'))
				+ fp(this.css('border-left-width')) + fp(this.css('border-right-width'))					
				;
	}}, true);

})(ender);
