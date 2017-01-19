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

var _general = _dereq_(19);

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

},{"14":14,"19":19,"6":6}],5:[function(_dereq_,module,exports){
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

var _media = _dereq_(20);

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

},{"2":2,"20":20,"3":3,"6":6,"7":7}],6:[function(_dereq_,module,exports){
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

var _constants = _dereq_(17);

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

},{"16":16,"17":17,"2":2,"3":3,"4":4,"6":6}],9:[function(_dereq_,module,exports){
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

var _constants = _dereq_(17);

var _time = _dereq_(21);

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

},{"16":16,"17":17,"21":21,"4":4}],11:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(21);

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

},{"16":16,"21":21}],12:[function(_dereq_,module,exports){
'use strict';

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(21);

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

},{"16":16,"21":21,"4":4,"6":6}],13:[function(_dereq_,module,exports){
'use strict';

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(4);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(17);

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

},{"16":16,"17":17,"4":4}],14:[function(_dereq_,module,exports){
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

var _constants = _dereq_(17);

var _general = _dereq_(19);

var _time = _dereq_(21);

var _dom = _dereq_(18);

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

},{"17":17,"18":18,"19":19,"2":2,"21":21,"3":3,"4":4,"5":5,"6":6}],17:[function(_dereq_,module,exports){
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

},{"2":2,"3":3,"6":6}],18:[function(_dereq_,module,exports){
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

},{"2":2,"6":6}],19:[function(_dereq_,module,exports){
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

},{"2":2,"6":6}],20:[function(_dereq_,module,exports){
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

var _general = _dereq_(19);

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

},{"19":19,"6":6}],21:[function(_dereq_,module,exports){
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

},{"6":6}]},{},[15,16,8,9,10,11,12,13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2NvcmUvaTE4bi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lZGlhZWxlbWVudC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lanMuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvY29yZS9yZW5kZXJlci5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9mdWxsc2NyZWVuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3BsYXlwYXVzZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9wcm9ncmVzcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy90aW1lLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3RyYWNrcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy92b2x1bWUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvbGFuZ3VhZ2VzL2VuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2xpYnJhcnkuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcGxheWVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3V0aWxzL2NvbnN0YW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9kb20uanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvdXRpbHMvZ2VuZXJhbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9tZWRpYS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy90aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7QUFNQSxJQUFJLE9BQU8sRUFBQyxNQUFNLElBQVAsRUFBYSxVQUFiLEVBQVg7O0FBRUE7Ozs7OztBQU1BLEtBQUssUUFBTCxHQUFnQixZQUFhO0FBQUEsbUNBQVQsSUFBUztBQUFULE1BQVM7QUFBQTs7QUFFNUIsS0FBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxTQUExQixJQUF1QyxLQUFLLE1BQWhELEVBQXdEOztBQUV2RCxNQUFJLE9BQU8sS0FBSyxDQUFMLENBQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDaEMsU0FBTSxJQUFJLFNBQUosQ0FBYyxzQ0FBZCxDQUFOO0FBQ0E7O0FBRUQsTUFBSSxDQUFDLEtBQUssQ0FBTCxFQUFRLEtBQVIsQ0FBYywwQkFBZCxDQUFMLEVBQWdEO0FBQy9DLFNBQU0sSUFBSSxTQUFKLENBQWMsZ0RBQWQsQ0FBTjtBQUNBOztBQUVELE9BQUssSUFBTCxHQUFZLEtBQUssQ0FBTCxDQUFaOztBQUVBO0FB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QU0sS0FBTixDQUFZLEdBQVosRUFBaUIsQ0FBakIsRUFBb0IsTUFBaEQsR0FBeUQsQ0FGdkU7QUFBQSxLQUdDLGFBQWEsQ0FIZDs7QUFNQSxTQUFRLE1BQU0sS0FBTixDQUFZLEdBQVosRUFBaUIsT0FBakIsRUFBUjs7QUFFQSxNQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUN0QyxlQUFhLENBQWI7QUFDQSxNQUFJLElBQUksQ0FBUixFQUFXO0FBQ1YsZ0JBQWEsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLENBQWIsQ0FBYjtBQUNBO0FBQ0QsVUFBUSxPQUFPLE1BQU0sQ0FBTixDQUFQLElBQW1CLFVBQTNCO0FBQ0E7QUFDRCxRQUFPLE9BQU8sS0FBSyxPQUFMLENBQWEsVUFBYixDQUFQLENBQVA7QUFDQTs7QUFFRCxlQUFLLEtBQUwsR0FBYSxlQUFLLEtBQUwsSUFBYyxFQUEzQjtBQUNBLGVBQUssS0FBTCxDQUFXLGlCQUFYLEdBQStCLGlCQUEvQjtBQUNBLGVBQUssS0FBTCxDQUFXLGlCQUFYLEdBQStCLGlCQUEvQjtBQUNBLGVBQUssS0FBTCxDQUFXLG1CQUFYLEdBQWlDLG1CQUFqQztBQUNBLGVBQUssS0FBTCxDQUFXLHFCQUFYLEdBQW1DLHFCQUFuQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCJ2YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIHZhciBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J107XG5cbiAgICBpZiAoIWRvY2N5KSB7XG4gICAgICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXSA9IG1pbkRvYztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xufVxuIiwiaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuL21lanMnO1xuaW1wb3J0IHtFTiBhcyBlbn0gZnJvbSAnLi4vbGFuZ3VhZ2VzL2VuJztcbmltcG9ydCB7ZXNjYXBlSFRNTCwgaXNPYmplY3RFbXB0eX0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJhbCc7XG5cbi8qKlxuICogTG9jYWxlLlxuICpcbiAqIFRoaXMgb2JqZWN0IG1hbmFnZXMgdHJhbnNsYXRpb25zIHdpdGggcGx1cmFsaXphdGlvbi4gQWxzbyBkZWFscyB3aXRoIFdvcmRQcmVzcyBjb21wYXRpYmlsaXR5LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xubGV0IGkxOG4gPSB7bGFuZzogJ2VuJywgZW46IGVufTtcblxuLyoqXG4gKiBMYW5ndWFnZSBzZXR0ZXIvZ2V0dGVyXG4gKlxuICogQHBhcmFtIHsqfSBhcmdzICBDYW4gcGFzcyB0aGUgbGFuZ3VhZ2UgY29kZSBhbmQvb3IgdGhlIHRyYW5zbGF0aW9uIHN0cmluZ3MgYXMgYW4gT2JqZWN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmkxOG4ubGFuZ3VhZ2UgPSAoLi4uYXJncykgPT4ge1xuXG5cdGlmIChhcmdzICE9PSBudWxsICYmIGFyZ3MgIT09IHVuZGVmaW5lZCAmJiBhcmdzLmxlbmd0aCkge1xuXG5cdFx0aWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignTGFuZ3VhZ2UgY29kZSBtdXN0IGJlIGEgc3RyaW5nIHZhbHVlJyk7XG5cdFx0fVxuXG5cdFx0aWYgKCFhcmdzWzBdLm1hdGNoKC9eW2Etel17Mn0oXFwtW2Etel17Mn0pPyQvaSkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0xhbmd1YWdlIGNvZGUgbXVzdCBoYXZlIGZvcm1hdCBgeHhgIG9yIGB4eC14eGAnKTtcblx0XHR9XG5cblx0XHRpMThuLmxhbmcgPSBhcmdzWzBdO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgbGFuZ3VhZ2Ugc3RyaW5ncyB3ZXJlIGFkZGVkOyBvdGhlcndpc2UsIGNoZWNrIHRoZSBzZWNvbmQgYXJndW1lbnQgb3Igc2V0IHRvIEVuZ2xpc2ggYXMgZGVmYXVsdFxuXHRcdGlmIChpMThuW2FyZ3NbMF1dID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGFyZ3NbMV0gPSBhcmdzWzFdICE9PSBudWxsICYmIGFyZ3NbMV0gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcgPyBhcmdzWzFdIDoge307XG5cdFx0XHRpMThuW2FyZ3NbMF1dID0gIWlzT2JqZWN0RW1wdHkoYXJnc1sxXSkgPyBhcmdzWzFdIDogZW47XG5cdFx0fSBlbHNlIGlmIChhcmdzWzFdICE9PSBudWxsICYmIGFyZ3NbMV0gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgYXJnc1sxXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGkxOG5bYXJnc1swXV0gPSBhcmdzWzFdO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBpMThuLmxhbmc7XG59O1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIHN0cmluZyBpbiB0aGUgbGFuZ3VhZ2Ugc2V0IHVwIChvciBFbmdsaXNoIGJ5IGRlZmF1bHQpXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwbHVyYWxQYXJhbVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5pMThuLnQgPSAobWVzc2FnZSwgcGx1cmFsUGFyYW0gPSBudWxsKSA9PiB7XG5cblx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyAmJiBtZXNzYWdlLmxlbmd0aCkge1xuXG5cdFx0bGV0XG5cdFx0XHRzdHIsXG5cdFx0XHRwbHVyYWxGb3JtXG5cdFx0XHQ7XG5cblx0XHRjb25zdCBsYW5ndWFnZSA9IGkxOG4ubGFuZ3VhZ2UoKTtcblxuXHRcdC8qKlxuXHRcdCAqIE1vZGlmeSBzdHJpbmcgdXNpbmcgYWxnb3JpdGhtIHRvIGRldGVjdCBwbHVyYWwgZm9ybXMuXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzUzNDA4L21lc3NhZ2Vmb3JtYXQtaW4tamF2YXNjcmlwdC1wYXJhbWV0ZXJzLWluLWxvY2FsaXplZC11aS1zdHJpbmdzXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW119IGlucHV0ICAgLSBTdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyB0byBwaWNrIHRoZSBwbHVyYWwgZm9ybVxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgICAgICAgICAgIC0gTnVtYmVyIHRvIGRldGVybWluZSB0aGUgcHJvcGVyIHBsdXJhbCBmb3JtXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IGZvcm0gICAgICAgICAgICAgLSBOdW1iZXIgb2YgbGFuZ3VhZ2UgZmFtaWx5IHRvIGFwcGx5IHBsdXJhbCBmb3JtXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdGNvbnN0IF9wbHVyYWwgPSAoaW5wdXQsIG51bWJlciwgZm9ybSkgPT4ge1xuXG5cdFx0XHRpZiAodHlwZW9mIGlucHV0ICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgZm9ybSAhPT0gJ251bWJlcicpIHtcblx0XHRcdFx0cmV0dXJuIGlucHV0O1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbltdfVxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0bGV0IF9wbHVyYWxGb3JtcyA9ICgoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Ly8gMDogQ2hpbmVzZSwgSmFwYW5lc2UsIEtvcmVhbiwgUGVyc2lhbiwgVHVya2lzaCwgVGhhaSwgTGFvLCBBeW1hcsOhLFxuXHRcdFx0XHRcdC8vIFRpYmV0YW4sIENoaWdhLCBEem9uZ2toYSwgSW5kb25lc2lhbiwgTG9qYmFuLCBHZW9yZ2lhbiwgS2F6YWtoLCBLaG1lciwgS3lyZ3l6LCBNYWxheSxcblx0XHRcdFx0XHQvLyBCdXJtZXNlLCBZYWt1dCwgU3VuZGFuZXNlLCBUYXRhciwgVXlnaHVyLCBWaWV0bmFtZXNlLCBXb2xvZlxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiBhcmdzWzFdLFxuXG5cdFx0XHRcdFx0Ly8gMTogRGFuaXNoLCBEdXRjaCwgRW5nbGlzaCwgRmFyb2VzZSwgRnJpc2lhbiwgR2VybWFuLCBOb3J3ZWdpYW4sIFN3ZWRpc2gsIEVzdG9uaWFuLCBGaW5uaXNoLFxuXHRcdFx0XHRcdC8vIEh1bmdhcmlhbiwgQmFzcXVlLCBHcmVlaywgSGVicmV3LCBJdGFsaWFuLCBQb3J0dWd1ZXNlLCBTcGFuaXNoLCBDYXRhbGFuLCBBZnJpa2FhbnMsXG5cdFx0XHRcdFx0Ly8gQW5naWthLCBBc3NhbWVzZSwgQXN0dXJpYW4sIEF6ZXJiYWlqYW5pLCBCdWxnYXJpYW4sIEJlbmdhbGksIEJvZG8sIEFyYWdvbmVzZSwgRG9ncmksXG5cdFx0XHRcdFx0Ly8gRXNwZXJhbnRvLCBBcmdlbnRpbmVhbiBTcGFuaXNoLCBGdWxhaCwgRnJpdWxpYW4sIEdhbGljaWFuLCBHdWphcmF0aSwgSGF1c2EsXG5cdFx0XHRcdFx0Ly8gSGluZGksIENoaGF0dGlzZ2FyaGksIEFybWVuaWFuLCBJbnRlcmxpbmd1YSwgR3JlZW5sYW5kaWMsIEthbm5hZGEsIEt1cmRpc2gsIExldHplYnVyZ2VzY2gsXG5cdFx0XHRcdFx0Ly8gTWFpdGhpbGksIE1hbGF5YWxhbSwgTW9uZ29saWFuLCBNYW5pcHVyaSwgTWFyYXRoaSwgTmFodWF0bCwgTmVhcG9saXRhbiwgTm9yd2VnaWFuIEJva21hbCxcblx0XHRcdFx0XHQvLyBOZXBhbGksIE5vcndlZ2lhbiBOeW5vcnNrLCBOb3J3ZWdpYW4gKG9sZCBjb2RlKSwgTm9ydGhlcm4gU290aG8sIE9yaXlhLCBQdW5qYWJpLCBQYXBpYW1lbnRvLFxuXHRcdFx0XHRcdC8vIFBpZW1vbnRlc2UsIFBhc2h0bywgUm9tYW5zaCwgS2lueWFyd2FuZGEsIFNhbnRhbGksIFNjb3RzLCBTaW5kaGksIE5vcnRoZXJuIFNhbWksIFNpbmhhbGEsXG5cdFx0XHRcdFx0Ly8gU29tYWxpLCBTb25naGF5LCBBbGJhbmlhbiwgU3dhaGlsaSwgVGFtaWwsIFRlbHVndSwgVHVya21lbiwgVXJkdSwgWW9ydWJhXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IChhcmdzWzBdID09PSAxKSA/IGFyZ3NbMV0gOiBhcmdzWzJdLFxuXG5cdFx0XHRcdFx0Ly8gMjogRnJlbmNoLCBCcmF6aWxpYW4gUG9ydHVndWVzZSwgQWNob2xpLCBBa2FuLCBBbWhhcmljLCBNYXB1ZHVuZ3VuLCBCcmV0b24sIEZpbGlwaW5vLFxuXHRcdFx0XHRcdC8vIEd1biwgTGluZ2FsYSwgTWF1cml0aWFuIENyZW9sZSwgTWFsYWdhc3ksIE1hb3JpLCBPY2NpdGFuLCBUYWppaywgVGlncmlueWEsIFV6YmVrLCBXYWxsb29uXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IChhcmdzWzBdID09PSAwIHx8IGFyZ3NbMF0gPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl0sXG5cblx0XHRcdFx0XHQvLyAzOiBMYXR2aWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAgPT09IDEgJiYgYXJnc1swXSAlIDEwMCAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gIT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNDogU2NvdHRpc2ggR2FlbGljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxIHx8IGFyZ3NbMF0gPT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyIHx8IGFyZ3NbMF0gPT09IDEyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID4gMiAmJiBhcmdzWzBdIDwgMjApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNTogIFJvbWFuaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAwIHx8IChhcmdzWzBdICUgMTAwID4gMCAmJiBhcmdzWzBdICUgMTAwIDwgMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDY6IExpdGh1YW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDc6IEJlbGFydXNpYW4sIEJvc25pYW4sIENyb2F0aWFuLCBTZXJiaWFuLCBSdXNzaWFuLCBVa3JhaW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA4OiAgU2xvdmFrLCBDemVjaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+PSAyICYmIGFyZ3NbMF0gPD0gNCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA5OiBQb2xpc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMCA+PSAyICYmIGFyZ3NbMF0gJSAxMCA8PSA0ICYmIChhcmdzWzBdICUgMTAwIDwgMTAgfHwgYXJnc1swXSAlIDEwMCA+PSAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTA6IFNsb3ZlbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwMCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA9PT0gMyB8fCBhcmdzWzBdICUgMTAwID09PSA0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDExOiBJcmlzaCBHYWVsaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiAyICYmIGFyZ3NbMF0gPCA3KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID4gNiAmJiBhcmdzWzBdIDwgMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s1XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTI6IEFyYWJpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+PSAzICYmIGFyZ3NbMF0gJSAxMDAgPD0gMTApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPj0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNV07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s2XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTM6IE1hbHRlc2Vcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDAgfHwgKGFyZ3NbMF0gJSAxMDAgPiAxICYmIGFyZ3NbMF0gJSAxMDAgPCAxMSkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gJSAxMDAgPiAxMCAmJiBhcmdzWzBdICUgMTAwIDwgMjApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTQ6IE1hY2Vkb25pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE1OiAgSWNlbGFuZGljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiAoYXJnc1swXSAhPT0gMTEgJiYgYXJnc1swXSAlIDEwID09PSAxKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyBOZXcgYWRkaXRpb25zXG5cblx0XHRcdFx0XHQvLyAxNjogIEthc2h1YmlhblxuXHRcdFx0XHRcdC8vIEluIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9Mb2NhbGl6YXRpb24vTG9jYWxpemF0aW9uX2FuZF9QbHVyYWxzI0xpc3Rfb2ZfX3BsdXJhbFJ1bGVzXG5cdFx0XHRcdFx0Ly8gQnJldG9uIGlzIGxpc3RlZCBhcyAjMTYgYnV0IGluIHRoZSBMb2NhbGl6YXRpb24gR3VpZGUgaXQgYmVsb25ncyB0byB0aGUgZ3JvdXAgMlxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fFxuXHRcdFx0XHRcdFx0XHRhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxNzogIFdlbHNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICE9PSA4ICYmIGFyZ3NbMF0gIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE4OiAgSmF2YW5lc2Vcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIChhcmdzWzBdID09PSAwKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxOTogIENvcm5pc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMjA6ICBNYW5kaW5rYVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRdO1xuXHRcdFx0fSkoKTtcblxuXHRcdFx0Ly8gUGVyZm9ybSBwbHVyYWwgZm9ybSBvciByZXR1cm4gb3JpZ2luYWwgdGV4dFxuXHRcdFx0cmV0dXJuIF9wbHVyYWxGb3Jtc1tmb3JtXS5hcHBseShudWxsLCBbbnVtYmVyXS5jb25jYXQoaW5wdXQpKTtcblx0XHR9O1xuXG5cdFx0Ly8gRmV0Y2ggdGhlIGxvY2FsaXplZCB2ZXJzaW9uIG9mIHRoZSBzdHJpbmdcblx0XHRpZiAoaTE4bltsYW5ndWFnZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0c3RyID0gaTE4bltsYW5ndWFnZV1bbWVzc2FnZV07XG5cdFx0XHRpZiAocGx1cmFsUGFyYW0gIT09IG51bGwgJiYgdHlwZW9mIHBsdXJhbFBhcmFtID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRwbHVyYWxGb3JtID0gaTE4bltsYW5ndWFnZV1bJ21lanMucGx1cmFsLWZvcm0nXTtcblx0XHRcdFx0c3RyID0gX3BsdXJhbC5hcHBseShudWxsLCBbc3RyLCBwbHVyYWxQYXJhbSwgcGx1cmFsRm9ybV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZhbGxiYWNrIHRvIGRlZmF1bHQgbGFuZ3VhZ2UgaWYgcmVxdWVzdGVkIHVpZCBpcyBub3QgdHJhbnNsYXRlZFxuXHRcdGlmICghc3RyICYmIGkxOG4uZW4pIHtcblx0XHRcdHN0ciA9IGkxOG4uZW5bbWVzc2FnZV07XG5cdFx0XHRpZiAocGx1cmFsUGFyYW0gIT09IG51bGwgJiYgdHlwZW9mIHBsdXJhbFBhcmFtID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRwbHVyYWxGb3JtID0gaTE4bi5lblsnbWVqcy5wbHVyYWwtZm9ybSddO1xuXHRcdFx0XHRzdHIgPSBfcGx1cmFsLmFwcGx5KG51bGwsIFtzdHIsIHBsdXJhbFBhcmFtLCBwbHVyYWxGb3JtXSk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBcyBhIGxhc3QgcmVzb3J0LCB1c2UgdGhlIHJlcXVlc3RlZCB1aWQsIHRvIG1pbWljIG9yaWdpbmFsIGJlaGF2aW9yIG9mIGkxOG4gdXRpbHNcblx0XHQvLyAoaW4gd2hpY2ggdWlkIHdhcyB0aGUgZW5nbGlzaCB0ZXh0KVxuXHRcdHN0ciA9IHN0ciB8fCBtZXNzYWdlO1xuXG5cdFx0Ly8gUmVwbGFjZSB0b2tlblxuXHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgnJTEnLCBwbHVyYWxQYXJhbSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVzY2FwZUhUTUwoc3RyKTtcblxuXHR9XG5cblx0cmV0dXJuIG1lc3NhZ2U7XG59O1xuXG5tZWpzLmkxOG4gPSBpMThuO1xuXG4vLyBgaTE4bmAgY29tcGF0aWJpbGl0eSB3b3JrZmxvdyB3aXRoIFdvcmRQcmVzc1xuaWYgKHR5cGVvZiBtZWpzTDEwbiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy5pMThuLmxhbmd1YWdlKG1lanNMMTBuLmxhbmd1YWdlLCBtZWpzTDEwbi5zdHJpbmdzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaTE4bjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5pbXBvcnQge2dldFR5cGVGcm9tRmlsZSwgZm9ybWF0VHlwZSwgYWJzb2x1dGl6ZVVybH0gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qKlxuICogTWVkaWEgQ29yZVxuICpcbiAqIFRoaXMgY2xhc3MgaXMgdGhlIGZvdW5kYXRpb24gdG8gY3JlYXRlL3JlbmRlciBkaWZmZXJlbnQgbWVkaWEgZm9ybWF0cy5cbiAqIEBjbGFzcyBNZWRpYUVsZW1lbnRcbiAqL1xuY2xhc3MgTWVkaWFFbGVtZW50IHtcblxuXHRjb25zdHJ1Y3RvciAoaWRPck5vZGUsIG9wdGlvbnMpIHtcblx0XHRcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0XG5cdFx0dC5kZWZhdWx0cyA9IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogTGlzdCBvZiB0aGUgcmVuZGVyZXJzIHRvIHVzZVxuXHRcdFx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHRcdFx0ICovXG5cdFx0XHRyZW5kZXJlcnM6IFtdLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBOYW1lIG9mIE1lZGlhRWxlbWVudCBjb250YWluZXJcblx0XHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0XHQgKi9cblx0XHRcdGZha2VOb2RlTmFtZTogJ21lZGlhZWxlbWVudHdyYXBwZXInLFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBUaGUgcGF0aCB3aGVyZSBzaGltcyBhcmUgbG9jYXRlZFxuXHRcdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHRcdCAqL1xuXHRcdFx0cGx1Z2luUGF0aDogJ2J1aWxkLydcblx0XHR9O1xuXG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odC5kZWZhdWx0cywgb3B0aW9ucyk7XG5cblx0XHQvLyBjcmVhdGUgb3VyIG5vZGUgKG5vdGU6IG9sZGVyIHZlcnNpb25zIG9mIGlPUyBkb24ndCBzdXBwb3J0IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBvbiBET00gbm9kZXMpXG5cdFx0dC5tZWRpYUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMuZmFrZU5vZGVOYW1lKTtcblx0XHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zID0gb3B0aW9ucztcblxuXHRcdGxldFxuXHRcdFx0aWQgPSBpZE9yTm9kZSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdGlmICh0eXBlb2YgaWRPck5vZGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZE9yTm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9IGlkT3JOb2RlO1xuXHRcdFx0aWQgPSBpZE9yTm9kZS5pZDtcblx0XHR9XG5cblx0XHRpZCA9IGlkIHx8IGBtZWpzXyR7KE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyKSl9YDtcblxuXHRcdGlmICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwgJiZcblx0XHRcdHQubWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKSB7XG5cdFx0XHQvLyBjaGFuZ2UgaWRcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7aWR9X2Zyb21fbWVqc2ApO1xuXG5cdFx0XHQvLyBhZGQgbmV4dCB0byB0aGlzIG9uZVxuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHQubWVkaWFFbGVtZW50LCB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXG5cdFx0XHQvLyBpbnNlcnQgdGhpcyBvbmUgaW5zaWRlXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5hcHBlbmRDaGlsZCh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUT0RPOiB3aGVyZSB0byBwdXQgdGhlIG5vZGU/XG5cdFx0fVxuXG5cdFx0dC5tZWRpYUVsZW1lbnQuaWQgPSBpZDtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnMgPSB7fTtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG51bGw7XG5cdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJOYW1lID0gbnVsbDtcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgcmVuZGVyZXIgd2FzIGZvdW5kIG9yIG5vdFxuXHRcdCAqXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSByZW5kZXJlck5hbWVcblx0XHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHR0Lm1lZGlhRWxlbWVudC5jaGFuZ2VSZW5kZXJlciA9IChyZW5kZXJlck5hbWUsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0XHQvLyBjaGVjayBmb3IgYSBtYXRjaCBvbiB0aGUgY3VycmVudCByZW5kZXJlclxuXHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwgJiZcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIubmFtZSA9PT0gcmVuZGVyZXJOYW1lKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnBhdXNlKCk7XG5cdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnNob3coKTtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc2V0U3JjKG1lZGlhRmlsZXNbMF0uc3JjKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIGV4aXN0aW5nIHJlbmRlcmVyIGlzIG5vdCB0aGUgcmlnaHQgb25lLCB0aGVuIGhpZGUgaXRcblx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnBhdXNlKCk7XG5cdFx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2VlIGlmIHdlIGhhdmUgdGhlIHJlbmRlcmVyIGFscmVhZHkgY3JlYXRlZFxuXHRcdFx0bGV0IG5ld1JlbmRlcmVyID0gdC5tZWRpYUVsZW1lbnQucmVuZGVyZXJzW3JlbmRlcmVyTmFtZV0sXG5cdFx0XHRcdG5ld1JlbmRlcmVyVHlwZSA9IG51bGw7XG5cblx0XHRcdGlmIChuZXdSZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIG5ld1JlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdG5ld1JlbmRlcmVyLnNob3coKTtcblx0XHRcdFx0bmV3UmVuZGVyZXIuc2V0U3JjKG1lZGlhRmlsZXNbMF0uc3JjKTtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXJOYW1lID0gcmVuZGVyZXJOYW1lO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHJlbmRlcmVyQXJyYXkgPSB0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycy5sZW5ndGggPyB0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnJlbmRlcmVycyA6XG5cdFx0XHRcdHJlbmRlcmVyLm9yZGVyO1xuXG5cdFx0XHQvLyBmaW5kIHRoZSBkZXNpcmVkIHJlbmRlcmVyIGluIHRoZSBhcnJheSBvZiBwb3NzaWJsZSBvbmVzXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHJlbmRlcmVyQXJyYXkubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gcmVuZGVyZXJBcnJheVtpXTtcblxuXHRcdFx0XHRpZiAoaW5kZXggPT09IHJlbmRlcmVyTmFtZSkge1xuXG5cdFx0XHRcdFx0Ly8gY3JlYXRlIHRoZSByZW5kZXJlclxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVyTGlzdCA9IHJlbmRlcmVyLnJlbmRlcmVycztcblx0XHRcdFx0XHRuZXdSZW5kZXJlclR5cGUgPSByZW5kZXJlckxpc3RbaW5kZXhdO1xuXG5cdFx0XHRcdFx0bGV0IHJlbmRlck9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG5ld1JlbmRlcmVyVHlwZS5vcHRpb25zLCB0Lm1lZGlhRWxlbWVudC5vcHRpb25zKTtcblx0XHRcdFx0XHRuZXdSZW5kZXJlciA9IG5ld1JlbmRlcmVyVHlwZS5jcmVhdGUodC5tZWRpYUVsZW1lbnQsIHJlbmRlck9wdGlvbnMsIG1lZGlhRmlsZXMpO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyLm5hbWUgPSByZW5kZXJlck5hbWU7XG5cblx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgbGF0ZXJcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnNbbmV3UmVuZGVyZXJUeXBlLm5hbWVdID0gbmV3UmVuZGVyZXI7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSByZW5kZXJlck5hbWU7XG5cblx0XHRcdFx0XHRuZXdSZW5kZXJlci5zaG93KCk7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNldCB0aGUgZWxlbWVudCBkaW1lbnNpb25zIGJhc2VkIG9uIHNlbGVjdGVkIHJlbmRlcmVyJ3Mgc2V0U2l6ZSBtZXRob2Rcblx0XHQgKlxuXHRcdCAqIEBwdWJsaWNcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG5cdFx0ICovXG5cdFx0dC5tZWRpYUVsZW1lbnQuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdG1ldGhvZHMgPSBtZWpzLmh0bWw1bWVkaWEubWV0aG9kcyxcblx0XHRcdGFkZFByb3BlcnR5ID0gKG9iaiwgbmFtZSwgb25HZXQsIG9uU2V0KSA9PiB7XG5cblx0XHRcdFx0Ly8gd3JhcHBlciBmdW5jdGlvbnNcblx0XHRcdFx0bGV0IG9sZFZhbHVlID0gb2JqW25hbWVdO1xuXHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdGdldEZuID0gKCkgPT4gb25HZXQuYXBwbHkob2JqLCBbb2xkVmFsdWVdKSxcblx0XHRcdFx0XHRzZXRGbiA9IChuZXdWYWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0b2xkVmFsdWUgPSBvblNldC5hcHBseShvYmosIFtuZXdWYWx1ZV0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9sZFZhbHVlO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gTW9kZXJuIGJyb3dzZXJzLCBJRTkrIChJRTggb25seSB3b3JrcyBvbiBET00gb2JqZWN0cywgbm90IG5vcm1hbCBKUyBvYmplY3RzKVxuXHRcdFx0XHRpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG5cblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG5cdFx0XHRcdFx0XHRnZXQ6IGdldEZuLFxuXHRcdFx0XHRcdFx0c2V0OiBzZXRGblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gT2xkZXIgRmlyZWZveFxuXHRcdFx0XHR9IGVsc2UgaWYgKG9iai5fX2RlZmluZUdldHRlcl9fKSB7XG5cblx0XHRcdFx0XHRvYmouX19kZWZpbmVHZXR0ZXJfXyhuYW1lLCBnZXRGbik7XG5cdFx0XHRcdFx0b2JqLl9fZGVmaW5lU2V0dGVyX18obmFtZSwgc2V0Rm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHByb3BOYW1lICE9PSAnc3JjJykge1xuXG5cdFx0XHRcdFx0Y29uc3Rcblx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gLFxuXHRcdFx0XHRcdFx0Z2V0Rm4gPSAoKSA9PiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkgPyB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcltgZ2V0JHtjYXBOYW1lfWBdKCkgOiBudWxsLFxuXHRcdFx0XHRcdFx0c2V0Rm4gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcltgc2V0JHtjYXBOYW1lfWBdKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGFkZFByb3BlcnR5KHQubWVkaWFFbGVtZW50LCBwcm9wTmFtZSwgZ2V0Rm4sIHNldEZuKTtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudFtgZ2V0JHtjYXBOYW1lfWBdID0gZ2V0Rm47XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnRbYHNldCR7Y2FwTmFtZX1gXSA9IHNldEZuO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Ly8gYHNyY2AgaXMgYSBwcm9wZXJ0eSBzZXBhcmF0ZWQgZnJvbSB0aGUgb3RoZXJzIHNpbmNlIGl0IGNhcnJpZXMgdGhlIGxvZ2ljIHRvIHNldCB0aGUgcHJvcGVyIHJlbmRlcmVyXG5cdFx0XHQvLyBiYXNlZCBvbiB0aGUgbWVkaWEgZmlsZXMgZGV0ZWN0ZWRcblx0XHRcdGdldFNyYyA9ICgpID0+ICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSA/IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLmdldFNyYygpIDogbnVsbCxcblx0XHRcdHNldFNyYyA9ICh2YWx1ZSkgPT4ge1xuXG5cdFx0XHRcdGxldCBtZWRpYUZpbGVzID0gW107XG5cblx0XHRcdFx0Ly8gY2xlYW4gdXAgVVJMc1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRzcmM6IHZhbHVlLFxuXHRcdFx0XHRcdFx0dHlwZTogdmFsdWUgPyBnZXRUeXBlRnJvbUZpbGUodmFsdWUpIDogJydcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdHNyYyA9IGFic29sdXRpemVVcmwodmFsdWVbaV0uc3JjKSxcblx0XHRcdFx0XHRcdFx0dHlwZSA9IHZhbHVlW2ldLnR5cGVcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0c3JjOiBzcmMsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICh0eXBlID09PSAnJyB8fCB0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCkgJiYgc3JjID9cblx0XHRcdFx0XHRcdFx0XHRnZXRUeXBlRnJvbUZpbGUoc3JjKSA6IHR5cGVcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmluZCBhIHJlbmRlcmVyIGFuZCBVUkwgbWF0Y2hcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0cmVuZGVySW5mbyA9IHJlbmRlcmVyLnNlbGVjdChtZWRpYUZpbGVzLFxuXHRcdFx0XHRcdFx0KHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzLmxlbmd0aCA/IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzIDogW10pKSxcblx0XHRcdFx0XHRldmVudFxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0Ly8gRW5zdXJlIHRoYXQgdGhlIG9yaWdpbmFsIGdldHMgdGhlIGZpcnN0IHNvdXJjZSBmb3VuZFxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCAobWVkaWFGaWxlc1swXS5zcmMgfHwgJycpKTtcblxuXHRcdFx0XHQvLyBkaWQgd2UgZmluZCBhIHJlbmRlcmVyP1xuXHRcdFx0XHRpZiAocmVuZGVySW5mbyA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoJ2Vycm9yJywgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHRldmVudC5tZXNzYWdlID0gJ05vIHJlbmRlcmVyIGZvdW5kJztcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB0dXJuIG9uIHRoZSByZW5kZXJlciAodGhpcyBjaGVja3MgZm9yIHRoZSBleGlzdGluZyByZW5kZXJlciBhbHJlYWR5KVxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5jaGFuZ2VSZW5kZXJlcihyZW5kZXJJbmZvLnJlbmRlcmVyTmFtZSwgbWVkaWFGaWxlcyk7XG5cblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID09PSB1bmRlZmluZWQgfHwgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KCdlcnJvcicsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0ZXZlbnQubWVzc2FnZSA9ICdFcnJvciBjcmVhdGluZyByZW5kZXJlcic7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIGN1cnJlbnQgcmVuZGVyZXJcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnRbbWV0aG9kTmFtZV0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdHJldHVybiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCAmJlxuXHRcdFx0XHRcdFx0dHlwZW9mIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW21ldGhvZE5hbWVdID09PSAnZnVuY3Rpb24nKSA/XG5cdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlclttZXRob2ROYW1lXShhcmdzKSA6IG51bGw7XG5cdFx0XHRcdH07XG5cblx0XHRcdH07XG5cblx0XHQvLyBBc3NpZ24gYWxsIG1ldGhvZHMvcHJvcGVydGllcy9ldmVudHMgdG8gZmFrZSBub2RlIGlmIHJlbmRlcmVyIHdhcyBmb3VuZFxuXHRcdGFkZFByb3BlcnR5KHQubWVkaWFFbGVtZW50LCAnc3JjJywgZ2V0U3JjLCBzZXRTcmMpO1xuXHRcdHQubWVkaWFFbGVtZW50LmdldFNyYyA9IGdldFNyYztcblx0XHR0Lm1lZGlhRWxlbWVudC5zZXRTcmMgPSBzZXRTcmM7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJRSAmJiBpT1Ncblx0XHRpZiAoIXQubWVkaWFFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcblxuXHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzID0ge307XG5cblx0XHRcdC8vIHN0YXJ0OiBmYWtlIGV2ZW50c1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9IChldmVudE5hbWUsIGNhbGxiYWNrKSA9PiB7XG5cdFx0XHRcdC8vIGNyZWF0ZSBvciBmaW5kIHRoZSBhcnJheSBvZiBjYWxsYmFja3MgZm9yIHRoaXMgZXZlbnROYW1lXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG5cblx0XHRcdFx0Ly8gcHVzaCB0aGUgY2FsbGJhY2sgaW50byB0aGUgc3RhY2tcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChjYWxsYmFjayk7XG5cdFx0XHR9O1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IChldmVudE5hbWUsIGNhbGxiYWNrKSA9PiB7XG5cdFx0XHRcdC8vIG5vIGV2ZW50TmFtZSBtZWFucyByZW1vdmUgYWxsIGxpc3RlbmVyc1xuXHRcdFx0XHRpZiAoIWV2ZW50TmFtZSkge1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmV2ZW50cyA9IHt9O1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc2VlIGlmIHdlIGhhdmUgYW55IGNhbGxiYWNrcyBmb3IgdGhpcyBldmVudE5hbWVcblx0XHRcdFx0bGV0IGNhbGxiYWNrcyA9IHQubWVkaWFFbGVtZW50LmV2ZW50c1tldmVudE5hbWVdO1xuXG5cdFx0XHRcdGlmICghY2FsbGJhY2tzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjaGVjayBmb3IgYSBzcGVjaWZpYyBjYWxsYmFja1xuXHRcdFx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gPSBbXTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgc3BlY2lmaWMgY2FsbGJhY2tcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cblx0XHRcdC8qKlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdFx0XHQgKi9cblx0XHRcdHQubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQgPSAoZXZlbnQpID0+IHtcblxuXHRcdFx0XHRsZXQgY2FsbGJhY2tzID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50LnR5cGVdO1xuXG5cdFx0XHRcdGlmIChjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFja3NbaV0uYXBwbHkobnVsbCwgW2V2ZW50XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUgIT09IG51bGwpIHtcblx0XHRcdGxldCBtZWRpYUZpbGVzID0gW107XG5cblx0XHRcdHN3aXRjaCAodC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcblxuXHRcdFx0XHRjYXNlICdpZnJhbWUnOlxuXHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR0eXBlOiAnJyxcblx0XHRcdFx0XHRcdHNyYzogdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnc3JjJylcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ2F1ZGlvJzpcblx0XHRcdFx0Y2FzZSAndmlkZW8nOlxuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0bixcblx0XHRcdFx0XHRcdHNyYyxcblx0XHRcdFx0XHRcdHR5cGUsXG5cdFx0XHRcdFx0XHRzb3VyY2VzID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmNoaWxkTm9kZXMubGVuZ3RoLFxuXHRcdFx0XHRcdFx0bm9kZVNvdXJjZSA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHQvLyBDb25zaWRlciBpZiBub2RlIGNvbnRhaW5zIHRoZSBgc3JjYCBhbmQgYHR5cGVgIGF0dHJpYnV0ZXNcblx0XHRcdFx0XHRpZiAobm9kZVNvdXJjZSkge1xuXHRcdFx0XHRcdFx0bGV0IG5vZGUgPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGU7XG5cdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBmb3JtYXRUeXBlKG5vZGVTb3VyY2UsIG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykpLFxuXHRcdFx0XHRcdFx0XHRzcmM6IG5vZGVTb3VyY2Vcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHRlc3QgPHNvdXJjZT4gdHlwZXMgdG8gc2VlIGlmIHRoZXkgYXJlIHVzYWJsZVxuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBzb3VyY2VzOyBpKyspIHtcblx0XHRcdFx0XHRcdG4gPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRcdGlmIChuLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBuLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NvdXJjZScpIHtcblx0XHRcdFx0XHRcdFx0c3JjID0gbi5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXHRcdFx0XHRcdFx0XHR0eXBlID0gZm9ybWF0VHlwZShzcmMsIG4uZ2V0QXR0cmlidXRlKCd0eXBlJykpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe3R5cGU6IHR5cGUsIHNyYzogc3JjfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobWVkaWFGaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnNyYyA9IG1lZGlhRmlsZXM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9wdGlvbnMuc3VjY2Vzcykge1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3B0aW9ucy5zdWNjZXNzKHQubWVkaWFFbGVtZW50LCB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdH1cblxuXHRcdC8vIEB0b2RvOiBWZXJpZnkgaWYgdGhpcyBpcyBuZWVkZWRcblx0XHQvLyBpZiAodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5lcnJvcikge1xuXHRcdC8vIFx0dC5tZWRpYUVsZW1lbnQub3B0aW9ucy5lcnJvcih0aGlzLm1lZGlhRWxlbWVudCwgdGhpcy5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlKTtcblx0XHQvLyB9XG5cblx0XHRyZXR1cm4gdC5tZWRpYUVsZW1lbnQ7XG5cdH1cbn1cblxud2luZG93Lk1lZGlhRWxlbWVudCA9IE1lZGlhRWxlbWVudDtcblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFFbGVtZW50OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuLy8gTmFtZXNwYWNlXG5sZXQgbWVqcyA9IHt9O1xuXG4vLyB2ZXJzaW9uIG51bWJlclxubWVqcy52ZXJzaW9uID0gJzMuMC4wJztcblxuLy8gQmFzaWMgSFRNTDUgc2V0dGluZ3Ncbm1lanMuaHRtbDVtZWRpYSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdHByb3BlcnRpZXM6IFtcblx0XHQvLyBHRVQvU0VUXG5cdFx0J3ZvbHVtZScsICdzcmMnLCAnY3VycmVudFRpbWUnLCAnbXV0ZWQnLFxuXG5cdFx0Ly8gR0VUIG9ubHlcblx0XHQnZHVyYXRpb24nLCAncGF1c2VkJywgJ2VuZGVkJyxcblxuXHRcdC8vIE9USEVSU1xuXHRcdCdlcnJvcicsICdjdXJyZW50U3JjJywgJ25ldHdvcmtTdGF0ZScsICdwcmVsb2FkJywgJ2J1ZmZlcmVkJywgJ2J1ZmZlcmVkQnl0ZXMnLCAnYnVmZmVyZWRUaW1lJywgJ3JlYWR5U3RhdGUnLCAnc2Vla2luZycsXG5cdFx0J2luaXRpYWxUaW1lJywgJ3N0YXJ0T2Zmc2V0VGltZScsICdkZWZhdWx0UGxheWJhY2tSYXRlJywgJ3BsYXliYWNrUmF0ZScsICdwbGF5ZWQnLCAnc2Vla2FibGUnLCAnYXV0b3BsYXknLCAnbG9vcCcsICdjb250cm9scydcblx0XSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdG1ldGhvZHM6IFtcblx0XHQnbG9hZCcsICdwbGF5JywgJ3BhdXNlJywgJ2NhblBsYXlUeXBlJ1xuXHRdLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0ZXZlbnRzOiBbXG5cdFx0J2xvYWRzdGFydCcsICdwcm9ncmVzcycsICdzdXNwZW5kJywgJ2Fib3J0JywgJ2Vycm9yJywgJ2VtcHRpZWQnLCAnc3RhbGxlZCcsICdwbGF5JywgJ3BhdXNlJywgJ2xvYWRlZG1ldGFkYXRhJyxcblx0XHQnbG9hZGVkZGF0YScsICd3YWl0aW5nJywgJ3BsYXlpbmcnLCAnY2FucGxheScsICdjYW5wbGF5dGhyb3VnaCcsICdzZWVraW5nJywgJ3NlZWtlZCcsICd0aW1ldXBkYXRlJywgJ2VuZGVkJyxcblx0XHQncmF0ZWNoYW5nZScsICdkdXJhdGlvbmNoYW5nZScsICd2b2x1bWVjaGFuZ2UnXG5cdF0sXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRtZWRpYVR5cGVzOiBbXG5cdFx0J2F1ZGlvL21wMycsICdhdWRpby9vZ2cnLCAnYXVkaW8vb2dhJywgJ2F1ZGlvL3dhdicsICdhdWRpby94LXdhdicsICdhdWRpby93YXZlJywgJ2F1ZGlvL3gtcG4td2F2JywgJ2F1ZGlvL21wZWcnLCAnYXVkaW8vbXA0Jyxcblx0XHQndmlkZW8vbXA0JywgJ3ZpZGVvL3dlYm0nLCAndmlkZW8vb2dnJ1xuXHRdXG59O1xuXG53aW5kb3cubWVqcyA9IG1lanM7XG5cbmV4cG9ydCBkZWZhdWx0IG1lanM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuL21lanMnO1xuXG4vKipcbiAqXG4gKiBDbGFzcyB0byBtYW5hZ2UgcmVuZGVyZXIgc2VsZWN0aW9uIGFuZCBhZGRpdGlvbi5cbiAqIEBjbGFzcyBSZW5kZXJlclxuICovXG5jbGFzcyBSZW5kZXJlciB7XG5cblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHRoaXMucmVuZGVyZXJzID0ge307XG5cdFx0dGhpcy5vcmRlciA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGEgbmV3IHJlbmRlcmVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgLSBBbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHJlbmRlcmVkIGluZm9ybWF0aW9uIChuYW1lIFJFUVVJUkVEKVxuXHQgKiBAbWV0aG9kIGFkZFxuXHQgKi9cblx0YWRkIChyZW5kZXJlcikge1xuXG5cdFx0aWYgKHJlbmRlcmVyLm5hbWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigncmVuZGVyZXIgbXVzdCBjb250YWluIGF0IGxlYXN0IGBuYW1lYCBwcm9wZXJ0eScpO1xuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyZXJzW3JlbmRlcmVyLm5hbWVdID0gcmVuZGVyZXI7XG5cdFx0dGhpcy5vcmRlci5wdXNoKHJlbmRlcmVyLm5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEl0ZXJhdGUgYSBsaXN0IG9mIHJlbmRlcmVycyB0byBkZXRlcm1pbmUgd2hpY2ggb25lIHNob3VsZCB0aGUgcGxheWVyIHVzZS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyAtIEEgbGlzdCBvZiBzb3VyY2UgYW5kIHR5cGUgb2J0YWluZWQgZnJvbSB2aWRlby9hdWRpby9zb3VyY2UgdGFnczogW3tzcmM6JycsdHlwZTonJ31dXG5cdCAqIEBwYXJhbSB7P1N0cmluZ1tdfSByZW5kZXJlcnMgLSBPcHRpb25hbCBsaXN0IG9mIHByZS1zZWxlY3RlZCByZW5kZXJlcnNcblx0ICogQHJldHVybiB7P09iamVjdH0gVGhlIHJlbmRlcmVyJ3MgbmFtZSBhbmQgc291cmNlIHNlbGVjdGVkXG5cdCAqIEBtZXRob2Qgc2VsZWN0XG5cdCAqL1xuXHRzZWxlY3QgKG1lZGlhRmlsZXMsIHJlbmRlcmVycyA9IFtdKSB7XG5cblx0XHRyZW5kZXJlcnMgPSByZW5kZXJlcnMubGVuZ3RoID8gcmVuZGVyZXJzOiB0aGlzLm9yZGVyO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGxldFxuXHRcdFx0XHRrZXkgPSByZW5kZXJlcnNbaV0sXG5cdFx0XHRcdHJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcnNba2V5XVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAocmVuZGVyZXIgIT09IG51bGwgJiYgcmVuZGVyZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMCwgamwgPSBtZWRpYUZpbGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHJlbmRlcmVyLmNhblBsYXlUeXBlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBtZWRpYUZpbGVzW2pdLnR5cGUgPT09ICdzdHJpbmcnICYmXG5cdFx0XHRcdFx0XHRyZW5kZXJlci5jYW5QbGF5VHlwZShtZWRpYUZpbGVzW2pdLnR5cGUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRyZW5kZXJlck5hbWU6IHJlbmRlcmVyLm5hbWUsXG5cdFx0XHRcdFx0XHRcdHNyYzogIG1lZGlhRmlsZXNbal0uc3JjXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU2V0dGVycy9nZXR0ZXJzXG5cblx0c2V0IG9yZGVyKG9yZGVyKSB7XG5cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkob3JkZXIpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdvcmRlciBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZ3MuJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fb3JkZXIgPSBvcmRlcjtcblx0fVxuXG5cdHNldCByZW5kZXJlcnMocmVuZGVyZXJzKSB7XG5cblx0XHRpZiAocmVuZGVyZXJzICE9PSBudWxsICYmIHR5cGVvZiByZW5kZXJlcnMgIT09ICdvYmplY3QnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdyZW5kZXJlcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBvYmplY3RzLicpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3JlbmRlcmVycyA9IHJlbmRlcmVycztcblx0fVxuXG5cdGdldCByZW5kZXJlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3JlbmRlcmVycztcblx0fVxuXG5cdGdldCBvcmRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy5fb3JkZXI7XG5cdH1cbn1cblxuZXhwb3J0IGxldCByZW5kZXJlciA9IG5ldyBSZW5kZXJlcigpO1xuXG5tZWpzLlJlbmRlcmVycyA9IHJlbmRlcmVyOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCAqIGFzIEZlYXR1cmVzIGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cblxuLyoqXG4gKiBGdWxsc2NyZWVuIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBjcmVhdGVzIGEgYnV0dG9uIHRvIHRvZ2dsZSBmdWxsc2NyZWVuIG9uIHZpZGVvOyBpdCBjb25zaWRlcnMgYSBsZXRpZXR5IG9mIHBvc3NpYmlsaXRpZXMgd2hlbiBkZWFsaW5nIHdpdGggaXRcbiAqIHNpbmNlIGl0IGlzIG5vdCBjb25zaXN0ZW50IGFjcm9zcyBicm93c2Vycy4gSXQgYWxzbyBhY2NvdW50cyBmb3IgdHJpZ2dlcmluZyB0aGUgZXZlbnQgdGhyb3VnaCBGbGFzaCBzaGltLlxuICovXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0dXNlUGx1Z2luRnVsbFNjcmVlbjogdHJ1ZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRmdWxsc2NyZWVuVGV4dDogJydcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0Z1bGxTY3JlZW46IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc05hdGl2ZUZ1bGxTY3JlZW46IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0luSWZyYW1lOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNQbHVnaW5DbGlja1Rocm91Z2hDcmVhdGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIFBvc3NpYmxlIG1vZGVzXG5cdCAqICgxKSAnbmF0aXZlLW5hdGl2ZScgIEhUTUw1IHZpZGVvICArIGJyb3dzZXIgZnVsbHNjcmVlbiAoSUUxMCssIGV0Yy4pXG5cdCAqICgyKSAncGx1Z2luLW5hdGl2ZScgIHBsdWdpbiB2aWRlbyArIGJyb3dzZXIgZnVsbHNjcmVlbiAoZmFpbHMgaW4gc29tZSB2ZXJzaW9ucyBvZiBGaXJlZm94KVxuXHQgKiAoMykgJ2Z1bGx3aW5kb3cnICAgICBGdWxsIHdpbmRvdyAocmV0YWlucyBhbGwgVUkpXG5cdCAqICg0KSAncGx1Z2luLWNsaWNrJyAgIEZsYXNoIDEgLSBjbGljayB0aHJvdWdoIHdpdGggcG9pbnRlciBldmVudHNcblx0ICogKDUpICdwbHVnaW4taG92ZXInICAgRmxhc2ggMiAtIGhvdmVyIHBvcHVwIGluIGZsYXNoIChJRTYtOClcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGZ1bGxzY3JlZW5Nb2RlOiAnJyxcblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjb250YWluZXJTaXplVGltZW91dDogbnVsbCxcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZGZ1bGxzY3JlZW46IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXG5cdFx0aWYgKCFwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHBsYXllci5pc0luSWZyYW1lID0gKHdpbmRvdy5sb2NhdGlvbiAhPT0gd2luZG93LnBhcmVudC5sb2NhdGlvbik7XG5cblx0XHQvLyBkZXRlY3Qgb24gc3RhcnRcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGV0ZWN0RnVsbHNjcmVlbk1vZGUoKTtcblx0XHR9KTtcblxuXHRcdC8vIGJ1aWxkIGJ1dHRvblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRoaWRlVGltZW91dCA9IG51bGwsXG5cdFx0XHRmdWxsc2NyZWVuVGl0bGUgPSB0Lm9wdGlvbnMuZnVsbHNjcmVlblRleHQgPyB0Lm9wdGlvbnMuZnVsbHNjcmVlblRleHQgOiBpMThuLnQoJ21lanMuZnVsbHNjcmVlbicpLFxuXHRcdFx0ZnVsbHNjcmVlbkJ0biA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbi1idXR0b25cIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7ZnVsbHNjcmVlblRpdGxlfVwiIGFyaWEtbGFiZWw9XCIke2Z1bGxzY3JlZW5UaXRsZX1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scylcblx0XHRcdFx0Lm9uKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0XHRcdC8vIHRvZ2dsZSBmdWxsc2NyZWVuXG5cdFx0XHRcdFx0bGV0IGlzRnVsbFNjcmVlbiA9IChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiBGZWF0dXJlcy5JU19GVUxMU0NSRUVOKSB8fCBwbGF5ZXIuaXNGdWxsU2NyZWVuO1xuXG5cdFx0XHRcdFx0aWYgKGlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5lbnRlckZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gdmVyeSBvbGQgYnJvd3NlcnMgd2l0aCBhIHBsdWdpblxuXHRcdFx0XHRcdGlmICh0LmZ1bGxzY3JlZW5Nb2RlID09PSAncGx1Z2luLWhvdmVyJykge1xuXHRcdFx0XHRcdFx0aWYgKGhpZGVUaW1lb3V0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG5cdFx0XHRcdFx0XHRcdGhpZGVUaW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0bGV0IGJ1dHRvblBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCksXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5lclBvcyA9IHBsYXllci5jb250YWluZXIub2Zmc2V0KCk7XG5cblx0XHRcdFx0XHRcdG1lZGlhLnBvc2l0aW9uRnVsbHNjcmVlbkJ1dHRvbihidXR0b25Qb3MubGVmdCAtIGNvbnRhaW5lclBvcy5sZWZ0LCBidXR0b25Qb3MudG9wIC0gY29udGFpbmVyUG9zLnRvcCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAodC5mdWxsc2NyZWVuTW9kZSA9PT0gJ3BsdWdpbi1ob3ZlcicpIHtcblx0XHRcdFx0XHRcdGlmIChoaWRlVGltZW91dCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRoaWRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5oaWRlRnVsbHNjcmVlbkJ1dHRvbigpO1xuXHRcdFx0XHRcdFx0fSwgMTUwMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXG5cblx0XHRwbGF5ZXIuZnVsbHNjcmVlbkJ0biA9IGZ1bGxzY3JlZW5CdG47XG5cblx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0bGV0IGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlIHx8IDA7XG5cdFx0XHRpZiAoa2V5ID09PSAyNyAmJiAoKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIEZlYXR1cmVzLklTX0ZVTExTQ1JFRU4pIHx8IHQuaXNGdWxsU2NyZWVuKSkge1xuXHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHQubm9ybWFsSGVpZ2h0ID0gMDtcblx0XHR0Lm5vcm1hbFdpZHRoID0gMDtcblxuXHRcdC8vIHNldHVwIG5hdGl2ZSBmdWxsc2NyZWVuIGV2ZW50XG5cdFx0aWYgKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOKSB7XG5cblx0XHRcdC8vXG5cdFx0XHQvKipcblx0XHRcdCAqIERldGVjdCBhbnkgY2hhbmdlcyBvbiBmdWxsc2NyZWVuXG5cdFx0XHQgKlxuXHRcdFx0ICogQ2hyb21lIGRvZXNuJ3QgYWx3YXlzIGZpcmUgdGhpcyBpbiBhbiBgPGlmcmFtZT5gXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBmdWxsc2NyZWVuQ2hhbmdlZCA9ICgpID0+IHtcblx0XHRcdFx0aWYgKHBsYXllci5pc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHRpZiAoRmVhdHVyZXMuaXNGdWxsU2NyZWVuKCkpIHtcblx0XHRcdFx0XHRcdHBsYXllci5pc05hdGl2ZUZ1bGxTY3JlZW4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0Ly8gcmVzZXQgdGhlIGNvbnRyb2xzIG9uY2Ugd2UgYXJlIGZ1bGx5IGluIGZ1bGwgc2NyZWVuXG5cdFx0XHRcdFx0XHRwbGF5ZXIuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5pc05hdGl2ZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0XHRcdFx0XHRcdC8vIHdoZW4gYSB1c2VyIHByZXNzZXMgRVNDXG5cdFx0XHRcdFx0XHQvLyBtYWtlIHN1cmUgdG8gcHV0IHRoZSBwbGF5ZXIgYmFjayBpbnRvIHBsYWNlXG5cdFx0XHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHBsYXllci5nbG9iYWxCaW5kKEZlYXR1cmVzLkZVTExTQ1JFRU5fRVZFTlRfTkFNRSwgZnVsbHNjcmVlbkNoYW5nZWQpO1xuXHRcdH1cblxuXHR9LFxuXG5cdC8qKlxuXHQgKiBEZXRlY3QgdGhlIHR5cGUgb2YgZnVsbHNjcmVlbiBiYXNlZCBvbiBicm93c2VyJ3MgY2FwYWJpbGl0aWVzXG5cdCAqXG5cdCAqIEByZXR1cm4ge1N0cmluZ31cblx0ICovXG5cdGRldGVjdEZ1bGxzY3JlZW5Nb2RlOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG1vZGUgPSAnJyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGxcblx0XHQ7XG5cblx0XHRpZiAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgaXNOYXRpdmUpIHtcblx0XHRcdG1vZGUgPSAnbmF0aXZlLW5hdGl2ZSc7XG5cdFx0fSBlbHNlIGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiAhaXNOYXRpdmUpIHtcblx0XHRcdG1vZGUgPSAncGx1Z2luLW5hdGl2ZSc7XG5cdFx0fSBlbHNlIGlmICh0LnVzZVBsdWdpbkZ1bGxTY3JlZW4pIHtcblx0XHRcdGlmIChGZWF0dXJlcy5TVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG5cdFx0XHRcdG1vZGUgPSAncGx1Z2luLWNsaWNrJztcblx0XHRcdFx0Ly8gdGhpcyBuZWVkcyBzb21lIHNwZWNpYWwgc2V0dXBcblx0XHRcdFx0dC5jcmVhdGVQbHVnaW5DbGlja1Rocm91Z2goKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1vZGUgPSAncGx1Z2luLWhvdmVyJztcblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtb2RlID0gJ2Z1bGx3aW5kb3cnO1xuXHRcdH1cblxuXG5cdFx0dC5mdWxsc2NyZWVuTW9kZSA9IG1vZGU7XG5cdFx0cmV0dXJuIG1vZGU7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjcmVhdGVQbHVnaW5DbGlja1Rocm91Z2g6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBkb24ndCBidWlsZCB0d2ljZVxuXHRcdGlmICh0LmlzUGx1Z2luQ2xpY2tUaHJvdWdoQ3JlYXRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGFsbG93cyBjbGlja2luZyB0aHJvdWdoIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbiBhbmQgY29udHJvbHMgZG93biBkaXJlY3RseSB0byBGbGFzaFxuXG5cdFx0Lypcblx0XHQgV2hlbiBhIHVzZXIgcHV0cyBoaXMgbW91c2Ugb3ZlciB0aGUgZnVsbHNjcmVlbiBidXR0b24sIHdlIGRpc2FibGUgdGhlIGNvbnRyb2xzIHNvIHRoYXQgbW91c2UgZXZlbnRzIGNhbiBnbyBkb3duIHRvIGZsYXNoIChwb2ludGVyLWV2ZW50cylcblx0XHQgV2UgdGhlbiBwdXQgYSBkaXZzIG92ZXIgdGhlIHZpZGVvIGFuZCBvbiBlaXRoZXIgc2lkZSBvZiB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHQgdG8gY2FwdHVyZSBtb3VzZSBtb3ZlbWVudCBhbmQgcmVzdG9yZSB0aGUgY29udHJvbHMgb25jZSB0aGUgbW91c2UgbW92ZXMgb3V0c2lkZSBvZiB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHQgKi9cblxuXHRcdGxldCBmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IGZhbHNlLFxuXHRcdFx0cmVzdG9yZUNvbnRyb2xzID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoZnVsbHNjcmVlbklzRGlzYWJsZWQpIHtcblx0XHRcdFx0XHQvLyBoaWRlIHRoZSBob3ZlcnNcblx0XHRcdFx0XHRmb3IgKGxldCBpIGluIGhvdmVyRGl2cykge1xuXHRcdFx0XHRcdFx0aG92ZXJEaXZzW2ldLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyByZXN0b3JlIHRoZSBjb250cm9sIGJhclxuXHRcdFx0XHRcdHQuZnVsbHNjcmVlbkJ0bi5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXHRcdFx0XHRcdHQuY29udHJvbHMuY3NzKCdwb2ludGVyLWV2ZW50cycsICcnKTtcblxuXHRcdFx0XHRcdC8vIHByZXZlbnQgY2xpY2tzIGZyb20gcGF1c2luZyB2aWRlb1xuXHRcdFx0XHRcdHQubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cblx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgbGF0ZXJcblx0XHRcdFx0XHRmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aG92ZXJEaXZzID0ge30sXG5cdFx0XHRob3ZlckRpdk5hbWVzID0gWyd0b3AnLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nXSxcblx0XHRcdHBvc2l0aW9uSG92ZXJEaXZzID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLmxlZnQgLSB0LmNvbnRhaW5lci5vZmZzZXQoKS5sZWZ0LFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3AgPSBmdWxsc2NyZWVuQnRuLm9mZnNldCgpLnRvcCAtIHQuY29udGFpbmVyLm9mZnNldCgpLnRvcCxcblx0XHRcdFx0XHRmdWxsU2NyZWVuQnRuV2lkdGggPSBmdWxsc2NyZWVuQnRuLm91dGVyV2lkdGgodHJ1ZSksXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbkJ0bkhlaWdodCA9IGZ1bGxzY3JlZW5CdG4ub3V0ZXJIZWlnaHQodHJ1ZSksXG5cdFx0XHRcdFx0Y29udGFpbmVyV2lkdGggPSB0LmNvbnRhaW5lci53aWR0aCgpLFxuXHRcdFx0XHRcdGNvbnRhaW5lckhlaWdodCA9IHQuY29udGFpbmVyLmhlaWdodCgpO1xuXG5cdFx0XHRcdGZvciAobGV0IGhvdmVyIGluIGhvdmVyRGl2cykge1xuXHRcdFx0XHRcdGhvdmVyLmNzcyh7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMH0pOyAvLywgYmFja2dyb3VuZENvbG9yOiAnI2YwMCd9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG92ZXIgdmlkZW8sIGJ1dCBub3QgY29udHJvbHNcblx0XHRcdFx0aG92ZXJEaXZzLnRvcFxuXHRcdFx0XHRcdC53aWR0aChjb250YWluZXJXaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3ApO1xuXG5cdFx0XHRcdC8vIG92ZXIgY29udHJvbHMsIGJ1dCBub3QgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uXG5cdFx0XHRcdGhvdmVyRGl2cy5sZWZ0XG5cdFx0XHRcdFx0LndpZHRoKGZ1bGxTY3JlZW5CdG5PZmZzZXRMZWZ0KVxuXHRcdFx0XHRcdC5oZWlnaHQoZnVsbFNjcmVlbkJ0bkhlaWdodClcblx0XHRcdFx0XHQuY3NzKHt0b3A6IGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3B9KTtcblxuXHRcdFx0XHQvLyBhZnRlciB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHRcdFx0aG92ZXJEaXZzLnJpZ2h0XG5cdFx0XHRcdFx0LndpZHRoKGNvbnRhaW5lcldpZHRoIC0gZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgLSBmdWxsU2NyZWVuQnRuV2lkdGgpXG5cdFx0XHRcdFx0LmhlaWdodChmdWxsU2NyZWVuQnRuSGVpZ2h0KVxuXHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0dG9wOiBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wLFxuXHRcdFx0XHRcdFx0bGVmdDogZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQgKyBmdWxsU2NyZWVuQnRuV2lkdGhcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyB1bmRlciB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHRcdFx0aG92ZXJEaXZzLmJvdHRvbVxuXHRcdFx0XHRcdC53aWR0aChjb250YWluZXJXaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KGNvbnRhaW5lckhlaWdodCAtIGZ1bGxTY3JlZW5CdG5IZWlnaHQgLSBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wKVxuXHRcdFx0XHRcdC5jc3Moe3RvcDogZnVsbFNjcmVlbkJ0bk9mZnNldFRvcCArIGZ1bGxTY3JlZW5CdG5IZWlnaHR9KTtcblx0XHRcdH07XG5cblx0XHR0Lmdsb2JhbEJpbmQoJ3Jlc2l6ZScsICgpID0+IHtcblx0XHRcdHBvc2l0aW9uSG92ZXJEaXZzKCk7XG5cdFx0fSk7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gaG92ZXJEaXZOYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aG92ZXJEaXZzW2hvdmVyRGl2TmFtZXNbaV1dID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW4taG92ZXJcIiAvPmApXG5cdFx0XHRcdC5hcHBlbmRUbyh0LmNvbnRhaW5lcikubW91c2VvdmVyKHJlc3RvcmVDb250cm9scykuaGlkZSgpO1xuXHRcdH1cblxuXHRcdC8vIG9uIGhvdmVyLCBraWxsIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbidzIEhUTUwgaGFuZGxpbmcsIGFsbG93aW5nIGNsaWNrcyBkb3duIHRvIEZsYXNoXG5cdFx0ZnVsbHNjcmVlbkJ0bi5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXG5cdFx0XHRpZiAoIXQuaXNGdWxsU2NyZWVuKSB7XG5cblx0XHRcdFx0bGV0IGJ1dHRvblBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCksXG5cdFx0XHRcdFx0Y29udGFpbmVyUG9zID0gcGxheWVyLmNvbnRhaW5lci5vZmZzZXQoKTtcblxuXHRcdFx0XHQvLyBtb3ZlIHRoZSBidXR0b24gaW4gRmxhc2ggaW50byBwbGFjZVxuXHRcdFx0XHRtZWRpYS5wb3NpdGlvbkZ1bGxzY3JlZW5CdXR0b24oYnV0dG9uUG9zLmxlZnQgLSBjb250YWluZXJQb3MubGVmdCwgYnV0dG9uUG9zLnRvcCAtIGNvbnRhaW5lclBvcy50b3AsIGZhbHNlKTtcblxuXHRcdFx0XHQvLyBhbGxvd3MgY2xpY2sgdGhyb3VnaFxuXHRcdFx0XHR0LmZ1bGxzY3JlZW5CdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cdFx0XHRcdHQuY29udHJvbHMuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cblx0XHRcdFx0Ly8gcmVzdG9yZSBjbGljay10by1wbGF5XG5cdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cblx0XHRcdFx0Ly8gc2hvdyB0aGUgZGl2cyB0aGF0IHdpbGwgcmVzdG9yZSB0aGluZ3Ncblx0XHRcdFx0Zm9yIChsZXQgaSBpbiBob3ZlckRpdnMpIHtcblx0XHRcdFx0XHRob3ZlckRpdnNbaV0uc2hvdygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cG9zaXRpb25Ib3ZlckRpdnMoKTtcblxuXHRcdFx0XHRmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdC8vIHJlc3RvcmUgY29udHJvbHMgYW55dGltZSB0aGUgdXNlciBlbnRlcnMgb3IgbGVhdmVzIGZ1bGxzY3JlZW5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgKCkgPT4ge1xuXHRcdFx0dC5pc0Z1bGxTY3JlZW4gPSAhdC5pc0Z1bGxTY3JlZW47XG5cdFx0XHQvLyBkb24ndCBhbGxvdyBwbHVnaW4gY2xpY2sgdG8gcGF1c2UgdmlkZW8gLSBtZXNzZXMgd2l0aFxuXHRcdFx0Ly8gcGx1Z2luJ3MgY29udHJvbHNcblx0XHRcdGlmICh0LmlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHR0Lm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2spO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHRcdHJlc3RvcmVDb250cm9scygpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyB0aGUgbW91c2VvdXQgZXZlbnQgZG9lc24ndCB3b3JrIG9uIHRoZSBmdWxsc2NyZW4gYnV0dG9uLCBiZWNhdXNlIHdlIGFscmVhZHkga2lsbGVkIHRoZSBwb2ludGVyLWV2ZW50c1xuXHRcdC8vIHNvIHdlIHVzZSB0aGUgZG9jdW1lbnQubW91c2Vtb3ZlIGV2ZW50IHRvIHJlc3RvcmUgY29udHJvbHMgd2hlbiB0aGUgbW91c2UgbW92ZXMgb3V0c2lkZSB0aGUgZnVsbHNjcmVlbiBidXR0b25cblxuXHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuXHRcdFx0Ly8gaWYgdGhlIG1vdXNlIGlzIGFueXdoZXJlIGJ1dCB0aGUgZnVsbHNjZWVuIGJ1dHRvbiwgdGhlbiByZXN0b3JlIGl0IGFsbFxuXHRcdFx0aWYgKGZ1bGxzY3JlZW5Jc0Rpc2FibGVkKSB7XG5cblx0XHRcdFx0Y29uc3QgZnVsbHNjcmVlbkJ0blBvcyA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCk7XG5cblx0XHRcdFx0aWYgKGUucGFnZVkgPCBmdWxsc2NyZWVuQnRuUG9zLnRvcCB8fCBlLnBhZ2VZID4gZnVsbHNjcmVlbkJ0blBvcy50b3AgKyBmdWxsc2NyZWVuQnRuLm91dGVySGVpZ2h0KHRydWUpIHx8XG5cdFx0XHRcdFx0ZS5wYWdlWCA8IGZ1bGxzY3JlZW5CdG5Qb3MubGVmdCB8fCBlLnBhZ2VYID4gZnVsbHNjcmVlbkJ0blBvcy5sZWZ0ICsgZnVsbHNjcmVlbkJ0bi5vdXRlcldpZHRoKHRydWUpKSB7XG5cblx0XHRcdFx0XHRmdWxsc2NyZWVuQnRuLmNzcygncG9pbnRlci1ldmVudHMnLCAnJyk7XG5cdFx0XHRcdFx0dC5jb250cm9scy5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXG5cdFx0XHRcdFx0ZnVsbHNjcmVlbklzRGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHR0LmlzUGx1Z2luQ2xpY2tUaHJvdWdoQ3JlYXRlZCA9IHRydWU7XG5cdH0sXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGRlc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgY2xlYW5gIGFuZCB0aGUgbmFtZSB0aGF0IHdhcyB1c2VkIGluIGZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKi9cblx0Y2xlYW5mdWxsc2NyZWVuOiBmdW5jdGlvbiAocGxheWVyKSAge1xuXHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZW50ZXJGdWxsU2NyZWVuOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhodG1sNXxuYXRpdmUpLykgIT09IG51bGxcblx0XHQ7XG5cblx0XHRpZiAoRmVhdHVyZXMuSVNfSU9TICYmIEZlYXR1cmVzLkhBU19JT1NfRlVMTFNDUkVFTiAmJiB0eXBlb2YgdC5tZWRpYS53ZWJraXRFbnRlckZ1bGxzY3JlZW4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHQubWVkaWEud2Via2l0RW50ZXJGdWxsc2NyZWVuKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gc2V0IGl0IHRvIG5vdCBzaG93IHNjcm9sbCBiYXJzIHNvIDEwMCUgd2lsbCB3b3JrXG5cdFx0JChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHQvLyBzdG9yZSBzaXppbmdcblx0XHR0Lm5vcm1hbEhlaWdodCA9IHQuY29udGFpbmVyLmhlaWdodCgpO1xuXHRcdHQubm9ybWFsV2lkdGggPSB0LmNvbnRhaW5lci53aWR0aCgpO1xuXG5cblx0XHQvLyBhdHRlbXB0IHRvIGRvIHRydWUgZnVsbHNjcmVlblxuXHRcdGlmICh0LmZ1bGxzY3JlZW5Nb2RlID09PSAnbmF0aXZlLW5hdGl2ZScgfHwgdC5mdWxsc2NyZWVuTW9kZSA9PT0gJ3BsdWdpbi1uYXRpdmUnKSB7XG5cblx0XHRcdEZlYXR1cmVzLnJlcXVlc3RGdWxsU2NyZWVuKHQuY29udGFpbmVyWzBdKTtcblxuXHRcdFx0aWYgKHQuaXNJbklmcmFtZSkge1xuXHRcdFx0XHQvLyBzb21ldGltZXMgZXhpdGluZyBmcm9tIGZ1bGxzY3JlZW4gZG9lc24ndCB3b3JrXG5cdFx0XHRcdC8vIG5vdGFibHkgaW4gQ2hyb21lIDxpZnJhbWU+LiBGaXhlZCBpbiB2ZXJzaW9uIDE3XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gY2hlY2tGdWxsc2NyZWVuICgpIHtcblxuXHRcdFx0XHRcdGlmICh0LmlzTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdFx0bGV0IHBlcmNlbnRFcnJvck1hcmdpbiA9IDAuMDAyLCAvLyAwLjIlXG5cdFx0XHRcdFx0XHRcdHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXG5cdFx0XHRcdFx0XHRcdHNjcmVlbldpZHRoID0gc2NyZWVuLndpZHRoLFxuXHRcdFx0XHRcdFx0XHRhYnNEaWZmID0gTWF0aC5hYnMoc2NyZWVuV2lkdGggLSB3aW5kb3dXaWR0aCksXG5cdFx0XHRcdFx0XHRcdG1hcmdpbkVycm9yID0gc2NyZWVuV2lkdGggKiBwZXJjZW50RXJyb3JNYXJnaW47XG5cblx0XHRcdFx0XHRcdC8vIGNoZWNrIGlmIHRoZSB2aWRlbyBpcyBzdWRkZW5seSBub3QgcmVhbGx5IGZ1bGxzY3JlZW5cblx0XHRcdFx0XHRcdGlmIChhYnNEaWZmID4gbWFyZ2luRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0Ly8gbWFudWFsbHkgZXhpdFxuXHRcdFx0XHRcdFx0XHR0LmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyB0ZXN0IGFnYWluXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tGdWxsc2NyZWVuLCA1MDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAodC5mdWxsc2NyZWVNb2RlID09PSAnZnVsbHdpbmRvdycpIHtcblx0XHRcdC8vIG1vdmUgaW50byBwb3NpdGlvblxuXG5cdFx0fVxuXG5cdFx0Ly8gbWFrZSBmdWxsIHNpemVcblx0XHR0LmNvbnRhaW5lclxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXItZnVsbHNjcmVlbmApXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXG5cdFx0Ly8gT25seSBuZWVkZWQgZm9yIHNhZmFyaSA1LjEgbmF0aXZlIGZ1bGwgc2NyZWVuLCBjYW4gY2F1c2UgZGlzcGxheSBpc3N1ZXMgZWxzZXdoZXJlXG5cdFx0Ly8gQWN0dWFsbHksIGl0IHNlZW1zIHRvIGJlIG5lZWRlZCBmb3IgSUU4LCB0b29cblx0XHR0LmNvbnRhaW5lclNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0LmNvbnRhaW5lci5jc3Moe3dpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfSk7XG5cdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZiAoaXNOYXRpdmUpIHtcblx0XHRcdHQuJG1lZGlhXG5cdFx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jb250YWluZXIuZmluZCgnaWZyYW1lLCBlbWJlZCwgb2JqZWN0LCB2aWRlbycpXG5cdFx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblx0XHR9XG5cblx0XHRpZiAodC5vcHRpb25zLnNldERpbWVuc2lvbnMpIHtcblx0XHRcdHQubWVkaWEuc2V0U2l6ZShzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQpO1xuXHRcdH1cblxuXHRcdHQubGF5ZXJzLmNoaWxkcmVuKCdkaXYnKVxuXHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdC5oZWlnaHQoJzEwMCUnKTtcblxuXHRcdGlmICh0LmZ1bGxzY3JlZW5CdG4pIHtcblx0XHRcdHQuZnVsbHNjcmVlbkJ0blxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW5gKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVuZnVsbHNjcmVlbmApO1xuXHRcdH1cblxuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0dC5pc0Z1bGxTY3JlZW4gPSB0cnVlO1xuXG5cdFx0bGV0IHpvb21GYWN0b3IgPSBNYXRoLm1pbihzY3JlZW4ud2lkdGggLyB0LndpZHRoLCBzY3JlZW4uaGVpZ2h0IC8gdC5oZWlnaHQpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdmb250LXNpemUnLCB6b29tRmFjdG9yICogMTAwICsgJyUnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnbGluZS1oZWlnaHQnLCAnbm9ybWFsJyk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYCkuY3NzKCdib3R0b20nLCAnNDVweCcpO1xuXG5cdFx0dC5jb250YWluZXIudHJpZ2dlcignZW50ZXJlZGZ1bGxzY3JlZW4nKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGV4aXRGdWxsU2NyZWVuOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGlzTmF0aXZlID0gdC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyhuYXRpdmV8aHRtbDUpLykgIT09IG51bGxcblx0XHRcdDtcblxuXHRcdC8vIFByZXZlbnQgY29udGFpbmVyIGZyb20gYXR0ZW1wdGluZyB0byBzdHJldGNoIGEgc2Vjb25kIHRpbWVcblx0XHRjbGVhclRpbWVvdXQodC5jb250YWluZXJTaXplVGltZW91dCk7XG5cblx0XHQvLyBjb21lIG91dCBvZiBuYXRpdmUgZnVsbHNjcmVlblxuXHRcdGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiAoRmVhdHVyZXMuSVNfRlVMTFNDUkVFTiB8fCB0LmlzRnVsbFNjcmVlbikpIHtcblx0XHRcdEZlYXR1cmVzLmNhbmNlbEZ1bGxTY3JlZW4oKTtcblx0XHR9XG5cblx0XHQvLyByZXN0b3JlIHNjcm9sbCBiYXJzIHRvIGRvY3VtZW50XG5cdFx0JChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHR0LmNvbnRhaW5lci5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWZ1bGxzY3JlZW5gKTtcblxuXHRcdGlmICh0Lm9wdGlvbnMuc2V0RGltZW5zaW9ucykge1xuXHRcdFx0dC5jb250YWluZXJcblx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdFx0aWYgKGlzTmF0aXZlKSB7XG5cdFx0XHRcdHQuJG1lZGlhXG5cdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHQuaGVpZ2h0KHQubm9ybWFsSGVpZ2h0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQuY29udGFpbmVyLmZpbmQoJ2lmcmFtZSwgZW1iZWQsIG9iamVjdCwgdmlkZW8nKVxuXHRcdFx0XHRcdC53aWR0aCh0Lm5vcm1hbFdpZHRoKVxuXHRcdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0Lm1lZGlhLnNldFNpemUodC5ub3JtYWxXaWR0aCwgdC5ub3JtYWxIZWlnaHQpO1xuXG5cdFx0XHR0LmxheWVycy5jaGlsZHJlbignZGl2Jylcblx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdH1cblxuXHRcdHQuZnVsbHNjcmVlbkJ0blxuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bmZ1bGxzY3JlZW5gKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuYCk7XG5cblx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdHQuaXNGdWxsU2NyZWVuID0gZmFsc2U7XG5cblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dGApLmNzcygnZm9udC1zaXplJywgJycpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdsaW5lLWhlaWdodCcsICcnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKS5jc3MoJ2JvdHRvbScsICcnKTtcblxuXHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2V4aXRlZGZ1bGxzY3JlZW4nKTtcblx0fVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcblxuLyoqXG4gKiBQbGF5L1BhdXNlIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBlbmFibGVzIHRoZSBkaXNwbGF5aW5nIG9mIGEgUGxheSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyBsb2dpYyB0byB0b2dnbGUgaXRzIHN0YXRlXG4gKiBiZXR3ZWVuIHBhdXNlZCBhbmQgcGxheWluZy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRwbGF5VGV4dDogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0cGF1c2VUZXh0OiAnJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGJ1aWxkcGxheXBhdXNlOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0b3AgPSB0Lm9wdGlvbnMsXG5cdFx0XHRwbGF5VGl0bGUgPSBvcC5wbGF5VGV4dCA/IG9wLnBsYXlUZXh0IDogaTE4bi50KCdtZWpzLnBsYXknKSxcblx0XHRcdHBhdXNlVGl0bGUgPSBvcC5wYXVzZVRleHQgPyBvcC5wYXVzZVRleHQgOiBpMThuLnQoJ21lanMucGF1c2UnKSxcblx0XHRcdHBsYXkgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlwYXVzZS1idXR0b24gYCArXG5cdFx0XHRcdFx0YCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7cGxheVRpdGxlfVwiIGFyaWEtbGFiZWw9XCIke3BhdXNlVGl0bGV9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpXG5cdFx0XHRcdC5jbGljaygoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSksXG5cdFx0XHRwbGF5X2J0biA9IHBsYXkuZmluZCgnYnV0dG9uJyk7XG5cblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHdoaWNoIC0gdG9rZW4gdG8gZGV0ZXJtaW5lIG5ldyBzdGF0ZSBvZiBidXR0b25cblx0XHQgKi9cblx0XHRmdW5jdGlvbiB0b2dnbGVQbGF5UGF1c2UgKHdoaWNoKSB7XG5cdFx0XHRpZiAoJ3BsYXknID09PSB3aGljaCkge1xuXHRcdFx0XHRwbGF5LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5YClcblx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1yZXBsYXlgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBhdXNlYCk7XG5cdFx0XHRcdHBsYXlfYnRuLmF0dHIoe1xuXHRcdFx0XHRcdCd0aXRsZSc6IHBhdXNlVGl0bGUsXG5cdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBwYXVzZVRpdGxlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGxheS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGF1c2VgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXJlcGxheWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheWApO1xuXHRcdFx0XHRwbGF5X2J0bi5hdHRyKHtcblx0XHRcdFx0XHQndGl0bGUnOiBwbGF5VGl0bGUsXG5cdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBwbGF5VGl0bGVcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dG9nZ2xlUGxheVBhdXNlKCdwc2UnKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BsYXknKTtcblx0XHR9LCBmYWxzZSk7XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsICgpID0+IHtcblx0XHRcdHRvZ2dsZVBsYXlQYXVzZSgncGxheScpO1xuXHRcdH0sIGZhbHNlKTtcblxuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BzZScpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwYXVzZWQnLCAoKSA9PiB7XG5cdFx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BzZScpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuXG5cdFx0XHRpZiAoIXBsYXllci5vcHRpb25zLmxvb3ApIHtcblx0XHRcdFx0cGxheS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGF1c2VgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXJlcGxheWApO1xuXHRcdFx0fVxuXG5cdFx0fSwgZmFsc2UpO1xuXHR9XG59KTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7SVNfRklSRUZPWCwgSEFTX1RPVUNIfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHtzZWNvbmRzVG9UaW1lQ29kZX0gZnJvbSAnLi4vdXRpbHMvdGltZSc7XG5cbi8qKlxuICogUHJvZ3Jlc3MvbG9hZGVkIGJhclxuICpcbiAqIFRoaXMgZmVhdHVyZSBjcmVhdGVzIGEgcHJvZ3Jlc3MgYmFyIHdpdGggYSBzbGlkZXIgaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgdXBkYXRlcyBpdCBiYXNlZCBvbiBuYXRpdmUgZXZlbnRzLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogRW5hYmxlIHRvb2x0aXAgdGhhdCBzaG93cyB0aW1lIGluIHByb2dyZXNzIGJhclxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGVuYWJsZVByb2dyZXNzVG9vbHRpcDogdHJ1ZVxufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkcHJvZ3Jlc3M6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2UsXG5cdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlLFxuXHRcdFx0bGFzdEtleVByZXNzVGltZSA9IDAsXG5cdFx0XHRzdGFydGVkUGF1c2VkID0gZmFsc2UsXG5cdFx0XHRhdXRvUmV3aW5kSW5pdGlhbCA9IHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQsXG5cdFx0XHR0b29sdGlwID0gcGxheWVyLm9wdGlvbnMuZW5hYmxlUHJvZ3Jlc3NUb29sdGlwID9cblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdFwiPmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXQtY3VycmVudFwiPjAwOjAwPC9zcGFuPmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXQtY29ybmVyXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPC9zcGFuPmAgOiBcIlwiO1xuXG5cdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbFwiPmAgK1xuXHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS10b3RhbCAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXNsaWRlclwiPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ1wiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1sb2FkZWRcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtY3VycmVudFwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1oYW5kbGVcIj48L3NwYW4+YCArXG5cdFx0XHRcdGAke3Rvb2x0aXB9YCArXG5cdFx0XHRgPC9zcGFuPmAgK1xuXHRcdGA8L2Rpdj5gKVxuXHRcdC5hcHBlbmRUbyhjb250cm9scyk7XG5cdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXG5cdFx0dC5yYWlsID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbGApO1xuXHRcdHQudG90YWwgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS10b3RhbGApO1xuXHRcdHQubG9hZGVkID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtbG9hZGVkYCk7XG5cdFx0dC5jdXJyZW50ID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtY3VycmVudGApO1xuXHRcdHQuaGFuZGxlID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtaGFuZGxlYCk7XG5cdFx0dC50aW1lZmxvYXQgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdGApO1xuXHRcdHQudGltZWZsb2F0Y3VycmVudCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0LWN1cnJlbnRgKTtcblx0XHR0LnNsaWRlciA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXNsaWRlcmApO1xuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEBwYXJhbSB7RXZlbnR9IGVcblx0XHQgKi9cblx0XHRsZXQgaGFuZGxlTW91c2VNb3ZlID0gKGUpID0+IHtcblxuXHRcdFx0XHRsZXQgb2Zmc2V0ID0gdC50b3RhbC5vZmZzZXQoKSxcblx0XHRcdFx0XHR3aWR0aCA9IHQudG90YWwud2lkdGgoKSxcblx0XHRcdFx0XHRwZXJjZW50YWdlID0gMCxcblx0XHRcdFx0XHRuZXdUaW1lID0gMCxcblx0XHRcdFx0XHRwb3MgPSAwLFxuXHRcdFx0XHRcdHhcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIG1vdXNlIG9yIHRvdWNoIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0aWYgKGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMpIHtcblx0XHRcdFx0XHR4ID0gZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGUuY2hhbmdlZFRvdWNoZXMpIHsgLy8gZm9yIFplcHRvXG5cdFx0XHRcdFx0eCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0eCA9IGUucGFnZVg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobWVkaWEuZHVyYXRpb24pIHtcblx0XHRcdFx0XHRpZiAoeCA8IG9mZnNldC5sZWZ0KSB7XG5cdFx0XHRcdFx0XHR4ID0gb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh4ID4gd2lkdGggKyBvZmZzZXQubGVmdCkge1xuXHRcdFx0XHRcdFx0eCA9IHdpZHRoICsgb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cG9zID0geCAtIG9mZnNldC5sZWZ0O1xuXHRcdFx0XHRcdHBlcmNlbnRhZ2UgPSAocG9zIC8gd2lkdGgpO1xuXHRcdFx0XHRcdG5ld1RpbWUgPSAocGVyY2VudGFnZSA8PSAwLjAyKSA/IDAgOiBwZXJjZW50YWdlICogbWVkaWEuZHVyYXRpb247XG5cblx0XHRcdFx0XHQvLyBzZWVrIHRvIHdoZXJlIHRoZSBtb3VzZSBpc1xuXHRcdFx0XHRcdGlmIChtb3VzZUlzRG93biAmJiBuZXdUaW1lLnRvRml4ZWQoNCkgIT09IG1lZGlhLmN1cnJlbnRUaW1lLnRvRml4ZWQoNCkpIHtcblx0XHRcdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHBvc2l0aW9uIGZsb2F0aW5nIHRpbWUgYm94XG5cdFx0XHRcdFx0aWYgKCFIQVNfVE9VQ0gpIHtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0LmNzcygnbGVmdCcsIHBvcyk7XG5cdFx0XHRcdFx0XHR0LnRpbWVmbG9hdGN1cnJlbnQuaHRtbChzZWNvbmRzVG9UaW1lQ29kZShuZXdUaW1lLCBwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93SG91cnMpKTtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0LnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIFVwZGF0ZSBlbGVtZW50cyBpbiBwcm9ncmVzcyBiYXIgZm9yIGFjY2Vzc2liaWxpdHkgcHVycG9zZXMgb25seSB3aGVuIHBsYXllciBpcyBwYXVzZWQuXG5cdFx0XHQgKlxuXHRcdFx0ICogVGhpcyBpcyB0byBhdm9pZCBhdHRlbXB0cyB0byByZXBlYXQgdGhlIHRpbWUgb3ZlciBhbmQgb3ZlciBhZ2FpbiB3aGVuIG1lZGlhIGlzIHBsYXlpbmcuXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHR1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG5cblx0XHRcdFx0bGV0IHNlY29uZHMgPSBtZWRpYS5jdXJyZW50VGltZSxcblx0XHRcdFx0XHR0aW1lU2xpZGVyVGV4dCA9IGkxOG4udCgnbWVqcy50aW1lLXNsaWRlcicpLFxuXHRcdFx0XHRcdHRpbWUgPSBzZWNvbmRzVG9UaW1lQ29kZShzZWNvbmRzLCBwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93SG91cnMpLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gbWVkaWEuZHVyYXRpb247XG5cblx0XHRcdFx0dC5zbGlkZXIuYXR0cih7XG5cdFx0XHRcdFx0J3JvbGUnOiAnc2xpZGVyJyxcblx0XHRcdFx0XHQndGFiaW5kZXgnOiAwXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0dC5zbGlkZXIuYXR0cih7XG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IHRpbWVTbGlkZXJUZXh0LFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWVtaW4nOiAwLFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWVtYXgnOiBkdXJhdGlvbixcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVlbm93Jzogc2Vjb25kcyxcblx0XHRcdFx0XHRcdCdhcmlhLXZhbHVldGV4dCc6IHRpbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0LnNsaWRlci5yZW1vdmVBdHRyKCdhcmlhLWxhYmVsIGFyaWEtdmFsdWVtaW4gYXJpYS12YWx1ZW1heCBhcmlhLXZhbHVlbm93IGFyaWEtdmFsdWV0ZXh0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRyZXN0YXJ0UGxheWVyID0gKCkgPT4ge1xuXHRcdFx0XHRsZXQgbm93ID0gbmV3IERhdGUoKTtcblx0XHRcdFx0aWYgKG5vdyAtIGxhc3RLZXlQcmVzc1RpbWUgPj0gMTAwMCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdC8vIEV2ZW50c1xuXHRcdHQuc2xpZGVyLm9uKCdmb2N1cycsICgpID0+IHtcblx0XHRcdHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQgPSBmYWxzZTtcblx0XHR9KS5vbignYmx1cicsICgpID0+IHtcblx0XHRcdHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQgPSBhdXRvUmV3aW5kSW5pdGlhbDtcblx0XHR9KS5vbigna2V5ZG93bicsIChlKSA9PiB7XG5cblx0XHRcdGlmICgobmV3IERhdGUoKSAtIGxhc3RLZXlQcmVzc1RpbWUpID49IDEwMDApIHtcblx0XHRcdFx0c3RhcnRlZFBhdXNlZCA9IG1lZGlhLnBhdXNlZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQub3B0aW9ucy5rZXlBY3Rpb25zLmxlbmd0aCkge1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdGtleUNvZGUgPSBlLndoaWNoIHx8IGUua2V5Q29kZSB8fCAwLFxuXHRcdFx0XHRcdGR1cmF0aW9uID0gbWVkaWEuZHVyYXRpb24sXG5cdFx0XHRcdFx0c2Vla1RpbWUgPSBtZWRpYS5jdXJyZW50VGltZSxcblx0XHRcdFx0XHRzZWVrRm9yd2FyZCA9IHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrRm9yd2FyZEludGVydmFsKG1lZGlhKSxcblx0XHRcdFx0XHRzZWVrQmFja3dhcmQgPSBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0JhY2t3YXJkSW50ZXJ2YWwobWVkaWEpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRcdFx0XHRjYXNlIDM3OiAvLyBsZWZ0XG5cdFx0XHRcdFx0Y2FzZSA0MDogLy8gRG93blxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRcdFx0XHRzZWVrVGltZSAtPSBzZWVrQmFja3dhcmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM5OiAvLyBSaWdodFxuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIFVwXG5cdFx0XHRcdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdFx0XHRcdHNlZWtUaW1lICs9IHNlZWtGb3J3YXJkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzNjogLy8gSG9tZVxuXHRcdFx0XHRcdFx0c2Vla1RpbWUgPSAwO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzNTogLy8gZW5kXG5cdFx0XHRcdFx0XHRzZWVrVGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzMjogLy8gc3BhY2Vcblx0XHRcdFx0XHRcdGlmICghSVNfRklSRUZPWCkge1xuXHRcdFx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlIDEzOiAvLyBlbnRlclxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdHNlZWtUaW1lID0gc2Vla1RpbWUgPCAwID8gMCA6IChzZWVrVGltZSA+PSBkdXJhdGlvbiA/IGR1cmF0aW9uIDogTWF0aC5mbG9vcihzZWVrVGltZSkpO1xuXHRcdFx0XHRsYXN0S2V5UHJlc3NUaW1lID0gbmV3IERhdGUoKTtcblx0XHRcdFx0aWYgKCFzdGFydGVkUGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzZWVrVGltZSA8IG1lZGlhLmR1cmF0aW9uICYmICFzdGFydGVkUGF1c2VkKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChyZXN0YXJ0UGxheWVyLCAxMTAwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKHNlZWtUaW1lKTtcblxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSkub24oJ2NsaWNrJywgKGUpID0+IHtcblxuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRsZXQgcGF1c2VkID0gbWVkaWEucGF1c2VkO1xuXG5cdFx0XHRcdGlmICghcGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblxuXHRcdFx0XHRpZiAoIXBhdXNlZCkge1xuXHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH0pO1xuXG5cblx0XHQvLyBoYW5kbGUgY2xpY2tzXG5cdFx0dC5yYWlsLm9uKCdtb3VzZWRvd24gdG91Y2hzdGFydCcsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdC8vIG9ubHkgaGFuZGxlIGxlZnQgY2xpY2tzIG9yIHRvdWNoXG5cdFx0XHRcdGlmIChlLndoaWNoID09PSAxIHx8IGUud2hpY2ggPT09IDApIHtcblx0XHRcdFx0XHRtb3VzZUlzRG93biA9IHRydWU7XG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXHRcdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlLmR1ciB0b3VjaG1vdmUuZHVyJywgKGUpID0+IHtcblx0XHRcdFx0XHRcdGhhbmRsZU1vdXNlTW92ZShlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNldXAuZHVyIHRvdWNoZW5kLmR1cicsICgpID0+IHtcblx0XHRcdFx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpZiAodC50aW1lZmxvYXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHR0LnRpbWVmbG9hdC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0Lmdsb2JhbFVuYmluZCgnbW91c2Vtb3ZlLmR1ciB0b3VjaG1vdmUuZHVyIG1vdXNldXAuZHVyIHRvdWNoZW5kLmR1cicpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSkub24oJ21vdXNlZW50ZXInLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IHRydWU7XG5cdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlLmR1cicsIChlKSA9PiB7XG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYgKHQudGltZWZsb2F0ICE9PSB1bmRlZmluZWQgJiYgIUhBU19UT1VDSCkge1xuXHRcdFx0XHRcdHQudGltZWZsb2F0LnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoIW1vdXNlSXNEb3duKSB7XG5cdFx0XHRcdFx0dC5nbG9iYWxVbmJpbmQoJ21vdXNlbW92ZS5kdXInKTtcblx0XHRcdFx0XHRpZiAodC50aW1lZmxvYXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dC50aW1lZmxvYXQuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gbG9hZGluZ1xuXHRcdC8vIElmIG1lZGlhIGlzIGRvZXMgbm90IGhhdmUgYSBmaW5pdGUgZHVyYXRpb24sIHJlbW92ZSBwcm9ncmVzcyBiYXIgaW50ZXJhY3Rpb25cblx0XHQvLyBhbmQgaW5kaWNhdGUgdGhhdCBpcyBhIGxpdmUgYnJvYWRjYXN0XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRwbGF5ZXIuc2V0UHJvZ3Jlc3NSYWlsKGUpO1xuXHRcdFx0XHRwbGF5ZXIuc2V0Q3VycmVudFJhaWwoZSk7XG5cdFx0XHR9IGVsc2UgaWYgKCFjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0YCkubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXJhaWxgKS5lbXB0eSgpXG5cdFx0XHRcdFx0Lmh0bWwoYDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0XCI+JHttZWpzLmkxOG4udCgnbWVqcy5saXZlLWJyb2FkY2FzdCcpfTwvc3Bhbj5gKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cblx0XHQvLyBjdXJyZW50IHRpbWVcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkgKSB7XG5cdFx0XHRcdHBsYXllci5zZXRQcm9ncmVzc1JhaWwoZSk7XG5cdFx0XHRcdHBsYXllci5zZXRDdXJyZW50UmFpbChlKTtcblx0XHRcdFx0dXBkYXRlU2xpZGVyKGUpO1xuXHRcdFx0fSBlbHNlIGlmICghY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdGApLmxlbmd0aCkge1xuXHRcdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1yYWlsYCkuZW1wdHkoKVxuXHRcdFx0XHRcdC5odG1sKGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJyb2FkY2FzdFwiPiR7bWVqcy5pMThuLnQoJ21lanMubGl2ZS1icm9hZGNhc3QnKX08L3NwYW4+YCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0dC5jb250YWluZXIub24oJ2NvbnRyb2xzcmVzaXplJywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0cGxheWVyLnNldFByb2dyZXNzUmFpbChlKTtcblx0XHRcdFx0cGxheWVyLnNldEN1cnJlbnRSYWlsKGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGhlIHByb2dyZXNzIG9uIHRoZSBtZWRpYSBhbmQgdXBkYXRlIHByb2dyZXNzIGJhcidzIHdpZHRoXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGVcblx0ICovXG5cdHNldFByb2dyZXNzUmFpbDogZnVuY3Rpb24gKGUpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dGFyZ2V0ID0gKGUgIT09IHVuZGVmaW5lZCkgPyBlLnRhcmdldCA6IHQubWVkaWEsXG5cdFx0XHRwZXJjZW50ID0gbnVsbDtcblxuXHRcdC8vIG5ld2VzdCBIVE1MNSBzcGVjIGhhcyBidWZmZXJlZCBhcnJheSAoRkY0LCBXZWJraXQpXG5cdFx0aWYgKHRhcmdldCAmJiB0YXJnZXQuYnVmZmVyZWQgJiYgdGFyZ2V0LmJ1ZmZlcmVkLmxlbmd0aCA+IDAgJiYgdGFyZ2V0LmJ1ZmZlcmVkLmVuZCAmJiB0YXJnZXQuZHVyYXRpb24pIHtcblx0XHRcdC8vIGFjY291bnQgZm9yIGEgcmVhbCBhcnJheSB3aXRoIG11bHRpcGxlIHZhbHVlcyAtIGFsd2F5cyByZWFkIHRoZSBlbmQgb2YgdGhlIGxhc3QgYnVmZmVyXG5cdFx0XHRwZXJjZW50ID0gdGFyZ2V0LmJ1ZmZlcmVkLmVuZCh0YXJnZXQuYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyB0YXJnZXQuZHVyYXRpb247XG5cdFx0fVxuXHRcdC8vIFNvbWUgYnJvd3NlcnMgKGUuZy4sIEZGMy42IGFuZCBTYWZhcmkgNSkgY2Fubm90IGNhbGN1bGF0ZSB0YXJnZXQuYnVmZmVyZXJlZC5lbmQoKVxuXHRcdC8vIHRvIGJlIGFueXRoaW5nIG90aGVyIHRoYW4gMC4gSWYgdGhlIGJ5dGUgY291bnQgaXMgYXZhaWxhYmxlIHdlIHVzZSB0aGlzIGluc3RlYWQuXG5cdFx0Ly8gQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHRoZSBlbHNlIGlmIGRvIG5vdCBzZWVtIHRvIGhhdmUgdGhlIGJ1ZmZlcmVkQnl0ZXMgdmFsdWUgYW5kXG5cdFx0Ly8gc2hvdWxkIHNraXAgdG8gdGhlcmUuIFRlc3RlZCBpbiBTYWZhcmkgNSwgV2Via2l0IGhlYWQsIEZGMy42LCBDaHJvbWUgNiwgSUUgNy84LlxuXHRcdGVsc2UgaWYgKHRhcmdldCAmJiB0YXJnZXQuYnl0ZXNUb3RhbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldC5ieXRlc1RvdGFsID4gMCAmJiB0YXJnZXQuYnVmZmVyZWRCeXRlcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwZXJjZW50ID0gdGFyZ2V0LmJ1ZmZlcmVkQnl0ZXMgLyB0YXJnZXQuYnl0ZXNUb3RhbDtcblx0XHR9XG5cdFx0Ly8gRmlyZWZveCAzIHdpdGggYW4gT2dnIGZpbGUgc2VlbXMgdG8gZ28gdGhpcyB3YXlcblx0XHRlbHNlIGlmIChlICYmIGUubGVuZ3RoQ29tcHV0YWJsZSAmJiBlLnRvdGFsICE9PSAwKSB7XG5cdFx0XHRwZXJjZW50ID0gZS5sb2FkZWQgLyBlLnRvdGFsO1xuXHRcdH1cblxuXHRcdC8vIGZpbmFsbHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXJcblx0XHRpZiAocGVyY2VudCAhPT0gbnVsbCkge1xuXHRcdFx0cGVyY2VudCA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHBlcmNlbnQpKTtcblx0XHRcdC8vIHVwZGF0ZSBsb2FkZWQgYmFyXG5cdFx0XHRpZiAodC5sb2FkZWQgJiYgdC50b3RhbCkge1xuXHRcdFx0XHR0LmxvYWRlZC53aWR0aChgJHsocGVyY2VudCAqIDEwMCl9JWApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIFVwZGF0ZSB0aGUgc2xpZGVyJ3Mgd2lkdGggZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IHRpbWVcblx0ICpcblx0ICovXG5cdHNldEN1cnJlbnRSYWlsOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKHQubWVkaWEuY3VycmVudFRpbWUgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhLmR1cmF0aW9uKSB7XG5cblx0XHRcdC8vIHVwZGF0ZSBiYXIgYW5kIGhhbmRsZVxuXHRcdFx0aWYgKHQudG90YWwgJiYgdC5oYW5kbGUpIHtcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0bmV3V2lkdGggPSBNYXRoLnJvdW5kKHQudG90YWwud2lkdGgoKSAqIHQubWVkaWEuY3VycmVudFRpbWUgLyB0Lm1lZGlhLmR1cmF0aW9uKSxcblx0XHRcdFx0XHRoYW5kbGVQb3MgPSBuZXdXaWR0aCAtIE1hdGgucm91bmQodC5oYW5kbGUub3V0ZXJXaWR0aCh0cnVlKSAvIDIpO1xuXG5cdFx0XHRcdG5ld1dpZHRoID0gKHQubWVkaWEuY3VycmVudFRpbWUgLyB0Lm1lZGlhLmR1cmF0aW9uKSAqIDEwMDtcblx0XHRcdFx0dC5jdXJyZW50LndpZHRoKGAke25ld1dpZHRofSVgKTtcblx0XHRcdFx0dC5oYW5kbGUuY3NzKCdsZWZ0JywgaGFuZGxlUG9zKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQge3NlY29uZHNUb1RpbWVDb2RlfSBmcm9tICcuLi91dGlscy90aW1lJztcblxuLyoqXG4gKiBDdXJyZW50L2R1cmF0aW9uIHRpbWVzXG4gKlxuICogVGhpcyBmZWF0dXJlIGNyZWF0ZXMvdXBkYXRlcyB0aGUgZHVyYXRpb24gYW5kIHByb2dyZXNzIHRpbWVzIGluIHRoZSBjb250cm9sIGJhciwgYmFzZWQgb24gbmF0aXZlIGV2ZW50cy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIFRoZSBpbml0aWFsIGR1cmF0aW9uXG5cdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdCAqL1xuXHRkdXJhdGlvbjogMCxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR0aW1lQW5kRHVyYXRpb25TZXBhcmF0b3I6ICc8c3Bhbj4gfCA8L3NwYW4+J1xufSk7XG5cblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEN1cnJlbnQgdGltZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZGN1cnJlbnQ6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lXCIgcm9sZT1cInRpbWVyXCIgYXJpYS1saXZlPVwib2ZmXCI+YCArXG5cdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZVwiPiR7c2Vjb25kc1RvVGltZUNvZGUoMCwgcGxheWVyLm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX08L3NwYW4+YCArXG5cdFx0YDwvZGl2PmApXG5cdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblxuXHRcdHQuY3VycmVudHRpbWUgPSB0LmNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZWApO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0XHRwbGF5ZXIudXBkYXRlQ3VycmVudCgpO1xuXHRcdFx0fVxuXG5cdFx0fSwgZmFsc2UpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBEdXJhdGlvbiB0aW1lIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkZHVyYXRpb246IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmIChjb250cm9scy5jaGlsZHJlbigpLmxhc3QoKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWVgKS5sZW5ndGggPiAwKSB7XG5cdFx0XHQkKGAke3Qub3B0aW9ucy50aW1lQW5kRHVyYXRpb25TZXBhcmF0b3J9PHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvblwiPmAgK1xuXHRcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZSh0Lm9wdGlvbnMuZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfTwvc3Bhbj5gKVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lYCkpO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIGFkZCBjbGFzcyB0byBjdXJyZW50IHRpbWVcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZWApLnBhcmVudCgpXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y3VycmVudHRpbWUtY29udGFpbmVyYCk7XG5cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uLWNvbnRhaW5lclwiPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1kdXJhdGlvblwiPmAgK1xuXHRcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZSh0Lm9wdGlvbnMuZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfTwvc3Bhbj5gICtcblx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblx0XHR9XG5cblx0XHR0LmR1cmF0aW9uRCA9IHQuY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uYCk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdHBsYXllci51cGRhdGVEdXJhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblx0fSxcblxuXHQvKipcblx0ICogVXBkYXRlIHRoZSBjdXJyZW50IHRpbWUgYW5kIG91dHB1dCBpdCBpbiBmb3JtYXQgMDA6MDBcblx0ICpcblx0ICovXG5cdHVwZGF0ZUN1cnJlbnQ6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0bGV0IGN1cnJlbnRUaW1lID0gdC5tZWRpYS5jdXJyZW50VGltZTtcblxuXHRcdGlmIChpc05hTihjdXJyZW50VGltZSkpIHtcblx0XHRcdGN1cnJlbnRUaW1lID0gMDtcblx0XHR9XG5cblx0XHRpZiAodC5jdXJyZW50dGltZSkge1xuXHRcdFx0dC5jdXJyZW50dGltZS5odG1sKHNlY29uZHNUb1RpbWVDb2RlKGN1cnJlbnRUaW1lLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIGR1cmF0aW9uIHRpbWUgYW5kIG91dHB1dCBpdCBpbiBmb3JtYXQgMDA6MDBcblx0ICpcblx0ICovXG5cdHVwZGF0ZUR1cmF0aW9uOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGxldCBkdXJhdGlvbiA9IHQubWVkaWEuZHVyYXRpb247XG5cblx0XHRpZiAoaXNOYU4oZHVyYXRpb24pIHx8IGR1cmF0aW9uID09PSBJbmZpbml0eSB8fCBkdXJhdGlvbiA8IDApIHtcblx0XHRcdHQubWVkaWEuZHVyYXRpb24gPSB0Lm9wdGlvbnMuZHVyYXRpb24gPSBkdXJhdGlvbiA9IDA7XG5cdFx0fVxuXG5cdFx0aWYgKHQub3B0aW9ucy5kdXJhdGlvbiA+IDApIHtcblx0XHRcdGR1cmF0aW9uID0gdC5vcHRpb25zLmR1cmF0aW9uO1xuXHRcdH1cblxuXHRcdC8vVG9nZ2xlIHRoZSBsb25nIHZpZGVvIGNsYXNzIGlmIHRoZSB2aWRlbyBpcyBsb25nZXIgdGhhbiBhbiBob3VyLlxuXHRcdHQuY29udGFpbmVyLnRvZ2dsZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sb25nLXZpZGVvYCwgZHVyYXRpb24gPiAzNjAwKTtcblxuXHRcdGlmICh0LmR1cmF0aW9uRCAmJiBkdXJhdGlvbiA+IDApIHtcblx0XHRcdHQuZHVyYXRpb25ELmh0bWwoc2Vjb25kc1RvVGltZUNvZGUoZHVyYXRpb24sIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2NvcmUvaTE4bic7XG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCB7c2Vjb25kc1RvVGltZUNvZGUsIGNvbnZlcnRTTVBURXRvU2Vjb25kc30gZnJvbSAnLi4vdXRpbHMvdGltZSc7XG5cbi8qKlxuICogQ2xvc2VkIENhcHRpb25zIChDQykgYnV0dG9uXG4gKlxuICogVGhpcyBmZWF0dXJlIGVuYWJsZXMgdGhlIGRpc3BsYXlpbmcgb2YgYSBDQyBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyB0aGUgbWV0aG9kcyB0byBzdGFydCBtZWRpYVxuICogd2l0aCBhIGNlcnRhaW4gbGFuZ3VhZ2UgKGlmIGF2YWlsYWJsZSksIHRvZ2dsZSBjYXB0aW9ucywgZXRjLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogRGVmYXVsdCBsYW5ndWFnZSB0byBzdGFydCBtZWRpYSB1c2luZyBJU08gNjM5LTIgTGFuZ3VhZ2UgQ29kZSBMaXN0IChlbiwgZXMsIGl0LCBldGMuKVxuXHQgKiBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgdHJhY2tzIGZvciBvbmUgbGFuZ3VhZ2UsIHRoZSBsYXN0IHRyYWNrIG5vZGUgZm91bmQgaXMgYWN0aXZhdGVkXG5cdCAqIEBzZWUgaHR0cHM6Ly93d3cubG9jLmdvdi9zdGFuZGFyZHMvaXNvNjM5LTIvcGhwL2NvZGVfbGlzdC5waHBcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHN0YXJ0TGFuZ3VhZ2U6ICcnLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHRyYWNrc1RleHQ6ICcnLFxuXHQvKipcblx0ICogQXZvaWQgdG8gc2NyZWVuIHJlYWRlciBzcGVhayBjYXB0aW9ucyBvdmVyIGFuIGF1ZGlvIHRyYWNrLlxuXHQgKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdHRyYWNrc0FyaWFMaXZlOiBmYWxzZSxcblx0LyoqXG5cdCAqIFJlbW92ZSB0aGUgW2NjXSBidXR0b24gd2hlbiBubyB0cmFjayBub2RlcyBhcmUgcHJlc2VudFxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGhpZGVDYXB0aW9uc0J1dHRvbldoZW5FbXB0eTogdHJ1ZSxcblx0LyoqXG5cdCAqIENoYW5nZSBjYXB0aW9ucyB0byBwb3AtdXAgaWYgdHJ1ZSBhbmQgb25seSBvbmUgdHJhY2sgbm9kZSBpcyBmb3VuZFxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdHRvZ2dsZUNhcHRpb25zQnV0dG9uV2hlbk9ubHlPbmU6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHNsaWRlc1NlbGVjdG9yOiAnJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGhhc0NoYXB0ZXJzOiBmYWxzZSxcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqL1xuXHRidWlsZHRyYWNrczogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cdFx0aWYgKHBsYXllci50cmFja3MubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGF0dHIgPSB0Lm9wdGlvbnMudHJhY2tzQXJpYUxpdmUgPyAnIHJvbGU9XCJsb2dcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIiBhcmlhLWF0b21pYz1cImZhbHNlXCInIDogJycsXG5cdFx0XHR0cmFja3NUaXRsZSA9IHQub3B0aW9ucy50cmFja3NUZXh0ID8gdC5vcHRpb25zLnRyYWNrc1RleHQgOiBpMThuLnQoJ21lanMuY2FwdGlvbnMtc3VidGl0bGVzJyksXG5cdFx0XHRpLFxuXHRcdFx0a2luZFxuXHRcdFx0O1xuXG5cdFx0Ly8gSWYgYnJvd3NlciB3aWxsIGRvIG5hdGl2ZSBjYXB0aW9ucywgcHJlZmVyIG1lanMgY2FwdGlvbnMsIGxvb3AgdGhyb3VnaCB0cmFja3MgYW5kIGhpZGVcblx0XHRpZiAodC5kb21Ob2RlLnRleHRUcmFja3MpIHtcblx0XHRcdGZvciAoaSA9IHQuZG9tTm9kZS50ZXh0VHJhY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHQuZG9tTm9kZS50ZXh0VHJhY2tzW2ldLm1vZGUgPSAnaGlkZGVuJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0LmNsZWFydHJhY2tzKHBsYXllcik7XG5cdFx0cGxheWVyLmNoYXB0ZXJzID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXJzICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+PC9kaXY+YClcblx0XHRcdC5wcmVwZW5kVG8obGF5ZXJzKS5oaWRlKCk7XG5cdFx0cGxheWVyLmNhcHRpb25zID1cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1sYXllciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPmAgK1xuXHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyXCIke2F0dHJ9PmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0LnByZXBlbmRUbyhsYXllcnMpLmhpZGUoKTtcblx0XHRwbGF5ZXIuY2FwdGlvbnNUZXh0ID0gcGxheWVyLmNhcHRpb25zLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCk7XG5cdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uID1cblx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtYnV0dG9uXCI+YCArXG5cdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHt0cmFja3NUaXRsZX1cIiBhcmlhLWxhYmVsPVwiJHt0cmFja3NUaXRsZX1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RvciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj5gICtcblx0XHRcdFx0XHRgPHVsIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGlzdFwiPmAgK1xuXHRcdFx0XHRcdFx0YDxsaSBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxpc3QtaXRlbVwiPmAgK1xuXHRcdFx0XHRcdFx0XHRgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItaW5wdXRcIiBgICtcblx0XHRcdFx0XHRcdFx0XHRgbmFtZT1cIiR7cGxheWVyLmlkfV9jYXB0aW9uc1wiIGlkPVwiJHtwbGF5ZXIuaWR9X2NhcHRpb25zX25vbmVcIiBgICtcblx0XHRcdFx0XHRcdFx0XHRgdmFsdWU9XCJub25lXCIgY2hlY2tlZD1cImNoZWNrZWRcIiAvPmAgK1xuXHRcdFx0XHRcdFx0XHRgPGxhYmVsIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWwgYCArXG5cdFx0XHRcdFx0XHRcdFx0YCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkXCIgYCArXG5cdFx0XHRcdFx0XHRcdFx0YGZvcj1cIiR7cGxheWVyLmlkfV9jYXB0aW9uc19ub25lXCI+JHtpMThuLnQoJ21lanMubm9uZScpfTwvbGFiZWw+YCArXG5cdFx0XHRcdFx0XHRgPC9saT5gICtcblx0XHRcdFx0XHRgPC91bD5gICtcblx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0YDwvZGl2PmApXG5cdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpO1xuXG5cblx0XHRsZXRcblx0XHRcdHN1YnRpdGxlQ291bnQgPSAwLFxuXHRcdFx0dG90YWwgPSBwbGF5ZXIudHJhY2tzLmxlbmd0aFxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRraW5kID0gcGxheWVyLnRyYWNrc1tpXS5raW5kO1xuXHRcdFx0aWYgKGtpbmQgPT09ICdzdWJ0aXRsZXMnIHx8IGtpbmQgPT09ICdjYXB0aW9ucycpIHtcblx0XHRcdFx0c3VidGl0bGVDb3VudCsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGlmIG9ubHkgb25lIGxhbmd1YWdlIHRoZW4ganVzdCBtYWtlIHRoZSBidXR0b24gYSB0b2dnbGVcblx0XHRpZiAodC5vcHRpb25zLnRvZ2dsZUNhcHRpb25zQnV0dG9uV2hlbk9ubHlPbmUgJiYgc3VidGl0bGVDb3VudCA9PT0gMSkge1xuXHRcdFx0Ly8gY2xpY2tcblx0XHRcdHBsYXllci5jYXB0aW9uc0J1dHRvbi5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGxldCB0cmFja0lkID0gJ25vbmUnO1xuXHRcdFx0XHRpZiAocGxheWVyLnNlbGVjdGVkVHJhY2sgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0cmFja0lkID0gcGxheWVyLnRyYWNrc1swXS50cmFja0lkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBsYXllci5zZXRUcmFjayh0cmFja0lkKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBob3ZlciBvciBrZXlib2FyZCBmb2N1c1xuXHRcdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uXG5cdFx0XHRcdC5vbignbW91c2VlbnRlciBmb2N1c2luJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKVxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdtb3VzZWxlYXZlIGZvY3Vzb3V0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Ly8gaGFuZGxlIGNsaWNrcyB0byB0aGUgbGFuZ3VhZ2UgcmFkaW8gYnV0dG9uc1xuXHRcdFx0XHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gdmFsdWUgaXMgdHJhY2tJZCwgc2FtZSBhcyB0aGUgYWN0dWFsIGlkLCBhbmQgd2UncmUgdXNpbmcgaXQgaGVyZVxuXHRcdFx0XHRcdC8vIGJlY2F1c2UgdGhlIFwibm9uZVwiIGNoZWNrYm94IGRvZXNuJ3QgaGF2ZSBhIHRyYWNrSWRcblx0XHRcdFx0XHQvLyB0byB1c2UsIGJ1dCB3ZSB3YW50IHRvIGtub3cgd2hlbiBcIm5vbmVcIiBpcyBjbGlja2VkXG5cdFx0XHRcdFx0cGxheWVyLnNldFRyYWNrKHRoaXMudmFsdWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2NsaWNrJywgYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbGAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vQWxsb3cgdXAvZG93biBhcnJvdyB0byBjaGFuZ2UgdGhlIHNlbGVjdGVkIHJhZGlvIHdpdGhvdXQgY2hhbmdpbmcgdGhlIHZvbHVtZS5cblx0XHRcdFx0Lm9uKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIXBsYXllci5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0Ly8gbW92ZSB3aXRoIGNvbnRyb2xzXG5cdFx0XHRwbGF5ZXIuY29udGFpbmVyXG5cdFx0XHQub24oJ2NvbnRyb2xzc2hvd24nLCAoKSA9PiB7XG5cdFx0XHRcdC8vIHB1c2ggY2FwdGlvbnMgYWJvdmUgY29udHJvbHNcblx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyYCk7XG5cblx0XHRcdH0pXG5cdFx0XHQub24oJ2NvbnRyb2xzaGlkZGVuJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAoIW1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdC8vIG1vdmUgYmFjayB0byBub3JtYWwgcGxhY2Vcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlcmApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbi1ob3ZlcmApO1xuXHRcdH1cblxuXHRcdHBsYXllci50cmFja1RvTG9hZCA9IC0xO1xuXHRcdHBsYXllci5zZWxlY3RlZFRyYWNrID0gbnVsbDtcblx0XHRwbGF5ZXIuaXNMb2FkaW5nVHJhY2sgPSBmYWxzZTtcblxuXHRcdC8vIGFkZCB0byBsaXN0XG5cdFx0Zm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdGtpbmQgPSBwbGF5ZXIudHJhY2tzW2ldLmtpbmQ7XG5cdFx0XHRpZiAoa2luZCA9PT0gJ3N1YnRpdGxlcycgfHwga2luZCA9PT0gJ2NhcHRpb25zJykge1xuXHRcdFx0XHRwbGF5ZXIuYWRkVHJhY2tCdXR0b24ocGxheWVyLnRyYWNrc1tpXS50cmFja0lkLCBwbGF5ZXIudHJhY2tzW2ldLnNyY2xhbmcsIHBsYXllci50cmFja3NbaV0ubGFiZWwpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHN0YXJ0IGxvYWRpbmcgdHJhY2tzXG5cdFx0cGxheWVyLmxvYWROZXh0VHJhY2soKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGlzcGxheUNhcHRpb25zKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnNsaWRlc1NlbGVjdG9yICE9PSAnJykge1xuXHRcdFx0cGxheWVyLnNsaWRlc0NvbnRhaW5lciA9ICQocGxheWVyLm9wdGlvbnMuc2xpZGVzU2VsZWN0b3IpO1xuXG5cdFx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXIuZGlzcGxheVNsaWRlcygpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0fVxuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cdFx0XHRwbGF5ZXIuZGlzcGxheUNoYXB0ZXJzKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0cGxheWVyLmNvbnRhaW5lci5ob3Zlcihcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBjaGFwdGVyc1xuXHRcdFx0XHRpZiAocGxheWVyLmhhc0NoYXB0ZXJzKSB7XG5cdFx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMuZmFkZUluKDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRsZXQgc2VsZiA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHRzZWxmLmhlaWdodChzZWxmLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyYCkub3V0ZXJIZWlnaHQoKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHBsYXllci5oYXNDaGFwdGVycykge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5mYWRlT3V0KDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0dC5jb250YWluZXIub24oJ2NvbnRyb2xzcmVzaXplJywgKCkgPT4ge1xuXHRcdFx0dC5hZGp1c3RMYW5ndWFnZUJveCgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2hlY2sgZm9yIGF1dG9wbGF5XG5cdFx0aWYgKHBsYXllci5ub2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSAhPT0gbnVsbCkge1xuXHRcdFx0cGxheWVyLmNoYXB0ZXJzLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgZGVzdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBjbGVhbmAgYW5kIHRoZSBuYW1lIHRoYXQgd2FzIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqL1xuXHRjbGVhcnRyYWNrczogZnVuY3Rpb24gKHBsYXllcikgIHtcblx0XHRpZiAocGxheWVyKSB7XG5cdFx0XHRpZiAocGxheWVyLmNhcHRpb25zKSB7XG5cdFx0XHRcdHBsYXllci5jYXB0aW9ucy5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwbGF5ZXIuY2hhcHRlcnMpIHtcblx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBsYXllci5jYXB0aW9uc1RleHQpIHtcblx0XHRcdFx0cGxheWVyLmNhcHRpb25zVGV4dC5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwbGF5ZXIuY2FwdGlvbnNCdXR0b24pIHtcblx0XHRcdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRyZWJ1aWxkdHJhY2tzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHR0LmZpbmRUcmFja3MoKTtcblx0XHR0LmJ1aWxkdHJhY2tzKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0fSxcblxuXHRmaW5kVHJhY2tzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR0cmFja3RhZ3MgPSB0LiRtZWRpYS5maW5kKCd0cmFjaycpXG5cdFx0XHQ7XG5cblx0XHQvLyBzdG9yZSBmb3IgdXNlIGJ5IHBsdWdpbnNcblx0XHR0LnRyYWNrcyA9IFtdO1xuXHRcdHRyYWNrdGFncy5lYWNoKChpbmRleCwgdHJhY2spID0+IHtcblxuXHRcdFx0dHJhY2sgPSAkKHRyYWNrKTtcblxuXHRcdFx0bGV0IHNyY2xhbmcgPSAodHJhY2suYXR0cignc3JjbGFuZycpKSA/IHRyYWNrLmF0dHIoJ3NyY2xhbmcnKS50b0xvd2VyQ2FzZSgpIDogJyc7XG5cdFx0XHRsZXQgdHJhY2tJZCA9IGAke3QuaWR9X3RyYWNrXyR7aW5kZXh9XyR7dHJhY2suYXR0cigna2luZCcpfV8ke3NyY2xhbmd9YDtcblx0XHRcdHQudHJhY2tzLnB1c2goe1xuXHRcdFx0XHR0cmFja0lkOiB0cmFja0lkLFxuXHRcdFx0XHRzcmNsYW5nOiBzcmNsYW5nLFxuXHRcdFx0XHRzcmM6IHRyYWNrLmF0dHIoJ3NyYycpLFxuXHRcdFx0XHRraW5kOiB0cmFjay5hdHRyKCdraW5kJyksXG5cdFx0XHRcdGxhYmVsOiB0cmFjay5hdHRyKCdsYWJlbCcpIHx8ICcnLFxuXHRcdFx0XHRlbnRyaWVzOiBbXSxcblx0XHRcdFx0aXNMb2FkZWQ6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWQsIG9yIFwibm9uZVwiIHRvIGRpc2FibGUgY2FwdGlvbnNcblx0ICovXG5cdHNldFRyYWNrOiBmdW5jdGlvbiAodHJhY2tJZCkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aVxuXHRcdFx0O1xuXG5cdFx0dC5jYXB0aW9uc0J1dHRvblxuXHRcdFx0LmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcblx0XHRcdC5lbmQoKVxuXHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZGApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkYClcblx0XHRcdC5lbmQoKVxuXHRcdFx0LmZpbmQoYGlucHV0W3ZhbHVlPVwiJHt0cmFja0lkfVwiXWApLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuXHRcdFx0LnNpYmxpbmdzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGFiZWxgKVxuXHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RlZGApXG5cdFx0O1xuXG5cdFx0aWYgKHRyYWNrSWQgPT09ICdub25lJykge1xuXHRcdFx0dC5zZWxlY3RlZFRyYWNrID0gbnVsbDtcblx0XHRcdHQuY2FwdGlvbnNCdXR0b24ucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWVuYWJsZWRgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdC50cmFja3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCB0cmFjayA9IHQudHJhY2tzW2ldO1xuXHRcdFx0aWYgKHRyYWNrLnRyYWNrSWQgPT09IHRyYWNrSWQpIHtcblx0XHRcdFx0aWYgKHQuc2VsZWN0ZWRUcmFjayA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHQuY2FwdGlvbnNCdXR0b24uYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWVuYWJsZWRgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0LnNlbGVjdGVkVHJhY2sgPSB0cmFjaztcblx0XHRcdFx0dC5jYXB0aW9ucy5hdHRyKCdsYW5nJywgdC5zZWxlY3RlZFRyYWNrLnNyY2xhbmcpO1xuXHRcdFx0XHR0LmRpc3BsYXlDYXB0aW9ucygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRsb2FkTmV4dFRyYWNrOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQudHJhY2tUb0xvYWQrKztcblx0XHRpZiAodC50cmFja1RvTG9hZCA8IHQudHJhY2tzLmxlbmd0aCkge1xuXHRcdFx0dC5pc0xvYWRpbmdUcmFjayA9IHRydWU7XG5cdFx0XHR0LmxvYWRUcmFjayh0LnRyYWNrVG9Mb2FkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gYWRkIGRvbmU/XG5cdFx0XHR0LmlzTG9hZGluZ1RyYWNrID0gZmFsc2U7XG5cblx0XHRcdHQuY2hlY2tGb3JUcmFja3MoKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBpbmRleFxuXHQgKi9cblx0bG9hZFRyYWNrOiBmdW5jdGlvbiAoaW5kZXgpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHRyYWNrID0gdC50cmFja3NbaW5kZXhdLFxuXHRcdFx0YWZ0ZXIgPSAoKSA9PiB7XG5cblx0XHRcdFx0dHJhY2suaXNMb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHRcdHQuZW5hYmxlVHJhY2tCdXR0b24odHJhY2spO1xuXG5cdFx0XHRcdHQubG9hZE5leHRUcmFjaygpO1xuXG5cdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRpZiAodHJhY2sgIT09IHVuZGVmaW5lZCAmJiAodHJhY2suc3JjICE9PSB1bmRlZmluZWQgfHwgdHJhY2suc3JjICE9PSBcIlwiKSkge1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiB0cmFjay5zcmMsXG5cdFx0XHRcdGRhdGFUeXBlOiAndGV4dCcsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkKSAge1xuXG5cdFx0XHRcdFx0Ly8gcGFyc2UgdGhlIGxvYWRlZCBmaWxlXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBkID09PSAnc3RyaW5nJyAmJiAoLzx0dFxccyt4bWwvaWcpLmV4ZWMoZCkpIHtcblx0XHRcdFx0XHRcdHRyYWNrLmVudHJpZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLmRmeHAucGFyc2UoZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyYWNrLmVudHJpZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLndlYnZ0dC5wYXJzZShkKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhZnRlcigpO1xuXG5cdFx0XHRcdFx0aWYgKHRyYWNrLmtpbmQgPT09ICdjaGFwdGVycycpIHtcblx0XHRcdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKHQubWVkaWEuZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5kaXNwbGF5Q2hhcHRlcnMoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0cmFjay5raW5kID09PSAnc2xpZGVzJykge1xuXHRcdFx0XHRcdFx0dC5zZXR1cFNsaWRlcyh0cmFjayk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKCkgIHtcblx0XHRcdFx0XHR0LnJlbW92ZVRyYWNrQnV0dG9uKHRyYWNrLnRyYWNrSWQpO1xuXHRcdFx0XHRcdHQubG9hZE5leHRUcmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFjayAtIFRoZSBsYW5ndWFnZSBjb2RlXG5cdCAqL1xuXHRlbmFibGVUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRsYW5nID0gdHJhY2suc3JjbGFuZyxcblx0XHRcdGxhYmVsID0gdHJhY2subGFiZWwsXG5cdFx0XHR0YXJnZXQgPSAkKGAjJHt0cmFjay50cmFja0lkfWApXG5cdFx0O1xuXG5cdFx0aWYgKGxhYmVsID09PSAnJykge1xuXHRcdFx0bGFiZWwgPSBpMThuLnQobWVqcy5sYW5ndWFnZS5jb2Rlc1tsYW5nXSkgfHwgbGFuZztcblx0XHR9XG5cblx0XHR0YXJnZXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcblx0XHQuc2libGluZ3MoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbGApLmh0bWwobGFiZWwpO1xuXG5cdFx0Ly8gYXV0byBzZWxlY3Rcblx0XHRpZiAodC5vcHRpb25zLnN0YXJ0TGFuZ3VhZ2UgPT09IGxhbmcpIHtcblx0XHRcdHRhcmdldC5wcm9wKCdjaGVja2VkJywgdHJ1ZSkudHJpZ2dlcignY2xpY2snKTtcblx0XHR9XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG5cdCAqL1xuXHRyZW1vdmVUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrSWQpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGBpbnB1dFtpZD0ke3RyYWNrSWR9XWApLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsYW5nIC0gVGhlIGxhbmd1YWdlIGNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsXG5cdCAqL1xuXHRhZGRUcmFja0J1dHRvbjogZnVuY3Rpb24gKHRyYWNrSWQsIGxhbmcsIGxhYmVsKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHRpZiAobGFiZWwgPT09ICcnKSB7XG5cdFx0XHRsYWJlbCA9IGkxOG4udChtZWpzLmxhbmd1YWdlLmNvZGVzW2xhbmddKSB8fCBsYW5nO1xuXHRcdH1cblxuXHRcdC8vIHRyYWNrSWQgaXMgdXNlZCBpbiB0aGUgdmFsdWUsIHRvbywgYmVjYXVzZSB0aGUgXCJub25lXCJcblx0XHQvLyBjYXB0aW9uIG9wdGlvbiBkb2Vzbid0IGhhdmUgYSB0cmFja0lkIGJ1dCB3ZSBuZWVkIHRvIGJlIGFibGVcblx0XHQvLyB0byBzZXQgaXQsIHRvb1xuXHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZCgndWwnKS5hcHBlbmQoXG5cdFx0XHQkKGA8bGkgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0LWl0ZW1cIj5gICtcblx0XHRcdFx0YDxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWlucHV0XCJgICtcblx0XHRcdFx0YG5hbWU9XCIke3QuaWR9X2NhcHRpb25zXCIgaWQ9XCIke3RyYWNrSWR9XCIgdmFsdWU9XCIke3RyYWNrSWR9XCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiIC8+YCArXG5cdFx0XHRcdGA8bGFiZWwgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbFwiPiR7bGFiZWx9IChsb2FkaW5nKTwvbGFiZWw+YCArXG5cdFx0XHRgPC9saT5gKVxuXHRcdCk7XG5cblx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cblx0XHQvLyByZW1vdmUgdGhpcyBmcm9tIHRoZSBkcm9wZG93bmxpc3QgKGlmIGl0IGV4aXN0cylcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdHJhbnNsYXRpb25zIG9wdGlvblt2YWx1ZT0ke2xhbmd9XWApLnJlbW92ZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0YWRqdXN0TGFuZ3VhZ2VCb3g6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdC8vIGFkanVzdCB0aGUgc2l6ZSBvZiB0aGUgb3V0ZXIgYm94XG5cdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3JgKS5oZWlnaHQoXG5cdFx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0YCkub3V0ZXJIZWlnaHQodHJ1ZSkgK1xuXHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdHJhbnNsYXRpb25zYCkub3V0ZXJIZWlnaHQodHJ1ZSlcblx0XHQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0Y2hlY2tGb3JUcmFja3M6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGhhc1N1YnRpdGxlcyA9IGZhbHNlXG5cdFx0O1xuXG5cdFx0Ly8gY2hlY2sgaWYgYW55IHN1YnRpdGxlc1xuXHRcdGlmICh0Lm9wdGlvbnMuaGlkZUNhcHRpb25zQnV0dG9uV2hlbkVtcHR5KSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0LnRyYWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBraW5kID0gdC50cmFja3NbaV0ua2luZDtcblx0XHRcdFx0aWYgKChraW5kID09PSAnc3VidGl0bGVzJyB8fCBraW5kID09PSAnY2FwdGlvbnMnKSAmJiB0LnRyYWNrc1tpXS5pc0xvYWRlZCkge1xuXHRcdFx0XHRcdGhhc1N1YnRpdGxlcyA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCFoYXNTdWJ0aXRsZXMpIHtcblx0XHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZGlzcGxheUNhcHRpb25zOiBmdW5jdGlvbiAoKSAge1xuXG5cdFx0aWYgKHRoaXMudHJhY2tzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dHJhY2sgPSB0LnNlbGVjdGVkVHJhY2ssXG5cdFx0XHRpXG5cdFx0O1xuXG5cdFx0aWYgKHRyYWNrICE9PSBudWxsICYmIHRyYWNrLmlzTG9hZGVkKSB7XG5cdFx0XHRpID0gdC5zZWFyY2hUcmFja1Bvc2l0aW9uKHRyYWNrLmVudHJpZXMsIHQubWVkaWEuY3VycmVudFRpbWUpO1xuXHRcdFx0aWYgKGkgPiAtMSkge1xuXHRcdFx0XHQvLyBTZXQgdGhlIGxpbmUgYmVmb3JlIHRoZSB0aW1lY29kZSBhcyBhIGNsYXNzIHNvIHRoZSBjdWUgY2FuIGJlIHRhcmdldGVkIGlmIG5lZWRlZFxuXHRcdFx0XHR0LmNhcHRpb25zVGV4dC5odG1sKHRyYWNrLmVudHJpZXNbaV0udGV4dClcblx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHQgJHsodHJhY2suZW50cmllc1tpXS5pZGVudGlmaWVyIHx8ICcnKX1gKTtcblx0XHRcdFx0dC5jYXB0aW9ucy5zaG93KCkuaGVpZ2h0KDApO1xuXHRcdFx0XHRyZXR1cm47IC8vIGV4aXQgb3V0IGlmIG9uZSBpcyB2aXNpYmxlO1xuXHRcdFx0fVxuXG5cdFx0XHR0LmNhcHRpb25zLmhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jYXB0aW9ucy5oaWRlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0cmFja1xuXHQgKi9cblx0c2V0dXBTbGlkZXM6IGZ1bmN0aW9uICh0cmFjaykgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LnNsaWRlcyA9IHRyYWNrO1xuXHRcdHQuc2xpZGVzLmVudHJpZXMuaW1ncyA9IFt0LnNsaWRlcy5lbnRyaWVzLmxlbmd0aF07XG5cdFx0dC5zaG93U2xpZGUoMCk7XG5cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG5cdCAqL1xuXHRzaG93U2xpZGU6IGZ1bmN0aW9uIChpbmRleCkgIHtcblx0XHRpZiAodGhpcy50cmFja3MgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnNsaWRlc0NvbnRhaW5lciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHVybCA9IHQuc2xpZGVzLmVudHJpZXNbaW5kZXhdLnRleHQsXG5cdFx0XHRpbWcgPSB0LnNsaWRlcy5lbnRyaWVzW2luZGV4XS5pbWdzXG5cdFx0O1xuXG5cdFx0aWYgKGltZyA9PT0gdW5kZWZpbmVkIHx8IGltZy5mYWRlSW4gPT09IHVuZGVmaW5lZCkge1xuXG5cdFx0XHR0LnNsaWRlcy5lbnRyaWVzW2luZGV4XS5pbWdzID0gaW1nID0gJChgPGltZyBzcmM9XCIke3VybH1cIj5gKVxuXHRcdFx0Lm9uKCdsb2FkJywgKCkgPT4ge1xuXHRcdFx0XHRpbWcuYXBwZW5kVG8odC5zbGlkZXNDb250YWluZXIpXG5cdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0LmZhZGVJbigpXG5cdFx0XHRcdC5zaWJsaW5ncygnOnZpc2libGUnKVxuXHRcdFx0XHQuZmFkZU91dCgpO1xuXG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmICghaW1nLmlzKCc6dmlzaWJsZScpICYmICFpbWcuaXMoJzphbmltYXRlZCcpKSB7XG5cdFx0XHRcdGltZy5mYWRlSW4oKVxuXHRcdFx0XHQuc2libGluZ3MoJzp2aXNpYmxlJylcblx0XHRcdFx0LmZhZGVPdXQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGRpc3BsYXlTbGlkZXM6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRpZiAodGhpcy5zbGlkZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRzbGlkZXMgPSB0LnNsaWRlcyxcblx0XHRcdGkgPSB0LnNlYXJjaFRyYWNrUG9zaXRpb24oc2xpZGVzLmVudHJpZXMsIHQubWVkaWEuY3VycmVudFRpbWUpXG5cdFx0O1xuXG5cdFx0aWYgKGkgPiAtMSkge1xuXHRcdFx0dC5zaG93U2xpZGUoaSk7XG5cdFx0XHRyZXR1cm47IC8vIGV4aXQgb3V0IGlmIG9uZSBpcyB2aXNpYmxlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGRpc3BsYXlDaGFwdGVyczogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0LnRyYWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRpZiAodC50cmFja3NbaV0ua2luZCA9PT0gJ2NoYXB0ZXJzJyAmJiB0LnRyYWNrc1tpXS5pc0xvYWRlZCkge1xuXHRcdFx0XHR0LmRyYXdDaGFwdGVycyh0LnRyYWNrc1tpXSk7XG5cdFx0XHRcdHQuaGFzQ2hhcHRlcnMgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjaGFwdGVyc1xuXHQgKi9cblx0ZHJhd0NoYXB0ZXJzOiBmdW5jdGlvbiAoY2hhcHRlcnMpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGksXG5cdFx0XHRkdXIsXG5cdFx0XHRwZXJjZW50ID0gMCxcblx0XHRcdHVzZWRQZXJjZW50ID0gMCxcblx0XHRcdHRvdGFsID0gY2hhcHRlcnMuZW50cmllcy5sZW5ndGhcblx0XHQ7XG5cblx0XHR0LmNoYXB0ZXJzLmVtcHR5KCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0ZHVyID0gY2hhcHRlcnMuZW50cmllc1tpXS5zdG9wIC0gY2hhcHRlcnMuZW50cmllc1tpXS5zdGFydDtcblx0XHRcdHBlcmNlbnQgPSBNYXRoLmZsb29yKGR1ciAvIHQubWVkaWEuZHVyYXRpb24gKiAxMDApO1xuXG5cdFx0XHQvLyB0b28gbGFyZ2Ugb3Igbm90IGdvaW5nIHRvIGZpbGwgaXQgaW5cblx0XHRcdGlmIChwZXJjZW50ICsgdXNlZFBlcmNlbnQgPiAxMDAgfHxcblx0XHRcdFx0aSA9PT0gY2hhcHRlcnMuZW50cmllcy5sZW5ndGggLSAxICYmIHBlcmNlbnQgKyB1c2VkUGVyY2VudCA8IDEwMCkge1xuXHRcdFx0XHRwZXJjZW50ID0gMTAwIC0gdXNlZFBlcmNlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHQuY2hhcHRlcnMuYXBwZW5kKCQoXG5cdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlclwiIHJlbD1cIiR7Y2hhcHRlcnMuZW50cmllc1tpXS5zdGFydH1cIiBzdHlsZT1cImxlZnQ6ICR7dXNlZFBlcmNlbnQudG9TdHJpbmcoKX0lOyB3aWR0aDogJHtwZXJjZW50LnRvU3RyaW5nKCl9JTtcIj5gICtcblx0XHRcdFx0IFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyLWJsb2NrYCArXG5cdFx0XHRcdCBcdGAkeyhpID09PSBjaGFwdGVycy5lbnRyaWVzLmxlbmd0aCAtIDEpID8gYCAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyLWJsb2NrLWxhc3RgIDogJyd9XCI+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCJjaC10aXRsZVwiPiR7Y2hhcHRlcnMuZW50cmllc1tpXS50ZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cImNoLXRpbWVcIj5gICtcblx0XHRcdFx0XHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUoY2hhcHRlcnMuZW50cmllc1tpXS5zdGFydCwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9YCArXG5cdFx0XHRcdCBcdFx0XHRgJm5kYXNoO2AgK1xuXHRcdFx0XHQgXHRcdFx0YCR7c2Vjb25kc1RvVGltZUNvZGUoY2hhcHRlcnMuZW50cmllc1tpXS5zdG9wLCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX1gICtcblx0XHRcdFx0XHRcdGA8L3NwYW4+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YCkpO1xuXHRcdFx0dXNlZFBlcmNlbnQgKz0gcGVyY2VudDtcblx0XHR9XG5cblx0XHR0LmNoYXB0ZXJzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyYCkuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHR0Lm1lZGlhLnNldEN1cnJlbnRUaW1lKHBhcnNlRmxvYXQoJCh0aGlzKS5hdHRyKCdyZWwnKSkpO1xuXHRcdFx0aWYgKHQubWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdHQubWVkaWEucGxheSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dC5jaGFwdGVycy5zaG93KCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBQZXJmb3JtIGJpbmFyeSBzZWFyY2ggdG8gbG9vayBmb3IgcHJvcGVyIHRyYWNrIGluZGV4XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IHRyYWNrc1xuXHQgKiBAcGFyYW0ge051bWJlcn0gY3VycmVudFRpbWVcblx0ICogQHJldHVybiB7TnVtYmVyfVxuXHQgKi9cblx0c2VhcmNoVHJhY2tQb3NpdGlvbjogZnVuY3Rpb24gKHRyYWNrcywgY3VycmVudFRpbWUpICB7XG5cdFx0bGV0XG5cdFx0XHRsbyA9IDAsXG5cdFx0XHRoaSA9IHRyYWNrcy5sZW5ndGggLSAxLFxuXHRcdFx0bWlkLFxuXHRcdFx0c3RhcnQsXG5cdFx0XHRzdG9wXG5cdFx0XHQ7XG5cblx0XHR3aGlsZSAobG8gPD0gaGkpIHtcblx0XHRcdG1pZCA9ICgobG8gKyBoaSkgPj4gMSk7XG5cdFx0XHRzdGFydCA9IHRyYWNrc1ttaWRdLnN0YXJ0O1xuXHRcdFx0c3RvcCA9IHRyYWNrc1ttaWRdLnN0b3A7XG5cblx0XHRcdGlmIChjdXJyZW50VGltZSA+PSBzdGFydCAmJiBjdXJyZW50VGltZSA8IHN0b3ApIHtcblx0XHRcdFx0cmV0dXJuIG1pZDtcblx0XHRcdH0gZWxzZSBpZiAoc3RhcnQgPCBjdXJyZW50VGltZSkge1xuXHRcdFx0XHRsbyA9IG1pZCArIDE7XG5cdFx0XHR9IGVsc2UgaWYgKHN0YXJ0ID4gY3VycmVudFRpbWUpIHtcblx0XHRcdFx0aGkgPSBtaWQgLSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAtMTtcblx0fVxufSk7XG5cbi8qKlxuICogTWFwIGFsbCBwb3NzaWJsZSBsYW5ndWFnZXMgd2l0aCB0aGVpciByZXNwZWN0aXZlIGNvZGVcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xubWVqcy5sYW5ndWFnZSA9IHtcblx0Y29kZXM6IHtcblx0XHRhZjogJ21lanMuYWZyaWthYW5zJyxcblx0XHRzcTogJ21lanMuYWxiYW5pYW4nLFxuXHRcdGFyOiAnbWVqcy5hcmFiaWMnLFxuXHRcdGJlOiAnbWVqcy5iZWxhcnVzaWFuJyxcblx0XHRiZzogJ21lanMuYnVsZ2FyaWFuJyxcblx0XHRjYTogJ21lanMuY2F0YWxhbicsXG5cdFx0emg6ICdtZWpzLmNoaW5lc2UnLFxuXHRcdCd6aC1jbic6ICdtZWpzLmNoaW5lc2Utc2ltcGxpZmllZCcsXG5cdFx0J3poLXR3JzogJ21lanMuY2hpbmVzLXRyYWRpdGlvbmFsJyxcblx0XHRocjogJ21lanMuY3JvYXRpYW4nLFxuXHRcdGNzOiAnbWVqcy5jemVjaCcsXG5cdFx0ZGE6ICdtZWpzLmRhbmlzaCcsXG5cdFx0bmw6ICdtZWpzLmR1dGNoJyxcblx0XHRlbjogJ21lanMuZW5nbGlzaCcsXG5cdFx0ZXQ6ICdtZWpzLmVzdG9uaWFuJyxcblx0XHRmbDogJ21lanMuZmlsaXBpbm8nLFxuXHRcdGZpOiAnbWVqcy5maW5uaXNoJyxcblx0XHRmcjogJ21lanMuZnJlbmNoJyxcblx0XHRnbDogJ21lanMuZ2FsaWNpYW4nLFxuXHRcdGRlOiAnbWVqcy5nZXJtYW4nLFxuXHRcdGVsOiAnbWVqcy5ncmVlaycsXG5cdFx0aHQ6ICdtZWpzLmhhaXRpYW4tY3Jlb2xlJyxcblx0XHRpdzogJ21lanMuaGVicmV3Jyxcblx0XHRoaTogJ21lanMuaGluZGknLFxuXHRcdGh1OiAnbWVqcy5odW5nYXJpYW4nLFxuXHRcdGlzOiAnbWVqcy5pY2VsYW5kaWMnLFxuXHRcdGlkOiAnbWVqcy5pbmRvbmVzaWFuJyxcblx0XHRnYTogJ21lanMuaXJpc2gnLFxuXHRcdGl0OiAnbWVqcy5pdGFsaWFuJyxcblx0XHRqYTogJ21lanMuamFwYW5lc2UnLFxuXHRcdGtvOiAnbWVqcy5rb3JlYW4nLFxuXHRcdGx2OiAnbWVqcy5sYXR2aWFuJyxcblx0XHRsdDogJ21lanMubGl0aHVhbmlhbicsXG5cdFx0bWs6ICdtZWpzLm1hY2Vkb25pYW4nLFxuXHRcdG1zOiAnbWVqcy5tYWxheScsXG5cdFx0bXQ6ICdtZWpzLm1hbHRlc2UnLFxuXHRcdG5vOiAnbWVqcy5ub3J3ZWdpYW4nLFxuXHRcdGZhOiAnbWVqcy5wZXJzaWFuJyxcblx0XHRwbDogJ21lanMucG9saXNoJyxcblx0XHRwdDogJ21lanMucG9ydHVndWVzZScsXG5cdFx0cm86ICdtZWpzLnJvbWFuaWFuJyxcblx0XHRydTogJ21lanMucnVzc2lhbicsXG5cdFx0c3I6ICdtZWpzLnNlcmJpYW4nLFxuXHRcdHNrOiAnbWVqcy5zbG92YWsnLFxuXHRcdHNsOiAnbWVqcy5zbG92ZW5pYW4nLFxuXHRcdGVzOiAnbWVqcy5zcGFuaXNoJyxcblx0XHRzdzogJ21lanMuc3dhaGlsaScsXG5cdFx0c3Y6ICdtZWpzLnN3ZWRpc2gnLFxuXHRcdHRsOiAnbWVqcy50YWdhbG9nJyxcblx0XHR0aDogJ21lanMudGhhaScsXG5cdFx0dHI6ICdtZWpzLnR1cmtpc2gnLFxuXHRcdHVrOiAnbWVqcy51a3JhaW5pYW4nLFxuXHRcdHZpOiAnbWVqcy52aWV0bmFtZXNlJyxcblx0XHRjeTogJ21lanMud2Vsc2gnLFxuXHRcdHlpOiAnbWVqcy55aWRkaXNoJ1xuXHR9XG59O1xuXG4vKlxuIFBhcnNlcyBXZWJWVFQgZm9ybWF0IHdoaWNoIHNob3VsZCBiZSBmb3JtYXR0ZWQgYXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIFdFQlZUVFxuXG4gMVxuIDAwOjAwOjAxLDEgLS0+IDAwOjAwOjA1LDAwMFxuIEEgbGluZSBvZiB0ZXh0XG5cbiAyXG4gMDA6MDE6MTUsMSAtLT4gMDA6MDI6MDUsMDAwXG4gQSBzZWNvbmQgbGluZSBvZiB0ZXh0XG5cbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiBBZGFwdGVkIGZyb206IGh0dHA6Ly93d3cuZGVscGhpa2kuY29tL2h0bWw1L3BsYXlyXG4gKi9cbm1lanMuVHJhY2tGb3JtYXRQYXJzZXIgPSB7XG5cdHdlYnZ0dDoge1xuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0cGF0dGVybl90aW1lY29kZTogL14oKD86WzAtOV17MSwyfTopP1swLTldezJ9OlswLTldezJ9KFssLl1bMC05XXsxLDN9KT8pIC0tXFw+ICgoPzpbMC05XXsxLDJ9Oik/WzAtOV17Mn06WzAtOV17Mn0oWywuXVswLTldezN9KT8pKC4qKSQvLFxuXG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tUZXh0XG5cdFx0ICogQHJldHVybnMge3t0ZXh0OiBBcnJheSwgdGltZXM6IEFycmF5fX1cblx0XHQgKi9cblx0XHRwYXJzZTogZnVuY3Rpb24gKHRyYWNrVGV4dCkgIHtcblx0XHRcdGxldFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bGluZXMgPSBtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLnNwbGl0Mih0cmFja1RleHQsIC9cXHI/XFxuLyksXG5cdFx0XHRcdGVudHJpZXMgPSBbXSxcblx0XHRcdFx0dGltZWNvZGUsXG5cdFx0XHRcdHRleHQsXG5cdFx0XHRcdGlkZW50aWZpZXI7XG5cdFx0XHRmb3IgKDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRpbWVjb2RlID0gdGhpcy5wYXR0ZXJuX3RpbWVjb2RlLmV4ZWMobGluZXNbaV0pO1xuXG5cdFx0XHRcdGlmICh0aW1lY29kZSAmJiBpIDwgbGluZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKChpIC0gMSkgPj0gMCAmJiBsaW5lc1tpIC0gMV0gIT09ICcnKSB7XG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyID0gbGluZXNbaSAtIDFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0Ly8gZ3JhYiBhbGwgdGhlIChwb3NzaWJseSBtdWx0aS1saW5lKSB0ZXh0IHRoYXQgZm9sbG93c1xuXHRcdFx0XHRcdHRleHQgPSBsaW5lc1tpXTtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0d2hpbGUgKGxpbmVzW2ldICE9PSAnJyAmJiBpIDwgbGluZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0ZXh0ID0gYCR7dGV4dH1cXG4ke2xpbmVzW2ldfWA7XG5cdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRleHQgPSAkLnRyaW0odGV4dCkucmVwbGFjZSgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnLCBcIjxhIGhyZWY9JyQxJyB0YXJnZXQ9J19ibGFuayc+JDE8L2E+XCIpO1xuXHRcdFx0XHRcdGVudHJpZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuXHRcdFx0XHRcdFx0c3RhcnQ6IChjb252ZXJ0U01QVEV0b1NlY29uZHModGltZWNvZGVbMV0pID09PSAwKSA/IDAuMjAwIDogY29udmVydFNNUFRFdG9TZWNvbmRzKHRpbWVjb2RlWzFdKSxcblx0XHRcdFx0XHRcdHN0b3A6IGNvbnZlcnRTTVBURXRvU2Vjb25kcyh0aW1lY29kZVszXSksXG5cdFx0XHRcdFx0XHR0ZXh0OiB0ZXh0LFxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IHRpbWVjb2RlWzVdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWRlbnRpZmllciA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGVudHJpZXM7XG5cdFx0fVxuXHR9LFxuXHQvLyBUaGFua3MgdG8gSnVzdGluIENhcGVsbGE6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb2huZHllci9tZWRpYWVsZW1lbnQvcHVsbC80MjBcblx0ZGZ4cDoge1xuXHRcdC8qKlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrVGV4dFxuXHRcdCAqIEByZXR1cm5zIHt7dGV4dDogQXJyYXksIHRpbWVzOiBBcnJheX19XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICh0cmFja1RleHQpICB7XG5cdFx0XHR0cmFja1RleHQgPSAkKHRyYWNrVGV4dCkuZmlsdGVyKCd0dCcpO1xuXHRcdFx0bGV0XG5cdFx0XHRcdGNvbnRhaW5lciA9IHRyYWNrVGV4dC5jaGlsZHJlbignZGl2JykuZXEoMCksXG5cdFx0XHRcdGxpbmVzID0gY29udGFpbmVyLmZpbmQoJ3AnKSxcblx0XHRcdFx0c3R5bGVOb2RlID0gdHJhY2tUZXh0LmZpbmQoYCMke2NvbnRhaW5lci5hdHRyKCdzdHlsZScpfWApLFxuXHRcdFx0XHRzdHlsZXMsXG5cdFx0XHRcdGVudHJpZXMgPSBbXSxcblx0XHRcdFx0aVxuXHRcdFx0O1xuXG5cblx0XHRcdGlmIChzdHlsZU5vZGUubGVuZ3RoKSB7XG5cdFx0XHRcdGxldCBhdHRyaWJ1dGVzID0gc3R5bGVOb2RlLnJlbW92ZUF0dHIoJ2lkJykuZ2V0KDApLmF0dHJpYnV0ZXM7XG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHN0eWxlcyA9IHt9O1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRzdHlsZXNbYXR0cmlidXRlc1tpXS5uYW1lLnNwbGl0KFwiOlwiKVsxXV0gPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0c3R5bGUsXG5cdFx0XHRcdFx0X3RlbXAgPSB7XG5cdFx0XHRcdFx0XHRzdGFydDogbnVsbCxcblx0XHRcdFx0XHRcdHN0b3A6IG51bGwsXG5cdFx0XHRcdFx0XHRzdHlsZTogbnVsbCxcblx0XHRcdFx0XHRcdHRleHQ6IG51bGxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDtcblxuXHRcdFx0XHRpZiAobGluZXMuZXEoaSkuYXR0cignYmVnaW4nKSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0YXJ0ID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkpLmF0dHIoJ2JlZ2luJykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3RlbXAuc3RhcnQgJiYgbGluZXMuZXEoaSAtIDEpLmF0dHIoJ2VuZCcpKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RhcnQgPSBjb252ZXJ0U01QVEV0b1NlY29uZHMobGluZXMuZXEoaSAtIDEpLmF0dHIoJ2VuZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGluZXMuZXEoaSkuYXR0cignZW5kJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdG9wID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkpLmF0dHIoJ2VuZCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90ZW1wLnN0b3AgJiYgbGluZXMuZXEoaSArIDEpLmF0dHIoJ2JlZ2luJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdG9wID0gY29udmVydFNNUFRFdG9TZWNvbmRzKGxpbmVzLmVxKGkgKyAxKS5hdHRyKCdiZWdpbicpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzdHlsZXMpIHtcblx0XHRcdFx0XHRzdHlsZSA9ICcnO1xuXHRcdFx0XHRcdGZvciAobGV0IF9zdHlsZSBpbiBzdHlsZXMpIHtcblx0XHRcdFx0XHRcdHN0eWxlICs9IGAke19zdHlsZX06JHtzdHlsZXNbX3N0eWxlXX07YDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN0eWxlKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3R5bGUgPSBzdHlsZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX3RlbXAuc3RhcnQgPT09IDApIHtcblx0XHRcdFx0XHRfdGVtcC5zdGFydCA9IDAuMjAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF90ZW1wLnRleHQgPSAkLnRyaW0obGluZXMuZXEoaSkuaHRtbCgpKS5yZXBsYWNlKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWcsIFwiPGEgaHJlZj0nJDEnIHRhcmdldD0nX2JsYW5rJz4kMTwvYT5cIik7XG5cdFx0XHRcdGVudHJpZXMucHVzaChfdGVtcCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZW50cmllcztcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcmVnZXhcblx0ICogQHJldHVybnMge0FycmF5fVxuXHQgKi9cblx0c3BsaXQyOiBmdW5jdGlvbiAodGV4dCwgcmVnZXgpICB7XG5cdFx0Ly8gbm9ybWFsIHZlcnNpb24gZm9yIGNvbXBsaWFudCBicm93c2Vyc1xuXHRcdC8vIHNlZSBiZWxvdyBmb3IgSUUgZml4XG5cdFx0cmV0dXJuIHRleHQuc3BsaXQocmVnZXgpO1xuXHR9XG59O1xuXG4vLyB0ZXN0IGZvciBicm93c2VycyB3aXRoIGJhZCBTdHJpbmcuc3BsaXQgbWV0aG9kLlxuaWYgKCd4XFxuXFxueScuc3BsaXQoL1xcbi9naSkubGVuZ3RoICE9PSAzKSB7XG5cdC8vIGFkZCBzdXBlciBzbG93IElFOCBhbmQgYmVsb3cgdmVyc2lvblxuXHRtZWpzLlRyYWNrRm9ybWF0UGFyc2VyLnNwbGl0MiA9ICh0ZXh0LCByZWdleCkgPT4ge1xuXHRcdGxldFxuXHRcdFx0cGFydHMgPSBbXSxcblx0XHRcdGNodW5rID0gJycsXG5cdFx0XHRpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNodW5rICs9IHRleHQuc3Vic3RyaW5nKGksIGkgKyAxKTtcblx0XHRcdGlmIChyZWdleC50ZXN0KGNodW5rKSkge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGNodW5rLnJlcGxhY2UocmVnZXgsICcnKSk7XG5cdFx0XHRcdGNodW5rID0gJyc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHBhcnRzLnB1c2goY2h1bmspO1xuXHRcdHJldHVybiBwYXJ0cztcblx0fTtcbn1cblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7SVNfQU5EUk9JRCwgSVNfSU9TfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuXG4vKipcbiAqIFZvbHVtZSBidXR0b25cbiAqXG4gKiBUaGlzIGZlYXR1cmUgZW5hYmxlcyB0aGUgZGlzcGxheWluZyBvZiBhIFZvbHVtZSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyLCBhbmQgYWxzbyBjb250YWlucyBsb2dpYyB0byBtYW5pcHVsYXRlIGl0c1xuICogZXZlbnRzLCBzdWNoIGFzIHNsaWRpbmcgdXAvZG93biAob3IgbGVmdC9yaWdodCwgaWYgdmVydGljYWwpLCBtdXRpbmcvdW5tdXRpbmcgbWVkaWEsIGV0Yy5cbiAqL1xuXG5cbi8vIEZlYXR1cmUgY29uZmlndXJhdGlvblxuT2JqZWN0LmFzc2lnbihjb25maWcsIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRtdXRlVGV4dDogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0YWxseVZvbHVtZUNvbnRyb2xUZXh0OiAnJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aGlkZVZvbHVtZU9uVG91Y2hEZXZpY2VzOiB0cnVlLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGF1ZGlvVm9sdW1lOiAnaG9yaXpvbnRhbCcsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dmlkZW9Wb2x1bWU6ICd2ZXJ0aWNhbCdcbn0pO1xuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogRmVhdHVyZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBidWlsZGAgYW5kIHRoZSBuYW1lIHRoYXQgd2lsbCBiZSB1c2VkIGluIE1lcERlZmF1bHRzLmZlYXR1cmVzIGxpc3Rcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnRQbGF5ZXJ9IHBsYXllclxuXHQgKiBAcGFyYW0geyR9IGNvbnRyb2xzXG5cdCAqIEBwYXJhbSB7JH0gbGF5ZXJzXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1lZGlhXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdGJ1aWxkdm9sdW1lOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblxuXHRcdC8vIEFuZHJvaWQgYW5kIGlPUyBkb24ndCBzdXBwb3J0IHZvbHVtZSBjb250cm9sc1xuXHRcdGlmICgoSVNfQU5EUk9JRCB8fCBJU19JT1MpICYmIHRoaXMub3B0aW9ucy5oaWRlVm9sdW1lT25Ub3VjaERldmljZXMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bW9kZSA9ICh0LmlzVmlkZW8pID8gdC5vcHRpb25zLnZpZGVvVm9sdW1lIDogdC5vcHRpb25zLmF1ZGlvVm9sdW1lLFxuXHRcdFx0bXV0ZVRleHQgPSB0Lm9wdGlvbnMubXV0ZVRleHQgPyB0Lm9wdGlvbnMubXV0ZVRleHQgOiBpMThuLnQoJ21lanMubXV0ZS10b2dnbGUnKSxcblx0XHRcdHZvbHVtZUNvbnRyb2xUZXh0ID0gdC5vcHRpb25zLmFsbHlWb2x1bWVDb250cm9sVGV4dCA/IHQub3B0aW9ucy5hbGx5Vm9sdW1lQ29udHJvbFRleHQgOiBpMThuLnQoJ21lanMudm9sdW1lLWhlbHAtdGV4dCcpLFxuXHRcdFx0bXV0ZSA9IChtb2RlID09PSAnaG9yaXpvbnRhbCcpID9cblxuXHRcdFx0XHQvLyBob3Jpem9udGFsIHZlcnNpb25cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7bXV0ZVRleHR9XCIgYXJpYS1sYWJlbD1cIiR7bXV0ZVRleHR9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1zbGlkZXJcIj5gICtcblx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj4ke3ZvbHVtZUNvbnRyb2xUZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLXRvdGFsXCI+YCArXG5cdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLWN1cnJlbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtaGFuZGxlXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9hPmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scykgOlxuXG5cdFx0XHRcdC8vIHZlcnRpY2FsIHZlcnNpb25cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtYnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVcIj5gICtcblx0XHRcdFx0XHRgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1jb250cm9scz1cIiR7dC5pZH1cIiB0aXRsZT1cIiR7bXV0ZVRleHR9XCIgYXJpYS1sYWJlbD1cIiR7bXV0ZVRleHR9XCI+PC9idXR0b24+YCArXG5cdFx0XHRcdFx0YDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyXCI+YCArXG5cdFx0XHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj4ke3ZvbHVtZUNvbnRyb2xUZXh0fTwvc3Bhbj5gICtcblx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXRvdGFsXCI+YCArXG5cdFx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWN1cnJlbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtaGFuZGxlXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvYT5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scyksXG5cdFx0XHR2b2x1bWVTbGlkZXIgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlciwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1zbGlkZXJgKSxcblx0XHRcdHZvbHVtZVRvdGFsID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS10b3RhbCwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS10b3RhbGApLFxuXHRcdFx0dm9sdW1lQ3VycmVudCA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtY3VycmVudCwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1jdXJyZW50YCksXG5cdFx0XHR2b2x1bWVIYW5kbGUgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLWhhbmRsZSwgXG5cdFx0XHRcdC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1oYW5kbGVgKSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHZvbHVtZVxuXHRcdFx0ICovXG5cdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSA9ICh2b2x1bWUpID0+IHtcblxuXHRcdFx0XHQvLyBjb3JyZWN0IHRvIDAtMVxuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1heCgwLCB2b2x1bWUpO1xuXHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1pbih2b2x1bWUsIDEpO1xuXG5cdFx0XHRcdC8vIGFkanVzdCBtdXRlIGJ1dHRvbiBzdHlsZVxuXHRcdFx0XHRpZiAodm9sdW1lID09PSAwKSB7XG5cdFx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKTtcblx0XHRcdFx0XHRtdXRlLmNoaWxkcmVuKCdidXR0b24nKS5hdHRyKHtcblx0XHRcdFx0XHRcdHRpdGxlOiBpMThuLnQoJ21lanMudW5tdXRlJyksXG5cdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IGkxOG4udCgnbWVqcy51bm11dGUnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCk7XG5cdFx0XHRcdFx0bXV0ZS5jaGlsZHJlbignYnV0dG9uJykuYXR0cih7XG5cdFx0XHRcdFx0XHR0aXRsZTogaTE4bi50KCdtZWpzLm11dGUnKSxcblx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogaTE4bi50KCdtZWpzLm11dGUnKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHZvbHVtZVBlcmNlbnRhZ2UgPSBgJHsodm9sdW1lICogMTAwKX0lYDtcblxuXHRcdFx0XHQvLyBwb3NpdGlvbiBzbGlkZXJcblx0XHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0XHR2b2x1bWVDdXJyZW50LmNzcyh7XG5cdFx0XHRcdFx0XHRib3R0b206ICcwJyxcblx0XHRcdFx0XHRcdGhlaWdodDogdm9sdW1lUGVyY2VudGFnZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZvbHVtZUhhbmRsZS5jc3Moe1xuXHRcdFx0XHRcdFx0Ym90dG9tOiB2b2x1bWVQZXJjZW50YWdlLFxuXHRcdFx0XHRcdFx0bWFyZ2luQm90dG9tOiBgJHsoLXZvbHVtZUhhbmRsZS5oZWlnaHQoKSAvIDIpfXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZvbHVtZUN1cnJlbnQuY3NzKHtcblx0XHRcdFx0XHRcdGxlZnQ6ICcwJyxcblx0XHRcdFx0XHRcdHdpZHRoOiB2b2x1bWVQZXJjZW50YWdlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm9sdW1lSGFuZGxlLmNzcyh7XG5cdFx0XHRcdFx0XHRsZWZ0OiB2b2x1bWVQZXJjZW50YWdlLFxuXHRcdFx0XHRcdFx0bWFyZ2luTGVmdDogYCR7KC12b2x1bWVIYW5kbGUud2lkdGgoKSAvIDIpfXB4YFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRoYW5kbGVWb2x1bWVNb3ZlID0gKGUpID0+IHtcblxuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHR2b2x1bWUgPSBudWxsLFxuXHRcdFx0XHRcdHRvdGFsT2Zmc2V0ID0gdm9sdW1lVG90YWwub2Zmc2V0KClcblx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vIGNhbGN1bGF0ZSB0aGUgbmV3IHZvbHVtZSBiYXNlZCBvbiB0aGUgbW9zdCByZWNlbnQgcG9zaXRpb25cblx0XHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblxuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0cmFpbEhlaWdodCA9IHZvbHVtZVRvdGFsLmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0bmV3WSA9IGUucGFnZVkgLSB0b3RhbE9mZnNldC50b3Bcblx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHR2b2x1bWUgPSAocmFpbEhlaWdodCAtIG5ld1kpIC8gcmFpbEhlaWdodDtcblxuXHRcdFx0XHRcdC8vIHRoZSBjb250cm9scyBqdXN0IGhpZGUgdGhlbXNlbHZlcyAodXN1YWxseSB3aGVuIG1vdXNlIG1vdmVzIHRvbyBmYXIgdXApXG5cdFx0XHRcdFx0aWYgKHRvdGFsT2Zmc2V0LnRvcCA9PT0gMCB8fCB0b3RhbE9mZnNldC5sZWZ0ID09PSAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRyYWlsV2lkdGggPSB2b2x1bWVUb3RhbC53aWR0aCgpLFxuXHRcdFx0XHRcdFx0bmV3WCA9IGUucGFnZVggLSB0b3RhbE9mZnNldC5sZWZ0XG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0dm9sdW1lID0gbmV3WCAvIHJhaWxXaWR0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVuc3VyZSB0aGUgdm9sdW1lIGlzbid0IG91dHNpZGUgMC0xXG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWF4KDAsIHZvbHVtZSk7XG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWluKHZvbHVtZSwgMSk7XG5cblx0XHRcdFx0Ly8gcG9zaXRpb24gdGhlIHNsaWRlciBhbmQgaGFuZGxlXG5cdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKHZvbHVtZSk7XG5cblx0XHRcdFx0Ly8gc2V0IHRoZSBtZWRpYSBvYmplY3QgKHRoaXMgd2lsbCB0cmlnZ2VyIHRoZSBgdm9sdW1lY2hhbmdlZGAgZXZlbnQpXG5cdFx0XHRcdGlmICh2b2x1bWUgPT09IDApIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHZvbHVtZSk7XG5cdFx0XHR9LFxuXHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZSxcblx0XHRcdG1vdXNlSXNPdmVyID0gZmFsc2U7XG5cblx0XHQvLyBTTElERVJcblx0XHRtdXRlXG5cdFx0XHQub24oJ21vdXNlZW50ZXIgZm9jdXNpbicsICgpID0+IHtcblx0XHRcdFx0dm9sdW1lU2xpZGVyLnNob3coKTtcblx0XHRcdFx0bW91c2VJc092ZXIgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHRcdC5vbignbW91c2VsZWF2ZSBmb2N1c291dCcsICgpID0+IHtcblx0XHRcdFx0bW91c2VJc092ZXIgPSBmYWxzZTtcblxuXHRcdFx0XHRpZiAoIW1vdXNlSXNEb3duICYmIG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0XHR2b2x1bWVTbGlkZXIuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0bGV0IHVwZGF0ZVZvbHVtZVNsaWRlciA9ICgpID0+IHtcblxuXHRcdFx0bGV0IHZvbHVtZSA9IE1hdGguZmxvb3IobWVkaWEudm9sdW1lICogMTAwKTtcblxuXHRcdFx0dm9sdW1lU2xpZGVyLmF0dHIoe1xuXHRcdFx0XHQnYXJpYS1sYWJlbCc6IGkxOG4udCgnbWVqcy52b2x1bWUtc2xpZGVyJyksXG5cdFx0XHRcdCdhcmlhLXZhbHVlbWluJzogMCxcblx0XHRcdFx0J2FyaWEtdmFsdWVtYXgnOiAxMDAsXG5cdFx0XHRcdCdhcmlhLXZhbHVlbm93Jzogdm9sdW1lLFxuXHRcdFx0XHQnYXJpYS12YWx1ZXRleHQnOiBgJHt2b2x1bWV9JWAsXG5cdFx0XHRcdCdyb2xlJzogJ3NsaWRlcicsXG5cdFx0XHRcdCd0YWJpbmRleCc6IC0xXG5cdFx0XHR9KTtcblxuXHRcdH07XG5cblx0XHQvLyBFdmVudHNcblx0XHR2b2x1bWVTbGlkZXJcblx0XHRcdC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0XHRoYW5kbGVWb2x1bWVNb3ZlKGUpO1xuXHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNlbW92ZS52b2wnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGhhbmRsZVZvbHVtZU1vdmUoZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0Lmdsb2JhbEJpbmQoJ21vdXNldXAudm9sJywgKCkgPT4ge1xuXHRcdFx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2U7XG5cdFx0XHRcdFx0dC5nbG9iYWxVbmJpbmQoJ21vdXNlbW92ZS52b2wgbW91c2V1cC52b2wnKTtcblxuXHRcdFx0XHRcdGlmICghbW91c2VJc092ZXIgJiYgbW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHRcdFx0dm9sdW1lU2xpZGVyLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtb3VzZUlzRG93biA9IHRydWU7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSlcblx0XHRcdC5vbigna2V5ZG93bicsIChlKSA9PiB7XG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5rZXlBY3Rpb25zLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0a2V5Q29kZSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlIHx8IDAsXG5cdFx0XHRcdFx0XHR2b2x1bWUgPSBtZWRpYS52b2x1bWVcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0c3dpdGNoIChrZXlDb2RlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDM4OiAvLyBVcFxuXHRcdFx0XHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1pbih2b2x1bWUgKyAwLjEsIDEpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNDA6IC8vIERvd25cblx0XHRcdFx0XHRcdFx0dm9sdW1lID0gTWF0aC5tYXgoMCwgdm9sdW1lIC0gMC4xKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKHZvbHVtZSk7XG5cdFx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHZvbHVtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdC8vIE1VVEUgYnV0dG9uXG5cdFx0bXV0ZS5maW5kKCdidXR0b24nKS5jbGljaygoKSA9PiB7XG5cdFx0XHRtZWRpYS5zZXRNdXRlZCghbWVkaWEubXV0ZWQpO1xuXHRcdH0pO1xuXG5cdFx0Ly9LZXlib2FyZCBpbnB1dFxuXHRcdG11dGUuZmluZCgnYnV0dG9uJykub24oJ2ZvY3VzJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0dm9sdW1lU2xpZGVyLnNob3coKTtcblx0XHRcdH1cblx0XHR9KS5vbignYmx1cicsICgpID0+IHtcblx0XHRcdGlmIChtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdHZvbHVtZVNsaWRlci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBsaXN0ZW4gZm9yIHZvbHVtZSBjaGFuZ2UgZXZlbnRzIGZyb20gb3RoZXIgc291cmNlc1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3ZvbHVtZWNoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRpZiAoIW1vdXNlSXNEb3duKSB7XG5cdFx0XHRcdGlmIChtZWRpYS5tdXRlZCkge1xuXHRcdFx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlKDApO1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUobWVkaWEudm9sdW1lKTtcblx0XHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR1cGRhdGVWb2x1bWVTbGlkZXIoZSk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0Ly8gbXV0ZXMgdGhlIG1lZGlhIGFuZCBzZXRzIHRoZSB2b2x1bWUgaWNvbiBtdXRlZCBpZiB0aGUgaW5pdGlhbCB2b2x1bWUgaXMgc2V0IHRvIDBcblx0XHRpZiAocGxheWVyLm9wdGlvbnMuc3RhcnRWb2x1bWUgPT09IDApIHtcblx0XHRcdG1lZGlhLnNldE11dGVkKHRydWUpO1xuXHRcdH1cblxuXHRcdC8vIHNoaW0gZ2V0cyB0aGUgc3RhcnR2b2x1bWUgYXMgYSBwYXJhbWV0ZXIsIGJ1dCB3ZSBoYXZlIHRvIHNldCBpdCBvbiB0aGUgbmF0aXZlIDx2aWRlbz4gYW5kIDxhdWRpbz4gZWxlbWVudHNcblx0XHRsZXQgaXNOYXRpdmUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbDtcblxuXHRcdGlmIChpc05hdGl2ZSkge1xuXHRcdFx0bWVkaWEuc2V0Vm9sdW1lKHBsYXllci5vcHRpb25zLnN0YXJ0Vm9sdW1lKTtcblx0XHR9XG5cblx0XHR0LmNvbnRhaW5lci5vbignY29udHJvbHNyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEubXV0ZWQpIHtcblx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUoMCk7XG5cdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUobWVkaWEudm9sdW1lKTtcblx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLyohXG4gKiBUaGlzIGlzIGEgYGkxOG5gIGxhbmd1YWdlIG9iamVjdC5cbiAqXG4gKiBFbmdsaXNoOyBUaGlzIGNhbiBzZXJ2ZSBhcyBhIHRlbXBsYXRlIGZvciBvdGhlciBsYW5ndWFnZXMgdG8gdHJhbnNsYXRlXG4gKlxuICogQGF1dGhvclxuICogICBUQkRcbiAqICAgU2FzY2hhIEdyZXVlbCAoVHdpdHRlcjogQFNvZnRDcmVhdFIpXG4gKlxuICogQHNlZSBjb3JlL2kxOG4uanNcbiAqL1xuZXhwb3J0IGNvbnN0IEVOID0ge1xuXHRcIm1lanMucGx1cmFsLWZvcm1cIjogMSxcblxuXHQvLyByZW5kZXJlcnMvZmxhc2guanNcblx0XCJtZWpzLmluc3RhbGwtZmxhc2hcIjogXCJZb3UgYXJlIHVzaW5nIGEgYnJvd3NlciB0aGF0IGRvZXMgbm90IGhhdmUgRmxhc2ggcGxheWVyIGVuYWJsZWQgb3IgaW5zdGFsbGVkLiBQbGVhc2UgdHVybiBvbiB5b3VyIEZsYXNoIHBsYXllciBwbHVnaW4gb3IgZG93bmxvYWQgdGhlIGxhdGVzdCB2ZXJzaW9uIGZyb20gaHR0cHM6Ly9nZXQuYWRvYmUuY29tL2ZsYXNocGxheWVyL1wiLFxuXG5cdC8vIGZlYXR1cmVzL2NvbnRleHRtZW51LmpzXG5cdFwibWVqcy5mdWxsc2NyZWVuLW9mZlwiOiBcIlR1cm4gb2ZmIEZ1bGxzY3JlZW5cIixcblx0XCJtZWpzLmZ1bGxzY3JlZW4tb25cIjogXCJHbyBGdWxsc2NyZWVuXCIsXG5cdFwibWVqcy5kb3dubG9hZC12aWRlb1wiOiBcIkRvd25sb2FkIFZpZGVvXCIsXG5cblx0Ly8gZmVhdHVyZXMvZnVsbHNjcmVlbi5qc1xuXHRcIm1lanMuZnVsbHNjcmVlblwiOiBcIkZ1bGxzY3JlZW5cIixcblxuXHQvLyBmZWF0dXJlcy9qdW1wZm9yd2FyZC5qc1xuXHRcIm1lanMudGltZS1qdW1wLWZvcndhcmRcIjogW1wiSnVtcCBmb3J3YXJkIDEgc2Vjb25kXCIsIFwiSnVtcCBmb3J3YXJkICUxIHNlY29uZHNcIl0sXG5cblx0Ly8gZmVhdHVyZXMvbG9vcC5qc1xuXHRcIm1lanMubG9vcFwiOiBcIlRvZ2dsZSBMb29wXCIsXG5cblx0Ly8gZmVhdHVyZXMvcGxheXBhdXNlLmpzXG5cdFwibWVqcy5wbGF5XCI6IFwiUGxheVwiLFxuXHRcIm1lanMucGF1c2VcIjogXCJQYXVzZVwiLFxuXG5cdC8vIGZlYXR1cmVzL3Bvc3Ryb2xsLmpzXG5cdFwibWVqcy5jbG9zZVwiOiBcIkNsb3NlXCIsXG5cblx0Ly8gZmVhdHVyZXMvcHJvZ3Jlc3MuanNcblx0XCJtZWpzLnRpbWUtc2xpZGVyXCI6IFwiVGltZSBTbGlkZXJcIixcblx0XCJtZWpzLnRpbWUtaGVscC10ZXh0XCI6IFwiVXNlIExlZnQvUmlnaHQgQXJyb3cga2V5cyB0byBhZHZhbmNlIG9uZSBzZWNvbmQsIFVwL0Rvd24gYXJyb3dzIHRvIGFkdmFuY2UgdGVuIHNlY29uZHMuXCIsXG5cblx0Ly8gZmVhdHVyZXMvc2tpcGJhY2suanNcblx0XCJtZWpzLnRpbWUtc2tpcC1iYWNrXCI6IFtcIlNraXAgYmFjayAxIHNlY29uZFwiLCBcIlNraXAgYmFjayAlMSBzZWNvbmRzXCJdLFxuXG5cdC8vIGZlYXR1cmVzL3RyYWNrcy5qc1xuXHRcIm1lanMuY2FwdGlvbnMtc3VidGl0bGVzXCI6IFwiQ2FwdGlvbnMvU3VidGl0bGVzXCIsXG5cdFwibWVqcy5ub25lXCI6IFwiTm9uZVwiLFxuXG5cdC8vIGZlYXR1cmVzL3ZvbHVtZS5qc1xuXHRcIm1lanMubXV0ZS10b2dnbGVcIjogXCJNdXRlIFRvZ2dsZVwiLFxuXHRcIm1lanMudm9sdW1lLWhlbHAtdGV4dFwiOiBcIlVzZSBVcC9Eb3duIEFycm93IGtleXMgdG8gaW5jcmVhc2Ugb3IgZGVjcmVhc2Ugdm9sdW1lLlwiLFxuXHRcIm1lanMudW5tdXRlXCI6IFwiVW5tdXRlXCIsXG5cdFwibWVqcy5tdXRlXCI6IFwiTXV0ZVwiLFxuXHRcIm1lanMudm9sdW1lLXNsaWRlclwiOiBcIlZvbHVtZSBTbGlkZXJcIixcblxuXHQvLyBjb3JlL3BsYXllci5qc1xuXHRcIm1lanMudmlkZW8tcGxheWVyXCI6IFwiVmlkZW8gUGxheWVyXCIsXG5cdFwibWVqcy5hdWRpby1wbGF5ZXJcIjogXCJBdWRpbyBQbGF5ZXJcIixcblxuXHQvLyBmZWF0dXJlcy9hZHMuanNcblx0XCJtZWpzLmFkLXNraXBcIjogXCJTa2lwIGFkXCIsXG5cdFwibWVqcy5hZC1za2lwLWluZm9cIjogW1wiU2tpcCBpbiAxIHNlY29uZFwiLCBcIlNraXAgaW4gJTEgc2Vjb25kc1wiXSxcblxuXHQvLyBmZWF0dXJlcy9zb3VyY2VjaG9vc2VyLmpzXG5cdFwibWVqcy5zb3VyY2UtY2hvb3NlclwiOiBcIlNvdXJjZSBDaG9vc2VyXCIsXG5cblx0Ly8gZmVhdHVyZXMvc3RvcC5qc1xuXHRcIm1lanMuc3RvcFwiOiBcIlN0b3BcIixcblxuXHQvL2ZlYXR1cmVzL3NwZWVkLmpzXG5cdFwibWVqcy5zcGVlZC1yYXRlXCIgOiBcIlNwZWVkIFJhdGVcIixcblxuXHQvL2ZlYXR1cmVzL3Byb2dyZXNzLmpzXG5cdFwibWVqcy5saXZlLWJyb2FkY2FzdFwiIDogXCJMaXZlIEJyb2FkY2FzdFwiLFxuXG5cdC8vIGZlYXR1cmVzL3RyYWNrcy5qc1xuXHRcIm1lanMuYWZyaWthYW5zXCI6IFwiQWZyaWthYW5zXCIsXG5cdFwibWVqcy5hbGJhbmlhblwiOiBcIkFsYmFuaWFuXCIsXG5cdFwibWVqcy5hcmFiaWNcIjogXCJBcmFiaWNcIixcblx0XCJtZWpzLmJlbGFydXNpYW5cIjogXCJCZWxhcnVzaWFuXCIsXG5cdFwibWVqcy5idWxnYXJpYW5cIjogXCJCdWxnYXJpYW5cIixcblx0XCJtZWpzLmNhdGFsYW5cIjogXCJDYXRhbGFuXCIsXG5cdFwibWVqcy5jaGluZXNlXCI6IFwiQ2hpbmVzZVwiLFxuXHRcIm1lanMuY2hpbmVzZS1zaW1wbGlmaWVkXCI6IFwiQ2hpbmVzZSAoU2ltcGxpZmllZClcIixcblx0XCJtZWpzLmNoaW5lc2UtdHJhZGl0aW9uYWxcIjogXCJDaGluZXNlIChUcmFkaXRpb25hbClcIixcblx0XCJtZWpzLmNyb2F0aWFuXCI6IFwiQ3JvYXRpYW5cIixcblx0XCJtZWpzLmN6ZWNoXCI6IFwiQ3plY2hcIixcblx0XCJtZWpzLmRhbmlzaFwiOiBcIkRhbmlzaFwiLFxuXHRcIm1lanMuZHV0Y2hcIjogXCJEdXRjaFwiLFxuXHRcIm1lanMuZW5nbGlzaFwiOiBcIkVuZ2xpc2hcIixcblx0XCJtZWpzLmVzdG9uaWFuXCI6IFwiRXN0b25pYW5cIixcblx0XCJtZWpzLmZpbGlwaW5vXCI6IFwiRmlsaXBpbm9cIixcblx0XCJtZWpzLmZpbm5pc2hcIjogXCJGaW5uaXNoXCIsXG5cdFwibWVqcy5mcmVuY2hcIjogXCJGcmVuY2hcIixcblx0XCJtZWpzLmdhbGljaWFuXCI6IFwiR2FsaWNpYW5cIixcblx0XCJtZWpzLmdlcm1hblwiOiBcIkdlcm1hblwiLFxuXHRcIm1lanMuZ3JlZWtcIjogXCJHcmVla1wiLFxuXHRcIm1lanMuaGFpdGlhbi1jcmVvbGVcIjogXCJIYWl0aWFuIENyZW9sZVwiLFxuXHRcIm1lanMuaGVicmV3XCI6IFwiSGVicmV3XCIsXG5cdFwibWVqcy5oaW5kaVwiOiBcIkhpbmRpXCIsXG5cdFwibWVqcy5odW5nYXJpYW5cIjogXCJIdW5nYXJpYW5cIixcblx0XCJtZWpzLmljZWxhbmRpY1wiOiBcIkljZWxhbmRpY1wiLFxuXHRcIm1lanMuaW5kb25lc2lhblwiOiBcIkluZG9uZXNpYW5cIixcblx0XCJtZWpzLmlyaXNoXCI6IFwiSXJpc2hcIixcblx0XCJtZWpzLml0YWxpYW5cIjogXCJJdGFsaWFuXCIsXG5cdFwibWVqcy5qYXBhbmVzZVwiOiBcIkphcGFuZXNlXCIsXG5cdFwibWVqcy5rb3JlYW5cIjogXCJLb3JlYW5cIixcblx0XCJtZWpzLmxhdHZpYW5cIjogXCJMYXR2aWFuXCIsXG5cdFwibWVqcy5saXRodWFuaWFuXCI6IFwiTGl0aHVhbmlhblwiLFxuXHRcIm1lanMubWFjZWRvbmlhblwiOiBcIk1hY2Vkb25pYW5cIixcblx0XCJtZWpzLm1hbGF5XCI6IFwiTWFsYXlcIixcblx0XCJtZWpzLm1hbHRlc2VcIjogXCJNYWx0ZXNlXCIsXG5cdFwibWVqcy5ub3J3ZWdpYW5cIjogXCJOb3J3ZWdpYW5cIixcblx0XCJtZWpzLnBlcnNpYW5cIjogXCJQZXJzaWFuXCIsXG5cdFwibWVqcy5wb2xpc2hcIjogXCJQb2xpc2hcIixcblx0XCJtZWpzLnBvcnR1Z3Vlc2VcIjogXCJQb3J0dWd1ZXNlXCIsXG5cdFwibWVqcy5yb21hbmlhblwiOiBcIlJvbWFuaWFuXCIsXG5cdFwibWVqcy5ydXNzaWFuXCI6IFwiUnVzc2lhblwiLFxuXHRcIm1lanMuc2VyYmlhblwiOiBcIlNlcmJpYW5cIixcblx0XCJtZWpzLnNsb3Zha1wiOiBcIlNsb3Zha1wiLFxuXHRcIm1lanMuc2xvdmVuaWFuXCI6IFwiU2xvdmVuaWFuXCIsXG5cdFwibWVqcy5zcGFuaXNoXCI6IFwiU3BhbmlzaFwiLFxuXHRcIm1lanMuc3dhaGlsaVwiOiBcIlN3YWhpbGlcIixcblx0XCJtZWpzLnN3ZWRpc2hcIjogXCJTd2VkaXNoXCIsXG5cdFwibWVqcy50YWdhbG9nXCI6IFwiVGFnYWxvZ1wiLFxuXHRcIm1lanMudGhhaVwiOiBcIlRoYWlcIixcblx0XCJtZWpzLnR1cmtpc2hcIjogXCJUdXJraXNoXCIsXG5cdFwibWVqcy51a3JhaW5pYW5cIjogXCJVa3JhaW5pYW5cIixcblx0XCJtZWpzLnZpZXRuYW1lc2VcIjogXCJWaWV0bmFtZXNlXCIsXG5cdFwibWVqcy53ZWxzaFwiOiBcIldlbHNoXCIsXG5cdFwibWVqcy55aWRkaXNoXCI6IFwiWWlkZGlzaFwiXG59OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi9jb3JlL21lanMnO1xuXG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy4kID0galF1ZXJ5O1xufSBlbHNlIGlmICh0eXBlb2YgWmVwdG8gIT09ICd1bmRlZmluZWQnKSB7XG5cdG1lanMuJCA9IFplcHRvO1xuXG5cdC8vIGRlZmluZSBgb3V0ZXJXaWR0aGAgbWV0aG9kIHdoaWNoIGhhcyBub3QgYmVlbiByZWFsaXplZCBpbiBaZXB0b1xuXHRaZXB0by5mbi5vdXRlcldpZHRoID0gZnVuY3Rpb24gKGluY2x1ZGVNYXJnaW4pIHtcblx0XHRsZXQgd2lkdGggPSAkKHRoaXMpLndpZHRoKCk7XG5cdFx0aWYgKGluY2x1ZGVNYXJnaW4pIHtcblx0XHRcdHdpZHRoICs9IHBhcnNlSW50KCQodGhpcykuY3NzKCdtYXJnaW4tcmlnaHQnKSwgMTApO1xuXHRcdFx0d2lkdGggKz0gcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKTtcblx0XHR9XG5cdFx0cmV0dXJuIHdpZHRoO1xuXHR9O1xuXG59IGVsc2UgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy4kID0gZW5kZXI7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuL2NvcmUvbWVqcyc7XG5pbXBvcnQgTWVkaWFFbGVtZW50IGZyb20gJy4vY29yZS9tZWRpYWVsZW1lbnQnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtcblx0SVNfRklSRUZPWCxcblx0SVNfSVBBRCxcblx0SVNfSVBIT05FLFxuXHRJU19BTkRST0lELFxuXHRJU19JT1MsXG5cdEhBU19UT1VDSCxcblx0SEFTX01TX05BVElWRV9GVUxMU0NSRUVOLFxuXHRIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTlxufSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3NwbGl0RXZlbnRzfSBmcm9tICcuL3V0aWxzL2dlbmVyYWwnO1xuaW1wb3J0IHtjYWxjdWxhdGVUaW1lRm9ybWF0fSBmcm9tICcuL3V0aWxzL3RpbWUnO1xuaW1wb3J0IHtpc05vZGVBZnRlcn0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5tZWpzLm1lcEluZGV4ID0gMDtcblxubWVqcy5wbGF5ZXJzID0ge307XG5cbi8vIGRlZmF1bHQgcGxheWVyIHZhbHVlc1xuZXhwb3J0IGxldCBjb25maWcgPSB7XG5cdC8vIHVybCB0byBwb3N0ZXIgKHRvIGZpeCBpT1MgMy54KVxuXHRwb3N0ZXI6ICcnLFxuXHQvLyBXaGVuIHRoZSB2aWRlbyBpcyBlbmRlZCwgd2UgY2FuIHNob3cgdGhlIHBvc3Rlci5cblx0c2hvd1Bvc3RlcldoZW5FbmRlZDogZmFsc2UsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIDx2aWRlbyB3aWR0aD4gaXMgbm90IHNwZWNpZmllZFxuXHRkZWZhdWx0VmlkZW9XaWR0aDogNDgwLFxuXHQvLyBkZWZhdWx0IGlmIHRoZSA8dmlkZW8gaGVpZ2h0PiBpcyBub3Qgc3BlY2lmaWVkXG5cdGRlZmF1bHRWaWRlb0hlaWdodDogMjcwLFxuXHQvLyBpZiBzZXQsIG92ZXJyaWRlcyA8dmlkZW8gd2lkdGg+XG5cdHZpZGVvV2lkdGg6IC0xLFxuXHQvLyBpZiBzZXQsIG92ZXJyaWRlcyA8dmlkZW8gaGVpZ2h0PlxuXHR2aWRlb0hlaWdodDogLTEsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIHVzZXIgZG9lc24ndCBzcGVjaWZ5XG5cdGRlZmF1bHRBdWRpb1dpZHRoOiA0MDAsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIHVzZXIgZG9lc24ndCBzcGVjaWZ5XG5cdGRlZmF1bHRBdWRpb0hlaWdodDogNDAsXG5cdC8vIGRlZmF1bHQgYW1vdW50IHRvIG1vdmUgYmFjayB3aGVuIGJhY2sga2V5IGlzIHByZXNzZWRcblx0ZGVmYXVsdFNlZWtCYWNrd2FyZEludGVydmFsOiAobWVkaWEpID0+IG1lZGlhLmR1cmF0aW9uICogMC4wNSxcblx0Ly8gZGVmYXVsdCBhbW91bnQgdG8gbW92ZSBmb3J3YXJkIHdoZW4gZm9yd2FyZCBrZXkgaXMgcHJlc3NlZFxuXHRkZWZhdWx0U2Vla0ZvcndhcmRJbnRlcnZhbDogKG1lZGlhKSA9PiBtZWRpYS5kdXJhdGlvbiAqIDAuMDUsXG5cdC8vIHNldCBkaW1lbnNpb25zIHZpYSBKUyBpbnN0ZWFkIG9mIENTU1xuXHRzZXREaW1lbnNpb25zOiB0cnVlLFxuXHQvLyB3aWR0aCBvZiBhdWRpbyBwbGF5ZXJcblx0YXVkaW9XaWR0aDogLTEsXG5cdC8vIGhlaWdodCBvZiBhdWRpbyBwbGF5ZXJcblx0YXVkaW9IZWlnaHQ6IC0xLFxuXHQvLyBpbml0aWFsIHZvbHVtZSB3aGVuIHRoZSBwbGF5ZXIgc3RhcnRzIChvdmVycmlkZGVuIGJ5IHVzZXIgY29va2llKVxuXHRzdGFydFZvbHVtZTogMC44LFxuXHQvLyB1c2VmdWwgZm9yIDxhdWRpbz4gcGxheWVyIGxvb3BzXG5cdGxvb3A6IGZhbHNlLFxuXHQvLyByZXdpbmQgdG8gYmVnaW5uaW5nIHdoZW4gbWVkaWEgZW5kc1xuXHRhdXRvUmV3aW5kOiB0cnVlLFxuXHQvLyByZXNpemUgdG8gbWVkaWEgZGltZW5zaW9uc1xuXHRlbmFibGVBdXRvc2l6ZTogdHJ1ZSxcblx0Lypcblx0ICogVGltZSBmb3JtYXQgdG8gdXNlLiBEZWZhdWx0OiAnbW06c3MnXG5cdCAqIFN1cHBvcnRlZCB1bml0czpcblx0ICogICBoOiBob3VyXG5cdCAqICAgbTogbWludXRlXG5cdCAqICAgczogc2Vjb25kXG5cdCAqICAgZjogZnJhbWUgY291bnRcblx0ICogV2hlbiB1c2luZyAnaGgnLCAnbW0nLCAnc3MnIG9yICdmZicgd2UgYWx3YXlzIGRpc3BsYXkgMiBkaWdpdHMuXG5cdCAqIElmIHlvdSB1c2UgJ2gnLCAnbScsICdzJyBvciAnZicgd2UgZGlzcGxheSAxIGRpZ2l0IGlmIHBvc3NpYmxlLlxuXHQgKlxuXHQgKiBFeGFtcGxlIHRvIGRpc3BsYXkgNzUgc2Vjb25kczpcblx0ICogRm9ybWF0ICdtbTpzcyc6IDAxOjE1XG5cdCAqIEZvcm1hdCAnbTpzcyc6IDE6MTVcblx0ICogRm9ybWF0ICdtOnMnOiAxOjE1XG5cdCAqL1xuXHR0aW1lRm9ybWF0OiAnJyxcblx0Ly8gZm9yY2VzIHRoZSBob3VyIG1hcmtlciAoIyM6MDA6MDApXG5cdGFsd2F5c1Nob3dIb3VyczogZmFsc2UsXG5cdC8vIHNob3cgZnJhbWVjb3VudCBpbiB0aW1lY29kZSAoIyM6MDA6MDA6MDApXG5cdHNob3dUaW1lY29kZUZyYW1lQ291bnQ6IGZhbHNlLFxuXHQvLyB1c2VkIHdoZW4gc2hvd1RpbWVjb2RlRnJhbWVDb3VudCBpcyBzZXQgdG8gdHJ1ZVxuXHRmcmFtZXNQZXJTZWNvbmQ6IDI1LFxuXHQvLyBIaWRlIGNvbnRyb2xzIHdoZW4gcGxheWluZyBhbmQgbW91c2UgaXMgbm90IG92ZXIgdGhlIHZpZGVvXG5cdGFsd2F5c1Nob3dDb250cm9sczogZmFsc2UsXG5cdC8vIERpc3BsYXkgdGhlIHZpZGVvIGNvbnRyb2xcblx0aGlkZVZpZGVvQ29udHJvbHNPbkxvYWQ6IGZhbHNlLFxuXHQvLyBFbmFibGUgY2xpY2sgdmlkZW8gZWxlbWVudCB0byB0b2dnbGUgcGxheS9wYXVzZVxuXHRjbGlja1RvUGxheVBhdXNlOiB0cnVlLFxuXHQvLyBUaW1lIGluIG1zIHRvIGhpZGUgY29udHJvbHNcblx0Y29udHJvbHNUaW1lb3V0RGVmYXVsdDogMTUwMCxcblx0Ly8gVGltZSBpbiBtcyB0byB0cmlnZ2VyIHRoZSB0aW1lciB3aGVuIG1vdXNlIG1vdmVzXG5cdGNvbnRyb2xzVGltZW91dE1vdXNlRW50ZXI6IDI1MDAsXG5cdC8vIFRpbWUgaW4gbXMgdG8gdHJpZ2dlciB0aGUgdGltZXIgd2hlbiBtb3VzZSBsZWF2ZXNcblx0Y29udHJvbHNUaW1lb3V0TW91c2VMZWF2ZTogMTAwMCxcblx0Ly8gZm9yY2UgaVBhZCdzIG5hdGl2ZSBjb250cm9sc1xuXHRpUGFkVXNlTmF0aXZlQ29udHJvbHM6IGZhbHNlLFxuXHQvLyBmb3JjZSBpUGhvbmUncyBuYXRpdmUgY29udHJvbHNcblx0aVBob25lVXNlTmF0aXZlQ29udHJvbHM6IGZhbHNlLFxuXHQvLyBmb3JjZSBBbmRyb2lkJ3MgbmF0aXZlIGNvbnRyb2xzXG5cdEFuZHJvaWRVc2VOYXRpdmVDb250cm9sczogZmFsc2UsXG5cdC8vIGZlYXR1cmVzIHRvIHNob3dcblx0ZmVhdHVyZXM6IFsncGxheXBhdXNlJywgJ2N1cnJlbnQnLCAncHJvZ3Jlc3MnLCAnZHVyYXRpb24nLCAndHJhY2tzJywgJ3ZvbHVtZScsICdmdWxsc2NyZWVuJ10sXG5cdC8vIG9ubHkgZm9yIGR5bmFtaWNcblx0aXNWaWRlbzogdHJ1ZSxcblx0Ly8gc3RyZXRjaGluZyBtb2RlcyAoYXV0bywgZmlsbCwgcmVzcG9uc2l2ZSwgbm9uZSlcblx0c3RyZXRjaGluZzogJ2F1dG8nLFxuXHQvLyBwcmVmaXggY2xhc3MgbmFtZXMgb24gZWxlbWVudHNcblx0Y2xhc3NQcmVmaXg6ICdtZWpzX18nLFxuXHQvLyB0dXJucyBrZXlib2FyZCBzdXBwb3J0IG9uIGFuZCBvZmYgZm9yIHRoaXMgaW5zdGFuY2Vcblx0ZW5hYmxlS2V5Ym9hcmQ6IHRydWUsXG5cdC8vIHdoZW4gdGhpcyBwbGF5ZXIgc3RhcnRzLCBpdCB3aWxsIHBhdXNlIG90aGVyIHBsYXllcnNcblx0cGF1c2VPdGhlclBsYXllcnM6IHRydWUsXG5cdC8vIGFycmF5IG9mIGtleWJvYXJkIGFjdGlvbnMgc3VjaCBhcyBwbGF5L3BhdXNlXG5cdGtleUFjdGlvbnM6IFtcblx0XHR7XG5cdFx0XHRrZXlzOiBbXG5cdFx0XHRcdDMyLCAvLyBTUEFDRVxuXHRcdFx0XHQxNzkgLy8gR09PR0xFIHBsYXkvcGF1c2UgYnV0dG9uXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmICghSVNfRklSRUZPWCkge1xuXHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQgfHwgbWVkaWEuZW5kZWQpIHtcblx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFszOF0sIC8vIFVQXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24+YnV0dG9uYCkuaXMoJzpmb2N1cycpIHx8XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmlzKCc6Zm9jdXMnKSkge1xuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IG5ld1ZvbHVtZSA9IE1hdGgubWluKG1lZGlhLnZvbHVtZSArIDAuMSwgMSk7XG5cdFx0XHRcdG1lZGlhLnNldFZvbHVtZShuZXdWb2x1bWUpO1xuXHRcdFx0XHRpZiAobmV3Vm9sdW1lID4gMCkge1xuXHRcdFx0XHRcdG1lZGlhLnNldE11dGVkKGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbNDBdLCAvLyBET1dOXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24+YnV0dG9uYCkuaXMoJzpmb2N1cycpIHx8XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmlzKCc6Zm9jdXMnKSkge1xuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7Y29uZmlnLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgbmV3Vm9sdW1lID0gTWF0aC5tYXgobWVkaWEudm9sdW1lIC0gMC4xLCAwKTtcblx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKG5ld1ZvbHVtZSk7XG5cblx0XHRcdFx0aWYgKG5ld1ZvbHVtZSA8PSAwLjEpIHtcblx0XHRcdFx0XHRtZWRpYS5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbXG5cdFx0XHRcdDM3LCAvLyBMRUZUXG5cdFx0XHRcdDIyNyAvLyBHb29nbGUgVFYgcmV3aW5kXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXHRcdFx0XHRpZiAoIWlzTmFOKG1lZGlhLmR1cmF0aW9uKSAmJiBtZWRpYS5kdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyA1JVxuXHRcdFx0XHRcdGxldCBuZXdUaW1lID0gTWF0aC5tYXgobWVkaWEuY3VycmVudFRpbWUgLSBwbGF5ZXIub3B0aW9ucy5kZWZhdWx0U2Vla0JhY2t3YXJkSW50ZXJ2YWwobWVkaWEpLCAwKTtcblx0XHRcdFx0XHRtZWRpYS5zZXRDdXJyZW50VGltZShuZXdUaW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogW1xuXHRcdFx0XHQzOSwgLy8gUklHSFRcblx0XHRcdFx0MjI4IC8vIEdvb2dsZSBUViBmb3J3YXJkXG5cdFx0XHRdLFxuXHRcdFx0YWN0aW9uOiAocGxheWVyLCBtZWRpYSkgPT4ge1xuXG5cdFx0XHRcdGlmICghaXNOYU4obWVkaWEuZHVyYXRpb24pICYmIG1lZGlhLmR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIDUlXG5cdFx0XHRcdFx0bGV0IG5ld1RpbWUgPSBNYXRoLm1pbihtZWRpYS5jdXJyZW50VGltZSArIHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrRm9yd2FyZEludGVydmFsKG1lZGlhKSwgbWVkaWEuZHVyYXRpb24pO1xuXHRcdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbNzBdLCAvLyBGXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhLCBrZXksIGV2ZW50KSA9PiB7XG5cdFx0XHRcdGlmICghZXZlbnQuY3RybEtleSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcGxheWVyLmVudGVyRnVsbFNjcmVlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdGlmIChwbGF5ZXIuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0XHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmVudGVyRnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogWzc3XSwgLy8gTVxuXHRcdFx0YWN0aW9uOiAocGxheWVyKSA9PiB7XG5cblx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHRpZiAocGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwbGF5ZXIubWVkaWEubXV0ZWQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuc2V0TXV0ZWQoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBsYXllci5zZXRNdXRlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XVxufTtcblxubWVqcy5NZXBEZWZhdWx0cyA9IGNvbmZpZztcblxuLyoqXG4gKiBXcmFwIGEgTWVkaWFFbGVtZW50IG9iamVjdCBpbiBwbGF5ZXIgY29udHJvbHNcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvXG4gKiBAcmV0dXJuIHs/TWVkaWFFbGVtZW50UGxheWVyfVxuICovXG5jbGFzcyBNZWRpYUVsZW1lbnRQbGF5ZXIge1xuXG5cdGNvbnN0cnVjdG9yIChub2RlLCBvKSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0Lmhhc0ZvY3VzID0gZmFsc2U7XG5cblx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cblx0XHR0LmNvbnRyb2xzRW5hYmxlZCA9IHRydWU7XG5cblx0XHR0LmNvbnRyb2xzVGltZXIgPSBudWxsO1xuXG5cdFx0Ly8gZW5mb3JjZSBvYmplY3QsIGV2ZW4gd2l0aG91dCBcIm5ld1wiICh2aWEgSm9obiBSZXNpZylcblx0XHRpZiAoISh0IGluc3RhbmNlb2YgTWVkaWFFbGVtZW50UGxheWVyKSkge1xuXHRcdFx0cmV0dXJuIG5ldyBNZWRpYUVsZW1lbnRQbGF5ZXIobm9kZSwgbyk7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlc2Ugd2lsbCBiZSByZXNldCBhZnRlciB0aGUgTWVkaWFFbGVtZW50LnN1Y2Nlc3MgZmlyZXNcblx0XHR0LiRtZWRpYSA9IHQuJG5vZGUgPSAkKG5vZGUpO1xuXHRcdHQubm9kZSA9IHQubWVkaWEgPSB0LiRtZWRpYVswXTtcblxuXHRcdGlmICghdC5ub2RlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgZm9yIGV4aXN0aW5nIHBsYXllclxuXHRcdGlmICh0Lm5vZGUucGxheWVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0Lm5vZGUucGxheWVyO1xuXHRcdH1cblxuXG5cdFx0Ly8gdHJ5IHRvIGdldCBvcHRpb25zIGZyb20gZGF0YS1tZWpzb3B0aW9uc1xuXHRcdGlmIChvID09PSB1bmRlZmluZWQpIHtcblx0XHRcdG8gPSB0LiRub2RlLmRhdGEoJ21lanNvcHRpb25zJyk7XG5cdFx0fVxuXG5cdFx0Ly8gZXh0ZW5kIGRlZmF1bHQgb3B0aW9uc1xuXHRcdHQub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZywgbyk7XG5cblx0XHRpZiAoIXQub3B0aW9ucy50aW1lRm9ybWF0KSB7XG5cdFx0XHQvLyBHZW5lcmF0ZSB0aGUgdGltZSBmb3JtYXQgYWNjb3JkaW5nIHRvIG9wdGlvbnNcblx0XHRcdHQub3B0aW9ucy50aW1lRm9ybWF0ID0gJ21tOnNzJztcblx0XHRcdGlmICh0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKSB7XG5cdFx0XHRcdHQub3B0aW9ucy50aW1lRm9ybWF0ID0gJ2hoOm1tOnNzJztcblx0XHRcdH1cblx0XHRcdGlmICh0Lm9wdGlvbnMuc2hvd1RpbWVjb2RlRnJhbWVDb3VudCkge1xuXHRcdFx0XHR0Lm9wdGlvbnMudGltZUZvcm1hdCArPSAnOmZmJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjYWxjdWxhdGVUaW1lRm9ybWF0KDAsIHQub3B0aW9ucywgdC5vcHRpb25zLmZyYW1lc1BlclNlY29uZCB8fCAyNSk7XG5cblx0XHQvLyB1bmlxdWUgSURcblx0XHR0LmlkID0gYG1lcF8ke21lanMubWVwSW5kZXgrK31gO1xuXG5cdFx0Ly8gYWRkIHRvIHBsYXllciBhcnJheSAoZm9yIGZvY3VzIGV2ZW50cylcblx0XHRtZWpzLnBsYXllcnNbdC5pZF0gPSB0O1xuXG5cdFx0Ly8gc3RhcnQgdXBcblx0XHRsZXRcblxuXHRcdFx0bWVPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdC5vcHRpb25zLCB7XG5cdFx0XHRcdHN1Y2Nlc3M6IChtZWRpYSwgZG9tTm9kZSkgPT4ge1xuXHRcdFx0XHRcdHQuX21lUmVhZHkobWVkaWEsIGRvbU5vZGUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogKGUpID0+IHtcblx0XHRcdFx0XHR0Ll9oYW5kbGVFcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSksXG5cdFx0XHR0YWdOYW1lID0gdC5tZWRpYS50YWdOYW1lLnRvTG93ZXJDYXNlKClcblx0XHRcdDtcblxuXHRcdC8vIGdldCB2aWRlbyBmcm9tIHNyYyBvciBocmVmP1xuXHRcdHQuaXNEeW5hbWljID0gKHRhZ05hbWUgIT09ICdhdWRpbycgJiYgdGFnTmFtZSAhPT0gJ3ZpZGVvJyk7XG5cdFx0dC5pc1ZpZGVvID0gKHQuaXNEeW5hbWljKSA/IHQub3B0aW9ucy5pc1ZpZGVvIDogKHRhZ05hbWUgIT09ICdhdWRpbycgJiYgdC5vcHRpb25zLmlzVmlkZW8pO1xuXG5cdFx0Ly8gdXNlIG5hdGl2ZSBjb250cm9scyBpbiBpUGFkLCBpUGhvbmUsIGFuZCBBbmRyb2lkXG5cdFx0aWYgKChJU19JUEFEICYmIHQub3B0aW9ucy5pUGFkVXNlTmF0aXZlQ29udHJvbHMpIHx8IChJU19JUEhPTkUgJiYgdC5vcHRpb25zLmlQaG9uZVVzZU5hdGl2ZUNvbnRyb2xzKSkge1xuXG5cdFx0XHQvLyBhZGQgY29udHJvbHMgYW5kIHN0b3Bcblx0XHRcdHQuJG1lZGlhLmF0dHIoJ2NvbnRyb2xzJywgJ2NvbnRyb2xzJyk7XG5cblx0XHRcdC8vIG92ZXJyaWRlIEFwcGxlJ3MgYXV0b3BsYXkgb3ZlcnJpZGUgZm9yIGlQYWRzXG5cdFx0XHRpZiAoSVNfSVBBRCAmJiB0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoSVNfQU5EUk9JRCAmJiB0Lm9wdGlvbnMuQW5kcm9pZFVzZU5hdGl2ZUNvbnRyb2xzKSB7XG5cblx0XHRcdC8vIGxlYXZlIGRlZmF1bHQgcGxheWVyXG5cblx0XHR9IGVsc2UgaWYgKHQuaXNWaWRlbyB8fCAoIXQuaXNWaWRlbyAmJiB0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoKSkge1xuXG5cdFx0XHQvLyBERVNLVE9QOiB1c2UgTWVkaWFFbGVtZW50UGxheWVyIGNvbnRyb2xzXG5cblx0XHRcdC8vIHJlbW92ZSBuYXRpdmUgY29udHJvbHNcblx0XHRcdHQuJG1lZGlhLnJlbW92ZUF0dHIoJ2NvbnRyb2xzJyk7XG5cdFx0XHRsZXQgdmlkZW9QbGF5ZXJUaXRsZSA9IHQuaXNWaWRlbyA/IGkxOG4udCgnbWVqcy52aWRlby1wbGF5ZXInKSA6IGkxOG4udCgnbWVqcy5hdWRpby1wbGF5ZXInKTtcblx0XHRcdC8vIGluc2VydCBkZXNjcmlwdGlvbiBmb3Igc2NyZWVuIHJlYWRlcnNcblx0XHRcdCQoYDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuXCI+JHt2aWRlb1BsYXllclRpdGxlfTwvc3Bhbj5gKS5pbnNlcnRCZWZvcmUodC4kbWVkaWEpO1xuXHRcdFx0Ly8gYnVpbGQgY29udGFpbmVyXG5cdFx0XHR0LmNvbnRhaW5lciA9XG5cdFx0XHRcdCQoYDxkaXYgaWQ9XCIke3QuaWR9XCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyLWtleWJvYXJkLWluYWN0aXZlXCJgICtcblx0XHRcdFx0XHRgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImFwcGxpY2F0aW9uXCIgYXJpYS1sYWJlbD1cIiR7dmlkZW9QbGF5ZXJUaXRsZX1cIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlubmVyXCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tZWRpYWVsZW1lbnRcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyc1wiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbHNcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNsZWFyXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFkZENsYXNzKHQuJG1lZGlhWzBdLmNsYXNzTmFtZSlcblx0XHRcdFx0Lmluc2VydEJlZm9yZSh0LiRtZWRpYSlcblx0XHRcdFx0LmZvY3VzKChlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCF0LmNvbnRyb2xzQXJlVmlzaWJsZSAmJiAhdC5oYXNGb2N1cyAmJiB0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHModHJ1ZSk7XG5cdFx0XHRcdFx0XHQvLyBJbiB2ZXJzaW9ucyBvbGRlciB0aGFuIElFMTEsIHRoZSBmb2N1cyBjYXVzZXMgdGhlIHBsYXliYXIgdG8gYmUgZGlzcGxheWVkXG5cdFx0XHRcdFx0XHQvLyBpZiB1c2VyIGNsaWNrcyBvbiB0aGUgUGxheS9QYXVzZSBidXR0b24gaW4gdGhlIGNvbnRyb2wgYmFyIG9uY2UgaXQgYXR0ZW1wdHNcblx0XHRcdFx0XHRcdC8vIHRvIGhpZGUgaXRcblx0XHRcdFx0XHRcdGlmICghSEFTX01TX05BVElWRV9GVUxMU0NSRUVOKSB7XG5cdFx0XHRcdFx0XHRcdC8vIElmIGUucmVsYXRlZFRhcmdldCBhcHBlYXJzIGJlZm9yZSBjb250YWluZXIsIHNlbmQgZm9jdXMgdG8gcGxheSBidXR0b24sXG5cdFx0XHRcdFx0XHRcdC8vIGVsc2Ugc2VuZCBmb2N1cyB0byBsYXN0IGNvbnRyb2wgYnV0dG9uLlxuXHRcdFx0XHRcdFx0XHRsZXQgYnRuU2VsZWN0b3IgPSBgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlwYXVzZS1idXR0b24gPiBidXR0b25gO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpc05vZGVBZnRlcihlLnJlbGF0ZWRUYXJnZXQsIHQuY29udGFpbmVyWzBdKSkge1xuXHRcdFx0XHRcdFx0XHRcdGJ0blNlbGVjdG9yID0gYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9scyAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uOmxhc3QtY2hpbGQgPiBidXR0b25gO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0bGV0IGJ1dHRvbiA9IHQuY29udGFpbmVyLmZpbmQoYnRuU2VsZWN0b3IpO1xuXHRcdFx0XHRcdFx0XHRidXR0b24uZm9jdXMoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBXaGVuIG5vIGVsZW1lbnRzIGluIGNvbnRyb2xzLCBoaWRlIGJhciBjb21wbGV0ZWx5XG5cdFx0XHRpZiAoIXQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGgpIHtcblx0XHRcdFx0dC5jb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kJywgJ3RyYW5zcGFyZW50Jylcblx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sc2ApXG5cdFx0XHRcdC5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0LmlzVmlkZW8gJiYgdC5vcHRpb25zLnN0cmV0Y2hpbmcgPT09ICdmaWxsJyAmJiAhdC5jb250YWluZXIucGFyZW50KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZmlsbC1jb250YWluZXJgKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gb3V0ZXIgY29udGFpbmVyXG5cdFx0XHRcdHQub3V0ZXJDb250YWluZXIgPSB0LiRtZWRpYS5wYXJlbnQoKTtcblx0XHRcdFx0dC5jb250YWluZXIud3JhcChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZpbGwtY29udGFpbmVyXCIvPmApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhZGQgY2xhc3NlcyBmb3IgdXNlciBhbmQgY29udGVudFxuXHRcdFx0dC5jb250YWluZXIuYWRkQ2xhc3MoXG5cdFx0XHRcdChJU19BTkRST0lEID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWFuZHJvaWQgYCA6ICcnKSArXG5cdFx0XHRcdChJU19JT1MgPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aW9zIGAgOiAnJykgK1xuXHRcdFx0XHQoSVNfSVBBRCA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1pcGFkIGAgOiAnJykgK1xuXHRcdFx0XHQoSVNfSVBIT05FID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlwaG9uZSBgIDogJycpICtcblx0XHRcdFx0KHQuaXNWaWRlbyA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12aWRlbyBgIDogYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWF1ZGlvIGApXG5cdFx0XHQpO1xuXG5cblx0XHRcdC8vIG1vdmUgdGhlIDx2aWRlby92aWRlbz4gdGFnIGludG8gdGhlIHJpZ2h0IHNwb3Rcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tZWRpYWVsZW1lbnRgKS5hcHBlbmQodC4kbWVkaWEpO1xuXG5cdFx0XHQvLyBuZWVkcyB0byBiZSBhc3NpZ25lZCBoZXJlLCBhZnRlciBpT1MgcmVtYXBcblx0XHRcdHQubm9kZS5wbGF5ZXIgPSB0O1xuXG5cdFx0XHQvLyBmaW5kIHBhcnRzXG5cdFx0XHR0LmNvbnRyb2xzID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xzYCk7XG5cdFx0XHR0LmxheWVycyA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcnNgKTtcblxuXHRcdFx0Ly8gZGV0ZXJtaW5lIHRoZSBzaXplXG5cblx0XHRcdC8qIHNpemUgcHJpb3JpdHk6XG5cdFx0XHQgKDEpIHZpZGVvV2lkdGggKGZvcmNlZCksXG5cdFx0XHQgKDIpIHN0eWxlPVwid2lkdGg7aGVpZ2h0O1wiXG5cdFx0XHQgKDMpIHdpZHRoIGF0dHJpYnV0ZSxcblx0XHRcdCAoNCkgZGVmYXVsdFZpZGVvV2lkdGggKGZvciB1bnNwZWNpZmllZCBjYXNlcylcblx0XHRcdCAqL1xuXG5cdFx0XHRsZXRcblx0XHRcdFx0dGFnVHlwZSA9ICh0LmlzVmlkZW8gPyAndmlkZW8nIDogJ2F1ZGlvJyksXG5cdFx0XHRcdGNhcHNUYWdOYW1lID0gdGFnVHlwZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIHRhZ1R5cGUuc3Vic3RyaW5nKDEpXG5cdFx0XHRcdDtcblxuXG5cdFx0XHRpZiAodC5vcHRpb25zW3RhZ1R5cGUgKyAnV2lkdGgnXSA+IDAgfHwgdC5vcHRpb25zW3RhZ1R5cGUgKyAnV2lkdGgnXS50b1N0cmluZygpLmluZGV4T2YoJyUnKSA+IC0xKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm9wdGlvbnNbdGFnVHlwZSArICdXaWR0aCddO1xuXHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLnN0eWxlLndpZHRoICE9PSAnJyAmJiB0Lm1lZGlhLnN0eWxlLndpZHRoICE9PSBudWxsKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm1lZGlhLnN0eWxlLndpZHRoO1xuXHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSkge1xuXHRcdFx0XHR0LndpZHRoID0gdC4kbWVkaWEuYXR0cignd2lkdGgnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQud2lkdGggPSB0Lm9wdGlvbnNbJ2RlZmF1bHQnICsgY2Fwc1RhZ05hbWUgKyAnV2lkdGgnXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQub3B0aW9uc1t0YWdUeXBlICsgJ0hlaWdodCddID4gMCB8fCB0Lm9wdGlvbnNbdGFnVHlwZSArICdIZWlnaHQnXS50b1N0cmluZygpLmluZGV4T2YoJyUnKSA+IC0xKSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC5vcHRpb25zW3RhZ1R5cGUgKyAnSGVpZ2h0J107XG5cdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuc3R5bGUuaGVpZ2h0ICE9PSAnJyAmJiB0Lm1lZGlhLnN0eWxlLmhlaWdodCAhPT0gbnVsbCkge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQubWVkaWEuc3R5bGUuaGVpZ2h0O1xuXHRcdFx0fSBlbHNlIGlmICh0LiRtZWRpYVswXS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC4kbWVkaWEuYXR0cignaGVpZ2h0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0LmhlaWdodCA9IHQub3B0aW9uc1snZGVmYXVsdCcgKyBjYXBzVGFnTmFtZSArICdIZWlnaHQnXTtcblx0XHRcdH1cblxuXHRcdFx0dC5pbml0aWFsQXNwZWN0UmF0aW8gPSAodC5oZWlnaHQgPj0gdC53aWR0aCkgPyB0LndpZHRoIC8gdC5oZWlnaHQgOiB0LmhlaWdodCAvIHQud2lkdGg7XG5cblx0XHRcdC8vIHNldCB0aGUgc2l6ZSwgd2hpbGUgd2Ugd2FpdCBmb3IgdGhlIHBsdWdpbnMgdG8gbG9hZCBiZWxvd1xuXHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblxuXHRcdFx0Ly8gY3JlYXRlIE1lZGlhRWxlbWVudFNoaW1cblx0XHRcdG1lT3B0aW9ucy5wbHVnaW5XaWR0aCA9IHQud2lkdGg7XG5cdFx0XHRtZU9wdGlvbnMucGx1Z2luSGVpZ2h0ID0gdC5oZWlnaHQ7XG5cdFx0fVxuXHRcdC8vIEhpZGUgbWVkaWEgY29tcGxldGVseSBmb3IgYXVkaW8gdGhhdCBkb2Vzbid0IGhhdmUgYW55IGZlYXR1cmVzXG5cdFx0ZWxzZSBpZiAoIXQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkge1xuXHRcdFx0dC4kbWVkaWEuaGlkZSgpO1xuXHRcdH1cblxuXHRcdC8vIGNyZWF0ZSBNZWRpYUVsZW1lbnQgc2hpbVxuXHRcdG5ldyBNZWRpYUVsZW1lbnQodC4kbWVkaWFbMF0sIG1lT3B0aW9ucyk7XG5cblx0XHRpZiAodC5jb250YWluZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoICYmIHQuY29udHJvbHNBcmVWaXNpYmxlICYmICF0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQpIHtcblx0XHRcdC8vIGNvbnRyb2xzIGFyZSBzaG93biB3aGVuIGxvYWRlZFxuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNzaG93bicpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0O1xuXHR9XG5cblx0c2hvd0NvbnRyb2xzIChkb0FuaW1hdGlvbikge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGRvQW5pbWF0aW9uID0gZG9BbmltYXRpb24gPT09IHVuZGVmaW5lZCB8fCBkb0FuaW1hdGlvbjtcblxuXHRcdGlmICh0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChkb0FuaW1hdGlvbikge1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZUluKDIwMCwgKCkgPT4ge1xuXHRcdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cdFx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzc2hvd24nKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBhbnkgYWRkaXRpb25hbCBjb250cm9scyBwZW9wbGUgbWlnaHQgYWRkIGFuZCB3YW50IHRvIGhpZGVcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpLmZhZGVJbigyMDAsICgpID0+IHtcblx0XHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHQvLyBhbnkgYWRkaXRpb25hbCBjb250cm9scyBwZW9wbGUgbWlnaHQgYWRkIGFuZCB3YW50IHRvIGhpZGVcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSB0cnVlO1xuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNzaG93bicpO1xuXHRcdH1cblxuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cblx0fVxuXG5cdGhpZGVDb250cm9scyAoZG9BbmltYXRpb24pIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRkb0FuaW1hdGlvbiA9IGRvQW5pbWF0aW9uID09PSB1bmRlZmluZWQgfHwgZG9BbmltYXRpb247XG5cblx0XHRpZiAoIXQuY29udHJvbHNBcmVWaXNpYmxlIHx8IHQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMgfHwgdC5rZXlib2FyZEFjdGlvbiB8fFxuXHRcdFx0KHQubWVkaWEucGF1c2VkICYmIHQubWVkaWEucmVhZHlTdGF0ZSA9PT0gNCkgfHxcblx0XHRcdCh0LmlzVmlkZW8gJiYgIXQub3B0aW9ucy5oaWRlVmlkZW9Db250cm9sc09uTG9hZCAmJiAhdC5tZWRpYS5yZWFkeVN0YXRlKSB8fFxuXHRcdFx0dC5tZWRpYS5lbmRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChkb0FuaW1hdGlvbikge1xuXHRcdFx0Ly8gZmFkZSBvdXQgbWFpbiBjb250cm9sc1xuXHRcdFx0dC5jb250cm9scy5zdG9wKHRydWUsIHRydWUpLmZhZGVPdXQoMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNoaWRkZW4nKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBhbnkgYWRkaXRpb25hbCBjb250cm9scyBwZW9wbGUgbWlnaHQgYWRkIGFuZCB3YW50IHRvIGhpZGVcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYCkuc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gaGlkZSBtYWluIGNvbnRyb2xzXG5cdFx0XHR0LmNvbnRyb2xzXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYClcblx0XHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHQvLyBoaWRlIG90aGVyc1xuXHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0dC5jb250cm9sc0FyZVZpc2libGUgPSBmYWxzZTtcblx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzaGlkZGVuJyk7XG5cdFx0fVxuXHR9XG5cblx0c3RhcnRDb250cm9sc1RpbWVyICh0aW1lb3V0KSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0aW1lb3V0ID0gdHlwZW9mIHRpbWVvdXQgIT09ICd1bmRlZmluZWQnID8gdGltZW91dCA6IHQub3B0aW9ucy5jb250cm9sc1RpbWVvdXREZWZhdWx0O1xuXG5cdFx0dC5raWxsQ29udHJvbHNUaW1lcignc3RhcnQnKTtcblxuXHRcdHQuY29udHJvbHNUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dC5oaWRlQ29udHJvbHMoKTtcblx0XHRcdHQua2lsbENvbnRyb2xzVGltZXIoJ2hpZGUnKTtcblx0XHR9LCB0aW1lb3V0KTtcblx0fVxuXG5cdGtpbGxDb250cm9sc1RpbWVyICgpIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmICh0LmNvbnRyb2xzVGltZXIgIT09IG51bGwpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0LmNvbnRyb2xzVGltZXIpO1xuXHRcdFx0ZGVsZXRlIHQuY29udHJvbHNUaW1lcjtcblx0XHRcdHQuY29udHJvbHNUaW1lciA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0ZGlzYWJsZUNvbnRyb2xzICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmtpbGxDb250cm9sc1RpbWVyKCk7XG5cdFx0dC5oaWRlQ29udHJvbHMoZmFsc2UpO1xuXHRcdHRoaXMuY29udHJvbHNFbmFibGVkID0gZmFsc2U7XG5cdH1cblxuXHRlbmFibGVDb250cm9scyAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5zaG93Q29udHJvbHMoZmFsc2UpO1xuXG5cdFx0dC5jb250cm9sc0VuYWJsZWQgPSB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCBhbGwgY29udHJvbHMgYW5kIGV2ZW50c1xuXHQgKlxuXHQgKiBAcGFyYW0gbWVkaWFcblx0ICogQHBhcmFtIGRvbU5vZGVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9tZVJlYWR5IChtZWRpYSwgZG9tTm9kZSkge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGF1dG9wbGF5QXR0ciA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpLFxuXHRcdFx0YXV0b3BsYXkgPSAhKGF1dG9wbGF5QXR0ciA9PT0gdW5kZWZpbmVkIHx8IGF1dG9wbGF5QXR0ciA9PT0gbnVsbCB8fCBhdXRvcGxheUF0dHIgPT09ICdmYWxzZScpLFxuXHRcdFx0aXNOYXRpdmUgPSBtZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgbWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8obmF0aXZlfGh0bWw1KS8pICE9PSBudWxsXG5cdFx0XHQ7XG5cblx0XHQvLyBtYWtlIHN1cmUgaXQgY2FuJ3QgY3JlYXRlIGl0c2VsZiBhZ2FpbiBpZiBhIHBsdWdpbiByZWxvYWRzXG5cdFx0aWYgKHQuY3JlYXRlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHQuY3JlYXRlZCA9IHRydWU7XG5cdFx0dC5tZWRpYSA9IG1lZGlhO1xuXHRcdHQuZG9tTm9kZSA9IGRvbU5vZGU7XG5cblx0XHRpZiAoIShJU19BTkRST0lEICYmIHQub3B0aW9ucy5BbmRyb2lkVXNlTmF0aXZlQ29udHJvbHMpICYmICEoSVNfSVBBRCAmJiB0Lm9wdGlvbnMuaVBhZFVzZU5hdGl2ZUNvbnRyb2xzKSAmJiAhKElTX0lQSE9ORSAmJiB0Lm9wdGlvbnMuaVBob25lVXNlTmF0aXZlQ29udHJvbHMpKSB7XG5cblx0XHRcdC8vIEluIHRoZSBldmVudCB0aGF0IG5vIGZlYXR1cmVzIGFyZSBzcGVjaWZpZWQgZm9yIGF1ZGlvLFxuXHRcdFx0Ly8gY3JlYXRlIG9ubHkgTWVkaWFFbGVtZW50IGluc3RhbmNlIHJhdGhlciB0aGFuXG5cdFx0XHQvLyBkb2luZyBhbGwgdGhlIHdvcmsgdG8gY3JlYXRlIGEgZnVsbCBwbGF5ZXJcblx0XHRcdGlmICghdC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoKSB7XG5cblx0XHRcdFx0Ly8gZm9yY2UgYXV0b3BsYXkgZm9yIEhUTUw1XG5cdFx0XHRcdGlmIChhdXRvcGxheSAmJiBpc05hdGl2ZSkge1xuXHRcdFx0XHRcdHQucGxheSgpO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRpZiAodC5vcHRpb25zLnN1Y2Nlc3MpIHtcblxuXHRcdFx0XHRcdGlmICh0eXBlb2YgdC5vcHRpb25zLnN1Y2Nlc3MgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3dbdC5vcHRpb25zLnN1Y2Nlc3NdKHQubWVkaWEsIHQuZG9tTm9kZSwgdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHQub3B0aW9ucy5zdWNjZXNzKHQubWVkaWEsIHQuZG9tTm9kZSwgdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB0d28gYnVpbHQgaW4gZmVhdHVyZXNcblx0XHRcdHQuYnVpbGRwb3N0ZXIodCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXHRcdFx0dC5idWlsZGtleWJvYXJkKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0XHRcdHQuYnVpbGRvdmVybGF5cyh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cblx0XHRcdC8vIGdyYWIgZm9yIHVzZSBieSBmZWF0dXJlc1xuXHRcdFx0dC5maW5kVHJhY2tzKCk7XG5cblx0XHRcdC8vIGFkZCB1c2VyLWRlZmluZWQgZmVhdHVyZXMvY29udHJvbHNcblx0XHRcdGZvciAobGV0IGZlYXR1cmVJbmRleCBpbiB0Lm9wdGlvbnMuZmVhdHVyZXMpIHtcblx0XHRcdFx0bGV0IGZlYXR1cmUgPSB0Lm9wdGlvbnMuZmVhdHVyZXNbZmVhdHVyZUluZGV4XTtcblx0XHRcdFx0aWYgKHRbYGJ1aWxkJHtmZWF0dXJlfWBdKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHRbYGJ1aWxkJHtmZWF0dXJlfWBdKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiByZXBvcnQgY29udHJvbCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihgZXJyb3IgYnVpbGRpbmcgJHtmZWF0dXJlfWAsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc3JlYWR5Jyk7XG5cblx0XHRcdC8vIHJlc2V0IGFsbCBsYXllcnMgYW5kIGNvbnRyb2xzXG5cdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblxuXHRcdFx0Ly8gY29udHJvbHMgZmFkZVxuXHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXG5cdFx0XHRcdGlmIChIQVNfVE9VQ0ggJiYgIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblxuXHRcdFx0XHRcdC8vIGZvciB0b3VjaCBkZXZpY2VzIChpT1MsIEFuZHJvaWQpXG5cdFx0XHRcdFx0Ly8gc2hvdy9oaWRlIHdpdGhvdXQgYW5pbWF0aW9uIG9uIHRvdWNoXG5cblx0XHRcdFx0XHR0LiRtZWRpYS5vbigndG91Y2hzdGFydCcsICgpID0+IHtcblxuXHRcdFx0XHRcdFx0Ly8gdG9nZ2xlIGNvbnRyb2xzXG5cdFx0XHRcdFx0XHRpZiAodC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0dC5oaWRlQ29udHJvbHMoZmFsc2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHMoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIGNyZWF0ZSBjYWxsYmFjayBoZXJlIHNpbmNlIGl0IG5lZWRzIGFjY2VzcyB0byBjdXJyZW50XG5cdFx0XHRcdFx0Ly8gTWVkaWFFbGVtZW50IG9iamVjdFxuXHRcdFx0XHRcdHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0XHRpZiAodC5vcHRpb25zLmNsaWNrVG9QbGF5UGF1c2UpIHtcblx0XHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdFx0YnV0dG9uID0gdC4kbWVkaWEuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWJ1dHRvbmApLFxuXHRcdFx0XHRcdFx0XHRcdHByZXNzZWQgPSBidXR0b24uYXR0cignYXJpYS1wcmVzc2VkJylcblx0XHRcdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0XHRcdGlmICh0Lm1lZGlhLnBhdXNlZCAmJiBwcmVzc2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0YnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcsICFwcmVzc2VkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Ly8gY2xpY2sgdG8gcGxheS9wYXVzZVxuXHRcdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjaywgZmFsc2UpO1xuXG5cdFx0XHRcdFx0Ly8gc2hvdy9oaWRlIGNvbnRyb2xzXG5cdFx0XHRcdFx0dC5jb250YWluZXJcblx0XHRcdFx0XHQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAodC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5raWxsQ29udHJvbHNUaW1lcignZW50ZXInKTtcblx0XHRcdFx0XHRcdFx0XHR0LnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0XHRcdHQuc3RhcnRDb250cm9sc1RpbWVyKHQub3B0aW9ucy5jb250cm9sc1RpbWVvdXRNb3VzZUVudGVyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAodC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0LmNvbnRyb2xzQXJlVmlzaWJsZSkge1xuXHRcdFx0XHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dC5zdGFydENvbnRyb2xzVGltZXIodC5vcHRpb25zLmNvbnRyb2xzVGltZW91dE1vdXNlRW50ZXIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAodC5jb250cm9sc0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0Lm1lZGlhLnBhdXNlZCAmJiAhdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHRcdHQuc3RhcnRDb250cm9sc1RpbWVyKHQub3B0aW9ucy5jb250cm9sc1RpbWVvdXRNb3VzZUxlYXZlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5oaWRlVmlkZW9Db250cm9sc09uTG9hZCkge1xuXHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNoZWNrIGZvciBhdXRvcGxheVxuXHRcdFx0XHRpZiAoYXV0b3BsYXkgJiYgIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHR0LmhpZGVDb250cm9scygpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVzaXplclxuXHRcdFx0XHRpZiAodC5vcHRpb25zLmVuYWJsZUF1dG9zaXplKSB7XG5cdFx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIChlKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBpZiB0aGUgPHZpZGVvIGhlaWdodD4gd2FzIG5vdCBzZXQgYW5kIHRoZSBvcHRpb25zLnZpZGVvSGVpZ2h0IHdhcyBub3Qgc2V0XG5cdFx0XHRcdFx0XHQvLyB0aGVuIHJlc2l6ZSB0byB0aGUgcmVhbCBkaW1lbnNpb25zXG5cdFx0XHRcdFx0XHRpZiAodC5vcHRpb25zLnZpZGVvSGVpZ2h0IDw9IDAgJiYgIXQuZG9tTm9kZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpICYmICFpc05hTihlLnRhcmdldC52aWRlb0hlaWdodCkpIHtcblx0XHRcdFx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKGUudGFyZ2V0LnZpZGVvV2lkdGgsIGUudGFyZ2V0LnZpZGVvSGVpZ2h0KTtcblx0XHRcdFx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdFx0XHRcdFx0dC5tZWRpYS5zZXRTaXplKGUudGFyZ2V0LnZpZGVvV2lkdGgsIGUudGFyZ2V0LnZpZGVvSGVpZ2h0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRVZFTlRTXG5cblx0XHRcdC8vIEZPQ1VTOiB3aGVuIGEgdmlkZW8gc3RhcnRzIHBsYXlpbmcsIGl0IHRha2VzIGZvY3VzIGZyb20gb3RoZXIgcGxheWVycyAocG9zc2libHkgcGF1c2luZyB0aGVtKVxuXHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0XHR0Lmhhc0ZvY3VzID0gdHJ1ZTtcblxuXHRcdFx0XHQvLyBnbyB0aHJvdWdoIGFsbCBvdGhlciBwbGF5ZXJzXG5cdFx0XHRcdGZvciAobGV0IHBsYXllckluZGV4IGluIG1lanMucGxheWVycykge1xuXHRcdFx0XHRcdGxldCBwID0gbWVqcy5wbGF5ZXJzW3BsYXllckluZGV4XTtcblx0XHRcdFx0XHRpZiAocC5pZCAhPT0gdC5pZCAmJiB0Lm9wdGlvbnMucGF1c2VPdGhlclBsYXllcnMgJiYgIXAucGF1c2VkICYmICFwLmVuZGVkKSB7XG5cdFx0XHRcdFx0XHRwLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRwLmhhc0ZvY3VzID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0Ly8gZW5kZWQgZm9yIGFsbFxuXHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcblx0XHRcdFx0aWYgKHQub3B0aW9ucy5hdXRvUmV3aW5kKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHQubWVkaWEuc2V0Q3VycmVudFRpbWUoMCk7XG5cdFx0XHRcdFx0XHQvLyBGaXhpbmcgYW4gQW5kcm9pZCBzdG9jayBicm93c2VyIGJ1Zywgd2hlcmUgXCJzZWVrZWRcIiBpc24ndCBmaXJlZCBjb3JyZWN0bHkgYWZ0ZXIgZW5kaW5nIHRoZSB2aWRlbyBhbmQganVtcGluZyB0byB0aGUgYmVnaW5uaW5nXG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdCQodC5jb250YWluZXIpXG5cdFx0XHRcdFx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1sb2FkaW5nYClcblx0XHRcdFx0XHRcdFx0LnBhcmVudCgpLmhpZGUoKTtcblx0XHRcdFx0XHRcdH0sIDIwKTtcblx0XHRcdFx0XHR9IGNhdGNoIChleHApIHtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0eXBlb2YgdC5tZWRpYS5zdG9wID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dC5tZWRpYS5zdG9wKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dC5tZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHQuc2V0UHJvZ3Jlc3NSYWlsKSB7XG5cdFx0XHRcdFx0dC5zZXRQcm9ncmVzc1JhaWwoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodC5zZXRDdXJyZW50UmFpbCkge1xuXHRcdFx0XHRcdHQuc2V0Q3VycmVudFJhaWwoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMubG9vcCkge1xuXHRcdFx0XHRcdHQucGxheSgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzICYmIHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0dC5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHQvLyByZXNpemUgb24gdGhlIGZpcnN0IHBsYXlcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoKSA9PiB7XG5cblx0XHRcdFx0Y2FsY3VsYXRlVGltZUZvcm1hdCh0LmR1cmF0aW9uLCB0Lm9wdGlvbnMsIHQub3B0aW9ucy5mcmFtZXNQZXJTZWNvbmQgfHwgMjUpO1xuXG5cdFx0XHRcdGlmICh0LnVwZGF0ZUR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0dC51cGRhdGVEdXJhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0LnVwZGF0ZUN1cnJlbnQpIHtcblx0XHRcdFx0XHR0LnVwZGF0ZUN1cnJlbnQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdC5pc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0Ly8gT25seSBjaGFuZ2UgdGhlIHRpbWUgZm9ybWF0IHdoZW4gbmVjZXNzYXJ5XG5cdFx0XHRsZXQgZHVyYXRpb24gPSBudWxsO1xuXHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0XHRpZiAoZHVyYXRpb24gIT09IHRoaXMuZHVyYXRpb24pIHtcblx0XHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cdFx0XHRcdFx0Y2FsY3VsYXRlVGltZUZvcm1hdChkdXJhdGlvbiwgdC5vcHRpb25zLCB0Lm9wdGlvbnMuZnJhbWVzUGVyU2Vjb25kIHx8IDI1KTtcblxuXHRcdFx0XHRcdC8vIG1ha2Ugc3VyZSB0byBmaWxsIGluIGFuZCByZXNpemUgdGhlIGNvbnRyb2xzIChlLmcuLCAwMDowMCA9PiAwMToxMzoxNVxuXHRcdFx0XHRcdGlmICh0LnVwZGF0ZUR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0XHR0LnVwZGF0ZUR1cmF0aW9uKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0LnVwZGF0ZUN1cnJlbnQpIHtcblx0XHRcdFx0XHRcdHQudXBkYXRlQ3VycmVudCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0dC5jb250YWluZXIuZm9jdXNvdXQoKGUpID0+IHtcblx0XHRcdFx0aWYgKGUucmVsYXRlZFRhcmdldCkgeyAvL0ZGIGlzIHdvcmtpbmcgb24gc3VwcG9ydGluZyBmb2N1c291dCBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02ODc3ODdcblx0XHRcdFx0XHRsZXQgJHRhcmdldCA9ICQoZS5yZWxhdGVkVGFyZ2V0KTtcblx0XHRcdFx0XHRpZiAodC5rZXlib2FyZEFjdGlvbiAmJiAkdGFyZ2V0LnBhcmVudHMoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdHQua2V5Ym9hcmRBY3Rpb24gPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlmICh0LmlzVmlkZW8gJiYgIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHRcdFx0dC5oaWRlQ29udHJvbHModHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyB3ZWJraXQgaGFzIHRyb3VibGUgZG9pbmcgdGhpcyB3aXRob3V0IGEgZGVsYXlcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0fSwgNTApO1xuXG5cdFx0XHQvLyBhZGp1c3QgY29udHJvbHMgd2hlbmV2ZXIgd2luZG93IHNpemVzICh1c2VkIHRvIGJlIGluIGZ1bGxzY3JlZW4gb25seSlcblx0XHRcdHQuZ2xvYmFsQmluZCgncmVzaXplJywgKCkgPT4ge1xuXG5cdFx0XHRcdC8vIGRvbid0IHJlc2l6ZSBmb3IgZnVsbHNjcmVlbiBtb2RlXG5cdFx0XHRcdGlmICghKHQuaXNGdWxsU2NyZWVuIHx8IChIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiBkb2N1bWVudC53ZWJraXRJc0Z1bGxTY3JlZW4pKSkge1xuXHRcdFx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBhbHdheXMgYWRqdXN0IGNvbnRyb2xzXG5cdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gRGlzYWJsZSBmb2N1cyBvdXRsaW5lIHRvIGltcHJvdmUgbG9vay1hbmQtZmVlbCBmb3IgcmVndWxhciB1c2Vyc1xuXHRcdFx0dC5nbG9iYWxCaW5kKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGlmICgkKGUudGFyZ2V0KS5pcyhgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1rZXlib2FyZC1pbmFjdGl2ZWApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKS5sZW5ndGgpIHtcblx0XHRcdFx0XHQkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1rZXlib2FyZC1pbmFjdGl2ZWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gRW5hYmxlIGZvY3VzIG91dGxpbmUgZm9yIEFjY2Vzc2liaWxpdHkgcHVycG9zZXNcblx0XHRcdHQuZ2xvYmFsQmluZCgna2V5ZG93bicsIChlKSA9PiB7XG5cdFx0XHRcdGlmICgkKGUudGFyZ2V0KS5pcyhgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1rZXlib2FyZC1pbmFjdGl2ZWApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKS5sZW5ndGgpIHtcblx0XHRcdFx0XHQkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1rZXlib2FyZC1pbmFjdGl2ZWApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVGhpcyBpcyBhIHdvcmstYXJvdW5kIGZvciBhIGJ1ZyBpbiB0aGUgWW91VHViZSBpRnJhbWUgcGxheWVyLCB3aGljaCBtZWFuc1xuXHRcdFx0Ly9cdHdlIGNhbid0IHVzZSB0aGUgcGxheSgpIEFQSSBmb3IgdGhlIGluaXRpYWwgcGxheWJhY2sgb24gaU9TIG9yIEFuZHJvaWQ7XG5cdFx0XHQvL1x0dXNlciBoYXMgdG8gc3RhcnQgcGxheWJhY2sgZGlyZWN0bHkgYnkgdGFwcGluZyBvbiB0aGUgaUZyYW1lLlxuXHRcdFx0aWYgKHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC95b3V0dWJlLykgJiYgKElTX0lPUyB8fCBJU19BTkRST0lEKSkge1xuXHRcdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1wbGF5YCkuaGlkZSgpO1xuXHRcdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cG9zdGVyYCkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZvcmNlIGF1dG9wbGF5IGZvciBIVE1MNVxuXHRcdGlmIChhdXRvcGxheSAmJiBpc05hdGl2ZSkge1xuXHRcdFx0dC5wbGF5KCk7XG5cdFx0fVxuXG5cdFx0aWYgKHQub3B0aW9ucy5zdWNjZXNzKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgdC5vcHRpb25zLnN1Y2Nlc3MgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHdpbmRvd1t0Lm9wdGlvbnMuc3VjY2Vzc10odC5tZWRpYSwgdC5kb21Ob2RlLCB0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQub3B0aW9ucy5zdWNjZXNzKHQubWVkaWEsIHQuZG9tTm9kZSwgdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9oYW5kbGVFcnJvciAoZSkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmICh0LmNvbnRyb2xzKSB7XG5cdFx0XHR0LmRpc2FibGVDb250cm9scygpO1xuXHRcdH1cblxuXHRcdC8vIFRlbGwgdXNlciB0aGF0IHRoZSBmaWxlIGNhbm5vdCBiZSBwbGF5ZWRcblx0XHRpZiAodC5vcHRpb25zLmVycm9yKSB7XG5cdFx0XHR0Lm9wdGlvbnMuZXJyb3IoZSk7XG5cdFx0fVxuXHR9XG5cblx0c2V0UGxheWVyU2l6ZSAod2lkdGgsIGhlaWdodCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGlmICghdC5vcHRpb25zLnNldERpbWVuc2lvbnMpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHdpZHRoICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dC53aWR0aCA9IHdpZHRoO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgaGVpZ2h0ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0dC5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBGQiAhPT0gJ3VuZGVmaW5lZCcgJiYgdC5pc1ZpZGVvKSB7XG5cdFx0XHRGQi5FdmVudC5zdWJzY3JpYmUoJ3hmYm1sLnJlYWR5JywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgdGFyZ2V0ID0gJCh0Lm1lZGlhKS5jaGlsZHJlbignLmZiLXZpZGVvJyk7XG5cblx0XHRcdFx0dC53aWR0aCA9IHRhcmdldC53aWR0aCgpO1xuXHRcdFx0XHR0LmhlaWdodCA9IHRhcmdldC5oZWlnaHQoKTtcblx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCB0YXJnZXQgPSAkKHQubWVkaWEpLmNoaWxkcmVuKCcuZmItdmlkZW8nKTtcblxuXHRcdFx0aWYgKHRhcmdldC5sZW5ndGgpIHtcblx0XHRcdFx0dC53aWR0aCA9IHRhcmdldC53aWR0aCgpO1xuXHRcdFx0XHR0LmhlaWdodCA9IHRhcmdldC5oZWlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBjaGVjayBzdHJldGNoaW5nIG1vZGVzXG5cdFx0c3dpdGNoICh0Lm9wdGlvbnMuc3RyZXRjaGluZykge1xuXHRcdFx0Y2FzZSAnZmlsbCc6XG5cdFx0XHRcdC8vIFRoZSAnZmlsbCcgZWZmZWN0IG9ubHkgbWFrZXMgc2Vuc2Ugb24gdmlkZW87IGZvciBhdWRpbyB3ZSB3aWxsIHNldCB0aGUgZGltZW5zaW9uc1xuXHRcdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0dC5zZXRGaWxsTW9kZSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQuc2V0RGltZW5zaW9ucyh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdyZXNwb25zaXZlJzpcblx0XHRcdFx0dC5zZXRSZXNwb25zaXZlTW9kZSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ25vbmUnOlxuXHRcdFx0XHR0LnNldERpbWVuc2lvbnModC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdC8vIFRoaXMgaXMgdGhlICdhdXRvJyBtb2RlXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRpZiAodC5oYXNGbHVpZE1vZGUoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHQuc2V0UmVzcG9uc2l2ZU1vZGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0LnNldERpbWVuc2lvbnModC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGhhc0ZsdWlkTW9kZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gZGV0ZWN0IDEwMCUgbW9kZSAtIHVzZSBjdXJyZW50U3R5bGUgZm9yIElFIHNpbmNlIGNzcygpIGRvZXNuJ3QgcmV0dXJuIHBlcmNlbnRhZ2VzXG5cdFx0cmV0dXJuICh0LmhlaWdodC50b1N0cmluZygpLmluY2x1ZGVzKCclJykgfHwgKHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnKSAhPT0gJ25vbmUnICYmIHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnKSAhPT0gdC53aWR0aCkgfHwgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlICYmIHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heFdpZHRoID09PSAnMTAwJScpKTtcblx0fVxuXG5cdHNldFJlc3BvbnNpdmVNb2RlICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBkbyB3ZSBoYXZlIHRoZSBuYXRpdmUgZGltZW5zaW9ucyB5ZXQ/XG5cdFx0bGV0IG5hdGl2ZVdpZHRoID0gKCgpID0+IHtcblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdFx0aWYgKHQubWVkaWEudmlkZW9XaWR0aCAmJiB0Lm1lZGlhLnZpZGVvV2lkdGggPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSkge1xuXHRcdFx0XHRcdHJldHVybiB0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnd2lkdGgnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5vcHRpb25zLmRlZmF1bHRWaWRlb1dpZHRoO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdC5vcHRpb25zLmRlZmF1bHRBdWRpb1dpZHRoO1xuXHRcdFx0fVxuXHRcdH0pKCk7XG5cblx0XHRsZXQgbmF0aXZlSGVpZ2h0ID0gKCgpID0+IHtcblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdFx0aWYgKHQubWVkaWEudmlkZW9IZWlnaHQgJiYgdC5tZWRpYS52aWRlb0hlaWdodCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5tZWRpYS52aWRlb0hlaWdodDtcblx0XHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0Lm9wdGlvbnMuZGVmYXVsdFZpZGVvSGVpZ2h0O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdC5vcHRpb25zLmRlZmF1bHRBdWRpb0hlaWdodDtcblx0XHRcdH1cblx0XHR9KSgpO1xuXG5cdFx0Ly8gVXNlIG1lZGlhIGFzcGVjdCByYXRpbyBpZiByZWNlaXZlZDsgb3RoZXJ3aXNlLCB0aGUgaW5pdGlhbGx5IHN0b3JlZCBpbml0aWFsIGFzcGVjdCByYXRpb1xuXHRcdGxldFxuXHRcdFx0YXNwZWN0UmF0aW8gPSAoKCkgPT4ge1xuXHRcdFx0XHRsZXQgcmF0aW8gPSAxO1xuXHRcdFx0XHRpZiAoIXQuaXNWaWRlbykge1xuXHRcdFx0XHRcdHJldHVybiByYXRpbztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0Lm1lZGlhLnZpZGVvV2lkdGggJiYgdC5tZWRpYS52aWRlb1dpZHRoID4gMCAmJiB0Lm1lZGlhLnZpZGVvSGVpZ2h0ICYmIHQubWVkaWEudmlkZW9IZWlnaHQgPiAwKSB7XG5cdFx0XHRcdFx0cmF0aW8gPSAodC5oZWlnaHQgPj0gdC53aWR0aCkgPyB0Lm1lZGlhLnZpZGVvV2lkdGggLyB0Lm1lZGlhLnZpZGVvSGVpZ2h0IDogdC5tZWRpYS52aWRlb0hlaWdodCAvIHQubWVkaWEudmlkZW9XaWR0aDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyYXRpbyA9IHQuaW5pdGlhbEFzcGVjdFJhdGlvO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzTmFOKHJhdGlvKSB8fCByYXRpbyA8IDAuMDEgfHwgcmF0aW8gPiAxMDApIHtcblx0XHRcdFx0XHRyYXRpbyA9IDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmF0aW87XG5cdFx0XHR9KSgpLFxuXHRcdFx0cGFyZW50V2lkdGggPSB0LmNvbnRhaW5lci5wYXJlbnQoKS5jbG9zZXN0KCc6dmlzaWJsZScpLndpZHRoKCksXG5cdFx0XHRwYXJlbnRIZWlnaHQgPSB0LmNvbnRhaW5lci5wYXJlbnQoKS5jbG9zZXN0KCc6dmlzaWJsZScpLmhlaWdodCgpLFxuXHRcdFx0bmV3SGVpZ2h0O1xuXG5cdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0Ly8gUmVzcG9uc2l2ZSB2aWRlbyBpcyBiYXNlZCBvbiB3aWR0aDogMTAwJSBhbmQgaGVpZ2h0OiAxMDAlXG5cdFx0XHRpZiAodC5oZWlnaHQgPT09ICcxMDAlJykge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSBwYXJzZUludChwYXJlbnRXaWR0aCAqIG5hdGl2ZUhlaWdodCAvIG5hdGl2ZVdpZHRoLCAxMCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXdIZWlnaHQgPSB0LmhlaWdodCA+PSB0LndpZHRoID8gcGFyc2VJbnQocGFyZW50V2lkdGggLyBhc3BlY3RSYXRpbywgMTApIDogcGFyc2VJbnQocGFyZW50V2lkdGggKiBhc3BlY3RSYXRpbywgMTApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXdIZWlnaHQgPSBuYXRpdmVIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgd2Ugd2VyZSB1bmFibGUgdG8gY29tcHV0ZSBuZXdIZWlnaHQsIGdldCB0aGUgY29udGFpbmVyIGhlaWdodCBpbnN0ZWFkXG5cdFx0aWYgKGlzTmFOKG5ld0hlaWdodCkpIHtcblx0XHRcdG5ld0hlaWdodCA9IHBhcmVudEhlaWdodDtcblx0XHR9XG5cblx0XHRpZiAodC5jb250YWluZXIucGFyZW50KCkubGVuZ3RoID4gMCAmJiB0LmNvbnRhaW5lci5wYXJlbnQoKVswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdib2R5JykgeyAvLyAmJiB0LmNvbnRhaW5lci5zaWJsaW5ncygpLmNvdW50ID09IDApIHtcblx0XHRcdHBhcmVudFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHRuZXdIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0aWYgKG5ld0hlaWdodCAmJiBwYXJlbnRXaWR0aCkge1xuXG5cdFx0XHQvLyBzZXQgb3V0ZXIgY29udGFpbmVyIHNpemVcblx0XHRcdHQuY29udGFpbmVyXG5cdFx0XHQud2lkdGgocGFyZW50V2lkdGgpXG5cdFx0XHQuaGVpZ2h0KG5ld0hlaWdodCk7XG5cblx0XHRcdC8vIHNldCBuYXRpdmUgPHZpZGVvPiBvciA8YXVkaW8+IGFuZCBzaGltc1xuXHRcdFx0dC4kbWVkaWFcblx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cblx0XHRcdC8vIGlmIHNoaW0gaXMgcmVhZHksIHNlbmQgdGhlIHNpemUgdG8gdGhlIGVtYmVkZGVkIHBsdWdpblxuXHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0XHRpZiAodC5tZWRpYS5zZXRTaXplKSB7XG5cdFx0XHRcdFx0dC5tZWRpYS5zZXRTaXplKHBhcmVudFdpZHRoLCBuZXdIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCB0aGUgbGF5ZXJzXG5cdFx0XHR0LmxheWVycy5jaGlsZHJlbihgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyYClcblx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cdFx0fVxuXHR9XG5cblx0c2V0RmlsbE1vZGUgKCkge1xuXHRcdGxldCB0ID0gdGhpcyxcblx0XHRcdHBhcmVudCA9IHQub3V0ZXJDb250YWluZXI7XG5cblx0XHQvLyBSZW1vdmUgdGhlIHJlc3BvbnNpdmUgYXR0cmlidXRlcyBpbiB0aGUgZXZlbnQgdGhleSBhcmUgdGhlcmVcblx0XHRpZiAodC4kbm9kZS5jc3MoJ2hlaWdodCcpICE9PSAnbm9uZScgJiYgdC4kbm9kZS5jc3MoJ2hlaWdodCcpICE9PSB0LmhlaWdodCkge1xuXHRcdFx0dC4kbm9kZS5jc3MoJ2hlaWdodCcsICcnKTtcblx0XHR9XG5cdFx0aWYgKHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnKSAhPT0gJ25vbmUnICYmIHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnKSAhPT0gdC53aWR0aCkge1xuXHRcdFx0dC4kbm9kZS5jc3MoJ21heC13aWR0aCcsICcnKTtcblx0XHR9XG5cblx0XHRpZiAodC4kbm9kZS5jc3MoJ21heC1oZWlnaHQnKSAhPT0gJ25vbmUnICYmIHQuJG5vZGUuY3NzKCdtYXgtaGVpZ2h0JykgIT09IHQuaGVpZ2h0KSB7XG5cdFx0XHR0LiRub2RlLmNzcygnbWF4LWhlaWdodCcsICcnKTtcblx0XHR9XG5cblx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUpIHtcblx0XHRcdGlmICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5oZWlnaHQgPT09ICcxMDAlJykge1xuXHRcdFx0XHR0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5oZWlnaHQgPSAnJztcblx0XHRcdH1cblx0XHRcdGlmICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhXaWR0aCA9PT0gJzEwMCUnKSB7XG5cdFx0XHRcdHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heFdpZHRoID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4SGVpZ2h0ID09PSAnMTAwJScpIHtcblx0XHRcdFx0dC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4SGVpZ2h0ID0gJyc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCFwYXJlbnQud2lkdGgoKSkge1xuXHRcdFx0cGFyZW50LmhlaWdodCh0LiRtZWRpYS53aWR0aCgpKTtcblx0XHR9XG5cblx0XHRpZiAoIXBhcmVudC5oZWlnaHQoKSkge1xuXHRcdFx0cGFyZW50LmhlaWdodCh0LiRtZWRpYS5oZWlnaHQoKSk7XG5cdFx0fVxuXG5cdFx0bGV0IHBhcmVudFdpZHRoID0gcGFyZW50LndpZHRoKCksXG5cdFx0XHRwYXJlbnRIZWlnaHQgPSBwYXJlbnQuaGVpZ2h0KCk7XG5cblx0XHR0LnNldERpbWVuc2lvbnMoJzEwMCUnLCAnMTAwJScpO1xuXG5cdFx0Ly8gVGhpcyBwcmV2ZW50cyBhbiBpc3N1ZSB3aGVuIGRpc3BsYXlpbmcgcG9zdGVyXG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlciBpbWdgKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSBuZXcgd2lkdGggYW5kIGhlaWdodFxuXHRcdGxldFxuXHRcdFx0dGFyZ2V0RWxlbWVudCA9IHQuY29udGFpbmVyLmZpbmQoJ29iamVjdCwgZW1iZWQsIGlmcmFtZSwgdmlkZW8nKSxcblx0XHRcdGluaXRIZWlnaHQgPSB0LmhlaWdodCxcblx0XHRcdGluaXRXaWR0aCA9IHQud2lkdGgsXG5cdFx0XHQvLyBzY2FsZSB0byB0aGUgdGFyZ2V0IHdpZHRoXG5cdFx0XHRzY2FsZVgxID0gcGFyZW50V2lkdGgsXG5cdFx0XHRzY2FsZVkxID0gKGluaXRIZWlnaHQgKiBwYXJlbnRXaWR0aCkgLyBpbml0V2lkdGgsXG5cdFx0XHQvLyBzY2FsZSB0byB0aGUgdGFyZ2V0IGhlaWdodFxuXHRcdFx0c2NhbGVYMiA9IChpbml0V2lkdGggKiBwYXJlbnRIZWlnaHQpIC8gaW5pdEhlaWdodCxcblx0XHRcdHNjYWxlWTIgPSBwYXJlbnRIZWlnaHQsXG5cdFx0XHQvLyBub3cgZmlndXJlIG91dCB3aGljaCBvbmUgd2Ugc2hvdWxkIHVzZVxuXHRcdFx0YlNjYWxlT25XaWR0aCA9IHNjYWxlWDIgPiBwYXJlbnRXaWR0aCA9PT0gZmFsc2UsXG5cdFx0XHRmaW5hbFdpZHRoID0gYlNjYWxlT25XaWR0aCA/IE1hdGguZmxvb3Ioc2NhbGVYMSkgOiBNYXRoLmZsb29yKHNjYWxlWDIpLFxuXHRcdFx0ZmluYWxIZWlnaHQgPSBiU2NhbGVPbldpZHRoID8gTWF0aC5mbG9vcihzY2FsZVkxKSA6IE1hdGguZmxvb3Ioc2NhbGVZMik7XG5cblx0XHRpZiAoYlNjYWxlT25XaWR0aCkge1xuXHRcdFx0dGFyZ2V0RWxlbWVudC5oZWlnaHQoZmluYWxIZWlnaHQpLndpZHRoKHBhcmVudFdpZHRoKTtcblx0XHRcdGlmICh0Lm1lZGlhLnNldFNpemUpIHtcblx0XHRcdFx0dC5tZWRpYS5zZXRTaXplKHBhcmVudFdpZHRoLCBmaW5hbEhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldEVsZW1lbnQuaGVpZ2h0KHBhcmVudEhlaWdodCkud2lkdGgoZmluYWxXaWR0aCk7XG5cdFx0XHRpZiAodC5tZWRpYS5zZXRTaXplKSB7XG5cdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShmaW5hbFdpZHRoLCBwYXJlbnRIZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRhcmdldEVsZW1lbnQuY3NzKHtcblx0XHRcdCdtYXJnaW4tbGVmdCc6IE1hdGguZmxvb3IoKHBhcmVudFdpZHRoIC0gZmluYWxXaWR0aCkgLyAyKSxcblx0XHRcdCdtYXJnaW4tdG9wJzogMFxuXHRcdH0pO1xuXHR9XG5cblx0c2V0RGltZW5zaW9ucyAod2lkdGgsIGhlaWdodCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuY29udGFpbmVyXG5cdFx0LndpZHRoKHdpZHRoKVxuXHRcdC5oZWlnaHQoaGVpZ2h0KTtcblxuXHRcdHQubGF5ZXJzLmNoaWxkcmVuKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJgKVxuXHRcdC53aWR0aCh3aWR0aClcblx0XHQuaGVpZ2h0KGhlaWdodCk7XG5cdH1cblxuXHRzZXRDb250cm9sc1NpemUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIHNraXAgY2FsY3VsYXRpb24gaWYgaGlkZGVuXG5cdFx0aWYgKCF0LmNvbnRhaW5lci5pcygnOnZpc2libGUnKSB8fCAhdC5yYWlsIHx8ICF0LnJhaWwubGVuZ3RoIHx8ICF0LnJhaWwuaXMoJzp2aXNpYmxlJykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHJhaWxNYXJnaW4gPSBwYXJzZUZsb2F0KHQucmFpbC5jc3MoJ21hcmdpbi1sZWZ0JykpICsgcGFyc2VGbG9hdCh0LnJhaWwuY3NzKCdtYXJnaW4tcmlnaHQnKSksXG5cdFx0XHR0b3RhbE1hcmdpbiA9IHBhcnNlRmxvYXQodC50b3RhbC5jc3MoJ21hcmdpbi1sZWZ0JykpICsgcGFyc2VGbG9hdCh0LnRvdGFsLmNzcygnbWFyZ2luLXJpZ2h0JykpIHx8IDAsXG5cdFx0XHRzaWJsaW5nc1dpZHRoID0gMFxuXHRcdDtcblxuXHRcdHQucmFpbC5zaWJsaW5ncygpLmVhY2goKGluZGV4LCBvYmplY3QpID0+IHtcblx0XHRcdHNpYmxpbmdzV2lkdGggKz0gcGFyc2VGbG9hdCgkKG9iamVjdCkub3V0ZXJXaWR0aCh0cnVlKSk7XG5cdFx0fSk7XG5cblx0XHRzaWJsaW5nc1dpZHRoICs9IHRvdGFsTWFyZ2luICsgcmFpbE1hcmdpbiArIDE7XG5cblx0XHQvLyBTdWJzdHJhY3QgdGhlIHdpZHRoIG9mIHRoZSBmZWF0dXJlIHNpYmxpbmdzIGZyb20gdGltZSByYWlsXG5cdFx0dC5yYWlsLndpZHRoKHQuY29udHJvbHMud2lkdGgoKSAtIHNpYmxpbmdzV2lkdGgpO1xuXG5cdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNyZXNpemUnKTtcblx0fVxuXG5cdHJlc2V0U2l6ZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdC8vIHdlYmtpdCBoYXMgdHJvdWJsZSBkb2luZyB0aGlzIHdpdGhvdXQgYSBkZWxheVxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0fSwgNTApO1xuXHR9XG5cblx0c2V0UG9zdGVyICh1cmwpIHtcblx0XHRsZXQgdCA9IHRoaXMsXG5cdFx0XHRwb3N0ZXJEaXYgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cG9zdGVyYCksXG5cdFx0XHRwb3N0ZXJJbWcgPSBwb3N0ZXJEaXYuZmluZCgnaW1nJyk7XG5cblx0XHRpZiAocG9zdGVySW1nLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cG9zdGVySW1nID0gJChgPGltZyBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3Rlci1pbWdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgYWx0PVwiXCIgLz5gKVxuXHRcdFx0LmFwcGVuZFRvKHBvc3RlckRpdik7XG5cdFx0fVxuXG5cdFx0cG9zdGVySW1nLmF0dHIoJ3NyYycsIHVybCk7XG5cdFx0cG9zdGVyRGl2LmNzcyh7J2JhY2tncm91bmQtaW1hZ2UnOiBgdXJsKFwiJHt1cmx9XCIpYH0pO1xuXHR9XG5cblx0Y2hhbmdlU2tpbiAoY2xhc3NOYW1lKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jb250YWluZXJbMF0uY2xhc3NOYW1lID0gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lciAke2NsYXNzTmFtZX1gO1xuXHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0fVxuXG5cdGdsb2JhbEJpbmQgKGV2ZW50cywgZGF0YSwgY2FsbGJhY2spIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0ZG9jID0gdC5ub2RlID8gdC5ub2RlLm93bmVyRG9jdW1lbnQgOiBkb2N1bWVudFxuXHRcdDtcblxuXHRcdGV2ZW50cyA9IHNwbGl0RXZlbnRzKGV2ZW50cywgdC5pZCk7XG5cdFx0aWYgKGV2ZW50cy5kKSB7XG5cdFx0XHQkKGRvYykub24oZXZlbnRzLmQsIGRhdGEsIGNhbGxiYWNrKTtcblx0XHR9XG5cdFx0aWYgKGV2ZW50cy53KSB7XG5cdFx0XHQkKHdpbmRvdykub24oZXZlbnRzLncsIGRhdGEsIGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cblxuXHRnbG9iYWxVbmJpbmQgKGV2ZW50cywgY2FsbGJhY2spIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRkb2MgPSB0Lm5vZGUgPyB0Lm5vZGUub3duZXJEb2N1bWVudCA6IGRvY3VtZW50XG5cdFx0O1xuXG5cdFx0ZXZlbnRzID0gc3BsaXRFdmVudHMoZXZlbnRzLCB0LmlkKTtcblx0XHRpZiAoZXZlbnRzLmQpIHtcblx0XHRcdCQoZG9jKS5vZmYoZXZlbnRzLmQsIGNhbGxiYWNrKTtcblx0XHR9XG5cdFx0aWYgKGV2ZW50cy53KSB7XG5cdFx0XHQkKHdpbmRvdykub2ZmKGV2ZW50cy53LCBjYWxsYmFjayk7XG5cdFx0fVxuXHR9XG5cblx0YnVpbGRwb3N0ZXIgKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRwb3N0ZXIgPSAkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cG9zdGVyICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+PC9kaXY+YCkuYXBwZW5kVG8obGF5ZXJzKSxcblx0XHRcdHBvc3RlclVybCA9IHBsYXllci4kbWVkaWEuYXR0cigncG9zdGVyJylcblx0XHQ7XG5cblx0XHQvLyBwcmlvcml0eSBnb2VzIHRvIG9wdGlvbiAodGhpcyBpcyB1c2VmdWwgaWYgeW91IG5lZWQgdG8gc3VwcG9ydCBpT1MgMy54IChpT1MgY29tcGxldGVseSBmYWlscyB3aXRoIHBvc3Rlcilcblx0XHRpZiAocGxheWVyLm9wdGlvbnMucG9zdGVyICE9PSAnJykge1xuXHRcdFx0cG9zdGVyVXJsID0gcGxheWVyLm9wdGlvbnMucG9zdGVyO1xuXHRcdH1cblxuXHRcdC8vIHNlY29uZCwgdHJ5IHRoZSByZWFsIHBvc3RlclxuXHRcdGlmIChwb3N0ZXJVcmwpIHtcblx0XHRcdHQuc2V0UG9zdGVyKHBvc3RlclVybCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBvc3Rlci5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdHBvc3Rlci5oaWRlKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnNob3dQb3N0ZXJXaGVuRW5kZWQgJiYgcGxheWVyLm9wdGlvbnMuYXV0b1Jld2luZCkge1xuXHRcdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdHBvc3Rlci5zaG93KCk7XG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0YnVpbGRvdmVybGF5cyAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkge1xuXG5cdFx0aWYgKCFwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRsb2FkaW5nID1cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXkgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJcIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktbG9hZGluZ1wiPmAgK1xuXHRcdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1sb2FkaW5nLWJnLWltZ1wiPjwvc3Bhbj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuaGlkZSgpIC8vIHN0YXJ0IG91dCBoaWRkZW5cblx0XHRcdFx0LmFwcGVuZFRvKGxheWVycyksXG5cdFx0XHRlcnJvciA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5ICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWVycm9yXCI+PC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuaGlkZSgpIC8vIHN0YXJ0IG91dCBoaWRkZW5cblx0XHRcdFx0LmFwcGVuZFRvKGxheWVycyksXG5cdFx0XHQvLyB0aGlzIG5lZWRzIHRvIGNvbWUgbGFzdCBzbyBpdCdzIG9uIHRvcFxuXHRcdFx0YmlnUGxheSA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5ICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktcGxheVwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1idXR0b25cIiByb2xlPVwiYnV0dG9uXCIgYCArXG5cdFx0XHRcdFx0XHRgYXJpYS1sYWJlbD1cIiR7aTE4bi50KCdtZWpzLnBsYXknKX1cIiBhcmlhLXByZXNzZWQ9XCJmYWxzZVwiPmAgK1xuXHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhsYXllcnMpXG5cdFx0XHRcdC5vbignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlZCAndG91Y2hzdGFydCcgZHVlIGlzc3VlcyBvbiBTYW1zdW5nIEFuZHJvaWQgZGV2aWNlcyB3aGVyZSBhIHRhcCBvbiBiaWdQbGF5XG5cdFx0XHRcdFx0Ly8gc3RhcnRlZCBhbmQgaW1tZWRpYXRlbHkgc3RvcHBlZCB0aGUgdmlkZW9cblx0XHRcdFx0XHRpZiAodC5vcHRpb25zLmNsaWNrVG9QbGF5UGF1c2UpIHtcblxuXHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbiA9IHQuJG1lZGlhLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKVxuXHRcdFx0XHRcdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktYnV0dG9uYCksXG5cdFx0XHRcdFx0XHRcdHByZXNzZWQgPSBidXR0b24uYXR0cignYXJpYS1wcmVzc2VkJylcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRidXR0b24uYXR0cignYXJpYS1wcmVzc2VkJywgISFwcmVzc2VkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0Ly8gaWYgKHQub3B0aW9ucy5zdXBwb3J0VlIgfHwgKHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8oeW91dHViZXxmYWNlYm9vaykvKSkpIHtcblx0XHRpZiAodC5tZWRpYS5yZW5kZXJlck5hbWUgIT09IG51bGwgJiYgdC5tZWRpYS5yZW5kZXJlck5hbWUubWF0Y2goLyh5b3V0dWJlfGZhY2Vib29rKS8pKSB7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHR9XG5cblx0XHQvLyBzaG93L2hpZGUgYmlnIHBsYXkgYnV0dG9uXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdGJpZ1BsYXkuaGlkZSgpO1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5oaWRlKCk7XG5cdFx0XHRlcnJvci5oaWRlKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsICgpID0+IHtcblx0XHRcdGJpZ1BsYXkuaGlkZSgpO1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5oaWRlKCk7XG5cdFx0XHRlcnJvci5oaWRlKCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignc2Vla2luZycsICgpID0+IHtcblx0XHRcdGxvYWRpbmcuc2hvdygpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuc2hvdygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3NlZWtlZCcsICgpID0+IHtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgKCkgPT4ge1xuXHRcdFx0YmlnUGxheS5zaG93KCk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignd2FpdGluZycsICgpID0+IHtcblx0XHRcdGxvYWRpbmcuc2hvdygpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuc2hvdygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXG5cdFx0Ly8gc2hvdy9oaWRlIGxvYWRpbmdcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgKCkgPT4ge1xuXHRcdFx0Ly8gZm9yIHNvbWUgcmVhc29uIENocm9tZSBpcyBmaXJpbmcgdGhpcyBldmVudFxuXHRcdFx0Ly9pZiAobWVqcy5NZWRpYUZlYXR1cmVzLmlzQ2hyb21lICYmIG1lZGlhLmdldEF0dHJpYnV0ZSAmJiBtZWRpYS5nZXRBdHRyaWJ1dGUoJ3ByZWxvYWQnKSA9PT0gJ25vbmUnKVxuXHRcdFx0Ly9cdHJldHVybjtcblxuXHRcdFx0bG9hZGluZy5zaG93KCk7XG5cdFx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5zaG93KCk7XG5cdFx0XHQvLyBGaXJpbmcgdGhlICdjYW5wbGF5JyBldmVudCBhZnRlciBhIHRpbWVvdXQgd2hpY2ggaXNuJ3QgZ2V0dGluZyBmaXJlZCBvbiBzb21lIEFuZHJvaWQgNC4xIGRldmljZXNcblx0XHRcdC8vIChodHRwczovL2dpdGh1Yi5jb20vam9obmR5ZXIvbWVkaWFlbGVtZW50L2lzc3Vlcy8xMzA1KVxuXHRcdFx0aWYgKElTX0FORFJPSUQpIHtcblx0XHRcdFx0bWVkaWEuY2FucGxheVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChcblx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0XHRcdGV2dC5pbml0RXZlbnQoJ2NhbnBsYXknLCB0cnVlLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG1lZGlhLmRpc3BhdGNoRXZlbnQoZXZ0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAzMDBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsICgpID0+IHtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdFx0Ly8gQ2xlYXIgdGltZW91dCBpbnNpZGUgJ2xvYWRlZGRhdGEnIHRvIHByZXZlbnQgJ2NhbnBsYXknIGZyb20gZmlyaW5nIHR3aWNlXG5cdFx0XHRjbGVhclRpbWVvdXQobWVkaWEuY2FucGxheVRpbWVvdXQpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdC8vIGVycm9yIGhhbmRsaW5nXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZSkgPT4ge1xuXHRcdFx0dC5faGFuZGxlRXJyb3IoZSk7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGJpZ1BsYXkuaGlkZSgpO1xuXHRcdFx0ZXJyb3Iuc2hvdygpO1xuXHRcdFx0ZXJyb3IuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktZXJyb3JgKS5odG1sKGUubWVzc2FnZSk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG5cdFx0XHR0Lm9ua2V5ZG93bihwbGF5ZXIsIG1lZGlhLCBlKTtcblx0XHR9LCBmYWxzZSk7XG5cdH1cblxuXHRidWlsZGtleWJvYXJkIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmNvbnRhaW5lci5rZXlkb3duKCgpID0+IHtcblx0XHRcdHQua2V5Ym9hcmRBY3Rpb24gPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0Ly8gbGlzdGVuIGZvciBrZXkgcHJlc3Nlc1xuXHRcdHQuZ2xvYmFsQmluZCgna2V5ZG93bicsIChldmVudCkgPT4ge1xuXHRcdFx0bGV0ICRjb250YWluZXIgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApO1xuXHRcdFx0cGxheWVyLmhhc0ZvY3VzID0gJGNvbnRhaW5lci5sZW5ndGggIT09IDAgJiZcblx0XHRcdFx0JGNvbnRhaW5lci5hdHRyKCdpZCcpID09PSBwbGF5ZXIuJG1lZGlhLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKS5hdHRyKCdpZCcpO1xuXHRcdFx0cmV0dXJuIHQub25rZXlkb3duKHBsYXllciwgbWVkaWEsIGV2ZW50KTtcblx0XHR9KTtcblxuXG5cdFx0Ly8gY2hlY2sgaWYgc29tZW9uZSBjbGlja2VkIG91dHNpZGUgYSBwbGF5ZXIgcmVnaW9uLCB0aGVuIGtpbGwgaXRzIGZvY3VzXG5cdFx0dC5nbG9iYWxCaW5kKCdjbGljaycsIChldmVudCkgPT4ge1xuXHRcdFx0cGxheWVyLmhhc0ZvY3VzID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKS5sZW5ndGggIT09IDA7XG5cdFx0fSk7XG5cblx0fVxuXG5cdG9ua2V5ZG93biAocGxheWVyLCBtZWRpYSwgZSkge1xuXG5cdFx0aWYgKHBsYXllci5oYXNGb2N1cyAmJiBwbGF5ZXIub3B0aW9ucy5lbmFibGVLZXlib2FyZCkge1xuXHRcdFx0Ly8gZmluZCBhIG1hdGNoaW5nIGtleVxuXHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gcGxheWVyLm9wdGlvbnMua2V5QWN0aW9ucy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBrZXlBY3Rpb24gPSBwbGF5ZXIub3B0aW9ucy5rZXlBY3Rpb25zW2ldO1xuXG5cdFx0XHRcdGZvciAobGV0IGogPSAwLCBqbCA9IGtleUFjdGlvbi5rZXlzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcblx0XHRcdFx0XHRpZiAoZS5rZXlDb2RlID09PSBrZXlBY3Rpb24ua2V5c1tqXSkge1xuXHRcdFx0XHRcdFx0a2V5QWN0aW9uLmFjdGlvbihwbGF5ZXIsIG1lZGlhLCBlLmtleUNvZGUsIGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGxheSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gb25seSBsb2FkIGlmIHRoZSBjdXJyZW50IHRpbWUgaXMgMCB0byBlbnN1cmUgcHJvcGVyIHBsYXlpbmdcblx0XHRpZiAodC5tZWRpYS5nZXRDdXJyZW50VGltZSgpIDw9IDApIHtcblx0XHRcdHQubG9hZCgpO1xuXHRcdH1cblx0XHR0Lm1lZGlhLnBsYXkoKTtcblx0fVxuXG5cdHBhdXNlICgpIHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5tZWRpYS5wYXVzZSgpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHR9XG5cdH1cblxuXHRsb2FkICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAoIXQuaXNMb2FkZWQpIHtcblx0XHRcdHQubWVkaWEubG9hZCgpO1xuXHRcdH1cblxuXHRcdHQuaXNMb2FkZWQgPSB0cnVlO1xuXHR9XG5cblx0c2V0TXV0ZWQgKG11dGVkKSB7XG5cdFx0dGhpcy5tZWRpYS5zZXRNdXRlZChtdXRlZCk7XG5cdH1cblxuXHRzZXRDdXJyZW50VGltZSAodGltZSkge1xuXHRcdHRoaXMubWVkaWEuc2V0Q3VycmVudFRpbWUodGltZSk7XG5cdH1cblxuXHRnZXRDdXJyZW50VGltZSAoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWVkaWEuY3VycmVudFRpbWU7XG5cdH1cblxuXHRzZXRWb2x1bWUgKHZvbHVtZSkge1xuXHRcdHRoaXMubWVkaWEuc2V0Vm9sdW1lKHZvbHVtZSk7XG5cdH1cblxuXHRnZXRWb2x1bWUgKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLnZvbHVtZTtcblx0fVxuXG5cdHNldFNyYyAoc3JjKSB7XG5cdFx0dGhpcy5tZWRpYS5zZXRTcmMoc3JjKTtcblx0fVxuXG5cdHJlbW92ZSAoKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0cmVuZGVyZXJOYW1lID0gdC5tZWRpYS5yZW5kZXJlck5hbWVcblx0XHQ7XG5cblx0XHQvLyBpbnZva2UgZmVhdHVyZXMgY2xlYW51cFxuXHRcdGZvciAobGV0IGZlYXR1cmVJbmRleCBpbiB0Lm9wdGlvbnMuZmVhdHVyZXMpIHtcblx0XHRcdGxldCBmZWF0dXJlID0gdC5vcHRpb25zLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG5cdFx0XHRpZiAodFtgY2xlYW4ke2ZlYXR1cmV9YF0pIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR0W2BjbGVhbiR7ZmVhdHVyZX1gXSh0KTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdC8vIEB0b2RvOiByZXBvcnQgY29udHJvbCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGVycm9yIGNsZWFuaW5nICR7ZmVhdHVyZX1gLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJlc2V0IGRpbWVuc2lvbnNcblx0XHR0LiRub2RlLmNzcyh7XG5cdFx0XHR3aWR0aDogdC4kbm9kZS5hdHRyKCd3aWR0aCcpIHx8ICdhdXRvJyxcblx0XHRcdGhlaWdodDogdC4kbm9kZS5hdHRyKCdoZWlnaHQnKSB8fCAnYXV0bydcblx0XHR9KTtcblxuXHRcdC8vIGdyYWIgdmlkZW8gYW5kIHB1dCBpdCBiYWNrIGluIHBsYWNlXG5cdFx0aWYgKCF0LmlzRHluYW1pYykge1xuXHRcdFx0dC4kbWVkaWEucHJvcCgnY29udHJvbHMnLCB0cnVlKTtcblx0XHRcdC8vIGRldGFjaCBldmVudHMgZnJvbSB0aGUgdmlkZW9cblx0XHRcdC8vIEB0b2RvOiBkZXRhY2ggZXZlbnQgbGlzdGVuZXJzIGJldHRlciB0aGFuIHRoaXM7IGFsc28gZGV0YWNoIE9OTFkgdGhlIGV2ZW50cyBhdHRhY2hlZCBieSB0aGlzIHBsdWdpbiFcblx0XHRcdHQuJG5vZGUuYXR0cignaWQnLCB0LiRub2RlLmF0dHIoJ2lkJykucmVwbGFjZShgXyR7cmVuZGVyZXJOYW1lfWAsICcnKSk7XG5cdFx0XHR0LiRub2RlLmNsb25lKCkuaW5zZXJ0QmVmb3JlKHQuY29udGFpbmVyKS5zaG93KCk7XG5cdFx0XHR0LiRub2RlLnJlbW92ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0LiRub2RlLmluc2VydEJlZm9yZSh0LmNvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0dC5tZWRpYS5yZW1vdmUoKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgcGxheWVyIGZyb20gdGhlIG1lanMucGxheWVycyBvYmplY3Qgc28gdGhhdCBwYXVzZU90aGVyUGxheWVycyBkb2Vzbid0IGJsb3cgdXAgd2hlbiB0cnlpbmcgdG9cblx0XHQvLyBwYXVzZSBhIG5vbiBleGlzdGVudCBGbGFzaCBBUEkuXG5cdFx0ZGVsZXRlIG1lanMucGxheWVyc1t0LmlkXTtcblxuXHRcdGlmICh0eXBlb2YgdC5jb250YWluZXIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHR0LmNvbnRhaW5lci5wcmV2KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCkucmVtb3ZlKCk7XG5cdFx0XHR0LmNvbnRhaW5lci5yZW1vdmUoKTtcblx0XHR9XG5cdFx0dC5nbG9iYWxVbmJpbmQoKTtcblx0XHRkZWxldGUgdC5ub2RlLnBsYXllcjtcblx0fVxufVxuXG53aW5kb3cuTWVkaWFFbGVtZW50UGxheWVyID0gTWVkaWFFbGVtZW50UGxheWVyO1xuXG5leHBvcnQgZGVmYXVsdCBNZWRpYUVsZW1lbnRQbGF5ZXI7XG5cbi8vIHR1cm4gaW50byBwbHVnaW5cbigoJCkgPT4ge1xuXG5cdGlmICh0eXBlb2YgJCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQkLmZuLm1lZGlhZWxlbWVudHBsYXllciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0XHRpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRsZXQgcGxheWVyID0gJCh0aGlzKS5kYXRhKCdtZWRpYWVsZW1lbnRwbGF5ZXInKTtcblx0XHRcdFx0XHRpZiAocGxheWVyKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQodGhpcykucmVtb3ZlRGF0YSgnbWVkaWFlbGVtZW50cGxheWVyJyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdtZWRpYWVsZW1lbnRwbGF5ZXInLCBuZXcgTWVkaWFFbGVtZW50UGxheWVyKHRoaXMsIG9wdGlvbnMpKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0JChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHRcdFx0Ly8gYXV0byBlbmFibGUgdXNpbmcgSlNPTiBhdHRyaWJ1dGVcblx0XHRcdCQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH1wbGF5ZXJgKS5tZWRpYWVsZW1lbnRwbGF5ZXIoKTtcblx0XHR9KTtcblx0fVxuXG59KShtZWpzLiQpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuZXhwb3J0IGNvbnN0IE5BViA9IHdpbmRvdy5uYXZpZ2F0b3I7XG5leHBvcnQgY29uc3QgVUEgPSBOQVYudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbmV4cG9ydCBjb25zdCBJU19JUEFEID0gKFVBLm1hdGNoKC9pcGFkL2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19JUEhPTkUgPSAoVUEubWF0Y2goL2lwaG9uZS9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSU9TID0gSVNfSVBIT05FIHx8IElTX0lQQUQ7XG5leHBvcnQgY29uc3QgSVNfQU5EUk9JRCA9IChVQS5tYXRjaCgvYW5kcm9pZC9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSUUgPSAoTkFWLmFwcE5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnbWljcm9zb2Z0JykgfHwgTkFWLmFwcE5hbWUudG9Mb3dlckNhc2UoKS5tYXRjaCgvdHJpZGVudC9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0NIUk9NRSA9IChVQS5tYXRjaCgvY2hyb21lL2dpKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfRklSRUZPWCA9IChVQS5tYXRjaCgvZmlyZWZveC9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX1NBRkFSSSA9IChVQS5tYXRjaCgvc2FmYXJpL2dpKSAhPT0gbnVsbCkgJiYgIUlTX0NIUk9NRTtcbmV4cG9ydCBjb25zdCBJU19TVE9DS19BTkRST0lEID0gKFVBLm1hdGNoKC9ebW96aWxsYVxcL1xcZCtcXC5cXGQrXFxzXFwobGludXg7XFxzdTsvZ2kpICE9PSBudWxsKTtcblxuZXhwb3J0IGNvbnN0IEhBU19UT1VDSCA9ICEhKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50VG91Y2gpO1xuZXhwb3J0IGNvbnN0IEhBU19NU0UgPSAoJ01lZGlhU291cmNlJyBpbiB3aW5kb3cpO1xuZXhwb3J0IGNvbnN0IFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSAoKCkgPT4ge1xuXHRsZXRcblx0XHRlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgneCcpLFxuXHRcdGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRnZXRDb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUsXG5cdFx0c3VwcG9ydHNcblx0O1xuXG5cdGlmICghKCdwb2ludGVyRXZlbnRzJyBpbiBlbGVtZW50LnN0eWxlKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcblx0ZWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ3gnO1xuXHRkb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cdHN1cHBvcnRzID0gZ2V0Q29tcHV0ZWRTdHlsZSAmJiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICcnKS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG5cdGRvY3VtZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50KTtcblx0cmV0dXJuICEhc3VwcG9ydHM7XG59KSgpO1xuXG4vLyBmb3IgSUVcbmxldCBodG1sNUVsZW1lbnRzID0gWydzb3VyY2UnLCAndHJhY2snLCAnYXVkaW8nLCAndmlkZW8nXSwgdmlkZW87XG5cbmZvciAobGV0IGkgPSAwLCBpbCA9IGh0bWw1RWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHR2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaHRtbDVFbGVtZW50c1tpXSk7XG59XG5cbi8vIFRlc3QgaWYgTWVkaWEgU291cmNlIEV4dGVuc2lvbnMgYXJlIHN1cHBvcnRlZCBieSBicm93c2VyXG5leHBvcnQgY29uc3QgU1VQUE9SVFNfTUVESUFfVEFHID0gKHZpZGVvLmNhblBsYXlUeXBlICE9PSB1bmRlZmluZWQgfHwgSEFTX01TRSk7XG5cbi8vIFRlc3QgaWYgYnJvd3NlcnMgc3VwcG9ydCBITFMgbmF0aXZlbHkgKHJpZ2h0IG5vdyBTYWZhcmksIEFuZHJvaWQncyBDaHJvbWUgYW5kIFN0b2NrIGJyb3dzZXJzLCBhbmQgTVMgRWRnZSlcbmV4cG9ydCBjb25zdCBTVVBQT1JUU19OQVRJVkVfSExTID0gKElTX1NBRkFSSSB8fCAoSVNfQU5EUk9JRCAmJiAoSVNfQ0hST01FIHx8IElTX1NUT0NLX0FORFJPSUQpKSB8fCAoSVNfSUUgJiYgVUEubWF0Y2goL2VkZ2UvZ2kpICE9PSBudWxsKSk7XG5cbi8vIERldGVjdCBuYXRpdmUgSmF2YVNjcmlwdCBmdWxsc2NyZWVuIChTYWZhcmkvRmlyZWZveCBvbmx5LCBDaHJvbWUgc3RpbGwgZmFpbHMpXG5cbi8vIGlPU1xubGV0IGhhc2lPU0Z1bGxTY3JlZW4gPSAodmlkZW8ud2Via2l0RW50ZXJGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG4vLyBXM0NcbmxldCBoYXNOYXRpdmVGdWxsc2NyZWVuID0gKHZpZGVvLnJlcXVlc3RGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG4vLyBPUyBYIDEwLjUgY2FuJ3QgZG8gdGhpcyBldmVuIGlmIGl0IHNheXMgaXQgY2FuIDooXG5pZiAoaGFzaU9TRnVsbFNjcmVlbiAmJiBVQS5tYXRjaCgvbWFjIG9zIHggMTBfNS9pKSkge1xuXHRoYXNOYXRpdmVGdWxsc2NyZWVuID0gZmFsc2U7XG5cdGhhc2lPU0Z1bGxTY3JlZW4gPSBmYWxzZTtcbn1cblxuLy8gd2Via2l0L2ZpcmVmb3gvSUUxMStcbmxldCBoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuICE9PSB1bmRlZmluZWQpO1xubGV0IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4gPSAodmlkZW8ubW96UmVxdWVzdEZ1bGxTY3JlZW4gIT09IHVuZGVmaW5lZCk7XG5sZXQgaGFzTXNOYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLm1zUmVxdWVzdEZ1bGxzY3JlZW4gIT09IHVuZGVmaW5lZCk7XG5cbmxldCBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbiA9IChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuIHx8IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4gfHwgaGFzTXNOYXRpdmVGdWxsU2NyZWVuKTtcbmxldCBuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IGhhc1RydWVOYXRpdmVGdWxsU2NyZWVuO1xuXG5sZXQgZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICcnO1xubGV0IGlzRnVsbFNjcmVlbiwgcmVxdWVzdEZ1bGxTY3JlZW4sIGNhbmNlbEZ1bGxTY3JlZW47XG5cbi8vIEVuYWJsZWQ/XG5pZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbmFibGVkO1xufSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0bmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbmFibGVkO1xufVxuXG5pZiAoSVNfQ0hST01FKSB7XG5cdGhhc2lPU0Z1bGxTY3JlZW4gPSBmYWxzZTtcbn1cblxuaWYgKGhhc1RydWVOYXRpdmVGdWxsU2NyZWVuKSB7XG5cblx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnO1xuXHR9IGVsc2UgaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ21vemZ1bGxzY3JlZW5jaGFuZ2UnO1xuXHR9IGVsc2UgaWYgKGhhc01zTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdGZ1bGxTY3JlZW5FdmVudE5hbWUgPSAnTVNGdWxsc2NyZWVuQ2hhbmdlJztcblx0fVxuXG5cdGlzRnVsbFNjcmVlbiA9ICgpID0+ICB7XG5cdFx0aWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5tb3pGdWxsU2NyZWVuO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQud2Via2l0SXNGdWxsU2NyZWVuO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRyZXF1ZXN0RnVsbFNjcmVlbiA9IChlbCkgPT4ge1xuXG5cdFx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGVsLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0fSBlbHNlIGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG5cdFx0fVxuXHR9O1xuXG5cdGNhbmNlbEZ1bGxTY3JlZW4gPSAoKSA9PiB7XG5cdFx0aWYgKGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXG5cdFx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKTtcblxuXHRcdH1cblx0fTtcbn1cblxuZXhwb3J0IGNvbnN0IEhBU19OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc05hdGl2ZUZ1bGxzY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX1dFQktJVF9OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX01PWl9OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc01vek5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX01TX05BVElWRV9GVUxMU0NSRUVOID0gaGFzTXNOYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19JT1NfRlVMTFNDUkVFTiA9IGhhc2lPU0Z1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbjtcbmV4cG9ydCBjb25zdCBIQVNfTkFUSVZFX0ZVTExTQ1JFRU5fRU5BQkxFRCA9IG5hdGl2ZUZ1bGxTY3JlZW5FbmFibGVkO1xuZXhwb3J0IGNvbnN0IEZVTExTQ1JFRU5fRVZFTlRfTkFNRSA9IGZ1bGxTY3JlZW5FdmVudE5hbWU7XG5cbmV4cG9ydCB7aXNGdWxsU2NyZWVuLCByZXF1ZXN0RnVsbFNjcmVlbiwgY2FuY2VsRnVsbFNjcmVlbn07XG5cbm1lanMuRmVhdHVyZXMgPSBtZWpzLkZlYXR1cmVzIHx8IHt9O1xubWVqcy5GZWF0dXJlcy5pc2lQYWQgPSBJU19JUEFEO1xubWVqcy5GZWF0dXJlcy5pc2lQaG9uZSA9IElTX0lQSE9ORTtcbm1lanMuRmVhdHVyZXMuaXNpT1MgPSBtZWpzLkZlYXR1cmVzLmlzaVBob25lIHx8IG1lanMuRmVhdHVyZXMuaXNpUGFkO1xubWVqcy5GZWF0dXJlcy5pc0FuZHJvaWQgPSBJU19BTkRST0lEO1xubWVqcy5GZWF0dXJlcy5pc0lFID0gSVNfSUU7XG5tZWpzLkZlYXR1cmVzLmlzQ2hyb21lID0gSVNfQ0hST01FO1xubWVqcy5GZWF0dXJlcy5pc0ZpcmVmb3ggPSBJU19GSVJFRk9YO1xubWVqcy5GZWF0dXJlcy5pc1NhZmFyaSA9IElTX1NBRkFSSTtcbm1lanMuRmVhdHVyZXMuaXNTdG9ja0FuZHJvaWQgPSBJU19TVE9DS19BTkRST0lEO1xubWVqcy5GZWF0dXJlcy5oYXNUb3VjaCA9IEhBU19UT1VDSDtcbm1lanMuRmVhdHVyZXMuaGFzTVNFID0gSEFTX01TRTtcbm1lanMuRmVhdHVyZXMuc3VwcG9ydHNNZWRpYVRhZyA9IFNVUFBPUlRTX01FRElBX1RBRztcbm1lanMuRmVhdHVyZXMuc3VwcG9ydHNOYXRpdmVITFMgPSBTVVBQT1JUU19OQVRJVkVfSExTO1xuXG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzUG9pbnRlckV2ZW50cyA9IFNVUFBPUlRfUE9JTlRFUl9FVkVOVFM7XG5tZWpzLkZlYXR1cmVzLmhhc2lPU0Z1bGxTY3JlZW4gPSBIQVNfSU9TX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc05hdGl2ZUZ1bGxzY3JlZW4gPSBIQVNfTkFUSVZFX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc1dlYmtpdE5hdGl2ZUZ1bGxTY3JlZW4gPSBIQVNfV0VCS0lUX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNNb3pOYXRpdmVGdWxsU2NyZWVuID0gSEFTX01PWl9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzTXNOYXRpdmVGdWxsU2NyZWVuID0gSEFTX01TX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNUcnVlTmF0aXZlRnVsbFNjcmVlbiA9IEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5uYXRpdmVGdWxsU2NyZWVuRW5hYmxlZCA9IEhBU19OQVRJVkVfRlVMTFNDUkVFTl9FTkFCTEVEO1xubWVqcy5GZWF0dXJlcy5mdWxsU2NyZWVuRXZlbnROYW1lID0gRlVMTFNDUkVFTl9FVkVOVF9OQU1FO1xubWVqcy5GZWF0dXJlcy5pc0Z1bGxTY3JlZW4gPSBpc0Z1bGxTY3JlZW47XG5tZWpzLkZlYXR1cmVzLnJlcXVlc3RGdWxsU2NyZWVuID0gcmVxdWVzdEZ1bGxTY3JlZW47XG5tZWpzLkZlYXR1cmVzLmNhbmNlbEZ1bGxTY3JlZW4gPSBjYW5jZWxGdWxsU2NyZWVuOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHJldHVybiB7RXZlbnR8T2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXZlbnQgKGV2ZW50TmFtZSwgdGFyZ2V0KSB7XG5cblx0aWYgKHR5cGVvZiBldmVudE5hbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdFdmVudCBuYW1lIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGxldCBldmVudDtcblxuXHRpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcblx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuXHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHRldmVudCA9IHt9O1xuXHRcdGV2ZW50LnR5cGUgPSBldmVudE5hbWU7XG5cdFx0ZXZlbnQudGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdGV2ZW50LmNhbmNlbGVhYmxlID0gdHJ1ZTtcblx0XHRldmVudC5idWJiYWJsZSA9IGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50IChvYmosIHR5cGUsIGZuKSB7XG5cdGlmIChvYmouYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAob2JqLmF0dGFjaEV2ZW50KSB7XG5cdFx0b2JqW2BlJHt0eXBlfSR7Zm59YF0gPSBmbjtcblx0XHRvYmpbYCR7dHlwZX0ke2ZufWBdID0gKCkgPT4ge1xuXHRcdFx0b2JqW2BlJHt0eXBlfSR7Zm59YF0od2luZG93LmV2ZW50KTtcblx0XHR9O1xuXHRcdG9iai5hdHRhY2hFdmVudChgb24ke3R5cGV9YCwgb2JqW2Ake3R5cGV9JHtmbn1gXSk7XG5cdH1cblxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUV2ZW50IChvYmosIHR5cGUsIGZuKSB7XG5cblx0aWYgKG9iai5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG5cdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGZhbHNlKTtcblx0fSBlbHNlIGlmIChvYmouZGV0YWNoRXZlbnQpIHtcblx0XHRvYmouZGV0YWNoRXZlbnQoYG9uJHt0eXBlfWAsIG9ialtgJHt0eXBlfSR7Zm59YF0pO1xuXHRcdG9ialtgJHt0eXBlfSR7Zm59YF0gPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRhcmdldE5vZGUgYXBwZWFycyBhZnRlciBzb3VyY2VOb2RlIGluIHRoZSBkb20uXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzb3VyY2VOb2RlIC0gdGhlIHNvdXJjZSBub2RlIGZvciBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXROb2RlIC0gdGhlIG5vZGUgdG8gY29tcGFyZSBhZ2FpbnN0IHNvdXJjZU5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZUFmdGVyIChzb3VyY2VOb2RlLCB0YXJnZXROb2RlKSB7XG5cdHJldHVybiAhIShcblx0XHRzb3VyY2VOb2RlICYmXG5cdFx0dGFyZ2V0Tm9kZSAmJlxuXHRcdHNvdXJjZU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24odGFyZ2V0Tm9kZSkgJiYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9QUkVDRURJTkdcblx0KTtcbn1cblxubWVqcy5VdGlscyA9IG1lanMuVXRpbHMgfHwge307XG5tZWpzLlV0aWxzLmNyZWF0ZUV2ZW50ID0gY3JlYXRlRXZlbnQ7XG5tZWpzLlV0aWxzLnJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnQ7XG5tZWpzLlV0aWxzLmlzTm9kZUFmdGVyID0gaXNOb2RlQWZ0ZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSFRNTCAoaW5wdXQpIHtcblxuXHRpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgcGFzc2VkIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGNvbnN0IG1hcCA9IHtcblx0XHQnJic6ICcmYW1wOycsXG5cdFx0JzwnOiAnJmx0OycsXG5cdFx0Jz4nOiAnJmd0OycsXG5cdFx0J1wiJzogJyZxdW90Oydcblx0fTtcblxuXHRyZXR1cm4gaW5wdXQucmVwbGFjZSgvWyY8PlwiXS9nLCAoYykgPT4ge1xuXHRcdHJldHVybiBtYXBbY107XG5cdH0pO1xufVxuXG4vLyB0YWtlbiBmcm9tIHVuZGVyc2NvcmVcbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlID0gZmFsc2UpIHtcblxuXHRpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiB3YWl0ICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1lcmljIHZhbHVlJyk7XG5cdH1cblxuXHRsZXQgdGltZW91dDtcblx0cmV0dXJuICgpID0+IHtcblx0XHRsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0bGV0IGxhdGVyID0gKCkgPT4ge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0bGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblxuXHRcdGlmIChjYWxsTm93KSB7XG5cdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGNvbnRhaW5zIGFueSBlbGVtZW50c1xuICpcbiAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Nzk5MTUvaG93LWRvLWktdGVzdC1mb3ItYW4tZW1wdHktamF2YXNjcmlwdC1vYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkgKGluc3RhbmNlKSB7XG5cdHJldHVybiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5zdGFuY2UpLmxlbmd0aCA8PSAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0RXZlbnRzIChldmVudHMsIGlkKSB7XG5cdGxldCByd2luZG93ID0gL14oKGFmdGVyfGJlZm9yZSlwcmludHwoYmVmb3JlKT91bmxvYWR8aGFzaGNoYW5nZXxtZXNzYWdlfG8oZmZ8bilsaW5lfHBhZ2UoaGlkZXxzaG93KXxwb3BzdGF0ZXxyZXNpemV8c3RvcmFnZSlcXGIvO1xuXHQvLyBhZGQgcGxheWVyIElEIGFzIGFuIGV2ZW50IG5hbWVzcGFjZSBzbyBpdCdzIGVhc2llciB0byB1bmJpbmQgdGhlbSBhbGwgbGF0ZXJcblx0bGV0IHJldCA9IHtkOiBbXSwgdzogW119O1xuXHQoZXZlbnRzIHx8ICcnKS5zcGxpdCgnICcpLmZvckVhY2goKHYpID0+IHtcblx0XHRjb25zdCBldmVudE5hbWUgPSB2ICsgJy4nICsgaWQ7XG5cblx0XHRpZiAoZXZlbnROYW1lLnN0YXJ0c1dpdGgoJy4nKSkge1xuXHRcdFx0cmV0LmQucHVzaChldmVudE5hbWUpO1xuXHRcdFx0cmV0LncucHVzaChldmVudE5hbWUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldFtyd2luZG93LnRlc3QodikgPyAndycgOiAnZCddLnB1c2goZXZlbnROYW1lKTtcblx0XHR9XG5cdH0pO1xuXG5cblx0cmV0LmQgPSByZXQuZC5qb2luKCcgJyk7XG5cdHJldC53ID0gcmV0Lncuam9pbignICcpO1xuXHRyZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFnXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAoY2xhc3NOYW1lLCBub2RlLCB0YWcpIHtcblxuXHRpZiAobm9kZSA9PT0gdW5kZWZpbmVkIHx8IG5vZGUgPT09IG51bGwpIHtcblx0XHRub2RlID0gZG9jdW1lbnQ7XG5cdH1cblx0aWYgKG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gdW5kZWZpbmVkICYmIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gbnVsbCkge1xuXHRcdHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKTtcblx0fVxuXHRpZiAodGFnID09PSB1bmRlZmluZWQgfHwgdGFnID09PSBudWxsKSB7XG5cdFx0dGFnID0gJyonO1xuXHR9XG5cblx0bGV0XG5cdFx0Y2xhc3NFbGVtZW50cyA9IFtdLFxuXHRcdGogPSAwLFxuXHRcdHRlc3RzdHIsXG5cdFx0ZWxzID0gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpLFxuXHRcdGVsc0xlbiA9IGVscy5sZW5ndGhcblx0XHQ7XG5cblx0Zm9yIChpID0gMDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cdFx0aWYgKGVsc1tpXS5jbGFzc05hbWUuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcblx0XHRcdHRlc3RzdHIgPSBgLCR7ZWxzW2ldLmNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJywnKX0sYDtcblx0XHRcdGlmICh0ZXN0c3RyLmluZGV4T2YoYCwke2NsYXNzTmFtZX0sYCkgPiAtMSkge1xuXHRcdFx0XHRjbGFzc0VsZW1lbnRzW2pdID0gZWxzW2ldO1xuXHRcdFx0XHRqKys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNsYXNzRWxlbWVudHM7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5lc2NhcGVIVE1MID0gZXNjYXBlSFRNTDtcbm1lanMuVXRpbHMuZGVib3VuY2UgPSBkZWJvdW5jZTtcbm1lanMuVXRpbHMuaXNPYmplY3RFbXB0eSA9IGlzT2JqZWN0RW1wdHk7XG5tZWpzLlV0aWxzLnNwbGl0RXZlbnRzID0gc3BsaXRFdmVudHM7XG5tZWpzLlV0aWxzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7ZXNjYXBlSFRNTH0gZnJvbSAnLi9nZW5lcmFsJztcblxuZXhwb3J0IGxldCB0eXBlQ2hlY2tzID0gW107XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic29sdXRpemVVcmwgKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGVsLmlubmVySFRNTCA9IGA8YSBocmVmPVwiJHtlc2NhcGVIVE1MKHVybCl9XCI+eDwvYT5gO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5ocmVmO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZm9ybWF0IG9mIGEgc3BlY2lmaWMgbWVkaWEsIGJhc2VkIG9uIFVSTCBhbmQgYWRkaXRpb25hbGx5IGl0cyBtaW1lIHR5cGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VHlwZSAodXJsLCB0eXBlID0gJycpIHtcblx0cmV0dXJuICh1cmwgJiYgIXR5cGUpID8gZ2V0VHlwZUZyb21GaWxlKHVybCkgOiBnZXRNaW1lRnJvbVR5cGUodHlwZSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHBhcnQgb2YgdGhlIHR5cGUgaW4gY2FzZSB0aGUgYXR0cmlidXRlIGNvbnRhaW5zIHRoZSBjb2RlY1xuICogKGB2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFLCBtcDRhLjQwLjJcImAgYmVjb21lcyBgdmlkZW8vbXA0YClcbiAqXG4gKiBAc2VlIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3ZpZGVvLmh0bWwjdGhlLXNvdXJjZS1lbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWltZUZyb21UeXBlICh0eXBlKSB7XG5cblx0aWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHR5cGVgIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHJldHVybiAodHlwZSAmJiB+dHlwZS5pbmRleE9mKCc7JykpID8gdHlwZS5zdWJzdHIoMCwgdHlwZS5pbmRleE9mKCc7JykpIDogdHlwZTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHR5cGUgb2YgbWVkaWEgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVGcm9tRmlsZSAodXJsKSB7XG5cblx0aWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdXJsYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgdHlwZTtcblxuXHQvLyBWYWxpZGF0ZSBgdHlwZUNoZWNrc2AgYXJyYXlcblx0aWYgKCFBcnJheS5pc0FycmF5KHR5cGVDaGVja3MpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdHlwZUNoZWNrc2AgbXVzdCBiZSBhbiBhcnJheScpO1xuXHR9XG5cblx0aWYgKHR5cGVDaGVja3MubGVuZ3RoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdHlwZUNoZWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gdHlwZUNoZWNrc1tpXTtcblxuXHRcdFx0aWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRWxlbWVudCBpbiBhcnJheSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBkbyB0eXBlIGNoZWNrcyBmaXJzdFxuXHRmb3IgKGxldCBpID0gMCwgdG90YWwgPSB0eXBlQ2hlY2tzLmxlbmd0aDsgaSA8IHRvdGFsOyBpKyspIHtcblxuXHRcdHR5cGUgPSB0eXBlQ2hlY2tzW2ldKHVybCk7XG5cblx0XHRpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUgIT09IG51bGwpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblx0fVxuXG5cdC8vIHRoZSBkbyBzdGFuZGFyZCBleHRlbnNpb24gY2hlY2tcblx0bGV0XG5cdFx0ZXh0ID0gZ2V0RXh0ZW5zaW9uKHVybCksXG5cdFx0bm9ybWFsaXplZEV4dCA9IG5vcm1hbGl6ZUV4dGVuc2lvbihleHQpXG5cdFx0O1xuXG5cdHJldHVybiAoLyhtcDR8bTR2fG9nZ3xvZ3Z8d2VibXx3ZWJtdnxmbHZ8d212fG1wZWd8bW92KS9naS50ZXN0KGV4dCkgPyAndmlkZW8nIDogJ2F1ZGlvJykgKyAnLycgKyBub3JtYWxpemVkRXh0O1xufVxuXG4vKipcbiAqIEdldCBtZWRpYSBmaWxlIGV4dGVuc2lvbiBmcm9tIFVSTFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbiAodXJsKSB7XG5cblx0aWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgdXJsYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgYmFzZVVybCA9IHVybC5zcGxpdCgnPycpWzBdO1xuXG5cdHJldHVybiB+YmFzZVVybC5pbmRleE9mKCcuJykgPyBiYXNlVXJsLnN1YnN0cmluZyhiYXNlVXJsLmxhc3RJbmRleE9mKCcuJykgKyAxKSA6ICcnO1xufVxuXG4vKipcbiAqIEdldCBzdGFuZGFyZCBleHRlbnNpb24gb2YgYSBtZWRpYSBmaWxlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvblxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRXh0ZW5zaW9uIChleHRlbnNpb24pIHtcblxuXHRpZiAodHlwZW9mIGV4dGVuc2lvbiAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2BleHRlbnNpb25gIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHN3aXRjaCAoZXh0ZW5zaW9uKSB7XG5cdFx0Y2FzZSAnbXA0Jzpcblx0XHRjYXNlICdtNHYnOlxuXHRcdFx0cmV0dXJuICdtcDQnO1xuXHRcdGNhc2UgJ3dlYm0nOlxuXHRcdGNhc2UgJ3dlYm1hJzpcblx0XHRjYXNlICd3ZWJtdic6XG5cdFx0XHRyZXR1cm4gJ3dlYm0nO1xuXHRcdGNhc2UgJ29nZyc6XG5cdFx0Y2FzZSAnb2dhJzpcblx0XHRjYXNlICdvZ3YnOlxuXHRcdFx0cmV0dXJuICdvZ2cnO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZXh0ZW5zaW9uO1xuXHR9XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5hYnNvbHV0aXplVXJsID0gYWJzb2x1dGl6ZVVybDtcbm1lanMuVXRpbHMuZm9ybWF0VHlwZSA9IGZvcm1hdFR5cGU7XG5tZWpzLlV0aWxzLmdldE1pbWVGcm9tVHlwZSA9IGdldE1pbWVGcm9tVHlwZTtcbm1lanMuVXRpbHMuZ2V0VHlwZUZyb21GaWxlID0gZ2V0VHlwZUZyb21GaWxlO1xubWVqcy5VdGlscy5nZXRFeHRlbnNpb24gPSBnZXRFeHRlbnNpb247XG5tZWpzLlV0aWxzLm5vcm1hbGl6ZUV4dGVuc2lvbiA9IG5vcm1hbGl6ZUV4dGVuc2lvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuLyoqXG4gKiBGb3JtYXQgYSBudW1lcmljIHRpbWUgaW4gZm9ybWF0ICcwMDowMDowMCdcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIElkZWFsbHkgYSBudW1iZXIsIGJ1dCBpZiBub3Qgb3IgbGVzcyB0aGFuIHplcm8sIGlzIGRlZmF1bHRlZCB0byB6ZXJvXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZvcmNlSG91cnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvd0ZyYW1lQ291bnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2Vjb25kc1RvVGltZUNvZGUgKHRpbWUsIGZvcmNlSG91cnMgPSBmYWxzZSwgc2hvd0ZyYW1lQ291bnQgPSBmYWxzZSwgZnBzID0gMjUpIHtcblxuXHR0aW1lID0gIXRpbWUgfHwgdHlwZW9mIHRpbWUgIT09ICdudW1iZXInIHx8IHRpbWUgPCAwID8gMCA6IHRpbWU7XG5cblx0bGV0IGhvdXJzID0gTWF0aC5mbG9vcih0aW1lIC8gMzYwMCkgJSAyNDtcblx0bGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRpbWUgLyA2MCkgJSA2MDtcblx0bGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgJSA2MCk7XG5cdGxldCBmcmFtZXMgPSBNYXRoLmZsb29yKCgodGltZSAlIDEpICogZnBzKS50b0ZpeGVkKDMpKTtcblxuXHRob3VycyA9IGhvdXJzIDw9IDAgPyAwIDogaG91cnM7XG5cdG1pbnV0ZXMgPSBtaW51dGVzIDw9IDAgPyAwIDogbWludXRlcztcblx0c2Vjb25kcyA9IHNlY29uZHMgPD0gMCA/IDAgOiBzZWNvbmRzO1xuXG5cdGxldCByZXN1bHQgPSAoZm9yY2VIb3VycyB8fCBob3VycyA+IDApID8gYCR7KGhvdXJzIDwgMTAgPyBgMCR7aG91cnN9YCA6IGhvdXJzKX06YCA6ICcnO1xuXHRyZXN1bHQgKz0gYCR7KG1pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzKX06YDtcblx0cmVzdWx0ICs9IGAkeyhzZWNvbmRzIDwgMTAgPyBgMCR7c2Vjb25kc31gIDogc2Vjb25kcyl9YDtcblx0cmVzdWx0ICs9IGAkeygoc2hvd0ZyYW1lQ291bnQpID8gYDokeyhmcmFtZXMgPCAxMCA/IGAwJHtmcmFtZXN9YCA6IGZyYW1lcyl9YCA6ICcnKX1gO1xuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydCBhICcwMDowMDowMCcgdGltZSBzdHJpbmcgaW50byBzZWNvbmRzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRpbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2hvd0ZyYW1lQ291bnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUNvZGVUb1NlY29uZHMgKHRpbWUsIHNob3dGcmFtZUNvdW50ID0gZmFsc2UsIGZwcyA9IDI1KSB7XG5cblx0aWYgKHR5cGVvZiB0aW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RpbWUgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0aWYgKCF0aW1lLm1hdGNoKC9cXGR7Mn0oXFw6XFxkezJ9KXswLDN9LykpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaW1lIGNvZGUgbXVzdCBoYXZlIHRoZSBmb3JtYXQgYDAwOjAwOjAwYCcpO1xuXHR9XG5cblx0bGV0XG5cdFx0cGFydHMgPSB0aW1lLnNwbGl0KCc6JyksXG5cdFx0aG91cnMgPSAwLFxuXHRcdG1pbnV0ZXMgPSAwLFxuXHRcdGZyYW1lcyA9IDAsXG5cdFx0c2Vjb25kcyA9IDAsXG5cdFx0b3V0cHV0XG5cdFx0O1xuXG5cdHN3aXRjaCAocGFydHMubGVuZ3RoKSB7XG5cdFx0ZGVmYXVsdDpcblx0XHRjYXNlIDE6XG5cdFx0XHRzZWNvbmRzID0gcGFyc2VJbnQocGFydHNbMF0sIDEwKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdG1pbnV0ZXMgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuXHRcdFx0c2Vjb25kcyA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDM6XG5cdFx0Y2FzZSA0OlxuXHRcdFx0aG91cnMgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuXHRcdFx0bWludXRlcyA9IHBhcnNlSW50KHBhcnRzWzFdLCAxMCk7XG5cdFx0XHRzZWNvbmRzID0gcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcblx0XHRcdGZyYW1lcyA9IHNob3dGcmFtZUNvdW50ID8gcGFyc2VJbnQocGFydHNbM10pIC8gZnBzIDogMDtcblx0XHRcdGJyZWFrO1xuXG5cdH1cblxuXHRvdXRwdXQgPSAoIGhvdXJzICogMzYwMCApICsgKCBtaW51dGVzICogNjAgKSArIHNlY29uZHMgKyBmcmFtZXM7XG5cdHJldHVybiBwYXJzZUZsb2F0KChvdXRwdXQpLnRvRml4ZWQoMykpO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgdGltZSBmb3JtYXQgdG8gdXNlXG4gKlxuICogVGhlcmUgaXMgYSBkZWZhdWx0IGZvcm1hdCBzZXQgaW4gdGhlIG9wdGlvbnMgYnV0IGl0IGNhbiBiZSBpbmNvbXBsZXRlLCBzbyBpdCBpcyBhZGp1c3RlZCBhY2NvcmRpbmcgdG8gdGhlIG1lZGlhXG4gKiBkdXJhdGlvbi4gRm9ybWF0OiAnaGg6bW06c3M6ZmYnXG4gKiBAcGFyYW0geyp9IHRpbWUgLSBJZGVhbGx5IGEgbnVtYmVyLCBidXQgaWYgbm90IG9yIGxlc3MgdGhhbiB6ZXJvLCBpcyBkZWZhdWx0ZWQgdG8gemVyb1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBmcHMgLSBGcmFtZXMgcGVyIHNlY29uZFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlVGltZUZvcm1hdCAodGltZSwgb3B0aW9ucywgZnBzID0gMjUpIHtcblxuXHR0aW1lID0gIXRpbWUgfHwgdHlwZW9mIHRpbWUgIT09ICdudW1iZXInIHx8IHRpbWUgPCAwID8gMCA6IHRpbWU7XG5cblx0bGV0XG5cdFx0cmVxdWlyZWQgPSBmYWxzZSxcblx0XHRmb3JtYXQgPSBvcHRpb25zLnRpbWVGb3JtYXQsXG5cdFx0Zmlyc3RDaGFyID0gZm9ybWF0WzBdLFxuXHRcdGZpcnN0VHdvUGxhY2VzID0gKGZvcm1hdFsxXSA9PT0gZm9ybWF0WzBdKSxcblx0XHRzZXBhcmF0b3JJbmRleCA9IGZpcnN0VHdvUGxhY2VzID8gMiA6IDEsXG5cdFx0c2VwYXJhdG9yID0gZm9ybWF0Lmxlbmd0aCA8IHNlcGFyYXRvckluZGV4ID8gZm9ybWF0W3NlcGFyYXRvckluZGV4XSA6ICc6Jyxcblx0XHRob3VycyA9IE1hdGguZmxvb3IodGltZSAvIDM2MDApICUgMjQsXG5cdFx0bWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwLFxuXHRcdHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgJSA2MCksXG5cdFx0ZnJhbWVzID0gTWF0aC5mbG9vcigoKHRpbWUgJSAxKSAqIGZwcykudG9GaXhlZCgzKSksXG5cdFx0bGlzID0gW1xuXHRcdFx0W2ZyYW1lcywgJ2YnXSxcblx0XHRcdFtzZWNvbmRzLCAncyddLFxuXHRcdFx0W21pbnV0ZXMsICdtJ10sXG5cdFx0XHRbaG91cnMsICdoJ11cblx0XHRdXG5cdFx0O1xuXG5cdGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRpZiAoZm9ybWF0LmluZGV4T2YobGlzW2ldWzFdKSA+IC0xKSB7XG5cdFx0XHRyZXF1aXJlZCA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHJlcXVpcmVkKSB7XG5cdFx0XHRsZXQgaGFzTmV4dFZhbHVlID0gZmFsc2U7XG5cdFx0XHRmb3IgKGxldCBqID0gaTsgaiA8IGxlbjsgaisrKSB7XG5cdFx0XHRcdGlmIChsaXNbal1bMF0gPiAwKSB7XG5cdFx0XHRcdFx0aGFzTmV4dFZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWhhc05leHRWYWx1ZSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFmaXJzdFR3b1BsYWNlcykge1xuXHRcdFx0XHRmb3JtYXQgPSBmaXJzdENoYXIgKyBmb3JtYXQ7XG5cdFx0XHR9XG5cdFx0XHRmb3JtYXQgPSBsaXNbaV1bMV0gKyBzZXBhcmF0b3IgKyBmb3JtYXQ7XG5cdFx0XHRpZiAoZmlyc3RUd29QbGFjZXMpIHtcblx0XHRcdFx0Zm9ybWF0ID0gbGlzW2ldWzFdICsgZm9ybWF0O1xuXHRcdFx0fVxuXHRcdFx0Zmlyc3RDaGFyID0gbGlzW2ldWzFdO1xuXHRcdH1cblx0fVxuXG5cdG9wdGlvbnMuY3VycmVudFRpbWVGb3JtYXQgPSBmb3JtYXQ7XG59XG5cbi8qKlxuICogQ29udmVydCBTb2NpZXR5IG9mIE1vdGlvbiBQaWN0dXJlIGFuZCBUZWxldmlzaW9uIEVuZ2luZWVycyAoU01UUEUpIHRpbWUgY29kZSBpbnRvIHNlY29uZHNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gU01QVEVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTTVBURXRvU2Vjb25kcyAoU01QVEUpIHtcblxuXHRpZiAodHlwZW9mIFNNUFRFICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcgdmFsdWUnKTtcblx0fVxuXG5cdFNNUFRFID0gU01QVEUucmVwbGFjZSgnLCcsICcuJyk7XG5cblx0bGV0XG5cdFx0c2VjcyA9IDAsXG5cdFx0ZGVjaW1hbExlbiA9IChTTVBURS5pbmRleE9mKCcuJykgPiAtMSkgPyBTTVBURS5zcGxpdCgnLicpWzFdLmxlbmd0aCA6IDAsXG5cdFx0bXVsdGlwbGllciA9IDFcblx0XHQ7XG5cblx0U01QVEUgPSBTTVBURS5zcGxpdCgnOicpLnJldmVyc2UoKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IFNNUFRFLmxlbmd0aDsgaSsrKSB7XG5cdFx0bXVsdGlwbGllciA9IDE7XG5cdFx0aWYgKGkgPiAwKSB7XG5cdFx0XHRtdWx0aXBsaWVyID0gTWF0aC5wb3coNjAsIGkpO1xuXHRcdH1cblx0XHRzZWNzICs9IE51bWJlcihTTVBURVtpXSkgKiBtdWx0aXBsaWVyO1xuXHR9XG5cdHJldHVybiBOdW1iZXIoc2Vjcy50b0ZpeGVkKGRlY2ltYWxMZW4pKTtcbn1cblxubWVqcy5VdGlscyA9IG1lanMuVXRpbHMgfHwge307XG5tZWpzLlV0aWxzLnNlY29uZHNUb1RpbWVDb2RlID0gc2Vjb25kc1RvVGltZUNvZGU7XG5tZWpzLlV0aWxzLnRpbWVDb2RlVG9TZWNvbmRzID0gdGltZUNvZGVUb1NlY29uZHM7XG5tZWpzLlV0aWxzLmNhbGN1bGF0ZVRpbWVGb3JtYXQgPSBjYWxjdWxhdGVUaW1lRm9ybWF0O1xubWVqcy5VdGlscy5jb252ZXJ0U01QVEV0b1NlY29uZHMgPSBjb252ZXJ0U01QVEV0b1NlY29uZHM7Il19
