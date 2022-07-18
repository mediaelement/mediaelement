# Migration Guide

## Migrating from `4.x` to `5.x` version

In order to successfully install `5.x` in an existing setup, you must consider the following guidelines:

The major change in this version is the new svg sprite map. The sprite map is now built with a connection between `<symbol>` and `<use>`.
Every `<symbol>` is connected with an html attribute `id` by the `<use>` tag.

1. You **must** import/replace the new sprite map within your project.

2. If the sprite map is not located in the root path, you need to set the new option `iconSprite` to the path where the sprite map is located, see [standalone documentation](docs/api.md#standalone)  

3. If you use a different design for the control buttons than the default one, you have to replace the contents of the according `<symbol>` tags with your svg code.
 
4. The style sheets are changed on the basis of version `4.2.17`. If you have changed your style sheets, the changes have to be merged to `mediaelementplayer.css` or `mediaelementplayer-legacy.css` depending on the style sheet file you are using.

5. In version `4.x` the sprite was moved as background of each button to display the according background image. In version `5.x` each control element still has one button. But the difference is that its inner html consists of up to three possible svgs (e.g. play, pause, replay or mute and unmute) one of which is displayed while the other(s) is/are not, according to the context (class of parent `<div>`).

Example for 5.:
``` html
<!-- parent div with context class "mejs__play" (shows play svg) -->
<div class="mejs__button mejs__playpause-button mejs__play">
    <button aria-controls="mep_0" title="Play" aria-label="Play">
        <!-- three svgs with icons for play, pause, replay -->
        <svg xmlns="http://www.w3.org/2000/svg" id="mep_0-icon-play" class="mejs__icon-play" aria-hidden="true" focusable="false">
            <use xlink:href="mejs-controls.svg#icon-play"></use>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" id="mep_0-icon-pause" class="mejs__icon-pause" aria-hidden="true" focusable="false">
            <use xlink:href="mejs-controls.svg#icon-pause"></use>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" id="mep_0-icon-replay" class="mejs__icon-replay" aria-hidden="true" focusable="false">
            <use xlink:href="mejs-controls.svg#icon-replay"></use>
        </svg>
    </button>
</div>
```


## CHANGES on `4.2.0` version

As part of the continuous improvements the player, we have decided to drop completely support for IE9 and IE10, since market share of those browsers together is 0.4%, according to http://caniuse.com/usage-table.

This change is for `MediaElement` and `MediaElement Plugins` repositories.

## Migrating from `2.x` to `4.x` version

**NOTE:** `3.x` version has jQuery in the code base, and `4.x` is framework-agnostic. So for either `3.x` or `4.x` versions, the following steps are valid, but it is highly recommended to upgrade to `4.x`.

In order to successfully install `4.x` in an existing setup, you must consider the following guidelines:

1. If your installation relies on the legacy player classes (i.e., `mejs-player`, `mejs-container`, etc.), you **must** set up the proper namespace. In `2.x`, the default namespace is `mejs-` but now is `mejs__`. In order to set up a new namespace (or the legacy one), use the `classPrefix` configuration, and make sure you use the `mediaelementplayer-legacy` stylesheet provided in the `/build/` folder.

2. By default, `MediaElement` has bundled native renderers, such as HLS, M(PEG)-DASH and FLV, as well as YouTube and Flash shims. **If you want to use any other renderer, you MUST refer to the `build/renderers` folder and add as many as you want**. Check `demo/index.html` for a better reference.

3. You **must** set up now the path for the Flash shims if they are not in the same folder as the JS files. To do this, set the path via the `pluginPath` configuration. In the same topic, if you need to support browsers with JavaScript disabled, you **must** reference the correct Flash shim, since in `2.x` there was only a single Flash shim and in `3.x` it was split to target specific media types. Check the [Browsers with JavaScript disabled](docs/installation.md#disabled-javascript) section for more details.

4. If you want to use Flash shims from a CDN, do the change related to `pluginPath` setting the CDN's URL, and also setting `shimScriptAccess` configuration as **`always`**.

5. If you need to force the Flash shim, the way to do it in `3.x` version is to use the `renderers` configuration and list them in an array.

6. `pluginType` was removed to favor `rendererName`. If you rely on that element, just create conditionals based on the renderer ID (all listed [here](docs/usage.md#renderers-list)). For example:

```javascript
$('video, audio').mediaelementplayer({
	// Configuration
	success: function(media) {
		var isNative = /html5|native/i.test(media.rendererName);

		var isYoutube = ~media.rendererName.indexOf('youtube');

		// etc.
	}
});
```
