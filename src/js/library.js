'use strict';

import window from 'global/window';
import mejs from './core/mejs';

if (typeof jQuery !== 'undefined') {
	mejs.$ = window.jQuery = window.$ = jQuery;
} else if (typeof Zepto !== 'undefined') {
	mejs.$ = window.Zepto = window.$ = Zepto;
} else if (typeof ender !== 'undefined') {
	mejs.$ = window.ender = window.$ = ender;
}