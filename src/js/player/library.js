'use strict';

import window from 'global/window';
import mejs from '../core/mejs';

if (typeof jQuery !== 'undefined') {
	mejs.$ = window.jQuery = window.$ = jQuery;
} else if (typeof Zepto !== 'undefined') {
	mejs.$ = window.Zepto = window.$ = Zepto;
} else if (typeof ender !== 'undefined') {
	mejs.$ = window.ender = window.$ = ender;
}
// turn into plugin
if (typeof window.$ !== 'undefined') {
	window.$.fn.mediaelementplayer = function (options) {
		if (options === false) {
			this.each(function () {
				const player = window.$(this).data('mediaelementplayer');
				if (player) {
					player.remove();
				}
				window.$(this).removeData('mediaelementplayer');
			});
		} else {
			this.each(function () {
				window.$(this).data('mediaelementplayer', new MediaElementPlayer(this, options));
			});
		}
		return this;
	};

	window.$(document).ready(() => {
		// auto enable using JSON attribute
		window.$(`.${mejs.MepDefaults.classPrefix}player`).mediaelementplayer();
	});
}