# A better mediaelement

### `<video>` and `<audio>` made even easier.

This library is an optimized version of mediaelement.js with everything you need to implement a basic mediaelement player and nothing you don't.

Additional features that aren't part of the basic implementation can be easily added with a custom build.

Improvements in filesizes are a result of excluding unnecessary plugins from the build process and using less/more specific css selectors.

## Customization & Configuration

### Project Structure

`/src/` : Editable assets that will be compiled & processed into `/local-build/`.

`/local-build/` : Compiled assets that have yet to be tested.

`/build/` : Compiled assets used in production.

`/grunt/` : Configuration files of grunt tasks.

### Available Grunt tasks:

 - `grunt` : Compiles all `/src/` assets to `/local-build/`.

 - `grunt style` : Compiles css & newer image assets to `/local-build/`.

 - `grunt build` : Copies the `/local-build/` to `/build/`.

### Styling

Sass is the preferred method of styling - *css may be edited directly, but isn't recommended*. Styles are broken up into partials in the `/inc/` directory for easier inclusion/exclusion of needed elements.

 Compass, Autoprefixer, CSSComb, and CSSMin will be run as part of the  `grunt` & `grunt style` tasks.

### Plugins

Extend the player's functionality by uncommenting the desired plugins in `/grunt/concat.js` and rebuild the script.

### I18n

I18n functionality has been removed from mediaelement.js (*due to the requirement for a custom build*), but remains available in mediaelement.i18n.js.

To enable translations, uncomment the desired languages in `/grunt/concat.js` and rebuild the script.

## How it Works:
Many great HTML5 players have a completely separate Flash UI in fallback mode, but `MediaElementPlayer.js` uses the same HTML/CSS for all players.

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using.
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.
```html
<script src="mediaelement.js"></script>
<video src="myvideo.mp4" width="320" height="240"></video>

<script>
var v = document.getElementsByTagName("video")[0];
new MediaElement(v, {success: function(media) {
	media.play();
}});
</script>
```
