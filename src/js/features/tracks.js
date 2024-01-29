'use strict';

import document from 'global/document';
import mejs from '../core/mejs';
import i18n from '../core/i18n';
import {config} from '../player';
import MediaElementPlayer from '../player';
import {isString, createEvent} from '../utils/general';
import {addClass, removeClass, hasClass, siblings} from '../utils/dom';
import {generateControlButton} from '../utils/generate';

/**
 * Closed Captions (CC) button
 *
 * This feature enables the displaying of a CC button in the control bar, and also contains the methods to start media
 * with a certain language (if available), toggle captions, etc.
 */

// Feature configuration
Object.assign(config, {
  /**
   * Default language to start media using ISO 639-2 Language Code List (en, es, it, etc.)
   * If there are multiple tracks for one language, the last track node loaded is activated
   * @see https://www.loc.gov/standards/iso639-2/php/code_list.php
   * @type {?String}
   */
  autoplayCaptionLanguage: null,
  /**
   * Default cue line in which to display cues if the cue is set to "auto" (no line entry in VTT). The default of -3 is
   * positioned slightly above the player controls.
   * @type {?(Number|Boolean)}
   */
  defaultTrackLine: -3,
  /**
   * @type {?String}
   */
  tracksText: null,
  /**
   * @type {?String}
   */
  chaptersText: null,
  /**
   * Language to use if multiple chapter tracks are present. If not set, the first available chapter will be used.
   * ISO 639-2 Language Code (en, es, it, etc.)
   * @type {?String}
   */
  chaptersLanguage: null,
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
});

