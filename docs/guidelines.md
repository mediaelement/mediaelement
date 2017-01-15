# Guidelines for Contributors

* [Development](#development)
    * [General Conventions](#development)
    * [Features](#features)
    * [Renderers](#renderers)
    * [Translations](#translations)
    * [A word on `ES6` for Features and Renderers](#es6)
* [Node.js](#nodejs)
* [Flex SDK](#flex)
* [Building with Grunt](#building)

<a id="development"></a>
## Development

### General Conventions

* Tab size is **8** for indentation.
* **ALWAYS** make changes to the files in the `/src/` directory, and **NEVER** in `/build/` directory. This is with the sole purpose of facilitating the merging (and further, the compiling) operation, and help people to see changes more easily.
* Make sure you download the necessary media files from https://github.com/johndyer/mediaelement-files and place them inside the `/media/` directory.
* Use [JSDoc](http://usejsdoc.org/) conventions to document code. This facilitates the contributions of other developers and ensures more quality in the product. 

<a id="features"></a>
### Features

The file name for them by default is: `mediaelementplayer-feature-[feature_name].js`. To keep consistency across the code, please follow the template above, including the long comments.

```javascript
/**
 * [Name of feature]
 *
 * [Description]
 */
(function($) {

    // Feature configuration
    $.extend(mejs.MepDefaults, {
        // Any variable that can be configured by the end user belongs here.
        // Make sure is unique by checking API and Configuration file.
        // Add comments about the nature of each of these variables.
    });

	
    $.extend(MediaElementPlayer.prototype, {
    
        // Public variables (also documented according to JSDoc specifications)
    
        /**
         * Feature constructor.
         *
         * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
         * @param {MediaElementPlayer} player
         * @param {$} controls
         * @param {$} layers
         * @param {HTMLElement} media
         */
        build[feature_name]: function(player, controls, layers, media) {
            // This allows us to access options and other useful elements already set.
            // Adding variables to the object is a good idea if you plan to reuse 
            // those variables in further operations.
            var t = this;
            
            // All code required inside here to keep it private;
            // otherwise, you can create more methods or add variables
            // outside of this scope
        }
        
        // Optionally, each feature can be destroyed setting a `clean` method
        /**
         * Feature destructor.
         *
         * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
         * @param {MediaElementPlayer} player
         */
        clean[feature_name]: function(player, controls, layers, media) {
        
        }
                
        // Other optional public methods (all documented according to JSDoc specifications)
    });
	
})(mejs.$);

```

If the feature must be integrated in the core package, place it inside `/src/` folder to be reviewed and, if code integrates any configuration variables, make sure you also write comments about their purpose, and add them into [API and Configuration](api.md) to keep documentation up-to-date; otherwise, to use it immediately, just call it after the main files and add its name in the `features` configuration.
```html
<script src="jquery.js"></script>
<script src="mediaelement-and-player.min.js"></script>
<link rel="stylesheet" href="mediaelementplayer.css" />
<script src="mejs-feature-[feature_name].js"></script>

<video id="player1" width="320" height="240"></video>

<script>
$(document).ready(function() {
 
    // create player
    $('#player1').mediaelementplayer({
        // add desired features in order
        features: ['playpause','[feature_name]','current','progress','duration','volume']
    });
});
</script>
```

As a final note, try to be aware of building it thinking on Accessibility. Take a look into [`mediaelementplayer-feature-tracks.js`](src/js/mediaelementplayer-feature-tracks.js) for more reference about best practices. 

<a id="renderers"></a>
### Renderers

The file name for them by default is: `mediaelement-renderer-[renderer_name].js`. To keep consistency across the code, please follow the template above, including the long comments.

```javascript
/**
 * [Name of renderer]
 *
 * [Description]
 * @see [URL to API if any is used]
 */
(function(win, doc, mejs, undefined) {
    
    /**
     * Register [name of renderer] type based on URL structure
     *
     */
    mejs.Utils.typeChecks.push(function(url) {
    
        url = url.toLowerCase();
        
        if (url.indexOf('[token to identify renderer through URL]') > -1) {
            return '[custom MIME Type]';
        } else {
            return null;
        }
    });
    .
    // It could be more code involved to load API properly, and even register a global event for the API.
    // Check `/src/js/mediaelement-renderer-*` files to see what approach fits the best on your development
    //
    //win.[keyNameEvent] = function() {	
    //    // Your code to initiate renderer
    //};
    
    var [camelCaseRendererName] = {
        // A unique name for the renderer
        name: '[unique_renderer_name]',
        
        options: {
            // MUST match with renderer name
            prefix: '[unique_renderer_name]'
        },
        
        /**
         * Determine if a specific element type can be played with this render
         *
         * @param {String} type
         * @return {Boolean}
         */
        canPlayType: function(type) {
            var mediaTypes = [ [list of custom MIME types (including the one above) that the renderer can play] ];
            
            return mediaTypes.indexOf(type) > -1;
        },
        /**
         * Create the player instance and add all native events/methods/properties as possible
         *
         * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
         * @param {Object} options All the player configuration options passed through constructor
         * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
         * @return {Object}
        */
        create: function (mediaElement, options, mediaFiles) {
            // General container
            var container = {};
        
            container.options = options;
            container.id = mediaElement.id + '_' + options.prefix;
            container.mediaElement = mediaElement;
        
            var
                apiStack = [],
                i,
                il,
                customPlayer = null,
                events,
                containerDOM = null
            ;
            
            // More code prior binding native properties/methods/events
            
            var 
                props = mejs.html5media.properties,
                assignGettersSetters = function(propName) {
                                                       
                    // add to flash state that we will store
                    
                    var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);
                    
                    container['get' + capName] = function() {
                        if (customPlayer !== null) {
                            var value = null;

                            switch (propName) {
                            // Add your code for each property (i.e., getSrc, getCurrentTime, etc.)
                            }
                        } else {
                            return null;
                        }
                    };
                    container['set' + capName] = function(value) {
                        if (customPlayer !== null) {
                        
                            switch (propName) {
                            // Add your code for each property (i.e., setSrc, setCurrentTime, etc.)
                            }
                        }  else {
                            // store for after "READY" event fires
                            apiStack.push({type: 'set', propName: propName, value: value});
                        }
                    };
                    
                    }
            ;
            for (i=0, il=props.length; i<il; i++) {
                assignGettersSetters(props[i]);
            }
            
            var 
                methods = mejs.html5media.methods,
                assignMethods = function(methodName) {
                                                
                    // run the method on the native HTMLMediaElement
                    container[methodName] = function() {
                    
                        if (customPlayer !== null) {
                        
                            switch (methodName) {
                            // Add your code for each native method (i.e., play, pause, load, etc.)
                            }
                        } else {
                            apiStack.push({type: 'call', methodName: methodName});
                        }
                    };
                
                }
            ;
            for (i=0, il=methods.length; i<il; i++) {
                assignMethods(methods[i]);
            }
            
            // Tends to be the norm to use a global event to register all the native events, plus the custom 
            // events for the renderer, depending on the specifications of the renderer's API
            // The following code MUST be executed during the creation of the renderer, either outside of this scope
            // or below when creating the DOM for the renderer
            win['__ready__' + container.id] = function(_customPlayer) {
                //
                mediaElement.customPlayer = customPlayer = _customPlayer;
                
                // do call stack
                for (i=0, il=apiStack.length; i<il; i++) {
                
                    var stackItem = apiStack[i];
    
                    if (stackItem.type === 'set') {
                        var propName = stackItem.propName,
                            capName = propName.substring(0,1).toUpperCase() + propName.substring(1);
                
                            container['set' + capName](stackItem.value);
                    } else if (stackItem.type === 'call') {
                        container[stackItem.methodName]();
                    }
                }
                
                containerDOM = doc.getElementById(container.id);
                
                // Make sure to include Mouse events
                events = ['mouseover','mouseout'];
                var assignEvent = function(e) {
                    var event = mejs.Utils.createEvent(e.type, container);
                    mediaElement.dispatchEvent(event);
                });
                
                for (var j in events) {
                    var eventName = events[j];
                    mejs.addEvent(containerDOM, eventName, assignEvent);
                }
                
                // BUBBLE EVENTS up
                events = mejs.html5media.events;
                events = events.concat(['click','mouseover','mouseout']);
                
                var assignNativeEvents = function(eventName) {
                                                       
                    // Any code related to trigger events
                    // generally it follows the convention above:
                    
                    customPlayer.addEventListener(eventName, function (e) {
                    // copy event
                    var event = mejs.Utils.createEvent(e.type, customPlayer);
                        mediaElement.dispatchEvent(event);
                    });
                
                };
                
                for (i=0, il=events.length; i<il; i++) {
                    assignNativeEvents(events[i]);
                }

                // All custom events (if any)
                ...
                
                // give initial events
                var initEvents = ['rendererready','loadeddata','loadedmetadata','canplay'];

                for (var i=0, il=initEvents.length; i<il; i++) {
                    var event = mejs.Utils.createEvent(initEvents[i], container);
                    mediaElement.dispatchEvent(event);
                }
            }
            
            // Create new markup for renderer and hide original one
            ...
            
            // The following methods MUST be created

            container.hide = function() {
                // Add your code to hide media
            };
            container.show = function() {
                // Add your code to show media
            };
            container.setSize = function() {
                // Add your code to resize media
            };
            container.destroy = function () {
                // Add your code to destroy media (if any; otherwise, leave empty)
            };
                        
            return container;
            
        }
    };
    
    mejs.Renderers.add([camelCaseRendererName]);

})(window, document, window.mejs || {});

```

Another things to consider when developing a new renderer:

* Update the list of [Renderers/IDs](usage.md#renderers-usage) documentation.
* Add the HTML needed to display new media in `/test/simpleplayer.html`.
* Create a `/test/[renderer_name].html` to show the renderer in an isolated way.
* Add an entry or two in `/test/alpha.html` and `/test/alpha-2.html` to confirm that media for new renderer can be changed easily. Example:

```html
 <span class="command">
    document.getElementById('playerId').src = '/path/to/new_media.extension'; 
</span>
 ```

<a id="translations"></a>
### Translations

If it is a translation that wants to be added, a couple of considerations need to be considered:

* The current format is `'mejs.[ID of element]' : 'translation'` (i.e., `'mejs.play': 'Play'`).
* The first element in the object **MUST** be `mejs.plural-form: [Number]`, where `[Number]` is the Family Group Number the language belongs (see `/src/js/core/i18n.js` to determine which number is the appropriate one).
* If you require to use plurals, you must write the possible translations in the order specified in http://localization-guide.readthedocs.io/en/latest/l10n/pluralforms.html as an array, and the placeholder to replace the number would be `%1`. 
* A code template to build a translation is presented below.

```javascript
'use strict';

/*!
 * This is a `i18n` language object.
 *
 * [Locale]
 *
 * @author
 *   John Dyer
 *
 * @see core/i18n.js
 */
if (mejs.i18n.[lang] === undefined) {
	mejs.i18n.[lang] = {
		"mejs.plural-form": [Number],

		// renderers/flash.js
		"mejs.install-flash": "",

		// features/contextmenu.js
		"mejs.fullscreen-off": "",
		"mejs.fullscreen-on": "",
		"mejs.download-video": "",

		// features/fullscreen.js
		"mejs.fullscreen": "",

		// features/jumpforward.js
		"mejs.time-jump-forward": "",

		// features/loop.js
		"mejs.loop": "",

		// features/playpause.js
		"mejs.play": "",
		"mejs.pause": "",

		// features/postroll.js
		"mejs.close": "",

		// features/progress.js
		"mejs.time-slider": "",
		"mejs.time-help-text": "",

		// features/skipback.js
		"mejs.time-skip-back": "",

		// features/tracks.js
		"mejs.captions-subtitles": "",
		"mejs.none": "",

		// features/volume.js
		"mejs.mute-toggle": "",
		"mejs.volume-help-text": "",
		"mejs.unmute": "",
		"mejs.mute": ""
		"mejs.volume-slider": "",

		// core/player.js
		"mejs.video-player": "",
		"mejs.audio-player": "",

		// features/ads.js
		"mejs.ad-skip": "",
		"mejs.ad-skip-info": "",

		// features/sourcechooser.js
		"mejs.source-chooser": "",

		// features/stop.js
		"mejs.stop": "",

		//features/speed.js
		"mejs.speed-rate" : "",

		//features/progress.js
		"mejs.live-broadcast" : "",

		// features/tracks.js
		"mejs.afrikaans": "",
		"mejs.albanian": "",
		"mejs.arabic": "",
		"mejs.belarusian": "",
		"mejs.bulgarian": "",
		"mejs.catalan": "",
		"mejs.chinese": "",
		"mejs.chinese-simplified": "",
		"mejs.chinese-traditional": "",
		"mejs.croatian": "",
		"mejs.czech": "",
		"mejs.danish": "",
		"mejs.dutch": "",
		"mejs.english": "",
		"mejs.estonian": "",
		"mejs.filipino": "",
		"mejs.finnish": "",
		"mejs.french": "",
		"mejs.galician": "",
		"mejs.german": "",
		"mejs.greek": "",
		"mejs.haitian-creole": "",
		"mejs.hebrew": "",
		"mejs.hindi": "",
		"mejs.hungarian": "",
		"mejs.icelandic": "",
		"mejs.indonesian": "",
		"mejs.irish": "",
		"mejs.italian": "",
		"mejs.japanese": "",
		"mejs.korean": "",
		"mejs.latvian": "",
		"mejs.lithuanian": "",
		"mejs.macedonian": "",
		"mejs.malay": "",
		"mejs.maltese": "",
		"mejs.norwegian": "",
		"mejs.persian": "",
		"mejs.polish": "",
		"mejs.portuguese": "",
		"mejs.romanian": "",
		"mejs.russian": "",
		"mejs.serbian": "",
		"mejs.slovak": "",
		"mejs.slovenian": "",
		"mejs.spanish": "",
		"mejs.swahili": "",
		"mejs.swedish": "",
		"mejs.tagalog": "",
		"mejs.thai": "",
		"mejs.turkish": "",
		"mejs.ukrainian": "",
		"mejs.vietnamese": "",
		"mejs.welsh": "",
		"mejs.yiddish": ""
	};
}
```

<a id="es6"></a>
### A word on `ES6` for Features and Renderers

All the features and renderers are written using `Ecmascript 2015` specifications. 

See the `src/js/features` and `src/js/renderers` directories, and check how the files were written to ensure compatibility.

**Note**: the `for...of` loop could have been used, but in order to bundle them and reduce the size of the bundled files, it is **strongly recommended to avoid*** its use.

If you plan to use your own feature/renderer and you don't want to bundle them using `grunt` (see [above](#building)), you ***MUST*** regular Javascript (like indicated in the templates above) to ensure compatibility.


<a id="nodejs"></a>
## Node.js

Since `MediaElement.js` uses [Grunt](http://gruntjs.com/) to compile it, Node.js is required. Download it at https://nodejs.org/ and follow the steps to install it, or install `node.js` with `npm`.

Once installed, at the command prompt, type `npm install`, which will download all the necessary tools.

<a id="flex"></a>
## Flex SDK

One of the subtasks involved during the compiling of `MediaElement.js` is the compiling of the Flash files. In order to do it, Flex SDK needs to be installed.

1. Make sure your version of Java is **1.5 or later** since Flex compilers are 32-bit executables and cannot launch 64-bit processes; otherwise, you will receive the error ```This Java instance does not support a 32-bit JVM.Please install the desired version```. For more information about this topic, read [Adobe's JVM Configuration](http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf69084-7fd9.html#WS2db454920e96a9e51e63e3d11c0bf5fb32-7ff3).
2. Download the free Flex SDK from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
2. Unzip it to a directory on your local machine (eg: ```/usr/local/flex_sdk_4.6```)
3. Create a symlink from the install location to this directory (eg: ```ln -s /usr/local/flex_sdk_4.6 /path/to/mediaelement/src/flash```)
4. If you do not have the required player global swc file (version **10.1**), download it from https://helpx.adobe.com/flash-player/kb/archived-flash-player-versions.html and place it inside ```/path/to/flex_sdk_4.6/frameworks/libs/player/10.1/playerglobal.swc```

If, during development, only the ActionScript files were affected, type `sh compile_swf.sh` and it will build the compiled files in `/local-build/` directory. Then just copy the files and put them inside `/build/` directory.

<a id="building"></a>
## Building with Grunt

To compile ALL the files, in your Terminal window just type `grunt` in the root of the project. 

If during the development was not necessary to do any changes to the Flash files, type `grunt html5only`. That way, the Flash files will remain intact. You can also type `grunt html5debug` to avoid removing the console messages.

Additionally, `grunt` can accept 2 extra options to create custom bundles: one for more player features and another one to integrate renderers.

The way to use them is to append the keyword `--features` and/or `--renderers`, followed by the comma-separated list of elements. 

The list must match the name of the files, meaning that if you wanna include the `x` feature and/or the `y` renderer, it must exist a `src/js/features/x.js` and/or `src/js/renderers/y.js` file(s). 

For example:

```
# This will build a bundle with `Play/Pause`, `Stop` and `Fullscreen` features ONLY, plus all the default renderers
grunt html5only --features=playpause,stop,fullscreen

# This will build a bundle with `HLS` and `DASH` renderers ONLY, plus all the default player features
grunt html5only --renderers=hls,dash

# This will build a bundle with `Play/Pause`, `Stop` and `Fullscreen` features ONLY and `HLS` and `DASH` renderers ONLY
grunt html5only --features=playpause,stop,fullscreen --renderers=hls,dash
```
________
[Back to Main](../README.md)
