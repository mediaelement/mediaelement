
package htmlelements
{
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.media.Video;
	import flash.media.SoundTransform;
	import flash.utils.Timer;
	
	import FlashMediaElement;
	import HtmlMediaEvent;
	
	public class VideoElement extends Sprite implements IMediaElement 
	{
		private var _currentUrl:String = "";
		private var _autoplay:Boolean = true;
		
        private var _connection:NetConnection;
        private var _stream:NetStream;
        private var _video:Video;
		private var _element:FlashMediaElement;
		private var _soundTransform;
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
			
			_video = new Video();
			_video.width = _element.stage.stageWidth;			
			_video.height = _element.stage.stageHeight;
			addChild(_video);
			
            _connection = new NetConnection();
            _connection.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
            _connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
            _connection.connect(null);	
			
			_timer = new Timer(200);
			_timer.addEventListener("timer", timerHandler);
			
		}
		
		private function timerHandler(e:TimerEvent) {

			_bytesLoaded = _stream.bytesLoaded;
			_bytesTotal = _stream.bytesTotal;
			
			sendEvent(HtmlMediaEvent.TIMEUPDATE);

			trace("bytes", _bytesLoaded, _bytesTotal);

			if (_bytesLoaded < _bytesTotal)
				sendEvent(HtmlMediaEvent.PROGRESS);			
		}
		
		// internal events
        private function netStatusHandler(event:NetStatusEvent):void {
			trace("netStatus", event.info.code);

			switch (event.info.code) {
				
				case "NetStream.Buffer.Empty":
                case "NetStream.Buffer.Full":
					_bytesLoaded = _stream.bytesLoaded;
					_bytesTotal = _stream.bytesTotal;
					
					sendEvent(HtmlMediaEvent.PROGRESS);	
                    break;

				case "NetConnection.Connect.Success":
                    connectStream();
                    break;
                case "NetStream.Play.StreamNotFound":
                    trace("Unable to locate video");
                    break;
					
				// STREAM
                case "NetStream.Play.Start":					
					_isPaused = false;
					sendEvent(HtmlMediaEvent.PLAY);
					_timer.start();
                    break;
					
                case "NetStream.Seek.Notify":
					sendEvent(HtmlMediaEvent.SEEKED);
                    break;					
				
				case "NetStream.Pause.Notify":
					_isPaused = true;
					sendEvent(HtmlMediaEvent.PAUSED);
                    break;			
					
				case "NetStream.Play.Stop":
					_isPaused = false;
					_timer.stop();
					sendEvent(HtmlMediaEvent.ENDED);
                    break;						
				
            }
        }		
		
        private function connectStream():void {
			trace("connectStream");
            _stream = new NetStream(_connection);
            
			_stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler); // same event as connection			
            _stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, asyncErrorHandler);
			
			var customClient:Object = new Object();
			customClient.onMetaData = onMetaDataHandler;
			_stream.client = customClient;

			
            _video.attachNetStream(_stream);          
        }		
		
        private function securityErrorHandler(event:SecurityErrorEvent):void {
            trace("securityErrorHandler: " + event);
        }
		
		private function asyncErrorHandler(event:AsyncErrorEvent):void {
            // ignore AsyncErrorEvent events.
        }
		
		
		private function onMetaDataHandler(info:Object):void {
			_duration = info.duration;
			_framerate = info.framerate;
			
			// set size?			
						
			sendEvent(HtmlMediaEvent.LOADEDMETADATA);
		}
		
		

		
		// interface members
		public function setSrc(url:String):void {
			if (_isLoaded) {
				// stop and restart
				_stream.pause();
			}
			
			_currentUrl = url;			
		}
		
		public function load():void {		
			// there really isn't an equivalent here 		
			_stream.pause();
			_connection.connect(null);
			_isLoaded =false;
		}

		public function play():void {		
			
			if (_isLoaded) {
				_stream.resume();
				_timer.start();
				_isPaused = false;
				_isLoaded = true;
				sendEvent(HtmlMediaEvent.PLAYING);						
			} else {
				// error: play() called without a URL
				_stream.play(_currentUrl);
				_timer.start();
				_isPaused = false;
				_isLoaded = true;	
				sendEvent(HtmlMediaEvent.PLAYING);						
			}

		}			
		
		public function pause():void {
			_stream.pause();
			_isPaused = true;
			_timer.stop();			
			
			_isPaused = true;
			sendEvent(HtmlMediaEvent.PAUSED);
		}		
		
		public function setCurrentTime(pos:Number):void {
			_stream.seek(pos);
			sendEvent(HtmlMediaEvent.SEEKED);
		}
				
		public function setVolume(volume:Number):void {
			_soundTransform = new SoundTransform(volume);
			_stream.soundTransform = _soundTransform;
			_volume = volume;
			
			_isMuted = (_volume == 0);
			
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}

		
		public function setMuted(muted:Boolean):void {			
			
			if (_isMuted == muted)
				return;
	
			if (muted) {
				_oldVolume = _stream.soundTransform.volume;
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
							",currentTime:" + _stream.time + 
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
		
