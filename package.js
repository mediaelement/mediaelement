Package.describe({
    name: 'johndyer:mediaelement',
    summary: '*Official* MediaElement.js: <video> and <audio> made easy. One file. Any browser. Same UI.',
    version: '3.0.0',
    git: 'https://github.com/johndyer/mediaelement'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');

    api.use('jquery', 'client');

    api.addFiles('build/lang/ca.js', 'client');
    api.addFiles('build/lang/cs.js', 'client');
    api.addFiles('build/lang/de.js', 'client');
    api.addFiles('build/lang/es.js', 'client');
    api.addFiles('build/lang/fr.js', 'client');
    api.addFiles('build/lang/hu.js', 'client');
    api.addFiles('build/lang/it.js', 'client');
    api.addFiles('build/lang/ja.js', 'client');
    api.addFiles('build/lang/ko.js', 'client');
    api.addFiles('build/lang/nl.js', 'client');
    api.addFiles('build/lang/pl.js', 'client');
    api.addFiles('build/lang/pt.js', 'client');
    api.addFiles('build/lang/pt-br.js', 'client');
    api.addFiles('build/lang/ro.js', 'client');
    api.addFiles('build/lang/ru.js', 'client');
    api.addFiles('build/lang/sk.js', 'client');
    api.addFiles('build/lang/zh.js', 'client');
    api.addFiles('build/lang/zh-cn.js', 'client');

    api.addAssets('build/mejs-controls.svg', 'client');
    api.addAssets('build/mejs-controls.png', 'client');

    api.addAssets('build/mediaelement-flash-audio.swf', 'client');
    api.addAssets('build/mediaelement-flash-audio-ogg.swf', 'client');
    api.addAssets('build/mediaelement-flash-video.swf', 'client');
    api.addAssets('build/mediaelement-flash-video-hls.swf', 'client');
    api.addAssets('build/mediaelement-flash-video-mdash.swf', 'client');

    api.addFiles('build/mediaelement.js', 'client');
    api.addFiles('build/mediaelement-and-player.js', 'client');
    api.addFiles('build/mediaelementplayer.js', 'client');
    api.addFiles('build/mediaelementplayer.css', 'client');
    api.addFiles('build/mediaelementplayer-legacy.css', 'client');

});