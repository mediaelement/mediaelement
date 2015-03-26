/**
 * @file
 * Configure grunt concat
 */

module.exports = {
  me: {
    src: [
      'src/js/me-header.js',
      'src/js/me-namespace.js',
      'src/js/me-utility.js',
      'src/js/me-plugindetector.js',
      'src/js/me-featuredetection.js',
      'src/js/me-mediaelements.js',
      'src/js/me-shim.js'
    ],
    dest: 'local-build/mediaelement.base.js'
  },
  mei18n: {
    src: [
      'src/js/me-header.js',
      'src/js/me-namespace.js',
      'src/js/me-utility.js',
      'src/js/me-plugindetector.js',
      'src/js/me-featuredetection.js',
      'src/js/me-mediaelements.js',
      'src/js/i18n/me-i18n.js',
      'src/js/i18n/me-shim.js'
        // Bug #1263
        //'src/js/i18n/me-i18n-locale-de.js',
        //'src/js/i18n/me-i18n-locale-es.js',
        //'src/js/i18n/me-i18n-locale-fr.js',
        //'src/js/i18n/me-i18n-locale-it.js',
        //'src/js/i18n/me-i18n-locale-ja.js',
        //'src/js/i18n/me-i18n-locale-ko.js',
        //'src/js/i18n/me-i18n-locale-pt.js',
        //'src/js/i18n/me-i18n-locale-zh-cn.js',
        //'src/js/i18n/me-i18n-locale-zh.js'
    ],
    dest: 'local-build/mediaelement.base.i18n.js'
  },
  meplayer: {
    src: [
      'src/js/mep-header.js',
      'src/js/mep-library.js',
      'src/js/mep-player.js',
      'src/js/mep-feature-playpause.js',
      'src/js/mep-feature-contextmenu.js',
      'src/js/mep-feature-progress.js',
      'src/js/mep-feature-time.js',
      'src/js/mep-feature-volume.js',
      'src/js/mep-feature-fullscreen.js'
      //'src/js/mep-feature-ads-vast.js',
      //'src/js/mep-feature-ads.js',
      //'src/js/mep-feature-backlight.js',
      //'src/js/mep-feature-endedhtml.js',
      //'src/js/mep-feature-googleanalytics.js',
      //'src/js/mep-feature-loop.js',
      //'src/js/mep-feature-playlist.js',
      //'src/js/mep-feature-postroll.js'
      //'src/js/mep-feature-sourcechooser.js',
      //'src/js/mep-feature-speed.js',
      //'src/js/mep-feature-stop.js',
      //'src/js/mep-feature-tracks.js',
      //'src/js/mep-feature-skipback.js',
      //'src/js/mep-feature-universalgoogleanalytics.js',
      //'src/js/mep-feature-visualcontrols.js',
    ],
    dest: 'local-build/mediaelement.player.js'
  },  
  meplayeri18n: {
    src: [
      'src/js/mep-header.js',
      'src/js/mep-library.js',
      'src/js/i18n/mep-player.js',
      'src/js/i18n/mep-feature-contextmenu.js',
      'src/js/i18n/mep-feature-fullscreen.js',
      'src/js/i18n/mep-feature-playpause.js',
      'src/js/i18n/mep-feature-progress.js',
      'src/js/mep-feature-time.js',
      'src/js/i18n/mep-feature-volume.js'
      //'src/js/i18n/mep-feature-postroll.js'
      //'src/js/i18n/mep-feature-skipback.js',
      //'src/js/i18n/mep-feature-tracks.js',
      //'src/js/mep-feature-ads-vast.js',
      //'src/js/mep-feature-ads.js',
      //'src/js/mep-feature-backlight.js',
      //'src/js/mep-feature-endedhtml.js',
      //'src/js/mep-feature-googleanalytics.js',
      //'src/js/mep-feature-loop.js',
      //'src/js/mep-feature-playlist.js',
      //'src/js/mep-feature-sourcechooser.js',
      //'src/js/mep-feature-speed.js',
      //'src/js/mep-feature-stop.js',
      //'src/js/mep-feature-universalgoogleanalytics.js',
      //'src/js/mep-feature-visualcontrols.js',
    ],
    dest: 'local-build/mediaelement.player.i18n.js'
  },
  bundle: {
    src: [
      'local-build/mediaelement.base.js',
      'local-build/mediaelement.player.js'
    ],
    dest: 'local-build/mediaelement.js'
  },
  bundlei18n: {
    src: [
      'local-build/mediaelement.base.i18n.js',
      'local-build/mediaelement.player.i18n.js'
    ],
    dest: 'local-build/mediaelement.i18n.js'
  }
};
