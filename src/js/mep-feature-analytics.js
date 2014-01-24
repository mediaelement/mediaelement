/*
* Google Analytics Plugin
* a plugin for the new analytics.js system
* See https://developers.google.com/analytics/devguides/collection/analyticsjs/
* if you use https://developers.google.com/analytics/devguides/collection/gajs/ 
* see mep-feature-googleanalytics
*/

(function($) {

$.extend(mejs.MepDefaults, {
	analyticsTitle: '',
	analyticsCategory: 'Videos',
	analyticsEventPlay: 'Play',
	analyticsEventPause: 'Pause',
	analyticsEventEnded: 'Ended',
	analyticsEventTime: 'Time'
});


$.extend(MediaElementPlayer.prototype, {
	buildanalytics: function(player, controls, layers, media) {
			
		media.addEventListener('play', function() {
			ga('send', 'event',
				player.options.analyticsCategory, 
				player.options.analyticsEventPlay, 
				(player.options.analyticsTitle === '') ? player.currentSrc : player.options.analyticsTitle
			);			
		}, false);
		
		media.addEventListener('pause', function() {
			ga('send', 'event',
				player.options.analyticsCategory, 
				player.options.analyticsEventPause, 
				(player.options.analyticsTitle === '') ? player.currentSrc : player.options.analyticsTitle
			);
		}, false);	
		
		media.addEventListener('ended', function() {
			ga('send', 'event',
				player.options.analyticsCategory, 
				player.options.analyticsEventEnded, 
				(player.options.analyticsTitle === '') ? player.currentSrc : player.options.analyticsTitle
			);
		}, false);
		
		/*
		media.addEventListener('timeupdate', function() {
			ga('send', 'event',
				player.options.analyticsCategory, 
				player.options.analyticsEventEnded, 
				player.options.googleAnalyticsTime,
				(player.options.analyticsTitle === '') ? player.currentSrc : player.options.analyticsTitle,
				player.currentTime
			);
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.analyticsCategory, 
					player.options.analyticsEventEnded, 
					player.options.googleAnalyticsTime,
					(player.options.analyticsTitle === '') ? player.currentSrc : player.options.analyticsTitle,
					player.currentTime
				]);
			}
		}, true);
		*/
	}
});
	
})(mejs.$);
