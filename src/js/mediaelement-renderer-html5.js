(function(win, doc, mejs, undefined) {

// wraps the native HTML5 <audio> or <video> tag and bubbles its properties, events, and methods up to the mediaElement
var HtmlMediaElement = {
	name: 'html5',

	canPlayType: function(type) {

		var mediaElement = doc.createElement('video');

		if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type).replace(/no/,'');
		} else {
			return '';
		}
	},
	options: null,

	create: function (mediaElement, options, mediaFiles) {

		var node = null,
			id = mediaElement.id + '_html5';

		// CREATE NODe
		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {

			node =  document.createElement('audio');
			mediaElement.appendChild(node);

		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		// WRAPPERS for PROPs
		var props = mejs.html5media.properties;
		for (var i=0, il=props.length; i<il; i++) {

			// wrap in function to retain scope
			(function(propName) {
				var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

				node['get' + capName] = function() {
					return node[propName];
				};

				node['set' + capName] = function(value) {
					node[propName] = value;
				};

			})(props[i]);
		}

		// BUBBLE EVENTS
		var events = mejs.html5media.events;

		events = events.concat(['click','mouseover','mouseout']);

		for (var i=0, il=events.length; i<il; i++) {
			(function(eventName) {

				node.addEventListener(eventName, function(e) {
					// copy event

					var event = doc.createEvent('HTMLEvents');
					event.initEvent(e.type, e.bubbles, e.cancelable);
					event.srcElement = e.srcElement;
					event.target = e.srcElement;

					//var ev = mejs.Utils.extend({}, e);

					mediaElement.dispatchEvent(event);
				});

			})(events[i]);
		}

		// HELPER METHODS
		node.setSize = function(width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		}

		node.hide = function() {
			node.style.display = 'none';

			return node;
		}

		node.show = function() {
			node.style.display = '';

			return node;
		}

		if (mediaFiles && mediaFiles.length > 0) {
			node.src = mediaFiles[0].src;
		}

		var event = mejs.Utils.createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

// add to list of possible renderers
mejs.Renderers.add(HtmlMediaElement);

window.HtmlMediaElement = mejs.HtmlMediaElement = HtmlMediaElement;

})(window, document, window.mejs || {});