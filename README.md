# A custom mediaelement for Drupal

### `<video>` and `<audio>` made easier.

This library is an optimized version (~83kb vs. 109kb) of the mediaelement player featuring an improved grunt build process & simplified custom styling with sass.

Use this lib was designed for the improved mediaelement module for Drupal to allow easy theme switching, but can also be used in place of the standard mediaelement library to cut down on filesize.

## Installation and Usage
This is a drop-in replacement for the standard mediaelement.js library. To integrate with the mediaelement or improved mediaelement module for Drupal:

1. Download/git this library and extract to `$base_url/sites/all/libraries/mediaelement`

2. Customize the build for your specific needs by configuring the grunt tasks or editing the `/src/` assets.

	- `grunt` : compiles all `/src/` assets to `/local-build/`.
	- `grunt build` : copies the `/local-build/` to `/build/`.

3. Download/git the mediaelement module and extract to `$base_url/sites/$site/modules/mediaelement`

4. Enable the module.

5. Configure module

 	- global settings : `$base_url/admin/config/media/mediaelement`.
	- field format settings :  `$base_url/admin/structure/types/manage/$content_type/display`.

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
