'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';
import {createEvent} from '../utils/general';
import {typeChecks} from '../utils/media';
import {HAS_MSE} from '../utils/constants';

/**
 * Native M(PEG)-Dash renderer
 *
 * Uses dash.js, a reference client implementation for the playback of M(PEG)-DASH via Javascript and compliant browsers.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with mpd files.
 * @see https://github.com/Dash-Industry-Forum/dash.js
 *
 */
const NativeDash = {
	/**
	 * @type {Boolean}
	 */
	isMediaLoaded: false,
	/**
	 * @type {Array}
	 */
	creationQueue: [],

	/**
	 * Create a queue to prepare the loading of an DASH source
	 *
	 * @param {Object} settings - an object with settings needed to load an DASH player instance
	 */
	prepareSettings: (settings) => {
		if (NativeDash.isLoaded) {
			NativeDash.createInstance(settings);
		} else {
			NativeDash.loadScript(settings);
			NativeDash.creationQueue.push(settings);
		}
	},

	/**
	 * Load dash.mediaplayer.js script on the header of the document
	 *
	 * @param {Object} settings - an object with settings needed to load an DASH player instance
	 */
	loadScript: (settings) => {

		// Skip script loading since it is already loaded
		if (typeof dashjs !== 'undefined') {
			NativeDash.createInstance(settings);
		} else if (!NativeDash.isScriptLoaded) {

			settings.options.path = typeof settings.options.path === 'string' ?
				settings.options.path : '//cdn.dashjs.org/latest/dash.mediaplayer.min.js';

			const
				script = document.createElement('script'),
				firstScriptTag = document.getElementsByTagName('script')[0]
			;

			let done = false;

			script.src = settings.options.path;

			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function () {
				if (!done && (!this.readyState || this.readyState === undefined ||
					this.readyState === 'loaded' || this.readyState === 'complete')) {
					done = true;
					NativeDash.mediaReady();
					script.onload = script.onreadystatechange = null;
				}
			};

			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

			NativeDash.isScriptLoaded = true;
		}
	},

	/**
	 * Process queue of DASH player creation
	 *
	 */
	mediaReady: () => {

		NativeDash.isLoaded = true;
		NativeDash.isScriptLoaded = true;

		while (NativeDash.creationQueue.length > 0) {
			const settings = NativeDash.creationQueue.pop();
			NativeDash.createInstance(settings);
		}
	},

	/**
	 * Create a new instance of DASH player and trigger a custom event to initialize it
	 *
	 * @param {Object} settings - an object with settings needed to instantiate DASH object
	 */
	createInstance: (settings) => {

		const player = dashjs.MediaPlayer().create();
		window['__ready__' + settings.id](player);
	}
};

const DashNativeRenderer = {
	name: 'native_dash',

	options: {
		prefix: 'native_dash',
		dash: {
			// Special config: used to set the local path/URL of dash.js player library
			path: '//cdn.dashjs.org/latest/dash.mediaplayer.min.js',
			debug: false
		}
	},
	/**
	 * Determine if a specific element type can be played with this render
	 *
	 * @param {String} type
	 * @return {Boolean}
	 */
	canPlayType: (type) => HAS_MSE && ['application/dash+xml'].includes(type),

	/**
	 * Create the player instance and add all native events/methods/properties as possible
	 *
	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
	 * @param {Object} options All the player configuration options passed through constructor
	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
	 * @return {Object}
	 */
	create: (mediaElement, options, mediaFiles) => {

		const
			originalNode = mediaElement.originalNode,
			id = mediaElement.id + '_' + options.prefix,
			preload = originalNode.getAttribute('preload'),
			autoplay = originalNode.getAttribute('autoplay')
		;

		let
			node = null,
			dashPlayer
		;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		const
			props = mejs.html5media.properties,
			assignGettersSetters = (propName) => {
				const capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;

				node[`get${capName}`] = () => (dashPlayer !== null) ? node[propName] : null;

				node[`set${capName}`] = (value) => {
					if (!mejs.html5media.readOnlyProperties.includes(propName)) {
						if (dashPlayer !== null) {
							if (propName === 'src') {

								dashPlayer.attachSource(value);
								if (autoplay) {
									node.play();
								}
							}

							node[propName] = value;
						}
					}
				};

			}
		;

		for (let i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		// Initial method to register all M-Dash events
		window['__ready__' + id] = (_dashPlayer) => {

			mediaElement.dashPlayer = dashPlayer = _dashPlayer;

			dashPlayer.getDebug().setLogToBrowserConsole(options.dash.debug);
			dashPlayer.setAutoPlay(autoplay);
			dashPlayer.setScheduleWhilePaused((preload === 'auto'));

			const
				events = mejs.html5media.events.concat(['click', 'mouseover', 'mouseout']),
				dashEvents = dashjs.MediaPlayer.events,
				assignEvents = (eventName) => {

					if (eventName === 'loadedmetadata') {
						dashPlayer.initialize(node, node.src, false);
					}

					node.addEventListener(eventName, (e) => {
						const event = document.createEvent('HTMLEvents');
						event.initEvent(e.type, e.bubbles, e.cancelable);
						mediaElement.dispatchEvent(event);
					});

				}
			;

			for (let i = 0, total = events.length; i < total; i++) {
				assignEvents(events[i]);
			}

			/**
			 * Custom M(PEG)-DASH events
			 *
			 * These events can be attached to the original node using addEventListener and the name of the event,
			 * not using dashjs.MediaPlayer.events object
			 * @see http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html
			 */
			const assignMdashEvents = (e) => {
				const event = createEvent(e.type, node);
				event.data = e;
				mediaElement.dispatchEvent(event);

				if (e.type.toLowerCase() === 'error') {
					console.error(e);
				}
			};

			for (const eventType in dashEvents) {
				if (dashEvents.hasOwnProperty(eventType)) {
					dashPlayer.on(dashEvents[eventType], assignMdashEvents);
				}
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (let i = 0, total = mediaFiles.length; i < total; i++) {
				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
					node.setAttribute('src', mediaFiles[i].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.removeAttribute('autoplay');
		originalNode.style.display = 'none';

		NativeDash.prepareSettings({
			options: options.dash,
			id: id
		});

		// HELPER METHODS
		node.setSize = (width, height) => {
			node.style.width = width + 'px';
			node.style.height = height + 'px';

			return node;
		};

		node.hide = () => {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = () => {
			node.style.display = '';
			return node;
		};

		const event = createEvent('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

/**
 * Register Native M(PEG)-Dash type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('.mpd') ? 'application/dash+xml' : null;
});

renderer.add(DashNativeRenderer);