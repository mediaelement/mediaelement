function getQueryStringValue (key) {
	return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

// borrowed from https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter (uri, key, value) {
	// remove the hash part before operating on the uri
	var
		i = uri.indexOf('#'),
		hash = i === -1 ? '' : uri.substr(i)
		;

	uri = i === -1 ? uri : uri.substr(0, i);

	var
		re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
		separator = uri.indexOf('?') !== -1 ? "&" : "?"
		;

	if (!value) {
		// remove key-value pair if value is empty
		uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');

		if (uri.slice(-1) === '?') {
			uri = uri.slice(0, -1);
		}
		// replace first occurrence of & by ? if no ? is present

		if (uri.indexOf('?') === -1) {
			uri = uri.replace(/&/, '?');
		}

	} else if (uri.match(re)) {
		uri = uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		uri = uri + separator + key + "=" + value;
	}
	return uri + hash;
}

var
	lang = getQueryStringValue('lang') || 'en',
	stretching = getQueryStringValue('stretching') || 'auto',
	languageSelector = document.querySelector('select[name=lang]'),
	stretchingSelector = document.querySelector('select[name=stretching]'),
	sourcesSelector = document.querySelectorAll('select[name=sources]'),
	sourcesTotal = sourcesSelector.length
	;

languageSelector.value = lang;
languageSelector.addEventListener('change', function () {
	window.location.href = updateUrlParameter(window.location.href, 'lang', languageSelector.value);
}, false);
stretchingSelector.value = stretching;
stretchingSelector.addEventListener('change', function () {
	window.location.href = updateUrlParameter(window.location.href, 'stretching', stretchingSelector.value);
}, false);

for (var i = 0; i < sourcesTotal; i++) {
	sourcesSelector[i].addEventListener('change', function () {
		var
			_this = this,
			media = _this.closest('.players').querySelector('.media-wrapper').querySelector('.mejs__container').id,
			player = mejs.players[media]
		;

		player.setSrc(_this.val().replace('&amp;', '&'));
		player.load();

		var renderer = document.getElementById(player.media.id + '-rendername');
		renderer.querySelector('.src').innerHTML = '<a href="' + _this.val() + '" target="_blank">' + _this.val() + '</a>';
		renderer.querySelector('.renderer').innerHTML = player.media.rendererName;
		renderer.querySelector('.error').innerHTML = '';

	}, false);

	// These media types cannot play at all on iOS, so disabling them
	if (mejs.Features.isiOS) {
		sourcesSelector[i].querySelector('option[value^="rtmp"]').setAttribute('disabled', true);
		sourcesSelector[i].querySelector('option[value$="webm"]').setAttribute('disabled', true);
		sourcesSelector[i].querySelector('option[value$=".mpd"]').setAttribute('disabled', true);
		sourcesSelector[i].querySelector('option[value$=".ogg"]').setAttribute('disabled', true);
		sourcesSelector[i].querySelector('option[value*=".flv"]').setAttribute('disabled', true);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	new MediaElementPlayer(document.querySelectorAll('video,audio'), {
		stretching: stretching,
		pluginPath: '../build/',
		success: function (media) {
			var renderer = document.getElementById('#' + media.id + '-rendername');

			media.addEventListener('loadedmetadata', function (e) {
				var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
				if (src !== null && src !== undefined) {
					renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
					renderer.querySelector('.renderer').innerHTML = media.rendererName;
					renderer.querySelector('.error').innerHTML = '';
				}
			}, false);

			media.addEventListener('error', function (e) {
				renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
			}, false);
		}
	});
}, false);
