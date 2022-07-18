package {

	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.system.*;
	import flash.external.*;

	import org.osmf.containers.MediaContainer;
	import org.osmf.elements.VideoElement;

	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.MediaPlayer;
	import org.osmf.media.URLResource;
	import org.osmf.media.MediaPlayerState;

	import org.osmf.traits.DisplayObjectTrait;
	import org.osmf.traits.MediaTraitType;
	import org.osmf.traits.TimeTrait;

	import org.osmf.events.TimeEvent;
	import org.osmf.events.MediaPlayerStateChangeEvent;
	import org.osmf.events.MediaErrorEvent;
	import org.osmf.events.MediaElementEvent;

	import com.castlabs.dash.DashPluginInfo;

	/**
	 * @constructor
	 */
	public class DashMediaElement extends Sprite {

		// Video components
		private var _url: String = "";
		private var _volume: Number = 1;
		private var _position: Number = 0;
		private var _duration: Number = 0;
		private var _autoplay: Boolean = false;
		private var _readyState:Number = 0;

		// Video status
		private var _isPaused: Boolean = true;
		private var _isLoaded: Boolean = false;
		private var _isEnded: Boolean = false;
		private var _isMuted: Boolean = false;
		private var _isConnected: Boolean = false;

		// Shim
		private var _id: String;
		private var _stageWidth: Number;
		private var _stageHeight: Number;
		private var _videoWidth: Number = -1;
		private var _videoHeight: Number = -1;

		private var _contentMediaElement: MediaElement;
		private var _mediaPlayer: MediaPlayer;
		private var _mediaContainer: MediaContainer;
		private var _mediaFactory: DefaultMediaFactory;
		private var _resource: URLResource;

		/**
		 * @constructor
		 */
		public function DashMediaElement() {

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
			stage.addEventListener(MouseEvent.MOUSE_DOWN, stageClickHandler);
			stage.addEventListener(MouseEvent.MOUSE_OVER, stageMouseOverHandler);
			stage.addEventListener(Event.MOUSE_LEAVE, stageMouseLeaveHandler);
			stage.addEventListener(Event.RESIZE, fire_setSize);

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
			_mediaPlayer.autoPlay = false;
			_mediaPlayer.addEventListener(TimeEvent.COMPLETE, onTimeEvent);
			_mediaPlayer.addEventListener(TimeEvent.CURRENT_TIME_CHANGE, onTimeEvent);
			_mediaPlayer.addEventListener(MediaPlayerStateChangeEvent.MEDIA_PLAYER_STATE_CHANGE, onMediaPlayerStateChangeEvent);
			_mediaPlayer.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaErrorEvent);

			if (ExternalInterface.available) {

				// Getters
				ExternalInterface.addCallback('get_src', get_src);
				ExternalInterface.addCallback('get_volume', get_volume);
				ExternalInterface.addCallback('get_currentTime', get_currentTime);
				ExternalInterface.addCallback('get_muted', get_muted);
				ExternalInterface.addCallback('get_duration', get_duration);
				ExternalInterface.addCallback('get_paused', get_paused);
				ExternalInterface.addCallback('get_ended', get_ended);
				ExternalInterface.addCallback('get_buffered', get_buffered);
				ExternalInterface.addCallback('get_readyState', get_readyState);

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
				ExternalInterface.addCallback('fire_setSize', fire_setSize);

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

				_resource = new URLResource(_url);
				_contentMediaElement = _mediaFactory.createMediaElement(_resource);

				if (_contentMediaElement) {
					_contentMediaElement.smoothing = true;
					_contentMediaElement.addEventListener(MediaElementEvent.TRAIT_ADD, onMediaElementEvent);
					_contentMediaElement.addEventListener(MediaElementEvent.METADATA_ADD, onMediaElementEvent);
					_contentMediaElement.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaErrorEvent);

					if (_mediaPlayer.media != null) {
						_mediaContainer.removeMediaElement(_mediaPlayer.media);
					}

					_mediaContainer.addMediaElement(_contentMediaElement);
					sendEvent("canplay");

					_isLoaded = true;
					_isPaused = !_autoplay;

					_mediaPlayer.media = _contentMediaElement;
					_mediaPlayer.load();

					if (_autoplay) {
						fire_play();
					}
				} else {
					sendEvent('error', 'Error creating media');
				}
			}
		}
		private function fire_play(): void {

			_isPaused = false;
			_mediaPlayer.play();
			sendEvent("play");
			sendEvent("playing");
		}
		private function fire_pause(): void {
			_isPaused = true;
			_mediaPlayer.pause();
			sendEvent("pause");
		}
		private function fire_setSize(width: Number=-1, height: Number=-1): void {
			// var fill:Boolean = false;
			var contWidth:Number;
			var contHeight:Number;
			// var stageRatio:Number;
			// var nativeRatio:Number;

			_mediaContainer.x = 0;
			_mediaContainer.y = 0;
			contWidth = stage.stageWidth;
			contHeight = stage.stageHeight;

			if(width == -1){
				width = contWidth;
			}

			if(height == -1) {
				height = contHeight;
			}

			// if (width <= 0 || height <= 0) {
			// 	fill = true;
			// }

			_mediaContainer.width = width;
			_mediaContainer.height = height;

			// if (fill) {
			// 	_mediaContainer.width = width;
			// 	_mediaContainer.height = height;
			// } else {
			// 	stageRatio = contWidth/contHeight;
			// 	nativeRatio = _videoWidth/_videoHeight;
			//
			// 	// adjust size and position
			// 	if (nativeRatio > stageRatio) {
			// 		_mediaContainer.width = contWidth;
			// 		_mediaContainer.height =  _videoHeight * contWidth / _videoWidth;
			// 		_mediaContainer.y = contHeight/2 - _mediaContainer.height/2;
			// 	} else if (stageRatio > nativeRatio) {
			// 		_mediaContainer.width = _videoWidth * contHeight / _videoHeight;
			// 		_mediaContainer.height =  contHeight;
			// 		_mediaContainer.x = contWidth/2 - _mediaContainer.width/2;
			// 	} else if (stageRatio == nativeRatio) {
			// 		_mediaContainer.width = contWidth;
			// 		_mediaContainer.height = contHeight;
			// 	}
			// }
		}

		//
		// Setters
		//
		private function set_src(value: String = ''): void {
			_url = value;
			_isConnected = false;
			_isLoaded = false;

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
		private function get_readyState():Number {
			return _readyState;
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
					sendEvent("play");
					sendEvent("playing");
					break;

				case MediaPlayerState.PAUSED:
					_isPaused = true;
					_isEnded = false;
					sendEvent("pause");
					break;
			}
		}
		private function onMediaElementEvent(event: MediaElementEvent): void {
			switch (event.type) {
				case MediaElementEvent.METADATA_ADD:
					sendEvent('loadedmetadata');
					_readyState = 4;
					break;

				case MediaElementEvent.TRAIT_ADD:
					switch (event.traitType) {

						case MediaTraitType.TIME:
							if (_mediaPlayer.media.getTrait(MediaTraitType.TIME) != null) {
								var tt:TimeTrait = _mediaPlayer.media.getTrait(MediaTraitType.TIME) as TimeTrait;
								_duration = tt.duration;
								_position = tt.currentTime;
								sendEvent('progress');
								sendEvent('timeupdate');
							}
							break;

						case MediaTraitType.DISPLAY_OBJECT:
							if (_mediaPlayer.media.getTrait(MediaTraitType.DISPLAY_OBJECT) != null) {
								var dt: DisplayObjectTrait = _mediaPlayer.media.getTrait(MediaTraitType.DISPLAY_OBJECT) as DisplayObjectTrait;
								if (dt.mediaWidth != -1 && !isNaN(dt.mediaWidth)) {
									_videoWidth = dt.mediaWidth;
								}
								if (dt.mediaHeight != -1 && !isNaN(dt.mediaHeight)) {
									_videoHeight = dt.mediaHeight;
								}

								fire_setSize();
							}
							break;
					}
					break;
			}
		}
		private function onMediaErrorEvent(event: MediaErrorEvent): void {
			sendEvent('error', event.type + ': ' + event.message);
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
		private function sendEvent(eventName: String): void {
			ExternalInterface.call('__event__' + _id, eventName);
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