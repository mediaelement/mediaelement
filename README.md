# A better mediaelement for Drupal 7

### `<video>` and `<audio>` made even easier.

This library is an optimized build of mediaelement.js that includes everything you need to implement a basic mediaelement player and nothing you don't.

Additional features and plugins that aren't part of the standard build can be easily added by uncommenting the feature in `grunt/concat` and rebuilding the script.
=======
# ![MediaElementJS](https://cloud.githubusercontent.com/assets/910829/22357262/e6cf32b4-e404-11e6-876b-59afa009f65c.png)

One file. Any browser. Same UI.

* Author: John Dyer [http://j.hn/](http://j.hn/)
* Website: [http://mediaelementjs.com/](http://mediaelementjs.com/)
* License: [MIT](http://mediaelement.mit-license.org/)
* Meaning: Use everywhere, keep copyright, it'd be swell if you'd link back here.
* Thanks: my employer, [Dallas Theological Seminary](http://www.dts.edu/)
* Contributors: [all contributors](https://github.com/mediaelement/mediaelement/graphs/contributors)

[![GitHub Version](https://img.shields.io/npm/v/mediaelement.svg)](https://github.com/mediaelement/mediaelement)
[![Build Status](https://img.shields.io/travis/mediaelement/mediaelement.svg)](https://travis-ci.org/mediaelement/mediaelement)
[![Coverage Status](https://img.shields.io/coveralls/mediaelement/mediaelement.svg)](https://coveralls.io/github/mediaelement/mediaelement)
[![MIT License](https://img.shields.io/npm/l/mediaelement.svg)](https://mediaelement.mit-license.org/)
[![CDNJS](https://img.shields.io/cdnjs/v/mediaelement.svg)](https://cdnjs.com/libraries/mediaelement)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/mediaelement/badge?style=rounded)](https://www.jsdelivr.com/package/npm/mediaelement)

# Table of Contents

* [Introduction](#intro)
* [Installation and Usage](#installation)
* [API and Configuration](#api)
* [Guidelines for Contributors](#guidelines)
* [Change Log](#changelog)
* [Migration](#migration)
* [TODO list](#todo)

<a id="intro"></a>
## Introduction
>>>>>>> d7c3afb386c80d78eda35954cd7cdc85eaf98d3f

All i18n features have been removed from the standard build in favor of passing the needed language features as parameters from Drupal.

<<<<<<< HEAD
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

`!important` styles should be avoided-

 Compass, Autoprefixer, CSSComb, and CSSMin will be run as part of the  `grunt` & `grunt style` tasks.

### Plugins

Extend the player's functionality by uncommenting the desired plugins in `/grunt/concat.js` and rebuild the script.

## How it Works:
Many great HTML5 players have a completely separate Flash UI in fallback mode, but `MediaElementPlayer.js` uses the same HTML/CSS for all players.

`MediaElement.js` is a set of custom Flash and Silverlight plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using.
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) and even WMV (via Silverlight) on all browsers.
```html
<script src="imediaelement/build/mediaelement.js"></script>
<video src="myvideo.mp4" width="320" height="240"></video>

<script>
var v = document.getElementsByTagName("video")[0];
new MediaElement(v, {success: function(media) {
	media.play();
}});
</script>
```

=======
A complete HTML/CSS audio/video player built on top `MediaElement.js`. Many great HTML5 players have a completely separate Flash UI in fallback mode, but MediaElementPlayer.js uses the same HTML/CSS for all players.

`MediaElement.js` is a set of custom Flash plugins that mimic the HTML5 MediaElement API for browsers that don't support HTML5 or don't support the media codecs you're using.
Instead of using Flash as a _fallback_, Flash is used to make the browser seem HTML5 compliant and enable codecs like H.264 (via Flash) on all browsers.

In general, `MediaElement.js` supports **IE11+, MS Edge, Chrome, Firefox, Safari, iOS 8+** and **Android 4.0+**.

**It is strongly recommended to read the entire documentation and check the `demo` folder to get the most out of this package**. Visit [here](docs) to start.

## * IMPORTANT NOTE for Safari users (Jun 8, 2017)

Since Sierra version, `autoplay` policies have changed. You may experience an error if you try to execute `play` programmatically or via `autoplay` attribute with MediaElement, unless `muted` attribute is specified. 

For more information, read https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/

<a id="installation"></a>
## Installation and Usage

The full documentation on how to install `MediaElement.js` is available at [Installation](docs/installation.md).

A brief guide on how to create and use instances of `MediaElement` available at [Usage](docs/usage.md).

Additional features can be found at https://github.com/mediaelement/mediaelement-plugins.

<a id="api"></a>
## API and Configuration

`MediaElement.js` has many options that you can take advantage from. Visit [API and Configuration](docs/api.md) for more details.

Also, a `Utilities/Features` guide is available for development. Visit [Utilities/Features](docs/utils.md) for more details.

<a id="guidelines"></a>
## Guidelines for Contributors

If you want to contribute to improve this package, please read [Guidelines](docs/guidelines.md).

**NOTE**: If you would like to contribute with translations, make sure that you also check https://github.com/mediaelement/mediaelement-plugins, and perform the
translations for the files suffixed as `-i18n`.

<a id="sources"></a>
## Useful resources

A compilation of useful articles can be found [here](docs/resources.md).

<a id="changelog"></a>
## Change Log

Changes available at [Change Log](changelog.md).

<a id="migration"></a>
## Migration

For migrating mediaelement see [Migration guide](MIGRATION.md).

<a id="todo"></a>
## TODO list

**IMPORTANT:** Before posting an issue, it is strongly encouraged to read the whole documentation since it covers the majority of scenarios exposed in prior issues.

New features and pending bugs can be found at [TODO list](TODO.md).
>>>>>>> d7c3afb386c80d78eda35954cd7cdc85eaf98d3f
