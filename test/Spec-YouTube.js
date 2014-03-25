
/// NOTE 1: Currently these tests run most reliably in Firefox due to this
/// outstanding Chrome bug: https://code.google.com/p/chromium/issues/detail?id=234779

/// NOTE 2: It is best to run these a few specs at a time, due to issues with 
/// concurrent network requests and those requests not getting cleanly terminated
/// when the originating elements have been removed from the DOM. Refresh the page 
/// for each group of ~3 specs.

describe('YouTube plugin', function() {
	var MAX_WAIT = 10000;

	var player1 = {id: 'player1', name: 'YouTube - IFrame', player: null, element: null, domElem: null};
	var player2 = {id: 'player2', name: 'YouTube - IFrame (HTML5)', player: null, element: null, domElem: null};
	var player3 = {id: 'player3', name: 'YouTube - Flash', player: null, element: null, domElem: null};
	var player4 = {id: 'player4', name: 'Flash', player: null, element: null, domElem: null};

	// use custom init for optimization purposes instead of
	// usual beforeEach()
	var init = function(id, success) {
		switch(id) {
			case 'player1':
				// YouTube plugin -> IFrame API
				$('body').append('<video width="640" height="480" id="player1"' +
					'<source type="video/youtube" src="https://www.youtube.com/watch?v=yyWWXSwtPP0"></source>' +
					'</video>');
				player1.player = new MediaElementPlayer('#player1', {
					protocol: 'https://',
					plugins: ['youtube'],
					features: ['playpause', 'progress', 'current'],
					youTubeIframeFirst: true,
					autoRewind: false,
					success: function(mediaElement, domObject) {
						player1.element = mediaElement;
						player1.domElem = domObject;

						if (typeof success === 'function') {
							success();
						}
					}
				});
			break;
			case 'player2':
				// YouTube plugin -> IFrame API -> HTML5 preferred
				$('body').append('<video width="640" height="480" id="player2"' +
					'<source type="video/youtube" src="https://www.youtube.com/watch?v=yyWWXSwtPP0"></source>' +
					'</video>');
				player2.player = new MediaElementPlayer('#player2', {
					protocol: 'https://',
					plugins: ['youtube'],
					features: ['playpause', 'progress', 'current'],
					youTubeIframeFirst: true,
					youTubePluginVars: {
						html5: 1
					},
					autoRewind: false,
					success: function(mediaElement, domObject) {
						player2.element = mediaElement;
						player2.domElem = domObject;

						if (typeof success === 'function') {
							success();
						}
					}
				});
			break;
			case 'player3':
				// YouTube plugin -> Flash API
				$('body').append('<video width="640" height="480" id="player3"' +
					'<source type="video/youtube" src="https://www.youtube.com/watch?v=yyWWXSwtPP0"></source>' +
					'</video>');
				player3.player = new MediaElementPlayer('#player3', {
					protocol: 'https://',
					plugins: ['youtube'],
					features: ['playpause', 'progress', 'current'],
					autoRewind: false,
					success: function(mediaElement, domObject) {
						player3.element = mediaElement;
						player3.domElem = domObject;

						if (typeof success === 'function') {
							success();
						}
					}
				});
			break;
			case 'player4':
				// Flash plugin
				$('body').append('<video width="640" height="480" id="player4"' +
					'<source type="video/youtube" src="https://www.youtube.com/watch?v=yyWWXSwtPP0"></source>' +
					'</video>');
				player4.player = new MediaElementPlayer('#player4', {
					protocol: 'https://',
					plugins: ['flash'],
					features: ['playpause', 'progress', 'current'],
					autoRewind: false,
					success: function(mediaElement, domObject) {
						player4.element = mediaElement;
						player4.domElem = domObject;

						if (typeof success === 'function') {
							success();
						}
					}
				});
			break;
		}
	};

	afterEach(function() {
		var removeFunc = function(p) {
			if (p.player !== null) {
				p.player.remove();

				var domElem = $('#' + p.id)[0];
				domElem.parentNode.removeChild(domElem);

				p.player = p.element = p.domElem = null;
			}
		}

		removeFunc(player1);
		removeFunc(player2);
		removeFunc(player3);
		removeFunc(player4);

		// attempt to stop any pending or incomplete network requests.
		// this doesn't seem to work well for requests originating from the YouTube
		// iframes since they have their own sandboxed window elements. See
		// NOTE 2 above for a workaround.
		window.stop();
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct state before playback begins: #name", function(done, p, name) {
		var canplay = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('canplay', function() {
					canplay = true;
				});
			});
		});

		waitsFor(function() {
			return canplay === true;
		}, "'canplay' event to be sent", MAX_WAIT);

		runs(function() {
			expect(p.player.media.paused).toBe(true);
			expect(p.player.media.ended).toBe(false);
			expect(p.player.media.readyState).toBe(p.player.media.HAVE_NOTHING);
			expect(p.player.media.error).toBeNull();
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct state after 'playing': #name", function(done, p, name) {
		var playing = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('playing', function() {
					playing = true;
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return playing === true;
		}, "playback to start", MAX_WAIT);

		runs(function() {
			expect(p.player.media.paused).toBe(false);
			expect(p.player.media.ended).toBe(false);
			expect(p.player.media.readyState).toBe(p.player.media.HAVE_FUTURE_DATA);
		});
	});
	
	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct state on 'pause' after playback starts: #name", function(done, p, name) {
		var paused = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('pause', function() {
					paused = true;
				});
				p.player.media.addEventListener('play', function() {
					p.player.pause();
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return paused === true;
		}, "player to pause", MAX_WAIT);

		runs(function() {
			expect(p.player.media.paused).toBe(true);
			expect(p.player.media.ended).toBe(false);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct state after 'ended': #name", function(done, p, name) {
		var ended = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('ended', function() {
					ended = true;
				});
				p.player.media.addEventListener('loadedmetadata', function() {
					p.player.setCurrentTime(p.player.media.duration-1);
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return ended === true;
		}, "playback to end", MAX_WAIT);

		runs(function() {
			expect(p.player.media.paused).toBe(false);
			expect(p.player.media.ended).toBe(true);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("fires 'loadedmetdata', 'play', 'playing' when playback starts for the first time: #name", function(done, p, name) {
		var playing = false;
		var callback = jasmine.createSpy('callback object');

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('loadedmetadata', callback);
				p.player.media.addEventListener('playing', function(e) {
					callback(e);
					playing = true;
				});
				p.player.media.addEventListener('play', callback);
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return playing === true;
		}, "playback to start", MAX_WAIT);

		runs(function() {
			expect(callback.calls.length).toBe(3);
			expect(callback.calls[0].args[0].type).toBe('loadedmetadata');
			expect(callback.calls[1].args[0].type).toBe('play');
			expect(callback.calls[2].args[0].type).toBe('playing');
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct `readyState` when 'loadedmetadata' event fires: #name", function(done, p, name) {
		var finished = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('loadedmetadata', function() {
					// check readyState here because it will change when playback
					// continues
					expect(p.player.media.readyState).toBe(p.player.media.HAVE_METADATA);
					finished = true;
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return finished === true;
		}, "test to finish when 'loadedmetadata' event fires", MAX_WAIT);
	});

	// cheat a bit and simulate buffering state -- not a real integration test

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("has correct state when 'buffering' starts during playback: #name", function(done, p, name) {
		init(p.id, function() {
			p.player.media.addEventListener('canplay', function() {

			});
			p.player.media.paused = false;
			mejs.YouTubeApi.handleStateChange(3, p.player, p.player.media);

			expect(p.player.media.readyState).toBe(p.player.media.HAVE_CURRENT_DATA);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("fires 'waiting' event when buffering only if playing: #name", function(done, p, name) {
		init(p.id, function() {
			var callback = jasmine.createSpy('waiting callback');
			p.player.media.addEventListener('waiting', callback);

			mejs.YouTubeApi.handleStateChange(3, p.player, p.player.media);
			expect(callback).not.toHaveBeenCalled();

			p.player.media.paused = false;

			mejs.YouTubeApi.handleStateChange(3, p.player, p.player.media);
			expect(callback).toHaveBeenCalled();
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("playing gets a 'timeupdate': #name", function(done, p, name) {
		var gotUpdate = false;

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('timeupdate', function() {
					gotUpdate = true;
				});
				p.player.media.addEventListener('canplay', function() {
					expect(p.player.media.currentTime).toBe(0);
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return gotUpdate === true;
		}, "first timeupdate to fire", MAX_WAIT);

		runs(function() {
			expect(p.player.media.currentTime).toBeGreaterThan(0);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(
			 player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name
			 );
	neckbeard.loop("`currentTime` is correct after seeking: #name", function(done, p, name) {
		var paused = false;

		runs(function() {
			init(p.id, function() {
				expect(p.player.media.currentTime).toBe(0);

				p.player.media.addEventListener('pause', function() {
					p.player.setCurrentTime(2);

					start = (new Date()).getTime();
					paused = true;
				});
				p.player.media.addEventListener('play', function() {
					p.player.pause();
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		waitsFor(function() {
			return paused && (new Date()).getTime() - start > 3000;
		}, "a few seconds to elapse", MAX_WAIT);

		runs(function() {
			expect(p.player.media.currentTime).toBe(2);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("does not get 'timeupdate's when current time is not changing: #name", function(done, p, name) {
		var canplay = false;
		var start;
		var callback = jasmine.createSpy('timeupdate callback');

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('timeupdate', callback);
				p.player.media.addEventListener('canplay', function() {
					canplay = true;
					start = (new Date()).getTime();
				});
			});
		});

		waitsFor(function() {
			return canplay && (new Date()).getTime() - start > 2000;
		}, "a few seconds to elapse", MAX_WAIT);

		runs(function() {
			expect(callback.calls.length).toBe(0);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("gets multiple 'timeupdate's while playing: #name", function(done, p, name) {
		var playing = false;
		var start;
		var callback = jasmine.createSpy('timeupdate callback');

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('timeupdate', callback);
				p.player.media.addEventListener('playing', function() {
					playing = true;
				});
				p.player.media.addEventListener('canplay', function() {
					p.player.play();
				});
			});
		});

		// wait until playback begins
		waitsFor(function() {
			return playing === true;
		}, "video to begin playing", MAX_WAIT);

		runs(function() {
			start = (new Date()).getTime();
		});

		// wait a few seconds to allow timeupdate's
		waitsFor(function() {
			return (new Date()).getTime() - start > 2000;
		}, "a few seconds to pass", MAX_WAIT);

		runs(function() {
			expect(callback.calls.length).toBeGreaterThan(1);
		});
	});

	neckbeard.iterate('p', 'name')
	.where(player1, player1.name,
			 player2, player2.name,
			 player3, player3.name,
			 player4, player4.name);
	neckbeard.loop("propagates YouTube errors: #name", function(done, p, name) {
		var callback = jasmine.createSpy('error callback');

		runs(function() {
			init(p.id, function() {
				p.player.media.addEventListener('error', callback);

				switch (p.id) {
					case player1.id:
					case player2.id:
					case player3.id:
						mejs.YouTubeApi.handleError(2, p.player, p.player.media);
					break;
					case player4.id:
						mejs.MediaPluginBridge.fireEvent(p.player.media.id, 'error', {code: 2 + mejs.YouTubeApi._errorOffset});
					break;
				}

				done = true;
			});
		});

		waitsFor(function() {
			return done === true;
		}, "error event to fire", MAX_WAIT);

		runs(function() {
			expect(callback).toHaveBeenCalled();
			expect(p.player.media.error).not.toBeNull();
			expect(p.player.media.error.code).toBe(mejs.YouTubeApi.ERROR_INVALID_PARAMETER_VALUE);
		});
	});
});