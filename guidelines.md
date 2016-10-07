# Guidelines for Contributors

* [Development](#development)
* [Node.js](#nodejs)
* [Flex SDK](#flex)
* [Building](#building)

<a id="development"></a>
## Development

Unless you are developing a fix for a reported issue, the development of a new feature follows specific conventions.

* Tab size is **8** for indentation.
* File name format: `mep-feature-[feature_name].js`.
* **ALWAYS** make changes to the files in the `/src/` directory, and **NEVER** in `/build/` directory. This is with the sole purpose of facilitating the merging (and further, the compiling) operation, and help people to see changes more easily.
* Test the changes with `/test/test.html`. Make sure you download the media files from https://github.com/johndyer/mediaelement-files and place them inside the `/media/` directory.
* A code template to build a feature is presented below.

```javascript
(function($) {

	$.extend(mejs.MepDefaults, {
		// Any variable that can be configured by the end user belongs here.
		// Make sure is unique by checking API and Configuration file.
		// Add comments about the nature of each of these variables.
	});

	
	$.extend(MediaElementPlayer.prototype, {
	
	    // Public variables
	
		build[feature_name]: function(player, controls, layers, media) {
		    // This allows us to access options and other useful elements already set.
		    // Adding variables to the object is a good idea if you plan to reuse 
		    // those variables in further operations.
			var t = this;

            // All code required inside here to keep it private;
            // otherwise, you can create more methods or add variables
            // outside of this scope
		}
		
		// Public methods
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

If it is a translation that wants to be added, a couple of considerations need to be considered:

* The current format is `'mejs.[ID of element]' : 'translation'` (i.e., `'mejs.play': 'Play'`).
* The first element in the object **MUST** be `mejs.plural-form: [Number]`, where `[Number]` is the Family Group Number the language belongs (see `/src/js/me-18n.js` to determine which number is the appropriate one).
* If you require to use plurals, you must write the possible translations in the order specified in http://localization-guide.readthedocs.io/en/latest/l10n/pluralforms.html as an array, and the placeholder to replace the number would be `%1`. 
* **Only one** plural can be in the strings.
* A code template to build a translation is presented below.
```javascript
/*!
 * [Locale] translation ([lang])
 *
 * @see me-i18n.js
 */
;(function(exports, undefined) {

    "use strict";

    if (typeof exports.[lang] === 'undefined') {
        exports.[lang] = {
        
            // Find the family group number; see `/src/js/me-18n.js`
            'mejs.plural-form': 14,
            
            // Regular translations; to get the entire list of elements, always refer to `me-i18n-locale-en.js`
            ... 
            
            // Example for pluralization following the form `nplurals=3; plural=(n%10==1 ? 0 : n%10==2 ? 1 : 2);`
            // meaning that if the modulo between number indicated and 10 is 1, then the first string will be used;
            // if the modulo between number indicated and 10 is 2, it will use the second one; otherwise, it will use the third case
            'mejs.time-skip-back' : ["Назад на %1 секунд", "Назад на %1 секунди", "Назад на %1 секунда"],

        };
    }

}(mejs.i18n.locale.strings));
```


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

<a id="building"></a>
## Building

To compile ALL the files, in your Terminal window just type `grunt` in the root of the project. 

If during the development wasn't necessary to do any changes to the Flash files, type `grunt html5only`. That way, the Flash files will remain intact. You can also type `grunt debug_html5` to avoid removing the console messages.

If, on the other hand, only the ActionScript files were affected, type `sh compile_swf.sh` and it will build the compiled files in `/local-build/` directory. Then just copy the files and put them inside `/build/` directory.

Finally, if changes were done to the `FlashMediaElement.fla` file:

1. Open it in the Flash Professional IDE. 
2. Go to the menu item `File->Publish Settings`
3. Click the `Flash` tab
4. Make sure the box `Export SWC` is checked
5. Click `Publish`

________
[Back to Main](README.md)
