'use strict';

import document from 'global/document';
import Promise from 'promise-polyfill';

/**
 * Polyfill
 *
 * Mimics the missing methods like Object.assign, CustomEvent, etc., as a way to avoid including the whole list
 * of polyfills provided by Babel.
 */

// ChildNode.remove polyfill
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				this.parentNode.removeChild(this);
			}
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// CustomEvent polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

	if ( typeof window.CustomEvent === 'function' ) {
		return false;
	}

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		const evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
})();

// Object.assign polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign !== 'function') {
	Object.assign = function (target) { // .length of function is 2

		if (target === null || target === undefined) { // TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		const to = Object(target);

		for (let index = 1, total = arguments.length; index < total; index++) {
			const nextSource = arguments[index];

			if (nextSource !== null) { // Skip over if undefined or null
				for (const nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}

// String.startsWith polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position){
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}

// Element.matches polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			let matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length - 1;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
}

// Element.closest polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (window.Element && !Element.prototype.closest) {
	Element.prototype.closest =
		function(s) {
			let matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i,
				el = this;
			do {
				i = matches.length;
				while (--i >= 0 && matches.item(i) !== el) {}
			} while ((i < 0) && (el = el.parentElement));
			return el;
		};
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
	let lastTime = 0;
	const vendors = ['ms', 'moz', 'webkit', 'o'];
	for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback) {
			const currTime = new Date().getTime();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = window.setTimeout(function() { callback(currTime + timeToCall); },
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

// Javascript workaround for FF iframe `getComputedStyle` bug
// Reference: https://stackoverflow.com/questions/32659801/javascript-workaround-for-firefox-iframe-getcomputedstyle-bug/32660009#32660009
if (/firefox/i.test(navigator.userAgent)) {
	var getComputedStyle = window.getComputedStyle;
	window.getComputedStyle = (el, pseudoEl) => {
		const t = getComputedStyle(el, pseudoEl);
		return (t === null) ? {getPropertyValue: function () {}} : t;
	}
}

// Integrate Promise polyfill if not detected
// Used https://github.com/taylorhakes/promise-polyfill
if (!window.Promise) {
	window.Promise = Promise;
}

// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Polyfill
(function(constructor) {
	if (constructor && constructor.prototype && constructor.prototype.children === null) {
		Object.defineProperty(constructor.prototype, 'children', {
			get: function() {
				let i = 0, node, nodes = this.childNodes, children = [];
				while ((node = nodes[i++])) {
					if (node.nodeType === 1) {
						children.push(node);
					}
				}
				return children;
			}
		});
	}
})(window.Node || window.Element);