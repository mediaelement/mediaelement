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
		 * Translate a string to a specified language, including optionally a number to pluralize translation
		 *
		 * @param {String} input
		 * @param {Number} pluralReplacement
		 * @return {String}
		 */
		t: function (input, pluralReplacement) {

			if (typeof input === 'string' && input.length) {

				var
					language = i18n.getLanguage(),
					str,

					/**
					 * Convert string using an algorithm to detect plural rules.
					 *
					 * This method will change a string with format '{0} {0|plural:second:seconds}' to '1 second'
					 * @private
					 * @see http://stackoverflow.com/questions/1353408/messageformat-in-javascript-parameters-in-localized-ui-strings
					 * @param {String} text        - Input text
					 * @param {Number} replacement - the number to determine the proper plural
					 * @param {String} lang        - the language to match rules
					 * @return {String}
					 */
					plural = function (text, replacement, lang) {

						if (typeof text !== 'string' || typeof replacement !== 'number' ||
							typeof lang !== 'string') {
							return text;
						}

						return text.replace(/\{((\d+)((\|\w+(:\w+)*)*))\}/g, function () {
							var arg = replacement,
								filters = arguments[3].split('|'),
								i,
								total,
								curFilter,
								curFilterArgs,
								curFilterFunc,
								defaultFilters = {}
								;

							// Find current language's rules to filter; otherwise, use default
							for (i = 0, total = i18n.rules.length; i < total; i++) {
								var rule = i18n.rules[i];
								if (rule.languages.indexOf(lang) > -1) {
									for (var property in rule) {
										if (rule.hasOwnProperty(property) && property !== 'languages') {
											defaultFilters[property] = rule[property];
										}
									}
									break;
								}
							}

							for (i = 0, total = filters.length; i < total; ++i) {
								curFilterArgs = filters[i].split(':');
								curFilter = curFilterArgs.shift();
								curFilterFunc = defaultFilters[curFilter];

								if (typeof curFilterFunc === 'function') {
									arg = curFilterFunc.apply(null, [arg].concat(curFilterArgs));
								}
							}
							return arg;
						});
					}
				;


				// Fetch the localized version of the string
				if (i18n.locale.strings && i18n.locale.strings[language]) {
					str = i18n.locale.strings[language][input];
					if (typeof pluralReplacement === 'number') {
						str = plural.apply(null, [str, pluralReplacement, language]);
					}
				}

				// Fallback to default language if requested uid is not translated
				if (!str && i18n.locale.strings && i18n.locale.strings[i18n['default']]) {
					str = i18n.locale.strings[i18n['default']][input];
					if (typeof pluralReplacement === 'number') {
						str = plural.apply(null, [str, pluralReplacement, i18n['default']]);

					}
				}

				// As a last resort, use the requested uid, to mimic original behavior of i18n utils (in which uid was the english text)
				str = str || input;

				if (typeof pluralReplacement === 'number') {
					str = str.replace('%1', pluralReplacement);
				}

				return str;

			}

			return input;
		}

	};

	// Register variable
	mejs.i18n = i18n;


}(document, window, mejs));