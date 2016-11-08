/*
 *
 * Requires JQuery
 */
/**
 * Google Analytics Plugin
 *
 * This feature enables GA to send certain events, such as play, pause, ended, etc. It requires previous configuration
 * on GA to send events properly.
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 */
(function ($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * @type {String}
		 */
		googleAnalyticsTitle: '',
		/**
		 * @type {String}
		 */
		googleAnalyticsCategory: 'Videos',
		/**
		 * @type {String}
		 */
		googleAnalyticsEventPlay: 'Play',
		/**
		 * @type {String}
		 */
		googleAnalyticsEventPause: 'Pause',
		/**
		 * @type {String}
		 */
		googleAnalyticsEventEnded: 'Ended',
		/**
		 * @type {String}
		 */
		googleAnalyticsEventTime: 'Time'
	});


	$.extend(MediaElementPlayer.prototype, {

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildgoogleanalytics: function (player, controls, layers, media) {

			media.addEventListener('play', function () {
				if (typeof ga != 'undefined') {
					ga('send', 'event',
						player.options.googleAnalyticsCategory,
						player.options.googleAnalyticsEventPlay,
						(player.options.googleAnalyticsTitle === '') ? player.media.currentSrc : player.options.googleAnalyticsTitle
					);
				}
			}, false);

			media.addEventListener('pause', function () {
				if (typeof ga != 'undefined') {
					ga('send', 'event',
						player.options.googleAnalyticsCategory,
						player.options.googleAnalyticsEventPause,
						(player.options.googleAnalyticsTitle === '') ? player.media.currentSrc : player.options.googleAnalyticsTitle
					);
				}
			}, false);

			media.addEventListener('ended', function () {
				if (typeof ga != 'undefined') {
					ga('send', 'event',
						player.options.googleAnalyticsCategory,
						player.options.googleAnalyticsEventEnded,
						(player.options.googleAnalyticsTitle === '') ? player.media.currentSrc : player.options.googleAnalyticsTitle
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
			 (player.options.googleAnalyticsTitle === '') ? player.media.currentSrc : player.options.googleAnalyticsTitle,
			 player.currentTime
			 );
			 }
			 }, true);
			 */
		}
	});

})(mejs.$);
