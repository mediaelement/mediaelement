
package htmlelements
{
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.media.Video;
	import flash.media.SoundTransform;
	import flash.utils.Timer;
	import fl.video.*
	
	import FlashMediaElement;
	import HtmlMediaEvent;
	
	public class VideoElement extends Sprite implements IMediaElement 
	{
		private var _currentUrl:String = "";
		private var _autoplay:Boolean = true;
	
        private var _video:VideoPlayer;
		private var _ncManager:NCManager;
		
		private var _soundTransform;
		private var _element:FlashMediaElement;
		private var _oldVolume:Number = 1;
		
		// event values
		private var _duration:Number;
		private var _framerate:Number;
		private var _isPaused:Boolean = false;
		private var _isEnded:Boolean = false;
		private var _isLoaded:Boolean = false;
		private var _volume:Number = 1;
		private var _isMuted:Boolean = false;	
		
		private var _bytesLoaded:Number = 0;
		private var _bytesTotal:Number = 0;		
		private var _bufferedTime:Number = 0;		
		
		
		private var _timer:Timer;
		
		
		public function get video():Video {
			return _video;
		}
		
		
		public function VideoElement(element:FlashMediaElement, autoplay:Boolean) 
		{
			_element = element;
			_autoplay = autoplay;
			
			_video = new VideoPlayer();
			_video.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
			_video.width = _element.stage.stageWidth;			
			_video.height = _element.stage.stageHeight;			
			_ncManager = _video.ncMgr;
			addChild(_video);
			
			
			_video.addEventListener(VideoEvent.READY, videoReadyHandler);
			_video.addEventListener(MetadataEvent.METADATA_RECEIVED, videoMetadataReceivedHandler);
			_video.addEventListener(VideoEvent.COMPLETE, videoCompleteHandler);
			_video.addEventListener(VideoEvent.STATE_CHANGE, videoStateChangeHandler);
			
			
			_timer = new Timer(200);
			_timer.addEventListener("timer", timerHandler);			
		}
		
		private function timerHandler(e:TimerEvent) {

			_bytesLoaded = _video.bytesLoaded;
			_bytesTotal = _video.bytesTotal;
			
			sendEvent(HtmlMediaEvent.TIMEUPDATE);

			trace("bytes", _bytesLoaded, _bytesTotal);

			if (_bytesLoaded < _bytesTotal)
				sendEvent(HtmlMediaEvent.PROGRESS);			
		}
		
		private function videoReadyHandler(e) {
			_isLoaded = true;
			sendEvent(HtmlMediaEvent.LOADED_DATA);			
		}
		
		private function videoMetadataReceivedHandler(e:MetadataEvent) {
			_duration = e.info.duration;
			
			sendEvent(HtmlMediaEvent.LOADED_DATA);			
		}
		
		private function videoCompleteHandler(e) {
			
			sendEvent(HtmlMediaEvent.ENDED);			
		}
		
		private function videoProgressHandler(e) {
			_bytesLoaded = _video.bytesLoaded;
			_bytesTotal = _video.bytesTotal;
			sendEvent(HtmlMediaEvent.PROGRESS);			
		}
		private function videoStateChangeHandler(e) {
			//sendEvent(HtmlMediaEvent.PROGRESS);			
		}
		

		
		// interface members
		public function setSrc(url:String):void {
			if (_isLoaded) {
				// stop and restart
				_video.pause();
			}
					
			_currentUrl = url;			
		}
		
		public function load():void {		
			_video.load(_currentUrl);
			_isLoaded =false;
		}

		public function play():void {		
			
			if (_isLoaded) {
				_video.play();
				_timer.start();
				_isPaused = false;
				_isLoaded = true;
				sendEvent(HtmlMediaEvent.PLAYING);						
			} else {
				// error: play() called without a URL
				_video.play(_currentUrl);
				_timer.start();
				_isPaused = false;
				_isLoaded = true;	
				sendEvent(HtmlMediaEvent.PLAYING);						
			}

		}			
		
		public function pause():void {
			_video.pause();
			_isPaused = true;
			_timer.stop();			
			
			_isPaused = true;
			sendEvent(HtmlMediaEvent.PAUSED);
		}		
		
		public function setCurrentTime(pos:Number):void {
			_video.seek(pos);
			sendEvent(HtmlMediaEvent.SEEKED);
		}
				
		public function setVolume(volume:Number):void {
			_soundTransform = new SoundTransform(volume);
			_video.soundTransform = _soundTransform;
			_volume = volume;
			
			_isMuted = (_volume == 0);
			
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}

		
		public function setMuted(muted:Boolean):void {			
			
			if (_isMuted == muted)
				return;
	
			if (muted) {
				_oldVolume = _video.soundTransform.volume;
				setVolume(0);
			} else {
				setVolume(_oldVolume);
			}
			
			_isMuted = muted;
		}

		
		private function sendEvent(eventName:String) {
			
			// calculate this to mimic HTML5
			_bufferedTime = _bytesLoaded / _bytesTotal + _duration;			
			
			// build JSON
			var values:String = 
							"{duration:" + _duration + 
							",framerate:" + _framerate + 
							",currentTime:" + _video.playheadTime + 
							",muted:" + _isMuted + 
							",paused:" + _isPaused + 
							",ended:" + _isEnded + 
							",volume:" + _volume +
							",bytesTotal:" + _bytesTotal +							
							",bufferedBytes:" + _bytesLoaded +
							",bufferedTime:" + _bufferedTime +
							"}";
			
			_element.sendEvent(eventName, values);			
		}		
	}
}
		
