/*!
 * This is a i18n.locale language object.
 *
 * English; This can serve as a template for other languages to translate
 *
 * @author
 *   TBD
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
;(function(exports, undefined) {

    "use strict";

    if (typeof exports.en === 'undefined') {
        exports.en = {
            // me-shim
            "Download File": "Download File",

            // mep-feature-contextmenu
            "Turn off Fullscreen": "Turn off Fullscreen",
            "Go Fullscreen" : "Go Fullscreen",
            // Duplicated from mep-feature-volume
            // "Unmute" : "Unmute",
            // "Mute" : "Mute",
            "Download Video" : "Download Video",

            // mep-feature-fullscreen
            "Fullscreen" : "Fullscreen",

            // mep-feature-jumpforward
            "Jump forward %1 seconds": "Jump forward %1 seconds",

            // mep-feature-playpause
            "Play": "Play",
            "Pause": "Pause",

            // mep-feature-postroll
            "Close" : "Close",

            // mep-feature-progress
            "Time Slider": "Time Slider",
            "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.": "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.",

            // mep-feature-skipback
            "Skip back %1 seconds": "Skip back %1 seconds",

            // mep-feature-tracks
            "Captions/Subtitles" : "Captions/Subtitles",
            "None" : "None",

            // mep-feature-volume
            "Mute Toggle" : "Mute Toggle",
            "Use Up/Down Arrow keys to increase or decrease volume.": "Use Up/Down Arrow keys to increase or decrease volume.",
            "Unmute" : "Unmute",
            "Mute" : "Mute",
            "Volume Slider": "Volume Slider",

            // mep-player
            "Video Player": "Video Player",
            "Audio Player": "Audio Player"
        };
    }

}(mejs.i18n.locale.strings));
