// Source Chooser Plugin
(function($) {

	$.extend(mejs.MepDefaults, {
		sourcechooserText: 'Source Chooser'
	});

	$.extend(MediaElementPlayer.prototype, {
		buildsourcechooser: function(player, controls, layers, media) {

			var t = this;

			player.sourcechooserButton =
				$('<div class="mejs-button mejs-sourcechooser-button">'+
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.sourcechooserText + '"></button>'+
					'<div class="mejs-sourcechooser-selector">'+
						'<ul>'+
						'</ul>'+
					'</div>'+
				'</div>')
					.appendTo(controls)

					// hover
					.hover(function() {
						$(this).find('.mejs-sourcechooser-selector').css('visibility','visible');
					}, function() {
						$(this).find('.mejs-sourcechooser-selector').css('visibility','hidden');
					})

					// handle clicks to the language radio buttons
					.delegate('input[type=radio]', 'click', function() {
						src = this.value;

						if (media.currentSrc != src) {
							currentTime = media.currentTime;
							paused = media.paused;
							media.setSrc(src);
							if (!paused) {
								media.play();
							}
						}
					});

			// add to list
			for (i in media.children) {
				src = media.children[i];
				if (src.nodeName === 'SOURCE' && (media.canPlayType(src.type) == 'probably' || media.canPlayType(src.type) == 'maybe')) {
					player.addSourceButton(src.src, src.title, src.type, media.src == src.src);
				}
			}

		},

		addSourceButton: function(src, label, type, isCurrent) {
			var t = this;
			if (label === '' || label == undefined) {
				label = src;
			}
			type = type.split('/')[1];

			t.sourcechooserButton.find('ul').append(
				$('<li>'+
					'<input type="radio" name="' + t.id + '_sourcechooser" id="' + t.id + '_sourcechooser_' + label + type + '" value="' + src + '" ' + (isCurrent ? 'checked="checked"' : '') + ' />'+
					'<label for="' + t.id + '_sourcechooser_' + label + type + '">' + label + ' (' + type + ')</label>'+
				'</li>')
			);

			t.adjustSourcechooserBox();

		},

		adjustSourcechooserBox: function() {
			var t = this;
			// adjust the size of the outer box
			t.sourcechooserButton.find('.mejs-sourcechooser-selector').height(
				t.sourcechooserButton.find('.mejs-sourcechooser-selector ul').outerHeight(true)
			);
		}
	});

})(mejs.$);
