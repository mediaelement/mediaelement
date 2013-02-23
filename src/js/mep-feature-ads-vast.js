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
'.mejs-vast a {' +
'	display: block; ' +
'	position: absolute;' + 
'	right: 0;' + 
'	top: 0;' +
'	width: 100%; ' +
'	height: 100%; ' +
'	display: block; ' + 
'}' + 
'.mejs-vast .mejs-vast-skip-block {' + 
'	display: block; ' +
'	position: absolute;' + 
'	right: 0;' + 
'	top: 0;' +
'	padding: 10px; ' +
'	background: #000; ' + 
'	background: rgba(0,0,0,0.5); ' +
'	color: #fff; ' + 
'}' + 
'.mejs-vast .mejs-vast-skip-button {' + 
'	cursor: pointer; ' + 
'}' + 
'.mejs-vast .mejs-vast-skip-button:hover {' + 
'	text-decoration: underline; ' + 
'}' + 
	'</style>'));
	

	$.extend(mejs.MepDefaults, {
		// URL to vast data: 'http://minotovideo.com/sites/minotovideo.com/files/upload/eday_vast_tag.xml'
		vastAdTagUrl: '',
		
		// if true, allows user to skip the pre-roll ad
		vastEnableSkip: false,
		
		// if vastEnableSkip=true and this is a positive number, it will only allow skipping after the time has elasped
		vastSkipSeconds: -1
	});

	$.extend(MediaElementPlayer.prototype, {
		buildvast: function(player, controls, layers, media) {

			var t = this;			
				
			// add layer for ad links and skipping
			player.vastAdLayer = 
					$('<div class="mejs-layer mejs-overlay mejs-vast">' + 
							'<a href="#" target="_blank">&nbsp;</a>' + 
							'<div class="mejs-vast-skip-block">' + 
								'<span class="mejs-vast-skip-message"></span>' +
								'<span class="mejs-vast-skip-button">Skip Ad &raquo;</span>' +
							'</div>' +
						'</div>')
							.insertBefore( layers.find('.mejs-overlay-play') )
							.hide();
			
			player.vastAdLayer.find('a')
						.on('click', $.proxy(t.vastAdClick, t) );

			player.vastSkipBlock = player.vastAdLayer.find('.mejs-vast-skip-block').hide();
			player.vastSkipMessage = player.vastAdLayer.find('.mejs-vast-skip-message').hide();			
										
			player.vastSkipButton = player.vastAdLayer.find('.mejs-vast-skip-button')
														.on('click', $.proxy(t.vastAdSkipClick, t) );
							
							
			// create proxies (only needed for events we want to remove later)
			t.vastTryingToStartProxy = 		$.proxy(t.vastTryingToStart, t);
			t.vastPrerollStartedProxy = 	$.proxy(t.vastPrerollStarted, t);
			t.vastPrerollUpdateProxy = 		$.proxy(t.vastPrerollUpdate, t);
			t.vastPrerollEndedProxy = 		$.proxy(t.vastPrerollEnded, t);
			
			// check for start
			t.media.addEventListener('play', 			t.vastTryingToStartProxy );
			t.media.addEventListener('playing', 		t.vastTryingToStartProxy );
			t.media.addEventListener('canplay', 		t.vastTryingToStartProxy );
			t.media.addEventListener('loadedmetadata', 	t.vastTryingToStartProxy );			
			
			if (player.options.vastAdTagUrl != '') {
				t.vastLoadAdTagInfo();
			}	
			
		},
		
		
		vastTryingToStart: function() {
			
			var t = this;
		
			// make sure to pause until the ad data is loaded
			if (t.vastAdTagIsLoading && !t.media.paused) {
				t.media.pause();
				
				t.vastStartedPlaying = true;
			}
			
			
		},		
		
		vastCurrentMediaUrl: '',
		
		vastAdTagIsLoading: false,
		
		vastAdTagIsLoaded: false,
		
		vastStartedPlaying: false,
		
		vastAdTags: [],

		vastSetAdTagUrl: function(url) {
		
			var t = this;		
		
			// set and reset
			t.options.vastAdTagUrl = url;
			t.options.vastAdTagIsLoaded = false;
			t.vastAdTags = [];
		},
		
		vastLoadAdTagInfo: function() {
			console.log('loading vast ad data');
			
			var t = this;
			
			t.vastAdTagIsLoading = true;
			
			// try straigh load first
			t.loadAdTagInfoDirect();
		}, 
		
		loadAdTagInfoDirect: function() {
			console.log('loading vast:direct');
			
			var t= this;
			
			$.ajax({
				url: t.options.vastAdTagUrl,
				crossDomain: true,
				success: function(data) {
					console.log('vast:direct:success', data);
					
					t.vastParseVastData(data)				
				},
				error: function(err) {
					console.log('vast:direct:error', err);
					
					// fallback to Yahoo proxy
					t.loadAdTagInfoProxy();
				}	
			});
		},
		
		loadAdTagInfoProxy: function() {
			console.log('loading vast:proxy:yahoo');
			
			var t = this,
				protocol = location.protocol,
				hostname = location.hostname,
				exRegex = RegExp(protocol + '//' + hostname),
				query = 'select * from xml where url="' + encodeURI(t.options.vastAdTagUrl) +'"',
				yahooUrl = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?format=xml&q=' + query;


			
			$.ajax({
				url: yahooUrl,
				crossDomain: true,
				success: function(data) {
					console.log('vast:proxy:yahoo:success', data);	
					
					t.vastParseVastData(data);			
				},
				error: function(err) {
					console.log('vast:proxy:yahoo:error', err);
				}	
			});
		},
		
		vastParseVastData: function(data) {
			
			var t = this;
			
			// clear out data
			t.vastAdTags = [];
			
			$(data).find('Ad').each(function(index, node) {
					
				var 
					adNode = $(node),
					
					adTag = {					
						id: adNode.attr('id'),
						title: $.trim( adNode.find('AdTitle').text() ),
						description: $.trim( adNode.find('Description').text() ),
						impressions: [],
						clickThrough: $.trim( adNode.find('ClickThrough').text() ),
						mediaFiles: [],
						trackingEvents: {},
						
						// internal tracking if it's been used
						shown: false
					};	
					
				t.vastAdTags.push(adTag);				
				
					
				// parse all needed nodes
				adNode.find('Impression').each(function() {
					adTag.impressions.push( $.trim( $(this).text() ) );
				});	
				
				adNode.find('Tracking').each(function(index, node) {
					var trackingEvent = $(node);
				
					adTag.trackingEvents[trackingEvent.attr('event')] = $.trim( trackingEvent.text() );
					
				});		
				
		
				adNode.find('MediaFile').each(function(index, node) {
					var mediaFile = $(node);
				
					adTag.mediaFiles.push({
						id: mediaFile.attr('id'),
						delivery: mediaFile.attr('delivery'),
						type: mediaFile.attr('type'),
						bitrate: mediaFile.attr('bitrate'),
						width: mediaFile.attr('width'),
						height: mediaFile.attr('height'),
						url:  $.trim( mediaFile.text() )
					} );
				});		
				
			});
		
			// DONE
			t.vastLoaded();
		},

		
		vastLoaded: function() {
			var t = this;
			
			t.vastAdTagIsLoaded = true;
			t.vastAdTagIsLoading = false;
			
			// store current URL
			t.vastCurrentMediaUrl = t.media.src;
			
			// attach events
			t.media.addEventListener('timeupdate', $.proxy(t.vastShowAds, t) );
			
			t.vastStartPreroll();
		},
		
		vastShowAds: function() {
			var t = this;
			
			// TODO: look through stack for ads (midroll, overlay, etc.)
		},
		
		vastStartPreroll: function() {
			console.log('vastStartPreroll');
						
			var t = this,
				prerollMediaUrl = t.vastAdTags[0].mediaFiles[0].url;
				
			t.media.addEventListener('playing', 	t.vastPrerollStartedProxy );
			t.media.addEventListener('ended', 		t.vastPrerollEndedProxy )
			t.media.addEventListener('timeupdate', 	t.vastPrerollUpdateProxy );
			
			// change URLs to the preroll ad
			t.vastCurrentMediaUrl = t.media.src;			
			t.media.setSrc(prerollMediaUrl);
			t.media.load();
			
			// if autoplay was on, or if the user pressed play 
			// while the ad data was still loading, then start the ad right away
			if (t.vastStartedPlaying) {
				t.media.play();
			}
		},
		
		vastPrerollStarted: function() {
			console.log('vastPrerollStarted');
		
			var t = this;
			t.media.removeEventListener('playing', t.vastPrerollStartedProxy);		
			
			// turn off controls until the preroll is done
			t.disableControls();
			t.hideControls();
			
			// enable clicking through
			t.vastAdLayer.show();
			t.vastAdLayer.find('a').attr('href', t.vastAdTags[0].clickThrough);
			
			// possibly allow the skip button to work
			if (t.options.vastEnableSkip) {
				t.vastSkipBlock.show();

				if (t.options.vastSkipSeconds > 0) {
					t.vastSkipMessage.html('Skip in ' + t.options.vastSkipSeconds.toString() + ' seconds.').show();
					t.vastSkipButton.hide();					
				} else {
					t.vastSkipMessage.hide();
					t.vastSkipButton.show();					
				}
			} else {
				t.vastSkipBlock.hide();
			}
			
			// send click events
			if (t.vastAdTags[0].trackingEvents['start']) {
				t.vastLoadUrl(t.vastAdTags[0].trackingEvents['start']);
			}
			
			t.vastAdTags[0].shown = true;
		},

		vastPrerollUpdate: function() {
			console.log('vastPrerollUpdate');
		
			var t = this;
			
			if (t.options.vastEnableSkip && t.options.vastSkipSeconds > 0) {
				// update message
				if (t.media.currentTime > t.options.vastSkipSeconds) {
					t.vastSkipButton.show();
					t.vastSkipMessage.hide();				
				} else {
					t.vastSkipMessage.html('Skip in ' + Math.round( t.options.vastSkipSeconds - t.media.currentTime ).toString() + ' seconds.')
				}
			
			}
			
			
		},
		
		vastPrerollEnded: function() {
			console.log('vastPrerollEnded');
			
			var t = this;

			if (t.vastAdTags[0].trackingEvents['complete']) {
				t.vastLoadUrl(t.vastAdTags[0].trackingEvents['complete']);
			}		
			
			t.vastRestoreMainMedia();
		},
		
		vastRestoreMainMedia: function() {

			var t = this;
			
			t.media.setSrc(t.vastCurrentMediaUrl);
			t.media.load();
			t.media.play();
			
			t.enableControls();
			t.showControls();	
			
			t.vastAdLayer.hide();				
			
			t.media.removeEventListener('ended', 		t.vastPrerollEndedProxy);
			t.media.removeEventListener('timeupdate', 	t.vastPrerollUpdateProxy);				
		},

		vastAdClick: function() {
			console.log('vastAdClicked');
			
			var t = this;
			
			if (t.media.paused) {
				t.media.play();
			} else {
				t.media.pause();
			}
			
			// open in new window?
		},
		
		vastAdSkipClick: function() {
			console.log('vastAdSkipClick');		

			var t = this;
			
			t.vastRestoreMainMedia();		
		},
		
		vastLoadUrl: function(url) {
			console.log('vastLoadUrl', url);		
			
			var img = new Image(),
				rnd = Math.round(Math.random()*100000);
				
			img.src = url + ((url.indexOf('?') > 0) ? '&' : '?') + 'random' + rnd + '=' + rnd;
			img.loaded = function() {
				img = null;
			}
		}
		
	});

})(mejs.$);
