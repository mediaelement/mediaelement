/*!
 * This is a i18n.locale language object.
 *
 * Arabic
 *
 * @author
 *   rotti3
 *   Sascha Greuel (Twitter: @SoftCreatR)
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
(function (exports) {
    "use strict";

    if (exports.ar === undefined) {
        exports.ar = {
            "mejs.plural-form": 1,

            // me-shim
            "mejs.download-file": "تنزيل الملفات",

            // mep-feature-contextmenu
            "mejs.fullscreen-off": "غلق الشاشة الكاملة",
            "mejs.fullscreen-on": "عرض الشاشة الكاملة",
            "mejs.download-video": "تنويل الفيديو",

            // mep-feature-fullscreen
            "mejs.fullscreen": "شاشة كاملة",

            // mep-feature-jumpforward
            "mejs.time-jump-forward": ["قفز ثانية للأمام", "قفز للأمام %1 ثواني"],

            // mep-feature-playpause
            "mejs.play": "تشغيل",
            "mejs.pause": "توقيف",

            // mep-feature-postroll
            "mejs.close": "غلق",

            // mep-feature-progress
            "mejs.time-slider": "التحكم بتوقيت العرض",
            "mejs.time-help-text": "إستخدم زر الأيمين والأيسر للقفز ثانية, إستخدم زر الأعلى والأسفل للقفز 10 ثواني.",

            // mep-feature-skipback
            "mejs.time-skip-back": ["الرجوع للخلف 1 ثانية", "الرجوع للخلف %1 ثواني"],

            // mep-feature-tracks
            "mejs.captions-subtitles": "العنواين/عنواين فرعية",
            "mejs.none": "None",

            // mep-feature-volume
            "mejs.mute-toggle": "التحكم بالصمت",
            "mejs.volume-help-text": "إستخدم زر الأعلى والأسفل للتحكم بالصوت",
            "mejs.unmute": "إلغاء الصمت",
            "mejs.mute": "صامت",
            "mejs.volume-slider": "التحكم بالصوت",

            // mep-player
            "mejs.video-player": "مشغل الفيديو",
            "mejs.audio-player": "مشغل لاصوت",

            // mep-feature-ads
            "mejs.ad-skip": "تجاوز الإعلان",
            "mejs.ad-skip-info": ["تجاهل ثانية واحدة", "تجاهل لمدة %1 ثواني"],

            // mep-feature-sourcechooser
            "mejs.source-chooser": "إختيار المصدر"
        };
    }
}(mejs.i18n.locale.strings));
