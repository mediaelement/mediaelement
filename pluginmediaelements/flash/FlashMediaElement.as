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
		private var _posterUrl:String; // TODO
		private var _autoplay:Boolean; // TODO
		private var _debug:Boolean;
		private var _video:Video;
		private var _initialWidth:Number;
		private var _initialHeight:Number;
		
		// visual elements
		private var _output:TextField;
		private var _fullscreenButton:SimpleButton;
		
		// media
		private var _mediaElement:IMediaElement;
		
		//private var fullscreen_btn:SimpleButton;
		
		public function FlashMediaElement() {		
		
			
			// get parameters
			var params:Object = LoaderInfo(this.root.loaderInfo).parameters;
			_mediaUrl = (params['file'] != undefined) ? String(params['file']) : "";
			_posterUrl = (params['poster'] != undefined) ? String(params['poster']) : "";
			_autoplay = (params['autoplay'] != undefined) ? (String(params['autoplay']) == "true") : false;
			_debug = (params['debug'] != undefined) ? (String(params['debug']) == "true") : false;
			
			// setup stage and player sizes/scales
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			_initialWidth = stage.stageWidth;
			_initialHeight = stage.stageHeight;			
						

			//_autoplay = true;
			//_mediaUrl  = "http://mediafiles.dts.edu/chapel/mp4/20100609.mp4";
			//_mediaUrl  = "../media/Parades-PastLives.mp3";
			//_mediaUrl  = "../media/echo-hereweare.m4v";
			
			// position and hide
			_fullscreenButton = getChildByName("fullscreen_btn") as SimpleButton;
			_fullscreenButton.visible = false;
			_fullscreenButton.addEventListener(MouseEvent.CLICK, fullscreenClick, false);
			_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width - 10;
			_fullscreenButton.y = 10;		
					
			
			// create media element
			
			var extension:String = _mediaUrl.substr(_mediaUrl.lastIndexOf(".")+1);
			
			trace(extension);
			
			switch (extension) {
				case "mp3":
				case "aac":
					_mediaElement = new AudioElement(this, _autoplay);				
					break;					
				default:
				case "mp4":
				case "webm": // for future reference
				case "flv":
					_mediaElement = new VideoElement(this, _autoplay);
					break;
					
			}
			
			// if video, add to stage
			if (_mediaElement is VideoElement) {
				_video = (_mediaElement as VideoElement).video;
				//_video.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
				addChild(_video);				
			}					
			
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
            _output.appendText("poster: " + _posterUrl + "\n");						
            _output.appendText("autoplay: " + _autoplay.toString() + "\n");		
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
					ExternalInterface.call("html5.MediaPluginBridge.initPlugin", ExternalInterface.objectID);
					
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
			
			
			// listen for rezie
			stage.addEventListener(Event.RESIZE, resizeHandler);
		}
		
		function resizeHandler(e:Event):void {
			_video.scaleX = stage.stageWidth / _initialWidth;
			_video.scaleY = stage.stageHeight / _initialHeight;				
		}
		
		// START: Fullscreen
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
		
			if (_video != null) {
				_video.width = width;
				_video.height = height;
				
				
			}					
			
			_output.appendText(_video.width.toString() + "," + _video.height.toString() + "\n");				
		}
		/*
		function setFullscreen(fullscreen:Boolean) {
			_output.appendText("fullscreen: " + fullscreen.toString() + "\n");				
		}
		*/
		
		
		// SEND events to JavaScript
		public function sendEvent(eventName:String, eventValues:String) {
			//_output.appendText("event:" + eventName + " : " + eventValues);
			trace("event", eventName, eventValues);
			
			if (eventValues == "")
				eventValues = "{}";
			
			/*
			OLD DIRECT METHOD
			ExternalInterface.call(
				"function(id, name) { html5.MediaPluginBridge.fireEvent(id,name," + eventValues + "); }", 
				ExternalInterface.objectID, 
				eventName);	
			*/
			
			// use set timeout for performance reasons
			ExternalInterface.call("setTimeout", "html5.MediaPluginBridge.fireEvent('" + ExternalInterface.objectID + "','" + eventName + "'," + eventValues + ")",0);
			
		}			
	}	
}