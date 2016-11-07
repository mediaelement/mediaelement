(function(mejs, win, doc, undefined) {
"use strict";

/// LIBRARIES

// Jon Resig's events
function addEvent( obj, type, fn ) {
	if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
	} else if ( obj.attachEvent ) {
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
		obj.attachEvent( 'on'+type, obj[type+fn] );
	}

}

function removeEvent( obj, type, fn ) {

	if (obj.removeEventListener) {
		obj.removeEventListener( type, fn, false );
	} else if ( obj.detachEvent ) {
		obj.detachEvent( 'on'+type, obj[type+fn] );
		obj[type+fn] = null;
	}
}

function getElementsByClassName(className, node, tag) {

	if (node === undefined || node === null) {
		node = document;
	}
	if (node.getElementsByClassName !== undefined && node.getElementsByClassName !== null) {
		return node.getElementsByClassName(className);
	}
	if (tag === undefined || tag === null) {
		tag = '*';
	}

	var classElements = [];
	var j = 0, teststr;
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;

	for (i = 0; i < elsLen; i++) {
		if (els[i].className.indexOf(class_name) != -1) {
			teststr = "," + els[i].className.split(" ").join(",") + ",";
			if (teststr.indexOf("," + class_name + ",") != -1) {
				classElements[j] = els[i];
				j++;
			}
		}
	}
	return classElements;
}

function getMousePosition(e) {
	var x = 0,
		y = 0;

	if (!e) e = window.event;

	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else if (e.clientX || e.clientY) 	{
		x = e.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;

		y = e.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
	}

	return { x: x, y: y};
}

function getNodePosition(obj) {
	var curleft = 0,
		curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while ((obj = obj.offsetParent));

		return { x: curleft, y: curtop };
	}
}

function getStyle(idOrObj, styleProp) {
	var obj = typeof idOrObj === 'string' ? document.getElementById(id) : idOrObj,
		val;
	if (obj.currentStyle) {
		val = obj.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		val = document.defaultView.getComputedStyle(obj,null).getPropertyValue(styleProp);
	}
	return val;
}


// Fade effect from scriptiny.com
var fadeEffect = {
	init:function(id, flag, target){
		this.elem = doc.getElementById(id);
		clearInterval(this.elem.si);
		this.target = target ? target : flag ? 100 : 0;
		this.flag = flag || -1;
		this.alpha = this.elem.style.opacity ? parseFloat(this.elem.style.opacity) * 100 : 0;
		this.elem.si = setInterval(function(){fadeEffect.tween();}, 5);
	},
	tween:function(){
		if (this.alpha == this.target) {
			clearInterval(this.elem.si);
		} else {
			var value = Math.round(this.alpha + ((this.target - this.alpha) * 0.05)) + (1 * this.flag);
			this.elem.style.opacity = value / 100;
			this.elem.style.filter = 'alpha(opacity=' + value + ')';
			this.alpha = value;
		}
	}
};

mejs.addEvent = addEvent;
mejs.removeEvent = removeEvent;
mejs.getElementsByClassName = getElementsByClassName;

mejs.id = 1000;

mejs.MediaElementPlayerSimpleDefaults = {
	playText: mejs.i18n.t('Play'),
	pauseText: mejs.i18n.t('Pause')
};

function MediaElementPlayerSimple(idOrObj, options) {

	var original = typeof(idOrObj) === 'string' ? doc.getElementById(idOrObj) : idOrObj,

		id = original && original.id ? original.id : 'mejs_' + mejs.id++,

		autoplay = original && original.autoplay !== undefined && original.autoplay === true,

		tagName = original.tagName.toLowerCase(),

		isVideo = (tagName === 'video' || tagName === 'iframe'),

		container = doc.createElement('div'),
		controls = doc.createElement('div'),

		originalWidth = isVideo ?
						original.offsetWidth > 0 ? original.offsetWidth : parseInt(original.width) :
						350,

		originalHeight = isVideo ?
						original.offsetHeight > 0 ? original.offsetHeight : parseInt(original.height) :
						50,
		mediaElement = null,

		t = this;

	t.id = id;
	t.options = options;
	t.original = original;
	t.isVideo = isVideo;

	// Container
	container.id = id + '_container';
	container.className = 'mejs-simple-container mejs-simple-' + original.tagName.toLowerCase();
	container.style.width = originalWidth + 'px';
	container.style.height = originalHeight + 'px';

	// Create SHIM
	original.parentElement.insertBefore(container, original);
	original.removeAttribute('controls');
	controls.style.opacity = 1.0;
	container.appendChild(original);

	mediaElement = mejs.MediaElement(original, t.options);
	t.mediaElement = mediaElement;

	mediaElement.addEventListener('click', function() {
		if (mediaElement.paused) {
			mediaElement.play();
		} else {
			mediaElement.pause();
		}
	});

	t.container = container;
	t.controls = controls;
	t.options = mejs.Utils.extend(mejs.MediaElementPlayerSimpleDefaults, t.options);

	t.createUI();

	t.createPlayPause(mediaElement, controls);
	t.createCurrentTime(mediaElement, controls);
	t.createProgress(mediaElement, controls);
	t.createDuration(mediaElement, controls);
	t.createMute(mediaElement, controls);
	t.createFullscreen(mediaElement, controls);

	t.resizeControls();

	if (autoplay) {
		mediaElement.play();
	}

	return t;
}

