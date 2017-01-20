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

var _en = _dereq_(8);

var _general = _dereq_(21);

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

},{"21":21,"6":6,"8":8}],5:[function(_dereq_,module,exports){
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

var _media = _dereq_(22);

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

},{"2":2,"22":22,"3":3,"6":6,"7":7}],6:[function(_dereq_,module,exports){
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
mejs.version = '3.0.1';

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

},{}],9:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _media = _dereq_(22);

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

},{"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],10:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _media = _dereq_(22);

var _constants = _dereq_(19);

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

},{"19":19,"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],11:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _general = _dereq_(21);

var _dom = _dereq_(20);

var _media = _dereq_(22);

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

},{"2":2,"20":20,"21":21,"22":22,"3":3,"6":6,"7":7}],12:[function(_dereq_,module,exports){
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

var _dom = _dereq_(20);

var _constants = _dereq_(19);

var _media = _dereq_(22);

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

},{"19":19,"2":2,"20":20,"22":22,"3":3,"4":4,"6":6,"7":7}],13:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _constants = _dereq_(19);

var _media = _dereq_(22);

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

},{"19":19,"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],14:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _constants = _dereq_(19);

var _media = _dereq_(22);

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

},{"19":19,"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],15:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _constants = _dereq_(19);

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

},{"19":19,"2":2,"20":20,"3":3,"6":6,"7":7}],16:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _media = _dereq_(22);

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

},{"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],17:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _media = _dereq_(22);

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

},{"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],18:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(6);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(7);

var _dom = _dereq_(20);

var _media = _dereq_(22);

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

},{"2":2,"20":20,"22":22,"3":3,"6":6,"7":7}],19:[function(_dereq_,module,exports){
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

},{"2":2,"3":3,"6":6}],20:[function(_dereq_,module,exports){
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

},{"2":2,"6":6}],21:[function(_dereq_,module,exports){
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

},{"2":2,"6":6}],22:[function(_dereq_,module,exports){
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

var _general = _dereq_(21);

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

},{"21":21,"6":6}],23:[function(_dereq_,module,exports){
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

},{"2":2}]},{},[23,5,4,8,15,12,9,10,11,13,14,16,17,18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwic3JjL2pzL2NvcmUvaTE4bi5qcyIsInNyYy9qcy9jb3JlL21lZGlhZWxlbWVudC5qcyIsInNyYy9qcy9jb3JlL21lanMuanMiLCJzcmMvanMvY29yZS9yZW5kZXJlci5qcyIsInNyYy9qcy9sYW5ndWFnZXMvZW4uanMiLCJzcmMvanMvcmVuZGVyZXJzL2RhaWx5bW90aW9uLmpzIiwic3JjL2pzL3JlbmRlcmVycy9kYXNoLmpzIiwic3JjL2pzL3JlbmRlcmVycy9mYWNlYm9vay5qcyIsInNyYy9qcy9yZW5kZXJlcnMvZmxhc2guanMiLCJzcmMvanMvcmVuZGVyZXJzL2Zsdi5qcyIsInNyYy9qcy9yZW5kZXJlcnMvaGxzLmpzIiwic3JjL2pzL3JlbmRlcmVycy9odG1sNS5qcyIsInNyYy9qcy9yZW5kZXJlcnMvc291bmRjbG91ZC5qcyIsInNyYy9qcy9yZW5kZXJlcnMvdmltZW8uanMiLCJzcmMvanMvcmVuZGVyZXJzL3lvdXR1YmUuanMiLCJzcmMvanMvdXRpbHMvY29uc3RhbnRzLmpzIiwic3JjL2pzL3V0aWxzL2RvbS5qcyIsInNyYy9qcy91dGlscy9nZW5lcmFsLmpzIiwic3JjL2pzL3V0aWxzL21lZGlhLmpzIiwic3JjL2pzL3V0aWxzL3BvbHlmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7Ozs7Ozs7O0FB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QWdDO0FBQzdELGFBQVcsWUFBWSxDQUF2QjtBQUNBLFNBQU8sS0FBSyxNQUFMLENBQVksUUFBWixFQUFzQixhQUFhLE1BQW5DLE1BQStDLFlBQXREO0FBQ0EsRUFIRDtBQUlBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsInZhciB0b3BMZXZlbCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDpcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHt9XG52YXIgbWluRG9jID0gcmVxdWlyZSgnbWluLWRvY3VtZW50Jyk7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudDtcbn0gZWxzZSB7XG4gICAgdmFyIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXTtcblxuICAgIGlmICghZG9jY3kpIHtcbiAgICAgICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddID0gbWluRG9jO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jY3k7XG59XG4iLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5pbXBvcnQge0VOIGFzIGVufSBmcm9tICcuLi9sYW5ndWFnZXMvZW4nO1xuaW1wb3J0IHtlc2NhcGVIVE1MLCBpc09iamVjdEVtcHR5fSBmcm9tICcuLi91dGlscy9nZW5lcmFsJztcblxuLyoqXG4gKiBMb2NhbGUuXG4gKlxuICogVGhpcyBvYmplY3QgbWFuYWdlcyB0cmFuc2xhdGlvbnMgd2l0aCBwbHVyYWxpemF0aW9uLiBBbHNvIGRlYWxzIHdpdGggV29yZFByZXNzIGNvbXBhdGliaWxpdHkuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5sZXQgaTE4biA9IHtsYW5nOiAnZW4nLCBlbjogZW59O1xuXG4vKipcbiAqIExhbmd1YWdlIHNldHRlci9nZXR0ZXJcbiAqXG4gKiBAcGFyYW0geyp9IGFyZ3MgIENhbiBwYXNzIHRoZSBsYW5ndWFnZSBjb2RlIGFuZC9vciB0aGUgdHJhbnNsYXRpb24gc3RyaW5ncyBhcyBhbiBPYmplY3RcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuaTE4bi5sYW5ndWFnZSA9ICguLi5hcmdzKSA9PiB7XG5cblx0aWYgKGFyZ3MgIT09IG51bGwgJiYgYXJncyAhPT0gdW5kZWZpbmVkICYmIGFyZ3MubGVuZ3RoKSB7XG5cblx0XHRpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdMYW5ndWFnZSBjb2RlIG11c3QgYmUgYSBzdHJpbmcgdmFsdWUnKTtcblx0XHR9XG5cblx0XHRpZiAoIWFyZ3NbMF0ubWF0Y2goL15bYS16XXsyfShcXC1bYS16XXsyfSk/JC9pKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignTGFuZ3VhZ2UgY29kZSBtdXN0IGhhdmUgZm9ybWF0IGB4eGAgb3IgYHh4LXh4YCcpO1xuXHRcdH1cblxuXHRcdGkxOG4ubGFuZyA9IGFyZ3NbMF07XG5cblx0XHQvLyBDaGVjayBpZiBsYW5ndWFnZSBzdHJpbmdzIHdlcmUgYWRkZWQ7IG90aGVyd2lzZSwgY2hlY2sgdGhlIHNlY29uZCBhcmd1bWVudCBvciBzZXQgdG8gRW5nbGlzaCBhcyBkZWZhdWx0XG5cdFx0aWYgKGkxOG5bYXJnc1swXV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0YXJnc1sxXSA9IGFyZ3NbMV0gIT09IG51bGwgJiYgYXJnc1sxXSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0JyA/IGFyZ3NbMV0gOiB7fTtcblx0XHRcdGkxOG5bYXJnc1swXV0gPSAhaXNPYmplY3RFbXB0eShhcmdzWzFdKSA/IGFyZ3NbMV0gOiBlbjtcblx0XHR9IGVsc2UgaWYgKGFyZ3NbMV0gIT09IG51bGwgJiYgYXJnc1sxXSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBhcmdzWzFdID09PSAnb2JqZWN0Jykge1xuXHRcdFx0aTE4blthcmdzWzBdXSA9IGFyZ3NbMV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGkxOG4ubGFuZztcbn07XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgc3RyaW5nIGluIHRoZSBsYW5ndWFnZSBzZXQgdXAgKG9yIEVuZ2xpc2ggYnkgZGVmYXVsdClcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtIHtudW1iZXJ9IHBsdXJhbFBhcmFtXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmkxOG4udCA9IChtZXNzYWdlLCBwbHVyYWxQYXJhbSA9IG51bGwpID0+IHtcblxuXHRpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnICYmIG1lc3NhZ2UubGVuZ3RoKSB7XG5cblx0XHRsZXRcblx0XHRcdHN0cixcblx0XHRcdHBsdXJhbEZvcm1cblx0XHRcdDtcblxuXHRcdGNvbnN0IGxhbmd1YWdlID0gaTE4bi5sYW5ndWFnZSgpO1xuXG5cdFx0LyoqXG5cdFx0ICogTW9kaWZ5IHN0cmluZyB1c2luZyBhbGdvcml0aG0gdG8gZGV0ZWN0IHBsdXJhbCBmb3Jtcy5cblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTM0MDgvbWVzc2FnZWZvcm1hdC1pbi1qYXZhc2NyaXB0LXBhcmFtZXRlcnMtaW4tbG9jYWxpemVkLXVpLXN0cmluZ3Ncblx0XHQgKiBAcGFyYW0ge1N0cmluZ3xTdHJpbmdbXX0gaW5wdXQgICAtIFN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIHBpY2sgdGhlIHBsdXJhbCBmb3JtXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAgICAgICAgICAgLSBOdW1iZXIgdG8gZGV0ZXJtaW5lIHRoZSBwcm9wZXIgcGx1cmFsIGZvcm1cblx0XHQgKiBAcGFyYW0ge051bWJlcn0gZm9ybSAgICAgICAgICAgICAtIE51bWJlciBvZiBsYW5ndWFnZSBmYW1pbHkgdG8gYXBwbHkgcGx1cmFsIGZvcm1cblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdFx0ICovXG5cdFx0Y29uc3QgX3BsdXJhbCA9IChpbnB1dCwgbnVtYmVyLCBmb3JtKSA9PiB7XG5cblx0XHRcdGlmICh0eXBlb2YgaW5wdXQgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBudW1iZXIgIT09ICdudW1iZXInIHx8IHR5cGVvZiBmb3JtICE9PSAnbnVtYmVyJykge1xuXHRcdFx0XHRyZXR1cm4gaW5wdXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICpcblx0XHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9uW119XG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRsZXQgX3BsdXJhbEZvcm1zID0gKCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQvLyAwOiBDaGluZXNlLCBKYXBhbmVzZSwgS29yZWFuLCBQZXJzaWFuLCBUdXJraXNoLCBUaGFpLCBMYW8sIEF5bWFyw6EsXG5cdFx0XHRcdFx0Ly8gVGliZXRhbiwgQ2hpZ2EsIER6b25na2hhLCBJbmRvbmVzaWFuLCBMb2piYW4sIEdlb3JnaWFuLCBLYXpha2gsIEtobWVyLCBLeXJneXosIE1hbGF5LFxuXHRcdFx0XHRcdC8vIEJ1cm1lc2UsIFlha3V0LCBTdW5kYW5lc2UsIFRhdGFyLCBVeWdodXIsIFZpZXRuYW1lc2UsIFdvbG9mXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IGFyZ3NbMV0sXG5cblx0XHRcdFx0XHQvLyAxOiBEYW5pc2gsIER1dGNoLCBFbmdsaXNoLCBGYXJvZXNlLCBGcmlzaWFuLCBHZXJtYW4sIE5vcndlZ2lhbiwgU3dlZGlzaCwgRXN0b25pYW4sIEZpbm5pc2gsXG5cdFx0XHRcdFx0Ly8gSHVuZ2FyaWFuLCBCYXNxdWUsIEdyZWVrLCBIZWJyZXcsIEl0YWxpYW4sIFBvcnR1Z3Vlc2UsIFNwYW5pc2gsIENhdGFsYW4sIEFmcmlrYWFucyxcblx0XHRcdFx0XHQvLyBBbmdpa2EsIEFzc2FtZXNlLCBBc3R1cmlhbiwgQXplcmJhaWphbmksIEJ1bGdhcmlhbiwgQmVuZ2FsaSwgQm9kbywgQXJhZ29uZXNlLCBEb2dyaSxcblx0XHRcdFx0XHQvLyBFc3BlcmFudG8sIEFyZ2VudGluZWFuIFNwYW5pc2gsIEZ1bGFoLCBGcml1bGlhbiwgR2FsaWNpYW4sIEd1amFyYXRpLCBIYXVzYSxcblx0XHRcdFx0XHQvLyBIaW5kaSwgQ2hoYXR0aXNnYXJoaSwgQXJtZW5pYW4sIEludGVybGluZ3VhLCBHcmVlbmxhbmRpYywgS2FubmFkYSwgS3VyZGlzaCwgTGV0emVidXJnZXNjaCxcblx0XHRcdFx0XHQvLyBNYWl0aGlsaSwgTWFsYXlhbGFtLCBNb25nb2xpYW4sIE1hbmlwdXJpLCBNYXJhdGhpLCBOYWh1YXRsLCBOZWFwb2xpdGFuLCBOb3J3ZWdpYW4gQm9rbWFsLFxuXHRcdFx0XHRcdC8vIE5lcGFsaSwgTm9yd2VnaWFuIE55bm9yc2ssIE5vcndlZ2lhbiAob2xkIGNvZGUpLCBOb3J0aGVybiBTb3RobywgT3JpeWEsIFB1bmphYmksIFBhcGlhbWVudG8sXG5cdFx0XHRcdFx0Ly8gUGllbW9udGVzZSwgUGFzaHRvLCBSb21hbnNoLCBLaW55YXJ3YW5kYSwgU2FudGFsaSwgU2NvdHMsIFNpbmRoaSwgTm9ydGhlcm4gU2FtaSwgU2luaGFsYSxcblx0XHRcdFx0XHQvLyBTb21hbGksIFNvbmdoYXksIEFsYmFuaWFuLCBTd2FoaWxpLCBUYW1pbCwgVGVsdWd1LCBUdXJrbWVuLCBVcmR1LCBZb3J1YmFcblx0XHRcdFx0XHQoLi4uYXJncykgPT4gKGFyZ3NbMF0gPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl0sXG5cblx0XHRcdFx0XHQvLyAyOiBGcmVuY2gsIEJyYXppbGlhbiBQb3J0dWd1ZXNlLCBBY2hvbGksIEFrYW4sIEFtaGFyaWMsIE1hcHVkdW5ndW4sIEJyZXRvbiwgRmlsaXBpbm8sXG5cdFx0XHRcdFx0Ly8gR3VuLCBMaW5nYWxhLCBNYXVyaXRpYW4gQ3Jlb2xlLCBNYWxhZ2FzeSwgTWFvcmksIE9jY2l0YW4sIFRhamlrLCBUaWdyaW55YSwgVXpiZWssIFdhbGxvb25cblx0XHRcdFx0XHQoLi4uYXJncykgPT4gKGFyZ3NbMF0gPT09IDAgfHwgYXJnc1swXSA9PT0gMSkgPyBhcmdzWzFdIDogYXJnc1syXSxcblxuXHRcdFx0XHRcdC8vIDM6IExhdHZpYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gJSAxMCA9PT0gMSAmJiBhcmdzWzBdICUgMTAwICE9PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA0OiBTY290dGlzaCBHYWVsaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEgfHwgYXJnc1swXSA9PT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIgfHwgYXJnc1swXSA9PT0gMTIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiAyICYmIGFyZ3NbMF0gPCAyMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyA1OiAgUm9tYW5pYW5cblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDAgfHwgKGFyZ3NbMF0gJSAxMDAgPiAwICYmIGFyZ3NbMF0gJSAxMDAgPCAyMCkpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNjogTGl0aHVhbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxICYmIGFyZ3NbMF0gJSAxMDAgIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8IGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFszXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gNzogQmVsYXJ1c2lhbiwgQm9zbmlhbiwgQ3JvYXRpYW4sIFNlcmJpYW4sIFJ1c3NpYW4sIFVrcmFpbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxICYmIGFyZ3NbMF0gJSAxMDAgIT09IDExKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiBhcmdzWzBdICUgMTAgPD0gNCAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8IGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDg6ICBTbG92YWssIEN6ZWNoXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID49IDIgJiYgYXJnc1swXSA8PSA0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDk6IFBvbGlzaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwID49IDIgJiYgYXJnc1swXSAlIDEwIDw9IDQgJiYgKGFyZ3NbMF0gJSAxMDAgPCAxMCB8fCBhcmdzWzBdICUgMTAwID49IDIwKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMDogU2xvdmVuaWFuXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdICUgMTAwID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID09PSAzIHx8IGFyZ3NbMF0gJSAxMDAgPT09IDQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbNF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTE6IElyaXNoIEdhZWxpY1xuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA+IDIgJiYgYXJnc1swXSA8IDcpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPiA2ICYmIGFyZ3NbMF0gPCAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzVdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMjogQXJhYmljXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzNdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAwID49IDMgJiYgYXJnc1swXSAlIDEwMCA8PSAxMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+PSAxMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s1XTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzZdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxMzogTWFsdGVzZVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMCB8fCAoYXJnc1swXSAlIDEwMCA+IDEgJiYgYXJnc1swXSAlIDEwMCA8IDExKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSAlIDEwMCA+IDEwICYmIGFyZ3NbMF0gJSAxMDAgPCAyMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAxNDogTWFjZWRvbmlhblxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSAlIDEwID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTU6ICBJY2VsYW5kaWNcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIChhcmdzWzBdICE9PSAxMSAmJiBhcmdzWzBdICUgMTAgPT09IDEpID8gYXJnc1sxXSA6IGFyZ3NbMl07XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIE5ldyBhZGRpdGlvbnNcblxuXHRcdFx0XHRcdC8vIDE2OiAgS2FzaHViaWFuXG5cdFx0XHRcdFx0Ly8gSW4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0xvY2FsaXphdGlvbi9Mb2NhbGl6YXRpb25fYW5kX1BsdXJhbHMjTGlzdF9vZl9fcGx1cmFsUnVsZXNcblx0XHRcdFx0XHQvLyBCcmV0b24gaXMgbGlzdGVkIGFzICMxNiBidXQgaW4gdGhlIExvY2FsaXphdGlvbiBHdWlkZSBpdCBiZWxvbmdzIHRvIHRoZSBncm91cCAyXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdICUgMTAgPj0gMiAmJiBhcmdzWzBdICUgMTAgPD0gNCAmJiAoYXJnc1swXSAlIDEwMCA8IDEwIHx8XG5cdFx0XHRcdFx0XHRcdGFyZ3NbMF0gJSAxMDAgPj0gMjApKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE3OiAgV2Vsc2hcblx0XHRcdFx0XHQoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGFyZ3NbMF0gPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMV07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMl07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFyZ3NbMF0gIT09IDggJiYgYXJnc1swXSAhPT0gMTEpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1s0XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly8gMTg6ICBKYXZhbmVzZVxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKGFyZ3NbMF0gPT09IDApID8gYXJnc1sxXSA6IGFyZ3NbMl07XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vIDE5OiAgQ29ybmlzaFxuXHRcdFx0XHRcdCguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYXJnc1swXSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1sxXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1syXTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gMykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYXJnc1szXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHQvLyAyMDogIE1hbmRpbmthXG5cdFx0XHRcdFx0KC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhcmdzWzBdID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhcmdzWzBdID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhcmdzWzJdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFyZ3NbM107XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdF07XG5cdFx0XHR9KSgpO1xuXG5cdFx0XHQvLyBQZXJmb3JtIHBsdXJhbCBmb3JtIG9yIHJldHVybiBvcmlnaW5hbCB0ZXh0XG5cdFx0XHRyZXR1cm4gX3BsdXJhbEZvcm1zW2Zvcm1dLmFwcGx5KG51bGwsIFtudW1iZXJdLmNvbmNhdChpbnB1dCkpO1xuXHRcdH07XG5cblx0XHQvLyBGZXRjaCB0aGUgbG9jYWxpemVkIHZlcnNpb24gb2YgdGhlIHN0cmluZ1xuXHRcdGlmIChpMThuW2xhbmd1YWdlXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzdHIgPSBpMThuW2xhbmd1YWdlXVttZXNzYWdlXTtcblx0XHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdHBsdXJhbEZvcm0gPSBpMThuW2xhbmd1YWdlXVsnbWVqcy5wbHVyYWwtZm9ybSddO1xuXHRcdFx0XHRzdHIgPSBfcGx1cmFsLmFwcGx5KG51bGwsIFtzdHIsIHBsdXJhbFBhcmFtLCBwbHVyYWxGb3JtXSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gZGVmYXVsdCBsYW5ndWFnZSBpZiByZXF1ZXN0ZWQgdWlkIGlzIG5vdCB0cmFuc2xhdGVkXG5cdFx0aWYgKCFzdHIgJiYgaTE4bi5lbikge1xuXHRcdFx0c3RyID0gaTE4bi5lblttZXNzYWdlXTtcblx0XHRcdGlmIChwbHVyYWxQYXJhbSAhPT0gbnVsbCAmJiB0eXBlb2YgcGx1cmFsUGFyYW0gPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdHBsdXJhbEZvcm0gPSBpMThuLmVuWydtZWpzLnBsdXJhbC1mb3JtJ107XG5cdFx0XHRcdHN0ciA9IF9wbHVyYWwuYXBwbHkobnVsbCwgW3N0ciwgcGx1cmFsUGFyYW0sIHBsdXJhbEZvcm1dKTtcblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEFzIGEgbGFzdCByZXNvcnQsIHVzZSB0aGUgcmVxdWVzdGVkIHVpZCwgdG8gbWltaWMgb3JpZ2luYWwgYmVoYXZpb3Igb2YgaTE4biB1dGlsc1xuXHRcdC8vIChpbiB3aGljaCB1aWQgd2FzIHRoZSBlbmdsaXNoIHRleHQpXG5cdFx0c3RyID0gc3RyIHx8IG1lc3NhZ2U7XG5cblx0XHQvLyBSZXBsYWNlIHRva2VuXG5cdFx0aWYgKHBsdXJhbFBhcmFtICE9PSBudWxsICYmIHR5cGVvZiBwbHVyYWxQYXJhbSA9PT0gJ251bWJlcicpIHtcblx0XHRcdHN0ciA9IHN0ci5yZXBsYWNlKCclMScsIHBsdXJhbFBhcmFtKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXNjYXBlSFRNTChzdHIpO1xuXG5cdH1cblxuXHRyZXR1cm4gbWVzc2FnZTtcbn07XG5cbm1lanMuaTE4biA9IGkxOG47XG5cbi8vIGBpMThuYCBjb21wYXRpYmlsaXR5IHdvcmtmbG93IHdpdGggV29yZFByZXNzXG5pZiAodHlwZW9mIG1lanNMMTBuICE9PSAndW5kZWZpbmVkJykge1xuXHRtZWpzLmkxOG4ubGFuZ3VhZ2UobWVqc0wxMG4ubGFuZ3VhZ2UsIG1lanNMMTBuLnN0cmluZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpMThuOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi9tZWpzJztcbmltcG9ydCB7Z2V0VHlwZUZyb21GaWxlLCBmb3JtYXRUeXBlLCBhYnNvbHV0aXplVXJsfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuL3JlbmRlcmVyJztcblxuLyoqXG4gKiBNZWRpYSBDb3JlXG4gKlxuICogVGhpcyBjbGFzcyBpcyB0aGUgZm91bmRhdGlvbiB0byBjcmVhdGUvcmVuZGVyIGRpZmZlcmVudCBtZWRpYSBmb3JtYXRzLlxuICogQGNsYXNzIE1lZGlhRWxlbWVudFxuICovXG5jbGFzcyBNZWRpYUVsZW1lbnQge1xuXG5cdGNvbnN0cnVjdG9yIChpZE9yTm9kZSwgb3B0aW9ucykge1xuXHRcdFxuXHRcdGxldCB0ID0gdGhpcztcblx0XHRcblx0XHR0LmRlZmF1bHRzID0ge1xuXHRcdFx0LyoqXG5cdFx0XHQgKiBMaXN0IG9mIHRoZSByZW5kZXJlcnMgdG8gdXNlXG5cdFx0XHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdFx0XHQgKi9cblx0XHRcdHJlbmRlcmVyczogW10sXG5cdFx0XHQvKipcblx0XHRcdCAqIE5hbWUgb2YgTWVkaWFFbGVtZW50IGNvbnRhaW5lclxuXHRcdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHRcdCAqL1xuXHRcdFx0ZmFrZU5vZGVOYW1lOiAnbWVkaWFlbGVtZW50d3JhcHBlcicsXG5cdFx0XHQvKipcblx0XHRcdCAqIFRoZSBwYXRoIHdoZXJlIHNoaW1zIGFyZSBsb2NhdGVkXG5cdFx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdFx0ICovXG5cdFx0XHRwbHVnaW5QYXRoOiAnYnVpbGQvJ1xuXHRcdH07XG5cblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih0LmRlZmF1bHRzLCBvcHRpb25zKTtcblxuXHRcdC8vIGNyZWF0ZSBvdXIgbm9kZSAobm90ZTogb2xkZXIgdmVyc2lvbnMgb2YgaU9TIGRvbid0IHN1cHBvcnQgT2JqZWN0LmRlZmluZVByb3BlcnR5IG9uIERPTSBub2Rlcylcblx0XHR0Lm1lZGlhRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy5mYWtlTm9kZU5hbWUpO1xuXHRcdHQubWVkaWFFbGVtZW50Lm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cdFx0bGV0XG5cdFx0XHRpZCA9IGlkT3JOb2RlLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0aWYgKHR5cGVvZiBpZE9yTm9kZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkT3JOb2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID0gaWRPck5vZGU7XG5cdFx0XHRpZCA9IGlkT3JOb2RlLmlkO1xuXHRcdH1cblxuXHRcdGlkID0gaWQgfHwgYG1lanNfJHsoTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIpKX1gO1xuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gbnVsbCAmJlxuXHRcdFx0dC5tZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQpIHtcblx0XHRcdC8vIGNoYW5nZSBpZFxuXHRcdFx0dC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpZH1fZnJvbV9tZWpzYCk7XG5cblx0XHRcdC8vIGFkZCBuZXh0IHRvIHRoaXMgb25lXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodC5tZWRpYUVsZW1lbnQsIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cblx0XHRcdC8vIGluc2VydCB0aGlzIG9uZSBpbnNpZGVcblx0XHRcdHQubWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRPRE86IHdoZXJlIHRvIHB1dCB0aGUgbm9kZT9cblx0XHR9XG5cblx0XHR0Lm1lZGlhRWxlbWVudC5pZCA9IGlkO1xuXHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVycyA9IHt9O1xuXHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyID0gbnVsbDtcblx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSBudWxsO1xuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSB3aGV0aGVyIHRoZSByZW5kZXJlciB3YXMgZm91bmQgb3Igbm90XG5cdFx0ICpcblx0XHQgKiBAcHVibGljXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHJlbmRlcmVyTmFtZVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXNcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdHQubWVkaWFFbGVtZW50LmNoYW5nZVJlbmRlcmVyID0gKHJlbmRlcmVyTmFtZSwgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0XHRsZXQgdCA9IHRoaXM7XG5cblx0XHRcdC8vIGNoZWNrIGZvciBhIG1hdGNoIG9uIHRoZSBjdXJyZW50IHJlbmRlcmVyXG5cdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCAmJlxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5uYW1lID09PSByZW5kZXJlck5hbWUpIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIucGF1c2UoKTtcblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3ApIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuc2hvdygpO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zZXRTcmMobWVkaWFGaWxlc1swXS5zcmMpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgZXhpc3RpbmcgcmVuZGVyZXIgaXMgbm90IHRoZSByaWdodCBvbmUsIHRoZW4gaGlkZSBpdFxuXHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIucGF1c2UoKTtcblx0XHRcdFx0aWYgKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnN0b3ApIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlci5zdG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZWUgaWYgd2UgaGF2ZSB0aGUgcmVuZGVyZXIgYWxyZWFkeSBjcmVhdGVkXG5cdFx0XHRsZXQgbmV3UmVuZGVyZXIgPSB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlcnNbcmVuZGVyZXJOYW1lXSxcblx0XHRcdFx0bmV3UmVuZGVyZXJUeXBlID0gbnVsbDtcblxuXHRcdFx0aWYgKG5ld1JlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgbmV3UmVuZGVyZXIgIT09IG51bGwpIHtcblx0XHRcdFx0bmV3UmVuZGVyZXIuc2hvdygpO1xuXHRcdFx0XHRuZXdSZW5kZXJlci5zZXRTcmMobWVkaWFGaWxlc1swXS5zcmMpO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG5ld1JlbmRlcmVyO1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlck5hbWUgPSByZW5kZXJlck5hbWU7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcmVuZGVyZXJBcnJheSA9IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzLmxlbmd0aCA/IHQubWVkaWFFbGVtZW50Lm9wdGlvbnMucmVuZGVyZXJzIDpcblx0XHRcdFx0cmVuZGVyZXIub3JkZXI7XG5cblx0XHRcdC8vIGZpbmQgdGhlIGRlc2lyZWQgcmVuZGVyZXIgaW4gdGhlIGFycmF5IG9mIHBvc3NpYmxlIG9uZXNcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gcmVuZGVyZXJBcnJheS5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0Y29uc3QgaW5kZXggPSByZW5kZXJlckFycmF5W2ldO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PT0gcmVuZGVyZXJOYW1lKSB7XG5cblx0XHRcdFx0XHQvLyBjcmVhdGUgdGhlIHJlbmRlcmVyXG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZXJMaXN0ID0gcmVuZGVyZXIucmVuZGVyZXJzO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyVHlwZSA9IHJlbmRlcmVyTGlzdFtpbmRleF07XG5cblx0XHRcdFx0XHRsZXQgcmVuZGVyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obmV3UmVuZGVyZXJUeXBlLm9wdGlvbnMsIHQubWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXHRcdFx0XHRcdG5ld1JlbmRlcmVyID0gbmV3UmVuZGVyZXJUeXBlLmNyZWF0ZSh0Lm1lZGlhRWxlbWVudCwgcmVuZGVyT3B0aW9ucywgbWVkaWFGaWxlcyk7XG5cdFx0XHRcdFx0bmV3UmVuZGVyZXIubmFtZSA9IHJlbmRlcmVyTmFtZTtcblxuXHRcdFx0XHRcdC8vIHN0b3JlIGZvciBsYXRlclxuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyc1tuZXdSZW5kZXJlclR5cGUubmFtZV0gPSBuZXdSZW5kZXJlcjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9IG5ld1JlbmRlcmVyO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyTmFtZSA9IHJlbmRlcmVyTmFtZTtcblxuXHRcdFx0XHRcdG5ld1JlbmRlcmVyLnNob3coKTtcblxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogU2V0IHRoZSBlbGVtZW50IGRpbWVuc2lvbnMgYmFzZWQgb24gc2VsZWN0ZWQgcmVuZGVyZXIncyBzZXRTaXplIG1ldGhvZFxuXHRcdCAqXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcblx0XHQgKi9cblx0XHR0Lm1lZGlhRWxlbWVudC5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdGlmICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YWRkUHJvcGVydHkgPSAob2JqLCBuYW1lLCBvbkdldCwgb25TZXQpID0+IHtcblxuXHRcdFx0XHQvLyB3cmFwcGVyIGZ1bmN0aW9uc1xuXHRcdFx0XHRsZXQgb2xkVmFsdWUgPSBvYmpbbmFtZV07XG5cdFx0XHRcdGNvbnN0XG5cdFx0XHRcdFx0Z2V0Rm4gPSAoKSA9PiBvbkdldC5hcHBseShvYmosIFtvbGRWYWx1ZV0pLFxuXHRcdFx0XHRcdHNldEZuID0gKG5ld1ZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0XHRvbGRWYWx1ZSA9IG9uU2V0LmFwcGx5KG9iaiwgW25ld1ZhbHVlXSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb2xkVmFsdWU7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBNb2Rlcm4gYnJvd3NlcnMsIElFOSsgKElFOCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLCBub3Qgbm9ybWFsIEpTIG9iamVjdHMpXG5cdFx0XHRcdGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcblxuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcblx0XHRcdFx0XHRcdGdldDogZ2V0Rm4sXG5cdFx0XHRcdFx0XHRzZXQ6IHNldEZuXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQvLyBPbGRlciBGaXJlZm94XG5cdFx0XHRcdH0gZWxzZSBpZiAob2JqLl9fZGVmaW5lR2V0dGVyX18pIHtcblxuXHRcdFx0XHRcdG9iai5fX2RlZmluZUdldHRlcl9fKG5hbWUsIGdldEZuKTtcblx0XHRcdFx0XHRvYmouX19kZWZpbmVTZXR0ZXJfXyhuYW1lLCBzZXRGbik7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0XHRpZiAocHJvcE5hbWUgIT09ICdzcmMnKSB7XG5cblx0XHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWAsXG5cdFx0XHRcdFx0XHRnZXRGbiA9ICgpID0+ICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsKSA/IHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW2BnZXQke2NhcE5hbWV9YF0oKSA6IG51bGwsXG5cdFx0XHRcdFx0XHRzZXRGbiA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IHVuZGVmaW5lZCAmJiB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW2BzZXQke2NhcE5hbWV9YF0odmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0YWRkUHJvcGVydHkodC5tZWRpYUVsZW1lbnQsIHByb3BOYW1lLCBnZXRGbiwgc2V0Rm4pO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50W2BnZXQke2NhcE5hbWV9YF0gPSBnZXRGbjtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudFtgc2V0JHtjYXBOYW1lfWBdID0gc2V0Rm47XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvLyBgc3JjYCBpcyBhIHByb3BlcnR5IHNlcGFyYXRlZCBmcm9tIHRoZSBvdGhlcnMgc2luY2UgaXQgY2FycmllcyB0aGUgbG9naWMgdG8gc2V0IHRoZSBwcm9wZXIgcmVuZGVyZXJcblx0XHRcdC8vIGJhc2VkIG9uIHRoZSBtZWRpYSBmaWxlcyBkZXRlY3RlZFxuXHRcdFx0Z2V0U3JjID0gKCkgPT4gKHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSB1bmRlZmluZWQgJiYgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgIT09IG51bGwpID8gdC5tZWRpYUVsZW1lbnQucmVuZGVyZXIuZ2V0U3JjKCkgOiBudWxsLFxuXHRcdFx0c2V0U3JjID0gKHZhbHVlKSA9PiB7XG5cblx0XHRcdFx0bGV0IG1lZGlhRmlsZXMgPSBbXTtcblxuXHRcdFx0XHQvLyBjbGVhbiB1cCBVUkxzXG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHNyYzogdmFsdWUsXG5cdFx0XHRcdFx0XHR0eXBlOiB2YWx1ZSA/IGdldFR5cGVGcm9tRmlsZSh2YWx1ZSkgOiAnJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gdmFsdWUubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0c3JjID0gYWJzb2x1dGl6ZVVybCh2YWx1ZVtpXS5zcmMpLFxuXHRcdFx0XHRcdFx0XHR0eXBlID0gdmFsdWVbaV0udHlwZVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRtZWRpYUZpbGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRzcmM6IHNyYyxcblx0XHRcdFx0XHRcdFx0dHlwZTogKHR5cGUgPT09ICcnIHx8IHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSAmJiBzcmMgP1xuXHRcdFx0XHRcdFx0XHRcdGdldFR5cGVGcm9tRmlsZShzcmMpIDogdHlwZVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaW5kIGEgcmVuZGVyZXIgYW5kIFVSTCBtYXRjaFxuXHRcdFx0XHRsZXRcblx0XHRcdFx0XHRyZW5kZXJJbmZvID0gcmVuZGVyZXIuc2VsZWN0KG1lZGlhRmlsZXMsXG5cdFx0XHRcdFx0XHQodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMubGVuZ3RoID8gdC5tZWRpYUVsZW1lbnQub3B0aW9ucy5yZW5kZXJlcnMgOiBbXSkpLFxuXHRcdFx0XHRcdGV2ZW50XG5cdFx0XHRcdDtcblxuXHRcdFx0XHQvLyBFbnN1cmUgdGhhdCB0aGUgb3JpZ2luYWwgZ2V0cyB0aGUgZmlyc3Qgc291cmNlIGZvdW5kXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIChtZWRpYUZpbGVzWzBdLnNyYyB8fCAnJykpO1xuXG5cdFx0XHRcdC8vIGRpZCB3ZSBmaW5kIGEgcmVuZGVyZXI/XG5cdFx0XHRcdGlmIChyZW5kZXJJbmZvID09PSBudWxsKSB7XG5cdFx0XHRcdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudCgnZXJyb3InLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdGV2ZW50Lm1lc3NhZ2UgPSAnTm8gcmVuZGVyZXIgZm91bmQnO1xuXHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHR1cm4gb24gdGhlIHJlbmRlcmVyICh0aGlzIGNoZWNrcyBmb3IgdGhlIGV4aXN0aW5nIHJlbmRlcmVyIGFscmVhZHkpXG5cdFx0XHRcdHQubWVkaWFFbGVtZW50LmNoYW5nZVJlbmRlcmVyKHJlbmRlckluZm8ucmVuZGVyZXJOYW1lLCBtZWRpYUZpbGVzKTtcblxuXHRcdFx0XHRpZiAodC5tZWRpYUVsZW1lbnQucmVuZGVyZXIgPT09IHVuZGVmaW5lZCB8fCB0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoJ2Vycm9yJywgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHRldmVudC5tZXNzYWdlID0gJ0Vycm9yIGNyZWF0aW5nIHJlbmRlcmVyJztcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFzc2lnbk1ldGhvZHMgPSAobWV0aG9kTmFtZSkgPT4ge1xuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgY3VycmVudCByZW5kZXJlclxuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudFttZXRob2ROYW1lXSA9ICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuICh0Lm1lZGlhRWxlbWVudC5yZW5kZXJlciAhPT0gdW5kZWZpbmVkICYmIHQubWVkaWFFbGVtZW50LnJlbmRlcmVyICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHR0eXBlb2YgdC5tZWRpYUVsZW1lbnQucmVuZGVyZXJbbWV0aG9kTmFtZV0gPT09ICdmdW5jdGlvbicpID9cblx0XHRcdFx0XHRcdHQubWVkaWFFbGVtZW50LnJlbmRlcmVyW21ldGhvZE5hbWVdKGFyZ3MpIDogbnVsbDtcblx0XHRcdFx0fTtcblxuXHRcdFx0fTtcblxuXHRcdC8vIEFzc2lnbiBhbGwgbWV0aG9kcy9wcm9wZXJ0aWVzL2V2ZW50cyB0byBmYWtlIG5vZGUgaWYgcmVuZGVyZXIgd2FzIGZvdW5kXG5cdFx0YWRkUHJvcGVydHkodC5tZWRpYUVsZW1lbnQsICdzcmMnLCBnZXRTcmMsIHNldFNyYyk7XG5cdFx0dC5tZWRpYUVsZW1lbnQuZ2V0U3JjID0gZ2V0U3JjO1xuXHRcdHQubWVkaWFFbGVtZW50LnNldFNyYyA9IHNldFNyYztcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIElFICYmIGlPU1xuXHRcdGlmICghdC5tZWRpYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHMgPSB7fTtcblxuXHRcdFx0Ly8gc3RhcnQ6IGZha2UgZXZlbnRzXG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5hZGRFdmVudExpc3RlbmVyID0gKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+IHtcblx0XHRcdFx0Ly8gY3JlYXRlIG9yIGZpbmQgdGhlIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgdGhpcyBldmVudE5hbWVcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV0gPSB0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcblxuXHRcdFx0XHQvLyBwdXNoIHRoZSBjYWxsYmFjayBpbnRvIHRoZSBzdGFja1xuXHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcblx0XHRcdH07XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyID0gKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+IHtcblx0XHRcdFx0Ly8gbm8gZXZlbnROYW1lIG1lYW5zIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG5cdFx0XHRcdGlmICghZXZlbnROYW1lKSB7XG5cdFx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuZXZlbnRzID0ge307XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzZWUgaWYgd2UgaGF2ZSBhbnkgY2FsbGJhY2tzIGZvciB0aGlzIGV2ZW50TmFtZVxuXHRcdFx0XHRsZXQgY2FsbGJhY2tzID0gdC5tZWRpYUVsZW1lbnQuZXZlbnRzW2V2ZW50TmFtZV07XG5cblx0XHRcdFx0aWYgKCFjYWxsYmFja3MpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNoZWNrIGZvciBhIHNwZWNpZmljIGNhbGxiYWNrXG5cdFx0XHRcdGlmICghY2FsbGJhY2spIHtcblx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXSA9IFtdO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBzcGVjaWZpYyBjYWxsYmFja1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdGlmIChjYWxsYmFja3NbaV0gPT09IGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHR0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcblx0XHRcdCAqL1xuXHRcdFx0dC5tZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudCA9IChldmVudCkgPT4ge1xuXG5cdFx0XHRcdGxldCBjYWxsYmFja3MgPSB0Lm1lZGlhRWxlbWVudC5ldmVudHNbZXZlbnQudHlwZV07XG5cblx0XHRcdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrc1tpXS5hcHBseShudWxsLCBbZXZlbnRdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSAhPT0gbnVsbCkge1xuXHRcdFx0bGV0IG1lZGlhRmlsZXMgPSBbXTtcblxuXHRcdFx0c3dpdGNoICh0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdFx0XHRcdGNhc2UgJ2lmcmFtZSc6XG5cdFx0XHRcdFx0bWVkaWFGaWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHR5cGU6ICcnLFxuXHRcdFx0XHRcdFx0c3JjOiB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnYXVkaW8nOlxuXHRcdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRuLFxuXHRcdFx0XHRcdFx0c3JjLFxuXHRcdFx0XHRcdFx0dHlwZSxcblx0XHRcdFx0XHRcdHNvdXJjZXMgPSB0Lm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuY2hpbGROb2Rlcy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRub2RlU291cmNlID0gdC5tZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnc3JjJylcblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdC8vIENvbnNpZGVyIGlmIG5vZGUgY29udGFpbnMgdGhlIGBzcmNgIGFuZCBgdHlwZWAgYXR0cmlidXRlc1xuXHRcdFx0XHRcdGlmIChub2RlU291cmNlKSB7XG5cdFx0XHRcdFx0XHRsZXQgbm9kZSA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZTtcblx0XHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IGZvcm1hdFR5cGUobm9kZVNvdXJjZSwgbm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSksXG5cdFx0XHRcdFx0XHRcdHNyYzogbm9kZVNvdXJjZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdGVzdCA8c291cmNlPiB0eXBlcyB0byBzZWUgaWYgdGhleSBhcmUgdXNhYmxlXG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHNvdXJjZXM7IGkrKykge1xuXHRcdFx0XHRcdFx0biA9IHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKG4ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIG4udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc291cmNlJykge1xuXHRcdFx0XHRcdFx0XHRzcmMgPSBuLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBmb3JtYXRUeXBlKHNyYywgbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhRmlsZXMucHVzaCh7dHlwZTogdHlwZSwgc3JjOiBzcmN9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dC5tZWRpYUVsZW1lbnQuc3JjID0gbWVkaWFGaWxlcztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodC5tZWRpYUVsZW1lbnQub3B0aW9ucy5zdWNjZXNzKSB7XG5cdFx0XHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zLnN1Y2Nlc3ModC5tZWRpYUVsZW1lbnQsIHQubWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0fVxuXG5cdFx0Ly8gQHRvZG86IFZlcmlmeSBpZiB0aGlzIGlzIG5lZWRlZFxuXHRcdC8vIGlmICh0Lm1lZGlhRWxlbWVudC5vcHRpb25zLmVycm9yKSB7XG5cdFx0Ly8gXHR0Lm1lZGlhRWxlbWVudC5vcHRpb25zLmVycm9yKHRoaXMubWVkaWFFbGVtZW50LCB0aGlzLm1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdC8vIH1cblxuXHRcdHJldHVybiB0Lm1lZGlhRWxlbWVudDtcblx0fVxufVxuXG53aW5kb3cuTWVkaWFFbGVtZW50ID0gTWVkaWFFbGVtZW50O1xuXG5leHBvcnQgZGVmYXVsdCBNZWRpYUVsZW1lbnQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG4vLyBOYW1lc3BhY2VcbmxldCBtZWpzID0ge307XG5cbi8vIHZlcnNpb24gbnVtYmVyXG5tZWpzLnZlcnNpb24gPSAnMy4wLjEnO1xuXG4vLyBCYXNpYyBIVE1MNSBzZXR0aW5nc1xubWVqcy5odG1sNW1lZGlhID0ge1xuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0cHJvcGVydGllczogW1xuXHRcdC8vIEdFVC9TRVRcblx0XHQndm9sdW1lJywgJ3NyYycsICdjdXJyZW50VGltZScsICdtdXRlZCcsXG5cblx0XHQvLyBHRVQgb25seVxuXHRcdCdkdXJhdGlvbicsICdwYXVzZWQnLCAnZW5kZWQnLFxuXG5cdFx0Ly8gT1RIRVJTXG5cdFx0J2Vycm9yJywgJ2N1cnJlbnRTcmMnLCAnbmV0d29ya1N0YXRlJywgJ3ByZWxvYWQnLCAnYnVmZmVyZWQnLCAnYnVmZmVyZWRCeXRlcycsICdidWZmZXJlZFRpbWUnLCAncmVhZHlTdGF0ZScsICdzZWVraW5nJyxcblx0XHQnaW5pdGlhbFRpbWUnLCAnc3RhcnRPZmZzZXRUaW1lJywgJ2RlZmF1bHRQbGF5YmFja1JhdGUnLCAncGxheWJhY2tSYXRlJywgJ3BsYXllZCcsICdzZWVrYWJsZScsICdhdXRvcGxheScsICdsb29wJywgJ2NvbnRyb2xzJ1xuXHRdLFxuXHQvKipcblx0ICogQHR5cGUge1N0cmluZ1tdfVxuXHQgKi9cblx0bWV0aG9kczogW1xuXHRcdCdsb2FkJywgJ3BsYXknLCAncGF1c2UnLCAnY2FuUGxheVR5cGUnXG5cdF0sXG5cdC8qKlxuXHQgKiBAdHlwZSB7U3RyaW5nW119XG5cdCAqL1xuXHRldmVudHM6IFtcblx0XHQnbG9hZHN0YXJ0JywgJ3Byb2dyZXNzJywgJ3N1c3BlbmQnLCAnYWJvcnQnLCAnZXJyb3InLCAnZW1wdGllZCcsICdzdGFsbGVkJywgJ3BsYXknLCAncGF1c2UnLCAnbG9hZGVkbWV0YWRhdGEnLFxuXHRcdCdsb2FkZWRkYXRhJywgJ3dhaXRpbmcnLCAncGxheWluZycsICdjYW5wbGF5JywgJ2NhbnBsYXl0aHJvdWdoJywgJ3NlZWtpbmcnLCAnc2Vla2VkJywgJ3RpbWV1cGRhdGUnLCAnZW5kZWQnLFxuXHRcdCdyYXRlY2hhbmdlJywgJ2R1cmF0aW9uY2hhbmdlJywgJ3ZvbHVtZWNoYW5nZSdcblx0XSxcblx0LyoqXG5cdCAqIEB0eXBlIHtTdHJpbmdbXX1cblx0ICovXG5cdG1lZGlhVHlwZXM6IFtcblx0XHQnYXVkaW8vbXAzJywgJ2F1ZGlvL29nZycsICdhdWRpby9vZ2EnLCAnYXVkaW8vd2F2JywgJ2F1ZGlvL3gtd2F2JywgJ2F1ZGlvL3dhdmUnLCAnYXVkaW8veC1wbi13YXYnLCAnYXVkaW8vbXBlZycsICdhdWRpby9tcDQnLFxuXHRcdCd2aWRlby9tcDQnLCAndmlkZW8vd2VibScsICd2aWRlby9vZ2cnXG5cdF1cbn07XG5cbndpbmRvdy5tZWpzID0gbWVqcztcblxuZXhwb3J0IGRlZmF1bHQgbWVqczsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4vbWVqcyc7XG5cbi8qKlxuICpcbiAqIENsYXNzIHRvIG1hbmFnZSByZW5kZXJlciBzZWxlY3Rpb24gYW5kIGFkZGl0aW9uLlxuICogQGNsYXNzIFJlbmRlcmVyXG4gKi9cbmNsYXNzIFJlbmRlcmVyIHtcblxuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0dGhpcy5yZW5kZXJlcnMgPSB7fTtcblx0XHR0aGlzLm9yZGVyID0gW107XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgYSBuZXcgcmVuZGVyZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlciAtIEFuIG9iamVjdCB3aXRoIGFsbCB0aGUgcmVuZGVyZWQgaW5mb3JtYXRpb24gKG5hbWUgUkVRVUlSRUQpXG5cdCAqIEBtZXRob2QgYWRkXG5cdCAqL1xuXHRhZGQgKHJlbmRlcmVyKSB7XG5cblx0XHRpZiAocmVuZGVyZXIubmFtZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdyZW5kZXJlciBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgYG5hbWVgIHByb3BlcnR5Jyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXJlcnNbcmVuZGVyZXIubmFtZV0gPSByZW5kZXJlcjtcblx0XHR0aGlzLm9yZGVyLnB1c2gocmVuZGVyZXIubmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogSXRlcmF0ZSBhIGxpc3Qgb2YgcmVuZGVyZXJzIHRvIGRldGVybWluZSB3aGljaCBvbmUgc2hvdWxkIHRoZSBwbGF5ZXIgdXNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIC0gQSBsaXN0IG9mIHNvdXJjZSBhbmQgdHlwZSBvYnRhaW5lZCBmcm9tIHZpZGVvL2F1ZGlvL3NvdXJjZSB0YWdzOiBbe3NyYzonJyx0eXBlOicnfV1cblx0ICogQHBhcmFtIHs/U3RyaW5nW119IHJlbmRlcmVycyAtIE9wdGlvbmFsIGxpc3Qgb2YgcHJlLXNlbGVjdGVkIHJlbmRlcmVyc1xuXHQgKiBAcmV0dXJuIHs/T2JqZWN0fSBUaGUgcmVuZGVyZXIncyBuYW1lIGFuZCBzb3VyY2Ugc2VsZWN0ZWRcblx0ICogQG1ldGhvZCBzZWxlY3Rcblx0ICovXG5cdHNlbGVjdCAobWVkaWFGaWxlcywgcmVuZGVyZXJzID0gW10pIHtcblxuXHRcdHJlbmRlcmVycyA9IHJlbmRlcmVycy5sZW5ndGggPyByZW5kZXJlcnM6IHRoaXMub3JkZXI7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0bGV0XG5cdFx0XHRcdGtleSA9IHJlbmRlcmVyc1tpXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyc1trZXldXG5cdFx0XHQ7XG5cblx0XHRcdGlmIChyZW5kZXJlciAhPT0gbnVsbCAmJiByZW5kZXJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSAwLCBqbCA9IG1lZGlhRmlsZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcmVuZGVyZXIuY2FuUGxheVR5cGUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG1lZGlhRmlsZXNbal0udHlwZSA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFx0XHRcdHJlbmRlcmVyLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbal0udHlwZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHJlbmRlcmVyTmFtZTogcmVuZGVyZXIubmFtZSxcblx0XHRcdFx0XHRcdFx0c3JjOiAgbWVkaWFGaWxlc1tqXS5zcmNcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBTZXR0ZXJzL2dldHRlcnNcblxuXHRzZXQgb3JkZXIob3JkZXIpIHtcblxuXHRcdGlmICghQXJyYXkuaXNBcnJheShvcmRlcikpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ29yZGVyIG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncy4nKTtcblx0XHR9XG5cblx0XHR0aGlzLl9vcmRlciA9IG9yZGVyO1xuXHR9XG5cblx0c2V0IHJlbmRlcmVycyhyZW5kZXJlcnMpIHtcblxuXHRcdGlmIChyZW5kZXJlcnMgIT09IG51bGwgJiYgdHlwZW9mIHJlbmRlcmVycyAhPT0gJ29iamVjdCcpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlbmRlcmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIG9iamVjdHMuJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcmVuZGVyZXJzID0gcmVuZGVyZXJzO1xuXHR9XG5cblx0Z2V0IHJlbmRlcmVycygpIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVuZGVyZXJzO1xuXHR9XG5cblx0Z2V0IG9yZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLl9vcmRlcjtcblx0fVxufVxuXG5leHBvcnQgbGV0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCk7XG5cbm1lanMuUmVuZGVyZXJzID0gcmVuZGVyZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiFcbiAqIFRoaXMgaXMgYSBgaTE4bmAgbGFuZ3VhZ2Ugb2JqZWN0LlxuICpcbiAqIEVuZ2xpc2g7IFRoaXMgY2FuIHNlcnZlIGFzIGEgdGVtcGxhdGUgZm9yIG90aGVyIGxhbmd1YWdlcyB0byB0cmFuc2xhdGVcbiAqXG4gKiBAYXV0aG9yXG4gKiAgIFRCRFxuICogICBTYXNjaGEgR3JldWVsIChUd2l0dGVyOiBAU29mdENyZWF0UilcbiAqXG4gKiBAc2VlIGNvcmUvaTE4bi5qc1xuICovXG5leHBvcnQgY29uc3QgRU4gPSB7XG5cdFwibWVqcy5wbHVyYWwtZm9ybVwiOiAxLFxuXG5cdC8vIHJlbmRlcmVycy9mbGFzaC5qc1xuXHRcIm1lanMuaW5zdGFsbC1mbGFzaFwiOiBcIllvdSBhcmUgdXNpbmcgYSBicm93c2VyIHRoYXQgZG9lcyBub3QgaGF2ZSBGbGFzaCBwbGF5ZXIgZW5hYmxlZCBvciBpbnN0YWxsZWQuIFBsZWFzZSB0dXJuIG9uIHlvdXIgRmxhc2ggcGxheWVyIHBsdWdpbiBvciBkb3dubG9hZCB0aGUgbGF0ZXN0IHZlcnNpb24gZnJvbSBodHRwczovL2dldC5hZG9iZS5jb20vZmxhc2hwbGF5ZXIvXCIsXG5cblx0Ly8gZmVhdHVyZXMvY29udGV4dG1lbnUuanNcblx0XCJtZWpzLmZ1bGxzY3JlZW4tb2ZmXCI6IFwiVHVybiBvZmYgRnVsbHNjcmVlblwiLFxuXHRcIm1lanMuZnVsbHNjcmVlbi1vblwiOiBcIkdvIEZ1bGxzY3JlZW5cIixcblx0XCJtZWpzLmRvd25sb2FkLXZpZGVvXCI6IFwiRG93bmxvYWQgVmlkZW9cIixcblxuXHQvLyBmZWF0dXJlcy9mdWxsc2NyZWVuLmpzXG5cdFwibWVqcy5mdWxsc2NyZWVuXCI6IFwiRnVsbHNjcmVlblwiLFxuXG5cdC8vIGZlYXR1cmVzL2p1bXBmb3J3YXJkLmpzXG5cdFwibWVqcy50aW1lLWp1bXAtZm9yd2FyZFwiOiBbXCJKdW1wIGZvcndhcmQgMSBzZWNvbmRcIiwgXCJKdW1wIGZvcndhcmQgJTEgc2Vjb25kc1wiXSxcblxuXHQvLyBmZWF0dXJlcy9sb29wLmpzXG5cdFwibWVqcy5sb29wXCI6IFwiVG9nZ2xlIExvb3BcIixcblxuXHQvLyBmZWF0dXJlcy9wbGF5cGF1c2UuanNcblx0XCJtZWpzLnBsYXlcIjogXCJQbGF5XCIsXG5cdFwibWVqcy5wYXVzZVwiOiBcIlBhdXNlXCIsXG5cblx0Ly8gZmVhdHVyZXMvcG9zdHJvbGwuanNcblx0XCJtZWpzLmNsb3NlXCI6IFwiQ2xvc2VcIixcblxuXHQvLyBmZWF0dXJlcy9wcm9ncmVzcy5qc1xuXHRcIm1lanMudGltZS1zbGlkZXJcIjogXCJUaW1lIFNsaWRlclwiLFxuXHRcIm1lanMudGltZS1oZWxwLXRleHRcIjogXCJVc2UgTGVmdC9SaWdodCBBcnJvdyBrZXlzIHRvIGFkdmFuY2Ugb25lIHNlY29uZCwgVXAvRG93biBhcnJvd3MgdG8gYWR2YW5jZSB0ZW4gc2Vjb25kcy5cIixcblxuXHQvLyBmZWF0dXJlcy9za2lwYmFjay5qc1xuXHRcIm1lanMudGltZS1za2lwLWJhY2tcIjogW1wiU2tpcCBiYWNrIDEgc2Vjb25kXCIsIFwiU2tpcCBiYWNrICUxIHNlY29uZHNcIl0sXG5cblx0Ly8gZmVhdHVyZXMvdHJhY2tzLmpzXG5cdFwibWVqcy5jYXB0aW9ucy1zdWJ0aXRsZXNcIjogXCJDYXB0aW9ucy9TdWJ0aXRsZXNcIixcblx0XCJtZWpzLm5vbmVcIjogXCJOb25lXCIsXG5cblx0Ly8gZmVhdHVyZXMvdm9sdW1lLmpzXG5cdFwibWVqcy5tdXRlLXRvZ2dsZVwiOiBcIk11dGUgVG9nZ2xlXCIsXG5cdFwibWVqcy52b2x1bWUtaGVscC10ZXh0XCI6IFwiVXNlIFVwL0Rvd24gQXJyb3cga2V5cyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB2b2x1bWUuXCIsXG5cdFwibWVqcy51bm11dGVcIjogXCJVbm11dGVcIixcblx0XCJtZWpzLm11dGVcIjogXCJNdXRlXCIsXG5cdFwibWVqcy52b2x1bWUtc2xpZGVyXCI6IFwiVm9sdW1lIFNsaWRlclwiLFxuXG5cdC8vIGNvcmUvcGxheWVyLmpzXG5cdFwibWVqcy52aWRlby1wbGF5ZXJcIjogXCJWaWRlbyBQbGF5ZXJcIixcblx0XCJtZWpzLmF1ZGlvLXBsYXllclwiOiBcIkF1ZGlvIFBsYXllclwiLFxuXG5cdC8vIGZlYXR1cmVzL2Fkcy5qc1xuXHRcIm1lanMuYWQtc2tpcFwiOiBcIlNraXAgYWRcIixcblx0XCJtZWpzLmFkLXNraXAtaW5mb1wiOiBbXCJTa2lwIGluIDEgc2Vjb25kXCIsIFwiU2tpcCBpbiAlMSBzZWNvbmRzXCJdLFxuXG5cdC8vIGZlYXR1cmVzL3NvdXJjZWNob29zZXIuanNcblx0XCJtZWpzLnNvdXJjZS1jaG9vc2VyXCI6IFwiU291cmNlIENob29zZXJcIixcblxuXHQvLyBmZWF0dXJlcy9zdG9wLmpzXG5cdFwibWVqcy5zdG9wXCI6IFwiU3RvcFwiLFxuXG5cdC8vZmVhdHVyZXMvc3BlZWQuanNcblx0XCJtZWpzLnNwZWVkLXJhdGVcIiA6IFwiU3BlZWQgUmF0ZVwiLFxuXG5cdC8vZmVhdHVyZXMvcHJvZ3Jlc3MuanNcblx0XCJtZWpzLmxpdmUtYnJvYWRjYXN0XCIgOiBcIkxpdmUgQnJvYWRjYXN0XCIsXG5cblx0Ly8gZmVhdHVyZXMvdHJhY2tzLmpzXG5cdFwibWVqcy5hZnJpa2FhbnNcIjogXCJBZnJpa2FhbnNcIixcblx0XCJtZWpzLmFsYmFuaWFuXCI6IFwiQWxiYW5pYW5cIixcblx0XCJtZWpzLmFyYWJpY1wiOiBcIkFyYWJpY1wiLFxuXHRcIm1lanMuYmVsYXJ1c2lhblwiOiBcIkJlbGFydXNpYW5cIixcblx0XCJtZWpzLmJ1bGdhcmlhblwiOiBcIkJ1bGdhcmlhblwiLFxuXHRcIm1lanMuY2F0YWxhblwiOiBcIkNhdGFsYW5cIixcblx0XCJtZWpzLmNoaW5lc2VcIjogXCJDaGluZXNlXCIsXG5cdFwibWVqcy5jaGluZXNlLXNpbXBsaWZpZWRcIjogXCJDaGluZXNlIChTaW1wbGlmaWVkKVwiLFxuXHRcIm1lanMuY2hpbmVzZS10cmFkaXRpb25hbFwiOiBcIkNoaW5lc2UgKFRyYWRpdGlvbmFsKVwiLFxuXHRcIm1lanMuY3JvYXRpYW5cIjogXCJDcm9hdGlhblwiLFxuXHRcIm1lanMuY3plY2hcIjogXCJDemVjaFwiLFxuXHRcIm1lanMuZGFuaXNoXCI6IFwiRGFuaXNoXCIsXG5cdFwibWVqcy5kdXRjaFwiOiBcIkR1dGNoXCIsXG5cdFwibWVqcy5lbmdsaXNoXCI6IFwiRW5nbGlzaFwiLFxuXHRcIm1lanMuZXN0b25pYW5cIjogXCJFc3RvbmlhblwiLFxuXHRcIm1lanMuZmlsaXBpbm9cIjogXCJGaWxpcGlub1wiLFxuXHRcIm1lanMuZmlubmlzaFwiOiBcIkZpbm5pc2hcIixcblx0XCJtZWpzLmZyZW5jaFwiOiBcIkZyZW5jaFwiLFxuXHRcIm1lanMuZ2FsaWNpYW5cIjogXCJHYWxpY2lhblwiLFxuXHRcIm1lanMuZ2VybWFuXCI6IFwiR2VybWFuXCIsXG5cdFwibWVqcy5ncmVla1wiOiBcIkdyZWVrXCIsXG5cdFwibWVqcy5oYWl0aWFuLWNyZW9sZVwiOiBcIkhhaXRpYW4gQ3Jlb2xlXCIsXG5cdFwibWVqcy5oZWJyZXdcIjogXCJIZWJyZXdcIixcblx0XCJtZWpzLmhpbmRpXCI6IFwiSGluZGlcIixcblx0XCJtZWpzLmh1bmdhcmlhblwiOiBcIkh1bmdhcmlhblwiLFxuXHRcIm1lanMuaWNlbGFuZGljXCI6IFwiSWNlbGFuZGljXCIsXG5cdFwibWVqcy5pbmRvbmVzaWFuXCI6IFwiSW5kb25lc2lhblwiLFxuXHRcIm1lanMuaXJpc2hcIjogXCJJcmlzaFwiLFxuXHRcIm1lanMuaXRhbGlhblwiOiBcIkl0YWxpYW5cIixcblx0XCJtZWpzLmphcGFuZXNlXCI6IFwiSmFwYW5lc2VcIixcblx0XCJtZWpzLmtvcmVhblwiOiBcIktvcmVhblwiLFxuXHRcIm1lanMubGF0dmlhblwiOiBcIkxhdHZpYW5cIixcblx0XCJtZWpzLmxpdGh1YW5pYW5cIjogXCJMaXRodWFuaWFuXCIsXG5cdFwibWVqcy5tYWNlZG9uaWFuXCI6IFwiTWFjZWRvbmlhblwiLFxuXHRcIm1lanMubWFsYXlcIjogXCJNYWxheVwiLFxuXHRcIm1lanMubWFsdGVzZVwiOiBcIk1hbHRlc2VcIixcblx0XCJtZWpzLm5vcndlZ2lhblwiOiBcIk5vcndlZ2lhblwiLFxuXHRcIm1lanMucGVyc2lhblwiOiBcIlBlcnNpYW5cIixcblx0XCJtZWpzLnBvbGlzaFwiOiBcIlBvbGlzaFwiLFxuXHRcIm1lanMucG9ydHVndWVzZVwiOiBcIlBvcnR1Z3Vlc2VcIixcblx0XCJtZWpzLnJvbWFuaWFuXCI6IFwiUm9tYW5pYW5cIixcblx0XCJtZWpzLnJ1c3NpYW5cIjogXCJSdXNzaWFuXCIsXG5cdFwibWVqcy5zZXJiaWFuXCI6IFwiU2VyYmlhblwiLFxuXHRcIm1lanMuc2xvdmFrXCI6IFwiU2xvdmFrXCIsXG5cdFwibWVqcy5zbG92ZW5pYW5cIjogXCJTbG92ZW5pYW5cIixcblx0XCJtZWpzLnNwYW5pc2hcIjogXCJTcGFuaXNoXCIsXG5cdFwibWVqcy5zd2FoaWxpXCI6IFwiU3dhaGlsaVwiLFxuXHRcIm1lanMuc3dlZGlzaFwiOiBcIlN3ZWRpc2hcIixcblx0XCJtZWpzLnRhZ2Fsb2dcIjogXCJUYWdhbG9nXCIsXG5cdFwibWVqcy50aGFpXCI6IFwiVGhhaVwiLFxuXHRcIm1lanMudHVya2lzaFwiOiBcIlR1cmtpc2hcIixcblx0XCJtZWpzLnVrcmFpbmlhblwiOiBcIlVrcmFpbmlhblwiLFxuXHRcIm1lanMudmlldG5hbWVzZVwiOiBcIlZpZXRuYW1lc2VcIixcblx0XCJtZWpzLndlbHNoXCI6IFwiV2Vsc2hcIixcblx0XCJtZWpzLnlpZGRpc2hcIjogXCJZaWRkaXNoXCJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50LCBhZGRFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIERhaWx5TW90aW9uIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBEYWlseU1vdGlvbiBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZGFpbHltb3Rpb24uY29tL3BsYXllclxuICpcbiAqL1xuY29uc3QgRGFpbHlNb3Rpb25BcGkgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzU0RLU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzU0RLTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGlmcmFtZVF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgY3JlYXRpb24gb2YgPGlmcmFtZT5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0ZW5xdWV1ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRpZiAoRGFpbHlNb3Rpb25BcGkuaXNMb2FkZWQpIHtcblx0XHRcdERhaWx5TW90aW9uQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdERhaWx5TW90aW9uQXBpLmxvYWRJZnJhbWVBcGkoKTtcblx0XHRcdERhaWx5TW90aW9uQXBpLmlmcmFtZVF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBEYWlseU1vdGlvbiBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cdFx0aWYgKCFEYWlseU1vdGlvbkFwaS5pc1NES1N0YXJ0ZWQpIHtcblx0XHRcdGxldCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRlLmFzeW5jID0gdHJ1ZTtcblx0XHRcdGUuc3JjID0gJy8vYXBpLmRtY2RuLm5ldC9hbGwuanMnO1xuXHRcdFx0bGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG5cdFx0XHRzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIHMpO1xuXHRcdFx0RGFpbHlNb3Rpb25BcGkuaXNTREtTdGFydGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgRGFpbHlNb3Rpb24gPGlmcmFtZT4gZWxlbWVudCBjcmVhdGlvblxuXHQgKlxuXHQgKi9cblx0YXBpUmVhZHk6ICgpID0+IHtcblxuXHRcdERhaWx5TW90aW9uQXBpLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHREYWlseU1vdGlvbkFwaS5pc1NES0xvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoRGFpbHlNb3Rpb25BcGkuaWZyYW1lUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gRGFpbHlNb3Rpb25BcGkuaWZyYW1lUXVldWUucG9wKCk7XG5cdFx0XHREYWlseU1vdGlvbkFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIERhaWx5TW90aW9uIEFQSSBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRjcmVhdGVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRwbGF5ZXIgPSBETS5wbGF5ZXIoc2V0dGluZ3MuY29udGFpbmVyLCB7XG5cdFx0XHRcdGhlaWdodDogc2V0dGluZ3MuaGVpZ2h0IHx8ICcxMDAlJyxcblx0XHRcdFx0d2lkdGg6IHNldHRpbmdzLndpZHRoIHx8ICcxMDAlJyxcblx0XHRcdFx0dmlkZW86IHNldHRpbmdzLnZpZGVvSWQsXG5cdFx0XHRcdHBhcmFtczogT2JqZWN0LmFzc2lnbih7YXBpOiB0cnVlfSwgc2V0dGluZ3MucGFyYW1zKSxcblx0XHRcdFx0b3JpZ2luOiBsb2NhdGlvbi5ob3N0XG5cdFx0XHR9KTtcblxuXHRcdHBsYXllci5hZGRFdmVudExpc3RlbmVyKCdhcGlyZWFkeScsICgpID0+IHtcblx0XHRcdHdpbmRvd1snX19yZWFkeV9fJyArIHNldHRpbmdzLmlkXShwbGF5ZXIsIHtwYXVzZWQ6IHRydWUsIGVuZGVkOiBmYWxzZX0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBFeHRyYWN0IElEIGZyb20gRGFpbHlNb3Rpb24ncyBVUkwgdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqIC0gaHR0cDovL3d3dy5kYWlseW1vdGlvbi5jb20vZW1iZWQvdmlkZW8veDM1eWF3eVxuXHQgKiAtIGh0dHA6Ly9kYWkubHkveDM1eWF3eVxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG5cdCAqIEByZXR1cm4ge1N0cmluZ31cblx0ICovXG5cdGdldERhaWx5TW90aW9uSWQ6ICh1cmwpID0+IHtcblx0XHRsZXRcblx0XHRcdHBhcnRzID0gdXJsLnNwbGl0KCcvJyksXG5cdFx0XHRsYXN0UGFydCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLFxuXHRcdFx0ZGFzaFBhcnRzID0gbGFzdFBhcnQuc3BsaXQoJ18nKVxuXHRcdDtcblxuXHRcdHJldHVybiBkYXNoUGFydHNbMF07XG5cdH1cbn07XG5cbmNvbnN0IERhaWx5TW90aW9uSWZyYW1lUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICdkYWlseW1vdGlvbl9pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdkYWlseW1vdGlvbl9pZnJhbWUnLFxuXG5cdFx0ZGFpbHltb3Rpb246IHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6ICcxMDAlJyxcblx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRhdXRvcGxheTogZmFsc2UsXG5cdFx0XHRcdGNocm9tZWxlc3M6IDEsXG5cdFx0XHRcdGluZm86IDAsXG5cdFx0XHRcdGxvZ286IDAsXG5cdFx0XHRcdHJlbGF0ZWQ6IDBcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gWyd2aWRlby9kYWlseW1vdGlvbicsICd2aWRlby94LWRhaWx5bW90aW9uJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXQgZG0gPSB7fTtcblxuXHRcdGRtLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdGRtLmlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXg7XG5cdFx0ZG0ubWVkaWFFbGVtZW50ID0gbWVkaWFFbGVtZW50O1xuXG5cdFx0bGV0XG5cdFx0XHRhcGlTdGFjayA9IFtdLFxuXHRcdFx0ZG1QbGF5ZXJSZWFkeSA9IGZhbHNlLFxuXHRcdFx0ZG1QbGF5ZXIgPSBudWxsLFxuXHRcdFx0ZG1JZnJhbWUgPSBudWxsLFxuXHRcdFx0ZXZlbnRzLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRkbVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChkbVBsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IGRtIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIuY3VycmVudFRpbWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBpc05hTihkbVBsYXllci5kdXJhdGlvbikgPyAwIDogZG1QbGF5ZXIuZHVyYXRpb247XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIudm9sdW1lO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BhdXNlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLnBhdXNlZDtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdlbmRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLmVuZGVkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIubXV0ZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCBwZXJjZW50TG9hZGVkID0gZG1QbGF5ZXIuYnVmZmVyZWRUaW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZHVyYXRpb24gPSBkbVBsYXllci5kdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBwZXJjZW50TG9hZGVkIC8gZHVyYXRpb247XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRkbVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRtUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmM7XG5cblx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5sb2FkKERhaWx5TW90aW9uQXBpLmdldERhaWx5TW90aW9uSWQodXJsKSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNlZWsodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRtUGxheWVyLnNldE11dGVkKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5zZXRNdXRlZChmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGRtKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRkbVBsYXllci5zZXRWb2x1bWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGRtKTtcblx0XHRcdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZG0gJyArIGRtLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdGRtW21ldGhvZE5hbWVdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChkbVBsYXllciAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZG1QbGF5ZXIucGxheSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwYXVzZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGRtUGxheWVyLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2xvYWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ2NhbGwnLCBtZXRob2ROYW1lOiBtZXRob2ROYW1lfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbk1ldGhvZHMobWV0aG9kc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbCBtZXRob2QgdG8gcmVnaXN0ZXIgYWxsIERhaWx5TW90aW9uIGV2ZW50cyB3aGVuIGluaXRpYWxpemluZyA8aWZyYW1lPlxuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIGRtLmlkXSA9IChfZG1QbGF5ZXIpID0+IHtcblxuXHRcdFx0ZG1QbGF5ZXJSZWFkeSA9IHRydWU7XG5cdFx0XHRtZWRpYUVsZW1lbnQuZG1QbGF5ZXIgPSBkbVBsYXllciA9IF9kbVBsYXllcjtcblxuXHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0aWYgKGFwaVN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGFwaVN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBhcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRkbVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdGRtW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRkbUlmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRtLmlkKTtcblxuXHRcdFx0Ly8gYSBmZXcgbW9yZSBldmVudHNcblx0XHRcdGV2ZW50cyA9IFsnbW91c2VvdmVyJywgJ21vdXNlb3V0J107XG5cdFx0XHRsZXQgYXNzaWduRXZlbnQgPSAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIGRtKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChsZXQgaiBpbiBldmVudHMpIHtcblx0XHRcdFx0YWRkRXZlbnQoZG1JZnJhbWUsIGV2ZW50c1tqXSwgYXNzaWduRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTIHVwXG5cdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzO1xuXHRcdFx0ZXZlbnRzID0gZXZlbnRzLmNvbmNhdChbJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKTtcblx0XHRcdGxldCBhc3NpZ25OYXRpdmVFdmVudHMgPSAoZXZlbnROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBldmVudDsgbm90IGNvbnNpZGVyIGl0XG5cdFx0XHRcdGlmIChldmVudE5hbWUgIT09ICdlbmRlZCcpIHtcblxuXHRcdFx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCBkbVBsYXllcik7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRhc3NpZ25OYXRpdmVFdmVudHMoZXZlbnRzW2ldKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3VzdG9tIERhaWx5TW90aW9uIGV2ZW50c1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0ZXZlbnQgPSBjcmVhdGVFdmVudCgncHJvZ3Jlc3MnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2FkX3RpbWV1cGRhdGUnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdGRtUGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2FkX3BhdXNlJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGF1c2UnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignYWRfZW5kJywgKCkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZW5kZWQnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndmlkZW9fc3RhcnQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0ZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCd2aWRlb19lbmQnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIGRtUGxheWVyKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRkbVBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsICgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBkbVBsYXllcik7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0ZG1QbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignZHVyYXRpb25jaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgZG1QbGF5ZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblxuXG5cdFx0XHQvLyBnaXZlIGluaXRpYWwgZXZlbnRzXG5cdFx0XHRsZXQgaW5pdEV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBpbml0RXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoaW5pdEV2ZW50c1tpXSwgZG0pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCBkbUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGRtQ29udGFpbmVyLmlkID0gZG0uaWQ7XG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKGRtQ29udGFpbmVyKTtcblx0XHRpZiAobWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSkge1xuXHRcdFx0ZG1Db250YWluZXIuc3R5bGUud2lkdGggPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLndpZHRoO1xuXHRcdFx0ZG1Db250YWluZXIuc3R5bGUuaGVpZ2h0ID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5oZWlnaHQ7XG5cdFx0fVxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdGxldFxuXHRcdFx0dmlkZW9JZCA9IERhaWx5TW90aW9uQXBpLmdldERhaWx5TW90aW9uSWQobWVkaWFGaWxlc1swXS5zcmMpLFxuXHRcdFx0ZG1TZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdFx0XHRpZDogZG0uaWQsXG5cdFx0XHRcdGNvbnRhaW5lcjogZG1Db250YWluZXIsXG5cdFx0XHRcdHZpZGVvSWQ6IHZpZGVvSWQsXG5cdFx0XHRcdGF1dG9wbGF5OiAhIShtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSlcblx0XHRcdH0sIGRtLm9wdGlvbnMuZGFpbHltb3Rpb24pO1xuXG5cdFx0RGFpbHlNb3Rpb25BcGkuZW5xdWV1ZUlmcmFtZShkbVNldHRpbmdzKTtcblxuXHRcdGRtLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRkbS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdGRtLnBhdXNlKCk7XG5cdFx0XHRpZiAoZG1JZnJhbWUpIHtcblx0XHRcdFx0ZG1JZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdGRtLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoZG1JZnJhbWUpIHtcblx0XHRcdFx0ZG1JZnJhbWUuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZG0uc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRkbUlmcmFtZS53aWR0aCA9IHdpZHRoO1xuXHRcdFx0ZG1JZnJhbWUuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH07XG5cdFx0ZG0uZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdGRtUGxheWVyLmRlc3Ryb3koKTtcblx0XHR9O1xuXHRcdGRtLmludGVydmFsID0gbnVsbDtcblxuXHRcdGRtLnN0YXJ0SW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHRkbS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0RGFpbHlNb3Rpb25BcGkuc2VuZEV2ZW50KGRtLmlkLCBkbVBsYXllciwgJ3RpbWV1cGRhdGUnLCB7XG5cdFx0XHRcdFx0cGF1c2VkOiBmYWxzZSxcblx0XHRcdFx0XHRlbmRlZDogZmFsc2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCAyNTApO1xuXHRcdH07XG5cdFx0ZG0uc3RvcEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0aWYgKGRtLmludGVydmFsKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoZG0uaW50ZXJ2YWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZG07XG5cdH1cbn07XG5cblxuLypcbiAqIFJlZ2lzdGVyIERhaWx5TW90aW9uIGV2ZW50IGdsb2JhbGx5XG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuICh1cmwuaW5jbHVkZXMoJy8vZGFpbHltb3Rpb24uY29tJykgfHwgdXJsLmluY2x1ZGVzKCd3d3cuZGFpbHltb3Rpb24uY29tJykgfHwgdXJsLmluY2x1ZGVzKCcvL2RhaS5seScpKSA/ICd2aWRlby94LWRhaWx5bW90aW9uJyA6IG51bGw7XG59KTtcblxud2luZG93LmRtQXN5bmNJbml0ID0gKCkgPT4ge1xuXHREYWlseU1vdGlvbkFwaS5hcGlSZWFkeSgpO1xufTtcblxucmVuZGVyZXIuYWRkKERhaWx5TW90aW9uSWZyYW1lUmVuZGVyZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcbmltcG9ydCB7cmVuZGVyZXJ9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xuaW1wb3J0IHtjcmVhdGVFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuaW1wb3J0IHtIQVNfTVNFfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuXG4vKipcbiAqIE5hdGl2ZSBNKFBFRyktRGFzaCByZW5kZXJlclxuICpcbiAqIFVzZXMgZGFzaC5qcywgYSByZWZlcmVuY2UgY2xpZW50IGltcGxlbWVudGF0aW9uIGZvciB0aGUgcGxheWJhY2sgb2YgTShQRUcpLURBU0ggdmlhIEphdmFzY3JpcHQgYW5kIGNvbXBsaWFudCBicm93c2Vycy5cbiAqIEl0IHJlbGllcyBvbiBIVE1MNSB2aWRlbyBhbmQgTWVkaWFTb3VyY2UgRXh0ZW5zaW9ucyBmb3IgcGxheWJhY2suXG4gKiBUaGlzIHJlbmRlcmVyIGludGVncmF0ZXMgbmV3IGV2ZW50cyBhc3NvY2lhdGVkIHdpdGggbXBkIGZpbGVzLlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vRGFzaC1JbmR1c3RyeS1Gb3J1bS9kYXNoLmpzXG4gKlxuICovXG5jb25zdCBOYXRpdmVEYXNoID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGNyZWF0aW9uUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBsb2FkaW5nIG9mIGFuIERBU0ggc291cmNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIERBU0ggcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVEYXNoLmlzTG9hZGVkKSB7XG5cdFx0XHROYXRpdmVEYXNoLmNyZWF0ZUluc3RhbmNlKHNldHRpbmdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0TmF0aXZlRGFzaC5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZURhc2guY3JlYXRpb25RdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgZGFzaC5tZWRpYXBsYXllci5qcyBzY3JpcHQgb24gdGhlIGhlYWRlciBvZiB0aGUgZG9jdW1lbnRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGxvYWQgYW4gREFTSCBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlRGFzaC5pc1NjcmlwdExvYWRlZCkge1xuXG5cdFx0XHRpZiAodHlwZW9mIGRhc2hqcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0TmF0aXZlRGFzaC5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA9IHR5cGVvZiBzZXR0aW5ncy5vcHRpb25zLnBhdGggPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggOiAnLy9jZG4uZGFzaGpzLm9yZy9sYXRlc3QvZGFzaC5tZWRpYXBsYXllci5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlRGFzaC5tZWRpYVJlYWR5KCk7XG5cdFx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgZmlyc3RTY3JpcHRUYWcpO1xuXHRcdFx0fVxuXHRcdFx0TmF0aXZlRGFzaC5pc1NjcmlwdExvYWRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIERBU0ggcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cblx0XHROYXRpdmVEYXNoLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVEYXNoLmlzU2NyaXB0TG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChOYXRpdmVEYXNoLmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlRGFzaC5jcmVhdGlvblF1ZXVlLnBvcCgpO1xuXHRcdFx0TmF0aXZlRGFzaC5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgREFTSCBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgREFTSCBvYmplY3Rcblx0ICovXG5cdGNyZWF0ZUluc3RhbmNlOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGxldCBwbGF5ZXIgPSBkYXNoanMuTWVkaWFQbGF5ZXIoKS5jcmVhdGUoKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0fVxufTtcblxubGV0IERhc2hOYXRpdmVSZW5kZXJlciA9IHtcblx0bmFtZTogJ25hdGl2ZV9kYXNoJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnbmF0aXZlX2Rhc2gnLFxuXHRcdGRhc2g6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgZGFzaC5qcyBtZWRpYXBsYXllciBsaWJyYXJ5XG5cdFx0XHRwYXRoOiAnLy9jZG4uZGFzaGpzLm9yZy9sYXRlc3QvZGFzaC5tZWRpYXBsYXllci5taW4uanMnLFxuXHRcdFx0ZGVidWc6IGZhbHNlXG5cdFx0fVxuXHR9LFxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBIQVNfTVNFICYmIFsnYXBwbGljYXRpb24vZGFzaCt4bWwnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBwbGF5ZXIgaW5zdGFuY2UgYW5kIGFkZCBhbGwgbmF0aXZlIGV2ZW50cy9tZXRob2RzL3Byb3BlcnRpZXMgYXMgcG9zc2libGVcblx0ICpcblx0ICogQHBhcmFtIHtNZWRpYUVsZW1lbnR9IG1lZGlhRWxlbWVudCBJbnN0YW5jZSBvZiBtZWpzLk1lZGlhRWxlbWVudCBhbHJlYWR5IGNyZWF0ZWRcblx0ICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQWxsIHRoZSBwbGF5ZXIgY29uZmlndXJhdGlvbiBvcHRpb25zIHBhc3NlZCB0aHJvdWdoIGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0W119IG1lZGlhRmlsZXMgTGlzdCBvZiBzb3VyY2VzIHdpdGggZm9ybWF0OiB7c3JjOiB1cmwsIHR5cGU6IHgveS16fVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRjcmVhdGU6IChtZWRpYUVsZW1lbnQsIG9wdGlvbnMsIG1lZGlhRmlsZXMpID0+IHtcblxuXHRcdGxldFxuXHRcdFx0bm9kZSA9IG51bGwsXG5cdFx0XHRvcmlnaW5hbE5vZGUgPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLFxuXHRcdFx0aWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeCxcblx0XHRcdGRhc2hQbGF5ZXIsXG5cdFx0XHRzdGFjayA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0bm9kZSA9IG9yaWdpbmFsTm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0bm9kZVtgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4gKGRhc2hQbGF5ZXIgIT09IG51bGwpID8gbm9kZVtwcm9wTmFtZV0gOiBudWxsO1xuXG5cdFx0XHRcdG5vZGVbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChkYXNoUGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcE5hbWUgPT09ICdzcmMnKSB7XG5cblx0XHRcdFx0XHRcdFx0ZGFzaFBsYXllci5hdHRhY2hTb3VyY2UodmFsdWUpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChub2RlLmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdG5vZGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBNLURhc2ggZXZlbnRzXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgaWRdID0gKF9kYXNoUGxheWVyKSA9PiB7XG5cblx0XHRcdG1lZGlhRWxlbWVudC5kYXNoUGxheWVyID0gZGFzaFBsYXllciA9IF9kYXNoUGxheWVyO1xuXG5cdFx0XHQvLyBCeSBkZWZhdWx0LCBjb25zb2xlIGxvZyBpcyBvZmZcblx0XHRcdGRhc2hQbGF5ZXIuZ2V0RGVidWcoKS5zZXRMb2dUb0Jyb3dzZXJDb25zb2xlKG9wdGlvbnMuZGFzaC5kZWJ1Zyk7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChzdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBzdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gc3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0oc3RhY2tJdGVtLnZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YWNrSXRlbS50eXBlID09PSAnY2FsbCcpIHtcblx0XHRcdFx0XHRcdG5vZGVbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJVQkJMRSBFVkVOVFNcblx0XHRcdGxldFxuXHRcdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLCBkYXNoRXZlbnRzID0gZGFzaGpzLk1lZGlhUGxheWVyLmV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXHRcdFx0XHRcdFx0ZGFzaFBsYXllci5pbml0aWFsaXplKG5vZGUsIG5vZGUuc3JjLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGUpID0+IHtcblx0XHRcdFx0XHRcdGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0XHRldmVudC5pbml0RXZlbnQoZS50eXBlLCBlLmJ1YmJsZXMsIGUuY2FuY2VsYWJsZSk7XG5cdFx0XHRcdFx0XHQvLyBAdG9kbyBDaGVjayB0aGlzXG5cdFx0XHRcdFx0XHQvLyBldmVudC5zcmNFbGVtZW50ID0gZS5zcmNFbGVtZW50O1xuXHRcdFx0XHRcdFx0Ly8gZXZlbnQudGFyZ2V0ID0gZS5zcmNFbGVtZW50O1xuXG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0O1xuXG5cdFx0XHRldmVudHMgPSBldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGFzc2lnbkV2ZW50cyhldmVudHNbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEN1c3RvbSBNKFBFRyktREFTSCBldmVudHNcblx0XHRcdCAqXG5cdFx0XHQgKiBUaGVzZSBldmVudHMgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBvcmlnaW5hbCBub2RlIHVzaW5nIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHRoZSBuYW1lIG9mIHRoZSBldmVudCxcblx0XHRcdCAqIG5vdCB1c2luZyBkYXNoanMuTWVkaWFQbGF5ZXIuZXZlbnRzIG9iamVjdFxuXHRcdFx0ICogQHNlZSBodHRwOi8vY2RuLmRhc2hqcy5vcmcvbGF0ZXN0L2pzZG9jL01lZGlhUGxheWVyRXZlbnRzLmh0bWxcblx0XHRcdCAqL1xuXHRcdFx0Y29uc3QgYXNzaWduTWRhc2hFdmVudHMgPSAoZSkgPT4ge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLnR5cGUsIG5vZGUpO1xuXHRcdFx0XHRldmVudC5kYXRhID0gZTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdGlmIChlLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2Vycm9yJykge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAobGV0IGV2ZW50VHlwZSBpbiBkYXNoRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChkYXNoRXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpIHtcbiBcdFx0XHRcdFx0ZGFzaFBsYXllci5vbihkYXNoRXZlbnRzW2V2ZW50VHlwZV0sIGFzc2lnbk1kYXNoRXZlbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdE5hdGl2ZURhc2gucHJlcGFyZVNldHRpbmdzKHtcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnMuZGFzaCxcblx0XHRcdGlkOiBpZFxuXHRcdH0pO1xuXG5cdFx0Ly8gSEVMUEVSIE1FVEhPRFNcblx0XHRub2RlLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdG5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuaGlkZSA9ICgpID0+IHtcblx0XHRcdG5vZGUucGF1c2UoKTtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIE5hdGl2ZSBNKFBFRyktRGFzaCB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gdXJsLmluY2x1ZGVzKCcubXBkJykgPyAnYXBwbGljYXRpb24vZGFzaCt4bWwnIDogbnVsbDtcbn0pO1xuXG5yZW5kZXJlci5hZGQoRGFzaE5hdGl2ZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7aXNPYmplY3RFbXB0eX0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJhbCc7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogRmFjZWJvb2sgcmVuZGVyZXJcbiAqXG4gKiBJdCBjcmVhdGVzIGFuIDxpZnJhbWU+IGZyb20gYSA8ZGl2PiB3aXRoIHNwZWNpZmljIGNvbmZpZ3VyYXRpb24uXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9wbHVnaW5zL2VtYmVkZGVkLXZpZGVvLXBsYXllclxuICovXG5jb25zdCBGYWNlYm9va1JlbmRlcmVyID0ge1xuXHRuYW1lOiAnZmFjZWJvb2snLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICdmYWNlYm9vaycsXG5cdFx0ZmFjZWJvb2s6IHtcblx0XHRcdGFwcElkOiAne3lvdXItYXBwLWlkfScsXG5cdFx0XHR4ZmJtbDogdHJ1ZSxcblx0XHRcdHZlcnNpb246ICd2Mi42J1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSAgPT4gWyd2aWRlby9mYWNlYm9vaycsICd2aWRlby94LWZhY2Vib29rJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSAgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRmYldyYXBwZXIgPSB7fSxcblx0XHRcdGZiQXBpID0gbnVsbCxcblx0XHRcdGZiRGl2ID0gbnVsbCxcblx0XHRcdGFwaVN0YWNrID0gW10sXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdGhhc1N0YXJ0ZWRQbGF5aW5nID0gZmFsc2UsXG5cdFx0XHRzcmMgPSAnJyxcblx0XHRcdGV2ZW50SGFuZGxlciA9IHt9LFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgbWVkaWFFbGVtZW50Lm9wdGlvbnMpO1xuXHRcdGZiV3JhcHBlci5vcHRpb25zID0gb3B0aW9ucztcblx0XHRmYldyYXBwZXIuaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHRmYldyYXBwZXIubWVkaWFFbGVtZW50ID0gbWVkaWFFbGVtZW50O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgID0+IHtcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRmYldyYXBwZXJbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmYkFwaSAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IHlvdXR1YmUgZHRhIGhlcmVcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5nZXRDdXJyZW50UG9zaXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdkdXJhdGlvbic6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLmdldER1cmF0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmJBcGkuZ2V0Vm9sdW1lKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5pc011dGVkKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnYnVmZmVyZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc3JjO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmYldyYXBwZXJbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgID0+IHtcblxuXHRcdFx0XHRcdGlmIChmYkFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHRsZXQgdXJsID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogdmFsdWVbMF0uc3JjO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gT25seSB3YXkgaXMgdG8gZGVzdHJveSBpbnN0YW5jZSBhbmQgYWxsIHRoZSBldmVudHMgZmlyZWQsXG5cdFx0XHRcdFx0XHRcdFx0Ly8gYW5kIGNyZWF0ZSBuZXcgb25lXG5cdFx0XHRcdFx0XHRcdFx0ZmJEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmYkRpdik7XG5cdFx0XHRcdFx0XHRcdFx0Y3JlYXRlRmFjZWJvb2tFbWJlZCh1cmwsIG9wdGlvbnMuZmFjZWJvb2spO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVGhpcyBtZXRob2QgcmVsb2FkcyB2aWRlbyBvbi1kZW1hbmRcblx0XHRcdFx0XHRcdFx0XHRGQi5YRkJNTC5wYXJzZSgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdGZiQXBpLnNlZWsodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGZiQXBpLm11dGUoKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmJBcGkudW5tdXRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIGZiV3JhcHBlcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuc2V0Vm9sdW1lKHZhbHVlKTtcblx0XHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdmYWNlYm9vayAnICsgZmJXcmFwcGVyLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSAgPT4ge1xuXG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBuYXRpdmUgSFRNTE1lZGlhRWxlbWVudFxuXHRcdFx0XHRmYldyYXBwZXJbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoZmJBcGkgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRE8gbWV0aG9kXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG1ldGhvZE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGxheSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZiQXBpLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYkFwaS5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0ICogRGlzcGF0Y2ggYSBsaXN0IG9mIGV2ZW50c1xuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBldmVudHNcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBzZW5kRXZlbnRzIChldmVudHMpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGxldCBldmVudCA9IG1lanMuVXRpbHMuY3JlYXRlRXZlbnQoZXZlbnRzW2ldLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlIGEgbmV3IEZhY2Vib29rIHBsYXllciBhbmQgYXR0YWNoIGFsbCBpdHMgZXZlbnRzXG5cdFx0ICpcblx0XHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGEgPGRpdj4gZWxlbWVudCB0aGF0LCBvbmNlIHRoZSBBUEkgaXMgYXZhaWxhYmxlLCB3aWxsIGdlbmVyYXRlIGFuIDxpZnJhbWU+LlxuXHRcdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdFx0ICogIC0gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2pvaG5keWVyL3ZpZGVvcy8xMDEwNzgxNjI0MzY4MTg4NC9cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gY3JlYXRlRmFjZWJvb2tFbWJlZCAodXJsLCBjb25maWcpIHtcblxuXHRcdFx0c3JjID0gdXJsO1xuXG5cdFx0XHRmYkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0ZmJEaXYuaWQgPSBmYldyYXBwZXIuaWQ7XG5cdFx0XHRmYkRpdi5jbGFzc05hbWUgPSBcImZiLXZpZGVvXCI7XG5cdFx0XHRmYkRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhyZWZcIiwgdXJsKTtcblx0XHRcdGZiRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtYWxsb3dmdWxsc2NyZWVuXCIsIFwidHJ1ZVwiKTtcblx0XHRcdGZiRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtY29udHJvbHNcIiwgXCJmYWxzZVwiKTtcblxuXHRcdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShmYkRpdiwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBSZWdpc3RlciBGYWNlYm9vayBBUEkgZXZlbnQgZ2xvYmFsbHlcblx0XHRcdCAqXG5cdFx0XHQgKi9cblx0XHRcdHdpbmRvdy5mYkFzeW5jSW5pdCA9ICgpID0+IHtcblxuXHRcdFx0XHRGQi5pbml0KGNvbmZpZyk7XG5cblx0XHRcdFx0RkIuRXZlbnQuc3Vic2NyaWJlKCd4ZmJtbC5yZWFkeScsIChtc2cpID0+IHtcblxuXHRcdFx0XHRcdGlmIChtc2cudHlwZSA9PT0gJ3ZpZGVvJykge1xuXG5cdFx0XHRcdFx0XHRmYkFwaSA9IG1zZy5pbnN0YW5jZTtcblxuXHRcdFx0XHRcdFx0Ly8gU2V0IHByb3BlciBzaXplIHNpbmNlIHBsYXllciBkaW1lbnNpb25zIGFyZSB1bmtub3duIGJlZm9yZSB0aGlzIGV2ZW50XG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0ZmJJZnJhbWUgPSBmYkRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaWZyYW1lJylbMF0sXG5cdFx0XHRcdFx0XHRcdHdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZmJJZnJhbWUsIG51bGwpLndpZHRoKSxcblx0XHRcdFx0XHRcdFx0aGVpZ2h0ID0gcGFyc2VJbnQoZmJJZnJhbWUuc3R5bGUuaGVpZ2h0KVxuXHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRmYldyYXBwZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKTtcblxuXHRcdFx0XHRcdFx0Ly8gcmVtb3ZlIHByZXZpb3VzIGxpc3RlbmVyc1xuXHRcdFx0XHRcdFx0bGV0IGZiRXZlbnRzID0gWydzdGFydGVkUGxheWluZycsICdwYXVzZWQnLCAnZmluaXNoZWRQbGF5aW5nJywgJ3N0YXJ0ZWRCdWZmZXJpbmcnLCAnZmluaXNoZWRCdWZmZXJpbmcnXTtcblx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gZmJFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0XHRldmVudCA9IGZiRXZlbnRzW2ldLFxuXHRcdFx0XHRcdFx0XHRcdGhhbmRsZXIgPSBldmVudEhhbmRsZXJbZXZlbnRdXG5cdFx0XHRcdFx0XHRcdDtcblx0XHRcdFx0XHRcdFx0aWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCAmJiBoYW5kbGVyICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHRcdFx0IWlzT2JqZWN0RW1wdHkoaGFuZGxlcikgJiYgdHlwZW9mIGhhbmRsZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0XHRoYW5kbGVyLnJlbW92ZUxpc3RlbmVyKGV2ZW50KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRcdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YFxuXHRcdFx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmYldyYXBwZXJbYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmYldyYXBwZXJbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydyZW5kZXJlcnJlYWR5JywgJ3JlYWR5JywgJ2xvYWRlZGRhdGEnLCAnY2FucGxheScsICdwcm9ncmVzcyddKTtcblx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydsb2FkZWRtZXRhZGF0YScsICd0aW1ldXBkYXRlJywgJ3Byb2dyZXNzJ10pO1xuXG5cdFx0XHRcdFx0XHRsZXQgdGltZXI7XG5cblx0XHRcdFx0XHRcdC8vIEN1c3RvbSBGYWNlYm9vayBldmVudHNcblx0XHRcdFx0XHRcdGV2ZW50SGFuZGxlci5zdGFydGVkUGxheWluZyA9IGZiQXBpLnN1YnNjcmliZSgnc3RhcnRlZFBsYXlpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICghaGFzU3RhcnRlZFBsYXlpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRoYXNTdGFydGVkUGxheWluZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydwbGF5JywgJ3BsYXlpbmcnLCAndGltZXVwZGF0ZSddKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBXb3JrYXJvdW5kIHRvIHVwZGF0ZSBwcm9ncmVzcyBiYXJcblx0XHRcdFx0XHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3RpbWV1cGRhdGUnXSk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGV2ZW50SGFuZGxlci5wYXVzZWQgPSBmYkFwaS5zdWJzY3JpYmUoJ3BhdXNlZCcsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3BhdXNlZCddKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLmZpbmlzaGVkUGxheWluZyA9IGZiQXBpLnN1YnNjcmliZSgnZmluaXNoZWRQbGF5aW5nJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRlbmRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gV29ya2Fyb3VuZCB0byB1cGRhdGUgcHJvZ3Jlc3MgYmFyIG9uZSBsYXN0IHRpbWUgYW5kIHRyaWdnZXIgZW5kZWQgZXZlbnRcblx0XHRcdFx0XHRcdFx0dGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmJBcGkuZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VuZEV2ZW50cyhbJ3RpbWV1cGRhdGUnLCAnZW5kZWQnXSk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cblx0XHRcdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0ZXZlbnRIYW5kbGVyLnN0YXJ0ZWRCdWZmZXJpbmcgPSBmYkFwaS5zdWJzY3JpYmUoJ3N0YXJ0ZWRCdWZmZXJpbmcnLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHNlbmRFdmVudHMoWydwcm9ncmVzcycsICd0aW1ldXBkYXRlJ10pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRldmVudEhhbmRsZXIuZmluaXNoZWRCdWZmZXJpbmcgPSBmYkFwaS5zdWJzY3JpYmUoJ2ZpbmlzaGVkQnVmZmVyaW5nJywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRzZW5kRXZlbnRzKFsncHJvZ3Jlc3MnLCAndGltZXVwZGF0ZSddKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0KCgoZCwgcywgaWQpID0+IHtcblx0XHRcdFx0bGV0IGpzO1xuXHRcdFx0XHRsZXQgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcblx0XHRcdFx0aWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xuXHRcdFx0XHRqcy5pZCA9IGlkO1xuXHRcdFx0XHRqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanMnO1xuXHRcdFx0XHRmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG5cdFx0XHR9KShkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcblx0XHR9XG5cblx0XHRpZiAobWVkaWFGaWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjcmVhdGVGYWNlYm9va0VtYmVkKG1lZGlhRmlsZXNbMF0uc3JjLCBmYldyYXBwZXIub3B0aW9ucy5mYWNlYm9vayk7XG5cdFx0fVxuXG5cdFx0ZmJXcmFwcGVyLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRmYldyYXBwZXIuc3RvcEludGVydmFsKCk7XG5cdFx0XHRmYldyYXBwZXIucGF1c2UoKTtcblx0XHRcdGlmIChmYkRpdikge1xuXHRcdFx0XHRmYkRpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAoZmJEaXYpIHtcblx0XHRcdFx0ZmJEaXYuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0aWYgKGZiQXBpICE9PSBudWxsICYmICFpc05hTih3aWR0aCkgJiYgIWlzTmFOKGhlaWdodCkpIHtcblx0XHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcblx0XHRcdFx0ZmJEaXYuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0fTtcblx0XHRmYldyYXBwZXIuaW50ZXJ2YWwgPSBudWxsO1xuXG5cdFx0ZmJXcmFwcGVyLnN0YXJ0SW50ZXJ2YWwgPSAoKSA9PiB7XG5cdFx0XHQvLyBjcmVhdGUgdGltZXJcblx0XHRcdGZiV3JhcHBlci5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3RpbWV1cGRhdGUnLCBmYldyYXBwZXIpO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9LCAyNTApO1xuXHRcdH07XG5cdFx0ZmJXcmFwcGVyLnN0b3BJbnRlcnZhbCA9ICgpID0+IHtcblx0XHRcdGlmIChmYldyYXBwZXIuaW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChmYldyYXBwZXIuaW50ZXJ2YWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZmJXcmFwcGVyO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIEZhY2Vib29rIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy8vd3d3LmZhY2Vib29rJykgPyAndmlkZW8veC1mYWNlYm9vaycgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZChGYWNlYm9va1JlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQgaTE4biBmcm9tICcuLi9jb3JlL2kxOG4nO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHtOQVYsIElTX0lFLCBIQVNfTVNFLCBTVVBQT1JUU19OQVRJVkVfSExTfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHt0eXBlQ2hlY2tzLCBhYnNvbHV0aXplVXJsfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogU2hpbSB0aGF0IGZhbGxzIGJhY2sgdG8gRmxhc2ggaWYgYSBtZWRpYSB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gKlxuICogQW55IGZvcm1hdCBub3Qgc3VwcG9ydGVkIG5hdGl2ZWx5LCBpbmNsdWRpbmcsIFJUTVAsIEZMViwgSExTIGFuZCBNKFBFRyktREFTSCAoaWYgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IE1TRSksXG4gKiB3aWxsIHBsYXkgdXNpbmcgRmxhc2guXG4gKi9cblxuXG4vKipcbiAqIENvcmUgZGV0ZWN0b3IsIHBsdWdpbnMgYXJlIGFkZGVkIGJlbG93XG4gKlxuICovXG5leHBvcnQgY29uc3QgUGx1Z2luRGV0ZWN0b3IgPSB7XG5cdC8qKlxuXHQgKiBDYWNoZWQgdmVyc2lvbiBudW1iZXJzXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHBsdWdpbnM6IFtdLFxuXG5cdC8qKlxuXHQgKiBUZXN0IGEgcGx1Z2luIHZlcnNpb24gbnVtYmVyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwbHVnaW4gLSBJbiB0aGlzIHNjZW5hcmlvICdmbGFzaCcgd2lsbCBiZSB0ZXN0ZWRcblx0ICogQHBhcmFtIHtBcnJheX0gdiAtIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZlcnNpb24gdXAgdG8gMyBudW1iZXJzIChtYWpvciwgbWlub3IsIHJldmlzaW9uKVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0aGFzUGx1Z2luVmVyc2lvbjogKHBsdWdpbiwgdikgPT4ge1xuXHRcdGxldCBwdiA9IFBsdWdpbkRldGVjdG9yLnBsdWdpbnNbcGx1Z2luXTtcblx0XHR2WzFdID0gdlsxXSB8fCAwO1xuXHRcdHZbMl0gPSB2WzJdIHx8IDA7XG5cdFx0cmV0dXJuIChwdlswXSA+IHZbMF0gfHwgKHB2WzBdID09PSB2WzBdICYmIHB2WzFdID4gdlsxXSkgfHwgKHB2WzBdID09PSB2WzBdICYmIHB2WzFdID09PSB2WzFdICYmIHB2WzJdID49IHZbMl0pKTtcblx0fSxcblxuXHQvKipcblx0ICogRGV0ZWN0IHBsdWdpbiBhbmQgc3RvcmUgaXRzIHZlcnNpb24gbnVtYmVyXG5cdCAqXG5cdCAqIEBzZWUgUGx1Z2luRGV0ZWN0b3IuZGV0ZWN0UGx1Z2luXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwbHVnaW5OYW1lXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lVHlwZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gYWN0aXZlWFxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBheERldGVjdFxuXHQgKi9cblx0YWRkUGx1Z2luOiAocCwgcGx1Z2luTmFtZSwgbWltZVR5cGUsIGFjdGl2ZVgsIGF4RGV0ZWN0KSA9PiB7XG5cdFx0UGx1Z2luRGV0ZWN0b3IucGx1Z2luc1twXSA9IFBsdWdpbkRldGVjdG9yLmRldGVjdFBsdWdpbihwbHVnaW5OYW1lLCBtaW1lVHlwZSwgYWN0aXZlWCwgYXhEZXRlY3QpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBPYnRhaW4gdmVyc2lvbiBudW1iZXIgZnJvbSB0aGUgbWltZS10eXBlIChhbGwgYnV0IElFKSBvciBBY3RpdmVYIChJRSlcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHBsdWdpbk5hbWVcblx0ICogQHBhcmFtIHtTdHJpbmd9IG1pbWVUeXBlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBhY3RpdmVYXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGF4RGV0ZWN0XG5cdCAqIEByZXR1cm4ge2ludFtdfVxuXHQgKi9cblx0ZGV0ZWN0UGx1Z2luOiAocGx1Z2luTmFtZSwgbWltZVR5cGUsIGFjdGl2ZVgsIGF4RGV0ZWN0KSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdHZlcnNpb24gPSBbMCwgMCwgMF0sXG5cdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdGF4XG5cdFx0O1xuXG5cdFx0Ly8gRmlyZWZveCwgV2Via2l0LCBPcGVyYVxuXHRcdGlmIChOQVYucGx1Z2lucyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBOQVYucGx1Z2luc1twbHVnaW5OYW1lXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGRlc2NyaXB0aW9uID0gTkFWLnBsdWdpbnNbcGx1Z2luTmFtZV0uZGVzY3JpcHRpb247XG5cdFx0XHRpZiAoZGVzY3JpcHRpb24gJiYgISh0eXBlb2YgTkFWLm1pbWVUeXBlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgTkFWLm1pbWVUeXBlc1ttaW1lVHlwZV0gJiYgIU5BVi5taW1lVHlwZXNbbWltZVR5cGVdLmVuYWJsZWRQbHVnaW4pKSB7XG5cdFx0XHRcdHZlcnNpb24gPSBkZXNjcmlwdGlvbi5yZXBsYWNlKHBsdWdpbk5hbWUsICcnKS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXHNyL2dpLCAnLicpLnNwbGl0KCcuJyk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdmVyc2lvbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZlcnNpb25baV0gPSBwYXJzZUludCh2ZXJzaW9uW2ldLm1hdGNoKC9cXGQrLyksIDEwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgLyBBY3RpdmVYXG5cdFx0fSBlbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRheCA9IG5ldyBBY3RpdmVYT2JqZWN0KGFjdGl2ZVgpO1xuXHRcdFx0XHRpZiAoYXgpIHtcblx0XHRcdFx0XHR2ZXJzaW9uID0gYXhEZXRlY3QoYXgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdmVyc2lvbjtcblx0fVxufTtcblxuLyoqXG4gKiBBZGQgRmxhc2ggZGV0ZWN0aW9uXG4gKlxuICovXG5QbHVnaW5EZXRlY3Rvci5hZGRQbHVnaW4oJ2ZsYXNoJywgJ1Nob2Nrd2F2ZSBGbGFzaCcsICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCcsICdTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaCcsIChheCkgPT4ge1xuXHQvLyBhZGFwdGVkIGZyb20gU1dGT2JqZWN0XG5cdGxldCB2ZXJzaW9uID0gW10sXG5cdFx0ZCA9IGF4LkdldFZhcmlhYmxlKFwiJHZlcnNpb25cIik7XG5cdGlmIChkKSB7XG5cdFx0ZCA9IGQuc3BsaXQoXCIgXCIpWzFdLnNwbGl0KFwiLFwiKTtcblx0XHR2ZXJzaW9uID0gW3BhcnNlSW50KGRbMF0sIDEwKSwgcGFyc2VJbnQoZFsxXSwgMTApLCBwYXJzZUludChkWzJdLCAxMCldO1xuXHR9XG5cdHJldHVybiB2ZXJzaW9uO1xufSk7XG5cbmNvbnN0IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIgPSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHRsZXRcblx0XHRcdGZsYXNoID0ge30sXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyBzdG9yZSBtYWluIHZhcmlhYmxlXG5cdFx0Zmxhc2gub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0Zmxhc2guaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBmbGFzaC5vcHRpb25zLnByZWZpeDtcblx0XHRmbGFzaC5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBpbnNlcnQgZGF0YVxuXHRcdGZsYXNoLmZsYXNoU3RhdGUgPSB7fTtcblx0XHRmbGFzaC5mbGFzaEFwaSA9IG51bGw7XG5cdFx0Zmxhc2guZmxhc2hBcGlTdGFjayA9IFtdO1xuXG5cdFx0Ly8gbWVkaWFFbGVtZW50cyBmb3IgZ2V0L3NldFxuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gYWRkIHRvIGZsYXNoIHN0YXRlIHRoYXQgd2Ugd2lsbCBzdG9yZVxuXHRcdFx0XHRmbGFzaC5mbGFzaFN0YXRlW3Byb3BOYW1lXSA9IG51bGw7XG5cblx0XHRcdFx0Y29uc3QgY2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWA7XG5cblx0XHRcdFx0Zmxhc2hbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlbJ2dldF8nICsgcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gZmxhc2guZmxhc2hBcGlbJ2dldF8nICsgcHJvcE5hbWVdKCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gc3BlY2lhbCBjYXNlIGZvciBidWZmZXJlZCB0byBjb25mb3JtIHRvIEhUTUw1J3MgbmV3ZXN0XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ2J1ZmZlcmVkJykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGxlbmd0aDogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmxhc2hbYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChwcm9wTmFtZSA9PT0gJ3NyYycpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gYWJzb2x1dGl6ZVVybCh2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gc2VuZCB2YWx1ZSB0byBGbGFzaFxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCAmJiBmbGFzaC5mbGFzaEFwaVsnc2V0XycgKyBwcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlbJ3NldF8nICsgcHJvcE5hbWVdKHZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlTdGFjay5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ3NldCcsXG5cdFx0XHRcdFx0XHRcdHByb3BOYW1lOiBwcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgbWVkaWFFbGVtZW50cyBmb3IgbmF0aXZlIG1ldGhvZHNcblx0XHRsZXRcblx0XHRcdG1ldGhvZHMgPSBtZWpzLmh0bWw1bWVkaWEubWV0aG9kcyxcblx0XHRcdGFzc2lnbk1ldGhvZHMgPSAobWV0aG9kTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIHJ1biB0aGUgbWV0aG9kIG9uIHRoZSBuYXRpdmUgSFRNTE1lZGlhRWxlbWVudFxuXHRcdFx0XHRmbGFzaFttZXRob2ROYW1lXSA9ICgpID0+IHtcblxuXHRcdFx0XHRcdGlmIChmbGFzaC5mbGFzaEFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBzZW5kIGNhbGwgdXAgdG8gRmxhc2ggRXh0ZXJuYWxJbnRlcmZhY2UgQVBJXG5cdFx0XHRcdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlbYGZpcmVfJHttZXRob2ROYW1lfWBdKSB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlbYGZpcmVfJHttZXRob2ROYW1lfWBdKCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZmxhc2gnLCAnbWlzc2luZyBtZXRob2QnLCBtZXRob2ROYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0Zmxhc2guZmxhc2hBcGlTdGFjay5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ2NhbGwnLFxuXHRcdFx0XHRcdFx0XHRtZXRob2ROYW1lOiBtZXRob2ROYW1lXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHRcdDtcblx0XHRtZXRob2RzLnB1c2goJ3N0b3AnKTtcblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgYSByZWFkeSBtZXRob2QgdGhhdCBGbGFzaCBjYW4gY2FsbCB0b1xuXHRcdHdpbmRvd1tgX19yZWFkeV9fJHtmbGFzaC5pZH1gXSA9ICgpID0+IHtcblxuXHRcdFx0Zmxhc2guZmxhc2hSZWFkeSA9IHRydWU7XG5cdFx0XHRmbGFzaC5mbGFzaEFwaSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBfXyR7Zmxhc2guaWR9YCk7XG5cblx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdyZW5kZXJlcnJlYWR5JywgZmxhc2gpO1xuXHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoZmxhc2guZmxhc2hBcGlTdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDAsIGlsID0gZmxhc2guZmxhc2hBcGlTdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gZmxhc2guZmxhc2hBcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0XHRmbGFzaFtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRmbGFzaFtzdGFja0l0ZW0ubWV0aG9kTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2luZG93W2BfX2V2ZW50X18ke2ZsYXNoLmlkfWBdID0gKGV2ZW50TmFtZSwgbWVzc2FnZSkgPT4ge1xuXG5cdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudE5hbWUsIGZsYXNoKTtcblx0XHRcdGV2ZW50Lm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuXG5cdFx0XHQvLyBzZW5kIGV2ZW50IGZyb20gRmxhc2ggdXAgdG8gdGhlIG1lZGlhRWxlbWVudFxuXHRcdFx0Zmxhc2gubWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdH07XG5cblx0XHQvLyBpbnNlcnQgRmxhc2ggb2JqZWN0XG5cdFx0Zmxhc2guZmxhc2hXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRsZXRcblx0XHRcdGF1dG9wbGF5ID0gISFtZWRpYUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpLFxuXHRcdFx0Zmxhc2hWYXJzID0gW2B1aWQ9JHtmbGFzaC5pZH1gLCBgYXV0b3BsYXk9JHthdXRvcGxheX1gXSxcblx0XHRcdGlzVmlkZW8gPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsICYmIG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndmlkZW8nLFxuXHRcdFx0Zmxhc2hIZWlnaHQgPSAoaXNWaWRlbykgPyBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmhlaWdodCA6IDEsXG5cdFx0XHRmbGFzaFdpZHRoID0gKGlzVmlkZW8pID8gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS53aWR0aCA6IDE7XG5cblx0XHRpZiAoZmxhc2gub3B0aW9ucy5lbmFibGVQc2V1ZG9TdHJlYW1pbmcgPT09IHRydWUpIHtcblx0XHRcdGZsYXNoVmFycy5wdXNoKGBwc2V1ZG9zdHJlYW1zdGFydD0ke2ZsYXNoLm9wdGlvbnMucHNldWRvU3RyZWFtaW5nU3RhcnRRdWVyeVBhcmFtfWApO1xuXHRcdFx0Zmxhc2hWYXJzLnB1c2goYHBzZXVkb3N0cmVhbXR5cGU9JHtmbGFzaC5vcHRpb25zLnBzZXVkb1N0cmVhbWluZ1R5cGV9YCk7XG5cdFx0fVxuXG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKGZsYXNoLmZsYXNoV3JhcHBlcik7XG5cblx0XHRpZiAoaXNWaWRlbyAmJiBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlICE9PSBudWxsKSB7XG5cdFx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fVxuXG5cdFx0bGV0IHNldHRpbmdzID0gW107XG5cblx0XHRpZiAoSVNfSUUpIHtcblx0XHRcdGxldCBzcGVjaWFsSUVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGZsYXNoLmZsYXNoV3JhcHBlci5hcHBlbmRDaGlsZChzcGVjaWFsSUVDb250YWluZXIpO1xuXG5cdFx0XHRzZXR0aW5ncyA9IFtcblx0XHRcdFx0J2NsYXNzaWQ9XCJjbHNpZDpEMjdDREI2RS1BRTZELTExY2YtOTZCOC00NDQ1NTM1NDAwMDBcIicsXG5cdFx0XHRcdCdjb2RlYmFzZT1cIi8vZG93bmxvYWQubWFjcm9tZWRpYS5jb20vcHViL3Nob2Nrd2F2ZS9jYWJzL2ZsYXNoL3N3Zmxhc2guY2FiXCInLFxuXHRcdFx0XHRgaWQ9XCJfXyR7Zmxhc2guaWQgfVwiYCxcblx0XHRcdFx0YHdpZHRoPVwiJHtmbGFzaFdpZHRofVwiYCxcblx0XHRcdFx0YGhlaWdodD1cIiR7Zmxhc2hIZWlnaHR9XCJgXG5cdFx0XHRdO1xuXG5cdFx0XHRpZiAoIWlzVmlkZW8pIHtcblx0XHRcdFx0c2V0dGluZ3MucHVzaCgnc3R5bGU9XCJjbGlwOiByZWN0KDAgMCAwIDApOyBwb3NpdGlvbjogYWJzb2x1dGU7XCInKTtcblx0XHRcdH1cblxuXHRcdFx0c3BlY2lhbElFQ29udGFpbmVyLm91dGVySFRNTCA9IGA8b2JqZWN0ICR7c2V0dGluZ3Muam9pbignICcpfT5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwibW92aWVcIiB2YWx1ZT1cIiR7Zmxhc2gub3B0aW9ucy5wbHVnaW5QYXRofSR7Zmxhc2gub3B0aW9ucy5maWxlbmFtZX0/eD0ke25ldyBEYXRlKCl9XCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwiZmxhc2h2YXJzXCIgdmFsdWU9XCIke2ZsYXNoVmFycy5qb2luKCcmYW1wOycpfVwiIC8+YCArXG5cdFx0XHRcdGA8cGFyYW0gbmFtZT1cInF1YWxpdHlcIiB2YWx1ZT1cImhpZ2hcIiAvPmAgK1xuXHRcdFx0XHRgPHBhcmFtIG5hbWU9XCJiZ2NvbG9yXCIgdmFsdWU9XCIjMDAwMDAwXCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwid21vZGVcIiB2YWx1ZT1cInRyYW5zcGFyZW50XCIgLz5gICtcblx0XHRcdFx0YDxwYXJhbSBuYW1lPVwiYWxsb3dTY3JpcHRBY2Nlc3NcIiB2YWx1ZT1cImFsd2F5c1wiIC8+YCArXG5cdFx0XHRcdGA8cGFyYW0gbmFtZT1cImFsbG93RnVsbFNjcmVlblwiIHZhbHVlPVwidHJ1ZVwiIC8+YCArXG5cdFx0XHRcdGA8ZGl2PiR7aTE4bi50KCdtZWpzLmluc3RhbGwtZmxhc2gnKX08L2Rpdj5gICtcblx0XHRcdGA8L29iamVjdD5gO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0c2V0dGluZ3MgPSBbXG5cdFx0XHRcdGBpZD1cIl9fJHtmbGFzaC5pZH1cImAsXG5cdFx0XHRcdGBuYW1lPVwiX18ke2ZsYXNoLmlkfVwiYCxcblx0XHRcdFx0J3BsYXk9XCJ0cnVlXCInLFxuXHRcdFx0XHQnbG9vcD1cImZhbHNlXCInLFxuXHRcdFx0XHQncXVhbGl0eT1cImhpZ2hcIicsXG5cdFx0XHRcdCdiZ2NvbG9yPVwiIzAwMDAwMFwiJyxcblx0XHRcdFx0J3dtb2RlPVwidHJhbnNwYXJlbnRcIicsXG5cdFx0XHRcdCdhbGxvd1NjcmlwdEFjY2Vzcz1cImFsd2F5c1wiJyxcblx0XHRcdFx0J2FsbG93RnVsbFNjcmVlbj1cInRydWVcIicsXG5cdFx0XHRcdCd0eXBlPVwiYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2hcIicsXG5cdFx0XHRcdCdwbHVnaW5zcGFnZT1cIi8vd3d3Lm1hY3JvbWVkaWEuY29tL2dvL2dldGZsYXNocGxheWVyXCInLFxuXHRcdFx0XHRgc3JjPVwiJHtmbGFzaC5vcHRpb25zLnBsdWdpblBhdGh9JHtmbGFzaC5vcHRpb25zLmZpbGVuYW1lfVwiYCxcblx0XHRcdFx0YGZsYXNodmFycz1cIiR7Zmxhc2hWYXJzLmpvaW4oJyYnKX1cImAsXG5cdFx0XHRcdGB3aWR0aD1cIiR7Zmxhc2hXaWR0aH1cImAsXG5cdFx0XHRcdGBoZWlnaHQ9XCIke2ZsYXNoSGVpZ2h0fVwiYFxuXHRcdFx0XTtcblxuXHRcdFx0aWYgKCFpc1ZpZGVvKSB7XG5cdFx0XHRcdHNldHRpbmdzLnB1c2goJ3N0eWxlPVwiY2xpcDogcmVjdCgwIDAgMCAwKTsgcG9zaXRpb246IGFic29sdXRlO1wiJyk7XG5cdFx0XHR9XG5cblx0XHRcdGZsYXNoLmZsYXNoV3JhcHBlci5pbm5lckhUTUwgPSBgPGVtYmVkICR7c2V0dGluZ3Muam9pbignICcpfT5gO1xuXHRcdH1cblxuXHRcdGZsYXNoLmZsYXNoTm9kZSA9IGZsYXNoLmZsYXNoV3JhcHBlci5sYXN0Q2hpbGQ7XG5cblx0XHRmbGFzaC5oaWRlID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzVmlkZW8pIHtcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLndpZHRoID0gJzFweCc7XG5cdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5oZWlnaHQgPSAnMXB4Jztcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUuY2xpcCA9ICdyZWN0KDAgMCAwIDApOyc7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Zmxhc2guc2hvdyA9ICgpID0+IHtcblx0XHRcdGlmIChpc1ZpZGVvKSB7XG5cdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuXHRcdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUud2lkdGggPSAnJztcblx0XHRcdFx0Zmxhc2guZmxhc2hOb2RlLnN0eWxlLmhlaWdodCA9ICcnO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZsYXNoLmZsYXNoTm9kZS5zdHlsZS5jbGlwID0gJyc7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Zmxhc2guc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRmbGFzaC5mbGFzaE5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0aWYgKGZsYXNoLmZsYXNoQXBpICE9PSBudWxsKSB7XG5cdFx0XHRcdGZsYXNoLmZsYXNoQXBpLmZpcmVfc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRmbGFzaC5zZXRTcmMobWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGZsYXNoLmxvYWQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmbGFzaDtcblx0fVxufTtcblxuY29uc3QgaGFzRmxhc2ggPSBQbHVnaW5EZXRlY3Rvci5oYXNQbHVnaW5WZXJzaW9uKCdmbGFzaCcsIFsxMCwgMCwgMF0pO1xuXG5pZiAoaGFzRmxhc2gpIHtcblxuXHQvKipcblx0ICogUmVnaXN0ZXIgbWVkaWEgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlIGlmIEZsYXNoIGlzIGRldGVjdGVkXG5cdCAqXG5cdCAqL1xuXHR0eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXG5cdFx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAodXJsLnN0YXJ0c1dpdGgoJ3J0bXAnKSkge1xuXHRcdFx0aWYgKHVybC5pbmNsdWRlcygnLm1wMycpKSB7XG5cdFx0XHRcdHJldHVybiAnYXVkaW8vcnRtcCc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gJ3ZpZGVvL3J0bXAnO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodXJsLmluY2x1ZGVzKCcub2dhJykgfHwgdXJsLmluY2x1ZGVzKCcub2dnJykpIHtcblx0XHRcdHJldHVybiAnYXVkaW8vb2dnJztcblx0XHR9IGVsc2UgaWYgKCFIQVNfTVNFICYmICFTVVBQT1JUU19OQVRJVkVfSExTICYmIHVybC5pbmNsdWRlcygnLm0zdTgnKSkge1xuXHRcdFx0cmV0dXJuICdhcHBsaWNhdGlvbi94LW1wZWdVUkwnO1xuXHRcdH0gZWxzZSBpZiAoIUhBU19NU0UgJiYgdXJsLmluY2x1ZGVzKCcubXBkJykpIHtcblx0XHRcdHJldHVybiAnYXBwbGljYXRpb24vZGFzaCt4bWwnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFZJREVPXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50VmlkZW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfdmlkZW8nLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfdmlkZW8nLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtdmlkZW8uc3dmJyxcblx0XHRcdGVuYWJsZVBzZXVkb1N0cmVhbWluZzogZmFsc2UsXG5cdFx0XHQvLyBzdGFydCBxdWVyeSBwYXJhbWV0ZXIgc2VudCB0byBzZXJ2ZXIgZm9yIHBzZXVkby1zdHJlYW1pbmdcblx0XHRcdHBzZXVkb1N0cmVhbWluZ1N0YXJ0UXVlcnlQYXJhbTogJ3N0YXJ0Jyxcblx0XHRcdC8vIHBzZXVkbyBzdHJlYW1pbmcgdHlwZTogdXNlIGB0aW1lYCBmb3IgdGltZSBiYXNlZCBzZWVraW5nIChNUDQpIG9yIGBieXRlYCBmb3IgZmlsZSBieXRlIHBvc2l0aW9uIChGTFYpXG5cdFx0XHRwc2V1ZG9TdHJlYW1pbmdUeXBlOiAnYnl0ZSdcblx0XHR9LFxuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IGhhc0ZsYXNoICYmIFsndmlkZW8vbXA0JywgJ3ZpZGVvL2ZsdicsICd2aWRlby9ydG1wJywgJ2F1ZGlvL3J0bXAnLCAncnRtcC9tcDQnLCAnYXVkaW8vbXA0J10uaW5jbHVkZXModHlwZSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cblx0fTtcblx0cmVuZGVyZXIuYWRkKEZsYXNoTWVkaWFFbGVtZW50VmlkZW9SZW5kZXJlcik7XG5cblx0Ly8gSExTXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50SGxzVmlkZW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfaGxzJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2hscycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC12aWRlby1obHMuc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gIUhBU19NU0UgJiYgaGFzRmxhc2ggJiYgWydhcHBsaWNhdGlvbi94LW1wZWd1cmwnLCAndm5kLmFwcGxlLm1wZWd1cmwnLCAnYXVkaW8vbXBlZ3VybCcsICdhdWRpby9obHMnLFxuXHRcdFx0J3ZpZGVvL2hscyddLmluY2x1ZGVzKHR5cGUudG9Mb3dlckNhc2UoKSksXG5cblx0XHRjcmVhdGU6IEZsYXNoTWVkaWFFbGVtZW50UmVuZGVyZXIuY3JlYXRlXG5cdH07XG5cdHJlbmRlcmVyLmFkZChGbGFzaE1lZGlhRWxlbWVudEhsc1ZpZGVvUmVuZGVyZXIpO1xuXG5cdC8vIE0oUEVHKS1EQVNIXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50TWRhc2hWaWRlb1JlbmRlcmVyID0ge1xuXHRcdG5hbWU6ICdmbGFzaF9kYXNoJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2Rhc2gnLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtdmlkZW8tbWRhc2guc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gIUhBU19NU0UgJiYgaGFzRmxhc2ggJiYgWydhcHBsaWNhdGlvbi9kYXNoK3htbCddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdFx0Y3JlYXRlOiBGbGFzaE1lZGlhRWxlbWVudFJlbmRlcmVyLmNyZWF0ZVxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRNZGFzaFZpZGVvUmVuZGVyZXIpO1xuXG5cdC8vIEFVRElPXG5cdGNvbnN0IEZsYXNoTWVkaWFFbGVtZW50QXVkaW9SZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfYXVkaW8nLFxuXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0cHJlZml4OiAnZmxhc2hfYXVkaW8nLFxuXHRcdFx0ZmlsZW5hbWU6ICdtZWRpYWVsZW1lbnQtZmxhc2gtYXVkaW8uc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gaGFzRmxhc2ggJiYgWydhdWRpby9tcDMnXS5pbmNsdWRlcyh0eXBlKSxcblxuXHRcdGNyZWF0ZTogRmxhc2hNZWRpYUVsZW1lbnRSZW5kZXJlci5jcmVhdGVcblx0fTtcblx0cmVuZGVyZXIuYWRkKEZsYXNoTWVkaWFFbGVtZW50QXVkaW9SZW5kZXJlcik7XG5cblx0Ly8gQVVESU8gLSBvZ2dcblx0bGV0IEZsYXNoTWVkaWFFbGVtZW50QXVkaW9PZ2dSZW5kZXJlciA9IHtcblx0XHRuYW1lOiAnZmxhc2hfYXVkaW9fb2dnJyxcblxuXHRcdG9wdGlvbnM6IHtcblx0XHRcdHByZWZpeDogJ2ZsYXNoX2F1ZGlvX29nZycsXG5cdFx0XHRmaWxlbmFtZTogJ21lZGlhZWxlbWVudC1mbGFzaC1hdWRpby1vZ2cuc3dmJ1xuXHRcdH0sXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHRcdCAqL1xuXHRcdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gaGFzRmxhc2ggJiYgWydhdWRpby9vZ2cnLCAnYXVkaW8vb2dhJywgJ2F1ZGlvL29ndiddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdFx0Y3JlYXRlOiBGbGFzaE1lZGlhRWxlbWVudFJlbmRlcmVyLmNyZWF0ZVxuXHR9O1xuXHRyZW5kZXJlci5hZGQoRmxhc2hNZWRpYUVsZW1lbnRBdWRpb09nZ1JlbmRlcmVyKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge0hBU19NU0V9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBOYXRpdmUgRkxWIHJlbmRlcmVyXG4gKlxuICogVXNlcyBmbHYuanMsIHdoaWNoIGlzIGEgSmF2YVNjcmlwdCBsaWJyYXJ5IHdoaWNoIGltcGxlbWVudHMgbWVjaGFuaXNtcyB0byBwbGF5IGZsdiBmaWxlcyBpbnNwaXJlZCBieSBmbHYuanMuXG4gKiBJdCByZWxpZXMgb24gSFRNTDUgdmlkZW8gYW5kIE1lZGlhU291cmNlIEV4dGVuc2lvbnMgZm9yIHBsYXliYWNrLlxuICogQ3VycmVudGx5LCBpdCBjYW4gb25seSBwbGF5IGZpbGVzIHdpdGggdGhlIHNhbWUgb3JpZ2luLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0JpbGliaWxpL2Zsdi5qc1xuICpcbiAqL1xuY29uc3QgTmF0aXZlRmx2ID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0Y3JlYXRpb25RdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGxvYWRpbmcgb2YgYW4gRkxWIHNvdXJjZVxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gbG9hZCBhbiBGTFYgcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVGbHYuaXNMb2FkZWQpIHtcblx0XHRcdE5hdGl2ZUZsdi5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE5hdGl2ZUZsdi5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZUZsdi5jcmVhdGlvblF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBmbHYuanMgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEZMViBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlRmx2LmlzTWVkaWFTdGFydGVkKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgZmx2anMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdE5hdGl2ZUZsdi5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNldHRpbmdzLm9wdGlvbnMucGF0aCA9IHR5cGVvZiBzZXR0aW5ncy5vcHRpb25zLnBhdGggPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggOiAnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZmx2LmpzLzEuMS4wL2Zsdi5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlRmx2Lm1lZGlhUmVhZHkoKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR9XG5cdFx0XHROYXRpdmVGbHYuaXNNZWRpYVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBGTFYgcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cdFx0TmF0aXZlRmx2LmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVGbHYuaXNNZWRpYUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoTmF0aXZlRmx2LmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlRmx2LmNyZWF0aW9uUXVldWUucG9wKCk7XG5cdFx0XHROYXRpdmVGbHYuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEZMViBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgRkxWIG9iamVjdFxuXHQgKi9cblx0Y3JlYXRlSW5zdGFuY2U6IChzZXR0aW5ncykgPT4ge1xuXHRcdGxldCBwbGF5ZXIgPSBmbHZqcy5jcmVhdGVQbGF5ZXIoc2V0dGluZ3Mub3B0aW9ucyk7XG5cdFx0d2luZG93W2BfX3JlYWR5X18ke3NldHRpbmdzLmlkfWBdKHBsYXllcik7XG5cdH1cbn07XG5cbmNvbnN0IEZsdk5hdGl2ZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAnbmF0aXZlX2ZsdicsXG5cblx0b3B0aW9uczoge1xuXHRcdHByZWZpeDogJ25hdGl2ZV9mbHYnLFxuXHRcdC8qKlxuXHRcdCAqIEN1c3RvbSBjb25maWd1cmF0aW9uIGZvciBGTFYgcGxheWVyXG5cdFx0ICpcblx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9CaWxpYmlsaS9mbHYuanMvYmxvYi9tYXN0ZXIvZG9jcy9hcGkubWQjY29uZmlnXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHRmbHY6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgZmx2LmpzIGxpYnJhcnlcblx0XHRcdHBhdGg6ICcvL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mbHYuanMvMS4xLjAvZmx2Lm1pbi5qcycsXG5cdFx0XHRjb3JzOiB0cnVlLFxuXHRcdFx0ZW5hYmxlV29ya2VyOiBmYWxzZSxcblx0XHRcdGVuYWJsZVN0YXNoQnVmZmVyOiB0cnVlLFxuXHRcdFx0c3Rhc2hJbml0aWFsU2l6ZTogdW5kZWZpbmVkLFxuXHRcdFx0aXNMaXZlOiBmYWxzZSxcblx0XHRcdGxhenlMb2FkOiB0cnVlLFxuXHRcdFx0bGF6eUxvYWRNYXhEdXJhdGlvbjogMyAqIDYwLFxuXHRcdFx0ZGVmZXJMb2FkQWZ0ZXJTb3VyY2VPcGVuOiB0cnVlLFxuXHRcdFx0c3RhdGlzdGljc0luZm9SZXBvcnRJbnRlcnZhbDogNjAwLFxuXHRcdFx0YWNjdXJhdGVTZWVrOiBmYWxzZSxcblx0XHRcdHNlZWtUeXBlOiAncmFuZ2UnLCAgLy8gW3JhbmdlLCBwYXJhbSwgY3VzdG9tXVxuXHRcdFx0c2Vla1BhcmFtU3RhcnQ6ICdic3RhcnQnLFxuXHRcdFx0c2Vla1BhcmFtRW5kOiAnYmVuZCcsXG5cdFx0XHRyYW5nZUxvYWRaZXJvU3RhcnQ6IGZhbHNlLFxuXHRcdFx0Y3VzdG9tU2Vla0hhbmRsZXI6IHVuZGVmaW5lZFxuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gSEFTX01TRSAmJiBbJ3ZpZGVvL3gtZmx2JywgJ3ZpZGVvL2ZsdiddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdG9yaWdpbmFsTm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUsXG5cdFx0XHRpZCA9IGAke21lZGlhRWxlbWVudC5pZH1fJHtvcHRpb25zLnByZWZpeH1gLFxuXHRcdFx0Zmx2UGxheWVyLFxuXHRcdFx0c3RhY2sgPSB7fSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdG5vZGUgPSBvcmlnaW5hbE5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG1lZGlhRWxlbWVudC5vcHRpb25zKTtcblxuXHRcdC8vIFdSQVBQRVJTIGZvciBQUk9Qc1xuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdG5vZGVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IGZsdlBsYXllciAhPT0gbnVsbCA/ICBub2RlW3Byb3BOYW1lXSA6IG51bGw7XG5cblx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGZsdlBsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bm9kZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnc3JjJykge1xuXHRcdFx0XHRcdFx0XHRmbHZQbGF5ZXIuZGV0YWNoTWVkaWFFbGVtZW50KCk7XG5cdFx0XHRcdFx0XHRcdGZsdlBsYXllci5hdHRhY2hNZWRpYUVsZW1lbnQobm9kZSk7XG5cdFx0XHRcdFx0XHRcdGZsdlBsYXllci5sb2FkKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIGZvciBhZnRlciBcIlJFQURZXCIgZXZlbnQgZmlyZXNcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goe3R5cGU6ICdzZXQnLCBwcm9wTmFtZTogcHJvcE5hbWUsIHZhbHVlOiB2YWx1ZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWwgbWV0aG9kIHRvIHJlZ2lzdGVyIGFsbCBGTFYgZXZlbnRzXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgaWRdID0gKF9mbHZQbGF5ZXIpID0+IHtcblxuXHRcdFx0bWVkaWFFbGVtZW50LmZsdlBsYXllciA9IGZsdlBsYXllciA9IF9mbHZQbGF5ZXI7XG5cblx0XHRcdC8vIGRvIGNhbGwgc3RhY2tcblx0XHRcdGlmIChzdGFjay5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBzdGFjay5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cblx0XHRcdFx0XHRsZXQgc3RhY2tJdGVtID0gc3RhY2tbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdzZXQnKSB7XG5cdFx0XHRcdFx0XHRsZXRcblx0XHRcdFx0XHRcdFx0cHJvcE5hbWUgPSBzdGFja0l0ZW0ucHJvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gXG5cdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRub2RlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTXG5cdFx0XHRsZXRcblx0XHRcdFx0ZXZlbnRzID0gbWVqcy5odG1sNW1lZGlhLmV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXG5cdFx0XHRcdFx0XHRmbHZQbGF5ZXIuZGV0YWNoTWVkaWFFbGVtZW50KCk7XG5cdFx0XHRcdFx0XHRmbHZQbGF5ZXIuYXR0YWNoTWVkaWFFbGVtZW50KG5vZGUpO1xuXHRcdFx0XHRcdFx0Zmx2UGxheWVyLmxvYWQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChlLnR5cGUsIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlKTtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0O1xuXG5cdFx0XHRldmVudHMgPSBldmVudHMuY29uY2F0KFsnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0J10pO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGFzc2lnbkV2ZW50cyhldmVudHNbaV0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdC8vIE9wdGlvbnMgdGhhdCBjYW5ub3QgYmUgb3ZlcnJpZGRlblxuXHRcdG9wdGlvbnMuZmx2LnR5cGUgPSAnZmx2Jztcblx0XHRvcHRpb25zLmZsdi51cmwgPSBub2RlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cblx0XHROYXRpdmVGbHYucHJlcGFyZVNldHRpbmdzKHtcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnMuZmx2LFxuXHRcdFx0aWQ6IGlkXG5cdFx0fSk7XG5cblx0XHQvLyBIRUxQRVIgTUVUSE9EU1xuXHRcdG5vZGUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0bm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fTtcblxuXHRcdG5vZGUuaGlkZSA9ICgpID0+IHtcblx0XHRcdG5vZGUucGF1c2UoKTtcblx0XHRcdG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRmbHZQbGF5ZXIuZGVzdHJveSgpO1xuXHRcdH07XG5cblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncmVuZGVyZXJyZWFkeScsIG5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdHJldHVybiBub2RlO1xuXHR9XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIE5hdGl2ZSBGTFYgdHlwZSBiYXNlZCBvbiBVUkwgc3RydWN0dXJlXG4gKlxuICovXG50eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHR1cmwgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIHVybC5pbmNsdWRlcygnLmZsdicpID8gJ3ZpZGVvL2ZsdicgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZChGbHZOYXRpdmVSZW5kZXJlcik7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge0hBU19NU0V9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQge3R5cGVDaGVja3N9IGZyb20gJy4uL3V0aWxzL21lZGlhJztcblxuLyoqXG4gKiBOYXRpdmUgSExTIHJlbmRlcmVyXG4gKlxuICogVXNlcyBEYWlseU1vdGlvbidzIGhscy5qcywgd2hpY2ggaXMgYSBKYXZhU2NyaXB0IGxpYnJhcnkgd2hpY2ggaW1wbGVtZW50cyBhbiBIVFRQIExpdmUgU3RyZWFtaW5nIGNsaWVudC5cbiAqIEl0IHJlbGllcyBvbiBIVE1MNSB2aWRlbyBhbmQgTWVkaWFTb3VyY2UgRXh0ZW5zaW9ucyBmb3IgcGxheWJhY2suXG4gKiBUaGlzIHJlbmRlcmVyIGludGVncmF0ZXMgbmV3IGV2ZW50cyBhc3NvY2lhdGVkIHdpdGggbTN1OCBmaWxlcyB0aGUgc2FtZSB3YXkgRmxhc2ggdmVyc2lvbiBvZiBIbHMgZG9lcy5cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qc1xuICpcbiAqL1xuY29uc3QgTmF0aXZlSGxzID0ge1xuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc01lZGlhU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzTWVkaWFMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0Y3JlYXRpb25RdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGxvYWRpbmcgb2YgYW4gSExTIHNvdXJjZVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gbG9hZCBhbiBITFMgcGxheWVyIGluc3RhbmNlXG5cdCAqL1xuXHRwcmVwYXJlU2V0dGluZ3M6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmIChOYXRpdmVIbHMuaXNMb2FkZWQpIHtcblx0XHRcdE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE5hdGl2ZUhscy5sb2FkU2NyaXB0KHNldHRpbmdzKTtcblx0XHRcdE5hdGl2ZUhscy5jcmVhdGlvblF1ZXVlLnB1c2goc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogTG9hZCBobHMuanMgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBsb2FkIGFuIEhMUyBwbGF5ZXIgaW5zdGFuY2Vcblx0ICovXG5cdGxvYWRTY3JpcHQ6IChzZXR0aW5ncykgPT4ge1xuXHRcdGlmICghTmF0aXZlSGxzLmlzTWVkaWFTdGFydGVkKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgSGxzICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHROYXRpdmVIbHMuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRzZXR0aW5ncy5vcHRpb25zLnBhdGggPSB0eXBlb2Ygc2V0dGluZ3Mub3B0aW9ucy5wYXRoID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0c2V0dGluZ3Mub3B0aW9ucy5wYXRoIDogJy8vY2RuLmpzZGVsaXZyLm5ldC9obHMuanMvbGF0ZXN0L2hscy5taW4uanMnO1xuXG5cdFx0XHRcdGxldFxuXHRcdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRcdGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0XHRzY3JpcHQuc3JjID0gc2V0dGluZ3Mub3B0aW9ucy5wYXRoO1xuXG5cdFx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFkb25lICYmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0TmF0aXZlSGxzLm1lZGlhUmVhZHkoKTtcblx0XHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR9XG5cdFx0XHROYXRpdmVIbHMuaXNNZWRpYVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBITFMgcGxheWVyIGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRtZWRpYVJlYWR5OiAoKSA9PiB7XG5cdFx0TmF0aXZlSGxzLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHROYXRpdmVIbHMuaXNNZWRpYUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoTmF0aXZlSGxzLmNyZWF0aW9uUXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHNldHRpbmdzID0gTmF0aXZlSGxzLmNyZWF0aW9uUXVldWUucG9wKCk7XG5cdFx0XHROYXRpdmVIbHMuY3JlYXRlSW5zdGFuY2Uoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEhMUyBwbGF5ZXIgYW5kIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gaW5pdGlhbGl6ZSBpdFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gaW5zdGFudGlhdGUgSExTIG9iamVjdFxuXHQgKiBAcmV0dXJuIHtIbHN9XG5cdCAqL1xuXHRjcmVhdGVJbnN0YW5jZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0bGV0IHBsYXllciA9IG5ldyBIbHMoc2V0dGluZ3Mub3B0aW9ucyk7XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2V0dGluZ3MuaWRdKHBsYXllcik7XG5cdFx0cmV0dXJuIHBsYXllcjtcblx0fVxufTtcblxuY29uc3QgSGxzTmF0aXZlUmVuZGVyZXIgPSB7XG5cdG5hbWU6ICduYXRpdmVfaGxzJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnbmF0aXZlX2hscycsXG5cdFx0LyoqXG5cdFx0ICogQ3VzdG9tIGNvbmZpZ3VyYXRpb24gZm9yIEhMUyBwbGF5ZXJcblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9BUEkubWQjdXNlci1jb250ZW50LWZpbmUtdHVuaW5nXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHRobHM6IHtcblx0XHRcdC8vIFNwZWNpYWwgY29uZmlnOiB1c2VkIHRvIHNldCB0aGUgbG9jYWwgcGF0aC9VUkwgb2YgaGxzLmpzIGxpYnJhcnlcblx0XHRcdHBhdGg6ICcvL2Nkbi5qc2RlbGl2ci5uZXQvaGxzLmpzL2xhdGVzdC9obHMubWluLmpzJyxcblx0XHRcdGF1dG9TdGFydExvYWQ6IHRydWUsXG5cdFx0XHRzdGFydFBvc2l0aW9uOiAtMSxcblx0XHRcdGNhcExldmVsVG9QbGF5ZXJTaXplOiBmYWxzZSxcblx0XHRcdGRlYnVnOiBmYWxzZSxcblx0XHRcdG1heEJ1ZmZlckxlbmd0aDogMzAsXG5cdFx0XHRtYXhNYXhCdWZmZXJMZW5ndGg6IDYwMCxcblx0XHRcdG1heEJ1ZmZlclNpemU6IDYwICogMTAwMCAqIDEwMDAsXG5cdFx0XHRtYXhCdWZmZXJIb2xlOiAwLjUsXG5cdFx0XHRtYXhTZWVrSG9sZTogMixcblx0XHRcdHNlZWtIb2xlTnVkZ2VEdXJhdGlvbjogMC4wMSxcblx0XHRcdG1heEZyYWdMb29rVXBUb2xlcmFuY2U6IDAuMixcblx0XHRcdGxpdmVTeW5jRHVyYXRpb25Db3VudDogMyxcblx0XHRcdGxpdmVNYXhMYXRlbmN5RHVyYXRpb25Db3VudDogMTAsXG5cdFx0XHRlbmFibGVXb3JrZXI6IHRydWUsXG5cdFx0XHRlbmFibGVTb2Z0d2FyZUFFUzogdHJ1ZSxcblx0XHRcdG1hbmlmZXN0TG9hZGluZ1RpbWVPdXQ6IDEwMDAwLFxuXHRcdFx0bWFuaWZlc3RMb2FkaW5nTWF4UmV0cnk6IDYsXG5cdFx0XHRtYW5pZmVzdExvYWRpbmdSZXRyeURlbGF5OiA1MDAsXG5cdFx0XHRtYW5pZmVzdExvYWRpbmdNYXhSZXRyeVRpbWVvdXQ6IDY0MDAwLFxuXHRcdFx0bGV2ZWxMb2FkaW5nVGltZU91dDogMTAwMDAsXG5cdFx0XHRsZXZlbExvYWRpbmdNYXhSZXRyeTogNixcblx0XHRcdGxldmVsTG9hZGluZ1JldHJ5RGVsYXk6IDUwMCxcblx0XHRcdGxldmVsTG9hZGluZ01heFJldHJ5VGltZW91dDogNjQwMDAsXG5cdFx0XHRmcmFnTG9hZGluZ1RpbWVPdXQ6IDIwMDAwLFxuXHRcdFx0ZnJhZ0xvYWRpbmdNYXhSZXRyeTogNixcblx0XHRcdGZyYWdMb2FkaW5nUmV0cnlEZWxheTogNTAwLFxuXHRcdFx0ZnJhZ0xvYWRpbmdNYXhSZXRyeVRpbWVvdXQ6IDY0MDAwLFxuXHRcdFx0c3RhcnRGcmFnUHJlZmVjaDogZmFsc2UsXG5cdFx0XHRhcHBlbmRFcnJvck1heFJldHJ5OiAzLFxuXHRcdFx0ZW5hYmxlQ0VBNzA4Q2FwdGlvbnM6IHRydWUsXG5cdFx0XHRzdHJldGNoU2hvcnRWaWRlb1RyYWNrOiB0cnVlLFxuXHRcdFx0Zm9yY2VLZXlGcmFtZU9uRGlzY29udGludWl0eTogdHJ1ZSxcblx0XHRcdGFickV3bWFGYXN0TGl2ZTogNS4wLFxuXHRcdFx0YWJyRXdtYVNsb3dMaXZlOiA5LjAsXG5cdFx0XHRhYnJFd21hRmFzdFZvRDogNC4wLFxuXHRcdFx0YWJyRXdtYVNsb3dWb0Q6IDE1LjAsXG5cdFx0XHRhYnJFd21hRGVmYXVsdEVzdGltYXRlOiA1MDAwMDAsXG5cdFx0XHRhYnJCYW5kV2lkdGhGYWN0b3I6IDAuOCxcblx0XHRcdGFickJhbmRXaWR0aFVwRmFjdG9yOiAwLjdcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IEhBU19NU0UgJiYgWydhcHBsaWNhdGlvbi94LW1wZWd1cmwnLCAndm5kLmFwcGxlLm1wZWd1cmwnLCAnYXVkaW8vbXBlZ3VybCcsICdhdWRpby9obHMnLFxuXHRcdCd2aWRlby9obHMnXS5pbmNsdWRlcyh0eXBlLnRvTG93ZXJDYXNlKCkpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdG9yaWdpbmFsTm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUsXG5cdFx0XHRpZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4LFxuXHRcdFx0aGxzUGxheWVyLFxuXHRcdFx0c3RhY2sgPSB7fSxcblx0XHRcdGksXG5cdFx0XHRpbFxuXHRcdDtcblxuXHRcdG5vZGUgPSBvcmlnaW5hbE5vZGUuY2xvbmVOb2RlKHRydWUpO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG1lZGlhRWxlbWVudC5vcHRpb25zKTtcblxuXHRcdC8vIFdSQVBQRVJTIGZvciBQUk9Qc1xuXHRcdGxldFxuXHRcdFx0cHJvcHMgPSBtZWpzLmh0bWw1bWVkaWEucHJvcGVydGllcyxcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzID0gKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNhcE5hbWUgPSBgJHtwcm9wTmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKX0ke3Byb3BOYW1lLnN1YnN0cmluZygxKX1gO1xuXG5cdFx0XHRcdG5vZGVbYGdldCR7Y2FwTmFtZX1gXSA9ICgpID0+IGhsc1BsYXllciAhPT0gbnVsbCA/ICBub2RlW3Byb3BOYW1lXSA6IG51bGw7XG5cblx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGhsc1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bm9kZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKHByb3BOYW1lID09PSAnc3JjJykge1xuXG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5kZXN0cm95KCk7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllciA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllciA9IE5hdGl2ZUhscy5jcmVhdGVJbnN0YW5jZSh7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9uczogb3B0aW9ucy5obHMsXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGlkXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5hdHRhY2hNZWRpYShub2RlKTtcblx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLm9uKEhscy5FdmVudHMuTUVESUFfQVRUQUNIRUQsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRobHNQbGF5ZXIubG9hZFNvdXJjZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRzdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsIG1ldGhvZCB0byByZWdpc3RlciBhbGwgSExTIGV2ZW50c1xuXHRcdHdpbmRvd1snX19yZWFkeV9fJyArIGlkXSA9IChfaGxzUGxheWVyKSA9PiB7XG5cblx0XHRcdG1lZGlhRWxlbWVudC5obHNQbGF5ZXIgPSBobHNQbGF5ZXIgPSBfaGxzUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoc3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gc3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IHN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0bm9kZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRub2RlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBCVUJCTEUgRVZFTlRTXG5cdFx0XHRsZXRcblx0XHRcdFx0ZXZlbnRzID0gbWVqcy5odG1sNW1lZGlhLmV2ZW50cywgaGxzRXZlbnRzID0gSGxzLkV2ZW50cyxcblx0XHRcdFx0YXNzaWduRXZlbnRzID0gKGV2ZW50TmFtZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ2xvYWRlZG1ldGFkYXRhJykge1xuXG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIuZGV0YWNoTWVkaWEoKTtcblxuXHRcdFx0XHRcdFx0bGV0IHVybCA9IG5vZGUuc3JjO1xuXG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIuYXR0YWNoTWVkaWEobm9kZSk7XG5cdFx0XHRcdFx0XHRobHNQbGF5ZXIub24oaGxzRXZlbnRzLk1FRElBX0FUVEFDSEVELCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGhsc1BsYXllci5sb2FkU291cmNlKHVybCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gY29weSBldmVudFxuXHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChlLnR5cGUsIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlKTtcblx0XHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0XHQvLyBldmVudC50YXJnZXQgPSBlLnNyY0VsZW1lbnQ7XG5cblx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5jb25jYXQoWydjbGljaycsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnXSk7XG5cblx0XHRcdGZvciAoaSA9IDAsIGlsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0YXNzaWduRXZlbnRzKGV2ZW50c1tpXSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ3VzdG9tIEhMUyBldmVudHNcblx0XHRcdCAqXG5cdFx0XHQgKiBUaGVzZSBldmVudHMgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBvcmlnaW5hbCBub2RlIHVzaW5nIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHRoZSBuYW1lIG9mIHRoZSBldmVudCxcblx0XHRcdCAqIG5vdCB1c2luZyBIbHMuRXZlbnRzIG9iamVjdFxuXHRcdFx0ICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGFpbHltb3Rpb24vaGxzLmpzL2Jsb2IvbWFzdGVyL3NyYy9ldmVudHMuanNcblx0XHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RhaWx5bW90aW9uL2hscy5qcy9ibG9iL21hc3Rlci9zcmMvZXJyb3JzLmpzXG5cdFx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYWlseW1vdGlvbi9obHMuanMvYmxvYi9tYXN0ZXIvQVBJLm1kI3J1bnRpbWUtZXZlbnRzXG5cdFx0XHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYWlseW1vdGlvbi9obHMuanMvYmxvYi9tYXN0ZXIvQVBJLm1kI2Vycm9yc1xuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBhc3NpZ25IbHNFdmVudHMgPSBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChlLCBub2RlKTtcblx0XHRcdFx0ZXZlbnQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0XHRpZiAoZSA9PT0gJ2hsc0Vycm9yJykge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSwgZGF0YSk7XG5cblx0XHRcdFx0XHQvLyBib3Jyb3dlZCBmcm9tIGh0dHA6Ly9kYWlseW1vdGlvbi5naXRodWIuaW8vaGxzLmpzL2RlbW8vXG5cdFx0XHRcdFx0aWYgKGRhdGEuZmF0YWwpIHtcblx0XHRcdFx0XHRcdGhsc1BsYXllci5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAoZGF0YS50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21lZGlhRXJyb3InOlxuXHRcdFx0XHRcdFx0XHRcdGhsc1BsYXllci5yZWNvdmVyTWVkaWFFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ25ldHdvcmtFcnJvcic6XG5cdFx0XHRcdFx0XHRcdFx0aGxzUGxheWVyLnN0YXJ0TG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKGxldCBldmVudFR5cGUgaW4gaGxzRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChobHNFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSkge1xuXHRcdFx0XHRcdGhsc1BsYXllci5vbihobHNFdmVudHNbZXZlbnRUeXBlXSwgYXNzaWduSGxzRXZlbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0b3JpZ2luYWxOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG9yaWdpbmFsTm9kZSk7XG5cdFx0b3JpZ2luYWxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXV0b3BsYXknKTtcblx0XHRvcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdE5hdGl2ZUhscy5wcmVwYXJlU2V0dGluZ3Moe1xuXHRcdFx0b3B0aW9uczogb3B0aW9ucy5obHMsXG5cdFx0XHRpZDogaWRcblx0XHR9KTtcblxuXHRcdC8vIEhFTFBFUiBNRVRIT0RTXG5cdFx0bm9kZS5zZXRTaXplID0gKHdpZHRoLCBoZWlnaHQpID0+IHtcblx0XHRcdG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRub2RlLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRub2RlLnBhdXNlKCk7XG5cdFx0XHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5kZXN0cm95ID0gKCkgPT4ge1xuXHRcdFx0aGxzUGxheWVyLmRlc3Ryb3koKTtcblx0XHR9O1xuXG5cdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3JlbmRlcmVycmVhZHknLCBub2RlKTtcblx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBOYXRpdmUgSExTIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiB1cmwuaW5jbHVkZXMoJy5tM3U4JykgPyAnYXBwbGljYXRpb24veC1tcGVnVVJMJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKEhsc05hdGl2ZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnR9IGZyb20gJy4uL3V0aWxzL2RvbSc7XG5pbXBvcnQge1NVUFBPUlRTX05BVElWRV9ITFMsIElTX0FORFJPSUR9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cbi8qKlxuICogTmF0aXZlIEhUTUw1IFJlbmRlcmVyXG4gKlxuICogV3JhcHMgdGhlIG5hdGl2ZSBIVE1MNSA8YXVkaW8+IG9yIDx2aWRlbz4gdGFnIGFuZCBidWJibGVzIGl0cyBwcm9wZXJ0aWVzLCBldmVudHMsIGFuZCBtZXRob2RzIHVwIHRvIHRoZSBtZWRpYUVsZW1lbnQuXG4gKi9cbmNvbnN0IEh0bWxNZWRpYUVsZW1lbnQgPSB7XG5cblx0bmFtZTogJ2h0bWw1JyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnaHRtbDUnXG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7U3RyaW5nfVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiB7XG5cblx0XHRsZXQgbWVkaWFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuXHRcdC8vIER1ZSB0byBhbiBpc3N1ZSBvbiBXZWJraXQsIGZvcmNlIHRoZSBNUDMgYW5kIE1QNCBvbiBBbmRyb2lkIGFuZCBjb25zaWRlciBuYXRpdmUgc3VwcG9ydCBmb3IgSExTXG5cdFx0aWYgKChJU19BTkRST0lEICYmIHR5cGUubWF0Y2goL1xcL21wKDN8NCkkL2dpKSAhPT0gbnVsbCkgfHxcblx0XHRcdChbJ2FwcGxpY2F0aW9uL3gtbXBlZ3VybCcsICd2bmQuYXBwbGUubXBlZ3VybCcsICdhdWRpby9tcGVndXJsJywgJ2F1ZGlvL2hscycsXG5cdFx0XHRcdCd2aWRlby9obHMnXS5pbmNsdWRlcyh0eXBlLnRvTG93ZXJDYXNlKCkpICYmIFNVUFBPUlRTX05BVElWRV9ITFMpKSB7XG5cdFx0XHRyZXR1cm4gJ3llcyc7XG5cdFx0fSBlbHNlIGlmIChtZWRpYUVsZW1lbnQuY2FuUGxheVR5cGUpIHtcblx0XHRcdHJldHVybiBtZWRpYUVsZW1lbnQuY2FuUGxheVR5cGUodHlwZSkucmVwbGFjZSgvbm8vLCAnJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0XG5cdFx0XHRub2RlID0gbnVsbCxcblx0XHRcdGlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXgsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHQvLyBDUkVBVEUgTk9ERVxuXHRcdGlmIChtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlID09PSB1bmRlZmluZWQgfHwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSA9PT0gbnVsbCkge1xuXHRcdFx0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG5cdFx0XHRtZWRpYUVsZW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZSA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGU7XG5cdFx0fVxuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXG5cdFx0Ly8gV1JBUFBFUlMgZm9yIFBST1BzXG5cdFx0Y29uc3Rcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRub2RlW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiBub2RlW3Byb3BOYW1lXTtcblxuXHRcdFx0XHRub2RlW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRub2RlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gcHJvcHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMocHJvcHNbaV0pO1xuXHRcdH1cblxuXHRcdGNvbnN0XG5cdFx0XHRldmVudHMgPSBtZWpzLmh0bWw1bWVkaWEuZXZlbnRzLmNvbmNhdChbJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCddKSxcblx0XHRcdGFzc2lnbkV2ZW50cyA9IChldmVudE5hbWUpID0+IHtcblxuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoZSkgPT4ge1xuXHRcdFx0XHRcdC8vIGNvcHkgZXZlbnRcblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KGUudHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUpO1xuXHRcdFx0XHRcdC8vIGV2ZW50LnNyY0VsZW1lbnQgPSBlLnNyY0VsZW1lbnQ7XG5cdFx0XHRcdFx0Ly8gZXZlbnQudGFyZ2V0ID0gZS5zcmNFbGVtZW50O1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25FdmVudHMoZXZlbnRzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBIRUxQRVIgTUVUSE9EU1xuXHRcdG5vZGUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRub2RlLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0bm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5oaWRlID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9O1xuXG5cdFx0bm9kZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0bm9kZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH07XG5cblx0XHRpZiAobWVkaWFGaWxlcyAmJiBtZWRpYUZpbGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAoaSA9IDAsIGlsID0gbWVkaWFGaWxlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChyZW5kZXJlci5yZW5kZXJlcnNbb3B0aW9ucy5wcmVmaXhdLmNhblBsYXlUeXBlKG1lZGlhRmlsZXNbaV0udHlwZSkpIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgbWVkaWFGaWxlc1tpXS5zcmMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3JlbmRlcmVycmVhZHknLCBub2RlKTtcblx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxufTtcblxud2luZG93Lkh0bWxNZWRpYUVsZW1lbnQgPSBtZWpzLkh0bWxNZWRpYUVsZW1lbnQgPSBIdG1sTWVkaWFFbGVtZW50O1xuXG5yZW5kZXJlci5hZGQoSHRtbE1lZGlhRWxlbWVudCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogU291bmRDbG91ZCByZW5kZXJlclxuICpcbiAqIFVzZXMgPGlmcmFtZT4gYXBwcm9hY2ggYW5kIHVzZXMgU291bmRDbG91ZCBXaWRnZXQgQVBJIHRvIG1hbmlwdWxhdGUgaXQuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5zb3VuZGNsb3VkLmNvbS9kb2NzL2FwaS9odG1sNS13aWRnZXRcbiAqL1xuY29uc3QgU291bmRDbG91ZEFwaSA9IHtcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtTdGFydGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtCb29sZWFufVxuXHQgKi9cblx0aXNTREtMb2FkZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0aWZyYW1lUXVldWU6IFtdLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBxdWV1ZSB0byBwcmVwYXJlIHRoZSBjcmVhdGlvbiBvZiA8aWZyYW1lPlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBhbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyBuZWVkZWQgdG8gY3JlYXRlIDxpZnJhbWU+XG5cdCAqL1xuXHRlbnF1ZXVlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblxuXHRcdGlmIChTb3VuZENsb3VkQXBpLmlzTG9hZGVkKSB7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFNvdW5kQ2xvdWRBcGkubG9hZElmcmFtZUFwaSgpO1xuXHRcdFx0U291bmRDbG91ZEFwaS5pZnJhbWVRdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgU291bmRDbG91ZCBBUEkgc2NyaXB0IG9uIHRoZSBoZWFkZXIgb2YgdGhlIGRvY3VtZW50XG5cdCAqXG5cdCAqL1xuXHRsb2FkSWZyYW1lQXBpOiAoKSA9PiB7XG5cdFx0aWYgKCFTb3VuZENsb3VkQXBpLmlzU0RLU3RhcnRlZCkge1xuXG5cdFx0XHRsZXQgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksXG5cdFx0XHRcdGRvbmUgPSBmYWxzZTtcblxuXHRcdFx0c2NyaXB0LnNyYyA9ICcvL3cuc291bmRjbG91ZC5jb20vcGxheWVyL2FwaS5qcyc7XG5cblx0XHRcdC8vIEF0dGFjaCBoYW5kbGVycyBmb3IgYWxsIGJyb3dzZXJzXG5cdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblx0XHRcdFx0aWYgKCFkb25lICYmICghU291bmRDbG91ZEFwaS5yZWFkeVN0YXRlIHx8IFNvdW5kQ2xvdWRBcGkucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCBTb3VuZENsb3VkQXBpLnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikpIHtcblx0XHRcdFx0XHRkb25lID0gdHJ1ZTtcblx0XHRcdFx0XHRTb3VuZENsb3VkQXBpLmFwaVJlYWR5KCk7XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgbWVtb3J5IGxlYWsgaW4gSUVcblx0XHRcdFx0XHRzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdFx0XHRcdFx0aWYgKGhlYWQgJiYgc2NyaXB0LnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmlzU0RLU3RhcnRlZCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHF1ZXVlIG9mIFNvdW5kQ2xvdWQgPGlmcmFtZT4gZWxlbWVudCBjcmVhdGlvblxuXHQgKlxuXHQgKi9cblx0YXBpUmVhZHk6ICgpID0+IHtcblx0XHRTb3VuZENsb3VkQXBpLmlzTG9hZGVkID0gdHJ1ZTtcblx0XHRTb3VuZENsb3VkQXBpLmlzU0RLTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlIChTb3VuZENsb3VkQXBpLmlmcmFtZVF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdGxldCBzZXR0aW5ncyA9IFNvdW5kQ2xvdWRBcGkuaWZyYW1lUXVldWUucG9wKCk7XG5cdFx0XHRTb3VuZENsb3VkQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgU291bmRDbG91ZCBXaWRnZXQgcGxheWVyIGFuZCB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IHRvIGluaXRpYWxpemUgaXRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0Y3JlYXRlSWZyYW1lOiAoc2V0dGluZ3MpID0+IHtcblx0XHRsZXQgcGxheWVyID0gU0MuV2lkZ2V0KHNldHRpbmdzLmlmcmFtZSk7XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2V0dGluZ3MuaWRdKHBsYXllcik7XG5cdH1cbn07XG5cbmNvbnN0IFNvdW5kQ2xvdWRJZnJhbWVSZW5kZXJlciA9IHtcblx0bmFtZTogJ3NvdW5kY2xvdWRfaWZyYW1lJyxcblxuXHRvcHRpb25zOiB7XG5cdFx0cHJlZml4OiAnc291bmRjbG91ZF9pZnJhbWUnXG5cdH0sXG5cblx0LyoqXG5cdCAqIERldGVybWluZSBpZiBhIHNwZWNpZmljIGVsZW1lbnQgdHlwZSBjYW4gYmUgcGxheWVkIHdpdGggdGhpcyByZW5kZXJcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGNhblBsYXlUeXBlOiAodHlwZSkgPT4gWyd2aWRlby9zb3VuZGNsb3VkJywgJ3ZpZGVvL3gtc291bmRjbG91ZCddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0bGV0IHNjID0ge307XG5cblx0XHQvLyBzdG9yZSBtYWluIHZhcmlhYmxlXG5cdFx0c2Mub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0c2MuaWQgPSBtZWRpYUVsZW1lbnQuaWQgKyAnXycgKyBvcHRpb25zLnByZWZpeDtcblx0XHRzYy5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBjcmVhdGUgb3VyIGZha2UgZWxlbWVudCB0aGF0IGFsbG93cyBldmVudHMgYW5kIHN1Y2ggdG8gd29ya1xuXHRcdGxldFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHNjUGxheWVyUmVhZHkgPSBmYWxzZSxcblx0XHRcdHNjUGxheWVyID0gbnVsbCxcblx0XHRcdHNjSWZyYW1lID0gbnVsbCxcblx0XHRcdGN1cnJlbnRUaW1lID0gMCxcblx0XHRcdGR1cmF0aW9uID0gMCxcblx0XHRcdGJ1ZmZlcmVkVGltZSA9IDAsXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0dm9sdW1lID0gMSxcblx0XHRcdG11dGVkID0gZmFsc2UsXG5cdFx0XHRlbmRlZCA9IGZhbHNlLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRzY1tgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChzY1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0Ly8gZmlndXJlIG91dCBob3cgdG8gZ2V0IGRtIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY3VycmVudFRpbWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnZHVyYXRpb24nOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkdXJhdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2b2x1bWU7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBtdXRlZDsgLy8gP1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2J1ZmZlcmVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQ6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0ZW5kOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBidWZmZXJlZFRpbWUgKiBkdXJhdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRsZW5ndGg6IDFcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoc2NJZnJhbWUpID8gc2NJZnJhbWUuc3JjIDogJyc7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHNjW2BzZXQke2NhcE5hbWV9YF0gPSAodmFsdWUpID0+IHtcblxuXHRcdFx0XHRcdGlmIChzY1BsYXllciAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmM7XG5cblx0XHRcdFx0XHRcdFx0XHRzY1BsYXllci5sb2FkKHVybCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnY3VycmVudFRpbWUnOlxuXHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNlZWtUbyh2YWx1ZSAqIDEwMDApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNldFZvbHVtZSgwKTsgLy8gP1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzY1BsYXllci5zZXRWb2x1bWUoMSk7IC8vID9cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgc2MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHNjUGxheWVyLnNldFZvbHVtZSh2YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgc2MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzYyAnICsgc2MuaWQsIHByb3BOYW1lLCAnVU5TVVBQT1JURUQgcHJvcGVydHknKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBzdG9yZSBmb3IgYWZ0ZXIgXCJSRUFEWVwiIGV2ZW50IGZpcmVzXG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnc2V0JywgcHJvcE5hbWU6IHByb3BOYW1lLCB2YWx1ZTogdmFsdWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IHByb3BzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGFzc2lnbkdldHRlcnNTZXR0ZXJzKHByb3BzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgd3JhcHBlcnMgZm9yIG5hdGl2ZSBtZXRob2RzXG5cdFx0bGV0XG5cdFx0XHRtZXRob2RzID0gbWVqcy5odG1sNW1lZGlhLm1ldGhvZHMsXG5cdFx0XHRhc3NpZ25NZXRob2RzID0gKG1ldGhvZE5hbWUpID0+IHtcblxuXHRcdFx0XHQvLyBydW4gdGhlIG1ldGhvZCBvbiB0aGUgU291bmRjbG91ZCBBUElcblx0XHRcdFx0c2NbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoc2NQbGF5ZXIgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRE8gbWV0aG9kXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKG1ldGhvZE5hbWUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGxheSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjUGxheWVyLnBsYXkoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBzY1BsYXllci5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdsb2FkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFwaVN0YWNrLnB1c2goe3R5cGU6ICdjYWxsJywgbWV0aG9kTmFtZTogbWV0aG9kTmFtZX0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0fVxuXHRcdDtcblxuXHRcdGZvciAoaSA9IDAsIGlsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25NZXRob2RzKG1ldGhvZHNbaV0pO1xuXHRcdH1cblxuXHRcdC8vIGFkZCBhIHJlYWR5IG1ldGhvZCB0aGF0IFNDIGNhbiBmaXJlXG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgc2MuaWRdID0gKF9zY1BsYXllcikgPT4ge1xuXG5cdFx0XHRzY1BsYXllclJlYWR5ID0gdHJ1ZTtcblx0XHRcdG1lZGlhRWxlbWVudC5zY1BsYXllciA9IHNjUGxheWVyID0gX3NjUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0c2NbYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0c2Nbc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNvdW5kQ2xvdWQgcHJvcGVydGllcyBhcmUgYXN5bmMsIHNvIHdlIGRvbid0IGZpcmUgdGhlIGV2ZW50IHVudGlsIHRoZSBwcm9wZXJ0eSBjYWxsYmFjayBmaXJlc1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLlBMQVlfUFJPR1JFU1MsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0c2NQbGF5ZXIuZ2V0UG9zaXRpb24oKF9jdXJyZW50VGltZSkgPT4ge1xuXHRcdFx0XHRcdGN1cnJlbnRUaW1lID0gX2N1cnJlbnRUaW1lIC8gMTAwMDtcblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIHNjKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNjUGxheWVyLmJpbmQoU0MuV2lkZ2V0LkV2ZW50cy5QQVVTRSwgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwYXVzZScsIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuUExBWSwgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGxheScsIHNjKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRzY1BsYXllci5iaW5kKFNDLldpZGdldC5FdmVudHMuRklOSVNIRUQsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdGVuZGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZW5kZWQnLCBzYyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLlJFQURZLCAoKSA9PiB7XG5cdFx0XHRcdHNjUGxheWVyLmdldER1cmF0aW9uKChfZHVyYXRpb24pID0+IHtcblx0XHRcdFx0XHRkdXJhdGlvbiA9IF9kdXJhdGlvbiAvIDEwMDA7XG5cblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnbG9hZGVkbWV0YWRhdGEnLCBzYyk7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0c2NQbGF5ZXIuYmluZChTQy5XaWRnZXQuRXZlbnRzLkxPQURfUFJPR1JFU1MsICgpID0+IHtcblx0XHRcdFx0c2NQbGF5ZXIuZ2V0RHVyYXRpb24oKGxvYWRQcm9ncmVzcykgPT4ge1xuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdGJ1ZmZlcmVkVGltZSA9IGR1cmF0aW9uICogbG9hZFByb2dyZXNzO1xuXG5cdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncHJvZ3Jlc3MnLCBzYyk7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2NQbGF5ZXIuZ2V0RHVyYXRpb24oKF9kdXJhdGlvbikgPT4ge1xuXHRcdFx0XHRcdGR1cmF0aW9uID0gX2R1cmF0aW9uO1xuXG5cdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ2xvYWRlZG1ldGFkYXRhJywgc2MpO1xuXHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2l2ZSBpbml0aWFsIGV2ZW50c1xuXHRcdFx0bGV0IGluaXRFdmVudHMgPSBbJ3JlbmRlcmVycmVhZHknLCAnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICdjYW5wbGF5J107XG5cblx0XHRcdGZvciAobGV0IGkgPSAwLCBpbCA9IGluaXRFdmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChpbml0RXZlbnRzW2ldLCBzYyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gY29udGFpbmVyIGZvciBBUEkgQVBJXG5cdFx0c2NJZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblx0XHRzY0lmcmFtZS5pZCA9IHNjLmlkO1xuXHRcdHNjSWZyYW1lLndpZHRoID0gMTA7XG5cdFx0c2NJZnJhbWUuaGVpZ2h0ID0gMTA7XG5cdFx0c2NJZnJhbWUuZnJhbWVCb3JkZXIgPSAwO1xuXHRcdHNjSWZyYW1lLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblx0XHRzY0lmcmFtZS5zcmMgPSBtZWRpYUZpbGVzWzBdLnNyYztcblx0XHRzY0lmcmFtZS5zY3JvbGxpbmcgPSAnbm8nO1xuXG5cdFx0bWVkaWFFbGVtZW50LmFwcGVuZENoaWxkKHNjSWZyYW1lKTtcblx0XHRtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRsZXQgc2NTZXR0aW5ncyA9IHtcblx0XHRcdGlmcmFtZTogc2NJZnJhbWUsXG5cdFx0XHRpZDogc2MuaWRcblx0XHR9O1xuXG5cdFx0U291bmRDbG91ZEFwaS5lbnF1ZXVlSWZyYW1lKHNjU2V0dGluZ3MpO1xuXG5cdFx0c2Muc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHQvLyBub3RoaW5nIGhlcmUsIGF1ZGlvIG9ubHlcblx0XHR9O1xuXHRcdHNjLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHRzYy5wYXVzZSgpO1xuXHRcdFx0aWYgKHNjSWZyYW1lKSB7XG5cdFx0XHRcdHNjSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRzYy5zaG93ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHNjSWZyYW1lKSB7XG5cdFx0XHRcdHNjSWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHNjLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRzY1BsYXllci5kZXN0cm95KCk7XG5cdFx0fTtcblxuXHRcdHJldHVybiBzYztcblx0fVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBTb3VuZENsb3VkIHR5cGUgYmFzZWQgb24gVVJMIHN0cnVjdHVyZVxuICpcbiAqL1xudHlwZUNoZWNrcy5wdXNoKCh1cmwpID0+IHtcblx0dXJsID0gdXJsLnRvTG93ZXJDYXNlKCk7XG5cdHJldHVybiAodXJsLmluY2x1ZGVzKCcvL3NvdW5kY2xvdWQuY29tJykgfHwgdXJsLmluY2x1ZGVzKCcvL3cuc291bmRjbG91ZC5jb20nKSkgPyAndmlkZW8veC1zb3VuZGNsb3VkJyA6IG51bGw7XG59KTtcblxucmVuZGVyZXIuYWRkKFNvdW5kQ2xvdWRJZnJhbWVSZW5kZXJlcik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuaW1wb3J0IHtyZW5kZXJlcn0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XG5pbXBvcnQge2NyZWF0ZUV2ZW50LCBhZGRFdmVudH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7dHlwZUNoZWNrc30gZnJvbSAnLi4vdXRpbHMvbWVkaWEnO1xuXG4vKipcbiAqIFZpbWVvIHJlbmRlcmVyXG4gKlxuICogVXNlcyA8aWZyYW1lPiBhcHByb2FjaCBhbmQgdXNlcyBWaW1lbyBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIEFsbCBWaW1lbyBjYWxscyByZXR1cm4gYSBQcm9taXNlIHNvIHRoaXMgcmVuZGVyZXIgYWNjb3VudHMgZm9yIHRoYXRcbiAqIHRvIHVwZGF0ZSBhbGwgdGhlIG5lY2Vzc2FyeSB2YWx1ZXMgdG8gaW50ZXJhY3Qgd2l0aCBNZWRpYUVsZW1lbnQgcGxheWVyLlxuICogTm90ZTogSUU4IGltcGxlbWVudHMgRUNNQVNjcmlwdCAzIHRoYXQgZG9lcyBub3QgYWxsb3cgYmFyZSBrZXl3b3JkcyBpbiBkb3Qgbm90YXRpb247XG4gKiB0aGF0J3Mgd2h5IGluc3RlYWQgb2YgdXNpbmcgLmNhdGNoIFsnY2F0Y2gnXSBpcyBiZWluZyB1c2VkLlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdmltZW8vcGxheWVyLmpzXG4gKlxuICovXG5jb25zdCB2aW1lb0FwaSA9IHtcblxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0lmcmFtZVN0YXJ0ZWQ6IGZhbHNlLFxuXHQvKipcblx0ICogQHR5cGUge0Jvb2xlYW59XG5cdCAqL1xuXHRpc0lmcmFtZUxvYWRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7QXJyYXl9XG5cdCAqL1xuXHRpZnJhbWVRdWV1ZTogW10sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHF1ZXVlIHRvIHByZXBhcmUgdGhlIGNyZWF0aW9uIG9mIDxpZnJhbWU+XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGVucXVldWVJZnJhbWU6IChzZXR0aW5ncykgPT4ge1xuXG5cdFx0aWYgKHZpbWVvQXBpLmlzTG9hZGVkKSB7XG5cdFx0XHR2aW1lb0FwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2aW1lb0FwaS5sb2FkSWZyYW1lQXBpKCk7XG5cdFx0XHR2aW1lb0FwaS5pZnJhbWVRdWV1ZS5wdXNoKHNldHRpbmdzKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIExvYWQgVmltZW8gQVBJIHNjcmlwdCBvbiB0aGUgaGVhZGVyIG9mIHRoZSBkb2N1bWVudFxuXHQgKlxuXHQgKi9cblx0bG9hZElmcmFtZUFwaTogKCkgPT4ge1xuXG5cdFx0aWYgKCF2aW1lb0FwaS5pc0lmcmFtZVN0YXJ0ZWQpIHtcblxuXHRcdFx0bGV0XG5cdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuXHRcdFx0XHRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSxcblx0XHRcdFx0ZG9uZSA9IGZhbHNlO1xuXG5cdFx0XHRzY3JpcHQuc3JjID0gJy8vcGxheWVyLnZpbWVvLmNvbS9hcGkvcGxheWVyLmpzJztcblxuXHRcdFx0Ly8gQXR0YWNoIGhhbmRsZXJzIGZvciBhbGwgYnJvd3NlcnNcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0XHRpZiAoIWRvbmUgJiYgKCF2aW1lb0FwaS5yZWFkeVN0YXRlIHx8IHZpbWVvQXBpLnJlYWR5U3RhdGUgPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHRcdHZpbWVvQXBpLnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIgfHwgdmltZW9BcGkucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSkge1xuXHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xuXHRcdFx0XHRcdHZpbWVvQXBpLmlGcmFtZVJlYWR5KCk7XG5cdFx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBmaXJzdFNjcmlwdFRhZyk7XG5cdFx0XHR2aW1lb0FwaS5pc0lmcmFtZVN0YXJ0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogUHJvY2VzcyBxdWV1ZSBvZiBWaW1lbyA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRpRnJhbWVSZWFkeTogKCkgPT4ge1xuXG5cdFx0dmltZW9BcGkuaXNMb2FkZWQgPSB0cnVlO1xuXHRcdHZpbWVvQXBpLmlzSWZyYW1lTG9hZGVkID0gdHJ1ZTtcblxuXHRcdHdoaWxlICh2aW1lb0FwaS5pZnJhbWVRdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSB2aW1lb0FwaS5pZnJhbWVRdWV1ZS5wb3AoKTtcblx0XHRcdHZpbWVvQXBpLmNyZWF0ZUlmcmFtZShzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgVmltZW8gQVBJIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGNyZWF0ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0bGV0IHBsYXllciA9IG5ldyBWaW1lby5QbGF5ZXIoc2V0dGluZ3MuaWZyYW1lKTtcblx0XHR3aW5kb3dbJ19fcmVhZHlfXycgKyBzZXR0aW5ncy5pZF0ocGxheWVyKTtcblx0fSxcblxuXHQvKipcblx0ICogRXh0cmFjdCBudW1lcmljIHZhbHVlIGZyb20gVmltZW8gdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqICAtIGh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby81OTc3NzM5MlxuXHQgKiAgLSBodHRwczovL3ZpbWVvLmNvbS81OTc3NzM5MlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gVmltZW8gZnVsbCBVUkwgdG8gZ3JhYiB0aGUgbnVtYmVyIElkIG9mIHRoZSBzb3VyY2Vcblx0ICogQHJldHVybiB7aW50fVxuXHQgKi9cblx0Z2V0VmltZW9JZDogKHVybCkgPT4ge1xuXHRcdGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJ0cyA9IHVybC5zcGxpdCgnPycpO1xuXG5cdFx0dXJsID0gcGFydHNbMF07XG5cblx0XHRyZXR1cm4gcGFyc2VJbnQodXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcblx0fSxcblxuXHQvKipcblx0ICogR2VuZXJhdGUgY3VzdG9tIGVycm9ycyBmb3IgVmltZW8gYmFzZWQgb24gdGhlIEFQSSBzcGVjaWZpY2F0aW9uc1xuXHQgKlxuXHQgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92aW1lby9wbGF5ZXIuanMjZXJyb3Jcblx0ICogQHBhcmFtIHtPYmplY3R9IGVycm9yXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcblx0ICovXG5cdGVycm9ySGFuZGxlcjogKGVycm9yLCB0YXJnZXQpID0+IHtcblx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnZXJyb3InLCB0YXJnZXQpO1xuXHRcdGV2ZW50Lm1lc3NhZ2UgPSBlcnJvci5uYW1lICsgJzogJyArIGVycm9yLm1lc3NhZ2U7XG5cdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9XG59O1xuXG5jb25zdCB2aW1lb0lmcmFtZVJlbmRlcmVyID0ge1xuXG5cdG5hbWU6ICd2aW1lb19pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICd2aW1lb19pZnJhbWUnXG5cdH0sXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyBlbGVtZW50IHR5cGUgY2FuIGJlIHBsYXllZCB3aXRoIHRoaXMgcmVuZGVyXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRjYW5QbGF5VHlwZTogKHR5cGUpID0+IFsndmlkZW8vdmltZW8nLCAndmlkZW8veC12aW1lbyddLmluY2x1ZGVzKHR5cGUpLFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgdGhlIHBsYXllciBpbnN0YW5jZSBhbmQgYWRkIGFsbCBuYXRpdmUgZXZlbnRzL21ldGhvZHMvcHJvcGVydGllcyBhcyBwb3NzaWJsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge01lZGlhRWxlbWVudH0gbWVkaWFFbGVtZW50IEluc3RhbmNlIG9mIG1lanMuTWVkaWFFbGVtZW50IGFscmVhZHkgY3JlYXRlZFxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbGwgdGhlIHBsYXllciBjb25maWd1cmF0aW9uIG9wdGlvbnMgcGFzc2VkIHRocm91Z2ggY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHtPYmplY3RbXX0gbWVkaWFGaWxlcyBMaXN0IG9mIHNvdXJjZXMgd2l0aCBmb3JtYXQ6IHtzcmM6IHVybCwgdHlwZTogeC95LXp9XG5cdCAqIEByZXR1cm4ge09iamVjdH1cblx0ICovXG5cdGNyZWF0ZTogKG1lZGlhRWxlbWVudCwgb3B0aW9ucywgbWVkaWFGaWxlcykgPT4ge1xuXG5cdFx0Ly8gZXhwb3NlZCBvYmplY3Rcblx0XHRsZXRcblx0XHRcdGFwaVN0YWNrID0gW10sXG5cdFx0XHR2aW1lb0FwaVJlYWR5ID0gZmFsc2UsXG5cdFx0XHR2aW1lbyA9IHt9LFxuXHRcdFx0dmltZW9QbGF5ZXIgPSBudWxsLFxuXHRcdFx0cGF1c2VkID0gdHJ1ZSxcblx0XHRcdHZvbHVtZSA9IDEsXG5cdFx0XHRvbGRWb2x1bWUgPSB2b2x1bWUsXG5cdFx0XHRjdXJyZW50VGltZSA9IDAsXG5cdFx0XHRidWZmZXJlZFRpbWUgPSAwLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdGR1cmF0aW9uID0gMCxcblx0XHRcdHVybCA9IFwiXCIsXG5cdFx0XHRpLFxuXHRcdFx0aWxcblx0XHQ7XG5cblx0XHR2aW1lby5vcHRpb25zID0gb3B0aW9ucztcblx0XHR2aW1lby5pZCA9IG1lZGlhRWxlbWVudC5pZCArICdfJyArIG9wdGlvbnMucHJlZml4O1xuXHRcdHZpbWVvLm1lZGlhRWxlbWVudCA9IG1lZGlhRWxlbWVudDtcblxuXHRcdC8vIHdyYXBwZXJzIGZvciBnZXQvc2V0XG5cdFx0bGV0XG5cdFx0XHRwcm9wcyA9IG1lanMuaHRtbDVtZWRpYS5wcm9wZXJ0aWVzLFxuXHRcdFx0YXNzaWduR2V0dGVyc1NldHRlcnMgPSAocHJvcE5hbWUpID0+IHtcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHR2aW1lb1tgZ2V0JHtjYXBOYW1lfWBdID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh2aW1lb1BsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRUaW1lO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2R1cmF0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZHVyYXRpb247XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAndm9sdW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdm9sdW1lO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHZvbHVtZSA9PT0gMDtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3JjJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5nZXRWaWRlb1VybCgpLnRoZW4oKF91cmwpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHVybCA9IF91cmw7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdXJsO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdidWZmZXJlZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gYnVmZmVyZWRUaW1lICogZHVyYXRpb247XG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0bGVuZ3RoOiAxXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dmltZW9bYHNldCR7Y2FwTmFtZX1gXSA9ICh2YWx1ZSkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHZpbWVvUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZ1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwcm9wTmFtZSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHVybCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlWzBdLnNyYyxcblx0XHRcdFx0XHRcdFx0XHRcdHZpZGVvSWQgPSB2aW1lb0FwaS5nZXRWaW1lb0lkKHVybCk7XG5cblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5sb2FkVmlkZW8odmlkZW9JZCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobWVkaWFFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXV0b3BsYXknKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRDdXJyZW50VGltZSh2YWx1ZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICd2b2x1bWUnOlxuXHRcdFx0XHRcdFx0XHRcdHZpbWVvUGxheWVyLnNldFZvbHVtZSh2YWx1ZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2b2x1bWUgPSB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdG9sZFZvbHVtZSA9IHZvbHVtZTtcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdsb29wJzpcblx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRMb29wKHZhbHVlKVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdtdXRlZCc6XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aW1lb1BsYXllci5zZXRWb2x1bWUoMCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHVtZSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd2b2x1bWVjaGFuZ2UnLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KVsnY2F0Y2gnXSgoZXJyb3IpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmltZW9QbGF5ZXIuc2V0Vm9sdW1lKG9sZFZvbHVtZSkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZvbHVtZSA9IG9sZFZvbHVtZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aW1lb0FwaS5lcnJvckhhbmRsZXIoZXJyb3IsIHZpbWVvKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygndmltZW8gJyArIHZpbWVvLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIFNvdW5kY2xvdWQgQVBJXG5cdFx0XHRcdHZpbWVvW21ldGhvZE5hbWVdID0gKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHZpbWVvUGxheWVyICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRcdC8vIERPIG1ldGhvZFxuXHRcdFx0XHRcdFx0c3dpdGNoIChtZXRob2ROYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BsYXknOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB2aW1lb1BsYXllci5wbGF5KCk7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BhdXNlJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmltZW9QbGF5ZXIucGF1c2UoKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnY2FsbCcsIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBJbml0aWFsIG1ldGhvZCB0byByZWdpc3RlciBhbGwgVmltZW8gZXZlbnRzIHdoZW4gaW5pdGlhbGl6aW5nIDxpZnJhbWU+XG5cdFx0d2luZG93WydfX3JlYWR5X18nICsgdmltZW8uaWRdID0gKF92aW1lb1BsYXllcikgPT4ge1xuXG5cdFx0XHR2aW1lb0FwaVJlYWR5ID0gdHJ1ZTtcblx0XHRcdG1lZGlhRWxlbWVudC52aW1lb1BsYXllciA9IHZpbWVvUGxheWVyID0gX3ZpbWVvUGxheWVyO1xuXG5cdFx0XHQvLyBkbyBjYWxsIHN0YWNrXG5cdFx0XHRpZiAoYXBpU3RhY2subGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIGlsID0gYXBpU3RhY2subGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXG5cdFx0XHRcdFx0bGV0IHN0YWNrSXRlbSA9IGFwaVN0YWNrW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0YWNrSXRlbS50eXBlID09PSAnc2V0Jykge1xuXHRcdFx0XHRcdFx0bGV0IHByb3BOYW1lID0gc3RhY2tJdGVtLnByb3BOYW1lLFxuXHRcdFx0XHRcdFx0XHRjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHRcdFx0dmltZW9bYHNldCR7Y2FwTmFtZX1gXShzdGFja0l0ZW0udmFsdWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhY2tJdGVtLnR5cGUgPT09ICdjYWxsJykge1xuXHRcdFx0XHRcdFx0dmltZW9bc3RhY2tJdGVtLm1ldGhvZE5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxldCB2aW1lb0lmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZpbWVvLmlkKSwgZXZlbnRzO1xuXG5cdFx0XHQvLyBhIGZldyBtb3JlIGV2ZW50c1xuXHRcdFx0ZXZlbnRzID0gWydtb3VzZW92ZXInLCAnbW91c2VvdXQnXTtcblxuXHRcdFx0Y29uc3QgYXNzaWduRXZlbnRzID0gKGUpID0+IHtcblx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCB2aW1lbyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH07XG5cblx0XHRcdGZvciAobGV0IGogaW4gZXZlbnRzKSB7XG5cdFx0XHRcdGxldCBldmVudE5hbWUgPSBldmVudHNbal07XG5cdFx0XHRcdGFkZEV2ZW50KHZpbWVvSWZyYW1lLCBldmVudE5hbWUsIGFzc2lnbkV2ZW50cyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFZpbWVvIGV2ZW50c1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ2xvYWRlZCcsICgpID0+IHtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5nZXREdXJhdGlvbigpLnRoZW4oKGxvYWRQcm9ncmVzcykgPT4ge1xuXG5cdFx0XHRcdFx0ZHVyYXRpb24gPSBsb2FkUHJvZ3Jlc3M7XG5cblx0XHRcdFx0XHRpZiAoZHVyYXRpb24gPiAwKSB7XG5cdFx0XHRcdFx0XHRidWZmZXJlZFRpbWUgPSBkdXJhdGlvbiAqIGxvYWRQcm9ncmVzcztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgnbG9hZGVkbWV0YWRhdGEnLCB2aW1lbyk7XG5cdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRcdH0pWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2aW1lb1BsYXllci5vbigncHJvZ3Jlc3MnLCAoKSA9PiB7XG5cblx0XHRcdFx0cGF1c2VkID0gdmltZW8ubWVkaWFFbGVtZW50LmdldFBhdXNlZCgpO1xuXG5cdFx0XHRcdHZpbWVvUGxheWVyLmdldER1cmF0aW9uKCkudGhlbigobG9hZFByb2dyZXNzKSA9PiB7XG5cblx0XHRcdFx0XHRkdXJhdGlvbiA9IGxvYWRQcm9ncmVzcztcblxuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA+IDApIHtcblx0XHRcdFx0XHRcdGJ1ZmZlcmVkVGltZSA9IGR1cmF0aW9uICogbG9hZFByb2dyZXNzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwcm9ncmVzcycsIHZpbWVvKTtcblx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cblx0XHRcdFx0fSlbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR2aW1lb1BsYXllci5vbigndGltZXVwZGF0ZScsICgpID0+IHtcblxuXHRcdFx0XHRwYXVzZWQgPSB2aW1lby5tZWRpYUVsZW1lbnQuZ2V0UGF1c2VkKCk7XG5cdFx0XHRcdGVuZGVkID0gZmFsc2U7XG5cblx0XHRcdFx0dmltZW9QbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKS50aGVuKChzZWNvbmRzKSA9PiB7XG5cdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBzZWNvbmRzO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndGltZXVwZGF0ZScsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHZpbWVvUGxheWVyLm9uKCdwbGF5JywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5wbGF5KClbJ2NhdGNoJ10oKGVycm9yKSA9PiB7XG5cdFx0XHRcdFx0dmltZW9BcGkuZXJyb3JIYW5kbGVyKGVycm9yLCB2aW1lbyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdwbGF5JywgdmltZW8pO1xuXHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHZpbWVvUGxheWVyLm9uKCdwYXVzZScsICgpID0+IHtcblx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0ZW5kZWQgPSBmYWxzZTtcblxuXHRcdFx0XHR2aW1lb1BsYXllci5wYXVzZSgpWydjYXRjaCddKChlcnJvcikgPT4ge1xuXHRcdFx0XHRcdHZpbWVvQXBpLmVycm9ySGFuZGxlcihlcnJvciwgdmltZW8pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgncGF1c2UnLCB2aW1lbyk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0dmltZW9QbGF5ZXIub24oJ2VuZGVkJywgKCkgPT4ge1xuXHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0ZW5kZWQgPSB0cnVlO1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCdlbmRlZCcsIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdpdmUgaW5pdGlhbCBldmVudHNcblx0XHRcdGV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0Zm9yIChpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudHNbaV0sIHZpbWVvKTtcblx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRsZXRcblx0XHRcdGhlaWdodCA9IG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuaGVpZ2h0LFxuXHRcdFx0d2lkdGggPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLndpZHRoLFxuXHRcdFx0dmltZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKSxcblx0XHRcdHN0YW5kYXJkVXJsID0gJy8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nICsgdmltZW9BcGkuZ2V0VmltZW9JZChtZWRpYUZpbGVzWzBdLnNyYylcblx0XHQ7XG5cblx0XHQvLyBDcmVhdGUgVmltZW8gPGlmcmFtZT4gbWFya3VwXG5cdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsIHZpbWVvLmlkKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuXHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2ZyYW1lQm9yZGVyJywgJzAnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3NyYycsIHN0YW5kYXJkVXJsKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3dlYmtpdGFsbG93ZnVsbHNjcmVlbicsICcnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ21vemFsbG93ZnVsbHNjcmVlbicsICcnKTtcblx0XHR2aW1lb0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FsbG93ZnVsbHNjcmVlbicsICcnKTtcblxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodmltZW9Db250YWluZXIsIG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUpO1xuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdHZpbWVvQXBpLmVucXVldWVJZnJhbWUoe1xuXHRcdFx0aWZyYW1lOiB2aW1lb0NvbnRhaW5lcixcblx0XHRcdGlkOiB2aW1lby5pZFxuXHRcdH0pO1xuXG5cdFx0dmltZW8uaGlkZSA9ICgpID0+IHtcblx0XHRcdHZpbWVvLnBhdXNlKCk7XG5cdFx0XHRpZiAodmltZW9QbGF5ZXIpIHtcblx0XHRcdFx0dmltZW9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9O1xuXHRcdHZpbWVvLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCkgPT4ge1xuXHRcdFx0dmltZW9Db250YWluZXIuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcblx0XHRcdHZpbWVvQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHR9O1xuXHRcdHZpbWVvLnNob3cgPSAoKSA9PiB7XG5cdFx0XHRpZiAodmltZW9QbGF5ZXIpIHtcblx0XHRcdFx0dmltZW9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICcnO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gdmltZW87XG5cdH1cblxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBWaW1lbyB0eXBlIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKi9cbnR5cGVDaGVja3MucHVzaCgodXJsKSA9PiB7XG5cdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRyZXR1cm4gdXJsLmluY2x1ZGVzKCcvL3BsYXllci52aW1lbycpIHx8IHVybC5pbmNsdWRlcygndmltZW8uY29tJykgPyAndmlkZW8veC12aW1lbycgOiBudWxsO1xufSk7XG5cbnJlbmRlcmVyLmFkZCh2aW1lb0lmcmFtZVJlbmRlcmVyKTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge3JlbmRlcmVyfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyJztcbmltcG9ydCB7Y3JlYXRlRXZlbnQsIGFkZEV2ZW50fSBmcm9tICcuLi91dGlscy9kb20nO1xuaW1wb3J0IHt0eXBlQ2hlY2tzfSBmcm9tICcuLi91dGlscy9tZWRpYSc7XG5cbi8qKlxuICogWW91VHViZSByZW5kZXJlclxuICpcbiAqIFVzZXMgPGlmcmFtZT4gYXBwcm9hY2ggYW5kIHVzZXMgWW91VHViZSBBUEkgdG8gbWFuaXB1bGF0ZSBpdC5cbiAqIE5vdGU6IElFNi03IGRvbid0IGhhdmUgcG9zdE1lc3NhZ2Ugc28gZG9uJ3Qgc3VwcG9ydCA8aWZyYW1lPiBBUEksIGFuZCBJRTggZG9lc24ndCBmaXJlIHRoZSBvblJlYWR5IGV2ZW50LFxuICogc28gaXQgZG9lc24ndCB3b3JrIC0gbm90IHN1cmUgaWYgR29vZ2xlIHByb2JsZW0gb3Igbm90LlxuICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS95b3V0dWJlL2lmcmFtZV9hcGlfcmVmZXJlbmNlXG4gKi9cbmNvbnN0IFlvdVR1YmVBcGkgPSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lU3RhcnRlZDogZmFsc2UsXG5cdC8qKlxuXHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0ICovXG5cdGlzSWZyYW1lTG9hZGVkOiBmYWxzZSxcblx0LyoqXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdGlmcmFtZVF1ZXVlOiBbXSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVldWUgdG8gcHJlcGFyZSB0aGUgY3JlYXRpb24gb2YgPGlmcmFtZT5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gYW4gb2JqZWN0IHdpdGggc2V0dGluZ3MgbmVlZGVkIHRvIGNyZWF0ZSA8aWZyYW1lPlxuXHQgKi9cblx0ZW5xdWV1ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cblx0XHRpZiAoWW91VHViZUFwaS5pc0xvYWRlZCkge1xuXHRcdFx0WW91VHViZUFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRZb3VUdWJlQXBpLmxvYWRJZnJhbWVBcGkoKTtcblx0XHRcdFlvdVR1YmVBcGkuaWZyYW1lUXVldWUucHVzaChzZXR0aW5ncyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBMb2FkIFlvdVR1YmUgQVBJIHNjcmlwdCBvbiB0aGUgaGVhZGVyIG9mIHRoZSBkb2N1bWVudFxuXHQgKlxuXHQgKi9cblx0bG9hZElmcmFtZUFwaTogKCkgPT4ge1xuXHRcdGlmICghWW91VHViZUFwaS5pc0lmcmFtZVN0YXJ0ZWQpIHtcblx0XHRcdGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdHRhZy5zcmMgPSAnLy93d3cueW91dHViZS5jb20vcGxheWVyX2FwaSc7XG5cdFx0XHRsZXQgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG5cdFx0XHRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcblx0XHRcdFlvdVR1YmVBcGkuaXNJZnJhbWVTdGFydGVkID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcXVldWUgb2YgWW91VHViZSA8aWZyYW1lPiBlbGVtZW50IGNyZWF0aW9uXG5cdCAqXG5cdCAqL1xuXHRpRnJhbWVSZWFkeTogKCkgPT4ge1xuXG5cdFx0WW91VHViZUFwaS5pc0xvYWRlZCA9IHRydWU7XG5cdFx0WW91VHViZUFwaS5pc0lmcmFtZUxvYWRlZCA9IHRydWU7XG5cblx0XHR3aGlsZSAoWW91VHViZUFwaS5pZnJhbWVRdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgc2V0dGluZ3MgPSBZb3VUdWJlQXBpLmlmcmFtZVF1ZXVlLnBvcCgpO1xuXHRcdFx0WW91VHViZUFwaS5jcmVhdGVJZnJhbWUoc2V0dGluZ3MpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFlvdVR1YmUgQVBJIHBsYXllciBhbmQgdHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBpbml0aWFsaXplIGl0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5ncyAtIGFuIG9iamVjdCB3aXRoIHNldHRpbmdzIG5lZWRlZCB0byBjcmVhdGUgPGlmcmFtZT5cblx0ICovXG5cdGNyZWF0ZUlmcmFtZTogKHNldHRpbmdzKSA9PiB7XG5cdFx0cmV0dXJuIG5ldyBZVC5QbGF5ZXIoc2V0dGluZ3MuY29udGFpbmVySWQsIHNldHRpbmdzKTtcblx0fSxcblxuXHQvKipcblx0ICogRXh0cmFjdCBJRCBmcm9tIFlvdVR1YmUncyBVUkwgdG8gYmUgbG9hZGVkIHRocm91Z2ggQVBJXG5cdCAqIFZhbGlkIFVSTCBmb3JtYXQocyk6XG5cdCAqIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD9mZWF0dXJlPXBsYXllcl9lbWJlZGRlZCZ2PXl5V1dYU3d0UFAwXG5cdCAqIC0gaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHQgKiAtIGh0dHA6Ly95b3V0dS5iZS9EamQ2dFByeGMwOFxuXHQgKiAtIGh0dHA6Ly93d3cueW91dHViZS1ub2Nvb2tpZS5jb20vd2F0Y2g/ZmVhdHVyZT1wbGF5ZXJfZW1iZWRkZWQmdj15eVdXWFN3dFBQMFxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZDogKHVybCkgPT4ge1xuXG5cdFx0bGV0IHlvdVR1YmVJZCA9IFwiXCI7XG5cblx0XHRpZiAodXJsLmluZGV4T2YoJz8nKSA+IDApIHtcblx0XHRcdC8vIGFzc3VtaW5nOiBodHRwOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP2ZlYXR1cmU9cGxheWVyX2VtYmVkZGVkJnY9eXlXV1hTd3RQUDBcblx0XHRcdHlvdVR1YmVJZCA9IFlvdVR1YmVBcGkuZ2V0WW91VHViZUlkRnJvbVBhcmFtKHVybCk7XG5cblx0XHRcdC8vIGlmIGl0J3MgaHR0cDovL3d3dy55b3V0dWJlLmNvbS92L1ZJREVPX0lEP3ZlcnNpb249M1xuXHRcdFx0aWYgKHlvdVR1YmVJZCA9PT0gJycpIHtcblx0XHRcdFx0eW91VHViZUlkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWRGcm9tVXJsKHVybCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHlvdVR1YmVJZCA9IFlvdVR1YmVBcGkuZ2V0WW91VHViZUlkRnJvbVVybCh1cmwpO1xuXHRcdH1cblxuXHRcdHJldHVybiB5b3VUdWJlSWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBJRCBmcm9tIFVSTCB3aXRoIGZvcm1hdDogaHR0cDovL3d3dy55b3V0dWJlLmNvbS93YXRjaD9mZWF0dXJlPXBsYXllcl9lbWJlZGRlZCZ2PXl5V1dYU3d0UFAwXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZEZyb21QYXJhbTogKHVybCkgPT4ge1xuXG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCAhdXJsLnRyaW0oKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldFxuXHRcdFx0eW91VHViZUlkID0gJycsXG5cdFx0XHRwYXJ0cyA9IHVybC5zcGxpdCgnPycpLFxuXHRcdFx0cGFyYW1ldGVycyA9IHBhcnRzWzFdLnNwbGl0KCcmJylcblx0XHQ7XG5cblx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBwYXJhbWV0ZXJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdGxldCBwYXJhbVBhcnRzID0gcGFyYW1ldGVyc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0aWYgKHBhcmFtUGFydHNbMF0gPT09ICd2Jykge1xuXHRcdFx0XHR5b3VUdWJlSWQgPSBwYXJhbVBhcnRzWzFdO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4geW91VHViZUlkO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBHZXQgSUQgZnJvbSBVUkwgd2l0aCBmb3JtYXRzXG5cdCAqICAtIGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9WSURFT19JRD92ZXJzaW9uPTNcblx0ICogIC0gaHR0cDovL3lvdXR1LmJlL0RqZDZ0UHJ4YzA4XG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcblx0ICogQHJldHVybiB7P1N0cmluZ31cblx0ICovXG5cdGdldFlvdVR1YmVJZEZyb21Vcmw6ICh1cmwpID0+IHtcblxuXHRcdGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwgfHwgIXVybC50cmltKCkubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgcGFydHMgPSB1cmwuc3BsaXQoJz8nKTtcblx0XHR1cmwgPSBwYXJ0c1swXTtcblx0XHRyZXR1cm4gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbmplY3QgYG5vLWNvb2tpZWAgZWxlbWVudCB0byBVUkwuIE9ubHkgd29ya3Mgd2l0aCBmb3JtYXQ6IGh0dHA6Ly93d3cueW91dHViZS5jb20vdi9WSURFT19JRD92ZXJzaW9uPTNcblx0ICogQHBhcmFtIHtTdHJpbmd9IHVybFxuXHQgKiBAcmV0dXJuIHs/U3RyaW5nfVxuXHQgKi9cblx0Z2V0WW91VHViZU5vQ29va2llVXJsOiAodXJsKSA9PiB7XG5cdFx0aWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCAhdXJsLnRyaW0oKS5sZW5ndGggfHwgIXVybC5pbmNsdWRlcygnLy93d3cueW91dHViZScpKSB7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdGxldCBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuXHRcdHBhcnRzWzJdID0gcGFydHNbMl0ucmVwbGFjZSgnLmNvbScsICctbm9jb29raWUuY29tJyk7XG5cdFx0cmV0dXJuIHBhcnRzLmpvaW4oJy8nKTtcblx0fVxufTtcblxuY29uc3QgWW91VHViZUlmcmFtZVJlbmRlcmVyID0ge1xuXHRuYW1lOiAneW91dHViZV9pZnJhbWUnLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRwcmVmaXg6ICd5b3V0dWJlX2lmcmFtZScsXG5cdFx0LyoqXG5cdFx0ICogQ3VzdG9tIGNvbmZpZ3VyYXRpb24gZm9yIFlvdVR1YmUgcGxheWVyXG5cdFx0ICpcblx0XHQgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3lvdXR1YmUvcGxheWVyX3BhcmFtZXRlcnMjUGFyYW1ldGVyc1xuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0eW91dHViZToge1xuXHRcdFx0YXV0b3BsYXk6IDAsXG5cdFx0XHRjb250cm9sczogMCxcblx0XHRcdGRpc2FibGVrYjogMSxcblx0XHRcdGVuZDogMCxcblx0XHRcdGxvb3A6IDAsXG5cdFx0XHRtb2Rlc3RicmFuZGluZzogMCxcblx0XHRcdHBsYXlzaW5saW5lOiAwLFxuXHRcdFx0cmVsOiAwLFxuXHRcdFx0c2hvd2luZm86IDAsXG5cdFx0XHRzdGFydDogMCxcblx0XHRcdC8vIGN1c3RvbSB0byBpbmplY3QgYC1ub2Nvb2tpZWAgZWxlbWVudCBpbiBVUkxcblx0XHRcdG5vY29va2llOiBmYWxzZVxuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGlmIGEgc3BlY2lmaWMgZWxlbWVudCB0eXBlIGNhbiBiZSBwbGF5ZWQgd2l0aCB0aGlzIHJlbmRlclxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0Y2FuUGxheVR5cGU6ICh0eXBlKSA9PiBbJ3ZpZGVvL3lvdXR1YmUnLCAndmlkZW8veC15b3V0dWJlJ10uaW5jbHVkZXModHlwZSksXG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgcGxheWVyIGluc3RhbmNlIGFuZCBhZGQgYWxsIG5hdGl2ZSBldmVudHMvbWV0aG9kcy9wcm9wZXJ0aWVzIGFzIHBvc3NpYmxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7TWVkaWFFbGVtZW50fSBtZWRpYUVsZW1lbnQgSW5zdGFuY2Ugb2YgbWVqcy5NZWRpYUVsZW1lbnQgYWxyZWFkeSBjcmVhdGVkXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFsbCB0aGUgcGxheWVyIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBwYXNzZWQgdGhyb3VnaCBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdFtdfSBtZWRpYUZpbGVzIExpc3Qgb2Ygc291cmNlcyB3aXRoIGZvcm1hdDoge3NyYzogdXJsLCB0eXBlOiB4L3kten1cblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0Y3JlYXRlOiAobWVkaWFFbGVtZW50LCBvcHRpb25zLCBtZWRpYUZpbGVzKSA9PiB7XG5cblx0XHQvLyBleHBvc2VkIG9iamVjdFxuXHRcdGxldCB5b3V0dWJlID0ge307XG5cdFx0eW91dHViZS5vcHRpb25zID0gb3B0aW9ucztcblx0XHR5b3V0dWJlLmlkID0gbWVkaWFFbGVtZW50LmlkICsgJ18nICsgb3B0aW9ucy5wcmVmaXg7XG5cdFx0eW91dHViZS5tZWRpYUVsZW1lbnQgPSBtZWRpYUVsZW1lbnQ7XG5cblx0XHQvLyBBUEkgb2JqZWN0c1xuXHRcdGxldFxuXHRcdFx0YXBpU3RhY2sgPSBbXSxcblx0XHRcdHlvdVR1YmVBcGkgPSBudWxsLFxuXHRcdFx0eW91VHViZUFwaVJlYWR5ID0gZmFsc2UsXG5cdFx0XHRwYXVzZWQgPSB0cnVlLFxuXHRcdFx0ZW5kZWQgPSBmYWxzZSxcblx0XHRcdHlvdVR1YmVJZnJhbWUgPSBudWxsLFxuXHRcdFx0aSxcblx0XHRcdGlsXG5cdFx0O1xuXG5cdFx0Ly8gd3JhcHBlcnMgZm9yIGdldC9zZXRcblx0XHRsZXRcblx0XHRcdHByb3BzID0gbWVqcy5odG1sNW1lZGlhLnByb3BlcnRpZXMsXG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyA9IChwcm9wTmFtZSkgPT4ge1xuXG5cdFx0XHRcdC8vIGFkZCB0byBmbGFzaCBzdGF0ZSB0aGF0IHdlIHdpbGwgc3RvcmVcblxuXHRcdFx0XHRjb25zdCBjYXBOYW1lID0gYCR7cHJvcE5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtwcm9wTmFtZS5zdWJzdHJpbmcoMSl9YDtcblxuXHRcdFx0XHR5b3V0dWJlW2BnZXQke2NhcE5hbWV9YF0gPSAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHlvdVR1YmVBcGkgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdGxldCB2YWx1ZSA9IG51bGw7XG5cblx0XHRcdFx0XHRcdC8vIGZpZ3VyZSBvdXQgaG93IHRvIGdldCB5b3V0dWJlIGR0YSBoZXJlXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2N1cnJlbnRUaW1lJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXRDdXJyZW50VGltZSgpO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2R1cmF0aW9uJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5nZXREdXJhdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkuZ2V0Vm9sdW1lKCk7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2VkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF1c2VkO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2VuZGVkJzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZW5kZWQ7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSAnbXV0ZWQnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLmlzTXV0ZWQoKTsgLy8gP1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2J1ZmZlcmVkJzpcblx0XHRcdFx0XHRcdFx0XHRsZXQgcGVyY2VudExvYWRlZCA9IHlvdVR1YmVBcGkuZ2V0VmlkZW9Mb2FkZWRGcmFjdGlvbigpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZHVyYXRpb24gPSB5b3VUdWJlQXBpLmdldER1cmF0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGVuZDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGVyY2VudExvYWRlZCAqIGR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdGxlbmd0aDogMVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3NyYyc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHlvdVR1YmVBcGkuZ2V0VmlkZW9VcmwoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0eW91dHViZVtgc2V0JHtjYXBOYW1lfWBdID0gKHZhbHVlKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcE5hbWUpIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdzcmMnOlxuXHRcdFx0XHRcdFx0XHRcdGxldCB1cmwgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiB2YWx1ZVswXS5zcmMsXG5cdFx0XHRcdFx0XHRcdFx0XHR2aWRlb0lkID0gWW91VHViZUFwaS5nZXRZb3VUdWJlSWQodXJsKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChtZWRpYUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhdXRvcGxheScpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR5b3VUdWJlQXBpLmxvYWRWaWRlb0J5SWQodmlkZW9JZCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkuY3VlVmlkZW9CeUlkKHZpZGVvSWQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlICdjdXJyZW50VGltZSc6XG5cdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5zZWVrVG8odmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ211dGVkJzpcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkubXV0ZSgpOyAvLyA/XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHlvdVR1YmVBcGkudW5NdXRlKCk7IC8vID9cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudCgndm9sdW1lY2hhbmdlJywgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ZvbHVtZSc6XG5cdFx0XHRcdFx0XHRcdFx0eW91VHViZUFwaS5zZXRWb2x1bWUodmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoJ3ZvbHVtZWNoYW5nZScsIHlvdXR1YmUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCd5b3V0dWJlICcgKyB5b3V0dWJlLmlkLCBwcm9wTmFtZSwgJ1VOU1VQUE9SVEVEIHByb3BlcnR5Jyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgZm9yIGFmdGVyIFwiUkVBRFlcIiBldmVudCBmaXJlc1xuXHRcdFx0XHRcdFx0YXBpU3RhY2sucHVzaCh7dHlwZTogJ3NldCcsIHByb3BOYW1lOiBwcm9wTmFtZSwgdmFsdWU6IHZhbHVlfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0Zm9yIChpID0gMCwgaWwgPSBwcm9wcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG5cdFx0XHRhc3NpZ25HZXR0ZXJzU2V0dGVycyhwcm9wc1tpXSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWRkIHdyYXBwZXJzIGZvciBuYXRpdmUgbWV0aG9kc1xuXHRcdGxldFxuXHRcdFx0bWV0aG9kcyA9IG1lanMuaHRtbDVtZWRpYS5tZXRob2RzLFxuXHRcdFx0YXNzaWduTWV0aG9kcyA9IChtZXRob2ROYW1lKSA9PiB7XG5cblx0XHRcdFx0Ly8gcnVuIHRoZSBtZXRob2Qgb24gdGhlIG5hdGl2ZSBIVE1MTWVkaWFFbGVtZW50XG5cdFx0XHRcdHlvdXR1YmVbbWV0aG9kTmFtZV0gPSAoKSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0XHQvLyBETyBtZXRob2Rcblx0XHRcdFx0XHRcdHN3aXRjaCAobWV0aG9kTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwbGF5Jzpcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4geW91VHViZUFwaS5wbGF5VmlkZW8oKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGF1c2UnOlxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB5b3VUdWJlQXBpLnBhdXNlVmlkZW8oKTtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbG9hZCc6XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhcGlTdGFjay5wdXNoKHt0eXBlOiAnY2FsbCcsIG1ldGhvZE5hbWU6IG1ldGhvZE5hbWV9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdH1cblx0XHQ7XG5cblx0XHRmb3IgKGkgPSAwLCBpbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0YXNzaWduTWV0aG9kcyhtZXRob2RzW2ldKTtcblx0XHR9XG5cblx0XHQvLyBDUkVBVEUgWW91VHViZVxuXHRcdGxldCB5b3V0dWJlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0eW91dHViZUNvbnRhaW5lci5pZCA9IHlvdXR1YmUuaWQ7XG5cblx0XHQvLyBJZiBgbm9jb29raWVgIGZlYXR1cmUgd2FzIGVuYWJsZWQsIG1vZGlmeSBvcmlnaW5hbCBVUkxcblx0XHRpZiAoeW91dHViZS5vcHRpb25zLnlvdXR1YmUubm9jb29raWUpIHtcblx0XHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBZb3VUdWJlQXBpLmdldFlvdVR1YmVOb0Nvb2tpZVVybChtZWRpYUZpbGVzWzBdLnNyYykpO1xuXHRcdH1cblxuXHRcdG1lZGlhRWxlbWVudC5vcmlnaW5hbE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoeW91dHViZUNvbnRhaW5lciwgbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZSk7XG5cdFx0bWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0bGV0XG5cdFx0XHRoZWlnaHQgPSBtZWRpYUVsZW1lbnQub3JpZ2luYWxOb2RlLmhlaWdodCxcblx0XHRcdHdpZHRoID0gbWVkaWFFbGVtZW50Lm9yaWdpbmFsTm9kZS53aWR0aCxcblx0XHRcdHZpZGVvSWQgPSBZb3VUdWJlQXBpLmdldFlvdVR1YmVJZChtZWRpYUZpbGVzWzBdLnNyYyksXG5cdFx0XHR5b3V0dWJlU2V0dGluZ3MgPSB7XG5cdFx0XHRcdGlkOiB5b3V0dWJlLmlkLFxuXHRcdFx0XHRjb250YWluZXJJZDogeW91dHViZUNvbnRhaW5lci5pZCxcblx0XHRcdFx0dmlkZW9JZDogdmlkZW9JZCxcblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHQsXG5cdFx0XHRcdHdpZHRoOiB3aWR0aCxcblx0XHRcdFx0cGxheWVyVmFyczogT2JqZWN0LmFzc2lnbih7XG5cdFx0XHRcdFx0Y29udHJvbHM6IDAsXG5cdFx0XHRcdFx0cmVsOiAwLFxuXHRcdFx0XHRcdGRpc2FibGVrYjogMSxcblx0XHRcdFx0XHRzaG93aW5mbzogMCxcblx0XHRcdFx0XHRtb2Rlc3RicmFuZGluZzogMCxcblx0XHRcdFx0XHRodG1sNTogMSxcblx0XHRcdFx0XHRwbGF5c2lubGluZTogMCxcblx0XHRcdFx0XHRzdGFydDogMCxcblx0XHRcdFx0XHRlbmQ6IDBcblx0XHRcdFx0fSwgeW91dHViZS5vcHRpb25zLnlvdXR1YmUpLFxuXHRcdFx0XHRvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxuXHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRvblJlYWR5OiAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHR5b3VUdWJlQXBpUmVhZHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0bWVkaWFFbGVtZW50LnlvdVR1YmVBcGkgPSB5b3VUdWJlQXBpID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQueW91VHViZVN0YXRlID0ge1xuXHRcdFx0XHRcdFx0XHRwYXVzZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGVuZGVkOiBmYWxzZVxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0Ly8gZG8gY2FsbCBzdGFja1xuXHRcdFx0XHRcdFx0aWYgKGFwaVN0YWNrLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAwLCBpbCA9IGFwaVN0YWNrLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblxuXHRcdFx0XHRcdFx0XHRcdGxldCBzdGFja0l0ZW0gPSBhcGlTdGFja1tpXTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ3NldCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9wTmFtZSA9IHN0YWNrSXRlbS5wcm9wTmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FwTmFtZSA9IGAke3Byb3BOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpfSR7cHJvcE5hbWUuc3Vic3RyaW5nKDEpfWBcblx0XHRcdFx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eW91dHViZVtgc2V0JHtjYXBOYW1lfWBdKHN0YWNrSXRlbS52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzdGFja0l0ZW0udHlwZSA9PT0gJ2NhbGwnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR5b3V0dWJlW3N0YWNrSXRlbS5tZXRob2ROYW1lXSgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBhIGZldyBtb3JlIGV2ZW50c1xuXHRcdFx0XHRcdFx0eW91VHViZUlmcmFtZSA9IHlvdVR1YmVBcGkuZ2V0SWZyYW1lKCk7XG5cblx0XHRcdFx0XHRcdGxldFxuXHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ21vdXNlb3ZlcicsICdtb3VzZW91dCddLFxuXHRcdFx0XHRcdFx0XHRhc3NpZ25FdmVudHMgPSAoZSkgPT4ge1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IG5ld0V2ZW50ID0gY3JlYXRlRXZlbnQoZS50eXBlLCB5b3V0dWJlKTtcblx0XHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaiBpbiBldmVudHMpIHtcblx0XHRcdFx0XHRcdFx0YWRkRXZlbnQoeW91VHViZUlmcmFtZSwgZXZlbnRzW2pdLCBhc3NpZ25FdmVudHMpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBzZW5kIGluaXQgZXZlbnRzXG5cdFx0XHRcdFx0XHRsZXQgaW5pdEV2ZW50cyA9IFsncmVuZGVyZXJyZWFkeScsICdsb2FkZWRkYXRhJywgJ2xvYWRlZG1ldGFkYXRhJywgJ2NhbnBsYXknXTtcblxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMCwgaWwgPSBpbml0RXZlbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0bGV0IGV2ZW50ID0gY3JlYXRlRXZlbnQoaW5pdEV2ZW50c1tpXSwgeW91dHViZSk7XG5cdFx0XHRcdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uU3RhdGVDaGFuZ2U6IChlKSA9PiB7XG5cblx0XHRcdFx0XHRcdC8vIHRyYW5zbGF0ZSBldmVudHNcblx0XHRcdFx0XHRcdGxldCBldmVudHMgPSBbXTtcblxuXHRcdFx0XHRcdFx0c3dpdGNoIChlLmRhdGEpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAtMTogLy8gbm90IHN0YXJ0ZWRcblx0XHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ2xvYWRlZG1ldGFkYXRhJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgMDogLy8gWVQuUGxheWVyU3RhdGUuRU5ERURcblx0XHRcdFx0XHRcdFx0XHRldmVudHMgPSBbJ2VuZGVkJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0ZW5kZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XHQvLyBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnRzID0gWydwbGF5JywgJ3BsYXlpbmcnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdGFydEludGVydmFsKCk7XG5cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDI6IC8vIFlULlBsYXllclN0YXRlLlBBVVNFRFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsncGF1c2VkJ107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0eW91dHViZS5zdG9wSW50ZXJ2YWwoKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIDM6IC8vIFlULlBsYXllclN0YXRlLkJVRkZFUklOR1xuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsncHJvZ3Jlc3MnXTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgNTogLy8gWVQuUGxheWVyU3RhdGUuQ1VFRFxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50cyA9IFsnbG9hZGVkZGF0YScsICdsb2FkZWRtZXRhZGF0YScsICdjYW5wbGF5J107XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRlbmRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHNlbmQgZXZlbnRzIHVwXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMCwgaWwgPSBldmVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRsZXQgZXZlbnQgPSBjcmVhdGVFdmVudChldmVudHNbaV0sIHlvdXR1YmUpO1xuXHRcdFx0XHRcdFx0XHRtZWRpYUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvLyBzZW5kIGl0IG9mZiBmb3IgYXN5bmMgbG9hZGluZyBhbmQgY3JlYXRpb25cblx0XHRZb3VUdWJlQXBpLmVucXVldWVJZnJhbWUoeW91dHViZVNldHRpbmdzKTtcblxuXHRcdHlvdXR1YmUub25FdmVudCA9IChldmVudE5hbWUsIHBsYXllciwgX3lvdVR1YmVTdGF0ZSkgPT4ge1xuXHRcdFx0aWYgKF95b3VUdWJlU3RhdGUgIT09IG51bGwgJiYgX3lvdVR1YmVTdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC55b3VUdWJlU3RhdGUgPSBfeW91VHViZVN0YXRlO1xuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdHlvdXR1YmUuc2V0U2l6ZSA9ICh3aWR0aCwgaGVpZ2h0KSA9PiB7XG5cdFx0XHRpZiAoeW91VHViZUFwaSAhPT0gbnVsbCkge1xuXHRcdFx0XHR5b3VUdWJlQXBpLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR5b3V0dWJlLmhpZGUgPSAoKSA9PiB7XG5cdFx0XHR5b3V0dWJlLnN0b3BJbnRlcnZhbCgpO1xuXHRcdFx0eW91dHViZS5wYXVzZSgpO1xuXHRcdFx0aWYgKHlvdVR1YmVJZnJhbWUpIHtcblx0XHRcdFx0eW91VHViZUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0eW91dHViZS5zaG93ID0gKCkgPT4ge1xuXHRcdFx0aWYgKHlvdVR1YmVJZnJhbWUpIHtcblx0XHRcdFx0eW91VHViZUlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR5b3V0dWJlLmRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHR5b3VUdWJlQXBpLmRlc3Ryb3koKTtcblx0XHR9O1xuXHRcdHlvdXR1YmUuaW50ZXJ2YWwgPSBudWxsO1xuXG5cdFx0eW91dHViZS5zdGFydEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0Ly8gY3JlYXRlIHRpbWVyXG5cdFx0XHR5b3V0dWJlLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG5cdFx0XHRcdGxldCBldmVudCA9IGNyZWF0ZUV2ZW50KCd0aW1ldXBkYXRlJywgeW91dHViZSk7XG5cdFx0XHRcdG1lZGlhRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuXHRcdFx0fSwgMjUwKTtcblx0XHR9O1xuXHRcdHlvdXR1YmUuc3RvcEludGVydmFsID0gKCkgPT4ge1xuXHRcdFx0aWYgKHlvdXR1YmUuaW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh5b3V0dWJlLmludGVydmFsKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHlvdXR1YmU7XG5cdH1cbn07XG5cbmlmICh3aW5kb3cucG9zdE1lc3NhZ2UgJiYgdHlwZW9mIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG5cblx0d2luZG93Lm9uWW91VHViZVBsYXllckFQSVJlYWR5ID0gKCkgPT4ge1xuXHRcdFlvdVR1YmVBcGkuaUZyYW1lUmVhZHkoKTtcblx0fTtcblxuXHR0eXBlQ2hlY2tzLnB1c2goKHVybCkgPT4ge1xuXHRcdHVybCA9IHVybC50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiAodXJsLmluY2x1ZGVzKCcvL3d3dy55b3V0dWJlJykgfHwgdXJsLmluY2x1ZGVzKCcvL3lvdXR1LmJlJykpID8gJ3ZpZGVvL3gteW91dHViZScgOiBudWxsO1xuXHR9KTtcblxuXHRyZW5kZXJlci5hZGQoWW91VHViZUlmcmFtZVJlbmRlcmVyKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5cbmV4cG9ydCBjb25zdCBOQVYgPSB3aW5kb3cubmF2aWdhdG9yO1xuZXhwb3J0IGNvbnN0IFVBID0gTkFWLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXG5leHBvcnQgY29uc3QgSVNfSVBBRCA9IChVQS5tYXRjaCgvaXBhZC9pKSAhPT0gbnVsbCk7XG5leHBvcnQgY29uc3QgSVNfSVBIT05FID0gKFVBLm1hdGNoKC9pcGhvbmUvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lPUyA9IElTX0lQSE9ORSB8fCBJU19JUEFEO1xuZXhwb3J0IGNvbnN0IElTX0FORFJPSUQgPSAoVUEubWF0Y2goL2FuZHJvaWQvaSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0lFID0gKE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ21pY3Jvc29mdCcpIHx8IE5BVi5hcHBOYW1lLnRvTG93ZXJDYXNlKCkubWF0Y2goL3RyaWRlbnQvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19DSFJPTUUgPSAoVUEubWF0Y2goL2Nocm9tZS9naSkgIT09IG51bGwpO1xuZXhwb3J0IGNvbnN0IElTX0ZJUkVGT1ggPSAoVUEubWF0Y2goL2ZpcmVmb3gvZ2kpICE9PSBudWxsKTtcbmV4cG9ydCBjb25zdCBJU19TQUZBUkkgPSAoVUEubWF0Y2goL3NhZmFyaS9naSkgIT09IG51bGwpICYmICFJU19DSFJPTUU7XG5leHBvcnQgY29uc3QgSVNfU1RPQ0tfQU5EUk9JRCA9IChVQS5tYXRjaCgvXm1vemlsbGFcXC9cXGQrXFwuXFxkK1xcc1xcKGxpbnV4O1xcc3U7L2dpKSAhPT0gbnVsbCk7XG5cbmV4cG9ydCBjb25zdCBIQVNfVE9VQ0ggPSAhISgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKTtcbmV4cG9ydCBjb25zdCBIQVNfTVNFID0gKCdNZWRpYVNvdXJjZScgaW4gd2luZG93KTtcbmV4cG9ydCBjb25zdCBTVVBQT1JUX1BPSU5URVJfRVZFTlRTID0gKCgpID0+IHtcblx0bGV0XG5cdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKSxcblx0XHRkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0Z2V0Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLFxuXHRcdHN1cHBvcnRzXG5cdDtcblxuXHRpZiAoISgncG9pbnRlckV2ZW50cycgaW4gZWxlbWVudC5zdHlsZSkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRlbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG5cdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICd4Jztcblx0ZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXHRzdXBwb3J0cyA9IGdldENvbXB1dGVkU3R5bGUgJiYgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAnJykucG9pbnRlckV2ZW50cyA9PT0gJ2F1dG8nO1xuXHRkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdHJldHVybiAhIXN1cHBvcnRzO1xufSkoKTtcblxuLy8gZm9yIElFXG5sZXQgaHRtbDVFbGVtZW50cyA9IFsnc291cmNlJywgJ3RyYWNrJywgJ2F1ZGlvJywgJ3ZpZGVvJ10sIHZpZGVvO1xuXG5mb3IgKGxldCBpID0gMCwgaWwgPSBodG1sNUVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcblx0dmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGh0bWw1RWxlbWVudHNbaV0pO1xufVxuXG4vLyBUZXN0IGlmIE1lZGlhIFNvdXJjZSBFeHRlbnNpb25zIGFyZSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuZXhwb3J0IGNvbnN0IFNVUFBPUlRTX01FRElBX1RBRyA9ICh2aWRlby5jYW5QbGF5VHlwZSAhPT0gdW5kZWZpbmVkIHx8IEhBU19NU0UpO1xuXG4vLyBUZXN0IGlmIGJyb3dzZXJzIHN1cHBvcnQgSExTIG5hdGl2ZWx5IChyaWdodCBub3cgU2FmYXJpLCBBbmRyb2lkJ3MgQ2hyb21lIGFuZCBTdG9jayBicm93c2VycywgYW5kIE1TIEVkZ2UpXG5leHBvcnQgY29uc3QgU1VQUE9SVFNfTkFUSVZFX0hMUyA9IChJU19TQUZBUkkgfHwgKElTX0FORFJPSUQgJiYgKElTX0NIUk9NRSB8fCBJU19TVE9DS19BTkRST0lEKSkgfHwgKElTX0lFICYmIFVBLm1hdGNoKC9lZGdlL2dpKSAhPT0gbnVsbCkpO1xuXG4vLyBEZXRlY3QgbmF0aXZlIEphdmFTY3JpcHQgZnVsbHNjcmVlbiAoU2FmYXJpL0ZpcmVmb3ggb25seSwgQ2hyb21lIHN0aWxsIGZhaWxzKVxuXG4vLyBpT1NcbmxldCBoYXNpT1NGdWxsU2NyZWVuID0gKHZpZGVvLndlYmtpdEVudGVyRnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gVzNDXG5sZXQgaGFzTmF0aXZlRnVsbHNjcmVlbiA9ICh2aWRlby5yZXF1ZXN0RnVsbHNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcblxuLy8gT1MgWCAxMC41IGNhbid0IGRvIHRoaXMgZXZlbiBpZiBpdCBzYXlzIGl0IGNhbiA6KFxuaWYgKGhhc2lPU0Z1bGxTY3JlZW4gJiYgVUEubWF0Y2goL21hYyBvcyB4IDEwXzUvaSkpIHtcblx0aGFzTmF0aXZlRnVsbHNjcmVlbiA9IGZhbHNlO1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbi8vIHdlYmtpdC9maXJlZm94L0lFMTErXG5sZXQgaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiAhPT0gdW5kZWZpbmVkKTtcbmxldCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuID0gKHZpZGVvLm1velJlcXVlc3RGdWxsU2NyZWVuICE9PSB1bmRlZmluZWQpO1xubGV0IGhhc01zTmF0aXZlRnVsbFNjcmVlbiA9ICh2aWRlby5tc1JlcXVlc3RGdWxsc2NyZWVuICE9PSB1bmRlZmluZWQpO1xuXG5sZXQgaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbiB8fCBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuIHx8IGhhc01zTmF0aXZlRnVsbFNjcmVlbik7XG5sZXQgbmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbjtcblxubGV0IGZ1bGxTY3JlZW5FdmVudE5hbWUgPSAnJztcbmxldCBpc0Z1bGxTY3JlZW4sIHJlcXVlc3RGdWxsU2NyZWVuLCBjYW5jZWxGdWxsU2NyZWVuO1xuXG4vLyBFbmFibGVkP1xuaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0bmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRW5hYmxlZDtcbn0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdG5hdGl2ZUZ1bGxTY3JlZW5FbmFibGVkID0gZG9jdW1lbnQubXNGdWxsc2NyZWVuRW5hYmxlZDtcbn1cblxuaWYgKElTX0NIUk9NRSkge1xuXHRoYXNpT1NGdWxsU2NyZWVuID0gZmFsc2U7XG59XG5cbmlmIChoYXNUcnVlTmF0aXZlRnVsbFNjcmVlbikge1xuXG5cdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0ZnVsbFNjcmVlbkV2ZW50TmFtZSA9ICdtb3pmdWxsc2NyZWVuY2hhbmdlJztcblx0fSBlbHNlIGlmIChoYXNNc05hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRmdWxsU2NyZWVuRXZlbnROYW1lID0gJ01TRnVsbHNjcmVlbkNoYW5nZSc7XG5cdH1cblxuXHRpc0Z1bGxTY3JlZW4gPSAoKSA9PiAge1xuXHRcdGlmIChoYXNNb3pOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubW96RnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzV2Via2l0TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LndlYmtpdElzRnVsbFNjcmVlbjtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbDtcblx0XHR9XG5cdH07XG5cblx0cmVxdWVzdEZ1bGxTY3JlZW4gPSAoZWwpID0+IHtcblxuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRlbC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuXHRcdH0gZWxzZSBpZiAoaGFzTW96TmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcblx0XHR9IGVsc2UgaWYgKGhhc01zTmF0aXZlRnVsbFNjcmVlbikge1xuXHRcdFx0ZWwubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdH1cblx0fTtcblxuXHRjYW5jZWxGdWxsU2NyZWVuID0gKCkgPT4ge1xuXHRcdGlmIChoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG5cblx0XHR9IGVsc2UgaWYgKGhhc01vek5hdGl2ZUZ1bGxTY3JlZW4pIHtcblx0XHRcdGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcblxuXHRcdH0gZWxzZSBpZiAoaGFzTXNOYXRpdmVGdWxsU2NyZWVuKSB7XG5cdFx0XHRkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG5cblx0XHR9XG5cdH07XG59XG5cbmV4cG9ydCBjb25zdCBIQVNfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNOYXRpdmVGdWxsc2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19XRUJLSVRfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU4gPSBoYXNNb3pOYXRpdmVGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTiA9IGhhc01zTmF0aXZlRnVsbFNjcmVlbjtcbmV4cG9ydCBjb25zdCBIQVNfSU9TX0ZVTExTQ1JFRU4gPSBoYXNpT1NGdWxsU2NyZWVuO1xuZXhwb3J0IGNvbnN0IEhBU19UUlVFX05BVElWRV9GVUxMU0NSRUVOID0gaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW47XG5leHBvcnQgY29uc3QgSEFTX05BVElWRV9GVUxMU0NSRUVOX0VOQUJMRUQgPSBuYXRpdmVGdWxsU2NyZWVuRW5hYmxlZDtcbmV4cG9ydCBjb25zdCBGVUxMU0NSRUVOX0VWRU5UX05BTUUgPSBmdWxsU2NyZWVuRXZlbnROYW1lO1xuXG5leHBvcnQge2lzRnVsbFNjcmVlbiwgcmVxdWVzdEZ1bGxTY3JlZW4sIGNhbmNlbEZ1bGxTY3JlZW59O1xuXG5tZWpzLkZlYXR1cmVzID0gbWVqcy5GZWF0dXJlcyB8fCB7fTtcbm1lanMuRmVhdHVyZXMuaXNpUGFkID0gSVNfSVBBRDtcbm1lanMuRmVhdHVyZXMuaXNpUGhvbmUgPSBJU19JUEhPTkU7XG5tZWpzLkZlYXR1cmVzLmlzaU9TID0gbWVqcy5GZWF0dXJlcy5pc2lQaG9uZSB8fCBtZWpzLkZlYXR1cmVzLmlzaVBhZDtcbm1lanMuRmVhdHVyZXMuaXNBbmRyb2lkID0gSVNfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaXNJRSA9IElTX0lFO1xubWVqcy5GZWF0dXJlcy5pc0Nocm9tZSA9IElTX0NIUk9NRTtcbm1lanMuRmVhdHVyZXMuaXNGaXJlZm94ID0gSVNfRklSRUZPWDtcbm1lanMuRmVhdHVyZXMuaXNTYWZhcmkgPSBJU19TQUZBUkk7XG5tZWpzLkZlYXR1cmVzLmlzU3RvY2tBbmRyb2lkID0gSVNfU1RPQ0tfQU5EUk9JRDtcbm1lanMuRmVhdHVyZXMuaGFzVG91Y2ggPSBIQVNfVE9VQ0g7XG5tZWpzLkZlYXR1cmVzLmhhc01TRSA9IEhBU19NU0U7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTWVkaWFUYWcgPSBTVVBQT1JUU19NRURJQV9UQUc7XG5tZWpzLkZlYXR1cmVzLnN1cHBvcnRzTmF0aXZlSExTID0gU1VQUE9SVFNfTkFUSVZFX0hMUztcblxubWVqcy5GZWF0dXJlcy5zdXBwb3J0c1BvaW50ZXJFdmVudHMgPSBTVVBQT1JUX1BPSU5URVJfRVZFTlRTO1xubWVqcy5GZWF0dXJlcy5oYXNpT1NGdWxsU2NyZWVuID0gSEFTX0lPU19GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNOYXRpdmVGdWxsc2NyZWVuID0gSEFTX05BVElWRV9GVUxMU0NSRUVOO1xubWVqcy5GZWF0dXJlcy5oYXNXZWJraXROYXRpdmVGdWxsU2NyZWVuID0gSEFTX1dFQktJVF9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzTW96TmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NT1pfTkFUSVZFX0ZVTExTQ1JFRU47XG5tZWpzLkZlYXR1cmVzLmhhc01zTmF0aXZlRnVsbFNjcmVlbiA9IEhBU19NU19OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMuaGFzVHJ1ZU5hdGl2ZUZ1bGxTY3JlZW4gPSBIQVNfVFJVRV9OQVRJVkVfRlVMTFNDUkVFTjtcbm1lanMuRmVhdHVyZXMubmF0aXZlRnVsbFNjcmVlbkVuYWJsZWQgPSBIQVNfTkFUSVZFX0ZVTExTQ1JFRU5fRU5BQkxFRDtcbm1lanMuRmVhdHVyZXMuZnVsbFNjcmVlbkV2ZW50TmFtZSA9IEZVTExTQ1JFRU5fRVZFTlRfTkFNRTtcbm1lanMuRmVhdHVyZXMuaXNGdWxsU2NyZWVuID0gaXNGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5yZXF1ZXN0RnVsbFNjcmVlbiA9IHJlcXVlc3RGdWxsU2NyZWVuO1xubWVqcy5GZWF0dXJlcy5jYW5jZWxGdWxsU2NyZWVuID0gY2FuY2VsRnVsbFNjcmVlbjsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IG1lanMgZnJvbSAnLi4vY29yZS9tZWpzJztcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEByZXR1cm4ge0V2ZW50fE9iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50IChldmVudE5hbWUsIHRhcmdldCkge1xuXG5cdGlmICh0eXBlb2YgZXZlbnROYW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignRXZlbnQgbmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRsZXQgZXZlbnQ7XG5cblx0aWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG5cdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCBmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnQgPSB7fTtcblx0XHRldmVudC50eXBlID0gZXZlbnROYW1lO1xuXHRcdGV2ZW50LnRhcmdldCA9IHRhcmdldDtcblx0XHRldmVudC5jYW5jZWxlYWJsZSA9IHRydWU7XG5cdFx0ZXZlbnQuYnViYmFibGUgPSBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBldmVudDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXHRpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgZmFsc2UpO1xuXHR9IGVsc2UgaWYgKG9iai5hdHRhY2hFdmVudCkge1xuXHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdID0gZm47XG5cdFx0b2JqW2Ake3R5cGV9JHtmbn1gXSA9ICgpID0+IHtcblx0XHRcdG9ialtgZSR7dHlwZX0ke2ZufWBdKHdpbmRvdy5ldmVudCk7XG5cdFx0fTtcblx0XHRvYmouYXR0YWNoRXZlbnQoYG9uJHt0eXBlfWAsIG9ialtgJHt0eXBlfSR7Zm59YF0pO1xuXHR9XG5cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFdmVudCAob2JqLCB0eXBlLCBmbikge1xuXG5cdGlmIChvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuXHRcdG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XG5cdH0gZWxzZSBpZiAob2JqLmRldGFjaEV2ZW50KSB7XG5cdFx0b2JqLmRldGFjaEV2ZW50KGBvbiR7dHlwZX1gLCBvYmpbYCR7dHlwZX0ke2ZufWBdKTtcblx0XHRvYmpbYCR7dHlwZX0ke2ZufWBdID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0YXJnZXROb2RlIGFwcGVhcnMgYWZ0ZXIgc291cmNlTm9kZSBpbiB0aGUgZG9tLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc291cmNlTm9kZSAtIHRoZSBzb3VyY2Ugbm9kZSBmb3IgY29tcGFyaXNvblxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0Tm9kZSAtIHRoZSBub2RlIHRvIGNvbXBhcmUgYWdhaW5zdCBzb3VyY2VOb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVBZnRlciAoc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSkge1xuXHRyZXR1cm4gISEoXG5cdFx0c291cmNlTm9kZSAmJlxuXHRcdHRhcmdldE5vZGUgJiZcblx0XHRzb3VyY2VOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRhcmdldE5vZGUpICYmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HXG5cdCk7XG59XG5cbm1lanMuVXRpbHMgPSBtZWpzLlV0aWxzIHx8IHt9O1xubWVqcy5VdGlscy5jcmVhdGVFdmVudCA9IGNyZWF0ZUV2ZW50O1xubWVqcy5VdGlscy5yZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50O1xubWVqcy5VdGlscy5pc05vZGVBZnRlciA9IGlzTm9kZUFmdGVyOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgbWVqcyBmcm9tICcuLi9jb3JlL21lanMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUhUTUwgKGlucHV0KSB7XG5cblx0aWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHBhc3NlZCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRjb25zdCBtYXAgPSB7XG5cdFx0JyYnOiAnJmFtcDsnLFxuXHRcdCc8JzogJyZsdDsnLFxuXHRcdCc+JzogJyZndDsnLFxuXHRcdCdcIic6ICcmcXVvdDsnXG5cdH07XG5cblx0cmV0dXJuIGlucHV0LnJlcGxhY2UoL1smPD5cIl0vZywgKGMpID0+IHtcblx0XHRyZXR1cm4gbWFwW2NdO1xuXHR9KTtcbn1cblxuLy8gdGFrZW4gZnJvbSB1bmRlcnNjb3JlXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UgKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG5cblx0aWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygd2FpdCAhPT0gJ251bWJlcicpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgbnVtZXJpYyB2YWx1ZScpO1xuXHR9XG5cblx0bGV0IHRpbWVvdXQ7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0bGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdGxldCBsYXRlciA9ICgpID0+IHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGxldCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cblx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBjb250YWlucyBhbnkgZWxlbWVudHNcbiAqXG4gKiBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjc5OTE1L2hvdy1kby1pLXRlc3QtZm9yLWFuLWVtcHR5LWphdmFzY3JpcHQtb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdEVtcHR5IChpbnN0YW5jZSkge1xuXHRyZXR1cm4gKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluc3RhbmNlKS5sZW5ndGggPD0gMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEV2ZW50cyAoZXZlbnRzLCBpZCkge1xuXHRsZXQgcndpbmRvdyA9IC9eKChhZnRlcnxiZWZvcmUpcHJpbnR8KGJlZm9yZSk/dW5sb2FkfGhhc2hjaGFuZ2V8bWVzc2FnZXxvKGZmfG4pbGluZXxwYWdlKGhpZGV8c2hvdyl8cG9wc3RhdGV8cmVzaXplfHN0b3JhZ2UpXFxiLztcblx0Ly8gYWRkIHBsYXllciBJRCBhcyBhbiBldmVudCBuYW1lc3BhY2Ugc28gaXQncyBlYXNpZXIgdG8gdW5iaW5kIHRoZW0gYWxsIGxhdGVyXG5cdGxldCByZXQgPSB7ZDogW10sIHc6IFtdfTtcblx0KGV2ZW50cyB8fCAnJykuc3BsaXQoJyAnKS5mb3JFYWNoKCh2KSA9PiB7XG5cdFx0Y29uc3QgZXZlbnROYW1lID0gdiArICcuJyArIGlkO1xuXG5cdFx0aWYgKGV2ZW50TmFtZS5zdGFydHNXaXRoKCcuJykpIHtcblx0XHRcdHJldC5kLnB1c2goZXZlbnROYW1lKTtcblx0XHRcdHJldC53LnB1c2goZXZlbnROYW1lKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXRbcndpbmRvdy50ZXN0KHYpID8gJ3cnIDogJ2QnXS5wdXNoKGV2ZW50TmFtZSk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdHJldC5kID0gcmV0LmQuam9pbignICcpO1xuXHRyZXQudyA9IHJldC53LmpvaW4oJyAnKTtcblx0cmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtTdHJpbmd9IHRhZ1xuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUgKGNsYXNzTmFtZSwgbm9kZSwgdGFnKSB7XG5cblx0aWYgKG5vZGUgPT09IHVuZGVmaW5lZCB8fCBub2RlID09PSBudWxsKSB7XG5cdFx0bm9kZSA9IGRvY3VtZW50O1xuXHR9XG5cdGlmIChub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IHVuZGVmaW5lZCAmJiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IG51bGwpIHtcblx0XHRyZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XG5cdH1cblx0aWYgKHRhZyA9PT0gdW5kZWZpbmVkIHx8IHRhZyA9PT0gbnVsbCkge1xuXHRcdHRhZyA9ICcqJztcblx0fVxuXG5cdGxldFxuXHRcdGNsYXNzRWxlbWVudHMgPSBbXSxcblx0XHRqID0gMCxcblx0XHR0ZXN0c3RyLFxuXHRcdGVscyA9IG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKSxcblx0XHRlbHNMZW4gPSBlbHMubGVuZ3RoXG5cdFx0O1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbHNMZW47IGkrKykge1xuXHRcdGlmIChlbHNbaV0uY2xhc3NOYW1lLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG5cdFx0XHR0ZXN0c3RyID0gYCwke2Vsc1tpXS5jbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCcsJyl9LGA7XG5cdFx0XHRpZiAodGVzdHN0ci5pbmRleE9mKGAsJHtjbGFzc05hbWV9LGApID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NFbGVtZW50c1tqXSA9IGVsc1tpXTtcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjbGFzc0VsZW1lbnRzO1xufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuZXNjYXBlSFRNTCA9IGVzY2FwZUhUTUw7XG5tZWpzLlV0aWxzLmRlYm91bmNlID0gZGVib3VuY2U7XG5tZWpzLlV0aWxzLmlzT2JqZWN0RW1wdHkgPSBpc09iamVjdEVtcHR5O1xubWVqcy5VdGlscy5zcGxpdEV2ZW50cyA9IHNwbGl0RXZlbnRzO1xubWVqcy5VdGlscy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBtZWpzIGZyb20gJy4uL2NvcmUvbWVqcyc7XG5pbXBvcnQge2VzY2FwZUhUTUx9IGZyb20gJy4vZ2VuZXJhbCc7XG5cbmV4cG9ydCBsZXQgdHlwZUNoZWNrcyA9IFtdO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhYnNvbHV0aXplVXJsICh1cmwpIHtcblxuXHRpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B1cmxgIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcblx0fVxuXG5cdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRlbC5pbm5lckhUTUwgPSBgPGEgaHJlZj1cIiR7ZXNjYXBlSFRNTCh1cmwpfVwiPng8L2E+YDtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuaHJlZjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGZvcm1hdCBvZiBhIHNwZWNpZmljIG1lZGlhLCBiYXNlZCBvbiBVUkwgYW5kIGFkZGl0aW9uYWxseSBpdHMgbWltZSB0eXBlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFR5cGUgKHVybCwgdHlwZSA9ICcnKSB7XG5cdHJldHVybiAodXJsICYmICF0eXBlKSA/IGdldFR5cGVGcm9tRmlsZSh1cmwpIDogZ2V0TWltZUZyb21UeXBlKHR5cGUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSBwYXJ0IG9mIHRoZSB0eXBlIGluIGNhc2UgdGhlIGF0dHJpYnV0ZSBjb250YWlucyB0aGUgY29kZWNcbiAqIChgdmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRSwgbXA0YS40MC4yXCJgIGJlY29tZXMgYHZpZGVvL21wNGApXG4gKlxuICogQHNlZSBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS92aWRlby5odG1sI3RoZS1zb3VyY2UtZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbWVGcm9tVHlwZSAodHlwZSkge1xuXG5cdGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2B0eXBlYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRyZXR1cm4gKHR5cGUgJiYgfnR5cGUuaW5kZXhPZignOycpKSA/IHR5cGUuc3Vic3RyKDAsIHR5cGUuaW5kZXhPZignOycpKSA6IHR5cGU7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIG1lZGlhIGJhc2VkIG9uIFVSTCBzdHJ1Y3R1cmVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlRnJvbUZpbGUgKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IHR5cGU7XG5cblx0Ly8gVmFsaWRhdGUgYHR5cGVDaGVja3NgIGFycmF5XG5cdGlmICghQXJyYXkuaXNBcnJheSh0eXBlQ2hlY2tzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHR5cGVDaGVja3NgIG11c3QgYmUgYW4gYXJyYXknKTtcblx0fVxuXG5cdGlmICh0eXBlQ2hlY2tzLmxlbmd0aCkge1xuXHRcdGZvciAobGV0IGkgPSAwLCB0b3RhbCA9IHR5cGVDaGVja3MubGVuZ3RoOyBpIDwgdG90YWw7IGkrKykge1xuXHRcdFx0Y29uc3QgdHlwZSA9IHR5cGVDaGVja3NbaV07XG5cblx0XHRcdGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaW4gYXJyYXkgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gZG8gdHlwZSBjaGVja3MgZmlyc3Rcblx0Zm9yIChsZXQgaSA9IDAsIHRvdGFsID0gdHlwZUNoZWNrcy5sZW5ndGg7IGkgPCB0b3RhbDsgaSsrKSB7XG5cblx0XHR0eXBlID0gdHlwZUNoZWNrc1tpXSh1cmwpO1xuXG5cdFx0aWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlICE9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gdHlwZTtcblx0XHR9XG5cdH1cblxuXHQvLyB0aGUgZG8gc3RhbmRhcmQgZXh0ZW5zaW9uIGNoZWNrXG5cdGxldFxuXHRcdGV4dCA9IGdldEV4dGVuc2lvbih1cmwpLFxuXHRcdG5vcm1hbGl6ZWRFeHQgPSBub3JtYWxpemVFeHRlbnNpb24oZXh0KVxuXHRcdDtcblxuXHRyZXR1cm4gKC8obXA0fG00dnxvZ2d8b2d2fHdlYm18d2VibXZ8Zmx2fHdtdnxtcGVnfG1vdikvZ2kudGVzdChleHQpID8gJ3ZpZGVvJyA6ICdhdWRpbycpICsgJy8nICsgbm9ybWFsaXplZEV4dDtcbn1cblxuLyoqXG4gKiBHZXQgbWVkaWEgZmlsZSBleHRlbnNpb24gZnJvbSBVUkxcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb24gKHVybCkge1xuXG5cdGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignYHVybGAgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuXHR9XG5cblx0bGV0IGJhc2VVcmwgPSB1cmwuc3BsaXQoJz8nKVswXTtcblxuXHRyZXR1cm4gfmJhc2VVcmwuaW5kZXhPZignLicpID8gYmFzZVVybC5zdWJzdHJpbmcoYmFzZVVybC5sYXN0SW5kZXhPZignLicpICsgMSkgOiAnJztcbn1cblxuLyoqXG4gKiBHZXQgc3RhbmRhcmQgZXh0ZW5zaW9uIG9mIGEgbWVkaWEgZmlsZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHRlbnNpb25cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUV4dGVuc2lvbiAoZXh0ZW5zaW9uKSB7XG5cblx0aWYgKHR5cGVvZiBleHRlbnNpb24gIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgZXh0ZW5zaW9uYCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cdH1cblxuXHRzd2l0Y2ggKGV4dGVuc2lvbikge1xuXHRcdGNhc2UgJ21wNCc6XG5cdFx0Y2FzZSAnbTR2Jzpcblx0XHRcdHJldHVybiAnbXA0Jztcblx0XHRjYXNlICd3ZWJtJzpcblx0XHRjYXNlICd3ZWJtYSc6XG5cdFx0Y2FzZSAnd2VibXYnOlxuXHRcdFx0cmV0dXJuICd3ZWJtJztcblx0XHRjYXNlICdvZ2cnOlxuXHRcdGNhc2UgJ29nYSc6XG5cdFx0Y2FzZSAnb2d2Jzpcblx0XHRcdHJldHVybiAnb2dnJztcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGV4dGVuc2lvbjtcblx0fVxufVxuXG5tZWpzLlV0aWxzID0gbWVqcy5VdGlscyB8fCB7fTtcbm1lanMuVXRpbHMuYWJzb2x1dGl6ZVVybCA9IGFic29sdXRpemVVcmw7XG5tZWpzLlV0aWxzLmZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlO1xubWVqcy5VdGlscy5nZXRNaW1lRnJvbVR5cGUgPSBnZXRNaW1lRnJvbVR5cGU7XG5tZWpzLlV0aWxzLmdldFR5cGVGcm9tRmlsZSA9IGdldFR5cGVGcm9tRmlsZTtcbm1lanMuVXRpbHMuZ2V0RXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uO1xubWVqcy5VdGlscy5ub3JtYWxpemVFeHRlbnNpb24gPSBub3JtYWxpemVFeHRlbnNpb247XG4iLCJpbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcblxuLyoqXG4gKiBQb2x5ZmlsbFxuICpcbiAqIE1pbWljcyB0aGUgbWlzc2luZyBtZXRob2RzIGxpa2UgT2JqZWN0LmFzc2lnbiwgQXJyYXkuaW5jbHVkZXMsIGV0Yy4sIGFzIGEgd2F5IHRvIGF2b2lkIGluY2x1ZGluZyB0aGUgd2hvbGUgbGlzdFxuICogb2YgcG9seWZpbGxzIHByb3ZpZGVkIGJ5IEJhYmVsLlxuICovXG5cbi8vIElFNiw3LDhcbi8vIFByb2R1Y3Rpb24gc3RlcHMgb2YgRUNNQS0yNjIsIEVkaXRpb24gNSwgMTUuNC40LjE0XG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE0XG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkgPT4ge1xuXG5cdFx0bGV0IGs7XG5cblx0XHQvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZ1xuXHRcdC8vXHQgICB0aGUgdGhpcyB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG5cdFx0aWYgKHRoaXMgPT09IHVuZGVmaW5lZCB8fCB0aGlzID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG5cdFx0fVxuXG5cdFx0bGV0IE8gPSBPYmplY3QodGhpcyk7XG5cblx0XHQvLyAyLiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRcblx0XHQvL1x0ICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cblx0XHQvLyAzLiBMZXQgbGVuIGJlIFRvVWludDMyKGxlblZhbHVlKS5cblx0XHRsZXQgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cblx0XHQvLyA0LiBJZiBsZW4gaXMgMCwgcmV0dXJuIC0xLlxuXHRcdGlmIChsZW4gPT09IDApIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHQvLyA1LiBJZiBhcmd1bWVudCBmcm9tSW5kZXggd2FzIHBhc3NlZCBsZXQgbiBiZVxuXHRcdC8vXHQgICBUb0ludGVnZXIoZnJvbUluZGV4KTsgZWxzZSBsZXQgbiBiZSAwLlxuXHRcdGxldCBuID0gK2Zyb21JbmRleCB8fCAwO1xuXG5cdFx0aWYgKE1hdGguYWJzKG4pID09PSBJbmZpbml0eSkge1xuXHRcdFx0biA9IDA7XG5cdFx0fVxuXG5cdFx0Ly8gNi4gSWYgbiA+PSBsZW4sIHJldHVybiAtMS5cblx0XHRpZiAobiA+PSBsZW4pIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHQvLyA3LiBJZiBuID49IDAsIHRoZW4gTGV0IGsgYmUgbi5cblx0XHQvLyA4LiBFbHNlLCBuPDAsIExldCBrIGJlIGxlbiAtIGFicyhuKS5cblx0XHQvL1x0ICAgSWYgayBpcyBsZXNzIHRoYW4gMCwgdGhlbiBsZXQgayBiZSAwLlxuXHRcdGsgPSBNYXRoLm1heChuID49IDAgPyBuIDogbGVuIC0gTWF0aC5hYnMobiksIDApO1xuXG5cdFx0Ly8gOS4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG5cdFx0d2hpbGUgKGsgPCBsZW4pIHtcblx0XHRcdC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cblx0XHRcdC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuXHRcdFx0Ly8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGVcblx0XHRcdC8vXHRIYXNQcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuXHRcdFx0Ly8gICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggY1xuXHRcdFx0Ly8gYy4gSWYga1ByZXNlbnQgaXMgdHJ1ZSwgdGhlblxuXHRcdFx0Ly9cdGkuXHRMZXQgZWxlbWVudEsgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRcblx0XHRcdC8vXHRcdGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFRvU3RyaW5nKGspLlxuXHRcdFx0Ly8gICBpaS5cdExldCBzYW1lIGJlIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlXG5cdFx0XHQvL1x0XHRTdHJpY3QgRXF1YWxpdHkgQ29tcGFyaXNvbiBBbGdvcml0aG0gdG9cblx0XHRcdC8vXHRcdHNlYXJjaEVsZW1lbnQgYW5kIGVsZW1lbnRLLlxuXHRcdFx0Ly8gIGlpaS5cdElmIHNhbWUgaXMgdHJ1ZSwgcmV0dXJuIGsuXG5cdFx0XHRpZiAoayBpbiBPICYmIE9ba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGs7XG5cdFx0XHR9XG5cdFx0XHRrKys7XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fTtcbn1cblxuLy8gZG9jdW1lbnQuY3JlYXRlRXZlbnQgZm9yIElFOCBvciBvdGhlciBvbGQgYnJvd3NlcnMgdGhhdCBkbyBub3QgaW1wbGVtZW50IGl0XG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uL2llOC9ibG9iL21hc3Rlci9idWlsZC9pZTgubWF4LmpzXG5pZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT09IHVuZGVmaW5lZCkge1xuXHRkb2N1bWVudC5jcmVhdGVFdmVudCA9ICgpID0+IHtcblxuXHRcdGxldCBlO1xuXG5cdFx0ZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG5cdFx0ZS50aW1lU3RhbXAgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXHRcdGUuZW51bWVyYWJsZSA9IHRydWU7XG5cdFx0ZS53cml0YWJsZSA9IHRydWU7XG5cdFx0ZS5jb25maWd1cmFibGUgPSB0cnVlO1xuXG5cdFx0ZS5pbml0RXZlbnQgPSAodHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSkgPT4ge1xuXHRcdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRcdHRoaXMuYnViYmxlcyA9ICEhYnViYmxlcztcblx0XHRcdHRoaXMuY2FuY2VsYWJsZSA9ICEhY2FuY2VsYWJsZTtcblx0XHRcdGlmICghdGhpcy5idWJibGVzKSB7XG5cdFx0XHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuc3RvcHBlZFByb3BhZ2F0aW9uID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBlO1xuXHR9O1xufVxuXG4vLyBPYmplY3QuYXNzaWduIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24jUG9seWZpbGxcbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuXHRPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgdmFyQXJncykgeyAvLyAubGVuZ3RoIG9mIGZ1bmN0aW9uIGlzIDJcblxuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRpZiAodGFyZ2V0ID09PSBudWxsIHx8IHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7IC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0bGV0IHRvID0gT2JqZWN0KHRhcmdldCk7XG5cblx0XHRmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuXG5cdFx0XHRpZiAobmV4dFNvdXJjZSAhPT0gbnVsbCkgeyAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcblx0XHRcdFx0Zm9yIChsZXQgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XG5cdFx0XHRcdFx0Ly8gQXZvaWQgYnVncyB3aGVuIGhhc093blByb3BlcnR5IGlzIHNoYWRvd2VkXG5cdFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXh0U291cmNlLCBuZXh0S2V5KSkge1xuXHRcdFx0XHRcdFx0dG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdG87XG5cdH07XG59XG5cbi8vIEFycmF5LmluY2x1ZGVzIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luY2x1ZGVzI1BvbHlmaWxsXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmNsdWRlcykge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnaW5jbHVkZXMnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xuXG5cdFx0XHQvLyAxLiBMZXQgTyBiZSA/IFRvT2JqZWN0KHRoaXMgdmFsdWUpLlxuXHRcdFx0aWYgKHRoaXMgPT09IG51bGwgfHwgdGhpcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IG8gPSBPYmplY3QodGhpcyk7XG5cblx0XHRcdC8vIDIuIExldCBsZW4gYmUgPyBUb0xlbmd0aCg/IEdldChPLCBcImxlbmd0aFwiKSkuXG5cdFx0XHRsZXQgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cblx0XHRcdC8vIDMuIElmIGxlbiBpcyAwLCByZXR1cm4gZmFsc2UuXG5cdFx0XHRpZiAobGVuID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gNC4gTGV0IG4gYmUgPyBUb0ludGVnZXIoZnJvbUluZGV4KS5cblx0XHRcdC8vICAgIChJZiBmcm9tSW5kZXggaXMgdW5kZWZpbmVkLCB0aGlzIHN0ZXAgcHJvZHVjZXMgdGhlIHZhbHVlIDAuKVxuXHRcdFx0bGV0IG4gPSBmcm9tSW5kZXggfCAwO1xuXG5cdFx0XHQvLyA1LiBJZiBuIOKJpSAwLCB0aGVuXG5cdFx0XHQvLyAgYS4gTGV0IGsgYmUgbi5cblx0XHRcdC8vIDYuIEVsc2UgbiA8IDAsXG5cdFx0XHQvLyAgYS4gTGV0IGsgYmUgbGVuICsgbi5cblx0XHRcdC8vICBiLiBJZiBrIDwgMCwgbGV0IGsgYmUgMC5cblx0XHRcdGxldCBrID0gTWF0aC5tYXgobiA+PSAwID8gbiA6IGxlbiAtIE1hdGguYWJzKG4pLCAwKTtcblxuXHRcdFx0Ly8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG5cdFx0XHR3aGlsZSAoayA8IGxlbikge1xuXHRcdFx0XHQvLyBhLiBMZXQgZWxlbWVudEsgYmUgdGhlIHJlc3VsdCBvZiA/IEdldChPLCAhIFRvU3RyaW5nKGspKS5cblx0XHRcdFx0Ly8gYi4gSWYgU2FtZVZhbHVlWmVybyhzZWFyY2hFbGVtZW50LCBlbGVtZW50SykgaXMgdHJ1ZSwgcmV0dXJuIHRydWUuXG5cdFx0XHRcdC8vIGMuIEluY3JlYXNlIGsgYnkgMS5cblx0XHRcdFx0Ly8gTk9URTogPT09IHByb3ZpZGVzIHRoZSBjb3JyZWN0IFwiU2FtZVZhbHVlWmVyb1wiIGNvbXBhcmlzb24gbmVlZGVkIGhlcmUuXG5cdFx0XHRcdGlmIChvW2tdID09PSBzZWFyY2hFbGVtZW50KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aysrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyA4LiBSZXR1cm4gZmFsc2Vcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpIHtcblx0U3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTdHJpbmcucHJvdG90eXBlLmluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSAhPT0gLTE7XG5cdH07XG59XG5cbi8vIFN0cmluZy5zdGFydHNXaXRoIHBvbHlmaWxsXG4vLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9zdGFydHNXaXRoI1BvbHlmaWxsXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCkge1xuXHRTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKXtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic3RyKHBvc2l0aW9uLCBzZWFyY2hTdHJpbmcubGVuZ3RoKSA9PT0gc2VhcmNoU3RyaW5nO1xuXHR9O1xufSJdfQ==
