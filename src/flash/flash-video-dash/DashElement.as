package {

	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.text.*;
	import flash.system.*;
	import flash.external.*;

	import flash.net.URLRequest;
	import flash.utils.Timer;

	import org.osmf.containers.MediaContainer;
	import org.osmf.elements.VideoElement;

	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.MediaPlayer;
	import org.osmf.media.URLResource;
	import org.osmf.media.MediaPlayerState;

	import org.osmf.layout.LayoutMetadata;
	import org.osmf.layout.HorizontalAlign;
	import org.osmf.layout.LayoutMetadata;
	import org.osmf.layout.LayoutTargetEvent;
	import org.osmf.layout.ScaleMode;
	import org.osmf.layout.VerticalAlign;

	import org.osmf.events.*;

	import com.castlabs.dash.DashPluginInfo;

	public class DashElement extends Sprite {

		// Video components
		private var _url:String = "";
		private var _volume:Number = 1;
		private var _position:Number = 0;
		private var _duration:Number = 0;

		// Video status
		private var _isPaused:Boolean = true;
		private var _isLoaded:Boolean = false;
		private var _isEnded:Boolean = false;
		private var _isMuted:Boolean = false;
		private var _isConnected:Boolean = false;

		// Shim
		private var _id:String;
		private var _stageWidth:Number;
		private var _stageHeight:Number;

		private var _contentMediaElement:MediaElement;
		private var _mediaPlayer:MediaPlayer;
		private var _mediaContainer:MediaContainer;
		private var _mediaFactory:DefaultMediaFactory;
		private var _resource:URLResource;


		/**
		 * @constructor
		 */
		public function DashElement ()
		{

			Security.allowDomain(['*']);
			Security.allowInsecureDomain(['*']);

			var flashVars:Object = LoaderInfo(this.root.loaderInfo).parameters;

			_id = flashVars.uid;

			// stage setup
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			_stageWidth = stage.stageWidth;
			_stageHeight = stage.stageHeight;

			// Create a media container & add the MediaElement
			_mediaFactory = new DefaultMediaFactory();
			_mediaFactory.addItem(new DashPluginInfo().getMediaFactoryItemAt(0));

			_mediaContainer = new MediaContainer();
			_mediaContainer.mouseEnabled = true;
			_mediaContainer.clipChildren = true;
			_mediaContainer.width = _stageWidth;
			_mediaContainer.height = _stageHeight;
			addChild(_mediaContainer);

			_mediaPlayer = new MediaPlayer();
			_mediaPlayer.addEventListener(BufferEvent.BUFFER_TIME_CHANGE, onBufferEvent);
			_mediaPlayer.addEventListener(BufferEvent.BUFFERING_CHANGE, onBufferEvent);
			_mediaPlayer.addEventListener(TimeEvent.COMPLETE, onTimeEvent);
			_mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeEvent);
			_mediaPlayer.addEventListener(MediaPlayerStateChangeEvent.MEDIA_PLAYER_STATE_CHANGE, onMediaPlayerStateChangeEvent);
			_mediaPlayer.addEventListener(LoadEvent.BYTES_LOADED_CHANGE, onLoadEvent);
			_mediaPlayer.addEventListener(LoadEvent.BYTES_TOTAL_CHANGE, onLoadEvent);
			_mediaPlayer.addEventListener(LoadEvent.LOAD_STATE_CHANGE, onLoadEvent);

			if (ExternalInterface.available) {

				// Getters
				ExternalInterface.addCallback('get_src', get_src);
				ExternalInterface.addCallback('get_volume',get_volume);
				ExternalInterface.addCallback('get_currentTime', get_currentTime);
				ExternalInterface.addCallback('get_muted', get_muted);
				ExternalInterface.addCallback('get_duration', get_duration);
				ExternalInterface.addCallback('get_paused', get_paused);
				// ExternalInterface.addCallback('get_ended', get_ended);

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

				ExternalInterface.call('console.log', 'FLASH DASH ready', _id);
			}
		}

		public function fire_load():void {

			sendEvent("loadedmetadata");

			if (_url) {
				sendEvent("loadstart");

				_resource = new URLResource(_url);
				_contentMediaElement = _mediaFactory.createMediaElement(_resource);
				_contentMediaElement.smoothing = true;

				_mediaContainer.addMediaElement(_contentMediaElement);
				_isLoaded = true;
				_isPaused = false;

				_mediaPlayer.media = _contentMediaElement;
			}
		}

		public function fire_play():void {

			_isPaused = false;

			_mediaPlayer.play();

			sendEvent("play");
			sendEvent("playing");
		}

		public function fire_pause():void {
			_isPaused = true;

			_mediaPlayer.pause();

			sendEvent("pause");
		}


		private function set_src(value:String = ''):void {
			_url = value;
			_isConnected = false;
			_hasStartedPlaying = false;
			_isLoaded = false;

			if (!_isLoaded) {
				fire_load();
			}
		}
		public function set_paused(paused:Boolean):void {
			if (paused) {
				fire_pause();
			}
		}
		public function set_volume(vol:Number):void {
			_isMuted = (vol == 0);
			_mediaPlayer.volume = vol;
			sendEvent("volumechange");
		}
		public function set_muted(muted:Boolean):void {

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
		public function set_currentTime(pos:Number):void{
			// if(!_isManifestLoaded)
			// 	return;

			sendEvent("seeking");
			_mediaPlayer.seek(pos);
		}


		public function get_src():String {
			return _url;
		}
		public function get_paused():Boolean {
			return _isPaused;
		}
		// public function get_ended():Boolean {
		// 	// return _isEnded;
		// }
		//
		public function get_duration():Number{
			return _duration;
		}
		public function get_muted():Boolean {
			return _isMuted;
		}
		public function get_volume():Number {
			if(_isMuted) {
				return 0;
			} else {
				return _volume;
			}
		}
		public function get_currentTime():Number {
			return _position;
		}

		//
		// Event handlers
		//
		// private function stageClickHandler(e:MouseEvent):void {
		// 	sendEvent("click");
		// }
		// private function stageMouseOverHandler(e:MouseEvent):void {
		// 	//ExternalInterface.call('console.log', 'flash mouseover');
		// 	sendEvent("mouseover");
		// }
		// private function stageMouseLeaveHandler(e:Event):void {
		// 	//ExternalInterface.call('console.log', 'flash mouseout');
		// 	sendEvent("mouseout");
		// 	sendEvent("mouseleave");
		// }

		private function onBufferEvent(event:BufferEvent):void {
			log('onBufferEvent', event.toString());

		}
		private function onTimeEvent(event:TimeEvent):void {
			switch(event.type) {
				case TimeEvent.COMPLETE:
					sendEvent('ended');
					break;

				case TimeEvent.CURRENT_TIME_CHANGE:
					_position = _mediaPlayer.currentTime;
					if (!_duration) {
						_duration = _mediaPlayer.duration;
					}

					sendEvent('timeupdate');
					break;

			}
		}
		private function onMediaPlayerStateChangeEvent(event:MediaPlayerStateChangeEvent):void {
			//log('onMediaPlayerStateChangeEvent', event.toString());
			switch (event.state) {
				case MediaPlayerState.PLAYING:
				case MediaPlayerState.PAUSED:
				case MediaPlayerState.BUFFERING:
				case MediaPlayerState.PLAYBACK_ERROR:
				case MediaPlayerState.LOADING:
				case MediaPlayerState.UNINITIALIZED:
					sendEvent(event.state);
					break;
			}
		}

		private function onLoadEvent(event:LoadEvent):void {
			switch(event.type) {
				case LoadEvent.LOAD_STATE_CHANGE:
					if (_isPaused) {
						//fire_load();
						_mediaPlayer.play();
					}

					break;
			}
		}

		//
		// Utilities
		//
		private function sendEvent(eventName:String):void {
			ExternalInterface.call('__event__' + _id, eventName);
		}

		private function log():void {
			if (ExternalInterface.available) {
				ExternalInterface.call('console.log', arguments);
			} else {
				trace(arguments);
			}

		}

	}

}