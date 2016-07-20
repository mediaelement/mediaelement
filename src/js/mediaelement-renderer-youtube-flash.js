(function(win, doc, shimi, undef) {

// requires the flash renderers are present
if (mejs.FlashMediaElementRenderer && mejs.PluginDetector.hasPluginVersion('flash',[10,0,0])) {

	var YouTubeFlashRenderer = {
		
		// name
		name: 'flash_youtube',
		
		// renderer wrapper
		create: shimi.FlashMediaElementRenderer.create,
		
		// if Flash is installed, returns an array of ogg type values
		canPlayType: function(type) {
			var
				supportedMediaTypes = ['video/youtube', 'video/x-youtube'];
	
			return supportedMediaTypes.indexOf(type) > -1;
		},
	
		options: {
			prefix: 'flash_youtube',
			filename: 'mediaelement-flash-youtube.swf'
		}
	};
	
	mejs.Renderers.add(YouTubeFlashRenderer);
}

})(window, document, window.mejs || {});