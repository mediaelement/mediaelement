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
		default: 'en',

		/**
		 * @type {String[]}
		 */
		locale: {
			language: (mejs.i18n && mejs.i18n.locale.language) || '',
			strings: (mejs.i18n && mejs.i18n.locale.strings) || {}
		},

		/**
		 * Filters for available languages
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#List_of_Plural_Rules
		 * @type {Object[]}
		 */
		rules: [
			{
				languages: ['zh', 'zh-cn', 'ko', 'ja'],
				plural: function (n, replacement) {
					return replacement;
				}
			},
			{
				languages: ['ca', 'de', 'en', 'es', 'hu', 'it', 'nl', 'pt'],
				plural: function (n, replacement1, replacement2) {
					if (n === 1) {
						return replacement1;
					} else {
						return replacement2;
					}
				}
			},
			{
				languages: ['fr', 'pt-br'],
				plural: function (n, replacement1, replacement2) {
					if (n === 0 || n === 1) {
						return replacement1;
					} else {
						return replacement2;
					}
				}
			},
			{
				languages: ['ro'],
				plural: function (n, replacement1, replacement2, replacement3) {
					if (n === 1) {
						return replacement1;
					} else if (n === 0 || ([1, 2, 3, 4, 5, 6, 7, 8.9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf((n % 10)) > -1)) {
						return replacement2;
					} else {
						return replacement3;
					}
				}
			},
			{
				languages: ['ru'],
				plural: function (n, replacement1, replacement2, replacement3) {
					if (n !== 11 && n % 10 === 1) {
						return replacement1;
					} else if (n !== 12 && n !== 13 && n !== 14 && [2, 3, 4].indexOf((n % 10)) > -1) {
						return replacement2;
					} else {
						return replacement3;
					}
				}
			},
			{
				languages: ['cs', 'sk'],
				plural: function (n, replacement1, replacement2, replacement3) {
					if (n === 1) {
						return replacement1;
					} else if ([2, 3, 4].indexOf(n) > -1) {
						return replacement2;
					} else {
						return replacement3;
					}
				}
			},
			{
				languages: ['pl'],
				plural: function (n, replacement1, replacement2, replacement3) {
					if (n === 1) {
						return replacement1;
					} else if (n !== 12 && n !== 13 && n !== 14 && [2, 3, 4].indexOf((n % 10)) > -1) {
						return replacement2;
					} else {
						return replacement3;
					}
				}
			}
		],
		/**
		 * Get specified language
		 *
		 */
		getLanguage: function () {
			var language = i18n.locale.language || i18n.default;
			return /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/.exec(language) ? language : i18n.default;
		},

		/**
		 * Translate a string to a specified language
		 *
		 * @param {String} input
		 * @return {String}
		 */
		t: function (input) {

			if (typeof input === 'string' && input.length) {

				var
					language = i18n.getLanguage(),
					str
				;


				// Fetch the localized version of the string
				if (i18n.locale.strings && i18n.locale.strings[language]) {
					str = i18n.locale.strings[language][input];
				}

				// Fallback to default language if requested uid is not translated
				if (!str && i18n.locale.strings && i18n.locale.strings[i18n['default']]) {
					str = i18n.locale.strings[i18n['default']][input];
				}

				// As a last resort, use the requested uid, to mimic original behavior of i18n utils (in which uid was the english text)
				str = str || input;

				return str;

			}

			return input;
		}

	};

	// i18n fixes for compatibility with WordPress
	// if (typeof mejsL10n !== 'undefined') {
	// 	i18n.locale.language = mejsL10n.language;
	// }

	// Register variable
	mejs.i18n = i18n;

	/**
	 * Convert string using an algorithm to detect callbacks that will modify a string based on filters.
	 *
	 * This method will change a string with format:
	 *  - '{0} {0|plural:second:seconds} left to finish playing and {1} {1|plural:second:seconds} to go'.format(1, 10)
	 * to:
	 * - '1 second left to finish playing and 10 seconds to go'
	 *
	 * where:
	 * - {[0,1,2...]}  is the number to be placed from the method's arguments in respective order
	 * - {[0,1,2...]|[filterName]:[replacement1]:[replacement2]:...} is the string to be placed based on the specified filter
	 *
	 * @see http://stackoverflow.com/questions/1353408/messageformat-in-javascript-parameters-in-localized-ui-strings
	 * @return {String}
	 */
	String.prototype.format = function () {
		var args = arguments;

		return this.replace(/\{((\d+)((\|\w+(:\w+)*)*))\}/g, function() {
			var arg = args[arguments[2]],
				filters = arguments[3].split('|'),
				i,
				total,
				curFilter,
				curFilterArgs,
				curFilterFunc,
				defaultFilters = {}
			;

			// Find current language's rules to filter; otherwise, use default
			for (i = 0, total = mejs.i18n.rules.length; i < total; i++) {
				var rule = mejs.i18n.rules[i];
				if (rule.languages.indexOf(mejs.i18n.getLanguage()) > -1) {
					for (var property in rule) {
						if (rule.hasOwnProperty(property) && property !== 'languages') {
							defaultFilters[property] = rule[property];
						}
					}
					break;
				}
			}

			for(i = 0, total = filters.length; i < total; ++i) {
				curFilterArgs = filters[i].split(':');
				curFilter = curFilterArgs.shift();
				curFilterFunc = defaultFilters[curFilter];

				if(typeof curFilterFunc === 'function') {
					arg = curFilterFunc.apply(null, [ arg ].concat(curFilterArgs));
				}
			}
			return arg;
		});
	}

}(document, window, mejs));

// i18n fixes for compatibility with WordPress
// ;(function (mejs, undefined) {
//
// 	"use strict";
//
// 	if (typeof mejsL10n !== 'undefined') {
// 		mejs[mejsL10n.lang] = mejsL10n.strings;
// 	}
//
// }(mejs.i18n.locale.strings));