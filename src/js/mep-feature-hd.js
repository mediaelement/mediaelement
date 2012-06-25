(function($) {

	$.extend(mejs.MepDefaults, {
		hdText: 'HD/SD'
	});

	// HD/SD BUTTON
	$.extend(MediaElementPlayer.prototype, {
		buildhd: function(player, controls, layers, media) {
				var t = this;
				var srcType = '';
				var currentSrc = '';
				var currentTime = 0;
				var paused = true;
				var typeSrcs = {
					'type' : Array(),
					'quality' : Array(),
					'src' : Array()
				};
				var hdbtn = 
				$('<div class="mejs-button mejs-hd-button mejs-sd" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.hdText + '"></button>' +
				'</div>')
				.appendTo(controls)
				
				// handle clicks to the language radio buttons
				.delegate('.mejs-hd-button > button', 'click', function() {
					
					currentSrc = media.currentSrc;
					paused = media.paused;
					currentTime = media.currentTime;
					
					// find original source element
					for (i in media.children) {
						src = media.children[i];
						if (src.nodeName === 'SOURCE' && src.src == currentSrc) {
							//we found the original source element.
							srcType = $(src).attr('type');
						}
					}
					
					if (srcType != '' && !typeSrcs.src.length) {
						// store list of types + data-quality
						
						for (i in media.children) {
							src = media.children[i];
							if (
								src.nodeName === 'SOURCE'
								&& $(src).attr('type') == srcType
								&& typeSrcs.src.indexOf($(src).attr('src'))
								) {
									typeSrcs.type.push( $(src).attr('type') );
									typeSrcs.src.push( $(src).attr('src') );
									if ($(src).attr('data-quality')) {
										typeSrcs.quality.push($(src).attr('data-quality'));
									} else {
										typeSrcs.quality.push('sd');
									}
								}
						}
					}
					
					
					if (hdbtn.hasClass('mejs-sd')) {
						//make it HD
						switchVideoSource(media, typeSrcs, 'hd');
						hdbtn.removeClass('mejs-sd').addClass('mejs-hd');
					} else {
						//make it SD
						switchVideoSource(media, typeSrcs, 'sd');
						hdbtn.removeClass('mejs-hd').addClass('mejs-sd');
					}
					
					// wait for js
					setTimeout(function() {
						if (!paused) {
							$('.mejs-playpause-button').click();
						}
						// wait until ready to play
						media.addEventListener('loadeddata', function (e) {
							media.setCurrentTime(currentTime);
							//media.play();
							
						}, false);						
					}, 250);					
					
					
				});
							
		}
	});
	
	function switchVideoSource( media, typeSrcs, quality ) {
		for (i in typeSrcs.type) {
			q = typeSrcs.quality[i];
			if (q === quality) {
				media.pause();
				media.setSrc(typeSrcs.src[i]);
			}
		}
	}
	
})(mejs.$);