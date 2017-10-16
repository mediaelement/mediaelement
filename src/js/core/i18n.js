'use strict';

import mejs from './mejs';
import {EN as en} from '../languages/en';
import {escapeHTML, isObjectEmpty} from '../utils/general';

/**
 * Locale.
 *
 * This object manages translations with pluralization. Also deals with WordPress compatibility.
 * @type {Object}
 */
const i18n = {lang: 'en', en: en};

/**
 * Language setter/getter
 *
 * @param {*} args  Can pass the language code and/or the translation strings as an Object
 * @return {string}
 */
i18n.language = (...args) => {

	if (args !== null && args !== undefined && args.length) {

		if (typeof args[0] !== 'string') {
			throw new TypeError('Language code must be a string value');
		}

		if (!/^[a-z]{2,3}((\-|_)[a-z]{2})?$/i.test(args[0])) {
			throw new TypeError('Language code must have format 2-3 letters and. optionally, hyphen, underscore followed by 2 more letters');
		}

		i18n.lang = args[0];

		// Check if language strings were added; otherwise, check the second argument or set to English as default
		if (i18n[args[0]] === undefined) {
			args[1] = args[1] !== null && args[1] !== undefined && typeof args[1] === 'object' ? args[1] : {};
			i18n[args[0]] = !isObjectEmpty(args[1]) ? args[1] : en;
		} else if (args[1] !== null && args[1] !== undefined && typeof args[1] === 'object') {
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
i18n.t = (message, pluralParam = null) => {

	if (typeof message === 'string' && message.length) {

		let
			str,
			pluralForm
		;

		const language = i18n.language();

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
		const _plural = (input, number, form) => {

			if (typeof input !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
				return input;
			}

			/**
			 *
			 * @return {Function[]}
			 * @private
			 */
			const _pluralForms = (() => {
				return [
					// 0: Chinese, Japanese, Korean, Persian, Turkish, Thai, Lao, Aymará,
					// Tibetan, Chiga, Dzongkha, Indonesian, Lojban, Georgian, Kazakh, Khmer, Kyrgyz, Malay,
					// Burmese, Yakut, Sundanese, Tatar, Uyghur, Vietnamese, Wolof
					(...args) => args[1],
					// 1: Danish, Dutch, English, Faroese, Frisian, German, Norwegian, Swedish, Estonian, Finnish,
					// Hungarian, Basque, Greek, Hebrew, Italian, Portuguese, Spanish, Catalan, Afrikaans,
					// Angika, Assamese, Asturian, Azerbaijani, Bulgarian, Bengali, Bodo, Aragonese, Dogri,
					// Esperanto, Argentinean Spanish, Fulah, Friulian, Galician, Gujarati, Hausa,
					// Hindi, Chhattisgarhi, Armenian, Interlingua, Greenlandic, Kannada, Kurdish, Letzeburgesch,
					// Maithili, Malayalam, Mongolian, Manipuri, Marathi, Nahuatl, Neapolitan, Norwegian Bokmal,
					// Nepali, Norwegian Nynorsk, Norwegian (old code), Northern Sotho, Oriya, Punjabi, Papiamento,
					// Piemontese, Pashto, Romansh, Kinyarwanda, Santali, Scots, Sindhi, Northern Sami, Sinhala,
					// Somali, Songhay, Albanian, Swahili, Tamil, Telugu, Turkmen, Urdu, Yoruba
					(...args) => (args[0] === 1) ? args[1] : args[2],
					// 2: French, Brazilian Portuguese, Acholi, Akan, Amharic, Mapudungun, Breton, Filipino,
					// Gun, Lingala, Mauritian Creole, Malagasy, Maori, Occitan, Tajik, Tigrinya, Uzbek, Walloon
					(...args) => (args[0] === 0 || args[0] === 1) ? args[1] : args[2],
					// 3: Latvian
					(...args) => {
						if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
							return args[1];
						} else if (args[0] !== 0) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 4: Scottish Gaelic
					(...args) => {
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
					(...args) => {
						if (args[0] === 1) {
							return args[1];
						} else if (args[0] === 0 || (args[0] % 100 > 0 && args[0] % 100 < 20)) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 6: Lithuanian
					(...args) => {
						if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
							return args[1];
						} else if (args[0] % 10 >= 2 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
							return args[2];
						} else {
							return [3];
						}
					},
					// 7: Belarusian, Bosnian, Croatian, Serbian, Russian, Ukrainian
					(...args) => {
						if (args[0] % 10 === 1 && args[0] % 100 !== 11) {
							return args[1];
						} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 8:  Slovak, Czech
					(...args) => {
						if (args[0] === 1) {
							return args[1];
						} else if (args[0] >= 2 && args[0] <= 4) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 9: Polish
					(...args) => {
						if (args[0] === 1) {
							return args[1];
						} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 || args[0] % 100 >= 20)) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 10: Slovenian
					(...args) => {
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
					(...args) => {
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
					(...args) => {
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
					(...args) => {
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
					(...args) => {
						if (args[0] % 10 === 1) {
							return args[1];
						} else if (args[0] % 10 === 2) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 15:  Icelandic
					(...args) => {
						return (args[0] !== 11 && args[0] % 10 === 1) ? args[1] : args[2];
					},
					// New additions
					// 16:  Kashubian
					// In https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of__pluralRules
					// Breton is listed as #16 but in the Localization Guide it belongs to the group 2
					(...args) => {
						if (args[0] === 1) {
							return args[1];
						} else if (args[0] % 10 >= 2 && args[0] % 10 <= 4 && (args[0] % 100 < 10 ||
							args[0] % 100 >= 20)) {
							return args[2];
						} else {
							return args[3];
						}
					},
					// 17:  Welsh
					(...args) => {
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
					(...args) => {
						return (args[0] === 0) ? args[1] : args[2];
					},
					// 19:  Cornish
					(...args) => {
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
					(...args) => {
						if (args[0] === 0) {
							return args[1];
						} else if (args[0] === 1) {
							return args[2];
						} else {
							return args[3];
						}
					}

				];
			})();

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

		return escapeHTML(str);
	}

	return message;
};

mejs.i18n = i18n;

// `i18n` compatibility workflow with WordPress
if (typeof mejsL10n !== 'undefined') {
	mejs.i18n.language(mejsL10n.language, mejsL10n.strings);
}

export default i18n;