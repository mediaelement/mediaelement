/**
 * JSMad renderer
 *
 * It expands the original player using JSMad library to decode audio `mp3` media.
 * @see https://github.com/fasterthanlime/jsmad
 */
(function(win, doc, mejs, undefined) {

	var JsMadRenderer = {
		name: 'jsmad',

		options: null,
		/**
		 * Determine if a specific element type can be played with this render
		 *
		 * @param {String} type
		 * @return {Array}
		 */
		canPlayType: function(type) {

			var doesThisWork = true,
				supportedMediaTypes = ['audio/mp3'];

			if (doesThisWork) {
				return supportedMediaTypes;
			} else {
				return [];
			}
		},
		/**
		 * Create the player instance and add all native events/methods/properties as possible
		 *
		 * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
		 * @param {Array} options All the player configuration options passed through constructor
		 * @param {Array} mediaFiles List of sources with format: {src: url, type: x/y-z}
		 * @return {Object}
		 */
		create: function (mediaElement, options, mediaFiles) {

			var
				jsmad = {},
				i,
				il
				;

			jsmad.id = mediaElement.id + '_jsmad';
			jsmad.options = options;
			jsmad.mediaElement = mediaElement;

			// stack to fire when ready
			jsmad.apiStack = [];

			// JSMAD player
			jsmad.jsMad = null;

			jsmad.loadSrc = function(filename) {

				console.log('create JSMAD', filename);

				new Mad.Player.fromURL( filename, function( player ) {
						//self.usePlayer( player );

					console.log('JS MAD', 'loaded player', player);

					jsmad.jsMad = player;

					jsmad.jsMad.onPlay = function() {
						mediaElement.dispatchEvent('play');
					};
					jsmad.jsMad.onPause = function() {
						mediaElement.dispatchEvent('pause');
					};
					jsmad.jsMad.onProgress = function( current, total, preload ) {
						//t.wrapper.dispatchEvent('progress');
						mediaElement.dispatchEvent('timeupdate');

						jsmad.jsMad.currentTime = current;
						jsmad.jsMad.duration = total;
					};

					jsmad.jsMad.createDevice();

					mediaElement.dispatchEvent('ready');

					// do call stack
					for (var i=0, il=t.apiStack.length; i<il; i++) {

						var stackItem = t.apiStack[i];

						console.log('stack', stackItem.type);

						if (stackItem.type === 'set') {
							jsmad[stackItem.propName] = stackItem.value;
						} else if (stackItem.type === 'call') {
							jsmad[stackItem.methodName]();
						}
					}

				});
			};

			// wrappers for get/set
			var props = mejs.html5media.properties;
			for (i=0, il=props.length; i<il; i++) {

				// wrap in function to retain scope
				(function(propName) {

					var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

					jsmad['get' + capName] = function() {

						var value = null;

						if (jsmad.jsMad != null) {
							switch (propName) {
								case 'paused':
									value = !jsmad.jsMad.playing;
									break;
								case 'currentTime':
									value = jsmad.jsMad.currentTime;
									break;
								case 'duration':
									value = jsmad.jsMad.duration;
									break;
								default:
									break;
							}

						}

						console.log('[JSMAD get]: ' + propName, jsmad.jsMad, value);

						return value;
					};

					jsmad['set' + capName] = function(value) {

						console.log('[JSMAD set]: ' + propName + ' = ' + value);

						if (propName == 'src') {

							jsmad.loadSrc(value);

						} else {

							if (t.jsMad !== null) {
								// do stuff here
								console.log('JSMAD TODO', 'SET', propName);
							} else {
								jsmad.apiStack.push({type: 'set', propName: propName, value: value});
							}
						}
					};

				})(props[i]);
			}

			// add wrappers for native methods
			var methods = mejs.html5media.methods;
			for (i=0, il=methods.length; i<il; i++) {
				(function(methodName) {

					// run the method on the native HTMLMediaElement
					jsmad[methodName] = function() {

						console.log('[JSMAD ' + methodName + '()]', jsmad.jsMad);

						if (jsmad.jsMad != null) {

							switch (methodName) {
								case 'play':
									console.log('[JSMAD setPlaying(true)', jsmad.jsMad);

									jsmad.jsMad.setPlaying(true);
									break;
								case 'pause':
									jsmad.jsMad.setPlaying(false);
									break;

								default:
								case 'load':

									break;
							}
						} else {

							jsmad.apiStack.push({type: 'call', methodName: methodName});
						}

					};

				})(methods[i]);
			}

			jsmad.show = function() {};
			jsmad.hide = function() {};

			if (mediaFiles && mediaFiles.length > 0) {
				jsmad.loadSrc(mediaFiles[0].src);
			}

			return jsmad;
		}
	};

	mejs.Renderers.add(JsMadRenderer);

})(window, document, window.mejs || {});