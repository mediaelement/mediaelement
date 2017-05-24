'use strict';

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
		const context = this, args = arguments;
		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		const callNow = immediate && !timeout;
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

/**
 * Group a string of events into `document` (d) and `window` (w) events
 *
 * @param {String} events  List of space separated events
 * @param {String} id      Namespace appended to events
 * @return {{d: Array, w: Array}}
 */
export function splitEvents (events, id) {
	// Global events
	const rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
	// add player ID as an event namespace so it's easier to unbind them all later
	const ret = {d: [], w: []};
	(events || '').split(' ').forEach((v) => {
		const eventName = `${v}${(id ? `.${id}` : '')}`;

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
 * @param {string} eventName
 * @param {*} target
 * @return {Event|Object}
 */
export function createEvent (eventName, target) {

	if (typeof eventName !== 'string') {
		throw new Error('Event name must be a string');
	}

	const
		eventFrags = eventName.match(/([a-z]+\.([a-z]+))/i),
		detail = {
			target: target
		}
	;

	if (eventFrags !== null) {
		eventName = eventFrags[1];
		detail.namespace = eventFrags[2];
	}

	return new window.CustomEvent(eventName, {
		detail: detail
	});
}

/**
 * Returns true if targetNode appears after sourceNode in the dom.
 * @param {HTMLElement} sourceNode - the source node for comparison
 * @param {HTMLElement} targetNode - the node to compare against sourceNode
 */
export function isNodeAfter (sourceNode, targetNode) {

	return !!(
		sourceNode &&
		targetNode &&
		sourceNode.compareDocumentPosition(targetNode) & 2 // 2 : Node.DOCUMENT_POSITION_PRECEDING
	);
}

/**
 * Determines if a value is a string
 *
 * @param {*} value to check
 * @returns {Boolean} True if a value is a string
 */
export function isString (value) {
	return typeof value === 'string';
}

mejs.Utils = mejs.Utils || {};
mejs.Utils.escapeHTML = escapeHTML;
mejs.Utils.debounce = debounce;
mejs.Utils.isObjectEmpty = isObjectEmpty;
mejs.Utils.splitEvents = splitEvents;
mejs.Utils.createEvent = createEvent;
mejs.Utils.isNodeAfter = isNodeAfter;
mejs.Utils.isString = isString;