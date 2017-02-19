'use strict';

describe('MediaElement Player - Test Results', () => {

	let
		videoTag,
		container,
		id,
		player,
		setMedia = function(player, src) {
			player.pause();
			player.setSrc(src.replace('&amp;', '&'));
			player.load();
		};

	beforeEach(() => {
		videoTag = $('video#player1');
		player = new MediaElementPlayer(videoTag, {
			pluginPath: '../build/',
			playText: 'Play track',
			pauseText: 'Pause track',
			stopText: 'Stop track',
			fullscreenText: 'Fullscreen video',
			muteText: 'Mute volume',
			unmuteText: 'Unmute volume',
			success: (media) => {
				container = $(media).closest('.media-wrapper').children('div:first');
				id = container.attr('id');
				container.attr('lang', mejs.i18n.language());
			}
		});
	});

	afterEach(() => {
		player.remove();
	});

	it('Preserve `video` tag once player is created', () => {
		expect(videoTag).to.not.equal(null);
		expect(videoTag.get(0).tagName.toLowerCase()).to.equal('video');
	});

	it('Create a `fake` node that mimics all media events/properties/methods', () => {
		expect(player.media.tagName.toLowerCase()).to.equal('mediaelementwrapper');
		expect(player.paused).to.not.equal(null);
	});

	it('Toggle `fullscreen` mode when clicking button or using keyboard', () => {
		container.find('.mejs__fullscreen-button>button').trigger('click');
		expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(true);

		let e = $.Event('keydown');
		e.which = 27;
		e.keyCode = 27;
		container.find('.mejs__fullscreen-button>button').trigger(e);
		expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(false);
	});

	it('Can handle different media types properly (i.e., HLS)', () => {
		setMedia(player, 'http://www.streambox.fr/playlists/test_001/stream.m3u8');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://www.streambox.fr/playlists/test_001/stream.m3u8');
		setMedia(player, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
	});

	it('Should set custom play text', () => {
		expect(container.find('.mejs__play>button').attr('title')).to.equal('Play track');
	});

	it('Should set custom pause text', (done) => {
		player.play();
		player.media.addEventListener('play', () => {
			expect(container.find('.mejs__pause>button').attr('title')).to.equal('Pause track');
			done();
		}, false);
	});

	it('Should set custom fullscreen text', () => {
		expect(container.find('.mejs__fullscreen-button>button').attr('title')).to.equal('Fullscreen video');
	});

	it('Should set custom mute text', () => {
		expect(container.find('.mejs__mute>button').attr('title')).to.equal('Mute volume');
	});

	it('Should set custom unmute text', (done) => {
		container.find('.mejs__mute>button').click();
		let listener = () => {
			expect(container.find('.mejs__unmute>button').attr('title')).to.equal('Unmute volume');
			player.media.removeEventListener('volumechange', listener, false);
			done();
		};
		player.media.addEventListener('volumechange', listener, false);
	});
});