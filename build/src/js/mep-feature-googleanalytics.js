/*
* Google Analytics Plugin
* Requires
*
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
	buildgoogleanalytics: function(player, controls, layers, media) {
			
		media.addEventListener('play', function() {
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPlay, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				]);
			}
		}, false);
		
		media.addEventListener('pause', function() {
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventPause, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				]);
			}
		}, false);	
		
		media.addEventListener('ended', function() {
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle
				]);
			}
		}, false);
		
		/*
		media.addEventListener('timeupdate', function() {
			if (typeof _gaq != 'undefined') {
				_gaq.push(['_trackEvent', 
					player.options.googleAnalyticsCategory, 
					player.options.googleAnalyticsEventEnded, 
					player.options.googleAnalyticsTime,
					(player.options.googleAnalyticsTitle === '') ? player.currentSrc : player.options.googleAnalyticsTitle,
					player.currentTime
				]);
			}
		}, true);
		*/
	}
});
	
})(mejs.$);