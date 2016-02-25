package htmlelements {
	import flash.display.Sprite;
	import flash.media.Video;
	import flash.media.SoundTransform;
	import org.mangui.hls.HLS;
	import org.mangui.hls.HLSSettings;
	import org.mangui.hls.event.HLSEvent;
	import org.mangui.hls.constant.HLSPlayStates;
	import org.mangui.hls.utils.Log;

	public class HLSMediaElement extends Sprite implements IMediaElement {

		private var _element:FlashMediaElement;
		private var _playqueued:Boolean = false;
		private var _autoplay:Boolean = true;
		private var _preload:String = "";
		private var _hls:HLS;
		private var _url:String;
		private var _video:Video;
		private var _hlsState:String = HLSPlayStates.IDLE;

		// event values
		private var _position:Number = 0;
		private var _duration:Number = 0;
		private var _framerate:Number;
		private var _isManifestLoaded:Boolean = false;
		private var _isPaused:Boolean = true;
		private var _isEnded:Boolean = false;
		private var _volume:Number = 1;
		private var _isMuted:Boolean = false;

		private var _bytesLoaded:Number = 0;
		private var _bytesTotal:Number = 0;
		private var _bufferedTime:Number = 0;
		private var _bufferEmpty:Boolean = false;
		private var _bufferingChanged:Boolean = false;
		private var _seekOffset:Number = 0;


		private var _videoWidth:Number = -1;
		private var _videoHeight:Number = -1;

		public function HLSMediaElement(element:FlashMediaElement, autoplay:Boolean, preload:String, timerRate:Number, startVolume:Number) {
			_element = element;
			_autoplay = autoplay;
			_volume = startVolume;
			_preload = preload;
			_video = new Video();
			addChild(_video);
			//HLSSettings.logDebug = true;
			_hls = new HLS();
			_hls.addEventListener(HLSEvent.PLAYBACK_COMPLETE,_completeHandler);
			_hls.addEventListener(HLSEvent.ERROR,_errorHandler);
			_hls.addEventListener(HLSEvent.MANIFEST_LOADED,_manifestHandler);
			_hls.addEventListener(HLSEvent.MEDIA_TIME,_mediaTimeHandler);
			_hls.addEventListener(HLSEvent.PLAYBACK_STATE,_stateHandler);
			_hls.addEventListener(HLSEvent.FRAGMENT_PLAYING,_fragmentHandler);
			_hls.stream.soundTransform = new SoundTransform(_volume);
			_video.attachNetStream(_hls.stream);
		}

		private function _completeHandler(event:HLSEvent):void {
			_isEnded = true;
			_isPaused = true;
			sendEvent(HtmlMediaEvent.PAUSE);
			sendEvent(HtmlMediaEvent.ENDED);
		};

		private function _errorHandler(event:HLSEvent):void {
			_element.logMessage(event.toString());
		};

		private function _fragmentHandler(event:HLSEvent):void {
			sendEvent(HtmlMediaEvent.FRAGMENT_PLAYING);
		};

		private function _manifestHandler(event:HLSEvent):void {
			_duration = event.levels[0].duration;
			_videoWidth = event.levels[0].width;
			_videoHeight = event.levels[0].height;
			_isManifestLoaded = true;
			_hls.stage = _video.stage;
			sendEvent(HtmlMediaEvent.LOADEDMETADATA);
			sendEvent(HtmlMediaEvent.CANPLAY);
			if(_autoplay || _playqueued) {
				_playqueued = false;
				_hls.stream.play();
			}
		};

		private function _mediaTimeHandler(event:HLSEvent):void {
			_position = event.mediatime.position;
			_duration = event.mediatime.duration;
			_bufferedTime = event.mediatime.buffer+event.mediatime.position;
			sendEvent(HtmlMediaEvent.PROGRESS);
			sendEvent(HtmlMediaEvent.TIMEUPDATE);
		};

		private function _stateHandler(event:HLSEvent):void {
			_hlsState = event.state;
			//Log.txt("state:"+ _hlsState);
			switch(event.state) {
				case HLSPlayStates.IDLE:
					break;
				case HLSPlayStates.PAUSED_BUFFERING:
				case HLSPlayStates.PLAYING_BUFFERING:
					_isPaused = true;
					sendEvent(HtmlMediaEvent.BUFFERING);
					break;
				case HLSPlayStates.PLAYING:
					_isPaused = false;
					_isEnded = false;
					_video.visible = true;
					sendEvent(HtmlMediaEvent.LOADEDDATA);
					sendEvent(HtmlMediaEvent.PLAY);
					sendEvent(HtmlMediaEvent.PLAYING);
					break;
				case HLSPlayStates.PAUSED:
					_isPaused = true;
					_isEnded = false;
					sendEvent(HtmlMediaEvent.PAUSE);
					sendEvent(HtmlMediaEvent.CANPLAY);
					break;
			}
		};

		public function get video():Video {
			return _video;
		}

		public function get videoHeight():Number {
			return _videoHeight;
		}

		public function get videoWidth():Number {
			return _videoWidth;
		}

		public function play():void {
			//Log.txt("HLSMediaElement:play");
			if(!_isManifestLoaded) {
				_playqueued = true;
				return;
			}
			if (_hlsState == HLSPlayStates.PAUSED || _hlsState == HLSPlayStates.PAUSED_BUFFERING) {
				_hls.stream.resume();
			} else {
				_hls.stream.play();
			}
		}

		public function pause():void {
			if(!_isManifestLoaded)
				return;
			//Log.txt("HLSMediaElement:pause");
			_hls.stream.pause();
		}

		public function load():void{
			//Log.txt("HLSMediaElement:load");
			if(_url) {
				sendEvent(HtmlMediaEvent.LOADSTART);
				_hls.load(_url);
			}
		}

		public function stop():void{
			_hls.stream.close();
			_video.clear();
			_isManifestLoaded = false;
			_duration = 0;
			_position = 0;
			_playqueued = false;
			sendEvent(HtmlMediaEvent.STOP);
		}

		public function setSrc(url:String):void{
			//Log.txt("HLSMediaElement:setSrc:"+url);
			stop();
			_url = url;
			_hls.load(_url);
		}

		public function setSize(width:Number, height:Number):void{
			_video.width = width;
			_video.height = height;
		}

		public function setCurrentTime(pos:Number):void{
			if(!_isManifestLoaded)
				return;
			sendEvent(HtmlMediaEvent.SEEKING);
			_hls.stream.seek(pos);
		}

		public function setVolume(vol:Number):void{
			_volume = vol;
			_isMuted = (_volume == 0);
			_hls.stream.soundTransform = new SoundTransform(vol);
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}

		public function getVolume():Number {
			if(_isMuted) {
				return 0;
			} else {
				return _volume;
			}
		}

		public function setMuted(muted:Boolean):void {
			// ignore if no change
			if (muted === _isMuted)
				return;

			_isMuted = muted;

			if (muted) {
				_hls.stream.soundTransform = new SoundTransform(0);
				sendEvent(HtmlMediaEvent.VOLUMECHANGE);
			} else {
				setVolume(_volume);
			}
		}

		public function duration():Number{
			return _duration;
		}

		public function currentTime():Number{
			return _position;
		}

		public function seekLimit():Number {
			return _duration;
		}

		public function currentProgress():Number {
			var progress:Number = 0;
			if (_duration != 0) {
				progress = Math.round( (_bufferedTime / _duration) * 100 );
			}
			return progress;
		}

		private function sendEvent(eventName:String):void {
			// build JSON
			var values:String =
				"duration:" + _duration +
				",framerate:" + _hls.stream.currentFPS +
				",currentTime:" + _position +
				",muted:" + _isMuted +
				",paused:" + _isPaused +
				",ended:" + _isEnded +
				",volume:" + _volume +
				",src:\"" + _url + "\"" +
				",bytesTotal:" + Math.round(1000*_duration) +
				",bufferedBytes:" + Math.round(1000*(_position+_bufferedTime)) +
				",bufferedTime:" + _bufferedTime +
				",videoWidth:" + _videoWidth +
				",videoHeight:" + _videoHeight +
				"";
			_element.sendEvent(eventName, values);
		}

	}
}
