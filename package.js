Package.describe({
    name: 'johndyer:mediaelementjs',
    summary: 'HTML5 <audio> or <video> player with shims that mimic the HTML5 MediaElement API, enabling a consistent UI in all browsers.',
    version: '3.0-alpha',
    git: 'https://github.com/johndyer/mediaelement'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');

    api.use('jquery', 'client');

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