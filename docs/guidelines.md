# Guidelines for Contributors

* [Development](#development)
    * [General Conventions](#development)
    * [Renderers](#renderers)
    * [Translations](#translations)
    * [A word on `ES6` for Renderers](#es6)
* [Node.js](#nodejs)
* [Flex SDK](#flex)
* [Building with Grunt](#building)

<a id="development"></a>
## Development

### General Conventions

* Tab size is **8** for indentation.
* **ALWAYS** make changes to the files in the `/src/` directory, and **NEVER** in `/build/` directory. This is with the sole purpose of facilitating the merging (and further, the compiling) operation, and help people to see changes more easily.
* Make sure you download the necessary media files from https://github.com/mediaelement/mediaelement-files and place them inside the `/media/` directory.
* Use [JSDoc](http://usejsdoc.org/) conventions to document code. This facilitates the contributions of other developers and ensures more quality in the product. 

<a id="features"></a>
### Features

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
'use strict';

import window from 'global/window';
import document from 'global/document';
import mejs from '../core/mejs';
import {renderer} from '../core/renderer';

// More imports....

/**
 * [Name of renderer]
 *
 * [Description]
 * @see [URL to API if any is used]
 */

const [camelCaseRendererName] = {
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
    canPlayType: (type) => ['video/mime_type1', 'video/mime_type2', 'video/mime_type3' ...].includes(type),
   
    /**
     * Create the player instance and add all native events/methods/properties as possible
     *
     * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
     * @param {Object} options All the player configuration options passed through constructor
     * @param {Object[]} mediaFiles List of sources with format: {src: url, type: x/y-z}
     * @return {Object}
    */
    create: (mediaElement, options, mediaFiles) => {
        // General container
        let container = {};
        
        options = Object.assign(options, mediaElement.options);
    
        container.options = options;
        container.id = mediaElement.id + '_' + options.prefix;
        container.mediaElement = mediaElement;
    
        let
            apiStack = [],
            i,
            il,
            customPlayer = null,
            events,
            containerDOM = null,
            i,
            il
        ;
        
        // More code prior binding native properties/methods/events ...
        
        const 
            props = mejs.html5media.properties,
            assignGettersSetters = (propName) => {
                                                  
                // add to flash state that we will store
                
                const capName = propName.substring(0,1).toUpperCase() + propName.substring(1);
                
                container['get' + capName] = () => {
                    if (customPlayer !== null) {
                        let value = null;

                        switch (propName) {
                        // Add your code for each property (i.e., getSrc, getCurrentTime, etc.)
                        }
                    } else {
                        return null;
                    }
                };
                container['set' + capName] = (value) => {
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
        
        for (i = 0, il = props.length; i < il; i++) {
            assignGettersSetters(props[i]);
        }
        
        const 
            methods = mejs.html5media.methods,
            assignMethods = function(methodName) {
                                            
                // run the method on the native HTMLMediaElement
                container[methodName] = () => {
                
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
        
        for (i = 0, il = methods.length; i < il; i++) {
            assignMethods(methods[i]);
        }
        
        // Tends to be the norm to use a global event to register all the native events, plus the custom 
        // events for the renderer, depending on the specifications of the renderer's API
        // The following code MUST be executed during the creation of the renderer, either outside of this scope
        // or below when creating the DOM for the renderer
        window['__ready__' + container.id] = (_customPlayer) => {
            //
            mediaElement.customPlayer = customPlayer = _customPlayer;
            
            // do call stack
            if (apiStack.length) {
                for (i = 0, il = apiStack.length; i<il; i++) {
                
                    let stackItem = apiStack[i];
    
                    if (stackItem.type === 'set') {
                        let propName = stackItem.propName,
                            capName = propName.substring(0,1).toUpperCase() + propName.substring(1);
                
                            container['set' + capName](stackItem.value);
                    } else if (stackItem.type === 'call') {
                        container[stackItem.methodName]();
                    }
                }
            }
            
            containerDOM = document.getElementById(container.id);
            
            // Make sure to include Mouse events
            events = ['mouseover','mouseout'];
            
            const assignEvent = (e) => {
                const event = mejs.Utils.createEvent(e.type, container);
                mediaElement.dispatchEvent(event);
            };
            
            for (let j in events) {
                const eventName = events[j];
                mejs.addEvent(containerDOM, eventName, assignEvent);
            }
            
            // BUBBLE EVENTS up
            let events = mejs.html5media.events;
            events = events.concat(['click','mouseover','mouseout']);
            
            const assignNativeEvents = (eventName) => {
                                                   
                // Any code related to trigger events
                // generally it follows the convention above:
                
                customPlayer.addEventListener(eventName, (e) => {
                    // copy event
                    const event = mejs.Utils.createEvent(e.type, customPlayer);
                    mediaElement.dispatchEvent(event);
                });
            };
            
            for (i = 0, il = events.length; i < il; i++) {
                assignNativeEvents(events[i]);
            }

            // All custom events (if any)....
            
            // give initial events
            const initEvents = ['rendererready','loadeddata','loadedmetadata','canplay'];

            for (i = 0, il = initEvents.length; i < il; i++) {
                let event = mejs.Utils.createEvent(initEvents[i], container);
                mediaElement.dispatchEvent(event);
            }
        };
        
        // Create new markup for renderer and hide original one ....
        
        // The following methods MUST be created

        container.hide = () => {
            // Add your code to hide media
        };
        container.show = () => {
            // Add your code to show media
        };
        container.setSize = () => {
            // Add your code to resize media
        };
        container.destroy = () => {
            // Add your code to destroy media (if any; otherwise, leave empty)
        };
                    
        return container;
        
    }
};
    
/**
 * Register Native M(PEG)-Dash type based on URL structure
 *
 */
typeChecks.push((url) => {
	url = url.toLowerCase();
	return url.includes('.file_extension') ? 'video/mime_type1' : null;
});

renderer.add([camelCaseRendererName]);
```

Another things to consider when developing a new renderer:

* Update the list of [Renderers/IDs](usage.md#renderers-usage) documentation.
* Add an entry in the drop down list at `/test/player.html` and `/demo/index.html` to confirm that media for new renderer can be changed easily.

```html
<label>Sources <select name="sources">
     <option value="/path/to/new_media.extension">[EXTENSION]</option>
</select>
</label>
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

		// features/fullscreen.js
		"mejs.fullscreen": "",

		// features/playpause.js
		"mejs.play": "",
		"mejs.pause": "",

		// features/progress.js
		"mejs.time-slider": "",
		"mejs.time-help-text": "",
		"mejs.live-broadcast" : "",

		// features/volume.js
		"mejs.volume-help-text": "",
		"mejs.unmute": "",
		"mejs.mute": "",
		"mejs.volume-slider": "",

		// core/player.js
		"mejs.video-player": "",
		"mejs.audio-player": "",

		// features/tracks.js
		"mejs.captions-subtitles": "",
		"mejs.none": "",
		"mejs.captions-chapters": "",
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

**IMPORTANT**: You will also need to add the language in the `MediaElement Plugins` repository. 

For more information about this, read the [Template for Translations](https://github.com/mediaelement/mediaelement-plugins#translations) documentation.

<a id="es6"></a>
### A word on `ES6` for Renderers

All the renderers are written using `Ecmascript 2015` specifications. 

See`src/js/renderers` directory, and check how the files were written to ensure compatibility.

**Note**: the `for...of` loop could have been used, but in order to bundle them and reduce the size of the bundled files, it is **strongly recommended to avoid*** its use.

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

Or, simply, type in Terminal `grunt shell` to create all the SWF files in the right place.

<a id="building"></a>
## Building with Grunt

To compile ALL the files, in your Terminal window just type `grunt` in the root of the project. 

You can also type `grunt debug` to avoid removing the console messages.

Additionally, `grunt` can accept an extra option to create custom bundle.

The way to use them is to append the keyword `--renderers`, followed by the comma-separated list of elements. 

The list must match the name of the files, meaning that if you wanna include the `x` renderer, it must exist a `src/js/renderers/x.js` file. 

For example:

```
# This will build a bundle with `HLS` and `DASH` renderers ONLY, plus all the default player features
grunt --renderers=hls,dash
```
________
[Back to Main](../README.md)
