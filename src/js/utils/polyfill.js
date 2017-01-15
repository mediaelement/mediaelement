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

		// 1. Let O be the result of calling ToObject passing
		//	   the this value as the argument.
		if (this === undefined || this === null) {
			throw new TypeError('"this" is null or not defined');
		}

		let O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//	   internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		let len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//	   ToInteger(fromIndex); else let n be 0.
		let n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//	   If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//	HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//	i.	Let elementK be the result of calling the Get
			//		internal method of O with the argument ToString(k).
			//   ii.	Let same be the result of applying the
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

		let e;

		e = document.createEventObject();
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
	Object.assign = function (target, varArgs) { // .length of function is 2

		'use strict';
		if (target === null || target === undefined) { // TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		let to = Object(target);

		for (let index = 1; index < arguments.length; index++) {
			let nextSource = arguments[index];

			if (nextSource !== null) { // Skip over if undefined or null
				for (let nextKey in nextSource) {
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

			// 1. Let O be ? ToObject(this value).
			if (this === null || this === undefined) {
				throw new TypeError('"this" is null or not defined');
			}

			let o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			let len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. Let n be ? ToInteger(fromIndex).
			//    (If fromIndex is undefined, this step produces the value 0.)
			let n = fromIndex | 0;

			// 5. If n ≥ 0, then
			//  a. Let k be n.
			// 6. Else n < 0,
			//  a. Let k be len + n.
			//  b. If k < 0, let k be 0.
			let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			// 7. Repeat, while k < len
			while (k < len) {
				// a. Let elementK be the result of ? Get(O, ! ToString(k)).
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