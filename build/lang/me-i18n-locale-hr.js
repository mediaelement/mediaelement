/*!
 * This is a i18n.locale language object for Croatian = HR.
 *
 * @author
 *   Hrvoj3e (hrvoj3e@gmail.com)
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
(function (exports) {
    "use strict";

    if (exports.en === undefined) {
        exports.en = {
            "mejs.plural-form": 1,

            // me-shim
            "mejs.download-file": "Preuzmi datoteku",

            // mep-feature-contextmenu
            "mejs.fullscreen-off": "Isključi puni zaslon",
            "mejs.fullscreen-on": "Uključi zaslon",
            "mejs.download-video": "Download Video",

            // mep-feature-fullscreen
            "mejs.fullscreen": "Puni zaslon",

            // mep-feature-jumpforward
            "mejs.time-jump-forward": ["Skoči naprijed 1 sekundu", "Skoči naprijed %1 sekundi"],

            // mep-feature-playpause
            "mejs.play": "Pokreni",
            "mejs.pause": "Zaustavi",

            // mep-feature-postroll
            "mejs.close": "Zatvori",

            // mep-feature-progress
            "mejs.time-slider": "Vremenska traka",
            "mejs.time-help-text": "Koristi strelice lijevo/desno za pomak naprijed za 1 sekundu te gore/dolje za pomak od 10 sekundi.",

            // mep-feature-skipback
            "mejs.time-skip-back": ["Skoči natrag 1 sekundu", "Skoči natrag %1 sekundi"],

            // mep-feature-tracks
            "mejs.captions-subtitles": "Opisi/Prijevodi",
            "mejs.none": "Ništa",

            // mep-feature-volume
            "mejs.mute-toggle": "Uključi/isključi zvuk",
            "mejs.volume-help-text": "Koristi strelice gore/dolje za pojačavanje ili stišavanje.",
            "mejs.unmute": "Uključi zvuk",
            "mejs.mute": "Isključi zvuk",
            "mejs.volume-slider": "Pokazivač razine zvuka",

            // mep-player
            "mejs.video-player": "Video reprodukcija",
            "mejs.audio-player": "Audio reprodukcija",

            // mep-feature-ads
            "mejs.ad-skip": "Preskoči oglas",
            "mejs.ad-skip-info": ["Preskoči za 1 sekundu", "Preskoči za %1 sekundi"],

            // mep-feature-sourcechooser
            "mejs.source-chooser": "Odabir izvora"
        };
    }
}(mejs.i18n.locale.strings));
