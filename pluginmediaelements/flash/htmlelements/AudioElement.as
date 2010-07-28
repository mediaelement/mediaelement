
package htmlelements 
{
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.TimerEvent;
	import flash.media.ID3Info;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundLoaderContext;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.utils.Timer;


	
	/**
	* ...
	* @author DefaultUser (Tools -> Custom Arguments...)
	*/
	public class AudioElement implements IMediaElement
	{		
		
		private var _sound:Sound;
		private var _soundTransform:SoundTransform;
		private var _soundChannel:SoundChannel;
		private var _soundLoaderContext:SoundLoaderContext;								
				
		private var _volume:Number = 1;				
		private var _preMuteVolume:Number = 0;				
		private var _isMuted:Boolean = false;
		private var _isPaused:Boolean = false;
		private var _isEnded:Boolean = false;		
		private var _isLoaded:Boolean = false;		
		private var _currentTime:Number = 0;
		private var _duration:Number = 0;
		private var _bytesLoaded:Number = 0;
		private var _bytesTotal:Number = 0;				
		
		private var _currentUrl:String = "";
		private var _autoplay:Boolean = true;
		
		private var _element:FlashMediaElement;
		private var _timer:Timer;
		
		public function AudioElement(element:FlashMediaElement, autoplay:Boolean) 
		{
			_element = element;
			_autoplay = autoplay;
			
			_timer = new Timer(200);
			_timer.addEventListener(TimerEvent.TIMER, timerEventHandler);
			
			_soundTransform = new SoundTransform();
			_soundLoaderContext = new SoundLoaderContext();
		}
		
		// events
		function progressHandler(e:ProgressEvent):void {
			
			_bytesLoaded = e.bytesLoaded;
			_bytesTotal = e.bytesTotal;
			
			sendEvent(HtmlMediaEvent.PROGRESS);
		}
		
		function id3Handler(e:Event):void {
			try {
				var id3:ID3Info = _sound.id3;
				var obj = {
					type:'id3',
					album:id3.album,
					artist:id3.artist,
					comment:id3.comment,
					genre:id3.genre,
					songName:id3.songName,
					track:id3.track,
					year:id3.year
				}
				//_playerCore.sendEvent(PlayerEvent.META,obj);
			} catch (err:Error) {}			
		}
		
		function timerEventHandler(e:TimerEvent) {
			_currentTime = _soundChannel.position/1000;			
			
			// calculate duration
			var duration = Math.round(_sound.length * _sound.bytesTotal/_sound.bytesLoaded/100) / 10;
			
			// check to see if the estimated duration changed
			if (_duration != duration && !isNaN(duration)) {
				
				_duration = duration;
				sendEvent(HtmlMediaEvent.LOADEDMETADATA);
			}
			
			// send timeupdate
			sendEvent(HtmlMediaEvent.TIMEUPDATE);
		}
		
		function soundCompleteHandler(e:Event) {
			_timer.stop();
			_currentTime = 0;
			_isEnded = true;
		
			sendEvent(HtmlMediaEvent.ENDED);
		}
		
		//events
		
		

		public function load(url:String):void {
			_currentUrl = url;
			_isLoaded = false;
			
			if (_autoplay) {
				startLoading();
				play(null);
			}

		}
		
		private function startLoading():void {
			
			_sound = new Sound();
			//sound.addEventListener(IOErrorEvent.IO_ERROR,errorHandler);
			_sound.addEventListener(ProgressEvent.PROGRESS,progressHandler);
			_sound.addEventListener(Event.ID3,id3Handler);						
			_sound.load(new URLRequest(_currentUrl));
						
			//sendEvent(HtmlMediaEvent.LOADING);	
			
			_isLoaded = true;
		}

		// METHODS
		public function setUrl(url:String):void {
			_currentUrl = url;
			_isLoaded = false;
		}		
		public function play(url:String):void {
			
			if (url != null && _currentUrl != url) {
				load(url);
				return;
			}
			
			if (!_isLoaded)
				startLoading();
			
			_timer.stop();
			
			_soundChannel = _sound.play(_currentTime, 0, _soundTransform);
			_soundChannel.removeEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
			_soundChannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);	
			
			_timer.start();
			
			_isPaused = false;			
			sendEvent(HtmlMediaEvent.PLAYING);
		}		
		
		public function pause():void {
			
			_timer.stop();
			_soundChannel.stop();
			
			_isPaused = true;
			sendEvent(HtmlMediaEvent.PAUSED);
		}		
		
		public function setCurrentTime(pos:Number):void {
			_timer.stop();
			_currentTime = pos;
			_soundChannel.stop();
			
			sendEvent(HtmlMediaEvent.SEEKED);
			
			play(null);			
		}
		
		public function stop():void {
			_timer.stop();
			_soundChannel.stop();
		}
		
		public function setVolume(volume:Number):void {
			_soundTransform.volume = volume;
			_soundChannel.soundTransform = _soundTransform;
			
			_volume = volume;
			
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}		
		

		public function setMuted(muted:Boolean):void {
			
			// ignore if already set
			if ( (muted && _isMuted) || (!muted && !_isMuted))
				return;
			
			if (muted) {
				_preMuteVolume = _soundTransform.volume;
				setVolume(0);
			} else {
				setVolume(_preMuteVolume);				
			}
			
			_isMuted = muted;
		}
		
		public function unload():void {
			_sound = null;
			_isLoaded = false;
		}
		
		private function sendEvent(eventName:String) {
			
			// build JSON
			var values:String = "{duration:" + _duration + 
							",currentTime:" + _currentTime + 
							",muted:" + _isMuted + 
							",paused:" + _isPaused + 
							",ended:" + _isEnded + 	
							",volume:" + _volume +
							",loaded:" + _bytesLoaded +
							",total:" + _bytesTotal +									
							"}";
			
			_element.sendEvent(eventName, values);			
		}			
		
	}
	
}