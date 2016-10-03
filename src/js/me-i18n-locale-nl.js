/*!
 * This is a i18n.locale language object.
 *
 * Dutch translation
 *
 * @author
 *   Leonard de Ruijter, Twitter: @LeonarddR
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
;(function(exports, undefined) {

    "use strict";

    if (typeof exports.nl === 'undefined') {
        exports.nl = {
            // me-shim
            'mejs.download-file': 'Bestand downloaden',

            // mep-feature-contextmenu
            'mejs.fullscreen-off': 'Volledig scherm uitschakelen',
            'mejs.fullscreen-on' : 'Volledig scherm',
            // Duplicated from mep-feature-volume
            // 'mejs.unmute' : 'Dempen opheffen',
            // 'mejs.mute' : 'Dempen',
            'mejs.download-video' : 'Video downloaden',

            // mep-feature-fullscreen
            'mejs.fullscreen' : 'Volledig scherm',

            // mep-feature-jumpforward
            'mejs.time-jump-forward': '%1 seconden vooruit springen',

            // mep-feature-playpause
            'mejs.play': 'Afspelen',
            'mejs.pause': 'Pauzeren',

            // mep-feature-postroll
            'mejs.close' : 'Sluiten',

            // mep-feature-progress
            'mejs.time-slider': 'Tijd schuifbalk',
            'mejs.time-help-text': 'Gebruik pijl naar links/rechts om per seconde te springen, pijl omhoog/omlaag om per tien seconden te springen.',

            // mep-feature-skipback
            'mejs.time-skip-back': '%1 seconden terug springen',

            // mep-feature-tracks
            'mejs.captions-subtitles' : 'Bijschriften/ondertiteling',
            'mejs.none' : 'Geen',

            // mep-feature-volume
            'mejs.mute-toggle' : 'Dempen schakelen',
            'mejs.volume-help-text': 'Gebruik pijl omhoog/omlaag om het volume te verhogen/verlagen.',
            'mejs.unmute' : 'Dempen opheffen',
            'mejs.mute' : 'Dempen',
            'mejs.volume-slider': 'Volume schuifbalk',

            // mep-player
            'mejs.video-player': 'Videospeler',
            'mejs.audio-player': 'Audiospeler',
            	
            // mep-feature-ads
            'mejs.ad-skip': 'Ad overslaan',
            'mejs.ad-skip-info': 'Overslaan in %1 seconden',

            'mejs.source-chooser': 'Bronkiezer'
        };
    }

}(mejs.i18n.locale.strings));
