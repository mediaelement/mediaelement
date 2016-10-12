Package.describe({
    name: 'johndyer:mediaelementjs',
    summary: 'HTML5 <audio> or <video> player with shims that mimic the HTML5 MediaElement API, enabling a consistent UI in all browsers.',
    version: '3.0-alpha',
    git: 'https://github.com/johndyer/mediaelement'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');

    api.use('jquery', 'client');

    api.addFiles('build/me-i18n-locale-ca.js', 'client');
    api.addFiles('build/me-i18n-locale-cs.js', 'client');
    api.addFiles('build/me-i18n-locale-de.js', 'client');
    api.addFiles('build/me-i18n-locale-en.js', 'client');
    api.addFiles('build/me-i18n-locale-es.js', 'client');
    api.addFiles('build/me-i18n-locale-fr.js', 'client');
    api.addFiles('build/me-i18n-locale-hu.js', 'client');
    api.addFiles('build/me-i18n-locale-it.js', 'client');
    api.addFiles('build/me-i18n-locale-ja.js', 'client');
    api.addFiles('build/me-i18n-locale-ko.js', 'client');
    api.addFiles('build/me-i18n-locale-nl.js', 'client');
    api.addFiles('build/me-i18n-locale-pl.js', 'client');
    api.addFiles('build/me-i18n-locale-pt.js', 'client');
    api.addFiles('build/me-i18n-locale-pt-br.js', 'client');
    api.addFiles('build/me-i18n-locale-ro.js', 'client');
    api.addFiles('build/me-i18n-locale-ru.js', 'client');
    api.addFiles('build/me-i18n-locale-sk.js', 'client');
    api.addFiles('build/me-i18n-locale-zh.js', 'client');
    api.addFiles('build/me-i18n-locale-zh-cn.js', 'client');

    api.addFiles('build/background.png', 'client');
    api.addFiles('build/bigplay.fw.png', 'client');
    api.addFiles('build/bigplay.png', 'client');
    api.addFiles('build/bigplay.svg', 'client');
    api.addFiles('build/controls.fw.png', 'client');
    api.addFiles('build/controls.png', 'client');
    api.addFiles('build/controls.svg', 'client');
    api.addFiles('build/jumpforward.png', 'client');
    api.addFiles('build/loading.gif', 'client');
    api.addFiles('build/skipback.png', 'client');

    api.addFiles('build/mediaelement-flash-audio.swf', 'client');
    api.addFiles('build/mediaelement-flash-audio-ogg.swf', 'client');
    api.addFiles('build/mediaelement-flash-video.swf', 'client');
    api.addFiles('build/mediaelement-flash-video-hls.swf', 'client');
    api.addFiles('build/mediaelement-flash-video-mdash.swf', 'client');

    api.addFiles('build/mediaelement.js', 'client');
    api.addFiles('build/mediaelement-and-player.js', 'client');
    api.addFiles('build/mediaelementplayer.js', 'client');
    api.addFiles('build/mediaelementplayer.css', 'client');

});