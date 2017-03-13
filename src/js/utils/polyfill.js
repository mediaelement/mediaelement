'use strict';

import document from 'global/document';

/**
 * Polyfill
 *
 * Mimics the missing methods like Object.assign, Array.includes, etc., as a way to avoid including the whole list
 * of polyfills provided by Babel.
 */

// IE6,7,8
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = (searchElement, fromIndex) => {

		let k;

		// 1. const O be the result of calling ToObject passing
		//	   the this value as the argument.
		if (this === undefined || this === null) {
			throw new TypeError('"this" is null or not defined');
		}

		const O = Object(this);

		// 2. const lenValue be the result of calling the Get
		//	   internal method of O with the argument "length".
		// 3. const len be ToUint32(lenValue).
		const len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed const n be
		//	   ToInteger(fromIndex); else const n be 0.
		let n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then const k be n.
		// 8. Else, n<0, const k be len - abs(n).
		//	   If k is less than 0, then const k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			// a. const Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. const kPresent be the result of calling the
			//	HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//	i.	const elementK be the result of calling the Get
			//		internal method of O with the argument ToString(k).
			//   ii.	const same be the result of applying the
			//		Strict Equality Comparison Algorithm to
			//		searchElement and elementK.
			//  iii.	If same is true, return k.
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}

// document.createEvent for IE8 or other old browsers that do not implement it
// Reference: https://github.com/WebReflection/ie8/blob/master/build/ie8.max.js
if (document.createEvent === undefined) {
	document.createEvent = () => {

		const e = document.createEventObject();
		e.timeStamp = (new Date()).getTime();
		e.enumerable = true;
		e.writable = true;
		e.configurable = true;
		e.initEvent = (type, bubbles, cancelable) => {
			this.type = type;
			this.bubbles = !!bubbles;
			this.cancelable = !!cancelable;
			if (!this.bubbles) {
				this.stopPropagation = () => {
					this.stoppedPropagation = true;
					this.cancelBubble = true;
				};
			}
		};

		return e;
	};
}

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

// Array.includes polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		value: function(searchElement, fromIndex) {

			// 1. const O be ? ToObject(this value).
			if (this === null || this === undefined) {
				throw new TypeError('"this" is null or not defined');
			}

			const o = Object(this);

			// 2. const len be ? ToLength(? Get(O, "length")).
			const len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. const n be ? ToInteger(fromIndex).
			//    (If fromIndex is undefined, this step produces the value 0.)
			const n = fromIndex | 0;

			// 5. If n ≥ 0, then
			//  a. const k be n.
			// 6. Else n < 0,
			//  a. const k be len + n.
			//  b. If k < 0, const k be 0.
			let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			// 7. Repeat, while k < len
			while (k < len) {
				// a. const elementK be the result of ? Get(O, ! ToString(k)).
				// b. If SameValueZero(searchElement, elementK) is true, return true.
				// c. Increase k by 1.
				// NOTE: === provides the correct "SameValueZero" comparison needed here.
				if (o[k] === searchElement) {
					return true;
				}
				k++;
			}

			// 8. Return false
			return false;
		}
	});
}

if (!String.prototype.includes) {
	String.prototype.includes = function() {
		return String.prototype.indexOf.apply(this, arguments) !== -1;
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