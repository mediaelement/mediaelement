'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
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

		const mediaElement = document.createElement('video');

		// Due to an issue on Webkit, force the MP3 and MP4 on Android and consider native support for HLS;
		// also consider URLs that might have obfuscated URLs
		if ((IS_ANDROID && /\/mp(3|4)$/i.test(type)) ||
			(~['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls',
				'video/hls'].indexOf(type.toLowerCase()) && SUPPORTS_NATIVE_HLS)) {
			return 'yes';
		} else if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type.toLowerCase()).replace(/no/, '');
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

		const id = mediaElement.id + '_' + options.prefix;
		let isActive = false;

		let node = null;

		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {
			node = document.createElement('audio');
			mediaElement.appendChild(node);
		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => node[propName];

				node[`set${capName}`] = (value) => {
					if (mejs.html5media.readOnlyProperties.indexOf(propName) === -1) {
						node[propName] = value;
					}
				};
			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		const
			events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']).filter(e => e !== 'error'),
			assignEvents = (eventName) => {
				node.addEventListener(eventName, (e) => {
					// Emit an event only in case the renderer is active at the moment
					if (isActive) {
						const event = createEvent(e.type, e.target);
						mediaElement.dispatchEvent(event);
					}
				});

			}
		;

		for (let i = 0, total = events.length; i < total; i++) {
			assignEvents(events[i]);
		}

		// HELPER METHODS
		node.setSize = (width, height) => {
			node.style.width = `${width}px`;
			node.style.height = `${height}px`;
			return node;
		};

		node.hide = () => {
			isActive = false;
			node.style.display = 'none';

			return node;
		};

		node.show = () => {
			isActive = true;
			node.style.display = '';

			return node;
		};

		let
			index = 0,
			total = mediaFiles.length
		;
		if (total > 0) {
			for (; index < total; index++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		// Check if it current source can be played; otherwise, load next until no more options are left
		node.addEventListener('error', function (e) {
			// Reload the source only in case of the renderer is active at the moment
			if (e && e.target && e.target.error && e.target.error.code === 4 && isActive) {
				if (index < total && mediaFiles[(index + 1)] !== undefined) {
					node.src = mediaFiles[index++].src;
					node.load();
					node.play();
				} else {
					mediaElement.generateError('Media error: Format(s) not supported or source(s) not found', mediaFiles);
				}
			}
		});

		const event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

window.HtmlMediaElement = mejs.HtmlMediaElement = HtmlMediaElement;

renderer.add(HtmlMediaElement);
