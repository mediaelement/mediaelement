'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/dom';
import {SUPPORTS_NATIVE_HLS, IS_ANDROID} from '../utils/constants';

/**
 * Native HTML5 Renderer
 *
 * Wraps the native HTML5 <audio> or <video> tag and bubbles its properties, events, and methods up to the mediaElement.
 */
const HtmlMediaElement = {

	name: 'html5',

	options: {
		prefix: 'html5'
	},

	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {String}
	 */
	canPlayType: (type) => {

		let mediaElement = document.createElement('video');

		// Due to an issue on Webkit, force the MP3 and MP4 on Android and consider native support for HLS
		if ((IS_ANDROID && type.match(/\/mp(3|4)$/gi) !== null) ||
			(['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls',
				'video/hls'].includes(type.toLowerCase()) && SUPPORTS_NATIVE_HLS)) {
			return 'yes';
		} else if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type).replace(/no/, '');
		} else {
			return '';
		}
	},
	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		let
			node = null,
			id = mediaElement.id + '_' + options.prefix,
			i,
			il
		;

		// CREATE NODE
		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {
			node = document.createElement('audio');
			mediaElement.appendChild(node);

		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		// WRAPPERS for PROPs
		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => node[propName];

				node[`set${capName}`] = (value) => {
					if (!mejs.html5media.readOnlyProperties.includes(propName)) {
						node[propName] = value;
					}
				};
			}
		;

		for (i = 0, il = props.length; i < il; i++) {
			assignGettersSetters(props[i]);
		}

		const
			events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']),
			assignEvents = (eventName) => {

				node.addEventListener(eventName, (e) => {
					// copy event

					let event = document.createEvent('HTMLEvents');
					event.initEvent(e.type, e.bubbles, e.cancelable);
					// event.srcElement = e.srcElement;
					// event.target = e.srcElement;
					mediaElement.dispatchEvent(event);
				});

			}
		;

		for (i = 0, il = events.length; i < il; i++) {
			assignEvents(events[i]);
		}

		// HELPER METHODS
		node.setSize = (width, height) => {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = () => {
			node.style.display = 'none';

			return node;
		};

		node.show = () => {
			node.style.display = '';

			return node;
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (i = 0, il = mediaFiles.length; i < il; i++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		let event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

window.HtmlMediaElement = mejs.HtmlMediaElement = HtmlMediaElement;

renderer.add(HtmlMediaElement);