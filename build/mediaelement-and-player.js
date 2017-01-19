/*!
 * MediaElement.js
 * http://www.mediaelement.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2017, John Dyer (http://j.hn/)
 * License: MIT
 *
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = _dereq_(1);

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _en = _dereq_(14);

var _general = _dereq_(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Locale.
 *
 * This object manages translations with pluralization. Also deals with WordPress compatibility.
 * @type {Object}
 */
var i18n = { lang: 'en', en: _en.EN };

/**
 * Language setter/getter
 *
 * @param {*} args  Can pass the language code and/or the translation strings as an Object
 * @return {string}
 */
i18n.language = function () {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (args !== null && args !== undefined && args.length) {

		if (typeof args[0] !== 'string') {
			throw new TypeError('Language code must be a string value');
		}

		if (!args[0].match(/^[a-z]{2}(\-[a-z]{2})?$/i)) {
			throw new TypeError('Language code must have format `xx` or `xx-xx`');
		}

		i18n.lang = args[0];

		// Check if language strings were added; otherwise, check the second argument or set to English as default
		if (i18n[args[0]] === undefined) {
			args[1] = args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object' ? args[1] : {};
			i18n[args[0]] = !(0, _general.isObjectEmpty)(args[1]) ? args[1] : _en.EN;
		} else if (args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object') {
			i18n[args[0]] = args[1];
		}
	}

	return i18n.lang;
};

/**
 * Translate a string in the language set up (or English by default)
 *
 * @param {string} message
 * @param {number} pluralParam
 * @return {string}
 */
i18n.t = function (message) {
	var pluralParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	if (typeof message === 'string' && message.length) {

		var str = void 0,
		    pluralForm = void 0;

		var language = i18n.language();

		/**
   * Modify string using algorithm to detect plural forms.
   *
   * @private
   * @see http://stackoverflow.com/questions/1353408/messageformat-in-javascript-parameters-in-localized-ui-strings
   * @param {String|String[]} input   - String or array of strings to pick the plural form
   * @param {Number} number           - Number to determine the proper plural form
   * @param {Number} form             - Number of language family to apply plural form
   * @return {String}
   */
		var _plural = function _plural(input, number, form) {

			if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
				return input;
			}

			/**
    *
    * @return {Function[]}
    * @private
    */
			var _pluralForms = function () {
				return [
				// 0: Chinese, Japanese, Korean, Persian, Turkish, Thai, Lao, Aymará,
				// Tibetan, Chiga, Dzongkha, Indonesian, Lojban, Georgian, Kazakh, Khmer, Kyrgyz, Malay,
				// Burmese, Yakut, Sundanese, Tatar, Uyghur, Vietnamese, Wolof
				function () {
					return arguments.length <= 1 ? undefined : arguments[1];
				},

				// 1: Danish, Dutch, English, Faroese, Frisian, German, Norwegian, Swedish, Estonian, Finnish,
				// Hungarian, Basque, Greek, Hebrew, Italian, Portuguese, Spanish, Catalan, Afrikaans,
				// Angika, Assamese, Asturian, Azerbaijani, Bulgarian, Bengali, Bodo, Aragonese, Dogri,
				// Esperanto, Argentinean Spanish, Fulah, Friulian, Galician, Gujarati, Hausa,
				// Hindi, Chhattisgarhi, Armenian, Interlingua, Greenlandic, Kannada, Kurdish, Letzeburgesch,
				// Maithili, Malayalam, Mongolian, Manipuri, Marathi, Nahuatl, Neapolitan, Norwegian Bokmal,
				// Nepali, Norwegian Nynorsk, Norwegian (old code), Northern Sotho, Oriya, Punjabi, Papiamento,
				// Piemontese, Pashto, Romansh, Kinyarwanda, Santali, Scots, Sindhi, Northern Sami, Sinhala,
				// Somali, Songhay, Albanian, Swahili, Tamil, Telugu, Turkmen, Urdu, Yoruba
				function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				},

				// 2: French, Brazilian Portuguese, Acholi, Akan, Amharic, Mapudungun, Breton, Filipino,
				// Gun, Lingala, Mauritian Creole, Malagasy, Maori, Occitan, Tajik, Tigrinya, Uzbek, Walloon
				function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				},

				// 3: Latvian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 0) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 4: Scottish Gaelic
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1 || (arguments.length <= 0 ? undefined : arguments[0]) === 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2 || (arguments.length <= 0 ? undefined : arguments[0]) === 12) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				},

				// 5:  Romanian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 0 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 6: Lithuanian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return [3];
					}
				},

				// 7: Belarusian, Bosnian, Croatian, Serbian, Russian, Ukrainian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 8:  Slovak, Czech
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) <= 4) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 9: Polish
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 10: Slovenian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 3 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 === 4) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 1 ? undefined : arguments[1];
					}
				},

				// 11: Irish Gaelic
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 7) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 6 && (arguments.length <= 0 ? undefined : arguments[0]) < 11) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 5 ? undefined : arguments[5];
					}
				},

				// 12: Arabic
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 3 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 <= 10) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 11) {
						return arguments.length <= 5 ? undefined : arguments[5];
					} else {
						return arguments.length <= 6 ? undefined : arguments[6];
					}
				},

				// 13: Maltese
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 11) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 > 10 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				},

				// 14: Macedonian
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 15:  Icelandic
				function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) !== 11 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				},

				// New additions

				// 16:  Kashubian
				// In https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of__pluralRules
				// Breton is listed as #16 but in the Localization Guide it belongs to the group 2
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				},

				// 17:  Welsh
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 8 && (arguments.length <= 0 ? undefined : arguments[0]) !== 11) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				},

				// 18:  Javanese
				function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				},

				// 19:  Cornish
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 3) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				},

				// 20:  Mandinka
				function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}];
			}();

			// Perform plural form or return original text
			return _pluralForms[form].apply(null, [number].concat(input));
		};

		// Fetch the localized version of the string
		if (i18n[language] !== undefined) {
			str = i18n[language][message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n[language]['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		// Fallback to default language if requested uid is not translated
		if (!str && i18n.en) {
			str = i18n.en[message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n.en['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		// As a last resort, use the requested uid, to mimic original behavior of i18n utils
		// (in which uid was the english text)
		str = str || message;

		// Replace token
		if (pluralParam !== null && typeof pluralParam === 'number') {
			str = str.replace('%1', pluralParam);
		}

		return (0, _general.escapeHTML)(str);
	}

	return message;
};

_mejs2.default.i18n = i18n;

// `i18n` compatibility workflow with WordPress
if (typeof mejsL10n !== 'undefined') {
	_mejs2.default.i18n.language(mejsL10n.language, mejsL10n.strings);
}

exports.default = i18n;

},{"14":14,"29":29,"6":6}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _media = _dereq_(30);

var _renderer = _dereq_(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Media Core
 *
 * This class is the foundation to create/render different media formats.
 * @class MediaElement
 */
var MediaElement = function MediaElement(idOrNode, options) {
	var _this = this;

	_classCallCheck(this, MediaElement);

	var t = this;

	t.defaults = {
		/**
   * List of the renderers to use
   * @type {String[]}
   */
		renderers: [],
		/**
   * Name of MediaElement container
   * @type {String}
   */
		fakeNodeName: 'mediaelementwrapper',
		/**
   * The path where shims are located
   * @type {String}
   */
		pluginPath: 'build/'
	};

	options = Object.assign(t.defaults, options);

	// create our node (note: older versions of iOS don't support Object.defineProperty on DOM nodes)
	t.mediaElement = _document2.default.createElement(options.fakeNodeName);
	t.mediaElement.options = options;

	var id = idOrNode,
	    i = void 0,
	    il = void 0;

	if (typeof idOrNode === 'string') {
		t.mediaElement.originalNode = _document2.default.getElementById(idOrNode);
	} else {
		t.mediaElement.originalNode = idOrNode;
		id = idOrNode.id;
	}

	id = id || 'mejs_' + Math.random().toString().slice(2);

	if (t.mediaElement.originalNode !== undefined && t.mediaElement.originalNode !== null && t.mediaElement.appendChild) {
		// change id
		t.mediaElement.originalNode.setAttribute('id', id + '_from_mejs');

		// add next to this one
		t.mediaElement.originalNode.parentNode.insertBefore(t.mediaElement, t.mediaElement.originalNode);

		// insert this one inside
		t.mediaElement.appendChild(t.mediaElement.originalNode);
	} else {
		// TODO: where to put the node?
	}

	t.mediaElement.id = id;
	t.mediaElement.renderers = {};
	t.mediaElement.renderer = null;
	t.mediaElement.rendererName = null;
	/**
  * Determine whether the renderer was found or not
  *
  * @public
  * @param {String} rendererName
  * @param {Object[]} mediaFiles
  * @return {Boolean}
  */
	t.mediaElement.changeRenderer = function (rendererName, mediaFiles) {

		var t = _this;

		// check for a match on the current renderer
		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && t.mediaElement.renderer.name === rendererName) {
			t.mediaElement.renderer.pause();
			if (t.mediaElement.renderer.stop) {
				t.mediaElement.renderer.stop();
			}
			t.mediaElement.renderer.show();
			t.mediaElement.renderer.setSrc(mediaFiles[0].src);
			return true;
		}

		// if existing renderer is not the right one, then hide it
		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
			t.mediaElement.renderer.pause();
			if (t.mediaElement.renderer.stop) {
				t.mediaElement.renderer.stop();
			}
			t.mediaElement.renderer.hide();
		}

		// see if we have the renderer already created
		var newRenderer = t.mediaElement.renderers[rendererName],
		    newRendererType = null;

		if (newRenderer !== undefined && newRenderer !== null) {
			newRenderer.show();
			newRenderer.setSrc(mediaFiles[0].src);
			t.mediaElement.renderer = newRenderer;
			t.mediaElement.rendererName = rendererName;
			return true;
		}

		var rendererArray = t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : _renderer.renderer.order;

		// find the desired renderer in the array of possible ones
		for (i = 0, il = rendererArray.length; i < il; i++) {

			var index = rendererArray[i];

			if (index === rendererName) {

				// create the renderer
				var rendererList = _renderer.renderer.renderers;
				newRendererType = rendererList[index];

				var renderOptions = Object.assign(newRendererType.options, t.mediaElement.options);
				newRenderer = newRendererType.create(t.mediaElement, renderOptions, mediaFiles);
				newRenderer.name = rendererName;

				// store for later
				t.mediaElement.renderers[newRendererType.name] = newRenderer;
				t.mediaElement.renderer = newRenderer;
				t.mediaElement.rendererName = rendererName;

				newRenderer.show();

				return true;
			}
		}

		return false;
	};

	/**
  * Set the element dimensions based on selected renderer's setSize method
  *
  * @public
  * @param {number} width
  * @param {number} height
  */
	t.mediaElement.setSize = function (width, height) {
		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
			t.mediaElement.renderer.setSize(width, height);
		}
	};

	var props = _mejs2.default.html5media.properties,
	    methods = _mejs2.default.html5media.methods,
	    addProperty = function addProperty(obj, name, onGet, onSet) {

		// wrapper functions
		var oldValue = obj[name];
		var getFn = function getFn() {
			return onGet.apply(obj, [oldValue]);
		},
		    setFn = function setFn(newValue) {
			oldValue = onSet.apply(obj, [newValue]);
			return oldValue;
		};

		// Modern browsers, IE9+ (IE8 only works on DOM objects, not normal JS objects)
		if (Object.defineProperty) {

			Object.defineProperty(obj, name, {
				get: getFn,
				set: setFn
			});

			// Older Firefox
		} else if (obj.__defineGetter__) {

			obj.__defineGetter__(name, getFn);
			obj.__defineSetter__(name, setFn);
		}
	},
	    assignGettersSetters = function assignGettersSetters(propName) {
		if (propName !== 'src') {
			(function () {

				var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1),
				    getFn = function getFn() {
					return t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null ? t.mediaElement.renderer['get' + capName]() : null;
				},
				    setFn = function setFn(value) {
					if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
						t.mediaElement.renderer['set' + capName](value);
					}
				};

				addProperty(t.mediaElement, propName, getFn, setFn);
				t.mediaElement['get' + capName] = getFn;
				t.mediaElement['set' + capName] = setFn;
			})();
		}
	},

	// `src` is a property separated from the others since it carries the logic to set the proper renderer
	// based on the media files detected
	getSrc = function getSrc() {
		return t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null ? t.mediaElement.renderer.getSrc() : null;
	},
	    setSrc = function setSrc(value) {

		var mediaFiles = [];

		// clean up URLs
		if (typeof value === 'string') {
			mediaFiles.push({
				src: value,
				type: value ? (0, _media.getTypeFromFile)(value) : ''
			});
		} else {
			for (i = 0, il = value.length; i < il; i++) {

				var src = (0, _media.absolutizeUrl)(value[i].src),
				    type = value[i].type;

				mediaFiles.push({
					src: src,
					type: (type === '' || type === null || type === undefined) && src ? (0, _media.getTypeFromFile)(src) : type
				});
			}
		}

		// find a renderer and URL match
		var renderInfo = _renderer.renderer.select(mediaFiles, t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : []),
		    event = void 0;

		// Ensure that the original gets the first source found
		t.mediaElement.originalNode.setAttribute('src', mediaFiles[0].src || '');

		// did we find a renderer?
		if (renderInfo === null) {
			event = _document2.default.createEvent('HTMLEvents');
			event.initEvent('error', false, false);
			event.message = 'No renderer found';
			t.mediaElement.dispatchEvent(event);
			return;
		}

		// turn on the renderer (this checks for the existing renderer already)
		t.mediaElement.changeRenderer(renderInfo.rendererName, mediaFiles);

		if (t.mediaElement.renderer === undefined || t.mediaElement.renderer === null) {
			event = _document2.default.createEvent('HTMLEvents');
			event.initEvent('error', false, false);
			event.message = 'Error creating renderer';
			t.mediaElement.dispatchEvent(event);
		}
	},
	    assignMethods = function assignMethods(methodName) {
		// run the method on the current renderer
		t.mediaElement[methodName] = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && typeof t.mediaElement.renderer[methodName] === 'function' ? t.mediaElement.renderer[methodName](args) : null;
		};
	};

	// Assign all methods/properties/events to fake node if renderer was found
	addProperty(t.mediaElement, 'src', getSrc, setSrc);
	t.mediaElement.getSrc = getSrc;
	t.mediaElement.setSrc = setSrc;

	for (i = 0, il = props.length; i < il; i++) {
		assignGettersSetters(props[i]);
	}

	for (i = 0, il = methods.length; i < il; i++) {
		assignMethods(methods[i]);
	}

	// IE && iOS
	if (!t.mediaElement.addEventListener) {

		t.mediaElement.events = {};

		// start: fake events
		t.mediaElement.addEventListener = function (eventName, callback) {
			// create or find the array of callbacks for this eventName
			t.mediaElement.events[eventName] = t.mediaElement.events[eventName] || [];

			// push the callback into the stack
			t.mediaElement.events[eventName].push(callback);
		};
		t.mediaElement.removeEventListener = function (eventName, callback) {
			// no eventName means remove all listeners
			if (!eventName) {
				t.mediaElement.events = {};
				return true;
			}

			// see if we have any callbacks for this eventName
			var callbacks = t.mediaElement.events[eventName];

			if (!callbacks) {
				return true;
			}

			// check for a specific callback
			if (!callback) {
				t.mediaElement.events[eventName] = [];
				return true;
			}

			// remove the specific callback
			for (var _i = 0, _il = callbacks.length; _i < _il; _i++) {
				if (callbacks[_i] === callback) {
					t.mediaElement.events[eventName].splice(_i, 1);
					return true;
				}
			}
			return false;
		};

		/**
   *
   * @param {Event} event
   */
		t.mediaElement.dispatchEvent = function (event) {

			var callbacks = t.mediaElement.events[event.type];

			if (callbacks) {
				for (i = 0, il = callbacks.length; i < il; i++) {
					callbacks[i].apply(null, [event]);
				}
			}
		};
	}

	if (t.mediaElement.originalNode !== null) {
		var mediaFiles = [];

		switch (t.mediaElement.originalNode.nodeName.toLowerCase()) {

			case 'iframe':
				mediaFiles.push({
					type: '',
					src: t.mediaElement.originalNode.getAttribute('src')
				});

				break;

			case 'audio':
			case 'video':
				var n = void 0,
				    src = void 0,
				    type = void 0,
				    sources = t.mediaElement.originalNode.childNodes.length,
				    nodeSource = t.mediaElement.originalNode.getAttribute('src');

				// Consider if node contains the `src` and `type` attributes
				if (nodeSource) {
					var node = t.mediaElement.originalNode;
					mediaFiles.push({
						type: (0, _media.formatType)(nodeSource, node.getAttribute('type')),
						src: nodeSource
					});
				}

				// test <source> types to see if they are usable
				for (i = 0; i < sources; i++) {
					n = t.mediaElement.originalNode.childNodes[i];
					if (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'source') {
						src = n.getAttribute('src');
						type = (0, _media.formatType)(src, n.getAttribute('type'));
						mediaFiles.push({ type: type, src: src });
					}
				}
				break;
		}

		if (mediaFiles.length > 0) {
			t.mediaElement.src = mediaFiles;
		}
	}

	if (t.mediaElement.options.success) {
		t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
	}

	// @todo: Verify if this is needed
	// if (t.mediaElement.options.error) {
	// 	t.mediaElement.options.error(this.mediaElement, this.mediaElement.originalNode);
	// }

	return t.mediaElement;
};

_window2.default.MediaElement = MediaElement;

exports.default = MediaElement;

},{"2":2,"3":3,"30":30,"6":6,"7":7}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Namespace
var mejs = {};

// version number
mejs.version = '3.0.0';

// Basic HTML5 settings
mejs.html5media = {
	/**
  * @type {String[]}
  */
	properties: [
	// GET/SET
	'volume', 'src', 'currentTime', 'muted',

	// GET only
	'duration', 'paused', 'ended',

	// OTHERS
	'error', 'currentSrc', 'networkState', 'preload', 'buffered', 'bufferedBytes', 'bufferedTime', 'readyState', 'seeking', 'initialTime', 'startOffsetTime', 'defaultPlaybackRate', 'playbackRate', 'played', 'seekable', 'autoplay', 'loop', 'controls'],
	/**
  * @type {String[]}
  */
	methods: ['load', 'play', 'pause', 'canPlayType'],
	/**
  * @type {String[]}
  */
	events: ['loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'pause', 'loadedmetadata', 'loadeddata', 'waiting', 'playing', 'canplay', 'canplaythrough', 'seeking', 'seeked', 'timeupdate', 'ended', 'ratechange', 'durationchange', 'volumechange'],
	/**
  * @type {String[]}
  */
	mediaTypes: ['audio/mp3', 'audio/ogg', 'audio/oga', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'video/webm', 'video/ogg']
};

_window2.default.mejs = mejs;

exports.default = mejs;

},{"3":3}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderer = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * Class to manage renderer selection and addition.
 * @class Renderer
 */
var Renderer = function () {
	function Renderer() {
		_classCallCheck(this, Renderer);

		this.renderers = {};
		this.order = [];
	}

	/**
  * Register a new renderer.
  *
  * @param {Object} renderer - An object with all the rendered information (name REQUIRED)
  * @method add
  */


	_createClass(Renderer, [{
		key: 'add',
		value: function add(renderer) {

			if (renderer.name === undefined) {
				throw new TypeError('renderer must contain at least `name` property');
			}

			this.renderers[renderer.name] = renderer;
			this.order.push(renderer.name);
		}

		/**
   * Iterate a list of renderers to determine which one should the player use.
   *
   * @param {Object[]} mediaFiles - A list of source and type obtained from video/audio/source tags: [{src:'',type:''}]
   * @param {?String[]} renderers - Optional list of pre-selected renderers
   * @return {?Object} The renderer's name and source selected
   * @method select
   */

	}, {
		key: 'select',
		value: function select(mediaFiles) {
			var renderers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


			renderers = renderers.length ? renderers : this.order;

			for (var i = 0, il = renderers.length; i < il; i++) {
				var key = renderers[i],
				    _renderer = this.renderers[key];

				if (_renderer !== null && _renderer !== undefined) {
					for (var j = 0, jl = mediaFiles.length; j < jl; j++) {
						if (typeof _renderer.canPlayType === 'function' && typeof mediaFiles[j].type === 'string' && _renderer.canPlayType(mediaFiles[j].type)) {
							return {
								rendererName: _renderer.name,
								src: mediaFiles[j].src
							};
						}
					}
				}
			}

			return null;
		}

		// Setters/getters

	}, {
		key: 'order',
		set: function set(order) {

			if (!Array.isArray(order)) {
				throw new TypeError('order must be an array of strings.');
			}

			this._order = order;
		},
		get: function get() {
			return this._order;
		}
	}, {
		key: 'renderers',
		set: function set(renderers) {

			if (renderers !== null && (typeof renderers === 'undefined' ? 'undefined' : _typeof(renderers)) !== 'object') {
				throw new TypeError('renderers must be an array of objects.');
			}

			this._renderers = renderers;
		},
		get: function get() {
			return this._renderers;
		}
	}]);

	return Renderer;
}();

var renderer = exports.renderer = new Renderer();

_mejs2.default.Renderers = renderer;

},{"6":6}],8:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _constants = _dereq_(27);

var Features = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fullscreen button
 *
 * This feature creates a button to toggle fullscreen on video; it considers a letiety of possibilities when dealing with it
 * since it is not consistent across browsers. It also accounts for triggering the event through Flash shim.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * @type {Boolean}
  */
	usePluginFullScreen: true,
	/**
  * @type {String}
  */
	fullscreenText: ''
});

Object.assign(_player2.default.prototype, {

	/**
  * @type {Boolean}
  */
	isFullScreen: false,
	/**
  * @type {Boolean}
  */
	isNativeFullScreen: false,
	/**
  * @type {Boolean}
  */
	isInIframe: false,
	/**
  * @type {Boolean}
  */
	isPluginClickThroughCreated: false,
	/**
  * Possible modes
  * (1) 'native-native'  HTML5 video  + browser fullscreen (IE10+, etc.)
  * (2) 'plugin-native'  plugin video + browser fullscreen (fails in some versions of Firefox)
  * (3) 'fullwindow'     Full window (retains all UI)
  * (4) 'plugin-click'   Flash 1 - click through with pointer events
  * (5) 'plugin-hover'   Flash 2 - hover popup in flash (IE6-8)
  *
  * @type {String}
  */
	fullscreenMode: '',
	/**
  *
  */
	containerSizeTimeout: null,

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  */
	buildfullscreen: function buildfullscreen(player, controls, layers, media) {

		if (!player.isVideo) {
			return;
		}

		player.isInIframe = _window2.default.location !== _window2.default.parent.location;

		// detect on start
		media.addEventListener('loadstart', function () {
			player.detectFullscreenMode();
		});

		// build button
		var t = this,
		    hideTimeout = null,
		    fullscreenTitle = t.options.fullscreenText ? t.options.fullscreenText : _i18n2.default.t('mejs.fullscreen'),
		    fullscreenBtn = $('<div class="' + t.options.classPrefix + 'button ' + t.options.classPrefix + 'fullscreen-button">' + ('<button type="button" aria-controls="' + t.id + '" title="' + fullscreenTitle + '" aria-label="' + fullscreenTitle + '"></button>') + '</div>').appendTo(controls).on('click', function () {

			// toggle fullscreen
			var isFullScreen = Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN || player.isFullScreen;

			if (isFullScreen) {
				player.exitFullScreen();
			} else {
				player.enterFullScreen();
			}
		}).on('mouseover', function () {

			// very old browsers with a plugin
			if (t.fullscreenMode === 'plugin-hover') {
				if (hideTimeout !== null) {
					clearTimeout(hideTimeout);
					hideTimeout = null;
				}

				var buttonPos = fullscreenBtn.offset(),
				    containerPos = player.container.offset();

				media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, true);
			}
		}).on('mouseout', function () {

			if (t.fullscreenMode === 'plugin-hover') {
				if (hideTimeout !== null) {
					clearTimeout(hideTimeout);
				}

				hideTimeout = setTimeout(function () {
					media.hideFullscreenButton();
				}, 1500);
			}
		});

		player.fullscreenBtn = fullscreenBtn;

		t.globalBind('keydown', function (e) {
			var key = e.which || e.keyCode || 0;
			if (key === 27 && (Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN || t.isFullScreen)) {
				player.exitFullScreen();
			}
		});

		t.normalHeight = 0;
		t.normalWidth = 0;

		// setup native fullscreen event
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN) {

			//
			/**
    * Detect any changes on fullscreen
    *
    * Chrome doesn't always fire this in an `<iframe>`
    * @private
    */
			var fullscreenChanged = function fullscreenChanged() {
				if (player.isFullScreen) {
					if (Features.isFullScreen()) {
						player.isNativeFullScreen = true;
						// reset the controls once we are fully in full screen
						player.setControlsSize();
					} else {
						player.isNativeFullScreen = false;
						// when a user presses ESC
						// make sure to put the player back into place
						player.exitFullScreen();
					}
				}
			};

			player.globalBind(Features.FULLSCREEN_EVENT_NAME, fullscreenChanged);
		}
	},

	/**
  * Detect the type of fullscreen based on browser's capabilities
  *
  * @return {String}
  */
	detectFullscreenMode: function detectFullscreenMode() {

		var t = this,
		    mode = '',
		    isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null;

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && isNative) {
			mode = 'native-native';
		} else if (Features.HAS_TRUE_NATIVE_FULLSCREEN && !isNative) {
			mode = 'plugin-native';
		} else if (t.usePluginFullScreen) {
			if (Features.SUPPORT_POINTER_EVENTS) {
				mode = 'plugin-click';
				// this needs some special setup
				t.createPluginClickThrough();
			} else {
				mode = 'plugin-hover';
			}
		} else {
			mode = 'fullwindow';
		}

		t.fullscreenMode = mode;
		return mode;
	},

	/**
  *
  */
	createPluginClickThrough: function createPluginClickThrough() {

		var t = this;

		// don't build twice
		if (t.isPluginClickThroughCreated) {
			return;
		}

		// allows clicking through the fullscreen button and controls down directly to Flash

		/*
   When a user puts his mouse over the fullscreen button, we disable the controls so that mouse events can go down to flash (pointer-events)
   We then put a divs over the video and on either side of the fullscreen button
   to capture mouse movement and restore the controls once the mouse moves outside of the fullscreen button
   */

		var fullscreenIsDisabled = false,
		    restoreControls = function restoreControls() {
			if (fullscreenIsDisabled) {
				// hide the hovers
				for (var i in hoverDivs) {
					hoverDivs[i].hide();
				}

				// restore the control bar
				t.fullscreenBtn.css('pointer-events', '');
				t.controls.css('pointer-events', '');

				// prevent clicks from pausing video
				t.media.removeEventListener('click', t.clickToPlayPauseCallback);

				// store for later
				fullscreenIsDisabled = false;
			}
		},
		    hoverDivs = {},
		    hoverDivNames = ['top', 'left', 'right', 'bottom'],
		    positionHoverDivs = function positionHoverDivs() {
			var fullScreenBtnOffsetLeft = fullscreenBtn.offset().left - t.container.offset().left,
			    fullScreenBtnOffsetTop = fullscreenBtn.offset().top - t.container.offset().top,
			    fullScreenBtnWidth = fullscreenBtn.outerWidth(true),
			    fullScreenBtnHeight = fullscreenBtn.outerHeight(true),
			    containerWidth = t.container.width(),
			    containerHeight = t.container.height();

			for (var hover in hoverDivs) {
				hover.css({ position: 'absolute', top: 0, left: 0 }); //, backgroundColor: '#f00'});
			}

			// over video, but not controls
			hoverDivs.top.width(containerWidth).height(fullScreenBtnOffsetTop);

			// over controls, but not the fullscreen button
			hoverDivs.left.width(fullScreenBtnOffsetLeft).height(fullScreenBtnHeight).css({ top: fullScreenBtnOffsetTop });

			// after the fullscreen button
			hoverDivs.right.width(containerWidth - fullScreenBtnOffsetLeft - fullScreenBtnWidth).height(fullScreenBtnHeight).css({
				top: fullScreenBtnOffsetTop,
				left: fullScreenBtnOffsetLeft + fullScreenBtnWidth
			});

			// under the fullscreen button
			hoverDivs.bottom.width(containerWidth).height(containerHeight - fullScreenBtnHeight - fullScreenBtnOffsetTop).css({ top: fullScreenBtnOffsetTop + fullScreenBtnHeight });
		};

		t.globalBind('resize', function () {
			positionHoverDivs();
		});

		for (var i = 0, len = hoverDivNames.length; i < len; i++) {
			hoverDivs[hoverDivNames[i]] = $('<div class="' + t.options.classPrefix + 'fullscreen-hover" />').appendTo(t.container).mouseover(restoreControls).hide();
		}

		// on hover, kill the fullscreen button's HTML handling, allowing clicks down to Flash
		fullscreenBtn.on('mouseover', function () {

			if (!t.isFullScreen) {

				var buttonPos = fullscreenBtn.offset(),
				    containerPos = player.container.offset();

				// move the button in Flash into place
				media.positionFullscreenButton(buttonPos.left - containerPos.left, buttonPos.top - containerPos.top, false);

				// allows click through
				t.fullscreenBtn.css('pointer-events', 'none');
				t.controls.css('pointer-events', 'none');

				// restore click-to-play
				t.media.addEventListener('click', t.clickToPlayPauseCallback);

				// show the divs that will restore things
				for (var _i in hoverDivs) {
					hoverDivs[_i].show();
				}

				positionHoverDivs();

				fullscreenIsDisabled = true;
			}
		});

		// restore controls anytime the user enters or leaves fullscreen
		media.addEventListener('fullscreenchange', function () {
			t.isFullScreen = !t.isFullScreen;
			// don't allow plugin click to pause video - messes with
			// plugin's controls
			if (t.isFullScreen) {
				t.media.removeEventListener('click', t.clickToPlayPauseCallback);
			} else {
				t.media.addEventListener('click', t.clickToPlayPauseCallback);
			}
			restoreControls();
		});

		// the mouseout event doesn't work on the fullscren button, because we already killed the pointer-events
		// so we use the document.mousemove event to restore controls when the mouse moves outside the fullscreen button

		t.globalBind('mousemove', function (e) {

			// if the mouse is anywhere but the fullsceen button, then restore it all
			if (fullscreenIsDisabled) {

				var fullscreenBtnPos = fullscreenBtn.offset();

				if (e.pageY < fullscreenBtnPos.top || e.pageY > fullscreenBtnPos.top + fullscreenBtn.outerHeight(true) || e.pageX < fullscreenBtnPos.left || e.pageX > fullscreenBtnPos.left + fullscreenBtn.outerWidth(true)) {

					fullscreenBtn.css('pointer-events', '');
					t.controls.css('pointer-events', '');

					fullscreenIsDisabled = false;
				}
			}
		});

		t.isPluginClickThroughCreated = true;
	},
	/**
  * Feature destructor.
  *
  * Always has to be prefixed with `clean` and the name that was used in features list
  * @param {MediaElementPlayer} player
  */
	cleanfullscreen: function cleanfullscreen(player) {
		player.exitFullScreen();
	},

	/**
  *
  */
	enterFullScreen: function enterFullScreen() {

		var t = this,
		    isNative = t.media.rendererName !== null && t.media.rendererName.match(/(html5|native)/) !== null;

		if (Features.IS_IOS && Features.HAS_IOS_FULLSCREEN && typeof t.media.webkitEnterFullscreen === 'function') {
			t.media.webkitEnterFullscreen();
			return;
		}

		// set it to not show scroll bars so 100% will work
		$(_document2.default.documentElement).addClass(t.options.classPrefix + 'fullscreen');

		// store sizing
		t.normalHeight = t.container.height();
		t.normalWidth = t.container.width();

		// attempt to do true fullscreen
		if (t.fullscreenMode === 'native-native' || t.fullscreenMode === 'plugin-native') {

			Features.requestFullScreen(t.container[0]);

			if (t.isInIframe) {
				// sometimes exiting from fullscreen doesn't work
				// notably in Chrome <iframe>. Fixed in version 17
				setTimeout(function checkFullscreen() {

					if (t.isNativeFullScreen) {
						var percentErrorMargin = 0.002,
						    // 0.2%
						windowWidth = $(_window2.default).width(),
						    screenWidth = screen.width,
						    absDiff = Math.abs(screenWidth - windowWidth),
						    marginError = screenWidth * percentErrorMargin;

						// check if the video is suddenly not really fullscreen
						if (absDiff > marginError) {
							// manually exit
							t.exitFullScreen();
						} else {
							// test again
							setTimeout(checkFullscreen, 500);
						}
					}
				}, 1000);
			}
		} else if (t.fullscreeMode === 'fullwindow') {}
		// move into position

		// make full size
		t.container.addClass(t.options.classPrefix + 'container-fullscreen').width('100%').height('100%');

		// Only needed for safari 5.1 native full screen, can cause display issues elsewhere
		// Actually, it seems to be needed for IE8, too
		t.containerSizeTimeout = setTimeout(function () {
			t.container.css({ width: '100%', height: '100%' });
			t.setControlsSize();
		}, 500);

		if (isNative) {
			t.$media.width('100%').height('100%');
		} else {
			t.container.find('iframe, embed, object, video').width('100%').height('100%');
		}

		if (t.options.setDimensions) {
			t.media.setSize(screen.width, screen.height);
		}

		t.layers.children('div').width('100%').height('100%');

		if (t.fullscreenBtn) {
			t.fullscreenBtn.removeClass(t.options.classPrefix + 'fullscreen').addClass(t.options.classPrefix + 'unfullscreen');
		}

		t.setControlsSize();
		t.isFullScreen = true;

		var zoomFactor = Math.min(screen.width / t.width, screen.height / t.height);
		t.container.find('.' + t.options.classPrefix + 'captions-text').css('font-size', zoomFactor * 100 + '%');
		t.container.find('.' + t.options.classPrefix + 'captions-text').css('line-height', 'normal');
		t.container.find('.' + t.options.classPrefix + 'captions-position').css('bottom', '45px');

		t.container.trigger('enteredfullscreen');
	},

	/**
  *
  */
	exitFullScreen: function exitFullScreen() {

		var t = this,
		    isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null;

		// Prevent container from attempting to stretch a second time
		clearTimeout(t.containerSizeTimeout);

		// come out of native fullscreen
		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && (Features.IS_FULLSCREEN || t.isFullScreen)) {
			Features.cancelFullScreen();
		}

		// restore scroll bars to document
		$(_document2.default.documentElement).removeClass(t.options.classPrefix + 'fullscreen');

		t.container.removeClass(t.options.classPrefix + 'container-fullscreen');

		if (t.options.setDimensions) {
			t.container.width(t.normalWidth).height(t.normalHeight);
			if (isNative) {
				t.$media.width(t.normalWidth).height(t.normalHeight);
			} else {
				t.container.find('iframe, embed, object, video').width(t.normalWidth).height(t.normalHeight);
			}

			t.media.setSize(t.normalWidth, t.normalHeight);

			t.layers.children('div').width(t.normalWidth).height(t.normalHeight);
		}

		t.fullscreenBtn.removeClass(t.options.classPrefix + 'unfullscreen').addClass(t.options.classPrefix + 'fullscreen');

		t.setControlsSize();
		t.isFullScreen = false;

		t.container.find('.' + t.options.classPrefix + 'captions-text').css('font-size', '');
		t.container.find('.' + t.options.classPrefix + 'captions-text').css('line-height', '');
		t.container.find('.' + t.options.classPrefix + 'captions-position').css('bottom', '');

		t.container.trigger('exitedfullscreen');
	}
});

},{"16":16,"2":2,"27":27,"3":3,"4":4,"6":6}],9:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * @type {String}
  */
	playText: '',
	/**
  * @type {String}
  */
	pauseText: ''
});

Object.assign(_player2.default.prototype, {
	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  * @public
  */
	buildplaypause: function buildplaypause(player, controls, layers, media) {
		var t = this,
		    op = t.options,
		    playTitle = op.playText ? op.playText : _i18n2.default.t('mejs.play'),
		    pauseTitle = op.pauseText ? op.pauseText : _i18n2.default.t('mejs.pause'),
		    play = $('<div class="' + t.options.classPrefix + 'button ' + t.options.classPrefix + 'playpause-button ' + (t.options.classPrefix + 'play">') + ('<button type="button" aria-controls="' + t.id + '" title="' + playTitle + '" aria-label="' + pauseTitle + '"></button>') + '</div>').appendTo(controls).click(function () {
			if (media.paused) {
				media.play();
			} else {
				media.pause();
			}
		}),
		    play_btn = play.find('button');

		/**
   * @private
   * @param {String} which - token to determine new state of button
   */
		function togglePlayPause(which) {
			if ('play' === which) {
				play.removeClass(t.options.classPrefix + 'play').removeClass(t.options.classPrefix + 'replay').addClass(t.options.classPrefix + 'pause');
				play_btn.attr({
					'title': pauseTitle,
					'aria-label': pauseTitle
				});
			} else {
				play.removeClass(t.options.classPrefix + 'pause').removeClass(t.options.classPrefix + 'replay').addClass(t.options.classPrefix + 'play');
				play_btn.attr({
					'title': playTitle,
					'aria-label': playTitle
				});
			}
		}

		togglePlayPause('pse');

		media.addEventListener('play', function () {
			togglePlayPause('play');
		}, false);
		media.addEventListener('playing', function () {
			togglePlayPause('play');
		}, false);

		media.addEventListener('pause', function () {
			togglePlayPause('pse');
		}, false);
		media.addEventListener('paused', function () {
			togglePlayPause('pse');
		}, false);

		media.addEventListener('ended', function () {

			if (!player.options.loop) {
				play.removeClass(t.options.classPrefix + 'pause').removeClass(t.options.classPrefix + 'play').addClass(t.options.classPrefix + 'replay');
			}
		}, false);
	}
});

},{"16":16,"4":4}],10:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(27);

var _time = _dereq_(32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Progress/loaded bar
 *
 * This feature creates a progress bar with a slider in the control bar, and updates it based on native events.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * Enable tooltip that shows time in progress bar
  * @type {Boolean}
  */
	enableProgressTooltip: true
});

Object.assign(_player2.default.prototype, {

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  */
	buildprogress: function buildprogress(player, controls, layers, media) {

		var t = this,
		    mouseIsDown = false,
		    mouseIsOver = false,
		    lastKeyPressTime = 0,
		    startedPaused = false,
		    autoRewindInitial = player.options.autoRewind,
		    tooltip = player.options.enableProgressTooltip ? '<span class="' + t.options.classPrefix + 'time-float">' + ('<span class="' + t.options.classPrefix + 'time-float-current">00:00</span>') + ('<span class="' + t.options.classPrefix + 'time-float-corner"></span>') + '</span>' : "";

		$('<div class="' + t.options.classPrefix + 'time-rail">' + ('<span class="' + t.options.classPrefix + 'time-total ' + t.options.classPrefix + 'time-slider">') + ('<span class="' + t.options.classPrefix + 'time-buffering"></span>') + ('<span class="' + t.options.classPrefix + 'time-loaded"></span>') + ('<span class="' + t.options.classPrefix + 'time-current"></span>') + ('<span class="' + t.options.classPrefix + 'time-handle"></span>') + ('' + tooltip) + '</span>' + '</div>').appendTo(controls);
		controls.find('.' + t.options.classPrefix + 'time-buffering').hide();

		t.rail = controls.find('.' + t.options.classPrefix + 'time-rail');
		t.total = controls.find('.' + t.options.classPrefix + 'time-total');
		t.loaded = controls.find('.' + t.options.classPrefix + 'time-loaded');
		t.current = controls.find('.' + t.options.classPrefix + 'time-current');
		t.handle = controls.find('.' + t.options.classPrefix + 'time-handle');
		t.timefloat = controls.find('.' + t.options.classPrefix + 'time-float');
		t.timefloatcurrent = controls.find('.' + t.options.classPrefix + 'time-float-current');
		t.slider = controls.find('.' + t.options.classPrefix + 'time-slider');

		/**
   *
   * @private
   * @param {Event} e
   */
		var handleMouseMove = function handleMouseMove(e) {

			var offset = t.total.offset(),
			    width = t.total.width(),
			    percentage = 0,
			    newTime = 0,
			    pos = 0,
			    x = void 0;

			// mouse or touch position relative to the object
			if (e.originalEvent && e.originalEvent.changedTouches) {
				x = e.originalEvent.changedTouches[0].pageX;
			} else if (e.changedTouches) {
				// for Zepto
				x = e.changedTouches[0].pageX;
			} else {
				x = e.pageX;
			}

			if (media.duration) {
				if (x < offset.left) {
					x = offset.left;
				} else if (x > width + offset.left) {
					x = width + offset.left;
				}

				pos = x - offset.left;
				percentage = pos / width;
				newTime = percentage <= 0.02 ? 0 : percentage * media.duration;

				// seek to where the mouse is
				if (mouseIsDown && newTime.toFixed(4) !== media.currentTime.toFixed(4)) {
					media.setCurrentTime(newTime);
				}

				// position floating time box
				if (!_constants.HAS_TOUCH) {
					t.timefloat.css('left', pos);
					t.timefloatcurrent.html((0, _time.secondsToTimeCode)(newTime, player.options.alwaysShowHours));
					t.timefloat.show();
				}
			}
		},

		/**
   * Update elements in progress bar for accessibility purposes only when player is paused.
   *
   * This is to avoid attempts to repeat the time over and over again when media is playing.
   * @private
   */
		updateSlider = function updateSlider() {

			var seconds = media.currentTime,
			    timeSliderText = _i18n2.default.t('mejs.time-slider'),
			    time = (0, _time.secondsToTimeCode)(seconds, player.options.alwaysShowHours),
			    duration = media.duration;

			t.slider.attr({
				'role': 'slider',
				'tabindex': 0
			});
			if (media.paused) {
				t.slider.attr({
					'aria-label': timeSliderText,
					'aria-valuemin': 0,
					'aria-valuemax': duration,
					'aria-valuenow': seconds,
					'aria-valuetext': time
				});
			} else {
				t.slider.removeAttr('aria-label aria-valuemin aria-valuemax aria-valuenow aria-valuetext');
			}
		},

		/**
   *
   * @private
   */
		restartPlayer = function restartPlayer() {
			var now = new Date();
			if (now - lastKeyPressTime >= 1000) {
				media.play();
			}
		};

		// Events
		t.slider.on('focus', function () {
			player.options.autoRewind = false;
		}).on('blur', function () {
			player.options.autoRewind = autoRewindInitial;
		}).on('keydown', function (e) {

			if (new Date() - lastKeyPressTime >= 1000) {
				startedPaused = media.paused;
			}

			if (t.options.keyActions.length) {

				var keyCode = e.which || e.keyCode || 0,
				    duration = media.duration,
				    seekTime = media.currentTime,
				    seekForward = player.options.defaultSeekForwardInterval(media),
				    seekBackward = player.options.defaultSeekBackwardInterval(media);

				switch (keyCode) {
					case 37: // left
					case 40:
						// Down
						if (media.duration !== Infinity) {
							seekTime -= seekBackward;
						}
						break;
					case 39: // Right
					case 38:
						// Up
						if (media.duration !== Infinity) {
							seekTime += seekForward;
						}
						break;
					case 36:
						// Home
						seekTime = 0;
						break;
					case 35:
						// end
						seekTime = duration;
						break;
					case 32:
						// space
						if (!_constants.IS_FIREFOX) {
							if (media.paused) {
								media.play();
							} else {
								media.pause();
							}
						}
						return;
					case 13:
						// enter
						if (media.paused) {
							media.play();
						} else {
							media.pause();
						}
						return;
					default:
						return;
				}

				seekTime = seekTime < 0 ? 0 : seekTime >= duration ? duration : Math.floor(seekTime);
				lastKeyPressTime = new Date();
				if (!startedPaused) {
					media.pause();
				}

				if (seekTime < media.duration && !startedPaused) {
					setTimeout(restartPlayer, 1100);
				}

				media.setCurrentTime(seekTime);

				e.preventDefault();
				e.stopPropagation();
			}
		}).on('click', function (e) {

			if (media.duration !== Infinity) {
				var paused = media.paused;

				if (!paused) {
					media.pause();
				}

				handleMouseMove(e);

				if (!paused) {
					media.play();
				}
			}

			e.preventDefault();
			e.stopPropagation();
		});

		// handle clicks
		t.rail.on('mousedown touchstart', function (e) {
			if (media.duration !== Infinity) {
				// only handle left clicks or touch
				if (e.which === 1 || e.which === 0) {
					mouseIsDown = true;
					handleMouseMove(e);
					t.globalBind('mousemove.dur touchmove.dur', function (e) {
						handleMouseMove(e);
					});
					t.globalBind('mouseup.dur touchend.dur', function () {
						mouseIsDown = false;
						if (t.timefloat !== undefined) {
							t.timefloat.hide();
						}
						t.globalUnbind('mousemove.dur touchmove.dur mouseup.dur touchend.dur');
					});
				}
			}
		}).on('mouseenter', function (e) {
			if (media.duration !== Infinity) {
				mouseIsOver = true;
				t.globalBind('mousemove.dur', function (e) {
					handleMouseMove(e);
				});
				if (t.timefloat !== undefined && !_constants.HAS_TOUCH) {
					t.timefloat.show();
				}
			}
		}).on('mouseleave', function () {
			if (media.duration !== Infinity) {
				mouseIsOver = false;
				if (!mouseIsDown) {
					t.globalUnbind('mousemove.dur');
					if (t.timefloat !== undefined) {
						t.timefloat.hide();
					}
				}
			}
		});

		// loading
		// If media is does not have a finite duration, remove progress bar interaction
		// and indicate that is a live broadcast
		media.addEventListener('progress', function (e) {
			if (media.duration !== Infinity) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
			} else if (!controls.find('.' + t.options.classPrefix + 'broadcast').length) {
				controls.find('.' + t.options.classPrefix + 'time-rail').empty().html('<span class="' + t.options.classPrefix + 'broadcast">' + mejs.i18n.t('mejs.live-broadcast') + '</span>');
			}
		}, false);

		// current time
		media.addEventListener('timeupdate', function (e) {
			if (media.duration !== Infinity) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
				updateSlider(e);
			} else if (!controls.find('.' + t.options.classPrefix + 'broadcast').length) {
				controls.find('.' + t.options.classPrefix + 'time-rail').empty().html('<span class="' + t.options.classPrefix + 'broadcast">' + mejs.i18n.t('mejs.live-broadcast') + '</span>');
			}
		}, false);

		t.container.on('controlsresize', function (e) {
			if (media.duration !== Infinity) {
				player.setProgressRail(e);
				player.setCurrentRail(e);
			}
		});
	},

	/**
  * Calculate the progress on the media and update progress bar's width
  *
  * @param {Event} e
  */
	setProgressRail: function setProgressRail(e) {

		var t = this,
		    target = e !== undefined ? e.target : t.media,
		    percent = null;

		// newest HTML5 spec has buffered array (FF4, Webkit)
		if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
			// account for a real array with multiple values - always read the end of the last buffer
			percent = target.buffered.end(target.buffered.length - 1) / target.duration;
		}
		// Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
		// to be anything other than 0. If the byte count is available we use this instead.
		// Browsers that support the else if do not seem to have the bufferedBytes value and
		// should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
		else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
				percent = target.bufferedBytes / target.bytesTotal;
			}
			// Firefox 3 with an Ogg file seems to go this way
			else if (e && e.lengthComputable && e.total !== 0) {
					percent = e.loaded / e.total;
				}

		// finally update the progress bar
		if (percent !== null) {
			percent = Math.min(1, Math.max(0, percent));
			// update loaded bar
			if (t.loaded && t.total) {
				t.loaded.width(percent * 100 + '%');
			}
		}
	},
	/**
  * Update the slider's width depending on the current time
  *
  */
	setCurrentRail: function setCurrentRail() {

		var t = this;

		if (t.media.currentTime !== undefined && t.media.duration) {

			// update bar and handle
			if (t.total && t.handle) {
				var newWidth = Math.round(t.total.width() * t.media.currentTime / t.media.duration),
				    handlePos = newWidth - Math.round(t.handle.outerWidth(true) / 2);

				newWidth = t.media.currentTime / t.media.duration * 100;
				t.current.width(newWidth + '%');
				t.handle.css('left', handlePos);
			}
		}
	}
});

},{"16":16,"27":27,"32":32,"4":4}],11:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Current/duration times
 *
 * This feature creates/updates the duration and progress times in the control bar, based on native events.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * The initial duration
  * @type {Number}
  */
	duration: 0,
	/**
  * @type {String}
  */
	timeAndDurationSeparator: '<span> | </span>'
});

Object.assign(_player2.default.prototype, {

	/**
  * Current time constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  */
	buildcurrent: function buildcurrent(player, controls, layers, media) {
		var t = this;

		$('<div class="' + t.options.classPrefix + 'time" role="timer" aria-live="off">' + ('<span class="' + t.options.classPrefix + 'currenttime">' + (0, _time.secondsToTimeCode)(0, player.options.alwaysShowHours) + '</span>') + '</div>').appendTo(controls);

		t.currenttime = t.controls.find('.' + t.options.classPrefix + 'currenttime');

		media.addEventListener('timeupdate', function () {
			if (t.controlsAreVisible) {
				player.updateCurrent();
			}
		}, false);
	},

	/**
  * Duration time constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  */
	buildduration: function buildduration(player, controls, layers, media) {
		var t = this;

		if (controls.children().last().find('.' + t.options.classPrefix + 'currenttime').length > 0) {
			$(t.options.timeAndDurationSeparator + '<span class="' + t.options.classPrefix + 'duration">' + ((0, _time.secondsToTimeCode)(t.options.duration, t.options.alwaysShowHours) + '</span>')).appendTo(controls.find('.' + t.options.classPrefix + 'time'));
		} else {

			// add class to current time
			controls.find('.' + t.options.classPrefix + 'currenttime').parent().addClass(t.options.classPrefix + 'currenttime-container');

			$('<div class="' + t.options.classPrefix + 'time ' + t.options.classPrefix + 'duration-container">' + ('<span class="' + t.options.classPrefix + 'duration">') + ((0, _time.secondsToTimeCode)(t.options.duration, t.options.alwaysShowHours) + '</span>') + '</div>').appendTo(controls);
		}

		t.durationD = t.controls.find('.' + t.options.classPrefix + 'duration');

		media.addEventListener('timeupdate', function () {
			if (t.controlsAreVisible) {
				player.updateDuration();
			}
		}, false);
	},

	/**
  * Update the current time and output it in format 00:00
  *
  */
	updateCurrent: function updateCurrent() {
		var t = this;

		var currentTime = t.media.currentTime;

		if (isNaN(currentTime)) {
			currentTime = 0;
		}

		if (t.currenttime) {
			t.currenttime.html((0, _time.secondsToTimeCode)(currentTime, t.options.alwaysShowHours));
		}
	},

	/**
  * Update the duration time and output it in format 00:00
  *
  */
	updateDuration: function updateDuration() {
		var t = this;

		var duration = t.media.duration;

		if (isNaN(duration) || duration === Infinity || duration < 0) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}

		//Toggle the long video class if the video is longer than an hour.
		t.container.toggleClass(t.options.classPrefix + 'long-video', duration > 3600);

		if (t.durationD && duration > 0) {
			t.durationD.html((0, _time.secondsToTimeCode)(duration, t.options.alwaysShowHours));
		}
	}
});

},{"16":16,"32":32}],12:[function(_dereq_,module,exports){
'use strict';

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Closed Captions (CC) button
 *
 * This feature enables the displaying of a CC button in the control bar, and also contains the methods to start media
 * with a certain language (if available), toggle captions, etc.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * Default language to start media using ISO 639-2 Language Code List (en, es, it, etc.)
  * If there are multiple tracks for one language, the last track node found is activated
  * @see https://www.loc.gov/standards/iso639-2/php/code_list.php
  * @type {String}
  */
	startLanguage: '',
	/**
  * @type {String}
  */
	tracksText: '',
	/**
  * Avoid to screen reader speak captions over an audio track.
  *
  * @type {Boolean}
  */
	tracksAriaLive: false,
	/**
  * Remove the [cc] button when no track nodes are present
  * @type {Boolean}
  */
	hideCaptionsButtonWhenEmpty: true,
	/**
  * Change captions to pop-up if true and only one track node is found
  * @type {Boolean}
  */
	toggleCaptionsButtonWhenOnlyOne: false,
	/**
  * @type {String}
  */
	slidesSelector: ''
});

Object.assign(_player2.default.prototype, {

	/**
  * @type {Boolean}
  */
	hasChapters: false,

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  */
	buildtracks: function buildtracks(player, controls, layers, media) {
		if (player.tracks.length === 0) {
			return;
		}

		var t = this,
		    attr = t.options.tracksAriaLive ? ' role="log" aria-live="assertive" aria-atomic="false"' : '',
		    tracksTitle = t.options.tracksText ? t.options.tracksText : _i18n2.default.t('mejs.captions-subtitles'),
		    i = void 0,
		    kind = void 0;

		// If browser will do native captions, prefer mejs captions, loop through tracks and hide
		if (t.domNode.textTracks) {
			for (i = t.domNode.textTracks.length - 1; i >= 0; i--) {
				t.domNode.textTracks[i].mode = 'hidden';
			}
		}

		t.cleartracks(player);
		player.chapters = $('<div class="' + t.options.classPrefix + 'chapters ' + t.options.classPrefix + 'layer"></div>').prependTo(layers).hide();
		player.captions = $('<div class="' + t.options.classPrefix + 'captions-layer ' + t.options.classPrefix + 'layer">' + ('<div class="' + t.options.classPrefix + 'captions-position ' + t.options.classPrefix + 'captions-position-hover"' + attr + '>') + ('<span class="' + t.options.classPrefix + 'captions-text"></span>') + '</div>' + '</div>').prependTo(layers).hide();
		player.captionsText = player.captions.find('.' + t.options.classPrefix + 'captions-text');
		player.captionsButton = $('<div class="' + t.options.classPrefix + 'button ' + t.options.classPrefix + 'captions-button">' + ('<button type="button" aria-controls="' + t.id + '" title="' + tracksTitle + '" aria-label="' + tracksTitle + '"></button>') + ('<div class="' + t.options.classPrefix + 'captions-selector ' + t.options.classPrefix + 'offscreen">') + ('<ul class="' + t.options.classPrefix + 'captions-selector-list">') + ('<li class="' + t.options.classPrefix + 'captions-selector-list-item">') + ('<input type="radio" class="' + t.options.classPrefix + 'captions-selector-input" ') + ('name="' + player.id + '_captions" id="' + player.id + '_captions_none" ') + 'value="none" checked="checked" />' + ('<label class="' + t.options.classPrefix + 'captions-selector-label ') + (t.options.classPrefix + 'captions-selected" ') + ('for="' + player.id + '_captions_none">' + _i18n2.default.t('mejs.none') + '</label>') + '</li>' + '</ul>' + '</div>' + '</div>').appendTo(controls);

		var subtitleCount = 0,
		    total = player.tracks.length;

		for (i = 0; i < total; i++) {
			kind = player.tracks[i].kind;
			if (kind === 'subtitles' || kind === 'captions') {
				subtitleCount++;
			}
		}

		// if only one language then just make the button a toggle
		if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitleCount === 1) {
			// click
			player.captionsButton.on('click', function () {
				var trackId = 'none';
				if (player.selectedTrack === null) {
					trackId = player.tracks[0].trackId;
				}
				player.setTrack(trackId);
			});
		} else {
			// hover or keyboard focus
			player.captionsButton.on('mouseenter focusin', function () {
				$(this).find('.' + t.options.classPrefix + 'captions-selector').removeClass(t.options.classPrefix + 'offscreen');
			}).on('mouseleave focusout', function () {
				$(this).find('.' + t.options.classPrefix + 'captions-selector').addClass(t.options.classPrefix + 'offscreen');
			})
			// handle clicks to the language radio buttons
			.on('click', 'input[type=radio]', function () {
				// value is trackId, same as the actual id, and we're using it here
				// because the "none" checkbox doesn't have a trackId
				// to use, but we want to know when "none" is clicked
				player.setTrack(this.value);
			}).on('click', '.' + t.options.classPrefix + 'captions-selector-label', function () {
				$(this).siblings('input[type="radio"]').trigger('click');
			})
			//Allow up/down arrow to change the selected radio without changing the volume.
			.on('keydown', function (e) {
				e.stopPropagation();
			});
		}

		if (!player.options.alwaysShowControls) {
			// move with controls
			player.container.on('controlsshown', function () {
				// push captions above controls
				player.container.find('.' + t.options.classPrefix + 'captions-position').addClass(t.options.classPrefix + 'captions-position-hover');
			}).on('controlshidden', function () {
				if (!media.paused) {
					// move back to normal place
					player.container.find('.' + t.options.classPrefix + 'captions-position').removeClass(t.options.classPrefix + 'captions-position-hover');
				}
			});
		} else {
			player.container.find('.' + t.options.classPrefix + 'captions-position').addClass(t.options.classPrefix + 'captions-position-hover');
		}

		player.trackToLoad = -1;
		player.selectedTrack = null;
		player.isLoadingTrack = false;

		// add to list
		for (i = 0; i < total; i++) {
			kind = player.tracks[i].kind;
			if (kind === 'subtitles' || kind === 'captions') {
				player.addTrackButton(player.tracks[i].trackId, player.tracks[i].srclang, player.tracks[i].label);
			}
		}

		// start loading tracks
		player.loadNextTrack();

		media.addEventListener('timeupdate', function () {
			player.displayCaptions();
		}, false);

		if (player.options.slidesSelector !== '') {
			player.slidesContainer = $(player.options.slidesSelector);

			media.addEventListener('timeupdate', function () {
				player.displaySlides();
			}, false);
		}

		media.addEventListener('loadedmetadata', function () {
			player.displayChapters();
		}, false);

		player.container.hover(function () {
			// chapters
			if (player.hasChapters) {
				player.chapters.removeClass(t.options.classPrefix + 'offscreen');
				player.chapters.fadeIn(200, function () {
					var self = $(this);
					self.height(self.find('.' + t.options.classPrefix + 'chapter').outerHeight());
				});
			}
		}, function () {
			if (player.hasChapters) {
				if (media.paused) {
					player.chapters.fadeOut(200, function () {
						$(this).addClass(t.options.classPrefix + 'offscreen');
					});
				} else {
					player.chapters.show();
				}
			}
		});

		t.container.on('controlsresize', function () {
			t.adjustLanguageBox();
		});

		// check for autoplay
		if (player.node.getAttribute('autoplay') !== null) {
			player.chapters.addClass(t.options.classPrefix + 'offscreen');
		}
	},

	/**
  * Feature destructor.
  *
  * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  */
	cleartracks: function cleartracks(player) {
		if (player) {
			if (player.captions) {
				player.captions.remove();
			}
			if (player.chapters) {
				player.chapters.remove();
			}
			if (player.captionsText) {
				player.captionsText.remove();
			}
			if (player.captionsButton) {
				player.captionsButton.remove();
			}
		}
	},

	rebuildtracks: function rebuildtracks() {
		var t = this;
		t.findTracks();
		t.buildtracks(t, t.controls, t.layers, t.media);
	},

	findTracks: function findTracks() {
		var t = this,
		    tracktags = t.$media.find('track');

		// store for use by plugins
		t.tracks = [];
		tracktags.each(function (index, track) {

			track = $(track);

			var srclang = track.attr('srclang') ? track.attr('srclang').toLowerCase() : '';
			var trackId = t.id + '_track_' + index + '_' + track.attr('kind') + '_' + srclang;
			t.tracks.push({
				trackId: trackId,
				srclang: srclang,
				src: track.attr('src'),
				kind: track.attr('kind'),
				label: track.attr('label') || '',
				entries: [],
				isLoaded: false
			});
		});
	},

	/**
  *
  * @param {String} trackId, or "none" to disable captions
  */
	setTrack: function setTrack(trackId) {
		var t = this,
		    i = void 0;

		t.captionsButton.find('input[type="radio"]').prop('checked', false).end().find('.' + t.options.classPrefix + 'captions-selected').removeClass(t.options.classPrefix + 'captions-selected').end().find('input[value="' + trackId + '"]').prop('checked', true).siblings('.' + t.options.classPrefix + 'captions-selector-label').addClass(t.options.classPrefix + 'captions-selected');

		if (trackId === 'none') {
			t.selectedTrack = null;
			t.captionsButton.removeClass(t.options.classPrefix + 'captions-enabled');
			return;
		}

		for (i = 0; i < t.tracks.length; i++) {
			var track = t.tracks[i];
			if (track.trackId === trackId) {
				if (t.selectedTrack === null) {
					t.captionsButton.addClass(t.options.classPrefix + 'captions-enabled');
				}
				t.selectedTrack = track;
				t.captions.attr('lang', t.selectedTrack.srclang);
				t.displayCaptions();
				break;
			}
		}
	},

	/**
  *
  */
	loadNextTrack: function loadNextTrack() {
		var t = this;

		t.trackToLoad++;
		if (t.trackToLoad < t.tracks.length) {
			t.isLoadingTrack = true;
			t.loadTrack(t.trackToLoad);
		} else {
			// add done?
			t.isLoadingTrack = false;

			t.checkForTracks();
		}
	},

	/**
  *
  * @param index
  */
	loadTrack: function loadTrack(index) {
		var t = this,
		    track = t.tracks[index],
		    after = function after() {

			track.isLoaded = true;

			t.enableTrackButton(track);

			t.loadNextTrack();
		};

		if (track !== undefined && (track.src !== undefined || track.src !== "")) {
			$.ajax({
				url: track.src,
				dataType: 'text',
				success: function success(d) {

					// parse the loaded file
					if (typeof d === 'string' && /<tt\s+xml/ig.exec(d)) {
						track.entries = _mejs2.default.TrackFormatParser.dfxp.parse(d);
					} else {
						track.entries = _mejs2.default.TrackFormatParser.webvtt.parse(d);
					}

					after();

					if (track.kind === 'chapters') {
						t.media.addEventListener('play', function () {
							if (t.media.duration > 0) {
								t.displayChapters();
							}
						}, false);
					}

					if (track.kind === 'slides') {
						t.setupSlides(track);
					}
				},
				error: function error() {
					t.removeTrackButton(track.trackId);
					t.loadNextTrack();
				}
			});
		}
	},

	/**
  *
  * @param {String} track - The language code
  */
	enableTrackButton: function enableTrackButton(track) {
		var t = this,
		    lang = track.srclang,
		    label = track.label,
		    target = $('#' + track.trackId);

		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}

		target.prop('disabled', false).siblings('.' + t.options.classPrefix + 'captions-selector-label').html(label);

		// auto select
		if (t.options.startLanguage === lang) {
			target.prop('checked', true).trigger('click');
		}

		t.adjustLanguageBox();
	},

	/**
  *
  * @param {String} trackId
  */
	removeTrackButton: function removeTrackButton(trackId) {
		var t = this;

		t.captionsButton.find('input[id=' + trackId + ']').closest('li').remove();

		t.adjustLanguageBox();
	},

	/**
  *
  * @param {String} trackId
  * @param {String} lang - The language code
  * @param {String} label
  */
	addTrackButton: function addTrackButton(trackId, lang, label) {
		var t = this;
		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}

		// trackId is used in the value, too, because the "none"
		// caption option doesn't have a trackId but we need to be able
		// to set it, too
		t.captionsButton.find('ul').append($('<li class="' + t.options.classPrefix + 'captions-selector-list-item">' + ('<input type="radio" class="' + t.options.classPrefix + 'captions-selector-input"') + ('name="' + t.id + '_captions" id="' + trackId + '" value="' + trackId + '" disabled="disabled" />') + ('<label class="' + t.options.classPrefix + 'captions-selector-label">' + label + ' (loading)</label>') + '</li>'));

		t.adjustLanguageBox();

		// remove this from the dropdownlist (if it exists)
		t.container.find('.' + t.options.classPrefix + 'captions-translations option[value=' + lang + ']').remove();
	},

	/**
  *
  */
	adjustLanguageBox: function adjustLanguageBox() {
		var t = this;
		// adjust the size of the outer box
		t.captionsButton.find('.' + t.options.classPrefix + 'captions-selector').height(t.captionsButton.find('.' + t.options.classPrefix + 'captions-selector-list').outerHeight(true) + t.captionsButton.find('.' + t.options.classPrefix + 'captions-translations').outerHeight(true));
	},

	/**
  *
  */
	checkForTracks: function checkForTracks() {
		var t = this,
		    hasSubtitles = false;

		// check if any subtitles
		if (t.options.hideCaptionsButtonWhenEmpty) {
			for (var i = 0, total = t.tracks.length; i < total; i++) {
				var kind = t.tracks[i].kind;
				if ((kind === 'subtitles' || kind === 'captions') && t.tracks[i].isLoaded) {
					hasSubtitles = true;
					break;
				}
			}

			if (!hasSubtitles) {
				t.captionsButton.hide();
				t.setControlsSize();
			}
		}
	},

	/**
  *
  */
	displayCaptions: function displayCaptions() {

		if (this.tracks === undefined) {
			return;
		}

		var t = this,
		    track = t.selectedTrack,
		    i = void 0;

		if (track !== null && track.isLoaded) {
			i = t.searchTrackPosition(track.entries, t.media.currentTime);
			if (i > -1) {
				// Set the line before the timecode as a class so the cue can be targeted if needed
				t.captionsText.html(track.entries[i].text).attr('class', t.options.classPrefix + 'captions-text ' + (track.entries[i].identifier || ''));
				t.captions.show().height(0);
				return; // exit out if one is visible;
			}

			t.captions.hide();
		} else {
			t.captions.hide();
		}
	},

	/**
  *
  * @param {HTMLElement} track
  */
	setupSlides: function setupSlides(track) {
		var t = this;

		t.slides = track;
		t.slides.entries.imgs = [t.slides.entries.length];
		t.showSlide(0);
	},

	/**
  *
  * @param {Number} index
  */
	showSlide: function showSlide(index) {
		if (this.tracks === undefined || this.slidesContainer === undefined) {
			return;
		}

		var t = this,
		    url = t.slides.entries[index].text,
		    img = t.slides.entries[index].imgs;

		if (img === undefined || img.fadeIn === undefined) {

			t.slides.entries[index].imgs = img = $('<img src="' + url + '">').on('load', function () {
				img.appendTo(t.slidesContainer).hide().fadeIn().siblings(':visible').fadeOut();
			});
		} else {

			if (!img.is(':visible') && !img.is(':animated')) {
				img.fadeIn().siblings(':visible').fadeOut();
			}
		}
	},

	/**
  *
  */
	displaySlides: function displaySlides() {

		if (this.slides === undefined) {
			return;
		}

		var t = this,
		    slides = t.slides,
		    i = t.searchTrackPosition(slides.entries, t.media.currentTime);

		if (i > -1) {
			t.showSlide(i);
			return; // exit out if one is visible;
		}
	},

	/**
  *
  */
	displayChapters: function displayChapters() {
		var t = this;

		for (var i = 0, total = t.tracks.length; i < total; i++) {
			if (t.tracks[i].kind === 'chapters' && t.tracks[i].isLoaded) {
				t.drawChapters(t.tracks[i]);
				t.hasChapters = true;
				break;
			}
		}
	},

	/**
  *
  * @param {Object} chapters
  */
	drawChapters: function drawChapters(chapters) {
		var t = this,
		    i = void 0,
		    dur = void 0,
		    percent = 0,
		    usedPercent = 0,
		    total = chapters.entries.length;

		t.chapters.empty();

		for (i = 0; i < total; i++) {
			dur = chapters.entries[i].stop - chapters.entries[i].start;
			percent = Math.floor(dur / t.media.duration * 100);

			// too large or not going to fill it in
			if (percent + usedPercent > 100 || i === chapters.entries.length - 1 && percent + usedPercent < 100) {
				percent = 100 - usedPercent;
			}

			t.chapters.append($('<div class="' + t.options.classPrefix + 'chapter" rel="' + chapters.entries[i].start + '" style="left: ' + usedPercent.toString() + '%; width: ' + percent.toString() + '%;">' + ('<div class="' + t.options.classPrefix + 'chapter-block') + ((i === chapters.entries.length - 1 ? ' ' + t.options.classPrefix + 'chapter-block-last' : '') + '">') + ('<span class="ch-title">' + chapters.entries[i].text + '</span>') + '<span class="ch-time">' + ('' + (0, _time.secondsToTimeCode)(chapters.entries[i].start, t.options.alwaysShowHours)) + '&ndash;' + ('' + (0, _time.secondsToTimeCode)(chapters.entries[i].stop, t.options.alwaysShowHours)) + '</span>' + '</div>' + '</div>'));
			usedPercent += percent;
		}

		t.chapters.find('.' + t.options.classPrefix + 'chapter').click(function () {
			t.media.setCurrentTime(parseFloat($(this).attr('rel')));
			if (t.media.paused) {
				t.media.play();
			}
		});

		t.chapters.show();
	},
	/**
  * Perform binary search to look for proper track index
  *
  * @param {Object[]} tracks
  * @param {Number} currentTime
  * @return {Number}
  */
	searchTrackPosition: function searchTrackPosition(tracks, currentTime) {
		var lo = 0,
		    hi = tracks.length - 1,
		    mid = void 0,
		    start = void 0,
		    stop = void 0;

		while (lo <= hi) {
			mid = lo + hi >> 1;
			start = tracks[mid].start;
			stop = tracks[mid].stop;

			if (currentTime >= start && currentTime < stop) {
				return mid;
			} else if (start < currentTime) {
				lo = mid + 1;
			} else if (start > currentTime) {
				hi = mid - 1;
			}
		}

		return -1;
	}
});

/**
 * Map all possible languages with their respective code
 *
 * @constructor
 */
_mejs2.default.language = {
	codes: {
		af: 'mejs.afrikaans',
		sq: 'mejs.albanian',
		ar: 'mejs.arabic',
		be: 'mejs.belarusian',
		bg: 'mejs.bulgarian',
		ca: 'mejs.catalan',
		zh: 'mejs.chinese',
		'zh-cn': 'mejs.chinese-simplified',
		'zh-tw': 'mejs.chines-traditional',
		hr: 'mejs.croatian',
		cs: 'mejs.czech',
		da: 'mejs.danish',
		nl: 'mejs.dutch',
		en: 'mejs.english',
		et: 'mejs.estonian',
		fl: 'mejs.filipino',
		fi: 'mejs.finnish',
		fr: 'mejs.french',
		gl: 'mejs.galician',
		de: 'mejs.german',
		el: 'mejs.greek',
		ht: 'mejs.haitian-creole',
		iw: 'mejs.hebrew',
		hi: 'mejs.hindi',
		hu: 'mejs.hungarian',
		is: 'mejs.icelandic',
		id: 'mejs.indonesian',
		ga: 'mejs.irish',
		it: 'mejs.italian',
		ja: 'mejs.japanese',
		ko: 'mejs.korean',
		lv: 'mejs.latvian',
		lt: 'mejs.lithuanian',
		mk: 'mejs.macedonian',
		ms: 'mejs.malay',
		mt: 'mejs.maltese',
		no: 'mejs.norwegian',
		fa: 'mejs.persian',
		pl: 'mejs.polish',
		pt: 'mejs.portuguese',
		ro: 'mejs.romanian',
		ru: 'mejs.russian',
		sr: 'mejs.serbian',
		sk: 'mejs.slovak',
		sl: 'mejs.slovenian',
		es: 'mejs.spanish',
		sw: 'mejs.swahili',
		sv: 'mejs.swedish',
		tl: 'mejs.tagalog',
		th: 'mejs.thai',
		tr: 'mejs.turkish',
		uk: 'mejs.ukrainian',
		vi: 'mejs.vietnamese',
		cy: 'mejs.welsh',
		yi: 'mejs.yiddish'
	}
};

/*
 Parses WebVTT format which should be formatted as
 ================================
 WEBVTT

 1
 00:00:01,1 --> 00:00:05,000
 A line of text

 2
 00:01:15,1 --> 00:02:05,000
 A second line of text

 ===============================

 Adapted from: http://www.delphiki.com/html5/playr
 */
_mejs2.default.TrackFormatParser = {
	webvtt: {
		/**
   * @type {String}
   */
		pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

		/**
   *
   * @param {String} trackText
   * @returns {{text: Array, times: Array}}
   */
		parse: function parse(trackText) {
			var i = 0,
			    lines = _mejs2.default.TrackFormatParser.split2(trackText, /\r?\n/),
			    entries = [],
			    timecode = void 0,
			    text = void 0,
			    identifier = void 0;
			for (; i < lines.length; i++) {
				timecode = this.pattern_timecode.exec(lines[i]);

				if (timecode && i < lines.length) {
					if (i - 1 >= 0 && lines[i - 1] !== '') {
						identifier = lines[i - 1];
					}
					i++;
					// grab all the (possibly multi-line) text that follows
					text = lines[i];
					i++;
					while (lines[i] !== '' && i < lines.length) {
						text = text + '\n' + lines[i];
						i++;
					}
					text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.push({
						identifier: identifier,
						start: (0, _time.convertSMPTEtoSeconds)(timecode[1]) === 0 ? 0.200 : (0, _time.convertSMPTEtoSeconds)(timecode[1]),
						stop: (0, _time.convertSMPTEtoSeconds)(timecode[3]),
						text: text,
						settings: timecode[5]
					});
				}
				identifier = '';
			}
			return entries;
		}
	},
	// Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
	dfxp: {
		/**
   *
   * @param {String} trackText
   * @returns {{text: Array, times: Array}}
   */
		parse: function parse(trackText) {
			trackText = $(trackText).filter('tt');
			var container = trackText.children('div').eq(0),
			    lines = container.find('p'),
			    styleNode = trackText.find('#' + container.attr('style')),
			    styles = void 0,
			    entries = [],
			    i = void 0;

			if (styleNode.length) {
				var attributes = styleNode.removeAttr('id').get(0).attributes;
				if (attributes.length) {
					styles = {};
					for (i = 0; i < attributes.length; i++) {
						styles[attributes[i].name.split(":")[1]] = attributes[i].value;
					}
				}
			}

			for (i = 0; i < lines.length; i++) {
				var style = void 0,
				    _temp = {
					start: null,
					stop: null,
					style: null,
					text: null
				};

				if (lines.eq(i).attr('begin')) {
					_temp.start = (0, _time.convertSMPTEtoSeconds)(lines.eq(i).attr('begin'));
				}
				if (!_temp.start && lines.eq(i - 1).attr('end')) {
					_temp.start = (0, _time.convertSMPTEtoSeconds)(lines.eq(i - 1).attr('end'));
				}
				if (lines.eq(i).attr('end')) {
					_temp.stop = (0, _time.convertSMPTEtoSeconds)(lines.eq(i).attr('end'));
				}
				if (!_temp.stop && lines.eq(i + 1).attr('begin')) {
					_temp.stop = (0, _time.convertSMPTEtoSeconds)(lines.eq(i + 1).attr('begin'));
				}

				if (styles) {
					style = '';
					for (var _style in styles) {
						style += _style + ':' + styles[_style] + ';';
					}
				}
				if (style) {
					_temp.style = style;
				}
				if (_temp.start === 0) {
					_temp.start = 0.200;
				}
				_temp.text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
				entries.push(_temp);
			}
			return entries;
		}
	},
	/**
  *
  * @param {String} text
  * @param {String} regex
  * @returns {Array}
  */
	split2: function split2(text, regex) {
		// normal version for compliant browsers
		// see below for IE fix
		return text.split(regex);
	}
};

// test for browsers with bad String.split method.
if ('x\n\ny'.split(/\n/gi).length !== 3) {
	// add super slow IE8 and below version
	_mejs2.default.TrackFormatParser.split2 = function (text, regex) {
		var parts = [],
		    chunk = '',
		    i = void 0;

		for (i = 0; i < text.length; i++) {
			chunk += text.substring(i, i + 1);
			if (regex.test(chunk)) {
				parts.push(chunk.replace(regex, ''));
				chunk = '';
			}
		}
		parts.push(chunk);
		return parts;
	};
}

},{"16":16,"32":32,"4":4,"6":6}],13:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Volume button
 *
 * This feature enables the displaying of a Volume button in the control bar, and also contains logic to manipulate its
 * events, such as sliding up/down (or left/right, if vertical), muting/unmuting media, etc.
 */

// Feature configuration
Object.assign(_player.config, {
	/**
  * @type {String}
  */
	muteText: '',
	/**
  * @type {String}
  */
	allyVolumeControlText: '',
	/**
  * @type {Boolean}
  */
	hideVolumeOnTouchDevices: true,
	/**
  * @type {String}
  */
	audioVolume: 'horizontal',
	/**
  * @type {String}
  */
	videoVolume: 'vertical'
});

Object.assign(_player2.default.prototype, {

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {$} controls
  * @param {$} layers
  * @param {HTMLElement} media
  * @public
  */
	buildvolume: function buildvolume(player, controls, layers, media) {

		// Android and iOS don't support volume controls
		if ((_constants.IS_ANDROID || _constants.IS_IOS) && this.options.hideVolumeOnTouchDevices) {
			return;
		}

		var t = this,
		    mode = t.isVideo ? t.options.videoVolume : t.options.audioVolume,
		    muteText = t.options.muteText ? t.options.muteText : _i18n2.default.t('mejs.mute-toggle'),
		    volumeControlText = t.options.allyVolumeControlText ? t.options.allyVolumeControlText : _i18n2.default.t('mejs.volume-help-text'),
		    mute = mode === 'horizontal' ?

		// horizontal version
		$('<div class="' + t.options.classPrefix + 'button ' + t.options.classPrefix + 'volume-button ' + t.options.classPrefix + 'mute">' + ('<button type="button" aria-controls="' + t.id + '" title="' + muteText + '" aria-label="' + muteText + '"></button>') + '</div>' + ('<a href="javascript:void(0);" class="' + t.options.classPrefix + 'horizontal-volume-slider">') + ('<span class="' + t.options.classPrefix + 'offscreen">' + volumeControlText + '</span>') + ('<div class="' + t.options.classPrefix + 'horizontal-volume-total">') + ('<div class="' + t.options.classPrefix + 'horizontal-volume-current"></div>') + ('<div class="' + t.options.classPrefix + 'horizontal-volume-handle"></div>') + '</div>' + '</a>').appendTo(controls) :

		// vertical version
		$('<div class="' + t.options.classPrefix + 'button ' + t.options.classPrefix + 'volume-button ' + t.options.classPrefix + 'mute">' + ('<button type="button" aria-controls="' + t.id + '" title="' + muteText + '" aria-label="' + muteText + '"></button>') + ('<a href="javascript:void(0);" class="' + t.options.classPrefix + 'volume-slider">') + ('<span class="' + t.options.classPrefix + 'offscreen">' + volumeControlText + '</span>') + ('<div class="' + t.options.classPrefix + 'volume-total">') + ('<div class="' + t.options.classPrefix + 'volume-current"></div>') + ('<div class="' + t.options.classPrefix + 'volume-handle"></div>') + '</div>' + '</a>' + '</div>').appendTo(controls),
		    volumeSlider = t.container.find('.' + t.options.classPrefix + 'volume-slider, \n\t\t\t\t.' + t.options.classPrefix + 'horizontal-volume-slider'),
		    volumeTotal = t.container.find('.' + t.options.classPrefix + 'volume-total, \n\t\t\t\t.' + t.options.classPrefix + 'horizontal-volume-total'),
		    volumeCurrent = t.container.find('.' + t.options.classPrefix + 'volume-current, \n\t\t\t\t.' + t.options.classPrefix + 'horizontal-volume-current'),
		    volumeHandle = t.container.find('.' + t.options.classPrefix + 'volume-handle, \n\t\t\t\t.' + t.options.classPrefix + 'horizontal-volume-handle'),


		/**
   * @private
   * @param {Number} volume
   */
		positionVolumeHandle = function positionVolumeHandle(volume) {

			// correct to 0-1
			volume = Math.max(0, volume);
			volume = Math.min(volume, 1);

			// adjust mute button style
			if (volume === 0) {
				mute.removeClass(t.options.classPrefix + 'mute').addClass(t.options.classPrefix + 'unmute');
				mute.children('button').attr({
					title: _i18n2.default.t('mejs.unmute'),
					'aria-label': _i18n2.default.t('mejs.unmute')
				});
			} else {
				mute.removeClass(t.options.classPrefix + 'unmute').addClass(t.options.classPrefix + 'mute');
				mute.children('button').attr({
					title: _i18n2.default.t('mejs.mute'),
					'aria-label': _i18n2.default.t('mejs.mute')
				});
			}

			var volumePercentage = volume * 100 + '%';

			// position slider
			if (mode === 'vertical') {
				volumeCurrent.css({
					bottom: '0',
					height: volumePercentage
				});
				volumeHandle.css({
					bottom: volumePercentage,
					marginBottom: -volumeHandle.height() / 2 + 'px'
				});
			} else {
				volumeCurrent.css({
					left: '0',
					width: volumePercentage
				});
				volumeHandle.css({
					left: volumePercentage,
					marginLeft: -volumeHandle.width() / 2 + 'px'
				});
			}
		},

		/**
   * @private
   */
		handleVolumeMove = function handleVolumeMove(e) {

			var volume = null,
			    totalOffset = volumeTotal.offset();

			// calculate the new volume based on the most recent position
			if (mode === 'vertical') {

				var railHeight = volumeTotal.height(),
				    newY = e.pageY - totalOffset.top;

				volume = (railHeight - newY) / railHeight;

				// the controls just hide themselves (usually when mouse moves too far up)
				if (totalOffset.top === 0 || totalOffset.left === 0) {
					return;
				}
			} else {
				var railWidth = volumeTotal.width(),
				    newX = e.pageX - totalOffset.left;

				volume = newX / railWidth;
			}

			// ensure the volume isn't outside 0-1
			volume = Math.max(0, volume);
			volume = Math.min(volume, 1);

			// position the slider and handle
			positionVolumeHandle(volume);

			// set the media object (this will trigger the `volumechanged` event)
			if (volume === 0) {
				media.setMuted(true);
			} else {
				media.setMuted(false);
			}
			media.setVolume(volume);
		},
		    mouseIsDown = false,
		    mouseIsOver = false;

		// SLIDER
		mute.on('mouseenter focusin', function () {
			volumeSlider.show();
			mouseIsOver = true;
		}).on('mouseleave focusout', function () {
			mouseIsOver = false;

			if (!mouseIsDown && mode === 'vertical') {
				volumeSlider.hide();
			}
		});

		/**
   * @private
   */
		var updateVolumeSlider = function updateVolumeSlider() {

			var volume = Math.floor(media.volume * 100);

			volumeSlider.attr({
				'aria-label': _i18n2.default.t('mejs.volume-slider'),
				'aria-valuemin': 0,
				'aria-valuemax': 100,
				'aria-valuenow': volume,
				'aria-valuetext': volume + '%',
				'role': 'slider',
				'tabindex': -1
			});
		};

		// Events
		volumeSlider.on('mouseover', function () {
			mouseIsOver = true;
		}).on('mousedown', function (e) {
			handleVolumeMove(e);
			t.globalBind('mousemove.vol', function (e) {
				handleVolumeMove(e);
			});
			t.globalBind('mouseup.vol', function () {
				mouseIsDown = false;
				t.globalUnbind('mousemove.vol mouseup.vol');

				if (!mouseIsOver && mode === 'vertical') {
					volumeSlider.hide();
				}
			});
			mouseIsDown = true;

			return false;
		}).on('keydown', function (e) {

			if (t.options.keyActions.length) {
				var keyCode = e.which || e.keyCode || 0,
				    volume = media.volume;
				switch (keyCode) {
					case 38:
						// Up
						volume = Math.min(volume + 0.1, 1);
						break;
					case 40:
						// Down
						volume = Math.max(0, volume - 0.1);
						break;
					default:
						return true;
				}

				mouseIsDown = false;
				positionVolumeHandle(volume);
				media.setVolume(volume);
				return false;
			}
		});

		// MUTE button
		mute.find('button').click(function () {
			media.setMuted(!media.muted);
		});

		//Keyboard input
		mute.find('button').on('focus', function () {
			if (mode === 'vertical') {
				volumeSlider.show();
			}
		}).on('blur', function () {
			if (mode === 'vertical') {
				volumeSlider.hide();
			}
		});

		// listen for volume change events from other sources
		media.addEventListener('volumechange', function (e) {
			if (!mouseIsDown) {
				if (media.muted) {
					positionVolumeHandle(0);
					mute.removeClass(t.options.classPrefix + 'mute').addClass(t.options.classPrefix + 'unmute');
				} else {
					positionVolumeHandle(media.volume);
					mute.removeClass(t.options.classPrefix + 'unmute').addClass(t.options.classPrefix + 'mute');
				}
			}
			updateVolumeSlider(e);
		}, false);

		// mutes the media and sets the volume icon muted if the initial volume is set to 0
		if (player.options.startVolume === 0) {
			media.setMuted(true);
		}

		// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
		var isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/) !== null;

		if (isNative) {
			media.setVolume(player.options.startVolume);
		}

		t.container.on('controlsresize', function () {
			if (media.muted) {
				positionVolumeHandle(0);
				mute.removeClass(t.options.classPrefix + 'mute').addClass(t.options.classPrefix + 'unmute');
			} else {
				positionVolumeHandle(media.volume);
				mute.removeClass(t.options.classPrefix + 'unmute').addClass(t.options.classPrefix + 'mute');
			}
		});
	}
});

},{"16":16,"27":27,"4":4}],14:[function(_dereq_,module,exports){
'use strict';

/*!
 * This is a `i18n` language object.
 *
 * English; This can serve as a template for other languages to translate
 *
 * @author
 *   TBD
 *   Sascha Greuel (Twitter: @SoftCreatR)
 *
 * @see core/i18n.js
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});
var EN = exports.EN = {
	"mejs.plural-form": 1,

	// renderers/flash.js
	"mejs.install-flash": "You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/",

	// features/contextmenu.js
	"mejs.fullscreen-off": "Turn off Fullscreen",
	"mejs.fullscreen-on": "Go Fullscreen",
	"mejs.download-video": "Download Video",

	// features/fullscreen.js
	"mejs.fullscreen": "Fullscreen",

	// features/jumpforward.js
	"mejs.time-jump-forward": ["Jump forward 1 second", "Jump forward %1 seconds"],

	// features/loop.js
	"mejs.loop": "Toggle Loop",

	// features/playpause.js
	"mejs.play": "Play",
	"mejs.pause": "Pause",

	// features/postroll.js
	"mejs.close": "Close",

	// features/progress.js
	"mejs.time-slider": "Time Slider",
	"mejs.time-help-text": "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.",

	// features/skipback.js
	"mejs.time-skip-back": ["Skip back 1 second", "Skip back %1 seconds"],

	// features/tracks.js
	"mejs.captions-subtitles": "Captions/Subtitles",
	"mejs.none": "None",

	// features/volume.js
	"mejs.mute-toggle": "Mute Toggle",
	"mejs.volume-help-text": "Use Up/Down Arrow keys to increase or decrease volume.",
	"mejs.unmute": "Unmute",
	"mejs.mute": "Mute",
	"mejs.volume-slider": "Volume Slider",

	// core/player.js
	"mejs.video-player": "Video Player",
	"mejs.audio-player": "Audio Player",

	// features/ads.js
	"mejs.ad-skip": "Skip ad",
	"mejs.ad-skip-info": ["Skip in 1 second", "Skip in %1 seconds"],

	// features/sourcechooser.js
	"mejs.source-chooser": "Source Chooser",

	// features/stop.js
	"mejs.stop": "Stop",

	//features/speed.js
	"mejs.speed-rate": "Speed Rate",

	//features/progress.js
	"mejs.live-broadcast": "Live Broadcast",

	// features/tracks.js
	"mejs.afrikaans": "Afrikaans",
	"mejs.albanian": "Albanian",
	"mejs.arabic": "Arabic",
	"mejs.belarusian": "Belarusian",
	"mejs.bulgarian": "Bulgarian",
	"mejs.catalan": "Catalan",
	"mejs.chinese": "Chinese",
	"mejs.chinese-simplified": "Chinese (Simplified)",
	"mejs.chinese-traditional": "Chinese (Traditional)",
	"mejs.croatian": "Croatian",
	"mejs.czech": "Czech",
	"mejs.danish": "Danish",
	"mejs.dutch": "Dutch",
	"mejs.english": "English",
	"mejs.estonian": "Estonian",
	"mejs.filipino": "Filipino",
	"mejs.finnish": "Finnish",
	"mejs.french": "French",
	"mejs.galician": "Galician",
	"mejs.german": "German",
	"mejs.greek": "Greek",
	"mejs.haitian-creole": "Haitian Creole",
	"mejs.hebrew": "Hebrew",
	"mejs.hindi": "Hindi",
	"mejs.hungarian": "Hungarian",
	"mejs.icelandic": "Icelandic",
	"mejs.indonesian": "Indonesian",
	"mejs.irish": "Irish",
	"mejs.italian": "Italian",
	"mejs.japanese": "Japanese",
	"mejs.korean": "Korean",
	"mejs.latvian": "Latvian",
	"mejs.lithuanian": "Lithuanian",
	"mejs.macedonian": "Macedonian",
	"mejs.malay": "Malay",
	"mejs.maltese": "Maltese",
	"mejs.norwegian": "Norwegian",
	"mejs.persian": "Persian",
	"mejs.polish": "Polish",
	"mejs.portuguese": "Portuguese",
	"mejs.romanian": "Romanian",
	"mejs.russian": "Russian",
	"mejs.serbian": "Serbian",
	"mejs.slovak": "Slovak",
	"mejs.slovenian": "Slovenian",
	"mejs.spanish": "Spanish",
	"mejs.swahili": "Swahili",
	"mejs.swedish": "Swedish",
	"mejs.tagalog": "Tagalog",
	"mejs.thai": "Thai",
	"mejs.turkish": "Turkish",
	"mejs.ukrainian": "Ukrainian",
	"mejs.vietnamese": "Vietnamese",
	"mejs.welsh": "Welsh",
	"mejs.yiddish": "Yiddish"
};

},{}],15:[function(_dereq_,module,exports){
'use strict';

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof jQuery !== 'undefined') {
	_mejs2.default.$ = jQuery;
} else if (typeof Zepto !== 'undefined') {
	_mejs2.default.$ = Zepto;

	// define `outerWidth` method which has not been realized in Zepto
	Zepto.fn.outerWidth = function (includeMargin) {
		var width = $(this).width();
		if (includeMargin) {
			width += parseInt($(this).css('margin-right'), 10);
			width += parseInt($(this).css('margin-left'), 10);
		}
		return width;
	};
} else if (typeof ender !== 'undefined') {
	_mejs2.default.$ = ender;
}

},{"6":6}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.config = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _mediaelement = _dereq_(5);

var _mediaelement2 = _interopRequireDefault(_mediaelement);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(27);

var _general = _dereq_(29);

var _time = _dereq_(32);

var _dom = _dereq_(28);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_mejs2.default.mepIndex = 0;

_mejs2.default.players = {};

// default player values
var config = exports.config = {
	// url to poster (to fix iOS 3.x)
	poster: '',
	// When the video is ended, we can show the poster.
	showPosterWhenEnded: false,
	// default if the <video width> is not specified
	defaultVideoWidth: 480,
	// default if the <video height> is not specified
	defaultVideoHeight: 270,
	// if set, overrides <video width>
	videoWidth: -1,
	// if set, overrides <video height>
	videoHeight: -1,
	// default if the user doesn't specify
	defaultAudioWidth: 400,
	// default if the user doesn't specify
	defaultAudioHeight: 40,
	// default amount to move back when back key is pressed
	defaultSeekBackwardInterval: function defaultSeekBackwardInterval(media) {
		return media.duration * 0.05;
	},
	// default amount to move forward when forward key is pressed
	defaultSeekForwardInterval: function defaultSeekForwardInterval(media) {
		return media.duration * 0.05;
	},
	// set dimensions via JS instead of CSS
	setDimensions: true,
	// width of audio player
	audioWidth: -1,
	// height of audio player
	audioHeight: -1,
	// initial volume when the player starts (overridden by user cookie)
	startVolume: 0.8,
	// useful for <audio> player loops
	loop: false,
	// rewind to beginning when media ends
	autoRewind: true,
	// resize to media dimensions
	enableAutosize: true,
	/*
  * Time format to use. Default: 'mm:ss'
  * Supported units:
  *   h: hour
  *   m: minute
  *   s: second
  *   f: frame count
  * When using 'hh', 'mm', 'ss' or 'ff' we always display 2 digits.
  * If you use 'h', 'm', 's' or 'f' we display 1 digit if possible.
  *
  * Example to display 75 seconds:
  * Format 'mm:ss': 01:15
  * Format 'm:ss': 1:15
  * Format 'm:s': 1:15
  */
	timeFormat: '',
	// forces the hour marker (##:00:00)
	alwaysShowHours: false,
	// show framecount in timecode (##:00:00:00)
	showTimecodeFrameCount: false,
	// used when showTimecodeFrameCount is set to true
	framesPerSecond: 25,
	// Hide controls when playing and mouse is not over the video
	alwaysShowControls: false,
	// Display the video control
	hideVideoControlsOnLoad: false,
	// Enable click video element to toggle play/pause
	clickToPlayPause: true,
	// Time in ms to hide controls
	controlsTimeoutDefault: 1500,
	// Time in ms to trigger the timer when mouse moves
	controlsTimeoutMouseEnter: 2500,
	// Time in ms to trigger the timer when mouse leaves
	controlsTimeoutMouseLeave: 1000,
	// force iPad's native controls
	iPadUseNativeControls: false,
	// force iPhone's native controls
	iPhoneUseNativeControls: false,
	// force Android's native controls
	AndroidUseNativeControls: false,
	// features to show
	features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
	// only for dynamic
	isVideo: true,
	// stretching modes (auto, fill, responsive, none)
	stretching: 'auto',
	// prefix class names on elements
	classPrefix: 'mejs__',
	// turns keyboard support on and off for this instance
	enableKeyboard: true,
	// when this player starts, it will pause other players
	pauseOtherPlayers: true,
	// array of keyboard actions such as play/pause
	keyActions: [{
		keys: [32, // SPACE
		179 // GOOGLE play/pause button
		],
		action: function action(player, media) {

			if (!_constants.IS_FIREFOX) {
				if (media.paused || media.ended) {
					media.play();
				} else {
					media.pause();
				}
			}
		}
	}, {
		keys: [38], // UP
		action: function action(player, media) {

			if (player.container.find('.' + config.classPrefix + 'volume-button>button').is(':focus') || player.container.find('.' + config.classPrefix + 'volume-slider').is(':focus')) {
				player.container.find('.' + config.classPrefix + 'volume-slider').css('display', 'block');
			}
			if (player.isVideo) {
				player.showControls();
				player.startControlsTimer();
			}

			var newVolume = Math.min(media.volume + 0.1, 1);
			media.setVolume(newVolume);
			if (newVolume > 0) {
				media.setMuted(false);
			}
		}
	}, {
		keys: [40], // DOWN
		action: function action(player, media) {

			if (player.container.find('.' + config.classPrefix + 'volume-button>button').is(':focus') || player.container.find('.' + config.classPrefix + 'volume-slider').is(':focus')) {
				player.container.find('.' + config.classPrefix + 'volume-slider').css('display', 'block');
			}

			if (player.isVideo) {
				player.showControls();
				player.startControlsTimer();
			}

			var newVolume = Math.max(media.volume - 0.1, 0);
			media.setVolume(newVolume);

			if (newVolume <= 0.1) {
				media.setMuted(true);
			}
		}
	}, {
		keys: [37, // LEFT
		227 // Google TV rewind
		],
		action: function action(player, media) {
			if (!isNaN(media.duration) && media.duration > 0) {
				if (player.isVideo) {
					player.showControls();
					player.startControlsTimer();
				}

				// 5%
				var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
				media.setCurrentTime(newTime);
			}
		}
	}, {
		keys: [39, // RIGHT
		228 // Google TV forward
		],
		action: function action(player, media) {

			if (!isNaN(media.duration) && media.duration > 0) {
				if (player.isVideo) {
					player.showControls();
					player.startControlsTimer();
				}

				// 5%
				var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
				media.setCurrentTime(newTime);
			}
		}
	}, {
		keys: [70], // F
		action: function action(player, media, key, event) {
			if (!event.ctrlKey) {
				if (typeof player.enterFullScreen !== 'undefined') {
					if (player.isFullScreen) {
						player.exitFullScreen();
					} else {
						player.enterFullScreen();
					}
				}
			}
		}
	}, {
		keys: [77], // M
		action: function action(player) {

			player.container.find('.' + config.classPrefix + 'volume-slider').css('display', 'block');
			if (player.isVideo) {
				player.showControls();
				player.startControlsTimer();
			}
			if (player.media.muted) {
				player.setMuted(false);
			} else {
				player.setMuted(true);
			}
		}
	}]
};

_mejs2.default.MepDefaults = config;

/**
 * Wrap a MediaElement object in player controls
 *
 * @constructor
 * @param {HTMLElement} node
 * @param {Object} o
 * @return {?MediaElementPlayer}
 */

var MediaElementPlayer = function () {
	function MediaElementPlayer(node, o) {
		_classCallCheck(this, MediaElementPlayer);

		var t = this;

		t.hasFocus = false;

		t.controlsAreVisible = true;

		t.controlsEnabled = true;

		t.controlsTimer = null;

		// enforce object, even without "new" (via John Resig)
		if (!(t instanceof MediaElementPlayer)) {
			return new MediaElementPlayer(node, o);
		}

		// these will be reset after the MediaElement.success fires
		t.$media = t.$node = $(node);
		t.node = t.media = t.$media[0];

		if (!t.node) {
			return;
		}

		// check for existing player
		if (t.node.player !== undefined) {
			return t.node.player;
		}

		// try to get options from data-mejsoptions
		if (o === undefined) {
			o = t.$node.data('mejsoptions');
		}

		// extend default options
		t.options = Object.assign({}, config, o);

		if (!t.options.timeFormat) {
			// Generate the time format according to options
			t.options.timeFormat = 'mm:ss';
			if (t.options.alwaysShowHours) {
				t.options.timeFormat = 'hh:mm:ss';
			}
			if (t.options.showTimecodeFrameCount) {
				t.options.timeFormat += ':ff';
			}
		}

		(0, _time.calculateTimeFormat)(0, t.options, t.options.framesPerSecond || 25);

		// unique ID
		t.id = 'mep_' + _mejs2.default.mepIndex++;

		// add to player array (for focus events)
		_mejs2.default.players[t.id] = t;

		// start up
		var meOptions = Object.assign({}, t.options, {
			success: function success(media, domNode) {
				t._meReady(media, domNode);
			},
			error: function error(e) {
				t._handleError(e);
			}
		}),
		    tagName = t.media.tagName.toLowerCase();

		// get video from src or href?
		t.isDynamic = tagName !== 'audio' && tagName !== 'video';
		t.isVideo = t.isDynamic ? t.options.isVideo : tagName !== 'audio' && t.options.isVideo;

		// use native controls in iPad, iPhone, and Android
		if (_constants.IS_IPAD && t.options.iPadUseNativeControls || _constants.IS_IPHONE && t.options.iPhoneUseNativeControls) {

			// add controls and stop
			t.$media.attr('controls', 'controls');

			// override Apple's autoplay override for iPads
			if (_constants.IS_IPAD && t.media.getAttribute('autoplay')) {
				t.play();
			}
		} else if (_constants.IS_ANDROID && t.options.AndroidUseNativeControls) {

			// leave default player

		} else if (t.isVideo || !t.isVideo && t.options.features.length) {

			// DESKTOP: use MediaElementPlayer controls

			// remove native controls
			t.$media.removeAttr('controls');
			var videoPlayerTitle = t.isVideo ? _i18n2.default.t('mejs.video-player') : _i18n2.default.t('mejs.audio-player');
			// insert description for screen readers
			$('<span class="' + t.options.classPrefix + 'offscreen">' + videoPlayerTitle + '</span>').insertBefore(t.$media);
			// build container
			t.container = $('<div id="' + t.id + '" class="' + t.options.classPrefix + 'container ' + t.options.classPrefix + 'container-keyboard-inactive"' + ('tabindex="0" role="application" aria-label="' + videoPlayerTitle + '">') + ('<div class="' + t.options.classPrefix + 'inner">') + ('<div class="' + t.options.classPrefix + 'mediaelement"></div>') + ('<div class="' + t.options.classPrefix + 'layers"></div>') + ('<div class="' + t.options.classPrefix + 'controls"></div>') + ('<div class="' + t.options.classPrefix + 'clear"></div>') + '</div>' + '</div>').addClass(t.$media[0].className).insertBefore(t.$media).focus(function (e) {
				if (!t.controlsAreVisible && !t.hasFocus && t.controlsEnabled) {
					t.showControls(true);
					// In versions older than IE11, the focus causes the playbar to be displayed
					// if user clicks on the Play/Pause button in the control bar once it attempts
					// to hide it
					if (!_constants.HAS_MS_NATIVE_FULLSCREEN) {
						// If e.relatedTarget appears before container, send focus to play button,
						// else send focus to last control button.
						var btnSelector = '.' + t.options.classPrefix + 'playpause-button > button';

						if ((0, _dom.isNodeAfter)(e.relatedTarget, t.container[0])) {
							btnSelector = '.' + t.options.classPrefix + 'controls .' + t.options.classPrefix + 'button:last-child > button';
						}

						var button = t.container.find(btnSelector);
						button.focus();
					}
				}
			});

			// When no elements in controls, hide bar completely
			if (!t.options.features.length) {
				t.container.css('background', 'transparent').find('.' + t.options.classPrefix + 'controls').hide();
			}

			if (t.isVideo && t.options.stretching === 'fill' && !t.container.parent('.' + t.options.classPrefix + 'fill-container').length) {
				// outer container
				t.outerContainer = t.$media.parent();
				t.container.wrap('<div class="' + t.options.classPrefix + 'fill-container"/>');
			}

			// add classes for user and content
			t.container.addClass((_constants.IS_ANDROID ? t.options.classPrefix + 'android ' : '') + (_constants.IS_IOS ? t.options.classPrefix + 'ios ' : '') + (_constants.IS_IPAD ? t.options.classPrefix + 'ipad ' : '') + (_constants.IS_IPHONE ? t.options.classPrefix + 'iphone ' : '') + (t.isVideo ? t.options.classPrefix + 'video ' : t.options.classPrefix + 'audio '));

			// move the <video/video> tag into the right spot
			t.container.find('.' + t.options.classPrefix + 'mediaelement').append(t.$media);

			// needs to be assigned here, after iOS remap
			t.node.player = t;

			// find parts
			t.controls = t.container.find('.' + t.options.classPrefix + 'controls');
			t.layers = t.container.find('.' + t.options.classPrefix + 'layers');

			// determine the size

			/* size priority:
    (1) videoWidth (forced),
    (2) style="width;height;"
    (3) width attribute,
    (4) defaultVideoWidth (for unspecified cases)
    */

			var tagType = t.isVideo ? 'video' : 'audio',
			    capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);

			if (t.options[tagType + 'Width'] > 0 || t.options[tagType + 'Width'].toString().indexOf('%') > -1) {
				t.width = t.options[tagType + 'Width'];
			} else if (t.media.style.width !== '' && t.media.style.width !== null) {
				t.width = t.media.style.width;
			} else if (t.media.getAttribute('width')) {
				t.width = t.$media.attr('width');
			} else {
				t.width = t.options['default' + capsTagName + 'Width'];
			}

			if (t.options[tagType + 'Height'] > 0 || t.options[tagType + 'Height'].toString().indexOf('%') > -1) {
				t.height = t.options[tagType + 'Height'];
			} else if (t.media.style.height !== '' && t.media.style.height !== null) {
				t.height = t.media.style.height;
			} else if (t.$media[0].getAttribute('height')) {
				t.height = t.$media.attr('height');
			} else {
				t.height = t.options['default' + capsTagName + 'Height'];
			}

			t.initialAspectRatio = t.height >= t.width ? t.width / t.height : t.height / t.width;

			// set the size, while we wait for the plugins to load below
			t.setPlayerSize(t.width, t.height);

			// create MediaElementShim
			meOptions.pluginWidth = t.width;
			meOptions.pluginHeight = t.height;
		}
		// Hide media completely for audio that doesn't have any features
		else if (!t.isVideo && !t.options.features.length) {
				t.$media.hide();
			}

		// create MediaElement shim
		new _mediaelement2.default(t.$media[0], meOptions);

		if (t.container !== undefined && t.options.features.length && t.controlsAreVisible && !t.options.hideVideoControlsOnLoad) {
			// controls are shown when loaded
			t.container.trigger('controlsshown');
		}

		return t;
	}

	_createClass(MediaElementPlayer, [{
		key: 'showControls',
		value: function showControls(doAnimation) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (t.controlsAreVisible) {
				return;
			}

			if (doAnimation) {
				t.controls.removeClass(t.options.classPrefix + 'offscreen').stop(true, true).fadeIn(200, function () {
					t.controlsAreVisible = true;
					t.container.trigger('controlsshown');
				});

				// any additional controls people might add and want to hide
				t.container.find('.' + t.options.classPrefix + 'control').removeClass(t.options.classPrefix + 'offscreen').stop(true, true).fadeIn(200, function () {
					t.controlsAreVisible = true;
				});
			} else {
				t.controls.removeClass(t.options.classPrefix + 'offscreen').css('display', 'block');

				// any additional controls people might add and want to hide
				t.container.find('.' + t.options.classPrefix + 'control').removeClass(t.options.classPrefix + 'offscreen').css('display', 'block');

				t.controlsAreVisible = true;
				t.container.trigger('controlsshown');
			}

			t.setControlsSize();
		}
	}, {
		key: 'hideControls',
		value: function hideControls(doAnimation) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (!t.controlsAreVisible || t.options.alwaysShowControls || t.keyboardAction || t.media.paused && t.media.readyState === 4 || t.isVideo && !t.options.hideVideoControlsOnLoad && !t.media.readyState || t.media.ended) {
				return;
			}

			if (doAnimation) {
				// fade out main controls
				t.controls.stop(true, true).fadeOut(200, function () {
					$(this).addClass(t.options.classPrefix + 'offscreen').css('display', 'block');

					t.controlsAreVisible = false;
					t.container.trigger('controlshidden');
				});

				// any additional controls people might add and want to hide
				t.container.find('.' + t.options.classPrefix + 'control').stop(true, true).fadeOut(200, function () {
					$(this).addClass(t.options.classPrefix + 'offscreen').css('display', 'block');
				});
			} else {

				// hide main controls
				t.controls.addClass(t.options.classPrefix + 'offscreen').css('display', 'block');

				// hide others
				t.container.find('.' + t.options.classPrefix + 'control').addClass(t.options.classPrefix + 'offscreen').css('display', 'block');

				t.controlsAreVisible = false;
				t.container.trigger('controlshidden');
			}
		}
	}, {
		key: 'startControlsTimer',
		value: function startControlsTimer(timeout) {

			var t = this;

			timeout = typeof timeout !== 'undefined' ? timeout : t.options.controlsTimeoutDefault;

			t.killControlsTimer('start');

			t.controlsTimer = setTimeout(function () {
				t.hideControls();
				t.killControlsTimer('hide');
			}, timeout);
		}
	}, {
		key: 'killControlsTimer',
		value: function killControlsTimer() {

			var t = this;

			if (t.controlsTimer !== null) {
				clearTimeout(t.controlsTimer);
				delete t.controlsTimer;
				t.controlsTimer = null;
			}
		}
	}, {
		key: 'disableControls',
		value: function disableControls() {
			var t = this;

			t.killControlsTimer();
			t.hideControls(false);
			this.controlsEnabled = false;
		}
	}, {
		key: 'enableControls',
		value: function enableControls() {
			var t = this;

			t.showControls(false);

			t.controlsEnabled = true;
		}

		/**
   * Set up all controls and events
   *
   * @param media
   * @param domNode
   * @private
   */

	}, {
		key: '_meReady',
		value: function _meReady(media, domNode) {
			var _this = this;

			var t = this,
			    autoplayAttr = domNode.getAttribute('autoplay'),
			    autoplay = !(autoplayAttr === undefined || autoplayAttr === null || autoplayAttr === 'false'),
			    isNative = media.rendererName !== null && media.rendererName.match(/(native|html5)/) !== null;

			// make sure it can't create itself again if a plugin reloads
			if (t.created) {
				return;
			}

			t.created = true;
			t.media = media;
			t.domNode = domNode;

			if (!(_constants.IS_ANDROID && t.options.AndroidUseNativeControls) && !(_constants.IS_IPAD && t.options.iPadUseNativeControls) && !(_constants.IS_IPHONE && t.options.iPhoneUseNativeControls)) {
				var _ret = function () {

					// In the event that no features are specified for audio,
					// create only MediaElement instance rather than
					// doing all the work to create a full player
					if (!t.isVideo && !t.options.features.length) {

						// force autoplay for HTML5
						if (autoplay && isNative) {
							t.play();
						}

						if (t.options.success) {

							if (typeof t.options.success === 'string') {
								_window2.default[t.options.success](t.media, t.domNode, t);
							} else {
								t.options.success(t.media, t.domNode, t);
							}
						}

						return {
							v: void 0
						};
					}

					// two built in features
					t.buildposter(t, t.controls, t.layers, t.media);
					t.buildkeyboard(t, t.controls, t.layers, t.media);
					t.buildoverlays(t, t.controls, t.layers, t.media);

					// grab for use by features
					t.findTracks();

					// add user-defined features/controls
					for (var featureIndex in t.options.features) {
						var feature = t.options.features[featureIndex];
						if (t['build' + feature]) {
							try {
								t['build' + feature](t, t.controls, t.layers, t.media);
							} catch (e) {
								// TODO: report control error
								console.error('error building ' + feature, e);
							}
						}
					}

					t.container.trigger('controlsready');

					// reset all layers and controls
					t.setPlayerSize(t.width, t.height);
					t.setControlsSize();

					// controls fade
					if (t.isVideo) {

						if (_constants.HAS_TOUCH && !t.options.alwaysShowControls) {

							// for touch devices (iOS, Android)
							// show/hide without animation on touch

							t.$media.on('touchstart', function () {

								// toggle controls
								if (t.controlsAreVisible) {
									t.hideControls(false);
								} else {
									if (t.controlsEnabled) {
										t.showControls(false);
									}
								}
							});
						} else {

							// create callback here since it needs access to current
							// MediaElement object
							t.clickToPlayPauseCallback = function () {

								if (t.options.clickToPlayPause) {
									var button = t.$media.closest('.' + t.options.classPrefix + 'container').find('.' + t.options.classPrefix + 'overlay-button'),
									    pressed = button.attr('aria-pressed');
									if (t.media.paused && pressed) {
										t.pause();
									} else if (t.media.paused) {
										t.play();
									} else {
										t.pause();
									}

									button.attr('aria-pressed', !pressed);
								}
							};

							// click to play/pause
							t.media.addEventListener('click', t.clickToPlayPauseCallback, false);

							// show/hide controls
							t.container.on('mouseenter', function () {
								if (t.controlsEnabled) {
									if (!t.options.alwaysShowControls) {
										t.killControlsTimer('enter');
										t.showControls();
										t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
									}
								}
							}).on('mousemove', function () {
								if (t.controlsEnabled) {
									if (!t.controlsAreVisible) {
										t.showControls();
									}
									if (!t.options.alwaysShowControls) {
										t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
									}
								}
							}).on('mouseleave', function () {
								if (t.controlsEnabled) {
									if (!t.media.paused && !t.options.alwaysShowControls) {
										t.startControlsTimer(t.options.controlsTimeoutMouseLeave);
									}
								}
							});
						}

						if (t.options.hideVideoControlsOnLoad) {
							t.hideControls(false);
						}

						// check for autoplay
						if (autoplay && !t.options.alwaysShowControls) {
							t.hideControls();
						}

						// resizer
						if (t.options.enableAutosize) {
							t.media.addEventListener('loadedmetadata', function (e) {
								// if the <video height> was not set and the options.videoHeight was not set
								// then resize to the real dimensions
								if (t.options.videoHeight <= 0 && !t.domNode.getAttribute('height') && !isNaN(e.target.videoHeight)) {
									t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
									t.setControlsSize();
									t.media.setSize(e.target.videoWidth, e.target.videoHeight);
								}
							}, false);
						}
					}

					// EVENTS

					// FOCUS: when a video starts playing, it takes focus from other players (possibly pausing them)
					t.media.addEventListener('play', function () {
						t.hasFocus = true;

						// go through all other players
						for (var playerIndex in _mejs2.default.players) {
							var p = _mejs2.default.players[playerIndex];
							if (p.id !== t.id && t.options.pauseOtherPlayers && !p.paused && !p.ended) {
								p.pause();
								p.hasFocus = false;
							}
						}
					}, false);

					// ended for all
					t.media.addEventListener('ended', function () {
						if (t.options.autoRewind) {
							try {
								t.media.setCurrentTime(0);
								// Fixing an Android stock browser bug, where "seeked" isn't fired correctly after ending the video and jumping to the beginning
								_window2.default.setTimeout(function () {
									$(t.container).find('.' + t.options.classPrefix + 'overlay-loading').parent().hide();
								}, 20);
							} catch (exp) {}
						}

						if (typeof t.media.stop === 'function') {
							t.media.stop();
						} else {
							t.media.pause();
						}

						if (t.setProgressRail) {
							t.setProgressRail();
						}
						if (t.setCurrentRail) {
							t.setCurrentRail();
						}

						if (t.options.loop) {
							t.play();
						} else if (!t.options.alwaysShowControls && t.controlsEnabled) {
							t.showControls();
						}
					}, false);

					// resize on the first play
					t.media.addEventListener('loadedmetadata', function () {

						(0, _time.calculateTimeFormat)(t.duration, t.options, t.options.framesPerSecond || 25);

						if (t.updateDuration) {
							t.updateDuration();
						}
						if (t.updateCurrent) {
							t.updateCurrent();
						}

						if (!t.isFullScreen) {
							t.setPlayerSize(t.width, t.height);
							t.setControlsSize();
						}
					}, false);

					// Only change the time format when necessary
					var duration = null;
					t.media.addEventListener('timeupdate', function () {
						if (duration !== _this.duration) {
							duration = _this.duration;
							(0, _time.calculateTimeFormat)(duration, t.options, t.options.framesPerSecond || 25);

							// make sure to fill in and resize the controls (e.g., 00:00 => 01:13:15
							if (t.updateDuration) {
								t.updateDuration();
							}
							if (t.updateCurrent) {
								t.updateCurrent();
							}
							t.setControlsSize();
						}
					}, false);

					t.container.focusout(function (e) {
						if (e.relatedTarget) {
							//FF is working on supporting focusout https://bugzilla.mozilla.org/show_bug.cgi?id=687787
							var $target = $(e.relatedTarget);
							if (t.keyboardAction && $target.parents('.' + t.options.classPrefix + 'container').length === 0) {
								t.keyboardAction = false;
								if (t.isVideo && !t.options.alwaysShowControls) {
									t.hideControls(true);
								}
							}
						}
					});

					// webkit has trouble doing this without a delay
					setTimeout(function () {
						t.setPlayerSize(t.width, t.height);
						t.setControlsSize();
					}, 50);

					// adjust controls whenever window sizes (used to be in fullscreen only)
					t.globalBind('resize', function () {

						// don't resize for fullscreen mode
						if (!(t.isFullScreen || _constants.HAS_TRUE_NATIVE_FULLSCREEN && _document2.default.webkitIsFullScreen)) {
							t.setPlayerSize(t.width, t.height);
						}

						// always adjust controls
						t.setControlsSize();
					});

					// Disable focus outline to improve look-and-feel for regular users
					t.globalBind('click', function (e) {
						if ($(e.target).is('.' + t.options.classPrefix + 'container')) {
							$(e.target).addClass(t.options.classPrefix + 'container-keyboard-inactive');
						} else if ($(e.target).closest('.' + t.options.classPrefix + 'container').length) {
							$(e.target).closest('.' + t.options.classPrefix + 'container').addClass(t.options.classPrefix + 'container-keyboard-inactive');
						}
					});

					// Enable focus outline for Accessibility purposes
					t.globalBind('keydown', function (e) {
						if ($(e.target).is('.' + t.options.classPrefix + 'container')) {
							$(e.target).removeClass(t.options.classPrefix + 'container-keyboard-inactive');
						} else if ($(e.target).closest('.' + t.options.classPrefix + 'container').length) {
							$(e.target).closest('.' + t.options.classPrefix + 'container').removeClass(t.options.classPrefix + 'container-keyboard-inactive');
						}
					});

					// This is a work-around for a bug in the YouTube iFrame player, which means
					//	we can't use the play() API for the initial playback on iOS or Android;
					//	user has to start playback directly by tapping on the iFrame.
					if (t.media.rendererName !== null && t.media.rendererName.match(/youtube/) && (_constants.IS_IOS || _constants.IS_ANDROID)) {
						t.container.find('.' + t.options.classPrefix + 'overlay-play').hide();
						t.container.find('.' + t.options.classPrefix + 'poster').hide();
					}
				}();

				if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
			}

			// force autoplay for HTML5
			if (autoplay && isNative) {
				t.play();
			}

			if (t.options.success) {

				if (typeof t.options.success === 'string') {
					_window2.default[t.options.success](t.media, t.domNode, t);
				} else {
					t.options.success(t.media, t.domNode, t);
				}
			}
		}

		/**
   *
   * @param {Event} e
   * @private
   */

	}, {
		key: '_handleError',
		value: function _handleError(e) {
			var t = this;

			if (t.controls) {
				t.disableControls();
			}

			// Tell user that the file cannot be played
			if (t.options.error) {
				t.options.error(e);
			}
		}
	}, {
		key: 'setPlayerSize',
		value: function setPlayerSize(width, height) {
			var t = this;

			if (!t.options.setDimensions) {
				return false;
			}

			if (typeof width !== 'undefined') {
				t.width = width;
			}

			if (typeof height !== 'undefined') {
				t.height = height;
			}

			if (typeof FB !== 'undefined' && t.isVideo) {
				FB.Event.subscribe('xfbml.ready', function () {
					var target = $(t.media).children('.fb-video');

					t.width = target.width();
					t.height = target.height();
					t.setDimensions(t.width, t.height);
					return false;
				});

				var target = $(t.media).children('.fb-video');

				if (target.length) {
					t.width = target.width();
					t.height = target.height();
				}
			}

			// check stretching modes
			switch (t.options.stretching) {
				case 'fill':
					// The 'fill' effect only makes sense on video; for audio we will set the dimensions
					if (t.isVideo) {
						t.setFillMode();
					} else {
						t.setDimensions(t.width, t.height);
					}
					break;
				case 'responsive':
					t.setResponsiveMode();
					break;
				case 'none':
					t.setDimensions(t.width, t.height);
					break;
				// This is the 'auto' mode
				default:
					if (t.hasFluidMode() === true) {
						t.setResponsiveMode();
					} else {
						t.setDimensions(t.width, t.height);
					}
					break;
			}
		}
	}, {
		key: 'hasFluidMode',
		value: function hasFluidMode() {
			var t = this;

			// detect 100% mode - use currentStyle for IE since css() doesn't return percentages
			return t.height.toString().includes('%') || t.$node.css('max-width') !== 'none' && t.$node.css('max-width') !== t.width || t.$node[0].currentStyle && t.$node[0].currentStyle.maxWidth === '100%';
		}
	}, {
		key: 'setResponsiveMode',
		value: function setResponsiveMode() {
			var t = this;

			// do we have the native dimensions yet?
			var nativeWidth = function () {
				if (t.isVideo) {
					if (t.media.videoWidth && t.media.videoWidth > 0) {
						return t.media.videoWidth;
					} else if (t.media.getAttribute('width')) {
						return t.media.getAttribute('width');
					} else {
						return t.options.defaultVideoWidth;
					}
				} else {
					return t.options.defaultAudioWidth;
				}
			}();

			var nativeHeight = function () {
				if (t.isVideo) {
					if (t.media.videoHeight && t.media.videoHeight > 0) {
						return t.media.videoHeight;
					} else if (t.media.getAttribute('height')) {
						return t.media.getAttribute('height');
					} else {
						return t.options.defaultVideoHeight;
					}
				} else {
					return t.options.defaultAudioHeight;
				}
			}();

			// Use media aspect ratio if received; otherwise, the initially stored initial aspect ratio
			var aspectRatio = function () {
				var ratio = 1;
				if (!t.isVideo) {
					return ratio;
				}

				if (t.media.videoWidth && t.media.videoWidth > 0 && t.media.videoHeight && t.media.videoHeight > 0) {
					ratio = t.height >= t.width ? t.media.videoWidth / t.media.videoHeight : t.media.videoHeight / t.media.videoWidth;
				} else {
					ratio = t.initialAspectRatio;
				}

				if (isNaN(ratio) || ratio < 0.01 || ratio > 100) {
					ratio = 1;
				}

				return ratio;
			}(),
			    parentWidth = t.container.parent().closest(':visible').width(),
			    parentHeight = t.container.parent().closest(':visible').height(),
			    newHeight = void 0;

			if (t.isVideo) {
				// Responsive video is based on width: 100% and height: 100%
				if (t.height === '100%') {
					newHeight = parseInt(parentWidth * nativeHeight / nativeWidth, 10);
				} else {
					newHeight = t.height >= t.width ? parseInt(parentWidth / aspectRatio, 10) : parseInt(parentWidth * aspectRatio, 10);
				}
			} else {
				newHeight = nativeHeight;
			}

			// If we were unable to compute newHeight, get the container height instead
			if (isNaN(newHeight)) {
				newHeight = parentHeight;
			}

			if (t.container.parent().length > 0 && t.container.parent()[0].tagName.toLowerCase() === 'body') {
				// && t.container.siblings().count == 0) {
				parentWidth = $(_window2.default).width();
				newHeight = $(_window2.default).height();
			}

			if (newHeight && parentWidth) {

				// set outer container size
				t.container.width(parentWidth).height(newHeight);

				// set native <video> or <audio> and shims
				t.$media.width('100%').height('100%');

				// if shim is ready, send the size to the embedded plugin
				if (t.isVideo) {
					if (t.media.setSize) {
						t.media.setSize(parentWidth, newHeight);
					}
				}

				// set the layers
				t.layers.children('.' + t.options.classPrefix + 'layer').width('100%').height('100%');
			}
		}
	}, {
		key: 'setFillMode',
		value: function setFillMode() {
			var t = this,
			    parent = t.outerContainer;

			// Remove the responsive attributes in the event they are there
			if (t.$node.css('height') !== 'none' && t.$node.css('height') !== t.height) {
				t.$node.css('height', '');
			}
			if (t.$node.css('max-width') !== 'none' && t.$node.css('max-width') !== t.width) {
				t.$node.css('max-width', '');
			}

			if (t.$node.css('max-height') !== 'none' && t.$node.css('max-height') !== t.height) {
				t.$node.css('max-height', '');
			}

			if (t.$node[0].currentStyle) {
				if (t.$node[0].currentStyle.height === '100%') {
					t.$node[0].currentStyle.height = '';
				}
				if (t.$node[0].currentStyle.maxWidth === '100%') {
					t.$node[0].currentStyle.maxWidth = '';
				}
				if (t.$node[0].currentStyle.maxHeight === '100%') {
					t.$node[0].currentStyle.maxHeight = '';
				}
			}

			if (!parent.width()) {
				parent.height(t.$media.width());
			}

			if (!parent.height()) {
				parent.height(t.$media.height());
			}

			var parentWidth = parent.width(),
			    parentHeight = parent.height();

			t.setDimensions('100%', '100%');

			// This prevents an issue when displaying poster
			t.container.find('.' + t.options.classPrefix + 'poster img').css('display', 'block');

			// calculate new width and height
			var targetElement = t.container.find('object, embed, iframe, video'),
			    initHeight = t.height,
			    initWidth = t.width,

			// scale to the target width
			scaleX1 = parentWidth,
			    scaleY1 = initHeight * parentWidth / initWidth,

			// scale to the target height
			scaleX2 = initWidth * parentHeight / initHeight,
			    scaleY2 = parentHeight,

			// now figure out which one we should use
			bScaleOnWidth = scaleX2 > parentWidth === false,
			    finalWidth = bScaleOnWidth ? Math.floor(scaleX1) : Math.floor(scaleX2),
			    finalHeight = bScaleOnWidth ? Math.floor(scaleY1) : Math.floor(scaleY2);

			if (bScaleOnWidth) {
				targetElement.height(finalHeight).width(parentWidth);
				if (t.media.setSize) {
					t.media.setSize(parentWidth, finalHeight);
				}
			} else {
				targetElement.height(parentHeight).width(finalWidth);
				if (t.media.setSize) {
					t.media.setSize(finalWidth, parentHeight);
				}
			}

			targetElement.css({
				'margin-left': Math.floor((parentWidth - finalWidth) / 2),
				'margin-top': 0
			});
		}
	}, {
		key: 'setDimensions',
		value: function setDimensions(width, height) {
			var t = this;

			t.container.width(width).height(height);

			t.layers.children('.' + t.options.classPrefix + 'layer').width(width).height(height);
		}
	}, {
		key: 'setControlsSize',
		value: function setControlsSize() {
			var t = this;

			// skip calculation if hidden
			if (!t.container.is(':visible') || !t.rail || !t.rail.length || !t.rail.is(':visible')) {
				return;
			}

			var railMargin = parseFloat(t.rail.css('margin-left')) + parseFloat(t.rail.css('margin-right')),
			    totalMargin = parseFloat(t.total.css('margin-left')) + parseFloat(t.total.css('margin-right')) || 0,
			    siblingsWidth = 0;

			t.rail.siblings().each(function (index, object) {
				siblingsWidth += parseFloat($(object).outerWidth(true));
			});

			siblingsWidth += totalMargin + railMargin + 1;

			// Substract the width of the feature siblings from time rail
			t.rail.width(t.controls.width() - siblingsWidth);

			t.container.trigger('controlsresize');
		}
	}, {
		key: 'resetSize',
		value: function resetSize() {
			var t = this;
			// webkit has trouble doing this without a delay
			setTimeout(function () {
				t.setPlayerSize(t.width, t.height);
				t.setControlsSize();
			}, 50);
		}
	}, {
		key: 'setPoster',
		value: function setPoster(url) {
			var t = this,
			    posterDiv = t.container.find('.' + t.options.classPrefix + 'poster'),
			    posterImg = posterDiv.find('img');

			if (posterImg.length === 0) {
				posterImg = $('<img class="' + t.options.classPrefix + 'poster-img" width="100%" height="100%" alt="" />').appendTo(posterDiv);
			}

			posterImg.attr('src', url);
			posterDiv.css({ 'background-image': 'url("' + url + '")' });
		}
	}, {
		key: 'changeSkin',
		value: function changeSkin(className) {
			var t = this;

			t.container[0].className = t.options.classPrefix + 'container ' + className;
			t.setPlayerSize(t.width, t.height);
			t.setControlsSize();
		}
	}, {
		key: 'globalBind',
		value: function globalBind(events, data, callback) {
			var t = this,
			    doc = t.node ? t.node.ownerDocument : _document2.default;

			events = (0, _general.splitEvents)(events, t.id);
			if (events.d) {
				$(doc).on(events.d, data, callback);
			}
			if (events.w) {
				$(_window2.default).on(events.w, data, callback);
			}
		}
	}, {
		key: 'globalUnbind',
		value: function globalUnbind(events, callback) {

			var t = this,
			    doc = t.node ? t.node.ownerDocument : _document2.default;

			events = (0, _general.splitEvents)(events, t.id);
			if (events.d) {
				$(doc).off(events.d, callback);
			}
			if (events.w) {
				$(_window2.default).off(events.w, callback);
			}
		}
	}, {
		key: 'buildposter',
		value: function buildposter(player, controls, layers, media) {

			var t = this,
			    poster = $('<div class="' + t.options.classPrefix + 'poster ' + t.options.classPrefix + 'layer"></div>').appendTo(layers),
			    posterUrl = player.$media.attr('poster');

			// priority goes to option (this is useful if you need to support iOS 3.x (iOS completely fails with poster)
			if (player.options.poster !== '') {
				posterUrl = player.options.poster;
			}

			// second, try the real poster
			if (posterUrl) {
				t.setPoster(posterUrl);
			} else {
				poster.hide();
			}

			media.addEventListener('play', function () {
				poster.hide();
			}, false);

			if (player.options.showPosterWhenEnded && player.options.autoRewind) {
				media.addEventListener('ended', function () {
					poster.show();
				}, false);
			}
		}
	}, {
		key: 'buildoverlays',
		value: function buildoverlays(player, controls, layers, media) {

			if (!player.isVideo) {
				return;
			}

			var t = this,
			    loading = $('<div class="' + t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer">' + ('<div class="' + t.options.classPrefix + 'overlay-loading">') + ('<span class="' + t.options.classPrefix + 'overlay-loading-bg-img"></span>') + '</div>' + '</div>').hide() // start out hidden
			.appendTo(layers),
			    error = $('<div class="' + t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer">' + ('<div class="' + t.options.classPrefix + 'overlay-error"></div>') + '</div>').hide() // start out hidden
			.appendTo(layers),

			// this needs to come last so it's on top
			bigPlay = $('<div class="' + t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer ' + t.options.classPrefix + 'overlay-play">' + ('<div class="' + t.options.classPrefix + 'overlay-button" role="button" ') + ('aria-label="' + _i18n2.default.t('mejs.play') + '" aria-pressed="false">') + '</div>' + '</div>').appendTo(layers).on('click', function () {
				// Removed 'touchstart' due issues on Samsung Android devices where a tap on bigPlay
				// started and immediately stopped the video
				if (t.options.clickToPlayPause) {

					var button = t.$media.closest('.' + t.options.classPrefix + 'container').find('.' + t.options.classPrefix + 'overlay-button'),
					    pressed = button.attr('aria-pressed');

					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}

					button.attr('aria-pressed', !!pressed);
				}
			});

			// if (t.options.supportVR || (t.media.rendererName !== null && t.media.rendererName.match(/(youtube|facebook)/))) {
			if (t.media.rendererName !== null && t.media.rendererName.match(/(youtube|facebook)/)) {
				bigPlay.hide();
			}

			// show/hide big play button
			media.addEventListener('play', function () {
				bigPlay.hide();
				loading.hide();
				controls.find('.' + t.options.classPrefix + 'time-buffering').hide();
				error.hide();
			}, false);

			media.addEventListener('playing', function () {
				bigPlay.hide();
				loading.hide();
				controls.find('.' + t.options.classPrefix + 'time-buffering').hide();
				error.hide();
			}, false);

			media.addEventListener('seeking', function () {
				loading.show();
				controls.find('.' + t.options.classPrefix + 'time-buffering').show();
			}, false);

			media.addEventListener('seeked', function () {
				loading.hide();
				controls.find('.' + t.options.classPrefix + 'time-buffering').hide();
			}, false);

			media.addEventListener('pause', function () {
				bigPlay.show();
			}, false);

			media.addEventListener('waiting', function () {
				loading.show();
				controls.find('.' + t.options.classPrefix + 'time-buffering').show();
			}, false);

			// show/hide loading
			media.addEventListener('loadeddata', function () {
				// for some reason Chrome is firing this event
				//if (mejs.MediaFeatures.isChrome && media.getAttribute && media.getAttribute('preload') === 'none')
				//	return;

				loading.show();
				controls.find('.' + t.options.classPrefix + 'time-buffering').show();
				// Firing the 'canplay' event after a timeout which isn't getting fired on some Android 4.1 devices
				// (https://github.com/johndyer/mediaelement/issues/1305)
				if (_constants.IS_ANDROID) {
					media.canplayTimeout = _window2.default.setTimeout(function () {
						if (_document2.default.createEvent) {
							var evt = _document2.default.createEvent('HTMLEvents');
							evt.initEvent('canplay', true, true);
							return media.dispatchEvent(evt);
						}
					}, 300);
				}
			}, false);
			media.addEventListener('canplay', function () {
				loading.hide();
				controls.find('.' + t.options.classPrefix + 'time-buffering').hide();
				// Clear timeout inside 'loadeddata' to prevent 'canplay' from firing twice
				clearTimeout(media.canplayTimeout);
			}, false);

			// error handling
			media.addEventListener('error', function (e) {
				t._handleError(e);
				loading.hide();
				bigPlay.hide();
				error.show();
				error.find('.' + t.options.classPrefix + 'overlay-error').html(e.message);
			}, false);

			media.addEventListener('keydown', function (e) {
				t.onkeydown(player, media, e);
			}, false);
		}
	}, {
		key: 'buildkeyboard',
		value: function buildkeyboard(player, controls, layers, media) {

			var t = this;

			t.container.keydown(function () {
				t.keyboardAction = true;
			});

			// listen for key presses
			t.globalBind('keydown', function (event) {
				var $container = $(event.target).closest('.' + t.options.classPrefix + 'container');
				player.hasFocus = $container.length !== 0 && $container.attr('id') === player.$media.closest('.' + t.options.classPrefix + 'container').attr('id');
				return t.onkeydown(player, media, event);
			});

			// check if someone clicked outside a player region, then kill its focus
			t.globalBind('click', function (event) {
				player.hasFocus = $(event.target).closest('.' + t.options.classPrefix + 'container').length !== 0;
			});
		}
	}, {
		key: 'onkeydown',
		value: function onkeydown(player, media, e) {

			if (player.hasFocus && player.options.enableKeyboard) {
				// find a matching key
				for (var i = 0, il = player.options.keyActions.length; i < il; i++) {
					var keyAction = player.options.keyActions[i];

					for (var j = 0, jl = keyAction.keys.length; j < jl; j++) {
						if (e.keyCode === keyAction.keys[j]) {
							keyAction.action(player, media, e.keyCode, e);
							return false;
						}
					}
				}
			}

			return true;
		}
	}, {
		key: 'play',
		value: function play() {
			var t = this;

			// only load if the current time is 0 to ensure proper playing
			if (t.media.getCurrentTime() <= 0) {
				t.load();
			}
			t.media.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			try {
				this.media.pause();
			} catch (e) {}
		}
	}, {
		key: 'load',
		value: function load() {
			var t = this;

			if (!t.isLoaded) {
				t.media.load();
			}

			t.isLoaded = true;
		}
	}, {
		key: 'setMuted',
		value: function setMuted(muted) {
			this.media.setMuted(muted);
		}
	}, {
		key: 'setCurrentTime',
		value: function setCurrentTime(time) {
			this.media.setCurrentTime(time);
		}
	}, {
		key: 'getCurrentTime',
		value: function getCurrentTime() {
			return this.media.currentTime;
		}
	}, {
		key: 'setVolume',
		value: function setVolume(volume) {
			this.media.setVolume(volume);
		}
	}, {
		key: 'getVolume',
		value: function getVolume() {
			return this.media.volume;
		}
	}, {
		key: 'setSrc',
		value: function setSrc(src) {
			this.media.setSrc(src);
		}
	}, {
		key: 'remove',
		value: function remove() {

			var t = this,
			    rendererName = t.media.rendererName;

			// invoke features cleanup
			for (var featureIndex in t.options.features) {
				var feature = t.options.features[featureIndex];
				if (t['clean' + feature]) {
					try {
						t['clean' + feature](t);
					} catch (e) {
						// @todo: report control error
						console.error('error cleaning ' + feature, e);
					}
				}
			}

			// reset dimensions
			t.$node.css({
				width: t.$node.attr('width') || 'auto',
				height: t.$node.attr('height') || 'auto'
			});

			// grab video and put it back in place
			if (!t.isDynamic) {
				t.$media.prop('controls', true);
				// detach events from the video
				// @todo: detach event listeners better than this; also detach ONLY the events attached by this plugin!
				t.$node.attr('id', t.$node.attr('id').replace('_' + rendererName, ''));
				t.$node.clone().insertBefore(t.container).show();
				t.$node.remove();
			} else {
				t.$node.insertBefore(t.container);
			}

			t.media.remove();

			// Remove the player from the mejs.players object so that pauseOtherPlayers doesn't blow up when trying to
			// pause a non existent Flash API.
			delete _mejs2.default.players[t.id];

			if (_typeof(t.container) === 'object') {
				t.container.prev('.' + t.options.classPrefix + 'offscreen').remove();
				t.container.remove();
			}
			t.globalUnbind();
			delete t.node.player;
		}
	}]);

	return MediaElementPlayer;
}();

_window2.default.MediaElementPlayer = MediaElementPlayer;

exports.default = MediaElementPlayer;

// turn into plugin

(function ($) {

	if (typeof $ !== 'undefined') {
		$.fn.mediaelementplayer = function (options) {
			if (options === false) {
				this.each(function () {
					var player = $(this).data('mediaelementplayer');
					if (player) {
						player.remove();
					}
					$(this).removeData('mediaelementplayer');
				});
			} else {
				this.each(function () {
					$(this).data('mediaelementplayer', new MediaElementPlayer(this, options));
				});
			}
			return this;
		};

		$(_document2.default).ready(function () {
			// auto enable using JSON attribute
			$('.' + config.classPrefix + 'player').mediaelementplayer();
		});
	}
})(_mejs2.default.$);

},{"2":2,"27":27,"28":28,"29":29,"3":3,"32":32,"4":4,"5":5,"6":6}],17:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DailyMotion renderer
 *
 * Uses <iframe> approach and uses DailyMotion API to manipulate it.
 * @see https://developer.dailymotion.com/player
 *
 */
var DailyMotionApi = {
	/**
  * @type {Boolean}
  */
	isSDKStarted: false,
	/**
  * @type {Boolean}
  */
	isSDKLoaded: false,
	/**
  * @type {Array}
  */
	iframeQueue: [],

	/**
  * Create a queue to prepare the creation of <iframe>
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	enqueueIframe: function enqueueIframe(settings) {

		if (DailyMotionApi.isLoaded) {
			DailyMotionApi.createIframe(settings);
		} else {
			DailyMotionApi.loadIframeApi();
			DailyMotionApi.iframeQueue.push(settings);
		}
	},

	/**
  * Load DailyMotion API script on the header of the document
  *
  */
	loadIframeApi: function loadIframeApi() {
		if (!DailyMotionApi.isSDKStarted) {
			var e = _document2.default.createElement('script');
			e.async = true;
			e.src = '//api.dmcdn.net/all.js';
			var s = _document2.default.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(e, s);
			DailyMotionApi.isSDKStarted = true;
		}
	},

	/**
  * Process queue of DailyMotion <iframe> element creation
  *
  */
	apiReady: function apiReady() {

		DailyMotionApi.isLoaded = true;
		DailyMotionApi.isSDKLoaded = true;

		while (DailyMotionApi.iframeQueue.length > 0) {
			var settings = DailyMotionApi.iframeQueue.pop();
			DailyMotionApi.createIframe(settings);
		}
	},

	/**
  * Create a new instance of DailyMotion API player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	createIframe: function createIframe(settings) {

		var player = DM.player(settings.container, {
			height: settings.height || '100%',
			width: settings.width || '100%',
			video: settings.videoId,
			params: Object.assign({ api: true }, settings.params),
			origin: location.host
		});

		player.addEventListener('apiready', function () {
			_window2.default['__ready__' + settings.id](player, { paused: true, ended: false });
		});
	},

	/**
  * Extract ID from DailyMotion's URL to be loaded through API
  * Valid URL format(s):
  * - http://www.dailymotion.com/embed/video/x35yawy
  * - http://dai.ly/x35yawy
  *
  * @param {String} url
  * @return {String}
  */
	getDailyMotionId: function getDailyMotionId(url) {
		var parts = url.split('/'),
		    lastPart = parts[parts.length - 1],
		    dashParts = lastPart.split('_');

		return dashParts[0];
	}
};

var DailyMotionIframeRenderer = {
	name: 'dailymotion_iframe',

	options: {
		prefix: 'dailymotion_iframe',

		dailymotion: {
			width: '100%',
			height: '100%',
			params: {
				autoplay: false,
				chromeless: 1,
				info: 0,
				logo: 0,
				related: 0
			}
		}
	},

	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return ['video/dailymotion', 'video/x-dailymotion'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var dm = {};

		dm.options = options;
		dm.id = mediaElement.id + '_' + options.prefix;
		dm.mediaElement = mediaElement;

		var apiStack = [],
		    dmPlayerReady = false,
		    dmPlayer = null,
		    dmIframe = null,
		    events = void 0,
		    i = void 0,
		    il = void 0;

		// wrappers for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			// add to flash state that we will store

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			dm['get' + capName] = function () {
				if (dmPlayer !== null) {
					var value = null;

					// figure out how to get dm dta here

					var _ret = function () {
						switch (propName) {
							case 'currentTime':
								return {
									v: dmPlayer.currentTime
								};

							case 'duration':
								return {
									v: isNaN(dmPlayer.duration) ? 0 : dmPlayer.duration
								};

							case 'volume':
								return {
									v: dmPlayer.volume
								};

							case 'paused':
								return {
									v: dmPlayer.paused
								};

							case 'ended':
								return {
									v: dmPlayer.ended
								};

							case 'muted':
								return {
									v: dmPlayer.muted
								};

							case 'buffered':
								var percentLoaded = dmPlayer.bufferedTime,
								    duration = dmPlayer.duration;
								return {
									v: {
										start: function start() {
											return 0;
										},
										end: function end() {
											return percentLoaded / duration;
										},
										length: 1
									}
								};
							case 'src':
								return {
									v: mediaElement.originalNode.getAttribute('src')
								};
						}
					}();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
					return value;
				} else {
					return null;
				}
			};

			dm['set' + capName] = function (value) {
				if (dmPlayer !== null) {

					switch (propName) {

						case 'src':
							var url = typeof value === 'string' ? value : value[0].src;

							dmPlayer.load(DailyMotionApi.getDailyMotionId(url));
							break;

						case 'currentTime':
							dmPlayer.seek(value);
							break;

						case 'muted':
							if (value) {
								dmPlayer.setMuted(true);
							} else {
								dmPlayer.setMuted(false);
							}
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', dm);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						case 'volume':
							dmPlayer.setVolume(value);
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', dm);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						default:
							
					}
				} else {
					// store for after "READY" event fires
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the native HTMLMediaElement
			dm[methodName] = function () {
				if (dmPlayer !== null) {

					// DO method
					switch (methodName) {
						case 'play':
							return dmPlayer.play();
						case 'pause':
							return dmPlayer.pause();
						case 'load':
							return null;

					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// Initial method to register all DailyMotion events when initializing <iframe>
		_window2.default['__ready__' + dm.id] = function (_dmPlayer) {

			dmPlayerReady = true;
			mediaElement.dmPlayer = dmPlayer = _dmPlayer;

			// do call stack
			if (apiStack.length) {
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						dm['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						dm[stackItem.methodName]();
					}
				}
			}

			dmIframe = _document2.default.getElementById(dm.id);

			// a few more events
			events = ['mouseover', 'mouseout'];
			var assignEvent = function assignEvent(e) {
				var event = (0, _dom.createEvent)(e.type, dm);
				mediaElement.dispatchEvent(event);
			};

			for (var j in events) {
				(0, _dom.addEvent)(dmIframe, events[j], assignEvent);
			}

			// BUBBLE EVENTS up
			events = _mejs2.default.html5media.events;
			events = events.concat(['click', 'mouseover', 'mouseout']);
			var assignNativeEvents = function assignNativeEvents(eventName) {

				// Deprecated event; not consider it
				if (eventName !== 'ended') {

					dmPlayer.addEventListener(eventName, function (e) {
						var event = (0, _dom.createEvent)(e.type, dmPlayer);
						mediaElement.dispatchEvent(event);
					});
				}
			};

			for (i = 0, il = events.length; i < il; i++) {
				assignNativeEvents(events[i]);
			}

			// Custom DailyMotion events
			dmPlayer.addEventListener('ad_start', function () {
				var event = (0, _dom.createEvent)('play', dmPlayer);
				mediaElement.dispatchEvent(event);

				event = (0, _dom.createEvent)('progress', dmPlayer);
				mediaElement.dispatchEvent(event);

				event = (0, _dom.createEvent)('timeupdate', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('ad_timeupdate', function () {
				var event = (0, _dom.createEvent)('timeupdate', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('ad_pause', function () {
				var event = (0, _dom.createEvent)('pause', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('ad_end', function () {
				var event = (0, _dom.createEvent)('ended', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('video_start', function () {
				var event = (0, _dom.createEvent)('play', dmPlayer);
				mediaElement.dispatchEvent(event);

				event = (0, _dom.createEvent)('timeupdate', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('video_end', function () {
				var event = (0, _dom.createEvent)('ended', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('progress', function () {
				var event = (0, _dom.createEvent)('timeupdate', dmPlayer);
				mediaElement.dispatchEvent(event);
			});
			dmPlayer.addEventListener('durationchange', function () {
				var event = (0, _dom.createEvent)('timeupdate', dmPlayer);
				mediaElement.dispatchEvent(event);
			});

			// give initial events
			var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

			for (i = 0, il = initEvents.length; i < il; i++) {
				var event = (0, _dom.createEvent)(initEvents[i], dm);
				mediaElement.dispatchEvent(event);
			}
		};

		var dmContainer = _document2.default.createElement('div');
		dmContainer.id = dm.id;
		mediaElement.appendChild(dmContainer);
		if (mediaElement.originalNode) {
			dmContainer.style.width = mediaElement.originalNode.style.width;
			dmContainer.style.height = mediaElement.originalNode.style.height;
		}
		mediaElement.originalNode.style.display = 'none';

		var videoId = DailyMotionApi.getDailyMotionId(mediaFiles[0].src),
		    dmSettings = Object.assign({
			id: dm.id,
			container: dmContainer,
			videoId: videoId,
			autoplay: !!mediaElement.originalNode.getAttribute('autoplay')
		}, dm.options.dailymotion);

		DailyMotionApi.enqueueIframe(dmSettings);

		dm.hide = function () {
			dm.stopInterval();
			dm.pause();
			if (dmIframe) {
				dmIframe.style.display = 'none';
			}
		};
		dm.show = function () {
			if (dmIframe) {
				dmIframe.style.display = '';
			}
		};
		dm.setSize = function (width, height) {
			dmIframe.width = width;
			dmIframe.height = height;
		};
		dm.destroy = function () {
			dmPlayer.destroy();
		};
		dm.interval = null;

		dm.startInterval = function () {
			dm.interval = setInterval(function () {
				DailyMotionApi.sendEvent(dm.id, dmPlayer, 'timeupdate', {
					paused: false,
					ended: false
				});
			}, 250);
		};
		dm.stopInterval = function () {
			if (dm.interval) {
				clearInterval(dm.interval);
			}
		};

		return dm;
	}
};

/*
 * Register DailyMotion event globally
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('//dailymotion.com') || url.includes('www.dailymotion.com') || url.includes('//dai.ly') ? 'video/x-dailymotion' : null;
});

_window2.default.dmAsyncInit = function () {
	DailyMotionApi.apiReady();
};

_renderer.renderer.add(DailyMotionIframeRenderer);

},{"2":2,"28":28,"3":3,"30":30,"6":6,"7":7}],18:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _media = _dereq_(30);

var _constants = _dereq_(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Native M(PEG)-Dash renderer
 *
 * Uses dash.js, a reference client implementation for the playback of M(PEG)-DASH via Javascript and compliant browsers.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with mpd files.
 * @see https://github.com/Dash-Industry-Forum/dash.js
 *
 */
var NativeDash = {
	/**
  * @type {Boolean}
  */
	isMediaLoaded: false,
	/**
  * @type {Array}
  */
	creationQueue: [],

	/**
  * Create a queue to prepare the loading of an DASH source
  *
  * @param {Object} settings - an object with settings needed to load an DASH player instance
  */
	prepareSettings: function prepareSettings(settings) {
		if (NativeDash.isLoaded) {
			NativeDash.createInstance(settings);
		} else {
			NativeDash.loadScript(settings);
			NativeDash.creationQueue.push(settings);
		}
	},

	/**
  * Load dash.mediaplayer.js script on the header of the document
  *
  * @param {Object} settings - an object with settings needed to load an DASH player instance
  */
	loadScript: function loadScript(settings) {
		if (!NativeDash.isScriptLoaded) {

			if (typeof dashjs !== 'undefined') {
				NativeDash.createInstance(settings);
			} else {
				(function () {

					settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : '//cdn.dashjs.org/latest/dash.mediaplayer.min.js';

					var script = _document2.default.createElement('script'),
					    firstScriptTag = _document2.default.getElementsByTagName('script')[0],
					    done = false;

					script.src = settings.options.path;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function () {
						if (!done && (!this.readyState || this.readyState === undefined || this.readyState === 'loaded' || this.readyState === 'complete')) {
							done = true;
							NativeDash.mediaReady();
							script.onload = script.onreadystatechange = null;
						}
					};

					firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				})();
			}
			NativeDash.isScriptLoaded = true;
		}
	},

	/**
  * Process queue of DASH player creation
  *
  */
	mediaReady: function mediaReady() {

		NativeDash.isLoaded = true;
		NativeDash.isScriptLoaded = true;

		while (NativeDash.creationQueue.length > 0) {
			var settings = NativeDash.creationQueue.pop();
			NativeDash.createInstance(settings);
		}
	},

	/**
  * Create a new instance of DASH player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to instantiate DASH object
  */
	createInstance: function createInstance(settings) {

		var player = dashjs.MediaPlayer().create();
		_window2.default['__ready__' + settings.id](player);
	}
};

var DashNativeRenderer = {
	name: 'native_dash',

	options: {
		prefix: 'native_dash',
		dash: {
			// Special config: used to set the local path/URL of dash.js mediaplayer library
			path: '//cdn.dashjs.org/latest/dash.mediaplayer.min.js',
			debug: false
		}
	},
	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['application/dash+xml'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var node = null,
		    originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    dashPlayer = void 0,
		    stack = {},
		    i = void 0,
		    il = void 0;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		// WRAPPERS for PROPs
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return dashPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (dashPlayer !== null) {
					if (propName === 'src') {

						dashPlayer.attachSource(value);

						if (node.getAttribute('autoplay')) {
							node.play();
						}
					}

					node[propName] = value;
				} else {
					// store for after "READY" event fires
					stack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all M-Dash events
		_window2.default['__ready__' + id] = function (_dashPlayer) {

			mediaElement.dashPlayer = dashPlayer = _dashPlayer;

			// By default, console log is off
			dashPlayer.getDebug().setLogToBrowserConsole(options.dash.debug);

			// do call stack
			if (stack.length) {
				for (i = 0, il = stack.length; i < il; i++) {

					var stackItem = stack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						node['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						node[stackItem.methodName]();
					}
				}
			}

			// BUBBLE EVENTS
			var events = _mejs2.default.html5media.events,
			    dashEvents = dashjs.MediaPlayer.events,
			    assignEvents = function assignEvents(eventName) {

				if (eventName === 'loadedmetadata') {
					dashPlayer.initialize(node, node.src, false);
				}

				node.addEventListener(eventName, function (e) {
					var event = _document2.default.createEvent('HTMLEvents');
					event.initEvent(e.type, e.bubbles, e.cancelable);
					// @todo Check this
					// event.srcElement = e.srcElement;
					// event.target = e.srcElement;

					mediaElement.dispatchEvent(event);
				});
			};

			events = events.concat(['click', 'mouseover', 'mouseout']);

			for (i = 0, il = events.length; i < il; i++) {
				assignEvents(events[i]);
			}

			/**
    * Custom M(PEG)-DASH events
    *
    * These events can be attached to the original node using addEventListener and the name of the event,
    * not using dashjs.MediaPlayer.events object
    * @see http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html
    */
			var assignMdashEvents = function assignMdashEvents(e) {
				var event = (0, _dom.createEvent)(e.type, node);
				event.data = e;
				mediaElement.dispatchEvent(event);

				if (e.type.toLowerCase() === 'error') {
					console.error(e);
				}
			};

			for (var eventType in dashEvents) {
				if (dashEvents.hasOwnProperty(eventType)) {
					dashPlayer.on(dashEvents[eventType], assignMdashEvents);
				}
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		NativeDash.prepareSettings({
			options: options.dash,
			id: id
		});

		// HELPER METHODS
		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		var event = (0, _dom.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native M(PEG)-Dash type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('.mpd') ? 'application/dash+xml' : null;
});

_renderer.renderer.add(DashNativeRenderer);

},{"2":2,"27":27,"28":28,"3":3,"30":30,"6":6,"7":7}],19:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(29);

var _dom = _dereq_(28);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Facebook renderer
 *
 * It creates an <iframe> from a <div> with specific configuration.
 * @see https://developers.facebook.com/docs/plugins/embedded-video-player
 */
var FacebookRenderer = {
	name: 'facebook',

	options: {
		prefix: 'facebook',
		facebook: {
			appId: '{your-app-id}',
			xfbml: true,
			version: 'v2.6'
		}
	},

	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return ['video/facebook', 'video/x-facebook'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var fbWrapper = {},
		    fbApi = null,
		    fbDiv = null,
		    apiStack = [],
		    paused = true,
		    ended = false,
		    hasStartedPlaying = false,
		    src = '',
		    eventHandler = {},
		    i = void 0,
		    il = void 0;

		options = Object.assign(options, mediaElement.options);
		fbWrapper.options = options;
		fbWrapper.id = mediaElement.id + '_' + options.prefix;
		fbWrapper.mediaElement = mediaElement;

		// wrappers for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			fbWrapper['get' + capName] = function () {

				if (fbApi !== null) {
					var value = null;

					// figure out how to get youtube dta here
					switch (propName) {
						case 'currentTime':
							return fbApi.getCurrentPosition();

						case 'duration':
							return fbApi.getDuration();

						case 'volume':
							return fbApi.getVolume();

						case 'paused':
							return paused;

						case 'ended':
							return ended;

						case 'muted':
							return fbApi.isMuted();

						case 'buffered':
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return 0;
								},
								length: 1
							};
						case 'src':
							return src;
					}

					return value;
				} else {
					return null;
				}
			};

			fbWrapper['set' + capName] = function (value) {

				if (fbApi !== null) {

					switch (propName) {

						case 'src':
							var url = typeof value === 'string' ? value : value[0].src;

							// Only way is to destroy instance and all the events fired,
							// and create new one
							fbDiv.parentNode.removeChild(fbDiv);
							createFacebookEmbed(url, options.facebook);

							// This method reloads video on-demand
							FB.XFBML.parse();

							break;

						case 'currentTime':
							fbApi.seek(value);
							break;

						case 'muted':
							if (value) {
								fbApi.mute();
							} else {
								fbApi.unmute();
							}
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', fbWrapper);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						case 'volume':
							fbApi.setVolume(value);
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', fbWrapper);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						default:
							
					}
				} else {
					// store for after "READY" event fires
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the native HTMLMediaElement
			fbWrapper[methodName] = function () {

				if (fbApi !== null) {

					// DO method
					switch (methodName) {
						case 'play':
							return fbApi.play();
						case 'pause':
							return fbApi.pause();
						case 'load':
							return null;

					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		/**
   * Dispatch a list of events
   *
   * @private
   * @param {Array} events
   */
		function sendEvents(events) {
			for (var _i = 0, _il = events.length; _i < _il; _i++) {
				var event = _mejs2.default.Utils.createEvent(events[_i], fbWrapper);
				mediaElement.dispatchEvent(event);
			}
		}

		/**
   * Create a new Facebook player and attach all its events
   *
   * This method creates a <div> element that, once the API is available, will generate an <iframe>.
   * Valid URL format(s):
   *  - https://www.facebook.com/johndyer/videos/10107816243681884/
   *
   * @param {String} url
   * @param {Object} config
   */
		function createFacebookEmbed(url, config) {

			src = url;

			fbDiv = _document2.default.createElement('div');
			fbDiv.id = fbWrapper.id;
			fbDiv.className = "fb-video";
			fbDiv.setAttribute("data-href", url);
			fbDiv.setAttribute("data-allowfullscreen", "true");
			fbDiv.setAttribute("data-controls", "false");

			mediaElement.originalNode.parentNode.insertBefore(fbDiv, mediaElement.originalNode);
			mediaElement.originalNode.style.display = 'none';

			/*
    * Register Facebook API event globally
    *
    */
			_window2.default.fbAsyncInit = function () {

				FB.init(config);

				FB.Event.subscribe('xfbml.ready', function (msg) {

					if (msg.type === 'video') {
						(function () {

							fbApi = msg.instance;

							// Set proper size since player dimensions are unknown before this event
							var fbIframe = fbDiv.getElementsByTagName('iframe')[0],
							    width = parseInt(_window2.default.getComputedStyle(fbIframe, null).width),
							    height = parseInt(fbIframe.style.height);

							fbWrapper.setSize(width, height);

							sendEvents(['mouseover', 'mouseout']);

							// remove previous listeners
							var fbEvents = ['startedPlaying', 'paused', 'finishedPlaying', 'startedBuffering', 'finishedBuffering'];
							for (i = 0, il = fbEvents.length; i < il; i++) {
								var event = fbEvents[i],
								    handler = eventHandler[event];
								if (handler !== undefined && handler !== null && !(0, _general.isObjectEmpty)(handler) && typeof handler.removeListener === 'function') {
									handler.removeListener(event);
								}
							}

							// do call stack
							if (apiStack.length) {
								for (i = 0, il = apiStack.length; i < il; i++) {

									var stackItem = apiStack[i];

									if (stackItem.type === 'set') {
										var propName = stackItem.propName,
										    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

										fbWrapper['set' + capName](stackItem.value);
									} else if (stackItem.type === 'call') {
										fbWrapper[stackItem.methodName]();
									}
								}
							}

							sendEvents(['rendererready', 'ready', 'loadeddata', 'canplay', 'progress']);
							sendEvents(['loadedmetadata', 'timeupdate', 'progress']);

							var timer = void 0;

							// Custom Facebook events
							eventHandler.startedPlaying = fbApi.subscribe('startedPlaying', function () {
								if (!hasStartedPlaying) {
									hasStartedPlaying = true;
								}
								paused = false;
								ended = false;
								sendEvents(['play', 'playing', 'timeupdate']);

								// Workaround to update progress bar
								timer = setInterval(function () {
									fbApi.getCurrentPosition();
									sendEvents(['timeupdate']);
								}, 250);
							});
							eventHandler.paused = fbApi.subscribe('paused', function () {
								paused = true;
								ended = false;
								sendEvents(['paused']);
							});
							eventHandler.finishedPlaying = fbApi.subscribe('finishedPlaying', function () {
								paused = true;
								ended = true;

								// Workaround to update progress bar one last time and trigger ended event
								timer = setInterval(function () {
									fbApi.getCurrentPosition();
									sendEvents(['timeupdate', 'ended']);
								}, 250);

								clearInterval(timer);
								timer = null;
							});
							eventHandler.startedBuffering = fbApi.subscribe('startedBuffering', function () {
								sendEvents(['progress', 'timeupdate']);
							});
							eventHandler.finishedBuffering = fbApi.subscribe('finishedBuffering', function () {
								sendEvents(['progress', 'timeupdate']);
							});
						})();
					}
				});
			};

			(function (d, s, id) {
				var js = void 0;
				var fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = '//connect.facebook.net/en_US/sdk.js';
				fjs.parentNode.insertBefore(js, fjs);
			})(_document2.default, 'script', 'facebook-jssdk');
		}

		if (mediaFiles.length > 0) {
			createFacebookEmbed(mediaFiles[0].src, fbWrapper.options.facebook);
		}

		fbWrapper.hide = function () {
			fbWrapper.stopInterval();
			fbWrapper.pause();
			if (fbDiv) {
				fbDiv.style.display = 'none';
			}
		};
		fbWrapper.show = function () {
			if (fbDiv) {
				fbDiv.style.display = '';
			}
		};
		fbWrapper.setSize = function (width, height) {
			if (fbApi !== null && !isNaN(width) && !isNaN(height)) {
				fbDiv.setAttribute('width', width);
				fbDiv.setAttribute('height', height);
			}
		};
		fbWrapper.destroy = function () {};
		fbWrapper.interval = null;

		fbWrapper.startInterval = function () {
			// create timer
			fbWrapper.interval = setInterval(function () {
				var event = (0, _dom.createEvent)('timeupdate', fbWrapper);
				mediaElement.dispatchEvent(event);
			}, 250);
		};
		fbWrapper.stopInterval = function () {
			if (fbWrapper.interval) {
				clearInterval(fbWrapper.interval);
			}
		};

		return fbWrapper;
	}
};

/**
 * Register Facebook type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('//www.facebook') ? 'video/x-facebook' : null;
});

_renderer.renderer.add(FacebookRenderer);

},{"2":2,"28":28,"29":29,"3":3,"30":30,"6":6,"7":7}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PluginDetector = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _constants = _dereq_(27);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Shim that falls back to Flash if a media type is not supported.
 *
 * Any format not supported natively, including, RTMP, FLV, HLS and M(PEG)-DASH (if browser does not support MSE),
 * will play using Flash.
 */

/**
 * Core detector, plugins are added below
 *
 */
var PluginDetector = exports.PluginDetector = {
	/**
  * Cached version numbers
  * @type {Array}
  */
	plugins: [],

	/**
  * Test a plugin version number
  * @param {String} plugin - In this scenario 'flash' will be tested
  * @param {Array} v - An array containing the version up to 3 numbers (major, minor, revision)
  * @return {Boolean}
  */
	hasPluginVersion: function hasPluginVersion(plugin, v) {
		var pv = PluginDetector.plugins[plugin];
		v[1] = v[1] || 0;
		v[2] = v[2] || 0;
		return pv[0] > v[0] || pv[0] === v[0] && pv[1] > v[1] || pv[0] === v[0] && pv[1] === v[1] && pv[2] >= v[2];
	},

	/**
  * Detect plugin and store its version number
  *
  * @see PluginDetector.detectPlugin
  * @param {String} p
  * @param {String} pluginName
  * @param {String} mimeType
  * @param {String} activeX
  * @param {Function} axDetect
  */
	addPlugin: function addPlugin(p, pluginName, mimeType, activeX, axDetect) {
		PluginDetector.plugins[p] = PluginDetector.detectPlugin(pluginName, mimeType, activeX, axDetect);
	},

	/**
  * Obtain version number from the mime-type (all but IE) or ActiveX (IE)
  *
  * @param {String} pluginName
  * @param {String} mimeType
  * @param {String} activeX
  * @param {Function} axDetect
  * @return {int[]}
  */
	detectPlugin: function detectPlugin(pluginName, mimeType, activeX, axDetect) {

		var version = [0, 0, 0],
		    description = void 0,
		    ax = void 0;

		// Firefox, Webkit, Opera
		if (_constants.NAV.plugins !== undefined && _typeof(_constants.NAV.plugins[pluginName]) === 'object') {
			description = _constants.NAV.plugins[pluginName].description;
			if (description && !(typeof _constants.NAV.mimeTypes !== 'undefined' && _constants.NAV.mimeTypes[mimeType] && !_constants.NAV.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (var i = 0; i < version.length; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
			// Internet Explorer / ActiveX
		} else if (_window2.default.ActiveXObject !== undefined) {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			} catch (e) {}
		}
		return version;
	}
};

/**
 * Add Flash detection
 *
 */
PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
	// adapted from SWFObject
	var version = [],
	    d = ax.GetVariable("$version");
	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

var FlashMediaElementRenderer = {

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var flash = {},
		    i = void 0,
		    il = void 0;

		// store main variable
		flash.options = options;
		flash.id = mediaElement.id + '_' + flash.options.prefix;
		flash.mediaElement = mediaElement;

		// insert data
		flash.flashState = {};
		flash.flashApi = null;
		flash.flashApiStack = [];

		// mediaElements for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			// add to flash state that we will store
			flash.flashState[propName] = null;

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			flash['get' + capName] = function () {

				if (flash.flashApi !== null) {

					if (flash.flashApi['get_' + propName] !== undefined) {
						var _ret = function () {
							var value = flash.flashApi['get_' + propName]();

							// special case for buffered to conform to HTML5's newest
							if (propName === 'buffered') {
								return {
									v: {
										start: function start() {
											return 0;
										},
										end: function end() {
											return value;
										},
										length: 1
									}
								};
							}

							return {
								v: value
							};
						}();

						if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
					} else {
						return null;
					}
				} else {
					return null;
				}
			};

			flash['set' + capName] = function (value) {
				if (propName === 'src') {
					value = (0, _media.absolutizeUrl)(value);
				}

				// send value to Flash
				if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
					flash.flashApi['set_' + propName](value);
				} else {
					// store for after "READY" event fires
					flash.flashApiStack.push({
						type: 'set',
						propName: propName,
						value: value
					});
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add mediaElements for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the native HTMLMediaElement
			flash[methodName] = function () {

				if (flash.flashApi !== null) {

					// send call up to Flash ExternalInterface API
					if (flash.flashApi['fire_' + methodName]) {
						try {
							flash.flashApi['fire_' + methodName]();
						} catch (e) {
							
						}
					} else {
						
					}
				} else {
					// store for after "READY" event fires
					flash.flashApiStack.push({
						type: 'call',
						methodName: methodName
					});
				}
			};
		};
		methods.push('stop');
		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// add a ready method that Flash can call to
		_window2.default['__ready__' + flash.id] = function () {

			flash.flashReady = true;
			flash.flashApi = _document2.default.getElementById('__' + flash.id);

			var event = (0, _dom.createEvent)('rendererready', flash);
			mediaElement.dispatchEvent(event);

			// do call stack
			if (flash.flashApiStack.length) {
				for (var _i = 0, _il = flash.flashApiStack.length; _i < _il; _i++) {

					var stackItem = flash.flashApiStack[_i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						flash['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			}
		};

		_window2.default['__event__' + flash.id] = function (eventName, message) {

			var event = (0, _dom.createEvent)(eventName, flash);
			event.message = message || '';

			// send event from Flash up to the mediaElement
			flash.mediaElement.dispatchEvent(event);
		};

		// insert Flash object
		flash.flashWrapper = _document2.default.createElement('div');

		var autoplay = !!mediaElement.getAttribute('autoplay'),
		    flashVars = ['uid=' + flash.id, 'autoplay=' + autoplay],
		    isVideo = mediaElement.originalNode !== null && mediaElement.originalNode.tagName.toLowerCase() === 'video',
		    flashHeight = isVideo ? mediaElement.originalNode.height : 1,
		    flashWidth = isVideo ? mediaElement.originalNode.width : 1;

		if (flash.options.enablePseudoStreaming === true) {
			flashVars.push('pseudostreamstart=' + flash.options.pseudoStreamingStartQueryParam);
			flashVars.push('pseudostreamtype=' + flash.options.pseudoStreamingType);
		}

		mediaElement.appendChild(flash.flashWrapper);

		if (isVideo && mediaElement.originalNode !== null) {
			mediaElement.originalNode.style.display = 'none';
		}

		var settings = [];

		if (_constants.IS_IE) {
			var specialIEContainer = _document2.default.createElement('div');
			flash.flashWrapper.appendChild(specialIEContainer);

			settings = ['classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"', 'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"', 'id="__' + flash.id + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '"'];

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			specialIEContainer.outerHTML = '<object ' + settings.join(' ') + '>' + ('<param name="movie" value="' + flash.options.pluginPath + flash.options.filename + '?x=' + new Date() + '" />') + ('<param name="flashvars" value="' + flashVars.join('&amp;') + '" />') + '<param name="quality" value="high" />' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="transparent" />' + '<param name="allowScriptAccess" value="always" />' + '<param name="allowFullScreen" value="true" />' + ('<div>' + _i18n2.default.t('mejs.install-flash') + '</div>') + '</object>';
		} else {

			settings = ['id="__' + flash.id + '"', 'name="__' + flash.id + '"', 'play="true"', 'loop="false"', 'quality="high"', 'bgcolor="#000000"', 'wmode="transparent"', 'allowScriptAccess="always"', 'allowFullScreen="true"', 'type="application/x-shockwave-flash"', 'pluginspage="//www.macromedia.com/go/getflashplayer"', 'src="' + flash.options.pluginPath + flash.options.filename + '"', 'flashvars="' + flashVars.join('&') + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '"'];

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			flash.flashWrapper.innerHTML = '<embed ' + settings.join(' ') + '>';
		}

		flash.flashNode = flash.flashWrapper.lastChild;

		flash.hide = function () {
			if (isVideo) {
				flash.flashNode.style.position = 'absolute';
				flash.flashNode.style.width = '1px';
				flash.flashNode.style.height = '1px';
				try {
					flash.flashNode.style.clip = 'rect(0 0 0 0);';
				} catch (e) {}
			}
		};
		flash.show = function () {
			if (isVideo) {
				flash.flashNode.style.position = '';
				flash.flashNode.style.width = '';
				flash.flashNode.style.height = '';
				try {
					flash.flashNode.style.clip = '';
				} catch (e) {}
			}
		};
		flash.setSize = function (width, height) {
			flash.flashNode.style.width = width + 'px';
			flash.flashNode.style.height = height + 'px';

			if (flash.flashApi !== null) {
				flash.flashApi.fire_setSize(width, height);
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					flash.setSrc(mediaFiles[i].src);
					flash.load();
					break;
				}
			}
		}

		return flash;
	}
};

var hasFlash = PluginDetector.hasPluginVersion('flash', [10, 0, 0]);

if (hasFlash) {

	/**
  * Register media type based on URL structure if Flash is detected
  *
  */
	_media.typeChecks.push(function (url) {

		url = url.toLowerCase();

		if (url.startsWith('rtmp')) {
			if (url.includes('.mp3')) {
				return 'audio/rtmp';
			} else {
				return 'video/rtmp';
			}
		} else if (url.includes('.oga') || url.includes('.ogg')) {
			return 'audio/ogg';
		} else if (!_constants.HAS_MSE && !_constants.SUPPORTS_NATIVE_HLS && url.includes('.m3u8')) {
			return 'application/x-mpegURL';
		} else if (!_constants.HAS_MSE && url.includes('.mpd')) {
			return 'application/dash+xml';
		} else {
			return null;
		}
	});

	// VIDEO
	var FlashMediaElementVideoRenderer = {
		name: 'flash_video',

		options: {
			prefix: 'flash_video',
			filename: 'mediaelement-flash-video.swf',
			enablePseudoStreaming: false,
			// start query parameter sent to server for pseudo-streaming
			pseudoStreamingStartQueryParam: 'start',
			// pseudo streaming type: use `time` for time based seeking (MP4) or `byte` for file byte position (FLV)
			pseudoStreamingType: 'byte'
		},
		/**
   * Determine if a specific element type can be played with this render
   *
   * @param {String} type
   * @return {Boolean}
   */
		canPlayType: function canPlayType(type) {
			return hasFlash && ['video/mp4', 'video/flv', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4'].includes(type);
		},

		create: FlashMediaElementRenderer.create

	};
	_renderer.renderer.add(FlashMediaElementVideoRenderer);

	// HLS
	var FlashMediaElementHlsVideoRenderer = {
		name: 'flash_hls',

		options: {
			prefix: 'flash_hls',
			filename: 'mediaelement-flash-video-hls.swf'
		},
		/**
   * Determine if a specific element type can be played with this render
   *
   * @param {String} type
   * @return {Boolean}
   */
		canPlayType: function canPlayType(type) {
			return !_constants.HAS_MSE && hasFlash && ['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].includes(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementHlsVideoRenderer);

	// M(PEG)-DASH
	var FlashMediaElementMdashVideoRenderer = {
		name: 'flash_dash',

		options: {
			prefix: 'flash_dash',
			filename: 'mediaelement-flash-video-mdash.swf'
		},
		/**
   * Determine if a specific element type can be played with this render
   *
   * @param {String} type
   * @return {Boolean}
   */
		canPlayType: function canPlayType(type) {
			return !_constants.HAS_MSE && hasFlash && ['application/dash+xml'].includes(type);
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementMdashVideoRenderer);

	// AUDIO
	var FlashMediaElementAudioRenderer = {
		name: 'flash_audio',

		options: {
			prefix: 'flash_audio',
			filename: 'mediaelement-flash-audio.swf'
		},
		/**
   * Determine if a specific element type can be played with this render
   *
   * @param {String} type
   * @return {Boolean}
   */
		canPlayType: function canPlayType(type) {
			return hasFlash && ['audio/mp3'].includes(type);
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioRenderer);

	// AUDIO - ogg
	var FlashMediaElementAudioOggRenderer = {
		name: 'flash_audio_ogg',

		options: {
			prefix: 'flash_audio_ogg',
			filename: 'mediaelement-flash-audio-ogg.swf'
		},
		/**
   * Determine if a specific element type can be played with this render
   *
   * @param {String} type
   * @return {Boolean}
   */
		canPlayType: function canPlayType(type) {
			return hasFlash && ['audio/ogg', 'audio/oga', 'audio/ogv'].includes(type);
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioOggRenderer);
}

},{"2":2,"27":27,"28":28,"3":3,"30":30,"4":4,"6":6,"7":7}],21:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _constants = _dereq_(27);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Native FLV renderer
 *
 * Uses flv.js, which is a JavaScript library which implements mechanisms to play flv files inspired by flv.js.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * Currently, it can only play files with the same origin.
 *
 * @see https://github.com/Bilibili/flv.js
 *
 */
var NativeFlv = {
	/**
  * @type {Boolean}
  */
	isMediaStarted: false,
	/**
  * @type {Boolean}
  */
	isMediaLoaded: false,
	/**
  * @type {Array}
  */
	creationQueue: [],

	/**
  * Create a queue to prepare the loading of an FLV source
  * @param {Object} settings - an object with settings needed to load an FLV player instance
  */
	prepareSettings: function prepareSettings(settings) {
		if (NativeFlv.isLoaded) {
			NativeFlv.createInstance(settings);
		} else {
			NativeFlv.loadScript(settings);
			NativeFlv.creationQueue.push(settings);
		}
	},

	/**
  * Load flv.js script on the header of the document
  *
  * @param {Object} settings - an object with settings needed to load an FLV player instance
  */
	loadScript: function loadScript(settings) {
		if (!NativeFlv.isMediaStarted) {

			if (typeof flvjs !== 'undefined') {
				NativeFlv.createInstance(settings);
			} else {
				(function () {

					settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : '//cdnjs.cloudflare.com/ajax/libs/flv.js/1.1.0/flv.min.js';

					var script = _document2.default.createElement('script'),
					    firstScriptTag = _document2.default.getElementsByTagName('script')[0],
					    done = false;

					script.src = settings.options.path;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function () {
						if (!done && (!this.readyState || this.readyState === undefined || this.readyState === 'loaded' || this.readyState === 'complete')) {
							done = true;
							NativeFlv.mediaReady();
							script.onload = script.onreadystatechange = null;
						}
					};

					firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				})();
			}
			NativeFlv.isMediaStarted = true;
		}
	},

	/**
  * Process queue of FLV player creation
  *
  */
	mediaReady: function mediaReady() {
		NativeFlv.isLoaded = true;
		NativeFlv.isMediaLoaded = true;

		while (NativeFlv.creationQueue.length > 0) {
			var settings = NativeFlv.creationQueue.pop();
			NativeFlv.createInstance(settings);
		}
	},

	/**
  * Create a new instance of FLV player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to instantiate FLV object
  */
	createInstance: function createInstance(settings) {
		var player = flvjs.createPlayer(settings.options);
		_window2.default['__ready__' + settings.id](player);
	}
};

var FlvNativeRenderer = {
	name: 'native_flv',

	options: {
		prefix: 'native_flv',
		/**
   * Custom configuration for FLV player
   *
   * @see https://github.com/Bilibili/flv.js/blob/master/docs/api.md#config
   * @type {Object}
   */
		flv: {
			// Special config: used to set the local path/URL of flv.js library
			path: '//cdnjs.cloudflare.com/ajax/libs/flv.js/1.1.0/flv.min.js',
			cors: true,
			enableWorker: false,
			enableStashBuffer: true,
			stashInitialSize: undefined,
			isLive: false,
			lazyLoad: true,
			lazyLoadMaxDuration: 3 * 60,
			deferLoadAfterSourceOpen: true,
			statisticsInfoReportInterval: 600,
			accurateSeek: false,
			seekType: 'range', // [range, param, custom]
			seekParamStart: 'bstart',
			seekParamEnd: 'bend',
			rangeLoadZeroStart: false,
			customSeekHandler: undefined
		}
	},
	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['video/x-flv', 'video/flv'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var node = null,
		    originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    flvPlayer = void 0,
		    stack = {},
		    i = void 0,
		    il = void 0;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		// WRAPPERS for PROPs
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return flvPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (flvPlayer !== null) {
					node[propName] = value;

					if (propName === 'src') {
						flvPlayer.detachMediaElement();
						flvPlayer.attachMediaElement(node);
						flvPlayer.load();
					}
				} else {
					// store for after "READY" event fires
					stack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all FLV events
		_window2.default['__ready__' + id] = function (_flvPlayer) {

			mediaElement.flvPlayer = flvPlayer = _flvPlayer;

			// do call stack
			if (stack.length) {
				for (i = 0, il = stack.length; i < il; i++) {

					var stackItem = stack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						node['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						node[stackItem.methodName]();
					}
				}
			}

			// BUBBLE EVENTS
			var events = _mejs2.default.html5media.events,
			    assignEvents = function assignEvents(eventName) {

				if (eventName === 'loadedmetadata') {

					flvPlayer.detachMediaElement();
					flvPlayer.attachMediaElement(node);
					flvPlayer.load();
				}

				node.addEventListener(eventName, function (e) {
					var event = _document2.default.createEvent('HTMLEvents');
					event.initEvent(e.type, e.bubbles, e.cancelable);
					// event.srcElement = e.srcElement;
					// event.target = e.srcElement;
					mediaElement.dispatchEvent(event);
				});
			};

			events = events.concat(['click', 'mouseover', 'mouseout']);

			for (i = 0, il = events.length; i < il; i++) {
				assignEvents(events[i]);
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		// Options that cannot be overridden
		options.flv.type = 'flv';
		options.flv.url = node.getAttribute('src');

		NativeFlv.prepareSettings({
			options: options.flv,
			id: id
		});

		// HELPER METHODS
		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			flvPlayer.destroy();
		};

		var event = (0, _dom.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native FLV type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('.flv') ? 'video/flv' : null;
});

_renderer.renderer.add(FlvNativeRenderer);

},{"2":2,"27":27,"28":28,"3":3,"30":30,"6":6,"7":7}],22:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _constants = _dereq_(27);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Native HLS renderer
 *
 * Uses DailyMotion's hls.js, which is a JavaScript library which implements an HTTP Live Streaming client.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with m3u8 files the same way Flash version of Hls does.
 * @see https://github.com/dailymotion/hls.js
 *
 */
var NativeHls = {
	/**
  * @type {Boolean}
  */
	isMediaStarted: false,
	/**
  * @type {Boolean}
  */
	isMediaLoaded: false,
	/**
  * @type {Array}
  */
	creationQueue: [],

	/**
  * Create a queue to prepare the loading of an HLS source
  *
  * @param {Object} settings - an object with settings needed to load an HLS player instance
  */
	prepareSettings: function prepareSettings(settings) {
		if (NativeHls.isLoaded) {
			NativeHls.createInstance(settings);
		} else {
			NativeHls.loadScript(settings);
			NativeHls.creationQueue.push(settings);
		}
	},

	/**
  * Load hls.js script on the header of the document
  *
  * @param {Object} settings - an object with settings needed to load an HLS player instance
  */
	loadScript: function loadScript(settings) {
		if (!NativeHls.isMediaStarted) {

			if (typeof Hls !== 'undefined') {
				NativeHls.createInstance(settings);
			} else {
				(function () {

					settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : '//cdn.jsdelivr.net/hls.js/latest/hls.min.js';

					var script = _document2.default.createElement('script'),
					    firstScriptTag = _document2.default.getElementsByTagName('script')[0],
					    done = false;

					script.src = settings.options.path;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function () {
						if (!done && (!this.readyState || this.readyState === undefined || this.readyState === 'loaded' || this.readyState === 'complete')) {
							done = true;
							NativeHls.mediaReady();
							script.onload = script.onreadystatechange = null;
						}
					};

					firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				})();
			}
			NativeHls.isMediaStarted = true;
		}
	},

	/**
  * Process queue of HLS player creation
  *
  */
	mediaReady: function mediaReady() {
		NativeHls.isLoaded = true;
		NativeHls.isMediaLoaded = true;

		while (NativeHls.creationQueue.length > 0) {
			var settings = NativeHls.creationQueue.pop();
			NativeHls.createInstance(settings);
		}
	},

	/**
  * Create a new instance of HLS player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to instantiate HLS object
  * @return {Hls}
  */
	createInstance: function createInstance(settings) {
		var player = new Hls(settings.options);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var HlsNativeRenderer = {
	name: 'native_hls',

	options: {
		prefix: 'native_hls',
		/**
   * Custom configuration for HLS player
   *
   * @see https://github.com/dailymotion/hls.js/blob/master/API.md#user-content-fine-tuning
   * @type {Object}
   */
		hls: {
			// Special config: used to set the local path/URL of hls.js library
			path: '//cdn.jsdelivr.net/hls.js/latest/hls.min.js',
			autoStartLoad: true,
			startPosition: -1,
			capLevelToPlayerSize: false,
			debug: false,
			maxBufferLength: 30,
			maxMaxBufferLength: 600,
			maxBufferSize: 60 * 1000 * 1000,
			maxBufferHole: 0.5,
			maxSeekHole: 2,
			seekHoleNudgeDuration: 0.01,
			maxFragLookUpTolerance: 0.2,
			liveSyncDurationCount: 3,
			liveMaxLatencyDurationCount: 10,
			enableWorker: true,
			enableSoftwareAES: true,
			manifestLoadingTimeOut: 10000,
			manifestLoadingMaxRetry: 6,
			manifestLoadingRetryDelay: 500,
			manifestLoadingMaxRetryTimeout: 64000,
			levelLoadingTimeOut: 10000,
			levelLoadingMaxRetry: 6,
			levelLoadingRetryDelay: 500,
			levelLoadingMaxRetryTimeout: 64000,
			fragLoadingTimeOut: 20000,
			fragLoadingMaxRetry: 6,
			fragLoadingRetryDelay: 500,
			fragLoadingMaxRetryTimeout: 64000,
			startFragPrefech: false,
			appendErrorMaxRetry: 3,
			enableCEA708Captions: true,
			stretchShortVideoTrack: true,
			forceKeyFrameOnDiscontinuity: true,
			abrEwmaFastLive: 5.0,
			abrEwmaSlowLive: 9.0,
			abrEwmaFastVoD: 4.0,
			abrEwmaSlowVoD: 15.0,
			abrEwmaDefaultEstimate: 500000,
			abrBandWidthFactor: 0.8,
			abrBandWidthUpFactor: 0.7
		}
	},
	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].includes(type.toLowerCase());
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var node = null,
		    originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    hlsPlayer = void 0,
		    stack = {},
		    i = void 0,
		    il = void 0;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		// WRAPPERS for PROPs
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return hlsPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (hlsPlayer !== null) {
					node[propName] = value;

					if (propName === 'src') {

						hlsPlayer.destroy();
						hlsPlayer = null;
						hlsPlayer = NativeHls.createInstance({
							options: options.hls,
							id: id
						});

						hlsPlayer.attachMedia(node);
						hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function () {
							hlsPlayer.loadSource(value);
						});
					}
				} else {
					// store for after "READY" event fires
					stack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all HLS events
		_window2.default['__ready__' + id] = function (_hlsPlayer) {

			mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;

			// do call stack
			if (stack.length) {
				for (i = 0, il = stack.length; i < il; i++) {

					var stackItem = stack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						node['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						node[stackItem.methodName]();
					}
				}
			}

			// BUBBLE EVENTS
			var events = _mejs2.default.html5media.events,
			    hlsEvents = Hls.Events,
			    assignEvents = function assignEvents(eventName) {

				if (eventName === 'loadedmetadata') {
					(function () {

						hlsPlayer.detachMedia();

						var url = node.src;

						hlsPlayer.attachMedia(node);
						hlsPlayer.on(hlsEvents.MEDIA_ATTACHED, function () {
							hlsPlayer.loadSource(url);
						});
					})();
				}

				node.addEventListener(eventName, function (e) {
					// copy event
					var event = _document2.default.createEvent('HTMLEvents');
					event.initEvent(e.type, e.bubbles, e.cancelable);
					// event.srcElement = e.srcElement;
					// event.target = e.srcElement;

					mediaElement.dispatchEvent(event);
				});
			};

			events = events.concat(['click', 'mouseover', 'mouseout']);

			for (i = 0, il = events.length; i < il; i++) {
				assignEvents(events[i]);
			}

			/**
    * Custom HLS events
    *
    * These events can be attached to the original node using addEventListener and the name of the event,
    * not using Hls.Events object
    * @see https://github.com/dailymotion/hls.js/blob/master/src/events.js
    * @see https://github.com/dailymotion/hls.js/blob/master/src/errors.js
    * @see https://github.com/dailymotion/hls.js/blob/master/API.md#runtime-events
    * @see https://github.com/dailymotion/hls.js/blob/master/API.md#errors
    */
			var assignHlsEvents = function assignHlsEvents(e, data) {
				var event = (0, _dom.createEvent)(e, node);
				event.data = data;
				mediaElement.dispatchEvent(event);

				if (e === 'hlsError') {
					console.error(e, data);

					// borrowed from http://dailymotion.github.io/hls.js/demo/
					if (data.fatal) {
						hlsPlayer.destroy();
					} else {
						switch (data.type) {
							case 'mediaError':
								hlsPlayer.recoverMediaError();
								break;

							case 'networkError':
								hlsPlayer.startLoad();
								break;

						}
					}
				}
			};

			for (var eventType in hlsEvents) {
				if (hlsEvents.hasOwnProperty(eventType)) {
					hlsPlayer.on(hlsEvents[eventType], assignHlsEvents);
				}
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		NativeHls.prepareSettings({
			options: options.hls,
			id: id
		});

		// HELPER METHODS
		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			hlsPlayer.destroy();
		};

		var event = (0, _dom.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native HLS type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('.m3u8') ? 'application/x-mpegURL' : null;
});

_renderer.renderer.add(HlsNativeRenderer);

},{"2":2,"27":27,"28":28,"3":3,"30":30,"6":6,"7":7}],23:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _constants = _dereq_(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Native HTML5 Renderer
 *
 * Wraps the native HTML5 <audio> or <video> tag and bubbles its properties, events, and methods up to the mediaElement.
 */
var HtmlMediaElement = {

	name: 'html5',

	options: {
		prefix: 'html5'
	},

	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {String}
  */
	canPlayType: function canPlayType(type) {

		var mediaElement = _document2.default.createElement('video');

		// Due to an issue on Webkit, force the MP3 and MP4 on Android and consider native support for HLS
		if (_constants.IS_ANDROID && type.match(/\/mp(3|4)$/gi) !== null || ['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].includes(type.toLowerCase()) && _constants.SUPPORTS_NATIVE_HLS) {
			return 'yes';
		} else if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type).replace(/no/, '');
		} else {
			return '';
		}
	},
	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var node = null,
		    id = mediaElement.id + '_' + options.prefix,
		    i = void 0,
		    il = void 0;

		// CREATE NODE
		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {
			node = _document2.default.createElement('audio');
			mediaElement.appendChild(node);
		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		// WRAPPERS for PROPs
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return node[propName];
			};

			node['set' + capName] = function (value) {
				node[propName] = value;
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		var events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']),
		    assignEvents = function assignEvents(eventName) {

			node.addEventListener(eventName, function (e) {
				// copy event

				var event = _document2.default.createEvent('HTMLEvents');
				event.initEvent(e.type, e.bubbles, e.cancelable);
				// event.srcElement = e.srcElement;
				// event.target = e.srcElement;
				mediaElement.dispatchEvent(event);
			});
		};

		for (i = 0, il = events.length; i < il; i++) {
			assignEvents(events[i]);
		}

		// HELPER METHODS
		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = function () {
			node.style.display = 'none';

			return node;
		};

		node.show = function () {
			node.style.display = '';

			return node;
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		var event = (0, _dom.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

_window2.default.HtmlMediaElement = _mejs2.default.HtmlMediaElement = HtmlMediaElement;

_renderer.renderer.add(HtmlMediaElement);

},{"2":2,"27":27,"28":28,"3":3,"6":6,"7":7}],24:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * SoundCloud renderer
 *
 * Uses <iframe> approach and uses SoundCloud Widget API to manipulate it.
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
var SoundCloudApi = {
	/**
  * @type {Boolean}
  */
	isSDKStarted: false,
	/**
  * @type {Boolean}
  */
	isSDKLoaded: false,
	/**
  * @type {Array}
  */
	iframeQueue: [],

	/**
  * Create a queue to prepare the creation of <iframe>
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	enqueueIframe: function enqueueIframe(settings) {

		if (SoundCloudApi.isLoaded) {
			SoundCloudApi.createIframe(settings);
		} else {
			SoundCloudApi.loadIframeApi();
			SoundCloudApi.iframeQueue.push(settings);
		}
	},

	/**
  * Load SoundCloud API script on the header of the document
  *
  */
	loadIframeApi: function loadIframeApi() {
		if (!SoundCloudApi.isSDKStarted) {
			(function () {

				var head = _document2.default.getElementsByTagName("head")[0] || _document2.default.documentElement,
				    script = _document2.default.createElement("script"),
				    done = false;

				script.src = '//w.soundcloud.com/player/api.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!SoundCloudApi.readyState || SoundCloudApi.readyState === "loaded" || SoundCloudApi.readyState === "complete")) {
						done = true;
						SoundCloudApi.apiReady();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if (head && script.parentNode) {
							head.removeChild(script);
						}
					}
				};
				head.appendChild(script);
				SoundCloudApi.isSDKStarted = true;
			})();
		}
	},

	/**
  * Process queue of SoundCloud <iframe> element creation
  *
  */
	apiReady: function apiReady() {
		SoundCloudApi.isLoaded = true;
		SoundCloudApi.isSDKLoaded = true;

		while (SoundCloudApi.iframeQueue.length > 0) {
			var settings = SoundCloudApi.iframeQueue.pop();
			SoundCloudApi.createIframe(settings);
		}
	},

	/**
  * Create a new instance of SoundCloud Widget player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	createIframe: function createIframe(settings) {
		var player = SC.Widget(settings.iframe);
		_window2.default['__ready__' + settings.id](player);
	}
};

var SoundCloudIframeRenderer = {
	name: 'soundcloud_iframe',

	options: {
		prefix: 'soundcloud_iframe'
	},

	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return ['video/soundcloud', 'video/x-soundcloud'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		var sc = {};

		// store main variable
		sc.options = options;
		sc.id = mediaElement.id + '_' + options.prefix;
		sc.mediaElement = mediaElement;

		// create our fake element that allows events and such to work
		var apiStack = [],
		    scPlayerReady = false,
		    scPlayer = null,
		    scIframe = null,
		    currentTime = 0,
		    duration = 0,
		    bufferedTime = 0,
		    paused = true,
		    volume = 1,
		    muted = false,
		    ended = false,
		    i = void 0,
		    il = void 0;

		// wrappers for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			// add to flash state that we will store

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			sc['get' + capName] = function () {
				if (scPlayer !== null) {
					var value = null;

					// figure out how to get dm dta here
					switch (propName) {
						case 'currentTime':
							return currentTime;

						case 'duration':
							return duration;

						case 'volume':
							return volume;

						case 'paused':
							return paused;

						case 'ended':
							return ended;

						case 'muted':
							return muted; // ?

						case 'buffered':
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return bufferedTime * duration;
								},
								length: 1
							};
						case 'src':
							return scIframe ? scIframe.src : '';
					}

					return value;
				} else {
					return null;
				}
			};

			sc['set' + capName] = function (value) {

				if (scPlayer !== null) {

					// do something
					switch (propName) {

						case 'src':
							var url = typeof value === 'string' ? value : value[0].src;

							scPlayer.load(url);
							break;

						case 'currentTime':
							scPlayer.seekTo(value * 1000);
							break;

						case 'muted':
							if (value) {
								scPlayer.setVolume(0); // ?
							} else {
								scPlayer.setVolume(1); // ?
							}
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', sc);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						case 'volume':
							scPlayer.setVolume(value);
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', sc);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						default:
							
					}
				} else {
					// store for after "READY" event fires
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the Soundcloud API
			sc[methodName] = function () {

				if (scPlayer !== null) {

					// DO method
					switch (methodName) {
						case 'play':
							return scPlayer.play();
						case 'pause':
							return scPlayer.pause();
						case 'load':
							return null;

					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// add a ready method that SC can fire
		_window2.default['__ready__' + sc.id] = function (_scPlayer) {

			scPlayerReady = true;
			mediaElement.scPlayer = scPlayer = _scPlayer;

			// do call stack
			if (apiStack.length) {
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						sc['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						sc[stackItem.methodName]();
					}
				}
			}

			// SoundCloud properties are async, so we don't fire the event until the property callback fires
			scPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
				paused = false;
				ended = false;

				scPlayer.getPosition(function (_currentTime) {
					currentTime = _currentTime / 1000;
					var event = (0, _dom.createEvent)('timeupdate', sc);
					mediaElement.dispatchEvent(event);
				});
			});

			scPlayer.bind(SC.Widget.Events.PAUSE, function () {
				paused = true;

				var event = (0, _dom.createEvent)('pause', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.PLAY, function () {
				paused = false;
				ended = false;

				var event = (0, _dom.createEvent)('play', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.FINISHED, function () {
				paused = false;
				ended = true;

				var event = (0, _dom.createEvent)('ended', sc);
				mediaElement.dispatchEvent(event);
			});
			scPlayer.bind(SC.Widget.Events.READY, function () {
				scPlayer.getDuration(function (_duration) {
					duration = _duration / 1000;

					var event = (0, _dom.createEvent)('loadedmetadata', sc);
					mediaElement.dispatchEvent(event);
				});
			});
			scPlayer.bind(SC.Widget.Events.LOAD_PROGRESS, function () {
				scPlayer.getDuration(function (loadProgress) {
					if (duration > 0) {
						bufferedTime = duration * loadProgress;

						var event = (0, _dom.createEvent)('progress', sc);
						mediaElement.dispatchEvent(event);
					}
				});
				scPlayer.getDuration(function (_duration) {
					duration = _duration;

					var event = (0, _dom.createEvent)('loadedmetadata', sc);
					mediaElement.dispatchEvent(event);
				});
			});

			// give initial events
			var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

			for (var _i = 0, _il = initEvents.length; _i < _il; _i++) {
				var event = (0, _dom.createEvent)(initEvents[_i], sc);
				mediaElement.dispatchEvent(event);
			}
		};

		// container for API API
		scIframe = _document2.default.createElement('iframe');
		scIframe.id = sc.id;
		scIframe.width = 10;
		scIframe.height = 10;
		scIframe.frameBorder = 0;
		scIframe.style.visibility = 'hidden';
		scIframe.src = mediaFiles[0].src;
		scIframe.scrolling = 'no';

		mediaElement.appendChild(scIframe);
		mediaElement.originalNode.style.display = 'none';

		var scSettings = {
			iframe: scIframe,
			id: sc.id
		};

		SoundCloudApi.enqueueIframe(scSettings);

		sc.setSize = function (width, height) {
			// nothing here, audio only
		};
		sc.hide = function () {
			sc.pause();
			if (scIframe) {
				scIframe.style.display = 'none';
			}
		};
		sc.show = function () {
			if (scIframe) {
				scIframe.style.display = '';
			}
		};
		sc.destroy = function () {
			scPlayer.destroy();
		};

		return sc;
	}
};

/**
 * Register SoundCloud type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('//soundcloud.com') || url.includes('//w.soundcloud.com') ? 'video/x-soundcloud' : null;
});

_renderer.renderer.add(SoundCloudIframeRenderer);

},{"2":2,"28":28,"3":3,"30":30,"6":6,"7":7}],25:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Vimeo renderer
 *
 * Uses <iframe> approach and uses Vimeo API to manipulate it.
 * All Vimeo calls return a Promise so this renderer accounts for that
 * to update all the necessary values to interact with MediaElement player.
 * Note: IE8 implements ECMAScript 3 that does not allow bare keywords in dot notation;
 * that's why instead of using .catch ['catch'] is being used.
 * @see https://github.com/vimeo/player.js
 *
 */
var vimeoApi = {

	/**
  * @type {Boolean}
  */
	isIframeStarted: false,
	/**
  * @type {Boolean}
  */
	isIframeLoaded: false,
	/**
  * @type {Array}
  */
	iframeQueue: [],

	/**
  * Create a queue to prepare the creation of <iframe>
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	enqueueIframe: function enqueueIframe(settings) {

		if (vimeoApi.isLoaded) {
			vimeoApi.createIframe(settings);
		} else {
			vimeoApi.loadIframeApi();
			vimeoApi.iframeQueue.push(settings);
		}
	},

	/**
  * Load Vimeo API script on the header of the document
  *
  */
	loadIframeApi: function loadIframeApi() {

		if (!vimeoApi.isIframeStarted) {
			(function () {

				var script = _document2.default.createElement('script'),
				    firstScriptTag = _document2.default.getElementsByTagName('script')[0],
				    done = false;

				script.src = '//player.vimeo.com/api/player.js';

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function () {
					if (!done && (!vimeoApi.readyState || vimeoApi.readyState === undefined || vimeoApi.readyState === "loaded" || vimeoApi.readyState === "complete")) {
						done = true;
						vimeoApi.iFrameReady();
						script.onload = script.onreadystatechange = null;
					}
				};
				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				vimeoApi.isIframeStarted = true;
			})();
		}
	},

	/**
  * Process queue of Vimeo <iframe> element creation
  *
  */
	iFrameReady: function iFrameReady() {

		vimeoApi.isLoaded = true;
		vimeoApi.isIframeLoaded = true;

		while (vimeoApi.iframeQueue.length > 0) {
			var settings = vimeoApi.iframeQueue.pop();
			vimeoApi.createIframe(settings);
		}
	},

	/**
  * Create a new instance of Vimeo API player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	createIframe: function createIframe(settings) {
		var player = new Vimeo.Player(settings.iframe);
		_window2.default['__ready__' + settings.id](player);
	},

	/**
  * Extract numeric value from Vimeo to be loaded through API
  * Valid URL format(s):
  *  - https://player.vimeo.com/video/59777392
  *  - https://vimeo.com/59777392
  *
  * @param {String} url - Vimeo full URL to grab the number Id of the source
  * @return {int}
  */
	getVimeoId: function getVimeoId(url) {
		if (url === undefined || url === null) {
			return null;
		}

		var parts = url.split('?');

		url = parts[0];

		return parseInt(url.substring(url.lastIndexOf('/') + 1));
	},

	/**
  * Generate custom errors for Vimeo based on the API specifications
  *
  * @see https://github.com/vimeo/player.js#error
  * @param {Object} error
  * @param {Object} target
  */
	errorHandler: function errorHandler(error, target) {
		var event = (0, _dom.createEvent)('error', target);
		event.message = error.name + ': ' + error.message;
		mediaElement.dispatchEvent(event);
	}
};

var vimeoIframeRenderer = {

	name: 'vimeo_iframe',

	options: {
		prefix: 'vimeo_iframe'
	},
	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return ['video/vimeo', 'video/x-vimeo'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		// exposed object
		var apiStack = [],
		    vimeoApiReady = false,
		    vimeo = {},
		    vimeoPlayer = null,
		    paused = true,
		    volume = 1,
		    oldVolume = volume,
		    currentTime = 0,
		    bufferedTime = 0,
		    ended = false,
		    duration = 0,
		    url = "",
		    i = void 0,
		    il = void 0;

		vimeo.options = options;
		vimeo.id = mediaElement.id + '_' + options.prefix;
		vimeo.mediaElement = mediaElement;

		// wrappers for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			vimeo['get' + capName] = function () {
				if (vimeoPlayer !== null) {
					var value = null;

					switch (propName) {
						case 'currentTime':
							return currentTime;

						case 'duration':
							return duration;

						case 'volume':
							return volume;
						case 'muted':
							return volume === 0;
						case 'paused':
							return paused;

						case 'ended':
							return ended;

						case 'src':
							vimeoPlayer.getVideoUrl().then(function (_url) {
								url = _url;
							});

							return url;
						case 'buffered':
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return bufferedTime * duration;
								},
								length: 1
							};
					}

					return value;
				} else {
					return null;
				}
			};

			vimeo['set' + capName] = function (value) {

				if (vimeoPlayer !== null) {

					// do something
					switch (propName) {

						case 'src':
							var _url2 = typeof value === 'string' ? value : value[0].src,
							    videoId = vimeoApi.getVimeoId(_url2);

							vimeoPlayer.loadVideo(videoId).then(function () {
								if (mediaElement.getAttribute('autoplay')) {
									vimeoPlayer.play();
								}
							})['catch'](function (error) {
								vimeoApi.errorHandler(error, vimeo);
							});
							break;

						case 'currentTime':
							vimeoPlayer.setCurrentTime(value).then(function () {
								currentTime = value;
								setTimeout(function () {
									var event = (0, _dom.createEvent)('timeupdate', vimeo);
									mediaElement.dispatchEvent(event);
								}, 50);
							})['catch'](function (error) {
								vimeoApi.errorHandler(error, vimeo);
							});
							break;

						case 'volume':
							vimeoPlayer.setVolume(value).then(function () {
								volume = value;
								oldVolume = volume;
								setTimeout(function () {
									var event = (0, _dom.createEvent)('volumechange', vimeo);
									mediaElement.dispatchEvent(event);
								}, 50);
							})['catch'](function (error) {
								vimeoApi.errorHandler(error, vimeo);
							});
							break;

						case 'loop':
							vimeoPlayer.setLoop(value)['catch'](function (error) {
								vimeoApi.errorHandler(error, vimeo);
							});
							break;
						case 'muted':
							if (value) {
								vimeoPlayer.setVolume(0).then(function () {
									volume = 0;
									setTimeout(function () {
										var event = (0, _dom.createEvent)('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								})['catch'](function (error) {
									vimeoApi.errorHandler(error, vimeo);
								});
							} else {
								vimeoPlayer.setVolume(oldVolume).then(function () {
									volume = oldVolume;
									setTimeout(function () {
										var event = (0, _dom.createEvent)('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								})['catch'](function (error) {
									vimeoApi.errorHandler(error, vimeo);
								});
							}
							break;
						default:
							
					}
				} else {
					// store for after "READY" event fires
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the Soundcloud API
			vimeo[methodName] = function () {

				if (vimeoPlayer !== null) {

					// DO method
					switch (methodName) {
						case 'play':
							return vimeoPlayer.play();
						case 'pause':
							return vimeoPlayer.pause();
						case 'load':
							return null;

					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// Initial method to register all Vimeo events when initializing <iframe>
		_window2.default['__ready__' + vimeo.id] = function (_vimeoPlayer) {

			vimeoApiReady = true;
			mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

			// do call stack
			if (apiStack.length) {
				for (i = 0, il = apiStack.length; i < il; i++) {

					var stackItem = apiStack[i];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						vimeo['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						vimeo[stackItem.methodName]();
					}
				}
			}

			var vimeoIframe = _document2.default.getElementById(vimeo.id),
			    events = void 0;

			// a few more events
			events = ['mouseover', 'mouseout'];

			var assignEvents = function assignEvents(e) {
				var event = (0, _dom.createEvent)(e.type, vimeo);
				mediaElement.dispatchEvent(event);
			};

			for (var j in events) {
				var eventName = events[j];
				(0, _dom.addEvent)(vimeoIframe, eventName, assignEvents);
			}

			// Vimeo events
			vimeoPlayer.on('loaded', function () {

				vimeoPlayer.getDuration().then(function (loadProgress) {

					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
					}

					var event = (0, _dom.createEvent)('loadedmetadata', vimeo);
					mediaElement.dispatchEvent(event);
				})['catch'](function (error) {
					vimeoApi.errorHandler(error, vimeo);
				});
			});

			vimeoPlayer.on('progress', function () {

				paused = vimeo.mediaElement.getPaused();

				vimeoPlayer.getDuration().then(function (loadProgress) {

					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
					}

					var event = (0, _dom.createEvent)('progress', vimeo);
					mediaElement.dispatchEvent(event);
				})['catch'](function (error) {
					vimeoApi.errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('timeupdate', function () {

				paused = vimeo.mediaElement.getPaused();
				ended = false;

				vimeoPlayer.getCurrentTime().then(function (seconds) {
					currentTime = seconds;
				});

				var event = (0, _dom.createEvent)('timeupdate', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('play', function () {
				paused = false;
				ended = false;

				vimeoPlayer.play()['catch'](function (error) {
					vimeoApi.errorHandler(error, vimeo);
				});

				var event = (0, _dom.createEvent)('play', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('pause', function () {
				paused = true;
				ended = false;

				vimeoPlayer.pause()['catch'](function (error) {
					vimeoApi.errorHandler(error, vimeo);
				});

				var event = (0, _dom.createEvent)('pause', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('ended', function () {
				paused = false;
				ended = true;

				var event = (0, _dom.createEvent)('ended', vimeo);
				mediaElement.dispatchEvent(event);
			});

			// give initial events
			events = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

			for (i = 0, il = events.length; i < il; i++) {
				var event = (0, _dom.createEvent)(events[i], vimeo);
				mediaElement.dispatchEvent(event);
			}
		};

		var height = mediaElement.originalNode.height,
		    width = mediaElement.originalNode.width,
		    vimeoContainer = _document2.default.createElement('iframe'),
		    standardUrl = '//player.vimeo.com/video/' + vimeoApi.getVimeoId(mediaFiles[0].src);

		// Create Vimeo <iframe> markup
		vimeoContainer.setAttribute('id', vimeo.id);
		vimeoContainer.setAttribute('width', width);
		vimeoContainer.setAttribute('height', height);
		vimeoContainer.setAttribute('frameBorder', '0');
		vimeoContainer.setAttribute('src', standardUrl);
		vimeoContainer.setAttribute('webkitallowfullscreen', '');
		vimeoContainer.setAttribute('mozallowfullscreen', '');
		vimeoContainer.setAttribute('allowfullscreen', '');

		mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		vimeoApi.enqueueIframe({
			iframe: vimeoContainer,
			id: vimeo.id
		});

		vimeo.hide = function () {
			vimeo.pause();
			if (vimeoPlayer) {
				vimeoContainer.style.display = 'none';
			}
		};
		vimeo.setSize = function (width, height) {
			vimeoContainer.setAttribute('width', width);
			vimeoContainer.setAttribute('height', height);
		};
		vimeo.show = function () {
			if (vimeoPlayer) {
				vimeoContainer.style.display = '';
			}
		};

		return vimeo;
	}

};

/**
 * Register Vimeo type based on URL structure
 *
 */
_media.typeChecks.push(function (url) {
	url = url.toLowerCase();
	return url.includes('//player.vimeo') || url.includes('vimeo.com') ? 'video/x-vimeo' : null;
});

_renderer.renderer.add(vimeoIframeRenderer);

},{"2":2,"28":28,"3":3,"30":30,"6":6,"7":7}],26:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(28);

var _media = _dereq_(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * YouTube renderer
 *
 * Uses <iframe> approach and uses YouTube API to manipulate it.
 * Note: IE6-7 don't have postMessage so don't support <iframe> API, and IE8 doesn't fire the onReady event,
 * so it doesn't work - not sure if Google problem or not.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
var YouTubeApi = {
	/**
  * @type {Boolean}
  */
	isIframeStarted: false,
	/**
  * @type {Boolean}
  */
	isIframeLoaded: false,
	/**
  * @type {Array}
  */
	iframeQueue: [],

	/**
  * Create a queue to prepare the creation of <iframe>
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	enqueueIframe: function enqueueIframe(settings) {

		if (YouTubeApi.isLoaded) {
			YouTubeApi.createIframe(settings);
		} else {
			YouTubeApi.loadIframeApi();
			YouTubeApi.iframeQueue.push(settings);
		}
	},

	/**
  * Load YouTube API script on the header of the document
  *
  */
	loadIframeApi: function loadIframeApi() {
		if (!YouTubeApi.isIframeStarted) {
			var tag = _document2.default.createElement('script');
			tag.src = '//www.youtube.com/player_api';
			var firstScriptTag = _document2.default.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			YouTubeApi.isIframeStarted = true;
		}
	},

	/**
  * Process queue of YouTube <iframe> element creation
  *
  */
	iFrameReady: function iFrameReady() {

		YouTubeApi.isLoaded = true;
		YouTubeApi.isIframeLoaded = true;

		while (YouTubeApi.iframeQueue.length > 0) {
			var settings = YouTubeApi.iframeQueue.pop();
			YouTubeApi.createIframe(settings);
		}
	},

	/**
  * Create a new instance of YouTube API player and trigger a custom event to initialize it
  *
  * @param {Object} settings - an object with settings needed to create <iframe>
  */
	createIframe: function createIframe(settings) {
		return new YT.Player(settings.containerId, settings);
	},

	/**
  * Extract ID from YouTube's URL to be loaded through API
  * Valid URL format(s):
  * - http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
  * - http://www.youtube.com/v/VIDEO_ID?version=3
  * - http://youtu.be/Djd6tPrxc08
  * - http://www.youtube-nocookie.com/watch?feature=player_embedded&v=yyWWXSwtPP0
  *
  * @param {String} url
  * @return {string}
  */
	getYouTubeId: function getYouTubeId(url) {

		var youTubeId = "";

		if (url.indexOf('?') > 0) {
			// assuming: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
			youTubeId = YouTubeApi.getYouTubeIdFromParam(url);

			// if it's http://www.youtube.com/v/VIDEO_ID?version=3
			if (youTubeId === '') {
				youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
			}
		} else {
			youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
		}

		return youTubeId;
	},

	/**
  * Get ID from URL with format: http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0
  *
  * @param {String} url
  * @returns {string}
  */
	getYouTubeIdFromParam: function getYouTubeIdFromParam(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var youTubeId = '',
		    parts = url.split('?'),
		    parameters = parts[1].split('&');

		for (var i = 0, il = parameters.length; i < il; i++) {
			var paramParts = parameters[i].split('=');
			if (paramParts[0] === 'v') {
				youTubeId = paramParts[1];
				break;
			}
		}

		return youTubeId;
	},

	/**
  * Get ID from URL with formats
  *  - http://www.youtube.com/v/VIDEO_ID?version=3
  *  - http://youtu.be/Djd6tPrxc08
  * @param {String} url
  * @return {?String}
  */
	getYouTubeIdFromUrl: function getYouTubeIdFromUrl(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];
		return url.substring(url.lastIndexOf('/') + 1);
	},

	/**
  * Inject `no-cookie` element to URL. Only works with format: http://www.youtube.com/v/VIDEO_ID?version=3
  * @param {String} url
  * @return {?String}
  */
	getYouTubeNoCookieUrl: function getYouTubeNoCookieUrl(url) {
		if (url === undefined || url === null || !url.trim().length || !url.includes('//www.youtube')) {
			return url;
		}

		var parts = url.split('/');
		parts[2] = parts[2].replace('.com', '-nocookie.com');
		return parts.join('/');
	}
};

var YouTubeIframeRenderer = {
	name: 'youtube_iframe',

	options: {
		prefix: 'youtube_iframe',
		/**
   * Custom configuration for YouTube player
   *
   * @see https://developers.google.com/youtube/player_parameters#Parameters
   * @type {Object}
   */
		youtube: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			end: 0,
			loop: 0,
			modestbranding: 0,
			playsinline: 0,
			rel: 0,
			showinfo: 0,
			start: 0,
			// custom to inject `-nocookie` element in URL
			nocookie: false
		}
	},

	/**
  * Determine if a specific element type can be played with this render
  *
  * @param {String} type
  * @return {Boolean}
  */
	canPlayType: function canPlayType(type) {
		return ['video/youtube', 'video/x-youtube'].includes(type);
	},

	/**
  * Create the player instance and add all native events/methods/properties as possible
  *
  * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
  * @param {Object} options All the player configuration options passed through constructor
  * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
  * @return {Object}
  */
	create: function create(mediaElement, options, mediaFiles) {

		// exposed object
		var youtube = {};
		youtube.options = options;
		youtube.id = mediaElement.id + '_' + options.prefix;
		youtube.mediaElement = mediaElement;

		// API objects
		var apiStack = [],
		    youTubeApi = null,
		    youTubeApiReady = false,
		    paused = true,
		    ended = false,
		    youTubeIframe = null,
		    i = void 0,
		    il = void 0;

		// wrappers for get/set
		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			// add to flash state that we will store

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			youtube['get' + capName] = function () {
				if (youTubeApi !== null) {
					var value = null;

					// figure out how to get youtube dta here

					var _ret = function () {
						switch (propName) {
							case 'currentTime':
								return {
									v: youTubeApi.getCurrentTime()
								};

							case 'duration':
								return {
									v: youTubeApi.getDuration()
								};

							case 'volume':
								return {
									v: youTubeApi.getVolume()
								};

							case 'paused':
								return {
									v: paused
								};

							case 'ended':
								return {
									v: ended
								};

							case 'muted':
								return {
									v: youTubeApi.isMuted()
								}; // ?

							case 'buffered':
								var percentLoaded = youTubeApi.getVideoLoadedFraction(),
								    duration = youTubeApi.getDuration();
								return {
									v: {
										start: function start() {
											return 0;
										},
										end: function end() {
											return percentLoaded * duration;
										},
										length: 1
									}
								};
							case 'src':
								return {
									v: youTubeApi.getVideoUrl()
								};
						}
					}();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
					return value;
				} else {
					return null;
				}
			};

			youtube['set' + capName] = function (value) {

				if (youTubeApi !== null) {

					// do something
					switch (propName) {

						case 'src':
							var url = typeof value === 'string' ? value : value[0].src,
							    _videoId = YouTubeApi.getYouTubeId(url);

							if (mediaElement.getAttribute('autoplay')) {
								youTubeApi.loadVideoById(_videoId);
							} else {
								youTubeApi.cueVideoById(_videoId);
							}
							break;

						case 'currentTime':
							youTubeApi.seekTo(value);
							break;

						case 'muted':
							if (value) {
								youTubeApi.mute(); // ?
							} else {
								youTubeApi.unMute(); // ?
							}
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						case 'volume':
							youTubeApi.setVolume(value);
							setTimeout(function () {
								var event = (0, _dom.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;

						default:
							
					}
				} else {
					// store for after "READY" event fires
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		// add wrappers for native methods
		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {

			// run the method on the native HTMLMediaElement
			youtube[methodName] = function () {

				if (youTubeApi !== null) {

					// DO method
					switch (methodName) {
						case 'play':
							return youTubeApi.playVideo();
						case 'pause':
							return youTubeApi.pauseVideo();
						case 'load':
							return null;

					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (i = 0, il = methods.length; i < il; i++) {
			assignMethods(methods[i]);
		}

		// CREATE YouTube
		var youtubeContainer = _document2.default.createElement('div');
		youtubeContainer.id = youtube.id;

		// If `nocookie` feature was enabled, modify original URL
		if (youtube.options.youtube.nocookie) {
			mediaElement.originalNode.setAttribute('src', YouTubeApi.getYouTubeNoCookieUrl(mediaFiles[0].src));
		}

		mediaElement.originalNode.parentNode.insertBefore(youtubeContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		var height = mediaElement.originalNode.height,
		    width = mediaElement.originalNode.width,
		    videoId = YouTubeApi.getYouTubeId(mediaFiles[0].src),
		    youtubeSettings = {
			id: youtube.id,
			containerId: youtubeContainer.id,
			videoId: videoId,
			height: height,
			width: width,
			playerVars: Object.assign({
				controls: 0,
				rel: 0,
				disablekb: 1,
				showinfo: 0,
				modestbranding: 0,
				html5: 1,
				playsinline: 0,
				start: 0,
				end: 0
			}, youtube.options.youtube),
			origin: _window2.default.location.host,
			events: {
				onReady: function onReady(e) {

					youTubeApiReady = true;
					mediaElement.youTubeApi = youTubeApi = e.target;
					mediaElement.youTubeState = {
						paused: true,
						ended: false
					};

					// do call stack
					if (apiStack.length) {
						for (i = 0, il = apiStack.length; i < il; i++) {

							var stackItem = apiStack[i];

							if (stackItem.type === 'set') {
								var propName = stackItem.propName,
								    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

								youtube['set' + capName](stackItem.value);
							} else if (stackItem.type === 'call') {
								youtube[stackItem.methodName]();
							}
						}
					}

					// a few more events
					youTubeIframe = youTubeApi.getIframe();

					var events = ['mouseover', 'mouseout'],
					    assignEvents = function assignEvents(e) {

						var newEvent = (0, _dom.createEvent)(e.type, youtube);
						mediaElement.dispatchEvent(newEvent);
					};

					for (var j in events) {
						(0, _dom.addEvent)(youTubeIframe, events[j], assignEvents);
					}

					// send init events
					var initEvents = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];

					for (i = 0, il = initEvents.length; i < il; i++) {
						var event = (0, _dom.createEvent)(initEvents[i], youtube);
						mediaElement.dispatchEvent(event);
					}
				},
				onStateChange: function onStateChange(e) {

					// translate events
					var events = [];

					switch (e.data) {
						case -1:
							// not started
							events = ['loadedmetadata'];
							paused = true;
							ended = false;
							break;

						case 0:
							// YT.PlayerState.ENDED
							events = ['ended'];
							paused = false;
							ended = true;

							youtube.stopInterval();
							break;

						case 1:
							// YT.PlayerState.PLAYING
							events = ['play', 'playing'];
							paused = false;
							ended = false;

							youtube.startInterval();

							break;

						case 2:
							// YT.PlayerState.PAUSED
							events = ['paused'];
							paused = true;
							ended = false;

							youtube.stopInterval();
							break;

						case 3:
							// YT.PlayerState.BUFFERING
							events = ['progress'];
							paused = false;
							ended = false;

							break;
						case 5:
							// YT.PlayerState.CUED
							events = ['loadeddata', 'loadedmetadata', 'canplay'];
							paused = true;
							ended = false;

							break;
					}

					// send events up
					for (var _i = 0, _il = events.length; _i < _il; _i++) {
						var event = (0, _dom.createEvent)(events[_i], youtube);
						mediaElement.dispatchEvent(event);
					}
				}
			}
		};

		// send it off for async loading and creation
		YouTubeApi.enqueueIframe(youtubeSettings);

		youtube.onEvent = function (eventName, player, _youTubeState) {
			if (_youTubeState !== null && _youTubeState !== undefined) {
				mediaElement.youTubeState = _youTubeState;
			}
		};

		youtube.setSize = function (width, height) {
			if (youTubeApi !== null) {
				youTubeApi.setSize(width, height);
			}
		};
		youtube.hide = function () {
			youtube.stopInterval();
			youtube.pause();
			if (youTubeIframe) {
				youTubeIframe.style.display = 'none';
			}
		};
		youtube.show = function () {
			if (youTubeIframe) {
				youTubeIframe.style.display = '';
			}
		};
		youtube.destroy = function () {
			youTubeApi.destroy();
		};
		youtube.interval = null;

		youtube.startInterval = function () {
			// create timer
			youtube.interval = setInterval(function () {

				var event = (0, _dom.createEvent)('timeupdate', youtube);
				mediaElement.dispatchEvent(event);
			}, 250);
		};
		youtube.stopInterval = function () {
			if (youtube.interval) {
				clearInterval(youtube.interval);
			}
		};

		return youtube;
	}
};

if (_window2.default.postMessage && _typeof(_window2.default.addEventListener)) {

	_window2.default.onYouTubePlayerAPIReady = function () {
		YouTubeApi.iFrameReady();
	};

	_media.typeChecks.push(function (url) {
		url = url.toLowerCase();
		return url.includes('//www.youtube') || url.includes('//youtu.be') ? 'video/x-youtube' : null;
	});

	_renderer.renderer.add(YouTubeIframeRenderer);
}

},{"2":2,"28":28,"3":3,"30":30,"6":6,"7":7}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cancelFullScreen = exports.requestFullScreen = exports.isFullScreen = exports.FULLSCREEN_EVENT_NAME = exports.HAS_NATIVE_FULLSCREEN_ENABLED = exports.HAS_TRUE_NATIVE_FULLSCREEN = exports.HAS_IOS_FULLSCREEN = exports.HAS_MS_NATIVE_FULLSCREEN = exports.HAS_MOZ_NATIVE_FULLSCREEN = exports.HAS_WEBKIT_NATIVE_FULLSCREEN = exports.HAS_NATIVE_FULLSCREEN = exports.SUPPORTS_NATIVE_HLS = exports.SUPPORTS_MEDIA_TAG = exports.SUPPORT_POINTER_EVENTS = exports.HAS_MSE = exports.HAS_TOUCH = exports.IS_STOCK_ANDROID = exports.IS_SAFARI = exports.IS_FIREFOX = exports.IS_CHROME = exports.IS_IE = exports.IS_ANDROID = exports.IS_IOS = exports.IS_IPHONE = exports.IS_IPAD = exports.UA = exports.NAV = undefined;

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NAV = exports.NAV = _window2.default.navigator;
var UA = exports.UA = NAV.userAgent.toLowerCase();

var IS_IPAD = exports.IS_IPAD = UA.match(/ipad/i) !== null;
var IS_IPHONE = exports.IS_IPHONE = UA.match(/iphone/i) !== null;
var IS_IOS = exports.IS_IOS = IS_IPHONE || IS_IPAD;
var IS_ANDROID = exports.IS_ANDROID = UA.match(/android/i) !== null;
var IS_IE = exports.IS_IE = NAV.appName.toLowerCase().includes('microsoft') || NAV.appName.toLowerCase().match(/trident/gi) !== null;
var IS_CHROME = exports.IS_CHROME = UA.match(/chrome/gi) !== null;
var IS_FIREFOX = exports.IS_FIREFOX = UA.match(/firefox/gi) !== null;
var IS_SAFARI = exports.IS_SAFARI = UA.match(/safari/gi) !== null && !IS_CHROME;
var IS_STOCK_ANDROID = exports.IS_STOCK_ANDROID = UA.match(/^mozilla\/\d+\.\d+\s\(linux;\su;/gi) !== null;

var HAS_TOUCH = exports.HAS_TOUCH = !!('ontouchstart' in _window2.default || _window2.default.DocumentTouch && _document2.default instanceof _window2.default.DocumentTouch);
var HAS_MSE = exports.HAS_MSE = 'MediaSource' in _window2.default;
var SUPPORT_POINTER_EVENTS = exports.SUPPORT_POINTER_EVENTS = function () {
	var element = _document2.default.createElement('x'),
	    documentElement = _document2.default.documentElement,
	    getComputedStyle = _window2.default.getComputedStyle,
	    supports = void 0;

	if (!('pointerEvents' in element.style)) {
		return false;
	}

	element.style.pointerEvents = 'auto';
	element.style.pointerEvents = 'x';
	documentElement.appendChild(element);
	supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
	documentElement.removeChild(element);
	return !!supports;
}();

// for IE
var html5Elements = ['source', 'track', 'audio', 'video'],
    video = void 0;

for (var i = 0, il = html5Elements.length; i < il; i++) {
	video = _document2.default.createElement(html5Elements[i]);
}

// Test if Media Source Extensions are supported by browser
var SUPPORTS_MEDIA_TAG = exports.SUPPORTS_MEDIA_TAG = video.canPlayType !== undefined || HAS_MSE;

// Test if browsers support HLS natively (right now Safari, Android's Chrome and Stock browsers, and MS Edge)
var SUPPORTS_NATIVE_HLS = exports.SUPPORTS_NATIVE_HLS = IS_SAFARI || IS_ANDROID && (IS_CHROME || IS_STOCK_ANDROID) || IS_IE && UA.match(/edge/gi) !== null;

// Detect native JavaScript fullscreen (Safari/Firefox only, Chrome still fails)

// iOS
var hasiOSFullScreen = video.webkitEnterFullscreen !== undefined;

// W3C
var hasNativeFullscreen = video.requestFullscreen !== undefined;

// OS X 10.5 can't do this even if it says it can :(
if (hasiOSFullScreen && UA.match(/mac os x 10_5/i)) {
	hasNativeFullscreen = false;
	hasiOSFullScreen = false;
}

// webkit/firefox/IE11+
var hasWebkitNativeFullScreen = video.webkitRequestFullScreen !== undefined;
var hasMozNativeFullScreen = video.mozRequestFullScreen !== undefined;
var hasMsNativeFullScreen = video.msRequestFullscreen !== undefined;

var hasTrueNativeFullScreen = hasWebkitNativeFullScreen || hasMozNativeFullScreen || hasMsNativeFullScreen;
var nativeFullScreenEnabled = hasTrueNativeFullScreen;

var fullScreenEventName = '';
var isFullScreen = void 0,
    requestFullScreen = void 0,
    cancelFullScreen = void 0;

// Enabled?
if (hasMozNativeFullScreen) {
	nativeFullScreenEnabled = _document2.default.mozFullScreenEnabled;
} else if (hasMsNativeFullScreen) {
	nativeFullScreenEnabled = _document2.default.msFullscreenEnabled;
}

if (IS_CHROME) {
	hasiOSFullScreen = false;
}

if (hasTrueNativeFullScreen) {

	if (hasWebkitNativeFullScreen) {
		fullScreenEventName = 'webkitfullscreenchange';
	} else if (hasMozNativeFullScreen) {
		fullScreenEventName = 'mozfullscreenchange';
	} else if (hasMsNativeFullScreen) {
		fullScreenEventName = 'MSFullscreenChange';
	}

	exports.isFullScreen = isFullScreen = function isFullScreen() {
		if (hasMozNativeFullScreen) {
			return _document2.default.mozFullScreen;
		} else if (hasWebkitNativeFullScreen) {
			return _document2.default.webkitIsFullScreen;
		} else if (hasMsNativeFullScreen) {
			return _document2.default.msFullscreenElement !== null;
		}
	};

	exports.requestFullScreen = requestFullScreen = function requestFullScreen(el) {

		if (hasWebkitNativeFullScreen) {
			el.webkitRequestFullScreen();
		} else if (hasMozNativeFullScreen) {
			el.mozRequestFullScreen();
		} else if (hasMsNativeFullScreen) {
			el.msRequestFullscreen();
		}
	};

	exports.cancelFullScreen = cancelFullScreen = function cancelFullScreen() {
		if (hasWebkitNativeFullScreen) {
			_document2.default.webkitCancelFullScreen();
		} else if (hasMozNativeFullScreen) {
			_document2.default.mozCancelFullScreen();
		} else if (hasMsNativeFullScreen) {
			_document2.default.msExitFullscreen();
		}
	};
}

var HAS_NATIVE_FULLSCREEN = exports.HAS_NATIVE_FULLSCREEN = hasNativeFullscreen;
var HAS_WEBKIT_NATIVE_FULLSCREEN = exports.HAS_WEBKIT_NATIVE_FULLSCREEN = hasWebkitNativeFullScreen;
var HAS_MOZ_NATIVE_FULLSCREEN = exports.HAS_MOZ_NATIVE_FULLSCREEN = hasMozNativeFullScreen;
var HAS_MS_NATIVE_FULLSCREEN = exports.HAS_MS_NATIVE_FULLSCREEN = hasMsNativeFullScreen;
var HAS_IOS_FULLSCREEN = exports.HAS_IOS_FULLSCREEN = hasiOSFullScreen;
var HAS_TRUE_NATIVE_FULLSCREEN = exports.HAS_TRUE_NATIVE_FULLSCREEN = hasTrueNativeFullScreen;
var HAS_NATIVE_FULLSCREEN_ENABLED = exports.HAS_NATIVE_FULLSCREEN_ENABLED = nativeFullScreenEnabled;
var FULLSCREEN_EVENT_NAME = exports.FULLSCREEN_EVENT_NAME = fullScreenEventName;

exports.isFullScreen = isFullScreen;
exports.requestFullScreen = requestFullScreen;
exports.cancelFullScreen = cancelFullScreen;


_mejs2.default.Features = _mejs2.default.Features || {};
_mejs2.default.Features.isiPad = IS_IPAD;
_mejs2.default.Features.isiPhone = IS_IPHONE;
_mejs2.default.Features.isiOS = _mejs2.default.Features.isiPhone || _mejs2.default.Features.isiPad;
_mejs2.default.Features.isAndroid = IS_ANDROID;
_mejs2.default.Features.isIE = IS_IE;
_mejs2.default.Features.isChrome = IS_CHROME;
_mejs2.default.Features.isFirefox = IS_FIREFOX;
_mejs2.default.Features.isSafari = IS_SAFARI;
_mejs2.default.Features.isStockAndroid = IS_STOCK_ANDROID;
_mejs2.default.Features.hasTouch = HAS_TOUCH;
_mejs2.default.Features.hasMSE = HAS_MSE;
_mejs2.default.Features.supportsMediaTag = SUPPORTS_MEDIA_TAG;
_mejs2.default.Features.supportsNativeHLS = SUPPORTS_NATIVE_HLS;

_mejs2.default.Features.supportsPointerEvents = SUPPORT_POINTER_EVENTS;
_mejs2.default.Features.hasiOSFullScreen = HAS_IOS_FULLSCREEN;
_mejs2.default.Features.hasNativeFullscreen = HAS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasWebkitNativeFullScreen = HAS_WEBKIT_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMozNativeFullScreen = HAS_MOZ_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMsNativeFullScreen = HAS_MS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasTrueNativeFullScreen = HAS_TRUE_NATIVE_FULLSCREEN;
_mejs2.default.Features.nativeFullScreenEnabled = HAS_NATIVE_FULLSCREEN_ENABLED;
_mejs2.default.Features.fullScreenEventName = FULLSCREEN_EVENT_NAME;
_mejs2.default.Features.isFullScreen = isFullScreen;
_mejs2.default.Features.requestFullScreen = requestFullScreen;
_mejs2.default.Features.cancelFullScreen = cancelFullScreen;

},{"2":2,"3":3,"6":6}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createEvent = createEvent;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
exports.isNodeAfter = isNodeAfter;

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {string} eventName
 * @param {*} target
 * @return {Event|Object}
 */
function createEvent(eventName, target) {

	if (typeof eventName !== 'string') {
		throw new Error('Event name must be a string');
	}

	var event = void 0;

	if (_document2.default.createEvent) {
		event = _document2.default.createEvent('Event');
		event.initEvent(eventName, true, false);
	} else {
		event = {};
		event.type = eventName;
		event.target = target;
		event.canceleable = true;
		event.bubbable = false;
	}

	return event;
}

/**
 *
 * @param {Object} obj
 * @param {String} type
 * @param {Function} fn
 */
function addEvent(obj, type, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if (obj.attachEvent) {
		obj['e' + type + fn] = fn;
		obj['' + type + fn] = function () {
			obj['e' + type + fn](window.event);
		};
		obj.attachEvent('on' + type, obj['' + type + fn]);
	}
}

/**
 *
 * @param {Object} obj
 * @param {String} type
 * @param {Function} fn
 */
function removeEvent(obj, type, fn) {

	if (obj.removeEventListener) {
		obj.removeEventListener(type, fn, false);
	} else if (obj.detachEvent) {
		obj.detachEvent('on' + type, obj['' + type + fn]);
		obj['' + type + fn] = null;
	}
}

/**
 * Returns true if targetNode appears after sourceNode in the dom.
 * @param {HTMLElement} sourceNode - the source node for comparison
 * @param {HTMLElement} targetNode - the node to compare against sourceNode
 */
function isNodeAfter(sourceNode, targetNode) {
	return !!(sourceNode && targetNode && sourceNode.compareDocumentPosition(targetNode) && Node.DOCUMENT_POSITION_PRECEDING);
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.createEvent = createEvent;
_mejs2.default.Utils.removeEvent = removeEvent;
_mejs2.default.Utils.isNodeAfter = isNodeAfter;

},{"2":2,"6":6}],29:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.escapeHTML = escapeHTML;
exports.debounce = debounce;
exports.isObjectEmpty = isObjectEmpty;
exports.splitEvents = splitEvents;
exports.getElementsByClassName = getElementsByClassName;

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {String} input
 * @return {string}
 */
function escapeHTML(input) {

	if (typeof input !== 'string') {
		throw new Error('Argument passed must be a string');
	}

	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	};

	return input.replace(/[&<>"]/g, function (c) {
		return map[c];
	});
}

// taken from underscore
function debounce(func, wait) {
	var _this = this,
	    _arguments = arguments;

	var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


	if (typeof func !== 'function') {
		throw new Error('First argument must be a function');
	}

	if (typeof wait !== 'number') {
		throw new Error('Second argument must be a numeric value');
	}

	var timeout = void 0;
	return function () {
		var context = _this,
		    args = _arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
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
function isObjectEmpty(instance) {
	return Object.getOwnPropertyNames(instance).length <= 0;
}

function splitEvents(events, id) {
	var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
	// add player ID as an event namespace so it's easier to unbind them all later
	var ret = { d: [], w: [] };
	(events || '').split(' ').forEach(function (v) {
		var eventName = v + '.' + id;

		if (eventName.startsWith('.')) {
			ret.d.push(eventName);
			ret.w.push(eventName);
		} else {
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
function getElementsByClassName(className, node, tag) {

	if (node === undefined || node === null) {
		node = _document2.default;
	}
	if (node.getElementsByClassName !== undefined && node.getElementsByClassName !== null) {
		return node.getElementsByClassName(className);
	}
	if (tag === undefined || tag === null) {
		tag = '*';
	}

	var classElements = [],
	    j = 0,
	    teststr = void 0,
	    els = node.getElementsByTagName(tag),
	    elsLen = els.length;

	for (i = 0; i < elsLen; i++) {
		if (els[i].className.indexOf(className) > -1) {
			teststr = ',' + els[i].className.split(' ').join(',') + ',';
			if (teststr.indexOf(',' + className + ',') > -1) {
				classElements[j] = els[i];
				j++;
			}
		}
	}

	return classElements;
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.escapeHTML = escapeHTML;
_mejs2.default.Utils.debounce = debounce;
_mejs2.default.Utils.isObjectEmpty = isObjectEmpty;
_mejs2.default.Utils.splitEvents = splitEvents;
_mejs2.default.Utils.getElementsByClassName = getElementsByClassName;

},{"2":2,"6":6}],30:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.typeChecks = undefined;
exports.absolutizeUrl = absolutizeUrl;
exports.formatType = formatType;
exports.getMimeFromType = getMimeFromType;
exports.getTypeFromFile = getTypeFromFile;
exports.getExtension = getExtension;
exports.normalizeExtension = normalizeExtension;

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _general = _dereq_(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeChecks = exports.typeChecks = [];

/**
 *
 * @param {String} url
 * @return {String}
 */
function absolutizeUrl(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	var el = document.createElement('div');
	el.innerHTML = '<a href="' + (0, _general.escapeHTML)(url) + '">x</a>';
	return el.firstChild.href;
}

/**
 * Get the format of a specific media, based on URL and additionally its mime type
 *
 * @param {String} url
 * @param {String} type
 * @return {String}
 */
function formatType(url) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	return url && !type ? getTypeFromFile(url) : getMimeFromType(type);
}

/**
 * Return the mime part of the type in case the attribute contains the codec
 * (`video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`)
 *
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
 * @param {String} type
 * @return {String}
 */
function getMimeFromType(type) {

	if (typeof type !== 'string') {
		throw new Error('`type` argument must be a string');
	}

	return type && ~type.indexOf(';') ? type.substr(0, type.indexOf(';')) : type;
}

/**
 * Get the type of media based on URL structure
 *
 * @param {String} url
 * @return {String}
 */
function getTypeFromFile(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	var type = void 0;

	// Validate `typeChecks` array
	if (!Array.isArray(typeChecks)) {
		throw new Error('`typeChecks` must be an array');
	}

	if (typeChecks.length) {
		for (var i = 0, total = typeChecks.length; i < total; i++) {
			var _type = typeChecks[i];

			if (typeof _type !== 'function') {
				throw new Error('Element in array must be a function');
			}
		}
	}

	// do type checks first
	for (var _i = 0, _total = typeChecks.length; _i < _total; _i++) {

		type = typeChecks[_i](url);

		if (type !== undefined && type !== null) {
			return type;
		}
	}

	// the do standard extension check
	var ext = getExtension(url),
	    normalizedExt = normalizeExtension(ext);

	return (/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + normalizedExt;
}

/**
 * Get media file extension from URL
 *
 * @param {String} url
 * @return {String}
 */
function getExtension(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	var baseUrl = url.split('?')[0];

	return ~baseUrl.indexOf('.') ? baseUrl.substring(baseUrl.lastIndexOf('.') + 1) : '';
}

/**
 * Get standard extension of a media file
 *
 * @param {String} extension
 * @return {String}
 */
function normalizeExtension(extension) {

	if (typeof extension !== 'string') {
		throw new Error('`extension` argument must be a string');
	}

	switch (extension) {
		case 'mp4':
		case 'm4v':
			return 'mp4';
		case 'webm':
		case 'webma':
		case 'webmv':
			return 'webm';
		case 'ogg':
		case 'oga':
		case 'ogv':
			return 'ogg';
		default:
			return extension;
	}
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.absolutizeUrl = absolutizeUrl;
_mejs2.default.Utils.formatType = formatType;
_mejs2.default.Utils.getMimeFromType = getMimeFromType;
_mejs2.default.Utils.getTypeFromFile = getTypeFromFile;
_mejs2.default.Utils.getExtension = getExtension;
_mejs2.default.Utils.normalizeExtension = normalizeExtension;

},{"29":29,"6":6}],31:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	Array.prototype.indexOf = function (searchElement, fromIndex) {

		var k = void 0;

		// 1. Let O be the result of calling ToObject passing
		//	   the this value as the argument.
		if (undefined === undefined || undefined === null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(undefined);

		// 2. Let lenValue be the result of calling the Get
		//	   internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//	   ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

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
if (_document2.default.createEvent === undefined) {
	_document2.default.createEvent = function () {

		var e = void 0;

		e = _document2.default.createEventObject();
		e.timeStamp = new Date().getTime();
		e.enumerable = true;
		e.writable = true;
		e.configurable = true;

		e.initEvent = function (type, bubbles, cancelable) {
			undefined.type = type;
			undefined.bubbles = !!bubbles;
			undefined.cancelable = !!cancelable;
			if (!undefined.bubbles) {
				undefined.stopPropagation = function () {
					undefined.stoppedPropagation = true;
					undefined.cancelBubble = true;
				};
			}
		};

		return e;
	};
}

// Object.assign polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign !== 'function') {
	Object.assign = function (target, varArgs) {
		// .length of function is 2

		'use strict';

		if (target === null || target === undefined) {
			// TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];

			if (nextSource !== null) {
				// Skip over if undefined or null
				for (var nextKey in nextSource) {
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
		value: function value(searchElement, fromIndex) {

			// 1. Let O be ? ToObject(this value).
			if (this === null || this === undefined) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. Let n be ? ToInteger(fromIndex).
			//    (If fromIndex is undefined, this step produces the value 0.)
			var n = fromIndex | 0;

			// 5. If n ≥ 0, then
			//  a. Let k be n.
			// 6. Else n < 0,
			//  a. Let k be len + n.
			//  b. If k < 0, let k be 0.
			var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

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
	String.prototype.includes = function () {
		return String.prototype.indexOf.apply(this, arguments) !== -1;
	};
}

// String.startsWith polyfill
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}

},{"2":2}],32:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.secondsToTimeCode = secondsToTimeCode;
exports.timeCodeToSeconds = timeCodeToSeconds;
exports.calculateTimeFormat = calculateTimeFormat;
exports.convertSMPTEtoSeconds = convertSMPTEtoSeconds;

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format a numeric time in format '00:00:00'
 *
 * @param {Number} time - Ideally a number, but if not or less than zero, is defaulted to zero
 * @param {Boolean} forceHours
 * @param {Boolean} showFrameCount
 * @param {Number} fps - Frames per second
 * @return {String}
 */
function secondsToTimeCode(time) {
	var forceHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var showFrameCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var fps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var hours = Math.floor(time / 3600) % 24;
	var minutes = Math.floor(time / 60) % 60;
	var seconds = Math.floor(time % 60);
	var frames = Math.floor((time % 1 * fps).toFixed(3));

	hours = hours <= 0 ? 0 : hours;
	minutes = minutes <= 0 ? 0 : minutes;
	seconds = seconds <= 0 ? 0 : seconds;

	var result = forceHours || hours > 0 ? (hours < 10 ? '0' + hours : hours) + ':' : '';
	result += (minutes < 10 ? '0' + minutes : minutes) + ':';
	result += '' + (seconds < 10 ? '0' + seconds : seconds);
	result += '' + (showFrameCount ? ':' + (frames < 10 ? '0' + frames : frames) : '');

	return result;
}

/**
 * Convert a '00:00:00' time string into seconds
 *
 * @param {String} time
 * @param {Boolean} showFrameCount
 * @param {Number} fps - Frames per second
 * @return {Number}
 */
function timeCodeToSeconds(time) {
	var showFrameCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;


	if (typeof time !== 'string') {
		throw new TypeError('Time must be a string');
	}

	if (!time.match(/\d{2}(\:\d{2}){0,3}/)) {
		throw new TypeError('Time code must have the format `00:00:00`');
	}

	var parts = time.split(':'),
	    hours = 0,
	    minutes = 0,
	    frames = 0,
	    seconds = 0,
	    output = void 0;

	switch (parts.length) {
		default:
		case 1:
			seconds = parseInt(parts[0], 10);
			break;
		case 2:
			minutes = parseInt(parts[0], 10);
			seconds = parseInt(parts[1], 10);
			break;
		case 3:
		case 4:
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			frames = showFrameCount ? parseInt(parts[3]) / fps : 0;
			break;

	}

	output = hours * 3600 + minutes * 60 + seconds + frames;
	return parseFloat(output.toFixed(3));
}

/**
 * Calculate the time format to use
 *
 * There is a default format set in the options but it can be incomplete, so it is adjusted according to the media
 * duration. Format: 'hh:mm:ss:ff'
 * @param {*} time - Ideally a number, but if not or less than zero, is defaulted to zero
 * @param {Object} options
 * @param {Number} fps - Frames per second
 */
function calculateTimeFormat(time, options) {
	var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var required = false,
	    format = options.timeFormat,
	    firstChar = format[0],
	    firstTwoPlaces = format[1] === format[0],
	    separatorIndex = firstTwoPlaces ? 2 : 1,
	    separator = format.length < separatorIndex ? format[separatorIndex] : ':',
	    hours = Math.floor(time / 3600) % 24,
	    minutes = Math.floor(time / 60) % 60,
	    seconds = Math.floor(time % 60),
	    frames = Math.floor((time % 1 * fps).toFixed(3)),
	    lis = [[frames, 'f'], [seconds, 's'], [minutes, 'm'], [hours, 'h']];

	for (var i = 0, len = lis.length; i < len; i++) {
		if (format.indexOf(lis[i][1]) > -1) {
			required = true;
		} else if (required) {
			var hasNextValue = false;
			for (var j = i; j < len; j++) {
				if (lis[j][0] > 0) {
					hasNextValue = true;
					break;
				}
			}

			if (!hasNextValue) {
				break;
			}

			if (!firstTwoPlaces) {
				format = firstChar + format;
			}
			format = lis[i][1] + separator + format;
			if (firstTwoPlaces) {
				format = lis[i][1] + format;
			}
			firstChar = lis[i][1];
		}
	}

	options.currentTimeFormat = format;
}

/**
 * Convert Society of Motion Picture and Television Engineers (SMTPE) time code into seconds
 *
 * @param {String} SMPTE
 * @return {Number}
 */
function convertSMPTEtoSeconds(SMPTE) {

	if (typeof SMPTE !== 'string') {
		throw new TypeError('Argument must be a string value');
	}

	SMPTE = SMPTE.replace(',', '.');

	var secs = 0,
	    decimalLen = SMPTE.indexOf('.') > -1 ? SMPTE.split('.')[1].length : 0,
	    multiplier = 1;

	SMPTE = SMPTE.split(':').reverse();

	for (var i = 0; i < SMPTE.length; i++) {
		multiplier = 1;
		if (i > 0) {
			multiplier = Math.pow(60, i);
		}
		secs += Number(SMPTE[i]) * multiplier;
	}
	return Number(secs.toFixed(decimalLen));
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.secondsToTimeCode = secondsToTimeCode;
_mejs2.default.Utils.timeCodeToSeconds = timeCodeToSeconds;
_mejs2.default.Utils.calculateTimeFormat = calculateTimeFormat;
_mejs2.default.Utils.convertSMPTEtoSeconds = convertSMPTEtoSeconds;

},{"6":6}]},{},[31,5,4,14,23,20,17,18,19,21,22,24,25,26,15,16,8,9,10,11,12,13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2NvcmUvaTE4bi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lZGlhZWxlbWVudC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lanMuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvY29yZS9yZW5kZXJlci5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9mdWxsc2NyZWVuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3BsYXlwYXVzZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9wcm9ncmVzcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy90aW1lLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3RyYWNrcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy92b2x1bWUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvbGFuZ3VhZ2VzL2VuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2xpYnJhcnkuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcGxheWVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy9kYWlseW1vdGlvbi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvZGFzaC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvZmFjZWJvb2suanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL2ZsYXNoLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy9mbHYuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL2hscy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvaHRtbDUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL3NvdW5kY2xvdWQuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL3ZpbWVvLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy95b3V0dWJlLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3V0aWxzL2NvbnN0YW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9kb20uanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvdXRpbHMvZ2VuZXJhbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9tZWRpYS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9wb2x5ZmlsbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy90aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7QUFNQSxJQUFJLE9BQU8sRUFBQyxNQUFNLElBQVAsRUFBYSxVQUFiLEVBQVg7O0FBRUE7Ozs7OztBQU1BLEtBQUssUUFBTCxHQUFnQixZQUFhO0FBQUEsbUNBQVQsSUFBUztBQUFULE1BQVM7QUFBQTs7QUFFNUIsS0FBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxTQUExQixJQUF1QyxLQUFLLE1BQWhELEVBQXdEOztBQUV2RCxNQUFJLE9BQU8sS0FBSyxDQUFMLENBQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDaEMsU0FBTSxJQUFJLFNBQUosQ0FBYyxzQ0FBZCxDQUFOO0FBQ0E7O0FBRUQsTUFBSSxDQUFDLEtBQUssQ0FBTCxFQUFRLEtBQVIsQ0FBYywwQkFBZCxDQUFMLEVBQWdEO0FBQy9DLFNBQU0sSUFBSSxTQUFKLENBQWMsZ0RBQWQsQ0FBTjtBQUNBOztBQUVELE9BQUssSUFBTCxHQUFZLEtBQUssQ0FBTCxDQUFaOztBQUVBO0FBQ0EsTUFBSSxLQUFLLEtBQUssQ0FBTCxDQUFMLE1BQWtCLFNBQXRCLEVBQWlDO0FBQ2hDLFFBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxNQUFZLElBQVosSUFBb0IsS0FBSyxDQUFMLE1BQVksU0FBaEMsSUFBNkMsUUFBTyxLQUFLLENBQUwsQ0FBUCxNQUFtQixRQUFoRSxHQUEyRSxLQUFLLENBQUwsQ0FBM0UsR0FBcUYsRUFBL0Y7QUFDQSxRQUFLLEtBQUssQ0FBTCxDQUFMLElBQWdCLENBQUMsNEJBQWMsS0FBSyxDQUFMLENBQWQsQ0FBRCxHQUEwQixLQUFLLENBQUwsQ0FBMUIsU0FBaEI7QUFDQSxHQUhELE1BR08sSUFBSSxLQUFLLENBQUwsTUFBWSxJQUFaLElBQW9CLEtBQUssQ0FBTCxNQUFZLFNBQWhDLElBQTZDLFFBQU8sS0FBSyxDQUFMLENBQVAsTUFBbUIsUUFBcEUsRUFBOEU7QUFDcEYsUUFBSyxLQUFLLENBQUwsQ0FBTCxJQUFnQixLQUFLLENBQUwsQ0FBaEI7QUFDQTtBQUNEOztBQUVELFFBQU8sS0FBSyxJQUFaO0FBQ0EsQ0F4QkQ7O0FBMEJBOzs7Ozs7O0FBT0EsS0FBSyxDQUFMLEdBQVMsVUFBQyxPQUFELEVBQWlDO0FBQUEsS0FBdkIsV0FBdUIsdUVBQVQsSUFBUzs7O0FBRXpDLEtBQUksT0FBTyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLFFBQVEsTUFBM0MsRUFBbUQ7O0FBRWxELE1BQ0MsWUFERDtBQUFBLE1BRUMsbUJBRkQ7O0FBS0EsTUFBTSxXQUFXLEtBQUssUUFBTCxFQUFqQjs7QUFFQTs7Ozs7Ozs7OztBQVVBLE1BQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixJQUFoQixFQUF5Qjs7QUFFeEMsT0FBSSxRQUFPLEtBQVAseUNBQU8sS0FBUCxPQUFpQixRQUFqQixJQUE2QixPQUFPLE1BQVAsS0FBa0IsUUFBL0MsSUFBMkQsT0FBTyxJQUFQLEtBQWdCLFFBQS9FLEVBQXlGO0FBQ3hGLFdBQU8sS0FBUDtBQUNBOztBQUVEOzs7OztBQUtBLE9BQUksZUFBZ0IsWUFBTTtBQUN6QixXQUFPO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBLEtBSk07O0FBTU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQSxZQUFjLHVEQUFZLENBQWIsc0dBQWI7QUFBQSxLQWZNOztBQWlCTjtBQUNBO0FBQ0E7QUFBQSxZQUFjLHVEQUFZLENBQVosSUFBaUIsdURBQVksQ0FBOUIsc0dBQWI7QUFBQSxLQW5CTTs7QUFxQk47QUFDQSxnQkFBYTtBQUNaLFNBQUkscURBQVUsRUFBVixLQUFpQixDQUFqQixJQUFzQixxREFBVSxHQUFWLEtBQWtCLEVBQTVDLEVBQWdEO0FBQy9DO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDekI7QUFDQSxNQUZNLE1BRUE7QUFDTjtBQUNBO0FBQ0QsS0E5Qks7O0FBZ0NOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQVosSUFBaUIsdURBQVksRUFBakMsRUFBcUM7QUFDcEM7QUFDQSxNQUZELE1BRU8sSUFBSSx1REFBWSxDQUFaLElBQWlCLHVEQUFZLEVBQWpDLEVBQXFDO0FBQzNDO0FBQ0EsTUFGTSxNQUVBLElBQUkscURBQVUsQ0FBVixJQUFlLHFEQUFVLEVBQTdCLEVBQWlDO0FBQ3ZDO0FBQ0EsTUFGTSxNQUVBO0FBQ047QUFDQTtBQUNELEtBM0NLOztBQTZDTjtBQUNBLGdCQUFhO0FBQ1osU0FBSSx1REFBWSxDQUFoQixFQUFtQjtBQUNsQjtBQUNBLE1BRkQsTUFFTyxJQUFJLHVEQUFZLENBQVosSUFBa0IscURBQVUsR0FBVixHQUFnQixDQUFoQixJQUFxQixxREFBVSxHQUFWLEdBQWdCLEVBQTNELEVBQWdFO0FBQ3RFO0FBQ0EsTUFGTSxNQUVBO0FBQ047QUFDQTtBQUNELEtBdERLOztBQXdETjtBQUNBLGdCQUFhO0FBQ1osU0FBSSxxREFBVSxFQUFWLEtBQWlCLENBQWpCLElBQXNCLHFEQUFVLEdBQVYsS0FBa0IsRUFBNUMsRUFBZ0Q7QUFDL0M7QUFDQSxNQUZELE1BRU8sSUFBSSxxREFBVSxFQUFWLElBQWdCLENBQWhCLEtBQXNCLHFEQUFVLEdBQVYsR0FBZ0IsRUFBaEIsSUFBc0IscURBQVUsR0FBVixJQUFpQixFQUE3RCxDQUFKLEVBQXNFO0FBQzVFO0FBQ0EsTUFGTSxNQUVBO0FBQ04sYUFBTyxDQUFDLENBQUQsQ0FBUDtBQUNBO0FBQ0QsS0FqRUs7O0FBbUVOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHFEQUFVLEVBQVYsS0FBaUIsQ0FBakIsSUFBc0IscURBQVUsR0FBVixLQUFrQixFQUE1QyxFQUFnRDtBQUMvQztBQUNBLE1BRkQsTUFFTyxJQUFJLHFEQUFVLEVBQVYsSUFBZ0IsQ0FBaEIsSUFBcUIscURBQVUsRUFBVixJQUFnQixDQUFyQyxLQUEyQyxxREFBVSxHQUFWLEdBQWdCLEVBQWhCLElBQXNCLHFEQUFVLEdBQVYsSUFBaUIsRUFBbEYsQ0FBSixFQUEyRjtBQUNqRztBQUNBLE1BRk0sTUFFQTtBQUNOO0FBQ0E7QUFDRCxLQTVFSzs7QUE4RU47QUFDQSxnQkFBYTtBQUNaLFNBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDbEI7QUFDQSxNQUZELE1BRU8sSUFBSSxzREFBVyxDQUFYLElBQWdCLHNEQUFXLENBQS9CLEVBQWtDO0FBQ3hDO0FBQ0EsTUFGTSxNQUVBO0FBQ047QUFDQTtBQUNELEtBdkZLOztBQXlGTjtBQUNBLGdCQUFhO0FBQ1osU0FBSSx1REFBWSxDQUFoQixFQUFtQjtBQUNsQjtBQUNBLE1BRkQsTUFFTyxJQUFJLHFEQUFVLEVBQVYsSUFBZ0IsQ0FBaEIsSUFBcUIscURBQVUsRUFBVixJQUFnQixDQUFyQyxLQUEyQyxxREFBVSxHQUFWLEdBQWdCLEVBQWhCLElBQXNCLHFEQUFVLEdBQVYsSUFBaUIsRUFBbEYsQ0FBSixFQUEyRjtBQUNqRztBQUNBLE1BRk0sTUFFQTtBQUNOO0FBQ0E7QUFDRCxLQWxHSzs7QUFvR047QUFDQSxnQkFBYTtBQUNaLFNBQUkscURBQVUsR0FBVixLQUFrQixDQUF0QixFQUF5QjtBQUN4QjtBQUNBLE1BRkQsTUFFTyxJQUFJLHFEQUFVLEdBQVYsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDL0I7QUFDQSxNQUZNLE1BRUEsSUFBSSxxREFBVSxHQUFWLEtBQWtCLENBQWxCLElBQXVCLHFEQUFVLEdBQVYsS0FBa0IsQ0FBN0MsRUFBZ0Q7QUFDdEQ7QUFDQSxNQUZNLE1BRUE7QUFDTjtBQUNBO0FBQ0QsS0EvR0s7O0FBaUhOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDekI7QUFDQSxNQUZNLE1BRUEsSUFBSSxxREFBVSxDQUFWLElBQWUscURBQVUsQ0FBN0IsRUFBZ0M7QUFDdEM7QUFDQSxNQUZNLE1BRUEsSUFBSSxxREFBVSxDQUFWLElBQWUscURBQVUsRUFBN0IsRUFBaUM7QUFDdkM7QUFDQSxNQUZNLE1BRUE7QUFDTjtBQUNBO0FBQ0QsS0E5SEs7O0FBZ0lOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDekI7QUFDQSxNQUZNLE1BRUEsSUFBSSx1REFBWSxDQUFoQixFQUFtQjtBQUN6QjtBQUNBLE1BRk0sTUFFQSxJQUFJLHFEQUFVLEdBQVYsSUFBaUIsQ0FBakIsSUFBc0IscURBQVUsR0FBVixJQUFpQixFQUEzQyxFQUErQztBQUNyRDtBQUNBLE1BRk0sTUFFQSxJQUFJLHFEQUFVLEdBQVYsSUFBaUIsRUFBckIsRUFBeUI7QUFDL0I7QUFDQSxNQUZNLE1BRUE7QUFDTjtBQUNBO0FBQ0QsS0EvSUs7O0FBaUpOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBWixJQUFrQixxREFBVSxHQUFWLEdBQWdCLENBQWhCLElBQXFCLHFEQUFVLEdBQVYsR0FBZ0IsRUFBM0QsRUFBZ0U7QUFDdEU7QUFDQSxNQUZNLE1BRUEsSUFBSSxxREFBVSxHQUFWLEdBQWdCLEVBQWhCLElBQXNCLHFEQUFVLEdBQVYsR0FBZ0IsRUFBMUMsRUFBOEM7QUFDcEQ7QUFDQSxNQUZNLE1BRUE7QUFDTjtBQUNBO0FBQ0QsS0E1Sks7O0FBOEpOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHFEQUFVLEVBQVYsS0FBaUIsQ0FBckIsRUFBd0I7QUFDdkI7QUFDQSxNQUZELE1BRU8sSUFBSSxxREFBVSxFQUFWLEtBQWlCLENBQXJCLEVBQXdCO0FBQzlCO0FBQ0EsTUFGTSxNQUVBO0FBQ047QUFDQTtBQUNELEtBdktLOztBQXlLTjtBQUNBLGdCQUFhO0FBQ1osWUFBUSx1REFBWSxFQUFaLElBQWtCLHFEQUFVLEVBQVYsS0FBaUIsQ0FBcEMsc0dBQVA7QUFDQSxLQTVLSzs7QUE4S047O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUkscURBQVUsRUFBVixJQUFnQixDQUFoQixJQUFxQixxREFBVSxFQUFWLElBQWdCLENBQXJDLEtBQTJDLHFEQUFVLEdBQVYsR0FBZ0IsRUFBaEIsSUFDckQscURBQVUsR0FBVixJQUFpQixFQURQLENBQUosRUFDZ0I7QUFDdEI7QUFDQSxNQUhNLE1BR0E7QUFDTjtBQUNBO0FBQ0QsS0E1TEs7O0FBOExOO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDekI7QUFDQSxNQUZNLE1BRUEsSUFBSSx1REFBWSxDQUFaLElBQWlCLHVEQUFZLEVBQWpDLEVBQXFDO0FBQzNDO0FBQ0EsTUFGTSxNQUVBO0FBQ047QUFDQTtBQUNELEtBek1LOztBQTJNTjtBQUNBLGdCQUFhO0FBQ1osWUFBUSx1REFBWSxDQUFiLHNHQUFQO0FBQ0EsS0E5TUs7O0FBZ05OO0FBQ0EsZ0JBQWE7QUFDWixTQUFJLHVEQUFZLENBQWhCLEVBQW1CO0FBQ2xCO0FBQ0EsTUFGRCxNQUVPLElBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDekI7QUFDQSxNQUZNLE1BRUEsSUFBSSx1REFBWSxDQUFoQixFQUFtQjtBQUN6QjtBQUNBLE1BRk0sTUFFQTtBQUNOO0FBQ0E7QUFDRCxLQTNOSzs7QUE2Tk47QUFDQSxnQkFBYTtBQUNaLFNBQUksdURBQVksQ0FBaEIsRUFBbUI7QUFDbEI7QUFDQSxNQUZELE1BRU8sSUFBSSx1REFBWSxDQUFoQixFQUFtQjtBQUN6QjtBQUNBLE1BRk0sTUFFQTtBQUNOO0FBQ0E7QUFDRCxLQXRPSyxDQUFQO0FBeU9BLElBMU9rQixFQUFuQjs7QUE0T0E7QUFDQSxVQUFPLGFBQWEsSUFBYixFQUFtQixLQUFuQixDQUF5QixJQUF6QixFQUErQixDQUFDLE1BQUQsRUFBUyxNQUFULENBQWdCLEtBQWhCLENBQS9CLENBQVA7QUFDQSxHQXpQRDs7QUEyUEE7QUFDQSxNQUFJLEtBQUssUUFBTCxNQUFtQixTQUF2QixFQUFrQztBQUNqQyxTQUFNLEtBQUssUUFBTCxFQUFlLE9BQWYsQ0FBTjtBQUNBLE9BQUksZ0JBQWdCLElBQWhCLElBQXdCLE9BQU8sV0FBUCxLQUF1QixRQUFuRCxFQUE2RDtBQUM1RCxpQkFBYSxLQUFLLFFBQUwsRUFBZSxrQkFBZixDQUFiO0FBQ0EsVUFBTSxRQUFRLEtBQVIsQ0FBYyxJQUFkLEVBQW9CLENBQUMsR0FBRCxFQUFNLFdBQU4sRUFBbUIsVUFBbkIsQ0FBcEIsQ0FBTjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLENBQUMsR0FBRCxJQUFRLEtBQUssRUFBakIsRUFBcUI7QUFDcEIsU0FBTSxLQUFLLEVBQUwsQ0FBUSxPQUFSLENBQU47QUFDQSxPQUFJLGdCQUFnQixJQUFoQixJQUF3QixPQUFPLFdBQVAsS0FBdUIsUUFBbkQsRUFBNkQ7QUFDNUQsaUJBQWEsS0FBSyxFQUFMLENBQVEsa0JBQVIsQ0FBYjtBQUNBLFVBQU0sUUFBUSxLQUFSLENBQWMsSUFBZCxFQUFvQixDQUFDLEdBQUQsRUFBTSxXQUFOLEVBQW1CLFVBQW5CLENBQXBCLENBQU47QUFFQTtBQUNEOztBQUVEO0FBQ0E7QUFDQSxRQUFNLE9BQU8sT0FBYjs7QUFFQTtBQUNBLE1BQUksZ0JBQWdCLElBQWhCLElBQXdCLE9BQU8sV0FBUCxLQUF1QixRQUFuRCxFQUE2RDtBQUM1RCxTQUFNLElBQUksT0FBSixDQUFZLElBQVosRUFBa0IsV0FBbEIsQ0FBTjtBQUNBOztBQUVELFNBQU8seUJBQVcsR0FBWCxDQUFQO0FBRUE7O0FBRUQsUUFBTyxPQUFQO0FBQ0EsQ0FqVEQ7O0FBbVRBLGVBQUssSUFBTCxHQUFZLElBQVo7O0FBRUE7QUFDQSxJQUFJLE9BQU8sUUFBUCxLQUFvQixXQUF4QixFQUFxQztBQUNwQyxnQkFBSyxJQUFMLENBQVUsUUFBVixDQUFtQixTQUFTLFFBQTVCLEVBQXNDLFNBQVMsT0FBL0M7QUFDQTs7a0JBRWMsSTs7O0FDL1dmOzs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztJQU1NLFksR0FFTCxzQkFBYSxRQUFiLEVBQXVCLE9BQXZCLEVBQWdDO0FBQUE7O0FBQUE7O0FBRS9CLEtBQUksSUFBSSxJQUFSOztBQUVBLEdBQUUsUUFBRixHQUFhO0FBQ1o7Ozs7QUFJQSxhQUFXLEVBTEM7QUFNWjs7OztBQUlBLGdCQUFjLHFCQVZGO0FBV1o7Ozs7QUFJQSxjQUFZO0FBZkEsRUFBYjs7QUFrQkEsV0FBVSxPQUFPLE1BQVAsQ0FBYyxFQUFFLFFBQWhCLEVBQTBCLE9BQTFCLENBQVY7O0FBRUE7QUFDQSxHQUFFLFlBQUYsR0FBaUIsbUJBQVMsYUFBVCxDQUF1QixRQUFRLFlBQS9CLENBQWpCO0FBQ0EsR0FBRSxZQUFGLENBQWUsT0FBZixHQUF5QixPQUF6Qjs7QUFFQSxLQUNDLEtBQUssUUFETjtBQUFBLEtBRUMsVUFGRDtBQUFBLEtBR0MsV0FIRDs7QUFNQSxLQUFJLE9BQU8sUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUNqQyxJQUFFLFlBQUYsQ0FBZSxZQUFmLEdBQThCLG1CQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBOUI7QUFDQSxFQUZELE1BRU87QUFDTixJQUFFLFlBQUYsQ0FBZSxZQUFmLEdBQThCLFFBQTlCO0FBQ0EsT0FBSyxTQUFTLEVBQWQ7QUFDQTs7QUFFRCxNQUFLLGdCQUFlLEtBQUssTUFBTCxHQUFjLFFBQWQsR0FBeUIsS0FBekIsQ0FBK0IsQ0FBL0IsQ0FBcEI7O0FBRUEsS0FBSSxFQUFFLFlBQUYsQ0FBZSxZQUFmLEtBQWdDLFNBQWhDLElBQTZDLEVBQUUsWUFBRixDQUFlLFlBQWYsS0FBZ0MsSUFBN0UsSUFDSCxFQUFFLFlBQUYsQ0FBZSxXQURoQixFQUM2QjtBQUM1QjtBQUNBLElBQUUsWUFBRixDQUFlLFlBQWYsQ0FBNEIsWUFBNUIsQ0FBeUMsSUFBekMsRUFBa0QsRUFBbEQ7O0FBRUE7QUFDQSxJQUFFLFlBQUYsQ0FBZSxZQUFmLENBQTRCLFVBQTVCLENBQXVDLFlBQXZDLENBQW9ELEVBQUUsWUFBdEQsRUFBb0UsRUFBRSxZQUFGLENBQWUsWUFBbkY7O0FBRUE7QUFDQSxJQUFFLFlBQUYsQ0FBZSxXQUFmLENBQTJCLEVBQUUsWUFBRixDQUFlLFlBQTFDO0FBQ0EsRUFWRCxNQVVPO0FBQ047QUFDQTs7QUFFRCxHQUFFLFlBQUYsQ0FBZSxFQUFmLEdBQW9CLEVBQXBCO0FBQ0EsR0FBRSxZQUFGLENBQWUsU0FBZixHQUEyQixFQUEzQjtBQUNBLEdBQUUsWUFBRixDQUFlLFFBQWYsR0FBMEIsSUFBMUI7QUFDQSxHQUFFLFlBQUYsQ0FBZSxZQUFmLEdBQThCLElBQTlCO0FBQ0E7Ozs7Ozs7O0FBUUEsR0FBRSxZQUFGLENBQWUsY0FBZixHQUFnQyxVQUFDLFlBQUQsRUFBZSxVQUFmLEVBQThCOztBQUU3RCxNQUFJLFNBQUo7O0FBRUE7QUFDQSxNQUFJLEVBQUUsWUFBRixDQUFlLFFBQWYsS0FBNEIsU0FBNUIsSUFBeUMsRUFBRSxZQUFGLENBQWUsUUFBZixLQUE0QixJQUFyRSxJQUNILEVBQUUsWUFBRixDQUFlLFFBQWYsQ0FBd0IsSUFBeEIsS0FBaUMsWUFEbEMsRUFDZ0Q7QUFDL0MsS0FBRSxZQUFGLENBQWUsUUFBZixDQUF3QixLQUF4QjtBQUNBLE9BQUksRUFBRSxZQUFGLENBQWUsUUFBZixDQUF3QixJQUE1QixFQUFrQztBQUNqQyxNQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLElBQXhCO0FBQ0E7QUFDRCxLQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLElBQXhCO0FBQ0EsS0FBRSxZQUFGLENBQWUsUUFBZixDQUF3QixNQUF4QixDQUErQixXQUFXLENBQVgsRUFBYyxHQUE3QztBQUNBLFVBQU8sSUFBUDtBQUNBOztBQUVEO0FBQ0EsTUFBSSxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLFNBQTVCLElBQXlDLEVBQUUsWUFBRixDQUFlLFFBQWYsS0FBNEIsSUFBekUsRUFBK0U7QUFDOUUsS0FBRSxZQUFGLENBQWUsUUFBZixDQUF3QixLQUF4QjtBQUNBLE9BQUksRUFBRSxZQUFGLENBQWUsUUFBZixDQUF3QixJQUE1QixFQUFrQztBQUNqQyxNQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLElBQXhCO0FBQ0E7QUFDRCxLQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLElBQXhCO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLGNBQWMsRUFBRSxZQUFGLENBQWUsU0FBZixDQUF5QixZQUF6QixDQUFsQjtBQUFBLE1BQ0Msa0JBQWtCLElBRG5COztBQUdBLE1BQUksZ0JBQWdCLFNBQWhCLElBQTZCLGdCQUFnQixJQUFqRCxFQUF1RDtBQUN0RCxlQUFZLElBQVo7QUFDQSxlQUFZLE1BQVosQ0FBbUIsV0FBVyxDQUFYLEVBQWMsR0FBakM7QUFDQSxLQUFFLFlBQUYsQ0FBZSxRQUFmLEdBQTBCLFdBQTFCO0FBQ0EsS0FBRSxZQUFGLENBQWUsWUFBZixHQUE4QixZQUE5QjtBQUNBLFVBQU8sSUFBUDtBQUNBOztBQUVELE1BQUksZ0JBQWdCLEVBQUUsWUFBRixDQUFlLE9BQWYsQ0FBdUIsU0FBdkIsQ0FBaUMsTUFBakMsR0FBMEMsRUFBRSxZQUFGLENBQWUsT0FBZixDQUF1QixTQUFqRSxHQUNuQixtQkFBUyxLQURWOztBQUdBO0FBQ0EsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLGNBQWMsTUFBL0IsRUFBdUMsSUFBSSxFQUEzQyxFQUErQyxHQUEvQyxFQUFvRDs7QUFFbkQsT0FBTSxRQUFRLGNBQWMsQ0FBZCxDQUFkOztBQUVBLE9BQUksVUFBVSxZQUFkLEVBQTRCOztBQUUzQjtBQUNBLFFBQU0sZUFBZSxtQkFBUyxTQUE5QjtBQUNBLHNCQUFrQixhQUFhLEtBQWIsQ0FBbEI7O0FBRUEsUUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsZ0JBQWdCLE9BQTlCLEVBQXVDLEVBQUUsWUFBRixDQUFlLE9BQXRELENBQXBCO0FBQ0Esa0JBQWMsZ0JBQWdCLE1BQWhCLENBQXVCLEVBQUUsWUFBekIsRUFBdUMsYUFBdkMsRUFBc0QsVUFBdEQsQ0FBZDtBQUNBLGdCQUFZLElBQVosR0FBbUIsWUFBbkI7O0FBRUE7QUFDQSxNQUFFLFlBQUYsQ0FBZSxTQUFmLENBQXlCLGdCQUFnQixJQUF6QyxJQUFpRCxXQUFqRDtBQUNBLE1BQUUsWUFBRixDQUFlLFFBQWYsR0FBMEIsV0FBMUI7QUFDQSxNQUFFLFlBQUYsQ0FBZSxZQUFmLEdBQThCLFlBQTlCOztBQUVBLGdCQUFZLElBQVo7O0FBRUEsV0FBTyxJQUFQO0FBQ0E7QUFDRDs7QUFFRCxTQUFPLEtBQVA7QUFDQSxFQW5FRDs7QUFxRUE7Ozs7Ozs7QUFPQSxHQUFFLFlBQUYsQ0FBZSxPQUFmLEdBQXlCLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDM0MsTUFBSSxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLFNBQTVCLElBQXlDLEVBQUUsWUFBRixDQUFlLFFBQWYsS0FBNEIsSUFBekUsRUFBK0U7QUFDOUUsS0FBRSxZQUFGLENBQWUsUUFBZixDQUF3QixPQUF4QixDQUFnQyxLQUFoQyxFQUF1QyxNQUF2QztBQUNBO0FBQ0QsRUFKRDs7QUFNQSxLQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsS0FFQyxVQUFVLGVBQUssVUFBTCxDQUFnQixPQUYzQjtBQUFBLEtBR0MsY0FBYyxTQUFkLFdBQWMsQ0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLEtBQVosRUFBbUIsS0FBbkIsRUFBNkI7O0FBRTFDO0FBQ0EsTUFBSSxXQUFXLElBQUksSUFBSixDQUFmO0FBQ0EsTUFDQyxRQUFRLFNBQVIsS0FBUTtBQUFBLFVBQU0sTUFBTSxLQUFOLENBQVksR0FBWixFQUFpQixDQUFDLFFBQUQsQ0FBakIsQ0FBTjtBQUFBLEdBRFQ7QUFBQSxNQUVDLFFBQVEsU0FBUixLQUFRLENBQUMsUUFBRCxFQUFjO0FBQ3JCLGNBQVcsTUFBTSxLQUFOLENBQVksR0FBWixFQUFpQixDQUFDLFFBQUQsQ0FBakIsQ0FBWDtBQUNBLFVBQU8sUUFBUDtBQUNBLEdBTEY7O0FBT0E7QUFDQSxNQUFJLE9BQU8sY0FBWCxFQUEyQjs7QUFFMUIsVUFBTyxjQUFQLENBQXNCLEdBQXRCLEVBQTJCLElBQTNCLEVBQWlDO0FBQ2hDLFNBQUssS0FEMkI7QUFFaEMsU0FBSztBQUYyQixJQUFqQzs7QUFLQTtBQUNBLEdBUkQsTUFRTyxJQUFJLElBQUksZ0JBQVIsRUFBMEI7O0FBRWhDLE9BQUksZ0JBQUosQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0I7QUFDQSxPQUFJLGdCQUFKLENBQXFCLElBQXJCLEVBQTJCLEtBQTNCO0FBQ0E7QUFDRCxFQTVCRjtBQUFBLEtBNkJDLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxRQUFELEVBQWM7QUFDcEMsTUFBSSxhQUFhLEtBQWpCLEVBQXdCO0FBQUE7O0FBRXZCLFFBQ0MsZUFBYSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsV0FBekIsRUFBYixHQUFzRCxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FEdkQ7QUFBQSxRQUVDLFFBQVEsU0FBUixLQUFRO0FBQUEsWUFBTyxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLFNBQTVCLElBQXlDLEVBQUUsWUFBRixDQUFlLFFBQWYsS0FBNEIsSUFBdEUsR0FBOEUsRUFBRSxZQUFGLENBQWUsUUFBZixTQUE4QixPQUE5QixHQUE5RSxHQUEySCxJQUFqSTtBQUFBLEtBRlQ7QUFBQSxRQUdDLFFBQVEsU0FBUixLQUFRLENBQUMsS0FBRCxFQUFXO0FBQ2xCLFNBQUksRUFBRSxZQUFGLENBQWUsUUFBZixLQUE0QixTQUE1QixJQUF5QyxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLElBQXpFLEVBQStFO0FBQzlFLFFBQUUsWUFBRixDQUFlLFFBQWYsU0FBOEIsT0FBOUIsRUFBeUMsS0FBekM7QUFDQTtBQUNELEtBUEY7O0FBU0EsZ0JBQVksRUFBRSxZQUFkLEVBQTRCLFFBQTVCLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDO0FBQ0EsTUFBRSxZQUFGLFNBQXFCLE9BQXJCLElBQWtDLEtBQWxDO0FBQ0EsTUFBRSxZQUFGLFNBQXFCLE9BQXJCLElBQWtDLEtBQWxDO0FBYnVCO0FBY3ZCO0FBQ0QsRUE3Q0Y7O0FBOENDO0FBQ0E7QUFDQSxVQUFTLFNBQVQsTUFBUztBQUFBLFNBQU8sRUFBRSxZQUFGLENBQWUsUUFBZixLQUE0QixTQUE1QixJQUF5QyxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLElBQXRFLEdBQThFLEVBQUUsWUFBRixDQUFlLFFBQWYsQ0FBd0IsTUFBeEIsRUFBOUUsR0FBaUgsSUFBdkg7QUFBQSxFQWhEVjtBQUFBLEtBaURDLFNBQVMsU0FBVCxNQUFTLENBQUMsS0FBRCxFQUFXOztBQUVuQixNQUFJLGFBQWEsRUFBakI7O0FBRUE7QUFDQSxNQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM5QixjQUFXLElBQVgsQ0FBZ0I7QUFDZixTQUFLLEtBRFU7QUFFZixVQUFNLFFBQVEsNEJBQWdCLEtBQWhCLENBQVIsR0FBaUM7QUFGeEIsSUFBaEI7QUFJQSxHQUxELE1BS087QUFDTixRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDOztBQUUzQyxRQUNDLE1BQU0sMEJBQWMsTUFBTSxDQUFOLEVBQVMsR0FBdkIsQ0FEUDtBQUFBLFFBRUMsT0FBTyxNQUFNLENBQU4sRUFBUyxJQUZqQjs7QUFLQSxlQUFXLElBQVgsQ0FBZ0I7QUFDZixVQUFLLEdBRFU7QUFFZixXQUFNLENBQUMsU0FBUyxFQUFULElBQWUsU0FBUyxJQUF4QixJQUFnQyxTQUFTLFNBQTFDLEtBQXdELEdBQXhELEdBQ0wsNEJBQWdCLEdBQWhCLENBREssR0FDa0I7QUFIVCxLQUFoQjtBQU1BO0FBQ0Q7O0FBRUQ7QUFDQSxNQUNDLGFBQWEsbUJBQVMsTUFBVCxDQUFnQixVQUFoQixFQUNYLEVBQUUsWUFBRixDQUFlLE9BQWYsQ0FBdUIsU0FBdkIsQ0FBaUMsTUFBakMsR0FBMEMsRUFBRSxZQUFGLENBQWUsT0FBZixDQUF1QixTQUFqRSxHQUE2RSxFQURsRSxDQURkO0FBQUEsTUFHQyxjQUhEOztBQU1BO0FBQ0EsSUFBRSxZQUFGLENBQWUsWUFBZixDQUE0QixZQUE1QixDQUF5QyxLQUF6QyxFQUFpRCxXQUFXLENBQVgsRUFBYyxHQUFkLElBQXFCLEVBQXRFOztBQUVBO0FBQ0EsTUFBSSxlQUFlLElBQW5CLEVBQXlCO0FBQ3hCLFdBQVEsbUJBQVMsV0FBVCxDQUFxQixZQUFyQixDQUFSO0FBQ0EsU0FBTSxTQUFOLENBQWdCLE9BQWhCLEVBQXlCLEtBQXpCLEVBQWdDLEtBQWhDO0FBQ0EsU0FBTSxPQUFOLEdBQWdCLG1CQUFoQjtBQUNBLEtBQUUsWUFBRixDQUFlLGFBQWYsQ0FBNkIsS0FBN0I7QUFDQTtBQUNBOztBQUVEO0FBQ0EsSUFBRSxZQUFGLENBQWUsY0FBZixDQUE4QixXQUFXLFlBQXpDLEVBQXVELFVBQXZEOztBQUVBLE1BQUksRUFBRSxZQUFGLENBQWUsUUFBZixLQUE0QixTQUE1QixJQUF5QyxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLElBQXpFLEVBQStFO0FBQzlFLFdBQVEsbUJBQVMsV0FBVCxDQUFxQixZQUFyQixDQUFSO0FBQ0EsU0FBTSxTQUFOLENBQWdCLE9BQWhCLEVBQXlCLEtBQXpCLEVBQWdDLEtBQWhDO0FBQ0EsU0FBTSxPQUFOLEdBQWdCLHlCQUFoQjtBQUNBLEtBQUUsWUFBRixDQUFlLGFBQWYsQ0FBNkIsS0FBN0I7QUFDQTtBQUNELEVBeEdGO0FBQUEsS0F5R0MsZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsVUFBRCxFQUFnQjtBQUMvQjtBQUNBLElBQUUsWUFBRixDQUFlLFVBQWYsSUFBNkIsWUFBYTtBQUFBLHFDQUFULElBQVM7QUFBVCxRQUFTO0FBQUE7O0FBQ3pDLFVBQVEsRUFBRSxZQUFGLENBQWUsUUFBZixLQUE0QixTQUE1QixJQUF5QyxFQUFFLFlBQUYsQ0FBZSxRQUFmLEtBQTRCLElBQXJFLElBQ1AsT0FBTyxFQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLFVBQXhCLENBQVAsS0FBK0MsVUFEekMsR0FFTixFQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDLENBRk0sR0FFc0MsSUFGN0M7QUFHQSxHQUpEO0FBTUEsRUFqSEY7O0FBbUhBO0FBQ0EsYUFBWSxFQUFFLFlBQWQsRUFBNEIsS0FBNUIsRUFBbUMsTUFBbkMsRUFBMkMsTUFBM0M7QUFDQSxHQUFFLFlBQUYsQ0FBZSxNQUFmLEdBQXdCLE1BQXhCO0FBQ0EsR0FBRSxZQUFGLENBQWUsTUFBZixHQUF3QixNQUF4Qjs7QUFFQSxNQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzNDLHVCQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDQTs7QUFFRCxNQUFLLElBQUksQ0FBSixFQUFPLEtBQUssUUFBUSxNQUF6QixFQUFpQyxJQUFJLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzdDLGdCQUFjLFFBQVEsQ0FBUixDQUFkO0FBQ0E7O0FBRUQ7QUFDQSxLQUFJLENBQUMsRUFBRSxZQUFGLENBQWUsZ0JBQXBCLEVBQXNDOztBQUVyQyxJQUFFLFlBQUYsQ0FBZSxNQUFmLEdBQXdCLEVBQXhCOztBQUVBO0FBQ0EsSUFBRSxZQUFGLENBQWUsZ0JBQWYsR0FBa0MsVUFBQyxTQUFELEVBQVksUUFBWixFQUF5QjtBQUMxRDtBQUNBLEtBQUUsWUFBRixDQUFlLE1BQWYsQ0FBc0IsU0FBdEIsSUFBbUMsRUFBRSxZQUFGLENBQWUsTUFBZixDQUFzQixTQUF0QixLQUFvQyxFQUF2RTs7QUFFQTtBQUNBLEtBQUUsWUFBRixDQUFlLE1BQWYsQ0FBc0IsU0FBdEIsRUFBaUMsSUFBakMsQ0FBc0MsUUFBdEM7QUFDQSxHQU5EO0FBT0EsSUFBRSxZQUFGLENBQWUsbUJBQWYsR0FBcUMsVUFBQyxTQUFELEVBQVksUUFBWixFQUF5QjtBQUM3RDtBQUNBLE9BQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2YsTUFBRSxZQUFGLENBQWUsTUFBZixHQUF3QixFQUF4QjtBQUNBLFdBQU8sSUFBUDtBQUNBOztBQUVEO0FBQ0EsT0FBSSxZQUFZLEVBQUUsWUFBRixDQUFlLE1BQWYsQ0FBc0IsU0FBdEIsQ0FBaEI7O0FBRUEsT0FBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZixXQUFPLElBQVA7QUFDQTs7QUFFRDtBQUNBLE9BQUksQ0FBQyxRQUFMLEVBQWU7QUFDZCxNQUFFLFlBQUYsQ0FBZSxNQUFmLENBQXNCLFNBQXRCLElBQW1DLEVBQW5DO0FBQ0EsV0FBTyxJQUFQO0FBQ0E7O0FBRUQ7QUFDQSxRQUFLLElBQUksS0FBSSxDQUFSLEVBQVcsTUFBSyxVQUFVLE1BQS9CLEVBQXVDLEtBQUksR0FBM0MsRUFBK0MsSUFBL0MsRUFBb0Q7QUFDbkQsUUFBSSxVQUFVLEVBQVYsTUFBaUIsUUFBckIsRUFBK0I7QUFDOUIsT0FBRSxZQUFGLENBQWUsTUFBZixDQUFzQixTQUF0QixFQUFpQyxNQUFqQyxDQUF3QyxFQUF4QyxFQUEyQyxDQUEzQztBQUNBLFlBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDRCxVQUFPLEtBQVA7QUFDQSxHQTVCRDs7QUE4QkE7Ozs7QUFJQSxJQUFFLFlBQUYsQ0FBZSxhQUFmLEdBQStCLFVBQUMsS0FBRCxFQUFXOztBQUV6QyxPQUFJLFlBQVksRUFBRSxZQUFGLENBQWUsTUFBZixDQUFzQixNQUFNLElBQTVCLENBQWhCOztBQUVBLE9BQUksU0FBSixFQUFlO0FBQ2QsU0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLFVBQVUsTUFBM0IsRUFBbUMsSUFBSSxFQUF2QyxFQUEyQyxHQUEzQyxFQUFnRDtBQUMvQyxlQUFVLENBQVYsRUFBYSxLQUFiLENBQW1CLElBQW5CLEVBQXlCLENBQUMsS0FBRCxDQUF6QjtBQUNBO0FBQ0Q7QUFDRCxHQVREO0FBVUE7O0FBRUQsS0FBSSxFQUFFLFlBQUYsQ0FBZSxZQUFmLEtBQWdDLElBQXBDLEVBQTBDO0FBQ3pDLE1BQUksYUFBYSxFQUFqQjs7QUFFQSxVQUFRLEVBQUUsWUFBRixDQUFlLFlBQWYsQ0FBNEIsUUFBNUIsQ0FBcUMsV0FBckMsRUFBUjs7QUFFQyxRQUFLLFFBQUw7QUFDQyxlQUFXLElBQVgsQ0FBZ0I7QUFDZixXQUFNLEVBRFM7QUFFZixVQUFLLEVBQUUsWUFBRixDQUFlLFlBQWYsQ0FBNEIsWUFBNUIsQ0FBeUMsS0FBekM7QUFGVSxLQUFoQjs7QUFLQTs7QUFFRCxRQUFLLE9BQUw7QUFDQSxRQUFLLE9BQUw7QUFDQyxRQUNDLFVBREQ7QUFBQSxRQUVDLFlBRkQ7QUFBQSxRQUdDLGFBSEQ7QUFBQSxRQUlDLFVBQVUsRUFBRSxZQUFGLENBQWUsWUFBZixDQUE0QixVQUE1QixDQUF1QyxNQUpsRDtBQUFBLFFBS0MsYUFBYSxFQUFFLFlBQUYsQ0FBZSxZQUFmLENBQTRCLFlBQTVCLENBQXlDLEtBQXpDLENBTGQ7O0FBUUE7QUFDQSxRQUFJLFVBQUosRUFBZ0I7QUFDZixTQUFJLE9BQU8sRUFBRSxZQUFGLENBQWUsWUFBMUI7QUFDQSxnQkFBVyxJQUFYLENBQWdCO0FBQ2YsWUFBTSx1QkFBVyxVQUFYLEVBQXVCLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF2QixDQURTO0FBRWYsV0FBSztBQUZVLE1BQWhCO0FBSUE7O0FBRUQ7QUFDQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksT0FBaEIsRUFBeUIsR0FBekIsRUFBOEI7QUFDN0IsU0FBSSxFQUFFLFlBQUYsQ0FBZSxZQUFmLENBQTRCLFVBQTVCLENBQXVDLENBQXZDLENBQUo7QUFDQSxTQUFJLEVBQUUsUUFBRixLQUFlLEtBQUssWUFBcEIsSUFBb0MsRUFBRSxPQUFGLENBQVUsV0FBVixPQUE0QixRQUFwRSxFQUE4RTtBQUM3RSxZQUFNLEVBQUUsWUFBRixDQUFlLEtBQWYsQ0FBTjtBQUNBLGFBQU8sdUJBQVcsR0FBWCxFQUFnQixFQUFFLFlBQUYsQ0FBZSxNQUFmLENBQWhCLENBQVA7QUFDQSxpQkFBVyxJQUFYLENBQWdCLEVBQUMsTUFBTSxJQUFQLEVBQWEsS0FBSyxHQUFsQixFQUFoQjtBQUNBO0FBQ0Q7QUFDRDtBQXRDRjs7QUF5Q0EsTUFBSSxXQUFXLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsS0FBRSxZQUFGLENBQWUsR0FBZixHQUFxQixVQUFyQjtBQUNBO0FBQ0Q7O0FBRUQsS0FBSSxFQUFFLFlBQUYsQ0FBZSxPQUFmLENBQXVCLE9BQTNCLEVBQW9DO0FBQ25DLElBQUUsWUFBRixDQUFlLE9BQWYsQ0FBdUIsT0FBdkIsQ0FBK0IsRUFBRSxZQUFqQyxFQUErQyxFQUFFLFlBQUYsQ0FBZSxZQUE5RDtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQU8sRUFBRSxZQUFUO0FBQ0EsQzs7QUFHRixpQkFBTyxZQUFQLEdBQXNCLFlBQXRCOztrQkFFZSxZOzs7QUNsYWY7Ozs7OztBQUVBOzs7Ozs7QUFFQTtBQUNBLElBQUksT0FBTyxFQUFYOztBQUVBO0FBQ0EsS0FBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQTtBQUNBLEtBQUssVUFBTCxHQUFrQjtBQUNqQjs7O0FBR0EsYUFBWTtBQUNYO0FBQ0EsU0FGVyxFQUVELEtBRkMsRUFFTSxhQUZOLEVBRXFCLE9BRnJCOztBQUlYO0FBQ0EsV0FMVyxFQUtDLFFBTEQsRUFLVyxPQUxYOztBQU9YO0FBQ0EsUUFSVyxFQVFGLFlBUkUsRUFRWSxjQVJaLEVBUTRCLFNBUjVCLEVBUXVDLFVBUnZDLEVBUW1ELGVBUm5ELEVBUW9FLGNBUnBFLEVBUW9GLFlBUnBGLEVBUWtHLFNBUmxHLEVBU1gsYUFUVyxFQVNJLGlCQVRKLEVBU3VCLHFCQVR2QixFQVM4QyxjQVQ5QyxFQVM4RCxRQVQ5RCxFQVN3RSxVQVR4RSxFQVNvRixVQVRwRixFQVNnRyxNQVRoRyxFQVN3RyxVQVR4RyxDQUpLO0FBZWpCOzs7QUFHQSxVQUFTLENBQ1IsTUFEUSxFQUNBLE1BREEsRUFDUSxPQURSLEVBQ2lCLGFBRGpCLENBbEJRO0FBcUJqQjs7O0FBR0EsU0FBUSxDQUNQLFdBRE8sRUFDTSxVQUROLEVBQ2tCLFNBRGxCLEVBQzZCLE9BRDdCLEVBQ3NDLE9BRHRDLEVBQytDLFNBRC9DLEVBQzBELFNBRDFELEVBQ3FFLE1BRHJFLEVBQzZFLE9BRDdFLEVBQ3NGLGdCQUR0RixFQUVQLFlBRk8sRUFFTyxTQUZQLEVBRWtCLFNBRmxCLEVBRTZCLFNBRjdCLEVBRXdDLGdCQUZ4QyxFQUUwRCxTQUYxRCxFQUVxRSxRQUZyRSxFQUUrRSxZQUYvRSxFQUU2RixPQUY3RixFQUdQLFlBSE8sRUFHTyxnQkFIUCxFQUd5QixjQUh6QixDQXhCUztBQTZCakI7OztBQUdBLGFBQVksQ0FDWCxXQURXLEVBQ0UsV0FERixFQUNlLFdBRGYsRUFDNEIsV0FENUIsRUFDeUMsYUFEekMsRUFDd0QsWUFEeEQsRUFDc0UsZ0JBRHRFLEVBQ3dGLFlBRHhGLEVBQ3NHLFdBRHRHLEVBRVgsV0FGVyxFQUVFLFlBRkYsRUFFZ0IsV0FGaEI7QUFoQ0ssQ0FBbEI7O0FBc0NBLGlCQUFPLElBQVAsR0FBYyxJQUFkOztrQkFFZSxJOzs7QUNuRGY7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0FBRUE7Ozs7O0lBS00sUTtBQUVMLHFCQUFlO0FBQUE7O0FBQ2QsT0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsT0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBOztBQUVEOzs7Ozs7Ozs7O3NCQU1LLFEsRUFBVTs7QUFFZCxPQUFJLFNBQVMsSUFBVCxLQUFrQixTQUF0QixFQUFpQztBQUNoQyxVQUFNLElBQUksU0FBSixDQUFjLGdEQUFkLENBQU47QUFDQTs7QUFFRCxRQUFLLFNBQUwsQ0FBZSxTQUFTLElBQXhCLElBQWdDLFFBQWhDO0FBQ0EsUUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixTQUFTLElBQXpCO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7O3lCQVFRLFUsRUFBNEI7QUFBQSxPQUFoQixTQUFnQix1RUFBSixFQUFJOzs7QUFFbkMsZUFBWSxVQUFVLE1BQVYsR0FBbUIsU0FBbkIsR0FBOEIsS0FBSyxLQUEvQzs7QUFFQSxRQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxVQUFVLE1BQS9CLEVBQXVDLElBQUksRUFBM0MsRUFBK0MsR0FBL0MsRUFBb0Q7QUFDbkQsUUFDQyxNQUFNLFVBQVUsQ0FBVixDQURQO0FBQUEsUUFFQyxZQUFXLEtBQUssU0FBTCxDQUFlLEdBQWYsQ0FGWjs7QUFLQSxRQUFJLGNBQWEsSUFBYixJQUFxQixjQUFhLFNBQXRDLEVBQWlEO0FBQ2hELFVBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxLQUFLLFdBQVcsTUFBaEMsRUFBd0MsSUFBSSxFQUE1QyxFQUFnRCxHQUFoRCxFQUFxRDtBQUNwRCxVQUFJLE9BQU8sVUFBUyxXQUFoQixLQUFnQyxVQUFoQyxJQUE4QyxPQUFPLFdBQVcsQ0FBWCxFQUFjLElBQXJCLEtBQThCLFFBQTVFLElBQ0gsVUFBUyxXQUFULENBQXFCLFdBQVcsQ0FBWCxFQUFjLElBQW5DLENBREQsRUFDMkM7QUFDMUMsY0FBTztBQUNOLHNCQUFjLFVBQVMsSUFEakI7QUFFTixhQUFNLFdBQVcsQ0FBWCxFQUFjO0FBRmQsUUFBUDtBQUlBO0FBQ0Q7QUFDRDtBQUNEOztBQUVELFVBQU8sSUFBUDtBQUNBOztBQUVEOzs7O29CQUVVLEssRUFBTzs7QUFFaEIsT0FBSSxDQUFDLE1BQU0sT0FBTixDQUFjLEtBQWQsQ0FBTCxFQUEyQjtBQUMxQixVQUFNLElBQUksU0FBSixDQUFjLG9DQUFkLENBQU47QUFDQTs7QUFFRCxRQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsRztzQkFlVztBQUNYLFVBQU8sS0FBSyxNQUFaO0FBQ0E7OztvQkFmYSxTLEVBQVc7O0FBRXhCLE9BQUksY0FBYyxJQUFkLElBQXNCLFFBQU8sU0FBUCx5Q0FBTyxTQUFQLE9BQXFCLFFBQS9DLEVBQXlEO0FBQ3hELFVBQU0sSUFBSSxTQUFKLENBQWMsd0NBQWQsQ0FBTjtBQUNBOztBQUVELFFBQUssVUFBTCxHQUFrQixTQUFsQjtBQUNBLEc7c0JBRWU7QUFDZixVQUFPLEtBQUssVUFBWjtBQUNBOzs7Ozs7QUFPSyxJQUFJLDhCQUFXLElBQUksUUFBSixFQUFmOztBQUVQLGVBQUssU0FBTCxHQUFpQixRQUFqQjs7O0FDakdBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWSxROzs7Ozs7QUFHWjs7Ozs7OztBQU9BO0FBQ0EsT0FBTyxNQUFQLGlCQUFzQjtBQUNyQjs7O0FBR0Esc0JBQXFCLElBSkE7QUFLckI7OztBQUdBLGlCQUFnQjtBQVJLLENBQXRCOztBQVdBLE9BQU8sTUFBUCxDQUFjLGlCQUFtQixTQUFqQyxFQUE0Qzs7QUFFM0M7OztBQUdBLGVBQWMsS0FMNkI7QUFNM0M7OztBQUdBLHFCQUFvQixLQVR1QjtBQVUzQzs7O0FBR0EsYUFBWSxLQWIrQjtBQWMzQzs7O0FBR0EsOEJBQTZCLEtBakJjO0FBa0IzQzs7Ozs7Ozs7OztBQVVBLGlCQUFnQixFQTVCMkI7QUE2QjNDOzs7QUFHQSx1QkFBc0IsSUFoQ3FCOztBQWtDM0M7Ozs7Ozs7OztBQVNBLGtCQUFpQix5QkFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLEVBQW9DLEtBQXBDLEVBQTRDOztBQUU1RCxNQUFJLENBQUMsT0FBTyxPQUFaLEVBQXFCO0FBQ3BCO0FBQ0E7O0FBRUQsU0FBTyxVQUFQLEdBQXFCLGlCQUFPLFFBQVAsS0FBb0IsaUJBQU8sTUFBUCxDQUFjLFFBQXZEOztBQUVBO0FBQ0EsUUFBTSxnQkFBTixDQUF1QixXQUF2QixFQUFvQyxZQUFNO0FBQ3pDLFVBQU8sb0JBQVA7QUFDQSxHQUZEOztBQUlBO0FBQ0EsTUFDQyxJQUFJLElBREw7QUFBQSxNQUVDLGNBQWMsSUFGZjtBQUFBLE1BR0Msa0JBQWtCLEVBQUUsT0FBRixDQUFVLGNBQVYsR0FBMkIsRUFBRSxPQUFGLENBQVUsY0FBckMsR0FBc0QsZUFBSyxDQUFMLENBQU8saUJBQVAsQ0FIekU7QUFBQSxNQUlDLGdCQUNDLEVBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZUFBOEMsRUFBRSxPQUFGLENBQVUsV0FBeEQsc0VBQ3VDLEVBQUUsRUFEekMsaUJBQ3VELGVBRHZELHNCQUN1RixlQUR2Riw0QkFBRixFQUdDLFFBSEQsQ0FHVSxRQUhWLEVBSUMsRUFKRCxDQUlJLE9BSkosRUFJYSxZQUFNOztBQUVsQjtBQUNBLE9BQUksZUFBZ0IsU0FBUywwQkFBVCxJQUF1QyxTQUFTLGFBQWpELElBQW1FLE9BQU8sWUFBN0Y7O0FBRUEsT0FBSSxZQUFKLEVBQWtCO0FBQ2pCLFdBQU8sY0FBUDtBQUNBLElBRkQsTUFFTztBQUNOLFdBQU8sZUFBUDtBQUNBO0FBQ0QsR0FkRCxFQWVDLEVBZkQsQ0FlSSxXQWZKLEVBZWlCLFlBQU07O0FBRXRCO0FBQ0EsT0FBSSxFQUFFLGNBQUYsS0FBcUIsY0FBekIsRUFBeUM7QUFDeEMsUUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDekIsa0JBQWEsV0FBYjtBQUNBLG1CQUFjLElBQWQ7QUFDQTs7QUFFRCxRQUFJLFlBQVksY0FBYyxNQUFkLEVBQWhCO0FBQUEsUUFDQyxlQUFlLE9BQU8sU0FBUCxDQUFpQixNQUFqQixFQURoQjs7QUFHQSxVQUFNLHdCQUFOLENBQStCLFVBQVUsSUFBVixHQUFpQixhQUFhLElBQTdELEVBQW1FLFVBQVUsR0FBVixHQUFnQixhQUFhLEdBQWhHLEVBQXFHLElBQXJHO0FBQ0E7QUFFRCxHQTlCRCxFQStCQyxFQS9CRCxDQStCSSxVQS9CSixFQStCZ0IsWUFBTTs7QUFFckIsT0FBSSxFQUFFLGNBQUYsS0FBcUIsY0FBekIsRUFBeUM7QUFDeEMsUUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDekIsa0JBQWEsV0FBYjtBQUNBOztBQUVELGtCQUFjLFdBQVcsWUFBTTtBQUM5QixXQUFNLG9CQUFOO0FBQ0EsS0FGYSxFQUVYLElBRlcsQ0FBZDtBQUdBO0FBRUQsR0EzQ0QsQ0FMRjs7QUFtREEsU0FBTyxhQUFQLEdBQXVCLGFBQXZCOztBQUVBLElBQUUsVUFBRixDQUFhLFNBQWIsRUFBd0IsVUFBQyxDQUFELEVBQU87QUFDOUIsT0FBSSxNQUFNLEVBQUUsS0FBRixJQUFXLEVBQUUsT0FBYixJQUF3QixDQUFsQztBQUNBLE9BQUksUUFBUSxFQUFSLEtBQWdCLFNBQVMsMEJBQVQsSUFBdUMsU0FBUyxhQUFqRCxJQUFtRSxFQUFFLFlBQXBGLENBQUosRUFBdUc7QUFDdEcsV0FBTyxjQUFQO0FBQ0E7QUFDRCxHQUxEOztBQU9BLElBQUUsWUFBRixHQUFpQixDQUFqQjtBQUNBLElBQUUsV0FBRixHQUFnQixDQUFoQjs7QUFFQTtBQUNBLE1BQUksU0FBUywwQkFBYixFQUF5Qzs7QUFFeEM7QUFDQTs7Ozs7O0FBTUEsT0FBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLEdBQU07QUFDL0IsUUFBSSxPQUFPLFlBQVgsRUFBeUI7QUFDeEIsU0FBSSxTQUFTLFlBQVQsRUFBSixFQUE2QjtBQUM1QixhQUFPLGtCQUFQLEdBQTRCLElBQTVCO0FBQ0E7QUFDQSxhQUFPLGVBQVA7QUFDQSxNQUpELE1BSU87QUFDTixhQUFPLGtCQUFQLEdBQTRCLEtBQTVCO0FBQ0E7QUFDQTtBQUNBLGFBQU8sY0FBUDtBQUNBO0FBQ0Q7QUFDRCxJQWJEOztBQWVBLFVBQU8sVUFBUCxDQUFrQixTQUFTLHFCQUEzQixFQUFrRCxpQkFBbEQ7QUFDQTtBQUVELEVBcEowQzs7QUFzSjNDOzs7OztBQUtBLHVCQUFzQixnQ0FBYTs7QUFFbEMsTUFDQyxJQUFJLElBREw7QUFBQSxNQUVDLE9BQU8sRUFGUjtBQUFBLE1BR0MsV0FBVyxFQUFFLEtBQUYsQ0FBUSxZQUFSLEtBQXlCLElBQXpCLElBQWlDLEVBQUUsS0FBRixDQUFRLFlBQVIsQ0FBcUIsS0FBckIsQ0FBMkIsZ0JBQTNCLE1BQWlELElBSDlGOztBQU1BLE1BQUksU0FBUywwQkFBVCxJQUF1QyxRQUEzQyxFQUFxRDtBQUNwRCxVQUFPLGVBQVA7QUFDQSxHQUZELE1BRU8sSUFBSSxTQUFTLDBCQUFULElBQXVDLENBQUMsUUFBNUMsRUFBc0Q7QUFDNUQsVUFBTyxlQUFQO0FBQ0EsR0FGTSxNQUVBLElBQUksRUFBRSxtQkFBTixFQUEyQjtBQUNqQyxPQUFJLFNBQVMsc0JBQWIsRUFBcUM7QUFDcEMsV0FBTyxjQUFQO0FBQ0E7QUFDQSxNQUFFLHdCQUFGO0FBQ0EsSUFKRCxNQUlPO0FBQ04sV0FBTyxjQUFQO0FBQ0E7QUFFRCxHQVRNLE1BU0E7QUFDTixVQUFPLFlBQVA7QUFDQTs7QUFHRCxJQUFFLGNBQUYsR0FBbUIsSUFBbkI7QUFDQSxTQUFPLElBQVA7QUFDQSxFQXZMMEM7O0FBeUwzQzs7O0FBR0EsMkJBQTBCLG9DQUFhOztBQUV0QyxNQUFJLElBQUksSUFBUjs7QUFFQTtBQUNBLE1BQUksRUFBRSwyQkFBTixFQUFtQztBQUNsQztBQUNBOztBQUVEOztBQUVBOzs7Ozs7QUFNQSxNQUFJLHVCQUF1QixLQUEzQjtBQUFBLE1BQ0Msa0JBQWtCLFNBQWxCLGVBQWtCLEdBQU07QUFDdkIsT0FBSSxvQkFBSixFQUEwQjtBQUN6QjtBQUNBLFNBQUssSUFBSSxDQUFULElBQWMsU0FBZCxFQUF5QjtBQUN4QixlQUFVLENBQVYsRUFBYSxJQUFiO0FBQ0E7O0FBRUQ7QUFDQSxNQUFFLGFBQUYsQ0FBZ0IsR0FBaEIsQ0FBb0IsZ0JBQXBCLEVBQXNDLEVBQXRDO0FBQ0EsTUFBRSxRQUFGLENBQVcsR0FBWCxDQUFlLGdCQUFmLEVBQWlDLEVBQWpDOztBQUVBO0FBQ0EsTUFBRSxLQUFGLENBQVEsbUJBQVIsQ0FBNEIsT0FBNUIsRUFBcUMsRUFBRSx3QkFBdkM7O0FBRUE7QUFDQSwyQkFBdUIsS0FBdkI7QUFDQTtBQUNELEdBbEJGO0FBQUEsTUFtQkMsWUFBWSxFQW5CYjtBQUFBLE1Bb0JDLGdCQUFnQixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLENBcEJqQjtBQUFBLE1BcUJDLG9CQUFvQixTQUFwQixpQkFBb0IsR0FBTTtBQUN6QixPQUFJLDBCQUEwQixjQUFjLE1BQWQsR0FBdUIsSUFBdkIsR0FBOEIsRUFBRSxTQUFGLENBQVksTUFBWixHQUFxQixJQUFqRjtBQUFBLE9BQ0MseUJBQXlCLGNBQWMsTUFBZCxHQUF1QixHQUF2QixHQUE2QixFQUFFLFNBQUYsQ0FBWSxNQUFaLEdBQXFCLEdBRDVFO0FBQUEsT0FFQyxxQkFBcUIsY0FBYyxVQUFkLENBQXlCLElBQXpCLENBRnRCO0FBQUEsT0FHQyxzQkFBc0IsY0FBYyxXQUFkLENBQTBCLElBQTFCLENBSHZCO0FBQUEsT0FJQyxpQkFBaUIsRUFBRSxTQUFGLENBQVksS0FBWixFQUpsQjtBQUFBLE9BS0Msa0JBQWtCLEVBQUUsU0FBRixDQUFZLE1BQVosRUFMbkI7O0FBT0EsUUFBSyxJQUFJLEtBQVQsSUFBa0IsU0FBbEIsRUFBNkI7QUFDNUIsVUFBTSxHQUFOLENBQVUsRUFBQyxVQUFVLFVBQVgsRUFBdUIsS0FBSyxDQUE1QixFQUErQixNQUFNLENBQXJDLEVBQVYsRUFENEIsQ0FDd0I7QUFDcEQ7O0FBRUQ7QUFDQSxhQUFVLEdBQVYsQ0FDRSxLQURGLENBQ1EsY0FEUixFQUVFLE1BRkYsQ0FFUyxzQkFGVDs7QUFJQTtBQUNBLGFBQVUsSUFBVixDQUNFLEtBREYsQ0FDUSx1QkFEUixFQUVFLE1BRkYsQ0FFUyxtQkFGVCxFQUdFLEdBSEYsQ0FHTSxFQUFDLEtBQUssc0JBQU4sRUFITjs7QUFLQTtBQUNBLGFBQVUsS0FBVixDQUNFLEtBREYsQ0FDUSxpQkFBaUIsdUJBQWpCLEdBQTJDLGtCQURuRCxFQUVFLE1BRkYsQ0FFUyxtQkFGVCxFQUdFLEdBSEYsQ0FHTTtBQUNKLFNBQUssc0JBREQ7QUFFSixVQUFNLDBCQUEwQjtBQUY1QixJQUhOOztBQVFBO0FBQ0EsYUFBVSxNQUFWLENBQ0UsS0FERixDQUNRLGNBRFIsRUFFRSxNQUZGLENBRVMsa0JBQWtCLG1CQUFsQixHQUF3QyxzQkFGakQsRUFHRSxHQUhGLENBR00sRUFBQyxLQUFLLHlCQUF5QixtQkFBL0IsRUFITjtBQUlBLEdBMURGOztBQTREQSxJQUFFLFVBQUYsQ0FBYSxRQUFiLEVBQXVCLFlBQU07QUFDNUI7QUFDQSxHQUZEOztBQUlBLE9BQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLGNBQWMsTUFBcEMsRUFBNEMsSUFBSSxHQUFoRCxFQUFxRCxHQUFyRCxFQUEwRDtBQUN6RCxhQUFVLGNBQWMsQ0FBZCxDQUFWLElBQThCLG1CQUFpQixFQUFFLE9BQUYsQ0FBVSxXQUEzQiwyQkFDNUIsUUFENEIsQ0FDbkIsRUFBRSxTQURpQixFQUNOLFNBRE0sQ0FDSSxlQURKLEVBQ3FCLElBRHJCLEVBQTlCO0FBRUE7O0FBRUQ7QUFDQSxnQkFBYyxFQUFkLENBQWlCLFdBQWpCLEVBQThCLFlBQU07O0FBRW5DLE9BQUksQ0FBQyxFQUFFLFlBQVAsRUFBcUI7O0FBRXBCLFFBQUksWUFBWSxjQUFjLE1BQWQsRUFBaEI7QUFBQSxRQUNDLGVBQWUsT0FBTyxTQUFQLENBQWlCLE1BQWpCLEVBRGhCOztBQUdBO0FBQ0EsVUFBTSx3QkFBTixDQUErQixVQUFVLElBQVYsR0FBaUIsYUFBYSxJQUE3RCxFQUFtRSxVQUFVLEdBQVYsR0FBZ0IsYUFBYSxHQUFoRyxFQUFxRyxLQUFyRzs7QUFFQTtBQUNBLE1BQUUsYUFBRixDQUFnQixHQUFoQixDQUFvQixnQkFBcEIsRUFBc0MsTUFBdEM7QUFDQSxNQUFFLFFBQUYsQ0FBVyxHQUFYLENBQWUsZ0JBQWYsRUFBaUMsTUFBakM7O0FBRUE7QUFDQSxNQUFFLEtBQUYsQ0FBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxFQUFFLHdCQUFwQzs7QUFFQTtBQUNBLFNBQUssSUFBSSxFQUFULElBQWMsU0FBZCxFQUF5QjtBQUN4QixlQUFVLEVBQVYsRUFBYSxJQUFiO0FBQ0E7O0FBRUQ7O0FBRUEsMkJBQXVCLElBQXZCO0FBQ0E7QUFFRCxHQTNCRDs7QUE2QkE7QUFDQSxRQUFNLGdCQUFOLENBQXVCLGtCQUF2QixFQUEyQyxZQUFNO0FBQ2hELEtBQUUsWUFBRixHQUFpQixDQUFDLEVBQUUsWUFBcEI7QUFDQTtBQUNBO0FBQ0EsT0FBSSxFQUFFLFlBQU4sRUFBb0I7QUFDbkIsTUFBRSxLQUFGLENBQVEsbUJBQVIsQ0FBNEIsT0FBNUIsRUFBcUMsRUFBRSx3QkFBdkM7QUFDQSxJQUZELE1BRU87QUFDTixNQUFFLEtBQUYsQ0FBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxFQUFFLHdCQUFwQztBQUNBO0FBQ0Q7QUFDQSxHQVZEOztBQWFBO0FBQ0E7O0FBRUEsSUFBRSxVQUFGLENBQWEsV0FBYixFQUEwQixVQUFDLENBQUQsRUFBTzs7QUFFaEM7QUFDQSxPQUFJLG9CQUFKLEVBQTBCOztBQUV6QixRQUFNLG1CQUFtQixjQUFjLE1BQWQsRUFBekI7O0FBRUEsUUFBSSxFQUFFLEtBQUYsR0FBVSxpQkFBaUIsR0FBM0IsSUFBa0MsRUFBRSxLQUFGLEdBQVUsaUJBQWlCLEdBQWpCLEdBQXVCLGNBQWMsV0FBZCxDQUEwQixJQUExQixDQUFuRSxJQUNILEVBQUUsS0FBRixHQUFVLGlCQUFpQixJQUR4QixJQUNnQyxFQUFFLEtBQUYsR0FBVSxpQkFBaUIsSUFBakIsR0FBd0IsY0FBYyxVQUFkLENBQXlCLElBQXpCLENBRHRFLEVBQ3NHOztBQUVyRyxtQkFBYyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxFQUFwQztBQUNBLE9BQUUsUUFBRixDQUFXLEdBQVgsQ0FBZSxnQkFBZixFQUFpQyxFQUFqQzs7QUFFQSw0QkFBdUIsS0FBdkI7QUFDQTtBQUNEO0FBQ0QsR0FoQkQ7O0FBbUJBLElBQUUsMkJBQUYsR0FBZ0MsSUFBaEM7QUFDQSxFQXJWMEM7QUFzVjNDOzs7Ozs7QUFNQSxrQkFBaUIseUJBQVUsTUFBVixFQUFtQjtBQUNuQyxTQUFPLGNBQVA7QUFDQSxFQTlWMEM7O0FBZ1czQzs7O0FBR0Esa0JBQWlCLDJCQUFhOztBQUU3QixNQUNDLElBQUksSUFETDtBQUFBLE1BRUMsV0FBVyxFQUFFLEtBQUYsQ0FBUSxZQUFSLEtBQXlCLElBQXpCLElBQWlDLEVBQUUsS0FBRixDQUFRLFlBQVIsQ0FBcUIsS0FBckIsQ0FBMkIsZ0JBQTNCLE1BQWlELElBRjlGOztBQUtBLE1BQUksU0FBUyxNQUFULElBQW1CLFNBQVMsa0JBQTVCLElBQWtELE9BQU8sRUFBRSxLQUFGLENBQVEscUJBQWYsS0FBeUMsVUFBL0YsRUFBMkc7QUFDMUcsS0FBRSxLQUFGLENBQVEscUJBQVI7QUFDQTtBQUNBOztBQUVEO0FBQ0EsSUFBRSxtQkFBUyxlQUFYLEVBQTRCLFFBQTVCLENBQXdDLEVBQUUsT0FBRixDQUFVLFdBQWxEOztBQUVBO0FBQ0EsSUFBRSxZQUFGLEdBQWlCLEVBQUUsU0FBRixDQUFZLE1BQVosRUFBakI7QUFDQSxJQUFFLFdBQUYsR0FBZ0IsRUFBRSxTQUFGLENBQVksS0FBWixFQUFoQjs7QUFHQTtBQUNBLE1BQUksRUFBRSxjQUFGLEtBQXFCLGVBQXJCLElBQXdDLEVBQUUsY0FBRixLQUFxQixlQUFqRSxFQUFrRjs7QUFFakYsWUFBUyxpQkFBVCxDQUEyQixFQUFFLFNBQUYsQ0FBWSxDQUFaLENBQTNCOztBQUVBLE9BQUksRUFBRSxVQUFOLEVBQWtCO0FBQ2pCO0FBQ0E7QUFDQSxlQUFXLFNBQVMsZUFBVCxHQUE0Qjs7QUFFdEMsU0FBSSxFQUFFLGtCQUFOLEVBQTBCO0FBQ3pCLFVBQUkscUJBQXFCLEtBQXpCO0FBQUEsVUFBZ0M7QUFDL0Isb0JBQWMsb0JBQVUsS0FBVixFQURmO0FBQUEsVUFFQyxjQUFjLE9BQU8sS0FGdEI7QUFBQSxVQUdDLFVBQVUsS0FBSyxHQUFMLENBQVMsY0FBYyxXQUF2QixDQUhYO0FBQUEsVUFJQyxjQUFjLGNBQWMsa0JBSjdCOztBQU1BO0FBQ0EsVUFBSSxVQUFVLFdBQWQsRUFBMkI7QUFDMUI7QUFDQSxTQUFFLGNBQUY7QUFDQSxPQUhELE1BR087QUFDTjtBQUNBLGtCQUFXLGVBQVgsRUFBNEIsR0FBNUI7QUFDQTtBQUNEO0FBRUQsS0FuQkQsRUFtQkcsSUFuQkg7QUFvQkE7QUFFRCxHQTdCRCxNQTZCTyxJQUFJLEVBQUUsYUFBRixLQUFvQixZQUF4QixFQUFzQyxDQUc1QztBQUZBOztBQUlEO0FBQ0EsSUFBRSxTQUFGLENBQ0UsUUFERixDQUNjLEVBQUUsT0FBRixDQUFVLFdBRHhCLDJCQUVFLEtBRkYsQ0FFUSxNQUZSLEVBR0UsTUFIRixDQUdTLE1BSFQ7O0FBS0E7QUFDQTtBQUNBLElBQUUsb0JBQUYsR0FBeUIsV0FBVyxZQUFNO0FBQ3pDLEtBQUUsU0FBRixDQUFZLEdBQVosQ0FBZ0IsRUFBQyxPQUFPLE1BQVIsRUFBZ0IsUUFBUSxNQUF4QixFQUFoQjtBQUNBLEtBQUUsZUFBRjtBQUNBLEdBSHdCLEVBR3RCLEdBSHNCLENBQXpCOztBQUtBLE1BQUksUUFBSixFQUFjO0FBQ2IsS0FBRSxNQUFGLENBQ0UsS0FERixDQUNRLE1BRFIsRUFFRSxNQUZGLENBRVMsTUFGVDtBQUdBLEdBSkQsTUFJTztBQUNOLEtBQUUsU0FBRixDQUFZLElBQVosQ0FBaUIsOEJBQWpCLEVBQ0UsS0FERixDQUNRLE1BRFIsRUFFRSxNQUZGLENBRVMsTUFGVDtBQUdBOztBQUVELE1BQUksRUFBRSxPQUFGLENBQVUsYUFBZCxFQUE2QjtBQUM1QixLQUFFLEtBQUYsQ0FBUSxPQUFSLENBQWdCLE9BQU8sS0FBdkIsRUFBOEIsT0FBTyxNQUFyQztBQUNBOztBQUVELElBQUUsTUFBRixDQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFDRSxLQURGLENBQ1EsTUFEUixFQUVFLE1BRkYsQ0FFUyxNQUZUOztBQUlBLE1BQUksRUFBRSxhQUFOLEVBQXFCO0FBQ3BCLEtBQUUsYUFBRixDQUNFLFdBREYsQ0FDaUIsRUFBRSxPQUFGLENBQVUsV0FEM0IsaUJBRUUsUUFGRixDQUVjLEVBQUUsT0FBRixDQUFVLFdBRnhCO0FBR0E7O0FBRUQsSUFBRSxlQUFGO0FBQ0EsSUFBRSxZQUFGLEdBQWlCLElBQWpCOztBQUVBLE1BQUksYUFBYSxLQUFLLEdBQUwsQ0FBUyxPQUFPLEtBQVAsR0FBZSxFQUFFLEtBQTFCLEVBQWlDLE9BQU8sTUFBUCxHQUFnQixFQUFFLE1BQW5ELENBQWpCO0FBQ0EsSUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQixvQkFBMkQsR0FBM0QsQ0FBK0QsV0FBL0QsRUFBNEUsYUFBYSxHQUFiLEdBQW1CLEdBQS9GO0FBQ0EsSUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQixvQkFBMkQsR0FBM0QsQ0FBK0QsYUFBL0QsRUFBOEUsUUFBOUU7QUFDQSxJQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLHdCQUErRCxHQUEvRCxDQUFtRSxRQUFuRSxFQUE2RSxNQUE3RTs7QUFFQSxJQUFFLFNBQUYsQ0FBWSxPQUFaLENBQW9CLG1CQUFwQjtBQUNBLEVBeGMwQzs7QUEwYzNDOzs7QUFHQSxpQkFBZ0IsMEJBQWE7O0FBRTVCLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxXQUFXLEVBQUUsS0FBRixDQUFRLFlBQVIsS0FBeUIsSUFBekIsSUFBaUMsRUFBRSxLQUFGLENBQVEsWUFBUixDQUFxQixLQUFyQixDQUEyQixnQkFBM0IsTUFBaUQsSUFGOUY7O0FBS0E7QUFDQSxlQUFhLEVBQUUsb0JBQWY7O0FBRUE7QUFDQSxNQUFJLFNBQVMsMEJBQVQsS0FBd0MsU0FBUyxhQUFULElBQTBCLEVBQUUsWUFBcEUsQ0FBSixFQUF1RjtBQUN0RixZQUFTLGdCQUFUO0FBQ0E7O0FBRUQ7QUFDQSxJQUFFLG1CQUFTLGVBQVgsRUFBNEIsV0FBNUIsQ0FBMkMsRUFBRSxPQUFGLENBQVUsV0FBckQ7O0FBRUEsSUFBRSxTQUFGLENBQVksV0FBWixDQUEyQixFQUFFLE9BQUYsQ0FBVSxXQUFyQzs7QUFFQSxNQUFJLEVBQUUsT0FBRixDQUFVLGFBQWQsRUFBNkI7QUFDNUIsS0FBRSxTQUFGLENBQ0UsS0FERixDQUNRLEVBQUUsV0FEVixFQUVFLE1BRkYsQ0FFUyxFQUFFLFlBRlg7QUFHQSxPQUFJLFFBQUosRUFBYztBQUNiLE1BQUUsTUFBRixDQUNDLEtBREQsQ0FDTyxFQUFFLFdBRFQsRUFFQyxNQUZELENBRVEsRUFBRSxZQUZWO0FBR0EsSUFKRCxNQUlPO0FBQ04sTUFBRSxTQUFGLENBQVksSUFBWixDQUFpQiw4QkFBakIsRUFDRSxLQURGLENBQ1EsRUFBRSxXQURWLEVBRUUsTUFGRixDQUVTLEVBQUUsWUFGWDtBQUdBOztBQUVELEtBQUUsS0FBRixDQUFRLE9BQVIsQ0FBZ0IsRUFBRSxXQUFsQixFQUErQixFQUFFLFlBQWpDOztBQUVBLEtBQUUsTUFBRixDQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFDRSxLQURGLENBQ1EsRUFBRSxXQURWLEVBRUUsTUFGRixDQUVTLEVBQUUsWUFGWDtBQUdBOztBQUVELElBQUUsYUFBRixDQUNFLFdBREYsQ0FDaUIsRUFBRSxPQUFGLENBQVUsV0FEM0IsbUJBRUUsUUFGRixDQUVjLEVBQUUsT0FBRixDQUFVLFdBRnhCOztBQUlBLElBQUUsZUFBRjtBQUNBLElBQUUsWUFBRixHQUFpQixLQUFqQjs7QUFFQSxJQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLG9CQUEyRCxHQUEzRCxDQUErRCxXQUEvRCxFQUE0RSxFQUE1RTtBQUNBLElBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0Isb0JBQTJELEdBQTNELENBQStELGFBQS9ELEVBQThFLEVBQTlFO0FBQ0EsSUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQix3QkFBK0QsR0FBL0QsQ0FBbUUsUUFBbkUsRUFBNkUsRUFBN0U7O0FBRUEsSUFBRSxTQUFGLENBQVksT0FBWixDQUFvQixrQkFBcEI7QUFDQTtBQWxnQjBDLENBQTVDOzs7QUM5QkE7O0FBRUE7Ozs7QUFFQTs7Ozs7O0FBRUE7Ozs7Ozs7QUFRQTtBQUNBLE9BQU8sTUFBUCxpQkFBc0I7QUFDckI7OztBQUdBLFdBQVUsRUFKVztBQUtyQjs7O0FBR0EsWUFBVztBQVJVLENBQXRCOztBQVdBLE9BQU8sTUFBUCxDQUFjLGlCQUFtQixTQUFqQyxFQUE0QztBQUMzQzs7Ozs7Ozs7OztBQVVBLGlCQUFnQix3QkFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLEVBQW9DLEtBQXBDLEVBQTRDO0FBQzNELE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxLQUFLLEVBQUUsT0FGUjtBQUFBLE1BR0MsWUFBWSxHQUFHLFFBQUgsR0FBYyxHQUFHLFFBQWpCLEdBQTRCLGVBQUssQ0FBTCxDQUFPLFdBQVAsQ0FIekM7QUFBQSxNQUlDLGFBQWEsR0FBRyxTQUFILEdBQWUsR0FBRyxTQUFsQixHQUE4QixlQUFLLENBQUwsQ0FBTyxZQUFQLENBSjVDO0FBQUEsTUFLQyxPQUNDLEVBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZUFBOEMsRUFBRSxPQUFGLENBQVUsV0FBeEQsMEJBQ0UsRUFBRSxPQUFGLENBQVUsV0FEWiwwREFFdUMsRUFBRSxFQUZ6QyxpQkFFdUQsU0FGdkQsc0JBRWlGLFVBRmpGLDRCQUFGLEVBSUMsUUFKRCxDQUlVLFFBSlYsRUFLQyxLQUxELENBS08sWUFBTTtBQUNaLE9BQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2pCLFVBQU0sSUFBTjtBQUNBLElBRkQsTUFFTztBQUNOLFVBQU0sS0FBTjtBQUNBO0FBQ0QsR0FYRCxDQU5GO0FBQUEsTUFrQkMsV0FBVyxLQUFLLElBQUwsQ0FBVSxRQUFWLENBbEJaOztBQXFCQTs7OztBQUlBLFdBQVMsZUFBVCxDQUEwQixLQUExQixFQUFpQztBQUNoQyxPQUFJLFdBQVcsS0FBZixFQUFzQjtBQUNyQixTQUFLLFdBQUwsQ0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsV0FDQyxXQURELENBQ2dCLEVBQUUsT0FBRixDQUFVLFdBRDFCLGFBRUMsUUFGRCxDQUVhLEVBQUUsT0FBRixDQUFVLFdBRnZCO0FBR0EsYUFBUyxJQUFULENBQWM7QUFDYixjQUFTLFVBREk7QUFFYixtQkFBYztBQUZELEtBQWQ7QUFJQSxJQVJELE1BUU87QUFDTixTQUFLLFdBQUwsQ0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsWUFDQyxXQURELENBQ2dCLEVBQUUsT0FBRixDQUFVLFdBRDFCLGFBRUMsUUFGRCxDQUVhLEVBQUUsT0FBRixDQUFVLFdBRnZCO0FBR0EsYUFBUyxJQUFULENBQWM7QUFDYixjQUFTLFNBREk7QUFFYixtQkFBYztBQUZELEtBQWQ7QUFJQTtBQUNEOztBQUVELGtCQUFnQixLQUFoQjs7QUFFQSxRQUFNLGdCQUFOLENBQXVCLE1BQXZCLEVBQStCLFlBQU07QUFDcEMsbUJBQWdCLE1BQWhCO0FBQ0EsR0FGRCxFQUVHLEtBRkg7QUFHQSxRQUFNLGdCQUFOLENBQXVCLFNBQXZCLEVBQWtDLFlBQU07QUFDdkMsbUJBQWdCLE1BQWhCO0FBQ0EsR0FGRCxFQUVHLEtBRkg7O0FBS0EsUUFBTSxnQkFBTixDQUF1QixPQUF2QixFQUFnQyxZQUFNO0FBQ3JDLG1CQUFnQixLQUFoQjtBQUNBLEdBRkQsRUFFRyxLQUZIO0FBR0EsUUFBTSxnQkFBTixDQUF1QixRQUF2QixFQUFpQyxZQUFNO0FBQ3RDLG1CQUFnQixLQUFoQjtBQUNBLEdBRkQsRUFFRyxLQUZIOztBQUlBLFFBQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsWUFBTTs7QUFFckMsT0FBSSxDQUFDLE9BQU8sT0FBUCxDQUFlLElBQXBCLEVBQTBCO0FBQ3pCLFNBQUssV0FBTCxDQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QixZQUNDLFdBREQsQ0FDZ0IsRUFBRSxPQUFGLENBQVUsV0FEMUIsV0FFQyxRQUZELENBRWEsRUFBRSxPQUFGLENBQVUsV0FGdkI7QUFHQTtBQUVELEdBUkQsRUFRRyxLQVJIO0FBU0E7QUFuRjBDLENBQTVDOzs7QUMxQkE7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7OztBQU9BO0FBQ0EsT0FBTyxNQUFQLGlCQUFzQjtBQUNyQjs7OztBQUlBLHdCQUF1QjtBQUxGLENBQXRCOztBQVFBLE9BQU8sTUFBUCxDQUFjLGlCQUFtQixTQUFqQyxFQUE0Qzs7QUFFM0M7Ozs7Ozs7OztBQVNBLGdCQUFlLHVCQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBcEMsRUFBNEM7O0FBRTFELE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxjQUFjLEtBRmY7QUFBQSxNQUdDLGNBQWMsS0FIZjtBQUFBLE1BSUMsbUJBQW1CLENBSnBCO0FBQUEsTUFLQyxnQkFBZ0IsS0FMakI7QUFBQSxNQU1DLG9CQUFvQixPQUFPLE9BQVAsQ0FBZSxVQU5wQztBQUFBLE1BT0MsVUFBVSxPQUFPLE9BQVAsQ0FBZSxxQkFBZixHQUNULGtCQUFnQixFQUFFLE9BQUYsQ0FBVSxXQUExQix1Q0FDaUIsRUFBRSxPQUFGLENBQVUsV0FEM0IsNERBRWlCLEVBQUUsT0FBRixDQUFVLFdBRjNCLDRDQURTLEdBSUcsRUFYZDs7QUFhQSxJQUFFLGlCQUFlLEVBQUUsT0FBRixDQUFVLFdBQXpCLHNDQUNlLEVBQUUsT0FBRixDQUFVLFdBRHpCLG1CQUNrRCxFQUFFLE9BQUYsQ0FBVSxXQUQ1RCx5Q0FFZ0IsRUFBRSxPQUFGLENBQVUsV0FGMUIsbURBR2dCLEVBQUUsT0FBRixDQUFVLFdBSDFCLGdEQUlnQixFQUFFLE9BQUYsQ0FBVSxXQUoxQixpREFLZ0IsRUFBRSxPQUFGLENBQVUsV0FMMUIsbUNBTUcsT0FOSCx3QkFBRixFQVNDLFFBVEQsQ0FTVSxRQVRWO0FBVUEsV0FBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLHFCQUF5RCxJQUF6RDs7QUFFQSxJQUFFLElBQUYsR0FBUyxTQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIsZUFBVDtBQUNBLElBQUUsS0FBRixHQUFVLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixnQkFBVjtBQUNBLElBQUUsTUFBRixHQUFXLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixpQkFBWDtBQUNBLElBQUUsT0FBRixHQUFZLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixrQkFBWjtBQUNBLElBQUUsTUFBRixHQUFXLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixpQkFBWDtBQUNBLElBQUUsU0FBRixHQUFjLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixnQkFBZDtBQUNBLElBQUUsZ0JBQUYsR0FBcUIsU0FBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLHdCQUFyQjtBQUNBLElBQUUsTUFBRixHQUFXLFNBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixpQkFBWDs7QUFFQTs7Ozs7QUFLQSxNQUFJLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLENBQUQsRUFBTzs7QUFFM0IsT0FBSSxTQUFTLEVBQUUsS0FBRixDQUFRLE1BQVIsRUFBYjtBQUFBLE9BQ0MsUUFBUSxFQUFFLEtBQUYsQ0FBUSxLQUFSLEVBRFQ7QUFBQSxPQUVDLGFBQWEsQ0FGZDtBQUFBLE9BR0MsVUFBVSxDQUhYO0FBQUEsT0FJQyxNQUFNLENBSlA7QUFBQSxPQUtDLFVBTEQ7O0FBUUE7QUFDQSxPQUFJLEVBQUUsYUFBRixJQUFtQixFQUFFLGFBQUYsQ0FBZ0IsY0FBdkMsRUFBdUQ7QUFDdEQsUUFBSSxFQUFFLGFBQUYsQ0FBZ0IsY0FBaEIsQ0FBK0IsQ0FBL0IsRUFBa0MsS0FBdEM7QUFDQSxJQUZELE1BRU8sSUFBSSxFQUFFLGNBQU4sRUFBc0I7QUFBRTtBQUM5QixRQUFJLEVBQUUsY0FBRixDQUFpQixDQUFqQixFQUFvQixLQUF4QjtBQUNBLElBRk0sTUFFQTtBQUNOLFFBQUksRUFBRSxLQUFOO0FBQ0E7O0FBRUQsT0FBSSxNQUFNLFFBQVYsRUFBb0I7QUFDbkIsUUFBSSxJQUFJLE9BQU8sSUFBZixFQUFxQjtBQUNwQixTQUFJLE9BQU8sSUFBWDtBQUNBLEtBRkQsTUFFTyxJQUFJLElBQUksUUFBUSxPQUFPLElBQXZCLEVBQTZCO0FBQ25DLFNBQUksUUFBUSxPQUFPLElBQW5CO0FBQ0E7O0FBRUQsVUFBTSxJQUFJLE9BQU8sSUFBakI7QUFDQSxpQkFBYyxNQUFNLEtBQXBCO0FBQ0EsY0FBVyxjQUFjLElBQWYsR0FBdUIsQ0FBdkIsR0FBMkIsYUFBYSxNQUFNLFFBQXhEOztBQUVBO0FBQ0EsUUFBSSxlQUFlLFFBQVEsT0FBUixDQUFnQixDQUFoQixNQUF1QixNQUFNLFdBQU4sQ0FBa0IsT0FBbEIsQ0FBMEIsQ0FBMUIsQ0FBMUMsRUFBd0U7QUFDdkUsV0FBTSxjQUFOLENBQXFCLE9BQXJCO0FBQ0E7O0FBRUQ7QUFDQSxRQUFJLHFCQUFKLEVBQWdCO0FBQ2YsT0FBRSxTQUFGLENBQVksR0FBWixDQUFnQixNQUFoQixFQUF3QixHQUF4QjtBQUNBLE9BQUUsZ0JBQUYsQ0FBbUIsSUFBbkIsQ0FBd0IsNkJBQWtCLE9BQWxCLEVBQTJCLE9BQU8sT0FBUCxDQUFlLGVBQTFDLENBQXhCO0FBQ0EsT0FBRSxTQUFGLENBQVksSUFBWjtBQUNBO0FBQ0Q7QUFDRCxHQTFDRjs7QUEyQ0M7Ozs7OztBQU1BLGlCQUFlLFNBQWYsWUFBZSxHQUFNOztBQUVwQixPQUFJLFVBQVUsTUFBTSxXQUFwQjtBQUFBLE9BQ0MsaUJBQWlCLGVBQUssQ0FBTCxDQUFPLGtCQUFQLENBRGxCO0FBQUEsT0FFQyxPQUFPLDZCQUFrQixPQUFsQixFQUEyQixPQUFPLE9BQVAsQ0FBZSxlQUExQyxDQUZSO0FBQUEsT0FHQyxXQUFXLE1BQU0sUUFIbEI7O0FBS0EsS0FBRSxNQUFGLENBQVMsSUFBVCxDQUFjO0FBQ2IsWUFBUSxRQURLO0FBRWIsZ0JBQVk7QUFGQyxJQUFkO0FBSUEsT0FBSSxNQUFNLE1BQVYsRUFBa0I7QUFDakIsTUFBRSxNQUFGLENBQVMsSUFBVCxDQUFjO0FBQ2IsbUJBQWMsY0FERDtBQUViLHNCQUFpQixDQUZKO0FBR2Isc0JBQWlCLFFBSEo7QUFJYixzQkFBaUIsT0FKSjtBQUtiLHVCQUFrQjtBQUxMLEtBQWQ7QUFPQSxJQVJELE1BUU87QUFDTixNQUFFLE1BQUYsQ0FBUyxVQUFULENBQW9CLHFFQUFwQjtBQUNBO0FBQ0QsR0F2RUY7O0FBd0VDOzs7O0FBSUEsa0JBQWdCLFNBQWhCLGFBQWdCLEdBQU07QUFDckIsT0FBSSxNQUFNLElBQUksSUFBSixFQUFWO0FBQ0EsT0FBSSxNQUFNLGdCQUFOLElBQTBCLElBQTlCLEVBQW9DO0FBQ25DLFVBQU0sSUFBTjtBQUNBO0FBQ0QsR0FqRkY7O0FBbUZBO0FBQ0EsSUFBRSxNQUFGLENBQVMsRUFBVCxDQUFZLE9BQVosRUFBcUIsWUFBTTtBQUMxQixVQUFPLE9BQVAsQ0FBZSxVQUFmLEdBQTRCLEtBQTVCO0FBQ0EsR0FGRCxFQUVHLEVBRkgsQ0FFTSxNQUZOLEVBRWMsWUFBTTtBQUNuQixVQUFPLE9BQVAsQ0FBZSxVQUFmLEdBQTRCLGlCQUE1QjtBQUNBLEdBSkQsRUFJRyxFQUpILENBSU0sU0FKTixFQUlpQixVQUFDLENBQUQsRUFBTzs7QUFFdkIsT0FBSyxJQUFJLElBQUosS0FBYSxnQkFBZCxJQUFtQyxJQUF2QyxFQUE2QztBQUM1QyxvQkFBZ0IsTUFBTSxNQUF0QjtBQUNBOztBQUVELE9BQUksRUFBRSxPQUFGLENBQVUsVUFBVixDQUFxQixNQUF6QixFQUFpQzs7QUFFaEMsUUFDQyxVQUFVLEVBQUUsS0FBRixJQUFXLEVBQUUsT0FBYixJQUF3QixDQURuQztBQUFBLFFBRUMsV0FBVyxNQUFNLFFBRmxCO0FBQUEsUUFHQyxXQUFXLE1BQU0sV0FIbEI7QUFBQSxRQUlDLGNBQWMsT0FBTyxPQUFQLENBQWUsMEJBQWYsQ0FBMEMsS0FBMUMsQ0FKZjtBQUFBLFFBS0MsZUFBZSxPQUFPLE9BQVAsQ0FBZSwyQkFBZixDQUEyQyxLQUEzQyxDQUxoQjs7QUFRQSxZQUFRLE9BQVI7QUFDQyxVQUFLLEVBQUwsQ0FERCxDQUNVO0FBQ1QsVUFBSyxFQUFMO0FBQVM7QUFDUixVQUFJLE1BQU0sUUFBTixLQUFtQixRQUF2QixFQUFpQztBQUNoQyxtQkFBWSxZQUFaO0FBQ0E7QUFDRDtBQUNELFVBQUssRUFBTCxDQVBELENBT1U7QUFDVCxVQUFLLEVBQUw7QUFBUztBQUNSLFVBQUksTUFBTSxRQUFOLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDLG1CQUFZLFdBQVo7QUFDQTtBQUNEO0FBQ0QsVUFBSyxFQUFMO0FBQVM7QUFDUixpQkFBVyxDQUFYO0FBQ0E7QUFDRCxVQUFLLEVBQUw7QUFBUztBQUNSLGlCQUFXLFFBQVg7QUFDQTtBQUNELFVBQUssRUFBTDtBQUFTO0FBQ1IsVUFBSSxzQkFBSixFQUFpQjtBQUNoQixXQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNqQixjQUFNLElBQU47QUFDQSxRQUZELE1BRU87QUFDTixjQUFNLEtBQU47QUFDQTtBQUNEO0FBQ0Q7QUFDRCxVQUFLLEVBQUw7QUFBUztBQUNSLFVBQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2pCLGFBQU0sSUFBTjtBQUNBLE9BRkQsTUFFTztBQUNOLGFBQU0sS0FBTjtBQUNBO0FBQ0Q7QUFDRDtBQUNDO0FBcENGOztBQXdDQSxlQUFXLFdBQVcsQ0FBWCxHQUFlLENBQWYsR0FBb0IsWUFBWSxRQUFaLEdBQXVCLFFBQXZCLEdBQWtDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBakU7QUFDQSx1QkFBbUIsSUFBSSxJQUFKLEVBQW5CO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbkIsV0FBTSxLQUFOO0FBQ0E7O0FBRUQsUUFBSSxXQUFXLE1BQU0sUUFBakIsSUFBNkIsQ0FBQyxhQUFsQyxFQUFpRDtBQUNoRCxnQkFBVyxhQUFYLEVBQTBCLElBQTFCO0FBQ0E7O0FBRUQsVUFBTSxjQUFOLENBQXFCLFFBQXJCOztBQUVBLE1BQUUsY0FBRjtBQUNBLE1BQUUsZUFBRjtBQUNBO0FBQ0QsR0EzRUQsRUEyRUcsRUEzRUgsQ0EyRU0sT0EzRU4sRUEyRWUsVUFBQyxDQUFELEVBQU87O0FBRXJCLE9BQUksTUFBTSxRQUFOLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDLFFBQUksU0FBUyxNQUFNLE1BQW5COztBQUVBLFFBQUksQ0FBQyxNQUFMLEVBQWE7QUFDWixXQUFNLEtBQU47QUFDQTs7QUFFRCxvQkFBZ0IsQ0FBaEI7O0FBRUEsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNaLFdBQU0sSUFBTjtBQUNBO0FBQ0Q7O0FBRUQsS0FBRSxjQUFGO0FBQ0EsS0FBRSxlQUFGO0FBQ0EsR0E3RkQ7O0FBZ0dBO0FBQ0EsSUFBRSxJQUFGLENBQU8sRUFBUCxDQUFVLHNCQUFWLEVBQWtDLFVBQUMsQ0FBRCxFQUFPO0FBQ3hDLE9BQUksTUFBTSxRQUFOLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDO0FBQ0EsUUFBSSxFQUFFLEtBQUYsS0FBWSxDQUFaLElBQWlCLEVBQUUsS0FBRixLQUFZLENBQWpDLEVBQW9DO0FBQ25DLG1CQUFjLElBQWQ7QUFDQSxxQkFBZ0IsQ0FBaEI7QUFDQSxPQUFFLFVBQUYsQ0FBYSw2QkFBYixFQUE0QyxVQUFDLENBQUQsRUFBTztBQUNsRCxzQkFBZ0IsQ0FBaEI7QUFDQSxNQUZEO0FBR0EsT0FBRSxVQUFGLENBQWEsMEJBQWIsRUFBeUMsWUFBTTtBQUM5QyxvQkFBYyxLQUFkO0FBQ0EsVUFBSSxFQUFFLFNBQUYsS0FBZ0IsU0FBcEIsRUFBK0I7QUFDOUIsU0FBRSxTQUFGLENBQVksSUFBWjtBQUNBO0FBQ0QsUUFBRSxZQUFGLENBQWUsc0RBQWY7QUFDQSxNQU5EO0FBT0E7QUFDRDtBQUNELEdBbEJELEVBa0JHLEVBbEJILENBa0JNLFlBbEJOLEVBa0JvQixVQUFDLENBQUQsRUFBTztBQUMxQixPQUFJLE1BQU0sUUFBTixLQUFtQixRQUF2QixFQUFpQztBQUNoQyxrQkFBYyxJQUFkO0FBQ0EsTUFBRSxVQUFGLENBQWEsZUFBYixFQUE4QixVQUFDLENBQUQsRUFBTztBQUNwQyxxQkFBZ0IsQ0FBaEI7QUFDQSxLQUZEO0FBR0EsUUFBSSxFQUFFLFNBQUYsS0FBZ0IsU0FBaEIsSUFBNkIscUJBQWpDLEVBQTZDO0FBQzVDLE9BQUUsU0FBRixDQUFZLElBQVo7QUFDQTtBQUNEO0FBQ0QsR0E1QkQsRUE0QkcsRUE1QkgsQ0E0Qk0sWUE1Qk4sRUE0Qm9CLFlBQU07QUFDekIsT0FBSSxNQUFNLFFBQU4sS0FBbUIsUUFBdkIsRUFBaUM7QUFDaEMsa0JBQWMsS0FBZDtBQUNBLFFBQUksQ0FBQyxXQUFMLEVBQWtCO0FBQ2pCLE9BQUUsWUFBRixDQUFlLGVBQWY7QUFDQSxTQUFJLEVBQUUsU0FBRixLQUFnQixTQUFwQixFQUErQjtBQUM5QixRQUFFLFNBQUYsQ0FBWSxJQUFaO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0F0Q0Q7O0FBd0NBO0FBQ0E7QUFDQTtBQUNBLFFBQU0sZ0JBQU4sQ0FBdUIsVUFBdkIsRUFBbUMsVUFBQyxDQUFELEVBQU87QUFDekMsT0FBSSxNQUFNLFFBQU4sS0FBbUIsUUFBdkIsRUFBaUM7QUFDaEMsV0FBTyxlQUFQLENBQXVCLENBQXZCO0FBQ0EsV0FBTyxjQUFQLENBQXNCLENBQXRCO0FBQ0EsSUFIRCxNQUdPLElBQUksQ0FBQyxTQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIsZ0JBQW9ELE1BQXpELEVBQWlFO0FBQ3ZFLGFBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixnQkFBb0QsS0FBcEQsR0FDRSxJQURGLG1CQUN1QixFQUFFLE9BQUYsQ0FBVSxXQURqQyxtQkFDMEQsS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFZLHFCQUFaLENBRDFEO0FBRUE7QUFDRCxHQVJELEVBUUcsS0FSSDs7QUFVQTtBQUNBLFFBQU0sZ0JBQU4sQ0FBdUIsWUFBdkIsRUFBcUMsVUFBQyxDQUFELEVBQU87QUFDM0MsT0FBSSxNQUFNLFFBQU4sS0FBbUIsUUFBdkIsRUFBa0M7QUFDakMsV0FBTyxlQUFQLENBQXVCLENBQXZCO0FBQ0EsV0FBTyxjQUFQLENBQXNCLENBQXRCO0FBQ0EsaUJBQWEsQ0FBYjtBQUNBLElBSkQsTUFJTyxJQUFJLENBQUMsU0FBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLGdCQUFvRCxNQUF6RCxFQUFpRTtBQUN2RSxhQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIsZ0JBQW9ELEtBQXBELEdBQ0UsSUFERixtQkFDdUIsRUFBRSxPQUFGLENBQVUsV0FEakMsbUJBQzBELEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBWSxxQkFBWixDQUQxRDtBQUVBO0FBQ0QsR0FURCxFQVNHLEtBVEg7O0FBV0EsSUFBRSxTQUFGLENBQVksRUFBWixDQUFlLGdCQUFmLEVBQWlDLFVBQUMsQ0FBRCxFQUFPO0FBQ3ZDLE9BQUksTUFBTSxRQUFOLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2hDLFdBQU8sZUFBUCxDQUF1QixDQUF2QjtBQUNBLFdBQU8sY0FBUCxDQUFzQixDQUF0QjtBQUNBO0FBQ0QsR0FMRDtBQU1BLEVBaFQwQzs7QUFrVDNDOzs7OztBQUtBLGtCQUFpQix5QkFBVSxDQUFWLEVBQWM7O0FBRTlCLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxTQUFVLE1BQU0sU0FBUCxHQUFvQixFQUFFLE1BQXRCLEdBQStCLEVBQUUsS0FGM0M7QUFBQSxNQUdDLFVBQVUsSUFIWDs7QUFLQTtBQUNBLE1BQUksVUFBVSxPQUFPLFFBQWpCLElBQTZCLE9BQU8sUUFBUCxDQUFnQixNQUFoQixHQUF5QixDQUF0RCxJQUEyRCxPQUFPLFFBQVAsQ0FBZ0IsR0FBM0UsSUFBa0YsT0FBTyxRQUE3RixFQUF1RztBQUN0RztBQUNBLGFBQVUsT0FBTyxRQUFQLENBQWdCLEdBQWhCLENBQW9CLE9BQU8sUUFBUCxDQUFnQixNQUFoQixHQUF5QixDQUE3QyxJQUFrRCxPQUFPLFFBQW5FO0FBQ0E7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQVBBLE9BUUssSUFBSSxVQUFVLE9BQU8sVUFBUCxLQUFzQixTQUFoQyxJQUE2QyxPQUFPLFVBQVAsR0FBb0IsQ0FBakUsSUFBc0UsT0FBTyxhQUFQLEtBQXlCLFNBQW5HLEVBQThHO0FBQ2xILGNBQVUsT0FBTyxhQUFQLEdBQXVCLE9BQU8sVUFBeEM7QUFDQTtBQUNEO0FBSEssUUFJQSxJQUFJLEtBQUssRUFBRSxnQkFBUCxJQUEyQixFQUFFLEtBQUYsS0FBWSxDQUEzQyxFQUE4QztBQUNsRCxlQUFVLEVBQUUsTUFBRixHQUFXLEVBQUUsS0FBdkI7QUFDQTs7QUFFRDtBQUNBLE1BQUksWUFBWSxJQUFoQixFQUFzQjtBQUNyQixhQUFVLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksT0FBWixDQUFaLENBQVY7QUFDQTtBQUNBLE9BQUksRUFBRSxNQUFGLElBQVksRUFBRSxLQUFsQixFQUF5QjtBQUN4QixNQUFFLE1BQUYsQ0FBUyxLQUFULENBQW1CLFVBQVUsR0FBN0I7QUFDQTtBQUNEO0FBQ0QsRUF2VjBDO0FBd1YzQzs7OztBQUlBLGlCQUFnQiwwQkFBYTs7QUFFNUIsTUFBSSxJQUFJLElBQVI7O0FBRUEsTUFBSSxFQUFFLEtBQUYsQ0FBUSxXQUFSLEtBQXdCLFNBQXhCLElBQXFDLEVBQUUsS0FBRixDQUFRLFFBQWpELEVBQTJEOztBQUUxRDtBQUNBLE9BQUksRUFBRSxLQUFGLElBQVcsRUFBRSxNQUFqQixFQUF5QjtBQUN4QixRQUNDLFdBQVcsS0FBSyxLQUFMLENBQVcsRUFBRSxLQUFGLENBQVEsS0FBUixLQUFrQixFQUFFLEtBQUYsQ0FBUSxXQUExQixHQUF3QyxFQUFFLEtBQUYsQ0FBUSxRQUEzRCxDQURaO0FBQUEsUUFFQyxZQUFZLFdBQVcsS0FBSyxLQUFMLENBQVcsRUFBRSxNQUFGLENBQVMsVUFBVCxDQUFvQixJQUFwQixJQUE0QixDQUF2QyxDQUZ4Qjs7QUFJQSxlQUFZLEVBQUUsS0FBRixDQUFRLFdBQVIsR0FBc0IsRUFBRSxLQUFGLENBQVEsUUFBL0IsR0FBMkMsR0FBdEQ7QUFDQSxNQUFFLE9BQUYsQ0FBVSxLQUFWLENBQW1CLFFBQW5CO0FBQ0EsTUFBRSxNQUFGLENBQVMsR0FBVCxDQUFhLE1BQWIsRUFBcUIsU0FBckI7QUFDQTtBQUNEO0FBRUQ7QUE5VzBDLENBQTVDOzs7QUN4QkE7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7QUFPQTtBQUNBLE9BQU8sTUFBUCxpQkFBc0I7QUFDckI7Ozs7QUFJQSxXQUFVLENBTFc7QUFNckI7OztBQUdBLDJCQUEwQjtBQVRMLENBQXRCOztBQWFBLE9BQU8sTUFBUCxDQUFjLGlCQUFtQixTQUFqQyxFQUE0Qzs7QUFFM0M7Ozs7Ozs7OztBQVNBLGVBQWMsc0JBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixNQUE1QixFQUFvQyxLQUFwQyxFQUE0QztBQUN6RCxNQUFJLElBQUksSUFBUjs7QUFFQSxJQUFFLGlCQUFlLEVBQUUsT0FBRixDQUFVLFdBQXpCLDhEQUNlLEVBQUUsT0FBRixDQUFVLFdBRHpCLHFCQUNvRCw2QkFBa0IsQ0FBbEIsRUFBcUIsT0FBTyxPQUFQLENBQWUsZUFBcEMsQ0FEcEQsd0JBQUYsRUFHQyxRQUhELENBR1UsUUFIVjs7QUFLQSxJQUFFLFdBQUYsR0FBZ0IsRUFBRSxRQUFGLENBQVcsSUFBWCxPQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QixpQkFBaEI7O0FBRUEsUUFBTSxnQkFBTixDQUF1QixZQUF2QixFQUFxQyxZQUFNO0FBQzFDLE9BQUksRUFBRSxrQkFBTixFQUEwQjtBQUN6QixXQUFPLGFBQVA7QUFDQTtBQUVELEdBTEQsRUFLRyxLQUxIO0FBTUEsRUEzQjBDOztBQTZCM0M7Ozs7Ozs7OztBQVNBLGdCQUFlLHVCQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBcEMsRUFBNEM7QUFDMUQsTUFBSSxJQUFJLElBQVI7O0FBRUEsTUFBSSxTQUFTLFFBQVQsR0FBb0IsSUFBcEIsR0FBMkIsSUFBM0IsT0FBb0MsRUFBRSxPQUFGLENBQVUsV0FBOUMsa0JBQXdFLE1BQXhFLEdBQWlGLENBQXJGLEVBQXdGO0FBQ3ZGLEtBQUssRUFBRSxPQUFGLENBQVUsd0JBQWIscUJBQXFELEVBQUUsT0FBRixDQUFVLFdBQS9ELG1CQUNFLDZCQUFrQixFQUFFLE9BQUYsQ0FBVSxRQUE1QixFQUFzQyxFQUFFLE9BQUYsQ0FBVSxlQUFoRCxDQURGLGFBQUYsRUFFQyxRQUZELENBRVUsU0FBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLFVBRlY7QUFHQSxHQUpELE1BSU87O0FBRU47QUFDQSxZQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIsa0JBQXNELE1BQXRELEdBQ0UsUUFERixDQUNjLEVBQUUsT0FBRixDQUFVLFdBRHhCOztBQUdBLEtBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsYUFBNEMsRUFBRSxPQUFGLENBQVUsV0FBdEQsK0NBQ2UsRUFBRSxPQUFGLENBQVUsV0FEekIsb0JBRUUsNkJBQWtCLEVBQUUsT0FBRixDQUFVLFFBQTVCLEVBQXNDLEVBQUUsT0FBRixDQUFVLGVBQWhELENBRkYsd0JBQUYsRUFJQyxRQUpELENBSVUsUUFKVjtBQUtBOztBQUVELElBQUUsU0FBRixHQUFjLEVBQUUsUUFBRixDQUFXLElBQVgsT0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsY0FBZDs7QUFFQSxRQUFNLGdCQUFOLENBQXVCLFlBQXZCLEVBQXFDLFlBQU07QUFDMUMsT0FBSSxFQUFFLGtCQUFOLEVBQTBCO0FBQ3pCLFdBQU8sY0FBUDtBQUNBO0FBQ0QsR0FKRCxFQUlHLEtBSkg7QUFLQSxFQWpFMEM7O0FBbUUzQzs7OztBQUlBLGdCQUFlLHlCQUFhO0FBQzNCLE1BQUksSUFBSSxJQUFSOztBQUVBLE1BQUksY0FBYyxFQUFFLEtBQUYsQ0FBUSxXQUExQjs7QUFFQSxNQUFJLE1BQU0sV0FBTixDQUFKLEVBQXdCO0FBQ3ZCLGlCQUFjLENBQWQ7QUFDQTs7QUFFRCxNQUFJLEVBQUUsV0FBTixFQUFtQjtBQUNsQixLQUFFLFdBQUYsQ0FBYyxJQUFkLENBQW1CLDZCQUFrQixXQUFsQixFQUErQixFQUFFLE9BQUYsQ0FBVSxlQUF6QyxDQUFuQjtBQUNBO0FBQ0QsRUFuRjBDOztBQXFGM0M7Ozs7QUFJQSxpQkFBZ0IsMEJBQWE7QUFDNUIsTUFBSSxJQUFJLElBQVI7O0FBRUEsTUFBSSxXQUFXLEVBQUUsS0FBRixDQUFRLFFBQXZCOztBQUVBLE1BQUksTUFBTSxRQUFOLEtBQW1CLGFBQWEsUUFBaEMsSUFBNEMsV0FBVyxDQUEzRCxFQUE4RDtBQUM3RCxLQUFFLEtBQUYsQ0FBUSxRQUFSLEdBQW1CLEVBQUUsT0FBRixDQUFVLFFBQVYsR0FBcUIsV0FBVyxDQUFuRDtBQUNBOztBQUVELE1BQUksRUFBRSxPQUFGLENBQVUsUUFBVixHQUFxQixDQUF6QixFQUE0QjtBQUMzQixjQUFXLEVBQUUsT0FBRixDQUFVLFFBQXJCO0FBQ0E7O0FBRUQ7QUFDQSxJQUFFLFNBQUYsQ0FBWSxXQUFaLENBQTJCLEVBQUUsT0FBRixDQUFVLFdBQXJDLGlCQUE4RCxXQUFXLElBQXpFOztBQUVBLE1BQUksRUFBRSxTQUFGLElBQWUsV0FBVyxDQUE5QixFQUFpQztBQUNoQyxLQUFFLFNBQUYsQ0FBWSxJQUFaLENBQWlCLDZCQUFrQixRQUFsQixFQUE0QixFQUFFLE9BQUYsQ0FBVSxlQUF0QyxDQUFqQjtBQUNBO0FBQ0Q7QUE1RzBDLENBQTVDOzs7QUMzQkE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7Ozs7OztBQVFBO0FBQ0EsT0FBTyxNQUFQLGlCQUFzQjtBQUNyQjs7Ozs7O0FBTUEsZ0JBQWUsRUFQTTtBQVFyQjs7O0FBR0EsYUFBWSxFQVhTO0FBWXJCOzs7OztBQUtBLGlCQUFnQixLQWpCSztBQWtCckI7Ozs7QUFJQSw4QkFBNkIsSUF0QlI7QUF1QnJCOzs7O0FBSUEsa0NBQWlDLEtBM0JaO0FBNEJyQjs7O0FBR0EsaUJBQWdCO0FBL0JLLENBQXRCOztBQWtDQSxPQUFPLE1BQVAsQ0FBYyxpQkFBbUIsU0FBakMsRUFBNEM7O0FBRTNDOzs7QUFHQSxjQUFhLEtBTDhCOztBQU8zQzs7Ozs7Ozs7O0FBU0EsY0FBYSxxQkFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLEVBQW9DLEtBQXBDLEVBQTRDO0FBQ3hELE1BQUksT0FBTyxNQUFQLENBQWMsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUMvQjtBQUNBOztBQUVELE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxPQUFPLEVBQUUsT0FBRixDQUFVLGNBQVYsR0FBMkIsdURBQTNCLEdBQXFGLEVBRjdGO0FBQUEsTUFHQyxjQUFjLEVBQUUsT0FBRixDQUFVLFVBQVYsR0FBdUIsRUFBRSxPQUFGLENBQVUsVUFBakMsR0FBOEMsZUFBSyxDQUFMLENBQU8seUJBQVAsQ0FIN0Q7QUFBQSxNQUlDLFVBSkQ7QUFBQSxNQUtDLGFBTEQ7O0FBUUE7QUFDQSxNQUFJLEVBQUUsT0FBRixDQUFVLFVBQWQsRUFBMEI7QUFDekIsUUFBSyxJQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsQ0FBcUIsTUFBckIsR0FBOEIsQ0FBdkMsRUFBMEMsS0FBSyxDQUEvQyxFQUFrRCxHQUFsRCxFQUF1RDtBQUN0RCxNQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLENBQXJCLEVBQXdCLElBQXhCLEdBQStCLFFBQS9CO0FBQ0E7QUFDRDs7QUFFRCxJQUFFLFdBQUYsQ0FBYyxNQUFkO0FBQ0EsU0FBTyxRQUFQLEdBQWtCLG1CQUFpQixFQUFFLE9BQUYsQ0FBVSxXQUEzQixpQkFBa0QsRUFBRSxPQUFGLENBQVUsV0FBNUQsb0JBQ2hCLFNBRGdCLENBQ04sTUFETSxFQUNFLElBREYsRUFBbEI7QUFFQSxTQUFPLFFBQVAsR0FDQyxFQUFFLGlCQUFlLEVBQUUsT0FBRixDQUFVLFdBQXpCLHVCQUFzRCxFQUFFLE9BQUYsQ0FBVSxXQUFoRSxpQ0FDYyxFQUFFLE9BQUYsQ0FBVSxXQUR4QiwwQkFDd0QsRUFBRSxPQUFGLENBQVUsV0FEbEUsZ0NBQ3dHLElBRHhHLDZCQUVnQixFQUFFLE9BQUYsQ0FBVSxXQUYxQixrREFBRixFQUtDLFNBTEQsQ0FLVyxNQUxYLEVBS21CLElBTG5CLEVBREQ7QUFPQSxTQUFPLFlBQVAsR0FBc0IsT0FBTyxRQUFQLENBQWdCLElBQWhCLE9BQXlCLEVBQUUsT0FBRixDQUFVLFdBQW5DLG1CQUF0QjtBQUNBLFNBQU8sY0FBUCxHQUNDLEVBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZUFBOEMsRUFBRSxPQUFGLENBQVUsV0FBeEQsb0VBQ3VDLEVBQUUsRUFEekMsaUJBQ3VELFdBRHZELHNCQUNtRixXQURuRixzQ0FFYyxFQUFFLE9BQUYsQ0FBVSxXQUZ4QiwwQkFFd0QsRUFBRSxPQUFGLENBQVUsV0FGbEUscUNBR2MsRUFBRSxPQUFGLENBQVUsV0FIeEIsa0RBSWUsRUFBRSxPQUFGLENBQVUsV0FKekIsdUVBS2dDLEVBQUUsT0FBRixDQUFVLFdBTDFDLDhDQU1ZLE9BQU8sRUFObkIsdUJBTXVDLE9BQU8sRUFOOUMsbUZBUW1CLEVBQUUsT0FBRixDQUFVLFdBUjdCLGtDQVNNLEVBQUUsT0FBRixDQUFVLFdBVGhCLHVDQVVXLE9BQU8sRUFWbEIsd0JBVXVDLGVBQUssQ0FBTCxDQUFPLFdBQVAsQ0FWdkMsd0RBQUYsRUFlQyxRQWZELENBZVUsUUFmVixDQUREOztBQW1CQSxNQUNDLGdCQUFnQixDQURqQjtBQUFBLE1BRUMsUUFBUSxPQUFPLE1BQVAsQ0FBYyxNQUZ2Qjs7QUFLQSxPQUFLLElBQUksQ0FBVCxFQUFZLElBQUksS0FBaEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDM0IsVUFBTyxPQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLElBQXhCO0FBQ0EsT0FBSSxTQUFTLFdBQVQsSUFBd0IsU0FBUyxVQUFyQyxFQUFpRDtBQUNoRDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLEVBQUUsT0FBRixDQUFVLCtCQUFWLElBQTZDLGtCQUFrQixDQUFuRSxFQUFzRTtBQUNyRTtBQUNBLFVBQU8sY0FBUCxDQUFzQixFQUF0QixDQUF5QixPQUF6QixFQUFrQyxZQUFNO0FBQ3ZDLFFBQUksVUFBVSxNQUFkO0FBQ0EsUUFBSSxPQUFPLGFBQVAsS0FBeUIsSUFBN0IsRUFBbUM7QUFDbEMsZUFBVSxPQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLE9BQTNCO0FBQ0E7QUFDRCxXQUFPLFFBQVAsQ0FBZ0IsT0FBaEI7QUFDQSxJQU5EO0FBT0EsR0FURCxNQVNPO0FBQ047QUFDQSxVQUFPLGNBQVAsQ0FDRSxFQURGLENBQ0ssb0JBREwsRUFDMkIsWUFBVztBQUNwQyxNQUFFLElBQUYsRUFBUSxJQUFSLE9BQWlCLEVBQUUsT0FBRixDQUFVLFdBQTNCLHdCQUNFLFdBREYsQ0FDaUIsRUFBRSxPQUFGLENBQVUsV0FEM0I7QUFFQSxJQUpGLEVBS0UsRUFMRixDQUtLLHFCQUxMLEVBSzRCLFlBQVc7QUFDckMsTUFBRSxJQUFGLEVBQVEsSUFBUixPQUFpQixFQUFFLE9BQUYsQ0FBVSxXQUEzQix3QkFDRSxRQURGLENBQ2MsRUFBRSxPQUFGLENBQVUsV0FEeEI7QUFFQSxJQVJGO0FBU0M7QUFURCxJQVVFLEVBVkYsQ0FVSyxPQVZMLEVBVWMsbUJBVmQsRUFVbUMsWUFBVztBQUM1QztBQUNBO0FBQ0E7QUFDQSxXQUFPLFFBQVAsQ0FBZ0IsS0FBSyxLQUFyQjtBQUNBLElBZkYsRUFnQkUsRUFoQkYsQ0FnQkssT0FoQkwsUUFnQmtCLEVBQUUsT0FBRixDQUFVLFdBaEI1Qiw4QkFnQmtFLFlBQVc7QUFDM0UsTUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixxQkFBakIsRUFBd0MsT0FBeEMsQ0FBZ0QsT0FBaEQ7QUFDQSxJQWxCRjtBQW1CQztBQW5CRCxJQW9CRSxFQXBCRixDQW9CSyxTQXBCTCxFQW9CZ0IsVUFBQyxDQUFELEVBQU87QUFDckIsTUFBRSxlQUFGO0FBQ0EsSUF0QkY7QUF1QkE7O0FBRUQsTUFBSSxDQUFDLE9BQU8sT0FBUCxDQUFlLGtCQUFwQixFQUF3QztBQUN2QztBQUNBLFVBQU8sU0FBUCxDQUNDLEVBREQsQ0FDSSxlQURKLEVBQ3FCLFlBQU07QUFDMUI7QUFDQSxXQUFPLFNBQVAsQ0FBaUIsSUFBakIsT0FBMEIsRUFBRSxPQUFGLENBQVUsV0FBcEMsd0JBQ0MsUUFERCxDQUNhLEVBQUUsT0FBRixDQUFVLFdBRHZCO0FBR0EsSUFORCxFQU9DLEVBUEQsQ0FPSSxnQkFQSixFQU9zQixZQUFNO0FBQzNCLFFBQUksQ0FBQyxNQUFNLE1BQVgsRUFBbUI7QUFDbEI7QUFDQSxZQUFPLFNBQVAsQ0FBaUIsSUFBakIsT0FBMEIsRUFBRSxPQUFGLENBQVUsV0FBcEMsd0JBQ0MsV0FERCxDQUNnQixFQUFFLE9BQUYsQ0FBVSxXQUQxQjtBQUVBO0FBQ0QsSUFiRDtBQWNBLEdBaEJELE1BZ0JPO0FBQ04sVUFBTyxTQUFQLENBQWlCLElBQWpCLE9BQTBCLEVBQUUsT0FBRixDQUFVLFdBQXBDLHdCQUNDLFFBREQsQ0FDYSxFQUFFLE9BQUYsQ0FBVSxXQUR2QjtBQUVBOztBQUVELFNBQU8sV0FBUCxHQUFxQixDQUFDLENBQXRCO0FBQ0EsU0FBTyxhQUFQLEdBQXVCLElBQXZCO0FBQ0EsU0FBTyxjQUFQLEdBQXdCLEtBQXhCOztBQUVBO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEtBQWhCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzNCLFVBQU8sT0FBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixJQUF4QjtBQUNBLE9BQUksU0FBUyxXQUFULElBQXdCLFNBQVMsVUFBckMsRUFBaUQ7QUFDaEQsV0FBTyxjQUFQLENBQXNCLE9BQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsT0FBdkMsRUFBZ0QsT0FBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixPQUFqRSxFQUEwRSxPQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLEtBQTNGO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFNBQU8sYUFBUDs7QUFFQSxRQUFNLGdCQUFOLENBQXVCLFlBQXZCLEVBQXFDLFlBQU07QUFDMUMsVUFBTyxlQUFQO0FBQ0EsR0FGRCxFQUVHLEtBRkg7O0FBSUEsTUFBSSxPQUFPLE9BQVAsQ0FBZSxjQUFmLEtBQWtDLEVBQXRDLEVBQTBDO0FBQ3pDLFVBQU8sZUFBUCxHQUF5QixFQUFFLE9BQU8sT0FBUCxDQUFlLGNBQWpCLENBQXpCOztBQUVBLFNBQU0sZ0JBQU4sQ0FBdUIsWUFBdkIsRUFBcUMsWUFBTTtBQUMxQyxXQUFPLGFBQVA7QUFDQSxJQUZELEVBRUcsS0FGSDtBQUlBOztBQUVELFFBQU0sZ0JBQU4sQ0FBdUIsZ0JBQXZCLEVBQXlDLFlBQU07QUFDOUMsVUFBTyxlQUFQO0FBQ0EsR0FGRCxFQUVHLEtBRkg7O0FBSUEsU0FBTyxTQUFQLENBQWlCLEtBQWpCLENBQ0MsWUFBVztBQUNWO0FBQ0EsT0FBSSxPQUFPLFdBQVgsRUFBd0I7QUFDdkIsV0FBTyxRQUFQLENBQWdCLFdBQWhCLENBQStCLEVBQUUsT0FBRixDQUFVLFdBQXpDO0FBQ0EsV0FBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLEdBQXZCLEVBQTRCLFlBQVc7QUFDdEMsU0FBSSxPQUFPLEVBQUUsSUFBRixDQUFYO0FBQ0EsVUFBSyxNQUFMLENBQVksS0FBSyxJQUFMLE9BQWMsRUFBRSxPQUFGLENBQVUsV0FBeEIsY0FBOEMsV0FBOUMsRUFBWjtBQUNBLEtBSEQ7QUFJQTtBQUNELEdBVkYsRUFXQyxZQUFXO0FBQ1YsT0FBSSxPQUFPLFdBQVgsRUFBd0I7QUFDdkIsUUFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDakIsWUFBTyxRQUFQLENBQWdCLE9BQWhCLENBQXdCLEdBQXhCLEVBQTZCLFlBQVc7QUFDdkMsUUFBRSxJQUFGLEVBQVEsUUFBUixDQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QjtBQUNBLE1BRkQ7QUFHQSxLQUpELE1BSU87QUFDTixZQUFPLFFBQVAsQ0FBZ0IsSUFBaEI7QUFDQTtBQUNEO0FBRUQsR0F0QkY7O0FBd0JBLElBQUUsU0FBRixDQUFZLEVBQVosQ0FBZSxnQkFBZixFQUFpQyxZQUFNO0FBQ3RDLEtBQUUsaUJBQUY7QUFDQSxHQUZEOztBQUlBO0FBQ0EsTUFBSSxPQUFPLElBQVAsQ0FBWSxZQUFaLENBQXlCLFVBQXpCLE1BQXlDLElBQTdDLEVBQW1EO0FBQ2xELFVBQU8sUUFBUCxDQUFnQixRQUFoQixDQUE0QixFQUFFLE9BQUYsQ0FBVSxXQUF0QztBQUNBO0FBQ0QsRUF4TTBDOztBQTBNM0M7Ozs7OztBQU1BLGNBQWEscUJBQVUsTUFBVixFQUFtQjtBQUMvQixNQUFJLE1BQUosRUFBWTtBQUNYLE9BQUksT0FBTyxRQUFYLEVBQXFCO0FBQ3BCLFdBQU8sUUFBUCxDQUFnQixNQUFoQjtBQUNBO0FBQ0QsT0FBSSxPQUFPLFFBQVgsRUFBcUI7QUFDcEIsV0FBTyxRQUFQLENBQWdCLE1BQWhCO0FBQ0E7QUFDRCxPQUFJLE9BQU8sWUFBWCxFQUF5QjtBQUN4QixXQUFPLFlBQVAsQ0FBb0IsTUFBcEI7QUFDQTtBQUNELE9BQUksT0FBTyxjQUFYLEVBQTJCO0FBQzFCLFdBQU8sY0FBUCxDQUFzQixNQUF0QjtBQUNBO0FBQ0Q7QUFDRCxFQS9OMEM7O0FBaU8zQyxnQkFBZSx5QkFBYTtBQUMzQixNQUFJLElBQUksSUFBUjtBQUNBLElBQUUsVUFBRjtBQUNBLElBQUUsV0FBRixDQUFjLENBQWQsRUFBaUIsRUFBRSxRQUFuQixFQUE2QixFQUFFLE1BQS9CLEVBQXVDLEVBQUUsS0FBekM7QUFDQSxFQXJPMEM7O0FBdU8zQyxhQUFZLHNCQUFhO0FBQ3hCLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxZQUFZLEVBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxPQUFkLENBRmI7O0FBS0E7QUFDQSxJQUFFLE1BQUYsR0FBVyxFQUFYO0FBQ0EsWUFBVSxJQUFWLENBQWUsVUFBQyxLQUFELEVBQVEsS0FBUixFQUFrQjs7QUFFaEMsV0FBUSxFQUFFLEtBQUYsQ0FBUjs7QUFFQSxPQUFJLFVBQVcsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFELEdBQTBCLE1BQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsV0FBdEIsRUFBMUIsR0FBZ0UsRUFBOUU7QUFDQSxPQUFJLFVBQWEsRUFBRSxFQUFmLGVBQTJCLEtBQTNCLFNBQW9DLE1BQU0sSUFBTixDQUFXLE1BQVgsQ0FBcEMsU0FBMEQsT0FBOUQ7QUFDQSxLQUFFLE1BQUYsQ0FBUyxJQUFULENBQWM7QUFDYixhQUFTLE9BREk7QUFFYixhQUFTLE9BRkk7QUFHYixTQUFLLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FIUTtBQUliLFVBQU0sTUFBTSxJQUFOLENBQVcsTUFBWCxDQUpPO0FBS2IsV0FBTyxNQUFNLElBQU4sQ0FBVyxPQUFYLEtBQXVCLEVBTGpCO0FBTWIsYUFBUyxFQU5JO0FBT2IsY0FBVTtBQVBHLElBQWQ7QUFTQSxHQWZEO0FBZ0JBLEVBL1AwQzs7QUFpUTNDOzs7O0FBSUEsV0FBVSxrQkFBVSxPQUFWLEVBQW9CO0FBQzdCLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxVQUZEOztBQUtBLElBQUUsY0FBRixDQUNFLElBREYsQ0FDTyxxQkFEUCxFQUM4QixJQUQ5QixDQUNtQyxTQURuQyxFQUM4QyxLQUQ5QyxFQUVFLEdBRkYsR0FHRSxJQUhGLE9BR1csRUFBRSxPQUFGLENBQVUsV0FIckIsd0JBSUUsV0FKRixDQUlpQixFQUFFLE9BQUYsQ0FBVSxXQUozQix3QkFLRSxHQUxGLEdBTUUsSUFORixtQkFNdUIsT0FOdkIsU0FNb0MsSUFOcEMsQ0FNeUMsU0FOekMsRUFNb0QsSUFOcEQsRUFPRSxRQVBGLE9BT2UsRUFBRSxPQUFGLENBQVUsV0FQekIsOEJBUUUsUUFSRixDQVFjLEVBQUUsT0FBRixDQUFVLFdBUnhCOztBQVdBLE1BQUksWUFBWSxNQUFoQixFQUF3QjtBQUN2QixLQUFFLGFBQUYsR0FBa0IsSUFBbEI7QUFDQSxLQUFFLGNBQUYsQ0FBaUIsV0FBakIsQ0FBZ0MsRUFBRSxPQUFGLENBQVUsV0FBMUM7QUFDQTtBQUNBOztBQUVELE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxFQUFFLE1BQUYsQ0FBUyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNyQyxPQUFJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBVCxDQUFaO0FBQ0EsT0FBSSxNQUFNLE9BQU4sS0FBa0IsT0FBdEIsRUFBK0I7QUFDOUIsUUFBSSxFQUFFLGFBQUYsS0FBb0IsSUFBeEIsRUFBOEI7QUFDN0IsT0FBRSxjQUFGLENBQWlCLFFBQWpCLENBQTZCLEVBQUUsT0FBRixDQUFVLFdBQXZDO0FBQ0E7QUFDRCxNQUFFLGFBQUYsR0FBa0IsS0FBbEI7QUFDQSxNQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWdCLE1BQWhCLEVBQXdCLEVBQUUsYUFBRixDQUFnQixPQUF4QztBQUNBLE1BQUUsZUFBRjtBQUNBO0FBQ0E7QUFDRDtBQUNELEVBeFMwQzs7QUEwUzNDOzs7QUFHQSxnQkFBZSx5QkFBYTtBQUMzQixNQUFJLElBQUksSUFBUjs7QUFFQSxJQUFFLFdBQUY7QUFDQSxNQUFJLEVBQUUsV0FBRixHQUFnQixFQUFFLE1BQUYsQ0FBUyxNQUE3QixFQUFxQztBQUNwQyxLQUFFLGNBQUYsR0FBbUIsSUFBbkI7QUFDQSxLQUFFLFNBQUYsQ0FBWSxFQUFFLFdBQWQ7QUFDQSxHQUhELE1BR087QUFDTjtBQUNBLEtBQUUsY0FBRixHQUFtQixLQUFuQjs7QUFFQSxLQUFFLGNBQUY7QUFDQTtBQUNELEVBMVQwQzs7QUE0VDNDOzs7O0FBSUEsWUFBVyxtQkFBVSxLQUFWLEVBQWtCO0FBQzVCLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxRQUFRLEVBQUUsTUFBRixDQUFTLEtBQVQsQ0FGVDtBQUFBLE1BR0MsUUFBUSxTQUFSLEtBQVEsR0FBTTs7QUFFYixTQUFNLFFBQU4sR0FBaUIsSUFBakI7O0FBRUEsS0FBRSxpQkFBRixDQUFvQixLQUFwQjs7QUFFQSxLQUFFLGFBQUY7QUFFQSxHQVhGOztBQWNBLE1BQUksVUFBVSxTQUFWLEtBQXdCLE1BQU0sR0FBTixLQUFjLFNBQWQsSUFBMkIsTUFBTSxHQUFOLEtBQWMsRUFBakUsQ0FBSixFQUEwRTtBQUN6RSxLQUFFLElBQUYsQ0FBTztBQUNOLFNBQUssTUFBTSxHQURMO0FBRU4sY0FBVSxNQUZKO0FBR04sYUFBUyxpQkFBVSxDQUFWLEVBQWM7O0FBRXRCO0FBQ0EsU0FBSSxPQUFPLENBQVAsS0FBYSxRQUFiLElBQTBCLGFBQUQsQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBckIsQ0FBN0IsRUFBc0Q7QUFDckQsWUFBTSxPQUFOLEdBQWdCLGVBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBbEMsQ0FBaEI7QUFDQSxNQUZELE1BRU87QUFDTixZQUFNLE9BQU4sR0FBZ0IsZUFBSyxpQkFBTCxDQUF1QixNQUF2QixDQUE4QixLQUE5QixDQUFvQyxDQUFwQyxDQUFoQjtBQUNBOztBQUVEOztBQUVBLFNBQUksTUFBTSxJQUFOLEtBQWUsVUFBbkIsRUFBK0I7QUFDOUIsUUFBRSxLQUFGLENBQVEsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsWUFBTTtBQUN0QyxXQUFJLEVBQUUsS0FBRixDQUFRLFFBQVIsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDekIsVUFBRSxlQUFGO0FBQ0E7QUFDRCxPQUpELEVBSUcsS0FKSDtBQUtBOztBQUVELFNBQUksTUFBTSxJQUFOLEtBQWUsUUFBbkIsRUFBNkI7QUFDNUIsUUFBRSxXQUFGLENBQWMsS0FBZDtBQUNBO0FBQ0QsS0F6Qks7QUEwQk4sV0FBTyxpQkFBYTtBQUNuQixPQUFFLGlCQUFGLENBQW9CLE1BQU0sT0FBMUI7QUFDQSxPQUFFLGFBQUY7QUFDQTtBQTdCSyxJQUFQO0FBK0JBO0FBQ0QsRUFoWDBDOztBQWtYM0M7Ozs7QUFJQSxvQkFBbUIsMkJBQVUsS0FBVixFQUFrQjtBQUNwQyxNQUNDLElBQUksSUFETDtBQUFBLE1BRUMsT0FBTyxNQUFNLE9BRmQ7QUFBQSxNQUdDLFFBQVEsTUFBTSxLQUhmO0FBQUEsTUFJQyxTQUFTLFFBQU0sTUFBTSxPQUFaLENBSlY7O0FBT0EsTUFBSSxVQUFVLEVBQWQsRUFBa0I7QUFDakIsV0FBUSxlQUFLLENBQUwsQ0FBTyxlQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLElBQXBCLENBQVAsS0FBcUMsSUFBN0M7QUFDQTs7QUFFRCxTQUFPLElBQVAsQ0FBWSxVQUFaLEVBQXdCLEtBQXhCLEVBQ0MsUUFERCxPQUNjLEVBQUUsT0FBRixDQUFVLFdBRHhCLDhCQUM4RCxJQUQ5RCxDQUNtRSxLQURuRTs7QUFHQTtBQUNBLE1BQUksRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUFoQyxFQUFzQztBQUNyQyxVQUFPLElBQVAsQ0FBWSxTQUFaLEVBQXVCLElBQXZCLEVBQTZCLE9BQTdCLENBQXFDLE9BQXJDO0FBQ0E7O0FBRUQsSUFBRSxpQkFBRjtBQUNBLEVBM1kwQzs7QUE2WTNDOzs7O0FBSUEsb0JBQW1CLDJCQUFVLE9BQVYsRUFBb0I7QUFDdEMsTUFBSSxJQUFJLElBQVI7O0FBRUEsSUFBRSxjQUFGLENBQWlCLElBQWpCLGVBQWtDLE9BQWxDLFFBQThDLE9BQTlDLENBQXNELElBQXRELEVBQTRELE1BQTVEOztBQUVBLElBQUUsaUJBQUY7QUFDQSxFQXZaMEM7O0FBeVozQzs7Ozs7O0FBTUEsaUJBQWdCLHdCQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsS0FBekIsRUFBaUM7QUFDaEQsTUFBSSxJQUFJLElBQVI7QUFDQSxNQUFJLFVBQVUsRUFBZCxFQUFrQjtBQUNqQixXQUFRLGVBQUssQ0FBTCxDQUFPLGVBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsSUFBcEIsQ0FBUCxLQUFxQyxJQUE3QztBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBLElBQUUsY0FBRixDQUFpQixJQUFqQixDQUFzQixJQUF0QixFQUE0QixNQUE1QixDQUNDLEVBQUUsZ0JBQWMsRUFBRSxPQUFGLENBQVUsV0FBeEIsc0VBQzZCLEVBQUUsT0FBRixDQUFVLFdBRHZDLDZDQUVRLEVBQUUsRUFGVix1QkFFOEIsT0FGOUIsaUJBRWlELE9BRmpELHFEQUdnQixFQUFFLE9BQUYsQ0FBVSxXQUgxQixpQ0FHaUUsS0FIakUsa0NBQUYsQ0FERDs7QUFRQSxJQUFFLGlCQUFGOztBQUVBO0FBQ0EsSUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQiwyQ0FBZ0YsSUFBaEYsUUFBeUYsTUFBekY7QUFDQSxFQXBiMEM7O0FBc2IzQzs7O0FBR0Esb0JBQW1CLDZCQUFhO0FBQy9CLE1BQUksSUFBSSxJQUFSO0FBQ0E7QUFDQSxJQUFFLGNBQUYsQ0FBaUIsSUFBakIsT0FBMEIsRUFBRSxPQUFGLENBQVUsV0FBcEMsd0JBQW9FLE1BQXBFLENBQ0MsRUFBRSxjQUFGLENBQWlCLElBQWpCLE9BQTBCLEVBQUUsT0FBRixDQUFVLFdBQXBDLDZCQUF5RSxXQUF6RSxDQUFxRixJQUFyRixJQUNBLEVBQUUsY0FBRixDQUFpQixJQUFqQixPQUEwQixFQUFFLE9BQUYsQ0FBVSxXQUFwQyw0QkFBd0UsV0FBeEUsQ0FBb0YsSUFBcEYsQ0FGRDtBQUlBLEVBaGMwQzs7QUFrYzNDOzs7QUFHQSxpQkFBZ0IsMEJBQWE7QUFDNUIsTUFDQyxJQUFJLElBREw7QUFBQSxNQUVDLGVBQWUsS0FGaEI7O0FBS0E7QUFDQSxNQUFJLEVBQUUsT0FBRixDQUFVLDJCQUFkLEVBQTJDO0FBQzFDLFFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxRQUFRLEVBQUUsTUFBRixDQUFTLE1BQWpDLEVBQXlDLElBQUksS0FBN0MsRUFBb0QsR0FBcEQsRUFBeUQ7QUFDeEQsUUFBSSxPQUFPLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBWSxJQUF2QjtBQUNBLFFBQUksQ0FBQyxTQUFTLFdBQVQsSUFBd0IsU0FBUyxVQUFsQyxLQUFpRCxFQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVksUUFBakUsRUFBMkU7QUFDMUUsb0JBQWUsSUFBZjtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxPQUFJLENBQUMsWUFBTCxFQUFtQjtBQUNsQixNQUFFLGNBQUYsQ0FBaUIsSUFBakI7QUFDQSxNQUFFLGVBQUY7QUFDQTtBQUNEO0FBQ0QsRUExZDBDOztBQTRkM0M7OztBQUdBLGtCQUFpQiwyQkFBYTs7QUFFN0IsTUFBSSxLQUFLLE1BQUwsS0FBZ0IsU0FBcEIsRUFBK0I7QUFDOUI7QUFDQTs7QUFFRCxNQUNDLElBQUksSUFETDtBQUFBLE1BRUMsUUFBUSxFQUFFLGFBRlg7QUFBQSxNQUdDLFVBSEQ7O0FBTUEsTUFBSSxVQUFVLElBQVYsSUFBa0IsTUFBTSxRQUE1QixFQUFzQztBQUNyQyxPQUFJLEVBQUUsbUJBQUYsQ0FBc0IsTUFBTSxPQUE1QixFQUFxQyxFQUFFLEtBQUYsQ0FBUSxXQUE3QyxDQUFKO0FBQ0EsT0FBSSxJQUFJLENBQUMsQ0FBVCxFQUFZO0FBQ1g7QUFDQSxNQUFFLFlBQUYsQ0FBZSxJQUFmLENBQW9CLE1BQU0sT0FBTixDQUFjLENBQWQsRUFBaUIsSUFBckMsRUFDQyxJQURELENBQ00sT0FETixFQUNrQixFQUFFLE9BQUYsQ0FBVSxXQUQ1Qix1QkFDeUQsTUFBTSxPQUFOLENBQWMsQ0FBZCxFQUFpQixVQUFqQixJQUErQixFQUR4RjtBQUVBLE1BQUUsUUFBRixDQUFXLElBQVgsR0FBa0IsTUFBbEIsQ0FBeUIsQ0FBekI7QUFDQSxXQUxXLENBS0g7QUFDUjs7QUFFRCxLQUFFLFFBQUYsQ0FBVyxJQUFYO0FBQ0EsR0FYRCxNQVdPO0FBQ04sS0FBRSxRQUFGLENBQVcsSUFBWDtBQUNBO0FBQ0QsRUF6ZjBDOztBQTJmM0M7Ozs7QUFJQSxjQUFhLHFCQUFVLEtBQVYsRUFBa0I7QUFDOUIsTUFBSSxJQUFJLElBQVI7O0FBRUEsSUFBRSxNQUFGLEdBQVcsS0FBWDtBQUNBLElBQUUsTUFBRixDQUFTLE9BQVQsQ0FBaUIsSUFBakIsR0FBd0IsQ0FBQyxFQUFFLE1BQUYsQ0FBUyxPQUFULENBQWlCLE1BQWxCLENBQXhCO0FBQ0EsSUFBRSxTQUFGLENBQVksQ0FBWjtBQUVBLEVBdGdCMEM7O0FBd2dCM0M7Ozs7QUFJQSxZQUFXLG1CQUFVLEtBQVYsRUFBa0I7QUFDNUIsTUFBSSxLQUFLLE1BQUwsS0FBZ0IsU0FBaEIsSUFBNkIsS0FBSyxlQUFMLEtBQXlCLFNBQTFELEVBQXFFO0FBQ3BFO0FBQ0E7O0FBRUQsTUFDQyxJQUFJLElBREw7QUFBQSxNQUVDLE1BQU0sRUFBRSxNQUFGLENBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QixJQUYvQjtBQUFBLE1BR0MsTUFBTSxFQUFFLE1BQUYsQ0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLElBSC9COztBQU1BLE1BQUksUUFBUSxTQUFSLElBQXFCLElBQUksTUFBSixLQUFlLFNBQXhDLEVBQW1EOztBQUVsRCxLQUFFLE1BQUYsQ0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLElBQXhCLEdBQStCLE1BQU0saUJBQWUsR0FBZixTQUNwQyxFQURvQyxDQUNqQyxNQURpQyxFQUN6QixZQUFNO0FBQ2pCLFFBQUksUUFBSixDQUFhLEVBQUUsZUFBZixFQUNDLElBREQsR0FFQyxNQUZELEdBR0MsUUFIRCxDQUdVLFVBSFYsRUFJQyxPQUpEO0FBTUEsSUFSb0MsQ0FBckM7QUFVQSxHQVpELE1BWU87O0FBRU4sT0FBSSxDQUFDLElBQUksRUFBSixDQUFPLFVBQVAsQ0FBRCxJQUF1QixDQUFDLElBQUksRUFBSixDQUFPLFdBQVAsQ0FBNUIsRUFBaUQ7QUFDaEQsUUFBSSxNQUFKLEdBQ0MsUUFERCxDQUNVLFVBRFYsRUFFQyxPQUZEO0FBR0E7QUFDRDtBQUVELEVBNWlCMEM7O0FBOGlCM0M7OztBQUdBLGdCQUFlLHlCQUFhOztBQUUzQixNQUFJLEtBQUssTUFBTCxLQUFnQixTQUFwQixFQUErQjtBQUM5QjtBQUNBOztBQUVELE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxTQUFTLEVBQUUsTUFGWjtBQUFBLE1BR0MsSUFBSSxFQUFFLG1CQUFGLENBQXNCLE9BQU8sT0FBN0IsRUFBc0MsRUFBRSxLQUFGLENBQVEsV0FBOUMsQ0FITDs7QUFNQSxNQUFJLElBQUksQ0FBQyxDQUFULEVBQVk7QUFDWCxLQUFFLFNBQUYsQ0FBWSxDQUFaO0FBQ0EsVUFGVyxDQUVIO0FBQ1I7QUFDRCxFQWprQjBDOztBQW1rQjNDOzs7QUFHQSxrQkFBaUIsMkJBQWE7QUFDN0IsTUFBSSxJQUFJLElBQVI7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLFFBQVEsRUFBRSxNQUFGLENBQVMsTUFBakMsRUFBeUMsSUFBSSxLQUE3QyxFQUFvRCxHQUFwRCxFQUF5RDtBQUN4RCxPQUFJLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBWSxJQUFaLEtBQXFCLFVBQXJCLElBQW1DLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBWSxRQUFuRCxFQUE2RDtBQUM1RCxNQUFFLFlBQUYsQ0FBZSxFQUFFLE1BQUYsQ0FBUyxDQUFULENBQWY7QUFDQSxNQUFFLFdBQUYsR0FBZ0IsSUFBaEI7QUFDQTtBQUNBO0FBQ0Q7QUFDRCxFQWhsQjBDOztBQWtsQjNDOzs7O0FBSUEsZUFBYyxzQkFBVSxRQUFWLEVBQXFCO0FBQ2xDLE1BQ0MsSUFBSSxJQURMO0FBQUEsTUFFQyxVQUZEO0FBQUEsTUFHQyxZQUhEO0FBQUEsTUFJQyxVQUFVLENBSlg7QUFBQSxNQUtDLGNBQWMsQ0FMZjtBQUFBLE1BTUMsUUFBUSxTQUFTLE9BQVQsQ0FBaUIsTUFOMUI7O0FBU0EsSUFBRSxRQUFGLENBQVcsS0FBWDs7QUFFQSxPQUFLLElBQUksQ0FBVCxFQUFZLElBQUksS0FBaEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDM0IsU0FBTSxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBb0IsSUFBcEIsR0FBMkIsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLEtBQXJEO0FBQ0EsYUFBVSxLQUFLLEtBQUwsQ0FBVyxNQUFNLEVBQUUsS0FBRixDQUFRLFFBQWQsR0FBeUIsR0FBcEMsQ0FBVjs7QUFFQTtBQUNBLE9BQUksVUFBVSxXQUFWLEdBQXdCLEdBQXhCLElBQ0gsTUFBTSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsR0FBMEIsQ0FBaEMsSUFBcUMsVUFBVSxXQUFWLEdBQXdCLEdBRDlELEVBQ21FO0FBQ2xFLGNBQVUsTUFBTSxXQUFoQjtBQUNBOztBQUVELEtBQUUsUUFBRixDQUFXLE1BQVgsQ0FBa0IsRUFDakIsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsc0JBQXFELFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFvQixLQUF6RSx1QkFBZ0csWUFBWSxRQUFaLEVBQWhHLGtCQUFtSSxRQUFRLFFBQVIsRUFBbkksOEJBQ2lCLEVBQUUsT0FBRixDQUFVLFdBRDNCLHdCQUVNLE1BQU0sU0FBUyxPQUFULENBQWlCLE1BQWpCLEdBQTBCLENBQWpDLFNBQTBDLEVBQUUsT0FBRixDQUFVLFdBQXBELDBCQUFzRixFQUYzRix5Q0FHNEIsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLElBSGhELGlEQUtNLDZCQUFrQixTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBb0IsS0FBdEMsRUFBNkMsRUFBRSxPQUFGLENBQVUsZUFBdkQsQ0FMTixzQkFPTyw2QkFBa0IsU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQW9CLElBQXRDLEVBQTRDLEVBQUUsT0FBRixDQUFVLGVBQXRELENBUFAsbUNBRGlCLENBQWxCO0FBWUEsa0JBQWUsT0FBZjtBQUNBOztBQUVELElBQUUsUUFBRixDQUFXLElBQVgsT0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsY0FBb0QsS0FBcEQsQ0FBMEQsWUFBVztBQUNwRSxLQUFFLEtBQUYsQ0FBUSxjQUFSLENBQXVCLFdBQVcsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLEtBQWIsQ0FBWCxDQUF2QjtBQUNBLE9BQUksRUFBRSxLQUFGLENBQVEsTUFBWixFQUFvQjtBQUNuQixNQUFFLEtBQUYsQ0FBUSxJQUFSO0FBQ0E7QUFDRCxHQUxEOztBQU9BLElBQUUsUUFBRixDQUFXLElBQVg7QUFDQSxFQW5vQjBDO0FBb29CM0M7Ozs7Ozs7QUFPQSxzQkFBcUIsNkJBQVUsTUFBVixFQUFrQixXQUFsQixFQUFnQztBQUNwRCxNQUNDLEtBQUssQ0FETjtBQUFBLE1BRUMsS0FBSyxPQUFPLE1BQVAsR0FBZ0IsQ0FGdEI7QUFBQSxNQUdDLFlBSEQ7QUFBQSxNQUlDLGNBSkQ7QUFBQSxNQUtDLGFBTEQ7O0FBUUEsU0FBTyxNQUFNLEVBQWIsRUFBaUI7QUFDaEIsU0FBUSxLQUFLLEVBQU4sSUFBYSxDQUFwQjtBQUNBLFdBQVEsT0FBTyxHQUFQLEVBQVksS0FBcEI7QUFDQSxVQUFPLE9BQU8sR0FBUCxFQUFZLElBQW5COztBQUVBLE9BQUksZUFBZSxLQUFmLElBQXdCLGNBQWMsSUFBMUMsRUFBZ0Q7QUFDL0MsV0FBTyxHQUFQO0FBQ0EsSUFGRCxNQUVPLElBQUksUUFBUSxXQUFaLEVBQXlCO0FBQy9CLFNBQUssTUFBTSxDQUFYO0FBQ0EsSUFGTSxNQUVBLElBQUksUUFBUSxXQUFaLEVBQXlCO0FBQy9CLFNBQUssTUFBTSxDQUFYO0FBQ0E7QUFDRDs7QUFFRCxTQUFPLENBQUMsQ0FBUjtBQUNBO0FBbnFCMEMsQ0FBNUM7O0FBc3FCQTs7Ozs7QUFLQSxlQUFLLFFBQUwsR0FBZ0I7QUFDZixRQUFPO0FBQ04sTUFBSSxnQkFERTtBQUVOLE1BQUksZUFGRTtBQUdOLE1BQUksYUFIRTtBQUlOLE1BQUksaUJBSkU7QUFLTixNQUFJLGdCQUxFO0FBTU4sTUFBSSxjQU5FO0FBT04sTUFBSSxjQVBFO0FBUU4sV0FBUyx5QkFSSDtBQVNOLFdBQVMseUJBVEg7QUFVTixNQUFJLGVBVkU7QUFXTixNQUFJLFlBWEU7QUFZTixNQUFJLGFBWkU7QUFhTixNQUFJLFlBYkU7QUFjTixNQUFJLGNBZEU7QUFlTixNQUFJLGVBZkU7QUFnQk4sTUFBSSxlQWhCRTtBQWlCTixNQUFJLGNBakJFO0FBa0JOLE1BQUksYUFsQkU7QUFtQk4sTUFBSSxlQW5CRTtBQW9CTixNQUFJLGFBcEJFO0FBcUJOLE1BQUksWUFyQkU7QUFzQk4sTUFBSSxxQkF0QkU7QUF1Qk4sTUFBSSxhQXZCRTtBQXdCTixNQUFJLFlBeEJFO0FBeUJOLE1BQUksZ0JBekJFO0FBMEJOLE1BQUksZ0JBMUJFO0FBMkJOLE1BQUksaUJBM0JFO0FBNEJOLE1BQUksWUE1QkU7QUE2Qk4sTUFBSSxjQTdCRTtBQThCTixNQUFJLGVBOUJFO0FBK0JOLE1BQUksYUEvQkU7QUFnQ04sTUFBSSxjQWhDRTtBQWlDTixNQUFJLGlCQWpDRTtBQWtDTixNQUFJLGlCQWxDRTtBQW1DTixNQUFJLFlBbkNFO0FBb0NOLE1BQUksY0FwQ0U7QUFxQ04sTUFBSSxnQkFyQ0U7QUFzQ04sTUFBSSxjQXRDRTtBQXVDTixNQUFJLGFBdkNFO0FBd0NOLE1BQUksaUJBeENFO0FBeUNOLE1BQUksZUF6Q0U7QUEwQ04sTUFBSSxjQTFDRTtBQTJDTixNQUFJLGNBM0NFO0FBNENOLE1BQUksYUE1Q0U7QUE2Q04sTUFBSSxnQkE3Q0U7QUE4Q04sTUFBSSxjQTlDRTtBQStDTixNQUFJLGNBL0NFO0FBZ0ROLE1BQUksY0FoREU7QUFpRE4sTUFBSSxjQWpERTtBQWtETixNQUFJLFdBbERFO0FBbUROLE1BQUksY0FuREU7QUFvRE4sTUFBSSxnQkFwREU7QUFxRE4sTUFBSSxpQkFyREU7QUFzRE4sTUFBSSxZQXRERTtBQXVETixNQUFJO0FBdkRFO0FBRFEsQ0FBaEI7O0FBNERBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxlQUFLLGlCQUFMLEdBQXlCO0FBQ3hCLFNBQVE7QUFDUDs7O0FBR0Esb0JBQWtCLG9IQUpYOztBQU1QOzs7OztBQUtBLFNBQU8sZUFBVSxTQUFWLEVBQXNCO0FBQzVCLE9BQ0MsSUFBSSxDQURMO0FBQUEsT0FFQyxRQUFRLGVBQUssaUJBQUwsQ0FBdUIsTUFBdkIsQ0FBOEIsU0FBOUIsRUFBeUMsT0FBekMsQ0FGVDtBQUFBLE9BR0MsVUFBVSxFQUhYO0FBQUEsT0FJQyxpQkFKRDtBQUFBLE9BS0MsYUFMRDtBQUFBLE9BTUMsbUJBTkQ7QUFPQSxVQUFPLElBQUksTUFBTSxNQUFqQixFQUF5QixHQUF6QixFQUE4QjtBQUM3QixlQUFXLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsTUFBTSxDQUFOLENBQTNCLENBQVg7O0FBRUEsUUFBSSxZQUFZLElBQUksTUFBTSxNQUExQixFQUFrQztBQUNqQyxTQUFLLElBQUksQ0FBTCxJQUFXLENBQVgsSUFBZ0IsTUFBTSxJQUFJLENBQVYsTUFBaUIsRUFBckMsRUFBeUM7QUFDeEMsbUJBQWEsTUFBTSxJQUFJLENBQVYsQ0FBYjtBQUNBO0FBQ0Q7QUFDQTtBQUNBLFlBQU8sTUFBTSxDQUFOLENBQVA7QUFDQTtBQUNBLFlBQU8sTUFBTSxDQUFOLE1BQWEsRUFBYixJQUFtQixJQUFJLE1BQU0sTUFBcEMsRUFBNEM7QUFDM0MsYUFBVSxJQUFWLFVBQW1CLE1BQU0sQ0FBTixDQUFuQjtBQUNBO0FBQ0E7QUFDRCxZQUFPLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxPQUFiLENBQXFCLDZFQUFyQixFQUFvRyxxQ0FBcEcsQ0FBUDtBQUNBLGFBQVEsSUFBUixDQUFhO0FBQ1osa0JBQVksVUFEQTtBQUVaLGFBQVEsaUNBQXNCLFNBQVMsQ0FBVCxDQUF0QixNQUF1QyxDQUF4QyxHQUE2QyxLQUE3QyxHQUFxRCxpQ0FBc0IsU0FBUyxDQUFULENBQXRCLENBRmhEO0FBR1osWUFBTSxpQ0FBc0IsU0FBUyxDQUFULENBQXRCLENBSE07QUFJWixZQUFNLElBSk07QUFLWixnQkFBVSxTQUFTLENBQVQ7QUFMRSxNQUFiO0FBT0E7QUFDRCxpQkFBYSxFQUFiO0FBQ0E7QUFDRCxVQUFPLE9BQVA7QUFDQTtBQTlDTSxFQURnQjtBQWlEeEI7QUFDQSxPQUFNO0FBQ0w7Ozs7O0FBS0EsU0FBTyxlQUFVLFNBQVYsRUFBc0I7QUFDNUIsZUFBWSxFQUFFLFNBQUYsRUFBYSxNQUFiLENBQW9CLElBQXBCLENBQVo7QUFDQSxPQUNDLFlBQVksVUFBVSxRQUFWLENBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLENBQTZCLENBQTdCLENBRGI7QUFBQSxPQUVDLFFBQVEsVUFBVSxJQUFWLENBQWUsR0FBZixDQUZUO0FBQUEsT0FHQyxZQUFZLFVBQVUsSUFBVixPQUFtQixVQUFVLElBQVYsQ0FBZSxPQUFmLENBQW5CLENBSGI7QUFBQSxPQUlDLGVBSkQ7QUFBQSxPQUtDLFVBQVUsRUFMWDtBQUFBLE9BTUMsVUFORDs7QUFVQSxPQUFJLFVBQVUsTUFBZCxFQUFzQjtBQUNyQixRQUFJLGFBQWEsVUFBVSxVQUFWLENBQXFCLElBQXJCLEVBQTJCLEdBQTNCLENBQStCLENBQS9CLEVBQWtDLFVBQW5EO0FBQ0EsUUFBSSxXQUFXLE1BQWYsRUFBdUI7QUFDdEIsY0FBUyxFQUFUO0FBQ0EsVUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLFdBQVcsTUFBM0IsRUFBbUMsR0FBbkMsRUFBd0M7QUFDdkMsYUFBTyxXQUFXLENBQVgsRUFBYyxJQUFkLENBQW1CLEtBQW5CLENBQXlCLEdBQXpCLEVBQThCLENBQTlCLENBQVAsSUFBMkMsV0FBVyxDQUFYLEVBQWMsS0FBekQ7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsUUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLE1BQU0sTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDbEMsUUFDQyxjQUREO0FBQUEsUUFFQyxRQUFRO0FBQ1AsWUFBTyxJQURBO0FBRVAsV0FBTSxJQUZDO0FBR1AsWUFBTyxJQUhBO0FBSVAsV0FBTTtBQUpDLEtBRlQ7O0FBVUEsUUFBSSxNQUFNLEVBQU4sQ0FBUyxDQUFULEVBQVksSUFBWixDQUFpQixPQUFqQixDQUFKLEVBQStCO0FBQzlCLFdBQU0sS0FBTixHQUFjLGlDQUFzQixNQUFNLEVBQU4sQ0FBUyxDQUFULEVBQVksSUFBWixDQUFpQixPQUFqQixDQUF0QixDQUFkO0FBQ0E7QUFDRCxRQUFJLENBQUMsTUFBTSxLQUFQLElBQWdCLE1BQU0sRUFBTixDQUFTLElBQUksQ0FBYixFQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUFwQixFQUFpRDtBQUNoRCxXQUFNLEtBQU4sR0FBYyxpQ0FBc0IsTUFBTSxFQUFOLENBQVMsSUFBSSxDQUFiLEVBQWdCLElBQWhCLENBQXFCLEtBQXJCLENBQXRCLENBQWQ7QUFDQTtBQUNELFFBQUksTUFBTSxFQUFOLENBQVMsQ0FBVCxFQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBSixFQUE2QjtBQUM1QixXQUFNLElBQU4sR0FBYSxpQ0FBc0IsTUFBTSxFQUFOLENBQVMsQ0FBVCxFQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBdEIsQ0FBYjtBQUNBO0FBQ0QsUUFBSSxDQUFDLE1BQU0sSUFBUCxJQUFlLE1BQU0sRUFBTixDQUFTLElBQUksQ0FBYixFQUFnQixJQUFoQixDQUFxQixPQUFyQixDQUFuQixFQUFrRDtBQUNqRCxXQUFNLElBQU4sR0FBYSxpQ0FBc0IsTUFBTSxFQUFOLENBQVMsSUFBSSxDQUFiLEVBQWdCLElBQWhCLENBQXFCLE9BQXJCLENBQXRCLENBQWI7QUFDQTs7QUFFRCxRQUFJLE1BQUosRUFBWTtBQUNYLGFBQVEsRUFBUjtBQUNBLFVBQUssSUFBSSxNQUFULElBQW1CLE1BQW5CLEVBQTJCO0FBQzFCLGVBQVksTUFBWixTQUFzQixPQUFPLE1BQVAsQ0FBdEI7QUFDQTtBQUNEO0FBQ0QsUUFBSSxLQUFKLEVBQVc7QUFDVixXQUFNLEtBQU4sR0FBYyxLQUFkO0FBQ0E7QUFDRCxRQUFJLE1BQU0sS0FBTixLQUFnQixDQUFwQixFQUF1QjtBQUN0QixXQUFNLEtBQU4sR0FBYyxLQUFkO0FBQ0E7QUFDRCxVQUFNLElBQU4sR0FBYSxFQUFFLElBQUYsQ0FBTyxNQUFNLEVBQU4sQ0FBUyxDQUFULEVBQVksSUFBWixFQUFQLEVBQTJCLE9BQTNCLENBQW1DLDZFQUFuQyxFQUFrSCxxQ0FBbEgsQ0FBYjtBQUNBLFlBQVEsSUFBUixDQUFhLEtBQWI7QUFDQTtBQUNELFVBQU8sT0FBUDtBQUNBO0FBcEVJLEVBbERrQjtBQXdIeEI7Ozs7OztBQU1BLFNBQVEsZ0JBQVUsSUFBVixFQUFnQixLQUFoQixFQUF3QjtBQUMvQjtBQUNBO0FBQ0EsU0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQVA7QUFDQTtBQWxJdUIsQ0FBekI7O0FBcUlBO0FBQ0EsSUFBSSxTQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCLE1BQXZCLEtBQWtDLENBQXRDLEVBQXlDO0FBQ3hDO0FBQ0EsZ0JBQUssaUJBQUwsQ0FBdUIsTUFBdkIsR0FBZ0MsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUNoRCxNQUNDLFFBQVEsRUFEVDtBQUFBLE1BRUMsUUFBUSxFQUZUO0FBQUEsTUFHQyxVQUhEOztBQUtBLE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxLQUFLLE1BQXJCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2pDLFlBQVMsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQXRCLENBQVQ7QUFDQSxPQUFJLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBSixFQUF1QjtBQUN0QixVQUFNLElBQU4sQ0FBVyxNQUFNLE9BQU4sQ0FBYyxLQUFkLEVBQXFCLEVBQXJCLENBQVg7QUFDQSxZQUFRLEVBQVI7QUFDQTtBQUNEO0FBQ0QsUUFBTSxJQUFOLENBQVcsS0FBWDtBQUNBLFNBQU8sS0FBUDtBQUNBLEVBZkQ7QUFnQkE7OztBQ244QkQ7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7QUFRQTtBQUNBLE9BQU8sTUFBUCxpQkFBc0I7QUFDckI7OztBQUdBLFdBQVUsRUFKVztBQUtyQjs7O0FBR0Esd0JBQXVCLEVBUkY7QUFTckI7OztBQUdBLDJCQUEwQixJQVpMO0FBYXJCOzs7QUFHQSxjQUFhLFlBaEJRO0FBaUJyQjs7O0FBR0EsY0FBYTtBQXBCUSxDQUF0Qjs7QUF1QkEsT0FBTyxNQUFQLENBQWMsaUJBQW1CLFNBQWpDLEVBQTRDOztBQUUzQzs7Ozs7Ozs7OztBQVVBLGNBQWEscUJBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixNQUE1QixFQUFvQyxLQUFwQyxFQUE0Qzs7QUFFeEQ7QUFDQSxNQUFJLENBQUMsMENBQUQsS0FBMEIsS0FBSyxPQUFMLENBQWEsd0JBQTNDLEVBQXFFO0FBQ3BFO0FBQ0E7O0FBRUQsTUFDQyxJQUFJLElBREw7QUFBQSxNQUVDLE9BQVEsRUFBRSxPQUFILEdBQWMsRUFBRSxPQUFGLENBQVUsV0FBeEIsR0FBc0MsRUFBRSxPQUFGLENBQVUsV0FGeEQ7QUFBQSxNQUdDLFdBQVcsRUFBRSxPQUFGLENBQVUsUUFBVixHQUFxQixFQUFFLE9BQUYsQ0FBVSxRQUEvQixHQUEwQyxlQUFLLENBQUwsQ0FBTyxrQkFBUCxDQUh0RDtBQUFBLE1BSUMsb0JBQW9CLEVBQUUsT0FBRixDQUFVLHFCQUFWLEdBQWtDLEVBQUUsT0FBRixDQUFVLHFCQUE1QyxHQUFvRSxlQUFLLENBQUwsQ0FBTyx1QkFBUCxDQUp6RjtBQUFBLE1BS0MsT0FBUSxTQUFTLFlBQVY7O0FBRU47QUFDQSxJQUFFLGlCQUFlLEVBQUUsT0FBRixDQUFVLFdBQXpCLGVBQThDLEVBQUUsT0FBRixDQUFVLFdBQXhELHNCQUFvRixFQUFFLE9BQUYsQ0FBVSxXQUE5Rix5REFDdUMsRUFBRSxFQUR6QyxpQkFDdUQsUUFEdkQsc0JBQ2dGLFFBRGhGLDBFQUdzQyxFQUFFLE9BQUYsQ0FBVSxXQUhoRCxzREFJZSxFQUFFLE9BQUYsQ0FBVSxXQUp6QixtQkFJa0QsaUJBSmxELGtDQUtjLEVBQUUsT0FBRixDQUFVLFdBTHhCLG9EQU1lLEVBQUUsT0FBRixDQUFVLFdBTnpCLDREQU9lLEVBQUUsT0FBRixDQUFVLFdBUHpCLDBEQUFGLEVBVUMsUUFWRCxDQVVVLFFBVlYsQ0FITTs7QUFlTjtBQUNBLElBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZUFBOEMsRUFBRSxPQUFGLENBQVUsV0FBeEQsc0JBQW9GLEVBQUUsT0FBRixDQUFVLFdBQTlGLHlEQUN1QyxFQUFFLEVBRHpDLGlCQUN1RCxRQUR2RCxzQkFDZ0YsUUFEaEYsK0RBRXVDLEVBQUUsT0FBRixDQUFVLFdBRmpELDJDQUdnQixFQUFFLE9BQUYsQ0FBVSxXQUgxQixtQkFHbUQsaUJBSG5ELGtDQUllLEVBQUUsT0FBRixDQUFVLFdBSnpCLHlDQUtnQixFQUFFLE9BQUYsQ0FBVSxXQUwxQixpREFNZ0IsRUFBRSxPQUFGLENBQVUsV0FOMUIsMERBQUYsRUFVQyxRQVZELENBVVUsUUFWVixDQXJCRjtBQUFBLE1BZ0NDLGVBQWUsRUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQixrQ0FDWCxFQUFFLE9BQUYsQ0FBVSxXQURDLDhCQWhDaEI7QUFBQSxNQWtDQyxjQUFjLEVBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0IsaUNBQ1YsRUFBRSxPQUFGLENBQVUsV0FEQSw2QkFsQ2Y7QUFBQSxNQW9DQyxnQkFBZ0IsRUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQixtQ0FDWixFQUFFLE9BQUYsQ0FBVSxXQURFLCtCQXBDakI7QUFBQSxNQXNDQyxlQUFlLEVBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0Isa0NBQ1gsRUFBRSxPQUFGLENBQVUsV0FEQyw4QkF0Q2hCOzs7QUF5Q0M7Ozs7QUFJQSx5QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsTUFBRCxFQUFZOztBQUVsQztBQUNBLFlBQVMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQVosQ0FBVDtBQUNBLFlBQVMsS0FBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixDQUFqQixDQUFUOztBQUVBO0FBQ0EsT0FBSSxXQUFXLENBQWYsRUFBa0I7QUFDakIsU0FBSyxXQUFMLENBQW9CLEVBQUUsT0FBRixDQUFVLFdBQTlCLFdBQWlELFFBQWpELENBQTZELEVBQUUsT0FBRixDQUFVLFdBQXZFO0FBQ0EsU0FBSyxRQUFMLENBQWMsUUFBZCxFQUF3QixJQUF4QixDQUE2QjtBQUM1QixZQUFPLGVBQUssQ0FBTCxDQUFPLGFBQVAsQ0FEcUI7QUFFNUIsbUJBQWMsZUFBSyxDQUFMLENBQU8sYUFBUDtBQUZjLEtBQTdCO0FBSUEsSUFORCxNQU1PO0FBQ04sU0FBSyxXQUFMLENBQW9CLEVBQUUsT0FBRixDQUFVLFdBQTlCLGFBQW1ELFFBQW5ELENBQStELEVBQUUsT0FBRixDQUFVLFdBQXpFO0FBQ0EsU0FBSyxRQUFMLENBQWMsUUFBZCxFQUF3QixJQUF4QixDQUE2QjtBQUM1QixZQUFPLGVBQUssQ0FBTCxDQUFPLFdBQVAsQ0FEcUI7QUFFNUIsbUJBQWMsZUFBSyxDQUFMLENBQU8sV0FBUDtBQUZjLEtBQTdCO0FBSUE7O0FBRUQsT0FBSSxtQkFBdUIsU0FBUyxHQUFoQyxNQUFKOztBQUVBO0FBQ0EsT0FBSSxTQUFTLFVBQWIsRUFBeUI7QUFDeEIsa0JBQWMsR0FBZCxDQUFrQjtBQUNqQixhQUFRLEdBRFM7QUFFakIsYUFBUTtBQUZTLEtBQWxCO0FBSUEsaUJBQWEsR0FBYixDQUFpQjtBQUNoQixhQUFRLGdCQURRO0FBRWhCLG1CQUFrQixDQUFDLGFBQWEsTUFBYixFQUFELEdBQXlCLENBQTNDO0FBRmdCLEtBQWpCO0FBSUEsSUFURCxNQVNPO0FBQ04sa0JBQWMsR0FBZCxDQUFrQjtBQUNqQixXQUFNLEdBRFc7QUFFakIsWUFBTztBQUZVLEtBQWxCO0FBSUEsaUJBQWEsR0FBYixDQUFpQjtBQUNoQixXQUFNLGdCQURVO0FBRWhCLGlCQUFnQixDQUFDLGFBQWEsS0FBYixFQUFELEdBQXdCLENBQXhDO0FBRmdCLEtBQWpCO0FBSUE7QUFDRCxHQXhGRjs7QUF5RkM7OztBQUdBLHFCQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxDQUFELEVBQU87O0FBRXpCLE9BQ0MsU0FBUyxJQURWO0FBQUEsT0FFQyxjQUFjLFlBQVksTUFBWixFQUZmOztBQUtBO0FBQ0EsT0FBSSxTQUFTLFVBQWIsRUFBeUI7O0FBRXhCLFFBQ0MsYUFBYSxZQUFZLE1BQVosRUFEZDtBQUFBLFFBRUMsT0FBTyxFQUFFLEtBQUYsR0FBVSxZQUFZLEdBRjlCOztBQUtBLGFBQVMsQ0FBQyxhQUFhLElBQWQsSUFBc0IsVUFBL0I7O0FBRUE7QUFDQSxRQUFJLFlBQVksR0FBWixLQUFvQixDQUFwQixJQUF5QixZQUFZLElBQVosS0FBcUIsQ0FBbEQsRUFBcUQ7QUFDcEQ7QUFDQTtBQUVELElBZEQsTUFjTztBQUNOLFFBQ0MsWUFBWSxZQUFZLEtBQVosRUFEYjtBQUFBLFFBRUMsT0FBTyxFQUFFLEtBQUYsR0FBVSxZQUFZLElBRjlCOztBQUtBLGFBQVMsT0FBTyxTQUFoQjtBQUNBOztBQUVEO0FBQ0EsWUFBUyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBWixDQUFUO0FBQ0EsWUFBUyxLQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQWpCLENBQVQ7O0FBRUE7QUFDQSx3QkFBcUIsTUFBckI7O0FBRUE7QUFDQSxPQUFJLFdBQVcsQ0FBZixFQUFrQjtBQUNqQixVQUFNLFFBQU4sQ0FBZSxJQUFmO0FBQ0EsSUFGRCxNQUVPO0FBQ04sVUFBTSxRQUFOLENBQWUsS0FBZjtBQUNBO0FBQ0QsU0FBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ0EsR0F6SUY7QUFBQSxNQTBJQyxjQUFjLEtBMUlmO0FBQUEsTUEySUMsY0FBYyxLQTNJZjs7QUE2SUE7QUFDQSxPQUNFLEVBREYsQ0FDSyxvQkFETCxFQUMyQixZQUFNO0FBQy9CLGdCQUFhLElBQWI7QUFDQSxpQkFBYyxJQUFkO0FBQ0EsR0FKRixFQUtFLEVBTEYsQ0FLSyxxQkFMTCxFQUs0QixZQUFNO0FBQ2hDLGlCQUFjLEtBQWQ7O0FBRUEsT0FBSSxDQUFDLFdBQUQsSUFBZ0IsU0FBUyxVQUE3QixFQUF5QztBQUN4QyxpQkFBYSxJQUFiO0FBQ0E7QUFDRCxHQVhGOztBQWFBOzs7QUFHQSxNQUFJLHFCQUFxQixTQUFyQixrQkFBcUIsR0FBTTs7QUFFOUIsT0FBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQU0sTUFBTixHQUFlLEdBQTFCLENBQWI7O0FBRUEsZ0JBQWEsSUFBYixDQUFrQjtBQUNqQixrQkFBYyxlQUFLLENBQUwsQ0FBTyxvQkFBUCxDQURHO0FBRWpCLHFCQUFpQixDQUZBO0FBR2pCLHFCQUFpQixHQUhBO0FBSWpCLHFCQUFpQixNQUpBO0FBS2pCLHNCQUFxQixNQUFyQixNQUxpQjtBQU1qQixZQUFRLFFBTlM7QUFPakIsZ0JBQVksQ0FBQztBQVBJLElBQWxCO0FBVUEsR0FkRDs7QUFnQkE7QUFDQSxlQUNFLEVBREYsQ0FDSyxXQURMLEVBQ2tCLFlBQU07QUFDdEIsaUJBQWMsSUFBZDtBQUNBLEdBSEYsRUFJRSxFQUpGLENBSUssV0FKTCxFQUlrQixVQUFDLENBQUQsRUFBTztBQUN2QixvQkFBaUIsQ0FBakI7QUFDQSxLQUFFLFVBQUYsQ0FBYSxlQUFiLEVBQThCLFVBQUMsQ0FBRCxFQUFPO0FBQ3BDLHFCQUFpQixDQUFqQjtBQUNBLElBRkQ7QUFHQSxLQUFFLFVBQUYsQ0FBYSxhQUFiLEVBQTRCLFlBQU07QUFDakMsa0JBQWMsS0FBZDtBQUNBLE1BQUUsWUFBRixDQUFlLDJCQUFmOztBQUVBLFFBQUksQ0FBQyxXQUFELElBQWdCLFNBQVMsVUFBN0IsRUFBeUM7QUFDeEMsa0JBQWEsSUFBYjtBQUNBO0FBQ0QsSUFQRDtBQVFBLGlCQUFjLElBQWQ7O0FBRUEsVUFBTyxLQUFQO0FBQ0EsR0FwQkYsRUFxQkUsRUFyQkYsQ0FxQkssU0FyQkwsRUFxQmdCLFVBQUMsQ0FBRCxFQUFPOztBQUVyQixPQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsQ0FBcUIsTUFBekIsRUFBaUM7QUFDaEMsUUFDQyxVQUFVLEVBQUUsS0FBRixJQUFXLEVBQUUsT0FBYixJQUF3QixDQURuQztBQUFBLFFBRUMsU0FBUyxNQUFNLE1BRmhCO0FBSUEsWUFBUSxPQUFSO0FBQ0MsVUFBSyxFQUFMO0FBQVM7QUFDUixlQUFTLEtBQUssR0FBTCxDQUFTLFNBQVMsR0FBbEIsRUFBdUIsQ0FBdkIsQ0FBVDtBQUNBO0FBQ0QsVUFBSyxFQUFMO0FBQVM7QUFDUixlQUFTLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxTQUFTLEdBQXJCLENBQVQ7QUFDQTtBQUNEO0FBQ0MsYUFBTyxJQUFQO0FBUkY7O0FBV0Esa0JBQWMsS0FBZDtBQUNBLHlCQUFxQixNQUFyQjtBQUNBLFVBQU0sU0FBTixDQUFnQixNQUFoQjtBQUNBLFdBQU8sS0FBUDtBQUNBO0FBQ0QsR0E1Q0Y7O0FBOENBO0FBQ0EsT0FBSyxJQUFMLENBQVUsUUFBVixFQUFvQixLQUFwQixDQUEwQixZQUFNO0FBQy9CLFNBQU0sUUFBTixDQUFlLENBQUMsTUFBTSxLQUF0QjtBQUNBLEdBRkQ7O0FBSUE7QUFDQSxPQUFLLElBQUwsQ0FBVSxRQUFWLEVBQW9CLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDLFlBQU07QUFDckMsT0FBSSxTQUFTLFVBQWIsRUFBeUI7QUFDeEIsaUJBQWEsSUFBYjtBQUNBO0FBQ0QsR0FKRCxFQUlHLEVBSkgsQ0FJTSxNQUpOLEVBSWMsWUFBTTtBQUNuQixPQUFJLFNBQVMsVUFBYixFQUF5QjtBQUN4QixpQkFBYSxJQUFiO0FBQ0E7QUFDRCxHQVJEOztBQVVBO0FBQ0EsUUFBTSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxVQUFDLENBQUQsRUFBTztBQUM3QyxPQUFJLENBQUMsV0FBTCxFQUFrQjtBQUNqQixRQUFJLE1BQU0sS0FBVixFQUFpQjtBQUNoQiwwQkFBcUIsQ0FBckI7QUFDQSxVQUFLLFdBQUwsQ0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsV0FBaUQsUUFBakQsQ0FBNkQsRUFBRSxPQUFGLENBQVUsV0FBdkU7QUFDQSxLQUhELE1BR087QUFDTiwwQkFBcUIsTUFBTSxNQUEzQjtBQUNBLFVBQUssV0FBTCxDQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QixhQUFtRCxRQUFuRCxDQUErRCxFQUFFLE9BQUYsQ0FBVSxXQUF6RTtBQUNBO0FBQ0Q7QUFDRCxzQkFBbUIsQ0FBbkI7QUFDQSxHQVhELEVBV0csS0FYSDs7QUFhQTtBQUNBLE1BQUksT0FBTyxPQUFQLENBQWUsV0FBZixLQUErQixDQUFuQyxFQUFzQztBQUNyQyxTQUFNLFFBQU4sQ0FBZSxJQUFmO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLFdBQVcsRUFBRSxLQUFGLENBQVEsWUFBUixLQUF5QixJQUF6QixJQUFpQyxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLEtBQXJCLENBQTJCLGdCQUEzQixNQUFpRCxJQUFqRzs7QUFFQSxNQUFJLFFBQUosRUFBYztBQUNiLFNBQU0sU0FBTixDQUFnQixPQUFPLE9BQVAsQ0FBZSxXQUEvQjtBQUNBOztBQUVELElBQUUsU0FBRixDQUFZLEVBQVosQ0FBZSxnQkFBZixFQUFpQyxZQUFNO0FBQ3RDLE9BQUksTUFBTSxLQUFWLEVBQWlCO0FBQ2hCLHlCQUFxQixDQUFyQjtBQUNBLFNBQUssV0FBTCxDQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QixXQUNDLFFBREQsQ0FDYSxFQUFFLE9BQUYsQ0FBVSxXQUR2QjtBQUVBLElBSkQsTUFJTztBQUNOLHlCQUFxQixNQUFNLE1BQTNCO0FBQ0EsU0FBSyxXQUFMLENBQW9CLEVBQUUsT0FBRixDQUFVLFdBQTlCLGFBQ0MsUUFERCxDQUNhLEVBQUUsT0FBRixDQUFVLFdBRHZCO0FBRUE7QUFDRCxHQVZEO0FBV0E7QUFyUzBDLENBQTVDOzs7QUN2Q0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQVdPLElBQU0sa0JBQUs7QUFDakIscUJBQW9CLENBREg7O0FBR2pCO0FBQ0EsdUJBQXNCLDhMQUpMOztBQU1qQjtBQUNBLHdCQUF1QixxQkFQTjtBQVFqQix1QkFBc0IsZUFSTDtBQVNqQix3QkFBdUIsZ0JBVE47O0FBV2pCO0FBQ0Esb0JBQW1CLFlBWkY7O0FBY2pCO0FBQ0EsMkJBQTBCLENBQUMsdUJBQUQsRUFBMEIseUJBQTFCLENBZlQ7O0FBaUJqQjtBQUNBLGNBQWEsYUFsQkk7O0FBb0JqQjtBQUNBLGNBQWEsTUFyQkk7QUFzQmpCLGVBQWMsT0F0Qkc7O0FBd0JqQjtBQUNBLGVBQWMsT0F6Qkc7O0FBMkJqQjtBQUNBLHFCQUFvQixhQTVCSDtBQTZCakIsd0JBQXVCLHlGQTdCTjs7QUErQmpCO0FBQ0Esd0JBQXVCLENBQUMsb0JBQUQsRUFBdUIsc0JBQXZCLENBaENOOztBQWtDakI7QUFDQSw0QkFBMkIsb0JBbkNWO0FBb0NqQixjQUFhLE1BcENJOztBQXNDakI7QUFDQSxxQkFBb0IsYUF2Q0g7QUF3Q2pCLDBCQUF5Qix3REF4Q1I7QUF5Q2pCLGdCQUFlLFFBekNFO0FBMENqQixjQUFhLE1BMUNJO0FBMkNqQix1QkFBc0IsZUEzQ0w7O0FBNkNqQjtBQUNBLHNCQUFxQixjQTlDSjtBQStDakIsc0JBQXFCLGNBL0NKOztBQWlEakI7QUFDQSxpQkFBZ0IsU0FsREM7QUFtRGpCLHNCQUFxQixDQUFDLGtCQUFELEVBQXFCLG9CQUFyQixDQW5ESjs7QUFxRGpCO0FBQ0Esd0JBQXVCLGdCQXRETjs7QUF3RGpCO0FBQ0EsY0FBYSxNQXpESTs7QUEyRGpCO0FBQ0Esb0JBQW9CLFlBNURIOztBQThEakI7QUFDQSx3QkFBd0IsZ0JBL0RQOztBQWlFakI7QUFDQSxtQkFBa0IsV0FsRUQ7QUFtRWpCLGtCQUFpQixVQW5FQTtBQW9FakIsZ0JBQWUsUUFwRUU7QUFxRWpCLG9CQUFtQixZQXJFRjtBQXNFakIsbUJBQWtCLFdBdEVEO0FBdUVqQixpQkFBZ0IsU0F2RUM7QUF3RWpCLGlCQUFnQixTQXhFQztBQXlFakIsNEJBQTJCLHNCQXpFVjtBQTBFakIsNkJBQTRCLHVCQTFFWDtBQTJFakIsa0JBQWlCLFVBM0VBO0FBNEVqQixlQUFjLE9BNUVHO0FBNkVqQixnQkFBZSxRQTdFRTtBQThFakIsZUFBYyxPQTlFRztBQStFakIsaUJBQWdCLFNBL0VDO0FBZ0ZqQixrQkFBaUIsVUFoRkE7QUFpRmpCLGtCQUFpQixVQWpGQTtBQWtGakIsaUJBQWdCLFNBbEZDO0FBbUZqQixnQkFBZSxRQW5GRTtBQW9GakIsa0JBQWlCLFVBcEZBO0FBcUZqQixnQkFBZSxRQXJGRTtBQXNGakIsZUFBYyxPQXRGRztBQXVGakIsd0JBQXVCLGdCQXZGTjtBQXdGakIsZ0JBQWUsUUF4RkU7QUF5RmpCLGVBQWMsT0F6Rkc7QUEwRmpCLG1CQUFrQixXQTFGRDtBQTJGakIsbUJBQWtCLFdBM0ZEO0FBNEZqQixvQkFBbUIsWUE1RkY7QUE2RmpCLGVBQWMsT0E3Rkc7QUE4RmpCLGlCQUFnQixTQTlGQztBQStGakIsa0JBQWlCLFVBL0ZBO0FBZ0dqQixnQkFBZSxRQWhHRTtBQWlHakIsaUJBQWdCLFNBakdDO0FBa0dqQixvQkFBbUIsWUFsR0Y7QUFtR2pCLG9CQUFtQixZQW5HRjtBQW9HakIsZUFBYyxPQXBHRztBQXFHakIsaUJBQWdCLFNBckdDO0FBc0dqQixtQkFBa0IsV0F0R0Q7QUF1R2pCLGlCQUFnQixTQXZHQztBQXdHakIsZ0JBQWUsUUF4R0U7QUF5R2pCLG9CQUFtQixZQXpHRjtBQTBHakIsa0JBQWlCLFVBMUdBO0FBMkdqQixpQkFBZ0IsU0EzR0M7QUE0R2pCLGlCQUFnQixTQTVHQztBQTZHakIsZ0JBQWUsUUE3R0U7QUE4R2pCLG1CQUFrQixXQTlHRDtBQStHakIsaUJBQWdCLFNBL0dDO0FBZ0hqQixpQkFBZ0IsU0FoSEM7QUFpSGpCLGlCQUFnQixTQWpIQztBQWtIakIsaUJBQWdCLFNBbEhDO0FBbUhqQixjQUFhLE1BbkhJO0FBb0hqQixpQkFBZ0IsU0FwSEM7QUFxSGpCLG1CQUFrQixXQXJIRDtBQXNIakIsb0JBQW1CLFlBdEhGO0FBdUhqQixlQUFjLE9BdkhHO0FBd0hqQixpQkFBZ0I7QUF4SEMsQ0FBWDs7O0FDYlA7O0FBRUE7Ozs7OztBQUVBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2xDLGdCQUFLLENBQUwsR0FBUyxNQUFUO0FBQ0EsQ0FGRCxNQUVPLElBQUksT0FBTyxLQUFQLEtBQWlCLFdBQXJCLEVBQWtDO0FBQ3hDLGdCQUFLLENBQUwsR0FBUyxLQUFUOztBQUVBO0FBQ0EsT0FBTSxFQUFOLENBQVMsVUFBVCxHQUFzQixVQUFVLGFBQVYsRUFBeUI7QUFDOUMsTUFBSSxRQUFRLEVBQUUsSUFBRixFQUFRLEtBQVIsRUFBWjtBQUNBLE1BQUksYUFBSixFQUFtQjtBQUNsQixZQUFTLFNBQVMsRUFBRSxJQUFGLEVBQVEsR0FBUixDQUFZLGNBQVosQ0FBVCxFQUFzQyxFQUF0QyxDQUFUO0FBQ0EsWUFBUyxTQUFTLEVBQUUsSUFBRixFQUFRLEdBQVIsQ0FBWSxhQUFaLENBQVQsRUFBcUMsRUFBckMsQ0FBVDtBQUNBO0FBQ0QsU0FBTyxLQUFQO0FBQ0EsRUFQRDtBQVNBLENBYk0sTUFhQSxJQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUN4QyxnQkFBSyxDQUFMLEdBQVMsS0FBVDtBQUNBOzs7QUNyQkQ7Ozs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQVVBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxlQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7O0FBRUEsZUFBSyxPQUFMLEdBQWUsRUFBZjs7QUFFQTtBQUNPLElBQUksMEJBQVM7QUFDbkI7QUFDQSxTQUFRLEVBRlc7QUFHbkI7QUFDQSxzQkFBcUIsS0FKRjtBQUtuQjtBQUNBLG9CQUFtQixHQU5BO0FBT25CO0FBQ0EscUJBQW9CLEdBUkQ7QUFTbkI7QUFDQSxhQUFZLENBQUMsQ0FWTTtBQVduQjtBQUNBLGNBQWEsQ0FBQyxDQVpLO0FBYW5CO0FBQ0Esb0JBQW1CLEdBZEE7QUFlbkI7QUFDQSxxQkFBb0IsRUFoQkQ7QUFpQm5CO0FBQ0EsOEJBQTZCLHFDQUFDLEtBQUQ7QUFBQSxTQUFXLE1BQU0sUUFBTixHQUFpQixJQUE1QjtBQUFBLEVBbEJWO0FBbUJuQjtBQUNBLDZCQUE0QixvQ0FBQyxLQUFEO0FBQUEsU0FBVyxNQUFNLFFBQU4sR0FBaUIsSUFBNUI7QUFBQSxFQXBCVDtBQXFCbkI7QUFDQSxnQkFBZSxJQXRCSTtBQXVCbkI7QUFDQSxhQUFZLENBQUMsQ0F4Qk07QUF5Qm5CO0FBQ0EsY0FBYSxDQUFDLENBMUJLO0FBMkJuQjtBQUNBLGNBQWEsR0E1Qk07QUE2Qm5CO0FBQ0EsT0FBTSxLQTlCYTtBQStCbkI7QUFDQSxhQUFZLElBaENPO0FBaUNuQjtBQUNBLGlCQUFnQixJQWxDRztBQW1DbkI7Ozs7Ozs7Ozs7Ozs7OztBQWVBLGFBQVksRUFsRE87QUFtRG5CO0FBQ0Esa0JBQWlCLEtBcERFO0FBcURuQjtBQUNBLHlCQUF3QixLQXRETDtBQXVEbkI7QUFDQSxrQkFBaUIsRUF4REU7QUF5RG5CO0FBQ0EscUJBQW9CLEtBMUREO0FBMkRuQjtBQUNBLDBCQUF5QixLQTVETjtBQTZEbkI7QUFDQSxtQkFBa0IsSUE5REM7QUErRG5CO0FBQ0EseUJBQXdCLElBaEVMO0FBaUVuQjtBQUNBLDRCQUEyQixJQWxFUjtBQW1FbkI7QUFDQSw0QkFBMkIsSUFwRVI7QUFxRW5CO0FBQ0Esd0JBQXVCLEtBdEVKO0FBdUVuQjtBQUNBLDBCQUF5QixLQXhFTjtBQXlFbkI7QUFDQSwyQkFBMEIsS0ExRVA7QUEyRW5CO0FBQ0EsV0FBVSxDQUFDLFdBQUQsRUFBYyxTQUFkLEVBQXlCLFVBQXpCLEVBQXFDLFVBQXJDLEVBQWlELFFBQWpELEVBQTJELFFBQTNELEVBQXFFLFlBQXJFLENBNUVTO0FBNkVuQjtBQUNBLFVBQVMsSUE5RVU7QUErRW5CO0FBQ0EsYUFBWSxNQWhGTztBQWlGbkI7QUFDQSxjQUFhLFFBbEZNO0FBbUZuQjtBQUNBLGlCQUFnQixJQXBGRztBQXFGbkI7QUFDQSxvQkFBbUIsSUF0RkE7QUF1Rm5CO0FBQ0EsYUFBWSxDQUNYO0FBQ0MsUUFBTSxDQUNMLEVBREssRUFDRDtBQUNKLEtBRkssQ0FFRDtBQUZDLEdBRFA7QUFLQyxVQUFRLGdCQUFDLE1BQUQsRUFBUyxLQUFULEVBQW1COztBQUUxQixPQUFJLHNCQUFKLEVBQWlCO0FBQ2hCLFFBQUksTUFBTSxNQUFOLElBQWdCLE1BQU0sS0FBMUIsRUFBaUM7QUFDaEMsV0FBTSxJQUFOO0FBQ0EsS0FGRCxNQUVPO0FBQ04sV0FBTSxLQUFOO0FBQ0E7QUFDRDtBQUNEO0FBZEYsRUFEVyxFQWlCWDtBQUNDLFFBQU0sQ0FBQyxFQUFELENBRFAsRUFDYTtBQUNaLFVBQVEsZ0JBQUMsTUFBRCxFQUFTLEtBQVQsRUFBbUI7O0FBRTFCLE9BQUksT0FBTyxTQUFQLENBQWlCLElBQWpCLE9BQTBCLE9BQU8sV0FBakMsMkJBQW9FLEVBQXBFLENBQXVFLFFBQXZFLEtBQ0gsT0FBTyxTQUFQLENBQWlCLElBQWpCLE9BQTBCLE9BQU8sV0FBakMsb0JBQTZELEVBQTdELENBQWdFLFFBQWhFLENBREQsRUFDNEU7QUFDM0UsV0FBTyxTQUFQLENBQWlCLElBQWpCLE9BQTBCLE9BQU8sV0FBakMsb0JBQTZELEdBQTdELENBQWlFLFNBQWpFLEVBQTRFLE9BQTVFO0FBQ0E7QUFDRCxPQUFJLE9BQU8sT0FBWCxFQUFvQjtBQUNuQixXQUFPLFlBQVA7QUFDQSxXQUFPLGtCQUFQO0FBQ0E7O0FBRUQsT0FBSSxZQUFZLEtBQUssR0FBTCxDQUFTLE1BQU0sTUFBTixHQUFlLEdBQXhCLEVBQTZCLENBQTdCLENBQWhCO0FBQ0EsU0FBTSxTQUFOLENBQWdCLFNBQWhCO0FBQ0EsT0FBSSxZQUFZLENBQWhCLEVBQW1CO0FBQ2xCLFVBQU0sUUFBTixDQUFlLEtBQWY7QUFDQTtBQUVEO0FBbkJGLEVBakJXLEVBc0NYO0FBQ0MsUUFBTSxDQUFDLEVBQUQsQ0FEUCxFQUNhO0FBQ1osVUFBUSxnQkFBQyxNQUFELEVBQVMsS0FBVCxFQUFtQjs7QUFFMUIsT0FBSSxPQUFPLFNBQVAsQ0FBaUIsSUFBakIsT0FBMEIsT0FBTyxXQUFqQywyQkFBb0UsRUFBcEUsQ0FBdUUsUUFBdkUsS0FDSCxPQUFPLFNBQVAsQ0FBaUIsSUFBakIsT0FBMEIsT0FBTyxXQUFqQyxvQkFBNkQsRUFBN0QsQ0FBZ0UsUUFBaEUsQ0FERCxFQUM0RTtBQUMzRSxXQUFPLFNBQVAsQ0FBaUIsSUFBakIsT0FBMEIsT0FBTyxXQUFqQyxvQkFBNkQsR0FBN0QsQ0FBaUUsU0FBakUsRUFBNEUsT0FBNUU7QUFDQTs7QUFFRCxPQUFJLE9BQU8sT0FBWCxFQUFvQjtBQUNuQixXQUFPLFlBQVA7QUFDQSxXQUFPLGtCQUFQO0FBQ0E7O0FBRUQsT0FBSSxZQUFZLEtBQUssR0FBTCxDQUFTLE1BQU0sTUFBTixHQUFlLEdBQXhCLEVBQTZCLENBQTdCLENBQWhCO0FBQ0EsU0FBTSxTQUFOLENBQWdCLFNBQWhCOztBQUVBLE9BQUksYUFBYSxHQUFqQixFQUFzQjtBQUNyQixVQUFNLFFBQU4sQ0FBZSxJQUFmO0FBQ0E7QUFFRDtBQXJCRixFQXRDVyxFQTZEWDtBQUNDLFFBQU0sQ0FDTCxFQURLLEVBQ0Q7QUFDSixLQUZLLENBRUQ7QUFGQyxHQURQO0FBS0MsVUFBUSxnQkFBQyxNQUFELEVBQVMsS0FBVCxFQUFtQjtBQUMxQixPQUFJLENBQUMsTUFBTSxNQUFNLFFBQVosQ0FBRCxJQUEwQixNQUFNLFFBQU4sR0FBaUIsQ0FBL0MsRUFBa0Q7QUFDakQsUUFBSSxPQUFPLE9BQVgsRUFBb0I7QUFDbkIsWUFBTyxZQUFQO0FBQ0EsWUFBTyxrQkFBUDtBQUNBOztBQUVEO0FBQ0EsUUFBSSxVQUFVLEtBQUssR0FBTCxDQUFTLE1BQU0sV0FBTixHQUFvQixPQUFPLE9BQVAsQ0FBZSwyQkFBZixDQUEyQyxLQUEzQyxDQUE3QixFQUFnRixDQUFoRixDQUFkO0FBQ0EsVUFBTSxjQUFOLENBQXFCLE9BQXJCO0FBQ0E7QUFDRDtBQWhCRixFQTdEVyxFQStFWDtBQUNDLFFBQU0sQ0FDTCxFQURLLEVBQ0Q7QUFDSixLQUZLLENBRUQ7QUFGQyxHQURQO0FBS0MsVUFBUSxnQkFBQyxNQUFELEVBQVMsS0FBVCxFQUFtQjs7QUFFMUIsT0FBSSxDQUFDLE1BQU0sTUFBTSxRQUFaLENBQUQsSUFBMEIsTUFBTSxRQUFOLEdBQWlCLENBQS9DLEVBQWtEO0FBQ2pELFFBQUksT0FBTyxPQUFYLEVBQW9CO0FBQ25CLFlBQU8sWUFBUDtBQUNBLFlBQU8sa0JBQVA7QUFDQTs7QUFFRDtBQUNBLFFBQUksVUFBVSxLQUFLLEdBQUwsQ0FBUyxNQUFNLFdBQU4sR0FBb0IsT0FBTyxPQUFQLENBQWUsMEJBQWYsQ0FBMEMsS0FBMUMsQ0FBN0IsRUFBK0UsTUFBTSxRQUFyRixDQUFkO0FBQ0EsVUFBTSxjQUFOLENBQXFCLE9BQXJCO0FBQ0E7QUFDRDtBQWpCRixFQS9FVyxFQWtHWDtBQUNDLFFBQU0sQ0FBQyxFQUFELENBRFAsRUFDYTtBQUNaLFVBQVEsZ0JBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsR0FBaEIsRUFBcUIsS0FBckIsRUFBK0I7QUFDdEMsT0FBSSxDQUFDLE1BQU0sT0FBWCxFQUFvQjtBQUNuQixRQUFJLE9BQU8sT0FBTyxlQUFkLEtBQWtDLFdBQXRDLEVBQW1EO0FBQ2xELFNBQUksT0FBTyxZQUFYLEVBQXlCO0FBQ3hCLGFBQU8sY0FBUDtBQUNBLE1BRkQsTUFFTztBQUNOLGFBQU8sZUFBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNEO0FBWkYsRUFsR1csRUFnSFg7QUFDQyxRQUFNLENBQUMsRUFBRCxDQURQLEVBQ2E7QUFDWixVQUFRLGdCQUFDLE1BQUQsRUFBWTs7QUFFbkIsVUFBTyxTQUFQLENBQWlCLElBQWpCLE9BQTBCLE9BQU8sV0FBakMsb0JBQTZELEdBQTdELENBQWlFLFNBQWpFLEVBQTRFLE9BQTVFO0FBQ0EsT0FBSSxPQUFPLE9BQVgsRUFBb0I7QUFDbkIsV0FBTyxZQUFQO0FBQ0EsV0FBTyxrQkFBUDtBQUNBO0FBQ0QsT0FBSSxPQUFPLEtBQVAsQ0FBYSxLQUFqQixFQUF3QjtBQUN2QixXQUFPLFFBQVAsQ0FBZ0IsS0FBaEI7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPLFFBQVAsQ0FBZ0IsSUFBaEI7QUFDQTtBQUNEO0FBZEYsRUFoSFc7QUF4Rk8sQ0FBYjs7QUEyTlAsZUFBSyxXQUFMLEdBQW1CLE1BQW5COztBQUVBOzs7Ozs7Ozs7SUFRTSxrQjtBQUVMLDZCQUFhLElBQWIsRUFBbUIsQ0FBbkIsRUFBc0I7QUFBQTs7QUFFckIsTUFBSSxJQUFJLElBQVI7O0FBRUEsSUFBRSxRQUFGLEdBQWEsS0FBYjs7QUFFQSxJQUFFLGtCQUFGLEdBQXVCLElBQXZCOztBQUVBLElBQUUsZUFBRixHQUFvQixJQUFwQjs7QUFFQSxJQUFFLGFBQUYsR0FBa0IsSUFBbEI7O0FBRUE7QUFDQSxNQUFJLEVBQUUsYUFBYSxrQkFBZixDQUFKLEVBQXdDO0FBQ3ZDLFVBQU8sSUFBSSxrQkFBSixDQUF1QixJQUF2QixFQUE2QixDQUE3QixDQUFQO0FBQ0E7O0FBRUQ7QUFDQSxJQUFFLE1BQUYsR0FBVyxFQUFFLEtBQUYsR0FBVSxFQUFFLElBQUYsQ0FBckI7QUFDQSxJQUFFLElBQUYsR0FBUyxFQUFFLEtBQUYsR0FBVSxFQUFFLE1BQUYsQ0FBUyxDQUFULENBQW5COztBQUVBLE1BQUksQ0FBQyxFQUFFLElBQVAsRUFBYTtBQUNaO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLEVBQUUsSUFBRixDQUFPLE1BQVAsS0FBa0IsU0FBdEIsRUFBaUM7QUFDaEMsVUFBTyxFQUFFLElBQUYsQ0FBTyxNQUFkO0FBQ0E7O0FBR0Q7QUFDQSxNQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNwQixPQUFJLEVBQUUsS0FBRixDQUFRLElBQVIsQ0FBYSxhQUFiLENBQUo7QUFDQTs7QUFFRDtBQUNBLElBQUUsT0FBRixHQUFZLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsTUFBbEIsRUFBMEIsQ0FBMUIsQ0FBWjs7QUFFQSxNQUFJLENBQUMsRUFBRSxPQUFGLENBQVUsVUFBZixFQUEyQjtBQUMxQjtBQUNBLEtBQUUsT0FBRixDQUFVLFVBQVYsR0FBdUIsT0FBdkI7QUFDQSxPQUFJLEVBQUUsT0FBRixDQUFVLGVBQWQsRUFBK0I7QUFDOUIsTUFBRSxPQUFGLENBQVUsVUFBVixHQUF1QixVQUF2QjtBQUNBO0FBQ0QsT0FBSSxFQUFFLE9BQUYsQ0FBVSxzQkFBZCxFQUFzQztBQUNyQyxNQUFFLE9BQUYsQ0FBVSxVQUFWLElBQXdCLEtBQXhCO0FBQ0E7QUFDRDs7QUFFRCxpQ0FBb0IsQ0FBcEIsRUFBdUIsRUFBRSxPQUF6QixFQUFrQyxFQUFFLE9BQUYsQ0FBVSxlQUFWLElBQTZCLEVBQS9EOztBQUVBO0FBQ0EsSUFBRSxFQUFGLFlBQWMsZUFBSyxRQUFMLEVBQWQ7O0FBRUE7QUFDQSxpQkFBSyxPQUFMLENBQWEsRUFBRSxFQUFmLElBQXFCLENBQXJCOztBQUVBO0FBQ0EsTUFFQyxZQUFZLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsRUFBRSxPQUFwQixFQUE2QjtBQUN4QyxZQUFTLGlCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQzVCLE1BQUUsUUFBRixDQUFXLEtBQVgsRUFBa0IsT0FBbEI7QUFDQSxJQUh1QztBQUl4QyxVQUFPLGVBQUMsQ0FBRCxFQUFPO0FBQ2IsTUFBRSxZQUFGLENBQWUsQ0FBZjtBQUNBO0FBTnVDLEdBQTdCLENBRmI7QUFBQSxNQVVDLFVBQVUsRUFBRSxLQUFGLENBQVEsT0FBUixDQUFnQixXQUFoQixFQVZYOztBQWFBO0FBQ0EsSUFBRSxTQUFGLEdBQWUsWUFBWSxPQUFaLElBQXVCLFlBQVksT0FBbEQ7QUFDQSxJQUFFLE9BQUYsR0FBYSxFQUFFLFNBQUgsR0FBZ0IsRUFBRSxPQUFGLENBQVUsT0FBMUIsR0FBcUMsWUFBWSxPQUFaLElBQXVCLEVBQUUsT0FBRixDQUFVLE9BQWxGOztBQUVBO0FBQ0EsTUFBSyxzQkFBVyxFQUFFLE9BQUYsQ0FBVSxxQkFBdEIsSUFBaUQsd0JBQWEsRUFBRSxPQUFGLENBQVUsdUJBQTVFLEVBQXNHOztBQUVyRztBQUNBLEtBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxVQUFkLEVBQTBCLFVBQTFCOztBQUVBO0FBQ0EsT0FBSSxzQkFBVyxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLFVBQXJCLENBQWYsRUFBaUQ7QUFDaEQsTUFBRSxJQUFGO0FBQ0E7QUFFRCxHQVZELE1BVU8sSUFBSSx5QkFBYyxFQUFFLE9BQUYsQ0FBVSx3QkFBNUIsRUFBc0Q7O0FBRTVEOztBQUVBLEdBSk0sTUFJQSxJQUFJLEVBQUUsT0FBRixJQUFjLENBQUMsRUFBRSxPQUFILElBQWMsRUFBRSxPQUFGLENBQVUsUUFBVixDQUFtQixNQUFuRCxFQUE0RDs7QUFFbEU7O0FBRUE7QUFDQSxLQUFFLE1BQUYsQ0FBUyxVQUFULENBQW9CLFVBQXBCO0FBQ0EsT0FBSSxtQkFBbUIsRUFBRSxPQUFGLEdBQVksZUFBSyxDQUFMLENBQU8sbUJBQVAsQ0FBWixHQUEwQyxlQUFLLENBQUwsQ0FBTyxtQkFBUCxDQUFqRTtBQUNBO0FBQ0EsdUJBQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLG1CQUFxRCxnQkFBckQsY0FBZ0YsWUFBaEYsQ0FBNkYsRUFBRSxNQUEvRjtBQUNBO0FBQ0EsS0FBRSxTQUFGLEdBQ0MsRUFBRSxjQUFZLEVBQUUsRUFBZCxpQkFBNEIsRUFBRSxPQUFGLENBQVUsV0FBdEMsa0JBQThELEVBQUUsT0FBRixDQUFVLFdBQXhFLHNGQUM4QyxnQkFEOUMsNkJBRWMsRUFBRSxPQUFGLENBQVUsV0FGeEIsa0NBR2MsRUFBRSxPQUFGLENBQVUsV0FIeEIsK0NBSWMsRUFBRSxPQUFGLENBQVUsV0FKeEIseUNBS2MsRUFBRSxPQUFGLENBQVUsV0FMeEIsMkNBTWMsRUFBRSxPQUFGLENBQVUsV0FOeEIseUNBQUYsRUFTQyxRQVRELENBU1UsRUFBRSxNQUFGLENBQVMsQ0FBVCxFQUFZLFNBVHRCLEVBVUMsWUFWRCxDQVVjLEVBQUUsTUFWaEIsRUFXQyxLQVhELENBV08sVUFBQyxDQUFELEVBQU87QUFDYixRQUFJLENBQUMsRUFBRSxrQkFBSCxJQUF5QixDQUFDLEVBQUUsUUFBNUIsSUFBd0MsRUFBRSxlQUE5QyxFQUErRDtBQUM5RCxPQUFFLFlBQUYsQ0FBZSxJQUFmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBSSxvQ0FBSixFQUErQjtBQUM5QjtBQUNBO0FBQ0EsVUFBSSxvQkFBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIsOEJBQUo7O0FBRUEsVUFBSSxzQkFBWSxFQUFFLGFBQWQsRUFBNkIsRUFBRSxTQUFGLENBQVksQ0FBWixDQUE3QixDQUFKLEVBQWtEO0FBQ2pELDJCQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixrQkFBb0QsRUFBRSxPQUFGLENBQVUsV0FBOUQ7QUFDQTs7QUFFRCxVQUFJLFNBQVMsRUFBRSxTQUFGLENBQVksSUFBWixDQUFpQixXQUFqQixDQUFiO0FBQ0EsYUFBTyxLQUFQO0FBQ0E7QUFDRDtBQUNELElBOUJELENBREQ7O0FBaUNBO0FBQ0EsT0FBSSxDQUFDLEVBQUUsT0FBRixDQUFVLFFBQVYsQ0FBbUIsTUFBeEIsRUFBZ0M7QUFDL0IsTUFBRSxTQUFGLENBQVksR0FBWixDQUFnQixZQUFoQixFQUE4QixhQUE5QixFQUNDLElBREQsT0FDVSxFQUFFLE9BQUYsQ0FBVSxXQURwQixlQUVDLElBRkQ7QUFHQTs7QUFFRCxPQUFJLEVBQUUsT0FBRixJQUFhLEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsTUFBdEMsSUFBZ0QsQ0FBQyxFQUFFLFNBQUYsQ0FBWSxNQUFaLE9BQXVCLEVBQUUsT0FBRixDQUFVLFdBQWpDLHFCQUE4RCxNQUFuSCxFQUEySDtBQUMxSDtBQUNBLE1BQUUsY0FBRixHQUFtQixFQUFFLE1BQUYsQ0FBUyxNQUFULEVBQW5CO0FBQ0EsTUFBRSxTQUFGLENBQVksSUFBWixrQkFBZ0MsRUFBRSxPQUFGLENBQVUsV0FBMUM7QUFDQTs7QUFFRDtBQUNBLEtBQUUsU0FBRixDQUFZLFFBQVosQ0FDQyxDQUFDLHdCQUFnQixFQUFFLE9BQUYsQ0FBVSxXQUExQixnQkFBa0QsRUFBbkQsS0FDQyxvQkFBWSxFQUFFLE9BQUYsQ0FBVSxXQUF0QixZQUEwQyxFQUQzQyxLQUVDLHFCQUFhLEVBQUUsT0FBRixDQUFVLFdBQXZCLGFBQTRDLEVBRjdDLEtBR0MsdUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZUFBZ0QsRUFIakQsS0FJQyxFQUFFLE9BQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxXQUF6QixjQUFrRCxFQUFFLE9BQUYsQ0FBVSxXQUE1RCxXQUpELENBREQ7O0FBU0E7QUFDQSxLQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLG1CQUEwRCxNQUExRCxDQUFpRSxFQUFFLE1BQW5FOztBQUVBO0FBQ0EsS0FBRSxJQUFGLENBQU8sTUFBUCxHQUFnQixDQUFoQjs7QUFFQTtBQUNBLEtBQUUsUUFBRixHQUFhLEVBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0IsY0FBYjtBQUNBLEtBQUUsTUFBRixHQUFXLEVBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0IsWUFBWDs7QUFFQTs7QUFFQTs7Ozs7OztBQU9BLE9BQ0MsVUFBVyxFQUFFLE9BQUYsR0FBWSxPQUFaLEdBQXNCLE9BRGxDO0FBQUEsT0FFQyxjQUFjLFFBQVEsU0FBUixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixXQUF4QixLQUF3QyxRQUFRLFNBQVIsQ0FBa0IsQ0FBbEIsQ0FGdkQ7O0FBTUEsT0FBSSxFQUFFLE9BQUYsQ0FBVSxVQUFVLE9BQXBCLElBQStCLENBQS9CLElBQW9DLEVBQUUsT0FBRixDQUFVLFVBQVUsT0FBcEIsRUFBNkIsUUFBN0IsR0FBd0MsT0FBeEMsQ0FBZ0QsR0FBaEQsSUFBdUQsQ0FBQyxDQUFoRyxFQUFtRztBQUNsRyxNQUFFLEtBQUYsR0FBVSxFQUFFLE9BQUYsQ0FBVSxVQUFVLE9BQXBCLENBQVY7QUFDQSxJQUZELE1BRU8sSUFBSSxFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsS0FBZCxLQUF3QixFQUF4QixJQUE4QixFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsS0FBZCxLQUF3QixJQUExRCxFQUFnRTtBQUN0RSxNQUFFLEtBQUYsR0FBVSxFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsS0FBeEI7QUFDQSxJQUZNLE1BRUEsSUFBSSxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLE9BQXJCLENBQUosRUFBbUM7QUFDekMsTUFBRSxLQUFGLEdBQVUsRUFBRSxNQUFGLENBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBVjtBQUNBLElBRk0sTUFFQTtBQUNOLE1BQUUsS0FBRixHQUFVLEVBQUUsT0FBRixDQUFVLFlBQVksV0FBWixHQUEwQixPQUFwQyxDQUFWO0FBQ0E7O0FBRUQsT0FBSSxFQUFFLE9BQUYsQ0FBVSxVQUFVLFFBQXBCLElBQWdDLENBQWhDLElBQXFDLEVBQUUsT0FBRixDQUFVLFVBQVUsUUFBcEIsRUFBOEIsUUFBOUIsR0FBeUMsT0FBekMsQ0FBaUQsR0FBakQsSUFBd0QsQ0FBQyxDQUFsRyxFQUFxRztBQUNwRyxNQUFFLE1BQUYsR0FBVyxFQUFFLE9BQUYsQ0FBVSxVQUFVLFFBQXBCLENBQVg7QUFDQSxJQUZELE1BRU8sSUFBSSxFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsTUFBZCxLQUF5QixFQUF6QixJQUErQixFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsTUFBZCxLQUF5QixJQUE1RCxFQUFrRTtBQUN4RSxNQUFFLE1BQUYsR0FBVyxFQUFFLEtBQUYsQ0FBUSxLQUFSLENBQWMsTUFBekI7QUFDQSxJQUZNLE1BRUEsSUFBSSxFQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVksWUFBWixDQUF5QixRQUF6QixDQUFKLEVBQXdDO0FBQzlDLE1BQUUsTUFBRixHQUFXLEVBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxRQUFkLENBQVg7QUFDQSxJQUZNLE1BRUE7QUFDTixNQUFFLE1BQUYsR0FBVyxFQUFFLE9BQUYsQ0FBVSxZQUFZLFdBQVosR0FBMEIsUUFBcEMsQ0FBWDtBQUNBOztBQUVELEtBQUUsa0JBQUYsR0FBd0IsRUFBRSxNQUFGLElBQVksRUFBRSxLQUFmLEdBQXdCLEVBQUUsS0FBRixHQUFVLEVBQUUsTUFBcEMsR0FBNkMsRUFBRSxNQUFGLEdBQVcsRUFBRSxLQUFqRjs7QUFFQTtBQUNBLEtBQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7O0FBRUE7QUFDQSxhQUFVLFdBQVYsR0FBd0IsRUFBRSxLQUExQjtBQUNBLGFBQVUsWUFBVixHQUF5QixFQUFFLE1BQTNCO0FBQ0E7QUFDRDtBQXhITyxPQXlIRixJQUFJLENBQUMsRUFBRSxPQUFILElBQWMsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxRQUFWLENBQW1CLE1BQXRDLEVBQThDO0FBQ2xELE1BQUUsTUFBRixDQUFTLElBQVQ7QUFDQTs7QUFFRDtBQUNBLDZCQUFpQixFQUFFLE1BQUYsQ0FBUyxDQUFULENBQWpCLEVBQThCLFNBQTlCOztBQUVBLE1BQUksRUFBRSxTQUFGLEtBQWdCLFNBQWhCLElBQTZCLEVBQUUsT0FBRixDQUFVLFFBQVYsQ0FBbUIsTUFBaEQsSUFBMEQsRUFBRSxrQkFBNUQsSUFBa0YsQ0FBQyxFQUFFLE9BQUYsQ0FBVSx1QkFBakcsRUFBMEg7QUFDekg7QUFDQSxLQUFFLFNBQUYsQ0FBWSxPQUFaLENBQW9CLGVBQXBCO0FBQ0E7O0FBRUQsU0FBTyxDQUFQO0FBQ0E7Ozs7K0JBRWEsVyxFQUFhO0FBQzFCLE9BQUksSUFBSSxJQUFSOztBQUVBLGlCQUFjLGdCQUFnQixTQUFoQixJQUE2QixXQUEzQzs7QUFFQSxPQUFJLEVBQUUsa0JBQU4sRUFBMEI7QUFDekI7QUFDQTs7QUFFRCxPQUFJLFdBQUosRUFBaUI7QUFDaEIsTUFBRSxRQUFGLENBQ0MsV0FERCxDQUNnQixFQUFFLE9BQUYsQ0FBVSxXQUQxQixnQkFFQyxJQUZELENBRU0sSUFGTixFQUVZLElBRlosRUFFa0IsTUFGbEIsQ0FFeUIsR0FGekIsRUFFOEIsWUFBTTtBQUNuQyxPQUFFLGtCQUFGLEdBQXVCLElBQXZCO0FBQ0EsT0FBRSxTQUFGLENBQVksT0FBWixDQUFvQixlQUFwQjtBQUNBLEtBTEQ7O0FBT0E7QUFDQSxNQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGNBQ0MsV0FERCxDQUNnQixFQUFFLE9BQUYsQ0FBVSxXQUQxQixnQkFFQyxJQUZELENBRU0sSUFGTixFQUVZLElBRlosRUFFa0IsTUFGbEIsQ0FFeUIsR0FGekIsRUFFOEIsWUFBTTtBQUNuQyxPQUFFLGtCQUFGLEdBQXVCLElBQXZCO0FBQ0EsS0FKRDtBQU1BLElBZkQsTUFlTztBQUNOLE1BQUUsUUFBRixDQUNDLFdBREQsQ0FDZ0IsRUFBRSxPQUFGLENBQVUsV0FEMUIsZ0JBRUMsR0FGRCxDQUVLLFNBRkwsRUFFZ0IsT0FGaEI7O0FBSUE7QUFDQSxNQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGNBQ0MsV0FERCxDQUNnQixFQUFFLE9BQUYsQ0FBVSxXQUQxQixnQkFFQyxHQUZELENBRUssU0FGTCxFQUVnQixPQUZoQjs7QUFJQSxNQUFFLGtCQUFGLEdBQXVCLElBQXZCO0FBQ0EsTUFBRSxTQUFGLENBQVksT0FBWixDQUFvQixlQUFwQjtBQUNBOztBQUVELEtBQUUsZUFBRjtBQUVBOzs7K0JBRWEsVyxFQUFhO0FBQzFCLE9BQUksSUFBSSxJQUFSOztBQUVBLGlCQUFjLGdCQUFnQixTQUFoQixJQUE2QixXQUEzQzs7QUFFQSxPQUFJLENBQUMsRUFBRSxrQkFBSCxJQUF5QixFQUFFLE9BQUYsQ0FBVSxrQkFBbkMsSUFBeUQsRUFBRSxjQUEzRCxJQUNGLEVBQUUsS0FBRixDQUFRLE1BQVIsSUFBa0IsRUFBRSxLQUFGLENBQVEsVUFBUixLQUF1QixDQUR2QyxJQUVGLEVBQUUsT0FBRixJQUFhLENBQUMsRUFBRSxPQUFGLENBQVUsdUJBQXhCLElBQW1ELENBQUMsRUFBRSxLQUFGLENBQVEsVUFGMUQsSUFHSCxFQUFFLEtBQUYsQ0FBUSxLQUhULEVBR2dCO0FBQ2Y7QUFDQTs7QUFFRCxPQUFJLFdBQUosRUFBaUI7QUFDaEI7QUFDQSxNQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLE9BQTVCLENBQW9DLEdBQXBDLEVBQXlDLFlBQVc7QUFDbkQsT0FBRSxJQUFGLEVBQVEsUUFBUixDQUFvQixFQUFFLE9BQUYsQ0FBVSxXQUE5QixnQkFBc0QsR0FBdEQsQ0FBMEQsU0FBMUQsRUFBcUUsT0FBckU7O0FBRUEsT0FBRSxrQkFBRixHQUF1QixLQUF2QjtBQUNBLE9BQUUsU0FBRixDQUFZLE9BQVosQ0FBb0IsZ0JBQXBCO0FBQ0EsS0FMRDs7QUFPQTtBQUNBLE1BQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0IsY0FBcUQsSUFBckQsQ0FBMEQsSUFBMUQsRUFBZ0UsSUFBaEUsRUFBc0UsT0FBdEUsQ0FBOEUsR0FBOUUsRUFBbUYsWUFBVztBQUM3RixPQUFFLElBQUYsRUFBUSxRQUFSLENBQW9CLEVBQUUsT0FBRixDQUFVLFdBQTlCLGdCQUFzRCxHQUF0RCxDQUEwRCxTQUExRCxFQUFxRSxPQUFyRTtBQUNBLEtBRkQ7QUFHQSxJQWJELE1BYU87O0FBRU47QUFDQSxNQUFFLFFBQUYsQ0FDRSxRQURGLENBQ2MsRUFBRSxPQUFGLENBQVUsV0FEeEIsZ0JBRUUsR0FGRixDQUVNLFNBRk4sRUFFaUIsT0FGakI7O0FBSUE7QUFDQSxNQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGNBQ0UsUUFERixDQUNjLEVBQUUsT0FBRixDQUFVLFdBRHhCLGdCQUVFLEdBRkYsQ0FFTSxTQUZOLEVBRWlCLE9BRmpCOztBQUlBLE1BQUUsa0JBQUYsR0FBdUIsS0FBdkI7QUFDQSxNQUFFLFNBQUYsQ0FBWSxPQUFaLENBQW9CLGdCQUFwQjtBQUNBO0FBQ0Q7OztxQ0FFbUIsTyxFQUFTOztBQUU1QixPQUFJLElBQUksSUFBUjs7QUFFQSxhQUFVLE9BQU8sT0FBUCxLQUFtQixXQUFuQixHQUFpQyxPQUFqQyxHQUEyQyxFQUFFLE9BQUYsQ0FBVSxzQkFBL0Q7O0FBRUEsS0FBRSxpQkFBRixDQUFvQixPQUFwQjs7QUFFQSxLQUFFLGFBQUYsR0FBa0IsV0FBVyxZQUFNO0FBQ2xDLE1BQUUsWUFBRjtBQUNBLE1BQUUsaUJBQUYsQ0FBb0IsTUFBcEI7QUFDQSxJQUhpQixFQUdmLE9BSGUsQ0FBbEI7QUFJQTs7O3NDQUVvQjs7QUFFcEIsT0FBSSxJQUFJLElBQVI7O0FBRUEsT0FBSSxFQUFFLGFBQUYsS0FBb0IsSUFBeEIsRUFBOEI7QUFDN0IsaUJBQWEsRUFBRSxhQUFmO0FBQ0EsV0FBTyxFQUFFLGFBQVQ7QUFDQSxNQUFFLGFBQUYsR0FBa0IsSUFBbEI7QUFDQTtBQUNEOzs7b0NBRWtCO0FBQ2xCLE9BQUksSUFBSSxJQUFSOztBQUVBLEtBQUUsaUJBQUY7QUFDQSxLQUFFLFlBQUYsQ0FBZSxLQUFmO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLEtBQXZCO0FBQ0E7OzttQ0FFaUI7QUFDakIsT0FBSSxJQUFJLElBQVI7O0FBRUEsS0FBRSxZQUFGLENBQWUsS0FBZjs7QUFFQSxLQUFFLGVBQUYsR0FBb0IsSUFBcEI7QUFDQTs7QUFFRDs7Ozs7Ozs7OzsyQkFPVSxLLEVBQU8sTyxFQUFTO0FBQUE7O0FBRXpCLE9BQ0MsSUFBSSxJQURMO0FBQUEsT0FFQyxlQUFlLFFBQVEsWUFBUixDQUFxQixVQUFyQixDQUZoQjtBQUFBLE9BR0MsV0FBVyxFQUFFLGlCQUFpQixTQUFqQixJQUE4QixpQkFBaUIsSUFBL0MsSUFBdUQsaUJBQWlCLE9BQTFFLENBSFo7QUFBQSxPQUlDLFdBQVcsTUFBTSxZQUFOLEtBQXVCLElBQXZCLElBQStCLE1BQU0sWUFBTixDQUFtQixLQUFuQixDQUF5QixnQkFBekIsTUFBK0MsSUFKMUY7O0FBT0E7QUFDQSxPQUFJLEVBQUUsT0FBTixFQUFlO0FBQ2Q7QUFDQTs7QUFFRCxLQUFFLE9BQUYsR0FBWSxJQUFaO0FBQ0EsS0FBRSxLQUFGLEdBQVUsS0FBVjtBQUNBLEtBQUUsT0FBRixHQUFZLE9BQVo7O0FBRUEsT0FBSSxFQUFFLHlCQUFjLEVBQUUsT0FBRixDQUFVLHdCQUExQixLQUF1RCxFQUFFLHNCQUFXLEVBQUUsT0FBRixDQUFVLHFCQUF2QixDQUF2RCxJQUF3RyxFQUFFLHdCQUFhLEVBQUUsT0FBRixDQUFVLHVCQUF6QixDQUE1RyxFQUErSjtBQUFBOztBQUU5SjtBQUNBO0FBQ0E7QUFDQSxTQUFJLENBQUMsRUFBRSxPQUFILElBQWMsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxRQUFWLENBQW1CLE1BQXRDLEVBQThDOztBQUU3QztBQUNBLFVBQUksWUFBWSxRQUFoQixFQUEwQjtBQUN6QixTQUFFLElBQUY7QUFDQTs7QUFHRCxVQUFJLEVBQUUsT0FBRixDQUFVLE9BQWQsRUFBdUI7O0FBRXRCLFdBQUksT0FBTyxFQUFFLE9BQUYsQ0FBVSxPQUFqQixLQUE2QixRQUFqQyxFQUEyQztBQUMxQyx5QkFBTyxFQUFFLE9BQUYsQ0FBVSxPQUFqQixFQUEwQixFQUFFLEtBQTVCLEVBQW1DLEVBQUUsT0FBckMsRUFBOEMsQ0FBOUM7QUFDQSxRQUZELE1BRU87QUFDTixVQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLEVBQUUsS0FBcEIsRUFBMkIsRUFBRSxPQUE3QixFQUFzQyxDQUF0QztBQUNBO0FBQ0Q7O0FBRUQ7QUFBQTtBQUFBO0FBQ0E7O0FBRUQ7QUFDQSxPQUFFLFdBQUYsQ0FBYyxDQUFkLEVBQWlCLEVBQUUsUUFBbkIsRUFBNkIsRUFBRSxNQUEvQixFQUF1QyxFQUFFLEtBQXpDO0FBQ0EsT0FBRSxhQUFGLENBQWdCLENBQWhCLEVBQW1CLEVBQUUsUUFBckIsRUFBK0IsRUFBRSxNQUFqQyxFQUF5QyxFQUFFLEtBQTNDO0FBQ0EsT0FBRSxhQUFGLENBQWdCLENBQWhCLEVBQW1CLEVBQUUsUUFBckIsRUFBK0IsRUFBRSxNQUFqQyxFQUF5QyxFQUFFLEtBQTNDOztBQUVBO0FBQ0EsT0FBRSxVQUFGOztBQUVBO0FBQ0EsVUFBSyxJQUFJLFlBQVQsSUFBeUIsRUFBRSxPQUFGLENBQVUsUUFBbkMsRUFBNkM7QUFDNUMsVUFBSSxVQUFVLEVBQUUsT0FBRixDQUFVLFFBQVYsQ0FBbUIsWUFBbkIsQ0FBZDtBQUNBLFVBQUksWUFBVSxPQUFWLENBQUosRUFBMEI7QUFDekIsV0FBSTtBQUNILG9CQUFVLE9BQVYsRUFBcUIsQ0FBckIsRUFBd0IsRUFBRSxRQUExQixFQUFvQyxFQUFFLE1BQXRDLEVBQThDLEVBQUUsS0FBaEQ7QUFDQSxRQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDWDtBQUNBLGdCQUFRLEtBQVIscUJBQWdDLE9BQWhDLEVBQTJDLENBQTNDO0FBQ0E7QUFDRDtBQUNEOztBQUVELE9BQUUsU0FBRixDQUFZLE9BQVosQ0FBb0IsZUFBcEI7O0FBRUE7QUFDQSxPQUFFLGFBQUYsQ0FBZ0IsRUFBRSxLQUFsQixFQUF5QixFQUFFLE1BQTNCO0FBQ0EsT0FBRSxlQUFGOztBQUVBO0FBQ0EsU0FBSSxFQUFFLE9BQU4sRUFBZTs7QUFFZCxVQUFJLHdCQUFhLENBQUMsRUFBRSxPQUFGLENBQVUsa0JBQTVCLEVBQWdEOztBQUUvQztBQUNBOztBQUVBLFNBQUUsTUFBRixDQUFTLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFlBQU07O0FBRS9CO0FBQ0EsWUFBSSxFQUFFLGtCQUFOLEVBQTBCO0FBQ3pCLFdBQUUsWUFBRixDQUFlLEtBQWY7QUFDQSxTQUZELE1BRU87QUFDTixhQUFJLEVBQUUsZUFBTixFQUF1QjtBQUN0QixZQUFFLFlBQUYsQ0FBZSxLQUFmO0FBQ0E7QUFDRDtBQUNELFFBVkQ7QUFZQSxPQWpCRCxNQWlCTzs7QUFFTjtBQUNBO0FBQ0EsU0FBRSx3QkFBRixHQUE2QixZQUFNOztBQUVsQyxZQUFJLEVBQUUsT0FBRixDQUFVLGdCQUFkLEVBQWdDO0FBQy9CLGFBQ0MsU0FBUyxFQUFFLE1BQUYsQ0FBUyxPQUFULE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGdCQUNSLElBRFEsT0FDQyxFQUFFLE9BQUYsQ0FBVSxXQURYLG9CQURWO0FBQUEsYUFHQyxVQUFVLE9BQU8sSUFBUCxDQUFZLGNBQVosQ0FIWDtBQUtBLGFBQUksRUFBRSxLQUFGLENBQVEsTUFBUixJQUFrQixPQUF0QixFQUErQjtBQUM5QixZQUFFLEtBQUY7QUFDQSxVQUZELE1BRU8sSUFBSSxFQUFFLEtBQUYsQ0FBUSxNQUFaLEVBQW9CO0FBQzFCLFlBQUUsSUFBRjtBQUNBLFVBRk0sTUFFQTtBQUNOLFlBQUUsS0FBRjtBQUNBOztBQUVELGdCQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCLENBQUMsT0FBN0I7QUFDQTtBQUNELFFBbEJEOztBQW9CQTtBQUNBLFNBQUUsS0FBRixDQUFRLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLEVBQUUsd0JBQXBDLEVBQThELEtBQTlEOztBQUVBO0FBQ0EsU0FBRSxTQUFGLENBQ0MsRUFERCxDQUNJLFlBREosRUFDa0IsWUFBTTtBQUN2QixZQUFJLEVBQUUsZUFBTixFQUF1QjtBQUN0QixhQUFJLENBQUMsRUFBRSxPQUFGLENBQVUsa0JBQWYsRUFBbUM7QUFDbEMsWUFBRSxpQkFBRixDQUFvQixPQUFwQjtBQUNBLFlBQUUsWUFBRjtBQUNBLFlBQUUsa0JBQUYsQ0FBcUIsRUFBRSxPQUFGLENBQVUseUJBQS9CO0FBQ0E7QUFDRDtBQUNELFFBVEQsRUFVQyxFQVZELENBVUksV0FWSixFQVVpQixZQUFNO0FBQ3RCLFlBQUksRUFBRSxlQUFOLEVBQXVCO0FBQ3RCLGFBQUksQ0FBQyxFQUFFLGtCQUFQLEVBQTJCO0FBQzFCLFlBQUUsWUFBRjtBQUNBO0FBQ0QsYUFBSSxDQUFDLEVBQUUsT0FBRixDQUFVLGtCQUFmLEVBQW1DO0FBQ2xDLFlBQUUsa0JBQUYsQ0FBcUIsRUFBRSxPQUFGLENBQVUseUJBQS9CO0FBQ0E7QUFDRDtBQUNELFFBbkJELEVBb0JDLEVBcEJELENBb0JJLFlBcEJKLEVBb0JrQixZQUFNO0FBQ3ZCLFlBQUksRUFBRSxlQUFOLEVBQXVCO0FBQ3RCLGFBQUksQ0FBQyxFQUFFLEtBQUYsQ0FBUSxNQUFULElBQW1CLENBQUMsRUFBRSxPQUFGLENBQVUsa0JBQWxDLEVBQXNEO0FBQ3JELFlBQUUsa0JBQUYsQ0FBcUIsRUFBRSxPQUFGLENBQVUseUJBQS9CO0FBQ0E7QUFDRDtBQUNELFFBMUJEO0FBMkJBOztBQUVELFVBQUksRUFBRSxPQUFGLENBQVUsdUJBQWQsRUFBdUM7QUFDdEMsU0FBRSxZQUFGLENBQWUsS0FBZjtBQUNBOztBQUVEO0FBQ0EsVUFBSSxZQUFZLENBQUMsRUFBRSxPQUFGLENBQVUsa0JBQTNCLEVBQStDO0FBQzlDLFNBQUUsWUFBRjtBQUNBOztBQUVEO0FBQ0EsVUFBSSxFQUFFLE9BQUYsQ0FBVSxjQUFkLEVBQThCO0FBQzdCLFNBQUUsS0FBRixDQUFRLGdCQUFSLENBQXlCLGdCQUF6QixFQUEyQyxVQUFDLENBQUQsRUFBTztBQUNqRDtBQUNBO0FBQ0EsWUFBSSxFQUFFLE9BQUYsQ0FBVSxXQUFWLElBQXlCLENBQXpCLElBQThCLENBQUMsRUFBRSxPQUFGLENBQVUsWUFBVixDQUF1QixRQUF2QixDQUEvQixJQUFtRSxDQUFDLE1BQU0sRUFBRSxNQUFGLENBQVMsV0FBZixDQUF4RSxFQUFxRztBQUNwRyxXQUFFLGFBQUYsQ0FBZ0IsRUFBRSxNQUFGLENBQVMsVUFBekIsRUFBcUMsRUFBRSxNQUFGLENBQVMsV0FBOUM7QUFDQSxXQUFFLGVBQUY7QUFDQSxXQUFFLEtBQUYsQ0FBUSxPQUFSLENBQWdCLEVBQUUsTUFBRixDQUFTLFVBQXpCLEVBQXFDLEVBQUUsTUFBRixDQUFTLFdBQTlDO0FBQ0E7QUFDRCxRQVJELEVBUUcsS0FSSDtBQVNBO0FBQ0Q7O0FBRUQ7O0FBRUE7QUFDQSxPQUFFLEtBQUYsQ0FBUSxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxZQUFNO0FBQ3RDLFFBQUUsUUFBRixHQUFhLElBQWI7O0FBRUE7QUFDQSxXQUFLLElBQUksV0FBVCxJQUF3QixlQUFLLE9BQTdCLEVBQXNDO0FBQ3JDLFdBQUksSUFBSSxlQUFLLE9BQUwsQ0FBYSxXQUFiLENBQVI7QUFDQSxXQUFJLEVBQUUsRUFBRixLQUFTLEVBQUUsRUFBWCxJQUFpQixFQUFFLE9BQUYsQ0FBVSxpQkFBM0IsSUFBZ0QsQ0FBQyxFQUFFLE1BQW5ELElBQTZELENBQUMsRUFBRSxLQUFwRSxFQUEyRTtBQUMxRSxVQUFFLEtBQUY7QUFDQSxVQUFFLFFBQUYsR0FBYSxLQUFiO0FBQ0E7QUFDRDtBQUVELE1BWkQsRUFZRyxLQVpIOztBQWNBO0FBQ0EsT0FBRSxLQUFGLENBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUN2QyxVQUFJLEVBQUUsT0FBRixDQUFVLFVBQWQsRUFBMEI7QUFDekIsV0FBSTtBQUNILFVBQUUsS0FBRixDQUFRLGNBQVIsQ0FBdUIsQ0FBdkI7QUFDQTtBQUNBLHlCQUFPLFVBQVAsQ0FBa0IsWUFBTTtBQUN2QixXQUFFLEVBQUUsU0FBSixFQUNDLElBREQsT0FDVSxFQUFFLE9BQUYsQ0FBVSxXQURwQixzQkFFQyxNQUZELEdBRVUsSUFGVjtBQUdBLFNBSkQsRUFJRyxFQUpIO0FBS0EsUUFSRCxDQVFFLE9BQU8sR0FBUCxFQUFZLENBRWI7QUFDRDs7QUFFRCxVQUFJLE9BQU8sRUFBRSxLQUFGLENBQVEsSUFBZixLQUF3QixVQUE1QixFQUF3QztBQUN2QyxTQUFFLEtBQUYsQ0FBUSxJQUFSO0FBQ0EsT0FGRCxNQUVPO0FBQ04sU0FBRSxLQUFGLENBQVEsS0FBUjtBQUNBOztBQUVELFVBQUksRUFBRSxlQUFOLEVBQXVCO0FBQ3RCLFNBQUUsZUFBRjtBQUNBO0FBQ0QsVUFBSSxFQUFFLGNBQU4sRUFBc0I7QUFDckIsU0FBRSxjQUFGO0FBQ0E7O0FBRUQsVUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFkLEVBQW9CO0FBQ25CLFNBQUUsSUFBRjtBQUNBLE9BRkQsTUFFTyxJQUFJLENBQUMsRUFBRSxPQUFGLENBQVUsa0JBQVgsSUFBaUMsRUFBRSxlQUF2QyxFQUF3RDtBQUM5RCxTQUFFLFlBQUY7QUFDQTtBQUNELE1BakNELEVBaUNHLEtBakNIOztBQW1DQTtBQUNBLE9BQUUsS0FBRixDQUFRLGdCQUFSLENBQXlCLGdCQUF6QixFQUEyQyxZQUFNOztBQUVoRCxxQ0FBb0IsRUFBRSxRQUF0QixFQUFnQyxFQUFFLE9BQWxDLEVBQTJDLEVBQUUsT0FBRixDQUFVLGVBQVYsSUFBNkIsRUFBeEU7O0FBRUEsVUFBSSxFQUFFLGNBQU4sRUFBc0I7QUFDckIsU0FBRSxjQUFGO0FBQ0E7QUFDRCxVQUFJLEVBQUUsYUFBTixFQUFxQjtBQUNwQixTQUFFLGFBQUY7QUFDQTs7QUFFRCxVQUFJLENBQUMsRUFBRSxZQUFQLEVBQXFCO0FBQ3BCLFNBQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQSxTQUFFLGVBQUY7QUFDQTtBQUNELE1BZkQsRUFlRyxLQWZIOztBQWlCQTtBQUNBLFNBQUksV0FBVyxJQUFmO0FBQ0EsT0FBRSxLQUFGLENBQVEsZ0JBQVIsQ0FBeUIsWUFBekIsRUFBdUMsWUFBTTtBQUM1QyxVQUFJLGFBQWEsTUFBSyxRQUF0QixFQUFnQztBQUMvQixrQkFBVyxNQUFLLFFBQWhCO0FBQ0Esc0NBQW9CLFFBQXBCLEVBQThCLEVBQUUsT0FBaEMsRUFBeUMsRUFBRSxPQUFGLENBQVUsZUFBVixJQUE2QixFQUF0RTs7QUFFQTtBQUNBLFdBQUksRUFBRSxjQUFOLEVBQXNCO0FBQ3JCLFVBQUUsY0FBRjtBQUNBO0FBQ0QsV0FBSSxFQUFFLGFBQU4sRUFBcUI7QUFDcEIsVUFBRSxhQUFGO0FBQ0E7QUFDRCxTQUFFLGVBQUY7QUFFQTtBQUNELE1BZkQsRUFlRyxLQWZIOztBQWlCQSxPQUFFLFNBQUYsQ0FBWSxRQUFaLENBQXFCLFVBQUMsQ0FBRCxFQUFPO0FBQzNCLFVBQUksRUFBRSxhQUFOLEVBQXFCO0FBQUU7QUFDdEIsV0FBSSxVQUFVLEVBQUUsRUFBRSxhQUFKLENBQWQ7QUFDQSxXQUFJLEVBQUUsY0FBRixJQUFvQixRQUFRLE9BQVIsT0FBb0IsRUFBRSxPQUFGLENBQVUsV0FBOUIsZ0JBQXNELE1BQXRELEtBQWlFLENBQXpGLEVBQTRGO0FBQzNGLFVBQUUsY0FBRixHQUFtQixLQUFuQjtBQUNBLFlBQUksRUFBRSxPQUFGLElBQWEsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxrQkFBNUIsRUFBZ0Q7QUFDL0MsV0FBRSxZQUFGLENBQWUsSUFBZjtBQUNBO0FBRUQ7QUFDRDtBQUNELE1BWEQ7O0FBYUE7QUFDQSxnQkFBVyxZQUFNO0FBQ2hCLFFBQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQSxRQUFFLGVBQUY7QUFDQSxNQUhELEVBR0csRUFISDs7QUFLQTtBQUNBLE9BQUUsVUFBRixDQUFhLFFBQWIsRUFBdUIsWUFBTTs7QUFFNUI7QUFDQSxVQUFJLEVBQUUsRUFBRSxZQUFGLElBQW1CLHlDQUE4QixtQkFBUyxrQkFBNUQsQ0FBSixFQUFzRjtBQUNyRixTQUFFLGFBQUYsQ0FBZ0IsRUFBRSxLQUFsQixFQUF5QixFQUFFLE1BQTNCO0FBQ0E7O0FBRUQ7QUFDQSxRQUFFLGVBQUY7QUFDQSxNQVREOztBQVdBO0FBQ0EsT0FBRSxVQUFGLENBQWEsT0FBYixFQUFzQixVQUFDLENBQUQsRUFBTztBQUM1QixVQUFJLEVBQUUsRUFBRSxNQUFKLEVBQVksRUFBWixPQUFtQixFQUFFLE9BQUYsQ0FBVSxXQUE3QixlQUFKLEVBQTBEO0FBQ3pELFNBQUUsRUFBRSxNQUFKLEVBQVksUUFBWixDQUF3QixFQUFFLE9BQUYsQ0FBVSxXQUFsQztBQUNBLE9BRkQsTUFFTyxJQUFJLEVBQUUsRUFBRSxNQUFKLEVBQVksT0FBWixPQUF3QixFQUFFLE9BQUYsQ0FBVSxXQUFsQyxnQkFBMEQsTUFBOUQsRUFBc0U7QUFDNUUsU0FBRSxFQUFFLE1BQUosRUFBWSxPQUFaLE9BQXdCLEVBQUUsT0FBRixDQUFVLFdBQWxDLGdCQUNDLFFBREQsQ0FDYSxFQUFFLE9BQUYsQ0FBVSxXQUR2QjtBQUVBO0FBQ0QsTUFQRDs7QUFTQTtBQUNBLE9BQUUsVUFBRixDQUFhLFNBQWIsRUFBd0IsVUFBQyxDQUFELEVBQU87QUFDOUIsVUFBSSxFQUFFLEVBQUUsTUFBSixFQUFZLEVBQVosT0FBbUIsRUFBRSxPQUFGLENBQVUsV0FBN0IsZUFBSixFQUEwRDtBQUN6RCxTQUFFLEVBQUUsTUFBSixFQUFZLFdBQVosQ0FBMkIsRUFBRSxPQUFGLENBQVUsV0FBckM7QUFDQSxPQUZELE1BRU8sSUFBSSxFQUFFLEVBQUUsTUFBSixFQUFZLE9BQVosT0FBd0IsRUFBRSxPQUFGLENBQVUsV0FBbEMsZ0JBQTBELE1BQTlELEVBQXNFO0FBQzVFLFNBQUUsRUFBRSxNQUFKLEVBQVksT0FBWixPQUF3QixFQUFFLE9BQUYsQ0FBVSxXQUFsQyxnQkFDQyxXQURELENBQ2dCLEVBQUUsT0FBRixDQUFVLFdBRDFCO0FBRUE7QUFDRCxNQVBEOztBQVNBO0FBQ0E7QUFDQTtBQUNBLFNBQUksRUFBRSxLQUFGLENBQVEsWUFBUixLQUF5QixJQUF6QixJQUFpQyxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLEtBQXJCLENBQTJCLFNBQTNCLENBQWpDLEtBQTJFLDBDQUEzRSxDQUFKLEVBQXNHO0FBQ3JHLFFBQUUsU0FBRixDQUFZLElBQVosT0FBcUIsRUFBRSxPQUFGLENBQVUsV0FBL0IsbUJBQTBELElBQTFEO0FBQ0EsUUFBRSxTQUFGLENBQVksSUFBWixPQUFxQixFQUFFLE9BQUYsQ0FBVSxXQUEvQixhQUFvRCxJQUFwRDtBQUNBO0FBM1M2Sjs7QUFBQTtBQTRTOUo7O0FBRUQ7QUFDQSxPQUFJLFlBQVksUUFBaEIsRUFBMEI7QUFDekIsTUFBRSxJQUFGO0FBQ0E7O0FBRUQsT0FBSSxFQUFFLE9BQUYsQ0FBVSxPQUFkLEVBQXVCOztBQUV0QixRQUFJLE9BQU8sRUFBRSxPQUFGLENBQVUsT0FBakIsS0FBNkIsUUFBakMsRUFBMkM7QUFDMUMsc0JBQU8sRUFBRSxPQUFGLENBQVUsT0FBakIsRUFBMEIsRUFBRSxLQUE1QixFQUFtQyxFQUFFLE9BQXJDLEVBQThDLENBQTlDO0FBQ0EsS0FGRCxNQUVPO0FBQ04sT0FBRSxPQUFGLENBQVUsT0FBVixDQUFrQixFQUFFLEtBQXBCLEVBQTJCLEVBQUUsT0FBN0IsRUFBc0MsQ0FBdEM7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OytCQUtjLEMsRUFBRztBQUNoQixPQUFJLElBQUksSUFBUjs7QUFFQSxPQUFJLEVBQUUsUUFBTixFQUFnQjtBQUNmLE1BQUUsZUFBRjtBQUNBOztBQUVEO0FBQ0EsT0FBSSxFQUFFLE9BQUYsQ0FBVSxLQUFkLEVBQXFCO0FBQ3BCLE1BQUUsT0FBRixDQUFVLEtBQVYsQ0FBZ0IsQ0FBaEI7QUFDQTtBQUNEOzs7Z0NBRWMsSyxFQUFPLE0sRUFBUTtBQUM3QixPQUFJLElBQUksSUFBUjs7QUFFQSxPQUFJLENBQUMsRUFBRSxPQUFGLENBQVUsYUFBZixFQUE4QjtBQUM3QixXQUFPLEtBQVA7QUFDQTs7QUFFRCxPQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUNqQyxNQUFFLEtBQUYsR0FBVSxLQUFWO0FBQ0E7O0FBRUQsT0FBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDbEMsTUFBRSxNQUFGLEdBQVcsTUFBWDtBQUNBOztBQUVELE9BQUksT0FBTyxFQUFQLEtBQWMsV0FBZCxJQUE2QixFQUFFLE9BQW5DLEVBQTRDO0FBQzNDLE9BQUcsS0FBSCxDQUFTLFNBQVQsQ0FBbUIsYUFBbkIsRUFBa0MsWUFBTTtBQUN2QyxTQUFJLFNBQVMsRUFBRSxFQUFFLEtBQUosRUFBVyxRQUFYLENBQW9CLFdBQXBCLENBQWI7O0FBRUEsT0FBRSxLQUFGLEdBQVUsT0FBTyxLQUFQLEVBQVY7QUFDQSxPQUFFLE1BQUYsR0FBVyxPQUFPLE1BQVAsRUFBWDtBQUNBLE9BQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQSxZQUFPLEtBQVA7QUFDQSxLQVBEOztBQVNBLFFBQUksU0FBUyxFQUFFLEVBQUUsS0FBSixFQUFXLFFBQVgsQ0FBb0IsV0FBcEIsQ0FBYjs7QUFFQSxRQUFJLE9BQU8sTUFBWCxFQUFtQjtBQUNsQixPQUFFLEtBQUYsR0FBVSxPQUFPLEtBQVAsRUFBVjtBQUNBLE9BQUUsTUFBRixHQUFXLE9BQU8sTUFBUCxFQUFYO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFdBQVEsRUFBRSxPQUFGLENBQVUsVUFBbEI7QUFDQyxTQUFLLE1BQUw7QUFDQztBQUNBLFNBQUksRUFBRSxPQUFOLEVBQWU7QUFDZCxRQUFFLFdBQUY7QUFDQSxNQUZELE1BRU87QUFDTixRQUFFLGFBQUYsQ0FBZ0IsRUFBRSxLQUFsQixFQUF5QixFQUFFLE1BQTNCO0FBQ0E7QUFDRDtBQUNELFNBQUssWUFBTDtBQUNDLE9BQUUsaUJBQUY7QUFDQTtBQUNELFNBQUssTUFBTDtBQUNDLE9BQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQTtBQUNEO0FBQ0E7QUFDQyxTQUFJLEVBQUUsWUFBRixPQUFxQixJQUF6QixFQUErQjtBQUM5QixRQUFFLGlCQUFGO0FBQ0EsTUFGRCxNQUVPO0FBQ04sUUFBRSxhQUFGLENBQWdCLEVBQUUsS0FBbEIsRUFBeUIsRUFBRSxNQUEzQjtBQUNBO0FBQ0Q7QUF0QkY7QUF3QkE7OztpQ0FFZTtBQUNmLE9BQUksSUFBSSxJQUFSOztBQUVBO0FBQ0EsVUFBUSxFQUFFLE1BQUYsQ0FBUyxRQUFULEdBQW9CLFFBQXBCLENBQTZCLEdBQTdCLEtBQXNDLEVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxXQUFaLE1BQTZCLE1BQTdCLElBQXVDLEVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxXQUFaLE1BQTZCLEVBQUUsS0FBNUcsSUFBdUgsRUFBRSxLQUFGLENBQVEsQ0FBUixFQUFXLFlBQVgsSUFBMkIsRUFBRSxLQUFGLENBQVEsQ0FBUixFQUFXLFlBQVgsQ0FBd0IsUUFBeEIsS0FBcUMsTUFBL0w7QUFDQTs7O3NDQUVvQjtBQUNwQixPQUFJLElBQUksSUFBUjs7QUFFQTtBQUNBLE9BQUksY0FBZSxZQUFNO0FBQ3hCLFFBQUksRUFBRSxPQUFOLEVBQWU7QUFDZCxTQUFJLEVBQUUsS0FBRixDQUFRLFVBQVIsSUFBc0IsRUFBRSxLQUFGLENBQVEsVUFBUixHQUFxQixDQUEvQyxFQUFrRDtBQUNqRCxhQUFPLEVBQUUsS0FBRixDQUFRLFVBQWY7QUFDQSxNQUZELE1BRU8sSUFBSSxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLE9BQXJCLENBQUosRUFBbUM7QUFDekMsYUFBTyxFQUFFLEtBQUYsQ0FBUSxZQUFSLENBQXFCLE9BQXJCLENBQVA7QUFDQSxNQUZNLE1BRUE7QUFDTixhQUFPLEVBQUUsT0FBRixDQUFVLGlCQUFqQjtBQUNBO0FBQ0QsS0FSRCxNQVFPO0FBQ04sWUFBTyxFQUFFLE9BQUYsQ0FBVSxpQkFBakI7QUFDQTtBQUNELElBWmlCLEVBQWxCOztBQWNBLE9BQUksZUFBZ0IsWUFBTTtBQUN6QixRQUFJLEVBQUUsT0FBTixFQUFlO0FBQ2QsU0FBSSxFQUFFLEtBQUYsQ0FBUSxXQUFSLElBQXVCLEVBQUUsS0FBRixDQUFRLFdBQVIsR0FBc0IsQ0FBakQsRUFBb0Q7QUFDbkQsYUFBTyxFQUFFLEtBQUYsQ0FBUSxXQUFmO0FBQ0EsTUFGRCxNQUVPLElBQUksRUFBRSxLQUFGLENBQVEsWUFBUixDQUFxQixRQUFyQixDQUFKLEVBQW9DO0FBQzFDLGFBQU8sRUFBRSxLQUFGLENBQVEsWUFBUixDQUFxQixRQUFyQixDQUFQO0FBQ0EsTUFGTSxNQUVBO0FBQ04sYUFBTyxFQUFFLE9BQUYsQ0FBVSxrQkFBakI7QUFDQTtBQUNELEtBUkQsTUFRTztBQUNOLFlBQU8sRUFBRSxPQUFGLENBQVUsa0JBQWpCO0FBQ0E7QUFDRCxJQVprQixFQUFuQjs7QUFjQTtBQUNBLE9BQ0MsY0FBZSxZQUFNO0FBQ3BCLFFBQUksUUFBUSxDQUFaO0FBQ0EsUUFBSSxDQUFDLEVBQUUsT0FBUCxFQUFnQjtBQUNmLFlBQU8sS0FBUDtBQUNBOztBQUVELFFBQUksRUFBRSxLQUFGLENBQVEsVUFBUixJQUFzQixFQUFFLEtBQUYsQ0FBUSxVQUFSLEdBQXFCLENBQTNDLElBQWdELEVBQUUsS0FBRixDQUFRLFdBQXhELElBQXVFLEVBQUUsS0FBRixDQUFRLFdBQVIsR0FBc0IsQ0FBakcsRUFBb0c7QUFDbkcsYUFBUyxFQUFFLE1BQUYsSUFBWSxFQUFFLEtBQWYsR0FBd0IsRUFBRSxLQUFGLENBQVEsVUFBUixHQUFxQixFQUFFLEtBQUYsQ0FBUSxXQUFyRCxHQUFtRSxFQUFFLEtBQUYsQ0FBUSxXQUFSLEdBQXNCLEVBQUUsS0FBRixDQUFRLFVBQXpHO0FBQ0EsS0FGRCxNQUVPO0FBQ04sYUFBUSxFQUFFLGtCQUFWO0FBQ0E7O0FBRUQsUUFBSSxNQUFNLEtBQU4sS0FBZ0IsUUFBUSxJQUF4QixJQUFnQyxRQUFRLEdBQTVDLEVBQWlEO0FBQ2hELGFBQVEsQ0FBUjtBQUNBOztBQUVELFdBQU8sS0FBUDtBQUNBLElBakJhLEVBRGY7QUFBQSxPQW1CQyxjQUFjLEVBQUUsU0FBRixDQUFZLE1BQVosR0FBcUIsT0FBckIsQ0FBNkIsVUFBN0IsRUFBeUMsS0FBekMsRUFuQmY7QUFBQSxPQW9CQyxlQUFlLEVBQUUsU0FBRixDQUFZLE1BQVosR0FBcUIsT0FBckIsQ0FBNkIsVUFBN0IsRUFBeUMsTUFBekMsRUFwQmhCO0FBQUEsT0FxQkMsa0JBckJEOztBQXVCQSxPQUFJLEVBQUUsT0FBTixFQUFlO0FBQ2Q7QUFDQSxRQUFJLEVBQUUsTUFBRixLQUFhLE1BQWpCLEVBQXlCO0FBQ3hCLGlCQUFZLFNBQVMsY0FBYyxZQUFkLEdBQTZCLFdBQXRDLEVBQW1ELEVBQW5ELENBQVo7QUFDQSxLQUZELE1BRU87QUFDTixpQkFBWSxFQUFFLE1BQUYsSUFBWSxFQUFFLEtBQWQsR0FBc0IsU0FBUyxjQUFjLFdBQXZCLEVBQW9DLEVBQXBDLENBQXRCLEdBQWdFLFNBQVMsY0FBYyxXQUF2QixFQUFvQyxFQUFwQyxDQUE1RTtBQUNBO0FBQ0QsSUFQRCxNQU9PO0FBQ04sZ0JBQVksWUFBWjtBQUNBOztBQUVEO0FBQ0EsT0FBSSxNQUFNLFNBQU4sQ0FBSixFQUFzQjtBQUNyQixnQkFBWSxZQUFaO0FBQ0E7O0FBRUQsT0FBSSxFQUFFLFNBQUYsQ0FBWSxNQUFaLEdBQXFCLE1BQXJCLEdBQThCLENBQTlCLElBQW1DLEVBQUUsU0FBRixDQUFZLE1BQVosR0FBcUIsQ0FBckIsRUFBd0IsT0FBeEIsQ0FBZ0MsV0FBaEMsT0FBa0QsTUFBekYsRUFBaUc7QUFBRTtBQUNsRyxrQkFBYyxvQkFBVSxLQUFWLEVBQWQ7QUFDQSxnQkFBWSxvQkFBVSxNQUFWLEVBQVo7QUFDQTs7QUFFRCxPQUFJLGFBQWEsV0FBakIsRUFBOEI7O0FBRTdCO0FBQ0EsTUFBRSxTQUFGLENBQ0MsS0FERCxDQUNPLFdBRFAsRUFFQyxNQUZELENBRVEsU0FGUjs7QUFJQTtBQUNBLE1BQUUsTUFBRixDQUNDLEtBREQsQ0FDTyxNQURQLEVBRUMsTUFGRCxDQUVRLE1BRlI7O0FBSUE7QUFDQSxRQUFJLEVBQUUsT0FBTixFQUFlO0FBQ2QsU0FBSSxFQUFFLEtBQUYsQ0FBUSxPQUFaLEVBQXFCO0FBQ3BCLFFBQUUsS0FBRixDQUFRLE9BQVIsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0I7QUFDQTtBQUNEOztBQUVEO0FBQ0EsTUFBRSxNQUFGLENBQVMsUUFBVCxPQUFzQixFQUFFLE9BQUYsQ0FBVSxXQUFoQyxZQUNDLEtBREQsQ0FDTyxNQURQLEVBRUMsTUFGRCxDQUVRLE1BRlI7QUFHQTtBQUNEOzs7Z0NBRWM7QUFDZCxPQUFJLElBQUksSUFBUjtBQUFBLE9BQ0MsU0FBUyxFQUFFLGNBRFo7O0FBR0E7QUFDQSxPQUFJLEVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxRQUFaLE1BQTBCLE1BQTFCLElBQW9DLEVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxRQUFaLE1BQTBCLEVBQUUsTUFBcEUsRUFBNEU7QUFDM0UsTUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsRUFBdEI7QUFDQTtBQUNELE9BQUksRUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLFdBQVosTUFBNkIsTUFBN0IsSUFBdUMsRUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLFdBQVosTUFBNkIsRUFBRSxLQUExRSxFQUFpRjtBQUNoRixNQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksV0FBWixFQUF5QixFQUF6QjtBQUNBOztBQUVELE9BQUksRUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLFlBQVosTUFBOEIsTUFBOUIsSUFBd0MsRUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLFlBQVosTUFBOEIsRUFBRSxNQUE1RSxFQUFvRjtBQUNuRixNQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksWUFBWixFQUEwQixFQUExQjtBQUNBOztBQUVELE9BQUksRUFBRSxLQUFGLENBQVEsQ0FBUixFQUFXLFlBQWYsRUFBNkI7QUFDNUIsUUFBSSxFQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixNQUF4QixLQUFtQyxNQUF2QyxFQUErQztBQUM5QyxPQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixNQUF4QixHQUFpQyxFQUFqQztBQUNBO0FBQ0QsUUFBSSxFQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixRQUF4QixLQUFxQyxNQUF6QyxFQUFpRDtBQUNoRCxPQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixRQUF4QixHQUFtQyxFQUFuQztBQUNBO0FBQ0QsUUFBSSxFQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixTQUF4QixLQUFzQyxNQUExQyxFQUFrRDtBQUNqRCxPQUFFLEtBQUYsQ0FBUSxDQUFSLEVBQVcsWUFBWCxDQUF3QixTQUF4QixHQUFvQyxFQUFwQztBQUNBO0FBQ0Q7O0FBRUQsT0FBSSxDQUFDLE9BQU8sS0FBUCxFQUFMLEVBQXFCO0FBQ3BCLFdBQU8sTUFBUCxDQUFjLEVBQUUsTUFBRixDQUFTLEtBQVQsRUFBZDtBQUNBOztBQUVELE9BQUksQ0FBQyxPQUFPLE1BQVAsRUFBTCxFQUFzQjtBQUNyQixXQUFPLE1BQVAsQ0FBYyxFQUFFLE1BQUYsQ0FBUyxNQUFULEVBQWQ7QUFDQTs7QUFFRCxPQUFJLGNBQWMsT0FBTyxLQUFQLEVBQWxCO0FBQUEsT0FDQyxlQUFlLE9BQU8sTUFBUCxFQURoQjs7QUFHQSxLQUFFLGFBQUYsQ0FBZ0IsTUFBaEIsRUFBd0IsTUFBeEI7O0FBRUE7QUFDQSxLQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGlCQUF3RCxHQUF4RCxDQUE0RCxTQUE1RCxFQUF1RSxPQUF2RTs7QUFFQTtBQUNBLE9BQ0MsZ0JBQWdCLEVBQUUsU0FBRixDQUFZLElBQVosQ0FBaUIsOEJBQWpCLENBRGpCO0FBQUEsT0FFQyxhQUFhLEVBQUUsTUFGaEI7QUFBQSxPQUdDLFlBQVksRUFBRSxLQUhmOztBQUlDO0FBQ0EsYUFBVSxXQUxYO0FBQUEsT0FNQyxVQUFXLGFBQWEsV0FBZCxHQUE2QixTQU54Qzs7QUFPQztBQUNBLGFBQVcsWUFBWSxZQUFiLEdBQTZCLFVBUnhDO0FBQUEsT0FTQyxVQUFVLFlBVFg7O0FBVUM7QUFDQSxtQkFBZ0IsVUFBVSxXQUFWLEtBQTBCLEtBWDNDO0FBQUEsT0FZQyxhQUFhLGdCQUFnQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQWhCLEdBQXNDLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FacEQ7QUFBQSxPQWFDLGNBQWMsZ0JBQWdCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBaEIsR0FBc0MsS0FBSyxLQUFMLENBQVcsT0FBWCxDQWJyRDs7QUFlQSxPQUFJLGFBQUosRUFBbUI7QUFDbEIsa0JBQWMsTUFBZCxDQUFxQixXQUFyQixFQUFrQyxLQUFsQyxDQUF3QyxXQUF4QztBQUNBLFFBQUksRUFBRSxLQUFGLENBQVEsT0FBWixFQUFxQjtBQUNwQixPQUFFLEtBQUYsQ0FBUSxPQUFSLENBQWdCLFdBQWhCLEVBQTZCLFdBQTdCO0FBQ0E7QUFDRCxJQUxELE1BS087QUFDTixrQkFBYyxNQUFkLENBQXFCLFlBQXJCLEVBQW1DLEtBQW5DLENBQXlDLFVBQXpDO0FBQ0EsUUFBSSxFQUFFLEtBQUYsQ0FBUSxPQUFaLEVBQXFCO0FBQ3BCLE9BQUUsS0FBRixDQUFRLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsWUFBNUI7QUFDQTtBQUNEOztBQUVELGlCQUFjLEdBQWQsQ0FBa0I7QUFDakIsbUJBQWUsS0FBSyxLQUFMLENBQVcsQ0FBQyxjQUFjLFVBQWYsSUFBNkIsQ0FBeEMsQ0FERTtBQUVqQixrQkFBYztBQUZHLElBQWxCO0FBSUE7OztnQ0FFYyxLLEVBQU8sTSxFQUFRO0FBQzdCLE9BQUksSUFBSSxJQUFSOztBQUVBLEtBQUUsU0FBRixDQUNDLEtBREQsQ0FDTyxLQURQLEVBRUMsTUFGRCxDQUVRLE1BRlI7O0FBSUEsS0FBRSxNQUFGLENBQVMsUUFBVCxPQUFzQixFQUFFLE9BQUYsQ0FBVSxXQUFoQyxZQUNDLEtBREQsQ0FDTyxLQURQLEVBRUMsTUFGRCxDQUVRLE1BRlI7QUFHQTs7O29DQUVrQjtBQUNsQixPQUFJLElBQUksSUFBUjs7QUFFQTtBQUNBLE9BQUksQ0FBQyxFQUFFLFNBQUYsQ0FBWSxFQUFaLENBQWUsVUFBZixDQUFELElBQStCLENBQUMsRUFBRSxJQUFsQyxJQUEwQyxDQUFDLEVBQUUsSUFBRixDQUFPLE1BQWxELElBQTRELENBQUMsRUFBRSxJQUFGLENBQU8sRUFBUCxDQUFVLFVBQVYsQ0FBakUsRUFBd0Y7QUFDdkY7QUFDQTs7QUFFRCxPQUNDLGFBQWEsV0FBVyxFQUFFLElBQUYsQ0FBTyxHQUFQLENBQVcsYUFBWCxDQUFYLElBQXdDLFdBQVcsRUFBRSxJQUFGLENBQU8sR0FBUCxDQUFXLGNBQVgsQ0FBWCxDQUR0RDtBQUFBLE9BRUMsY0FBYyxXQUFXLEVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxhQUFaLENBQVgsSUFBeUMsV0FBVyxFQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksY0FBWixDQUFYLENBQXpDLElBQW9GLENBRm5HO0FBQUEsT0FHQyxnQkFBZ0IsQ0FIakI7O0FBTUEsS0FBRSxJQUFGLENBQU8sUUFBUCxHQUFrQixJQUFsQixDQUF1QixVQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQ3pDLHFCQUFpQixXQUFXLEVBQUUsTUFBRixFQUFVLFVBQVYsQ0FBcUIsSUFBckIsQ0FBWCxDQUFqQjtBQUNBLElBRkQ7O0FBSUEsb0JBQWlCLGNBQWMsVUFBZCxHQUEyQixDQUE1Qzs7QUFFQTtBQUNBLEtBQUUsSUFBRixDQUFPLEtBQVAsQ0FBYSxFQUFFLFFBQUYsQ0FBVyxLQUFYLEtBQXFCLGFBQWxDOztBQUVBLEtBQUUsU0FBRixDQUFZLE9BQVosQ0FBb0IsZ0JBQXBCO0FBQ0E7Ozs4QkFFWTtBQUNaLE9BQUksSUFBSSxJQUFSO0FBQ0E7QUFDQSxjQUFXLFlBQU07QUFDaEIsTUFBRSxhQUFGLENBQWdCLEVBQUUsS0FBbEIsRUFBeUIsRUFBRSxNQUEzQjtBQUNBLE1BQUUsZUFBRjtBQUNBLElBSEQsRUFHRyxFQUhIO0FBSUE7Ozs0QkFFVSxHLEVBQUs7QUFDZixPQUFJLElBQUksSUFBUjtBQUFBLE9BQ0MsWUFBWSxFQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLFlBRGI7QUFBQSxPQUVDLFlBQVksVUFBVSxJQUFWLENBQWUsS0FBZixDQUZiOztBQUlBLE9BQUksVUFBVSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzNCLGdCQUFZLG1CQUFpQixFQUFFLE9BQUYsQ0FBVSxXQUEzQix1REFDWCxRQURXLENBQ0YsU0FERSxDQUFaO0FBRUE7O0FBRUQsYUFBVSxJQUFWLENBQWUsS0FBZixFQUFzQixHQUF0QjtBQUNBLGFBQVUsR0FBVixDQUFjLEVBQUMsOEJBQTRCLEdBQTVCLE9BQUQsRUFBZDtBQUNBOzs7NkJBRVcsUyxFQUFXO0FBQ3RCLE9BQUksSUFBSSxJQUFSOztBQUVBLEtBQUUsU0FBRixDQUFZLENBQVosRUFBZSxTQUFmLEdBQThCLEVBQUUsT0FBRixDQUFVLFdBQXhDLGtCQUFnRSxTQUFoRTtBQUNBLEtBQUUsYUFBRixDQUFnQixFQUFFLEtBQWxCLEVBQXlCLEVBQUUsTUFBM0I7QUFDQSxLQUFFLGVBQUY7QUFDQTs7OzZCQUVXLE0sRUFBUSxJLEVBQU0sUSxFQUFVO0FBQ25DLE9BQ0MsSUFBSSxJQURMO0FBQUEsT0FFQyxNQUFNLEVBQUUsSUFBRixHQUFTLEVBQUUsSUFBRixDQUFPLGFBQWhCLHFCQUZQOztBQUtBLFlBQVMsMEJBQVksTUFBWixFQUFvQixFQUFFLEVBQXRCLENBQVQ7QUFDQSxPQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ2IsTUFBRSxHQUFGLEVBQU8sRUFBUCxDQUFVLE9BQU8sQ0FBakIsRUFBb0IsSUFBcEIsRUFBMEIsUUFBMUI7QUFDQTtBQUNELE9BQUksT0FBTyxDQUFYLEVBQWM7QUFDYix3QkFBVSxFQUFWLENBQWEsT0FBTyxDQUFwQixFQUF1QixJQUF2QixFQUE2QixRQUE3QjtBQUNBO0FBQ0Q7OzsrQkFFYSxNLEVBQVEsUSxFQUFVOztBQUUvQixPQUNDLElBQUksSUFETDtBQUFBLE9BRUMsTUFBTSxFQUFFLElBQUYsR0FBUyxFQUFFLElBQUYsQ0FBTyxhQUFoQixxQkFGUDs7QUFLQSxZQUFTLDBCQUFZLE1BQVosRUFBb0IsRUFBRSxFQUF0QixDQUFUO0FBQ0EsT0FBSSxPQUFPLENBQVgsRUFBYztBQUNiLE1BQUUsR0FBRixFQUFPLEdBQVAsQ0FBVyxPQUFPLENBQWxCLEVBQXFCLFFBQXJCO0FBQ0E7QUFDRCxPQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ2Isd0JBQVUsR0FBVixDQUFjLE9BQU8sQ0FBckIsRUFBd0IsUUFBeEI7QUFDQTtBQUNEOzs7OEJBRVksTSxFQUFRLFEsRUFBVSxNLEVBQVEsSyxFQUFPOztBQUU3QyxPQUNDLElBQUksSUFETDtBQUFBLE9BRUMsU0FBUyxtQkFBaUIsRUFBRSxPQUFGLENBQVUsV0FBM0IsZUFBZ0QsRUFBRSxPQUFGLENBQVUsV0FBMUQsb0JBQXNGLFFBQXRGLENBQStGLE1BQS9GLENBRlY7QUFBQSxPQUdDLFlBQVksT0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixRQUFuQixDQUhiOztBQU1BO0FBQ0EsT0FBSSxPQUFPLE9BQVAsQ0FBZSxNQUFmLEtBQTBCLEVBQTlCLEVBQWtDO0FBQ2pDLGdCQUFZLE9BQU8sT0FBUCxDQUFlLE1BQTNCO0FBQ0E7O0FBRUQ7QUFDQSxPQUFJLFNBQUosRUFBZTtBQUNkLE1BQUUsU0FBRixDQUFZLFNBQVo7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPLElBQVA7QUFDQTs7QUFFRCxTQUFNLGdCQUFOLENBQXVCLE1BQXZCLEVBQStCLFlBQU07QUFDcEMsV0FBTyxJQUFQO0FBQ0EsSUFGRCxFQUVHLEtBRkg7O0FBSUEsT0FBSSxPQUFPLE9BQVAsQ0FBZSxtQkFBZixJQUFzQyxPQUFPLE9BQVAsQ0FBZSxVQUF6RCxFQUFxRTtBQUNwRSxVQUFNLGdCQUFOLENBQXVCLE9BQXZCLEVBQWdDLFlBQU07QUFDckMsWUFBTyxJQUFQO0FBQ0EsS0FGRCxFQUVHLEtBRkg7QUFHQTtBQUNEOzs7Z0NBRWMsTSxFQUFRLFEsRUFBVSxNLEVBQVEsSyxFQUFPOztBQUUvQyxPQUFJLENBQUMsT0FBTyxPQUFaLEVBQXFCO0FBQ3BCO0FBQ0E7O0FBRUQsT0FDQyxJQUFJLElBREw7QUFBQSxPQUVDLFVBQ0MsRUFBRSxpQkFBZSxFQUFFLE9BQUYsQ0FBVSxXQUF6QixnQkFBK0MsRUFBRSxPQUFGLENBQVUsV0FBekQsaUNBQ2MsRUFBRSxPQUFGLENBQVUsV0FEeEIsNkNBRWdCLEVBQUUsT0FBRixDQUFVLFdBRjFCLDJEQUFGLEVBS0MsSUFMRCxHQUtRO0FBTFIsSUFNQyxRQU5ELENBTVUsTUFOVixDQUhGO0FBQUEsT0FVQyxRQUNDLEVBQUUsaUJBQWUsRUFBRSxPQUFGLENBQVUsV0FBekIsZ0JBQStDLEVBQUUsT0FBRixDQUFVLFdBQXpELGlDQUNjLEVBQUUsT0FBRixDQUFVLFdBRHhCLHNDQUFGLEVBR0MsSUFIRCxHQUdRO0FBSFIsSUFJQyxRQUpELENBSVUsTUFKVixDQVhGOztBQWdCQztBQUNBLGFBQ0MsRUFBRSxpQkFBZSxFQUFFLE9BQUYsQ0FBVSxXQUF6QixnQkFBK0MsRUFBRSxPQUFGLENBQVUsV0FBekQsY0FBNkUsRUFBRSxPQUFGLENBQVUsV0FBdkYsd0NBQ2MsRUFBRSxPQUFGLENBQVUsV0FEeEIseURBRWUsZUFBSyxDQUFMLENBQU8sV0FBUCxDQUZmLG1EQUFGLEVBS0MsUUFMRCxDQUtVLE1BTFYsRUFNQyxFQU5ELENBTUksT0FOSixFQU1hLFlBQU07QUFDbEI7QUFDQTtBQUNBLFFBQUksRUFBRSxPQUFGLENBQVUsZ0JBQWQsRUFBZ0M7O0FBRS9CLFNBQ0MsU0FBUyxFQUFFLE1BQUYsQ0FBUyxPQUFULE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGdCQUNSLElBRFEsT0FDQyxFQUFFLE9BQUYsQ0FBVSxXQURYLG9CQURWO0FBQUEsU0FHQyxVQUFVLE9BQU8sSUFBUCxDQUFZLGNBQVosQ0FIWDs7QUFNQSxTQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNqQixZQUFNLElBQU47QUFDQSxNQUZELE1BRU87QUFDTixZQUFNLEtBQU47QUFDQTs7QUFFRCxZQUFPLElBQVAsQ0FBWSxjQUFaLEVBQTRCLENBQUMsQ0FBQyxPQUE5QjtBQUNBO0FBQ0QsSUF6QkQsQ0FsQkY7O0FBNkNBO0FBQ0EsT0FBSSxFQUFFLEtBQUYsQ0FBUSxZQUFSLEtBQXlCLElBQXpCLElBQWlDLEVBQUUsS0FBRixDQUFRLFlBQVIsQ0FBcUIsS0FBckIsQ0FBMkIsb0JBQTNCLENBQXJDLEVBQXVGO0FBQ3RGLFlBQVEsSUFBUjtBQUNBOztBQUVEO0FBQ0EsU0FBTSxnQkFBTixDQUF1QixNQUF2QixFQUErQixZQUFNO0FBQ3BDLFlBQVEsSUFBUjtBQUNBLFlBQVEsSUFBUjtBQUNBLGFBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixxQkFBeUQsSUFBekQ7QUFDQSxVQUFNLElBQU47QUFDQSxJQUxELEVBS0csS0FMSDs7QUFPQSxTQUFNLGdCQUFOLENBQXVCLFNBQXZCLEVBQWtDLFlBQU07QUFDdkMsWUFBUSxJQUFSO0FBQ0EsWUFBUSxJQUFSO0FBQ0EsYUFBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLHFCQUF5RCxJQUF6RDtBQUNBLFVBQU0sSUFBTjtBQUNBLElBTEQsRUFLRyxLQUxIOztBQU9BLFNBQU0sZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBa0MsWUFBTTtBQUN2QyxZQUFRLElBQVI7QUFDQSxhQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIscUJBQXlELElBQXpEO0FBQ0EsSUFIRCxFQUdHLEtBSEg7O0FBS0EsU0FBTSxnQkFBTixDQUF1QixRQUF2QixFQUFpQyxZQUFNO0FBQ3RDLFlBQVEsSUFBUjtBQUNBLGFBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixxQkFBeUQsSUFBekQ7QUFDQSxJQUhELEVBR0csS0FISDs7QUFLQSxTQUFNLGdCQUFOLENBQXVCLE9BQXZCLEVBQWdDLFlBQU07QUFDckMsWUFBUSxJQUFSO0FBQ0EsSUFGRCxFQUVHLEtBRkg7O0FBSUEsU0FBTSxnQkFBTixDQUF1QixTQUF2QixFQUFrQyxZQUFNO0FBQ3ZDLFlBQVEsSUFBUjtBQUNBLGFBQVMsSUFBVCxPQUFrQixFQUFFLE9BQUYsQ0FBVSxXQUE1QixxQkFBeUQsSUFBekQ7QUFDQSxJQUhELEVBR0csS0FISDs7QUFNQTtBQUNBLFNBQU0sZ0JBQU4sQ0FBdUIsWUFBdkIsRUFBcUMsWUFBTTtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsWUFBUSxJQUFSO0FBQ0EsYUFBUyxJQUFULE9BQWtCLEVBQUUsT0FBRixDQUFVLFdBQTVCLHFCQUF5RCxJQUF6RDtBQUNBO0FBQ0E7QUFDQSwrQkFBZ0I7QUFDZixXQUFNLGNBQU4sR0FBdUIsaUJBQU8sVUFBUCxDQUN0QixZQUFNO0FBQ0wsVUFBSSxtQkFBUyxXQUFiLEVBQTBCO0FBQ3pCLFdBQUksTUFBTSxtQkFBUyxXQUFULENBQXFCLFlBQXJCLENBQVY7QUFDQSxXQUFJLFNBQUosQ0FBYyxTQUFkLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO0FBQ0EsY0FBTyxNQUFNLGFBQU4sQ0FBb0IsR0FBcEIsQ0FBUDtBQUNBO0FBQ0QsTUFQcUIsRUFPbkIsR0FQbUIsQ0FBdkI7QUFTQTtBQUNELElBcEJELEVBb0JHLEtBcEJIO0FBcUJBLFNBQU0sZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBa0MsWUFBTTtBQUN2QyxZQUFRLElBQVI7QUFDQSxhQUFTLElBQVQsT0FBa0IsRUFBRSxPQUFGLENBQVUsV0FBNUIscUJBQXlELElBQXpEO0FBQ0E7QUFDQSxpQkFBYSxNQUFNLGNBQW5CO0FBQ0EsSUFMRCxFQUtHLEtBTEg7O0FBT0E7QUFDQSxTQUFNLGdCQUFOLENBQXVCLE9BQXZCLEVBQWdDLFVBQUMsQ0FBRCxFQUFPO0FBQ3RDLE1BQUUsWUFBRixDQUFlLENBQWY7QUFDQSxZQUFRLElBQVI7QUFDQSxZQUFRLElBQVI7QUFDQSxVQUFNLElBQU47QUFDQSxVQUFNLElBQU4sT0FBZSxFQUFFLE9BQUYsQ0FBVSxXQUF6QixvQkFBcUQsSUFBckQsQ0FBMEQsRUFBRSxPQUE1RDtBQUNBLElBTkQsRUFNRyxLQU5IOztBQVFBLFNBQU0sZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBa0MsVUFBQyxDQUFELEVBQU87QUFDeEMsTUFBRSxTQUFGLENBQVksTUFBWixFQUFvQixLQUFwQixFQUEyQixDQUEzQjtBQUNBLElBRkQsRUFFRyxLQUZIO0FBR0E7OztnQ0FFYyxNLEVBQVEsUSxFQUFVLE0sRUFBUSxLLEVBQU87O0FBRS9DLE9BQUksSUFBSSxJQUFSOztBQUVBLEtBQUUsU0FBRixDQUFZLE9BQVosQ0FBb0IsWUFBTTtBQUN6QixNQUFFLGNBQUYsR0FBbUIsSUFBbkI7QUFDQSxJQUZEOztBQUlBO0FBQ0EsS0FBRSxVQUFGLENBQWEsU0FBYixFQUF3QixVQUFDLEtBQUQsRUFBVztBQUNsQyxRQUFJLGFBQWEsRUFBRSxNQUFNLE1BQVIsRUFBZ0IsT0FBaEIsT0FBNEIsRUFBRSxPQUFGLENBQVUsV0FBdEMsZUFBakI7QUFDQSxXQUFPLFFBQVAsR0FBa0IsV0FBVyxNQUFYLEtBQXNCLENBQXRCLElBQ2pCLFdBQVcsSUFBWCxDQUFnQixJQUFoQixNQUEwQixPQUFPLE1BQVAsQ0FBYyxPQUFkLE9BQTBCLEVBQUUsT0FBRixDQUFVLFdBQXBDLGdCQUE0RCxJQUE1RCxDQUFpRSxJQUFqRSxDQUQzQjtBQUVBLFdBQU8sRUFBRSxTQUFGLENBQVksTUFBWixFQUFvQixLQUFwQixFQUEyQixLQUEzQixDQUFQO0FBQ0EsSUFMRDs7QUFRQTtBQUNBLEtBQUUsVUFBRixDQUFhLE9BQWIsRUFBc0IsVUFBQyxLQUFELEVBQVc7QUFDaEMsV0FBTyxRQUFQLEdBQWtCLEVBQUUsTUFBTSxNQUFSLEVBQWdCLE9BQWhCLE9BQTRCLEVBQUUsT0FBRixDQUFVLFdBQXRDLGdCQUE4RCxNQUE5RCxLQUF5RSxDQUEzRjtBQUNBLElBRkQ7QUFJQTs7OzRCQUVVLE0sRUFBUSxLLEVBQU8sQyxFQUFHOztBQUU1QixPQUFJLE9BQU8sUUFBUCxJQUFtQixPQUFPLE9BQVAsQ0FBZSxjQUF0QyxFQUFzRDtBQUNyRDtBQUNBLFNBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxLQUFLLE9BQU8sT0FBUCxDQUFlLFVBQWYsQ0FBMEIsTUFBL0MsRUFBdUQsSUFBSSxFQUEzRCxFQUErRCxHQUEvRCxFQUFvRTtBQUNuRSxTQUFJLFlBQVksT0FBTyxPQUFQLENBQWUsVUFBZixDQUEwQixDQUExQixDQUFoQjs7QUFFQSxVQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxVQUFVLElBQVYsQ0FBZSxNQUFwQyxFQUE0QyxJQUFJLEVBQWhELEVBQW9ELEdBQXBELEVBQXlEO0FBQ3hELFVBQUksRUFBRSxPQUFGLEtBQWMsVUFBVSxJQUFWLENBQWUsQ0FBZixDQUFsQixFQUFxQztBQUNwQyxpQkFBVSxNQUFWLENBQWlCLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDLEVBQUUsT0FBbEMsRUFBMkMsQ0FBM0M7QUFDQSxjQUFPLEtBQVA7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxVQUFPLElBQVA7QUFDQTs7O3lCQUVPO0FBQ1AsT0FBSSxJQUFJLElBQVI7O0FBRUE7QUFDQSxPQUFJLEVBQUUsS0FBRixDQUFRLGNBQVIsTUFBNEIsQ0FBaEMsRUFBbUM7QUFDbEMsTUFBRSxJQUFGO0FBQ0E7QUFDRCxLQUFFLEtBQUYsQ0FBUSxJQUFSO0FBQ0E7OzswQkFFUTtBQUNSLE9BQUk7QUFDSCxTQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0EsSUFGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVLENBQ1g7QUFDRDs7O3lCQUVPO0FBQ1AsT0FBSSxJQUFJLElBQVI7O0FBRUEsT0FBSSxDQUFDLEVBQUUsUUFBUCxFQUFpQjtBQUNoQixNQUFFLEtBQUYsQ0FBUSxJQUFSO0FBQ0E7O0FBRUQsS0FBRSxRQUFGLEdBQWEsSUFBYjtBQUNBOzs7MkJBRVMsSyxFQUFPO0FBQ2hCLFFBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEI7QUFDQTs7O2lDQUVlLEksRUFBTTtBQUNyQixRQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLElBQTFCO0FBQ0E7OzttQ0FFaUI7QUFDakIsVUFBTyxLQUFLLEtBQUwsQ0FBVyxXQUFsQjtBQUNBOzs7NEJBRVUsTSxFQUFRO0FBQ2xCLFFBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsTUFBckI7QUFDQTs7OzhCQUVZO0FBQ1osVUFBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQjtBQUNBOzs7eUJBRU8sRyxFQUFLO0FBQ1osUUFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixHQUFsQjtBQUNBOzs7MkJBRVM7O0FBRVQsT0FDQyxJQUFJLElBREw7QUFBQSxPQUVDLGVBQWUsRUFBRSxLQUFGLENBQVEsWUFGeEI7O0FBS0E7QUFDQSxRQUFLLElBQUksWUFBVCxJQUF5QixFQUFFLE9BQUYsQ0FBVSxRQUFuQyxFQUE2QztBQUM1QyxRQUFJLFVBQVUsRUFBRSxPQUFGLENBQVUsUUFBVixDQUFtQixZQUFuQixDQUFkO0FBQ0EsUUFBSSxZQUFVLE9BQVYsQ0FBSixFQUEwQjtBQUN6QixTQUFJO0FBQ0gsa0JBQVUsT0FBVixFQUFxQixDQUFyQjtBQUNBLE1BRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNYO0FBQ0EsY0FBUSxLQUFSLHFCQUFnQyxPQUFoQyxFQUEyQyxDQUEzQztBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLEtBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWTtBQUNYLFdBQU8sRUFBRSxLQUFGLENBQVEsSUFBUixDQUFhLE9BQWIsS0FBeUIsTUFEckI7QUFFWCxZQUFRLEVBQUUsS0FBRixDQUFRLElBQVIsQ0FBYSxRQUFiLEtBQTBCO0FBRnZCLElBQVo7O0FBS0E7QUFDQSxPQUFJLENBQUMsRUFBRSxTQUFQLEVBQWtCO0FBQ2pCLE1BQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxVQUFkLEVBQTBCLElBQTFCO0FBQ0E7QUFDQTtBQUNBLE1BQUUsS0FBRixDQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLEVBQUUsS0FBRixDQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLE9BQStCLFlBQS9CLEVBQStDLEVBQS9DLENBQW5CO0FBQ0EsTUFBRSxLQUFGLENBQVEsS0FBUixHQUFnQixZQUFoQixDQUE2QixFQUFFLFNBQS9CLEVBQTBDLElBQTFDO0FBQ0EsTUFBRSxLQUFGLENBQVEsTUFBUjtBQUNBLElBUEQsTUFPTztBQUNOLE1BQUUsS0FBRixDQUFRLFlBQVIsQ0FBcUIsRUFBRSxTQUF2QjtBQUNBOztBQUVELEtBQUUsS0FBRixDQUFRLE1BQVI7O0FBRUE7QUFDQTtBQUNBLFVBQU8sZUFBSyxPQUFMLENBQWEsRUFBRSxFQUFmLENBQVA7O0FBRUEsT0FBSSxRQUFPLEVBQUUsU0FBVCxNQUF1QixRQUEzQixFQUFxQztBQUNwQyxNQUFFLFNBQUYsQ0FBWSxJQUFaLE9BQXFCLEVBQUUsT0FBRixDQUFVLFdBQS9CLGdCQUF1RCxNQUF2RDtBQUNBLE1BQUUsU0FBRixDQUFZLE1BQVo7QUFDQTtBQUNELEtBQUUsWUFBRjtBQUNBLFVBQU8sRUFBRSxJQUFGLENBQU8sTUFBZDtBQUNBOzs7Ozs7QUFHRixpQkFBTyxrQkFBUCxHQUE0QixrQkFBNUI7O2tCQUVlLGtCOztBQUVmOztBQUNBLENBQUMsVUFBQyxDQUFELEVBQU87O0FBRVAsS0FBSSxPQUFPLENBQVAsS0FBYSxXQUFqQixFQUE4QjtBQUM3QixJQUFFLEVBQUYsQ0FBSyxrQkFBTCxHQUEwQixVQUFVLE9BQVYsRUFBbUI7QUFDNUMsT0FBSSxZQUFZLEtBQWhCLEVBQXVCO0FBQ3RCLFNBQUssSUFBTCxDQUFVLFlBQVk7QUFDckIsU0FBSSxTQUFTLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxvQkFBYixDQUFiO0FBQ0EsU0FBSSxNQUFKLEVBQVk7QUFDWCxhQUFPLE1BQVA7QUFDQTtBQUNELE9BQUUsSUFBRixFQUFRLFVBQVIsQ0FBbUIsb0JBQW5CO0FBQ0EsS0FORDtBQU9BLElBUkQsTUFTSztBQUNKLFNBQUssSUFBTCxDQUFVLFlBQVk7QUFDckIsT0FBRSxJQUFGLEVBQVEsSUFBUixDQUFhLG9CQUFiLEVBQW1DLElBQUksa0JBQUosQ0FBdUIsSUFBdkIsRUFBNkIsT0FBN0IsQ0FBbkM7QUFDQSxLQUZEO0FBR0E7QUFDRCxVQUFPLElBQVA7QUFDQSxHQWhCRDs7QUFrQkEsd0JBQVksS0FBWixDQUFrQixZQUFNO0FBQ3ZCO0FBQ0EsV0FBTSxPQUFPLFdBQWIsYUFBa0Msa0JBQWxDO0FBQ0EsR0FIRDtBQUlBO0FBRUQsQ0EzQkQsRUEyQkcsZUFBSyxDQTNCUjs7O0FDbG1EQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7Ozs7QUFPQSxJQUFNLGlCQUFpQjtBQUN0Qjs7O0FBR0EsZUFBYyxLQUpRO0FBS3RCOzs7QUFHQSxjQUFhLEtBUlM7QUFTdEI7OztBQUdBLGNBQWEsRUFaUzs7QUFjdEI7Ozs7O0FBS0EsZ0JBQWUsdUJBQUMsUUFBRCxFQUFjOztBQUU1QixNQUFJLGVBQWUsUUFBbkIsRUFBNkI7QUFDNUIsa0JBQWUsWUFBZixDQUE0QixRQUE1QjtBQUNBLEdBRkQsTUFFTztBQUNOLGtCQUFlLGFBQWY7QUFDQSxrQkFBZSxXQUFmLENBQTJCLElBQTNCLENBQWdDLFFBQWhDO0FBQ0E7QUFDRCxFQTNCcUI7O0FBNkJ0Qjs7OztBQUlBLGdCQUFlLHlCQUFNO0FBQ3BCLE1BQUksQ0FBQyxlQUFlLFlBQXBCLEVBQWtDO0FBQ2pDLE9BQUksSUFBSSxtQkFBUyxhQUFULENBQXVCLFFBQXZCLENBQVI7QUFDQSxLQUFFLEtBQUYsR0FBVSxJQUFWO0FBQ0EsS0FBRSxHQUFGLEdBQVEsd0JBQVI7QUFDQSxPQUFJLElBQUksbUJBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0MsQ0FBeEMsQ0FBUjtBQUNBLEtBQUUsVUFBRixDQUFhLFlBQWIsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0I7QUFDQSxrQkFBZSxZQUFmLEdBQThCLElBQTlCO0FBQ0E7QUFDRCxFQTFDcUI7O0FBNEN0Qjs7OztBQUlBLFdBQVUsb0JBQU07O0FBRWYsaUJBQWUsUUFBZixHQUEwQixJQUExQjtBQUNBLGlCQUFlLFdBQWYsR0FBNkIsSUFBN0I7O0FBRUEsU0FBTyxlQUFlLFdBQWYsQ0FBMkIsTUFBM0IsR0FBb0MsQ0FBM0MsRUFBOEM7QUFDN0MsT0FBSSxXQUFXLGVBQWUsV0FBZixDQUEyQixHQUEzQixFQUFmO0FBQ0Esa0JBQWUsWUFBZixDQUE0QixRQUE1QjtBQUNBO0FBQ0QsRUF6RHFCOztBQTJEdEI7Ozs7O0FBS0EsZUFBYyxzQkFBQyxRQUFELEVBQWM7O0FBRTNCLE1BQ0MsU0FBUyxHQUFHLE1BQUgsQ0FBVSxTQUFTLFNBQW5CLEVBQThCO0FBQ3RDLFdBQVEsU0FBUyxNQUFULElBQW1CLE1BRFc7QUFFdEMsVUFBTyxTQUFTLEtBQVQsSUFBa0IsTUFGYTtBQUd0QyxVQUFPLFNBQVMsT0FIc0I7QUFJdEMsV0FBUSxPQUFPLE1BQVAsQ0FBYyxFQUFDLEtBQUssSUFBTixFQUFkLEVBQTJCLFNBQVMsTUFBcEMsQ0FKOEI7QUFLdEMsV0FBUSxTQUFTO0FBTHFCLEdBQTlCLENBRFY7O0FBU0EsU0FBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxZQUFNO0FBQ3pDLG9CQUFPLGNBQWMsU0FBUyxFQUE5QixFQUFrQyxNQUFsQyxFQUEwQyxFQUFDLFFBQVEsSUFBVCxFQUFlLE9BQU8sS0FBdEIsRUFBMUM7QUFDQSxHQUZEO0FBR0EsRUE5RXFCOztBQWdGdEI7Ozs7Ozs7OztBQVNBLG1CQUFrQiwwQkFBQyxHQUFELEVBQVM7QUFDMUIsTUFDQyxRQUFRLElBQUksS0FBSixDQUFVLEdBQVYsQ0FEVDtBQUFBLE1BRUMsV0FBVyxNQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLENBRlo7QUFBQSxNQUdDLFlBQVksU0FBUyxLQUFULENBQWUsR0FBZixDQUhiOztBQU1BLFNBQU8sVUFBVSxDQUFWLENBQVA7QUFDQTtBQWpHcUIsQ0FBdkI7O0FBb0dBLElBQU0sNEJBQTRCO0FBQ2pDLE9BQU0sb0JBRDJCOztBQUdqQyxVQUFTO0FBQ1IsVUFBUSxvQkFEQTs7QUFHUixlQUFhO0FBQ1osVUFBTyxNQURLO0FBRVosV0FBUSxNQUZJO0FBR1osV0FBUTtBQUNQLGNBQVUsS0FESDtBQUVQLGdCQUFZLENBRkw7QUFHUCxVQUFNLENBSEM7QUFJUCxVQUFNLENBSkM7QUFLUCxhQUFTO0FBTEY7QUFISTtBQUhMLEVBSHdCOztBQW1CakM7Ozs7OztBQU1BLGNBQWEscUJBQUMsSUFBRDtBQUFBLFNBQVUsQ0FBQyxtQkFBRCxFQUFzQixxQkFBdEIsRUFBNkMsUUFBN0MsQ0FBc0QsSUFBdEQsQ0FBVjtBQUFBLEVBekJvQjs7QUEyQmpDOzs7Ozs7OztBQVFBLFNBQVEsZ0JBQUMsWUFBRCxFQUFlLE9BQWYsRUFBd0IsVUFBeEIsRUFBdUM7O0FBRTlDLE1BQUksS0FBSyxFQUFUOztBQUVBLEtBQUcsT0FBSCxHQUFhLE9BQWI7QUFDQSxLQUFHLEVBQUgsR0FBUSxhQUFhLEVBQWIsR0FBa0IsR0FBbEIsR0FBd0IsUUFBUSxNQUF4QztBQUNBLEtBQUcsWUFBSCxHQUFrQixZQUFsQjs7QUFFQSxNQUNDLFdBQVcsRUFEWjtBQUFBLE1BRUMsZ0JBQWdCLEtBRmpCO0FBQUEsTUFHQyxXQUFXLElBSFo7QUFBQSxNQUlDLFdBQVcsSUFKWjtBQUFBLE1BS0MsZUFMRDtBQUFBLE1BTUMsVUFORDtBQUFBLE1BT0MsV0FQRDs7QUFVQTtBQUNBLE1BQ0MsUUFBUSxlQUFLLFVBQUwsQ0FBZ0IsVUFEekI7QUFBQSxNQUVDLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxRQUFELEVBQWM7O0FBRXBDOztBQUVBLE9BQU0sZUFBYSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsV0FBekIsRUFBYixHQUFzRCxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FBNUQ7O0FBRUEsY0FBUyxPQUFULElBQXNCLFlBQU07QUFDM0IsUUFBSSxhQUFhLElBQWpCLEVBQXVCO0FBQ3RCLFNBQUksUUFBUSxJQUFaOztBQUVBOztBQUhzQjtBQUl0QixjQUFRLFFBQVI7QUFDQyxZQUFLLGFBQUw7QUFDQztBQUFBLFlBQU8sU0FBUztBQUFoQjs7QUFFRCxZQUFLLFVBQUw7QUFDQztBQUFBLFlBQU8sTUFBTSxTQUFTLFFBQWYsSUFBMkIsQ0FBM0IsR0FBK0IsU0FBUztBQUEvQzs7QUFFRCxZQUFLLFFBQUw7QUFDQztBQUFBLFlBQU8sU0FBUztBQUFoQjs7QUFFRCxZQUFLLFFBQUw7QUFDQztBQUFBLFlBQU8sU0FBUztBQUFoQjs7QUFFRCxZQUFLLE9BQUw7QUFDQztBQUFBLFlBQU8sU0FBUztBQUFoQjs7QUFFRCxZQUFLLE9BQUw7QUFDQztBQUFBLFlBQU8sU0FBUztBQUFoQjs7QUFFRCxZQUFLLFVBQUw7QUFDQyxZQUFJLGdCQUFnQixTQUFTLFlBQTdCO0FBQUEsWUFDQyxXQUFXLFNBQVMsUUFEckI7QUFFQTtBQUFBLFlBQU87QUFDTixpQkFBTyxpQkFBTTtBQUNaLGtCQUFPLENBQVA7QUFDQSxXQUhLO0FBSU4sZUFBSyxlQUFNO0FBQ1Ysa0JBQU8sZ0JBQWdCLFFBQXZCO0FBQ0EsV0FOSztBQU9OLGtCQUFRO0FBUEY7QUFBUDtBQVNELFlBQUssS0FBTDtBQUNDO0FBQUEsWUFBTyxhQUFhLFlBQWIsQ0FBMEIsWUFBMUIsQ0FBdUMsS0FBdkM7QUFBUDtBQWhDRjtBQUpzQjs7QUFBQTtBQXVDdEIsWUFBTyxLQUFQO0FBQ0EsS0F4Q0QsTUF3Q087QUFDTixZQUFPLElBQVA7QUFDQTtBQUNELElBNUNEOztBQThDQSxjQUFTLE9BQVQsSUFBc0IsVUFBQyxLQUFELEVBQVc7QUFDaEMsUUFBSSxhQUFhLElBQWpCLEVBQXVCOztBQUV0QixhQUFRLFFBQVI7O0FBRUMsV0FBSyxLQUFMO0FBQ0MsV0FBSSxNQUFNLE9BQU8sS0FBUCxLQUFpQixRQUFqQixHQUE0QixLQUE1QixHQUFvQyxNQUFNLENBQU4sRUFBUyxHQUF2RDs7QUFFQSxnQkFBUyxJQUFULENBQWMsZUFBZSxnQkFBZixDQUFnQyxHQUFoQyxDQUFkO0FBQ0E7O0FBRUQsV0FBSyxhQUFMO0FBQ0MsZ0JBQVMsSUFBVCxDQUFjLEtBQWQ7QUFDQTs7QUFFRCxXQUFLLE9BQUw7QUFDQyxXQUFJLEtBQUosRUFBVztBQUNWLGlCQUFTLFFBQVQsQ0FBa0IsSUFBbEI7QUFDQSxRQUZELE1BRU87QUFDTixpQkFBUyxRQUFULENBQWtCLEtBQWxCO0FBQ0E7QUFDRCxrQkFBVyxZQUFNO0FBQ2hCLFlBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLEVBQTVCLENBQVo7QUFDQSxxQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsUUFIRCxFQUdHLEVBSEg7QUFJQTs7QUFFRCxXQUFLLFFBQUw7QUFDQyxnQkFBUyxTQUFULENBQW1CLEtBQW5CO0FBQ0Esa0JBQVcsWUFBTTtBQUNoQixZQUFJLFFBQVEsc0JBQVksY0FBWixFQUE0QixFQUE1QixDQUFaO0FBQ0EscUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLFFBSEQsRUFHRyxFQUhIO0FBSUE7O0FBRUQ7QUFDQyxlQUFRLEdBQVIsQ0FBWSxRQUFRLEdBQUcsRUFBdkIsRUFBMkIsUUFBM0IsRUFBcUMsc0JBQXJDO0FBakNGO0FBb0NBLEtBdENELE1Bc0NPO0FBQ047QUFDQSxjQUFTLElBQVQsQ0FBYyxFQUFDLE1BQU0sS0FBUCxFQUFjLFVBQVUsUUFBeEIsRUFBa0MsT0FBTyxLQUF6QyxFQUFkO0FBQ0E7QUFDRCxJQTNDRDtBQTZDQSxHQW5HRjs7QUFzR0EsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLE1BQU0sTUFBdkIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMzQyx3QkFBcUIsTUFBTSxDQUFOLENBQXJCO0FBQ0E7O0FBRUQ7QUFDQSxNQUNDLFVBQVUsZUFBSyxVQUFMLENBQWdCLE9BRDNCO0FBQUEsTUFFQyxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxVQUFELEVBQWdCOztBQUUvQjtBQUNBLE1BQUcsVUFBSCxJQUFpQixZQUFNO0FBQ3RCLFFBQUksYUFBYSxJQUFqQixFQUF1Qjs7QUFFdEI7QUFDQSxhQUFRLFVBQVI7QUFDQyxXQUFLLE1BQUw7QUFDQyxjQUFPLFNBQVMsSUFBVCxFQUFQO0FBQ0QsV0FBSyxPQUFMO0FBQ0MsY0FBTyxTQUFTLEtBQVQsRUFBUDtBQUNELFdBQUssTUFBTDtBQUNDLGNBQU8sSUFBUDs7QUFORjtBQVVBLEtBYkQsTUFhTztBQUNOLGNBQVMsSUFBVCxDQUFjLEVBQUMsTUFBTSxNQUFQLEVBQWUsWUFBWSxVQUEzQixFQUFkO0FBQ0E7QUFDRCxJQWpCRDtBQW1CQSxHQXhCRjs7QUEyQkEsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLFFBQVEsTUFBekIsRUFBaUMsSUFBSSxFQUFyQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM3QyxpQkFBYyxRQUFRLENBQVIsQ0FBZDtBQUNBOztBQUVEO0FBQ0EsbUJBQU8sY0FBYyxHQUFHLEVBQXhCLElBQThCLFVBQUMsU0FBRCxFQUFlOztBQUU1QyxtQkFBZ0IsSUFBaEI7QUFDQSxnQkFBYSxRQUFiLEdBQXdCLFdBQVcsU0FBbkM7O0FBRUE7QUFDQSxPQUFJLFNBQVMsTUFBYixFQUFxQjtBQUNwQixTQUFLLElBQUksQ0FBSixFQUFPLEtBQUssU0FBUyxNQUExQixFQUFrQyxJQUFJLEVBQXRDLEVBQTBDLEdBQTFDLEVBQStDOztBQUU5QyxTQUFJLFlBQVksU0FBUyxDQUFULENBQWhCOztBQUVBLFNBQUksVUFBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzdCLFVBQ0MsV0FBVyxVQUFVLFFBRHRCO0FBQUEsVUFFQyxlQUFhLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixXQUF6QixFQUFiLEdBQXNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixDQUZ2RDs7QUFLQSxpQkFBUyxPQUFULEVBQW9CLFVBQVUsS0FBOUI7QUFFQSxNQVJELE1BUU8sSUFBSSxVQUFVLElBQVYsS0FBbUIsTUFBdkIsRUFBK0I7QUFDckMsU0FBRyxVQUFVLFVBQWI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsY0FBVyxtQkFBUyxjQUFULENBQXdCLEdBQUcsRUFBM0IsQ0FBWDs7QUFFQTtBQUNBLFlBQVMsQ0FBQyxXQUFELEVBQWMsVUFBZCxDQUFUO0FBQ0EsT0FBSSxjQUFjLFNBQWQsV0FBYyxDQUFDLENBQUQsRUFBTztBQUN4QixRQUFJLFFBQVEsc0JBQVksRUFBRSxJQUFkLEVBQW9CLEVBQXBCLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFIRDs7QUFLQSxRQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDckIsdUJBQVMsUUFBVCxFQUFtQixPQUFPLENBQVAsQ0FBbkIsRUFBOEIsV0FBOUI7QUFDQTs7QUFFRDtBQUNBLFlBQVMsZUFBSyxVQUFMLENBQWdCLE1BQXpCO0FBQ0EsWUFBUyxPQUFPLE1BQVAsQ0FBYyxDQUFDLE9BQUQsRUFBVSxXQUFWLEVBQXVCLFVBQXZCLENBQWQsQ0FBVDtBQUNBLE9BQUkscUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLFNBQUQsRUFBZTs7QUFFdkM7QUFDQSxRQUFJLGNBQWMsT0FBbEIsRUFBMkI7O0FBRTFCLGNBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBQyxDQUFELEVBQU87QUFDM0MsVUFBSSxRQUFRLHNCQUFZLEVBQUUsSUFBZCxFQUFvQixRQUFwQixDQUFaO0FBQ0EsbUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLE1BSEQ7QUFJQTtBQUVELElBWEQ7O0FBYUEsUUFBSyxJQUFJLENBQUosRUFBTyxLQUFLLE9BQU8sTUFBeEIsRUFBZ0MsSUFBSSxFQUFwQyxFQUF3QyxHQUF4QyxFQUE2QztBQUM1Qyx1QkFBbUIsT0FBTyxDQUFQLENBQW5CO0FBQ0E7O0FBRUQ7QUFDQSxZQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDLFlBQU07QUFDM0MsUUFBSSxRQUFRLHNCQUFZLE1BQVosRUFBb0IsUUFBcEIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7O0FBRUEsWUFBUSxzQkFBWSxVQUFaLEVBQXdCLFFBQXhCLENBQVI7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCOztBQUVBLFlBQVEsc0JBQVksWUFBWixFQUEwQixRQUExQixDQUFSO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBVEQ7QUFVQSxZQUFTLGdCQUFULENBQTBCLGVBQTFCLEVBQTJDLFlBQU07QUFDaEQsUUFBSSxRQUFRLHNCQUFZLFlBQVosRUFBMEIsUUFBMUIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxJQUhEO0FBSUEsWUFBUyxnQkFBVCxDQUEwQixVQUExQixFQUFzQyxZQUFNO0FBQzNDLFFBQUksUUFBUSxzQkFBWSxPQUFaLEVBQXFCLFFBQXJCLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFIRDtBQUlBLFlBQVMsZ0JBQVQsQ0FBMEIsUUFBMUIsRUFBb0MsWUFBTTtBQUN6QyxRQUFJLFFBQVEsc0JBQVksT0FBWixFQUFxQixRQUFyQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBSEQ7QUFJQSxZQUFTLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLFlBQU07QUFDOUMsUUFBSSxRQUFRLHNCQUFZLE1BQVosRUFBb0IsUUFBcEIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7O0FBRUEsWUFBUSxzQkFBWSxZQUFaLEVBQTBCLFFBQTFCLENBQVI7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFORDtBQU9BLFlBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsWUFBTTtBQUM1QyxRQUFJLFFBQVEsc0JBQVksT0FBWixFQUFxQixRQUFyQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBSEQ7QUFJQSxZQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDLFlBQU07QUFDM0MsUUFBSSxRQUFRLHNCQUFZLFlBQVosRUFBMEIsUUFBMUIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxJQUhEO0FBSUEsWUFBUyxnQkFBVCxDQUEwQixnQkFBMUIsRUFBNEMsWUFBTTtBQUNqRCxRQUFJLFFBQVEsc0JBQVksWUFBWixFQUEwQixRQUExQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBSEQ7O0FBTUE7QUFDQSxPQUFJLGFBQWEsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLEVBQWdDLGdCQUFoQyxFQUFrRCxTQUFsRCxDQUFqQjs7QUFFQSxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssV0FBVyxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQ2hELFFBQUksUUFBUSxzQkFBWSxXQUFXLENBQVgsQ0FBWixFQUEyQixFQUEzQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBO0FBQ0QsR0E3R0Q7O0FBK0dBLE1BQUksY0FBYyxtQkFBUyxhQUFULENBQXVCLEtBQXZCLENBQWxCO0FBQ0EsY0FBWSxFQUFaLEdBQWlCLEdBQUcsRUFBcEI7QUFDQSxlQUFhLFdBQWIsQ0FBeUIsV0FBekI7QUFDQSxNQUFJLGFBQWEsWUFBakIsRUFBK0I7QUFDOUIsZUFBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLGFBQWEsWUFBYixDQUEwQixLQUExQixDQUFnQyxLQUExRDtBQUNBLGVBQVksS0FBWixDQUFrQixNQUFsQixHQUEyQixhQUFhLFlBQWIsQ0FBMEIsS0FBMUIsQ0FBZ0MsTUFBM0Q7QUFDQTtBQUNELGVBQWEsWUFBYixDQUEwQixLQUExQixDQUFnQyxPQUFoQyxHQUEwQyxNQUExQzs7QUFFQSxNQUNDLFVBQVUsZUFBZSxnQkFBZixDQUFnQyxXQUFXLENBQVgsRUFBYyxHQUE5QyxDQURYO0FBQUEsTUFFQyxhQUFhLE9BQU8sTUFBUCxDQUFjO0FBQzFCLE9BQUksR0FBRyxFQURtQjtBQUUxQixjQUFXLFdBRmU7QUFHMUIsWUFBUyxPQUhpQjtBQUkxQixhQUFVLENBQUMsQ0FBRSxhQUFhLFlBQWIsQ0FBMEIsWUFBMUIsQ0FBdUMsVUFBdkM7QUFKYSxHQUFkLEVBS1YsR0FBRyxPQUFILENBQVcsV0FMRCxDQUZkOztBQVNBLGlCQUFlLGFBQWYsQ0FBNkIsVUFBN0I7O0FBRUEsS0FBRyxJQUFILEdBQVUsWUFBTTtBQUNmLE1BQUcsWUFBSDtBQUNBLE1BQUcsS0FBSDtBQUNBLE9BQUksUUFBSixFQUFjO0FBQ2IsYUFBUyxLQUFULENBQWUsT0FBZixHQUF5QixNQUF6QjtBQUNBO0FBQ0QsR0FORDtBQU9BLEtBQUcsSUFBSCxHQUFVLFlBQU07QUFDZixPQUFJLFFBQUosRUFBYztBQUNiLGFBQVMsS0FBVCxDQUFlLE9BQWYsR0FBeUIsRUFBekI7QUFDQTtBQUNELEdBSkQ7QUFLQSxLQUFHLE9BQUgsR0FBYSxVQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQy9CLFlBQVMsS0FBVCxHQUFpQixLQUFqQjtBQUNBLFlBQVMsTUFBVCxHQUFrQixNQUFsQjtBQUNBLEdBSEQ7QUFJQSxLQUFHLE9BQUgsR0FBYSxZQUFNO0FBQ2xCLFlBQVMsT0FBVDtBQUNBLEdBRkQ7QUFHQSxLQUFHLFFBQUgsR0FBYyxJQUFkOztBQUVBLEtBQUcsYUFBSCxHQUFtQixZQUFNO0FBQ3hCLE1BQUcsUUFBSCxHQUFjLFlBQVksWUFBTTtBQUMvQixtQkFBZSxTQUFmLENBQXlCLEdBQUcsRUFBNUIsRUFBZ0MsUUFBaEMsRUFBMEMsWUFBMUMsRUFBd0Q7QUFDdkQsYUFBUSxLQUQrQztBQUV2RCxZQUFPO0FBRmdELEtBQXhEO0FBSUEsSUFMYSxFQUtYLEdBTFcsQ0FBZDtBQU1BLEdBUEQ7QUFRQSxLQUFHLFlBQUgsR0FBa0IsWUFBTTtBQUN2QixPQUFJLEdBQUcsUUFBUCxFQUFpQjtBQUNoQixrQkFBYyxHQUFHLFFBQWpCO0FBQ0E7QUFDRCxHQUpEOztBQU1BLFNBQU8sRUFBUDtBQUNBO0FBeFdnQyxDQUFsQzs7QUE0V0E7Ozs7QUFJQSxrQkFBVyxJQUFYLENBQWdCLFVBQUMsR0FBRCxFQUFTO0FBQ3hCLE9BQU0sSUFBSSxXQUFKLEVBQU47QUFDQSxRQUFRLElBQUksUUFBSixDQUFhLG1CQUFiLEtBQXFDLElBQUksUUFBSixDQUFhLHFCQUFiLENBQXJDLElBQTRFLElBQUksUUFBSixDQUFhLFVBQWIsQ0FBN0UsR0FBeUcscUJBQXpHLEdBQWlJLElBQXhJO0FBQ0EsQ0FIRDs7QUFLQSxpQkFBTyxXQUFQLEdBQXFCLFlBQU07QUFDMUIsZ0JBQWUsUUFBZjtBQUNBLENBRkQ7O0FBSUEsbUJBQVMsR0FBVCxDQUFhLHlCQUFiOzs7QUM3ZUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7O0FBU0EsSUFBTSxhQUFhO0FBQ2xCOzs7QUFHQSxnQkFBZSxLQUpHO0FBS2xCOzs7QUFHQSxnQkFBZSxFQVJHOztBQVVsQjs7Ozs7QUFLQSxrQkFBaUIseUJBQUMsUUFBRCxFQUFjO0FBQzlCLE1BQUksV0FBVyxRQUFmLEVBQXlCO0FBQ3hCLGNBQVcsY0FBWCxDQUEwQixRQUExQjtBQUNBLEdBRkQsTUFFTztBQUNOLGNBQVcsVUFBWCxDQUFzQixRQUF0QjtBQUNBLGNBQVcsYUFBWCxDQUF5QixJQUF6QixDQUE4QixRQUE5QjtBQUNBO0FBQ0QsRUF0QmlCOztBQXdCbEI7Ozs7O0FBS0EsYUFBWSxvQkFBQyxRQUFELEVBQWM7QUFDekIsTUFBSSxDQUFDLFdBQVcsY0FBaEIsRUFBZ0M7O0FBRS9CLE9BQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2xDLGVBQVcsY0FBWCxDQUEwQixRQUExQjtBQUNBLElBRkQsTUFFTztBQUFBOztBQUVOLGNBQVMsT0FBVCxDQUFpQixJQUFqQixHQUF3QixPQUFPLFNBQVMsT0FBVCxDQUFpQixJQUF4QixLQUFpQyxRQUFqQyxHQUN2QixTQUFTLE9BQVQsQ0FBaUIsSUFETSxHQUNDLGlEQUR6Qjs7QUFHQSxTQUNDLFNBQVMsbUJBQVMsYUFBVCxDQUF1QixRQUF2QixDQURWO0FBQUEsU0FFQyxpQkFBaUIsbUJBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0MsQ0FBeEMsQ0FGbEI7QUFBQSxTQUdDLE9BQU8sS0FIUjs7QUFLQSxZQUFPLEdBQVAsR0FBYSxTQUFTLE9BQVQsQ0FBaUIsSUFBOUI7O0FBRUE7QUFDQSxZQUFPLE1BQVAsR0FBZ0IsT0FBTyxrQkFBUCxHQUE0QixZQUFXO0FBQ3RELFVBQUksQ0FBQyxJQUFELEtBQVUsQ0FBQyxLQUFLLFVBQU4sSUFBb0IsS0FBSyxVQUFMLEtBQW9CLFNBQXhDLElBQ2IsS0FBSyxVQUFMLEtBQW9CLFFBRFAsSUFDbUIsS0FBSyxVQUFMLEtBQW9CLFVBRGpELENBQUosRUFDa0U7QUFDakUsY0FBTyxJQUFQO0FBQ0Esa0JBQVcsVUFBWDtBQUNBLGNBQU8sTUFBUCxHQUFnQixPQUFPLGtCQUFQLEdBQTRCLElBQTVDO0FBQ0E7QUFDRCxNQVBEOztBQVNBLG9CQUFlLFVBQWYsQ0FBMEIsWUFBMUIsQ0FBdUMsTUFBdkMsRUFBK0MsY0FBL0M7QUF0Qk07QUF1Qk47QUFDRCxjQUFXLGNBQVgsR0FBNEIsSUFBNUI7QUFDQTtBQUNELEVBNURpQjs7QUE4RGxCOzs7O0FBSUEsYUFBWSxzQkFBTTs7QUFFakIsYUFBVyxRQUFYLEdBQXNCLElBQXRCO0FBQ0EsYUFBVyxjQUFYLEdBQTRCLElBQTVCOztBQUVBLFNBQU8sV0FBVyxhQUFYLENBQXlCLE1BQXpCLEdBQWtDLENBQXpDLEVBQTRDO0FBQzNDLE9BQUksV0FBVyxXQUFXLGFBQVgsQ0FBeUIsR0FBekIsRUFBZjtBQUNBLGNBQVcsY0FBWCxDQUEwQixRQUExQjtBQUNBO0FBQ0QsRUEzRWlCOztBQTZFbEI7Ozs7O0FBS0EsaUJBQWdCLHdCQUFDLFFBQUQsRUFBYzs7QUFFN0IsTUFBSSxTQUFTLE9BQU8sV0FBUCxHQUFxQixNQUFyQixFQUFiO0FBQ0EsbUJBQU8sY0FBYyxTQUFTLEVBQTlCLEVBQWtDLE1BQWxDO0FBQ0E7QUF0RmlCLENBQW5COztBQXlGQSxJQUFJLHFCQUFxQjtBQUN4QixPQUFNLGFBRGtCOztBQUd4QixVQUFTO0FBQ1IsVUFBUSxhQURBO0FBRVIsUUFBTTtBQUNMO0FBQ0EsU0FBTSxpREFGRDtBQUdMLFVBQU87QUFIRjtBQUZFLEVBSGU7QUFXeEI7Ozs7OztBQU1BLGNBQWEscUJBQUMsSUFBRDtBQUFBLFNBQVUsc0JBQVcsQ0FBQyxzQkFBRCxFQUF5QixRQUF6QixDQUFrQyxJQUFsQyxDQUFyQjtBQUFBLEVBakJXOztBQW1CeEI7Ozs7Ozs7O0FBUUEsU0FBUSxnQkFBQyxZQUFELEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUF1Qzs7QUFFOUMsTUFDQyxPQUFPLElBRFI7QUFBQSxNQUVDLGVBQWUsYUFBYSxZQUY3QjtBQUFBLE1BR0MsS0FBSyxhQUFhLEVBQWIsR0FBa0IsR0FBbEIsR0FBd0IsUUFBUSxNQUh0QztBQUFBLE1BSUMsbUJBSkQ7QUFBQSxNQUtDLFFBQVEsRUFMVDtBQUFBLE1BTUMsVUFORDtBQUFBLE1BT0MsV0FQRDs7QUFVQSxTQUFPLGFBQWEsU0FBYixDQUF1QixJQUF2QixDQUFQO0FBQ0EsWUFBVSxPQUFPLE1BQVAsQ0FBYyxPQUFkLEVBQXVCLGFBQWEsT0FBcEMsQ0FBVjs7QUFFQTtBQUNBLE1BQ0MsUUFBUSxlQUFLLFVBQUwsQ0FBZ0IsVUFEekI7QUFBQSxNQUVDLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxRQUFELEVBQWM7QUFDcEMsT0FBTSxlQUFhLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixXQUF6QixFQUFiLEdBQXNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixDQUE1RDs7QUFFQSxnQkFBVyxPQUFYLElBQXdCO0FBQUEsV0FBTyxlQUFlLElBQWhCLEdBQXdCLEtBQUssUUFBTCxDQUF4QixHQUF5QyxJQUEvQztBQUFBLElBQXhCOztBQUVBLGdCQUFXLE9BQVgsSUFBd0IsVUFBQyxLQUFELEVBQVc7QUFDbEMsUUFBSSxlQUFlLElBQW5CLEVBQXlCO0FBQ3hCLFNBQUksYUFBYSxLQUFqQixFQUF3Qjs7QUFFdkIsaUJBQVcsWUFBWCxDQUF3QixLQUF4Qjs7QUFFQSxVQUFJLEtBQUssWUFBTCxDQUFrQixVQUFsQixDQUFKLEVBQW1DO0FBQ2xDLFlBQUssSUFBTDtBQUNBO0FBQ0Q7O0FBRUQsVUFBSyxRQUFMLElBQWlCLEtBQWpCO0FBQ0EsS0FYRCxNQVdPO0FBQ047QUFDQSxXQUFNLElBQU4sQ0FBVyxFQUFDLE1BQU0sS0FBUCxFQUFjLFVBQVUsUUFBeEIsRUFBa0MsT0FBTyxLQUF6QyxFQUFYO0FBQ0E7QUFDRCxJQWhCRDtBQWtCQSxHQXpCRjs7QUE0QkEsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLE1BQU0sTUFBdkIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMzQyx3QkFBcUIsTUFBTSxDQUFOLENBQXJCO0FBQ0E7O0FBRUQ7QUFDQSxtQkFBTyxjQUFjLEVBQXJCLElBQTJCLFVBQUMsV0FBRCxFQUFpQjs7QUFFM0MsZ0JBQWEsVUFBYixHQUEwQixhQUFhLFdBQXZDOztBQUVBO0FBQ0EsY0FBVyxRQUFYLEdBQXNCLHNCQUF0QixDQUE2QyxRQUFRLElBQVIsQ0FBYSxLQUExRDs7QUFFQTtBQUNBLE9BQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2pCLFNBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxNQUFNLE1BQXZCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsR0FBdkMsRUFBNEM7O0FBRTNDLFNBQUksWUFBWSxNQUFNLENBQU4sQ0FBaEI7O0FBRUEsU0FBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDN0IsVUFBSSxXQUFXLFVBQVUsUUFBekI7QUFBQSxVQUNDLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBRHZEOztBQUdBLG1CQUFXLE9BQVgsRUFBc0IsVUFBVSxLQUFoQztBQUNBLE1BTEQsTUFLTyxJQUFJLFVBQVUsSUFBVixLQUFtQixNQUF2QixFQUErQjtBQUNyQyxXQUFLLFVBQVUsVUFBZjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLE9BQ0MsU0FBUyxlQUFLLFVBQUwsQ0FBZ0IsTUFEMUI7QUFBQSxPQUNrQyxhQUFhLE9BQU8sV0FBUCxDQUFtQixNQURsRTtBQUFBLE9BRUMsZUFBZSxTQUFmLFlBQWUsQ0FBQyxTQUFELEVBQWU7O0FBRTdCLFFBQUksY0FBYyxnQkFBbEIsRUFBb0M7QUFDbkMsZ0JBQVcsVUFBWCxDQUFzQixJQUF0QixFQUE0QixLQUFLLEdBQWpDLEVBQXNDLEtBQXRDO0FBQ0E7O0FBRUQsU0FBSyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxVQUFDLENBQUQsRUFBTztBQUN2QyxTQUFJLFFBQVEsbUJBQVMsV0FBVCxDQUFxQixZQUFyQixDQUFaO0FBQ0EsV0FBTSxTQUFOLENBQWdCLEVBQUUsSUFBbEIsRUFBd0IsRUFBRSxPQUExQixFQUFtQyxFQUFFLFVBQXJDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxLQVJEO0FBVUEsSUFsQkY7O0FBcUJBLFlBQVMsT0FBTyxNQUFQLENBQWMsQ0FBQyxPQUFELEVBQVUsV0FBVixFQUF1QixVQUF2QixDQUFkLENBQVQ7O0FBRUEsUUFBSyxJQUFJLENBQUosRUFBTyxLQUFLLE9BQU8sTUFBeEIsRUFBZ0MsSUFBSSxFQUFwQyxFQUF3QyxHQUF4QyxFQUE2QztBQUM1QyxpQkFBYSxPQUFPLENBQVAsQ0FBYjtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsT0FBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQUMsQ0FBRCxFQUFPO0FBQ2hDLFFBQUksUUFBUSxzQkFBWSxFQUFFLElBQWQsRUFBb0IsSUFBcEIsQ0FBWjtBQUNBLFVBQU0sSUFBTixHQUFhLENBQWI7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCOztBQUVBLFFBQUksRUFBRSxJQUFGLENBQU8sV0FBUCxPQUF5QixPQUE3QixFQUFzQztBQUNyQyxhQUFRLEtBQVIsQ0FBYyxDQUFkO0FBQ0E7QUFDRCxJQVJEOztBQVVBLFFBQUssSUFBSSxTQUFULElBQXNCLFVBQXRCLEVBQWtDO0FBQ2pDLFFBQUksV0FBVyxjQUFYLENBQTBCLFNBQTFCLENBQUosRUFBMEM7QUFDeEMsZ0JBQVcsRUFBWCxDQUFjLFdBQVcsU0FBWCxDQUFkLEVBQXFDLGlCQUFyQztBQUNEO0FBQ0Q7QUFDRCxHQTFFRDs7QUE0RUEsTUFBSSxjQUFjLFdBQVcsTUFBWCxHQUFvQixDQUF0QyxFQUF5QztBQUN4QyxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssV0FBVyxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQ2hELFFBQUksbUJBQVMsU0FBVCxDQUFtQixRQUFRLE1BQTNCLEVBQW1DLFdBQW5DLENBQStDLFdBQVcsQ0FBWCxFQUFjLElBQTdELENBQUosRUFBd0U7QUFDdkUsVUFBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLFdBQVcsQ0FBWCxFQUFjLEdBQXZDO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsT0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEVBQXhCOztBQUVBLGVBQWEsVUFBYixDQUF3QixZQUF4QixDQUFxQyxJQUFyQyxFQUEyQyxZQUEzQztBQUNBLGVBQWEsZUFBYixDQUE2QixVQUE3QjtBQUNBLGVBQWEsS0FBYixDQUFtQixPQUFuQixHQUE2QixNQUE3Qjs7QUFFQSxhQUFXLGVBQVgsQ0FBMkI7QUFDMUIsWUFBUyxRQUFRLElBRFM7QUFFMUIsT0FBSTtBQUZzQixHQUEzQjs7QUFLQTtBQUNBLE9BQUssT0FBTCxHQUFlLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDakMsUUFBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixRQUFRLElBQTNCO0FBQ0EsUUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFTLElBQTdCOztBQUVBLFVBQU8sSUFBUDtBQUNBLEdBTEQ7O0FBT0EsT0FBSyxJQUFMLEdBQVksWUFBTTtBQUNqQixRQUFLLEtBQUw7QUFDQSxRQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLE1BQXJCO0FBQ0EsVUFBTyxJQUFQO0FBQ0EsR0FKRDs7QUFNQSxPQUFLLElBQUwsR0FBWSxZQUFNO0FBQ2pCLFFBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsRUFBckI7QUFDQSxVQUFPLElBQVA7QUFDQSxHQUhEOztBQUtBLE1BQUksUUFBUSxzQkFBWSxlQUFaLEVBQTZCLElBQTdCLENBQVo7QUFDQSxlQUFhLGFBQWIsQ0FBMkIsS0FBM0I7O0FBRUEsU0FBTyxJQUFQO0FBQ0E7QUFuTXVCLENBQXpCOztBQXNNQTs7OztBQUlBLGtCQUFXLElBQVgsQ0FBZ0IsVUFBQyxHQUFELEVBQVM7QUFDeEIsT0FBTSxJQUFJLFdBQUosRUFBTjtBQUNBLFFBQU8sSUFBSSxRQUFKLENBQWEsTUFBYixJQUF1QixzQkFBdkIsR0FBZ0QsSUFBdkQ7QUFDQSxDQUhEOztBQUtBLG1CQUFTLEdBQVQsQ0FBYSxrQkFBYjs7O0FDM1RBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7OztBQU1BLElBQU0sbUJBQW1CO0FBQ3hCLE9BQU0sVUFEa0I7O0FBR3hCLFVBQVM7QUFDUixVQUFRLFVBREE7QUFFUixZQUFVO0FBQ1QsVUFBTyxlQURFO0FBRVQsVUFBTyxJQUZFO0FBR1QsWUFBUztBQUhBO0FBRkYsRUFIZTs7QUFZeEI7Ozs7OztBQU1BLGNBQWEscUJBQUMsSUFBRDtBQUFBLFNBQVcsQ0FBQyxnQkFBRCxFQUFtQixrQkFBbkIsRUFBdUMsUUFBdkMsQ0FBZ0QsSUFBaEQsQ0FBWDtBQUFBLEVBbEJXOztBQW9CeEI7Ozs7Ozs7O0FBUUEsU0FBUSxnQkFBQyxZQUFELEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUF3Qzs7QUFFL0MsTUFDQyxZQUFZLEVBRGI7QUFBQSxNQUVDLFFBQVEsSUFGVDtBQUFBLE1BR0MsUUFBUSxJQUhUO0FBQUEsTUFJQyxXQUFXLEVBSlo7QUFBQSxNQUtDLFNBQVMsSUFMVjtBQUFBLE1BTUMsUUFBUSxLQU5UO0FBQUEsTUFPQyxvQkFBb0IsS0FQckI7QUFBQSxNQVFDLE1BQU0sRUFSUDtBQUFBLE1BU0MsZUFBZSxFQVRoQjtBQUFBLE1BVUMsVUFWRDtBQUFBLE1BV0MsV0FYRDs7QUFjQSxZQUFVLE9BQU8sTUFBUCxDQUFjLE9BQWQsRUFBdUIsYUFBYSxPQUFwQyxDQUFWO0FBQ0EsWUFBVSxPQUFWLEdBQW9CLE9BQXBCO0FBQ0EsWUFBVSxFQUFWLEdBQWUsYUFBYSxFQUFiLEdBQWtCLEdBQWxCLEdBQXdCLFFBQVEsTUFBL0M7QUFDQSxZQUFVLFlBQVYsR0FBeUIsWUFBekI7O0FBRUE7QUFDQSxNQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsTUFFQyx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsUUFBRCxFQUFlOztBQUVyQyxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLHFCQUFnQixPQUFoQixJQUE2QixZQUFNOztBQUVsQyxRQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNuQixTQUFJLFFBQVEsSUFBWjs7QUFFQTtBQUNBLGFBQVEsUUFBUjtBQUNDLFdBQUssYUFBTDtBQUNDLGNBQU8sTUFBTSxrQkFBTixFQUFQOztBQUVELFdBQUssVUFBTDtBQUNDLGNBQU8sTUFBTSxXQUFOLEVBQVA7O0FBRUQsV0FBSyxRQUFMO0FBQ0MsY0FBTyxNQUFNLFNBQU4sRUFBUDs7QUFFRCxXQUFLLFFBQUw7QUFDQyxjQUFPLE1BQVA7O0FBRUQsV0FBSyxPQUFMO0FBQ0MsY0FBTyxLQUFQOztBQUVELFdBQUssT0FBTDtBQUNDLGNBQU8sTUFBTSxPQUFOLEVBQVA7O0FBRUQsV0FBSyxVQUFMO0FBQ0MsY0FBTztBQUNOLGVBQU8saUJBQU07QUFDWixnQkFBTyxDQUFQO0FBQ0EsU0FISztBQUlOLGFBQUssZUFBTTtBQUNWLGdCQUFPLENBQVA7QUFDQSxTQU5LO0FBT04sZ0JBQVE7QUFQRixRQUFQO0FBU0QsV0FBSyxLQUFMO0FBQ0MsY0FBTyxHQUFQO0FBOUJGOztBQWlDQSxZQUFPLEtBQVA7QUFDQSxLQXRDRCxNQXNDTztBQUNOLFlBQU8sSUFBUDtBQUNBO0FBQ0QsSUEzQ0Q7O0FBNkNBLHFCQUFnQixPQUFoQixJQUE2QixVQUFDLEtBQUQsRUFBWTs7QUFFeEMsUUFBSSxVQUFVLElBQWQsRUFBb0I7O0FBRW5CLGFBQVEsUUFBUjs7QUFFQyxXQUFLLEtBQUw7QUFDQyxXQUFJLE1BQU0sT0FBTyxLQUFQLEtBQWlCLFFBQWpCLEdBQTRCLEtBQTVCLEdBQW9DLE1BQU0sQ0FBTixFQUFTLEdBQXZEOztBQUVBO0FBQ0E7QUFDQSxhQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsS0FBN0I7QUFDQSwyQkFBb0IsR0FBcEIsRUFBeUIsUUFBUSxRQUFqQzs7QUFFQTtBQUNBLFVBQUcsS0FBSCxDQUFTLEtBQVQ7O0FBRUE7O0FBRUQsV0FBSyxhQUFMO0FBQ0MsYUFBTSxJQUFOLENBQVcsS0FBWDtBQUNBOztBQUVELFdBQUssT0FBTDtBQUNDLFdBQUksS0FBSixFQUFXO0FBQ1YsY0FBTSxJQUFOO0FBQ0EsUUFGRCxNQUVPO0FBQ04sY0FBTSxNQUFOO0FBQ0E7QUFDRCxrQkFBVyxZQUFNO0FBQ2hCLFlBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLFNBQTVCLENBQVo7QUFDQSxxQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsUUFIRCxFQUdHLEVBSEg7QUFJQTs7QUFFRCxXQUFLLFFBQUw7QUFDQyxhQUFNLFNBQU4sQ0FBZ0IsS0FBaEI7QUFDQSxrQkFBVyxZQUFNO0FBQ2hCLFlBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLFNBQTVCLENBQVo7QUFDQSxxQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsUUFIRCxFQUdHLEVBSEg7QUFJQTs7QUFFRDtBQUNDLGVBQVEsR0FBUixDQUFZLGNBQWMsVUFBVSxFQUFwQyxFQUF3QyxRQUF4QyxFQUFrRCxzQkFBbEQ7QUF4Q0Y7QUEyQ0EsS0E3Q0QsTUE2Q087QUFDTjtBQUNBLGNBQVMsSUFBVCxDQUFjLEVBQUMsTUFBTSxLQUFQLEVBQWMsVUFBVSxRQUF4QixFQUFrQyxPQUFPLEtBQXpDLEVBQWQ7QUFDQTtBQUNELElBbkREO0FBcURBLEdBeEdGOztBQTJHQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzNDLHdCQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDQTs7QUFFRDtBQUNBLE1BQ0MsVUFBVSxlQUFLLFVBQUwsQ0FBZ0IsT0FEM0I7QUFBQSxNQUVDLGdCQUFnQixTQUFoQixhQUFnQixDQUFDLFVBQUQsRUFBaUI7O0FBRWhDO0FBQ0EsYUFBVSxVQUFWLElBQXdCLFlBQU07O0FBRTdCLFFBQUksVUFBVSxJQUFkLEVBQW9COztBQUVuQjtBQUNBLGFBQVEsVUFBUjtBQUNDLFdBQUssTUFBTDtBQUNDLGNBQU8sTUFBTSxJQUFOLEVBQVA7QUFDRCxXQUFLLE9BQUw7QUFDQyxjQUFPLE1BQU0sS0FBTixFQUFQO0FBQ0QsV0FBSyxNQUFMO0FBQ0MsY0FBTyxJQUFQOztBQU5GO0FBVUEsS0FiRCxNQWFPO0FBQ04sY0FBUyxJQUFULENBQWMsRUFBQyxNQUFNLE1BQVAsRUFBZSxZQUFZLFVBQTNCLEVBQWQ7QUFDQTtBQUNELElBbEJEO0FBb0JBLEdBekJGOztBQTRCQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssUUFBUSxNQUF6QixFQUFpQyxJQUFJLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzdDLGlCQUFjLFFBQVEsQ0FBUixDQUFkO0FBQ0E7O0FBR0Q7Ozs7OztBQU1BLFdBQVMsVUFBVCxDQUFxQixNQUFyQixFQUE2QjtBQUM1QixRQUFLLElBQUksS0FBSSxDQUFSLEVBQVcsTUFBSyxPQUFPLE1BQTVCLEVBQW9DLEtBQUksR0FBeEMsRUFBNEMsSUFBNUMsRUFBaUQ7QUFDaEQsUUFBSSxRQUFRLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsT0FBTyxFQUFQLENBQXZCLEVBQWtDLFNBQWxDLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFdBQVMsbUJBQVQsQ0FBOEIsR0FBOUIsRUFBbUMsTUFBbkMsRUFBMkM7O0FBRTFDLFNBQU0sR0FBTjs7QUFFQSxXQUFRLG1CQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBLFNBQU0sRUFBTixHQUFXLFVBQVUsRUFBckI7QUFDQSxTQUFNLFNBQU4sR0FBa0IsVUFBbEI7QUFDQSxTQUFNLFlBQU4sQ0FBbUIsV0FBbkIsRUFBZ0MsR0FBaEM7QUFDQSxTQUFNLFlBQU4sQ0FBbUIsc0JBQW5CLEVBQTJDLE1BQTNDO0FBQ0EsU0FBTSxZQUFOLENBQW1CLGVBQW5CLEVBQW9DLE9BQXBDOztBQUVBLGdCQUFhLFlBQWIsQ0FBMEIsVUFBMUIsQ0FBcUMsWUFBckMsQ0FBa0QsS0FBbEQsRUFBeUQsYUFBYSxZQUF0RTtBQUNBLGdCQUFhLFlBQWIsQ0FBMEIsS0FBMUIsQ0FBZ0MsT0FBaEMsR0FBMEMsTUFBMUM7O0FBRUE7Ozs7QUFJQSxvQkFBTyxXQUFQLEdBQXFCLFlBQU07O0FBRTFCLE9BQUcsSUFBSCxDQUFRLE1BQVI7O0FBRUEsT0FBRyxLQUFILENBQVMsU0FBVCxDQUFtQixhQUFuQixFQUFrQyxVQUFDLEdBQUQsRUFBUzs7QUFFMUMsU0FBSSxJQUFJLElBQUosS0FBYSxPQUFqQixFQUEwQjtBQUFBOztBQUV6QixlQUFRLElBQUksUUFBWjs7QUFFQTtBQUNBLFdBQ0MsV0FBVyxNQUFNLG9CQUFOLENBQTJCLFFBQTNCLEVBQXFDLENBQXJDLENBRFo7QUFBQSxXQUVDLFFBQVEsU0FBUyxpQkFBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxJQUFsQyxFQUF3QyxLQUFqRCxDQUZUO0FBQUEsV0FHQyxTQUFTLFNBQVMsU0FBUyxLQUFULENBQWUsTUFBeEIsQ0FIVjs7QUFNQSxpQkFBVSxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCOztBQUVBLGtCQUFXLENBQUMsV0FBRCxFQUFjLFVBQWQsQ0FBWDs7QUFFQTtBQUNBLFdBQUksV0FBVyxDQUFDLGdCQUFELEVBQW1CLFFBQW5CLEVBQTZCLGlCQUE3QixFQUFnRCxrQkFBaEQsRUFBb0UsbUJBQXBFLENBQWY7QUFDQSxZQUFLLElBQUksQ0FBSixFQUFPLEtBQUssU0FBUyxNQUExQixFQUFrQyxJQUFJLEVBQXRDLEVBQTBDLEdBQTFDLEVBQStDO0FBQzlDLFlBQ0MsUUFBUSxTQUFTLENBQVQsQ0FEVDtBQUFBLFlBRUMsVUFBVSxhQUFhLEtBQWIsQ0FGWDtBQUlBLFlBQUksWUFBWSxTQUFaLElBQXlCLFlBQVksSUFBckMsSUFDSCxDQUFDLDRCQUFjLE9BQWQsQ0FERSxJQUN3QixPQUFPLFFBQVEsY0FBZixLQUFrQyxVQUQ5RCxFQUMwRTtBQUN6RSxpQkFBUSxjQUFSLENBQXVCLEtBQXZCO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFdBQUksU0FBUyxNQUFiLEVBQXFCO0FBQ3BCLGFBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxTQUFTLE1BQTFCLEVBQWtDLElBQUksRUFBdEMsRUFBMEMsR0FBMUMsRUFBK0M7O0FBRTlDLGFBQUksWUFBWSxTQUFTLENBQVQsQ0FBaEI7O0FBRUEsYUFBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDN0IsY0FDQyxXQUFXLFVBQVUsUUFEdEI7QUFBQSxjQUVDLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBRnZEOztBQUtBLDRCQUFnQixPQUFoQixFQUEyQixVQUFVLEtBQXJDO0FBRUEsVUFSRCxNQVFPLElBQUksVUFBVSxJQUFWLEtBQW1CLE1BQXZCLEVBQStCO0FBQ3JDLG9CQUFVLFVBQVUsVUFBcEI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsa0JBQVcsQ0FBQyxlQUFELEVBQWtCLE9BQWxCLEVBQTJCLFlBQTNCLEVBQXlDLFNBQXpDLEVBQW9ELFVBQXBELENBQVg7QUFDQSxrQkFBVyxDQUFDLGdCQUFELEVBQW1CLFlBQW5CLEVBQWlDLFVBQWpDLENBQVg7O0FBRUEsV0FBSSxjQUFKOztBQUVBO0FBQ0Esb0JBQWEsY0FBYixHQUE4QixNQUFNLFNBQU4sQ0FBZ0IsZ0JBQWhCLEVBQWtDLFlBQU07QUFDckUsWUFBSSxDQUFDLGlCQUFMLEVBQXdCO0FBQ3ZCLDZCQUFvQixJQUFwQjtBQUNBO0FBQ0QsaUJBQVMsS0FBVDtBQUNBLGdCQUFRLEtBQVI7QUFDQSxtQkFBVyxDQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLFlBQXBCLENBQVg7O0FBRUE7QUFDQSxnQkFBUSxZQUFZLFlBQU07QUFDekIsZUFBTSxrQkFBTjtBQUNBLG9CQUFXLENBQUMsWUFBRCxDQUFYO0FBQ0EsU0FITyxFQUdMLEdBSEssQ0FBUjtBQUlBLFFBYjZCLENBQTlCO0FBY0Esb0JBQWEsTUFBYixHQUFzQixNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsRUFBMEIsWUFBTTtBQUNyRCxpQkFBUyxJQUFUO0FBQ0EsZ0JBQVEsS0FBUjtBQUNBLG1CQUFXLENBQUMsUUFBRCxDQUFYO0FBQ0EsUUFKcUIsQ0FBdEI7QUFLQSxvQkFBYSxlQUFiLEdBQStCLE1BQU0sU0FBTixDQUFnQixpQkFBaEIsRUFBbUMsWUFBTTtBQUN2RSxpQkFBUyxJQUFUO0FBQ0EsZ0JBQVEsSUFBUjs7QUFFQTtBQUNBLGdCQUFRLFlBQVksWUFBTTtBQUN6QixlQUFNLGtCQUFOO0FBQ0Esb0JBQVcsQ0FBQyxZQUFELEVBQWUsT0FBZixDQUFYO0FBQ0EsU0FITyxFQUdMLEdBSEssQ0FBUjs7QUFLQSxzQkFBYyxLQUFkO0FBQ0EsZ0JBQVEsSUFBUjtBQUNBLFFBWjhCLENBQS9CO0FBYUEsb0JBQWEsZ0JBQWIsR0FBZ0MsTUFBTSxTQUFOLENBQWdCLGtCQUFoQixFQUFvQyxZQUFNO0FBQ3pFLG1CQUFXLENBQUMsVUFBRCxFQUFhLFlBQWIsQ0FBWDtBQUNBLFFBRitCLENBQWhDO0FBR0Esb0JBQWEsaUJBQWIsR0FBaUMsTUFBTSxTQUFOLENBQWdCLG1CQUFoQixFQUFxQyxZQUFNO0FBQzNFLG1CQUFXLENBQUMsVUFBRCxFQUFhLFlBQWIsQ0FBWDtBQUNBLFFBRmdDLENBQWpDO0FBekZ5QjtBQThGekI7QUFDRCxLQWpHRDtBQWtHQSxJQXRHRDs7QUF3R0MsSUFBQyxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sRUFBUCxFQUFjO0FBQ2YsUUFBSSxXQUFKO0FBQ0EsUUFBSSxNQUFNLEVBQUUsb0JBQUYsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBVjtBQUNBLFFBQUksRUFBRSxjQUFGLENBQWlCLEVBQWpCLENBQUosRUFBMEI7QUFDekI7QUFDQTtBQUNELFNBQUssRUFBRSxhQUFGLENBQWdCLENBQWhCLENBQUw7QUFDQSxPQUFHLEVBQUgsR0FBUSxFQUFSO0FBQ0EsT0FBRyxHQUFILEdBQVMscUNBQVQ7QUFDQSxRQUFJLFVBQUosQ0FBZSxZQUFmLENBQTRCLEVBQTVCLEVBQWdDLEdBQWhDO0FBQ0EsSUFWQSxzQkFVWSxRQVZaLEVBVXNCLGdCQVZ0QixDQUFEO0FBV0E7O0FBRUQsTUFBSSxXQUFXLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDMUIsdUJBQW9CLFdBQVcsQ0FBWCxFQUFjLEdBQWxDLEVBQXVDLFVBQVUsT0FBVixDQUFrQixRQUF6RDtBQUNBOztBQUVELFlBQVUsSUFBVixHQUFpQixZQUFNO0FBQ3RCLGFBQVUsWUFBVjtBQUNBLGFBQVUsS0FBVjtBQUNBLE9BQUksS0FBSixFQUFXO0FBQ1YsVUFBTSxLQUFOLENBQVksT0FBWixHQUFzQixNQUF0QjtBQUNBO0FBQ0QsR0FORDtBQU9BLFlBQVUsSUFBVixHQUFpQixZQUFNO0FBQ3RCLE9BQUksS0FBSixFQUFXO0FBQ1YsVUFBTSxLQUFOLENBQVksT0FBWixHQUFzQixFQUF0QjtBQUNBO0FBQ0QsR0FKRDtBQUtBLFlBQVUsT0FBVixHQUFvQixVQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQ3RDLE9BQUksVUFBVSxJQUFWLElBQWtCLENBQUMsTUFBTSxLQUFOLENBQW5CLElBQW1DLENBQUMsTUFBTSxNQUFOLENBQXhDLEVBQXVEO0FBQ3RELFVBQU0sWUFBTixDQUFtQixPQUFuQixFQUE0QixLQUE1QjtBQUNBLFVBQU0sWUFBTixDQUFtQixRQUFuQixFQUE2QixNQUE3QjtBQUNBO0FBQ0QsR0FMRDtBQU1BLFlBQVUsT0FBVixHQUFvQixZQUFNLENBQ3pCLENBREQ7QUFFQSxZQUFVLFFBQVYsR0FBcUIsSUFBckI7O0FBRUEsWUFBVSxhQUFWLEdBQTBCLFlBQU07QUFDL0I7QUFDQSxhQUFVLFFBQVYsR0FBcUIsWUFBWSxZQUFNO0FBQ3RDLFFBQUksUUFBUSxzQkFBWSxZQUFaLEVBQTBCLFNBQTFCLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFIb0IsRUFHbEIsR0FIa0IsQ0FBckI7QUFJQSxHQU5EO0FBT0EsWUFBVSxZQUFWLEdBQXlCLFlBQU07QUFDOUIsT0FBSSxVQUFVLFFBQWQsRUFBd0I7QUFDdkIsa0JBQWMsVUFBVSxRQUF4QjtBQUNBO0FBQ0QsR0FKRDs7QUFNQSxTQUFPLFNBQVA7QUFDQTtBQXpZdUIsQ0FBekI7O0FBNFlBOzs7O0FBSUEsa0JBQVcsSUFBWCxDQUFnQixVQUFDLEdBQUQsRUFBUztBQUN4QixPQUFNLElBQUksV0FBSixFQUFOO0FBQ0EsUUFBTyxJQUFJLFFBQUosQ0FBYSxnQkFBYixJQUFpQyxrQkFBakMsR0FBc0QsSUFBN0Q7QUFDQSxDQUhEOztBQUtBLG1CQUFTLEdBQVQsQ0FBYSxnQkFBYjs7O0FDcmFBOzs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7Ozs7QUFRQTs7OztBQUlPLElBQU0sMENBQWlCO0FBQzdCOzs7O0FBSUEsVUFBUyxFQUxvQjs7QUFPN0I7Ozs7OztBQU1BLG1CQUFrQiwwQkFBQyxNQUFELEVBQVMsQ0FBVCxFQUFlO0FBQ2hDLE1BQUksS0FBSyxlQUFlLE9BQWYsQ0FBdUIsTUFBdkIsQ0FBVDtBQUNBLElBQUUsQ0FBRixJQUFPLEVBQUUsQ0FBRixLQUFRLENBQWY7QUFDQSxJQUFFLENBQUYsSUFBTyxFQUFFLENBQUYsS0FBUSxDQUFmO0FBQ0EsU0FBUSxHQUFHLENBQUgsSUFBUSxFQUFFLENBQUYsQ0FBUixJQUFpQixHQUFHLENBQUgsTUFBVSxFQUFFLENBQUYsQ0FBVixJQUFrQixHQUFHLENBQUgsSUFBUSxFQUFFLENBQUYsQ0FBM0MsSUFBcUQsR0FBRyxDQUFILE1BQVUsRUFBRSxDQUFGLENBQVYsSUFBa0IsR0FBRyxDQUFILE1BQVUsRUFBRSxDQUFGLENBQTVCLElBQW9DLEdBQUcsQ0FBSCxLQUFTLEVBQUUsQ0FBRixDQUExRztBQUNBLEVBbEI0Qjs7QUFvQjdCOzs7Ozs7Ozs7O0FBVUEsWUFBVyxtQkFBQyxDQUFELEVBQUksVUFBSixFQUFnQixRQUFoQixFQUEwQixPQUExQixFQUFtQyxRQUFuQyxFQUFnRDtBQUMxRCxpQkFBZSxPQUFmLENBQXVCLENBQXZCLElBQTRCLGVBQWUsWUFBZixDQUE0QixVQUE1QixFQUF3QyxRQUF4QyxFQUFrRCxPQUFsRCxFQUEyRCxRQUEzRCxDQUE1QjtBQUNBLEVBaEM0Qjs7QUFrQzdCOzs7Ozs7Ozs7QUFTQSxlQUFjLHNCQUFDLFVBQUQsRUFBYSxRQUFiLEVBQXVCLE9BQXZCLEVBQWdDLFFBQWhDLEVBQTZDOztBQUUxRCxNQUNDLFVBQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FEWDtBQUFBLE1BRUMsb0JBRkQ7QUFBQSxNQUdDLFdBSEQ7O0FBTUE7QUFDQSxNQUFJLGVBQUksT0FBSixLQUFnQixTQUFoQixJQUE2QixRQUFPLGVBQUksT0FBSixDQUFZLFVBQVosQ0FBUCxNQUFtQyxRQUFwRSxFQUE4RTtBQUM3RSxpQkFBYyxlQUFJLE9BQUosQ0FBWSxVQUFaLEVBQXdCLFdBQXRDO0FBQ0EsT0FBSSxlQUFlLEVBQUUsT0FBTyxlQUFJLFNBQVgsS0FBeUIsV0FBekIsSUFBd0MsZUFBSSxTQUFKLENBQWMsUUFBZCxDQUF4QyxJQUFtRSxDQUFDLGVBQUksU0FBSixDQUFjLFFBQWQsRUFBd0IsYUFBOUYsQ0FBbkIsRUFBaUk7QUFDaEksY0FBVSxZQUFZLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MsRUFBaEMsRUFBb0MsT0FBcEMsQ0FBNEMsTUFBNUMsRUFBb0QsRUFBcEQsRUFBd0QsT0FBeEQsQ0FBZ0UsT0FBaEUsRUFBeUUsR0FBekUsRUFBOEUsS0FBOUUsQ0FBb0YsR0FBcEYsQ0FBVjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3hDLGFBQVEsQ0FBUixJQUFhLFNBQVMsUUFBUSxDQUFSLEVBQVcsS0FBWCxDQUFpQixLQUFqQixDQUFULEVBQWtDLEVBQWxDLENBQWI7QUFDQTtBQUNEO0FBQ0Q7QUFDQSxHQVRELE1BU08sSUFBSSxpQkFBTyxhQUFQLEtBQXlCLFNBQTdCLEVBQXdDO0FBQzlDLE9BQUk7QUFDSCxTQUFLLElBQUksYUFBSixDQUFrQixPQUFsQixDQUFMO0FBQ0EsUUFBSSxFQUFKLEVBQVE7QUFDUCxlQUFVLFNBQVMsRUFBVCxDQUFWO0FBQ0E7QUFDRCxJQUxELENBTUEsT0FBTyxDQUFQLEVBQVUsQ0FDVDtBQUNEO0FBQ0QsU0FBTyxPQUFQO0FBQ0E7QUF4RTRCLENBQXZCOztBQTJFUDs7OztBQUlBLGVBQWUsU0FBZixDQUF5QixPQUF6QixFQUFrQyxpQkFBbEMsRUFBcUQsK0JBQXJELEVBQXNGLCtCQUF0RixFQUF1SCxVQUFDLEVBQUQsRUFBUTtBQUM5SDtBQUNBLEtBQUksVUFBVSxFQUFkO0FBQUEsS0FDQyxJQUFJLEdBQUcsV0FBSCxDQUFlLFVBQWYsQ0FETDtBQUVBLEtBQUksQ0FBSixFQUFPO0FBQ04sTUFBSSxFQUFFLEtBQUYsQ0FBUSxHQUFSLEVBQWEsQ0FBYixFQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUFKO0FBQ0EsWUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFGLENBQVQsRUFBZSxFQUFmLENBQUQsRUFBcUIsU0FBUyxFQUFFLENBQUYsQ0FBVCxFQUFlLEVBQWYsQ0FBckIsRUFBeUMsU0FBUyxFQUFFLENBQUYsQ0FBVCxFQUFlLEVBQWYsQ0FBekMsQ0FBVjtBQUNBO0FBQ0QsUUFBTyxPQUFQO0FBQ0EsQ0FURDs7QUFXQSxJQUFNLDRCQUE0Qjs7QUFFakM7Ozs7Ozs7O0FBUUEsU0FBUSxnQkFBQyxZQUFELEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUF1Qzs7QUFFOUMsTUFDQyxRQUFRLEVBRFQ7QUFBQSxNQUVDLFVBRkQ7QUFBQSxNQUdDLFdBSEQ7O0FBTUE7QUFDQSxRQUFNLE9BQU4sR0FBZ0IsT0FBaEI7QUFDQSxRQUFNLEVBQU4sR0FBVyxhQUFhLEVBQWIsR0FBa0IsR0FBbEIsR0FBd0IsTUFBTSxPQUFOLENBQWMsTUFBakQ7QUFDQSxRQUFNLFlBQU4sR0FBcUIsWUFBckI7O0FBRUE7QUFDQSxRQUFNLFVBQU4sR0FBbUIsRUFBbkI7QUFDQSxRQUFNLFFBQU4sR0FBaUIsSUFBakI7QUFDQSxRQUFNLGFBQU4sR0FBc0IsRUFBdEI7O0FBRUE7QUFDQSxNQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsTUFFQyx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsUUFBRCxFQUFjOztBQUVwQztBQUNBLFNBQU0sVUFBTixDQUFpQixRQUFqQixJQUE2QixJQUE3Qjs7QUFFQSxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLGlCQUFZLE9BQVosSUFBeUIsWUFBTTs7QUFFOUIsUUFBSSxNQUFNLFFBQU4sS0FBbUIsSUFBdkIsRUFBNkI7O0FBRTVCLFNBQUksTUFBTSxRQUFOLENBQWUsU0FBUyxRQUF4QixNQUFzQyxTQUExQyxFQUFxRDtBQUFBO0FBQ3BELFdBQUksUUFBUSxNQUFNLFFBQU4sQ0FBZSxTQUFTLFFBQXhCLEdBQVo7O0FBRUE7QUFDQSxXQUFJLGFBQWEsVUFBakIsRUFBNkI7QUFDNUI7QUFBQSxZQUFPO0FBQ04saUJBQU8saUJBQU07QUFDWixrQkFBTyxDQUFQO0FBQ0EsV0FISztBQUlOLGVBQUssZUFBTTtBQUNWLGtCQUFPLEtBQVA7QUFDQSxXQU5LO0FBT04sa0JBQVE7QUFQRjtBQUFQO0FBU0E7O0FBRUQ7QUFBQSxXQUFPO0FBQVA7QUFoQm9EOztBQUFBO0FBaUJwRCxNQWpCRCxNQWlCTztBQUNOLGFBQU8sSUFBUDtBQUNBO0FBRUQsS0F2QkQsTUF1Qk87QUFDTixZQUFPLElBQVA7QUFDQTtBQUNELElBNUJEOztBQThCQSxpQkFBWSxPQUFaLElBQXlCLFVBQUMsS0FBRCxFQUFXO0FBQ25DLFFBQUksYUFBYSxLQUFqQixFQUF3QjtBQUN2QixhQUFRLDBCQUFjLEtBQWQsQ0FBUjtBQUNBOztBQUVEO0FBQ0EsUUFBSSxNQUFNLFFBQU4sS0FBbUIsSUFBbkIsSUFBMkIsTUFBTSxRQUFOLENBQWUsU0FBUyxRQUF4QixNQUFzQyxTQUFyRSxFQUFnRjtBQUMvRSxXQUFNLFFBQU4sQ0FBZSxTQUFTLFFBQXhCLEVBQWtDLEtBQWxDO0FBQ0EsS0FGRCxNQUVPO0FBQ047QUFDQSxXQUFNLGFBQU4sQ0FBb0IsSUFBcEIsQ0FBeUI7QUFDeEIsWUFBTSxLQURrQjtBQUV4QixnQkFBVSxRQUZjO0FBR3hCLGFBQU87QUFIaUIsTUFBekI7QUFLQTtBQUNELElBaEJEO0FBa0JBLEdBekRGOztBQTREQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzNDLHdCQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDQTs7QUFFRDtBQUNBLE1BQ0MsVUFBVSxlQUFLLFVBQUwsQ0FBZ0IsT0FEM0I7QUFBQSxNQUVDLGdCQUFnQixTQUFoQixhQUFnQixDQUFDLFVBQUQsRUFBZ0I7O0FBRS9CO0FBQ0EsU0FBTSxVQUFOLElBQW9CLFlBQU07O0FBRXpCLFFBQUksTUFBTSxRQUFOLEtBQW1CLElBQXZCLEVBQTZCOztBQUU1QjtBQUNBLFNBQUksTUFBTSxRQUFOLFdBQXVCLFVBQXZCLENBQUosRUFBMEM7QUFDekMsVUFBSTtBQUNILGFBQU0sUUFBTixXQUF1QixVQUF2QjtBQUNBLE9BRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNYLGVBQVEsR0FBUixDQUFZLENBQVo7QUFDQTtBQUVELE1BUEQsTUFPTztBQUNOLGNBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsZ0JBQXJCLEVBQXVDLFVBQXZDO0FBQ0E7QUFDRCxLQWJELE1BYU87QUFDTjtBQUNBLFdBQU0sYUFBTixDQUFvQixJQUFwQixDQUF5QjtBQUN4QixZQUFNLE1BRGtCO0FBRXhCLGtCQUFZO0FBRlksTUFBekI7QUFJQTtBQUNELElBdEJEO0FBd0JBLEdBN0JGO0FBK0JBLFVBQVEsSUFBUixDQUFhLE1BQWI7QUFDQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssUUFBUSxNQUF6QixFQUFpQyxJQUFJLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzdDLGlCQUFjLFFBQVEsQ0FBUixDQUFkO0FBQ0E7O0FBRUQ7QUFDQSxpQ0FBbUIsTUFBTSxFQUF6QixJQUFpQyxZQUFNOztBQUV0QyxTQUFNLFVBQU4sR0FBbUIsSUFBbkI7QUFDQSxTQUFNLFFBQU4sR0FBaUIsbUJBQVMsY0FBVCxRQUE2QixNQUFNLEVBQW5DLENBQWpCOztBQUVBLE9BQUksUUFBUSxzQkFBWSxlQUFaLEVBQTZCLEtBQTdCLENBQVo7QUFDQSxnQkFBYSxhQUFiLENBQTJCLEtBQTNCOztBQUVBO0FBQ0EsT0FBSSxNQUFNLGFBQU4sQ0FBb0IsTUFBeEIsRUFBZ0M7QUFDL0IsU0FBSyxJQUFJLEtBQUksQ0FBUixFQUFXLE1BQUssTUFBTSxhQUFOLENBQW9CLE1BQXpDLEVBQWlELEtBQUksR0FBckQsRUFBeUQsSUFBekQsRUFBOEQ7O0FBRTdELFNBQUksWUFBWSxNQUFNLGFBQU4sQ0FBb0IsRUFBcEIsQ0FBaEI7O0FBRUEsU0FBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDN0IsVUFDQyxXQUFXLFVBQVUsUUFEdEI7QUFBQSxVQUVDLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBRnZEOztBQUtBLG9CQUFZLE9BQVosRUFBdUIsVUFBVSxLQUFqQztBQUNBLE1BUEQsTUFPTyxJQUFJLFVBQVUsSUFBVixLQUFtQixNQUF2QixFQUErQjtBQUNyQyxZQUFNLFVBQVUsVUFBaEI7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxHQTFCRDs7QUE0QkEsaUNBQW1CLE1BQU0sRUFBekIsSUFBaUMsVUFBQyxTQUFELEVBQVksT0FBWixFQUF3Qjs7QUFFeEQsT0FBSSxRQUFRLHNCQUFZLFNBQVosRUFBdUIsS0FBdkIsQ0FBWjtBQUNBLFNBQU0sT0FBTixHQUFnQixXQUFXLEVBQTNCOztBQUVBO0FBQ0EsU0FBTSxZQUFOLENBQW1CLGFBQW5CLENBQWlDLEtBQWpDO0FBQ0EsR0FQRDs7QUFTQTtBQUNBLFFBQU0sWUFBTixHQUFxQixtQkFBUyxhQUFULENBQXVCLEtBQXZCLENBQXJCOztBQUVBLE1BQ0MsV0FBVyxDQUFDLENBQUMsYUFBYSxZQUFiLENBQTBCLFVBQTFCLENBRGQ7QUFBQSxNQUVDLFlBQVksVUFBUSxNQUFNLEVBQWQsZ0JBQWdDLFFBQWhDLENBRmI7QUFBQSxNQUdDLFVBQVUsYUFBYSxZQUFiLEtBQThCLElBQTlCLElBQXNDLGFBQWEsWUFBYixDQUEwQixPQUExQixDQUFrQyxXQUFsQyxPQUFvRCxPQUhyRztBQUFBLE1BSUMsY0FBZSxPQUFELEdBQVksYUFBYSxZQUFiLENBQTBCLE1BQXRDLEdBQStDLENBSjlEO0FBQUEsTUFLQyxhQUFjLE9BQUQsR0FBWSxhQUFhLFlBQWIsQ0FBMEIsS0FBdEMsR0FBOEMsQ0FMNUQ7O0FBT0EsTUFBSSxNQUFNLE9BQU4sQ0FBYyxxQkFBZCxLQUF3QyxJQUE1QyxFQUFrRDtBQUNqRCxhQUFVLElBQVYsd0JBQW9DLE1BQU0sT0FBTixDQUFjLDhCQUFsRDtBQUNBLGFBQVUsSUFBVix1QkFBbUMsTUFBTSxPQUFOLENBQWMsbUJBQWpEO0FBQ0E7O0FBRUQsZUFBYSxXQUFiLENBQXlCLE1BQU0sWUFBL0I7O0FBRUEsTUFBSSxXQUFXLGFBQWEsWUFBYixLQUE4QixJQUE3QyxFQUFtRDtBQUNsRCxnQkFBYSxZQUFiLENBQTBCLEtBQTFCLENBQWdDLE9BQWhDLEdBQTBDLE1BQTFDO0FBQ0E7O0FBRUQsTUFBSSxXQUFXLEVBQWY7O0FBRUEsd0JBQVc7QUFDVixPQUFJLHFCQUFxQixtQkFBUyxhQUFULENBQXVCLEtBQXZCLENBQXpCO0FBQ0EsU0FBTSxZQUFOLENBQW1CLFdBQW5CLENBQStCLGtCQUEvQjs7QUFFQSxjQUFXLENBQ1Ysc0RBRFUsRUFFViwyRUFGVSxhQUdELE1BQU0sRUFITCxvQkFJQSxVQUpBLHFCQUtDLFdBTEQsT0FBWDs7QUFRQSxPQUFJLENBQUMsT0FBTCxFQUFjO0FBQ2IsYUFBUyxJQUFULENBQWMsa0RBQWQ7QUFDQTs7QUFFRCxzQkFBbUIsU0FBbkIsR0FBK0IsYUFBVyxTQUFTLElBQVQsQ0FBYyxHQUFkLENBQVgsMENBQ0EsTUFBTSxPQUFOLENBQWMsVUFEZCxHQUMyQixNQUFNLE9BQU4sQ0FBYyxRQUR6QyxXQUN1RCxJQUFJLElBQUosRUFEdkQsa0RBRUksVUFBVSxJQUFWLENBQWUsT0FBZixDQUZKLHNRQVF0QixlQUFLLENBQUwsQ0FBTyxvQkFBUCxDQVJzQiwwQkFBL0I7QUFXQSxHQTNCRCxNQTJCTzs7QUFFTixjQUFXLFlBQ0QsTUFBTSxFQURMLHFCQUVDLE1BQU0sRUFGUCxRQUdWLGFBSFUsRUFJVixjQUpVLEVBS1YsZ0JBTFUsRUFNVixtQkFOVSxFQU9WLHFCQVBVLEVBUVYsNEJBUlUsRUFTVix3QkFUVSxFQVVWLHNDQVZVLEVBV1Ysc0RBWFUsWUFZRixNQUFNLE9BQU4sQ0FBYyxVQVpaLEdBWXlCLE1BQU0sT0FBTixDQUFjLFFBWnZDLHdCQWFJLFVBQVUsSUFBVixDQUFlLEdBQWYsQ0FiSixvQkFjQSxVQWRBLHFCQWVDLFdBZkQsT0FBWDs7QUFrQkEsT0FBSSxDQUFDLE9BQUwsRUFBYztBQUNiLGFBQVMsSUFBVCxDQUFjLGtEQUFkO0FBQ0E7O0FBRUQsU0FBTSxZQUFOLENBQW1CLFNBQW5CLGVBQXlDLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FBekM7QUFDQTs7QUFFRCxRQUFNLFNBQU4sR0FBa0IsTUFBTSxZQUFOLENBQW1CLFNBQXJDOztBQUVBLFFBQU0sSUFBTixHQUFhLFlBQU07QUFDbEIsT0FBSSxPQUFKLEVBQWE7QUFDWixVQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsUUFBdEIsR0FBaUMsVUFBakM7QUFDQSxVQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsS0FBdEIsR0FBOEIsS0FBOUI7QUFDQSxVQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsR0FBK0IsS0FBL0I7QUFDQSxRQUFJO0FBQ0gsV0FBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLEdBQTZCLGdCQUE3QjtBQUNBLEtBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVSxDQUNYO0FBQ0Q7QUFDRCxHQVZEO0FBV0EsUUFBTSxJQUFOLEdBQWEsWUFBTTtBQUNsQixPQUFJLE9BQUosRUFBYTtBQUNaLFVBQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixRQUF0QixHQUFpQyxFQUFqQztBQUNBLFVBQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixLQUF0QixHQUE4QixFQUE5QjtBQUNBLFVBQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixNQUF0QixHQUErQixFQUEvQjtBQUNBLFFBQUk7QUFDSCxXQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsR0FBNkIsRUFBN0I7QUFDQSxLQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FDWDtBQUNEO0FBQ0QsR0FWRDtBQVdBLFFBQU0sT0FBTixHQUFnQixVQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQ2xDLFNBQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixLQUF0QixHQUE4QixRQUFRLElBQXRDO0FBQ0EsU0FBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLE1BQXRCLEdBQStCLFNBQVMsSUFBeEM7O0FBRUEsT0FBSSxNQUFNLFFBQU4sS0FBbUIsSUFBdkIsRUFBNkI7QUFDNUIsVUFBTSxRQUFOLENBQWUsWUFBZixDQUE0QixLQUE1QixFQUFtQyxNQUFuQztBQUNBO0FBQ0QsR0FQRDs7QUFVQSxNQUFJLGNBQWMsV0FBVyxNQUFYLEdBQW9CLENBQXRDLEVBQXlDO0FBQ3hDLFFBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxXQUFXLE1BQTVCLEVBQW9DLElBQUksRUFBeEMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDaEQsUUFBSSxtQkFBUyxTQUFULENBQW1CLFFBQVEsTUFBM0IsRUFBbUMsV0FBbkMsQ0FBK0MsV0FBVyxDQUFYLEVBQWMsSUFBN0QsQ0FBSixFQUF3RTtBQUN2RSxXQUFNLE1BQU4sQ0FBYSxXQUFXLENBQVgsRUFBYyxHQUEzQjtBQUNBLFdBQU0sSUFBTjtBQUNBO0FBQ0E7QUFDRDtBQUNEOztBQUVELFNBQU8sS0FBUDtBQUNBO0FBbFNnQyxDQUFsQzs7QUFxU0EsSUFBTSxXQUFXLGVBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsQ0FBQyxFQUFELEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBekMsQ0FBakI7O0FBRUEsSUFBSSxRQUFKLEVBQWM7O0FBRWI7Ozs7QUFJQSxtQkFBVyxJQUFYLENBQWdCLFVBQUMsR0FBRCxFQUFTOztBQUV4QixRQUFNLElBQUksV0FBSixFQUFOOztBQUVBLE1BQUksSUFBSSxVQUFKLENBQWUsTUFBZixDQUFKLEVBQTRCO0FBQzNCLE9BQUksSUFBSSxRQUFKLENBQWEsTUFBYixDQUFKLEVBQTBCO0FBQ3pCLFdBQU8sWUFBUDtBQUNBLElBRkQsTUFFTztBQUNOLFdBQU8sWUFBUDtBQUNBO0FBQ0QsR0FORCxNQU1PLElBQUksSUFBSSxRQUFKLENBQWEsTUFBYixLQUF3QixJQUFJLFFBQUosQ0FBYSxNQUFiLENBQTVCLEVBQWtEO0FBQ3hELFVBQU8sV0FBUDtBQUNBLEdBRk0sTUFFQSxJQUFJLHVCQUFZLCtCQUFaLElBQW9DLElBQUksUUFBSixDQUFhLE9BQWIsQ0FBeEMsRUFBK0Q7QUFDckUsVUFBTyx1QkFBUDtBQUNBLEdBRk0sTUFFQSxJQUFJLHVCQUFZLElBQUksUUFBSixDQUFhLE1BQWIsQ0FBaEIsRUFBc0M7QUFDNUMsVUFBTyxzQkFBUDtBQUNBLEdBRk0sTUFFQTtBQUNOLFVBQU8sSUFBUDtBQUNBO0FBQ0QsRUFuQkQ7O0FBcUJBO0FBQ0EsS0FBTSxpQ0FBaUM7QUFDdEMsUUFBTSxhQURnQzs7QUFHdEMsV0FBUztBQUNSLFdBQVEsYUFEQTtBQUVSLGFBQVUsOEJBRkY7QUFHUiwwQkFBdUIsS0FIZjtBQUlSO0FBQ0EsbUNBQWdDLE9BTHhCO0FBTVI7QUFDQSx3QkFBcUI7QUFQYixHQUg2QjtBQVl0Qzs7Ozs7O0FBTUEsZUFBYSxxQkFBQyxJQUFEO0FBQUEsVUFBVSxZQUFZLENBQUMsV0FBRCxFQUFjLFdBQWQsRUFBMkIsWUFBM0IsRUFBeUMsWUFBekMsRUFBdUQsVUFBdkQsRUFBbUUsV0FBbkUsRUFBZ0YsUUFBaEYsQ0FBeUYsSUFBekYsQ0FBdEI7QUFBQSxHQWxCeUI7O0FBb0J0QyxVQUFRLDBCQUEwQjs7QUFwQkksRUFBdkM7QUF1QkEsb0JBQVMsR0FBVCxDQUFhLDhCQUFiOztBQUVBO0FBQ0EsS0FBTSxvQ0FBb0M7QUFDekMsUUFBTSxXQURtQzs7QUFHekMsV0FBUztBQUNSLFdBQVEsV0FEQTtBQUVSLGFBQVU7QUFGRixHQUhnQztBQU96Qzs7Ozs7O0FBTUEsZUFBYSxxQkFBQyxJQUFEO0FBQUEsVUFBVSx1QkFBWSxRQUFaLElBQXdCLENBQUMsdUJBQUQsRUFBMEIsbUJBQTFCLEVBQStDLGVBQS9DLEVBQWdFLFdBQWhFLEVBQzlDLFdBRDhDLEVBQ2pDLFFBRGlDLENBQ3hCLEtBQUssV0FBTCxFQUR3QixDQUFsQztBQUFBLEdBYjRCOztBQWdCekMsVUFBUSwwQkFBMEI7QUFoQk8sRUFBMUM7QUFrQkEsb0JBQVMsR0FBVCxDQUFhLGlDQUFiOztBQUVBO0FBQ0EsS0FBTSxzQ0FBc0M7QUFDM0MsUUFBTSxZQURxQzs7QUFHM0MsV0FBUztBQUNSLFdBQVEsWUFEQTtBQUVSLGFBQVU7QUFGRixHQUhrQztBQU8zQzs7Ozs7O0FBTUEsZUFBYSxxQkFBQyxJQUFEO0FBQUEsVUFBVSx1QkFBWSxRQUFaLElBQXdCLENBQUMsc0JBQUQsRUFBeUIsUUFBekIsQ0FBa0MsSUFBbEMsQ0FBbEM7QUFBQSxHQWI4Qjs7QUFlM0MsVUFBUSwwQkFBMEI7QUFmUyxFQUE1QztBQWlCQSxvQkFBUyxHQUFULENBQWEsbUNBQWI7O0FBRUE7QUFDQSxLQUFNLGlDQUFpQztBQUN0QyxRQUFNLGFBRGdDOztBQUd0QyxXQUFTO0FBQ1IsV0FBUSxhQURBO0FBRVIsYUFBVTtBQUZGLEdBSDZCO0FBT3RDOzs7Ozs7QUFNQSxlQUFhLHFCQUFDLElBQUQ7QUFBQSxVQUFVLFlBQVksQ0FBQyxXQUFELEVBQWMsUUFBZCxDQUF1QixJQUF2QixDQUF0QjtBQUFBLEdBYnlCOztBQWV0QyxVQUFRLDBCQUEwQjtBQWZJLEVBQXZDO0FBaUJBLG9CQUFTLEdBQVQsQ0FBYSw4QkFBYjs7QUFFQTtBQUNBLEtBQUksb0NBQW9DO0FBQ3ZDLFFBQU0saUJBRGlDOztBQUd2QyxXQUFTO0FBQ1IsV0FBUSxpQkFEQTtBQUVSLGFBQVU7QUFGRixHQUg4QjtBQU92Qzs7Ozs7O0FBTUEsZUFBYSxxQkFBQyxJQUFEO0FBQUEsVUFBVSxZQUFZLENBQUMsV0FBRCxFQUFjLFdBQWQsRUFBMkIsV0FBM0IsRUFBd0MsUUFBeEMsQ0FBaUQsSUFBakQsQ0FBdEI7QUFBQSxHQWIwQjs7QUFldkMsVUFBUSwwQkFBMEI7QUFmSyxFQUF4QztBQWlCQSxvQkFBUyxHQUFULENBQWEsaUNBQWI7QUFDQTs7O0FDN2hCRDs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7O0FBVUEsSUFBTSxZQUFZO0FBQ2pCOzs7QUFHQSxpQkFBZ0IsS0FKQztBQUtqQjs7O0FBR0EsZ0JBQWUsS0FSRTtBQVNqQjs7O0FBR0EsZ0JBQWUsRUFaRTs7QUFjakI7Ozs7QUFJQSxrQkFBaUIseUJBQUMsUUFBRCxFQUFjO0FBQzlCLE1BQUksVUFBVSxRQUFkLEVBQXdCO0FBQ3ZCLGFBQVUsY0FBVixDQUF5QixRQUF6QjtBQUNBLEdBRkQsTUFFTztBQUNOLGFBQVUsVUFBVixDQUFxQixRQUFyQjtBQUNBLGFBQVUsYUFBVixDQUF3QixJQUF4QixDQUE2QixRQUE3QjtBQUNBO0FBQ0QsRUF6QmdCOztBQTJCakI7Ozs7O0FBS0EsYUFBWSxvQkFBQyxRQUFELEVBQWM7QUFDekIsTUFBSSxDQUFDLFVBQVUsY0FBZixFQUErQjs7QUFFOUIsT0FBSSxPQUFPLEtBQVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDakMsY0FBVSxjQUFWLENBQXlCLFFBQXpCO0FBQ0EsSUFGRCxNQUVPO0FBQUE7O0FBRU4sY0FBUyxPQUFULENBQWlCLElBQWpCLEdBQXdCLE9BQU8sU0FBUyxPQUFULENBQWlCLElBQXhCLEtBQWlDLFFBQWpDLEdBQ3ZCLFNBQVMsT0FBVCxDQUFpQixJQURNLEdBQ0MsMERBRHpCOztBQUdBLFNBQ0MsU0FBUyxtQkFBUyxhQUFULENBQXVCLFFBQXZCLENBRFY7QUFBQSxTQUVDLGlCQUFpQixtQkFBUyxvQkFBVCxDQUE4QixRQUE5QixFQUF3QyxDQUF4QyxDQUZsQjtBQUFBLFNBR0MsT0FBTyxLQUhSOztBQUtBLFlBQU8sR0FBUCxHQUFhLFNBQVMsT0FBVCxDQUFpQixJQUE5Qjs7QUFFQTtBQUNBLFlBQU8sTUFBUCxHQUFnQixPQUFPLGtCQUFQLEdBQTRCLFlBQVc7QUFDdEQsVUFBSSxDQUFDLElBQUQsS0FBVSxDQUFDLEtBQUssVUFBTixJQUFvQixLQUFLLFVBQUwsS0FBb0IsU0FBeEMsSUFDYixLQUFLLFVBQUwsS0FBb0IsUUFEUCxJQUNtQixLQUFLLFVBQUwsS0FBb0IsVUFEakQsQ0FBSixFQUNrRTtBQUNqRSxjQUFPLElBQVA7QUFDQSxpQkFBVSxVQUFWO0FBQ0EsY0FBTyxNQUFQLEdBQWdCLE9BQU8sa0JBQVAsR0FBNEIsSUFBNUM7QUFDQTtBQUNELE1BUEQ7O0FBU0Esb0JBQWUsVUFBZixDQUEwQixZQUExQixDQUF1QyxNQUF2QyxFQUErQyxjQUEvQztBQXRCTTtBQXVCTjtBQUNELGFBQVUsY0FBVixHQUEyQixJQUEzQjtBQUNBO0FBQ0QsRUEvRGdCOztBQWlFakI7Ozs7QUFJQSxhQUFZLHNCQUFNO0FBQ2pCLFlBQVUsUUFBVixHQUFxQixJQUFyQjtBQUNBLFlBQVUsYUFBVixHQUEwQixJQUExQjs7QUFFQSxTQUFPLFVBQVUsYUFBVixDQUF3QixNQUF4QixHQUFpQyxDQUF4QyxFQUEyQztBQUMxQyxPQUFJLFdBQVcsVUFBVSxhQUFWLENBQXdCLEdBQXhCLEVBQWY7QUFDQSxhQUFVLGNBQVYsQ0FBeUIsUUFBekI7QUFDQTtBQUNELEVBN0VnQjs7QUErRWpCOzs7OztBQUtBLGlCQUFnQix3QkFBQyxRQUFELEVBQWM7QUFDN0IsTUFBSSxTQUFTLE1BQU0sWUFBTixDQUFtQixTQUFTLE9BQTVCLENBQWI7QUFDQSxpQ0FBbUIsU0FBUyxFQUE1QixFQUFrQyxNQUFsQztBQUNBO0FBdkZnQixDQUFsQjs7QUEwRkEsSUFBTSxvQkFBb0I7QUFDekIsT0FBTSxZQURtQjs7QUFHekIsVUFBUztBQUNSLFVBQVEsWUFEQTtBQUVSOzs7Ozs7QUFNQSxPQUFLO0FBQ0o7QUFDQSxTQUFNLDBEQUZGO0FBR0osU0FBTSxJQUhGO0FBSUosaUJBQWMsS0FKVjtBQUtKLHNCQUFtQixJQUxmO0FBTUoscUJBQWtCLFNBTmQ7QUFPSixXQUFRLEtBUEo7QUFRSixhQUFVLElBUk47QUFTSix3QkFBcUIsSUFBSSxFQVRyQjtBQVVKLDZCQUEwQixJQVZ0QjtBQVdKLGlDQUE4QixHQVgxQjtBQVlKLGlCQUFjLEtBWlY7QUFhSixhQUFVLE9BYk4sRUFhZ0I7QUFDcEIsbUJBQWdCLFFBZFo7QUFlSixpQkFBYyxNQWZWO0FBZ0JKLHVCQUFvQixLQWhCaEI7QUFpQkosc0JBQW1CO0FBakJmO0FBUkcsRUFIZ0I7QUErQnpCOzs7Ozs7QUFNQSxjQUFhLHFCQUFDLElBQUQ7QUFBQSxTQUFVLHNCQUFXLENBQUMsYUFBRCxFQUFnQixXQUFoQixFQUE2QixRQUE3QixDQUFzQyxJQUF0QyxDQUFyQjtBQUFBLEVBckNZOztBQXVDekI7Ozs7Ozs7O0FBUUEsU0FBUSxnQkFBQyxZQUFELEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUF1Qzs7QUFFOUMsTUFDQyxPQUFPLElBRFI7QUFBQSxNQUVDLGVBQWUsYUFBYSxZQUY3QjtBQUFBLE1BR0MsS0FBUSxhQUFhLEVBQXJCLFNBQTJCLFFBQVEsTUFIcEM7QUFBQSxNQUlDLGtCQUpEO0FBQUEsTUFLQyxRQUFRLEVBTFQ7QUFBQSxNQU1DLFVBTkQ7QUFBQSxNQU9DLFdBUEQ7O0FBVUEsU0FBTyxhQUFhLFNBQWIsQ0FBdUIsSUFBdkIsQ0FBUDtBQUNBLFlBQVUsT0FBTyxNQUFQLENBQWMsT0FBZCxFQUF1QixhQUFhLE9BQXBDLENBQVY7O0FBRUE7QUFDQSxNQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsTUFFQyx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsUUFBRCxFQUFjO0FBQ3BDLE9BQU0sZUFBYSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsV0FBekIsRUFBYixHQUFzRCxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FBNUQ7O0FBRUEsZ0JBQVcsT0FBWCxJQUF3QjtBQUFBLFdBQU0sY0FBYyxJQUFkLEdBQXNCLEtBQUssUUFBTCxDQUF0QixHQUF1QyxJQUE3QztBQUFBLElBQXhCOztBQUVBLGdCQUFXLE9BQVgsSUFBd0IsVUFBQyxLQUFELEVBQVc7QUFDbEMsUUFBSSxjQUFjLElBQWxCLEVBQXdCO0FBQ3ZCLFVBQUssUUFBTCxJQUFpQixLQUFqQjs7QUFFQSxTQUFJLGFBQWEsS0FBakIsRUFBd0I7QUFDdkIsZ0JBQVUsa0JBQVY7QUFDQSxnQkFBVSxrQkFBVixDQUE2QixJQUE3QjtBQUNBLGdCQUFVLElBQVY7QUFDQTtBQUNELEtBUkQsTUFRTztBQUNOO0FBQ0EsV0FBTSxJQUFOLENBQVcsRUFBQyxNQUFNLEtBQVAsRUFBYyxVQUFVLFFBQXhCLEVBQWtDLE9BQU8sS0FBekMsRUFBWDtBQUNBO0FBQ0QsSUFiRDtBQWVBLEdBdEJGOztBQXlCQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzNDLHdCQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDQTs7QUFFRDtBQUNBLG1CQUFPLGNBQWMsRUFBckIsSUFBMkIsVUFBQyxVQUFELEVBQWdCOztBQUUxQyxnQkFBYSxTQUFiLEdBQXlCLFlBQVksVUFBckM7O0FBRUE7QUFDQSxPQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNqQixTQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDOztBQUUzQyxTQUFJLFlBQVksTUFBTSxDQUFOLENBQWhCOztBQUVBLFNBQUksVUFBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzdCLFVBQ0MsV0FBVyxVQUFVLFFBRHRCO0FBQUEsVUFFQyxlQUFhLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixXQUF6QixFQUFiLEdBQXNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixDQUZ2RDs7QUFLQSxtQkFBVyxPQUFYLEVBQXNCLFVBQVUsS0FBaEM7QUFDQSxNQVBELE1BT08sSUFBSSxVQUFVLElBQVYsS0FBbUIsTUFBdkIsRUFBK0I7QUFDckMsV0FBSyxVQUFVLFVBQWY7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQSxPQUNDLFNBQVMsZUFBSyxVQUFMLENBQWdCLE1BRDFCO0FBQUEsT0FFQyxlQUFlLFNBQWYsWUFBZSxDQUFDLFNBQUQsRUFBZTs7QUFFN0IsUUFBSSxjQUFjLGdCQUFsQixFQUFvQzs7QUFFbkMsZUFBVSxrQkFBVjtBQUNBLGVBQVUsa0JBQVYsQ0FBNkIsSUFBN0I7QUFDQSxlQUFVLElBQVY7QUFDQTs7QUFFRCxTQUFLLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLFVBQUMsQ0FBRCxFQUFPO0FBQ3ZDLFNBQUksUUFBUSxtQkFBUyxXQUFULENBQXFCLFlBQXJCLENBQVo7QUFDQSxXQUFNLFNBQU4sQ0FBZ0IsRUFBRSxJQUFsQixFQUF3QixFQUFFLE9BQTFCLEVBQW1DLEVBQUUsVUFBckM7QUFDQTtBQUNBO0FBQ0Esa0JBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLEtBTkQ7QUFRQSxJQW5CRjs7QUFzQkEsWUFBUyxPQUFPLE1BQVAsQ0FBYyxDQUFDLE9BQUQsRUFBVSxXQUFWLEVBQXVCLFVBQXZCLENBQWQsQ0FBVDs7QUFFQSxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssT0FBTyxNQUF4QixFQUFnQyxJQUFJLEVBQXBDLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzVDLGlCQUFhLE9BQU8sQ0FBUCxDQUFiO0FBQ0E7QUFDRCxHQW5ERDs7QUFxREEsTUFBSSxjQUFjLFdBQVcsTUFBWCxHQUFvQixDQUF0QyxFQUF5QztBQUN4QyxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssV0FBVyxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQ2hELFFBQUksbUJBQVMsU0FBVCxDQUFtQixRQUFRLE1BQTNCLEVBQW1DLFdBQW5DLENBQStDLFdBQVcsQ0FBWCxFQUFjLElBQTdELENBQUosRUFBd0U7QUFDdkUsVUFBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLFdBQVcsQ0FBWCxFQUFjLEdBQXZDO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsT0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEVBQXhCOztBQUVBLGVBQWEsVUFBYixDQUF3QixZQUF4QixDQUFxQyxJQUFyQyxFQUEyQyxZQUEzQztBQUNBLGVBQWEsZUFBYixDQUE2QixVQUE3QjtBQUNBLGVBQWEsS0FBYixDQUFtQixPQUFuQixHQUE2QixNQUE3Qjs7QUFFQTtBQUNBLFVBQVEsR0FBUixDQUFZLElBQVosR0FBbUIsS0FBbkI7QUFDQSxVQUFRLEdBQVIsQ0FBWSxHQUFaLEdBQWtCLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFsQjs7QUFFQSxZQUFVLGVBQVYsQ0FBMEI7QUFDekIsWUFBUyxRQUFRLEdBRFE7QUFFekIsT0FBSTtBQUZxQixHQUExQjs7QUFLQTtBQUNBLE9BQUssT0FBTCxHQUFlLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDakMsUUFBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixRQUFRLElBQTNCO0FBQ0EsUUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFTLElBQTdCO0FBQ0EsVUFBTyxJQUFQO0FBQ0EsR0FKRDs7QUFNQSxPQUFLLElBQUwsR0FBWSxZQUFNO0FBQ2pCLFFBQUssS0FBTDtBQUNBLFFBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsTUFBckI7QUFDQSxVQUFPLElBQVA7QUFDQSxHQUpEOztBQU1BLE9BQUssSUFBTCxHQUFZLFlBQU07QUFDakIsUUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixFQUFyQjtBQUNBLFVBQU8sSUFBUDtBQUNBLEdBSEQ7O0FBS0EsT0FBSyxPQUFMLEdBQWUsWUFBTTtBQUNwQixhQUFVLE9BQVY7QUFDQSxHQUZEOztBQUlBLE1BQUksUUFBUSxzQkFBWSxlQUFaLEVBQTZCLElBQTdCLENBQVo7QUFDQSxlQUFhLGFBQWIsQ0FBMkIsS0FBM0I7O0FBRUEsU0FBTyxJQUFQO0FBQ0E7QUFwTXdCLENBQTFCOztBQXVNQTs7OztBQUlBLGtCQUFXLElBQVgsQ0FBZ0IsVUFBQyxHQUFELEVBQVM7QUFDeEIsT0FBTSxJQUFJLFdBQUosRUFBTjtBQUNBLFFBQU8sSUFBSSxRQUFKLENBQWEsTUFBYixJQUF1QixXQUF2QixHQUFxQyxJQUE1QztBQUNBLENBSEQ7O0FBS0EsbUJBQVMsR0FBVCxDQUFhLGlCQUFiOzs7QUM5VEE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7O0FBU0EsSUFBTSxZQUFZO0FBQ2pCOzs7QUFHQSxpQkFBZ0IsS0FKQztBQUtqQjs7O0FBR0EsZ0JBQWUsS0FSRTtBQVNqQjs7O0FBR0EsZ0JBQWUsRUFaRTs7QUFjakI7Ozs7O0FBS0Esa0JBQWlCLHlCQUFDLFFBQUQsRUFBYztBQUM5QixNQUFJLFVBQVUsUUFBZCxFQUF3QjtBQUN2QixhQUFVLGNBQVYsQ0FBeUIsUUFBekI7QUFDQSxHQUZELE1BRU87QUFDTixhQUFVLFVBQVYsQ0FBcUIsUUFBckI7QUFDQSxhQUFVLGFBQVYsQ0FBd0IsSUFBeEIsQ0FBNkIsUUFBN0I7QUFDQTtBQUNELEVBMUJnQjs7QUE0QmpCOzs7OztBQUtBLGFBQVksb0JBQUMsUUFBRCxFQUFjO0FBQ3pCLE1BQUksQ0FBQyxVQUFVLGNBQWYsRUFBK0I7O0FBRTlCLE9BQUksT0FBTyxHQUFQLEtBQWUsV0FBbkIsRUFBZ0M7QUFDL0IsY0FBVSxjQUFWLENBQXlCLFFBQXpCO0FBQ0EsSUFGRCxNQUVPO0FBQUE7O0FBRU4sY0FBUyxPQUFULENBQWlCLElBQWpCLEdBQXdCLE9BQU8sU0FBUyxPQUFULENBQWlCLElBQXhCLEtBQWlDLFFBQWpDLEdBQ3ZCLFNBQVMsT0FBVCxDQUFpQixJQURNLEdBQ0MsNkNBRHpCOztBQUdBLFNBQ0MsU0FBUyxtQkFBUyxhQUFULENBQXVCLFFBQXZCLENBRFY7QUFBQSxTQUVDLGlCQUFpQixtQkFBUyxvQkFBVCxDQUE4QixRQUE5QixFQUF3QyxDQUF4QyxDQUZsQjtBQUFBLFNBR0MsT0FBTyxLQUhSOztBQUtBLFlBQU8sR0FBUCxHQUFhLFNBQVMsT0FBVCxDQUFpQixJQUE5Qjs7QUFFQTtBQUNBLFlBQU8sTUFBUCxHQUFnQixPQUFPLGtCQUFQLEdBQTRCLFlBQVc7QUFDdEQsVUFBSSxDQUFDLElBQUQsS0FBVSxDQUFDLEtBQUssVUFBTixJQUFvQixLQUFLLFVBQUwsS0FBb0IsU0FBeEMsSUFDYixLQUFLLFVBQUwsS0FBb0IsUUFEUCxJQUNtQixLQUFLLFVBQUwsS0FBb0IsVUFEakQsQ0FBSixFQUNrRTtBQUNqRSxjQUFPLElBQVA7QUFDQSxpQkFBVSxVQUFWO0FBQ0EsY0FBTyxNQUFQLEdBQWdCLE9BQU8sa0JBQVAsR0FBNEIsSUFBNUM7QUFDQTtBQUNELE1BUEQ7O0FBU0Esb0JBQWUsVUFBZixDQUEwQixZQUExQixDQUF1QyxNQUF2QyxFQUErQyxjQUEvQztBQXRCTTtBQXVCTjtBQUNELGFBQVUsY0FBVixHQUEyQixJQUEzQjtBQUNBO0FBQ0QsRUFoRWdCOztBQWtFakI7Ozs7QUFJQSxhQUFZLHNCQUFNO0FBQ2pCLFlBQVUsUUFBVixHQUFxQixJQUFyQjtBQUNBLFlBQVUsYUFBVixHQUEwQixJQUExQjs7QUFFQSxTQUFPLFVBQVUsYUFBVixDQUF3QixNQUF4QixHQUFpQyxDQUF4QyxFQUEyQztBQUMxQyxPQUFJLFdBQVcsVUFBVSxhQUFWLENBQXdCLEdBQXhCLEVBQWY7QUFDQSxhQUFVLGNBQVYsQ0FBeUIsUUFBekI7QUFDQTtBQUNELEVBOUVnQjs7QUFnRmpCOzs7Ozs7QUFNQSxpQkFBZ0Isd0JBQUMsUUFBRCxFQUFjO0FBQzdCLE1BQUksU0FBUyxJQUFJLEdBQUosQ0FBUSxTQUFTLE9BQWpCLENBQWI7QUFDQSxtQkFBTyxjQUFjLFNBQVMsRUFBOUIsRUFBa0MsTUFBbEM7QUFDQSxTQUFPLE1BQVA7QUFDQTtBQTFGZ0IsQ0FBbEI7O0FBNkZBLElBQU0sb0JBQW9CO0FBQ3pCLE9BQU0sWUFEbUI7O0FBR3pCLFVBQVM7QUFDUixVQUFRLFlBREE7QUFFUjs7Ozs7O0FBTUEsT0FBSztBQUNKO0FBQ0EsU0FBTSw2Q0FGRjtBQUdKLGtCQUFlLElBSFg7QUFJSixrQkFBZSxDQUFDLENBSlo7QUFLSix5QkFBc0IsS0FMbEI7QUFNSixVQUFPLEtBTkg7QUFPSixvQkFBaUIsRUFQYjtBQVFKLHVCQUFvQixHQVJoQjtBQVNKLGtCQUFlLEtBQUssSUFBTCxHQUFZLElBVHZCO0FBVUosa0JBQWUsR0FWWDtBQVdKLGdCQUFhLENBWFQ7QUFZSiwwQkFBdUIsSUFabkI7QUFhSiwyQkFBd0IsR0FicEI7QUFjSiwwQkFBdUIsQ0FkbkI7QUFlSixnQ0FBNkIsRUFmekI7QUFnQkosaUJBQWMsSUFoQlY7QUFpQkosc0JBQW1CLElBakJmO0FBa0JKLDJCQUF3QixLQWxCcEI7QUFtQkosNEJBQXlCLENBbkJyQjtBQW9CSiw4QkFBMkIsR0FwQnZCO0FBcUJKLG1DQUFnQyxLQXJCNUI7QUFzQkosd0JBQXFCLEtBdEJqQjtBQXVCSix5QkFBc0IsQ0F2QmxCO0FBd0JKLDJCQUF3QixHQXhCcEI7QUF5QkosZ0NBQTZCLEtBekJ6QjtBQTBCSix1QkFBb0IsS0ExQmhCO0FBMkJKLHdCQUFxQixDQTNCakI7QUE0QkosMEJBQXVCLEdBNUJuQjtBQTZCSiwrQkFBNEIsS0E3QnhCO0FBOEJKLHFCQUFrQixLQTlCZDtBQStCSix3QkFBcUIsQ0EvQmpCO0FBZ0NKLHlCQUFzQixJQWhDbEI7QUFpQ0osMkJBQXdCLElBakNwQjtBQWtDSixpQ0FBOEIsSUFsQzFCO0FBbUNKLG9CQUFpQixHQW5DYjtBQW9DSixvQkFBaUIsR0FwQ2I7QUFxQ0osbUJBQWdCLEdBckNaO0FBc0NKLG1CQUFnQixJQXRDWjtBQXVDSiwyQkFBd0IsTUF2Q3BCO0FBd0NKLHVCQUFvQixHQXhDaEI7QUF5Q0oseUJBQXNCO0FBekNsQjtBQVJHLEVBSGdCO0FBdUR6Qjs7Ozs7O0FBTUEsY0FBYSxxQkFBQyxJQUFEO0FBQUEsU0FBVSxzQkFBVyxDQUFDLHVCQUFELEVBQTBCLG1CQUExQixFQUErQyxlQUEvQyxFQUFnRSxXQUFoRSxFQUNqQyxXQURpQyxFQUNwQixRQURvQixDQUNYLEtBQUssV0FBTCxFQURXLENBQXJCO0FBQUEsRUE3RFk7O0FBZ0V6Qjs7Ozs7Ozs7QUFRQSxTQUFRLGdCQUFDLFlBQUQsRUFBZSxPQUFmLEVBQXdCLFVBQXhCLEVBQXVDOztBQUU5QyxNQUNDLE9BQU8sSUFEUjtBQUFBLE1BRUMsZUFBZSxhQUFhLFlBRjdCO0FBQUEsTUFHQyxLQUFLLGFBQWEsRUFBYixHQUFrQixHQUFsQixHQUF3QixRQUFRLE1BSHRDO0FBQUEsTUFJQyxrQkFKRDtBQUFBLE1BS0MsUUFBUSxFQUxUO0FBQUEsTUFNQyxVQU5EO0FBQUEsTUFPQyxXQVBEOztBQVVBLFNBQU8sYUFBYSxTQUFiLENBQXVCLElBQXZCLENBQVA7QUFDQSxZQUFVLE9BQU8sTUFBUCxDQUFjLE9BQWQsRUFBdUIsYUFBYSxPQUFwQyxDQUFWOztBQUVBO0FBQ0EsTUFDQyxRQUFRLGVBQUssVUFBTCxDQUFnQixVQUR6QjtBQUFBLE1BRUMsdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFDLFFBQUQsRUFBYztBQUNwQyxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLGdCQUFXLE9BQVgsSUFBd0I7QUFBQSxXQUFNLGNBQWMsSUFBZCxHQUFzQixLQUFLLFFBQUwsQ0FBdEIsR0FBdUMsSUFBN0M7QUFBQSxJQUF4Qjs7QUFFQSxnQkFBVyxPQUFYLElBQXdCLFVBQUMsS0FBRCxFQUFXO0FBQ2xDLFFBQUksY0FBYyxJQUFsQixFQUF3QjtBQUN2QixVQUFLLFFBQUwsSUFBaUIsS0FBakI7O0FBRUEsU0FBSSxhQUFhLEtBQWpCLEVBQXdCOztBQUV2QixnQkFBVSxPQUFWO0FBQ0Esa0JBQVksSUFBWjtBQUNBLGtCQUFZLFVBQVUsY0FBVixDQUF5QjtBQUNwQyxnQkFBUyxRQUFRLEdBRG1CO0FBRXBDLFdBQUk7QUFGZ0MsT0FBekIsQ0FBWjs7QUFLQSxnQkFBVSxXQUFWLENBQXNCLElBQXRCO0FBQ0EsZ0JBQVUsRUFBVixDQUFhLElBQUksTUFBSixDQUFXLGNBQXhCLEVBQXdDLFlBQU07QUFDN0MsaUJBQVUsVUFBVixDQUFxQixLQUFyQjtBQUNBLE9BRkQ7QUFHQTtBQUNELEtBakJELE1BaUJPO0FBQ047QUFDQSxXQUFNLElBQU4sQ0FBVyxFQUFDLE1BQU0sS0FBUCxFQUFjLFVBQVUsUUFBeEIsRUFBa0MsT0FBTyxLQUF6QyxFQUFYO0FBQ0E7QUFDRCxJQXRCRDtBQXdCQSxHQS9CRjs7QUFrQ0EsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLE1BQU0sTUFBdkIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMzQyx3QkFBcUIsTUFBTSxDQUFOLENBQXJCO0FBQ0E7O0FBRUQ7QUFDQSxtQkFBTyxjQUFjLEVBQXJCLElBQTJCLFVBQUMsVUFBRCxFQUFnQjs7QUFFMUMsZ0JBQWEsU0FBYixHQUF5QixZQUFZLFVBQXJDOztBQUVBO0FBQ0EsT0FBSSxNQUFNLE1BQVYsRUFBa0I7QUFDakIsU0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLE1BQU0sTUFBdkIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxHQUF2QyxFQUE0Qzs7QUFFM0MsU0FBSSxZQUFZLE1BQU0sQ0FBTixDQUFoQjs7QUFFQSxTQUFJLFVBQVUsSUFBVixLQUFtQixLQUF2QixFQUE4QjtBQUM3QixVQUFJLFdBQVcsVUFBVSxRQUF6QjtBQUFBLFVBQ0MsZUFBYSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsV0FBekIsRUFBYixHQUFzRCxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FEdkQ7O0FBR0EsbUJBQVcsT0FBWCxFQUFzQixVQUFVLEtBQWhDO0FBQ0EsTUFMRCxNQUtPLElBQUksVUFBVSxJQUFWLEtBQW1CLE1BQXZCLEVBQStCO0FBQ3JDLFdBQUssVUFBVSxVQUFmO0FBQ0E7QUFDRDtBQUNEOztBQUVEO0FBQ0EsT0FDQyxTQUFTLGVBQUssVUFBTCxDQUFnQixNQUQxQjtBQUFBLE9BQ2tDLFlBQVksSUFBSSxNQURsRDtBQUFBLE9BRUMsZUFBZSxTQUFmLFlBQWUsQ0FBQyxTQUFELEVBQWU7O0FBRTdCLFFBQUksY0FBYyxnQkFBbEIsRUFBb0M7QUFBQTs7QUFFbkMsZ0JBQVUsV0FBVjs7QUFFQSxVQUFJLE1BQU0sS0FBSyxHQUFmOztBQUVBLGdCQUFVLFdBQVYsQ0FBc0IsSUFBdEI7QUFDQSxnQkFBVSxFQUFWLENBQWEsVUFBVSxjQUF2QixFQUF1QyxZQUFNO0FBQzVDLGlCQUFVLFVBQVYsQ0FBcUIsR0FBckI7QUFDQSxPQUZEO0FBUG1DO0FBVW5DOztBQUVELFNBQUssZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsVUFBQyxDQUFELEVBQU87QUFDdkM7QUFDQSxTQUFJLFFBQVEsbUJBQVMsV0FBVCxDQUFxQixZQUFyQixDQUFaO0FBQ0EsV0FBTSxTQUFOLENBQWdCLEVBQUUsSUFBbEIsRUFBd0IsRUFBRSxPQUExQixFQUFtQyxFQUFFLFVBQXJDO0FBQ0E7QUFDQTs7QUFFQSxrQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsS0FSRDtBQVVBLElBMUJGOztBQTZCQSxZQUFTLE9BQU8sTUFBUCxDQUFjLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUIsVUFBdkIsQ0FBZCxDQUFUOztBQUVBLFFBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxPQUFPLE1BQXhCLEVBQWdDLElBQUksRUFBcEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDNUMsaUJBQWEsT0FBTyxDQUFQLENBQWI7QUFDQTs7QUFFRDs7Ozs7Ozs7OztBQVVBLE9BQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQVUsQ0FBVixFQUFhLElBQWIsRUFBbUI7QUFDMUMsUUFBSSxRQUFRLHNCQUFZLENBQVosRUFBZSxJQUFmLENBQVo7QUFDQSxVQUFNLElBQU4sR0FBYSxJQUFiO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjs7QUFFQSxRQUFJLE1BQU0sVUFBVixFQUFzQjtBQUNyQixhQUFRLEtBQVIsQ0FBYyxDQUFkLEVBQWlCLElBQWpCOztBQUVBO0FBQ0EsU0FBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDZixnQkFBVSxPQUFWO0FBQ0EsTUFGRCxNQUVPO0FBQ04sY0FBUSxLQUFLLElBQWI7QUFDQyxZQUFLLFlBQUw7QUFDQyxrQkFBVSxpQkFBVjtBQUNBOztBQUVELFlBQUssY0FBTDtBQUNDLGtCQUFVLFNBQVY7QUFDQTs7QUFQRjtBQVVBO0FBQ0Q7QUFDRCxJQXhCRDs7QUEwQkEsUUFBSyxJQUFJLFNBQVQsSUFBc0IsU0FBdEIsRUFBaUM7QUFDaEMsUUFBSSxVQUFVLGNBQVYsQ0FBeUIsU0FBekIsQ0FBSixFQUF5QztBQUN4QyxlQUFVLEVBQVYsQ0FBYSxVQUFVLFNBQVYsQ0FBYixFQUFtQyxlQUFuQztBQUNBO0FBQ0Q7QUFDRCxHQWxHRDs7QUFvR0EsTUFBSSxjQUFjLFdBQVcsTUFBWCxHQUFvQixDQUF0QyxFQUF5QztBQUN4QyxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssV0FBVyxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQ2hELFFBQUksbUJBQVMsU0FBVCxDQUFtQixRQUFRLE1BQTNCLEVBQW1DLFdBQW5DLENBQStDLFdBQVcsQ0FBWCxFQUFjLElBQTdELENBQUosRUFBd0U7QUFDdkUsVUFBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLFdBQVcsQ0FBWCxFQUFjLEdBQXZDO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsT0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEVBQXhCOztBQUVBLGVBQWEsVUFBYixDQUF3QixZQUF4QixDQUFxQyxJQUFyQyxFQUEyQyxZQUEzQztBQUNBLGVBQWEsZUFBYixDQUE2QixVQUE3QjtBQUNBLGVBQWEsS0FBYixDQUFtQixPQUFuQixHQUE2QixNQUE3Qjs7QUFFQSxZQUFVLGVBQVYsQ0FBMEI7QUFDekIsWUFBUyxRQUFRLEdBRFE7QUFFekIsT0FBSTtBQUZxQixHQUExQjs7QUFLQTtBQUNBLE9BQUssT0FBTCxHQUFlLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDakMsUUFBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixRQUFRLElBQTNCO0FBQ0EsUUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFTLElBQTdCOztBQUVBLFVBQU8sSUFBUDtBQUNBLEdBTEQ7O0FBT0EsT0FBSyxJQUFMLEdBQVksWUFBTTtBQUNqQixRQUFLLEtBQUw7QUFDQSxRQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLE1BQXJCO0FBQ0EsVUFBTyxJQUFQO0FBQ0EsR0FKRDs7QUFNQSxPQUFLLElBQUwsR0FBWSxZQUFNO0FBQ2pCLFFBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsRUFBckI7QUFDQSxVQUFPLElBQVA7QUFDQSxHQUhEOztBQUtBLE9BQUssT0FBTCxHQUFlLFlBQU07QUFDcEIsYUFBVSxPQUFWO0FBQ0EsR0FGRDs7QUFJQSxNQUFJLFFBQVEsc0JBQVksZUFBWixFQUE2QixJQUE3QixDQUFaO0FBQ0EsZUFBYSxhQUFiLENBQTJCLEtBQTNCOztBQUVBLFNBQU8sSUFBUDtBQUNBO0FBbFJ3QixDQUExQjs7QUFxUkE7Ozs7QUFJQSxrQkFBVyxJQUFYLENBQWdCLFVBQUMsR0FBRCxFQUFTO0FBQ3hCLE9BQU0sSUFBSSxXQUFKLEVBQU47QUFDQSxRQUFPLElBQUksUUFBSixDQUFhLE9BQWIsSUFBd0IsdUJBQXhCLEdBQWtELElBQXpEO0FBQ0EsQ0FIRDs7QUFLQSxtQkFBUyxHQUFULENBQWEsaUJBQWI7OztBQzlZQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7OztBQUtBLElBQU0sbUJBQW1COztBQUV4QixPQUFNLE9BRmtCOztBQUl4QixVQUFTO0FBQ1IsVUFBUTtBQURBLEVBSmU7O0FBUXhCOzs7Ozs7QUFNQSxjQUFhLHFCQUFDLElBQUQsRUFBVTs7QUFFdEIsTUFBSSxlQUFlLG1CQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBbkI7O0FBRUE7QUFDQSxNQUFLLHlCQUFjLEtBQUssS0FBTCxDQUFXLGNBQVgsTUFBK0IsSUFBOUMsSUFDRixDQUFDLHVCQUFELEVBQTBCLG1CQUExQixFQUErQyxlQUEvQyxFQUFnRSxXQUFoRSxFQUNBLFdBREEsRUFDYSxRQURiLENBQ3NCLEtBQUssV0FBTCxFQUR0QixtQ0FERixFQUVxRTtBQUNwRSxVQUFPLEtBQVA7QUFDQSxHQUpELE1BSU8sSUFBSSxhQUFhLFdBQWpCLEVBQThCO0FBQ3BDLFVBQU8sYUFBYSxXQUFiLENBQXlCLElBQXpCLEVBQStCLE9BQS9CLENBQXVDLElBQXZDLEVBQTZDLEVBQTdDLENBQVA7QUFDQSxHQUZNLE1BRUE7QUFDTixVQUFPLEVBQVA7QUFDQTtBQUNELEVBNUJ1QjtBQTZCeEI7Ozs7Ozs7O0FBUUEsU0FBUSxnQkFBQyxZQUFELEVBQWUsT0FBZixFQUF3QixVQUF4QixFQUF1Qzs7QUFFOUMsTUFDQyxPQUFPLElBRFI7QUFBQSxNQUVDLEtBQUssYUFBYSxFQUFiLEdBQWtCLEdBQWxCLEdBQXdCLFFBQVEsTUFGdEM7QUFBQSxNQUdDLFVBSEQ7QUFBQSxNQUlDLFdBSkQ7O0FBT0E7QUFDQSxNQUFJLGFBQWEsWUFBYixLQUE4QixTQUE5QixJQUEyQyxhQUFhLFlBQWIsS0FBOEIsSUFBN0UsRUFBbUY7QUFDbEYsVUFBTyxtQkFBUyxhQUFULENBQXVCLE9BQXZCLENBQVA7QUFDQSxnQkFBYSxXQUFiLENBQXlCLElBQXpCO0FBRUEsR0FKRCxNQUlPO0FBQ04sVUFBTyxhQUFhLFlBQXBCO0FBQ0E7O0FBRUQsT0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEVBQXhCOztBQUVBO0FBQ0EsTUFDQyxRQUFRLGVBQUssVUFBTCxDQUFnQixVQUR6QjtBQUFBLE1BRUMsdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFDLFFBQUQsRUFBYztBQUNwQyxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLGdCQUFXLE9BQVgsSUFBd0I7QUFBQSxXQUFNLEtBQUssUUFBTCxDQUFOO0FBQUEsSUFBeEI7O0FBRUEsZ0JBQVcsT0FBWCxJQUF3QixVQUFDLEtBQUQsRUFBVztBQUNsQyxTQUFLLFFBQUwsSUFBaUIsS0FBakI7QUFDQSxJQUZEO0FBR0EsR0FWRjs7QUFhQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssTUFBTSxNQUF2QixFQUErQixJQUFJLEVBQW5DLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzNDLHdCQUFxQixNQUFNLENBQU4sQ0FBckI7QUFDQTs7QUFFRCxNQUNDLFNBQVMsZUFBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLE1BQXZCLENBQThCLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUIsVUFBdkIsQ0FBOUIsQ0FEVjtBQUFBLE1BRUMsZUFBZSxTQUFmLFlBQWUsQ0FBQyxTQUFELEVBQWU7O0FBRTdCLFFBQUssZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsVUFBQyxDQUFELEVBQU87QUFDdkM7O0FBRUEsUUFBSSxRQUFRLG1CQUFTLFdBQVQsQ0FBcUIsWUFBckIsQ0FBWjtBQUNBLFVBQU0sU0FBTixDQUFnQixFQUFFLElBQWxCLEVBQXdCLEVBQUUsT0FBMUIsRUFBbUMsRUFBRSxVQUFyQztBQUNBO0FBQ0E7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFSRDtBQVVBLEdBZEY7O0FBaUJBLE9BQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxPQUFPLE1BQXhCLEVBQWdDLElBQUksRUFBcEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDNUMsZ0JBQWEsT0FBTyxDQUFQLENBQWI7QUFDQTs7QUFFRDtBQUNBLE9BQUssT0FBTCxHQUFlLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFDakMsUUFBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixRQUFRLElBQTNCO0FBQ0EsUUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixTQUFTLElBQTdCOztBQUVBLFVBQU8sSUFBUDtBQUNBLEdBTEQ7O0FBT0EsT0FBSyxJQUFMLEdBQVksWUFBTTtBQUNqQixRQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLE1BQXJCOztBQUVBLFVBQU8sSUFBUDtBQUNBLEdBSkQ7O0FBTUEsT0FBSyxJQUFMLEdBQVksWUFBTTtBQUNqQixRQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLEVBQXJCOztBQUVBLFVBQU8sSUFBUDtBQUNBLEdBSkQ7O0FBTUEsTUFBSSxjQUFjLFdBQVcsTUFBWCxHQUFvQixDQUF0QyxFQUF5QztBQUN4QyxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssV0FBVyxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQ2hELFFBQUksbUJBQVMsU0FBVCxDQUFtQixRQUFRLE1BQTNCLEVBQW1DLFdBQW5DLENBQStDLFdBQVcsQ0FBWCxFQUFjLElBQTdELENBQUosRUFBd0U7QUFDdkUsVUFBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLFdBQVcsQ0FBWCxFQUFjLEdBQXZDO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsTUFBSSxRQUFRLHNCQUFZLGVBQVosRUFBNkIsSUFBN0IsQ0FBWjtBQUNBLGVBQWEsYUFBYixDQUEyQixLQUEzQjs7QUFFQSxTQUFPLElBQVA7QUFDQTtBQWpJdUIsQ0FBekI7O0FBb0lBLGlCQUFPLGdCQUFQLEdBQTBCLGVBQUssZ0JBQUwsR0FBd0IsZ0JBQWxEOztBQUVBLG1CQUFTLEdBQVQsQ0FBYSxnQkFBYjs7O0FDcEpBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7OztBQU1BLElBQU0sZ0JBQWdCO0FBQ3JCOzs7QUFHQSxlQUFjLEtBSk87QUFLckI7OztBQUdBLGNBQWEsS0FSUTtBQVNyQjs7O0FBR0EsY0FBYSxFQVpROztBQWNyQjs7Ozs7QUFLQSxnQkFBZSx1QkFBQyxRQUFELEVBQWM7O0FBRTVCLE1BQUksY0FBYyxRQUFsQixFQUE0QjtBQUMzQixpQkFBYyxZQUFkLENBQTJCLFFBQTNCO0FBQ0EsR0FGRCxNQUVPO0FBQ04saUJBQWMsYUFBZDtBQUNBLGlCQUFjLFdBQWQsQ0FBMEIsSUFBMUIsQ0FBK0IsUUFBL0I7QUFDQTtBQUNELEVBM0JvQjs7QUE2QnJCOzs7O0FBSUEsZ0JBQWUseUJBQU07QUFDcEIsTUFBSSxDQUFDLGNBQWMsWUFBbkIsRUFBaUM7QUFBQTs7QUFFaEMsUUFBSSxPQUFPLG1CQUFTLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEtBQTRDLG1CQUFTLGVBQWhFO0FBQUEsUUFDQyxTQUFTLG1CQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FEVjtBQUFBLFFBRUMsT0FBTyxLQUZSOztBQUlBLFdBQU8sR0FBUCxHQUFhLGtDQUFiOztBQUVBO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLE9BQU8sa0JBQVAsR0FBNEIsWUFBTTtBQUNqRCxTQUFJLENBQUMsSUFBRCxLQUFVLENBQUMsY0FBYyxVQUFmLElBQTZCLGNBQWMsVUFBZCxLQUE2QixRQUExRCxJQUFzRSxjQUFjLFVBQWQsS0FBNkIsVUFBN0csQ0FBSixFQUE4SDtBQUM3SCxhQUFPLElBQVA7QUFDQSxvQkFBYyxRQUFkOztBQUVBO0FBQ0EsYUFBTyxNQUFQLEdBQWdCLE9BQU8sa0JBQVAsR0FBNEIsSUFBNUM7QUFDQSxVQUFJLFFBQVEsT0FBTyxVQUFuQixFQUErQjtBQUM5QixZQUFLLFdBQUwsQ0FBaUIsTUFBakI7QUFDQTtBQUNEO0FBQ0QsS0FYRDtBQVlBLFNBQUssV0FBTCxDQUFpQixNQUFqQjtBQUNBLGtCQUFjLFlBQWQsR0FBNkIsSUFBN0I7QUF0QmdDO0FBdUJoQztBQUNELEVBMURvQjs7QUE0RHJCOzs7O0FBSUEsV0FBVSxvQkFBTTtBQUNmLGdCQUFjLFFBQWQsR0FBeUIsSUFBekI7QUFDQSxnQkFBYyxXQUFkLEdBQTRCLElBQTVCOztBQUVBLFNBQU8sY0FBYyxXQUFkLENBQTBCLE1BQTFCLEdBQW1DLENBQTFDLEVBQTZDO0FBQzVDLE9BQUksV0FBVyxjQUFjLFdBQWQsQ0FBMEIsR0FBMUIsRUFBZjtBQUNBLGlCQUFjLFlBQWQsQ0FBMkIsUUFBM0I7QUFDQTtBQUNELEVBeEVvQjs7QUEwRXJCOzs7OztBQUtBLGVBQWMsc0JBQUMsUUFBRCxFQUFjO0FBQzNCLE1BQUksU0FBUyxHQUFHLE1BQUgsQ0FBVSxTQUFTLE1BQW5CLENBQWI7QUFDQSxtQkFBTyxjQUFjLFNBQVMsRUFBOUIsRUFBa0MsTUFBbEM7QUFDQTtBQWxGb0IsQ0FBdEI7O0FBcUZBLElBQU0sMkJBQTJCO0FBQ2hDLE9BQU0sbUJBRDBCOztBQUdoQyxVQUFTO0FBQ1IsVUFBUTtBQURBLEVBSHVCOztBQU9oQzs7Ozs7O0FBTUEsY0FBYSxxQkFBQyxJQUFEO0FBQUEsU0FBVSxDQUFDLGtCQUFELEVBQXFCLG9CQUFyQixFQUEyQyxRQUEzQyxDQUFvRCxJQUFwRCxDQUFWO0FBQUEsRUFibUI7O0FBZWhDOzs7Ozs7OztBQVFBLFNBQVEsZ0JBQUMsWUFBRCxFQUFlLE9BQWYsRUFBd0IsVUFBeEIsRUFBdUM7O0FBRTlDLE1BQUksS0FBSyxFQUFUOztBQUVBO0FBQ0EsS0FBRyxPQUFILEdBQWEsT0FBYjtBQUNBLEtBQUcsRUFBSCxHQUFRLGFBQWEsRUFBYixHQUFrQixHQUFsQixHQUF3QixRQUFRLE1BQXhDO0FBQ0EsS0FBRyxZQUFILEdBQWtCLFlBQWxCOztBQUVBO0FBQ0EsTUFDQyxXQUFXLEVBRFo7QUFBQSxNQUVDLGdCQUFnQixLQUZqQjtBQUFBLE1BR0MsV0FBVyxJQUhaO0FBQUEsTUFJQyxXQUFXLElBSlo7QUFBQSxNQUtDLGNBQWMsQ0FMZjtBQUFBLE1BTUMsV0FBVyxDQU5aO0FBQUEsTUFPQyxlQUFlLENBUGhCO0FBQUEsTUFRQyxTQUFTLElBUlY7QUFBQSxNQVNDLFNBQVMsQ0FUVjtBQUFBLE1BVUMsUUFBUSxLQVZUO0FBQUEsTUFXQyxRQUFRLEtBWFQ7QUFBQSxNQVlDLFVBWkQ7QUFBQSxNQWFDLFdBYkQ7O0FBZ0JBO0FBQ0EsTUFDQyxRQUFRLGVBQUssVUFBTCxDQUFnQixVQUR6QjtBQUFBLE1BRUMsdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFDLFFBQUQsRUFBYzs7QUFFcEM7O0FBRUEsT0FBTSxlQUFhLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixXQUF6QixFQUFiLEdBQXNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixDQUE1RDs7QUFFQSxjQUFTLE9BQVQsSUFBc0IsWUFBTTtBQUMzQixRQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFDdEIsU0FBSSxRQUFRLElBQVo7O0FBRUE7QUFDQSxhQUFRLFFBQVI7QUFDQyxXQUFLLGFBQUw7QUFDQyxjQUFPLFdBQVA7O0FBRUQsV0FBSyxVQUFMO0FBQ0MsY0FBTyxRQUFQOztBQUVELFdBQUssUUFBTDtBQUNDLGNBQU8sTUFBUDs7QUFFRCxXQUFLLFFBQUw7QUFDQyxjQUFPLE1BQVA7O0FBRUQsV0FBSyxPQUFMO0FBQ0MsY0FBTyxLQUFQOztBQUVELFdBQUssT0FBTDtBQUNDLGNBQU8sS0FBUCxDQWpCRixDQWlCZ0I7O0FBRWYsV0FBSyxVQUFMO0FBQ0MsY0FBTztBQUNOLGVBQU8saUJBQU07QUFDWixnQkFBTyxDQUFQO0FBQ0EsU0FISztBQUlOLGFBQUssZUFBTTtBQUNWLGdCQUFPLGVBQWUsUUFBdEI7QUFDQSxTQU5LO0FBT04sZ0JBQVE7QUFQRixRQUFQO0FBU0QsV0FBSyxLQUFMO0FBQ0MsY0FBUSxRQUFELEdBQWEsU0FBUyxHQUF0QixHQUE0QixFQUFuQztBQTlCRjs7QUFpQ0EsWUFBTyxLQUFQO0FBQ0EsS0F0Q0QsTUFzQ087QUFDTixZQUFPLElBQVA7QUFDQTtBQUNELElBMUNEOztBQTRDQSxjQUFTLE9BQVQsSUFBc0IsVUFBQyxLQUFELEVBQVc7O0FBRWhDLFFBQUksYUFBYSxJQUFqQixFQUF1Qjs7QUFFdEI7QUFDQSxhQUFRLFFBQVI7O0FBRUMsV0FBSyxLQUFMO0FBQ0MsV0FBSSxNQUFNLE9BQU8sS0FBUCxLQUFpQixRQUFqQixHQUE0QixLQUE1QixHQUFvQyxNQUFNLENBQU4sRUFBUyxHQUF2RDs7QUFFQSxnQkFBUyxJQUFULENBQWMsR0FBZDtBQUNBOztBQUVELFdBQUssYUFBTDtBQUNDLGdCQUFTLE1BQVQsQ0FBZ0IsUUFBUSxJQUF4QjtBQUNBOztBQUVELFdBQUssT0FBTDtBQUNDLFdBQUksS0FBSixFQUFXO0FBQ1YsaUJBQVMsU0FBVCxDQUFtQixDQUFuQixFQURVLENBQ2E7QUFDdkIsUUFGRCxNQUVPO0FBQ04saUJBQVMsU0FBVCxDQUFtQixDQUFuQixFQURNLENBQ2lCO0FBQ3ZCO0FBQ0Qsa0JBQVcsWUFBTTtBQUNoQixZQUFJLFFBQVEsc0JBQVksY0FBWixFQUE0QixFQUE1QixDQUFaO0FBQ0EscUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLFFBSEQsRUFHRyxFQUhIO0FBSUE7O0FBRUQsV0FBSyxRQUFMO0FBQ0MsZ0JBQVMsU0FBVCxDQUFtQixLQUFuQjtBQUNBLGtCQUFXLFlBQU07QUFDaEIsWUFBSSxRQUFRLHNCQUFZLGNBQVosRUFBNEIsRUFBNUIsQ0FBWjtBQUNBLHFCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxRQUhELEVBR0csRUFISDtBQUlBOztBQUVEO0FBQ0MsZUFBUSxHQUFSLENBQVksUUFBUSxHQUFHLEVBQXZCLEVBQTJCLFFBQTNCLEVBQXFDLHNCQUFyQztBQWpDRjtBQW9DQSxLQXZDRCxNQXVDTztBQUNOO0FBQ0EsY0FBUyxJQUFULENBQWMsRUFBQyxNQUFNLEtBQVAsRUFBYyxVQUFVLFFBQXhCLEVBQWtDLE9BQU8sS0FBekMsRUFBZDtBQUNBO0FBQ0QsSUE3Q0Q7QUErQ0EsR0FuR0Y7O0FBc0dBLE9BQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxNQUFNLE1BQXZCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsR0FBdkMsRUFBNEM7QUFDM0Msd0JBQXFCLE1BQU0sQ0FBTixDQUFyQjtBQUNBOztBQUVEO0FBQ0EsTUFDQyxVQUFVLGVBQUssVUFBTCxDQUFnQixPQUQzQjtBQUFBLE1BRUMsZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsVUFBRCxFQUFnQjs7QUFFL0I7QUFDQSxNQUFHLFVBQUgsSUFBaUIsWUFBTTs7QUFFdEIsUUFBSSxhQUFhLElBQWpCLEVBQXVCOztBQUV0QjtBQUNBLGFBQVEsVUFBUjtBQUNDLFdBQUssTUFBTDtBQUNDLGNBQU8sU0FBUyxJQUFULEVBQVA7QUFDRCxXQUFLLE9BQUw7QUFDQyxjQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0QsV0FBSyxNQUFMO0FBQ0MsY0FBTyxJQUFQOztBQU5GO0FBVUEsS0FiRCxNQWFPO0FBQ04sY0FBUyxJQUFULENBQWMsRUFBQyxNQUFNLE1BQVAsRUFBZSxZQUFZLFVBQTNCLEVBQWQ7QUFDQTtBQUNELElBbEJEO0FBb0JBLEdBekJGOztBQTRCQSxPQUFLLElBQUksQ0FBSixFQUFPLEtBQUssUUFBUSxNQUF6QixFQUFpQyxJQUFJLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzdDLGlCQUFjLFFBQVEsQ0FBUixDQUFkO0FBQ0E7O0FBRUQ7QUFDQSxtQkFBTyxjQUFjLEdBQUcsRUFBeEIsSUFBOEIsVUFBQyxTQUFELEVBQWU7O0FBRTVDLG1CQUFnQixJQUFoQjtBQUNBLGdCQUFhLFFBQWIsR0FBd0IsV0FBVyxTQUFuQzs7QUFFQTtBQUNBLE9BQUksU0FBUyxNQUFiLEVBQXFCO0FBQ3BCLFNBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxTQUFTLE1BQTFCLEVBQWtDLElBQUksRUFBdEMsRUFBMEMsR0FBMUMsRUFBK0M7O0FBRTlDLFNBQUksWUFBWSxTQUFTLENBQVQsQ0FBaEI7O0FBRUEsU0FBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDN0IsVUFBSSxXQUFXLFVBQVUsUUFBekI7QUFBQSxVQUNDLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBRHZEOztBQUdBLGlCQUFTLE9BQVQsRUFBb0IsVUFBVSxLQUE5QjtBQUNBLE1BTEQsTUFLTyxJQUFJLFVBQVUsSUFBVixLQUFtQixNQUF2QixFQUErQjtBQUNyQyxTQUFHLFVBQVUsVUFBYjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLFlBQVMsSUFBVCxDQUFjLEdBQUcsTUFBSCxDQUFVLE1BQVYsQ0FBaUIsYUFBL0IsRUFBOEMsWUFBTTtBQUNuRCxhQUFTLEtBQVQ7QUFDQSxZQUFRLEtBQVI7O0FBRUEsYUFBUyxXQUFULENBQXFCLFVBQUMsWUFBRCxFQUFrQjtBQUN0QyxtQkFBYyxlQUFlLElBQTdCO0FBQ0EsU0FBSSxRQUFRLHNCQUFZLFlBQVosRUFBMEIsRUFBMUIsQ0FBWjtBQUNBLGtCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxLQUpEO0FBS0EsSUFURDs7QUFXQSxZQUFTLElBQVQsQ0FBYyxHQUFHLE1BQUgsQ0FBVSxNQUFWLENBQWlCLEtBQS9CLEVBQXNDLFlBQU07QUFDM0MsYUFBUyxJQUFUOztBQUVBLFFBQUksUUFBUSxzQkFBWSxPQUFaLEVBQXFCLEVBQXJCLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFMRDtBQU1BLFlBQVMsSUFBVCxDQUFjLEdBQUcsTUFBSCxDQUFVLE1BQVYsQ0FBaUIsSUFBL0IsRUFBcUMsWUFBTTtBQUMxQyxhQUFTLEtBQVQ7QUFDQSxZQUFRLEtBQVI7O0FBRUEsUUFBSSxRQUFRLHNCQUFZLE1BQVosRUFBb0IsRUFBcEIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxJQU5EO0FBT0EsWUFBUyxJQUFULENBQWMsR0FBRyxNQUFILENBQVUsTUFBVixDQUFpQixRQUEvQixFQUF5QyxZQUFNO0FBQzlDLGFBQVMsS0FBVDtBQUNBLFlBQVEsSUFBUjs7QUFFQSxRQUFJLFFBQVEsc0JBQVksT0FBWixFQUFxQixFQUFyQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBTkQ7QUFPQSxZQUFTLElBQVQsQ0FBYyxHQUFHLE1BQUgsQ0FBVSxNQUFWLENBQWlCLEtBQS9CLEVBQXNDLFlBQU07QUFDM0MsYUFBUyxXQUFULENBQXFCLFVBQUMsU0FBRCxFQUFlO0FBQ25DLGdCQUFXLFlBQVksSUFBdkI7O0FBRUEsU0FBSSxRQUFRLHNCQUFZLGdCQUFaLEVBQThCLEVBQTlCLENBQVo7QUFDQSxrQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsS0FMRDtBQU1BLElBUEQ7QUFRQSxZQUFTLElBQVQsQ0FBYyxHQUFHLE1BQUgsQ0FBVSxNQUFWLENBQWlCLGFBQS9CLEVBQThDLFlBQU07QUFDbkQsYUFBUyxXQUFULENBQXFCLFVBQUMsWUFBRCxFQUFrQjtBQUN0QyxTQUFJLFdBQVcsQ0FBZixFQUFrQjtBQUNqQixxQkFBZSxXQUFXLFlBQTFCOztBQUVBLFVBQUksUUFBUSxzQkFBWSxVQUFaLEVBQXdCLEVBQXhCLENBQVo7QUFDQSxtQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0E7QUFDRCxLQVBEO0FBUUEsYUFBUyxXQUFULENBQXFCLFVBQUMsU0FBRCxFQUFlO0FBQ25DLGdCQUFXLFNBQVg7O0FBRUEsU0FBSSxRQUFRLHNCQUFZLGdCQUFaLEVBQThCLEVBQTlCLENBQVo7QUFDQSxrQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsS0FMRDtBQU1BLElBZkQ7O0FBaUJBO0FBQ0EsT0FBSSxhQUFhLENBQUMsZUFBRCxFQUFrQixZQUFsQixFQUFnQyxnQkFBaEMsRUFBa0QsU0FBbEQsQ0FBakI7O0FBRUEsUUFBSyxJQUFJLEtBQUksQ0FBUixFQUFXLE1BQUssV0FBVyxNQUFoQyxFQUF3QyxLQUFJLEdBQTVDLEVBQWdELElBQWhELEVBQXFEO0FBQ3BELFFBQUksUUFBUSxzQkFBWSxXQUFXLEVBQVgsQ0FBWixFQUEyQixFQUEzQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBO0FBQ0QsR0F0RkQ7O0FBd0ZBO0FBQ0EsYUFBVyxtQkFBUyxhQUFULENBQXVCLFFBQXZCLENBQVg7QUFDQSxXQUFTLEVBQVQsR0FBYyxHQUFHLEVBQWpCO0FBQ0EsV0FBUyxLQUFULEdBQWlCLEVBQWpCO0FBQ0EsV0FBUyxNQUFULEdBQWtCLEVBQWxCO0FBQ0EsV0FBUyxXQUFULEdBQXVCLENBQXZCO0FBQ0EsV0FBUyxLQUFULENBQWUsVUFBZixHQUE0QixRQUE1QjtBQUNBLFdBQVMsR0FBVCxHQUFlLFdBQVcsQ0FBWCxFQUFjLEdBQTdCO0FBQ0EsV0FBUyxTQUFULEdBQXFCLElBQXJCOztBQUVBLGVBQWEsV0FBYixDQUF5QixRQUF6QjtBQUNBLGVBQWEsWUFBYixDQUEwQixLQUExQixDQUFnQyxPQUFoQyxHQUEwQyxNQUExQzs7QUFFQSxNQUFJLGFBQWE7QUFDaEIsV0FBUSxRQURRO0FBRWhCLE9BQUksR0FBRztBQUZTLEdBQWpCOztBQUtBLGdCQUFjLGFBQWQsQ0FBNEIsVUFBNUI7O0FBRUEsS0FBRyxPQUFILEdBQWEsVUFBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUMvQjtBQUNBLEdBRkQ7QUFHQSxLQUFHLElBQUgsR0FBVSxZQUFNO0FBQ2YsTUFBRyxLQUFIO0FBQ0EsT0FBSSxRQUFKLEVBQWM7QUFDYixhQUFTLEtBQVQsQ0FBZSxPQUFmLEdBQXlCLE1BQXpCO0FBQ0E7QUFDRCxHQUxEO0FBTUEsS0FBRyxJQUFILEdBQVUsWUFBTTtBQUNmLE9BQUksUUFBSixFQUFjO0FBQ2IsYUFBUyxLQUFULENBQWUsT0FBZixHQUF5QixFQUF6QjtBQUNBO0FBQ0QsR0FKRDtBQUtBLEtBQUcsT0FBSCxHQUFhLFlBQU07QUFDbEIsWUFBUyxPQUFUO0FBQ0EsR0FGRDs7QUFJQSxTQUFPLEVBQVA7QUFDQTtBQTdUK0IsQ0FBakM7O0FBZ1VBOzs7O0FBSUEsa0JBQVcsSUFBWCxDQUFnQixVQUFDLEdBQUQsRUFBUztBQUN4QixPQUFNLElBQUksV0FBSixFQUFOO0FBQ0EsUUFBUSxJQUFJLFFBQUosQ0FBYSxrQkFBYixLQUFvQyxJQUFJLFFBQUosQ0FBYSxvQkFBYixDQUFyQyxHQUEyRSxvQkFBM0UsR0FBa0csSUFBekc7QUFDQSxDQUhEOztBQUtBLG1CQUFTLEdBQVQsQ0FBYSx3QkFBYjs7O0FDN2FBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsSUFBTSxXQUFXOztBQUVoQjs7O0FBR0Esa0JBQWlCLEtBTEQ7QUFNaEI7OztBQUdBLGlCQUFnQixLQVRBO0FBVWhCOzs7QUFHQSxjQUFhLEVBYkc7O0FBZWhCOzs7OztBQUtBLGdCQUFlLHVCQUFDLFFBQUQsRUFBYzs7QUFFNUIsTUFBSSxTQUFTLFFBQWIsRUFBdUI7QUFDdEIsWUFBUyxZQUFULENBQXNCLFFBQXRCO0FBQ0EsR0FGRCxNQUVPO0FBQ04sWUFBUyxhQUFUO0FBQ0EsWUFBUyxXQUFULENBQXFCLElBQXJCLENBQTBCLFFBQTFCO0FBQ0E7QUFDRCxFQTVCZTs7QUE4QmhCOzs7O0FBSUEsZ0JBQWUseUJBQU07O0FBRXBCLE1BQUksQ0FBQyxTQUFTLGVBQWQsRUFBK0I7QUFBQTs7QUFFOUIsUUFDQyxTQUFTLG1CQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FEVjtBQUFBLFFBRUMsaUJBQWlCLG1CQUFTLG9CQUFULENBQThCLFFBQTlCLEVBQXdDLENBQXhDLENBRmxCO0FBQUEsUUFHQyxPQUFPLEtBSFI7O0FBS0EsV0FBTyxHQUFQLEdBQWEsa0NBQWI7O0FBRUE7QUFDQSxXQUFPLE1BQVAsR0FBZ0IsT0FBTyxrQkFBUCxHQUE0QixZQUFNO0FBQ2pELFNBQUksQ0FBQyxJQUFELEtBQVUsQ0FBQyxTQUFTLFVBQVYsSUFBd0IsU0FBUyxVQUFULEtBQXdCLFNBQWhELElBQ2IsU0FBUyxVQUFULEtBQXdCLFFBRFgsSUFDdUIsU0FBUyxVQUFULEtBQXdCLFVBRHpELENBQUosRUFDMEU7QUFDekUsYUFBTyxJQUFQO0FBQ0EsZUFBUyxXQUFUO0FBQ0EsYUFBTyxNQUFQLEdBQWdCLE9BQU8sa0JBQVAsR0FBNEIsSUFBNUM7QUFDQTtBQUNELEtBUEQ7QUFRQSxtQkFBZSxVQUFmLENBQTBCLFlBQTFCLENBQXVDLE1BQXZDLEVBQStDLGNBQS9DO0FBQ0EsYUFBUyxlQUFULEdBQTJCLElBQTNCO0FBbkI4QjtBQW9COUI7QUFDRCxFQXpEZTs7QUEyRGhCOzs7O0FBSUEsY0FBYSx1QkFBTTs7QUFFbEIsV0FBUyxRQUFULEdBQW9CLElBQXBCO0FBQ0EsV0FBUyxjQUFULEdBQTBCLElBQTFCOztBQUVBLFNBQU8sU0FBUyxXQUFULENBQXFCLE1BQXJCLEdBQThCLENBQXJDLEVBQXdDO0FBQ3ZDLE9BQUksV0FBVyxTQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBZjtBQUNBLFlBQVMsWUFBVCxDQUFzQixRQUF0QjtBQUNBO0FBQ0QsRUF4RWU7O0FBMEVoQjs7Ozs7QUFLQSxlQUFjLHNCQUFDLFFBQUQsRUFBYztBQUMzQixNQUFJLFNBQVMsSUFBSSxNQUFNLE1BQVYsQ0FBaUIsU0FBUyxNQUExQixDQUFiO0FBQ0EsbUJBQU8sY0FBYyxTQUFTLEVBQTlCLEVBQWtDLE1BQWxDO0FBQ0EsRUFsRmU7O0FBb0ZoQjs7Ozs7Ozs7O0FBU0EsYUFBWSxvQkFBQyxHQUFELEVBQVM7QUFDcEIsTUFBSSxRQUFRLFNBQVIsSUFBcUIsUUFBUSxJQUFqQyxFQUF1QztBQUN0QyxVQUFPLElBQVA7QUFDQTs7QUFFRCxNQUFJLFFBQVEsSUFBSSxLQUFKLENBQVUsR0FBVixDQUFaOztBQUVBLFFBQU0sTUFBTSxDQUFOLENBQU47O0FBRUEsU0FBTyxTQUFTLElBQUksU0FBSixDQUFjLElBQUksV0FBSixDQUFnQixHQUFoQixJQUF1QixDQUFyQyxDQUFULENBQVA7QUFDQSxFQXZHZTs7QUF5R2hCOzs7Ozs7O0FBT0EsZUFBYyxzQkFBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUNoQyxNQUFJLFFBQVEsc0JBQVksT0FBWixFQUFxQixNQUFyQixDQUFaO0FBQ0EsUUFBTSxPQUFOLEdBQWdCLE1BQU0sSUFBTixHQUFhLElBQWIsR0FBb0IsTUFBTSxPQUExQztBQUNBLGVBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBO0FBcEhlLENBQWpCOztBQXVIQSxJQUFNLHNCQUFzQjs7QUFFM0IsT0FBTSxjQUZxQjs7QUFJM0IsVUFBUztBQUNSLFVBQVE7QUFEQSxFQUprQjtBQU8zQjs7Ozs7O0FBTUEsY0FBYSxxQkFBQyxJQUFEO0FBQUEsU0FBVSxDQUFDLGFBQUQsRUFBZ0IsZUFBaEIsRUFBaUMsUUFBakMsQ0FBMEMsSUFBMUMsQ0FBVjtBQUFBLEVBYmM7O0FBZTNCOzs7Ozs7OztBQVFBLFNBQVEsZ0JBQUMsWUFBRCxFQUFlLE9BQWYsRUFBd0IsVUFBeEIsRUFBdUM7O0FBRTlDO0FBQ0EsTUFDQyxXQUFXLEVBRFo7QUFBQSxNQUVDLGdCQUFnQixLQUZqQjtBQUFBLE1BR0MsUUFBUSxFQUhUO0FBQUEsTUFJQyxjQUFjLElBSmY7QUFBQSxNQUtDLFNBQVMsSUFMVjtBQUFBLE1BTUMsU0FBUyxDQU5WO0FBQUEsTUFPQyxZQUFZLE1BUGI7QUFBQSxNQVFDLGNBQWMsQ0FSZjtBQUFBLE1BU0MsZUFBZSxDQVRoQjtBQUFBLE1BVUMsUUFBUSxLQVZUO0FBQUEsTUFXQyxXQUFXLENBWFo7QUFBQSxNQVlDLE1BQU0sRUFaUDtBQUFBLE1BYUMsVUFiRDtBQUFBLE1BY0MsV0FkRDs7QUFpQkEsUUFBTSxPQUFOLEdBQWdCLE9BQWhCO0FBQ0EsUUFBTSxFQUFOLEdBQVcsYUFBYSxFQUFiLEdBQWtCLEdBQWxCLEdBQXdCLFFBQVEsTUFBM0M7QUFDQSxRQUFNLFlBQU4sR0FBcUIsWUFBckI7O0FBRUE7QUFDQSxNQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsTUFFQyx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsUUFBRCxFQUFjOztBQUVwQyxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLGlCQUFZLE9BQVosSUFBeUIsWUFBTTtBQUM5QixRQUFJLGdCQUFnQixJQUFwQixFQUEwQjtBQUN6QixTQUFJLFFBQVEsSUFBWjs7QUFFQSxhQUFRLFFBQVI7QUFDQyxXQUFLLGFBQUw7QUFDQyxjQUFPLFdBQVA7O0FBRUQsV0FBSyxVQUFMO0FBQ0MsY0FBTyxRQUFQOztBQUVELFdBQUssUUFBTDtBQUNDLGNBQU8sTUFBUDtBQUNELFdBQUssT0FBTDtBQUNDLGNBQU8sV0FBVyxDQUFsQjtBQUNELFdBQUssUUFBTDtBQUNDLGNBQU8sTUFBUDs7QUFFRCxXQUFLLE9BQUw7QUFDQyxjQUFPLEtBQVA7O0FBRUQsV0FBSyxLQUFMO0FBQ0MsbUJBQVksV0FBWixHQUEwQixJQUExQixDQUErQixVQUFDLElBQUQsRUFBVTtBQUN4QyxjQUFNLElBQU47QUFDQSxRQUZEOztBQUlBLGNBQU8sR0FBUDtBQUNELFdBQUssVUFBTDtBQUNDLGNBQU87QUFDTixlQUFPLGlCQUFNO0FBQ1osZ0JBQU8sQ0FBUDtBQUNBLFNBSEs7QUFJTixhQUFLLGVBQU07QUFDVixnQkFBTyxlQUFlLFFBQXRCO0FBQ0EsU0FOSztBQU9OLGdCQUFRO0FBUEYsUUFBUDtBQXhCRjs7QUFtQ0EsWUFBTyxLQUFQO0FBQ0EsS0F2Q0QsTUF1Q087QUFDTixZQUFPLElBQVA7QUFDQTtBQUNELElBM0NEOztBQTZDQSxpQkFBWSxPQUFaLElBQXlCLFVBQUMsS0FBRCxFQUFXOztBQUVuQyxRQUFJLGdCQUFnQixJQUFwQixFQUEwQjs7QUFFekI7QUFDQSxhQUFRLFFBQVI7O0FBRUMsV0FBSyxLQUFMO0FBQ0MsV0FBSSxRQUFNLE9BQU8sS0FBUCxLQUFpQixRQUFqQixHQUE0QixLQUE1QixHQUFvQyxNQUFNLENBQU4sRUFBUyxHQUF2RDtBQUFBLFdBQ0MsVUFBVSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsQ0FEWDs7QUFHQSxtQkFBWSxTQUFaLENBQXNCLE9BQXRCLEVBQStCLElBQS9CLENBQW9DLFlBQU07QUFDekMsWUFBSSxhQUFhLFlBQWIsQ0FBMEIsVUFBMUIsQ0FBSixFQUEyQztBQUMxQyxxQkFBWSxJQUFaO0FBQ0E7QUFFRCxRQUxELEVBS0csT0FMSCxFQUtZLFVBQUMsS0FBRCxFQUFXO0FBQ3RCLGlCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0I7QUFDQSxRQVBEO0FBUUE7O0FBRUQsV0FBSyxhQUFMO0FBQ0MsbUJBQVksY0FBWixDQUEyQixLQUEzQixFQUFrQyxJQUFsQyxDQUF1QyxZQUFNO0FBQzVDLHNCQUFjLEtBQWQ7QUFDQSxtQkFBVyxZQUFNO0FBQ2hCLGFBQUksUUFBUSxzQkFBWSxZQUFaLEVBQTBCLEtBQTFCLENBQVo7QUFDQSxzQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsU0FIRCxFQUdHLEVBSEg7QUFJQSxRQU5ELEVBTUcsT0FOSCxFQU1ZLFVBQUMsS0FBRCxFQUFXO0FBQ3RCLGlCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0I7QUFDQSxRQVJEO0FBU0E7O0FBRUQsV0FBSyxRQUFMO0FBQ0MsbUJBQVksU0FBWixDQUFzQixLQUF0QixFQUE2QixJQUE3QixDQUFrQyxZQUFNO0FBQ3ZDLGlCQUFTLEtBQVQ7QUFDQSxvQkFBWSxNQUFaO0FBQ0EsbUJBQVcsWUFBTTtBQUNoQixhQUFJLFFBQVEsc0JBQVksY0FBWixFQUE0QixLQUE1QixDQUFaO0FBQ0Esc0JBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLFNBSEQsRUFHRyxFQUhIO0FBSUEsUUFQRCxFQU9HLE9BUEgsRUFPWSxVQUFDLEtBQUQsRUFBVztBQUN0QixpQkFBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCO0FBQ0EsUUFURDtBQVVBOztBQUVELFdBQUssTUFBTDtBQUNDLG1CQUFZLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsT0FBM0IsRUFBb0MsVUFBQyxLQUFELEVBQVc7QUFDOUMsaUJBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixLQUE3QjtBQUNBLFFBRkQ7QUFHQTtBQUNELFdBQUssT0FBTDtBQUNDLFdBQUksS0FBSixFQUFXO0FBQ1Ysb0JBQVksU0FBWixDQUFzQixDQUF0QixFQUF5QixJQUF6QixDQUE4QixZQUFNO0FBQ25DLGtCQUFTLENBQVQ7QUFDQSxvQkFBVyxZQUFNO0FBQ2hCLGNBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLEtBQTVCLENBQVo7QUFDQSx1QkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsVUFIRCxFQUdHLEVBSEg7QUFJQSxTQU5ELEVBTUcsT0FOSCxFQU1ZLFVBQUMsS0FBRCxFQUFXO0FBQ3RCLGtCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0I7QUFDQSxTQVJEO0FBU0EsUUFWRCxNQVVPO0FBQ04sb0JBQVksU0FBWixDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxDQUFzQyxZQUFNO0FBQzNDLGtCQUFTLFNBQVQ7QUFDQSxvQkFBVyxZQUFNO0FBQ2hCLGNBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLEtBQTVCLENBQVo7QUFDQSx1QkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsVUFIRCxFQUdHLEVBSEg7QUFJQSxTQU5ELEVBTUcsT0FOSCxFQU1ZLFVBQUMsS0FBRCxFQUFXO0FBQ3RCLGtCQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0I7QUFDQSxTQVJEO0FBU0E7QUFDRDtBQUNEO0FBQ0MsZUFBUSxHQUFSLENBQVksV0FBVyxNQUFNLEVBQTdCLEVBQWlDLFFBQWpDLEVBQTJDLHNCQUEzQztBQXRFRjtBQXlFQSxLQTVFRCxNQTRFTztBQUNOO0FBQ0EsY0FBUyxJQUFULENBQWMsRUFBQyxNQUFNLEtBQVAsRUFBYyxVQUFVLFFBQXhCLEVBQWtDLE9BQU8sS0FBekMsRUFBZDtBQUNBO0FBQ0QsSUFsRkQ7QUFvRkEsR0F2SUY7O0FBMElBLE9BQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxNQUFNLE1BQXZCLEVBQStCLElBQUksRUFBbkMsRUFBdUMsR0FBdkMsRUFBNEM7QUFDM0Msd0JBQXFCLE1BQU0sQ0FBTixDQUFyQjtBQUNBOztBQUVEO0FBQ0EsTUFDQyxVQUFVLGVBQUssVUFBTCxDQUFnQixPQUQzQjtBQUFBLE1BRUMsZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsVUFBRCxFQUFnQjs7QUFFL0I7QUFDQSxTQUFNLFVBQU4sSUFBb0IsWUFBTTs7QUFFekIsUUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7O0FBRXpCO0FBQ0EsYUFBUSxVQUFSO0FBQ0MsV0FBSyxNQUFMO0FBQ0MsY0FBTyxZQUFZLElBQVosRUFBUDtBQUNELFdBQUssT0FBTDtBQUNDLGNBQU8sWUFBWSxLQUFaLEVBQVA7QUFDRCxXQUFLLE1BQUw7QUFDQyxjQUFPLElBQVA7O0FBTkY7QUFVQSxLQWJELE1BYU87QUFDTixjQUFTLElBQVQsQ0FBYyxFQUFDLE1BQU0sTUFBUCxFQUFlLFlBQVksVUFBM0IsRUFBZDtBQUNBO0FBQ0QsSUFsQkQ7QUFvQkEsR0F6QkY7O0FBNEJBLE9BQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxRQUFRLE1BQXpCLEVBQWlDLElBQUksRUFBckMsRUFBeUMsR0FBekMsRUFBOEM7QUFDN0MsaUJBQWMsUUFBUSxDQUFSLENBQWQ7QUFDQTs7QUFFRDtBQUNBLG1CQUFPLGNBQWMsTUFBTSxFQUEzQixJQUFpQyxVQUFDLFlBQUQsRUFBa0I7O0FBRWxELG1CQUFnQixJQUFoQjtBQUNBLGdCQUFhLFdBQWIsR0FBMkIsY0FBYyxZQUF6Qzs7QUFFQTtBQUNBLE9BQUksU0FBUyxNQUFiLEVBQXFCO0FBQ3BCLFNBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxTQUFTLE1BQTFCLEVBQWtDLElBQUksRUFBdEMsRUFBMEMsR0FBMUMsRUFBK0M7O0FBRTlDLFNBQUksWUFBWSxTQUFTLENBQVQsQ0FBaEI7O0FBRUEsU0FBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDN0IsVUFBSSxXQUFXLFVBQVUsUUFBekI7QUFBQSxVQUNDLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBRHZEOztBQUdBLG9CQUFZLE9BQVosRUFBdUIsVUFBVSxLQUFqQztBQUNBLE1BTEQsTUFLTyxJQUFJLFVBQVUsSUFBVixLQUFtQixNQUF2QixFQUErQjtBQUNyQyxZQUFNLFVBQVUsVUFBaEI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsT0FBSSxjQUFjLG1CQUFTLGNBQVQsQ0FBd0IsTUFBTSxFQUE5QixDQUFsQjtBQUFBLE9BQXFELGVBQXJEOztBQUVBO0FBQ0EsWUFBUyxDQUFDLFdBQUQsRUFBYyxVQUFkLENBQVQ7O0FBRUEsT0FBTSxlQUFlLFNBQWYsWUFBZSxDQUFDLENBQUQsRUFBTztBQUMzQixRQUFJLFFBQVEsc0JBQVksRUFBRSxJQUFkLEVBQW9CLEtBQXBCLENBQVo7QUFDQSxpQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsSUFIRDs7QUFLQSxRQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDckIsUUFBSSxZQUFZLE9BQU8sQ0FBUCxDQUFoQjtBQUNBLHVCQUFTLFdBQVQsRUFBc0IsU0FBdEIsRUFBaUMsWUFBakM7QUFDQTs7QUFFRDtBQUNBLGVBQVksRUFBWixDQUFlLFFBQWYsRUFBeUIsWUFBTTs7QUFFOUIsZ0JBQVksV0FBWixHQUEwQixJQUExQixDQUErQixVQUFDLFlBQUQsRUFBa0I7O0FBRWhELGdCQUFXLFlBQVg7O0FBRUEsU0FBSSxXQUFXLENBQWYsRUFBa0I7QUFDakIscUJBQWUsV0FBVyxZQUExQjtBQUNBOztBQUVELFNBQUksUUFBUSxzQkFBWSxnQkFBWixFQUE4QixLQUE5QixDQUFaO0FBQ0Esa0JBQWEsYUFBYixDQUEyQixLQUEzQjtBQUVBLEtBWEQsRUFXRyxPQVhILEVBV1ksVUFBQyxLQUFELEVBQVc7QUFDdEIsY0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCO0FBQ0EsS0FiRDtBQWNBLElBaEJEOztBQWtCQSxlQUFZLEVBQVosQ0FBZSxVQUFmLEVBQTJCLFlBQU07O0FBRWhDLGFBQVMsTUFBTSxZQUFOLENBQW1CLFNBQW5CLEVBQVQ7O0FBRUEsZ0JBQVksV0FBWixHQUEwQixJQUExQixDQUErQixVQUFDLFlBQUQsRUFBa0I7O0FBRWhELGdCQUFXLFlBQVg7O0FBRUEsU0FBSSxXQUFXLENBQWYsRUFBa0I7QUFDakIscUJBQWUsV0FBVyxZQUExQjtBQUNBOztBQUVELFNBQUksUUFBUSxzQkFBWSxVQUFaLEVBQXdCLEtBQXhCLENBQVo7QUFDQSxrQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBRUEsS0FYRCxFQVdHLE9BWEgsRUFXWSxVQUFDLEtBQUQsRUFBVztBQUN0QixjQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0I7QUFDQSxLQWJEO0FBY0EsSUFsQkQ7QUFtQkEsZUFBWSxFQUFaLENBQWUsWUFBZixFQUE2QixZQUFNOztBQUVsQyxhQUFTLE1BQU0sWUFBTixDQUFtQixTQUFuQixFQUFUO0FBQ0EsWUFBUSxLQUFSOztBQUVBLGdCQUFZLGNBQVosR0FBNkIsSUFBN0IsQ0FBa0MsVUFBQyxPQUFELEVBQWE7QUFDOUMsbUJBQWMsT0FBZDtBQUNBLEtBRkQ7O0FBSUEsUUFBSSxRQUFRLHNCQUFZLFlBQVosRUFBMEIsS0FBMUIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFFQSxJQVpEO0FBYUEsZUFBWSxFQUFaLENBQWUsTUFBZixFQUF1QixZQUFNO0FBQzVCLGFBQVMsS0FBVDtBQUNBLFlBQVEsS0FBUjs7QUFFQSxnQkFBWSxJQUFaLEdBQW1CLE9BQW5CLEVBQTRCLFVBQUMsS0FBRCxFQUFXO0FBQ3RDLGNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixLQUE3QjtBQUNBLEtBRkQ7O0FBSUEsUUFBSSxRQUFRLHNCQUFZLE1BQVosRUFBb0IsS0FBcEIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxJQVZEO0FBV0EsZUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixZQUFNO0FBQzdCLGFBQVMsSUFBVDtBQUNBLFlBQVEsS0FBUjs7QUFFQSxnQkFBWSxLQUFaLEdBQW9CLE9BQXBCLEVBQTZCLFVBQUMsS0FBRCxFQUFXO0FBQ3ZDLGNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixLQUE3QjtBQUNBLEtBRkQ7O0FBSUEsUUFBSSxRQUFRLHNCQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQSxJQVZEO0FBV0EsZUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixZQUFNO0FBQzdCLGFBQVMsS0FBVDtBQUNBLFlBQVEsSUFBUjs7QUFFQSxRQUFJLFFBQVEsc0JBQVksT0FBWixFQUFxQixLQUFyQixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLElBTkQ7O0FBUUE7QUFDQSxZQUFTLENBQUMsZUFBRCxFQUFrQixZQUFsQixFQUFnQyxnQkFBaEMsRUFBa0QsU0FBbEQsQ0FBVDs7QUFFQSxRQUFLLElBQUksQ0FBSixFQUFPLEtBQUssT0FBTyxNQUF4QixFQUFnQyxJQUFJLEVBQXBDLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzVDLFFBQUksUUFBUSxzQkFBWSxPQUFPLENBQVAsQ0FBWixFQUF1QixLQUF2QixDQUFaO0FBQ0EsaUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBO0FBQ0QsR0E3SEQ7O0FBK0hBLE1BQ0MsU0FBUyxhQUFhLFlBQWIsQ0FBMEIsTUFEcEM7QUFBQSxNQUVDLFFBQVEsYUFBYSxZQUFiLENBQTBCLEtBRm5DO0FBQUEsTUFHQyxpQkFBaUIsbUJBQVMsYUFBVCxDQUF1QixRQUF2QixDQUhsQjtBQUFBLE1BSUMsY0FBYyw4QkFBOEIsU0FBUyxVQUFULENBQW9CLFdBQVcsQ0FBWCxFQUFjLEdBQWxDLENBSjdDOztBQU9BO0FBQ0EsaUJBQWUsWUFBZixDQUE0QixJQUE1QixFQUFrQyxNQUFNLEVBQXhDO0FBQ0EsaUJBQWUsWUFBZixDQUE0QixPQUE1QixFQUFxQyxLQUFyQztBQUNBLGlCQUFlLFlBQWYsQ0FBNEIsUUFBNUIsRUFBc0MsTUFBdEM7QUFDQSxpQkFBZSxZQUFmLENBQTRCLGFBQTVCLEVBQTJDLEdBQTNDO0FBQ0EsaUJBQWUsWUFBZixDQUE0QixLQUE1QixFQUFtQyxXQUFuQztBQUNBLGlCQUFlLFlBQWYsQ0FBNEIsdUJBQTVCLEVBQXFELEVBQXJEO0FBQ0EsaUJBQWUsWUFBZixDQUE0QixvQkFBNUIsRUFBa0QsRUFBbEQ7QUFDQSxpQkFBZSxZQUFmLENBQTRCLGlCQUE1QixFQUErQyxFQUEvQzs7QUFFQSxlQUFhLFlBQWIsQ0FBMEIsVUFBMUIsQ0FBcUMsWUFBckMsQ0FBa0QsY0FBbEQsRUFBa0UsYUFBYSxZQUEvRTtBQUNBLGVBQWEsWUFBYixDQUEwQixLQUExQixDQUFnQyxPQUFoQyxHQUEwQyxNQUExQzs7QUFFQSxXQUFTLGFBQVQsQ0FBdUI7QUFDdEIsV0FBUSxjQURjO0FBRXRCLE9BQUksTUFBTTtBQUZZLEdBQXZCOztBQUtBLFFBQU0sSUFBTixHQUFhLFlBQU07QUFDbEIsU0FBTSxLQUFOO0FBQ0EsT0FBSSxXQUFKLEVBQWlCO0FBQ2hCLG1CQUFlLEtBQWYsQ0FBcUIsT0FBckIsR0FBK0IsTUFBL0I7QUFDQTtBQUNELEdBTEQ7QUFNQSxRQUFNLE9BQU4sR0FBZ0IsVUFBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUNsQyxrQkFBZSxZQUFmLENBQTRCLE9BQTVCLEVBQXFDLEtBQXJDO0FBQ0Esa0JBQWUsWUFBZixDQUE0QixRQUE1QixFQUFzQyxNQUF0QztBQUNBLEdBSEQ7QUFJQSxRQUFNLElBQU4sR0FBYSxZQUFNO0FBQ2xCLE9BQUksV0FBSixFQUFpQjtBQUNoQixtQkFBZSxLQUFmLENBQXFCLE9BQXJCLEdBQStCLEVBQS9CO0FBQ0E7QUFDRCxHQUpEOztBQU1BLFNBQU8sS0FBUDtBQUNBOztBQXpZMEIsQ0FBNUI7O0FBNllBOzs7O0FBSUEsa0JBQVcsSUFBWCxDQUFnQixVQUFDLEdBQUQsRUFBUztBQUN4QixPQUFNLElBQUksV0FBSixFQUFOO0FBQ0EsUUFBTyxJQUFJLFFBQUosQ0FBYSxnQkFBYixLQUFrQyxJQUFJLFFBQUosQ0FBYSxXQUFiLENBQWxDLEdBQThELGVBQTlELEdBQWdGLElBQXZGO0FBQ0EsQ0FIRDs7QUFLQSxtQkFBUyxHQUFULENBQWEsbUJBQWI7OztBQ2ppQkE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7OztBQVFBLElBQU0sYUFBYTtBQUNsQjs7O0FBR0Esa0JBQWlCLEtBSkM7QUFLbEI7OztBQUdBLGlCQUFnQixLQVJFO0FBU2xCOzs7QUFHQSxjQUFhLEVBWks7O0FBY2xCOzs7OztBQUtBLGdCQUFlLHVCQUFDLFFBQUQsRUFBYzs7QUFFNUIsTUFBSSxXQUFXLFFBQWYsRUFBeUI7QUFDeEIsY0FBVyxZQUFYLENBQXdCLFFBQXhCO0FBQ0EsR0FGRCxNQUVPO0FBQ04sY0FBVyxhQUFYO0FBQ0EsY0FBVyxXQUFYLENBQXVCLElBQXZCLENBQTRCLFFBQTVCO0FBQ0E7QUFDRCxFQTNCaUI7O0FBNkJsQjs7OztBQUlBLGdCQUFlLHlCQUFNO0FBQ3BCLE1BQUksQ0FBQyxXQUFXLGVBQWhCLEVBQWlDO0FBQ2hDLE9BQUksTUFBTSxtQkFBUyxhQUFULENBQXVCLFFBQXZCLENBQVY7QUFDQSxPQUFJLEdBQUosR0FBVSw4QkFBVjtBQUNBLE9BQUksaUJBQWlCLG1CQUFTLG9CQUFULENBQThCLFFBQTlCLEVBQXdDLENBQXhDLENBQXJCO0FBQ0Esa0JBQWUsVUFBZixDQUEwQixZQUExQixDQUF1QyxHQUF2QyxFQUE0QyxjQUE1QztBQUNBLGNBQVcsZUFBWCxHQUE2QixJQUE3QjtBQUNBO0FBQ0QsRUF6Q2lCOztBQTJDbEI7Ozs7QUFJQSxjQUFhLHVCQUFNOztBQUVsQixhQUFXLFFBQVgsR0FBc0IsSUFBdEI7QUFDQSxhQUFXLGNBQVgsR0FBNEIsSUFBNUI7O0FBRUEsU0FBTyxXQUFXLFdBQVgsQ0FBdUIsTUFBdkIsR0FBZ0MsQ0FBdkMsRUFBMEM7QUFDekMsT0FBSSxXQUFXLFdBQVcsV0FBWCxDQUF1QixHQUF2QixFQUFmO0FBQ0EsY0FBVyxZQUFYLENBQXdCLFFBQXhCO0FBQ0E7QUFDRCxFQXhEaUI7O0FBMERsQjs7Ozs7QUFLQSxlQUFjLHNCQUFDLFFBQUQsRUFBYztBQUMzQixTQUFPLElBQUksR0FBRyxNQUFQLENBQWMsU0FBUyxXQUF2QixFQUFvQyxRQUFwQyxDQUFQO0FBQ0EsRUFqRWlCOztBQW1FbEI7Ozs7Ozs7Ozs7O0FBV0EsZUFBYyxzQkFBQyxHQUFELEVBQVM7O0FBRXRCLE1BQUksWUFBWSxFQUFoQjs7QUFFQSxNQUFJLElBQUksT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBdkIsRUFBMEI7QUFDekI7QUFDQSxlQUFZLFdBQVcscUJBQVgsQ0FBaUMsR0FBakMsQ0FBWjs7QUFFQTtBQUNBLE9BQUksY0FBYyxFQUFsQixFQUFzQjtBQUNyQixnQkFBWSxXQUFXLG1CQUFYLENBQStCLEdBQS9CLENBQVo7QUFDQTtBQUNELEdBUkQsTUFRTztBQUNOLGVBQVksV0FBVyxtQkFBWCxDQUErQixHQUEvQixDQUFaO0FBQ0E7O0FBRUQsU0FBTyxTQUFQO0FBQ0EsRUEvRmlCOztBQWlHbEI7Ozs7OztBQU1BLHdCQUF1QiwrQkFBQyxHQUFELEVBQVM7O0FBRS9CLE1BQUksUUFBUSxTQUFSLElBQXFCLFFBQVEsSUFBN0IsSUFBcUMsQ0FBQyxJQUFJLElBQUosR0FBVyxNQUFyRCxFQUE2RDtBQUM1RCxVQUFPLElBQVA7QUFDQTs7QUFFRCxNQUNDLFlBQVksRUFEYjtBQUFBLE1BRUMsUUFBUSxJQUFJLEtBQUosQ0FBVSxHQUFWLENBRlQ7QUFBQSxNQUdDLGFBQWEsTUFBTSxDQUFOLEVBQVMsS0FBVCxDQUFlLEdBQWYsQ0FIZDs7QUFNQSxPQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxXQUFXLE1BQWhDLEVBQXdDLElBQUksRUFBNUMsRUFBZ0QsR0FBaEQsRUFBcUQ7QUFDcEQsT0FBSSxhQUFhLFdBQVcsQ0FBWCxFQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBakI7QUFDQSxPQUFJLFdBQVcsQ0FBWCxNQUFrQixHQUF0QixFQUEyQjtBQUMxQixnQkFBWSxXQUFXLENBQVgsQ0FBWjtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxTQUFPLFNBQVA7QUFDQSxFQTVIaUI7O0FBOEhsQjs7Ozs7OztBQU9BLHNCQUFxQiw2QkFBQyxHQUFELEVBQVM7O0FBRTdCLE1BQUksUUFBUSxTQUFSLElBQXFCLFFBQVEsSUFBN0IsSUFBcUMsQ0FBQyxJQUFJLElBQUosR0FBVyxNQUFyRCxFQUE2RDtBQUM1RCxVQUFPLElBQVA7QUFDQTs7QUFFRCxNQUFJLFFBQVEsSUFBSSxLQUFKLENBQVUsR0FBVixDQUFaO0FBQ0EsUUFBTSxNQUFNLENBQU4sQ0FBTjtBQUNBLFNBQU8sSUFBSSxTQUFKLENBQWMsSUFBSSxXQUFKLENBQWdCLEdBQWhCLElBQXVCLENBQXJDLENBQVA7QUFDQSxFQTlJaUI7O0FBZ0psQjs7Ozs7QUFLQSx3QkFBdUIsK0JBQUMsR0FBRCxFQUFTO0FBQy9CLE1BQUksUUFBUSxTQUFSLElBQXFCLFFBQVEsSUFBN0IsSUFBcUMsQ0FBQyxJQUFJLElBQUosR0FBVyxNQUFqRCxJQUEyRCxDQUFDLElBQUksUUFBSixDQUFhLGVBQWIsQ0FBaEUsRUFBK0Y7QUFDOUYsVUFBTyxHQUFQO0FBQ0E7O0FBRUQsTUFBSSxRQUFRLElBQUksS0FBSixDQUFVLEdBQVYsQ0FBWjtBQUNBLFFBQU0sQ0FBTixJQUFXLE1BQU0sQ0FBTixFQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsZUFBekIsQ0FBWDtBQUNBLFNBQU8sTUFBTSxJQUFOLENBQVcsR0FBWCxDQUFQO0FBQ0E7QUE3SmlCLENBQW5COztBQWdLQSxJQUFNLHdCQUF3QjtBQUM3QixPQUFNLGdCQUR1Qjs7QUFHN0IsVUFBUztBQUNSLFVBQVEsZ0JBREE7QUFFUjs7Ozs7O0FBTUEsV0FBUztBQUNSLGFBQVUsQ0FERjtBQUVSLGFBQVUsQ0FGRjtBQUdSLGNBQVcsQ0FISDtBQUlSLFFBQUssQ0FKRztBQUtSLFNBQU0sQ0FMRTtBQU1SLG1CQUFnQixDQU5SO0FBT1IsZ0JBQWEsQ0FQTDtBQVFSLFFBQUssQ0FSRztBQVNSLGFBQVUsQ0FURjtBQVVSLFVBQU8sQ0FWQztBQVdSO0FBQ0EsYUFBVTtBQVpGO0FBUkQsRUFIb0I7O0FBMkI3Qjs7Ozs7O0FBTUEsY0FBYSxxQkFBQyxJQUFEO0FBQUEsU0FBVSxDQUFDLGVBQUQsRUFBa0IsaUJBQWxCLEVBQXFDLFFBQXJDLENBQThDLElBQTlDLENBQVY7QUFBQSxFQWpDZ0I7O0FBbUM3Qjs7Ozs7Ozs7QUFRQSxTQUFRLGdCQUFDLFlBQUQsRUFBZSxPQUFmLEVBQXdCLFVBQXhCLEVBQXVDOztBQUU5QztBQUNBLE1BQUksVUFBVSxFQUFkO0FBQ0EsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxFQUFSLEdBQWEsYUFBYSxFQUFiLEdBQWtCLEdBQWxCLEdBQXdCLFFBQVEsTUFBN0M7QUFDQSxVQUFRLFlBQVIsR0FBdUIsWUFBdkI7O0FBRUE7QUFDQSxNQUNDLFdBQVcsRUFEWjtBQUFBLE1BRUMsYUFBYSxJQUZkO0FBQUEsTUFHQyxrQkFBa0IsS0FIbkI7QUFBQSxNQUlDLFNBQVMsSUFKVjtBQUFBLE1BS0MsUUFBUSxLQUxUO0FBQUEsTUFNQyxnQkFBZ0IsSUFOakI7QUFBQSxNQU9DLFVBUEQ7QUFBQSxNQVFDLFdBUkQ7O0FBV0E7QUFDQSxNQUNDLFFBQVEsZUFBSyxVQUFMLENBQWdCLFVBRHpCO0FBQUEsTUFFQyx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsUUFBRCxFQUFjOztBQUVwQzs7QUFFQSxPQUFNLGVBQWEsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLFdBQXpCLEVBQWIsR0FBc0QsU0FBUyxTQUFULENBQW1CLENBQW5CLENBQTVEOztBQUVBLG1CQUFjLE9BQWQsSUFBMkIsWUFBTTtBQUNoQyxRQUFJLGVBQWUsSUFBbkIsRUFBeUI7QUFDeEIsU0FBSSxRQUFRLElBQVo7O0FBRUE7O0FBSHdCO0FBSXhCLGNBQVEsUUFBUjtBQUNDLFlBQUssYUFBTDtBQUNDO0FBQUEsWUFBTyxXQUFXLGNBQVg7QUFBUDs7QUFFRCxZQUFLLFVBQUw7QUFDQztBQUFBLFlBQU8sV0FBVyxXQUFYO0FBQVA7O0FBRUQsWUFBSyxRQUFMO0FBQ0M7QUFBQSxZQUFPLFdBQVcsU0FBWDtBQUFQOztBQUVELFlBQUssUUFBTDtBQUNDO0FBQUEsWUFBTztBQUFQOztBQUVELFlBQUssT0FBTDtBQUNDO0FBQUEsWUFBTztBQUFQOztBQUVELFlBQUssT0FBTDtBQUNDO0FBQUEsWUFBTyxXQUFXLE9BQVg7QUFBUCxVQWpCRixDQWlCK0I7O0FBRTlCLFlBQUssVUFBTDtBQUNDLFlBQUksZ0JBQWdCLFdBQVcsc0JBQVgsRUFBcEI7QUFBQSxZQUNDLFdBQVcsV0FBVyxXQUFYLEVBRFo7QUFFQTtBQUFBLFlBQU87QUFDTixpQkFBTyxpQkFBTTtBQUNaLGtCQUFPLENBQVA7QUFDQSxXQUhLO0FBSU4sZUFBSyxlQUFNO0FBQ1Ysa0JBQU8sZ0JBQWdCLFFBQXZCO0FBQ0EsV0FOSztBQU9OLGtCQUFRO0FBUEY7QUFBUDtBQVNELFlBQUssS0FBTDtBQUNDO0FBQUEsWUFBTyxXQUFXLFdBQVg7QUFBUDtBQWhDRjtBQUp3Qjs7QUFBQTtBQXVDeEIsWUFBTyxLQUFQO0FBQ0EsS0F4Q0QsTUF3Q087QUFDTixZQUFPLElBQVA7QUFDQTtBQUNELElBNUNEOztBQThDQSxtQkFBYyxPQUFkLElBQTJCLFVBQUMsS0FBRCxFQUFXOztBQUVyQyxRQUFJLGVBQWUsSUFBbkIsRUFBeUI7O0FBRXhCO0FBQ0EsYUFBUSxRQUFSOztBQUVDLFdBQUssS0FBTDtBQUNDLFdBQUksTUFBTSxPQUFPLEtBQVAsS0FBaUIsUUFBakIsR0FBNEIsS0FBNUIsR0FBb0MsTUFBTSxDQUFOLEVBQVMsR0FBdkQ7QUFBQSxXQUNDLFdBQVUsV0FBVyxZQUFYLENBQXdCLEdBQXhCLENBRFg7O0FBR0EsV0FBSSxhQUFhLFlBQWIsQ0FBMEIsVUFBMUIsQ0FBSixFQUEyQztBQUMxQyxtQkFBVyxhQUFYLENBQXlCLFFBQXpCO0FBQ0EsUUFGRCxNQUVPO0FBQ04sbUJBQVcsWUFBWCxDQUF3QixRQUF4QjtBQUNBO0FBQ0Q7O0FBRUQsV0FBSyxhQUFMO0FBQ0Msa0JBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBOztBQUVELFdBQUssT0FBTDtBQUNDLFdBQUksS0FBSixFQUFXO0FBQ1YsbUJBQVcsSUFBWCxHQURVLENBQ1M7QUFDbkIsUUFGRCxNQUVPO0FBQ04sbUJBQVcsTUFBWCxHQURNLENBQ2U7QUFDckI7QUFDRCxrQkFBVyxZQUFNO0FBQ2hCLFlBQUksUUFBUSxzQkFBWSxjQUFaLEVBQTRCLE9BQTVCLENBQVo7QUFDQSxxQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0EsUUFIRCxFQUdHLEVBSEg7QUFJQTs7QUFFRCxXQUFLLFFBQUw7QUFDQyxrQkFBVyxTQUFYLENBQXFCLEtBQXJCO0FBQ0Esa0JBQVcsWUFBTTtBQUNoQixZQUFJLFFBQVEsc0JBQVksY0FBWixFQUE0QixPQUE1QixDQUFaO0FBQ0EscUJBQWEsYUFBYixDQUEyQixLQUEzQjtBQUNBLFFBSEQsRUFHRyxFQUhIO0FBSUE7O0FBRUQ7QUFDQyxlQUFRLEdBQVIsQ0FBWSxhQUFhLFFBQVEsRUFBakMsRUFBcUMsUUFBckMsRUFBK0Msc0JBQS9DO0FBdENGO0FBeUNBLEtBNUNELE1BNENPO0FBQ047QUFDQSxjQUFTLElBQVQsQ0FBYyxFQUFDLE1BQU0sS0FBUCxFQUFjLFVBQVUsUUFBeEIsRUFBa0MsT0FBTyxLQUF6QyxFQUFkO0FBQ0E7QUFDRCxJQWxERDtBQW9EQSxHQTFHRjs7QUE2R0EsT0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLE1BQU0sTUFBdkIsRUFBK0IsSUFBSSxFQUFuQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMzQyx3QkFBcUIsTUFBTSxDQUFOLENBQXJCO0FBQ0E7O0FBRUQ7QUFDQSxNQUNDLFVBQVUsZUFBSyxVQUFMLENBQWdCLE9BRDNCO0FBQUEsTUFFQyxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxVQUFELEVBQWdCOztBQUUvQjtBQUNBLFdBQVEsVUFBUixJQUFzQixZQUFNOztBQUUzQixRQUFJLGVBQWUsSUFBbkIsRUFBeUI7O0FBRXhCO0FBQ0EsYUFBUSxVQUFSO0FBQ0MsV0FBSyxNQUFMO0FBQ0MsY0FBTyxXQUFXLFNBQVgsRUFBUDtBQUNELFdBQUssT0FBTDtBQUNDLGNBQU8sV0FBVyxVQUFYLEVBQVA7QUFDRCxXQUFLLE1BQUw7QUFDQyxjQUFPLElBQVA7O0FBTkY7QUFVQSxLQWJELE1BYU87QUFDTixjQUFTLElBQVQsQ0FBYyxFQUFDLE1BQU0sTUFBUCxFQUFlLFlBQVksVUFBM0IsRUFBZDtBQUNBO0FBQ0QsSUFsQkQ7QUFvQkEsR0F6QkY7O0FBNEJBLE9BQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxRQUFRLE1BQXpCLEVBQWlDLElBQUksRUFBckMsRUFBeUMsR0FBekMsRUFBOEM7QUFDN0MsaUJBQWMsUUFBUSxDQUFSLENBQWQ7QUFDQTs7QUFFRDtBQUNBLE1BQUksbUJBQW1CLG1CQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdkI7QUFDQSxtQkFBaUIsRUFBakIsR0FBc0IsUUFBUSxFQUE5Qjs7QUFFQTtBQUNBLE1BQUksUUFBUSxPQUFSLENBQWdCLE9BQWhCLENBQXdCLFFBQTVCLEVBQXNDO0FBQ3JDLGdCQUFhLFlBQWIsQ0FBMEIsWUFBMUIsQ0FBdUMsS0FBdkMsRUFBOEMsV0FBVyxxQkFBWCxDQUFpQyxXQUFXLENBQVgsRUFBYyxHQUEvQyxDQUE5QztBQUNBOztBQUVELGVBQWEsWUFBYixDQUEwQixVQUExQixDQUFxQyxZQUFyQyxDQUFrRCxnQkFBbEQsRUFBb0UsYUFBYSxZQUFqRjtBQUNBLGVBQWEsWUFBYixDQUEwQixLQUExQixDQUFnQyxPQUFoQyxHQUEwQyxNQUExQzs7QUFFQSxNQUNDLFNBQVMsYUFBYSxZQUFiLENBQTBCLE1BRHBDO0FBQUEsTUFFQyxRQUFRLGFBQWEsWUFBYixDQUEwQixLQUZuQztBQUFBLE1BR0MsVUFBVSxXQUFXLFlBQVgsQ0FBd0IsV0FBVyxDQUFYLEVBQWMsR0FBdEMsQ0FIWDtBQUFBLE1BSUMsa0JBQWtCO0FBQ2pCLE9BQUksUUFBUSxFQURLO0FBRWpCLGdCQUFhLGlCQUFpQixFQUZiO0FBR2pCLFlBQVMsT0FIUTtBQUlqQixXQUFRLE1BSlM7QUFLakIsVUFBTyxLQUxVO0FBTWpCLGVBQVksT0FBTyxNQUFQLENBQWM7QUFDekIsY0FBVSxDQURlO0FBRXpCLFNBQUssQ0FGb0I7QUFHekIsZUFBVyxDQUhjO0FBSXpCLGNBQVUsQ0FKZTtBQUt6QixvQkFBZ0IsQ0FMUztBQU16QixXQUFPLENBTmtCO0FBT3pCLGlCQUFhLENBUFk7QUFRekIsV0FBTyxDQVJrQjtBQVN6QixTQUFLO0FBVG9CLElBQWQsRUFVVCxRQUFRLE9BQVIsQ0FBZ0IsT0FWUCxDQU5LO0FBaUJqQixXQUFRLGlCQUFPLFFBQVAsQ0FBZ0IsSUFqQlA7QUFrQmpCLFdBQVE7QUFDUCxhQUFTLGlCQUFDLENBQUQsRUFBTzs7QUFFZix1QkFBa0IsSUFBbEI7QUFDQSxrQkFBYSxVQUFiLEdBQTBCLGFBQWEsRUFBRSxNQUF6QztBQUNBLGtCQUFhLFlBQWIsR0FBNEI7QUFDM0IsY0FBUSxJQURtQjtBQUUzQixhQUFPO0FBRm9CLE1BQTVCOztBQUtBO0FBQ0EsU0FBSSxTQUFTLE1BQWIsRUFBcUI7QUFDcEIsV0FBSyxJQUFJLENBQUosRUFBTyxLQUFLLFNBQVMsTUFBMUIsRUFBa0MsSUFBSSxFQUF0QyxFQUEwQyxHQUExQyxFQUErQzs7QUFFOUMsV0FBSSxZQUFZLFNBQVMsQ0FBVCxDQUFoQjs7QUFFQSxXQUFJLFVBQVUsSUFBVixLQUFtQixLQUF2QixFQUE4QjtBQUM3QixZQUNDLFdBQVcsVUFBVSxRQUR0QjtBQUFBLFlBRUMsZUFBYSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsV0FBekIsRUFBYixHQUFzRCxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsQ0FGdkQ7O0FBS0Esd0JBQWMsT0FBZCxFQUF5QixVQUFVLEtBQW5DO0FBQ0EsUUFQRCxNQU9PLElBQUksVUFBVSxJQUFWLEtBQW1CLE1BQXZCLEVBQStCO0FBQ3JDLGdCQUFRLFVBQVUsVUFBbEI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQSxxQkFBZ0IsV0FBVyxTQUFYLEVBQWhCOztBQUVBLFNBQ0MsU0FBUyxDQUFDLFdBQUQsRUFBYyxVQUFkLENBRFY7QUFBQSxTQUVDLGVBQWUsU0FBZixZQUFlLENBQUMsQ0FBRCxFQUFPOztBQUVyQixVQUFJLFdBQVcsc0JBQVksRUFBRSxJQUFkLEVBQW9CLE9BQXBCLENBQWY7QUFDQSxtQkFBYSxhQUFiLENBQTJCLFFBQTNCO0FBQ0EsTUFORjs7QUFTQSxVQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDckIseUJBQVMsYUFBVCxFQUF3QixPQUFPLENBQVAsQ0FBeEIsRUFBbUMsWUFBbkM7QUFDQTs7QUFFRDtBQUNBLFNBQUksYUFBYSxDQUFDLGVBQUQsRUFBa0IsWUFBbEIsRUFBZ0MsZ0JBQWhDLEVBQWtELFNBQWxELENBQWpCOztBQUVBLFVBQUssSUFBSSxDQUFKLEVBQU8sS0FBSyxXQUFXLE1BQTVCLEVBQW9DLElBQUksRUFBeEMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDaEQsVUFBSSxRQUFRLHNCQUFZLFdBQVcsQ0FBWCxDQUFaLEVBQTJCLE9BQTNCLENBQVo7QUFDQSxtQkFBYSxhQUFiLENBQTJCLEtBQTNCO0FBQ0E7QUFDRCxLQXBETTtBQXFEUCxtQkFBZSx1QkFBQyxDQUFELEVBQU87O0FBRXJCO0FBQ0EsU0FBSSxTQUFTLEVBQWI7O0FBRUEsYUFBUSxFQUFFLElBQVY7QUFDQyxXQUFLLENBQUMsQ0FBTjtBQUFTO0FBQ1IsZ0JBQVMsQ0FBQyxnQkFBRCxDQUFUO0FBQ0EsZ0JBQVMsSUFBVDtBQUNBLGVBQVEsS0FBUjtBQUNBOztBQUVELFdBQUssQ0FBTDtBQUFRO0FBQ1AsZ0JBQVMsQ0FBQyxPQUFELENBQVQ7QUFDQSxnQkFBUyxLQUFUO0FBQ0EsZUFBUSxJQUFSOztBQUVBLGVBQVEsWUFBUjtBQUNBOztBQUVELFdBQUssQ0FBTDtBQUFRO0FBQ1AsZ0JBQVMsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUFUO0FBQ0EsZ0JBQVMsS0FBVDtBQUNBLGVBQVEsS0FBUjs7QUFFQSxlQUFRLGFBQVI7O0FBRUE7O0FBRUQsV0FBSyxDQUFMO0FBQVE7QUFDUCxnQkFBUyxDQUFDLFFBQUQsQ0FBVDtBQUNBLGdCQUFTLElBQVQ7QUFDQSxlQUFRLEtBQVI7O0FBRUEsZUFBUSxZQUFSO0FBQ0E7O0FBRUQsV0FBSyxDQUFMO0FBQVE7QUFDUCxnQkFBUyxDQUFDLFVBQUQsQ0FBVDtBQUNBLGdCQUFTLEtBQVQ7QUFDQSxlQUFRLEtBQVI7O0FBRUE7QUFDRCxXQUFLLENBQUw7QUFBUTtBQUNQLGdCQUFTLENBQUMsWUFBRCxFQUFlLGdCQUFmLEVBQWlDLFNBQWpDLENBQVQ7QUFDQSxnQkFBUyxJQUFUO0FBQ0EsZUFBUSxLQUFSOztBQUVBO0FBM0NGOztBQThDQTtBQUNBLFVBQUssSUFBSSxLQUFJLENBQVIsRUFBVyxNQUFLLE9BQU8sTUFBNUIsRUFBb0MsS0FBSSxHQUF4QyxFQUE0QyxJQUE1QyxFQUFpRDtBQUNoRCxVQUFJLFFBQVEsc0JBQVksT0FBTyxFQUFQLENBQVosRUFBdUIsT0FBdkIsQ0FBWjtBQUNBLG1CQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFDQTtBQUVEO0FBOUdNO0FBbEJTLEdBSm5COztBQXdJQTtBQUNBLGFBQVcsYUFBWCxDQUF5QixlQUF6Qjs7QUFFQSxVQUFRLE9BQVIsR0FBa0IsVUFBQyxTQUFELEVBQVksTUFBWixFQUFvQixhQUFwQixFQUFzQztBQUN2RCxPQUFJLGtCQUFrQixJQUFsQixJQUEwQixrQkFBa0IsU0FBaEQsRUFBMkQ7QUFDMUQsaUJBQWEsWUFBYixHQUE0QixhQUE1QjtBQUNBO0FBRUQsR0FMRDs7QUFPQSxVQUFRLE9BQVIsR0FBa0IsVUFBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUNwQyxPQUFJLGVBQWUsSUFBbkIsRUFBeUI7QUFDeEIsZUFBVyxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLE1BQTFCO0FBQ0E7QUFDRCxHQUpEO0FBS0EsVUFBUSxJQUFSLEdBQWUsWUFBTTtBQUNwQixXQUFRLFlBQVI7QUFDQSxXQUFRLEtBQVI7QUFDQSxPQUFJLGFBQUosRUFBbUI7QUFDbEIsa0JBQWMsS0FBZCxDQUFvQixPQUFwQixHQUE4QixNQUE5QjtBQUNBO0FBQ0QsR0FORDtBQU9BLFVBQVEsSUFBUixHQUFlLFlBQU07QUFDcEIsT0FBSSxhQUFKLEVBQW1CO0FBQ2xCLGtCQUFjLEtBQWQsQ0FBb0IsT0FBcEIsR0FBOEIsRUFBOUI7QUFDQTtBQUNELEdBSkQ7QUFLQSxVQUFRLE9BQVIsR0FBa0IsWUFBTTtBQUN2QixjQUFXLE9BQVg7QUFDQSxHQUZEO0FBR0EsVUFBUSxRQUFSLEdBQW1CLElBQW5COztBQUVBLFVBQVEsYUFBUixHQUF3QixZQUFNO0FBQzdCO0FBQ0EsV0FBUSxRQUFSLEdBQW1CLFlBQVksWUFBTTs7QUFFcEMsUUFBSSxRQUFRLHNCQUFZLFlBQVosRUFBMEIsT0FBMUIsQ0FBWjtBQUNBLGlCQUFhLGFBQWIsQ0FBMkIsS0FBM0I7QUFFQSxJQUxrQixFQUtoQixHQUxnQixDQUFuQjtBQU1BLEdBUkQ7QUFTQSxVQUFRLFlBQVIsR0FBdUIsWUFBTTtBQUM1QixPQUFJLFFBQVEsUUFBWixFQUFzQjtBQUNyQixrQkFBYyxRQUFRLFFBQXRCO0FBQ0E7QUFDRCxHQUpEOztBQU1BLFNBQU8sT0FBUDtBQUNBO0FBdFo0QixDQUE5Qjs7QUF5WkEsSUFBSSxpQkFBTyxXQUFQLFlBQTZCLGlCQUFPLGdCQUFwQyxDQUFKLEVBQTBEOztBQUV6RCxrQkFBTyx1QkFBUCxHQUFpQyxZQUFNO0FBQ3RDLGFBQVcsV0FBWDtBQUNBLEVBRkQ7O0FBSUEsbUJBQVcsSUFBWCxDQUFnQixVQUFDLEdBQUQsRUFBUztBQUN4QixRQUFNLElBQUksV0FBSixFQUFOO0FBQ0EsU0FBUSxJQUFJLFFBQUosQ0FBYSxlQUFiLEtBQWlDLElBQUksUUFBSixDQUFhLFlBQWIsQ0FBbEMsR0FBZ0UsaUJBQWhFLEdBQW9GLElBQTNGO0FBQ0EsRUFIRDs7QUFLQSxvQkFBUyxHQUFULENBQWEscUJBQWI7QUFDQTs7O0FDdGxCRDs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBTSxvQkFBTSxpQkFBTyxTQUFuQjtBQUNBLElBQU0sa0JBQUssSUFBSSxTQUFKLENBQWMsV0FBZCxFQUFYOztBQUVBLElBQU0sNEJBQVcsR0FBRyxLQUFILENBQVMsT0FBVCxNQUFzQixJQUF2QztBQUNBLElBQU0sZ0NBQWEsR0FBRyxLQUFILENBQVMsU0FBVCxNQUF3QixJQUEzQztBQUNBLElBQU0sMEJBQVMsYUFBYSxPQUE1QjtBQUNBLElBQU0sa0NBQWMsR0FBRyxLQUFILENBQVMsVUFBVCxNQUF5QixJQUE3QztBQUNBLElBQU0sd0JBQVMsSUFBSSxPQUFKLENBQVksV0FBWixHQUEwQixRQUExQixDQUFtQyxXQUFuQyxLQUFtRCxJQUFJLE9BQUosQ0FBWSxXQUFaLEdBQTBCLEtBQTFCLENBQWdDLFdBQWhDLE1BQWlELElBQW5IO0FBQ0EsSUFBTSxnQ0FBYSxHQUFHLEtBQUgsQ0FBUyxVQUFULE1BQXlCLElBQTVDO0FBQ0EsSUFBTSxrQ0FBYyxHQUFHLEtBQUgsQ0FBUyxXQUFULE1BQTBCLElBQTlDO0FBQ0EsSUFBTSxnQ0FBYSxHQUFHLEtBQUgsQ0FBUyxVQUFULE1BQXlCLElBQTFCLElBQW1DLENBQUMsU0FBdEQ7QUFDQSxJQUFNLDhDQUFvQixHQUFHLEtBQUgsQ0FBUyxvQ0FBVCxNQUFtRCxJQUE3RTs7QUFFQSxJQUFNLGdDQUFZLENBQUMsRUFBRyxrQ0FBRCxJQUE4QixpQkFBTyxhQUFQLElBQXdCLDhCQUFvQixpQkFBTyxhQUFuRixDQUFuQjtBQUNBLElBQU0sNEJBQVcsaUNBQWpCO0FBQ0EsSUFBTSwwREFBMEIsWUFBTTtBQUM1QyxLQUNDLFVBQVUsbUJBQVMsYUFBVCxDQUF1QixHQUF2QixDQURYO0FBQUEsS0FFQyxrQkFBa0IsbUJBQVMsZUFGNUI7QUFBQSxLQUdDLG1CQUFtQixpQkFBTyxnQkFIM0I7QUFBQSxLQUlDLGlCQUpEOztBQU9BLEtBQUksRUFBRSxtQkFBbUIsUUFBUSxLQUE3QixDQUFKLEVBQXlDO0FBQ3hDLFNBQU8sS0FBUDtBQUNBOztBQUVELFNBQVEsS0FBUixDQUFjLGFBQWQsR0FBOEIsTUFBOUI7QUFDQSxTQUFRLEtBQVIsQ0FBYyxhQUFkLEdBQThCLEdBQTlCO0FBQ0EsaUJBQWdCLFdBQWhCLENBQTRCLE9BQTVCO0FBQ0EsWUFBVyxvQkFBb0IsaUJBQWlCLE9BQWpCLEVBQTBCLEVBQTFCLEVBQThCLGFBQTlCLEtBQWdELE1BQS9FO0FBQ0EsaUJBQWdCLFdBQWhCLENBQTRCLE9BQTVCO0FBQ0EsUUFBTyxDQUFDLENBQUMsUUFBVDtBQUNBLENBbEJxQyxFQUEvQjs7QUFvQlA7QUFDQSxJQUFJLGdCQUFnQixDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLEVBQTZCLE9BQTdCLENBQXBCO0FBQUEsSUFBMkQsY0FBM0Q7O0FBRUEsS0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssY0FBYyxNQUFuQyxFQUEyQyxJQUFJLEVBQS9DLEVBQW1ELEdBQW5ELEVBQXdEO0FBQ3ZELFNBQVEsbUJBQVMsYUFBVCxDQUF1QixjQUFjLENBQWQsQ0FBdkIsQ0FBUjtBQUNBOztBQUVEO0FBQ08sSUFBTSxrREFBc0IsTUFBTSxXQUFOLEtBQXNCLFNBQXRCLElBQW1DLE9BQS9EOztBQUVQO0FBQ08sSUFBTSxvREFBdUIsYUFBYyxlQUFlLGFBQWEsZ0JBQTVCLENBQWQsSUFBaUUsU0FBUyxHQUFHLEtBQUgsQ0FBUyxRQUFULE1BQXVCLElBQTlIOztBQUVQOztBQUVBO0FBQ0EsSUFBSSxtQkFBb0IsTUFBTSxxQkFBTixLQUFnQyxTQUF4RDs7QUFFQTtBQUNBLElBQUksc0JBQXVCLE1BQU0saUJBQU4sS0FBNEIsU0FBdkQ7O0FBRUE7QUFDQSxJQUFJLG9CQUFvQixHQUFHLEtBQUgsQ0FBUyxnQkFBVCxDQUF4QixFQUFvRDtBQUNuRCx1QkFBc0IsS0FBdEI7QUFDQSxvQkFBbUIsS0FBbkI7QUFDQTs7QUFFRDtBQUNBLElBQUksNEJBQTZCLE1BQU0sdUJBQU4sS0FBa0MsU0FBbkU7QUFDQSxJQUFJLHlCQUEwQixNQUFNLG9CQUFOLEtBQStCLFNBQTdEO0FBQ0EsSUFBSSx3QkFBeUIsTUFBTSxtQkFBTixLQUE4QixTQUEzRDs7QUFFQSxJQUFJLDBCQUEyQiw2QkFBNkIsc0JBQTdCLElBQXVELHFCQUF0RjtBQUNBLElBQUksMEJBQTBCLHVCQUE5Qjs7QUFFQSxJQUFJLHNCQUFzQixFQUExQjtBQUNBLElBQUkscUJBQUo7QUFBQSxJQUFrQiwwQkFBbEI7QUFBQSxJQUFxQyx5QkFBckM7O0FBRUE7QUFDQSxJQUFJLHNCQUFKLEVBQTRCO0FBQzNCLDJCQUEwQixtQkFBUyxvQkFBbkM7QUFDQSxDQUZELE1BRU8sSUFBSSxxQkFBSixFQUEyQjtBQUNqQywyQkFBMEIsbUJBQVMsbUJBQW5DO0FBQ0E7O0FBRUQsSUFBSSxTQUFKLEVBQWU7QUFDZCxvQkFBbUIsS0FBbkI7QUFDQTs7QUFFRCxJQUFJLHVCQUFKLEVBQTZCOztBQUU1QixLQUFJLHlCQUFKLEVBQStCO0FBQzlCLHdCQUFzQix3QkFBdEI7QUFDQSxFQUZELE1BRU8sSUFBSSxzQkFBSixFQUE0QjtBQUNsQyx3QkFBc0IscUJBQXRCO0FBQ0EsRUFGTSxNQUVBLElBQUkscUJBQUosRUFBMkI7QUFDakMsd0JBQXNCLG9CQUF0QjtBQUNBOztBQUVELFNBOENPLFlBOUNQLGtCQUFlLHdCQUFPO0FBQ3JCLE1BQUksc0JBQUosRUFBNEI7QUFDM0IsVUFBTyxtQkFBUyxhQUFoQjtBQUVBLEdBSEQsTUFHTyxJQUFJLHlCQUFKLEVBQStCO0FBQ3JDLFVBQU8sbUJBQVMsa0JBQWhCO0FBRUEsR0FITSxNQUdBLElBQUkscUJBQUosRUFBMkI7QUFDakMsVUFBTyxtQkFBUyxtQkFBVCxLQUFpQyxJQUF4QztBQUNBO0FBQ0QsRUFWRDs7QUFZQSxTQWtDcUIsaUJBbENyQix1QkFBb0IsMkJBQUMsRUFBRCxFQUFROztBQUUzQixNQUFJLHlCQUFKLEVBQStCO0FBQzlCLE1BQUcsdUJBQUg7QUFDQSxHQUZELE1BRU8sSUFBSSxzQkFBSixFQUE0QjtBQUNsQyxNQUFHLG9CQUFIO0FBQ0EsR0FGTSxNQUVBLElBQUkscUJBQUosRUFBMkI7QUFDakMsTUFBRyxtQkFBSDtBQUNBO0FBQ0QsRUFURDs7QUFXQSxTQXVCd0MsZ0JBdkJ4QyxzQkFBbUIsNEJBQU07QUFDeEIsTUFBSSx5QkFBSixFQUErQjtBQUM5QixzQkFBUyxzQkFBVDtBQUVBLEdBSEQsTUFHTyxJQUFJLHNCQUFKLEVBQTRCO0FBQ2xDLHNCQUFTLG1CQUFUO0FBRUEsR0FITSxNQUdBLElBQUkscUJBQUosRUFBMkI7QUFDakMsc0JBQVMsZ0JBQVQ7QUFFQTtBQUNELEVBWEQ7QUFZQTs7QUFFTSxJQUFNLHdEQUF3QixtQkFBOUI7QUFDQSxJQUFNLHNFQUErQix5QkFBckM7QUFDQSxJQUFNLGdFQUE0QixzQkFBbEM7QUFDQSxJQUFNLDhEQUEyQixxQkFBakM7QUFDQSxJQUFNLGtEQUFxQixnQkFBM0I7QUFDQSxJQUFNLGtFQUE2Qix1QkFBbkM7QUFDQSxJQUFNLHdFQUFnQyx1QkFBdEM7QUFDQSxJQUFNLHdEQUF3QixtQkFBOUI7O1FBRUMsWSxHQUFBLFk7UUFBYyxpQixHQUFBLGlCO1FBQW1CLGdCLEdBQUEsZ0I7OztBQUV6QyxlQUFLLFFBQUwsR0FBZ0IsZUFBSyxRQUFMLElBQWlCLEVBQWpDO0FBQ0EsZUFBSyxRQUFMLENBQWMsTUFBZCxHQUF1QixPQUF2QjtBQUNBLGVBQUssUUFBTCxDQUFjLFFBQWQsR0FBeUIsU0FBekI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxLQUFkLEdBQXNCLGVBQUssUUFBTCxDQUFjLFFBQWQsSUFBMEIsZUFBSyxRQUFMLENBQWMsTUFBOUQ7QUFDQSxlQUFLLFFBQUwsQ0FBYyxTQUFkLEdBQTBCLFVBQTFCO0FBQ0EsZUFBSyxRQUFMLENBQWMsSUFBZCxHQUFxQixLQUFyQjtBQUNBLGVBQUssUUFBTCxDQUFjLFFBQWQsR0FBeUIsU0FBekI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxTQUFkLEdBQTBCLFVBQTFCO0FBQ0EsZUFBSyxRQUFMLENBQWMsUUFBZCxHQUF5QixTQUF6QjtBQUNBLGVBQUssUUFBTCxDQUFjLGNBQWQsR0FBK0IsZ0JBQS9CO0FBQ0EsZUFBSyxRQUFMLENBQWMsUUFBZCxHQUF5QixTQUF6QjtBQUNBLGVBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsT0FBdkI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxnQkFBZCxHQUFpQyxrQkFBakM7QUFDQSxlQUFLLFFBQUwsQ0FBYyxpQkFBZCxHQUFrQyxtQkFBbEM7O0FBRUEsZUFBSyxRQUFMLENBQWMscUJBQWQsR0FBc0Msc0JBQXRDO0FBQ0EsZUFBSyxRQUFMLENBQWMsZ0JBQWQsR0FBaUMsa0JBQWpDO0FBQ0EsZUFBSyxRQUFMLENBQWMsbUJBQWQsR0FBb0MscUJBQXBDO0FBQ0EsZUFBSyxRQUFMLENBQWMseUJBQWQsR0FBMEMsNEJBQTFDO0FBQ0EsZUFBSyxRQUFMLENBQWMsc0JBQWQsR0FBdUMseUJBQXZDO0FBQ0EsZUFBSyxRQUFMLENBQWMscUJBQWQsR0FBc0Msd0JBQXRDO0FBQ0EsZUFBSyxRQUFMLENBQWMsdUJBQWQsR0FBd0MsMEJBQXhDO0FBQ0EsZUFBSyxRQUFMLENBQWMsdUJBQWQsR0FBd0MsNkJBQXhDO0FBQ0EsZUFBSyxRQUFMLENBQWMsbUJBQWQsR0FBb0MscUJBQXBDO0FBQ0EsZUFBSyxRQUFMLENBQWMsWUFBZCxHQUE2QixZQUE3QjtBQUNBLGVBQUssUUFBTCxDQUFjLGlCQUFkLEdBQWtDLGlCQUFsQztBQUNBLGVBQUssUUFBTCxDQUFjLGdCQUFkLEdBQWlDLGdCQUFqQzs7O0FDOUtBOzs7OztRQVdnQixXLEdBQUEsVztRQTRCQSxRLEdBQUEsUTtRQW1CQSxXLEdBQUEsVztRQWVBLFcsR0FBQSxXOztBQXZFaEI7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztBQU1PLFNBQVMsV0FBVCxDQUFzQixTQUF0QixFQUFpQyxNQUFqQyxFQUF5Qzs7QUFFL0MsS0FBSSxPQUFPLFNBQVAsS0FBcUIsUUFBekIsRUFBbUM7QUFDbEMsUUFBTSxJQUFJLEtBQUosQ0FBVSw2QkFBVixDQUFOO0FBQ0E7O0FBRUQsS0FBSSxjQUFKOztBQUVBLEtBQUksbUJBQVMsV0FBYixFQUEwQjtBQUN6QixVQUFRLG1CQUFTLFdBQVQsQ0FBcUIsT0FBckIsQ0FBUjtBQUNBLFFBQU0sU0FBTixDQUFnQixTQUFoQixFQUEyQixJQUEzQixFQUFpQyxLQUFqQztBQUNBLEVBSEQsTUFHTztBQUNOLFVBQVEsRUFBUjtBQUNBLFFBQU0sSUFBTixHQUFhLFNBQWI7QUFDQSxRQUFNLE1BQU4sR0FBZSxNQUFmO0FBQ0EsUUFBTSxXQUFOLEdBQW9CLElBQXBCO0FBQ0EsUUFBTSxRQUFOLEdBQWlCLEtBQWpCO0FBQ0E7O0FBRUQsUUFBTyxLQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1PLFNBQVMsUUFBVCxDQUFtQixHQUFuQixFQUF3QixJQUF4QixFQUE4QixFQUE5QixFQUFrQztBQUN4QyxLQUFJLElBQUksZ0JBQVIsRUFBMEI7QUFDekIsTUFBSSxnQkFBSixDQUFxQixJQUFyQixFQUEyQixFQUEzQixFQUErQixLQUEvQjtBQUNBLEVBRkQsTUFFTyxJQUFJLElBQUksV0FBUixFQUFxQjtBQUMzQixZQUFRLElBQVIsR0FBZSxFQUFmLElBQXVCLEVBQXZCO0FBQ0EsV0FBTyxJQUFQLEdBQWMsRUFBZCxJQUFzQixZQUFNO0FBQzNCLGFBQVEsSUFBUixHQUFlLEVBQWYsRUFBcUIsT0FBTyxLQUE1QjtBQUNBLEdBRkQ7QUFHQSxNQUFJLFdBQUosUUFBcUIsSUFBckIsRUFBNkIsU0FBTyxJQUFQLEdBQWMsRUFBZCxDQUE3QjtBQUNBO0FBRUQ7O0FBRUQ7Ozs7OztBQU1PLFNBQVMsV0FBVCxDQUFzQixHQUF0QixFQUEyQixJQUEzQixFQUFpQyxFQUFqQyxFQUFxQzs7QUFFM0MsS0FBSSxJQUFJLG1CQUFSLEVBQTZCO0FBQzVCLE1BQUksbUJBQUosQ0FBd0IsSUFBeEIsRUFBOEIsRUFBOUIsRUFBa0MsS0FBbEM7QUFDQSxFQUZELE1BRU8sSUFBSSxJQUFJLFdBQVIsRUFBcUI7QUFDM0IsTUFBSSxXQUFKLFFBQXFCLElBQXJCLEVBQTZCLFNBQU8sSUFBUCxHQUFjLEVBQWQsQ0FBN0I7QUFDQSxXQUFPLElBQVAsR0FBYyxFQUFkLElBQXNCLElBQXRCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTLFdBQVQsQ0FBc0IsVUFBdEIsRUFBa0MsVUFBbEMsRUFBOEM7QUFDcEQsUUFBTyxDQUFDLEVBQ1AsY0FDQSxVQURBLElBRUEsV0FBVyx1QkFBWCxDQUFtQyxVQUFuQyxDQUZBLElBRWtELEtBQUssMkJBSGhELENBQVI7QUFLQTs7QUFFRCxlQUFLLEtBQUwsR0FBYSxlQUFLLEtBQUwsSUFBYyxFQUEzQjtBQUNBLGVBQUssS0FBTCxDQUFXLFdBQVgsR0FBeUIsV0FBekI7QUFDQSxlQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLFdBQXpCO0FBQ0EsZUFBSyxLQUFMLENBQVcsV0FBWCxHQUF5QixXQUF6Qjs7O0FDcEZBOzs7OztRQVVnQixVLEdBQUEsVTtRQW1CQSxRLEdBQUEsUTtRQW9DQSxhLEdBQUEsYTtRQUlBLFcsR0FBQSxXO1FBNkJBLHNCLEdBQUEsc0I7O0FBaEdoQjs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7QUFLTyxTQUFTLFVBQVQsQ0FBcUIsS0FBckIsRUFBNEI7O0FBRWxDLEtBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzlCLFFBQU0sSUFBSSxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNBOztBQUVELEtBQU0sTUFBTTtBQUNYLE9BQUssT0FETTtBQUVYLE9BQUssTUFGTTtBQUdYLE9BQUssTUFITTtBQUlYLE9BQUs7QUFKTSxFQUFaOztBQU9BLFFBQU8sTUFBTSxPQUFOLENBQWMsU0FBZCxFQUF5QixVQUFDLENBQUQsRUFBTztBQUN0QyxTQUFPLElBQUksQ0FBSixDQUFQO0FBQ0EsRUFGTSxDQUFQO0FBR0E7O0FBRUQ7QUFDTyxTQUFTLFFBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBa0Q7QUFBQTtBQUFBOztBQUFBLEtBQW5CLFNBQW1CLHVFQUFQLEtBQU87OztBQUV4RCxLQUFJLE9BQU8sSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUMvQixRQUFNLElBQUksS0FBSixDQUFVLG1DQUFWLENBQU47QUFDQTs7QUFFRCxLQUFJLE9BQU8sSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM3QixRQUFNLElBQUksS0FBSixDQUFVLHlDQUFWLENBQU47QUFDQTs7QUFFRCxLQUFJLGdCQUFKO0FBQ0EsUUFBTyxZQUFNO0FBQ1osTUFBSSxlQUFKO0FBQUEsTUFBb0IsaUJBQXBCO0FBQ0EsTUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFNO0FBQ2pCLGFBQVUsSUFBVjtBQUNBLE9BQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2YsU0FBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixJQUFwQjtBQUNBO0FBQ0QsR0FMRDtBQU1BLE1BQUksVUFBVSxhQUFhLENBQUMsT0FBNUI7QUFDQSxlQUFhLE9BQWI7QUFDQSxZQUFVLFdBQVcsS0FBWCxFQUFrQixJQUFsQixDQUFWOztBQUVBLE1BQUksT0FBSixFQUFhO0FBQ1osUUFBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixJQUFwQjtBQUNBO0FBQ0QsRUFmRDtBQWdCQTs7QUFFRDs7Ozs7OztBQU9PLFNBQVMsYUFBVCxDQUF3QixRQUF4QixFQUFrQztBQUN4QyxRQUFRLE9BQU8sbUJBQVAsQ0FBMkIsUUFBM0IsRUFBcUMsTUFBckMsSUFBK0MsQ0FBdkQ7QUFDQTs7QUFFTSxTQUFTLFdBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsRUFBOUIsRUFBa0M7QUFDeEMsS0FBSSxVQUFVLGlIQUFkO0FBQ0E7QUFDQSxLQUFJLE1BQU0sRUFBQyxHQUFHLEVBQUosRUFBUSxHQUFHLEVBQVgsRUFBVjtBQUNBLEVBQUMsVUFBVSxFQUFYLEVBQWUsS0FBZixDQUFxQixHQUFyQixFQUEwQixPQUExQixDQUFrQyxVQUFDLENBQUQsRUFBTztBQUN4QyxNQUFNLFlBQVksSUFBSSxHQUFKLEdBQVUsRUFBNUI7O0FBRUEsTUFBSSxVQUFVLFVBQVYsQ0FBcUIsR0FBckIsQ0FBSixFQUErQjtBQUM5QixPQUFJLENBQUosQ0FBTSxJQUFOLENBQVcsU0FBWDtBQUNBLE9BQUksQ0FBSixDQUFNLElBQU4sQ0FBVyxTQUFYO0FBQ0EsR0FIRCxNQUlLO0FBQ0osT0FBSSxRQUFRLElBQVIsQ0FBYSxDQUFiLElBQWtCLEdBQWxCLEdBQXdCLEdBQTVCLEVBQWlDLElBQWpDLENBQXNDLFNBQXRDO0FBQ0E7QUFDRCxFQVZEOztBQWFBLEtBQUksQ0FBSixHQUFRLElBQUksQ0FBSixDQUFNLElBQU4sQ0FBVyxHQUFYLENBQVI7QUFDQSxLQUFJLENBQUosR0FBUSxJQUFJLENBQUosQ0FBTSxJQUFOLENBQVcsR0FBWCxDQUFSO0FBQ0EsUUFBTyxHQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTLHNCQUFULENBQWlDLFNBQWpDLEVBQTRDLElBQTVDLEVBQWtELEdBQWxELEVBQXVEOztBQUU3RCxLQUFJLFNBQVMsU0FBVCxJQUFzQixTQUFTLElBQW5DLEVBQXlDO0FBQ3hDO0FBQ0E7QUFDRCxLQUFJLEtBQUssc0JBQUwsS0FBZ0MsU0FBaEMsSUFBNkMsS0FBSyxzQkFBTCxLQUFnQyxJQUFqRixFQUF1RjtBQUN0RixTQUFPLEtBQUssc0JBQUwsQ0FBNEIsU0FBNUIsQ0FBUDtBQUNBO0FBQ0QsS0FBSSxRQUFRLFNBQVIsSUFBcUIsUUFBUSxJQUFqQyxFQUF1QztBQUN0QyxRQUFNLEdBQU47QUFDQTs7QUFFRCxLQUNDLGdCQUFnQixFQURqQjtBQUFBLEtBRUMsSUFBSSxDQUZMO0FBQUEsS0FHQyxnQkFIRDtBQUFBLEtBSUMsTUFBTSxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBSlA7QUFBQSxLQUtDLFNBQVMsSUFBSSxNQUxkOztBQVFBLE1BQUssSUFBSSxDQUFULEVBQVksSUFBSSxNQUFoQixFQUF3QixHQUF4QixFQUE2QjtBQUM1QixNQUFJLElBQUksQ0FBSixFQUFPLFNBQVAsQ0FBaUIsT0FBakIsQ0FBeUIsU0FBekIsSUFBc0MsQ0FBQyxDQUEzQyxFQUE4QztBQUM3QyxtQkFBYyxJQUFJLENBQUosRUFBTyxTQUFQLENBQWlCLEtBQWpCLENBQXVCLEdBQXZCLEVBQTRCLElBQTVCLENBQWlDLEdBQWpDLENBQWQ7QUFDQSxPQUFJLFFBQVEsT0FBUixPQUFvQixTQUFwQixVQUFvQyxDQUFDLENBQXpDLEVBQTRDO0FBQzNDLGtCQUFjLENBQWQsSUFBbUIsSUFBSSxDQUFKLENBQW5CO0FBQ0E7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsUUFBTyxhQUFQO0FBQ0E7O0FBRUQsZUFBSyxLQUFMLEdBQWEsZUFBSyxLQUFMLElBQWMsRUFBM0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLFVBQXhCO0FBQ0EsZUFBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixRQUF0QjtBQUNBLGVBQUssS0FBTCxDQUFXLGFBQVgsR0FBMkIsYUFBM0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLFdBQXpCO0FBQ0EsZUFBSyxLQUFMLENBQVcsc0JBQVgsR0FBb0Msc0JBQXBDOzs7QUN4SUE7Ozs7OztRQVlnQixhLEdBQUEsYTtRQWtCQSxVLEdBQUEsVTtRQVlBLGUsR0FBQSxlO1FBZUEsZSxHQUFBLGU7UUFnREEsWSxHQUFBLFk7UUFpQkEsa0IsR0FBQSxrQjs7QUF4SGhCOzs7O0FBQ0E7Ozs7QUFFTyxJQUFJLGtDQUFhLEVBQWpCOztBQUVQOzs7OztBQUtPLFNBQVMsYUFBVCxDQUF3QixHQUF4QixFQUE2Qjs7QUFFbkMsS0FBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUM1QixRQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLENBQU47QUFDQTs7QUFFRCxLQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVQ7QUFDQSxJQUFHLFNBQUgsaUJBQTJCLHlCQUFXLEdBQVgsQ0FBM0I7QUFDQSxRQUFPLEdBQUcsVUFBSCxDQUFjLElBQXJCO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTLFVBQVQsQ0FBcUIsR0FBckIsRUFBcUM7QUFBQSxLQUFYLElBQVcsdUVBQUosRUFBSTs7QUFDM0MsUUFBUSxPQUFPLENBQUMsSUFBVCxHQUFpQixnQkFBZ0IsR0FBaEIsQ0FBakIsR0FBd0MsZ0JBQWdCLElBQWhCLENBQS9DO0FBQ0E7O0FBRUQ7Ozs7Ozs7O0FBUU8sU0FBUyxlQUFULENBQTBCLElBQTFCLEVBQWdDOztBQUV0QyxLQUFJLE9BQU8sSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM3QixRQUFNLElBQUksS0FBSixDQUFVLGtDQUFWLENBQU47QUFDQTs7QUFFRCxRQUFRLFFBQVEsQ0FBQyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVYsR0FBK0IsS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBZixDQUEvQixHQUFtRSxJQUExRTtBQUNBOztBQUVEOzs7Ozs7QUFNTyxTQUFTLGVBQVQsQ0FBMEIsR0FBMUIsRUFBK0I7O0FBRXJDLEtBQUksT0FBTyxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDNUIsUUFBTSxJQUFJLEtBQUosQ0FBVSxpQ0FBVixDQUFOO0FBQ0E7O0FBRUQsS0FBSSxhQUFKOztBQUVBO0FBQ0EsS0FBSSxDQUFDLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBTCxFQUFnQztBQUMvQixRQUFNLElBQUksS0FBSixDQUFVLCtCQUFWLENBQU47QUFDQTs7QUFFRCxLQUFJLFdBQVcsTUFBZixFQUF1QjtBQUN0QixPQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsUUFBUSxXQUFXLE1BQW5DLEVBQTJDLElBQUksS0FBL0MsRUFBc0QsR0FBdEQsRUFBMkQ7QUFDMUQsT0FBTSxRQUFPLFdBQVcsQ0FBWCxDQUFiOztBQUVBLE9BQUksT0FBTyxLQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQy9CLFVBQU0sSUFBSSxLQUFKLENBQVUscUNBQVYsQ0FBTjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLE1BQUssSUFBSSxLQUFJLENBQVIsRUFBVyxTQUFRLFdBQVcsTUFBbkMsRUFBMkMsS0FBSSxNQUEvQyxFQUFzRCxJQUF0RCxFQUEyRDs7QUFFMUQsU0FBTyxXQUFXLEVBQVgsRUFBYyxHQUFkLENBQVA7O0FBRUEsTUFBSSxTQUFTLFNBQVQsSUFBc0IsU0FBUyxJQUFuQyxFQUF5QztBQUN4QyxVQUFPLElBQVA7QUFDQTtBQUNEOztBQUVEO0FBQ0EsS0FDQyxNQUFNLGFBQWEsR0FBYixDQURQO0FBQUEsS0FFQyxnQkFBZ0IsbUJBQW1CLEdBQW5CLENBRmpCOztBQUtBLFFBQU8sQ0FBQyxrREFBa0QsSUFBbEQsQ0FBdUQsR0FBdkQsSUFBOEQsT0FBOUQsR0FBd0UsT0FBekUsSUFBb0YsR0FBcEYsR0FBMEYsYUFBakc7QUFDQTs7QUFFRDs7Ozs7O0FBTU8sU0FBUyxZQUFULENBQXVCLEdBQXZCLEVBQTRCOztBQUVsQyxLQUFJLE9BQU8sR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzVCLFFBQU0sSUFBSSxLQUFKLENBQVUsaUNBQVYsQ0FBTjtBQUNBOztBQUVELEtBQUksVUFBVSxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsQ0FBZixDQUFkOztBQUVBLFFBQU8sQ0FBQyxRQUFRLE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBRCxHQUF3QixRQUFRLFNBQVIsQ0FBa0IsUUFBUSxXQUFSLENBQW9CLEdBQXBCLElBQTJCLENBQTdDLENBQXhCLEdBQTBFLEVBQWpGO0FBQ0E7O0FBRUQ7Ozs7OztBQU1PLFNBQVMsa0JBQVQsQ0FBNkIsU0FBN0IsRUFBd0M7O0FBRTlDLEtBQUksT0FBTyxTQUFQLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2xDLFFBQU0sSUFBSSxLQUFKLENBQVUsdUNBQVYsQ0FBTjtBQUNBOztBQUVELFNBQVEsU0FBUjtBQUNDLE9BQUssS0FBTDtBQUNBLE9BQUssS0FBTDtBQUNDLFVBQU8sS0FBUDtBQUNELE9BQUssTUFBTDtBQUNBLE9BQUssT0FBTDtBQUNBLE9BQUssT0FBTDtBQUNDLFVBQU8sTUFBUDtBQUNELE9BQUssS0FBTDtBQUNBLE9BQUssS0FBTDtBQUNBLE9BQUssS0FBTDtBQUNDLFVBQU8sS0FBUDtBQUNEO0FBQ0MsVUFBTyxTQUFQO0FBYkY7QUFlQTs7QUFFRCxlQUFLLEtBQUwsR0FBYSxlQUFLLEtBQUwsSUFBYyxFQUEzQjtBQUNBLGVBQUssS0FBTCxDQUFXLGFBQVgsR0FBMkIsYUFBM0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLFVBQXhCO0FBQ0EsZUFBSyxLQUFMLENBQVcsZUFBWCxHQUE2QixlQUE3QjtBQUNBLGVBQUssS0FBTCxDQUFXLGVBQVgsR0FBNkIsZUFBN0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxZQUFYLEdBQTBCLFlBQTFCO0FBQ0EsZUFBSyxLQUFMLENBQVcsa0JBQVgsR0FBZ0Msa0JBQWhDOzs7OztBQ3ZKQTs7Ozs7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLENBQUMsTUFBTSxTQUFOLENBQWdCLE9BQXJCLEVBQThCO0FBQzdCLE9BQU0sU0FBTixDQUFnQixPQUFoQixHQUEwQixVQUFDLGFBQUQsRUFBZ0IsU0FBaEIsRUFBOEI7O0FBRXZELE1BQUksVUFBSjs7QUFFQTtBQUNBO0FBQ0EsTUFBSSxjQUFTLFNBQVQsSUFBc0IsY0FBUyxJQUFuQyxFQUF5QztBQUN4QyxTQUFNLElBQUksU0FBSixDQUFjLCtCQUFkLENBQU47QUFDQTs7QUFFRCxNQUFJLElBQUksaUJBQVI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSSxNQUFNLEVBQUUsTUFBRixLQUFhLENBQXZCOztBQUVBO0FBQ0EsTUFBSSxRQUFRLENBQVosRUFBZTtBQUNkLFVBQU8sQ0FBQyxDQUFSO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBLE1BQUksSUFBSSxDQUFDLFNBQUQsSUFBYyxDQUF0Qjs7QUFFQSxNQUFJLEtBQUssR0FBTCxDQUFTLENBQVQsTUFBZ0IsUUFBcEIsRUFBOEI7QUFDN0IsT0FBSSxDQUFKO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLEtBQUssR0FBVCxFQUFjO0FBQ2IsVUFBTyxDQUFDLENBQVI7QUFDQTs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxNQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBTCxHQUFTLENBQVQsR0FBYSxNQUFNLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBNUIsRUFBeUMsQ0FBekMsQ0FBSjs7QUFFQTtBQUNBLFNBQU8sSUFBSSxHQUFYLEVBQWdCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBSSxLQUFLLENBQUwsSUFBVSxFQUFFLENBQUYsTUFBUyxhQUF2QixFQUFzQztBQUNyQyxXQUFPLENBQVA7QUFDQTtBQUNEO0FBQ0E7QUFDRCxTQUFPLENBQUMsQ0FBUjtBQUNBLEVBNUREO0FBNkRBOztBQUVEO0FBQ0E7QUFDQSxJQUFJLG1CQUFTLFdBQVQsS0FBeUIsU0FBN0IsRUFBd0M7QUFDdkMsb0JBQVMsV0FBVCxHQUF1QixZQUFNOztBQUU1QixNQUFJLFVBQUo7O0FBRUEsTUFBSSxtQkFBUyxpQkFBVCxFQUFKO0FBQ0EsSUFBRSxTQUFGLEdBQWUsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiLEVBQWQ7QUFDQSxJQUFFLFVBQUYsR0FBZSxJQUFmO0FBQ0EsSUFBRSxRQUFGLEdBQWEsSUFBYjtBQUNBLElBQUUsWUFBRixHQUFpQixJQUFqQjs7QUFFQSxJQUFFLFNBQUYsR0FBYyxVQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLFVBQWhCLEVBQStCO0FBQzVDLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLE9BQUwsR0FBZSxDQUFDLENBQUMsT0FBakI7QUFDQSxhQUFLLFVBQUwsR0FBa0IsQ0FBQyxDQUFDLFVBQXBCO0FBQ0EsT0FBSSxDQUFDLFVBQUssT0FBVixFQUFtQjtBQUNsQixjQUFLLGVBQUwsR0FBdUIsWUFBTTtBQUM1QixlQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsZUFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsS0FIRDtBQUlBO0FBQ0QsR0FWRDs7QUFZQSxTQUFPLENBQVA7QUFDQSxFQXZCRDtBQXdCQTs7QUFFRDtBQUNBO0FBQ0EsSUFBSSxPQUFPLE9BQU8sTUFBZCxLQUF5QixVQUE3QixFQUF5QztBQUN4QyxRQUFPLE1BQVAsR0FBZ0IsVUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUU7O0FBRTVDOztBQUNBLE1BQUksV0FBVyxJQUFYLElBQW1CLFdBQVcsU0FBbEMsRUFBNkM7QUFBRTtBQUM5QyxTQUFNLElBQUksU0FBSixDQUFjLDRDQUFkLENBQU47QUFDQTs7QUFFRCxNQUFJLEtBQUssT0FBTyxNQUFQLENBQVQ7O0FBRUEsT0FBSyxJQUFJLFFBQVEsQ0FBakIsRUFBb0IsUUFBUSxVQUFVLE1BQXRDLEVBQThDLE9BQTlDLEVBQXVEO0FBQ3RELE9BQUksYUFBYSxVQUFVLEtBQVYsQ0FBakI7O0FBRUEsT0FBSSxlQUFlLElBQW5CLEVBQXlCO0FBQUU7QUFDMUIsU0FBSyxJQUFJLE9BQVQsSUFBb0IsVUFBcEIsRUFBZ0M7QUFDL0I7QUFDQSxTQUFJLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxVQUFyQyxFQUFpRCxPQUFqRCxDQUFKLEVBQStEO0FBQzlELFNBQUcsT0FBSCxJQUFjLFdBQVcsT0FBWCxDQUFkO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDQSxFQXRCRDtBQXVCQTs7QUFFRDtBQUNBO0FBQ0EsSUFBSSxDQUFDLE1BQU0sU0FBTixDQUFnQixRQUFyQixFQUErQjtBQUM5QixRQUFPLGNBQVAsQ0FBc0IsTUFBTSxTQUE1QixFQUF1QyxVQUF2QyxFQUFtRDtBQUNsRCxTQUFPLGVBQVMsYUFBVCxFQUF3QixTQUF4QixFQUFtQzs7QUFFekM7QUFDQSxPQUFJLFNBQVMsSUFBVCxJQUFpQixTQUFTLFNBQTlCLEVBQXlDO0FBQ3hDLFVBQU0sSUFBSSxTQUFKLENBQWMsK0JBQWQsQ0FBTjtBQUNBOztBQUVELE9BQUksSUFBSSxPQUFPLElBQVAsQ0FBUjs7QUFFQTtBQUNBLE9BQUksTUFBTSxFQUFFLE1BQUYsS0FBYSxDQUF2Qjs7QUFFQTtBQUNBLE9BQUksUUFBUSxDQUFaLEVBQWU7QUFDZCxXQUFPLEtBQVA7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsT0FBSSxJQUFJLFlBQVksQ0FBcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLENBQUwsR0FBUyxDQUFULEdBQWEsTUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQTVCLEVBQXlDLENBQXpDLENBQVI7O0FBRUE7QUFDQSxVQUFPLElBQUksR0FBWCxFQUFnQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxFQUFFLENBQUYsTUFBUyxhQUFiLEVBQTRCO0FBQzNCLFlBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRDtBQUNBLFVBQU8sS0FBUDtBQUNBO0FBM0NpRCxFQUFuRDtBQTZDQTs7QUFFRCxJQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLFFBQXRCLEVBQWdDO0FBQy9CLFFBQU8sU0FBUCxDQUFpQixRQUFqQixHQUE0QixZQUFXO0FBQ3RDLFNBQU8sT0FBTyxTQUFQLENBQWlCLE9BQWpCLENBQXlCLEtBQXpCLENBQStCLElBQS9CLEVBQXFDLFNBQXJDLE1BQW9ELENBQUMsQ0FBNUQ7QUFDQSxFQUZEO0FBR0E7O0FBRUQ7QUFDQTtBQUNBLElBQUksQ0FBQyxPQUFPLFNBQVAsQ0FBaUIsVUFBdEIsRUFBa0M7QUFDakMsUUFBTyxTQUFQLENBQWlCLFVBQWpCLEdBQThCLFVBQVMsWUFBVCxFQUF1QixRQUF2QixFQUFnQztBQUM3RCxhQUFXLFlBQVksQ0FBdkI7QUFDQSxTQUFPLEtBQUssTUFBTCxDQUFZLFFBQVosRUFBc0IsYUFBYSxNQUFuQyxNQUErQyxZQUF0RDtBQUNBLEVBSEQ7QUFJQTs7O0FDcE1EOzs7OztRQWFnQixpQixHQUFBLGlCO1FBNkJBLGlCLEdBQUEsaUI7UUFtREEsbUIsR0FBQSxtQjtRQTREQSxxQixHQUFBLHFCOztBQXZKaEI7Ozs7OztBQUVBOzs7Ozs7Ozs7QUFTTyxTQUFTLGlCQUFULENBQTRCLElBQTVCLEVBQXdGO0FBQUEsS0FBdEQsVUFBc0QsdUVBQXpDLEtBQXlDO0FBQUEsS0FBbEMsY0FBa0MsdUVBQWpCLEtBQWlCO0FBQUEsS0FBVixHQUFVLHVFQUFKLEVBQUk7OztBQUU5RixRQUFPLENBQUMsSUFBRCxJQUFTLE9BQU8sSUFBUCxLQUFnQixRQUF6QixJQUFxQyxPQUFPLENBQTVDLEdBQWdELENBQWhELEdBQW9ELElBQTNEOztBQUVBLEtBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxPQUFPLElBQWxCLElBQTBCLEVBQXRDO0FBQ0EsS0FBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE9BQU8sRUFBbEIsSUFBd0IsRUFBdEM7QUFDQSxLQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsT0FBTyxFQUFsQixDQUFkO0FBQ0EsS0FBSSxTQUFTLEtBQUssS0FBTCxDQUFXLENBQUUsT0FBTyxDQUFSLEdBQWEsR0FBZCxFQUFtQixPQUFuQixDQUEyQixDQUEzQixDQUFYLENBQWI7O0FBRUEsU0FBUSxTQUFTLENBQVQsR0FBYSxDQUFiLEdBQWlCLEtBQXpCO0FBQ0EsV0FBVSxXQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLE9BQTdCO0FBQ0EsV0FBVSxXQUFXLENBQVgsR0FBZSxDQUFmLEdBQW1CLE9BQTdCOztBQUVBLEtBQUksU0FBVSxjQUFjLFFBQVEsQ0FBdkIsSUFBZ0MsUUFBUSxFQUFSLFNBQWlCLEtBQWpCLEdBQTJCLEtBQTNELFVBQXVFLEVBQXBGO0FBQ0EsWUFBYyxVQUFVLEVBQVYsU0FBbUIsT0FBbkIsR0FBK0IsT0FBN0M7QUFDQSxpQkFBYyxVQUFVLEVBQVYsU0FBbUIsT0FBbkIsR0FBK0IsT0FBN0M7QUFDQSxpQkFBZSxjQUFELFVBQXdCLFNBQVMsRUFBVCxTQUFrQixNQUFsQixHQUE2QixNQUFyRCxJQUFpRSxFQUEvRTs7QUFFQSxRQUFPLE1BQVA7QUFDQTs7QUFFRDs7Ozs7Ozs7QUFRTyxTQUFTLGlCQUFULENBQTRCLElBQTVCLEVBQW9FO0FBQUEsS0FBbEMsY0FBa0MsdUVBQWpCLEtBQWlCO0FBQUEsS0FBVixHQUFVLHVFQUFKLEVBQUk7OztBQUUxRSxLQUFJLE9BQU8sSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM3QixRQUFNLElBQUksU0FBSixDQUFjLHVCQUFkLENBQU47QUFDQTs7QUFFRCxLQUFJLENBQUMsS0FBSyxLQUFMLENBQVcscUJBQVgsQ0FBTCxFQUF3QztBQUN2QyxRQUFNLElBQUksU0FBSixDQUFjLDJDQUFkLENBQU47QUFDQTs7QUFFRCxLQUNDLFFBQVEsS0FBSyxLQUFMLENBQVcsR0FBWCxDQURUO0FBQUEsS0FFQyxRQUFRLENBRlQ7QUFBQSxLQUdDLFVBQVUsQ0FIWDtBQUFBLEtBSUMsU0FBUyxDQUpWO0FBQUEsS0FLQyxVQUFVLENBTFg7QUFBQSxLQU1DLGVBTkQ7O0FBU0EsU0FBUSxNQUFNLE1BQWQ7QUFDQztBQUNBLE9BQUssQ0FBTDtBQUNDLGFBQVUsU0FBUyxNQUFNLENBQU4sQ0FBVCxFQUFtQixFQUFuQixDQUFWO0FBQ0E7QUFDRCxPQUFLLENBQUw7QUFDQyxhQUFVLFNBQVMsTUFBTSxDQUFOLENBQVQsRUFBbUIsRUFBbkIsQ0FBVjtBQUNBLGFBQVUsU0FBUyxNQUFNLENBQU4sQ0FBVCxFQUFtQixFQUFuQixDQUFWO0FBQ0E7QUFDRCxPQUFLLENBQUw7QUFDQSxPQUFLLENBQUw7QUFDQyxXQUFRLFNBQVMsTUFBTSxDQUFOLENBQVQsRUFBbUIsRUFBbkIsQ0FBUjtBQUNBLGFBQVUsU0FBUyxNQUFNLENBQU4sQ0FBVCxFQUFtQixFQUFuQixDQUFWO0FBQ0EsYUFBVSxTQUFTLE1BQU0sQ0FBTixDQUFULEVBQW1CLEVBQW5CLENBQVY7QUFDQSxZQUFTLGlCQUFpQixTQUFTLE1BQU0sQ0FBTixDQUFULElBQXFCLEdBQXRDLEdBQTRDLENBQXJEO0FBQ0E7O0FBZkY7O0FBbUJBLFVBQVcsUUFBUSxJQUFWLEdBQXFCLFVBQVUsRUFBL0IsR0FBc0MsT0FBdEMsR0FBZ0QsTUFBekQ7QUFDQSxRQUFPLFdBQVksTUFBRCxDQUFTLE9BQVQsQ0FBaUIsQ0FBakIsQ0FBWCxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7OztBQVNPLFNBQVMsbUJBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsT0FBcEMsRUFBdUQ7QUFBQSxLQUFWLEdBQVUsdUVBQUosRUFBSTs7O0FBRTdELFFBQU8sQ0FBQyxJQUFELElBQVMsT0FBTyxJQUFQLEtBQWdCLFFBQXpCLElBQXFDLE9BQU8sQ0FBNUMsR0FBZ0QsQ0FBaEQsR0FBb0QsSUFBM0Q7O0FBRUEsS0FDQyxXQUFXLEtBRFo7QUFBQSxLQUVDLFNBQVMsUUFBUSxVQUZsQjtBQUFBLEtBR0MsWUFBWSxPQUFPLENBQVAsQ0FIYjtBQUFBLEtBSUMsaUJBQWtCLE9BQU8sQ0FBUCxNQUFjLE9BQU8sQ0FBUCxDQUpqQztBQUFBLEtBS0MsaUJBQWlCLGlCQUFpQixDQUFqQixHQUFxQixDQUx2QztBQUFBLEtBTUMsWUFBWSxPQUFPLE1BQVAsR0FBZ0IsY0FBaEIsR0FBaUMsT0FBTyxjQUFQLENBQWpDLEdBQTBELEdBTnZFO0FBQUEsS0FPQyxRQUFRLEtBQUssS0FBTCxDQUFXLE9BQU8sSUFBbEIsSUFBMEIsRUFQbkM7QUFBQSxLQVFDLFVBQVUsS0FBSyxLQUFMLENBQVcsT0FBTyxFQUFsQixJQUF3QixFQVJuQztBQUFBLEtBU0MsVUFBVSxLQUFLLEtBQUwsQ0FBVyxPQUFPLEVBQWxCLENBVFg7QUFBQSxLQVVDLFNBQVMsS0FBSyxLQUFMLENBQVcsQ0FBRSxPQUFPLENBQVIsR0FBYSxHQUFkLEVBQW1CLE9BQW5CLENBQTJCLENBQTNCLENBQVgsQ0FWVjtBQUFBLEtBV0MsTUFBTSxDQUNMLENBQUMsTUFBRCxFQUFTLEdBQVQsQ0FESyxFQUVMLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FGSyxFQUdMLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FISyxFQUlMLENBQUMsS0FBRCxFQUFRLEdBQVIsQ0FKSyxDQVhQOztBQW1CQSxNQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxJQUFJLE1BQTFCLEVBQWtDLElBQUksR0FBdEMsRUFBMkMsR0FBM0MsRUFBZ0Q7QUFDL0MsTUFBSSxPQUFPLE9BQVAsQ0FBZSxJQUFJLENBQUosRUFBTyxDQUFQLENBQWYsSUFBNEIsQ0FBQyxDQUFqQyxFQUFvQztBQUNuQyxjQUFXLElBQVg7QUFDQSxHQUZELE1BR0ssSUFBSSxRQUFKLEVBQWM7QUFDbEIsT0FBSSxlQUFlLEtBQW5CO0FBQ0EsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzdCLFFBQUksSUFBSSxDQUFKLEVBQU8sQ0FBUCxJQUFZLENBQWhCLEVBQW1CO0FBQ2xCLG9CQUFlLElBQWY7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsT0FBSSxDQUFDLFlBQUwsRUFBbUI7QUFDbEI7QUFDQTs7QUFFRCxPQUFJLENBQUMsY0FBTCxFQUFxQjtBQUNwQixhQUFTLFlBQVksTUFBckI7QUFDQTtBQUNELFlBQVMsSUFBSSxDQUFKLEVBQU8sQ0FBUCxJQUFZLFNBQVosR0FBd0IsTUFBakM7QUFDQSxPQUFJLGNBQUosRUFBb0I7QUFDbkIsYUFBUyxJQUFJLENBQUosRUFBTyxDQUFQLElBQVksTUFBckI7QUFDQTtBQUNELGVBQVksSUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFaO0FBQ0E7QUFDRDs7QUFFRCxTQUFRLGlCQUFSLEdBQTRCLE1BQTVCO0FBQ0E7O0FBRUQ7Ozs7OztBQU1PLFNBQVMscUJBQVQsQ0FBZ0MsS0FBaEMsRUFBdUM7O0FBRTdDLEtBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzlCLFFBQU0sSUFBSSxTQUFKLENBQWMsaUNBQWQsQ0FBTjtBQUNBOztBQUVELFNBQVEsTUFBTSxPQUFOLENBQWMsR0FBZCxFQUFtQixHQUFuQixDQUFSOztBQUVBLEtBQ0MsT0FBTyxDQURSO0FBQUEsS0FFQyxhQUFjLE1BQU0sT0FBTixDQUFjLEdBQWQsSUFBcUIsQ0FBQyxDQUF2QixHQUE0QixNQUFNLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLENBQWpCLEVBQW9CLE1BQWhELEdBQXlELENBRnZFO0FBQUEsS0FHQyxhQUFhLENBSGQ7O0FBTUEsU0FBUSxNQUFNLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLE9BQWpCLEVBQVI7O0FBRUEsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDdEMsZUFBYSxDQUFiO0FBQ0EsTUFBSSxJQUFJLENBQVIsRUFBVztBQUNWLGdCQUFhLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFiLENBQWI7QUFDQTtBQUNELFVBQVEsT0FBTyxNQUFNLENBQU4sQ0FBUCxJQUFtQixVQUEzQjtBQUNBO0FBQ0QsUUFBTyxPQUFPLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBUCxDQUFQO0FBQ0E7O0FBRUQsZUFBSyxLQUFMLEdBQWEsZUFBSyxLQUFMLElBQWMsRUFBM0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxpQkFBWCxHQUErQixpQkFBL0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxpQkFBWCxHQUErQixpQkFBL0I7QUFDQSxlQUFLLEtBQUwsQ0FBVyxtQkFBWCxHQUFpQyxtQkFBakM7QUFDQSxlQUFLLEtBQUwsQ0FBVyxxQkFBWCxHQUFtQyxxQkFBbkMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIiwidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50O1xufSBlbHNlIHtcbiAgICB2YXIgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddO1xuXG4gICAgaWYgKCFkb2NjeSkge1xuICAgICAgICBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J10gPSBtaW5Eb2M7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbn1cbiIsImlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi9tZWpzJztcbmltcG9ydCB7RU4gYXMgZW59IGZyb20gJy4uL2xhbmd1YWdlcy9lbic7XG5pbXBvcnQge2VzY2FwZUhUTUwsIGlzT2JqZWN0RW1wdHl9IGZyb20gJy4uL3V0aWxzL2dlbmVyYWwnO1xuXG4vKipcbiAqIExvY2FsZS5cbiAqXG4gKiBUaGlzIG9iamVjdCBtYW5hZ2VzIHRyYW5zbGF0aW9ucyB3aXRoIHBsdXJhbGl6YXRpb24uIEFsc28gZGVhbHMgd2l0aCBXb3JkUHJlc3MgY29tcGF0aWJpbGl0eS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmxldCBpMThuID0ge2xhbmc6ICdlbicsIGVuOiBlbn07XG5cbi8qKlxuICogTGFuZ3VhZ2Ugc2V0dGVyL2dldHRlclxuICpcbiAqIEBwYXJhbSB7Kn0gYXJncyAgQ2FuIHBhc3MgdGhlIGxhbmd1YWdlIGNvZGUgYW5kL29yIHRoZSB0cmFuc2xhdGlvbiBzdHJpbmdzIGFzIGFuIE9iamVjdFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5pMThuLmxhbmd1YWdlID0gKC4uLmFyZ3MpID0+IHtcblxuXHRpZiAoYXJncyAhPT0gbnVsbCAmJiBhcmdzICE9PSB1bmRlZmluZWQgJiYgYXJncy5sZW5ndGgpIHtcblxuXHRcdGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0xhbmd1YWdlIGNvZGUgbXVzdCBiZSBhIHN0cmluZyB2YWx1ZScpO1xuXHRcdH1cblxuXHRcdGlmICghYXJnc1swXS5tYXRjaCgvXlthLXpdezJ9KFxcLVthLXpdezJ9KT8kL2kpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdMYW5ndWFnZSBjb2RlIG11c3QgaGF2ZSBmb3JtYXQgYHh4YCBvciBgeHgteHhgJyk7XG5cdFx0fVxuXG5cdFx0aTE4bi5sYW5nID0gYXJnc1swXTtcblxuXHRcdC8vIENoZWNrIGlmIGxhbmd1YWdlIHN0cmluZ3Mgd2VyZSBhZGRlZDsgb3RoZXJ3aXNlLCBjaGVjayB0aGUgc2Vjb25kIGFyZ3VtZW50IG9yIHNldCB0byBFbmdsaXNoIGFzIGRlZmF1bHRcblx0XHRpZiAoaTE4blthcmdzWzBdXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhcmdzWzFdID0gYXJnc1sxXSAhPT0gbnVsbCAmJiBhcmdzWzFdICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnID8gYXJnc1sxXSA6IHt9O1xuXHRcdFx0aTE4blthcmdzWzBdXSA9ICFpc09iamVjdEVtcHR5KGFyZ3NbMV0pID8gYXJnc1sxXSA6IGVuO1xuXHRcdH0gZWxzZSBpZiAoYXJnc1sxXSAhPT0gbnVsbCAmJiBhcmdzWzFdICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRpMThuW2FyZ3NbMF1dID0gYXJnc1sxXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gaTE4bi5sYW5nO1xufTtcblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBzdHJpbmcgaW4gdGhlIGxhbmd1YWdlIHNldCB1cCAob3IgRW5nbGlzaCBieSBkZWZhdWx0KVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge251bWJlcn0gcGx1cmFsUGFyYW1cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuaTE4bi50ID0gKG1lc3NhZ2UsIHBsdXJhbFBhcmFtID0gbnVsbCkgPT4ge1xuXG5cdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgbWVzc2FnZS5sZW5ndGgpIHtcblxuXHRcdGxldFxuXHRcdFx0c3RyLFxuXHRcdFx0cGx1cmFsRm9ybVxuXHRcdFx0O1xuXG5cdFx0Y29uc3QgbGFuZ3VhZ2UgPSBpMThuLmxhbmd1YWdlKCk7XG5cblx0XHQvKipcblx0XHQgKiBNb2RpZnkgc3RyaW5nIHVzaW5nIGFsZ29yaXRobSB0byBkZXRlY3QgcGx1cmFsIGZvcm1zLlxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTM1MzQwOC9tZXNzYWdlZm9ybWF0LWluLWphdmFzY3JpcHQtcGFyYW1ldGVycy1pbi1sb2NhbGl6ZWQtdWktc3RyaW5nc1xuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfFN0cmluZ1tdfSBpbnB1dCAgIC0gU3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgdG8gcGljayB0aGUgcGx1cmFsIGZvcm1cblx0XHQgKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyICAgICAgICAgICAtIE51bWJlciB0byBkZXRlcm1pbmUgdGhlIHByb3BlciBwbHVyYWwgZm9ybVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBmb3JtICAgICAgICAgICAgIC0gTnVtYmVyIG9mIGxhbmd1YWdlIGZhbWlseSB0byBhcHBseSBwbHVyYWwgZm9ybVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cblx0XHQgKi9cblx0XHRjb25zdCBfcGx1cmFsID0gKGlucHV0LCBudW1iZXIsIGZvcm0pID0+IHtcblxuXHRcdFx0aWYgKHR5cGVvZiBpbnB1dCAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGZvcm0gIT09ICdudW1iZXInKSB7XG5cdFx0XHRcdHJldHVybiBpbnB1dDtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKlxuXHRcdFx0ICogQHJldHVybiB7RnVuY3Rpb25bXX1cblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGxldCBfcGx1cmFsRm9ybXMgPSAoKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC8vIDA6IENoaW5lc2UsIEphcGFuZXNlLCBLb3JlYW4sIFBlcnNpYW4sIFR1cmtpc2gsIFRoYWksIExhbywgQXltYXLDoSxcblx0XHRcdFx0XHQvLyBUaWJldGFuLCBDaGlnYSwgRHpvbmdraGEsIEluZG9uZXNpYW4sIExvamJhbiwgR2VvcmdpYW4sIEthemFraCwgS2htZXIsIEt5cmd5eiwgTWFsYXksXG5cdFx0XHRcdFx0Ly8gQnVybWVzZSwgWWFrdXQsIFN1bmRhbmVzZSwgVGF0YXIsIFV5Z2h1ciwgVmlldG5hbWVzZSwgV29sb2Zcblx0XHRcdFx0XHQoLi4uYXJncykgPT4gYXJnc1sxXSxcblxuXHRcdFx0XHRcdC8vIDE6IERhbmlzaCwgRHV0Y2gsIEVuZ2xpc2gsIEZhcm9lc2UsIEZyaXNpYW4sIEdlcm1hbiwgTm9yd2VnaWFuLCBTd2VkaXNoLCBFc3RvbmlhbiwgRmlubmlzaCxcblx0XHRcdFx0XHQvLyBIdW5nYXJpYW4sIEJhc3F1ZSwgR3JlZWssIEhlYnJldywgSXRhbGlhbiwgUG9ydHVndWVzZSwgU3BhbmlzaCwgQ2F0YWxhbiwgQWZyaWthYW5zLFxuXHRcdFx0XHRcdC8vIEFuZ2lrYSwgQXNzYW1lc2UsIEFzdHVyaWFuLCBBemVyYmFpamFuaSwgQnVsZ2FyaWFuLCBCZW5nYWxpLCBCb2RvLCBBcmFnb25lc2UsIERvZ3JpLFxuXHRcdFx0XHRcdC8vIEVzcGVyYW50bywgQXJnZW50aW5lYW4gU3BhbmlzaCwgRnVsYWgsIEZyaXVsaWFuLCBHYWxpY2lhbiwgR3VqYXJhdGksIEhhdXNhLFxuXHRcdFx0XHRcdC8vIEhpbmRpLCBDaGhhdHRpc2dhcmhpLCBBcm1lbmlhbiwgSW50ZXJsaW5ndWEsIEdyZWVubGFuZGljLCBLYW5uYWRhLCBLdXJkaXNoLCBMZXR6ZWJ1cmdlc2NoLFxuXHRcdFx0XHRcdC8vIE1haXRoaWxpLCBNYWxheWFsYW0sIE1vbmdvbGlhbiwgTWFuaXB1cmksIE1hcmF0aGksIE5haHVhdGwsIE5lYXBvbGl0YW4sIE5vcndlZ2lhbiBCb2ttYWwsXG5cdFx0XHRcdFx0Ly8gTmVwYWxpLCBOb3J3ZWdpYW4gTnlub3JzaywgTm9yd2VnaWFuIChvbGQgY29kZSksIE5vcnRoZXJuIFNvdGhvLCBPcml5YSwgUHVuamFiaSwgUGFwaWFtZW50byxcblx0XHRcdFx0XHQvLyBQaWVtb250ZXNlLCBQYXNodG8sIFJvbWFuc2gsIEtpbnlhcndhbmRhLCBTYW50YWxpLCBTY290cywgU2luZGhpLCBOb3J0aGVybiBTYW1pLCBTaW5oYWxhLFxuXHRcdFx0XHRcdC8vIFNvbWFsaSwgU29uZ2hheSwgQWxiYW5pYW4sIFN3YWhpbGksIFRhbWlsLCBUZWx1Z3UsIFR1cmttZW4sIFVyZHUsIFlvcnViYVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiAoYXJnc1swXSA9PT0gMSkgPyBhcmdzWzFdIDogYXJnc1syXSxcblxuXHRcdFx0XHRcdC8vIDI6IEZyZW5jaCwgQnJhemlsaWFuIFBvcnR1Z3Vlc2UsIEFjaG9saSwgQWthbiwgQW1oYXJpYywgTWFwdWR1bmd1biwgQnJldG9uLCBGaWxpcGlubyxcblx0XHRcdFx0XHQvLyBHdW4sIExpbmdhbGEsIE1hdXJpdGlhbiBDcmVvbGUsIE1hbGFnYXN5LCBNYW9yaSwgT2NjaXRhbiwgVGFqaWssIFRpZ3JpbnlhLCBVemJlaywgV2FsbG9vblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiAoYXJnc1swXSA9PT0gMCB8fCBhcmdzWzBdID09PSAxKSA/IGFyZ3NbMV0gOiBhcmdzWzJdLFxuXG5cdFx0XHRcdFx0Ly8gMzogTGF0dmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxICYmIGFyZ3NbMF0gJSAxMDAgIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDQ6IFNjb3R0aXNoIEdhZWxpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSB8fCBhcmdzWzBdID09PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMiB8fCBhcmdzWzBdID09PSAxMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+IDIgJiYgYXJnc1swXSA8IDIwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDU6ICBSb21hbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMCB8fCAoYXJnc1swXSAlIDEwMCA+IDAgJiYgYXJnc1swXSAlIDEwMCA8IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA2OiBMaXRodWFuaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAgPT09IDEgJiYgYXJnc1swXSAlIDEwMCAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA+PSAyICYmIChhcmdzWzBdICUgMTAwIDwgMTAgfHwgYXJnc1swXSAlIDEwMCA+PSAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA3OiBCZWxhcnVzaWFuLCBCb3NuaWFuLCBDcm9hdGlhbiwgU2VyYmlhbiwgUnVzc2lhbiwgVWtyYWluaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAgPT09IDEgJiYgYXJnc1swXSAlIDEwMCAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA+PSAyICYmIGFyZ3NbMF0gJSAxMCA8PSA0ICYmIChhcmdzWzBdICUgMTAwIDwgMTAgfHwgYXJnc1swXSAlIDEwMCA+PSAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gODogIFNsb3ZhaywgQ3plY2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPj0gMiAmJiBhcmdzWzBdIDw9IDQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gOTogUG9saXNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiBhcmdzWzBdICUgMTAgPD0gNCAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8IGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDEwOiBTbG92ZW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMDAgPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPT09IDMgfHwgYXJnc1swXSAlIDEwMCA9PT0gNCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMTogSXJpc2ggR2FlbGljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID4gMiAmJiBhcmdzWzBdIDwgNykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+IDYgJiYgYXJnc1swXSA8IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDEyOiBBcmFiaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPj0gMyAmJiBhcmdzWzBdICUgMTAwIDw9IDEwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID49IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzVdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNl07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDEzOiBNYWx0ZXNlXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAwIHx8IChhcmdzWzBdICUgMTAwID4gMSAmJiBhcmdzWzBdICUgMTAwIDwgMTEpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID4gMTAgJiYgYXJnc1swXSAlIDEwMCA8IDIwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE0OiBNYWNlZG9uaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAgPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxNTogIEljZWxhbmRpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKGFyZ3NbMF0gIT09IDExICYmIGFyZ3NbMF0gJSAxMCA9PT0gMSkgPyBhcmdzWzFdIDogYXJnc1syXTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gTmV3IGFkZGl0aW9uc1xuXG5cdFx0XHRcdFx0Ly8gMTY6ICBLYXNodWJpYW5cblx0XHRcdFx0XHQvLyBJbiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvTG9jYWxpemF0aW9uL0xvY2FsaXphdGlvbl9hbmRfUGx1cmFscyNMaXN0X29mX19wbHVyYWxSdWxlc1xuXHRcdFx0XHRcdC8vIEJyZXRvbiBpcyBsaXN0ZWQgYXMgIzE2IGJ1dCBpbiB0aGUgTG9jYWxpemF0aW9uIEd1aWRlIGl0IGJlbG9uZ3MgdG8gdGhlIGdyb3VwIDJcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA+PSAyICYmIGFyZ3NbMF0gJSAxMCA8PSA0ICYmIChhcmdzWzBdICUgMTAwIDwgMTAgfHxcblx0XHRcdFx0XHRcdFx0YXJnc1swXSAlIDEwMCA+PSAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTc6ICBXZWxzaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAhPT0gOCAmJiBhcmdzWzBdICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxODogIEphdmFuZXNlXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiAoYXJnc1swXSA9PT0gMCkgPyBhcmdzWzFdIDogYXJnc1syXTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTk6ICBDb3JuaXNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDIwOiAgTWFuZGlua2Fcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XTtcblx0XHRcdH0pKCk7XG5cblx0XHRcdC8vIFBlcmZvcm0gcGx1cmFsIGZvcm0gb3IgcmV0dXJuIG9yaWdpbmFsIHRleHRcblx0XHRcdHJldHVybiBfcGx1cmFsRm9ybXNbZm9ybV0uYXBwbHkobnVsbCwgW251bWJlcl0uY29uY2F0KGlucHV0KSk7XG5cdFx0fTtcblxuXHRcdC8vIEZldGNoIHRoZSBsb2NhbGl6ZWQgdmVyc2lvbiBvZiB0aGUgc3RyaW5nXG5cdFx0aWYgKGkxOG5bbGFuZ3VhZ2VdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHN0ciA9IGkxOG5bbGFuZ3VhZ2VdW21lc3NhZ2VdO1xuXHRcdFx0aWYgKHBsdXJhbFBhcmFtICE9PSBudWxsICYmIHR5cGVvZiBwbHVyYWxQYXJhbSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0cGx1cmFsRm9ybSA9IGkxOG5bbGFuZ3VhZ2VdWydtZWpzLnBsdXJhbC1mb3JtJ107XG5cdFx0XHRcdHN0ciA9IF9wbHVyYWwuYXBwbHkobnVsbCwgW3N0ciwgcGx1cmFsUGFyYW0sIHBsdXJhbEZvcm1dKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGYWxsYmFjayB0byBkZWZhdWx0IGxhbmd1YWdlIGlmIHJlcXVlc3RlZCB1aWQgaXMgbm90IHRyYW5zbGF0ZWRcblx0XHRpZiAoIXN0ciAmJiBpMThuLmVuKSB7XG5cdFx0XHRzdHIgPSBpMThuLmVuW21lc3NhZ2VdO1xuXHRcdFx0aWYgKHBsdXJhbFBhcmFtICE9PSBudWxsICYmIHR5cGVvZiBwbHVyYWxQYXJhbSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0cGx1cmFsRm9ybSA9IGkxOG4uZW5bJ21lanMucGx1cmFsLWZvcm0nXTtcblx0XHRcdFx0c3RyID0gX3BsdXJhbC5hcHBseShudWxsLCBbc3RyLCBwbHVyYWxQYXJhbSwgcGx1cmFsRm9ybV0pO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQXMgYSBsYXN0IHJlc29ydCwgdXNlIHRoZSByZXF1ZXN0ZWQgdWlkLCB0byBtaW1pYyBvcmlnaW5hbCBiZWhhdmlvciBvZiBpMThuIHV0aWxzXG5cdFx0Ly8gKGluIHdoaWNoIHVpZCB3YXMgdGhlIGVuZ2xpc2ggdGV4dClcblx0XHRzdHIgPSBzdHIgfHwgbWVzc2FnZTtcblxuXHRcdC8vIFJlcGxhY2UgdG9rZW5cblx0XHRpZiAocGx1cmFsUGFyYW0gIT09IG51bGwgJiYgdHlwZW9mIHBsdXJhbFBhcmFtID09PSAnbnVtYmVyJykge1xuXHRcdFx0c3RyID0gc3RyLnJlcGxhY2UoJyUxJywgcGx1cmFsUGFyYW0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBlc2NhcGVIVE1MKHN0cik7XG5cblx0fVxuXG5cdHJldHVybiBtZXNzYWdlO1xufTtcblxubWVqcy5pMThuID0gaTE4bjtcblxuLy8gYGkxOG5gIGNvbXBhdGliaWxpdHkgd29ya2Zsb3cgd2l0aCBXb3JkUHJlc3NcbmlmICh0eXBlb2YgbWVqc0wxMG4gIT09ICd1bmRlZmluZWQnKSB7XG5cdG1lanMuaTE4bi5sYW5ndWFnZShtZWpzTDEwbi5sYW5ndWFnZSwgbWVqc0wxMG4uc3RyaW5ncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGkxOG47IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuL21lanMnO1xuaW1wb3J0IHtnZXRUeXBlRnJvbUZpbGUsIGZvcm1hdFR5cGUsIGFic29sdXRpemVVcmx9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4vcmVuZGVyZXInO1xuXG4vKipcbiAqIE1lZGlhIENvcmVcbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHRoZSBmb3VuZGF0aW9uIHRvIGNyZWF0ZS9yZW5kZXIgZGlmZmVyZW50IG1lZGlhIGZvcm1hdHMuXG4gKiBAY2xhc3MgTWVkaWFFbGVtZW50XG4gKi9cbmNsYXNzIE1lZGlhRWxlbWVudCB7XG5cblx0Y29uc3RydWN0b3IgKGlkT3JOb2RlLCBvcHRpb25zKSB7XG5cdFx0XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdFxuXHRcdHQuZGVmYXVsdHMgPSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIExpc3Qgb2YgdGhlIHJlbmRlcmVycyB0byB1c2Vcblx0XHRcdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0XHRcdCAqL1xuXHRcdFx0cmVuZGVyZXJzOiBbXSxcblx0XHRcdC8qKlxuXHRcdFx0ICogTmFtZSBvZiBNZWRpYUVsZW1lbnQgY29udGFpbmVyXG5cdFx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdFx0ICovXG5cdFx0XHRmYWtlTm9kZU5hbWU6ICdtZWRpYWVsZW1lbnR3cmFwcGVyJyxcblx0XHRcdC8qKlxuXHRcdFx0ICogVGhlIHBhdGggd2hlcmUgc2hpbXMgYXJlIGxvY2F0ZWRcblx0XHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0XHQgKi9cblx0XHRcdHBsdWdpblBhdGg6ICdidWlsZC8nXG5cdFx0fTtcblxuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHQuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG5cdFx0Ly8gY3JlYXRlIG91ciBub2RlIChub3RlOiBvbGRlciB2ZXJzaW9ucyBvZiBpT1MgZG9uJ3Qgc3VwcG9ydCBPYmplY3QuZGVmaW5lUHJvcGVydHkgb24gRE9NIG5vZGVzKVxuXHRcdHQubWVkaWFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRpb25zLmZha2VOb2RlTmFtZSk7XG5cdFx0dC5tZWRpYUVsZW1lbnQub3B0aW9ucyA9IG9wdGlvbnM7XG5cblx0XHRsZXRcblx0XHRcdGlkID0gaWRPck5vZGUsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHRpZiAodHlwZW9mIGlkT3JOb2RlID09PSAnc3RyaW5nJykge1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRPck5vZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgPSBpZE9yTm9kZTtcblx0XHRcdGlkID0gaWRPck5vZGUuaWQ7XG5cdFx0fVxuXG5cdFx0aWQgPSBpZCB8fCBgbWVqc18keyhNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMikpfWA7XG5cblx0XHRpZiAodC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsICYmXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5hcHBlbmRDaGlsZCkge1xuXHRcdFx0Ly8gY2hhbmdlIGlkXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIGAke2lkfV9mcm9tX21lanNgKTtcblxuXHRcdFx0Ly8gYWRkIG5leHQgdG8gdGhpcyBvbmVcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0Lm1lZGlhRWxlbWVudCwgdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblxuXHRcdFx0Ly8gaW5zZXJ0IHRoaXMgb25lIGluc2lkZVxuXHRcdFx0dC5tZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQodC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVE9ETzogd2hlcmUgdG8gcHV0IHRoZSBub2RlP1xuXHRcdH1cblxuXHRcdHQubWVkaWFFbGVtZW50LmlkID0gaWQ7XG5cdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJzID0ge307XG5cdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPSBudWxsO1xuXHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyTmFtZSA9IG51bGw7XG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHJlbmRlcmVyIHdhcyBmb3VuZCBvciBub3Rcblx0XHQgKlxuXHRcdCAqIEBwdWJsaWNcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcmVuZGVyZXJOYW1lXG5cdFx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlc1xuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0dC5tZWRpYUVsZW1lbnQuY2hhbmdlUmVuZGVyZXIgPSAocmVuZGVyZXJOYW1lLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRcdGxldCB0ID0gdGhpcztcblxuXHRcdFx0Ly8gY2hlY2sgZm9yIGEgbWF0Y2ggb24gdGhlIGN1cnJlbnQgcmVuZGVyZXJcblx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsICYmXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLm5hbWUgPT09IHJlbmRlcmVyTmFtZSkge1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5wYXVzZSgpO1xuXHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCkge1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zaG93KCk7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnNldFNyYyhtZWRpYUZpbGVzWzBdLnNyYyk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBleGlzdGluZyByZW5kZXJlciBpcyBub3QgdGhlIHJpZ2h0IG9uZSwgdGhlbiBoaWRlIGl0XG5cdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5wYXVzZSgpO1xuXHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCkge1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNlZSBpZiB3ZSBoYXZlIHRoZSByZW5kZXJlciBhbHJlYWR5IGNyZWF0ZWRcblx0XHRcdGxldCBuZXdSZW5kZXJlciA9IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyc1tyZW5kZXJlck5hbWVdLFxuXHRcdFx0XHRuZXdSZW5kZXJlclR5cGUgPSBudWxsO1xuXG5cdFx0XHRpZiAobmV3UmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiBuZXdSZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHRuZXdSZW5kZXJlci5zaG93KCk7XG5cdFx0XHRcdG5ld1JlbmRlcmVyLnNldFNyYyhtZWRpYUZpbGVzWzBdLnNyYyk7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID0gbmV3UmVuZGVyZXI7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyTmFtZSA9IHJlbmRlcmVyTmFtZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGxldCByZW5kZXJlckFycmF5ID0gdC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMubGVuZ3RoID8gdC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMgOlxuXHRcdFx0XHRyZW5kZXJlci5vcmRlcjtcblxuXHRcdFx0Ly8gZmluZCB0aGUgZGVzaXJlZCByZW5kZXJlciBpbiB0aGUgYXJyYXkgb2YgcG9zc2libGUgb25lc1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSByZW5kZXJlckFycmF5Lmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJlbmRlcmVyQXJyYXlbaV07XG5cblx0XHRcdFx0aWYgKGluZGV4ID09PSByZW5kZXJlck5hbWUpIHtcblxuXHRcdFx0XHRcdC8vIGNyZWF0ZSB0aGUgcmVuZGVyZXJcblx0XHRcdFx0XHRjb25zdCByZW5kZXJlckxpc3QgPSByZW5kZXJlci5yZW5kZXJlcnM7XG5cdFx0XHRcdFx0bmV3UmVuZGVyZXJUeXBlID0gcmVuZGVyZXJMaXN0W2luZGV4XTtcblxuXHRcdFx0XHRcdGxldCByZW5kZXJPcHRpb25zID0gT2JqZWN0LmFzc2lnbihuZXdSZW5kZXJlclR5cGUub3B0aW9ucywgdC5tZWRpYUVsZW1lbnQub3B0aW9ucyk7XG5cdFx0XHRcdFx0bmV3UmVuZGVyZXIgPSBuZXdSZW5kZXJlclR5cGUuY3JlYXRlKHQubWVkaWFFbGVtZW50LCByZW5kZXJPcHRpb25zLCBtZWRpYUZpbGVzKTtcblx0XHRcdFx0XHRuZXdSZW5kZXJlci5uYW1lID0gcmVuZGVyZXJOYW1lO1xuXG5cdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGxhdGVyXG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJzW25ld1JlbmRlcmVyVHlwZS5uYW1lXSA9IG5ld1JlbmRlcmVyO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID0gbmV3UmVuZGVyZXI7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJOYW1lID0gcmVuZGVyZXJOYW1lO1xuXG5cdFx0XHRcdFx0bmV3UmVuZGVyZXIuc2hvdygpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBTZXQgdGhlIGVsZW1lbnQgZGltZW5zaW9ucyBiYXNlZCBvbiBzZWxlY3RlZCByZW5kZXJlcidzIHNldFNpemUgbWV0aG9kXG5cdFx0ICpcblx0XHQgKiBAcHVibGljXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuXHRcdCAqL1xuXHRcdHQubWVkaWFFbGVtZW50LnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3Rcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhZGRQcm9wZXJ0eSA9IChvYmosIG5hbWUsIG9uR2V0LCBvblNldCkgPT4ge1xuXG5cdFx0XHRcdC8vIHdyYXBwZXIgZnVuY3Rpb25zXG5cdFx0XHRcdGxldCBvbGRWYWx1ZSA9IG9ialtuYW1lXTtcblx0XHRcdFx0Y29uc3Rcblx0XHRcdFx0XHRnZXRGbiA9ICgpID0+IG9uR2V0LmFwcGx5KG9iaiwgW29sZFZhbHVlXSksXG5cdFx0XHRcdFx0c2V0Rm4gPSAobmV3VmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdG9sZFZhbHVlID0gb25TZXQuYXBwbHkob2JqLCBbbmV3VmFsdWVdKTtcblx0XHRcdFx0XHRcdHJldHVybiBvbGRWYWx1ZTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIE1vZGVybiBicm93c2VycywgSUU5KyAoSUU4IG9ubHkgd29ya3Mgb24gRE9NIG9iamVjdHMsIG5vdCBub3JtYWwgSlMgb2JqZWN0cylcblx0XHRcdFx0aWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuXG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuXHRcdFx0XHRcdFx0Z2V0OiBnZXRGbixcblx0XHRcdFx0XHRcdHNldDogc2V0Rm5cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIE9sZGVyIEZpcmVmb3hcblx0XHRcdFx0fSBlbHNlIGlmIChvYmouX19kZWZpbmVHZXR0ZXJfXykge1xuXG5cdFx0XHRcdFx0b2JqLl9fZGVmaW5lR2V0dGVyX18obmFtZSwgZ2V0Rm4pO1xuXHRcdFx0XHRcdG9iai5fX2RlZmluZVNldHRlcl9fKG5hbWUsIHNldEZuKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGlmIChwcm9wTmFtZSAhPT0gJ3NyYycpIHtcblxuXHRcdFx0XHRcdGNvbnN0XG5cdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YCxcblx0XHRcdFx0XHRcdGdldEZuID0gKCkgPT4gKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpID8gdC5tZWRpYUVsZW1lbnQucmVuZGVyZXJbYGdldCR7Y2FwTmFtZX1gXSgpIDogbnVsbCxcblx0XHRcdFx0XHRcdHNldEZuID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJbYHNldCR7Y2FwTmFtZX1gXSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRhZGRQcm9wZXJ0eSh0Lm1lZGlhRWxlbWVudCwgcHJvcE5hbWUsIGdldEZuLCBzZXRGbik7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnRbYGdldCR7Y2FwTmFtZX1gXSA9IGdldEZuO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50W2BzZXQke2NhcE5hbWV9YF0gPSBzZXRGbjtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdC8vIGBzcmNgIGlzIGEgcHJvcGVydHkgc2VwYXJhdGVkIGZyb20gdGhlIG90aGVycyBzaW5jZSBpdCBjYXJyaWVzIHRoZSBsb2dpYyB0byBzZXQgdGhlIHByb3BlciByZW5kZXJlclxuXHRcdFx0Ly8gYmFzZWQgb24gdGhlIG1lZGlhIGZpbGVzIGRldGVjdGVkXG5cdFx0XHRnZXRTcmMgPSAoKSA9PiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkgPyB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5nZXRTcmMoKSA6IG51bGwsXG5cdFx0XHRzZXRTcmMgPSAodmFsdWUpID0+IHtcblxuXHRcdFx0XHRsZXQgbWVkaWFGaWxlcyA9IFtdO1xuXG5cdFx0XHRcdC8vIGNsZWFuIHVwIFVSTHNcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0c3JjOiB2YWx1ZSxcblx0XHRcdFx0XHRcdHR5cGU6IHZhbHVlID8gZ2V0VHlwZUZyb21GaWxlKHZhbHVlKSA6ICcnXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRzcmMgPSBhYnNvbHV0aXplVXJsKHZhbHVlW2ldLnNyYyksXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSB2YWx1ZVtpXS50eXBlXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHNyYzogc3JjLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiAodHlwZSA9PT0gJycgfHwgdHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQpICYmIHNyYyA/XG5cdFx0XHRcdFx0XHRcdFx0Z2V0VHlwZUZyb21GaWxlKHNyYykgOiB0eXBlXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZpbmQgYSByZW5kZXJlciBhbmQgVVJMIG1hdGNoXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHJlbmRlckluZm8gPSByZW5kZXJlci5zZWxlY3QobWVkaWFGaWxlcyxcblx0XHRcdFx0XHRcdCh0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycy5sZW5ndGggPyB0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycyA6IFtdKSksXG5cdFx0XHRcdFx0ZXZlbnRcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIEVuc3VyZSB0aGF0IHRoZSBvcmlnaW5hbCBnZXRzIHRoZSBmaXJzdCBzb3VyY2UgZm91bmRcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgKG1lZGlhRmlsZXNbMF0uc3JjIHx8ICcnKSk7XG5cblx0XHRcdFx0Ly8gZGlkIHdlIGZpbmQgYSByZW5kZXJlcj9cblx0XHRcdFx0aWYgKHJlbmRlckluZm8gPT09IG51bGwpIHtcblx0XHRcdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KCdlcnJvcicsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0ZXZlbnQubWVzc2FnZSA9ICdObyByZW5kZXJlciBmb3VuZCc7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdHVybiBvbiB0aGUgcmVuZGVyZXIgKHRoaXMgY2hlY2tzIGZvciB0aGUgZXhpc3RpbmcgcmVuZGVyZXIgYWxyZWFkeSlcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuY2hhbmdlUmVuZGVyZXIocmVuZGVySW5mby5yZW5kZXJlck5hbWUsIG1lZGlhRmlsZXMpO1xuXG5cdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9PT0gdW5kZWZpbmVkIHx8IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID09PSBudWxsKSB7XG5cdFx0XHRcdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudCgnZXJyb3InLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdGV2ZW50Lm1lc3NhZ2UgPSAnRXJyb3IgY3JlYXRpbmcgcmVuZGVyZXInO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBjdXJyZW50IHJlbmRlcmVyXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50W21ldGhvZE5hbWVdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwgJiZcblx0XHRcdFx0XHRcdHR5cGVvZiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlclttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykgP1xuXHRcdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJbbWV0aG9kTmFtZV0oYXJncykgOiBudWxsO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHR9O1xuXG5cdFx0Ly8gQXNzaWduIGFsbCBtZXRob2RzL3Byb3BlcnRpZXMvZXZlbnRzIHRvIGZha2Ugbm9kZSBpZiByZW5kZXJlciB3YXMgZm91bmRcblx0XHRhZGRQcm9wZXJ0eSh0Lm1lZGlhRWxlbWVudCwgJ3NyYycsIGdldFNyYywgc2V0U3JjKTtcblx0XHR0Lm1lZGlhRWxlbWVudC5nZXRTcmMgPSBnZXRTcmM7XG5cdFx0dC5tZWRpYUVsZW1lbnQuc2V0U3JjID0gc2V0U3JjO1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbk1ldGhvZHMobWV0aG9kc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gSUUgJiYgaU9TXG5cdFx0aWYgKCF0Lm1lZGlhRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG5cblx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50cyA9IHt9O1xuXG5cdFx0XHQvLyBzdGFydDogZmFrZSBldmVudHNcblx0XHRcdHQubWVkaWFFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgPSAoZXZlbnROYW1lLCBjYWxsYmFjaykgPT4ge1xuXHRcdFx0XHQvLyBjcmVhdGUgb3IgZmluZCB0aGUgYXJyYXkgb2YgY2FsbGJhY2tzIGZvciB0aGlzIGV2ZW50TmFtZVxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXSA9IHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuXG5cdFx0XHRcdC8vIHB1c2ggdGhlIGNhbGxiYWNrIGludG8gdGhlIHN0YWNrXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuXHRcdFx0fTtcblx0XHRcdHQubWVkaWFFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgPSAoZXZlbnROYW1lLCBjYWxsYmFjaykgPT4ge1xuXHRcdFx0XHQvLyBubyBldmVudE5hbWUgbWVhbnMgcmVtb3ZlIGFsbCBsaXN0ZW5lcnNcblx0XHRcdFx0aWYgKCFldmVudE5hbWUpIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHMgPSB7fTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHNlZSBpZiB3ZSBoYXZlIGFueSBjYWxsYmFja3MgZm9yIHRoaXMgZXZlbnROYW1lXG5cdFx0XHRcdGxldCBjYWxsYmFja3MgPSB0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXTtcblxuXHRcdFx0XHRpZiAoIWNhbGxiYWNrcykge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY2hlY2sgZm9yIGEgc3BlY2lmaWMgY2FsbGJhY2tcblx0XHRcdFx0aWYgKCFjYWxsYmFjaykge1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdID0gW107XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIHNwZWNpZmljIGNhbGxiYWNrXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrc1tpXSA9PT0gY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuXHRcdFx0ICovXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50ID0gKGV2ZW50KSA9PiB7XG5cblx0XHRcdFx0bGV0IGNhbGxiYWNrcyA9IHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudC50eXBlXTtcblxuXHRcdFx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2tzW2ldLmFwcGx5KG51bGwsIFtldmVudF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAodC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsKSB7XG5cdFx0XHRsZXQgbWVkaWFGaWxlcyA9IFtdO1xuXG5cdFx0XHRzd2l0Y2ggKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG5cblx0XHRcdFx0Y2FzZSAnaWZyYW1lJzpcblx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0dHlwZTogJycsXG5cdFx0XHRcdFx0XHRzcmM6IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlICdhdWRpbyc6XG5cdFx0XHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdG4sXG5cdFx0XHRcdFx0XHRzcmMsXG5cdFx0XHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRcdFx0c291cmNlcyA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5jaGlsZE5vZGVzLmxlbmd0aCxcblx0XHRcdFx0XHRcdG5vZGVTb3VyY2UgPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0Ly8gQ29uc2lkZXIgaWYgbm9kZSBjb250YWlucyB0aGUgYHNyY2AgYW5kIGB0eXBlYCBhdHRyaWJ1dGVzXG5cdFx0XHRcdFx0aWYgKG5vZGVTb3VyY2UpIHtcblx0XHRcdFx0XHRcdGxldCBub2RlID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlO1xuXHRcdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogZm9ybWF0VHlwZShub2RlU291cmNlLCBub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpKSxcblx0XHRcdFx0XHRcdFx0c3JjOiBub2RlU291cmNlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyB0ZXN0IDxzb3VyY2U+IHR5cGVzIHRvIHNlZSBpZiB0aGV5IGFyZSB1c2FibGVcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgc291cmNlczsgaSsrKSB7XG5cdFx0XHRcdFx0XHRuID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0XHRpZiAobi5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgbi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzb3VyY2UnKSB7XG5cdFx0XHRcdFx0XHRcdHNyYyA9IG4uZ2V0QXR0cmlidXRlKCdzcmMnKTtcblx0XHRcdFx0XHRcdFx0dHlwZSA9IGZvcm1hdFR5cGUoc3JjLCBuLmdldEF0dHJpYnV0ZSgndHlwZScpKTtcblx0XHRcdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHt0eXBlOiB0eXBlLCBzcmM6IHNyY30pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aWYgKG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5zcmMgPSBtZWRpYUZpbGVzO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnN1Y2Nlc3MpIHtcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9wdGlvbnMuc3VjY2Vzcyh0Lm1lZGlhRWxlbWVudCwgdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHR9XG5cblx0XHQvLyBAdG9kbzogVmVyaWZ5IGlmIHRoaXMgaXMgbmVlZGVkXG5cdFx0Ly8gaWYgKHQubWVkaWFFbGVtZW50Lm9wdGlvbnMuZXJyb3IpIHtcblx0XHQvLyBcdHQubWVkaWFFbGVtZW50Lm9wdGlvbnMuZXJyb3IodGhpcy5tZWRpYUVsZW1lbnQsIHRoaXMubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0Ly8gfVxuXG5cdFx0cmV0dXJuIHQubWVkaWFFbGVtZW50O1xuXHR9XG59XG5cbndpbmRvdy5NZWRpYUVsZW1lbnQgPSBNZWRpYUVsZW1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IE1lZGlhRWxlbWVudDsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbi8vIE5hbWVzcGFjZVxubGV0IG1lanMgPSB7fTtcblxuLy8gdmVyc2lvbiBudW1iZXJcbm1lanMudmVyc2lvbiA9ICczLjAuMCc7XG5cbi8vIEJhc2ljIEhUTUw1IHNldHRpbmdzXG5tZWpzLmh0bWw1bWVkaWEgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRwcm9wZXJ0aWVzOiBbXG5cdFx0Ly8gR0VUL1NFVFxuXHRcdCd2b2x1bWUnLCAnc3JjJywgJ2N1cnJlbnRUaW1lJywgJ211dGVkJyxcblxuXHRcdC8vIEdFVCBvbmx5XG5cdFx0J2R1cmF0aW9uJywgJ3BhdXNlZCcsICdlbmRlZCcsXG5cblx0XHQvLyBPVEhFUlNcblx0XHQnZXJyb3InLCAnY3VycmVudFNyYycsICduZXR3b3JrU3RhdGUnLCAncHJlbG9hZCcsICdidWZmZXJlZCcsICdidWZmZXJlZEJ5dGVzJywgJ2J1ZmZlcmVkVGltZScsICdyZWFkeVN0YXRlJywgJ3NlZWtpbmcnLFxuXHRcdCdpbml0aWFsVGltZScsICdzdGFydE9mZnNldFRpbWUnLCAnZGVmYXVsdFBsYXliYWNrUmF0ZScsICdwbGF5YmFja1JhdGUnLCAncGxheWVkJywgJ3NlZWthYmxlJywgJ2F1dG9wbGF5JywgJ2xvb3AnLCAnY29udHJvbHMnXG5cdF0sXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRtZXRob2RzOiBbXG5cdFx0J2xvYWQnLCAncGxheScsICdwYXVzZScsICdjYW5QbGF5VHlwZSdcblx0XSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdGV2ZW50czogW1xuXHRcdCdsb2Fkc3RhcnQnLCAncHJvZ3Jlc3MnLCAnc3VzcGVuZCcsICdhYm9ydCcsICdlcnJvcicsICdlbXB0aWVkJywgJ3N0YWxsZWQnLCAncGxheScsICdwYXVzZScsICdsb2FkZWRtZXRhZGF0YScsXG5cdFx0J2xvYWRlZGRhdGEnLCAnd2FpdGluZycsICdwbGF5aW5nJywgJ2NhbnBsYXknLCAnY2FucGxheXRocm91Z2gnLCAnc2Vla2luZycsICdzZWVrZWQnLCAndGltZXVwZGF0ZScsICdlbmRlZCcsXG5cdFx0J3JhdGVjaGFuZ2UnLCAnZHVyYXRpb25jaGFuZ2UnLCAndm9sdW1lY2hhbmdlJ1xuXHRdLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0bWVkaWFUeXBlczogW1xuXHRcdCdhdWRpby9tcDMnLCAnYXVkaW8vb2dnJywgJ2F1ZGlvL29nYScsICdhdWRpby93YXYnLCAnYXVkaW8veC13YXYnLCAnYXVkaW8vd2F2ZScsICdhdWRpby94LXBuLXdhdicsICdhdWRpby9tcGVnJywgJ2F1ZGlvL21wNCcsXG5cdFx0J3ZpZGVvL21wNCcsICd2aWRlby93ZWJtJywgJ3ZpZGVvL29nZydcblx0XVxufTtcblxud2luZG93Lm1lanMgPSBtZWpzO1xuXG5leHBvcnQgZGVmYXVsdCBtZWpzOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi9tZWpzJztcblxuLyoqXG4gKlxuICogQ2xhc3MgdG8gbWFuYWdlIHJlbmRlcmVyIHNlbGVjdGlvbiBhbmQgYWRkaXRpb24uXG4gKiBAY2xhc3MgUmVuZGVyZXJcbiAqL1xuY2xhc3MgUmVuZGVyZXIge1xuXG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHR0aGlzLnJlbmRlcmVycyA9IHt9O1xuXHRcdHRoaXMub3JkZXIgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhIG5ldyByZW5kZXJlci5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyIC0gQW4gb2JqZWN0IHdpdGggYWxsIHRoZSByZW5kZXJlZCBpbmZvcm1hdGlvbiAobmFtZSBSRVFVSVJFRClcblx0ICogQG1ldGhvZCBhZGRcblx0ICovXG5cdGFkZCAocmVuZGVyZXIpIHtcblxuXHRcdGlmIChyZW5kZXJlci5uYW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlbmRlcmVyIG11c3QgY29udGFpbiBhdCBsZWFzdCBgbmFtZWAgcHJvcGVydHknKTtcblx0XHR9XG5cblx0XHR0aGlzLnJlbmRlcmVyc1tyZW5kZXJlci5uYW1lXSA9IHJlbmRlcmVyO1xuXHRcdHRoaXMub3JkZXIucHVzaChyZW5kZXJlci5uYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJdGVyYXRlIGEgbGlzdCBvZiByZW5kZXJlcnMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9uZSBzaG91bGQgdGhlIHBsYXllciB1c2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgLSBBIGxpc3Qgb2Ygc291cmNlIGFuZCB0eXBlIG9idGFpbmVkIGZyb20gdmlkZW8vYXVkaW8vc291cmNlIHRhZ3M6IFt7c3JjOicnLHR5cGU6Jyd9XVxuXHQgKiBAcGFyYW0gez9TdHJpbmdbXX0gcmVuZGVyZXJzIC0gT3B0aW9uYWwgbGlzdCBvZiBwcmUtc2VsZWN0ZWQgcmVuZGVyZXJzXG5cdCAqIEByZXR1cm4gez9PYmplY3R9IFRoZSByZW5kZXJlcidzIG5hbWUgYW5kIHNvdXJjZSBzZWxlY3RlZFxuXHQgKiBAbWV0aG9kIHNlbGVjdFxuXHQgKi9cblx0c2VsZWN0IChtZWRpYUZpbGVzLCByZW5kZXJlcnMgPSBbXSkge1xuXG5cdFx0cmVuZGVyZXJzID0gcmVuZGVyZXJzLmxlbmd0aCA/IHJlbmRlcmVyczogdGhpcy5vcmRlcjtcblxuXHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IHJlbmRlcmVycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRsZXRcblx0XHRcdFx0a2V5ID0gcmVuZGVyZXJzW2ldLFxuXHRcdFx0XHRyZW5kZXJlciA9IHRoaXMucmVuZGVyZXJzW2tleV1cblx0XHRcdDtcblxuXHRcdFx0aWYgKHJlbmRlcmVyICE9PSBudWxsICYmIHJlbmRlcmVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGpsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiByZW5kZXJlci5jYW5QbGF5VHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgbWVkaWFGaWxlc1tqXS50eXBlID09PSAnc3RyaW5nJyAmJlxuXHRcdFx0XHRcdFx0cmVuZGVyZXIuY2FuUGxheVR5cGUobWVkaWFGaWxlc1tqXS50eXBlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0cmVuZGVyZXJOYW1lOiByZW5kZXJlci5uYW1lLFxuXHRcdFx0XHRcdFx0XHRzcmM6ICBtZWRpYUZpbGVzW2pdLnNyY1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8vIFNldHRlcnMvZ2V0dGVyc1xuXG5cdHNldCBvcmRlcihvcmRlcikge1xuXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KG9yZGVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignb3JkZXIgbXVzdCBiZSBhbiBhcnJheSBvZiBzdHJpbmdzLicpO1xuXHRcdH1cblxuXHRcdHRoaXMuX29yZGVyID0gb3JkZXI7XG5cdH1cblxuXHRzZXQgcmVuZGVyZXJzKHJlbmRlcmVycykge1xuXG5cdFx0aWYgKHJlbmRlcmVycyAhPT0gbnVsbCAmJiB0eXBlb2YgcmVuZGVyZXJzICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigncmVuZGVyZXJzIG11c3QgYmUgYW4gYXJyYXkgb2Ygb2JqZWN0cy4nKTtcblx0XHR9XG5cblx0XHR0aGlzLl9yZW5kZXJlcnMgPSByZW5kZXJlcnM7XG5cdH1cblxuXHRnZXQgcmVuZGVyZXJzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yZW5kZXJlcnM7XG5cdH1cblxuXHRnZXQgb3JkZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX29yZGVyO1xuXHR9XG59XG5cbmV4cG9ydCBsZXQgcmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoKTtcblxubWVqcy5SZW5kZXJlcnMgPSByZW5kZXJlcjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgKiBhcyBGZWF0dXJlcyBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuXG5cbi8qKlxuICogRnVsbHNjcmVlbiBidXR0b25cbiAqXG4gKiBUaGlzIGZlYXR1cmUgY3JlYXRlcyBhIGJ1dHRvbiB0byB0b2dnbGUgZnVsbHNjcmVlbiBvbiB2aWRlbzsgaXQgY29uc2lkZXJzIGEgbGV0aWV0eSBvZiBwb3NzaWJpbGl0aWVzIHdoZW4gZGVhbGluZyB3aXRoIGl0XG4gKiBzaW5jZSBpdCBpcyBub3QgY29uc2lzdGVudCBhY3Jvc3MgYnJvd3NlcnMuIEl0IGFsc28gYWNjb3VudHMgZm9yIHRyaWdnZXJpbmcgdGhlIGV2ZW50IHRocm91Z2ggRmxhc2ggc2hpbS5cbiAqL1xuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdHVzZVBsdWdpbkZ1bGxTY3JlZW46IHRydWUsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0ZnVsbHNjcmVlblRleHQ6ICcnXG59KTtcblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNGdWxsU2NyZWVuOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNOYXRpdmVGdWxsU2NyZWVuOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNJbklmcmFtZTogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzUGx1Z2luQ2xpY2tUaHJvdWdoQ3JlYXRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBQb3NzaWJsZSBtb2Rlc1xuXHQgKiAoMSkgJ25hdGl2ZS1uYXRpdmUnICBIVE1MNSB2aWRlbyAgKyBicm93c2VyIGZ1bGxzY3JlZW4gKElFMTArLCBldGMuKVxuXHQgKiAoMikgJ3BsdWdpbi1uYXRpdmUnICBwbHVnaW4gdmlkZW8gKyBicm93c2VyIGZ1bGxzY3JlZW4gKGZhaWxzIGluIHNvbWUgdmVyc2lvbnMgb2YgRmlyZWZveClcblx0ICogKDMpICdmdWxsd2luZG93JyAgICAgRnVsbCB3aW5kb3cgKHJldGFpbnMgYWxsIFVJKVxuXHQgKiAoNCkgJ3BsdWdpbi1jbGljaycgICBGbGFzaCAxIC0gY2xpY2sgdGhyb3VnaCB3aXRoIHBvaW50ZXIgZXZlbnRzXG5cdCAqICg1KSAncGx1Z2luLWhvdmVyJyAgIEZsYXNoIDIgLSBob3ZlciBwb3B1cCBpbiBmbGFzaCAoSUU2LTgpXG5cdCAqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRmdWxsc2NyZWVuTW9kZTogJycsXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0Y29udGFpbmVyU2l6ZVRpbWVvdXQ6IG51bGwsXG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKi9cblx0YnVpbGRmdWxsc2NyZWVuOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblxuXHRcdGlmICghcGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRwbGF5ZXIuaXNJbklmcmFtZSA9ICh3aW5kb3cubG9jYXRpb24gIT09IHdpbmRvdy5wYXJlbnQubG9jYXRpb24pO1xuXG5cdFx0Ly8gZGV0ZWN0IG9uIHN0YXJ0XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgKCkgPT4ge1xuXHRcdFx0cGxheWVyLmRldGVjdEZ1bGxzY3JlZW5Nb2RlKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBidWlsZCBidXR0b25cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aGlkZVRpbWVvdXQgPSBudWxsLFxuXHRcdFx0ZnVsbHNjcmVlblRpdGxlID0gdC5vcHRpb25zLmZ1bGxzY3JlZW5UZXh0ID8gdC5vcHRpb25zLmZ1bGxzY3JlZW5UZXh0IDogaTE4bi50KCdtZWpzLmZ1bGxzY3JlZW4nKSxcblx0XHRcdGZ1bGxzY3JlZW5CdG4gPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW4tYnV0dG9uXCI+YCArXG5cdFx0XHRcdFx0YDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtY29udHJvbHM9XCIke3QuaWR9XCIgdGl0bGU9XCIke2Z1bGxzY3JlZW5UaXRsZX1cIiBhcmlhLWxhYmVsPVwiJHtmdWxsc2NyZWVuVGl0bGV9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpXG5cdFx0XHRcdC5vbignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRcdFx0XHQvLyB0b2dnbGUgZnVsbHNjcmVlblxuXHRcdFx0XHRcdGxldCBpc0Z1bGxTY3JlZW4gPSAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgRmVhdHVyZXMuSVNfRlVMTFNDUkVFTikgfHwgcGxheWVyLmlzRnVsbFNjcmVlbjtcblxuXHRcdFx0XHRcdGlmIChpc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZW50ZXJGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ21vdXNlb3ZlcicsICgpID0+IHtcblxuXHRcdFx0XHRcdC8vIHZlcnkgb2xkIGJyb3dzZXJzIHdpdGggYSBwbHVnaW5cblx0XHRcdFx0XHRpZiAodC5mdWxsc2NyZWVuTW9kZSA9PT0gJ3BsdWdpbi1ob3ZlcicpIHtcblx0XHRcdFx0XHRcdGlmIChoaWRlVGltZW91dCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0XHRoaWRlVGltZW91dCA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGxldCBidXR0b25Qb3MgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLFxuXHRcdFx0XHRcdFx0XHRjb250YWluZXJQb3MgPSBwbGF5ZXIuY29udGFpbmVyLm9mZnNldCgpO1xuXG5cdFx0XHRcdFx0XHRtZWRpYS5wb3NpdGlvbkZ1bGxzY3JlZW5CdXR0b24oYnV0dG9uUG9zLmxlZnQgLSBjb250YWluZXJQb3MubGVmdCwgYnV0dG9uUG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AsIHRydWUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHQuZnVsbHNjcmVlbk1vZGUgPT09ICdwbHVnaW4taG92ZXInKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGlkZVRpbWVvdXQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGhpZGVUaW1lb3V0KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0bWVkaWEuaGlkZUZ1bGxzY3JlZW5CdXR0b24oKTtcblx0XHRcdFx0XHRcdH0sIDE1MDApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9KTtcblxuXG5cdFx0cGxheWVyLmZ1bGxzY3JlZW5CdG4gPSBmdWxsc2NyZWVuQnRuO1xuXG5cdFx0dC5nbG9iYWxCaW5kKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdGxldCBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZSB8fCAwO1xuXHRcdFx0aWYgKGtleSA9PT0gMjcgJiYgKChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiBGZWF0dXJlcy5JU19GVUxMU0NSRUVOKSB8fCB0LmlzRnVsbFNjcmVlbikpIHtcblx0XHRcdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0Lm5vcm1hbEhlaWdodCA9IDA7XG5cdFx0dC5ub3JtYWxXaWR0aCA9IDA7XG5cblx0XHQvLyBzZXR1cCBuYXRpdmUgZnVsbHNjcmVlbiBldmVudFxuXHRcdGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTikge1xuXG5cdFx0XHQvL1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBEZXRlY3QgYW55IGNoYW5nZXMgb24gZnVsbHNjcmVlblxuXHRcdFx0ICpcblx0XHRcdCAqIENocm9tZSBkb2Vzbid0IGFsd2F5cyBmaXJlIHRoaXMgaW4gYW4gYDxpZnJhbWU+YFxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgZnVsbHNjcmVlbkNoYW5nZWQgPSAoKSA9PiB7XG5cdFx0XHRcdGlmIChwbGF5ZXIuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0aWYgKEZlYXR1cmVzLmlzRnVsbFNjcmVlbigpKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuaXNOYXRpdmVGdWxsU2NyZWVuID0gdHJ1ZTtcblx0XHRcdFx0XHRcdC8vIHJlc2V0IHRoZSBjb250cm9scyBvbmNlIHdlIGFyZSBmdWxseSBpbiBmdWxsIHNjcmVlblxuXHRcdFx0XHRcdFx0cGxheWVyLnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuaXNOYXRpdmVGdWxsU2NyZWVuID0gZmFsc2U7XG5cdFx0XHRcdFx0XHQvLyB3aGVuIGEgdXNlciBwcmVzc2VzIEVTQ1xuXHRcdFx0XHRcdFx0Ly8gbWFrZSBzdXJlIHRvIHB1dCB0aGUgcGxheWVyIGJhY2sgaW50byBwbGFjZVxuXHRcdFx0XHRcdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRwbGF5ZXIuZ2xvYmFsQmluZChGZWF0dXJlcy5GVUxMU0NSRUVOX0VWRU5UX05BTUUsIGZ1bGxzY3JlZW5DaGFuZ2VkKTtcblx0XHR9XG5cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZWN0IHRoZSB0eXBlIG9mIGZ1bGxzY3JlZW4gYmFzZWQgb24gYnJvd3NlcidzIGNhcGFiaWxpdGllc1xuXHQgKlxuXHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdCAqL1xuXHRkZXRlY3RGdWxsc2NyZWVuTW9kZTogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRtb2RlID0gJycsXG5cdFx0XHRpc05hdGl2ZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8obmF0aXZlfGh0bWw1KS8pICE9PSBudWxsXG5cdFx0O1xuXG5cdFx0aWYgKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIGlzTmF0aXZlKSB7XG5cdFx0XHRtb2RlID0gJ25hdGl2ZS1uYXRpdmUnO1xuXHRcdH0gZWxzZSBpZiAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgIWlzTmF0aXZlKSB7XG5cdFx0XHRtb2RlID0gJ3BsdWdpbi1uYXRpdmUnO1xuXHRcdH0gZWxzZSBpZiAodC51c2VQbHVnaW5GdWxsU2NyZWVuKSB7XG5cdFx0XHRpZiAoRmVhdHVyZXMuU1VQUE9SVF9QT0lOVEVSX0VWRU5UUykge1xuXHRcdFx0XHRtb2RlID0gJ3BsdWdpbi1jbGljayc7XG5cdFx0XHRcdC8vIHRoaXMgbmVlZHMgc29tZSBzcGVjaWFsIHNldHVwXG5cdFx0XHRcdHQuY3JlYXRlUGx1Z2luQ2xpY2tUaHJvdWdoKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtb2RlID0gJ3BsdWdpbi1ob3Zlcic7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0bW9kZSA9ICdmdWxsd2luZG93Jztcblx0XHR9XG5cblxuXHRcdHQuZnVsbHNjcmVlbk1vZGUgPSBtb2RlO1xuXHRcdHJldHVybiBtb2RlO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0Y3JlYXRlUGx1Z2luQ2xpY2tUaHJvdWdoOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gZG9uJ3QgYnVpbGQgdHdpY2Vcblx0XHRpZiAodC5pc1BsdWdpbkNsaWNrVGhyb3VnaENyZWF0ZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBhbGxvd3MgY2xpY2tpbmcgdGhyb3VnaCB0aGUgZnVsbHNjcmVlbiBidXR0b24gYW5kIGNvbnRyb2xzIGRvd24gZGlyZWN0bHkgdG8gRmxhc2hcblxuXHRcdC8qXG5cdFx0IFdoZW4gYSB1c2VyIHB1dHMgaGlzIG1vdXNlIG92ZXIgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uLCB3ZSBkaXNhYmxlIHRoZSBjb250cm9scyBzbyB0aGF0IG1vdXNlIGV2ZW50cyBjYW4gZ28gZG93biB0byBmbGFzaCAocG9pbnRlci1ldmVudHMpXG5cdFx0IFdlIHRoZW4gcHV0IGEgZGl2cyBvdmVyIHRoZSB2aWRlbyBhbmQgb24gZWl0aGVyIHNpZGUgb2YgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0IHRvIGNhcHR1cmUgbW91c2UgbW92ZW1lbnQgYW5kIHJlc3RvcmUgdGhlIGNvbnRyb2xzIG9uY2UgdGhlIG1vdXNlIG1vdmVzIG91dHNpZGUgb2YgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0ICovXG5cblx0XHRsZXQgZnVsbHNjcmVlbklzRGlzYWJsZWQgPSBmYWxzZSxcblx0XHRcdHJlc3RvcmVDb250cm9scyA9ICgpID0+IHtcblx0XHRcdFx0aWYgKGZ1bGxzY3JlZW5Jc0Rpc2FibGVkKSB7XG5cdFx0XHRcdFx0Ly8gaGlkZSB0aGUgaG92ZXJzXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSBpbiBob3ZlckRpdnMpIHtcblx0XHRcdFx0XHRcdGhvdmVyRGl2c1tpXS5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gcmVzdG9yZSB0aGUgY29udHJvbCBiYXJcblx0XHRcdFx0XHR0LmZ1bGxzY3JlZW5CdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICcnKTtcblx0XHRcdFx0XHR0LmNvbnRyb2xzLmNzcygncG9pbnRlci1ldmVudHMnLCAnJyk7XG5cblx0XHRcdFx0XHQvLyBwcmV2ZW50IGNsaWNrcyBmcm9tIHBhdXNpbmcgdmlkZW9cblx0XHRcdFx0XHR0Lm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2spO1xuXG5cdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGxhdGVyXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbklzRGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGhvdmVyRGl2cyA9IHt9LFxuXHRcdFx0aG92ZXJEaXZOYW1lcyA9IFsndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJ10sXG5cdFx0XHRwb3NpdGlvbkhvdmVyRGl2cyA9ICgpID0+IHtcblx0XHRcdFx0bGV0IGZ1bGxTY3JlZW5CdG5PZmZzZXRMZWZ0ID0gZnVsbHNjcmVlbkJ0bi5vZmZzZXQoKS5sZWZ0IC0gdC5jb250YWluZXIub2Zmc2V0KCkubGVmdCxcblx0XHRcdFx0XHRmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wID0gZnVsbHNjcmVlbkJ0bi5vZmZzZXQoKS50b3AgLSB0LmNvbnRhaW5lci5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbkJ0bldpZHRoID0gZnVsbHNjcmVlbkJ0bi5vdXRlcldpZHRoKHRydWUpLFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW5CdG5IZWlnaHQgPSBmdWxsc2NyZWVuQnRuLm91dGVySGVpZ2h0KHRydWUpLFxuXHRcdFx0XHRcdGNvbnRhaW5lcldpZHRoID0gdC5jb250YWluZXIud2lkdGgoKSxcblx0XHRcdFx0XHRjb250YWluZXJIZWlnaHQgPSB0LmNvbnRhaW5lci5oZWlnaHQoKTtcblxuXHRcdFx0XHRmb3IgKGxldCBob3ZlciBpbiBob3ZlckRpdnMpIHtcblx0XHRcdFx0XHRob3Zlci5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDB9KTsgLy8sIGJhY2tncm91bmRDb2xvcjogJyNmMDAnfSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBvdmVyIHZpZGVvLCBidXQgbm90IGNvbnRyb2xzXG5cdFx0XHRcdGhvdmVyRGl2cy50b3Bcblx0XHRcdFx0XHQud2lkdGgoY29udGFpbmVyV2lkdGgpXG5cdFx0XHRcdFx0LmhlaWdodChmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wKTtcblxuXHRcdFx0XHQvLyBvdmVyIGNvbnRyb2xzLCBidXQgbm90IHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXHRcdFx0XHRob3ZlckRpdnMubGVmdFxuXHRcdFx0XHRcdC53aWR0aChmdWxsU2NyZWVuQnRuT2Zmc2V0TGVmdClcblx0XHRcdFx0XHQuaGVpZ2h0KGZ1bGxTY3JlZW5CdG5IZWlnaHQpXG5cdFx0XHRcdFx0LmNzcyh7dG9wOiBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wfSk7XG5cblx0XHRcdFx0Ly8gYWZ0ZXIgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0XHRcdGhvdmVyRGl2cy5yaWdodFxuXHRcdFx0XHRcdC53aWR0aChjb250YWluZXJXaWR0aCAtIGZ1bGxTY3JlZW5CdG5PZmZzZXRMZWZ0IC0gZnVsbFNjcmVlbkJ0bldpZHRoKVxuXHRcdFx0XHRcdC5oZWlnaHQoZnVsbFNjcmVlbkJ0bkhlaWdodClcblx0XHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRcdHRvcDogZnVsbFNjcmVlbkJ0bk9mZnNldFRvcCxcblx0XHRcdFx0XHRcdGxlZnQ6IGZ1bGxTY3JlZW5CdG5PZmZzZXRMZWZ0ICsgZnVsbFNjcmVlbkJ0bldpZHRoXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gdW5kZXIgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0XHRcdGhvdmVyRGl2cy5ib3R0b21cblx0XHRcdFx0XHQud2lkdGgoY29udGFpbmVyV2lkdGgpXG5cdFx0XHRcdFx0LmhlaWdodChjb250YWluZXJIZWlnaHQgLSBmdWxsU2NyZWVuQnRuSGVpZ2h0IC0gZnVsbFNjcmVlbkJ0bk9mZnNldFRvcClcblx0XHRcdFx0XHQuY3NzKHt0b3A6IGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3AgKyBmdWxsU2NyZWVuQnRuSGVpZ2h0fSk7XG5cdFx0XHR9O1xuXG5cdFx0dC5nbG9iYWxCaW5kKCdyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHRwb3NpdGlvbkhvdmVyRGl2cygpO1xuXHRcdH0pO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGhvdmVyRGl2TmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGhvdmVyRGl2c1tob3ZlckRpdk5hbWVzW2ldXSA9ICQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuLWhvdmVyXCIgLz5gKVxuXHRcdFx0XHQuYXBwZW5kVG8odC5jb250YWluZXIpLm1vdXNlb3ZlcihyZXN0b3JlQ29udHJvbHMpLmhpZGUoKTtcblx0XHR9XG5cblx0XHQvLyBvbiBob3Zlciwga2lsbCB0aGUgZnVsbHNjcmVlbiBidXR0b24ncyBIVE1MIGhhbmRsaW5nLCBhbGxvd2luZyBjbGlja3MgZG93biB0byBGbGFzaFxuXHRcdGZ1bGxzY3JlZW5CdG4ub24oJ21vdXNlb3ZlcicsICgpID0+IHtcblxuXHRcdFx0aWYgKCF0LmlzRnVsbFNjcmVlbikge1xuXG5cdFx0XHRcdGxldCBidXR0b25Qb3MgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLFxuXHRcdFx0XHRcdGNvbnRhaW5lclBvcyA9IHBsYXllci5jb250YWluZXIub2Zmc2V0KCk7XG5cblx0XHRcdFx0Ly8gbW92ZSB0aGUgYnV0dG9uIGluIEZsYXNoIGludG8gcGxhY2Vcblx0XHRcdFx0bWVkaWEucG9zaXRpb25GdWxsc2NyZWVuQnV0dG9uKGJ1dHRvblBvcy5sZWZ0IC0gY29udGFpbmVyUG9zLmxlZnQsIGJ1dHRvblBvcy50b3AgLSBjb250YWluZXJQb3MudG9wLCBmYWxzZSk7XG5cblx0XHRcdFx0Ly8gYWxsb3dzIGNsaWNrIHRocm91Z2hcblx0XHRcdFx0dC5mdWxsc2NyZWVuQnRuLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuXHRcdFx0XHR0LmNvbnRyb2xzLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuXG5cdFx0XHRcdC8vIHJlc3RvcmUgY2xpY2stdG8tcGxheVxuXHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2spO1xuXG5cdFx0XHRcdC8vIHNob3cgdGhlIGRpdnMgdGhhdCB3aWxsIHJlc3RvcmUgdGhpbmdzXG5cdFx0XHRcdGZvciAobGV0IGkgaW4gaG92ZXJEaXZzKSB7XG5cdFx0XHRcdFx0aG92ZXJEaXZzW2ldLnNob3coKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBvc2l0aW9uSG92ZXJEaXZzKCk7XG5cblx0XHRcdFx0ZnVsbHNjcmVlbklzRGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHQvLyByZXN0b3JlIGNvbnRyb2xzIGFueXRpbWUgdGhlIHVzZXIgZW50ZXJzIG9yIGxlYXZlcyBmdWxsc2NyZWVuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbmNoYW5nZScsICgpID0+IHtcblx0XHRcdHQuaXNGdWxsU2NyZWVuID0gIXQuaXNGdWxsU2NyZWVuO1xuXHRcdFx0Ly8gZG9uJ3QgYWxsb3cgcGx1Z2luIGNsaWNrIHRvIHBhdXNlIHZpZGVvIC0gbWVzc2VzIHdpdGhcblx0XHRcdC8vIHBsdWdpbidzIGNvbnRyb2xzXG5cdFx0XHRpZiAodC5pc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0dC5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cdFx0XHR9XG5cdFx0XHRyZXN0b3JlQ29udHJvbHMoKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gdGhlIG1vdXNlb3V0IGV2ZW50IGRvZXNuJ3Qgd29yayBvbiB0aGUgZnVsbHNjcmVuIGJ1dHRvbiwgYmVjYXVzZSB3ZSBhbHJlYWR5IGtpbGxlZCB0aGUgcG9pbnRlci1ldmVudHNcblx0XHQvLyBzbyB3ZSB1c2UgdGhlIGRvY3VtZW50Lm1vdXNlbW92ZSBldmVudCB0byByZXN0b3JlIGNvbnRyb2xzIHdoZW4gdGhlIG1vdXNlIG1vdmVzIG91dHNpZGUgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cblx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNlbW92ZScsIChlKSA9PiB7XG5cblx0XHRcdC8vIGlmIHRoZSBtb3VzZSBpcyBhbnl3aGVyZSBidXQgdGhlIGZ1bGxzY2VlbiBidXR0b24sIHRoZW4gcmVzdG9yZSBpdCBhbGxcblx0XHRcdGlmIChmdWxsc2NyZWVuSXNEaXNhYmxlZCkge1xuXG5cdFx0XHRcdGNvbnN0IGZ1bGxzY3JlZW5CdG5Qb3MgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpO1xuXG5cdFx0XHRcdGlmIChlLnBhZ2VZIDwgZnVsbHNjcmVlbkJ0blBvcy50b3AgfHwgZS5wYWdlWSA+IGZ1bGxzY3JlZW5CdG5Qb3MudG9wICsgZnVsbHNjcmVlbkJ0bi5vdXRlckhlaWdodCh0cnVlKSB8fFxuXHRcdFx0XHRcdGUucGFnZVggPCBmdWxsc2NyZWVuQnRuUG9zLmxlZnQgfHwgZS5wYWdlWCA+IGZ1bGxzY3JlZW5CdG5Qb3MubGVmdCArIGZ1bGxzY3JlZW5CdG4ub3V0ZXJXaWR0aCh0cnVlKSkge1xuXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbkJ0bi5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXHRcdFx0XHRcdHQuY29udHJvbHMuY3NzKCdwb2ludGVyLWV2ZW50cycsICcnKTtcblxuXHRcdFx0XHRcdGZ1bGxzY3JlZW5Jc0Rpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0dC5pc1BsdWdpbkNsaWNrVGhyb3VnaENyZWF0ZWQgPSB0cnVlO1xuXHR9LFxuXHQvKipcblx0ICogRmVhdHVyZSBkZXN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGNsZWFuYCBhbmQgdGhlIG5hbWUgdGhhdCB3YXMgdXNlZCBpbiBmZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICovXG5cdGNsZWFuZnVsbHNjcmVlbjogZnVuY3Rpb24gKHBsYXllcikgIHtcblx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGVudGVyRnVsbFNjcmVlbjogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRpc05hdGl2ZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8oaHRtbDV8bmF0aXZlKS8pICE9PSBudWxsXG5cdFx0O1xuXG5cdFx0aWYgKEZlYXR1cmVzLklTX0lPUyAmJiBGZWF0dXJlcy5IQVNfSU9TX0ZVTExTQ1JFRU4gJiYgdHlwZW9mIHQubWVkaWEud2Via2l0RW50ZXJGdWxsc2NyZWVuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0Lm1lZGlhLndlYmtpdEVudGVyRnVsbHNjcmVlbigpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHNldCBpdCB0byBub3Qgc2hvdyBzY3JvbGwgYmFycyBzbyAxMDAlIHdpbGwgd29ya1xuXHRcdCQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbmApO1xuXG5cdFx0Ly8gc3RvcmUgc2l6aW5nXG5cdFx0dC5ub3JtYWxIZWlnaHQgPSB0LmNvbnRhaW5lci5oZWlnaHQoKTtcblx0XHR0Lm5vcm1hbFdpZHRoID0gdC5jb250YWluZXIud2lkdGgoKTtcblxuXG5cdFx0Ly8gYXR0ZW1wdCB0byBkbyB0cnVlIGZ1bGxzY3JlZW5cblx0XHRpZiAodC5mdWxsc2NyZWVuTW9kZSA9PT0gJ25hdGl2ZS1uYXRpdmUnIHx8IHQuZnVsbHNjcmVlbk1vZGUgPT09ICdwbHVnaW4tbmF0aXZlJykge1xuXG5cdFx0XHRGZWF0dXJlcy5yZXF1ZXN0RnVsbFNjcmVlbih0LmNvbnRhaW5lclswXSk7XG5cblx0XHRcdGlmICh0LmlzSW5JZnJhbWUpIHtcblx0XHRcdFx0Ly8gc29tZXRpbWVzIGV4aXRpbmcgZnJvbSBmdWxsc2NyZWVuIGRvZXNuJ3Qgd29ya1xuXHRcdFx0XHQvLyBub3RhYmx5IGluIENocm9tZSA8aWZyYW1lPi4gRml4ZWQgaW4gdmVyc2lvbiAxN1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uIGNoZWNrRnVsbHNjcmVlbiAoKSB7XG5cblx0XHRcdFx0XHRpZiAodC5pc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHRcdGxldCBwZXJjZW50RXJyb3JNYXJnaW4gPSAwLjAwMiwgLy8gMC4yJVxuXHRcdFx0XHRcdFx0XHR3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpLFxuXHRcdFx0XHRcdFx0XHRzY3JlZW5XaWR0aCA9IHNjcmVlbi53aWR0aCxcblx0XHRcdFx0XHRcdFx0YWJzRGlmZiA9IE1hdGguYWJzKHNjcmVlbldpZHRoIC0gd2luZG93V2lkdGgpLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW5FcnJvciA9IHNjcmVlbldpZHRoICogcGVyY2VudEVycm9yTWFyZ2luO1xuXG5cdFx0XHRcdFx0XHQvLyBjaGVjayBpZiB0aGUgdmlkZW8gaXMgc3VkZGVubHkgbm90IHJlYWxseSBmdWxsc2NyZWVuXG5cdFx0XHRcdFx0XHRpZiAoYWJzRGlmZiA+IG1hcmdpbkVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdC8vIG1hbnVhbGx5IGV4aXRcblx0XHRcdFx0XHRcdFx0dC5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gdGVzdCBhZ2FpblxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGNoZWNrRnVsbHNjcmVlbiwgNTAwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKHQuZnVsbHNjcmVlTW9kZSA9PT0gJ2Z1bGx3aW5kb3cnKSB7XG5cdFx0XHQvLyBtb3ZlIGludG8gcG9zaXRpb25cblxuXHRcdH1cblxuXHRcdC8vIG1ha2UgZnVsbCBzaXplXG5cdFx0dC5jb250YWluZXJcblx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWZ1bGxzY3JlZW5gKVxuXHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblxuXHRcdC8vIE9ubHkgbmVlZGVkIGZvciBzYWZhcmkgNS4xIG5hdGl2ZSBmdWxsIHNjcmVlbiwgY2FuIGNhdXNlIGRpc3BsYXkgaXNzdWVzIGVsc2V3aGVyZVxuXHRcdC8vIEFjdHVhbGx5LCBpdCBzZWVtcyB0byBiZSBuZWVkZWQgZm9yIElFOCwgdG9vXG5cdFx0dC5jb250YWluZXJTaXplVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dC5jb250YWluZXIuY3NzKHt3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ30pO1xuXHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYgKGlzTmF0aXZlKSB7XG5cdFx0XHR0LiRtZWRpYVxuXHRcdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoJ2lmcmFtZSwgZW1iZWQsIG9iamVjdCwgdmlkZW8nKVxuXHRcdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHQub3B0aW9ucy5zZXREaW1lbnNpb25zKSB7XG5cdFx0XHR0Lm1lZGlhLnNldFNpemUoc2NyZWVuLndpZHRoLCBzY3JlZW4uaGVpZ2h0KTtcblx0XHR9XG5cblx0XHR0LmxheWVycy5jaGlsZHJlbignZGl2Jylcblx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cblx0XHRpZiAodC5mdWxsc2NyZWVuQnRuKSB7XG5cdFx0XHR0LmZ1bGxzY3JlZW5CdG5cblx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bmZ1bGxzY3JlZW5gKTtcblx0XHR9XG5cblx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdHQuaXNGdWxsU2NyZWVuID0gdHJ1ZTtcblxuXHRcdGxldCB6b29tRmFjdG9yID0gTWF0aC5taW4oc2NyZWVuLndpZHRoIC8gdC53aWR0aCwgc2NyZWVuLmhlaWdodCAvIHQuaGVpZ2h0KTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnZm9udC1zaXplJywgem9vbUZhY3RvciAqIDEwMCArICclJyk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRgKS5jc3MoJ2xpbmUtaGVpZ2h0JywgJ25vcm1hbCcpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApLmNzcygnYm90dG9tJywgJzQ1cHgnKTtcblxuXHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2VudGVyZWRmdWxsc2NyZWVuJyk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRleGl0RnVsbFNjcmVlbjogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRpc05hdGl2ZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8obmF0aXZlfGh0bWw1KS8pICE9PSBudWxsXG5cdFx0XHQ7XG5cblx0XHQvLyBQcmV2ZW50IGNvbnRhaW5lciBmcm9tIGF0dGVtcHRpbmcgdG8gc3RyZXRjaCBhIHNlY29uZCB0aW1lXG5cdFx0Y2xlYXJUaW1lb3V0KHQuY29udGFpbmVyU2l6ZVRpbWVvdXQpO1xuXG5cdFx0Ly8gY29tZSBvdXQgb2YgbmF0aXZlIGZ1bGxzY3JlZW5cblx0XHRpZiAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgKEZlYXR1cmVzLklTX0ZVTExTQ1JFRU4gfHwgdC5pc0Z1bGxTY3JlZW4pKSB7XG5cdFx0XHRGZWF0dXJlcy5jYW5jZWxGdWxsU2NyZWVuKCk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVzdG9yZSBzY3JvbGwgYmFycyB0byBkb2N1bWVudFxuXHRcdCQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbmApO1xuXG5cdFx0dC5jb250YWluZXIucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1mdWxsc2NyZWVuYCk7XG5cblx0XHRpZiAodC5vcHRpb25zLnNldERpbWVuc2lvbnMpIHtcblx0XHRcdHQuY29udGFpbmVyXG5cdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KHQubm9ybWFsSGVpZ2h0KTtcblx0XHRcdGlmIChpc05hdGl2ZSkge1xuXHRcdFx0XHR0LiRtZWRpYVxuXHRcdFx0XHQud2lkdGgodC5ub3JtYWxXaWR0aClcblx0XHRcdFx0LmhlaWdodCh0Lm5vcm1hbEhlaWdodCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0LmNvbnRhaW5lci5maW5kKCdpZnJhbWUsIGVtYmVkLCBvYmplY3QsIHZpZGVvJylcblx0XHRcdFx0XHQud2lkdGgodC5ub3JtYWxXaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KHQubm9ybWFsSGVpZ2h0KTtcblx0XHRcdH1cblxuXHRcdFx0dC5tZWRpYS5zZXRTaXplKHQubm9ybWFsV2lkdGgsIHQubm9ybWFsSGVpZ2h0KTtcblxuXHRcdFx0dC5sYXllcnMuY2hpbGRyZW4oJ2RpdicpXG5cdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KHQubm9ybWFsSGVpZ2h0KTtcblx0XHR9XG5cblx0XHR0LmZ1bGxzY3JlZW5CdG5cblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5mdWxsc2NyZWVuYClcblx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbmApO1xuXG5cdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHR0LmlzRnVsbFNjcmVlbiA9IGZhbHNlO1xuXG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRgKS5jc3MoJ2ZvbnQtc2l6ZScsICcnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnbGluZS1oZWlnaHQnLCAnJyk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYCkuY3NzKCdib3R0b20nLCAnJyk7XG5cblx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdleGl0ZWRmdWxsc2NyZWVuJyk7XG5cdH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5cbi8qKlxuICogUGxheS9QYXVzZSBidXR0b25cbiAqXG4gKiBUaGlzIGZlYXR1cmUgZW5hYmxlcyB0aGUgZGlzcGxheWluZyBvZiBhIFBsYXkgYnV0dG9uIGluIHRoZSBjb250cm9sIGJhciwgYW5kIGFsc28gY29udGFpbnMgbG9naWMgdG8gdG9nZ2xlIGl0cyBzdGF0ZVxuICogYmV0d2VlbiBwYXVzZWQgYW5kIHBsYXlpbmcuXG4gKi9cblxuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0cGxheVRleHQ6ICcnLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHBhdXNlVGV4dDogJydcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblx0LyoqXG5cdCAqIEZlYXR1cmUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRidWlsZHBsYXlwYXVzZTogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG9wID0gdC5vcHRpb25zLFxuXHRcdFx0cGxheVRpdGxlID0gb3AucGxheVRleHQgPyBvcC5wbGF5VGV4dCA6IGkxOG4udCgnbWVqcy5wbGF5JyksXG5cdFx0XHRwYXVzZVRpdGxlID0gb3AucGF1c2VUZXh0ID8gb3AucGF1c2VUZXh0IDogaTE4bi50KCdtZWpzLnBhdXNlJyksXG5cdFx0XHRwbGF5ID1cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5cGF1c2UtYnV0dG9uIGAgK1xuXHRcdFx0XHRcdGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5XCI+YCArXG5cdFx0XHRcdFx0YDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtY29udHJvbHM9XCIke3QuaWR9XCIgdGl0bGU9XCIke3BsYXlUaXRsZX1cIiBhcmlhLWxhYmVsPVwiJHtwYXVzZVRpdGxlfVwiPjwvYnV0dG9uPmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKVxuXHRcdFx0XHQuY2xpY2soKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLFxuXHRcdFx0cGxheV9idG4gPSBwbGF5LmZpbmQoJ2J1dHRvbicpO1xuXG5cblx0XHQvKipcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB3aGljaCAtIHRva2VuIHRvIGRldGVybWluZSBuZXcgc3RhdGUgb2YgYnV0dG9uXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlUGxheVBhdXNlICh3aGljaCkge1xuXHRcdFx0aWYgKCdwbGF5JyA9PT0gd2hpY2gpIHtcblx0XHRcdFx0cGxheS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheWApXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cmVwbGF5YClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wYXVzZWApO1xuXHRcdFx0XHRwbGF5X2J0bi5hdHRyKHtcblx0XHRcdFx0XHQndGl0bGUnOiBwYXVzZVRpdGxlLFxuXHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogcGF1c2VUaXRsZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBsYXkucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBhdXNlYClcblx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1yZXBsYXlgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlgKTtcblx0XHRcdFx0cGxheV9idG4uYXR0cih7XG5cdFx0XHRcdFx0J3RpdGxlJzogcGxheVRpdGxlLFxuXHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogcGxheVRpdGxlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRvZ2dsZVBsYXlQYXVzZSgncHNlJyk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0dG9nZ2xlUGxheVBhdXNlKCdwbGF5Jyk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BsYXknKTtcblx0XHR9LCBmYWxzZSk7XG5cblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgKCkgPT4ge1xuXHRcdFx0dG9nZ2xlUGxheVBhdXNlKCdwc2UnKTtcblx0XHR9LCBmYWxzZSk7XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2VkJywgKCkgPT4ge1xuXHRcdFx0dG9nZ2xlUGxheVBhdXNlKCdwc2UnKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcblxuXHRcdFx0aWYgKCFwbGF5ZXIub3B0aW9ucy5sb29wKSB7XG5cdFx0XHRcdHBsYXkucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBhdXNlYClcblx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5YClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1yZXBsYXlgKTtcblx0XHRcdH1cblxuXHRcdH0sIGZhbHNlKTtcblx0fVxufSk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge0lTX0ZJUkVGT1gsIEhBU19UT1VDSH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7c2Vjb25kc1RvVGltZUNvZGV9IGZyb20gJy4uL3V0aWxzL3RpbWUnO1xuXG4vKipcbiAqIFByb2dyZXNzL2xvYWRlZCBiYXJcbiAqXG4gKiBUaGlzIGZlYXR1cmUgY3JlYXRlcyBhIHByb2dyZXNzIGJhciB3aXRoIGEgc2xpZGVyIGluIHRoZSBjb250cm9sIGJhciwgYW5kIHVwZGF0ZXMgaXQgYmFzZWQgb24gbmF0aXZlIGV2ZW50cy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEVuYWJsZSB0b29sdGlwIHRoYXQgc2hvd3MgdGltZSBpbiBwcm9ncmVzcyBiYXJcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRlbmFibGVQcm9ncmVzc1Rvb2x0aXA6IHRydWVcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZHByb2dyZXNzOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlLFxuXHRcdFx0bW91c2VJc092ZXIgPSBmYWxzZSxcblx0XHRcdGxhc3RLZXlQcmVzc1RpbWUgPSAwLFxuXHRcdFx0c3RhcnRlZFBhdXNlZCA9IGZhbHNlLFxuXHRcdFx0YXV0b1Jld2luZEluaXRpYWwgPSBwbGF5ZXIub3B0aW9ucy5hdXRvUmV3aW5kLFxuXHRcdFx0dG9vbHRpcCA9IHBsYXllci5vcHRpb25zLmVuYWJsZVByb2dyZXNzVG9vbHRpcCA/XG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXRcIj5gICtcblx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0LWN1cnJlbnRcIj4wMDowMDwvc3Bhbj5gICtcblx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0LWNvcm5lclwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDwvc3Bhbj5gIDogXCJcIjtcblxuXHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXJhaWxcIj5gICtcblx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtdG90YWwgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1zbGlkZXJcIj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtbG9hZGVkXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWN1cnJlbnRcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtaGFuZGxlXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgJHt0b29sdGlwfWAgK1xuXHRcdFx0YDwvc3Bhbj5gICtcblx0XHRgPC9kaXY+YClcblx0XHQuYXBwZW5kVG8oY29udHJvbHMpO1xuXHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblxuXHRcdHQucmFpbCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXJhaWxgKTtcblx0XHR0LnRvdGFsID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtdG90YWxgKTtcblx0XHR0LmxvYWRlZCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWxvYWRlZGApO1xuXHRcdHQuY3VycmVudCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWN1cnJlbnRgKTtcblx0XHR0LmhhbmRsZSA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWhhbmRsZWApO1xuXHRcdHQudGltZWZsb2F0ID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXRgKTtcblx0XHR0LnRpbWVmbG9hdGN1cnJlbnQgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdC1jdXJyZW50YCk7XG5cdFx0dC5zbGlkZXIgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1zbGlkZXJgKTtcblxuXHRcdC8qKlxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge0V2ZW50fSBlXG5cdFx0ICovXG5cdFx0bGV0IGhhbmRsZU1vdXNlTW92ZSA9IChlKSA9PiB7XG5cblx0XHRcdFx0bGV0IG9mZnNldCA9IHQudG90YWwub2Zmc2V0KCksXG5cdFx0XHRcdFx0d2lkdGggPSB0LnRvdGFsLndpZHRoKCksXG5cdFx0XHRcdFx0cGVyY2VudGFnZSA9IDAsXG5cdFx0XHRcdFx0bmV3VGltZSA9IDAsXG5cdFx0XHRcdFx0cG9zID0gMCxcblx0XHRcdFx0XHR4XG5cdFx0XHRcdDtcblxuXHRcdFx0XHQvLyBtb3VzZSBvciB0b3VjaCBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgb2JqZWN0XG5cdFx0XHRcdGlmIChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzKSB7XG5cdFx0XHRcdFx0eCA9IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcblx0XHRcdFx0fSBlbHNlIGlmIChlLmNoYW5nZWRUb3VjaGVzKSB7IC8vIGZvciBaZXB0b1xuXHRcdFx0XHRcdHggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHggPSBlLnBhZ2VYO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0aWYgKHggPCBvZmZzZXQubGVmdCkge1xuXHRcdFx0XHRcdFx0eCA9IG9mZnNldC5sZWZ0O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoeCA+IHdpZHRoICsgb2Zmc2V0LmxlZnQpIHtcblx0XHRcdFx0XHRcdHggPSB3aWR0aCArIG9mZnNldC5sZWZ0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBvcyA9IHggLSBvZmZzZXQubGVmdDtcblx0XHRcdFx0XHRwZXJjZW50YWdlID0gKHBvcyAvIHdpZHRoKTtcblx0XHRcdFx0XHRuZXdUaW1lID0gKHBlcmNlbnRhZ2UgPD0gMC4wMikgPyAwIDogcGVyY2VudGFnZSAqIG1lZGlhLmR1cmF0aW9uO1xuXG5cdFx0XHRcdFx0Ly8gc2VlayB0byB3aGVyZSB0aGUgbW91c2UgaXNcblx0XHRcdFx0XHRpZiAobW91c2VJc0Rvd24gJiYgbmV3VGltZS50b0ZpeGVkKDQpICE9PSBtZWRpYS5jdXJyZW50VGltZS50b0ZpeGVkKDQpKSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5zZXRDdXJyZW50VGltZShuZXdUaW1lKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBwb3NpdGlvbiBmbG9hdGluZyB0aW1lIGJveFxuXHRcdFx0XHRcdGlmICghSEFTX1RPVUNIKSB7XG5cdFx0XHRcdFx0XHR0LnRpbWVmbG9hdC5jc3MoJ2xlZnQnLCBwb3MpO1xuXHRcdFx0XHRcdFx0dC50aW1lZmxvYXRjdXJyZW50Lmh0bWwoc2Vjb25kc1RvVGltZUNvZGUobmV3VGltZSwgcGxheWVyLm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSk7XG5cdFx0XHRcdFx0XHR0LnRpbWVmbG9hdC5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBVcGRhdGUgZWxlbWVudHMgaW4gcHJvZ3Jlc3MgYmFyIGZvciBhY2Nlc3NpYmlsaXR5IHB1cnBvc2VzIG9ubHkgd2hlbiBwbGF5ZXIgaXMgcGF1c2VkLlxuXHRcdFx0ICpcblx0XHRcdCAqIFRoaXMgaXMgdG8gYXZvaWQgYXR0ZW1wdHMgdG8gcmVwZWF0IHRoZSB0aW1lIG92ZXIgYW5kIG92ZXIgYWdhaW4gd2hlbiBtZWRpYSBpcyBwbGF5aW5nLlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0dXBkYXRlU2xpZGVyID0gKCkgPT4ge1xuXG5cdFx0XHRcdGxldCBzZWNvbmRzID0gbWVkaWEuY3VycmVudFRpbWUsXG5cdFx0XHRcdFx0dGltZVNsaWRlclRleHQgPSBpMThuLnQoJ21lanMudGltZS1zbGlkZXInKSxcblx0XHRcdFx0XHR0aW1lID0gc2Vjb25kc1RvVGltZUNvZGUoc2Vjb25kcywgcGxheWVyLm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSxcblx0XHRcdFx0XHRkdXJhdGlvbiA9IG1lZGlhLmR1cmF0aW9uO1xuXG5cdFx0XHRcdHQuc2xpZGVyLmF0dHIoe1xuXHRcdFx0XHRcdCdyb2xlJzogJ3NsaWRlcicsXG5cdFx0XHRcdFx0J3RhYmluZGV4JzogMFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdHQuc2xpZGVyLmF0dHIoe1xuXHRcdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiB0aW1lU2xpZGVyVGV4dCxcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVlbWluJzogMCxcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVlbWF4JzogZHVyYXRpb24sXG5cdFx0XHRcdFx0XHQnYXJpYS12YWx1ZW5vdyc6IHNlY29uZHMsXG5cdFx0XHRcdFx0XHQnYXJpYS12YWx1ZXRleHQnOiB0aW1lXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dC5zbGlkZXIucmVtb3ZlQXR0cignYXJpYS1sYWJlbCBhcmlhLXZhbHVlbWluIGFyaWEtdmFsdWVtYXggYXJpYS12YWx1ZW5vdyBhcmlhLXZhbHVldGV4dCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0cmVzdGFydFBsYXllciA9ICgpID0+IHtcblx0XHRcdFx0bGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdGlmIChub3cgLSBsYXN0S2V5UHJlc3NUaW1lID49IDEwMDApIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvLyBFdmVudHNcblx0XHR0LnNsaWRlci5vbignZm9jdXMnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIub3B0aW9ucy5hdXRvUmV3aW5kID0gZmFsc2U7XG5cdFx0fSkub24oJ2JsdXInLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIub3B0aW9ucy5hdXRvUmV3aW5kID0gYXV0b1Jld2luZEluaXRpYWw7XG5cdFx0fSkub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuXG5cdFx0XHRpZiAoKG5ldyBEYXRlKCkgLSBsYXN0S2V5UHJlc3NUaW1lKSA+PSAxMDAwKSB7XG5cdFx0XHRcdHN0YXJ0ZWRQYXVzZWQgPSBtZWRpYS5wYXVzZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0Lm9wdGlvbnMua2V5QWN0aW9ucy5sZW5ndGgpIHtcblxuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHRrZXlDb2RlID0gZS53aGljaCB8fCBlLmtleUNvZGUgfHwgMCxcblx0XHRcdFx0XHRkdXJhdGlvbiA9IG1lZGlhLmR1cmF0aW9uLFxuXHRcdFx0XHRcdHNlZWtUaW1lID0gbWVkaWEuY3VycmVudFRpbWUsXG5cdFx0XHRcdFx0c2Vla0ZvcndhcmQgPSBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0ZvcndhcmRJbnRlcnZhbChtZWRpYSksXG5cdFx0XHRcdFx0c2Vla0JhY2t3YXJkID0gcGxheWVyLm9wdGlvbnMuZGVmYXVsdFNlZWtCYWNrd2FyZEludGVydmFsKG1lZGlhKVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0c3dpdGNoIChrZXlDb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSAzNzogLy8gbGVmdFxuXHRcdFx0XHRcdGNhc2UgNDA6IC8vIERvd25cblx0XHRcdFx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0XHRcdFx0c2Vla1RpbWUgLT0gc2Vla0JhY2t3YXJkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOTogLy8gUmlnaHRcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyBVcFxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRcdFx0XHRzZWVrVGltZSArPSBzZWVrRm9yd2FyZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzY6IC8vIEhvbWVcblx0XHRcdFx0XHRcdHNlZWtUaW1lID0gMDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzU6IC8vIGVuZFxuXHRcdFx0XHRcdFx0c2Vla1RpbWUgPSBkdXJhdGlvbjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzI6IC8vIHNwYWNlXG5cdFx0XHRcdFx0XHRpZiAoIUlTX0ZJUkVGT1gpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Y2FzZSAxMzogLy8gZW50ZXJcblx0XHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRzZWVrVGltZSA9IHNlZWtUaW1lIDwgMCA/IDAgOiAoc2Vla1RpbWUgPj0gZHVyYXRpb24gPyBkdXJhdGlvbiA6IE1hdGguZmxvb3Ioc2Vla1RpbWUpKTtcblx0XHRcdFx0bGFzdEtleVByZXNzVGltZSA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdGlmICghc3RhcnRlZFBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2Vla1RpbWUgPCBtZWRpYS5kdXJhdGlvbiAmJiAhc3RhcnRlZFBhdXNlZCkge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQocmVzdGFydFBsYXllciwgMTEwMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZWRpYS5zZXRDdXJyZW50VGltZShzZWVrVGltZSk7XG5cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0pLm9uKCdjbGljaycsIChlKSA9PiB7XG5cblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0bGV0IHBhdXNlZCA9IG1lZGlhLnBhdXNlZDtcblxuXHRcdFx0XHRpZiAoIXBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRoYW5kbGVNb3VzZU1vdmUoZSk7XG5cblx0XHRcdFx0aWYgKCFwYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gaGFuZGxlIGNsaWNrc1xuXHRcdHQucmFpbC5vbignbW91c2Vkb3duIHRvdWNoc3RhcnQnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHQvLyBvbmx5IGhhbmRsZSBsZWZ0IGNsaWNrcyBvciB0b3VjaFxuXHRcdFx0XHRpZiAoZS53aGljaCA9PT0gMSB8fCBlLndoaWNoID09PSAwKSB7XG5cdFx0XHRcdFx0bW91c2VJc0Rvd24gPSB0cnVlO1xuXHRcdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblx0XHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNlbW92ZS5kdXIgdG91Y2htb3ZlLmR1cicsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRoYW5kbGVNb3VzZU1vdmUoZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dC5nbG9iYWxCaW5kKCdtb3VzZXVwLmR1ciB0b3VjaGVuZC5kdXInLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0aWYgKHQudGltZWZsb2F0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0dC50aW1lZmxvYXQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dC5nbG9iYWxVbmJpbmQoJ21vdXNlbW92ZS5kdXIgdG91Y2htb3ZlLmR1ciBtb3VzZXVwLmR1ciB0b3VjaGVuZC5kdXInKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLm9uKCdtb3VzZWVudGVyJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0bW91c2VJc092ZXIgPSB0cnVlO1xuXHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNlbW92ZS5kdXInLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICh0LnRpbWVmbG9hdCAhPT0gdW5kZWZpbmVkICYmICFIQVNfVE9VQ0gpIHtcblx0XHRcdFx0XHR0LnRpbWVmbG9hdC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0bW91c2VJc092ZXIgPSBmYWxzZTtcblx0XHRcdFx0aWYgKCFtb3VzZUlzRG93bikge1xuXHRcdFx0XHRcdHQuZ2xvYmFsVW5iaW5kKCdtb3VzZW1vdmUuZHVyJyk7XG5cdFx0XHRcdFx0aWYgKHQudGltZWZsb2F0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0LmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIGxvYWRpbmdcblx0XHQvLyBJZiBtZWRpYSBpcyBkb2VzIG5vdCBoYXZlIGEgZmluaXRlIGR1cmF0aW9uLCByZW1vdmUgcHJvZ3Jlc3MgYmFyIGludGVyYWN0aW9uXG5cdFx0Ly8gYW5kIGluZGljYXRlIHRoYXQgaXMgYSBsaXZlIGJyb2FkY2FzdFxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0cGxheWVyLnNldFByb2dyZXNzUmFpbChlKTtcblx0XHRcdFx0cGxheWVyLnNldEN1cnJlbnRSYWlsKGUpO1xuXHRcdFx0fSBlbHNlIGlmICghY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdGApLmxlbmd0aCkge1xuXHRcdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1yYWlsYCkuZW1wdHkoKVxuXHRcdFx0XHRcdC5odG1sKGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdFwiPiR7bWVqcy5pMThuLnQoJ21lanMubGl2ZS1icm9hZGNhc3QnKX08L3NwYW4+YCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0Ly8gY3VycmVudCB0aW1lXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5ICkge1xuXHRcdFx0XHRwbGF5ZXIuc2V0UHJvZ3Jlc3NSYWlsKGUpO1xuXHRcdFx0XHRwbGF5ZXIuc2V0Q3VycmVudFJhaWwoZSk7XG5cdFx0XHRcdHVwZGF0ZVNsaWRlcihlKTtcblx0XHRcdH0gZWxzZSBpZiAoIWNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1icm9hZGNhc3RgKS5sZW5ndGgpIHtcblx0XHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbGApLmVtcHR5KClcblx0XHRcdFx0XHQuaHRtbChgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1icm9hZGNhc3RcIj4ke21lanMuaTE4bi50KCdtZWpzLmxpdmUtYnJvYWRjYXN0Jyl9PC9zcGFuPmApO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblxuXHRcdHQuY29udGFpbmVyLm9uKCdjb250cm9sc3Jlc2l6ZScsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdHBsYXllci5zZXRQcm9ncmVzc1JhaWwoZSk7XG5cdFx0XHRcdHBsYXllci5zZXRDdXJyZW50UmFpbChlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQ2FsY3VsYXRlIHRoZSBwcm9ncmVzcyBvbiB0aGUgbWVkaWEgYW5kIHVwZGF0ZSBwcm9ncmVzcyBiYXIncyB3aWR0aFxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBlXG5cdCAqL1xuXHRzZXRQcm9ncmVzc1JhaWw6IGZ1bmN0aW9uIChlKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHRhcmdldCA9IChlICE9PSB1bmRlZmluZWQpID8gZS50YXJnZXQgOiB0Lm1lZGlhLFxuXHRcdFx0cGVyY2VudCA9IG51bGw7XG5cblx0XHQvLyBuZXdlc3QgSFRNTDUgc3BlYyBoYXMgYnVmZmVyZWQgYXJyYXkgKEZGNCwgV2Via2l0KVxuXHRcdGlmICh0YXJnZXQgJiYgdGFyZ2V0LmJ1ZmZlcmVkICYmIHRhcmdldC5idWZmZXJlZC5sZW5ndGggPiAwICYmIHRhcmdldC5idWZmZXJlZC5lbmQgJiYgdGFyZ2V0LmR1cmF0aW9uKSB7XG5cdFx0XHQvLyBhY2NvdW50IGZvciBhIHJlYWwgYXJyYXkgd2l0aCBtdWx0aXBsZSB2YWx1ZXMgLSBhbHdheXMgcmVhZCB0aGUgZW5kIG9mIHRoZSBsYXN0IGJ1ZmZlclxuXHRcdFx0cGVyY2VudCA9IHRhcmdldC5idWZmZXJlZC5lbmQodGFyZ2V0LmJ1ZmZlcmVkLmxlbmd0aCAtIDEpIC8gdGFyZ2V0LmR1cmF0aW9uO1xuXHRcdH1cblx0XHQvLyBTb21lIGJyb3dzZXJzIChlLmcuLCBGRjMuNiBhbmQgU2FmYXJpIDUpIGNhbm5vdCBjYWxjdWxhdGUgdGFyZ2V0LmJ1ZmZlcmVyZWQuZW5kKClcblx0XHQvLyB0byBiZSBhbnl0aGluZyBvdGhlciB0aGFuIDAuIElmIHRoZSBieXRlIGNvdW50IGlzIGF2YWlsYWJsZSB3ZSB1c2UgdGhpcyBpbnN0ZWFkLlxuXHRcdC8vIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0aGUgZWxzZSBpZiBkbyBub3Qgc2VlbSB0byBoYXZlIHRoZSBidWZmZXJlZEJ5dGVzIHZhbHVlIGFuZFxuXHRcdC8vIHNob3VsZCBza2lwIHRvIHRoZXJlLiBUZXN0ZWQgaW4gU2FmYXJpIDUsIFdlYmtpdCBoZWFkLCBGRjMuNiwgQ2hyb21lIDYsIElFIDcvOC5cblx0XHRlbHNlIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmJ5dGVzVG90YWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXQuYnl0ZXNUb3RhbCA+IDAgJiYgdGFyZ2V0LmJ1ZmZlcmVkQnl0ZXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGVyY2VudCA9IHRhcmdldC5idWZmZXJlZEJ5dGVzIC8gdGFyZ2V0LmJ5dGVzVG90YWw7XG5cdFx0fVxuXHRcdC8vIEZpcmVmb3ggMyB3aXRoIGFuIE9nZyBmaWxlIHNlZW1zIHRvIGdvIHRoaXMgd2F5XG5cdFx0ZWxzZSBpZiAoZSAmJiBlLmxlbmd0aENvbXB1dGFibGUgJiYgZS50b3RhbCAhPT0gMCkge1xuXHRcdFx0cGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbDtcblx0XHR9XG5cblx0XHQvLyBmaW5hbGx5IHVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXG5cdFx0aWYgKHBlcmNlbnQgIT09IG51bGwpIHtcblx0XHRcdHBlcmNlbnQgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCBwZXJjZW50KSk7XG5cdFx0XHQvLyB1cGRhdGUgbG9hZGVkIGJhclxuXHRcdFx0aWYgKHQubG9hZGVkICYmIHQudG90YWwpIHtcblx0XHRcdFx0dC5sb2FkZWQud2lkdGgoYCR7KHBlcmNlbnQgKiAxMDApfSVgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIHNsaWRlcidzIHdpZHRoIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCB0aW1lXG5cdCAqXG5cdCAqL1xuXHRzZXRDdXJyZW50UmFpbDogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmICh0Lm1lZGlhLmN1cnJlbnRUaW1lICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYS5kdXJhdGlvbikge1xuXG5cdFx0XHQvLyB1cGRhdGUgYmFyIGFuZCBoYW5kbGVcblx0XHRcdGlmICh0LnRvdGFsICYmIHQuaGFuZGxlKSB7XG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdG5ld1dpZHRoID0gTWF0aC5yb3VuZCh0LnRvdGFsLndpZHRoKCkgKiB0Lm1lZGlhLmN1cnJlbnRUaW1lIC8gdC5tZWRpYS5kdXJhdGlvbiksXG5cdFx0XHRcdFx0aGFuZGxlUG9zID0gbmV3V2lkdGggLSBNYXRoLnJvdW5kKHQuaGFuZGxlLm91dGVyV2lkdGgodHJ1ZSkgLyAyKTtcblxuXHRcdFx0XHRuZXdXaWR0aCA9ICh0Lm1lZGlhLmN1cnJlbnRUaW1lIC8gdC5tZWRpYS5kdXJhdGlvbikgKiAxMDA7XG5cdFx0XHRcdHQuY3VycmVudC53aWR0aChgJHtuZXdXaWR0aH0lYCk7XG5cdFx0XHRcdHQuaGFuZGxlLmNzcygnbGVmdCcsIGhhbmRsZVBvcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IHtzZWNvbmRzVG9UaW1lQ29kZX0gZnJvbSAnLi4vdXRpbHMvdGltZSc7XG5cbi8qKlxuICogQ3VycmVudC9kdXJhdGlvbiB0aW1lc1xuICpcbiAqIFRoaXMgZmVhdHVyZSBjcmVhdGVzL3VwZGF0ZXMgdGhlIGR1cmF0aW9uIGFuZCBwcm9ncmVzcyB0aW1lcyBpbiB0aGUgY29udHJvbCBiYXIsIGJhc2VkIG9uIG5hdGl2ZSBldmVudHMuXG4gKi9cblxuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBUaGUgaW5pdGlhbCBkdXJhdGlvblxuXHQgKiBAdHlwZSB7TnVtYmVyfVxuXHQgKi9cblx0ZHVyYXRpb246IDAsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dGltZUFuZER1cmF0aW9uU2VwYXJhdG9yOiAnPHNwYW4+IHwgPC9zcGFuPidcbn0pO1xuXG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBDdXJyZW50IHRpbWUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKi9cblx0YnVpbGRjdXJyZW50OiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZVwiIHJvbGU9XCJ0aW1lclwiIGFyaWEtbGl2ZT1cIm9mZlwiPmAgK1xuXHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWVcIj4ke3NlY29uZHNUb1RpbWVDb2RlKDAsIHBsYXllci5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9PC9zcGFuPmAgK1xuXHRcdGA8L2Rpdj5gKVxuXHRcdC5hcHBlbmRUbyhjb250cm9scyk7XG5cblx0XHR0LmN1cnJlbnR0aW1lID0gdC5jb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWVgKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRpZiAodC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdFx0cGxheWVyLnVwZGF0ZUN1cnJlbnQoKTtcblx0XHRcdH1cblxuXHRcdH0sIGZhbHNlKTtcblx0fSxcblxuXHQvKipcblx0ICogRHVyYXRpb24gdGltZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZGR1cmF0aW9uOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAoY29udHJvbHMuY2hpbGRyZW4oKS5sYXN0KCkuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWN1cnJlbnR0aW1lYCkubGVuZ3RoID4gMCkge1xuXHRcdFx0JChgJHt0Lm9wdGlvbnMudGltZUFuZER1cmF0aW9uU2VwYXJhdG9yfTxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZHVyYXRpb25cIj5gICtcblx0XHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUodC5vcHRpb25zLmR1cmF0aW9uLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX08L3NwYW4+YClcblx0XHRcdC5hcHBlbmRUbyhjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZWApKTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBhZGQgY2xhc3MgdG8gY3VycmVudCB0aW1lXG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWVgKS5wYXJlbnQoKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWN1cnJlbnR0aW1lLWNvbnRhaW5lcmApO1xuXG5cdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvbi1jb250YWluZXJcIj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZHVyYXRpb25cIj5gICtcblx0XHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUodC5vcHRpb25zLmR1cmF0aW9uLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX08L3NwYW4+YCArXG5cdFx0XHRgPC9kaXY+YClcblx0XHRcdC5hcHBlbmRUbyhjb250cm9scyk7XG5cdFx0fVxuXG5cdFx0dC5kdXJhdGlvbkQgPSB0LmNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvbmApO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0XHRwbGF5ZXIudXBkYXRlRHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVwZGF0ZSB0aGUgY3VycmVudCB0aW1lIGFuZCBvdXRwdXQgaXQgaW4gZm9ybWF0IDAwOjAwXG5cdCAqXG5cdCAqL1xuXHR1cGRhdGVDdXJyZW50OiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGxldCBjdXJyZW50VGltZSA9IHQubWVkaWEuY3VycmVudFRpbWU7XG5cblx0XHRpZiAoaXNOYU4oY3VycmVudFRpbWUpKSB7XG5cdFx0XHRjdXJyZW50VGltZSA9IDA7XG5cdFx0fVxuXG5cdFx0aWYgKHQuY3VycmVudHRpbWUpIHtcblx0XHRcdHQuY3VycmVudHRpbWUuaHRtbChzZWNvbmRzVG9UaW1lQ29kZShjdXJyZW50VGltZSwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3VycykpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHRoZSBkdXJhdGlvbiB0aW1lIGFuZCBvdXRwdXQgaXQgaW4gZm9ybWF0IDAwOjAwXG5cdCAqXG5cdCAqL1xuXHR1cGRhdGVEdXJhdGlvbjogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRsZXQgZHVyYXRpb24gPSB0Lm1lZGlhLmR1cmF0aW9uO1xuXG5cdFx0aWYgKGlzTmFOKGR1cmF0aW9uKSB8fCBkdXJhdGlvbiA9PT0gSW5maW5pdHkgfHwgZHVyYXRpb24gPCAwKSB7XG5cdFx0XHR0Lm1lZGlhLmR1cmF0aW9uID0gdC5vcHRpb25zLmR1cmF0aW9uID0gZHVyYXRpb24gPSAwO1xuXHRcdH1cblxuXHRcdGlmICh0Lm9wdGlvbnMuZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRkdXJhdGlvbiA9IHQub3B0aW9ucy5kdXJhdGlvbjtcblx0XHR9XG5cblx0XHQvL1RvZ2dsZSB0aGUgbG9uZyB2aWRlbyBjbGFzcyBpZiB0aGUgdmlkZW8gaXMgbG9uZ2VyIHRoYW4gYW4gaG91ci5cblx0XHR0LmNvbnRhaW5lci50b2dnbGVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bG9uZy12aWRlb2AsIGR1cmF0aW9uID4gMzYwMCk7XG5cblx0XHRpZiAodC5kdXJhdGlvbkQgJiYgZHVyYXRpb24gPiAwKSB7XG5cdFx0XHR0LmR1cmF0aW9uRC5odG1sKHNlY29uZHNUb1RpbWVDb2RlKGR1cmF0aW9uLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSk7XG5cdFx0fVxuXHR9XG59KTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQge3NlY29uZHNUb1RpbWVDb2RlLCBjb252ZXJ0U01QVEV0b1NlY29uZHN9IGZyb20gJy4uL3V0aWxzL3RpbWUnO1xuXG4vKipcbiAqIENsb3NlZCBDYXB0aW9ucyAoQ0MpIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBlbmFibGVzIHRoZSBkaXNwbGF5aW5nIG9mIGEgQ0MgYnV0dG9uIGluIHRoZSBjb250cm9sIGJhciwgYW5kIGFsc28gY29udGFpbnMgdGhlIG1ldGhvZHMgdG8gc3RhcnQgbWVkaWFcbiAqIHdpdGggYSBjZXJ0YWluIGxhbmd1YWdlIChpZiBhdmFpbGFibGUpLCB0b2dnbGUgY2FwdGlvbnMsIGV0Yy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIERlZmF1bHQgbGFuZ3VhZ2UgdG8gc3RhcnQgbWVkaWEgdXNpbmcgSVNPIDYzOS0yIExhbmd1YWdlIENvZGUgTGlzdCAoZW4sIGVzLCBpdCwgZXRjLilcblx0ICogSWYgdGhlcmUgYXJlIG11bHRpcGxlIHRyYWNrcyBmb3Igb25lIGxhbmd1YWdlLCB0aGUgbGFzdCB0cmFjayBub2RlIGZvdW5kIGlzIGFjdGl2YXRlZFxuXHQgKiBAc2VlIGh0dHBzOi8vd3d3LmxvYy5nb3Yvc3RhbmRhcmRzL2lzbzYzOS0yL3BocC9jb2RlX2xpc3QucGhwXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRzdGFydExhbmd1YWdlOiAnJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR0cmFja3NUZXh0OiAnJyxcblx0LyoqXG5cdCAqIEF2b2lkIHRvIHNjcmVlbiByZWFkZXIgc3BlYWsgY2FwdGlvbnMgb3ZlciBhbiBhdWRpbyB0cmFjay5cblx0ICpcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHR0cmFja3NBcmlhTGl2ZTogZmFsc2UsXG5cdC8qKlxuXHQgKiBSZW1vdmUgdGhlIFtjY10gYnV0dG9uIHdoZW4gbm8gdHJhY2sgbm9kZXMgYXJlIHByZXNlbnRcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRoaWRlQ2FwdGlvbnNCdXR0b25XaGVuRW1wdHk6IHRydWUsXG5cdC8qKlxuXHQgKiBDaGFuZ2UgY2FwdGlvbnMgdG8gcG9wLXVwIGlmIHRydWUgYW5kIG9ubHkgb25lIHRyYWNrIG5vZGUgaXMgZm91bmRcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHR0b2dnbGVDYXB0aW9uc0J1dHRvbldoZW5Pbmx5T25lOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRzbGlkZXNTZWxlY3RvcjogJydcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRoYXNDaGFwdGVyczogZmFsc2UsXG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKi9cblx0YnVpbGR0cmFja3M6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGlmIChwbGF5ZXIudHJhY2tzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRhdHRyID0gdC5vcHRpb25zLnRyYWNrc0FyaWFMaXZlID8gJyByb2xlPVwibG9nXCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCIgYXJpYS1hdG9taWM9XCJmYWxzZVwiJyA6ICcnLFxuXHRcdFx0dHJhY2tzVGl0bGUgPSB0Lm9wdGlvbnMudHJhY2tzVGV4dCA/IHQub3B0aW9ucy50cmFja3NUZXh0IDogaTE4bi50KCdtZWpzLmNhcHRpb25zLXN1YnRpdGxlcycpLFxuXHRcdFx0aSxcblx0XHRcdGtpbmRcblx0XHRcdDtcblxuXHRcdC8vIElmIGJyb3dzZXIgd2lsbCBkbyBuYXRpdmUgY2FwdGlvbnMsIHByZWZlciBtZWpzIGNhcHRpb25zLCBsb29wIHRocm91Z2ggdHJhY2tzIGFuZCBoaWRlXG5cdFx0aWYgKHQuZG9tTm9kZS50ZXh0VHJhY2tzKSB7XG5cdFx0XHRmb3IgKGkgPSB0LmRvbU5vZGUudGV4dFRyYWNrcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR0LmRvbU5vZGUudGV4dFRyYWNrc1tpXS5tb2RlID0gJ2hpZGRlbic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dC5jbGVhcnRyYWNrcyhwbGF5ZXIpO1xuXHRcdHBsYXllci5jaGFwdGVycyA9ICQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVycyAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPjwvZGl2PmApXG5cdFx0XHQucHJlcGVuZFRvKGxheWVycykuaGlkZSgpO1xuXHRcdHBsYXllci5jYXB0aW9ucyA9XG5cdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtbGF5ZXIgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJcIj5gICtcblx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlclwiJHthdHRyfT5gICtcblx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0XCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRgPC9kaXY+YClcblx0XHRcdC5wcmVwZW5kVG8obGF5ZXJzKS5oaWRlKCk7XG5cdFx0cGxheWVyLmNhcHRpb25zVGV4dCA9IHBsYXllci5jYXB0aW9ucy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApO1xuXHRcdHBsYXllci5jYXB0aW9uc0J1dHRvbiA9XG5cdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWJ1dHRvblwiPmAgK1xuXHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7dHJhY2tzVGl0bGV9XCIgYXJpYS1sYWJlbD1cIiR7dHJhY2tzVGl0bGV9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3IgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuXCI+YCArXG5cdFx0XHRcdFx0YDx1bCBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxpc3RcIj5gICtcblx0XHRcdFx0XHRcdGA8bGkgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0LWl0ZW1cIj5gICtcblx0XHRcdFx0XHRcdFx0YDxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWlucHV0XCIgYCArXG5cdFx0XHRcdFx0XHRcdFx0YG5hbWU9XCIke3BsYXllci5pZH1fY2FwdGlvbnNcIiBpZD1cIiR7cGxheWVyLmlkfV9jYXB0aW9uc19ub25lXCIgYCArXG5cdFx0XHRcdFx0XHRcdFx0YHZhbHVlPVwibm9uZVwiIGNoZWNrZWQ9XCJjaGVja2VkXCIgLz5gICtcblx0XHRcdFx0XHRcdFx0YDxsYWJlbCBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxhYmVsIGAgK1xuXHRcdFx0XHRcdFx0XHRcdGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZFwiIGAgK1xuXHRcdFx0XHRcdFx0XHRcdGBmb3I9XCIke3BsYXllci5pZH1fY2FwdGlvbnNfbm9uZVwiPiR7aTE4bi50KCdtZWpzLm5vbmUnKX08L2xhYmVsPmAgK1xuXHRcdFx0XHRcdFx0YDwvbGk+YCArXG5cdFx0XHRcdFx0YDwvdWw+YCArXG5cdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblxuXG5cdFx0bGV0XG5cdFx0XHRzdWJ0aXRsZUNvdW50ID0gMCxcblx0XHRcdHRvdGFsID0gcGxheWVyLnRyYWNrcy5sZW5ndGhcblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0a2luZCA9IHBsYXllci50cmFja3NbaV0ua2luZDtcblx0XHRcdGlmIChraW5kID09PSAnc3VidGl0bGVzJyB8fCBraW5kID09PSAnY2FwdGlvbnMnKSB7XG5cdFx0XHRcdHN1YnRpdGxlQ291bnQrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBpZiBvbmx5IG9uZSBsYW5ndWFnZSB0aGVuIGp1c3QgbWFrZSB0aGUgYnV0dG9uIGEgdG9nZ2xlXG5cdFx0aWYgKHQub3B0aW9ucy50b2dnbGVDYXB0aW9uc0J1dHRvbldoZW5Pbmx5T25lICYmIHN1YnRpdGxlQ291bnQgPT09IDEpIHtcblx0XHRcdC8vIGNsaWNrXG5cdFx0XHRwbGF5ZXIuY2FwdGlvbnNCdXR0b24ub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgdHJhY2tJZCA9ICdub25lJztcblx0XHRcdFx0aWYgKHBsYXllci5zZWxlY3RlZFRyYWNrID09PSBudWxsKSB7XG5cdFx0XHRcdFx0dHJhY2tJZCA9IHBsYXllci50cmFja3NbMF0udHJhY2tJZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbGF5ZXIuc2V0VHJhY2sodHJhY2tJZCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaG92ZXIgb3Iga2V5Ym9hcmQgZm9jdXNcblx0XHRcdHBsYXllci5jYXB0aW9uc0J1dHRvblxuXHRcdFx0XHQub24oJ21vdXNlZW50ZXIgZm9jdXNpbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yYClcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignbW91c2VsZWF2ZSBmb2N1c291dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yYClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vIGhhbmRsZSBjbGlja3MgdG8gdGhlIGxhbmd1YWdlIHJhZGlvIGJ1dHRvbnNcblx0XHRcdFx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPXJhZGlvXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIHZhbHVlIGlzIHRyYWNrSWQsIHNhbWUgYXMgdGhlIGFjdHVhbCBpZCwgYW5kIHdlJ3JlIHVzaW5nIGl0IGhlcmVcblx0XHRcdFx0XHQvLyBiZWNhdXNlIHRoZSBcIm5vbmVcIiBjaGVja2JveCBkb2Vzbid0IGhhdmUgYSB0cmFja0lkXG5cdFx0XHRcdFx0Ly8gdG8gdXNlLCBidXQgd2Ugd2FudCB0byBrbm93IHdoZW4gXCJub25lXCIgaXMgY2xpY2tlZFxuXHRcdFx0XHRcdHBsYXllci5zZXRUcmFjayh0aGlzLnZhbHVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdjbGljaycsIGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWxgLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQvL0FsbG93IHVwL2Rvd24gYXJyb3cgdG8gY2hhbmdlIHRoZSBzZWxlY3RlZCByYWRpbyB3aXRob3V0IGNoYW5naW5nIHRoZSB2b2x1bWUuXG5cdFx0XHRcdC5vbigna2V5ZG93bicsIChlKSA9PiB7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdC8vIG1vdmUgd2l0aCBjb250cm9sc1xuXHRcdFx0cGxheWVyLmNvbnRhaW5lclxuXHRcdFx0Lm9uKCdjb250cm9sc3Nob3duJywgKCkgPT4ge1xuXHRcdFx0XHQvLyBwdXNoIGNhcHRpb25zIGFib3ZlIGNvbnRyb2xzXG5cdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlcmApO1xuXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb250cm9sc2hpZGRlbicsICgpID0+IHtcblx0XHRcdFx0aWYgKCFtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHQvLyBtb3ZlIGJhY2sgdG8gbm9ybWFsIHBsYWNlXG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb24taG92ZXJgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYClcblx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb24taG92ZXJgKTtcblx0XHR9XG5cblx0XHRwbGF5ZXIudHJhY2tUb0xvYWQgPSAtMTtcblx0XHRwbGF5ZXIuc2VsZWN0ZWRUcmFjayA9IG51bGw7XG5cdFx0cGxheWVyLmlzTG9hZGluZ1RyYWNrID0gZmFsc2U7XG5cblx0XHQvLyBhZGQgdG8gbGlzdFxuXHRcdGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRraW5kID0gcGxheWVyLnRyYWNrc1tpXS5raW5kO1xuXHRcdFx0aWYgKGtpbmQgPT09ICdzdWJ0aXRsZXMnIHx8IGtpbmQgPT09ICdjYXB0aW9ucycpIHtcblx0XHRcdFx0cGxheWVyLmFkZFRyYWNrQnV0dG9uKHBsYXllci50cmFja3NbaV0udHJhY2tJZCwgcGxheWVyLnRyYWNrc1tpXS5zcmNsYW5nLCBwbGF5ZXIudHJhY2tzW2ldLmxhYmVsKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBzdGFydCBsb2FkaW5nIHRyYWNrc1xuXHRcdHBsYXllci5sb2FkTmV4dFRyYWNrKCk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0cGxheWVyLmRpc3BsYXlDYXB0aW9ucygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdGlmIChwbGF5ZXIub3B0aW9ucy5zbGlkZXNTZWxlY3RvciAhPT0gJycpIHtcblx0XHRcdHBsYXllci5zbGlkZXNDb250YWluZXIgPSAkKHBsYXllci5vcHRpb25zLnNsaWRlc1NlbGVjdG9yKTtcblxuXHRcdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdFx0cGxheWVyLmRpc3BsYXlTbGlkZXMoKTtcblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdH1cblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXHRcdFx0cGxheWVyLmRpc3BsYXlDaGFwdGVycygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdHBsYXllci5jb250YWluZXIuaG92ZXIoXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gY2hhcHRlcnNcblx0XHRcdFx0aWYgKHBsYXllci5oYXNDaGFwdGVycykge1xuXHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCk7XG5cdFx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLmZhZGVJbigyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0bGV0IHNlbGYgPSAkKHRoaXMpO1xuXHRcdFx0XHRcdFx0c2VsZi5oZWlnaHQoc2VsZi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlcmApLm91dGVySGVpZ2h0KCkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChwbGF5ZXIuaGFzQ2hhcHRlcnMpIHtcblx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMuZmFkZU91dCgyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblxuXHRcdHQuY29udGFpbmVyLm9uKCdjb250cm9sc3Jlc2l6ZScsICgpID0+IHtcblx0XHRcdHQuYWRqdXN0TGFuZ3VhZ2VCb3goKTtcblx0XHR9KTtcblxuXHRcdC8vIGNoZWNrIGZvciBhdXRvcGxheVxuXHRcdGlmIChwbGF5ZXIubm9kZS5nZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JykgIT09IG51bGwpIHtcblx0XHRcdHBsYXllci5jaGFwdGVycy5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGRlc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgY2xlYW5gIGFuZCB0aGUgbmFtZSB0aGF0IHdhcyB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKi9cblx0Y2xlYXJ0cmFja3M6IGZ1bmN0aW9uIChwbGF5ZXIpICB7XG5cdFx0aWYgKHBsYXllcikge1xuXHRcdFx0aWYgKHBsYXllci5jYXB0aW9ucykge1xuXHRcdFx0XHRwbGF5ZXIuY2FwdGlvbnMucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGxheWVyLmNoYXB0ZXJzKSB7XG5cdFx0XHRcdHBsYXllci5jaGFwdGVycy5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwbGF5ZXIuY2FwdGlvbnNUZXh0KSB7XG5cdFx0XHRcdHBsYXllci5jYXB0aW9uc1RleHQucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGxheWVyLmNhcHRpb25zQnV0dG9uKSB7XG5cdFx0XHRcdHBsYXllci5jYXB0aW9uc0J1dHRvbi5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0cmVidWlsZHRyYWNrczogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0dC5maW5kVHJhY2tzKCk7XG5cdFx0dC5idWlsZHRyYWNrcyh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdH0sXG5cblx0ZmluZFRyYWNrczogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dHJhY2t0YWdzID0gdC4kbWVkaWEuZmluZCgndHJhY2snKVxuXHRcdFx0O1xuXG5cdFx0Ly8gc3RvcmUgZm9yIHVzZSBieSBwbHVnaW5zXG5cdFx0dC50cmFja3MgPSBbXTtcblx0XHR0cmFja3RhZ3MuZWFjaCgoaW5kZXgsIHRyYWNrKSA9PiB7XG5cblx0XHRcdHRyYWNrID0gJCh0cmFjayk7XG5cblx0XHRcdGxldCBzcmNsYW5nID0gKHRyYWNrLmF0dHIoJ3NyY2xhbmcnKSkgPyB0cmFjay5hdHRyKCdzcmNsYW5nJykudG9Mb3dlckNhc2UoKSA6ICcnO1xuXHRcdFx0bGV0IHRyYWNrSWQgPSBgJHt0LmlkfV90cmFja18ke2luZGV4fV8ke3RyYWNrLmF0dHIoJ2tpbmQnKX1fJHtzcmNsYW5nfWA7XG5cdFx0XHR0LnRyYWNrcy5wdXNoKHtcblx0XHRcdFx0dHJhY2tJZDogdHJhY2tJZCxcblx0XHRcdFx0c3JjbGFuZzogc3JjbGFuZyxcblx0XHRcdFx0c3JjOiB0cmFjay5hdHRyKCdzcmMnKSxcblx0XHRcdFx0a2luZDogdHJhY2suYXR0cigna2luZCcpLFxuXHRcdFx0XHRsYWJlbDogdHJhY2suYXR0cignbGFiZWwnKSB8fCAnJyxcblx0XHRcdFx0ZW50cmllczogW10sXG5cdFx0XHRcdGlzTG9hZGVkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkLCBvciBcIm5vbmVcIiB0byBkaXNhYmxlIGNhcHRpb25zXG5cdCAqL1xuXHRzZXRUcmFjazogZnVuY3Rpb24gKHRyYWNrSWQpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGlcblx0XHRcdDtcblxuXHRcdHQuY2FwdGlvbnNCdXR0b25cblx0XHRcdC5maW5kKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpXG5cdFx0XHQuZW5kKClcblx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0ZWRgKVxuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZGApXG5cdFx0XHQuZW5kKClcblx0XHRcdC5maW5kKGBpbnB1dFt2YWx1ZT1cIiR7dHJhY2tJZH1cIl1gKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcblx0XHRcdC5zaWJsaW5ncyhgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxhYmVsYClcblx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0ZWRgKVxuXHRcdDtcblxuXHRcdGlmICh0cmFja0lkID09PSAnbm9uZScpIHtcblx0XHRcdHQuc2VsZWN0ZWRUcmFjayA9IG51bGw7XG5cdFx0XHR0LmNhcHRpb25zQnV0dG9uLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1lbmFibGVkYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHQudHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgdHJhY2sgPSB0LnRyYWNrc1tpXTtcblx0XHRcdGlmICh0cmFjay50cmFja0lkID09PSB0cmFja0lkKSB7XG5cdFx0XHRcdGlmICh0LnNlbGVjdGVkVHJhY2sgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0LmNhcHRpb25zQnV0dG9uLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1lbmFibGVkYCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5zZWxlY3RlZFRyYWNrID0gdHJhY2s7XG5cdFx0XHRcdHQuY2FwdGlvbnMuYXR0cignbGFuZycsIHQuc2VsZWN0ZWRUcmFjay5zcmNsYW5nKTtcblx0XHRcdFx0dC5kaXNwbGF5Q2FwdGlvbnMoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0bG9hZE5leHRUcmFjazogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LnRyYWNrVG9Mb2FkKys7XG5cdFx0aWYgKHQudHJhY2tUb0xvYWQgPCB0LnRyYWNrcy5sZW5ndGgpIHtcblx0XHRcdHQuaXNMb2FkaW5nVHJhY2sgPSB0cnVlO1xuXHRcdFx0dC5sb2FkVHJhY2sodC50cmFja1RvTG9hZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGFkZCBkb25lP1xuXHRcdFx0dC5pc0xvYWRpbmdUcmFjayA9IGZhbHNlO1xuXG5cdFx0XHR0LmNoZWNrRm9yVHJhY2tzKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gaW5kZXhcblx0ICovXG5cdGxvYWRUcmFjazogZnVuY3Rpb24gKGluZGV4KSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR0cmFjayA9IHQudHJhY2tzW2luZGV4XSxcblx0XHRcdGFmdGVyID0gKCkgPT4ge1xuXG5cdFx0XHRcdHRyYWNrLmlzTG9hZGVkID0gdHJ1ZTtcblxuXHRcdFx0XHR0LmVuYWJsZVRyYWNrQnV0dG9uKHRyYWNrKTtcblxuXHRcdFx0XHR0LmxvYWROZXh0VHJhY2soKTtcblxuXHRcdFx0fVxuXHRcdFx0O1xuXG5cdFx0aWYgKHRyYWNrICE9PSB1bmRlZmluZWQgJiYgKHRyYWNrLnNyYyAhPT0gdW5kZWZpbmVkIHx8IHRyYWNrLnNyYyAhPT0gXCJcIikpIHtcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogdHJhY2suc3JjLFxuXHRcdFx0XHRkYXRhVHlwZTogJ3RleHQnLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAoZCkgIHtcblxuXHRcdFx0XHRcdC8vIHBhcnNlIHRoZSBsb2FkZWQgZmlsZVxuXHRcdFx0XHRcdGlmICh0eXBlb2YgZCA9PT0gJ3N0cmluZycgJiYgKC88dHRcXHMreG1sL2lnKS5leGVjKGQpKSB7XG5cdFx0XHRcdFx0XHR0cmFjay5lbnRyaWVzID0gbWVqcy5UcmFja0Zvcm1hdFBhcnNlci5kZnhwLnBhcnNlKGQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0cmFjay5lbnRyaWVzID0gbWVqcy5UcmFja0Zvcm1hdFBhcnNlci53ZWJ2dHQucGFyc2UoZCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YWZ0ZXIoKTtcblxuXHRcdFx0XHRcdGlmICh0cmFjay5raW5kID09PSAnY2hhcHRlcnMnKSB7XG5cdFx0XHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICh0Lm1lZGlhLmR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHQuZGlzcGxheUNoYXB0ZXJzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHJhY2sua2luZCA9PT0gJ3NsaWRlcycpIHtcblx0XHRcdFx0XHRcdHQuc2V0dXBTbGlkZXModHJhY2spO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uICgpICB7XG5cdFx0XHRcdFx0dC5yZW1vdmVUcmFja0J1dHRvbih0cmFjay50cmFja0lkKTtcblx0XHRcdFx0XHR0LmxvYWROZXh0VHJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2sgLSBUaGUgbGFuZ3VhZ2UgY29kZVxuXHQgKi9cblx0ZW5hYmxlVHJhY2tCdXR0b246IGZ1bmN0aW9uICh0cmFjaykgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bGFuZyA9IHRyYWNrLnNyY2xhbmcsXG5cdFx0XHRsYWJlbCA9IHRyYWNrLmxhYmVsLFxuXHRcdFx0dGFyZ2V0ID0gJChgIyR7dHJhY2sudHJhY2tJZH1gKVxuXHRcdDtcblxuXHRcdGlmIChsYWJlbCA9PT0gJycpIHtcblx0XHRcdGxhYmVsID0gaTE4bi50KG1lanMubGFuZ3VhZ2UuY29kZXNbbGFuZ10pIHx8IGxhbmc7XG5cdFx0fVxuXG5cdFx0dGFyZ2V0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG5cdFx0LnNpYmxpbmdzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWxgKS5odG1sKGxhYmVsKTtcblxuXHRcdC8vIGF1dG8gc2VsZWN0XG5cdFx0aWYgKHQub3B0aW9ucy5zdGFydExhbmd1YWdlID09PSBsYW5nKSB7XG5cdFx0XHR0YXJnZXQucHJvcCgnY2hlY2tlZCcsIHRydWUpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0fVxuXG5cdFx0dC5hZGp1c3RMYW5ndWFnZUJveCgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuXHQgKi9cblx0cmVtb3ZlVHJhY2tCdXR0b246IGZ1bmN0aW9uICh0cmFja0lkKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZChgaW5wdXRbaWQ9JHt0cmFja0lkfV1gKS5jbG9zZXN0KCdsaScpLnJlbW92ZSgpO1xuXG5cdFx0dC5hZGp1c3RMYW5ndWFnZUJveCgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbGFuZyAtIFRoZSBsYW5ndWFnZSBjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbFxuXHQgKi9cblx0YWRkVHJhY2tCdXR0b246IGZ1bmN0aW9uICh0cmFja0lkLCBsYW5nLCBsYWJlbCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0aWYgKGxhYmVsID09PSAnJykge1xuXHRcdFx0bGFiZWwgPSBpMThuLnQobWVqcy5sYW5ndWFnZS5jb2Rlc1tsYW5nXSkgfHwgbGFuZztcblx0XHR9XG5cblx0XHQvLyB0cmFja0lkIGlzIHVzZWQgaW4gdGhlIHZhbHVlLCB0b28sIGJlY2F1c2UgdGhlIFwibm9uZVwiXG5cdFx0Ly8gY2FwdGlvbiBvcHRpb24gZG9lc24ndCBoYXZlIGEgdHJhY2tJZCBidXQgd2UgbmVlZCB0byBiZSBhYmxlXG5cdFx0Ly8gdG8gc2V0IGl0LCB0b29cblx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoJ3VsJykuYXBwZW5kKFxuXHRcdFx0JChgPGxpIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGlzdC1pdGVtXCI+YCArXG5cdFx0XHRcdGA8aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1pbnB1dFwiYCArXG5cdFx0XHRcdGBuYW1lPVwiJHt0LmlkfV9jYXB0aW9uc1wiIGlkPVwiJHt0cmFja0lkfVwiIHZhbHVlPVwiJHt0cmFja0lkfVwiIGRpc2FibGVkPVwiZGlzYWJsZWRcIiAvPmAgK1xuXHRcdFx0XHRgPGxhYmVsIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWxcIj4ke2xhYmVsfSAobG9hZGluZyk8L2xhYmVsPmAgK1xuXHRcdFx0YDwvbGk+YClcblx0XHQpO1xuXG5cdFx0dC5hZGp1c3RMYW5ndWFnZUJveCgpO1xuXG5cdFx0Ly8gcmVtb3ZlIHRoaXMgZnJvbSB0aGUgZHJvcGRvd25saXN0IChpZiBpdCBleGlzdHMpXG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRyYW5zbGF0aW9ucyBvcHRpb25bdmFsdWU9JHtsYW5nfV1gKS5yZW1vdmUoKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGFkanVzdExhbmd1YWdlQm94OiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHQvLyBhZGp1c3QgdGhlIHNpemUgb2YgdGhlIG91dGVyIGJveFxuXHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yYCkuaGVpZ2h0KFxuXHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGlzdGApLm91dGVySGVpZ2h0KHRydWUpICtcblx0XHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRyYW5zbGF0aW9uc2ApLm91dGVySGVpZ2h0KHRydWUpXG5cdFx0KTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGNoZWNrRm9yVHJhY2tzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRoYXNTdWJ0aXRsZXMgPSBmYWxzZVxuXHRcdDtcblxuXHRcdC8vIGNoZWNrIGlmIGFueSBzdWJ0aXRsZXNcblx0XHRpZiAodC5vcHRpb25zLmhpZGVDYXB0aW9uc0J1dHRvbldoZW5FbXB0eSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdC50cmFja3MubGVuZ3RoOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0XHRsZXQga2luZCA9IHQudHJhY2tzW2ldLmtpbmQ7XG5cdFx0XHRcdGlmICgoa2luZCA9PT0gJ3N1YnRpdGxlcycgfHwga2luZCA9PT0gJ2NhcHRpb25zJykgJiYgdC50cmFja3NbaV0uaXNMb2FkZWQpIHtcblx0XHRcdFx0XHRoYXNTdWJ0aXRsZXMgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaGFzU3VidGl0bGVzKSB7XG5cdFx0XHRcdHQuY2FwdGlvbnNCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGRpc3BsYXlDYXB0aW9uczogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGlmICh0aGlzLnRyYWNrcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHRyYWNrID0gdC5zZWxlY3RlZFRyYWNrLFxuXHRcdFx0aVxuXHRcdDtcblxuXHRcdGlmICh0cmFjayAhPT0gbnVsbCAmJiB0cmFjay5pc0xvYWRlZCkge1xuXHRcdFx0aSA9IHQuc2VhcmNoVHJhY2tQb3NpdGlvbih0cmFjay5lbnRyaWVzLCB0Lm1lZGlhLmN1cnJlbnRUaW1lKTtcblx0XHRcdGlmIChpID4gLTEpIHtcblx0XHRcdFx0Ly8gU2V0IHRoZSBsaW5lIGJlZm9yZSB0aGUgdGltZWNvZGUgYXMgYSBjbGFzcyBzbyB0aGUgY3VlIGNhbiBiZSB0YXJnZXRlZCBpZiBuZWVkZWRcblx0XHRcdFx0dC5jYXB0aW9uc1RleHQuaHRtbCh0cmFjay5lbnRyaWVzW2ldLnRleHQpXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsIGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0ICR7KHRyYWNrLmVudHJpZXNbaV0uaWRlbnRpZmllciB8fCAnJyl9YCk7XG5cdFx0XHRcdHQuY2FwdGlvbnMuc2hvdygpLmhlaWdodCgwKTtcblx0XHRcdFx0cmV0dXJuOyAvLyBleGl0IG91dCBpZiBvbmUgaXMgdmlzaWJsZTtcblx0XHRcdH1cblxuXHRcdFx0dC5jYXB0aW9ucy5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHQuY2FwdGlvbnMuaGlkZSgpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdHJhY2tcblx0ICovXG5cdHNldHVwU2xpZGVzOiBmdW5jdGlvbiAodHJhY2spICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5zbGlkZXMgPSB0cmFjaztcblx0XHR0LnNsaWRlcy5lbnRyaWVzLmltZ3MgPSBbdC5zbGlkZXMuZW50cmllcy5sZW5ndGhdO1xuXHRcdHQuc2hvd1NsaWRlKDApO1xuXG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuXHQgKi9cblx0c2hvd1NsaWRlOiBmdW5jdGlvbiAoaW5kZXgpICB7XG5cdFx0aWYgKHRoaXMudHJhY2tzID09PSB1bmRlZmluZWQgfHwgdGhpcy5zbGlkZXNDb250YWluZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR1cmwgPSB0LnNsaWRlcy5lbnRyaWVzW2luZGV4XS50ZXh0LFxuXHRcdFx0aW1nID0gdC5zbGlkZXMuZW50cmllc1tpbmRleF0uaW1nc1xuXHRcdDtcblxuXHRcdGlmIChpbWcgPT09IHVuZGVmaW5lZCB8fCBpbWcuZmFkZUluID09PSB1bmRlZmluZWQpIHtcblxuXHRcdFx0dC5zbGlkZXMuZW50cmllc1tpbmRleF0uaW1ncyA9IGltZyA9ICQoYDxpbWcgc3JjPVwiJHt1cmx9XCI+YClcblx0XHRcdC5vbignbG9hZCcsICgpID0+IHtcblx0XHRcdFx0aW1nLmFwcGVuZFRvKHQuc2xpZGVzQ29udGFpbmVyKVxuXHRcdFx0XHQuaGlkZSgpXG5cdFx0XHRcdC5mYWRlSW4oKVxuXHRcdFx0XHQuc2libGluZ3MoJzp2aXNpYmxlJylcblx0XHRcdFx0LmZhZGVPdXQoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoIWltZy5pcygnOnZpc2libGUnKSAmJiAhaW1nLmlzKCc6YW5pbWF0ZWQnKSkge1xuXHRcdFx0XHRpbWcuZmFkZUluKClcblx0XHRcdFx0LnNpYmxpbmdzKCc6dmlzaWJsZScpXG5cdFx0XHRcdC5mYWRlT3V0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRkaXNwbGF5U2xpZGVzOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0aWYgKHRoaXMuc2xpZGVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0c2xpZGVzID0gdC5zbGlkZXMsXG5cdFx0XHRpID0gdC5zZWFyY2hUcmFja1Bvc2l0aW9uKHNsaWRlcy5lbnRyaWVzLCB0Lm1lZGlhLmN1cnJlbnRUaW1lKVxuXHRcdDtcblxuXHRcdGlmIChpID4gLTEpIHtcblx0XHRcdHQuc2hvd1NsaWRlKGkpO1xuXHRcdFx0cmV0dXJuOyAvLyBleGl0IG91dCBpZiBvbmUgaXMgdmlzaWJsZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRkaXNwbGF5Q2hhcHRlcnM6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdC50cmFja3MubGVuZ3RoOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0aWYgKHQudHJhY2tzW2ldLmtpbmQgPT09ICdjaGFwdGVycycgJiYgdC50cmFja3NbaV0uaXNMb2FkZWQpIHtcblx0XHRcdFx0dC5kcmF3Q2hhcHRlcnModC50cmFja3NbaV0pO1xuXHRcdFx0XHR0Lmhhc0NoYXB0ZXJzID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY2hhcHRlcnNcblx0ICovXG5cdGRyYXdDaGFwdGVyczogZnVuY3Rpb24gKGNoYXB0ZXJzKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRpLFxuXHRcdFx0ZHVyLFxuXHRcdFx0cGVyY2VudCA9IDAsXG5cdFx0XHR1c2VkUGVyY2VudCA9IDAsXG5cdFx0XHR0b3RhbCA9IGNoYXB0ZXJzLmVudHJpZXMubGVuZ3RoXG5cdFx0O1xuXG5cdFx0dC5jaGFwdGVycy5lbXB0eSgpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdGR1ciA9IGNoYXB0ZXJzLmVudHJpZXNbaV0uc3RvcCAtIGNoYXB0ZXJzLmVudHJpZXNbaV0uc3RhcnQ7XG5cdFx0XHRwZXJjZW50ID0gTWF0aC5mbG9vcihkdXIgLyB0Lm1lZGlhLmR1cmF0aW9uICogMTAwKTtcblxuXHRcdFx0Ly8gdG9vIGxhcmdlIG9yIG5vdCBnb2luZyB0byBmaWxsIGl0IGluXG5cdFx0XHRpZiAocGVyY2VudCArIHVzZWRQZXJjZW50ID4gMTAwIHx8XG5cdFx0XHRcdGkgPT09IGNoYXB0ZXJzLmVudHJpZXMubGVuZ3RoIC0gMSAmJiBwZXJjZW50ICsgdXNlZFBlcmNlbnQgPCAxMDApIHtcblx0XHRcdFx0cGVyY2VudCA9IDEwMCAtIHVzZWRQZXJjZW50O1xuXHRcdFx0fVxuXG5cdFx0XHR0LmNoYXB0ZXJzLmFwcGVuZCgkKFxuXHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXJcIiByZWw9XCIke2NoYXB0ZXJzLmVudHJpZXNbaV0uc3RhcnR9XCIgc3R5bGU9XCJsZWZ0OiAke3VzZWRQZXJjZW50LnRvU3RyaW5nKCl9JTsgd2lkdGg6ICR7cGVyY2VudC50b1N0cmluZygpfSU7XCI+YCArXG5cdFx0XHRcdCBcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlci1ibG9ja2AgK1xuXHRcdFx0XHQgXHRgJHsoaSA9PT0gY2hhcHRlcnMuZW50cmllcy5sZW5ndGggLSAxKSA/IGAgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlci1ibG9jay1sYXN0YCA6ICcnfVwiPmAgK1xuXHRcdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiY2gtdGl0bGVcIj4ke2NoYXB0ZXJzLmVudHJpZXNbaV0udGV4dH08L3NwYW4+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCJjaC10aW1lXCI+YCArXG5cdFx0XHRcdFx0XHRcdGAke3NlY29uZHNUb1RpbWVDb2RlKGNoYXB0ZXJzLmVudHJpZXNbaV0uc3RhcnQsIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfWAgK1xuXHRcdFx0XHQgXHRcdFx0YCZuZGFzaDtgICtcblx0XHRcdFx0IFx0XHRcdGAke3NlY29uZHNUb1RpbWVDb2RlKGNoYXB0ZXJzLmVudHJpZXNbaV0uc3RvcCwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9YCArXG5cdFx0XHRcdFx0XHRgPC9zcGFuPmAgK1xuXHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDwvZGl2PmApKTtcblx0XHRcdHVzZWRQZXJjZW50ICs9IHBlcmNlbnQ7XG5cdFx0fVxuXG5cdFx0dC5jaGFwdGVycy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlcmApLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0dC5tZWRpYS5zZXRDdXJyZW50VGltZShwYXJzZUZsb2F0KCQodGhpcykuYXR0cigncmVsJykpKTtcblx0XHRcdGlmICh0Lm1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHR0Lm1lZGlhLnBsYXkoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHQuY2hhcHRlcnMuc2hvdygpO1xuXHR9LFxuXHQvKipcblx0ICogUGVyZm9ybSBiaW5hcnkgc2VhcmNoIHRvIGxvb2sgZm9yIHByb3BlciB0cmFjayBpbmRleFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSB0cmFja3Ncblx0ICogQHBhcmFtIHtOdW1iZXJ9IGN1cnJlbnRUaW1lXG5cdCAqIEByZXR1cm4ge051bWJlcn1cblx0ICovXG5cdHNlYXJjaFRyYWNrUG9zaXRpb246IGZ1bmN0aW9uICh0cmFja3MsIGN1cnJlbnRUaW1lKSAge1xuXHRcdGxldFxuXHRcdFx0bG8gPSAwLFxuXHRcdFx0aGkgPSB0cmFja3MubGVuZ3RoIC0gMSxcblx0XHRcdG1pZCxcblx0XHRcdHN0YXJ0LFxuXHRcdFx0c3RvcFxuXHRcdFx0O1xuXG5cdFx0d2hpbGUgKGxvIDw9IGhpKSB7XG5cdFx0XHRtaWQgPSAoKGxvICsgaGkpID4+IDEpO1xuXHRcdFx0c3RhcnQgPSB0cmFja3NbbWlkXS5zdGFydDtcblx0XHRcdHN0b3AgPSB0cmFja3NbbWlkXS5zdG9wO1xuXG5cdFx0XHRpZiAoY3VycmVudFRpbWUgPj0gc3RhcnQgJiYgY3VycmVudFRpbWUgPCBzdG9wKSB7XG5cdFx0XHRcdHJldHVybiBtaWQ7XG5cdFx0XHR9IGVsc2UgaWYgKHN0YXJ0IDwgY3VycmVudFRpbWUpIHtcblx0XHRcdFx0bG8gPSBtaWQgKyAxO1xuXHRcdFx0fSBlbHNlIGlmIChzdGFydCA+IGN1cnJlbnRUaW1lKSB7XG5cdFx0XHRcdGhpID0gbWlkIC0gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH1cbn0pO1xuXG4vKipcbiAqIE1hcCBhbGwgcG9zc2libGUgbGFuZ3VhZ2VzIHdpdGggdGhlaXIgcmVzcGVjdGl2ZSBjb2RlXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbm1lanMubGFuZ3VhZ2UgPSB7XG5cdGNvZGVzOiB7XG5cdFx0YWY6ICdtZWpzLmFmcmlrYWFucycsXG5cdFx0c3E6ICdtZWpzLmFsYmFuaWFuJyxcblx0XHRhcjogJ21lanMuYXJhYmljJyxcblx0XHRiZTogJ21lanMuYmVsYXJ1c2lhbicsXG5cdFx0Ymc6ICdtZWpzLmJ1bGdhcmlhbicsXG5cdFx0Y2E6ICdtZWpzLmNhdGFsYW4nLFxuXHRcdHpoOiAnbWVqcy5jaGluZXNlJyxcblx0XHQnemgtY24nOiAnbWVqcy5jaGluZXNlLXNpbXBsaWZpZWQnLFxuXHRcdCd6aC10dyc6ICdtZWpzLmNoaW5lcy10cmFkaXRpb25hbCcsXG5cdFx0aHI6ICdtZWpzLmNyb2F0aWFuJyxcblx0XHRjczogJ21lanMuY3plY2gnLFxuXHRcdGRhOiAnbWVqcy5kYW5pc2gnLFxuXHRcdG5sOiAnbWVqcy5kdXRjaCcsXG5cdFx0ZW46ICdtZWpzLmVuZ2xpc2gnLFxuXHRcdGV0OiAnbWVqcy5lc3RvbmlhbicsXG5cdFx0Zmw6ICdtZWpzLmZpbGlwaW5vJyxcblx0XHRmaTogJ21lanMuZmlubmlzaCcsXG5cdFx0ZnI6ICdtZWpzLmZyZW5jaCcsXG5cdFx0Z2w6ICdtZWpzLmdhbGljaWFuJyxcblx0XHRkZTogJ21lanMuZ2VybWFuJyxcblx0XHRlbDogJ21lanMuZ3JlZWsnLFxuXHRcdGh0OiAnbWVqcy5oYWl0aWFuLWNyZW9sZScsXG5cdFx0aXc6ICdtZWpzLmhlYnJldycsXG5cdFx0aGk6ICdtZWpzLmhpbmRpJyxcblx0XHRodTogJ21lanMuaHVuZ2FyaWFuJyxcblx0XHRpczogJ21lanMuaWNlbGFuZGljJyxcblx0XHRpZDogJ21lanMuaW5kb25lc2lhbicsXG5cdFx0Z2E6ICdtZWpzLmlyaXNoJyxcblx0XHRpdDogJ21lanMuaXRhbGlhbicsXG5cdFx0amE6ICdtZWpzLmphcGFuZXNlJyxcblx0XHRrbzogJ21lanMua29yZWFuJyxcblx0XHRsdjogJ21lanMubGF0dmlhbicsXG5cdFx0bHQ6ICdtZWpzLmxpdGh1YW5pYW4nLFxuXHRcdG1rOiAnbWVqcy5tYWNlZG9uaWFuJyxcblx0XHRtczogJ21lanMubWFsYXknLFxuXHRcdG10OiAnbWVqcy5tYWx0ZXNlJyxcblx0XHRubzogJ21lanMubm9yd2VnaWFuJyxcblx0XHRmYTogJ21lanMucGVyc2lhbicsXG5cdFx0cGw6ICdtZWpzLnBvbGlzaCcsXG5cdFx0cHQ6ICdtZWpzLnBvcnR1Z3Vlc2UnLFxuXHRcdHJvOiAnbWVqcy5yb21hbmlhbicsXG5cdFx0cnU6ICdtZWpzLnJ1c3NpYW4nLFxuXHRcdHNyOiAnbWVqcy5zZXJiaWFuJyxcblx0XHRzazogJ21lanMuc2xvdmFrJyxcblx0XHRzbDogJ21lanMuc2xvdmVuaWFuJyxcblx0XHRlczogJ21lanMuc3BhbmlzaCcsXG5cdFx0c3c6ICdtZWpzLnN3YWhpbGknLFxuXHRcdHN2OiAnbWVqcy5zd2VkaXNoJyxcblx0XHR0bDogJ21lanMudGFnYWxvZycsXG5cdFx0dGg6ICdtZWpzLnRoYWknLFxuXHRcdHRyOiAnbWVqcy50dXJraXNoJyxcblx0XHR1azogJ21lanMudWtyYWluaWFuJyxcblx0XHR2aTogJ21lanMudmlldG5hbWVzZScsXG5cdFx0Y3k6ICdtZWpzLndlbHNoJyxcblx0XHR5aTogJ21lanMueWlkZGlzaCdcblx0fVxufTtcblxuLypcbiBQYXJzZXMgV2ViVlRUIGZvcm1hdCB3aGljaCBzaG91bGQgYmUgZm9ybWF0dGVkIGFzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiBXRUJWVFRcblxuIDFcbiAwMDowMDowMSwxIC0tPiAwMDowMDowNSwwMDBcbiBBIGxpbmUgb2YgdGV4dFxuXG4gMlxuIDAwOjAxOjE1LDEgLS0+IDAwOjAyOjA1LDAwMFxuIEEgc2Vjb25kIGxpbmUgb2YgdGV4dFxuXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gQWRhcHRlZCBmcm9tOiBodHRwOi8vd3d3LmRlbHBoaWtpLmNvbS9odG1sNS9wbGF5clxuICovXG5tZWpzLlRyYWNrRm9ybWF0UGFyc2VyID0ge1xuXHR3ZWJ2dHQ6IHtcblx0XHQvKipcblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdHBhdHRlcm5fdGltZWNvZGU6IC9eKCg/OlswLTldezEsMn06KT9bMC05XXsyfTpbMC05XXsyfShbLC5dWzAtOV17MSwzfSk/KSAtLVxcPiAoKD86WzAtOV17MSwyfTopP1swLTldezJ9OlswLTldezJ9KFssLl1bMC05XXszfSk/KSguKikkLyxcblxuXHRcdC8qKlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrVGV4dFxuXHRcdCAqIEByZXR1cm5zIHt7dGV4dDogQXJyYXksIHRpbWVzOiBBcnJheX19XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICh0cmFja1RleHQpICB7XG5cdFx0XHRsZXRcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdGxpbmVzID0gbWVqcy5UcmFja0Zvcm1hdFBhcnNlci5zcGxpdDIodHJhY2tUZXh0LCAvXFxyP1xcbi8pLFxuXHRcdFx0XHRlbnRyaWVzID0gW10sXG5cdFx0XHRcdHRpbWVjb2RlLFxuXHRcdFx0XHR0ZXh0LFxuXHRcdFx0XHRpZGVudGlmaWVyO1xuXHRcdFx0Zm9yICg7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0aW1lY29kZSA9IHRoaXMucGF0dGVybl90aW1lY29kZS5leGVjKGxpbmVzW2ldKTtcblxuXHRcdFx0XHRpZiAodGltZWNvZGUgJiYgaSA8IGxpbmVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmICgoaSAtIDEpID49IDAgJiYgbGluZXNbaSAtIDFdICE9PSAnJykge1xuXHRcdFx0XHRcdFx0aWRlbnRpZmllciA9IGxpbmVzW2kgLSAxXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdC8vIGdyYWIgYWxsIHRoZSAocG9zc2libHkgbXVsdGktbGluZSkgdGV4dCB0aGF0IGZvbGxvd3Ncblx0XHRcdFx0XHR0ZXh0ID0gbGluZXNbaV07XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdHdoaWxlIChsaW5lc1tpXSAhPT0gJycgJiYgaSA8IGxpbmVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dGV4dCA9IGAke3RleHR9XFxuJHtsaW5lc1tpXX1gO1xuXHRcdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0ZXh0ID0gJC50cmltKHRleHQpLnJlcGxhY2UoLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZywgXCI8YSBocmVmPSckMScgdGFyZ2V0PSdfYmxhbmsnPiQxPC9hPlwiKTtcblx0XHRcdFx0XHRlbnRyaWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWRlbnRpZmllcjogaWRlbnRpZmllcixcblx0XHRcdFx0XHRcdHN0YXJ0OiAoY29udmVydFNNUFRFdG9TZWNvbmRzKHRpbWVjb2RlWzFdKSA9PT0gMCkgPyAwLjIwMCA6IGNvbnZlcnRTTVBURXRvU2Vjb25kcyh0aW1lY29kZVsxXSksXG5cdFx0XHRcdFx0XHRzdG9wOiBjb252ZXJ0U01QVEV0b1NlY29uZHModGltZWNvZGVbM10pLFxuXHRcdFx0XHRcdFx0dGV4dDogdGV4dCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiB0aW1lY29kZVs1XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlkZW50aWZpZXIgPSAnJztcblx0XHRcdH1cblx0XHRcdHJldHVybiBlbnRyaWVzO1xuXHRcdH1cblx0fSxcblx0Ly8gVGhhbmtzIHRvIEp1c3RpbiBDYXBlbGxhOiBodHRwczovL2dpdGh1Yi5jb20vam9obmR5ZXIvbWVkaWFlbGVtZW50L3B1bGwvNDIwXG5cdGRmeHA6IHtcblx0XHQvKipcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja1RleHRcblx0XHQgKiBAcmV0dXJucyB7e3RleHQ6IEFycmF5LCB0aW1lczogQXJyYXl9fVxuXHRcdCAqL1xuXHRcdHBhcnNlOiBmdW5jdGlvbiAodHJhY2tUZXh0KSAge1xuXHRcdFx0dHJhY2tUZXh0ID0gJCh0cmFja1RleHQpLmZpbHRlcigndHQnKTtcblx0XHRcdGxldFxuXHRcdFx0XHRjb250YWluZXIgPSB0cmFja1RleHQuY2hpbGRyZW4oJ2RpdicpLmVxKDApLFxuXHRcdFx0XHRsaW5lcyA9IGNvbnRhaW5lci5maW5kKCdwJyksXG5cdFx0XHRcdHN0eWxlTm9kZSA9IHRyYWNrVGV4dC5maW5kKGAjJHtjb250YWluZXIuYXR0cignc3R5bGUnKX1gKSxcblx0XHRcdFx0c3R5bGVzLFxuXHRcdFx0XHRlbnRyaWVzID0gW10sXG5cdFx0XHRcdGlcblx0XHRcdDtcblxuXG5cdFx0XHRpZiAoc3R5bGVOb2RlLmxlbmd0aCkge1xuXHRcdFx0XHRsZXQgYXR0cmlidXRlcyA9IHN0eWxlTm9kZS5yZW1vdmVBdHRyKCdpZCcpLmdldCgwKS5hdHRyaWJ1dGVzO1xuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRzdHlsZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0c3R5bGVzW2F0dHJpYnV0ZXNbaV0ubmFtZS5zcGxpdChcIjpcIilbMV1dID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHN0eWxlLFxuXHRcdFx0XHRcdF90ZW1wID0ge1xuXHRcdFx0XHRcdFx0c3RhcnQ6IG51bGwsXG5cdFx0XHRcdFx0XHRzdG9wOiBudWxsLFxuXHRcdFx0XHRcdFx0c3R5bGU6IG51bGwsXG5cdFx0XHRcdFx0XHR0ZXh0OiBudWxsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0aWYgKGxpbmVzLmVxKGkpLmF0dHIoJ2JlZ2luJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdGFydCA9IGNvbnZlcnRTTVBURXRvU2Vjb25kcyhsaW5lcy5lcShpKS5hdHRyKCdiZWdpbicpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90ZW1wLnN0YXJ0ICYmIGxpbmVzLmVxKGkgLSAxKS5hdHRyKCdlbmQnKSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0YXJ0ID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkgLSAxKS5hdHRyKCdlbmQnKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGxpbmVzLmVxKGkpLmF0dHIoJ2VuZCcpKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RvcCA9IGNvbnZlcnRTTVBURXRvU2Vjb25kcyhsaW5lcy5lcShpKS5hdHRyKCdlbmQnKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFfdGVtcC5zdG9wICYmIGxpbmVzLmVxKGkgKyAxKS5hdHRyKCdiZWdpbicpKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RvcCA9IGNvbnZlcnRTTVBURXRvU2Vjb25kcyhsaW5lcy5lcShpICsgMSkuYXR0cignYmVnaW4nKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc3R5bGVzKSB7XG5cdFx0XHRcdFx0c3R5bGUgPSAnJztcblx0XHRcdFx0XHRmb3IgKGxldCBfc3R5bGUgaW4gc3R5bGVzKSB7XG5cdFx0XHRcdFx0XHRzdHlsZSArPSBgJHtfc3R5bGV9OiR7c3R5bGVzW19zdHlsZV19O2A7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdHlsZSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0eWxlID0gc3R5bGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF90ZW1wLnN0YXJ0ID09PSAwKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RhcnQgPSAwLjIwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRfdGVtcC50ZXh0ID0gJC50cmltKGxpbmVzLmVxKGkpLmh0bWwoKSkucmVwbGFjZSgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnLCBcIjxhIGhyZWY9JyQxJyB0YXJnZXQ9J19ibGFuayc+JDE8L2E+XCIpO1xuXHRcdFx0XHRlbnRyaWVzLnB1c2goX3RlbXApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGVudHJpZXM7XG5cdFx0fVxuXHR9LFxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHRcblx0ICogQHBhcmFtIHtTdHJpbmd9IHJlZ2V4XG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICovXG5cdHNwbGl0MjogZnVuY3Rpb24gKHRleHQsIHJlZ2V4KSAge1xuXHRcdC8vIG5vcm1hbCB2ZXJzaW9uIGZvciBjb21wbGlhbnQgYnJvd3NlcnNcblx0XHQvLyBzZWUgYmVsb3cgZm9yIElFIGZpeFxuXHRcdHJldHVybiB0ZXh0LnNwbGl0KHJlZ2V4KTtcblx0fVxufTtcblxuLy8gdGVzdCBmb3IgYnJvd3NlcnMgd2l0aCBiYWQgU3RyaW5nLnNwbGl0IG1ldGhvZC5cbmlmICgneFxcblxcbnknLnNwbGl0KC9cXG4vZ2kpLmxlbmd0aCAhPT0gMykge1xuXHQvLyBhZGQgc3VwZXIgc2xvdyBJRTggYW5kIGJlbG93IHZlcnNpb25cblx0bWVqcy5UcmFja0Zvcm1hdFBhcnNlci5zcGxpdDIgPSAodGV4dCwgcmVnZXgpID0+IHtcblx0XHRsZXRcblx0XHRcdHBhcnRzID0gW10sXG5cdFx0XHRjaHVuayA9ICcnLFxuXHRcdFx0aTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjaHVuayArPSB0ZXh0LnN1YnN0cmluZyhpLCBpICsgMSk7XG5cdFx0XHRpZiAocmVnZXgudGVzdChjaHVuaykpIHtcblx0XHRcdFx0cGFydHMucHVzaChjaHVuay5yZXBsYWNlKHJlZ2V4LCAnJykpO1xuXHRcdFx0XHRjaHVuayA9ICcnO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRwYXJ0cy5wdXNoKGNodW5rKTtcblx0XHRyZXR1cm4gcGFydHM7XG5cdH07XG59XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge0lTX0FORFJPSUQsIElTX0lPU30gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcblxuLyoqXG4gKiBWb2x1bWUgYnV0dG9uXG4gKlxuICogVGhpcyBmZWF0dXJlIGVuYWJsZXMgdGhlIGRpc3BsYXlpbmcgb2YgYSBWb2x1bWUgYnV0dG9uIGluIHRoZSBjb250cm9sIGJhciwgYW5kIGFsc28gY29udGFpbnMgbG9naWMgdG8gbWFuaXB1bGF0ZSBpdHNcbiAqIGV2ZW50cywgc3VjaCBhcyBzbGlkaW5nIHVwL2Rvd24gKG9yIGxlZnQvcmlnaHQsIGlmIHZlcnRpY2FsKSwgbXV0aW5nL3VubXV0aW5nIG1lZGlhLCBldGMuXG4gKi9cblxuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0bXV0ZVRleHQ6ICcnLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGFsbHlWb2x1bWVDb250cm9sVGV4dDogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGhpZGVWb2x1bWVPblRvdWNoRGV2aWNlczogdHJ1ZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRhdWRpb1ZvbHVtZTogJ2hvcml6b250YWwnLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHZpZGVvVm9sdW1lOiAndmVydGljYWwnXG59KTtcblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRidWlsZHZvbHVtZTogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cblx0XHQvLyBBbmRyb2lkIGFuZCBpT1MgZG9uJ3Qgc3VwcG9ydCB2b2x1bWUgY29udHJvbHNcblx0XHRpZiAoKElTX0FORFJPSUQgfHwgSVNfSU9TKSAmJiB0aGlzLm9wdGlvbnMuaGlkZVZvbHVtZU9uVG91Y2hEZXZpY2VzKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG1vZGUgPSAodC5pc1ZpZGVvKSA/IHQub3B0aW9ucy52aWRlb1ZvbHVtZSA6IHQub3B0aW9ucy5hdWRpb1ZvbHVtZSxcblx0XHRcdG11dGVUZXh0ID0gdC5vcHRpb25zLm11dGVUZXh0ID8gdC5vcHRpb25zLm11dGVUZXh0IDogaTE4bi50KCdtZWpzLm11dGUtdG9nZ2xlJyksXG5cdFx0XHR2b2x1bWVDb250cm9sVGV4dCA9IHQub3B0aW9ucy5hbGx5Vm9sdW1lQ29udHJvbFRleHQgPyB0Lm9wdGlvbnMuYWxseVZvbHVtZUNvbnRyb2xUZXh0IDogaTE4bi50KCdtZWpzLnZvbHVtZS1oZWxwLXRleHQnKSxcblx0XHRcdG11dGUgPSAobW9kZSA9PT0gJ2hvcml6b250YWwnKSA/XG5cblx0XHRcdFx0Ly8gaG9yaXpvbnRhbCB2ZXJzaW9uXG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlXCI+YCArXG5cdFx0XHRcdFx0YDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtY29udHJvbHM9XCIke3QuaWR9XCIgdGl0bGU9XCIke211dGVUZXh0fVwiIGFyaWEtbGFiZWw9XCIke211dGVUZXh0fVwiPjwvYnV0dG9uPmAgK1xuXHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtc2xpZGVyXCI+YCArXG5cdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuXCI+JHt2b2x1bWVDb250cm9sVGV4dH08L3NwYW4+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS10b3RhbFwiPmAgK1xuXHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1jdXJyZW50XCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLWhhbmRsZVwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDwvYT5gKVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpIDpcblxuXHRcdFx0XHQvLyB2ZXJ0aWNhbCB2ZXJzaW9uXG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlXCI+YCArXG5cdFx0XHRcdFx0YDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtY29udHJvbHM9XCIke3QuaWR9XCIgdGl0bGU9XCIke211dGVUZXh0fVwiIGFyaWEtbGFiZWw9XCIke211dGVUZXh0fVwiPjwvYnV0dG9uPmAgK1xuXHRcdFx0XHRcdGA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlclwiPmAgK1xuXHRcdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuXCI+JHt2b2x1bWVDb250cm9sVGV4dH08L3NwYW4+YCArXG5cdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS10b3RhbFwiPmAgK1xuXHRcdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1jdXJyZW50XCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWhhbmRsZVwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8L2E+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpLFxuXHRcdFx0dm9sdW1lU2xpZGVyID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXIsIFxuXHRcdFx0XHQuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtc2xpZGVyYCksXG5cdFx0XHR2b2x1bWVUb3RhbCA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtdG90YWwsIFxuXHRcdFx0XHQuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtdG90YWxgKSxcblx0XHRcdHZvbHVtZUN1cnJlbnQgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWN1cnJlbnQsIFxuXHRcdFx0XHQuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtY3VycmVudGApLFxuXHRcdFx0dm9sdW1lSGFuZGxlID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1oYW5kbGUsIFxuXHRcdFx0XHQuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtaGFuZGxlYCksXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB2b2x1bWVcblx0XHRcdCAqL1xuXHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUgPSAodm9sdW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gY29ycmVjdCB0byAwLTFcblx0XHRcdFx0dm9sdW1lID0gTWF0aC5tYXgoMCwgdm9sdW1lKTtcblx0XHRcdFx0dm9sdW1lID0gTWF0aC5taW4odm9sdW1lLCAxKTtcblxuXHRcdFx0XHQvLyBhZGp1c3QgbXV0ZSBidXR0b24gc3R5bGVcblx0XHRcdFx0aWYgKHZvbHVtZSA9PT0gMCkge1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCk7XG5cdFx0XHRcdFx0bXV0ZS5jaGlsZHJlbignYnV0dG9uJykuYXR0cih7XG5cdFx0XHRcdFx0XHR0aXRsZTogaTE4bi50KCdtZWpzLnVubXV0ZScpLFxuXHRcdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBpMThuLnQoJ21lanMudW5tdXRlJylcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApO1xuXHRcdFx0XHRcdG11dGUuY2hpbGRyZW4oJ2J1dHRvbicpLmF0dHIoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IGkxOG4udCgnbWVqcy5tdXRlJyksXG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IGkxOG4udCgnbWVqcy5tdXRlJylcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCB2b2x1bWVQZXJjZW50YWdlID0gYCR7KHZvbHVtZSAqIDEwMCl9JWA7XG5cblx0XHRcdFx0Ly8gcG9zaXRpb24gc2xpZGVyXG5cdFx0XHRcdGlmIChtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdFx0dm9sdW1lQ3VycmVudC5jc3Moe1xuXHRcdFx0XHRcdFx0Ym90dG9tOiAnMCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IHZvbHVtZVBlcmNlbnRhZ2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2b2x1bWVIYW5kbGUuY3NzKHtcblx0XHRcdFx0XHRcdGJvdHRvbTogdm9sdW1lUGVyY2VudGFnZSxcblx0XHRcdFx0XHRcdG1hcmdpbkJvdHRvbTogYCR7KC12b2x1bWVIYW5kbGUuaGVpZ2h0KCkgLyAyKX1weGBcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2b2x1bWVDdXJyZW50LmNzcyh7XG5cdFx0XHRcdFx0XHRsZWZ0OiAnMCcsXG5cdFx0XHRcdFx0XHR3aWR0aDogdm9sdW1lUGVyY2VudGFnZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZvbHVtZUhhbmRsZS5jc3Moe1xuXHRcdFx0XHRcdFx0bGVmdDogdm9sdW1lUGVyY2VudGFnZSxcblx0XHRcdFx0XHRcdG1hcmdpbkxlZnQ6IGAkeygtdm9sdW1lSGFuZGxlLndpZHRoKCkgLyAyKX1weGBcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0aGFuZGxlVm9sdW1lTW92ZSA9IChlKSA9PiB7XG5cblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0dm9sdW1lID0gbnVsbCxcblx0XHRcdFx0XHR0b3RhbE9mZnNldCA9IHZvbHVtZVRvdGFsLm9mZnNldCgpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIG5ldyB2b2x1bWUgYmFzZWQgb24gdGhlIG1vc3QgcmVjZW50IHBvc2l0aW9uXG5cdFx0XHRcdGlmIChtb2RlID09PSAndmVydGljYWwnKSB7XG5cblx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdHJhaWxIZWlnaHQgPSB2b2x1bWVUb3RhbC5oZWlnaHQoKSxcblx0XHRcdFx0XHRcdG5ld1kgPSBlLnBhZ2VZIC0gdG90YWxPZmZzZXQudG9wXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0dm9sdW1lID0gKHJhaWxIZWlnaHQgLSBuZXdZKSAvIHJhaWxIZWlnaHQ7XG5cblx0XHRcdFx0XHQvLyB0aGUgY29udHJvbHMganVzdCBoaWRlIHRoZW1zZWx2ZXMgKHVzdWFsbHkgd2hlbiBtb3VzZSBtb3ZlcyB0b28gZmFyIHVwKVxuXHRcdFx0XHRcdGlmICh0b3RhbE9mZnNldC50b3AgPT09IDAgfHwgdG90YWxPZmZzZXQubGVmdCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0cmFpbFdpZHRoID0gdm9sdW1lVG90YWwud2lkdGgoKSxcblx0XHRcdFx0XHRcdG5ld1ggPSBlLnBhZ2VYIC0gdG90YWxPZmZzZXQubGVmdFxuXHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdHZvbHVtZSA9IG5ld1ggLyByYWlsV2lkdGg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBlbnN1cmUgdGhlIHZvbHVtZSBpc24ndCBvdXRzaWRlIDAtMVxuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1heCgwLCB2b2x1bWUpO1xuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1pbih2b2x1bWUsIDEpO1xuXG5cdFx0XHRcdC8vIHBvc2l0aW9uIHRoZSBzbGlkZXIgYW5kIGhhbmRsZVxuXHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSh2b2x1bWUpO1xuXG5cdFx0XHRcdC8vIHNldCB0aGUgbWVkaWEgb2JqZWN0ICh0aGlzIHdpbGwgdHJpZ2dlciB0aGUgYHZvbHVtZWNoYW5nZWRgIGV2ZW50KVxuXHRcdFx0XHRpZiAodm9sdW1lID09PSAwKSB7XG5cdFx0XHRcdFx0bWVkaWEuc2V0TXV0ZWQodHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVkaWEuc2V0TXV0ZWQoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG1lZGlhLnNldFZvbHVtZSh2b2x1bWUpO1xuXHRcdFx0fSxcblx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2UsXG5cdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlO1xuXG5cdFx0Ly8gU0xJREVSXG5cdFx0bXV0ZVxuXHRcdFx0Lm9uKCdtb3VzZWVudGVyIGZvY3VzaW4nLCAoKSA9PiB7XG5cdFx0XHRcdHZvbHVtZVNsaWRlci5zaG93KCk7XG5cdFx0XHRcdG1vdXNlSXNPdmVyID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ21vdXNlbGVhdmUgZm9jdXNvdXQnLCAoKSA9PiB7XG5cdFx0XHRcdG1vdXNlSXNPdmVyID0gZmFsc2U7XG5cblx0XHRcdFx0aWYgKCFtb3VzZUlzRG93biAmJiBtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdFx0dm9sdW1lU2xpZGVyLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvKipcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGxldCB1cGRhdGVWb2x1bWVTbGlkZXIgPSAoKSA9PiB7XG5cblx0XHRcdGxldCB2b2x1bWUgPSBNYXRoLmZsb29yKG1lZGlhLnZvbHVtZSAqIDEwMCk7XG5cblx0XHRcdHZvbHVtZVNsaWRlci5hdHRyKHtcblx0XHRcdFx0J2FyaWEtbGFiZWwnOiBpMThuLnQoJ21lanMudm9sdW1lLXNsaWRlcicpLFxuXHRcdFx0XHQnYXJpYS12YWx1ZW1pbic6IDAsXG5cdFx0XHRcdCdhcmlhLXZhbHVlbWF4JzogMTAwLFxuXHRcdFx0XHQnYXJpYS12YWx1ZW5vdyc6IHZvbHVtZSxcblx0XHRcdFx0J2FyaWEtdmFsdWV0ZXh0JzogYCR7dm9sdW1lfSVgLFxuXHRcdFx0XHQncm9sZSc6ICdzbGlkZXInLFxuXHRcdFx0XHQndGFiaW5kZXgnOiAtMVxuXHRcdFx0fSk7XG5cblx0XHR9O1xuXG5cdFx0Ly8gRXZlbnRzXG5cdFx0dm9sdW1lU2xpZGVyXG5cdFx0XHQub24oJ21vdXNlb3ZlcicsICgpID0+IHtcblx0XHRcdFx0bW91c2VJc092ZXIgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHRcdC5vbignbW91c2Vkb3duJywgKGUpID0+IHtcblx0XHRcdFx0aGFuZGxlVm9sdW1lTW92ZShlKTtcblx0XHRcdFx0dC5nbG9iYWxCaW5kKCdtb3VzZW1vdmUudm9sJywgKGUpID0+IHtcblx0XHRcdFx0XHRoYW5kbGVWb2x1bWVNb3ZlKGUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dC5nbG9iYWxCaW5kKCdtb3VzZXVwLnZvbCcsICgpID0+IHtcblx0XHRcdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdHQuZ2xvYmFsVW5iaW5kKCdtb3VzZW1vdmUudm9sIG1vdXNldXAudm9sJyk7XG5cblx0XHRcdFx0XHRpZiAoIW1vdXNlSXNPdmVyICYmIG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0XHRcdHZvbHVtZVNsaWRlci5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0bW91c2VJc0Rvd24gPSB0cnVlO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMua2V5QWN0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdGtleUNvZGUgPSBlLndoaWNoIHx8IGUua2V5Q29kZSB8fCAwLFxuXHRcdFx0XHRcdFx0dm9sdW1lID0gbWVkaWEudm9sdW1lXG5cdFx0XHRcdFx0O1xuXHRcdFx0XHRcdHN3aXRjaCAoa2V5Q29kZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSAzODogLy8gVXBcblx0XHRcdFx0XHRcdFx0dm9sdW1lID0gTWF0aC5taW4odm9sdW1lICsgMC4xLCAxKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQwOiAvLyBEb3duXG5cdFx0XHRcdFx0XHRcdHZvbHVtZSA9IE1hdGgubWF4KDAsIHZvbHVtZSAtIDAuMSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZTtcblx0XHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSh2b2x1bWUpO1xuXHRcdFx0XHRcdG1lZGlhLnNldFZvbHVtZSh2b2x1bWUpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHQvLyBNVVRFIGJ1dHRvblxuXHRcdG11dGUuZmluZCgnYnV0dG9uJykuY2xpY2soKCkgPT4ge1xuXHRcdFx0bWVkaWEuc2V0TXV0ZWQoIW1lZGlhLm11dGVkKTtcblx0XHR9KTtcblxuXHRcdC8vS2V5Ym9hcmQgaW5wdXRcblx0XHRtdXRlLmZpbmQoJ2J1dHRvbicpLm9uKCdmb2N1cycsICgpID0+IHtcblx0XHRcdGlmIChtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdHZvbHVtZVNsaWRlci5zaG93KCk7XG5cdFx0XHR9XG5cdFx0fSkub24oJ2JsdXInLCAoKSA9PiB7XG5cdFx0XHRpZiAobW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHR2b2x1bWVTbGlkZXIuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gbGlzdGVuIGZvciB2b2x1bWUgY2hhbmdlIGV2ZW50cyBmcm9tIG90aGVyIHNvdXJjZXNcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd2b2x1bWVjaGFuZ2UnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKCFtb3VzZUlzRG93bikge1xuXHRcdFx0XHRpZiAobWVkaWEubXV0ZWQpIHtcblx0XHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSgwKTtcblx0XHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKG1lZGlhLnZvbHVtZSk7XG5cdFx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dXBkYXRlVm9sdW1lU2xpZGVyKGUpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdC8vIG11dGVzIHRoZSBtZWRpYSBhbmQgc2V0cyB0aGUgdm9sdW1lIGljb24gbXV0ZWQgaWYgdGhlIGluaXRpYWwgdm9sdW1lIGlzIHNldCB0byAwXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnN0YXJ0Vm9sdW1lID09PSAwKSB7XG5cdFx0XHRtZWRpYS5zZXRNdXRlZCh0cnVlKTtcblx0XHR9XG5cblx0XHQvLyBzaGltIGdldHMgdGhlIHN0YXJ0dm9sdW1lIGFzIGEgcGFyYW1ldGVyLCBidXQgd2UgaGF2ZSB0byBzZXQgaXQgb24gdGhlIG5hdGl2ZSA8dmlkZW8+IGFuZCA8YXVkaW8+IGVsZW1lbnRzXG5cdFx0bGV0IGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGw7XG5cblx0XHRpZiAoaXNOYXRpdmUpIHtcblx0XHRcdG1lZGlhLnNldFZvbHVtZShwbGF5ZXIub3B0aW9ucy5zdGFydFZvbHVtZSk7XG5cdFx0fVxuXG5cdFx0dC5jb250YWluZXIub24oJ2NvbnRyb2xzcmVzaXplJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLm11dGVkKSB7XG5cdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKDApO1xuXHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKG1lZGlhLnZvbHVtZSk7XG5cdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59KTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIVxuICogVGhpcyBpcyBhIGBpMThuYCBsYW5ndWFnZSBvYmplY3QuXG4gKlxuICogRW5nbGlzaDsgVGhpcyBjYW4gc2VydmUgYXMgYSB0ZW1wbGF0ZSBmb3Igb3RoZXIgbGFuZ3VhZ2VzIHRvIHRyYW5zbGF0ZVxuICpcbiAqIEBhdXRob3JcbiAqICAgVEJEXG4gKiAgIFNhc2NoYSBHcmV1ZWwgKFR3aXR0ZXI6IEBTb2Z0Q3JlYXRSKVxuICpcbiAqIEBzZWUgY29yZS9pMThuLmpzXG4gKi9cbmV4cG9ydCBjb25zdCBFTiA9IHtcblx0XCJtZWpzLnBsdXJhbC1mb3JtXCI6IDEsXG5cblx0Ly8gcmVuZGVyZXJzL2ZsYXNoLmpzXG5cdFwibWVqcy5pbnN0YWxsLWZsYXNoXCI6IFwiWW91IGFyZSB1c2luZyBhIGJyb3dzZXIgdGhhdCBkb2VzIG5vdCBoYXZlIEZsYXNoIHBsYXllciBlbmFibGVkIG9yIGluc3RhbGxlZC4gUGxlYXNlIHR1cm4gb24geW91ciBGbGFzaCBwbGF5ZXIgcGx1Z2luIG9yIGRvd25sb2FkIHRoZSBsYXRlc3QgdmVyc2lvbiBmcm9tIGh0dHBzOi8vZ2V0LmFkb2JlLmNvbS9mbGFzaHBsYXllci9cIixcblxuXHQvLyBmZWF0dXJlcy9jb250ZXh0bWVudS5qc1xuXHRcIm1lanMuZnVsbHNjcmVlbi1vZmZcIjogXCJUdXJuIG9mZiBGdWxsc2NyZWVuXCIsXG5cdFwibWVqcy5mdWxsc2NyZWVuLW9uXCI6IFwiR28gRnVsbHNjcmVlblwiLFxuXHRcIm1lanMuZG93bmxvYWQtdmlkZW9cIjogXCJEb3dubG9hZCBWaWRlb1wiLFxuXG5cdC8vIGZlYXR1cmVzL2Z1bGxzY3JlZW4uanNcblx0XCJtZWpzLmZ1bGxzY3JlZW5cIjogXCJGdWxsc2NyZWVuXCIsXG5cblx0Ly8gZmVhdHVyZXMvanVtcGZvcndhcmQuanNcblx0XCJtZWpzLnRpbWUtanVtcC1mb3J3YXJkXCI6IFtcIkp1bXAgZm9yd2FyZCAxIHNlY29uZFwiLCBcIkp1bXAgZm9yd2FyZCAlMSBzZWNvbmRzXCJdLFxuXG5cdC8vIGZlYXR1cmVzL2xvb3AuanNcblx0XCJtZWpzLmxvb3BcIjogXCJUb2dnbGUgTG9vcFwiLFxuXG5cdC8vIGZlYXR1cmVzL3BsYXlwYXVzZS5qc1xuXHRcIm1lanMucGxheVwiOiBcIlBsYXlcIixcblx0XCJtZWpzLnBhdXNlXCI6IFwiUGF1c2VcIixcblxuXHQvLyBmZWF0dXJlcy9wb3N0cm9sbC5qc1xuXHRcIm1lanMuY2xvc2VcIjogXCJDbG9zZVwiLFxuXG5cdC8vIGZlYXR1cmVzL3Byb2dyZXNzLmpzXG5cdFwibWVqcy50aW1lLXNsaWRlclwiOiBcIlRpbWUgU2xpZGVyXCIsXG5cdFwibWVqcy50aW1lLWhlbHAtdGV4dFwiOiBcIlVzZSBMZWZ0L1JpZ2h0IEFycm93IGtleXMgdG8gYWR2YW5jZSBvbmUgc2Vjb25kLCBVcC9Eb3duIGFycm93cyB0byBhZHZhbmNlIHRlbiBzZWNvbmRzLlwiLFxuXG5cdC8vIGZlYXR1cmVzL3NraXBiYWNrLmpzXG5cdFwibWVqcy50aW1lLXNraXAtYmFja1wiOiBbXCJTa2lwIGJhY2sgMSBzZWNvbmRcIiwgXCJTa2lwIGJhY2sgJTEgc2Vjb25kc1wiXSxcblxuXHQvLyBmZWF0dXJlcy90cmFja3MuanNcblx0XCJtZWpzLmNhcHRpb25zLXN1YnRpdGxlc1wiOiBcIkNhcHRpb25zL1N1YnRpdGxlc1wiLFxuXHRcIm1lanMubm9uZVwiOiBcIk5vbmVcIixcblxuXHQvLyBmZWF0dXJlcy92b2x1bWUuanNcblx0XCJtZWpzLm11dGUtdG9nZ2xlXCI6IFwiTXV0ZSBUb2dnbGVcIixcblx0XCJtZWpzLnZvbHVtZS1oZWxwLXRleHRcIjogXCJVc2UgVXAvRG93biBBcnJvdyBrZXlzIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHZvbHVtZS5cIixcblx0XCJtZWpzLnVubXV0ZVwiOiBcIlVubXV0ZVwiLFxuXHRcIm1lanMubXV0ZVwiOiBcIk11dGVcIixcblx0XCJtZWpzLnZvbHVtZS1zbGlkZXJcIjogXCJWb2x1bWUgU2xpZGVyXCIsXG5cblx0Ly8gY29yZS9wbGF5ZXIuanNcblx0XCJtZWpzLnZpZGVvLXBsYXllclwiOiBcIlZpZGVvIFBsYXllclwiLFxuXHRcIm1lanMuYXVkaW8tcGxheWVyXCI6IFwiQXVkaW8gUGxheWVyXCIsXG5cblx0Ly8gZmVhdHVyZXMvYWRzLmpzXG5cdFwibWVqcy5hZC1za2lwXCI6IFwiU2tpcCBhZFwiLFxuXHRcIm1lanMuYWQtc2tpcC1pbmZvXCI6IFtcIlNraXAgaW4gMSBzZWNvbmRcIiwgXCJTa2lwIGluICUxIHNlY29uZHNcIl0sXG5cblx0Ly8gZmVhdHVyZXMvc291cmNlY2hvb3Nlci5qc1xuXHRcIm1lanMuc291cmNlLWNob29zZXJcIjogXCJTb3VyY2UgQ2hvb3NlclwiLFxuXG5cdC8vIGZlYXR1cmVzL3N0b3AuanNcblx0XCJtZWpzLnN0b3BcIjogXCJTdG9wXCIsXG5cblx0Ly9mZWF0dXJlcy9zcGVlZC5qc1xuXHRcIm1lanMuc3BlZWQtcmF0ZVwiIDogXCJTcGVlZCBSYXRlXCIsXG5cblx0Ly9mZWF0dXJlcy9wcm9ncmVzcy5qc1xuXHRcIm1lanMubGl2ZS1icm9hZGNhc3RcIiA6IFwiTGl2ZSBCcm9hZGNhc3RcIixcblxuXHQvLyBmZWF0dXJlcy90cmFja3MuanNcblx0XCJtZWpzLmFmcmlrYWFuc1wiOiBcIkFmcmlrYWFuc1wiLFxuXHRcIm1lanMuYWxiYW5pYW5cIjogXCJBbGJhbmlhblwiLFxuXHRcIm1lanMuYXJhYmljXCI6IFwiQXJhYmljXCIsXG5cdFwibWVqcy5iZWxhcnVzaWFuXCI6IFwiQmVsYXJ1c2lhblwiLFxuXHRcIm1lanMuYnVsZ2FyaWFuXCI6IFwiQnVsZ2FyaWFuXCIsXG5cdFwibWVqcy5jYXRhbGFuXCI6IFwiQ2F0YWxhblwiLFxuXHRcIm1lanMuY2hpbmVzZVwiOiBcIkNoaW5lc2VcIixcblx0XCJtZWpzLmNoaW5lc2Utc2ltcGxpZmllZFwiOiBcIkNoaW5lc2UgKFNpbXBsaWZpZWQpXCIsXG5cdFwibWVqcy5jaGluZXNlLXRyYWRpdGlvbmFsXCI6IFwiQ2hpbmVzZSAoVHJhZGl0aW9uYWwpXCIsXG5cdFwibWVqcy5jcm9hdGlhblwiOiBcIkNyb2F0aWFuXCIsXG5cdFwibWVqcy5jemVjaFwiOiBcIkN6ZWNoXCIsXG5cdFwibWVqcy5kYW5pc2hcIjogXCJEYW5pc2hcIixcblx0XCJtZWpzLmR1dGNoXCI6IFwiRHV0Y2hcIixcblx0XCJtZWpzLmVuZ2xpc2hcIjogXCJFbmdsaXNoXCIsXG5cdFwibWVqcy5lc3RvbmlhblwiOiBcIkVzdG9uaWFuXCIsXG5cdFwibWVqcy5maWxpcGlub1wiOiBcIkZpbGlwaW5vXCIsXG5cdFwibWVqcy5maW5uaXNoXCI6IFwiRmlubmlzaFwiLFxuXHRcIm1lanMuZnJlbmNoXCI6IFwiRnJlbmNoXCIsXG5cdFwibWVqcy5nYWxpY2lhblwiOiBcIkdhbGljaWFuXCIsXG5cdFwibWVqcy5nZXJtYW5cIjogXCJHZXJtYW5cIixcblx0XCJtZWpzLmdyZWVrXCI6IFwiR3JlZWtcIixcblx0XCJtZWpzLmhhaXRpYW4tY3Jlb2xlXCI6IFwiSGFpdGlhbiBDcmVvbGVcIixcblx0XCJtZWpzLmhlYnJld1wiOiBcIkhlYnJld1wiLFxuXHRcIm1lanMuaGluZGlcIjogXCJIaW5kaVwiLFxuXHRcIm1lanMuaHVuZ2FyaWFuXCI6IFwiSHVuZ2FyaWFuXCIsXG5cdFwibWVqcy5pY2VsYW5kaWNcIjogXCJJY2VsYW5kaWNcIixcblx0XCJtZWpzLmluZG9uZXNpYW5cIjogXCJJbmRvbmVzaWFuXCIsXG5cdFwibWVqcy5pcmlzaFwiOiBcIklyaXNoXCIsXG5cdFwibWVqcy5pdGFsaWFuXCI6IFwiSXRhbGlhblwiLFxuXHRcIm1lanMuamFwYW5lc2VcIjogXCJKYXBhbmVzZVwiLFxuXHRcIm1lanMua29yZWFuXCI6IFwiS29yZWFuXCIsXG5cdFwibWVqcy5sYXR2aWFuXCI6IFwiTGF0dmlhblwiLFxuXHRcIm1lanMubGl0aHVhbmlhblwiOiBcIkxpdGh1YW5pYW5cIixcblx0XCJtZWpzLm1hY2Vkb25pYW5cIjogXCJNYWNlZG9uaWFuXCIsXG5cdFwibWVqcy5tYWxheVwiOiBcIk1hbGF5XCIsXG5cdFwibWVqcy5tYWx0ZXNlXCI6IFwiTWFsdGVzZVwiLFxuXHRcIm1lanMubm9yd2VnaWFuXCI6IFwiTm9yd2VnaWFuXCIsXG5cdFwibWVqcy5wZXJzaWFuXCI6IFwiUGVyc2lhblwiLFxuXHRcIm1lanMucG9saXNoXCI6IFwiUG9saXNoXCIsXG5cdFwibWVqcy5wb3J0dWd1ZXNlXCI6IFwiUG9ydHVndWVzZVwiLFxuXHRcIm1lanMucm9tYW5pYW5cIjogXCJSb21hbmlhblwiLFxuXHRcIm1lanMucnVzc2lhblwiOiBcIlJ1c3NpYW5cIixcblx0XCJtZWpzLnNlcmJpYW5cIjogXCJTZXJiaWFuXCIsXG5cdFwibWVqcy5zbG92YWtcIjogXCJTbG92YWtcIixcblx0XCJtZWpzLnNsb3ZlbmlhblwiOiBcIlNsb3ZlbmlhblwiLFxuXHRcIm1lanMuc3BhbmlzaFwiOiBcIlNwYW5pc2hcIixcblx0XCJtZWpzLnN3YWhpbGlcIjogXCJTd2FoaWxpXCIsXG5cdFwibWVqcy5zd2VkaXNoXCI6IFwiU3dlZGlzaFwiLFxuXHRcIm1lanMudGFnYWxvZ1wiOiBcIlRhZ2Fsb2dcIixcblx0XCJtZWpzLnRoYWlcIjogXCJUaGFpXCIsXG5cdFwibWVqcy50dXJraXNoXCI6IFwiVHVya2lzaFwiLFxuXHRcIm1lanMudWtyYWluaWFuXCI6IFwiVWtyYWluaWFuXCIsXG5cdFwibWVqcy52aWV0bmFtZXNlXCI6IFwiVmlldG5hbWVzZVwiLFxuXHRcIm1lanMud2Vsc2hcIjogXCJXZWxzaFwiLFxuXHRcIm1lanMueWlkZGlzaFwiOiBcIllpZGRpc2hcIlxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4vY29yZS9tZWpzJztcblxuaWYgKHR5cGVvZiBqUXVlcnkgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1lanMuJCA9IGpRdWVyeTtcbn0gZWxzZSBpZiAodHlwZW9mIFplcHRvICE9PSAndW5kZWZpbmVkJykge1xuXHRtZWpzLiQgPSBaZXB0bztcblxuXHQvLyBkZWZpbmUgYG91dGVyV2lkdGhgIG1ldGhvZCB3aGljaCBoYXMgbm90IGJlZW4gcmVhbGl6ZWQgaW4gWmVwdG9cblx0WmVwdG8uZm4ub3V0ZXJXaWR0aCA9IGZ1bmN0aW9uIChpbmNsdWRlTWFyZ2luKSB7XG5cdFx0bGV0IHdpZHRoID0gJCh0aGlzKS53aWR0aCgpO1xuXHRcdGlmIChpbmNsdWRlTWFyZ2luKSB7XG5cdFx0XHR3aWR0aCArPSBwYXJzZUludCgkKHRoaXMpLmNzcygnbWFyZ2luLXJpZ2h0JyksIDEwKTtcblx0XHRcdHdpZHRoICs9IHBhcnNlSW50KCQodGhpcykuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCk7XG5cdFx0fVxuXHRcdHJldHVybiB3aWR0aDtcblx0fTtcblxufSBlbHNlIGlmICh0eXBlb2YgZW5kZXIgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1lanMuJCA9IGVuZGVyO1xufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi9jb3JlL21lanMnO1xuaW1wb3J0IE1lZGlhRWxlbWVudCBmcm9tICcuL2NvcmUvbWVkaWFlbGVtZW50JztcbmltcG9ydCBpMThuIGZyb20gJy4vY29yZS9pMThuJztcbmltcG9ydCB7XG5cdElTX0ZJUkVGT1gsXG5cdElTX0lQQUQsXG5cdElTX0lQSE9ORSxcblx0SVNfQU5EUk9JRCxcblx0SVNfSU9TLFxuXHRIQVNfVE9VQ0gsXG5cdEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTixcblx0SEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU5cbn0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHtzcGxpdEV2ZW50c30gZnJvbSAnLi91dGlscy9nZW5lcmFsJztcbmltcG9ydCB7Y2FsY3VsYXRlVGltZUZvcm1hdH0gZnJvbSAnLi91dGlscy90aW1lJztcbmltcG9ydCB7aXNOb2RlQWZ0ZXJ9IGZyb20gJy4vdXRpbHMvZG9tJztcblxubWVqcy5tZXBJbmRleCA9IDA7XG5cbm1lanMucGxheWVycyA9IHt9O1xuXG4vLyBkZWZhdWx0IHBsYXllciB2YWx1ZXNcbmV4cG9ydCBsZXQgY29uZmlnID0ge1xuXHQvLyB1cmwgdG8gcG9zdGVyICh0byBmaXggaU9TIDMueClcblx0cG9zdGVyOiAnJyxcblx0Ly8gV2hlbiB0aGUgdmlkZW8gaXMgZW5kZWQsIHdlIGNhbiBzaG93IHRoZSBwb3N0ZXIuXG5cdHNob3dQb3N0ZXJXaGVuRW5kZWQ6IGZhbHNlLFxuXHQvLyBkZWZhdWx0IGlmIHRoZSA8dmlkZW8gd2lkdGg+IGlzIG5vdCBzcGVjaWZpZWRcblx0ZGVmYXVsdFZpZGVvV2lkdGg6IDQ4MCxcblx0Ly8gZGVmYXVsdCBpZiB0aGUgPHZpZGVvIGhlaWdodD4gaXMgbm90IHNwZWNpZmllZFxuXHRkZWZhdWx0VmlkZW9IZWlnaHQ6IDI3MCxcblx0Ly8gaWYgc2V0LCBvdmVycmlkZXMgPHZpZGVvIHdpZHRoPlxuXHR2aWRlb1dpZHRoOiAtMSxcblx0Ly8gaWYgc2V0LCBvdmVycmlkZXMgPHZpZGVvIGhlaWdodD5cblx0dmlkZW9IZWlnaHQ6IC0xLFxuXHQvLyBkZWZhdWx0IGlmIHRoZSB1c2VyIGRvZXNuJ3Qgc3BlY2lmeVxuXHRkZWZhdWx0QXVkaW9XaWR0aDogNDAwLFxuXHQvLyBkZWZhdWx0IGlmIHRoZSB1c2VyIGRvZXNuJ3Qgc3BlY2lmeVxuXHRkZWZhdWx0QXVkaW9IZWlnaHQ6IDQwLFxuXHQvLyBkZWZhdWx0IGFtb3VudCB0byBtb3ZlIGJhY2sgd2hlbiBiYWNrIGtleSBpcyBwcmVzc2VkXG5cdGRlZmF1bHRTZWVrQmFja3dhcmRJbnRlcnZhbDogKG1lZGlhKSA9PiBtZWRpYS5kdXJhdGlvbiAqIDAuMDUsXG5cdC8vIGRlZmF1bHQgYW1vdW50IHRvIG1vdmUgZm9yd2FyZCB3aGVuIGZvcndhcmQga2V5IGlzIHByZXNzZWRcblx0ZGVmYXVsdFNlZWtGb3J3YXJkSW50ZXJ2YWw6IChtZWRpYSkgPT4gbWVkaWEuZHVyYXRpb24gKiAwLjA1LFxuXHQvLyBzZXQgZGltZW5zaW9ucyB2aWEgSlMgaW5zdGVhZCBvZiBDU1Ncblx0c2V0RGltZW5zaW9uczogdHJ1ZSxcblx0Ly8gd2lkdGggb2YgYXVkaW8gcGxheWVyXG5cdGF1ZGlvV2lkdGg6IC0xLFxuXHQvLyBoZWlnaHQgb2YgYXVkaW8gcGxheWVyXG5cdGF1ZGlvSGVpZ2h0OiAtMSxcblx0Ly8gaW5pdGlhbCB2b2x1bWUgd2hlbiB0aGUgcGxheWVyIHN0YXJ0cyAob3ZlcnJpZGRlbiBieSB1c2VyIGNvb2tpZSlcblx0c3RhcnRWb2x1bWU6IDAuOCxcblx0Ly8gdXNlZnVsIGZvciA8YXVkaW8+IHBsYXllciBsb29wc1xuXHRsb29wOiBmYWxzZSxcblx0Ly8gcmV3aW5kIHRvIGJlZ2lubmluZyB3aGVuIG1lZGlhIGVuZHNcblx0YXV0b1Jld2luZDogdHJ1ZSxcblx0Ly8gcmVzaXplIHRvIG1lZGlhIGRpbWVuc2lvbnNcblx0ZW5hYmxlQXV0b3NpemU6IHRydWUsXG5cdC8qXG5cdCAqIFRpbWUgZm9ybWF0IHRvIHVzZS4gRGVmYXVsdDogJ21tOnNzJ1xuXHQgKiBTdXBwb3J0ZWQgdW5pdHM6XG5cdCAqICAgaDogaG91clxuXHQgKiAgIG06IG1pbnV0ZVxuXHQgKiAgIHM6IHNlY29uZFxuXHQgKiAgIGY6IGZyYW1lIGNvdW50XG5cdCAqIFdoZW4gdXNpbmcgJ2hoJywgJ21tJywgJ3NzJyBvciAnZmYnIHdlIGFsd2F5cyBkaXNwbGF5IDIgZGlnaXRzLlxuXHQgKiBJZiB5b3UgdXNlICdoJywgJ20nLCAncycgb3IgJ2YnIHdlIGRpc3BsYXkgMSBkaWdpdCBpZiBwb3NzaWJsZS5cblx0ICpcblx0ICogRXhhbXBsZSB0byBkaXNwbGF5IDc1IHNlY29uZHM6XG5cdCAqIEZvcm1hdCAnbW06c3MnOiAwMToxNVxuXHQgKiBGb3JtYXQgJ206c3MnOiAxOjE1XG5cdCAqIEZvcm1hdCAnbTpzJzogMToxNVxuXHQgKi9cblx0dGltZUZvcm1hdDogJycsXG5cdC8vIGZvcmNlcyB0aGUgaG91ciBtYXJrZXIgKCMjOjAwOjAwKVxuXHRhbHdheXNTaG93SG91cnM6IGZhbHNlLFxuXHQvLyBzaG93IGZyYW1lY291bnQgaW4gdGltZWNvZGUgKCMjOjAwOjAwOjAwKVxuXHRzaG93VGltZWNvZGVGcmFtZUNvdW50OiBmYWxzZSxcblx0Ly8gdXNlZCB3aGVuIHNob3dUaW1lY29kZUZyYW1lQ291bnQgaXMgc2V0IHRvIHRydWVcblx0ZnJhbWVzUGVyU2Vjb25kOiAyNSxcblx0Ly8gSGlkZSBjb250cm9scyB3aGVuIHBsYXlpbmcgYW5kIG1vdXNlIGlzIG5vdCBvdmVyIHRoZSB2aWRlb1xuXHRhbHdheXNTaG93Q29udHJvbHM6IGZhbHNlLFxuXHQvLyBEaXNwbGF5IHRoZSB2aWRlbyBjb250cm9sXG5cdGhpZGVWaWRlb0NvbnRyb2xzT25Mb2FkOiBmYWxzZSxcblx0Ly8gRW5hYmxlIGNsaWNrIHZpZGVvIGVsZW1lbnQgdG8gdG9nZ2xlIHBsYXkvcGF1c2Vcblx0Y2xpY2tUb1BsYXlQYXVzZTogdHJ1ZSxcblx0Ly8gVGltZSBpbiBtcyB0byBoaWRlIGNvbnRyb2xzXG5cdGNvbnRyb2xzVGltZW91dERlZmF1bHQ6IDE1MDAsXG5cdC8vIFRpbWUgaW4gbXMgdG8gdHJpZ2dlciB0aGUgdGltZXIgd2hlbiBtb3VzZSBtb3Zlc1xuXHRjb250cm9sc1RpbWVvdXRNb3VzZUVudGVyOiAyNTAwLFxuXHQvLyBUaW1lIGluIG1zIHRvIHRyaWdnZXIgdGhlIHRpbWVyIHdoZW4gbW91c2UgbGVhdmVzXG5cdGNvbnRyb2xzVGltZW91dE1vdXNlTGVhdmU6IDEwMDAsXG5cdC8vIGZvcmNlIGlQYWQncyBuYXRpdmUgY29udHJvbHNcblx0aVBhZFVzZU5hdGl2ZUNvbnRyb2xzOiBmYWxzZSxcblx0Ly8gZm9yY2UgaVBob25lJ3MgbmF0aXZlIGNvbnRyb2xzXG5cdGlQaG9uZVVzZU5hdGl2ZUNvbnRyb2xzOiBmYWxzZSxcblx0Ly8gZm9yY2UgQW5kcm9pZCdzIG5hdGl2ZSBjb250cm9sc1xuXHRBbmRyb2lkVXNlTmF0aXZlQ29udHJvbHM6IGZhbHNlLFxuXHQvLyBmZWF0dXJlcyB0byBzaG93XG5cdGZlYXR1cmVzOiBbJ3BsYXlwYXVzZScsICdjdXJyZW50JywgJ3Byb2dyZXNzJywgJ2R1cmF0aW9uJywgJ3RyYWNrcycsICd2b2x1bWUnLCAnZnVsbHNjcmVlbiddLFxuXHQvLyBvbmx5IGZvciBkeW5hbWljXG5cdGlzVmlkZW86IHRydWUsXG5cdC8vIHN0cmV0Y2hpbmcgbW9kZXMgKGF1dG8sIGZpbGwsIHJlc3BvbnNpdmUsIG5vbmUpXG5cdHN0cmV0Y2hpbmc6ICdhdXRvJyxcblx0Ly8gcHJlZml4IGNsYXNzIG5hbWVzIG9uIGVsZW1lbnRzXG5cdGNsYXNzUHJlZml4OiAnbWVqc19fJyxcblx0Ly8gdHVybnMga2V5Ym9hcmQgc3VwcG9ydCBvbiBhbmQgb2ZmIGZvciB0aGlzIGluc3RhbmNlXG5cdGVuYWJsZUtleWJvYXJkOiB0cnVlLFxuXHQvLyB3aGVuIHRoaXMgcGxheWVyIHN0YXJ0cywgaXQgd2lsbCBwYXVzZSBvdGhlciBwbGF5ZXJzXG5cdHBhdXNlT3RoZXJQbGF5ZXJzOiB0cnVlLFxuXHQvLyBhcnJheSBvZiBrZXlib2FyZCBhY3Rpb25zIHN1Y2ggYXMgcGxheS9wYXVzZVxuXHRrZXlBY3Rpb25zOiBbXG5cdFx0e1xuXHRcdFx0a2V5czogW1xuXHRcdFx0XHQzMiwgLy8gU1BBQ0Vcblx0XHRcdFx0MTc5IC8vIEdPT0dMRSBwbGF5L3BhdXNlIGJ1dHRvblxuXHRcdFx0XSxcblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEpID0+IHtcblxuXHRcdFx0XHRpZiAoIUlTX0ZJUkVGT1gpIHtcblx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkIHx8IG1lZGlhLmVuZGVkKSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbMzhdLCAvLyBVUFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmIChwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uPmJ1dHRvbmApLmlzKCc6Zm9jdXMnKSB8fFxuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5pcygnOmZvY3VzJykpIHtcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBuZXdWb2x1bWUgPSBNYXRoLm1pbihtZWRpYS52b2x1bWUgKyAwLjEsIDEpO1xuXHRcdFx0XHRtZWRpYS5zZXRWb2x1bWUobmV3Vm9sdW1lKTtcblx0XHRcdFx0aWYgKG5ld1ZvbHVtZSA+IDApIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogWzQwXSwgLy8gRE9XTlxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmIChwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uPmJ1dHRvbmApLmlzKCc6Zm9jdXMnKSB8fFxuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5pcygnOmZvY3VzJykpIHtcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IG5ld1ZvbHVtZSA9IE1hdGgubWF4KG1lZGlhLnZvbHVtZSAtIDAuMSwgMCk7XG5cdFx0XHRcdG1lZGlhLnNldFZvbHVtZShuZXdWb2x1bWUpO1xuXG5cdFx0XHRcdGlmIChuZXdWb2x1bWUgPD0gMC4xKSB7XG5cdFx0XHRcdFx0bWVkaWEuc2V0TXV0ZWQodHJ1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogW1xuXHRcdFx0XHQzNywgLy8gTEVGVFxuXHRcdFx0XHQyMjcgLy8gR29vZ2xlIFRWIHJld2luZFxuXHRcdFx0XSxcblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEpID0+IHtcblx0XHRcdFx0aWYgKCFpc05hTihtZWRpYS5kdXJhdGlvbikgJiYgbWVkaWEuZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0aWYgKHBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gNSVcblx0XHRcdFx0XHRsZXQgbmV3VGltZSA9IE1hdGgubWF4KG1lZGlhLmN1cnJlbnRUaW1lIC0gcGxheWVyLm9wdGlvbnMuZGVmYXVsdFNlZWtCYWNrd2FyZEludGVydmFsKG1lZGlhKSwgMCk7XG5cdFx0XHRcdFx0bWVkaWEuc2V0Q3VycmVudFRpbWUobmV3VGltZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFtcblx0XHRcdFx0MzksIC8vIFJJR0hUXG5cdFx0XHRcdDIyOCAvLyBHb29nbGUgVFYgZm9yd2FyZFxuXHRcdFx0XSxcblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEpID0+IHtcblxuXHRcdFx0XHRpZiAoIWlzTmFOKG1lZGlhLmR1cmF0aW9uKSAmJiBtZWRpYS5kdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyA1JVxuXHRcdFx0XHRcdGxldCBuZXdUaW1lID0gTWF0aC5taW4obWVkaWEuY3VycmVudFRpbWUgKyBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0ZvcndhcmRJbnRlcnZhbChtZWRpYSksIG1lZGlhLmR1cmF0aW9uKTtcblx0XHRcdFx0XHRtZWRpYS5zZXRDdXJyZW50VGltZShuZXdUaW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogWzcwXSwgLy8gRlxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSwga2V5LCBldmVudCkgPT4ge1xuXHRcdFx0XHRpZiAoIWV2ZW50LmN0cmxLZXkpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHBsYXllci5lbnRlckZ1bGxTY3JlZW4gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0XHRpZiAocGxheWVyLmlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHBsYXllci5lbnRlckZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFs3N10sIC8vIE1cblx0XHRcdGFjdGlvbjogKHBsYXllcikgPT4ge1xuXG5cdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdFx0aWYgKHBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocGxheWVyLm1lZGlhLm11dGVkKSB7XG5cdFx0XHRcdFx0cGxheWVyLnNldE11dGVkKGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2V0TXV0ZWQodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdF1cbn07XG5cbm1lanMuTWVwRGVmYXVsdHMgPSBjb25maWc7XG5cbi8qKlxuICogV3JhcCBhIE1lZGlhRWxlbWVudCBvYmplY3QgaW4gcGxheWVyIGNvbnRyb2xzXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb1xuICogQHJldHVybiB7P01lZGlhRWxlbWVudFBsYXllcn1cbiAqL1xuY2xhc3MgTWVkaWFFbGVtZW50UGxheWVyIHtcblxuXHRjb25zdHJ1Y3RvciAobm9kZSwgbykge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5oYXNGb2N1cyA9IGZhbHNlO1xuXG5cdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXG5cdFx0dC5jb250cm9sc0VuYWJsZWQgPSB0cnVlO1xuXG5cdFx0dC5jb250cm9sc1RpbWVyID0gbnVsbDtcblxuXHRcdC8vIGVuZm9yY2Ugb2JqZWN0LCBldmVuIHdpdGhvdXQgXCJuZXdcIiAodmlhIEpvaG4gUmVzaWcpXG5cdFx0aWYgKCEodCBpbnN0YW5jZW9mIE1lZGlhRWxlbWVudFBsYXllcikpIHtcblx0XHRcdHJldHVybiBuZXcgTWVkaWFFbGVtZW50UGxheWVyKG5vZGUsIG8pO1xuXHRcdH1cblxuXHRcdC8vIHRoZXNlIHdpbGwgYmUgcmVzZXQgYWZ0ZXIgdGhlIE1lZGlhRWxlbWVudC5zdWNjZXNzIGZpcmVzXG5cdFx0dC4kbWVkaWEgPSB0LiRub2RlID0gJChub2RlKTtcblx0XHR0Lm5vZGUgPSB0Lm1lZGlhID0gdC4kbWVkaWFbMF07XG5cblx0XHRpZiAoIXQubm9kZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGZvciBleGlzdGluZyBwbGF5ZXJcblx0XHRpZiAodC5ub2RlLnBsYXllciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdC5ub2RlLnBsYXllcjtcblx0XHR9XG5cblxuXHRcdC8vIHRyeSB0byBnZXQgb3B0aW9ucyBmcm9tIGRhdGEtbWVqc29wdGlvbnNcblx0XHRpZiAobyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvID0gdC4kbm9kZS5kYXRhKCdtZWpzb3B0aW9ucycpO1xuXHRcdH1cblxuXHRcdC8vIGV4dGVuZCBkZWZhdWx0IG9wdGlvbnNcblx0XHR0Lm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBjb25maWcsIG8pO1xuXG5cdFx0aWYgKCF0Lm9wdGlvbnMudGltZUZvcm1hdCkge1xuXHRcdFx0Ly8gR2VuZXJhdGUgdGhlIHRpbWUgZm9ybWF0IGFjY29yZGluZyB0byBvcHRpb25zXG5cdFx0XHR0Lm9wdGlvbnMudGltZUZvcm1hdCA9ICdtbTpzcyc7XG5cdFx0XHRpZiAodC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycykge1xuXHRcdFx0XHR0Lm9wdGlvbnMudGltZUZvcm1hdCA9ICdoaDptbTpzcyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodC5vcHRpb25zLnNob3dUaW1lY29kZUZyYW1lQ291bnQpIHtcblx0XHRcdFx0dC5vcHRpb25zLnRpbWVGb3JtYXQgKz0gJzpmZic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y2FsY3VsYXRlVGltZUZvcm1hdCgwLCB0Lm9wdGlvbnMsIHQub3B0aW9ucy5mcmFtZXNQZXJTZWNvbmQgfHwgMjUpO1xuXG5cdFx0Ly8gdW5pcXVlIElEXG5cdFx0dC5pZCA9IGBtZXBfJHttZWpzLm1lcEluZGV4Kyt9YDtcblxuXHRcdC8vIGFkZCB0byBwbGF5ZXIgYXJyYXkgKGZvciBmb2N1cyBldmVudHMpXG5cdFx0bWVqcy5wbGF5ZXJzW3QuaWRdID0gdDtcblxuXHRcdC8vIHN0YXJ0IHVwXG5cdFx0bGV0XG5cblx0XHRcdG1lT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHQub3B0aW9ucywge1xuXHRcdFx0XHRzdWNjZXNzOiAobWVkaWEsIGRvbU5vZGUpID0+IHtcblx0XHRcdFx0XHR0Ll9tZVJlYWR5KG1lZGlhLCBkb21Ob2RlKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IChlKSA9PiB7XG5cdFx0XHRcdFx0dC5faGFuZGxlRXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdFx0dGFnTmFtZSA9IHQubWVkaWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cdFx0XHQ7XG5cblx0XHQvLyBnZXQgdmlkZW8gZnJvbSBzcmMgb3IgaHJlZj9cblx0XHR0LmlzRHluYW1pYyA9ICh0YWdOYW1lICE9PSAnYXVkaW8nICYmIHRhZ05hbWUgIT09ICd2aWRlbycpO1xuXHRcdHQuaXNWaWRlbyA9ICh0LmlzRHluYW1pYykgPyB0Lm9wdGlvbnMuaXNWaWRlbyA6ICh0YWdOYW1lICE9PSAnYXVkaW8nICYmIHQub3B0aW9ucy5pc1ZpZGVvKTtcblxuXHRcdC8vIHVzZSBuYXRpdmUgY29udHJvbHMgaW4gaVBhZCwgaVBob25lLCBhbmQgQW5kcm9pZFxuXHRcdGlmICgoSVNfSVBBRCAmJiB0Lm9wdGlvbnMuaVBhZFVzZU5hdGl2ZUNvbnRyb2xzKSB8fCAoSVNfSVBIT05FICYmIHQub3B0aW9ucy5pUGhvbmVVc2VOYXRpdmVDb250cm9scykpIHtcblxuXHRcdFx0Ly8gYWRkIGNvbnRyb2xzIGFuZCBzdG9wXG5cdFx0XHR0LiRtZWRpYS5hdHRyKCdjb250cm9scycsICdjb250cm9scycpO1xuXG5cdFx0XHQvLyBvdmVycmlkZSBBcHBsZSdzIGF1dG9wbGF5IG92ZXJyaWRlIGZvciBpUGFkc1xuXHRcdFx0aWYgKElTX0lQQUQgJiYgdC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JykpIHtcblx0XHRcdFx0dC5wbGF5KCk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYgKElTX0FORFJPSUQgJiYgdC5vcHRpb25zLkFuZHJvaWRVc2VOYXRpdmVDb250cm9scykge1xuXG5cdFx0XHQvLyBsZWF2ZSBkZWZhdWx0IHBsYXllclxuXG5cdFx0fSBlbHNlIGlmICh0LmlzVmlkZW8gfHwgKCF0LmlzVmlkZW8gJiYgdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkpIHtcblxuXHRcdFx0Ly8gREVTS1RPUDogdXNlIE1lZGlhRWxlbWVudFBsYXllciBjb250cm9sc1xuXG5cdFx0XHQvLyByZW1vdmUgbmF0aXZlIGNvbnRyb2xzXG5cdFx0XHR0LiRtZWRpYS5yZW1vdmVBdHRyKCdjb250cm9scycpO1xuXHRcdFx0bGV0IHZpZGVvUGxheWVyVGl0bGUgPSB0LmlzVmlkZW8gPyBpMThuLnQoJ21lanMudmlkZW8tcGxheWVyJykgOiBpMThuLnQoJ21lanMuYXVkaW8tcGxheWVyJyk7XG5cdFx0XHQvLyBpbnNlcnQgZGVzY3JpcHRpb24gZm9yIHNjcmVlbiByZWFkZXJzXG5cdFx0XHQkKGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlblwiPiR7dmlkZW9QbGF5ZXJUaXRsZX08L3NwYW4+YCkuaW5zZXJ0QmVmb3JlKHQuJG1lZGlhKTtcblx0XHRcdC8vIGJ1aWxkIGNvbnRhaW5lclxuXHRcdFx0dC5jb250YWluZXIgPVxuXHRcdFx0XHQkKGA8ZGl2IGlkPVwiJHt0LmlkfVwiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1rZXlib2FyZC1pbmFjdGl2ZVwiYCArXG5cdFx0XHRcdFx0YHRhYmluZGV4PVwiMFwiIHJvbGU9XCJhcHBsaWNhdGlvblwiIGFyaWEtbGFiZWw9XCIke3ZpZGVvUGxheWVyVGl0bGV9XCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1pbm5lclwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bWVkaWFlbGVtZW50XCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcnNcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xzXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jbGVhclwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hZGRDbGFzcyh0LiRtZWRpYVswXS5jbGFzc05hbWUpXG5cdFx0XHRcdC5pbnNlcnRCZWZvcmUodC4kbWVkaWEpXG5cdFx0XHRcdC5mb2N1cygoZSkgPT4ge1xuXHRcdFx0XHRcdGlmICghdC5jb250cm9sc0FyZVZpc2libGUgJiYgIXQuaGFzRm9jdXMgJiYgdC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKHRydWUpO1xuXHRcdFx0XHRcdFx0Ly8gSW4gdmVyc2lvbnMgb2xkZXIgdGhhbiBJRTExLCB0aGUgZm9jdXMgY2F1c2VzIHRoZSBwbGF5YmFyIHRvIGJlIGRpc3BsYXllZFxuXHRcdFx0XHRcdFx0Ly8gaWYgdXNlciBjbGlja3Mgb24gdGhlIFBsYXkvUGF1c2UgYnV0dG9uIGluIHRoZSBjb250cm9sIGJhciBvbmNlIGl0IGF0dGVtcHRzXG5cdFx0XHRcdFx0XHQvLyB0byBoaWRlIGl0XG5cdFx0XHRcdFx0XHRpZiAoIUhBU19NU19OQVRJVkVfRlVMTFNDUkVFTikge1xuXHRcdFx0XHRcdFx0XHQvLyBJZiBlLnJlbGF0ZWRUYXJnZXQgYXBwZWFycyBiZWZvcmUgY29udGFpbmVyLCBzZW5kIGZvY3VzIHRvIHBsYXkgYnV0dG9uLFxuXHRcdFx0XHRcdFx0XHQvLyBlbHNlIHNlbmQgZm9jdXMgdG8gbGFzdCBjb250cm9sIGJ1dHRvbi5cblx0XHRcdFx0XHRcdFx0bGV0IGJ0blNlbGVjdG9yID0gYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5cGF1c2UtYnV0dG9uID4gYnV0dG9uYDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaXNOb2RlQWZ0ZXIoZS5yZWxhdGVkVGFyZ2V0LCB0LmNvbnRhaW5lclswXSkpIHtcblx0XHRcdFx0XHRcdFx0XHRidG5TZWxlY3RvciA9IGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbHMgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbjpsYXN0LWNoaWxkID4gYnV0dG9uYDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGxldCBidXR0b24gPSB0LmNvbnRhaW5lci5maW5kKGJ0blNlbGVjdG9yKTtcblx0XHRcdFx0XHRcdFx0YnV0dG9uLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gV2hlbiBubyBlbGVtZW50cyBpbiBjb250cm9scywgaGlkZSBiYXIgY29tcGxldGVseVxuXHRcdFx0aWYgKCF0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoKSB7XG5cdFx0XHRcdHQuY29udGFpbmVyLmNzcygnYmFja2dyb3VuZCcsICd0cmFuc3BhcmVudCcpXG5cdFx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbHNgKVxuXHRcdFx0XHQuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodC5pc1ZpZGVvICYmIHQub3B0aW9ucy5zdHJldGNoaW5nID09PSAnZmlsbCcgJiYgIXQuY29udGFpbmVyLnBhcmVudChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZpbGwtY29udGFpbmVyYCkubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIG91dGVyIGNvbnRhaW5lclxuXHRcdFx0XHR0Lm91dGVyQ29udGFpbmVyID0gdC4kbWVkaWEucGFyZW50KCk7XG5cdFx0XHRcdHQuY29udGFpbmVyLndyYXAoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1maWxsLWNvbnRhaW5lclwiLz5gKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRkIGNsYXNzZXMgZm9yIHVzZXIgYW5kIGNvbnRlbnRcblx0XHRcdHQuY29udGFpbmVyLmFkZENsYXNzKFxuXHRcdFx0XHQoSVNfQU5EUk9JRCA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1hbmRyb2lkIGAgOiAnJykgK1xuXHRcdFx0XHQoSVNfSU9TID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlvcyBgIDogJycpICtcblx0XHRcdFx0KElTX0lQQUQgPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aXBhZCBgIDogJycpICtcblx0XHRcdFx0KElTX0lQSE9ORSA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1pcGhvbmUgYCA6ICcnKSArXG5cdFx0XHRcdCh0LmlzVmlkZW8gPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dmlkZW8gYCA6IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1hdWRpbyBgKVxuXHRcdFx0KTtcblxuXG5cdFx0XHQvLyBtb3ZlIHRoZSA8dmlkZW8vdmlkZW8+IHRhZyBpbnRvIHRoZSByaWdodCBzcG90XG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bWVkaWFlbGVtZW50YCkuYXBwZW5kKHQuJG1lZGlhKTtcblxuXHRcdFx0Ly8gbmVlZHMgdG8gYmUgYXNzaWduZWQgaGVyZSwgYWZ0ZXIgaU9TIHJlbWFwXG5cdFx0XHR0Lm5vZGUucGxheWVyID0gdDtcblxuXHRcdFx0Ly8gZmluZCBwYXJ0c1xuXHRcdFx0dC5jb250cm9scyA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sc2ApO1xuXHRcdFx0dC5sYXllcnMgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJzYCk7XG5cblx0XHRcdC8vIGRldGVybWluZSB0aGUgc2l6ZVxuXG5cdFx0XHQvKiBzaXplIHByaW9yaXR5OlxuXHRcdFx0ICgxKSB2aWRlb1dpZHRoIChmb3JjZWQpLFxuXHRcdFx0ICgyKSBzdHlsZT1cIndpZHRoO2hlaWdodDtcIlxuXHRcdFx0ICgzKSB3aWR0aCBhdHRyaWJ1dGUsXG5cdFx0XHQgKDQpIGRlZmF1bHRWaWRlb1dpZHRoIChmb3IgdW5zcGVjaWZpZWQgY2FzZXMpXG5cdFx0XHQgKi9cblxuXHRcdFx0bGV0XG5cdFx0XHRcdHRhZ1R5cGUgPSAodC5pc1ZpZGVvID8gJ3ZpZGVvJyA6ICdhdWRpbycpLFxuXHRcdFx0XHRjYXBzVGFnTmFtZSA9IHRhZ1R5cGUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0YWdUeXBlLnN1YnN0cmluZygxKVxuXHRcdFx0XHQ7XG5cblxuXHRcdFx0aWYgKHQub3B0aW9uc1t0YWdUeXBlICsgJ1dpZHRoJ10gPiAwIHx8IHQub3B0aW9uc1t0YWdUeXBlICsgJ1dpZHRoJ10udG9TdHJpbmcoKS5pbmRleE9mKCclJykgPiAtMSkge1xuXHRcdFx0XHR0LndpZHRoID0gdC5vcHRpb25zW3RhZ1R5cGUgKyAnV2lkdGgnXTtcblx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5zdHlsZS53aWR0aCAhPT0gJycgJiYgdC5tZWRpYS5zdHlsZS53aWR0aCAhPT0gbnVsbCkge1xuXHRcdFx0XHR0LndpZHRoID0gdC5tZWRpYS5zdHlsZS53aWR0aDtcblx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcblx0XHRcdFx0dC53aWR0aCA9IHQuJG1lZGlhLmF0dHIoJ3dpZHRoJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0LndpZHRoID0gdC5vcHRpb25zWydkZWZhdWx0JyArIGNhcHNUYWdOYW1lICsgJ1dpZHRoJ107XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0Lm9wdGlvbnNbdGFnVHlwZSArICdIZWlnaHQnXSA+IDAgfHwgdC5vcHRpb25zW3RhZ1R5cGUgKyAnSGVpZ2h0J10udG9TdHJpbmcoKS5pbmRleE9mKCclJykgPiAtMSkge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQub3B0aW9uc1t0YWdUeXBlICsgJ0hlaWdodCddO1xuXHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLnN0eWxlLmhlaWdodCAhPT0gJycgJiYgdC5tZWRpYS5zdHlsZS5oZWlnaHQgIT09IG51bGwpIHtcblx0XHRcdFx0dC5oZWlnaHQgPSB0Lm1lZGlhLnN0eWxlLmhlaWdodDtcblx0XHRcdH0gZWxzZSBpZiAodC4kbWVkaWFbMF0uZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSkge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQuJG1lZGlhLmF0dHIoJ2hlaWdodCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC5oZWlnaHQgPSB0Lm9wdGlvbnNbJ2RlZmF1bHQnICsgY2Fwc1RhZ05hbWUgKyAnSGVpZ2h0J107XG5cdFx0XHR9XG5cblx0XHRcdHQuaW5pdGlhbEFzcGVjdFJhdGlvID0gKHQuaGVpZ2h0ID49IHQud2lkdGgpID8gdC53aWR0aCAvIHQuaGVpZ2h0IDogdC5oZWlnaHQgLyB0LndpZHRoO1xuXG5cdFx0XHQvLyBzZXQgdGhlIHNpemUsIHdoaWxlIHdlIHdhaXQgZm9yIHRoZSBwbHVnaW5zIHRvIGxvYWQgYmVsb3dcblx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cblx0XHRcdC8vIGNyZWF0ZSBNZWRpYUVsZW1lbnRTaGltXG5cdFx0XHRtZU9wdGlvbnMucGx1Z2luV2lkdGggPSB0LndpZHRoO1xuXHRcdFx0bWVPcHRpb25zLnBsdWdpbkhlaWdodCA9IHQuaGVpZ2h0O1xuXHRcdH1cblx0XHQvLyBIaWRlIG1lZGlhIGNvbXBsZXRlbHkgZm9yIGF1ZGlvIHRoYXQgZG9lc24ndCBoYXZlIGFueSBmZWF0dXJlc1xuXHRcdGVsc2UgaWYgKCF0LmlzVmlkZW8gJiYgIXQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGgpIHtcblx0XHRcdHQuJG1lZGlhLmhpZGUoKTtcblx0XHR9XG5cblx0XHQvLyBjcmVhdGUgTWVkaWFFbGVtZW50IHNoaW1cblx0XHRuZXcgTWVkaWFFbGVtZW50KHQuJG1lZGlhWzBdLCBtZU9wdGlvbnMpO1xuXG5cdFx0aWYgKHQuY29udGFpbmVyICE9PSB1bmRlZmluZWQgJiYgdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCAmJiB0LmNvbnRyb2xzQXJlVmlzaWJsZSAmJiAhdC5vcHRpb25zLmhpZGVWaWRlb0NvbnRyb2xzT25Mb2FkKSB7XG5cdFx0XHQvLyBjb250cm9scyBhcmUgc2hvd24gd2hlbiBsb2FkZWRcblx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzc2hvd24nKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdDtcblx0fVxuXG5cdHNob3dDb250cm9scyAoZG9BbmltYXRpb24pIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRkb0FuaW1hdGlvbiA9IGRvQW5pbWF0aW9uID09PSB1bmRlZmluZWQgfHwgZG9BbmltYXRpb247XG5cblx0XHRpZiAodC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZG9BbmltYXRpb24pIHtcblx0XHRcdHQuY29udHJvbHNcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpLmZhZGVJbigyMDAsICgpID0+IHtcblx0XHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc3Nob3duJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYW55IGFkZGl0aW9uYWwgY29udHJvbHMgcGVvcGxlIG1pZ2h0IGFkZCBhbmQgd2FudCB0byBoaWRlXG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbGApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKS5mYWRlSW4oMjAwLCAoKSA9PiB7XG5cdFx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHQuY29udHJvbHNcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0Ly8gYW55IGFkZGl0aW9uYWwgY29udHJvbHMgcGVvcGxlIG1pZ2h0IGFkZCBhbmQgd2FudCB0byBoaWRlXG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbGApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzc2hvd24nKTtcblx0XHR9XG5cblx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXG5cdH1cblxuXHRoaWRlQ29udHJvbHMgKGRvQW5pbWF0aW9uKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0ZG9BbmltYXRpb24gPSBkb0FuaW1hdGlvbiA9PT0gdW5kZWZpbmVkIHx8IGRvQW5pbWF0aW9uO1xuXG5cdFx0aWYgKCF0LmNvbnRyb2xzQXJlVmlzaWJsZSB8fCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzIHx8IHQua2V5Ym9hcmRBY3Rpb24gfHxcblx0XHRcdCh0Lm1lZGlhLnBhdXNlZCAmJiB0Lm1lZGlhLnJlYWR5U3RhdGUgPT09IDQpIHx8XG5cdFx0XHQodC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQgJiYgIXQubWVkaWEucmVhZHlTdGF0ZSkgfHxcblx0XHRcdHQubWVkaWEuZW5kZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZG9BbmltYXRpb24pIHtcblx0XHRcdC8vIGZhZGUgb3V0IG1haW4gY29udHJvbHNcblx0XHRcdHQuY29udHJvbHMuc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzaGlkZGVuJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYW55IGFkZGl0aW9uYWwgY29udHJvbHMgcGVvcGxlIG1pZ2h0IGFkZCBhbmQgd2FudCB0byBoaWRlXG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbGApLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dCgyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIGhpZGUgbWFpbiBjb250cm9sc1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0Ly8gaGlkZSBvdGhlcnNcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXJ0Q29udHJvbHNUaW1lciAodGltZW91dCkge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dGltZW91dCA9IHR5cGVvZiB0aW1lb3V0ICE9PSAndW5kZWZpbmVkJyA/IHRpbWVvdXQgOiB0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0RGVmYXVsdDtcblxuXHRcdHQua2lsbENvbnRyb2xzVGltZXIoJ3N0YXJ0Jyk7XG5cblx0XHR0LmNvbnRyb2xzVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHQuaGlkZUNvbnRyb2xzKCk7XG5cdFx0XHR0LmtpbGxDb250cm9sc1RpbWVyKCdoaWRlJyk7XG5cdFx0fSwgdGltZW91dCk7XG5cdH1cblxuXHRraWxsQ29udHJvbHNUaW1lciAoKSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAodC5jb250cm9sc1RpbWVyICE9PSBudWxsKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodC5jb250cm9sc1RpbWVyKTtcblx0XHRcdGRlbGV0ZSB0LmNvbnRyb2xzVGltZXI7XG5cdFx0XHR0LmNvbnRyb2xzVGltZXIgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdGRpc2FibGVDb250cm9scyAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5raWxsQ29udHJvbHNUaW1lcigpO1xuXHRcdHQuaGlkZUNvbnRyb2xzKGZhbHNlKTtcblx0XHR0aGlzLmNvbnRyb2xzRW5hYmxlZCA9IGZhbHNlO1xuXHR9XG5cblx0ZW5hYmxlQ29udHJvbHMgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuc2hvd0NvbnRyb2xzKGZhbHNlKTtcblxuXHRcdHQuY29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdXAgYWxsIGNvbnRyb2xzIGFuZCBldmVudHNcblx0ICpcblx0ICogQHBhcmFtIG1lZGlhXG5cdCAqIEBwYXJhbSBkb21Ob2RlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbWVSZWFkeSAobWVkaWEsIGRvbU5vZGUpIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRhdXRvcGxheUF0dHIgPSBkb21Ob2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSxcblx0XHRcdGF1dG9wbGF5ID0gIShhdXRvcGxheUF0dHIgPT09IHVuZGVmaW5lZCB8fCBhdXRvcGxheUF0dHIgPT09IG51bGwgfHwgYXV0b3BsYXlBdHRyID09PSAnZmFsc2UnKSxcblx0XHRcdGlzTmF0aXZlID0gbWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIG1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbFxuXHRcdFx0O1xuXG5cdFx0Ly8gbWFrZSBzdXJlIGl0IGNhbid0IGNyZWF0ZSBpdHNlbGYgYWdhaW4gaWYgYSBwbHVnaW4gcmVsb2Fkc1xuXHRcdGlmICh0LmNyZWF0ZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0LmNyZWF0ZWQgPSB0cnVlO1xuXHRcdHQubWVkaWEgPSBtZWRpYTtcblx0XHR0LmRvbU5vZGUgPSBkb21Ob2RlO1xuXG5cdFx0aWYgKCEoSVNfQU5EUk9JRCAmJiB0Lm9wdGlvbnMuQW5kcm9pZFVzZU5hdGl2ZUNvbnRyb2xzKSAmJiAhKElTX0lQQUQgJiYgdC5vcHRpb25zLmlQYWRVc2VOYXRpdmVDb250cm9scykgJiYgIShJU19JUEhPTkUgJiYgdC5vcHRpb25zLmlQaG9uZVVzZU5hdGl2ZUNvbnRyb2xzKSkge1xuXG5cdFx0XHQvLyBJbiB0aGUgZXZlbnQgdGhhdCBubyBmZWF0dXJlcyBhcmUgc3BlY2lmaWVkIGZvciBhdWRpbyxcblx0XHRcdC8vIGNyZWF0ZSBvbmx5IE1lZGlhRWxlbWVudCBpbnN0YW5jZSByYXRoZXIgdGhhblxuXHRcdFx0Ly8gZG9pbmcgYWxsIHRoZSB3b3JrIHRvIGNyZWF0ZSBhIGZ1bGwgcGxheWVyXG5cdFx0XHRpZiAoIXQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkge1xuXG5cdFx0XHRcdC8vIGZvcmNlIGF1dG9wbGF5IGZvciBIVE1MNVxuXHRcdFx0XHRpZiAoYXV0b3BsYXkgJiYgaXNOYXRpdmUpIHtcblx0XHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5zdWNjZXNzKSB7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIHQub3B0aW9ucy5zdWNjZXNzID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0d2luZG93W3Qub3B0aW9ucy5zdWNjZXNzXSh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0Lm9wdGlvbnMuc3VjY2Vzcyh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdHdvIGJ1aWx0IGluIGZlYXR1cmVzXG5cdFx0XHR0LmJ1aWxkcG9zdGVyKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0XHRcdHQuYnVpbGRrZXlib2FyZCh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdFx0XHR0LmJ1aWxkb3ZlcmxheXModCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXG5cdFx0XHQvLyBncmFiIGZvciB1c2UgYnkgZmVhdHVyZXNcblx0XHRcdHQuZmluZFRyYWNrcygpO1xuXG5cdFx0XHQvLyBhZGQgdXNlci1kZWZpbmVkIGZlYXR1cmVzL2NvbnRyb2xzXG5cdFx0XHRmb3IgKGxldCBmZWF0dXJlSW5kZXggaW4gdC5vcHRpb25zLmZlYXR1cmVzKSB7XG5cdFx0XHRcdGxldCBmZWF0dXJlID0gdC5vcHRpb25zLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG5cdFx0XHRcdGlmICh0W2BidWlsZCR7ZmVhdHVyZX1gXSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR0W2BidWlsZCR7ZmVhdHVyZX1gXSh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogcmVwb3J0IGNvbnRyb2wgZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGVycm9yIGJ1aWxkaW5nICR7ZmVhdHVyZX1gLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNyZWFkeScpO1xuXG5cdFx0XHQvLyByZXNldCBhbGwgbGF5ZXJzIGFuZCBjb250cm9sc1xuXHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cblx0XHRcdC8vIGNvbnRyb2xzIGZhZGVcblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblxuXHRcdFx0XHRpZiAoSEFTX1RPVUNIICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cblx0XHRcdFx0XHQvLyBmb3IgdG91Y2ggZGV2aWNlcyAoaU9TLCBBbmRyb2lkKVxuXHRcdFx0XHRcdC8vIHNob3cvaGlkZSB3aXRob3V0IGFuaW1hdGlvbiBvbiB0b3VjaFxuXG5cdFx0XHRcdFx0dC4kbWVkaWEub24oJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XG5cblx0XHRcdFx0XHRcdC8vIHRvZ2dsZSBjb250cm9sc1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKGZhbHNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBjcmVhdGUgY2FsbGJhY2sgaGVyZSBzaW5jZSBpdCBuZWVkcyBhY2Nlc3MgdG8gY3VycmVudFxuXHRcdFx0XHRcdC8vIE1lZGlhRWxlbWVudCBvYmplY3Rcblx0XHRcdFx0XHR0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayA9ICgpID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKHQub3B0aW9ucy5jbGlja1RvUGxheVBhdXNlKSB7XG5cdFx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbiA9IHQuJG1lZGlhLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKVxuXHRcdFx0XHRcdFx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1idXR0b25gKSxcblx0XHRcdFx0XHRcdFx0XHRwcmVzc2VkID0gYnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcpXG5cdFx0XHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdFx0XHRpZiAodC5tZWRpYS5wYXVzZWQgJiYgcHJlc3NlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHQucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi5hdHRyKCdhcmlhLXByZXNzZWQnLCAhcHJlc3NlZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdC8vIGNsaWNrIHRvIHBsYXkvcGF1c2Vcblx0XHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2ssIGZhbHNlKTtcblxuXHRcdFx0XHRcdC8vIHNob3cvaGlkZSBjb250cm9sc1xuXHRcdFx0XHRcdHQuY29udGFpbmVyXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHRcdHQua2lsbENvbnRyb2xzVGltZXIoJ2VudGVyJyk7XG5cdFx0XHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdFx0XHR0LnN0YXJ0Q29udHJvbHNUaW1lcih0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0TW91c2VFbnRlcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHRcdHQuc3RhcnRDb250cm9sc1RpbWVyKHQub3B0aW9ucy5jb250cm9sc1RpbWVvdXRNb3VzZUVudGVyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5tZWRpYS5wYXVzZWQgJiYgIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnN0YXJ0Q29udHJvbHNUaW1lcih0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0TW91c2VMZWF2ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQpIHtcblx0XHRcdFx0XHR0LmhpZGVDb250cm9scyhmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjaGVjayBmb3IgYXV0b3BsYXlcblx0XHRcdFx0aWYgKGF1dG9wbGF5ICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0dC5oaWRlQ29udHJvbHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlc2l6ZXJcblx0XHRcdFx0aWYgKHQub3B0aW9ucy5lbmFibGVBdXRvc2l6ZSkge1xuXHRcdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gaWYgdGhlIDx2aWRlbyBoZWlnaHQ+IHdhcyBub3Qgc2V0IGFuZCB0aGUgb3B0aW9ucy52aWRlb0hlaWdodCB3YXMgbm90IHNldFxuXHRcdFx0XHRcdFx0Ly8gdGhlbiByZXNpemUgdG8gdGhlIHJlYWwgZGltZW5zaW9uc1xuXHRcdFx0XHRcdFx0aWYgKHQub3B0aW9ucy52aWRlb0hlaWdodCA8PSAwICYmICF0LmRvbU5vZGUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSAmJiAhaXNOYU4oZS50YXJnZXQudmlkZW9IZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHRcdHQuc2V0UGxheWVyU2l6ZShlLnRhcmdldC52aWRlb1dpZHRoLCBlLnRhcmdldC52aWRlb0hlaWdodCk7XG5cdFx0XHRcdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHRcdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShlLnRhcmdldC52aWRlb1dpZHRoLCBlLnRhcmdldC52aWRlb0hlaWdodCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVWRU5UU1xuXG5cdFx0XHQvLyBGT0NVUzogd2hlbiBhIHZpZGVvIHN0YXJ0cyBwbGF5aW5nLCBpdCB0YWtlcyBmb2N1cyBmcm9tIG90aGVyIHBsYXllcnMgKHBvc3NpYmx5IHBhdXNpbmcgdGhlbSlcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdFx0dC5oYXNGb2N1cyA9IHRydWU7XG5cblx0XHRcdFx0Ly8gZ28gdGhyb3VnaCBhbGwgb3RoZXIgcGxheWVyc1xuXHRcdFx0XHRmb3IgKGxldCBwbGF5ZXJJbmRleCBpbiBtZWpzLnBsYXllcnMpIHtcblx0XHRcdFx0XHRsZXQgcCA9IG1lanMucGxheWVyc1twbGF5ZXJJbmRleF07XG5cdFx0XHRcdFx0aWYgKHAuaWQgIT09IHQuaWQgJiYgdC5vcHRpb25zLnBhdXNlT3RoZXJQbGF5ZXJzICYmICFwLnBhdXNlZCAmJiAhcC5lbmRlZCkge1xuXHRcdFx0XHRcdFx0cC5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cC5oYXNGb2N1cyA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdC8vIGVuZGVkIGZvciBhbGxcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuYXV0b1Jld2luZCkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR0Lm1lZGlhLnNldEN1cnJlbnRUaW1lKDApO1xuXHRcdFx0XHRcdFx0Ly8gRml4aW5nIGFuIEFuZHJvaWQgc3RvY2sgYnJvd3NlciBidWcsIHdoZXJlIFwic2Vla2VkXCIgaXNuJ3QgZmlyZWQgY29ycmVjdGx5IGFmdGVyIGVuZGluZyB0aGUgdmlkZW8gYW5kIGp1bXBpbmcgdG8gdGhlIGJlZ2lubmluZ1xuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQkKHQuY29udGFpbmVyKVxuXHRcdFx0XHRcdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktbG9hZGluZ2ApXG5cdFx0XHRcdFx0XHRcdC5wYXJlbnQoKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9LCAyMCk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXhwKSB7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHQubWVkaWEuc3RvcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHQubWVkaWEuc3RvcCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQubWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0LnNldFByb2dyZXNzUmFpbCkge1xuXHRcdFx0XHRcdHQuc2V0UHJvZ3Jlc3NSYWlsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHQuc2V0Q3VycmVudFJhaWwpIHtcblx0XHRcdFx0XHR0LnNldEN1cnJlbnRSYWlsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5vcHRpb25zLmxvb3ApIHtcblx0XHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdFx0fSBlbHNlIGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scyAmJiB0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0Ly8gcmVzaXplIG9uIHRoZSBmaXJzdCBwbGF5XG5cdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXG5cdFx0XHRcdGNhbGN1bGF0ZVRpbWVGb3JtYXQodC5kdXJhdGlvbiwgdC5vcHRpb25zLCB0Lm9wdGlvbnMuZnJhbWVzUGVyU2Vjb25kIHx8IDI1KTtcblxuXHRcdFx0XHRpZiAodC51cGRhdGVEdXJhdGlvbikge1xuXHRcdFx0XHRcdHQudXBkYXRlRHVyYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodC51cGRhdGVDdXJyZW50KSB7XG5cdFx0XHRcdFx0dC51cGRhdGVDdXJyZW50KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXQuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdC8vIE9ubHkgY2hhbmdlIHRoZSB0aW1lIGZvcm1hdCB3aGVuIG5lY2Vzc2FyeVxuXHRcdFx0bGV0IGR1cmF0aW9uID0gbnVsbDtcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdFx0aWYgKGR1cmF0aW9uICE9PSB0aGlzLmR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0ZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuXHRcdFx0XHRcdGNhbGN1bGF0ZVRpbWVGb3JtYXQoZHVyYXRpb24sIHQub3B0aW9ucywgdC5vcHRpb25zLmZyYW1lc1BlclNlY29uZCB8fCAyNSk7XG5cblx0XHRcdFx0XHQvLyBtYWtlIHN1cmUgdG8gZmlsbCBpbiBhbmQgcmVzaXplIHRoZSBjb250cm9scyAoZS5nLiwgMDA6MDAgPT4gMDE6MTM6MTVcblx0XHRcdFx0XHRpZiAodC51cGRhdGVEdXJhdGlvbikge1xuXHRcdFx0XHRcdFx0dC51cGRhdGVEdXJhdGlvbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodC51cGRhdGVDdXJyZW50KSB7XG5cdFx0XHRcdFx0XHR0LnVwZGF0ZUN1cnJlbnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdHQuY29udGFpbmVyLmZvY3Vzb3V0KChlKSA9PiB7XG5cdFx0XHRcdGlmIChlLnJlbGF0ZWRUYXJnZXQpIHsgLy9GRiBpcyB3b3JraW5nIG9uIHN1cHBvcnRpbmcgZm9jdXNvdXQgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njg3Nzg3XG5cdFx0XHRcdFx0bGV0ICR0YXJnZXQgPSAkKGUucmVsYXRlZFRhcmdldCk7XG5cdFx0XHRcdFx0aWYgKHQua2V5Ym9hcmRBY3Rpb24gJiYgJHRhcmdldC5wYXJlbnRzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0LmtleWJvYXJkQWN0aW9uID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpZiAodC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gd2Via2l0IGhhcyB0cm91YmxlIGRvaW5nIHRoaXMgd2l0aG91dCBhIGRlbGF5XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdH0sIDUwKTtcblxuXHRcdFx0Ly8gYWRqdXN0IGNvbnRyb2xzIHdoZW5ldmVyIHdpbmRvdyBzaXplcyAodXNlZCB0byBiZSBpbiBmdWxsc2NyZWVuIG9ubHkpXG5cdFx0XHR0Lmdsb2JhbEJpbmQoJ3Jlc2l6ZScsICgpID0+IHtcblxuXHRcdFx0XHQvLyBkb24ndCByZXNpemUgZm9yIGZ1bGxzY3JlZW4gbW9kZVxuXHRcdFx0XHRpZiAoISh0LmlzRnVsbFNjcmVlbiB8fCAoSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgZG9jdW1lbnQud2Via2l0SXNGdWxsU2NyZWVuKSkpIHtcblx0XHRcdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYWx3YXlzIGFkanVzdCBjb250cm9sc1xuXHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIERpc2FibGUgZm9jdXMgb3V0bGluZSB0byBpbXByb3ZlIGxvb2stYW5kLWZlZWwgZm9yIHJlZ3VsYXIgdXNlcnNcblx0XHRcdHQuZ2xvYmFsQmluZCgnY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoJChlLnRhcmdldCkuaXMoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKSkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEVuYWJsZSBmb2N1cyBvdXRsaW5lIGZvciBBY2Nlc3NpYmlsaXR5IHB1cnBvc2VzXG5cdFx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoJChlLnRhcmdldCkuaXMoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKSkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoaXMgaXMgYSB3b3JrLWFyb3VuZCBmb3IgYSBidWcgaW4gdGhlIFlvdVR1YmUgaUZyYW1lIHBsYXllciwgd2hpY2ggbWVhbnNcblx0XHRcdC8vXHR3ZSBjYW4ndCB1c2UgdGhlIHBsYXkoKSBBUEkgZm9yIHRoZSBpbml0aWFsIHBsYXliYWNrIG9uIGlPUyBvciBBbmRyb2lkO1xuXHRcdFx0Ly9cdHVzZXIgaGFzIHRvIHN0YXJ0IHBsYXliYWNrIGRpcmVjdGx5IGJ5IHRhcHBpbmcgb24gdGhlIGlGcmFtZS5cblx0XHRcdGlmICh0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgveW91dHViZS8pICYmIChJU19JT1MgfHwgSVNfQU5EUk9JRCkpIHtcblx0XHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktcGxheWApLmhpZGUoKTtcblx0XHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlcmApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBmb3JjZSBhdXRvcGxheSBmb3IgSFRNTDVcblx0XHRpZiAoYXV0b3BsYXkgJiYgaXNOYXRpdmUpIHtcblx0XHRcdHQucGxheSgpO1xuXHRcdH1cblxuXHRcdGlmICh0Lm9wdGlvbnMuc3VjY2Vzcykge1xuXG5cdFx0XHRpZiAodHlwZW9mIHQub3B0aW9ucy5zdWNjZXNzID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR3aW5kb3dbdC5vcHRpb25zLnN1Y2Nlc3NdKHQubWVkaWEsIHQuZG9tTm9kZSwgdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0Lm9wdGlvbnMuc3VjY2Vzcyh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlRXJyb3IgKGUpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAodC5jb250cm9scykge1xuXHRcdFx0dC5kaXNhYmxlQ29udHJvbHMoKTtcblx0XHR9XG5cblx0XHQvLyBUZWxsIHVzZXIgdGhhdCB0aGUgZmlsZSBjYW5ub3QgYmUgcGxheWVkXG5cdFx0aWYgKHQub3B0aW9ucy5lcnJvcikge1xuXHRcdFx0dC5vcHRpb25zLmVycm9yKGUpO1xuXHRcdH1cblx0fVxuXG5cdHNldFBsYXllclNpemUgKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAoIXQub3B0aW9ucy5zZXREaW1lbnNpb25zKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB3aWR0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHQud2lkdGggPSB3aWR0aDtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGhlaWdodCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHQuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgRkIgIT09ICd1bmRlZmluZWQnICYmIHQuaXNWaWRlbykge1xuXHRcdFx0RkIuRXZlbnQuc3Vic2NyaWJlKCd4ZmJtbC5yZWFkeScsICgpID0+IHtcblx0XHRcdFx0bGV0IHRhcmdldCA9ICQodC5tZWRpYSkuY2hpbGRyZW4oJy5mYi12aWRlbycpO1xuXG5cdFx0XHRcdHQud2lkdGggPSB0YXJnZXQud2lkdGgoKTtcblx0XHRcdFx0dC5oZWlnaHQgPSB0YXJnZXQuaGVpZ2h0KCk7XG5cdFx0XHRcdHQuc2V0RGltZW5zaW9ucyh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgdGFyZ2V0ID0gJCh0Lm1lZGlhKS5jaGlsZHJlbignLmZiLXZpZGVvJyk7XG5cblx0XHRcdGlmICh0YXJnZXQubGVuZ3RoKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0YXJnZXQud2lkdGgoKTtcblx0XHRcdFx0dC5oZWlnaHQgPSB0YXJnZXQuaGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgc3RyZXRjaGluZyBtb2Rlc1xuXHRcdHN3aXRjaCAodC5vcHRpb25zLnN0cmV0Y2hpbmcpIHtcblx0XHRcdGNhc2UgJ2ZpbGwnOlxuXHRcdFx0XHQvLyBUaGUgJ2ZpbGwnIGVmZmVjdCBvbmx5IG1ha2VzIHNlbnNlIG9uIHZpZGVvOyBmb3IgYXVkaW8gd2Ugd2lsbCBzZXQgdGhlIGRpbWVuc2lvbnNcblx0XHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0XHRcdHQuc2V0RmlsbE1vZGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0LnNldERpbWVuc2lvbnModC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncmVzcG9uc2l2ZSc6XG5cdFx0XHRcdHQuc2V0UmVzcG9uc2l2ZU1vZGUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdub25lJzpcblx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvLyBUaGlzIGlzIHRoZSAnYXV0bycgbW9kZVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKHQuaGFzRmx1aWRNb2RlKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHR0LnNldFJlc3BvbnNpdmVNb2RlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRoYXNGbHVpZE1vZGUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIGRldGVjdCAxMDAlIG1vZGUgLSB1c2UgY3VycmVudFN0eWxlIGZvciBJRSBzaW5jZSBjc3MoKSBkb2Vzbid0IHJldHVybiBwZXJjZW50YWdlc1xuXHRcdHJldHVybiAodC5oZWlnaHQudG9TdHJpbmcoKS5pbmNsdWRlcygnJScpIHx8ICh0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09IHQud2lkdGgpIHx8ICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZSAmJiB0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhXaWR0aCA9PT0gJzEwMCUnKSk7XG5cdH1cblxuXHRzZXRSZXNwb25zaXZlTW9kZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gZG8gd2UgaGF2ZSB0aGUgbmF0aXZlIGRpbWVuc2lvbnMgeWV0P1xuXHRcdGxldCBuYXRpdmVXaWR0aCA9ICgoKSA9PiB7XG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdGlmICh0Lm1lZGlhLnZpZGVvV2lkdGggJiYgdC5tZWRpYS52aWRlb1dpZHRoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0Lm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0VmlkZW9XaWR0aDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0QXVkaW9XaWR0aDtcblx0XHRcdH1cblx0XHR9KSgpO1xuXG5cdFx0bGV0IG5hdGl2ZUhlaWdodCA9ICgoKSA9PiB7XG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdGlmICh0Lm1lZGlhLnZpZGVvSGVpZ2h0ICYmIHQubWVkaWEudmlkZW9IZWlnaHQgPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5vcHRpb25zLmRlZmF1bHRWaWRlb0hlaWdodDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0QXVkaW9IZWlnaHQ7XG5cdFx0XHR9XG5cdFx0fSkoKTtcblxuXHRcdC8vIFVzZSBtZWRpYSBhc3BlY3QgcmF0aW8gaWYgcmVjZWl2ZWQ7IG90aGVyd2lzZSwgdGhlIGluaXRpYWxseSBzdG9yZWQgaW5pdGlhbCBhc3BlY3QgcmF0aW9cblx0XHRsZXRcblx0XHRcdGFzcGVjdFJhdGlvID0gKCgpID0+IHtcblx0XHRcdFx0bGV0IHJhdGlvID0gMTtcblx0XHRcdFx0aWYgKCF0LmlzVmlkZW8pIHtcblx0XHRcdFx0XHRyZXR1cm4gcmF0aW87XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5tZWRpYS52aWRlb1dpZHRoICYmIHQubWVkaWEudmlkZW9XaWR0aCA+IDAgJiYgdC5tZWRpYS52aWRlb0hlaWdodCAmJiB0Lm1lZGlhLnZpZGVvSGVpZ2h0ID4gMCkge1xuXHRcdFx0XHRcdHJhdGlvID0gKHQuaGVpZ2h0ID49IHQud2lkdGgpID8gdC5tZWRpYS52aWRlb1dpZHRoIC8gdC5tZWRpYS52aWRlb0hlaWdodCA6IHQubWVkaWEudmlkZW9IZWlnaHQgLyB0Lm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmF0aW8gPSB0LmluaXRpYWxBc3BlY3RSYXRpbztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpc05hTihyYXRpbykgfHwgcmF0aW8gPCAwLjAxIHx8IHJhdGlvID4gMTAwKSB7XG5cdFx0XHRcdFx0cmF0aW8gPSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJhdGlvO1xuXHRcdFx0fSkoKSxcblx0XHRcdHBhcmVudFdpZHRoID0gdC5jb250YWluZXIucGFyZW50KCkuY2xvc2VzdCgnOnZpc2libGUnKS53aWR0aCgpLFxuXHRcdFx0cGFyZW50SGVpZ2h0ID0gdC5jb250YWluZXIucGFyZW50KCkuY2xvc2VzdCgnOnZpc2libGUnKS5oZWlnaHQoKSxcblx0XHRcdG5ld0hlaWdodDtcblxuXHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdC8vIFJlc3BvbnNpdmUgdmlkZW8gaXMgYmFzZWQgb24gd2lkdGg6IDEwMCUgYW5kIGhlaWdodDogMTAwJVxuXHRcdFx0aWYgKHQuaGVpZ2h0ID09PSAnMTAwJScpIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gcGFyc2VJbnQocGFyZW50V2lkdGggKiBuYXRpdmVIZWlnaHQgLyBuYXRpdmVXaWR0aCwgMTApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gdC5oZWlnaHQgPj0gdC53aWR0aCA/IHBhcnNlSW50KHBhcmVudFdpZHRoIC8gYXNwZWN0UmF0aW8sIDEwKSA6IHBhcnNlSW50KHBhcmVudFdpZHRoICogYXNwZWN0UmF0aW8sIDEwKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3SGVpZ2h0ID0gbmF0aXZlSGVpZ2h0O1xuXHRcdH1cblxuXHRcdC8vIElmIHdlIHdlcmUgdW5hYmxlIHRvIGNvbXB1dGUgbmV3SGVpZ2h0LCBnZXQgdGhlIGNvbnRhaW5lciBoZWlnaHQgaW5zdGVhZFxuXHRcdGlmIChpc05hTihuZXdIZWlnaHQpKSB7XG5cdFx0XHRuZXdIZWlnaHQgPSBwYXJlbnRIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0aWYgKHQuY29udGFpbmVyLnBhcmVudCgpLmxlbmd0aCA+IDAgJiYgdC5jb250YWluZXIucGFyZW50KClbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYm9keScpIHsgLy8gJiYgdC5jb250YWluZXIuc2libGluZ3MoKS5jb3VudCA9PSAwKSB7XG5cdFx0XHRwYXJlbnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFx0bmV3SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGlmIChuZXdIZWlnaHQgJiYgcGFyZW50V2lkdGgpIHtcblxuXHRcdFx0Ly8gc2V0IG91dGVyIGNvbnRhaW5lciBzaXplXG5cdFx0XHR0LmNvbnRhaW5lclxuXHRcdFx0LndpZHRoKHBhcmVudFdpZHRoKVxuXHRcdFx0LmhlaWdodChuZXdIZWlnaHQpO1xuXG5cdFx0XHQvLyBzZXQgbmF0aXZlIDx2aWRlbz4gb3IgPGF1ZGlvPiBhbmQgc2hpbXNcblx0XHRcdHQuJG1lZGlhXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXG5cdFx0XHQvLyBpZiBzaGltIGlzIHJlYWR5LCBzZW5kIHRoZSBzaXplIHRvIHRoZSBlbWJlZGRlZCBwbHVnaW5cblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdFx0aWYgKHQubWVkaWEuc2V0U2l6ZSkge1xuXHRcdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShwYXJlbnRXaWR0aCwgbmV3SGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZXQgdGhlIGxheWVyc1xuXHRcdFx0dC5sYXllcnMuY2hpbGRyZW4oYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcmApXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXHRcdH1cblx0fVxuXG5cdHNldEZpbGxNb2RlICgpIHtcblx0XHRsZXQgdCA9IHRoaXMsXG5cdFx0XHRwYXJlbnQgPSB0Lm91dGVyQ29udGFpbmVyO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSByZXNwb25zaXZlIGF0dHJpYnV0ZXMgaW4gdGhlIGV2ZW50IHRoZXkgYXJlIHRoZXJlXG5cdFx0aWYgKHQuJG5vZGUuY3NzKCdoZWlnaHQnKSAhPT0gJ25vbmUnICYmIHQuJG5vZGUuY3NzKCdoZWlnaHQnKSAhPT0gdC5oZWlnaHQpIHtcblx0XHRcdHQuJG5vZGUuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0fVxuXHRcdGlmICh0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09IHQud2lkdGgpIHtcblx0XHRcdHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnLCAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHQuJG5vZGUuY3NzKCdtYXgtaGVpZ2h0JykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LWhlaWdodCcpICE9PSB0LmhlaWdodCkge1xuXHRcdFx0dC4kbm9kZS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlKSB7XG5cdFx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUuaGVpZ2h0ID09PSAnMTAwJScpIHtcblx0XHRcdFx0dC4kbm9kZVswXS5jdXJyZW50U3R5bGUuaGVpZ2h0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4V2lkdGggPT09ICcxMDAlJykge1xuXHRcdFx0XHR0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhXaWR0aCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heEhlaWdodCA9PT0gJzEwMCUnKSB7XG5cdFx0XHRcdHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heEhlaWdodCA9ICcnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghcGFyZW50LndpZHRoKCkpIHtcblx0XHRcdHBhcmVudC5oZWlnaHQodC4kbWVkaWEud2lkdGgoKSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFwYXJlbnQuaGVpZ2h0KCkpIHtcblx0XHRcdHBhcmVudC5oZWlnaHQodC4kbWVkaWEuaGVpZ2h0KCkpO1xuXHRcdH1cblxuXHRcdGxldCBwYXJlbnRXaWR0aCA9IHBhcmVudC53aWR0aCgpLFxuXHRcdFx0cGFyZW50SGVpZ2h0ID0gcGFyZW50LmhlaWdodCgpO1xuXG5cdFx0dC5zZXREaW1lbnNpb25zKCcxMDAlJywgJzEwMCUnKTtcblxuXHRcdC8vIFRoaXMgcHJldmVudHMgYW4gaXNzdWUgd2hlbiBkaXNwbGF5aW5nIHBvc3RlclxuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXIgaW1nYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHQvLyBjYWxjdWxhdGUgbmV3IHdpZHRoIGFuZCBoZWlnaHRcblx0XHRsZXRcblx0XHRcdHRhcmdldEVsZW1lbnQgPSB0LmNvbnRhaW5lci5maW5kKCdvYmplY3QsIGVtYmVkLCBpZnJhbWUsIHZpZGVvJyksXG5cdFx0XHRpbml0SGVpZ2h0ID0gdC5oZWlnaHQsXG5cdFx0XHRpbml0V2lkdGggPSB0LndpZHRoLFxuXHRcdFx0Ly8gc2NhbGUgdG8gdGhlIHRhcmdldCB3aWR0aFxuXHRcdFx0c2NhbGVYMSA9IHBhcmVudFdpZHRoLFxuXHRcdFx0c2NhbGVZMSA9IChpbml0SGVpZ2h0ICogcGFyZW50V2lkdGgpIC8gaW5pdFdpZHRoLFxuXHRcdFx0Ly8gc2NhbGUgdG8gdGhlIHRhcmdldCBoZWlnaHRcblx0XHRcdHNjYWxlWDIgPSAoaW5pdFdpZHRoICogcGFyZW50SGVpZ2h0KSAvIGluaXRIZWlnaHQsXG5cdFx0XHRzY2FsZVkyID0gcGFyZW50SGVpZ2h0LFxuXHRcdFx0Ly8gbm93IGZpZ3VyZSBvdXQgd2hpY2ggb25lIHdlIHNob3VsZCB1c2Vcblx0XHRcdGJTY2FsZU9uV2lkdGggPSBzY2FsZVgyID4gcGFyZW50V2lkdGggPT09IGZhbHNlLFxuXHRcdFx0ZmluYWxXaWR0aCA9IGJTY2FsZU9uV2lkdGggPyBNYXRoLmZsb29yKHNjYWxlWDEpIDogTWF0aC5mbG9vcihzY2FsZVgyKSxcblx0XHRcdGZpbmFsSGVpZ2h0ID0gYlNjYWxlT25XaWR0aCA/IE1hdGguZmxvb3Ioc2NhbGVZMSkgOiBNYXRoLmZsb29yKHNjYWxlWTIpO1xuXG5cdFx0aWYgKGJTY2FsZU9uV2lkdGgpIHtcblx0XHRcdHRhcmdldEVsZW1lbnQuaGVpZ2h0KGZpbmFsSGVpZ2h0KS53aWR0aChwYXJlbnRXaWR0aCk7XG5cdFx0XHRpZiAodC5tZWRpYS5zZXRTaXplKSB7XG5cdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShwYXJlbnRXaWR0aCwgZmluYWxIZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRFbGVtZW50LmhlaWdodChwYXJlbnRIZWlnaHQpLndpZHRoKGZpbmFsV2lkdGgpO1xuXHRcdFx0aWYgKHQubWVkaWEuc2V0U2l6ZSkge1xuXHRcdFx0XHR0Lm1lZGlhLnNldFNpemUoZmluYWxXaWR0aCwgcGFyZW50SGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRFbGVtZW50LmNzcyh7XG5cdFx0XHQnbWFyZ2luLWxlZnQnOiBNYXRoLmZsb29yKChwYXJlbnRXaWR0aCAtIGZpbmFsV2lkdGgpIC8gMiksXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDBcblx0XHR9KTtcblx0fVxuXG5cdHNldERpbWVuc2lvbnMgKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmNvbnRhaW5lclxuXHRcdC53aWR0aCh3aWR0aClcblx0XHQuaGVpZ2h0KGhlaWdodCk7XG5cblx0XHR0LmxheWVycy5jaGlsZHJlbihgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyYClcblx0XHQud2lkdGgod2lkdGgpXG5cdFx0LmhlaWdodChoZWlnaHQpO1xuXHR9XG5cblx0c2V0Q29udHJvbHNTaXplICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBza2lwIGNhbGN1bGF0aW9uIGlmIGhpZGRlblxuXHRcdGlmICghdC5jb250YWluZXIuaXMoJzp2aXNpYmxlJykgfHwgIXQucmFpbCB8fCAhdC5yYWlsLmxlbmd0aCB8fCAhdC5yYWlsLmlzKCc6dmlzaWJsZScpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHRyYWlsTWFyZ2luID0gcGFyc2VGbG9hdCh0LnJhaWwuY3NzKCdtYXJnaW4tbGVmdCcpKSArIHBhcnNlRmxvYXQodC5yYWlsLmNzcygnbWFyZ2luLXJpZ2h0JykpLFxuXHRcdFx0dG90YWxNYXJnaW4gPSBwYXJzZUZsb2F0KHQudG90YWwuY3NzKCdtYXJnaW4tbGVmdCcpKSArIHBhcnNlRmxvYXQodC50b3RhbC5jc3MoJ21hcmdpbi1yaWdodCcpKSB8fCAwLFxuXHRcdFx0c2libGluZ3NXaWR0aCA9IDBcblx0XHQ7XG5cblx0XHR0LnJhaWwuc2libGluZ3MoKS5lYWNoKChpbmRleCwgb2JqZWN0KSA9PiB7XG5cdFx0XHRzaWJsaW5nc1dpZHRoICs9IHBhcnNlRmxvYXQoJChvYmplY3QpLm91dGVyV2lkdGgodHJ1ZSkpO1xuXHRcdH0pO1xuXG5cdFx0c2libGluZ3NXaWR0aCArPSB0b3RhbE1hcmdpbiArIHJhaWxNYXJnaW4gKyAxO1xuXG5cdFx0Ly8gU3Vic3RyYWN0IHRoZSB3aWR0aCBvZiB0aGUgZmVhdHVyZSBzaWJsaW5ncyBmcm9tIHRpbWUgcmFpbFxuXHRcdHQucmFpbC53aWR0aCh0LmNvbnRyb2xzLndpZHRoKCkgLSBzaWJsaW5nc1dpZHRoKTtcblxuXHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzcmVzaXplJyk7XG5cdH1cblxuXHRyZXNldFNpemUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHQvLyB3ZWJraXQgaGFzIHRyb3VibGUgZG9pbmcgdGhpcyB3aXRob3V0IGEgZGVsYXlcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdH0sIDUwKTtcblx0fVxuXG5cdHNldFBvc3RlciAodXJsKSB7XG5cdFx0bGV0IHQgPSB0aGlzLFxuXHRcdFx0cG9zdGVyRGl2ID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlcmApLFxuXHRcdFx0cG9zdGVySW1nID0gcG9zdGVyRGl2LmZpbmQoJ2ltZycpO1xuXG5cdFx0aWYgKHBvc3RlckltZy5sZW5ndGggPT09IDApIHtcblx0XHRcdHBvc3RlckltZyA9ICQoYDxpbWcgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXItaW1nXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGFsdD1cIlwiIC8+YClcblx0XHRcdC5hcHBlbmRUbyhwb3N0ZXJEaXYpO1xuXHRcdH1cblxuXHRcdHBvc3RlckltZy5hdHRyKCdzcmMnLCB1cmwpO1xuXHRcdHBvc3RlckRpdi5jc3MoeydiYWNrZ3JvdW5kLWltYWdlJzogYHVybChcIiR7dXJsfVwiKWB9KTtcblx0fVxuXG5cdGNoYW5nZVNraW4gKGNsYXNzTmFtZSkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuY29udGFpbmVyWzBdLmNsYXNzTmFtZSA9IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIgJHtjbGFzc05hbWV9YDtcblx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdH1cblxuXHRnbG9iYWxCaW5kIChldmVudHMsIGRhdGEsIGNhbGxiYWNrKSB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGRvYyA9IHQubm9kZSA/IHQubm9kZS5vd25lckRvY3VtZW50IDogZG9jdW1lbnRcblx0XHQ7XG5cblx0XHRldmVudHMgPSBzcGxpdEV2ZW50cyhldmVudHMsIHQuaWQpO1xuXHRcdGlmIChldmVudHMuZCkge1xuXHRcdFx0JChkb2MpLm9uKGV2ZW50cy5kLCBkYXRhLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGlmIChldmVudHMudykge1xuXHRcdFx0JCh3aW5kb3cpLm9uKGV2ZW50cy53LCBkYXRhLCBjYWxsYmFjayk7XG5cdFx0fVxuXHR9XG5cblx0Z2xvYmFsVW5iaW5kIChldmVudHMsIGNhbGxiYWNrKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0ZG9jID0gdC5ub2RlID8gdC5ub2RlLm93bmVyRG9jdW1lbnQgOiBkb2N1bWVudFxuXHRcdDtcblxuXHRcdGV2ZW50cyA9IHNwbGl0RXZlbnRzKGV2ZW50cywgdC5pZCk7XG5cdFx0aWYgKGV2ZW50cy5kKSB7XG5cdFx0XHQkKGRvYykub2ZmKGV2ZW50cy5kLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGlmIChldmVudHMudykge1xuXHRcdFx0JCh3aW5kb3cpLm9mZihldmVudHMudywgY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdGJ1aWxkcG9zdGVyIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0cG9zdGVyID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPjwvZGl2PmApLmFwcGVuZFRvKGxheWVycyksXG5cdFx0XHRwb3N0ZXJVcmwgPSBwbGF5ZXIuJG1lZGlhLmF0dHIoJ3Bvc3RlcicpXG5cdFx0O1xuXG5cdFx0Ly8gcHJpb3JpdHkgZ29lcyB0byBvcHRpb24gKHRoaXMgaXMgdXNlZnVsIGlmIHlvdSBuZWVkIHRvIHN1cHBvcnQgaU9TIDMueCAoaU9TIGNvbXBsZXRlbHkgZmFpbHMgd2l0aCBwb3N0ZXIpXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnBvc3RlciAhPT0gJycpIHtcblx0XHRcdHBvc3RlclVybCA9IHBsYXllci5vcHRpb25zLnBvc3Rlcjtcblx0XHR9XG5cblx0XHQvLyBzZWNvbmQsIHRyeSB0aGUgcmVhbCBwb3N0ZXJcblx0XHRpZiAocG9zdGVyVXJsKSB7XG5cdFx0XHR0LnNldFBvc3Rlcihwb3N0ZXJVcmwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwb3N0ZXIuaGlkZSgpO1xuXHRcdH1cblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRwb3N0ZXIuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdGlmIChwbGF5ZXIub3B0aW9ucy5zaG93UG9zdGVyV2hlbkVuZGVkICYmIHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQpIHtcblx0XHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0XHRwb3N0ZXIuc2hvdygpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdGJ1aWxkb3ZlcmxheXMgKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpIHtcblxuXHRcdGlmICghcGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bG9hZGluZyA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5ICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWxvYWRpbmdcIj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktbG9hZGluZy1iZy1pbWdcIj48L3NwYW4+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmhpZGUoKSAvLyBzdGFydCBvdXQgaGlkZGVuXG5cdFx0XHRcdC5hcHBlbmRUbyhsYXllcnMpLFxuXHRcdFx0ZXJyb3IgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1lcnJvclwiPjwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmhpZGUoKSAvLyBzdGFydCBvdXQgaGlkZGVuXG5cdFx0XHRcdC5hcHBlbmRUbyhsYXllcnMpLFxuXHRcdFx0Ly8gdGhpcyBuZWVkcyB0byBjb21lIGxhc3Qgc28gaXQncyBvbiB0b3Bcblx0XHRcdGJpZ1BsYXkgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LXBsYXlcIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIGAgK1xuXHRcdFx0XHRcdFx0YGFyaWEtbGFiZWw9XCIke2kxOG4udCgnbWVqcy5wbGF5Jyl9XCIgYXJpYS1wcmVzc2VkPVwiZmFsc2VcIj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8obGF5ZXJzKVxuXHRcdFx0XHQub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRcdC8vIFJlbW92ZWQgJ3RvdWNoc3RhcnQnIGR1ZSBpc3N1ZXMgb24gU2Ftc3VuZyBBbmRyb2lkIGRldmljZXMgd2hlcmUgYSB0YXAgb24gYmlnUGxheVxuXHRcdFx0XHRcdC8vIHN0YXJ0ZWQgYW5kIGltbWVkaWF0ZWx5IHN0b3BwZWQgdGhlIHZpZGVvXG5cdFx0XHRcdFx0aWYgKHQub3B0aW9ucy5jbGlja1RvUGxheVBhdXNlKSB7XG5cblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRidXR0b24gPSB0LiRtZWRpYS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYClcblx0XHRcdFx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWJ1dHRvbmApLFxuXHRcdFx0XHRcdFx0XHRwcmVzc2VkID0gYnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcsICEhcHJlc3NlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdC8vIGlmICh0Lm9wdGlvbnMuc3VwcG9ydFZSIHx8ICh0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKHlvdXR1YmV8ZmFjZWJvb2spLykpKSB7XG5cdFx0aWYgKHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8oeW91dHViZXxmYWNlYm9vaykvKSkge1xuXHRcdFx0YmlnUGxheS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gc2hvdy9oaWRlIGJpZyBwbGF5IGJ1dHRvblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdFx0ZXJyb3IuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdFx0ZXJyb3IuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3NlZWtpbmcnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLnNob3coKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLnNob3coKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdzZWVrZWQnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsICgpID0+IHtcblx0XHRcdGJpZ1BsYXkuc2hvdygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmcnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLnNob3coKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLnNob3coKTtcblx0XHR9LCBmYWxzZSk7XG5cblxuXHRcdC8vIHNob3cvaGlkZSBsb2FkaW5nXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkZGF0YScsICgpID0+IHtcblx0XHRcdC8vIGZvciBzb21lIHJlYXNvbiBDaHJvbWUgaXMgZmlyaW5nIHRoaXMgZXZlbnRcblx0XHRcdC8vaWYgKG1lanMuTWVkaWFGZWF0dXJlcy5pc0Nocm9tZSAmJiBtZWRpYS5nZXRBdHRyaWJ1dGUgJiYgbWVkaWEuZ2V0QXR0cmlidXRlKCdwcmVsb2FkJykgPT09ICdub25lJylcblx0XHRcdC8vXHRyZXR1cm47XG5cblx0XHRcdGxvYWRpbmcuc2hvdygpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuc2hvdygpO1xuXHRcdFx0Ly8gRmlyaW5nIHRoZSAnY2FucGxheScgZXZlbnQgYWZ0ZXIgYSB0aW1lb3V0IHdoaWNoIGlzbid0IGdldHRpbmcgZmlyZWQgb24gc29tZSBBbmRyb2lkIDQuMSBkZXZpY2VzXG5cdFx0XHQvLyAoaHR0cHM6Ly9naXRodWIuY29tL2pvaG5keWVyL21lZGlhZWxlbWVudC9pc3N1ZXMvMTMwNSlcblx0XHRcdGlmIChJU19BTkRST0lEKSB7XG5cdFx0XHRcdG1lZGlhLmNhbnBsYXlUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoXG5cdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHRcdGxldCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdFx0XHRldnQuaW5pdEV2ZW50KCdjYW5wbGF5JywgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtZWRpYS5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgMzAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHRcdC8vIENsZWFyIHRpbWVvdXQgaW5zaWRlICdsb2FkZWRkYXRhJyB0byBwcmV2ZW50ICdjYW5wbGF5JyBmcm9tIGZpcmluZyB0d2ljZVxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1lZGlhLmNhbnBsYXlUaW1lb3V0KTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHQvLyBlcnJvciBoYW5kbGluZ1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcblx0XHRcdHQuX2hhbmRsZUVycm9yKGUpO1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGVycm9yLnNob3coKTtcblx0XHRcdGVycm9yLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWVycm9yYCkuaHRtbChlLm1lc3NhZ2UpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0dC5vbmtleWRvd24ocGxheWVyLCBtZWRpYSwgZSk7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0YnVpbGRrZXlib2FyZCAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jb250YWluZXIua2V5ZG93bigoKSA9PiB7XG5cdFx0XHR0LmtleWJvYXJkQWN0aW9uID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdC8vIGxpc3RlbiBmb3Iga2V5IHByZXNzZXNcblx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcblx0XHRcdGxldCAkY29udGFpbmVyID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKTtcblx0XHRcdHBsYXllci5oYXNGb2N1cyA9ICRjb250YWluZXIubGVuZ3RoICE9PSAwICYmXG5cdFx0XHRcdCRjb250YWluZXIuYXR0cignaWQnKSA9PT0gcGxheWVyLiRtZWRpYS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkuYXR0cignaWQnKTtcblx0XHRcdHJldHVybiB0Lm9ua2V5ZG93bihwbGF5ZXIsIG1lZGlhLCBldmVudCk7XG5cdFx0fSk7XG5cblxuXHRcdC8vIGNoZWNrIGlmIHNvbWVvbmUgY2xpY2tlZCBvdXRzaWRlIGEgcGxheWVyIHJlZ2lvbiwgdGhlbiBraWxsIGl0cyBmb2N1c1xuXHRcdHQuZ2xvYmFsQmluZCgnY2xpY2snLCAoZXZlbnQpID0+IHtcblx0XHRcdHBsYXllci5oYXNGb2N1cyA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoICE9PSAwO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRvbmtleWRvd24gKHBsYXllciwgbWVkaWEsIGUpIHtcblxuXHRcdGlmIChwbGF5ZXIuaGFzRm9jdXMgJiYgcGxheWVyLm9wdGlvbnMuZW5hYmxlS2V5Ym9hcmQpIHtcblx0XHRcdC8vIGZpbmQgYSBtYXRjaGluZyBrZXlcblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IHBsYXllci5vcHRpb25zLmtleUFjdGlvbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQga2V5QWN0aW9uID0gcGxheWVyLm9wdGlvbnMua2V5QWN0aW9uc1tpXTtcblxuXHRcdFx0XHRmb3IgKGxldCBqID0gMCwgamwgPSBrZXlBY3Rpb24ua2V5cy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0ga2V5QWN0aW9uLmtleXNbal0pIHtcblx0XHRcdFx0XHRcdGtleUFjdGlvbi5hY3Rpb24ocGxheWVyLCBtZWRpYSwgZS5rZXlDb2RlLCBlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHBsYXkgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIG9ubHkgbG9hZCBpZiB0aGUgY3VycmVudCB0aW1lIGlzIDAgdG8gZW5zdXJlIHByb3BlciBwbGF5aW5nXG5cdFx0aWYgKHQubWVkaWEuZ2V0Q3VycmVudFRpbWUoKSA8PSAwKSB7XG5cdFx0XHR0LmxvYWQoKTtcblx0XHR9XG5cdFx0dC5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHRwYXVzZSAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0fVxuXHR9XG5cblx0bG9hZCAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKCF0LmlzTG9hZGVkKSB7XG5cdFx0XHR0Lm1lZGlhLmxvYWQoKTtcblx0XHR9XG5cblx0XHR0LmlzTG9hZGVkID0gdHJ1ZTtcblx0fVxuXG5cdHNldE11dGVkIChtdXRlZCkge1xuXHRcdHRoaXMubWVkaWEuc2V0TXV0ZWQobXV0ZWQpO1xuXHR9XG5cblx0c2V0Q3VycmVudFRpbWUgKHRpbWUpIHtcblx0XHR0aGlzLm1lZGlhLnNldEN1cnJlbnRUaW1lKHRpbWUpO1xuXHR9XG5cblx0Z2V0Q3VycmVudFRpbWUgKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xuXHR9XG5cblx0c2V0Vm9sdW1lICh2b2x1bWUpIHtcblx0XHR0aGlzLm1lZGlhLnNldFZvbHVtZSh2b2x1bWUpO1xuXHR9XG5cblx0Z2V0Vm9sdW1lICgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS52b2x1bWU7XG5cdH1cblxuXHRzZXRTcmMgKHNyYykge1xuXHRcdHRoaXMubWVkaWEuc2V0U3JjKHNyYyk7XG5cdH1cblxuXHRyZW1vdmUgKCkge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHJlbmRlcmVyTmFtZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lXG5cdFx0O1xuXG5cdFx0Ly8gaW52b2tlIGZlYXR1cmVzIGNsZWFudXBcblx0XHRmb3IgKGxldCBmZWF0dXJlSW5kZXggaW4gdC5vcHRpb25zLmZlYXR1cmVzKSB7XG5cdFx0XHRsZXQgZmVhdHVyZSA9IHQub3B0aW9ucy5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuXHRcdFx0aWYgKHRbYGNsZWFuJHtmZWF0dXJlfWBdKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dFtgY2xlYW4ke2ZlYXR1cmV9YF0odCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHQvLyBAdG9kbzogcmVwb3J0IGNvbnRyb2wgZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBlcnJvciBjbGVhbmluZyAke2ZlYXR1cmV9YCwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZXNldCBkaW1lbnNpb25zXG5cdFx0dC4kbm9kZS5jc3Moe1xuXHRcdFx0d2lkdGg6IHQuJG5vZGUuYXR0cignd2lkdGgnKSB8fCAnYXV0bycsXG5cdFx0XHRoZWlnaHQ6IHQuJG5vZGUuYXR0cignaGVpZ2h0JykgfHwgJ2F1dG8nXG5cdFx0fSk7XG5cblx0XHQvLyBncmFiIHZpZGVvIGFuZCBwdXQgaXQgYmFjayBpbiBwbGFjZVxuXHRcdGlmICghdC5pc0R5bmFtaWMpIHtcblx0XHRcdHQuJG1lZGlhLnByb3AoJ2NvbnRyb2xzJywgdHJ1ZSk7XG5cdFx0XHQvLyBkZXRhY2ggZXZlbnRzIGZyb20gdGhlIHZpZGVvXG5cdFx0XHQvLyBAdG9kbzogZGV0YWNoIGV2ZW50IGxpc3RlbmVycyBiZXR0ZXIgdGhhbiB0aGlzOyBhbHNvIGRldGFjaCBPTkxZIHRoZSBldmVudHMgYXR0YWNoZWQgYnkgdGhpcyBwbHVnaW4hXG5cdFx0XHR0LiRub2RlLmF0dHIoJ2lkJywgdC4kbm9kZS5hdHRyKCdpZCcpLnJlcGxhY2UoYF8ke3JlbmRlcmVyTmFtZX1gLCAnJykpO1xuXHRcdFx0dC4kbm9kZS5jbG9uZSgpLmluc2VydEJlZm9yZSh0LmNvbnRhaW5lcikuc2hvdygpO1xuXHRcdFx0dC4kbm9kZS5yZW1vdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC4kbm9kZS5pbnNlcnRCZWZvcmUodC5jb250YWluZXIpO1xuXHRcdH1cblxuXHRcdHQubWVkaWEucmVtb3ZlKCk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIHBsYXllciBmcm9tIHRoZSBtZWpzLnBsYXllcnMgb2JqZWN0IHNvIHRoYXQgcGF1c2VPdGhlclBsYXllcnMgZG9lc24ndCBibG93IHVwIHdoZW4gdHJ5aW5nIHRvXG5cdFx0Ly8gcGF1c2UgYSBub24gZXhpc3RlbnQgRmxhc2ggQVBJLlxuXHRcdGRlbGV0ZSBtZWpzLnBsYXllcnNbdC5pZF07XG5cblx0XHRpZiAodHlwZW9mIHQuY29udGFpbmVyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dC5jb250YWluZXIucHJldihgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApLnJlbW92ZSgpO1xuXHRcdFx0dC5jb250YWluZXIucmVtb3ZlKCk7XG5cdFx0fVxuXHRcdHQuZ2xvYmFsVW5iaW5kKCk7XG5cdFx0ZGVsZXRlIHQubm9kZS5wbGF5ZXI7XG5cdH1cbn1cblxud2luZG93Lk1lZGlhRWxlbWVudFBsYXllciA9IE1lZGlhRWxlbWVudFBsYXllcjtcblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFFbGVtZW50UGxheWVyO1xuXG4vLyB0dXJuIGludG8gcGx1Z2luXG4oKCQpID0+IHtcblxuXHRpZiAodHlwZW9mICQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0JC5mbi5tZWRpYWVsZW1lbnRwbGF5ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdFx0aWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0bGV0IHBsYXllciA9ICQodGhpcykuZGF0YSgnbWVkaWFlbGVtZW50cGxheWVyJyk7XG5cdFx0XHRcdFx0aWYgKHBsYXllcikge1xuXHRcdFx0XHRcdFx0cGxheWVyLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZURhdGEoJ21lZGlhZWxlbWVudHBsYXllcicpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnbWVkaWFlbGVtZW50cGxheWVyJywgbmV3IE1lZGlhRWxlbWVudFBsYXllcih0aGlzLCBvcHRpb25zKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdCQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0XHRcdC8vIGF1dG8gZW5hYmxlIHVzaW5nIEpTT04gYXR0cmlidXRlXG5cdFx0XHQkKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9cGxheWVyYCkubWVkaWFlbGVtZW50cGxheWVyKCk7XG5cdFx0fSk7XG5cdH1cblxufSkobWVqcy4kKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnQsIGFkZEV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogRGFpbHlNb3Rpb24gcmVuZGVyZXJcbiAqXG4gKiBVc2VzIDxpZnJhbWU+IGFwcHJvYWNoIGFuZCB1c2VzIERhaWx5TW90aW9uIEFQSSB0byBtYW5pcHVsYXRlIGl0LlxuICogQHNlZSBodHRwczovL2RldmVsb3Blci5kYWlseW1vdGlvbi5jb20vcGxheWVyXG4gKlxuICovXG5jb25zdCBEYWlseU1vdGlvbkFwaSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0aWZyYW1lUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBjcmVhdGlvbiBvZiA8aWZyYW1lPlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRlbnF1ZXVlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGlmIChEYWlseU1vdGlvbkFwaS5pc0xvYWRlZCkge1xuXHRcdFx0RGFpbHlNb3Rpb25BcGkuY3JlYXRlSWZyYW1lKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0RGFpbHlNb3Rpb25BcGkubG9hZElmcmFtZUFwaSgpO1xuXHRcdFx0RGFpbHlNb3Rpb25BcGkuaWZyYW1lUXVldWUucHVzaChzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIERhaWx5TW90aW9uIEFQSSBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICovXG5cdGxvYWRJZnJhbWVBcGk6ICgpID0+IHtcblx0XHRpZiAoIURhaWx5TW90aW9uQXBpLmlzU0RLU3RhcnRlZCkge1xuXHRcdFx0bGV0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdGUuYXN5bmMgPSB0cnVlO1xuXHRcdFx0ZS5zcmMgPSAnLy9hcGkuZG1jZG4ubmV0L2FsbC5qcyc7XG5cdFx0XHRsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcblx0XHRcdHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSwgcyk7XG5cdFx0XHREYWlseU1vdGlvbkFwaS5pc1NES1N0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBEYWlseU1vdGlvbiA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRhcGlSZWFkeTogKCkgPT4ge1xuXG5cdFx0RGFpbHlNb3Rpb25BcGkuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdERhaWx5TW90aW9uQXBpLmlzU0RLTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChEYWlseU1vdGlvbkFwaS5pZnJhbWVRdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBEYWlseU1vdGlvbkFwaS5pZnJhbWVRdWV1ZS5wb3AoKTtcblx0XHRcdERhaWx5TW90aW9uQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgRGFpbHlNb3Rpb24gQVBJIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGNyZWF0ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdHBsYXllciA9IERNLnBsYXllcihzZXR0aW5ncy5jb250YWluZXIsIHtcblx0XHRcdFx0aGVpZ2h0OiBzZXR0aW5ncy5oZWlnaHQgfHwgJzEwMCUnLFxuXHRcdFx0XHR3aWR0aDogc2V0dGluZ3Mud2lkdGggfHwgJzEwMCUnLFxuXHRcdFx0XHR2aWRlbzogc2V0dGluZ3MudmlkZW9JZCxcblx0XHRcdFx0cGFyYW1zOiBPYmplY3QuYXNzaWduKHthcGk6IHRydWV9LCBzZXR0aW5ncy5wYXJhbXMpLFxuXHRcdFx0XHRvcmlnaW46IGxvY2F0aW9uLmhvc3Rcblx0XHRcdH0pO1xuXG5cdFx0cGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2FwaXJlYWR5JywgKCkgPT4ge1xuXHRcdFx0d2luZG93WydfX3JlYWR5X18nICsgc2V0dGluZ3MuaWRdKHBsYXllciwge3BhdXNlZDogdHJ1ZSwgZW5kZWQ6IGZhbHNlfSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEV4dHJhY3QgSUQgZnJvbSBEYWlseU1vdGlvbidzIFVSTCB0byBiZSBsb2FkZWQgdGhyb3VnaCBBUElcblx0ICogVmFsaWQgVVJMIGZvcm1hdChzKTpcblx0ICogLSBodHRwOi8vd3d3LmRhaWx5bW90aW9uLmNvbS9lbWJlZC92aWRlby94MzV5YXd5XG5cdCAqIC0gaHR0cDovL2RhaS5seS94MzV5YXd5XG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybiB7U3RyaW5nfVxuXHQgKi9cblx0Z2V0RGFpbHlNb3Rpb25JZDogKHVybCkgPT4ge1xuXHRcdGxldFxuXHRcdFx0cGFydHMgPSB1cmwuc3BsaXQoJy8nKSxcblx0XHRcdGxhc3RQYXJ0ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0sXG5cdFx0XHRkYXNoUGFydHMgPSBsYXN0UGFydC5zcGxpdCgnXycpXG5cdFx0O1xuXG5cdFx0cmV0dXJuIGRhc2hQYXJ0c1swXTtcblx0fVxufTtcblxuY29uc3QgRGFpbHlNb3Rpb25JZnJhbWVSZW5kZXJlciA9IHtcblx0bmFtZTogJ2RhaWx5bW90aW9uX2lmcmFtZScsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ2RhaWx5bW90aW9uX2lmcmFtZScsXG5cblx0XHRkYWlseW1vdGlvbjoge1xuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0cGFyYW1zOiB7XG5cdFx0XHRcdGF1dG9wbGF5OiBmYWxzZSxcblx0XHRcdFx0Y2hyb21lbGVzczogMSxcblx0XHRcdFx0aW5mbzogMCxcblx0XHRcdFx0bG9nbzogMCxcblx0XHRcdFx0cmVsYXRlZDogMFxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBbJ3ZpZGVvL2RhaWx5bW90aW9uJywgJ3ZpZGVvL3gtZGFpbHltb3Rpb24nXS5pbmNsdWRlcyh0eXBlKSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdGxldCBkbSA9IHt9O1xuXG5cdFx0ZG0ub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0ZG0uaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHRkbS5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHRsZXRcblx0XHRcdGFwaVN0YWNrID0gW10sXG5cdFx0XHRkbVBsYXllclJlYWR5ID0gZmFsc2UsXG5cdFx0XHRkbVBsYXllciA9IG51bGwsXG5cdFx0XHRkbUlmcmFtZSA9IG51bGwsXG5cdFx0XHRldmVudHMsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyB3cmFwcGVycyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGZsYXNoIHN0YXRlIHRoYXQgd2Ugd2lsbCBzdG9yZVxuXG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdGRtW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRtUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXG5cdFx0XHRcdFx0XHQvLyBmaWd1cmUgb3V0IGhvdyB0byBnZXQgZG0gZHRhIGhlcmVcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkbVBsYXllci5jdXJyZW50VGltZTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdkdXJhdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGlzTmFOKGRtUGxheWVyLmR1cmF0aW9uKSA/IDAgOiBkbVBsYXllci5kdXJhdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkbVBsYXllci52b2x1bWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIucGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIuZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkbVBsYXllci5tdXRlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdidWZmZXJlZCc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHBlcmNlbnRMb2FkZWQgPSBkbVBsYXllci5idWZmZXJlZFRpbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkdXJhdGlvbiA9IGRtUGxheWVyLmR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHBlcmNlbnRMb2FkZWQgLyBkdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGg6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGRtW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRpZiAoZG1QbGF5ZXIgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHVybCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlWzBdLnNyYztcblxuXHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLmxvYWQoRGFpbHlNb3Rpb25BcGkuZ2V0RGFpbHlNb3Rpb25JZCh1cmwpKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0ZG1QbGF5ZXIuc2Vlayh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZG1QbGF5ZXIuc2V0TXV0ZWQodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNldE11dGVkKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgZG0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNldFZvbHVtZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgZG0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdkbSAnICsgZG0uaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgbmF0aXZlIEhUTUxNZWRpYUVsZW1lbnRcblx0XHRcdFx0ZG1bbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRtUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIERPIG1ldGhvZFxuXHRcdFx0XHRcdFx0c3dpdGNoIChtZXRob2ROYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BsYXknOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkbVBsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BhdXNlJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnY2FsbCcsIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsIG1ldGhvZCB0byByZWdpc3RlciBhbGwgRGFpbHlNb3Rpb24gZXZlbnRzIHdoZW4gaW5pdGlhbGl6aW5nIDxpZnJhbWU+XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgZG0uaWRdID0gKF9kbVBsYXllcikgPT4ge1xuXG5cdFx0XHRkbVBsYXllclJlYWR5ID0gdHJ1ZTtcblx0XHRcdG1lZGlhRWxlbWVudC5kbVBsYXllciA9IGRtUGxheWVyID0gX2RtUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YFxuXHRcdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGRtW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0ZG1bc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGRtSWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG0uaWQpO1xuXG5cdFx0XHQvLyBhIGZldyBtb3JlIGV2ZW50c1xuXHRcdFx0ZXZlbnRzID0gWydtb3VzZW92ZXInLCAnbW91c2VvdXQnXTtcblx0XHRcdGxldCBhc3NpZ25FdmVudCA9IChlKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGUudHlwZSwgZG0pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGxldCBqIGluIGV2ZW50cykge1xuXHRcdFx0XHRhZGRFdmVudChkbUlmcmFtZSwgZXZlbnRzW2pdLCBhc3NpZ25FdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJVQkJMRSBFVkVOVFMgdXBcblx0XHRcdGV2ZW50cyA9IG1lanMuaHRtbDVtZWRpYS5ldmVudHM7XG5cdFx0XHRldmVudHMgPSBldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXHRcdFx0bGV0IGFzc2lnbk5hdGl2ZUV2ZW50cyA9IChldmVudE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBEZXByZWNhdGVkIGV2ZW50OyBub3QgY29uc2lkZXIgaXRcblx0XHRcdFx0aWYgKGV2ZW50TmFtZSAhPT0gJ2VuZGVkJykge1xuXG5cdFx0XHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIGRtUGxheWVyKTtcblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGFzc2lnbk5hdGl2ZUV2ZW50cyhldmVudHNbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDdXN0b20gRGFpbHlNb3Rpb24gZXZlbnRzXG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdhZF9zdGFydCcsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3BsYXknLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRldmVudCA9IGNyZWF0ZUV2ZW50KCdwcm9ncmVzcycsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfdGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfcGF1c2UnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwYXVzZScsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdhZF9lbmQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCd2aWRlb19zdGFydCcsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3BsYXknLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3ZpZGVvX2VuZCcsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ2VuZGVkJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdkdXJhdGlvbmNoYW5nZScsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXG5cblx0XHRcdC8vIGdpdmUgaW5pdGlhbCBldmVudHNcblx0XHRcdGxldCBpbml0RXZlbnRzID0gWydyZW5kZXJlcnJlYWR5JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAnY2FucGxheSddO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGluaXRFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChpbml0RXZlbnRzW2ldLCBkbSk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGV0IGRtQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZG1Db250YWluZXIuaWQgPSBkbS5pZDtcblx0XHRtZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG1Db250YWluZXIpO1xuXHRcdGlmIChtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKSB7XG5cdFx0XHRkbUNvbnRhaW5lci5zdHlsZS53aWR0aCA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUud2lkdGg7XG5cdFx0XHRkbUNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmhlaWdodDtcblx0XHR9XG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0bGV0XG5cdFx0XHR2aWRlb0lkID0gRGFpbHlNb3Rpb25BcGkuZ2V0RGFpbHlNb3Rpb25JZChtZWRpYUZpbGVzWzBdLnNyYyksXG5cdFx0XHRkbVNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0XHRcdGlkOiBkbS5pZCxcblx0XHRcdFx0Y29udGFpbmVyOiBkbUNvbnRhaW5lcixcblx0XHRcdFx0dmlkZW9JZDogdmlkZW9JZCxcblx0XHRcdFx0YXV0b3BsYXk6ICEhKG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKVxuXHRcdFx0fSwgZG0ub3B0aW9ucy5kYWlseW1vdGlvbik7XG5cblx0XHREYWlseU1vdGlvbkFwaS5lbnF1ZXVlSWZyYW1lKGRtU2V0dGluZ3MpO1xuXG5cdFx0ZG0uaGlkZSA9ICgpID0+IHtcblx0XHRcdGRtLnN0b3BJbnRlcnZhbCgpO1xuXHRcdFx0ZG0ucGF1c2UoKTtcblx0XHRcdGlmIChkbUlmcmFtZSkge1xuXHRcdFx0XHRkbUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZG0uc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmIChkbUlmcmFtZSkge1xuXHRcdFx0XHRkbUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRkbS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdGRtSWZyYW1lLndpZHRoID0gd2lkdGg7XG5cdFx0XHRkbUlmcmFtZS5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0fTtcblx0XHRkbS5kZXN0cm95ID0gKCkgPT4ge1xuXHRcdFx0ZG1QbGF5ZXIuZGVzdHJveSgpO1xuXHRcdH07XG5cdFx0ZG0uaW50ZXJ2YWwgPSBudWxsO1xuXG5cdFx0ZG0uc3RhcnRJbnRlcnZhbCA9ICgpID0+IHtcblx0XHRcdGRtLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHREYWlseU1vdGlvbkFwaS5zZW5kRXZlbnQoZG0uaWQsIGRtUGxheWVyLCAndGltZXVwZGF0ZScsIHtcblx0XHRcdFx0XHRwYXVzZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdGVuZGVkOiBmYWxzZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIDI1MCk7XG5cdFx0fTtcblx0XHRkbS5zdG9wSW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHRpZiAoZG0uaW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChkbS5pbnRlcnZhbCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBkbTtcblx0fVxufTtcblxuXG4vKlxuICogUmVnaXN0ZXIgRGFpbHlNb3Rpb24gZXZlbnQgZ2xvYmFsbHlcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gKHVybC5pbmNsdWRlcygnLy9kYWlseW1vdGlvbi5jb20nKSB8fCB1cmwuaW5jbHVkZXMoJ3d3dy5kYWlseW1vdGlvbi5jb20nKSB8fCB1cmwuaW5jbHVkZXMoJy8vZGFpLmx5JykpID8gJ3ZpZGVvL3gtZGFpbHltb3Rpb24nIDogbnVsbDtcbn0pO1xuXG53aW5kb3cuZG1Bc3luY0luaXQgPSAoKSA9PiB7XG5cdERhaWx5TW90aW9uQXBpLmFwaVJlYWR5KCk7XG59O1xuXG5yZW5kZXJlci5hZGQoRGFpbHlNb3Rpb25JZnJhbWVSZW5kZXJlcik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5pbXBvcnQge0hBU19NU0V9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cbi8qKlxuICogTmF0aXZlIE0oUEVHKS1EYXNoIHJlbmRlcmVyXG4gKlxuICogVXNlcyBkYXNoLmpzLCBhIHJlZmVyZW5jZSBjbGllbnQgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBwbGF5YmFjayBvZiBNKFBFRyktREFTSCB2aWEgSmF2YXNjcmlwdCBhbmQgY29tcGxpYW50IGJyb3dzZXJzLlxuICogSXQgcmVsaWVzIG9uIEhUTUw1IHZpZGVvIGFuZCBNZWRpYVNvdXJjZSBFeHRlbnNpb25zIGZvciBwbGF5YmFjay5cbiAqIFRoaXMgcmVuZGVyZXIgaW50ZWdyYXRlcyBuZXcgZXZlbnRzIGFzc29jaWF0ZWQgd2l0aCBtcGQgZmlsZXMuXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXNoLUluZHVzdHJ5LUZvcnVtL2Rhc2guanNcbiAqXG4gKi9cbmNvbnN0IE5hdGl2ZURhc2ggPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0Y3JlYXRpb25RdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGxvYWRpbmcgb2YgYW4gREFTSCBzb3VyY2Vcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGxvYWQgYW4gREFTSCBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdHByZXBhcmVTZXR0aW5nczogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKE5hdGl2ZURhc2guaXNMb2FkZWQpIHtcblx0XHRcdE5hdGl2ZURhc2guY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHROYXRpdmVEYXNoLmxvYWRTY3JpcHQoc2V0dGluZ3MpO1xuXHRcdFx0TmF0aXZlRGFzaC5jcmVhdGlvblF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBkYXNoLm1lZGlhcGxheWVyLmpzIHNjcmlwdCBvbiB0aGUgaGVhZGVyIG9mIHRoZSBkb2N1bWVudFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gbG9hZCBhbiBEQVNIIHBsYXllciBpbnN0YW5jZVxuXHQgKi9cblx0bG9hZFNjcmlwdDogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKCFOYXRpdmVEYXNoLmlzU2NyaXB0TG9hZGVkKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgZGFzaGpzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHROYXRpdmVEYXNoLmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0c2V0dGluZ3Mub3B0aW9ucy5wYXRoID0gdHlwZW9mIHNldHRpbmdzLm9wdGlvbnMucGF0aCA9PT0gJ3N0cmluZycgP1xuXHRcdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA6ICcvL2Nkbi5kYXNoanMub3JnL2xhdGVzdC9kYXNoLm1lZGlhcGxheWVyLm1pbi5qcyc7XG5cblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG5cdFx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG5cdFx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRcdHNjcmlwdC5zcmMgPSBzZXR0aW5ncy5vcHRpb25zLnBhdGg7XG5cblx0XHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoIWRvbmUgJiYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRcdHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCcgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSkge1xuXHRcdFx0XHRcdFx0ZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0XHROYXRpdmVEYXNoLm1lZGlhUmVhZHkoKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR9XG5cdFx0XHROYXRpdmVEYXNoLmlzU2NyaXB0TG9hZGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgREFTSCBwbGF5ZXIgY3JlYXRpb25cblx0ICpcblx0ICovXG5cdG1lZGlhUmVhZHk6ICgpID0+IHtcblxuXHRcdE5hdGl2ZURhc2guaXNMb2FkZWQgPSB0cnVlO1xuXHRcdE5hdGl2ZURhc2guaXNTY3JpcHRMb2FkZWQgPSB0cnVlO1xuXG5cdFx0d2hpbGUgKE5hdGl2ZURhc2guY3JlYXRpb25RdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBOYXRpdmVEYXNoLmNyZWF0aW9uUXVldWUucG9wKCk7XG5cdFx0XHROYXRpdmVEYXNoLmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBEQVNIIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBpbnN0YW50aWF0ZSBEQVNIIG9iamVjdFxuXHQgKi9cblx0Y3JlYXRlSW5zdGFuY2U6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0bGV0IHBsYXllciA9IGRhc2hqcy5NZWRpYVBsYXllcigpLmNyZWF0ZSgpO1xuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIHNldHRpbmdzLmlkXShwbGF5ZXIpO1xuXHR9XG59O1xuXG5sZXQgRGFzaE5hdGl2ZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAnbmF0aXZlX2Rhc2gnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICduYXRpdmVfZGFzaCcsXG5cdFx0ZGFzaDoge1xuXHRcdFx0Ly8gU3BlY2lhbCBjb25maWc6IHVzZWQgdG8gc2V0IHRoZSBsb2NhbCBwYXRoL1VSTCBvZiBkYXNoLmpzIG1lZGlhcGxheWVyIGxpYnJhcnlcblx0XHRcdHBhdGg6ICcvL2Nkbi5kYXNoanMub3JnL2xhdGVzdC9kYXNoLm1lZGlhcGxheWVyLm1pbi5qcycsXG5cdFx0XHRkZWJ1ZzogZmFsc2Vcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IEhBU19NU0UgJiYgWydhcHBsaWNhdGlvbi9kYXNoK3htbCddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdG9yaWdpbmFsTm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUsXG5cdFx0XHRpZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4LFxuXHRcdFx0ZGFzaFBsYXllcixcblx0XHRcdHN0YWNrID0ge30sXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHRub2RlID0gb3JpZ2luYWxOb2RlLmNsb25lTm9kZSh0cnVlKTtcblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBtZWRpYUVsZW1lbnQub3B0aW9ucyk7XG5cblx0XHQvLyBXUkFQUEVSUyBmb3IgUFJPUHNcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRub2RlW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiAoZGFzaFBsYXllciAhPT0gbnVsbCkgPyBub2RlW3Byb3BOYW1lXSA6IG51bGw7XG5cblx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRhc2hQbGF5ZXIgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3NyYycpIHtcblxuXHRcdFx0XHRcdFx0XHRkYXNoUGxheWVyLmF0dGFjaFNvdXJjZSh2YWx1ZSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKSB7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZS5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bm9kZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0c3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbCBtZXRob2QgdG8gcmVnaXN0ZXIgYWxsIE0tRGFzaCBldmVudHNcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBpZF0gPSAoX2Rhc2hQbGF5ZXIpID0+IHtcblxuXHRcdFx0bWVkaWFFbGVtZW50LmRhc2hQbGF5ZXIgPSBkYXNoUGxheWVyID0gX2Rhc2hQbGF5ZXI7XG5cblx0XHRcdC8vIEJ5IGRlZmF1bHQsIGNvbnNvbGUgbG9nIGlzIG9mZlxuXHRcdFx0ZGFzaFBsYXllci5nZXREZWJ1ZygpLnNldExvZ1RvQnJvd3NlckNvbnNvbGUob3B0aW9ucy5kYXNoLmRlYnVnKTtcblxuXHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0aWYgKHN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBzdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldCBwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0XHRcdG5vZGVbYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0bm9kZVtzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQlVCQkxFIEVWRU5UU1xuXHRcdFx0bGV0XG5cdFx0XHRcdGV2ZW50cyA9IG1lanMuaHRtbDVtZWRpYS5ldmVudHMsIGRhc2hFdmVudHMgPSBkYXNoanMuTWVkaWFQbGF5ZXIuZXZlbnRzLFxuXHRcdFx0XHRhc3NpZ25FdmVudHMgPSAoZXZlbnROYW1lKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZXZlbnROYW1lID09PSAnbG9hZGVkbWV0YWRhdGEnKSB7XG5cdFx0XHRcdFx0XHRkYXNoUGxheWVyLmluaXRpYWxpemUobm9kZSwgbm9kZS5zcmMsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChlLnR5cGUsIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlKTtcblx0XHRcdFx0XHRcdC8vIEB0b2RvIENoZWNrIHRoaXNcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5jb25jYXQoWydjbGljaycsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnXSk7XG5cblx0XHRcdGZvciAoaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0YXNzaWduRXZlbnRzKGV2ZW50c1tpXSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ3VzdG9tIE0oUEVHKS1EQVNIIGV2ZW50c1xuXHRcdFx0ICpcblx0XHRcdCAqIFRoZXNlIGV2ZW50cyBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIG9yaWdpbmFsIG5vZGUgdXNpbmcgYWRkRXZlbnRMaXN0ZW5lciBhbmQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LFxuXHRcdFx0ICogbm90IHVzaW5nIGRhc2hqcy5NZWRpYVBsYXllci5ldmVudHMgb2JqZWN0XG5cdFx0XHQgKiBAc2VlIGh0dHA6Ly9jZG4uZGFzaGpzLm9yZy9sYXRlc3QvanNkb2MvTWVkaWFQbGF5ZXJFdmVudHMuaHRtbFxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBhc3NpZ25NZGFzaEV2ZW50cyA9IChlKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGUudHlwZSwgbm9kZSk7XG5cdFx0XHRcdGV2ZW50LmRhdGEgPSBlO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0aWYgKGUudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnZXJyb3InKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChsZXQgZXZlbnRUeXBlIGluIGRhc2hFdmVudHMpIHtcblx0XHRcdFx0aWYgKGRhc2hFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuIFx0XHRcdFx0XHRkYXNoUGxheWVyLm9uKGRhc2hFdmVudHNbZXZlbnRUeXBlXSwgYXNzaWduTWRhc2hFdmVudHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChtZWRpYUZpbGVzICYmIG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0aWYgKHJlbmRlcmVyLnJlbmRlcmVyc1tvcHRpb25zLnByZWZpeF0uY2FuUGxheVR5cGUobWVkaWFGaWxlc1tpXS50eXBlKSkge1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGVzW2ldLnNyYyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRub2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cblx0XHRvcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgb3JpZ2luYWxOb2RlKTtcblx0XHRvcmlnaW5hbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdhdXRvcGxheScpO1xuXHRcdG9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0TmF0aXZlRGFzaC5wcmVwYXJlU2V0dGluZ3Moe1xuXHRcdFx0b3B0aW9uczogb3B0aW9ucy5kYXNoLFxuXHRcdFx0aWQ6IGlkXG5cdFx0fSk7XG5cblx0XHQvLyBIRUxQRVIgTUVUSE9EU1xuXHRcdG5vZGUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0bm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5oaWRlID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5wYXVzZSgpO1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuc2hvdyA9ICgpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdyZW5kZXJlcnJlYWR5Jywgbm9kZSk7XG5cdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgTmF0aXZlIE0oUEVHKS1EYXNoIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy5tcGQnKSA/ICdhcHBsaWNhdGlvbi9kYXNoK3htbCcgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZChEYXNoTmF0aXZlUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtpc09iamVjdEVtcHR5fSBmcm9tICcuLi91dGlscy9nZW5lcmFsJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBGYWNlYm9vayByZW5kZXJlclxuICpcbiAqIEl0IGNyZWF0ZXMgYW4gPGlmcmFtZT4gZnJvbSBhIDxkaXY+IHdpdGggc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL3BsdWdpbnMvZW1iZWRkZWQtdmlkZW8tcGxheWVyXG4gKi9cbmNvbnN0IEZhY2Vib29rUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICdmYWNlYm9vaycsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ2ZhY2Vib29rJyxcblx0XHRmYWNlYm9vazoge1xuXHRcdFx0YXBwSWQ6ICd7eW91ci1hcHAtaWR9Jyxcblx0XHRcdHhmYm1sOiB0cnVlLFxuXHRcdFx0dmVyc2lvbjogJ3YyLjYnXG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpICA9PiBbJ3ZpZGVvL2ZhY2Vib29rJywgJ3ZpZGVvL3gtZmFjZWJvb2snXS5pbmNsdWRlcyh0eXBlKSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpICA9PiB7XG5cblx0XHRsZXRcblx0XHRcdGZiV3JhcHBlciA9IHt9LFxuXHRcdFx0ZmJBcGkgPSBudWxsLFxuXHRcdFx0ZmJEaXYgPSBudWxsLFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHBhdXNlZCA9IHRydWUsXG5cdFx0XHRlbmRlZCA9IGZhbHNlLFxuXHRcdFx0aGFzU3RhcnRlZFBsYXlpbmcgPSBmYWxzZSxcblx0XHRcdHNyYyA9ICcnLFxuXHRcdFx0ZXZlbnRIYW5kbGVyID0ge30sXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBtZWRpYUVsZW1lbnQub3B0aW9ucyk7XG5cdFx0ZmJXcmFwcGVyLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdGZiV3JhcHBlci5pZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4O1xuXHRcdGZiV3JhcHBlci5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyB3cmFwcGVycyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSAgPT4ge1xuXG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdGZiV3JhcHBlcltgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGZiQXBpICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXG5cdFx0XHRcdFx0XHQvLyBmaWd1cmUgb3V0IGhvdyB0byBnZXQgeW91dHViZSBkdGEgaGVyZVxuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLmdldEN1cnJlbnRQb3NpdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2R1cmF0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmJBcGkuZ2V0RHVyYXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5nZXRWb2x1bWUoKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXVzZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZW5kZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlbmRlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLmlzTXV0ZWQoKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdidWZmZXJlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGg6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzcmM7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGZiV3JhcHBlcltgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSAgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGZiQXBpICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmM7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBPbmx5IHdheSBpcyB0byBkZXN0cm95IGluc3RhbmNlIGFuZCBhbGwgdGhlIGV2ZW50cyBmaXJlZCxcblx0XHRcdFx0XHRcdFx0XHQvLyBhbmQgY3JlYXRlIG5ldyBvbmVcblx0XHRcdFx0XHRcdFx0XHRmYkRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZiRGl2KTtcblx0XHRcdFx0XHRcdFx0XHRjcmVhdGVGYWNlYm9va0VtYmVkKHVybCwgb3B0aW9ucy5mYWNlYm9vayk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBUaGlzIG1ldGhvZCByZWxvYWRzIHZpZGVvIG9uLWRlbWFuZFxuXHRcdFx0XHRcdFx0XHRcdEZCLlhGQk1MLnBhcnNlKCk7XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuc2Vlayh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmJBcGkubXV0ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmYkFwaS51bm11dGUoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgZmJXcmFwcGVyKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRmYkFwaS5zZXRWb2x1bWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGZiV3JhcHBlcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2ZhY2Vib29rICcgKyBmYldyYXBwZXIuaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpICA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdGZiV3JhcHBlclttZXRob2ROYW1lXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmYkFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmJBcGkucGxheSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xvYWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ2NhbGwnLCBtZXRob2ROYW1lOiBtZXRob2ROYW1lfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbk1ldGhvZHMobWV0aG9kc1tpXSk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQgKiBEaXNwYXRjaCBhIGxpc3Qgb2YgZXZlbnRzXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IGV2ZW50c1xuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHNlbmRFdmVudHMgKGV2ZW50cykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gbWVqcy5VdGlscy5jcmVhdGVFdmVudChldmVudHNbaV0sIGZiV3JhcHBlcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGUgYSBuZXcgRmFjZWJvb2sgcGxheWVyIGFuZCBhdHRhY2ggYWxsIGl0cyBldmVudHNcblx0XHQgKlxuXHRcdCAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSA8ZGl2PiBlbGVtZW50IHRoYXQsIG9uY2UgdGhlIEFQSSBpcyBhdmFpbGFibGUsIHdpbGwgZ2VuZXJhdGUgYW4gPGlmcmFtZT4uXG5cdFx0ICogVmFsaWQgVVJMIGZvcm1hdChzKTpcblx0XHQgKiAgLSBodHRwczovL3d3dy5mYWNlYm9vay5jb20vam9obmR5ZXIvdmlkZW9zLzEwMTA3ODE2MjQzNjgxODg0L1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBjcmVhdGVGYWNlYm9va0VtYmVkICh1cmwsIGNvbmZpZykge1xuXG5cdFx0XHRzcmMgPSB1cmw7XG5cblx0XHRcdGZiRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRmYkRpdi5pZCA9IGZiV3JhcHBlci5pZDtcblx0XHRcdGZiRGl2LmNsYXNzTmFtZSA9IFwiZmItdmlkZW9cIjtcblx0XHRcdGZiRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiLCB1cmwpO1xuXHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKFwiZGF0YS1hbGxvd2Z1bGxzY3JlZW5cIiwgXCJ0cnVlXCIpO1xuXHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKFwiZGF0YS1jb250cm9sc1wiLCBcImZhbHNlXCIpO1xuXG5cdFx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZiRGl2LCBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdFx0Lypcblx0XHRcdCAqIFJlZ2lzdGVyIEZhY2Vib29rIEFQSSBldmVudCBnbG9iYWxseVxuXHRcdFx0ICpcblx0XHRcdCAqL1xuXHRcdFx0d2luZG93LmZiQXN5bmNJbml0ID0gKCkgPT4ge1xuXG5cdFx0XHRcdEZCLmluaXQoY29uZmlnKTtcblxuXHRcdFx0XHRGQi5FdmVudC5zdWJzY3JpYmUoJ3hmYm1sLnJlYWR5JywgKG1zZykgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKG1zZy50eXBlID09PSAndmlkZW8nKSB7XG5cblx0XHRcdFx0XHRcdGZiQXBpID0gbXNnLmluc3RhbmNlO1xuXG5cdFx0XHRcdFx0XHQvLyBTZXQgcHJvcGVyIHNpemUgc2luY2UgcGxheWVyIGRpbWVuc2lvbnMgYXJlIHVua25vd24gYmVmb3JlIHRoaXMgZXZlbnRcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRmYklmcmFtZSA9IGZiRGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpZnJhbWUnKVswXSxcblx0XHRcdFx0XHRcdFx0d2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmYklmcmFtZSwgbnVsbCkud2lkdGgpLFxuXHRcdFx0XHRcdFx0XHRoZWlnaHQgPSBwYXJzZUludChmYklmcmFtZS5zdHlsZS5oZWlnaHQpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGZiV3JhcHBlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG5cdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXG5cdFx0XHRcdFx0XHQvLyByZW1vdmUgcHJldmlvdXMgbGlzdGVuZXJzXG5cdFx0XHRcdFx0XHRsZXQgZmJFdmVudHMgPSBbJ3N0YXJ0ZWRQbGF5aW5nJywgJ3BhdXNlZCcsICdmaW5pc2hlZFBsYXlpbmcnLCAnc3RhcnRlZEJ1ZmZlcmluZycsICdmaW5pc2hlZEJ1ZmZlcmluZyddO1xuXHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBmYkV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50ID0gZmJFdmVudHNbaV0sXG5cdFx0XHRcdFx0XHRcdFx0aGFuZGxlciA9IGV2ZW50SGFuZGxlcltldmVudF1cblx0XHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdFx0XHRpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkICYmIGhhbmRsZXIgIT09IG51bGwgJiZcblx0XHRcdFx0XHRcdFx0XHQhaXNPYmplY3RFbXB0eShoYW5kbGVyKSAmJiB0eXBlb2YgaGFuZGxlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZXIucmVtb3ZlTGlzdGVuZXIoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdFx0XHRcdGlmIChhcGlTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBhcGlTdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gYXBpU3RhY2tbaV07XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gXG5cdFx0XHRcdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGZiV3JhcHBlcltgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZiV3JhcHBlcltzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3JlbmRlcmVycmVhZHknLCAncmVhZHknLCAnbG9hZGVkZGF0YScsICdjYW5wbGF5JywgJ3Byb2dyZXNzJ10pO1xuXHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ2xvYWRlZG1ldGFkYXRhJywgJ3RpbWV1cGRhdGUnLCAncHJvZ3Jlc3MnXSk7XG5cblx0XHRcdFx0XHRcdGxldCB0aW1lcjtcblxuXHRcdFx0XHRcdFx0Ly8gQ3VzdG9tIEZhY2Vib29rIGV2ZW50c1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLnN0YXJ0ZWRQbGF5aW5nID0gZmJBcGkuc3Vic2NyaWJlKCdzdGFydGVkUGxheWluZycsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKCFoYXNTdGFydGVkUGxheWluZykge1xuXHRcdFx0XHRcdFx0XHRcdGhhc1N0YXJ0ZWRQbGF5aW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3BsYXknLCAncGxheWluZycsICd0aW1ldXBkYXRlJ10pO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdvcmthcm91bmQgdG8gdXBkYXRlIHByb2dyZXNzIGJhclxuXHRcdFx0XHRcdFx0XHR0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmYkFwaS5nZXRDdXJyZW50UG9zaXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsndGltZXVwZGF0ZSddKTtcblx0XHRcdFx0XHRcdFx0fSwgMjUwKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLnBhdXNlZCA9IGZiQXBpLnN1YnNjcmliZSgncGF1c2VkJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsncGF1c2VkJ10pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRldmVudEhhbmRsZXIuZmluaXNoZWRQbGF5aW5nID0gZmJBcGkuc3Vic2NyaWJlKCdmaW5pc2hlZFBsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGVuZGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXb3JrYXJvdW5kIHRvIHVwZGF0ZSBwcm9ncmVzcyBiYXIgb25lIGxhc3QgdGltZSBhbmQgdHJpZ2dlciBlbmRlZCBldmVudFxuXHRcdFx0XHRcdFx0XHR0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmYkFwaS5nZXRDdXJyZW50UG9zaXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsndGltZXVwZGF0ZScsICdlbmRlZCddKTtcblx0XHRcdFx0XHRcdFx0fSwgMjUwKTtcblxuXHRcdFx0XHRcdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0XHRcdFx0XHRcdFx0dGltZXIgPSBudWxsO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRldmVudEhhbmRsZXIuc3RhcnRlZEJ1ZmZlcmluZyA9IGZiQXBpLnN1YnNjcmliZSgnc3RhcnRlZEJ1ZmZlcmluZycsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3Byb2dyZXNzJywgJ3RpbWV1cGRhdGUnXSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGV2ZW50SGFuZGxlci5maW5pc2hlZEJ1ZmZlcmluZyA9IGZiQXBpLnN1YnNjcmliZSgnZmluaXNoZWRCdWZmZXJpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydwcm9ncmVzcycsICd0aW1ldXBkYXRlJ10pO1xuXHRcdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHQoKChkLCBzLCBpZCkgPT4ge1xuXHRcdFx0XHRsZXQganM7XG5cdFx0XHRcdGxldCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xuXHRcdFx0XHRpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0anMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XG5cdFx0XHRcdGpzLmlkID0gaWQ7XG5cdFx0XHRcdGpzLnNyYyA9ICcvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL3Nkay5qcyc7XG5cdFx0XHRcdGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcblx0XHRcdH0pKGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xuXHRcdH1cblxuXHRcdGlmIChtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGNyZWF0ZUZhY2Vib29rRW1iZWQobWVkaWFGaWxlc1swXS5zcmMsIGZiV3JhcHBlci5vcHRpb25zLmZhY2Vib29rKTtcblx0XHR9XG5cblx0XHRmYldyYXBwZXIuaGlkZSA9ICgpID0+IHtcblx0XHRcdGZiV3JhcHBlci5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdGZiV3JhcHBlci5wYXVzZSgpO1xuXHRcdFx0aWYgKGZiRGl2KSB7XG5cdFx0XHRcdGZiRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmIChmYkRpdikge1xuXHRcdFx0XHRmYkRpdi5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRpZiAoZmJBcGkgIT09IG51bGwgJiYgIWlzTmFOKHdpZHRoKSAmJiAhaXNOYU4oaGVpZ2h0KSkge1xuXHRcdFx0XHRmYkRpdi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuXHRcdFx0XHRmYkRpdi5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuZGVzdHJveSA9ICgpID0+IHtcblx0XHR9O1xuXHRcdGZiV3JhcHBlci5pbnRlcnZhbCA9IG51bGw7XG5cblx0XHRmYldyYXBwZXIuc3RhcnRJbnRlcnZhbCA9ICgpID0+IHtcblx0XHRcdC8vIGNyZWF0ZSB0aW1lclxuXHRcdFx0ZmJXcmFwcGVyLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIGZiV3JhcHBlcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0sIDI1MCk7XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuc3RvcEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0aWYgKGZiV3JhcHBlci5pbnRlcnZhbCkge1xuXHRcdFx0XHRjbGVhckludGVydmFsKGZiV3JhcHBlci5pbnRlcnZhbCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBmYldyYXBwZXI7XG5cdH1cbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgRmFjZWJvb2sgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlXG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIHVybC5pbmNsdWRlcygnLy93d3cuZmFjZWJvb2snKSA/ICd2aWRlby94LWZhY2Vib29rJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKEZhY2Vib29rUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge05BViwgSVNfSUUsIEhBU19NU0UsIFNVUFBPUlRTX05BVElWRV9ITFN9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3R5cGVDaGVja3MsIGFic29sdXRpemVVcmx9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBTaGltIHRoYXQgZmFsbHMgYmFjayB0byBGbGFzaCBpZiBhIG1lZGlhIHR5cGUgaXMgbm90IHN1cHBvcnRlZC5cbiAqXG4gKiBBbnkgZm9ybWF0IG5vdCBzdXBwb3J0ZWQgbmF0aXZlbHksIGluY2x1ZGluZywgUlRNUCwgRkxWLCBITFMgYW5kIE0oUEVHKS1EQVNIIChpZiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgTVNFKSxcbiAqIHdpbGwgcGxheSB1c2luZyBGbGFzaC5cbiAqL1xuXG5cbi8qKlxuICogQ29yZSBkZXRlY3RvciwgcGx1Z2lucyBhcmUgYWRkZWQgYmVsb3dcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBQbHVnaW5EZXRlY3RvciA9IHtcblx0LyoqXG5cdCAqIENhY2hlZCB2ZXJzaW9uIG51bWJlcnNcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0cGx1Z2luczogW10sXG5cblx0LyoqXG5cdCAqIFRlc3QgYSBwbHVnaW4gdmVyc2lvbiBudW1iZXJcblx0ICogQHBhcmFtIHtTdHJpbmd9IHBsdWdpbiAtIEluIHRoaXMgc2NlbmFyaW8gJ2ZsYXNoJyB3aWxsIGJlIHRlc3RlZFxuXHQgKiBAcGFyYW0ge0FycmF5fSB2IC0gQW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmVyc2lvbiB1cCB0byAzIG51bWJlcnMgKG1ham9yLCBtaW5vciwgcmV2aXNpb24pXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRoYXNQbHVnaW5WZXJzaW9uOiAocGx1Z2luLCB2KSA9PiB7XG5cdFx0bGV0IHB2ID0gUGx1Z2luRGV0ZWN0b3IucGx1Z2luc1twbHVnaW5dO1xuXHRcdHZbMV0gPSB2WzFdIHx8IDA7XG5cdFx0dlsyXSA9IHZbMl0gfHwgMDtcblx0XHRyZXR1cm4gKHB2WzBdID4gdlswXSB8fCAocHZbMF0gPT09IHZbMF0gJiYgcHZbMV0gPiB2WzFdKSB8fCAocHZbMF0gPT09IHZbMF0gJiYgcHZbMV0gPT09IHZbMV0gJiYgcHZbMl0gPj0gdlsyXSkpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlY3QgcGx1Z2luIGFuZCBzdG9yZSBpdHMgdmVyc2lvbiBudW1iZXJcblx0ICpcblx0ICogQHNlZSBQbHVnaW5EZXRlY3Rvci5kZXRlY3RQbHVnaW5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBcblx0ICogQHBhcmFtIHtTdHJpbmd9IHBsdWdpbk5hbWVcblx0ICogQHBhcmFtIHtTdHJpbmd9IG1pbWVUeXBlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBhY3RpdmVYXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGF4RGV0ZWN0XG5cdCAqL1xuXHRhZGRQbHVnaW46IChwLCBwbHVnaW5OYW1lLCBtaW1lVHlwZSwgYWN0aXZlWCwgYXhEZXRlY3QpID0+IHtcblx0XHRQbHVnaW5EZXRlY3Rvci5wbHVnaW5zW3BdID0gUGx1Z2luRGV0ZWN0b3IuZGV0ZWN0UGx1Z2luKHBsdWdpbk5hbWUsIG1pbWVUeXBlLCBhY3RpdmVYLCBheERldGVjdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE9idGFpbiB2ZXJzaW9uIG51bWJlciBmcm9tIHRoZSBtaW1lLXR5cGUgKGFsbCBidXQgSUUpIG9yIEFjdGl2ZVggKElFKVxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcGx1Z2luTmFtZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbWltZVR5cGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGFjdGl2ZVhcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gYXhEZXRlY3Rcblx0ICogQHJldHVybiB7aW50W119XG5cdCAqL1xuXHRkZXRlY3RQbHVnaW46IChwbHVnaW5OYW1lLCBtaW1lVHlwZSwgYWN0aXZlWCwgYXhEZXRlY3QpID0+IHtcblxuXHRcdGxldFxuXHRcdFx0dmVyc2lvbiA9IFswLCAwLCAwXSxcblx0XHRcdGRlc2NyaXB0aW9uLFxuXHRcdFx0YXhcblx0XHQ7XG5cblx0XHQvLyBGaXJlZm94LCBXZWJraXQsIE9wZXJhXG5cdFx0aWYgKE5BVi5wbHVnaW5zICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIE5BVi5wbHVnaW5zW3BsdWdpbk5hbWVdID09PSAnb2JqZWN0Jykge1xuXHRcdFx0ZGVzY3JpcHRpb24gPSBOQVYucGx1Z2luc1twbHVnaW5OYW1lXS5kZXNjcmlwdGlvbjtcblx0XHRcdGlmIChkZXNjcmlwdGlvbiAmJiAhKHR5cGVvZiBOQVYubWltZVR5cGVzICE9PSAndW5kZWZpbmVkJyAmJiBOQVYubWltZVR5cGVzW21pbWVUeXBlXSAmJiAhTkFWLm1pbWVUeXBlc1ttaW1lVHlwZV0uZW5hYmxlZFBsdWdpbikpIHtcblx0XHRcdFx0dmVyc2lvbiA9IGRlc2NyaXB0aW9uLnJlcGxhY2UocGx1Z2luTmFtZSwgJycpLnJlcGxhY2UoL15cXHMrLywgJycpLnJlcGxhY2UoL1xcc3IvZ2ksICcuJykuc3BsaXQoJy4nKTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJzaW9uLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmVyc2lvbltpXSA9IHBhcnNlSW50KHZlcnNpb25baV0ubWF0Y2goL1xcZCsvKSwgMTApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBJbnRlcm5ldCBFeHBsb3JlciAvIEFjdGl2ZVhcblx0XHR9IGVsc2UgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF4ID0gbmV3IEFjdGl2ZVhPYmplY3QoYWN0aXZlWCk7XG5cdFx0XHRcdGlmIChheCkge1xuXHRcdFx0XHRcdHZlcnNpb24gPSBheERldGVjdChheCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB2ZXJzaW9uO1xuXHR9XG59O1xuXG4vKipcbiAqIEFkZCBGbGFzaCBkZXRlY3Rpb25cbiAqXG4gKi9cblBsdWdpbkRldGVjdG9yLmFkZFBsdWdpbignZmxhc2gnLCAnU2hvY2t3YXZlIEZsYXNoJywgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJywgJ1Nob2Nrd2F2ZUZsYXNoLlNob2Nrd2F2ZUZsYXNoJywgKGF4KSA9PiB7XG5cdC8vIGFkYXB0ZWQgZnJvbSBTV0ZPYmplY3Rcblx0bGV0IHZlcnNpb24gPSBbXSxcblx0XHRkID0gYXguR2V0VmFyaWFibGUoXCIkdmVyc2lvblwiKTtcblx0aWYgKGQpIHtcblx0XHRkID0gZC5zcGxpdChcIiBcIilbMV0uc3BsaXQoXCIsXCIpO1xuXHRcdHZlcnNpb24gPSBbcGFyc2VJbnQoZFswXSwgMTApLCBwYXJzZUludChkWzFdLCAxMCksIHBhcnNlSW50KGRbMl0sIDEwKV07XG5cdH1cblx0cmV0dXJuIHZlcnNpb247XG59KTtcblxuY29uc3QgRmxhc2hNZWRpYUVsZW1lbnRSZW5kZXJlciA9IHtcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdGxldFxuXHRcdFx0Zmxhc2ggPSB7fSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdC8vIHN0b3JlIG1haW4gdmFyaWFibGVcblx0XHRmbGFzaC5vcHRpb25zID0gb3B0aW9ucztcblx0XHRmbGFzaC5pZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIGZsYXNoLm9wdGlvbnMucHJlZml4O1xuXHRcdGZsYXNoLm1lZGlhRWxlbWVudCA9IG1lZGlhRWxlbWVudDtcblxuXHRcdC8vIGluc2VydCBkYXRhXG5cdFx0Zmxhc2guZmxhc2hTdGF0ZSA9IHt9O1xuXHRcdGZsYXNoLmZsYXNoQXBpID0gbnVsbDtcblx0XHRmbGFzaC5mbGFzaEFwaVN0YWNrID0gW107XG5cblx0XHQvLyBtZWRpYUVsZW1lbnRzIGZvciBnZXQvc2V0XG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBhZGQgdG8gZmxhc2ggc3RhdGUgdGhhdCB3ZSB3aWxsIHN0b3JlXG5cdFx0XHRcdGZsYXNoLmZsYXNoU3RhdGVbcHJvcE5hbWVdID0gbnVsbDtcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRmbGFzaFtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGZsYXNoLmZsYXNoQXBpICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaVsnZ2V0XycgKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBmbGFzaC5mbGFzaEFwaVsnZ2V0XycgKyBwcm9wTmFtZV0oKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBzcGVjaWFsIGNhc2UgZm9yIGJ1ZmZlcmVkIHRvIGNvbmZvcm0gdG8gSFRNTDUncyBuZXdlc3Rcblx0XHRcdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnYnVmZmVyZWQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmbGFzaFtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnc3JjJykge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSBhYnNvbHV0aXplVXJsKHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBzZW5kIHZhbHVlIHRvIEZsYXNoXG5cdFx0XHRcdFx0aWYgKGZsYXNoLmZsYXNoQXBpICE9PSBudWxsICYmIGZsYXNoLmZsYXNoQXBpWydzZXRfJyArIHByb3BOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRmbGFzaC5mbGFzaEFwaVsnc2V0XycgKyBwcm9wTmFtZV0odmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRmbGFzaC5mbGFzaEFwaVN0YWNrLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiAnc2V0Jyxcblx0XHRcdFx0XHRcdFx0cHJvcE5hbWU6IHByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIGFkZCBtZWRpYUVsZW1lbnRzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdGZsYXNoW21ldGhvZE5hbWVdID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGZsYXNoLmZsYXNoQXBpICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIHNlbmQgY2FsbCB1cCB0byBGbGFzaCBFeHRlcm5hbEludGVyZmFjZSBBUElcblx0XHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaVtgZmlyZV8ke21ldGhvZE5hbWV9YF0pIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRmbGFzaC5mbGFzaEFwaVtgZmlyZV8ke21ldGhvZE5hbWV9YF0oKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmbGFzaCcsICdtaXNzaW5nIG1ldGhvZCcsIG1ldGhvZE5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRmbGFzaC5mbGFzaEFwaVN0YWNrLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiAnY2FsbCcsXG5cdFx0XHRcdFx0XHRcdG1ldGhvZE5hbWU6IG1ldGhvZE5hbWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdFx0O1xuXHRcdG1ldGhvZHMucHVzaCgnc3RvcCcpO1xuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIGFkZCBhIHJlYWR5IG1ldGhvZCB0aGF0IEZsYXNoIGNhbiBjYWxsIHRvXG5cdFx0d2luZG93W2BfX3JlYWR5X18ke2ZsYXNoLmlkfWBdID0gKCkgPT4ge1xuXG5cdFx0XHRmbGFzaC5mbGFzaFJlYWR5ID0gdHJ1ZTtcblx0XHRcdGZsYXNoLmZsYXNoQXBpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYF9fJHtmbGFzaC5pZH1gKTtcblxuXHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3JlbmRlcmVycmVhZHknLCBmbGFzaCk7XG5cdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaVN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBmbGFzaC5mbGFzaEFwaVN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBmbGFzaC5mbGFzaEFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YFxuXHRcdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGZsYXNoW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdGZsYXNoW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aW5kb3dbYF9fZXZlbnRfXyR7Zmxhc2guaWR9YF0gPSAoZXZlbnROYW1lLCBtZXNzYWdlKSA9PiB7XG5cblx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGV2ZW50TmFtZSwgZmxhc2gpO1xuXHRcdFx0ZXZlbnQubWVzc2FnZSA9IG1lc3NhZ2UgfHwgJyc7XG5cblx0XHRcdC8vIHNlbmQgZXZlbnQgZnJvbSBGbGFzaCB1cCB0byB0aGUgbWVkaWFFbGVtZW50XG5cdFx0XHRmbGFzaC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0fTtcblxuXHRcdC8vIGluc2VydCBGbGFzaCBvYmplY3Rcblx0XHRmbGFzaC5mbGFzaFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuXHRcdGxldFxuXHRcdFx0YXV0b3BsYXkgPSAhIW1lZGlhRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JyksXG5cdFx0XHRmbGFzaFZhcnMgPSBbYHVpZD0ke2ZsYXNoLmlkfWAsIGBhdXRvcGxheT0ke2F1dG9wbGF5fWBdLFxuXHRcdFx0aXNWaWRlbyA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwgJiYgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd2aWRlbycsXG5cdFx0XHRmbGFzaEhlaWdodCA9IChpc1ZpZGVvKSA/IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuaGVpZ2h0IDogMSxcblx0XHRcdGZsYXNoV2lkdGggPSAoaXNWaWRlbykgPyBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLndpZHRoIDogMTtcblxuXHRcdGlmIChmbGFzaC5vcHRpb25zLmVuYWJsZVBzZXVkb1N0cmVhbWluZyA9PT0gdHJ1ZSkge1xuXHRcdFx0Zmxhc2hWYXJzLnB1c2goYHBzZXVkb3N0cmVhbXN0YXJ0PSR7Zmxhc2gub3B0aW9ucy5wc2V1ZG9TdHJlYW1pbmdTdGFydFF1ZXJ5UGFyYW19YCk7XG5cdFx0XHRmbGFzaFZhcnMucHVzaChgcHNldWRvc3RyZWFtdHlwZT0ke2ZsYXNoLm9wdGlvbnMucHNldWRvU3RyZWFtaW5nVHlwZX1gKTtcblx0XHR9XG5cblx0XHRtZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQoZmxhc2guZmxhc2hXcmFwcGVyKTtcblxuXHRcdGlmIChpc1ZpZGVvICYmIG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwpIHtcblx0XHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHR9XG5cblx0XHRsZXQgc2V0dGluZ3MgPSBbXTtcblxuXHRcdGlmIChJU19JRSkge1xuXHRcdFx0bGV0IHNwZWNpYWxJRUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Zmxhc2guZmxhc2hXcmFwcGVyLmFwcGVuZENoaWxkKHNwZWNpYWxJRUNvbnRhaW5lcik7XG5cblx0XHRcdHNldHRpbmdzID0gW1xuXHRcdFx0XHQnY2xhc3NpZD1cImNsc2lkOkQyN0NEQjZFLUFFNkQtMTFjZi05NkI4LTQ0NDU1MzU0MDAwMFwiJyxcblx0XHRcdFx0J2NvZGViYXNlPVwiLy9kb3dubG9hZC5tYWNyb21lZGlhLmNvbS9wdWIvc2hvY2t3YXZlL2NhYnMvZmxhc2gvc3dmbGFzaC5jYWJcIicsXG5cdFx0XHRcdGBpZD1cIl9fJHtmbGFzaC5pZCB9XCJgLFxuXHRcdFx0XHRgd2lkdGg9XCIke2ZsYXNoV2lkdGh9XCJgLFxuXHRcdFx0XHRgaGVpZ2h0PVwiJHtmbGFzaEhlaWdodH1cImBcblx0XHRcdF07XG5cblx0XHRcdGlmICghaXNWaWRlbykge1xuXHRcdFx0XHRzZXR0aW5ncy5wdXNoKCdzdHlsZT1cImNsaXA6IHJlY3QoMCAwIDAgMCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTtcIicpO1xuXHRcdFx0fVxuXG5cdFx0XHRzcGVjaWFsSUVDb250YWluZXIub3V0ZXJIVE1MID0gYDxvYmplY3QgJHtzZXR0aW5ncy5qb2luKCcgJyl9PmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJtb3ZpZVwiIHZhbHVlPVwiJHtmbGFzaC5vcHRpb25zLnBsdWdpblBhdGh9JHtmbGFzaC5vcHRpb25zLmZpbGVuYW1lfT94PSR7bmV3IERhdGUoKX1cIiAvPmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJmbGFzaHZhcnNcIiB2YWx1ZT1cIiR7Zmxhc2hWYXJzLmpvaW4oJyZhbXA7Jyl9XCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwicXVhbGl0eVwiIHZhbHVlPVwiaGlnaFwiIC8+YCArXG5cdFx0XHRcdGA8cGFyYW0gbmFtZT1cImJnY29sb3JcIiB2YWx1ZT1cIiMwMDAwMDBcIiAvPmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJ3bW9kZVwiIHZhbHVlPVwidHJhbnNwYXJlbnRcIiAvPmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJhbGxvd1NjcmlwdEFjY2Vzc1wiIHZhbHVlPVwiYWx3YXlzXCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwiYWxsb3dGdWxsU2NyZWVuXCIgdmFsdWU9XCJ0cnVlXCIgLz5gICtcblx0XHRcdFx0YDxkaXY+JHtpMThuLnQoJ21lanMuaW5zdGFsbC1mbGFzaCcpfTwvZGl2PmAgK1xuXHRcdFx0YDwvb2JqZWN0PmA7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRzZXR0aW5ncyA9IFtcblx0XHRcdFx0YGlkPVwiX18ke2ZsYXNoLmlkfVwiYCxcblx0XHRcdFx0YG5hbWU9XCJfXyR7Zmxhc2guaWR9XCJgLFxuXHRcdFx0XHQncGxheT1cInRydWVcIicsXG5cdFx0XHRcdCdsb29wPVwiZmFsc2VcIicsXG5cdFx0XHRcdCdxdWFsaXR5PVwiaGlnaFwiJyxcblx0XHRcdFx0J2JnY29sb3I9XCIjMDAwMDAwXCInLFxuXHRcdFx0XHQnd21vZGU9XCJ0cmFuc3BhcmVudFwiJyxcblx0XHRcdFx0J2FsbG93U2NyaXB0QWNjZXNzPVwiYWx3YXlzXCInLFxuXHRcdFx0XHQnYWxsb3dGdWxsU2NyZWVuPVwidHJ1ZVwiJyxcblx0XHRcdFx0J3R5cGU9XCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiJyxcblx0XHRcdFx0J3BsdWdpbnNwYWdlPVwiLy93d3cubWFjcm9tZWRpYS5jb20vZ28vZ2V0Zmxhc2hwbGF5ZXJcIicsXG5cdFx0XHRcdGBzcmM9XCIke2ZsYXNoLm9wdGlvbnMucGx1Z2luUGF0aH0ke2ZsYXNoLm9wdGlvbnMuZmlsZW5hbWV9XCJgLFxuXHRcdFx0XHRgZmxhc2h2YXJzPVwiJHtmbGFzaFZhcnMuam9pbignJicpfVwiYCxcblx0XHRcdFx0YHdpZHRoPVwiJHtmbGFzaFdpZHRofVwiYCxcblx0XHRcdFx0YGhlaWdodD1cIiR7Zmxhc2hIZWlnaHR9XCJgXG5cdFx0XHRdO1xuXG5cdFx0XHRpZiAoIWlzVmlkZW8pIHtcblx0XHRcdFx0c2V0dGluZ3MucHVzaCgnc3R5bGU9XCJjbGlwOiByZWN0KDAgMCAwIDApOyBwb3NpdGlvbjogYWJzb2x1dGU7XCInKTtcblx0XHRcdH1cblxuXHRcdFx0Zmxhc2guZmxhc2hXcmFwcGVyLmlubmVySFRNTCA9IGA8ZW1iZWQgJHtzZXR0aW5ncy5qb2luKCcgJyl9PmA7XG5cdFx0fVxuXG5cdFx0Zmxhc2guZmxhc2hOb2RlID0gZmxhc2guZmxhc2hXcmFwcGVyLmxhc3RDaGlsZDtcblxuXHRcdGZsYXNoLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRpZiAoaXNWaWRlbykge1xuXHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUud2lkdGggPSAnMXB4Jztcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5jbGlwID0gJ3JlY3QoMCAwIDAgMCk7Jztcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmbGFzaC5zaG93ID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzVmlkZW8pIHtcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLnBvc2l0aW9uID0gJyc7XG5cdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS53aWR0aCA9ICcnO1xuXHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLmNsaXAgPSAnJztcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRmbGFzaC5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRpZiAoZmxhc2guZmxhc2hBcGkgIT09IG51bGwpIHtcblx0XHRcdFx0Zmxhc2guZmxhc2hBcGkuZmlyZV9zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblxuXHRcdGlmIChtZWRpYUZpbGVzICYmIG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0aWYgKHJlbmRlcmVyLnJlbmRlcmVyc1tvcHRpb25zLnByZWZpeF0uY2FuUGxheVR5cGUobWVkaWFGaWxlc1tpXS50eXBlKSkge1xuXHRcdFx0XHRcdGZsYXNoLnNldFNyYyhtZWRpYUZpbGVzW2ldLnNyYyk7XG5cdFx0XHRcdFx0Zmxhc2gubG9hZCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZsYXNoO1xuXHR9XG59O1xuXG5jb25zdCBoYXNGbGFzaCA9IFBsdWdpbkRldGVjdG9yLmhhc1BsdWdpblZlcnNpb24oJ2ZsYXNoJywgWzEwLCAwLCAwXSk7XG5cbmlmIChoYXNGbGFzaCkge1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBtZWRpYSB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmUgaWYgRmxhc2ggaXMgZGV0ZWN0ZWRcblx0ICpcblx0ICovXG5cdHR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cblx0XHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmICh1cmwuc3RhcnRzV2l0aCgncnRtcCcpKSB7XG5cdFx0XHRpZiAodXJsLmluY2x1ZGVzKCcubXAzJykpIHtcblx0XHRcdFx0cmV0dXJuICdhdWRpby9ydG1wJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAndmlkZW8vcnRtcCc7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh1cmwuaW5jbHVkZXMoJy5vZ2EnKSB8fCB1cmwuaW5jbHVkZXMoJy5vZ2cnKSkge1xuXHRcdFx0cmV0dXJuICdhdWRpby9vZ2cnO1xuXHRcdH0gZWxzZSBpZiAoIUhBU19NU0UgJiYgIVNVUFBPUlRTX05BVElWRV9ITFMgJiYgdXJsLmluY2x1ZGVzKCcubTN1OCcpKSB7XG5cdFx0XHRyZXR1cm4gJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTCc7XG5cdFx0fSBlbHNlIGlmICghSEFTX01TRSAmJiB1cmwuaW5jbHVkZXMoJy5tcGQnKSkge1xuXHRcdFx0cmV0dXJuICdhcHBsaWNhdGlvbi9kYXNoK3htbCc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVklERU9cblx0Y29uc3QgRmxhc2hNZWRpYUVsZW1lbnRWaWRlb1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF92aWRlbycsXG5cblx0XHRvcHRpb25zOiB7XG5cdFx0XHRwcmVmaXg6ICdmbGFzaF92aWRlbycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC12aWRlby5zd2YnLFxuXHRcdFx0ZW5hYmxlUHNldWRvU3RyZWFtaW5nOiBmYWxzZSxcblx0XHRcdC8vIHN0YXJ0IHF1ZXJ5IHBhcmFtZXRlciBzZW50IHRvIHNlcnZlciBmb3IgcHNldWRvLXN0cmVhbWluZ1xuXHRcdFx0cHNldWRvU3RyZWFtaW5nU3RhcnRRdWVyeVBhcmFtOiAnc3RhcnQnLFxuXHRcdFx0Ly8gcHNldWRvIHN0cmVhbWluZyB0eXBlOiB1c2UgYHRpbWVgIGZvciB0aW1lIGJhc2VkIHNlZWtpbmcgKE1QNCkgb3IgYGJ5dGVgIGZvciBmaWxlIGJ5dGUgcG9zaXRpb24gKEZMVilcblx0XHRcdHBzZXVkb1N0cmVhbWluZ1R5cGU6ICdieXRlJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gaGFzRmxhc2ggJiYgWyd2aWRlby9tcDQnLCAndmlkZW8vZmx2JywgJ3ZpZGVvL3J0bXAnLCAnYXVkaW8vcnRtcCcsICdydG1wL21wNCcsICdhdWRpby9tcDQnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHRcdGNyZWF0ZTogRmxhc2hNZWRpYUVsZW1lbnRSZW5kZXJlci5jcmVhdGVcblxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRWaWRlb1JlbmRlcmVyKTtcblxuXHQvLyBITFNcblx0Y29uc3QgRmxhc2hNZWRpYUVsZW1lbnRIbHNWaWRlb1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF9obHMnLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfaGxzJyxcblx0XHRcdGZpbGVuYW1lOiAnbWVkaWFlbGVtZW50LWZsYXNoLXZpZGVvLWhscy5zd2YnXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiAhSEFTX01TRSAmJiBoYXNGbGFzaCAmJiBbJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCcsICd2bmQuYXBwbGUubXBlZ3VybCcsICdhdWRpby9tcGVndXJsJywgJ2F1ZGlvL2hscycsXG5cdFx0XHQndmlkZW8vaGxzJ10uaW5jbHVkZXModHlwZS50b0xvd2VyQ2FzZSgpKSxcblxuXHRcdGNyZWF0ZTogRmxhc2hNZWRpYUVsZW1lbnRSZW5kZXJlci5jcmVhdGVcblx0fTtcblx0cmVuZGVyZXIuYWRkKEZsYXNoTWVkaWFFbGVtZW50SGxzVmlkZW9SZW5kZXJlcik7XG5cblx0Ly8gTShQRUcpLURBU0hcblx0Y29uc3QgRmxhc2hNZWRpYUVsZW1lbnRNZGFzaFZpZGVvUmVuZGVyZXIgPSB7XG5cdFx0bmFtZTogJ2ZsYXNoX2Rhc2gnLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfZGFzaCcsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC12aWRlby1tZGFzaC5zd2YnXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiAhSEFTX01TRSAmJiBoYXNGbGFzaCAmJiBbJ2FwcGxpY2F0aW9uL2Rhc2greG1sJ10uaW5jbHVkZXModHlwZSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cdH07XG5cdHJlbmRlcmVyLmFkZChGbGFzaE1lZGlhRWxlbWVudE1kYXNoVmlkZW9SZW5kZXJlcik7XG5cblx0Ly8gQVVESU9cblx0Y29uc3QgRmxhc2hNZWRpYUVsZW1lbnRBdWRpb1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF9hdWRpbycsXG5cblx0XHRvcHRpb25zOiB7XG5cdFx0XHRwcmVmaXg6ICdmbGFzaF9hdWRpbycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC1hdWRpby5zd2YnXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBoYXNGbGFzaCAmJiBbJ2F1ZGlvL21wMyddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdFx0Y3JlYXRlOiBGbGFzaE1lZGlhRWxlbWVudFJlbmRlcmVyLmNyZWF0ZVxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRBdWRpb1JlbmRlcmVyKTtcblxuXHQvLyBBVURJTyAtIG9nZ1xuXHRsZXQgRmxhc2hNZWRpYUVsZW1lbnRBdWRpb09nZ1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF9hdWRpb19vZ2cnLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfYXVkaW9fb2dnJyxcblx0XHRcdGZpbGVuYW1lOiAnbWVkaWFlbGVtZW50LWZsYXNoLWF1ZGlvLW9nZy5zd2YnXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBoYXNGbGFzaCAmJiBbJ2F1ZGlvL29nZycsICdhdWRpby9vZ2EnLCAnYXVkaW8vb2d2J10uaW5jbHVkZXModHlwZSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cdH07XG5cdHJlbmRlcmVyLmFkZChGbGFzaE1lZGlhRWxlbWVudEF1ZGlvT2dnUmVuZGVyZXIpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7SEFTX01TRX0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIE5hdGl2ZSBGTFYgcmVuZGVyZXJcbiAqXG4gKiBVc2VzIGZsdi5qcywgd2hpY2ggaXMgYSBKYXZhU2NyaXB0IGxpYnJhcnkgd2hpY2ggaW1wbGVtZW50cyBtZWNoYW5pc21zIHRvIHBsYXkgZmx2IGZpbGVzIGluc3BpcmVkIGJ5IGZsdi5qcy5cbiAqIEl0IHJlbGllcyBvbiBIVE1MNSB2aWRlbyBhbmQgTWVkaWFTb3VyY2UgRXh0ZW5zaW9ucyBmb3IgcGxheWJhY2suXG4gKiBDdXJyZW50bHksIGl0IGNhbiBvbmx5IHBsYXkgZmlsZXMgd2l0aCB0aGUgc2FtZSBvcmlnaW4uXG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vQmlsaWJpbGkvZmx2LmpzXG4gKlxuICovXG5jb25zdCBOYXRpdmVGbHYgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNNZWRpYUxvYWRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRjcmVhdGlvblF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgbG9hZGluZyBvZiBhbiBGTFYgc291cmNlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEZMViBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdHByZXBhcmVTZXR0aW5nczogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKE5hdGl2ZUZsdi5pc0xvYWRlZCkge1xuXHRcdFx0TmF0aXZlRmx2LmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TmF0aXZlRmx2LmxvYWRTY3JpcHQoc2V0dGluZ3MpO1xuXHRcdFx0TmF0aXZlRmx2LmNyZWF0aW9uUXVldWUucHVzaChzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIGZsdi5qcyBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGxvYWQgYW4gRkxWIHBsYXllciBpbnN0YW5jZVxuXHQgKi9cblx0bG9hZFNjcmlwdDogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKCFOYXRpdmVGbHYuaXNNZWRpYVN0YXJ0ZWQpIHtcblxuXHRcdFx0aWYgKHR5cGVvZiBmbHZqcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0TmF0aXZlRmx2LmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0c2V0dGluZ3Mub3B0aW9ucy5wYXRoID0gdHlwZW9mIHNldHRpbmdzLm9wdGlvbnMucGF0aCA9PT0gJ3N0cmluZycgP1xuXHRcdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA6ICcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mbHYuanMvMS4xLjAvZmx2Lm1pbi5qcyc7XG5cblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG5cdFx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG5cdFx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRcdHNjcmlwdC5zcmMgPSBzZXR0aW5ncy5vcHRpb25zLnBhdGg7XG5cblx0XHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoIWRvbmUgJiYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRcdHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCcgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSkge1xuXHRcdFx0XHRcdFx0ZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0XHROYXRpdmVGbHYubWVkaWFSZWFkeSgpO1xuXHRcdFx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIGZpcnN0U2NyaXB0VGFnKTtcblx0XHRcdH1cblx0XHRcdE5hdGl2ZUZsdi5pc01lZGlhU3RhcnRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIEZMViBwbGF5ZXIgY3JlYXRpb25cblx0ICpcblx0ICovXG5cdG1lZGlhUmVhZHk6ICgpID0+IHtcblx0XHROYXRpdmVGbHYuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdE5hdGl2ZUZsdi5pc01lZGlhTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChOYXRpdmVGbHYuY3JlYXRpb25RdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBOYXRpdmVGbHYuY3JlYXRpb25RdWV1ZS5wb3AoKTtcblx0XHRcdE5hdGl2ZUZsdi5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgRkxWIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBpbnN0YW50aWF0ZSBGTFYgb2JqZWN0XG5cdCAqL1xuXHRjcmVhdGVJbnN0YW5jZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0bGV0IHBsYXllciA9IGZsdmpzLmNyZWF0ZVBsYXllcihzZXR0aW5ncy5vcHRpb25zKTtcblx0XHR3aW5kb3dbYF9fcmVhZHlfXyR7c2V0dGluZ3MuaWR9YF0ocGxheWVyKTtcblx0fVxufTtcblxuY29uc3QgRmx2TmF0aXZlUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICduYXRpdmVfZmx2JyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnbmF0aXZlX2ZsdicsXG5cdFx0LyoqXG5cdFx0ICogQ3VzdG9tIGNvbmZpZ3VyYXRpb24gZm9yIEZMViBwbGF5ZXJcblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0JpbGliaWxpL2Zsdi5qcy9ibG9iL21hc3Rlci9kb2NzL2FwaS5tZCNjb25maWdcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGZsdjoge1xuXHRcdFx0Ly8gU3BlY2lhbCBjb25maWc6IHVzZWQgdG8gc2V0IHRoZSBsb2NhbCBwYXRoL1VSTCBvZiBmbHYuanMgbGlicmFyeVxuXHRcdFx0cGF0aDogJy8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2Zsdi5qcy8xLjEuMC9mbHYubWluLmpzJyxcblx0XHRcdGNvcnM6IHRydWUsXG5cdFx0XHRlbmFibGVXb3JrZXI6IGZhbHNlLFxuXHRcdFx0ZW5hYmxlU3Rhc2hCdWZmZXI6IHRydWUsXG5cdFx0XHRzdGFzaEluaXRpYWxTaXplOiB1bmRlZmluZWQsXG5cdFx0XHRpc0xpdmU6IGZhbHNlLFxuXHRcdFx0bGF6eUxvYWQ6IHRydWUsXG5cdFx0XHRsYXp5TG9hZE1heER1cmF0aW9uOiAzICogNjAsXG5cdFx0XHRkZWZlckxvYWRBZnRlclNvdXJjZU9wZW46IHRydWUsXG5cdFx0XHRzdGF0aXN0aWNzSW5mb1JlcG9ydEludGVydmFsOiA2MDAsXG5cdFx0XHRhY2N1cmF0ZVNlZWs6IGZhbHNlLFxuXHRcdFx0c2Vla1R5cGU6ICdyYW5nZScsICAvLyBbcmFuZ2UsIHBhcmFtLCBjdXN0b21dXG5cdFx0XHRzZWVrUGFyYW1TdGFydDogJ2JzdGFydCcsXG5cdFx0XHRzZWVrUGFyYW1FbmQ6ICdiZW5kJyxcblx0XHRcdHJhbmdlTG9hZFplcm9TdGFydDogZmFsc2UsXG5cdFx0XHRjdXN0b21TZWVrSGFuZGxlcjogdW5kZWZpbmVkXG5cdFx0fVxuXHR9LFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBIQVNfTVNFICYmIFsndmlkZW8veC1mbHYnLCAndmlkZW8vZmx2J10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdG5vZGUgPSBudWxsLFxuXHRcdFx0b3JpZ2luYWxOb2RlID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSxcblx0XHRcdGlkID0gYCR7bWVkaWFFbGVtZW50LmlkfV8ke29wdGlvbnMucHJlZml4fWAsXG5cdFx0XHRmbHZQbGF5ZXIsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0bm9kZSA9IG9yaWdpbmFsTm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0bm9kZVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4gZmx2UGxheWVyICE9PSBudWxsID8gIG5vZGVbcHJvcE5hbWVdIDogbnVsbDtcblxuXHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRpZiAoZmx2UGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRub2RlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0XHRpZiAocHJvcE5hbWUgPT09ICdzcmMnKSB7XG5cdFx0XHRcdFx0XHRcdGZsdlBsYXllci5kZXRhY2hNZWRpYUVsZW1lbnQoKTtcblx0XHRcdFx0XHRcdFx0Zmx2UGxheWVyLmF0dGFjaE1lZGlhRWxlbWVudChub2RlKTtcblx0XHRcdFx0XHRcdFx0Zmx2UGxheWVyLmxvYWQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0c3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbCBtZXRob2QgdG8gcmVnaXN0ZXIgYWxsIEZMViBldmVudHNcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBpZF0gPSAoX2ZsdlBsYXllcikgPT4ge1xuXG5cdFx0XHRtZWRpYUVsZW1lbnQuZmx2UGxheWVyID0gZmx2UGxheWVyID0gX2ZsdlBsYXllcjtcblxuXHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0aWYgKHN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBzdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdG5vZGVbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJVQkJMRSBFVkVOVFNcblx0XHRcdGxldFxuXHRcdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLFxuXHRcdFx0XHRhc3NpZ25FdmVudHMgPSAoZXZlbnROYW1lKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZXZlbnROYW1lID09PSAnbG9hZGVkbWV0YWRhdGEnKSB7XG5cblx0XHRcdFx0XHRcdGZsdlBsYXllci5kZXRhY2hNZWRpYUVsZW1lbnQoKTtcblx0XHRcdFx0XHRcdGZsdlBsYXllci5hdHRhY2hNZWRpYUVsZW1lbnQobm9kZSk7XG5cdFx0XHRcdFx0XHRmbHZQbGF5ZXIubG9hZCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KGUudHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUpO1xuXHRcdFx0XHRcdFx0Ly8gZXZlbnQuc3JjRWxlbWVudCA9IGUuc3JjRWxlbWVudDtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnRhcmdldCA9IGUuc3JjRWxlbWVudDtcblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5jb25jYXQoWydjbGljaycsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnXSk7XG5cblx0XHRcdGZvciAoaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0YXNzaWduRXZlbnRzKGV2ZW50c1tpXSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChtZWRpYUZpbGVzICYmIG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0aWYgKHJlbmRlcmVyLnJlbmRlcmVyc1tvcHRpb25zLnByZWZpeF0uY2FuUGxheVR5cGUobWVkaWFGaWxlc1tpXS50eXBlKSkge1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGVzW2ldLnNyYyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRub2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cblx0XHRvcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgb3JpZ2luYWxOb2RlKTtcblx0XHRvcmlnaW5hbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdhdXRvcGxheScpO1xuXHRcdG9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0Ly8gT3B0aW9ucyB0aGF0IGNhbm5vdCBiZSBvdmVycmlkZGVuXG5cdFx0b3B0aW9ucy5mbHYudHlwZSA9ICdmbHYnO1xuXHRcdG9wdGlvbnMuZmx2LnVybCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuXHRcdE5hdGl2ZUZsdi5wcmVwYXJlU2V0dGluZ3Moe1xuXHRcdFx0b3B0aW9uczogb3B0aW9ucy5mbHYsXG5cdFx0XHRpZDogaWRcblx0XHR9KTtcblxuXHRcdC8vIEhFTFBFUiBNRVRIT0RTXG5cdFx0bm9kZS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5oaWRlID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5wYXVzZSgpO1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuc2hvdyA9ICgpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdGZsdlBsYXllci5kZXN0cm95KCk7XG5cdFx0fTtcblxuXHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdyZW5kZXJlcnJlYWR5Jywgbm9kZSk7XG5cdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgTmF0aXZlIEZMViB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gdXJsLmluY2x1ZGVzKCcuZmx2JykgPyAndmlkZW8vZmx2JyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKEZsdk5hdGl2ZVJlbmRlcmVyKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7SEFTX01TRX0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIE5hdGl2ZSBITFMgcmVuZGVyZXJcbiAqXG4gKiBVc2VzIERhaWx5TW90aW9uJ3MgaGxzLmpzLCB3aGljaCBpcyBhIEphdmFTY3JpcHQgbGlicmFyeSB3aGljaCBpbXBsZW1lbnRzIGFuIEhUVFAgTGl2ZSBTdHJlYW1pbmcgY2xpZW50LlxuICogSXQgcmVsaWVzIG9uIEhUTUw1IHZpZGVvIGFuZCBNZWRpYVNvdXJjZSBFeHRlbnNpb25zIGZvciBwbGF5YmFjay5cbiAqIFRoaXMgcmVuZGVyZXIgaW50ZWdyYXRlcyBuZXcgZXZlbnRzIGFzc29jaWF0ZWQgd2l0aCBtM3U4IGZpbGVzIHRoZSBzYW1lIHdheSBGbGFzaCB2ZXJzaW9uIG9mIEhscyBkb2VzLlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGFpbHltb3Rpb24vaGxzLmpzXG4gKlxuICovXG5jb25zdCBOYXRpdmVIbHMgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNNZWRpYUxvYWRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRjcmVhdGlvblF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgbG9hZGluZyBvZiBhbiBITFMgc291cmNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEhMUyBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdHByZXBhcmVTZXR0aW5nczogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKE5hdGl2ZUhscy5pc0xvYWRlZCkge1xuXHRcdFx0TmF0aXZlSGxzLmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TmF0aXZlSGxzLmxvYWRTY3JpcHQoc2V0dGluZ3MpO1xuXHRcdFx0TmF0aXZlSGxzLmNyZWF0aW9uUXVldWUucHVzaChzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIGhscy5qcyBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGxvYWQgYW4gSExTIHBsYXllciBpbnN0YW5jZVxuXHQgKi9cblx0bG9hZFNjcmlwdDogKHNldHRpbmdzKSA9PiB7XG5cdFx0aWYgKCFOYXRpdmVIbHMuaXNNZWRpYVN0YXJ0ZWQpIHtcblxuXHRcdFx0aWYgKHR5cGVvZiBIbHMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA9IHR5cGVvZiBzZXR0aW5ncy5vcHRpb25zLnBhdGggPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggOiAnLy9jZG4uanNkZWxpdnIubmV0L2hscy5qcy9sYXRlc3QvaGxzLm1pbi5qcyc7XG5cblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG5cdFx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG5cdFx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRcdHNjcmlwdC5zcmMgPSBzZXR0aW5ncy5vcHRpb25zLnBhdGg7XG5cblx0XHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZiAoIWRvbmUgJiYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0XHRcdHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCcgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSkge1xuXHRcdFx0XHRcdFx0ZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0XHROYXRpdmVIbHMubWVkaWFSZWFkeSgpO1xuXHRcdFx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIGZpcnN0U2NyaXB0VGFnKTtcblx0XHRcdH1cblx0XHRcdE5hdGl2ZUhscy5pc01lZGlhU3RhcnRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIEhMUyBwbGF5ZXIgY3JlYXRpb25cblx0ICpcblx0ICovXG5cdG1lZGlhUmVhZHk6ICgpID0+IHtcblx0XHROYXRpdmVIbHMuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdE5hdGl2ZUhscy5pc01lZGlhTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChOYXRpdmVIbHMuY3JlYXRpb25RdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBOYXRpdmVIbHMuY3JlYXRpb25RdWV1ZS5wb3AoKTtcblx0XHRcdE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgSExTIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBpbnN0YW50aWF0ZSBITFMgb2JqZWN0XG5cdCAqIEByZXR1cm4ge0hsc31cblx0ICovXG5cdGNyZWF0ZUluc3RhbmNlOiAoc2V0dGluZ3MpID0+IHtcblx0XHRsZXQgcGxheWVyID0gbmV3IEhscyhzZXR0aW5ncy5vcHRpb25zKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0XHRyZXR1cm4gcGxheWVyO1xuXHR9XG59O1xuXG5jb25zdCBIbHNOYXRpdmVSZW5kZXJlciA9IHtcblx0bmFtZTogJ25hdGl2ZV9obHMnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICduYXRpdmVfaGxzJyxcblx0XHQvKipcblx0XHQgKiBDdXN0b20gY29uZmlndXJhdGlvbiBmb3IgSExTIHBsYXllclxuXHRcdCAqXG5cdFx0ICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGFpbHltb3Rpb24vaGxzLmpzL2Jsb2IvbWFzdGVyL0FQSS5tZCN1c2VyLWNvbnRlbnQtZmluZS10dW5pbmdcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGhsczoge1xuXHRcdFx0Ly8gU3BlY2lhbCBjb25maWc6IHVzZWQgdG8gc2V0IHRoZSBsb2NhbCBwYXRoL1VSTCBvZiBobHMuanMgbGlicmFyeVxuXHRcdFx0cGF0aDogJy8vY2RuLmpzZGVsaXZyLm5ldC9obHMuanMvbGF0ZXN0L2hscy5taW4uanMnLFxuXHRcdFx0YXV0b1N0YXJ0TG9hZDogdHJ1ZSxcblx0XHRcdHN0YXJ0UG9zaXRpb246IC0xLFxuXHRcdFx0Y2FwTGV2ZWxUb1BsYXllclNpemU6IGZhbHNlLFxuXHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0bWF4QnVmZmVyTGVuZ3RoOiAzMCxcblx0XHRcdG1heE1heEJ1ZmZlckxlbmd0aDogNjAwLFxuXHRcdFx0bWF4QnVmZmVyU2l6ZTogNjAgKiAxMDAwICogMTAwMCxcblx0XHRcdG1heEJ1ZmZlckhvbGU6IDAuNSxcblx0XHRcdG1heFNlZWtIb2xlOiAyLFxuXHRcdFx0c2Vla0hvbGVOdWRnZUR1cmF0aW9uOiAwLjAxLFxuXHRcdFx0bWF4RnJhZ0xvb2tVcFRvbGVyYW5jZTogMC4yLFxuXHRcdFx0bGl2ZVN5bmNEdXJhdGlvbkNvdW50OiAzLFxuXHRcdFx0bGl2ZU1heExhdGVuY3lEdXJhdGlvbkNvdW50OiAxMCxcblx0XHRcdGVuYWJsZVdvcmtlcjogdHJ1ZSxcblx0XHRcdGVuYWJsZVNvZnR3YXJlQUVTOiB0cnVlLFxuXHRcdFx0bWFuaWZlc3RMb2FkaW5nVGltZU91dDogMTAwMDAsXG5cdFx0XHRtYW5pZmVzdExvYWRpbmdNYXhSZXRyeTogNixcblx0XHRcdG1hbmlmZXN0TG9hZGluZ1JldHJ5RGVsYXk6IDUwMCxcblx0XHRcdG1hbmlmZXN0TG9hZGluZ01heFJldHJ5VGltZW91dDogNjQwMDAsXG5cdFx0XHRsZXZlbExvYWRpbmdUaW1lT3V0OiAxMDAwMCxcblx0XHRcdGxldmVsTG9hZGluZ01heFJldHJ5OiA2LFxuXHRcdFx0bGV2ZWxMb2FkaW5nUmV0cnlEZWxheTogNTAwLFxuXHRcdFx0bGV2ZWxMb2FkaW5nTWF4UmV0cnlUaW1lb3V0OiA2NDAwMCxcblx0XHRcdGZyYWdMb2FkaW5nVGltZU91dDogMjAwMDAsXG5cdFx0XHRmcmFnTG9hZGluZ01heFJldHJ5OiA2LFxuXHRcdFx0ZnJhZ0xvYWRpbmdSZXRyeURlbGF5OiA1MDAsXG5cdFx0XHRmcmFnTG9hZGluZ01heFJldHJ5VGltZW91dDogNjQwMDAsXG5cdFx0XHRzdGFydEZyYWdQcmVmZWNoOiBmYWxzZSxcblx0XHRcdGFwcGVuZEVycm9yTWF4UmV0cnk6IDMsXG5cdFx0XHRlbmFibGVDRUE3MDhDYXB0aW9uczogdHJ1ZSxcblx0XHRcdHN0cmV0Y2hTaG9ydFZpZGVvVHJhY2s6IHRydWUsXG5cdFx0XHRmb3JjZUtleUZyYW1lT25EaXNjb250aW51aXR5OiB0cnVlLFxuXHRcdFx0YWJyRXdtYUZhc3RMaXZlOiA1LjAsXG5cdFx0XHRhYnJFd21hU2xvd0xpdmU6IDkuMCxcblx0XHRcdGFickV3bWFGYXN0Vm9EOiA0LjAsXG5cdFx0XHRhYnJFd21hU2xvd1ZvRDogMTUuMCxcblx0XHRcdGFickV3bWFEZWZhdWx0RXN0aW1hdGU6IDUwMDAwMCxcblx0XHRcdGFickJhbmRXaWR0aEZhY3RvcjogMC44LFxuXHRcdFx0YWJyQmFuZFdpZHRoVXBGYWN0b3I6IDAuN1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gSEFTX01TRSAmJiBbJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCcsICd2bmQuYXBwbGUubXBlZ3VybCcsICdhdWRpby9tcGVndXJsJywgJ2F1ZGlvL2hscycsXG5cdFx0J3ZpZGVvL2hscyddLmluY2x1ZGVzKHR5cGUudG9Mb3dlckNhc2UoKSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdG5vZGUgPSBudWxsLFxuXHRcdFx0b3JpZ2luYWxOb2RlID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSxcblx0XHRcdGlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXgsXG5cdFx0XHRobHNQbGF5ZXIsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0bm9kZSA9IG9yaWdpbmFsTm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0bm9kZVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4gaGxzUGxheWVyICE9PSBudWxsID8gIG5vZGVbcHJvcE5hbWVdIDogbnVsbDtcblxuXHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRpZiAoaGxzUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRub2RlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0XHRpZiAocHJvcE5hbWUgPT09ICdzcmMnKSB7XG5cblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLmRlc3Ryb3koKTtcblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyID0gTmF0aXZlSGxzLmNyZWF0ZUluc3RhbmNlKHtcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRpb25zLmhscyxcblx0XHRcdFx0XHRcdFx0XHRpZDogaWRcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLmF0dGFjaE1lZGlhKG5vZGUpO1xuXHRcdFx0XHRcdFx0XHRobHNQbGF5ZXIub24oSGxzLkV2ZW50cy5NRURJQV9BVFRBQ0hFRCwgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGhsc1BsYXllci5sb2FkU291cmNlKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBITFMgZXZlbnRzXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgaWRdID0gKF9obHNQbGF5ZXIpID0+IHtcblxuXHRcdFx0bWVkaWFFbGVtZW50Lmhsc1BsYXllciA9IGhsc1BsYXllciA9IF9obHNQbGF5ZXI7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChzdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBzdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gc3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdG5vZGVbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJVQkJMRSBFVkVOVFNcblx0XHRcdGxldFxuXHRcdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLCBobHNFdmVudHMgPSBIbHMuRXZlbnRzLFxuXHRcdFx0XHRhc3NpZ25FdmVudHMgPSAoZXZlbnROYW1lKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZXZlbnROYW1lID09PSAnbG9hZGVkbWV0YWRhdGEnKSB7XG5cblx0XHRcdFx0XHRcdGhsc1BsYXllci5kZXRhY2hNZWRpYSgpO1xuXG5cdFx0XHRcdFx0XHRsZXQgdXJsID0gbm9kZS5zcmM7XG5cblx0XHRcdFx0XHRcdGhsc1BsYXllci5hdHRhY2hNZWRpYShub2RlKTtcblx0XHRcdFx0XHRcdGhsc1BsYXllci5vbihobHNFdmVudHMuTUVESUFfQVRUQUNIRUQsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLmxvYWRTb3VyY2UodXJsKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBjb3B5IGV2ZW50XG5cdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KGUudHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUpO1xuXHRcdFx0XHRcdFx0Ly8gZXZlbnQuc3JjRWxlbWVudCA9IGUuc3JjRWxlbWVudDtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnRhcmdldCA9IGUuc3JjRWxlbWVudDtcblxuXHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblx0XHRcdDtcblxuXHRcdFx0ZXZlbnRzID0gZXZlbnRzLmNvbmNhdChbJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRhc3NpZ25FdmVudHMoZXZlbnRzW2ldKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDdXN0b20gSExTIGV2ZW50c1xuXHRcdFx0ICpcblx0XHRcdCAqIFRoZXNlIGV2ZW50cyBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIG9yaWdpbmFsIG5vZGUgdXNpbmcgYWRkRXZlbnRMaXN0ZW5lciBhbmQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LFxuXHRcdFx0ICogbm90IHVzaW5nIEhscy5FdmVudHMgb2JqZWN0XG5cdFx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYWlseW1vdGlvbi9obHMuanMvYmxvYi9tYXN0ZXIvc3JjL2V2ZW50cy5qc1xuXHRcdFx0ICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGFpbHltb3Rpb24vaGxzLmpzL2Jsb2IvbWFzdGVyL3NyYy9lcnJvcnMuanNcblx0XHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9BUEkubWQjcnVudGltZS1ldmVudHNcblx0XHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9BUEkubWQjZXJyb3JzXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IGFzc2lnbkhsc0V2ZW50cyA9IGZ1bmN0aW9uIChlLCBkYXRhKSB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGUsIG5vZGUpO1xuXHRcdFx0XHRldmVudC5kYXRhID0gZGF0YTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdGlmIChlID09PSAnaGxzRXJyb3InKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlLCBkYXRhKTtcblxuXHRcdFx0XHRcdC8vIGJvcnJvd2VkIGZyb20gaHR0cDovL2RhaWx5bW90aW9uLmdpdGh1Yi5pby9obHMuanMvZGVtby9cblx0XHRcdFx0XHRpZiAoZGF0YS5mYXRhbCkge1xuXHRcdFx0XHRcdFx0aGxzUGxheWVyLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChkYXRhLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbWVkaWFFcnJvcic6XG5cdFx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLnJlY292ZXJNZWRpYUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbmV0d29ya0Vycm9yJzpcblx0XHRcdFx0XHRcdFx0XHRobHNQbGF5ZXIuc3RhcnRMb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAobGV0IGV2ZW50VHlwZSBpbiBobHNFdmVudHMpIHtcblx0XHRcdFx0aWYgKGhsc0V2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKSB7XG5cdFx0XHRcdFx0aGxzUGxheWVyLm9uKGhsc0V2ZW50c1tldmVudFR5cGVdLCBhc3NpZ25IbHNFdmVudHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChtZWRpYUZpbGVzICYmIG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0aWYgKHJlbmRlcmVyLnJlbmRlcmVyc1tvcHRpb25zLnByZWZpeF0uY2FuUGxheVR5cGUobWVkaWFGaWxlc1tpXS50eXBlKSkge1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGVzW2ldLnNyYyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRub2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cblx0XHRvcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgb3JpZ2luYWxOb2RlKTtcblx0XHRvcmlnaW5hbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdhdXRvcGxheScpO1xuXHRcdG9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0TmF0aXZlSGxzLnByZXBhcmVTZXR0aW5ncyh7XG5cdFx0XHRvcHRpb25zOiBvcHRpb25zLmhscyxcblx0XHRcdGlkOiBpZFxuXHRcdH0pO1xuXG5cdFx0Ly8gSEVMUEVSIE1FVEhPRFNcblx0XHRub2RlLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdG5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuaGlkZSA9ICgpID0+IHtcblx0XHRcdG5vZGUucGF1c2UoKTtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRobHNQbGF5ZXIuZGVzdHJveSgpO1xuXHRcdH07XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIE5hdGl2ZSBITFMgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlXG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIHVybC5pbmNsdWRlcygnLm0zdTgnKSA/ICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnIDogbnVsbDtcbn0pO1xuXG5yZW5kZXJlci5hZGQoSGxzTmF0aXZlUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7U1VQUE9SVFNfTkFUSVZFX0hMUywgSVNfQU5EUk9JRH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcblxuLyoqXG4gKiBOYXRpdmUgSFRNTDUgUmVuZGVyZXJcbiAqXG4gKiBXcmFwcyB0aGUgbmF0aXZlIEhUTUw1IDxhdWRpbz4gb3IgPHZpZGVvPiB0YWcgYW5kIGJ1YmJsZXMgaXRzIHByb3BlcnRpZXMsIGV2ZW50cywgYW5kIG1ldGhvZHMgdXAgdG8gdGhlIG1lZGlhRWxlbWVudC5cbiAqL1xuY29uc3QgSHRtbE1lZGlhRWxlbWVudCA9IHtcblxuXHRuYW1lOiAnaHRtbDUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdodG1sNSdcblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IHtcblxuXHRcdGxldCBtZWRpYUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG5cdFx0Ly8gRHVlIHRvIGFuIGlzc3VlIG9uIFdlYmtpdCwgZm9yY2UgdGhlIE1QMyBhbmQgTVA0IG9uIEFuZHJvaWQgYW5kIGNvbnNpZGVyIG5hdGl2ZSBzdXBwb3J0IGZvciBITFNcblx0XHRpZiAoKElTX0FORFJPSUQgJiYgdHlwZS5tYXRjaCgvXFwvbXAoM3w0KSQvZ2kpICE9PSBudWxsKSB8fFxuXHRcdFx0KFsnYXBwbGljYXRpb24veC1tcGVndXJsJywgJ3ZuZC5hcHBsZS5tcGVndXJsJywgJ2F1ZGlvL21wZWd1cmwnLCAnYXVkaW8vaGxzJyxcblx0XHRcdFx0J3ZpZGVvL2hscyddLmluY2x1ZGVzKHR5cGUudG9Mb3dlckNhc2UoKSkgJiYgU1VQUE9SVFNfTkFUSVZFX0hMUykpIHtcblx0XHRcdHJldHVybiAneWVzJztcblx0XHR9IGVsc2UgaWYgKG1lZGlhRWxlbWVudC5jYW5QbGF5VHlwZSkge1xuXHRcdFx0cmV0dXJuIG1lZGlhRWxlbWVudC5jYW5QbGF5VHlwZSh0eXBlKS5yZXBsYWNlKC9uby8sICcnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdG5vZGUgPSBudWxsLFxuXHRcdFx0aWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeCxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdC8vIENSRUFURSBOT0RFXG5cdFx0aWYgKG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgPT09IHVuZGVmaW5lZCB8fCBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID09PSBudWxsKSB7XG5cdFx0XHRub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcblx0XHRcdG1lZGlhRWxlbWVudC5hcHBlbmRDaGlsZChub2RlKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRub2RlID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZTtcblx0XHR9XG5cblx0XHRub2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cblx0XHQvLyBXUkFQUEVSUyBmb3IgUFJPUHNcblx0XHRjb25zdFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdG5vZGVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IG5vZGVbcHJvcE5hbWVdO1xuXG5cdFx0XHRcdG5vZGVbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdG5vZGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Rcblx0XHRcdGV2ZW50cyA9IG1lanMuaHRtbDVtZWRpYS5ldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pLFxuXHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG5cdFx0XHRcdFx0Ly8gY29weSBldmVudFxuXG5cdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoZS50eXBlLCBlLmJ1YmJsZXMsIGUuY2FuY2VsYWJsZSk7XG5cdFx0XHRcdFx0Ly8gZXZlbnQuc3JjRWxlbWVudCA9IGUuc3JjRWxlbWVudDtcblx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkV2ZW50cyhldmVudHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEhFTFBFUiBNRVRIT0RTXG5cdFx0bm9kZS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdGlmIChtZWRpYUZpbGVzICYmIG1lZGlhRmlsZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0aWYgKHJlbmRlcmVyLnJlbmRlcmVyc1tvcHRpb25zLnByZWZpeF0uY2FuUGxheVR5cGUobWVkaWFGaWxlc1tpXS50eXBlKSkge1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBtZWRpYUZpbGVzW2ldLnNyYyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG53aW5kb3cuSHRtbE1lZGlhRWxlbWVudCA9IG1lanMuSHRtbE1lZGlhRWxlbWVudCA9IEh0bWxNZWRpYUVsZW1lbnQ7XG5cbnJlbmRlcmVyLmFkZChIdG1sTWVkaWFFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBTb3VuZENsb3VkIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBTb3VuZENsb3VkIFdpZGdldCBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLnNvdW5kY2xvdWQuY29tL2RvY3MvYXBpL2h0bWw1LXdpZGdldFxuICovXG5jb25zdCBTb3VuZENsb3VkQXBpID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc1NES1N0YXJ0ZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc1NES0xvYWRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRpZnJhbWVRdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGNyZWF0aW9uIG9mIDxpZnJhbWU+XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGVucXVldWVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0aWYgKFNvdW5kQ2xvdWRBcGkuaXNMb2FkZWQpIHtcblx0XHRcdFNvdW5kQ2xvdWRBcGkuY3JlYXRlSWZyYW1lKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0U291bmRDbG91ZEFwaS5sb2FkSWZyYW1lQXBpKCk7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmlmcmFtZVF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBTb3VuZENsb3VkIEFQSSBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICovXG5cdGxvYWRJZnJhbWVBcGk6ICgpID0+IHtcblx0XHRpZiAoIVNvdW5kQ2xvdWRBcGkuaXNTREtTdGFydGVkKSB7XG5cblx0XHRcdGxldCBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxcblx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRzY3JpcHQuc3JjID0gJy8vdy5zb3VuZGNsb3VkLmNvbS9wbGF5ZXIvYXBpLmpzJztcblxuXHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoIWRvbmUgJiYgKCFTb3VuZENsb3VkQXBpLnJlYWR5U3RhdGUgfHwgU291bmRDbG91ZEFwaS5yZWFkeVN0YXRlID09PSBcImxvYWRlZFwiIHx8IFNvdW5kQ2xvdWRBcGkucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSkge1xuXHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFNvdW5kQ2xvdWRBcGkuYXBpUmVhZHkoKTtcblxuXHRcdFx0XHRcdC8vIEhhbmRsZSBtZW1vcnkgbGVhayBpbiBJRVxuXHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHRpZiAoaGVhZCAmJiBzY3JpcHQucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRcdFx0aGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFNvdW5kQ2xvdWRBcGkuaXNTREtTdGFydGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgU291bmRDbG91ZCA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRhcGlSZWFkeTogKCkgPT4ge1xuXHRcdFNvdW5kQ2xvdWRBcGkuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdFNvdW5kQ2xvdWRBcGkuaXNTREtMb2FkZWQgPSB0cnVlO1xuXG5cdFx0d2hpbGUgKFNvdW5kQ2xvdWRBcGkuaWZyYW1lUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gU291bmRDbG91ZEFwaS5pZnJhbWVRdWV1ZS5wb3AoKTtcblx0XHRcdFNvdW5kQ2xvdWRBcGkuY3JlYXRlSWZyYW1lKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBTb3VuZENsb3VkIFdpZGdldCBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRjcmVhdGVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXHRcdGxldCBwbGF5ZXIgPSBTQy5XaWRnZXQoc2V0dGluZ3MuaWZyYW1lKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0fVxufTtcblxuY29uc3QgU291bmRDbG91ZElmcmFtZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAnc291bmRjbG91ZF9pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdzb3VuZGNsb3VkX2lmcmFtZSdcblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBbJ3ZpZGVvL3NvdW5kY2xvdWQnLCAndmlkZW8veC1zb3VuZGNsb3VkJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXQgc2MgPSB7fTtcblxuXHRcdC8vIHN0b3JlIG1haW4gdmFyaWFibGVcblx0XHRzYy5vcHRpb25zID0gb3B0aW9ucztcblx0XHRzYy5pZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4O1xuXHRcdHNjLm1lZGlhRWxlbWVudCA9IG1lZGlhRWxlbWVudDtcblxuXHRcdC8vIGNyZWF0ZSBvdXIgZmFrZSBlbGVtZW50IHRoYXQgYWxsb3dzIGV2ZW50cyBhbmQgc3VjaCB0byB3b3JrXG5cdFx0bGV0XG5cdFx0XHRhcGlTdGFjayA9IFtdLFxuXHRcdFx0c2NQbGF5ZXJSZWFkeSA9IGZhbHNlLFxuXHRcdFx0c2NQbGF5ZXIgPSBudWxsLFxuXHRcdFx0c2NJZnJhbWUgPSBudWxsLFxuXHRcdFx0Y3VycmVudFRpbWUgPSAwLFxuXHRcdFx0ZHVyYXRpb24gPSAwLFxuXHRcdFx0YnVmZmVyZWRUaW1lID0gMCxcblx0XHRcdHBhdXNlZCA9IHRydWUsXG5cdFx0XHR2b2x1bWUgPSAxLFxuXHRcdFx0bXV0ZWQgPSBmYWxzZSxcblx0XHRcdGVuZGVkID0gZmFsc2UsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyB3cmFwcGVycyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGZsYXNoIHN0YXRlIHRoYXQgd2Ugd2lsbCBzdG9yZVxuXG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdHNjW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHNjUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXG5cdFx0XHRcdFx0XHQvLyBmaWd1cmUgb3V0IGhvdyB0byBnZXQgZG0gZHRhIGhlcmVcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBjdXJyZW50VGltZTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdkdXJhdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGR1cmF0aW9uO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZvbHVtZTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXVzZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZW5kZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlbmRlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG11dGVkOyAvLyA/XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGJ1ZmZlcmVkVGltZSAqIGR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGxlbmd0aDogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChzY0lmcmFtZSkgPyBzY0lmcmFtZS5zcmMgOiAnJztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0c2NbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHNjUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHVybCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlWzBdLnNyYztcblxuXHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLmxvYWQodXJsKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0c2NQbGF5ZXIuc2Vla1RvKHZhbHVlICogMTAwMCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2NQbGF5ZXIuc2V0Vm9sdW1lKDApOyAvLyA/XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNldFZvbHVtZSgxKTsgLy8gP1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCBzYyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0c2NQbGF5ZXIuc2V0Vm9sdW1lKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCBzYyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3NjICcgKyBzYy5pZCwgcHJvcE5hbWUsICdVTlNVUFBPUlRFRCBwcm9wZXJ0eScpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIGFkZCB3cmFwcGVycyBmb3IgbmF0aXZlIG1ldGhvZHNcblx0XHRsZXRcblx0XHRcdG1ldGhvZHMgPSBtZWpzLmh0bWw1bWVkaWEubWV0aG9kcyxcblx0XHRcdGFzc2lnbk1ldGhvZHMgPSAobWV0aG9kTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBTb3VuZGNsb3VkIEFQSVxuXHRcdFx0XHRzY1ttZXRob2ROYW1lXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChzY1BsYXllciAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NQbGF5ZXIucGxheSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjUGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xvYWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ2NhbGwnLCBtZXRob2ROYW1lOiBtZXRob2ROYW1lfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbk1ldGhvZHMobWV0aG9kc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIGEgcmVhZHkgbWV0aG9kIHRoYXQgU0MgY2FuIGZpcmVcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzYy5pZF0gPSAoX3NjUGxheWVyKSA9PiB7XG5cblx0XHRcdHNjUGxheWVyUmVhZHkgPSB0cnVlO1xuXHRcdFx0bWVkaWFFbGVtZW50LnNjUGxheWVyID0gc2NQbGF5ZXIgPSBfc2NQbGF5ZXI7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChhcGlTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBhcGlTdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gYXBpU3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdFx0XHRzY1tgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRzY1tzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU291bmRDbG91ZCBwcm9wZXJ0aWVzIGFyZSBhc3luYywgc28gd2UgZG9uJ3QgZmlyZSB0aGUgZXZlbnQgdW50aWwgdGhlIHByb3BlcnR5IGNhbGxiYWNrIGZpcmVzXG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuUExBWV9QUk9HUkVTUywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRzY1BsYXllci5nZXRQb3NpdGlvbigoX2N1cnJlbnRUaW1lKSA9PiB7XG5cdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBfY3VycmVudFRpbWUgLyAxMDAwO1xuXHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgc2MpO1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLlBBVVNFLCAoKSA9PiB7XG5cdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3BhdXNlJywgc2MpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHNjUGxheWVyLmJpbmQoU0MuV2lkZ2V0LkV2ZW50cy5QTEFZLCAoKSA9PiB7XG5cdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5Jywgc2MpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHNjUGxheWVyLmJpbmQoU0MuV2lkZ2V0LkV2ZW50cy5GSU5JU0hFRCwgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuUkVBRFksICgpID0+IHtcblx0XHRcdFx0c2NQbGF5ZXIuZ2V0RHVyYXRpb24oKF9kdXJhdGlvbikgPT4ge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gX2R1cmF0aW9uIC8gMTAwMDtcblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdsb2FkZWRtZXRhZGF0YScsIHNjKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuTE9BRF9QUk9HUkVTUywgKCkgPT4ge1xuXHRcdFx0XHRzY1BsYXllci5nZXREdXJhdGlvbigobG9hZFByb2dyZXNzKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdFx0YnVmZmVyZWRUaW1lID0gZHVyYXRpb24gKiBsb2FkUHJvZ3Jlc3M7XG5cblx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwcm9ncmVzcycsIHNjKTtcblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzY1BsYXllci5nZXREdXJhdGlvbigoX2R1cmF0aW9uKSA9PiB7XG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBfZHVyYXRpb247XG5cblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnbG9hZGVkbWV0YWRhdGEnLCBzYyk7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBnaXZlIGluaXRpYWwgZXZlbnRzXG5cdFx0XHRsZXQgaW5pdEV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gaW5pdEV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGluaXRFdmVudHNbaV0sIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBjb250YWluZXIgZm9yIEFQSSBBUElcblx0XHRzY0lmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXHRcdHNjSWZyYW1lLmlkID0gc2MuaWQ7XG5cdFx0c2NJZnJhbWUud2lkdGggPSAxMDtcblx0XHRzY0lmcmFtZS5oZWlnaHQgPSAxMDtcblx0XHRzY0lmcmFtZS5mcmFtZUJvcmRlciA9IDA7XG5cdFx0c2NJZnJhbWUuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXHRcdHNjSWZyYW1lLnNyYyA9IG1lZGlhRmlsZXNbMF0uc3JjO1xuXHRcdHNjSWZyYW1lLnNjcm9sbGluZyA9ICdubyc7XG5cblx0XHRtZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQoc2NJZnJhbWUpO1xuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdGxldCBzY1NldHRpbmdzID0ge1xuXHRcdFx0aWZyYW1lOiBzY0lmcmFtZSxcblx0XHRcdGlkOiBzYy5pZFxuXHRcdH07XG5cblx0XHRTb3VuZENsb3VkQXBpLmVucXVldWVJZnJhbWUoc2NTZXR0aW5ncyk7XG5cblx0XHRzYy5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdC8vIG5vdGhpbmcgaGVyZSwgYXVkaW8gb25seVxuXHRcdH07XG5cdFx0c2MuaGlkZSA9ICgpID0+IHtcblx0XHRcdHNjLnBhdXNlKCk7XG5cdFx0XHRpZiAoc2NJZnJhbWUpIHtcblx0XHRcdFx0c2NJZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHNjLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoc2NJZnJhbWUpIHtcblx0XHRcdFx0c2NJZnJhbWUuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0c2MuZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdHNjUGxheWVyLmRlc3Ryb3koKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHNjO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIFNvdW5kQ2xvdWQgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlXG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuICh1cmwuaW5jbHVkZXMoJy8vc291bmRjbG91ZC5jb20nKSB8fCB1cmwuaW5jbHVkZXMoJy8vdy5zb3VuZGNsb3VkLmNvbScpKSA/ICd2aWRlby94LXNvdW5kY2xvdWQnIDogbnVsbDtcbn0pO1xuXG5yZW5kZXJlci5hZGQoU291bmRDbG91ZElmcmFtZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnQsIGFkZEV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogVmltZW8gcmVuZGVyZXJcbiAqXG4gKiBVc2VzIDxpZnJhbWU+IGFwcHJvYWNoIGFuZCB1c2VzIFZpbWVvIEFQSSB0byBtYW5pcHVsYXRlIGl0LlxuICogQWxsIFZpbWVvIGNhbGxzIHJldHVybiBhIFByb21pc2Ugc28gdGhpcyByZW5kZXJlciBhY2NvdW50cyBmb3IgdGhhdFxuICogdG8gdXBkYXRlIGFsbCB0aGUgbmVjZXNzYXJ5IHZhbHVlcyB0byBpbnRlcmFjdCB3aXRoIE1lZGlhRWxlbWVudCBwbGF5ZXIuXG4gKiBOb3RlOiBJRTggaW1wbGVtZW50cyBFQ01BU2NyaXB0IDMgdGhhdCBkb2VzIG5vdCBhbGxvdyBiYXJlIGtleXdvcmRzIGluIGRvdCBub3RhdGlvbjtcbiAqIHRoYXQncyB3aHkgaW5zdGVhZCBvZiB1c2luZyAuY2F0Y2ggWydjYXRjaCddIGlzIGJlaW5nIHVzZWQuXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aW1lby9wbGF5ZXIuanNcbiAqXG4gKi9cbmNvbnN0IHZpbWVvQXBpID0ge1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGlmcmFtZVF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgY3JlYXRpb24gb2YgPGlmcmFtZT5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0ZW5xdWV1ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRpZiAodmltZW9BcGkuaXNMb2FkZWQpIHtcblx0XHRcdHZpbWVvQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZpbWVvQXBpLmxvYWRJZnJhbWVBcGkoKTtcblx0XHRcdHZpbWVvQXBpLmlmcmFtZVF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBWaW1lbyBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cblx0XHRpZiAoIXZpbWVvQXBpLmlzSWZyYW1lU3RhcnRlZCkge1xuXG5cdFx0XHRsZXRcblx0XHRcdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG5cdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRkb25lID0gZmFsc2U7XG5cblx0XHRcdHNjcmlwdC5zcmMgPSAnLy9wbGF5ZXIudmltZW8uY29tL2FwaS9wbGF5ZXIuanMnO1xuXG5cdFx0XHQvLyBBdHRhY2ggaGFuZGxlcnMgZm9yIGFsbCBicm93c2Vyc1xuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRcdGlmICghZG9uZSAmJiAoIXZpbWVvQXBpLnJlYWR5U3RhdGUgfHwgdmltZW9BcGkucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0dmltZW9BcGkucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCB2aW1lb0FwaS5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpKSB7XG5cdFx0XHRcdFx0ZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0dmltZW9BcGkuaUZyYW1lUmVhZHkoKTtcblx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIGZpcnN0U2NyaXB0VGFnKTtcblx0XHRcdHZpbWVvQXBpLmlzSWZyYW1lU3RhcnRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIFZpbWVvIDxpZnJhbWU+IGVsZW1lbnQgY3JlYXRpb25cblx0ICpcblx0ICovXG5cdGlGcmFtZVJlYWR5OiAoKSA9PiB7XG5cblx0XHR2aW1lb0FwaS5pc0xvYWRlZCA9IHRydWU7XG5cdFx0dmltZW9BcGkuaXNJZnJhbWVMb2FkZWQgPSB0cnVlO1xuXG5cdFx0d2hpbGUgKHZpbWVvQXBpLmlmcmFtZVF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBzZXR0aW5ncyA9IHZpbWVvQXBpLmlmcmFtZVF1ZXVlLnBvcCgpO1xuXHRcdFx0dmltZW9BcGkuY3JlYXRlSWZyYW1lKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBWaW1lbyBBUEkgcGxheWVyIGFuZCB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IHRvIGluaXRpYWxpemUgaXRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0Y3JlYXRlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblx0XHRsZXQgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcihzZXR0aW5ncy5pZnJhbWUpO1xuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIHNldHRpbmdzLmlkXShwbGF5ZXIpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFeHRyYWN0IG51bWVyaWMgdmFsdWUgZnJvbSBWaW1lbyB0byBiZSBsb2FkZWQgdGhyb3VnaCBBUElcblx0ICogVmFsaWQgVVJMIGZvcm1hdChzKTpcblx0ICogIC0gaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzU5Nzc3MzkyXG5cdCAqICAtIGh0dHBzOi8vdmltZW8uY29tLzU5Nzc3MzkyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBWaW1lbyBmdWxsIFVSTCB0byBncmFiIHRoZSBudW1iZXIgSWQgb2YgdGhlIHNvdXJjZVxuXHQgKiBAcmV0dXJuIHtpbnR9XG5cdCAqL1xuXHRnZXRWaW1lb0lkOiAodXJsKSA9PiB7XG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcnRzID0gdXJsLnNwbGl0KCc/Jyk7XG5cblx0XHR1cmwgPSBwYXJ0c1swXTtcblxuXHRcdHJldHVybiBwYXJzZUludCh1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSkpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBjdXN0b20gZXJyb3JzIGZvciBWaW1lbyBiYXNlZCBvbiB0aGUgQVBJIHNwZWNpZmljYXRpb25zXG5cdCAqXG5cdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpbWVvL3BsYXllci5qcyNlcnJvclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZXJyb3Jcblx0ICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuXHQgKi9cblx0ZXJyb3JIYW5kbGVyOiAoZXJyb3IsIHRhcmdldCkgPT4ge1xuXHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlcnJvcicsIHRhcmdldCk7XG5cdFx0ZXZlbnQubWVzc2FnZSA9IGVycm9yLm5hbWUgKyAnOiAnICsgZXJyb3IubWVzc2FnZTtcblx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cbn07XG5cbmNvbnN0IHZpbWVvSWZyYW1lUmVuZGVyZXIgPSB7XG5cblx0bmFtZTogJ3ZpbWVvX2lmcmFtZScsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ3ZpbWVvX2lmcmFtZSdcblx0fSxcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gWyd2aWRlby92aW1lbycsICd2aWRlby94LXZpbWVvJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHQvLyBleHBvc2VkIG9iamVjdFxuXHRcdGxldFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHZpbWVvQXBpUmVhZHkgPSBmYWxzZSxcblx0XHRcdHZpbWVvID0ge30sXG5cdFx0XHR2aW1lb1BsYXllciA9IG51bGwsXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0dm9sdW1lID0gMSxcblx0XHRcdG9sZFZvbHVtZSA9IHZvbHVtZSxcblx0XHRcdGN1cnJlbnRUaW1lID0gMCxcblx0XHRcdGJ1ZmZlcmVkVGltZSA9IDAsXG5cdFx0XHRlbmRlZCA9IGZhbHNlLFxuXHRcdFx0ZHVyYXRpb24gPSAwLFxuXHRcdFx0dXJsID0gXCJcIixcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdHZpbWVvLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHZpbWVvLmlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXg7XG5cdFx0dmltZW8ubWVkaWFFbGVtZW50ID0gbWVkaWFFbGVtZW50O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdHZpbWVvW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHZpbWVvUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSBudWxsO1xuXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY3VycmVudFRpbWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkdXJhdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2b2x1bWU7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdm9sdW1lID09PSAwO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXVzZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZW5kZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlbmRlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLmdldFZpZGVvVXJsKCkudGhlbigoX3VybCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dXJsID0gX3VybDtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB1cmw7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2J1ZmZlcmVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBidWZmZXJlZFRpbWUgKiBkdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGg6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR2aW1lb1tgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAodmltZW9QbGF5ZXIgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gZG8gc29tZXRoaW5nXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRsZXQgdXJsID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogdmFsdWVbMF0uc3JjLFxuXHRcdFx0XHRcdFx0XHRcdFx0dmlkZW9JZCA9IHZpbWVvQXBpLmdldFZpbWVvSWQodXJsKTtcblxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLmxvYWRWaWRlbyh2aWRlb0lkKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChtZWRpYUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnNldEN1cnJlbnRUaW1lKHZhbHVlKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0dmltZW9QbGF5ZXIuc2V0Vm9sdW1lKHZhbHVlKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZvbHVtZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0b2xkVm9sdW1lID0gdm9sdW1lO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xvb3AnOlxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnNldExvb3AodmFsdWUpWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnNldFZvbHVtZSgwKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdW1lID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRWb2x1bWUob2xkVm9sdW1lKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dm9sdW1lID0gb2xkVm9sdW1lO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCd2aW1lbyAnICsgdmltZW8uaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgU291bmRjbG91ZCBBUElcblx0XHRcdFx0dmltZW9bbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAodmltZW9QbGF5ZXIgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRE8gbWV0aG9kXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG1ldGhvZE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGxheSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZpbWVvUGxheWVyLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2aW1lb1BsYXllci5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBWaW1lbyBldmVudHMgd2hlbiBpbml0aWFsaXppbmcgPGlmcmFtZT5cblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyB2aW1lby5pZF0gPSAoX3ZpbWVvUGxheWVyKSA9PiB7XG5cblx0XHRcdHZpbWVvQXBpUmVhZHkgPSB0cnVlO1xuXHRcdFx0bWVkaWFFbGVtZW50LnZpbWVvUGxheWVyID0gdmltZW9QbGF5ZXIgPSBfdmltZW9QbGF5ZXI7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChhcGlTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBhcGlTdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gYXBpU3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdFx0XHR2aW1lb1tgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHR2aW1lb1tzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGV0IHZpbWVvSWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodmltZW8uaWQpLCBldmVudHM7XG5cblx0XHRcdC8vIGEgZmV3IG1vcmUgZXZlbnRzXG5cdFx0XHRldmVudHMgPSBbJ21vdXNlb3ZlcicsICdtb3VzZW91dCddO1xuXG5cdFx0XHRjb25zdCBhc3NpZ25FdmVudHMgPSAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChsZXQgaiBpbiBldmVudHMpIHtcblx0XHRcdFx0bGV0IGV2ZW50TmFtZSA9IGV2ZW50c1tqXTtcblx0XHRcdFx0YWRkRXZlbnQodmltZW9JZnJhbWUsIGV2ZW50TmFtZSwgYXNzaWduRXZlbnRzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVmltZW8gZXZlbnRzXG5cdFx0XHR2aW1lb1BsYXllci5vbignbG9hZGVkJywgKCkgPT4ge1xuXG5cdFx0XHRcdHZpbWVvUGxheWVyLmdldER1cmF0aW9uKCkudGhlbigobG9hZFByb2dyZXNzKSA9PiB7XG5cblx0XHRcdFx0XHRkdXJhdGlvbiA9IGxvYWRQcm9ncmVzcztcblxuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdGJ1ZmZlcmVkVGltZSA9IGR1cmF0aW9uICogbG9hZFByb2dyZXNzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdsb2FkZWRtZXRhZGF0YScsIHZpbWVvKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHZpbWVvUGxheWVyLm9uKCdwcm9ncmVzcycsICgpID0+IHtcblxuXHRcdFx0XHRwYXVzZWQgPSB2aW1lby5tZWRpYUVsZW1lbnQuZ2V0UGF1c2VkKCk7XG5cblx0XHRcdFx0dmltZW9QbGF5ZXIuZ2V0RHVyYXRpb24oKS50aGVuKChsb2FkUHJvZ3Jlc3MpID0+IHtcblxuXHRcdFx0XHRcdGR1cmF0aW9uID0gbG9hZFByb2dyZXNzO1xuXG5cdFx0XHRcdFx0aWYgKGR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdFx0YnVmZmVyZWRUaW1lID0gZHVyYXRpb24gKiBsb2FkUHJvZ3Jlc3M7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3Byb2dyZXNzJywgdmltZW8pO1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdHZpbWVvUGxheWVyLm9uKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXG5cdFx0XHRcdHBhdXNlZCA9IHZpbWVvLm1lZGlhRWxlbWVudC5nZXRQYXVzZWQoKTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5nZXRDdXJyZW50VGltZSgpLnRoZW4oKHNlY29uZHMpID0+IHtcblx0XHRcdFx0XHRjdXJyZW50VGltZSA9IHNlY29uZHM7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgdmltZW8pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdH0pO1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdHZpbWVvUGxheWVyLnBsYXkoKVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3BsYXknLCB2aW1lbyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ3BhdXNlJywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdHZpbWVvUGxheWVyLnBhdXNlKClbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwYXVzZScsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHR2aW1lb1BsYXllci5vbignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRlbmRlZCA9IHRydWU7XG5cblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ2VuZGVkJywgdmltZW8pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2l2ZSBpbml0aWFsIGV2ZW50c1xuXHRcdFx0ZXZlbnRzID0gWydyZW5kZXJlcnJlYWR5JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAnY2FucGxheSddO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGV2ZW50c1tpXSwgdmltZW8pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldFxuXHRcdFx0aGVpZ2h0ID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5oZWlnaHQsXG5cdFx0XHR3aWR0aCA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUud2lkdGgsXG5cdFx0XHR2aW1lb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpLFxuXHRcdFx0c3RhbmRhcmRVcmwgPSAnLy9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLycgKyB2aW1lb0FwaS5nZXRWaW1lb0lkKG1lZGlhRmlsZXNbMF0uc3JjKVxuXHRcdDtcblxuXHRcdC8vIENyZWF0ZSBWaW1lbyA8aWZyYW1lPiBtYXJrdXBcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2lkJywgdmltZW8uaWQpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG5cdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZnJhbWVCb3JkZXInLCAnMCcpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3JjJywgc3RhbmRhcmRVcmwpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnd2Via2l0YWxsb3dmdWxsc2NyZWVuJywgJycpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnbW96YWxsb3dmdWxsc2NyZWVuJywgJycpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYWxsb3dmdWxsc2NyZWVuJywgJycpO1xuXG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh2aW1lb0NvbnRhaW5lciwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0dmltZW9BcGkuZW5xdWV1ZUlmcmFtZSh7XG5cdFx0XHRpZnJhbWU6IHZpbWVvQ29udGFpbmVyLFxuXHRcdFx0aWQ6IHZpbWVvLmlkXG5cdFx0fSk7XG5cblx0XHR2aW1lby5oaWRlID0gKCkgPT4ge1xuXHRcdFx0dmltZW8ucGF1c2UoKTtcblx0XHRcdGlmICh2aW1lb1BsYXllcikge1xuXHRcdFx0XHR2aW1lb0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dmltZW8uc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuXHRcdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdH07XG5cdFx0dmltZW8uc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmICh2aW1lb1BsYXllcikge1xuXHRcdFx0XHR2aW1lb0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiB2aW1lbztcblx0fVxuXG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIFZpbWVvIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy8vcGxheWVyLnZpbWVvJykgfHwgdXJsLmluY2x1ZGVzKCd2aW1lby5jb20nKSA/ICd2aWRlby94LXZpbWVvJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKHZpbWVvSWZyYW1lUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudCwgYWRkRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBZb3VUdWJlIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBZb3VUdWJlIEFQSSB0byBtYW5pcHVsYXRlIGl0LlxuICogTm90ZTogSUU2LTcgZG9uJ3QgaGF2ZSBwb3N0TWVzc2FnZSBzbyBkb24ndCBzdXBwb3J0IDxpZnJhbWU+IEFQSSwgYW5kIElFOCBkb2Vzbid0IGZpcmUgdGhlIG9uUmVhZHkgZXZlbnQsXG4gKiBzbyBpdCBkb2Vzbid0IHdvcmsgLSBub3Qgc3VyZSBpZiBHb29nbGUgcHJvYmxlbSBvciBub3QuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3lvdXR1YmUvaWZyYW1lX2FwaV9yZWZlcmVuY2VcbiAqL1xuY29uc3QgWW91VHViZUFwaSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNJZnJhbWVTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNJZnJhbWVMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0aWZyYW1lUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBjcmVhdGlvbiBvZiA8aWZyYW1lPlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRlbnF1ZXVlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGlmIChZb3VUdWJlQXBpLmlzTG9hZGVkKSB7XG5cdFx0XHRZb3VUdWJlQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFlvdVR1YmVBcGkubG9hZElmcmFtZUFwaSgpO1xuXHRcdFx0WW91VHViZUFwaS5pZnJhbWVRdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgWW91VHViZSBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cdFx0aWYgKCFZb3VUdWJlQXBpLmlzSWZyYW1lU3RhcnRlZCkge1xuXHRcdFx0bGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0dGFnLnNyYyA9ICcvL3d3dy55b3V0dWJlLmNvbS9wbGF5ZXJfYXBpJztcblx0XHRcdGxldCBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcblx0XHRcdGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1xuXHRcdFx0WW91VHViZUFwaS5pc0lmcmFtZVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBZb3VUdWJlIDxpZnJhbWU+IGVsZW1lbnQgY3JlYXRpb25cblx0ICpcblx0ICovXG5cdGlGcmFtZVJlYWR5OiAoKSA9PiB7XG5cblx0XHRZb3VUdWJlQXBpLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHRZb3VUdWJlQXBpLmlzSWZyYW1lTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChZb3VUdWJlQXBpLmlmcmFtZVF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBzZXR0aW5ncyA9IFlvdVR1YmVBcGkuaWZyYW1lUXVldWUucG9wKCk7XG5cdFx0XHRZb3VUdWJlQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgWW91VHViZSBBUEkgcGxheWVyIGFuZCB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IHRvIGluaXRpYWxpemUgaXRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0Y3JlYXRlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblx0XHRyZXR1cm4gbmV3IFlULlBsYXllcihzZXR0aW5ncy5jb250YWluZXJJZCwgc2V0dGluZ3MpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFeHRyYWN0IElEIGZyb20gWW91VHViZSdzIFVSTCB0byBiZSBsb2FkZWQgdGhyb3VnaCBBUElcblx0ICogVmFsaWQgVVJMIGZvcm1hdChzKTpcblx0ICogLSBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP2ZlYXR1cmU9cGxheWVyX2VtYmVkZGVkJnY9eXlXV1hTd3RQUDBcblx0ICogLSBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3YvVklERU9fSUQ/dmVyc2lvbj0zXG5cdCAqIC0gaHR0cDovL3lvdXR1LmJlL0RqZDZ0UHJ4YzA4XG5cdCAqIC0gaHR0cDovL3d3dy55b3V0dWJlLW5vY29va2llLmNvbS93YXRjaD9mZWF0dXJlPXBsYXllcl9lbWJlZGRlZCZ2PXl5V1dYU3d0UFAwXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0Z2V0WW91VHViZUlkOiAodXJsKSA9PiB7XG5cblx0XHRsZXQgeW91VHViZUlkID0gXCJcIjtcblxuXHRcdGlmICh1cmwuaW5kZXhPZignPycpID4gMCkge1xuXHRcdFx0Ly8gYXNzdW1pbmc6IGh0dHA6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/ZmVhdHVyZT1wbGF5ZXJfZW1iZWRkZWQmdj15eVdXWFN3dFBQMFxuXHRcdFx0eW91VHViZUlkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWRGcm9tUGFyYW0odXJsKTtcblxuXHRcdFx0Ly8gaWYgaXQncyBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3YvVklERU9fSUQ/dmVyc2lvbj0zXG5cdFx0XHRpZiAoeW91VHViZUlkID09PSAnJykge1xuXHRcdFx0XHR5b3VUdWJlSWQgPSBZb3VUdWJlQXBpLmdldFlvdVR1YmVJZEZyb21VcmwodXJsKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0eW91VHViZUlkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWRGcm9tVXJsKHVybCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHlvdVR1YmVJZDtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IElEIGZyb20gVVJMIHdpdGggZm9ybWF0OiBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP2ZlYXR1cmU9cGxheWVyX2VtYmVkZGVkJnY9eXlXV1hTd3RQUDBcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0Z2V0WW91VHViZUlkRnJvbVBhcmFtOiAodXJsKSA9PiB7XG5cblx0XHRpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09PSBudWxsIHx8ICF1cmwudHJpbSgpLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR5b3VUdWJlSWQgPSAnJyxcblx0XHRcdHBhcnRzID0gdXJsLnNwbGl0KCc/JyksXG5cdFx0XHRwYXJhbWV0ZXJzID0gcGFydHNbMV0uc3BsaXQoJyYnKVxuXHRcdDtcblxuXHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcmFtZXRlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0bGV0IHBhcmFtUGFydHMgPSBwYXJhbWV0ZXJzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRpZiAocGFyYW1QYXJ0c1swXSA9PT0gJ3YnKSB7XG5cdFx0XHRcdHlvdVR1YmVJZCA9IHBhcmFtUGFydHNbMV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB5b3VUdWJlSWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBJRCBmcm9tIFVSTCB3aXRoIGZvcm1hdHNcblx0ICogIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHQgKiAgLSBodHRwOi8veW91dHUuYmUvRGpkNnRQcnhjMDhcblx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHQgKiBAcmV0dXJuIHs/U3RyaW5nfVxuXHQgKi9cblx0Z2V0WW91VHViZUlkRnJvbVVybDogKHVybCkgPT4ge1xuXG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCAhdXJsLnRyaW0oKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJ0cyA9IHVybC5zcGxpdCgnPycpO1xuXHRcdHVybCA9IHBhcnRzWzBdO1xuXHRcdHJldHVybiB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEluamVjdCBgbm8tY29va2llYCBlbGVtZW50IHRvIFVSTC4gT25seSB3b3JrcyB3aXRoIGZvcm1hdDogaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG5cdCAqIEByZXR1cm4gez9TdHJpbmd9XG5cdCAqL1xuXHRnZXRZb3VUdWJlTm9Db29raWVVcmw6ICh1cmwpID0+IHtcblx0XHRpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09PSBudWxsIHx8ICF1cmwudHJpbSgpLmxlbmd0aCB8fCAhdXJsLmluY2x1ZGVzKCcvL3d3dy55b3V0dWJlJykpIHtcblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XG5cdFx0cGFydHNbMl0gPSBwYXJ0c1syXS5yZXBsYWNlKCcuY29tJywgJy1ub2Nvb2tpZS5jb20nKTtcblx0XHRyZXR1cm4gcGFydHMuam9pbignLycpO1xuXHR9XG59O1xuXG5jb25zdCBZb3VUdWJlSWZyYW1lUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICd5b3V0dWJlX2lmcmFtZScsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ3lvdXR1YmVfaWZyYW1lJyxcblx0XHQvKipcblx0XHQgKiBDdXN0b20gY29uZmlndXJhdGlvbiBmb3IgWW91VHViZSBwbGF5ZXJcblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20veW91dHViZS9wbGF5ZXJfcGFyYW1ldGVycyNQYXJhbWV0ZXJzXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHR5b3V0dWJlOiB7XG5cdFx0XHRhdXRvcGxheTogMCxcblx0XHRcdGNvbnRyb2xzOiAwLFxuXHRcdFx0ZGlzYWJsZWtiOiAxLFxuXHRcdFx0ZW5kOiAwLFxuXHRcdFx0bG9vcDogMCxcblx0XHRcdG1vZGVzdGJyYW5kaW5nOiAwLFxuXHRcdFx0cGxheXNpbmxpbmU6IDAsXG5cdFx0XHRyZWw6IDAsXG5cdFx0XHRzaG93aW5mbzogMCxcblx0XHRcdHN0YXJ0OiAwLFxuXHRcdFx0Ly8gY3VzdG9tIHRvIGluamVjdCBgLW5vY29va2llYCBlbGVtZW50IGluIFVSTFxuXHRcdFx0bm9jb29raWU6IGZhbHNlXG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IFsndmlkZW8veW91dHViZScsICd2aWRlby94LXlvdXR1YmUnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdC8vIGV4cG9zZWQgb2JqZWN0XG5cdFx0bGV0IHlvdXR1YmUgPSB7fTtcblx0XHR5b3V0dWJlLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHlvdXR1YmUuaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHR5b3V0dWJlLm1lZGlhRWxlbWVudCA9IG1lZGlhRWxlbWVudDtcblxuXHRcdC8vIEFQSSBvYmplY3RzXG5cdFx0bGV0XG5cdFx0XHRhcGlTdGFjayA9IFtdLFxuXHRcdFx0eW91VHViZUFwaSA9IG51bGwsXG5cdFx0XHR5b3VUdWJlQXBpUmVhZHkgPSBmYWxzZSxcblx0XHRcdHBhdXNlZCA9IHRydWUsXG5cdFx0XHRlbmRlZCA9IGZhbHNlLFxuXHRcdFx0eW91VHViZUlmcmFtZSA9IG51bGwsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyB3cmFwcGVycyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGZsYXNoIHN0YXRlIHRoYXQgd2Ugd2lsbCBzdG9yZVxuXG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdHlvdXR1YmVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IHlvdXR1YmUgZHRhIGhlcmVcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLmdldEN1cnJlbnRUaW1lKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLmdldER1cmF0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXRWb2x1bWUoKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXVzZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZW5kZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBlbmRlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkuaXNNdXRlZCgpOyAvLyA/XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCBwZXJjZW50TG9hZGVkID0geW91VHViZUFwaS5nZXRWaWRlb0xvYWRlZEZyYWN0aW9uKCksXG5cdFx0XHRcdFx0XHRcdFx0XHRkdXJhdGlvbiA9IHlvdVR1YmVBcGkuZ2V0RHVyYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBwZXJjZW50TG9hZGVkICogZHVyYXRpb247XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXRWaWRlb1VybCgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHR5b3V0dWJlW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblxuXHRcdFx0XHRcdGlmICh5b3VUdWJlQXBpICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHVybCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlWzBdLnNyYyxcblx0XHRcdFx0XHRcdFx0XHRcdHZpZGVvSWQgPSBZb3VUdWJlQXBpLmdldFlvdVR1YmVJZCh1cmwpO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG1lZGlhRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JykpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkubG9hZFZpZGVvQnlJZCh2aWRlb0lkKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5jdWVWaWRlb0J5SWQodmlkZW9JZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHR5b3VUdWJlQXBpLnNlZWtUbyh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5tdXRlKCk7IC8vID9cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS51bk11dGUoKTsgLy8gP1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCB5b3V0dWJlKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHR5b3VUdWJlQXBpLnNldFZvbHVtZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3lvdXR1YmUgJyArIHlvdXR1YmUuaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgbmF0aXZlIEhUTUxNZWRpYUVsZW1lbnRcblx0XHRcdFx0eW91dHViZVttZXRob2ROYW1lXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmICh5b3VUdWJlQXBpICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIERPIG1ldGhvZFxuXHRcdFx0XHRcdFx0c3dpdGNoIChtZXRob2ROYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BsYXknOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLnBsYXlWaWRlbygpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkucGF1c2VWaWRlbygpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIENSRUFURSBZb3VUdWJlXG5cdFx0bGV0IHlvdXR1YmVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR5b3V0dWJlQ29udGFpbmVyLmlkID0geW91dHViZS5pZDtcblxuXHRcdC8vIElmIGBub2Nvb2tpZWAgZmVhdHVyZSB3YXMgZW5hYmxlZCwgbW9kaWZ5IG9yaWdpbmFsIFVSTFxuXHRcdGlmICh5b3V0dWJlLm9wdGlvbnMueW91dHViZS5ub2Nvb2tpZSkge1xuXHRcdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIFlvdVR1YmVBcGkuZ2V0WW91VHViZU5vQ29va2llVXJsKG1lZGlhRmlsZXNbMF0uc3JjKSk7XG5cdFx0fVxuXG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh5b3V0dWJlQ29udGFpbmVyLCBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRsZXRcblx0XHRcdGhlaWdodCA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuaGVpZ2h0LFxuXHRcdFx0d2lkdGggPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLndpZHRoLFxuXHRcdFx0dmlkZW9JZCA9IFlvdVR1YmVBcGkuZ2V0WW91VHViZUlkKG1lZGlhRmlsZXNbMF0uc3JjKSxcblx0XHRcdHlvdXR1YmVTZXR0aW5ncyA9IHtcblx0XHRcdFx0aWQ6IHlvdXR1YmUuaWQsXG5cdFx0XHRcdGNvbnRhaW5lcklkOiB5b3V0dWJlQ29udGFpbmVyLmlkLFxuXHRcdFx0XHR2aWRlb0lkOiB2aWRlb0lkLFxuXHRcdFx0XHRoZWlnaHQ6IGhlaWdodCxcblx0XHRcdFx0d2lkdGg6IHdpZHRoLFxuXHRcdFx0XHRwbGF5ZXJWYXJzOiBPYmplY3QuYXNzaWduKHtcblx0XHRcdFx0XHRjb250cm9sczogMCxcblx0XHRcdFx0XHRyZWw6IDAsXG5cdFx0XHRcdFx0ZGlzYWJsZWtiOiAxLFxuXHRcdFx0XHRcdHNob3dpbmZvOiAwLFxuXHRcdFx0XHRcdG1vZGVzdGJyYW5kaW5nOiAwLFxuXHRcdFx0XHRcdGh0bWw1OiAxLFxuXHRcdFx0XHRcdHBsYXlzaW5saW5lOiAwLFxuXHRcdFx0XHRcdHN0YXJ0OiAwLFxuXHRcdFx0XHRcdGVuZDogMFxuXHRcdFx0XHR9LCB5b3V0dWJlLm9wdGlvbnMueW91dHViZSksXG5cdFx0XHRcdG9yaWdpbjogd2luZG93LmxvY2F0aW9uLmhvc3QsXG5cdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdG9uUmVhZHk6IChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdHlvdVR1YmVBcGlSZWFkeSA9IHRydWU7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQueW91VHViZUFwaSA9IHlvdVR1YmVBcGkgPSBlLnRhcmdldDtcblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC55b3VUdWJlU3RhdGUgPSB7XG5cdFx0XHRcdFx0XHRcdHBhdXNlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0ZW5kZWQ6IGZhbHNlXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRcdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YFxuXHRcdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdXR1YmVbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGEgZmV3IG1vcmUgZXZlbnRzXG5cdFx0XHRcdFx0XHR5b3VUdWJlSWZyYW1lID0geW91VHViZUFwaS5nZXRJZnJhbWUoKTtcblxuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsnbW91c2VvdmVyJywgJ21vdXNlb3V0J10sXG5cdFx0XHRcdFx0XHRcdGFzc2lnbkV2ZW50cyA9IChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdFx0XHRsZXQgbmV3RXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIHlvdXR1YmUpO1xuXHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBqIGluIGV2ZW50cykge1xuXHRcdFx0XHRcdFx0XHRhZGRFdmVudCh5b3VUdWJlSWZyYW1lLCBldmVudHNbal0sIGFzc2lnbkV2ZW50cyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHNlbmQgaW5pdCBldmVudHNcblx0XHRcdFx0XHRcdGxldCBpbml0RXZlbnRzID0gWydyZW5kZXJlcnJlYWR5JywgJ2xvYWRlZGRhdGEnLCAnbG9hZGVkbWV0YWRhdGEnLCAnY2FucGxheSddO1xuXG5cdFx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGluaXRFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChpbml0RXZlbnRzW2ldLCB5b3V0dWJlKTtcblx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25TdGF0ZUNoYW5nZTogKGUpID0+IHtcblxuXHRcdFx0XHRcdFx0Ly8gdHJhbnNsYXRlIGV2ZW50c1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50cyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGUuZGF0YSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlIC0xOiAvLyBub3Qgc3RhcnRlZFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsnbG9hZGVkbWV0YWRhdGEnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAwOiAvLyBZVC5QbGF5ZXJTdGF0ZS5FTkRFRFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsnZW5kZWQnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlLnN0b3BJbnRlcnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgMTpcdC8vIFlULlBsYXllclN0YXRlLlBMQVlJTkdcblx0XHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ3BsYXknLCAncGxheWluZyddO1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlLnN0YXJ0SW50ZXJ2YWwoKTtcblxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgMjogLy8gWVQuUGxheWVyU3RhdGUuUEFVU0VEXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzID0gWydwYXVzZWQnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlLnN0b3BJbnRlcnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgMzogLy8gWVQuUGxheWVyU3RhdGUuQlVGRkVSSU5HXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzID0gWydwcm9ncmVzcyddO1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSA1OiAvLyBZVC5QbGF5ZXJTdGF0ZS5DVUVEXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzID0gWydsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gc2VuZCBldmVudHMgdXBcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KGV2ZW50c1tpXSwgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdC8vIHNlbmQgaXQgb2ZmIGZvciBhc3luYyBsb2FkaW5nIGFuZCBjcmVhdGlvblxuXHRcdFlvdVR1YmVBcGkuZW5xdWV1ZUlmcmFtZSh5b3V0dWJlU2V0dGluZ3MpO1xuXG5cdFx0eW91dHViZS5vbkV2ZW50ID0gKGV2ZW50TmFtZSwgcGxheWVyLCBfeW91VHViZVN0YXRlKSA9PiB7XG5cdFx0XHRpZiAoX3lvdVR1YmVTdGF0ZSAhPT0gbnVsbCAmJiBfeW91VHViZVN0YXRlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bWVkaWFFbGVtZW50LnlvdVR1YmVTdGF0ZSA9IF95b3VUdWJlU3RhdGU7XG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0eW91dHViZS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdGlmICh5b3VUdWJlQXBpICE9PSBudWxsKSB7XG5cdFx0XHRcdHlvdVR1YmVBcGkuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHlvdXR1YmUuaGlkZSA9ICgpID0+IHtcblx0XHRcdHlvdXR1YmUuc3RvcEludGVydmFsKCk7XG5cdFx0XHR5b3V0dWJlLnBhdXNlKCk7XG5cdFx0XHRpZiAoeW91VHViZUlmcmFtZSkge1xuXHRcdFx0XHR5b3VUdWJlSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR5b3V0dWJlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoeW91VHViZUlmcmFtZSkge1xuXHRcdFx0XHR5b3VUdWJlSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHlvdXR1YmUuZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdHlvdVR1YmVBcGkuZGVzdHJveSgpO1xuXHRcdH07XG5cdFx0eW91dHViZS5pbnRlcnZhbCA9IG51bGw7XG5cblx0XHR5b3V0dWJlLnN0YXJ0SW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHQvLyBjcmVhdGUgdGltZXJcblx0XHRcdHlvdXR1YmUuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCB5b3V0dWJlKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHR9LCAyNTApO1xuXHRcdH07XG5cdFx0eW91dHViZS5zdG9wSW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHRpZiAoeW91dHViZS5pbnRlcnZhbCkge1xuXHRcdFx0XHRjbGVhckludGVydmFsKHlvdXR1YmUuaW50ZXJ2YWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4geW91dHViZTtcblx0fVxufTtcblxuaWYgKHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB0eXBlb2Ygd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcblxuXHR3aW5kb3cub25Zb3VUdWJlUGxheWVyQVBJUmVhZHkgPSAoKSA9PiB7XG5cdFx0WW91VHViZUFwaS5pRnJhbWVSZWFkeSgpO1xuXHR9O1xuXG5cdHR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdFx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuICh1cmwuaW5jbHVkZXMoJy8vd3d3LnlvdXR1YmUnKSB8fCB1cmwuaW5jbHVkZXMoJy8veW91dHUuYmUnKSkgPyAndmlkZW8veC15b3V0dWJlJyA6IG51bGw7XG5cdH0pO1xuXG5cdHJlbmRlcmVyLmFkZChZb3VUdWJlSWZyYW1lUmVuZGVyZXIpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuZXhwb3J0IGNvbnN0IE5BViA9IHdpbmRvdy5uYXZpZ2F0b3I7XG5leHBvcnQgY29uc3QgVUEgPSBOQVYudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbmV4cG9ydCBjb25zdCBJU19JUEFEID0gKFVBLm1hdGNoKC9pcGFkL2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19JUEhPTkUgPSAoVUEubWF0Y2goL2lwaG9uZS9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSU9TID0gSVNfSVBIT05FIHx8IElTX0lQQUQ7XG5leHBvcnQgY29uc3QgSVNfQU5EUk9JRCA9IChVQS5tYXRjaCgvYW5kcm9pZC9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSUUgPSAoTkFWLmFwcE5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnbWljcm9zb2Z0JykgfHwgTkFWLmFwcE5hbWUudG9Mb3dlckNhc2UoKS5tYXRjaCgvdHJpZGVudC9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0NIUk9NRSA9IChVQS5tYXRjaCgvY2hyb21lL2dpKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfRklSRUZPWCA9IChVQS5tYXRjaCgvZmlyZWZveC9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX1NBRkFSSSA9IChVQS5tYXRjaCgvc2FmYXJpL2dpKSAhPT0gbnVsbCkgJiYgIUlTX0NIUk9NRTtcbmV4cG9ydCBjb25zdCBJU19TVE9DS19BTkRST0lEID0gKFVBLm1hdGNoKC9ebW96aWxsYVxcL1xcZCtcXC5cXGQrXFxzXFwobGludXg7XFxzdTsvZ2kpICE9PSBudWxsKTtcblxuZXhwb3J0IGNvbnN0IEhBU19UT1VDSCA9ICEhKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpO1xuZXhwb3J0IGNvbnN0IEhBU19NU0UgPSAoJ01lZGlhU291cmNlJyBpbiB3aW5kb3cpO1xuZXhwb3J0IGNvbnN0IFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSAoKCkgPT4ge1xuXHRsZXRcblx0XHRlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneCcpLFxuXHRcdGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRnZXRDb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUsXG5cdFx0c3VwcG9ydHNcblx0O1xuXG5cdGlmICghKCdwb2ludGVyRXZlbnRzJyBpbiBlbGVtZW50LnN0eWxlKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcblx0ZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ3gnO1xuXHRkb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cdHN1cHBvcnRzID0gZ2V0Q29tcHV0ZWRTdHlsZSAmJiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICcnKS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG5cdGRvY3VtZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0cmV0dXJuICEhc3VwcG9ydHM7XG59KSgpO1xuXG4vLyBmb3IgSUVcbmxldCBodG1sNUVsZW1lbnRzID0gWydzb3VyY2UnLCAndHJhY2snLCAnYXVkaW8nLCAndmlkZW8nXSwgdmlkZW87XG5cbmZvciAobGV0IGkgPSAwLCBpbCA9IGh0bWw1RWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHR2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaHRtbDVFbGVtZW50c1tpXSk7XG59XG5cbi8vIFRlc3QgaWYgTWVkaWEgU291cmNlIEV4dGVuc2lvbnMgYXJlIHN1cHBvcnRlZCBieSBicm93c2VyXG5leHBvcnQgY29uc3QgU1VQUE9SVFNfTUVESUFfVEFHID0gKHZpZGVvLmNhblBsYXlUeXBlICE9PSB1bmRlZmluZWQgfHwgSEFTX01TRSk7XG5cbi8vIFRlc3QgaWYgYnJvd3NlcnMgc3VwcG9ydCBITFMgbmF0aXZlbHkgKHJpZ2h0IG5vdyBTYWZhcmksIEFuZHJvaWQncyBDaHJvbWUgYW5kIFN0b2NrIGJyb3dzZXJzLCBhbmQgTVMgRWRnZSlcbmV4cG9ydCBjb25zdCBTVVBQT1JUU19OQVRJVkVfSExTID0gKElTX1NBRkFSSSB8fCAoSVNfQU5EUk9JRCAmJiAoSVNfQ0hST01FIHx8IElTX1NUT0NLX0FORFJPSUQpKSB8fCAoSVNfSUUgJiYgVUEubWF0Y2goL2VkZ2UvZ2kpICE9PSBudWxsKSk7XG5cbi8vIERldGVjdCBuYXRpdmUgSmF2YVNjcmlwdCBmdWxsc2NyZWVuIChTYWZhcmkvRmlyZWZveCBvbmx5LCBDaHJvbWUgc3RpbGwgZmFpbHMpXG5cbi8vIGlPU1xubGV0IGhhc2lPU0Z1bGxTY3JlZW4gPSAodmlkZW8ud2Via2l0RW50ZXJGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG4vLyBXM0NcbmxldCBoYXNOYXRpdmVGdWxsc2NyZWVuID0gKHZpZGVvLnJlcXVlc3RGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG4vLyBPUyBYIDEwLjUgY2FuJ3QgZG8gdGhpcyBldmVuIGlmIGl0IHNheXMgaXQgY2FuIDooXG5pZiAoaGFzaU9TRnVsbFNjcmVlbiAmJiBVQS5tYXRjaCgvbWFjIG9zIHggMTBfNS9pKSkge1xuXHRoYXNOYXRpdmVGdWxsc2NyZWVuID0gZmFsc2U7XG5cdGhhc2lPU0Z1bGxTY3JlZW4gPSBmYWxzZTtcbn1cblxuLy8gd2Via2l0L2ZpcmVmb3gvSUUxMStcbmxldCBoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuICE9PSB1bmRlZmluZWQpO1xubGV0IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4gPSAodmlkZW8ubW96UmVxdWVzdEZ1bGxTY3JlZW4gIT09IHVuZGVmaW5lZCk7XG5sZXQgaGFzTXNOYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLm1zUmVxdWVzdEZ1bGxzY3JlZW4gIT09IHVuZGVmaW5lZCk7XG5cbmxldCBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbiA9IChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuIHx8IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4gfHwgaGFzTXNOYXRpdmVGdWxsU2NyZWVuKTtcbmxldCBuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IGhhc1RydWVOYXRpdmVGdWxsU2NyZWVuO1xuXG5sZXQgZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICcnO1xubGV0IGlzRnVsbFNjcmVlbiwgcmVxdWVzdEZ1bGxTY3JlZW4sIGNhbmNlbEZ1bGxTY3JlZW47XG5cbi8vIEVuYWJsZWQ/XG5pZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbmFibGVkO1xufSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0bmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbmFibGVkO1xufVxuXG5pZiAoSVNfQ0hST01FKSB7XG5cdGhhc2lPU0Z1bGxTY3JlZW4gPSBmYWxzZTtcbn1cblxuaWYgKGhhc1RydWVOYXRpdmVGdWxsU2NyZWVuKSB7XG5cblx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnO1xuXHR9IGVsc2UgaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ21vemZ1bGxzY3JlZW5jaGFuZ2UnO1xuXHR9IGVsc2UgaWYgKGhhc01zTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdGZ1bGxTY3JlZW5FdmVudE5hbWUgPSAnTVNGdWxsc2NyZWVuQ2hhbmdlJztcblx0fVxuXG5cdGlzRnVsbFNjcmVlbiA9ICgpID0+ICB7XG5cdFx0aWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQud2Via2l0SXNGdWxsU2NyZWVuO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRyZXF1ZXN0RnVsbFNjcmVlbiA9IChlbCkgPT4ge1xuXG5cdFx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGVsLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0fSBlbHNlIGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0fVxuXHR9O1xuXG5cdGNhbmNlbEZ1bGxTY3JlZW4gPSAoKSA9PiB7XG5cdFx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKTtcblxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IEhBU19OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc05hdGl2ZUZ1bGxzY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX1dFQktJVF9OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX01PWl9OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX01TX05BVElWRV9GVUxMU0NSRUVOID0gaGFzTXNOYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19JT1NfRlVMTFNDUkVFTiA9IGhhc2lPU0Z1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbjtcbmV4cG9ydCBjb25zdCBIQVNfTkFUSVZFX0ZVTExTQ1JFRU5fRU5BQkxFRCA9IG5hdGl2ZUZ1bGxTY3JlZW5FbmFibGVkO1xuZXhwb3J0IGNvbnN0IEZVTExTQ1JFRU5fRVZFTlRfTkFNRSA9IGZ1bGxTY3JlZW5FdmVudE5hbWU7XG5cbmV4cG9ydCB7aXNGdWxsU2NyZWVuLCByZXF1ZXN0RnVsbFNjcmVlbiwgY2FuY2VsRnVsbFNjcmVlbn07XG5cbm1lanMuRmVhdHVyZXMgPSBtZWpzLkZlYXR1cmVzIHx8IHt9O1xubWVqcy5GZWF0dXJlcy5pc2lQYWQgPSBJU19JUEFEO1xubWVqcy5GZWF0dXJlcy5pc2lQaG9uZSA9IElTX0lQSE9ORTtcbm1lanMuRmVhdHVyZXMuaXNpT1MgPSBtZWpzLkZlYXR1cmVzLmlzaVBob25lIHx8IG1lanMuRmVhdHVyZXMuaXNpUGFkO1xubWVqcy5GZWF0dXJlcy5pc0FuZHJvaWQgPSBJU19BTkRST0lEO1xubWVqcy5GZWF0dXJlcy5pc0lFID0gSVNfSUU7XG5tZWpzLkZlYXR1cmVzLmlzQ2hyb21lID0gSVNfQ0hST01FO1xubWVqcy5GZWF0dXJlcy5pc0ZpcmVmb3ggPSBJU19GSVJFRk9YO1xubWVqcy5GZWF0dXJlcy5pc1NhZmFyaSA9IElTX1NBRkFSSTtcbm1lanMuRmVhdHVyZXMuaXNTdG9ja0FuZHJvaWQgPSBJU19TVE9DS19BTkRST0lEO1xubWVqcy5GZWF0dXJlcy5oYXNUb3VjaCA9IEhBU19UT1VDSDtcbm1lanMuRmVhdHVyZXMuaGFzTVNFID0gSEFTX01TRTtcbm1lanMuRmVhdHVyZXMuc3VwcG9ydHNNZWRpYVRhZyA9IFNVUFBPUlRTX01FRElBX1RBRztcbm1lanMuRmVhdHVyZXMuc3VwcG9ydHNOYXRpdmVITFMgPSBTVVBQT1JUU19OQVRJVkVfSExTO1xuXG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzUG9pbnRlckV2ZW50cyA9IFNVUFBPUlRfUE9JTlRFUl9FVkVOVFM7XG5tZWpzLkZlYXR1cmVzLmhhc2lPU0Z1bGxTY3JlZW4gPSBIQVNfSU9TX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc05hdGl2ZUZ1bGxzY3JlZW4gPSBIQVNfTkFUSVZFX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4gPSBIQVNfV0VCS0lUX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNNb3pOYXRpdmVGdWxsU2NyZWVuID0gSEFTX01PWl9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzTXNOYXRpdmVGdWxsU2NyZWVuID0gSEFTX01TX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNUcnVlTmF0aXZlRnVsbFNjcmVlbiA9IEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5uYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IEhBU19OQVRJVkVfRlVMTFNDUkVFTl9FTkFCTEVEO1xubWVqcy5GZWF0dXJlcy5mdWxsU2NyZWVuRXZlbnROYW1lID0gRlVMTFNDUkVFTl9FVkVOVF9OQU1FO1xubWVqcy5GZWF0dXJlcy5pc0Z1bGxTY3JlZW4gPSBpc0Z1bGxTY3JlZW47XG5tZWpzLkZlYXR1cmVzLnJlcXVlc3RGdWxsU2NyZWVuID0gcmVxdWVzdEZ1bGxTY3JlZW47XG5tZWpzLkZlYXR1cmVzLmNhbmNlbEZ1bGxTY3JlZW4gPSBjYW5jZWxGdWxsU2NyZWVuOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHJldHVybiB7RXZlbnR8T2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXZlbnQgKGV2ZW50TmFtZSwgdGFyZ2V0KSB7XG5cblx0aWYgKHR5cGVvZiBldmVudE5hbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBuYW1lIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGxldCBldmVudDtcblxuXHRpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcblx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuXHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHRldmVudCA9IHt9O1xuXHRcdGV2ZW50LnR5cGUgPSBldmVudE5hbWU7XG5cdFx0ZXZlbnQudGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdGV2ZW50LmNhbmNlbGVhYmxlID0gdHJ1ZTtcblx0XHRldmVudC5idWJiYWJsZSA9IGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50IChvYmosIHR5cGUsIGZuKSB7XG5cdGlmIChvYmouYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAob2JqLmF0dGFjaEV2ZW50KSB7XG5cdFx0b2JqW2BlJHt0eXBlfSR7Zm59YF0gPSBmbjtcblx0XHRvYmpbYCR7dHlwZX0ke2ZufWBdID0gKCkgPT4ge1xuXHRcdFx0b2JqW2BlJHt0eXBlfSR7Zm59YF0od2luZG93LmV2ZW50KTtcblx0XHR9O1xuXHRcdG9iai5hdHRhY2hFdmVudChgb24ke3R5cGV9YCwgb2JqW2Ake3R5cGV9JHtmbn1gXSk7XG5cdH1cblxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUV2ZW50IChvYmosIHR5cGUsIGZuKSB7XG5cblx0aWYgKG9iai5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG5cdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGZhbHNlKTtcblx0fSBlbHNlIGlmIChvYmouZGV0YWNoRXZlbnQpIHtcblx0XHRvYmouZGV0YWNoRXZlbnQoYG9uJHt0eXBlfWAsIG9ialtgJHt0eXBlfSR7Zm59YF0pO1xuXHRcdG9ialtgJHt0eXBlfSR7Zm59YF0gPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRhcmdldE5vZGUgYXBwZWFycyBhZnRlciBzb3VyY2VOb2RlIGluIHRoZSBkb20uXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzb3VyY2VOb2RlIC0gdGhlIHNvdXJjZSBub2RlIGZvciBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXROb2RlIC0gdGhlIG5vZGUgdG8gY29tcGFyZSBhZ2FpbnN0IHNvdXJjZU5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZUFmdGVyIChzb3VyY2VOb2RlLCB0YXJnZXROb2RlKSB7XG5cdHJldHVybiAhIShcblx0XHRzb3VyY2VOb2RlICYmXG5cdFx0dGFyZ2V0Tm9kZSAmJlxuXHRcdHNvdXJjZU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24odGFyZ2V0Tm9kZSkgJiYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9QUkVDRURJTkdcblx0KTtcbn1cblxubWVqcy5VdGlscyA9IG1lanMuVXRpbHMgfHwge307XG5tZWpzLlV0aWxzLmNyZWF0ZUV2ZW50ID0gY3JlYXRlRXZlbnQ7XG5tZWpzLlV0aWxzLnJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnQ7XG5tZWpzLlV0aWxzLmlzTm9kZUFmdGVyID0gaXNOb2RlQWZ0ZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSFRNTCAoaW5wdXQpIHtcblxuXHRpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgcGFzc2VkIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGNvbnN0IG1hcCA9IHtcblx0XHQnJic6ICcmYW1wOycsXG5cdFx0JzwnOiAnJmx0OycsXG5cdFx0Jz4nOiAnJmd0OycsXG5cdFx0J1wiJzogJyZxdW90Oydcblx0fTtcblxuXHRyZXR1cm4gaW5wdXQucmVwbGFjZSgvWyY8PlwiXS9nLCAoYykgPT4ge1xuXHRcdHJldHVybiBtYXBbY107XG5cdH0pO1xufVxuXG4vLyB0YWtlbiBmcm9tIHVuZGVyc2NvcmVcbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlID0gZmFsc2UpIHtcblxuXHRpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB3YWl0ICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1lcmljIHZhbHVlJyk7XG5cdH1cblxuXHRsZXQgdGltZW91dDtcblx0cmV0dXJuICgpID0+IHtcblx0XHRsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0bGV0IGxhdGVyID0gKCkgPT4ge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0bGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblxuXHRcdGlmIChjYWxsTm93KSB7XG5cdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGNvbnRhaW5zIGFueSBlbGVtZW50c1xuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Nzk5MTUvaG93LWRvLWktdGVzdC1mb3ItYW4tZW1wdHktamF2YXNjcmlwdC1vYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkgKGluc3RhbmNlKSB7XG5cdHJldHVybiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5zdGFuY2UpLmxlbmd0aCA8PSAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0RXZlbnRzIChldmVudHMsIGlkKSB7XG5cdGxldCByd2luZG93ID0gL14oKGFmdGVyfGJlZm9yZSlwcmludHwoYmVmb3JlKT91bmxvYWR8aGFzaGNoYW5nZXxtZXNzYWdlfG8oZmZ8bilsaW5lfHBhZ2UoaGlkZXxzaG93KXxwb3BzdGF0ZXxyZXNpemV8c3RvcmFnZSlcXGIvO1xuXHQvLyBhZGQgcGxheWVyIElEIGFzIGFuIGV2ZW50IG5hbWVzcGFjZSBzbyBpdCdzIGVhc2llciB0byB1bmJpbmQgdGhlbSBhbGwgbGF0ZXJcblx0bGV0IHJldCA9IHtkOiBbXSwgdzogW119O1xuXHQoZXZlbnRzIHx8ICcnKS5zcGxpdCgnICcpLmZvckVhY2goKHYpID0+IHtcblx0XHRjb25zdCBldmVudE5hbWUgPSB2ICsgJy4nICsgaWQ7XG5cblx0XHRpZiAoZXZlbnROYW1lLnN0YXJ0c1dpdGgoJy4nKSkge1xuXHRcdFx0cmV0LmQucHVzaChldmVudE5hbWUpO1xuXHRcdFx0cmV0LncucHVzaChldmVudE5hbWUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldFtyd2luZG93LnRlc3QodikgPyAndycgOiAnZCddLnB1c2goZXZlbnROYW1lKTtcblx0XHR9XG5cdH0pO1xuXG5cblx0cmV0LmQgPSByZXQuZC5qb2luKCcgJyk7XG5cdHJldC53ID0gcmV0Lncuam9pbignICcpO1xuXHRyZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFnXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAoY2xhc3NOYW1lLCBub2RlLCB0YWcpIHtcblxuXHRpZiAobm9kZSA9PT0gdW5kZWZpbmVkIHx8IG5vZGUgPT09IG51bGwpIHtcblx0XHRub2RlID0gZG9jdW1lbnQ7XG5cdH1cblx0aWYgKG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gdW5kZWZpbmVkICYmIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gbnVsbCkge1xuXHRcdHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKTtcblx0fVxuXHRpZiAodGFnID09PSB1bmRlZmluZWQgfHwgdGFnID09PSBudWxsKSB7XG5cdFx0dGFnID0gJyonO1xuXHR9XG5cblx0bGV0XG5cdFx0Y2xhc3NFbGVtZW50cyA9IFtdLFxuXHRcdGogPSAwLFxuXHRcdHRlc3RzdHIsXG5cdFx0ZWxzID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpLFxuXHRcdGVsc0xlbiA9IGVscy5sZW5ndGhcblx0XHQ7XG5cblx0Zm9yIChpID0gMDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cdFx0aWYgKGVsc1tpXS5jbGFzc05hbWUuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcblx0XHRcdHRlc3RzdHIgPSBgLCR7ZWxzW2ldLmNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJywnKX0sYDtcblx0XHRcdGlmICh0ZXN0c3RyLmluZGV4T2YoYCwke2NsYXNzTmFtZX0sYCkgPiAtMSkge1xuXHRcdFx0XHRjbGFzc0VsZW1lbnRzW2pdID0gZWxzW2ldO1xuXHRcdFx0XHRqKys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNsYXNzRWxlbWVudHM7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5lc2NhcGVIVE1MID0gZXNjYXBlSFRNTDtcbm1lanMuVXRpbHMuZGVib3VuY2UgPSBkZWJvdW5jZTtcbm1lanMuVXRpbHMuaXNPYmplY3RFbXB0eSA9IGlzT2JqZWN0RW1wdHk7XG5tZWpzLlV0aWxzLnNwbGl0RXZlbnRzID0gc3BsaXRFdmVudHM7XG5tZWpzLlV0aWxzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7ZXNjYXBlSFRNTH0gZnJvbSAnLi9nZW5lcmFsJztcblxuZXhwb3J0IGxldCB0eXBlQ2hlY2tzID0gW107XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic29sdXRpemVVcmwgKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGVsLmlubmVySFRNTCA9IGA8YSBocmVmPVwiJHtlc2NhcGVIVE1MKHVybCl9XCI+eDwvYT5gO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5ocmVmO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZm9ybWF0IG9mIGEgc3BlY2lmaWMgbWVkaWEsIGJhc2VkIG9uIFVSTCBhbmQgYWRkaXRpb25hbGx5IGl0cyBtaW1lIHR5cGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VHlwZSAodXJsLCB0eXBlID0gJycpIHtcblx0cmV0dXJuICh1cmwgJiYgIXR5cGUpID8gZ2V0VHlwZUZyb21GaWxlKHVybCkgOiBnZXRNaW1lRnJvbVR5cGUodHlwZSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHBhcnQgb2YgdGhlIHR5cGUgaW4gY2FzZSB0aGUgYXR0cmlidXRlIGNvbnRhaW5zIHRoZSBjb2RlY1xuICogKGB2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcImAgYmVjb21lcyBgdmlkZW8vbXA0YClcbiAqXG4gKiBAc2VlIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3ZpZGVvLmh0bWwjdGhlLXNvdXJjZS1lbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWltZUZyb21UeXBlICh0eXBlKSB7XG5cblx0aWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHR5cGVgIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHJldHVybiAodHlwZSAmJiB+dHlwZS5pbmRleE9mKCc7JykpID8gdHlwZS5zdWJzdHIoMCwgdHlwZS5pbmRleE9mKCc7JykpIDogdHlwZTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHR5cGUgb2YgbWVkaWEgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVGcm9tRmlsZSAodXJsKSB7XG5cblx0aWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdXJsYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgdHlwZTtcblxuXHQvLyBWYWxpZGF0ZSBgdHlwZUNoZWNrc2AgYXJyYXlcblx0aWYgKCFBcnJheS5pc0FycmF5KHR5cGVDaGVja3MpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdHlwZUNoZWNrc2AgbXVzdCBiZSBhbiBhcnJheScpO1xuXHR9XG5cblx0aWYgKHR5cGVDaGVja3MubGVuZ3RoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdHlwZUNoZWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gdHlwZUNoZWNrc1tpXTtcblxuXHRcdFx0aWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBpbiBhcnJheSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBkbyB0eXBlIGNoZWNrcyBmaXJzdFxuXHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0eXBlQ2hlY2tzLmxlbmd0aDsgaSA8IHRvdGFsOyBpKyspIHtcblxuXHRcdHR5cGUgPSB0eXBlQ2hlY2tzW2ldKHVybCk7XG5cblx0XHRpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUgIT09IG51bGwpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblx0fVxuXG5cdC8vIHRoZSBkbyBzdGFuZGFyZCBleHRlbnNpb24gY2hlY2tcblx0bGV0XG5cdFx0ZXh0ID0gZ2V0RXh0ZW5zaW9uKHVybCksXG5cdFx0bm9ybWFsaXplZEV4dCA9IG5vcm1hbGl6ZUV4dGVuc2lvbihleHQpXG5cdFx0O1xuXG5cdHJldHVybiAoLyhtcDR8bTR2fG9nZ3xvZ3Z8d2VibXx3ZWJtdnxmbHZ8d212fG1wZWd8bW92KS9naS50ZXN0KGV4dCkgPyAndmlkZW8nIDogJ2F1ZGlvJykgKyAnLycgKyBub3JtYWxpemVkRXh0O1xufVxuXG4vKipcbiAqIEdldCBtZWRpYSBmaWxlIGV4dGVuc2lvbiBmcm9tIFVSTFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbiAodXJsKSB7XG5cblx0aWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdXJsYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgYmFzZVVybCA9IHVybC5zcGxpdCgnPycpWzBdO1xuXG5cdHJldHVybiB+YmFzZVVybC5pbmRleE9mKCcuJykgPyBiYXNlVXJsLnN1YnN0cmluZyhiYXNlVXJsLmxhc3RJbmRleE9mKCcuJykgKyAxKSA6ICcnO1xufVxuXG4vKipcbiAqIEdldCBzdGFuZGFyZCBleHRlbnNpb24gb2YgYSBtZWRpYSBmaWxlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvblxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRXh0ZW5zaW9uIChleHRlbnNpb24pIHtcblxuXHRpZiAodHlwZW9mIGV4dGVuc2lvbiAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2BleHRlbnNpb25gIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHN3aXRjaCAoZXh0ZW5zaW9uKSB7XG5cdFx0Y2FzZSAnbXA0Jzpcblx0XHRjYXNlICdtNHYnOlxuXHRcdFx0cmV0dXJuICdtcDQnO1xuXHRcdGNhc2UgJ3dlYm0nOlxuXHRcdGNhc2UgJ3dlYm1hJzpcblx0XHRjYXNlICd3ZWJtdic6XG5cdFx0XHRyZXR1cm4gJ3dlYm0nO1xuXHRcdGNhc2UgJ29nZyc6XG5cdFx0Y2FzZSAnb2dhJzpcblx0XHRjYXNlICdvZ3YnOlxuXHRcdFx0cmV0dXJuICdvZ2cnO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xuXHR9XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5hYnNvbHV0aXplVXJsID0gYWJzb2x1dGl6ZVVybDtcbm1lanMuVXRpbHMuZm9ybWF0VHlwZSA9IGZvcm1hdFR5cGU7XG5tZWpzLlV0aWxzLmdldE1pbWVGcm9tVHlwZSA9IGdldE1pbWVGcm9tVHlwZTtcbm1lanMuVXRpbHMuZ2V0VHlwZUZyb21GaWxlID0gZ2V0VHlwZUZyb21GaWxlO1xubWVqcy5VdGlscy5nZXRFeHRlbnNpb24gPSBnZXRFeHRlbnNpb247XG5tZWpzLlV0aWxzLm5vcm1hbGl6ZUV4dGVuc2lvbiA9IG5vcm1hbGl6ZUV4dGVuc2lvbjtcbiIsImltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuXG4vKipcbiAqIFBvbHlmaWxsXG4gKlxuICogTWltaWNzIHRoZSBtaXNzaW5nIG1ldGhvZHMgbGlrZSBPYmplY3QuYXNzaWduLCBBcnJheS5pbmNsdWRlcywgZXRjLiwgYXMgYSB3YXkgdG8gYXZvaWQgaW5jbHVkaW5nIHRoZSB3aG9sZSBsaXN0XG4gKiBvZiBwb2x5ZmlsbHMgcHJvdmlkZWQgYnkgQmFiZWwuXG4gKi9cblxuLy8gSUU2LDcsOFxuLy8gUHJvZHVjdGlvbiBzdGVwcyBvZiBFQ01BLTI2MiwgRWRpdGlvbiA1LCAxNS40LjQuMTRcbi8vIFJlZmVyZW5jZTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMTRcbmlmICghQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcblx0QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSAoc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSA9PiB7XG5cblx0XHRsZXQgaztcblxuXHRcdC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nXG5cdFx0Ly9cdCAgIHRoZSB0aGlzIHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cblx0XHRpZiAodGhpcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMgPT09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcblx0XHR9XG5cblx0XHRsZXQgTyA9IE9iamVjdCh0aGlzKTtcblxuXHRcdC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldFxuXHRcdC8vXHQgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuXHRcdC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuXHRcdGxldCBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuXHRcdC8vIDQuIElmIGxlbiBpcyAwLCByZXR1cm4gLTEuXG5cdFx0aWYgKGxlbiA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdC8vIDUuIElmIGFyZ3VtZW50IGZyb21JbmRleCB3YXMgcGFzc2VkIGxldCBuIGJlXG5cdFx0Ly9cdCAgIFRvSW50ZWdlcihmcm9tSW5kZXgpOyBlbHNlIGxldCBuIGJlIDAuXG5cdFx0bGV0IG4gPSArZnJvbUluZGV4IHx8IDA7XG5cblx0XHRpZiAoTWF0aC5hYnMobikgPT09IEluZmluaXR5KSB7XG5cdFx0XHRuID0gMDtcblx0XHR9XG5cblx0XHQvLyA2LiBJZiBuID49IGxlbiwgcmV0dXJuIC0xLlxuXHRcdGlmIChuID49IGxlbikge1xuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdC8vIDcuIElmIG4gPj0gMCwgdGhlbiBMZXQgayBiZSBuLlxuXHRcdC8vIDguIEVsc2UsIG48MCwgTGV0IGsgYmUgbGVuIC0gYWJzKG4pLlxuXHRcdC8vXHQgICBJZiBrIGlzIGxlc3MgdGhhbiAwLCB0aGVuIGxldCBrIGJlIDAuXG5cdFx0ayA9IE1hdGgubWF4KG4gPj0gMCA/IG4gOiBsZW4gLSBNYXRoLmFicyhuKSwgMCk7XG5cblx0XHQvLyA5LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cblx0XHR3aGlsZSAoayA8IGxlbikge1xuXHRcdFx0Ly8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxuXHRcdFx0Ly8gICBUaGlzIGlzIGltcGxpY2l0IGZvciBMSFMgb3BlcmFuZHMgb2YgdGhlIGluIG9wZXJhdG9yXG5cdFx0XHQvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZVxuXHRcdFx0Ly9cdEhhc1Byb3BlcnR5IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG5cdFx0XHQvLyAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXG5cdFx0XHQvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG5cdFx0XHQvL1x0aS5cdExldCBlbGVtZW50SyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldFxuXHRcdFx0Ly9cdFx0aW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgVG9TdHJpbmcoaykuXG5cdFx0XHQvLyAgIGlpLlx0TGV0IHNhbWUgYmUgdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGVcblx0XHRcdC8vXHRcdFN0cmljdCBFcXVhbGl0eSBDb21wYXJpc29uIEFsZ29yaXRobSB0b1xuXHRcdFx0Ly9cdFx0c2VhcmNoRWxlbWVudCBhbmQgZWxlbWVudEsuXG5cdFx0XHQvLyAgaWlpLlx0SWYgc2FtZSBpcyB0cnVlLCByZXR1cm4gay5cblx0XHRcdGlmIChrIGluIE8gJiYgT1trXSA9PT0gc2VhcmNoRWxlbWVudCkge1xuXHRcdFx0XHRyZXR1cm4gaztcblx0XHRcdH1cblx0XHRcdGsrKztcblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9O1xufVxuXG4vLyBkb2N1bWVudC5jcmVhdGVFdmVudCBmb3IgSUU4IG9yIG90aGVyIG9sZCBicm93c2VycyB0aGF0IGRvIG5vdCBpbXBsZW1lbnQgaXRcbi8vIFJlZmVyZW5jZTogaHR0cHM6Ly9naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vaWU4L2Jsb2IvbWFzdGVyL2J1aWxkL2llOC5tYXguanNcbmlmIChkb2N1bWVudC5jcmVhdGVFdmVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdGRvY3VtZW50LmNyZWF0ZUV2ZW50ID0gKCkgPT4ge1xuXG5cdFx0bGV0IGU7XG5cblx0XHRlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcblx0XHRlLnRpbWVTdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cdFx0ZS5lbnVtZXJhYmxlID0gdHJ1ZTtcblx0XHRlLndyaXRhYmxlID0gdHJ1ZTtcblx0XHRlLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG5cblx0XHRlLmluaXRFdmVudCA9ICh0eXBlLCBidWJibGVzLCBjYW5jZWxhYmxlKSA9PiB7XG5cdFx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdFx0dGhpcy5idWJibGVzID0gISFidWJibGVzO1xuXHRcdFx0dGhpcy5jYW5jZWxhYmxlID0gISFjYW5jZWxhYmxlO1xuXHRcdFx0aWYgKCF0aGlzLmJ1YmJsZXMpIHtcblx0XHRcdFx0dGhpcy5zdG9wUHJvcGFnYXRpb24gPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5zdG9wcGVkUHJvcGFnYXRpb24gPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuY2FuY2VsQnViYmxlID0gdHJ1ZTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGU7XG5cdH07XG59XG5cbi8vIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcbi8vIFJlZmVyZW5jZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbiNQb2x5ZmlsbFxuaWYgKHR5cGVvZiBPYmplY3QuYXNzaWduICE9PSAnZnVuY3Rpb24nKSB7XG5cdE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0LCB2YXJBcmdzKSB7IC8vIC5sZW5ndGggb2YgZnVuY3Rpb24gaXMgMlxuXG5cdFx0J3VzZSBzdHJpY3QnO1xuXHRcdGlmICh0YXJnZXQgPT09IG51bGwgfHwgdGFyZ2V0ID09PSB1bmRlZmluZWQpIHsgLy8gVHlwZUVycm9yIGlmIHVuZGVmaW5lZCBvciBudWxsXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcblx0XHR9XG5cblx0XHRsZXQgdG8gPSBPYmplY3QodGFyZ2V0KTtcblxuXHRcdGZvciAobGV0IGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRsZXQgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG5cblx0XHRcdGlmIChuZXh0U291cmNlICE9PSBudWxsKSB7IC8vIFNraXAgb3ZlciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0XHRmb3IgKGxldCBuZXh0S2V5IGluIG5leHRTb3VyY2UpIHtcblx0XHRcdFx0XHQvLyBBdm9pZCBidWdzIHdoZW4gaGFzT3duUHJvcGVydHkgaXMgc2hhZG93ZWRcblx0XHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5leHRTb3VyY2UsIG5leHRLZXkpKSB7XG5cdFx0XHRcdFx0XHR0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0bztcblx0fTtcbn1cblxuLy8gQXJyYXkuaW5jbHVkZXMgcG9seWZpbGxcbi8vIFJlZmVyZW5jZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaW5jbHVkZXMjUG9seWZpbGxcbmlmICghQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdpbmNsdWRlcycsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XG5cblx0XHRcdC8vIDEuIExldCBPIGJlID8gVG9PYmplY3QodGhpcyB2YWx1ZSkuXG5cdFx0XHRpZiAodGhpcyA9PT0gbnVsbCB8fCB0aGlzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignXCJ0aGlzXCIgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbyA9IE9iamVjdCh0aGlzKTtcblxuXHRcdFx0Ly8gMi4gTGV0IGxlbiBiZSA/IFRvTGVuZ3RoKD8gR2V0KE8sIFwibGVuZ3RoXCIpKS5cblx0XHRcdGxldCBsZW4gPSBvLmxlbmd0aCA+Pj4gMDtcblxuXHRcdFx0Ly8gMy4gSWYgbGVuIGlzIDAsIHJldHVybiBmYWxzZS5cblx0XHRcdGlmIChsZW4gPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyA0LiBMZXQgbiBiZSA/IFRvSW50ZWdlcihmcm9tSW5kZXgpLlxuXHRcdFx0Ly8gICAgKElmIGZyb21JbmRleCBpcyB1bmRlZmluZWQsIHRoaXMgc3RlcCBwcm9kdWNlcyB0aGUgdmFsdWUgMC4pXG5cdFx0XHRsZXQgbiA9IGZyb21JbmRleCB8IDA7XG5cblx0XHRcdC8vIDUuIElmIG4g4omlIDAsIHRoZW5cblx0XHRcdC8vICBhLiBMZXQgayBiZSBuLlxuXHRcdFx0Ly8gNi4gRWxzZSBuIDwgMCxcblx0XHRcdC8vICBhLiBMZXQgayBiZSBsZW4gKyBuLlxuXHRcdFx0Ly8gIGIuIElmIGsgPCAwLCBsZXQgayBiZSAwLlxuXHRcdFx0bGV0IGsgPSBNYXRoLm1heChuID49IDAgPyBuIDogbGVuIC0gTWF0aC5hYnMobiksIDApO1xuXG5cdFx0XHQvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cblx0XHRcdHdoaWxlIChrIDwgbGVuKSB7XG5cdFx0XHRcdC8vIGEuIExldCBlbGVtZW50SyBiZSB0aGUgcmVzdWx0IG9mID8gR2V0KE8sICEgVG9TdHJpbmcoaykpLlxuXHRcdFx0XHQvLyBiLiBJZiBTYW1lVmFsdWVaZXJvKHNlYXJjaEVsZW1lbnQsIGVsZW1lbnRLKSBpcyB0cnVlLCByZXR1cm4gdHJ1ZS5cblx0XHRcdFx0Ly8gYy4gSW5jcmVhc2UgayBieSAxLlxuXHRcdFx0XHQvLyBOT1RFOiA9PT0gcHJvdmlkZXMgdGhlIGNvcnJlY3QgXCJTYW1lVmFsdWVaZXJvXCIgY29tcGFyaXNvbiBuZWVkZWQgaGVyZS5cblx0XHRcdFx0aWYgKG9ba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRrKys7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDguIFJldHVybiBmYWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmlmICghU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcykge1xuXHRTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpICE9PSAtMTtcblx0fTtcbn1cblxuLy8gU3RyaW5nLnN0YXJ0c1dpdGggcG9seWZpbGxcbi8vIFJlZmVyZW5jZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL3N0YXJ0c1dpdGgjUG9seWZpbGxcbmlmICghU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKSB7XG5cdFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHNlYXJjaFN0cmluZywgcG9zaXRpb24pe1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDtcblx0XHRyZXR1cm4gdGhpcy5zdWJzdHIocG9zaXRpb24sIHNlYXJjaFN0cmluZy5sZW5ndGgpID09PSBzZWFyY2hTdHJpbmc7XG5cdH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqIEZvcm1hdCBhIG51bWVyaWMgdGltZSBpbiBmb3JtYXQgJzAwOjAwOjAwJ1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gSWRlYWxseSBhIG51bWJlciwgYnV0IGlmIG5vdCBvciBsZXNzIHRoYW4gemVybywgaXMgZGVmYXVsdGVkIHRvIHplcm9cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2VIb3Vyc1xuICogQHBhcmFtIHtCb29sZWFufSBzaG93RnJhbWVDb3VudFxuICogQHBhcmFtIHtOdW1iZXJ9IGZwcyAtIEZyYW1lcyBwZXIgc2Vjb25kXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWNvbmRzVG9UaW1lQ29kZSAodGltZSwgZm9yY2VIb3VycyA9IGZhbHNlLCBzaG93RnJhbWVDb3VudCA9IGZhbHNlLCBmcHMgPSAyNSkge1xuXG5cdHRpbWUgPSAhdGltZSB8fCB0eXBlb2YgdGltZSAhPT0gJ251bWJlcicgfHwgdGltZSA8IDAgPyAwIDogdGltZTtcblxuXHRsZXQgaG91cnMgPSBNYXRoLmZsb29yKHRpbWUgLyAzNjAwKSAlIDI0O1xuXHRsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwO1xuXHRsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IodGltZSAlIDYwKTtcblx0bGV0IGZyYW1lcyA9IE1hdGguZmxvb3IoKCh0aW1lICUgMSkgKiBmcHMpLnRvRml4ZWQoMykpO1xuXG5cdGhvdXJzID0gaG91cnMgPD0gMCA/IDAgOiBob3Vycztcblx0bWludXRlcyA9IG1pbnV0ZXMgPD0gMCA/IDAgOiBtaW51dGVzO1xuXHRzZWNvbmRzID0gc2Vjb25kcyA8PSAwID8gMCA6IHNlY29uZHM7XG5cblx0bGV0IHJlc3VsdCA9IChmb3JjZUhvdXJzIHx8IGhvdXJzID4gMCkgPyBgJHsoaG91cnMgPCAxMCA/IGAwJHtob3Vyc31gIDogaG91cnMpfTpgIDogJyc7XG5cdHJlc3VsdCArPSBgJHsobWludXRlcyA8IDEwID8gYDAke21pbnV0ZXN9YCA6IG1pbnV0ZXMpfTpgO1xuXHRyZXN1bHQgKz0gYCR7KHNlY29uZHMgPCAxMCA/IGAwJHtzZWNvbmRzfWAgOiBzZWNvbmRzKX1gO1xuXHRyZXN1bHQgKz0gYCR7KChzaG93RnJhbWVDb3VudCkgPyBgOiR7KGZyYW1lcyA8IDEwID8gYDAke2ZyYW1lc31gIDogZnJhbWVzKX1gIDogJycpfWA7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgJzAwOjAwOjAwJyB0aW1lIHN0cmluZyBpbnRvIHNlY29uZHNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGltZVxuICogQHBhcmFtIHtCb29sZWFufSBzaG93RnJhbWVDb3VudFxuICogQHBhcmFtIHtOdW1iZXJ9IGZwcyAtIEZyYW1lcyBwZXIgc2Vjb25kXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lQ29kZVRvU2Vjb25kcyAodGltZSwgc2hvd0ZyYW1lQ291bnQgPSBmYWxzZSwgZnBzID0gMjUpIHtcblxuXHRpZiAodHlwZW9mIHRpbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGltZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRpZiAoIXRpbWUubWF0Y2goL1xcZHsyfShcXDpcXGR7Mn0pezAsM30vKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RpbWUgY29kZSBtdXN0IGhhdmUgdGhlIGZvcm1hdCBgMDA6MDA6MDBgJyk7XG5cdH1cblxuXHRsZXRcblx0XHRwYXJ0cyA9IHRpbWUuc3BsaXQoJzonKSxcblx0XHRob3VycyA9IDAsXG5cdFx0bWludXRlcyA9IDAsXG5cdFx0ZnJhbWVzID0gMCxcblx0XHRzZWNvbmRzID0gMCxcblx0XHRvdXRwdXRcblx0XHQ7XG5cblx0c3dpdGNoIChwYXJ0cy5sZW5ndGgpIHtcblx0XHRkZWZhdWx0OlxuXHRcdGNhc2UgMTpcblx0XHRcdHNlY29uZHMgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAyOlxuXHRcdFx0bWludXRlcyA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG5cdFx0XHRzZWNvbmRzID0gcGFyc2VJbnQocGFydHNbMV0sIDEwKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRjYXNlIDQ6XG5cdFx0XHRob3VycyA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG5cdFx0XHRtaW51dGVzID0gcGFyc2VJbnQocGFydHNbMV0sIDEwKTtcblx0XHRcdHNlY29uZHMgPSBwYXJzZUludChwYXJ0c1syXSwgMTApO1xuXHRcdFx0ZnJhbWVzID0gc2hvd0ZyYW1lQ291bnQgPyBwYXJzZUludChwYXJ0c1szXSkgLyBmcHMgOiAwO1xuXHRcdFx0YnJlYWs7XG5cblx0fVxuXG5cdG91dHB1dCA9ICggaG91cnMgKiAzNjAwICkgKyAoIG1pbnV0ZXMgKiA2MCApICsgc2Vjb25kcyArIGZyYW1lcztcblx0cmV0dXJuIHBhcnNlRmxvYXQoKG91dHB1dCkudG9GaXhlZCgzKSk7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSB0aW1lIGZvcm1hdCB0byB1c2VcbiAqXG4gKiBUaGVyZSBpcyBhIGRlZmF1bHQgZm9ybWF0IHNldCBpbiB0aGUgb3B0aW9ucyBidXQgaXQgY2FuIGJlIGluY29tcGxldGUsIHNvIGl0IGlzIGFkanVzdGVkIGFjY29yZGluZyB0byB0aGUgbWVkaWFcbiAqIGR1cmF0aW9uLiBGb3JtYXQ6ICdoaDptbTpzczpmZidcbiAqIEBwYXJhbSB7Kn0gdGltZSAtIElkZWFsbHkgYSBudW1iZXIsIGJ1dCBpZiBub3Qgb3IgbGVzcyB0aGFuIHplcm8sIGlzIGRlZmF1bHRlZCB0byB6ZXJvXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IGZwcyAtIEZyYW1lcyBwZXIgc2Vjb25kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVUaW1lRm9ybWF0ICh0aW1lLCBvcHRpb25zLCBmcHMgPSAyNSkge1xuXG5cdHRpbWUgPSAhdGltZSB8fCB0eXBlb2YgdGltZSAhPT0gJ251bWJlcicgfHwgdGltZSA8IDAgPyAwIDogdGltZTtcblxuXHRsZXRcblx0XHRyZXF1aXJlZCA9IGZhbHNlLFxuXHRcdGZvcm1hdCA9IG9wdGlvbnMudGltZUZvcm1hdCxcblx0XHRmaXJzdENoYXIgPSBmb3JtYXRbMF0sXG5cdFx0Zmlyc3RUd29QbGFjZXMgPSAoZm9ybWF0WzFdID09PSBmb3JtYXRbMF0pLFxuXHRcdHNlcGFyYXRvckluZGV4ID0gZmlyc3RUd29QbGFjZXMgPyAyIDogMSxcblx0XHRzZXBhcmF0b3IgPSBmb3JtYXQubGVuZ3RoIDwgc2VwYXJhdG9ySW5kZXggPyBmb3JtYXRbc2VwYXJhdG9ySW5kZXhdIDogJzonLFxuXHRcdGhvdXJzID0gTWF0aC5mbG9vcih0aW1lIC8gMzYwMCkgJSAyNCxcblx0XHRtaW51dGVzID0gTWF0aC5mbG9vcih0aW1lIC8gNjApICUgNjAsXG5cdFx0c2Vjb25kcyA9IE1hdGguZmxvb3IodGltZSAlIDYwKSxcblx0XHRmcmFtZXMgPSBNYXRoLmZsb29yKCgodGltZSAlIDEpICogZnBzKS50b0ZpeGVkKDMpKSxcblx0XHRsaXMgPSBbXG5cdFx0XHRbZnJhbWVzLCAnZiddLFxuXHRcdFx0W3NlY29uZHMsICdzJ10sXG5cdFx0XHRbbWludXRlcywgJ20nXSxcblx0XHRcdFtob3VycywgJ2gnXVxuXHRcdF1cblx0XHQ7XG5cblx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdGlmIChmb3JtYXQuaW5kZXhPZihsaXNbaV1bMV0pID4gLTEpIHtcblx0XHRcdHJlcXVpcmVkID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAocmVxdWlyZWQpIHtcblx0XHRcdGxldCBoYXNOZXh0VmFsdWUgPSBmYWxzZTtcblx0XHRcdGZvciAobGV0IGogPSBpOyBqIDwgbGVuOyBqKyspIHtcblx0XHRcdFx0aWYgKGxpc1tqXVswXSA+IDApIHtcblx0XHRcdFx0XHRoYXNOZXh0VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaGFzTmV4dFZhbHVlKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWZpcnN0VHdvUGxhY2VzKSB7XG5cdFx0XHRcdGZvcm1hdCA9IGZpcnN0Q2hhciArIGZvcm1hdDtcblx0XHRcdH1cblx0XHRcdGZvcm1hdCA9IGxpc1tpXVsxXSArIHNlcGFyYXRvciArIGZvcm1hdDtcblx0XHRcdGlmIChmaXJzdFR3b1BsYWNlcykge1xuXHRcdFx0XHRmb3JtYXQgPSBsaXNbaV1bMV0gKyBmb3JtYXQ7XG5cdFx0XHR9XG5cdFx0XHRmaXJzdENoYXIgPSBsaXNbaV1bMV07XG5cdFx0fVxuXHR9XG5cblx0b3B0aW9ucy5jdXJyZW50VGltZUZvcm1hdCA9IGZvcm1hdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IFNvY2lldHkgb2YgTW90aW9uIFBpY3R1cmUgYW5kIFRlbGV2aXNpb24gRW5naW5lZXJzIChTTVRQRSkgdGltZSBjb2RlIGludG8gc2Vjb25kc1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBTTVBURVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFNNUFRFdG9TZWNvbmRzIChTTVBURSkge1xuXG5cdGlmICh0eXBlb2YgU01QVEUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyB2YWx1ZScpO1xuXHR9XG5cblx0U01QVEUgPSBTTVBURS5yZXBsYWNlKCcsJywgJy4nKTtcblxuXHRsZXRcblx0XHRzZWNzID0gMCxcblx0XHRkZWNpbWFsTGVuID0gKFNNUFRFLmluZGV4T2YoJy4nKSA+IC0xKSA/IFNNUFRFLnNwbGl0KCcuJylbMV0ubGVuZ3RoIDogMCxcblx0XHRtdWx0aXBsaWVyID0gMVxuXHRcdDtcblxuXHRTTVBURSA9IFNNUFRFLnNwbGl0KCc6JykucmV2ZXJzZSgpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgU01QVEUubGVuZ3RoOyBpKyspIHtcblx0XHRtdWx0aXBsaWVyID0gMTtcblx0XHRpZiAoaSA+IDApIHtcblx0XHRcdG11bHRpcGxpZXIgPSBNYXRoLnBvdyg2MCwgaSk7XG5cdFx0fVxuXHRcdHNlY3MgKz0gTnVtYmVyKFNNUFRFW2ldKSAqIG11bHRpcGxpZXI7XG5cdH1cblx0cmV0dXJuIE51bWJlcihzZWNzLnRvRml4ZWQoZGVjaW1hbExlbikpO1xufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuc2Vjb25kc1RvVGltZUNvZGUgPSBzZWNvbmRzVG9UaW1lQ29kZTtcbm1lanMuVXRpbHMudGltZUNvZGVUb1NlY29uZHMgPSB0aW1lQ29kZVRvU2Vjb25kcztcbm1lanMuVXRpbHMuY2FsY3VsYXRlVGltZUZvcm1hdCA9IGNhbGN1bGF0ZVRpbWVGb3JtYXQ7XG5tZWpzLlV0aWxzLmNvbnZlcnRTTVBURXRvU2Vjb25kcyA9IGNvbnZlcnRTTVBURXRvU2Vjb25kczsiXX0=
