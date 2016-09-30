/**
 * Postroll plugin
 */
(function($) {

	$.extend(mejs.MepDefaults, {
		postrollCloseText: ''
	});

	// Postroll
	$.extend(MediaElementPlayer.prototype, {
		buildpostroll: function(player, controls, layers, media) {
			var
				t = this,
				postrollTitle = t.options.postrollCloseText ? t.options.postrollCloseText : mejs.i18n.t('mejs.close'),
				postrollLink = t.container.find('link[rel="postroll"]').attr('href');

			if (typeof postrollLink !== 'undefined') {
				player.postroll =
					$('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + postrollTitle + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(layers).hide();

				t.media.addEventListener('ended', function (e) {
					$.ajax({
						dataType: 'html',
						url: postrollLink,
						success: function (data, textStatus) {
							layers.find('.mejs-postroll-layer-content').html(data);
						}
					});
					player.postroll.show();
				}, false);
			}
		}
	});

})(mejs.$);