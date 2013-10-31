(function($) {

	// Speed
	$.extend(mejs.MepDefaults, {

		speeds: ['1.50', '1.25', '1.00', '0.75'],

		speedStyle: {'1.50': 'mejs-speed-150', '1.25': 'mejs-speed-125', '1.00': 'mejs-speed-100', '0.75': 'mejs-speed-075'},

		defaultSpeed: '1.00'

	});

	$.extend(MediaElementPlayer.prototype, {

		buildspeed: function(player, controls, layers, media) {
			if (!player.isVideo)
				return;

			var t = this;

			if (t.media.pluginType == 'native') {
				var s = '<div class="mejs-button mejs-speed-button mejs-speed-100"><button type="button"></button><div class="mejs-speed-selector"><ul>';
				var i;
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

				player.speedButton.hover(function() {
					$(this).find('.mejs-speed-selector').css('visibility', 'visible');
				}, function() {
					$(this).find('.mejs-speed-selector').css('visibility', 'hidden');
				})
				.on('click', 'input[type=radio]', function() {
					var lastSpeed = t.options.speedStyle[player.playbackspeed];
					player.playbackspeed = $(this).attr('value');
					media.playbackRate = parseFloat($(this).attr('value'));
					player.speedButton.removeClass(lastSpeed).addClass(t.options.speedStyle[player.playbackspeed]);
					player.speedButton.find('.mejs-speed-selected').removeClass('mejs-speed-selected');
					player.speedButton.find('input[type=radio]:checked').next().addClass('mejs-speed-selected');
				});

				player.speedButton.find('li').hover(function() {
					$(this).css('background-color', 'linear-gradient(rgba(44,124,145,0.8), rgba(78,183,212,0.8))');
				}, function() {
					$(this).css('background-color', 'rgba(50,50,50,0)');
				});

				player.speedButton.find('.mejs-speed-selector').height(this.speedButton.find('.mejs-speed-selector ul').outerHeight(true) + player.speedButton.find('.mejs-speed-translations').outerHeight(true));
			}
		}
	});

})(mejs.$);
