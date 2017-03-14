Package.describe({
    name: 'johndyer:mediaelement',
    summary: '*Official* MediaElement.js: <video> and <audio> made easy. One file. Any browser. Same UI.',
    version: '3.2.4',
    git: 'https://github.com/johndyer/mediaelement'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.use('jquery', 'client');

    var assets = [
        'build/lang/ca.js',
        'build/lang/cs.js',
        'build/lang/de.js',
        'build/lang/es.js',
        'build/lang/fr.js',
        'build/lang/hu.js',
        'build/lang/it.js',
        'build/lang/ja.js',
        'build/lang/ko.js',
        'build/lang/nl.js',
        'build/lang/pl.js',
        'build/lang/pt.js',
        'build/lang/pt-br.js',
        'build/lang/ro.js',
        'build/lang/ru.js',
        'build/lang/sk.js',
        'build/lang/zh.js',
        'build/lang/zh-cn.js',
        'build/renderers/dailymotion.js',
        'build/renderers/facebook.js',
        'build/renderers/soundcloud.js',
        'build/renderers/twitch.js',
        'build/renderers/vimeo.js',
        'build/mejs-controls.svg',
        'build/mejs-controls.png',
        'build/mediaelement-flash-audio.swf',
        'build/mediaelement-flash-audio-ogg.swf',
        'build/mediaelement-flash-video.swf',
        'build/mediaelement-flash-video-hls.swf',
        'build/mediaelement-flash-video-mdash.swf',
    ];

    if (api.addAssets) {
        api.addAssets(assets, 'client');
    } else {
        api.addFiles(assets, 'client', { isAsset: true });
    }

    api.addFiles([
        'build/mediaelement.js',
        'build/mediaelement-and-player.js',
        'build/mediaelementplayer.js',
        'build/mediaelementplayer.css',
        'build/mediaelementplayer-legacy.css'
    ], 'client');

});