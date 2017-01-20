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

			if (!t.controlsAreVisible || t.options.alwaysShowControls || t.keyboardAction || t.media.paused && t.media.readyState === 4 && (!t.options.hideVideoControlsOnLoad && t.media.currentTime <= 0 || t.media.currentTime > 0) || t.isVideo && !t.options.hideVideoControlsOnLoad && !t.media.readyState || t.media.ended) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2NvcmUvaTE4bi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lZGlhZWxlbWVudC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lanMuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvY29yZS9yZW5kZXJlci5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9mdWxsc2NyZWVuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3BsYXlwYXVzZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9wcm9ncmVzcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy90aW1lLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3RyYWNrcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy92b2x1bWUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvbGFuZ3VhZ2VzL2VuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2xpYnJhcnkuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcGxheWVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy9kYWlseW1vdGlvbi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvZGFzaC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvZmFjZWJvb2suanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL2ZsYXNoLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy9mbHYuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL2hscy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9yZW5kZXJlcnMvaHRtbDUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL3NvdW5kY2xvdWQuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcmVuZGVyZXJzL3ZpbWVvLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3JlbmRlcmVycy95b3V0dWJlLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3V0aWxzL2NvbnN0YW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9kb20uanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvdXRpbHMvZ2VuZXJhbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9tZWRpYS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9wb2x5ZmlsbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3Ny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QUFZLEdBQVosRUFBaUIsT0FBakIsRUFBUjs7QUFFQSxNQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUN0QyxlQUFhLENBQWI7QUFDQSxNQUFJLElBQUksQ0FBUixFQUFXO0FBQ1YsZ0JBQWEsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLENBQWIsQ0FBYjtBQUNBO0FBQ0QsVUFBUSxPQUFPLE1BQU0sQ0FBTixDQUFQLElBQW1CLFVBQTNCO0FBQ0E7QUFDRCxRQUFPLE9BQU8sS0FBSyxPQUFMLENBQWEsVUFBYixDQUFQLENBQVA7QUFDQTs7QUFFRCxlQUFLLEtBQUwsR0FBYSxlQUFLLEtBQUwsSUFBYyxFQUEzQjtBQUNBLGVBQUssS0FBTCxDQUFXLGlCQUFYLEdBQStCLGlCQUEvQjtBQUNBLGVBQUssS0FBTCxDQUFXLGlCQUFYLEdBQStCLGlCQUEvQjtBQUNBLGVBQUssS0FBTCxDQUFXLG1CQUFYLEdBQWlDLG1CQUFqQztBQUNBLGVBQUssS0FBTCxDQUFXLHFCQUFYLEdBQW1DLHFCQUFuQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCJ2YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIHZhciBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J107XG5cbiAgICBpZiAoIWRvY2N5KSB7XG4gICAgICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXSA9IG1pbkRvYztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xufVxuIiwiaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuL21lanMnO1xuaW1wb3J0IHtFTiBhcyBlbn0gZnJvbSAnLi4vbGFuZ3VhZ2VzL2VuJztcbmltcG9ydCB7ZXNjYXBlSFRNTCwgaXNPYmplY3RFbXB0eX0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJhbCc7XG5cbi8qKlxuICogTG9jYWxlLlxuICpcbiAqIFRoaXMgb2JqZWN0IG1hbmFnZXMgdHJhbnNsYXRpb25zIHdpdGggcGx1cmFsaXphdGlvbi4gQWxzbyBkZWFscyB3aXRoIFdvcmRQcmVzcyBjb21wYXRpYmlsaXR5LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xubGV0IGkxOG4gPSB7bGFuZzogJ2VuJywgZW46IGVufTtcblxuLyoqXG4gKiBMYW5ndWFnZSBzZXR0ZXIvZ2V0dGVyXG4gKlxuICogQHBhcmFtIHsqfSBhcmdzICBDYW4gcGFzcyB0aGUgbGFuZ3VhZ2UgY29kZSBhbmQvb3IgdGhlIHRyYW5zbGF0aW9uIHN0cmluZ3MgYXMgYW4gT2JqZWN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmkxOG4ubGFuZ3VhZ2UgPSAoLi4uYXJncykgPT4ge1xuXG5cdGlmIChhcmdzICE9PSBudWxsICYmIGFyZ3MgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmxlbmd0aCkge1xuXG5cdFx0aWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignTGFuZ3VhZ2UgY29kZSBtdXN0IGJlIGEgc3RyaW5nIHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0aWYgKCFhcmdzWzBdLm1hdGNoKC9eW2Etel17Mn0oXFwtW2Etel17Mn0pPyQvaSkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0xhbmd1YWdlIGNvZGUgbXVzdCBoYXZlIGZvcm1hdCBgeHhgIG9yIGB4eC14eGAnKTtcblx0XHR9XG5cblx0XHRpMThuLmxhbmcgPSBhcmdzWzBdO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgbGFuZ3VhZ2Ugc3RyaW5ncyB3ZXJlIGFkZGVkOyBvdGhlcndpc2UsIGNoZWNrIHRoZSBzZWNvbmQgYXJndW1lbnQgb3Igc2V0IHRvIEVuZ2xpc2ggYXMgZGVmYXVsdFxuXHRcdGlmIChpMThuW2FyZ3NbMF1dID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGFyZ3NbMV0gPSBhcmdzWzFdICE9PSBudWxsICYmIGFyZ3NbMV0gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcgPyBhcmdzWzFdIDoge307XG5cdFx0XHRpMThuW2FyZ3NbMF1dID0gIWlzT2JqZWN0RW1wdHkoYXJnc1sxXSkgPyBhcmdzWzFdIDogZW47XG5cdFx0fSBlbHNlIGlmIChhcmdzWzFdICE9PSBudWxsICYmIGFyZ3NbMV0gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGkxOG5bYXJnc1swXV0gPSBhcmdzWzFdO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBpMThuLmxhbmc7XG59O1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIHN0cmluZyBpbiB0aGUgbGFuZ3VhZ2Ugc2V0IHVwIChvciBFbmdsaXNoIGJ5IGRlZmF1bHQpXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbHVyYWxQYXJhbVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5pMThuLnQgPSAobWVzc2FnZSwgcGx1cmFsUGFyYW0gPSBudWxsKSA9PiB7XG5cblx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyAmJiBtZXNzYWdlLmxlbmd0aCkge1xuXG5cdFx0bGV0XG5cdFx0XHRzdHIsXG5cdFx0XHRwbHVyYWxGb3JtXG5cdFx0XHQ7XG5cblx0XHRjb25zdCBsYW5ndWFnZSA9IGkxOG4ubGFuZ3VhZ2UoKTtcblxuXHRcdC8qKlxuXHRcdCAqIE1vZGlmeSBzdHJpbmcgdXNpbmcgYWxnb3JpdGhtIHRvIGRldGVjdCBwbHVyYWwgZm9ybXMuXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzUzNDA4L21lc3NhZ2Vmb3JtYXQtaW4tamF2YXNjcmlwdC1wYXJhbWV0ZXJzLWluLWxvY2FsaXplZC11aS1zdHJpbmdzXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW119IGlucHV0ICAgLSBTdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyB0byBwaWNrIHRoZSBwbHVyYWwgZm9ybVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgICAgICAgICAgIC0gTnVtYmVyIHRvIGRldGVybWluZSB0aGUgcHJvcGVyIHBsdXJhbCBmb3JtXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGZvcm0gICAgICAgICAgICAgLSBOdW1iZXIgb2YgbGFuZ3VhZ2UgZmFtaWx5IHRvIGFwcGx5IHBsdXJhbCBmb3JtXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGNvbnN0IF9wbHVyYWwgPSAoaW5wdXQsIG51bWJlciwgZm9ybSkgPT4ge1xuXG5cdFx0XHRpZiAodHlwZW9mIGlucHV0ICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgZm9ybSAhPT0gJ251bWJlcicpIHtcblx0XHRcdFx0cmV0dXJuIGlucHV0O1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbltdfVxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0bGV0IF9wbHVyYWxGb3JtcyA9ICgoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Ly8gMDogQ2hpbmVzZSwgSmFwYW5lc2UsIEtvcmVhbiwgUGVyc2lhbiwgVHVya2lzaCwgVGhhaSwgTGFvLCBBeW1hcsOhLFxuXHRcdFx0XHRcdC8vIFRpYmV0YW4sIENoaWdhLCBEem9uZ2toYSwgSW5kb25lc2lhbiwgTG9qYmFuLCBHZW9yZ2lhbiwgS2F6YWtoLCBLaG1lciwgS3lyZ3l6LCBNYWxheSxcblx0XHRcdFx0XHQvLyBCdXJtZXNlLCBZYWt1dCwgU3VuZGFuZXNlLCBUYXRhciwgVXlnaHVyLCBWaWV0bmFtZXNlLCBXb2xvZlxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiBhcmdzWzFdLFxuXG5cdFx0XHRcdFx0Ly8gMTogRGFuaXNoLCBEdXRjaCwgRW5nbGlzaCwgRmFyb2VzZSwgRnJpc2lhbiwgR2VybWFuLCBOb3J3ZWdpYW4sIFN3ZWRpc2gsIEVzdG9uaWFuLCBGaW5uaXNoLFxuXHRcdFx0XHRcdC8vIEh1bmdhcmlhbiwgQmFzcXVlLCBHcmVlaywgSGVicmV3LCBJdGFsaWFuLCBQb3J0dWd1ZXNlLCBTcGFuaXNoLCBDYXRhbGFuLCBBZnJpa2FhbnMsXG5cdFx0XHRcdFx0Ly8gQW5naWthLCBBc3NhbWVzZSwgQXN0dXJpYW4sIEF6ZXJiYWlqYW5pLCBCdWxnYXJpYW4sIEJlbmdhbGksIEJvZG8sIEFyYWdvbmVzZSwgRG9ncmksXG5cdFx0XHRcdFx0Ly8gRXNwZXJhbnRvLCBBcmdlbnRpbmVhbiBTcGFuaXNoLCBGdWxhaCwgRnJpdWxpYW4sIEdhbGljaWFuLCBHdWphcmF0aSwgSGF1c2EsXG5cdFx0XHRcdFx0Ly8gSGluZGksIENoaGF0dGlzZ2FyaGksIEFybWVuaWFuLCBJbnRlcmxpbmd1YSwgR3JlZW5sYW5kaWMsIEthbm5hZGEsIEt1cmRpc2gsIExldHplYnVyZ2VzY2gsXG5cdFx0XHRcdFx0Ly8gTWFpdGhpbGksIE1hbGF5YWxhbSwgTW9uZ29saWFuLCBNYW5pcHVyaSwgTWFyYXRoaSwgTmFodWF0bCwgTmVhcG9saXRhbiwgTm9yd2VnaWFuIEJva21hbCxcblx0XHRcdFx0XHQvLyBOZXBhbGksIE5vcndlZ2lhbiBOeW5vcnNrLCBOb3J3ZWdpYW4gKG9sZCBjb2RlKSwgTm9ydGhlcm4gU290aG8sIE9yaXlhLCBQdW5qYWJpLCBQYXBpYW1lbnRvLFxuXHRcdFx0XHRcdC8vIFBpZW1vbnRlc2UsIFBhc2h0bywgUm9tYW5zaCwgS2lueWFyd2FuZGEsIFNhbnRhbGksIFNjb3RzLCBTaW5kaGksIE5vcnRoZXJuIFNhbWksIFNpbmhhbGEsXG5cdFx0XHRcdFx0Ly8gU29tYWxpLCBTb25naGF5LCBBbGJhbmlhbiwgU3dhaGlsaSwgVGFtaWwsIFRlbHVndSwgVHVya21lbiwgVXJkdSwgWW9ydWJhXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IChhcmdzWzBdID09PSAxKSA/IGFyZ3NbMV0gOiBhcmdzWzJdLFxuXG5cdFx0XHRcdFx0Ly8gMjogRnJlbmNoLCBCcmF6aWxpYW4gUG9ydHVndWVzZSwgQWNob2xpLCBBa2FuLCBBbWhhcmljLCBNYXB1ZHVuZ3VuLCBCcmV0b24sIEZpbGlwaW5vLFxuXHRcdFx0XHRcdC8vIEd1biwgTGluZ2FsYSwgTWF1cml0aWFuIENyZW9sZSwgTWFsYWdhc3ksIE1hb3JpLCBPY2NpdGFuLCBUYWppaywgVGlncmlueWEsIFV6YmVrLCBXYWxsb29uXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IChhcmdzWzBdID09PSAwIHx8IGFyZ3NbMF0gPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl0sXG5cblx0XHRcdFx0XHQvLyAzOiBMYXR2aWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAgPT09IDEgJiYgYXJnc1swXSAlIDEwMCAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gIT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNDogU2NvdHRpc2ggR2FlbGljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxIHx8IGFyZ3NbMF0gPT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyIHx8IGFyZ3NbMF0gPT09IDEyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID4gMiAmJiBhcmdzWzBdIDwgMjApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNTogIFJvbWFuaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAwIHx8IChhcmdzWzBdICUgMTAwID4gMCAmJiBhcmdzWzBdICUgMTAwIDwgMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDY6IExpdGh1YW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDc6IEJlbGFydXNpYW4sIEJvc25pYW4sIENyb2F0aWFuLCBTZXJiaWFuLCBSdXNzaWFuLCBVa3JhaW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA4OiAgU2xvdmFrLCBDemVjaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+PSAyICYmIGFyZ3NbMF0gPD0gNCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA5OiBQb2xpc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA+PSAyICYmIGFyZ3NbMF0gJSAxMCA8PSA0ICYmIChhcmdzWzBdICUgMTAwIDwgMTAgfHwgYXJnc1swXSAlIDEwMCA+PSAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTA6IFNsb3ZlbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwMCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA9PT0gMyB8fCBhcmdzWzBdICUgMTAwID09PSA0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDExOiBJcmlzaCBHYWVsaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiAyICYmIGFyZ3NbMF0gPCA3KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID4gNiAmJiBhcmdzWzBdIDwgMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s1XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTI6IEFyYWJpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+PSAzICYmIGFyZ3NbMF0gJSAxMDAgPD0gMTApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPj0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNV07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s2XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTM6IE1hbHRlc2Vcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDAgfHwgKGFyZ3NbMF0gJSAxMDAgPiAxICYmIGFyZ3NbMF0gJSAxMDAgPCAxMSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPiAxMCAmJiBhcmdzWzBdICUgMTAwIDwgMjApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTQ6IE1hY2Vkb25pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE1OiAgSWNlbGFuZGljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiAoYXJnc1swXSAhPT0gMTEgJiYgYXJnc1swXSAlIDEwID09PSAxKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyBOZXcgYWRkaXRpb25zXG5cblx0XHRcdFx0XHQvLyAxNjogIEthc2h1YmlhblxuXHRcdFx0XHRcdC8vIEluIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9Mb2NhbGl6YXRpb24vTG9jYWxpemF0aW9uX2FuZF9QbHVyYWxzI0xpc3Rfb2ZfX3BsdXJhbFJ1bGVzXG5cdFx0XHRcdFx0Ly8gQnJldG9uIGlzIGxpc3RlZCBhcyAjMTYgYnV0IGluIHRoZSBMb2NhbGl6YXRpb24gR3VpZGUgaXQgYmVsb25ncyB0byB0aGUgZ3JvdXAgMlxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fFxuXHRcdFx0XHRcdFx0XHRhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxNzogIFdlbHNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICE9PSA4ICYmIGFyZ3NbMF0gIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE4OiAgSmF2YW5lc2Vcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIChhcmdzWzBdID09PSAwKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxOTogIENvcm5pc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMjA6ICBNYW5kaW5rYVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRdO1xuXHRcdFx0fSkoKTtcblxuXHRcdFx0Ly8gUGVyZm9ybSBwbHVyYWwgZm9ybSBvciByZXR1cm4gb3JpZ2luYWwgdGV4dFxuXHRcdFx0cmV0dXJuIF9wbHVyYWxGb3Jtc1tmb3JtXS5hcHBseShudWxsLCBbbnVtYmVyXS5jb25jYXQoaW5wdXQpKTtcblx0XHR9O1xuXG5cdFx0Ly8gRmV0Y2ggdGhlIGxvY2FsaXplZCB2ZXJzaW9uIG9mIHRoZSBzdHJpbmdcblx0XHRpZiAoaTE4bltsYW5ndWFnZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0c3RyID0gaTE4bltsYW5ndWFnZV1bbWVzc2FnZV07XG5cdFx0XHRpZiAocGx1cmFsUGFyYW0gIT09IG51bGwgJiYgdHlwZW9mIHBsdXJhbFBhcmFtID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRwbHVyYWxGb3JtID0gaTE4bltsYW5ndWFnZV1bJ21lanMucGx1cmFsLWZvcm0nXTtcblx0XHRcdFx0c3RyID0gX3BsdXJhbC5hcHBseShudWxsLCBbc3RyLCBwbHVyYWxQYXJhbSwgcGx1cmFsRm9ybV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZhbGxiYWNrIHRvIGRlZmF1bHQgbGFuZ3VhZ2UgaWYgcmVxdWVzdGVkIHVpZCBpcyBub3QgdHJhbnNsYXRlZFxuXHRcdGlmICghc3RyICYmIGkxOG4uZW4pIHtcblx0XHRcdHN0ciA9IGkxOG4uZW5bbWVzc2FnZV07XG5cdFx0XHRpZiAocGx1cmFsUGFyYW0gIT09IG51bGwgJiYgdHlwZW9mIHBsdXJhbFBhcmFtID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRwbHVyYWxGb3JtID0gaTE4bi5lblsnbWVqcy5wbHVyYWwtZm9ybSddO1xuXHRcdFx0XHRzdHIgPSBfcGx1cmFsLmFwcGx5KG51bGwsIFtzdHIsIHBsdXJhbFBhcmFtLCBwbHVyYWxGb3JtXSk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBcyBhIGxhc3QgcmVzb3J0LCB1c2UgdGhlIHJlcXVlc3RlZCB1aWQsIHRvIG1pbWljIG9yaWdpbmFsIGJlaGF2aW9yIG9mIGkxOG4gdXRpbHNcblx0XHQvLyAoaW4gd2hpY2ggdWlkIHdhcyB0aGUgZW5nbGlzaCB0ZXh0KVxuXHRcdHN0ciA9IHN0ciB8fCBtZXNzYWdlO1xuXG5cdFx0Ly8gUmVwbGFjZSB0b2tlblxuXHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgnJTEnLCBwbHVyYWxQYXJhbSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVzY2FwZUhUTUwoc3RyKTtcblxuXHR9XG5cblx0cmV0dXJuIG1lc3NhZ2U7XG59O1xuXG5tZWpzLmkxOG4gPSBpMThuO1xuXG4vLyBgaTE4bmAgY29tcGF0aWJpbGl0eSB3b3JrZmxvdyB3aXRoIFdvcmRQcmVzc1xuaWYgKHR5cGVvZiBtZWpzTDEwbiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy5pMThuLmxhbmd1YWdlKG1lanNMMTBuLmxhbmd1YWdlLCBtZWpzTDEwbi5zdHJpbmdzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaTE4bjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5pbXBvcnQge2dldFR5cGVGcm9tRmlsZSwgZm9ybWF0VHlwZSwgYWJzb2x1dGl6ZVVybH0gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qKlxuICogTWVkaWEgQ29yZVxuICpcbiAqIFRoaXMgY2xhc3MgaXMgdGhlIGZvdW5kYXRpb24gdG8gY3JlYXRlL3JlbmRlciBkaWZmZXJlbnQgbWVkaWEgZm9ybWF0cy5cbiAqIEBjbGFzcyBNZWRpYUVsZW1lbnRcbiAqL1xuY2xhc3MgTWVkaWFFbGVtZW50IHtcblxuXHRjb25zdHJ1Y3RvciAoaWRPck5vZGUsIG9wdGlvbnMpIHtcblx0XHRcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0XG5cdFx0dC5kZWZhdWx0cyA9IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogTGlzdCBvZiB0aGUgcmVuZGVyZXJzIHRvIHVzZVxuXHRcdFx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHRcdFx0ICovXG5cdFx0XHRyZW5kZXJlcnM6IFtdLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBOYW1lIG9mIE1lZGlhRWxlbWVudCBjb250YWluZXJcblx0XHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0XHQgKi9cblx0XHRcdGZha2VOb2RlTmFtZTogJ21lZGlhZWxlbWVudHdyYXBwZXInLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgcGF0aCB3aGVyZSBzaGltcyBhcmUgbG9jYXRlZFxuXHRcdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHRcdCAqL1xuXHRcdFx0cGx1Z2luUGF0aDogJ2J1aWxkLydcblx0XHR9O1xuXG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odC5kZWZhdWx0cywgb3B0aW9ucyk7XG5cblx0XHQvLyBjcmVhdGUgb3VyIG5vZGUgKG5vdGU6IG9sZGVyIHZlcnNpb25zIG9mIGlPUyBkb24ndCBzdXBwb3J0IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBvbiBET00gbm9kZXMpXG5cdFx0dC5tZWRpYUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMuZmFrZU5vZGVOYW1lKTtcblx0XHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zID0gb3B0aW9ucztcblxuXHRcdGxldFxuXHRcdFx0aWQgPSBpZE9yTm9kZSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdGlmICh0eXBlb2YgaWRPck5vZGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9yTm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9IGlkT3JOb2RlO1xuXHRcdFx0aWQgPSBpZE9yTm9kZS5pZDtcblx0XHR9XG5cblx0XHRpZCA9IGlkIHx8IGBtZWpzXyR7KE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyKSl9YDtcblxuXHRcdGlmICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwgJiZcblx0XHRcdHQubWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKSB7XG5cdFx0XHQvLyBjaGFuZ2UgaWRcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7aWR9X2Zyb21fbWVqc2ApO1xuXG5cdFx0XHQvLyBhZGQgbmV4dCB0byB0aGlzIG9uZVxuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHQubWVkaWFFbGVtZW50LCB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXG5cdFx0XHQvLyBpbnNlcnQgdGhpcyBvbmUgaW5zaWRlXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5hcHBlbmRDaGlsZCh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUT0RPOiB3aGVyZSB0byBwdXQgdGhlIG5vZGU/XG5cdFx0fVxuXG5cdFx0dC5tZWRpYUVsZW1lbnQuaWQgPSBpZDtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnMgPSB7fTtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG51bGw7XG5cdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJOYW1lID0gbnVsbDtcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgcmVuZGVyZXIgd2FzIGZvdW5kIG9yIG5vdFxuXHRcdCAqXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSByZW5kZXJlck5hbWVcblx0XHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHR0Lm1lZGlhRWxlbWVudC5jaGFuZ2VSZW5kZXJlciA9IChyZW5kZXJlck5hbWUsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0XHQvLyBjaGVjayBmb3IgYSBtYXRjaCBvbiB0aGUgY3VycmVudCByZW5kZXJlclxuXHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwgJiZcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIubmFtZSA9PT0gcmVuZGVyZXJOYW1lKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnBhdXNlKCk7XG5cdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnNob3coKTtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc2V0U3JjKG1lZGlhRmlsZXNbMF0uc3JjKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIGV4aXN0aW5nIHJlbmRlcmVyIGlzIG5vdCB0aGUgcmlnaHQgb25lLCB0aGVuIGhpZGUgaXRcblx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnBhdXNlKCk7XG5cdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2VlIGlmIHdlIGhhdmUgdGhlIHJlbmRlcmVyIGFscmVhZHkgY3JlYXRlZFxuXHRcdFx0bGV0IG5ld1JlbmRlcmVyID0gdC5tZWRpYUVsZW1lbnQucmVuZGVyZXJzW3JlbmRlcmVyTmFtZV0sXG5cdFx0XHRcdG5ld1JlbmRlcmVyVHlwZSA9IG51bGw7XG5cblx0XHRcdGlmIChuZXdSZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIG5ld1JlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdG5ld1JlbmRlcmVyLnNob3coKTtcblx0XHRcdFx0bmV3UmVuZGVyZXIuc2V0U3JjKG1lZGlhRmlsZXNbMF0uc3JjKTtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJOYW1lID0gcmVuZGVyZXJOYW1lO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHJlbmRlcmVyQXJyYXkgPSB0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycy5sZW5ndGggPyB0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycyA6XG5cdFx0XHRcdHJlbmRlcmVyLm9yZGVyO1xuXG5cdFx0XHQvLyBmaW5kIHRoZSBkZXNpcmVkIHJlbmRlcmVyIGluIHRoZSBhcnJheSBvZiBwb3NzaWJsZSBvbmVzXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHJlbmRlcmVyQXJyYXkubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gcmVuZGVyZXJBcnJheVtpXTtcblxuXHRcdFx0XHRpZiAoaW5kZXggPT09IHJlbmRlcmVyTmFtZSkge1xuXG5cdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSByZW5kZXJlclxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVyTGlzdCA9IHJlbmRlcmVyLnJlbmRlcmVycztcblx0XHRcdFx0XHRuZXdSZW5kZXJlclR5cGUgPSByZW5kZXJlckxpc3RbaW5kZXhdO1xuXG5cdFx0XHRcdFx0bGV0IHJlbmRlck9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG5ld1JlbmRlcmVyVHlwZS5vcHRpb25zLCB0Lm1lZGlhRWxlbWVudC5vcHRpb25zKTtcblx0XHRcdFx0XHRuZXdSZW5kZXJlciA9IG5ld1JlbmRlcmVyVHlwZS5jcmVhdGUodC5tZWRpYUVsZW1lbnQsIHJlbmRlck9wdGlvbnMsIG1lZGlhRmlsZXMpO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyLm5hbWUgPSByZW5kZXJlck5hbWU7XG5cblx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgbGF0ZXJcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnNbbmV3UmVuZGVyZXJUeXBlLm5hbWVdID0gbmV3UmVuZGVyZXI7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSByZW5kZXJlck5hbWU7XG5cblx0XHRcdFx0XHRuZXdSZW5kZXJlci5zaG93KCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNldCB0aGUgZWxlbWVudCBkaW1lbnNpb25zIGJhc2VkIG9uIHNlbGVjdGVkIHJlbmRlcmVyJ3Mgc2V0U2l6ZSBtZXRob2Rcblx0XHQgKlxuXHRcdCAqIEBwdWJsaWNcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG5cdFx0ICovXG5cdFx0dC5tZWRpYUVsZW1lbnQuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdG1ldGhvZHMgPSBtZWpzLmh0bWw1bWVkaWEubWV0aG9kcyxcblx0XHRcdGFkZFByb3BlcnR5ID0gKG9iaiwgbmFtZSwgb25HZXQsIG9uU2V0KSA9PiB7XG5cblx0XHRcdFx0Ly8gd3JhcHBlciBmdW5jdGlvbnNcblx0XHRcdFx0bGV0IG9sZFZhbHVlID0gb2JqW25hbWVdO1xuXHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdGdldEZuID0gKCkgPT4gb25HZXQuYXBwbHkob2JqLCBbb2xkVmFsdWVdKSxcblx0XHRcdFx0XHRzZXRGbiA9IChuZXdWYWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0b2xkVmFsdWUgPSBvblNldC5hcHBseShvYmosIFtuZXdWYWx1ZV0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9sZFZhbHVlO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gTW9kZXJuIGJyb3dzZXJzLCBJRTkrIChJRTggb25seSB3b3JrcyBvbiBET00gb2JqZWN0cywgbm90IG5vcm1hbCBKUyBvYmplY3RzKVxuXHRcdFx0XHRpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG5cblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG5cdFx0XHRcdFx0XHRnZXQ6IGdldEZuLFxuXHRcdFx0XHRcdFx0c2V0OiBzZXRGblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gT2xkZXIgRmlyZWZveFxuXHRcdFx0XHR9IGVsc2UgaWYgKG9iai5fX2RlZmluZUdldHRlcl9fKSB7XG5cblx0XHRcdFx0XHRvYmouX19kZWZpbmVHZXR0ZXJfXyhuYW1lLCBnZXRGbik7XG5cdFx0XHRcdFx0b2JqLl9fZGVmaW5lU2V0dGVyX18obmFtZSwgc2V0Rm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHByb3BOYW1lICE9PSAnc3JjJykge1xuXG5cdFx0XHRcdFx0Y29uc3Rcblx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gLFxuXHRcdFx0XHRcdFx0Z2V0Rm4gPSAoKSA9PiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkgPyB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcltgZ2V0JHtjYXBOYW1lfWBdKCkgOiBudWxsLFxuXHRcdFx0XHRcdFx0c2V0Rm4gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcltgc2V0JHtjYXBOYW1lfWBdKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGFkZFByb3BlcnR5KHQubWVkaWFFbGVtZW50LCBwcm9wTmFtZSwgZ2V0Rm4sIHNldEZuKTtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudFtgZ2V0JHtjYXBOYW1lfWBdID0gZ2V0Rm47XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnRbYHNldCR7Y2FwTmFtZX1gXSA9IHNldEZuO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Ly8gYHNyY2AgaXMgYSBwcm9wZXJ0eSBzZXBhcmF0ZWQgZnJvbSB0aGUgb3RoZXJzIHNpbmNlIGl0IGNhcnJpZXMgdGhlIGxvZ2ljIHRvIHNldCB0aGUgcHJvcGVyIHJlbmRlcmVyXG5cdFx0XHQvLyBiYXNlZCBvbiB0aGUgbWVkaWEgZmlsZXMgZGV0ZWN0ZWRcblx0XHRcdGdldFNyYyA9ICgpID0+ICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSA/IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLmdldFNyYygpIDogbnVsbCxcblx0XHRcdHNldFNyYyA9ICh2YWx1ZSkgPT4ge1xuXG5cdFx0XHRcdGxldCBtZWRpYUZpbGVzID0gW107XG5cblx0XHRcdFx0Ly8gY2xlYW4gdXAgVVJMc1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRzcmM6IHZhbHVlLFxuXHRcdFx0XHRcdFx0dHlwZTogdmFsdWUgPyBnZXRUeXBlRnJvbUZpbGUodmFsdWUpIDogJydcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdHNyYyA9IGFic29sdXRpemVVcmwodmFsdWVbaV0uc3JjKSxcblx0XHRcdFx0XHRcdFx0dHlwZSA9IHZhbHVlW2ldLnR5cGVcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0c3JjOiBzcmMsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICh0eXBlID09PSAnJyB8fCB0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCkgJiYgc3JjID9cblx0XHRcdFx0XHRcdFx0XHRnZXRUeXBlRnJvbUZpbGUoc3JjKSA6IHR5cGVcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmluZCBhIHJlbmRlcmVyIGFuZCBVUkwgbWF0Y2hcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0cmVuZGVySW5mbyA9IHJlbmRlcmVyLnNlbGVjdChtZWRpYUZpbGVzLFxuXHRcdFx0XHRcdFx0KHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzLmxlbmd0aCA/IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzIDogW10pKSxcblx0XHRcdFx0XHRldmVudFxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0Ly8gRW5zdXJlIHRoYXQgdGhlIG9yaWdpbmFsIGdldHMgdGhlIGZpcnN0IHNvdXJjZSBmb3VuZFxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCAobWVkaWFGaWxlc1swXS5zcmMgfHwgJycpKTtcblxuXHRcdFx0XHQvLyBkaWQgd2UgZmluZCBhIHJlbmRlcmVyP1xuXHRcdFx0XHRpZiAocmVuZGVySW5mbyA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoJ2Vycm9yJywgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHRldmVudC5tZXNzYWdlID0gJ05vIHJlbmRlcmVyIGZvdW5kJztcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB0dXJuIG9uIHRoZSByZW5kZXJlciAodGhpcyBjaGVja3MgZm9yIHRoZSBleGlzdGluZyByZW5kZXJlciBhbHJlYWR5KVxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5jaGFuZ2VSZW5kZXJlcihyZW5kZXJJbmZvLnJlbmRlcmVyTmFtZSwgbWVkaWFGaWxlcyk7XG5cblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID09PSB1bmRlZmluZWQgfHwgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KCdlcnJvcicsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0ZXZlbnQubWVzc2FnZSA9ICdFcnJvciBjcmVhdGluZyByZW5kZXJlcic7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIGN1cnJlbnQgcmVuZGVyZXJcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnRbbWV0aG9kTmFtZV0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdHJldHVybiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCAmJlxuXHRcdFx0XHRcdFx0dHlwZW9mIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW21ldGhvZE5hbWVdID09PSAnZnVuY3Rpb24nKSA/XG5cdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlclttZXRob2ROYW1lXShhcmdzKSA6IG51bGw7XG5cdFx0XHRcdH07XG5cblx0XHRcdH07XG5cblx0XHQvLyBBc3NpZ24gYWxsIG1ldGhvZHMvcHJvcGVydGllcy9ldmVudHMgdG8gZmFrZSBub2RlIGlmIHJlbmRlcmVyIHdhcyBmb3VuZFxuXHRcdGFkZFByb3BlcnR5KHQubWVkaWFFbGVtZW50LCAnc3JjJywgZ2V0U3JjLCBzZXRTcmMpO1xuXHRcdHQubWVkaWFFbGVtZW50LmdldFNyYyA9IGdldFNyYztcblx0XHR0Lm1lZGlhRWxlbWVudC5zZXRTcmMgPSBzZXRTcmM7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJRSAmJiBpT1Ncblx0XHRpZiAoIXQubWVkaWFFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcblxuXHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzID0ge307XG5cblx0XHRcdC8vIHN0YXJ0OiBmYWtlIGV2ZW50c1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9IChldmVudE5hbWUsIGNhbGxiYWNrKSA9PiB7XG5cdFx0XHRcdC8vIGNyZWF0ZSBvciBmaW5kIHRoZSBhcnJheSBvZiBjYWxsYmFja3MgZm9yIHRoaXMgZXZlbnROYW1lXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG5cblx0XHRcdFx0Ly8gcHVzaCB0aGUgY2FsbGJhY2sgaW50byB0aGUgc3RhY2tcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG5cdFx0XHR9O1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IChldmVudE5hbWUsIGNhbGxiYWNrKSA9PiB7XG5cdFx0XHRcdC8vIG5vIGV2ZW50TmFtZSBtZWFucyByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRpZiAoIWV2ZW50TmFtZSkge1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50cyA9IHt9O1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc2VlIGlmIHdlIGhhdmUgYW55IGNhbGxiYWNrcyBmb3IgdGhpcyBldmVudE5hbWVcblx0XHRcdFx0bGV0IGNhbGxiYWNrcyA9IHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdO1xuXG5cdFx0XHRcdGlmICghY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjaGVjayBmb3IgYSBzcGVjaWZpYyBjYWxsYmFja1xuXHRcdFx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gPSBbXTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgc3BlY2lmaWMgY2FsbGJhY2tcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdFx0XHQgKi9cblx0XHRcdHQubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQgPSAoZXZlbnQpID0+IHtcblxuXHRcdFx0XHRsZXQgY2FsbGJhY2tzID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50LnR5cGVdO1xuXG5cdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgW2V2ZW50XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwpIHtcblx0XHRcdGxldCBtZWRpYUZpbGVzID0gW107XG5cblx0XHRcdHN3aXRjaCAodC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcblxuXHRcdFx0XHRjYXNlICdpZnJhbWUnOlxuXHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR0eXBlOiAnJyxcblx0XHRcdFx0XHRcdHNyYzogdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnc3JjJylcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2F1ZGlvJzpcblx0XHRcdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0bixcblx0XHRcdFx0XHRcdHNyYyxcblx0XHRcdFx0XHRcdHR5cGUsXG5cdFx0XHRcdFx0XHRzb3VyY2VzID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmNoaWxkTm9kZXMubGVuZ3RoLFxuXHRcdFx0XHRcdFx0bm9kZVNvdXJjZSA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHQvLyBDb25zaWRlciBpZiBub2RlIGNvbnRhaW5zIHRoZSBgc3JjYCBhbmQgYHR5cGVgIGF0dHJpYnV0ZXNcblx0XHRcdFx0XHRpZiAobm9kZVNvdXJjZSkge1xuXHRcdFx0XHRcdFx0bGV0IG5vZGUgPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGU7XG5cdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBmb3JtYXRUeXBlKG5vZGVTb3VyY2UsIG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykpLFxuXHRcdFx0XHRcdFx0XHRzcmM6IG5vZGVTb3VyY2Vcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHRlc3QgPHNvdXJjZT4gdHlwZXMgdG8gc2VlIGlmIHRoZXkgYXJlIHVzYWJsZVxuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBzb3VyY2VzOyBpKyspIHtcblx0XHRcdFx0XHRcdG4gPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdGlmIChuLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBuLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NvdXJjZScpIHtcblx0XHRcdFx0XHRcdFx0c3JjID0gbi5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXHRcdFx0XHRcdFx0XHR0eXBlID0gZm9ybWF0VHlwZShzcmMsIG4uZ2V0QXR0cmlidXRlKCd0eXBlJykpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe3R5cGU6IHR5cGUsIHNyYzogc3JjfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobWVkaWFGaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnNyYyA9IG1lZGlhRmlsZXM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9wdGlvbnMuc3VjY2Vzcykge1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3B0aW9ucy5zdWNjZXNzKHQubWVkaWFFbGVtZW50LCB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdH1cblxuXHRcdC8vIEB0b2RvOiBWZXJpZnkgaWYgdGhpcyBpcyBuZWVkZWRcblx0XHQvLyBpZiAodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5lcnJvcikge1xuXHRcdC8vIFx0dC5tZWRpYUVsZW1lbnQub3B0aW9ucy5lcnJvcih0aGlzLm1lZGlhRWxlbWVudCwgdGhpcy5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHQvLyB9XG5cblx0XHRyZXR1cm4gdC5tZWRpYUVsZW1lbnQ7XG5cdH1cbn1cblxud2luZG93Lk1lZGlhRWxlbWVudCA9IE1lZGlhRWxlbWVudDtcblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFFbGVtZW50OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuLy8gTmFtZXNwYWNlXG5sZXQgbWVqcyA9IHt9O1xuXG4vLyB2ZXJzaW9uIG51bWJlclxubWVqcy52ZXJzaW9uID0gJzMuMC4wJztcblxuLy8gQmFzaWMgSFRNTDUgc2V0dGluZ3Ncbm1lanMuaHRtbDVtZWRpYSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdHByb3BlcnRpZXM6IFtcblx0XHQvLyBHRVQvU0VUXG5cdFx0J3ZvbHVtZScsICdzcmMnLCAnY3VycmVudFRpbWUnLCAnbXV0ZWQnLFxuXG5cdFx0Ly8gR0VUIG9ubHlcblx0XHQnZHVyYXRpb24nLCAncGF1c2VkJywgJ2VuZGVkJyxcblxuXHRcdC8vIE9USEVSU1xuXHRcdCdlcnJvcicsICdjdXJyZW50U3JjJywgJ25ldHdvcmtTdGF0ZScsICdwcmVsb2FkJywgJ2J1ZmZlcmVkJywgJ2J1ZmZlcmVkQnl0ZXMnLCAnYnVmZmVyZWRUaW1lJywgJ3JlYWR5U3RhdGUnLCAnc2Vla2luZycsXG5cdFx0J2luaXRpYWxUaW1lJywgJ3N0YXJ0T2Zmc2V0VGltZScsICdkZWZhdWx0UGxheWJhY2tSYXRlJywgJ3BsYXliYWNrUmF0ZScsICdwbGF5ZWQnLCAnc2Vla2FibGUnLCAnYXV0b3BsYXknLCAnbG9vcCcsICdjb250cm9scydcblx0XSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdG1ldGhvZHM6IFtcblx0XHQnbG9hZCcsICdwbGF5JywgJ3BhdXNlJywgJ2NhblBsYXlUeXBlJ1xuXHRdLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0ZXZlbnRzOiBbXG5cdFx0J2xvYWRzdGFydCcsICdwcm9ncmVzcycsICdzdXNwZW5kJywgJ2Fib3J0JywgJ2Vycm9yJywgJ2VtcHRpZWQnLCAnc3RhbGxlZCcsICdwbGF5JywgJ3BhdXNlJywgJ2xvYWRlZG1ldGFkYXRhJyxcblx0XHQnbG9hZGVkZGF0YScsICd3YWl0aW5nJywgJ3BsYXlpbmcnLCAnY2FucGxheScsICdjYW5wbGF5dGhyb3VnaCcsICdzZWVraW5nJywgJ3NlZWtlZCcsICd0aW1ldXBkYXRlJywgJ2VuZGVkJyxcblx0XHQncmF0ZWNoYW5nZScsICdkdXJhdGlvbmNoYW5nZScsICd2b2x1bWVjaGFuZ2UnXG5cdF0sXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRtZWRpYVR5cGVzOiBbXG5cdFx0J2F1ZGlvL21wMycsICdhdWRpby9vZ2cnLCAnYXVkaW8vb2dhJywgJ2F1ZGlvL3dhdicsICdhdWRpby94LXdhdicsICdhdWRpby93YXZlJywgJ2F1ZGlvL3gtcG4td2F2JywgJ2F1ZGlvL21wZWcnLCAnYXVkaW8vbXA0Jyxcblx0XHQndmlkZW8vbXA0JywgJ3ZpZGVvL3dlYm0nLCAndmlkZW8vb2dnJ1xuXHRdXG59O1xuXG53aW5kb3cubWVqcyA9IG1lanM7XG5cbmV4cG9ydCBkZWZhdWx0IG1lanM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuL21lanMnO1xuXG4vKipcbiAqXG4gKiBDbGFzcyB0byBtYW5hZ2UgcmVuZGVyZXIgc2VsZWN0aW9uIGFuZCBhZGRpdGlvbi5cbiAqIEBjbGFzcyBSZW5kZXJlclxuICovXG5jbGFzcyBSZW5kZXJlciB7XG5cblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHRoaXMucmVuZGVyZXJzID0ge307XG5cdFx0dGhpcy5vcmRlciA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGEgbmV3IHJlbmRlcmVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgLSBBbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHJlbmRlcmVkIGluZm9ybWF0aW9uIChuYW1lIFJFUVVJUkVEKVxuXHQgKiBAbWV0aG9kIGFkZFxuXHQgKi9cblx0YWRkIChyZW5kZXJlcikge1xuXG5cdFx0aWYgKHJlbmRlcmVyLm5hbWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigncmVuZGVyZXIgbXVzdCBjb250YWluIGF0IGxlYXN0IGBuYW1lYCBwcm9wZXJ0eScpO1xuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyZXJzW3JlbmRlcmVyLm5hbWVdID0gcmVuZGVyZXI7XG5cdFx0dGhpcy5vcmRlci5wdXNoKHJlbmRlcmVyLm5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEl0ZXJhdGUgYSBsaXN0IG9mIHJlbmRlcmVycyB0byBkZXRlcm1pbmUgd2hpY2ggb25lIHNob3VsZCB0aGUgcGxheWVyIHVzZS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyAtIEEgbGlzdCBvZiBzb3VyY2UgYW5kIHR5cGUgb2J0YWluZWQgZnJvbSB2aWRlby9hdWRpby9zb3VyY2UgdGFnczogW3tzcmM6JycsdHlwZTonJ31dXG5cdCAqIEBwYXJhbSB7P1N0cmluZ1tdfSByZW5kZXJlcnMgLSBPcHRpb25hbCBsaXN0IG9mIHByZS1zZWxlY3RlZCByZW5kZXJlcnNcblx0ICogQHJldHVybiB7P09iamVjdH0gVGhlIHJlbmRlcmVyJ3MgbmFtZSBhbmQgc291cmNlIHNlbGVjdGVkXG5cdCAqIEBtZXRob2Qgc2VsZWN0XG5cdCAqL1xuXHRzZWxlY3QgKG1lZGlhRmlsZXMsIHJlbmRlcmVycyA9IFtdKSB7XG5cblx0XHRyZW5kZXJlcnMgPSByZW5kZXJlcnMubGVuZ3RoID8gcmVuZGVyZXJzOiB0aGlzLm9yZGVyO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGxldFxuXHRcdFx0XHRrZXkgPSByZW5kZXJlcnNbaV0sXG5cdFx0XHRcdHJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnNba2V5XVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAocmVuZGVyZXIgIT09IG51bGwgJiYgcmVuZGVyZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMCwgamwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlbmRlcmVyLmNhblBsYXlUeXBlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBtZWRpYUZpbGVzW2pdLnR5cGUgPT09ICdzdHJpbmcnICYmXG5cdFx0XHRcdFx0XHRyZW5kZXJlci5jYW5QbGF5VHlwZShtZWRpYUZpbGVzW2pdLnR5cGUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRyZW5kZXJlck5hbWU6IHJlbmRlcmVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdHNyYzogIG1lZGlhRmlsZXNbal0uc3JjXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0dGVycy9nZXR0ZXJzXG5cblx0c2V0IG9yZGVyKG9yZGVyKSB7XG5cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkob3JkZXIpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdvcmRlciBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZ3MuJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fb3JkZXIgPSBvcmRlcjtcblx0fVxuXG5cdHNldCByZW5kZXJlcnMocmVuZGVyZXJzKSB7XG5cblx0XHRpZiAocmVuZGVyZXJzICE9PSBudWxsICYmIHR5cGVvZiByZW5kZXJlcnMgIT09ICdvYmplY3QnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdyZW5kZXJlcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBvYmplY3RzLicpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3JlbmRlcmVycyA9IHJlbmRlcmVycztcblx0fVxuXG5cdGdldCByZW5kZXJlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlbmRlcmVycztcblx0fVxuXG5cdGdldCBvcmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5fb3JkZXI7XG5cdH1cbn1cblxuZXhwb3J0IGxldCByZW5kZXJlciA9IG5ldyBSZW5kZXJlcigpO1xuXG5tZWpzLlJlbmRlcmVycyA9IHJlbmRlcmVyOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCAqIGFzIEZlYXR1cmVzIGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cblxuLyoqXG4gKiBGdWxsc2NyZWVuIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBjcmVhdGVzIGEgYnV0dG9uIHRvIHRvZ2dsZSBmdWxsc2NyZWVuIG9uIHZpZGVvOyBpdCBjb25zaWRlcnMgYSBsZXRpZXR5IG9mIHBvc3NpYmlsaXRpZXMgd2hlbiBkZWFsaW5nIHdpdGggaXRcbiAqIHNpbmNlIGl0IGlzIG5vdCBjb25zaXN0ZW50IGFjcm9zcyBicm93c2Vycy4gSXQgYWxzbyBhY2NvdW50cyBmb3IgdHJpZ2dlcmluZyB0aGUgZXZlbnQgdGhyb3VnaCBGbGFzaCBzaGltLlxuICovXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0dXNlUGx1Z2luRnVsbFNjcmVlbjogdHJ1ZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRmdWxsc2NyZWVuVGV4dDogJydcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0Z1bGxTY3JlZW46IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc05hdGl2ZUZ1bGxTY3JlZW46IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0luSWZyYW1lOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNQbHVnaW5DbGlja1Rocm91Z2hDcmVhdGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIFBvc3NpYmxlIG1vZGVzXG5cdCAqICgxKSAnbmF0aXZlLW5hdGl2ZScgIEhUTUw1IHZpZGVvICArIGJyb3dzZXIgZnVsbHNjcmVlbiAoSUUxMCssIGV0Yy4pXG5cdCAqICgyKSAncGx1Z2luLW5hdGl2ZScgIHBsdWdpbiB2aWRlbyArIGJyb3dzZXIgZnVsbHNjcmVlbiAoZmFpbHMgaW4gc29tZSB2ZXJzaW9ucyBvZiBGaXJlZm94KVxuXHQgKiAoMykgJ2Z1bGx3aW5kb3cnICAgICBGdWxsIHdpbmRvdyAocmV0YWlucyBhbGwgVUkpXG5cdCAqICg0KSAncGx1Z2luLWNsaWNrJyAgIEZsYXNoIDEgLSBjbGljayB0aHJvdWdoIHdpdGggcG9pbnRlciBldmVudHNcblx0ICogKDUpICdwbHVnaW4taG92ZXInICAgRmxhc2ggMiAtIGhvdmVyIHBvcHVwIGluIGZsYXNoIChJRTYtOClcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGZ1bGxzY3JlZW5Nb2RlOiAnJyxcblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjb250YWluZXJTaXplVGltZW91dDogbnVsbCxcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZGZ1bGxzY3JlZW46IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXG5cdFx0aWYgKCFwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHBsYXllci5pc0luSWZyYW1lID0gKHdpbmRvdy5sb2NhdGlvbiAhPT0gd2luZG93LnBhcmVudC5sb2NhdGlvbik7XG5cblx0XHQvLyBkZXRlY3Qgb24gc3RhcnRcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGV0ZWN0RnVsbHNjcmVlbk1vZGUoKTtcblx0XHR9KTtcblxuXHRcdC8vIGJ1aWxkIGJ1dHRvblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRoaWRlVGltZW91dCA9IG51bGwsXG5cdFx0XHRmdWxsc2NyZWVuVGl0bGUgPSB0Lm9wdGlvbnMuZnVsbHNjcmVlblRleHQgPyB0Lm9wdGlvbnMuZnVsbHNjcmVlblRleHQgOiBpMThuLnQoJ21lanMuZnVsbHNjcmVlbicpLFxuXHRcdFx0ZnVsbHNjcmVlbkJ0biA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbi1idXR0b25cIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7ZnVsbHNjcmVlblRpdGxlfVwiIGFyaWEtbGFiZWw9XCIke2Z1bGxzY3JlZW5UaXRsZX1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scylcblx0XHRcdFx0Lm9uKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0XHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXG5cdFx0XHRcdFx0bGV0IGlzRnVsbFNjcmVlbiA9IChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiBGZWF0dXJlcy5JU19GVUxMU0NSRUVOKSB8fCBwbGF5ZXIuaXNGdWxsU2NyZWVuO1xuXG5cdFx0XHRcdFx0aWYgKGlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5lbnRlckZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gdmVyeSBvbGQgYnJvd3NlcnMgd2l0aCBhIHBsdWdpblxuXHRcdFx0XHRcdGlmICh0LmZ1bGxzY3JlZW5Nb2RlID09PSAncGx1Z2luLWhvdmVyJykge1xuXHRcdFx0XHRcdFx0aWYgKGhpZGVUaW1lb3V0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG5cdFx0XHRcdFx0XHRcdGhpZGVUaW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IGJ1dHRvblBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCksXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lclBvcyA9IHBsYXllci5jb250YWluZXIub2Zmc2V0KCk7XG5cblx0XHRcdFx0XHRcdG1lZGlhLnBvc2l0aW9uRnVsbHNjcmVlbkJ1dHRvbihidXR0b25Qb3MubGVmdCAtIGNvbnRhaW5lclBvcy5sZWZ0LCBidXR0b25Qb3MudG9wIC0gY29udGFpbmVyUG9zLnRvcCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAodC5mdWxsc2NyZWVuTW9kZSA9PT0gJ3BsdWdpbi1ob3ZlcicpIHtcblx0XHRcdFx0XHRcdGlmIChoaWRlVGltZW91dCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRoaWRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5oaWRlRnVsbHNjcmVlbkJ1dHRvbigpO1xuXHRcdFx0XHRcdFx0fSwgMTUwMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXG5cblx0XHRwbGF5ZXIuZnVsbHNjcmVlbkJ0biA9IGZ1bGxzY3JlZW5CdG47XG5cblx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0bGV0IGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlIHx8IDA7XG5cdFx0XHRpZiAoa2V5ID09PSAyNyAmJiAoKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIEZlYXR1cmVzLklTX0ZVTExTQ1JFRU4pIHx8IHQuaXNGdWxsU2NyZWVuKSkge1xuXHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHQubm9ybWFsSGVpZ2h0ID0gMDtcblx0XHR0Lm5vcm1hbFdpZHRoID0gMDtcblxuXHRcdC8vIHNldHVwIG5hdGl2ZSBmdWxsc2NyZWVuIGV2ZW50XG5cdFx0aWYgKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOKSB7XG5cblx0XHRcdC8vXG5cdFx0XHQvKipcblx0XHRcdCAqIERldGVjdCBhbnkgY2hhbmdlcyBvbiBmdWxsc2NyZWVuXG5cdFx0XHQgKlxuXHRcdFx0ICogQ2hyb21lIGRvZXNuJ3QgYWx3YXlzIGZpcmUgdGhpcyBpbiBhbiBgPGlmcmFtZT5gXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBmdWxsc2NyZWVuQ2hhbmdlZCA9ICgpID0+IHtcblx0XHRcdFx0aWYgKHBsYXllci5pc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHRpZiAoRmVhdHVyZXMuaXNGdWxsU2NyZWVuKCkpIHtcblx0XHRcdFx0XHRcdHBsYXllci5pc05hdGl2ZUZ1bGxTY3JlZW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0Ly8gcmVzZXQgdGhlIGNvbnRyb2xzIG9uY2Ugd2UgYXJlIGZ1bGx5IGluIGZ1bGwgc2NyZWVuXG5cdFx0XHRcdFx0XHRwbGF5ZXIuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5pc05hdGl2ZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0XHRcdFx0XHRcdC8vIHdoZW4gYSB1c2VyIHByZXNzZXMgRVNDXG5cdFx0XHRcdFx0XHQvLyBtYWtlIHN1cmUgdG8gcHV0IHRoZSBwbGF5ZXIgYmFjayBpbnRvIHBsYWNlXG5cdFx0XHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHBsYXllci5nbG9iYWxCaW5kKEZlYXR1cmVzLkZVTExTQ1JFRU5fRVZFTlRfTkFNRSwgZnVsbHNjcmVlbkNoYW5nZWQpO1xuXHRcdH1cblxuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlY3QgdGhlIHR5cGUgb2YgZnVsbHNjcmVlbiBiYXNlZCBvbiBicm93c2VyJ3MgY2FwYWJpbGl0aWVzXG5cdCAqXG5cdCAqIEByZXR1cm4ge1N0cmluZ31cblx0ICovXG5cdGRldGVjdEZ1bGxzY3JlZW5Nb2RlOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG1vZGUgPSAnJyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGxcblx0XHQ7XG5cblx0XHRpZiAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgaXNOYXRpdmUpIHtcblx0XHRcdG1vZGUgPSAnbmF0aXZlLW5hdGl2ZSc7XG5cdFx0fSBlbHNlIGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiAhaXNOYXRpdmUpIHtcblx0XHRcdG1vZGUgPSAncGx1Z2luLW5hdGl2ZSc7XG5cdFx0fSBlbHNlIGlmICh0LnVzZVBsdWdpbkZ1bGxTY3JlZW4pIHtcblx0XHRcdGlmIChGZWF0dXJlcy5TVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG5cdFx0XHRcdG1vZGUgPSAncGx1Z2luLWNsaWNrJztcblx0XHRcdFx0Ly8gdGhpcyBuZWVkcyBzb21lIHNwZWNpYWwgc2V0dXBcblx0XHRcdFx0dC5jcmVhdGVQbHVnaW5DbGlja1Rocm91Z2goKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1vZGUgPSAncGx1Z2luLWhvdmVyJztcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2RlID0gJ2Z1bGx3aW5kb3cnO1xuXHRcdH1cblxuXG5cdFx0dC5mdWxsc2NyZWVuTW9kZSA9IG1vZGU7XG5cdFx0cmV0dXJuIG1vZGU7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjcmVhdGVQbHVnaW5DbGlja1Rocm91Z2g6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBkb24ndCBidWlsZCB0d2ljZVxuXHRcdGlmICh0LmlzUGx1Z2luQ2xpY2tUaHJvdWdoQ3JlYXRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93cyBjbGlja2luZyB0aHJvdWdoIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbiBhbmQgY29udHJvbHMgZG93biBkaXJlY3RseSB0byBGbGFzaFxuXG5cdFx0Lypcblx0XHQgV2hlbiBhIHVzZXIgcHV0cyBoaXMgbW91c2Ugb3ZlciB0aGUgZnVsbHNjcmVlbiBidXR0b24sIHdlIGRpc2FibGUgdGhlIGNvbnRyb2xzIHNvIHRoYXQgbW91c2UgZXZlbnRzIGNhbiBnbyBkb3duIHRvIGZsYXNoIChwb2ludGVyLWV2ZW50cylcblx0XHQgV2UgdGhlbiBwdXQgYSBkaXZzIG92ZXIgdGhlIHZpZGVvIGFuZCBvbiBlaXRoZXIgc2lkZSBvZiB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHQgdG8gY2FwdHVyZSBtb3VzZSBtb3ZlbWVudCBhbmQgcmVzdG9yZSB0aGUgY29udHJvbHMgb25jZSB0aGUgbW91c2UgbW92ZXMgb3V0c2lkZSBvZiB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHQgKi9cblxuXHRcdGxldCBmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IGZhbHNlLFxuXHRcdFx0cmVzdG9yZUNvbnRyb2xzID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoZnVsbHNjcmVlbklzRGlzYWJsZWQpIHtcblx0XHRcdFx0XHQvLyBoaWRlIHRoZSBob3ZlcnNcblx0XHRcdFx0XHRmb3IgKGxldCBpIGluIGhvdmVyRGl2cykge1xuXHRcdFx0XHRcdFx0aG92ZXJEaXZzW2ldLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyByZXN0b3JlIHRoZSBjb250cm9sIGJhclxuXHRcdFx0XHRcdHQuZnVsbHNjcmVlbkJ0bi5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXHRcdFx0XHRcdHQuY29udHJvbHMuY3NzKCdwb2ludGVyLWV2ZW50cycsICcnKTtcblxuXHRcdFx0XHRcdC8vIHByZXZlbnQgY2xpY2tzIGZyb20gcGF1c2luZyB2aWRlb1xuXHRcdFx0XHRcdHQubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cblx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgbGF0ZXJcblx0XHRcdFx0XHRmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aG92ZXJEaXZzID0ge30sXG5cdFx0XHRob3ZlckRpdk5hbWVzID0gWyd0b3AnLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nXSxcblx0XHRcdHBvc2l0aW9uSG92ZXJEaXZzID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLmxlZnQgLSB0LmNvbnRhaW5lci5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3AgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLnRvcCAtIHQuY29udGFpbmVyLm9mZnNldCgpLnRvcCxcblx0XHRcdFx0XHRmdWxsU2NyZWVuQnRuV2lkdGggPSBmdWxsc2NyZWVuQnRuLm91dGVyV2lkdGgodHJ1ZSksXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbkJ0bkhlaWdodCA9IGZ1bGxzY3JlZW5CdG4ub3V0ZXJIZWlnaHQodHJ1ZSksXG5cdFx0XHRcdFx0Y29udGFpbmVyV2lkdGggPSB0LmNvbnRhaW5lci53aWR0aCgpLFxuXHRcdFx0XHRcdGNvbnRhaW5lckhlaWdodCA9IHQuY29udGFpbmVyLmhlaWdodCgpO1xuXG5cdFx0XHRcdGZvciAobGV0IGhvdmVyIGluIGhvdmVyRGl2cykge1xuXHRcdFx0XHRcdGhvdmVyLmNzcyh7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMH0pOyAvLywgYmFja2dyb3VuZENvbG9yOiAnI2YwMCd9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG92ZXIgdmlkZW8sIGJ1dCBub3QgY29udHJvbHNcblx0XHRcdFx0aG92ZXJEaXZzLnRvcFxuXHRcdFx0XHRcdC53aWR0aChjb250YWluZXJXaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3ApO1xuXG5cdFx0XHRcdC8vIG92ZXIgY29udHJvbHMsIGJ1dCBub3QgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0XHRcdGhvdmVyRGl2cy5sZWZ0XG5cdFx0XHRcdFx0LndpZHRoKGZ1bGxTY3JlZW5CdG5PZmZzZXRMZWZ0KVxuXHRcdFx0XHRcdC5oZWlnaHQoZnVsbFNjcmVlbkJ0bkhlaWdodClcblx0XHRcdFx0XHQuY3NzKHt0b3A6IGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3B9KTtcblxuXHRcdFx0XHQvLyBhZnRlciB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHRcdFx0aG92ZXJEaXZzLnJpZ2h0XG5cdFx0XHRcdFx0LndpZHRoKGNvbnRhaW5lcldpZHRoIC0gZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgLSBmdWxsU2NyZWVuQnRuV2lkdGgpXG5cdFx0XHRcdFx0LmhlaWdodChmdWxsU2NyZWVuQnRuSGVpZ2h0KVxuXHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0dG9wOiBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wLFxuXHRcdFx0XHRcdFx0bGVmdDogZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgKyBmdWxsU2NyZWVuQnRuV2lkdGhcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyB1bmRlciB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHRcdFx0aG92ZXJEaXZzLmJvdHRvbVxuXHRcdFx0XHRcdC53aWR0aChjb250YWluZXJXaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KGNvbnRhaW5lckhlaWdodCAtIGZ1bGxTY3JlZW5CdG5IZWlnaHQgLSBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wKVxuXHRcdFx0XHRcdC5jc3Moe3RvcDogZnVsbFNjcmVlbkJ0bk9mZnNldFRvcCArIGZ1bGxTY3JlZW5CdG5IZWlnaHR9KTtcblx0XHRcdH07XG5cblx0XHR0Lmdsb2JhbEJpbmQoJ3Jlc2l6ZScsICgpID0+IHtcblx0XHRcdHBvc2l0aW9uSG92ZXJEaXZzKCk7XG5cdFx0fSk7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gaG92ZXJEaXZOYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aG92ZXJEaXZzW2hvdmVyRGl2TmFtZXNbaV1dID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW4taG92ZXJcIiAvPmApXG5cdFx0XHRcdC5hcHBlbmRUbyh0LmNvbnRhaW5lcikubW91c2VvdmVyKHJlc3RvcmVDb250cm9scykuaGlkZSgpO1xuXHRcdH1cblxuXHRcdC8vIG9uIGhvdmVyLCBraWxsIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbidzIEhUTUwgaGFuZGxpbmcsIGFsbG93aW5nIGNsaWNrcyBkb3duIHRvIEZsYXNoXG5cdFx0ZnVsbHNjcmVlbkJ0bi5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXG5cdFx0XHRpZiAoIXQuaXNGdWxsU2NyZWVuKSB7XG5cblx0XHRcdFx0bGV0IGJ1dHRvblBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCksXG5cdFx0XHRcdFx0Y29udGFpbmVyUG9zID0gcGxheWVyLmNvbnRhaW5lci5vZmZzZXQoKTtcblxuXHRcdFx0XHQvLyBtb3ZlIHRoZSBidXR0b24gaW4gRmxhc2ggaW50byBwbGFjZVxuXHRcdFx0XHRtZWRpYS5wb3NpdGlvbkZ1bGxzY3JlZW5CdXR0b24oYnV0dG9uUG9zLmxlZnQgLSBjb250YWluZXJQb3MubGVmdCwgYnV0dG9uUG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AsIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBhbGxvd3MgY2xpY2sgdGhyb3VnaFxuXHRcdFx0XHR0LmZ1bGxzY3JlZW5CdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cdFx0XHRcdHQuY29udHJvbHMuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cblx0XHRcdFx0Ly8gcmVzdG9yZSBjbGljay10by1wbGF5XG5cdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cblx0XHRcdFx0Ly8gc2hvdyB0aGUgZGl2cyB0aGF0IHdpbGwgcmVzdG9yZSB0aGluZ3Ncblx0XHRcdFx0Zm9yIChsZXQgaSBpbiBob3ZlckRpdnMpIHtcblx0XHRcdFx0XHRob3ZlckRpdnNbaV0uc2hvdygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cG9zaXRpb25Ib3ZlckRpdnMoKTtcblxuXHRcdFx0XHRmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdC8vIHJlc3RvcmUgY29udHJvbHMgYW55dGltZSB0aGUgdXNlciBlbnRlcnMgb3IgbGVhdmVzIGZ1bGxzY3JlZW5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0dC5pc0Z1bGxTY3JlZW4gPSAhdC5pc0Z1bGxTY3JlZW47XG5cdFx0XHQvLyBkb24ndCBhbGxvdyBwbHVnaW4gY2xpY2sgdG8gcGF1c2UgdmlkZW8gLSBtZXNzZXMgd2l0aFxuXHRcdFx0Ly8gcGx1Z2luJ3MgY29udHJvbHNcblx0XHRcdGlmICh0LmlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHR0Lm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHRcdHJlc3RvcmVDb250cm9scygpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyB0aGUgbW91c2VvdXQgZXZlbnQgZG9lc24ndCB3b3JrIG9uIHRoZSBmdWxsc2NyZW4gYnV0dG9uLCBiZWNhdXNlIHdlIGFscmVhZHkga2lsbGVkIHRoZSBwb2ludGVyLWV2ZW50c1xuXHRcdC8vIHNvIHdlIHVzZSB0aGUgZG9jdW1lbnQubW91c2Vtb3ZlIGV2ZW50IHRvIHJlc3RvcmUgY29udHJvbHMgd2hlbiB0aGUgbW91c2UgbW92ZXMgb3V0c2lkZSB0aGUgZnVsbHNjcmVlbiBidXR0b25cblxuXHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuXHRcdFx0Ly8gaWYgdGhlIG1vdXNlIGlzIGFueXdoZXJlIGJ1dCB0aGUgZnVsbHNjZWVuIGJ1dHRvbiwgdGhlbiByZXN0b3JlIGl0IGFsbFxuXHRcdFx0aWYgKGZ1bGxzY3JlZW5Jc0Rpc2FibGVkKSB7XG5cblx0XHRcdFx0Y29uc3QgZnVsbHNjcmVlbkJ0blBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCk7XG5cblx0XHRcdFx0aWYgKGUucGFnZVkgPCBmdWxsc2NyZWVuQnRuUG9zLnRvcCB8fCBlLnBhZ2VZID4gZnVsbHNjcmVlbkJ0blBvcy50b3AgKyBmdWxsc2NyZWVuQnRuLm91dGVySGVpZ2h0KHRydWUpIHx8XG5cdFx0XHRcdFx0ZS5wYWdlWCA8IGZ1bGxzY3JlZW5CdG5Qb3MubGVmdCB8fCBlLnBhZ2VYID4gZnVsbHNjcmVlbkJ0blBvcy5sZWZ0ICsgZnVsbHNjcmVlbkJ0bi5vdXRlcldpZHRoKHRydWUpKSB7XG5cblx0XHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNzcygncG9pbnRlci1ldmVudHMnLCAnJyk7XG5cdFx0XHRcdFx0dC5jb250cm9scy5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbklzRGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHR0LmlzUGx1Z2luQ2xpY2tUaHJvdWdoQ3JlYXRlZCA9IHRydWU7XG5cdH0sXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGRlc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgY2xlYW5gIGFuZCB0aGUgbmFtZSB0aGF0IHdhcyB1c2VkIGluIGZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKi9cblx0Y2xlYW5mdWxsc2NyZWVuOiBmdW5jdGlvbiAocGxheWVyKSAge1xuXHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZW50ZXJGdWxsU2NyZWVuOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhodG1sNXxuYXRpdmUpLykgIT09IG51bGxcblx0XHQ7XG5cblx0XHRpZiAoRmVhdHVyZXMuSVNfSU9TICYmIEZlYXR1cmVzLkhBU19JT1NfRlVMTFNDUkVFTiAmJiB0eXBlb2YgdC5tZWRpYS53ZWJraXRFbnRlckZ1bGxzY3JlZW4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHQubWVkaWEud2Via2l0RW50ZXJGdWxsc2NyZWVuKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGl0IHRvIG5vdCBzaG93IHNjcm9sbCBiYXJzIHNvIDEwMCUgd2lsbCB3b3JrXG5cdFx0JChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHQvLyBzdG9yZSBzaXppbmdcblx0XHR0Lm5vcm1hbEhlaWdodCA9IHQuY29udGFpbmVyLmhlaWdodCgpO1xuXHRcdHQubm9ybWFsV2lkdGggPSB0LmNvbnRhaW5lci53aWR0aCgpO1xuXG5cblx0XHQvLyBhdHRlbXB0IHRvIGRvIHRydWUgZnVsbHNjcmVlblxuXHRcdGlmICh0LmZ1bGxzY3JlZW5Nb2RlID09PSAnbmF0aXZlLW5hdGl2ZScgfHwgdC5mdWxsc2NyZWVuTW9kZSA9PT0gJ3BsdWdpbi1uYXRpdmUnKSB7XG5cblx0XHRcdEZlYXR1cmVzLnJlcXVlc3RGdWxsU2NyZWVuKHQuY29udGFpbmVyWzBdKTtcblxuXHRcdFx0aWYgKHQuaXNJbklmcmFtZSkge1xuXHRcdFx0XHQvLyBzb21ldGltZXMgZXhpdGluZyBmcm9tIGZ1bGxzY3JlZW4gZG9lc24ndCB3b3JrXG5cdFx0XHRcdC8vIG5vdGFibHkgaW4gQ2hyb21lIDxpZnJhbWU+LiBGaXhlZCBpbiB2ZXJzaW9uIDE3XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gY2hlY2tGdWxsc2NyZWVuICgpIHtcblxuXHRcdFx0XHRcdGlmICh0LmlzTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdFx0bGV0IHBlcmNlbnRFcnJvck1hcmdpbiA9IDAuMDAyLCAvLyAwLjIlXG5cdFx0XHRcdFx0XHRcdHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXG5cdFx0XHRcdFx0XHRcdHNjcmVlbldpZHRoID0gc2NyZWVuLndpZHRoLFxuXHRcdFx0XHRcdFx0XHRhYnNEaWZmID0gTWF0aC5hYnMoc2NyZWVuV2lkdGggLSB3aW5kb3dXaWR0aCksXG5cdFx0XHRcdFx0XHRcdG1hcmdpbkVycm9yID0gc2NyZWVuV2lkdGggKiBwZXJjZW50RXJyb3JNYXJnaW47XG5cblx0XHRcdFx0XHRcdC8vIGNoZWNrIGlmIHRoZSB2aWRlbyBpcyBzdWRkZW5seSBub3QgcmVhbGx5IGZ1bGxzY3JlZW5cblx0XHRcdFx0XHRcdGlmIChhYnNEaWZmID4gbWFyZ2luRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0Ly8gbWFudWFsbHkgZXhpdFxuXHRcdFx0XHRcdFx0XHR0LmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyB0ZXN0IGFnYWluXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tGdWxsc2NyZWVuLCA1MDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAodC5mdWxsc2NyZWVNb2RlID09PSAnZnVsbHdpbmRvdycpIHtcblx0XHRcdC8vIG1vdmUgaW50byBwb3NpdGlvblxuXG5cdFx0fVxuXG5cdFx0Ly8gbWFrZSBmdWxsIHNpemVcblx0XHR0LmNvbnRhaW5lclxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXItZnVsbHNjcmVlbmApXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXG5cdFx0Ly8gT25seSBuZWVkZWQgZm9yIHNhZmFyaSA1LjEgbmF0aXZlIGZ1bGwgc2NyZWVuLCBjYW4gY2F1c2UgZGlzcGxheSBpc3N1ZXMgZWxzZXdoZXJlXG5cdFx0Ly8gQWN0dWFsbHksIGl0IHNlZW1zIHRvIGJlIG5lZWRlZCBmb3IgSUU4LCB0b29cblx0XHR0LmNvbnRhaW5lclNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0LmNvbnRhaW5lci5jc3Moe3dpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfSk7XG5cdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZiAoaXNOYXRpdmUpIHtcblx0XHRcdHQuJG1lZGlhXG5cdFx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jb250YWluZXIuZmluZCgnaWZyYW1lLCBlbWJlZCwgb2JqZWN0LCB2aWRlbycpXG5cdFx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblx0XHR9XG5cblx0XHRpZiAodC5vcHRpb25zLnNldERpbWVuc2lvbnMpIHtcblx0XHRcdHQubWVkaWEuc2V0U2l6ZShzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpO1xuXHRcdH1cblxuXHRcdHQubGF5ZXJzLmNoaWxkcmVuKCdkaXYnKVxuXHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblxuXHRcdGlmICh0LmZ1bGxzY3JlZW5CdG4pIHtcblx0XHRcdHQuZnVsbHNjcmVlbkJ0blxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW5gKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVuZnVsbHNjcmVlbmApO1xuXHRcdH1cblxuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0dC5pc0Z1bGxTY3JlZW4gPSB0cnVlO1xuXG5cdFx0bGV0IHpvb21GYWN0b3IgPSBNYXRoLm1pbihzY3JlZW4ud2lkdGggLyB0LndpZHRoLCBzY3JlZW4uaGVpZ2h0IC8gdC5oZWlnaHQpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdmb250LXNpemUnLCB6b29tRmFjdG9yICogMTAwICsgJyUnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnbGluZS1oZWlnaHQnLCAnbm9ybWFsJyk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYCkuY3NzKCdib3R0b20nLCAnNDVweCcpO1xuXG5cdFx0dC5jb250YWluZXIudHJpZ2dlcignZW50ZXJlZGZ1bGxzY3JlZW4nKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGV4aXRGdWxsU2NyZWVuOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGxcblx0XHRcdDtcblxuXHRcdC8vIFByZXZlbnQgY29udGFpbmVyIGZyb20gYXR0ZW1wdGluZyB0byBzdHJldGNoIGEgc2Vjb25kIHRpbWVcblx0XHRjbGVhclRpbWVvdXQodC5jb250YWluZXJTaXplVGltZW91dCk7XG5cblx0XHQvLyBjb21lIG91dCBvZiBuYXRpdmUgZnVsbHNjcmVlblxuXHRcdGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiAoRmVhdHVyZXMuSVNfRlVMTFNDUkVFTiB8fCB0LmlzRnVsbFNjcmVlbikpIHtcblx0XHRcdEZlYXR1cmVzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHR9XG5cblx0XHQvLyByZXN0b3JlIHNjcm9sbCBiYXJzIHRvIGRvY3VtZW50XG5cdFx0JChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHR0LmNvbnRhaW5lci5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWZ1bGxzY3JlZW5gKTtcblxuXHRcdGlmICh0Lm9wdGlvbnMuc2V0RGltZW5zaW9ucykge1xuXHRcdFx0dC5jb250YWluZXJcblx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdFx0aWYgKGlzTmF0aXZlKSB7XG5cdFx0XHRcdHQuJG1lZGlhXG5cdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KHQubm9ybWFsSGVpZ2h0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQuY29udGFpbmVyLmZpbmQoJ2lmcmFtZSwgZW1iZWQsIG9iamVjdCwgdmlkZW8nKVxuXHRcdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0Lm1lZGlhLnNldFNpemUodC5ub3JtYWxXaWR0aCwgdC5ub3JtYWxIZWlnaHQpO1xuXG5cdFx0XHR0LmxheWVycy5jaGlsZHJlbignZGl2Jylcblx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdH1cblxuXHRcdHQuZnVsbHNjcmVlbkJ0blxuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bmZ1bGxzY3JlZW5gKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdHQuaXNGdWxsU2NyZWVuID0gZmFsc2U7XG5cblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnZm9udC1zaXplJywgJycpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdsaW5lLWhlaWdodCcsICcnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKS5jc3MoJ2JvdHRvbScsICcnKTtcblxuXHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2V4aXRlZGZ1bGxzY3JlZW4nKTtcblx0fVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcblxuLyoqXG4gKiBQbGF5L1BhdXNlIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBlbmFibGVzIHRoZSBkaXNwbGF5aW5nIG9mIGEgUGxheSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyBsb2dpYyB0byB0b2dnbGUgaXRzIHN0YXRlXG4gKiBiZXR3ZWVuIHBhdXNlZCBhbmQgcGxheWluZy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRwbGF5VGV4dDogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0cGF1c2VUZXh0OiAnJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGJ1aWxkcGxheXBhdXNlOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0b3AgPSB0Lm9wdGlvbnMsXG5cdFx0XHRwbGF5VGl0bGUgPSBvcC5wbGF5VGV4dCA/IG9wLnBsYXlUZXh0IDogaTE4bi50KCdtZWpzLnBsYXknKSxcblx0XHRcdHBhdXNlVGl0bGUgPSBvcC5wYXVzZVRleHQgPyBvcC5wYXVzZVRleHQgOiBpMThuLnQoJ21lanMucGF1c2UnKSxcblx0XHRcdHBsYXkgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlwYXVzZS1idXR0b24gYCArXG5cdFx0XHRcdFx0YCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7cGxheVRpdGxlfVwiIGFyaWEtbGFiZWw9XCIke3BhdXNlVGl0bGV9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpXG5cdFx0XHRcdC5jbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSksXG5cdFx0XHRwbGF5X2J0biA9IHBsYXkuZmluZCgnYnV0dG9uJyk7XG5cblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHdoaWNoIC0gdG9rZW4gdG8gZGV0ZXJtaW5lIG5ldyBzdGF0ZSBvZiBidXR0b25cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB0b2dnbGVQbGF5UGF1c2UgKHdoaWNoKSB7XG5cdFx0XHRpZiAoJ3BsYXknID09PSB3aGljaCkge1xuXHRcdFx0XHRwbGF5LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5YClcblx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1yZXBsYXlgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBhdXNlYCk7XG5cdFx0XHRcdHBsYXlfYnRuLmF0dHIoe1xuXHRcdFx0XHRcdCd0aXRsZSc6IHBhdXNlVGl0bGUsXG5cdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBwYXVzZVRpdGxlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGxheS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGF1c2VgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXJlcGxheWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheWApO1xuXHRcdFx0XHRwbGF5X2J0bi5hdHRyKHtcblx0XHRcdFx0XHQndGl0bGUnOiBwbGF5VGl0bGUsXG5cdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBwbGF5VGl0bGVcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dG9nZ2xlUGxheVBhdXNlKCdwc2UnKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BsYXknKTtcblx0XHR9LCBmYWxzZSk7XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsICgpID0+IHtcblx0XHRcdHRvZ2dsZVBsYXlQYXVzZSgncGxheScpO1xuXHRcdH0sIGZhbHNlKTtcblxuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BzZScpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwYXVzZWQnLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BzZScpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuXG5cdFx0XHRpZiAoIXBsYXllci5vcHRpb25zLmxvb3ApIHtcblx0XHRcdFx0cGxheS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGF1c2VgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXJlcGxheWApO1xuXHRcdFx0fVxuXG5cdFx0fSwgZmFsc2UpO1xuXHR9XG59KTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7SVNfRklSRUZPWCwgSEFTX1RPVUNIfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHtzZWNvbmRzVG9UaW1lQ29kZX0gZnJvbSAnLi4vdXRpbHMvdGltZSc7XG5cbi8qKlxuICogUHJvZ3Jlc3MvbG9hZGVkIGJhclxuICpcbiAqIFRoaXMgZmVhdHVyZSBjcmVhdGVzIGEgcHJvZ3Jlc3MgYmFyIHdpdGggYSBzbGlkZXIgaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgdXBkYXRlcyBpdCBiYXNlZCBvbiBuYXRpdmUgZXZlbnRzLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogRW5hYmxlIHRvb2x0aXAgdGhhdCBzaG93cyB0aW1lIGluIHByb2dyZXNzIGJhclxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGVuYWJsZVByb2dyZXNzVG9vbHRpcDogdHJ1ZVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkcHJvZ3Jlc3M6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2UsXG5cdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlLFxuXHRcdFx0bGFzdEtleVByZXNzVGltZSA9IDAsXG5cdFx0XHRzdGFydGVkUGF1c2VkID0gZmFsc2UsXG5cdFx0XHRhdXRvUmV3aW5kSW5pdGlhbCA9IHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQsXG5cdFx0XHR0b29sdGlwID0gcGxheWVyLm9wdGlvbnMuZW5hYmxlUHJvZ3Jlc3NUb29sdGlwID9cblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdFwiPmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXQtY3VycmVudFwiPjAwOjAwPC9zcGFuPmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXQtY29ybmVyXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPC9zcGFuPmAgOiBcIlwiO1xuXG5cdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbFwiPmAgK1xuXHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS10b3RhbCAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXNsaWRlclwiPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ1wiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1sb2FkZWRcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtY3VycmVudFwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1oYW5kbGVcIj48L3NwYW4+YCArXG5cdFx0XHRcdGAke3Rvb2x0aXB9YCArXG5cdFx0XHRgPC9zcGFuPmAgK1xuXHRcdGA8L2Rpdj5gKVxuXHRcdC5hcHBlbmRUbyhjb250cm9scyk7XG5cdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXG5cdFx0dC5yYWlsID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbGApO1xuXHRcdHQudG90YWwgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS10b3RhbGApO1xuXHRcdHQubG9hZGVkID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtbG9hZGVkYCk7XG5cdFx0dC5jdXJyZW50ID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtY3VycmVudGApO1xuXHRcdHQuaGFuZGxlID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtaGFuZGxlYCk7XG5cdFx0dC50aW1lZmxvYXQgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdGApO1xuXHRcdHQudGltZWZsb2F0Y3VycmVudCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0LWN1cnJlbnRgKTtcblx0XHR0LnNsaWRlciA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXNsaWRlcmApO1xuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7RXZlbnR9IGVcblx0XHQgKi9cblx0XHRsZXQgaGFuZGxlTW91c2VNb3ZlID0gKGUpID0+IHtcblxuXHRcdFx0XHRsZXQgb2Zmc2V0ID0gdC50b3RhbC5vZmZzZXQoKSxcblx0XHRcdFx0XHR3aWR0aCA9IHQudG90YWwud2lkdGgoKSxcblx0XHRcdFx0XHRwZXJjZW50YWdlID0gMCxcblx0XHRcdFx0XHRuZXdUaW1lID0gMCxcblx0XHRcdFx0XHRwb3MgPSAwLFxuXHRcdFx0XHRcdHhcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIG1vdXNlIG9yIHRvdWNoIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0aWYgKGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMpIHtcblx0XHRcdFx0XHR4ID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGUuY2hhbmdlZFRvdWNoZXMpIHsgLy8gZm9yIFplcHRvXG5cdFx0XHRcdFx0eCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0eCA9IGUucGFnZVg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobWVkaWEuZHVyYXRpb24pIHtcblx0XHRcdFx0XHRpZiAoeCA8IG9mZnNldC5sZWZ0KSB7XG5cdFx0XHRcdFx0XHR4ID0gb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh4ID4gd2lkdGggKyBvZmZzZXQubGVmdCkge1xuXHRcdFx0XHRcdFx0eCA9IHdpZHRoICsgb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cG9zID0geCAtIG9mZnNldC5sZWZ0O1xuXHRcdFx0XHRcdHBlcmNlbnRhZ2UgPSAocG9zIC8gd2lkdGgpO1xuXHRcdFx0XHRcdG5ld1RpbWUgPSAocGVyY2VudGFnZSA8PSAwLjAyKSA/IDAgOiBwZXJjZW50YWdlICogbWVkaWEuZHVyYXRpb247XG5cblx0XHRcdFx0XHQvLyBzZWVrIHRvIHdoZXJlIHRoZSBtb3VzZSBpc1xuXHRcdFx0XHRcdGlmIChtb3VzZUlzRG93biAmJiBuZXdUaW1lLnRvRml4ZWQoNCkgIT09IG1lZGlhLmN1cnJlbnRUaW1lLnRvRml4ZWQoNCkpIHtcblx0XHRcdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHBvc2l0aW9uIGZsb2F0aW5nIHRpbWUgYm94XG5cdFx0XHRcdFx0aWYgKCFIQVNfVE9VQ0gpIHtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0LmNzcygnbGVmdCcsIHBvcyk7XG5cdFx0XHRcdFx0XHR0LnRpbWVmbG9hdGN1cnJlbnQuaHRtbChzZWNvbmRzVG9UaW1lQ29kZShuZXdUaW1lLCBwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93SG91cnMpKTtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0LnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFVwZGF0ZSBlbGVtZW50cyBpbiBwcm9ncmVzcyBiYXIgZm9yIGFjY2Vzc2liaWxpdHkgcHVycG9zZXMgb25seSB3aGVuIHBsYXllciBpcyBwYXVzZWQuXG5cdFx0XHQgKlxuXHRcdFx0ICogVGhpcyBpcyB0byBhdm9pZCBhdHRlbXB0cyB0byByZXBlYXQgdGhlIHRpbWUgb3ZlciBhbmQgb3ZlciBhZ2FpbiB3aGVuIG1lZGlhIGlzIHBsYXlpbmcuXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHR1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG5cblx0XHRcdFx0bGV0IHNlY29uZHMgPSBtZWRpYS5jdXJyZW50VGltZSxcblx0XHRcdFx0XHR0aW1lU2xpZGVyVGV4dCA9IGkxOG4udCgnbWVqcy50aW1lLXNsaWRlcicpLFxuXHRcdFx0XHRcdHRpbWUgPSBzZWNvbmRzVG9UaW1lQ29kZShzZWNvbmRzLCBwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93SG91cnMpLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gbWVkaWEuZHVyYXRpb247XG5cblx0XHRcdFx0dC5zbGlkZXIuYXR0cih7XG5cdFx0XHRcdFx0J3JvbGUnOiAnc2xpZGVyJyxcblx0XHRcdFx0XHQndGFiaW5kZXgnOiAwXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0dC5zbGlkZXIuYXR0cih7XG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IHRpbWVTbGlkZXJUZXh0LFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWVtaW4nOiAwLFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWVtYXgnOiBkdXJhdGlvbixcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVlbm93Jzogc2Vjb25kcyxcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVldGV4dCc6IHRpbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0LnNsaWRlci5yZW1vdmVBdHRyKCdhcmlhLWxhYmVsIGFyaWEtdmFsdWVtaW4gYXJpYS12YWx1ZW1heCBhcmlhLXZhbHVlbm93IGFyaWEtdmFsdWV0ZXh0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRyZXN0YXJ0UGxheWVyID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgbm93ID0gbmV3IERhdGUoKTtcblx0XHRcdFx0aWYgKG5vdyAtIGxhc3RLZXlQcmVzc1RpbWUgPj0gMTAwMCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdC8vIEV2ZW50c1xuXHRcdHQuc2xpZGVyLm9uKCdmb2N1cycsICgpID0+IHtcblx0XHRcdHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQgPSBmYWxzZTtcblx0XHR9KS5vbignYmx1cicsICgpID0+IHtcblx0XHRcdHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQgPSBhdXRvUmV3aW5kSW5pdGlhbDtcblx0XHR9KS5vbigna2V5ZG93bicsIChlKSA9PiB7XG5cblx0XHRcdGlmICgobmV3IERhdGUoKSAtIGxhc3RLZXlQcmVzc1RpbWUpID49IDEwMDApIHtcblx0XHRcdFx0c3RhcnRlZFBhdXNlZCA9IG1lZGlhLnBhdXNlZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQub3B0aW9ucy5rZXlBY3Rpb25zLmxlbmd0aCkge1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdGtleUNvZGUgPSBlLndoaWNoIHx8IGUua2V5Q29kZSB8fCAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gbWVkaWEuZHVyYXRpb24sXG5cdFx0XHRcdFx0c2Vla1RpbWUgPSBtZWRpYS5jdXJyZW50VGltZSxcblx0XHRcdFx0XHRzZWVrRm9yd2FyZCA9IHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrRm9yd2FyZEludGVydmFsKG1lZGlhKSxcblx0XHRcdFx0XHRzZWVrQmFja3dhcmQgPSBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0JhY2t3YXJkSW50ZXJ2YWwobWVkaWEpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRcdFx0XHRjYXNlIDM3OiAvLyBsZWZ0XG5cdFx0XHRcdFx0Y2FzZSA0MDogLy8gRG93blxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRcdFx0XHRzZWVrVGltZSAtPSBzZWVrQmFja3dhcmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM5OiAvLyBSaWdodFxuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIFVwXG5cdFx0XHRcdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdFx0XHRcdHNlZWtUaW1lICs9IHNlZWtGb3J3YXJkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzNjogLy8gSG9tZVxuXHRcdFx0XHRcdFx0c2Vla1RpbWUgPSAwO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzNTogLy8gZW5kXG5cdFx0XHRcdFx0XHRzZWVrVGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzMjogLy8gc3BhY2Vcblx0XHRcdFx0XHRcdGlmICghSVNfRklSRUZPWCkge1xuXHRcdFx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlIDEzOiAvLyBlbnRlclxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdHNlZWtUaW1lID0gc2Vla1RpbWUgPCAwID8gMCA6IChzZWVrVGltZSA+PSBkdXJhdGlvbiA/IGR1cmF0aW9uIDogTWF0aC5mbG9vcihzZWVrVGltZSkpO1xuXHRcdFx0XHRsYXN0S2V5UHJlc3NUaW1lID0gbmV3IERhdGUoKTtcblx0XHRcdFx0aWYgKCFzdGFydGVkUGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWVrVGltZSA8IG1lZGlhLmR1cmF0aW9uICYmICFzdGFydGVkUGF1c2VkKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChyZXN0YXJ0UGxheWVyLCAxMTAwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKHNlZWtUaW1lKTtcblxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSkub24oJ2NsaWNrJywgKGUpID0+IHtcblxuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRsZXQgcGF1c2VkID0gbWVkaWEucGF1c2VkO1xuXG5cdFx0XHRcdGlmICghcGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblxuXHRcdFx0XHRpZiAoIXBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyBoYW5kbGUgY2xpY2tzXG5cdFx0dC5yYWlsLm9uKCdtb3VzZWRvd24gdG91Y2hzdGFydCcsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdC8vIG9ubHkgaGFuZGxlIGxlZnQgY2xpY2tzIG9yIHRvdWNoXG5cdFx0XHRcdGlmIChlLndoaWNoID09PSAxIHx8IGUud2hpY2ggPT09IDApIHtcblx0XHRcdFx0XHRtb3VzZUlzRG93biA9IHRydWU7XG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXHRcdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlLmR1ciB0b3VjaG1vdmUuZHVyJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNldXAuZHVyIHRvdWNoZW5kLmR1cicsICgpID0+IHtcblx0XHRcdFx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpZiAodC50aW1lZmxvYXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHR0LnRpbWVmbG9hdC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0Lmdsb2JhbFVuYmluZCgnbW91c2Vtb3ZlLmR1ciB0b3VjaG1vdmUuZHVyIG1vdXNldXAuZHVyIHRvdWNoZW5kLmR1cicpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSkub24oJ21vdXNlZW50ZXInLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IHRydWU7XG5cdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlLmR1cicsIChlKSA9PiB7XG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKHQudGltZWZsb2F0ICE9PSB1bmRlZmluZWQgJiYgIUhBU19UT1VDSCkge1xuXHRcdFx0XHRcdHQudGltZWZsb2F0LnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoIW1vdXNlSXNEb3duKSB7XG5cdFx0XHRcdFx0dC5nbG9iYWxVbmJpbmQoJ21vdXNlbW92ZS5kdXInKTtcblx0XHRcdFx0XHRpZiAodC50aW1lZmxvYXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dC50aW1lZmxvYXQuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gbG9hZGluZ1xuXHRcdC8vIElmIG1lZGlhIGlzIGRvZXMgbm90IGhhdmUgYSBmaW5pdGUgZHVyYXRpb24sIHJlbW92ZSBwcm9ncmVzcyBiYXIgaW50ZXJhY3Rpb25cblx0XHQvLyBhbmQgaW5kaWNhdGUgdGhhdCBpcyBhIGxpdmUgYnJvYWRjYXN0XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRwbGF5ZXIuc2V0UHJvZ3Jlc3NSYWlsKGUpO1xuXHRcdFx0XHRwbGF5ZXIuc2V0Q3VycmVudFJhaWwoZSk7XG5cdFx0XHR9IGVsc2UgaWYgKCFjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0YCkubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXJhaWxgKS5lbXB0eSgpXG5cdFx0XHRcdFx0Lmh0bWwoYDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0XCI+JHttZWpzLmkxOG4udCgnbWVqcy5saXZlLWJyb2FkY2FzdCcpfTwvc3Bhbj5gKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cblx0XHQvLyBjdXJyZW50IHRpbWVcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkgKSB7XG5cdFx0XHRcdHBsYXllci5zZXRQcm9ncmVzc1JhaWwoZSk7XG5cdFx0XHRcdHBsYXllci5zZXRDdXJyZW50UmFpbChlKTtcblx0XHRcdFx0dXBkYXRlU2xpZGVyKGUpO1xuXHRcdFx0fSBlbHNlIGlmICghY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdGApLmxlbmd0aCkge1xuXHRcdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1yYWlsYCkuZW1wdHkoKVxuXHRcdFx0XHRcdC5odG1sKGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdFwiPiR7bWVqcy5pMThuLnQoJ21lanMubGl2ZS1icm9hZGNhc3QnKX08L3NwYW4+YCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0dC5jb250YWluZXIub24oJ2NvbnRyb2xzcmVzaXplJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0cGxheWVyLnNldFByb2dyZXNzUmFpbChlKTtcblx0XHRcdFx0cGxheWVyLnNldEN1cnJlbnRSYWlsKGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGhlIHByb2dyZXNzIG9uIHRoZSBtZWRpYSBhbmQgdXBkYXRlIHByb2dyZXNzIGJhcidzIHdpZHRoXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGVcblx0ICovXG5cdHNldFByb2dyZXNzUmFpbDogZnVuY3Rpb24gKGUpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dGFyZ2V0ID0gKGUgIT09IHVuZGVmaW5lZCkgPyBlLnRhcmdldCA6IHQubWVkaWEsXG5cdFx0XHRwZXJjZW50ID0gbnVsbDtcblxuXHRcdC8vIG5ld2VzdCBIVE1MNSBzcGVjIGhhcyBidWZmZXJlZCBhcnJheSAoRkY0LCBXZWJraXQpXG5cdFx0aWYgKHRhcmdldCAmJiB0YXJnZXQuYnVmZmVyZWQgJiYgdGFyZ2V0LmJ1ZmZlcmVkLmxlbmd0aCA+IDAgJiYgdGFyZ2V0LmJ1ZmZlcmVkLmVuZCAmJiB0YXJnZXQuZHVyYXRpb24pIHtcblx0XHRcdC8vIGFjY291bnQgZm9yIGEgcmVhbCBhcnJheSB3aXRoIG11bHRpcGxlIHZhbHVlcyAtIGFsd2F5cyByZWFkIHRoZSBlbmQgb2YgdGhlIGxhc3QgYnVmZmVyXG5cdFx0XHRwZXJjZW50ID0gdGFyZ2V0LmJ1ZmZlcmVkLmVuZCh0YXJnZXQuYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyB0YXJnZXQuZHVyYXRpb247XG5cdFx0fVxuXHRcdC8vIFNvbWUgYnJvd3NlcnMgKGUuZy4sIEZGMy42IGFuZCBTYWZhcmkgNSkgY2Fubm90IGNhbGN1bGF0ZSB0YXJnZXQuYnVmZmVyZXJlZC5lbmQoKVxuXHRcdC8vIHRvIGJlIGFueXRoaW5nIG90aGVyIHRoYW4gMC4gSWYgdGhlIGJ5dGUgY291bnQgaXMgYXZhaWxhYmxlIHdlIHVzZSB0aGlzIGluc3RlYWQuXG5cdFx0Ly8gQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHRoZSBlbHNlIGlmIGRvIG5vdCBzZWVtIHRvIGhhdmUgdGhlIGJ1ZmZlcmVkQnl0ZXMgdmFsdWUgYW5kXG5cdFx0Ly8gc2hvdWxkIHNraXAgdG8gdGhlcmUuIFRlc3RlZCBpbiBTYWZhcmkgNSwgV2Via2l0IGhlYWQsIEZGMy42LCBDaHJvbWUgNiwgSUUgNy84LlxuXHRcdGVsc2UgaWYgKHRhcmdldCAmJiB0YXJnZXQuYnl0ZXNUb3RhbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldC5ieXRlc1RvdGFsID4gMCAmJiB0YXJnZXQuYnVmZmVyZWRCeXRlcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwZXJjZW50ID0gdGFyZ2V0LmJ1ZmZlcmVkQnl0ZXMgLyB0YXJnZXQuYnl0ZXNUb3RhbDtcblx0XHR9XG5cdFx0Ly8gRmlyZWZveCAzIHdpdGggYW4gT2dnIGZpbGUgc2VlbXMgdG8gZ28gdGhpcyB3YXlcblx0XHRlbHNlIGlmIChlICYmIGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBlLnRvdGFsICE9PSAwKSB7XG5cdFx0XHRwZXJjZW50ID0gZS5sb2FkZWQgLyBlLnRvdGFsO1xuXHRcdH1cblxuXHRcdC8vIGZpbmFsbHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXJcblx0XHRpZiAocGVyY2VudCAhPT0gbnVsbCkge1xuXHRcdFx0cGVyY2VudCA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHBlcmNlbnQpKTtcblx0XHRcdC8vIHVwZGF0ZSBsb2FkZWQgYmFyXG5cdFx0XHRpZiAodC5sb2FkZWQgJiYgdC50b3RhbCkge1xuXHRcdFx0XHR0LmxvYWRlZC53aWR0aChgJHsocGVyY2VudCAqIDEwMCl9JWApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIFVwZGF0ZSB0aGUgc2xpZGVyJ3Mgd2lkdGggZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IHRpbWVcblx0ICpcblx0ICovXG5cdHNldEN1cnJlbnRSYWlsOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKHQubWVkaWEuY3VycmVudFRpbWUgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhLmR1cmF0aW9uKSB7XG5cblx0XHRcdC8vIHVwZGF0ZSBiYXIgYW5kIGhhbmRsZVxuXHRcdFx0aWYgKHQudG90YWwgJiYgdC5oYW5kbGUpIHtcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0bmV3V2lkdGggPSBNYXRoLnJvdW5kKHQudG90YWwud2lkdGgoKSAqIHQubWVkaWEuY3VycmVudFRpbWUgLyB0Lm1lZGlhLmR1cmF0aW9uKSxcblx0XHRcdFx0XHRoYW5kbGVQb3MgPSBuZXdXaWR0aCAtIE1hdGgucm91bmQodC5oYW5kbGUub3V0ZXJXaWR0aCh0cnVlKSAvIDIpO1xuXG5cdFx0XHRcdG5ld1dpZHRoID0gKHQubWVkaWEuY3VycmVudFRpbWUgLyB0Lm1lZGlhLmR1cmF0aW9uKSAqIDEwMDtcblx0XHRcdFx0dC5jdXJyZW50LndpZHRoKGAke25ld1dpZHRofSVgKTtcblx0XHRcdFx0dC5oYW5kbGUuY3NzKCdsZWZ0JywgaGFuZGxlUG9zKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQge3NlY29uZHNUb1RpbWVDb2RlfSBmcm9tICcuLi91dGlscy90aW1lJztcblxuLyoqXG4gKiBDdXJyZW50L2R1cmF0aW9uIHRpbWVzXG4gKlxuICogVGhpcyBmZWF0dXJlIGNyZWF0ZXMvdXBkYXRlcyB0aGUgZHVyYXRpb24gYW5kIHByb2dyZXNzIHRpbWVzIGluIHRoZSBjb250cm9sIGJhciwgYmFzZWQgb24gbmF0aXZlIGV2ZW50cy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIFRoZSBpbml0aWFsIGR1cmF0aW9uXG5cdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdCAqL1xuXHRkdXJhdGlvbjogMCxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR0aW1lQW5kRHVyYXRpb25TZXBhcmF0b3I6ICc8c3Bhbj4gfCA8L3NwYW4+J1xufSk7XG5cblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgdGltZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZGN1cnJlbnQ6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lXCIgcm9sZT1cInRpbWVyXCIgYXJpYS1saXZlPVwib2ZmXCI+YCArXG5cdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZVwiPiR7c2Vjb25kc1RvVGltZUNvZGUoMCwgcGxheWVyLm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX08L3NwYW4+YCArXG5cdFx0YDwvZGl2PmApXG5cdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblxuXHRcdHQuY3VycmVudHRpbWUgPSB0LmNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZWApO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0XHRwbGF5ZXIudXBkYXRlQ3VycmVudCgpO1xuXHRcdFx0fVxuXG5cdFx0fSwgZmFsc2UpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEdXJhdGlvbiB0aW1lIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkZHVyYXRpb246IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmIChjb250cm9scy5jaGlsZHJlbigpLmxhc3QoKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWVgKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKGAke3Qub3B0aW9ucy50aW1lQW5kRHVyYXRpb25TZXBhcmF0b3J9PHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvblwiPmAgK1xuXHRcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZSh0Lm9wdGlvbnMuZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfTwvc3Bhbj5gKVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lYCkpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIGFkZCBjbGFzcyB0byBjdXJyZW50IHRpbWVcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZWApLnBhcmVudCgpXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWUtY29udGFpbmVyYCk7XG5cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uLWNvbnRhaW5lclwiPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvblwiPmAgK1xuXHRcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZSh0Lm9wdGlvbnMuZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfTwvc3Bhbj5gICtcblx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblx0XHR9XG5cblx0XHR0LmR1cmF0aW9uRCA9IHQuY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uYCk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdHBsYXllci51cGRhdGVEdXJhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHRoZSBjdXJyZW50IHRpbWUgYW5kIG91dHB1dCBpdCBpbiBmb3JtYXQgMDA6MDBcblx0ICpcblx0ICovXG5cdHVwZGF0ZUN1cnJlbnQ6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0bGV0IGN1cnJlbnRUaW1lID0gdC5tZWRpYS5jdXJyZW50VGltZTtcblxuXHRcdGlmIChpc05hTihjdXJyZW50VGltZSkpIHtcblx0XHRcdGN1cnJlbnRUaW1lID0gMDtcblx0XHR9XG5cblx0XHRpZiAodC5jdXJyZW50dGltZSkge1xuXHRcdFx0dC5jdXJyZW50dGltZS5odG1sKHNlY29uZHNUb1RpbWVDb2RlKGN1cnJlbnRUaW1lLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIGR1cmF0aW9uIHRpbWUgYW5kIG91dHB1dCBpdCBpbiBmb3JtYXQgMDA6MDBcblx0ICpcblx0ICovXG5cdHVwZGF0ZUR1cmF0aW9uOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGxldCBkdXJhdGlvbiA9IHQubWVkaWEuZHVyYXRpb247XG5cblx0XHRpZiAoaXNOYU4oZHVyYXRpb24pIHx8IGR1cmF0aW9uID09PSBJbmZpbml0eSB8fCBkdXJhdGlvbiA8IDApIHtcblx0XHRcdHQubWVkaWEuZHVyYXRpb24gPSB0Lm9wdGlvbnMuZHVyYXRpb24gPSBkdXJhdGlvbiA9IDA7XG5cdFx0fVxuXG5cdFx0aWYgKHQub3B0aW9ucy5kdXJhdGlvbiA+IDApIHtcblx0XHRcdGR1cmF0aW9uID0gdC5vcHRpb25zLmR1cmF0aW9uO1xuXHRcdH1cblxuXHRcdC8vVG9nZ2xlIHRoZSBsb25nIHZpZGVvIGNsYXNzIGlmIHRoZSB2aWRlbyBpcyBsb25nZXIgdGhhbiBhbiBob3VyLlxuXHRcdHQuY29udGFpbmVyLnRvZ2dsZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sb25nLXZpZGVvYCwgZHVyYXRpb24gPiAzNjAwKTtcblxuXHRcdGlmICh0LmR1cmF0aW9uRCAmJiBkdXJhdGlvbiA+IDApIHtcblx0XHRcdHQuZHVyYXRpb25ELmh0bWwoc2Vjb25kc1RvVGltZUNvZGUoZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCB7c2Vjb25kc1RvVGltZUNvZGUsIGNvbnZlcnRTTVBURXRvU2Vjb25kc30gZnJvbSAnLi4vdXRpbHMvdGltZSc7XG5cbi8qKlxuICogQ2xvc2VkIENhcHRpb25zIChDQykgYnV0dG9uXG4gKlxuICogVGhpcyBmZWF0dXJlIGVuYWJsZXMgdGhlIGRpc3BsYXlpbmcgb2YgYSBDQyBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyB0aGUgbWV0aG9kcyB0byBzdGFydCBtZWRpYVxuICogd2l0aCBhIGNlcnRhaW4gbGFuZ3VhZ2UgKGlmIGF2YWlsYWJsZSksIHRvZ2dsZSBjYXB0aW9ucywgZXRjLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogRGVmYXVsdCBsYW5ndWFnZSB0byBzdGFydCBtZWRpYSB1c2luZyBJU08gNjM5LTIgTGFuZ3VhZ2UgQ29kZSBMaXN0IChlbiwgZXMsIGl0LCBldGMuKVxuXHQgKiBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgdHJhY2tzIGZvciBvbmUgbGFuZ3VhZ2UsIHRoZSBsYXN0IHRyYWNrIG5vZGUgZm91bmQgaXMgYWN0aXZhdGVkXG5cdCAqIEBzZWUgaHR0cHM6Ly93d3cubG9jLmdvdi9zdGFuZGFyZHMvaXNvNjM5LTIvcGhwL2NvZGVfbGlzdC5waHBcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHN0YXJ0TGFuZ3VhZ2U6ICcnLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHRyYWNrc1RleHQ6ICcnLFxuXHQvKipcblx0ICogQXZvaWQgdG8gc2NyZWVuIHJlYWRlciBzcGVhayBjYXB0aW9ucyBvdmVyIGFuIGF1ZGlvIHRyYWNrLlxuXHQgKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdHRyYWNrc0FyaWFMaXZlOiBmYWxzZSxcblx0LyoqXG5cdCAqIFJlbW92ZSB0aGUgW2NjXSBidXR0b24gd2hlbiBubyB0cmFjayBub2RlcyBhcmUgcHJlc2VudFxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGhpZGVDYXB0aW9uc0J1dHRvbldoZW5FbXB0eTogdHJ1ZSxcblx0LyoqXG5cdCAqIENoYW5nZSBjYXB0aW9ucyB0byBwb3AtdXAgaWYgdHJ1ZSBhbmQgb25seSBvbmUgdHJhY2sgbm9kZSBpcyBmb3VuZFxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdHRvZ2dsZUNhcHRpb25zQnV0dG9uV2hlbk9ubHlPbmU6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHNsaWRlc1NlbGVjdG9yOiAnJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGhhc0NoYXB0ZXJzOiBmYWxzZSxcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZHRyYWNrczogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cdFx0aWYgKHBsYXllci50cmFja3MubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGF0dHIgPSB0Lm9wdGlvbnMudHJhY2tzQXJpYUxpdmUgPyAnIHJvbGU9XCJsb2dcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiBhcmlhLWF0b21pYz1cImZhbHNlXCInIDogJycsXG5cdFx0XHR0cmFja3NUaXRsZSA9IHQub3B0aW9ucy50cmFja3NUZXh0ID8gdC5vcHRpb25zLnRyYWNrc1RleHQgOiBpMThuLnQoJ21lanMuY2FwdGlvbnMtc3VidGl0bGVzJyksXG5cdFx0XHRpLFxuXHRcdFx0a2luZFxuXHRcdFx0O1xuXG5cdFx0Ly8gSWYgYnJvd3NlciB3aWxsIGRvIG5hdGl2ZSBjYXB0aW9ucywgcHJlZmVyIG1lanMgY2FwdGlvbnMsIGxvb3AgdGhyb3VnaCB0cmFja3MgYW5kIGhpZGVcblx0XHRpZiAodC5kb21Ob2RlLnRleHRUcmFja3MpIHtcblx0XHRcdGZvciAoaSA9IHQuZG9tTm9kZS50ZXh0VHJhY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHQuZG9tTm9kZS50ZXh0VHJhY2tzW2ldLm1vZGUgPSAnaGlkZGVuJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0LmNsZWFydHJhY2tzKHBsYXllcik7XG5cdFx0cGxheWVyLmNoYXB0ZXJzID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXJzICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+PC9kaXY+YClcblx0XHRcdC5wcmVwZW5kVG8obGF5ZXJzKS5oaWRlKCk7XG5cdFx0cGxheWVyLmNhcHRpb25zID1cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1sYXllciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPmAgK1xuXHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyXCIke2F0dHJ9PmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0LnByZXBlbmRUbyhsYXllcnMpLmhpZGUoKTtcblx0XHRwbGF5ZXIuY2FwdGlvbnNUZXh0ID0gcGxheWVyLmNhcHRpb25zLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCk7XG5cdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uID1cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtYnV0dG9uXCI+YCArXG5cdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHt0cmFja3NUaXRsZX1cIiBhcmlhLWxhYmVsPVwiJHt0cmFja3NUaXRsZX1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RvciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj5gICtcblx0XHRcdFx0XHRgPHVsIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGlzdFwiPmAgK1xuXHRcdFx0XHRcdFx0YDxsaSBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxpc3QtaXRlbVwiPmAgK1xuXHRcdFx0XHRcdFx0XHRgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItaW5wdXRcIiBgICtcblx0XHRcdFx0XHRcdFx0XHRgbmFtZT1cIiR7cGxheWVyLmlkfV9jYXB0aW9uc1wiIGlkPVwiJHtwbGF5ZXIuaWR9X2NhcHRpb25zX25vbmVcIiBgICtcblx0XHRcdFx0XHRcdFx0XHRgdmFsdWU9XCJub25lXCIgY2hlY2tlZD1cImNoZWNrZWRcIiAvPmAgK1xuXHRcdFx0XHRcdFx0XHRgPGxhYmVsIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWwgYCArXG5cdFx0XHRcdFx0XHRcdFx0YCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkXCIgYCArXG5cdFx0XHRcdFx0XHRcdFx0YGZvcj1cIiR7cGxheWVyLmlkfV9jYXB0aW9uc19ub25lXCI+JHtpMThuLnQoJ21lanMubm9uZScpfTwvbGFiZWw+YCArXG5cdFx0XHRcdFx0XHRgPC9saT5gICtcblx0XHRcdFx0XHRgPC91bD5gICtcblx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0YDwvZGl2PmApXG5cdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpO1xuXG5cblx0XHRsZXRcblx0XHRcdHN1YnRpdGxlQ291bnQgPSAwLFxuXHRcdFx0dG90YWwgPSBwbGF5ZXIudHJhY2tzLmxlbmd0aFxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRraW5kID0gcGxheWVyLnRyYWNrc1tpXS5raW5kO1xuXHRcdFx0aWYgKGtpbmQgPT09ICdzdWJ0aXRsZXMnIHx8IGtpbmQgPT09ICdjYXB0aW9ucycpIHtcblx0XHRcdFx0c3VidGl0bGVDb3VudCsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGlmIG9ubHkgb25lIGxhbmd1YWdlIHRoZW4ganVzdCBtYWtlIHRoZSBidXR0b24gYSB0b2dnbGVcblx0XHRpZiAodC5vcHRpb25zLnRvZ2dsZUNhcHRpb25zQnV0dG9uV2hlbk9ubHlPbmUgJiYgc3VidGl0bGVDb3VudCA9PT0gMSkge1xuXHRcdFx0Ly8gY2xpY2tcblx0XHRcdHBsYXllci5jYXB0aW9uc0J1dHRvbi5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGxldCB0cmFja0lkID0gJ25vbmUnO1xuXHRcdFx0XHRpZiAocGxheWVyLnNlbGVjdGVkVHJhY2sgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0cmFja0lkID0gcGxheWVyLnRyYWNrc1swXS50cmFja0lkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBsYXllci5zZXRUcmFjayh0cmFja0lkKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBob3ZlciBvciBrZXlib2FyZCBmb2N1c1xuXHRcdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uXG5cdFx0XHRcdC5vbignbW91c2VlbnRlciBmb2N1c2luJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKVxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdtb3VzZWxlYXZlIGZvY3Vzb3V0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Ly8gaGFuZGxlIGNsaWNrcyB0byB0aGUgbGFuZ3VhZ2UgcmFkaW8gYnV0dG9uc1xuXHRcdFx0XHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gdmFsdWUgaXMgdHJhY2tJZCwgc2FtZSBhcyB0aGUgYWN0dWFsIGlkLCBhbmQgd2UncmUgdXNpbmcgaXQgaGVyZVxuXHRcdFx0XHRcdC8vIGJlY2F1c2UgdGhlIFwibm9uZVwiIGNoZWNrYm94IGRvZXNuJ3QgaGF2ZSBhIHRyYWNrSWRcblx0XHRcdFx0XHQvLyB0byB1c2UsIGJ1dCB3ZSB3YW50IHRvIGtub3cgd2hlbiBcIm5vbmVcIiBpcyBjbGlja2VkXG5cdFx0XHRcdFx0cGxheWVyLnNldFRyYWNrKHRoaXMudmFsdWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2NsaWNrJywgYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbGAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vQWxsb3cgdXAvZG93biBhcnJvdyB0byBjaGFuZ2UgdGhlIHNlbGVjdGVkIHJhZGlvIHdpdGhvdXQgY2hhbmdpbmcgdGhlIHZvbHVtZS5cblx0XHRcdFx0Lm9uKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIXBsYXllci5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0Ly8gbW92ZSB3aXRoIGNvbnRyb2xzXG5cdFx0XHRwbGF5ZXIuY29udGFpbmVyXG5cdFx0XHQub24oJ2NvbnRyb2xzc2hvd24nLCAoKSA9PiB7XG5cdFx0XHRcdC8vIHB1c2ggY2FwdGlvbnMgYWJvdmUgY29udHJvbHNcblx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyYCk7XG5cblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbnRyb2xzaGlkZGVuJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAoIW1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdC8vIG1vdmUgYmFjayB0byBub3JtYWwgcGxhY2Vcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlcmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlcmApO1xuXHRcdH1cblxuXHRcdHBsYXllci50cmFja1RvTG9hZCA9IC0xO1xuXHRcdHBsYXllci5zZWxlY3RlZFRyYWNrID0gbnVsbDtcblx0XHRwbGF5ZXIuaXNMb2FkaW5nVHJhY2sgPSBmYWxzZTtcblxuXHRcdC8vIGFkZCB0byBsaXN0XG5cdFx0Zm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdGtpbmQgPSBwbGF5ZXIudHJhY2tzW2ldLmtpbmQ7XG5cdFx0XHRpZiAoa2luZCA9PT0gJ3N1YnRpdGxlcycgfHwga2luZCA9PT0gJ2NhcHRpb25zJykge1xuXHRcdFx0XHRwbGF5ZXIuYWRkVHJhY2tCdXR0b24ocGxheWVyLnRyYWNrc1tpXS50cmFja0lkLCBwbGF5ZXIudHJhY2tzW2ldLnNyY2xhbmcsIHBsYXllci50cmFja3NbaV0ubGFiZWwpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHN0YXJ0IGxvYWRpbmcgdHJhY2tzXG5cdFx0cGxheWVyLmxvYWROZXh0VHJhY2soKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGlzcGxheUNhcHRpb25zKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnNsaWRlc1NlbGVjdG9yICE9PSAnJykge1xuXHRcdFx0cGxheWVyLnNsaWRlc0NvbnRhaW5lciA9ICQocGxheWVyLm9wdGlvbnMuc2xpZGVzU2VsZWN0b3IpO1xuXG5cdFx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXIuZGlzcGxheVNsaWRlcygpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0fVxuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGlzcGxheUNoYXB0ZXJzKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0cGxheWVyLmNvbnRhaW5lci5ob3Zlcihcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBjaGFwdGVyc1xuXHRcdFx0XHRpZiAocGxheWVyLmhhc0NoYXB0ZXJzKSB7XG5cdFx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMuZmFkZUluKDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRsZXQgc2VsZiA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRzZWxmLmhlaWdodChzZWxmLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyYCkub3V0ZXJIZWlnaHQoKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHBsYXllci5oYXNDaGFwdGVycykge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5mYWRlT3V0KDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0dC5jb250YWluZXIub24oJ2NvbnRyb2xzcmVzaXplJywgKCkgPT4ge1xuXHRcdFx0dC5hZGp1c3RMYW5ndWFnZUJveCgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2hlY2sgZm9yIGF1dG9wbGF5XG5cdFx0aWYgKHBsYXllci5ub2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSAhPT0gbnVsbCkge1xuXHRcdFx0cGxheWVyLmNoYXB0ZXJzLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgZGVzdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBjbGVhbmAgYW5kIHRoZSBuYW1lIHRoYXQgd2FzIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqL1xuXHRjbGVhcnRyYWNrczogZnVuY3Rpb24gKHBsYXllcikgIHtcblx0XHRpZiAocGxheWVyKSB7XG5cdFx0XHRpZiAocGxheWVyLmNhcHRpb25zKSB7XG5cdFx0XHRcdHBsYXllci5jYXB0aW9ucy5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwbGF5ZXIuY2hhcHRlcnMpIHtcblx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBsYXllci5jYXB0aW9uc1RleHQpIHtcblx0XHRcdFx0cGxheWVyLmNhcHRpb25zVGV4dC5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwbGF5ZXIuY2FwdGlvbnNCdXR0b24pIHtcblx0XHRcdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRyZWJ1aWxkdHJhY2tzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHR0LmZpbmRUcmFja3MoKTtcblx0XHR0LmJ1aWxkdHJhY2tzKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0fSxcblxuXHRmaW5kVHJhY2tzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR0cmFja3RhZ3MgPSB0LiRtZWRpYS5maW5kKCd0cmFjaycpXG5cdFx0XHQ7XG5cblx0XHQvLyBzdG9yZSBmb3IgdXNlIGJ5IHBsdWdpbnNcblx0XHR0LnRyYWNrcyA9IFtdO1xuXHRcdHRyYWNrdGFncy5lYWNoKChpbmRleCwgdHJhY2spID0+IHtcblxuXHRcdFx0dHJhY2sgPSAkKHRyYWNrKTtcblxuXHRcdFx0bGV0IHNyY2xhbmcgPSAodHJhY2suYXR0cignc3JjbGFuZycpKSA/IHRyYWNrLmF0dHIoJ3NyY2xhbmcnKS50b0xvd2VyQ2FzZSgpIDogJyc7XG5cdFx0XHRsZXQgdHJhY2tJZCA9IGAke3QuaWR9X3RyYWNrXyR7aW5kZXh9XyR7dHJhY2suYXR0cigna2luZCcpfV8ke3NyY2xhbmd9YDtcblx0XHRcdHQudHJhY2tzLnB1c2goe1xuXHRcdFx0XHR0cmFja0lkOiB0cmFja0lkLFxuXHRcdFx0XHRzcmNsYW5nOiBzcmNsYW5nLFxuXHRcdFx0XHRzcmM6IHRyYWNrLmF0dHIoJ3NyYycpLFxuXHRcdFx0XHRraW5kOiB0cmFjay5hdHRyKCdraW5kJyksXG5cdFx0XHRcdGxhYmVsOiB0cmFjay5hdHRyKCdsYWJlbCcpIHx8ICcnLFxuXHRcdFx0XHRlbnRyaWVzOiBbXSxcblx0XHRcdFx0aXNMb2FkZWQ6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWQsIG9yIFwibm9uZVwiIHRvIGRpc2FibGUgY2FwdGlvbnNcblx0ICovXG5cdHNldFRyYWNrOiBmdW5jdGlvbiAodHJhY2tJZCkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aVxuXHRcdFx0O1xuXG5cdFx0dC5jYXB0aW9uc0J1dHRvblxuXHRcdFx0LmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcblx0XHRcdC5lbmQoKVxuXHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZGApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkYClcblx0XHRcdC5lbmQoKVxuXHRcdFx0LmZpbmQoYGlucHV0W3ZhbHVlPVwiJHt0cmFja0lkfVwiXWApLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuXHRcdFx0LnNpYmxpbmdzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWxgKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZGApXG5cdFx0O1xuXG5cdFx0aWYgKHRyYWNrSWQgPT09ICdub25lJykge1xuXHRcdFx0dC5zZWxlY3RlZFRyYWNrID0gbnVsbDtcblx0XHRcdHQuY2FwdGlvbnNCdXR0b24ucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWVuYWJsZWRgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdC50cmFja3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCB0cmFjayA9IHQudHJhY2tzW2ldO1xuXHRcdFx0aWYgKHRyYWNrLnRyYWNrSWQgPT09IHRyYWNrSWQpIHtcblx0XHRcdFx0aWYgKHQuc2VsZWN0ZWRUcmFjayA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHQuY2FwdGlvbnNCdXR0b24uYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWVuYWJsZWRgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0LnNlbGVjdGVkVHJhY2sgPSB0cmFjaztcblx0XHRcdFx0dC5jYXB0aW9ucy5hdHRyKCdsYW5nJywgdC5zZWxlY3RlZFRyYWNrLnNyY2xhbmcpO1xuXHRcdFx0XHR0LmRpc3BsYXlDYXB0aW9ucygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRsb2FkTmV4dFRyYWNrOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQudHJhY2tUb0xvYWQrKztcblx0XHRpZiAodC50cmFja1RvTG9hZCA8IHQudHJhY2tzLmxlbmd0aCkge1xuXHRcdFx0dC5pc0xvYWRpbmdUcmFjayA9IHRydWU7XG5cdFx0XHR0LmxvYWRUcmFjayh0LnRyYWNrVG9Mb2FkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gYWRkIGRvbmU/XG5cdFx0XHR0LmlzTG9hZGluZ1RyYWNrID0gZmFsc2U7XG5cblx0XHRcdHQuY2hlY2tGb3JUcmFja3MoKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBpbmRleFxuXHQgKi9cblx0bG9hZFRyYWNrOiBmdW5jdGlvbiAoaW5kZXgpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHRyYWNrID0gdC50cmFja3NbaW5kZXhdLFxuXHRcdFx0YWZ0ZXIgPSAoKSA9PiB7XG5cblx0XHRcdFx0dHJhY2suaXNMb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHRcdHQuZW5hYmxlVHJhY2tCdXR0b24odHJhY2spO1xuXG5cdFx0XHRcdHQubG9hZE5leHRUcmFjaygpO1xuXG5cdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRpZiAodHJhY2sgIT09IHVuZGVmaW5lZCAmJiAodHJhY2suc3JjICE9PSB1bmRlZmluZWQgfHwgdHJhY2suc3JjICE9PSBcIlwiKSkge1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiB0cmFjay5zcmMsXG5cdFx0XHRcdGRhdGFUeXBlOiAndGV4dCcsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkKSAge1xuXG5cdFx0XHRcdFx0Ly8gcGFyc2UgdGhlIGxvYWRlZCBmaWxlXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBkID09PSAnc3RyaW5nJyAmJiAoLzx0dFxccyt4bWwvaWcpLmV4ZWMoZCkpIHtcblx0XHRcdFx0XHRcdHRyYWNrLmVudHJpZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLmRmeHAucGFyc2UoZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyYWNrLmVudHJpZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLndlYnZ0dC5wYXJzZShkKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhZnRlcigpO1xuXG5cdFx0XHRcdFx0aWYgKHRyYWNrLmtpbmQgPT09ICdjaGFwdGVycycpIHtcblx0XHRcdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHQubWVkaWEuZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5kaXNwbGF5Q2hhcHRlcnMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0cmFjay5raW5kID09PSAnc2xpZGVzJykge1xuXHRcdFx0XHRcdFx0dC5zZXR1cFNsaWRlcyh0cmFjayk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkgIHtcblx0XHRcdFx0XHR0LnJlbW92ZVRyYWNrQnV0dG9uKHRyYWNrLnRyYWNrSWQpO1xuXHRcdFx0XHRcdHQubG9hZE5leHRUcmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFjayAtIFRoZSBsYW5ndWFnZSBjb2RlXG5cdCAqL1xuXHRlbmFibGVUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRsYW5nID0gdHJhY2suc3JjbGFuZyxcblx0XHRcdGxhYmVsID0gdHJhY2subGFiZWwsXG5cdFx0XHR0YXJnZXQgPSAkKGAjJHt0cmFjay50cmFja0lkfWApXG5cdFx0O1xuXG5cdFx0aWYgKGxhYmVsID09PSAnJykge1xuXHRcdFx0bGFiZWwgPSBpMThuLnQobWVqcy5sYW5ndWFnZS5jb2Rlc1tsYW5nXSkgfHwgbGFuZztcblx0XHR9XG5cblx0XHR0YXJnZXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcblx0XHQuc2libGluZ3MoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbGApLmh0bWwobGFiZWwpO1xuXG5cdFx0Ly8gYXV0byBzZWxlY3Rcblx0XHRpZiAodC5vcHRpb25zLnN0YXJ0TGFuZ3VhZ2UgPT09IGxhbmcpIHtcblx0XHRcdHRhcmdldC5wcm9wKCdjaGVja2VkJywgdHJ1ZSkudHJpZ2dlcignY2xpY2snKTtcblx0XHR9XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG5cdCAqL1xuXHRyZW1vdmVUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrSWQpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGBpbnB1dFtpZD0ke3RyYWNrSWR9XWApLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsYW5nIC0gVGhlIGxhbmd1YWdlIGNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsXG5cdCAqL1xuXHRhZGRUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrSWQsIGxhbmcsIGxhYmVsKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHRpZiAobGFiZWwgPT09ICcnKSB7XG5cdFx0XHRsYWJlbCA9IGkxOG4udChtZWpzLmxhbmd1YWdlLmNvZGVzW2xhbmddKSB8fCBsYW5nO1xuXHRcdH1cblxuXHRcdC8vIHRyYWNrSWQgaXMgdXNlZCBpbiB0aGUgdmFsdWUsIHRvbywgYmVjYXVzZSB0aGUgXCJub25lXCJcblx0XHQvLyBjYXB0aW9uIG9wdGlvbiBkb2Vzbid0IGhhdmUgYSB0cmFja0lkIGJ1dCB3ZSBuZWVkIHRvIGJlIGFibGVcblx0XHQvLyB0byBzZXQgaXQsIHRvb1xuXHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZCgndWwnKS5hcHBlbmQoXG5cdFx0XHQkKGA8bGkgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0LWl0ZW1cIj5gICtcblx0XHRcdFx0YDxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWlucHV0XCJgICtcblx0XHRcdFx0YG5hbWU9XCIke3QuaWR9X2NhcHRpb25zXCIgaWQ9XCIke3RyYWNrSWR9XCIgdmFsdWU9XCIke3RyYWNrSWR9XCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiIC8+YCArXG5cdFx0XHRcdGA8bGFiZWwgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbFwiPiR7bGFiZWx9IChsb2FkaW5nKTwvbGFiZWw+YCArXG5cdFx0XHRgPC9saT5gKVxuXHRcdCk7XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cblx0XHQvLyByZW1vdmUgdGhpcyBmcm9tIHRoZSBkcm9wZG93bmxpc3QgKGlmIGl0IGV4aXN0cylcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdHJhbnNsYXRpb25zIG9wdGlvblt2YWx1ZT0ke2xhbmd9XWApLnJlbW92ZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0YWRqdXN0TGFuZ3VhZ2VCb3g6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdC8vIGFkanVzdCB0aGUgc2l6ZSBvZiB0aGUgb3V0ZXIgYm94XG5cdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKS5oZWlnaHQoXG5cdFx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0YCkub3V0ZXJIZWlnaHQodHJ1ZSkgK1xuXHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdHJhbnNsYXRpb25zYCkub3V0ZXJIZWlnaHQodHJ1ZSlcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0Y2hlY2tGb3JUcmFja3M6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGhhc1N1YnRpdGxlcyA9IGZhbHNlXG5cdFx0O1xuXG5cdFx0Ly8gY2hlY2sgaWYgYW55IHN1YnRpdGxlc1xuXHRcdGlmICh0Lm9wdGlvbnMuaGlkZUNhcHRpb25zQnV0dG9uV2hlbkVtcHR5KSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0LnRyYWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBraW5kID0gdC50cmFja3NbaV0ua2luZDtcblx0XHRcdFx0aWYgKChraW5kID09PSAnc3VidGl0bGVzJyB8fCBraW5kID09PSAnY2FwdGlvbnMnKSAmJiB0LnRyYWNrc1tpXS5pc0xvYWRlZCkge1xuXHRcdFx0XHRcdGhhc1N1YnRpdGxlcyA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCFoYXNTdWJ0aXRsZXMpIHtcblx0XHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZGlzcGxheUNhcHRpb25zOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0aWYgKHRoaXMudHJhY2tzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dHJhY2sgPSB0LnNlbGVjdGVkVHJhY2ssXG5cdFx0XHRpXG5cdFx0O1xuXG5cdFx0aWYgKHRyYWNrICE9PSBudWxsICYmIHRyYWNrLmlzTG9hZGVkKSB7XG5cdFx0XHRpID0gdC5zZWFyY2hUcmFja1Bvc2l0aW9uKHRyYWNrLmVudHJpZXMsIHQubWVkaWEuY3VycmVudFRpbWUpO1xuXHRcdFx0aWYgKGkgPiAtMSkge1xuXHRcdFx0XHQvLyBTZXQgdGhlIGxpbmUgYmVmb3JlIHRoZSB0aW1lY29kZSBhcyBhIGNsYXNzIHNvIHRoZSBjdWUgY2FuIGJlIHRhcmdldGVkIGlmIG5lZWRlZFxuXHRcdFx0XHR0LmNhcHRpb25zVGV4dC5odG1sKHRyYWNrLmVudHJpZXNbaV0udGV4dClcblx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHQgJHsodHJhY2suZW50cmllc1tpXS5pZGVudGlmaWVyIHx8ICcnKX1gKTtcblx0XHRcdFx0dC5jYXB0aW9ucy5zaG93KCkuaGVpZ2h0KDApO1xuXHRcdFx0XHRyZXR1cm47IC8vIGV4aXQgb3V0IGlmIG9uZSBpcyB2aXNpYmxlO1xuXHRcdFx0fVxuXG5cdFx0XHR0LmNhcHRpb25zLmhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jYXB0aW9ucy5oaWRlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0cmFja1xuXHQgKi9cblx0c2V0dXBTbGlkZXM6IGZ1bmN0aW9uICh0cmFjaykgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LnNsaWRlcyA9IHRyYWNrO1xuXHRcdHQuc2xpZGVzLmVudHJpZXMuaW1ncyA9IFt0LnNsaWRlcy5lbnRyaWVzLmxlbmd0aF07XG5cdFx0dC5zaG93U2xpZGUoMCk7XG5cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG5cdCAqL1xuXHRzaG93U2xpZGU6IGZ1bmN0aW9uIChpbmRleCkgIHtcblx0XHRpZiAodGhpcy50cmFja3MgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnNsaWRlc0NvbnRhaW5lciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHVybCA9IHQuc2xpZGVzLmVudHJpZXNbaW5kZXhdLnRleHQsXG5cdFx0XHRpbWcgPSB0LnNsaWRlcy5lbnRyaWVzW2luZGV4XS5pbWdzXG5cdFx0O1xuXG5cdFx0aWYgKGltZyA9PT0gdW5kZWZpbmVkIHx8IGltZy5mYWRlSW4gPT09IHVuZGVmaW5lZCkge1xuXG5cdFx0XHR0LnNsaWRlcy5lbnRyaWVzW2luZGV4XS5pbWdzID0gaW1nID0gJChgPGltZyBzcmM9XCIke3VybH1cIj5gKVxuXHRcdFx0Lm9uKCdsb2FkJywgKCkgPT4ge1xuXHRcdFx0XHRpbWcuYXBwZW5kVG8odC5zbGlkZXNDb250YWluZXIpXG5cdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0LmZhZGVJbigpXG5cdFx0XHRcdC5zaWJsaW5ncygnOnZpc2libGUnKVxuXHRcdFx0XHQuZmFkZU91dCgpO1xuXG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmICghaW1nLmlzKCc6dmlzaWJsZScpICYmICFpbWcuaXMoJzphbmltYXRlZCcpKSB7XG5cdFx0XHRcdGltZy5mYWRlSW4oKVxuXHRcdFx0XHQuc2libGluZ3MoJzp2aXNpYmxlJylcblx0XHRcdFx0LmZhZGVPdXQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGRpc3BsYXlTbGlkZXM6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRpZiAodGhpcy5zbGlkZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRzbGlkZXMgPSB0LnNsaWRlcyxcblx0XHRcdGkgPSB0LnNlYXJjaFRyYWNrUG9zaXRpb24oc2xpZGVzLmVudHJpZXMsIHQubWVkaWEuY3VycmVudFRpbWUpXG5cdFx0O1xuXG5cdFx0aWYgKGkgPiAtMSkge1xuXHRcdFx0dC5zaG93U2xpZGUoaSk7XG5cdFx0XHRyZXR1cm47IC8vIGV4aXQgb3V0IGlmIG9uZSBpcyB2aXNpYmxlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGRpc3BsYXlDaGFwdGVyczogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0LnRyYWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRpZiAodC50cmFja3NbaV0ua2luZCA9PT0gJ2NoYXB0ZXJzJyAmJiB0LnRyYWNrc1tpXS5pc0xvYWRlZCkge1xuXHRcdFx0XHR0LmRyYXdDaGFwdGVycyh0LnRyYWNrc1tpXSk7XG5cdFx0XHRcdHQuaGFzQ2hhcHRlcnMgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjaGFwdGVyc1xuXHQgKi9cblx0ZHJhd0NoYXB0ZXJzOiBmdW5jdGlvbiAoY2hhcHRlcnMpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGksXG5cdFx0XHRkdXIsXG5cdFx0XHRwZXJjZW50ID0gMCxcblx0XHRcdHVzZWRQZXJjZW50ID0gMCxcblx0XHRcdHRvdGFsID0gY2hhcHRlcnMuZW50cmllcy5sZW5ndGhcblx0XHQ7XG5cblx0XHR0LmNoYXB0ZXJzLmVtcHR5KCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0ZHVyID0gY2hhcHRlcnMuZW50cmllc1tpXS5zdG9wIC0gY2hhcHRlcnMuZW50cmllc1tpXS5zdGFydDtcblx0XHRcdHBlcmNlbnQgPSBNYXRoLmZsb29yKGR1ciAvIHQubWVkaWEuZHVyYXRpb24gKiAxMDApO1xuXG5cdFx0XHQvLyB0b28gbGFyZ2Ugb3Igbm90IGdvaW5nIHRvIGZpbGwgaXQgaW5cblx0XHRcdGlmIChwZXJjZW50ICsgdXNlZFBlcmNlbnQgPiAxMDAgfHxcblx0XHRcdFx0aSA9PT0gY2hhcHRlcnMuZW50cmllcy5sZW5ndGggLSAxICYmIHBlcmNlbnQgKyB1c2VkUGVyY2VudCA8IDEwMCkge1xuXHRcdFx0XHRwZXJjZW50ID0gMTAwIC0gdXNlZFBlcmNlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHQuY2hhcHRlcnMuYXBwZW5kKCQoXG5cdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlclwiIHJlbD1cIiR7Y2hhcHRlcnMuZW50cmllc1tpXS5zdGFydH1cIiBzdHlsZT1cImxlZnQ6ICR7dXNlZFBlcmNlbnQudG9TdHJpbmcoKX0lOyB3aWR0aDogJHtwZXJjZW50LnRvU3RyaW5nKCl9JTtcIj5gICtcblx0XHRcdFx0IFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyLWJsb2NrYCArXG5cdFx0XHRcdCBcdGAkeyhpID09PSBjaGFwdGVycy5lbnRyaWVzLmxlbmd0aCAtIDEpID8gYCAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyLWJsb2NrLWxhc3RgIDogJyd9XCI+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCJjaC10aXRsZVwiPiR7Y2hhcHRlcnMuZW50cmllc1tpXS50ZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cImNoLXRpbWVcIj5gICtcblx0XHRcdFx0XHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUoY2hhcHRlcnMuZW50cmllc1tpXS5zdGFydCwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9YCArXG5cdFx0XHRcdCBcdFx0XHRgJm5kYXNoO2AgK1xuXHRcdFx0XHQgXHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUoY2hhcHRlcnMuZW50cmllc1tpXS5zdG9wLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX1gICtcblx0XHRcdFx0XHRcdGA8L3NwYW4+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YCkpO1xuXHRcdFx0dXNlZFBlcmNlbnQgKz0gcGVyY2VudDtcblx0XHR9XG5cblx0XHR0LmNoYXB0ZXJzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyYCkuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHR0Lm1lZGlhLnNldEN1cnJlbnRUaW1lKHBhcnNlRmxvYXQoJCh0aGlzKS5hdHRyKCdyZWwnKSkpO1xuXHRcdFx0aWYgKHQubWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdHQubWVkaWEucGxheSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dC5jaGFwdGVycy5zaG93KCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBQZXJmb3JtIGJpbmFyeSBzZWFyY2ggdG8gbG9vayBmb3IgcHJvcGVyIHRyYWNrIGluZGV4XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IHRyYWNrc1xuXHQgKiBAcGFyYW0ge051bWJlcn0gY3VycmVudFRpbWVcblx0ICogQHJldHVybiB7TnVtYmVyfVxuXHQgKi9cblx0c2VhcmNoVHJhY2tQb3NpdGlvbjogZnVuY3Rpb24gKHRyYWNrcywgY3VycmVudFRpbWUpICB7XG5cdFx0bGV0XG5cdFx0XHRsbyA9IDAsXG5cdFx0XHRoaSA9IHRyYWNrcy5sZW5ndGggLSAxLFxuXHRcdFx0bWlkLFxuXHRcdFx0c3RhcnQsXG5cdFx0XHRzdG9wXG5cdFx0XHQ7XG5cblx0XHR3aGlsZSAobG8gPD0gaGkpIHtcblx0XHRcdG1pZCA9ICgobG8gKyBoaSkgPj4gMSk7XG5cdFx0XHRzdGFydCA9IHRyYWNrc1ttaWRdLnN0YXJ0O1xuXHRcdFx0c3RvcCA9IHRyYWNrc1ttaWRdLnN0b3A7XG5cblx0XHRcdGlmIChjdXJyZW50VGltZSA+PSBzdGFydCAmJiBjdXJyZW50VGltZSA8IHN0b3ApIHtcblx0XHRcdFx0cmV0dXJuIG1pZDtcblx0XHRcdH0gZWxzZSBpZiAoc3RhcnQgPCBjdXJyZW50VGltZSkge1xuXHRcdFx0XHRsbyA9IG1pZCArIDE7XG5cdFx0XHR9IGVsc2UgaWYgKHN0YXJ0ID4gY3VycmVudFRpbWUpIHtcblx0XHRcdFx0aGkgPSBtaWQgLSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxufSk7XG5cbi8qKlxuICogTWFwIGFsbCBwb3NzaWJsZSBsYW5ndWFnZXMgd2l0aCB0aGVpciByZXNwZWN0aXZlIGNvZGVcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xubWVqcy5sYW5ndWFnZSA9IHtcblx0Y29kZXM6IHtcblx0XHRhZjogJ21lanMuYWZyaWthYW5zJyxcblx0XHRzcTogJ21lanMuYWxiYW5pYW4nLFxuXHRcdGFyOiAnbWVqcy5hcmFiaWMnLFxuXHRcdGJlOiAnbWVqcy5iZWxhcnVzaWFuJyxcblx0XHRiZzogJ21lanMuYnVsZ2FyaWFuJyxcblx0XHRjYTogJ21lanMuY2F0YWxhbicsXG5cdFx0emg6ICdtZWpzLmNoaW5lc2UnLFxuXHRcdCd6aC1jbic6ICdtZWpzLmNoaW5lc2Utc2ltcGxpZmllZCcsXG5cdFx0J3poLXR3JzogJ21lanMuY2hpbmVzLXRyYWRpdGlvbmFsJyxcblx0XHRocjogJ21lanMuY3JvYXRpYW4nLFxuXHRcdGNzOiAnbWVqcy5jemVjaCcsXG5cdFx0ZGE6ICdtZWpzLmRhbmlzaCcsXG5cdFx0bmw6ICdtZWpzLmR1dGNoJyxcblx0XHRlbjogJ21lanMuZW5nbGlzaCcsXG5cdFx0ZXQ6ICdtZWpzLmVzdG9uaWFuJyxcblx0XHRmbDogJ21lanMuZmlsaXBpbm8nLFxuXHRcdGZpOiAnbWVqcy5maW5uaXNoJyxcblx0XHRmcjogJ21lanMuZnJlbmNoJyxcblx0XHRnbDogJ21lanMuZ2FsaWNpYW4nLFxuXHRcdGRlOiAnbWVqcy5nZXJtYW4nLFxuXHRcdGVsOiAnbWVqcy5ncmVlaycsXG5cdFx0aHQ6ICdtZWpzLmhhaXRpYW4tY3Jlb2xlJyxcblx0XHRpdzogJ21lanMuaGVicmV3Jyxcblx0XHRoaTogJ21lanMuaGluZGknLFxuXHRcdGh1OiAnbWVqcy5odW5nYXJpYW4nLFxuXHRcdGlzOiAnbWVqcy5pY2VsYW5kaWMnLFxuXHRcdGlkOiAnbWVqcy5pbmRvbmVzaWFuJyxcblx0XHRnYTogJ21lanMuaXJpc2gnLFxuXHRcdGl0OiAnbWVqcy5pdGFsaWFuJyxcblx0XHRqYTogJ21lanMuamFwYW5lc2UnLFxuXHRcdGtvOiAnbWVqcy5rb3JlYW4nLFxuXHRcdGx2OiAnbWVqcy5sYXR2aWFuJyxcblx0XHRsdDogJ21lanMubGl0aHVhbmlhbicsXG5cdFx0bWs6ICdtZWpzLm1hY2Vkb25pYW4nLFxuXHRcdG1zOiAnbWVqcy5tYWxheScsXG5cdFx0bXQ6ICdtZWpzLm1hbHRlc2UnLFxuXHRcdG5vOiAnbWVqcy5ub3J3ZWdpYW4nLFxuXHRcdGZhOiAnbWVqcy5wZXJzaWFuJyxcblx0XHRwbDogJ21lanMucG9saXNoJyxcblx0XHRwdDogJ21lanMucG9ydHVndWVzZScsXG5cdFx0cm86ICdtZWpzLnJvbWFuaWFuJyxcblx0XHRydTogJ21lanMucnVzc2lhbicsXG5cdFx0c3I6ICdtZWpzLnNlcmJpYW4nLFxuXHRcdHNrOiAnbWVqcy5zbG92YWsnLFxuXHRcdHNsOiAnbWVqcy5zbG92ZW5pYW4nLFxuXHRcdGVzOiAnbWVqcy5zcGFuaXNoJyxcblx0XHRzdzogJ21lanMuc3dhaGlsaScsXG5cdFx0c3Y6ICdtZWpzLnN3ZWRpc2gnLFxuXHRcdHRsOiAnbWVqcy50YWdhbG9nJyxcblx0XHR0aDogJ21lanMudGhhaScsXG5cdFx0dHI6ICdtZWpzLnR1cmtpc2gnLFxuXHRcdHVrOiAnbWVqcy51a3JhaW5pYW4nLFxuXHRcdHZpOiAnbWVqcy52aWV0bmFtZXNlJyxcblx0XHRjeTogJ21lanMud2Vsc2gnLFxuXHRcdHlpOiAnbWVqcy55aWRkaXNoJ1xuXHR9XG59O1xuXG4vKlxuIFBhcnNlcyBXZWJWVFQgZm9ybWF0IHdoaWNoIHNob3VsZCBiZSBmb3JtYXR0ZWQgYXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIFdFQlZUVFxuXG4gMVxuIDAwOjAwOjAxLDEgLS0+IDAwOjAwOjA1LDAwMFxuIEEgbGluZSBvZiB0ZXh0XG5cbiAyXG4gMDA6MDE6MTUsMSAtLT4gMDA6MDI6MDUsMDAwXG4gQSBzZWNvbmQgbGluZSBvZiB0ZXh0XG5cbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiBBZGFwdGVkIGZyb206IGh0dHA6Ly93d3cuZGVscGhpa2kuY29tL2h0bWw1L3BsYXlyXG4gKi9cbm1lanMuVHJhY2tGb3JtYXRQYXJzZXIgPSB7XG5cdHdlYnZ0dDoge1xuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0cGF0dGVybl90aW1lY29kZTogL14oKD86WzAtOV17MSwyfTopP1swLTldezJ9OlswLTldezJ9KFssLl1bMC05XXsxLDN9KT8pIC0tXFw+ICgoPzpbMC05XXsxLDJ9Oik/WzAtOV17Mn06WzAtOV17Mn0oWywuXVswLTldezN9KT8pKC4qKSQvLFxuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tUZXh0XG5cdFx0ICogQHJldHVybnMge3t0ZXh0OiBBcnJheSwgdGltZXM6IEFycmF5fX1cblx0XHQgKi9cblx0XHRwYXJzZTogZnVuY3Rpb24gKHRyYWNrVGV4dCkgIHtcblx0XHRcdGxldFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bGluZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLnNwbGl0Mih0cmFja1RleHQsIC9cXHI/XFxuLyksXG5cdFx0XHRcdGVudHJpZXMgPSBbXSxcblx0XHRcdFx0dGltZWNvZGUsXG5cdFx0XHRcdHRleHQsXG5cdFx0XHRcdGlkZW50aWZpZXI7XG5cdFx0XHRmb3IgKDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRpbWVjb2RlID0gdGhpcy5wYXR0ZXJuX3RpbWVjb2RlLmV4ZWMobGluZXNbaV0pO1xuXG5cdFx0XHRcdGlmICh0aW1lY29kZSAmJiBpIDwgbGluZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKChpIC0gMSkgPj0gMCAmJiBsaW5lc1tpIC0gMV0gIT09ICcnKSB7XG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyID0gbGluZXNbaSAtIDFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0Ly8gZ3JhYiBhbGwgdGhlIChwb3NzaWJseSBtdWx0aS1saW5lKSB0ZXh0IHRoYXQgZm9sbG93c1xuXHRcdFx0XHRcdHRleHQgPSBsaW5lc1tpXTtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0d2hpbGUgKGxpbmVzW2ldICE9PSAnJyAmJiBpIDwgbGluZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0ZXh0ID0gYCR7dGV4dH1cXG4ke2xpbmVzW2ldfWA7XG5cdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRleHQgPSAkLnRyaW0odGV4dCkucmVwbGFjZSgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnLCBcIjxhIGhyZWY9JyQxJyB0YXJnZXQ9J19ibGFuayc+JDE8L2E+XCIpO1xuXHRcdFx0XHRcdGVudHJpZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuXHRcdFx0XHRcdFx0c3RhcnQ6IChjb252ZXJ0U01QVEV0b1NlY29uZHModGltZWNvZGVbMV0pID09PSAwKSA/IDAuMjAwIDogY29udmVydFNNUFRFdG9TZWNvbmRzKHRpbWVjb2RlWzFdKSxcblx0XHRcdFx0XHRcdHN0b3A6IGNvbnZlcnRTTVBURXRvU2Vjb25kcyh0aW1lY29kZVszXSksXG5cdFx0XHRcdFx0XHR0ZXh0OiB0ZXh0LFxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHRpbWVjb2RlWzVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWRlbnRpZmllciA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGVudHJpZXM7XG5cdFx0fVxuXHR9LFxuXHQvLyBUaGFua3MgdG8gSnVzdGluIENhcGVsbGE6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb2huZHllci9tZWRpYWVsZW1lbnQvcHVsbC80MjBcblx0ZGZ4cDoge1xuXHRcdC8qKlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrVGV4dFxuXHRcdCAqIEByZXR1cm5zIHt7dGV4dDogQXJyYXksIHRpbWVzOiBBcnJheX19XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICh0cmFja1RleHQpICB7XG5cdFx0XHR0cmFja1RleHQgPSAkKHRyYWNrVGV4dCkuZmlsdGVyKCd0dCcpO1xuXHRcdFx0bGV0XG5cdFx0XHRcdGNvbnRhaW5lciA9IHRyYWNrVGV4dC5jaGlsZHJlbignZGl2JykuZXEoMCksXG5cdFx0XHRcdGxpbmVzID0gY29udGFpbmVyLmZpbmQoJ3AnKSxcblx0XHRcdFx0c3R5bGVOb2RlID0gdHJhY2tUZXh0LmZpbmQoYCMke2NvbnRhaW5lci5hdHRyKCdzdHlsZScpfWApLFxuXHRcdFx0XHRzdHlsZXMsXG5cdFx0XHRcdGVudHJpZXMgPSBbXSxcblx0XHRcdFx0aVxuXHRcdFx0O1xuXG5cblx0XHRcdGlmIChzdHlsZU5vZGUubGVuZ3RoKSB7XG5cdFx0XHRcdGxldCBhdHRyaWJ1dGVzID0gc3R5bGVOb2RlLnJlbW92ZUF0dHIoJ2lkJykuZ2V0KDApLmF0dHJpYnV0ZXM7XG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHN0eWxlcyA9IHt9O1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRzdHlsZXNbYXR0cmlidXRlc1tpXS5uYW1lLnNwbGl0KFwiOlwiKVsxXV0gPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0c3R5bGUsXG5cdFx0XHRcdFx0X3RlbXAgPSB7XG5cdFx0XHRcdFx0XHRzdGFydDogbnVsbCxcblx0XHRcdFx0XHRcdHN0b3A6IG51bGwsXG5cdFx0XHRcdFx0XHRzdHlsZTogbnVsbCxcblx0XHRcdFx0XHRcdHRleHQ6IG51bGxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDtcblxuXHRcdFx0XHRpZiAobGluZXMuZXEoaSkuYXR0cignYmVnaW4nKSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0YXJ0ID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkpLmF0dHIoJ2JlZ2luJykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3RlbXAuc3RhcnQgJiYgbGluZXMuZXEoaSAtIDEpLmF0dHIoJ2VuZCcpKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RhcnQgPSBjb252ZXJ0U01QVEV0b1NlY29uZHMobGluZXMuZXEoaSAtIDEpLmF0dHIoJ2VuZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGluZXMuZXEoaSkuYXR0cignZW5kJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdG9wID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkpLmF0dHIoJ2VuZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90ZW1wLnN0b3AgJiYgbGluZXMuZXEoaSArIDEpLmF0dHIoJ2JlZ2luJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdG9wID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkgKyAxKS5hdHRyKCdiZWdpbicpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzdHlsZXMpIHtcblx0XHRcdFx0XHRzdHlsZSA9ICcnO1xuXHRcdFx0XHRcdGZvciAobGV0IF9zdHlsZSBpbiBzdHlsZXMpIHtcblx0XHRcdFx0XHRcdHN0eWxlICs9IGAke19zdHlsZX06JHtzdHlsZXNbX3N0eWxlXX07YDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN0eWxlKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX3RlbXAuc3RhcnQgPT09IDApIHtcblx0XHRcdFx0XHRfdGVtcC5zdGFydCA9IDAuMjAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF90ZW1wLnRleHQgPSAkLnRyaW0obGluZXMuZXEoaSkuaHRtbCgpKS5yZXBsYWNlKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWcsIFwiPGEgaHJlZj0nJDEnIHRhcmdldD0nX2JsYW5rJz4kMTwvYT5cIik7XG5cdFx0XHRcdGVudHJpZXMucHVzaChfdGVtcCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZW50cmllcztcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcmVnZXhcblx0ICogQHJldHVybnMge0FycmF5fVxuXHQgKi9cblx0c3BsaXQyOiBmdW5jdGlvbiAodGV4dCwgcmVnZXgpICB7XG5cdFx0Ly8gbm9ybWFsIHZlcnNpb24gZm9yIGNvbXBsaWFudCBicm93c2Vyc1xuXHRcdC8vIHNlZSBiZWxvdyBmb3IgSUUgZml4XG5cdFx0cmV0dXJuIHRleHQuc3BsaXQocmVnZXgpO1xuXHR9XG59O1xuXG4vLyB0ZXN0IGZvciBicm93c2VycyB3aXRoIGJhZCBTdHJpbmcuc3BsaXQgbWV0aG9kLlxuaWYgKCd4XFxuXFxueScuc3BsaXQoL1xcbi9naSkubGVuZ3RoICE9PSAzKSB7XG5cdC8vIGFkZCBzdXBlciBzbG93IElFOCBhbmQgYmVsb3cgdmVyc2lvblxuXHRtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLnNwbGl0MiA9ICh0ZXh0LCByZWdleCkgPT4ge1xuXHRcdGxldFxuXHRcdFx0cGFydHMgPSBbXSxcblx0XHRcdGNodW5rID0gJycsXG5cdFx0XHRpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNodW5rICs9IHRleHQuc3Vic3RyaW5nKGksIGkgKyAxKTtcblx0XHRcdGlmIChyZWdleC50ZXN0KGNodW5rKSkge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGNodW5rLnJlcGxhY2UocmVnZXgsICcnKSk7XG5cdFx0XHRcdGNodW5rID0gJyc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHBhcnRzLnB1c2goY2h1bmspO1xuXHRcdHJldHVybiBwYXJ0cztcblx0fTtcbn1cblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7SVNfQU5EUk9JRCwgSVNfSU9TfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuXG4vKipcbiAqIFZvbHVtZSBidXR0b25cbiAqXG4gKiBUaGlzIGZlYXR1cmUgZW5hYmxlcyB0aGUgZGlzcGxheWluZyBvZiBhIFZvbHVtZSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyBsb2dpYyB0byBtYW5pcHVsYXRlIGl0c1xuICogZXZlbnRzLCBzdWNoIGFzIHNsaWRpbmcgdXAvZG93biAob3IgbGVmdC9yaWdodCwgaWYgdmVydGljYWwpLCBtdXRpbmcvdW5tdXRpbmcgbWVkaWEsIGV0Yy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRtdXRlVGV4dDogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0YWxseVZvbHVtZUNvbnRyb2xUZXh0OiAnJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aGlkZVZvbHVtZU9uVG91Y2hEZXZpY2VzOiB0cnVlLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGF1ZGlvVm9sdW1lOiAnaG9yaXpvbnRhbCcsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dmlkZW9Wb2x1bWU6ICd2ZXJ0aWNhbCdcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGJ1aWxkdm9sdW1lOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblxuXHRcdC8vIEFuZHJvaWQgYW5kIGlPUyBkb24ndCBzdXBwb3J0IHZvbHVtZSBjb250cm9sc1xuXHRcdGlmICgoSVNfQU5EUk9JRCB8fCBJU19JT1MpICYmIHRoaXMub3B0aW9ucy5oaWRlVm9sdW1lT25Ub3VjaERldmljZXMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bW9kZSA9ICh0LmlzVmlkZW8pID8gdC5vcHRpb25zLnZpZGVvVm9sdW1lIDogdC5vcHRpb25zLmF1ZGlvVm9sdW1lLFxuXHRcdFx0bXV0ZVRleHQgPSB0Lm9wdGlvbnMubXV0ZVRleHQgPyB0Lm9wdGlvbnMubXV0ZVRleHQgOiBpMThuLnQoJ21lanMubXV0ZS10b2dnbGUnKSxcblx0XHRcdHZvbHVtZUNvbnRyb2xUZXh0ID0gdC5vcHRpb25zLmFsbHlWb2x1bWVDb250cm9sVGV4dCA/IHQub3B0aW9ucy5hbGx5Vm9sdW1lQ29udHJvbFRleHQgOiBpMThuLnQoJ21lanMudm9sdW1lLWhlbHAtdGV4dCcpLFxuXHRcdFx0bXV0ZSA9IChtb2RlID09PSAnaG9yaXpvbnRhbCcpID9cblxuXHRcdFx0XHQvLyBob3Jpem9udGFsIHZlcnNpb25cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7bXV0ZVRleHR9XCIgYXJpYS1sYWJlbD1cIiR7bXV0ZVRleHR9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1zbGlkZXJcIj5gICtcblx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj4ke3ZvbHVtZUNvbnRyb2xUZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLXRvdGFsXCI+YCArXG5cdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLWN1cnJlbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtaGFuZGxlXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9hPmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scykgOlxuXG5cdFx0XHRcdC8vIHZlcnRpY2FsIHZlcnNpb25cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7bXV0ZVRleHR9XCIgYXJpYS1sYWJlbD1cIiR7bXV0ZVRleHR9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdFx0YDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyXCI+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj4ke3ZvbHVtZUNvbnRyb2xUZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXRvdGFsXCI+YCArXG5cdFx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWN1cnJlbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtaGFuZGxlXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvYT5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scyksXG5cdFx0XHR2b2x1bWVTbGlkZXIgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlciwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1zbGlkZXJgKSxcblx0XHRcdHZvbHVtZVRvdGFsID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS10b3RhbCwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS10b3RhbGApLFxuXHRcdFx0dm9sdW1lQ3VycmVudCA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtY3VycmVudCwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1jdXJyZW50YCksXG5cdFx0XHR2b2x1bWVIYW5kbGUgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWhhbmRsZSwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1oYW5kbGVgKSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHZvbHVtZVxuXHRcdFx0ICovXG5cdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSA9ICh2b2x1bWUpID0+IHtcblxuXHRcdFx0XHQvLyBjb3JyZWN0IHRvIDAtMVxuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1heCgwLCB2b2x1bWUpO1xuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1pbih2b2x1bWUsIDEpO1xuXG5cdFx0XHRcdC8vIGFkanVzdCBtdXRlIGJ1dHRvbiBzdHlsZVxuXHRcdFx0XHRpZiAodm9sdW1lID09PSAwKSB7XG5cdFx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKTtcblx0XHRcdFx0XHRtdXRlLmNoaWxkcmVuKCdidXR0b24nKS5hdHRyKHtcblx0XHRcdFx0XHRcdHRpdGxlOiBpMThuLnQoJ21lanMudW5tdXRlJyksXG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IGkxOG4udCgnbWVqcy51bm11dGUnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCk7XG5cdFx0XHRcdFx0bXV0ZS5jaGlsZHJlbignYnV0dG9uJykuYXR0cih7XG5cdFx0XHRcdFx0XHR0aXRsZTogaTE4bi50KCdtZWpzLm11dGUnKSxcblx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogaTE4bi50KCdtZWpzLm11dGUnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHZvbHVtZVBlcmNlbnRhZ2UgPSBgJHsodm9sdW1lICogMTAwKX0lYDtcblxuXHRcdFx0XHQvLyBwb3NpdGlvbiBzbGlkZXJcblx0XHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0XHR2b2x1bWVDdXJyZW50LmNzcyh7XG5cdFx0XHRcdFx0XHRib3R0b206ICcwJyxcblx0XHRcdFx0XHRcdGhlaWdodDogdm9sdW1lUGVyY2VudGFnZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZvbHVtZUhhbmRsZS5jc3Moe1xuXHRcdFx0XHRcdFx0Ym90dG9tOiB2b2x1bWVQZXJjZW50YWdlLFxuXHRcdFx0XHRcdFx0bWFyZ2luQm90dG9tOiBgJHsoLXZvbHVtZUhhbmRsZS5oZWlnaHQoKSAvIDIpfXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZvbHVtZUN1cnJlbnQuY3NzKHtcblx0XHRcdFx0XHRcdGxlZnQ6ICcwJyxcblx0XHRcdFx0XHRcdHdpZHRoOiB2b2x1bWVQZXJjZW50YWdlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm9sdW1lSGFuZGxlLmNzcyh7XG5cdFx0XHRcdFx0XHRsZWZ0OiB2b2x1bWVQZXJjZW50YWdlLFxuXHRcdFx0XHRcdFx0bWFyZ2luTGVmdDogYCR7KC12b2x1bWVIYW5kbGUud2lkdGgoKSAvIDIpfXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRoYW5kbGVWb2x1bWVNb3ZlID0gKGUpID0+IHtcblxuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHR2b2x1bWUgPSBudWxsLFxuXHRcdFx0XHRcdHRvdGFsT2Zmc2V0ID0gdm9sdW1lVG90YWwub2Zmc2V0KClcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIGNhbGN1bGF0ZSB0aGUgbmV3IHZvbHVtZSBiYXNlZCBvbiB0aGUgbW9zdCByZWNlbnQgcG9zaXRpb25cblx0XHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblxuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0cmFpbEhlaWdodCA9IHZvbHVtZVRvdGFsLmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0bmV3WSA9IGUucGFnZVkgLSB0b3RhbE9mZnNldC50b3Bcblx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHR2b2x1bWUgPSAocmFpbEhlaWdodCAtIG5ld1kpIC8gcmFpbEhlaWdodDtcblxuXHRcdFx0XHRcdC8vIHRoZSBjb250cm9scyBqdXN0IGhpZGUgdGhlbXNlbHZlcyAodXN1YWxseSB3aGVuIG1vdXNlIG1vdmVzIHRvbyBmYXIgdXApXG5cdFx0XHRcdFx0aWYgKHRvdGFsT2Zmc2V0LnRvcCA9PT0gMCB8fCB0b3RhbE9mZnNldC5sZWZ0ID09PSAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRyYWlsV2lkdGggPSB2b2x1bWVUb3RhbC53aWR0aCgpLFxuXHRcdFx0XHRcdFx0bmV3WCA9IGUucGFnZVggLSB0b3RhbE9mZnNldC5sZWZ0XG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0dm9sdW1lID0gbmV3WCAvIHJhaWxXaWR0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVuc3VyZSB0aGUgdm9sdW1lIGlzbid0IG91dHNpZGUgMC0xXG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWF4KDAsIHZvbHVtZSk7XG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWluKHZvbHVtZSwgMSk7XG5cblx0XHRcdFx0Ly8gcG9zaXRpb24gdGhlIHNsaWRlciBhbmQgaGFuZGxlXG5cdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKHZvbHVtZSk7XG5cblx0XHRcdFx0Ly8gc2V0IHRoZSBtZWRpYSBvYmplY3QgKHRoaXMgd2lsbCB0cmlnZ2VyIHRoZSBgdm9sdW1lY2hhbmdlZGAgZXZlbnQpXG5cdFx0XHRcdGlmICh2b2x1bWUgPT09IDApIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHZvbHVtZSk7XG5cdFx0XHR9LFxuXHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZSxcblx0XHRcdG1vdXNlSXNPdmVyID0gZmFsc2U7XG5cblx0XHQvLyBTTElERVJcblx0XHRtdXRlXG5cdFx0XHQub24oJ21vdXNlZW50ZXIgZm9jdXNpbicsICgpID0+IHtcblx0XHRcdFx0dm9sdW1lU2xpZGVyLnNob3coKTtcblx0XHRcdFx0bW91c2VJc092ZXIgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHRcdC5vbignbW91c2VsZWF2ZSBmb2N1c291dCcsICgpID0+IHtcblx0XHRcdFx0bW91c2VJc092ZXIgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoIW1vdXNlSXNEb3duICYmIG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0XHR2b2x1bWVTbGlkZXIuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0bGV0IHVwZGF0ZVZvbHVtZVNsaWRlciA9ICgpID0+IHtcblxuXHRcdFx0bGV0IHZvbHVtZSA9IE1hdGguZmxvb3IobWVkaWEudm9sdW1lICogMTAwKTtcblxuXHRcdFx0dm9sdW1lU2xpZGVyLmF0dHIoe1xuXHRcdFx0XHQnYXJpYS1sYWJlbCc6IGkxOG4udCgnbWVqcy52b2x1bWUtc2xpZGVyJyksXG5cdFx0XHRcdCdhcmlhLXZhbHVlbWluJzogMCxcblx0XHRcdFx0J2FyaWEtdmFsdWVtYXgnOiAxMDAsXG5cdFx0XHRcdCdhcmlhLXZhbHVlbm93Jzogdm9sdW1lLFxuXHRcdFx0XHQnYXJpYS12YWx1ZXRleHQnOiBgJHt2b2x1bWV9JWAsXG5cdFx0XHRcdCdyb2xlJzogJ3NsaWRlcicsXG5cdFx0XHRcdCd0YWJpbmRleCc6IC0xXG5cdFx0XHR9KTtcblxuXHRcdH07XG5cblx0XHQvLyBFdmVudHNcblx0XHR2b2x1bWVTbGlkZXJcblx0XHRcdC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0XHRoYW5kbGVWb2x1bWVNb3ZlKGUpO1xuXHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNlbW92ZS52b2wnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGhhbmRsZVZvbHVtZU1vdmUoZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNldXAudm9sJywgKCkgPT4ge1xuXHRcdFx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2U7XG5cdFx0XHRcdFx0dC5nbG9iYWxVbmJpbmQoJ21vdXNlbW92ZS52b2wgbW91c2V1cC52b2wnKTtcblxuXHRcdFx0XHRcdGlmICghbW91c2VJc092ZXIgJiYgbW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHRcdFx0dm9sdW1lU2xpZGVyLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtb3VzZUlzRG93biA9IHRydWU7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSlcblx0XHRcdC5vbigna2V5ZG93bicsIChlKSA9PiB7XG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5rZXlBY3Rpb25zLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0a2V5Q29kZSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlIHx8IDAsXG5cdFx0XHRcdFx0XHR2b2x1bWUgPSBtZWRpYS52b2x1bWVcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0c3dpdGNoIChrZXlDb2RlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDM4OiAvLyBVcFxuXHRcdFx0XHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1pbih2b2x1bWUgKyAwLjEsIDEpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDA6IC8vIERvd25cblx0XHRcdFx0XHRcdFx0dm9sdW1lID0gTWF0aC5tYXgoMCwgdm9sdW1lIC0gMC4xKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKHZvbHVtZSk7XG5cdFx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHZvbHVtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIE1VVEUgYnV0dG9uXG5cdFx0bXV0ZS5maW5kKCdidXR0b24nKS5jbGljaygoKSA9PiB7XG5cdFx0XHRtZWRpYS5zZXRNdXRlZCghbWVkaWEubXV0ZWQpO1xuXHRcdH0pO1xuXG5cdFx0Ly9LZXlib2FyZCBpbnB1dFxuXHRcdG11dGUuZmluZCgnYnV0dG9uJykub24oJ2ZvY3VzJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0dm9sdW1lU2xpZGVyLnNob3coKTtcblx0XHRcdH1cblx0XHR9KS5vbignYmx1cicsICgpID0+IHtcblx0XHRcdGlmIChtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdHZvbHVtZVNsaWRlci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBsaXN0ZW4gZm9yIHZvbHVtZSBjaGFuZ2UgZXZlbnRzIGZyb20gb3RoZXIgc291cmNlc1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3ZvbHVtZWNoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRpZiAoIW1vdXNlSXNEb3duKSB7XG5cdFx0XHRcdGlmIChtZWRpYS5tdXRlZCkge1xuXHRcdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKDApO1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUobWVkaWEudm9sdW1lKTtcblx0XHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR1cGRhdGVWb2x1bWVTbGlkZXIoZSk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0Ly8gbXV0ZXMgdGhlIG1lZGlhIGFuZCBzZXRzIHRoZSB2b2x1bWUgaWNvbiBtdXRlZCBpZiB0aGUgaW5pdGlhbCB2b2x1bWUgaXMgc2V0IHRvIDBcblx0XHRpZiAocGxheWVyLm9wdGlvbnMuc3RhcnRWb2x1bWUgPT09IDApIHtcblx0XHRcdG1lZGlhLnNldE11dGVkKHRydWUpO1xuXHRcdH1cblxuXHRcdC8vIHNoaW0gZ2V0cyB0aGUgc3RhcnR2b2x1bWUgYXMgYSBwYXJhbWV0ZXIsIGJ1dCB3ZSBoYXZlIHRvIHNldCBpdCBvbiB0aGUgbmF0aXZlIDx2aWRlbz4gYW5kIDxhdWRpbz4gZWxlbWVudHNcblx0XHRsZXQgaXNOYXRpdmUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbDtcblxuXHRcdGlmIChpc05hdGl2ZSkge1xuXHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHBsYXllci5vcHRpb25zLnN0YXJ0Vm9sdW1lKTtcblx0XHR9XG5cblx0XHR0LmNvbnRhaW5lci5vbignY29udHJvbHNyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEubXV0ZWQpIHtcblx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUoMCk7XG5cdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUobWVkaWEudm9sdW1lKTtcblx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLyohXG4gKiBUaGlzIGlzIGEgYGkxOG5gIGxhbmd1YWdlIG9iamVjdC5cbiAqXG4gKiBFbmdsaXNoOyBUaGlzIGNhbiBzZXJ2ZSBhcyBhIHRlbXBsYXRlIGZvciBvdGhlciBsYW5ndWFnZXMgdG8gdHJhbnNsYXRlXG4gKlxuICogQGF1dGhvclxuICogICBUQkRcbiAqICAgU2FzY2hhIEdyZXVlbCAoVHdpdHRlcjogQFNvZnRDcmVhdFIpXG4gKlxuICogQHNlZSBjb3JlL2kxOG4uanNcbiAqL1xuZXhwb3J0IGNvbnN0IEVOID0ge1xuXHRcIm1lanMucGx1cmFsLWZvcm1cIjogMSxcblxuXHQvLyByZW5kZXJlcnMvZmxhc2guanNcblx0XCJtZWpzLmluc3RhbGwtZmxhc2hcIjogXCJZb3UgYXJlIHVzaW5nIGEgYnJvd3NlciB0aGF0IGRvZXMgbm90IGhhdmUgRmxhc2ggcGxheWVyIGVuYWJsZWQgb3IgaW5zdGFsbGVkLiBQbGVhc2UgdHVybiBvbiB5b3VyIEZsYXNoIHBsYXllciBwbHVnaW4gb3IgZG93bmxvYWQgdGhlIGxhdGVzdCB2ZXJzaW9uIGZyb20gaHR0cHM6Ly9nZXQuYWRvYmUuY29tL2ZsYXNocGxheWVyL1wiLFxuXG5cdC8vIGZlYXR1cmVzL2NvbnRleHRtZW51LmpzXG5cdFwibWVqcy5mdWxsc2NyZWVuLW9mZlwiOiBcIlR1cm4gb2ZmIEZ1bGxzY3JlZW5cIixcblx0XCJtZWpzLmZ1bGxzY3JlZW4tb25cIjogXCJHbyBGdWxsc2NyZWVuXCIsXG5cdFwibWVqcy5kb3dubG9hZC12aWRlb1wiOiBcIkRvd25sb2FkIFZpZGVvXCIsXG5cblx0Ly8gZmVhdHVyZXMvZnVsbHNjcmVlbi5qc1xuXHRcIm1lanMuZnVsbHNjcmVlblwiOiBcIkZ1bGxzY3JlZW5cIixcblxuXHQvLyBmZWF0dXJlcy9qdW1wZm9yd2FyZC5qc1xuXHRcIm1lanMudGltZS1qdW1wLWZvcndhcmRcIjogW1wiSnVtcCBmb3J3YXJkIDEgc2Vjb25kXCIsIFwiSnVtcCBmb3J3YXJkICUxIHNlY29uZHNcIl0sXG5cblx0Ly8gZmVhdHVyZXMvbG9vcC5qc1xuXHRcIm1lanMubG9vcFwiOiBcIlRvZ2dsZSBMb29wXCIsXG5cblx0Ly8gZmVhdHVyZXMvcGxheXBhdXNlLmpzXG5cdFwibWVqcy5wbGF5XCI6IFwiUGxheVwiLFxuXHRcIm1lanMucGF1c2VcIjogXCJQYXVzZVwiLFxuXG5cdC8vIGZlYXR1cmVzL3Bvc3Ryb2xsLmpzXG5cdFwibWVqcy5jbG9zZVwiOiBcIkNsb3NlXCIsXG5cblx0Ly8gZmVhdHVyZXMvcHJvZ3Jlc3MuanNcblx0XCJtZWpzLnRpbWUtc2xpZGVyXCI6IFwiVGltZSBTbGlkZXJcIixcblx0XCJtZWpzLnRpbWUtaGVscC10ZXh0XCI6IFwiVXNlIExlZnQvUmlnaHQgQXJyb3cga2V5cyB0byBhZHZhbmNlIG9uZSBzZWNvbmQsIFVwL0Rvd24gYXJyb3dzIHRvIGFkdmFuY2UgdGVuIHNlY29uZHMuXCIsXG5cblx0Ly8gZmVhdHVyZXMvc2tpcGJhY2suanNcblx0XCJtZWpzLnRpbWUtc2tpcC1iYWNrXCI6IFtcIlNraXAgYmFjayAxIHNlY29uZFwiLCBcIlNraXAgYmFjayAlMSBzZWNvbmRzXCJdLFxuXG5cdC8vIGZlYXR1cmVzL3RyYWNrcy5qc1xuXHRcIm1lanMuY2FwdGlvbnMtc3VidGl0bGVzXCI6IFwiQ2FwdGlvbnMvU3VidGl0bGVzXCIsXG5cdFwibWVqcy5ub25lXCI6IFwiTm9uZVwiLFxuXG5cdC8vIGZlYXR1cmVzL3ZvbHVtZS5qc1xuXHRcIm1lanMubXV0ZS10b2dnbGVcIjogXCJNdXRlIFRvZ2dsZVwiLFxuXHRcIm1lanMudm9sdW1lLWhlbHAtdGV4dFwiOiBcIlVzZSBVcC9Eb3duIEFycm93IGtleXMgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2Ugdm9sdW1lLlwiLFxuXHRcIm1lanMudW5tdXRlXCI6IFwiVW5tdXRlXCIsXG5cdFwibWVqcy5tdXRlXCI6IFwiTXV0ZVwiLFxuXHRcIm1lanMudm9sdW1lLXNsaWRlclwiOiBcIlZvbHVtZSBTbGlkZXJcIixcblxuXHQvLyBjb3JlL3BsYXllci5qc1xuXHRcIm1lanMudmlkZW8tcGxheWVyXCI6IFwiVmlkZW8gUGxheWVyXCIsXG5cdFwibWVqcy5hdWRpby1wbGF5ZXJcIjogXCJBdWRpbyBQbGF5ZXJcIixcblxuXHQvLyBmZWF0dXJlcy9hZHMuanNcblx0XCJtZWpzLmFkLXNraXBcIjogXCJTa2lwIGFkXCIsXG5cdFwibWVqcy5hZC1za2lwLWluZm9cIjogW1wiU2tpcCBpbiAxIHNlY29uZFwiLCBcIlNraXAgaW4gJTEgc2Vjb25kc1wiXSxcblxuXHQvLyBmZWF0dXJlcy9zb3VyY2VjaG9vc2VyLmpzXG5cdFwibWVqcy5zb3VyY2UtY2hvb3NlclwiOiBcIlNvdXJjZSBDaG9vc2VyXCIsXG5cblx0Ly8gZmVhdHVyZXMvc3RvcC5qc1xuXHRcIm1lanMuc3RvcFwiOiBcIlN0b3BcIixcblxuXHQvL2ZlYXR1cmVzL3NwZWVkLmpzXG5cdFwibWVqcy5zcGVlZC1yYXRlXCIgOiBcIlNwZWVkIFJhdGVcIixcblxuXHQvL2ZlYXR1cmVzL3Byb2dyZXNzLmpzXG5cdFwibWVqcy5saXZlLWJyb2FkY2FzdFwiIDogXCJMaXZlIEJyb2FkY2FzdFwiLFxuXG5cdC8vIGZlYXR1cmVzL3RyYWNrcy5qc1xuXHRcIm1lanMuYWZyaWthYW5zXCI6IFwiQWZyaWthYW5zXCIsXG5cdFwibWVqcy5hbGJhbmlhblwiOiBcIkFsYmFuaWFuXCIsXG5cdFwibWVqcy5hcmFiaWNcIjogXCJBcmFiaWNcIixcblx0XCJtZWpzLmJlbGFydXNpYW5cIjogXCJCZWxhcnVzaWFuXCIsXG5cdFwibWVqcy5idWxnYXJpYW5cIjogXCJCdWxnYXJpYW5cIixcblx0XCJtZWpzLmNhdGFsYW5cIjogXCJDYXRhbGFuXCIsXG5cdFwibWVqcy5jaGluZXNlXCI6IFwiQ2hpbmVzZVwiLFxuXHRcIm1lanMuY2hpbmVzZS1zaW1wbGlmaWVkXCI6IFwiQ2hpbmVzZSAoU2ltcGxpZmllZClcIixcblx0XCJtZWpzLmNoaW5lc2UtdHJhZGl0aW9uYWxcIjogXCJDaGluZXNlIChUcmFkaXRpb25hbClcIixcblx0XCJtZWpzLmNyb2F0aWFuXCI6IFwiQ3JvYXRpYW5cIixcblx0XCJtZWpzLmN6ZWNoXCI6IFwiQ3plY2hcIixcblx0XCJtZWpzLmRhbmlzaFwiOiBcIkRhbmlzaFwiLFxuXHRcIm1lanMuZHV0Y2hcIjogXCJEdXRjaFwiLFxuXHRcIm1lanMuZW5nbGlzaFwiOiBcIkVuZ2xpc2hcIixcblx0XCJtZWpzLmVzdG9uaWFuXCI6IFwiRXN0b25pYW5cIixcblx0XCJtZWpzLmZpbGlwaW5vXCI6IFwiRmlsaXBpbm9cIixcblx0XCJtZWpzLmZpbm5pc2hcIjogXCJGaW5uaXNoXCIsXG5cdFwibWVqcy5mcmVuY2hcIjogXCJGcmVuY2hcIixcblx0XCJtZWpzLmdhbGljaWFuXCI6IFwiR2FsaWNpYW5cIixcblx0XCJtZWpzLmdlcm1hblwiOiBcIkdlcm1hblwiLFxuXHRcIm1lanMuZ3JlZWtcIjogXCJHcmVla1wiLFxuXHRcIm1lanMuaGFpdGlhbi1jcmVvbGVcIjogXCJIYWl0aWFuIENyZW9sZVwiLFxuXHRcIm1lanMuaGVicmV3XCI6IFwiSGVicmV3XCIsXG5cdFwibWVqcy5oaW5kaVwiOiBcIkhpbmRpXCIsXG5cdFwibWVqcy5odW5nYXJpYW5cIjogXCJIdW5nYXJpYW5cIixcblx0XCJtZWpzLmljZWxhbmRpY1wiOiBcIkljZWxhbmRpY1wiLFxuXHRcIm1lanMuaW5kb25lc2lhblwiOiBcIkluZG9uZXNpYW5cIixcblx0XCJtZWpzLmlyaXNoXCI6IFwiSXJpc2hcIixcblx0XCJtZWpzLml0YWxpYW5cIjogXCJJdGFsaWFuXCIsXG5cdFwibWVqcy5qYXBhbmVzZVwiOiBcIkphcGFuZXNlXCIsXG5cdFwibWVqcy5rb3JlYW5cIjogXCJLb3JlYW5cIixcblx0XCJtZWpzLmxhdHZpYW5cIjogXCJMYXR2aWFuXCIsXG5cdFwibWVqcy5saXRodWFuaWFuXCI6IFwiTGl0aHVhbmlhblwiLFxuXHRcIm1lanMubWFjZWRvbmlhblwiOiBcIk1hY2Vkb25pYW5cIixcblx0XCJtZWpzLm1hbGF5XCI6IFwiTWFsYXlcIixcblx0XCJtZWpzLm1hbHRlc2VcIjogXCJNYWx0ZXNlXCIsXG5cdFwibWVqcy5ub3J3ZWdpYW5cIjogXCJOb3J3ZWdpYW5cIixcblx0XCJtZWpzLnBlcnNpYW5cIjogXCJQZXJzaWFuXCIsXG5cdFwibWVqcy5wb2xpc2hcIjogXCJQb2xpc2hcIixcblx0XCJtZWpzLnBvcnR1Z3Vlc2VcIjogXCJQb3J0dWd1ZXNlXCIsXG5cdFwibWVqcy5yb21hbmlhblwiOiBcIlJvbWFuaWFuXCIsXG5cdFwibWVqcy5ydXNzaWFuXCI6IFwiUnVzc2lhblwiLFxuXHRcIm1lanMuc2VyYmlhblwiOiBcIlNlcmJpYW5cIixcblx0XCJtZWpzLnNsb3Zha1wiOiBcIlNsb3Zha1wiLFxuXHRcIm1lanMuc2xvdmVuaWFuXCI6IFwiU2xvdmVuaWFuXCIsXG5cdFwibWVqcy5zcGFuaXNoXCI6IFwiU3BhbmlzaFwiLFxuXHRcIm1lanMuc3dhaGlsaVwiOiBcIlN3YWhpbGlcIixcblx0XCJtZWpzLnN3ZWRpc2hcIjogXCJTd2VkaXNoXCIsXG5cdFwibWVqcy50YWdhbG9nXCI6IFwiVGFnYWxvZ1wiLFxuXHRcIm1lanMudGhhaVwiOiBcIlRoYWlcIixcblx0XCJtZWpzLnR1cmtpc2hcIjogXCJUdXJraXNoXCIsXG5cdFwibWVqcy51a3JhaW5pYW5cIjogXCJVa3JhaW5pYW5cIixcblx0XCJtZWpzLnZpZXRuYW1lc2VcIjogXCJWaWV0bmFtZXNlXCIsXG5cdFwibWVqcy53ZWxzaFwiOiBcIldlbHNoXCIsXG5cdFwibWVqcy55aWRkaXNoXCI6IFwiWWlkZGlzaFwiXG59OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi9jb3JlL21lanMnO1xuXG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy4kID0galF1ZXJ5O1xufSBlbHNlIGlmICh0eXBlb2YgWmVwdG8gIT09ICd1bmRlZmluZWQnKSB7XG5cdG1lanMuJCA9IFplcHRvO1xuXG5cdC8vIGRlZmluZSBgb3V0ZXJXaWR0aGAgbWV0aG9kIHdoaWNoIGhhcyBub3QgYmVlbiByZWFsaXplZCBpbiBaZXB0b1xuXHRaZXB0by5mbi5vdXRlcldpZHRoID0gZnVuY3Rpb24gKGluY2x1ZGVNYXJnaW4pIHtcblx0XHRsZXQgd2lkdGggPSAkKHRoaXMpLndpZHRoKCk7XG5cdFx0aWYgKGluY2x1ZGVNYXJnaW4pIHtcblx0XHRcdHdpZHRoICs9IHBhcnNlSW50KCQodGhpcykuY3NzKCdtYXJnaW4tcmlnaHQnKSwgMTApO1xuXHRcdFx0d2lkdGggKz0gcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKTtcblx0XHR9XG5cdFx0cmV0dXJuIHdpZHRoO1xuXHR9O1xuXG59IGVsc2UgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy4kID0gZW5kZXI7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuL2NvcmUvbWVqcyc7XG5pbXBvcnQgTWVkaWFFbGVtZW50IGZyb20gJy4vY29yZS9tZWRpYWVsZW1lbnQnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtcblx0SVNfRklSRUZPWCxcblx0SVNfSVBBRCxcblx0SVNfSVBIT05FLFxuXHRJU19BTkRST0lELFxuXHRJU19JT1MsXG5cdEhBU19UT1VDSCxcblx0SEFTX01TX05BVElWRV9GVUxMU0NSRUVOLFxuXHRIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTlxufSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3NwbGl0RXZlbnRzfSBmcm9tICcuL3V0aWxzL2dlbmVyYWwnO1xuaW1wb3J0IHtjYWxjdWxhdGVUaW1lRm9ybWF0fSBmcm9tICcuL3V0aWxzL3RpbWUnO1xuaW1wb3J0IHtpc05vZGVBZnRlcn0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5tZWpzLm1lcEluZGV4ID0gMDtcblxubWVqcy5wbGF5ZXJzID0ge307XG5cbi8vIGRlZmF1bHQgcGxheWVyIHZhbHVlc1xuZXhwb3J0IGxldCBjb25maWcgPSB7XG5cdC8vIHVybCB0byBwb3N0ZXIgKHRvIGZpeCBpT1MgMy54KVxuXHRwb3N0ZXI6ICcnLFxuXHQvLyBXaGVuIHRoZSB2aWRlbyBpcyBlbmRlZCwgd2UgY2FuIHNob3cgdGhlIHBvc3Rlci5cblx0c2hvd1Bvc3RlcldoZW5FbmRlZDogZmFsc2UsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIDx2aWRlbyB3aWR0aD4gaXMgbm90IHNwZWNpZmllZFxuXHRkZWZhdWx0VmlkZW9XaWR0aDogNDgwLFxuXHQvLyBkZWZhdWx0IGlmIHRoZSA8dmlkZW8gaGVpZ2h0PiBpcyBub3Qgc3BlY2lmaWVkXG5cdGRlZmF1bHRWaWRlb0hlaWdodDogMjcwLFxuXHQvLyBpZiBzZXQsIG92ZXJyaWRlcyA8dmlkZW8gd2lkdGg+XG5cdHZpZGVvV2lkdGg6IC0xLFxuXHQvLyBpZiBzZXQsIG92ZXJyaWRlcyA8dmlkZW8gaGVpZ2h0PlxuXHR2aWRlb0hlaWdodDogLTEsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIHVzZXIgZG9lc24ndCBzcGVjaWZ5XG5cdGRlZmF1bHRBdWRpb1dpZHRoOiA0MDAsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIHVzZXIgZG9lc24ndCBzcGVjaWZ5XG5cdGRlZmF1bHRBdWRpb0hlaWdodDogNDAsXG5cdC8vIGRlZmF1bHQgYW1vdW50IHRvIG1vdmUgYmFjayB3aGVuIGJhY2sga2V5IGlzIHByZXNzZWRcblx0ZGVmYXVsdFNlZWtCYWNrd2FyZEludGVydmFsOiAobWVkaWEpID0+IG1lZGlhLmR1cmF0aW9uICogMC4wNSxcblx0Ly8gZGVmYXVsdCBhbW91bnQgdG8gbW92ZSBmb3J3YXJkIHdoZW4gZm9yd2FyZCBrZXkgaXMgcHJlc3NlZFxuXHRkZWZhdWx0U2Vla0ZvcndhcmRJbnRlcnZhbDogKG1lZGlhKSA9PiBtZWRpYS5kdXJhdGlvbiAqIDAuMDUsXG5cdC8vIHNldCBkaW1lbnNpb25zIHZpYSBKUyBpbnN0ZWFkIG9mIENTU1xuXHRzZXREaW1lbnNpb25zOiB0cnVlLFxuXHQvLyB3aWR0aCBvZiBhdWRpbyBwbGF5ZXJcblx0YXVkaW9XaWR0aDogLTEsXG5cdC8vIGhlaWdodCBvZiBhdWRpbyBwbGF5ZXJcblx0YXVkaW9IZWlnaHQ6IC0xLFxuXHQvLyBpbml0aWFsIHZvbHVtZSB3aGVuIHRoZSBwbGF5ZXIgc3RhcnRzIChvdmVycmlkZGVuIGJ5IHVzZXIgY29va2llKVxuXHRzdGFydFZvbHVtZTogMC44LFxuXHQvLyB1c2VmdWwgZm9yIDxhdWRpbz4gcGxheWVyIGxvb3BzXG5cdGxvb3A6IGZhbHNlLFxuXHQvLyByZXdpbmQgdG8gYmVnaW5uaW5nIHdoZW4gbWVkaWEgZW5kc1xuXHRhdXRvUmV3aW5kOiB0cnVlLFxuXHQvLyByZXNpemUgdG8gbWVkaWEgZGltZW5zaW9uc1xuXHRlbmFibGVBdXRvc2l6ZTogdHJ1ZSxcblx0Lypcblx0ICogVGltZSBmb3JtYXQgdG8gdXNlLiBEZWZhdWx0OiAnbW06c3MnXG5cdCAqIFN1cHBvcnRlZCB1bml0czpcblx0ICogICBoOiBob3VyXG5cdCAqICAgbTogbWludXRlXG5cdCAqICAgczogc2Vjb25kXG5cdCAqICAgZjogZnJhbWUgY291bnRcblx0ICogV2hlbiB1c2luZyAnaGgnLCAnbW0nLCAnc3MnIG9yICdmZicgd2UgYWx3YXlzIGRpc3BsYXkgMiBkaWdpdHMuXG5cdCAqIElmIHlvdSB1c2UgJ2gnLCAnbScsICdzJyBvciAnZicgd2UgZGlzcGxheSAxIGRpZ2l0IGlmIHBvc3NpYmxlLlxuXHQgKlxuXHQgKiBFeGFtcGxlIHRvIGRpc3BsYXkgNzUgc2Vjb25kczpcblx0ICogRm9ybWF0ICdtbTpzcyc6IDAxOjE1XG5cdCAqIEZvcm1hdCAnbTpzcyc6IDE6MTVcblx0ICogRm9ybWF0ICdtOnMnOiAxOjE1XG5cdCAqL1xuXHR0aW1lRm9ybWF0OiAnJyxcblx0Ly8gZm9yY2VzIHRoZSBob3VyIG1hcmtlciAoIyM6MDA6MDApXG5cdGFsd2F5c1Nob3dIb3VyczogZmFsc2UsXG5cdC8vIHNob3cgZnJhbWVjb3VudCBpbiB0aW1lY29kZSAoIyM6MDA6MDA6MDApXG5cdHNob3dUaW1lY29kZUZyYW1lQ291bnQ6IGZhbHNlLFxuXHQvLyB1c2VkIHdoZW4gc2hvd1RpbWVjb2RlRnJhbWVDb3VudCBpcyBzZXQgdG8gdHJ1ZVxuXHRmcmFtZXNQZXJTZWNvbmQ6IDI1LFxuXHQvLyBIaWRlIGNvbnRyb2xzIHdoZW4gcGxheWluZyBhbmQgbW91c2UgaXMgbm90IG92ZXIgdGhlIHZpZGVvXG5cdGFsd2F5c1Nob3dDb250cm9sczogZmFsc2UsXG5cdC8vIERpc3BsYXkgdGhlIHZpZGVvIGNvbnRyb2xcblx0aGlkZVZpZGVvQ29udHJvbHNPbkxvYWQ6IGZhbHNlLFxuXHQvLyBFbmFibGUgY2xpY2sgdmlkZW8gZWxlbWVudCB0byB0b2dnbGUgcGxheS9wYXVzZVxuXHRjbGlja1RvUGxheVBhdXNlOiB0cnVlLFxuXHQvLyBUaW1lIGluIG1zIHRvIGhpZGUgY29udHJvbHNcblx0Y29udHJvbHNUaW1lb3V0RGVmYXVsdDogMTUwMCxcblx0Ly8gVGltZSBpbiBtcyB0byB0cmlnZ2VyIHRoZSB0aW1lciB3aGVuIG1vdXNlIG1vdmVzXG5cdGNvbnRyb2xzVGltZW91dE1vdXNlRW50ZXI6IDI1MDAsXG5cdC8vIFRpbWUgaW4gbXMgdG8gdHJpZ2dlciB0aGUgdGltZXIgd2hlbiBtb3VzZSBsZWF2ZXNcblx0Y29udHJvbHNUaW1lb3V0TW91c2VMZWF2ZTogMTAwMCxcblx0Ly8gZm9yY2UgaVBhZCdzIG5hdGl2ZSBjb250cm9sc1xuXHRpUGFkVXNlTmF0aXZlQ29udHJvbHM6IGZhbHNlLFxuXHQvLyBmb3JjZSBpUGhvbmUncyBuYXRpdmUgY29udHJvbHNcblx0aVBob25lVXNlTmF0aXZlQ29udHJvbHM6IGZhbHNlLFxuXHQvLyBmb3JjZSBBbmRyb2lkJ3MgbmF0aXZlIGNvbnRyb2xzXG5cdEFuZHJvaWRVc2VOYXRpdmVDb250cm9sczogZmFsc2UsXG5cdC8vIGZlYXR1cmVzIHRvIHNob3dcblx0ZmVhdHVyZXM6IFsncGxheXBhdXNlJywgJ2N1cnJlbnQnLCAncHJvZ3Jlc3MnLCAnZHVyYXRpb24nLCAndHJhY2tzJywgJ3ZvbHVtZScsICdmdWxsc2NyZWVuJ10sXG5cdC8vIG9ubHkgZm9yIGR5bmFtaWNcblx0aXNWaWRlbzogdHJ1ZSxcblx0Ly8gc3RyZXRjaGluZyBtb2RlcyAoYXV0bywgZmlsbCwgcmVzcG9uc2l2ZSwgbm9uZSlcblx0c3RyZXRjaGluZzogJ2F1dG8nLFxuXHQvLyBwcmVmaXggY2xhc3MgbmFtZXMgb24gZWxlbWVudHNcblx0Y2xhc3NQcmVmaXg6ICdtZWpzX18nLFxuXHQvLyB0dXJucyBrZXlib2FyZCBzdXBwb3J0IG9uIGFuZCBvZmYgZm9yIHRoaXMgaW5zdGFuY2Vcblx0ZW5hYmxlS2V5Ym9hcmQ6IHRydWUsXG5cdC8vIHdoZW4gdGhpcyBwbGF5ZXIgc3RhcnRzLCBpdCB3aWxsIHBhdXNlIG90aGVyIHBsYXllcnNcblx0cGF1c2VPdGhlclBsYXllcnM6IHRydWUsXG5cdC8vIGFycmF5IG9mIGtleWJvYXJkIGFjdGlvbnMgc3VjaCBhcyBwbGF5L3BhdXNlXG5cdGtleUFjdGlvbnM6IFtcblx0XHR7XG5cdFx0XHRrZXlzOiBbXG5cdFx0XHRcdDMyLCAvLyBTUEFDRVxuXHRcdFx0XHQxNzkgLy8gR09PR0xFIHBsYXkvcGF1c2UgYnV0dG9uXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmICghSVNfRklSRUZPWCkge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQgfHwgbWVkaWEuZW5kZWQpIHtcblx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFszOF0sIC8vIFVQXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24+YnV0dG9uYCkuaXMoJzpmb2N1cycpIHx8XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmlzKCc6Zm9jdXMnKSkge1xuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IG5ld1ZvbHVtZSA9IE1hdGgubWluKG1lZGlhLnZvbHVtZSArIDAuMSwgMSk7XG5cdFx0XHRcdG1lZGlhLnNldFZvbHVtZShuZXdWb2x1bWUpO1xuXHRcdFx0XHRpZiAobmV3Vm9sdW1lID4gMCkge1xuXHRcdFx0XHRcdG1lZGlhLnNldE11dGVkKGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbNDBdLCAvLyBET1dOXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24+YnV0dG9uYCkuaXMoJzpmb2N1cycpIHx8XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmlzKCc6Zm9jdXMnKSkge1xuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgbmV3Vm9sdW1lID0gTWF0aC5tYXgobWVkaWEudm9sdW1lIC0gMC4xLCAwKTtcblx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKG5ld1ZvbHVtZSk7XG5cblx0XHRcdFx0aWYgKG5ld1ZvbHVtZSA8PSAwLjEpIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbXG5cdFx0XHRcdDM3LCAvLyBMRUZUXG5cdFx0XHRcdDIyNyAvLyBHb29nbGUgVFYgcmV3aW5kXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXHRcdFx0XHRpZiAoIWlzTmFOKG1lZGlhLmR1cmF0aW9uKSAmJiBtZWRpYS5kdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyA1JVxuXHRcdFx0XHRcdGxldCBuZXdUaW1lID0gTWF0aC5tYXgobWVkaWEuY3VycmVudFRpbWUgLSBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0JhY2t3YXJkSW50ZXJ2YWwobWVkaWEpLCAwKTtcblx0XHRcdFx0XHRtZWRpYS5zZXRDdXJyZW50VGltZShuZXdUaW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogW1xuXHRcdFx0XHQzOSwgLy8gUklHSFRcblx0XHRcdFx0MjI4IC8vIEdvb2dsZSBUViBmb3J3YXJkXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmICghaXNOYU4obWVkaWEuZHVyYXRpb24pICYmIG1lZGlhLmR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIDUlXG5cdFx0XHRcdFx0bGV0IG5ld1RpbWUgPSBNYXRoLm1pbihtZWRpYS5jdXJyZW50VGltZSArIHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrRm9yd2FyZEludGVydmFsKG1lZGlhKSwgbWVkaWEuZHVyYXRpb24pO1xuXHRcdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbNzBdLCAvLyBGXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhLCBrZXksIGV2ZW50KSA9PiB7XG5cdFx0XHRcdGlmICghZXZlbnQuY3RybEtleSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcGxheWVyLmVudGVyRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdGlmIChwbGF5ZXIuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0XHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmVudGVyRnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogWzc3XSwgLy8gTVxuXHRcdFx0YWN0aW9uOiAocGxheWVyKSA9PiB7XG5cblx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwbGF5ZXIubWVkaWEubXV0ZWQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2V0TXV0ZWQoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBsYXllci5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XVxufTtcblxubWVqcy5NZXBEZWZhdWx0cyA9IGNvbmZpZztcblxuLyoqXG4gKiBXcmFwIGEgTWVkaWFFbGVtZW50IG9iamVjdCBpbiBwbGF5ZXIgY29udHJvbHNcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvXG4gKiBAcmV0dXJuIHs/TWVkaWFFbGVtZW50UGxheWVyfVxuICovXG5jbGFzcyBNZWRpYUVsZW1lbnRQbGF5ZXIge1xuXG5cdGNvbnN0cnVjdG9yIChub2RlLCBvKSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0Lmhhc0ZvY3VzID0gZmFsc2U7XG5cblx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cblx0XHR0LmNvbnRyb2xzRW5hYmxlZCA9IHRydWU7XG5cblx0XHR0LmNvbnRyb2xzVGltZXIgPSBudWxsO1xuXG5cdFx0Ly8gZW5mb3JjZSBvYmplY3QsIGV2ZW4gd2l0aG91dCBcIm5ld1wiICh2aWEgSm9obiBSZXNpZylcblx0XHRpZiAoISh0IGluc3RhbmNlb2YgTWVkaWFFbGVtZW50UGxheWVyKSkge1xuXHRcdFx0cmV0dXJuIG5ldyBNZWRpYUVsZW1lbnRQbGF5ZXIobm9kZSwgbyk7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlc2Ugd2lsbCBiZSByZXNldCBhZnRlciB0aGUgTWVkaWFFbGVtZW50LnN1Y2Nlc3MgZmlyZXNcblx0XHR0LiRtZWRpYSA9IHQuJG5vZGUgPSAkKG5vZGUpO1xuXHRcdHQubm9kZSA9IHQubWVkaWEgPSB0LiRtZWRpYVswXTtcblxuXHRcdGlmICghdC5ub2RlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgZm9yIGV4aXN0aW5nIHBsYXllclxuXHRcdGlmICh0Lm5vZGUucGxheWVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0Lm5vZGUucGxheWVyO1xuXHRcdH1cblxuXG5cdFx0Ly8gdHJ5IHRvIGdldCBvcHRpb25zIGZyb20gZGF0YS1tZWpzb3B0aW9uc1xuXHRcdGlmIChvID09PSB1bmRlZmluZWQpIHtcblx0XHRcdG8gPSB0LiRub2RlLmRhdGEoJ21lanNvcHRpb25zJyk7XG5cdFx0fVxuXG5cdFx0Ly8gZXh0ZW5kIGRlZmF1bHQgb3B0aW9uc1xuXHRcdHQub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZywgbyk7XG5cblx0XHRpZiAoIXQub3B0aW9ucy50aW1lRm9ybWF0KSB7XG5cdFx0XHQvLyBHZW5lcmF0ZSB0aGUgdGltZSBmb3JtYXQgYWNjb3JkaW5nIHRvIG9wdGlvbnNcblx0XHRcdHQub3B0aW9ucy50aW1lRm9ybWF0ID0gJ21tOnNzJztcblx0XHRcdGlmICh0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSB7XG5cdFx0XHRcdHQub3B0aW9ucy50aW1lRm9ybWF0ID0gJ2hoOm1tOnNzJztcblx0XHRcdH1cblx0XHRcdGlmICh0Lm9wdGlvbnMuc2hvd1RpbWVjb2RlRnJhbWVDb3VudCkge1xuXHRcdFx0XHR0Lm9wdGlvbnMudGltZUZvcm1hdCArPSAnOmZmJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjYWxjdWxhdGVUaW1lRm9ybWF0KDAsIHQub3B0aW9ucywgdC5vcHRpb25zLmZyYW1lc1BlclNlY29uZCB8fCAyNSk7XG5cblx0XHQvLyB1bmlxdWUgSURcblx0XHR0LmlkID0gYG1lcF8ke21lanMubWVwSW5kZXgrK31gO1xuXG5cdFx0Ly8gYWRkIHRvIHBsYXllciBhcnJheSAoZm9yIGZvY3VzIGV2ZW50cylcblx0XHRtZWpzLnBsYXllcnNbdC5pZF0gPSB0O1xuXG5cdFx0Ly8gc3RhcnQgdXBcblx0XHRsZXRcblxuXHRcdFx0bWVPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdC5vcHRpb25zLCB7XG5cdFx0XHRcdHN1Y2Nlc3M6IChtZWRpYSwgZG9tTm9kZSkgPT4ge1xuXHRcdFx0XHRcdHQuX21lUmVhZHkobWVkaWEsIGRvbU5vZGUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogKGUpID0+IHtcblx0XHRcdFx0XHR0Ll9oYW5kbGVFcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSksXG5cdFx0XHR0YWdOYW1lID0gdC5tZWRpYS50YWdOYW1lLnRvTG93ZXJDYXNlKClcblx0XHRcdDtcblxuXHRcdC8vIGdldCB2aWRlbyBmcm9tIHNyYyBvciBocmVmP1xuXHRcdHQuaXNEeW5hbWljID0gKHRhZ05hbWUgIT09ICdhdWRpbycgJiYgdGFnTmFtZSAhPT0gJ3ZpZGVvJyk7XG5cdFx0dC5pc1ZpZGVvID0gKHQuaXNEeW5hbWljKSA/IHQub3B0aW9ucy5pc1ZpZGVvIDogKHRhZ05hbWUgIT09ICdhdWRpbycgJiYgdC5vcHRpb25zLmlzVmlkZW8pO1xuXG5cdFx0Ly8gdXNlIG5hdGl2ZSBjb250cm9scyBpbiBpUGFkLCBpUGhvbmUsIGFuZCBBbmRyb2lkXG5cdFx0aWYgKChJU19JUEFEICYmIHQub3B0aW9ucy5pUGFkVXNlTmF0aXZlQ29udHJvbHMpIHx8IChJU19JUEhPTkUgJiYgdC5vcHRpb25zLmlQaG9uZVVzZU5hdGl2ZUNvbnRyb2xzKSkge1xuXG5cdFx0XHQvLyBhZGQgY29udHJvbHMgYW5kIHN0b3Bcblx0XHRcdHQuJG1lZGlhLmF0dHIoJ2NvbnRyb2xzJywgJ2NvbnRyb2xzJyk7XG5cblx0XHRcdC8vIG92ZXJyaWRlIEFwcGxlJ3MgYXV0b3BsYXkgb3ZlcnJpZGUgZm9yIGlQYWRzXG5cdFx0XHRpZiAoSVNfSVBBRCAmJiB0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoSVNfQU5EUk9JRCAmJiB0Lm9wdGlvbnMuQW5kcm9pZFVzZU5hdGl2ZUNvbnRyb2xzKSB7XG5cblx0XHRcdC8vIGxlYXZlIGRlZmF1bHQgcGxheWVyXG5cblx0XHR9IGVsc2UgaWYgKHQuaXNWaWRlbyB8fCAoIXQuaXNWaWRlbyAmJiB0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoKSkge1xuXG5cdFx0XHQvLyBERVNLVE9QOiB1c2UgTWVkaWFFbGVtZW50UGxheWVyIGNvbnRyb2xzXG5cblx0XHRcdC8vIHJlbW92ZSBuYXRpdmUgY29udHJvbHNcblx0XHRcdHQuJG1lZGlhLnJlbW92ZUF0dHIoJ2NvbnRyb2xzJyk7XG5cdFx0XHRsZXQgdmlkZW9QbGF5ZXJUaXRsZSA9IHQuaXNWaWRlbyA/IGkxOG4udCgnbWVqcy52aWRlby1wbGF5ZXInKSA6IGkxOG4udCgnbWVqcy5hdWRpby1wbGF5ZXInKTtcblx0XHRcdC8vIGluc2VydCBkZXNjcmlwdGlvbiBmb3Igc2NyZWVuIHJlYWRlcnNcblx0XHRcdCQoYDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuXCI+JHt2aWRlb1BsYXllclRpdGxlfTwvc3Bhbj5gKS5pbnNlcnRCZWZvcmUodC4kbWVkaWEpO1xuXHRcdFx0Ly8gYnVpbGQgY29udGFpbmVyXG5cdFx0XHR0LmNvbnRhaW5lciA9XG5cdFx0XHRcdCQoYDxkaXYgaWQ9XCIke3QuaWR9XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlXCJgICtcblx0XHRcdFx0XHRgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImFwcGxpY2F0aW9uXCIgYXJpYS1sYWJlbD1cIiR7dmlkZW9QbGF5ZXJUaXRsZX1cIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlubmVyXCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tZWRpYWVsZW1lbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyc1wiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbHNcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNsZWFyXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFkZENsYXNzKHQuJG1lZGlhWzBdLmNsYXNzTmFtZSlcblx0XHRcdFx0Lmluc2VydEJlZm9yZSh0LiRtZWRpYSlcblx0XHRcdFx0LmZvY3VzKChlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCF0LmNvbnRyb2xzQXJlVmlzaWJsZSAmJiAhdC5oYXNGb2N1cyAmJiB0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHModHJ1ZSk7XG5cdFx0XHRcdFx0XHQvLyBJbiB2ZXJzaW9ucyBvbGRlciB0aGFuIElFMTEsIHRoZSBmb2N1cyBjYXVzZXMgdGhlIHBsYXliYXIgdG8gYmUgZGlzcGxheWVkXG5cdFx0XHRcdFx0XHQvLyBpZiB1c2VyIGNsaWNrcyBvbiB0aGUgUGxheS9QYXVzZSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyIG9uY2UgaXQgYXR0ZW1wdHNcblx0XHRcdFx0XHRcdC8vIHRvIGhpZGUgaXRcblx0XHRcdFx0XHRcdGlmICghSEFTX01TX05BVElWRV9GVUxMU0NSRUVOKSB7XG5cdFx0XHRcdFx0XHRcdC8vIElmIGUucmVsYXRlZFRhcmdldCBhcHBlYXJzIGJlZm9yZSBjb250YWluZXIsIHNlbmQgZm9jdXMgdG8gcGxheSBidXR0b24sXG5cdFx0XHRcdFx0XHRcdC8vIGVsc2Ugc2VuZCBmb2N1cyB0byBsYXN0IGNvbnRyb2wgYnV0dG9uLlxuXHRcdFx0XHRcdFx0XHRsZXQgYnRuU2VsZWN0b3IgPSBgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlwYXVzZS1idXR0b24gPiBidXR0b25gO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpc05vZGVBZnRlcihlLnJlbGF0ZWRUYXJnZXQsIHQuY29udGFpbmVyWzBdKSkge1xuXHRcdFx0XHRcdFx0XHRcdGJ0blNlbGVjdG9yID0gYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9scyAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uOmxhc3QtY2hpbGQgPiBidXR0b25gO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0bGV0IGJ1dHRvbiA9IHQuY29udGFpbmVyLmZpbmQoYnRuU2VsZWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRidXR0b24uZm9jdXMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBXaGVuIG5vIGVsZW1lbnRzIGluIGNvbnRyb2xzLCBoaWRlIGJhciBjb21wbGV0ZWx5XG5cdFx0XHRpZiAoIXQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGgpIHtcblx0XHRcdFx0dC5jb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kJywgJ3RyYW5zcGFyZW50Jylcblx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sc2ApXG5cdFx0XHRcdC5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0LmlzVmlkZW8gJiYgdC5vcHRpb25zLnN0cmV0Y2hpbmcgPT09ICdmaWxsJyAmJiAhdC5jb250YWluZXIucGFyZW50KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZmlsbC1jb250YWluZXJgKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gb3V0ZXIgY29udGFpbmVyXG5cdFx0XHRcdHQub3V0ZXJDb250YWluZXIgPSB0LiRtZWRpYS5wYXJlbnQoKTtcblx0XHRcdFx0dC5jb250YWluZXIud3JhcChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZpbGwtY29udGFpbmVyXCIvPmApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhZGQgY2xhc3NlcyBmb3IgdXNlciBhbmQgY29udGVudFxuXHRcdFx0dC5jb250YWluZXIuYWRkQ2xhc3MoXG5cdFx0XHRcdChJU19BTkRST0lEID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWFuZHJvaWQgYCA6ICcnKSArXG5cdFx0XHRcdChJU19JT1MgPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aW9zIGAgOiAnJykgK1xuXHRcdFx0XHQoSVNfSVBBRCA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1pcGFkIGAgOiAnJykgK1xuXHRcdFx0XHQoSVNfSVBIT05FID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlwaG9uZSBgIDogJycpICtcblx0XHRcdFx0KHQuaXNWaWRlbyA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12aWRlbyBgIDogYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWF1ZGlvIGApXG5cdFx0XHQpO1xuXG5cblx0XHRcdC8vIG1vdmUgdGhlIDx2aWRlby92aWRlbz4gdGFnIGludG8gdGhlIHJpZ2h0IHNwb3Rcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tZWRpYWVsZW1lbnRgKS5hcHBlbmQodC4kbWVkaWEpO1xuXG5cdFx0XHQvLyBuZWVkcyB0byBiZSBhc3NpZ25lZCBoZXJlLCBhZnRlciBpT1MgcmVtYXBcblx0XHRcdHQubm9kZS5wbGF5ZXIgPSB0O1xuXG5cdFx0XHQvLyBmaW5kIHBhcnRzXG5cdFx0XHR0LmNvbnRyb2xzID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xzYCk7XG5cdFx0XHR0LmxheWVycyA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcnNgKTtcblxuXHRcdFx0Ly8gZGV0ZXJtaW5lIHRoZSBzaXplXG5cblx0XHRcdC8qIHNpemUgcHJpb3JpdHk6XG5cdFx0XHQgKDEpIHZpZGVvV2lkdGggKGZvcmNlZCksXG5cdFx0XHQgKDIpIHN0eWxlPVwid2lkdGg7aGVpZ2h0O1wiXG5cdFx0XHQgKDMpIHdpZHRoIGF0dHJpYnV0ZSxcblx0XHRcdCAoNCkgZGVmYXVsdFZpZGVvV2lkdGggKGZvciB1bnNwZWNpZmllZCBjYXNlcylcblx0XHRcdCAqL1xuXG5cdFx0XHRsZXRcblx0XHRcdFx0dGFnVHlwZSA9ICh0LmlzVmlkZW8gPyAndmlkZW8nIDogJ2F1ZGlvJyksXG5cdFx0XHRcdGNhcHNUYWdOYW1lID0gdGFnVHlwZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIHRhZ1R5cGUuc3Vic3RyaW5nKDEpXG5cdFx0XHRcdDtcblxuXG5cdFx0XHRpZiAodC5vcHRpb25zW3RhZ1R5cGUgKyAnV2lkdGgnXSA+IDAgfHwgdC5vcHRpb25zW3RhZ1R5cGUgKyAnV2lkdGgnXS50b1N0cmluZygpLmluZGV4T2YoJyUnKSA+IC0xKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm9wdGlvbnNbdGFnVHlwZSArICdXaWR0aCddO1xuXHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLnN0eWxlLndpZHRoICE9PSAnJyAmJiB0Lm1lZGlhLnN0eWxlLndpZHRoICE9PSBudWxsKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm1lZGlhLnN0eWxlLndpZHRoO1xuXHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSkge1xuXHRcdFx0XHR0LndpZHRoID0gdC4kbWVkaWEuYXR0cignd2lkdGgnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm9wdGlvbnNbJ2RlZmF1bHQnICsgY2Fwc1RhZ05hbWUgKyAnV2lkdGgnXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQub3B0aW9uc1t0YWdUeXBlICsgJ0hlaWdodCddID4gMCB8fCB0Lm9wdGlvbnNbdGFnVHlwZSArICdIZWlnaHQnXS50b1N0cmluZygpLmluZGV4T2YoJyUnKSA+IC0xKSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC5vcHRpb25zW3RhZ1R5cGUgKyAnSGVpZ2h0J107XG5cdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuc3R5bGUuaGVpZ2h0ICE9PSAnJyAmJiB0Lm1lZGlhLnN0eWxlLmhlaWdodCAhPT0gbnVsbCkge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQubWVkaWEuc3R5bGUuaGVpZ2h0O1xuXHRcdFx0fSBlbHNlIGlmICh0LiRtZWRpYVswXS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC4kbWVkaWEuYXR0cignaGVpZ2h0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQub3B0aW9uc1snZGVmYXVsdCcgKyBjYXBzVGFnTmFtZSArICdIZWlnaHQnXTtcblx0XHRcdH1cblxuXHRcdFx0dC5pbml0aWFsQXNwZWN0UmF0aW8gPSAodC5oZWlnaHQgPj0gdC53aWR0aCkgPyB0LndpZHRoIC8gdC5oZWlnaHQgOiB0LmhlaWdodCAvIHQud2lkdGg7XG5cblx0XHRcdC8vIHNldCB0aGUgc2l6ZSwgd2hpbGUgd2Ugd2FpdCBmb3IgdGhlIHBsdWdpbnMgdG8gbG9hZCBiZWxvd1xuXHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblxuXHRcdFx0Ly8gY3JlYXRlIE1lZGlhRWxlbWVudFNoaW1cblx0XHRcdG1lT3B0aW9ucy5wbHVnaW5XaWR0aCA9IHQud2lkdGg7XG5cdFx0XHRtZU9wdGlvbnMucGx1Z2luSGVpZ2h0ID0gdC5oZWlnaHQ7XG5cdFx0fVxuXHRcdC8vIEhpZGUgbWVkaWEgY29tcGxldGVseSBmb3IgYXVkaW8gdGhhdCBkb2Vzbid0IGhhdmUgYW55IGZlYXR1cmVzXG5cdFx0ZWxzZSBpZiAoIXQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkge1xuXHRcdFx0dC4kbWVkaWEuaGlkZSgpO1xuXHRcdH1cblxuXHRcdC8vIGNyZWF0ZSBNZWRpYUVsZW1lbnQgc2hpbVxuXHRcdG5ldyBNZWRpYUVsZW1lbnQodC4kbWVkaWFbMF0sIG1lT3B0aW9ucyk7XG5cblx0XHRpZiAodC5jb250YWluZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoICYmIHQuY29udHJvbHNBcmVWaXNpYmxlICYmICF0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQpIHtcblx0XHRcdC8vIGNvbnRyb2xzIGFyZSBzaG93biB3aGVuIGxvYWRlZFxuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNzaG93bicpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0O1xuXHR9XG5cblx0c2hvd0NvbnRyb2xzIChkb0FuaW1hdGlvbikge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGRvQW5pbWF0aW9uID0gZG9BbmltYXRpb24gPT09IHVuZGVmaW5lZCB8fCBkb0FuaW1hdGlvbjtcblxuXHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChkb0FuaW1hdGlvbikge1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZUluKDIwMCwgKCkgPT4ge1xuXHRcdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzc2hvd24nKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBhbnkgYWRkaXRpb25hbCBjb250cm9scyBwZW9wbGUgbWlnaHQgYWRkIGFuZCB3YW50IHRvIGhpZGVcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpLmZhZGVJbigyMDAsICgpID0+IHtcblx0XHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHQvLyBhbnkgYWRkaXRpb25hbCBjb250cm9scyBwZW9wbGUgbWlnaHQgYWRkIGFuZCB3YW50IHRvIGhpZGVcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNzaG93bicpO1xuXHRcdH1cblxuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cblx0fVxuXG5cdGhpZGVDb250cm9scyAoZG9BbmltYXRpb24pIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRkb0FuaW1hdGlvbiA9IGRvQW5pbWF0aW9uID09PSB1bmRlZmluZWQgfHwgZG9BbmltYXRpb247XG5cblx0XHRpZiAoIXQuY29udHJvbHNBcmVWaXNpYmxlIHx8IHQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMgfHwgdC5rZXlib2FyZEFjdGlvbiB8fFxuXHRcdFx0KHQubWVkaWEucGF1c2VkICYmIHQubWVkaWEucmVhZHlTdGF0ZSA9PT0gNCAmJiAoKCF0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQgJiZcblx0XHRcdHQubWVkaWEuY3VycmVudFRpbWUgPD0gMCkgfHwgdC5tZWRpYS5jdXJyZW50VGltZSA+IDApKSB8fFxuXHRcdFx0KHQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmhpZGVWaWRlb0NvbnRyb2xzT25Mb2FkICYmICF0Lm1lZGlhLnJlYWR5U3RhdGUpIHx8XG5cdFx0XHR0Lm1lZGlhLmVuZGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGRvQW5pbWF0aW9uKSB7XG5cdFx0XHQvLyBmYWRlIG91dCBtYWluIGNvbnRyb2xzXG5cdFx0XHR0LmNvbnRyb2xzLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dCgyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc2hpZGRlbicpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGFueSBhZGRpdGlvbmFsIGNvbnRyb2xzIHBlb3BsZSBtaWdodCBhZGQgYW5kIHdhbnQgdG8gaGlkZVxuXHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xgKS5zdG9wKHRydWUsIHRydWUpLmZhZGVPdXQoMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBoaWRlIG1haW4gY29udHJvbHNcblx0XHRcdHQuY29udHJvbHNcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdC8vIGhpZGUgb3RoZXJzXG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbGApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNoaWRkZW4nKTtcblx0XHR9XG5cdH1cblxuXHRzdGFydENvbnRyb2xzVGltZXIgKHRpbWVvdXQpIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHRpbWVvdXQgPSB0eXBlb2YgdGltZW91dCAhPT0gJ3VuZGVmaW5lZCcgPyB0aW1lb3V0IDogdC5vcHRpb25zLmNvbnRyb2xzVGltZW91dERlZmF1bHQ7XG5cblx0XHR0LmtpbGxDb250cm9sc1RpbWVyKCdzdGFydCcpO1xuXG5cdFx0dC5jb250cm9sc1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0LmhpZGVDb250cm9scygpO1xuXHRcdFx0dC5raWxsQ29udHJvbHNUaW1lcignaGlkZScpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHR9XG5cblx0a2lsbENvbnRyb2xzVGltZXIgKCkge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKHQuY29udHJvbHNUaW1lciAhPT0gbnVsbCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHQuY29udHJvbHNUaW1lcik7XG5cdFx0XHRkZWxldGUgdC5jb250cm9sc1RpbWVyO1xuXHRcdFx0dC5jb250cm9sc1RpbWVyID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRkaXNhYmxlQ29udHJvbHMgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQua2lsbENvbnRyb2xzVGltZXIoKTtcblx0XHR0LmhpZGVDb250cm9scyhmYWxzZSk7XG5cdFx0dGhpcy5jb250cm9sc0VuYWJsZWQgPSBmYWxzZTtcblx0fVxuXG5cdGVuYWJsZUNvbnRyb2xzICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LnNob3dDb250cm9scyhmYWxzZSk7XG5cblx0XHR0LmNvbnRyb2xzRW5hYmxlZCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHVwIGFsbCBjb250cm9scyBhbmQgZXZlbnRzXG5cdCAqXG5cdCAqIEBwYXJhbSBtZWRpYVxuXHQgKiBAcGFyYW0gZG9tTm9kZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X21lUmVhZHkgKG1lZGlhLCBkb21Ob2RlKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0YXV0b3BsYXlBdHRyID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JyksXG5cdFx0XHRhdXRvcGxheSA9ICEoYXV0b3BsYXlBdHRyID09PSB1bmRlZmluZWQgfHwgYXV0b3BsYXlBdHRyID09PSBudWxsIHx8IGF1dG9wbGF5QXR0ciA9PT0gJ2ZhbHNlJyksXG5cdFx0XHRpc05hdGl2ZSA9IG1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiBtZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGxcblx0XHRcdDtcblxuXHRcdC8vIG1ha2Ugc3VyZSBpdCBjYW4ndCBjcmVhdGUgaXRzZWxmIGFnYWluIGlmIGEgcGx1Z2luIHJlbG9hZHNcblx0XHRpZiAodC5jcmVhdGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dC5jcmVhdGVkID0gdHJ1ZTtcblx0XHR0Lm1lZGlhID0gbWVkaWE7XG5cdFx0dC5kb21Ob2RlID0gZG9tTm9kZTtcblxuXHRcdGlmICghKElTX0FORFJPSUQgJiYgdC5vcHRpb25zLkFuZHJvaWRVc2VOYXRpdmVDb250cm9scykgJiYgIShJU19JUEFEICYmIHQub3B0aW9ucy5pUGFkVXNlTmF0aXZlQ29udHJvbHMpICYmICEoSVNfSVBIT05FICYmIHQub3B0aW9ucy5pUGhvbmVVc2VOYXRpdmVDb250cm9scykpIHtcblxuXHRcdFx0Ly8gSW4gdGhlIGV2ZW50IHRoYXQgbm8gZmVhdHVyZXMgYXJlIHNwZWNpZmllZCBmb3IgYXVkaW8sXG5cdFx0XHQvLyBjcmVhdGUgb25seSBNZWRpYUVsZW1lbnQgaW5zdGFuY2UgcmF0aGVyIHRoYW5cblx0XHRcdC8vIGRvaW5nIGFsbCB0aGUgd29yayB0byBjcmVhdGUgYSBmdWxsIHBsYXllclxuXHRcdFx0aWYgKCF0LmlzVmlkZW8gJiYgIXQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGgpIHtcblxuXHRcdFx0XHQvLyBmb3JjZSBhdXRvcGxheSBmb3IgSFRNTDVcblx0XHRcdFx0aWYgKGF1dG9wbGF5ICYmIGlzTmF0aXZlKSB7XG5cdFx0XHRcdFx0dC5wbGF5KCk7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuc3VjY2Vzcykge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB0Lm9wdGlvbnMuc3VjY2VzcyA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdHdpbmRvd1t0Lm9wdGlvbnMuc3VjY2Vzc10odC5tZWRpYSwgdC5kb21Ob2RlLCB0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dC5vcHRpb25zLnN1Y2Nlc3ModC5tZWRpYSwgdC5kb21Ob2RlLCB0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIHR3byBidWlsdCBpbiBmZWF0dXJlc1xuXHRcdFx0dC5idWlsZHBvc3Rlcih0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdFx0XHR0LmJ1aWxka2V5Ym9hcmQodCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXHRcdFx0dC5idWlsZG92ZXJsYXlzKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblxuXHRcdFx0Ly8gZ3JhYiBmb3IgdXNlIGJ5IGZlYXR1cmVzXG5cdFx0XHR0LmZpbmRUcmFja3MoKTtcblxuXHRcdFx0Ly8gYWRkIHVzZXItZGVmaW5lZCBmZWF0dXJlcy9jb250cm9sc1xuXHRcdFx0Zm9yIChsZXQgZmVhdHVyZUluZGV4IGluIHQub3B0aW9ucy5mZWF0dXJlcykge1xuXHRcdFx0XHRsZXQgZmVhdHVyZSA9IHQub3B0aW9ucy5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuXHRcdFx0XHRpZiAodFtgYnVpbGQke2ZlYXR1cmV9YF0pIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dFtgYnVpbGQke2ZlYXR1cmV9YF0odCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdC8vIFRPRE86IHJlcG9ydCBjb250cm9sIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBlcnJvciBidWlsZGluZyAke2ZlYXR1cmV9YCwgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzcmVhZHknKTtcblxuXHRcdFx0Ly8gcmVzZXQgYWxsIGxheWVycyBhbmQgY29udHJvbHNcblx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXG5cdFx0XHQvLyBjb250cm9scyBmYWRlXG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cblx0XHRcdFx0aWYgKEhBU19UT1VDSCAmJiAhdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXG5cdFx0XHRcdFx0Ly8gZm9yIHRvdWNoIGRldmljZXMgKGlPUywgQW5kcm9pZClcblx0XHRcdFx0XHQvLyBzaG93L2hpZGUgd2l0aG91dCBhbmltYXRpb24gb24gdG91Y2hcblxuXHRcdFx0XHRcdHQuJG1lZGlhLm9uKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuXG5cdFx0XHRcdFx0XHQvLyB0b2dnbGUgY29udHJvbHNcblx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHR0LmhpZGVDb250cm9scyhmYWxzZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAodC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnNob3dDb250cm9scyhmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gY3JlYXRlIGNhbGxiYWNrIGhlcmUgc2luY2UgaXQgbmVlZHMgYWNjZXNzIHRvIGN1cnJlbnRcblx0XHRcdFx0XHQvLyBNZWRpYUVsZW1lbnQgb2JqZWN0XG5cdFx0XHRcdFx0dC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2sgPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRcdGlmICh0Lm9wdGlvbnMuY2xpY2tUb1BsYXlQYXVzZSkge1xuXHRcdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0XHRidXR0b24gPSB0LiRtZWRpYS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYClcblx0XHRcdFx0XHRcdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktYnV0dG9uYCksXG5cdFx0XHRcdFx0XHRcdFx0cHJlc3NlZCA9IGJ1dHRvbi5hdHRyKCdhcmlhLXByZXNzZWQnKVxuXHRcdFx0XHRcdFx0XHRcdDtcblx0XHRcdFx0XHRcdFx0aWYgKHQubWVkaWEucGF1c2VkICYmIHByZXNzZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0LnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRidXR0b24uYXR0cignYXJpYS1wcmVzc2VkJywgIXByZXNzZWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHQvLyBjbGljayB0byBwbGF5L3BhdXNlXG5cdFx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrLCBmYWxzZSk7XG5cblx0XHRcdFx0XHQvLyBzaG93L2hpZGUgY29udHJvbHNcblx0XHRcdFx0XHR0LmNvbnRhaW5lclxuXHRcdFx0XHRcdC5vbignbW91c2VlbnRlcicsICgpID0+IHtcblx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR0LmtpbGxDb250cm9sc1RpbWVyKCdlbnRlcicpO1xuXHRcdFx0XHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0XHRcdFx0dC5zdGFydENvbnRyb2xzVGltZXIodC5vcHRpb25zLmNvbnRyb2xzVGltZW91dE1vdXNlRW50ZXIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub24oJ21vdXNlbW92ZScsICgpID0+IHtcblx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnN0YXJ0Q29udHJvbHNUaW1lcih0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0TW91c2VFbnRlcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcblx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXQubWVkaWEucGF1c2VkICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5zdGFydENvbnRyb2xzVGltZXIodC5vcHRpb25zLmNvbnRyb2xzVGltZW91dE1vdXNlTGVhdmUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5vcHRpb25zLmhpZGVWaWRlb0NvbnRyb2xzT25Mb2FkKSB7XG5cdFx0XHRcdFx0dC5oaWRlQ29udHJvbHMoZmFsc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY2hlY2sgZm9yIGF1dG9wbGF5XG5cdFx0XHRcdGlmIChhdXRvcGxheSAmJiAhdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZXNpemVyXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuZW5hYmxlQXV0b3NpemUpIHtcblx0XHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdC8vIGlmIHRoZSA8dmlkZW8gaGVpZ2h0PiB3YXMgbm90IHNldCBhbmQgdGhlIG9wdGlvbnMudmlkZW9IZWlnaHQgd2FzIG5vdCBzZXRcblx0XHRcdFx0XHRcdC8vIHRoZW4gcmVzaXplIHRvIHRoZSByZWFsIGRpbWVuc2lvbnNcblx0XHRcdFx0XHRcdGlmICh0Lm9wdGlvbnMudmlkZW9IZWlnaHQgPD0gMCAmJiAhdC5kb21Ob2RlLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykgJiYgIWlzTmFOKGUudGFyZ2V0LnZpZGVvSGVpZ2h0KSkge1xuXHRcdFx0XHRcdFx0XHR0LnNldFBsYXllclNpemUoZS50YXJnZXQudmlkZW9XaWR0aCwgZS50YXJnZXQudmlkZW9IZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0XHRcdFx0XHR0Lm1lZGlhLnNldFNpemUoZS50YXJnZXQudmlkZW9XaWR0aCwgZS50YXJnZXQudmlkZW9IZWlnaHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBFVkVOVFNcblxuXHRcdFx0Ly8gRk9DVVM6IHdoZW4gYSB2aWRlbyBzdGFydHMgcGxheWluZywgaXQgdGFrZXMgZm9jdXMgZnJvbSBvdGhlciBwbGF5ZXJzIChwb3NzaWJseSBwYXVzaW5nIHRoZW0pXG5cdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRcdHQuaGFzRm9jdXMgPSB0cnVlO1xuXG5cdFx0XHRcdC8vIGdvIHRocm91Z2ggYWxsIG90aGVyIHBsYXllcnNcblx0XHRcdFx0Zm9yIChsZXQgcGxheWVySW5kZXggaW4gbWVqcy5wbGF5ZXJzKSB7XG5cdFx0XHRcdFx0bGV0IHAgPSBtZWpzLnBsYXllcnNbcGxheWVySW5kZXhdO1xuXHRcdFx0XHRcdGlmIChwLmlkICE9PSB0LmlkICYmIHQub3B0aW9ucy5wYXVzZU90aGVyUGxheWVycyAmJiAhcC5wYXVzZWQgJiYgIXAuZW5kZWQpIHtcblx0XHRcdFx0XHRcdHAucGF1c2UoKTtcblx0XHRcdFx0XHRcdHAuaGFzRm9jdXMgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHQvLyBlbmRlZCBmb3IgYWxsXG5cdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAodC5vcHRpb25zLmF1dG9SZXdpbmQpIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0dC5tZWRpYS5zZXRDdXJyZW50VGltZSgwKTtcblx0XHRcdFx0XHRcdC8vIEZpeGluZyBhbiBBbmRyb2lkIHN0b2NrIGJyb3dzZXIgYnVnLCB3aGVyZSBcInNlZWtlZFwiIGlzbid0IGZpcmVkIGNvcnJlY3RseSBhZnRlciBlbmRpbmcgdGhlIHZpZGVvIGFuZCBqdW1waW5nIHRvIHRoZSBiZWdpbm5pbmdcblx0XHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0JCh0LmNvbnRhaW5lcilcblx0XHRcdFx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWxvYWRpbmdgKVxuXHRcdFx0XHRcdFx0XHQucGFyZW50KCkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fSwgMjApO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4cCkge1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0Lm1lZGlhLnN0b3AgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0Lm1lZGlhLnN0b3AoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0Lm1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5zZXRQcm9ncmVzc1JhaWwpIHtcblx0XHRcdFx0XHR0LnNldFByb2dyZXNzUmFpbCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0LnNldEN1cnJlbnRSYWlsKSB7XG5cdFx0XHRcdFx0dC5zZXRDdXJyZW50UmFpbCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5sb29wKSB7XG5cdFx0XHRcdFx0dC5wbGF5KCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMgJiYgdC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHR0LnNob3dDb250cm9scygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdC8vIHJlc2l6ZSBvbiB0aGUgZmlyc3QgcGxheVxuXHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblxuXHRcdFx0XHRjYWxjdWxhdGVUaW1lRm9ybWF0KHQuZHVyYXRpb24sIHQub3B0aW9ucywgdC5vcHRpb25zLmZyYW1lc1BlclNlY29uZCB8fCAyNSk7XG5cblx0XHRcdFx0aWYgKHQudXBkYXRlRHVyYXRpb24pIHtcblx0XHRcdFx0XHR0LnVwZGF0ZUR1cmF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHQudXBkYXRlQ3VycmVudCkge1xuXHRcdFx0XHRcdHQudXBkYXRlQ3VycmVudCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCF0LmlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHQvLyBPbmx5IGNoYW5nZSB0aGUgdGltZSBmb3JtYXQgd2hlbiBuZWNlc3Nhcnlcblx0XHRcdGxldCBkdXJhdGlvbiA9IG51bGw7XG5cdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdGlmIChkdXJhdGlvbiAhPT0gdGhpcy5kdXJhdGlvbikge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblx0XHRcdFx0XHRjYWxjdWxhdGVUaW1lRm9ybWF0KGR1cmF0aW9uLCB0Lm9wdGlvbnMsIHQub3B0aW9ucy5mcmFtZXNQZXJTZWNvbmQgfHwgMjUpO1xuXG5cdFx0XHRcdFx0Ly8gbWFrZSBzdXJlIHRvIGZpbGwgaW4gYW5kIHJlc2l6ZSB0aGUgY29udHJvbHMgKGUuZy4sIDAwOjAwID0+IDAxOjEzOjE1XG5cdFx0XHRcdFx0aWYgKHQudXBkYXRlRHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdHQudXBkYXRlRHVyYXRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHQudXBkYXRlQ3VycmVudCkge1xuXHRcdFx0XHRcdFx0dC51cGRhdGVDdXJyZW50KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHR0LmNvbnRhaW5lci5mb2N1c291dCgoZSkgPT4ge1xuXHRcdFx0XHRpZiAoZS5yZWxhdGVkVGFyZ2V0KSB7IC8vRkYgaXMgd29ya2luZyBvbiBzdXBwb3J0aW5nIGZvY3Vzb3V0IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY4Nzc4N1xuXHRcdFx0XHRcdGxldCAkdGFyZ2V0ID0gJChlLnJlbGF0ZWRUYXJnZXQpO1xuXHRcdFx0XHRcdGlmICh0LmtleWJvYXJkQWN0aW9uICYmICR0YXJnZXQucGFyZW50cyhgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0dC5rZXlib2FyZEFjdGlvbiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0aWYgKHQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHR0LmhpZGVDb250cm9scyh0cnVlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHdlYmtpdCBoYXMgdHJvdWJsZSBkb2luZyB0aGlzIHdpdGhvdXQgYSBkZWxheVxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHR9LCA1MCk7XG5cblx0XHRcdC8vIGFkanVzdCBjb250cm9scyB3aGVuZXZlciB3aW5kb3cgc2l6ZXMgKHVzZWQgdG8gYmUgaW4gZnVsbHNjcmVlbiBvbmx5KVxuXHRcdFx0dC5nbG9iYWxCaW5kKCdyZXNpemUnLCAoKSA9PiB7XG5cblx0XHRcdFx0Ly8gZG9uJ3QgcmVzaXplIGZvciBmdWxsc2NyZWVuIG1vZGVcblx0XHRcdFx0aWYgKCEodC5pc0Z1bGxTY3JlZW4gfHwgKEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIGRvY3VtZW50LndlYmtpdElzRnVsbFNjcmVlbikpKSB7XG5cdFx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGFsd2F5cyBhZGp1c3QgY29udHJvbHNcblx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBEaXNhYmxlIGZvY3VzIG91dGxpbmUgdG8gaW1wcm92ZSBsb29rLWFuZC1mZWVsIGZvciByZWd1bGFyIHVzZXJzXG5cdFx0XHR0Lmdsb2JhbEJpbmQoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0aWYgKCQoZS50YXJnZXQpLmlzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkpIHtcblx0XHRcdFx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlYCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApLmxlbmd0aCkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKVxuXHRcdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBFbmFibGUgZm9jdXMgb3V0bGluZSBmb3IgQWNjZXNzaWJpbGl0eSBwdXJwb3Nlc1xuXHRcdFx0dC5nbG9iYWxCaW5kKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdFx0aWYgKCQoZS50YXJnZXQpLmlzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkpIHtcblx0XHRcdFx0XHQkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlYCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApLmxlbmd0aCkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBUaGlzIGlzIGEgd29yay1hcm91bmQgZm9yIGEgYnVnIGluIHRoZSBZb3VUdWJlIGlGcmFtZSBwbGF5ZXIsIHdoaWNoIG1lYW5zXG5cdFx0XHQvL1x0d2UgY2FuJ3QgdXNlIHRoZSBwbGF5KCkgQVBJIGZvciB0aGUgaW5pdGlhbCBwbGF5YmFjayBvbiBpT1Mgb3IgQW5kcm9pZDtcblx0XHRcdC8vXHR1c2VyIGhhcyB0byBzdGFydCBwbGF5YmFjayBkaXJlY3RseSBieSB0YXBwaW5nIG9uIHRoZSBpRnJhbWUuXG5cdFx0XHRpZiAodC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goL3lvdXR1YmUvKSAmJiAoSVNfSU9TIHx8IElTX0FORFJPSUQpKSB7XG5cdFx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LXBsYXlgKS5oaWRlKCk7XG5cdFx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXJgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gZm9yY2UgYXV0b3BsYXkgZm9yIEhUTUw1XG5cdFx0aWYgKGF1dG9wbGF5ICYmIGlzTmF0aXZlKSB7XG5cdFx0XHR0LnBsYXkoKTtcblx0XHR9XG5cblx0XHRpZiAodC5vcHRpb25zLnN1Y2Nlc3MpIHtcblxuXHRcdFx0aWYgKHR5cGVvZiB0Lm9wdGlvbnMuc3VjY2VzcyA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0d2luZG93W3Qub3B0aW9ucy5zdWNjZXNzXSh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC5vcHRpb25zLnN1Y2Nlc3ModC5tZWRpYSwgdC5kb21Ob2RlLCB0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X2hhbmRsZUVycm9yIChlKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKHQuY29udHJvbHMpIHtcblx0XHRcdHQuZGlzYWJsZUNvbnRyb2xzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGVsbCB1c2VyIHRoYXQgdGhlIGZpbGUgY2Fubm90IGJlIHBsYXllZFxuXHRcdGlmICh0Lm9wdGlvbnMuZXJyb3IpIHtcblx0XHRcdHQub3B0aW9ucy5lcnJvcihlKTtcblx0XHR9XG5cdH1cblxuXHRzZXRQbGF5ZXJTaXplICh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKCF0Lm9wdGlvbnMuc2V0RGltZW5zaW9ucykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2Ygd2lkdGggIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0LndpZHRoID0gd2lkdGg7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0LmhlaWdodCA9IGhlaWdodDtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIEZCICE9PSAndW5kZWZpbmVkJyAmJiB0LmlzVmlkZW8pIHtcblx0XHRcdEZCLkV2ZW50LnN1YnNjcmliZSgneGZibWwucmVhZHknLCAoKSA9PiB7XG5cdFx0XHRcdGxldCB0YXJnZXQgPSAkKHQubWVkaWEpLmNoaWxkcmVuKCcuZmItdmlkZW8nKTtcblxuXHRcdFx0XHR0LndpZHRoID0gdGFyZ2V0LndpZHRoKCk7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdGFyZ2V0LmhlaWdodCgpO1xuXHRcdFx0XHR0LnNldERpbWVuc2lvbnModC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0bGV0IHRhcmdldCA9ICQodC5tZWRpYSkuY2hpbGRyZW4oJy5mYi12aWRlbycpO1xuXG5cdFx0XHRpZiAodGFyZ2V0Lmxlbmd0aCkge1xuXHRcdFx0XHR0LndpZHRoID0gdGFyZ2V0LndpZHRoKCk7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdGFyZ2V0LmhlaWdodCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGNoZWNrIHN0cmV0Y2hpbmcgbW9kZXNcblx0XHRzd2l0Y2ggKHQub3B0aW9ucy5zdHJldGNoaW5nKSB7XG5cdFx0XHRjYXNlICdmaWxsJzpcblx0XHRcdFx0Ly8gVGhlICdmaWxsJyBlZmZlY3Qgb25seSBtYWtlcyBzZW5zZSBvbiB2aWRlbzsgZm9yIGF1ZGlvIHdlIHdpbGwgc2V0IHRoZSBkaW1lbnNpb25zXG5cdFx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdFx0XHR0LnNldEZpbGxNb2RlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3Jlc3BvbnNpdmUnOlxuXHRcdFx0XHR0LnNldFJlc3BvbnNpdmVNb2RlKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbm9uZSc6XG5cdFx0XHRcdHQuc2V0RGltZW5zaW9ucyh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2F1dG8nIG1vZGVcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICh0Lmhhc0ZsdWlkTW9kZSgpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0dC5zZXRSZXNwb25zaXZlTW9kZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQuc2V0RGltZW5zaW9ucyh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0aGFzRmx1aWRNb2RlICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBkZXRlY3QgMTAwJSBtb2RlIC0gdXNlIGN1cnJlbnRTdHlsZSBmb3IgSUUgc2luY2UgY3NzKCkgZG9lc24ndCByZXR1cm4gcGVyY2VudGFnZXNcblx0XHRyZXR1cm4gKHQuaGVpZ2h0LnRvU3RyaW5nKCkuaW5jbHVkZXMoJyUnKSB8fCAodC4kbm9kZS5jc3MoJ21heC13aWR0aCcpICE9PSAnbm9uZScgJiYgdC4kbm9kZS5jc3MoJ21heC13aWR0aCcpICE9PSB0LndpZHRoKSB8fCAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUgJiYgdC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4V2lkdGggPT09ICcxMDAlJykpO1xuXHR9XG5cblx0c2V0UmVzcG9uc2l2ZU1vZGUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIGRvIHdlIGhhdmUgdGhlIG5hdGl2ZSBkaW1lbnNpb25zIHlldD9cblx0XHRsZXQgbmF0aXZlV2lkdGggPSAoKCkgPT4ge1xuXHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0XHRpZiAodC5tZWRpYS52aWRlb1dpZHRoICYmIHQubWVkaWEudmlkZW9XaWR0aCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0Lm9wdGlvbnMuZGVmYXVsdFZpZGVvV2lkdGg7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0Lm9wdGlvbnMuZGVmYXVsdEF1ZGlvV2lkdGg7XG5cdFx0XHR9XG5cdFx0fSkoKTtcblxuXHRcdGxldCBuYXRpdmVIZWlnaHQgPSAoKCkgPT4ge1xuXHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0XHRpZiAodC5tZWRpYS52aWRlb0hlaWdodCAmJiB0Lm1lZGlhLnZpZGVvSGVpZ2h0ID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0Lm1lZGlhLnZpZGVvSGVpZ2h0O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSkge1xuXHRcdFx0XHRcdHJldHVybiB0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0VmlkZW9IZWlnaHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0Lm9wdGlvbnMuZGVmYXVsdEF1ZGlvSGVpZ2h0O1xuXHRcdFx0fVxuXHRcdH0pKCk7XG5cblx0XHQvLyBVc2UgbWVkaWEgYXNwZWN0IHJhdGlvIGlmIHJlY2VpdmVkOyBvdGhlcndpc2UsIHRoZSBpbml0aWFsbHkgc3RvcmVkIGluaXRpYWwgYXNwZWN0IHJhdGlvXG5cdFx0bGV0XG5cdFx0XHRhc3BlY3RSYXRpbyA9ICgoKSA9PiB7XG5cdFx0XHRcdGxldCByYXRpbyA9IDE7XG5cdFx0XHRcdGlmICghdC5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJhdGlvO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHQubWVkaWEudmlkZW9XaWR0aCAmJiB0Lm1lZGlhLnZpZGVvV2lkdGggPiAwICYmIHQubWVkaWEudmlkZW9IZWlnaHQgJiYgdC5tZWRpYS52aWRlb0hlaWdodCA+IDApIHtcblx0XHRcdFx0XHRyYXRpbyA9ICh0LmhlaWdodCA+PSB0LndpZHRoKSA/IHQubWVkaWEudmlkZW9XaWR0aCAvIHQubWVkaWEudmlkZW9IZWlnaHQgOiB0Lm1lZGlhLnZpZGVvSGVpZ2h0IC8gdC5tZWRpYS52aWRlb1dpZHRoO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJhdGlvID0gdC5pbml0aWFsQXNwZWN0UmF0aW87XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNOYU4ocmF0aW8pIHx8IHJhdGlvIDwgMC4wMSB8fCByYXRpbyA+IDEwMCkge1xuXHRcdFx0XHRcdHJhdGlvID0gMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByYXRpbztcblx0XHRcdH0pKCksXG5cdFx0XHRwYXJlbnRXaWR0aCA9IHQuY29udGFpbmVyLnBhcmVudCgpLmNsb3Nlc3QoJzp2aXNpYmxlJykud2lkdGgoKSxcblx0XHRcdHBhcmVudEhlaWdodCA9IHQuY29udGFpbmVyLnBhcmVudCgpLmNsb3Nlc3QoJzp2aXNpYmxlJykuaGVpZ2h0KCksXG5cdFx0XHRuZXdIZWlnaHQ7XG5cblx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHQvLyBSZXNwb25zaXZlIHZpZGVvIGlzIGJhc2VkIG9uIHdpZHRoOiAxMDAlIGFuZCBoZWlnaHQ6IDEwMCVcblx0XHRcdGlmICh0LmhlaWdodCA9PT0gJzEwMCUnKSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IHBhcnNlSW50KHBhcmVudFdpZHRoICogbmF0aXZlSGVpZ2h0IC8gbmF0aXZlV2lkdGgsIDEwKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld0hlaWdodCA9IHQuaGVpZ2h0ID49IHQud2lkdGggPyBwYXJzZUludChwYXJlbnRXaWR0aCAvIGFzcGVjdFJhdGlvLCAxMCkgOiBwYXJzZUludChwYXJlbnRXaWR0aCAqIGFzcGVjdFJhdGlvLCAxMCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5ld0hlaWdodCA9IG5hdGl2ZUhlaWdodDtcblx0XHR9XG5cblx0XHQvLyBJZiB3ZSB3ZXJlIHVuYWJsZSB0byBjb21wdXRlIG5ld0hlaWdodCwgZ2V0IHRoZSBjb250YWluZXIgaGVpZ2h0IGluc3RlYWRcblx0XHRpZiAoaXNOYU4obmV3SGVpZ2h0KSkge1xuXHRcdFx0bmV3SGVpZ2h0ID0gcGFyZW50SGVpZ2h0O1xuXHRcdH1cblxuXHRcdGlmICh0LmNvbnRhaW5lci5wYXJlbnQoKS5sZW5ndGggPiAwICYmIHQuY29udGFpbmVyLnBhcmVudCgpWzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2JvZHknKSB7IC8vICYmIHQuY29udGFpbmVyLnNpYmxpbmdzKCkuY291bnQgPT0gMCkge1xuXHRcdFx0cGFyZW50V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHRcdG5ld0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcblx0XHR9XG5cblx0XHRpZiAobmV3SGVpZ2h0ICYmIHBhcmVudFdpZHRoKSB7XG5cblx0XHRcdC8vIHNldCBvdXRlciBjb250YWluZXIgc2l6ZVxuXHRcdFx0dC5jb250YWluZXJcblx0XHRcdC53aWR0aChwYXJlbnRXaWR0aClcblx0XHRcdC5oZWlnaHQobmV3SGVpZ2h0KTtcblxuXHRcdFx0Ly8gc2V0IG5hdGl2ZSA8dmlkZW8+IG9yIDxhdWRpbz4gYW5kIHNoaW1zXG5cdFx0XHR0LiRtZWRpYVxuXHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblxuXHRcdFx0Ly8gaWYgc2hpbSBpcyByZWFkeSwgc2VuZCB0aGUgc2l6ZSB0byB0aGUgZW1iZWRkZWQgcGx1Z2luXG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdGlmICh0Lm1lZGlhLnNldFNpemUpIHtcblx0XHRcdFx0XHR0Lm1lZGlhLnNldFNpemUocGFyZW50V2lkdGgsIG5ld0hlaWdodCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IHRoZSBsYXllcnNcblx0XHRcdHQubGF5ZXJzLmNoaWxkcmVuKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJgKVxuXHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblx0XHR9XG5cdH1cblxuXHRzZXRGaWxsTW9kZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzLFxuXHRcdFx0cGFyZW50ID0gdC5vdXRlckNvbnRhaW5lcjtcblxuXHRcdC8vIFJlbW92ZSB0aGUgcmVzcG9uc2l2ZSBhdHRyaWJ1dGVzIGluIHRoZSBldmVudCB0aGV5IGFyZSB0aGVyZVxuXHRcdGlmICh0LiRub2RlLmNzcygnaGVpZ2h0JykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnaGVpZ2h0JykgIT09IHQuaGVpZ2h0KSB7XG5cdFx0XHR0LiRub2RlLmNzcygnaGVpZ2h0JywgJycpO1xuXHRcdH1cblx0XHRpZiAodC4kbm9kZS5jc3MoJ21heC13aWR0aCcpICE9PSAnbm9uZScgJiYgdC4kbm9kZS5jc3MoJ21heC13aWR0aCcpICE9PSB0LndpZHRoKSB7XG5cdFx0XHR0LiRub2RlLmNzcygnbWF4LXdpZHRoJywgJycpO1xuXHRcdH1cblxuXHRcdGlmICh0LiRub2RlLmNzcygnbWF4LWhlaWdodCcpICE9PSAnbm9uZScgJiYgdC4kbm9kZS5jc3MoJ21heC1oZWlnaHQnKSAhPT0gdC5oZWlnaHQpIHtcblx0XHRcdHQuJG5vZGUuY3NzKCdtYXgtaGVpZ2h0JywgJycpO1xuXHRcdH1cblxuXHRcdGlmICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLmhlaWdodCA9PT0gJzEwMCUnKSB7XG5cdFx0XHRcdHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLmhlaWdodCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heFdpZHRoID09PSAnMTAwJScpIHtcblx0XHRcdFx0dC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4V2lkdGggPSAnJztcblx0XHRcdH1cblx0XHRcdGlmICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhIZWlnaHQgPT09ICcxMDAlJykge1xuXHRcdFx0XHR0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhIZWlnaHQgPSAnJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXBhcmVudC53aWR0aCgpKSB7XG5cdFx0XHRwYXJlbnQuaGVpZ2h0KHQuJG1lZGlhLndpZHRoKCkpO1xuXHRcdH1cblxuXHRcdGlmICghcGFyZW50LmhlaWdodCgpKSB7XG5cdFx0XHRwYXJlbnQuaGVpZ2h0KHQuJG1lZGlhLmhlaWdodCgpKTtcblx0XHR9XG5cblx0XHRsZXQgcGFyZW50V2lkdGggPSBwYXJlbnQud2lkdGgoKSxcblx0XHRcdHBhcmVudEhlaWdodCA9IHBhcmVudC5oZWlnaHQoKTtcblxuXHRcdHQuc2V0RGltZW5zaW9ucygnMTAwJScsICcxMDAlJyk7XG5cblx0XHQvLyBUaGlzIHByZXZlbnRzIGFuIGlzc3VlIHdoZW4gZGlzcGxheWluZyBwb3N0ZXJcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cG9zdGVyIGltZ2ApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0Ly8gY2FsY3VsYXRlIG5ldyB3aWR0aCBhbmQgaGVpZ2h0XG5cdFx0bGV0XG5cdFx0XHR0YXJnZXRFbGVtZW50ID0gdC5jb250YWluZXIuZmluZCgnb2JqZWN0LCBlbWJlZCwgaWZyYW1lLCB2aWRlbycpLFxuXHRcdFx0aW5pdEhlaWdodCA9IHQuaGVpZ2h0LFxuXHRcdFx0aW5pdFdpZHRoID0gdC53aWR0aCxcblx0XHRcdC8vIHNjYWxlIHRvIHRoZSB0YXJnZXQgd2lkdGhcblx0XHRcdHNjYWxlWDEgPSBwYXJlbnRXaWR0aCxcblx0XHRcdHNjYWxlWTEgPSAoaW5pdEhlaWdodCAqIHBhcmVudFdpZHRoKSAvIGluaXRXaWR0aCxcblx0XHRcdC8vIHNjYWxlIHRvIHRoZSB0YXJnZXQgaGVpZ2h0XG5cdFx0XHRzY2FsZVgyID0gKGluaXRXaWR0aCAqIHBhcmVudEhlaWdodCkgLyBpbml0SGVpZ2h0LFxuXHRcdFx0c2NhbGVZMiA9IHBhcmVudEhlaWdodCxcblx0XHRcdC8vIG5vdyBmaWd1cmUgb3V0IHdoaWNoIG9uZSB3ZSBzaG91bGQgdXNlXG5cdFx0XHRiU2NhbGVPbldpZHRoID0gc2NhbGVYMiA+IHBhcmVudFdpZHRoID09PSBmYWxzZSxcblx0XHRcdGZpbmFsV2lkdGggPSBiU2NhbGVPbldpZHRoID8gTWF0aC5mbG9vcihzY2FsZVgxKSA6IE1hdGguZmxvb3Ioc2NhbGVYMiksXG5cdFx0XHRmaW5hbEhlaWdodCA9IGJTY2FsZU9uV2lkdGggPyBNYXRoLmZsb29yKHNjYWxlWTEpIDogTWF0aC5mbG9vcihzY2FsZVkyKTtcblxuXHRcdGlmIChiU2NhbGVPbldpZHRoKSB7XG5cdFx0XHR0YXJnZXRFbGVtZW50LmhlaWdodChmaW5hbEhlaWdodCkud2lkdGgocGFyZW50V2lkdGgpO1xuXHRcdFx0aWYgKHQubWVkaWEuc2V0U2l6ZSkge1xuXHRcdFx0XHR0Lm1lZGlhLnNldFNpemUocGFyZW50V2lkdGgsIGZpbmFsSGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0RWxlbWVudC5oZWlnaHQocGFyZW50SGVpZ2h0KS53aWR0aChmaW5hbFdpZHRoKTtcblx0XHRcdGlmICh0Lm1lZGlhLnNldFNpemUpIHtcblx0XHRcdFx0dC5tZWRpYS5zZXRTaXplKGZpbmFsV2lkdGgsIHBhcmVudEhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGFyZ2V0RWxlbWVudC5jc3Moe1xuXHRcdFx0J21hcmdpbi1sZWZ0JzogTWF0aC5mbG9vcigocGFyZW50V2lkdGggLSBmaW5hbFdpZHRoKSAvIDIpLFxuXHRcdFx0J21hcmdpbi10b3AnOiAwXG5cdFx0fSk7XG5cdH1cblxuXHRzZXREaW1lbnNpb25zICh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jb250YWluZXJcblx0XHQud2lkdGgod2lkdGgpXG5cdFx0LmhlaWdodChoZWlnaHQpO1xuXG5cdFx0dC5sYXllcnMuY2hpbGRyZW4oYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcmApXG5cdFx0LndpZHRoKHdpZHRoKVxuXHRcdC5oZWlnaHQoaGVpZ2h0KTtcblx0fVxuXG5cdHNldENvbnRyb2xzU2l6ZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gc2tpcCBjYWxjdWxhdGlvbiBpZiBoaWRkZW5cblx0XHRpZiAoIXQuY29udGFpbmVyLmlzKCc6dmlzaWJsZScpIHx8ICF0LnJhaWwgfHwgIXQucmFpbC5sZW5ndGggfHwgIXQucmFpbC5pcygnOnZpc2libGUnKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0cmFpbE1hcmdpbiA9IHBhcnNlRmxvYXQodC5yYWlsLmNzcygnbWFyZ2luLWxlZnQnKSkgKyBwYXJzZUZsb2F0KHQucmFpbC5jc3MoJ21hcmdpbi1yaWdodCcpKSxcblx0XHRcdHRvdGFsTWFyZ2luID0gcGFyc2VGbG9hdCh0LnRvdGFsLmNzcygnbWFyZ2luLWxlZnQnKSkgKyBwYXJzZUZsb2F0KHQudG90YWwuY3NzKCdtYXJnaW4tcmlnaHQnKSkgfHwgMCxcblx0XHRcdHNpYmxpbmdzV2lkdGggPSAwXG5cdFx0O1xuXG5cdFx0dC5yYWlsLnNpYmxpbmdzKCkuZWFjaCgoaW5kZXgsIG9iamVjdCkgPT4ge1xuXHRcdFx0c2libGluZ3NXaWR0aCArPSBwYXJzZUZsb2F0KCQob2JqZWN0KS5vdXRlcldpZHRoKHRydWUpKTtcblx0XHR9KTtcblxuXHRcdHNpYmxpbmdzV2lkdGggKz0gdG90YWxNYXJnaW4gKyByYWlsTWFyZ2luICsgMTtcblxuXHRcdC8vIFN1YnN0cmFjdCB0aGUgd2lkdGggb2YgdGhlIGZlYXR1cmUgc2libGluZ3MgZnJvbSB0aW1lIHJhaWxcblx0XHR0LnJhaWwud2lkdGgodC5jb250cm9scy53aWR0aCgpIC0gc2libGluZ3NXaWR0aCk7XG5cblx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc3Jlc2l6ZScpO1xuXHR9XG5cblx0cmVzZXRTaXplICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0Ly8gd2Via2l0IGhhcyB0cm91YmxlIGRvaW5nIHRoaXMgd2l0aG91dCBhIGRlbGF5XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHR9LCA1MCk7XG5cdH1cblxuXHRzZXRQb3N0ZXIgKHVybCkge1xuXHRcdGxldCB0ID0gdGhpcyxcblx0XHRcdHBvc3RlckRpdiA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXJgKSxcblx0XHRcdHBvc3RlckltZyA9IHBvc3RlckRpdi5maW5kKCdpbWcnKTtcblxuXHRcdGlmIChwb3N0ZXJJbWcubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRwb3N0ZXJJbWcgPSAkKGA8aW1nIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cG9zdGVyLWltZ1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBhbHQ9XCJcIiAvPmApXG5cdFx0XHQuYXBwZW5kVG8ocG9zdGVyRGl2KTtcblx0XHR9XG5cblx0XHRwb3N0ZXJJbWcuYXR0cignc3JjJywgdXJsKTtcblx0XHRwb3N0ZXJEaXYuY3NzKHsnYmFja2dyb3VuZC1pbWFnZSc6IGB1cmwoXCIke3VybH1cIilgfSk7XG5cdH1cblxuXHRjaGFuZ2VTa2luIChjbGFzc05hbWUpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmNvbnRhaW5lclswXS5jbGFzc05hbWUgPSBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyICR7Y2xhc3NOYW1lfWA7XG5cdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHR9XG5cblx0Z2xvYmFsQmluZCAoZXZlbnRzLCBkYXRhLCBjYWxsYmFjaykge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRkb2MgPSB0Lm5vZGUgPyB0Lm5vZGUub3duZXJEb2N1bWVudCA6IGRvY3VtZW50XG5cdFx0O1xuXG5cdFx0ZXZlbnRzID0gc3BsaXRFdmVudHMoZXZlbnRzLCB0LmlkKTtcblx0XHRpZiAoZXZlbnRzLmQpIHtcblx0XHRcdCQoZG9jKS5vbihldmVudHMuZCwgZGF0YSwgY2FsbGJhY2spO1xuXHRcdH1cblx0XHRpZiAoZXZlbnRzLncpIHtcblx0XHRcdCQod2luZG93KS5vbihldmVudHMudywgZGF0YSwgY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdGdsb2JhbFVuYmluZCAoZXZlbnRzLCBjYWxsYmFjaykge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGRvYyA9IHQubm9kZSA/IHQubm9kZS5vd25lckRvY3VtZW50IDogZG9jdW1lbnRcblx0XHQ7XG5cblx0XHRldmVudHMgPSBzcGxpdEV2ZW50cyhldmVudHMsIHQuaWQpO1xuXHRcdGlmIChldmVudHMuZCkge1xuXHRcdFx0JChkb2MpLm9mZihldmVudHMuZCwgY2FsbGJhY2spO1xuXHRcdH1cblx0XHRpZiAoZXZlbnRzLncpIHtcblx0XHRcdCQod2luZG93KS5vZmYoZXZlbnRzLncsIGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cblxuXHRidWlsZHBvc3RlciAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHBvc3RlciA9ICQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXIgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJcIj48L2Rpdj5gKS5hcHBlbmRUbyhsYXllcnMpLFxuXHRcdFx0cG9zdGVyVXJsID0gcGxheWVyLiRtZWRpYS5hdHRyKCdwb3N0ZXInKVxuXHRcdDtcblxuXHRcdC8vIHByaW9yaXR5IGdvZXMgdG8gb3B0aW9uICh0aGlzIGlzIHVzZWZ1bCBpZiB5b3UgbmVlZCB0byBzdXBwb3J0IGlPUyAzLnggKGlPUyBjb21wbGV0ZWx5IGZhaWxzIHdpdGggcG9zdGVyKVxuXHRcdGlmIChwbGF5ZXIub3B0aW9ucy5wb3N0ZXIgIT09ICcnKSB7XG5cdFx0XHRwb3N0ZXJVcmwgPSBwbGF5ZXIub3B0aW9ucy5wb3N0ZXI7XG5cdFx0fVxuXG5cdFx0Ly8gc2Vjb25kLCB0cnkgdGhlIHJlYWwgcG9zdGVyXG5cdFx0aWYgKHBvc3RlclVybCkge1xuXHRcdFx0dC5zZXRQb3N0ZXIocG9zdGVyVXJsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cG9zdGVyLmhpZGUoKTtcblx0XHR9XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0cG9zdGVyLmhpZGUoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRpZiAocGxheWVyLm9wdGlvbnMuc2hvd1Bvc3RlcldoZW5FbmRlZCAmJiBwbGF5ZXIub3B0aW9ucy5hdXRvUmV3aW5kKSB7XG5cdFx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcblx0XHRcdFx0cG9zdGVyLnNob3coKTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHRidWlsZG92ZXJsYXlzIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSB7XG5cblx0XHRpZiAoIXBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGxvYWRpbmcgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1sb2FkaW5nXCI+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWxvYWRpbmctYmctaW1nXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5oaWRlKCkgLy8gc3RhcnQgb3V0IGhpZGRlblxuXHRcdFx0XHQuYXBwZW5kVG8obGF5ZXJzKSxcblx0XHRcdGVycm9yID1cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXkgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJcIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktZXJyb3JcIj48L2Rpdj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5oaWRlKCkgLy8gc3RhcnQgb3V0IGhpZGRlblxuXHRcdFx0XHQuYXBwZW5kVG8obGF5ZXJzKSxcblx0XHRcdC8vIHRoaXMgbmVlZHMgdG8gY29tZSBsYXN0IHNvIGl0J3Mgb24gdG9wXG5cdFx0XHRiaWdQbGF5ID1cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXkgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXIgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1wbGF5XCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWJ1dHRvblwiIHJvbGU9XCJidXR0b25cIiBgICtcblx0XHRcdFx0XHRcdGBhcmlhLWxhYmVsPVwiJHtpMThuLnQoJ21lanMucGxheScpfVwiIGFyaWEtcHJlc3NlZD1cImZhbHNlXCI+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFwcGVuZFRvKGxheWVycylcblx0XHRcdFx0Lm9uKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHQvLyBSZW1vdmVkICd0b3VjaHN0YXJ0JyBkdWUgaXNzdWVzIG9uIFNhbXN1bmcgQW5kcm9pZCBkZXZpY2VzIHdoZXJlIGEgdGFwIG9uIGJpZ1BsYXlcblx0XHRcdFx0XHQvLyBzdGFydGVkIGFuZCBpbW1lZGlhdGVseSBzdG9wcGVkIHRoZSB2aWRlb1xuXHRcdFx0XHRcdGlmICh0Lm9wdGlvbnMuY2xpY2tUb1BsYXlQYXVzZSkge1xuXG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0YnV0dG9uID0gdC4kbWVkaWEuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1idXR0b25gKSxcblx0XHRcdFx0XHRcdFx0cHJlc3NlZCA9IGJ1dHRvbi5hdHRyKCdhcmlhLXByZXNzZWQnKVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJ1dHRvbi5hdHRyKCdhcmlhLXByZXNzZWQnLCAhIXByZXNzZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHQvLyBpZiAodC5vcHRpb25zLnN1cHBvcnRWUiB8fCAodC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyh5b3V0dWJlfGZhY2Vib29rKS8pKSkge1xuXHRcdGlmICh0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKHlvdXR1YmV8ZmFjZWJvb2spLykpIHtcblx0XHRcdGJpZ1BsYXkuaGlkZSgpO1xuXHRcdH1cblxuXHRcdC8vIHNob3cvaGlkZSBiaWcgcGxheSBidXR0b25cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0YmlnUGxheS5oaWRlKCk7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHRcdGVycm9yLmhpZGUoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgKCkgPT4ge1xuXHRcdFx0YmlnUGxheS5oaWRlKCk7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHRcdGVycm9yLmhpZGUoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdzZWVraW5nJywgKCkgPT4ge1xuXHRcdFx0bG9hZGluZy5zaG93KCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5zaG93KCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignc2Vla2VkJywgKCkgPT4ge1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5oaWRlKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCAoKSA9PiB7XG5cdFx0XHRiaWdQbGF5LnNob3coKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd3YWl0aW5nJywgKCkgPT4ge1xuXHRcdFx0bG9hZGluZy5zaG93KCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5zaG93KCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cblx0XHQvLyBzaG93L2hpZGUgbG9hZGluZ1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCAoKSA9PiB7XG5cdFx0XHQvLyBmb3Igc29tZSByZWFzb24gQ2hyb21lIGlzIGZpcmluZyB0aGlzIGV2ZW50XG5cdFx0XHQvL2lmIChtZWpzLk1lZGlhRmVhdHVyZXMuaXNDaHJvbWUgJiYgbWVkaWEuZ2V0QXR0cmlidXRlICYmIG1lZGlhLmdldEF0dHJpYnV0ZSgncHJlbG9hZCcpID09PSAnbm9uZScpXG5cdFx0XHQvL1x0cmV0dXJuO1xuXG5cdFx0XHRsb2FkaW5nLnNob3coKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLnNob3coKTtcblx0XHRcdC8vIEZpcmluZyB0aGUgJ2NhbnBsYXknIGV2ZW50IGFmdGVyIGEgdGltZW91dCB3aGljaCBpc24ndCBnZXR0aW5nIGZpcmVkIG9uIHNvbWUgQW5kcm9pZCA0LjEgZGV2aWNlc1xuXHRcdFx0Ly8gKGh0dHBzOi8vZ2l0aHViLmNvbS9qb2huZHllci9tZWRpYWVsZW1lbnQvaXNzdWVzLzEzMDUpXG5cdFx0XHRpZiAoSVNfQU5EUk9JRCkge1xuXHRcdFx0XHRtZWRpYS5jYW5wbGF5VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuXHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuXHRcdFx0XHRcdFx0XHRsZXQgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdFx0ZXZ0LmluaXRFdmVudCgnY2FucGxheScsIHRydWUsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbWVkaWEuZGlzcGF0Y2hFdmVudChldnQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIDMwMFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5oaWRlKCk7XG5cdFx0XHQvLyBDbGVhciB0aW1lb3V0IGluc2lkZSAnbG9hZGVkZGF0YScgdG8gcHJldmVudCAnY2FucGxheScgZnJvbSBmaXJpbmcgdHdpY2Vcblx0XHRcdGNsZWFyVGltZW91dChtZWRpYS5jYW5wbGF5VGltZW91dCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0Ly8gZXJyb3IgaGFuZGxpbmdcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG5cdFx0XHR0Ll9oYW5kbGVFcnJvcihlKTtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0YmlnUGxheS5oaWRlKCk7XG5cdFx0XHRlcnJvci5zaG93KCk7XG5cdFx0XHRlcnJvci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1lcnJvcmApLmh0bWwoZS5tZXNzYWdlKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdHQub25rZXlkb3duKHBsYXllciwgbWVkaWEsIGUpO1xuXHRcdH0sIGZhbHNlKTtcblx0fVxuXG5cdGJ1aWxka2V5Ym9hcmQgKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuY29udGFpbmVyLmtleWRvd24oKCkgPT4ge1xuXHRcdFx0dC5rZXlib2FyZEFjdGlvbiA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHQvLyBsaXN0ZW4gZm9yIGtleSBwcmVzc2VzXG5cdFx0dC5nbG9iYWxCaW5kKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRsZXQgJGNvbnRhaW5lciA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCk7XG5cdFx0XHRwbGF5ZXIuaGFzRm9jdXMgPSAkY29udGFpbmVyLmxlbmd0aCAhPT0gMCAmJlxuXHRcdFx0XHQkY29udGFpbmVyLmF0dHIoJ2lkJykgPT09IHBsYXllci4kbWVkaWEuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApLmF0dHIoJ2lkJyk7XG5cdFx0XHRyZXR1cm4gdC5vbmtleWRvd24ocGxheWVyLCBtZWRpYSwgZXZlbnQpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyBjaGVjayBpZiBzb21lb25lIGNsaWNrZWQgb3V0c2lkZSBhIHBsYXllciByZWdpb24sIHRoZW4ga2lsbCBpdHMgZm9jdXNcblx0XHR0Lmdsb2JhbEJpbmQoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cdFx0XHRwbGF5ZXIuaGFzRm9jdXMgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApLmxlbmd0aCAhPT0gMDtcblx0XHR9KTtcblxuXHR9XG5cblx0b25rZXlkb3duIChwbGF5ZXIsIG1lZGlhLCBlKSB7XG5cblx0XHRpZiAocGxheWVyLmhhc0ZvY3VzICYmIHBsYXllci5vcHRpb25zLmVuYWJsZUtleWJvYXJkKSB7XG5cdFx0XHQvLyBmaW5kIGEgbWF0Y2hpbmcga2V5XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBwbGF5ZXIub3B0aW9ucy5rZXlBY3Rpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0bGV0IGtleUFjdGlvbiA9IHBsYXllci5vcHRpb25zLmtleUFjdGlvbnNbaV07XG5cblx0XHRcdFx0Zm9yIChsZXQgaiA9IDAsIGpsID0ga2V5QWN0aW9uLmtleXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuXHRcdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IGtleUFjdGlvbi5rZXlzW2pdKSB7XG5cdFx0XHRcdFx0XHRrZXlBY3Rpb24uYWN0aW9uKHBsYXllciwgbWVkaWEsIGUua2V5Q29kZSwgZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwbGF5ICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBvbmx5IGxvYWQgaWYgdGhlIGN1cnJlbnQgdGltZSBpcyAwIHRvIGVuc3VyZSBwcm9wZXIgcGxheWluZ1xuXHRcdGlmICh0Lm1lZGlhLmdldEN1cnJlbnRUaW1lKCkgPD0gMCkge1xuXHRcdFx0dC5sb2FkKCk7XG5cdFx0fVxuXHRcdHQubWVkaWEucGxheSgpO1xuXHR9XG5cblx0cGF1c2UgKCkge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLm1lZGlhLnBhdXNlKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdH1cblx0fVxuXG5cdGxvYWQgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmICghdC5pc0xvYWRlZCkge1xuXHRcdFx0dC5tZWRpYS5sb2FkKCk7XG5cdFx0fVxuXG5cdFx0dC5pc0xvYWRlZCA9IHRydWU7XG5cdH1cblxuXHRzZXRNdXRlZCAobXV0ZWQpIHtcblx0XHR0aGlzLm1lZGlhLnNldE11dGVkKG11dGVkKTtcblx0fVxuXG5cdHNldEN1cnJlbnRUaW1lICh0aW1lKSB7XG5cdFx0dGhpcy5tZWRpYS5zZXRDdXJyZW50VGltZSh0aW1lKTtcblx0fVxuXG5cdGdldEN1cnJlbnRUaW1lICgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcblx0fVxuXG5cdHNldFZvbHVtZSAodm9sdW1lKSB7XG5cdFx0dGhpcy5tZWRpYS5zZXRWb2x1bWUodm9sdW1lKTtcblx0fVxuXG5cdGdldFZvbHVtZSAoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEudm9sdW1lO1xuXHR9XG5cblx0c2V0U3JjIChzcmMpIHtcblx0XHR0aGlzLm1lZGlhLnNldFNyYyhzcmMpO1xuXHR9XG5cblx0cmVtb3ZlICgpIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRyZW5kZXJlck5hbWUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZVxuXHRcdDtcblxuXHRcdC8vIGludm9rZSBmZWF0dXJlcyBjbGVhbnVwXG5cdFx0Zm9yIChsZXQgZmVhdHVyZUluZGV4IGluIHQub3B0aW9ucy5mZWF0dXJlcykge1xuXHRcdFx0bGV0IGZlYXR1cmUgPSB0Lm9wdGlvbnMuZmVhdHVyZXNbZmVhdHVyZUluZGV4XTtcblx0XHRcdGlmICh0W2BjbGVhbiR7ZmVhdHVyZX1gXSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHRbYGNsZWFuJHtmZWF0dXJlfWBdKHQpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Ly8gQHRvZG86IHJlcG9ydCBjb250cm9sIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgZXJyb3IgY2xlYW5pbmcgJHtmZWF0dXJlfWAsIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVzZXQgZGltZW5zaW9uc1xuXHRcdHQuJG5vZGUuY3NzKHtcblx0XHRcdHdpZHRoOiB0LiRub2RlLmF0dHIoJ3dpZHRoJykgfHwgJ2F1dG8nLFxuXHRcdFx0aGVpZ2h0OiB0LiRub2RlLmF0dHIoJ2hlaWdodCcpIHx8ICdhdXRvJ1xuXHRcdH0pO1xuXG5cdFx0Ly8gZ3JhYiB2aWRlbyBhbmQgcHV0IGl0IGJhY2sgaW4gcGxhY2Vcblx0XHRpZiAoIXQuaXNEeW5hbWljKSB7XG5cdFx0XHR0LiRtZWRpYS5wcm9wKCdjb250cm9scycsIHRydWUpO1xuXHRcdFx0Ly8gZGV0YWNoIGV2ZW50cyBmcm9tIHRoZSB2aWRlb1xuXHRcdFx0Ly8gQHRvZG86IGRldGFjaCBldmVudCBsaXN0ZW5lcnMgYmV0dGVyIHRoYW4gdGhpczsgYWxzbyBkZXRhY2ggT05MWSB0aGUgZXZlbnRzIGF0dGFjaGVkIGJ5IHRoaXMgcGx1Z2luIVxuXHRcdFx0dC4kbm9kZS5hdHRyKCdpZCcsIHQuJG5vZGUuYXR0cignaWQnKS5yZXBsYWNlKGBfJHtyZW5kZXJlck5hbWV9YCwgJycpKTtcblx0XHRcdHQuJG5vZGUuY2xvbmUoKS5pbnNlcnRCZWZvcmUodC5jb250YWluZXIpLnNob3coKTtcblx0XHRcdHQuJG5vZGUucmVtb3ZlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHQuJG5vZGUuaW5zZXJ0QmVmb3JlKHQuY29udGFpbmVyKTtcblx0XHR9XG5cblx0XHR0Lm1lZGlhLnJlbW92ZSgpO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBwbGF5ZXIgZnJvbSB0aGUgbWVqcy5wbGF5ZXJzIG9iamVjdCBzbyB0aGF0IHBhdXNlT3RoZXJQbGF5ZXJzIGRvZXNuJ3QgYmxvdyB1cCB3aGVuIHRyeWluZyB0b1xuXHRcdC8vIHBhdXNlIGEgbm9uIGV4aXN0ZW50IEZsYXNoIEFQSS5cblx0XHRkZWxldGUgbWVqcy5wbGF5ZXJzW3QuaWRdO1xuXG5cdFx0aWYgKHR5cGVvZiB0LmNvbnRhaW5lciA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHQuY29udGFpbmVyLnByZXYoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKS5yZW1vdmUoKTtcblx0XHRcdHQuY29udGFpbmVyLnJlbW92ZSgpO1xuXHRcdH1cblx0XHR0Lmdsb2JhbFVuYmluZCgpO1xuXHRcdGRlbGV0ZSB0Lm5vZGUucGxheWVyO1xuXHR9XG59XG5cbndpbmRvdy5NZWRpYUVsZW1lbnRQbGF5ZXIgPSBNZWRpYUVsZW1lbnRQbGF5ZXI7XG5cbmV4cG9ydCBkZWZhdWx0IE1lZGlhRWxlbWVudFBsYXllcjtcblxuLy8gdHVybiBpbnRvIHBsdWdpblxuKCgkKSA9PiB7XG5cblx0aWYgKHR5cGVvZiAkICE9PSAndW5kZWZpbmVkJykge1xuXHRcdCQuZm4ubWVkaWFlbGVtZW50cGxheWVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRcdGlmIChvcHRpb25zID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGxldCBwbGF5ZXIgPSAkKHRoaXMpLmRhdGEoJ21lZGlhZWxlbWVudHBsYXllcicpO1xuXHRcdFx0XHRcdGlmIChwbGF5ZXIpIHtcblx0XHRcdFx0XHRcdHBsYXllci5yZW1vdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVEYXRhKCdtZWRpYWVsZW1lbnRwbGF5ZXInKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoJ21lZGlhZWxlbWVudHBsYXllcicsIG5ldyBNZWRpYUVsZW1lbnRQbGF5ZXIodGhpcywgb3B0aW9ucykpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHQkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG5cdFx0XHQvLyBhdXRvIGVuYWJsZSB1c2luZyBKU09OIGF0dHJpYnV0ZVxuXHRcdFx0JChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXBsYXllcmApLm1lZGlhZWxlbWVudHBsYXllcigpO1xuXHRcdH0pO1xuXHR9XG5cbn0pKG1lanMuJCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50LCBhZGRFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIERhaWx5TW90aW9uIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBEYWlseU1vdGlvbiBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZGFpbHltb3Rpb24uY29tL3BsYXllclxuICpcbiAqL1xuY29uc3QgRGFpbHlNb3Rpb25BcGkgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzU0RLU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzU0RLTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGlmcmFtZVF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgY3JlYXRpb24gb2YgPGlmcmFtZT5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0ZW5xdWV1ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRpZiAoRGFpbHlNb3Rpb25BcGkuaXNMb2FkZWQpIHtcblx0XHRcdERhaWx5TW90aW9uQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdERhaWx5TW90aW9uQXBpLmxvYWRJZnJhbWVBcGkoKTtcblx0XHRcdERhaWx5TW90aW9uQXBpLmlmcmFtZVF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBEYWlseU1vdGlvbiBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cdFx0aWYgKCFEYWlseU1vdGlvbkFwaS5pc1NES1N0YXJ0ZWQpIHtcblx0XHRcdGxldCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRlLmFzeW5jID0gdHJ1ZTtcblx0XHRcdGUuc3JjID0gJy8vYXBpLmRtY2RuLm5ldC9hbGwuanMnO1xuXHRcdFx0bGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG5cdFx0XHRzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIHMpO1xuXHRcdFx0RGFpbHlNb3Rpb25BcGkuaXNTREtTdGFydGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgRGFpbHlNb3Rpb24gPGlmcmFtZT4gZWxlbWVudCBjcmVhdGlvblxuXHQgKlxuXHQgKi9cblx0YXBpUmVhZHk6ICgpID0+IHtcblxuXHRcdERhaWx5TW90aW9uQXBpLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHREYWlseU1vdGlvbkFwaS5pc1NES0xvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoRGFpbHlNb3Rpb25BcGkuaWZyYW1lUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gRGFpbHlNb3Rpb25BcGkuaWZyYW1lUXVldWUucG9wKCk7XG5cdFx0XHREYWlseU1vdGlvbkFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIERhaWx5TW90aW9uIEFQSSBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRjcmVhdGVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRwbGF5ZXIgPSBETS5wbGF5ZXIoc2V0dGluZ3MuY29udGFpbmVyLCB7XG5cdFx0XHRcdGhlaWdodDogc2V0dGluZ3MuaGVpZ2h0IHx8ICcxMDAlJyxcblx0XHRcdFx0d2lkdGg6IHNldHRpbmdzLndpZHRoIHx8ICcxMDAlJyxcblx0XHRcdFx0dmlkZW86IHNldHRpbmdzLnZpZGVvSWQsXG5cdFx0XHRcdHBhcmFtczogT2JqZWN0LmFzc2lnbih7YXBpOiB0cnVlfSwgc2V0dGluZ3MucGFyYW1zKSxcblx0XHRcdFx0b3JpZ2luOiBsb2NhdGlvbi5ob3N0XG5cdFx0XHR9KTtcblxuXHRcdHBsYXllci5hZGRFdmVudExpc3RlbmVyKCdhcGlyZWFkeScsICgpID0+IHtcblx0XHRcdHdpbmRvd1snX19yZWFkeV9fJyArIHNldHRpbmdzLmlkXShwbGF5ZXIsIHtwYXVzZWQ6IHRydWUsIGVuZGVkOiBmYWxzZX0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFeHRyYWN0IElEIGZyb20gRGFpbHlNb3Rpb24ncyBVUkwgdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqIC0gaHR0cDovL3d3dy5kYWlseW1vdGlvbi5jb20vZW1iZWQvdmlkZW8veDM1eWF3eVxuXHQgKiAtIGh0dHA6Ly9kYWkubHkveDM1eWF3eVxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG5cdCAqIEByZXR1cm4ge1N0cmluZ31cblx0ICovXG5cdGdldERhaWx5TW90aW9uSWQ6ICh1cmwpID0+IHtcblx0XHRsZXRcblx0XHRcdHBhcnRzID0gdXJsLnNwbGl0KCcvJyksXG5cdFx0XHRsYXN0UGFydCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLFxuXHRcdFx0ZGFzaFBhcnRzID0gbGFzdFBhcnQuc3BsaXQoJ18nKVxuXHRcdDtcblxuXHRcdHJldHVybiBkYXNoUGFydHNbMF07XG5cdH1cbn07XG5cbmNvbnN0IERhaWx5TW90aW9uSWZyYW1lUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICdkYWlseW1vdGlvbl9pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdkYWlseW1vdGlvbl9pZnJhbWUnLFxuXG5cdFx0ZGFpbHltb3Rpb246IHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRhdXRvcGxheTogZmFsc2UsXG5cdFx0XHRcdGNocm9tZWxlc3M6IDEsXG5cdFx0XHRcdGluZm86IDAsXG5cdFx0XHRcdGxvZ286IDAsXG5cdFx0XHRcdHJlbGF0ZWQ6IDBcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gWyd2aWRlby9kYWlseW1vdGlvbicsICd2aWRlby94LWRhaWx5bW90aW9uJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXQgZG0gPSB7fTtcblxuXHRcdGRtLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdGRtLmlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXg7XG5cdFx0ZG0ubWVkaWFFbGVtZW50ID0gbWVkaWFFbGVtZW50O1xuXG5cdFx0bGV0XG5cdFx0XHRhcGlTdGFjayA9IFtdLFxuXHRcdFx0ZG1QbGF5ZXJSZWFkeSA9IGZhbHNlLFxuXHRcdFx0ZG1QbGF5ZXIgPSBudWxsLFxuXHRcdFx0ZG1JZnJhbWUgPSBudWxsLFxuXHRcdFx0ZXZlbnRzLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRkbVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChkbVBsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IGRtIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIuY3VycmVudFRpbWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpc05hTihkbVBsYXllci5kdXJhdGlvbikgPyAwIDogZG1QbGF5ZXIuZHVyYXRpb247XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIudm9sdW1lO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BhdXNlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLnBhdXNlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdlbmRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLmVuZGVkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIubXV0ZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCBwZXJjZW50TG9hZGVkID0gZG1QbGF5ZXIuYnVmZmVyZWRUaW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZHVyYXRpb24gPSBkbVBsYXllci5kdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBwZXJjZW50TG9hZGVkIC8gZHVyYXRpb247XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRkbVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRtUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmM7XG5cblx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5sb2FkKERhaWx5TW90aW9uQXBpLmdldERhaWx5TW90aW9uSWQodXJsKSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNlZWsodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNldE11dGVkKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGRtKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5zZXRWb2x1bWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGRtKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZG0gJyArIGRtLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdGRtW21ldGhvZE5hbWVdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChkbVBsYXllciAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIucGxheSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xvYWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ2NhbGwnLCBtZXRob2ROYW1lOiBtZXRob2ROYW1lfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbk1ldGhvZHMobWV0aG9kc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbCBtZXRob2QgdG8gcmVnaXN0ZXIgYWxsIERhaWx5TW90aW9uIGV2ZW50cyB3aGVuIGluaXRpYWxpemluZyA8aWZyYW1lPlxuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIGRtLmlkXSA9IChfZG1QbGF5ZXIpID0+IHtcblxuXHRcdFx0ZG1QbGF5ZXJSZWFkeSA9IHRydWU7XG5cdFx0XHRtZWRpYUVsZW1lbnQuZG1QbGF5ZXIgPSBkbVBsYXllciA9IF9kbVBsYXllcjtcblxuXHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0aWYgKGFwaVN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGFwaVN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBhcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRkbVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdGRtW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRkbUlmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRtLmlkKTtcblxuXHRcdFx0Ly8gYSBmZXcgbW9yZSBldmVudHNcblx0XHRcdGV2ZW50cyA9IFsnbW91c2VvdmVyJywgJ21vdXNlb3V0J107XG5cdFx0XHRsZXQgYXNzaWduRXZlbnQgPSAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIGRtKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChsZXQgaiBpbiBldmVudHMpIHtcblx0XHRcdFx0YWRkRXZlbnQoZG1JZnJhbWUsIGV2ZW50c1tqXSwgYXNzaWduRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTIHVwXG5cdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzO1xuXHRcdFx0ZXZlbnRzID0gZXZlbnRzLmNvbmNhdChbJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKTtcblx0XHRcdGxldCBhc3NpZ25OYXRpdmVFdmVudHMgPSAoZXZlbnROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBldmVudDsgbm90IGNvbnNpZGVyIGl0XG5cdFx0XHRcdGlmIChldmVudE5hbWUgIT09ICdlbmRlZCcpIHtcblxuXHRcdFx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCBkbVBsYXllcik7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRhc3NpZ25OYXRpdmVFdmVudHMoZXZlbnRzW2ldKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3VzdG9tIERhaWx5TW90aW9uIGV2ZW50c1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0ZXZlbnQgPSBjcmVhdGVFdmVudCgncHJvZ3Jlc3MnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2FkX3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2FkX3BhdXNlJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGF1c2UnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZW5kZWQnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndmlkZW9fc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0ZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCd2aWRlb19lbmQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignZHVyYXRpb25jaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblxuXG5cdFx0XHQvLyBnaXZlIGluaXRpYWwgZXZlbnRzXG5cdFx0XHRsZXQgaW5pdEV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBpbml0RXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoaW5pdEV2ZW50c1tpXSwgZG0pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCBkbUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGRtQ29udGFpbmVyLmlkID0gZG0uaWQ7XG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKGRtQ29udGFpbmVyKTtcblx0XHRpZiAobWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSkge1xuXHRcdFx0ZG1Db250YWluZXIuc3R5bGUud2lkdGggPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLndpZHRoO1xuXHRcdFx0ZG1Db250YWluZXIuc3R5bGUuaGVpZ2h0ID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5oZWlnaHQ7XG5cdFx0fVxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdGxldFxuXHRcdFx0dmlkZW9JZCA9IERhaWx5TW90aW9uQXBpLmdldERhaWx5TW90aW9uSWQobWVkaWFGaWxlc1swXS5zcmMpLFxuXHRcdFx0ZG1TZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdFx0XHRpZDogZG0uaWQsXG5cdFx0XHRcdGNvbnRhaW5lcjogZG1Db250YWluZXIsXG5cdFx0XHRcdHZpZGVvSWQ6IHZpZGVvSWQsXG5cdFx0XHRcdGF1dG9wbGF5OiAhIShtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSlcblx0XHRcdH0sIGRtLm9wdGlvbnMuZGFpbHltb3Rpb24pO1xuXG5cdFx0RGFpbHlNb3Rpb25BcGkuZW5xdWV1ZUlmcmFtZShkbVNldHRpbmdzKTtcblxuXHRcdGRtLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRkbS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdGRtLnBhdXNlKCk7XG5cdFx0XHRpZiAoZG1JZnJhbWUpIHtcblx0XHRcdFx0ZG1JZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdGRtLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoZG1JZnJhbWUpIHtcblx0XHRcdFx0ZG1JZnJhbWUuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZG0uc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRkbUlmcmFtZS53aWR0aCA9IHdpZHRoO1xuXHRcdFx0ZG1JZnJhbWUuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH07XG5cdFx0ZG0uZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdGRtUGxheWVyLmRlc3Ryb3koKTtcblx0XHR9O1xuXHRcdGRtLmludGVydmFsID0gbnVsbDtcblxuXHRcdGRtLnN0YXJ0SW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHRkbS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0RGFpbHlNb3Rpb25BcGkuc2VuZEV2ZW50KGRtLmlkLCBkbVBsYXllciwgJ3RpbWV1cGRhdGUnLCB7XG5cdFx0XHRcdFx0cGF1c2VkOiBmYWxzZSxcblx0XHRcdFx0XHRlbmRlZDogZmFsc2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCAyNTApO1xuXHRcdH07XG5cdFx0ZG0uc3RvcEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0aWYgKGRtLmludGVydmFsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoZG0uaW50ZXJ2YWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZG07XG5cdH1cbn07XG5cblxuLypcbiAqIFJlZ2lzdGVyIERhaWx5TW90aW9uIGV2ZW50IGdsb2JhbGx5XG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuICh1cmwuaW5jbHVkZXMoJy8vZGFpbHltb3Rpb24uY29tJykgfHwgdXJsLmluY2x1ZGVzKCd3d3cuZGFpbHltb3Rpb24uY29tJykgfHwgdXJsLmluY2x1ZGVzKCcvL2RhaS5seScpKSA/ICd2aWRlby94LWRhaWx5bW90aW9uJyA6IG51bGw7XG59KTtcblxud2luZG93LmRtQXN5bmNJbml0ID0gKCkgPT4ge1xuXHREYWlseU1vdGlvbkFwaS5hcGlSZWFkeSgpO1xufTtcblxucmVuZGVyZXIuYWRkKERhaWx5TW90aW9uSWZyYW1lUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuaW1wb3J0IHtIQVNfTVNFfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuXG4vKipcbiAqIE5hdGl2ZSBNKFBFRyktRGFzaCByZW5kZXJlclxuICpcbiAqIFVzZXMgZGFzaC5qcywgYSByZWZlcmVuY2UgY2xpZW50IGltcGxlbWVudGF0aW9uIGZvciB0aGUgcGxheWJhY2sgb2YgTShQRUcpLURBU0ggdmlhIEphdmFzY3JpcHQgYW5kIGNvbXBsaWFudCBicm93c2Vycy5cbiAqIEl0IHJlbGllcyBvbiBIVE1MNSB2aWRlbyBhbmQgTWVkaWFTb3VyY2UgRXh0ZW5zaW9ucyBmb3IgcGxheWJhY2suXG4gKiBUaGlzIHJlbmRlcmVyIGludGVncmF0ZXMgbmV3IGV2ZW50cyBhc3NvY2lhdGVkIHdpdGggbXBkIGZpbGVzLlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vRGFzaC1JbmR1c3RyeS1Gb3J1bS9kYXNoLmpzXG4gKlxuICovXG5jb25zdCBOYXRpdmVEYXNoID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGNyZWF0aW9uUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBsb2FkaW5nIG9mIGFuIERBU0ggc291cmNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIERBU0ggcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVEYXNoLmlzTG9hZGVkKSB7XG5cdFx0XHROYXRpdmVEYXNoLmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TmF0aXZlRGFzaC5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZURhc2guY3JlYXRpb25RdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgZGFzaC5tZWRpYXBsYXllci5qcyBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGxvYWQgYW4gREFTSCBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlRGFzaC5pc1NjcmlwdExvYWRlZCkge1xuXG5cdFx0XHRpZiAodHlwZW9mIGRhc2hqcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0TmF0aXZlRGFzaC5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA9IHR5cGVvZiBzZXR0aW5ncy5vcHRpb25zLnBhdGggPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggOiAnLy9jZG4uZGFzaGpzLm9yZy9sYXRlc3QvZGFzaC5tZWRpYXBsYXllci5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlRGFzaC5tZWRpYVJlYWR5KCk7XG5cdFx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgZmlyc3RTY3JpcHRUYWcpO1xuXHRcdFx0fVxuXHRcdFx0TmF0aXZlRGFzaC5pc1NjcmlwdExvYWRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIERBU0ggcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cblx0XHROYXRpdmVEYXNoLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVEYXNoLmlzU2NyaXB0TG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChOYXRpdmVEYXNoLmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlRGFzaC5jcmVhdGlvblF1ZXVlLnBvcCgpO1xuXHRcdFx0TmF0aXZlRGFzaC5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgREFTSCBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgREFTSCBvYmplY3Rcblx0ICovXG5cdGNyZWF0ZUluc3RhbmNlOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGxldCBwbGF5ZXIgPSBkYXNoanMuTWVkaWFQbGF5ZXIoKS5jcmVhdGUoKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0fVxufTtcblxubGV0IERhc2hOYXRpdmVSZW5kZXJlciA9IHtcblx0bmFtZTogJ25hdGl2ZV9kYXNoJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnbmF0aXZlX2Rhc2gnLFxuXHRcdGRhc2g6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgZGFzaC5qcyBtZWRpYXBsYXllciBsaWJyYXJ5XG5cdFx0XHRwYXRoOiAnLy9jZG4uZGFzaGpzLm9yZy9sYXRlc3QvZGFzaC5tZWRpYXBsYXllci5taW4uanMnLFxuXHRcdFx0ZGVidWc6IGZhbHNlXG5cdFx0fVxuXHR9LFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBIQVNfTVNFICYmIFsnYXBwbGljYXRpb24vZGFzaCt4bWwnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdGxldFxuXHRcdFx0bm9kZSA9IG51bGwsXG5cdFx0XHRvcmlnaW5hbE5vZGUgPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLFxuXHRcdFx0aWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeCxcblx0XHRcdGRhc2hQbGF5ZXIsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0bm9kZSA9IG9yaWdpbmFsTm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0bm9kZVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4gKGRhc2hQbGF5ZXIgIT09IG51bGwpID8gbm9kZVtwcm9wTmFtZV0gOiBudWxsO1xuXG5cdFx0XHRcdG5vZGVbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChkYXNoUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcE5hbWUgPT09ICdzcmMnKSB7XG5cblx0XHRcdFx0XHRcdFx0ZGFzaFBsYXllci5hdHRhY2hTb3VyY2UodmFsdWUpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChub2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdG5vZGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBNLURhc2ggZXZlbnRzXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgaWRdID0gKF9kYXNoUGxheWVyKSA9PiB7XG5cblx0XHRcdG1lZGlhRWxlbWVudC5kYXNoUGxheWVyID0gZGFzaFBsYXllciA9IF9kYXNoUGxheWVyO1xuXG5cdFx0XHQvLyBCeSBkZWZhdWx0LCBjb25zb2xlIGxvZyBpcyBvZmZcblx0XHRcdGRhc2hQbGF5ZXIuZ2V0RGVidWcoKS5zZXRMb2dUb0Jyb3dzZXJDb25zb2xlKG9wdGlvbnMuZGFzaC5kZWJ1Zyk7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChzdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBzdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gc3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdG5vZGVbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJVQkJMRSBFVkVOVFNcblx0XHRcdGxldFxuXHRcdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLCBkYXNoRXZlbnRzID0gZGFzaGpzLk1lZGlhUGxheWVyLmV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXHRcdFx0XHRcdFx0ZGFzaFBsYXllci5pbml0aWFsaXplKG5vZGUsIG5vZGUuc3JjLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGUpID0+IHtcblx0XHRcdFx0XHRcdGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoZS50eXBlLCBlLmJ1YmJsZXMsIGUuY2FuY2VsYWJsZSk7XG5cdFx0XHRcdFx0XHQvLyBAdG9kbyBDaGVjayB0aGlzXG5cdFx0XHRcdFx0XHQvLyBldmVudC5zcmNFbGVtZW50ID0gZS5zcmNFbGVtZW50O1xuXHRcdFx0XHRcdFx0Ly8gZXZlbnQudGFyZ2V0ID0gZS5zcmNFbGVtZW50O1xuXG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0O1xuXG5cdFx0XHRldmVudHMgPSBldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGFzc2lnbkV2ZW50cyhldmVudHNbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEN1c3RvbSBNKFBFRyktREFTSCBldmVudHNcblx0XHRcdCAqXG5cdFx0XHQgKiBUaGVzZSBldmVudHMgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBvcmlnaW5hbCBub2RlIHVzaW5nIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHRoZSBuYW1lIG9mIHRoZSBldmVudCxcblx0XHRcdCAqIG5vdCB1c2luZyBkYXNoanMuTWVkaWFQbGF5ZXIuZXZlbnRzIG9iamVjdFxuXHRcdFx0ICogQHNlZSBodHRwOi8vY2RuLmRhc2hqcy5vcmcvbGF0ZXN0L2pzZG9jL01lZGlhUGxheWVyRXZlbnRzLmh0bWxcblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgYXNzaWduTWRhc2hFdmVudHMgPSAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIG5vZGUpO1xuXHRcdFx0XHRldmVudC5kYXRhID0gZTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdGlmIChlLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2Vycm9yJykge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAobGV0IGV2ZW50VHlwZSBpbiBkYXNoRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChkYXNoRXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiBcdFx0XHRcdFx0ZGFzaFBsYXllci5vbihkYXNoRXZlbnRzW2V2ZW50VHlwZV0sIGFzc2lnbk1kYXNoRXZlbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdE5hdGl2ZURhc2gucHJlcGFyZVNldHRpbmdzKHtcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnMuZGFzaCxcblx0XHRcdGlkOiBpZFxuXHRcdH0pO1xuXG5cdFx0Ly8gSEVMUEVSIE1FVEhPRFNcblx0XHRub2RlLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdG5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuaGlkZSA9ICgpID0+IHtcblx0XHRcdG5vZGUucGF1c2UoKTtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIE5hdGl2ZSBNKFBFRyktRGFzaCB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gdXJsLmluY2x1ZGVzKCcubXBkJykgPyAnYXBwbGljYXRpb24vZGFzaCt4bWwnIDogbnVsbDtcbn0pO1xuXG5yZW5kZXJlci5hZGQoRGFzaE5hdGl2ZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7aXNPYmplY3RFbXB0eX0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJhbCc7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogRmFjZWJvb2sgcmVuZGVyZXJcbiAqXG4gKiBJdCBjcmVhdGVzIGFuIDxpZnJhbWU+IGZyb20gYSA8ZGl2PiB3aXRoIHNwZWNpZmljIGNvbmZpZ3VyYXRpb24uXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9wbHVnaW5zL2VtYmVkZGVkLXZpZGVvLXBsYXllclxuICovXG5jb25zdCBGYWNlYm9va1JlbmRlcmVyID0ge1xuXHRuYW1lOiAnZmFjZWJvb2snLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdmYWNlYm9vaycsXG5cdFx0ZmFjZWJvb2s6IHtcblx0XHRcdGFwcElkOiAne3lvdXItYXBwLWlkfScsXG5cdFx0XHR4ZmJtbDogdHJ1ZSxcblx0XHRcdHZlcnNpb246ICd2Mi42J1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSAgPT4gWyd2aWRlby9mYWNlYm9vaycsICd2aWRlby94LWZhY2Vib29rJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSAgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRmYldyYXBwZXIgPSB7fSxcblx0XHRcdGZiQXBpID0gbnVsbCxcblx0XHRcdGZiRGl2ID0gbnVsbCxcblx0XHRcdGFwaVN0YWNrID0gW10sXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdGhhc1N0YXJ0ZWRQbGF5aW5nID0gZmFsc2UsXG5cdFx0XHRzcmMgPSAnJyxcblx0XHRcdGV2ZW50SGFuZGxlciA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXHRcdGZiV3JhcHBlci5vcHRpb25zID0gb3B0aW9ucztcblx0XHRmYldyYXBwZXIuaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHRmYldyYXBwZXIubWVkaWFFbGVtZW50ID0gbWVkaWFFbGVtZW50O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgID0+IHtcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRmYldyYXBwZXJbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmYkFwaSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IHlvdXR1YmUgZHRhIGhlcmVcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5nZXRDdXJyZW50UG9zaXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdkdXJhdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLmdldER1cmF0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmJBcGkuZ2V0Vm9sdW1lKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5pc011dGVkKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc3JjO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmYldyYXBwZXJbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgID0+IHtcblxuXHRcdFx0XHRcdGlmIChmYkFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRsZXQgdXJsID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogdmFsdWVbMF0uc3JjO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gT25seSB3YXkgaXMgdG8gZGVzdHJveSBpbnN0YW5jZSBhbmQgYWxsIHRoZSBldmVudHMgZmlyZWQsXG5cdFx0XHRcdFx0XHRcdFx0Ly8gYW5kIGNyZWF0ZSBuZXcgb25lXG5cdFx0XHRcdFx0XHRcdFx0ZmJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmYkRpdik7XG5cdFx0XHRcdFx0XHRcdFx0Y3JlYXRlRmFjZWJvb2tFbWJlZCh1cmwsIG9wdGlvbnMuZmFjZWJvb2spO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVGhpcyBtZXRob2QgcmVsb2FkcyB2aWRlbyBvbi1kZW1hbmRcblx0XHRcdFx0XHRcdFx0XHRGQi5YRkJNTC5wYXJzZSgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdGZiQXBpLnNlZWsodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZiQXBpLm11dGUoKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmJBcGkudW5tdXRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGZiV3JhcHBlcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuc2V0Vm9sdW1lKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmYWNlYm9vayAnICsgZmJXcmFwcGVyLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSAgPT4ge1xuXG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBuYXRpdmUgSFRNTE1lZGlhRWxlbWVudFxuXHRcdFx0XHRmYldyYXBwZXJbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZmJBcGkgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRE8gbWV0aG9kXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG1ldGhvZE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGxheSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0ICogRGlzcGF0Y2ggYSBsaXN0IG9mIGV2ZW50c1xuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBldmVudHNcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBzZW5kRXZlbnRzIChldmVudHMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBldmVudCA9IG1lanMuVXRpbHMuY3JlYXRlRXZlbnQoZXZlbnRzW2ldLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlIGEgbmV3IEZhY2Vib29rIHBsYXllciBhbmQgYXR0YWNoIGFsbCBpdHMgZXZlbnRzXG5cdFx0ICpcblx0XHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGEgPGRpdj4gZWxlbWVudCB0aGF0LCBvbmNlIHRoZSBBUEkgaXMgYXZhaWxhYmxlLCB3aWxsIGdlbmVyYXRlIGFuIDxpZnJhbWU+LlxuXHRcdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdFx0ICogIC0gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2pvaG5keWVyL3ZpZGVvcy8xMDEwNzgxNjI0MzY4MTg4NC9cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gY3JlYXRlRmFjZWJvb2tFbWJlZCAodXJsLCBjb25maWcpIHtcblxuXHRcdFx0c3JjID0gdXJsO1xuXG5cdFx0XHRmYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0ZmJEaXYuaWQgPSBmYldyYXBwZXIuaWQ7XG5cdFx0XHRmYkRpdi5jbGFzc05hbWUgPSBcImZiLXZpZGVvXCI7XG5cdFx0XHRmYkRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIiwgdXJsKTtcblx0XHRcdGZiRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtYWxsb3dmdWxsc2NyZWVuXCIsIFwidHJ1ZVwiKTtcblx0XHRcdGZiRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtY29udHJvbHNcIiwgXCJmYWxzZVwiKTtcblxuXHRcdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShmYkRpdiwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBSZWdpc3RlciBGYWNlYm9vayBBUEkgZXZlbnQgZ2xvYmFsbHlcblx0XHRcdCAqXG5cdFx0XHQgKi9cblx0XHRcdHdpbmRvdy5mYkFzeW5jSW5pdCA9ICgpID0+IHtcblxuXHRcdFx0XHRGQi5pbml0KGNvbmZpZyk7XG5cblx0XHRcdFx0RkIuRXZlbnQuc3Vic2NyaWJlKCd4ZmJtbC5yZWFkeScsIChtc2cpID0+IHtcblxuXHRcdFx0XHRcdGlmIChtc2cudHlwZSA9PT0gJ3ZpZGVvJykge1xuXG5cdFx0XHRcdFx0XHRmYkFwaSA9IG1zZy5pbnN0YW5jZTtcblxuXHRcdFx0XHRcdFx0Ly8gU2V0IHByb3BlciBzaXplIHNpbmNlIHBsYXllciBkaW1lbnNpb25zIGFyZSB1bmtub3duIGJlZm9yZSB0aGlzIGV2ZW50XG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0ZmJJZnJhbWUgPSBmYkRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaWZyYW1lJylbMF0sXG5cdFx0XHRcdFx0XHRcdHdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZmJJZnJhbWUsIG51bGwpLndpZHRoKSxcblx0XHRcdFx0XHRcdFx0aGVpZ2h0ID0gcGFyc2VJbnQoZmJJZnJhbWUuc3R5bGUuaGVpZ2h0KVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRmYldyYXBwZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKTtcblxuXHRcdFx0XHRcdFx0Ly8gcmVtb3ZlIHByZXZpb3VzIGxpc3RlbmVyc1xuXHRcdFx0XHRcdFx0bGV0IGZiRXZlbnRzID0gWydzdGFydGVkUGxheWluZycsICdwYXVzZWQnLCAnZmluaXNoZWRQbGF5aW5nJywgJ3N0YXJ0ZWRCdWZmZXJpbmcnLCAnZmluaXNoZWRCdWZmZXJpbmcnXTtcblx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gZmJFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0XHRldmVudCA9IGZiRXZlbnRzW2ldLFxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZXIgPSBldmVudEhhbmRsZXJbZXZlbnRdXG5cdFx0XHRcdFx0XHRcdDtcblx0XHRcdFx0XHRcdFx0aWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCAmJiBoYW5kbGVyICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHRcdFx0IWlzT2JqZWN0RW1wdHkoaGFuZGxlcikgJiYgdHlwZW9mIGhhbmRsZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVyLnJlbW92ZUxpc3RlbmVyKGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRcdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YFxuXHRcdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmYldyYXBwZXJbYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmYldyYXBwZXJbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydyZW5kZXJlcnJlYWR5JywgJ3JlYWR5JywgJ2xvYWRlZGRhdGEnLCAnY2FucGxheScsICdwcm9ncmVzcyddKTtcblx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydsb2FkZWRtZXRhZGF0YScsICd0aW1ldXBkYXRlJywgJ3Byb2dyZXNzJ10pO1xuXG5cdFx0XHRcdFx0XHRsZXQgdGltZXI7XG5cblx0XHRcdFx0XHRcdC8vIEN1c3RvbSBGYWNlYm9vayBldmVudHNcblx0XHRcdFx0XHRcdGV2ZW50SGFuZGxlci5zdGFydGVkUGxheWluZyA9IGZiQXBpLnN1YnNjcmliZSgnc3RhcnRlZFBsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICghaGFzU3RhcnRlZFBsYXlpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRoYXNTdGFydGVkUGxheWluZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydwbGF5JywgJ3BsYXlpbmcnLCAndGltZXVwZGF0ZSddKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXb3JrYXJvdW5kIHRvIHVwZGF0ZSBwcm9ncmVzcyBiYXJcblx0XHRcdFx0XHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3RpbWV1cGRhdGUnXSk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGV2ZW50SGFuZGxlci5wYXVzZWQgPSBmYkFwaS5zdWJzY3JpYmUoJ3BhdXNlZCcsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3BhdXNlZCddKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLmZpbmlzaGVkUGxheWluZyA9IGZiQXBpLnN1YnNjcmliZSgnZmluaXNoZWRQbGF5aW5nJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRlbmRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gV29ya2Fyb3VuZCB0byB1cGRhdGUgcHJvZ3Jlc3MgYmFyIG9uZSBsYXN0IHRpbWUgYW5kIHRyaWdnZXIgZW5kZWQgZXZlbnRcblx0XHRcdFx0XHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3RpbWV1cGRhdGUnLCAnZW5kZWQnXSk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cblx0XHRcdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLnN0YXJ0ZWRCdWZmZXJpbmcgPSBmYkFwaS5zdWJzY3JpYmUoJ3N0YXJ0ZWRCdWZmZXJpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydwcm9ncmVzcycsICd0aW1ldXBkYXRlJ10pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRldmVudEhhbmRsZXIuZmluaXNoZWRCdWZmZXJpbmcgPSBmYkFwaS5zdWJzY3JpYmUoJ2ZpbmlzaGVkQnVmZmVyaW5nJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsncHJvZ3Jlc3MnLCAndGltZXVwZGF0ZSddKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0KCgoZCwgcywgaWQpID0+IHtcblx0XHRcdFx0bGV0IGpzO1xuXHRcdFx0XHRsZXQgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcblx0XHRcdFx0aWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xuXHRcdFx0XHRqcy5pZCA9IGlkO1xuXHRcdFx0XHRqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanMnO1xuXHRcdFx0XHRmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG5cdFx0XHR9KShkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcblx0XHR9XG5cblx0XHRpZiAobWVkaWFGaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjcmVhdGVGYWNlYm9va0VtYmVkKG1lZGlhRmlsZXNbMF0uc3JjLCBmYldyYXBwZXIub3B0aW9ucy5mYWNlYm9vayk7XG5cdFx0fVxuXG5cdFx0ZmJXcmFwcGVyLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRmYldyYXBwZXIuc3RvcEludGVydmFsKCk7XG5cdFx0XHRmYldyYXBwZXIucGF1c2UoKTtcblx0XHRcdGlmIChmYkRpdikge1xuXHRcdFx0XHRmYkRpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoZmJEaXYpIHtcblx0XHRcdFx0ZmJEaXYuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0aWYgKGZiQXBpICE9PSBudWxsICYmICFpc05hTih3aWR0aCkgJiYgIWlzTmFOKGhlaWdodCkpIHtcblx0XHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcblx0XHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuaW50ZXJ2YWwgPSBudWxsO1xuXG5cdFx0ZmJXcmFwcGVyLnN0YXJ0SW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHQvLyBjcmVhdGUgdGltZXJcblx0XHRcdGZiV3JhcHBlci5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9LCAyNTApO1xuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnN0b3BJbnRlcnZhbCA9ICgpID0+IHtcblx0XHRcdGlmIChmYldyYXBwZXIuaW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChmYldyYXBwZXIuaW50ZXJ2YWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZmJXcmFwcGVyO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIEZhY2Vib29rIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy8vd3d3LmZhY2Vib29rJykgPyAndmlkZW8veC1mYWNlYm9vaycgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZChGYWNlYm9va1JlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHtOQVYsIElTX0lFLCBIQVNfTVNFLCBTVVBQT1JUU19OQVRJVkVfSExTfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHt0eXBlQ2hlY2tzLCBhYnNvbHV0aXplVXJsfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogU2hpbSB0aGF0IGZhbGxzIGJhY2sgdG8gRmxhc2ggaWYgYSBtZWRpYSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKlxuICogQW55IGZvcm1hdCBub3Qgc3VwcG9ydGVkIG5hdGl2ZWx5LCBpbmNsdWRpbmcsIFJUTVAsIEZMViwgSExTIGFuZCBNKFBFRyktREFTSCAoaWYgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IE1TRSksXG4gKiB3aWxsIHBsYXkgdXNpbmcgRmxhc2guXG4gKi9cblxuXG4vKipcbiAqIENvcmUgZGV0ZWN0b3IsIHBsdWdpbnMgYXJlIGFkZGVkIGJlbG93XG4gKlxuICovXG5leHBvcnQgY29uc3QgUGx1Z2luRGV0ZWN0b3IgPSB7XG5cdC8qKlxuXHQgKiBDYWNoZWQgdmVyc2lvbiBudW1iZXJzXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHBsdWdpbnM6IFtdLFxuXG5cdC8qKlxuXHQgKiBUZXN0IGEgcGx1Z2luIHZlcnNpb24gbnVtYmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwbHVnaW4gLSBJbiB0aGlzIHNjZW5hcmlvICdmbGFzaCcgd2lsbCBiZSB0ZXN0ZWRcblx0ICogQHBhcmFtIHtBcnJheX0gdiAtIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZlcnNpb24gdXAgdG8gMyBudW1iZXJzIChtYWpvciwgbWlub3IsIHJldmlzaW9uKVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0aGFzUGx1Z2luVmVyc2lvbjogKHBsdWdpbiwgdikgPT4ge1xuXHRcdGxldCBwdiA9IFBsdWdpbkRldGVjdG9yLnBsdWdpbnNbcGx1Z2luXTtcblx0XHR2WzFdID0gdlsxXSB8fCAwO1xuXHRcdHZbMl0gPSB2WzJdIHx8IDA7XG5cdFx0cmV0dXJuIChwdlswXSA+IHZbMF0gfHwgKHB2WzBdID09PSB2WzBdICYmIHB2WzFdID4gdlsxXSkgfHwgKHB2WzBdID09PSB2WzBdICYmIHB2WzFdID09PSB2WzFdICYmIHB2WzJdID49IHZbMl0pKTtcblx0fSxcblxuXHQvKipcblx0ICogRGV0ZWN0IHBsdWdpbiBhbmQgc3RvcmUgaXRzIHZlcnNpb24gbnVtYmVyXG5cdCAqXG5cdCAqIEBzZWUgUGx1Z2luRGV0ZWN0b3IuZGV0ZWN0UGx1Z2luXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwbHVnaW5OYW1lXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lVHlwZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gYWN0aXZlWFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBheERldGVjdFxuXHQgKi9cblx0YWRkUGx1Z2luOiAocCwgcGx1Z2luTmFtZSwgbWltZVR5cGUsIGFjdGl2ZVgsIGF4RGV0ZWN0KSA9PiB7XG5cdFx0UGx1Z2luRGV0ZWN0b3IucGx1Z2luc1twXSA9IFBsdWdpbkRldGVjdG9yLmRldGVjdFBsdWdpbihwbHVnaW5OYW1lLCBtaW1lVHlwZSwgYWN0aXZlWCwgYXhEZXRlY3QpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBPYnRhaW4gdmVyc2lvbiBudW1iZXIgZnJvbSB0aGUgbWltZS10eXBlIChhbGwgYnV0IElFKSBvciBBY3RpdmVYIChJRSlcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHBsdWdpbk5hbWVcblx0ICogQHBhcmFtIHtTdHJpbmd9IG1pbWVUeXBlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBhY3RpdmVYXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGF4RGV0ZWN0XG5cdCAqIEByZXR1cm4ge2ludFtdfVxuXHQgKi9cblx0ZGV0ZWN0UGx1Z2luOiAocGx1Z2luTmFtZSwgbWltZVR5cGUsIGFjdGl2ZVgsIGF4RGV0ZWN0KSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdHZlcnNpb24gPSBbMCwgMCwgMF0sXG5cdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdGF4XG5cdFx0O1xuXG5cdFx0Ly8gRmlyZWZveCwgV2Via2l0LCBPcGVyYVxuXHRcdGlmIChOQVYucGx1Z2lucyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBOQVYucGx1Z2luc1twbHVnaW5OYW1lXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGRlc2NyaXB0aW9uID0gTkFWLnBsdWdpbnNbcGx1Z2luTmFtZV0uZGVzY3JpcHRpb247XG5cdFx0XHRpZiAoZGVzY3JpcHRpb24gJiYgISh0eXBlb2YgTkFWLm1pbWVUeXBlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgTkFWLm1pbWVUeXBlc1ttaW1lVHlwZV0gJiYgIU5BVi5taW1lVHlwZXNbbWltZVR5cGVdLmVuYWJsZWRQbHVnaW4pKSB7XG5cdFx0XHRcdHZlcnNpb24gPSBkZXNjcmlwdGlvbi5yZXBsYWNlKHBsdWdpbk5hbWUsICcnKS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXHNyL2dpLCAnLicpLnNwbGl0KCcuJyk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZlcnNpb25baV0gPSBwYXJzZUludCh2ZXJzaW9uW2ldLm1hdGNoKC9cXGQrLyksIDEwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgLyBBY3RpdmVYXG5cdFx0fSBlbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRheCA9IG5ldyBBY3RpdmVYT2JqZWN0KGFjdGl2ZVgpO1xuXHRcdFx0XHRpZiAoYXgpIHtcblx0XHRcdFx0XHR2ZXJzaW9uID0gYXhEZXRlY3QoYXgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmVyc2lvbjtcblx0fVxufTtcblxuLyoqXG4gKiBBZGQgRmxhc2ggZGV0ZWN0aW9uXG4gKlxuICovXG5QbHVnaW5EZXRlY3Rvci5hZGRQbHVnaW4oJ2ZsYXNoJywgJ1Nob2Nrd2F2ZSBGbGFzaCcsICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCcsICdTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaCcsIChheCkgPT4ge1xuXHQvLyBhZGFwdGVkIGZyb20gU1dGT2JqZWN0XG5cdGxldCB2ZXJzaW9uID0gW10sXG5cdFx0ZCA9IGF4LkdldFZhcmlhYmxlKFwiJHZlcnNpb25cIik7XG5cdGlmIChkKSB7XG5cdFx0ZCA9IGQuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiLFwiKTtcblx0XHR2ZXJzaW9uID0gW3BhcnNlSW50KGRbMF0sIDEwKSwgcGFyc2VJbnQoZFsxXSwgMTApLCBwYXJzZUludChkWzJdLCAxMCldO1xuXHR9XG5cdHJldHVybiB2ZXJzaW9uO1xufSk7XG5cbmNvbnN0IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIgPSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdGZsYXNoID0ge30sXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyBzdG9yZSBtYWluIHZhcmlhYmxlXG5cdFx0Zmxhc2gub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0Zmxhc2guaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBmbGFzaC5vcHRpb25zLnByZWZpeDtcblx0XHRmbGFzaC5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBpbnNlcnQgZGF0YVxuXHRcdGZsYXNoLmZsYXNoU3RhdGUgPSB7fTtcblx0XHRmbGFzaC5mbGFzaEFwaSA9IG51bGw7XG5cdFx0Zmxhc2guZmxhc2hBcGlTdGFjayA9IFtdO1xuXG5cdFx0Ly8gbWVkaWFFbGVtZW50cyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGZsYXNoIHN0YXRlIHRoYXQgd2Ugd2lsbCBzdG9yZVxuXHRcdFx0XHRmbGFzaC5mbGFzaFN0YXRlW3Byb3BOYW1lXSA9IG51bGw7XG5cblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0Zmxhc2hbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlbJ2dldF8nICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gZmxhc2guZmxhc2hBcGlbJ2dldF8nICsgcHJvcE5hbWVdKCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gc3BlY2lhbCBjYXNlIGZvciBidWZmZXJlZCB0byBjb25mb3JtIHRvIEhUTUw1J3MgbmV3ZXN0XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ2J1ZmZlcmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGxlbmd0aDogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmxhc2hbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3NyYycpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gYWJzb2x1dGl6ZVVybCh2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gc2VuZCB2YWx1ZSB0byBGbGFzaFxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCAmJiBmbGFzaC5mbGFzaEFwaVsnc2V0XycgKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlbJ3NldF8nICsgcHJvcE5hbWVdKHZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlTdGFjay5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ3NldCcsXG5cdFx0XHRcdFx0XHRcdHByb3BOYW1lOiBwcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgbWVkaWFFbGVtZW50cyBmb3IgbmF0aXZlIG1ldGhvZHNcblx0XHRsZXRcblx0XHRcdG1ldGhvZHMgPSBtZWpzLmh0bWw1bWVkaWEubWV0aG9kcyxcblx0XHRcdGFzc2lnbk1ldGhvZHMgPSAobWV0aG9kTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBuYXRpdmUgSFRNTE1lZGlhRWxlbWVudFxuXHRcdFx0XHRmbGFzaFttZXRob2ROYW1lXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBzZW5kIGNhbGwgdXAgdG8gRmxhc2ggRXh0ZXJuYWxJbnRlcmZhY2UgQVBJXG5cdFx0XHRcdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlbYGZpcmVfJHttZXRob2ROYW1lfWBdKSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlbYGZpcmVfJHttZXRob2ROYW1lfWBdKCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZmxhc2gnLCAnbWlzc2luZyBtZXRob2QnLCBtZXRob2ROYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlTdGFjay5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ2NhbGwnLFxuXHRcdFx0XHRcdFx0XHRtZXRob2ROYW1lOiBtZXRob2ROYW1lXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHRcdDtcblx0XHRtZXRob2RzLnB1c2goJ3N0b3AnKTtcblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgYSByZWFkeSBtZXRob2QgdGhhdCBGbGFzaCBjYW4gY2FsbCB0b1xuXHRcdHdpbmRvd1tgX19yZWFkeV9fJHtmbGFzaC5pZH1gXSA9ICgpID0+IHtcblxuXHRcdFx0Zmxhc2guZmxhc2hSZWFkeSA9IHRydWU7XG5cdFx0XHRmbGFzaC5mbGFzaEFwaSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBfXyR7Zmxhc2guaWR9YCk7XG5cblx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdyZW5kZXJlcnJlYWR5JywgZmxhc2gpO1xuXHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gZmxhc2guZmxhc2hBcGlTdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gZmxhc2guZmxhc2hBcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRmbGFzaFtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRmbGFzaFtzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2luZG93W2BfX2V2ZW50X18ke2ZsYXNoLmlkfWBdID0gKGV2ZW50TmFtZSwgbWVzc2FnZSkgPT4ge1xuXG5cdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudE5hbWUsIGZsYXNoKTtcblx0XHRcdGV2ZW50Lm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuXG5cdFx0XHQvLyBzZW5kIGV2ZW50IGZyb20gRmxhc2ggdXAgdG8gdGhlIG1lZGlhRWxlbWVudFxuXHRcdFx0Zmxhc2gubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdH07XG5cblx0XHQvLyBpbnNlcnQgRmxhc2ggb2JqZWN0XG5cdFx0Zmxhc2guZmxhc2hXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRsZXRcblx0XHRcdGF1dG9wbGF5ID0gISFtZWRpYUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpLFxuXHRcdFx0Zmxhc2hWYXJzID0gW2B1aWQ9JHtmbGFzaC5pZH1gLCBgYXV0b3BsYXk9JHthdXRvcGxheX1gXSxcblx0XHRcdGlzVmlkZW8gPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsICYmIG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndmlkZW8nLFxuXHRcdFx0Zmxhc2hIZWlnaHQgPSAoaXNWaWRlbykgPyBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmhlaWdodCA6IDEsXG5cdFx0XHRmbGFzaFdpZHRoID0gKGlzVmlkZW8pID8gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS53aWR0aCA6IDE7XG5cblx0XHRpZiAoZmxhc2gub3B0aW9ucy5lbmFibGVQc2V1ZG9TdHJlYW1pbmcgPT09IHRydWUpIHtcblx0XHRcdGZsYXNoVmFycy5wdXNoKGBwc2V1ZG9zdHJlYW1zdGFydD0ke2ZsYXNoLm9wdGlvbnMucHNldWRvU3RyZWFtaW5nU3RhcnRRdWVyeVBhcmFtfWApO1xuXHRcdFx0Zmxhc2hWYXJzLnB1c2goYHBzZXVkb3N0cmVhbXR5cGU9JHtmbGFzaC5vcHRpb25zLnBzZXVkb1N0cmVhbWluZ1R5cGV9YCk7XG5cdFx0fVxuXG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKGZsYXNoLmZsYXNoV3JhcHBlcik7XG5cblx0XHRpZiAoaXNWaWRlbyAmJiBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsKSB7XG5cdFx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0bGV0IHNldHRpbmdzID0gW107XG5cblx0XHRpZiAoSVNfSUUpIHtcblx0XHRcdGxldCBzcGVjaWFsSUVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGZsYXNoLmZsYXNoV3JhcHBlci5hcHBlbmRDaGlsZChzcGVjaWFsSUVDb250YWluZXIpO1xuXG5cdFx0XHRzZXR0aW5ncyA9IFtcblx0XHRcdFx0J2NsYXNzaWQ9XCJjbHNpZDpEMjdDREI2RS1BRTZELTExY2YtOTZCOC00NDQ1NTM1NDAwMDBcIicsXG5cdFx0XHRcdCdjb2RlYmFzZT1cIi8vZG93bmxvYWQubWFjcm9tZWRpYS5jb20vcHViL3Nob2Nrd2F2ZS9jYWJzL2ZsYXNoL3N3Zmxhc2guY2FiXCInLFxuXHRcdFx0XHRgaWQ9XCJfXyR7Zmxhc2guaWQgfVwiYCxcblx0XHRcdFx0YHdpZHRoPVwiJHtmbGFzaFdpZHRofVwiYCxcblx0XHRcdFx0YGhlaWdodD1cIiR7Zmxhc2hIZWlnaHR9XCJgXG5cdFx0XHRdO1xuXG5cdFx0XHRpZiAoIWlzVmlkZW8pIHtcblx0XHRcdFx0c2V0dGluZ3MucHVzaCgnc3R5bGU9XCJjbGlwOiByZWN0KDAgMCAwIDApOyBwb3NpdGlvbjogYWJzb2x1dGU7XCInKTtcblx0XHRcdH1cblxuXHRcdFx0c3BlY2lhbElFQ29udGFpbmVyLm91dGVySFRNTCA9IGA8b2JqZWN0ICR7c2V0dGluZ3Muam9pbignICcpfT5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwibW92aWVcIiB2YWx1ZT1cIiR7Zmxhc2gub3B0aW9ucy5wbHVnaW5QYXRofSR7Zmxhc2gub3B0aW9ucy5maWxlbmFtZX0/eD0ke25ldyBEYXRlKCl9XCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwiZmxhc2h2YXJzXCIgdmFsdWU9XCIke2ZsYXNoVmFycy5qb2luKCcmYW1wOycpfVwiIC8+YCArXG5cdFx0XHRcdGA8cGFyYW0gbmFtZT1cInF1YWxpdHlcIiB2YWx1ZT1cImhpZ2hcIiAvPmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJiZ2NvbG9yXCIgdmFsdWU9XCIjMDAwMDAwXCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwid21vZGVcIiB2YWx1ZT1cInRyYW5zcGFyZW50XCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwiYWxsb3dTY3JpcHRBY2Nlc3NcIiB2YWx1ZT1cImFsd2F5c1wiIC8+YCArXG5cdFx0XHRcdGA8cGFyYW0gbmFtZT1cImFsbG93RnVsbFNjcmVlblwiIHZhbHVlPVwidHJ1ZVwiIC8+YCArXG5cdFx0XHRcdGA8ZGl2PiR7aTE4bi50KCdtZWpzLmluc3RhbGwtZmxhc2gnKX08L2Rpdj5gICtcblx0XHRcdGA8L29iamVjdD5gO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0c2V0dGluZ3MgPSBbXG5cdFx0XHRcdGBpZD1cIl9fJHtmbGFzaC5pZH1cImAsXG5cdFx0XHRcdGBuYW1lPVwiX18ke2ZsYXNoLmlkfVwiYCxcblx0XHRcdFx0J3BsYXk9XCJ0cnVlXCInLFxuXHRcdFx0XHQnbG9vcD1cImZhbHNlXCInLFxuXHRcdFx0XHQncXVhbGl0eT1cImhpZ2hcIicsXG5cdFx0XHRcdCdiZ2NvbG9yPVwiIzAwMDAwMFwiJyxcblx0XHRcdFx0J3dtb2RlPVwidHJhbnNwYXJlbnRcIicsXG5cdFx0XHRcdCdhbGxvd1NjcmlwdEFjY2Vzcz1cImFsd2F5c1wiJyxcblx0XHRcdFx0J2FsbG93RnVsbFNjcmVlbj1cInRydWVcIicsXG5cdFx0XHRcdCd0eXBlPVwiYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2hcIicsXG5cdFx0XHRcdCdwbHVnaW5zcGFnZT1cIi8vd3d3Lm1hY3JvbWVkaWEuY29tL2dvL2dldGZsYXNocGxheWVyXCInLFxuXHRcdFx0XHRgc3JjPVwiJHtmbGFzaC5vcHRpb25zLnBsdWdpblBhdGh9JHtmbGFzaC5vcHRpb25zLmZpbGVuYW1lfVwiYCxcblx0XHRcdFx0YGZsYXNodmFycz1cIiR7Zmxhc2hWYXJzLmpvaW4oJyYnKX1cImAsXG5cdFx0XHRcdGB3aWR0aD1cIiR7Zmxhc2hXaWR0aH1cImAsXG5cdFx0XHRcdGBoZWlnaHQ9XCIke2ZsYXNoSGVpZ2h0fVwiYFxuXHRcdFx0XTtcblxuXHRcdFx0aWYgKCFpc1ZpZGVvKSB7XG5cdFx0XHRcdHNldHRpbmdzLnB1c2goJ3N0eWxlPVwiY2xpcDogcmVjdCgwIDAgMCAwKTsgcG9zaXRpb246IGFic29sdXRlO1wiJyk7XG5cdFx0XHR9XG5cblx0XHRcdGZsYXNoLmZsYXNoV3JhcHBlci5pbm5lckhUTUwgPSBgPGVtYmVkICR7c2V0dGluZ3Muam9pbignICcpfT5gO1xuXHRcdH1cblxuXHRcdGZsYXNoLmZsYXNoTm9kZSA9IGZsYXNoLmZsYXNoV3JhcHBlci5sYXN0Q2hpbGQ7XG5cblx0XHRmbGFzaC5oaWRlID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzVmlkZW8pIHtcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLndpZHRoID0gJzFweCc7XG5cdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5oZWlnaHQgPSAnMXB4Jztcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUuY2xpcCA9ICdyZWN0KDAgMCAwIDApOyc7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Zmxhc2guc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmIChpc1ZpZGVvKSB7XG5cdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuXHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUud2lkdGggPSAnJztcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLmhlaWdodCA9ICcnO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5jbGlwID0gJyc7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Zmxhc2guc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0aWYgKGZsYXNoLmZsYXNoQXBpICE9PSBudWxsKSB7XG5cdFx0XHRcdGZsYXNoLmZsYXNoQXBpLmZpcmVfc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRmbGFzaC5zZXRTcmMobWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGZsYXNoLmxvYWQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmbGFzaDtcblx0fVxufTtcblxuY29uc3QgaGFzRmxhc2ggPSBQbHVnaW5EZXRlY3Rvci5oYXNQbHVnaW5WZXJzaW9uKCdmbGFzaCcsIFsxMCwgMCwgMF0pO1xuXG5pZiAoaGFzRmxhc2gpIHtcblxuXHQvKipcblx0ICogUmVnaXN0ZXIgbWVkaWEgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlIGlmIEZsYXNoIGlzIGRldGVjdGVkXG5cdCAqXG5cdCAqL1xuXHR0eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXG5cdFx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAodXJsLnN0YXJ0c1dpdGgoJ3J0bXAnKSkge1xuXHRcdFx0aWYgKHVybC5pbmNsdWRlcygnLm1wMycpKSB7XG5cdFx0XHRcdHJldHVybiAnYXVkaW8vcnRtcCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gJ3ZpZGVvL3J0bXAnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodXJsLmluY2x1ZGVzKCcub2dhJykgfHwgdXJsLmluY2x1ZGVzKCcub2dnJykpIHtcblx0XHRcdHJldHVybiAnYXVkaW8vb2dnJztcblx0XHR9IGVsc2UgaWYgKCFIQVNfTVNFICYmICFTVVBQT1JUU19OQVRJVkVfSExTICYmIHVybC5pbmNsdWRlcygnLm0zdTgnKSkge1xuXHRcdFx0cmV0dXJuICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnO1xuXHRcdH0gZWxzZSBpZiAoIUhBU19NU0UgJiYgdXJsLmluY2x1ZGVzKCcubXBkJykpIHtcblx0XHRcdHJldHVybiAnYXBwbGljYXRpb24vZGFzaCt4bWwnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFZJREVPXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50VmlkZW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfdmlkZW8nLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfdmlkZW8nLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtdmlkZW8uc3dmJyxcblx0XHRcdGVuYWJsZVBzZXVkb1N0cmVhbWluZzogZmFsc2UsXG5cdFx0XHQvLyBzdGFydCBxdWVyeSBwYXJhbWV0ZXIgc2VudCB0byBzZXJ2ZXIgZm9yIHBzZXVkby1zdHJlYW1pbmdcblx0XHRcdHBzZXVkb1N0cmVhbWluZ1N0YXJ0UXVlcnlQYXJhbTogJ3N0YXJ0Jyxcblx0XHRcdC8vIHBzZXVkbyBzdHJlYW1pbmcgdHlwZTogdXNlIGB0aW1lYCBmb3IgdGltZSBiYXNlZCBzZWVraW5nIChNUDQpIG9yIGBieXRlYCBmb3IgZmlsZSBieXRlIHBvc2l0aW9uIChGTFYpXG5cdFx0XHRwc2V1ZG9TdHJlYW1pbmdUeXBlOiAnYnl0ZSdcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IGhhc0ZsYXNoICYmIFsndmlkZW8vbXA0JywgJ3ZpZGVvL2ZsdicsICd2aWRlby9ydG1wJywgJ2F1ZGlvL3J0bXAnLCAncnRtcC9tcDQnLCAnYXVkaW8vbXA0J10uaW5jbHVkZXModHlwZSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cblx0fTtcblx0cmVuZGVyZXIuYWRkKEZsYXNoTWVkaWFFbGVtZW50VmlkZW9SZW5kZXJlcik7XG5cblx0Ly8gSExTXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50SGxzVmlkZW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfaGxzJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2hscycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC12aWRlby1obHMuc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gIUhBU19NU0UgJiYgaGFzRmxhc2ggJiYgWydhcHBsaWNhdGlvbi94LW1wZWd1cmwnLCAndm5kLmFwcGxlLm1wZWd1cmwnLCAnYXVkaW8vbXBlZ3VybCcsICdhdWRpby9obHMnLFxuXHRcdFx0J3ZpZGVvL2hscyddLmluY2x1ZGVzKHR5cGUudG9Mb3dlckNhc2UoKSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cdH07XG5cdHJlbmRlcmVyLmFkZChGbGFzaE1lZGlhRWxlbWVudEhsc1ZpZGVvUmVuZGVyZXIpO1xuXG5cdC8vIE0oUEVHKS1EQVNIXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50TWRhc2hWaWRlb1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF9kYXNoJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2Rhc2gnLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtdmlkZW8tbWRhc2guc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gIUhBU19NU0UgJiYgaGFzRmxhc2ggJiYgWydhcHBsaWNhdGlvbi9kYXNoK3htbCddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdFx0Y3JlYXRlOiBGbGFzaE1lZGlhRWxlbWVudFJlbmRlcmVyLmNyZWF0ZVxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRNZGFzaFZpZGVvUmVuZGVyZXIpO1xuXG5cdC8vIEFVRElPXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50QXVkaW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfYXVkaW8nLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfYXVkaW8nLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtYXVkaW8uc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gaGFzRmxhc2ggJiYgWydhdWRpby9tcDMnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHRcdGNyZWF0ZTogRmxhc2hNZWRpYUVsZW1lbnRSZW5kZXJlci5jcmVhdGVcblx0fTtcblx0cmVuZGVyZXIuYWRkKEZsYXNoTWVkaWFFbGVtZW50QXVkaW9SZW5kZXJlcik7XG5cblx0Ly8gQVVESU8gLSBvZ2dcblx0bGV0IEZsYXNoTWVkaWFFbGVtZW50QXVkaW9PZ2dSZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfYXVkaW9fb2dnJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2F1ZGlvX29nZycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC1hdWRpby1vZ2cuc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gaGFzRmxhc2ggJiYgWydhdWRpby9vZ2cnLCAnYXVkaW8vb2dhJywgJ2F1ZGlvL29ndiddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdFx0Y3JlYXRlOiBGbGFzaE1lZGlhRWxlbWVudFJlbmRlcmVyLmNyZWF0ZVxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRBdWRpb09nZ1JlbmRlcmVyKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge0hBU19NU0V9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBOYXRpdmUgRkxWIHJlbmRlcmVyXG4gKlxuICogVXNlcyBmbHYuanMsIHdoaWNoIGlzIGEgSmF2YVNjcmlwdCBsaWJyYXJ5IHdoaWNoIGltcGxlbWVudHMgbWVjaGFuaXNtcyB0byBwbGF5IGZsdiBmaWxlcyBpbnNwaXJlZCBieSBmbHYuanMuXG4gKiBJdCByZWxpZXMgb24gSFRNTDUgdmlkZW8gYW5kIE1lZGlhU291cmNlIEV4dGVuc2lvbnMgZm9yIHBsYXliYWNrLlxuICogQ3VycmVudGx5LCBpdCBjYW4gb25seSBwbGF5IGZpbGVzIHdpdGggdGhlIHNhbWUgb3JpZ2luLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0JpbGliaWxpL2Zsdi5qc1xuICpcbiAqL1xuY29uc3QgTmF0aXZlRmx2ID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0Y3JlYXRpb25RdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGxvYWRpbmcgb2YgYW4gRkxWIHNvdXJjZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gbG9hZCBhbiBGTFYgcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVGbHYuaXNMb2FkZWQpIHtcblx0XHRcdE5hdGl2ZUZsdi5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE5hdGl2ZUZsdi5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZUZsdi5jcmVhdGlvblF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBmbHYuanMgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEZMViBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlRmx2LmlzTWVkaWFTdGFydGVkKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgZmx2anMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdE5hdGl2ZUZsdi5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA9IHR5cGVvZiBzZXR0aW5ncy5vcHRpb25zLnBhdGggPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggOiAnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZmx2LmpzLzEuMS4wL2Zsdi5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlRmx2Lm1lZGlhUmVhZHkoKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR9XG5cdFx0XHROYXRpdmVGbHYuaXNNZWRpYVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBGTFYgcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cdFx0TmF0aXZlRmx2LmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVGbHYuaXNNZWRpYUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoTmF0aXZlRmx2LmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlRmx2LmNyZWF0aW9uUXVldWUucG9wKCk7XG5cdFx0XHROYXRpdmVGbHYuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEZMViBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgRkxWIG9iamVjdFxuXHQgKi9cblx0Y3JlYXRlSW5zdGFuY2U6IChzZXR0aW5ncykgPT4ge1xuXHRcdGxldCBwbGF5ZXIgPSBmbHZqcy5jcmVhdGVQbGF5ZXIoc2V0dGluZ3Mub3B0aW9ucyk7XG5cdFx0d2luZG93W2BfX3JlYWR5X18ke3NldHRpbmdzLmlkfWBdKHBsYXllcik7XG5cdH1cbn07XG5cbmNvbnN0IEZsdk5hdGl2ZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAnbmF0aXZlX2ZsdicsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ25hdGl2ZV9mbHYnLFxuXHRcdC8qKlxuXHRcdCAqIEN1c3RvbSBjb25maWd1cmF0aW9uIGZvciBGTFYgcGxheWVyXG5cdFx0ICpcblx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9CaWxpYmlsaS9mbHYuanMvYmxvYi9tYXN0ZXIvZG9jcy9hcGkubWQjY29uZmlnXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHRmbHY6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgZmx2LmpzIGxpYnJhcnlcblx0XHRcdHBhdGg6ICcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mbHYuanMvMS4xLjAvZmx2Lm1pbi5qcycsXG5cdFx0XHRjb3JzOiB0cnVlLFxuXHRcdFx0ZW5hYmxlV29ya2VyOiBmYWxzZSxcblx0XHRcdGVuYWJsZVN0YXNoQnVmZmVyOiB0cnVlLFxuXHRcdFx0c3Rhc2hJbml0aWFsU2l6ZTogdW5kZWZpbmVkLFxuXHRcdFx0aXNMaXZlOiBmYWxzZSxcblx0XHRcdGxhenlMb2FkOiB0cnVlLFxuXHRcdFx0bGF6eUxvYWRNYXhEdXJhdGlvbjogMyAqIDYwLFxuXHRcdFx0ZGVmZXJMb2FkQWZ0ZXJTb3VyY2VPcGVuOiB0cnVlLFxuXHRcdFx0c3RhdGlzdGljc0luZm9SZXBvcnRJbnRlcnZhbDogNjAwLFxuXHRcdFx0YWNjdXJhdGVTZWVrOiBmYWxzZSxcblx0XHRcdHNlZWtUeXBlOiAncmFuZ2UnLCAgLy8gW3JhbmdlLCBwYXJhbSwgY3VzdG9tXVxuXHRcdFx0c2Vla1BhcmFtU3RhcnQ6ICdic3RhcnQnLFxuXHRcdFx0c2Vla1BhcmFtRW5kOiAnYmVuZCcsXG5cdFx0XHRyYW5nZUxvYWRaZXJvU3RhcnQ6IGZhbHNlLFxuXHRcdFx0Y3VzdG9tU2Vla0hhbmRsZXI6IHVuZGVmaW5lZFxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gSEFTX01TRSAmJiBbJ3ZpZGVvL3gtZmx2JywgJ3ZpZGVvL2ZsdiddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdG9yaWdpbmFsTm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUsXG5cdFx0XHRpZCA9IGAke21lZGlhRWxlbWVudC5pZH1fJHtvcHRpb25zLnByZWZpeH1gLFxuXHRcdFx0Zmx2UGxheWVyLFxuXHRcdFx0c3RhY2sgPSB7fSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdG5vZGUgPSBvcmlnaW5hbE5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG1lZGlhRWxlbWVudC5vcHRpb25zKTtcblxuXHRcdC8vIFdSQVBQRVJTIGZvciBQUk9Qc1xuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdG5vZGVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IGZsdlBsYXllciAhPT0gbnVsbCA/ICBub2RlW3Byb3BOYW1lXSA6IG51bGw7XG5cblx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGZsdlBsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bm9kZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnc3JjJykge1xuXHRcdFx0XHRcdFx0XHRmbHZQbGF5ZXIuZGV0YWNoTWVkaWFFbGVtZW50KCk7XG5cdFx0XHRcdFx0XHRcdGZsdlBsYXllci5hdHRhY2hNZWRpYUVsZW1lbnQobm9kZSk7XG5cdFx0XHRcdFx0XHRcdGZsdlBsYXllci5sb2FkKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBGTFYgZXZlbnRzXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgaWRdID0gKF9mbHZQbGF5ZXIpID0+IHtcblxuXHRcdFx0bWVkaWFFbGVtZW50LmZsdlBsYXllciA9IGZsdlBsYXllciA9IF9mbHZQbGF5ZXI7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChzdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBzdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gc3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0cHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gXG5cdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRub2RlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTXG5cdFx0XHRsZXRcblx0XHRcdFx0ZXZlbnRzID0gbWVqcy5odG1sNW1lZGlhLmV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXG5cdFx0XHRcdFx0XHRmbHZQbGF5ZXIuZGV0YWNoTWVkaWFFbGVtZW50KCk7XG5cdFx0XHRcdFx0XHRmbHZQbGF5ZXIuYXR0YWNoTWVkaWFFbGVtZW50KG5vZGUpO1xuXHRcdFx0XHRcdFx0Zmx2UGxheWVyLmxvYWQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChlLnR5cGUsIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlKTtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0O1xuXG5cdFx0XHRldmVudHMgPSBldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGFzc2lnbkV2ZW50cyhldmVudHNbaV0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdC8vIE9wdGlvbnMgdGhhdCBjYW5ub3QgYmUgb3ZlcnJpZGRlblxuXHRcdG9wdGlvbnMuZmx2LnR5cGUgPSAnZmx2Jztcblx0XHRvcHRpb25zLmZsdi51cmwgPSBub2RlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cblx0XHROYXRpdmVGbHYucHJlcGFyZVNldHRpbmdzKHtcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnMuZmx2LFxuXHRcdFx0aWQ6IGlkXG5cdFx0fSk7XG5cblx0XHQvLyBIRUxQRVIgTUVUSE9EU1xuXHRcdG5vZGUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0bm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuaGlkZSA9ICgpID0+IHtcblx0XHRcdG5vZGUucGF1c2UoKTtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRmbHZQbGF5ZXIuZGVzdHJveSgpO1xuXHRcdH07XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIE5hdGl2ZSBGTFYgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlXG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIHVybC5pbmNsdWRlcygnLmZsdicpID8gJ3ZpZGVvL2ZsdicgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZChGbHZOYXRpdmVSZW5kZXJlcik7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge0hBU19NU0V9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBOYXRpdmUgSExTIHJlbmRlcmVyXG4gKlxuICogVXNlcyBEYWlseU1vdGlvbidzIGhscy5qcywgd2hpY2ggaXMgYSBKYXZhU2NyaXB0IGxpYnJhcnkgd2hpY2ggaW1wbGVtZW50cyBhbiBIVFRQIExpdmUgU3RyZWFtaW5nIGNsaWVudC5cbiAqIEl0IHJlbGllcyBvbiBIVE1MNSB2aWRlbyBhbmQgTWVkaWFTb3VyY2UgRXh0ZW5zaW9ucyBmb3IgcGxheWJhY2suXG4gKiBUaGlzIHJlbmRlcmVyIGludGVncmF0ZXMgbmV3IGV2ZW50cyBhc3NvY2lhdGVkIHdpdGggbTN1OCBmaWxlcyB0aGUgc2FtZSB3YXkgRmxhc2ggdmVyc2lvbiBvZiBIbHMgZG9lcy5cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qc1xuICpcbiAqL1xuY29uc3QgTmF0aXZlSGxzID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0Y3JlYXRpb25RdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGxvYWRpbmcgb2YgYW4gSExTIHNvdXJjZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gbG9hZCBhbiBITFMgcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVIbHMuaXNMb2FkZWQpIHtcblx0XHRcdE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE5hdGl2ZUhscy5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZUhscy5jcmVhdGlvblF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBobHMuanMgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEhMUyBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlSGxzLmlzTWVkaWFTdGFydGVkKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgSGxzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHROYXRpdmVIbHMuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggPSB0eXBlb2Ygc2V0dGluZ3Mub3B0aW9ucy5wYXRoID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0c2V0dGluZ3Mub3B0aW9ucy5wYXRoIDogJy8vY2RuLmpzZGVsaXZyLm5ldC9obHMuanMvbGF0ZXN0L2hscy5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlSGxzLm1lZGlhUmVhZHkoKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR9XG5cdFx0XHROYXRpdmVIbHMuaXNNZWRpYVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBITFMgcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cdFx0TmF0aXZlSGxzLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVIbHMuaXNNZWRpYUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoTmF0aXZlSGxzLmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlSGxzLmNyZWF0aW9uUXVldWUucG9wKCk7XG5cdFx0XHROYXRpdmVIbHMuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEhMUyBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgSExTIG9iamVjdFxuXHQgKiBAcmV0dXJuIHtIbHN9XG5cdCAqL1xuXHRjcmVhdGVJbnN0YW5jZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0bGV0IHBsYXllciA9IG5ldyBIbHMoc2V0dGluZ3Mub3B0aW9ucyk7XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2V0dGluZ3MuaWRdKHBsYXllcik7XG5cdFx0cmV0dXJuIHBsYXllcjtcblx0fVxufTtcblxuY29uc3QgSGxzTmF0aXZlUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICduYXRpdmVfaGxzJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnbmF0aXZlX2hscycsXG5cdFx0LyoqXG5cdFx0ICogQ3VzdG9tIGNvbmZpZ3VyYXRpb24gZm9yIEhMUyBwbGF5ZXJcblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9BUEkubWQjdXNlci1jb250ZW50LWZpbmUtdHVuaW5nXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHRobHM6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgaGxzLmpzIGxpYnJhcnlcblx0XHRcdHBhdGg6ICcvL2Nkbi5qc2RlbGl2ci5uZXQvaGxzLmpzL2xhdGVzdC9obHMubWluLmpzJyxcblx0XHRcdGF1dG9TdGFydExvYWQ6IHRydWUsXG5cdFx0XHRzdGFydFBvc2l0aW9uOiAtMSxcblx0XHRcdGNhcExldmVsVG9QbGF5ZXJTaXplOiBmYWxzZSxcblx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdG1heEJ1ZmZlckxlbmd0aDogMzAsXG5cdFx0XHRtYXhNYXhCdWZmZXJMZW5ndGg6IDYwMCxcblx0XHRcdG1heEJ1ZmZlclNpemU6IDYwICogMTAwMCAqIDEwMDAsXG5cdFx0XHRtYXhCdWZmZXJIb2xlOiAwLjUsXG5cdFx0XHRtYXhTZWVrSG9sZTogMixcblx0XHRcdHNlZWtIb2xlTnVkZ2VEdXJhdGlvbjogMC4wMSxcblx0XHRcdG1heEZyYWdMb29rVXBUb2xlcmFuY2U6IDAuMixcblx0XHRcdGxpdmVTeW5jRHVyYXRpb25Db3VudDogMyxcblx0XHRcdGxpdmVNYXhMYXRlbmN5RHVyYXRpb25Db3VudDogMTAsXG5cdFx0XHRlbmFibGVXb3JrZXI6IHRydWUsXG5cdFx0XHRlbmFibGVTb2Z0d2FyZUFFUzogdHJ1ZSxcblx0XHRcdG1hbmlmZXN0TG9hZGluZ1RpbWVPdXQ6IDEwMDAwLFxuXHRcdFx0bWFuaWZlc3RMb2FkaW5nTWF4UmV0cnk6IDYsXG5cdFx0XHRtYW5pZmVzdExvYWRpbmdSZXRyeURlbGF5OiA1MDAsXG5cdFx0XHRtYW5pZmVzdExvYWRpbmdNYXhSZXRyeVRpbWVvdXQ6IDY0MDAwLFxuXHRcdFx0bGV2ZWxMb2FkaW5nVGltZU91dDogMTAwMDAsXG5cdFx0XHRsZXZlbExvYWRpbmdNYXhSZXRyeTogNixcblx0XHRcdGxldmVsTG9hZGluZ1JldHJ5RGVsYXk6IDUwMCxcblx0XHRcdGxldmVsTG9hZGluZ01heFJldHJ5VGltZW91dDogNjQwMDAsXG5cdFx0XHRmcmFnTG9hZGluZ1RpbWVPdXQ6IDIwMDAwLFxuXHRcdFx0ZnJhZ0xvYWRpbmdNYXhSZXRyeTogNixcblx0XHRcdGZyYWdMb2FkaW5nUmV0cnlEZWxheTogNTAwLFxuXHRcdFx0ZnJhZ0xvYWRpbmdNYXhSZXRyeVRpbWVvdXQ6IDY0MDAwLFxuXHRcdFx0c3RhcnRGcmFnUHJlZmVjaDogZmFsc2UsXG5cdFx0XHRhcHBlbmRFcnJvck1heFJldHJ5OiAzLFxuXHRcdFx0ZW5hYmxlQ0VBNzA4Q2FwdGlvbnM6IHRydWUsXG5cdFx0XHRzdHJldGNoU2hvcnRWaWRlb1RyYWNrOiB0cnVlLFxuXHRcdFx0Zm9yY2VLZXlGcmFtZU9uRGlzY29udGludWl0eTogdHJ1ZSxcblx0XHRcdGFickV3bWFGYXN0TGl2ZTogNS4wLFxuXHRcdFx0YWJyRXdtYVNsb3dMaXZlOiA5LjAsXG5cdFx0XHRhYnJFd21hRmFzdFZvRDogNC4wLFxuXHRcdFx0YWJyRXdtYVNsb3dWb0Q6IDE1LjAsXG5cdFx0XHRhYnJFd21hRGVmYXVsdEVzdGltYXRlOiA1MDAwMDAsXG5cdFx0XHRhYnJCYW5kV2lkdGhGYWN0b3I6IDAuOCxcblx0XHRcdGFickJhbmRXaWR0aFVwRmFjdG9yOiAwLjdcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IEhBU19NU0UgJiYgWydhcHBsaWNhdGlvbi94LW1wZWd1cmwnLCAndm5kLmFwcGxlLm1wZWd1cmwnLCAnYXVkaW8vbXBlZ3VybCcsICdhdWRpby9obHMnLFxuXHRcdCd2aWRlby9obHMnXS5pbmNsdWRlcyh0eXBlLnRvTG93ZXJDYXNlKCkpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdG9yaWdpbmFsTm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUsXG5cdFx0XHRpZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4LFxuXHRcdFx0aGxzUGxheWVyLFxuXHRcdFx0c3RhY2sgPSB7fSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdG5vZGUgPSBvcmlnaW5hbE5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG1lZGlhRWxlbWVudC5vcHRpb25zKTtcblxuXHRcdC8vIFdSQVBQRVJTIGZvciBQUk9Qc1xuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdG5vZGVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IGhsc1BsYXllciAhPT0gbnVsbCA/ICBub2RlW3Byb3BOYW1lXSA6IG51bGw7XG5cblx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGhsc1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bm9kZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnc3JjJykge1xuXG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5kZXN0cm95KCk7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllciA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllciA9IE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZSh7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogb3B0aW9ucy5obHMsXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGlkXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5hdHRhY2hNZWRpYShub2RlKTtcblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLm9uKEhscy5FdmVudHMuTUVESUFfQVRUQUNIRUQsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRobHNQbGF5ZXIubG9hZFNvdXJjZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRzdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsIG1ldGhvZCB0byByZWdpc3RlciBhbGwgSExTIGV2ZW50c1xuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIGlkXSA9IChfaGxzUGxheWVyKSA9PiB7XG5cblx0XHRcdG1lZGlhRWxlbWVudC5obHNQbGF5ZXIgPSBobHNQbGF5ZXIgPSBfaGxzUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoc3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gc3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IHN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRub2RlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTXG5cdFx0XHRsZXRcblx0XHRcdFx0ZXZlbnRzID0gbWVqcy5odG1sNW1lZGlhLmV2ZW50cywgaGxzRXZlbnRzID0gSGxzLkV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIuZGV0YWNoTWVkaWEoKTtcblxuXHRcdFx0XHRcdFx0bGV0IHVybCA9IG5vZGUuc3JjO1xuXG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIuYXR0YWNoTWVkaWEobm9kZSk7XG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIub24oaGxzRXZlbnRzLk1FRElBX0FUVEFDSEVELCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5sb2FkU291cmNlKHVybCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gY29weSBldmVudFxuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChlLnR5cGUsIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlKTtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5jb25jYXQoWydjbGljaycsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnXSk7XG5cblx0XHRcdGZvciAoaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0YXNzaWduRXZlbnRzKGV2ZW50c1tpXSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ3VzdG9tIEhMUyBldmVudHNcblx0XHRcdCAqXG5cdFx0XHQgKiBUaGVzZSBldmVudHMgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBvcmlnaW5hbCBub2RlIHVzaW5nIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHRoZSBuYW1lIG9mIHRoZSBldmVudCxcblx0XHRcdCAqIG5vdCB1c2luZyBIbHMuRXZlbnRzIG9iamVjdFxuXHRcdFx0ICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGFpbHltb3Rpb24vaGxzLmpzL2Jsb2IvbWFzdGVyL3NyYy9ldmVudHMuanNcblx0XHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9zcmMvZXJyb3JzLmpzXG5cdFx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYWlseW1vdGlvbi9obHMuanMvYmxvYi9tYXN0ZXIvQVBJLm1kI3J1bnRpbWUtZXZlbnRzXG5cdFx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYWlseW1vdGlvbi9obHMuanMvYmxvYi9tYXN0ZXIvQVBJLm1kI2Vycm9yc1xuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBhc3NpZ25IbHNFdmVudHMgPSBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLCBub2RlKTtcblx0XHRcdFx0ZXZlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRpZiAoZSA9PT0gJ2hsc0Vycm9yJykge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSwgZGF0YSk7XG5cblx0XHRcdFx0XHQvLyBib3Jyb3dlZCBmcm9tIGh0dHA6Ly9kYWlseW1vdGlvbi5naXRodWIuaW8vaGxzLmpzL2RlbW8vXG5cdFx0XHRcdFx0aWYgKGRhdGEuZmF0YWwpIHtcblx0XHRcdFx0XHRcdGhsc1BsYXllci5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAoZGF0YS50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21lZGlhRXJyb3InOlxuXHRcdFx0XHRcdFx0XHRcdGhsc1BsYXllci5yZWNvdmVyTWVkaWFFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ25ldHdvcmtFcnJvcic6XG5cdFx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLnN0YXJ0TG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGxldCBldmVudFR5cGUgaW4gaGxzRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChobHNFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuXHRcdFx0XHRcdGhsc1BsYXllci5vbihobHNFdmVudHNbZXZlbnRUeXBlXSwgYXNzaWduSGxzRXZlbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdE5hdGl2ZUhscy5wcmVwYXJlU2V0dGluZ3Moe1xuXHRcdFx0b3B0aW9uczogb3B0aW9ucy5obHMsXG5cdFx0XHRpZDogaWRcblx0XHR9KTtcblxuXHRcdC8vIEhFTFBFUiBNRVRIT0RTXG5cdFx0bm9kZS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnBhdXNlKCk7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5kZXN0cm95ID0gKCkgPT4ge1xuXHRcdFx0aGxzUGxheWVyLmRlc3Ryb3koKTtcblx0XHR9O1xuXG5cdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3JlbmRlcmVycmVhZHknLCBub2RlKTtcblx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBOYXRpdmUgSExTIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy5tM3U4JykgPyAnYXBwbGljYXRpb24veC1tcGVnVVJMJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKEhsc05hdGl2ZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge1NVUFBPUlRTX05BVElWRV9ITFMsIElTX0FORFJPSUR9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cbi8qKlxuICogTmF0aXZlIEhUTUw1IFJlbmRlcmVyXG4gKlxuICogV3JhcHMgdGhlIG5hdGl2ZSBIVE1MNSA8YXVkaW8+IG9yIDx2aWRlbz4gdGFnIGFuZCBidWJibGVzIGl0cyBwcm9wZXJ0aWVzLCBldmVudHMsIGFuZCBtZXRob2RzIHVwIHRvIHRoZSBtZWRpYUVsZW1lbnQuXG4gKi9cbmNvbnN0IEh0bWxNZWRpYUVsZW1lbnQgPSB7XG5cblx0bmFtZTogJ2h0bWw1JyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnaHRtbDUnXG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7U3RyaW5nfVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiB7XG5cblx0XHRsZXQgbWVkaWFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuXHRcdC8vIER1ZSB0byBhbiBpc3N1ZSBvbiBXZWJraXQsIGZvcmNlIHRoZSBNUDMgYW5kIE1QNCBvbiBBbmRyb2lkIGFuZCBjb25zaWRlciBuYXRpdmUgc3VwcG9ydCBmb3IgSExTXG5cdFx0aWYgKChJU19BTkRST0lEICYmIHR5cGUubWF0Y2goL1xcL21wKDN8NCkkL2dpKSAhPT0gbnVsbCkgfHxcblx0XHRcdChbJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCcsICd2bmQuYXBwbGUubXBlZ3VybCcsICdhdWRpby9tcGVndXJsJywgJ2F1ZGlvL2hscycsXG5cdFx0XHRcdCd2aWRlby9obHMnXS5pbmNsdWRlcyh0eXBlLnRvTG93ZXJDYXNlKCkpICYmIFNVUFBPUlRTX05BVElWRV9ITFMpKSB7XG5cdFx0XHRyZXR1cm4gJ3llcyc7XG5cdFx0fSBlbHNlIGlmIChtZWRpYUVsZW1lbnQuY2FuUGxheVR5cGUpIHtcblx0XHRcdHJldHVybiBtZWRpYUVsZW1lbnQuY2FuUGxheVR5cGUodHlwZSkucmVwbGFjZSgvbm8vLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdGlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXgsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyBDUkVBVEUgTk9ERVxuXHRcdGlmIChtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID09PSB1bmRlZmluZWQgfHwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9PT0gbnVsbCkge1xuXHRcdFx0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG5cdFx0XHRtZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGU7XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0Y29uc3Rcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRub2RlW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiBub2RlW3Byb3BOYW1lXTtcblxuXHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRub2RlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdGNvbnN0XG5cdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLmNvbmNhdChbJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKSxcblx0XHRcdGFzc2lnbkV2ZW50cyA9IChldmVudE5hbWUpID0+IHtcblxuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdC8vIGNvcHkgZXZlbnRcblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KGUudHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUpO1xuXHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0Ly8gZXZlbnQudGFyZ2V0ID0gZS5zcmNFbGVtZW50O1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25FdmVudHMoZXZlbnRzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBIRUxQRVIgTUVUSE9EU1xuXHRcdG5vZGUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0bm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5oaWRlID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3JlbmRlcmVycmVhZHknLCBub2RlKTtcblx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxud2luZG93Lkh0bWxNZWRpYUVsZW1lbnQgPSBtZWpzLkh0bWxNZWRpYUVsZW1lbnQgPSBIdG1sTWVkaWFFbGVtZW50O1xuXG5yZW5kZXJlci5hZGQoSHRtbE1lZGlhRWxlbWVudCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogU291bmRDbG91ZCByZW5kZXJlclxuICpcbiAqIFVzZXMgPGlmcmFtZT4gYXBwcm9hY2ggYW5kIHVzZXMgU291bmRDbG91ZCBXaWRnZXQgQVBJIHRvIG1hbmlwdWxhdGUgaXQuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5zb3VuZGNsb3VkLmNvbS9kb2NzL2FwaS9odG1sNS13aWRnZXRcbiAqL1xuY29uc3QgU291bmRDbG91ZEFwaSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0aWZyYW1lUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBjcmVhdGlvbiBvZiA8aWZyYW1lPlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRlbnF1ZXVlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGlmIChTb3VuZENsb3VkQXBpLmlzTG9hZGVkKSB7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFNvdW5kQ2xvdWRBcGkubG9hZElmcmFtZUFwaSgpO1xuXHRcdFx0U291bmRDbG91ZEFwaS5pZnJhbWVRdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgU291bmRDbG91ZCBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cdFx0aWYgKCFTb3VuZENsb3VkQXBpLmlzU0RLU3RhcnRlZCkge1xuXG5cdFx0XHRsZXQgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksXG5cdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0c2NyaXB0LnNyYyA9ICcvL3cuc291bmRjbG91ZC5jb20vcGxheWVyL2FwaS5qcyc7XG5cblx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblx0XHRcdFx0aWYgKCFkb25lICYmICghU291bmRDbG91ZEFwaS5yZWFkeVN0YXRlIHx8IFNvdW5kQ2xvdWRBcGkucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCBTb3VuZENsb3VkQXBpLnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikpIHtcblx0XHRcdFx0XHRkb25lID0gdHJ1ZTtcblx0XHRcdFx0XHRTb3VuZENsb3VkQXBpLmFwaVJlYWR5KCk7XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgbWVtb3J5IGxlYWsgaW4gSUVcblx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdFx0aWYgKGhlYWQgJiYgc2NyaXB0LnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmlzU0RLU3RhcnRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIFNvdW5kQ2xvdWQgPGlmcmFtZT4gZWxlbWVudCBjcmVhdGlvblxuXHQgKlxuXHQgKi9cblx0YXBpUmVhZHk6ICgpID0+IHtcblx0XHRTb3VuZENsb3VkQXBpLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHRTb3VuZENsb3VkQXBpLmlzU0RLTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChTb3VuZENsb3VkQXBpLmlmcmFtZVF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBzZXR0aW5ncyA9IFNvdW5kQ2xvdWRBcGkuaWZyYW1lUXVldWUucG9wKCk7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgU291bmRDbG91ZCBXaWRnZXQgcGxheWVyIGFuZCB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IHRvIGluaXRpYWxpemUgaXRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0Y3JlYXRlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblx0XHRsZXQgcGxheWVyID0gU0MuV2lkZ2V0KHNldHRpbmdzLmlmcmFtZSk7XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2V0dGluZ3MuaWRdKHBsYXllcik7XG5cdH1cbn07XG5cbmNvbnN0IFNvdW5kQ2xvdWRJZnJhbWVSZW5kZXJlciA9IHtcblx0bmFtZTogJ3NvdW5kY2xvdWRfaWZyYW1lJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnc291bmRjbG91ZF9pZnJhbWUnXG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gWyd2aWRlby9zb3VuZGNsb3VkJywgJ3ZpZGVvL3gtc291bmRjbG91ZCddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0IHNjID0ge307XG5cblx0XHQvLyBzdG9yZSBtYWluIHZhcmlhYmxlXG5cdFx0c2Mub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0c2MuaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHRzYy5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBjcmVhdGUgb3VyIGZha2UgZWxlbWVudCB0aGF0IGFsbG93cyBldmVudHMgYW5kIHN1Y2ggdG8gd29ya1xuXHRcdGxldFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHNjUGxheWVyUmVhZHkgPSBmYWxzZSxcblx0XHRcdHNjUGxheWVyID0gbnVsbCxcblx0XHRcdHNjSWZyYW1lID0gbnVsbCxcblx0XHRcdGN1cnJlbnRUaW1lID0gMCxcblx0XHRcdGR1cmF0aW9uID0gMCxcblx0XHRcdGJ1ZmZlcmVkVGltZSA9IDAsXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0dm9sdW1lID0gMSxcblx0XHRcdG11dGVkID0gZmFsc2UsXG5cdFx0XHRlbmRlZCA9IGZhbHNlLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRzY1tgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChzY1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IGRtIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY3VycmVudFRpbWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkdXJhdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2b2x1bWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBtdXRlZDsgLy8gP1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2J1ZmZlcmVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBidWZmZXJlZFRpbWUgKiBkdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGg6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NJZnJhbWUpID8gc2NJZnJhbWUuc3JjIDogJyc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblxuXHRcdFx0XHRcdGlmIChzY1BsYXllciAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmM7XG5cblx0XHRcdFx0XHRcdFx0XHRzY1BsYXllci5sb2FkKHVybCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNlZWtUbyh2YWx1ZSAqIDEwMDApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNldFZvbHVtZSgwKTsgLy8gP1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzY1BsYXllci5zZXRWb2x1bWUoMSk7IC8vID9cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgc2MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNldFZvbHVtZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgc2MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzYyAnICsgc2MuaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgU291bmRjbG91ZCBBUElcblx0XHRcdFx0c2NbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoc2NQbGF5ZXIgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRE8gbWV0aG9kXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG1ldGhvZE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGxheSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjUGxheWVyLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY1BsYXllci5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIGFkZCBhIHJlYWR5IG1ldGhvZCB0aGF0IFNDIGNhbiBmaXJlXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2MuaWRdID0gKF9zY1BsYXllcikgPT4ge1xuXG5cdFx0XHRzY1BsYXllclJlYWR5ID0gdHJ1ZTtcblx0XHRcdG1lZGlhRWxlbWVudC5zY1BsYXllciA9IHNjUGxheWVyID0gX3NjUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0c2NbYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0c2Nbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNvdW5kQ2xvdWQgcHJvcGVydGllcyBhcmUgYXN5bmMsIHNvIHdlIGRvbid0IGZpcmUgdGhlIGV2ZW50IHVudGlsIHRoZSBwcm9wZXJ0eSBjYWxsYmFjayBmaXJlc1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLlBMQVlfUFJPR1JFU1MsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0c2NQbGF5ZXIuZ2V0UG9zaXRpb24oKF9jdXJyZW50VGltZSkgPT4ge1xuXHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gX2N1cnJlbnRUaW1lIC8gMTAwMDtcblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIHNjKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNjUGxheWVyLmJpbmQoU0MuV2lkZ2V0LkV2ZW50cy5QQVVTRSwgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwYXVzZScsIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuUExBWSwgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGxheScsIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuRklOSVNIRUQsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdGVuZGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZW5kZWQnLCBzYyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLlJFQURZLCAoKSA9PiB7XG5cdFx0XHRcdHNjUGxheWVyLmdldER1cmF0aW9uKChfZHVyYXRpb24pID0+IHtcblx0XHRcdFx0XHRkdXJhdGlvbiA9IF9kdXJhdGlvbiAvIDEwMDA7XG5cblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnbG9hZGVkbWV0YWRhdGEnLCBzYyk7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLkxPQURfUFJPR1JFU1MsICgpID0+IHtcblx0XHRcdFx0c2NQbGF5ZXIuZ2V0RHVyYXRpb24oKGxvYWRQcm9ncmVzcykgPT4ge1xuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdGJ1ZmZlcmVkVGltZSA9IGR1cmF0aW9uICogbG9hZFByb2dyZXNzO1xuXG5cdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncHJvZ3Jlc3MnLCBzYyk7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NQbGF5ZXIuZ2V0RHVyYXRpb24oKF9kdXJhdGlvbikgPT4ge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gX2R1cmF0aW9uO1xuXG5cdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ2xvYWRlZG1ldGFkYXRhJywgc2MpO1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2l2ZSBpbml0aWFsIGV2ZW50c1xuXHRcdFx0bGV0IGluaXRFdmVudHMgPSBbJ3JlbmRlcmVycmVhZHknLCAnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICdjYW5wbGF5J107XG5cblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGluaXRFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChpbml0RXZlbnRzW2ldLCBzYyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gY29udGFpbmVyIGZvciBBUEkgQVBJXG5cdFx0c2NJZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblx0XHRzY0lmcmFtZS5pZCA9IHNjLmlkO1xuXHRcdHNjSWZyYW1lLndpZHRoID0gMTA7XG5cdFx0c2NJZnJhbWUuaGVpZ2h0ID0gMTA7XG5cdFx0c2NJZnJhbWUuZnJhbWVCb3JkZXIgPSAwO1xuXHRcdHNjSWZyYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblx0XHRzY0lmcmFtZS5zcmMgPSBtZWRpYUZpbGVzWzBdLnNyYztcblx0XHRzY0lmcmFtZS5zY3JvbGxpbmcgPSAnbm8nO1xuXG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKHNjSWZyYW1lKTtcblx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRsZXQgc2NTZXR0aW5ncyA9IHtcblx0XHRcdGlmcmFtZTogc2NJZnJhbWUsXG5cdFx0XHRpZDogc2MuaWRcblx0XHR9O1xuXG5cdFx0U291bmRDbG91ZEFwaS5lbnF1ZXVlSWZyYW1lKHNjU2V0dGluZ3MpO1xuXG5cdFx0c2Muc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHQvLyBub3RoaW5nIGhlcmUsIGF1ZGlvIG9ubHlcblx0XHR9O1xuXHRcdHNjLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRzYy5wYXVzZSgpO1xuXHRcdFx0aWYgKHNjSWZyYW1lKSB7XG5cdFx0XHRcdHNjSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRzYy5zaG93ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHNjSWZyYW1lKSB7XG5cdFx0XHRcdHNjSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHNjLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRzY1BsYXllci5kZXN0cm95KCk7XG5cdFx0fTtcblxuXHRcdHJldHVybiBzYztcblx0fVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBTb3VuZENsb3VkIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiAodXJsLmluY2x1ZGVzKCcvL3NvdW5kY2xvdWQuY29tJykgfHwgdXJsLmluY2x1ZGVzKCcvL3cuc291bmRjbG91ZC5jb20nKSkgPyAndmlkZW8veC1zb3VuZGNsb3VkJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKFNvdW5kQ2xvdWRJZnJhbWVSZW5kZXJlcik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50LCBhZGRFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIFZpbWVvIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBWaW1lbyBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIEFsbCBWaW1lbyBjYWxscyByZXR1cm4gYSBQcm9taXNlIHNvIHRoaXMgcmVuZGVyZXIgYWNjb3VudHMgZm9yIHRoYXRcbiAqIHRvIHVwZGF0ZSBhbGwgdGhlIG5lY2Vzc2FyeSB2YWx1ZXMgdG8gaW50ZXJhY3Qgd2l0aCBNZWRpYUVsZW1lbnQgcGxheWVyLlxuICogTm90ZTogSUU4IGltcGxlbWVudHMgRUNNQVNjcmlwdCAzIHRoYXQgZG9lcyBub3QgYWxsb3cgYmFyZSBrZXl3b3JkcyBpbiBkb3Qgbm90YXRpb247XG4gKiB0aGF0J3Mgd2h5IGluc3RlYWQgb2YgdXNpbmcgLmNhdGNoIFsnY2F0Y2gnXSBpcyBiZWluZyB1c2VkLlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdmltZW8vcGxheWVyLmpzXG4gKlxuICovXG5jb25zdCB2aW1lb0FwaSA9IHtcblxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0lmcmFtZVN0YXJ0ZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0lmcmFtZUxvYWRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRpZnJhbWVRdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGNyZWF0aW9uIG9mIDxpZnJhbWU+XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGVucXVldWVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0aWYgKHZpbWVvQXBpLmlzTG9hZGVkKSB7XG5cdFx0XHR2aW1lb0FwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2aW1lb0FwaS5sb2FkSWZyYW1lQXBpKCk7XG5cdFx0XHR2aW1lb0FwaS5pZnJhbWVRdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgVmltZW8gQVBJIHNjcmlwdCBvbiB0aGUgaGVhZGVyIG9mIHRoZSBkb2N1bWVudFxuXHQgKlxuXHQgKi9cblx0bG9hZElmcmFtZUFwaTogKCkgPT4ge1xuXG5cdFx0aWYgKCF2aW1lb0FwaS5pc0lmcmFtZVN0YXJ0ZWQpIHtcblxuXHRcdFx0bGV0XG5cdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSxcblx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRzY3JpcHQuc3JjID0gJy8vcGxheWVyLnZpbWVvLmNvbS9hcGkvcGxheWVyLmpzJztcblxuXHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoIWRvbmUgJiYgKCF2aW1lb0FwaS5yZWFkeVN0YXRlIHx8IHZpbWVvQXBpLnJlYWR5U3RhdGUgPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHRcdHZpbWVvQXBpLnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIgfHwgdmltZW9BcGkucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSkge1xuXHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdHZpbWVvQXBpLmlGcmFtZVJlYWR5KCk7XG5cdFx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR2aW1lb0FwaS5pc0lmcmFtZVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBWaW1lbyA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRpRnJhbWVSZWFkeTogKCkgPT4ge1xuXG5cdFx0dmltZW9BcGkuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdHZpbWVvQXBpLmlzSWZyYW1lTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlICh2aW1lb0FwaS5pZnJhbWVRdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSB2aW1lb0FwaS5pZnJhbWVRdWV1ZS5wb3AoKTtcblx0XHRcdHZpbWVvQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgVmltZW8gQVBJIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGNyZWF0ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0bGV0IHBsYXllciA9IG5ldyBWaW1lby5QbGF5ZXIoc2V0dGluZ3MuaWZyYW1lKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0fSxcblxuXHQvKipcblx0ICogRXh0cmFjdCBudW1lcmljIHZhbHVlIGZyb20gVmltZW8gdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqICAtIGh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby81OTc3NzM5MlxuXHQgKiAgLSBodHRwczovL3ZpbWVvLmNvbS81OTc3NzM5MlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVmltZW8gZnVsbCBVUkwgdG8gZ3JhYiB0aGUgbnVtYmVyIElkIG9mIHRoZSBzb3VyY2Vcblx0ICogQHJldHVybiB7aW50fVxuXHQgKi9cblx0Z2V0VmltZW9JZDogKHVybCkgPT4ge1xuXHRcdGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJ0cyA9IHVybC5zcGxpdCgnPycpO1xuXG5cdFx0dXJsID0gcGFydHNbMF07XG5cblx0XHRyZXR1cm4gcGFyc2VJbnQodXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcblx0fSxcblxuXHQvKipcblx0ICogR2VuZXJhdGUgY3VzdG9tIGVycm9ycyBmb3IgVmltZW8gYmFzZWQgb24gdGhlIEFQSSBzcGVjaWZpY2F0aW9uc1xuXHQgKlxuXHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aW1lby9wbGF5ZXIuanMjZXJyb3Jcblx0ICogQHBhcmFtIHtPYmplY3R9IGVycm9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcblx0ICovXG5cdGVycm9ySGFuZGxlcjogKGVycm9yLCB0YXJnZXQpID0+IHtcblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZXJyb3InLCB0YXJnZXQpO1xuXHRcdGV2ZW50Lm1lc3NhZ2UgPSBlcnJvci5uYW1lICsgJzogJyArIGVycm9yLm1lc3NhZ2U7XG5cdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG59O1xuXG5jb25zdCB2aW1lb0lmcmFtZVJlbmRlcmVyID0ge1xuXG5cdG5hbWU6ICd2aW1lb19pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICd2aW1lb19pZnJhbWUnXG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IFsndmlkZW8vdmltZW8nLCAndmlkZW8veC12aW1lbyddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0Ly8gZXhwb3NlZCBvYmplY3Rcblx0XHRsZXRcblx0XHRcdGFwaVN0YWNrID0gW10sXG5cdFx0XHR2aW1lb0FwaVJlYWR5ID0gZmFsc2UsXG5cdFx0XHR2aW1lbyA9IHt9LFxuXHRcdFx0dmltZW9QbGF5ZXIgPSBudWxsLFxuXHRcdFx0cGF1c2VkID0gdHJ1ZSxcblx0XHRcdHZvbHVtZSA9IDEsXG5cdFx0XHRvbGRWb2x1bWUgPSB2b2x1bWUsXG5cdFx0XHRjdXJyZW50VGltZSA9IDAsXG5cdFx0XHRidWZmZXJlZFRpbWUgPSAwLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdGR1cmF0aW9uID0gMCxcblx0XHRcdHVybCA9IFwiXCIsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHR2aW1lby5vcHRpb25zID0gb3B0aW9ucztcblx0XHR2aW1lby5pZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4O1xuXHRcdHZpbWVvLm1lZGlhRWxlbWVudCA9IG1lZGlhRWxlbWVudDtcblxuXHRcdC8vIHdyYXBwZXJzIGZvciBnZXQvc2V0XG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHR2aW1lb1tgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh2aW1lb1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRUaW1lO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2R1cmF0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZHVyYXRpb247XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdm9sdW1lO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZvbHVtZSA9PT0gMDtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5nZXRWaWRlb1VybCgpLnRoZW4oKF91cmwpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHVybCA9IF91cmw7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdXJsO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdidWZmZXJlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYnVmZmVyZWRUaW1lICogZHVyYXRpb247XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmltZW9bYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHZpbWVvUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHVybCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlWzBdLnNyYyxcblx0XHRcdFx0XHRcdFx0XHRcdHZpZGVvSWQgPSB2aW1lb0FwaS5nZXRWaW1lb0lkKHVybCk7XG5cblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5sb2FkVmlkZW8odmlkZW9JZCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobWVkaWFFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRDdXJyZW50VGltZSh2YWx1ZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnNldFZvbHVtZSh2YWx1ZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2b2x1bWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdG9sZFZvbHVtZSA9IHZvbHVtZTtcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdsb29wJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRMb29wKHZhbHVlKVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRWb2x1bWUoMCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHVtZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmltZW9QbGF5ZXIuc2V0Vm9sdW1lKG9sZFZvbHVtZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHVtZSA9IG9sZFZvbHVtZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygndmltZW8gJyArIHZpbWVvLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIFNvdW5kY2xvdWQgQVBJXG5cdFx0XHRcdHZpbWVvW21ldGhvZE5hbWVdID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHZpbWVvUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIERPIG1ldGhvZFxuXHRcdFx0XHRcdFx0c3dpdGNoIChtZXRob2ROYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BsYXknOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2aW1lb1BsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BhdXNlJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmltZW9QbGF5ZXIucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnY2FsbCcsIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsIG1ldGhvZCB0byByZWdpc3RlciBhbGwgVmltZW8gZXZlbnRzIHdoZW4gaW5pdGlhbGl6aW5nIDxpZnJhbWU+XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgdmltZW8uaWRdID0gKF92aW1lb1BsYXllcikgPT4ge1xuXG5cdFx0XHR2aW1lb0FwaVJlYWR5ID0gdHJ1ZTtcblx0XHRcdG1lZGlhRWxlbWVudC52aW1lb1BsYXllciA9IHZpbWVvUGxheWVyID0gX3ZpbWVvUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0dmltZW9bYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0dmltZW9bc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxldCB2aW1lb0lmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZpbWVvLmlkKSwgZXZlbnRzO1xuXG5cdFx0XHQvLyBhIGZldyBtb3JlIGV2ZW50c1xuXHRcdFx0ZXZlbnRzID0gWydtb3VzZW92ZXInLCAnbW91c2VvdXQnXTtcblxuXHRcdFx0Y29uc3QgYXNzaWduRXZlbnRzID0gKGUpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCB2aW1lbyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH07XG5cblx0XHRcdGZvciAobGV0IGogaW4gZXZlbnRzKSB7XG5cdFx0XHRcdGxldCBldmVudE5hbWUgPSBldmVudHNbal07XG5cdFx0XHRcdGFkZEV2ZW50KHZpbWVvSWZyYW1lLCBldmVudE5hbWUsIGFzc2lnbkV2ZW50cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFZpbWVvIGV2ZW50c1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ2xvYWRlZCcsICgpID0+IHtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5nZXREdXJhdGlvbigpLnRoZW4oKGxvYWRQcm9ncmVzcykgPT4ge1xuXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBsb2FkUHJvZ3Jlc3M7XG5cblx0XHRcdFx0XHRpZiAoZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0XHRidWZmZXJlZFRpbWUgPSBkdXJhdGlvbiAqIGxvYWRQcm9ncmVzcztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnbG9hZGVkbWV0YWRhdGEnLCB2aW1lbyk7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2aW1lb1BsYXllci5vbigncHJvZ3Jlc3MnLCAoKSA9PiB7XG5cblx0XHRcdFx0cGF1c2VkID0gdmltZW8ubWVkaWFFbGVtZW50LmdldFBhdXNlZCgpO1xuXG5cdFx0XHRcdHZpbWVvUGxheWVyLmdldER1cmF0aW9uKCkudGhlbigobG9hZFByb2dyZXNzKSA9PiB7XG5cblx0XHRcdFx0XHRkdXJhdGlvbiA9IGxvYWRQcm9ncmVzcztcblxuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdGJ1ZmZlcmVkVGltZSA9IGR1cmF0aW9uICogbG9hZFByb2dyZXNzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwcm9ncmVzcycsIHZpbWVvKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2aW1lb1BsYXllci5vbigndGltZXVwZGF0ZScsICgpID0+IHtcblxuXHRcdFx0XHRwYXVzZWQgPSB2aW1lby5tZWRpYUVsZW1lbnQuZ2V0UGF1c2VkKCk7XG5cdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0dmltZW9QbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKS50aGVuKChzZWNvbmRzKSA9PiB7XG5cdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBzZWNvbmRzO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHZpbWVvUGxheWVyLm9uKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5wbGF5KClbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgdmltZW8pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHZpbWVvUGxheWVyLm9uKCdwYXVzZScsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5wYXVzZSgpWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGF1c2UnLCB2aW1lbyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdpdmUgaW5pdGlhbCBldmVudHNcblx0XHRcdGV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudHNbaV0sIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRsZXRcblx0XHRcdGhlaWdodCA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuaGVpZ2h0LFxuXHRcdFx0d2lkdGggPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLndpZHRoLFxuXHRcdFx0dmltZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKSxcblx0XHRcdHN0YW5kYXJkVXJsID0gJy8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nICsgdmltZW9BcGkuZ2V0VmltZW9JZChtZWRpYUZpbGVzWzBdLnNyYylcblx0XHQ7XG5cblx0XHQvLyBDcmVhdGUgVmltZW8gPGlmcmFtZT4gbWFya3VwXG5cdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsIHZpbWVvLmlkKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2ZyYW1lQm9yZGVyJywgJzAnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3NyYycsIHN0YW5kYXJkVXJsKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3dlYmtpdGFsbG93ZnVsbHNjcmVlbicsICcnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ21vemFsbG93ZnVsbHNjcmVlbicsICcnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FsbG93ZnVsbHNjcmVlbicsICcnKTtcblxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodmltZW9Db250YWluZXIsIG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdHZpbWVvQXBpLmVucXVldWVJZnJhbWUoe1xuXHRcdFx0aWZyYW1lOiB2aW1lb0NvbnRhaW5lcixcblx0XHRcdGlkOiB2aW1lby5pZFxuXHRcdH0pO1xuXG5cdFx0dmltZW8uaGlkZSA9ICgpID0+IHtcblx0XHRcdHZpbWVvLnBhdXNlKCk7XG5cdFx0XHRpZiAodmltZW9QbGF5ZXIpIHtcblx0XHRcdFx0dmltZW9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZpbWVvLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcblx0XHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHR9O1xuXHRcdHZpbWVvLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAodmltZW9QbGF5ZXIpIHtcblx0XHRcdFx0dmltZW9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gdmltZW87XG5cdH1cblxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBWaW1lbyB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gdXJsLmluY2x1ZGVzKCcvL3BsYXllci52aW1lbycpIHx8IHVybC5pbmNsdWRlcygndmltZW8uY29tJykgPyAndmlkZW8veC12aW1lbycgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZCh2aW1lb0lmcmFtZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnQsIGFkZEV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogWW91VHViZSByZW5kZXJlclxuICpcbiAqIFVzZXMgPGlmcmFtZT4gYXBwcm9hY2ggYW5kIHVzZXMgWW91VHViZSBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIE5vdGU6IElFNi03IGRvbid0IGhhdmUgcG9zdE1lc3NhZ2Ugc28gZG9uJ3Qgc3VwcG9ydCA8aWZyYW1lPiBBUEksIGFuZCBJRTggZG9lc24ndCBmaXJlIHRoZSBvblJlYWR5IGV2ZW50LFxuICogc28gaXQgZG9lc24ndCB3b3JrIC0gbm90IHN1cmUgaWYgR29vZ2xlIHByb2JsZW0gb3Igbm90LlxuICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS95b3V0dWJlL2lmcmFtZV9hcGlfcmVmZXJlbmNlXG4gKi9cbmNvbnN0IFlvdVR1YmVBcGkgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGlmcmFtZVF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgY3JlYXRpb24gb2YgPGlmcmFtZT5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0ZW5xdWV1ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRpZiAoWW91VHViZUFwaS5pc0xvYWRlZCkge1xuXHRcdFx0WW91VHViZUFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRZb3VUdWJlQXBpLmxvYWRJZnJhbWVBcGkoKTtcblx0XHRcdFlvdVR1YmVBcGkuaWZyYW1lUXVldWUucHVzaChzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIFlvdVR1YmUgQVBJIHNjcmlwdCBvbiB0aGUgaGVhZGVyIG9mIHRoZSBkb2N1bWVudFxuXHQgKlxuXHQgKi9cblx0bG9hZElmcmFtZUFwaTogKCkgPT4ge1xuXHRcdGlmICghWW91VHViZUFwaS5pc0lmcmFtZVN0YXJ0ZWQpIHtcblx0XHRcdGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdHRhZy5zcmMgPSAnLy93d3cueW91dHViZS5jb20vcGxheWVyX2FwaSc7XG5cdFx0XHRsZXQgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG5cdFx0XHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcblx0XHRcdFlvdVR1YmVBcGkuaXNJZnJhbWVTdGFydGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgWW91VHViZSA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRpRnJhbWVSZWFkeTogKCkgPT4ge1xuXG5cdFx0WW91VHViZUFwaS5pc0xvYWRlZCA9IHRydWU7XG5cdFx0WW91VHViZUFwaS5pc0lmcmFtZUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoWW91VHViZUFwaS5pZnJhbWVRdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBZb3VUdWJlQXBpLmlmcmFtZVF1ZXVlLnBvcCgpO1xuXHRcdFx0WW91VHViZUFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFlvdVR1YmUgQVBJIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGNyZWF0ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0cmV0dXJuIG5ldyBZVC5QbGF5ZXIoc2V0dGluZ3MuY29udGFpbmVySWQsIHNldHRpbmdzKTtcblx0fSxcblxuXHQvKipcblx0ICogRXh0cmFjdCBJRCBmcm9tIFlvdVR1YmUncyBVUkwgdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD9mZWF0dXJlPXBsYXllcl9lbWJlZGRlZCZ2PXl5V1dYU3d0UFAwXG5cdCAqIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHQgKiAtIGh0dHA6Ly95b3V0dS5iZS9EamQ2dFByeGMwOFxuXHQgKiAtIGh0dHA6Ly93d3cueW91dHViZS1ub2Nvb2tpZS5jb20vd2F0Y2g/ZmVhdHVyZT1wbGF5ZXJfZW1iZWRkZWQmdj15eVdXWFN3dFBQMFxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZDogKHVybCkgPT4ge1xuXG5cdFx0bGV0IHlvdVR1YmVJZCA9IFwiXCI7XG5cblx0XHRpZiAodXJsLmluZGV4T2YoJz8nKSA+IDApIHtcblx0XHRcdC8vIGFzc3VtaW5nOiBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP2ZlYXR1cmU9cGxheWVyX2VtYmVkZGVkJnY9eXlXV1hTd3RQUDBcblx0XHRcdHlvdVR1YmVJZCA9IFlvdVR1YmVBcGkuZ2V0WW91VHViZUlkRnJvbVBhcmFtKHVybCk7XG5cblx0XHRcdC8vIGlmIGl0J3MgaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHRcdFx0aWYgKHlvdVR1YmVJZCA9PT0gJycpIHtcblx0XHRcdFx0eW91VHViZUlkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWRGcm9tVXJsKHVybCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHlvdVR1YmVJZCA9IFlvdVR1YmVBcGkuZ2V0WW91VHViZUlkRnJvbVVybCh1cmwpO1xuXHRcdH1cblxuXHRcdHJldHVybiB5b3VUdWJlSWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBJRCBmcm9tIFVSTCB3aXRoIGZvcm1hdDogaHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD9mZWF0dXJlPXBsYXllcl9lbWJlZGRlZCZ2PXl5V1dYU3d0UFAwXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZEZyb21QYXJhbTogKHVybCkgPT4ge1xuXG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCAhdXJsLnRyaW0oKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0eW91VHViZUlkID0gJycsXG5cdFx0XHRwYXJ0cyA9IHVybC5zcGxpdCgnPycpLFxuXHRcdFx0cGFyYW1ldGVycyA9IHBhcnRzWzFdLnNwbGl0KCcmJylcblx0XHQ7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBwYXJhbWV0ZXJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGxldCBwYXJhbVBhcnRzID0gcGFyYW1ldGVyc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0aWYgKHBhcmFtUGFydHNbMF0gPT09ICd2Jykge1xuXHRcdFx0XHR5b3VUdWJlSWQgPSBwYXJhbVBhcnRzWzFdO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4geW91VHViZUlkO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgSUQgZnJvbSBVUkwgd2l0aCBmb3JtYXRzXG5cdCAqICAtIGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9WSURFT19JRD92ZXJzaW9uPTNcblx0ICogIC0gaHR0cDovL3lvdXR1LmJlL0RqZDZ0UHJ4YzA4XG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybiB7P1N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZEZyb21Vcmw6ICh1cmwpID0+IHtcblxuXHRcdGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwgfHwgIXVybC50cmltKCkubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgcGFydHMgPSB1cmwuc3BsaXQoJz8nKTtcblx0XHR1cmwgPSBwYXJ0c1swXTtcblx0XHRyZXR1cm4gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbmplY3QgYG5vLWNvb2tpZWAgZWxlbWVudCB0byBVUkwuIE9ubHkgd29ya3Mgd2l0aCBmb3JtYXQ6IGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9WSURFT19JRD92ZXJzaW9uPTNcblx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHQgKiBAcmV0dXJuIHs/U3RyaW5nfVxuXHQgKi9cblx0Z2V0WW91VHViZU5vQ29va2llVXJsOiAodXJsKSA9PiB7XG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCAhdXJsLnRyaW0oKS5sZW5ndGggfHwgIXVybC5pbmNsdWRlcygnLy93d3cueW91dHViZScpKSB7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuXHRcdHBhcnRzWzJdID0gcGFydHNbMl0ucmVwbGFjZSgnLmNvbScsICctbm9jb29raWUuY29tJyk7XG5cdFx0cmV0dXJuIHBhcnRzLmpvaW4oJy8nKTtcblx0fVxufTtcblxuY29uc3QgWW91VHViZUlmcmFtZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAneW91dHViZV9pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICd5b3V0dWJlX2lmcmFtZScsXG5cdFx0LyoqXG5cdFx0ICogQ3VzdG9tIGNvbmZpZ3VyYXRpb24gZm9yIFlvdVR1YmUgcGxheWVyXG5cdFx0ICpcblx0XHQgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3lvdXR1YmUvcGxheWVyX3BhcmFtZXRlcnMjUGFyYW1ldGVyc1xuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0eW91dHViZToge1xuXHRcdFx0YXV0b3BsYXk6IDAsXG5cdFx0XHRjb250cm9sczogMCxcblx0XHRcdGRpc2FibGVrYjogMSxcblx0XHRcdGVuZDogMCxcblx0XHRcdGxvb3A6IDAsXG5cdFx0XHRtb2Rlc3RicmFuZGluZzogMCxcblx0XHRcdHBsYXlzaW5saW5lOiAwLFxuXHRcdFx0cmVsOiAwLFxuXHRcdFx0c2hvd2luZm86IDAsXG5cdFx0XHRzdGFydDogMCxcblx0XHRcdC8vIGN1c3RvbSB0byBpbmplY3QgYC1ub2Nvb2tpZWAgZWxlbWVudCBpbiBVUkxcblx0XHRcdG5vY29va2llOiBmYWxzZVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBbJ3ZpZGVvL3lvdXR1YmUnLCAndmlkZW8veC15b3V0dWJlJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHQvLyBleHBvc2VkIG9iamVjdFxuXHRcdGxldCB5b3V0dWJlID0ge307XG5cdFx0eW91dHViZS5vcHRpb25zID0gb3B0aW9ucztcblx0XHR5b3V0dWJlLmlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXg7XG5cdFx0eW91dHViZS5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBBUEkgb2JqZWN0c1xuXHRcdGxldFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHlvdVR1YmVBcGkgPSBudWxsLFxuXHRcdFx0eW91VHViZUFwaVJlYWR5ID0gZmFsc2UsXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdHlvdVR1YmVJZnJhbWUgPSBudWxsLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHR5b3V0dWJlW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHlvdVR1YmVBcGkgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGxldCB2YWx1ZSA9IG51bGw7XG5cblx0XHRcdFx0XHRcdC8vIGZpZ3VyZSBvdXQgaG93IHRvIGdldCB5b3V0dWJlIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXRDdXJyZW50VGltZSgpO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2R1cmF0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXREdXJhdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkuZ2V0Vm9sdW1lKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLmlzTXV0ZWQoKTsgLy8gP1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2J1ZmZlcmVkJzpcblx0XHRcdFx0XHRcdFx0XHRsZXQgcGVyY2VudExvYWRlZCA9IHlvdVR1YmVBcGkuZ2V0VmlkZW9Mb2FkZWRGcmFjdGlvbigpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZHVyYXRpb24gPSB5b3VUdWJlQXBpLmdldER1cmF0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGVyY2VudExvYWRlZCAqIGR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGxlbmd0aDogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkuZ2V0VmlkZW9VcmwoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0eW91dHViZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmMsXG5cdFx0XHRcdFx0XHRcdFx0XHR2aWRlb0lkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWQodXJsKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChtZWRpYUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR5b3VUdWJlQXBpLmxvYWRWaWRlb0J5SWQodmlkZW9JZCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkuY3VlVmlkZW9CeUlkKHZpZGVvSWQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5zZWVrVG8odmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkubXV0ZSgpOyAvLyA/XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkudW5NdXRlKCk7IC8vID9cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5zZXRWb2x1bWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIHlvdXR1YmUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCd5b3V0dWJlICcgKyB5b3V0dWJlLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdHlvdXR1YmVbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5wbGF5VmlkZW8oKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLnBhdXNlVmlkZW8oKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnY2FsbCcsIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBDUkVBVEUgWW91VHViZVxuXHRcdGxldCB5b3V0dWJlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0eW91dHViZUNvbnRhaW5lci5pZCA9IHlvdXR1YmUuaWQ7XG5cblx0XHQvLyBJZiBgbm9jb29raWVgIGZlYXR1cmUgd2FzIGVuYWJsZWQsIG1vZGlmeSBvcmlnaW5hbCBVUkxcblx0XHRpZiAoeW91dHViZS5vcHRpb25zLnlvdXR1YmUubm9jb29raWUpIHtcblx0XHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBZb3VUdWJlQXBpLmdldFlvdVR1YmVOb0Nvb2tpZVVybChtZWRpYUZpbGVzWzBdLnNyYykpO1xuXHRcdH1cblxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoeW91dHViZUNvbnRhaW5lciwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0bGV0XG5cdFx0XHRoZWlnaHQgPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmhlaWdodCxcblx0XHRcdHdpZHRoID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS53aWR0aCxcblx0XHRcdHZpZGVvSWQgPSBZb3VUdWJlQXBpLmdldFlvdVR1YmVJZChtZWRpYUZpbGVzWzBdLnNyYyksXG5cdFx0XHR5b3V0dWJlU2V0dGluZ3MgPSB7XG5cdFx0XHRcdGlkOiB5b3V0dWJlLmlkLFxuXHRcdFx0XHRjb250YWluZXJJZDogeW91dHViZUNvbnRhaW5lci5pZCxcblx0XHRcdFx0dmlkZW9JZDogdmlkZW9JZCxcblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHQsXG5cdFx0XHRcdHdpZHRoOiB3aWR0aCxcblx0XHRcdFx0cGxheWVyVmFyczogT2JqZWN0LmFzc2lnbih7XG5cdFx0XHRcdFx0Y29udHJvbHM6IDAsXG5cdFx0XHRcdFx0cmVsOiAwLFxuXHRcdFx0XHRcdGRpc2FibGVrYjogMSxcblx0XHRcdFx0XHRzaG93aW5mbzogMCxcblx0XHRcdFx0XHRtb2Rlc3RicmFuZGluZzogMCxcblx0XHRcdFx0XHRodG1sNTogMSxcblx0XHRcdFx0XHRwbGF5c2lubGluZTogMCxcblx0XHRcdFx0XHRzdGFydDogMCxcblx0XHRcdFx0XHRlbmQ6IDBcblx0XHRcdFx0fSwgeW91dHViZS5vcHRpb25zLnlvdXR1YmUpLFxuXHRcdFx0XHRvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRvblJlYWR5OiAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHR5b3VUdWJlQXBpUmVhZHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LnlvdVR1YmVBcGkgPSB5b3VUdWJlQXBpID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQueW91VHViZVN0YXRlID0ge1xuXHRcdFx0XHRcdFx0XHRwYXVzZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGVuZGVkOiBmYWxzZVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0XHRcdFx0aWYgKGFwaVN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGFwaVN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBhcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eW91dHViZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBhIGZldyBtb3JlIGV2ZW50c1xuXHRcdFx0XHRcdFx0eW91VHViZUlmcmFtZSA9IHlvdVR1YmVBcGkuZ2V0SWZyYW1lKCk7XG5cblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ21vdXNlb3ZlcicsICdtb3VzZW91dCddLFxuXHRcdFx0XHRcdFx0XHRhc3NpZ25FdmVudHMgPSAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5ld0V2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCB5b3V0dWJlKTtcblx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaiBpbiBldmVudHMpIHtcblx0XHRcdFx0XHRcdFx0YWRkRXZlbnQoeW91VHViZUlmcmFtZSwgZXZlbnRzW2pdLCBhc3NpZ25FdmVudHMpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBzZW5kIGluaXQgZXZlbnRzXG5cdFx0XHRcdFx0XHRsZXQgaW5pdEV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBpbml0RXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoaW5pdEV2ZW50c1tpXSwgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uU3RhdGVDaGFuZ2U6IChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zbGF0ZSBldmVudHNcblx0XHRcdFx0XHRcdGxldCBldmVudHMgPSBbXTtcblxuXHRcdFx0XHRcdFx0c3dpdGNoIChlLmRhdGEpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAtMTogLy8gbm90IHN0YXJ0ZWRcblx0XHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ2xvYWRlZG1ldGFkYXRhJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgMDogLy8gWVQuUGxheWVyU3RhdGUuRU5ERURcblx0XHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ2VuZGVkJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0ZW5kZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XHQvLyBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzID0gWydwbGF5JywgJ3BsYXlpbmcnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdGFydEludGVydmFsKCk7XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDI6IC8vIFlULlBsYXllclN0YXRlLlBBVVNFRFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsncGF1c2VkJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDM6IC8vIFlULlBsYXllclN0YXRlLkJVRkZFUklOR1xuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsncHJvZ3Jlc3MnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgNTogLy8gWVQuUGxheWVyU3RhdGUuQ1VFRFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICdjYW5wbGF5J107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHNlbmQgZXZlbnRzIHVwXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudHNbaV0sIHlvdXR1YmUpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvLyBzZW5kIGl0IG9mZiBmb3IgYXN5bmMgbG9hZGluZyBhbmQgY3JlYXRpb25cblx0XHRZb3VUdWJlQXBpLmVucXVldWVJZnJhbWUoeW91dHViZVNldHRpbmdzKTtcblxuXHRcdHlvdXR1YmUub25FdmVudCA9IChldmVudE5hbWUsIHBsYXllciwgX3lvdVR1YmVTdGF0ZSkgPT4ge1xuXHRcdFx0aWYgKF95b3VUdWJlU3RhdGUgIT09IG51bGwgJiYgX3lvdVR1YmVTdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC55b3VUdWJlU3RhdGUgPSBfeW91VHViZVN0YXRlO1xuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdHlvdXR1YmUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXHRcdFx0XHR5b3VUdWJlQXBpLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR5b3V0dWJlLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHR5b3V0dWJlLnN0b3BJbnRlcnZhbCgpO1xuXHRcdFx0eW91dHViZS5wYXVzZSgpO1xuXHRcdFx0aWYgKHlvdVR1YmVJZnJhbWUpIHtcblx0XHRcdFx0eW91VHViZUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0eW91dHViZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHlvdVR1YmVJZnJhbWUpIHtcblx0XHRcdFx0eW91VHViZUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR5b3V0dWJlLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHR5b3VUdWJlQXBpLmRlc3Ryb3koKTtcblx0XHR9O1xuXHRcdHlvdXR1YmUuaW50ZXJ2YWwgPSBudWxsO1xuXG5cdFx0eW91dHViZS5zdGFydEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0Ly8gY3JlYXRlIHRpbWVyXG5cdFx0XHR5b3V0dWJlLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgeW91dHViZSk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0fSwgMjUwKTtcblx0XHR9O1xuXHRcdHlvdXR1YmUuc3RvcEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0aWYgKHlvdXR1YmUuaW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh5b3V0dWJlLmludGVydmFsKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHlvdXR1YmU7XG5cdH1cbn07XG5cbmlmICh3aW5kb3cucG9zdE1lc3NhZ2UgJiYgdHlwZW9mIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG5cblx0d2luZG93Lm9uWW91VHViZVBsYXllckFQSVJlYWR5ID0gKCkgPT4ge1xuXHRcdFlvdVR1YmVBcGkuaUZyYW1lUmVhZHkoKTtcblx0fTtcblxuXHR0eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHRcdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiAodXJsLmluY2x1ZGVzKCcvL3d3dy55b3V0dWJlJykgfHwgdXJsLmluY2x1ZGVzKCcvL3lvdXR1LmJlJykpID8gJ3ZpZGVvL3gteW91dHViZScgOiBudWxsO1xuXHR9KTtcblxuXHRyZW5kZXJlci5hZGQoWW91VHViZUlmcmFtZVJlbmRlcmVyKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbmV4cG9ydCBjb25zdCBOQVYgPSB3aW5kb3cubmF2aWdhdG9yO1xuZXhwb3J0IGNvbnN0IFVBID0gTkFWLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgSVNfSVBBRCA9IChVQS5tYXRjaCgvaXBhZC9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSVBIT05FID0gKFVBLm1hdGNoKC9pcGhvbmUvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lPUyA9IElTX0lQSE9ORSB8fCBJU19JUEFEO1xuZXhwb3J0IGNvbnN0IElTX0FORFJPSUQgPSAoVUEubWF0Y2goL2FuZHJvaWQvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lFID0gKE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ21pY3Jvc29mdCcpIHx8IE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkubWF0Y2goL3RyaWRlbnQvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19DSFJPTUUgPSAoVUEubWF0Y2goL2Nocm9tZS9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0ZJUkVGT1ggPSAoVUEubWF0Y2goL2ZpcmVmb3gvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19TQUZBUkkgPSAoVUEubWF0Y2goL3NhZmFyaS9naSkgIT09IG51bGwpICYmICFJU19DSFJPTUU7XG5leHBvcnQgY29uc3QgSVNfU1RPQ0tfQU5EUk9JRCA9IChVQS5tYXRjaCgvXm1vemlsbGFcXC9cXGQrXFwuXFxkK1xcc1xcKGxpbnV4O1xcc3U7L2dpKSAhPT0gbnVsbCk7XG5cbmV4cG9ydCBjb25zdCBIQVNfVE9VQ0ggPSAhISgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKTtcbmV4cG9ydCBjb25zdCBIQVNfTVNFID0gKCdNZWRpYVNvdXJjZScgaW4gd2luZG93KTtcbmV4cG9ydCBjb25zdCBTVVBQT1JUX1BPSU5URVJfRVZFTlRTID0gKCgpID0+IHtcblx0bGV0XG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKSxcblx0XHRkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLFxuXHRcdHN1cHBvcnRzXG5cdDtcblxuXHRpZiAoISgncG9pbnRlckV2ZW50cycgaW4gZWxlbWVudC5zdHlsZSkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG5cdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICd4Jztcblx0ZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXHRzdXBwb3J0cyA9IGdldENvbXB1dGVkU3R5bGUgJiYgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAnJykucG9pbnRlckV2ZW50cyA9PT0gJ2F1dG8nO1xuXHRkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdHJldHVybiAhIXN1cHBvcnRzO1xufSkoKTtcblxuLy8gZm9yIElFXG5sZXQgaHRtbDVFbGVtZW50cyA9IFsnc291cmNlJywgJ3RyYWNrJywgJ2F1ZGlvJywgJ3ZpZGVvJ10sIHZpZGVvO1xuXG5mb3IgKGxldCBpID0gMCwgaWwgPSBodG1sNUVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0dmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGh0bWw1RWxlbWVudHNbaV0pO1xufVxuXG4vLyBUZXN0IGlmIE1lZGlhIFNvdXJjZSBFeHRlbnNpb25zIGFyZSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuZXhwb3J0IGNvbnN0IFNVUFBPUlRTX01FRElBX1RBRyA9ICh2aWRlby5jYW5QbGF5VHlwZSAhPT0gdW5kZWZpbmVkIHx8IEhBU19NU0UpO1xuXG4vLyBUZXN0IGlmIGJyb3dzZXJzIHN1cHBvcnQgSExTIG5hdGl2ZWx5IChyaWdodCBub3cgU2FmYXJpLCBBbmRyb2lkJ3MgQ2hyb21lIGFuZCBTdG9jayBicm93c2VycywgYW5kIE1TIEVkZ2UpXG5leHBvcnQgY29uc3QgU1VQUE9SVFNfTkFUSVZFX0hMUyA9IChJU19TQUZBUkkgfHwgKElTX0FORFJPSUQgJiYgKElTX0NIUk9NRSB8fCBJU19TVE9DS19BTkRST0lEKSkgfHwgKElTX0lFICYmIFVBLm1hdGNoKC9lZGdlL2dpKSAhPT0gbnVsbCkpO1xuXG4vLyBEZXRlY3QgbmF0aXZlIEphdmFTY3JpcHQgZnVsbHNjcmVlbiAoU2FmYXJpL0ZpcmVmb3ggb25seSwgQ2hyb21lIHN0aWxsIGZhaWxzKVxuXG4vLyBpT1NcbmxldCBoYXNpT1NGdWxsU2NyZWVuID0gKHZpZGVvLndlYmtpdEVudGVyRnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gVzNDXG5sZXQgaGFzTmF0aXZlRnVsbHNjcmVlbiA9ICh2aWRlby5yZXF1ZXN0RnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gT1MgWCAxMC41IGNhbid0IGRvIHRoaXMgZXZlbiBpZiBpdCBzYXlzIGl0IGNhbiA6KFxuaWYgKGhhc2lPU0Z1bGxTY3JlZW4gJiYgVUEubWF0Y2goL21hYyBvcyB4IDEwXzUvaSkpIHtcblx0aGFzTmF0aXZlRnVsbHNjcmVlbiA9IGZhbHNlO1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbi8vIHdlYmtpdC9maXJlZm94L0lFMTErXG5sZXQgaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcbmxldCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLm1velJlcXVlc3RGdWxsU2NyZWVuICE9PSB1bmRlZmluZWQpO1xubGV0IGhhc01zTmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby5tc1JlcXVlc3RGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG5sZXQgaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiB8fCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuIHx8IGhhc01zTmF0aXZlRnVsbFNjcmVlbik7XG5sZXQgbmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbjtcblxubGV0IGZ1bGxTY3JlZW5FdmVudE5hbWUgPSAnJztcbmxldCBpc0Z1bGxTY3JlZW4sIHJlcXVlc3RGdWxsU2NyZWVuLCBjYW5jZWxGdWxsU2NyZWVuO1xuXG4vLyBFbmFibGVkP1xuaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0bmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRW5hYmxlZDtcbn0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdG5hdGl2ZUZ1bGxTY3JlZW5FbmFibGVkID0gZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZDtcbn1cblxuaWYgKElTX0NIUk9NRSkge1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbmlmIChoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbikge1xuXG5cdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICdtb3pmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ01TRnVsbHNjcmVlbkNoYW5nZSc7XG5cdH1cblxuXHRpc0Z1bGxTY3JlZW4gPSAoKSA9PiAge1xuXHRcdGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LndlYmtpdElzRnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbDtcblx0XHR9XG5cdH07XG5cblx0cmVxdWVzdEZ1bGxTY3JlZW4gPSAoZWwpID0+IHtcblxuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSBpZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHR9IGVsc2UgaWYgKGhhc01zTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fTtcblxuXHRjYW5jZWxGdWxsU2NyZWVuID0gKCkgPT4ge1xuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG5cblx0XHR9IGVsc2UgaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG5cblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBIQVNfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNOYXRpdmVGdWxsc2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19XRUJLSVRfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc01zTmF0aXZlRnVsbFNjcmVlbjtcbmV4cG9ydCBjb25zdCBIQVNfSU9TX0ZVTExTQ1JFRU4gPSBoYXNpT1NGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOID0gaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX05BVElWRV9GVUxMU0NSRUVOX0VOQUJMRUQgPSBuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZDtcbmV4cG9ydCBjb25zdCBGVUxMU0NSRUVOX0VWRU5UX05BTUUgPSBmdWxsU2NyZWVuRXZlbnROYW1lO1xuXG5leHBvcnQge2lzRnVsbFNjcmVlbiwgcmVxdWVzdEZ1bGxTY3JlZW4sIGNhbmNlbEZ1bGxTY3JlZW59O1xuXG5tZWpzLkZlYXR1cmVzID0gbWVqcy5GZWF0dXJlcyB8fCB7fTtcbm1lanMuRmVhdHVyZXMuaXNpUGFkID0gSVNfSVBBRDtcbm1lanMuRmVhdHVyZXMuaXNpUGhvbmUgPSBJU19JUEhPTkU7XG5tZWpzLkZlYXR1cmVzLmlzaU9TID0gbWVqcy5GZWF0dXJlcy5pc2lQaG9uZSB8fCBtZWpzLkZlYXR1cmVzLmlzaVBhZDtcbm1lanMuRmVhdHVyZXMuaXNBbmRyb2lkID0gSVNfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaXNJRSA9IElTX0lFO1xubWVqcy5GZWF0dXJlcy5pc0Nocm9tZSA9IElTX0NIUk9NRTtcbm1lanMuRmVhdHVyZXMuaXNGaXJlZm94ID0gSVNfRklSRUZPWDtcbm1lanMuRmVhdHVyZXMuaXNTYWZhcmkgPSBJU19TQUZBUkk7XG5tZWpzLkZlYXR1cmVzLmlzU3RvY2tBbmRyb2lkID0gSVNfU1RPQ0tfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaGFzVG91Y2ggPSBIQVNfVE9VQ0g7XG5tZWpzLkZlYXR1cmVzLmhhc01TRSA9IEhBU19NU0U7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTWVkaWFUYWcgPSBTVVBQT1JUU19NRURJQV9UQUc7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTmF0aXZlSExTID0gU1VQUE9SVFNfTkFUSVZFX0hMUztcblxubWVqcy5GZWF0dXJlcy5zdXBwb3J0c1BvaW50ZXJFdmVudHMgPSBTVVBQT1JUX1BPSU5URVJfRVZFTlRTO1xubWVqcy5GZWF0dXJlcy5oYXNpT1NGdWxsU2NyZWVuID0gSEFTX0lPU19GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNOYXRpdmVGdWxsc2NyZWVuID0gSEFTX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuID0gSEFTX1dFQktJVF9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzTW96TmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc01zTmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSBIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMubmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBIQVNfTkFUSVZFX0ZVTExTQ1JFRU5fRU5BQkxFRDtcbm1lanMuRmVhdHVyZXMuZnVsbFNjcmVlbkV2ZW50TmFtZSA9IEZVTExTQ1JFRU5fRVZFTlRfTkFNRTtcbm1lanMuRmVhdHVyZXMuaXNGdWxsU2NyZWVuID0gaXNGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5yZXF1ZXN0RnVsbFNjcmVlbiA9IHJlcXVlc3RGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5jYW5jZWxGdWxsU2NyZWVuID0gY2FuY2VsRnVsbFNjcmVlbjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEByZXR1cm4ge0V2ZW50fE9iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50IChldmVudE5hbWUsIHRhcmdldCkge1xuXG5cdGlmICh0eXBlb2YgZXZlbnROYW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignRXZlbnQgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgZXZlbnQ7XG5cblx0aWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG5cdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCBmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnQgPSB7fTtcblx0XHRldmVudC50eXBlID0gZXZlbnROYW1lO1xuXHRcdGV2ZW50LnRhcmdldCA9IHRhcmdldDtcblx0XHRldmVudC5jYW5jZWxlYWJsZSA9IHRydWU7XG5cdFx0ZXZlbnQuYnViYmFibGUgPSBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBldmVudDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXHRpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgZmFsc2UpO1xuXHR9IGVsc2UgaWYgKG9iai5hdHRhY2hFdmVudCkge1xuXHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdID0gZm47XG5cdFx0b2JqW2Ake3R5cGV9JHtmbn1gXSA9ICgpID0+IHtcblx0XHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdKHdpbmRvdy5ldmVudCk7XG5cdFx0fTtcblx0XHRvYmouYXR0YWNoRXZlbnQoYG9uJHt0eXBlfWAsIG9ialtgJHt0eXBlfSR7Zm59YF0pO1xuXHR9XG5cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXG5cdGlmIChvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuXHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAob2JqLmRldGFjaEV2ZW50KSB7XG5cdFx0b2JqLmRldGFjaEV2ZW50KGBvbiR7dHlwZX1gLCBvYmpbYCR7dHlwZX0ke2ZufWBdKTtcblx0XHRvYmpbYCR7dHlwZX0ke2ZufWBdID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0YXJnZXROb2RlIGFwcGVhcnMgYWZ0ZXIgc291cmNlTm9kZSBpbiB0aGUgZG9tLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc291cmNlTm9kZSAtIHRoZSBzb3VyY2Ugbm9kZSBmb3IgY29tcGFyaXNvblxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0Tm9kZSAtIHRoZSBub2RlIHRvIGNvbXBhcmUgYWdhaW5zdCBzb3VyY2VOb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBZnRlciAoc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSkge1xuXHRyZXR1cm4gISEoXG5cdFx0c291cmNlTm9kZSAmJlxuXHRcdHRhcmdldE5vZGUgJiZcblx0XHRzb3VyY2VOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldE5vZGUpICYmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HXG5cdCk7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5jcmVhdGVFdmVudCA9IGNyZWF0ZUV2ZW50O1xubWVqcy5VdGlscy5yZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50O1xubWVqcy5VdGlscy5pc05vZGVBZnRlciA9IGlzTm9kZUFmdGVyOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUhUTUwgKGlucHV0KSB7XG5cblx0aWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHBhc3NlZCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRjb25zdCBtYXAgPSB7XG5cdFx0JyYnOiAnJmFtcDsnLFxuXHRcdCc8JzogJyZsdDsnLFxuXHRcdCc+JzogJyZndDsnLFxuXHRcdCdcIic6ICcmcXVvdDsnXG5cdH07XG5cblx0cmV0dXJuIGlucHV0LnJlcGxhY2UoL1smPD5cIl0vZywgKGMpID0+IHtcblx0XHRyZXR1cm4gbWFwW2NdO1xuXHR9KTtcbn1cblxuLy8gdGFrZW4gZnJvbSB1bmRlcnNjb3JlXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UgKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG5cblx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygd2FpdCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgbnVtZXJpYyB2YWx1ZScpO1xuXHR9XG5cblx0bGV0IHRpbWVvdXQ7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0bGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdGxldCBsYXRlciA9ICgpID0+IHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGxldCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cblx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBjb250YWlucyBhbnkgZWxlbWVudHNcbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjc5OTE1L2hvdy1kby1pLXRlc3QtZm9yLWFuLWVtcHR5LWphdmFzY3JpcHQtb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdEVtcHR5IChpbnN0YW5jZSkge1xuXHRyZXR1cm4gKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluc3RhbmNlKS5sZW5ndGggPD0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEV2ZW50cyAoZXZlbnRzLCBpZCkge1xuXHRsZXQgcndpbmRvdyA9IC9eKChhZnRlcnxiZWZvcmUpcHJpbnR8KGJlZm9yZSk/dW5sb2FkfGhhc2hjaGFuZ2V8bWVzc2FnZXxvKGZmfG4pbGluZXxwYWdlKGhpZGV8c2hvdyl8cG9wc3RhdGV8cmVzaXplfHN0b3JhZ2UpXFxiLztcblx0Ly8gYWRkIHBsYXllciBJRCBhcyBhbiBldmVudCBuYW1lc3BhY2Ugc28gaXQncyBlYXNpZXIgdG8gdW5iaW5kIHRoZW0gYWxsIGxhdGVyXG5cdGxldCByZXQgPSB7ZDogW10sIHc6IFtdfTtcblx0KGV2ZW50cyB8fCAnJykuc3BsaXQoJyAnKS5mb3JFYWNoKCh2KSA9PiB7XG5cdFx0Y29uc3QgZXZlbnROYW1lID0gdiArICcuJyArIGlkO1xuXG5cdFx0aWYgKGV2ZW50TmFtZS5zdGFydHNXaXRoKCcuJykpIHtcblx0XHRcdHJldC5kLnB1c2goZXZlbnROYW1lKTtcblx0XHRcdHJldC53LnB1c2goZXZlbnROYW1lKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXRbcndpbmRvdy50ZXN0KHYpID8gJ3cnIDogJ2QnXS5wdXNoKGV2ZW50TmFtZSk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdHJldC5kID0gcmV0LmQuam9pbignICcpO1xuXHRyZXQudyA9IHJldC53LmpvaW4oJyAnKTtcblx0cmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtTdHJpbmd9IHRhZ1xuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUgKGNsYXNzTmFtZSwgbm9kZSwgdGFnKSB7XG5cblx0aWYgKG5vZGUgPT09IHVuZGVmaW5lZCB8fCBub2RlID09PSBudWxsKSB7XG5cdFx0bm9kZSA9IGRvY3VtZW50O1xuXHR9XG5cdGlmIChub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IHVuZGVmaW5lZCAmJiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IG51bGwpIHtcblx0XHRyZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XG5cdH1cblx0aWYgKHRhZyA9PT0gdW5kZWZpbmVkIHx8IHRhZyA9PT0gbnVsbCkge1xuXHRcdHRhZyA9ICcqJztcblx0fVxuXG5cdGxldFxuXHRcdGNsYXNzRWxlbWVudHMgPSBbXSxcblx0XHRqID0gMCxcblx0XHR0ZXN0c3RyLFxuXHRcdGVscyA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKSxcblx0XHRlbHNMZW4gPSBlbHMubGVuZ3RoXG5cdFx0O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbHNMZW47IGkrKykge1xuXHRcdGlmIChlbHNbaV0uY2xhc3NOYW1lLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG5cdFx0XHR0ZXN0c3RyID0gYCwke2Vsc1tpXS5jbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCcsJyl9LGA7XG5cdFx0XHRpZiAodGVzdHN0ci5pbmRleE9mKGAsJHtjbGFzc05hbWV9LGApID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NFbGVtZW50c1tqXSA9IGVsc1tpXTtcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjbGFzc0VsZW1lbnRzO1xufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuZXNjYXBlSFRNTCA9IGVzY2FwZUhUTUw7XG5tZWpzLlV0aWxzLmRlYm91bmNlID0gZGVib3VuY2U7XG5tZWpzLlV0aWxzLmlzT2JqZWN0RW1wdHkgPSBpc09iamVjdEVtcHR5O1xubWVqcy5VdGlscy5zcGxpdEV2ZW50cyA9IHNwbGl0RXZlbnRzO1xubWVqcy5VdGlscy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge2VzY2FwZUhUTUx9IGZyb20gJy4vZ2VuZXJhbCc7XG5cbmV4cG9ydCBsZXQgdHlwZUNoZWNrcyA9IFtdO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnNvbHV0aXplVXJsICh1cmwpIHtcblxuXHRpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B1cmxgIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRlbC5pbm5lckhUTUwgPSBgPGEgaHJlZj1cIiR7ZXNjYXBlSFRNTCh1cmwpfVwiPng8L2E+YDtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuaHJlZjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZvcm1hdCBvZiBhIHNwZWNpZmljIG1lZGlhLCBiYXNlZCBvbiBVUkwgYW5kIGFkZGl0aW9uYWxseSBpdHMgbWltZSB0eXBlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFR5cGUgKHVybCwgdHlwZSA9ICcnKSB7XG5cdHJldHVybiAodXJsICYmICF0eXBlKSA/IGdldFR5cGVGcm9tRmlsZSh1cmwpIDogZ2V0TWltZUZyb21UeXBlKHR5cGUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSBwYXJ0IG9mIHRoZSB0eXBlIGluIGNhc2UgdGhlIGF0dHJpYnV0ZSBjb250YWlucyB0aGUgY29kZWNcbiAqIChgdmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRSwgbXA0YS40MC4yXCJgIGJlY29tZXMgYHZpZGVvL21wNGApXG4gKlxuICogQHNlZSBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS92aWRlby5odG1sI3RoZS1zb3VyY2UtZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbWVGcm9tVHlwZSAodHlwZSkge1xuXG5cdGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B0eXBlYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRyZXR1cm4gKHR5cGUgJiYgfnR5cGUuaW5kZXhPZignOycpKSA/IHR5cGUuc3Vic3RyKDAsIHR5cGUuaW5kZXhPZignOycpKSA6IHR5cGU7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIG1lZGlhIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlRnJvbUZpbGUgKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IHR5cGU7XG5cblx0Ly8gVmFsaWRhdGUgYHR5cGVDaGVja3NgIGFycmF5XG5cdGlmICghQXJyYXkuaXNBcnJheSh0eXBlQ2hlY2tzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHR5cGVDaGVja3NgIG11c3QgYmUgYW4gYXJyYXknKTtcblx0fVxuXG5cdGlmICh0eXBlQ2hlY2tzLmxlbmd0aCkge1xuXHRcdGZvciAobGV0IGkgPSAwLCB0b3RhbCA9IHR5cGVDaGVja3MubGVuZ3RoOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVDaGVja3NbaV07XG5cblx0XHRcdGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaW4gYXJyYXkgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gZG8gdHlwZSBjaGVja3MgZmlyc3Rcblx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdHlwZUNoZWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cblx0XHR0eXBlID0gdHlwZUNoZWNrc1tpXSh1cmwpO1xuXG5cdFx0aWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlICE9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cdH1cblxuXHQvLyB0aGUgZG8gc3RhbmRhcmQgZXh0ZW5zaW9uIGNoZWNrXG5cdGxldFxuXHRcdGV4dCA9IGdldEV4dGVuc2lvbih1cmwpLFxuXHRcdG5vcm1hbGl6ZWRFeHQgPSBub3JtYWxpemVFeHRlbnNpb24oZXh0KVxuXHRcdDtcblxuXHRyZXR1cm4gKC8obXA0fG00dnxvZ2d8b2d2fHdlYm18d2VibXZ8Zmx2fHdtdnxtcGVnfG1vdikvZ2kudGVzdChleHQpID8gJ3ZpZGVvJyA6ICdhdWRpbycpICsgJy8nICsgbm9ybWFsaXplZEV4dDtcbn1cblxuLyoqXG4gKiBHZXQgbWVkaWEgZmlsZSBleHRlbnNpb24gZnJvbSBVUkxcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb24gKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IGJhc2VVcmwgPSB1cmwuc3BsaXQoJz8nKVswXTtcblxuXHRyZXR1cm4gfmJhc2VVcmwuaW5kZXhPZignLicpID8gYmFzZVVybC5zdWJzdHJpbmcoYmFzZVVybC5sYXN0SW5kZXhPZignLicpICsgMSkgOiAnJztcbn1cblxuLyoqXG4gKiBHZXQgc3RhbmRhcmQgZXh0ZW5zaW9uIG9mIGEgbWVkaWEgZmlsZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb25cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUV4dGVuc2lvbiAoZXh0ZW5zaW9uKSB7XG5cblx0aWYgKHR5cGVvZiBleHRlbnNpb24gIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgZXh0ZW5zaW9uYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRzd2l0Y2ggKGV4dGVuc2lvbikge1xuXHRcdGNhc2UgJ21wNCc6XG5cdFx0Y2FzZSAnbTR2Jzpcblx0XHRcdHJldHVybiAnbXA0Jztcblx0XHRjYXNlICd3ZWJtJzpcblx0XHRjYXNlICd3ZWJtYSc6XG5cdFx0Y2FzZSAnd2VibXYnOlxuXHRcdFx0cmV0dXJuICd3ZWJtJztcblx0XHRjYXNlICdvZ2cnOlxuXHRcdGNhc2UgJ29nYSc6XG5cdFx0Y2FzZSAnb2d2Jzpcblx0XHRcdHJldHVybiAnb2dnJztcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcblx0fVxufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuYWJzb2x1dGl6ZVVybCA9IGFic29sdXRpemVVcmw7XG5tZWpzLlV0aWxzLmZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlO1xubWVqcy5VdGlscy5nZXRNaW1lRnJvbVR5cGUgPSBnZXRNaW1lRnJvbVR5cGU7XG5tZWpzLlV0aWxzLmdldFR5cGVGcm9tRmlsZSA9IGdldFR5cGVGcm9tRmlsZTtcbm1lanMuVXRpbHMuZ2V0RXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uO1xubWVqcy5VdGlscy5ub3JtYWxpemVFeHRlbnNpb24gPSBub3JtYWxpemVFeHRlbnNpb247XG4iLCJpbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcblxuLyoqXG4gKiBQb2x5ZmlsbFxuICpcbiAqIE1pbWljcyB0aGUgbWlzc2luZyBtZXRob2RzIGxpa2UgT2JqZWN0LmFzc2lnbiwgQXJyYXkuaW5jbHVkZXMsIGV0Yy4sIGFzIGEgd2F5IHRvIGF2b2lkIGluY2x1ZGluZyB0aGUgd2hvbGUgbGlzdFxuICogb2YgcG9seWZpbGxzIHByb3ZpZGVkIGJ5IEJhYmVsLlxuICovXG5cbi8vIElFNiw3LDhcbi8vIFByb2R1Y3Rpb24gc3RlcHMgb2YgRUNNQS0yNjIsIEVkaXRpb24gNSwgMTUuNC40LjE0XG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE0XG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkgPT4ge1xuXG5cdFx0bGV0IGs7XG5cblx0XHQvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZ1xuXHRcdC8vXHQgICB0aGUgdGhpcyB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG5cdFx0aWYgKHRoaXMgPT09IHVuZGVmaW5lZCB8fCB0aGlzID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG5cdFx0fVxuXG5cdFx0bGV0IE8gPSBPYmplY3QodGhpcyk7XG5cblx0XHQvLyAyLiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRcblx0XHQvL1x0ICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cblx0XHQvLyAzLiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cblx0XHRsZXQgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cblx0XHQvLyA0LiBJZiBsZW4gaXMgMCwgcmV0dXJuIC0xLlxuXHRcdGlmIChsZW4gPT09IDApIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHQvLyA1LiBJZiBhcmd1bWVudCBmcm9tSW5kZXggd2FzIHBhc3NlZCBsZXQgbiBiZVxuXHRcdC8vXHQgICBUb0ludGVnZXIoZnJvbUluZGV4KTsgZWxzZSBsZXQgbiBiZSAwLlxuXHRcdGxldCBuID0gK2Zyb21JbmRleCB8fCAwO1xuXG5cdFx0aWYgKE1hdGguYWJzKG4pID09PSBJbmZpbml0eSkge1xuXHRcdFx0biA9IDA7XG5cdFx0fVxuXG5cdFx0Ly8gNi4gSWYgbiA+PSBsZW4sIHJldHVybiAtMS5cblx0XHRpZiAobiA+PSBsZW4pIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHQvLyA3LiBJZiBuID49IDAsIHRoZW4gTGV0IGsgYmUgbi5cblx0XHQvLyA4LiBFbHNlLCBuPDAsIExldCBrIGJlIGxlbiAtIGFicyhuKS5cblx0XHQvL1x0ICAgSWYgayBpcyBsZXNzIHRoYW4gMCwgdGhlbiBsZXQgayBiZSAwLlxuXHRcdGsgPSBNYXRoLm1heChuID49IDAgPyBuIDogbGVuIC0gTWF0aC5hYnMobiksIDApO1xuXG5cdFx0Ly8gOS4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG5cdFx0d2hpbGUgKGsgPCBsZW4pIHtcblx0XHRcdC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cblx0XHRcdC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuXHRcdFx0Ly8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGVcblx0XHRcdC8vXHRIYXNQcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuXHRcdFx0Ly8gICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggY1xuXHRcdFx0Ly8gYy4gSWYga1ByZXNlbnQgaXMgdHJ1ZSwgdGhlblxuXHRcdFx0Ly9cdGkuXHRMZXQgZWxlbWVudEsgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRcblx0XHRcdC8vXHRcdGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFRvU3RyaW5nKGspLlxuXHRcdFx0Ly8gICBpaS5cdExldCBzYW1lIGJlIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlXG5cdFx0XHQvL1x0XHRTdHJpY3QgRXF1YWxpdHkgQ29tcGFyaXNvbiBBbGdvcml0aG0gdG9cblx0XHRcdC8vXHRcdHNlYXJjaEVsZW1lbnQgYW5kIGVsZW1lbnRLLlxuXHRcdFx0Ly8gIGlpaS5cdElmIHNhbWUgaXMgdHJ1ZSwgcmV0dXJuIGsuXG5cdFx0XHRpZiAoayBpbiBPICYmIE9ba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGs7XG5cdFx0XHR9XG5cdFx0XHRrKys7XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fTtcbn1cblxuLy8gZG9jdW1lbnQuY3JlYXRlRXZlbnQgZm9yIElFOCBvciBvdGhlciBvbGQgYnJvd3NlcnMgdGhhdCBkbyBub3QgaW1wbGVtZW50IGl0XG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uL2llOC9ibG9iL21hc3Rlci9idWlsZC9pZTgubWF4LmpzXG5pZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT09IHVuZGVmaW5lZCkge1xuXHRkb2N1bWVudC5jcmVhdGVFdmVudCA9ICgpID0+IHtcblxuXHRcdGxldCBlO1xuXG5cdFx0ZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG5cdFx0ZS50aW1lU3RhbXAgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXHRcdGUuZW51bWVyYWJsZSA9IHRydWU7XG5cdFx0ZS53cml0YWJsZSA9IHRydWU7XG5cdFx0ZS5jb25maWd1cmFibGUgPSB0cnVlO1xuXG5cdFx0ZS5pbml0RXZlbnQgPSAodHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSkgPT4ge1xuXHRcdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRcdHRoaXMuYnViYmxlcyA9ICEhYnViYmxlcztcblx0XHRcdHRoaXMuY2FuY2VsYWJsZSA9ICEhY2FuY2VsYWJsZTtcblx0XHRcdGlmICghdGhpcy5idWJibGVzKSB7XG5cdFx0XHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuc3RvcHBlZFByb3BhZ2F0aW9uID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBlO1xuXHR9O1xufVxuXG4vLyBPYmplY3QuYXNzaWduIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24jUG9seWZpbGxcbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuXHRPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgdmFyQXJncykgeyAvLyAubGVuZ3RoIG9mIGZ1bmN0aW9uIGlzIDJcblxuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRpZiAodGFyZ2V0ID09PSBudWxsIHx8IHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7IC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0bGV0IHRvID0gT2JqZWN0KHRhcmdldCk7XG5cblx0XHRmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuXG5cdFx0XHRpZiAobmV4dFNvdXJjZSAhPT0gbnVsbCkgeyAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdFx0Zm9yIChsZXQgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XG5cdFx0XHRcdFx0Ly8gQXZvaWQgYnVncyB3aGVuIGhhc093blByb3BlcnR5IGlzIHNoYWRvd2VkXG5cdFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXh0U291cmNlLCBuZXh0S2V5KSkge1xuXHRcdFx0XHRcdFx0dG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdG87XG5cdH07XG59XG5cbi8vIEFycmF5LmluY2x1ZGVzIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luY2x1ZGVzI1BvbHlmaWxsXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmNsdWRlcykge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnaW5jbHVkZXMnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xuXG5cdFx0XHQvLyAxLiBMZXQgTyBiZSA/IFRvT2JqZWN0KHRoaXMgdmFsdWUpLlxuXHRcdFx0aWYgKHRoaXMgPT09IG51bGwgfHwgdGhpcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IG8gPSBPYmplY3QodGhpcyk7XG5cblx0XHRcdC8vIDIuIExldCBsZW4gYmUgPyBUb0xlbmd0aCg/IEdldChPLCBcImxlbmd0aFwiKSkuXG5cdFx0XHRsZXQgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cblx0XHRcdC8vIDMuIElmIGxlbiBpcyAwLCByZXR1cm4gZmFsc2UuXG5cdFx0XHRpZiAobGVuID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gNC4gTGV0IG4gYmUgPyBUb0ludGVnZXIoZnJvbUluZGV4KS5cblx0XHRcdC8vICAgIChJZiBmcm9tSW5kZXggaXMgdW5kZWZpbmVkLCB0aGlzIHN0ZXAgcHJvZHVjZXMgdGhlIHZhbHVlIDAuKVxuXHRcdFx0bGV0IG4gPSBmcm9tSW5kZXggfCAwO1xuXG5cdFx0XHQvLyA1LiBJZiBuIOKJpSAwLCB0aGVuXG5cdFx0XHQvLyAgYS4gTGV0IGsgYmUgbi5cblx0XHRcdC8vIDYuIEVsc2UgbiA8IDAsXG5cdFx0XHQvLyAgYS4gTGV0IGsgYmUgbGVuICsgbi5cblx0XHRcdC8vICBiLiBJZiBrIDwgMCwgbGV0IGsgYmUgMC5cblx0XHRcdGxldCBrID0gTWF0aC5tYXgobiA+PSAwID8gbiA6IGxlbiAtIE1hdGguYWJzKG4pLCAwKTtcblxuXHRcdFx0Ly8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG5cdFx0XHR3aGlsZSAoayA8IGxlbikge1xuXHRcdFx0XHQvLyBhLiBMZXQgZWxlbWVudEsgYmUgdGhlIHJlc3VsdCBvZiA/IEdldChPLCAhIFRvU3RyaW5nKGspKS5cblx0XHRcdFx0Ly8gYi4gSWYgU2FtZVZhbHVlWmVybyhzZWFyY2hFbGVtZW50LCBlbGVtZW50SykgaXMgdHJ1ZSwgcmV0dXJuIHRydWUuXG5cdFx0XHRcdC8vIGMuIEluY3JlYXNlIGsgYnkgMS5cblx0XHRcdFx0Ly8gTk9URTogPT09IHByb3ZpZGVzIHRoZSBjb3JyZWN0IFwiU2FtZVZhbHVlWmVyb1wiIGNvbXBhcmlzb24gbmVlZGVkIGhlcmUuXG5cdFx0XHRcdGlmIChvW2tdID09PSBzZWFyY2hFbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aysrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyA4LiBSZXR1cm4gZmFsc2Vcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpIHtcblx0U3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTdHJpbmcucHJvdG90eXBlLmluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSAhPT0gLTE7XG5cdH07XG59XG5cbi8vIFN0cmluZy5zdGFydHNXaXRoIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9zdGFydHNXaXRoI1BvbHlmaWxsXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCkge1xuXHRTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKXtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic3RyKHBvc2l0aW9uLCBzZWFyY2hTdHJpbmcubGVuZ3RoKSA9PT0gc2VhcmNoU3RyaW5nO1xuXHR9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuLyoqXG4gKiBGb3JtYXQgYSBudW1lcmljIHRpbWUgaW4gZm9ybWF0ICcwMDowMDowMCdcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIElkZWFsbHkgYSBudW1iZXIsIGJ1dCBpZiBub3Qgb3IgbGVzcyB0aGFuIHplcm8sIGlzIGRlZmF1bHRlZCB0byB6ZXJvXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZvcmNlSG91cnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvd0ZyYW1lQ291bnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2Vjb25kc1RvVGltZUNvZGUgKHRpbWUsIGZvcmNlSG91cnMgPSBmYWxzZSwgc2hvd0ZyYW1lQ291bnQgPSBmYWxzZSwgZnBzID0gMjUpIHtcblxuXHR0aW1lID0gIXRpbWUgfHwgdHlwZW9mIHRpbWUgIT09ICdudW1iZXInIHx8IHRpbWUgPCAwID8gMCA6IHRpbWU7XG5cblx0bGV0IGhvdXJzID0gTWF0aC5mbG9vcih0aW1lIC8gMzYwMCkgJSAyNDtcblx0bGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRpbWUgLyA2MCkgJSA2MDtcblx0bGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgJSA2MCk7XG5cdGxldCBmcmFtZXMgPSBNYXRoLmZsb29yKCgodGltZSAlIDEpICogZnBzKS50b0ZpeGVkKDMpKTtcblxuXHRob3VycyA9IGhvdXJzIDw9IDAgPyAwIDogaG91cnM7XG5cdG1pbnV0ZXMgPSBtaW51dGVzIDw9IDAgPyAwIDogbWludXRlcztcblx0c2Vjb25kcyA9IHNlY29uZHMgPD0gMCA/IDAgOiBzZWNvbmRzO1xuXG5cdGxldCByZXN1bHQgPSAoZm9yY2VIb3VycyB8fCBob3VycyA+IDApID8gYCR7KGhvdXJzIDwgMTAgPyBgMCR7aG91cnN9YCA6IGhvdXJzKX06YCA6ICcnO1xuXHRyZXN1bHQgKz0gYCR7KG1pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzKX06YDtcblx0cmVzdWx0ICs9IGAkeyhzZWNvbmRzIDwgMTAgPyBgMCR7c2Vjb25kc31gIDogc2Vjb25kcyl9YDtcblx0cmVzdWx0ICs9IGAkeygoc2hvd0ZyYW1lQ291bnQpID8gYDokeyhmcmFtZXMgPCAxMCA/IGAwJHtmcmFtZXN9YCA6IGZyYW1lcyl9YCA6ICcnKX1gO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydCBhICcwMDowMDowMCcgdGltZSBzdHJpbmcgaW50byBzZWNvbmRzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRpbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvd0ZyYW1lQ291bnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUNvZGVUb1NlY29uZHMgKHRpbWUsIHNob3dGcmFtZUNvdW50ID0gZmFsc2UsIGZwcyA9IDI1KSB7XG5cblx0aWYgKHR5cGVvZiB0aW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RpbWUgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0aWYgKCF0aW1lLm1hdGNoKC9cXGR7Mn0oXFw6XFxkezJ9KXswLDN9LykpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaW1lIGNvZGUgbXVzdCBoYXZlIHRoZSBmb3JtYXQgYDAwOjAwOjAwYCcpO1xuXHR9XG5cblx0bGV0XG5cdFx0cGFydHMgPSB0aW1lLnNwbGl0KCc6JyksXG5cdFx0aG91cnMgPSAwLFxuXHRcdG1pbnV0ZXMgPSAwLFxuXHRcdGZyYW1lcyA9IDAsXG5cdFx0c2Vjb25kcyA9IDAsXG5cdFx0b3V0cHV0XG5cdFx0O1xuXG5cdHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG5cdFx0ZGVmYXVsdDpcblx0XHRjYXNlIDE6XG5cdFx0XHRzZWNvbmRzID0gcGFyc2VJbnQocGFydHNbMF0sIDEwKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdG1pbnV0ZXMgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuXHRcdFx0c2Vjb25kcyA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDM6XG5cdFx0Y2FzZSA0OlxuXHRcdFx0aG91cnMgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuXHRcdFx0bWludXRlcyA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG5cdFx0XHRzZWNvbmRzID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcblx0XHRcdGZyYW1lcyA9IHNob3dGcmFtZUNvdW50ID8gcGFyc2VJbnQocGFydHNbM10pIC8gZnBzIDogMDtcblx0XHRcdGJyZWFrO1xuXG5cdH1cblxuXHRvdXRwdXQgPSAoIGhvdXJzICogMzYwMCApICsgKCBtaW51dGVzICogNjAgKSArIHNlY29uZHMgKyBmcmFtZXM7XG5cdHJldHVybiBwYXJzZUZsb2F0KChvdXRwdXQpLnRvRml4ZWQoMykpO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgdGltZSBmb3JtYXQgdG8gdXNlXG4gKlxuICogVGhlcmUgaXMgYSBkZWZhdWx0IGZvcm1hdCBzZXQgaW4gdGhlIG9wdGlvbnMgYnV0IGl0IGNhbiBiZSBpbmNvbXBsZXRlLCBzbyBpdCBpcyBhZGp1c3RlZCBhY2NvcmRpbmcgdG8gdGhlIG1lZGlhXG4gKiBkdXJhdGlvbi4gRm9ybWF0OiAnaGg6bW06c3M6ZmYnXG4gKiBAcGFyYW0geyp9IHRpbWUgLSBJZGVhbGx5IGEgbnVtYmVyLCBidXQgaWYgbm90IG9yIGxlc3MgdGhhbiB6ZXJvLCBpcyBkZWZhdWx0ZWQgdG8gemVyb1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlVGltZUZvcm1hdCAodGltZSwgb3B0aW9ucywgZnBzID0gMjUpIHtcblxuXHR0aW1lID0gIXRpbWUgfHwgdHlwZW9mIHRpbWUgIT09ICdudW1iZXInIHx8IHRpbWUgPCAwID8gMCA6IHRpbWU7XG5cblx0bGV0XG5cdFx0cmVxdWlyZWQgPSBmYWxzZSxcblx0XHRmb3JtYXQgPSBvcHRpb25zLnRpbWVGb3JtYXQsXG5cdFx0Zmlyc3RDaGFyID0gZm9ybWF0WzBdLFxuXHRcdGZpcnN0VHdvUGxhY2VzID0gKGZvcm1hdFsxXSA9PT0gZm9ybWF0WzBdKSxcblx0XHRzZXBhcmF0b3JJbmRleCA9IGZpcnN0VHdvUGxhY2VzID8gMiA6IDEsXG5cdFx0c2VwYXJhdG9yID0gZm9ybWF0Lmxlbmd0aCA8IHNlcGFyYXRvckluZGV4ID8gZm9ybWF0W3NlcGFyYXRvckluZGV4XSA6ICc6Jyxcblx0XHRob3VycyA9IE1hdGguZmxvb3IodGltZSAvIDM2MDApICUgMjQsXG5cdFx0bWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwLFxuXHRcdHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgJSA2MCksXG5cdFx0ZnJhbWVzID0gTWF0aC5mbG9vcigoKHRpbWUgJSAxKSAqIGZwcykudG9GaXhlZCgzKSksXG5cdFx0bGlzID0gW1xuXHRcdFx0W2ZyYW1lcywgJ2YnXSxcblx0XHRcdFtzZWNvbmRzLCAncyddLFxuXHRcdFx0W21pbnV0ZXMsICdtJ10sXG5cdFx0XHRbaG91cnMsICdoJ11cblx0XHRdXG5cdFx0O1xuXG5cdGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRpZiAoZm9ybWF0LmluZGV4T2YobGlzW2ldWzFdKSA+IC0xKSB7XG5cdFx0XHRyZXF1aXJlZCA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHJlcXVpcmVkKSB7XG5cdFx0XHRsZXQgaGFzTmV4dFZhbHVlID0gZmFsc2U7XG5cdFx0XHRmb3IgKGxldCBqID0gaTsgaiA8IGxlbjsgaisrKSB7XG5cdFx0XHRcdGlmIChsaXNbal1bMF0gPiAwKSB7XG5cdFx0XHRcdFx0aGFzTmV4dFZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWhhc05leHRWYWx1ZSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFmaXJzdFR3b1BsYWNlcykge1xuXHRcdFx0XHRmb3JtYXQgPSBmaXJzdENoYXIgKyBmb3JtYXQ7XG5cdFx0XHR9XG5cdFx0XHRmb3JtYXQgPSBsaXNbaV1bMV0gKyBzZXBhcmF0b3IgKyBmb3JtYXQ7XG5cdFx0XHRpZiAoZmlyc3RUd29QbGFjZXMpIHtcblx0XHRcdFx0Zm9ybWF0ID0gbGlzW2ldWzFdICsgZm9ybWF0O1xuXHRcdFx0fVxuXHRcdFx0Zmlyc3RDaGFyID0gbGlzW2ldWzFdO1xuXHRcdH1cblx0fVxuXG5cdG9wdGlvbnMuY3VycmVudFRpbWVGb3JtYXQgPSBmb3JtYXQ7XG59XG5cbi8qKlxuICogQ29udmVydCBTb2NpZXR5IG9mIE1vdGlvbiBQaWN0dXJlIGFuZCBUZWxldmlzaW9uIEVuZ2luZWVycyAoU01UUEUpIHRpbWUgY29kZSBpbnRvIHNlY29uZHNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gU01QVEVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTTVBURXRvU2Vjb25kcyAoU01QVEUpIHtcblxuXHRpZiAodHlwZW9mIFNNUFRFICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcgdmFsdWUnKTtcblx0fVxuXG5cdFNNUFRFID0gU01QVEUucmVwbGFjZSgnLCcsICcuJyk7XG5cblx0bGV0XG5cdFx0c2VjcyA9IDAsXG5cdFx0ZGVjaW1hbExlbiA9IChTTVBURS5pbmRleE9mKCcuJykgPiAtMSkgPyBTTVBURS5zcGxpdCgnLicpWzFdLmxlbmd0aCA6IDAsXG5cdFx0bXVsdGlwbGllciA9IDFcblx0XHQ7XG5cblx0U01QVEUgPSBTTVBURS5zcGxpdCgnOicpLnJldmVyc2UoKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IFNNUFRFLmxlbmd0aDsgaSsrKSB7XG5cdFx0bXVsdGlwbGllciA9IDE7XG5cdFx0aWYgKGkgPiAwKSB7XG5cdFx0XHRtdWx0aXBsaWVyID0gTWF0aC5wb3coNjAsIGkpO1xuXHRcdH1cblx0XHRzZWNzICs9IE51bWJlcihTTVBURVtpXSkgKiBtdWx0aXBsaWVyO1xuXHR9XG5cdHJldHVybiBOdW1iZXIoc2Vjcy50b0ZpeGVkKGRlY2ltYWxMZW4pKTtcbn1cblxubWVqcy5VdGlscyA9IG1lanMuVXRpbHMgfHwge307XG5tZWpzLlV0aWxzLnNlY29uZHNUb1RpbWVDb2RlID0gc2Vjb25kc1RvVGltZUNvZGU7XG5tZWpzLlV0aWxzLnRpbWVDb2RlVG9TZWNvbmRzID0gdGltZUNvZGVUb1NlY29uZHM7XG5tZWpzLlV0aWxzLmNhbGN1bGF0ZVRpbWVGb3JtYXQgPSBjYWxjdWxhdGVUaW1lRm9ybWF0O1xubWVqcy5VdGlscy5jb252ZXJ0U01QVEV0b1NlY29uZHMgPSBjb252ZXJ0U01QVEV0b1NlY29uZHM7Il19
