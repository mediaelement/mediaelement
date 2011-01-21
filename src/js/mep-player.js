(function ($) {

	// default player values
	mejs.MepDefaults = {
		// url to poster (to fix iOS 3.x)
		poster: '',
		// default if the <video width> is not specified
		defaultVideoWidth: 480,
		// default if the <video height> is not specified
		defaultVideoHeight: 270,
		// if set, overrides <video width>
		videoWidth: -1,
		// if set, overrides <video height>
		videoHeight: -1,
		// width of audio player
		audioWidth: 400,
		// height of audio player
		audioHeight: 30,
		// initial volume when the player starts (overrided by user cookie)
		startVolume: 0.8,		
		// useful for <audio> player loops
		loop: false,
		// resize to media dimensions
		enableAutosize: true,		
		// features to show
		features: ['playpause','current','progress','duration','tracks','volume','fullscreen']
	};

	mejs.mepIndex = 0;

	// wraps a MediaElement object in player controls
	mejs.MediaElementPlayer = function($media, o) {
		// enforce object, even without "new" (via John Resig)
		if ( !(this instanceof mejs.MediaElementPlayer) ) {
			return new mejs.MediaElementPlayer($media, o);
		} 
		
		var	
			t = this,
			mf = mejs.MediaFeatures;
	
		t.$media = $($media);

		// check for existing player
		if (t.$media[0].player) {
			return t.$media[0].player;
		} else {
			t.$media[0].player = t;
		}

		t.options = $.extend({},mejs.MepDefaults,o);
		t.isVideo = (t.$media[0].tagName.toLowerCase() == 'video');
		
				
		if (mf.isiPad || mf.isiPhone) {
			// add controls and stop
			t.$media.attr('controls', 'controls');
			
			// fix Apple bug
			t.$media.removeAttr('poster');

			// override Apple's autoplay override for iPads
			if (mf.isiPad && t.$media[0].getAttribute('autoplay') !== null) {
				t.$media[0].load();
				t.$media[0].play();
			}

			// don't do the rest
			return;
		} else if (mf.isAndroid && t.isVideo) {

			// Android fails when there are multiple types
			// <video>
			// <source src="file.mp4" type="video/mp4" />
			// <source src="file.webm" type="video/webm" />
			// </video>
			if (t.$media.find('source').length > 0) {
				// find an mp4 and make it the root element source
				t.$media[0].src = t.$media.find('source[src$="mp4"]').attr('src');				
			}
			
			// attach a click event to the video and hope Android can play it
			t.$media.click(function() {
				t.$media[0].play();
			});			
			
			return;
			
		} else {

			// remove native controls and use MEJS
			t.$media.removeAttr('controls');
		}
		
		t.init();
		
		return t;
	};
	
	// actual player
	mejs.MediaElementPlayer.prototype = {
		init: function() {

			var
				t = this,
				meOptions = $.extend(true, {}, t.options, {
					success: function(media, domNode) { t.meReady(media, domNode); },
					error: function(e) { t.handleError(e);}
				});				
		
			// unique ID
			t.id = 'mep_' + mejs.mepIndex++;			
			
			// build container
			t.container =
				$('<div id="' + t.id + '" class="mejs-container">'+
					'<div class="mejs-inner">'+
						'<div class="mejs-mediaelement"></div>'+
						'<div class="mejs-layers"></div>'+
						'<div class="mejs-controls"></div>'+
						'<div class="mejs-clear"></div>'+
					'</div>' +
				'</div>')						
				.addClass(t.$media[0].className)
				.insertBefore(t.$media);
				
			// move the <video/video> tag into the right spot
			t.container.find('.mejs-mediaelement').append(t.$media);
			
			// find parts
			t.controls = t.container.find('.mejs-controls');
			t.layers = t.container.find('.mejs-layers');		
			
			// determine the size							
			if (t.isVideo) {			
				// priority = videoWidth (forced), width attribute, defaultVideoWidth		
				t.width = (t.options.videoWidth > 0) ? t.options.videoWidth : (t.$media[0].getAttribute('width') !== null) ? t.$media.attr('width') : t.options.defaultVideoWidth;
				t.height = (t.options.videoHeight > 0) ? t.options.videoHeight : (t.$media[0].getAttribute('height') !== null) ? t.$media.attr('height') : t.options.defaultVideoHeight;				
			} else {
				t.width = t.options.audioWidth;
				t.height = t.options.audioHeight;
			}
			
			// set the size, while we wait for the plugins to load below
			t.setPlayerSize(t.width, t.height);
						
			// create MediaElementShim	
			meOptions.pluginWidth = t.height;
			meOptions.pluginHeight = t.width;			
			mejs.MediaElement(t.$media[0], meOptions);			
		},
		
		// Sets up all controls and events
		meReady: function(media, domNode) {		

			var t = this,
				f,
				feature;

			t.media = media;
			t.domNode = domNode;
				
			// two built in features
			t.buildposter(t, t.controls, t.layers, t.media);
			t.buildoverlay(t, t.controls, t.layers, t.media);
			
			// grab for use by feautres
			t.findTracks();
				
			// add user-defined features/controls
			for (f in t.options.features) {
				feature = t.options.features[f];
				if (t['build' + feature]) {
					try {
						t['build' + feature](t, t.controls, t.layers, t.media);
					} catch (e) {
						// TODO: report control error
					}
				}			
			}
			
			// reset all layers and controls
			t.setPlayerSize(t.width, t.height);			
			t.setControlsSize();
			
			// controls fade
			if (t.isVideo) {
				// show/hide controls
				t.container
					.bind('mouseenter', function () {
						t.controls.css('visibility','visible');						
						t.controls.stop(true, true).fadeIn(200);
					})
					.bind('mouseleave', function () {
						if (!t.media.paused) {
							t.controls.stop(true, true).fadeOut(200, function() {
								$(this).css('visibility','hidden');
								$(this).css('display','block');								
							});						
						}
					});
				
				// resizer
				if (t.options.enableAutosize) {
					t.media.addEventListener('loadedmetadata', function(e) {
						// if the <video height> was not set and the options.videoHeight was not set
						// then resize to the real dimensions
						if (t.options.videoHeight <= 0 && t.$media[0].getAttribute('height') === null && !isNaN(e.target.videoHeight)) {
							t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
							t.setControlsSize();
							t.media.setVideoSize(e.target.videoWidth, e.target.videoHeight);			
						}
					}, false);
				}
			}		
			
			// ended for all
			t.media.addEventListener('ended', function (e) {
				t.media.setCurrentTime(0);
				t.media.pause();				
					
				if (t.options.loop) {					
					t.media.play();
				} else {
					t.controls.css('visibility','visible');
				}
			}, true);

			
			// webkit has trouble doing this without a delay
			setTimeout(function () {
				t.setControlsSize();
				t.setPlayerSize(t.width, t.height);
			}, 50);
			
			
			if (t.options.success) {
				t.options.success(t.media, t.domNode);
			}		
		},
		
		handleError: function(e) {
			// Tell user that the file cannot be played
			
			this.options.error(e);
		},

		setPlayerSize: function(width,height) {
			var t = this;
			
			// ie9 appears to need this (jQuery bug?)
			t.width = parseInt(width, 10);
			t.height = parseInt(height, 10);
			
			t.container
				.width(t.width)
				.height(t.height);
				
			t.layers.children('div.mejs-layer')
				.width(t.width)
				.height(t.height);						
		},

		setControlsSize: function() {
			var t = this,				
				usedWidth = 0,		
				railWidth = 0,
				rail = t.controls.find('.mejs-time-rail'),
				total = t.controls.find('.mejs-time-total'),
				others = rail.siblings();
			
			// find the size of all the other controls besides the rail
			others.each(function() {
				if ($(this).css('position') != 'absolute') {
					usedWidth += $(this).outerWidth(true);
				}
			});
			// fit the rail into the remaining space
			railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.outerWidth(false));
			
			rail.width(railWidth);		
			total.width(railWidth - (total.outerWidth(true) - total.width()));			
		},

		
		buildposter: function(player, controls, layers, media) {			
			var poster = 	
				$('<div class="mejs-poster mejs-layer">'+
					'<img />'+
				'</div>')
					.appendTo(layers),
				posterUrl = player.$media.attr('poster');
			
			if (player.options.poster != '') {
				poster.find('img').attr('src',player.options.poster);
			} else if (posterUrl !== '' && posterUrl != null) {
				poster.find('img').attr('src',posterUrl);
			} else {
				poster.hide();
			}
						
			media.addEventListener('play',function() {
				poster.hide();
			}, false);			
		},
		
		buildoverlay: function(player, controls, layers, media) {
			if (!player.isVideo)
				return;
				
			var overlay = 	
				$('<div class="mejs-overlay mejs-layer">'+
					'<div class="mejs-overlay-button"></div>'+
				'</div>')
				.appendTo(layers)
				.click(function() {
					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}
				});
				
			media.addEventListener('play',function() {
				overlay.hide();
			}, false);
			media.addEventListener('pause',function() {
				overlay.show();
			}, false);			
		},
		
		findTracks: function() {	
			var t = this,
				tracktags = t.$media.find('track');
			
			// store for use by plugins
			t.tracks = [];			
			tracktags.each(function() {				
				t.tracks.push({
					srclang: $(this).attr('srclang').toLowerCase(),
					src: $(this).attr('src'),
					kind: $(this).attr('kind'),
					entries: [],
					isLoaded: false
				});				
			});		
		},
		changeSkin: function(className) {
			this.container[0].className = 'mejs-container ' + className;
			this.setPlayerSize();
			this.setControlsSize();
		},
		play: function() {
			this.media.play();
		},
		pause: function() {
			this.media.pause();
		},
		load: function() {
			this.media.load();
		},		
		setMuted: function(muted) {
			this.media.setMuted(muted);
		},
		setCurrentTime: function(time) {
			this.media.setCurrentTime(time);
		},
		getCurrentTime: function() {
			return this.media.currentTime;
		},	
		setVolume: function(volume) {
			this.media.setVolume(volume);
		},
		getVolume: function() {
			return this.media.volume;
		},	
		setSrc: function(src) {
			this.media.setSrc(src);
		}	
	};
			
	// turn into jQuery plugin
	jQuery.fn.mediaelementplayer = function (options) {
		return this.each(function () {
			new mejs.MediaElementPlayer($(this), options);
		});
	};

	// push out to window
	window.MediaElementPlayer = mejs.MediaElementPlayer;

})(jQuery);
