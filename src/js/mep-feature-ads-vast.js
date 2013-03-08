
// VAST ads plugin
// Sponsored by Minoto Video

(function($) {
	
	$.extend(mejs.MepDefaults, {
		// URL to vast data: 'http://minotovideo.com/sites/minotovideo.com/files/upload/eday_vast_tag.xml'
		vastAdTagUrl: ''
	});

	$.extend(MediaElementPlayer.prototype, {
		buildvast: function(player, controls, layers, media) {

			var t = this;			
			
			// begin loading
			if (t.options.vastAdTagUrl != '') {
				t.vastLoadAdTagInfo();
			}
		
			// make sure the preroll ad system is ready (it will ensure it can't be called twice)
			t.buildads(player, controls, layers, media);	
			
			
			t.vastSetupEvents();					
		},
		
		vastAdTagIsLoading: false,
		
		vastAdTagIsLoaded: false,
		
		vastStartedPlaying: false,
		
		vastAdTags: [],
		
		vastSetupEvents: function() {
			var t = this;
			
			
			// START: preroll
			t.container.on('mejsprerollstarted', function() {			
				
				console.log('VAST','mejsprerollstarted');
				
				if (t.vastAdTags.length > 0) {
				
					var adTag = t.vastAdTags[0];
					
					// always fire this event
					if (adTag.trackingEvents['start']) {
						t.adsLoadUrl(adTag.trackingEvents['start']);
					}

					// only do impressions once
					if (!adTag.shown && adTag.impressions.length > 0) {
						
						for (var i=0, il=adTag.impressions.length; i<il; i++) {
							t.adsLoadUrl(adTag.impressions[i]);
						}
					}
					
					adTag.shown = true;
				}
				
			});
			
			// END: preroll
			t.container.on('mejsprerollended', function() {			

				console.log('VAST','mejsprerollended');
				
				if (t.vastAdTags.length > 0 && t.vastAdTags[0].trackingEvents['complete']) {
					t.adsLoadUrl(t.vastAdTags[0].trackingEvents['complete']);
				}
				
			});			
			
		},

		vastSetAdTagUrl: function(url) {
		
			var t = this;		
		
			// set and reset
			t.options.vastAdTagUrl = url;
			t.vastAdTagIsLoaded = false;
			t.vastAdTags = [];
		},
		
		vastLoadAdTagInfo: function() {
			console.log('loading vast ad data');
			
			var t = this;
			
			// set this to stop playback
			t.adsDataIsLoading = true;
			t.vastAdTagIsLoading = true;
			
			// try straight load first
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
					var mediaFile = $(node),
						type = mediaFile.attr('type');
						
					if (t.media.canPlayType(type).toString().replace(/no/,'').replace(/false/,'') != '') {
					
						adTag.mediaFiles.push({
							id: mediaFile.attr('id'),
							delivery: mediaFile.attr('delivery'),
							type: mediaFile.attr('type'),
							bitrate: mediaFile.attr('bitrate'),
							width: mediaFile.attr('width'),
							height: mediaFile.attr('height'),
							url:  $.trim( mediaFile.text() )
						} );
						
					}
				});		
				
			});
		
			// DONE
			t.vastLoaded();
		},

		vastLoaded: function() {
			var t = this;
			
			t.vastAdTagIsLoaded = true;
			t.vastAdTagIsLoading = false;
			t.adsDataIsLoading = false;
					
			t.vastStartPreroll();
		},
		
		vastStartPreroll: function() {
			console.log('vastStartPreroll');
						
			var t = this;
				
			// if we have a media URL, then send it up to the ads plugin as a preroll
			if (t.vastAdTags.length > 0 && t.vastAdTags[0].mediaFiles.length > 0) {
				
				t.options.adsPrerollMediaUrl = t.vastAdTags[0].mediaFiles[0].url;
				t.adsStartPreroll();
			}
		}
		
	});

})(mejs.$);
