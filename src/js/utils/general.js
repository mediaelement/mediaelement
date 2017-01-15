'use strict';

import document from 'global/document';
import mejs from '../core/mejs';

/**
 *
 * @param {String} input
 * @return {string}
 */
export function escapeHTML (input) {

	if (typeof input !== 'string') {
		throw new Error('Argument passed must be a string');
	}

	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	};

	return input.replace(/[&<>"]/g, (c) => {
		return map[c];
	});
}

// taken from underscore
export function debounce (func, wait, immediate = false) {

	if (typeof func !== 'function') {
		throw new Error('First argument must be a function');
	}

	if (typeof wait !== 'number') {
		throw new Error('Second argument must be a numeric value');
	}

	let timeout;
	return () => {
		let context = this, args = arguments;
		let later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
}

/**
 * Determine if an object contains any elements
 *
 * @see http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 * @param {Object} instance
 * @return {Boolean}
 */
export function isObjectEmpty (instance) {
	return (Object.getOwnPropertyNames(instance).length <= 0);
}

export function splitEvents (events, id) {
	let rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
	// add player ID as an event namespace so it's easier to unbind them all later
	let ret = {d: [], w: []};
	(events || '').split(' ').forEach((v) => {
		const eventName = v + '.' + id;

		if (eventName.startsWith('.')) {
			ret.d.push(eventName);
			ret.w.push(eventName);
		}
		else {
			ret[rwindow.test(v) ? 'w' : 'd'].push(eventName);
		}
	});


	ret.d = ret.d.join(' ');
	ret.w = ret.w.join(' ');
	return ret;
}

/**
 *
 * @param {String} className
 * @param {HTMLElement} node
 * @param {String} tag
 * @return {HTMLElement[]}
 */
export function getElementsByClassName (className, node, tag) {

	if (node === undefined || node === null) {
		node = document;
	}
	if (node.getElementsByClassName !== undefined && node.getElementsByClassName !== null) {
		return node.getElementsByClassName(className);
	}
	if (tag === undefined || tag === null) {
		tag = '*';
	}

	let
		classElements = [],
		j = 0,
		teststr,
		els = node.getElementsByTagName(tag),
		elsLen = els.length
		;

	for (i = 0; i < elsLen; i++) {
		if (els[i].className.indexOf(className) > -1) {
			teststr = `,${els[i].className.split(' ').join(',')},`;
			if (teststr.indexOf(`,${className},`) > -1) {
				classElements[j] = els[i];
				j++;
			}
		}
	}

	return classElements;
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.escapeHTML = escapeHTML;
mejs.Utils.debounce = debounce;
mejs.Utils.isObjectEmpty = isObjectEmpty;
mejs.Utils.splitEvents = splitEvents;
mejs.Utils.getElementsByClassName = getElementsByClassName;