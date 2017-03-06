'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';

export function offset (el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

export function closest (el, fn) {
	return el && (fn(el) ? el : closest(el.parentNode, fn));
}

let hasClassMethod, addClassMethod, removeClassMethod;

if ('classList' in document.documentElement) {
	hasClassMethod = (el, className) => el.classList.contains(className);
	addClassMethod = (el, className) => el.classList.add(className);
	removeClassMethod = (el, className) => el.classList.remove(className);
} else {
	hasClassMethod = (el, className) => new RegExp('\\b' + className + '\\b').test(el.className);
	addClassMethod = (el, className) => {
		if (!hasClass(el, className)) {
			el.className += ' ' + className;
		}
	};
	removeClassMethod = (el, className) => {
		el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
	};
}

export const hasClass = hasClassMethod;
export const addClass = addClassMethod;
export const removeClass = removeClassMethod;

// fade an element from the current state to full opacity in "duration" ms
export function fadeOut (el, duration, callback) {
	const s = el.style, step = 25 / (duration || 300);
	s.opacity = s.opacity || 1;
	(function fade () {
		(s.opacity -= step) < 0 ? s.display = "none" : setTimeout(fade, 25);
	})();
	if (typeof callback === 'function') {
		setTimeout(callback, 30);
	}
}

// fade out an element from the current state to full transparency in "duration" ms
// display is the display style the element is assigned after the animation is done
export function fadeIn (el, duration, callback) {
	const s = el.style, step = 25 / (duration || 300);
	s.opacity = s.opacity || 0;
	s.display = "block";
	(function fade () {
		(s.opacity = parseFloat(s.opacity) + step) > 1 ? s.opacity = 1 : setTimeout(fade, 25);
	})();
	if (typeof callback === 'function') {
		setTimeout(callback, 30);
	}
}

export function siblings (el, filter) {
	const siblings = [];
	el = el.parentNode.firstChild;
	do {
		if (!filter || filter(el)) {
			siblings.push(el)
		}
	} while (el == el.nextSibling);
	return siblings;
}

export function visible (elem) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.offset = offset;
mejs.Utils.hasClass = hasClass;
mejs.Utils.addClass = addClass;
mejs.Utils.removeClass = removeClass;
mejs.Utils.fadeIn = fadeIn;
mejs.Utils.fadeOut = fadeOut;
mejs.Utils.siblings = siblings;
mejs.Utils.visible = visible;
mejs.Utils.closest = closest;
