/**
 * Volume button
 *
 * This feature enables the displaying of a Volume button in the control bar, and also contains logic to manipulate its
 * events, such as sliding up/down (or left/right, if vertical), muting/unmuting media, etc.
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		muteText: mejs.i18n.t('mejs.mute-toggle'),
		/**
		 * @type {String}
		 */
		allyVolumeControlText: mejs.i18n.t('mejs.volume-help-text'),
		/**
		 * @type {Boolean}
		 */
		hideVolumeOnTouchDevices: true,
		/**
		 * @type {String}
		 */
		audioVolume: 'horizontal',
		/**
		 * @type {String}
		 */
		videoVolume: 'vertical'
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 * @public
		 */
		buildvolume: function (player, controls, layers, media) {

			// Android and iOS don't support volume controls
			if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices)
				return;

			var t = this,
				mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume,
				mute = (mode === 'horizontal') ?

					// horizontal version
					$('<div class="' +  t.options.classPrefix + 'button ' +
					                    t.options.classPrefix + 'volume-button' +
					                    t.options.classPrefix + 'mute">' +
						'<button type="button" aria-controls="' + t.id + '" ' +
							'title="' + t.options.muteText + '" ' +
							'aria-label="' + t.options.muteText +
						'"></button>' +
						'</div>' +
						'<a href="javascript:void(0);" class="' +  t.options.classPrefix + 'horizontal-volume-slider">' + // outer background
							'<span class="' +  t.options.classPrefix + 'offscreen">' +
								t.options.allyVolumeControlText +
							'</span>' +
							'<div class="' +  t.options.classPrefix + 'horizontal-volume-total">' + // line background
								'<div class="' +  t.options.classPrefix + 'horizontal-volume-current"></div>' + // current volume
								'<div class="' +  t.options.classPrefix + 'horizontal-volume-handle"></div>' + // handle
							'</div>' +
						'</a>'
					)
					.appendTo(controls) :

					// vertical version
					$('<div class="' +  t.options.classPrefix + 'button ' +
					                    t.options.classPrefix + 'volume-button ' +
					                    t.options.classPrefix + 'mute">' +
						'<button type="button" aria-controls="' + t.id +
						'" title="' + t.options.muteText +
						'" aria-label="' + t.options.muteText +
						'"></button>' +
						'<a href="javascript:void(0);" class="' +  t.options.classPrefix + 'volume-slider">' + // outer background
							'<span class="' +  t.options.classPrefix + 'offscreen">' +
								t.options.allyVolumeControlText +
							'</span>' +
							'<div class="' +  t.options.classPrefix + 'volume-total">' + // line background
								'<div class="' +  t.options.classPrefix + 'volume-current"></div>' + // current volume
								'<div class="' +  t.options.classPrefix + 'volume-handle"></div>' + // handle
							'</div>' +
						'</a>' +
						'</div>')
					.appendTo(controls),
				volumeSlider = t.container.find('.' +  t.options.classPrefix + 'volume-slider, ' +
				                                '.' +  t.options.classPrefix + 'horizontal-volume-slider'),
				volumeTotal = t.container.find('.' + t.options.classPrefix + 'volume-total, ' +
				                               '.' + t.options.classPrefix + 'horizontal-volume-total'),
				volumeCurrent = t.container.find('.' +  t.options.classPrefix + 'volume-current, ' +
				                                 '.' +  t.options.classPrefix + 'horizontal-volume-current'),
				volumeHandle = t.container.find('.' +  t.options.classPrefix + 'volume-handle, ' +
				                                '.' +  t.options.classPrefix + 'horizontal-volume-handle'),

				/**
				 * @private
				 * @param {Number} volume
				 */
				positionVolumeHandle = function (volume) {

					// correct to 0-1
					volume = Math.max(0, volume);
					volume = Math.min(volume, 1);

					// adjust mute button style
					if (volume === 0) {
						mute.removeClass(t.options.classPrefix + 'mute')
							.addClass(t.options.classPrefix + 'unmute');
						mute.children('button')
							.attr('title', mejs.i18n.t('mejs.unmute'))
							.attr('aria-label', mejs.i18n.t('mejs.unmute'));
					} else {
						mute.removeClass( t.options.classPrefix + 'unmute')
							.addClass( t.options.classPrefix + 'mute');
						mute.children('button')
							.attr('title', mejs.i18n.t('mejs.mute'))
							.attr('aria-label', mejs.i18n.t('mejs.mute'));
					}

					var volumePercentage = volume * 100 + '%';

					// position slider
					if (mode === 'vertical') {
						volumeCurrent.css({
							bottom: '0',
							height: volumePercentage
						});
						volumeHandle.css({
							bottom: volumePercentage,
							marginBottom: - volumeHandle.height() / 2 + 'px'
						});
					} else {
						volumeCurrent.css({
							left: '0',
							width: volumePercentage
						});
						volumeHandle.css({
							left: volumePercentage,
							marginLeft: - volumeHandle.width() / 2 + 'px'
						});
					}
				},
				/**
				 * @private
				 */
				handleVolumeMove = function (e) {

					var
						volume = null,
						totalOffset = volumeTotal.offset()
					;

					// calculate the new volume based on the most recent position
					if (mode === 'vertical') {

						var
							railHeight = volumeTotal.height(),
							newY = e.pageY - totalOffset.top
						;

						volume = (railHeight - newY) / railHeight;

						// the controls just hide themselves (usually when mouse moves too far up)
						if (totalOffset.top === 0 || totalOffset.left === 0) {
							return;
						}

					} else {
						var
							railWidth = volumeTotal.width(),
							newX = e.pageX - totalOffset.left
						;

						volume = newX / railWidth;
					}

					// ensure the volume isn't outside 0-1
					volume = Math.max(0, volume);
					volume = Math.min(volume, 1);

					// position the slider and handle
					positionVolumeHandle(volume);

					// set the media object (this will trigger the `volumechanged` event)
					if (volume === 0) {
						media.setMuted(true);
					} else {
						media.setMuted(false);
					}
					media.setVolume(volume);
				},
				mouseIsDown = false,
				mouseIsOver = false;

			// SLIDER
			mute
				.on('mouseenter focusin', function() {
					volumeSlider.show();
					mouseIsOver = true;
				})
				.on('mouseleave focusout', function() {
					mouseIsOver = false;

					if (!mouseIsDown && mode === 'vertical') {
						volumeSlider.hide();
					}
				});

			/**
			 * @private
			 */
			var updateVolumeSlider = function () {

				var volume = Math.floor(media.volume * 100);

				volumeSlider.attr({
					'aria-label': mejs.i18n.t('mejs.volume-slider'),
					'aria-valuemin': 0,
					'aria-valuemax': 100,
					'aria-valuenow': volume,
					'aria-valuetext': volume + '%',
					'role': 'slider',
					'tabindex': -1
				});

			};

			// Events
			volumeSlider
				.on('mouseover', function () {
					mouseIsOver = true;
				})
				.on('mousedown', function (e) {
					handleVolumeMove(e);
					t.globalBind('mousemove.vol', function (e) {
						handleVolumeMove(e);
					});
					t.globalBind('mouseup.vol', function () {
						mouseIsDown = false;
						t.globalUnbind('.vol');

						if (!mouseIsOver && mode === 'vertical') {
							volumeSlider.hide();
						}
					});
					mouseIsDown = true;

					return false;
				})
				.on('keydown', function (e) {

					if (t.options.keyActions.length) {
						var
							keyCode = e.keyCode,
							volume = media.volume
							;
						switch (keyCode) {
							case 38: // Up
								volume = Math.min(volume + 0.1, 1);
								break;
							case 40: // Down
								volume = Math.max(0, volume - 0.1);
								break;
							default:
								return true;
						}

						mouseIsDown = false;
						positionVolumeHandle(volume);
						media.setVolume(volume);
						return false;
					}
				});

			// MUTE button
			mute.find('button').click(function () {
				media.setMuted(!media.muted);
			});

			//Keyboard input
			mute.find('button').on('focus', function () {
				if (!volumeSlider.hasClass(t.options.classPrefix + 'horizontal-volume-slider')) {
					volumeSlider.show();
				}
			}).on('blur', function () {
				if (!volumeSlider.hasClass(t.options.classPrefix + 'horizontal-volume-slider')) {
					volumeSlider.hide();
				}
			});

			// listen for volume change events from other sources
			media.addEventListener('volumechange', function (e) {
				if (!mouseIsDown) {
					if (media.muted) {
						positionVolumeHandle(0);
						mute.removeClass(t.options.classPrefix + 'mute')
							.addClass(t.options.classPrefix + 'unmute');
					} else {
						positionVolumeHandle(media.volume);
						mute.removeClass(t.options.classPrefix + 'unmute')
							.addClass(t.options.classPrefix + 'mute');
					}
				}
				updateVolumeSlider(e);
			}, false);

			// mutes the media and sets the volume icon muted if the initial volume is set to 0
			if (player.options.startVolume === 0) {
				media.setMuted(true);
			}

			// shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
			var isNative = t.media.rendererName !== null && t.media.rendererName.match(/(native|html5)/);

			if (isNative) {
				media.setVolume(player.options.startVolume);
			}

			t.container.on('controlsresize', function () {
				if (media.muted) {
					positionVolumeHandle(0);
					mute.removeClass(t.options.classPrefix + 'mute')
						.addClass(t.options.classPrefix + 'unmute');
				} else {
					positionVolumeHandle(media.volume);
					mute.removeClass(t.options.classPrefix + 'unmute')
						.addClass(t.options.classPrefix + 'mute');
				}
			});
		}
	});

})(mejs.$);
