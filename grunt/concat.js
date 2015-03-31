/**
 * @file
 * Configure grunt concat
 */

/* Configure player vars before task is initiated to prevent the need
 for changing the features of used in standard & i18n separately.
 */
var me = {};

me.player = {
  universal: [
    'mep-library.js'
  ],
  variable: [
    /* Switch source for i18n support*/
    'mep-player.js',
    'mep-feature-playpause.js',
    'mep-feature-progress.js',
    'mep-feature-time.js',
    'mep-feature-volume.js',
    'mep-feature-fullscreen.js',
    'mep-feature-contextmenu.js'
      //'mep-feature-postroll.js',
      //'mep-feature-skipback.js',
      //'mep-feature-tracks.js'
  ],
  features: [
    //'mep-feature-ads.js',
    //'mep-feature-ads-vast.js',
    //'mep-feature-backlight.js',
    //'mep-feature-endedhtml.js',
    //'mep-feature-googleanalytics.js',
    //'mep-feature-loop.js',
    //'mep-feature-playlist.js',
    //'mep-feature-sourcechooser.js',
    //'mep-feature-speed.js',
    //'mep-feature-stop.js',
    //'mep-feature-universalgoogleanalytics.js',
    //'mep-feature-visualcontrols.js',
  ]
};

/* If a language file is present i18n sources will be used in the script. */
me.languages = [
  //'me-i18n-locale-de.js',
  //'me-i18n-locale-es.js',
  //'me-i18n-locale-fr.js',
  //'me-i18n-locale-it.js',
  //'me-i18n-locale-ja.js',
  //'me-i18n-locale-ko.js',
  //'me-i18n-locale-pt.js',
  //'me-i18n-locale-zh-cn.js',
  //'me-i18n-locale-zh.js'
];

me.base = {
  universal: [
    'me-header.js',
    'me-namespace.js',
    'me-utility.js',
    'me-plugindetector.js',
    'me-featuredetection.js',
    'me-mediaelements.js'
    // me-shim.js automatically appended.
  ]
};

/* 
 * DON'T EDIT BELOW THIS LINE
 */
me.i18n = me.languages.length ? 'src/js/i18n/' : 'src/js/';

me.src = function (array, path) {
  a = [];
  for (var i in array) {
    var script = path + array[i];
    a.push(script);
  }
  return a;
};

me.base.scripts = function (path) {
  var a = [],
    u = me.src(me.base.universal, 'src/js/'),
    l = me.languages,
    shim = me.src(['me-shim.js'], path);

  if (l.length) {
    l.unshift('me-i18n.js');
    l = me.src(l, path);
  }

  return a.concat(u, l, shim);
};

me.player.scripts = function (path) {
  var a = [],
    u = me.src(me.player.universal, 'src/js/'),
    b = me.src(me.player.variable, path),
    f = me.src(me.player.features, 'src/js/');

  return a.concat(u, b, f);
};

me.base = me.base.scripts(me.i18n);
me.player = me.player.scripts(me.i18n);

module.exports = {
  base: {
    src: me.base,
    dest: 'local-build/mediaelement.base.js'
  },
  player: {
    src: me.player,
    dest: 'local-build/mediaelement.player.js'
  },
  bundle: {
    src: [
      'local-build/mediaelement.base.js',
      'local-build/mediaelement.player.js'
    ],
    dest: 'local-build/mediaelement.js'
  }
};
