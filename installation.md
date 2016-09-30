# Installation

* [0. Setup MIME-types](#mime-types)
* [1. Add Script and Stylesheet](#script-and-stylesheet)
* [2. Add `<video>` or `<audio>` tags](#tags)
    * [Multiple codecs (Optional)](#multi-codecs)
    * [Browsers with JavaScript disabled (Optional)](#disabled-javascript)
    * [Use of Closed Captioning (Optional)](#closed-captioning)
* [3. Set default language (Optional)](#language)
    

<a id="mime-types"></a>
## 0. Setup MIME-types (optional)
On Linux/Apache servers, create a filed called .htaccess with the following text and upload it to the root of your website
```
AddType video/ogg .ogv
AddType video/mp4 .mp4
AddType video/webm .webm
```
On Windows/IIS servers, please follow Microsoft's instructions on how to add/edit MIME types on [IIS6](http://www.microsoft.com/technet/prodtechnol/WindowsServer2003/Library/IIS/eb5556e2-f6e1-4871-b9ca-b8cf6f9c8134.mspx?mfr=true) and [IIS7](https://technet.microsoft.com/en-us/library/cc725608(v=ws.10).aspx).

If you are working with local files and plan to test Flash playback, make sure you go to the [Flash Security Settings](http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html) page and add your working directory. Also, things tend to work best when you use absolute paths.

For more information about how to set up a server to serve media properly and other general and useful topics about dealing with HTML5 video, [this article](http://ronallo.com/blog/html5-video-everything-i-needed-to-know) is a good start point.

<a id="script-and-stylesheet"></a>
## 1. Add Script and Stylesheet
```html
<script src="jquery.js"></script>
<script src="mediaelement-and-player.min.js"></script>
<link rel="stylesheet" href="mediaelementplayer.css" />
```

Note: to support IE6-8, this code must appear in the `<head>` tag. If you cannot place the MediaElement.js code in the `<head>` you need to install something like [html5shiv](https://github.com/afarkas/html5shiv).

If you wish to install the sources in different directories (i.e., all Javascript files in a _js_, all CSS in a _styles_, Flash/Silverlight files in _plugins_, etc.), add the following CSS update after the _mediaelementplayer.css_ reference (**only if the images are not in the same folder as the stylesheet**):
```html
<link rel="stylesheet" href="/path/to/mediaelementplayer.css" />

<style>
.mejs-overlay-loading, .mejs-container .mejs-controls, 
.mejs-controls .mejs-volume-button .mejs-volume-slider,
.mejs-controls .mejs-captions-button .mejs-captions-selector,
.mejs-captions-text, .mejs-controls .mejs-sourcechooser-button .mejs-sourcechooser-selector,
.mejs-postroll-layer, .mejs-postroll-close,
.mejs-controls .mejs-speed-button .mejs-speed-selector {
    background: url("/path/to/background.png");
}

.no-svg .mejs-overlay-button {
    background-image: url("/path/to/bigplay.png");
}

.no-svg .mejs-controls .mejs-button button {
	background-image: url("/path/to/controls.png");
}

.mejs-controls .mejs-button.mejs-jump-forward-button {
    background: transparent url("/path/to/jumpforward.png") no-repeat 3px 3px;
}

.mejs-controls .mejs-button.mejs-skip-back-button {
    background: transparent url("/path/to/skipback.png") no-repeat 3px 3px;
}

.mejs-overlay-button {
    background: url("/path/to/bigplay.svg") no-repeat;
}

.mejs-controls .mejs-button button {
    background-image: url("/path/to/controls.svg");
}
</style>
```

Also, update ```pluginPath``` within the configuration options (visit [Usage and Tips](usage.md) and [API and Configuration](api.md) for more details) with the location of the Flash/Silverlight files to make _shim_ mode to work. Also, update ```flashName``` and ```silverlightName``` configuration options **only if those files were renamed**.

<a id="tags"></a>
## 2. Add `<video>` or `<audio>` tags
If your users have JavaScript and/or Flash, the easiest route for all browsers and mobile devices is to use a single MP4 or MP3 file.

```html	
<video src="myvideo.mp4" width="320" height="240"></video>
```
```html	
<audio src="myaudio.mp3"></audio>
```

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
In very rare cases, you might have a non-HTML5 browser with Flash turned on and JavaScript turned off. In that specific case, you can also include the Flash `<object>` code.
```html
<video width="320" height="240" poster="poster.jpg" controls="controls" preload="none">
	<source type="video/mp4" src="myvideo.mp4" />
	<source type="video/webm" src="myvideo.webm" />
	<source type="video/ogg" src="myvideo.ogv" />
	<object width="320" height="240" type="application/x-shockwave-flash" data="flashmediaelement.swf">
		<param name="movie" value="flashmediaelement.swf" /> 
		<param name="flashvars" value="controls=true&amp;poster=myvideo.jpg&amp;file=myvideo.mp4" /> 		
		<img src="myvideo.jpg" width="320" height="240" title="No video playback capabilities" />
	</object>
</video>
```

<a id="closed-captioning"></a>
### Use of Closed Captioning (Optional)

The way to setup closed captioning is by using the `track` tag as follows:
```html
<video ...>
    <source ...>
    ... 
    <track src="subtitles_en.[srt|vtt]" kind="[subtitles|captions|chapters]" srclang="en" label="English">
    <track src="subtitles_es.[srt|vtt]" kind="[subtitles|captions|chapters]" srclang="es" label="Spanish">
    ...
</video>
```

This works perfectly on any browser that supports HTML5 natively; however, to make this work across browsers, an AJAX request is performed to parse the content of the subtitles file.

That's why is important to put the caption files **in the same domain as the player is**. Otherwise, the request of the file will be denied.

As a final note, to display closed captioning in iOS, they will need to be transcoded it in the video. To learn more about this topic, please read [The Zencoder guide to closed captioning for web, mobile, and connected TV](http://blog.zencoder.com/2012/07/13/closed-captioning-for-web-mobile-and-tv/) 

<a id="language"></a>
## 3. Set default language (Optional)

By default, all the strings in `MediaElementJS` are in English. If you wanna set a different language for them, you need to set the language code via `mejs.i18n.locale.language` before the player instantiation, and specify the language in the media container in the `success` callback.

Optionally, just can set the attribute `lang` in the `<html>` tag with the one you set before, to declare the default language of the text in the rest of the page as well.

```html
<script>

    mejs.i18n.locale.language = 'de'; // Setting German language
    
    $('audio,video').mediaelementplayer({
        success: function(player, node) {
        
            $(player).closest('.mejs-container').attr('lang', mejs.i18n.getLanguage());
            
            $('html').attr('lang', mejs.i18n.getLanguage());
            
            // More code
        }
    });
</script>
```

Available languages:
* Czech (cs)
* German (de)
* English (en)
* Spanish; Castilian (es)
* French (fr)
* Hungarian (hu)
* Italian (it)
* Japanese (ja)
* Korean (ko)
* Polish (pl)
* Portuguese (pt)
* Brazilian Portuguese (pt-BR)
* Romanian (ro)
* Russian (ru)
* Slovak (sk)
* Simplified Chinese (zh-CN)
* Traditional Chinese (zh-TW)

________
[Back to Main](README.md)
