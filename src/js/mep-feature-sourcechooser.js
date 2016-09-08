// Source Chooser Plugin
(function($) {

	$.extend(mejs.MepDefaults, {
		sourcechooserText: 'Source Chooser'
	});

	$.extend(MediaElementPlayer.prototype, {
		buildsourcechooser: function(player, controls, layers, media) {

			var t = this;
			var hoverTimeout;

			player.sourcechooserButton =
				$('<div class="mejs-button mejs-sourcechooser-button">'+
						'<button type="button" aria-haspopup="true" aria-owns="' + t.id + '" title="' + t.options.sourcechooserText + '" aria-label="' + t.options.sourcechooserText + '"></button>'+
						'<div class="mejs-sourcechooser-selector mejs-offscreen" role="menu" aria-expanded="false" aria-hidden="true">'+
							'<ul>'+
							'</ul>'+
						'</div>'+
					'</div>')
					.appendTo(controls)

					// hover
					.hover(function() {
						clearTimeout(hoverTimeout);
						$(this).find('.mejs-sourcechooser-selector')
							.removeClass('mejs-offscreen')
							.attr('aria-expanded', 'true')
							.attr('aria-hidden', 'false');
					}, function() {
						var self = $(this);
						hoverTimeout = setTimeout(function () {
							self.find('.mejs-sourcechooser-selector')
								.addClass('mejs-offscreen')
								.attr('aria-expanded', 'false')
								.attr('aria-hidden', 'true');
						}, 500);
					})

					// keyboard menu activation
					.on('keydown', function (e) {
					  var keyCode = e.keyCode;

					  switch (keyCode) {
							case 32: // space
								$(this).find('.mejs-sourcechooser-selector')
									.removeClass('mejs-offscreen')
									.attr('aria-expanded', 'true')
									.attr('aria-hidden', 'false')
									.find('input[type=radio]:checked').first().focus();
								break;
							case 27: // esc
								$(this).find('.mejs-sourcechooser-selector')
									.addClass('mejs-offscreen')
									.attr('aria-expanded', 'false')
									.attr('aria-hidden', 'true');
								$(this).find('button').focus();
								break;
							default:
								return true;
								}
							})

					// handle clicks to the source radio buttons
					.delegate('input[type=radio]', 'click', function() {
						// set aria states
						$(this).attr('aria-selected', true).attr('checked', 'checked');
						$(this).closest('.mejs-sourcechooser-selector').find('input[type=radio]').not(this).attr('aria-selected', 'false').removeAttr('checked');

						var src = this.value;

						if (media.currentSrc != src) {
							var currentTime = media.currentTime;
							var paused = media.paused;
							media.pause();
							media.setSrc(src);

							media.addEventListener('loadedmetadata', function(e) {
								media.currentTime = currentTime;
							}, true);

							var canPlayAfterSourceSwitchHandler = function(e) {
								if (!paused) {
									media.play();
								}
								media.removeEventListener("canplay", canPlayAfterSourceSwitchHandler, true);
							};
							media.addEventListener('canplay', canPlayAfterSourceSwitchHandler, true);
							media.load();
						}
				});

			// add to list
			for (var i in this.node.children) {
				var src = this.node.children[i];
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
						'<input type="radio" name="' + t.id + '_sourcechooser" id="' + t.id + '_sourcechooser_' + label + type + '" role="menuitemradio" value="' + src + '" ' + (isCurrent ? 'checked="checked"' : '') + 'aria-selected="' + isCurrent + '"' + ' />'+
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