Object.assign(MediaElementPlayer.prototype, {
  /**
   * @type {Boolean}
   */
  hasChapters: false,

  /**
   * Feature constructor.
   *
   * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
   * @param {MediaElementPlayer} player
   * @param {HTMLElement} controls
   */
  buildtracks (player, controls) {
    this.initTracks(player);

    if (!player.tracks.length && (!player.trackFiles || !(player.trackFiles.length === 0))) {
      return;
    }

    const
      t = this,
      tracksTitle = isString(t.options.tracksText) ? t.options.tracksText : i18n.t('mejs.captions-subtitles'),
      chaptersTitle = isString(t.options.chaptersText) ? t.options.chaptersText : i18n.t('mejs.captions-chapters')
    ;

    // Hide all tracks initially (mode 'hidden' triggers loading)
    t.hideAllTracks();

    t.clearTrackHtml(player);

    player.captionsButton = document.createElement('div');
    player.captionsButton.className = `${t.options.classPrefix}button ${t.options.classPrefix}captions-button`;
    player.captionsButton.innerHTML =
      generateControlButton(t.id, tracksTitle, tracksTitle, `${t.media.options.iconSprite}`, ['icon-captions'], `${t.options.classPrefix}`) +
      `<div class="${t.options.classPrefix}captions-selector ${t.options.classPrefix}offscreen">` +
        `<ul class="${t.options.classPrefix}captions-selector-list">` +
          `<li class="${t.options.classPrefix}captions-selector-list-item">` +
            `<input type="radio" class="${t.options.classPrefix}captions-selector-input" ` +
            `name="${player.id}_captions" id="${player.id}_captions_none" ` +
            `value="none" checked disabled>` +
            `<label class="${t.options.classPrefix}captions-selector-label ` +
            `${t.options.classPrefix}captions-selected" ` +
            `for="${player.id}_captions_none">${i18n.t('mejs.none')}</label>` +
          `</li>` +
        `</ul>` +
      `</div>`;

    t.addControlElement(player.captionsButton, 'tracks');

    player.captionsButton.querySelector(`.${t.options.classPrefix}captions-selector-input`).disabled = false;

    player.chaptersButton = document.createElement('div');
    player.chaptersButton.className = `${t.options.classPrefix}button ${t.options.classPrefix}chapters-button`;
    player.chaptersButton.innerHTML =
      generateControlButton(t.id, chaptersTitle, chaptersTitle, `${t.media.options.iconSprite}`, ['icon-chapters'], `${t.options.classPrefix}`) +
      `<div class="${t.options.classPrefix}chapters-selector ${t.options.classPrefix}offscreen">` +
        `<ul class="${t.options.classPrefix}chapters-selector-list"></ul>` +
      `</div>`;

    const subtitles = t.getSubtitles();
    const chapters = t.getChapters();

    // add chapters button
    if (chapters.length > 0 && !controls.querySelector(`.${t.options.classPrefix}chapter-selector`)) {
      player.captionsButton.parentNode.insertBefore(player.chaptersButton, player.captionsButton);
    }

    // add subtitles
    for (let i = 0; i < subtitles.length; i++) {
      player.addTrackButton(subtitles[i]);
      if (subtitles[i].isLoaded) {
        // subtitles can already be loaded by the browser before UI exists, so the UI could not be updated by the load
        // event. So we enable the button, if its state show it has been loaded.
        t.enableTrackButton(subtitles[i]);
      }
    }

    player.trackToLoad = -1;
    player.selectedTrack = null;
    player.isLoadingTrack = false;

    const
      inEvents = ['mouseenter', 'focusin'],
      outEvents = ['mouseleave', 'focusout']
    ;

    // if only one language then just make the button a toggle
    if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitles.length === 1) {
      player.captionsButton.classList.add(`${t.options.classPrefix}captions-button-toggle`);
      player.captionsButton.addEventListener('click', (e) => {
        let trackId = 'none';
        if (player.selectedTrack === null) {
          trackId = player.getSubtitles()[0].trackId;
        }
        const keyboard = e.keyCode || e.which;
        player.setTrack(trackId, (typeof keyboard !== 'undefined'));
      });
    } else {
      const
        labels = player.captionsButton.querySelectorAll(`.${t.options.classPrefix}captions-selector-label`),
        captions = player.captionsButton.querySelectorAll('input[type=radio]')
      ;

      for (let i = 0; i < inEvents.length; i++) {
        player.captionsButton.addEventListener(inEvents[i], function () {
          removeClass(this.querySelector(`.${t.options.classPrefix}captions-selector`), `${t.options.classPrefix}offscreen`);
        });
      }

      for (let i = 0; i < outEvents.length; i++) {
        player.captionsButton.addEventListener(outEvents[i], function () {
          // TODO: focusout does not work properly on mobile devices and the menu is not (visually) keyboard accessible
          setTimeout(() => {
            addClass(this.querySelector(`.${t.options.classPrefix}captions-selector`), `${t.options.classPrefix}offscreen`);
          }, 0);
        });
      }

      for (let i = 0; i < captions.length; i++) {
        captions[i].addEventListener('click',  function (e) {
          // value is trackId, same as the actual id, and we're using it here
          // because the "none" checkbox doesn't have a trackId
          // to use, but we want to know when "none" is clicked
          const keyboard = e.keyCode || e.which;
          if (!e.target.disabled) {
            player.setTrack(this.value, (typeof keyboard !== 'undefined'));
          }
        });
      }

      for (let i = 0; i < labels.length; i++) {
        labels[i].addEventListener('click',  function (e) {
          const
            radio = siblings(this, (el) => el.tagName === 'INPUT')[0],
            event = createEvent('click', radio)
          ;
          radio.dispatchEvent(event);
          e.preventDefault();
        });
      }

      //Allow up/down arrow to change the selected radio without changing the volume.
      player.captionsButton.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
    }

    for (let i = 0; i < inEvents.length; i++) {
      player.chaptersButton.addEventListener(inEvents[i], function () {
        if (this.querySelector(`.${t.options.classPrefix}chapters-selector-list`).children.length) {
          removeClass(this.querySelector(`.${t.options.classPrefix}chapters-selector`), `${t.options.classPrefix}offscreen`);
        }
      });
    }

    for (let i = 0; i < outEvents.length; i++) {
      player.chaptersButton.addEventListener(outEvents[i], function () {
        // TODO: focusout does not work properly on mobile devices and the menu is not (visually) keyboard accessible
        setTimeout(() => {
          addClass(this.querySelector(`.${t.options.classPrefix}chapters-selector`), `${t.options.classPrefix}offscreen`);
        }, 0);
      });
    }

    //Allow up/down arrow to change the selected radio without changing the volume.
    player.chaptersButton.addEventListener('keydown', (e) => {
      e.stopPropagation();
    });

    // trigger track load checks in case the browser loaded them before the UI was set up (can happen with "default")
    t.checkAllCaptionsLoadedOrError();
    t.checkAllChaptersLoadedOrError();
  },

  /**
   * Feature destructor.
   *
   * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
   * @param {MediaElementPlayer} player
   */
  clearTrackHtml (player) {
    if (player) {
      if (player.captionsButton) {
        player.captionsButton.remove();
      }
      if (player.chaptersButton) {
        player.chaptersButton.remove();
      }
    }
  },

  /**
   * Check for track files and setup event handlers and local track data.
   * @param {MediaElementPlayer} player
   */
  initTracks (player) {
    const
      t = this,
      trackFiles = t.trackFiles === null ? t.node.querySelectorAll('track') : t.trackFiles
    ;
    // store for use by plugins
    t.tracks = [];

    if (trackFiles) {
      player.trackFiles = trackFiles;
      for (let i = 0; i < trackFiles.length; i++) {
        const
          track = trackFiles[i],
          srclang = track.getAttribute('srclang').toLowerCase() || '',
          trackId = track.getAttribute('id') || `${t.id}_track_${i}_${track.getAttribute('kind')}_${srclang}`
        ;
        track.setAttribute('id', trackId);

        const trackData = {
          trackId: trackId,
          srclang: srclang,
          src: track.getAttribute('src'),
          kind: track.getAttribute('kind'),
          label: track.getAttribute('label') || '',
          entries: [],
          isDefault: track.hasAttribute('default'),
          isError: false,
          isLoaded: false
        };
        t.tracks.push(trackData);

        if (track.getAttribute('kind') === 'captions' || track.getAttribute('kind') === 'subtitles') {
          // caption / subtitle handling
          switch (track.readyState) {
            case 2:
              // already loaded
              t.handleCaptionsLoaded(track);
              break;
            case 3:
              // quit loading with error
              t.handleCaptionsError(track);
              break;
            default:
              // is going to be loaded
              track.addEventListener('load', (event) => {
                t.handleCaptionsLoaded(event.target);
              });
              track.addEventListener('error', (event) => {
                t.handleCaptionsError(event.target);
              });
              break;
          }
        } else if (track.getAttribute('kind') === 'chapters') {
          // chapter handling
          switch (track.readyState) {
            case 2:
              t.handleChaptersLoaded(track);
              break;
            case 3:
              t.handleChaptersError(track);
              break;
            default:
              track.addEventListener('load', (event) => {
                t.handleChaptersLoaded(event.target);
              });
              track.addEventListener('error', (event) => {
                t.handleChaptersError(event.target);
              });
              break;
          }
        }
      }
    }
  },

  /**
   * Load handler for captions and subtitles. Change cue lines if set to auto.
   * @param {Element} target Video track element
   */
  handleCaptionsLoaded(target) {
    const
      textTracks = this.node.textTracks,
      playerTrack = this.getTrackById(target.getAttribute('id'));

    // Set default cue line
    if (Number.isInteger(this.options.defaultTrackLine)) {
      for (let i = 0; i < textTracks.length; i++) {
        if (target.getAttribute('srclang') === textTracks[i].language
          && target.getAttribute('kind') === textTracks[i].kind) {
          const cues = textTracks[i].cues;
          for (let c = 0; c < cues.length; c++) {
            if (cues[c].line === 'auto' || cues[c].line === undefined ||  cues[c].line === null) {
              cues[c].line = this.options.defaultTrackLine;
            }
          }
          break;
        }
      }
    }

    // set state & active player button
    playerTrack.isLoaded = true;
    this.enableTrackButton(playerTrack);
    this.checkAllCaptionsLoadedOrError();
  },

  /**
   * Error handler for captions and subtitles. Removs the captions button for erroneous tracks.
   * @param {Element} target Video track element
   */
  handleCaptionsError(target) {
    const playerTrack = this.getTrackById(target.getAttribute('id'));

    playerTrack.isError = true;
    this.removeTrackButton(playerTrack);
    this.checkAllCaptionsLoadedOrError();
  },

  /**
   * Load handler for chapters tracks.
   * @param {Element} target Video track element
   */
  handleChaptersLoaded(target) {
    const playerTrack = this.getTrackById(target.getAttribute('id'));

    this.hasChapters = true;
    playerTrack.isLoaded = true;
    this.checkAllChaptersLoadedOrError();
  },

  /**
   * Error handler for chapters tracks.
   * @param {Element} target Video track element
   */
  handleChaptersError(target) {
    const playerTrack = this.getTrackById(target.getAttribute('id'));
    playerTrack.isError = true;
    this.checkAllChaptersLoadedOrError();
  },

  /**
   * Once all captions/subtitles are loaded, check if we need to autoplay one of them.
   */
  checkAllCaptionsLoadedOrError() {
    const subtitles = this.getSubtitles();
    if (subtitles.length === subtitles.filter(({isLoaded, isError}) => isLoaded || isError).length) {
      // no captions/subtitles OR all captions/subtitles loaded or quit loading with error
      this.removeCaptionsIfEmpty();
      this.checkForAutoPlay();
    }
  },

  /**
   * Once all chapters are loaded, determine which chapter file should be displayed as the chapters menu.
   */
  checkAllChaptersLoadedOrError() {
    const chapters = this.getChapters(),
          readyChapters = chapters.filter(({isLoaded}) => isLoaded);
    if (chapters.length === chapters.filter(({isLoaded, isError}) => isLoaded || isError).length) {
      // no chapters OR all chapters loaded or quit loading with error
      if (readyChapters.length === 0) {
        // no chapters -> remove chapters button
        this.chaptersButton.remove();
      } else {
        // try to find a chapter track in the language set in `options.chaptersLanguage`
        let langChapter = readyChapters.find(({srclang}) => srclang === this.options.chaptersLanguage);
        // if none was found try to find one using the current player language
        langChapter = langChapter || readyChapters.find(({srclang}) => srclang === i18n.lang);

        if (readyChapters.length === 1 || !langChapter) {
          // use first chapter track if only one exists or no chapter with the correct lanmguage was loaded
          this.drawChapters(readyChapters[0].trackId);
        } else {
          // use the chapter with the correct language
          this.drawChapters(langChapter.trackId);
        }
      }
    }
  },

  /**
   *
   * @param {String} trackId, or "none" to disable captions
   * @param {Boolean} setByKeyboard
   */
  setTrack (trackId, setByKeyboard) {
    const
      t = this,
      radios = t.captionsButton.querySelectorAll('input[type="radio"]'),
      captions = t.captionsButton.querySelectorAll(`.${t.options.classPrefix}captions-selected`),
      track = t.captionsButton.querySelector(`input[value="${trackId}"]`)
    ;

    for (let i = 0; i < radios.length; i++) {
      radios[i].checked = false;
    }

    for (let i = 0; i < captions.length; i++) {
      removeClass(captions[i], `${t.options.classPrefix}captions-selected`);
    }

    track.checked = true;
    const labels = siblings(track, (el) => hasClass(el, `${t.options.classPrefix}captions-selector-label`));
    for (let i = 0; i < labels.length; i++) {
      addClass(labels[i], `${t.options.classPrefix}captions-selected`)
    }

    if (trackId === 'none') {
      t.selectedTrack = null;
      removeClass(t.captionsButton, `${t.options.classPrefix}captions-enabled`);
      t.deactivateVideoTracks();
    } else {
      const track = t.getTrackById(trackId);
      if (track) {
        if (t.selectedTrack === null) {
          addClass(t.captionsButton, `${t.options.classPrefix}captions-enabled`);
        }
        t.selectedTrack = track;
        t.activateVideoTrack(t.selectedTrack.srclang);
      }
    }

    const event = createEvent('captionschange', t.media);
    event.detail.caption = t.selectedTrack;
    t.media.dispatchEvent(event);

    if (!setByKeyboard) {
      setTimeout(function() {
        t.getElement(t.container).focus();
      }, 500);
    }
  },

  /**
   * Set mode for all tracks to 'hidden' (causes player to load them).
   */
  hideAllTracks() {
    if (this.node.textTracks) {
      // parse through TextTrackList (not an Array)
      for (let i = 0; i < this.node.textTracks.length; i++) {
        this.node.textTracks[i].mode = 'hidden';
      }
    }
  },

  /**
   * Hide all subtitles/captions.
   */
  deactivateVideoTracks() {
    if (this.node.textTracks) {
      // parse through TextTrackList (not an Array)
      for (let i = 0; i < this.node.textTracks.length; i++) {
        const track = this.node.textTracks[i];
        if (track.kind === 'subtitles' || track.kind === 'captions') {
          track.mode = 'hidden';
        }
      }
    }
    if (this.options.toggleCaptionsButtonWhenOnlyOne && this.getSubtitles().length === 1) {
      // deactivate captions toggle button
      this.captionsButton.classList.remove(`${this.options.classPrefix}captions-button-toggle-on`);
    }
  },

  /**
   * Display a specific language and hide all other subtitles/captions.
   * @param {string} srclang Language code of the subtitles to display
   */
  activateVideoTrack(srclang) {
    // parse through TextTrackList (not an Array)
    for (let i = 0; i < this.node.textTracks.length; i++) {
      const track = this.node.textTracks[i];
      // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
      if (track.kind === 'subtitles' || track.kind === 'captions') {
        if (track.language === srclang) {
          track.mode = 'showing';
          if (this.options.toggleCaptionsButtonWhenOnlyOne && this.getSubtitles().length === 1) {
            // activate captions toggle button
            this.captionsButton.classList.add(`${this.options.classPrefix}captions-button-toggle-on`);
          }
        } else {
          track.mode = 'hidden';
        }
      }
    }
  },

  /**
   * Check if we need to start playing any subtitle track.
   */
  checkForAutoPlay() {
    // select track to automatically play; prefer autoplayCaptionLanguage to default
    const
      readySubtitles = this.getSubtitles().filter(({isError}) => !isError),
      autoplayTrack =
        readySubtitles.find(({srclang}) => this.options.autoplayCaptionLanguage === srclang) ||
        readySubtitles.find(({isDefault}) => isDefault);

    if (autoplayTrack) {
      if (this.options.toggleCaptionsButtonWhenOnlyOne && readySubtitles.length === 1 && this.captionsButton) {
        this.captionsButton.dispatchEvent(createEvent('click', this.captionsButton));
      } else {
        const target = document.getElementById(`${autoplayTrack.trackId}-btn`)
        if (target) {
          target.checked = true;
          target.dispatchEvent(createEvent('click', target));
        }
      }
    }
  },

  /**
   * Enable the input for the caption/subtitle and remove the "loading" notification from the label.
   * @param {object} track
   */
  enableTrackButton (track) {
    const
      t = this,
      lang = track.srclang,
      target = document.getElementById(`${track.trackId}-btn`)
    ;
    if (!target) {
      return;
    }

    let label = track.label;

    if (label === '') {
      label = i18n.t(mejs.language.codes[lang]) || lang;
    }
    target.disabled = false;
    const targetSiblings = siblings(target, (el) => hasClass(el, `${t.options.classPrefix}captions-selector-label`));
    for (let i = 0; i < targetSiblings.length; i++) {
      targetSiblings[i].innerHTML = label;
    }
  },

  /**
   * Removes a track button.
   * @param {object} track
   */
  removeTrackButton (track) {
    const element = document.getElementById(`${track.trackId}-btn`);
    if (element) {
      const button = element.closest('li');
      if (button) {
        button.remove();
      }
    }
  },

  /**
   * Adds a new track button.
   * @param {object} track
   */
  addTrackButton (track) {
    const
      t = this,
      label = track.label || i18n.t(mejs.language.codes[track.srclang]) || track.srclang;

    // trackId is used in the value, too, because the "none"
    // caption option doesn't have a trackId but we need to be able
    // to set it, too
    t.captionsButton.querySelector('ul').innerHTML += `<li class="${t.options.classPrefix}captions-selector-list-item">` +
      `<input type="radio" class="${t.options.classPrefix}captions-selector-input" ` +
      `name="${t.id}_captions" id="${track.trackId}-btn" value="${track.trackId}" disabled>` +
      `<label class="${t.options.classPrefix}captions-selector-label"` +
      `for="${track.trackId}">${label} (loading)</label>` +
      `</li>`;
  },

  /**
   * If no captions exist, remove the button.
   */
  removeCaptionsIfEmpty() {
    if (this.captionsButton && this.options.hideCaptionsButtonWhenEmpty) {
      const subtitleCount = this.getSubtitles().filter(({isError}) => !isError).length;
      this.captionsButton.style.display = subtitleCount > 0 ? '' : 'none';
      this.setControlsSize();
    }
  },

  /**
   * Draw the chapters menu.
   */
  drawChapters (chapterTrackId) {
    const
      t = this,
      chapter = this.node.textTracks.getTrackById(chapterTrackId),
      numberOfChapters = chapter.cues.length
    ;

    if (!numberOfChapters) {
      return;
    }

    t.chaptersButton.querySelector('ul').innerHTML = '';

    for (let i = 0; i < numberOfChapters; i++) {
      t.chaptersButton.querySelector('ul').innerHTML += `<li class="${t.options.classPrefix}chapters-selector-list-item" ` +
        `role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false">` +
        `<input type="radio" class="${t.options.classPrefix}captions-selector-input" ` +
        `name="${t.id}_chapters" id="${t.id}_chapters_${i}" value="${chapter.cues[i].startTime}" disabled>` +
        `<label class="${t.options.classPrefix}chapters-selector-label"`+
        `for="${t.id}_chapters_${i}">${chapter.cues[i].text}</label>` +
        `</li>`;
    }

    const
      radios = t.chaptersButton.querySelectorAll('input[type="radio"]'),
      labels = t.chaptersButton.querySelectorAll(`.${t.options.classPrefix}chapters-selector-label`)
    ;

    for (let i = 0; i < radios.length; i++) {
      radios[i].disabled = false;
      radios[i].checked = false;
      radios[i].addEventListener('click',  function (e) {
        const
          self = this,
          listItems = t.chaptersButton.querySelectorAll('li'),
          label = siblings(self, (el) => hasClass(el, `${t.options.classPrefix}chapters-selector-label`))[0]
        ;

        self.checked = true;
        self.parentNode.setAttribute('aria-checked', true);
        addClass(label, `${t.options.classPrefix}chapters-selected`);
        removeClass(t.chaptersButton.querySelector(`.${t.options.classPrefix}chapters-selected`), `${t.options.classPrefix}chapters-selected`);

        for (let i = 0; i < listItems.length; i++) {
          listItems[i].setAttribute('aria-checked', false);
        }

        const keyboard = e.keyCode || e.which;
        if (typeof keyboard === 'undefined') {
          setTimeout(function() {
            t.getElement(t.container).focus();
          }, 500);
        }

        t.media.setCurrentTime(parseFloat(self.value));
        if (t.media.paused) {
          t.media.play();
        }
      });
    }

    for (let i = 0; i < labels.length; i++) {
      labels[i].addEventListener('click',  function (e) {
        const
          radio = siblings(this, (el) => el.tagName === 'INPUT')[0],
          event = createEvent('click', radio)
        ;
        radio.dispatchEvent(event);
        e.preventDefault();
      });
    }
  },

  /**
   * Get a track object using its id.
   * @param {string} trackId
   * @returns {object|undefined} The track object with the given id or undefined if it doesn't exist.
   */
  getTrackById(trackId) {
    return this.tracks.find(track => track.trackId === trackId);
  },

  /**
   * Fetch all chapter tracks.
   * @returns {object[]} Array containing all track of type "chapters"
   */
  getChapters() {
    return this.tracks.filter(({kind}) => kind === 'chapters');
  },

  /**
   * Fetch all subtitle/captions tracks.
   * @returns {object[]} Array containing all track of type "subtitles"/"captions".
   */
  getSubtitles() {
    return this.tracks.filter(({kind}) => kind === 'subtitles' || kind === 'captions');
  },

  /**
   * Perform binary search to look for proper track index
   *
   * @param {Object[]} tracks
   * @param {Number} currentTime
   * @return {Number}
   */
  searchTrackPosition (tracks, currentTime) {
    let
      lo = 0,
      hi = tracks.length - 1,
      mid,
      start,
      stop
    ;

    while (lo <= hi) {
      mid = ((lo + hi) >> 1);
      start = tracks[mid].start;
      stop = tracks[mid].stop;

      if (currentTime >= start && currentTime < stop) {
        return mid;
      } else if (start < currentTime) {
        lo = mid + 1;
      } else if (start > currentTime) {
        hi = mid - 1;
      }
    }

    return -1;
  }
});

