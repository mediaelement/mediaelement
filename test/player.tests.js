'use strict';

describe('MediaElement Player - Test Results', function () {

	var
		videoTag,
		container,
		id,
		player,
		setMedia = function (player, src) {
			player.pause();
			player.setSrc(src.replace('&amp;', '&'));
			player.load();
		};

	beforeEach(function () {
		videoTag = document.getElementById('player1');
		player = new MediaElementPlayer('player1', {
			pluginPath: '../build/',
			playText: 'Play track',
			pauseText: 'Pause track',
			stopText: 'Stop track',
			fullscreenText: 'Fullscreen video',
			muteText: 'Mute volume',
			unmuteText: 'Unmute volume',
			success: function () {
				container = document.getElementsByClassName('mejs__container')[0];
				id = container.id;
				container.setAttribute('lang', mejs.i18n.language());
			}
		});
	});

	afterEach(function () {
		player.remove();
	});

	it('Preserve `video` tag once player is created', function () {
		expect(videoTag).to.not.equal(null);
		expect(videoTag.tagName.toLowerCase()).to.equal('video');
	});

	it('Create a `fake` node that mimics all media events/properties/methods', function () {
		expect(player.media.tagName.toLowerCase()).to.equal('mediaelementwrapper');
		expect(player.paused).to.not.equal(null);
	});

	// it('Toggle `fullscreen` mode when clicking button or using keyboard', function () {
	// 	container.find('.mejs__fullscreen-button>button').trigger('click');
	// 	expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(true);
	//
	// 	var e = $.Event('keydown');
	// 	e.which = 27;
	// 	e.keyCode = 27;
	// 	container.querySelector('.mejs__fullscreen-button>button').trigger(e);
	// 	expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(false);
	// });

	it('Should set custom play text', function () {
		expect(container.querySelector('.mejs__play>button').title).to.equal('Play track');
	});

	it('Should set custom pause text', function (done) {
		player.play();
		var listener = function () {
			expect(container.querySelector('.mejs__pause>button').title).to.equal('Pause track');
			player.media.removeEventListener('play', listener);
			setTimeout(function() {
				player.pause();
				done();
			}, 250);
		};
		player.media.addEventListener('play', listener);

	});

	// it('Should set custom fullscreen text', function () {
	// 	expect(container.querySelector('.mejs__fullscreen-button>button').getAttribute('title')).to.equal('Fullscreen video');
	// });
	//
	it('Should set custom mute text', function () {
		expect(container.querySelector('.mejs__mute>button').title).to.equal('Mute volume');
	});

	it('Should set custom unmute text', function (done) {
		container.querySelector('.mejs__mute>button').click();
		var listener = function () {
			expect(container.querySelector('.mejs__unmute>button').title).to.equal('Unmute volume');
			player.media.removeEventListener('volumechange', listener);
			done();
		};
		player.media.addEventListener('volumechange', listener);
	});

	it('Can handle different media types properly (i.e., HLS)', function () {
		setMedia(player, 'http://www.streambox.fr/playlists/test_001/stream.m3u8');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://www.streambox.fr/playlists/test_001/stream.m3u8');
		setMedia(player, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
	});
});