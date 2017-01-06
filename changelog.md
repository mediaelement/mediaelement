### Version History

*2.23.5 (2017/01/06)*

* Fixed typo that caused Wordpress support for translations to be broken (#1984) @ron666

*2.23.4 (2016/10/21)*

* Adjusted captions in fullscreen mode (https://github.com/johndyer/mediaelement/pull/1885) @chdh
* Validation to prevent AJAX call if `<track>` source does not exist (https://github.com/johndyer/mediaelement/pull/1886) @Mister-King

*2.23.3 (2016/10/13)*

* Added Dutch translation for MediaElement (https://github.com/johndyer/mediaelement/pull/1863) @leonardder
* Added new translation to demo file @ron666
* Integrated fix for Drupal 7 running with `jQuery.noConflict()` (https://github.com/johndyer/mediaelement/pull/1857) @CaineThanatos
* Fixed minor issue with Skip Back button @ron666
* Fixed declaration of Brazilian Portuguese translation file (https://github.com/johndyer/mediaelement/pull/1872) @OlivierJaquemet 
* Refactored `mejs.i18n` and expanded to allow pluralization (https://github.com/johndyer/mediaelement/pull/1867) @ron666
* Updated `me-i18n-locale-de.js` to accept plurals (https://github.com/johndyer/mediaelement/pull/1879) @SoftCreatR
* Send focus to correct control based on location to improve Accessibility (https://github.com/johndyer/mediaelement/pull/1818) @astephenb
* Standardized language files and cleaned with JSLint (https://github.com/johndyer/mediaelement/pull/1883) @SoftCreatR

*2.23.2 (2016/10/01)*

* Added fix for time rail width described on #1356 @ron666
* Integrated markers feature (https://github.com/johndyer/mediaelement/pull/1814) @hkasera
* Added French translation for Source Chooser feature (https://github.com/johndyer/mediaelement/pull/1850) @OlivierJaquemet
* Fixed German translation file (https://github.com/johndyer/mediaelement/pull/1852) @SoftCreatR
* Add complete list of supported language in translation demo file (https://github.com/johndyer/mediaelement/pull/1853) @OlivierJaquemet
* Fix for controls when no features are set in the configuration (https://github.com/johndyer/mediaelement/pull/1797) @ron666
* Fixed issues with translatable elements in several features files that were not being translated properly and fixed typo in Spanish translation @ron666
* Fixed YouTube loop issue according to @michaelbucklin recommendation @ron666
* Fixed compilation error when using YUICompressor on i18n file (https://github.com/johndyer/mediaelement/pull/1861) @OlivierJaquemet

*2.23.1 (2016/09/26)*

* Fix documentation in regards of control icons with CSS in different path (https://github.com/johndyer/mediaelement/pull/1837) @jangrewe
* Added a new element to customize YouTube iframe, to solve #1840 (https://github.com/johndyer/mediaelement/pull/1842) @ron666
* Fix issues with Chromium not playing audio files properly (https://github.com/johndyer/mediaelement/pull/1843) @ron666
* Fix for issue related to space bar and Firefox triggering click event, causing issues in Accessibility (https://github.com/johndyer/mediaelement/pull/1848) @ron666
* Update I18N to use unique id instead of strings (https://github.com/johndyer/mediaelement/pull/1845) @OlivierJaquemet
* Make the sourcechooser feature keyboard-friendly for Accessibility purposes (https://github.com/johndyer/mediaelement/pull/1841) @tennety
* Integration of `grunt` task to set translation files inside `/build/` folder (https://github.com/johndyer/mediaelement/pull/1834) @ron666

*2.23.0 (2016/09/06)*

* Changed way to detect fullscreen method by using _onloadstart_ event (https://github.com/johndyer/mediaelement/pull/1815) @ale-grosselle
* Preserve volume muted when resizing player (https://github.com/johndyer/mediaelement/pull/1813) @ron666
* Allow double lines of captions, added missing _captions_ type in tracks workflow and minor typo fix (https://github.com/johndyer/mediaelement/pull/1800) @ron666
* Touch devices controls fix for #1820 (https://github.com/johndyer/mediaelement/issues/603) @ron666
* Show controls when video is paused or ended (https://github.com/johndyer/mediaelement/pull/1786) @ron666
* Progress bar variables set properly to fix #1600 (https://github.com/johndyer/mediaelement/pull/1824) @ron666
* Configurable controls visibility time (https://github.com/johndyer/mediaelement/pull/1787) @ron666
* Added delay when hovering out of control button (https://github.com/johndyer/mediaelement/pull/1615) @schrolli
* Added new Grunt task to compile all html5 elements including console messages (https://github.com/johndyer/mediaelement/pull/1614) @schrolli
* Added call to format time properly when metadata has been loaded (https://github.com/johndyer/mediaelement/pull/1826) @ron666
* Added time tracker tooltip configuration to enable/disable it (#1692) (https://github.com/johndyer/mediaelement/pull/1830) @ron666
* Set source properly on YouTube videos properly per @dazweeja's comments (https://github.com/johndyer/mediaelement/pull/1829) @ron666
* Documentation improvements and addition of TODO list (https://github.com/johndyer/mediaelement/pull/1805) @ron666
* Added missing error message configuration in documentation and in player settings

*2.22.1 (2016/08/18)*

* Fix wrong parameter sent to defaultSeekForwardInterval and defaultSeekBackwardInterval options (https://github.com/johndyer/mediaelement/pull/1784) @marjune163
* Fullscreen in Safari Mac must show player skin (https://github.com/johndyer/mediaelement/pull/1794) @ale-grosselle
* Add missing string to the English locale template https://github.com/johndyer/mediaelement/pull/1782 @ocean90 
* Fix for aspect ratio when playing Hls Flash video if m3u8 does not have a resolution indicated (#1790) (https://github.com/johndyer/mediaelement/pull/1791) @ale-grosselle
* Only focus the play button when the control bar is not hidden (https://github.com/johndyer/mediaelement/pull/1798) @schrolli
* Avoid hiding audio controls when tabbing (#1668) (https://github.com/johndyer/mediaelement/pull/1804) @ron666
* Stylesheet minor fixes (https://github.com/johndyer/mediaelement/pull/1808) @ron666
* Time update on rail only when controls are visible (#1683) (https://github.com/johndyer/mediaelement/pull/1801) @ron666
* ARIA attributes for big play button to continue improving player accessibility (https://github.com/johndyer/mediaelement/pull/1803) @ron666

*2.22.0 (2016/07/17)*

* Introduce new stretching models (stretching: 'fill','responsive') (https://github.com/johndyer/mediaelement/pull/1760) @ron666
* Fix for IE9-10 fullscreen control hover issues (https://github.com/johndyer/mediaelement/pull/1760) @ron666
* Update Flash HLS to v0.4.4.21 (https://github.com/johndyer/mediaelement/pull/1762) @ale-grosselle
* Update Flash HLS to accept audio (https://github.com/johndyer/mediaelement/pull/1763) @ale-grosselle
* Updated Korean translation (#1743) @Jinkwon 
* Improve video ID parsing for YouTube URLs (https://github.com/johndyer/mediaelement/pull/1774) @ocean90
* Removed extraneous call to removePlugin @johndyer 

*2.21.2 (2016/05/08)*

* Fixed IE8 compatibility with new security update

*2.21.1 (2016/05/06)*

* Fix YouTube embed functionality from 2.21.0 plugin handling updates @johndyer
* Added more Vimeo API functionality @johndyer
* Move source-chooser offscreen on load (https://github.com/johndyer/mediaelement/pull/1713) @tennety

*2.21.0 (2016/05/05)*

* Simplified plugin callback functions and querystring checking (security update) @johndyer
* Removed Chrome iframe fullscreen fix (https://github.com/johndyer/mediaelement/pull/1736) @13twelve
* Detect YouTube scheme (https://github.com/johndyer/mediaelement/pull/1730) @silkentrance 
* Handle keydown events only for focused mediaelement (https://github.com/johndyer/mediaelement/pull/1732) @lucash
* Fix bad i18n string; create template for translating (https://github.com/johndyer/mediaelement/pull/1722) @cjbarth 
* Fix lastControlPosition.top in browser zoom mode (https://github.com/johndyer/mediaelement/pull/1718) @DmitryKrekota
* Constrain volume to 0-1 range with arrow keys (https://github.com/johndyer/mediaelement/pull/1717) @tennety
* Pass the entire event object to the key action (https://github.com/johndyer/mediaelement/pull/1701) @tennety
* Support for VAST3 adpods (https://github.com/johndyer/mediaelement/pull/1702) @cherylquirion
* Allow progress to follow configuration (https://github.com/johndyer/mediaelement/pull/1703) @tennety
* YouTube: poster hiding and multi-pause issues (https://github.com/johndyer/mediaelement/pull/1719) @msant7
* Fix for timerail when duration is over 1 hour  #1727 @johndyer

*2.19.1 (2016/02/26)*

* Fix for closed caption button caused by previous 508 change

*2.19.0 (2016/02/24)*

* YouTube now uses HTML5 iframe API as a priority to Flash
* Simplified Fullscreen code for older browsers without native API support
* 508 Accessibility Fixes #1690 @rtackett
* Fix a minor typo in Readme #1693 @pra85
* Fix wrong "currentSrc" call in ga plugins #1687 @ivanteoh

*2.19.0 (2015/12/18)*

* No longer clone media DOM element on iOS (https://github.com/johndyer/mediaelement/pull/1661)
* Expose fragment playing event in HLSMediaElement (https://github.com/johndyer/mediaelement/pull/1655)
* Flash: Only log to console if debug is true (https://github.com/johndyer/mediaelement/pull/1651/files)
* Detect svgAsImg support to fix old FF (https://github.com/johndyer/mediaelement/pull/1649) @axnd
* Correcting swf compilation instruction location (https://github.com/johndyer/mediaelement/pull/1618/files) @che-effe
* Brazilian Portuguese translation (https://github.com/johndyer/mediaelement/pull/1648/files) @odnamrataizem
* Hide controls only when available (https://github.com/johndyer/mediaelement/pull/1644/files) @nseibert  
* removed duplicate calls to hide- and showControls() (https://github.com/johndyer/mediaelement/pull/1616/files) @schrolli  

*2.18.2 (2015/10/09)*

* event fix for players inside of iframes (https://github.com/johndyer/mediaelement/pull/1597) @meirish
* Fixed blinking controls issue on Firefox (https://github.com/johndyer/mediaelement/pull/1570) @krrg
* Better handling of default options (https://github.com/johndyer/mediaelement/pull/1553/files) @ManojKumarDhankhar 
* Fixes a11y issue with keyboard only users (https://github.com/johndyer/mediaelement/pull/1572) @krrg @neilgupta
* Flash code cleanup and bug fixes (https://github.com/johndyer/mediaelement/pull/1575) @sdiemer (also @pawelsamselarkena)
* Keep track of playback speed when the source changes (https://github.com/johndyer/mediaelement/pull/1580) @neilgupta
* Maintain backward compatibility in secondsToTime() code method signature. (https://github.com/johndyer/mediaelement/pull/1591/files) @bradyvercher
* Add Danish locale (https://github.com/johndyer/mediaelement/pull/1607) @greew

*2.18.1 (2015/08/11)*

* More accurate progress bar (https://github.com/johndyer/mediaelement/pull/1557) @khalilravanna 
* Fix Flash event bug @johndyer via @herby

*2.18.0 (2015/08/05)*

* add Zepto support to MediaElement (https://github.com/johndyer/mediaelement/pull/1546) @zry656565
* Move all code/libraries out of FLA to allow grunt build (https://github.com/johndyer/mediaelement/pull/1480) @stevemayhew
* Jump forward feature (see previous)
* OWASP - alowscriptaccess now defaults to sameDomain (https://github.com/johndyer/mediaelement/pull/1390) @gregoryo
* OWASP - Flash build no longer has debug parameters by default. @johndyer
* Support time format and speed vocabulary (https://github.com/johndyer/mediaelement/pull/1518) @LeResKP
* Adding a few more extensions to type guessing logic (https://github.com/johndyer/mediaelement/pull/1519) @herby
* Fix for spacebar bug (https://github.com/johndyer/mediaelement/pull/1549) @Miyou
* Improved max-width test for MediaElementPlayer.setPlayerSize (https://github.com/johndyer/mediaelement/pull/1531) @joemcgill
* Remove moot `version` property from bower.json (https://github.com/johndyer/mediaelement/pull/1516) @kkirsche  
* Fixes for SWF Playback (https://github.com/johndyer/mediaelement/pull/1515) @lsvt-casey
* Remove track buttons on load error (https://github.com/johndyer/mediaelement/pull/1533) @kabel
* Add missing ALT tags to poster images (https://github.com/johndyer/mediaelement/pull/1534) @kabel
* Use more appropriate MediaElement events from spec (https://github.com/johndyer/mediaelement/pull/1535) @kabel
* Use an event to notify features of controls size change (https://github.com/johndyer/mediaelement/pull/1536) @kabel
* Remove various lint issues (https://github.com/johndyer/mediaelement/pull/1537) @kabel
* Added missing license field for npm (https://github.com/johndyer/mediaelement/pull/1541) @pluma
* Added missing main field for browserify (https://github.com/johndyer/mediaelement/pull/1542) @pluma
* Added player.js to simplify `require()` usage (https://github.com/johndyer/mediaelement/pull/1543) @pluma
* string comparison (types) is now case insensitive (https://github.com/johndyer/mediaelement/pull/1544) @domwar
* Update variable usage (https://github.com/johndyer/mediaelement/pull/1545) @domwar
* Progress bar loaded percent uses last array value (https://github.com/johndyer/mediaelement/pull/1469) @line-0
* Fix #1499 Play button and loading animation not aligned. (https://github.com/johndyer/mediaelement/pull/1500) @hhonisch
* Fullscreen updates on some "retina" machines (https://github.com/johndyer/mediaelement/pull/1472) @13twelve
* Update dispatchEvent on pluginMediaElement match the native API @johndyer
* Fix iOS access to `.player` property @johndyer
* Remove `.mejs-offscreen` when `remove()` is called @johndyer

*2.17.0 (2015/05/30)*

* Reset size method (https://github.com/johndyer/mediaelement/pull/1434) @LukaszGrela
* Fix HLS video full screen size problem (https://github.com/johndyer/mediaelement/pull/1439) @wolfg1969
* canPlayAfterSourceSwitchHandler is fired twice (https://github.com/johndyer/mediaelement/pull/1441) @karroupa
* Fixed error display when source not available (https://github.com/johndyer/mediaelement/pull/1442) @karroupa
* Avoid an error when there are no controls in the control bar (https://github.com/johndyer/mediaelement/pull/1451) @Fab1en
* Fix errors when not found elements (https://github.com/johndyer/mediaelement/pull/1445) @dukex
* Support ShadowRoot parent (https://github.com/johndyer/mediaelement/pull/1465) @dukex
* Can't initialize MediaElement on a virtual DOM in IE8 and lower. (https://github.com/johndyer/mediaelement/pull/1423) @dd32
* Fix missing `</span>` tag (https://github.com/johndyer/mediaelement/pull/1498) @kevnk (https://github.com/johndyer/mediaelement/pull/1501) @hhonisch
* Add DailyMotion support in Flash (https://github.com/johndyer/mediaelement/pulls) @Fab1en
* change (un)mute button title when status changes (https://github.com/johndyer/mediaelement/pull/1482) @jrglasgow
* Bug #1397, Fix for screen reader accessibility of captions (#1340) (https://github.com/johndyer/mediaelement/pull/1398) @nfreear
* Fix Speed control when multiple players are present (https://github.com/johndyer/mediaelement/pull/1506) @LeResKP

*2.16.4 (2015/03/01)*

* Removed reference to jQuery/$ in froogaloop code (https://github.com/johndyer/mediaelement/pull/1394) @staylor
* Ensure screen reader text is hidden on long pages (https://github.com/johndyer/mediaelement/pull/1388) @bradyvercher
* Can't initialize MediaElement on a virtual DOM in IE8 and lower (https://github.com/johndyer/mediaelement/pull/1423) @dd32
* CC list refresh feature (https://github.com/johndyer/mediaelement/pull/1417)
* Revered time rail from `<a>` tag to fix dragging @johndyer

*2.16.3 (2014/12/10)*

* Fix for calculating rail width with horizontal volume bar (all audio controls)
* Insert the accessible player title span and container div separately (https://github.com/johndyer/mediaelement/pull/1385) @bradyvercher
* Fixes for YouTube on iOS and Android (https://github.com/johndyer/mediaelement/pull/1383) @ OwenEdwards 
Fix startvolume parsing in Silverlight fallback (https://github.com/johndyer/mediaelement/pull/1378) @fixedmachine 
* Add configurable initVars for JavaScript init and event callback functions (https://github.com/johndyer/mediaelement/pull/1362)
* Flash no longer sends timeupdate events before it starts playing

*2.16.2 (2014/11/15)*

* Fixed broken swf files because of new problem with binary @OwenEdwards		

*2.16.1 (2014/11/07)*

* Fixed strict `undefined` check for posterUrl issue (https://github.com/johndyer/mediaelement/pull/1348)

*2.16.0 (2014/11/06)*

* Migration from Builder.py to Grunt (https://github.com/johndyer/mediaelement/pull/1309) @dmfrancisco
* remove event listeners from flash AudioElement (https://github.com/johndyer/mediaelement/pull/1294) @phinze
* mep-feature-ads: Link overlay only when url is given (https://github.com/johndyer/mediaelement/pull/1296) @schrolli
* Add repository field to package.json to avoid warning (https://github.com/johndyer/mediaelement/pull/1300) @dmfrancisco
* Fix IE8 error on window resizing (https://github.com/johndyer/mediaelement/pull/1301) @chemerisuk
* send `this` to dispatchEvent callbacks (https://github.com/johndyer/mediaelement/pull/1295) @phinze
* Added link to MIT license to README.md (https://github.com/johndyer/mediaelement/pull/1303) @SuriyaaKudoIsc
* Fix for dynamically created players in responsive design (https://github.com/johndyer/mediaelement/pull/1337) @staylor
* Added skipback feature (https://github.com/johndyer/mediaelement/pull/1320) @matthillman
* Allow click/touch event bubbling on time rail (https://github.com/johndyer/mediaelement/pull/1318) @dennyferra
* Additional translations for i18n (https://github.com/johndyer/mediaelement/pull/1310) @OlivierJaquemet
* update HLS support with flashls v0.3.3 (https://github.com/johndyer/mediaelement/pull/1339) @mangui
* Make progres bar accessible (https://github.com/johndyer/mediaelement/pull/1292) @rylan @nfreear
* Make volume control accessible (https://github.com/johndyer/mediaelement/pull/1290) @rylan
* Fix: Loading animation doesn't disappear Android (https://github.com/johndyer/mediaelement/pull/1288) @MoritzGiessmann
* Accept IETF language tags, plus accessible play/pause button -- "iet-ou/cr1262/a11y" (https://github.com/johndyer/mediaelement/pull/1270#issuecomment-61791241) @nfreear 
* Improved screen reader accessibility of captions (https://github.com/johndyer/mediaelement/pull/1340)


*2.15.1 (2014/08/11)*

* Fixes for various sizing issues with 2.15.0
* Fix nativeWidth() to return defaultAudioWidth (https://github.com/johndyer/mediaelement/pull/1271)
* Don't set .me-plugin width/height to 0 (https://github.com/johndyer/mediaelement/pull/1273) @staylor
* Remove video-only restriction on playback speed feature (https://github.com/johndyer/mediaelement/pull/1268) @phinze
* a work around for zero height containers (https://github.com/johndyer/mediaelement/pull/1274) @maimairel


*2.15.0 (2014/08/03)*

* support m3u8 (https://github.com/johndyer/mediaelement/pull/1074) @clkao
* add Flash/HTTP Live Streaming Support (https://github.com/johndyer/mediaelement/pull/1066) @mangui
* Fix jQuery reference in plugin (https://github.com/johndyer/mediaelement/pull/1231) @blackbyte-pl
* Added plugin for Universal Google Analytics (https://github.com/johndyer/mediaelement/pull/1229) @louiedp3
* Implement keyboard accessibility (https://github.com/johndyer/mediaelement/pull/1221) @joedolson
* Removed "touchstart" to prevent Android issues (https://github.com/johndyer/mediaelement/pull/1212) @MoritzGiessmann
* Vimeo API Cleanup and Fix (https://github.com/johndyer/mediaelement/pull/1199) @maimairel
* Fix for silverlight issue with fullscreen button (https://github.com/johndyer/mediaelement/pull/1196) @PaulVrugt
* Fix IE10/11 error with `clone()` and `show()` (https://github.com/johndyer/mediaelement/pull/1194) @benjroy
* Add bower.json (https://github.com/johndyer/mediaelement/pull/1188) @herby
* i18n : add French translation (https://github.com/johndyer/mediaelement/pull/1177) @kloh-fr
* IE8 layout (Adding width and height to .me-plugin) @peterh-capella
* Fixes #1113 - Youtube Playbutton on load hidden (https://github.com/johndyer/mediaelement/pull/1140) @LOK-Soft
* setVideoSize : verify this.pluginElement before this.pluginElement.style (https://github.com/johndyer/mediaelement/pull/1175) @bdecarne
* VideoElement.as: fix duration on setSrc (https://github.com/johndyer/mediaelement/pull/1127) @rounce
* don't hide controls when they're being hovered over (https://github.com/johndyer/mediaelement/pull/1121) @rounce
* flash: send keydown events up to javascript (https://github.com/johndyer/mediaelement/pull/1120) @rounce
* Restore IE6 compatibility for 100% (https://github.com/johndyer/mediaelement/pull/1021) @ryokenau
* Added playback speed (HTML5 only), fixed caption's auto-size when fullscreen (https://github.com/johndyer/mediaelement/pull/1027) @cheng-shiwen
* Cleaned up playback speed (https://github.com/johndyer/mediaelement/pull/1249) @matthillman
* Chromium Web Browser Support (https://github.com/johndyer/mediaelement/pull/1020) @ryokenau
* Always listen for the fullscreenchange event on the document (https://github.com/johndyer/mediaelement/pull/1240) @foolip 
* The hours are not required on the webvtt format (https://github.com/johndyer/mediaelement/pull/1252) @LeResKP
* Fix wrong initial player size when responsive (https://github.com/johndyer/mediaelement/pull/1247) @Wizard13 
* Make mejs.MediaFeatures.isFullScreen() more consistent (https://github.com/johndyer/mediaelement/pull/1239) @foolip
* Fix flash source chooser (https://github.com/johndyer/mediaelement/pull/1191) @dajulia3
* Option `setDimensions` to allow deactivation of inline widths and heights at player elements (https://github.com/johndyer/mediaelement/pull/1236) @feeela
* Fix Captions start language is not ticked in Firefox (https://github.com/johndyer/mediaelement/pull/1260)
* Updated SVG to fix Chrome 38's rendering problems

*2.14.2 (2014/04/04)*

* Additional progress bar checks for hidden/missing bars
* Add Gruntfile.js build support (https://github.com/johndyer/mediaelement/pull/1147) @jeremyfelt
* Add #! line to Builder.py for legacy builds (https://github.com/johndyer/mediaelement/pull/1036) @amenonsen

*2.14.1 (2014/03/31)*

* Fix infinite loop on progress bar 

*2.14.0 (2014/03/29)*

* Vimeo support (https://github.com/johndyer/mediaelement/pull/1079) @clkao
* fix for aac-audio (itunes-samples etc.) (https://github.com/johndyer/mediaelement/pull/1133) @faebser
* added 'm4a' file type, to be detected as 'audio/mp4' (https://github.com/johndyer/mediaelement/pull/988) @heshiming
* Function remove() should remove mejs container only if it exists (https://github.com/johndyer/mediaelement/pull/1144) @lucash
* Handle the case when parentNode is null (https://github.com/johndyer/mediaelement/pull/1136) @lbeder, also hypomodern
* fix leaky variables (https://github.com/johndyer/mediaelement/pull/1123) @kernel
* Fixed display of volume control on non-mobile touch devices (https://github.com/johndyer/mediaelement/pull/1093) @OwenEdwards
* Calculate correctly the video player height for 100% (https://github.com/johndyer/mediaelement/pull/1083) @LeResKP
* restore focus after click on the controls (https://github.com/johndyer/mediaelement/pull/1094) @rounce
* Support youtu.be URL for youtube source (https://github.com/johndyer/mediaelement/pull/1135) @clkao
* Make slider work on touch devices (https://github.com/johndyer/mediaelement/pull/1033) @Singularetantum
* add Simplified Chinese translation (https://github.com/johndyer/mediaelement/pull/1065) @michaeljayt
* Fixed the reference to `media` in the bigPlay control creation. (https://github.com/johndyer/mediaelement/pull/1111) @nuzzio
* Fix layout bug when zooming page (https://github.com/johndyer/mediaelement/pull/1097) @ChiChou
* Fix fullscreen iframe zoom bug. (https://github.com/johndyer/mediaelement/pull/1070) @lisbakke

*2.13.2 (2014/01/24)*

* Removed breaking `hasTouch` detection
* Fixed IE detection https://github.com/johndyer/mediaelement/pull/1018
* fix play() on ipad does not start playing and double click issue (https://github.com/johndyer/mediaelement/pull/918) @fbuecklers
* added scale=default to Flash for better 100% https://github.com/johndyer/mediaelement/pull/963
* Add code fences for GHFM https://github.com/johndyer/mediaelement/pull/975
* i18n improvements https://github.com/johndyer/mediaelement/pull/1025

*2.13.1 (2013/09/?06)*

* Support for fullscreen in IE11 beta

*2.13.0 (2013/09/01)*

* BREAKING FLASH SECURITY CHANGE: Removed `allowDomain("*")` by default. If you use MediaElement.js on a different domain use the `flashmediaelement-cdn.swf` file (nacin) https://github.com/johndyer/mediaelement/pull/956
* Use only FlashVars and ignore parameters passed via query string.
* Force LTR in controls (for RTL users) https://github.com/johndyer/mediaelement/pull/958 @nacin

*2.12.1 (2013/08/26)*

* Remove all `console.log` statements in `Builder.py` @johndyer
* More i18n fixes for Wordpress https://github.com/johndyer/mediaelement/pull/940 @SergeyBiryukov
* Fix touch detection in QtWebKit https://github.com/johndyer/mediaelement/pull/939 @peterbrook
* Added configuration option httpsBasicAuthSite fix sites using HTTPS basic authentication (benroy73) https://github.com/johndyer/mediaelement/pull/937
* Fixed backlight plugin error  https://github.com/johndyer/mediaelement/pull/932 @eviweb
* Fix some wrong dates on the change log https://github.com/johndyer/mediaelement/pull/930 @heartcode
* Add a mejs-fullscreen css class on the root element https://github.com/johndyer/mediaelement/pull/925 @fbuecklers
* fix for ff switch between fullscreen and normal mode https://github.com/johndyer/mediaelement/pull/924 @fbuecklers
* Multiple fixes: old issue #548, current issues #754 and #902 https://github.com/johndyer/mediaelement/pull/923 @peterh-capella
* fix firefox detect 100% mode issue https://github.com/johndyer/mediaelement/pull/919 @KaptinLin
* Option to show the poster when the video is ended https://github.com/johndyer/mediaelement/pull/891 @LeResKP
* Fix for Chrome autoplaying when forcing Flash https://github.com/johndyer/mediaelement/pull/889 @tjsnyder
* Allow SWF to work over insecure domain https://github.com/johndyer/mediaelement/pull/897 @sebablanco
* Corrected buffering height on CSS https://github.com/johndyer/mediaelement/pull/875 SourceR85
* CSS cleanup  https://github.com/johndyer/mediaelement/pull/883 @awittdesigns


*2.12.0 (2013/06/02)*

* Removed old media files from repo (reduced filesize from 150MB to 25MB)
* Added `test.html` to `/tests/` folder to use JS files in `/src/` folder
* Fullscreen plugin player toggles play/pause when controls are clicked https://github.com/johndyer/mediaelement/pull/742 @JeffreyATW
* Making use of pluginWidth & pluginHeight https://github.com/johndyer/mediaelement/pull/837 @eyefood
* Proportional poster images (IE9+ Chrome, Safari, Firefox) https://github.com/johndyer/mediaelement/pull/838 @eyefood
* Fixed video resolution on seek in flash https://github.com/johndyer/mediaelement/pull/839 @efEris
* Option for custom error message when no plugins are found. https://github.com/johndyer/mediaelement/pull/842 @svoynow-lz
* Fix for Safari to play video on HTTPS site https://github.com/johndyer/mediaelement/pull/845 @benroy73
* Fixes Mute/UnMute when playing from a YouTube source https://github.com/johndyer/mediaelement/pull/848 @mbaker3
* i18n fixes for better compatibility with WordPress https://github.com/johndyer/mediaelement/pull/850 @SergeyBiryukov
* Fixing invalid characters restrictions for URLs https://github.com/johndyer/mediaelement/pull/859 @sebablanco
* Checking for pluginType on media instead of mediaelementplayer in Fullscreen https://github.com/johndyer/mediaelement/pull/865 @JeffreyATW
* Problem with IE9 on Windows 7 N / Windows 7 KN without WMP installed https://github.com/johndyer/mediaelement/pull/868 @sarvaje
* Cleanup stylesheet https://github.com/johndyer/mediaelement/pull/867 @jawittdesigns
* Properly treat namespace-only events for `globalUnbind()` https://github.com/johndyer/mediaelement/pull/878 @odnamrataizem
* Fixed issue with slash character separating time https://github.com/johndyer/mediaelement/pull/879 @S2

*2.11.3	(2013/04/13)*

* Change to `getScriptPath` to allow querystring variables to be added (for Wordpress Core)

*2.11.2	(2013/04/12)*

* Fixed overly aggressive XSS testing (excluding forward slashes)
* Fixed line endings on Flash (*.as) files  (https://github.com/johndyer/mediaelement/pull/834) @markjaquith
* Included protocol relative URL for YouTube (https://github.com/johndyer/mediaelement/pull/832) Dan Tsosie

*2.11.1	(2013/04/11)*

Major changes

* Removed Ogg, WebM, and MP3 files to keep download under 10MB. Files are now at https://github.com/johndyer/mediaelement-files
* Simple Flash Pseudo-streaming @set enablePseudoStreaming:true, pseudoStreamingStartQueryParam:'start' (https://github.com/johndyer/mediaelement/pull/814) @BryanMorgan
* Fixed possible XSS attack through `file=` parameter in `flashmediaelement.swf`

Fixes and updates

* Protocol relative YouTube URLs for `iframe` API (https://github.com/johndyer/mediaelement/pull/825) @dtsosie
* Added aria-label to all button elements (https://github.com/johndyer/mediaelement/pull/824) @Luzifer
* Fixed preroll adclick URL (johndyer)
* Traditional chinese locale strings for i18n module (latzt) (https://github.com/johndyer/mediaelement/pull/820)
* Allow captions on audio player (https://github.com/johndyer/mediaelement/pull/819) @LeResKP
* Fix incorrect path returned by `getScriptPath()` @Ciki
* Overhauling hover div creation and placement (https://github.com/johndyer/mediaelement/pull/813) @JeffreyATW
* Clear timeout for second fullscreen stretch attempt (https://github.com/johndyer/mediaelement/pull/812) @JeffreyATW
* fix type resolution when extension is uppercased (https://github.com/johndyer/mediaelement/pull/801) @jbdemonte
* "splice is not a function" fix on `MediaElementPlayer.remove()` (https://github.com/johndyer/mediaelement/pull/799) @odnamrataizem
* Make Flash stage handle CLICK rather than MOUSE_DOWN (https://github.com/johndyer/mediaelement/pull/804) @odnamrataizem


*2.11.0 (2013/03/13)*

* Preroll ads manager
* VAST ads plugin (sponsored by Minito Video)
* Slides `<track>` type (non-standard HTML5 use)
* Calculate rails size only with visible elements (https://github.com/johndyer/mediaelement/pull/773) @romanbsd
* Round calculations of progress bar to prevent fractions (https://github.com/johndyer/mediaelement/pull/768) @romanbsd
* Fix AndroidUseNativeControls (https://github.com/johndyer/mediaelement/pull/749) @LeResKP
* Muting the volume icon if startVolume is set to 0 (https://github.com/johndyer/mediaelement/pull/747) @heartcode
* Make YouTube URL protocol relative (https://github.com/johndyer/mediaelement/pull/761) @strworkstation
* Prevent Flash audio player from sending too many 'progress' events (@johndyer)
* Properly clean up player when calling MediaElementPlayer.remove() (https://github.com/johndyer/mediaelement/pull/779) @odnamrataizem
* Add "mejs-shim" class to all shims to prevent improper resizing (https://github.com/johndyer/mediaelement/pull/789) @JeffreyATW
* Bug fix for the error "this.pluginApi.pauseMedia is not a function" when using the flash player and removing the dom element. https://github.com/johndyer/mediaelement/pull/788 @Jmaharman
* Make possible to open youtube links as audio only https://github.com/johndyer/mediaelement/pull/784 @Seb33300
* Add a few basic Jasmine tests https://github.com/johndyer/mediaelement/pull/781 @msgilligan
* Add option to hide the video controls on load  https://github.com/johndyer/mediaelement/pull/780#issuecomment-14781622 @eResKP
* @cc button can now be a toggle when there's just one track  https://github.com/johndyer/mediaelement/pull/793 @LeResKP
* fixed error when srclang was missing

*2.10.3 (2013/01/27)*

* Fix broken scrollbar from API reference error (peterbrook) (https://github.com/johndyer/mediaelement/pull/739)

*2.10.2 (2013/01/26)*

* The project is now MIT-only, instead of dual licensed MIT and GPL (just as jQuery has done: http://jquery.org/license/)
* Fix audio height in 100% mode (https://github.com/johndyer/mediaelement/pull/667)
* Make rewinding at the end optional (https://github.com/johndyer/mediaelement/pull/725)
* Bugfix: attributes for PluginMediaElement (https://github.com/johndyer/mediaelement/pull/722)
* Add mejs-long-video class when capture is 1hr or longer, custom styles (https://github.com/johndyer/mediaelement/pull/715)
* Fix for dragging playhead horizontally off the video (https://github.com/johndyer/mediaelement/pull/711)
* Align timing of captions with show/hide controls (https://github.com/johndyer/mediaelement/pull/708)
* Missing semicolon (https://github.com/johndyer/mediaelement/pull/737)
* Don't send timeupdate event after ended event (https://github.com/johndyer/mediaelement/pull/727)
* Added option to disable pause/play on main div click (https://github.com/johndyer/mediaelement/pull/735)

*2.10.1 (2012/12/31)*

* New postroll feature (https://github.com/johndyer/mediaelement/pull/660)
* PluginMediaElement click-to-pause behavior doesn't work (https://github.com/johndyer/mediaelement/pull/691)
* Use the normal CSS property name after the vendor prefix (https://github.com/johndyer/mediaelement/pull/686) 
* Select first source that is supported by the browser (https://github.com/johndyer/mediaelement/pull/679)
* fixed outerWidth for jQuery 1.8 compatiability (https://github.com/johndyer/mediaelement/pull/680)
* Fix for Issue #676 when Stop button does not behaves as expected in selected browsers (https://github.com/johndyer/mediaelement/pull/678)
* Fix source switching on Webkit in SourceChooser (https://github.com/johndyer/mediaelement/pull/675)
* Better 100% mode handling within non-visible container (https://github.com/johndyer/mediaelement/pull/668)
* Display chapter tracks for late-loading video sources, including YouTube (https://github.com/johndyer/mediaelement/pull/665)
* Added SVG Stop icon (https://github.com/johndyer/mediaelement/pull/696)
* Added SVG source chooser icon (https://github.com/johndyer/mediaelement/pull/669)
* Adding rounding to volume slider left, top, and and width setters (https://github.com/johndyer/mediaelement/pull/684)
* Display chapter tracks for late-loading video sources, including YouTube (https://github.com/johndyer/mediaelement/pull/665)

*2.10.0 (2012/11/23)*

* Support of matchMedia where possible	@zachleat
* Fix for 100% audio using correct sizing @dougwilson
* SVG icons for better Retina support @johndyer
* Localized buttons @latzt https://github.com/johndyer/mediaelement/pull/627
* Volume handle doesn't set initial position properly @JeffreyATW https://github.com/johndyer/mediaelement/pull/625
* Cleaned up some CSS whitespace https://github.com/johndyer/mediaelement/pull/656
* Vimeo - updated to iframe code (from old megaloop)

*2.9.5 (2012/09/26)*

* Fixed faulty FlashMediaElement.swf (due to Git program mashing it)
* Fixed track element issues introduced by DFXP captions

*2.9.4 (2012/09/24)*

* Improved RTMP parsing @pansapien https://github.com/johndyer/mediaelement/pull/574
* Added `flashStreamer` option to separate streamer from file
* Raise an error for unknown video size in Flash @denmarkin https://github.com/johndyer/mediaelement/pull/571
* Fix for alwaysShowControls with keyboard interaction @peterh-capella https://github.com/johndyer/mediaelement/pull/569
* Support for DFXP captions @justinl-capella https://github.com/johndyer/mediaelement/pull/420

*2.9.3 (2012/08/23) *

* Allows use of `style="max-width: 100%;"` for responsive video
* Added type to source buttons in mep-feature-sourcechooser.js:48 @flamadiddle 
* Fix use of inArray and $ in src/js/me-shim.js @lftl, @Seb33300, @eusonic and others (this was a regression bug from another fix)
* Fixing syntax error in events demo @JeffreyATW

*2.9.2 (2012/07/06) *

* Added a few height checks (from Joe Anderson)
* Removed console.log statements
* Better file MIME type detection when the "type" attribute is not set @Seb33300)
* Pass the event keyCode to the keyActions handler, and make seek interval configurable @bborn
* Responsive flash fix, YouTube edits @heikki
* New `auto_plugin` mode that starts with plugins then tries HTML5 @savil

*2.9.1 (2012/06/01)*

* Fixed Firefox 10+ Fullscreen error

*2.9.0 (2012/05/31)*

* Fixed pointer-events detection in IE9 (when using Flash mode or YouTube)
* YouTube now shows annotations (using YouTube player rather than chromeless)
* Fix play/pause when clicking on video when overlays are displayed @markomarkovic
* Dont listen to mouse events when there's not a reason to @neverarriving
* Adding CSS animated buffer to the time rail @neverarriving
* Fix for box-sizing: border-box from cutting off time text. @MatthewCallis

*2.8.2 (2012/05/15)*

* Fixed volume slider bug when initially hidden
* Fixed YouTube size problems in Flash mode

*2.8.1 (2012/04/19)*

* Flash fullscreen: video not fullsized
* Flash fullscreen: youtube controls not working

*2.8.0 (2012/04/17)*

* Revamped YouTube to work using the Flash shim so that it supports fullscreen
* Fix for `remove()` method (lennym)
* Fix possible issue with ContextMenu ( quangvhg)
* Fix for stop button ( slavva97)
* Type on `var` and `;` (lennym)
* Fix for keyboard support forward and backward (myffical)

*2.7.0 (2012/03/12)*

* Added horizontal volume control, the new default for audio (based on work by @gavinlynch(http://github.com/gavinlynch))
* Possible issues with &lt; IE8 centering resolved
* Full set of controls under Silverlight (@Birol2010(https://github.com/Birol2010/))
* YouTube fix @raknam
* shim now has a .tagName property, and other DOM-like methods @tantalic
* Poster display fix when HTML5, Flash, and Silverlight are all missing	 @bruha
* Source Chooser plugin @markomarkovic
* Fix for flash audio mute @lbernau

*2.6.5 (2012/02/01)*

* Removed iOS 3.x poster code @xtat @James Cross
* Fixed bug when player is initially hidden in `display:none;`
* Workaround for when inside an `<iframe>` and Chrome doesn't correctly report exiting from fullscreen

*2.6.4 (2012/01/10)*

* Fixed a Flash bug when one video ended and another was loaded through `setSrc()` and `load()`
* Option for markup between current time and duration @tantalic

*2.6.3 (2012/01/08)*

* Sending all options to Flash including colors

*2.6.2 (2012/01/06)*

* Fixed Flash fullscreen button inside an `<iframe>`
* Fixed flash auto starting in 100% mode

*2.6.1 (2012/01/03)*

* Updated Opera's Flash Fullscreen support (apparently, it doesn't like pointer-events:none with Flash)
* Added a `fullscreenchange` event to Flash to better track events

*2.6.0 (2011/12/27)*

* added major updates to Flash fullscreen mode controls @rmhall
* added sneaky `pointer-events: none` to allow Flash to enter fullscreen in one clean click
* added missing CSS3 gradients syntaxes (kristerkari) @https://github.com/johndyer/mediaelement/pull/339
* added check for left offset to detect when mousedrag exceeds top boundary @jmcneese(https://github.com/johndyer/mediaelement/pull/335)

*2.5.0 (2011/12/15) - 56kb*

* Flash fullscreen now works on hover, so it's much easier to use. For Firefox it's always on, but for others `usePluginFullScreen:true` option
* For the audio player, Flash objects are positioned outside the main `<div>` which allows the player to be hidden without breaking flash
* Volume controls was adjusted slightly
* Removed Google translate features (Google killed the API)

*2.4.3 (2011/12/10)*

* keyboard controls are now an array, allowing multiple keys to do the same thing
* support for Google TV keybuttons (based on above)
* arrow keys now move when paused
* floating time is now handled via JavaScript instead of CSS :hover (and removed from touch devices)

*2.4.2 (2011/12/06) - 57.3kb*

* keyboard controls (up/down controls volume, left/right seeks, space play/pause, f goes fullscreen)
* `<audio>` now works with 100% for responsive layouts @283(https://github.com/johndyer/mediaelement/issues/283)
* Support for auto start with class `mejs-player` and `data-mejsoptions` e.g. `<video src="media.mp4" class="mejs-player" data-mejsoptions='{"features":@"playpause","progress","volume"}, "success": "myCallback"}'><video>`
* With multiple players on a page, when one starts the others pause (toggle `pauseOtherPlayers: true`) @285(https://github.com/johndyer/mediaelement/issues/285)

*2.4.1 (2011/12/05) - 55.7kb*

* Fixed fullscreen bug with Firefox (with Video for Everybody syntax) @270(https://github.com/johndyer/mediaelement/issues/270)
* Added `remove()` method to `MediaElement` and `MediaElementPlayer` to safely remove Flash (from IE) @111(https://github.com/johndyer/mediaelement/issues/111)
* Added a demo of MEJS skins to the /demo/ folder 
* Closed issue with `ended` event in Flash (my example works) @246(https://github.com/johndyer/mediaelement/issues/246)
* Flash has better support for `preload="auto"` @290(https://github.com/johndyer/mediaelement/issues/290)

*2.4.0 (2011/11/28) - 54.9kb*

* Integration with YouTube API (and intial support for Vimeo API) : http://mediaelementjs.com/examples/?name=youtube
* Catch when Google Translate fails due to API limits

*2.3.3 (2011/11/21) - 49.4kb*

* removed volume controls for touch devices (Android and iOS require hardware volume)
* set a timeout to hide controls on touch devices
* fixed timecode bug with :09 (used radix)
* fixed bug when long videos end: (try/catch)
* fixed issue with `alwaysShowControls`
* removed a `console.log` in fullscreen that broke IE

*2.3.2 (2011/11/12) 49.6kb*

* removed `http` from Flash and Silverlight embeds to support SSL
* fixed a possible bug when neither `src` nor `type` was specified
* turned off useCapture for a few events

*2.3.1 (2011/11/07)*

* Another set of changes to handle various browser native fullscreen issues
* New control behavior for touch enabled devices (iPad, Android tablets)
* Bug fix for Flash (bradleyboy)

*2.3.0 (2011/11/01) - 48.5kb*

* Fixed bug when fullscreen was called before play pressed
* Additional classes mejs-audio, mejs-video, mejs-ios, mejs-iphone, mejs-ipad, mejs-android added to contianing `<div>` for styles
* IE9 can't use `<video width="100%">` so you must use either options ({videoHeight:'100%'}) or inline style `<video style="width:100%;height:100%;">` 
* updated fullscreen code for Safari (erktime)
* loading indicators shows during 'waiting' event
* iOS and Android now show "big play" button again (sometimes overlaps on iPhone)

*2.2.5 (2011/10/14)*

* fix for Flash fallback in certain scenarios (IE RegExp problem, Firefox fullscreen Flash issue)
* adjustments for floating time indicator

*2.2.4 (2011/10/10)*

* True FullScreen support in Firefox (nightly) and Chrome (Canary)
* more updates for 100% mode
* enableContextMenu(), disableContextMenu() methods
* change to poster code to let it be set later

*2.2.3 (2011/10/07b) - 45.8kb*

* updated accessibility again for JAWS and NVDA (thanks to twitter.com/mohammed0204)
* added CSS class `<html class="mejs-embed">` for `<iframe>` embeds

*2.2.2 (2011/10/07) - 45.8kb*

* added support for <del>`<video width="100%" height="100%"></video>`</del> `<video style="width:100%;height:100%"></video>` (i.e. responsive/adaptive players)
* added :focus state for buttons to improve accessibility
* added title and aria-controls attributes to buttons to improve accessibility 
* changed when loading circle appears (WebKit fires the 'loadstart' event differently than FF or IE)

*2.2.1 (2011/10/06) - 44.1kb*

* fixed a bug with fullscreen that caused IE to completely mess up it layout
* fixed another bug with fullscreen and z-index

*2.2.0 (2011/10/04)*

* controls now display on iPad, iPhone, and Android. Can be turned off using (iPadForceNativeControls:true)
* fullscreen support for iPad (different from true fullscreen on Safari 5.1)
* added frameaccurate timecode (via gselva)
* added contextmenu as a feature. if turned on the default includes: fullscreen toggle, mute toggle, and media download
* updated WebVTT support (still had some SRT formatting restrictions)
* dynamic player creation: from `<a href="media.mp4">video</a>` and `<div class="mejs"></div>` specifying type (string or array)
* Fixed bug where Flash couldn't go fullscreen with track chapters
* fixed a bug with Flash fullscreen ratios
* controls now disappear on timeout when mouse is idle (useful for fullscreen)
* enableControls() and disableControls() (for pre/post roll scenarios)
* added an autoplay override (especially for WebKit browsers)
* fixed functionality of mute toggling
* reorganized plugins to use $.extend
* updating functionality of loading graphic to account for various browser inconsistencies (loadstart event)

*2.1.9 (2011/08/04) - 36.9kb*

* fixed Android 2.1 and 2.2 playing problems (still need a good 2.3 and 3.0 device. hint. hint.)

*2.1.8 (2011/08/03) - 36.9kb*

* True fullscreen for Safari 5.1
* Flash/Silverlight fullscreen is now "full window" (except for Firefox which cannot handle adjusting Flash without reloading it)

*2.1.7 (2011/07/19) - 35.9kb*

* fixed mute button (kaichen)
* added alwaysShowControls option (kaichen)
* forceful padding override on buttons
* started "ender" branch to experiment with removing jQuery dependency and baking in ender.js
* updated the use of `type` javascript option with src is present
* remove preload="none" hack for Chrome now that it supports it (note: Chrome still strangely fires a 'loadstart' event)
* added hooks for other jQuery compatible libraries like @ender.js(http://enderjs.com)
* Wordpress: if you don't specify a file extension, mejs will look for attached files and use them @video src="/wp-content/uploads/myfile"
* Wordpress: option to select a 'skin'
* Wordpress: option to select audio width/height

*2.1.6 (2011/06/14) - 35.5kb*

* fix errors when the progress bar isn't present
* buttons are now actual `<button>` tags which allows tabbed controls (for better accessibility and possible ARIA support)
* fix problems with low volume in Flash on startup (startVolume was sometimes 0!)
* updated a few places to use jQuery 1.6's new prop/attr methods
* updated skins to account for new `<button>` (still need highlighted style)

*2.1.5 (2011/05/28) - 35.2kb*

* minor fix for controls not showing time or duration
* when switching files, the Flash plugin now forcibly stops downliading

*2.1.4 (2011/05/20) - 35.2kb*

* fixed display of hours
* fixed Flash audio bug where pausing when the file wasn't fully loaded would cause the progress bar to go offscreen
* fixed Flash video bug where percent loaded was always 100%
* fixed Flash audio bug where pressing pause, then play would always restart playback from the beginning
* startVolume works more clearly in plugins (esp. Opera and Linux)
* tracks support no longer refers to WebSRT, but is more generic for WebVTT (not all features of WebVTT are supported yet)
* fixed fullscreen in Safari OS X 10.5 (which doens't really support true fullscreen)
* Flash and Silverlight can now start downloading if preload="auto" or preload="metadata" (warning: preload="metadata" will load the entire thing)

*2.1.3 (2011/04/12) - 35.8kb*

* added support for hours in time format (00:00:00) and an alwaysShowHours option to force hours to always show
* removed some duplicate flash events
* added 'seeking' event to Flash/SL (already had 'seeked')

*2.1.2 (2011/03/23) - 34.4kb*

* fixed IE6 and IE7 caption position
* fixed IE7 failure in certain places
* changed browser UA detection to use only lowercase (iPhone iphone)
* fixed Flash audio loaded bug (reporting 0 after loaded)
* added removeEventListener to shims
* new rail-resizing code

*2.1.1 (2011/03/07) - 33.5kb*

* added 'loadeddata' event to Flash and Silverlight
* switched to flashvars parameter to support Apache's mod_security
* better flash fullscreen support
* added flv-x to flash's accepted types
* Fixed a bug in poster sizing (only affected IE)
* added "isFullScreen" property to media objects (like Safari's webkitDisplayingFullscreen)
* controls start hidden with autoplay
* fixed  iOS loading issues (success wasn't firing, other errors)
* fixed IE6 when using new MediaElementPlayer(), rather than jQuery

*2.1.0 (2011/02/23) - 32.9kb*

* Updated control styles for a cleaner look
* Added loadeddata and canplay events to Flash and Silverlight
* Added loading indicator to MediaElementPlayer
* Added stop button (pause, then return to currentTime:0)
* IE6/7 CSS updates
* Poster is now forced to the size of the player (could be updated to be proportional if someone wants to add that)
* Updated Flash ended event to account for buffering weirdness
* Fixed a track text hovering problem

*2.0.7 (2011/02/13) - 31.9kb*

* Added 'mode' option to force native (HTML5) or shim (Flash,Silverlight) modes
* Fixed audio seeking bug in Flash (thanks Andy!)
* Fixed startVolume not working in Flash
* Overrided Chrome's autoplay since it doesn't always work

*2.0.6 (2011/02/04) - 31.7kb*

* Whitespace cleanup on files
* Preventing flash/sl plugins from reinitializing when they are removed by another script
* Fixed IE JavaScript errors in Flash fallback (seen in Wordpress)
* Added 'play' event to Silverlight to prevent errors

*2.0.5 (2011/01/25) - 31.7kb*

* Added error object to player
* Adjusted popup timer and progress bar
* Fixed media URL escaping
* Stopped sending poster to plugin
* Silverlight culture update
* Added back reference check (also makes jQuery usage easier)
* Added stop() function to mediaelement
* timerupdate still fires when paused (plugins)
* Added Security.allowDomain("*") to Flash so it can be used on different domains
* Fixed progress bar for Firefox 3 with Ogg files
* Prevented Flash from re-creating the player when show/hide restarts it
* Fixed initial volume level in non-HTML5 players
* Made PNG8 versions of controls images (for IE6)

*2.0.4 (2011/01/14) - 31.2kb*

* Fixed a major bug in plugin detection.

*2.0.3 (2011/01/13) - 31.2kb*

* changed IE Flash insertion to include me-plugin CSS class
* changed player error handling
* fixed a bug in the Silverlight player related to URLs

*2.0.2 (2010/12/31) - 31.1kb*

* Changed HTML escape method to encodeURICompnent
* Flash-based RMTP support (contributor: sylvinus)
* Fixed Wordpress loop bug
* Changed time popup to move with mouse instead of currentTime
* added enablePluginSmoothing (Flash)
* Added some "play" "playing" event duplication to Flash

*2.0.1 (2010/12/20) - XX.Xkb*

* Changed Flash to allow cross domain video
* Added 'click' event to Flash and Silverlight
* Updated autoplay attribute detection

*2.0.0 (2010/12/13) - 30.8kb*

* Reorganized MediaElementPlayer code to allow each button to become a pluggable feature that can be removed or overrided
* Enabled a no JavaScript version to support Video for Everybody nested syntax (optional)
* Enabled drag on progress bar
* Preload="none" is default for Flash and Silverlight
* Preload="none" enabled on Google Chrome
* Added skins to download
* Support for skin swapping
* Updated volume handle controls
* Update progress controls display
* Exposed MediaElement API methods on player
* Adjusted layout for IE6

*1.1.7 (2010/11/29) - 29.8kb*

* Fixed bug with `<track>` loading on `<audio>` player

*1.1.6 (2010/11/23) - 29.8kb*

* Chapters support `<track kind="chapters" />`

*1.1.5 (2010/11/21) - 29.8kb*

* Workaround for IE issues when accidentally placed inside `<p>` tag
* Fixed silverlight pause state reporting
* Switched back to Flash as default
* Removed requirement for Google translate API `<script>` (direct JSONP call)
* Added googleApiKey option

*1.1.4 (2010/11/21) - 29.5kb*

* Added Default volume level to options (0.8)
* Fix for IE volume slider positioning
* Fix for IE tracks parsing (replacement String.split)
* Changed namespace from html5 to mejs
* Remove all showMessage references
* Controls show again after playback ends

*1.1.3 (2010/11/20) - 29.0kb*

* Change to fallback mechanism and styling (Windows Phone 7)

*1.1.2 (2010/11/19) - 28.9kb*

* Removed messages, added big play button
* Google translate now supports more than 1000 characters
* Added a dropdownlist of languages from which the user can select
* Added timerUpdate option to set the millisecond speed of timeupdate events
* Updated the media file and examples

*1.1.1 (2010/11/18) - 27.1kb*

* added captioning support via the `<track>` tag (thanks to @Playr(http://www.delphiki.com/html5/playr) for the example)
* added auto-translation support via Google translate API

*1.1.0 (2010/11/17) - 22.6kb*

* Total re-oganization of MediaElement, MediaElementPlayer, and supporting objects
* Updated CSS to a cleaner look, with better IE support & big play button
* Simplified all plugin and version detection
* Added loop option (useful for audio files)
* Added the ability to turn each control button on/off
* Added canPlayType to PluginMediaElement
* Updated setSrc to take multiple sources

*1.0.7 (2010/11/16) - 18.15kb*

* Total re-oganization of MediaElement code
* JSLint compliant, YUI compliant

*1.0.6 (2010/11/15) - 17.96kb*

* Rebuilt PluginDetection (removed SWFObject and Microsoft code)
* More JSLint compatible (still a few iterations to get there)
* Added jQuery 1.4.4

*1.0.5 (2010/11/10 later on)*

* Fixed a problem with the *.min.js files
* Added jQuery 1.4.3

*1.0.4 (2010/11/10) - 18.32kb*

* Fixed Flash display when `<video>` did not match actual dimensions
* autosizing in Flash and Silverlight
* added options for defaultVideoWidth, defaultVideoHeight when `<video>` `height` and `width` are not set
* included minified versions using YUI compressor

*1.0.3 (2010/09/24)*

* changes in poster handling
* fix IE9 startup bug (its 'play' event fires wrongly it seems)
* fixed Flock, Opera sizing bugs
* fixed audio ended bug in special cases under Flash
* added default height/width when they are not specified in attributes

*1.0.2 (2010/09/17)*

* minor updates to support IE9 beta1

*1.0.1 (2010/09/13)*

* added native fullscreen support for Safari 5 (via webkitEnterFullScreen)

*1.0.0 (2010/08/09)*

* initial release
