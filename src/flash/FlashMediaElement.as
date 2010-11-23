package  
{
	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.text.*;
		
	import flash.media.Video;
    import flash.net.NetConnection;
    import flash.net.NetStream;
	
	import flash.filters.DropShadowFilter;
	import flash.utils.Timer;
	import flash.external.ExternalInterface;
	import flash.geom.Rectangle;
	
	import htmlelements.IMediaElement;
	import htmlelements.VideoElement;
	import htmlelements.AudioElement;
	

	public class FlashMediaElement extends MovieClip {
			
		private var _mediaUrl:String;
		private var _autoplay:Boolean; // TODO
		private var _debug:Boolean;
		private var _isVideo:Boolean;		
		private var _video:Video;
		private var _timerRate:Number;
		private var _stageWidth:Number;
		private var _stageHeight:Number;
		
		// native video size (from meta data)
		private var _nativeVideoWidth:Number = 0;
		private var _nativeVideoHeight:Number = 0;
		
		// visual elements
		private var _output:TextField;
		private var _fullscreenButton:SimpleButton;
		
		// media
		private var _mediaElement:IMediaElement;
		
		// connection to fullscreen 
		private var _connection:LocalConnection;
		private var _connectionName:String;
		
		//private var fullscreen_btn:SimpleButton;
		
		// CONTROLS
		private var _showControls:Boolean;
		private var _controlBar:MovieClip;
		private var _controlBarBg:MovieClip;		
		private var _playButton:SimpleButton;
		private var _pauseButton:SimpleButton;
		private var _duration:TextField;
		private var _currentTime:TextField;		
		
		
		public function FlashMediaElement() {		
		
			
			// get parameters
			var params:Object = LoaderInfo(this.root.loaderInfo).parameters;
			_mediaUrl = (params['file'] != undefined) ? String(params['file']) : "";
			_autoplay = (params['autoplay'] != undefined) ? (String(params['autoplay']) == "true") : false;
			_debug = (params['debug'] != undefined) ? (String(params['debug']) == "true") : false;
			_isVideo = (params['isvideo'] != undefined) ? ((String(params['isvideo']) == "false") ? false : true  ) : true;
			_timerRate = (params['timerrate'] != undefined) ? (parseInt(params['timerrate'], 10)) : 250;
			_showControls = (params['controls'] != undefined) ? (String(params['controls']) == "true") : false;
			if (isNaN(_timerRate))
				_timerRate = 250;
			
			// setup stage and player sizes/scales
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			_stageWidth = stage.stageWidth;
			_stageHeight = stage.stageHeight;
						

			//_autoplay = true;
			//_mediaUrl  = "http://mediafiles.dts.edu/chapel/mp4/20100609.mp4";
			//_mediaUrl  = "../media/Parades-PastLives.mp3";
			//_mediaUrl  = "../media/echo-hereweare.mp4";
			
			

			
			
			// position and hide
			_fullscreenButton = getChildByName("fullscreen_btn") as SimpleButton;
			_fullscreenButton.visible = false;
			_fullscreenButton.addEventListener(MouseEvent.CLICK, fullscreenClick, false);
			_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width - 10;
			_fullscreenButton.y = 10;		
					
			
			// create media element			
			if (_isVideo) {
				_mediaElement = new VideoElement(this, _autoplay, _timerRate);
				_video = (_mediaElement as VideoElement).video;
				_video.width = _stageWidth;			
				_video.height = _stageHeight;
				//_video.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
				addChild(_video);						
			} else {
				_mediaElement = new AudioElement(this, _autoplay, _timerRate);
			}
			
			
			// controls!
			_controlBar = getChildByName("controls_mc") as MovieClip;
			_controlBarBg = _controlBar.getChildByName("controls_bg_mc") as MovieClip;			
			_playButton = _controlBar.getChildByName("play_btn") as SimpleButton;
			_playButton.addEventListener(MouseEvent.CLICK, function(e:MouseEvent) {
				_mediaElement.play();					 
			});
			_pauseButton = _controlBar.getChildByName("pause_btn") as SimpleButton;
			_pauseButton.addEventListener(MouseEvent.CLICK, function(e:MouseEvent) {
				_mediaElement.pause();					 
			});
			_pauseButton.visible = false;
			_duration = _controlBar.getChildByName("duration_txt") as TextField;
			_currentTime = _controlBar.getChildByName("currentTime_txt") as TextField;
			if (!_showControls) {
				_controlBar.visible = false;
			}			
			addChild(_controlBar);
			
			
			
			// debugging
            _output = new TextField();
			_output.textColor = 0xeeeeee;
            _output.width = stage.stageWidth - 100;
            _output.height = stage.stageHeight;
            _output.multiline = true;
            _output.wordWrap = true;
            _output.border = false;
			_output.filters = [new DropShadowFilter(1, 0x000000, 45, 1, 2, 2, 1)];
			
            _output.text = "Initializing...\n";
			addChild(_output);			
			_output.visible = _debug;		
			
 
		    _output.appendText("stage: " + stage.stageWidth + "x" + stage.stageHeight + "\n");						
            _output.appendText("file: " + _mediaUrl + "\n");
            _output.appendText("autoplay: " + _autoplay.toString() + "\n");		
            _output.appendText("isvideo: " + _isVideo.toString() + "\n");		
            _output.appendText("timerrate: " + _timerRate.toString() + "\n");				
			_output.appendText("displayState: " +(stage.hasOwnProperty("displayState")).toString() + "\n");								
			
			// attach javascript
			_output.appendText("ExternalInterface.available: " + ExternalInterface.available.toString() + "\n");
			_output.appendText("ExternalInterface.objectID: " + ((ExternalInterface.objectID != null)? ExternalInterface.objectID.toString() : "null") + "\n");
			
			if (ExternalInterface.available) {
				
				_output.appendText("Adding callbacks...\n");
				try {
					
					// add HTML media methods
					ExternalInterface.addCallback("playMedia", playMedia);					
					ExternalInterface.addCallback("loadMedia", loadMedia);					
					ExternalInterface.addCallback("pauseMedia", pauseMedia);
					
					ExternalInterface.addCallback("setSrc", setSrc);
					ExternalInterface.addCallback("setCurrentTime", setCurrentTime);
					ExternalInterface.addCallback("setVolume", setVolume);
					ExternalInterface.addCallback("setMuted", setMuted);
					
					ExternalInterface.addCallback("setFullscreen", setFullscreen);					
					ExternalInterface.addCallback("setVideoSize", setVideoSize);					
					
					// fire init method
					ExternalInterface.call("mejs.MediaPluginBridge.initPlugin", ExternalInterface.objectID);
					
					_output.appendText("Success...\n");
					
				} catch (error:SecurityError) {
                    _output.appendText("A SecurityError occurred: " + error.message + "\n");
                } catch (error:Error) {
                    _output.appendText("An Error occurred: " + error.message + "\n");
                }
				
			}
			
			
			if (_mediaUrl != "") {			
				
				_mediaElement.setSrc(_mediaUrl);
				
				if (_autoplay) {
					_mediaElement.load();
					_mediaElement.play();
				}	
			}
			
			
			// put back on top
			addChild(_fullscreenButton);
			//_fullscreenButton.alpha = 0;
			_fullscreenButton.visible = false;
			trace(_fullscreenButton.visible);
			
			// connection to full screen
			_connection = new LocalConnection();
			_connection.client = this;
			_connection.connect(ExternalInterface.objectID + "_player");
			
			
			positionControls();
			
			// listen for rezie
			stage.addEventListener(Event.RESIZE, resizeHandler);
			
			// test
			stage.addEventListener(MouseEvent.MOUSE_DOWN, clickHandler);
		}
		
		function clickHandler(e:MouseEvent):void {
			_output.appendText("click: " + e.stageX.toString() +","+e.stageY.toString() + "\n");   			
		}	
	
		function resizeHandler(e:Event):void {
			//_video.scaleX = stage.stageWidth / _stageWidth;
			//_video.scaleY = stage.stageHeight / _stageHeight;		
			positionControls();
		}
		
		
		// START: Fullscreen
		
		// for local connection
		public function goFullscreen():void {
			setFullscreen(true);
		}
		
		var _isFullscreen:Boolean = false;
		function setFullscreen(fullscreen:Boolean) {
			
			try {
				//_fullscreenButton.visible = false;	
				
				if (fullscreen) {
					
					var screenRectangle:Rectangle = new Rectangle(_video.x, _video.y, _video.width, _video.height); 
					stage.fullScreenSourceRect = screenRectangle;
					
					stage.displayState = StageDisplayState.FULL_SCREEN;
					_isFullscreen = true;

				} else {
					stage.displayState = StageDisplayState.NORMAL;
					_isFullscreen = false;
				}
							
			} catch (error:Error) {
				
				//if (fullscreen)
					_fullscreenButton.visible = true;
				
				_output.appendText("error setting fullscreen: " + error.toString() + "\n");   
			}
		}		
		
		function fullscreenClick(e:MouseEvent) {
			_fullscreenButton.visible = false;
			
			try {
				setFullscreen(true);
						
			} catch (error:Error) {
			}
			
		}
		
		function stageFullScreen(e:FullScreenEvent) {
			_output.appendText("fullscreen event: " + e.fullScreen.toString() + "\n");   
			
			if (e.fullScreen) {
				_fullscreenButton.visible = false;
			} else {
			}
		}
		// END: Fullscreen
		
		
		function playMedia() {
			_output.appendText("play\n");
			_mediaElement.play();
		}
		
		function loadMedia() {
			_output.appendText("load\n");
			_mediaElement.load();
		}		
						
		function pauseMedia() {
			_output.appendText("pause\n");					
			_mediaElement.pause();
		}
		
		function setSrc(url:String) {
			_output.appendText("setSrc: " + url + "\n");
			_mediaElement.setSrc(url);
		}
		
		function setCurrentTime(time:Number) {
			_output.appendText("seek: " + time.toString() + "\n");				
			_mediaElement.setCurrentTime(time);
		}		

		function setVolume(volume:Number) {
			_output.appendText("volume: " + volume.toString() + "\n");				
			_mediaElement.setVolume(volume);
		}		
		
		function setMuted(muted:Boolean) {
			_output.appendText("muted: " + muted.toString() + "\n");				
			_mediaElement.setMuted(muted);
		}
		
		function setVideoSize(width:Number, height:Number) {
			_output.appendText("setVideoSize: " + width.toString() + "," + height.toString() + "\n");		
			
			_stageWidth = width;
			_stageHeight = height;
			
		
			if (_video != null) {
				repositionVideo();	
				_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width - 10;
			}					
						
			_output.appendText("result: " + _video.width.toString() + "," + _video.height.toString() + "\n");				
		}
		
		function repositionVideo():void {		
			
			if (_nativeVideoWidth <= 0 || _nativeVideoHeight <= 0)
				return;
				
			_output.appendText("positioning video\n");				
						
			// calculate ratios
			var stageRatio = _stageWidth/_stageHeight;
			var nativeRatio = _nativeVideoWidth/_nativeVideoHeight;

			// adjust size and position
			if (nativeRatio > stageRatio) {											
				_video.width = _stageWidth;
				_video.height = _nativeVideoHeight * _stageWidth / _nativeVideoWidth;				
				_video.y = _stageHeight/2 - _video.height/2;
			} else if (stageRatio > nativeRatio) {
				_video.height = _stageHeight;
				_video.width = _nativeVideoWidth * _stageHeight / _nativeVideoHeight;				
				_video.x = _stageWidth/2 - _video.width/2;
			} else if (stageRatio == nativeRatio) {
				_video.height = _stageHeight;
				_video.width = _stageWidth;
				_video.x = 0;
				_video.y = 0;				
			}
		}
			
		
		// SEND events to JavaScript
		public function sendEvent(eventName:String, eventValues:String) {
			
			// special video event
			if (eventName == HtmlMediaEvent.LOADEDMETADATA) {
				_nativeVideoWidth = (_mediaElement as VideoElement).videoWidth;
				_nativeVideoHeight = (_mediaElement as VideoElement).videoHeight;			
				
				repositionVideo();
			}
			
			// update controls
			switch (eventName) {
				case "pause":
				case "paused":
				case "ended":
					_playButton.visible = true;
					_pauseButton.visible = false;
					break;
				case "play":
				case "playing":
					_playButton.visible = false;
					_pauseButton.visible = true;
					break;					
			}
			_duration.text = secondsToTimeCode(_mediaElement.duration());
			_currentTime.text = secondsToTimeCode(_mediaElement.currentTime());			
						
			//_output.appendText("event:" + eventName + " : " + eventValues);
			trace("event", eventName, eventValues);
			
			if (eventValues == "")
				eventValues = "{}";
			
			/*
			OLD DIRECT METHOD
			ExternalInterface.call(
				"function(id, name) { mejs.MediaPluginBridge.fireEvent(id,name," + eventValues + "); }", 
				ExternalInterface.objectID, 
				eventName);	
			*/
			
			// use set timeout for performance reasons
			ExternalInterface.call("setTimeout", "mejs.MediaPluginBridge.fireEvent('" + ExternalInterface.objectID + "','" + eventName + "'," + eventValues + ")",0);
			
		}	
		
		function secondsToTimeCode(seconds:Number):String {
			var timeCode:String = "";
			seconds = Math.round(seconds);		
			var minutes:Number = Math.floor(seconds / 60);		
			timeCode = (minutes >= 10) ? minutes.toString() : "0" + minutes.toString();
			seconds = Math.floor(seconds % 60);
			timeCode += ":" + ((seconds >= 10) ? seconds.toString() : "0" + seconds.toString());
			return timeCode; //minutes.toString() + ":" + seconds.toString();
		}
		
		function positionControls() {
			_controlBarBg.width = stage.stageWidth;
			_controlBar.y = stage.stageHeight - _controlBar.height;
			_duration.x = stage.stageWidth - _duration.width - 10;
			_currentTime.x = stage.stageWidth - _duration.width - 10 - _currentTime.width - 10;
		}
	}	
}