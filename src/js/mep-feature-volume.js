(function ($) {
// Set default options.
  $.extend(mejs.MepDefaults, {
    muteText: 'Mute Toggle',
    allyVolumeControlText: 'Use Up/Down Arrow keys to increase or decrease volume.',
    hideVolumeOnTouchDevices: true,
    audioVolume: 'horizontal',
    videoVolume: 'vertical'
  });
// Add control to player.
  $.extend(MediaElementPlayer.prototype, {
    buildvolume: function (player, controls, layers, media) {
      // Android and iOS don't support volume controls
      if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices) {
        return;
      }
      var t = this,
        props = {}, // properties
        markup, // markup
        fn = {} // functions
      ;
      // Set vertical volume controls for video, horizontal for audio.
      props.mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume;

      // Add volume markup elements before getting selectors.
      markup = '<div class="mejs-button mejs-volume mejs-mute">';
      markup += '<button type="button" aria-controls="' + t.id + '" ';
      markup += 'title="' + t.options.muteText + '" ';
      markup += 'aria-label="' + t.options.muteText + '" />';
      markup += '<div class="mejs-' + props.mode + '-volume-slider">';
      markup += '<span class="mejs-' + props.mode + '-volume-total"></span>';
      markup += '<span class="mejs-' + props.mode + '-volume-current"></span>';
      markup += '<span class="mejs-' + props.mode + '-volume-handle"></span>';
      markup += '<span class="mejs-offscreen">' + t.options.allyVolumeControlText + '</span>';
      markup += '</div></div>';
      $(markup).appendTo(controls);
      // Get selector objects.
      var o = {
        button: $(t.controls.find('.mejs-volume button')),
        slider: $(t.controls.find('.mejs-' + props.mode + '-volume-slider')),
        total: $(t.controls.find('.mejs-' + props.mode + '-volume-total')),
        current: $(t.controls.find('.mejs-' + props.mode + '-volume-current')),
        handle: $(t.controls.find('.mejs-' + props.mode + '-volume-handle'))
      },
      mouseIsDown = false,
        mouseIsOver = false;

      // Set volume slider attributes.
      o.slider.attr({
        'aria-label': 'volumeSlider',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': media.volume,
        'aria-valuetext': media.volume + '%',
        'role': 'slider',
        'tabindex': 0
      });

      // Sets display props of volume button & slider handle.
      fn.volumeHandlePosition = function (volume, secondTry) {
        console.log('handleposition:');
        console.log(volume);
        // top/left of full size volume slider background
        var totalPosition = o.total.position(),
          mute = o.button.parent();
        // correct to 0-1
        volume = Math.min(volume, 1);
        volume = Math.max(0, volume);
        // Position the volume slider & hide it until focused.
        if (!o.slider.is(':visible') && typeof secondTry === 'undefined') {
          o.slider.show();
          fn.volumeHandlePosition(volume, true);
          o.slider.hide();
          return;
        }

        // Add/remove muted class.
        if (volume === 0) {
          mute.removeClass('mejs-mute').addClass('mejs-unmute');
        } else {
          mute.removeClass('mejs-unmute').addClass('mejs-mute');
        }

        switch (props.mode) {
          case 'vertical':
            var
              // height of the full size volume slider background
              totalHeight = o.total.height(),
              // the new top position based on the current volume
              // 70% volume on 100px height == top:30px
              newTop = totalHeight - (totalHeight * volume);
            // handle
            o.handle.css('top', Math.round(totalPosition.top + newTop - (o.handle.height() / 2)));
            // show the current visibility
            o.current.height(totalHeight - newTop);
            o.current.css('top', totalPosition.top + newTop);
            break;
          case 'horizontal':
            var
              // height of the full size volume slider background
              totalWidth = o.total.width(),
              // the new left position based on the current volume
              newLeft = totalWidth * volume;
            // Position & resize handle.
            o.handle.css('left', Math.round(totalPosition.left + newLeft - (o.handle.width() / 2)));
            // Rezize the current volume bar.
            o.current.width(Math.round(newLeft));
            break;
        }
      };
//
      fn.volumeHandleChange = function (e) {
        console.log('handlechange:');
        console.log(e);
        var volume = null,
          totalOffset = o.total.offset();
        // ensure the volume isn't outside 0-1
        volume = Math.max(0, volume);
        volume = Math.min(volume, 1);
        // calculate the new volume based on the moust position
        switch (props.mode) {
          case 'vertical':
            var railHeight = o.total.height(),
              totalTop = parseInt(o.total.css('top').replace(/px/, ''), 10),
              newY = e.pageY - totalOffset.top;
            // Controls hide themselves if mouse moves too far up.
            if (totalOffset.top === 0 || totalOffset.left === 0) {
              return;
            }
            // Set volume based on handle position.
            volume = (railHeight - newY) / railHeight;
            break;
          case 'horizontal':
            var
              railWidth = o.total.width(),
              newX = e.pageX - totalOffset.left;
            // Set volume based on handle position.
            volume = newX / railWidth;
            break;
        }
        // Set the muted property if applicable.
        if (volume === 0) {
          media.setMuted(true);
        } else {
          media.setMuted(false);
        }
        console.log('new volume: ' + volume);
        // Position the slider and handle to reflect updated volume.
        fn.volumeHandlePosition(volume);
        // Set the media object (this will trigger the volumechanged event).
        media.setVolume(volume);
      };
// Update volume properties.
      fn.volumeSliderChange = function (e) {
        var volume = Math.floor(e * 100);
        //volume = props.volume;
        console.log('updateSlider:');
        console.log(e);
        // Update Slider attributes.
        o.slider.attr({
          'aria-valuenow': volume,
          'aria-valuetext': volume + '%'
        });
      };
// Initial volume
      (function _init_volume() {

        // Listen for volume change events from other sources.
        media.addEventListener('volumechange', function (e) {
          if (!mouseIsDown) {
            if (media.muted) {
              fn.volumeHandlePosition(0);
              o.button.removeClass('mejs-mute').addClass('mejs-unmute');
            } else {
              fn.volumeHandlePosition(media.volume);
              o.button.removeClass('mejs-unmute').addClass('mejs-mute');
            }
          }
          fn.volumeSliderChange(e);
        }, false);

        // set initial volume
        fn.volumeHandlePosition(player.options.startVolume);
        // Mutes the media and sets the volume icon muted if the initial volume
        // is set to 0
        if (player.options.startVolume === 0) {
          media.setMuted(true);
        }
        // shim gets the startvolume as a parameter, but we have to set it
        // on the native <video> and <audio> elements
        if (media.pluginType === 'native') {
          media.setVolume(player.options.startVolume);
        }

        // Listen for events on slider.
        o.slider
          .bind('mouseover', function () {
            mouseIsOver = true;
          })
          .bind('mousedown', function (e) {
            e.preventDefault();
            fn.volumeHandleChange(e);
            t.globalBind('mousemove.vol', function (e) {
              fn.volumeHandleChange(e);
            });
            t.globalBind('mouseup.vol', function () {
              mouseIsDown = false;
              t.globalUnbind('.vol');
              if (!mouseIsOver && props.mode === 'vertical') {
                o.slider.hide();
              }
            });
            mouseIsDown = true;
          })
          // Listen for slider keyboard events.
          .bind('keydown', function (e) {
            e.preventDefault();
            switch (e.keyCode) {
              case 38: // Up
                media.volume += 0.1;
                break;
              case 40: // Down
                media.volume -= 0.1;
                break;
              default:
                return true;
            }
            // Position volume handle & set volume.
            fn.volumeHandlePosition(media.volume);
            media.setVolume(media.volume);
          })
          .bind('blur', function () {
            o.slider.hide();
          });

        if (t.container.is(':visible')) {
          // MUTE button
          o.button
            .bind('click', function () {
              media.setMuted(!media.muted);
            })
            // Keyboard input.
            .bind('focus', function () {
              o.slider.show();
            })
            .parent().hover(function () {
            mouseIsOver = true;
            o.slider.show();
          }, function () {
            mouseIsOver = false;
            if (!mouseIsDown && props.mode === 'vertical') {
              o.slider.hide();
            }
          });
        }
      })();
    }
  });
})(mejs.$);
