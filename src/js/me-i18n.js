/*!
 * Adds Internationalization and localization to objects.
 *
 * What is the concept beyond i18n?
 *   http://en.wikipedia.org/wiki/Internationalization_and_localization
 *
 *
 * This file both i18n methods and locale which is used to translate
 * strings into other languages.
 *
 * Default translations are not available, you have to add them
 * through locale objects which are named exactly as the langcode
 * they stand for. The default language is always english (en).
 *
 *
 * Wrapper built to be able to attach the i18n object to
 * other objects without changing more than one line.
 *
 *
 * LICENSE:
 *
 *   The i18n file uses methods from the Drupal project (drupal.js):
 *     - i18n.methods.t() (modified)
 *     - i18n.methods.checkPlain() (full copy)
 *     - i18n.methods.formatString() (full copy)
 *
 *   The Drupal project is (like mediaelementjs) licensed under GPLv2.
 *    - http://drupal.org/licensing/faq/#q1
 *    - https://github.com/johndyer/mediaelement
 *    - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 *
 * @author
 *   Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *   me-i18n-locale.js
 *
 * @params
 *  - $       - zepto || jQuery  ..
 *  - context - document, iframe ..
 *  - exports - CommonJS, window ..
 *
 */
;(function($, context, exports, undefined) {
    "use strict";
    var i18n = {
        "locale": {
            "strings" : {}
        },
        "methods" : {}
    };
// start i18n


    /**
     * Get the current browser's language
     *
     * @see: i18n.methods.t()
     */
    i18n.locale.getLanguage = function () {
        return {
            "language" : navigator.language
        };
    };

    /**
     * Store the language the locale object was initialized with
     */
    i18n.locale.INIT_LANGUAGE = i18n.locale.getLanguage();


    /**
     * Encode special characters in a plain-text string for display as HTML.
     */
    i18n.methods.checkPlain = function (str) {
        var character, regex,
        replace = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };
        str = String(str);
        for (character in replace) {
            if (replace.hasOwnProperty(character)) {
                regex = new RegExp(character, 'g');
                str = str.replace(regex, replace[character]);
            }
        }
        return str;
    };

    /**
     * Replace placeholders with sanitized values in a string.
     *
     * @param str
     *   A string with placeholders.
     * @param args
     *   An object of replacements pairs to make. Incidences of any key in this
     *   array are replaced with the corresponding value. Based on the first
     *   character of the key, the value is escaped and/or themed:
     *    - !variable: inserted as is
     *    - @variable: escape plain text to HTML (i18n.methods.checkPlain)
     *    - %variable: escape text and theme as a placeholder for user-submitted
     *      content (checkPlain + <em class="placeholder" > )
     *
     * @see i18n.methods.t()
     */
    i18n.methods.formatString = function(str, args) {
        // Transform arguments before inserting them.
        for (var key in args) {
            switch (key.charAt(0)) {
                // Escaped only.
                case '@':
                    args[key] = i18n.methods.checkPlain(args[key]);
                    break;
                // Pass-through.
                case '!':
                    break;
                // Escaped and placeholder.
                case '%':
                default:
                    args[key] = '<em class="placeholder">' + i18n.methods.checkPlain(args[key]) + '</em>';
                    break;
            }
            str = str.replace(key, args[key]);
        }
        return str;
    };

    /**
     * Translate strings to the page language or a given language.
     *
     * See the documentation of the server-side t() function for further details.
     *
     * @param str
     *   A string containing the English string to translate.
     * @param args
     *   An object of replacements pairs to make after translation. Incidences
     *   of any key in this array are replaced with the corresponding value.
     *   See i18n.methods.formatString().
     *
     * @param options
     *   - 'context' (defaults to the default context): The context the source string
     *     belongs to.
     *
     * @return
     *   The translated string.
     */
    i18n.methods.t = function (str, args, options) {

        // Fetch the localized version of the string.
        if (i18n.locale.strings && i18n.locale.strings[options.context] && i18n.locale.strings[options.context][str]) {
            str = i18n.locale.strings[options.context][str];
        }

        if (args) {
            str = i18n.methods.formatString(str, args);
        }
        return str;
    };


    /**
     * Wrapper for i18n.methods.t()
     *
     * @see i18n.methods.t()
     * @throws InvalidArgumentException
     */
    i18n.t = function(str, args, options) {

        if (typeof str === 'string' && str.length > 0) {

            // check every time due languge can change for
            // different reasons (translation, lang switcher ..)
            var lang = i18n.locale.getLanguage();

            options = options || {
                "context" : lang.language
            };

            return i18n.methods.t(str, args, options);
        }
        else {
            throw {
                "name" : 'InvalidArgumentException',
                "message" : 'First argument is either not a string or empty.'
            }
        }
    };

// end i18n
    exports.i18n = i18n;
}(jQuery, document, mejs));