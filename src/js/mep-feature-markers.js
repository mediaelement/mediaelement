/*
MediaElement-Markers is a MediaElement.js plugin that lets you add Visual Cues in the progress time rail. 
This plugin also lets you register a custom callback function that will be called everytime the play position reaches a marker. 
Marker position and a reference to the MediaElement Player object is passed to the registered callback function for any post processing. Marker color is configurable.

*/

(function ($) {
    // markers

    $.extend(mejs.MepDefaults, {
        markerColor: '#E9BC3D', //default marker color
        markers: [],
        markerCallback: function () {

        }
    });

    $.extend(MediaElementPlayer.prototype, {
        buildmarkers: function (player, controls, layers, media) {
            var t = this,
                i = 0,
                currentPos = -1,
                currentMarker = -1,
                lastPlayPos = -1, //Track backward seek
                lastMarkerCallBack = -1; //Prevents successive firing of callbacks

            for (i = 0; i < player.options.markers.length; ++i) {
                controls.find('.mejs-time-total').append('<span class="mejs-time-marker"></span>');
            }

            media.addEventListener('durationchange', function (e) {
                player.setmarkers(controls);
            });
            media.addEventListener('timeupdate', function (e) {
                currentPos = Math.floor(media.currentTime);
                if (lastPlayPos > currentPos) {
                    if (lastMarkerCallBack > currentPos) {
                        lastMarkerCallBack = -1;
                    }
                } else {
                    lastPlayPos = currentPos;
                }

                for (i = 0; i < player.options.markers.length; ++i) {
                    currentMarker = Math.floor(player.options.markers[i]); 
                    if (currentPos === currentMarker && currentMarker !== lastMarkerCallBack) {
                        player.options.markerCallback(media, media.currentTime); //Fires the callback function
                        lastMarkerCallBack = currentMarker;
                    }
                }

            }, false);

        },
        setmarkers: function (controls) {
            var t = this,
                i = 0,
                left;

            for (i = 0; i < t.options.markers.length; ++i) {
                if (Math.floor(t.options.markers[i]) <= t.media.duration && Math.floor(t.options.markers[i]) >= 0) {
                    left = 100 * Math.floor(t.options.markers[i]) / t.media.duration;
                    $(controls.find('.mejs-time-marker')[i]).css({
                        "width": "1px",
                        "left": left+"%",
                        "background": t.options.markerColor
                    });
                }
            }

        }
    });
})(mejs.$);