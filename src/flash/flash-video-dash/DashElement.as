package {


	import flash.display.Sprite;
	// import flash.display.LoaderInfo;
	// import flash.display.Sprite;
	// import flash.media.Video;
	// import flash.media.SoundTransform;
	// import flash.utils.Timer;
	//
	// import flash.net.NetConnection;
	// import flash.net.NetStream;

	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.text.*;
	import flash.system.*;
	import flash.external.*;

	// import flash.media.Sound;
	// import flash.media.SoundChannel;
	// import flash.media.SoundTransform;

	import flash.net.URLRequest;
	import flash.utils.Timer;

	import org.osmf.containers.MediaContainer;
	import org.osmf.elements.VideoElement;
	import org.osmf.media.DefaultMediaFactory;
	import org.osmf.media.MediaElement;
	import org.osmf.media.MediaPlayer;
	import org.osmf.media.URLResource;
	import org.osmf.layout.LayoutMetadata;
	import org.osmf.layout.HorizontalAlign;
	import org.osmf.layout.LayoutMetadata;
	import org.osmf.layout.LayoutTargetEvent;
	import org.osmf.layout.ScaleMode;
	import org.osmf.layout.VerticalAlign;

	import com.castlabs.dash.DashPluginInfo;

	public class DashElement extends Sprite {

		// Video components
		// private var _connection:NetConnection;
		// private var _stream:NetStream;
		// private var _video:Video;
		// private var _display:Sprite;
		// private var _soundTransform:SoundTransform;
		private var _url:String = "";
		private var _volume:Number = 1;
		// private var _duration:Number = 0;
		// private var _videoWidth:Number = -1;
		// private var _videoHeight:Number = -1;
		// // native video size (from meta data)
		// private var _nativeVideoWidth:Number = 0;
		// private var _nativeVideoHeight:Number = 0;

		// Dash element
		private var _dash:DashPluginInfo;

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
		private var _timer:Timer;

		private var _layoutMetadata:LayoutMetadata;
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


			_mediaPlayer = new MediaPlayer();

			_mediaFactory = new DefaultMediaFactory();
			_mediaFactory.addItem(new DashPluginInfo().getMediaFactoryItemAt(0));

			_layoutMetadata = new LayoutMetadata();
			_layoutMetadata.scaleMode = ScaleMode.NO_SCALE;
			_layoutMetadata.percentWidth = 100;
			_layoutMetadata.percentHeight = 100;
			_layoutMetadata.verticalAlign = VerticalAlign.TOP;
			_layoutMetadata.horizontalAlign = HorizontalAlign.LEFT;


			// Create a media container & add the MediaElement
			_mediaContainer = new MediaContainer();
			_mediaContainer.mouseEnabled = true;
			_mediaContainer.clipChildren = true;
			_mediaContainer.width = stage.stageWidth;
			_mediaContainer.height = stage.stageHeight;
			addChild(_mediaContainer);


			// _timer = new Timer(250);
			// _timer.addEventListener(TimerEvent.TIMER, timerHander);

			if (ExternalInterface.available) {
				ExternalInterface.addCallback('get_src', get_src);
				// ExternalInterface.addCallback('get_volume',get_volume);
				// ExternalInterface.addCallback('get_currentTime', get_currentTime);
				// ExternalInterface.addCallback('get_muted', get_muted);
				// ExternalInterface.addCallback('get_buffered', get_buffered);
				// ExternalInterface.addCallback('get_duration', get_duration);
				// ExternalInterface.addCallback('get_paused', get_paused);
				// ExternalInterface.addCallback('get_ended', get_ended);

				ExternalInterface.addCallback('set_src', set_src);
				// ExternalInterface.addCallback('set_volume', set_volume);
				// ExternalInterface.addCallback('set_currentTime', set_currentTime);
				// ExternalInterface.addCallback('set_muted', set_muted);
				//ExternalInterface.addCallback('set_duration', set_duration);
				//ExternalInterface.addCallback('set_paused', set_paused);

				ExternalInterface.addCallback('fire_load', fire_load);
				ExternalInterface.addCallback('fire_play', fire_play);
				// ExternalInterface.addCallback('fire_pause', fire_pause);
				// ExternalInterface.addCallback('fire_setSize', fire_setSize);
				// ExternalInterface.addCallback('fire_stop', fire_stop);

				ExternalInterface.call('__ready__' + _id);

				ExternalInterface.call('console.log', 'FLASH DASH ready', _id);
			}
		}


		// src
		private function set_src(value:String = ''):void {
			_url = value;
			_isConnected = false;
			_hasStartedPlaying = false;
			_isLoaded = false;

			if (!_isLoaded) {
				fire_load();
			}
		}

		private function get_src():String {
			return _url;
		}

		public function fire_load():void {

			if (_url) {
				sendEvent("loadstart");

				_resource = new URLResource(_url);
				_contentMediaElement = _mediaFactory.createMediaElement(_resource);
				_mediaPlayer.media = _contentMediaElement;

				_mediaContainer.addMediaElement(_contentMediaElement);
				_isLoaded = true;

				log('load', _url, _isLoaded);
			}
		}

		public function fire_play():void {
			log('Play');

			_mediaPlayer.play();
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