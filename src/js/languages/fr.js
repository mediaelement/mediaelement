'use strict';

/*!
 * This is a `i18n` language object.
 *
 * French
 *
 * @author
 *   Luc Poupard (Twitter: @klohFR)
 *   Jalios (Twitter: @Jalios)
 *   Sascha Greuel (Twitter: @SoftCreatR)
 *
 * @see core/i18n.js
 */
(function (exports) {
	if (exports.fr === undefined) {
		exports.fr = {
			"mejs.plural-form": 2,

			// renderers/flash.js
			// "mejs.install-flash": "You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/",

			// features/contextmenu.js
			"mejs.fullscreen-off": "Quitter le mode plein écran",
			"mejs.fullscreen-on": "Afficher en plein écran",
			"mejs.download-video": "Télécharger la vidéo",

			// features/fullscreen.js
			"mejs.fullscreen": "Plein écran",

			// features/jumpforward.js
			"mejs.time-jump-forward": "Avancer de %1 secondes",

			// features/loop.js
			//"mejs.loop": "Toggle Loop",

			// features/playpause.js
			"mejs.play": "Lecture",
			"mejs.pause": "Pause",

			// features/postroll.js
			"mejs.close": "Fermer",

			// features/progress.js
			"mejs.time-slider": "Curseur temporel",
			"mejs.time-help-text": "Utilisez les flèches Gauche/Droite du clavier pour avancer d'une seconde, les flèches Haut/Bas pour avancer de 10 secondes.",

			// features/skipback.js
			"mejs.time-skip-back": "Reculer de %1 secondes",

			// features/tracks.js
			"mejs.captions-subtitles": "Sous-titres",
			// "mejs.captions-chapters": "Chapters",
			"mejs.none": "Aucun",

			// features/volume.js
			"mejs.mute-toggle": "Activer/désactiver le son",
			"mejs.volume-help-text": "Utilisez les flèches Haut/Bas du clavier pour augmenter ou diminuer le volume.",
			"mejs.unmute": "Activer le son",
			"mejs.mute": "Désactiver le son",
			"mejs.volume-slider": "Volume",

			// core/player.js
			"mejs.video-player": "Lecteur Vidéo",
			"mejs.audio-player": "Lecteur Audio",

			// features/ads.js
			"mejs.ad-skip": "Passer la publicité",
			"mejs.ad-skip-info": "Passer la publicité dans %1 secondes",

			// features/sourcechooser.js
			"mejs.source-chooser": "Sélecteur de média"

			// features/stop.js
			//"mejs.stop": "Stop",

			//features/speed.js
			//"mejs.speed-rate" : "Speed Rate",

			//features/progress.js
			//"mejs.live-broadcast" : "Live Broadcast",

			// features/tracks.js
			// "mejs.afrikaans": "Afrikaans",
			// "mejs.albanian": "Albanian",
			// "mejs.arabic": "Arabic",
			// "mejs.belarusian": "Belarusian",
			// "mejs.bulgarian": "Bulgarian",
			// "mejs.catalan": "Catalan",
			// "mejs.chinese": "Chinese",
			// "mejs.chinese-simplified": "Chinese (Simplified)",
			// "mejs.chinese-traditional": "Chinese (Traditional)",
			// "mejs.croatian": "Croatian",
			// "mejs.czech": "Czech",
			// "mejs.danish": "Danish",
			// "mejs.dutch": "Dutch",
			// "mejs.english": "English",
			// "mejs.estonian": "Estonian",
			// "mejs.filipino": "Filipino",
			// "mejs.finnish": "Finnish",
			// "mejs.french": "French",
			// "mejs.galician": "Galician",
			// "mejs.german": "German",
			// "mejs.greek": "Greek",
			// "mejs.haitian-creole": "Haitian Creole",
			// "mejs.hebrew": "Hebrew",
			// "mejs.hindi": "Hindi",
			// "mejs.hungarian": "Hungarian",
			// "mejs.icelandic": "Icelandic",
			// "mejs.indonesian": "Indonesian",
			// "mejs.irish": "Irish",
			// "mejs.italian": "Italian",
			// "mejs.japanese": "Japanese",
			// "mejs.korean": "Korean",
			// "mejs.latvian": "Latvian",
			// "mejs.lithuanian": "Lithuanian",
			// "mejs.macedonian": "Macedonian",
			// "mejs.malay": "Malay",
			// "mejs.maltese": "Maltese",
			// "mejs.norwegian": "Norwegian",
			// "mejs.persian": "Persian",
			// "mejs.polish": "Polish",
			// "mejs.portuguese": "Portuguese",
			// "mejs.romanian": "Romanian",
			// "mejs.russian": "Russian",
			// "mejs.serbian": "Serbian",
			// "mejs.slovak": "Slovak",
			// "mejs.slovenian": "Slovenian",
			// "mejs.spanish": "Spanish",
			// "mejs.swahili": "Swahili",
			// "mejs.swedish": "Swedish",
			// "mejs.tagalog": "Tagalog",
			// "mejs.thai": "Thai",
			// "mejs.turkish": "Turkish",
			// "mejs.ukrainian": "Ukrainian",
			// "mejs.vietnamese": "Vietnamese",
			// "mejs.welsh": "Welsh",
			// "mejs.yiddish": "Yiddish"
		};
	}
})(mejs.i18n);