(function(mejs, win, doc, undefined) {

mejs.Utility = mejs.Utils = {
	addProperty: function(obj, name, onGet, onSet) {

		// wrapper functions
		var
			oldValue = obj[name],
			getFn = function () {
				return onGet.apply(obj, [oldValue]);
			},
			setFn = function (newValue) {
				return oldValue = onSet.apply(obj, [newValue]);
			};

		// Modern browsers, IE9+ (IE8 only works on DOM objects, not normal JS objects)
		if (Object.defineProperty) {

			Object.defineProperty(obj, name, {
				get: getFn,
				set: setFn
			});

		// Older Firefox
		} else if (obj.__defineGetter__) {

			obj.__defineGetter__(name, getFn);
			obj.__defineSetter__(name, setFn);

		// IE6-7
		// must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
		} else {

			var onPropertyChange = function (event) {

				//console.log('onPropertyChange', event.propertyName);

				if (event.propertyName == name) {

					// temporarily remove the event so it doesn't fire again and create a loop
					obj.detachEvent('onpropertychange', onPropertyChange);

					// get the changed value, run it through the set function
					var newValue = setFn(obj[name]);

					// restore the get function
					obj[name] = getFn;
					obj[name].toString = function() { return getFn().toString() };

					// restore the event
					obj.attachEvent('onpropertychange', onPropertyChange);
				}
			};

			try {
				obj[name] = getFn;
				obj[name].toString = function() { return getFn().toString() };
			} catch (ex) {
				console.log('ERROR adding', name);
			}

			// add the property event change only once
			//if (typeof obj.hasPropertyChangeEvent == 'undefined') {
				obj.attachEvent('onpropertychange', onPropertyChange);
				//obj.hasPropertyChangeEvent = true;
			//}

		}
	},

	createEvent: function(eventName, target) {
		var event = null;

		if (doc.createEvent) {
			event = doc.createEvent('Event');
			event.initEvent(eventName, true, false);
			event.target = target;
		//} else if (document.createEventObject) {
		//	event = doc.createEventObject();
		} else {
			event = {};
		}
		event.type = eventName;
		event.target = target;

		return event;
	},

	// only return the mime part of the type in case the attribute contains the codec
	// see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
	// `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
	getMimeFromType: function(type) {
		if (type && ~type.indexOf(';')) {
			return type.substr(0, type.indexOf(';'));
		} else {
			return type;
		}
	},

	formatType: function(url, type) {

		// if no type is supplied, fake it with the extension
		if (url && !type) {
			return this.getTypeFromFile(url);
		} else {
			return this.getMimeFromType(type);
		}
	},

	typeChecks: [],

	getTypeFromFile: function(url) {

		var type = null;

		// do type checks first
		for (var i=0, il=this.typeChecks.length; i<il; i++) {
			type = this.typeChecks[i](url);

			if (type != null) {
				return type;
			}
		}


		// the do standard extension check
		var ext = this.getExtension(url),
			normalizedExt = this.normalizeExtension(ext);


		type =  (/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + normalizedExt;

		return type;
	},


	getExtension: function(url) {
		var withoutQuerystring = url.split('?')[0],
			ext = ~withoutQuerystring.indexOf('.') ? withoutQuerystring.substring(withoutQuerystring.lastIndexOf('.') + 1) : '';

		return ext;
	},

	normalizeExtension: function(ext) {

		switch (ext) {
			case 'mp4':
			case 'm4v':
				return 'mp4';
			case 'webm':
			case 'webma':
			case 'webmv':
				return 'webm';
			case 'ogg':
			case 'oga':
			case 'ogv':
				return 'ogg';
			default:
				return ext;
		}
	},

	encodeUrl: function(url) {
		return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
	},

	escapeHTML: function(s) {
		return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
	},

	absolutizeUrl: function(url) {
		var el = document.createElement('div');
		el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
		return el.firstChild.href;
	},

	secondsToTimeCode: function(time, forceHours, showFrameCount, fps) {
		//add framecount
		if (typeof showFrameCount == 'undefined') {
			  showFrameCount=false;
		} else if(typeof fps == 'undefined') {
			  fps = 25;
		}

		var hours = Math.floor(time / 3600) % 24,
			minutes = Math.floor(time / 60) % 60,
			seconds = Math.floor(time % 60),
			frames = Math.floor(((time % 1)*fps).toFixed(3)),
			result =
					( (forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '')
						+ (minutes < 10 ? '0' + minutes : minutes) + ':'
						+ (seconds < 10 ? '0' + seconds : seconds)
						+ ((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');

		return result;
	},

	timeCodeToSeconds: function(time, forceHours, showFrameCount, fps){
		if (typeof showFrameCount == 'undefined') {
			  showFrameCount=false;
		} else if(typeof fps == 'undefined') {
			  fps = 25;
		}

		// 00:00:00		HH:MM:SS
		// 00:00 		MM:SS
		// 00			SS

		var parts = time.split(':'),
			hours = 0,
			minutes = 0,
			frames = 0,
			seconds = 0;

		switch (parts.length) {
			default:
			case 1:
				seconds = parseInt(parts[0],10);
				break;
			case 2:
				minutes = parseInt(parts[0],10);
				seconds = parseInt(parts[1],10);

				break;
			case 3:
			case 4:
				hours = parseInt(parts[0],10);
				minutes = parseInt(parts[1],10);
				seconds = parseInt(parts[2],10);
				frames = showFrameCount ? parseInt(parts[3])/fps : 0;
				break;

		}

		seconds = ( hours * 3600 ) + ( minutes * 60 ) + seconds + frames;

		return seconds;
	},

	extend: function() {
		// borrowed from ender
		var options, name, src, copy,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target !== "function" ) {
			target = {};
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	},
	/*
	 * Calculate the time format to use. We have a default format set in the
	 * options but it can be imcomplete. We ajust it according to the media
	 * duration.
	 *
	 * We support format like 'hh:mm:ss:ff'.
	 */
	calculateTimeFormat: function(time, options, fps) {
		if (time < 0) {
			time = 0;
		}

		if(typeof fps == 'undefined') {
		    fps = 25;
		}

		var format = options.timeFormat,
			firstChar = format[0],
			firstTwoPlaces = (format[1] == format[0]),
			separatorIndex = firstTwoPlaces? 2: 1,
			separator = ':',
			hours = Math.floor(time / 3600) % 24,
			minutes = Math.floor(time / 60) % 60,
			seconds = Math.floor(time % 60),
			frames = Math.floor(((time % 1)*fps).toFixed(3)),
			lis = [
				[frames, 'f'],
				[seconds, 's'],
				[minutes, 'm'],
				[hours, 'h']
			];

		// Try to get the separator from the format
		if (format.length < separatorIndex) {
			separator = format[separatorIndex];
		}

		var required = false;

		for (var i=0, len=lis.length; i < len; i++) {
			if (format.indexOf(lis[i][1]) !== -1) {
				required=true;
			}
			else if (required) {
				var hasNextValue = false;
				for (var j=i; j < len; j++) {
					if (lis[j][0] > 0) {
						hasNextValue = true;
						break;
					}
				}

				if (! hasNextValue) {
					break;
				}

				if (!firstTwoPlaces) {
					format = firstChar + format;
				}
				format = lis[i][1] + separator + format;
				if (firstTwoPlaces) {
					format = lis[i][1] + format;
				}
				firstChar = lis[i][1];
			}
		}
		options.currentTimeFormat = format;
	},
	
	convertSMPTEtoSeconds: function (SMPTE) {
		if (typeof SMPTE != 'string') 
			return false;

		SMPTE = SMPTE.replace(',', '.');
		
		var secs = 0,
			decimalLen = (SMPTE.indexOf('.') != -1) ? SMPTE.split('.')[1].length : 0,
			multiplier = 1;
		
		SMPTE = SMPTE.split(':').reverse();
		
		for (var i = 0; i < SMPTE.length; i++) {
			multiplier = 1;
			if (i > 0) {
				multiplier = Math.pow(60, i); 
			}
			secs += Number(SMPTE[i]) * multiplier;
		}
		return Number(secs.toFixed(decimalLen));
	}		
};


mejs.MediaFeatures = mejs.Features = (function() {

	var features = {},
		nav = win.navigator,
		ua = nav.userAgent.toLowerCase(),
		html5Elements = ['source','track','audio','video'],
		video = null;

	// for IE
	for (var i=0, il=html5Elements.length; i<il; i++) {
		video = doc.createElement( html5Elements[i] );
	}

	features.isiPad = (ua.match(/ipad/i) !== null);
	features.isiPhone = (ua.match(/iphone/i) !== null);
	features.isiOS = features.isiPhone || features.isiPad;
	features.isAndroid = (ua.match(/android/i) !== null);
	features.isIE = (nav.appName.toLowerCase().indexOf("microsoft") != -1 || nav.appName.toLowerCase().match(/trident/gi) !== null);
	features.isChrome = (ua.match(/chrome/gi) !== null);
	features.isFirefox = (ua.match(/firefox/gi) !== null);

	/*
	Possibly add back in when needed
	features.isSafari = ua.match(/safari/gi) !== null && !features.isChrome;
	features.isOpera = (ua.match(/opera/gi) !== null);
	features.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
	features.isWebkit = (ua.match(/webkit/gi) !== null);
	features.isGecko = (ua.match(/gecko/gi) !== null) && !features.isWebkit;

	*/

	// borrowed from Modernizr
	features.hasTouch = ('ontouchstart' in window);
	features.svg = 	!! doc.createElementNS &&
					!! doc.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect;

	// Test if Media Source Extensions are supported by browser
	features.hasMse = ('MediaSource' in window);

	features.supportsMediaTag = (typeof video.canPlayType != 'undefined' || features.isBustedAndroid || features.hasMse);

	return features;
})();

})(window.mejs || {}, window, document);