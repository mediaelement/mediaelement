if (jQuery !== undefined) {
	mejs.$ = jQuery;
} else if (Zepto !== undefined) {
	mejs.$ = Zepto;

	// define `outerWidth` method which has not been realized in Zepto
	Zepto.fn.outerWidth = function (includeMargin) {
		var width = $(this).width();
		if (includeMargin) {
			width += parseInt($(this).css('margin-right'), 10);
			width += parseInt($(this).css('margin-left'), 10);
		}
		return width;
	};

} else if (ender !== undefined) {
	mejs.$ = ender;
}