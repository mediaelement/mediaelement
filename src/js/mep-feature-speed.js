(function($) {

	// Speed
	$.extend(mejs.MepDefaults, {

		speeds: ['1.50', '1.25', '1.00', '0.75'],

		defaultSpeed: '1.00'

	});

	$.extend(MediaElementPlayer.prototype, {

		buildspeed: function(player, controls, layers, media) {
			var t = this;

			if (t.media.pluginType == 'native') {
				var s = '<div class="mejs-button mejs-speed-button"><button type="button">'+t.options.defaultSpeed+'x</button><div class="mejs-speed-selector"><ul>';
				var i, ss;

				if ($.inArray(t.options.defaultSpeed, t.options.speeds) === -1) {
					t.options.speeds.push(t.options.defaultSpeed);
				}

				t.options.speeds.sort(function(a, b) {
					return parseFloat(b) - parseFloat(a);
				});

				for (i = 0; i < t.options.speeds.length; i++) {
					s += '<li><input type="radio" name="speed" value="' + t.options.speeds[i] + '" id="' + t.options.speeds[i] + '" ';
					if (t.options.speeds[i] == t.options.defaultSpeed) {
						s += 'checked=true ';
						s += '/><label for="' + t.options.speeds[i] + '" class="mejs-speed-selected">'+ t.options.speeds[i] + 'x</label></li>';
					} else {
						s += '/><label for="' + t.options.speeds[i] + '">'+ t.options.speeds[i] + 'x</label></li>';
					}
				}
				s += '</ul></div></div>';

				player.speedButton = $(s).appendTo(controls);

				player.playbackspeed = t.options.defaultSpeed;

				player.speedButton
				.on('click', 'input[type=radio]', function() {
					player.playbackspeed = $(this).attr('value');
					media.playbackRate = parseFloat(player.playbackspeed);
					player.speedButton.find('button').text(player.playbackspeed + 'x');
					player.speedButton.find('.mejs-speed-selected').removeClass('mejs-speed-selected');
					player.speedButton.find('input[type=radio]:checked').next().addClass('mejs-speed-selected');
				});

				ss = player.speedButton.find('.mejs-speed-selector');
				ss.height(this.speedButton.find('.mejs-speed-selector ul').outerHeight(true) + player.speedButton.find('.mejs-speed-translations').outerHeight(true));
				ss.css('top', (-1 * ss.height()) + 'px');
			}
		}
	});

})(mejs.$);
