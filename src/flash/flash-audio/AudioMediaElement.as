package {
	import flash.display.Sprite;
	import flash.display.LoaderInfo;

	import flash.system.Security;
	import flash.external.ExternalInterface;

	import org.osmf.containers.MediaContainer;
	import org.osmf.elements.AudioElement;
	import org.osmf.elements.audio.streaming;

	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.MediaFactory;
	import org.osmf.media.MediaPlayer;
	import org.osmf.media.MediaResourceBase;
	import org.osmf.media.MediaType;
	import org.osmf.media.URLResource;
	import org.osmf.media.MediaPlayerState;

	import org.osmf.net.StreamType;
	import org.osmf.net.StreamingURLResource;

	import org.osmf.events.TimeEvent;
	import org.osmf.events.MediaPlayerStateChangeEvent;
	import org.osmf.events.MediaErrorEvent;


	public class AudioMediaElement extends Sprite {
		// Audio components
		private var _url: String = "";
		private var _volume: Number = 1;
		private var _position: Number = 0;
		private var _duration: Number = 0;

		// Audio status
		private var _isPaused: Boolean = true;
		private var _isLoaded: Boolean = false;
		private var _isEnded: Boolean = false;
		private var _isMuted: Boolean = false;

		// Shim
		private var _id: String;
		private var _mediaPlayer: MediaPlayer;
		private var _mediaContainer: MediaContainer;
		private var _audioElement:AudioElement;
		private var _mediaFactory:DefaultMediaFactory;

		private var _resource:StreamingURLResource;

		// RTMP
		// private var _isRTMP:Boolean = false;

		public function AudioMediaElement() {

			Security.allowDomain(['*']);
			Security.allowInsecureDomain(['*']);

			var flashVars:Object = LoaderInfo(this.root.loaderInfo).parameters;

			_id = flashVars.uid;

			_mediaContainer = new MediaContainer();
			addChild(_mediaContainer);

			_mediaPlayer = new MediaPlayer();
			_mediaPlayer.autoPlay = false;
			_mediaPlayer.addEventListener(TimeEvent.COMPLETE, onTimeEvent);
			_mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeEvent);
			_mediaPlayer.addEventListener(MediaPlayerStateChangeEvent.MEDIA_PLAYER_STATE_CHANGE, onMediaPlayerStateChangeEvent);
			_mediaPlayer.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaErrorEvent);

			if (ExternalInterface.available) {
				ExternalInterface.addCallback('get_src', get_src);
				ExternalInterface.addCallback('get_volume', get_volume);
				ExternalInterface.addCallback('get_currentTime', get_currentTime);
				ExternalInterface.addCallback('get_muted', get_muted);
				ExternalInterface.addCallback('get_duration', get_duration);
				ExternalInterface.addCallback('get_paused', get_paused);
				ExternalInterface.addCallback('get_ended', get_ended);
				ExternalInterface.addCallback('get_buffered', get_buffered);

				// Setters
				ExternalInterface.addCallback('set_src', set_src);
				ExternalInterface.addCallback('set_volume', set_volume);
				ExternalInterface.addCallback('set_currentTime', set_currentTime);
				ExternalInterface.addCallback('set_muted', set_muted);
				ExternalInterface.addCallback('set_paused', set_paused);

				// Methods
				ExternalInterface.addCallback('fire_load', fire_load);
				ExternalInterface.addCallback('fire_play', fire_play);
				ExternalInterface.addCallback('fire_pause', fire_pause);

				ExternalInterface.call('__ready__' + _id);
			}
		}

		//
		// Javascript bridged methods
		//
		private function fire_load(): void {

			sendEvent("loadedmetadata");

			if (!_isLoaded && _url) {

				sendEvent("loadstart");

				_mediaFactory = new DefaultMediaFactory();
				_resource = new StreamingURLResource(_url, StreamType.LIVE_OR_RECORDED);
				_resource.mediaType = MediaType.AUDIO;

				_audioElement = _mediaFactory.createMediaElement(_resource);

				if (_audioElement) {
					_audioElement.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaErrorEvent);
					sendEvent("canplay");

					// _isRTMP = !!_url.match(/^rtmp(s|t|e|te)?\:\/\//);

					_isLoaded = true;
					_isPaused = true;

					_mediaPlayer.media = _audioElement;
				}

			}
		}
		private function fire_play(): void {

			_isPaused = false;

			if (_isLoaded) {
				_mediaPlayer.play();
			}

			sendEvent("play");
			sendEvent("playing");
		}
		private function fire_pause(): void {

			_isPaused = true;

			if (_isLoaded) {
				_mediaPlayer.pause();
			}

			sendEvent("pause");
			sendEvent("canplay");
		}

		//
		// Setters
		//
		private function set_src(value: String = ''): void {
			_url = value;

			if (!_isLoaded) {
				fire_load();
			}
		}
		private function set_paused(paused: Boolean): void {
			if (paused) {
				fire_pause();
			}
		}

		private function set_volume(vol: Number): void {
			_isMuted = (vol == 0);
			_mediaPlayer.volume = vol;
			sendEvent("volumechange");
		}

		private function set_muted(muted: Boolean): void {

			// ignore if no change
			if (muted === _isMuted)
				return;

			_isMuted = muted;

			if (muted) {
				set_volume(0);
			} else {
				set_volume(_volume);
			}
			sendEvent("volumechange");
		}

		private function set_currentTime(pos: Number): void {
			sendEvent("seeking");
			_mediaPlayer.seek(pos);
		}

		//
		// Getters
		//
		private function get_src(): String {
			return _url;
		}

		private function get_paused(): Boolean {
			return _isPaused;
		}

		private function get_ended(): Boolean {
			return _isEnded;
		}

		private function get_duration(): Number {
			return _duration;
		}

		private function get_muted(): Boolean {
			return _isMuted;
		}

		private function get_volume(): Number {
			if (_isMuted) {
				return 0;
			} else {
				return _volume;
			}
		}

		private function get_currentTime(): Number {
			return _position;
		}

		private function get_buffered(): Number {
			var progress: Number = 0;
			if (_duration != 0) {
				progress = Math.round((_mediaPlayer.currentTime / _duration) * 100);
			}
			return progress;
		}

		//
		// Events
		//
		private function onTimeEvent(event: TimeEvent): void {
			switch (event.type) {
				case TimeEvent.COMPLETE:
					_isEnded = true;
					sendEvent('ended');
					break;

				case TimeEvent.CURRENT_TIME_CHANGE:
					_position = _mediaPlayer.currentTime;
					if (!_duration) {
						_duration = _mediaPlayer.duration;
					}

					sendEvent('progress');
					sendEvent('timeupdate');
					break;

			}
		}
		private function onMediaPlayerStateChangeEvent(event: MediaPlayerStateChangeEvent): void {
			switch (event.state) {
				case MediaPlayerState.PLAYING:
					_isPaused = false;
					_isEnded = false;
					sendEvent("loadeddata");
					sendEvent("play");
					sendEvent("playing");
					break;

				case MediaPlayerState.PAUSED:
					_isPaused = true;
					_isEnded = false;
					sendEvent("pause");
					sendEvent("canplay");
					break;
			}
		}
		private function onMediaErrorEvent(event:MediaErrorEvent):void {
			log('error', event.error.name, event.error.detail, event.error.errorID, event.error.message);
			sendEvent("error", event.error.message);
		}

		//
		// Utilities
		//
		private function sendEvent(eventName: String, eventMessage:String = ''): void {
			ExternalInterface.call('__event__' + _id, eventName, eventMessage);
		}
		private function log(): void {
			if (ExternalInterface.available) {
				ExternalInterface.call('console.log', arguments);
			} else {
				trace(arguments);
			}

		}
	}
}