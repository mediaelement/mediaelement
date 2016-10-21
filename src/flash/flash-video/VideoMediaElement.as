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
	import org.osmf.media.MediaResourceBase;
	import org.osmf.media.PluginInfoResource;

	import org.osmf.events.TimeEvent;
	import org.osmf.events.MediaPlayerStateChangeEvent;
	import org.osmf.events.MediaErrorEvent;

	import org.osmf.net.StreamingURLResource;

	public class VideoMediaElement extends Sprite {

		// Video components
		private var _url: String = "";
		private var _volume: Number = 1;
		private var _position: Number = 0;
		private var _duration: Number = 0;

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

		private var _contentMediaElement: MediaElement;
		private var _mediaPlayer: MediaPlayer;
		private var _mediaContainer: MediaContainer;
		private var _mediaFactory: DefaultMediaFactory;
		private var _resource: *;

		// RTMP stuff
		private var _pseudoStreamingEnabled: Boolean = false;

		/**
		 * @constructor
		 */
		public function VideoMediaElement() {

			Security.allowDomain(['*']);
			Security.allowInsecureDomain(['*']);

			var flashVars: Object = LoaderInfo(this.root.loaderInfo).parameters;

			_id = flashVars.uid;
			_pseudoStreamingEnabled = flashVars.pseudostreamstart != null;

			// stage setup
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.addEventListener(MouseEvent.MOUSE_DOWN, stageClickHandler);
			stage.addEventListener(MouseEvent.MOUSE_OVER, stageMouseOverHandler);
			stage.addEventListener(Event.MOUSE_LEAVE, stageMouseLeaveHandler);

			_stageWidth = stage.stageWidth;
			_stageHeight = stage.stageHeight;

			// Create a media container & add the MediaElement
			_mediaFactory = new DefaultMediaFactory();

			// Add plugin to use pseudo streaming if detected
			// if (_pseudoStreamingEnabled) {
			//     _mediaFactory.loadPlugin(new PluginInfoResource(new PseudostreamingPluginInfo()));
			// }

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
			// _mediaPlayer.addEventListener(MediaPlayerCapabilityChangeEvent.CAN_SEEK_CHANGE, onCanSeekChange);
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

				ExternalInterface.call('__ready__' + _id);
			}

		}

		//
		// Javascript bridged methods
		//
		private function fire_load(): void {

			sendEvent("loadedmetadata");

			if (_url) {

				// if (!_pseudoStreamingEnabled) {
				_resource = new URLResource(_url);
				// } else {
				//     _resource = new StreamingURLResource(url);
				//     _resource.addMetadataValue("pseudostreaming_query", "?start=" + getUrlPosition(0));
				// }

				_contentMediaElement = _mediaFactory.createMediaElement(_resource);

				if (_contentMediaElement) {
					_contentMediaElement.smoothing = true;
					_contentMediaElement.addEventListener(MediaErrorEvent.MEDIA_ERROR, onMediaErrorEvent);

					if (_mediaPlayer.media != null) {
						_mediaContainer.removeMediaElement(_mediaPlayer.media);
					}

					_mediaContainer.addMediaElement(_contentMediaElement);
					sendEvent("canplay");

					_isLoaded = true;
					_isPaused = true;

					_mediaPlayer.media = _contentMediaElement;
					_mediaPlayer.load();
				} else {
					sendEvent('error', 'Media could not be created');
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
			sendEvent("canplay");
		}
		private function fire_setSize(width: Number, height: Number): void {

			_stageWidth = width;
			_stageHeight = height;
			_mediaContainer.layout(_stageWidth, _stageHeight, true);
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
		private function sendEvent(eventName: String, eventMessage:String): void {
			ExternalInterface.call('__event__' + _id, eventName, eventMessage);
		}
		private function log(): void {
			if (ExternalInterface.available) {
				ExternalInterface.call('console.log', arguments);
			} else {
				trace(arguments);
			}

		}

		// private function getUrlPosition(pos: Number): String {
		// 	if (_pseudoStreamingEnabled) {
		// 		return ("byte" == _pseudoStreamingType) ? getBytePosition(pos).toString() : pos.toString();
		// 	}
		// 	return '0';
		// }
		//
		// private function findBytePosition(info:Object):void {
		//     _pseudoStreamingBytePositions.splice(0);
		//
		//     var i:int;
		//
		//     if (info.keyframes) {
		//         for (i=0; i<info.keyframes.times.length; i++) {
		//             var seekpoint:Object = { time:Number, offset:Number };
		//             seekpoint.time = info.keyframes.times[i];
		//             seekpoint.offset = info.keyframes.filepositions[i];
		//
		//             _pseudoStreamingBytePositions.push(seekpoint);
		//         }
		//     }
		//
		//     if (info.seekpoints) {
		//         for (i=0; i<info.seekpoints.length; i++) {
		//             _pseudoStreamingBytePositions.push(info.seekpoints[i]);
		//         }
		//     }
		//
		//     _pseudoStreamingBytePositions.sortOn('time', Array.NUMERIC);
		// }
		//
		// private function getBytePosition(time:Number):Number {
		//     var i:int;
		//
		//     for (i=0; i<_pseudoStreamingBytePositions.length; i++) {
		//         if (_pseudoStreamingBytePositions[i].time >= time && time <= _pseudoStreamingBytePositions[i + 1].time) {
		//             return _pseudoStreamingBytePositions[i].offset;
		//         }
		//     }
		//
		//     return 0;
		// }


	}


}