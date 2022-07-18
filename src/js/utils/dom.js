'use strict';

/**
 * Most of the methods have been borrowed/adapted from https://plainjs.com/javascript,
 * except fadeIn/fadeOut (from https://github.com/DimitriMikadze/vanilla-helpers/blob/master/js/vanillaHelpers.js)
 */

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';

export function loadScript (url) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = url;
		script.async = true;
		script.onload = () => {
			script.remove();
			resolve();
		};
		script.onerror = () => {
			script.remove();
			reject();
		};
		document.head.appendChild(script);
	});
}

export function offset (el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

let hasClassMethod, addClassMethod, removeClassMethod;

if ('classList' in document.documentElement) {
	hasClassMethod = (el, className) => el.classList !== undefined && el.classList.contains(className);
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

export function toggleClass (el, className) {
	hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
}

// fade an element from the current state to full opacity in "duration" ms
export function fadeOut (el, duration = 400, callback) {
	if (!el.style.opacity) {
		el.style.opacity = 1;
	}

	let start = null;
	window.requestAnimationFrame(function animate (timestamp) {
		start = start || timestamp;
		const progress = timestamp - start;
		const opacity = parseFloat(1 - progress / duration, 2);
		el.style.opacity = opacity < 0 ? 0 : opacity;
		if (progress > duration) {
			if (callback && typeof(callback) === 'function') {
				callback();
			}
		} else {
			window.requestAnimationFrame(animate);
		}
	});
}

// fade out an element from the current state to full transparency in "duration" ms
// display is the display style the element is assigned after the animation is done
export function fadeIn (el, duration = 400, callback) {
	if (!el.style.opacity) {
		el.style.opacity = 0;
	}

	let start = null;
	window.requestAnimationFrame(function animate (timestamp) {
		start = start || timestamp;
		const progress = timestamp - start;
		const opacity = parseFloat(progress / duration, 2);
		el.style.opacity = opacity > 1 ? 1 : opacity;
		if (progress > duration) {
			if (callback && typeof(callback) === 'function') {
				callback();
			}
		} else {
			window.requestAnimationFrame(animate);
		}
	});
}

export function siblings (el, filter) {
	const siblings = [];
	el = el.parentNode.firstChild;
	do {
		if (!filter || filter(el)) {
			siblings.push(el)
		}
	} while ((el = el.nextSibling));
	return siblings;
}

export function visible (elem) {
	if (elem.getClientRects !== undefined && elem.getClientRects === 'function') {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	}
	return !!( elem.offsetWidth || elem.offsetHeight);
}

export function ajax (url, dataType, success, error) {
	const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	let
		type = 'application/x-www-form-urlencoded; charset=UTF-8',
		completed = false,
		accept = '*/'.concat('*')
	;

	switch (dataType) {
		case 'text':
			type = 'text/plain';
			break;
		case 'json':
			type = 'application/json, text/javascript';
			break;
		case 'html':
			type = 'text/html';
			break;
		case 'xml':
			type = 'application/xml, text/xml';
			break;
	}

	if (type !== 'application/x-www-form-urlencoded') {
		accept = `${type}, */*; q=0.01`;
	}

	if (xhr) {
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Accept', accept);
		xhr.onreadystatechange = function () {

			// Ignore repeat invocations
			if (completed) {
				return;
			}

			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					completed = true;
					let data;
					switch (dataType) {
						case 'json':
							data = JSON.parse(xhr.responseText);
							break;
						case 'xml':
							data = xhr.responseXML;
							break;
						default:
							data = xhr.responseText;
							break;
					}
					success(data);
				} else if (typeof error === 'function') {
					error(xhr.status);
				}
			}
		};

		xhr.send();
	}
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.offset = offset;
mejs.Utils.hasClass = hasClass;
mejs.Utils.addClass = addClass;
mejs.Utils.removeClass = removeClass;
mejs.Utils.toggleClass = toggleClass;
mejs.Utils.fadeIn = fadeIn;
mejs.Utils.fadeOut = fadeOut;
mejs.Utils.siblings = siblings;
mejs.Utils.visible = visible;
mejs.Utils.ajax = ajax;
mejs.Utils.loadScript = loadScript;