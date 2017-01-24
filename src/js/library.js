'use strict';

import window from 'global/window';
import mejs from './core/mejs';

if (typeof jQuery !== 'undefined') {
	mejs.$ = window.jQuery = window.$ = jQuery;
} else if (typeof Zepto !== 'undefined') {
	mejs.$ = window.Zepto = window.$ = Zepto;

	// define `outerWidth` method which has not been realized in Zepto
	Zepto.fn.outerWidth = function (includeMargin) {
		let width = $(this).width();
		if (includeMargin) {
			width += parseInt($(this).css('margin-right'), 10);
			width += parseInt($(this).css('margin-left'), 10);
		}
		return width;
	};

} else if (typeof ender !== 'undefined') {
	mejs.$ = window.ender = window.$ = ender;
}