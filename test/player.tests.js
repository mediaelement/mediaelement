'use strict';

describe('MediaElement Player - Test Results', function () {

	var
		videoTag,
		container,
		id,
		player,
		setMedia = function(player, src) {
			player.pause();
			player.setSrc(src.replace('&amp;', '&'));
			player.load();
		}
	;

	beforeEach(function() {

		videoTag = $('video#player1');
		player = new MediaElementPlayer(videoTag, {
			pluginPath: '../build/',
			success: function (media) {
				container = $(media).closest('.media-wrapper').children('div:first');
				id = container.attr('id');
				container.attr('lang', mejs.i18n.language());
			}
		});
	});

	afterEach(function() {
		player.remove();
	});

	it('Preserve `video` tag once player is created', function () {
		expect(videoTag).to.not.equal(null);
		expect(videoTag.get(0).tagName.toLowerCase()).to.equal('video');
	});

	it('Create a `fake` node that mimics all media events/properties/methods', function () {
		expect(player.media.tagName.toLowerCase()).to.equal('mediaelementwrapper');
		expect(player.paused).to.not.equal(null);
	});

	it ('Toggle `fullscreen` mode when clicking button or using keyboard', function() {
		container.find('.mejs__fullscreen-button>button').trigger('click');
		expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(true);

		var e = $.Event('keydown');
		e.which = 27;
		e.keyCode = 27;
		container.find('.mejs__fullscreen-button>button').trigger(e);
		expect($(document.documentElement).hasClass('mejs__fullscreen')).to.equal(false);
	});

	it('Can handle different media types properly (i.e., HLS)', function () {
		setMedia(player, 'http://www.streambox.fr/playlists/test_001/stream.m3u8');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://www.streambox.fr/playlists/test_001/stream.m3u8');
		setMedia(player, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
		expect(player.media.originalNode.getAttribute('src')).to.equal('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
	});
});