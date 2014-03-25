describe("media", function() {
	var MAX_WAIT = 10000;

	var ctx = {player: null, elem: null, domElem: null};

	var setUp = function(html) {
		$('body').append(html);
		ctx.player = new MediaElementPlayer('#player1', {
			plugins: ['youtube'],
			success: function(elem, domElem) {
				ctx.elem = elem;
				ctx.domElem = domElem;
			}
		});
	};

	var tearDown = function() {
		ctx.player.remove();

		var domElem = $('#player1')[0];
		domElem.parentNode.removeChild(domElem);

		ctx.elem = ctx.domElem = ctx.player = null;
	};

	it("YouTube media should have sourceType of 'video/youtube'", function() {
		runs(function() {
			setUp('<video width="640" height="480" id="player1"' +
					'<source type="video/youtube" src="https://www.youtube.com/watch?v=yyWWXSwtPP0"></source>' +
					'</video>');
		});

		waitsFor(function() {
			return ctx.elem !== null;
		}, "player to initialize", MAX_WAIT);

		runs(function() {
			expect(ctx.player.media.sourceType).toBe('video/youtube');
			tearDown();
		});
	});

	it("native media should have sourceType of 'video/mp4'", function() {
		runs(function() {
			setUp('<video width="640" height="480" src="../media/echo-hereweare.mp4" id="player1">' +
					'</video>');
		});

		waitsFor(function() {
			return ctx.elem !== null;
		}, "player to initialize", MAX_WAIT);

		runs(function() {
			expect(ctx.player.media.sourceType).toBe('video/mp4');
			tearDown();
		});

	})
});