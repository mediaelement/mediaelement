const elements = [// all bundle
'build/mediaelement-and-player.js':
    'src/js/utils/polyfill.js',
    'src/js/core/mediaelement.js',
    'src/js/core/i18n.js',
    'src/js/languages/en.js',
    'src/js/renderers/html5.js',
    'src/js/renderers/flash.js',
].concat(rendererSources || [
    'src/js/renderers/dash.js',
    'src/js/renderers/flv.js',
    'src/js/renderers/hls.js',
    'src/js/renderers/youtube.js',
]).concat([
    'src/js/player.js',
    'src/js/player/library.js',
    'src/js/player/default.js',
    'src/js/features/fullscreen.js',
    'src/js/features/playpause.js',
    'src/js/features/progress.js',
    'src/js/features/time.js',
    'src/js/features/tracks.js',
    'src/js/features/volume.js'
];