MediaElementPlayerSimple.prototype = {

	createUI: function() {

		var t = this,
			id = this.id,
			controls = t.controls,
			container = t.container,
			mediaElement = t.mediaElement,
			isVideo = t.isVideo,
			isPlaying = false;
			// original = t.original,
			// originalWidth = isVideo ?
			// 				original.offsetWidth > 0 ? original.offsetWidth : parseInt(original.width) :
			//				350;

		// CONTROLS
		controls.className = 'mejs-simple-controls';
		controls.id = id + '_controls';
		container.appendChild(controls);

		if (isVideo) {
			//controls.style.width = (originalWidth - 20) + 'px';
		}

		addEvent(controls, 'mouseover', function() {
			clearControlsTimeout();
		});

		mediaElement.addEventListener('play', function() {
			isPlaying = true;
		});
		mediaElement.addEventListener('playing', function() {
			isPlaying = true;
		});
		mediaElement.addEventListener('pause', function() {
			isPlaying = false;
		});
		mediaElement.addEventListener('ended', function() {
			isPlaying = false;
		});
		mediaElement.addEventListener('seeked', function() {
			isPlaying = true;
		});

		mediaElement.addEventListener('mouseover', function() {
			clearControlsTimeout();
			showControls();
		});

		mediaElement.addEventListener('mouseout', mouseLeave);
		mediaElement.addEventListener('mouseleave', mouseLeave);

		function mouseLeave() {
			if (isVideo && isPlaying) {
				startControlsTimeout();
			}
		}

		var controlsTimeout = null;

		function startControlsTimeout() {
			clearControlsTimeout();

			controlsTimeout = setTimeout(function() {
				hideControls();
			}, 200);
		}

		function clearControlsTimeout() {
			if (controlsTimeout !== null) {
				clearTimeout(controlsTimeout);
				controlsTimeout = null;
			}
		}

		function showControls() {
			//controls.style.display = '';
			fadeEffect.init(id + '_controls', 1);
		}
		function hideControls() {
			//controls.style.display = 'none';
			fadeEffect.init(id + '_controls', 0);
		}

		addEvent(win, 'resize', function() { t.resizeControls(); });

	},

	resizeControls: function() {

		var
			t = this,
			controls = t.controls,
			progress = null,
			combinedControlsWidth = 0,
			controlsBoundaryWidth = controls.offsetWidth;

		for (var i=0, il=controls.childNodes.length; i<il; i++) {
			var control = controls.childNodes[i], horizontalSize;

			if (control.className.indexOf('ui-time-total') > -1) {
				progress = control;

				horizontalSize =
									parseInt(getStyle(control, 'margin-left'),10) +
									parseInt(getStyle(control, 'margin-right'),10) ;

				combinedControlsWidth += horizontalSize;

			} else {
				horizontalSize =
									parseInt(getStyle(control, 'width'),10) +
									parseInt(getStyle(control, 'margin-left'),10) +
									parseInt(getStyle(control, 'margin-right'),10) ;

				combinedControlsWidth += horizontalSize;
			}
		}

		if (progress !== null && !isNaN(controlsBoundaryWidth) && !isNaN(combinedControlsWidth)) {
			progress.style.width = (controlsBoundaryWidth - combinedControlsWidth) + 'px';
		}
	},

	createPlayPause: function(mediaElement, controls) {
		var t = this,
			uiPlayBtn = doc.createElement('input'),
			options = t.options;

		uiPlayBtn.className = 'ui-button ui-button-play';
		//uiPlayBtn.disabled = true;
		uiPlayBtn.type = 'button';

		uiPlayBtn.title = options.playText;
		uiPlayBtn.setAttribute('aria-label', options.playText);
		uiPlayBtn.setAttribute('aria-controls', mediaElement.id);
		controls.appendChild(uiPlayBtn);

		addEvent(uiPlayBtn, 'click', function() {
			if (mediaElement.getPaused()) {
				mediaElement.play();
			} else {
				mediaElement.pause();
			}
		});

		// events
		mediaElement.addEventListener('play', function() {
			uiPlayBtn.className = uiPlayBtn.className.replace(/\s*ui-button-play\s*/gi,'') + ' ui-button-pause';
			uiPlayBtn.title = options.pauseText;
			uiPlayBtn.setAttribute('aria-label', options.pauseText);
		}, false);

		mediaElement.addEventListener('pause', function() {
			uiPlayBtn.className = uiPlayBtn.className.replace(/\s*ui-button-pause\s*/gi,'') + ' ui-button-play';
			uiPlayBtn.title = options.playText;
			uiPlayBtn.setAttribute('aria-label', options.playText);
		}, false);

		mediaElement.addEventListener('loadstart', function() {
			uiPlayBtn.className = uiPlayBtn.className.replace(/\s*ui-button-pause\s*/gi,'') + ' ui-button-play';
			uiPlayBtn.title = options.playText;
			uiPlayBtn.setAttribute('aria-label', options.playText);
		});
	},

	createMute: function(mediaElement, controls) {
		var uiMuteBtn = doc.createElement('input');

		uiMuteBtn.className = 'ui-button ui-button-unmuted';
		//uiMuteBtn.disabled = true;
		uiMuteBtn.type = 'button';
		controls.appendChild(uiMuteBtn);

		addEvent(uiMuteBtn, 'click', function() {

			console.log('mute clicked');
			console.log('--', mediaElement.muted);

			mediaElement.muted = !mediaElement.muted;

		});

		mediaElement.addEventListener('volumechange', function() {
			if (mediaElement.muted) {
				uiMuteBtn.className = uiMuteBtn.className.replace(/ui-button-unmuted/gi,'') + ' ui-button-muted';
			} else {
				uiMuteBtn.className = uiMuteBtn.className.replace(/ui-button-muted/gi,'') + ' ui-button-unmuted';
			}
		}, false);
	},

	createCurrentTime: function(mediaElement, controls) {
		var uiCurrentTime = doc.createElement('span');

		uiCurrentTime.className = 'ui-time';
		uiCurrentTime.innerHTML = '00:00';
		controls.appendChild(uiCurrentTime);

		mediaElement.addEventListener('timeupdate', function() {

			var currentTime = mediaElement.currentTime;
			if (!isNaN(currentTime)) {
				uiCurrentTime.innerHTML = mejs.Utils.secondsToTimeCode(currentTime);
			}
		}, false);

		mediaElement.addEventListener('loadedmetadata', function() {
			uiCurrentTime.innerHTML = mejs.Utils.secondsToTimeCode(0);
		}, false);

	},

	createProgress: function(mediaElement, controls) {
		var uiTimeBarTotal = doc.createElement('div'),
			uiTimeBarLoaded = doc.createElement('div'),
			uiTimeBarCurrent = doc.createElement('div');

		// time bar!
		uiTimeBarTotal.className = 'ui-time-total';
		controls.appendChild(uiTimeBarTotal);

		uiTimeBarLoaded.className = 'ui-time-loaded';
		uiTimeBarTotal.appendChild(uiTimeBarLoaded);

		uiTimeBarCurrent.className = 'ui-time-current';
		uiTimeBarTotal.appendChild(uiTimeBarCurrent);

		mediaElement.addEventListener('timeupdate', function() {
			var outsideWidth = uiTimeBarTotal.offsetWidth,
				percent = mediaElement.currentTime / mediaElement.duration;

			uiTimeBarCurrent.style.width = (outsideWidth * percent) + 'px';
		});
		mediaElement.addEventListener('loadstart', function() {
			uiTimeBarCurrent.style.width = '0px';
			uiTimeBarLoaded.style.width = '0px';
		});
		mediaElement.addEventListener('loadedmetadata', function() {
			uiTimeBarCurrent.style.width = '0px';
			uiTimeBarLoaded.style.width = '0px';
		});

		mediaElement.addEventListener('progress', function() {

			var buffered = mediaElement.buffered,
				duration = mediaElement.duration,
				outsideWidth = uiTimeBarTotal.offsetWidth,
				percent = 0;

			if (buffered && buffered.length > 0 && buffered.end && duration) {
				// TODO: account for a real array with multiple values (only Firefox 4 has this so far)
				percent = buffered.end(0) / duration;

				uiTimeBarLoaded.style.width = (outsideWidth * percent) + 'px';
			}
		});

		addEvent(uiTimeBarTotal, 'click', function(e) {
			var mousePos = getMousePosition(e),
				barPos = getNodePosition(uiTimeBarTotal),
				clickWidth = mousePos.x - barPos.x,
				width = uiTimeBarTotal.offsetWidth,
				percentage = clickWidth / width,
				newTime = percentage * mediaElement.duration;

			mediaElement.currentTime = newTime;
		});
	},

	createDuration: function(mediaElement, controls) {
		var uiDuration = doc.createElement('span');

		uiDuration.className = 'ui-time';
		uiDuration.innerHTML = '00:00';
		controls.appendChild(uiDuration);

		function setDuration() {
			var duration = mediaElement.duration;
			if (isNaN(duration) || duration == Infinity) {
				duration = 0;
			}
			uiDuration.innerHTML = mejs.Utils.secondsToTimeCode(duration);
		}

		mediaElement.addEventListener('timeupdate', setDuration, false);
		mediaElement.addEventListener('loadedmetadata', setDuration, false);
	},

	createFullscreen: function(mediaElement, controls) {

		if (!this.isVideo)
			return;

		var t = this,
			uiFullscreenBtn = doc.createElement('input'),
			isFullscreen = false,
			container = t.container,
			oldWidth = container.offsetWidth,
			oldHeight= container.offsetHeight;

		uiFullscreenBtn.className = 'ui-button ui-button-fullscreen';
		uiFullscreenBtn.type = 'button';
		controls.appendChild(uiFullscreenBtn);

		addEvent(uiFullscreenBtn, 'click', function() {

			console.log('fullscreen btn', isFullscreen);

			if (isFullscreen) {

				if (doc.exitFullscreen) {
					doc.exitFullscreen();
				} else if (doc.cancelFullScreen) {
					doc.cancelFullScreen();
				} else if (doc.webkitCancelFullScreen) {
					doc.webkitCancelFullScreen();
				} else if (doc.mozCancelFullScreen) {
					doc.mozCancelFullScreen();
				} else {
					// full window code for old browsers
				}

			} else {

				// store for later!
				oldWidth = container.offsetWidth;
				oldHeight= container.offsetHeight;

				if (container.requestFullscreen) {
					container.requestFullscreen();
				} else if (container.webkitRequestFullScreen) {
					container.webkitRequestFullScreen();
				} else if (container.mozRequestFullScreen) {
					container.mozRequestFullScreen();
				} else {
					// full window code for old browsers
				}
			}
		});

		// EVENTS
		if (doc.webkitCancelFullScreen) {
			doc.addEventListener('webkitfullscreenchange', function(e) {
				console.log('fullscreen event', doc.webkitIsFullScreen, e);
				isFullscreen = doc.webkitIsFullScreen;
				adjustForFullscreen();

			});
		} else if (doc.mozCancelFullScreen) {
			doc.addEventListener('mozfullscreenchange', function(e) {
				console.log('fullscreen event', doc.mozFullScreen, e);
				isFullscreen = doc.mozFullScreen;
				adjustForFullscreen();
			});
		}

		function adjustForFullscreen() {

			if (isFullscreen) {

				uiFullscreenBtn.className = uiFullscreenBtn.className.replace(/ui-button-fullscreen/gi,'') + ' ui-button-exitfullscreen';

				container.style.width = '100%';
				container.style.height = '100%';

				mediaElement.setSize( container.offsetWidth,  container.offsetHeight);
			} else {

				uiFullscreenBtn.className = uiFullscreenBtn.className.replace(/ui-button-exitfullscreen/gi,'') + ' ui-button-fullscreen';

				container.style.width = oldWidth + 'px';
				container.style.height = oldHeight + 'px';

				mediaElement.setSize( oldWidth, oldHeight);
			}

			t.resizeControls();
		}
	}
};

win.MediaElementPlayerSimple = mejs.MediaElementPlayerSimple = MediaElementPlayerSimple;

})(mejs, window, document);
