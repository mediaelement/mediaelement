/*!
 * Media Element jQuery plugin
 * http://mediaelementjs.com/
 *
 * Creates a controller bar for HTML5 <video> tags
 * and falls back to a Flash player or Silverlight player for browsers that
 * do not support <video> or cannot play the video type.
 * Mostly designed for H.264, but can also play WMV and MP3s
 *
 * Copyright 2010, John Dyer
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Thursday July 27 11:22:48 2010 -0600
 */

// TODO:
// - make volume be event driven, remember setting (cookie, startup)
// - loaded/ready event
// - poster for <audio>
// - resizing?
// - detect URL


(function ($) {

    function getScriptPath(scriptName) {
        var path = '';
        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf(scriptName) > -1) {
                path = scripts[i].src.substring(0, scripts[i].src.indexOf(scriptName));
            }
        }

        return path;
    }
    var path = getScriptPath('mediaelementplayer.js');

    // default player values
    var defaults = {
        videoWidth: -1
			, videoHeight: -1
			, audioWidth: 300
			, audioHeight: 30
			, path: path
			, flashFilename: 'flashmediaelement.swf'
			, silverlightFilename: 'silverlightmediaelement.xap'
    }

    // utility methods
    function formatTime(seconds) {
        seconds = Math.round(seconds);
        minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    jQuery.fn.mediaelementplayer = function (options) {
       return this.each(function () {

            var o = $.extend(defaults, options);

            return MediaElementPlayer($(this), o);
       });
    };

    function MediaElementPlayer($media, options) {
    
				$media = $($media);

        var isVideo = $media[0].tagName.toLowerCase() == 'video';
        var id = $media.attr('id') + '_mep';

        // ipad/iphone test
        var u = navigator.userAgent;        
        var isiPad = (u.match(/iPad/i) != null);
        var isiPhone = (u.match(/iPhone/i) != null);
        var isAndroid = (u.match(/Android/i) != null);
        var isIE9 = (u.match(/Trident\/5.0/i) != null);

        if (isiPad || isiPhone) {
            // add controls and stop
            $media.attr('controls', 'controls');
            $media.removeAttr('poster');

            // override Apple's autoplay override for iPads
            if (isiPad && $media[0].hasAttribute('autoplay')) {
							$media[0].load();
							$media[0].play();
            }

            // don't do the rest
            return;
        } else if (isIE9) {
					
						// IE9 PP3 has a bug that doesnt' allow the <video> element to be moved
						// I filed it and they promise to fix it
						$media.attr('controls', 'controls');
						return;
				} else {
				
						// remove native controls if accidentally set			
						$media.removeAttr('controls');
				}




        var html = $('<div id="' + id + '" class="mep-container"> \
					<div class="mep-video"> \
					</div> \
					<div class="mep-overlay"><div class="mep-overlay-message"></div> \
					</div> \
					<ul class="mep-controls"> \
						<li class="mep-playpause-button mep-play"><span></span></li> \
						<li class="mep-time-rail"> \
							<span class="mep-time-total"></span> \
							<span class="mep-time-loaded"></span> \
							<span class="mep-time-current"></span> \
						</li> \
						<li class="mep-time"> \
							<span class="mep-currenttime"></span> \
							<span>|</span> \
							<span class="mep-duration"></span> \
						</li> \
						<li class="mep-volume-button mep-mute"> \
							<span></span> \
							<div class="mep-volume-slider"> \
								<div class="mep-volume-rail"><div class="mep-volume-handle"></div></div> \
							</div> \
						</li> \
						<li class="mep-fullscreen-button"><span></span></li> \
					</ul> \
					<div style="clear:both;"><div> \
				</div>');

        // insert and switch position
        $media.before(html);
        var container = $('#' + id);
        
        // put the <video> tag in the right spot
        container.find('.mep-video').append($media);
        
        // move any skins up to the container
        container.addClass($media[0].className);
                
        // append a poster
        if ($media.attr('poster') != null) {
					var poster = $('<img />');
					poster.attr('src', $media.attr('poster'));
					poster.addClass('mep-poster');
					poster.width($media.width());
					poster.height($media.height());
					container.find('.mep-video').after( poster );
        }
        
        var overlay = container.find('.mep-overlay');
        var overlayMessage = container.find('.mep-overlay-message');
        
        if ($media[0].hasAttribute('autoplay'))        
					showMessage('Loading<br/><img src="' + path + 'ajax-loader.gif" />');
				else
					showMessage('Click to Start');

        if (isVideo) {
            // set container size to video size	
            container
							.width((options.videoWidth > 0) ? options.videoWidth : $media.attr('width'))
							.height((options.videoHeight > 0) ? options.videoHeight : $media.attr('height'));

            overlay
							.width((options.videoWidth > 0) ? options.videoWidth : $media.attr('width'))
							.height((options.videoHeight > 0) ? options.videoHeight : $media.attr('height'));

        } else {
            container
							.width(options.audioWidth)
							.height(options.audioHeight);

            overlay
							.width(options.audioWidth)
							.height(options.audioHeight);
        }


        // controls bar
        var controls = container.find('.mep-controls')

        if (isVideo) {
            // show/hide controls	
            container
							.bind('mouseenter', function () { controls.fadeIn(200); })
							.bind('mouseleave', function () { controls.fadeOut(200); });
        }


        // change out poster


        function showMessage(text) {
            if (isVideo) {
							overlayMessage.html(text);
							overlay.show();
            }
        }
        function hideMessage() {
            overlay.hide();
        }



        function setupControls(mediaElement, domNode) {
						// TODO: success?

            // find controls
            var playpause = controls.find('.mep-playpause-button');
            var fullscreen = controls.find('.mep-fullscreen-button');
            if (!isVideo)
                fullscreen.hide();

            var currentTime = controls.find('.mep-currenttime').val('00:00');
            var duration = controls.find('.mep-duration').val('00:00');

            var mute = controls.find('.mep-volume-button');
            var volumeSlider = controls.find('.mep-volume-slider');
            var volumeRail = controls.find('.mep-volume-rail');
            var volumeHandle = controls.find('.mep-volume-handle');

            var timeRail = controls.find('.mep-time-rail');
            var timeCurrent = timeRail.find('.mep-time-current');
            var timeLoaded = timeRail.find('.mep-time-loaded');
            var timeTotal = timeRail.find('.mep-time-total');

            // WebKit can't report the correct with on absolute and floated elements. Hooray.
            // Reverting to manually sizing
            function setRailSize() {
                var usedWidth = 25 + //playpause.outerWidth(true) + 
							45 + // currentTime.outerWidth(true) + 
							45 + // duration.outerWidth(true) + 
							25 + //mute.outerWidth(true) + 
							((isVideo) ? 25 : 0); //fullscreen.outerWidth(true);
                var railWidth = container.outerWidth() - usedWidth - 5; // - (timeRail.outerWidth(true) - timeRail.outerWidth(false));		

                timeRail.width(railWidth);

                timeCurrent.width(0);
                timeLoaded.width(0);
                timeTotal.width(railWidth - 10);

            }
            setRailSize();

            // play/pause button
            playpause.bind('click', function () {

                if (playpause.hasClass('mep-play')) {
                    //if (mediaElement.paused) {
                    mediaElement.play();
                    playpause.removeClass('mep-play').addClass('mep-pause');
                } else {
                    mediaElement.pause();
                    playpause.removeClass('mep-pause').addClass('mep-play');
                }
            });

            // VOLUME SLIDER
            function volumeMove(e) {
                //$('body').css('cursor','N-resize');

                // only allow it to move within the rail
                var railHeight = volumeRail.height();
                var newY = e.pageY - volumeRail.offset().top;
                if (newY < 0)
                    newY = 0;
                else if (newY > railHeight)
                    newY = railHeight;

                // set position
                volumeHandle.css('top', newY - (volumeHandle.height() / 2));

                // calculate volume			
                var volume = (railHeight - newY) / railHeight;

                // make sure to check mute status
                if (volume == 0) {
                    mediaElement.setMuted(true);
                    mute.removeClass('mep-mute').addClass('mep-unmute');
                } else {
                    mediaElement.setMuted(false);
                    mute.removeClass('mep-unmute').addClass('mep-mute');
                }

                mediaElement.setVolume(volume);
            };
            function positionVolumeHandle(volume) {
                volumeHandle.css('top', volumeRail.height() - (volumeRail.height() * volume) - (volumeHandle.height() / 2));
            }
            function removeMouseMove() {
                //$(document).css('cursor','');
                $(document)
									.unbind('mousemove', volumeMove)
									.unbind('mouseup', removeMouseMove);
            }
            volumeSlider.bind('mousedown', function (e) {
                volumeMove(e);
                $(document)
									.bind('mousemove', volumeMove)
									.bind('mouseup', removeMouseMove);
            });

            // MUTE
            mute.find('span').bind('click', function () {
                if (mediaElement.muted) {
                    mediaElement.setMuted(false);
                    mute.removeClass('mep-unmute').addClass('mep-mute');
                    positionVolumeHandle(1);
                } else {
                    mediaElement.setMuted(true);
                    mute.removeClass('mep-mute').addClass('mep-unmute');
                    positionVolumeHandle(0);
                }
            });

            // FULLSCREEN
            var isFullScreen = false;
            var normalHeight = 0;
            var normalWidth = 0;
            fullscreen.bind('click', function () {
                setFullScreen(!isFullScreen);
            });

            function setFullScreen(goFullScreen) {
                switch (mediaElement.pluginType) {
                    case 'flash':
                        mediaElement.setFullscreen(goFullScreen);
                        break;
                    case 'silverlight':
                        mediaElement.setFullscreen(goFullScreen);
                        break;
                    case 'native':

                        if (goFullScreen) {
                            // store
                            normalHeight = $media.height();
                            normalWidth = $media.width();

                            // make full size
                            container.addClass('mep-container-fullscreen');
                            container.width('100%').height('100%').css('z-index', 1000);
                            $media.width('100%').height('100%');

                            setRailSize();
                            fullscreen.removeClass('mep-fullscreen').addClass('mep-unfullscreen');

                            $(document).bind('keydown', escListener);
                            $(window).bind('resize', resizeListener);
                        } else {

                            container.removeClass('mep-container-fullscreen');
                            container.width(normalWidth).height(normalHeight).css('z-index', 1);
                            $media.width(normalWidth).height(normalHeight);
                            setRailSize();
                            fullscreen.removeClass('mep-unfullscreen').addClass('mep-fullscreen');

                            $(document).unbind('keydown', escListener);
                            $(window).unbind('resize', resizeListener);

                        }
                }
                isFullScreen = goFullScreen;
            }

            function escListener(e) {
                if (e.keyCode == 27)
                    setFullScreen(false);
            }

            function resizeListener(e) {
                setRailSize();
            }

            // time rail
            timeRail.delegate('span', 'click', function (e) {
                // mouse position relative to the object!
                var x = e.pageX;
                var offset = timeTotal.offset();
                var width = timeTotal.outerWidth();
                var percentage = ((x - offset.left) / width);
                var newTime = percentage * mediaElement.duration;

                mediaElement.setCurrentTime(newTime);
            });


            overlay.bind('click', function (e) {
                if (mediaElement.paused)
                    mediaElement.play();
            }, true);


            // attach events to <video>
            mediaElement.addEventListener('timeupdate', function (e) {

                // update current:duration
                currentTime.html(formatTime(mediaElement.currentTime));
                if (mediaElement.duration)
                    duration.html(formatTime(mediaElement.duration));

                // update time bar	
                timeCurrent.width(timeTotal.width() * mediaElement.currentTime / mediaElement.duration);

            }, true);

            // bytes loaded/progress
            // problems in webkit?
            mediaElement.addEventListener('progress', function (e) {
                var percent = 0;

                // flash/silverlight (html5 early browsers)
                if (!isNaN(e.target.loaded) && !isNaN(e.target.total)) {
                    percent = (e.loaded / e.total);
                    // html5 revision (safari 5 supports this, but chrome mis-reports it as always having 100% buffered)
                } else if (e.target.buffered && e.target.buffered.end) {
                    try {
                        percent = e.target.buffered.end() / e.target.duration;
                    } catch (e) {}
                }

                // update loaded bar	
                timeLoaded.width(timeTotal.width() * percent);

            }, true);


            mediaElement.addEventListener('click', function (e) {
                if (mediaElement.paused)
                    mediaElement.play();
                //else
                //	mediaElement.pause();
            }, true);


            mediaElement.addEventListener('play', function (e) {
								container.find('.mep-poster').hide();
                playpause.removeClass('mep-play').addClass('mep-pause');
                hideMessage();
            }, true);

            mediaElement.addEventListener('playing', function (e) {
                container.find('.mep-poster').hide();
                playpause.removeClass('mep-play').addClass('mep-pause');
                hideMessage();
            }, true);

            mediaElement.addEventListener('pause', function (e) {
                playpause.removeClass('mep-pause').addClass('mep-play');
                showMessage('paused');
            }, true);

            mediaElement.addEventListener('ended', function (e) {
								container.find('.mep-poster').show();
                playpause.removeClass('mep-pause').addClass('mep-play');
                showMessage('ended');
            }, true);

        }
        
        function handleError(me) {
					console.log('medialementplayer ERROR', me);
        }


        // use FlashWrapper
        var mediaElement = html5.MediaElement($media[0], {
            success: setupControls,
            error: handleError,
            flashUrl: options.path + options.flashFilename,
            silverlightUrl: options.path + options.silverlightFilename,
            type: options.type
        });
        
        var obj = {
            play: function () {
                mediaElement.play();
            },
            pause: function () {
                mediaElement.pause();
            },
            loadMedia: function(url) {
								console.log('load', this, mediaElement);
            
								mediaElement.loadMedia(url);
            }        
        };

        return obj;
    }

})(jQuery);