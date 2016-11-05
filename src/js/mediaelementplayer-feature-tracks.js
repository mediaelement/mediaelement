/**
 * Closed Captions (CC) button
 *
 * This feature enables the displaying of a CC button in the control bar, and also contains the methods to start media
 * with a certain language (if available), toggle captions, etc.
 */
(function($) {

	// Feature configuration
	$.extend(mejs.MepDefaults, {
		/**
		 * Default language to start media using ISO 639-2 Language Code List (en, es, it, etc.)
		 * @see https://www.loc.gov/standards/iso639-2/php/code_list.php
		 * @type {String}
		 */
		startLanguage: '',
		/**
		 * @type {String}
		 */
		tracksText: '',
		/**
		 * Avoid to screen reader speak captions over an audio track.
		 *
		 * @type {Boolean}
		 */
		tracksAriaLive: false,
		/**
		 * Remove the [cc] button when no track nodes are present
		 * @type {Boolean}
		 */
		hideCaptionsButtonWhenEmpty: true,
		/**
		 * Change captions to pop-up if true and only one track node is found
		 * @type {Boolean}
		 */
		toggleCaptionsButtonWhenOnlyOne: false,
		/**
		 * @type {String}
		 */
		slidesSelector: ''
	});

	$.extend(MediaElementPlayer.prototype, {

		/**
		 * @type {Boolean}
		 */
		hasChapters: false,

		/**
		 * Feature constructor.
		 *
		 * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 * @param {$} controls
		 * @param {$} layers
		 * @param {HTMLElement} media
		 */
		buildtracks: function(player, controls, layers, media) {
			if (player.tracks.length === 0) {
				return;
			}

			var
				t = this,
				attr = t.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : '',
				tracksTitle = t.options.tracksText ? t.options.tracksText : mejs.i18n.t('mejs.captions-subtitles'),
				i,
				kind
			;

			// If browser will do native captions, prefer mejs captions, loop through tracks and hide
			if (t.domNode.textTracks) {
				for (i = t.domNode.textTracks.length - 1; i >= 0; i--) {
					t.domNode.textTracks[i].mode = "hidden";
				}
			}

			t.cleartracks(player);
			player.chapters =
					$('<div class="mejs__chapters mejs__layer"></div>')
						.prependTo(layers).hide();
			player.captions =
					$('<div class="mejs__captions-layer mejs__layer"><div class="mejs__captions-position mejs__captions-position-hover" ' +
					attr + '><span class="mejs__captions-text"></span></div></div>')
						.prependTo(layers).hide();
			player.captionsText = player.captions.find('.mejs__captions-text');
			player.captionsButton =
					$('<div class="mejs__button mejs__captions-button">'+
						'<button type="button" aria-controls="' + t.id + '" title="' + tracksTitle + '" aria-label="' + tracksTitle + '"></button>'+
						'<div class="mejs__captions-selector">'+
							'<ul>'+
								'<li>'+
									'<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_none" value="none" checked="checked" />' +
									'<label for="' + player.id + '_captions_none">' + mejs.i18n.t('mejs.none') +'</label>'+
								'</li>'	+
							'</ul>'+
						'</div>'+
					'</div>')
						.appendTo(controls);


			var subtitleCount = 0;
			for (i=0; i<player.tracks.length; i++) {
				kind = player.tracks[i].kind;
				if (kind === 'subtitles' || kind === 'captions') {
					subtitleCount++;
				}
			}

			// if only one language then just make the button a toggle
			if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitleCount === 1){
				// click
				player.captionsButton.on('click',function() {
					if (player.selectedTrack === null) {
						lang = player.tracks[0].srclang;
					} else {
						lang = 'none';
					}
					player.setTrack(lang);
				});
			} else {
				// hover or keyboard focus
				player.captionsButton.on( 'mouseenter focusin', function() {
					$(this).find('.mejs__captions-selector').removeClass('mejs__offscreen');
				})

				// handle clicks to the language radio buttons
				.on('click','input[type=radio]',function() {
					lang = this.value;
					player.setTrack(lang);
				});

				player.captionsButton.on( 'mouseleave focusout', function() {
					$(this).find(".mejs__captions-selector").addClass("mejs__offscreen");
				});

			}

			if (!player.options.alwaysShowControls) {
				// move with controls
				player.container
					.bind('controlsshown', function () {
						// push captions above controls
						player.container.find('.mejs__captions-position').addClass('mejs__captions-position-hover');

					})
					.bind('controlshidden', function () {
						if (!media.paused) {
							// move back to normal place
							player.container.find('.mejs__captions-position').removeClass('mejs__captions-position-hover');
						}
					});
			} else {
				player.container.find('.mejs__captions-position').addClass('mejs__captions-position-hover');
			}

			player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;

			// add to list
			var total = player.tracks.length;

			for (i = 0; i < total; i++) {
				kind = player.tracks[i].kind;
				if (kind === 'subtitles' || kind === 'captions') {
					player.addTrackButton(player.tracks[i].srclang, player.tracks[i].label);
				}
			}

			// start loading tracks
			player.loadNextTrack();

			media.addEventListener('timeupdate',function() {
				player.displayCaptions();
			}, false);

			if (player.options.slidesSelector !== '') {
				player.slidesContainer = $(player.options.slidesSelector);

				media.addEventListener('timeupdate',function() {
					player.displaySlides();
				}, false);

			}

			media.addEventListener('loadedmetadata', function() {
				player.displayChapters();
			}, false);

			player.container.hover(
				function () {
					// chapters
					if (player.hasChapters) {
						player.chapters.removeClass('mejs__offscreen');
						player.chapters.fadeIn(200).height(player.chapters.find('.mejs__chapter').outerHeight());
					}
				},
				function () {
					if (player.hasChapters && !media.paused) {
						player.chapters.fadeOut(200, function() {
							$(this).addClass('mejs__offscreen');
							$(this).css('display','block');
						});
					}
				});

			t.container.on('controlsresize', function() {
				t.adjustLanguageBox();
			});

			// check for autoplay
			if (player.node.getAttribute('autoplay') !== null) {
				player.chapters.addClass('mejs__offscreen');
			}
		},

		/**
		 * Feature destructor.
		 *
		 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
		 * @param {MediaElementPlayer} player
		 */
		cleartracks: function(player){
			if (player) {
				if (player.captions) {
					player.captions.remove();
				}
				if (player.chapters) {
					player.chapters.remove();
				}
				if (player.captionsText) {
					player.captionsText.remove();
				}
				if (player.captionsButton) {
					player.captionsButton.remove();
				}
			}
		},

		/**
		 *
		 * @param {String} lang
		 */
		setTrack: function(lang){

			var
				t = this,
				i
			;

			if (lang === 'none') {
				t.selectedTrack = null;
				t.captionsButton.removeClass('mejs__captions-enabled');
			} else {
				for (i=0; i<t.tracks.length; i++) {
					if (t.tracks[i].srclang === lang) {
						if (t.selectedTrack === null)
							t.captionsButton.addClass('mejs__captions-enabled');
						t.selectedTrack = t.tracks[i];
						t.captions.attr('lang', t.selectedTrack.srclang);
						t.displayCaptions();
						break;
					}
				}
			}
		},

		/**
		 *
		 */
		loadNextTrack: function() {
			var t = this;

			t.trackToLoad++;
			if (t.trackToLoad < t.tracks.length) {
				t.isLoadingTrack = true;
				t.loadTrack(t.trackToLoad);
			} else {
				// add done?
				t.isLoadingTrack = false;

				t.checkForTracks();
			}
		},

		/**
		 *
		 * @param index
		 */
		loadTrack: function(index){
			var
				t = this,
				track = t.tracks[index],
				after = function() {

					track.isLoaded = true;

					t.enableTrackButton(track.srclang, track.label);

					t.loadNextTrack();

				}
			;

			if (track.src !== undefined || track.src !== "") {
				$.ajax({
					url: track.src,
					dataType: "text",
					success: function(d) {

						// parse the loaded file
						if (typeof d == "string" && (/<tt\s+xml/ig).exec(d)) {
							track.entries = mejs.TrackFormatParser.dfxp.parse(d);
						} else {
							track.entries = mejs.TrackFormatParser.webvtt.parse(d);
						}

						after();

						if (track.kind == 'chapters') {
							t.media.addEventListener('play', function() {
								if (t.media.duration > 0) {
									t.displayChapters(track);
								}
							}, false);
						}

						if (track.kind == 'slides') {
							t.setupSlides(track);
						}
					},
					error: function() {
						t.removeTrackButton(track.srclang);
						t.loadNextTrack();
					}
				});
			}
		},

		/**
		 *
		 * @param {String} lang - The language code
		 * @param {String} label
		 */
		enableTrackButton: function(lang, label) {
			var t = this;

			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}

			t.captionsButton
				.find('input[value=' + lang + ']')
					.prop('disabled',false)
				.siblings('label')
					.html(label);

			// auto select
			if (t.options.startLanguage === lang) {
				$('#' + t.id + '_captions_' + lang).prop('checked', true).trigger('click');
			}

			t.adjustLanguageBox();
		},

		/**
		 *
		 * @param {String} lang
		 */
		removeTrackButton: function(lang) {
			var t = this;

			t.captionsButton.find('input[value=' + lang + ']').closest('li').remove();

			t.adjustLanguageBox();
		},

		/**
		 *
		 * @param {String} lang - The language code
		 * @param {String} label
		 */
		addTrackButton: function(lang, label) {
			var t = this;
			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}

			t.captionsButton.find('ul').append(
				$('<li>'+
					'<input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_' + lang + '" value="' + lang + '" disabled="disabled" />' +
					'<label for="' + t.id + '_captions_' + lang + '">' + label + ' (loading)' + '</label>'+
				'</li>')
			);

			t.adjustLanguageBox();

			// remove this from the dropdownlist (if it exists)
			t.container.find('.mejs__captions-translations option[value=' + lang + ']').remove();
		},

		/**
		 *
		 */
		adjustLanguageBox:function() {
			var t = this;
			// adjust the size of the outer box
			t.captionsButton.find('.mejs__captions-selector').height(
				t.captionsButton.find('.mejs__captions-selector ul').outerHeight(true) +
				t.captionsButton.find('.mejs__captions-translations').outerHeight(true)
			);
		},

		/**
		 *
		 */
		checkForTracks: function() {
			var
				t = this,
				hasSubtitles = false
			;

			// check if any subtitles
			if (t.options.hideCaptionsButtonWhenEmpty) {
				for (var i=0; i<t.tracks.length; i++) {
					var kind = t.tracks[i].kind;
					if ((kind === 'subtitles' || kind === 'captions') && t.tracks[i].isLoaded) {
						hasSubtitles = true;
						break;
					}
				}

				if (!hasSubtitles) {
					t.captionsButton.hide();
					t.setControlsSize();
				}
			}
		},

		/**
		 *
		 */
		displayCaptions: function() {

			if (this.tracks === undefined)
				return;

			var
				t = this,
				i,
				track = t.selectedTrack
			;

			if (track !== null && track.isLoaded) {
				for (i=0; i<track.entries.times.length; i++) {
					if (t.media.currentTime >= track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop) {
						// Set the line before the timecode as a class so the cue can be targeted if needed
						t.captionsText.html(track.entries.text[i]).attr('class', 'mejs__captions-text ' + (track.entries.times[i].identifier || ''));
						t.captions.show().height(0);
						return; // exit out if one is visible;
					}
				}
				t.captions.hide();
			} else {
				t.captions.hide();
			}
		},

		/**
		 *
		 * @param {HTMLElement} track
		 */
		setupSlides: function(track) {
			var t = this;

			t.slides = track;
			t.slides.entries.imgs = [t.slides.entries.text.length];
			t.showSlide(0);

		},

		/**
		 *
		 * @param {Number} index
		 */
		showSlide: function(index) {
			if (this.tracks === undefined || this.slidesContainer === undefined) {
				return;
			}

			var t = this,
				url = t.slides.entries.text[index],
				img = t.slides.entries.imgs[index];

			if (img === undefined || img.fadeIn === undefined) {

				t.slides.entries.imgs[index] = img = $('<img src="' + url + '">')
						.on('load', function() {
							img.appendTo(t.slidesContainer)
								.hide()
								.fadeIn()
								.siblings(':visible')
									.fadeOut();

						});

			} else {

				if (!img.is(':visible') && !img.is(':animated')) {

					//console.log('showing existing slide');

					img.fadeIn()
						.siblings(':visible')
							.fadeOut();
				}
			}

		},

		/**
		 *
		 */
		displaySlides: function() {

			if (this.slides === undefined) {
				return;
			}

			var
				t = this,
				slides = t.slides,
				i
			;

			for (i=0; i<slides.entries.times.length; i++) {
				if (t.media.currentTime >= slides.entries.times[i].start && t.media.currentTime <= slides.entries.times[i].stop){

					t.showSlide(i);

					return; // exit out if one is visible;
				}
			}
		},

		/**
		 *
		 */
		displayChapters: function() {
			var
				t = this,
				i;

			for (i=0; i<t.tracks.length; i++) {
				if (t.tracks[i].kind === 'chapters' && t.tracks[i].isLoaded) {
					t.drawChapters(t.tracks[i]);
					t.hasChapters = true;
					break;
				}
			}
		},

		/**
		 *
		 * @param {Object} chapters
		 */
		drawChapters: function(chapters) {
			var
				t = this,
				i,
				dur,
				percent = 0,
				usedPercent = 0,
				total = chapters.entries.times.length
			;

			t.chapters.empty();

			for (i = 0; i<total; i++) {
				dur = chapters.entries.times[i].stop - chapters.entries.times[i].start;
				percent = Math.floor(dur / t.media.duration * 100);
				if (percent + usedPercent > 100 || // too large
					i === chapters.entries.times.length-1 && percent + usedPercent < 100) // not going to fill it in
					{
					percent = 100 - usedPercent;
				}
				//width = Math.floor(t.width * dur / t.media.duration);
				//left = Math.floor(t.width * chapters.entries.times[i].start / t.media.duration);
				//if (left + width > t.width) {
				//	width = t.width - left;
				//}

				t.chapters.append( $(
					'<div class="mejs__chapter" rel="' + chapters.entries.times[i].start + '" style="left: ' + usedPercent.toString() + '%;width: ' + percent.toString() + '%;">' +
						'<div class="mejs__chapter-block' + ((i==chapters.entries.times.length-1) ? ' mejs__chapter-block-last' : '') + '">' +
							'<span class="ch-title">' + chapters.entries.text[i] + '</span>' +
							'<span class="ch-time">' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].start, t.options.alwaysShowHours) + '&ndash;' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].stop, t.options.alwaysShowHours) + '</span>' +
						'</div>' +
					'</div>'));
				usedPercent += percent;
			}

			t.chapters.find('div.mejs__chapter').click(function() {
				t.media.setCurrentTime( parseFloat( $(this).attr('rel') ) );
				if (t.media.paused) {
					t.media.play();
				}
			});

			t.chapters.show();
		}
	});

	/**
	 * Map all possible languages with their respective code
	 *
	 * @constructor
	 */
	mejs.language = {
		codes:  {
			af: mejs.i18n.t('mejs.afrikaans'),
			sq: mejs.i18n.t('mejs.albanian'),
			ar: mejs.i18n.t('mejs.arabic'),
			be: mejs.i18n.t('mejs.belarusian'),
			bg: mejs.i18n.t('mejs.bulgarian'),
			ca: mejs.i18n.t('mejs.catalan'),
			zh: mejs.i18n.t('mejs.chinese'),
			'zh-cn': mejs.i18n.t('mejs.chinese-simplified'),
			'zh-tw': mejs.i18n.t('mejs.chines-traditional'),
			hr: mejs.i18n.t('mejs.croatian'),
			cs: mejs.i18n.t('mejs.czech'),
			da: mejs.i18n.t('mejs.danish'),
			nl: mejs.i18n.t('mejs.dutch'),
			en: mejs.i18n.t('mejs.english'),
			et: mejs.i18n.t('mejs.estonian'),
			fl: mejs.i18n.t('mejs.filipino'),
			fi: mejs.i18n.t('mejs.finnish'),
			fr: mejs.i18n.t('mejs.french'),
			gl: mejs.i18n.t('mejs.galician'),
			de: mejs.i18n.t('mejs.german'),
			el: mejs.i18n.t('mejs.greek'),
			ht: mejs.i18n.t('mejs.haitian-creole'),
			iw: mejs.i18n.t('mejs.hebrew'),
			hi: mejs.i18n.t('mejs.hindi'),
			hu: mejs.i18n.t('mejs.hungarian'),
			is: mejs.i18n.t('mejs.icelandic'),
			id: mejs.i18n.t('mejs.indonesian'),
			ga: mejs.i18n.t('mejs.irish'),
			it: mejs.i18n.t('mejs.italian'),
			ja: mejs.i18n.t('mejs.japanese'),
			ko: mejs.i18n.t('mejs.korean'),
			lv: mejs.i18n.t('mejs.latvian'),
			lt: mejs.i18n.t('mejs.lithuanian'),
			mk: mejs.i18n.t('mejs.macedonian'),
			ms: mejs.i18n.t('mejs.malay'),
			mt: mejs.i18n.t('mejs.maltese'),
			no: mejs.i18n.t('mejs.norwegian'),
			fa: mejs.i18n.t('mejs.persian'),
			pl: mejs.i18n.t('mejs.polish'),
			pt: mejs.i18n.t('mejs.portuguese'),
			ro: mejs.i18n.t('mejs.romanian'),
			ru: mejs.i18n.t('mejs.russian'),
			sr: mejs.i18n.t('mejs.serbian'),
			sk: mejs.i18n.t('mejs.slovak'),
			sl: mejs.i18n.t('mejs.slovenian'),
			es: mejs.i18n.t('mejs.spanish'),
			sw: mejs.i18n.t('mejs.swahili'),
			sv: mejs.i18n.t('mejs.swedish'),
			tl: mejs.i18n.t('mejs.tagalog'),
			th: mejs.i18n.t('mejs.thai'),
			tr: mejs.i18n.t('mejs.turkish'),
			uk: mejs.i18n.t('mejs.ukrainian'),
			vi: mejs.i18n.t('mejs.vietnamese'),
			cy: mejs.i18n.t('mejs.welsh'),
			yi: mejs.i18n.t('mejs.yiddish')
		}
	};

	/*
	Parses WebVTT format which should be formatted as
	================================
	WEBVTT

	1
	00:00:01,1 --> 00:00:05,000
	A line of text

	2
	00:01:15,1 --> 00:02:05,000
	A second line of text

	===============================

	Adapted from: http://www.delphiki.com/html5/playr
	*/
	mejs.TrackFormatParser = {
		webvtt: {
			/**
			 * @type {String}
			 */
			pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

			/**
			 *
			 * @param {String} trackText
			 * @returns {{text: Array, times: Array}}
			 */
			parse: function(trackText) {
				var
					i = 0,
					lines = mejs.TrackFormatParser.split2(trackText, /\r?\n/),
					entries = {text:[], times:[]},
					timecode,
					text,
					identifier;
				for(; i<lines.length; i++) {
					timecode = this.pattern_timecode.exec(lines[i]);

					if (timecode && i<lines.length) {
						if ((i - 1) >= 0 && lines[i - 1] !== '') {
							identifier = lines[i - 1];
						}
						i++;
						// grab all the (possibly multi-line) text that follows
						text = lines[i];
						i++;
						while(lines[i] !== '' && i<lines.length){
							text = text + '\n' + lines[i];
							i++;
						}
						text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
						// Text is in a different array so I can use .join
						entries.text.push(text);
						entries.times.push(
						{
							identifier: identifier,
							start: (mejs.Utility.convertSMPTEtoSeconds(timecode[1]) === 0) ? 0.200 : mejs.Utility.convertSMPTEtoSeconds(timecode[1]),
							stop: mejs.Utility.convertSMPTEtoSeconds(timecode[3]),
							settings: timecode[5]
						});
					}
					identifier = '';
				}
				return entries;
			}
		},
		// Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
		dfxp: {
			/**
			 *
			 * @param {String} trackText
			 * @returns {{text: Array, times: Array}}
			 */
			parse: function(trackText) {
				trackText = $(trackText).filter("tt");
				var
					i = 0,
					container = trackText.children("div").eq(0),
					lines = container.find("p"),
					styleNode = trackText.find("#" + container.attr("style")),
					styles,
					text,
					entries = {text:[], times:[]};


				if (styleNode.length) {
					var attributes = styleNode.removeAttr("id").get(0).attributes;
					if (attributes.length) {
						styles = {};
						for (i = 0; i < attributes.length; i++) {
							styles[attributes[i].name.split(":")[1]] = attributes[i].value;
						}
					}
				}

				for(i = 0; i<lines.length; i++) {
					var style;
					var _temp_times = {
						start: null,
						stop: null,
						style: null
					};
					if (lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("begin"));
					if (!_temp_times.start && lines.eq(i-1).attr("end")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i-1).attr("end"));
					if (lines.eq(i).attr("end")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("end"));
					if (!_temp_times.stop && lines.eq(i+1).attr("begin")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i+1).attr("begin"));
					if (styles) {
						style = "";
						for (var _style in styles) {
							style += _style + ":" + styles[_style] + ";";
						}
					}
					if (style) _temp_times.style = style;
					if (_temp_times.start === 0) _temp_times.start = 0.200;
					entries.times.push(_temp_times);
					text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.text.push(text);
				}
				return entries;
			}
		},
		/**
		 *
		 * @param {String} text
		 * @param {String} regex
		 * @returns {Array}
		 */
		split2: function (text, regex) {
			// normal version for compliant browsers
			// see below for IE fix
			return text.split(regex);
		}
	};

	// test for browsers with bad String.split method.
	if ('x\n\ny'.split(/\n/gi).length != 3) {
		// add super slow IE8 and below version
		mejs.TrackFormatParser.split2 = function(text, regex) {
			var
				parts = [],
				chunk = '',
				i;

			for (i=0; i<text.length; i++) {
				chunk += text.substring(i,i+1);
				if (regex.test(chunk)) {
					parts.push(chunk.replace(regex, ''));
					chunk = '';
				}
			}
			parts.push(chunk);
			return parts;
		};
	}

})(mejs.$);
