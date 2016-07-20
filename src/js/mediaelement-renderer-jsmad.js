(function(win, doc, shimi, undef) {

JsMadRenderer = {
	name: 'jsmad',

	canPlayType: function(type) {

		var doesThisWork = true,
			supportedMediaTypes = ['audio/mp3'];
		
		if (doesThisWork) {
			return supportedMediaTypes;
		} else {
			return [];
		}
	},
	options: null,

	create: function (mediaElement, options, mediaFiles) {	
	
		var jsmad = {};
	
		jsmad.id = mediaElement.id + '_jsmad';
		jsmad.options = options;
		jsmad.mediaElement = mediaElement;		
			
		// stack to fire when ready
		jsmad.apiStack = [];
		
		// JSMAD player
		jsmad.jsMad = null;
		
		// wrappers for get/set
		var props = shimi.html5media.properties;
		for (var i=0, il=props.length; i<il; i++) {
			
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
						new Mad.Player.fromURL( value, function( player ) {
								//self.usePlayer( player );
								
							console.log('JS MAD', 'loaded player', player);
														
							jsmad.jsMad = player;
							
							jsmad.jsMad.onPlay = function() {
								mediaElement.dispatchEvent('play');
							}
							jsmad.jsMad.onPause = function() {
								mediaElement.dispatchEvent('pause');
							}
							jsmad.jsMad.onProgress = function( current, total, preload ) {
								//t.wrapper.dispatchEvent('progress');
								mediaElement.dispatchEvent('timeupdate');
								
								jsmad.jsMad.currentTime = current;
								jsmad.jsMad.duration = total;
							}
							
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
					} else {
						
						if (t.jsMad != null) {							
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
		var methods = shimichanga.html5media.methods;
		for (var i=0, il=methods.length; i<il; i++) {
			(function(methodName) {
	
				// run the method on the native HTMLMediaElement
				jsmad[methodName] = function() {
					
					console.log('[JSMAD ' + methodName + '()]', t.jsLib);
					
					if (jsmad.jsMad != null) {
				
						switch (methodName) {
							case 'play':
								console.log('[JSMAD setPlaying(true)', t.jsMad);
					
								jsmad.jsMad.setPlaying(true);
								break;
							case 'pause':
								jsmad.jsMad.setPlaying(false);
								break;
							
							default:
							case 'load':
								
								break;
							case 'play':
								
								break;						
							
						}
					} else {
						
						jsmad.apiStack.push({type: 'call', methodName: methodName});
					}
					
				};
			
			})(methods[i]);		
		}		
		
		
		return jsmad;
	}
};

mejs.Renderers.add(JsMadRenderer);

})(window, document, window.mejs || {});