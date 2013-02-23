// VAST ads plugin
// Sponsored by Minoto Video

// 2013/02/01		0.5		research
// 2013/02/09		1.5		build loading mechanism
// 2013/02/10		2.5		events to play preroll, skip function, start/end calls, \
// 2013/02/11		2		click events


// TODO 
// - split into generic preroll, postroll
// - send events

(function($) {

	// on time insert into head
	$('head').append($('<style>' + 
'.mejs-ads a {' +
'	display: block; ' +
'	position: absolute;' + 
'	right: 0;' + 
'	top: 0;' +
'	width: 100%; ' +
'	height: 100%; ' +
'	display: block; ' + 
'}' + 
'.mejs-ads .mejs-ads-skip-block {' + 
'	display: block; ' +
'	position: absolute;' + 
'	right: 0;' + 
'	top: 0;' +
'	padding: 10px; ' +
'	background: #000; ' + 
'	background: rgba(0,0,0,0.5); ' +
'	color: #fff; ' + 
'}' + 
'.mejs-ads .mejs-ads-skip-button {' + 
'	cursor: pointer; ' + 
'}' + 
'.mejs-ads .mejs-ads-skip-button:hover {' + 
'	text-decoration: underline; ' + 
'}' + 
	'</style>'));
	

	$.extend(mejs.MepDefaults, {
		// URL to a media file
		adsPrerollMediaUrl: '',
		
		// URL for lcicking ad
		adsPrerollAdUrl: '',

		// if true, allows user to skip the pre-roll ad
		adsPrerollAdEnableSkip: false,
		
		// if adsPrerollAdEnableSkip=true and this is a positive number, it will only allow skipping after the time has elasped
		adsPrerollAdSkipSeconds: -1
	});

	$.extend(MediaElementPlayer.prototype, {
	
		// allows other plugins to all this one
		adsLoaded: false,
		
		// prevents playback in until async ad data is ready (e.g. VAST)
		adsDataIsLoading: false,
		
		// stores the main media URL when an ad is playing
		adsCurrentMediaUrl: '',
		adsCurrentMediaDuration: 0,
			
		// true when the user clicks play for the first time, or if autoplay is set
		adsPlayerHasStarted: false,
		
		buildads: function(player, controls, layers, media) {

			var t = this;
			
			if (t.adsLoaded) {
				return;
			} else {
				t.adsLoaded = true;
			}
				
			// add layer for ad links and skipping
			player.adLayer = 
					$('<div class="mejs-layer mejs-overlay mejs-ads">' + 
							'<a href="#" target="_blank">&nbsp;</a>' + 
							'<div class="mejs-ads-skip-block">' + 
								'<span class="mejs-ads-skip-message"></span>' +
								'<span class="mejs-ads-skip-button">Skip Ad &raquo;</span>' +
							'</div>' +
						'</div>')
							.insertBefore( layers.find('.mejs-overlay-play') )
							.hide();
			
			player.adLayer.find('a')
						.on('click', $.proxy(t.adadsAdClick, t) );

			player.adSkipBlock = player.adLayer.find('.mejs-ads-skip-block').hide();
			player.asSkipMessage = player.adLayer.find('.mejs-ads-skip-message').hide();			
										
			player.adSkipButton = player.adLayer.find('.mejs-ads-skip-button')
														.on('click', $.proxy(t.adadsSkipClick, t) );
							
							
			// create proxies (only needed for events we want to remove later)
			t.adMediaTryingToStartProxy = 	$.proxy(t.adMediaTryingToStart, t);
			t.adsPrerollStartedProxy = 		$.proxy(t.adsPrerollStarted, t);
			t.adsPrerollMetaProxy = 			$.proxy(t.adsPrerollMeta, t);
			t.adsPrerollUpdateProxy = 		$.proxy(t.adsPrerollUpdate, t);
			t.adsPrerollEndedProxy = 		$.proxy(t.adsPrerollEnded, t);
			
			// check for start
			t.media.addEventListener('play', 			t.adMediaTryingToStartProxy );
			t.media.addEventListener('playing', 		t.adMediaTryingToStartProxy );
			t.media.addEventListener('canplay', 		t.adMediaTryingToStartProxy );
			t.media.addEventListener('loadedmetadata', 	t.adMediaTryingToStartProxy );	
			
			console.log('setup ads', t.options.adsPrerollMediaUrl);
			
			if (t.options.adsPrerollMediaUrl != '') {
				t.adsStartPreroll();
			}					
		},
		
		
		adMediaTryingToStart: function() {
			
			var t = this;
		
			// make sure to pause until the ad data is loaded
			if (t.adsDataIsLoading && !t.media.paused) {
				t.media.pause();	
			}
			
			t.adsPlayerHasStarted = true;
		},	
		
		adsStartPreroll: function() {
					
			var t = this;
			
			console.log('adsStartPreroll', 'url', t.options.adsPrerollMediaUrl);
			
			
			t.media.addEventListener('loadedmetadata', 		t.adsPrerollMetaProxy );	
			t.media.addEventListener('playing', 			t.adsPrerollStartedProxy );
			t.media.addEventListener('ended', 				t.adsPrerollEndedProxy )
			t.media.addEventListener('timeupdate', 			t.adsPrerollUpdateProxy );
			
			// change URLs to the preroll ad
			t.adsCurrentMediaUrl = t.media.src;
			t.adsCurrentMediaDuration = t.media.duration;
						
			t.media.setSrc(t.options.adsPrerollMediaUrl);
			t.media.load();
			
			// if autoplay was on, or if the user pressed play 
			// while the ad data was still loading, then start the ad right away
			if (t.adsPlayerHasStarted) {
				t.media.play();
			}
		},
		
		adsPrerollMeta: function() {
			
			var t = this,
				newDuration = 0;
		
			console.log('loadedmetadata', t.media.duration, t.adsCurrentMediaDuration);
				
			// if duration has been set, show that
			if (t.options.duration > 0) {
				newDuration = t.options.duration;
			} else if (!isNaN(t.adsCurrentMediaDuration)) {
				newDuration = t.adsCurrentMediaDuration;
			}
			
			setTimeout(function() {
				t.controls.find('.mejs-duration').html( 
					mejs.Utility.secondsToTimeCode(newDuration, t.options.alwaysShowHours || newDuration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25)
					);
			}, 250);
		},
		
		adsPrerollStarted: function() {
			console.log('adsPrerollStarted');
		
			var t = this;
			t.media.removeEventListener('playing', t.adsPrerollStartedProxy);		
			
			// turn off controls until the preroll is done
			t.disableControls();
			t.hideControls();
			
			// enable clicking through
			t.adLayer.show();
			if (t.options.adsPrerollAdUrl != '') {
				t.adLayer.find('a').attr('href', t.options.adsPrerollAdUrl);
			}
			
			// possibly allow the skip button to work
			if (t.options.adsPrerollAdEnableSkip) {
				t.adSkipBlock.show();

				if (t.options.adsPrerollAdSkipSeconds > 0) {
					t.asSkipMessage.html('Skip in ' + t.options.adsPrerollAdSkipSeconds.toString() + ' seconds.').show();
					t.adSkipButton.hide();					
				} else {
					t.asSkipMessage.hide();
					t.adSkipButton.show();					
				}
			} else {
				t.adSkipBlock.hide();
			}
			
			// send click events
			t.container.trigger('mejsprerollstarted');			
		},

		adsPrerollUpdate: function() {
			//console.log('adsPrerollUpdate');
		
			var t = this;
			
			if (t.options.adsPrerollAdEnableSkip && t.options.adsPrerollAdSkipSeconds > 0) {
				// update message
				if (t.media.currentTime > t.options.adsPrerollAdSkipSeconds) {
					t.adSkipButton.show();
					t.asSkipMessage.hide();				
				} else {
					t.asSkipMessage.html('Skip in ' + Math.round( t.options.adsPrerollAdSkipSeconds - t.media.currentTime ).toString() + ' seconds.')
				}
			
			}
			
			t.container.trigger('mejsprerolltimeupdate');
		},
		
		adsPrerollEnded: function() {
			console.log('adsPrerollEnded');
			
			var t = this;

			t.container.trigger('mejsprerollended');

			t.adRestoreMainMedia();
		},
		
		adRestoreMainMedia: function() {

			console.log('adRestoreMainMedia', this.adsCurrentMediaUrl);

			var t = this;
			
			t.media.setSrc(t.adsCurrentMediaUrl);
			setTimeout(function() {
				t.media.load();
				t.media.play();
			}, 10);
			
			t.enableControls();
			t.showControls();	
			
			t.adLayer.hide();				
			
			t.media.removeEventListener('ended', 			t.adsPrerollEndedProxy);
			t.media.removeEventListener('loadedmetadata', 	t.adsPrerollMetaProxy);			
			t.media.removeEventListener('timeupdate', 		t.adsPrerollUpdateProxy);
			
			t.container.trigger('mejsprerollmainstarted');
		},

		adsAdClick: function(e) {
			console.log('adsAdClicked');
			
			var t = this;
			
			if (t.media.paused) {
				t.media.play();
			} else {
				t.media.pause();
			}
			
			t.container.trigger('mejsprerolladsclicked');
		},
		
		adsSkipClick: function() {
			console.log('adsSkipClick');		
			var t = this;
			
			t.container.trigger('mejsprerollskipclicked');			
		
			t.adRestoreMainMedia();
		},
		
		// fires off fake XHR requests
		adsLoadUrl: function(url) {
			console.log('adsLoadUrl', url);		
			
			var img = new Image(),
				rnd = Math.round(Math.random()*100000);
				
			img.src = url + ((url.indexOf('?') > 0) ? '&' : '?') + 'random' + rnd + '=' + rnd;
			img.loaded = function() {
				img = null;
			}
		}
		
	});

})(mejs.$);
