/**
 * Current/duration times
 *
 * This feature creates/updates the duration and progress times in the control bar, based on native events.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * The initial duration
		 * @type {Number}
		 */
		duration: 0,
		/**
		 * @type {String}
		 */
		timeAndDurationSeparator: '<span> | </span>'
	});


	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Current time constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildcurrent: function(player, controls, layers, media) {
			var t = this;

			$('<div class="mejs__time" role="timer" aria-live="off">' +
					'<span class="mejs__currenttime">' +
						mejs.Utility.secondsToTimeCode(0, player.options.alwaysShowHours) +
                    '</span>'+
				'</div>')
			.appendTo(controls);

			t.currenttime = t.controls.find('.mejs__currenttime');

			media.addEventListener('timeupdate',function() {
				if (t.controlsAreVisible) {
					player.updateCurrent();
				}

			}, false);
		},

		/**
		 * Duration time constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildduration: function(player, controls, layers, media) {
			var t = this;

			if (controls.children().last().find('.mejs__currenttime').length > 0) {
				$(t.options.timeAndDurationSeparator +
					'<span class="mejs__duration">' +
						mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours) +
					'</span>')
					.appendTo(controls.find('.mejs__time'));
			} else {

				// add class to current time
				controls.find('.mejs__currenttime').parent().addClass('mejs__currenttime-container');

				$('<div class="mejs__time mejs__duration-container">'+
					'<span class="mejs__duration">' +
						mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours) +
					'</span>' +
				'</div>')
				.appendTo(controls);
			}

			t.durationD = t.controls.find('.mejs__duration');

			media.addEventListener('timeupdate',function() {
				if (t.controlsAreVisible) {
					player.updateDuration();
				}
			}, false);
		},

		/**
		 * Update the current time and output it in format 00:00
		 *
		 */
		updateCurrent:  function() {
			var t = this;

			var currentTime = t.media.currentTime;

			if (isNaN(currentTime)) {
				currentTime = 0;
			}

			if (t.currenttime) {
				t.currenttime.html(mejs.Utility.secondsToTimeCode(currentTime, t.options.alwaysShowHours));
			}
		},

		/**
		 * Update the duration time and output it in format 00:00
		 *
		 */
		updateDuration: function() {
			var t = this;

			var duration = t.media.duration;

			if (isNaN(duration) || duration == Infinity || duration < 0) {
				t.media.duration = t.options.duration = duration = 0;
			}

			if (t.options.duration > 0) {
				duration = t.options.duration;
			}

			//Toggle the long video class if the video is longer than an hour.
			t.container.toggleClass("mejs__long-video", duration > 3600);

			if (t.durationD && duration > 0) {
				t.durationD.html(mejs.Utility.secondsToTimeCode(duration, t.options.alwaysShowHours));
			}
		}
	});

})(mejs.$);
