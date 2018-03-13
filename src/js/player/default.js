'use strict';

import window from 'global/window';

export default class DefaultPlayer {
	/**
	 *
	 * @param {MediaElementPlayer} player
	 */
	constructor (player) {
		this.media = player.media;
		this.isVideo = player.isVideo;
		this.classPrefix = player.options.classPrefix;
		this.createIframeLayer = () => player.createIframeLayer();
		this.setPoster = (url) => player.setPoster(url);
		return this;
	}

	get paused () {
		return this.media.paused;
	}

	set muted (muted) {
		this.setMuted(muted);
	}

	get muted () {
		return this.media.muted;
	}

	get ended () {
		return this.media.ended;
	}

	get readyState () {
		return this.media.readyState;
	}

	set currentTime (time) {
		this.setCurrentTime(time);
	}

	get currentTime () {
		return this.getCurrentTime();
	}

	get duration () {
		return this.getDuration();
	}
	
	get remainingTime() {
		return (this.getDuration() - this.currentTime());
	}

	set volume (volume) {
		this.setVolume(volume);
	}

	get volume () {
		return this.getVolume();
	}

	set src (src) {
		this.setSrc(src);
	}

	get src () {
		return this.getSrc();
	}

	play () {
		this.media.play();
	}

	pause () {
		this.media.pause();
	}

	load () {
		const t = this;

		if (!t.isLoaded) {
			t.media.load();
		}

		t.isLoaded = true;
	}

	setCurrentTime (time) {
		this.media.setCurrentTime(time);
	}

	getCurrentTime () {
		return this.media.currentTime;
	}

	getDuration () {
		return this.media.getDuration();
	}

	setVolume (volume) {
		this.media.setVolume(volume);
	}

	getVolume () {
		return this.media.getVolume();
	}

	setMuted (value) {
		this.media.setMuted(value);
	}

	setSrc (src) {
		const
			t = this,
			layer = document.getElementById(`${t.media.id}-iframe-overlay`)
		;

		if (layer) {
			layer.remove();
		}

		t.media.setSrc(src);
		t.createIframeLayer();
		if (t.media.renderer !== null && typeof t.media.renderer.getPosterUrl === 'function') {
			t.setPoster(t.media.renderer.getPosterUrl());
		}
	}

	getSrc () {
		return this.media.getSrc();
	}

	canPlayType(type) {
		return this.media.canPlayType(type);
	}
}

window.DefaultPlayer = DefaultPlayer;
