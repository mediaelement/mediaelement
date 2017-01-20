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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2NvcmUvaTE4bi5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lZGlhZWxlbWVudC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9jb3JlL21lanMuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvY29yZS9yZW5kZXJlci5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9mdWxsc2NyZWVuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3BsYXlwYXVzZS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy9wcm9ncmVzcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy90aW1lLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2ZlYXR1cmVzL3RyYWNrcy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy9mZWF0dXJlcy92b2x1bWUuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvbGFuZ3VhZ2VzL2VuLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL2xpYnJhcnkuanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvcGxheWVyLmpzIiwiL3ByaXZhdGUvdmFyL3d3dy9tZWRpYWVsZW1lbnQvc3JjL2pzL3V0aWxzL2NvbnN0YW50cy5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9kb20uanMiLCIvcHJpdmF0ZS92YXIvd3d3L21lZGlhZWxlbWVudC9zcmMvanMvdXRpbHMvZ2VuZXJhbC5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy9tZWRpYS5qcyIsIi9wcml2YXRlL3Zhci93d3cvbWVkaWFlbGVtZW50L3NyYy9qcy91dGlscy90aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7Ozs7QUFNQSxJQUFJLE9BQU8sRUFBQyxNQUFNLElBQVAsRUFBYSxVQUFiLEVBQVg7O0FBRUE7Ozs7OztBQU1BLEtBQUssUUFBTCxHQUFnQixZQUFhO0FBQUEsbUNBQVQsSUFBUztBQUFULE1BQVM7QUFBQTs7QUFFNUIsS0FBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxTQUExQixJQUF1QyxLQUFLLE1BQWhELEVBQXdEOztBQUV2RCxNQUFJLE9BQU8sS0FBSyxDQUFMLENBQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDaEMsU0FBTSxJQUFJLFNBQUosQ0FBYyxzQ0FBZCxDQUFOO0FBQ0E7O0FBRUQsTUFBSSxDQUFDLEtBQUssQ0FBTCxFQUFRLEtBQVIsQ0FBYywwQkFBZCxDQUFMLEVBQWdEO0FBQy9DLFNBQU0sSUFBSSxTQUFKLENBQWMsZ0RBQWQsQ0FBTjtBQUNBOztBQUVELE9BQUssSUFBTCxHQUFZLEtBQUssQ0FBTCxDQUFaOztBQUVBO0FB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T0FBTixDQUFjLEdBQWQsRUFBbUIsR0FBbkIsQ0FBUjs7QUFFQSxLQUNDLE9BQU8sQ0FEUjtBQUFBLEtBRUMsYUFBYyxNQUFNLE9BQU4sQ0FBYyxHQUFkLElBQXFCLENBQUMsQ0FBdkIsR0FBNEIsTUFBTSxLQUFOLENBQVksR0FBWixFQUFpQixDQUFqQixFQUFvQixNQUFoRCxHQUF5RCxDQUZ2RTtBQUFBLEtBR0MsYUFBYSxDQUhkOztBQU1BLFNBQVEsTUFBTSxLQUFOLENBQVksR0FBWixFQUFpQixPQUFqQixFQUFSOztBQUVBLE1BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3RDLGVBQWEsQ0FBYjtBQUNBLE1BQUksSUFBSSxDQUFSLEVBQVc7QUFDVixnQkFBYSxLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBYixDQUFiO0FBQ0E7QUFDRCxVQUFRLE9BQU8sTUFBTSxDQUFOLENBQVAsSUFBbUIsVUFBM0I7QUFDQTtBQUNELFFBQU8sT0FBTyxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQVAsQ0FBUDtBQUNBOztBQUVELGVBQUssS0FBTCxHQUFhLGVBQUssS0FBTCxJQUFjLEVBQTNCO0FBQ0EsZUFBSyxLQUFMLENBQVcsaUJBQVgsR0FBK0IsaUJBQS9CO0FBQ0EsZUFBSyxLQUFMLENBQVcsaUJBQVgsR0FBK0IsaUJBQS9CO0FBQ0EsZUFBSyxLQUFMLENBQVcsbUJBQVgsR0FBaUMsbUJBQWpDO0FBQ0EsZUFBSyxLQUFMLENBQVcscUJBQVgsR0FBbUMscUJBQW5DIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsInZhciB0b3BMZXZlbCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDpcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHt9XG52YXIgbWluRG9jID0gcmVxdWlyZSgnbWluLWRvY3VtZW50Jyk7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudDtcbn0gZWxzZSB7XG4gICAgdmFyIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXTtcblxuICAgIGlmICghZG9jY3kpIHtcbiAgICAgICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddID0gbWluRG9jO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jY3k7XG59XG4iLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5pbXBvcnQge0VOIGFzIGVufSBmcm9tICcuLi9sYW5ndWFnZXMvZW4nO1xuaW1wb3J0IHtlc2NhcGVIVE1MLCBpc09iamVjdEVtcHR5fSBmcm9tICcuLi91dGlscy9nZW5lcmFsJztcblxuLyoqXG4gKiBMb2NhbGUuXG4gKlxuICogVGhpcyBvYmplY3QgbWFuYWdlcyB0cmFuc2xhdGlvbnMgd2l0aCBwbHVyYWxpemF0aW9uLiBBbHNvIGRlYWxzIHdpdGggV29yZFByZXNzIGNvbXBhdGliaWxpdHkuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5sZXQgaTE4biA9IHtsYW5nOiAnZW4nLCBlbjogZW59O1xuXG4vKipcbiAqIExhbmd1YWdlIHNldHRlci9nZXR0ZXJcbiAqXG4gKiBAcGFyYW0geyp9IGFyZ3MgIENhbiBwYXNzIHRoZSBsYW5ndWFnZSBjb2RlIGFuZC9vciB0aGUgdHJhbnNsYXRpb24gc3RyaW5ncyBhcyBhbiBPYmplY3RcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuaTE4bi5sYW5ndWFnZSA9ICguLi5hcmdzKSA9PiB7XG5cblx0aWYgKGFyZ3MgIT09IG51bGwgJiYgYXJncyAhPT0gdW5kZWZpbmVkICYmIGFyZ3MubGVuZ3RoKSB7XG5cblx0XHRpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdMYW5ndWFnZSBjb2RlIG11c3QgYmUgYSBzdHJpbmcgdmFsdWUnKTtcblx0XHR9XG5cblx0XHRpZiAoIWFyZ3NbMF0ubWF0Y2goL15bYS16XXsyfShcXC1bYS16XXsyfSk/JC9pKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignTGFuZ3VhZ2UgY29kZSBtdXN0IGhhdmUgZm9ybWF0IGB4eGAgb3IgYHh4LXh4YCcpO1xuXHRcdH1cblxuXHRcdGkxOG4ubGFuZyA9IGFyZ3NbMF07XG5cblx0XHQvLyBDaGVjayBpZiBsYW5ndWFnZSBzdHJpbmdzIHdlcmUgYWRkZWQ7IG90aGVyd2lzZSwgY2hlY2sgdGhlIHNlY29uZCBhcmd1bWVudCBvciBzZXQgdG8gRW5nbGlzaCBhcyBkZWZhdWx0XG5cdFx0aWYgKGkxOG5bYXJnc1swXV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXJnc1sxXSA9IGFyZ3NbMV0gIT09IG51bGwgJiYgYXJnc1sxXSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0JyA/IGFyZ3NbMV0gOiB7fTtcblx0XHRcdGkxOG5bYXJnc1swXV0gPSAhaXNPYmplY3RFbXB0eShhcmdzWzFdKSA/IGFyZ3NbMV0gOiBlbjtcblx0XHR9IGVsc2UgaWYgKGFyZ3NbMV0gIT09IG51bGwgJiYgYXJnc1sxXSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0Jykge1xuXHRcdFx0aTE4blthcmdzWzBdXSA9IGFyZ3NbMV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGkxOG4ubGFuZztcbn07XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgc3RyaW5nIGluIHRoZSBsYW5ndWFnZSBzZXQgdXAgKG9yIEVuZ2xpc2ggYnkgZGVmYXVsdClcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsdXJhbFBhcmFtXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmkxOG4udCA9IChtZXNzYWdlLCBwbHVyYWxQYXJhbSA9IG51bGwpID0+IHtcblxuXHRpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIG1lc3NhZ2UubGVuZ3RoKSB7XG5cblx0XHRsZXRcblx0XHRcdHN0cixcblx0XHRcdHBsdXJhbEZvcm1cblx0XHRcdDtcblxuXHRcdGNvbnN0IGxhbmd1YWdlID0gaTE4bi5sYW5ndWFnZSgpO1xuXG5cdFx0LyoqXG5cdFx0ICogTW9kaWZ5IHN0cmluZyB1c2luZyBhbGdvcml0aG0gdG8gZGV0ZWN0IHBsdXJhbCBmb3Jtcy5cblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTM0MDgvbWVzc2FnZWZvcm1hdC1pbi1qYXZhc2NyaXB0LXBhcmFtZXRlcnMtaW4tbG9jYWxpemVkLXVpLXN0cmluZ3Ncblx0XHQgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXX0gaW5wdXQgICAtIFN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIHBpY2sgdGhlIHBsdXJhbCBmb3JtXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAgICAgICAgICAgLSBOdW1iZXIgdG8gZGV0ZXJtaW5lIHRoZSBwcm9wZXIgcGx1cmFsIGZvcm1cblx0XHQgKiBAcGFyYW0ge051bWJlcn0gZm9ybSAgICAgICAgICAgICAtIE51bWJlciBvZiBsYW5ndWFnZSBmYW1pbHkgdG8gYXBwbHkgcGx1cmFsIGZvcm1cblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Y29uc3QgX3BsdXJhbCA9IChpbnB1dCwgbnVtYmVyLCBmb3JtKSA9PiB7XG5cblx0XHRcdGlmICh0eXBlb2YgaW5wdXQgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBudW1iZXIgIT09ICdudW1iZXInIHx8IHR5cGVvZiBmb3JtICE9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRyZXR1cm4gaW5wdXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICpcblx0XHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9uW119XG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRsZXQgX3BsdXJhbEZvcm1zID0gKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQvLyAwOiBDaGluZXNlLCBKYXBhbmVzZSwgS29yZWFuLCBQZXJzaWFuLCBUdXJraXNoLCBUaGFpLCBMYW8sIEF5bWFyw6EsXG5cdFx0XHRcdFx0Ly8gVGliZXRhbiwgQ2hpZ2EsIER6b25na2hhLCBJbmRvbmVzaWFuLCBMb2piYW4sIEdlb3JnaWFuLCBLYXpha2gsIEtobWVyLCBLeXJneXosIE1hbGF5LFxuXHRcdFx0XHRcdC8vIEJ1cm1lc2UsIFlha3V0LCBTdW5kYW5lc2UsIFRhdGFyLCBVeWdodXIsIFZpZXRuYW1lc2UsIFdvbG9mXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IGFyZ3NbMV0sXG5cblx0XHRcdFx0XHQvLyAxOiBEYW5pc2gsIER1dGNoLCBFbmdsaXNoLCBGYXJvZXNlLCBGcmlzaWFuLCBHZXJtYW4sIE5vcndlZ2lhbiwgU3dlZGlzaCwgRXN0b25pYW4sIEZpbm5pc2gsXG5cdFx0XHRcdFx0Ly8gSHVuZ2FyaWFuLCBCYXNxdWUsIEdyZWVrLCBIZWJyZXcsIEl0YWxpYW4sIFBvcnR1Z3Vlc2UsIFNwYW5pc2gsIENhdGFsYW4sIEFmcmlrYWFucyxcblx0XHRcdFx0XHQvLyBBbmdpa2EsIEFzc2FtZXNlLCBBc3R1cmlhbiwgQXplcmJhaWphbmksIEJ1bGdhcmlhbiwgQmVuZ2FsaSwgQm9kbywgQXJhZ29uZXNlLCBEb2dyaSxcblx0XHRcdFx0XHQvLyBFc3BlcmFudG8sIEFyZ2VudGluZWFuIFNwYW5pc2gsIEZ1bGFoLCBGcml1bGlhbiwgR2FsaWNpYW4sIEd1amFyYXRpLCBIYXVzYSxcblx0XHRcdFx0XHQvLyBIaW5kaSwgQ2hoYXR0aXNnYXJoaSwgQXJtZW5pYW4sIEludGVybGluZ3VhLCBHcmVlbmxhbmRpYywgS2FubmFkYSwgS3VyZGlzaCwgTGV0emVidXJnZXNjaCxcblx0XHRcdFx0XHQvLyBNYWl0aGlsaSwgTWFsYXlhbGFtLCBNb25nb2xpYW4sIE1hbmlwdXJpLCBNYXJhdGhpLCBOYWh1YXRsLCBOZWFwb2xpdGFuLCBOb3J3ZWdpYW4gQm9rbWFsLFxuXHRcdFx0XHRcdC8vIE5lcGFsaSwgTm9yd2VnaWFuIE55bm9yc2ssIE5vcndlZ2lhbiAob2xkIGNvZGUpLCBOb3J0aGVybiBTb3RobywgT3JpeWEsIFB1bmphYmksIFBhcGlhbWVudG8sXG5cdFx0XHRcdFx0Ly8gUGllbW9udGVzZSwgUGFzaHRvLCBSb21hbnNoLCBLaW55YXJ3YW5kYSwgU2FudGFsaSwgU2NvdHMsIFNpbmRoaSwgTm9ydGhlcm4gU2FtaSwgU2luaGFsYSxcblx0XHRcdFx0XHQvLyBTb21hbGksIFNvbmdoYXksIEFsYmFuaWFuLCBTd2FoaWxpLCBUYW1pbCwgVGVsdWd1LCBUdXJrbWVuLCBVcmR1LCBZb3J1YmFcblx0XHRcdFx0XHQoLi4uYXJncykgPT4gKGFyZ3NbMF0gPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl0sXG5cblx0XHRcdFx0XHQvLyAyOiBGcmVuY2gsIEJyYXppbGlhbiBQb3J0dWd1ZXNlLCBBY2hvbGksIEFrYW4sIEFtaGFyaWMsIE1hcHVkdW5ndW4sIEJyZXRvbiwgRmlsaXBpbm8sXG5cdFx0XHRcdFx0Ly8gR3VuLCBMaW5nYWxhLCBNYXVyaXRpYW4gQ3Jlb2xlLCBNYWxhZ2FzeSwgTWFvcmksIE9jY2l0YW4sIFRhamlrLCBUaWdyaW55YSwgVXpiZWssIFdhbGxvb25cblx0XHRcdFx0XHQoLi4uYXJncykgPT4gKGFyZ3NbMF0gPT09IDAgfHwgYXJnc1swXSA9PT0gMSkgPyBhcmdzWzFdIDogYXJnc1syXSxcblxuXHRcdFx0XHRcdC8vIDM6IExhdHZpYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA0OiBTY290dGlzaCBHYWVsaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEgfHwgYXJnc1swXSA9PT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIgfHwgYXJnc1swXSA9PT0gMTIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiAyICYmIGFyZ3NbMF0gPCAyMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA1OiAgUm9tYW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDAgfHwgKGFyZ3NbMF0gJSAxMDAgPiAwICYmIGFyZ3NbMF0gJSAxMDAgPCAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNjogTGl0aHVhbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxICYmIGFyZ3NbMF0gJSAxMDAgIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8IGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFszXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNzogQmVsYXJ1c2lhbiwgQm9zbmlhbiwgQ3JvYXRpYW4sIFNlcmJpYW4sIFJ1c3NpYW4sIFVrcmFpbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxICYmIGFyZ3NbMF0gJSAxMDAgIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiBhcmdzWzBdICUgMTAgPD0gNCAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8IGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDg6ICBTbG92YWssIEN6ZWNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID49IDIgJiYgYXJnc1swXSA8PSA0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDk6IFBvbGlzaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMDogU2xvdmVuaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAwID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID09PSAzIHx8IGFyZ3NbMF0gJSAxMDAgPT09IDQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTE6IElyaXNoIEdhZWxpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+IDIgJiYgYXJnc1swXSA8IDcpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiA2ICYmIGFyZ3NbMF0gPCAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzVdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMjogQXJhYmljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID49IDMgJiYgYXJnc1swXSAlIDEwMCA8PSAxMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s1XTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzZdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMzogTWFsdGVzZVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMCB8fCAoYXJnc1swXSAlIDEwMCA+IDEgJiYgYXJnc1swXSAlIDEwMCA8IDExKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+IDEwICYmIGFyZ3NbMF0gJSAxMDAgPCAyMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxNDogTWFjZWRvbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTU6ICBJY2VsYW5kaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIChhcmdzWzBdICE9PSAxMSAmJiBhcmdzWzBdICUgMTAgPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl07XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIE5ldyBhZGRpdGlvbnNcblxuXHRcdFx0XHRcdC8vIDE2OiAgS2FzaHViaWFuXG5cdFx0XHRcdFx0Ly8gSW4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0xvY2FsaXphdGlvbi9Mb2NhbGl6YXRpb25fYW5kX1BsdXJhbHMjTGlzdF9vZl9fcGx1cmFsUnVsZXNcblx0XHRcdFx0XHQvLyBCcmV0b24gaXMgbGlzdGVkIGFzICMxNiBidXQgaW4gdGhlIExvY2FsaXphdGlvbiBHdWlkZSBpdCBiZWxvbmdzIHRvIHRoZSBncm91cCAyXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiBhcmdzWzBdICUgMTAgPD0gNCAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8XG5cdFx0XHRcdFx0XHRcdGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE3OiAgV2Vsc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gIT09IDggJiYgYXJnc1swXSAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTg6ICBKYXZhbmVzZVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKGFyZ3NbMF0gPT09IDApID8gYXJnc1sxXSA6IGFyZ3NbMl07XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE5OiAgQ29ybmlzaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAyMDogIE1hbmRpbmthXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdF07XG5cdFx0XHR9KSgpO1xuXG5cdFx0XHQvLyBQZXJmb3JtIHBsdXJhbCBmb3JtIG9yIHJldHVybiBvcmlnaW5hbCB0ZXh0XG5cdFx0XHRyZXR1cm4gX3BsdXJhbEZvcm1zW2Zvcm1dLmFwcGx5KG51bGwsIFtudW1iZXJdLmNvbmNhdChpbnB1dCkpO1xuXHRcdH07XG5cblx0XHQvLyBGZXRjaCB0aGUgbG9jYWxpemVkIHZlcnNpb24gb2YgdGhlIHN0cmluZ1xuXHRcdGlmIChpMThuW2xhbmd1YWdlXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzdHIgPSBpMThuW2xhbmd1YWdlXVttZXNzYWdlXTtcblx0XHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdHBsdXJhbEZvcm0gPSBpMThuW2xhbmd1YWdlXVsnbWVqcy5wbHVyYWwtZm9ybSddO1xuXHRcdFx0XHRzdHIgPSBfcGx1cmFsLmFwcGx5KG51bGwsIFtzdHIsIHBsdXJhbFBhcmFtLCBwbHVyYWxGb3JtXSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gZGVmYXVsdCBsYW5ndWFnZSBpZiByZXF1ZXN0ZWQgdWlkIGlzIG5vdCB0cmFuc2xhdGVkXG5cdFx0aWYgKCFzdHIgJiYgaTE4bi5lbikge1xuXHRcdFx0c3RyID0gaTE4bi5lblttZXNzYWdlXTtcblx0XHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdHBsdXJhbEZvcm0gPSBpMThuLmVuWydtZWpzLnBsdXJhbC1mb3JtJ107XG5cdFx0XHRcdHN0ciA9IF9wbHVyYWwuYXBwbHkobnVsbCwgW3N0ciwgcGx1cmFsUGFyYW0sIHBsdXJhbEZvcm1dKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEFzIGEgbGFzdCByZXNvcnQsIHVzZSB0aGUgcmVxdWVzdGVkIHVpZCwgdG8gbWltaWMgb3JpZ2luYWwgYmVoYXZpb3Igb2YgaTE4biB1dGlsc1xuXHRcdC8vIChpbiB3aGljaCB1aWQgd2FzIHRoZSBlbmdsaXNoIHRleHQpXG5cdFx0c3RyID0gc3RyIHx8IG1lc3NhZ2U7XG5cblx0XHQvLyBSZXBsYWNlIHRva2VuXG5cdFx0aWYgKHBsdXJhbFBhcmFtICE9PSBudWxsICYmIHR5cGVvZiBwbHVyYWxQYXJhbSA9PT0gJ251bWJlcicpIHtcblx0XHRcdHN0ciA9IHN0ci5yZXBsYWNlKCclMScsIHBsdXJhbFBhcmFtKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXNjYXBlSFRNTChzdHIpO1xuXG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZTtcbn07XG5cbm1lanMuaTE4biA9IGkxOG47XG5cbi8vIGBpMThuYCBjb21wYXRpYmlsaXR5IHdvcmtmbG93IHdpdGggV29yZFByZXNzXG5pZiAodHlwZW9mIG1lanNMMTBuICE9PSAndW5kZWZpbmVkJykge1xuXHRtZWpzLmkxOG4ubGFuZ3VhZ2UobWVqc0wxMG4ubGFuZ3VhZ2UsIG1lanNMMTBuLnN0cmluZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpMThuOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi9tZWpzJztcbmltcG9ydCB7Z2V0VHlwZUZyb21GaWxlLCBmb3JtYXRUeXBlLCBhYnNvbHV0aXplVXJsfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBNZWRpYSBDb3JlXG4gKlxuICogVGhpcyBjbGFzcyBpcyB0aGUgZm91bmRhdGlvbiB0byBjcmVhdGUvcmVuZGVyIGRpZmZlcmVudCBtZWRpYSBmb3JtYXRzLlxuICogQGNsYXNzIE1lZGlhRWxlbWVudFxuICovXG5jbGFzcyBNZWRpYUVsZW1lbnQge1xuXG5cdGNvbnN0cnVjdG9yIChpZE9yTm9kZSwgb3B0aW9ucykge1xuXHRcdFxuXHRcdGxldCB0ID0gdGhpcztcblx0XHRcblx0XHR0LmRlZmF1bHRzID0ge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBMaXN0IG9mIHRoZSByZW5kZXJlcnMgdG8gdXNlXG5cdFx0XHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdFx0XHQgKi9cblx0XHRcdHJlbmRlcmVyczogW10sXG5cdFx0XHQvKipcblx0XHRcdCAqIE5hbWUgb2YgTWVkaWFFbGVtZW50IGNvbnRhaW5lclxuXHRcdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHRcdCAqL1xuXHRcdFx0ZmFrZU5vZGVOYW1lOiAnbWVkaWFlbGVtZW50d3JhcHBlcicsXG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBwYXRoIHdoZXJlIHNoaW1zIGFyZSBsb2NhdGVkXG5cdFx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdFx0ICovXG5cdFx0XHRwbHVnaW5QYXRoOiAnYnVpbGQvJ1xuXHRcdH07XG5cblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih0LmRlZmF1bHRzLCBvcHRpb25zKTtcblxuXHRcdC8vIGNyZWF0ZSBvdXIgbm9kZSAobm90ZTogb2xkZXIgdmVyc2lvbnMgb2YgaU9TIGRvbid0IHN1cHBvcnQgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9uIERPTSBub2Rlcylcblx0XHR0Lm1lZGlhRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy5mYWtlTm9kZU5hbWUpO1xuXHRcdHQubWVkaWFFbGVtZW50Lm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cdFx0bGV0XG5cdFx0XHRpZCA9IGlkT3JOb2RlLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0aWYgKHR5cGVvZiBpZE9yTm9kZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkT3JOb2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID0gaWRPck5vZGU7XG5cdFx0XHRpZCA9IGlkT3JOb2RlLmlkO1xuXHRcdH1cblxuXHRcdGlkID0gaWQgfHwgYG1lanNfJHsoTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIpKX1gO1xuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gbnVsbCAmJlxuXHRcdFx0dC5tZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQpIHtcblx0XHRcdC8vIGNoYW5nZSBpZFxuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpZH1fZnJvbV9tZWpzYCk7XG5cblx0XHRcdC8vIGFkZCBuZXh0IHRvIHRoaXMgb25lXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodC5tZWRpYUVsZW1lbnQsIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cblx0XHRcdC8vIGluc2VydCB0aGlzIG9uZSBpbnNpZGVcblx0XHRcdHQubWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRPRE86IHdoZXJlIHRvIHB1dCB0aGUgbm9kZT9cblx0XHR9XG5cblx0XHR0Lm1lZGlhRWxlbWVudC5pZCA9IGlkO1xuXHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVycyA9IHt9O1xuXHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID0gbnVsbDtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSBudWxsO1xuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSB3aGV0aGVyIHRoZSByZW5kZXJlciB3YXMgZm91bmQgb3Igbm90XG5cdFx0ICpcblx0XHQgKiBAcHVibGljXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHJlbmRlcmVyTmFtZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXNcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdHQubWVkaWFFbGVtZW50LmNoYW5nZVJlbmRlcmVyID0gKHJlbmRlcmVyTmFtZSwgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRcdC8vIGNoZWNrIGZvciBhIG1hdGNoIG9uIHRoZSBjdXJyZW50IHJlbmRlcmVyXG5cdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCAmJlxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5uYW1lID09PSByZW5kZXJlck5hbWUpIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIucGF1c2UoKTtcblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3ApIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc2hvdygpO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zZXRTcmMobWVkaWFGaWxlc1swXS5zcmMpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgZXhpc3RpbmcgcmVuZGVyZXIgaXMgbm90IHRoZSByaWdodCBvbmUsIHRoZW4gaGlkZSBpdFxuXHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIucGF1c2UoKTtcblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3ApIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZWUgaWYgd2UgaGF2ZSB0aGUgcmVuZGVyZXIgYWxyZWFkeSBjcmVhdGVkXG5cdFx0XHRsZXQgbmV3UmVuZGVyZXIgPSB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnNbcmVuZGVyZXJOYW1lXSxcblx0XHRcdFx0bmV3UmVuZGVyZXJUeXBlID0gbnVsbDtcblxuXHRcdFx0aWYgKG5ld1JlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgbmV3UmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0bmV3UmVuZGVyZXIuc2hvdygpO1xuXHRcdFx0XHRuZXdSZW5kZXJlci5zZXRTcmMobWVkaWFGaWxlc1swXS5zcmMpO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG5ld1JlbmRlcmVyO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSByZW5kZXJlck5hbWU7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcmVuZGVyZXJBcnJheSA9IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzLmxlbmd0aCA/IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzIDpcblx0XHRcdFx0cmVuZGVyZXIub3JkZXI7XG5cblx0XHRcdC8vIGZpbmQgdGhlIGRlc2lyZWQgcmVuZGVyZXIgaW4gdGhlIGFycmF5IG9mIHBvc3NpYmxlIG9uZXNcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gcmVuZGVyZXJBcnJheS5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0Y29uc3QgaW5kZXggPSByZW5kZXJlckFycmF5W2ldO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gcmVuZGVyZXJOYW1lKSB7XG5cblx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHJlbmRlcmVyXG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZXJMaXN0ID0gcmVuZGVyZXIucmVuZGVyZXJzO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyVHlwZSA9IHJlbmRlcmVyTGlzdFtpbmRleF07XG5cblx0XHRcdFx0XHRsZXQgcmVuZGVyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obmV3UmVuZGVyZXJUeXBlLm9wdGlvbnMsIHQubWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyID0gbmV3UmVuZGVyZXJUeXBlLmNyZWF0ZSh0Lm1lZGlhRWxlbWVudCwgcmVuZGVyT3B0aW9ucywgbWVkaWFGaWxlcyk7XG5cdFx0XHRcdFx0bmV3UmVuZGVyZXIubmFtZSA9IHJlbmRlcmVyTmFtZTtcblxuXHRcdFx0XHRcdC8vIHN0b3JlIGZvciBsYXRlclxuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyc1tuZXdSZW5kZXJlclR5cGUubmFtZV0gPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG5ld1JlbmRlcmVyO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyTmFtZSA9IHJlbmRlcmVyTmFtZTtcblxuXHRcdFx0XHRcdG5ld1JlbmRlcmVyLnNob3coKTtcblxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogU2V0IHRoZSBlbGVtZW50IGRpbWVuc2lvbnMgYmFzZWQgb24gc2VsZWN0ZWQgcmVuZGVyZXIncyBzZXRTaXplIG1ldGhvZFxuXHRcdCAqXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcblx0XHQgKi9cblx0XHR0Lm1lZGlhRWxlbWVudC5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YWRkUHJvcGVydHkgPSAob2JqLCBuYW1lLCBvbkdldCwgb25TZXQpID0+IHtcblxuXHRcdFx0XHQvLyB3cmFwcGVyIGZ1bmN0aW9uc1xuXHRcdFx0XHRsZXQgb2xkVmFsdWUgPSBvYmpbbmFtZV07XG5cdFx0XHRcdGNvbnN0XG5cdFx0XHRcdFx0Z2V0Rm4gPSAoKSA9PiBvbkdldC5hcHBseShvYmosIFtvbGRWYWx1ZV0pLFxuXHRcdFx0XHRcdHNldEZuID0gKG5ld1ZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRvbGRWYWx1ZSA9IG9uU2V0LmFwcGx5KG9iaiwgW25ld1ZhbHVlXSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb2xkVmFsdWU7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBNb2Rlcm4gYnJvd3NlcnMsIElFOSsgKElFOCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLCBub3Qgbm9ybWFsIEpTIG9iamVjdHMpXG5cdFx0XHRcdGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcblxuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcblx0XHRcdFx0XHRcdGdldDogZ2V0Rm4sXG5cdFx0XHRcdFx0XHRzZXQ6IHNldEZuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQvLyBPbGRlciBGaXJlZm94XG5cdFx0XHRcdH0gZWxzZSBpZiAob2JqLl9fZGVmaW5lR2V0dGVyX18pIHtcblxuXHRcdFx0XHRcdG9iai5fX2RlZmluZUdldHRlcl9fKG5hbWUsIGdldEZuKTtcblx0XHRcdFx0XHRvYmouX19kZWZpbmVTZXR0ZXJfXyhuYW1lLCBzZXRGbik7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0XHRpZiAocHJvcE5hbWUgIT09ICdzcmMnKSB7XG5cblx0XHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWAsXG5cdFx0XHRcdFx0XHRnZXRGbiA9ICgpID0+ICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSA/IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW2BnZXQke2NhcE5hbWV9YF0oKSA6IG51bGwsXG5cdFx0XHRcdFx0XHRzZXRGbiA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW2BzZXQke2NhcE5hbWV9YF0odmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0YWRkUHJvcGVydHkodC5tZWRpYUVsZW1lbnQsIHByb3BOYW1lLCBnZXRGbiwgc2V0Rm4pO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50W2BnZXQke2NhcE5hbWV9YF0gPSBnZXRGbjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudFtgc2V0JHtjYXBOYW1lfWBdID0gc2V0Rm47XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvLyBgc3JjYCBpcyBhIHByb3BlcnR5IHNlcGFyYXRlZCBmcm9tIHRoZSBvdGhlcnMgc2luY2UgaXQgY2FycmllcyB0aGUgbG9naWMgdG8gc2V0IHRoZSBwcm9wZXIgcmVuZGVyZXJcblx0XHRcdC8vIGJhc2VkIG9uIHRoZSBtZWRpYSBmaWxlcyBkZXRlY3RlZFxuXHRcdFx0Z2V0U3JjID0gKCkgPT4gKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpID8gdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuZ2V0U3JjKCkgOiBudWxsLFxuXHRcdFx0c2V0U3JjID0gKHZhbHVlKSA9PiB7XG5cblx0XHRcdFx0bGV0IG1lZGlhRmlsZXMgPSBbXTtcblxuXHRcdFx0XHQvLyBjbGVhbiB1cCBVUkxzXG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHNyYzogdmFsdWUsXG5cdFx0XHRcdFx0XHR0eXBlOiB2YWx1ZSA/IGdldFR5cGVGcm9tRmlsZSh2YWx1ZSkgOiAnJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gdmFsdWUubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0c3JjID0gYWJzb2x1dGl6ZVVybCh2YWx1ZVtpXS5zcmMpLFxuXHRcdFx0XHRcdFx0XHR0eXBlID0gdmFsdWVbaV0udHlwZVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRcdFx0dHlwZTogKHR5cGUgPT09ICcnIHx8IHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSAmJiBzcmMgP1xuXHRcdFx0XHRcdFx0XHRcdGdldFR5cGVGcm9tRmlsZShzcmMpIDogdHlwZVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaW5kIGEgcmVuZGVyZXIgYW5kIFVSTCBtYXRjaFxuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHRyZW5kZXJJbmZvID0gcmVuZGVyZXIuc2VsZWN0KG1lZGlhRmlsZXMsXG5cdFx0XHRcdFx0XHQodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMubGVuZ3RoID8gdC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMgOiBbXSkpLFxuXHRcdFx0XHRcdGV2ZW50XG5cdFx0XHRcdDtcblxuXHRcdFx0XHQvLyBFbnN1cmUgdGhhdCB0aGUgb3JpZ2luYWwgZ2V0cyB0aGUgZmlyc3Qgc291cmNlIGZvdW5kXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIChtZWRpYUZpbGVzWzBdLnNyYyB8fCAnJykpO1xuXG5cdFx0XHRcdC8vIGRpZCB3ZSBmaW5kIGEgcmVuZGVyZXI/XG5cdFx0XHRcdGlmIChyZW5kZXJJbmZvID09PSBudWxsKSB7XG5cdFx0XHRcdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudCgnZXJyb3InLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdGV2ZW50Lm1lc3NhZ2UgPSAnTm8gcmVuZGVyZXIgZm91bmQnO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHR1cm4gb24gdGhlIHJlbmRlcmVyICh0aGlzIGNoZWNrcyBmb3IgdGhlIGV4aXN0aW5nIHJlbmRlcmVyIGFscmVhZHkpXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LmNoYW5nZVJlbmRlcmVyKHJlbmRlckluZm8ucmVuZGVyZXJOYW1lLCBtZWRpYUZpbGVzKTtcblxuXHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPT09IHVuZGVmaW5lZCB8fCB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoJ2Vycm9yJywgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHRldmVudC5tZXNzYWdlID0gJ0Vycm9yIGNyZWF0aW5nIHJlbmRlcmVyJztcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFzc2lnbk1ldGhvZHMgPSAobWV0aG9kTmFtZSkgPT4ge1xuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgY3VycmVudCByZW5kZXJlclxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudFttZXRob2ROYW1lXSA9ICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHR0eXBlb2YgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXJbbWV0aG9kTmFtZV0gPT09ICdmdW5jdGlvbicpID9cblx0XHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW21ldGhvZE5hbWVdKGFyZ3MpIDogbnVsbDtcblx0XHRcdFx0fTtcblxuXHRcdFx0fTtcblxuXHRcdC8vIEFzc2lnbiBhbGwgbWV0aG9kcy9wcm9wZXJ0aWVzL2V2ZW50cyB0byBmYWtlIG5vZGUgaWYgcmVuZGVyZXIgd2FzIGZvdW5kXG5cdFx0YWRkUHJvcGVydHkodC5tZWRpYUVsZW1lbnQsICdzcmMnLCBnZXRTcmMsIHNldFNyYyk7XG5cdFx0dC5tZWRpYUVsZW1lbnQuZ2V0U3JjID0gZ2V0U3JjO1xuXHRcdHQubWVkaWFFbGVtZW50LnNldFNyYyA9IHNldFNyYztcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIElFICYmIGlPU1xuXHRcdGlmICghdC5tZWRpYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHMgPSB7fTtcblxuXHRcdFx0Ly8gc3RhcnQ6IGZha2UgZXZlbnRzXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5hZGRFdmVudExpc3RlbmVyID0gKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+IHtcblx0XHRcdFx0Ly8gY3JlYXRlIG9yIGZpbmQgdGhlIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgdGhpcyBldmVudE5hbWVcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gPSB0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcblxuXHRcdFx0XHQvLyBwdXNoIHRoZSBjYWxsYmFjayBpbnRvIHRoZSBzdGFja1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcblx0XHRcdH07XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyID0gKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+IHtcblx0XHRcdFx0Ly8gbm8gZXZlbnROYW1lIG1lYW5zIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG5cdFx0XHRcdGlmICghZXZlbnROYW1lKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzID0ge307XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzZWUgaWYgd2UgaGF2ZSBhbnkgY2FsbGJhY2tzIGZvciB0aGlzIGV2ZW50TmFtZVxuXHRcdFx0XHRsZXQgY2FsbGJhY2tzID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV07XG5cblx0XHRcdFx0aWYgKCFjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNoZWNrIGZvciBhIHNwZWNpZmljIGNhbGxiYWNrXG5cdFx0XHRcdGlmICghY2FsbGJhY2spIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXSA9IFtdO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBzcGVjaWZpYyBjYWxsYmFja1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdGlmIChjYWxsYmFja3NbaV0gPT09IGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcblx0XHRcdCAqL1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudCA9IChldmVudCkgPT4ge1xuXG5cdFx0XHRcdGxldCBjYWxsYmFja3MgPSB0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnQudHlwZV07XG5cblx0XHRcdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrc1tpXS5hcHBseShudWxsLCBbZXZlbnRdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gbnVsbCkge1xuXHRcdFx0bGV0IG1lZGlhRmlsZXMgPSBbXTtcblxuXHRcdFx0c3dpdGNoICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdFx0XHRcdGNhc2UgJ2lmcmFtZSc6XG5cdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHR5cGU6ICcnLFxuXHRcdFx0XHRcdFx0c3JjOiB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnYXVkaW8nOlxuXHRcdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRuLFxuXHRcdFx0XHRcdFx0c3JjLFxuXHRcdFx0XHRcdFx0dHlwZSxcblx0XHRcdFx0XHRcdHNvdXJjZXMgPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRub2RlU291cmNlID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnc3JjJylcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdC8vIENvbnNpZGVyIGlmIG5vZGUgY29udGFpbnMgdGhlIGBzcmNgIGFuZCBgdHlwZWAgYXR0cmlidXRlc1xuXHRcdFx0XHRcdGlmIChub2RlU291cmNlKSB7XG5cdFx0XHRcdFx0XHRsZXQgbm9kZSA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZTtcblx0XHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IGZvcm1hdFR5cGUobm9kZVNvdXJjZSwgbm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSksXG5cdFx0XHRcdFx0XHRcdHNyYzogbm9kZVNvdXJjZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdGVzdCA8c291cmNlPiB0eXBlcyB0byBzZWUgaWYgdGhleSBhcmUgdXNhYmxlXG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHNvdXJjZXM7IGkrKykge1xuXHRcdFx0XHRcdFx0biA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKG4ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIG4udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc291cmNlJykge1xuXHRcdFx0XHRcdFx0XHRzcmMgPSBuLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBmb3JtYXRUeXBlKHNyYywgbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7dHlwZTogdHlwZSwgc3JjOiBzcmN9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuc3JjID0gbWVkaWFGaWxlcztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnN1Y2Nlc3ModC5tZWRpYUVsZW1lbnQsIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0fVxuXG5cdFx0Ly8gQHRvZG86IFZlcmlmeSBpZiB0aGlzIGlzIG5lZWRlZFxuXHRcdC8vIGlmICh0Lm1lZGlhRWxlbWVudC5vcHRpb25zLmVycm9yKSB7XG5cdFx0Ly8gXHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zLmVycm9yKHRoaXMubWVkaWFFbGVtZW50LCB0aGlzLm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdC8vIH1cblxuXHRcdHJldHVybiB0Lm1lZGlhRWxlbWVudDtcblx0fVxufVxuXG53aW5kb3cuTWVkaWFFbGVtZW50ID0gTWVkaWFFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCBNZWRpYUVsZW1lbnQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG4vLyBOYW1lc3BhY2VcbmxldCBtZWpzID0ge307XG5cbi8vIHZlcnNpb24gbnVtYmVyXG5tZWpzLnZlcnNpb24gPSAnMy4wLjAnO1xuXG4vLyBCYXNpYyBIVE1MNSBzZXR0aW5nc1xubWVqcy5odG1sNW1lZGlhID0ge1xuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0cHJvcGVydGllczogW1xuXHRcdC8vIEdFVC9TRVRcblx0XHQndm9sdW1lJywgJ3NyYycsICdjdXJyZW50VGltZScsICdtdXRlZCcsXG5cblx0XHQvLyBHRVQgb25seVxuXHRcdCdkdXJhdGlvbicsICdwYXVzZWQnLCAnZW5kZWQnLFxuXG5cdFx0Ly8gT1RIRVJTXG5cdFx0J2Vycm9yJywgJ2N1cnJlbnRTcmMnLCAnbmV0d29ya1N0YXRlJywgJ3ByZWxvYWQnLCAnYnVmZmVyZWQnLCAnYnVmZmVyZWRCeXRlcycsICdidWZmZXJlZFRpbWUnLCAncmVhZHlTdGF0ZScsICdzZWVraW5nJyxcblx0XHQnaW5pdGlhbFRpbWUnLCAnc3RhcnRPZmZzZXRUaW1lJywgJ2RlZmF1bHRQbGF5YmFja1JhdGUnLCAncGxheWJhY2tSYXRlJywgJ3BsYXllZCcsICdzZWVrYWJsZScsICdhdXRvcGxheScsICdsb29wJywgJ2NvbnRyb2xzJ1xuXHRdLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0bWV0aG9kczogW1xuXHRcdCdsb2FkJywgJ3BsYXknLCAncGF1c2UnLCAnY2FuUGxheVR5cGUnXG5cdF0sXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRldmVudHM6IFtcblx0XHQnbG9hZHN0YXJ0JywgJ3Byb2dyZXNzJywgJ3N1c3BlbmQnLCAnYWJvcnQnLCAnZXJyb3InLCAnZW1wdGllZCcsICdzdGFsbGVkJywgJ3BsYXknLCAncGF1c2UnLCAnbG9hZGVkbWV0YWRhdGEnLFxuXHRcdCdsb2FkZWRkYXRhJywgJ3dhaXRpbmcnLCAncGxheWluZycsICdjYW5wbGF5JywgJ2NhbnBsYXl0aHJvdWdoJywgJ3NlZWtpbmcnLCAnc2Vla2VkJywgJ3RpbWV1cGRhdGUnLCAnZW5kZWQnLFxuXHRcdCdyYXRlY2hhbmdlJywgJ2R1cmF0aW9uY2hhbmdlJywgJ3ZvbHVtZWNoYW5nZSdcblx0XSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdG1lZGlhVHlwZXM6IFtcblx0XHQnYXVkaW8vbXAzJywgJ2F1ZGlvL29nZycsICdhdWRpby9vZ2EnLCAnYXVkaW8vd2F2JywgJ2F1ZGlvL3gtd2F2JywgJ2F1ZGlvL3dhdmUnLCAnYXVkaW8veC1wbi13YXYnLCAnYXVkaW8vbXBlZycsICdhdWRpby9tcDQnLFxuXHRcdCd2aWRlby9tcDQnLCAndmlkZW8vd2VibScsICd2aWRlby9vZ2cnXG5cdF1cbn07XG5cbndpbmRvdy5tZWpzID0gbWVqcztcblxuZXhwb3J0IGRlZmF1bHQgbWVqczsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5cbi8qKlxuICpcbiAqIENsYXNzIHRvIG1hbmFnZSByZW5kZXJlciBzZWxlY3Rpb24gYW5kIGFkZGl0aW9uLlxuICogQGNsYXNzIFJlbmRlcmVyXG4gKi9cbmNsYXNzIFJlbmRlcmVyIHtcblxuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0dGhpcy5yZW5kZXJlcnMgPSB7fTtcblx0XHR0aGlzLm9yZGVyID0gW107XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYSBuZXcgcmVuZGVyZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlciAtIEFuIG9iamVjdCB3aXRoIGFsbCB0aGUgcmVuZGVyZWQgaW5mb3JtYXRpb24gKG5hbWUgUkVRVUlSRUQpXG5cdCAqIEBtZXRob2QgYWRkXG5cdCAqL1xuXHRhZGQgKHJlbmRlcmVyKSB7XG5cblx0XHRpZiAocmVuZGVyZXIubmFtZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdyZW5kZXJlciBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgYG5hbWVgIHByb3BlcnR5Jyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXJlcnNbcmVuZGVyZXIubmFtZV0gPSByZW5kZXJlcjtcblx0XHR0aGlzLm9yZGVyLnB1c2gocmVuZGVyZXIubmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogSXRlcmF0ZSBhIGxpc3Qgb2YgcmVuZGVyZXJzIHRvIGRldGVybWluZSB3aGljaCBvbmUgc2hvdWxkIHRoZSBwbGF5ZXIgdXNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIC0gQSBsaXN0IG9mIHNvdXJjZSBhbmQgdHlwZSBvYnRhaW5lZCBmcm9tIHZpZGVvL2F1ZGlvL3NvdXJjZSB0YWdzOiBbe3NyYzonJyx0eXBlOicnfV1cblx0ICogQHBhcmFtIHs/U3RyaW5nW119IHJlbmRlcmVycyAtIE9wdGlvbmFsIGxpc3Qgb2YgcHJlLXNlbGVjdGVkIHJlbmRlcmVyc1xuXHQgKiBAcmV0dXJuIHs/T2JqZWN0fSBUaGUgcmVuZGVyZXIncyBuYW1lIGFuZCBzb3VyY2Ugc2VsZWN0ZWRcblx0ICogQG1ldGhvZCBzZWxlY3Rcblx0ICovXG5cdHNlbGVjdCAobWVkaWFGaWxlcywgcmVuZGVyZXJzID0gW10pIHtcblxuXHRcdHJlbmRlcmVycyA9IHJlbmRlcmVycy5sZW5ndGggPyByZW5kZXJlcnM6IHRoaXMub3JkZXI7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0bGV0XG5cdFx0XHRcdGtleSA9IHJlbmRlcmVyc1tpXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyc1trZXldXG5cdFx0XHQ7XG5cblx0XHRcdGlmIChyZW5kZXJlciAhPT0gbnVsbCAmJiByZW5kZXJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSAwLCBqbCA9IG1lZGlhRmlsZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcmVuZGVyZXIuY2FuUGxheVR5cGUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG1lZGlhRmlsZXNbal0udHlwZSA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFx0XHRcdHJlbmRlcmVyLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbal0udHlwZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHJlbmRlcmVyTmFtZTogcmVuZGVyZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0c3JjOiAgbWVkaWFGaWxlc1tqXS5zcmNcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBTZXR0ZXJzL2dldHRlcnNcblxuXHRzZXQgb3JkZXIob3JkZXIpIHtcblxuXHRcdGlmICghQXJyYXkuaXNBcnJheShvcmRlcikpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ29yZGVyIG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncy4nKTtcblx0XHR9XG5cblx0XHR0aGlzLl9vcmRlciA9IG9yZGVyO1xuXHR9XG5cblx0c2V0IHJlbmRlcmVycyhyZW5kZXJlcnMpIHtcblxuXHRcdGlmIChyZW5kZXJlcnMgIT09IG51bGwgJiYgdHlwZW9mIHJlbmRlcmVycyAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlbmRlcmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIG9iamVjdHMuJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcmVuZGVyZXJzID0gcmVuZGVyZXJzO1xuXHR9XG5cblx0Z2V0IHJlbmRlcmVycygpIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyZXJzO1xuXHR9XG5cblx0Z2V0IG9yZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLl9vcmRlcjtcblx0fVxufVxuXG5leHBvcnQgbGV0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCk7XG5cbm1lanMuUmVuZGVyZXJzID0gcmVuZGVyZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0ICogYXMgRmVhdHVyZXMgZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcblxuXG4vKipcbiAqIEZ1bGxzY3JlZW4gYnV0dG9uXG4gKlxuICogVGhpcyBmZWF0dXJlIGNyZWF0ZXMgYSBidXR0b24gdG8gdG9nZ2xlIGZ1bGxzY3JlZW4gb24gdmlkZW87IGl0IGNvbnNpZGVycyBhIGxldGlldHkgb2YgcG9zc2liaWxpdGllcyB3aGVuIGRlYWxpbmcgd2l0aCBpdFxuICogc2luY2UgaXQgaXMgbm90IGNvbnNpc3RlbnQgYWNyb3NzIGJyb3dzZXJzLiBJdCBhbHNvIGFjY291bnRzIGZvciB0cmlnZ2VyaW5nIHRoZSBldmVudCB0aHJvdWdoIEZsYXNoIHNoaW0uXG4gKi9cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHR1c2VQbHVnaW5GdWxsU2NyZWVuOiB0cnVlLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdGZ1bGxzY3JlZW5UZXh0OiAnJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzRnVsbFNjcmVlbjogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTmF0aXZlRnVsbFNjcmVlbjogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSW5JZnJhbWU6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc1BsdWdpbkNsaWNrVGhyb3VnaENyZWF0ZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogUG9zc2libGUgbW9kZXNcblx0ICogKDEpICduYXRpdmUtbmF0aXZlJyAgSFRNTDUgdmlkZW8gICsgYnJvd3NlciBmdWxsc2NyZWVuIChJRTEwKywgZXRjLilcblx0ICogKDIpICdwbHVnaW4tbmF0aXZlJyAgcGx1Z2luIHZpZGVvICsgYnJvd3NlciBmdWxsc2NyZWVuIChmYWlscyBpbiBzb21lIHZlcnNpb25zIG9mIEZpcmVmb3gpXG5cdCAqICgzKSAnZnVsbHdpbmRvdycgICAgIEZ1bGwgd2luZG93IChyZXRhaW5zIGFsbCBVSSlcblx0ICogKDQpICdwbHVnaW4tY2xpY2snICAgRmxhc2ggMSAtIGNsaWNrIHRocm91Z2ggd2l0aCBwb2ludGVyIGV2ZW50c1xuXHQgKiAoNSkgJ3BsdWdpbi1ob3ZlcicgICBGbGFzaCAyIC0gaG92ZXIgcG9wdXAgaW4gZmxhc2ggKElFNi04KVxuXHQgKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0ZnVsbHNjcmVlbk1vZGU6ICcnLFxuXHQvKipcblx0ICpcblx0ICovXG5cdGNvbnRhaW5lclNpemVUaW1lb3V0OiBudWxsLFxuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkZnVsbHNjcmVlbjogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cblx0XHRpZiAoIXBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cGxheWVyLmlzSW5JZnJhbWUgPSAod2luZG93LmxvY2F0aW9uICE9PSB3aW5kb3cucGFyZW50LmxvY2F0aW9uKTtcblxuXHRcdC8vIGRldGVjdCBvbiBzdGFydFxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsICgpID0+IHtcblx0XHRcdHBsYXllci5kZXRlY3RGdWxsc2NyZWVuTW9kZSgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gYnVpbGQgYnV0dG9uXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGhpZGVUaW1lb3V0ID0gbnVsbCxcblx0XHRcdGZ1bGxzY3JlZW5UaXRsZSA9IHQub3B0aW9ucy5mdWxsc2NyZWVuVGV4dCA/IHQub3B0aW9ucy5mdWxsc2NyZWVuVGV4dCA6IGkxOG4udCgnbWVqcy5mdWxsc2NyZWVuJyksXG5cdFx0XHRmdWxsc2NyZWVuQnRuID1cblx0XHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1mdWxsc2NyZWVuLWJ1dHRvblwiPmAgK1xuXHRcdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHtmdWxsc2NyZWVuVGl0bGV9XCIgYXJpYS1sYWJlbD1cIiR7ZnVsbHNjcmVlblRpdGxlfVwiPjwvYnV0dG9uPmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKVxuXHRcdFx0XHQub24oJ2NsaWNrJywgKCkgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gdG9nZ2xlIGZ1bGxzY3JlZW5cblx0XHRcdFx0XHRsZXQgaXNGdWxsU2NyZWVuID0gKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIEZlYXR1cmVzLklTX0ZVTExTQ1JFRU4pIHx8IHBsYXllci5pc0Z1bGxTY3JlZW47XG5cblx0XHRcdFx0XHRpZiAoaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGxheWVyLmVudGVyRnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cblx0XHRcdFx0XHQvLyB2ZXJ5IG9sZCBicm93c2VycyB3aXRoIGEgcGx1Z2luXG5cdFx0XHRcdFx0aWYgKHQuZnVsbHNjcmVlbk1vZGUgPT09ICdwbHVnaW4taG92ZXInKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGlkZVRpbWVvdXQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGhpZGVUaW1lb3V0KTtcblx0XHRcdFx0XHRcdFx0aGlkZVRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgYnV0dG9uUG9zID0gZnVsbHNjcmVlbkJ0bi5vZmZzZXQoKSxcblx0XHRcdFx0XHRcdFx0Y29udGFpbmVyUG9zID0gcGxheWVyLmNvbnRhaW5lci5vZmZzZXQoKTtcblxuXHRcdFx0XHRcdFx0bWVkaWEucG9zaXRpb25GdWxsc2NyZWVuQnV0dG9uKGJ1dHRvblBvcy5sZWZ0IC0gY29udGFpbmVyUG9zLmxlZnQsIGJ1dHRvblBvcy50b3AgLSBjb250YWluZXJQb3MudG9wLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdtb3VzZW91dCcsICgpID0+IHtcblxuXHRcdFx0XHRcdGlmICh0LmZ1bGxzY3JlZW5Nb2RlID09PSAncGx1Z2luLWhvdmVyJykge1xuXHRcdFx0XHRcdFx0aWYgKGhpZGVUaW1lb3V0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGhpZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLmhpZGVGdWxsc2NyZWVuQnV0dG9uKCk7XG5cdFx0XHRcdFx0XHR9LCAxNTAwKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSk7XG5cblxuXHRcdHBsYXllci5mdWxsc2NyZWVuQnRuID0gZnVsbHNjcmVlbkJ0bjtcblxuXHRcdHQuZ2xvYmFsQmluZCgna2V5ZG93bicsIChlKSA9PiB7XG5cdFx0XHRsZXQga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGUgfHwgMDtcblx0XHRcdGlmIChrZXkgPT09IDI3ICYmICgoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgRmVhdHVyZXMuSVNfRlVMTFNDUkVFTikgfHwgdC5pc0Z1bGxTY3JlZW4pKSB7XG5cdFx0XHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dC5ub3JtYWxIZWlnaHQgPSAwO1xuXHRcdHQubm9ybWFsV2lkdGggPSAwO1xuXG5cdFx0Ly8gc2V0dXAgbmF0aXZlIGZ1bGxzY3JlZW4gZXZlbnRcblx0XHRpZiAoRmVhdHVyZXMuSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4pIHtcblxuXHRcdFx0Ly9cblx0XHRcdC8qKlxuXHRcdFx0ICogRGV0ZWN0IGFueSBjaGFuZ2VzIG9uIGZ1bGxzY3JlZW5cblx0XHRcdCAqXG5cdFx0XHQgKiBDaHJvbWUgZG9lc24ndCBhbHdheXMgZmlyZSB0aGlzIGluIGFuIGA8aWZyYW1lPmBcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGNvbnN0IGZ1bGxzY3JlZW5DaGFuZ2VkID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAocGxheWVyLmlzRnVsbFNjcmVlbikge1xuXHRcdFx0XHRcdGlmIChGZWF0dXJlcy5pc0Z1bGxTY3JlZW4oKSkge1xuXHRcdFx0XHRcdFx0cGxheWVyLmlzTmF0aXZlRnVsbFNjcmVlbiA9IHRydWU7XG5cdFx0XHRcdFx0XHQvLyByZXNldCB0aGUgY29udHJvbHMgb25jZSB3ZSBhcmUgZnVsbHkgaW4gZnVsbCBzY3JlZW5cblx0XHRcdFx0XHRcdHBsYXllci5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGxheWVyLmlzTmF0aXZlRnVsbFNjcmVlbiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Ly8gd2hlbiBhIHVzZXIgcHJlc3NlcyBFU0Ncblx0XHRcdFx0XHRcdC8vIG1ha2Ugc3VyZSB0byBwdXQgdGhlIHBsYXllciBiYWNrIGludG8gcGxhY2Vcblx0XHRcdFx0XHRcdHBsYXllci5leGl0RnVsbFNjcmVlbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cGxheWVyLmdsb2JhbEJpbmQoRmVhdHVyZXMuRlVMTFNDUkVFTl9FVkVOVF9OQU1FLCBmdWxsc2NyZWVuQ2hhbmdlZCk7XG5cdFx0fVxuXG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVjdCB0aGUgdHlwZSBvZiBmdWxsc2NyZWVuIGJhc2VkIG9uIGJyb3dzZXIncyBjYXBhYmlsaXRpZXNcblx0ICpcblx0ICogQHJldHVybiB7U3RyaW5nfVxuXHQgKi9cblx0ZGV0ZWN0RnVsbHNjcmVlbk1vZGU6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bW9kZSA9ICcnLFxuXHRcdFx0aXNOYXRpdmUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbFxuXHRcdDtcblxuXHRcdGlmIChGZWF0dXJlcy5IQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTiAmJiBpc05hdGl2ZSkge1xuXHRcdFx0bW9kZSA9ICduYXRpdmUtbmF0aXZlJztcblx0XHR9IGVsc2UgaWYgKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmICFpc05hdGl2ZSkge1xuXHRcdFx0bW9kZSA9ICdwbHVnaW4tbmF0aXZlJztcblx0XHR9IGVsc2UgaWYgKHQudXNlUGx1Z2luRnVsbFNjcmVlbikge1xuXHRcdFx0aWYgKEZlYXR1cmVzLlNVUFBPUlRfUE9JTlRFUl9FVkVOVFMpIHtcblx0XHRcdFx0bW9kZSA9ICdwbHVnaW4tY2xpY2snO1xuXHRcdFx0XHQvLyB0aGlzIG5lZWRzIHNvbWUgc3BlY2lhbCBzZXR1cFxuXHRcdFx0XHR0LmNyZWF0ZVBsdWdpbkNsaWNrVGhyb3VnaCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bW9kZSA9ICdwbHVnaW4taG92ZXInO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdG1vZGUgPSAnZnVsbHdpbmRvdyc7XG5cdFx0fVxuXG5cblx0XHR0LmZ1bGxzY3JlZW5Nb2RlID0gbW9kZTtcblx0XHRyZXR1cm4gbW9kZTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGNyZWF0ZVBsdWdpbkNsaWNrVGhyb3VnaDogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIGRvbid0IGJ1aWxkIHR3aWNlXG5cdFx0aWYgKHQuaXNQbHVnaW5DbGlja1Rocm91Z2hDcmVhdGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3dzIGNsaWNraW5nIHRocm91Z2ggdGhlIGZ1bGxzY3JlZW4gYnV0dG9uIGFuZCBjb250cm9scyBkb3duIGRpcmVjdGx5IHRvIEZsYXNoXG5cblx0XHQvKlxuXHRcdCBXaGVuIGEgdXNlciBwdXRzIGhpcyBtb3VzZSBvdmVyIHRoZSBmdWxsc2NyZWVuIGJ1dHRvbiwgd2UgZGlzYWJsZSB0aGUgY29udHJvbHMgc28gdGhhdCBtb3VzZSBldmVudHMgY2FuIGdvIGRvd24gdG8gZmxhc2ggKHBvaW50ZXItZXZlbnRzKVxuXHRcdCBXZSB0aGVuIHB1dCBhIGRpdnMgb3ZlciB0aGUgdmlkZW8gYW5kIG9uIGVpdGhlciBzaWRlIG9mIHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXHRcdCB0byBjYXB0dXJlIG1vdXNlIG1vdmVtZW50IGFuZCByZXN0b3JlIHRoZSBjb250cm9scyBvbmNlIHRoZSBtb3VzZSBtb3ZlcyBvdXRzaWRlIG9mIHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXHRcdCAqL1xuXG5cdFx0bGV0IGZ1bGxzY3JlZW5Jc0Rpc2FibGVkID0gZmFsc2UsXG5cdFx0XHRyZXN0b3JlQ29udHJvbHMgPSAoKSA9PiB7XG5cdFx0XHRcdGlmIChmdWxsc2NyZWVuSXNEaXNhYmxlZCkge1xuXHRcdFx0XHRcdC8vIGhpZGUgdGhlIGhvdmVyc1xuXHRcdFx0XHRcdGZvciAobGV0IGkgaW4gaG92ZXJEaXZzKSB7XG5cdFx0XHRcdFx0XHRob3ZlckRpdnNbaV0uaGlkZSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHJlc3RvcmUgdGhlIGNvbnRyb2wgYmFyXG5cdFx0XHRcdFx0dC5mdWxsc2NyZWVuQnRuLmNzcygncG9pbnRlci1ldmVudHMnLCAnJyk7XG5cdFx0XHRcdFx0dC5jb250cm9scy5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJycpO1xuXG5cdFx0XHRcdFx0Ly8gcHJldmVudCBjbGlja3MgZnJvbSBwYXVzaW5nIHZpZGVvXG5cdFx0XHRcdFx0dC5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrKTtcblxuXHRcdFx0XHRcdC8vIHN0b3JlIGZvciBsYXRlclxuXHRcdFx0XHRcdGZ1bGxzY3JlZW5Jc0Rpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRob3ZlckRpdnMgPSB7fSxcblx0XHRcdGhvdmVyRGl2TmFtZXMgPSBbJ3RvcCcsICdsZWZ0JywgJ3JpZ2h0JywgJ2JvdHRvbSddLFxuXHRcdFx0cG9zaXRpb25Ib3ZlckRpdnMgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBmdWxsU2NyZWVuQnRuT2Zmc2V0TGVmdCA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCkubGVmdCAtIHQuY29udGFpbmVyLm9mZnNldCgpLmxlZnQsXG5cdFx0XHRcdFx0ZnVsbFNjcmVlbkJ0bk9mZnNldFRvcCA9IGZ1bGxzY3JlZW5CdG4ub2Zmc2V0KCkudG9wIC0gdC5jb250YWluZXIub2Zmc2V0KCkudG9wLFxuXHRcdFx0XHRcdGZ1bGxTY3JlZW5CdG5XaWR0aCA9IGZ1bGxzY3JlZW5CdG4ub3V0ZXJXaWR0aCh0cnVlKSxcblx0XHRcdFx0XHRmdWxsU2NyZWVuQnRuSGVpZ2h0ID0gZnVsbHNjcmVlbkJ0bi5vdXRlckhlaWdodCh0cnVlKSxcblx0XHRcdFx0XHRjb250YWluZXJXaWR0aCA9IHQuY29udGFpbmVyLndpZHRoKCksXG5cdFx0XHRcdFx0Y29udGFpbmVySGVpZ2h0ID0gdC5jb250YWluZXIuaGVpZ2h0KCk7XG5cblx0XHRcdFx0Zm9yIChsZXQgaG92ZXIgaW4gaG92ZXJEaXZzKSB7XG5cdFx0XHRcdFx0aG92ZXIuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwfSk7IC8vLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZjAwJ30pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gb3ZlciB2aWRlbywgYnV0IG5vdCBjb250cm9sc1xuXHRcdFx0XHRob3ZlckRpdnMudG9wXG5cdFx0XHRcdFx0LndpZHRoKGNvbnRhaW5lcldpZHRoKVxuXHRcdFx0XHRcdC5oZWlnaHQoZnVsbFNjcmVlbkJ0bk9mZnNldFRvcCk7XG5cblx0XHRcdFx0Ly8gb3ZlciBjb250cm9scywgYnV0IG5vdCB0aGUgZnVsbHNjcmVlbiBidXR0b25cblx0XHRcdFx0aG92ZXJEaXZzLmxlZnRcblx0XHRcdFx0XHQud2lkdGgoZnVsbFNjcmVlbkJ0bk9mZnNldExlZnQpXG5cdFx0XHRcdFx0LmhlaWdodChmdWxsU2NyZWVuQnRuSGVpZ2h0KVxuXHRcdFx0XHRcdC5jc3Moe3RvcDogZnVsbFNjcmVlbkJ0bk9mZnNldFRvcH0pO1xuXG5cdFx0XHRcdC8vIGFmdGVyIHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXHRcdFx0XHRob3ZlckRpdnMucmlnaHRcblx0XHRcdFx0XHQud2lkdGgoY29udGFpbmVyV2lkdGggLSBmdWxsU2NyZWVuQnRuT2Zmc2V0TGVmdCAtIGZ1bGxTY3JlZW5CdG5XaWR0aClcblx0XHRcdFx0XHQuaGVpZ2h0KGZ1bGxTY3JlZW5CdG5IZWlnaHQpXG5cdFx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0XHR0b3A6IGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3AsXG5cdFx0XHRcdFx0XHRsZWZ0OiBmdWxsU2NyZWVuQnRuT2Zmc2V0TGVmdCArIGZ1bGxTY3JlZW5CdG5XaWR0aFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIHVuZGVyIHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXHRcdFx0XHRob3ZlckRpdnMuYm90dG9tXG5cdFx0XHRcdFx0LndpZHRoKGNvbnRhaW5lcldpZHRoKVxuXHRcdFx0XHRcdC5oZWlnaHQoY29udGFpbmVySGVpZ2h0IC0gZnVsbFNjcmVlbkJ0bkhlaWdodCAtIGZ1bGxTY3JlZW5CdG5PZmZzZXRUb3ApXG5cdFx0XHRcdFx0LmNzcyh7dG9wOiBmdWxsU2NyZWVuQnRuT2Zmc2V0VG9wICsgZnVsbFNjcmVlbkJ0bkhlaWdodH0pO1xuXHRcdFx0fTtcblxuXHRcdHQuZ2xvYmFsQmluZCgncmVzaXplJywgKCkgPT4ge1xuXHRcdFx0cG9zaXRpb25Ib3ZlckRpdnMoKTtcblx0XHR9KTtcblxuXHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBob3ZlckRpdk5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRob3ZlckRpdnNbaG92ZXJEaXZOYW1lc1tpXV0gPSAkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbi1ob3ZlclwiIC8+YClcblx0XHRcdFx0LmFwcGVuZFRvKHQuY29udGFpbmVyKS5tb3VzZW92ZXIocmVzdG9yZUNvbnRyb2xzKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gb24gaG92ZXIsIGtpbGwgdGhlIGZ1bGxzY3JlZW4gYnV0dG9uJ3MgSFRNTCBoYW5kbGluZywgYWxsb3dpbmcgY2xpY2tzIGRvd24gdG8gRmxhc2hcblx0XHRmdWxsc2NyZWVuQnRuLm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cblx0XHRcdGlmICghdC5pc0Z1bGxTY3JlZW4pIHtcblxuXHRcdFx0XHRsZXQgYnV0dG9uUG9zID0gZnVsbHNjcmVlbkJ0bi5vZmZzZXQoKSxcblx0XHRcdFx0XHRjb250YWluZXJQb3MgPSBwbGF5ZXIuY29udGFpbmVyLm9mZnNldCgpO1xuXG5cdFx0XHRcdC8vIG1vdmUgdGhlIGJ1dHRvbiBpbiBGbGFzaCBpbnRvIHBsYWNlXG5cdFx0XHRcdG1lZGlhLnBvc2l0aW9uRnVsbHNjcmVlbkJ1dHRvbihidXR0b25Qb3MubGVmdCAtIGNvbnRhaW5lclBvcy5sZWZ0LCBidXR0b25Qb3MudG9wIC0gY29udGFpbmVyUG9zLnRvcCwgZmFsc2UpO1xuXG5cdFx0XHRcdC8vIGFsbG93cyBjbGljayB0aHJvdWdoXG5cdFx0XHRcdHQuZnVsbHNjcmVlbkJ0bi5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcblx0XHRcdFx0dC5jb250cm9scy5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcblxuXHRcdFx0XHQvLyByZXN0b3JlIGNsaWNrLXRvLXBsYXlcblx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHQuY2xpY2tUb1BsYXlQYXVzZUNhbGxiYWNrKTtcblxuXHRcdFx0XHQvLyBzaG93IHRoZSBkaXZzIHRoYXQgd2lsbCByZXN0b3JlIHRoaW5nc1xuXHRcdFx0XHRmb3IgKGxldCBpIGluIGhvdmVyRGl2cykge1xuXHRcdFx0XHRcdGhvdmVyRGl2c1tpXS5zaG93KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwb3NpdGlvbkhvdmVyRGl2cygpO1xuXG5cdFx0XHRcdGZ1bGxzY3JlZW5Jc0Rpc2FibGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0Ly8gcmVzdG9yZSBjb250cm9scyBhbnl0aW1lIHRoZSB1c2VyIGVudGVycyBvciBsZWF2ZXMgZnVsbHNjcmVlblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHR0LmlzRnVsbFNjcmVlbiA9ICF0LmlzRnVsbFNjcmVlbjtcblx0XHRcdC8vIGRvbid0IGFsbG93IHBsdWdpbiBjbGljayB0byBwYXVzZSB2aWRlbyAtIG1lc3NlcyB3aXRoXG5cdFx0XHQvLyBwbHVnaW4ncyBjb250cm9sc1xuXHRcdFx0aWYgKHQuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdHQubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2spO1xuXHRcdFx0fVxuXHRcdFx0cmVzdG9yZUNvbnRyb2xzKCk7XG5cdFx0fSk7XG5cblxuXHRcdC8vIHRoZSBtb3VzZW91dCBldmVudCBkb2Vzbid0IHdvcmsgb24gdGhlIGZ1bGxzY3JlbiBidXR0b24sIGJlY2F1c2Ugd2UgYWxyZWFkeSBraWxsZWQgdGhlIHBvaW50ZXItZXZlbnRzXG5cdFx0Ly8gc28gd2UgdXNlIHRoZSBkb2N1bWVudC5tb3VzZW1vdmUgZXZlbnQgdG8gcmVzdG9yZSBjb250cm9scyB3aGVuIHRoZSBtb3VzZSBtb3ZlcyBvdXRzaWRlIHRoZSBmdWxsc2NyZWVuIGJ1dHRvblxuXG5cdFx0dC5nbG9iYWxCaW5kKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuXG5cdFx0XHQvLyBpZiB0aGUgbW91c2UgaXMgYW55d2hlcmUgYnV0IHRoZSBmdWxsc2NlZW4gYnV0dG9uLCB0aGVuIHJlc3RvcmUgaXQgYWxsXG5cdFx0XHRpZiAoZnVsbHNjcmVlbklzRGlzYWJsZWQpIHtcblxuXHRcdFx0XHRjb25zdCBmdWxsc2NyZWVuQnRuUG9zID0gZnVsbHNjcmVlbkJ0bi5vZmZzZXQoKTtcblxuXHRcdFx0XHRpZiAoZS5wYWdlWSA8IGZ1bGxzY3JlZW5CdG5Qb3MudG9wIHx8IGUucGFnZVkgPiBmdWxsc2NyZWVuQnRuUG9zLnRvcCArIGZ1bGxzY3JlZW5CdG4ub3V0ZXJIZWlnaHQodHJ1ZSkgfHxcblx0XHRcdFx0XHRlLnBhZ2VYIDwgZnVsbHNjcmVlbkJ0blBvcy5sZWZ0IHx8IGUucGFnZVggPiBmdWxsc2NyZWVuQnRuUG9zLmxlZnQgKyBmdWxsc2NyZWVuQnRuLm91dGVyV2lkdGgodHJ1ZSkpIHtcblxuXHRcdFx0XHRcdGZ1bGxzY3JlZW5CdG4uY3NzKCdwb2ludGVyLWV2ZW50cycsICcnKTtcblx0XHRcdFx0XHR0LmNvbnRyb2xzLmNzcygncG9pbnRlci1ldmVudHMnLCAnJyk7XG5cblx0XHRcdFx0XHRmdWxsc2NyZWVuSXNEaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXHRcdHQuaXNQbHVnaW5DbGlja1Rocm91Z2hDcmVhdGVkID0gdHJ1ZTtcblx0fSxcblx0LyoqXG5cdCAqIEZlYXR1cmUgZGVzdHJ1Y3Rvci5cblx0ICpcblx0ICogQWx3YXlzIGhhcyB0byBiZSBwcmVmaXhlZCB3aXRoIGBjbGVhbmAgYW5kIHRoZSBuYW1lIHRoYXQgd2FzIHVzZWQgaW4gZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqL1xuXHRjbGVhbmZ1bGxzY3JlZW46IGZ1bmN0aW9uIChwbGF5ZXIpICB7XG5cdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRlbnRlckZ1bGxTY3JlZW46IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aXNOYXRpdmUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKGh0bWw1fG5hdGl2ZSkvKSAhPT0gbnVsbFxuXHRcdDtcblxuXHRcdGlmIChGZWF0dXJlcy5JU19JT1MgJiYgRmVhdHVyZXMuSEFTX0lPU19GVUxMU0NSRUVOICYmIHR5cGVvZiB0Lm1lZGlhLndlYmtpdEVudGVyRnVsbHNjcmVlbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dC5tZWRpYS53ZWJraXRFbnRlckZ1bGxzY3JlZW4oKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBzZXQgaXQgdG8gbm90IHNob3cgc2Nyb2xsIGJhcnMgc28gMTAwJSB3aWxsIHdvcmtcblx0XHQkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW5gKTtcblxuXHRcdC8vIHN0b3JlIHNpemluZ1xuXHRcdHQubm9ybWFsSGVpZ2h0ID0gdC5jb250YWluZXIuaGVpZ2h0KCk7XG5cdFx0dC5ub3JtYWxXaWR0aCA9IHQuY29udGFpbmVyLndpZHRoKCk7XG5cblxuXHRcdC8vIGF0dGVtcHQgdG8gZG8gdHJ1ZSBmdWxsc2NyZWVuXG5cdFx0aWYgKHQuZnVsbHNjcmVlbk1vZGUgPT09ICduYXRpdmUtbmF0aXZlJyB8fCB0LmZ1bGxzY3JlZW5Nb2RlID09PSAncGx1Z2luLW5hdGl2ZScpIHtcblxuXHRcdFx0RmVhdHVyZXMucmVxdWVzdEZ1bGxTY3JlZW4odC5jb250YWluZXJbMF0pO1xuXG5cdFx0XHRpZiAodC5pc0luSWZyYW1lKSB7XG5cdFx0XHRcdC8vIHNvbWV0aW1lcyBleGl0aW5nIGZyb20gZnVsbHNjcmVlbiBkb2Vzbid0IHdvcmtcblx0XHRcdFx0Ly8gbm90YWJseSBpbiBDaHJvbWUgPGlmcmFtZT4uIEZpeGVkIGluIHZlcnNpb24gMTdcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiBjaGVja0Z1bGxzY3JlZW4gKCkge1xuXG5cdFx0XHRcdFx0aWYgKHQuaXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0XHRsZXQgcGVyY2VudEVycm9yTWFyZ2luID0gMC4wMDIsIC8vIDAuMiVcblx0XHRcdFx0XHRcdFx0d2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcblx0XHRcdFx0XHRcdFx0c2NyZWVuV2lkdGggPSBzY3JlZW4ud2lkdGgsXG5cdFx0XHRcdFx0XHRcdGFic0RpZmYgPSBNYXRoLmFicyhzY3JlZW5XaWR0aCAtIHdpbmRvd1dpZHRoKSxcblx0XHRcdFx0XHRcdFx0bWFyZ2luRXJyb3IgPSBzY3JlZW5XaWR0aCAqIHBlcmNlbnRFcnJvck1hcmdpbjtcblxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgaWYgdGhlIHZpZGVvIGlzIHN1ZGRlbmx5IG5vdCByZWFsbHkgZnVsbHNjcmVlblxuXHRcdFx0XHRcdFx0aWYgKGFic0RpZmYgPiBtYXJnaW5FcnJvcikge1xuXHRcdFx0XHRcdFx0XHQvLyBtYW51YWxseSBleGl0XG5cdFx0XHRcdFx0XHRcdHQuZXhpdEZ1bGxTY3JlZW4oKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vIHRlc3QgYWdhaW5cblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChjaGVja0Z1bGxzY3JlZW4sIDUwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sIDEwMDApO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICh0LmZ1bGxzY3JlZU1vZGUgPT09ICdmdWxsd2luZG93Jykge1xuXHRcdFx0Ly8gbW92ZSBpbnRvIHBvc2l0aW9uXG5cblx0XHR9XG5cblx0XHQvLyBtYWtlIGZ1bGwgc2l6ZVxuXHRcdHQuY29udGFpbmVyXG5cdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lci1mdWxsc2NyZWVuYClcblx0XHRcdC53aWR0aCgnMTAwJScpXG5cdFx0XHQuaGVpZ2h0KCcxMDAlJyk7XG5cblx0XHQvLyBPbmx5IG5lZWRlZCBmb3Igc2FmYXJpIDUuMSBuYXRpdmUgZnVsbCBzY3JlZW4sIGNhbiBjYXVzZSBkaXNwbGF5IGlzc3VlcyBlbHNld2hlcmVcblx0XHQvLyBBY3R1YWxseSwgaXQgc2VlbXMgdG8gYmUgbmVlZGVkIGZvciBJRTgsIHRvb1xuXHRcdHQuY29udGFpbmVyU2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHQuY29udGFpbmVyLmNzcyh7d2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9KTtcblx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChpc05hdGl2ZSkge1xuXHRcdFx0dC4kbWVkaWFcblx0XHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKCdpZnJhbWUsIGVtYmVkLCBvYmplY3QsIHZpZGVvJylcblx0XHRcdFx0LndpZHRoKCcxMDAlJylcblx0XHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXHRcdH1cblxuXHRcdGlmICh0Lm9wdGlvbnMuc2V0RGltZW5zaW9ucykge1xuXHRcdFx0dC5tZWRpYS5zZXRTaXplKHNjcmVlbi53aWR0aCwgc2NyZWVuLmhlaWdodCk7XG5cdFx0fVxuXG5cdFx0dC5sYXllcnMuY2hpbGRyZW4oJ2RpdicpXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXG5cdFx0aWYgKHQuZnVsbHNjcmVlbkJ0bikge1xuXHRcdFx0dC5mdWxsc2NyZWVuQnRuXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZnVsbHNjcmVlbmApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5mdWxsc2NyZWVuYCk7XG5cdFx0fVxuXG5cdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHR0LmlzRnVsbFNjcmVlbiA9IHRydWU7XG5cblx0XHRsZXQgem9vbUZhY3RvciA9IE1hdGgubWluKHNjcmVlbi53aWR0aCAvIHQud2lkdGgsIHNjcmVlbi5oZWlnaHQgLyB0LmhlaWdodCk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRgKS5jc3MoJ2ZvbnQtc2l6ZScsIHpvb21GYWN0b3IgKiAxMDAgKyAnJScpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdsaW5lLWhlaWdodCcsICdub3JtYWwnKTtcblx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb25gKS5jc3MoJ2JvdHRvbScsICc0NXB4Jyk7XG5cblx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdlbnRlcmVkZnVsbHNjcmVlbicpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZXhpdEZ1bGxTY3JlZW46IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aXNOYXRpdmUgPSB0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbFxuXHRcdFx0O1xuXG5cdFx0Ly8gUHJldmVudCBjb250YWluZXIgZnJvbSBhdHRlbXB0aW5nIHRvIHN0cmV0Y2ggYSBzZWNvbmQgdGltZVxuXHRcdGNsZWFyVGltZW91dCh0LmNvbnRhaW5lclNpemVUaW1lb3V0KTtcblxuXHRcdC8vIGNvbWUgb3V0IG9mIG5hdGl2ZSBmdWxsc2NyZWVuXG5cdFx0aWYgKEZlYXR1cmVzLkhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOICYmIChGZWF0dXJlcy5JU19GVUxMU0NSRUVOIHx8IHQuaXNGdWxsU2NyZWVuKSkge1xuXHRcdFx0RmVhdHVyZXMuY2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdH1cblxuXHRcdC8vIHJlc3RvcmUgc2Nyb2xsIGJhcnMgdG8gZG9jdW1lbnRcblx0XHQkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW5gKTtcblxuXHRcdHQuY29udGFpbmVyLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXItZnVsbHNjcmVlbmApO1xuXG5cdFx0aWYgKHQub3B0aW9ucy5zZXREaW1lbnNpb25zKSB7XG5cdFx0XHR0LmNvbnRhaW5lclxuXHRcdFx0XHQud2lkdGgodC5ub3JtYWxXaWR0aClcblx0XHRcdFx0LmhlaWdodCh0Lm5vcm1hbEhlaWdodCk7XG5cdFx0XHRpZiAoaXNOYXRpdmUpIHtcblx0XHRcdFx0dC4kbWVkaWFcblx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdC5oZWlnaHQodC5ub3JtYWxIZWlnaHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC5jb250YWluZXIuZmluZCgnaWZyYW1lLCBlbWJlZCwgb2JqZWN0LCB2aWRlbycpXG5cdFx0XHRcdFx0LndpZHRoKHQubm9ybWFsV2lkdGgpXG5cdFx0XHRcdFx0LmhlaWdodCh0Lm5vcm1hbEhlaWdodCk7XG5cdFx0XHR9XG5cblx0XHRcdHQubWVkaWEuc2V0U2l6ZSh0Lm5vcm1hbFdpZHRoLCB0Lm5vcm1hbEhlaWdodCk7XG5cblx0XHRcdHQubGF5ZXJzLmNoaWxkcmVuKCdkaXYnKVxuXHRcdFx0XHQud2lkdGgodC5ub3JtYWxXaWR0aClcblx0XHRcdFx0LmhlaWdodCh0Lm5vcm1hbEhlaWdodCk7XG5cdFx0fVxuXG5cdFx0dC5mdWxsc2NyZWVuQnRuXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVuZnVsbHNjcmVlbmApXG5cdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWZ1bGxzY3JlZW5gKTtcblxuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0dC5pc0Z1bGxTY3JlZW4gPSBmYWxzZTtcblxuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10ZXh0YCkuY3NzKCdmb250LXNpemUnLCAnJyk7XG5cdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRgKS5jc3MoJ2xpbmUtaGVpZ2h0JywgJycpO1xuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApLmNzcygnYm90dG9tJywgJycpO1xuXG5cdFx0dC5jb250YWluZXIudHJpZ2dlcignZXhpdGVkZnVsbHNjcmVlbicpO1xuXHR9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuXG4vKipcbiAqIFBsYXkvUGF1c2UgYnV0dG9uXG4gKlxuICogVGhpcyBmZWF0dXJlIGVuYWJsZXMgdGhlIGRpc3BsYXlpbmcgb2YgYSBQbGF5IGJ1dHRvbiBpbiB0aGUgY29udHJvbCBiYXIsIGFuZCBhbHNvIGNvbnRhaW5zIGxvZ2ljIHRvIHRvZ2dsZSBpdHMgc3RhdGVcbiAqIGJldHdlZW4gcGF1c2VkIGFuZCBwbGF5aW5nLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHBsYXlUZXh0OiAnJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRwYXVzZVRleHQ6ICcnXG59KTtcblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0YnVpbGRwbGF5cGF1c2U6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRvcCA9IHQub3B0aW9ucyxcblx0XHRcdHBsYXlUaXRsZSA9IG9wLnBsYXlUZXh0ID8gb3AucGxheVRleHQgOiBpMThuLnQoJ21lanMucGxheScpLFxuXHRcdFx0cGF1c2VUaXRsZSA9IG9wLnBhdXNlVGV4dCA/IG9wLnBhdXNlVGV4dCA6IGkxOG4udCgnbWVqcy5wYXVzZScpLFxuXHRcdFx0cGxheSA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheXBhdXNlLWJ1dHRvbiBgICtcblx0XHRcdFx0XHRgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheVwiPmAgK1xuXHRcdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHtwbGF5VGl0bGV9XCIgYXJpYS1sYWJlbD1cIiR7cGF1c2VUaXRsZX1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDwvZGl2PmApXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250cm9scylcblx0XHRcdFx0LmNsaWNrKCgpID0+IHtcblx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSxcblx0XHRcdHBsYXlfYnRuID0gcGxheS5maW5kKCdidXR0b24nKTtcblxuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gd2hpY2ggLSB0b2tlbiB0byBkZXRlcm1pbmUgbmV3IHN0YXRlIG9mIGJ1dHRvblxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHRvZ2dsZVBsYXlQYXVzZSAod2hpY2gpIHtcblx0XHRcdGlmICgncGxheScgPT09IHdoaWNoKSB7XG5cdFx0XHRcdHBsYXkucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBsYXlgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXJlcGxheWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGF1c2VgKTtcblx0XHRcdFx0cGxheV9idG4uYXR0cih7XG5cdFx0XHRcdFx0J3RpdGxlJzogcGF1c2VUaXRsZSxcblx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IHBhdXNlVGl0bGVcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwbGF5LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wYXVzZWApXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cmVwbGF5YClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wbGF5YCk7XG5cdFx0XHRcdHBsYXlfYnRuLmF0dHIoe1xuXHRcdFx0XHRcdCd0aXRsZSc6IHBsYXlUaXRsZSxcblx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IHBsYXlUaXRsZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0b2dnbGVQbGF5UGF1c2UoJ3BzZScpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdHRvZ2dsZVBsYXlQYXVzZSgncGxheScpO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgKCkgPT4ge1xuXHRcdFx0dG9nZ2xlUGxheVBhdXNlKCdwbGF5Jyk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsICgpID0+IHtcblx0XHRcdHRvZ2dsZVBsYXlQYXVzZSgncHNlJyk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlZCcsICgpID0+IHtcblx0XHRcdHRvZ2dsZVBsYXlQYXVzZSgncHNlJyk7XG5cdFx0fSwgZmFsc2UpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG5cblx0XHRcdGlmICghcGxheWVyLm9wdGlvbnMubG9vcCkge1xuXHRcdFx0XHRwbGF5LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wYXVzZWApXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cmVwbGF5YCk7XG5cdFx0XHR9XG5cblx0XHR9LCBmYWxzZSk7XG5cdH1cbn0pO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtJU19GSVJFRk9YLCBIQVNfVE9VQ0h9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3NlY29uZHNUb1RpbWVDb2RlfSBmcm9tICcuLi91dGlscy90aW1lJztcblxuLyoqXG4gKiBQcm9ncmVzcy9sb2FkZWQgYmFyXG4gKlxuICogVGhpcyBmZWF0dXJlIGNyZWF0ZXMgYSBwcm9ncmVzcyBiYXIgd2l0aCBhIHNsaWRlciBpbiB0aGUgY29udHJvbCBiYXIsIGFuZCB1cGRhdGVzIGl0IGJhc2VkIG9uIG5hdGl2ZSBldmVudHMuXG4gKi9cblxuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBFbmFibGUgdG9vbHRpcCB0aGF0IHNob3dzIHRpbWUgaW4gcHJvZ3Jlc3MgYmFyXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0ZW5hYmxlUHJvZ3Jlc3NUb29sdGlwOiB0cnVlXG59KTtcblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEZlYXR1cmUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKi9cblx0YnVpbGRwcm9ncmVzczogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZSxcblx0XHRcdG1vdXNlSXNPdmVyID0gZmFsc2UsXG5cdFx0XHRsYXN0S2V5UHJlc3NUaW1lID0gMCxcblx0XHRcdHN0YXJ0ZWRQYXVzZWQgPSBmYWxzZSxcblx0XHRcdGF1dG9SZXdpbmRJbml0aWFsID0gcGxheWVyLm9wdGlvbnMuYXV0b1Jld2luZCxcblx0XHRcdHRvb2x0aXAgPSBwbGF5ZXIub3B0aW9ucy5lbmFibGVQcm9ncmVzc1Rvb2x0aXAgP1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0XCI+YCArXG5cdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdC1jdXJyZW50XCI+MDA6MDA8L3NwYW4+YCArXG5cdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1mbG9hdC1jb3JuZXJcIj48L3NwYW4+YCArXG5cdFx0XHRcdGA8L3NwYW4+YCA6IFwiXCI7XG5cblx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1yYWlsXCI+YCArXG5cdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXRvdGFsICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtc2xpZGVyXCI+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nXCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWxvYWRlZFwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1jdXJyZW50XCI+PC9zcGFuPmAgK1xuXHRcdFx0XHRgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWhhbmRsZVwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YCR7dG9vbHRpcH1gICtcblx0XHRcdGA8L3NwYW4+YCArXG5cdFx0YDwvZGl2PmApXG5cdFx0LmFwcGVuZFRvKGNvbnRyb2xzKTtcblx0XHRjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1idWZmZXJpbmdgKS5oaWRlKCk7XG5cblx0XHR0LnJhaWwgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1yYWlsYCk7XG5cdFx0dC50b3RhbCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXRvdGFsYCk7XG5cdFx0dC5sb2FkZWQgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1sb2FkZWRgKTtcblx0XHR0LmN1cnJlbnQgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1jdXJyZW50YCk7XG5cdFx0dC5oYW5kbGUgPSBjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dGltZS1oYW5kbGVgKTtcblx0XHR0LnRpbWVmbG9hdCA9IGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWZsb2F0YCk7XG5cdFx0dC50aW1lZmxvYXRjdXJyZW50ID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtZmxvYXQtY3VycmVudGApO1xuXHRcdHQuc2xpZGVyID0gY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtc2xpZGVyYCk7XG5cblx0XHQvKipcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHBhcmFtIHtFdmVudH0gZVxuXHRcdCAqL1xuXHRcdGxldCBoYW5kbGVNb3VzZU1vdmUgPSAoZSkgPT4ge1xuXG5cdFx0XHRcdGxldCBvZmZzZXQgPSB0LnRvdGFsLm9mZnNldCgpLFxuXHRcdFx0XHRcdHdpZHRoID0gdC50b3RhbC53aWR0aCgpLFxuXHRcdFx0XHRcdHBlcmNlbnRhZ2UgPSAwLFxuXHRcdFx0XHRcdG5ld1RpbWUgPSAwLFxuXHRcdFx0XHRcdHBvcyA9IDAsXG5cdFx0XHRcdFx0eFxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0Ly8gbW91c2Ugb3IgdG91Y2ggcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIG9iamVjdFxuXHRcdFx0XHRpZiAoZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcykge1xuXHRcdFx0XHRcdHggPSBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZS5jaGFuZ2VkVG91Y2hlcykgeyAvLyBmb3IgWmVwdG9cblx0XHRcdFx0XHR4ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR4ID0gZS5wYWdlWDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbikge1xuXHRcdFx0XHRcdGlmICh4IDwgb2Zmc2V0LmxlZnQpIHtcblx0XHRcdFx0XHRcdHggPSBvZmZzZXQubGVmdDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHggPiB3aWR0aCArIG9mZnNldC5sZWZ0KSB7XG5cdFx0XHRcdFx0XHR4ID0gd2lkdGggKyBvZmZzZXQubGVmdDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRwb3MgPSB4IC0gb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdFx0cGVyY2VudGFnZSA9IChwb3MgLyB3aWR0aCk7XG5cdFx0XHRcdFx0bmV3VGltZSA9IChwZXJjZW50YWdlIDw9IDAuMDIpID8gMCA6IHBlcmNlbnRhZ2UgKiBtZWRpYS5kdXJhdGlvbjtcblxuXHRcdFx0XHRcdC8vIHNlZWsgdG8gd2hlcmUgdGhlIG1vdXNlIGlzXG5cdFx0XHRcdFx0aWYgKG1vdXNlSXNEb3duICYmIG5ld1RpbWUudG9GaXhlZCg0KSAhPT0gbWVkaWEuY3VycmVudFRpbWUudG9GaXhlZCg0KSkge1xuXHRcdFx0XHRcdFx0bWVkaWEuc2V0Q3VycmVudFRpbWUobmV3VGltZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gcG9zaXRpb24gZmxvYXRpbmcgdGltZSBib3hcblx0XHRcdFx0XHRpZiAoIUhBU19UT1VDSCkge1xuXHRcdFx0XHRcdFx0dC50aW1lZmxvYXQuY3NzKCdsZWZ0JywgcG9zKTtcblx0XHRcdFx0XHRcdHQudGltZWZsb2F0Y3VycmVudC5odG1sKHNlY29uZHNUb1RpbWVDb2RlKG5ld1RpbWUsIHBsYXllci5vcHRpb25zLmFsd2F5c1Nob3dIb3VycykpO1xuXHRcdFx0XHRcdFx0dC50aW1lZmxvYXQuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICogVXBkYXRlIGVsZW1lbnRzIGluIHByb2dyZXNzIGJhciBmb3IgYWNjZXNzaWJpbGl0eSBwdXJwb3NlcyBvbmx5IHdoZW4gcGxheWVyIGlzIHBhdXNlZC5cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGlzIGlzIHRvIGF2b2lkIGF0dGVtcHRzIHRvIHJlcGVhdCB0aGUgdGltZSBvdmVyIGFuZCBvdmVyIGFnYWluIHdoZW4gbWVkaWEgaXMgcGxheWluZy5cblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdHVwZGF0ZVNsaWRlciA9ICgpID0+IHtcblxuXHRcdFx0XHRsZXQgc2Vjb25kcyA9IG1lZGlhLmN1cnJlbnRUaW1lLFxuXHRcdFx0XHRcdHRpbWVTbGlkZXJUZXh0ID0gaTE4bi50KCdtZWpzLnRpbWUtc2xpZGVyJyksXG5cdFx0XHRcdFx0dGltZSA9IHNlY29uZHNUb1RpbWVDb2RlKHNlY29uZHMsIHBsYXllci5vcHRpb25zLmFsd2F5c1Nob3dIb3VycyksXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBtZWRpYS5kdXJhdGlvbjtcblxuXHRcdFx0XHR0LnNsaWRlci5hdHRyKHtcblx0XHRcdFx0XHQncm9sZSc6ICdzbGlkZXInLFxuXHRcdFx0XHRcdCd0YWJpbmRleCc6IDBcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHR0LnNsaWRlci5hdHRyKHtcblx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogdGltZVNsaWRlclRleHQsXG5cdFx0XHRcdFx0XHQnYXJpYS12YWx1ZW1pbic6IDAsXG5cdFx0XHRcdFx0XHQnYXJpYS12YWx1ZW1heCc6IGR1cmF0aW9uLFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWVub3cnOiBzZWNvbmRzLFxuXHRcdFx0XHRcdFx0J2FyaWEtdmFsdWV0ZXh0JzogdGltZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQuc2xpZGVyLnJlbW92ZUF0dHIoJ2FyaWEtbGFiZWwgYXJpYS12YWx1ZW1pbiBhcmlhLXZhbHVlbWF4IGFyaWEtdmFsdWVub3cgYXJpYS12YWx1ZXRleHQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdC8qKlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdHJlc3RhcnRQbGF5ZXIgPSAoKSA9PiB7XG5cdFx0XHRcdGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRpZiAobm93IC0gbGFzdEtleVByZXNzVGltZSA+PSAxMDAwKSB7XG5cdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Ly8gRXZlbnRzXG5cdFx0dC5zbGlkZXIub24oJ2ZvY3VzJywgKCkgPT4ge1xuXHRcdFx0cGxheWVyLm9wdGlvbnMuYXV0b1Jld2luZCA9IGZhbHNlO1xuXHRcdH0pLm9uKCdibHVyJywgKCkgPT4ge1xuXHRcdFx0cGxheWVyLm9wdGlvbnMuYXV0b1Jld2luZCA9IGF1dG9SZXdpbmRJbml0aWFsO1xuXHRcdH0pLm9uKCdrZXlkb3duJywgKGUpID0+IHtcblxuXHRcdFx0aWYgKChuZXcgRGF0ZSgpIC0gbGFzdEtleVByZXNzVGltZSkgPj0gMTAwMCkge1xuXHRcdFx0XHRzdGFydGVkUGF1c2VkID0gbWVkaWEucGF1c2VkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodC5vcHRpb25zLmtleUFjdGlvbnMubGVuZ3RoKSB7XG5cblx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0a2V5Q29kZSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlIHx8IDAsXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBtZWRpYS5kdXJhdGlvbixcblx0XHRcdFx0XHRzZWVrVGltZSA9IG1lZGlhLmN1cnJlbnRUaW1lLFxuXHRcdFx0XHRcdHNlZWtGb3J3YXJkID0gcGxheWVyLm9wdGlvbnMuZGVmYXVsdFNlZWtGb3J3YXJkSW50ZXJ2YWwobWVkaWEpLFxuXHRcdFx0XHRcdHNlZWtCYWNrd2FyZCA9IHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrQmFja3dhcmRJbnRlcnZhbChtZWRpYSlcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHN3aXRjaCAoa2V5Q29kZSkge1xuXHRcdFx0XHRcdGNhc2UgMzc6IC8vIGxlZnRcblx0XHRcdFx0XHRjYXNlIDQwOiAvLyBEb3duXG5cdFx0XHRcdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdFx0XHRcdHNlZWtUaW1lIC09IHNlZWtCYWNrd2FyZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzk6IC8vIFJpZ2h0XG5cdFx0XHRcdFx0Y2FzZSAzODogLy8gVXBcblx0XHRcdFx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0XHRcdFx0c2Vla1RpbWUgKz0gc2Vla0ZvcndhcmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM2OiAvLyBIb21lXG5cdFx0XHRcdFx0XHRzZWVrVGltZSA9IDA7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM1OiAvLyBlbmRcblx0XHRcdFx0XHRcdHNlZWtUaW1lID0gZHVyYXRpb247XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDMyOiAvLyBzcGFjZVxuXHRcdFx0XHRcdFx0aWYgKCFJU19GSVJFRk9YKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRtZWRpYS5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGNhc2UgMTM6IC8vIGVudGVyXG5cdFx0XHRcdFx0XHRpZiAobWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnBsYXkoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1lZGlhLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0c2Vla1RpbWUgPSBzZWVrVGltZSA8IDAgPyAwIDogKHNlZWtUaW1lID49IGR1cmF0aW9uID8gZHVyYXRpb24gOiBNYXRoLmZsb29yKHNlZWtUaW1lKSk7XG5cdFx0XHRcdGxhc3RLZXlQcmVzc1RpbWUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRpZiAoIXN0YXJ0ZWRQYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNlZWtUaW1lIDwgbWVkaWEuZHVyYXRpb24gJiYgIXN0YXJ0ZWRQYXVzZWQpIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KHJlc3RhcnRQbGF5ZXIsIDExMDApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVkaWEuc2V0Q3VycmVudFRpbWUoc2Vla1RpbWUpO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblx0XHR9KS5vbignY2xpY2snLCAoZSkgPT4ge1xuXG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdGxldCBwYXVzZWQgPSBtZWRpYS5wYXVzZWQ7XG5cblx0XHRcdFx0aWYgKCFwYXVzZWQpIHtcblx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXG5cdFx0XHRcdGlmICghcGF1c2VkKSB7XG5cdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fSk7XG5cblxuXHRcdC8vIGhhbmRsZSBjbGlja3Ncblx0XHR0LnJhaWwub24oJ21vdXNlZG93biB0b3VjaHN0YXJ0JywgKGUpID0+IHtcblx0XHRcdGlmIChtZWRpYS5kdXJhdGlvbiAhPT0gSW5maW5pdHkpIHtcblx0XHRcdFx0Ly8gb25seSBoYW5kbGUgbGVmdCBjbGlja3Mgb3IgdG91Y2hcblx0XHRcdFx0aWYgKGUud2hpY2ggPT09IDEgfHwgZS53aGljaCA9PT0gMCkge1xuXHRcdFx0XHRcdG1vdXNlSXNEb3duID0gdHJ1ZTtcblx0XHRcdFx0XHRoYW5kbGVNb3VzZU1vdmUoZSk7XG5cdFx0XHRcdFx0dC5nbG9iYWxCaW5kKCdtb3VzZW1vdmUuZHVyIHRvdWNobW92ZS5kdXInLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlKGUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2V1cC5kdXIgdG91Y2hlbmQuZHVyJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZTtcblx0XHRcdFx0XHRcdGlmICh0LnRpbWVmbG9hdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHQudGltZWZsb2F0LmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHQuZ2xvYmFsVW5iaW5kKCdtb3VzZW1vdmUuZHVyIHRvdWNobW92ZS5kdXIgbW91c2V1cC5kdXIgdG91Y2hlbmQuZHVyJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KS5vbignbW91c2VlbnRlcicsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdG1vdXNlSXNPdmVyID0gdHJ1ZTtcblx0XHRcdFx0dC5nbG9iYWxCaW5kKCdtb3VzZW1vdmUuZHVyJywgKGUpID0+IHtcblx0XHRcdFx0XHRoYW5kbGVNb3VzZU1vdmUoZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAodC50aW1lZmxvYXQgIT09IHVuZGVmaW5lZCAmJiAhSEFTX1RPVUNIKSB7XG5cdFx0XHRcdFx0dC50aW1lZmxvYXQuc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSkub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdG1vdXNlSXNPdmVyID0gZmFsc2U7XG5cdFx0XHRcdGlmICghbW91c2VJc0Rvd24pIHtcblx0XHRcdFx0XHR0Lmdsb2JhbFVuYmluZCgnbW91c2Vtb3ZlLmR1cicpO1xuXHRcdFx0XHRcdGlmICh0LnRpbWVmbG9hdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHR0LnRpbWVmbG9hdC5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBsb2FkaW5nXG5cdFx0Ly8gSWYgbWVkaWEgaXMgZG9lcyBub3QgaGF2ZSBhIGZpbml0ZSBkdXJhdGlvbiwgcmVtb3ZlIHByb2dyZXNzIGJhciBpbnRlcmFjdGlvblxuXHRcdC8vIGFuZCBpbmRpY2F0ZSB0aGF0IGlzIGEgbGl2ZSBicm9hZGNhc3Rcblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChlKSA9PiB7XG5cdFx0XHRpZiAobWVkaWEuZHVyYXRpb24gIT09IEluZmluaXR5KSB7XG5cdFx0XHRcdHBsYXllci5zZXRQcm9ncmVzc1JhaWwoZSk7XG5cdFx0XHRcdHBsYXllci5zZXRDdXJyZW50UmFpbChlKTtcblx0XHRcdH0gZWxzZSBpZiAoIWNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1icm9hZGNhc3RgKS5sZW5ndGgpIHtcblx0XHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtcmFpbGApLmVtcHR5KClcblx0XHRcdFx0XHQuaHRtbChgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1icm9hZGNhc3RcIj4ke21lanMuaTE4bi50KCdtZWpzLmxpdmUtYnJvYWRjYXN0Jyl9PC9zcGFuPmApO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKTtcblxuXHRcdC8vIGN1cnJlbnQgdGltZVxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSApIHtcblx0XHRcdFx0cGxheWVyLnNldFByb2dyZXNzUmFpbChlKTtcblx0XHRcdFx0cGxheWVyLnNldEN1cnJlbnRSYWlsKGUpO1xuXHRcdFx0XHR1cGRhdGVTbGlkZXIoZSk7XG5cdFx0XHR9IGVsc2UgaWYgKCFjb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0YCkubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLXJhaWxgKS5lbXB0eSgpXG5cdFx0XHRcdFx0Lmh0bWwoYDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnJvYWRjYXN0XCI+JHttZWpzLmkxOG4udCgnbWVqcy5saXZlLWJyb2FkY2FzdCcpfTwvc3Bhbj5gKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cblx0XHR0LmNvbnRhaW5lci5vbignY29udHJvbHNyZXNpemUnLCAoZSkgPT4ge1xuXHRcdFx0aWYgKG1lZGlhLmR1cmF0aW9uICE9PSBJbmZpbml0eSkge1xuXHRcdFx0XHRwbGF5ZXIuc2V0UHJvZ3Jlc3NSYWlsKGUpO1xuXHRcdFx0XHRwbGF5ZXIuc2V0Q3VycmVudFJhaWwoZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZSB0aGUgcHJvZ3Jlc3Mgb24gdGhlIG1lZGlhIGFuZCB1cGRhdGUgcHJvZ3Jlc3MgYmFyJ3Mgd2lkdGhcblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZVxuXHQgKi9cblx0c2V0UHJvZ3Jlc3NSYWlsOiBmdW5jdGlvbiAoZSkgIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR0YXJnZXQgPSAoZSAhPT0gdW5kZWZpbmVkKSA/IGUudGFyZ2V0IDogdC5tZWRpYSxcblx0XHRcdHBlcmNlbnQgPSBudWxsO1xuXG5cdFx0Ly8gbmV3ZXN0IEhUTUw1IHNwZWMgaGFzIGJ1ZmZlcmVkIGFycmF5IChGRjQsIFdlYmtpdClcblx0XHRpZiAodGFyZ2V0ICYmIHRhcmdldC5idWZmZXJlZCAmJiB0YXJnZXQuYnVmZmVyZWQubGVuZ3RoID4gMCAmJiB0YXJnZXQuYnVmZmVyZWQuZW5kICYmIHRhcmdldC5kdXJhdGlvbikge1xuXHRcdFx0Ly8gYWNjb3VudCBmb3IgYSByZWFsIGFycmF5IHdpdGggbXVsdGlwbGUgdmFsdWVzIC0gYWx3YXlzIHJlYWQgdGhlIGVuZCBvZiB0aGUgbGFzdCBidWZmZXJcblx0XHRcdHBlcmNlbnQgPSB0YXJnZXQuYnVmZmVyZWQuZW5kKHRhcmdldC5idWZmZXJlZC5sZW5ndGggLSAxKSAvIHRhcmdldC5kdXJhdGlvbjtcblx0XHR9XG5cdFx0Ly8gU29tZSBicm93c2VycyAoZS5nLiwgRkYzLjYgYW5kIFNhZmFyaSA1KSBjYW5ub3QgY2FsY3VsYXRlIHRhcmdldC5idWZmZXJlcmVkLmVuZCgpXG5cdFx0Ly8gdG8gYmUgYW55dGhpbmcgb3RoZXIgdGhhbiAwLiBJZiB0aGUgYnl0ZSBjb3VudCBpcyBhdmFpbGFibGUgd2UgdXNlIHRoaXMgaW5zdGVhZC5cblx0XHQvLyBCcm93c2VycyB0aGF0IHN1cHBvcnQgdGhlIGVsc2UgaWYgZG8gbm90IHNlZW0gdG8gaGF2ZSB0aGUgYnVmZmVyZWRCeXRlcyB2YWx1ZSBhbmRcblx0XHQvLyBzaG91bGQgc2tpcCB0byB0aGVyZS4gVGVzdGVkIGluIFNhZmFyaSA1LCBXZWJraXQgaGVhZCwgRkYzLjYsIENocm9tZSA2LCBJRSA3LzguXG5cdFx0ZWxzZSBpZiAodGFyZ2V0ICYmIHRhcmdldC5ieXRlc1RvdGFsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0LmJ5dGVzVG90YWwgPiAwICYmIHRhcmdldC5idWZmZXJlZEJ5dGVzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBlcmNlbnQgPSB0YXJnZXQuYnVmZmVyZWRCeXRlcyAvIHRhcmdldC5ieXRlc1RvdGFsO1xuXHRcdH1cblx0XHQvLyBGaXJlZm94IDMgd2l0aCBhbiBPZ2cgZmlsZSBzZWVtcyB0byBnbyB0aGlzIHdheVxuXHRcdGVsc2UgaWYgKGUgJiYgZS5sZW5ndGhDb21wdXRhYmxlICYmIGUudG90YWwgIT09IDApIHtcblx0XHRcdHBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWw7XG5cdFx0fVxuXG5cdFx0Ly8gZmluYWxseSB1cGRhdGUgdGhlIHByb2dyZXNzIGJhclxuXHRcdGlmIChwZXJjZW50ICE9PSBudWxsKSB7XG5cdFx0XHRwZXJjZW50ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgcGVyY2VudCkpO1xuXHRcdFx0Ly8gdXBkYXRlIGxvYWRlZCBiYXJcblx0XHRcdGlmICh0LmxvYWRlZCAmJiB0LnRvdGFsKSB7XG5cdFx0XHRcdHQubG9hZGVkLndpZHRoKGAkeyhwZXJjZW50ICogMTAwKX0lYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHQvKipcblx0ICogVXBkYXRlIHRoZSBzbGlkZXIncyB3aWR0aCBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgdGltZVxuXHQgKlxuXHQgKi9cblx0c2V0Q3VycmVudFJhaWw6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAodC5tZWRpYS5jdXJyZW50VGltZSAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWEuZHVyYXRpb24pIHtcblxuXHRcdFx0Ly8gdXBkYXRlIGJhciBhbmQgaGFuZGxlXG5cdFx0XHRpZiAodC50b3RhbCAmJiB0LmhhbmRsZSkge1xuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHRuZXdXaWR0aCA9IE1hdGgucm91bmQodC50b3RhbC53aWR0aCgpICogdC5tZWRpYS5jdXJyZW50VGltZSAvIHQubWVkaWEuZHVyYXRpb24pLFxuXHRcdFx0XHRcdGhhbmRsZVBvcyA9IG5ld1dpZHRoIC0gTWF0aC5yb3VuZCh0LmhhbmRsZS5vdXRlcldpZHRoKHRydWUpIC8gMik7XG5cblx0XHRcdFx0bmV3V2lkdGggPSAodC5tZWRpYS5jdXJyZW50VGltZSAvIHQubWVkaWEuZHVyYXRpb24pICogMTAwO1xuXHRcdFx0XHR0LmN1cnJlbnQud2lkdGgoYCR7bmV3V2lkdGh9JWApO1xuXHRcdFx0XHR0LmhhbmRsZS5jc3MoJ2xlZnQnLCBoYW5kbGVQb3MpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCBNZWRpYUVsZW1lbnRQbGF5ZXIgZnJvbSAnLi4vcGxheWVyJztcbmltcG9ydCB7c2Vjb25kc1RvVGltZUNvZGV9IGZyb20gJy4uL3V0aWxzL3RpbWUnO1xuXG4vKipcbiAqIEN1cnJlbnQvZHVyYXRpb24gdGltZXNcbiAqXG4gKiBUaGlzIGZlYXR1cmUgY3JlYXRlcy91cGRhdGVzIHRoZSBkdXJhdGlvbiBhbmQgcHJvZ3Jlc3MgdGltZXMgaW4gdGhlIGNvbnRyb2wgYmFyLCBiYXNlZCBvbiBuYXRpdmUgZXZlbnRzLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogVGhlIGluaXRpYWwgZHVyYXRpb25cblx0ICogQHR5cGUge051bWJlcn1cblx0ICovXG5cdGR1cmF0aW9uOiAwLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHRpbWVBbmREdXJhdGlvblNlcGFyYXRvcjogJzxzcGFuPiB8IDwvc3Bhbj4nXG59KTtcblxuXG5PYmplY3QuYXNzaWduKE1lZGlhRWxlbWVudFBsYXllci5wcm90b3R5cGUsIHtcblxuXHQvKipcblx0ICogQ3VycmVudCB0aW1lIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkY3VycmVudDogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWVcIiByb2xlPVwidGltZXJcIiBhcmlhLWxpdmU9XCJvZmZcIj5gICtcblx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWN1cnJlbnR0aW1lXCI+JHtzZWNvbmRzVG9UaW1lQ29kZSgwLCBwbGF5ZXIub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfTwvc3Bhbj5gICtcblx0XHRgPC9kaXY+YClcblx0XHQuYXBwZW5kVG8oY29udHJvbHMpO1xuXG5cdFx0dC5jdXJyZW50dGltZSA9IHQuY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWN1cnJlbnR0aW1lYCk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKCkgPT4ge1xuXHRcdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdHBsYXllci51cGRhdGVDdXJyZW50KCk7XG5cdFx0XHR9XG5cblx0XHR9LCBmYWxzZSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIER1cmF0aW9uIHRpbWUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEFsd2F5cyBoYXMgdG8gYmUgcHJlZml4ZWQgd2l0aCBgYnVpbGRgIGFuZCB0aGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICogQHBhcmFtIHskfSBjb250cm9sc1xuXHQgKiBAcGFyYW0geyR9IGxheWVyc1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZWRpYVxuXHQgKi9cblx0YnVpbGRkdXJhdGlvbjogZnVuY3Rpb24gKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKGNvbnRyb2xzLmNoaWxkcmVuKCkubGFzdCgpLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZWApLmxlbmd0aCA+IDApIHtcblx0XHRcdCQoYCR7dC5vcHRpb25zLnRpbWVBbmREdXJhdGlvblNlcGFyYXRvcn08c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uXCI+YCArXG5cdFx0XHRcdGAke3NlY29uZHNUb1RpbWVDb2RlKHQub3B0aW9ucy5kdXJhdGlvbiwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9PC9zcGFuPmApXG5cdFx0XHQuYXBwZW5kVG8oY29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWVgKSk7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gYWRkIGNsYXNzIHRvIGN1cnJlbnQgdGltZVxuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWN1cnJlbnR0aW1lYCkucGFyZW50KClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jdXJyZW50dGltZS1jb250YWluZXJgKTtcblxuXHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZHVyYXRpb24tY29udGFpbmVyXCI+YCArXG5cdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWR1cmF0aW9uXCI+YCArXG5cdFx0XHRcdGAke3NlY29uZHNUb1RpbWVDb2RlKHQub3B0aW9ucy5kdXJhdGlvbiwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3Vycyl9PC9zcGFuPmAgK1xuXHRcdFx0YDwvZGl2PmApXG5cdFx0XHQuYXBwZW5kVG8oY29udHJvbHMpO1xuXHRcdH1cblxuXHRcdHQuZHVyYXRpb25EID0gdC5jb250cm9scy5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZHVyYXRpb25gKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRpZiAodC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdFx0cGxheWVyLnVwZGF0ZUR1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIGN1cnJlbnQgdGltZSBhbmQgb3V0cHV0IGl0IGluIGZvcm1hdCAwMDowMFxuXHQgKlxuXHQgKi9cblx0dXBkYXRlQ3VycmVudDogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRsZXQgY3VycmVudFRpbWUgPSB0Lm1lZGlhLmN1cnJlbnRUaW1lO1xuXG5cdFx0aWYgKGlzTmFOKGN1cnJlbnRUaW1lKSkge1xuXHRcdFx0Y3VycmVudFRpbWUgPSAwO1xuXHRcdH1cblxuXHRcdGlmICh0LmN1cnJlbnR0aW1lKSB7XG5cdFx0XHR0LmN1cnJlbnR0aW1lLmh0bWwoc2Vjb25kc1RvVGltZUNvZGUoY3VycmVudFRpbWUsIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFVwZGF0ZSB0aGUgZHVyYXRpb24gdGltZSBhbmQgb3V0cHV0IGl0IGluIGZvcm1hdCAwMDowMFxuXHQgKlxuXHQgKi9cblx0dXBkYXRlRHVyYXRpb246IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0bGV0IGR1cmF0aW9uID0gdC5tZWRpYS5kdXJhdGlvbjtcblxuXHRcdGlmIChpc05hTihkdXJhdGlvbikgfHwgZHVyYXRpb24gPT09IEluZmluaXR5IHx8IGR1cmF0aW9uIDwgMCkge1xuXHRcdFx0dC5tZWRpYS5kdXJhdGlvbiA9IHQub3B0aW9ucy5kdXJhdGlvbiA9IGR1cmF0aW9uID0gMDtcblx0XHR9XG5cblx0XHRpZiAodC5vcHRpb25zLmR1cmF0aW9uID4gMCkge1xuXHRcdFx0ZHVyYXRpb24gPSB0Lm9wdGlvbnMuZHVyYXRpb247XG5cdFx0fVxuXG5cdFx0Ly9Ub2dnbGUgdGhlIGxvbmcgdmlkZW8gY2xhc3MgaWYgdGhlIHZpZGVvIGlzIGxvbmdlciB0aGFuIGFuIGhvdXIuXG5cdFx0dC5jb250YWluZXIudG9nZ2xlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxvbmctdmlkZW9gLCBkdXJhdGlvbiA+IDM2MDApO1xuXG5cdFx0aWYgKHQuZHVyYXRpb25EICYmIGR1cmF0aW9uID4gMCkge1xuXHRcdFx0dC5kdXJhdGlvbkQuaHRtbChzZWNvbmRzVG9UaW1lQ29kZShkdXJhdGlvbiwgdC5vcHRpb25zLmFsd2F5c1Nob3dIb3VycykpO1xuXHRcdH1cblx0fVxufSk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vY29yZS9pMThuJztcbmltcG9ydCB7Y29uZmlnfSBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IE1lZGlhRWxlbWVudFBsYXllciBmcm9tICcuLi9wbGF5ZXInO1xuaW1wb3J0IHtzZWNvbmRzVG9UaW1lQ29kZSwgY29udmVydFNNUFRFdG9TZWNvbmRzfSBmcm9tICcuLi91dGlscy90aW1lJztcblxuLyoqXG4gKiBDbG9zZWQgQ2FwdGlvbnMgKENDKSBidXR0b25cbiAqXG4gKiBUaGlzIGZlYXR1cmUgZW5hYmxlcyB0aGUgZGlzcGxheWluZyBvZiBhIENDIGJ1dHRvbiBpbiB0aGUgY29udHJvbCBiYXIsIGFuZCBhbHNvIGNvbnRhaW5zIHRoZSBtZXRob2RzIHRvIHN0YXJ0IG1lZGlhXG4gKiB3aXRoIGEgY2VydGFpbiBsYW5ndWFnZSAoaWYgYXZhaWxhYmxlKSwgdG9nZ2xlIGNhcHRpb25zLCBldGMuXG4gKi9cblxuXG4vLyBGZWF0dXJlIGNvbmZpZ3VyYXRpb25cbk9iamVjdC5hc3NpZ24oY29uZmlnLCB7XG5cdC8qKlxuXHQgKiBEZWZhdWx0IGxhbmd1YWdlIHRvIHN0YXJ0IG1lZGlhIHVzaW5nIElTTyA2MzktMiBMYW5ndWFnZSBDb2RlIExpc3QgKGVuLCBlcywgaXQsIGV0Yy4pXG5cdCAqIElmIHRoZXJlIGFyZSBtdWx0aXBsZSB0cmFja3MgZm9yIG9uZSBsYW5ndWFnZSwgdGhlIGxhc3QgdHJhY2sgbm9kZSBmb3VuZCBpcyBhY3RpdmF0ZWRcblx0ICogQHNlZSBodHRwczovL3d3dy5sb2MuZ292L3N0YW5kYXJkcy9pc282MzktMi9waHAvY29kZV9saXN0LnBocFxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0c3RhcnRMYW5ndWFnZTogJycsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dHJhY2tzVGV4dDogJycsXG5cdC8qKlxuXHQgKiBBdm9pZCB0byBzY3JlZW4gcmVhZGVyIHNwZWFrIGNhcHRpb25zIG92ZXIgYW4gYXVkaW8gdHJhY2suXG5cdCAqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0dHJhY2tzQXJpYUxpdmU6IGZhbHNlLFxuXHQvKipcblx0ICogUmVtb3ZlIHRoZSBbY2NdIGJ1dHRvbiB3aGVuIG5vIHRyYWNrIG5vZGVzIGFyZSBwcmVzZW50XG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aGlkZUNhcHRpb25zQnV0dG9uV2hlbkVtcHR5OiB0cnVlLFxuXHQvKipcblx0ICogQ2hhbmdlIGNhcHRpb25zIHRvIHBvcC11cCBpZiB0cnVlIGFuZCBvbmx5IG9uZSB0cmFjayBub2RlIGlzIGZvdW5kXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0dG9nZ2xlQ2FwdGlvbnNCdXR0b25XaGVuT25seU9uZTogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0c2xpZGVzU2VsZWN0b3I6ICcnXG59KTtcblxuT2JqZWN0LmFzc2lnbihNZWRpYUVsZW1lbnRQbGF5ZXIucHJvdG90eXBlLCB7XG5cblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aGFzQ2hhcHRlcnM6IGZhbHNlLFxuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICovXG5cdGJ1aWxkdHJhY2tzOiBmdW5jdGlvbiAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkgIHtcblx0XHRpZiAocGxheWVyLnRyYWNrcy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0YXR0ciA9IHQub3B0aW9ucy50cmFja3NBcmlhTGl2ZSA/ICcgcm9sZT1cImxvZ1wiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiIGFyaWEtYXRvbWljPVwiZmFsc2VcIicgOiAnJyxcblx0XHRcdHRyYWNrc1RpdGxlID0gdC5vcHRpb25zLnRyYWNrc1RleHQgPyB0Lm9wdGlvbnMudHJhY2tzVGV4dCA6IGkxOG4udCgnbWVqcy5jYXB0aW9ucy1zdWJ0aXRsZXMnKSxcblx0XHRcdGksXG5cdFx0XHRraW5kXG5cdFx0XHQ7XG5cblx0XHQvLyBJZiBicm93c2VyIHdpbGwgZG8gbmF0aXZlIGNhcHRpb25zLCBwcmVmZXIgbWVqcyBjYXB0aW9ucywgbG9vcCB0aHJvdWdoIHRyYWNrcyBhbmQgaGlkZVxuXHRcdGlmICh0LmRvbU5vZGUudGV4dFRyYWNrcykge1xuXHRcdFx0Zm9yIChpID0gdC5kb21Ob2RlLnRleHRUcmFja3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dC5kb21Ob2RlLnRleHRUcmFja3NbaV0ubW9kZSA9ICdoaWRkZW4nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHQuY2xlYXJ0cmFja3MocGxheWVyKTtcblx0XHRwbGF5ZXIuY2hhcHRlcnMgPSAkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2hhcHRlcnMgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJcIj48L2Rpdj5gKVxuXHRcdFx0LnByZXBlbmRUbyhsYXllcnMpLmhpZGUoKTtcblx0XHRwbGF5ZXIuY2FwdGlvbnMgPVxuXHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLWxheWVyICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+YCArXG5cdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb24taG92ZXJcIiR7YXR0cn0+YCArXG5cdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dFwiPjwvc3Bhbj5gICtcblx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0YDwvZGl2PmApXG5cdFx0XHQucHJlcGVuZFRvKGxheWVycykuaGlkZSgpO1xuXHRcdHBsYXllci5jYXB0aW9uc1RleHQgPSBwbGF5ZXIuY2FwdGlvbnMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXRleHRgKTtcblx0XHRwbGF5ZXIuY2FwdGlvbnNCdXR0b24gPVxuXHRcdFx0JChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWJ1dHRvbiAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1idXR0b25cIj5gICtcblx0XHRcdFx0YDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtY29udHJvbHM9XCIke3QuaWR9XCIgdGl0bGU9XCIke3RyYWNrc1RpdGxlfVwiIGFyaWEtbGFiZWw9XCIke3RyYWNrc1RpdGxlfVwiPjwvYnV0dG9uPmAgK1xuXHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlblwiPmAgK1xuXHRcdFx0XHRcdGA8dWwgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1saXN0XCI+YCArXG5cdFx0XHRcdFx0XHRgPGxpIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItbGlzdC1pdGVtXCI+YCArXG5cdFx0XHRcdFx0XHRcdGA8aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1pbnB1dFwiIGAgK1xuXHRcdFx0XHRcdFx0XHRcdGBuYW1lPVwiJHtwbGF5ZXIuaWR9X2NhcHRpb25zXCIgaWQ9XCIke3BsYXllci5pZH1fY2FwdGlvbnNfbm9uZVwiIGAgK1xuXHRcdFx0XHRcdFx0XHRcdGB2YWx1ZT1cIm5vbmVcIiBjaGVja2VkPVwiY2hlY2tlZFwiIC8+YCArXG5cdFx0XHRcdFx0XHRcdGA8bGFiZWwgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbCBgICtcblx0XHRcdFx0XHRcdFx0XHRgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0ZWRcIiBgICtcblx0XHRcdFx0XHRcdFx0XHRgZm9yPVwiJHtwbGF5ZXIuaWR9X2NhcHRpb25zX25vbmVcIj4ke2kxOG4udCgnbWVqcy5ub25lJyl9PC9sYWJlbD5gICtcblx0XHRcdFx0XHRcdGA8L2xpPmAgK1xuXHRcdFx0XHRcdGA8L3VsPmAgK1xuXHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRgPC9kaXY+YClcblx0XHRcdC5hcHBlbmRUbyhjb250cm9scyk7XG5cblxuXHRcdGxldFxuXHRcdFx0c3VidGl0bGVDb3VudCA9IDAsXG5cdFx0XHR0b3RhbCA9IHBsYXllci50cmFja3MubGVuZ3RoXG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdGtpbmQgPSBwbGF5ZXIudHJhY2tzW2ldLmtpbmQ7XG5cdFx0XHRpZiAoa2luZCA9PT0gJ3N1YnRpdGxlcycgfHwga2luZCA9PT0gJ2NhcHRpb25zJykge1xuXHRcdFx0XHRzdWJ0aXRsZUNvdW50Kys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaWYgb25seSBvbmUgbGFuZ3VhZ2UgdGhlbiBqdXN0IG1ha2UgdGhlIGJ1dHRvbiBhIHRvZ2dsZVxuXHRcdGlmICh0Lm9wdGlvbnMudG9nZ2xlQ2FwdGlvbnNCdXR0b25XaGVuT25seU9uZSAmJiBzdWJ0aXRsZUNvdW50ID09PSAxKSB7XG5cdFx0XHQvLyBjbGlja1xuXHRcdFx0cGxheWVyLmNhcHRpb25zQnV0dG9uLm9uKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0bGV0IHRyYWNrSWQgPSAnbm9uZSc7XG5cdFx0XHRcdGlmIChwbGF5ZXIuc2VsZWN0ZWRUcmFjayA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHRyYWNrSWQgPSBwbGF5ZXIudHJhY2tzWzBdLnRyYWNrSWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cGxheWVyLnNldFRyYWNrKHRyYWNrSWQpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGhvdmVyIG9yIGtleWJvYXJkIGZvY3VzXG5cdFx0XHRwbGF5ZXIuY2FwdGlvbnNCdXR0b25cblx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyIGZvY3VzaW4nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RvcmApXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ21vdXNlbGVhdmUgZm9jdXNvdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RvcmApXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQvLyBoYW5kbGUgY2xpY2tzIHRvIHRoZSBsYW5ndWFnZSByYWRpbyBidXR0b25zXG5cdFx0XHRcdC5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1yYWRpb10nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyB2YWx1ZSBpcyB0cmFja0lkLCBzYW1lIGFzIHRoZSBhY3R1YWwgaWQsIGFuZCB3ZSdyZSB1c2luZyBpdCBoZXJlXG5cdFx0XHRcdFx0Ly8gYmVjYXVzZSB0aGUgXCJub25lXCIgY2hlY2tib3ggZG9lc24ndCBoYXZlIGEgdHJhY2tJZFxuXHRcdFx0XHRcdC8vIHRvIHVzZSwgYnV0IHdlIHdhbnQgdG8ga25vdyB3aGVuIFwibm9uZVwiIGlzIGNsaWNrZWRcblx0XHRcdFx0XHRwbGF5ZXIuc2V0VHJhY2sodGhpcy52YWx1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignY2xpY2snLCBgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxhYmVsYCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnaW5wdXRbdHlwZT1cInJhZGlvXCJdJykudHJpZ2dlcignY2xpY2snKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Ly9BbGxvdyB1cC9kb3duIGFycm93IHRvIGNoYW5nZSB0aGUgc2VsZWN0ZWQgcmFkaW8gd2l0aG91dCBjaGFuZ2luZyB0aGUgdm9sdW1lLlxuXHRcdFx0XHQub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICghcGxheWVyLm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHQvLyBtb3ZlIHdpdGggY29udHJvbHNcblx0XHRcdHBsYXllci5jb250YWluZXJcblx0XHRcdC5vbignY29udHJvbHNzaG93bicsICgpID0+IHtcblx0XHRcdFx0Ly8gcHVzaCBjYXB0aW9ucyBhYm92ZSBjb250cm9sc1xuXHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtcG9zaXRpb24taG92ZXJgKTtcblxuXHRcdFx0fSlcblx0XHRcdC5vbignY29udHJvbHNoaWRkZW4nLCAoKSA9PiB7XG5cdFx0XHRcdGlmICghbWVkaWEucGF1c2VkKSB7XG5cdFx0XHRcdFx0Ly8gbW92ZSBiYWNrIHRvIG5vcm1hbCBwbGFjZVxuXHRcdFx0XHRcdHBsYXllci5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uYClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1wb3NpdGlvbmApXG5cdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXBvc2l0aW9uLWhvdmVyYCk7XG5cdFx0fVxuXG5cdFx0cGxheWVyLnRyYWNrVG9Mb2FkID0gLTE7XG5cdFx0cGxheWVyLnNlbGVjdGVkVHJhY2sgPSBudWxsO1xuXHRcdHBsYXllci5pc0xvYWRpbmdUcmFjayA9IGZhbHNlO1xuXG5cdFx0Ly8gYWRkIHRvIGxpc3Rcblx0XHRmb3IgKGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0a2luZCA9IHBsYXllci50cmFja3NbaV0ua2luZDtcblx0XHRcdGlmIChraW5kID09PSAnc3VidGl0bGVzJyB8fCBraW5kID09PSAnY2FwdGlvbnMnKSB7XG5cdFx0XHRcdHBsYXllci5hZGRUcmFja0J1dHRvbihwbGF5ZXIudHJhY2tzW2ldLnRyYWNrSWQsIHBsYXllci50cmFja3NbaV0uc3JjbGFuZywgcGxheWVyLnRyYWNrc1tpXS5sYWJlbCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gc3RhcnQgbG9hZGluZyB0cmFja3Ncblx0XHRwbGF5ZXIubG9hZE5leHRUcmFjaygpO1xuXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdHBsYXllci5kaXNwbGF5Q2FwdGlvbnMoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRpZiAocGxheWVyLm9wdGlvbnMuc2xpZGVzU2VsZWN0b3IgIT09ICcnKSB7XG5cdFx0XHRwbGF5ZXIuc2xpZGVzQ29udGFpbmVyID0gJChwbGF5ZXIub3B0aW9ucy5zbGlkZXNTZWxlY3Rvcik7XG5cblx0XHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdHBsYXllci5kaXNwbGF5U2xpZGVzKCk7XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHR9XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcblx0XHRcdHBsYXllci5kaXNwbGF5Q2hhcHRlcnMoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRwbGF5ZXIuY29udGFpbmVyLmhvdmVyKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGNoYXB0ZXJzXG5cdFx0XHRcdGlmIChwbGF5ZXIuaGFzQ2hhcHRlcnMpIHtcblx0XHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdFx0XHRcdHBsYXllci5jaGFwdGVycy5mYWRlSW4oMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGxldCBzZWxmID0gJCh0aGlzKTtcblx0XHRcdFx0XHRcdHNlbGYuaGVpZ2h0KHNlbGYuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXJgKS5vdXRlckhlaWdodCgpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAocGxheWVyLmhhc0NoYXB0ZXJzKSB7XG5cdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLmZhZGVPdXQoMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b2Zmc2NyZWVuYCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cGxheWVyLmNoYXB0ZXJzLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cblx0XHR0LmNvbnRhaW5lci5vbignY29udHJvbHNyZXNpemUnLCAoKSA9PiB7XG5cdFx0XHR0LmFkanVzdExhbmd1YWdlQm94KCk7XG5cdFx0fSk7XG5cblx0XHQvLyBjaGVjayBmb3IgYXV0b3BsYXlcblx0XHRpZiAocGxheWVyLm5vZGUuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpICE9PSBudWxsKSB7XG5cdFx0XHRwbGF5ZXIuY2hhcHRlcnMuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRmVhdHVyZSBkZXN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGNsZWFuYCBhbmQgdGhlIG5hbWUgdGhhdCB3YXMgdXNlZCBpbiBNZXBEZWZhdWx0cy5mZWF0dXJlcyBsaXN0XG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50UGxheWVyfSBwbGF5ZXJcblx0ICovXG5cdGNsZWFydHJhY2tzOiBmdW5jdGlvbiAocGxheWVyKSAge1xuXHRcdGlmIChwbGF5ZXIpIHtcblx0XHRcdGlmIChwbGF5ZXIuY2FwdGlvbnMpIHtcblx0XHRcdFx0cGxheWVyLmNhcHRpb25zLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBsYXllci5jaGFwdGVycykge1xuXHRcdFx0XHRwbGF5ZXIuY2hhcHRlcnMucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGxheWVyLmNhcHRpb25zVGV4dCkge1xuXHRcdFx0XHRwbGF5ZXIuY2FwdGlvbnNUZXh0LnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBsYXllci5jYXB0aW9uc0J1dHRvbikge1xuXHRcdFx0XHRwbGF5ZXIuY2FwdGlvbnNCdXR0b24ucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHJlYnVpbGR0cmFja3M6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdHQuZmluZFRyYWNrcygpO1xuXHRcdHQuYnVpbGR0cmFja3ModCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXHR9LFxuXG5cdGZpbmRUcmFja3M6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHRyYWNrdGFncyA9IHQuJG1lZGlhLmZpbmQoJ3RyYWNrJylcblx0XHRcdDtcblxuXHRcdC8vIHN0b3JlIGZvciB1c2UgYnkgcGx1Z2luc1xuXHRcdHQudHJhY2tzID0gW107XG5cdFx0dHJhY2t0YWdzLmVhY2goKGluZGV4LCB0cmFjaykgPT4ge1xuXG5cdFx0XHR0cmFjayA9ICQodHJhY2spO1xuXG5cdFx0XHRsZXQgc3JjbGFuZyA9ICh0cmFjay5hdHRyKCdzcmNsYW5nJykpID8gdHJhY2suYXR0cignc3JjbGFuZycpLnRvTG93ZXJDYXNlKCkgOiAnJztcblx0XHRcdGxldCB0cmFja0lkID0gYCR7dC5pZH1fdHJhY2tfJHtpbmRleH1fJHt0cmFjay5hdHRyKCdraW5kJyl9XyR7c3JjbGFuZ31gO1xuXHRcdFx0dC50cmFja3MucHVzaCh7XG5cdFx0XHRcdHRyYWNrSWQ6IHRyYWNrSWQsXG5cdFx0XHRcdHNyY2xhbmc6IHNyY2xhbmcsXG5cdFx0XHRcdHNyYzogdHJhY2suYXR0cignc3JjJyksXG5cdFx0XHRcdGtpbmQ6IHRyYWNrLmF0dHIoJ2tpbmQnKSxcblx0XHRcdFx0bGFiZWw6IHRyYWNrLmF0dHIoJ2xhYmVsJykgfHwgJycsXG5cdFx0XHRcdGVudHJpZXM6IFtdLFxuXHRcdFx0XHRpc0xvYWRlZDogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZCwgb3IgXCJub25lXCIgdG8gZGlzYWJsZSBjYXB0aW9uc1xuXHQgKi9cblx0c2V0VHJhY2s6IGZ1bmN0aW9uICh0cmFja0lkKSAge1xuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRpXG5cdFx0XHQ7XG5cblx0XHR0LmNhcHRpb25zQnV0dG9uXG5cdFx0XHQuZmluZCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuXHRcdFx0LmVuZCgpXG5cdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkYClcblx0XHRcdC5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0ZWRgKVxuXHRcdFx0LmVuZCgpXG5cdFx0XHQuZmluZChgaW5wdXRbdmFsdWU9XCIke3RyYWNrSWR9XCJdYCkucHJvcCgnY2hlY2tlZCcsIHRydWUpXG5cdFx0XHQuc2libGluZ3MoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3Rvci1sYWJlbGApXG5cdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdGVkYClcblx0XHQ7XG5cblx0XHRpZiAodHJhY2tJZCA9PT0gJ25vbmUnKSB7XG5cdFx0XHR0LnNlbGVjdGVkVHJhY2sgPSBudWxsO1xuXHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtZW5hYmxlZGApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0LnRyYWNrcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IHRyYWNrID0gdC50cmFja3NbaV07XG5cdFx0XHRpZiAodHJhY2sudHJhY2tJZCA9PT0gdHJhY2tJZCkge1xuXHRcdFx0XHRpZiAodC5zZWxlY3RlZFRyYWNrID09PSBudWxsKSB7XG5cdFx0XHRcdFx0dC5jYXB0aW9uc0J1dHRvbi5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtZW5hYmxlZGApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQuc2VsZWN0ZWRUcmFjayA9IHRyYWNrO1xuXHRcdFx0XHR0LmNhcHRpb25zLmF0dHIoJ2xhbmcnLCB0LnNlbGVjdGVkVHJhY2suc3JjbGFuZyk7XG5cdFx0XHRcdHQuZGlzcGxheUNhcHRpb25zKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICovXG5cdGxvYWROZXh0VHJhY2s6IGZ1bmN0aW9uICgpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC50cmFja1RvTG9hZCsrO1xuXHRcdGlmICh0LnRyYWNrVG9Mb2FkIDwgdC50cmFja3MubGVuZ3RoKSB7XG5cdFx0XHR0LmlzTG9hZGluZ1RyYWNrID0gdHJ1ZTtcblx0XHRcdHQubG9hZFRyYWNrKHQudHJhY2tUb0xvYWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBhZGQgZG9uZT9cblx0XHRcdHQuaXNMb2FkaW5nVHJhY2sgPSBmYWxzZTtcblxuXHRcdFx0dC5jaGVja0ZvclRyYWNrcygpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIGluZGV4XG5cdCAqL1xuXHRsb2FkVHJhY2s6IGZ1bmN0aW9uIChpbmRleCkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dHJhY2sgPSB0LnRyYWNrc1tpbmRleF0sXG5cdFx0XHRhZnRlciA9ICgpID0+IHtcblxuXHRcdFx0XHR0cmFjay5pc0xvYWRlZCA9IHRydWU7XG5cblx0XHRcdFx0dC5lbmFibGVUcmFja0J1dHRvbih0cmFjayk7XG5cblx0XHRcdFx0dC5sb2FkTmV4dFRyYWNrKCk7XG5cblx0XHRcdH1cblx0XHRcdDtcblxuXHRcdGlmICh0cmFjayAhPT0gdW5kZWZpbmVkICYmICh0cmFjay5zcmMgIT09IHVuZGVmaW5lZCB8fCB0cmFjay5zcmMgIT09IFwiXCIpKSB7XG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmw6IHRyYWNrLnNyYyxcblx0XHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKGQpICB7XG5cblx0XHRcdFx0XHQvLyBwYXJzZSB0aGUgbG9hZGVkIGZpbGVcblx0XHRcdFx0XHRpZiAodHlwZW9mIGQgPT09ICdzdHJpbmcnICYmICgvPHR0XFxzK3htbC9pZykuZXhlYyhkKSkge1xuXHRcdFx0XHRcdFx0dHJhY2suZW50cmllcyA9IG1lanMuVHJhY2tGb3JtYXRQYXJzZXIuZGZ4cC5wYXJzZShkKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHJhY2suZW50cmllcyA9IG1lanMuVHJhY2tGb3JtYXRQYXJzZXIud2VidnR0LnBhcnNlKGQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGFmdGVyKCk7XG5cblx0XHRcdFx0XHRpZiAodHJhY2sua2luZCA9PT0gJ2NoYXB0ZXJzJykge1xuXHRcdFx0XHRcdFx0dC5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAodC5tZWRpYS5kdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR0LmRpc3BsYXlDaGFwdGVycygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHRyYWNrLmtpbmQgPT09ICdzbGlkZXMnKSB7XG5cdFx0XHRcdFx0XHR0LnNldHVwU2xpZGVzKHRyYWNrKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSAge1xuXHRcdFx0XHRcdHQucmVtb3ZlVHJhY2tCdXR0b24odHJhY2sudHJhY2tJZCk7XG5cdFx0XHRcdFx0dC5sb2FkTmV4dFRyYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrIC0gVGhlIGxhbmd1YWdlIGNvZGVcblx0ICovXG5cdGVuYWJsZVRyYWNrQnV0dG9uOiBmdW5jdGlvbiAodHJhY2spICB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGxhbmcgPSB0cmFjay5zcmNsYW5nLFxuXHRcdFx0bGFiZWwgPSB0cmFjay5sYWJlbCxcblx0XHRcdHRhcmdldCA9ICQoYCMke3RyYWNrLnRyYWNrSWR9YClcblx0XHQ7XG5cblx0XHRpZiAobGFiZWwgPT09ICcnKSB7XG5cdFx0XHRsYWJlbCA9IGkxOG4udChtZWpzLmxhbmd1YWdlLmNvZGVzW2xhbmddKSB8fCBsYW5nO1xuXHRcdH1cblxuXHRcdHRhcmdldC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuXHRcdC5zaWJsaW5ncyhgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxhYmVsYCkuaHRtbChsYWJlbCk7XG5cblx0XHQvLyBhdXRvIHNlbGVjdFxuXHRcdGlmICh0Lm9wdGlvbnMuc3RhcnRMYW5ndWFnZSA9PT0gbGFuZykge1xuXHRcdFx0dGFyZ2V0LnByb3AoJ2NoZWNrZWQnLCB0cnVlKS50cmlnZ2VyKCdjbGljaycpO1xuXHRcdH1cblxuXHRcdHQuYWRqdXN0TGFuZ3VhZ2VCb3goKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcblx0ICovXG5cdHJlbW92ZVRyYWNrQnV0dG9uOiBmdW5jdGlvbiAodHJhY2tJZCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoYGlucHV0W2lkPSR7dHJhY2tJZH1dYCkuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcblxuXHRcdHQuYWRqdXN0TGFuZ3VhZ2VCb3goKTtcblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxhbmcgLSBUaGUgbGFuZ3VhZ2UgY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWxcblx0ICovXG5cdGFkZFRyYWNrQnV0dG9uOiBmdW5jdGlvbiAodHJhY2tJZCwgbGFuZywgbGFiZWwpICB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXHRcdGlmIChsYWJlbCA9PT0gJycpIHtcblx0XHRcdGxhYmVsID0gaTE4bi50KG1lanMubGFuZ3VhZ2UuY29kZXNbbGFuZ10pIHx8IGxhbmc7XG5cdFx0fVxuXG5cdFx0Ly8gdHJhY2tJZCBpcyB1c2VkIGluIHRoZSB2YWx1ZSwgdG9vLCBiZWNhdXNlIHRoZSBcIm5vbmVcIlxuXHRcdC8vIGNhcHRpb24gb3B0aW9uIGRvZXNuJ3QgaGF2ZSBhIHRyYWNrSWQgYnV0IHdlIG5lZWQgdG8gYmUgYWJsZVxuXHRcdC8vIHRvIHNldCBpdCwgdG9vXG5cdFx0dC5jYXB0aW9uc0J1dHRvbi5maW5kKCd1bCcpLmFwcGVuZChcblx0XHRcdCQoYDxsaSBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxpc3QtaXRlbVwiPmAgK1xuXHRcdFx0XHRgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtc2VsZWN0b3ItaW5wdXRcImAgK1xuXHRcdFx0XHRgbmFtZT1cIiR7dC5pZH1fY2FwdGlvbnNcIiBpZD1cIiR7dHJhY2tJZH1cIiB2YWx1ZT1cIiR7dHJhY2tJZH1cIiBkaXNhYmxlZD1cImRpc2FibGVkXCIgLz5gICtcblx0XHRcdFx0YDxsYWJlbCBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxhYmVsXCI+JHtsYWJlbH0gKGxvYWRpbmcpPC9sYWJlbD5gICtcblx0XHRcdGA8L2xpPmApXG5cdFx0KTtcblxuXHRcdHQuYWRqdXN0TGFuZ3VhZ2VCb3goKTtcblxuXHRcdC8vIHJlbW92ZSB0aGlzIGZyb20gdGhlIGRyb3Bkb3dubGlzdCAoaWYgaXQgZXhpc3RzKVxuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10cmFuc2xhdGlvbnMgb3B0aW9uW3ZhbHVlPSR7bGFuZ31dYCkucmVtb3ZlKCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRhZGp1c3RMYW5ndWFnZUJveDogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cdFx0Ly8gYWRqdXN0IHRoZSBzaXplIG9mIHRoZSBvdXRlciBib3hcblx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy1zZWxlY3RvcmApLmhlaWdodChcblx0XHRcdHQuY2FwdGlvbnNCdXR0b24uZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNhcHRpb25zLXNlbGVjdG9yLWxpc3RgKS5vdXRlckhlaWdodCh0cnVlKSArXG5cdFx0XHR0LmNhcHRpb25zQnV0dG9uLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jYXB0aW9ucy10cmFuc2xhdGlvbnNgKS5vdXRlckhlaWdodCh0cnVlKVxuXHRcdCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjaGVja0ZvclRyYWNrczogZnVuY3Rpb24gKCkgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aGFzU3VidGl0bGVzID0gZmFsc2Vcblx0XHQ7XG5cblx0XHQvLyBjaGVjayBpZiBhbnkgc3VidGl0bGVzXG5cdFx0aWYgKHQub3B0aW9ucy5oaWRlQ2FwdGlvbnNCdXR0b25XaGVuRW1wdHkpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCB0b3RhbCA9IHQudHJhY2tzLmxlbmd0aDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdFx0bGV0IGtpbmQgPSB0LnRyYWNrc1tpXS5raW5kO1xuXHRcdFx0XHRpZiAoKGtpbmQgPT09ICdzdWJ0aXRsZXMnIHx8IGtpbmQgPT09ICdjYXB0aW9ucycpICYmIHQudHJhY2tzW2ldLmlzTG9hZGVkKSB7XG5cdFx0XHRcdFx0aGFzU3VidGl0bGVzID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWhhc1N1YnRpdGxlcykge1xuXHRcdFx0XHR0LmNhcHRpb25zQnV0dG9uLmhpZGUoKTtcblx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRkaXNwbGF5Q2FwdGlvbnM6IGZ1bmN0aW9uICgpICB7XG5cblx0XHRpZiAodGhpcy50cmFja3MgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHR0cmFjayA9IHQuc2VsZWN0ZWRUcmFjayxcblx0XHRcdGlcblx0XHQ7XG5cblx0XHRpZiAodHJhY2sgIT09IG51bGwgJiYgdHJhY2suaXNMb2FkZWQpIHtcblx0XHRcdGkgPSB0LnNlYXJjaFRyYWNrUG9zaXRpb24odHJhY2suZW50cmllcywgdC5tZWRpYS5jdXJyZW50VGltZSk7XG5cdFx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHRcdC8vIFNldCB0aGUgbGluZSBiZWZvcmUgdGhlIHRpbWVjb2RlIGFzIGEgY2xhc3Mgc28gdGhlIGN1ZSBjYW4gYmUgdGFyZ2V0ZWQgaWYgbmVlZGVkXG5cdFx0XHRcdHQuY2FwdGlvbnNUZXh0Lmh0bWwodHJhY2suZW50cmllc1tpXS50ZXh0KVxuXHRcdFx0XHQuYXR0cignY2xhc3MnLCBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2FwdGlvbnMtdGV4dCAkeyh0cmFjay5lbnRyaWVzW2ldLmlkZW50aWZpZXIgfHwgJycpfWApO1xuXHRcdFx0XHR0LmNhcHRpb25zLnNob3coKS5oZWlnaHQoMCk7XG5cdFx0XHRcdHJldHVybjsgLy8gZXhpdCBvdXQgaWYgb25lIGlzIHZpc2libGU7XG5cdFx0XHR9XG5cblx0XHRcdHQuY2FwdGlvbnMuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0LmNhcHRpb25zLmhpZGUoKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYWNrXG5cdCAqL1xuXHRzZXR1cFNsaWRlczogZnVuY3Rpb24gKHRyYWNrKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuc2xpZGVzID0gdHJhY2s7XG5cdFx0dC5zbGlkZXMuZW50cmllcy5pbWdzID0gW3Quc2xpZGVzLmVudHJpZXMubGVuZ3RoXTtcblx0XHR0LnNob3dTbGlkZSgwKTtcblxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcblx0ICovXG5cdHNob3dTbGlkZTogZnVuY3Rpb24gKGluZGV4KSAge1xuXHRcdGlmICh0aGlzLnRyYWNrcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuc2xpZGVzQ29udGFpbmVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0dXJsID0gdC5zbGlkZXMuZW50cmllc1tpbmRleF0udGV4dCxcblx0XHRcdGltZyA9IHQuc2xpZGVzLmVudHJpZXNbaW5kZXhdLmltZ3Ncblx0XHQ7XG5cblx0XHRpZiAoaW1nID09PSB1bmRlZmluZWQgfHwgaW1nLmZhZGVJbiA9PT0gdW5kZWZpbmVkKSB7XG5cblx0XHRcdHQuc2xpZGVzLmVudHJpZXNbaW5kZXhdLmltZ3MgPSBpbWcgPSAkKGA8aW1nIHNyYz1cIiR7dXJsfVwiPmApXG5cdFx0XHQub24oJ2xvYWQnLCAoKSA9PiB7XG5cdFx0XHRcdGltZy5hcHBlbmRUbyh0LnNsaWRlc0NvbnRhaW5lcilcblx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHQuZmFkZUluKClcblx0XHRcdFx0LnNpYmxpbmdzKCc6dmlzaWJsZScpXG5cdFx0XHRcdC5mYWRlT3V0KCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKCFpbWcuaXMoJzp2aXNpYmxlJykgJiYgIWltZy5pcygnOmFuaW1hdGVkJykpIHtcblx0XHRcdFx0aW1nLmZhZGVJbigpXG5cdFx0XHRcdC5zaWJsaW5ncygnOnZpc2libGUnKVxuXHRcdFx0XHQuZmFkZU91dCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZGlzcGxheVNsaWRlczogZnVuY3Rpb24gKCkgIHtcblxuXHRcdGlmICh0aGlzLnNsaWRlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHNsaWRlcyA9IHQuc2xpZGVzLFxuXHRcdFx0aSA9IHQuc2VhcmNoVHJhY2tQb3NpdGlvbihzbGlkZXMuZW50cmllcywgdC5tZWRpYS5jdXJyZW50VGltZSlcblx0XHQ7XG5cblx0XHRpZiAoaSA+IC0xKSB7XG5cdFx0XHR0LnNob3dTbGlkZShpKTtcblx0XHRcdHJldHVybjsgLy8gZXhpdCBvdXQgaWYgb25lIGlzIHZpc2libGU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0ZGlzcGxheUNoYXB0ZXJzOiBmdW5jdGlvbiAoKSAge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGZvciAobGV0IGkgPSAwLCB0b3RhbCA9IHQudHJhY2tzLmxlbmd0aDsgaSA8IHRvdGFsOyBpKyspIHtcblx0XHRcdGlmICh0LnRyYWNrc1tpXS5raW5kID09PSAnY2hhcHRlcnMnICYmIHQudHJhY2tzW2ldLmlzTG9hZGVkKSB7XG5cdFx0XHRcdHQuZHJhd0NoYXB0ZXJzKHQudHJhY2tzW2ldKTtcblx0XHRcdFx0dC5oYXNDaGFwdGVycyA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGNoYXB0ZXJzXG5cdCAqL1xuXHRkcmF3Q2hhcHRlcnM6IGZ1bmN0aW9uIChjaGFwdGVycykgIHtcblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0aSxcblx0XHRcdGR1cixcblx0XHRcdHBlcmNlbnQgPSAwLFxuXHRcdFx0dXNlZFBlcmNlbnQgPSAwLFxuXHRcdFx0dG90YWwgPSBjaGFwdGVycy5lbnRyaWVzLmxlbmd0aFxuXHRcdDtcblxuXHRcdHQuY2hhcHRlcnMuZW1wdHkoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG5cdFx0XHRkdXIgPSBjaGFwdGVycy5lbnRyaWVzW2ldLnN0b3AgLSBjaGFwdGVycy5lbnRyaWVzW2ldLnN0YXJ0O1xuXHRcdFx0cGVyY2VudCA9IE1hdGguZmxvb3IoZHVyIC8gdC5tZWRpYS5kdXJhdGlvbiAqIDEwMCk7XG5cblx0XHRcdC8vIHRvbyBsYXJnZSBvciBub3QgZ29pbmcgdG8gZmlsbCBpdCBpblxuXHRcdFx0aWYgKHBlcmNlbnQgKyB1c2VkUGVyY2VudCA+IDEwMCB8fFxuXHRcdFx0XHRpID09PSBjaGFwdGVycy5lbnRyaWVzLmxlbmd0aCAtIDEgJiYgcGVyY2VudCArIHVzZWRQZXJjZW50IDwgMTAwKSB7XG5cdFx0XHRcdHBlcmNlbnQgPSAxMDAgLSB1c2VkUGVyY2VudDtcblx0XHRcdH1cblxuXHRcdFx0dC5jaGFwdGVycy5hcHBlbmQoJChcblx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jaGFwdGVyXCIgcmVsPVwiJHtjaGFwdGVycy5lbnRyaWVzW2ldLnN0YXJ0fVwiIHN0eWxlPVwibGVmdDogJHt1c2VkUGVyY2VudC50b1N0cmluZygpfSU7IHdpZHRoOiAke3BlcmNlbnQudG9TdHJpbmcoKX0lO1wiPmAgK1xuXHRcdFx0XHQgXHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXItYmxvY2tgICtcblx0XHRcdFx0IFx0YCR7KGkgPT09IGNoYXB0ZXJzLmVudHJpZXMubGVuZ3RoIC0gMSkgPyBgICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXItYmxvY2stbGFzdGAgOiAnJ31cIj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cImNoLXRpdGxlXCI+JHtjaGFwdGVycy5lbnRyaWVzW2ldLnRleHR9PC9zcGFuPmAgK1xuXHRcdFx0XHRcdFx0YDxzcGFuIGNsYXNzPVwiY2gtdGltZVwiPmAgK1xuXHRcdFx0XHRcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZShjaGFwdGVycy5lbnRyaWVzW2ldLnN0YXJ0LCB0Lm9wdGlvbnMuYWx3YXlzU2hvd0hvdXJzKX1gICtcblx0XHRcdFx0IFx0XHRcdGAmbmRhc2g7YCArXG5cdFx0XHRcdCBcdFx0XHRgJHtzZWNvbmRzVG9UaW1lQ29kZShjaGFwdGVycy5lbnRyaWVzW2ldLnN0b3AsIHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpfWAgK1xuXHRcdFx0XHRcdFx0YDwvc3Bhbj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKSk7XG5cdFx0XHR1c2VkUGVyY2VudCArPSBwZXJjZW50O1xuXHRcdH1cblxuXHRcdHQuY2hhcHRlcnMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNoYXB0ZXJgKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdHQubWVkaWEuc2V0Q3VycmVudFRpbWUocGFyc2VGbG9hdCgkKHRoaXMpLmF0dHIoJ3JlbCcpKSk7XG5cdFx0XHRpZiAodC5tZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0dC5tZWRpYS5wbGF5KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0LmNoYXB0ZXJzLnNob3coKTtcblx0fSxcblx0LyoqXG5cdCAqIFBlcmZvcm0gYmluYXJ5IHNlYXJjaCB0byBsb29rIGZvciBwcm9wZXIgdHJhY2sgaW5kZXhcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gdHJhY2tzXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjdXJyZW50VGltZVxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9XG5cdCAqL1xuXHRzZWFyY2hUcmFja1Bvc2l0aW9uOiBmdW5jdGlvbiAodHJhY2tzLCBjdXJyZW50VGltZSkgIHtcblx0XHRsZXRcblx0XHRcdGxvID0gMCxcblx0XHRcdGhpID0gdHJhY2tzLmxlbmd0aCAtIDEsXG5cdFx0XHRtaWQsXG5cdFx0XHRzdGFydCxcblx0XHRcdHN0b3Bcblx0XHRcdDtcblxuXHRcdHdoaWxlIChsbyA8PSBoaSkge1xuXHRcdFx0bWlkID0gKChsbyArIGhpKSA+PiAxKTtcblx0XHRcdHN0YXJ0ID0gdHJhY2tzW21pZF0uc3RhcnQ7XG5cdFx0XHRzdG9wID0gdHJhY2tzW21pZF0uc3RvcDtcblxuXHRcdFx0aWYgKGN1cnJlbnRUaW1lID49IHN0YXJ0ICYmIGN1cnJlbnRUaW1lIDwgc3RvcCkge1xuXHRcdFx0XHRyZXR1cm4gbWlkO1xuXHRcdFx0fSBlbHNlIGlmIChzdGFydCA8IGN1cnJlbnRUaW1lKSB7XG5cdFx0XHRcdGxvID0gbWlkICsgMTtcblx0XHRcdH0gZWxzZSBpZiAoc3RhcnQgPiBjdXJyZW50VGltZSkge1xuXHRcdFx0XHRoaSA9IG1pZCAtIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIC0xO1xuXHR9XG59KTtcblxuLyoqXG4gKiBNYXAgYWxsIHBvc3NpYmxlIGxhbmd1YWdlcyB3aXRoIHRoZWlyIHJlc3BlY3RpdmUgY29kZVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5tZWpzLmxhbmd1YWdlID0ge1xuXHRjb2Rlczoge1xuXHRcdGFmOiAnbWVqcy5hZnJpa2FhbnMnLFxuXHRcdHNxOiAnbWVqcy5hbGJhbmlhbicsXG5cdFx0YXI6ICdtZWpzLmFyYWJpYycsXG5cdFx0YmU6ICdtZWpzLmJlbGFydXNpYW4nLFxuXHRcdGJnOiAnbWVqcy5idWxnYXJpYW4nLFxuXHRcdGNhOiAnbWVqcy5jYXRhbGFuJyxcblx0XHR6aDogJ21lanMuY2hpbmVzZScsXG5cdFx0J3poLWNuJzogJ21lanMuY2hpbmVzZS1zaW1wbGlmaWVkJyxcblx0XHQnemgtdHcnOiAnbWVqcy5jaGluZXMtdHJhZGl0aW9uYWwnLFxuXHRcdGhyOiAnbWVqcy5jcm9hdGlhbicsXG5cdFx0Y3M6ICdtZWpzLmN6ZWNoJyxcblx0XHRkYTogJ21lanMuZGFuaXNoJyxcblx0XHRubDogJ21lanMuZHV0Y2gnLFxuXHRcdGVuOiAnbWVqcy5lbmdsaXNoJyxcblx0XHRldDogJ21lanMuZXN0b25pYW4nLFxuXHRcdGZsOiAnbWVqcy5maWxpcGlubycsXG5cdFx0Zmk6ICdtZWpzLmZpbm5pc2gnLFxuXHRcdGZyOiAnbWVqcy5mcmVuY2gnLFxuXHRcdGdsOiAnbWVqcy5nYWxpY2lhbicsXG5cdFx0ZGU6ICdtZWpzLmdlcm1hbicsXG5cdFx0ZWw6ICdtZWpzLmdyZWVrJyxcblx0XHRodDogJ21lanMuaGFpdGlhbi1jcmVvbGUnLFxuXHRcdGl3OiAnbWVqcy5oZWJyZXcnLFxuXHRcdGhpOiAnbWVqcy5oaW5kaScsXG5cdFx0aHU6ICdtZWpzLmh1bmdhcmlhbicsXG5cdFx0aXM6ICdtZWpzLmljZWxhbmRpYycsXG5cdFx0aWQ6ICdtZWpzLmluZG9uZXNpYW4nLFxuXHRcdGdhOiAnbWVqcy5pcmlzaCcsXG5cdFx0aXQ6ICdtZWpzLml0YWxpYW4nLFxuXHRcdGphOiAnbWVqcy5qYXBhbmVzZScsXG5cdFx0a286ICdtZWpzLmtvcmVhbicsXG5cdFx0bHY6ICdtZWpzLmxhdHZpYW4nLFxuXHRcdGx0OiAnbWVqcy5saXRodWFuaWFuJyxcblx0XHRtazogJ21lanMubWFjZWRvbmlhbicsXG5cdFx0bXM6ICdtZWpzLm1hbGF5Jyxcblx0XHRtdDogJ21lanMubWFsdGVzZScsXG5cdFx0bm86ICdtZWpzLm5vcndlZ2lhbicsXG5cdFx0ZmE6ICdtZWpzLnBlcnNpYW4nLFxuXHRcdHBsOiAnbWVqcy5wb2xpc2gnLFxuXHRcdHB0OiAnbWVqcy5wb3J0dWd1ZXNlJyxcblx0XHRybzogJ21lanMucm9tYW5pYW4nLFxuXHRcdHJ1OiAnbWVqcy5ydXNzaWFuJyxcblx0XHRzcjogJ21lanMuc2VyYmlhbicsXG5cdFx0c2s6ICdtZWpzLnNsb3ZhaycsXG5cdFx0c2w6ICdtZWpzLnNsb3ZlbmlhbicsXG5cdFx0ZXM6ICdtZWpzLnNwYW5pc2gnLFxuXHRcdHN3OiAnbWVqcy5zd2FoaWxpJyxcblx0XHRzdjogJ21lanMuc3dlZGlzaCcsXG5cdFx0dGw6ICdtZWpzLnRhZ2Fsb2cnLFxuXHRcdHRoOiAnbWVqcy50aGFpJyxcblx0XHR0cjogJ21lanMudHVya2lzaCcsXG5cdFx0dWs6ICdtZWpzLnVrcmFpbmlhbicsXG5cdFx0dmk6ICdtZWpzLnZpZXRuYW1lc2UnLFxuXHRcdGN5OiAnbWVqcy53ZWxzaCcsXG5cdFx0eWk6ICdtZWpzLnlpZGRpc2gnXG5cdH1cbn07XG5cbi8qXG4gUGFyc2VzIFdlYlZUVCBmb3JtYXQgd2hpY2ggc2hvdWxkIGJlIGZvcm1hdHRlZCBhc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gV0VCVlRUXG5cbiAxXG4gMDA6MDA6MDEsMSAtLT4gMDA6MDA6MDUsMDAwXG4gQSBsaW5lIG9mIHRleHRcblxuIDJcbiAwMDowMToxNSwxIC0tPiAwMDowMjowNSwwMDBcbiBBIHNlY29uZCBsaW5lIG9mIHRleHRcblxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIEFkYXB0ZWQgZnJvbTogaHR0cDovL3d3dy5kZWxwaGlraS5jb20vaHRtbDUvcGxheXJcbiAqL1xubWVqcy5UcmFja0Zvcm1hdFBhcnNlciA9IHtcblx0d2VidnR0OiB7XG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cblx0XHRwYXR0ZXJuX3RpbWVjb2RlOiAvXigoPzpbMC05XXsxLDJ9Oik/WzAtOV17Mn06WzAtOV17Mn0oWywuXVswLTldezEsM30pPykgLS1cXD4gKCg/OlswLTldezEsMn06KT9bMC05XXsyfTpbMC05XXsyfShbLC5dWzAtOV17M30pPykoLiopJC8sXG5cblx0XHQvKipcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja1RleHRcblx0XHQgKiBAcmV0dXJucyB7e3RleHQ6IEFycmF5LCB0aW1lczogQXJyYXl9fVxuXHRcdCAqL1xuXHRcdHBhcnNlOiBmdW5jdGlvbiAodHJhY2tUZXh0KSAge1xuXHRcdFx0bGV0XG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRsaW5lcyA9IG1lanMuVHJhY2tGb3JtYXRQYXJzZXIuc3BsaXQyKHRyYWNrVGV4dCwgL1xccj9cXG4vKSxcblx0XHRcdFx0ZW50cmllcyA9IFtdLFxuXHRcdFx0XHR0aW1lY29kZSxcblx0XHRcdFx0dGV4dCxcblx0XHRcdFx0aWRlbnRpZmllcjtcblx0XHRcdGZvciAoOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGltZWNvZGUgPSB0aGlzLnBhdHRlcm5fdGltZWNvZGUuZXhlYyhsaW5lc1tpXSk7XG5cblx0XHRcdFx0aWYgKHRpbWVjb2RlICYmIGkgPCBsaW5lcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAoKGkgLSAxKSA+PSAwICYmIGxpbmVzW2kgLSAxXSAhPT0gJycpIHtcblx0XHRcdFx0XHRcdGlkZW50aWZpZXIgPSBsaW5lc1tpIC0gMV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0XHQvLyBncmFiIGFsbCB0aGUgKHBvc3NpYmx5IG11bHRpLWxpbmUpIHRleHQgdGhhdCBmb2xsb3dzXG5cdFx0XHRcdFx0dGV4dCA9IGxpbmVzW2ldO1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0XHR3aGlsZSAobGluZXNbaV0gIT09ICcnICYmIGkgPCBsaW5lcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRleHQgPSBgJHt0ZXh0fVxcbiR7bGluZXNbaV19YDtcblx0XHRcdFx0XHRcdGkrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGV4dCA9ICQudHJpbSh0ZXh0KS5yZXBsYWNlKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWcsIFwiPGEgaHJlZj0nJDEnIHRhcmdldD0nX2JsYW5rJz4kMTwvYT5cIik7XG5cdFx0XHRcdFx0ZW50cmllcy5wdXNoKHtcblx0XHRcdFx0XHRcdGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG5cdFx0XHRcdFx0XHRzdGFydDogKGNvbnZlcnRTTVBURXRvU2Vjb25kcyh0aW1lY29kZVsxXSkgPT09IDApID8gMC4yMDAgOiBjb252ZXJ0U01QVEV0b1NlY29uZHModGltZWNvZGVbMV0pLFxuXHRcdFx0XHRcdFx0c3RvcDogY29udmVydFNNUFRFdG9TZWNvbmRzKHRpbWVjb2RlWzNdKSxcblx0XHRcdFx0XHRcdHRleHQ6IHRleHQsXG5cdFx0XHRcdFx0XHRzZXR0aW5nczogdGltZWNvZGVbNV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZGVudGlmaWVyID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZW50cmllcztcblx0XHR9XG5cdH0sXG5cdC8vIFRoYW5rcyB0byBKdXN0aW4gQ2FwZWxsYTogaHR0cHM6Ly9naXRodWIuY29tL2pvaG5keWVyL21lZGlhZWxlbWVudC9wdWxsLzQyMFxuXHRkZnhwOiB7XG5cdFx0LyoqXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tUZXh0XG5cdFx0ICogQHJldHVybnMge3t0ZXh0OiBBcnJheSwgdGltZXM6IEFycmF5fX1cblx0XHQgKi9cblx0XHRwYXJzZTogZnVuY3Rpb24gKHRyYWNrVGV4dCkgIHtcblx0XHRcdHRyYWNrVGV4dCA9ICQodHJhY2tUZXh0KS5maWx0ZXIoJ3R0Jyk7XG5cdFx0XHRsZXRcblx0XHRcdFx0Y29udGFpbmVyID0gdHJhY2tUZXh0LmNoaWxkcmVuKCdkaXYnKS5lcSgwKSxcblx0XHRcdFx0bGluZXMgPSBjb250YWluZXIuZmluZCgncCcpLFxuXHRcdFx0XHRzdHlsZU5vZGUgPSB0cmFja1RleHQuZmluZChgIyR7Y29udGFpbmVyLmF0dHIoJ3N0eWxlJyl9YCksXG5cdFx0XHRcdHN0eWxlcyxcblx0XHRcdFx0ZW50cmllcyA9IFtdLFxuXHRcdFx0XHRpXG5cdFx0XHQ7XG5cblxuXHRcdFx0aWYgKHN0eWxlTm9kZS5sZW5ndGgpIHtcblx0XHRcdFx0bGV0IGF0dHJpYnV0ZXMgPSBzdHlsZU5vZGUucmVtb3ZlQXR0cignaWQnKS5nZXQoMCkuYXR0cmlidXRlcztcblx0XHRcdFx0aWYgKGF0dHJpYnV0ZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0c3R5bGVzID0ge307XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHN0eWxlc1thdHRyaWJ1dGVzW2ldLm5hbWUuc3BsaXQoXCI6XCIpWzFdXSA9IGF0dHJpYnV0ZXNbaV0udmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHRzdHlsZSxcblx0XHRcdFx0XHRfdGVtcCA9IHtcblx0XHRcdFx0XHRcdHN0YXJ0OiBudWxsLFxuXHRcdFx0XHRcdFx0c3RvcDogbnVsbCxcblx0XHRcdFx0XHRcdHN0eWxlOiBudWxsLFxuXHRcdFx0XHRcdFx0dGV4dDogbnVsbFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0O1xuXG5cdFx0XHRcdGlmIChsaW5lcy5lcShpKS5hdHRyKCdiZWdpbicpKSB7XG5cdFx0XHRcdFx0X3RlbXAuc3RhcnQgPSBjb252ZXJ0U01QVEV0b1NlY29uZHMobGluZXMuZXEoaSkuYXR0cignYmVnaW4nKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFfdGVtcC5zdGFydCAmJiBsaW5lcy5lcShpIC0gMSkuYXR0cignZW5kJykpIHtcblx0XHRcdFx0XHRfdGVtcC5zdGFydCA9IGNvbnZlcnRTTVBURXRvU2Vjb25kcyhsaW5lcy5lcShpIC0gMSkuYXR0cignZW5kJykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChsaW5lcy5lcShpKS5hdHRyKCdlbmQnKSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0b3AgPSBjb252ZXJ0U01QVEV0b1NlY29uZHMobGluZXMuZXEoaSkuYXR0cignZW5kJykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3RlbXAuc3RvcCAmJiBsaW5lcy5lcShpICsgMSkuYXR0cignYmVnaW4nKSkge1xuXHRcdFx0XHRcdF90ZW1wLnN0b3AgPSBjb252ZXJ0U01QVEV0b1NlY29uZHMobGluZXMuZXEoaSArIDEpLmF0dHIoJ2JlZ2luJykpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHN0eWxlcykge1xuXHRcdFx0XHRcdHN0eWxlID0gJyc7XG5cdFx0XHRcdFx0Zm9yIChsZXQgX3N0eWxlIGluIHN0eWxlcykge1xuXHRcdFx0XHRcdFx0c3R5bGUgKz0gYCR7X3N0eWxlfToke3N0eWxlc1tfc3R5bGVdfTtgO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3R5bGUpIHtcblx0XHRcdFx0XHRfdGVtcC5zdHlsZSA9IHN0eWxlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfdGVtcC5zdGFydCA9PT0gMCkge1xuXHRcdFx0XHRcdF90ZW1wLnN0YXJ0ID0gMC4yMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RlbXAudGV4dCA9ICQudHJpbShsaW5lcy5lcShpKS5odG1sKCkpLnJlcGxhY2UoLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZywgXCI8YSBocmVmPSckMScgdGFyZ2V0PSdfYmxhbmsnPiQxPC9hPlwiKTtcblx0XHRcdFx0ZW50cmllcy5wdXNoKF90ZW1wKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBlbnRyaWVzO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG5cdCAqIEBwYXJhbSB7U3RyaW5nfSByZWdleFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRzcGxpdDI6IGZ1bmN0aW9uICh0ZXh0LCByZWdleCkgIHtcblx0XHQvLyBub3JtYWwgdmVyc2lvbiBmb3IgY29tcGxpYW50IGJyb3dzZXJzXG5cdFx0Ly8gc2VlIGJlbG93IGZvciBJRSBmaXhcblx0XHRyZXR1cm4gdGV4dC5zcGxpdChyZWdleCk7XG5cdH1cbn07XG5cbi8vIHRlc3QgZm9yIGJyb3dzZXJzIHdpdGggYmFkIFN0cmluZy5zcGxpdCBtZXRob2QuXG5pZiAoJ3hcXG5cXG55Jy5zcGxpdCgvXFxuL2dpKS5sZW5ndGggIT09IDMpIHtcblx0Ly8gYWRkIHN1cGVyIHNsb3cgSUU4IGFuZCBiZWxvdyB2ZXJzaW9uXG5cdG1lanMuVHJhY2tGb3JtYXRQYXJzZXIuc3BsaXQyID0gKHRleHQsIHJlZ2V4KSA9PiB7XG5cdFx0bGV0XG5cdFx0XHRwYXJ0cyA9IFtdLFxuXHRcdFx0Y2h1bmsgPSAnJyxcblx0XHRcdGk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2h1bmsgKz0gdGV4dC5zdWJzdHJpbmcoaSwgaSArIDEpO1xuXHRcdFx0aWYgKHJlZ2V4LnRlc3QoY2h1bmspKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goY2h1bmsucmVwbGFjZShyZWdleCwgJycpKTtcblx0XHRcdFx0Y2h1bmsgPSAnJztcblx0XHRcdH1cblx0XHR9XG5cdFx0cGFydHMucHVzaChjaHVuayk7XG5cdFx0cmV0dXJuIHBhcnRzO1xuXHR9O1xufVxuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb25maWd9IGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgTWVkaWFFbGVtZW50UGxheWVyIGZyb20gJy4uL3BsYXllcic7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtJU19BTkRST0lELCBJU19JT1N9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cbi8qKlxuICogVm9sdW1lIGJ1dHRvblxuICpcbiAqIFRoaXMgZmVhdHVyZSBlbmFibGVzIHRoZSBkaXNwbGF5aW5nIG9mIGEgVm9sdW1lIGJ1dHRvbiBpbiB0aGUgY29udHJvbCBiYXIsIGFuZCBhbHNvIGNvbnRhaW5zIGxvZ2ljIHRvIG1hbmlwdWxhdGUgaXRzXG4gKiBldmVudHMsIHN1Y2ggYXMgc2xpZGluZyB1cC9kb3duIChvciBsZWZ0L3JpZ2h0LCBpZiB2ZXJ0aWNhbCksIG11dGluZy91bm11dGluZyBtZWRpYSwgZXRjLlxuICovXG5cblxuLy8gRmVhdHVyZSBjb25maWd1cmF0aW9uXG5PYmplY3QuYXNzaWduKGNvbmZpZywge1xuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdG11dGVUZXh0OiAnJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRhbGx5Vm9sdW1lQ29udHJvbFRleHQ6ICcnLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRoaWRlVm9sdW1lT25Ub3VjaERldmljZXM6IHRydWUsXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0YXVkaW9Wb2x1bWU6ICdob3Jpem9udGFsJyxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR2aWRlb1ZvbHVtZTogJ3ZlcnRpY2FsJ1xufSk7XG5cbk9iamVjdC5hc3NpZ24oTWVkaWFFbGVtZW50UGxheWVyLnByb3RvdHlwZSwge1xuXG5cdC8qKlxuXHQgKiBGZWF0dXJlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBBbHdheXMgaGFzIHRvIGJlIHByZWZpeGVkIHdpdGggYGJ1aWxkYCBhbmQgdGhlIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gTWVwRGVmYXVsdHMuZmVhdHVyZXMgbGlzdFxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudFBsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSB7JH0gY29udHJvbHNcblx0ICogQHBhcmFtIHskfSBsYXllcnNcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVkaWFcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0YnVpbGR2b2x1bWU6IGZ1bmN0aW9uIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSAge1xuXG5cdFx0Ly8gQW5kcm9pZCBhbmQgaU9TIGRvbid0IHN1cHBvcnQgdm9sdW1lIGNvbnRyb2xzXG5cdFx0aWYgKChJU19BTkRST0lEIHx8IElTX0lPUykgJiYgdGhpcy5vcHRpb25zLmhpZGVWb2x1bWVPblRvdWNoRGV2aWNlcykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRtb2RlID0gKHQuaXNWaWRlbykgPyB0Lm9wdGlvbnMudmlkZW9Wb2x1bWUgOiB0Lm9wdGlvbnMuYXVkaW9Wb2x1bWUsXG5cdFx0XHRtdXRlVGV4dCA9IHQub3B0aW9ucy5tdXRlVGV4dCA/IHQub3B0aW9ucy5tdXRlVGV4dCA6IGkxOG4udCgnbWVqcy5tdXRlLXRvZ2dsZScpLFxuXHRcdFx0dm9sdW1lQ29udHJvbFRleHQgPSB0Lm9wdGlvbnMuYWxseVZvbHVtZUNvbnRyb2xUZXh0ID8gdC5vcHRpb25zLmFsbHlWb2x1bWVDb250cm9sVGV4dCA6IGkxOG4udCgnbWVqcy52b2x1bWUtaGVscC10ZXh0JyksXG5cdFx0XHRtdXRlID0gKG1vZGUgPT09ICdob3Jpem9udGFsJykgP1xuXG5cdFx0XHRcdC8vIGhvcml6b250YWwgdmVyc2lvblxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZVwiPmAgK1xuXHRcdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHttdXRlVGV4dH1cIiBhcmlhLWxhYmVsPVwiJHttdXRlVGV4dH1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLXNsaWRlclwiPmAgK1xuXHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlblwiPiR7dm9sdW1lQ29udHJvbFRleHR9PC9zcGFuPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtdG90YWxcIj5gICtcblx0XHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aG9yaXpvbnRhbC12b2x1bWUtY3VycmVudFwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1ob3Jpem9udGFsLXZvbHVtZS1oYW5kbGVcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2E+YClcblx0XHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKSA6XG5cblx0XHRcdFx0Ly8gdmVydGljYWwgdmVyc2lvblxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YnV0dG9uICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1idXR0b24gJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZVwiPmAgK1xuXHRcdFx0XHRcdGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWNvbnRyb2xzPVwiJHt0LmlkfVwiIHRpdGxlPVwiJHttdXRlVGV4dH1cIiBhcmlhLWxhYmVsPVwiJHttdXRlVGV4dH1cIj48L2J1dHRvbj5gICtcblx0XHRcdFx0XHRgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1zbGlkZXJcIj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlblwiPiR7dm9sdW1lQ29udHJvbFRleHR9PC9zcGFuPmAgK1xuXHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtdG90YWxcIj5gICtcblx0XHRcdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtY3VycmVudFwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1oYW5kbGVcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRcdGA8L2Rpdj5gICtcblx0XHRcdFx0XHRgPC9hPmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmFwcGVuZFRvKGNvbnRyb2xzKSxcblx0XHRcdHZvbHVtZVNsaWRlciA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyLCBcblx0XHRcdFx0LiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLXNsaWRlcmApLFxuXHRcdFx0dm9sdW1lVG90YWwgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dm9sdW1lLXRvdGFsLCBcblx0XHRcdFx0LiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLXRvdGFsYCksXG5cdFx0XHR2b2x1bWVDdXJyZW50ID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZvbHVtZS1jdXJyZW50LCBcblx0XHRcdFx0LiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLWN1cnJlbnRgKSxcblx0XHRcdHZvbHVtZUhhbmRsZSA9IHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH12b2x1bWUtaGFuZGxlLCBcblx0XHRcdFx0LiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWhvcml6b250YWwtdm9sdW1lLWhhbmRsZWApLFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKiBAcGFyYW0ge051bWJlcn0gdm9sdW1lXG5cdFx0XHQgKi9cblx0XHRcdHBvc2l0aW9uVm9sdW1lSGFuZGxlID0gKHZvbHVtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGNvcnJlY3QgdG8gMC0xXG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWF4KDAsIHZvbHVtZSk7XG5cdFx0XHRcdHZvbHVtZSA9IE1hdGgubWluKHZvbHVtZSwgMSk7XG5cblx0XHRcdFx0Ly8gYWRqdXN0IG11dGUgYnV0dG9uIHN0eWxlXG5cdFx0XHRcdGlmICh2b2x1bWUgPT09IDApIHtcblx0XHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApO1xuXHRcdFx0XHRcdG11dGUuY2hpbGRyZW4oJ2J1dHRvbicpLmF0dHIoe1xuXHRcdFx0XHRcdFx0dGl0bGU6IGkxOG4udCgnbWVqcy51bm11dGUnKSxcblx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogaTE4bi50KCdtZWpzLnVubXV0ZScpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCkuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKTtcblx0XHRcdFx0XHRtdXRlLmNoaWxkcmVuKCdidXR0b24nKS5hdHRyKHtcblx0XHRcdFx0XHRcdHRpdGxlOiBpMThuLnQoJ21lanMubXV0ZScpLFxuXHRcdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBpMThuLnQoJ21lanMubXV0ZScpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgdm9sdW1lUGVyY2VudGFnZSA9IGAkeyh2b2x1bWUgKiAxMDApfSVgO1xuXG5cdFx0XHRcdC8vIHBvc2l0aW9uIHNsaWRlclxuXHRcdFx0XHRpZiAobW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHRcdHZvbHVtZUN1cnJlbnQuY3NzKHtcblx0XHRcdFx0XHRcdGJvdHRvbTogJzAnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiB2b2x1bWVQZXJjZW50YWdlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dm9sdW1lSGFuZGxlLmNzcyh7XG5cdFx0XHRcdFx0XHRib3R0b206IHZvbHVtZVBlcmNlbnRhZ2UsXG5cdFx0XHRcdFx0XHRtYXJnaW5Cb3R0b206IGAkeygtdm9sdW1lSGFuZGxlLmhlaWdodCgpIC8gMil9cHhgXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dm9sdW1lQ3VycmVudC5jc3Moe1xuXHRcdFx0XHRcdFx0bGVmdDogJzAnLFxuXHRcdFx0XHRcdFx0d2lkdGg6IHZvbHVtZVBlcmNlbnRhZ2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2b2x1bWVIYW5kbGUuY3NzKHtcblx0XHRcdFx0XHRcdGxlZnQ6IHZvbHVtZVBlcmNlbnRhZ2UsXG5cdFx0XHRcdFx0XHRtYXJnaW5MZWZ0OiBgJHsoLXZvbHVtZUhhbmRsZS53aWR0aCgpIC8gMil9cHhgXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGhhbmRsZVZvbHVtZU1vdmUgPSAoZSkgPT4ge1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHZvbHVtZSA9IG51bGwsXG5cdFx0XHRcdFx0dG90YWxPZmZzZXQgPSB2b2x1bWVUb3RhbC5vZmZzZXQoKVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0Ly8gY2FsY3VsYXRlIHRoZSBuZXcgdm9sdW1lIGJhc2VkIG9uIHRoZSBtb3N0IHJlY2VudCBwb3NpdGlvblxuXHRcdFx0XHRpZiAobW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRyYWlsSGVpZ2h0ID0gdm9sdW1lVG90YWwuaGVpZ2h0KCksXG5cdFx0XHRcdFx0XHRuZXdZID0gZS5wYWdlWSAtIHRvdGFsT2Zmc2V0LnRvcFxuXHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdHZvbHVtZSA9IChyYWlsSGVpZ2h0IC0gbmV3WSkgLyByYWlsSGVpZ2h0O1xuXG5cdFx0XHRcdFx0Ly8gdGhlIGNvbnRyb2xzIGp1c3QgaGlkZSB0aGVtc2VsdmVzICh1c3VhbGx5IHdoZW4gbW91c2UgbW92ZXMgdG9vIGZhciB1cClcblx0XHRcdFx0XHRpZiAodG90YWxPZmZzZXQudG9wID09PSAwIHx8IHRvdGFsT2Zmc2V0LmxlZnQgPT09IDApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdHJhaWxXaWR0aCA9IHZvbHVtZVRvdGFsLndpZHRoKCksXG5cdFx0XHRcdFx0XHRuZXdYID0gZS5wYWdlWCAtIHRvdGFsT2Zmc2V0LmxlZnRcblx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHR2b2x1bWUgPSBuZXdYIC8gcmFpbFdpZHRoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZW5zdXJlIHRoZSB2b2x1bWUgaXNuJ3Qgb3V0c2lkZSAwLTFcblx0XHRcdFx0dm9sdW1lID0gTWF0aC5tYXgoMCwgdm9sdW1lKTtcblx0XHRcdFx0dm9sdW1lID0gTWF0aC5taW4odm9sdW1lLCAxKTtcblxuXHRcdFx0XHQvLyBwb3NpdGlvbiB0aGUgc2xpZGVyIGFuZCBoYW5kbGVcblx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUodm9sdW1lKTtcblxuXHRcdFx0XHQvLyBzZXQgdGhlIG1lZGlhIG9iamVjdCAodGhpcyB3aWxsIHRyaWdnZXIgdGhlIGB2b2x1bWVjaGFuZ2VkYCBldmVudClcblx0XHRcdFx0aWYgKHZvbHVtZSA9PT0gMCkge1xuXHRcdFx0XHRcdG1lZGlhLnNldE11dGVkKHRydWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lZGlhLnNldE11dGVkKGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtZWRpYS5zZXRWb2x1bWUodm9sdW1lKTtcblx0XHRcdH0sXG5cdFx0XHRtb3VzZUlzRG93biA9IGZhbHNlLFxuXHRcdFx0bW91c2VJc092ZXIgPSBmYWxzZTtcblxuXHRcdC8vIFNMSURFUlxuXHRcdG11dGVcblx0XHRcdC5vbignbW91c2VlbnRlciBmb2N1c2luJywgKCkgPT4ge1xuXHRcdFx0XHR2b2x1bWVTbGlkZXIuc2hvdygpO1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdtb3VzZWxlYXZlIGZvY3Vzb3V0JywgKCkgPT4ge1xuXHRcdFx0XHRtb3VzZUlzT3ZlciA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmICghbW91c2VJc0Rvd24gJiYgbW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHRcdHZvbHVtZVNsaWRlci5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRsZXQgdXBkYXRlVm9sdW1lU2xpZGVyID0gKCkgPT4ge1xuXG5cdFx0XHRsZXQgdm9sdW1lID0gTWF0aC5mbG9vcihtZWRpYS52b2x1bWUgKiAxMDApO1xuXG5cdFx0XHR2b2x1bWVTbGlkZXIuYXR0cih7XG5cdFx0XHRcdCdhcmlhLWxhYmVsJzogaTE4bi50KCdtZWpzLnZvbHVtZS1zbGlkZXInKSxcblx0XHRcdFx0J2FyaWEtdmFsdWVtaW4nOiAwLFxuXHRcdFx0XHQnYXJpYS12YWx1ZW1heCc6IDEwMCxcblx0XHRcdFx0J2FyaWEtdmFsdWVub3cnOiB2b2x1bWUsXG5cdFx0XHRcdCdhcmlhLXZhbHVldGV4dCc6IGAke3ZvbHVtZX0lYCxcblx0XHRcdFx0J3JvbGUnOiAnc2xpZGVyJyxcblx0XHRcdFx0J3RhYmluZGV4JzogLTFcblx0XHRcdH0pO1xuXG5cdFx0fTtcblxuXHRcdC8vIEV2ZW50c1xuXHRcdHZvbHVtZVNsaWRlclxuXHRcdFx0Lm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cdFx0XHRcdG1vdXNlSXNPdmVyID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ21vdXNlZG93bicsIChlKSA9PiB7XG5cdFx0XHRcdGhhbmRsZVZvbHVtZU1vdmUoZSk7XG5cdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2Vtb3ZlLnZvbCcsIChlKSA9PiB7XG5cdFx0XHRcdFx0aGFuZGxlVm9sdW1lTW92ZShlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHQuZ2xvYmFsQmluZCgnbW91c2V1cC52b2wnLCAoKSA9PiB7XG5cdFx0XHRcdFx0bW91c2VJc0Rvd24gPSBmYWxzZTtcblx0XHRcdFx0XHR0Lmdsb2JhbFVuYmluZCgnbW91c2Vtb3ZlLnZvbCBtb3VzZXVwLnZvbCcpO1xuXG5cdFx0XHRcdFx0aWYgKCFtb3VzZUlzT3ZlciAmJiBtb2RlID09PSAndmVydGljYWwnKSB7XG5cdFx0XHRcdFx0XHR2b2x1bWVTbGlkZXIuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdG1vdXNlSXNEb3duID0gdHJ1ZTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdrZXlkb3duJywgKGUpID0+IHtcblxuXHRcdFx0XHRpZiAodC5vcHRpb25zLmtleUFjdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRrZXlDb2RlID0gZS53aGljaCB8fCBlLmtleUNvZGUgfHwgMCxcblx0XHRcdFx0XHRcdHZvbHVtZSA9IG1lZGlhLnZvbHVtZVxuXHRcdFx0XHRcdDtcblx0XHRcdFx0XHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRcdFx0XHRcdGNhc2UgMzg6IC8vIFVwXG5cdFx0XHRcdFx0XHRcdHZvbHVtZSA9IE1hdGgubWluKHZvbHVtZSArIDAuMSwgMSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0MDogLy8gRG93blxuXHRcdFx0XHRcdFx0XHR2b2x1bWUgPSBNYXRoLm1heCgwLCB2b2x1bWUgLSAwLjEpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG1vdXNlSXNEb3duID0gZmFsc2U7XG5cdFx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUodm9sdW1lKTtcblx0XHRcdFx0XHRtZWRpYS5zZXRWb2x1bWUodm9sdW1lKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0Ly8gTVVURSBidXR0b25cblx0XHRtdXRlLmZpbmQoJ2J1dHRvbicpLmNsaWNrKCgpID0+IHtcblx0XHRcdG1lZGlhLnNldE11dGVkKCFtZWRpYS5tdXRlZCk7XG5cdFx0fSk7XG5cblx0XHQvL0tleWJvYXJkIGlucHV0XG5cdFx0bXV0ZS5maW5kKCdidXR0b24nKS5vbignZm9jdXMnLCAoKSA9PiB7XG5cdFx0XHRpZiAobW9kZSA9PT0gJ3ZlcnRpY2FsJykge1xuXHRcdFx0XHR2b2x1bWVTbGlkZXIuc2hvdygpO1xuXHRcdFx0fVxuXHRcdH0pLm9uKCdibHVyJywgKCkgPT4ge1xuXHRcdFx0aWYgKG1vZGUgPT09ICd2ZXJ0aWNhbCcpIHtcblx0XHRcdFx0dm9sdW1lU2xpZGVyLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIGxpc3RlbiBmb3Igdm9sdW1lIGNoYW5nZSBldmVudHMgZnJvbSBvdGhlciBzb3VyY2VzXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndm9sdW1lY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdGlmICghbW91c2VJc0Rvd24pIHtcblx0XHRcdFx0aWYgKG1lZGlhLm11dGVkKSB7XG5cdFx0XHRcdFx0cG9zaXRpb25Wb2x1bWVIYW5kbGUoMCk7XG5cdFx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZShtZWRpYS52b2x1bWUpO1xuXHRcdFx0XHRcdG11dGUucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXVubXV0ZWApLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1tdXRlYCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHVwZGF0ZVZvbHVtZVNsaWRlcihlKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHQvLyBtdXRlcyB0aGUgbWVkaWEgYW5kIHNldHMgdGhlIHZvbHVtZSBpY29uIG11dGVkIGlmIHRoZSBpbml0aWFsIHZvbHVtZSBpcyBzZXQgdG8gMFxuXHRcdGlmIChwbGF5ZXIub3B0aW9ucy5zdGFydFZvbHVtZSA9PT0gMCkge1xuXHRcdFx0bWVkaWEuc2V0TXV0ZWQodHJ1ZSk7XG5cdFx0fVxuXG5cdFx0Ly8gc2hpbSBnZXRzIHRoZSBzdGFydHZvbHVtZSBhcyBhIHBhcmFtZXRlciwgYnV0IHdlIGhhdmUgdG8gc2V0IGl0IG9uIHRoZSBuYXRpdmUgPHZpZGVvPiBhbmQgPGF1ZGlvPiBlbGVtZW50c1xuXHRcdGxldCBpc05hdGl2ZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8obmF0aXZlfGh0bWw1KS8pICE9PSBudWxsO1xuXG5cdFx0aWYgKGlzTmF0aXZlKSB7XG5cdFx0XHRtZWRpYS5zZXRWb2x1bWUocGxheWVyLm9wdGlvbnMuc3RhcnRWb2x1bWUpO1xuXHRcdH1cblxuXHRcdHQuY29udGFpbmVyLm9uKCdjb250cm9sc3Jlc2l6ZScsICgpID0+IHtcblx0XHRcdGlmIChtZWRpYS5tdXRlZCkge1xuXHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZSgwKTtcblx0XHRcdFx0bXV0ZS5yZW1vdmVDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bXV0ZWApXG5cdFx0XHRcdC5hZGRDbGFzcyhgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9dW5tdXRlYCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwb3NpdGlvblZvbHVtZUhhbmRsZShtZWRpYS52b2x1bWUpO1xuXHRcdFx0XHRtdXRlLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH11bm11dGVgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW11dGVgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiFcbiAqIFRoaXMgaXMgYSBgaTE4bmAgbGFuZ3VhZ2Ugb2JqZWN0LlxuICpcbiAqIEVuZ2xpc2g7IFRoaXMgY2FuIHNlcnZlIGFzIGEgdGVtcGxhdGUgZm9yIG90aGVyIGxhbmd1YWdlcyB0byB0cmFuc2xhdGVcbiAqXG4gKiBAYXV0aG9yXG4gKiAgIFRCRFxuICogICBTYXNjaGEgR3JldWVsIChUd2l0dGVyOiBAU29mdENyZWF0UilcbiAqXG4gKiBAc2VlIGNvcmUvaTE4bi5qc1xuICovXG5leHBvcnQgY29uc3QgRU4gPSB7XG5cdFwibWVqcy5wbHVyYWwtZm9ybVwiOiAxLFxuXG5cdC8vIHJlbmRlcmVycy9mbGFzaC5qc1xuXHRcIm1lanMuaW5zdGFsbC1mbGFzaFwiOiBcIllvdSBhcmUgdXNpbmcgYSBicm93c2VyIHRoYXQgZG9lcyBub3QgaGF2ZSBGbGFzaCBwbGF5ZXIgZW5hYmxlZCBvciBpbnN0YWxsZWQuIFBsZWFzZSB0dXJuIG9uIHlvdXIgRmxhc2ggcGxheWVyIHBsdWdpbiBvciBkb3dubG9hZCB0aGUgbGF0ZXN0IHZlcnNpb24gZnJvbSBodHRwczovL2dldC5hZG9iZS5jb20vZmxhc2hwbGF5ZXIvXCIsXG5cblx0Ly8gZmVhdHVyZXMvY29udGV4dG1lbnUuanNcblx0XCJtZWpzLmZ1bGxzY3JlZW4tb2ZmXCI6IFwiVHVybiBvZmYgRnVsbHNjcmVlblwiLFxuXHRcIm1lanMuZnVsbHNjcmVlbi1vblwiOiBcIkdvIEZ1bGxzY3JlZW5cIixcblx0XCJtZWpzLmRvd25sb2FkLXZpZGVvXCI6IFwiRG93bmxvYWQgVmlkZW9cIixcblxuXHQvLyBmZWF0dXJlcy9mdWxsc2NyZWVuLmpzXG5cdFwibWVqcy5mdWxsc2NyZWVuXCI6IFwiRnVsbHNjcmVlblwiLFxuXG5cdC8vIGZlYXR1cmVzL2p1bXBmb3J3YXJkLmpzXG5cdFwibWVqcy50aW1lLWp1bXAtZm9yd2FyZFwiOiBbXCJKdW1wIGZvcndhcmQgMSBzZWNvbmRcIiwgXCJKdW1wIGZvcndhcmQgJTEgc2Vjb25kc1wiXSxcblxuXHQvLyBmZWF0dXJlcy9sb29wLmpzXG5cdFwibWVqcy5sb29wXCI6IFwiVG9nZ2xlIExvb3BcIixcblxuXHQvLyBmZWF0dXJlcy9wbGF5cGF1c2UuanNcblx0XCJtZWpzLnBsYXlcIjogXCJQbGF5XCIsXG5cdFwibWVqcy5wYXVzZVwiOiBcIlBhdXNlXCIsXG5cblx0Ly8gZmVhdHVyZXMvcG9zdHJvbGwuanNcblx0XCJtZWpzLmNsb3NlXCI6IFwiQ2xvc2VcIixcblxuXHQvLyBmZWF0dXJlcy9wcm9ncmVzcy5qc1xuXHRcIm1lanMudGltZS1zbGlkZXJcIjogXCJUaW1lIFNsaWRlclwiLFxuXHRcIm1lanMudGltZS1oZWxwLXRleHRcIjogXCJVc2UgTGVmdC9SaWdodCBBcnJvdyBrZXlzIHRvIGFkdmFuY2Ugb25lIHNlY29uZCwgVXAvRG93biBhcnJvd3MgdG8gYWR2YW5jZSB0ZW4gc2Vjb25kcy5cIixcblxuXHQvLyBmZWF0dXJlcy9za2lwYmFjay5qc1xuXHRcIm1lanMudGltZS1za2lwLWJhY2tcIjogW1wiU2tpcCBiYWNrIDEgc2Vjb25kXCIsIFwiU2tpcCBiYWNrICUxIHNlY29uZHNcIl0sXG5cblx0Ly8gZmVhdHVyZXMvdHJhY2tzLmpzXG5cdFwibWVqcy5jYXB0aW9ucy1zdWJ0aXRsZXNcIjogXCJDYXB0aW9ucy9TdWJ0aXRsZXNcIixcblx0XCJtZWpzLm5vbmVcIjogXCJOb25lXCIsXG5cblx0Ly8gZmVhdHVyZXMvdm9sdW1lLmpzXG5cdFwibWVqcy5tdXRlLXRvZ2dsZVwiOiBcIk11dGUgVG9nZ2xlXCIsXG5cdFwibWVqcy52b2x1bWUtaGVscC10ZXh0XCI6IFwiVXNlIFVwL0Rvd24gQXJyb3cga2V5cyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB2b2x1bWUuXCIsXG5cdFwibWVqcy51bm11dGVcIjogXCJVbm11dGVcIixcblx0XCJtZWpzLm11dGVcIjogXCJNdXRlXCIsXG5cdFwibWVqcy52b2x1bWUtc2xpZGVyXCI6IFwiVm9sdW1lIFNsaWRlclwiLFxuXG5cdC8vIGNvcmUvcGxheWVyLmpzXG5cdFwibWVqcy52aWRlby1wbGF5ZXJcIjogXCJWaWRlbyBQbGF5ZXJcIixcblx0XCJtZWpzLmF1ZGlvLXBsYXllclwiOiBcIkF1ZGlvIFBsYXllclwiLFxuXG5cdC8vIGZlYXR1cmVzL2Fkcy5qc1xuXHRcIm1lanMuYWQtc2tpcFwiOiBcIlNraXAgYWRcIixcblx0XCJtZWpzLmFkLXNraXAtaW5mb1wiOiBbXCJTa2lwIGluIDEgc2Vjb25kXCIsIFwiU2tpcCBpbiAlMSBzZWNvbmRzXCJdLFxuXG5cdC8vIGZlYXR1cmVzL3NvdXJjZWNob29zZXIuanNcblx0XCJtZWpzLnNvdXJjZS1jaG9vc2VyXCI6IFwiU291cmNlIENob29zZXJcIixcblxuXHQvLyBmZWF0dXJlcy9zdG9wLmpzXG5cdFwibWVqcy5zdG9wXCI6IFwiU3RvcFwiLFxuXG5cdC8vZmVhdHVyZXMvc3BlZWQuanNcblx0XCJtZWpzLnNwZWVkLXJhdGVcIiA6IFwiU3BlZWQgUmF0ZVwiLFxuXG5cdC8vZmVhdHVyZXMvcHJvZ3Jlc3MuanNcblx0XCJtZWpzLmxpdmUtYnJvYWRjYXN0XCIgOiBcIkxpdmUgQnJvYWRjYXN0XCIsXG5cblx0Ly8gZmVhdHVyZXMvdHJhY2tzLmpzXG5cdFwibWVqcy5hZnJpa2FhbnNcIjogXCJBZnJpa2FhbnNcIixcblx0XCJtZWpzLmFsYmFuaWFuXCI6IFwiQWxiYW5pYW5cIixcblx0XCJtZWpzLmFyYWJpY1wiOiBcIkFyYWJpY1wiLFxuXHRcIm1lanMuYmVsYXJ1c2lhblwiOiBcIkJlbGFydXNpYW5cIixcblx0XCJtZWpzLmJ1bGdhcmlhblwiOiBcIkJ1bGdhcmlhblwiLFxuXHRcIm1lanMuY2F0YWxhblwiOiBcIkNhdGFsYW5cIixcblx0XCJtZWpzLmNoaW5lc2VcIjogXCJDaGluZXNlXCIsXG5cdFwibWVqcy5jaGluZXNlLXNpbXBsaWZpZWRcIjogXCJDaGluZXNlIChTaW1wbGlmaWVkKVwiLFxuXHRcIm1lanMuY2hpbmVzZS10cmFkaXRpb25hbFwiOiBcIkNoaW5lc2UgKFRyYWRpdGlvbmFsKVwiLFxuXHRcIm1lanMuY3JvYXRpYW5cIjogXCJDcm9hdGlhblwiLFxuXHRcIm1lanMuY3plY2hcIjogXCJDemVjaFwiLFxuXHRcIm1lanMuZGFuaXNoXCI6IFwiRGFuaXNoXCIsXG5cdFwibWVqcy5kdXRjaFwiOiBcIkR1dGNoXCIsXG5cdFwibWVqcy5lbmdsaXNoXCI6IFwiRW5nbGlzaFwiLFxuXHRcIm1lanMuZXN0b25pYW5cIjogXCJFc3RvbmlhblwiLFxuXHRcIm1lanMuZmlsaXBpbm9cIjogXCJGaWxpcGlub1wiLFxuXHRcIm1lanMuZmlubmlzaFwiOiBcIkZpbm5pc2hcIixcblx0XCJtZWpzLmZyZW5jaFwiOiBcIkZyZW5jaFwiLFxuXHRcIm1lanMuZ2FsaWNpYW5cIjogXCJHYWxpY2lhblwiLFxuXHRcIm1lanMuZ2VybWFuXCI6IFwiR2VybWFuXCIsXG5cdFwibWVqcy5ncmVla1wiOiBcIkdyZWVrXCIsXG5cdFwibWVqcy5oYWl0aWFuLWNyZW9sZVwiOiBcIkhhaXRpYW4gQ3Jlb2xlXCIsXG5cdFwibWVqcy5oZWJyZXdcIjogXCJIZWJyZXdcIixcblx0XCJtZWpzLmhpbmRpXCI6IFwiSGluZGlcIixcblx0XCJtZWpzLmh1bmdhcmlhblwiOiBcIkh1bmdhcmlhblwiLFxuXHRcIm1lanMuaWNlbGFuZGljXCI6IFwiSWNlbGFuZGljXCIsXG5cdFwibWVqcy5pbmRvbmVzaWFuXCI6IFwiSW5kb25lc2lhblwiLFxuXHRcIm1lanMuaXJpc2hcIjogXCJJcmlzaFwiLFxuXHRcIm1lanMuaXRhbGlhblwiOiBcIkl0YWxpYW5cIixcblx0XCJtZWpzLmphcGFuZXNlXCI6IFwiSmFwYW5lc2VcIixcblx0XCJtZWpzLmtvcmVhblwiOiBcIktvcmVhblwiLFxuXHRcIm1lanMubGF0dmlhblwiOiBcIkxhdHZpYW5cIixcblx0XCJtZWpzLmxpdGh1YW5pYW5cIjogXCJMaXRodWFuaWFuXCIsXG5cdFwibWVqcy5tYWNlZG9uaWFuXCI6IFwiTWFjZWRvbmlhblwiLFxuXHRcIm1lanMubWFsYXlcIjogXCJNYWxheVwiLFxuXHRcIm1lanMubWFsdGVzZVwiOiBcIk1hbHRlc2VcIixcblx0XCJtZWpzLm5vcndlZ2lhblwiOiBcIk5vcndlZ2lhblwiLFxuXHRcIm1lanMucGVyc2lhblwiOiBcIlBlcnNpYW5cIixcblx0XCJtZWpzLnBvbGlzaFwiOiBcIlBvbGlzaFwiLFxuXHRcIm1lanMucG9ydHVndWVzZVwiOiBcIlBvcnR1Z3Vlc2VcIixcblx0XCJtZWpzLnJvbWFuaWFuXCI6IFwiUm9tYW5pYW5cIixcblx0XCJtZWpzLnJ1c3NpYW5cIjogXCJSdXNzaWFuXCIsXG5cdFwibWVqcy5zZXJiaWFuXCI6IFwiU2VyYmlhblwiLFxuXHRcIm1lanMuc2xvdmFrXCI6IFwiU2xvdmFrXCIsXG5cdFwibWVqcy5zbG92ZW5pYW5cIjogXCJTbG92ZW5pYW5cIixcblx0XCJtZWpzLnNwYW5pc2hcIjogXCJTcGFuaXNoXCIsXG5cdFwibWVqcy5zd2FoaWxpXCI6IFwiU3dhaGlsaVwiLFxuXHRcIm1lanMuc3dlZGlzaFwiOiBcIlN3ZWRpc2hcIixcblx0XCJtZWpzLnRhZ2Fsb2dcIjogXCJUYWdhbG9nXCIsXG5cdFwibWVqcy50aGFpXCI6IFwiVGhhaVwiLFxuXHRcIm1lanMudHVya2lzaFwiOiBcIlR1cmtpc2hcIixcblx0XCJtZWpzLnVrcmFpbmlhblwiOiBcIlVrcmFpbmlhblwiLFxuXHRcIm1lanMudmlldG5hbWVzZVwiOiBcIlZpZXRuYW1lc2VcIixcblx0XCJtZWpzLndlbHNoXCI6IFwiV2Vsc2hcIixcblx0XCJtZWpzLnlpZGRpc2hcIjogXCJZaWRkaXNoXCJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWVqcyBmcm9tICcuL2NvcmUvbWVqcyc7XG5cbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJykge1xuXHRtZWpzLiQgPSBqUXVlcnk7XG59IGVsc2UgaWYgKHR5cGVvZiBaZXB0byAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bWVqcy4kID0gWmVwdG87XG5cblx0Ly8gZGVmaW5lIGBvdXRlcldpZHRoYCBtZXRob2Qgd2hpY2ggaGFzIG5vdCBiZWVuIHJlYWxpemVkIGluIFplcHRvXG5cdFplcHRvLmZuLm91dGVyV2lkdGggPSBmdW5jdGlvbiAoaW5jbHVkZU1hcmdpbikge1xuXHRcdGxldCB3aWR0aCA9ICQodGhpcykud2lkdGgoKTtcblx0XHRpZiAoaW5jbHVkZU1hcmdpbikge1xuXHRcdFx0d2lkdGggKz0gcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ21hcmdpbi1yaWdodCcpLCAxMCk7XG5cdFx0XHR3aWR0aCArPSBwYXJzZUludCgkKHRoaXMpLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApO1xuXHRcdH1cblx0XHRyZXR1cm4gd2lkdGg7XG5cdH07XG5cbn0gZWxzZSBpZiAodHlwZW9mIGVuZGVyICE9PSAndW5kZWZpbmVkJykge1xuXHRtZWpzLiQgPSBlbmRlcjtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4vY29yZS9tZWpzJztcbmltcG9ydCBNZWRpYUVsZW1lbnQgZnJvbSAnLi9jb3JlL21lZGlhZWxlbWVudCc7XG5pbXBvcnQgaTE4biBmcm9tICcuL2NvcmUvaTE4bic7XG5pbXBvcnQge1xuXHRJU19GSVJFRk9YLFxuXHRJU19JUEFELFxuXHRJU19JUEhPTkUsXG5cdElTX0FORFJPSUQsXG5cdElTX0lPUyxcblx0SEFTX1RPVUNILFxuXHRIQVNfTVNfTkFUSVZFX0ZVTExTQ1JFRU4sXG5cdEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOXG59IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7c3BsaXRFdmVudHN9IGZyb20gJy4vdXRpbHMvZ2VuZXJhbCc7XG5pbXBvcnQge2NhbGN1bGF0ZVRpbWVGb3JtYXR9IGZyb20gJy4vdXRpbHMvdGltZSc7XG5pbXBvcnQge2lzTm9kZUFmdGVyfSBmcm9tICcuL3V0aWxzL2RvbSc7XG5cbm1lanMubWVwSW5kZXggPSAwO1xuXG5tZWpzLnBsYXllcnMgPSB7fTtcblxuLy8gZGVmYXVsdCBwbGF5ZXIgdmFsdWVzXG5leHBvcnQgbGV0IGNvbmZpZyA9IHtcblx0Ly8gdXJsIHRvIHBvc3RlciAodG8gZml4IGlPUyAzLngpXG5cdHBvc3RlcjogJycsXG5cdC8vIFdoZW4gdGhlIHZpZGVvIGlzIGVuZGVkLCB3ZSBjYW4gc2hvdyB0aGUgcG9zdGVyLlxuXHRzaG93UG9zdGVyV2hlbkVuZGVkOiBmYWxzZSxcblx0Ly8gZGVmYXVsdCBpZiB0aGUgPHZpZGVvIHdpZHRoPiBpcyBub3Qgc3BlY2lmaWVkXG5cdGRlZmF1bHRWaWRlb1dpZHRoOiA0ODAsXG5cdC8vIGRlZmF1bHQgaWYgdGhlIDx2aWRlbyBoZWlnaHQ+IGlzIG5vdCBzcGVjaWZpZWRcblx0ZGVmYXVsdFZpZGVvSGVpZ2h0OiAyNzAsXG5cdC8vIGlmIHNldCwgb3ZlcnJpZGVzIDx2aWRlbyB3aWR0aD5cblx0dmlkZW9XaWR0aDogLTEsXG5cdC8vIGlmIHNldCwgb3ZlcnJpZGVzIDx2aWRlbyBoZWlnaHQ+XG5cdHZpZGVvSGVpZ2h0OiAtMSxcblx0Ly8gZGVmYXVsdCBpZiB0aGUgdXNlciBkb2Vzbid0IHNwZWNpZnlcblx0ZGVmYXVsdEF1ZGlvV2lkdGg6IDQwMCxcblx0Ly8gZGVmYXVsdCBpZiB0aGUgdXNlciBkb2Vzbid0IHNwZWNpZnlcblx0ZGVmYXVsdEF1ZGlvSGVpZ2h0OiA0MCxcblx0Ly8gZGVmYXVsdCBhbW91bnQgdG8gbW92ZSBiYWNrIHdoZW4gYmFjayBrZXkgaXMgcHJlc3NlZFxuXHRkZWZhdWx0U2Vla0JhY2t3YXJkSW50ZXJ2YWw6IChtZWRpYSkgPT4gbWVkaWEuZHVyYXRpb24gKiAwLjA1LFxuXHQvLyBkZWZhdWx0IGFtb3VudCB0byBtb3ZlIGZvcndhcmQgd2hlbiBmb3J3YXJkIGtleSBpcyBwcmVzc2VkXG5cdGRlZmF1bHRTZWVrRm9yd2FyZEludGVydmFsOiAobWVkaWEpID0+IG1lZGlhLmR1cmF0aW9uICogMC4wNSxcblx0Ly8gc2V0IGRpbWVuc2lvbnMgdmlhIEpTIGluc3RlYWQgb2YgQ1NTXG5cdHNldERpbWVuc2lvbnM6IHRydWUsXG5cdC8vIHdpZHRoIG9mIGF1ZGlvIHBsYXllclxuXHRhdWRpb1dpZHRoOiAtMSxcblx0Ly8gaGVpZ2h0IG9mIGF1ZGlvIHBsYXllclxuXHRhdWRpb0hlaWdodDogLTEsXG5cdC8vIGluaXRpYWwgdm9sdW1lIHdoZW4gdGhlIHBsYXllciBzdGFydHMgKG92ZXJyaWRkZW4gYnkgdXNlciBjb29raWUpXG5cdHN0YXJ0Vm9sdW1lOiAwLjgsXG5cdC8vIHVzZWZ1bCBmb3IgPGF1ZGlvPiBwbGF5ZXIgbG9vcHNcblx0bG9vcDogZmFsc2UsXG5cdC8vIHJld2luZCB0byBiZWdpbm5pbmcgd2hlbiBtZWRpYSBlbmRzXG5cdGF1dG9SZXdpbmQ6IHRydWUsXG5cdC8vIHJlc2l6ZSB0byBtZWRpYSBkaW1lbnNpb25zXG5cdGVuYWJsZUF1dG9zaXplOiB0cnVlLFxuXHQvKlxuXHQgKiBUaW1lIGZvcm1hdCB0byB1c2UuIERlZmF1bHQ6ICdtbTpzcydcblx0ICogU3VwcG9ydGVkIHVuaXRzOlxuXHQgKiAgIGg6IGhvdXJcblx0ICogICBtOiBtaW51dGVcblx0ICogICBzOiBzZWNvbmRcblx0ICogICBmOiBmcmFtZSBjb3VudFxuXHQgKiBXaGVuIHVzaW5nICdoaCcsICdtbScsICdzcycgb3IgJ2ZmJyB3ZSBhbHdheXMgZGlzcGxheSAyIGRpZ2l0cy5cblx0ICogSWYgeW91IHVzZSAnaCcsICdtJywgJ3MnIG9yICdmJyB3ZSBkaXNwbGF5IDEgZGlnaXQgaWYgcG9zc2libGUuXG5cdCAqXG5cdCAqIEV4YW1wbGUgdG8gZGlzcGxheSA3NSBzZWNvbmRzOlxuXHQgKiBGb3JtYXQgJ21tOnNzJzogMDE6MTVcblx0ICogRm9ybWF0ICdtOnNzJzogMToxNVxuXHQgKiBGb3JtYXQgJ206cyc6IDE6MTVcblx0ICovXG5cdHRpbWVGb3JtYXQ6ICcnLFxuXHQvLyBmb3JjZXMgdGhlIGhvdXIgbWFya2VyICgjIzowMDowMClcblx0YWx3YXlzU2hvd0hvdXJzOiBmYWxzZSxcblx0Ly8gc2hvdyBmcmFtZWNvdW50IGluIHRpbWVjb2RlICgjIzowMDowMDowMClcblx0c2hvd1RpbWVjb2RlRnJhbWVDb3VudDogZmFsc2UsXG5cdC8vIHVzZWQgd2hlbiBzaG93VGltZWNvZGVGcmFtZUNvdW50IGlzIHNldCB0byB0cnVlXG5cdGZyYW1lc1BlclNlY29uZDogMjUsXG5cdC8vIEhpZGUgY29udHJvbHMgd2hlbiBwbGF5aW5nIGFuZCBtb3VzZSBpcyBub3Qgb3ZlciB0aGUgdmlkZW9cblx0YWx3YXlzU2hvd0NvbnRyb2xzOiBmYWxzZSxcblx0Ly8gRGlzcGxheSB0aGUgdmlkZW8gY29udHJvbFxuXHRoaWRlVmlkZW9Db250cm9sc09uTG9hZDogZmFsc2UsXG5cdC8vIEVuYWJsZSBjbGljayB2aWRlbyBlbGVtZW50IHRvIHRvZ2dsZSBwbGF5L3BhdXNlXG5cdGNsaWNrVG9QbGF5UGF1c2U6IHRydWUsXG5cdC8vIFRpbWUgaW4gbXMgdG8gaGlkZSBjb250cm9sc1xuXHRjb250cm9sc1RpbWVvdXREZWZhdWx0OiAxNTAwLFxuXHQvLyBUaW1lIGluIG1zIHRvIHRyaWdnZXIgdGhlIHRpbWVyIHdoZW4gbW91c2UgbW92ZXNcblx0Y29udHJvbHNUaW1lb3V0TW91c2VFbnRlcjogMjUwMCxcblx0Ly8gVGltZSBpbiBtcyB0byB0cmlnZ2VyIHRoZSB0aW1lciB3aGVuIG1vdXNlIGxlYXZlc1xuXHRjb250cm9sc1RpbWVvdXRNb3VzZUxlYXZlOiAxMDAwLFxuXHQvLyBmb3JjZSBpUGFkJ3MgbmF0aXZlIGNvbnRyb2xzXG5cdGlQYWRVc2VOYXRpdmVDb250cm9sczogZmFsc2UsXG5cdC8vIGZvcmNlIGlQaG9uZSdzIG5hdGl2ZSBjb250cm9sc1xuXHRpUGhvbmVVc2VOYXRpdmVDb250cm9sczogZmFsc2UsXG5cdC8vIGZvcmNlIEFuZHJvaWQncyBuYXRpdmUgY29udHJvbHNcblx0QW5kcm9pZFVzZU5hdGl2ZUNvbnRyb2xzOiBmYWxzZSxcblx0Ly8gZmVhdHVyZXMgdG8gc2hvd1xuXHRmZWF0dXJlczogWydwbGF5cGF1c2UnLCAnY3VycmVudCcsICdwcm9ncmVzcycsICdkdXJhdGlvbicsICd0cmFja3MnLCAndm9sdW1lJywgJ2Z1bGxzY3JlZW4nXSxcblx0Ly8gb25seSBmb3IgZHluYW1pY1xuXHRpc1ZpZGVvOiB0cnVlLFxuXHQvLyBzdHJldGNoaW5nIG1vZGVzIChhdXRvLCBmaWxsLCByZXNwb25zaXZlLCBub25lKVxuXHRzdHJldGNoaW5nOiAnYXV0bycsXG5cdC8vIHByZWZpeCBjbGFzcyBuYW1lcyBvbiBlbGVtZW50c1xuXHRjbGFzc1ByZWZpeDogJ21lanNfXycsXG5cdC8vIHR1cm5zIGtleWJvYXJkIHN1cHBvcnQgb24gYW5kIG9mZiBmb3IgdGhpcyBpbnN0YW5jZVxuXHRlbmFibGVLZXlib2FyZDogdHJ1ZSxcblx0Ly8gd2hlbiB0aGlzIHBsYXllciBzdGFydHMsIGl0IHdpbGwgcGF1c2Ugb3RoZXIgcGxheWVyc1xuXHRwYXVzZU90aGVyUGxheWVyczogdHJ1ZSxcblx0Ly8gYXJyYXkgb2Yga2V5Ym9hcmQgYWN0aW9ucyBzdWNoIGFzIHBsYXkvcGF1c2Vcblx0a2V5QWN0aW9uczogW1xuXHRcdHtcblx0XHRcdGtleXM6IFtcblx0XHRcdFx0MzIsIC8vIFNQQUNFXG5cdFx0XHRcdDE3OSAvLyBHT09HTEUgcGxheS9wYXVzZSBidXR0b25cblx0XHRcdF0sXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKCFJU19GSVJFRk9YKSB7XG5cdFx0XHRcdFx0aWYgKG1lZGlhLnBhdXNlZCB8fCBtZWRpYS5lbmRlZCkge1xuXHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZWRpYS5wYXVzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0a2V5czogWzM4XSwgLy8gVVBcblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEpID0+IHtcblxuXHRcdFx0XHRpZiAocGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLWJ1dHRvbj5idXR0b25gKS5pcygnOmZvY3VzJykgfHxcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyYCkuaXMoJzpmb2N1cycpKSB7XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgbmV3Vm9sdW1lID0gTWF0aC5taW4obWVkaWEudm9sdW1lICsgMC4xLCAxKTtcblx0XHRcdFx0bWVkaWEuc2V0Vm9sdW1lKG5ld1ZvbHVtZSk7XG5cdFx0XHRcdGlmIChuZXdWb2x1bWUgPiAwKSB7XG5cdFx0XHRcdFx0bWVkaWEuc2V0TXV0ZWQoZmFsc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFs0MF0sIC8vIERPV05cblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEpID0+IHtcblxuXHRcdFx0XHRpZiAocGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLWJ1dHRvbj5idXR0b25gKS5pcygnOmZvY3VzJykgfHxcblx0XHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyYCkuaXMoJzpmb2N1cycpKSB7XG5cdFx0XHRcdFx0cGxheWVyLmNvbnRhaW5lci5maW5kKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9dm9sdW1lLXNsaWRlcmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdHBsYXllci5zdGFydENvbnRyb2xzVGltZXIoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBuZXdWb2x1bWUgPSBNYXRoLm1heChtZWRpYS52b2x1bWUgLSAwLjEsIDApO1xuXHRcdFx0XHRtZWRpYS5zZXRWb2x1bWUobmV3Vm9sdW1lKTtcblxuXHRcdFx0XHRpZiAobmV3Vm9sdW1lIDw9IDAuMSkge1xuXHRcdFx0XHRcdG1lZGlhLnNldE11dGVkKHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFtcblx0XHRcdFx0MzcsIC8vIExFRlRcblx0XHRcdFx0MjI3IC8vIEdvb2dsZSBUViByZXdpbmRcblx0XHRcdF0sXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cdFx0XHRcdGlmICghaXNOYU4obWVkaWEuZHVyYXRpb24pICYmIG1lZGlhLmR1cmF0aW9uID4gMCkge1xuXHRcdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdFx0cGxheWVyLnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0cGxheWVyLnN0YXJ0Q29udHJvbHNUaW1lcigpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIDUlXG5cdFx0XHRcdFx0bGV0IG5ld1RpbWUgPSBNYXRoLm1heChtZWRpYS5jdXJyZW50VGltZSAtIHBsYXllci5vcHRpb25zLmRlZmF1bHRTZWVrQmFja3dhcmRJbnRlcnZhbChtZWRpYSksIDApO1xuXHRcdFx0XHRcdG1lZGlhLnNldEN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbXG5cdFx0XHRcdDM5LCAvLyBSSUdIVFxuXHRcdFx0XHQyMjggLy8gR29vZ2xlIFRWIGZvcndhcmRcblx0XHRcdF0sXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIsIG1lZGlhKSA9PiB7XG5cblx0XHRcdFx0aWYgKCFpc05hTihtZWRpYS5kdXJhdGlvbikgJiYgbWVkaWEuZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0aWYgKHBsYXllci5pc1ZpZGVvKSB7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gNSVcblx0XHRcdFx0XHRsZXQgbmV3VGltZSA9IE1hdGgubWluKG1lZGlhLmN1cnJlbnRUaW1lICsgcGxheWVyLm9wdGlvbnMuZGVmYXVsdFNlZWtGb3J3YXJkSW50ZXJ2YWwobWVkaWEpLCBtZWRpYS5kdXJhdGlvbik7XG5cdFx0XHRcdFx0bWVkaWEuc2V0Q3VycmVudFRpbWUobmV3VGltZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdGtleXM6IFs3MF0sIC8vIEZcblx0XHRcdGFjdGlvbjogKHBsYXllciwgbWVkaWEsIGtleSwgZXZlbnQpID0+IHtcblx0XHRcdFx0aWYgKCFldmVudC5jdHJsS2V5KSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBwbGF5ZXIuZW50ZXJGdWxsU2NyZWVuICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0aWYgKHBsYXllci5pc0Z1bGxTY3JlZW4pIHtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmV4aXRGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwbGF5ZXIuZW50ZXJGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRrZXlzOiBbNzddLCAvLyBNXG5cdFx0XHRhY3Rpb246IChwbGF5ZXIpID0+IHtcblxuXHRcdFx0XHRwbGF5ZXIuY29udGFpbmVyLmZpbmQoYC4ke2NvbmZpZy5jbGFzc1ByZWZpeH12b2x1bWUtc2xpZGVyYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHRcdGlmIChwbGF5ZXIuaXNWaWRlbykge1xuXHRcdFx0XHRcdHBsYXllci5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRwbGF5ZXIuc3RhcnRDb250cm9sc1RpbWVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsYXllci5tZWRpYS5tdXRlZCkge1xuXHRcdFx0XHRcdHBsYXllci5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGxheWVyLnNldE11dGVkKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRdXG59O1xuXG5tZWpzLk1lcERlZmF1bHRzID0gY29uZmlnO1xuXG4vKipcbiAqIFdyYXAgYSBNZWRpYUVsZW1lbnQgb2JqZWN0IGluIHBsYXllciBjb250cm9sc1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9cbiAqIEByZXR1cm4gez9NZWRpYUVsZW1lbnRQbGF5ZXJ9XG4gKi9cbmNsYXNzIE1lZGlhRWxlbWVudFBsYXllciB7XG5cblx0Y29uc3RydWN0b3IgKG5vZGUsIG8pIHtcblxuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuaGFzRm9jdXMgPSBmYWxzZTtcblxuXHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gdHJ1ZTtcblxuXHRcdHQuY29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblxuXHRcdHQuY29udHJvbHNUaW1lciA9IG51bGw7XG5cblx0XHQvLyBlbmZvcmNlIG9iamVjdCwgZXZlbiB3aXRob3V0IFwibmV3XCIgKHZpYSBKb2huIFJlc2lnKVxuXHRcdGlmICghKHQgaW5zdGFuY2VvZiBNZWRpYUVsZW1lbnRQbGF5ZXIpKSB7XG5cdFx0XHRyZXR1cm4gbmV3IE1lZGlhRWxlbWVudFBsYXllcihub2RlLCBvKTtcblx0XHR9XG5cblx0XHQvLyB0aGVzZSB3aWxsIGJlIHJlc2V0IGFmdGVyIHRoZSBNZWRpYUVsZW1lbnQuc3VjY2VzcyBmaXJlc1xuXHRcdHQuJG1lZGlhID0gdC4kbm9kZSA9ICQobm9kZSk7XG5cdFx0dC5ub2RlID0gdC5tZWRpYSA9IHQuJG1lZGlhWzBdO1xuXG5cdFx0aWYgKCF0Lm5vZGUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBjaGVjayBmb3IgZXhpc3RpbmcgcGxheWVyXG5cdFx0aWYgKHQubm9kZS5wbGF5ZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHQubm9kZS5wbGF5ZXI7XG5cdFx0fVxuXG5cblx0XHQvLyB0cnkgdG8gZ2V0IG9wdGlvbnMgZnJvbSBkYXRhLW1lanNvcHRpb25zXG5cdFx0aWYgKG8gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0byA9IHQuJG5vZGUuZGF0YSgnbWVqc29wdGlvbnMnKTtcblx0XHR9XG5cblx0XHQvLyBleHRlbmQgZGVmYXVsdCBvcHRpb25zXG5cdFx0dC5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnLCBvKTtcblxuXHRcdGlmICghdC5vcHRpb25zLnRpbWVGb3JtYXQpIHtcblx0XHRcdC8vIEdlbmVyYXRlIHRoZSB0aW1lIGZvcm1hdCBhY2NvcmRpbmcgdG8gb3B0aW9uc1xuXHRcdFx0dC5vcHRpb25zLnRpbWVGb3JtYXQgPSAnbW06c3MnO1xuXHRcdFx0aWYgKHQub3B0aW9ucy5hbHdheXNTaG93SG91cnMpIHtcblx0XHRcdFx0dC5vcHRpb25zLnRpbWVGb3JtYXQgPSAnaGg6bW06c3MnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHQub3B0aW9ucy5zaG93VGltZWNvZGVGcmFtZUNvdW50KSB7XG5cdFx0XHRcdHQub3B0aW9ucy50aW1lRm9ybWF0ICs9ICc6ZmYnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNhbGN1bGF0ZVRpbWVGb3JtYXQoMCwgdC5vcHRpb25zLCB0Lm9wdGlvbnMuZnJhbWVzUGVyU2Vjb25kIHx8IDI1KTtcblxuXHRcdC8vIHVuaXF1ZSBJRFxuXHRcdHQuaWQgPSBgbWVwXyR7bWVqcy5tZXBJbmRleCsrfWA7XG5cblx0XHQvLyBhZGQgdG8gcGxheWVyIGFycmF5IChmb3IgZm9jdXMgZXZlbnRzKVxuXHRcdG1lanMucGxheWVyc1t0LmlkXSA9IHQ7XG5cblx0XHQvLyBzdGFydCB1cFxuXHRcdGxldFxuXG5cdFx0XHRtZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0Lm9wdGlvbnMsIHtcblx0XHRcdFx0c3VjY2VzczogKG1lZGlhLCBkb21Ob2RlKSA9PiB7XG5cdFx0XHRcdFx0dC5fbWVSZWFkeShtZWRpYSwgZG9tTm9kZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiAoZSkgPT4ge1xuXHRcdFx0XHRcdHQuX2hhbmRsZUVycm9yKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHRhZ05hbWUgPSB0Lm1lZGlhLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuXHRcdFx0O1xuXG5cdFx0Ly8gZ2V0IHZpZGVvIGZyb20gc3JjIG9yIGhyZWY/XG5cdFx0dC5pc0R5bmFtaWMgPSAodGFnTmFtZSAhPT0gJ2F1ZGlvJyAmJiB0YWdOYW1lICE9PSAndmlkZW8nKTtcblx0XHR0LmlzVmlkZW8gPSAodC5pc0R5bmFtaWMpID8gdC5vcHRpb25zLmlzVmlkZW8gOiAodGFnTmFtZSAhPT0gJ2F1ZGlvJyAmJiB0Lm9wdGlvbnMuaXNWaWRlbyk7XG5cblx0XHQvLyB1c2UgbmF0aXZlIGNvbnRyb2xzIGluIGlQYWQsIGlQaG9uZSwgYW5kIEFuZHJvaWRcblx0XHRpZiAoKElTX0lQQUQgJiYgdC5vcHRpb25zLmlQYWRVc2VOYXRpdmVDb250cm9scykgfHwgKElTX0lQSE9ORSAmJiB0Lm9wdGlvbnMuaVBob25lVXNlTmF0aXZlQ29udHJvbHMpKSB7XG5cblx0XHRcdC8vIGFkZCBjb250cm9scyBhbmQgc3RvcFxuXHRcdFx0dC4kbWVkaWEuYXR0cignY29udHJvbHMnLCAnY29udHJvbHMnKTtcblxuXHRcdFx0Ly8gb3ZlcnJpZGUgQXBwbGUncyBhdXRvcGxheSBvdmVycmlkZSBmb3IgaVBhZHNcblx0XHRcdGlmIChJU19JUEFEICYmIHQubWVkaWEuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKSB7XG5cdFx0XHRcdHQucGxheSgpO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmIChJU19BTkRST0lEICYmIHQub3B0aW9ucy5BbmRyb2lkVXNlTmF0aXZlQ29udHJvbHMpIHtcblxuXHRcdFx0Ly8gbGVhdmUgZGVmYXVsdCBwbGF5ZXJcblxuXHRcdH0gZWxzZSBpZiAodC5pc1ZpZGVvIHx8ICghdC5pc1ZpZGVvICYmIHQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGgpKSB7XG5cblx0XHRcdC8vIERFU0tUT1A6IHVzZSBNZWRpYUVsZW1lbnRQbGF5ZXIgY29udHJvbHNcblxuXHRcdFx0Ly8gcmVtb3ZlIG5hdGl2ZSBjb250cm9sc1xuXHRcdFx0dC4kbWVkaWEucmVtb3ZlQXR0cignY29udHJvbHMnKTtcblx0XHRcdGxldCB2aWRlb1BsYXllclRpdGxlID0gdC5pc1ZpZGVvID8gaTE4bi50KCdtZWpzLnZpZGVvLXBsYXllcicpIDogaTE4bi50KCdtZWpzLmF1ZGlvLXBsYXllcicpO1xuXHRcdFx0Ly8gaW5zZXJ0IGRlc2NyaXB0aW9uIGZvciBzY3JlZW4gcmVhZGVyc1xuXHRcdFx0JChgPHNwYW4gY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5cIj4ke3ZpZGVvUGxheWVyVGl0bGV9PC9zcGFuPmApLmluc2VydEJlZm9yZSh0LiRtZWRpYSk7XG5cdFx0XHQvLyBidWlsZCBjb250YWluZXJcblx0XHRcdHQuY29udGFpbmVyID1cblx0XHRcdFx0JChgPGRpdiBpZD1cIiR7dC5pZH1cIiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVcImAgK1xuXHRcdFx0XHRcdGB0YWJpbmRleD1cIjBcIiByb2xlPVwiYXBwbGljYXRpb25cIiBhcmlhLWxhYmVsPVwiJHt2aWRlb1BsYXllclRpdGxlfVwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aW5uZXJcIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW1lZGlhZWxlbWVudFwiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9bGF5ZXJzXCI+PC9kaXY+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sc1wiPjwvZGl2PmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y2xlYXJcIj48L2Rpdj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYWRkQ2xhc3ModC4kbWVkaWFbMF0uY2xhc3NOYW1lKVxuXHRcdFx0XHQuaW5zZXJ0QmVmb3JlKHQuJG1lZGlhKVxuXHRcdFx0XHQuZm9jdXMoKGUpID0+IHtcblx0XHRcdFx0XHRpZiAoIXQuY29udHJvbHNBcmVWaXNpYmxlICYmICF0Lmhhc0ZvY3VzICYmIHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHR0LnNob3dDb250cm9scyh0cnVlKTtcblx0XHRcdFx0XHRcdC8vIEluIHZlcnNpb25zIG9sZGVyIHRoYW4gSUUxMSwgdGhlIGZvY3VzIGNhdXNlcyB0aGUgcGxheWJhciB0byBiZSBkaXNwbGF5ZWRcblx0XHRcdFx0XHRcdC8vIGlmIHVzZXIgY2xpY2tzIG9uIHRoZSBQbGF5L1BhdXNlIGJ1dHRvbiBpbiB0aGUgY29udHJvbCBiYXIgb25jZSBpdCBhdHRlbXB0c1xuXHRcdFx0XHRcdFx0Ly8gdG8gaGlkZSBpdFxuXHRcdFx0XHRcdFx0aWYgKCFIQVNfTVNfTkFUSVZFX0ZVTExTQ1JFRU4pIHtcblx0XHRcdFx0XHRcdFx0Ly8gSWYgZS5yZWxhdGVkVGFyZ2V0IGFwcGVhcnMgYmVmb3JlIGNvbnRhaW5lciwgc2VuZCBmb2N1cyB0byBwbGF5IGJ1dHRvbixcblx0XHRcdFx0XHRcdFx0Ly8gZWxzZSBzZW5kIGZvY3VzIHRvIGxhc3QgY29udHJvbCBidXR0b24uXG5cdFx0XHRcdFx0XHRcdGxldCBidG5TZWxlY3RvciA9IGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9cGxheXBhdXNlLWJ1dHRvbiA+IGJ1dHRvbmA7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGlzTm9kZUFmdGVyKGUucmVsYXRlZFRhcmdldCwgdC5jb250YWluZXJbMF0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0YnRuU2VsZWN0b3IgPSBgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xzIC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1idXR0b246bGFzdC1jaGlsZCA+IGJ1dHRvbmA7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRsZXQgYnV0dG9uID0gdC5jb250YWluZXIuZmluZChidG5TZWxlY3Rvcik7XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi5mb2N1cygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFdoZW4gbm8gZWxlbWVudHMgaW4gY29udHJvbHMsIGhpZGUgYmFyIGNvbXBsZXRlbHlcblx0XHRcdGlmICghdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkge1xuXHRcdFx0XHR0LmNvbnRhaW5lci5jc3MoJ2JhY2tncm91bmQnLCAndHJhbnNwYXJlbnQnKVxuXHRcdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xzYClcblx0XHRcdFx0LmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQuaXNWaWRlbyAmJiB0Lm9wdGlvbnMuc3RyZXRjaGluZyA9PT0gJ2ZpbGwnICYmICF0LmNvbnRhaW5lci5wYXJlbnQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1maWxsLWNvbnRhaW5lcmApLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBvdXRlciBjb250YWluZXJcblx0XHRcdFx0dC5vdXRlckNvbnRhaW5lciA9IHQuJG1lZGlhLnBhcmVudCgpO1xuXHRcdFx0XHR0LmNvbnRhaW5lci53cmFwKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9ZmlsbC1jb250YWluZXJcIi8+YCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFkZCBjbGFzc2VzIGZvciB1c2VyIGFuZCBjb250ZW50XG5cdFx0XHR0LmNvbnRhaW5lci5hZGRDbGFzcyhcblx0XHRcdFx0KElTX0FORFJPSUQgPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YW5kcm9pZCBgIDogJycpICtcblx0XHRcdFx0KElTX0lPUyA/IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1pb3MgYCA6ICcnKSArXG5cdFx0XHRcdChJU19JUEFEID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWlwYWQgYCA6ICcnKSArXG5cdFx0XHRcdChJU19JUEhPTkUgPyBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9aXBob25lIGAgOiAnJykgK1xuXHRcdFx0XHQodC5pc1ZpZGVvID8gYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXZpZGVvIGAgOiBgJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9YXVkaW8gYClcblx0XHRcdCk7XG5cblxuXHRcdFx0Ly8gbW92ZSB0aGUgPHZpZGVvL3ZpZGVvPiB0YWcgaW50byB0aGUgcmlnaHQgc3BvdFxuXHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW1lZGlhZWxlbWVudGApLmFwcGVuZCh0LiRtZWRpYSk7XG5cblx0XHRcdC8vIG5lZWRzIHRvIGJlIGFzc2lnbmVkIGhlcmUsIGFmdGVyIGlPUyByZW1hcFxuXHRcdFx0dC5ub2RlLnBsYXllciA9IHQ7XG5cblx0XHRcdC8vIGZpbmQgcGFydHNcblx0XHRcdHQuY29udHJvbHMgPSB0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbHNgKTtcblx0XHRcdHQubGF5ZXJzID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyc2ApO1xuXG5cdFx0XHQvLyBkZXRlcm1pbmUgdGhlIHNpemVcblxuXHRcdFx0Lyogc2l6ZSBwcmlvcml0eTpcblx0XHRcdCAoMSkgdmlkZW9XaWR0aCAoZm9yY2VkKSxcblx0XHRcdCAoMikgc3R5bGU9XCJ3aWR0aDtoZWlnaHQ7XCJcblx0XHRcdCAoMykgd2lkdGggYXR0cmlidXRlLFxuXHRcdFx0ICg0KSBkZWZhdWx0VmlkZW9XaWR0aCAoZm9yIHVuc3BlY2lmaWVkIGNhc2VzKVxuXHRcdFx0ICovXG5cblx0XHRcdGxldFxuXHRcdFx0XHR0YWdUeXBlID0gKHQuaXNWaWRlbyA/ICd2aWRlbycgOiAnYXVkaW8nKSxcblx0XHRcdFx0Y2Fwc1RhZ05hbWUgPSB0YWdUeXBlLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGFnVHlwZS5zdWJzdHJpbmcoMSlcblx0XHRcdFx0O1xuXG5cblx0XHRcdGlmICh0Lm9wdGlvbnNbdGFnVHlwZSArICdXaWR0aCddID4gMCB8fCB0Lm9wdGlvbnNbdGFnVHlwZSArICdXaWR0aCddLnRvU3RyaW5nKCkuaW5kZXhPZignJScpID4gLTEpIHtcblx0XHRcdFx0dC53aWR0aCA9IHQub3B0aW9uc1t0YWdUeXBlICsgJ1dpZHRoJ107XG5cdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuc3R5bGUud2lkdGggIT09ICcnICYmIHQubWVkaWEuc3R5bGUud2lkdGggIT09IG51bGwpIHtcblx0XHRcdFx0dC53aWR0aCA9IHQubWVkaWEuc3R5bGUud2lkdGg7XG5cdFx0XHR9IGVsc2UgaWYgKHQubWVkaWEuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0LiRtZWRpYS5hdHRyKCd3aWR0aCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dC53aWR0aCA9IHQub3B0aW9uc1snZGVmYXVsdCcgKyBjYXBzVGFnTmFtZSArICdXaWR0aCddO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodC5vcHRpb25zW3RhZ1R5cGUgKyAnSGVpZ2h0J10gPiAwIHx8IHQub3B0aW9uc1t0YWdUeXBlICsgJ0hlaWdodCddLnRvU3RyaW5nKCkuaW5kZXhPZignJScpID4gLTEpIHtcblx0XHRcdFx0dC5oZWlnaHQgPSB0Lm9wdGlvbnNbdGFnVHlwZSArICdIZWlnaHQnXTtcblx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5zdHlsZS5oZWlnaHQgIT09ICcnICYmIHQubWVkaWEuc3R5bGUuaGVpZ2h0ICE9PSBudWxsKSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC5tZWRpYS5zdHlsZS5oZWlnaHQ7XG5cdFx0XHR9IGVsc2UgaWYgKHQuJG1lZGlhWzBdLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpIHtcblx0XHRcdFx0dC5oZWlnaHQgPSB0LiRtZWRpYS5hdHRyKCdoZWlnaHQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHQuaGVpZ2h0ID0gdC5vcHRpb25zWydkZWZhdWx0JyArIGNhcHNUYWdOYW1lICsgJ0hlaWdodCddO1xuXHRcdFx0fVxuXG5cdFx0XHR0LmluaXRpYWxBc3BlY3RSYXRpbyA9ICh0LmhlaWdodCA+PSB0LndpZHRoKSA/IHQud2lkdGggLyB0LmhlaWdodCA6IHQuaGVpZ2h0IC8gdC53aWR0aDtcblxuXHRcdFx0Ly8gc2V0IHRoZSBzaXplLCB3aGlsZSB3ZSB3YWl0IGZvciB0aGUgcGx1Z2lucyB0byBsb2FkIGJlbG93XG5cdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXG5cdFx0XHQvLyBjcmVhdGUgTWVkaWFFbGVtZW50U2hpbVxuXHRcdFx0bWVPcHRpb25zLnBsdWdpbldpZHRoID0gdC53aWR0aDtcblx0XHRcdG1lT3B0aW9ucy5wbHVnaW5IZWlnaHQgPSB0LmhlaWdodDtcblx0XHR9XG5cdFx0Ly8gSGlkZSBtZWRpYSBjb21wbGV0ZWx5IGZvciBhdWRpbyB0aGF0IGRvZXNuJ3QgaGF2ZSBhbnkgZmVhdHVyZXNcblx0XHRlbHNlIGlmICghdC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuZmVhdHVyZXMubGVuZ3RoKSB7XG5cdFx0XHR0LiRtZWRpYS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gY3JlYXRlIE1lZGlhRWxlbWVudCBzaGltXG5cdFx0bmV3IE1lZGlhRWxlbWVudCh0LiRtZWRpYVswXSwgbWVPcHRpb25zKTtcblxuXHRcdGlmICh0LmNvbnRhaW5lciAhPT0gdW5kZWZpbmVkICYmIHQub3B0aW9ucy5mZWF0dXJlcy5sZW5ndGggJiYgdC5jb250cm9sc0FyZVZpc2libGUgJiYgIXQub3B0aW9ucy5oaWRlVmlkZW9Db250cm9sc09uTG9hZCkge1xuXHRcdFx0Ly8gY29udHJvbHMgYXJlIHNob3duIHdoZW4gbG9hZGVkXG5cdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc3Nob3duJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHQ7XG5cdH1cblxuXHRzaG93Q29udHJvbHMgKGRvQW5pbWF0aW9uKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0ZG9BbmltYXRpb24gPSBkb0FuaW1hdGlvbiA9PT0gdW5kZWZpbmVkIHx8IGRvQW5pbWF0aW9uO1xuXG5cdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGRvQW5pbWF0aW9uKSB7XG5cdFx0XHR0LmNvbnRyb2xzXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKS5mYWRlSW4oMjAwLCAoKSA9PiB7XG5cdFx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNzaG93bicpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGFueSBhZGRpdGlvbmFsIGNvbnRyb2xzIHBlb3BsZSBtaWdodCBhZGQgYW5kIHdhbnQgdG8gaGlkZVxuXHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xgKVxuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZUluKDIwMCwgKCkgPT4ge1xuXHRcdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0LmNvbnRyb2xzXG5cdFx0XHQucmVtb3ZlQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdC8vIGFueSBhZGRpdGlvbmFsIGNvbnRyb2xzIHBlb3BsZSBtaWdodCBhZGQgYW5kIHdhbnQgdG8gaGlkZVxuXHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRyb2xgKVxuXHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHR0LmNvbnRyb2xzQXJlVmlzaWJsZSA9IHRydWU7XG5cdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc3Nob3duJyk7XG5cdFx0fVxuXG5cdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblxuXHR9XG5cblx0aGlkZUNvbnRyb2xzIChkb0FuaW1hdGlvbikge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdGRvQW5pbWF0aW9uID0gZG9BbmltYXRpb24gPT09IHVuZGVmaW5lZCB8fCBkb0FuaW1hdGlvbjtcblxuXHRcdGlmICghdC5jb250cm9sc0FyZVZpc2libGUgfHwgdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scyB8fCB0LmtleWJvYXJkQWN0aW9uIHx8XG5cdFx0XHQodC5tZWRpYS5wYXVzZWQgJiYgdC5tZWRpYS5yZWFkeVN0YXRlID09PSA0ICYmICgoIXQub3B0aW9ucy5oaWRlVmlkZW9Db250cm9sc09uTG9hZCAmJlxuXHRcdFx0dC5tZWRpYS5jdXJyZW50VGltZSA8PSAwKSB8fCB0Lm1lZGlhLmN1cnJlbnRUaW1lID4gMCkpIHx8XG5cdFx0XHQodC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQgJiYgIXQubWVkaWEucmVhZHlTdGF0ZSkgfHxcblx0XHRcdHQubWVkaWEuZW5kZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZG9BbmltYXRpb24pIHtcblx0XHRcdC8vIGZhZGUgb3V0IG1haW4gY29udHJvbHNcblx0XHRcdHQuY29udHJvbHMuc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG5cdFx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzaGlkZGVuJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYW55IGFkZGl0aW9uYWwgY29udHJvbHMgcGVvcGxlIG1pZ2h0IGFkZCBhbmQgd2FudCB0byBoaWRlXG5cdFx0XHR0LmNvbnRhaW5lci5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udHJvbGApLnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dCgyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIGhpZGUgbWFpbiBjb250cm9sc1xuXHRcdFx0dC5jb250cm9sc1xuXHRcdFx0XHQuYWRkQ2xhc3MoYCR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApXG5cdFx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuXHRcdFx0Ly8gaGlkZSBvdGhlcnNcblx0XHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250cm9sYClcblx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vZmZzY3JlZW5gKVxuXHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHRcdHQuY29udHJvbHNBcmVWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHR0LmNvbnRhaW5lci50cmlnZ2VyKCdjb250cm9sc2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdHN0YXJ0Q29udHJvbHNUaW1lciAodGltZW91dCkge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dGltZW91dCA9IHR5cGVvZiB0aW1lb3V0ICE9PSAndW5kZWZpbmVkJyA/IHRpbWVvdXQgOiB0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0RGVmYXVsdDtcblxuXHRcdHQua2lsbENvbnRyb2xzVGltZXIoJ3N0YXJ0Jyk7XG5cblx0XHR0LmNvbnRyb2xzVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHQuaGlkZUNvbnRyb2xzKCk7XG5cdFx0XHR0LmtpbGxDb250cm9sc1RpbWVyKCdoaWRlJyk7XG5cdFx0fSwgdGltZW91dCk7XG5cdH1cblxuXHRraWxsQ29udHJvbHNUaW1lciAoKSB7XG5cblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAodC5jb250cm9sc1RpbWVyICE9PSBudWxsKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodC5jb250cm9sc1RpbWVyKTtcblx0XHRcdGRlbGV0ZSB0LmNvbnRyb2xzVGltZXI7XG5cdFx0XHR0LmNvbnRyb2xzVGltZXIgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdGRpc2FibGVDb250cm9scyAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5raWxsQ29udHJvbHNUaW1lcigpO1xuXHRcdHQuaGlkZUNvbnRyb2xzKGZhbHNlKTtcblx0XHR0aGlzLmNvbnRyb2xzRW5hYmxlZCA9IGZhbHNlO1xuXHR9XG5cblx0ZW5hYmxlQ29udHJvbHMgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuc2hvd0NvbnRyb2xzKGZhbHNlKTtcblxuXHRcdHQuY29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdXAgYWxsIGNvbnRyb2xzIGFuZCBldmVudHNcblx0ICpcblx0ICogQHBhcmFtIG1lZGlhXG5cdCAqIEBwYXJhbSBkb21Ob2RlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfbWVSZWFkeSAobWVkaWEsIGRvbU5vZGUpIHtcblxuXHRcdGxldFxuXHRcdFx0dCA9IHRoaXMsXG5cdFx0XHRhdXRvcGxheUF0dHIgPSBkb21Ob2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSxcblx0XHRcdGF1dG9wbGF5ID0gIShhdXRvcGxheUF0dHIgPT09IHVuZGVmaW5lZCB8fCBhdXRvcGxheUF0dHIgPT09IG51bGwgfHwgYXV0b3BsYXlBdHRyID09PSAnZmFsc2UnKSxcblx0XHRcdGlzTmF0aXZlID0gbWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIG1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKG5hdGl2ZXxodG1sNSkvKSAhPT0gbnVsbFxuXHRcdFx0O1xuXG5cdFx0Ly8gbWFrZSBzdXJlIGl0IGNhbid0IGNyZWF0ZSBpdHNlbGYgYWdhaW4gaWYgYSBwbHVnaW4gcmVsb2Fkc1xuXHRcdGlmICh0LmNyZWF0ZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0LmNyZWF0ZWQgPSB0cnVlO1xuXHRcdHQubWVkaWEgPSBtZWRpYTtcblx0XHR0LmRvbU5vZGUgPSBkb21Ob2RlO1xuXG5cdFx0aWYgKCEoSVNfQU5EUk9JRCAmJiB0Lm9wdGlvbnMuQW5kcm9pZFVzZU5hdGl2ZUNvbnRyb2xzKSAmJiAhKElTX0lQQUQgJiYgdC5vcHRpb25zLmlQYWRVc2VOYXRpdmVDb250cm9scykgJiYgIShJU19JUEhPTkUgJiYgdC5vcHRpb25zLmlQaG9uZVVzZU5hdGl2ZUNvbnRyb2xzKSkge1xuXG5cdFx0XHQvLyBJbiB0aGUgZXZlbnQgdGhhdCBubyBmZWF0dXJlcyBhcmUgc3BlY2lmaWVkIGZvciBhdWRpbyxcblx0XHRcdC8vIGNyZWF0ZSBvbmx5IE1lZGlhRWxlbWVudCBpbnN0YW5jZSByYXRoZXIgdGhhblxuXHRcdFx0Ly8gZG9pbmcgYWxsIHRoZSB3b3JrIHRvIGNyZWF0ZSBhIGZ1bGwgcGxheWVyXG5cdFx0XHRpZiAoIXQuaXNWaWRlbyAmJiAhdC5vcHRpb25zLmZlYXR1cmVzLmxlbmd0aCkge1xuXG5cdFx0XHRcdC8vIGZvcmNlIGF1dG9wbGF5IGZvciBIVE1MNVxuXHRcdFx0XHRpZiAoYXV0b3BsYXkgJiYgaXNOYXRpdmUpIHtcblx0XHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0aWYgKHQub3B0aW9ucy5zdWNjZXNzKSB7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIHQub3B0aW9ucy5zdWNjZXNzID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0d2luZG93W3Qub3B0aW9ucy5zdWNjZXNzXSh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0Lm9wdGlvbnMuc3VjY2Vzcyh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdHdvIGJ1aWx0IGluIGZlYXR1cmVzXG5cdFx0XHR0LmJ1aWxkcG9zdGVyKHQsIHQuY29udHJvbHMsIHQubGF5ZXJzLCB0Lm1lZGlhKTtcblx0XHRcdHQuYnVpbGRrZXlib2FyZCh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdFx0XHR0LmJ1aWxkb3ZlcmxheXModCwgdC5jb250cm9scywgdC5sYXllcnMsIHQubWVkaWEpO1xuXG5cdFx0XHQvLyBncmFiIGZvciB1c2UgYnkgZmVhdHVyZXNcblx0XHRcdHQuZmluZFRyYWNrcygpO1xuXG5cdFx0XHQvLyBhZGQgdXNlci1kZWZpbmVkIGZlYXR1cmVzL2NvbnRyb2xzXG5cdFx0XHRmb3IgKGxldCBmZWF0dXJlSW5kZXggaW4gdC5vcHRpb25zLmZlYXR1cmVzKSB7XG5cdFx0XHRcdGxldCBmZWF0dXJlID0gdC5vcHRpb25zLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG5cdFx0XHRcdGlmICh0W2BidWlsZCR7ZmVhdHVyZX1gXSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR0W2BidWlsZCR7ZmVhdHVyZX1gXSh0LCB0LmNvbnRyb2xzLCB0LmxheWVycywgdC5tZWRpYSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogcmVwb3J0IGNvbnRyb2wgZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGVycm9yIGJ1aWxkaW5nICR7ZmVhdHVyZX1gLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dC5jb250YWluZXIudHJpZ2dlcignY29udHJvbHNyZWFkeScpO1xuXG5cdFx0XHQvLyByZXNldCBhbGwgbGF5ZXJzIGFuZCBjb250cm9sc1xuXHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cblx0XHRcdC8vIGNvbnRyb2xzIGZhZGVcblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblxuXHRcdFx0XHRpZiAoSEFTX1RPVUNIICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cblx0XHRcdFx0XHQvLyBmb3IgdG91Y2ggZGV2aWNlcyAoaU9TLCBBbmRyb2lkKVxuXHRcdFx0XHRcdC8vIHNob3cvaGlkZSB3aXRob3V0IGFuaW1hdGlvbiBvbiB0b3VjaFxuXG5cdFx0XHRcdFx0dC4kbWVkaWEub24oJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XG5cblx0XHRcdFx0XHRcdC8vIHRvZ2dsZSBjb250cm9sc1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNBcmVWaXNpYmxlKSB7XG5cdFx0XHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKGZhbHNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBjcmVhdGUgY2FsbGJhY2sgaGVyZSBzaW5jZSBpdCBuZWVkcyBhY2Nlc3MgdG8gY3VycmVudFxuXHRcdFx0XHRcdC8vIE1lZGlhRWxlbWVudCBvYmplY3Rcblx0XHRcdFx0XHR0LmNsaWNrVG9QbGF5UGF1c2VDYWxsYmFjayA9ICgpID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKHQub3B0aW9ucy5jbGlja1RvUGxheVBhdXNlKSB7XG5cdFx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbiA9IHQuJG1lZGlhLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKVxuXHRcdFx0XHRcdFx0XHRcdC5maW5kKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1idXR0b25gKSxcblx0XHRcdFx0XHRcdFx0XHRwcmVzc2VkID0gYnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcpXG5cdFx0XHRcdFx0XHRcdFx0O1xuXHRcdFx0XHRcdFx0XHRpZiAodC5tZWRpYS5wYXVzZWQgJiYgcHJlc3NlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0Lm1lZGlhLnBhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHQucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHQucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi5hdHRyKCdhcmlhLXByZXNzZWQnLCAhcHJlc3NlZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdC8vIGNsaWNrIHRvIHBsYXkvcGF1c2Vcblx0XHRcdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdC5jbGlja1RvUGxheVBhdXNlQ2FsbGJhY2ssIGZhbHNlKTtcblxuXHRcdFx0XHRcdC8vIHNob3cvaGlkZSBjb250cm9sc1xuXHRcdFx0XHRcdHQuY29udGFpbmVyXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHRcdHQua2lsbENvbnRyb2xzVGltZXIoJ2VudGVyJyk7XG5cdFx0XHRcdFx0XHRcdFx0dC5zaG93Q29udHJvbHMoKTtcblx0XHRcdFx0XHRcdFx0XHR0LnN0YXJ0Q29udHJvbHNUaW1lcih0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0TW91c2VFbnRlcik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5jb250cm9sc0FyZVZpc2libGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnNob3dDb250cm9scygpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scykge1xuXHRcdFx0XHRcdFx0XHRcdHQuc3RhcnRDb250cm9sc1RpbWVyKHQub3B0aW9ucy5jb250cm9sc1RpbWVvdXRNb3VzZUVudGVyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHQuY29udHJvbHNFbmFibGVkKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdC5tZWRpYS5wYXVzZWQgJiYgIXQub3B0aW9ucy5hbHdheXNTaG93Q29udHJvbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR0LnN0YXJ0Q29udHJvbHNUaW1lcih0Lm9wdGlvbnMuY29udHJvbHNUaW1lb3V0TW91c2VMZWF2ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuaGlkZVZpZGVvQ29udHJvbHNPbkxvYWQpIHtcblx0XHRcdFx0XHR0LmhpZGVDb250cm9scyhmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjaGVjayBmb3IgYXV0b3BsYXlcblx0XHRcdFx0aWYgKGF1dG9wbGF5ICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0dC5oaWRlQ29udHJvbHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlc2l6ZXJcblx0XHRcdFx0aWYgKHQub3B0aW9ucy5lbmFibGVBdXRvc2l6ZSkge1xuXHRcdFx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gaWYgdGhlIDx2aWRlbyBoZWlnaHQ+IHdhcyBub3Qgc2V0IGFuZCB0aGUgb3B0aW9ucy52aWRlb0hlaWdodCB3YXMgbm90IHNldFxuXHRcdFx0XHRcdFx0Ly8gdGhlbiByZXNpemUgdG8gdGhlIHJlYWwgZGltZW5zaW9uc1xuXHRcdFx0XHRcdFx0aWYgKHQub3B0aW9ucy52aWRlb0hlaWdodCA8PSAwICYmICF0LmRvbU5vZGUuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSAmJiAhaXNOYU4oZS50YXJnZXQudmlkZW9IZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHRcdHQuc2V0UGxheWVyU2l6ZShlLnRhcmdldC52aWRlb1dpZHRoLCBlLnRhcmdldC52aWRlb0hlaWdodCk7XG5cdFx0XHRcdFx0XHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdFx0XHRcdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShlLnRhcmdldC52aWRlb1dpZHRoLCBlLnRhcmdldC52aWRlb0hlaWdodCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVWRU5UU1xuXG5cdFx0XHQvLyBGT0NVUzogd2hlbiBhIHZpZGVvIHN0YXJ0cyBwbGF5aW5nLCBpdCB0YWtlcyBmb2N1cyBmcm9tIG90aGVyIHBsYXllcnMgKHBvc3NpYmx5IHBhdXNpbmcgdGhlbSlcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcblx0XHRcdFx0dC5oYXNGb2N1cyA9IHRydWU7XG5cblx0XHRcdFx0Ly8gZ28gdGhyb3VnaCBhbGwgb3RoZXIgcGxheWVyc1xuXHRcdFx0XHRmb3IgKGxldCBwbGF5ZXJJbmRleCBpbiBtZWpzLnBsYXllcnMpIHtcblx0XHRcdFx0XHRsZXQgcCA9IG1lanMucGxheWVyc1twbGF5ZXJJbmRleF07XG5cdFx0XHRcdFx0aWYgKHAuaWQgIT09IHQuaWQgJiYgdC5vcHRpb25zLnBhdXNlT3RoZXJQbGF5ZXJzICYmICFwLnBhdXNlZCAmJiAhcC5lbmRlZCkge1xuXHRcdFx0XHRcdFx0cC5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0cC5oYXNGb2N1cyA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdC8vIGVuZGVkIGZvciBhbGxcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0Lm9wdGlvbnMuYXV0b1Jld2luZCkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR0Lm1lZGlhLnNldEN1cnJlbnRUaW1lKDApO1xuXHRcdFx0XHRcdFx0Ly8gRml4aW5nIGFuIEFuZHJvaWQgc3RvY2sgYnJvd3NlciBidWcsIHdoZXJlIFwic2Vla2VkXCIgaXNuJ3QgZmlyZWQgY29ycmVjdGx5IGFmdGVyIGVuZGluZyB0aGUgdmlkZW8gYW5kIGp1bXBpbmcgdG8gdGhlIGJlZ2lubmluZ1xuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQkKHQuY29udGFpbmVyKVxuXHRcdFx0XHRcdFx0XHQuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktbG9hZGluZ2ApXG5cdFx0XHRcdFx0XHRcdC5wYXJlbnQoKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9LCAyMCk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXhwKSB7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHQubWVkaWEuc3RvcCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHQubWVkaWEuc3RvcCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHQubWVkaWEucGF1c2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0LnNldFByb2dyZXNzUmFpbCkge1xuXHRcdFx0XHRcdHQuc2V0UHJvZ3Jlc3NSYWlsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHQuc2V0Q3VycmVudFJhaWwpIHtcblx0XHRcdFx0XHR0LnNldEN1cnJlbnRSYWlsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5vcHRpb25zLmxvb3ApIHtcblx0XHRcdFx0XHR0LnBsYXkoKTtcblx0XHRcdFx0fSBlbHNlIGlmICghdC5vcHRpb25zLmFsd2F5c1Nob3dDb250cm9scyAmJiB0LmNvbnRyb2xzRW5hYmxlZCkge1xuXHRcdFx0XHRcdHQuc2hvd0NvbnRyb2xzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0Ly8gcmVzaXplIG9uIHRoZSBmaXJzdCBwbGF5XG5cdFx0XHR0Lm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXG5cdFx0XHRcdGNhbGN1bGF0ZVRpbWVGb3JtYXQodC5kdXJhdGlvbiwgdC5vcHRpb25zLCB0Lm9wdGlvbnMuZnJhbWVzUGVyU2Vjb25kIHx8IDI1KTtcblxuXHRcdFx0XHRpZiAodC51cGRhdGVEdXJhdGlvbikge1xuXHRcdFx0XHRcdHQudXBkYXRlRHVyYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodC51cGRhdGVDdXJyZW50KSB7XG5cdFx0XHRcdFx0dC51cGRhdGVDdXJyZW50KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXQuaXNGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdC8vIE9ubHkgY2hhbmdlIHRoZSB0aW1lIGZvcm1hdCB3aGVuIG5lY2Vzc2FyeVxuXHRcdFx0bGV0IGR1cmF0aW9uID0gbnVsbDtcblx0XHRcdHQubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsICgpID0+IHtcblx0XHRcdFx0aWYgKGR1cmF0aW9uICE9PSB0aGlzLmR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0ZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuXHRcdFx0XHRcdGNhbGN1bGF0ZVRpbWVGb3JtYXQoZHVyYXRpb24sIHQub3B0aW9ucywgdC5vcHRpb25zLmZyYW1lc1BlclNlY29uZCB8fCAyNSk7XG5cblx0XHRcdFx0XHQvLyBtYWtlIHN1cmUgdG8gZmlsbCBpbiBhbmQgcmVzaXplIHRoZSBjb250cm9scyAoZS5nLiwgMDA6MDAgPT4gMDE6MTM6MTVcblx0XHRcdFx0XHRpZiAodC51cGRhdGVEdXJhdGlvbikge1xuXHRcdFx0XHRcdFx0dC51cGRhdGVEdXJhdGlvbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodC51cGRhdGVDdXJyZW50KSB7XG5cdFx0XHRcdFx0XHR0LnVwZGF0ZUN1cnJlbnQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSk7XG5cblx0XHRcdHQuY29udGFpbmVyLmZvY3Vzb3V0KChlKSA9PiB7XG5cdFx0XHRcdGlmIChlLnJlbGF0ZWRUYXJnZXQpIHsgLy9GRiBpcyB3b3JraW5nIG9uIHN1cHBvcnRpbmcgZm9jdXNvdXQgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njg3Nzg3XG5cdFx0XHRcdFx0bGV0ICR0YXJnZXQgPSAkKGUucmVsYXRlZFRhcmdldCk7XG5cdFx0XHRcdFx0aWYgKHQua2V5Ym9hcmRBY3Rpb24gJiYgJHRhcmdldC5wYXJlbnRzKGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0LmtleWJvYXJkQWN0aW9uID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRpZiAodC5pc1ZpZGVvICYmICF0Lm9wdGlvbnMuYWx3YXlzU2hvd0NvbnRyb2xzKSB7XG5cdFx0XHRcdFx0XHRcdHQuaGlkZUNvbnRyb2xzKHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gd2Via2l0IGhhcyB0cm91YmxlIGRvaW5nIHRoaXMgd2l0aG91dCBhIGRlbGF5XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0dC5zZXRQbGF5ZXJTaXplKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0dC5zZXRDb250cm9sc1NpemUoKTtcblx0XHRcdH0sIDUwKTtcblxuXHRcdFx0Ly8gYWRqdXN0IGNvbnRyb2xzIHdoZW5ldmVyIHdpbmRvdyBzaXplcyAodXNlZCB0byBiZSBpbiBmdWxsc2NyZWVuIG9ubHkpXG5cdFx0XHR0Lmdsb2JhbEJpbmQoJ3Jlc2l6ZScsICgpID0+IHtcblxuXHRcdFx0XHQvLyBkb24ndCByZXNpemUgZm9yIGZ1bGxzY3JlZW4gbW9kZVxuXHRcdFx0XHRpZiAoISh0LmlzRnVsbFNjcmVlbiB8fCAoSEFTX1RSVUVfTkFUSVZFX0ZVTExTQ1JFRU4gJiYgZG9jdW1lbnQud2Via2l0SXNGdWxsU2NyZWVuKSkpIHtcblx0XHRcdFx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYWx3YXlzIGFkanVzdCBjb250cm9sc1xuXHRcdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIERpc2FibGUgZm9jdXMgb3V0bGluZSB0byBpbXByb3ZlIGxvb2stYW5kLWZlZWwgZm9yIHJlZ3VsYXIgdXNlcnNcblx0XHRcdHQuZ2xvYmFsQmluZCgnY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoJChlLnRhcmdldCkuaXMoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKSkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0LmFkZENsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEVuYWJsZSBmb2N1cyBvdXRsaW5lIGZvciBBY2Nlc3NpYmlsaXR5IHB1cnBvc2VzXG5cdFx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoJChlLnRhcmdldCkuaXMoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKSkge1xuXHRcdFx0XHRcdCQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JChlLnRhcmdldCkuY2xvc2VzdChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWNvbnRhaW5lcmApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIta2V5Ym9hcmQtaW5hY3RpdmVgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoaXMgaXMgYSB3b3JrLWFyb3VuZCBmb3IgYSBidWcgaW4gdGhlIFlvdVR1YmUgaUZyYW1lIHBsYXllciwgd2hpY2ggbWVhbnNcblx0XHRcdC8vXHR3ZSBjYW4ndCB1c2UgdGhlIHBsYXkoKSBBUEkgZm9yIHRoZSBpbml0aWFsIHBsYXliYWNrIG9uIGlPUyBvciBBbmRyb2lkO1xuXHRcdFx0Ly9cdHVzZXIgaGFzIHRvIHN0YXJ0IHBsYXliYWNrIGRpcmVjdGx5IGJ5IHRhcHBpbmcgb24gdGhlIGlGcmFtZS5cblx0XHRcdGlmICh0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgveW91dHViZS8pICYmIChJU19JT1MgfHwgSVNfQU5EUk9JRCkpIHtcblx0XHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktcGxheWApLmhpZGUoKTtcblx0XHRcdFx0dC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlcmApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBmb3JjZSBhdXRvcGxheSBmb3IgSFRNTDVcblx0XHRpZiAoYXV0b3BsYXkgJiYgaXNOYXRpdmUpIHtcblx0XHRcdHQucGxheSgpO1xuXHRcdH1cblxuXHRcdGlmICh0Lm9wdGlvbnMuc3VjY2Vzcykge1xuXG5cdFx0XHRpZiAodHlwZW9mIHQub3B0aW9ucy5zdWNjZXNzID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHR3aW5kb3dbdC5vcHRpb25zLnN1Y2Nlc3NdKHQubWVkaWEsIHQuZG9tTm9kZSwgdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0Lm9wdGlvbnMuc3VjY2Vzcyh0Lm1lZGlhLCB0LmRvbU5vZGUsIHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfaGFuZGxlRXJyb3IgKGUpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAodC5jb250cm9scykge1xuXHRcdFx0dC5kaXNhYmxlQ29udHJvbHMoKTtcblx0XHR9XG5cblx0XHQvLyBUZWxsIHVzZXIgdGhhdCB0aGUgZmlsZSBjYW5ub3QgYmUgcGxheWVkXG5cdFx0aWYgKHQub3B0aW9ucy5lcnJvcikge1xuXHRcdFx0dC5vcHRpb25zLmVycm9yKGUpO1xuXHRcdH1cblx0fVxuXG5cdHNldFBsYXllclNpemUgKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRpZiAoIXQub3B0aW9ucy5zZXREaW1lbnNpb25zKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiB3aWR0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHQud2lkdGggPSB3aWR0aDtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGhlaWdodCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHQuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgRkIgIT09ICd1bmRlZmluZWQnICYmIHQuaXNWaWRlbykge1xuXHRcdFx0RkIuRXZlbnQuc3Vic2NyaWJlKCd4ZmJtbC5yZWFkeScsICgpID0+IHtcblx0XHRcdFx0bGV0IHRhcmdldCA9ICQodC5tZWRpYSkuY2hpbGRyZW4oJy5mYi12aWRlbycpO1xuXG5cdFx0XHRcdHQud2lkdGggPSB0YXJnZXQud2lkdGgoKTtcblx0XHRcdFx0dC5oZWlnaHQgPSB0YXJnZXQuaGVpZ2h0KCk7XG5cdFx0XHRcdHQuc2V0RGltZW5zaW9ucyh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgdGFyZ2V0ID0gJCh0Lm1lZGlhKS5jaGlsZHJlbignLmZiLXZpZGVvJyk7XG5cblx0XHRcdGlmICh0YXJnZXQubGVuZ3RoKSB7XG5cdFx0XHRcdHQud2lkdGggPSB0YXJnZXQud2lkdGgoKTtcblx0XHRcdFx0dC5oZWlnaHQgPSB0YXJnZXQuaGVpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgc3RyZXRjaGluZyBtb2Rlc1xuXHRcdHN3aXRjaCAodC5vcHRpb25zLnN0cmV0Y2hpbmcpIHtcblx0XHRcdGNhc2UgJ2ZpbGwnOlxuXHRcdFx0XHQvLyBUaGUgJ2ZpbGwnIGVmZmVjdCBvbmx5IG1ha2VzIHNlbnNlIG9uIHZpZGVvOyBmb3IgYXVkaW8gd2Ugd2lsbCBzZXQgdGhlIGRpbWVuc2lvbnNcblx0XHRcdFx0aWYgKHQuaXNWaWRlbykge1xuXHRcdFx0XHRcdHQuc2V0RmlsbE1vZGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0LnNldERpbWVuc2lvbnModC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncmVzcG9uc2l2ZSc6XG5cdFx0XHRcdHQuc2V0UmVzcG9uc2l2ZU1vZGUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdub25lJzpcblx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvLyBUaGlzIGlzIHRoZSAnYXV0bycgbW9kZVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0aWYgKHQuaGFzRmx1aWRNb2RlKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHR0LnNldFJlc3BvbnNpdmVNb2RlKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dC5zZXREaW1lbnNpb25zKHQud2lkdGgsIHQuaGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRoYXNGbHVpZE1vZGUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIGRldGVjdCAxMDAlIG1vZGUgLSB1c2UgY3VycmVudFN0eWxlIGZvciBJRSBzaW5jZSBjc3MoKSBkb2Vzbid0IHJldHVybiBwZXJjZW50YWdlc1xuXHRcdHJldHVybiAodC5oZWlnaHQudG9TdHJpbmcoKS5pbmNsdWRlcygnJScpIHx8ICh0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09IHQud2lkdGgpIHx8ICh0LiRub2RlWzBdLmN1cnJlbnRTdHlsZSAmJiB0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhXaWR0aCA9PT0gJzEwMCUnKSk7XG5cdH1cblxuXHRzZXRSZXNwb25zaXZlTW9kZSAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0Ly8gZG8gd2UgaGF2ZSB0aGUgbmF0aXZlIGRpbWVuc2lvbnMgeWV0P1xuXHRcdGxldCBuYXRpdmVXaWR0aCA9ICgoKSA9PiB7XG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdGlmICh0Lm1lZGlhLnZpZGVvV2lkdGggJiYgdC5tZWRpYS52aWRlb1dpZHRoID4gMCkge1xuXHRcdFx0XHRcdHJldHVybiB0Lm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0VmlkZW9XaWR0aDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0QXVkaW9XaWR0aDtcblx0XHRcdH1cblx0XHR9KSgpO1xuXG5cdFx0bGV0IG5hdGl2ZUhlaWdodCA9ICgoKSA9PiB7XG5cdFx0XHRpZiAodC5pc1ZpZGVvKSB7XG5cdFx0XHRcdGlmICh0Lm1lZGlhLnZpZGVvSGVpZ2h0ICYmIHQubWVkaWEudmlkZW9IZWlnaHQgPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEudmlkZW9IZWlnaHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAodC5tZWRpYS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQubWVkaWEuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5vcHRpb25zLmRlZmF1bHRWaWRlb0hlaWdodDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHQub3B0aW9ucy5kZWZhdWx0QXVkaW9IZWlnaHQ7XG5cdFx0XHR9XG5cdFx0fSkoKTtcblxuXHRcdC8vIFVzZSBtZWRpYSBhc3BlY3QgcmF0aW8gaWYgcmVjZWl2ZWQ7IG90aGVyd2lzZSwgdGhlIGluaXRpYWxseSBzdG9yZWQgaW5pdGlhbCBhc3BlY3QgcmF0aW9cblx0XHRsZXRcblx0XHRcdGFzcGVjdFJhdGlvID0gKCgpID0+IHtcblx0XHRcdFx0bGV0IHJhdGlvID0gMTtcblx0XHRcdFx0aWYgKCF0LmlzVmlkZW8pIHtcblx0XHRcdFx0XHRyZXR1cm4gcmF0aW87XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodC5tZWRpYS52aWRlb1dpZHRoICYmIHQubWVkaWEudmlkZW9XaWR0aCA+IDAgJiYgdC5tZWRpYS52aWRlb0hlaWdodCAmJiB0Lm1lZGlhLnZpZGVvSGVpZ2h0ID4gMCkge1xuXHRcdFx0XHRcdHJhdGlvID0gKHQuaGVpZ2h0ID49IHQud2lkdGgpID8gdC5tZWRpYS52aWRlb1dpZHRoIC8gdC5tZWRpYS52aWRlb0hlaWdodCA6IHQubWVkaWEudmlkZW9IZWlnaHQgLyB0Lm1lZGlhLnZpZGVvV2lkdGg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmF0aW8gPSB0LmluaXRpYWxBc3BlY3RSYXRpbztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpc05hTihyYXRpbykgfHwgcmF0aW8gPCAwLjAxIHx8IHJhdGlvID4gMTAwKSB7XG5cdFx0XHRcdFx0cmF0aW8gPSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJhdGlvO1xuXHRcdFx0fSkoKSxcblx0XHRcdHBhcmVudFdpZHRoID0gdC5jb250YWluZXIucGFyZW50KCkuY2xvc2VzdCgnOnZpc2libGUnKS53aWR0aCgpLFxuXHRcdFx0cGFyZW50SGVpZ2h0ID0gdC5jb250YWluZXIucGFyZW50KCkuY2xvc2VzdCgnOnZpc2libGUnKS5oZWlnaHQoKSxcblx0XHRcdG5ld0hlaWdodDtcblxuXHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdC8vIFJlc3BvbnNpdmUgdmlkZW8gaXMgYmFzZWQgb24gd2lkdGg6IDEwMCUgYW5kIGhlaWdodDogMTAwJVxuXHRcdFx0aWYgKHQuaGVpZ2h0ID09PSAnMTAwJScpIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gcGFyc2VJbnQocGFyZW50V2lkdGggKiBuYXRpdmVIZWlnaHQgLyBuYXRpdmVXaWR0aCwgMTApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3SGVpZ2h0ID0gdC5oZWlnaHQgPj0gdC53aWR0aCA/IHBhcnNlSW50KHBhcmVudFdpZHRoIC8gYXNwZWN0UmF0aW8sIDEwKSA6IHBhcnNlSW50KHBhcmVudFdpZHRoICogYXNwZWN0UmF0aW8sIDEwKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3SGVpZ2h0ID0gbmF0aXZlSGVpZ2h0O1xuXHRcdH1cblxuXHRcdC8vIElmIHdlIHdlcmUgdW5hYmxlIHRvIGNvbXB1dGUgbmV3SGVpZ2h0LCBnZXQgdGhlIGNvbnRhaW5lciBoZWlnaHQgaW5zdGVhZFxuXHRcdGlmIChpc05hTihuZXdIZWlnaHQpKSB7XG5cdFx0XHRuZXdIZWlnaHQgPSBwYXJlbnRIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0aWYgKHQuY29udGFpbmVyLnBhcmVudCgpLmxlbmd0aCA+IDAgJiYgdC5jb250YWluZXIucGFyZW50KClbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYm9keScpIHsgLy8gJiYgdC5jb250YWluZXIuc2libGluZ3MoKS5jb3VudCA9PSAwKSB7XG5cdFx0XHRwYXJlbnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuXHRcdFx0bmV3SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXHRcdH1cblxuXHRcdGlmIChuZXdIZWlnaHQgJiYgcGFyZW50V2lkdGgpIHtcblxuXHRcdFx0Ly8gc2V0IG91dGVyIGNvbnRhaW5lciBzaXplXG5cdFx0XHR0LmNvbnRhaW5lclxuXHRcdFx0LndpZHRoKHBhcmVudFdpZHRoKVxuXHRcdFx0LmhlaWdodChuZXdIZWlnaHQpO1xuXG5cdFx0XHQvLyBzZXQgbmF0aXZlIDx2aWRlbz4gb3IgPGF1ZGlvPiBhbmQgc2hpbXNcblx0XHRcdHQuJG1lZGlhXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXG5cdFx0XHQvLyBpZiBzaGltIGlzIHJlYWR5LCBzZW5kIHRoZSBzaXplIHRvIHRoZSBlbWJlZGRlZCBwbHVnaW5cblx0XHRcdGlmICh0LmlzVmlkZW8pIHtcblx0XHRcdFx0aWYgKHQubWVkaWEuc2V0U2l6ZSkge1xuXHRcdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShwYXJlbnRXaWR0aCwgbmV3SGVpZ2h0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZXQgdGhlIGxheWVyc1xuXHRcdFx0dC5sYXllcnMuY2hpbGRyZW4oYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllcmApXG5cdFx0XHQud2lkdGgoJzEwMCUnKVxuXHRcdFx0LmhlaWdodCgnMTAwJScpO1xuXHRcdH1cblx0fVxuXG5cdHNldEZpbGxNb2RlICgpIHtcblx0XHRsZXQgdCA9IHRoaXMsXG5cdFx0XHRwYXJlbnQgPSB0Lm91dGVyQ29udGFpbmVyO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSByZXNwb25zaXZlIGF0dHJpYnV0ZXMgaW4gdGhlIGV2ZW50IHRoZXkgYXJlIHRoZXJlXG5cdFx0aWYgKHQuJG5vZGUuY3NzKCdoZWlnaHQnKSAhPT0gJ25vbmUnICYmIHQuJG5vZGUuY3NzKCdoZWlnaHQnKSAhPT0gdC5oZWlnaHQpIHtcblx0XHRcdHQuJG5vZGUuY3NzKCdoZWlnaHQnLCAnJyk7XG5cdFx0fVxuXHRcdGlmICh0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LXdpZHRoJykgIT09IHQud2lkdGgpIHtcblx0XHRcdHQuJG5vZGUuY3NzKCdtYXgtd2lkdGgnLCAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHQuJG5vZGUuY3NzKCdtYXgtaGVpZ2h0JykgIT09ICdub25lJyAmJiB0LiRub2RlLmNzcygnbWF4LWhlaWdodCcpICE9PSB0LmhlaWdodCkge1xuXHRcdFx0dC4kbm9kZS5jc3MoJ21heC1oZWlnaHQnLCAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlKSB7XG5cdFx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUuaGVpZ2h0ID09PSAnMTAwJScpIHtcblx0XHRcdFx0dC4kbm9kZVswXS5jdXJyZW50U3R5bGUuaGVpZ2h0ID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAodC4kbm9kZVswXS5jdXJyZW50U3R5bGUubWF4V2lkdGggPT09ICcxMDAlJykge1xuXHRcdFx0XHR0LiRub2RlWzBdLmN1cnJlbnRTdHlsZS5tYXhXaWR0aCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heEhlaWdodCA9PT0gJzEwMCUnKSB7XG5cdFx0XHRcdHQuJG5vZGVbMF0uY3VycmVudFN0eWxlLm1heEhlaWdodCA9ICcnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghcGFyZW50LndpZHRoKCkpIHtcblx0XHRcdHBhcmVudC5oZWlnaHQodC4kbWVkaWEud2lkdGgoKSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFwYXJlbnQuaGVpZ2h0KCkpIHtcblx0XHRcdHBhcmVudC5oZWlnaHQodC4kbWVkaWEuaGVpZ2h0KCkpO1xuXHRcdH1cblxuXHRcdGxldCBwYXJlbnRXaWR0aCA9IHBhcmVudC53aWR0aCgpLFxuXHRcdFx0cGFyZW50SGVpZ2h0ID0gcGFyZW50LmhlaWdodCgpO1xuXG5cdFx0dC5zZXREaW1lbnNpb25zKCcxMDAlJywgJzEwMCUnKTtcblxuXHRcdC8vIFRoaXMgcHJldmVudHMgYW4gaXNzdWUgd2hlbiBkaXNwbGF5aW5nIHBvc3RlclxuXHRcdHQuY29udGFpbmVyLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXIgaW1nYCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cblx0XHQvLyBjYWxjdWxhdGUgbmV3IHdpZHRoIGFuZCBoZWlnaHRcblx0XHRsZXRcblx0XHRcdHRhcmdldEVsZW1lbnQgPSB0LmNvbnRhaW5lci5maW5kKCdvYmplY3QsIGVtYmVkLCBpZnJhbWUsIHZpZGVvJyksXG5cdFx0XHRpbml0SGVpZ2h0ID0gdC5oZWlnaHQsXG5cdFx0XHRpbml0V2lkdGggPSB0LndpZHRoLFxuXHRcdFx0Ly8gc2NhbGUgdG8gdGhlIHRhcmdldCB3aWR0aFxuXHRcdFx0c2NhbGVYMSA9IHBhcmVudFdpZHRoLFxuXHRcdFx0c2NhbGVZMSA9IChpbml0SGVpZ2h0ICogcGFyZW50V2lkdGgpIC8gaW5pdFdpZHRoLFxuXHRcdFx0Ly8gc2NhbGUgdG8gdGhlIHRhcmdldCBoZWlnaHRcblx0XHRcdHNjYWxlWDIgPSAoaW5pdFdpZHRoICogcGFyZW50SGVpZ2h0KSAvIGluaXRIZWlnaHQsXG5cdFx0XHRzY2FsZVkyID0gcGFyZW50SGVpZ2h0LFxuXHRcdFx0Ly8gbm93IGZpZ3VyZSBvdXQgd2hpY2ggb25lIHdlIHNob3VsZCB1c2Vcblx0XHRcdGJTY2FsZU9uV2lkdGggPSBzY2FsZVgyID4gcGFyZW50V2lkdGggPT09IGZhbHNlLFxuXHRcdFx0ZmluYWxXaWR0aCA9IGJTY2FsZU9uV2lkdGggPyBNYXRoLmZsb29yKHNjYWxlWDEpIDogTWF0aC5mbG9vcihzY2FsZVgyKSxcblx0XHRcdGZpbmFsSGVpZ2h0ID0gYlNjYWxlT25XaWR0aCA/IE1hdGguZmxvb3Ioc2NhbGVZMSkgOiBNYXRoLmZsb29yKHNjYWxlWTIpO1xuXG5cdFx0aWYgKGJTY2FsZU9uV2lkdGgpIHtcblx0XHRcdHRhcmdldEVsZW1lbnQuaGVpZ2h0KGZpbmFsSGVpZ2h0KS53aWR0aChwYXJlbnRXaWR0aCk7XG5cdFx0XHRpZiAodC5tZWRpYS5zZXRTaXplKSB7XG5cdFx0XHRcdHQubWVkaWEuc2V0U2l6ZShwYXJlbnRXaWR0aCwgZmluYWxIZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRFbGVtZW50LmhlaWdodChwYXJlbnRIZWlnaHQpLndpZHRoKGZpbmFsV2lkdGgpO1xuXHRcdFx0aWYgKHQubWVkaWEuc2V0U2l6ZSkge1xuXHRcdFx0XHR0Lm1lZGlhLnNldFNpemUoZmluYWxXaWR0aCwgcGFyZW50SGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0YXJnZXRFbGVtZW50LmNzcyh7XG5cdFx0XHQnbWFyZ2luLWxlZnQnOiBNYXRoLmZsb29yKChwYXJlbnRXaWR0aCAtIGZpbmFsV2lkdGgpIC8gMiksXG5cdFx0XHQnbWFyZ2luLXRvcCc6IDBcblx0XHR9KTtcblx0fVxuXG5cdHNldERpbWVuc2lvbnMgKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHR0LmNvbnRhaW5lclxuXHRcdC53aWR0aCh3aWR0aClcblx0XHQuaGVpZ2h0KGhlaWdodCk7XG5cblx0XHR0LmxheWVycy5jaGlsZHJlbihgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyYClcblx0XHQud2lkdGgod2lkdGgpXG5cdFx0LmhlaWdodChoZWlnaHQpO1xuXHR9XG5cblx0c2V0Q29udHJvbHNTaXplICgpIHtcblx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHQvLyBza2lwIGNhbGN1bGF0aW9uIGlmIGhpZGRlblxuXHRcdGlmICghdC5jb250YWluZXIuaXMoJzp2aXNpYmxlJykgfHwgIXQucmFpbCB8fCAhdC5yYWlsLmxlbmd0aCB8fCAhdC5yYWlsLmlzKCc6dmlzaWJsZScpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0XG5cdFx0XHRyYWlsTWFyZ2luID0gcGFyc2VGbG9hdCh0LnJhaWwuY3NzKCdtYXJnaW4tbGVmdCcpKSArIHBhcnNlRmxvYXQodC5yYWlsLmNzcygnbWFyZ2luLXJpZ2h0JykpLFxuXHRcdFx0dG90YWxNYXJnaW4gPSBwYXJzZUZsb2F0KHQudG90YWwuY3NzKCdtYXJnaW4tbGVmdCcpKSArIHBhcnNlRmxvYXQodC50b3RhbC5jc3MoJ21hcmdpbi1yaWdodCcpKSB8fCAwLFxuXHRcdFx0c2libGluZ3NXaWR0aCA9IDBcblx0XHQ7XG5cblx0XHR0LnJhaWwuc2libGluZ3MoKS5lYWNoKChpbmRleCwgb2JqZWN0KSA9PiB7XG5cdFx0XHRzaWJsaW5nc1dpZHRoICs9IHBhcnNlRmxvYXQoJChvYmplY3QpLm91dGVyV2lkdGgodHJ1ZSkpO1xuXHRcdH0pO1xuXG5cdFx0c2libGluZ3NXaWR0aCArPSB0b3RhbE1hcmdpbiArIHJhaWxNYXJnaW4gKyAxO1xuXG5cdFx0Ly8gU3Vic3RyYWN0IHRoZSB3aWR0aCBvZiB0aGUgZmVhdHVyZSBzaWJsaW5ncyBmcm9tIHRpbWUgcmFpbFxuXHRcdHQucmFpbC53aWR0aCh0LmNvbnRyb2xzLndpZHRoKCkgLSBzaWJsaW5nc1dpZHRoKTtcblxuXHRcdHQuY29udGFpbmVyLnRyaWdnZXIoJ2NvbnRyb2xzcmVzaXplJyk7XG5cdH1cblxuXHRyZXNldFNpemUgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblx0XHQvLyB3ZWJraXQgaGFzIHRyb3VibGUgZG9pbmcgdGhpcyB3aXRob3V0IGEgZGVsYXlcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHQuc2V0UGxheWVyU2l6ZSh0LndpZHRoLCB0LmhlaWdodCk7XG5cdFx0XHR0LnNldENvbnRyb2xzU2l6ZSgpO1xuXHRcdH0sIDUwKTtcblx0fVxuXG5cdHNldFBvc3RlciAodXJsKSB7XG5cdFx0bGV0IHQgPSB0aGlzLFxuXHRcdFx0cG9zdGVyRGl2ID0gdC5jb250YWluZXIuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlcmApLFxuXHRcdFx0cG9zdGVySW1nID0gcG9zdGVyRGl2LmZpbmQoJ2ltZycpO1xuXG5cdFx0aWYgKHBvc3RlckltZy5sZW5ndGggPT09IDApIHtcblx0XHRcdHBvc3RlckltZyA9ICQoYDxpbWcgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1wb3N0ZXItaW1nXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGFsdD1cIlwiIC8+YClcblx0XHRcdC5hcHBlbmRUbyhwb3N0ZXJEaXYpO1xuXHRcdH1cblxuXHRcdHBvc3RlckltZy5hdHRyKCdzcmMnLCB1cmwpO1xuXHRcdHBvc3RlckRpdi5jc3MoeydiYWNrZ3JvdW5kLWltYWdlJzogYHVybChcIiR7dXJsfVwiKWB9KTtcblx0fVxuXG5cdGNoYW5nZVNraW4gKGNsYXNzTmFtZSkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdHQuY29udGFpbmVyWzBdLmNsYXNzTmFtZSA9IGAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXIgJHtjbGFzc05hbWV9YDtcblx0XHR0LnNldFBsYXllclNpemUodC53aWR0aCwgdC5oZWlnaHQpO1xuXHRcdHQuc2V0Q29udHJvbHNTaXplKCk7XG5cdH1cblxuXHRnbG9iYWxCaW5kIChldmVudHMsIGRhdGEsIGNhbGxiYWNrKSB7XG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdGRvYyA9IHQubm9kZSA/IHQubm9kZS5vd25lckRvY3VtZW50IDogZG9jdW1lbnRcblx0XHQ7XG5cblx0XHRldmVudHMgPSBzcGxpdEV2ZW50cyhldmVudHMsIHQuaWQpO1xuXHRcdGlmIChldmVudHMuZCkge1xuXHRcdFx0JChkb2MpLm9uKGV2ZW50cy5kLCBkYXRhLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGlmIChldmVudHMudykge1xuXHRcdFx0JCh3aW5kb3cpLm9uKGV2ZW50cy53LCBkYXRhLCBjYWxsYmFjayk7XG5cdFx0fVxuXHR9XG5cblx0Z2xvYmFsVW5iaW5kIChldmVudHMsIGNhbGxiYWNrKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0ZG9jID0gdC5ub2RlID8gdC5ub2RlLm93bmVyRG9jdW1lbnQgOiBkb2N1bWVudFxuXHRcdDtcblxuXHRcdGV2ZW50cyA9IHNwbGl0RXZlbnRzKGV2ZW50cywgdC5pZCk7XG5cdFx0aWYgKGV2ZW50cy5kKSB7XG5cdFx0XHQkKGRvYykub2ZmKGV2ZW50cy5kLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGlmIChldmVudHMudykge1xuXHRcdFx0JCh3aW5kb3cpLm9mZihldmVudHMudywgY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXG5cdGJ1aWxkcG9zdGVyIChwbGF5ZXIsIGNvbnRyb2xzLCBsYXllcnMsIG1lZGlhKSB7XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0cG9zdGVyID0gJChgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXBvc3RlciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPjwvZGl2PmApLmFwcGVuZFRvKGxheWVycyksXG5cdFx0XHRwb3N0ZXJVcmwgPSBwbGF5ZXIuJG1lZGlhLmF0dHIoJ3Bvc3RlcicpXG5cdFx0O1xuXG5cdFx0Ly8gcHJpb3JpdHkgZ29lcyB0byBvcHRpb24gKHRoaXMgaXMgdXNlZnVsIGlmIHlvdSBuZWVkIHRvIHN1cHBvcnQgaU9TIDMueCAoaU9TIGNvbXBsZXRlbHkgZmFpbHMgd2l0aCBwb3N0ZXIpXG5cdFx0aWYgKHBsYXllci5vcHRpb25zLnBvc3RlciAhPT0gJycpIHtcblx0XHRcdHBvc3RlclVybCA9IHBsYXllci5vcHRpb25zLnBvc3Rlcjtcblx0XHR9XG5cblx0XHQvLyBzZWNvbmQsIHRyeSB0aGUgcmVhbCBwb3N0ZXJcblx0XHRpZiAocG9zdGVyVXJsKSB7XG5cdFx0XHR0LnNldFBvc3Rlcihwb3N0ZXJVcmwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwb3N0ZXIuaGlkZSgpO1xuXHRcdH1cblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRwb3N0ZXIuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdGlmIChwbGF5ZXIub3B0aW9ucy5zaG93UG9zdGVyV2hlbkVuZGVkICYmIHBsYXllci5vcHRpb25zLmF1dG9SZXdpbmQpIHtcblx0XHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0XHRwb3N0ZXIuc2hvdygpO1xuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdGJ1aWxkb3ZlcmxheXMgKHBsYXllciwgY29udHJvbHMsIGxheWVycywgbWVkaWEpIHtcblxuXHRcdGlmICghcGxheWVyLmlzVmlkZW8pIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXRcblx0XHRcdHQgPSB0aGlzLFxuXHRcdFx0bG9hZGluZyA9XG5cdFx0XHRcdCQoYDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5ICR7dC5vcHRpb25zLmNsYXNzUHJlZml4fWxheWVyXCI+YCArXG5cdFx0XHRcdFx0YDxkaXYgY2xhc3M9XCIke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWxvYWRpbmdcIj5gICtcblx0XHRcdFx0XHRcdGA8c3BhbiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktbG9hZGluZy1iZy1pbWdcIj48L3NwYW4+YCArXG5cdFx0XHRcdFx0YDwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmhpZGUoKSAvLyBzdGFydCBvdXQgaGlkZGVuXG5cdFx0XHRcdC5hcHBlbmRUbyhsYXllcnMpLFxuXHRcdFx0ZXJyb3IgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllclwiPmAgK1xuXHRcdFx0XHRcdGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheS1lcnJvclwiPjwvZGl2PmAgK1xuXHRcdFx0XHRgPC9kaXY+YClcblx0XHRcdFx0LmhpZGUoKSAvLyBzdGFydCBvdXQgaGlkZGVuXG5cdFx0XHRcdC5hcHBlbmRUbyhsYXllcnMpLFxuXHRcdFx0Ly8gdGhpcyBuZWVkcyB0byBjb21lIGxhc3Qgc28gaXQncyBvbiB0b3Bcblx0XHRcdGJpZ1BsYXkgPVxuXHRcdFx0XHQkKGA8ZGl2IGNsYXNzPVwiJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9b3ZlcmxheSAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1sYXllciAke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LXBsYXlcIj5gICtcblx0XHRcdFx0XHRgPGRpdiBjbGFzcz1cIiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW92ZXJsYXktYnV0dG9uXCIgcm9sZT1cImJ1dHRvblwiIGAgK1xuXHRcdFx0XHRcdFx0YGFyaWEtbGFiZWw9XCIke2kxOG4udCgnbWVqcy5wbGF5Jyl9XCIgYXJpYS1wcmVzc2VkPVwiZmFsc2VcIj5gICtcblx0XHRcdFx0XHRgPC9kaXY+YCArXG5cdFx0XHRcdGA8L2Rpdj5gKVxuXHRcdFx0XHQuYXBwZW5kVG8obGF5ZXJzKVxuXHRcdFx0XHQub24oJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRcdC8vIFJlbW92ZWQgJ3RvdWNoc3RhcnQnIGR1ZSBpc3N1ZXMgb24gU2Ftc3VuZyBBbmRyb2lkIGRldmljZXMgd2hlcmUgYSB0YXAgb24gYmlnUGxheVxuXHRcdFx0XHRcdC8vIHN0YXJ0ZWQgYW5kIGltbWVkaWF0ZWx5IHN0b3BwZWQgdGhlIHZpZGVvXG5cdFx0XHRcdFx0aWYgKHQub3B0aW9ucy5jbGlja1RvUGxheVBhdXNlKSB7XG5cblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRidXR0b24gPSB0LiRtZWRpYS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYClcblx0XHRcdFx0XHRcdFx0LmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWJ1dHRvbmApLFxuXHRcdFx0XHRcdFx0XHRwcmVzc2VkID0gYnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcpXG5cdFx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRcdGlmIChtZWRpYS5wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGxheSgpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWVkaWEucGF1c2UoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnV0dG9uLmF0dHIoJ2FyaWEtcHJlc3NlZCcsICEhcHJlc3NlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdC8vIGlmICh0Lm9wdGlvbnMuc3VwcG9ydFZSIHx8ICh0Lm1lZGlhLnJlbmRlcmVyTmFtZSAhPT0gbnVsbCAmJiB0Lm1lZGlhLnJlbmRlcmVyTmFtZS5tYXRjaCgvKHlvdXR1YmV8ZmFjZWJvb2spLykpKSB7XG5cdFx0aWYgKHQubWVkaWEucmVuZGVyZXJOYW1lICE9PSBudWxsICYmIHQubWVkaWEucmVuZGVyZXJOYW1lLm1hdGNoKC8oeW91dHViZXxmYWNlYm9vaykvKSkge1xuXHRcdFx0YmlnUGxheS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0Ly8gc2hvdy9oaWRlIGJpZyBwbGF5IGJ1dHRvblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdFx0ZXJyb3IuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGxvYWRpbmcuaGlkZSgpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuaGlkZSgpO1xuXHRcdFx0ZXJyb3IuaGlkZSgpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3NlZWtpbmcnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLnNob3coKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLnNob3coKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdzZWVrZWQnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRtZWRpYS5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsICgpID0+IHtcblx0XHRcdGJpZ1BsYXkuc2hvdygpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmcnLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLnNob3coKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLnNob3coKTtcblx0XHR9LCBmYWxzZSk7XG5cblxuXHRcdC8vIHNob3cvaGlkZSBsb2FkaW5nXG5cdFx0bWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkZGF0YScsICgpID0+IHtcblx0XHRcdC8vIGZvciBzb21lIHJlYXNvbiBDaHJvbWUgaXMgZmlyaW5nIHRoaXMgZXZlbnRcblx0XHRcdC8vaWYgKG1lanMuTWVkaWFGZWF0dXJlcy5pc0Nocm9tZSAmJiBtZWRpYS5nZXRBdHRyaWJ1dGUgJiYgbWVkaWEuZ2V0QXR0cmlidXRlKCdwcmVsb2FkJykgPT09ICdub25lJylcblx0XHRcdC8vXHRyZXR1cm47XG5cblx0XHRcdGxvYWRpbmcuc2hvdygpO1xuXHRcdFx0Y29udHJvbHMuZmluZChgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fXRpbWUtYnVmZmVyaW5nYCkuc2hvdygpO1xuXHRcdFx0Ly8gRmlyaW5nIHRoZSAnY2FucGxheScgZXZlbnQgYWZ0ZXIgYSB0aW1lb3V0IHdoaWNoIGlzbid0IGdldHRpbmcgZmlyZWQgb24gc29tZSBBbmRyb2lkIDQuMSBkZXZpY2VzXG5cdFx0XHQvLyAoaHR0cHM6Ly9naXRodWIuY29tL2pvaG5keWVyL21lZGlhZWxlbWVudC9pc3N1ZXMvMTMwNSlcblx0XHRcdGlmIChJU19BTkRST0lEKSB7XG5cdFx0XHRcdG1lZGlhLmNhbnBsYXlUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoXG5cdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG5cdFx0XHRcdFx0XHRcdGxldCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdFx0XHRldnQuaW5pdEV2ZW50KCdjYW5wbGF5JywgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBtZWRpYS5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgMzAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpO1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCAoKSA9PiB7XG5cdFx0XHRsb2FkaW5nLmhpZGUoKTtcblx0XHRcdGNvbnRyb2xzLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH10aW1lLWJ1ZmZlcmluZ2ApLmhpZGUoKTtcblx0XHRcdC8vIENsZWFyIHRpbWVvdXQgaW5zaWRlICdsb2FkZWRkYXRhJyB0byBwcmV2ZW50ICdjYW5wbGF5JyBmcm9tIGZpcmluZyB0d2ljZVxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1lZGlhLmNhbnBsYXlUaW1lb3V0KTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHQvLyBlcnJvciBoYW5kbGluZ1xuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcblx0XHRcdHQuX2hhbmRsZUVycm9yKGUpO1xuXHRcdFx0bG9hZGluZy5oaWRlKCk7XG5cdFx0XHRiaWdQbGF5LmhpZGUoKTtcblx0XHRcdGVycm9yLnNob3coKTtcblx0XHRcdGVycm9yLmZpbmQoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1vdmVybGF5LWVycm9yYCkuaHRtbChlLm1lc3NhZ2UpO1xuXHRcdH0sIGZhbHNlKTtcblxuXHRcdG1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0dC5vbmtleWRvd24ocGxheWVyLCBtZWRpYSwgZSk7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0YnVpbGRrZXlib2FyZCAocGxheWVyLCBjb250cm9scywgbGF5ZXJzLCBtZWRpYSkge1xuXG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0dC5jb250YWluZXIua2V5ZG93bigoKSA9PiB7XG5cdFx0XHR0LmtleWJvYXJkQWN0aW9uID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdC8vIGxpc3RlbiBmb3Iga2V5IHByZXNzZXNcblx0XHR0Lmdsb2JhbEJpbmQoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcblx0XHRcdGxldCAkY29udGFpbmVyID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoYC4ke3Qub3B0aW9ucy5jbGFzc1ByZWZpeH1jb250YWluZXJgKTtcblx0XHRcdHBsYXllci5oYXNGb2N1cyA9ICRjb250YWluZXIubGVuZ3RoICE9PSAwICYmXG5cdFx0XHRcdCRjb250YWluZXIuYXR0cignaWQnKSA9PT0gcGxheWVyLiRtZWRpYS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkuYXR0cignaWQnKTtcblx0XHRcdHJldHVybiB0Lm9ua2V5ZG93bihwbGF5ZXIsIG1lZGlhLCBldmVudCk7XG5cdFx0fSk7XG5cblxuXHRcdC8vIGNoZWNrIGlmIHNvbWVvbmUgY2xpY2tlZCBvdXRzaWRlIGEgcGxheWVyIHJlZ2lvbiwgdGhlbiBraWxsIGl0cyBmb2N1c1xuXHRcdHQuZ2xvYmFsQmluZCgnY2xpY2snLCAoZXZlbnQpID0+IHtcblx0XHRcdHBsYXllci5oYXNGb2N1cyA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KGAuJHt0Lm9wdGlvbnMuY2xhc3NQcmVmaXh9Y29udGFpbmVyYCkubGVuZ3RoICE9PSAwO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRvbmtleWRvd24gKHBsYXllciwgbWVkaWEsIGUpIHtcblxuXHRcdGlmIChwbGF5ZXIuaGFzRm9jdXMgJiYgcGxheWVyLm9wdGlvbnMuZW5hYmxlS2V5Ym9hcmQpIHtcblx0XHRcdC8vIGZpbmQgYSBtYXRjaGluZyBrZXlcblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IHBsYXllci5vcHRpb25zLmtleUFjdGlvbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQga2V5QWN0aW9uID0gcGxheWVyLm9wdGlvbnMua2V5QWN0aW9uc1tpXTtcblxuXHRcdFx0XHRmb3IgKGxldCBqID0gMCwgamwgPSBrZXlBY3Rpb24ua2V5cy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0ga2V5QWN0aW9uLmtleXNbal0pIHtcblx0XHRcdFx0XHRcdGtleUFjdGlvbi5hY3Rpb24ocGxheWVyLCBtZWRpYSwgZS5rZXlDb2RlLCBlKTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHBsYXkgKCkge1xuXHRcdGxldCB0ID0gdGhpcztcblxuXHRcdC8vIG9ubHkgbG9hZCBpZiB0aGUgY3VycmVudCB0aW1lIGlzIDAgdG8gZW5zdXJlIHByb3BlciBwbGF5aW5nXG5cdFx0aWYgKHQubWVkaWEuZ2V0Q3VycmVudFRpbWUoKSA8PSAwKSB7XG5cdFx0XHR0LmxvYWQoKTtcblx0XHR9XG5cdFx0dC5tZWRpYS5wbGF5KCk7XG5cdH1cblxuXHRwYXVzZSAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMubWVkaWEucGF1c2UoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0fVxuXHR9XG5cblx0bG9hZCAoKSB7XG5cdFx0bGV0IHQgPSB0aGlzO1xuXG5cdFx0aWYgKCF0LmlzTG9hZGVkKSB7XG5cdFx0XHR0Lm1lZGlhLmxvYWQoKTtcblx0XHR9XG5cblx0XHR0LmlzTG9hZGVkID0gdHJ1ZTtcblx0fVxuXG5cdHNldE11dGVkIChtdXRlZCkge1xuXHRcdHRoaXMubWVkaWEuc2V0TXV0ZWQobXV0ZWQpO1xuXHR9XG5cblx0c2V0Q3VycmVudFRpbWUgKHRpbWUpIHtcblx0XHR0aGlzLm1lZGlhLnNldEN1cnJlbnRUaW1lKHRpbWUpO1xuXHR9XG5cblx0Z2V0Q3VycmVudFRpbWUgKCkge1xuXHRcdHJldHVybiB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xuXHR9XG5cblx0c2V0Vm9sdW1lICh2b2x1bWUpIHtcblx0XHR0aGlzLm1lZGlhLnNldFZvbHVtZSh2b2x1bWUpO1xuXHR9XG5cblx0Z2V0Vm9sdW1lICgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZWRpYS52b2x1bWU7XG5cdH1cblxuXHRzZXRTcmMgKHNyYykge1xuXHRcdHRoaXMubWVkaWEuc2V0U3JjKHNyYyk7XG5cdH1cblxuXHRyZW1vdmUgKCkge1xuXG5cdFx0bGV0XG5cdFx0XHR0ID0gdGhpcyxcblx0XHRcdHJlbmRlcmVyTmFtZSA9IHQubWVkaWEucmVuZGVyZXJOYW1lXG5cdFx0O1xuXG5cdFx0Ly8gaW52b2tlIGZlYXR1cmVzIGNsZWFudXBcblx0XHRmb3IgKGxldCBmZWF0dXJlSW5kZXggaW4gdC5vcHRpb25zLmZlYXR1cmVzKSB7XG5cdFx0XHRsZXQgZmVhdHVyZSA9IHQub3B0aW9ucy5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuXHRcdFx0aWYgKHRbYGNsZWFuJHtmZWF0dXJlfWBdKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dFtgY2xlYW4ke2ZlYXR1cmV9YF0odCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHQvLyBAdG9kbzogcmVwb3J0IGNvbnRyb2wgZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBlcnJvciBjbGVhbmluZyAke2ZlYXR1cmV9YCwgZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZXNldCBkaW1lbnNpb25zXG5cdFx0dC4kbm9kZS5jc3Moe1xuXHRcdFx0d2lkdGg6IHQuJG5vZGUuYXR0cignd2lkdGgnKSB8fCAnYXV0bycsXG5cdFx0XHRoZWlnaHQ6IHQuJG5vZGUuYXR0cignaGVpZ2h0JykgfHwgJ2F1dG8nXG5cdFx0fSk7XG5cblx0XHQvLyBncmFiIHZpZGVvIGFuZCBwdXQgaXQgYmFjayBpbiBwbGFjZVxuXHRcdGlmICghdC5pc0R5bmFtaWMpIHtcblx0XHRcdHQuJG1lZGlhLnByb3AoJ2NvbnRyb2xzJywgdHJ1ZSk7XG5cdFx0XHQvLyBkZXRhY2ggZXZlbnRzIGZyb20gdGhlIHZpZGVvXG5cdFx0XHQvLyBAdG9kbzogZGV0YWNoIGV2ZW50IGxpc3RlbmVycyBiZXR0ZXIgdGhhbiB0aGlzOyBhbHNvIGRldGFjaCBPTkxZIHRoZSBldmVudHMgYXR0YWNoZWQgYnkgdGhpcyBwbHVnaW4hXG5cdFx0XHR0LiRub2RlLmF0dHIoJ2lkJywgdC4kbm9kZS5hdHRyKCdpZCcpLnJlcGxhY2UoYF8ke3JlbmRlcmVyTmFtZX1gLCAnJykpO1xuXHRcdFx0dC4kbm9kZS5jbG9uZSgpLmluc2VydEJlZm9yZSh0LmNvbnRhaW5lcikuc2hvdygpO1xuXHRcdFx0dC4kbm9kZS5yZW1vdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC4kbm9kZS5pbnNlcnRCZWZvcmUodC5jb250YWluZXIpO1xuXHRcdH1cblxuXHRcdHQubWVkaWEucmVtb3ZlKCk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIHBsYXllciBmcm9tIHRoZSBtZWpzLnBsYXllcnMgb2JqZWN0IHNvIHRoYXQgcGF1c2VPdGhlclBsYXllcnMgZG9lc24ndCBibG93IHVwIHdoZW4gdHJ5aW5nIHRvXG5cdFx0Ly8gcGF1c2UgYSBub24gZXhpc3RlbnQgRmxhc2ggQVBJLlxuXHRcdGRlbGV0ZSBtZWpzLnBsYXllcnNbdC5pZF07XG5cblx0XHRpZiAodHlwZW9mIHQuY29udGFpbmVyID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dC5jb250YWluZXIucHJldihgLiR7dC5vcHRpb25zLmNsYXNzUHJlZml4fW9mZnNjcmVlbmApLnJlbW92ZSgpO1xuXHRcdFx0dC5jb250YWluZXIucmVtb3ZlKCk7XG5cdFx0fVxuXHRcdHQuZ2xvYmFsVW5iaW5kKCk7XG5cdFx0ZGVsZXRlIHQubm9kZS5wbGF5ZXI7XG5cdH1cbn1cblxud2luZG93Lk1lZGlhRWxlbWVudFBsYXllciA9IE1lZGlhRWxlbWVudFBsYXllcjtcblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFFbGVtZW50UGxheWVyO1xuXG4vLyB0dXJuIGludG8gcGx1Z2luXG4oKCQpID0+IHtcblxuXHRpZiAodHlwZW9mICQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0JC5mbi5tZWRpYWVsZW1lbnRwbGF5ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdFx0aWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0bGV0IHBsYXllciA9ICQodGhpcykuZGF0YSgnbWVkaWFlbGVtZW50cGxheWVyJyk7XG5cdFx0XHRcdFx0aWYgKHBsYXllcikge1xuXHRcdFx0XHRcdFx0cGxheWVyLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZURhdGEoJ21lZGlhZWxlbWVudHBsYXllcicpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnbWVkaWFlbGVtZW50cGxheWVyJywgbmV3IE1lZGlhRWxlbWVudFBsYXllcih0aGlzLCBvcHRpb25zKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdCQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0XHRcdC8vIGF1dG8gZW5hYmxlIHVzaW5nIEpTT04gYXR0cmlidXRlXG5cdFx0XHQkKGAuJHtjb25maWcuY2xhc3NQcmVmaXh9cGxheWVyYCkubWVkaWFlbGVtZW50cGxheWVyKCk7XG5cdFx0fSk7XG5cdH1cblxufSkobWVqcy4kKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbmV4cG9ydCBjb25zdCBOQVYgPSB3aW5kb3cubmF2aWdhdG9yO1xuZXhwb3J0IGNvbnN0IFVBID0gTkFWLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgSVNfSVBBRCA9IChVQS5tYXRjaCgvaXBhZC9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSVBIT05FID0gKFVBLm1hdGNoKC9pcGhvbmUvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lPUyA9IElTX0lQSE9ORSB8fCBJU19JUEFEO1xuZXhwb3J0IGNvbnN0IElTX0FORFJPSUQgPSAoVUEubWF0Y2goL2FuZHJvaWQvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lFID0gKE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ21pY3Jvc29mdCcpIHx8IE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkubWF0Y2goL3RyaWRlbnQvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19DSFJPTUUgPSAoVUEubWF0Y2goL2Nocm9tZS9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0ZJUkVGT1ggPSAoVUEubWF0Y2goL2ZpcmVmb3gvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19TQUZBUkkgPSAoVUEubWF0Y2goL3NhZmFyaS9naSkgIT09IG51bGwpICYmICFJU19DSFJPTUU7XG5leHBvcnQgY29uc3QgSVNfU1RPQ0tfQU5EUk9JRCA9IChVQS5tYXRjaCgvXm1vemlsbGFcXC9cXGQrXFwuXFxkK1xcc1xcKGxpbnV4O1xcc3U7L2dpKSAhPT0gbnVsbCk7XG5cbmV4cG9ydCBjb25zdCBIQVNfVE9VQ0ggPSAhISgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKTtcbmV4cG9ydCBjb25zdCBIQVNfTVNFID0gKCdNZWRpYVNvdXJjZScgaW4gd2luZG93KTtcbmV4cG9ydCBjb25zdCBTVVBQT1JUX1BPSU5URVJfRVZFTlRTID0gKCgpID0+IHtcblx0bGV0XG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKSxcblx0XHRkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLFxuXHRcdHN1cHBvcnRzXG5cdDtcblxuXHRpZiAoISgncG9pbnRlckV2ZW50cycgaW4gZWxlbWVudC5zdHlsZSkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG5cdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICd4Jztcblx0ZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXHRzdXBwb3J0cyA9IGdldENvbXB1dGVkU3R5bGUgJiYgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAnJykucG9pbnRlckV2ZW50cyA9PT0gJ2F1dG8nO1xuXHRkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdHJldHVybiAhIXN1cHBvcnRzO1xufSkoKTtcblxuLy8gZm9yIElFXG5sZXQgaHRtbDVFbGVtZW50cyA9IFsnc291cmNlJywgJ3RyYWNrJywgJ2F1ZGlvJywgJ3ZpZGVvJ10sIHZpZGVvO1xuXG5mb3IgKGxldCBpID0gMCwgaWwgPSBodG1sNUVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0dmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGh0bWw1RWxlbWVudHNbaV0pO1xufVxuXG4vLyBUZXN0IGlmIE1lZGlhIFNvdXJjZSBFeHRlbnNpb25zIGFyZSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuZXhwb3J0IGNvbnN0IFNVUFBPUlRTX01FRElBX1RBRyA9ICh2aWRlby5jYW5QbGF5VHlwZSAhPT0gdW5kZWZpbmVkIHx8IEhBU19NU0UpO1xuXG4vLyBUZXN0IGlmIGJyb3dzZXJzIHN1cHBvcnQgSExTIG5hdGl2ZWx5IChyaWdodCBub3cgU2FmYXJpLCBBbmRyb2lkJ3MgQ2hyb21lIGFuZCBTdG9jayBicm93c2VycywgYW5kIE1TIEVkZ2UpXG5leHBvcnQgY29uc3QgU1VQUE9SVFNfTkFUSVZFX0hMUyA9IChJU19TQUZBUkkgfHwgKElTX0FORFJPSUQgJiYgKElTX0NIUk9NRSB8fCBJU19TVE9DS19BTkRST0lEKSkgfHwgKElTX0lFICYmIFVBLm1hdGNoKC9lZGdlL2dpKSAhPT0gbnVsbCkpO1xuXG4vLyBEZXRlY3QgbmF0aXZlIEphdmFTY3JpcHQgZnVsbHNjcmVlbiAoU2FmYXJpL0ZpcmVmb3ggb25seSwgQ2hyb21lIHN0aWxsIGZhaWxzKVxuXG4vLyBpT1NcbmxldCBoYXNpT1NGdWxsU2NyZWVuID0gKHZpZGVvLndlYmtpdEVudGVyRnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gVzNDXG5sZXQgaGFzTmF0aXZlRnVsbHNjcmVlbiA9ICh2aWRlby5yZXF1ZXN0RnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gT1MgWCAxMC41IGNhbid0IGRvIHRoaXMgZXZlbiBpZiBpdCBzYXlzIGl0IGNhbiA6KFxuaWYgKGhhc2lPU0Z1bGxTY3JlZW4gJiYgVUEubWF0Y2goL21hYyBvcyB4IDEwXzUvaSkpIHtcblx0aGFzTmF0aXZlRnVsbHNjcmVlbiA9IGZhbHNlO1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbi8vIHdlYmtpdC9maXJlZm94L0lFMTErXG5sZXQgaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcbmxldCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLm1velJlcXVlc3RGdWxsU2NyZWVuICE9PSB1bmRlZmluZWQpO1xubGV0IGhhc01zTmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby5tc1JlcXVlc3RGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG5sZXQgaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiB8fCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuIHx8IGhhc01zTmF0aXZlRnVsbFNjcmVlbik7XG5sZXQgbmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbjtcblxubGV0IGZ1bGxTY3JlZW5FdmVudE5hbWUgPSAnJztcbmxldCBpc0Z1bGxTY3JlZW4sIHJlcXVlc3RGdWxsU2NyZWVuLCBjYW5jZWxGdWxsU2NyZWVuO1xuXG4vLyBFbmFibGVkP1xuaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0bmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRW5hYmxlZDtcbn0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdG5hdGl2ZUZ1bGxTY3JlZW5FbmFibGVkID0gZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZDtcbn1cblxuaWYgKElTX0NIUk9NRSkge1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbmlmIChoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbikge1xuXG5cdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICdtb3pmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ01TRnVsbHNjcmVlbkNoYW5nZSc7XG5cdH1cblxuXHRpc0Z1bGxTY3JlZW4gPSAoKSA9PiAge1xuXHRcdGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LndlYmtpdElzRnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbDtcblx0XHR9XG5cdH07XG5cblx0cmVxdWVzdEZ1bGxTY3JlZW4gPSAoZWwpID0+IHtcblxuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSBpZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHR9IGVsc2UgaWYgKGhhc01zTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fTtcblxuXHRjYW5jZWxGdWxsU2NyZWVuID0gKCkgPT4ge1xuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG5cblx0XHR9IGVsc2UgaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG5cblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBIQVNfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNOYXRpdmVGdWxsc2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19XRUJLSVRfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc01zTmF0aXZlRnVsbFNjcmVlbjtcbmV4cG9ydCBjb25zdCBIQVNfSU9TX0ZVTExTQ1JFRU4gPSBoYXNpT1NGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOID0gaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX05BVElWRV9GVUxMU0NSRUVOX0VOQUJMRUQgPSBuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZDtcbmV4cG9ydCBjb25zdCBGVUxMU0NSRUVOX0VWRU5UX05BTUUgPSBmdWxsU2NyZWVuRXZlbnROYW1lO1xuXG5leHBvcnQge2lzRnVsbFNjcmVlbiwgcmVxdWVzdEZ1bGxTY3JlZW4sIGNhbmNlbEZ1bGxTY3JlZW59O1xuXG5tZWpzLkZlYXR1cmVzID0gbWVqcy5GZWF0dXJlcyB8fCB7fTtcbm1lanMuRmVhdHVyZXMuaXNpUGFkID0gSVNfSVBBRDtcbm1lanMuRmVhdHVyZXMuaXNpUGhvbmUgPSBJU19JUEhPTkU7XG5tZWpzLkZlYXR1cmVzLmlzaU9TID0gbWVqcy5GZWF0dXJlcy5pc2lQaG9uZSB8fCBtZWpzLkZlYXR1cmVzLmlzaVBhZDtcbm1lanMuRmVhdHVyZXMuaXNBbmRyb2lkID0gSVNfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaXNJRSA9IElTX0lFO1xubWVqcy5GZWF0dXJlcy5pc0Nocm9tZSA9IElTX0NIUk9NRTtcbm1lanMuRmVhdHVyZXMuaXNGaXJlZm94ID0gSVNfRklSRUZPWDtcbm1lanMuRmVhdHVyZXMuaXNTYWZhcmkgPSBJU19TQUZBUkk7XG5tZWpzLkZlYXR1cmVzLmlzU3RvY2tBbmRyb2lkID0gSVNfU1RPQ0tfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaGFzVG91Y2ggPSBIQVNfVE9VQ0g7XG5tZWpzLkZlYXR1cmVzLmhhc01TRSA9IEhBU19NU0U7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTWVkaWFUYWcgPSBTVVBQT1JUU19NRURJQV9UQUc7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTmF0aXZlSExTID0gU1VQUE9SVFNfTkFUSVZFX0hMUztcblxubWVqcy5GZWF0dXJlcy5zdXBwb3J0c1BvaW50ZXJFdmVudHMgPSBTVVBQT1JUX1BPSU5URVJfRVZFTlRTO1xubWVqcy5GZWF0dXJlcy5oYXNpT1NGdWxsU2NyZWVuID0gSEFTX0lPU19GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNOYXRpdmVGdWxsc2NyZWVuID0gSEFTX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuID0gSEFTX1dFQktJVF9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzTW96TmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc01zTmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSBIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMubmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBIQVNfTkFUSVZFX0ZVTExTQ1JFRU5fRU5BQkxFRDtcbm1lanMuRmVhdHVyZXMuZnVsbFNjcmVlbkV2ZW50TmFtZSA9IEZVTExTQ1JFRU5fRVZFTlRfTkFNRTtcbm1lanMuRmVhdHVyZXMuaXNGdWxsU2NyZWVuID0gaXNGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5yZXF1ZXN0RnVsbFNjcmVlbiA9IHJlcXVlc3RGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5jYW5jZWxGdWxsU2NyZWVuID0gY2FuY2VsRnVsbFNjcmVlbjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEByZXR1cm4ge0V2ZW50fE9iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50IChldmVudE5hbWUsIHRhcmdldCkge1xuXG5cdGlmICh0eXBlb2YgZXZlbnROYW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignRXZlbnQgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgZXZlbnQ7XG5cblx0aWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG5cdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCBmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnQgPSB7fTtcblx0XHRldmVudC50eXBlID0gZXZlbnROYW1lO1xuXHRcdGV2ZW50LnRhcmdldCA9IHRhcmdldDtcblx0XHRldmVudC5jYW5jZWxlYWJsZSA9IHRydWU7XG5cdFx0ZXZlbnQuYnViYmFibGUgPSBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBldmVudDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXHRpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgZmFsc2UpO1xuXHR9IGVsc2UgaWYgKG9iai5hdHRhY2hFdmVudCkge1xuXHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdID0gZm47XG5cdFx0b2JqW2Ake3R5cGV9JHtmbn1gXSA9ICgpID0+IHtcblx0XHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdKHdpbmRvdy5ldmVudCk7XG5cdFx0fTtcblx0XHRvYmouYXR0YWNoRXZlbnQoYG9uJHt0eXBlfWAsIG9ialtgJHt0eXBlfSR7Zm59YF0pO1xuXHR9XG5cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXG5cdGlmIChvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuXHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAob2JqLmRldGFjaEV2ZW50KSB7XG5cdFx0b2JqLmRldGFjaEV2ZW50KGBvbiR7dHlwZX1gLCBvYmpbYCR7dHlwZX0ke2ZufWBdKTtcblx0XHRvYmpbYCR7dHlwZX0ke2ZufWBdID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0YXJnZXROb2RlIGFwcGVhcnMgYWZ0ZXIgc291cmNlTm9kZSBpbiB0aGUgZG9tLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc291cmNlTm9kZSAtIHRoZSBzb3VyY2Ugbm9kZSBmb3IgY29tcGFyaXNvblxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0Tm9kZSAtIHRoZSBub2RlIHRvIGNvbXBhcmUgYWdhaW5zdCBzb3VyY2VOb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBZnRlciAoc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSkge1xuXHRyZXR1cm4gISEoXG5cdFx0c291cmNlTm9kZSAmJlxuXHRcdHRhcmdldE5vZGUgJiZcblx0XHRzb3VyY2VOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldE5vZGUpICYmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HXG5cdCk7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5jcmVhdGVFdmVudCA9IGNyZWF0ZUV2ZW50O1xubWVqcy5VdGlscy5yZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50O1xubWVqcy5VdGlscy5pc05vZGVBZnRlciA9IGlzTm9kZUFmdGVyOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUhUTUwgKGlucHV0KSB7XG5cblx0aWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHBhc3NlZCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRjb25zdCBtYXAgPSB7XG5cdFx0JyYnOiAnJmFtcDsnLFxuXHRcdCc8JzogJyZsdDsnLFxuXHRcdCc+JzogJyZndDsnLFxuXHRcdCdcIic6ICcmcXVvdDsnXG5cdH07XG5cblx0cmV0dXJuIGlucHV0LnJlcGxhY2UoL1smPD5cIl0vZywgKGMpID0+IHtcblx0XHRyZXR1cm4gbWFwW2NdO1xuXHR9KTtcbn1cblxuLy8gdGFrZW4gZnJvbSB1bmRlcnNjb3JlXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UgKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG5cblx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygd2FpdCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgbnVtZXJpYyB2YWx1ZScpO1xuXHR9XG5cblx0bGV0IHRpbWVvdXQ7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0bGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdGxldCBsYXRlciA9ICgpID0+IHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGxldCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cblx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBjb250YWlucyBhbnkgZWxlbWVudHNcbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjc5OTE1L2hvdy1kby1pLXRlc3QtZm9yLWFuLWVtcHR5LWphdmFzY3JpcHQtb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdEVtcHR5IChpbnN0YW5jZSkge1xuXHRyZXR1cm4gKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluc3RhbmNlKS5sZW5ndGggPD0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEV2ZW50cyAoZXZlbnRzLCBpZCkge1xuXHRsZXQgcndpbmRvdyA9IC9eKChhZnRlcnxiZWZvcmUpcHJpbnR8KGJlZm9yZSk/dW5sb2FkfGhhc2hjaGFuZ2V8bWVzc2FnZXxvKGZmfG4pbGluZXxwYWdlKGhpZGV8c2hvdyl8cG9wc3RhdGV8cmVzaXplfHN0b3JhZ2UpXFxiLztcblx0Ly8gYWRkIHBsYXllciBJRCBhcyBhbiBldmVudCBuYW1lc3BhY2Ugc28gaXQncyBlYXNpZXIgdG8gdW5iaW5kIHRoZW0gYWxsIGxhdGVyXG5cdGxldCByZXQgPSB7ZDogW10sIHc6IFtdfTtcblx0KGV2ZW50cyB8fCAnJykuc3BsaXQoJyAnKS5mb3JFYWNoKCh2KSA9PiB7XG5cdFx0Y29uc3QgZXZlbnROYW1lID0gdiArICcuJyArIGlkO1xuXG5cdFx0aWYgKGV2ZW50TmFtZS5zdGFydHNXaXRoKCcuJykpIHtcblx0XHRcdHJldC5kLnB1c2goZXZlbnROYW1lKTtcblx0XHRcdHJldC53LnB1c2goZXZlbnROYW1lKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXRbcndpbmRvdy50ZXN0KHYpID8gJ3cnIDogJ2QnXS5wdXNoKGV2ZW50TmFtZSk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdHJldC5kID0gcmV0LmQuam9pbignICcpO1xuXHRyZXQudyA9IHJldC53LmpvaW4oJyAnKTtcblx0cmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtTdHJpbmd9IHRhZ1xuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUgKGNsYXNzTmFtZSwgbm9kZSwgdGFnKSB7XG5cblx0aWYgKG5vZGUgPT09IHVuZGVmaW5lZCB8fCBub2RlID09PSBudWxsKSB7XG5cdFx0bm9kZSA9IGRvY3VtZW50O1xuXHR9XG5cdGlmIChub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IHVuZGVmaW5lZCAmJiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IG51bGwpIHtcblx0XHRyZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XG5cdH1cblx0aWYgKHRhZyA9PT0gdW5kZWZpbmVkIHx8IHRhZyA9PT0gbnVsbCkge1xuXHRcdHRhZyA9ICcqJztcblx0fVxuXG5cdGxldFxuXHRcdGNsYXNzRWxlbWVudHMgPSBbXSxcblx0XHRqID0gMCxcblx0XHR0ZXN0c3RyLFxuXHRcdGVscyA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKSxcblx0XHRlbHNMZW4gPSBlbHMubGVuZ3RoXG5cdFx0O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbHNMZW47IGkrKykge1xuXHRcdGlmIChlbHNbaV0uY2xhc3NOYW1lLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG5cdFx0XHR0ZXN0c3RyID0gYCwke2Vsc1tpXS5jbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCcsJyl9LGA7XG5cdFx0XHRpZiAodGVzdHN0ci5pbmRleE9mKGAsJHtjbGFzc05hbWV9LGApID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NFbGVtZW50c1tqXSA9IGVsc1tpXTtcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjbGFzc0VsZW1lbnRzO1xufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuZXNjYXBlSFRNTCA9IGVzY2FwZUhUTUw7XG5tZWpzLlV0aWxzLmRlYm91bmNlID0gZGVib3VuY2U7XG5tZWpzLlV0aWxzLmlzT2JqZWN0RW1wdHkgPSBpc09iamVjdEVtcHR5O1xubWVqcy5VdGlscy5zcGxpdEV2ZW50cyA9IHNwbGl0RXZlbnRzO1xubWVqcy5VdGlscy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge2VzY2FwZUhUTUx9IGZyb20gJy4vZ2VuZXJhbCc7XG5cbmV4cG9ydCBsZXQgdHlwZUNoZWNrcyA9IFtdO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnNvbHV0aXplVXJsICh1cmwpIHtcblxuXHRpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B1cmxgIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRlbC5pbm5lckhUTUwgPSBgPGEgaHJlZj1cIiR7ZXNjYXBlSFRNTCh1cmwpfVwiPng8L2E+YDtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuaHJlZjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZvcm1hdCBvZiBhIHNwZWNpZmljIG1lZGlhLCBiYXNlZCBvbiBVUkwgYW5kIGFkZGl0aW9uYWxseSBpdHMgbWltZSB0eXBlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFR5cGUgKHVybCwgdHlwZSA9ICcnKSB7XG5cdHJldHVybiAodXJsICYmICF0eXBlKSA/IGdldFR5cGVGcm9tRmlsZSh1cmwpIDogZ2V0TWltZUZyb21UeXBlKHR5cGUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSBwYXJ0IG9mIHRoZSB0eXBlIGluIGNhc2UgdGhlIGF0dHJpYnV0ZSBjb250YWlucyB0aGUgY29kZWNcbiAqIChgdmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRSwgbXA0YS40MC4yXCJgIGJlY29tZXMgYHZpZGVvL21wNGApXG4gKlxuICogQHNlZSBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS92aWRlby5odG1sI3RoZS1zb3VyY2UtZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbWVGcm9tVHlwZSAodHlwZSkge1xuXG5cdGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B0eXBlYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRyZXR1cm4gKHR5cGUgJiYgfnR5cGUuaW5kZXhPZignOycpKSA/IHR5cGUuc3Vic3RyKDAsIHR5cGUuaW5kZXhPZignOycpKSA6IHR5cGU7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIG1lZGlhIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlRnJvbUZpbGUgKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IHR5cGU7XG5cblx0Ly8gVmFsaWRhdGUgYHR5cGVDaGVja3NgIGFycmF5XG5cdGlmICghQXJyYXkuaXNBcnJheSh0eXBlQ2hlY2tzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHR5cGVDaGVja3NgIG11c3QgYmUgYW4gYXJyYXknKTtcblx0fVxuXG5cdGlmICh0eXBlQ2hlY2tzLmxlbmd0aCkge1xuXHRcdGZvciAobGV0IGkgPSAwLCB0b3RhbCA9IHR5cGVDaGVja3MubGVuZ3RoOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVDaGVja3NbaV07XG5cblx0XHRcdGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaW4gYXJyYXkgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gZG8gdHlwZSBjaGVja3MgZmlyc3Rcblx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdHlwZUNoZWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cblx0XHR0eXBlID0gdHlwZUNoZWNrc1tpXSh1cmwpO1xuXG5cdFx0aWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlICE9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cdH1cblxuXHQvLyB0aGUgZG8gc3RhbmRhcmQgZXh0ZW5zaW9uIGNoZWNrXG5cdGxldFxuXHRcdGV4dCA9IGdldEV4dGVuc2lvbih1cmwpLFxuXHRcdG5vcm1hbGl6ZWRFeHQgPSBub3JtYWxpemVFeHRlbnNpb24oZXh0KVxuXHRcdDtcblxuXHRyZXR1cm4gKC8obXA0fG00dnxvZ2d8b2d2fHdlYm18d2VibXZ8Zmx2fHdtdnxtcGVnfG1vdikvZ2kudGVzdChleHQpID8gJ3ZpZGVvJyA6ICdhdWRpbycpICsgJy8nICsgbm9ybWFsaXplZEV4dDtcbn1cblxuLyoqXG4gKiBHZXQgbWVkaWEgZmlsZSBleHRlbnNpb24gZnJvbSBVUkxcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb24gKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IGJhc2VVcmwgPSB1cmwuc3BsaXQoJz8nKVswXTtcblxuXHRyZXR1cm4gfmJhc2VVcmwuaW5kZXhPZignLicpID8gYmFzZVVybC5zdWJzdHJpbmcoYmFzZVVybC5sYXN0SW5kZXhPZignLicpICsgMSkgOiAnJztcbn1cblxuLyoqXG4gKiBHZXQgc3RhbmRhcmQgZXh0ZW5zaW9uIG9mIGEgbWVkaWEgZmlsZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb25cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUV4dGVuc2lvbiAoZXh0ZW5zaW9uKSB7XG5cblx0aWYgKHR5cGVvZiBleHRlbnNpb24gIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgZXh0ZW5zaW9uYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRzd2l0Y2ggKGV4dGVuc2lvbikge1xuXHRcdGNhc2UgJ21wNCc6XG5cdFx0Y2FzZSAnbTR2Jzpcblx0XHRcdHJldHVybiAnbXA0Jztcblx0XHRjYXNlICd3ZWJtJzpcblx0XHRjYXNlICd3ZWJtYSc6XG5cdFx0Y2FzZSAnd2VibXYnOlxuXHRcdFx0cmV0dXJuICd3ZWJtJztcblx0XHRjYXNlICdvZ2cnOlxuXHRcdGNhc2UgJ29nYSc6XG5cdFx0Y2FzZSAnb2d2Jzpcblx0XHRcdHJldHVybiAnb2dnJztcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcblx0fVxufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuYWJzb2x1dGl6ZVVybCA9IGFic29sdXRpemVVcmw7XG5tZWpzLlV0aWxzLmZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlO1xubWVqcy5VdGlscy5nZXRNaW1lRnJvbVR5cGUgPSBnZXRNaW1lRnJvbVR5cGU7XG5tZWpzLlV0aWxzLmdldFR5cGVGcm9tRmlsZSA9IGdldFR5cGVGcm9tRmlsZTtcbm1lanMuVXRpbHMuZ2V0RXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uO1xubWVqcy5VdGlscy5ub3JtYWxpemVFeHRlbnNpb24gPSBub3JtYWxpemVFeHRlbnNpb247XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbi8qKlxuICogRm9ybWF0IGEgbnVtZXJpYyB0aW1lIGluIGZvcm1hdCAnMDA6MDA6MDAnXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBJZGVhbGx5IGEgbnVtYmVyLCBidXQgaWYgbm90IG9yIGxlc3MgdGhhbiB6ZXJvLCBpcyBkZWZhdWx0ZWQgdG8gemVyb1xuICogQHBhcmFtIHtCb29sZWFufSBmb3JjZUhvdXJzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNob3dGcmFtZUNvdW50XG4gKiBAcGFyYW0ge051bWJlcn0gZnBzIC0gRnJhbWVzIHBlciBzZWNvbmRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWVDb2RlICh0aW1lLCBmb3JjZUhvdXJzID0gZmFsc2UsIHNob3dGcmFtZUNvdW50ID0gZmFsc2UsIGZwcyA9IDI1KSB7XG5cblx0dGltZSA9ICF0aW1lIHx8IHR5cGVvZiB0aW1lICE9PSAnbnVtYmVyJyB8fCB0aW1lIDwgMCA/IDAgOiB0aW1lO1xuXG5cdGxldCBob3VycyA9IE1hdGguZmxvb3IodGltZSAvIDM2MDApICUgMjQ7XG5cdGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aW1lIC8gNjApICUgNjA7XG5cdGxldCBzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApO1xuXHRsZXQgZnJhbWVzID0gTWF0aC5mbG9vcigoKHRpbWUgJSAxKSAqIGZwcykudG9GaXhlZCgzKSk7XG5cblx0aG91cnMgPSBob3VycyA8PSAwID8gMCA6IGhvdXJzO1xuXHRtaW51dGVzID0gbWludXRlcyA8PSAwID8gMCA6IG1pbnV0ZXM7XG5cdHNlY29uZHMgPSBzZWNvbmRzIDw9IDAgPyAwIDogc2Vjb25kcztcblxuXHRsZXQgcmVzdWx0ID0gKGZvcmNlSG91cnMgfHwgaG91cnMgPiAwKSA/IGAkeyhob3VycyA8IDEwID8gYDAke2hvdXJzfWAgOiBob3Vycyl9OmAgOiAnJztcblx0cmVzdWx0ICs9IGAkeyhtaW51dGVzIDwgMTAgPyBgMCR7bWludXRlc31gIDogbWludXRlcyl9OmA7XG5cdHJlc3VsdCArPSBgJHsoc2Vjb25kcyA8IDEwID8gYDAke3NlY29uZHN9YCA6IHNlY29uZHMpfWA7XG5cdHJlc3VsdCArPSBgJHsoKHNob3dGcmFtZUNvdW50KSA/IGA6JHsoZnJhbWVzIDwgMTAgPyBgMCR7ZnJhbWVzfWAgOiBmcmFtZXMpfWAgOiAnJyl9YDtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSAnMDA6MDA6MDAnIHRpbWUgc3RyaW5nIGludG8gc2Vjb25kc1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0aW1lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNob3dGcmFtZUNvdW50XG4gKiBAcGFyYW0ge051bWJlcn0gZnBzIC0gRnJhbWVzIHBlciBzZWNvbmRcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVDb2RlVG9TZWNvbmRzICh0aW1lLCBzaG93RnJhbWVDb3VudCA9IGZhbHNlLCBmcHMgPSAyNSkge1xuXG5cdGlmICh0eXBlb2YgdGltZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaW1lIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGlmICghdGltZS5tYXRjaCgvXFxkezJ9KFxcOlxcZHsyfSl7MCwzfS8pKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGltZSBjb2RlIG11c3QgaGF2ZSB0aGUgZm9ybWF0IGAwMDowMDowMGAnKTtcblx0fVxuXG5cdGxldFxuXHRcdHBhcnRzID0gdGltZS5zcGxpdCgnOicpLFxuXHRcdGhvdXJzID0gMCxcblx0XHRtaW51dGVzID0gMCxcblx0XHRmcmFtZXMgPSAwLFxuXHRcdHNlY29uZHMgPSAwLFxuXHRcdG91dHB1dFxuXHRcdDtcblxuXHRzd2l0Y2ggKHBhcnRzLmxlbmd0aCkge1xuXHRcdGRlZmF1bHQ6XG5cdFx0Y2FzZSAxOlxuXHRcdFx0c2Vjb25kcyA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRtaW51dGVzID0gcGFyc2VJbnQocGFydHNbMF0sIDEwKTtcblx0XHRcdHNlY29uZHMgPSBwYXJzZUludChwYXJ0c1sxXSwgMTApO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAzOlxuXHRcdGNhc2UgNDpcblx0XHRcdGhvdXJzID0gcGFyc2VJbnQocGFydHNbMF0sIDEwKTtcblx0XHRcdG1pbnV0ZXMgPSBwYXJzZUludChwYXJ0c1sxXSwgMTApO1xuXHRcdFx0c2Vjb25kcyA9IHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG5cdFx0XHRmcmFtZXMgPSBzaG93RnJhbWVDb3VudCA/IHBhcnNlSW50KHBhcnRzWzNdKSAvIGZwcyA6IDA7XG5cdFx0XHRicmVhaztcblxuXHR9XG5cblx0b3V0cHV0ID0gKCBob3VycyAqIDM2MDAgKSArICggbWludXRlcyAqIDYwICkgKyBzZWNvbmRzICsgZnJhbWVzO1xuXHRyZXR1cm4gcGFyc2VGbG9hdCgob3V0cHV0KS50b0ZpeGVkKDMpKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIHRpbWUgZm9ybWF0IHRvIHVzZVxuICpcbiAqIFRoZXJlIGlzIGEgZGVmYXVsdCBmb3JtYXQgc2V0IGluIHRoZSBvcHRpb25zIGJ1dCBpdCBjYW4gYmUgaW5jb21wbGV0ZSwgc28gaXQgaXMgYWRqdXN0ZWQgYWNjb3JkaW5nIHRvIHRoZSBtZWRpYVxuICogZHVyYXRpb24uIEZvcm1hdDogJ2hoOm1tOnNzOmZmJ1xuICogQHBhcmFtIHsqfSB0aW1lIC0gSWRlYWxseSBhIG51bWJlciwgYnV0IGlmIG5vdCBvciBsZXNzIHRoYW4gemVybywgaXMgZGVmYXVsdGVkIHRvIHplcm9cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gZnBzIC0gRnJhbWVzIHBlciBzZWNvbmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVRpbWVGb3JtYXQgKHRpbWUsIG9wdGlvbnMsIGZwcyA9IDI1KSB7XG5cblx0dGltZSA9ICF0aW1lIHx8IHR5cGVvZiB0aW1lICE9PSAnbnVtYmVyJyB8fCB0aW1lIDwgMCA/IDAgOiB0aW1lO1xuXG5cdGxldFxuXHRcdHJlcXVpcmVkID0gZmFsc2UsXG5cdFx0Zm9ybWF0ID0gb3B0aW9ucy50aW1lRm9ybWF0LFxuXHRcdGZpcnN0Q2hhciA9IGZvcm1hdFswXSxcblx0XHRmaXJzdFR3b1BsYWNlcyA9IChmb3JtYXRbMV0gPT09IGZvcm1hdFswXSksXG5cdFx0c2VwYXJhdG9ySW5kZXggPSBmaXJzdFR3b1BsYWNlcyA/IDIgOiAxLFxuXHRcdHNlcGFyYXRvciA9IGZvcm1hdC5sZW5ndGggPCBzZXBhcmF0b3JJbmRleCA/IGZvcm1hdFtzZXBhcmF0b3JJbmRleF0gOiAnOicsXG5cdFx0aG91cnMgPSBNYXRoLmZsb29yKHRpbWUgLyAzNjAwKSAlIDI0LFxuXHRcdG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRpbWUgLyA2MCkgJSA2MCxcblx0XHRzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApLFxuXHRcdGZyYW1lcyA9IE1hdGguZmxvb3IoKCh0aW1lICUgMSkgKiBmcHMpLnRvRml4ZWQoMykpLFxuXHRcdGxpcyA9IFtcblx0XHRcdFtmcmFtZXMsICdmJ10sXG5cdFx0XHRbc2Vjb25kcywgJ3MnXSxcblx0XHRcdFttaW51dGVzLCAnbSddLFxuXHRcdFx0W2hvdXJzLCAnaCddXG5cdFx0XVxuXHRcdDtcblxuXHRmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0aWYgKGZvcm1hdC5pbmRleE9mKGxpc1tpXVsxXSkgPiAtMSkge1xuXHRcdFx0cmVxdWlyZWQgPSB0cnVlO1xuXHRcdH1cblx0XHRlbHNlIGlmIChyZXF1aXJlZCkge1xuXHRcdFx0bGV0IGhhc05leHRWYWx1ZSA9IGZhbHNlO1xuXHRcdFx0Zm9yIChsZXQgaiA9IGk7IGogPCBsZW47IGorKykge1xuXHRcdFx0XHRpZiAobGlzW2pdWzBdID4gMCkge1xuXHRcdFx0XHRcdGhhc05leHRWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCFoYXNOZXh0VmFsdWUpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZmlyc3RUd29QbGFjZXMpIHtcblx0XHRcdFx0Zm9ybWF0ID0gZmlyc3RDaGFyICsgZm9ybWF0O1xuXHRcdFx0fVxuXHRcdFx0Zm9ybWF0ID0gbGlzW2ldWzFdICsgc2VwYXJhdG9yICsgZm9ybWF0O1xuXHRcdFx0aWYgKGZpcnN0VHdvUGxhY2VzKSB7XG5cdFx0XHRcdGZvcm1hdCA9IGxpc1tpXVsxXSArIGZvcm1hdDtcblx0XHRcdH1cblx0XHRcdGZpcnN0Q2hhciA9IGxpc1tpXVsxXTtcblx0XHR9XG5cdH1cblxuXHRvcHRpb25zLmN1cnJlbnRUaW1lRm9ybWF0ID0gZm9ybWF0O1xufVxuXG4vKipcbiAqIENvbnZlcnQgU29jaWV0eSBvZiBNb3Rpb24gUGljdHVyZSBhbmQgVGVsZXZpc2lvbiBFbmdpbmVlcnMgKFNNVFBFKSB0aW1lIGNvZGUgaW50byBzZWNvbmRzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFNNUFRFXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U01QVEV0b1NlY29uZHMgKFNNUFRFKSB7XG5cblx0aWYgKHR5cGVvZiBTTVBURSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nIHZhbHVlJyk7XG5cdH1cblxuXHRTTVBURSA9IFNNUFRFLnJlcGxhY2UoJywnLCAnLicpO1xuXG5cdGxldFxuXHRcdHNlY3MgPSAwLFxuXHRcdGRlY2ltYWxMZW4gPSAoU01QVEUuaW5kZXhPZignLicpID4gLTEpID8gU01QVEUuc3BsaXQoJy4nKVsxXS5sZW5ndGggOiAwLFxuXHRcdG11bHRpcGxpZXIgPSAxXG5cdFx0O1xuXG5cdFNNUFRFID0gU01QVEUuc3BsaXQoJzonKS5yZXZlcnNlKCk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBTTVBURS5sZW5ndGg7IGkrKykge1xuXHRcdG11bHRpcGxpZXIgPSAxO1xuXHRcdGlmIChpID4gMCkge1xuXHRcdFx0bXVsdGlwbGllciA9IE1hdGgucG93KDYwLCBpKTtcblx0XHR9XG5cdFx0c2VjcyArPSBOdW1iZXIoU01QVEVbaV0pICogbXVsdGlwbGllcjtcblx0fVxuXHRyZXR1cm4gTnVtYmVyKHNlY3MudG9GaXhlZChkZWNpbWFsTGVuKSk7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5zZWNvbmRzVG9UaW1lQ29kZSA9IHNlY29uZHNUb1RpbWVDb2RlO1xubWVqcy5VdGlscy50aW1lQ29kZVRvU2Vjb25kcyA9IHRpbWVDb2RlVG9TZWNvbmRzO1xubWVqcy5VdGlscy5jYWxjdWxhdGVUaW1lRm9ybWF0ID0gY2FsY3VsYXRlVGltZUZvcm1hdDtcbm1lanMuVXRpbHMuY29udmVydFNNUFRFdG9TZWNvbmRzID0gY29udmVydFNNUFRFdG9TZWNvbmRzOyJdfQ==
