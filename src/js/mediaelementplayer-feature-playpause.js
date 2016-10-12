/**
 * Play/Pause button
 *
 * This feature enables the displaying of a Play button in the control bar, and also contains logic to toggle its state
 * between paused and playing.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		playText: mejs.i18n.t('mejs.play'),
		/**
		 * @type {String}
		 */
		pauseText: mejs.i18n.t('mejs.pause')
	});

	$.extend(MediaElementPlayer.prototype, {
		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with build and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 * @public
		 */
		buildplaypause: function(player, controls, layers, media) {
			var
				t = this,
				op = t.options,
				play =
				$('<div class="mejs-button mejs-playpause-button mejs-play" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + op.playText + '" aria-label="' + op.playText + '"></button>' +
				'</div>')
				.appendTo(controls)
				.click(function(e) {
					e.preventDefault();

					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}

					return false;
				}),
				play_btn = play.find('button');


			/**
			 * @private
			 * @param {String} which - token to determine new state of button
			 */
			function togglePlayPause(which) {
				if ('play' === which) {
					play.removeClass('mejs-play').addClass('mejs-pause');
					play_btn.attr({
						'title': op.pauseText,
						'aria-label': op.pauseText
					});
				} else {
					play.removeClass('mejs-pause').addClass('mejs-play');
					play_btn.attr({
						'title': op.playText,
						'aria-label': op.playText
					});
				}
			}

			togglePlayPause('pse');

			media.addEventListener('play',function() {
				togglePlayPause('play');
			}, false);
			media.addEventListener('playing',function() {
				togglePlayPause('play');
			}, false);


			media.addEventListener('pause',function() {
				togglePlayPause('pse');
			}, false);
			media.addEventListener('paused',function() {
				togglePlayPause('pse');
			}, false);
		}
	});

})(mejs.$);
