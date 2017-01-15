// 'use strict';
//
// import window from 'global/window';
// import document from 'global/document';
// import mejs from '../core/mejs';
// import {renderer} from '../core/renderer';
// import {createEvent, addEvent} from '../utils/dom';
//
// /**
//  * VR renderer
//  *
//  * It uses Google's VR View and creates an <iframe> that allows the user to see 360 videos
//  * @see https://developers.google.com/vr/concepts/vrview-web
//  */
// const VrAPI = {
// 	/**
// 	 * @type {Boolean}
// 	 */
// 	isMediaStarted: false,
// 	/**
// 	 * @type {Boolean}
// 	 */
// 	isMediaLoaded: false,
// 	/**
// 	 * @type {Array}
// 	 */
// 	creationQueue: [],
//
// 	/**
// 	 * Create a queue to prepare the loading of the VR View Player
// 	 * @param {Object} settings - an object with settings needed to load an VR View Player instance
// 	 */
// 	prepareSettings: (settings) => {
// 		if (VrAPI.isLoaded) {
// 			VrAPI.createInstance(settings);
// 		} else {
// 			VrAPI.loadScript(settings);
// 			VrAPI.creationQueue.push(settings);
// 		}
// 	},
//
// 	/**
// 	 * Load vrview.min.js script on the header of the document
// 	 *
// 	 * @param {Object} settings - an object with settings needed to load an HLS player instance
// 	 */
// 	loadScript: (settings) => {
// 		if (!VrAPI.isMediaStarted) {
//
// 			settings.options.path = typeof settings.options.path === 'string' ?
// 				settings.options.path : '//storage.googleapis.com/vrview/2.0/build/vrview.min.js';
//
// 			if (typeof dashjs !== 'undefined') {
// 				VrAPI.createInstance(settings);
// 			} else {
// 				let
// 					script = document.createElement('script'),
// 					firstScriptTag = document.getElementsByTagName('script')[0],
// 					done = false;
//
// 				script.src = '//storage.googleapis.com/vrview/2.0/build/vrview.min.js';
//
// 				// Attach handlers for all browsers
// 				script.onload = script.onreadystatechange = function() {
// 					if (!done && (!this.readyState || this.readyState === undefined ||
// 						this.readyState === 'loaded' || this.readyState === 'complete')) {
// 						done = true;
// 						VrAPI.mediaReady();
// 						script.onload = script.onreadystatechange = null;
// 					}
// 				};
//
// 				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
// 			}
// 			VrAPI.isMediaStarted = true;
// 		}
// 	},
//
// 	/**
// 	 * Process queue of VR View Player creation
// 	 *
// 	 */
// 	mediaReady: () => {
// 		VrAPI.isLoaded = true;
// 		VrAPI.isMediaLoaded = true;
//
// 		while (VrAPI.creationQueue.length > 0) {
// 			let settings = VrAPI.creationQueue.pop();
// 			VrAPI.createInstance(settings);
// 		}
// 	},
//
// 	/**
// 	 * Create a new instance of VrView player and trigger a custom event to initialize it
// 	 *
// 	 * @param {Object} settings - an object with settings needed to instantiate VR View Player object
// 	 */
// 	createInstance: (settings) => {
// 		window.addEventListener('load', () => {
// 			let player = new VRView.Player('#' + settings.id, settings.options);
// 			window['__ready__' + settings.id](player);
// 		});
// 	}
// };
//
// const VrRenderer = {
// 	name: 'vr',
//
// 	options: {
// 		prefix: 'vr',
// 		/**
// 		 * https://developers.google.com/vr/concepts/vrview-web#vr_view
// 		 */
// 		vr: {
// 			image: '',
// 			is_stereo: true,
// 			is_autopan_off: true,
// 			is_debug: false,
// 			is_vr_off: false,
// 			default_yaw: 0,
// 			is_yaw_only: false
// 		}
// 	},
//
// 	/**
// 	 * Determine if a specific element type can be played with this render
// 	 *
// 	 * @param {String} type
// 	 * @return {Boolean}
// 	 */
// 	canPlayType: (type) => ['video/mp4', 'application/x-mpegurl', 'vnd.apple.mpegURL', 'application/dash+xml'].includes(type.toLowerCase()),
//
// 	/**
// 	 * Create the player instance and add all native events/methods/properties as possible
// 	 *
// 	 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
// 	 * @param {Object} options All the player configuration options passed through constructor
// 	 * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
// 	 * @return {Object}
// 	 */
// 	create: (mediaElement, options, mediaFiles) => {
//
// 		// exposed object
// 		let
// 			stack = [],
// 			VrAPIReady = false,
// 			vr = {},
// 			vrPlayer = null,
// 			paused = true,
// 			volume = 1,
// 			oldVolume = volume,
// 			currentTime = 0,
// 			bufferedTime = 0,
// 			ended = false,
// 			duration = 0,
// 			url = '',
// 			i,
// 			il
// 		;
//
// 		vr.options = options;
// 		vr.id = mediaElement.id + '_' + options.prefix;
// 		vr.mediaElement = mediaElement;
//
// 		// wrappers for get/set
// 		const
// 			props = mejs.html5media.properties,
// 			assignGettersSetters = (propName) => {
//
// 				const capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);
//
// 				vr['get' + capName] = () => {
// 					if (vrPlayer !== null) {
// 						let value = null;
//
// 						switch (propName) {
// 							case 'currentTime':
// 								return currentTime;
//
// 							case 'duration':
// 								return duration;
//
// 							case 'volume':
// 								return volume;
// 							case 'muted':
// 								return volume === 0;
// 							case 'paused':
// 								paused = vrPlayer.isPaused;
// 								return paused;
//
// 							case 'ended':
// 								return ended;
//
// 							case 'src':
// 								return url;
//
// 							case 'buffered':
// 								return {
// 									start: () => {
// 										return 0;
// 									},
// 									end: () => {
// 										return bufferedTime * duration;
// 									},
// 									length: 1
// 								};
// 						}
//
// 						return value;
// 					} else {
// 						return null;
// 					}
// 				};
//
// 				vr['set' + capName] = (value) => {
//
// 					if (vrPlayer !== null) {
//
// 						// do something
// 						switch (propName) {
//
// 							case 'src':
// 								let url = typeof value === 'string' ? value : value[0].src;
// 								vrPlayer.setContentInfo({video: url});
// 								break;
//
// 							case 'currentTime':
// 								vrPlayer.setCurrentTime(value);
// 								break;
//
// 							case 'volume':
// 								vrPlayer.setVolume(value);
// 								break;
// 							case 'muted':
// 								if (value) {
// 									vrPlayer.setVolume(0);
// 								} else {
// 									vrPlayer.setVolume(oldVolume);
// 								}
// 								break;
// 							default:
// 								console.log('vr ' + vr.id, propName, 'UNSUPPORTED property');
// 						}
//
// 					} else {
// 						// store for after "READY" event fires
// 						stack.push({type: 'set', propName: propName, value: value});
// 					}
// 				};
//
// 			}
// 		;
// 		for (i = 0, il = props.length; i < il; i++) {
// 			assignGettersSetters(props[i]);
// 		}
//
// 		// add wrappers for native methods
// 		const
// 			methods = mejs.html5media.methods,
// 			assignMethods = (methodName) => {
// 				vr[methodName] = () => {
//
// 					if (vrPlayer !== null) {
//
// 						// DO method
// 						switch (methodName) {
// 							case 'play':
// 								return vrPlayer.play();
// 							case 'pause':
// 								return vrPlayer.pause();
// 							case 'load':
// 								return null;
//
// 						}
//
// 					} else {
// 						stack.push({type: 'call', methodName: methodName});
// 					}
// 				};
//
// 			}
// 		;
// 		for (i = 0, il = methods.length; i < il; i++) {
// 			assignMethods(methods[i]);
// 		}
//
// 		// Initial method to register all VRView events when initializing <iframe>
// 		window['__ready__' + vr.id] = (_vrPlayer) => {
//
// 			VrAPIReady = true;
// 			mediaElement.vrPlayer = vrPlayer = _vrPlayer;
//
// 			// do call stack
// 			if (stack.length) {
// 				for (i = 0, il = stack.length; i < il; i++) {
//
// 					let stackItem = stack[i];
//
// 					if (stackItem.type === 'set') {
// 						let propName = stackItem.propName,
// 							capName = `${propName.substring(0, 1).toUpperCase()}${propName.substring(1)}`;
//
// 						node[`set${capName}`](stackItem.value);
// 					} else if (stackItem.type === 'call') {
// 						node[stackItem.methodName]();
// 					}
// 				}
// 			}
//
// 			vrPlayer.on('ready', () => {
//
// 				// a few more events
// 				let events = ['mouseover', 'mouseout'];
//
// 				let assignEvents = (e) => {
// 					let event = createEvent(e.type, vr);
// 					mediaElement.dispatchEvent(event);
// 				};
//
// 				for (let i = 0, il = events.length; i < il; i++) {
// 					addEvent(vrPlayer, events[i], assignEvents);
// 				}
//
// 				// give initial events
// 				events = ['rendererready', 'loadeddata', 'loadedmetadata', 'canplay'];
//
// 				for (let i = 0, il = events.length; i < il; i++) {
// 					let event = createEvent(events[i], vr);
// 					mediaElement.dispatchEvent(event);
// 				}
// 			});
// 		};
//
// 		let vrContainer = document.createElement('div');
//
// 		// Create <iframe> markup
// 		vrContainer.setAttribute('id', vr.id);
// 		vrContainer.style.width = '100%';
// 		vrContainer.style.height = '100%';
//
// 		mediaElement.originalNode.parentNode.insertBefore(vrContainer, mediaElement.originalNode);
// 		mediaElement.originalNode.style.display = 'none';
//
// 		if (mediaFiles && mediaFiles.length > 0) {
// 			for (i = 0, il = mediaFiles.length; i < il; i++) {
// 				if (renderer.renderers[options.prefix].canPlayType(mediaFiles[i].type)) {
// 					options.vr.video = mediaFiles[i].src;
// 					options.vr.width = '100%';
// 					options.vr.height = '100%';
// 					break;
// 				}
// 			}
// 		}
//
// 		VrAPI.prepareSettings({
// 			options: options.vr,
// 			id: vr.id
// 		});
//
// 		vr.hide = () => {
// 			vr.pause();
// 			if (vrPlayer) {
// 				vrContainer.style.display = 'none';
// 			}
// 		};
// 		vr.setSize = (width, height) => {
//
// 		};
// 		vr.show = () => {
// 			if (vrPlayer) {
// 				vrContainer.style.display = '';
// 			}
// 		};
//
// 		return vr;
// 	}
// };
//
// renderers.add(VrRenderer);