/**
 * Map all possible languages with their respective code
 *
 * @constructor
 */
mejs.language = {
  codes: {
    af: 'mejs.afrikaans',
    sq: 'mejs.albanian',
    ar: 'mejs.arabic',
    be: 'mejs.belarusian',
    bg: 'mejs.bulgarian',
    ca: 'mejs.catalan',
    zh: 'mejs.chinese',
    'zh-cn': 'mejs.chinese-simplified',
    'zh-tw': 'mejs.chines-traditional',
    hr: 'mejs.croatian',
    cs: 'mejs.czech',
    da: 'mejs.danish',
    nl: 'mejs.dutch',
    en: 'mejs.english',
    et: 'mejs.estonian',
    fl: 'mejs.filipino',
    fi: 'mejs.finnish',
    fr: 'mejs.french',
    gl: 'mejs.galician',
    de: 'mejs.german',
    el: 'mejs.greek',
    ht: 'mejs.haitian-creole',
    iw: 'mejs.hebrew',
    hi: 'mejs.hindi',
    hu: 'mejs.hungarian',
    is: 'mejs.icelandic',
    id: 'mejs.indonesian',
    ga: 'mejs.irish',
    it: 'mejs.italian',
    ja: 'mejs.japanese',
    ko: 'mejs.korean',
    lv: 'mejs.latvian',
    lt: 'mejs.lithuanian',
    mk: 'mejs.macedonian',
    ms: 'mejs.malay',
    mt: 'mejs.maltese',
    no: 'mejs.norwegian',
    fa: 'mejs.persian',
    pl: 'mejs.polish',
    pt: 'mejs.portuguese',
    ro: 'mejs.romanian',
    ru: 'mejs.russian',
    sr: 'mejs.serbian',
    sk: 'mejs.slovak',
    sl: 'mejs.slovenian',
    es: 'mejs.spanish',
    sw: 'mejs.swahili',
    sv: 'mejs.swedish',
    tl: 'mejs.tagalog',
    th: 'mejs.thai',
    tr: 'mejs.turkish',
    uk: 'mejs.ukrainian',
    vi: 'mejs.vietnamese',
    cy: 'mejs.welsh',
    yi: 'mejs.yiddish'
  }
};
