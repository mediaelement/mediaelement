package {

	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.utils.setTimeout;
	import flash.system.*;
	import flash.external.*;

	import org.mangui.hls.HLS;
	import org.mangui.hls.HLSSettings;
	import org.mangui.hls.event.HLSEvent;
	import org.mangui.hls.constant.HLSPlayStates;
	import org.mangui.hls.utils.Log;

	public class HlsMediaElement extends Sprite {

		private var _playqueued: Boolean = false;
		private var _autoplay: Boolean = false;
		private var _hls: HLS;
		private var _url: String;
		private var _video: Video;
		private var _hlsState: String = HLSPlayStates.IDLE;

		private var _position: Number = 0;
		private var _duration: Number = 0;
		private var _isManifestLoaded: Boolean = false;
		private var _isPaused: Boolean = true;
		private var _isEnded: Boolean = false;
		private var _volume: Number = 1;
		private var _isMuted: Boolean = false;
		private var _readyState:Number = 0;

		private var _bufferedTime: Number = 0;
		private var _videoWidth: Number = -1;
		private var _videoHeight: Number = -1;

		private var _id: String;

		private var _stageWidth: Number;
		private var _stageHeight: Number;

		/**
		 * @constructor
		 */
		public function HlsMediaElement() {

			if (isIllegalQuerystring()) {
				return;
			}

			var flashVars: Object = LoaderInfo(this.root.loaderInfo).parameters;

			// Use this for CDN
			if (flashVars.allowScriptAccess == 'always') {
				Security.allowDomain(['*']);
				Security.allowInsecureDomain(['*']);
			}

			_id = flashVars.uid;
			_autoplay = (flashVars.autoplay == true);

			// stage setup
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			_stageWidth = stage.stageWidth;
			_stageHeight = stage.stageHeight;

			stage.addEventListener(MouseEvent.MOUSE_DOWN, stageClickHandler);
			stage.addEventListener(MouseEvent.MOUSE_OVER, stageMouseOverHandler);
			stage.addEventListener(Event.MOUSE_LEAVE, stageMouseLeaveHandler);
			stage.addEventListener(Event.RESIZE, fire_setSize);

			// video setup
			_display = new Sprite();
			addChild(_display);

			_video = new Video();
			(_video as Video).smoothing = true;
			_display.addChild(_video);
			_display.addEventListener(MouseEvent.MOUSE_OVER, stageMouseOverHandler);

			_display.x = _video.x = 0;
			_display.y = _video.y = 0;
			_display.width = _video.width = _stageWidth;
			_display.height = _video.height = _stageHeight;


			// Settings to be overridden for HLS
			HLSSettings.logInfo = false;

			_hls = new HLS();
			_hls.addEventListener(HLSEvent.MANIFEST_LOADED, _manifestHandler);
			_hls.addEventListener(HLSEvent.LEVEL_LOADING, _levelLoadingHandler);
			_hls.addEventListener(HLSEvent.LEVEL_LOADED, _levelLoadedHandler);
			_hls.addEventListener(HLSEvent.LEVEL_SWITCH, _levelSwitchHandler);
			_hls.addEventListener(HLSEvent.LEVEL_ENDLIST, _levelEndlistHandler);
			_hls.addEventListener(HLSEvent.FRAGMENT_LOADING, _fragmentLoadingHandler);
			_hls.addEventListener(HLSEvent.FRAGMENT_LOADED, _fragmentLoadedHandler);
			_hls.addEventListener(HLSEvent.FRAGMENT_PLAYING, _fragmentPlayingHandler);
			_hls.addEventListener(HLSEvent.FRAGMENT_SKIPPED, _fragmentSkippedHandler);
			_hls.addEventListener(HLSEvent.AUDIO_TRACKS_LIST_CHANGE, _audioTracksListChangeHandler);
			_hls.addEventListener(HLSEvent.AUDIO_TRACK_SWITCH, _audioTracksSwitchHandler);
			_hls.addEventListener(HLSEvent.AUDIO_LEVEL_LOADING, _audioLevelLoadingHandler);
			_hls.addEventListener(HLSEvent.AUDIO_LEVEL_LOADED, _audioLevelLoadedHandler);
			_hls.addEventListener(HLSEvent.TAGS_LOADED, _tagsLoadedHandler);
			_hls.addEventListener(HLSEvent.MEDIA_TIME, _mediaTimeHandler);
			_hls.addEventListener(HLSEvent.PLAYBACK_STATE, _stateHandler);
			_hls.addEventListener(HLSEvent.PLAYBACK_COMPLETE, _completeHandler);
			_hls.addEventListener(HLSEvent.SEEK_STATE, _seekHandler);
			_hls.addEventListener(HLSEvent.PLAYLIST_DURATION_UPDATED, _playlistDurationUpdatedHandler);
			_hls.addEventListener(HLSEvent.ID3_UPDATED, _id3UpdatedHandler);
			_hls.addEventListener(HLSEvent.LIVE_LOADING_STALLED, _liveLoadingStalledHandler);
			_hls.addEventListener(HLSEvent.ERROR, _errorHandler);

			_hls.stream.soundTransform = new SoundTransform(_volume);
			_video.attachNetStream(_hls.stream);

			if (ExternalInterface.available) {
				ExternalInterface.addCallback('get_src', get_src);
				ExternalInterface.addCallback('get_volume', get_volume);
				ExternalInterface.addCallback('get_currentTime', get_currentTime);
				ExternalInterface.addCallback('get_muted', get_muted);
				ExternalInterface.addCallback('get_buffered', get_buffered);
				ExternalInterface.addCallback('get_duration', get_duration);
				ExternalInterface.addCallback('get_paused', get_paused);
				ExternalInterface.addCallback('get_ended', get_ended);
				ExternalInterface.addCallback('get_readyState', get_readyState);

				ExternalInterface.addCallback('set_src', set_src);
				ExternalInterface.addCallback('set_volume', set_volume);
				ExternalInterface.addCallback('set_currentTime', set_currentTime);
				ExternalInterface.addCallback('set_muted', set_muted);

				ExternalInterface.addCallback('fire_load', fire_load);
				ExternalInterface.addCallback('fire_play', fire_play);
				ExternalInterface.addCallback('fire_pause', fire_pause);
				ExternalInterface.addCallback('fire_setSize', fire_setSize);
				ExternalInterface.addCallback('fire_stop', fire_stop);

				ExternalInterface.call('(function(){window["__ready__' + _id + '"]()})()', null);
			}
		}

		private function isIllegalQuerystring():Boolean {
			var query:String = '';
			var pos:Number = root.loaderInfo.url.indexOf('?') ;

			if ( pos > -1 ) {
			    query = root.loaderInfo.url.substring( pos );
			    if ( ! /^\?\d+$/.test( query ) ) {
			        return true;
			    }
			}

			return false;
		}

		//
		// Javascript bridged methods
		//
		private function fire_load(): void {
			if (_url) {
				sendEvent("loadstart");
				_hls.load(_url);
			}
		}
		private function fire_play(): void {
			if (!_isManifestLoaded) {
				fire_load();
				return;
			}

			if (_hlsState == HLSPlayStates.PAUSED || _hlsState == HLSPlayStates.PAUSED_BUFFERING) {
				_hls.stream.resume();
			} else {
				_hls.stream.play();
			}

		}
		private function fire_pause(): void {
			if (!_isManifestLoaded) {
				return;
			}
			_hls.stream.pause();
		}
		private function fire_stop(): void {
			_hls.stream.close();
			_video.clear();

			_isManifestLoaded = false;
			_duration = 0;
			_position = 0;
			_playqueued = false;

			sendEvent("stop");
		}
		private function fire_setSize(width: Number=-1, height: Number=-1): void {
			var fill:Boolean = false;
			var contWidth:Number;
			var contHeight:Number;
			var stageRatio:Number;
			var nativeRatio:Number;

			_video.x = 0;
			_video.y = 0;
			contWidth = stage.stageWidth;
			contHeight = stage.stageHeight;

			if(width == -1){
				width = _video.width;
			}
			if(height == -1){
				height = _video.height;
			}

			if (width <= 0 || height <= 0) {
				fill = true;
			}

			if (fill) {
				_video.width = width;
				_video.height = height;
			} else {
				stageRatio = contWidth/contHeight;
				nativeRatio = _videoWidth/_videoHeight;
				// adjust size and position
				if (nativeRatio > stageRatio) {
					_video.width = contWidth;
					_video.height =  _videoHeight * contWidth / _videoWidth;
					_video.y = contHeight/2 - _video.height/2;
				} else if (stageRatio > nativeRatio) {
					_video.width = _videoWidth * contHeight / _videoHeight;
					_video.height =  contHeight;
					_video.x = contWidth/2 - _video.width/2;
				} else if (stageRatio == nativeRatio) {
					_video.width = contWidth;
					_video.height = contHeight;
				}
			}
		}

		//
		// Setters
		//
		private function set_src(url: String): void {
			fire_stop();
			_url = url;
			_hls.load(_url);
		}
		private function set_currentTime(pos: Number): void {
			if (!_isManifestLoaded) {
				return;
			}

			sendEvent("seeking");
			_hls.stream.seek(pos);
		}
		private function set_volume(vol: Number): void {
			_volume = vol;
			_isMuted = (_volume == 0);
			_hls.stream.soundTransform = new SoundTransform(vol);
			sendEvent("volumechange");
		}
		private function set_muted(muted: Boolean): void {
			// ignore if no change
			if (muted === _isMuted) {
				return;
			}

			_isMuted = muted;

			if (muted) {
				_hls.stream.soundTransform = new SoundTransform(0);
			} else {
				set_volume(_volume);
			}
			sendEvent("volumechange");
		}

		//
		// Getters
		//
		private function get_src(): String {
			return _url;
		}
		private function get_currentTime(): Number {
			return _position;
		}
		private function get_volume(): Number {
			return _isMuted ? 0 :_volume;
		}
		private function get_muted(): Boolean {
			return _isMuted;
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
		private function get_buffered(): Number {
			var progress: Number = 0;
			if (_duration != 0) {
				progress = Math.round((_bufferedTime / _duration) * 100);
			}
			return progress;
		}
		private function get_readyState():Number {
			return _readyState;
		}

		//
		// Events
		//
		private function _completeHandler(): void {
			_isEnded = true;
			_isPaused = true;
			sendEvent('ended');
		}
		private function _errorHandler(event: HLSEvent): void {
			sendEvent('error', event.toString());
		}
		private function _levelLoadingHandler(event: HLSEvent): void {
			sendEvent('onLevelLoading', JSON.stringify(event));
		}
		private function _levelLoadedHandler(event: HLSEvent): void {
			sendEvent('onLevelLoaded', JSON.stringify(event.loadMetrics));
		}
		private function _levelSwitchHandler(event: HLSEvent): void {
			sendEvent('onLevelSwitch', JSON.stringify(event));
		}
		private function _levelEndlistHandler(): void {
			sendEvent('onLevelEndlist');
		}
		private function _fragmentLoadingHandler(event: HLSEvent): void {
			sendEvent('onFragmentLoading', JSON.stringify(event));
		}
		private function _fragmentLoadedHandler(event: HLSEvent): void {
			sendEvent('onFragmentLoaded', JSON.stringify(event.loadMetrics));
		}
		private function _fragmentPlayingHandler(event: HLSEvent): void {
			sendEvent('onFragmentPlaying', JSON.stringify(event.playMetrics));
		}
		private function _fragmentSkippedHandler(event: HLSEvent): void {
			sendEvent('onFragmentPlaying', JSON.stringify(event));
		}
		private function _audioTracksListChangeHandler(): void {
			sendEvent('onAudioTracksListChange');
		}
		private function _audioTracksSwitchHandler(): void {
			sendEvent('onAudioTracksSwitch');
		}
		private function _audioLevelLoadingHandler(event: HLSEvent): void {
			sendEvent('onAudioLevelLoading', JSON.stringify(event));
		}
		private function _audioLevelLoadedHandler(event: HLSEvent): void {
			sendEvent('onAudioLevelLoaded', JSON.stringify(event.loadMetrics));
		}
		private function _tagsLoadedHandler(event: HLSEvent): void {
			sendEvent('onTagsLoaded', JSON.stringify(event.loadMetrics));
		}
		private function _seekHandler(event: HLSEvent): void {
			sendEvent('onSeek', JSON.stringify(event));
		}
		private function _playlistDurationUpdatedHandler(event: HLSEvent): void {
			sendEvent('onPlaylistDurationUpdated', JSON.stringify(event));
		}
		private function _id3UpdatedHandler(event: HLSEvent): void {
			sendEvent('onID3Updated', JSON.stringify(event.ID3Data));
		}
		private function _liveLoadingStalledHandler(): void {
			sendEvent('onLiveLoadingStalled');
		}
		private function _manifestHandler(event: HLSEvent): void {
			_duration = event.levels[0].duration;
			_videoWidth = event.levels[0].width;
			_videoHeight = event.levels[0].height;
			_isManifestLoaded = true;
			_hls.stage = _video.stage;

			sendEvent("loadedmetadata");
			sendEvent("canplay");
			_readyState = 4;
			//Set Size on loaded metadata
			fire_setSize();

			if (_playqueued) {
				_playqueued = false;
			}

			if (_autoplay) {
				_hls.stream.play();
			}
			sendEvent('onManifestLoaded', JSON.stringify(event.levels));
		}
		private function _mediaTimeHandler(event: HLSEvent): void {
			_position = event.mediatime.position;
			_duration = event.mediatime.duration;
			_bufferedTime = event.mediatime.buffer + event.mediatime.position;

			var videoWidth:int = _video.videoWidth;
			var videoHeight:int = _video.videoHeight;
			var neverSetted:Boolean = _videoWidth <= 0 || _videoHeight <= 0;
			if (videoWidth && videoHeight && neverSetted) {
				_videoHeight = videoHeight;
				_videoWidth = videoWidth;
				fire_setSize(_videoWidth, _videoHeight);
			}

			if (parseInt(_position) >= parseInt(_duration) && !_isEnded) {
				_isPaused = true;
				_isEnded = true;
				sendEvent("pause");
				sendEvent("ended");
			}

			sendEvent("progress");
			sendEvent("timeupdate");
		}
		private function _stateHandler(event: HLSEvent): void {
			_hlsState = event.state;
			switch (event.state) {
				case HLSPlayStates.PLAYING:
					_isPaused = false;
					_isEnded = false;
					_video.visible = true;
					sendEvent("play");
					sendEvent("playing");
					break;
				case HLSPlayStates.PAUSED:
					_isPaused = true;
					_isEnded = false;
					sendEvent("pause");
					break;
				case HLSPlayStates.IDLE:
					if (parseInt(_position) >= parseInt(_duration) && !_isEnded) {
						_isPaused = true;
						_isEnded = true;
						sendEvent("pause");
						sendEvent("ended");
					}
					break;
			}
		}

		//
		// Event handlers
		//
		private function stageClickHandler(e: MouseEvent): void {
			sendEvent("click");
		}
		private function stageMouseOverHandler(e: MouseEvent): void {
			sendEvent("mouseover");
		}
		private function stageMouseLeaveHandler(e: Event): void {
			sendEvent("mouseout");
			sendEvent("mouseleave");
		}

		//
		// Utilities
		//
		private function sendEvent(eventName: String, data: String = ''): void {
			ExternalInterface.call('(function(){window["__event__' +  _id + '"]("' + eventName + '", \'' + data + '\')})()', null);
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
