/*
* analytics.js Google Analytics Plugin
* Requires JQuery
*/

(function($) {

$.extend(mejs.MepDefaults, {
	googleAnalyticsTitle: '',
	googleAnalyticsCategory: 'Videos',
	googleAnalyticsEventPlay: 'Play',
	googleAnalyticsEventPause: 'Pause',
	googleAnalyticsEventEnded: 'Ended',
	googleAnalyticsEventTime: 'Time'
});


$.extend(MediaElementPlayer.prototype, {
	builduniversalgoogleanalytics: function(player, controls, layers, media) {
			
		media.addEventListener('play', function() {
			if (typeof ga != 'undefined') {
				ga('send', 'event',
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPlay, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				);
			}
		}, false);
		
		media.addEventListener('pause', function() {
			if (typeof ga != 'undefined') {
				ga('send', 'event',
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPause, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				);
			}
		}, false);	
		
		media.addEventListener('ended', function() {
			if (typeof ga != 'undefined') {
				ga('send', 'event',
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				);
			}
		}, false);
		
		/*
		media.addEventListener('timeupdate', function() {
			if (typeof ga != 'undefined') {
				ga('send', 'event',
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					player.options.googleAnalyticsTime,
				  (player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle,
					player.currentTime
				);
			}
		}, true);
		*/
	}
});
	
})(mejs.$);