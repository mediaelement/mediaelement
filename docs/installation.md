# Installation

* [0. Setup MIME-types](#mime-types)
* [1. Install `MediaElementJS`](#install)
	* [Installation in WordPress](#wordpress)
		* [In `wp-admin/about.php`](#wp-about)
		* [In `wp-admin/includes/ajax-actions.php`](#wp-ajax)
		* [In `wp-includes/media.php`](#wp-media)
		* [In `wp-includes/js/mediaelement` folder](#wp-js-mediaelement)
		* [In `wp-includes/script-loader.php`](#wp-script)
	* [Installation in Drupal](#drupal)
	* [Additional plugins](#plugins)
* [2. Add Script and Stylesheet](#script-and-stylesheet)
* [3. Add `<video>` or `<audio>` tags](#tags)
	* [Default setup](#default-setup)
	* [Multiple codecs (Optional)](#multi-codecs)
	* [Browsers with JavaScript disabled (Optional)](#disabled-javascript)
	* [Use of Closed Captioning (Optional)](#closed-captioning)
* [4. Setup Player](#player)
* [5. Set default language (Optional)](#language)

<a id="mime-types"></a>
## 0. Setup MIME-types (optional)
On Linux/Apache servers, create a file called .htaccess with the following text and upload it to the root of your website
```
# Video support
AddType video/ogg .ogv
AddType video/mp4 .mp4
AddType video/webm .webm
AddType video/ogv .ogv

# Audio support
AddType audio/mp3 .mp3
AddType audio/oga .oga
AddType audio/ogg .ogg
AddType audio/wav .wav

# For HLS support
AddType application/x-mpegURL .m3u8
AddType vnd.apple.mpegURL .m3u8
AddType video/MP2T .ts

# For M(PEG)-DASH support
AddType application/dash+xml .mpd

# For subtitles support
AddType text/vtt .vtt
AddType text/srt .srt
```

On Windows/IIS servers, please follow Microsoft's instructions on how to add/edit MIME types on [IIS6](http://www.microsoft.com/technet/prodtechnol/WindowsServer2003/Library/IIS/eb5556e2-f6e1-4871-b9ca-b8cf6f9c8134.mspx?mfr=true) and [IIS7](https://technet.microsoft.com/en-us/library/cc725608(v=ws.10).aspx).

If you are working with local files and plan to test Flash playback, make sure you go to the [Flash Security Settings](http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html) page and add your working directory. Also, things tend to work best when you use absolute paths.

If you want to make your media to play in `Chromium` browser, please read [this document](https://www.chromium.org/audio-video)

For more information about how to set up a server to serve media properly and other general and useful topics about dealing with HTML5 video, [this article](http://ronallo.com/blog/html5-video-everything-i-needed-to-know) is a good start point.

**Do not** compress media (`mod_deflate` or `gzip`), since it can lead to unexpected results, like headers not being passed correctly.

<a id="install"></a>
## 1. Install `MediaElementJS`

To get the default installation there are several different ways.

1. Download the package from https://github.com/mediaelement/mediaelement

2. Use a CDN reference; the most popular ones are [jsDelivr](http://cdn.jsdelivr.net/npm/mediaelement/) and [cdnjs](https://cdnjs.com/libraries/mediaelement).

3. Through GIT: `git clone https://github.com/mediaelement/mediaelement.git`

4. Through NPM: `npm install mediaelement`

5. Through BOWER: `bower install mediaelement`

6. If you are using Meteor: `meteor add johndyer:mediaelement` or `meteor npm install mediaelement`


<a id="wordpress"></a>
### Installation in WordPress

WordPress currently incorporates `MediaElementJS` as a part of the [Embeds](https://codex.wordpress.org/Embeds) core package. If you are using a version prior 4.9, and you want to upgrade `MediaElementJS` to the latest version, follow these steps:

<a id="wp-about"></a>
#### In `wp-admin/about.php`
1. Find the block
```
if ( ! wp_is_mobile() ) {
	wp_enqueue_style( 'wp-mediaelement' );
```
and add below the following:
```
wp_enqueue_script( 'mediaelement-vimeo' );
```
2. Find the block
```
wp_localize_script( 'mediaelement', '_wpmejsSettings',
```
and add in the `_wpmejsSettings` the following:
```
'pluginPath'        => includes_url( 'js/mediaelement/', 'relative' ),
'pauseOtherPlayers' => '',
'classPrefix'       => 'mejs-',
'stretching'        => 'responsive',
```

<a id="wp-ajax"></a>
#### In `wp-admin/includes/ajax-actions.php`

1. Find the blocks that contain:
```
wp_print_scripts( 'wp-mediaelement' );
```
and replace them with:
```
wp_print_scripts( array( 'mediaelement-vimeo', 'wp-mediaelement' ) );
```

<a id="wp-media"></a>
#### In `wp-includes/media.php`

1. Find the block that contains:
```
$library = apply_filters( 'wp_video_shortcode_library', 'mediaelement' );
if ( 'mediaelement' === $library && did_action( 'init' ) ) {
	wp_enqueue_style( 'wp-mediaelement' );
	wp_enqueue_script( 'wp-mediaelement' );
}
```
and replace it with:
```
$library = apply_filters( 'wp_video_shortcode_library', 'mediaelement' );
if ( 'mediaelement' === $library && did_action( 'init' ) ) {
	wp_enqueue_style( 'wp-mediaelement' );
	wp_enqueue_script( 'mediaelement-vimeo' );
	wp_enqueue_script( 'wp-mediaelement' );
}
```

2. Find the block that contains:
```
if ( $is_vimeo ) {
	wp_enqueue_script( 'froogaloop' );
}
```
and replace it with:
```
if ( $is_vimeo ) {
	wp_enqueue_script( 'mediaelement-vimeo' );
}
```

3. Inside the function `wpview_media_sandbox_styles()`, replace:
```
$mediaelement = includes_url( "js/mediaelement/mediaelementplayer.min.css?$version" );

```
with:
```
$mediaelement = includes_url( "js/mediaelement/mediaelementplayer-legacy.min.css?$version" );
```

<a id="wp-js-mediaelement"></a>
#### In `wp-includes/js/mediaelement` folder

1. Remove all the files from the folder and install all the files inside the `build` folder from the `MediaElement` project.
2. Download and copy/paste the WordPress files contained in this [link](https://github.com/mediaelement/mediaelement/files/1048572/wp-mejs.zip).

<a id="wp-script"></a>
#### In `wp-includes/script-loader.php`

1. Find the block:
```
$scripts->add( 'mediaelement', "/wp-includes/js/mediaelement/mediaelement-and-player.min.js", array('jquery'), '2.22.0', 1 );
```
and replace all of that until you reach the end of the translations, with this:
```
$scripts->add( 'mediaelement', "/wp-includes/js/mediaelement/mediaelement-and-player.min.js", array('jquery'), 'X.X.X', 1 );
did_action( 'init' ) && $scripts->localize( 'mediaelement', 'mejsL10n', array(
	'language' => get_bloginfo( 'language' ),
	'strings'  => array(
		'mejs.install-flash'       => __( 'You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/' ),
		'mejs.fullscreen-off'      => __( 'Turn off Fullscreen' ),
		'mejs.fullscreen-on'       => __( 'Go Fullscreen' ),
		'mejs.download-video'      => __( 'Download Video' ),
		'mejs.fullscreen'          => __( 'Fullscreen' ),
		'mejs.time-jump-forward'   => array( __('Jump forward 1 second'), __('Jump forward %1 seconds') ),
		'mejs.loop'                => __( 'Toggle Loop' ),
		'mejs.play'                => __( 'Play' ),
		'mejs.pause'               => __( 'Pause' ),
		'mejs.close'               => __( 'Close' ),
		'mejs.time-slider'         => __( 'Time Slider' ),
		'mejs.time-help-text'      => __( 'Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.' ),
		'mejs.time-skip-back'      => array( __('Skip back 1 second'), __('Skip back %1 seconds') ),
		'mejs.captions-subtitles'  => __( 'Captions/Subtitles' ),
		'mejs.captions-chapters'   => __( 'Chapters' ),
		'mejs.none'                => __( 'None' ),
		'mejs.mute-toggle'         => __( 'Mute Toggle' ),
		'mejs.volume-help-text'    => __( 'Use Up/Down Arrow keys to increase or decrease volume.' ),
		'mejs.unmute'              => __( 'Unmute' ),
		'mejs.mute'                => __( 'Mute' ),
		'mejs.volume-slider'       => __( 'Volume Slider' ),
		'mejs.video-player'        => __( 'Video Player' ),
		'mejs.audio-player'        => __( 'Audio Player' ),
		'mejs.ad-skip'             => __( 'Skip ad' ),
		'mejs.ad-skip-info'        => array( __('Skip in 1 second'), __('Skip in %1 seconds') ),
		'mejs.source-chooser'      => __( 'Source Chooser' ),
		'mejs.stop'                => __( 'Stop' ),
		'mejs.speed-rate'          => __( 'Speed Rate' ),
		'mejs.live-broadcast'      => __( 'Live Broadcast' ),
		'mejs.afrikaans'           => __( 'Afrikaans' ),
		'mejs.albanian'            => __( 'Albanian' ),
		'mejs.arabic'              => __( 'Arabic' ),
		'mejs.belarusian'          => __( 'Belarusian' ),
		'mejs.bulgarian'           => __( 'Bulgarian' ),
		'mejs.catalan'             => __( 'Catalan' ),
		'mejs.chinese'             => __( 'Chinese' ),
		'mejs.chinese-simplified'  => __( 'Chinese (Simplified)' ),
		'mejs.chinese-traditional' => __( 'Chinese (Traditional)' ),
		'mejs.croatian'            => __( 'Croatian' ),
		'mejs.czech'               => __( 'Czech' ),
		'mejs.danish'              => __( 'Danish' ),
		'mejs.dutch'               => __( 'Dutch' ),
		'mejs.english'             => __( 'English' ),
		'mejs.estonian'            => __( 'Estonian' ),
		'mejs.filipino'            => __( 'Filipino' ),
		'mejs.finnish'             => __( 'Finnish' ),
		'mejs.french'              => __( 'French' ),
		'mejs.galician'            => __( 'Galician' ),
		'mejs.german'              => __( 'German' ),
		'mejs.greek'               => __( 'Greek' ),
		'mejs.haitian-creole'      => __( 'Haitian Creole' ),
		'mejs.hebrew'              => __( 'Hebrew' ),
		'mejs.hindi'               => __( 'Hindi' ),
		'mejs.hungarian'           => __( 'Hungarian' ),
		'mejs.icelandic'           => __( 'Icelandic' ),
		'mejs.indonesian'          => __( 'Indonesian' ),
		'mejs.irish'               => __( 'Irish' ),
		'mejs.italian'             => __( 'Italian' ),
		'mejs.japanese'            => __( 'Japanese' ),
		'mejs.korean'              => __( 'Korean' ),
		'mejs.latvian'             => __( 'Latvian' ),
		'mejs.lithuanian'          => __( 'Lithuanian' ),
		'mejs.macedonian'          => __( 'Macedonian' ),
		'mejs.malay'               => __( 'Malay' ),
		'mejs.maltese'             => __( 'Maltese' ),
		'mejs.norwegian'           => __( 'Norwegian' ),
		'mejs.persian'             => __( 'Persian' ),
		'mejs.polish'              => __( 'Polish' ),
		'mejs.portuguese'          => __( 'Portuguese' ),
		'mejs.romanian'            => __( 'Romanian' ),
		'mejs.russian'             => __( 'Russian' ),
		'mejs.serbian'             => __( 'Serbian' ),
		'mejs.slovak'              => __( 'Slovak' ),
		'mejs.slovenian'           => __( 'Slovenian' ),
		'mejs.spanish'             => __( 'Spanish' ),
		'mejs.swahili'             => __( 'Swahili' ),
		'mejs.swedish'             => __( 'Swedish' ),
		'mejs.tagalog'             => __( 'Tagalog' ),
		'mejs.thai'                => __( 'Thai' ),
		'mejs.turkish'             => __( 'Turkish' ),
		'mejs.ukrainian'           => __( 'Ukrainian' ),
		'mejs.vietnamese'          => __( 'Vietnamese' ),
		'mejs.welsh'               => __( 'Welsh' ),
		'mejs.yiddish'             => __( 'Yiddish' ),
	),
) );
$scripts->add( 'mediaelement-vimeo', "/wp-includes/js/mediaelement/renderers/vimeo.min.js", array('mediaelement'), 'X.X.X', 1 );
$scripts->add( 'wp-mediaelement', "/wp-includes/js/mediaelement/wp-mediaelement$suffix.js", array('mediaelement'), false, 1 );
$mejs_settings = array(
	'pluginPath' => includes_url( 'js/mediaelement/', 'relative' ),
		'classPrefix' => 'mejs-',
		'stretching' => 'responsive',
);
```
being `X.X.X` the latest version you want to install.

2. Remove `$scripts->add( 'froogaloop',  "/wp-includes/js/mediaelement/froogaloop.min.js", array(), '2.0' );`

3. Replace:
```
$styles->add( 'mediaelement', "/wp-includes/js/mediaelement/mediaelementplayer.min.css", array(), '2.22.0' );
```
with:
```
$styles->add( 'mediaelement',  "/wp-includes/js/mediaelement/mediaelementplayer-legacy.min.css", array(), 'X.X.X' );
```
being `X.X.X` the latest version you want to install.

<a id="drupal"></a>
### Installation in Drupal

With Drupal, you can create your own module and add `MediaElement` to it (see this document for more information).

However, if you are using, or **if you have a Drupal 7 installation** and want to use, [`MediaElement Module`](https://www.drupal.org/project/mediaelement), you have to update it performing the following steps: 

1. Install the [Libraries](https://www.drupal.org/project/libraries) module, if you haven't.

2. Install the module into the `modules` folder, if you haven't.

3. Replace the line in the `modules/mediaelement/mediaelement.admin.inc` file
```
'#markup' => '<video width="360" height="203" id="player1" src="' . $path . '/media/echo-hereweare.mp4"><p>Your browser leaves much to be desired.</p></video>',
```
with
```
'#markup' => '<video width="360" height="203" id="player1" src="https://media.w3.org/2010/05/sintel/trailer.mp4"></video>',
```

4. Install `MediaElement` latest `build` folder into Drupal's `sites/all/libraries/mediaelement` directory.

5. Activate the module and configure it from Drupal's `Module` section.

6. Check the box on `Enable MediaElement.js site wide`.

7. Now every time you create a page/post and include the `video` or `audio` tag, the player will render them.

<a id="plugins"></a>
### Additional plugins

If you want to install any of them, refer to the new plugins repository clicking [here](https://github.com/mediaelement/mediaelement-plugins) for more information.

<a id="script-and-stylesheet"></a>
## 2. Add Script and Stylesheet
```html
<script src="/path/to/jquery.js"></script>
<script src="/path/to/mediaelement-and-player.min.js"></script>
<!-- Add any other renderers you need; see Use Renderers for more information -->
<link rel="stylesheet" href="/path/to/mediaelementplayer.min.css" />
```

If you wish to install the sources in different directories (i.e., all Javascript files in a _js_, all CSS in a _styles_, Flash shims in _plugins_, etc.), add the following CSS update after the _mediaelementplayer.css_ reference (**only if the images are not in the same folder as the stylesheet**):
```html
<link rel="stylesheet" href="/path/to/mediaelementplayer.min.css" />

<style>
.mejs__overlay-button {
	background-image: url("/path/to/mejs-controls.svg");
}
.mejs__overlay-loading-bg-img {
	background-image: url("/path/to/mejs-controls.svg");
}
.mejs__button > button {
	background-image: url("/path/to/mejs-controls.svg");
}
</style>
```

Also, update `pluginPath` within the configuration options (visit [Usage and Tips](usage.md) and [API and Configuration](api.md) for more details) with the location of the Flash shims.

You can also use a CDN to load your script and stylesheet.

As stated above, the important factor is to set the `pluginPath` correctly, but also, for this scenario, you will need to set the `shimScriptAccess` configuration element as ***`always`*** to make the shims to work.

As an example:

```javascript
$('video, audio').mediaelementplayer({
	// Do not forget to put a final slash (/)
	pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
	// this will allow the CDN to use Flash without restrictions
	// (by default, this is set as `sameDomain`)
	shimScriptAccess: 'always'
	// more configuration
});
```

Check the content of `mediaelementplayer.min.css` (or if you decided to use the old styles, `mediaelementplayer-legacy.min.css`) to customize any CSS related to the player.

Also, as an example, visit [this section](resources.md#styles) to have an idea on how can you customize the look-and-feel of the player.


<a id="tags"></a>
## 3. Add `<video>` or `<audio>` tags

<a id="default-setup"></a>
### Default setup
If your users have JavaScript and/or Flash, the easiest route for all browsers and mobile devices is to use a single file.

```html
<video src="myvideo.mp4" width="320" height="240" type="video/mp4"></video>

```
or
```html
<video width="320" height="240">
	<source type="video/mp4" src="myvideo.mp4" />
</video>
```

All the formats supported are listed in [this table](usage.md#renderers-list). Besides that, there are some additional attributes that can be added in the `video`/`audio` tag.
Visit the [Attributes](api.md#attributes) section for more information.

**Note**: Although it is important to include their MIME type so the plugin renders the media accurately, some browsers like Firefox can display warnings in regards of unknown/custom MIME types. But they do not prevent the plugin to work properly.

<a id="multi-codecs"></a>
### Multiple codecs (Optional)
This includes multiple codecs for various browsers (H.264 for IE9+, Safari, and Chrome, WebM for Firefox 4 and Opera, Ogg for Firefox 3).

```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	<source type="video/webm" src="myvideo.webm" />
	<source type="video/ogg" src="myvideo.ogv" />
</video>
```

<a id="disabled-javascript"></a>
### Browsers with JavaScript disabled (Optional)
In very rare cases, you might have a non-HTML5 browser with Flash turned on and JavaScript turned off. In that specific case, you can also include the Flash `<object>` code. For more information abput this approach, please read [Video for Everybody!](http://camendesign.com/code/video_for_everybody) documentation.
```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	<source type="video/webm" src="myvideo.webm" />
	<source type="video/ogg" src="myvideo.ogv" />
	<object width="320" height="240" type="application/x-shockwave-flash" data="/path/to/mediaelement-flash-video.swf">
		<param name="movie" value="/path/to/mediaelement-flash-video.swf" />
		<param name="flashvars" value="controls=true&amp;poster=myvideo.jpg&amp;file=myvideo.mp4" />
		<img src="myvideo.jpg" width="320" height="240" title="No video playback capabilities" />
	</object>
</video>
```
If you plan to use this approach, just remember that it will only work for native media types, and you can use `mediaelement-flash-audio.swf` (MP3), `mediaelement-flash-audio-ogg.swf` (OGA) or `mediaelement-flash-video.swf` (MP4, FLV, RTMP, M4V, etc.) shims for it.

<a id="closed-captioning"></a>
### Use of Closed Captioning (Optional)

The way to setup closed captioning is by using the `track` tag as follows:
```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	...
	<track src="subtitles_en.[srt|vtt]" kind="[subtitles|captions|chapters]" srclang="en" label="English">
	<track src="subtitles_es.[srt|vtt]" kind="[subtitles|captions|chapters]" srclang="es" label="Spanish">
	...
</video>
```

This works perfectly on any browser that supports HTML5 natively; however, to make this work across browsers, an AJAX request is performed to parse the content of the subtitles file.

That's why is important to put the caption files **in the same domain as the player is**. Otherwise, the request of the file will be denied.

As a final note, to display closed captioning in iOS, they will need to be transcoded it in the video. To learn more about this topic, please read [The Zencoder guide to closed captioning for web, mobile, and connected TV](http://blog.zencoder.com/2012/07/13/closed-captioning-for-web-mobile-and-tv/).

<a id="player"></a>
## 4. Setup Player

The easiest way to use the player is adding the `class="mejs__player"` to any `<video>`, `<audio>`, or `<iframe>` tags, and add the `data-mejsoptions` to configure it.

For more details and ways to set the player, please read the [Usage section](usage.md#initialize).

<a id="language"></a>
## 5. Set default language (Optional)

By default, all the strings in `MediaElementJS` are in English. If you wanna set a different language for them, you need to set the language code via `mejs.i18n.locale.language` before the player instantiation, and specify the language in the media container in the `success` callback.

Optionally, just can set the attribute `lang` in the `<html>` tag with the one you set before, to declare the default language of the text in the rest of the page as well.

```html
<script>

	mejs.i18n.language('de'); // Setting German language

	$('audio,video').mediaelementplayer({
		success: function(player, node) {

			// Optional
			$(player).closest('.mejs__container').attr('lang', mejs.i18n.language());

			$('html').attr('lang', mejs.i18n.language());

			// More code
		}
	});
</script>
```

Available languages:
* Catalan (ca)
* Czech (cs)
* German (de)
* English (en)
* Spanish; Castilian (es)
* French (fr)
* Hungarian (hu)
* Italian (it)
* Japanese (ja)
* Korean (ko)
* Dutch (nl)
* Polish (pl)
* Portuguese (pt)
* Brazilian Portuguese (pt-BR)
* Romanian (ro)
* Russian (ru)
* Slovak (sk)
* Swedish (sv)
* Ukrainian (uk)
* Simplified Chinese (zh-CN)
* Traditional Chinese (zh-TW)

________

[Back to Main](../README.md)
