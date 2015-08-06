package htmlelements
{
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.media.Video;
	import flash.media.SoundTransform;
	import flash.utils.Timer;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.net.URLRequestMethod;
	import flash.display.MovieClip;
	import flash.display.Loader;
	import flash.display.DisplayObject;
	import FlashMediaElement;
	import HtmlMediaEvent;

	public class DailyMotionElement extends Sprite implements IMediaElement
	{
		private var _currentUrl:String = "";
		private var _autoplay:Boolean = true;
		private var _preload:String = "";
		
		private var _element:FlashMediaElement;

		// event values
		private var _currentTime:Number = 0;
		private var _duration:Number = 0;
		private var _framerate:Number;
		private var _isPaused:Boolean = true;
		private var _isEnded:Boolean = false;
		private var _volume:Number = 1;
		private var _isMuted:Boolean = false;

		private var _bytesLoaded:Number = 0;
		private var _bytesTotal:Number = 0;
		private var _bufferedTime:Number = 0;
		private var _bufferEmpty:Boolean = false;

		private var _videoWidth:Number = -1;
		private var _videoHeight:Number = -1;

		private var _timer:Timer;
		
		// DailyMotion stuff
		private var _playerLoader:Loader;
		private var _player:DisplayObject = null;
		private var _playerIsLoaded:Boolean = false;
		private var _dailyMotionId:String = "";
		
		//http://code.google.com/p/gdata-samples/source/browse/trunk/ytplayer/actionscript3/com/google/youtube/examples/AS3Player.as
		private static const WIDESCREEN_ASPECT_RATIO:String = "widescreen";
		private static const QUALITY_TO_PLAYER_WIDTH:Object = {
			small: 320,
			medium: 640,
			large: 854,
			hd720: 1280
		};
		private static const STATE_ENDED:Number = 0;
		private static const STATE_PLAYING:Number = 1;
		private static const STATE_PAUSED:Number = 2;
		private static const STATE_CUED:Number = 5;
		

		public function get player():DisplayObject {
			return _player;
		}
		
		public function seekLimit():Number {
			return NaN;
		}		

		public function setSize(width:Number, height:Number):void {
			if (player != null) {
				player.setSize(width, height);
			} else {
				initHeight = height;
				initWidth = width;
			}
		}

		public function get videoHeight():Number {
			return _videoHeight;
		}

		public function get videoWidth():Number {
			return _videoWidth;
		}


		public function duration():Number {
			return _duration;
		}
		
		public function currentProgress():Number {
			if(_bytesTotal> 0) {
				return Math.round(_bytesLoaded/_bytesTotal*100);
			} else {
				return 0;
			}
		}

		public function currentTime():Number {
			return _currentTime;
		}


		public var initHeight:Number;
		public var initWidth:Number;

		// (1) load()
		// calls _connection.connect();
		// waits for NetConnection.Connect.Success
		// _stream gets created

		private var _isChromeless:Boolean = false;


		public function DailyMotionElement(element:FlashMediaElement, autoplay:Boolean, preload:String, timerRate:Number, startVolume:Number):void
		{
			_element = element;
			_autoplay = autoplay;
			_volume = startVolume;
			_preload = preload;
			initHeight = 0;
			initWidth = 0;

			_playerLoader = new Loader();
			_playerLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, playerLoaderInitHandler);

			// chromeless
			if (_isChromeless) {
				_playerLoader.load(new URLRequest("//www.dailymotion.com/swf?enableApi=1&chromeless=1"));
			}

			_timer = new Timer(timerRate);
			_timer.addEventListener("timer", timerHandler);
			_timer.start();
		}

		private function playerLoaderInitHandler(event:Event):void {

			trace("dm player init");

			_element.addChild(_playerLoader.content);
			_element.setControlDepth();
			_playerLoader.content.addEventListener("onReady", onPlayerReady);
			_playerLoader.content.addEventListener("onError", onPlayerError);
			_playerLoader.content.addEventListener("onStateChange", onPlayerStateChange);
			_playerLoader.content.addEventListener("onPlaybackQualityChange", onVideoPlaybackQualityChange);
		}
		
		private function onPlayerReady(event:Event):void {
			_playerIsLoaded = true;

			_player = _playerLoader.content;

			if (initHeight > 0 && initWidth > 0)
				setSize(initWidth, initHeight);

			if (_dailyMotionId != "") { //  && _isChromeless) {
				if (_autoplay) {
					player.loadVideoById(_dailyMotionId);
				} else {
					player.cueVideoById(_dailyMotionId);
				}
				_timer.start();
			}
		}

		private function onPlayerError(event:Event):void {
			// trace("Player error:", Object(event).data);
		}

		private function onPlayerStateChange(event:Event):void {
			trace("State is", Object(event).data);

			_duration = player.getDuration();

			switch (Object(event).data) {
				case STATE_ENDED:
					_isEnded = true;
					_isPaused = false;

					sendEvent(HtmlMediaEvent.ENDED);

					break;

				case STATE_PLAYING:
					_isEnded = false;
					_isPaused = false;

					sendEvent(HtmlMediaEvent.PLAY);
					sendEvent(HtmlMediaEvent.PLAYING);
					break;

				case STATE_PAUSED:
					_isEnded = false;
					_isPaused = true;

					sendEvent(HtmlMediaEvent.PAUSE);

					break;

				case STATE_CUED:
					sendEvent(HtmlMediaEvent.CANPLAY);

					// resize?

					break;
			}
		}

		private function onVideoPlaybackQualityChange(event:Event):void {
			trace("Current video quality:", Object(event).data);
			//resizePlayer(Object(event).data);
		}

		private function timerHandler(e:TimerEvent):void {

			if (_playerIsLoaded) {
				_bytesLoaded = player.getVideoBytesLoaded();
				_bytesTotal = player.getVideoBytesTotal();
				_currentTime = player.getCurrentTime();

				if (!_isPaused)
					sendEvent(HtmlMediaEvent.TIMEUPDATE);

				if (_bytesLoaded < _bytesTotal)
					sendEvent(HtmlMediaEvent.PROGRESS);
			}

		}

		private function getDailyMotionId(url:String):String {
			// http://www.dailymotion.com/video/VIDEOID_SOME_JUNK_FOR_SEO_ONLY
			// http://www.dailymotion.com/video/VIDEOID
			// http://dai.ly/VIDEOID

			var dailyMotionId:String = "";
			url = unescape(url);

			// remove any querystring elements
			var parts:Array = url.split('?');
			url = parts[0];
			dailyMotionId = url.substring(url.lastIndexOf("/")+1);

			// remove any junk seo stuff at the end
			var parts2:Array = dailyMotionId.split('_');
			dailyMotionId = parts2[0];

			return dailyMotionId;
		}


		// interface members
		public function setSrc(url:String):void {
			trace("dm setSrc()" + url );

			_currentUrl = url;

			_dailyMotionId = getDailyMotionId(url);

			if (!_playerIsLoaded && !_isChromeless) {
				_playerLoader.load(new URLRequest("//www.dailymotion.com/swf/" + _dailyMotionId + "?enableApi=1&chromeless=1"));
			}
		}

		public function load():void {
			// do nothing
			trace("dm load()");

			if (_playerIsLoaded) {
				player.loadVideoById(_dailyMotionId);
				_timer.start();
			}  else {
				/*
				if (!_isChromless && _dailyMotionId != "") {
					_playerLoader.load(new URLRequest("//www.dailymotion.com/swf/" + _dailyMotionId + "?enableApi=1&chromeless=1"));
				}
				*/
			}
		}

		public function play():void {
			if (_playerIsLoaded) {
				player.playVideo();
			}

		}

		public function pause():void {
			if (_playerIsLoaded) {
				player.pauseVideo();
			}
		}

		public function stop():void {
			if (_playerIsLoaded) {
				player.pauseVideo();
			}
		}

		public function setCurrentTime(pos:Number):void {
			player.seekTo(pos);
		}

		public function setVolume(volume:Number):void {
			player.setVolume(volume*100);
			_volume = volume;
		}

		public function getVolume():Number {
			return player.getVolume()*100;
		}

		public function setMuted(muted:Boolean):void {
			if (muted) {
				player.mute();

			} else {
				player.unMute();
			}
			_isMuted = _player.isMuted();
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}


		private function sendEvent(eventName:String):void {

			// calculate this to mimic HTML5
			_bufferedTime = _bytesLoaded / _bytesTotal * _duration;

			// build JSON
			var values:String =
							"duration:" + _duration +
							",framerate:" + _framerate +
							",currentTime:" + _currentTime +
							",muted:" + _isMuted +
							",paused:" + _isPaused +
							",ended:" + _isEnded +
							",volume:" + _volume +
							",src:\"" + _currentUrl + "\"" +
							",bytesTotal:" + _bytesTotal +
							",bufferedBytes:" + _bytesLoaded +
							",bufferedTime:" + _bufferedTime +
							",videoWidth:" + _videoWidth +
							",videoHeight:" + _videoHeight +
							"";

			_element.sendEvent(eventName, values);
		}
	}
}
