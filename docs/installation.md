# Installation

* [0. Setup MIME-types](#mime-types)
* [1. Install `MediaElementJS`](#install)
* [2. Add Script and Stylesheet](#script-and-stylesheet)
* [3. Add `<video>` or `<audio>` tags](#tags)
    * [Default setup](#default-setup)
    * [Multiple codecs (Optional)](#multi-codecs)
    * [Browsers with JavaScript disabled (Optional)](#disabled-javascript)
    * [Use of Closed Captioning (Optional)](#closed-captioning)
* [4. Set default language (Optional)](#language)
    

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
 
1. Download the package from https://github.com/johndyer/mediaelement 

2. Use a CDN reference; the most popular ones are [jsDelivr](http://www.jsdelivr.com/projects/mediaelement) and [cdnjs](https://cdnjs.com/libraries/mediaelement). 

3. Through GIT: `git clone https://github.com/johndyer/mediaelement.git`

4. Through NPM: `npm install mediaelement`

5. If you are using Meteor: `meteor add johndyer:mediaelement` or `meteor npm install mediaelement`


However, `MediaElementJS` has additional features for the player, such as `VAST`, `Google Analytics`, etc.

If you want to install any of them, refer to the new plugins repository clicking [here](https://github.com/johndyer/mediaelement-plugins) for more information.
 

<a id="script-and-stylesheet"></a>
## 2. Add Script and Stylesheet
```html
<script src="/path/to/jquery.js"></script>
<script src="/path/to/mediaelement-and-player.min.js"></script>
<link rel="stylesheet" href="/path/to/mediaelementplayer.min.css" />
```

If you wish to install the sources in different directories (i.e., all Javascript files in a _js_, all CSS in a _styles_, Flash shims in _plugins_, etc.), add the following CSS update after the _mediaelementplayer.css_ reference (**only if the images are not in the same folder as the stylesheet**):
```html
<link rel="stylesheet" href="/path/to/mediaelementplayer.min.css" />

<style>
.mejs__overlay-button {
    background: url("/path/to/mejs-controls.svg") no-repeat;
}
.mejs__overlay-loading-bg-img {
    background: transparent url("/path/to/mejs-controls.svg") -160px -40px no-repeat;
}
.mejs__button > button {
    background: transparent url("/path/to/mejs-controls.svg") no-repeat;
}
</style>
```

Also, update ```pluginPath``` within the configuration options (visit [Usage and Tips](usage.md) and [API and Configuration](api.md) for more details) with the location of the Flash shims.

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
All the formats listed in [Browser and Device support](../README.md#browser-support) can be instantiated using this setup. It is important to include their MIME type so the plugin renders the media accurately. 

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

<a id="language"></a>
## 4. Set default language (Optional)

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
* Simplified Chinese (zh-CN)
* Traditional Chinese (zh-TW)

________

[Back to Main](../README.md)
