/**
 * Localize strings
 *
 * Include translations from JS files and method to pluralize properly strings.
 *
 */
(function (doc, win, mejs, undefined) {

	var i18n = {
		/**
		 * @type {String}
		 */
		'default': 'en',

		/**
		 * @type {String[]}
		 */
		locale: {
			language: (mejs.i18n && mejs.i18n.locale.language) || '',
			strings: (mejs.i18n && mejs.i18n.locale.strings) || {}
		},

		/**
		 * Filters for available languages.
		 *
		 * This plural forms are grouped in family groups based on
		 * https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
		 * with some additions and corrections according to the Localization Guide list
		 * (http://localization-guide.readthedocs.io/en/latest/l10n/pluralforms.html)
		 *
		 * Arguments are dynamic following the structure:
		 * - argument1 : Number to determine form
		 * - argument2...argumentN: Possible matches
		 *
		 * @type {Function[]}
		 */
		pluralForms: [
			// 0: Chinese, Japanese, Korean, Persian, Turkish, Thai, Lao, Aymará,
			// Tibetan, Chiga, Dzongkha, Indonesian, Lojban, Georgian, Kazakh, Khmer, Kyrgyz, Malay,
			// Burmese, Yakut, Sundanese, Tatar, Uyghur, Vietnamese, Wolof
			function () {
				return arguments[1];
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
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 2: French, Brazilian Portuguese, Acholi, Akan, Amharic, Mapudungun, Breton, Filipino,
			// Gun, Lingala, Mauritian Creole, Malagasy, Maori, Occitan, Tajik, Tigrinya, Uzbek, Walloon
			function () {
				var args = arguments;
				if ([0, 1].indexOf(args[0]) > -1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 3: Latvian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] !== 0) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 4: Scottish Gaelic
			function () {
				var args = arguments;
				if (args[0] === 1 || args[0] === 11) {
					return args[1];
				} else if (args[0] === 2 || args[0] === 12) {
					return args[2];
				} else if (args[0] > 2 && args[0] < 20) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 5:  Romanian
			function () {
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 0 || (args[0] % 100 > 0 && args[0] % 100 < 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 6: Lithuanian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] % 10 >= 2 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return [3];
				}
			},
			// 7: Belarusian, Bosnian, Croatian, Serbian, Russian, Ukrainian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 8:  Slovak, Czech
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] >= 2 && args[0] <= 4) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 9: Polish
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 10: Slovenian
			function () {
				var args = arguments;
				if (args[0] % 100 === 1) {
					return args[2];
				} else if (args[0] % 100 === 2) {
					return args[3];
				} else if (args[0] % 100 === 3 || args[0] % 100 === 4) {
					return args[4];
				} else {
					return args[1];
				}
			},
			// 11: Irish Gaelic
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] > 2 && args[0] < 7) {
					return args[3];
				} else if (args[0] > 6 && args[0] < 11) {
					return args[4];
				} else {
					return args[5];
				}
			},
			// 12: Arabic
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else if (args[0] === 1) {
					return args[2];
				} else if (args[0] === 2) {
					return args[3];
				} else if (args[0] % 100 >= 3 && args[0] % 100 <= 10) {
					return args[4];
				} else if (args[0] % 100 >= 11) {
					return args[5];
				} else {
					return args[6];
				}
			},
			// 13: Maltese
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 0 || (args[0] % 100 > 1 && args[0] % 100 < 11)) {
					return args[2];
				} else if (args[0] % 100 > 10 && args[0] % 100 < 20) {
					return args[3];
				} else {
					return args[4];
				}

			},
			// 14: Macedonian
			function () {
				var args = arguments;
				if (args[0] % 10 === 1) {
					return args[1];
				} else if (args[0] % 10 === 2) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 15:  Icelandic
			function () {
				var args = arguments;
				if (args[0] !== 11 && args[0] % 10 === 1) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// New additions

			// 16:  Kashubian
			// Note: in https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
			// Breton is listed as #16 but in the Localization Guide it belongs to the group 2
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
					return args[2];
				} else {
					return args[3];
				}
			},
			// 17:  Welsh
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] !== 8 && args[0] !== 11) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 18:  Javanese
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else {
					return args[2];
				}
			},
			// 19:  Cornish
			function () {
				var args = arguments;
				if (args[0] === 1) {
					return args[1];
				} else if (args[0] === 2) {
					return args[2];
				} else if (args[0] === 3) {
					return args[3];
				} else {
					return args[4];
				}
			},
			// 20:  Mandinka
			function () {
				var args = arguments;
				if (args[0] === 0) {
					return args[1];
				} else if (args[0] === 1) {
					return args[2];
				} else {
					return args[3];
				}
			}
		],
		/**
		 * Get specified language
		 *
		 */
		getLanguage: function () {
			var language = i18n.locale.language || i18n['default'];
			return /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/.exec(language) ? language : i18n['default'];
		},

		/**
		 * Translate a string to a specified language, including optionally a number to pluralize translation
		 *
		 * @param {String} message
		 * @param {Number} pluralParam
		 * @return {String}
		 */
		t: function (message, pluralParam) {

			if (typeof message === 'string' && message.length) {

				var
					language = i18n.getLanguage(),
					str,
					pluralForm,
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
					plural = function (input, number, form) {

						if (typeof input !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
							return input;
						}

						if (typeof input === 'string') {
							return input;
						}

						// Perform plural form or return original text
						return i18n.pluralForms[form].apply(null, [number].concat(input));
					},
					/**
					 *
					 * @param {String} input
					 * @return {String}
					 */
					escapeHTML = function (input) {
						var map = {
							'&': '&amp;',
							'<': '&lt;',
							'>': '&gt;',
							'"': '&quot;'
						};

						return input.replace(/[&<>"]/g, function(c) {
							return map[c];
						});
					}
				;

				// Fetch the localized version of the string
				if (i18n.locale.strings && i18n.locale.strings[language]) {
					str = i18n.locale.strings[language][message];
					if (typeof pluralParam === 'number') {
						pluralForm = i18n.locale.strings[language]['mejs.plural-form'];
						str = plural.apply(null, [str, pluralParam, pluralForm]);
					}
				}

				// Fallback to default language if requested uid is not translated
				if (!str && i18n.locale.strings && i18n.locale.strings[i18n['default']]) {
					str = i18n.locale.strings[i18n['default']][message];
					if (typeof pluralParam === 'number') {
						pluralForm = i18n.locale.strings[i18n['default']]['mejs.plural-form'];
						str = plural.apply(null, [str, pluralParam, pluralForm]);

					}
				}

				// As a last resort, use the requested uid, to mimic original behavior of i18n utils (in which uid was the english text)
				str = str || message;

				// Replace token
				if (typeof pluralParam === 'number') {
					str = str.replace('%1', pluralParam);
				}

				return escapeHTML(str);

			}

			return message;
		}

	};

	// i18n fixes for compatibility with WordPress
	if (typeof mejsL10n !== 'undefined') {
		i18n.locale.language = mejsL10n.language;
	}

	// Register variable
	mejs.i18n = i18n;


}(document, window, mejs));

// i18n fixes for compatibility with WordPress
;(function (mejs, undefined) {

	"use strict";

	if (typeof mejsL10n !== 'undefined') {
		mejs[mejsL10n.lang] = mejsL10n.strings;
	}

}(mejs.i18n.locale.strings));