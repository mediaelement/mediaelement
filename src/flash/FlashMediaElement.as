package
{
	import flash.display.*;
	import flash.events.*;
	import flash.media.*;
	import flash.net.*;
	import flash.text.*;
	import flash.system.*;

	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;

	import flash.geom.ColorTransform;

	import flash.filters.DropShadowFilter;
	import flash.utils.Timer;
	import flash.external.ExternalInterface;
	import flash.geom.Rectangle;

	import htmlelements.IMediaElement;
	import htmlelements.VideoElement;
	import htmlelements.AudioElement;
	import htmlelements.YouTubeElement;
	import htmlelements.DailyMotionElement;
	import htmlelements.HLSMediaElement;


	public class FlashMediaElement extends MovieClip {

		private var _mediaUrl:String;
		private var _jsInitFunction:String;
		private var _jsCallbackFunction:String;
		private var _autoplay:Boolean;
		private var _preload:String;
		private var _debug:Boolean;
		private var _isVideo:Boolean;
		private var _video:DisplayObject;
		private var _timerRate:Number;
		private var _stageWidth:Number;
		private var _stageHeight:Number;
		private var _enableSmoothing:Boolean;
		private var _allowedPluginDomain:String;
		private var _isFullScreen:Boolean = false;
		private var _startVolume:Number;
		private var _controlStyle:String;
		private var _autoHide:Boolean = true;
		private var _streamer:String = "";
		private var _enablePseudoStreaming:Boolean;
		private var _pseudoStreamingStartQueryParam:String;

		// native video size (from meta data)
		private var _nativeVideoWidth:Number = 0;
		private var _nativeVideoHeight:Number = 0;

		// visual elements
        private var _mediaElementDisplay:FlashMediaElementDisplay = new FlashMediaElementDisplay();
		private var _output:TextField;
		private var _fullscreenButton:SimpleButton;

		// media
		private var _mediaElement:IMediaElement;

		// connection to fullscreen
		private var _connection:LocalConnection;
		private var _connectionName:String;

		//private var fullscreen_btn:SimpleButton;

		// CONTROLS
		private var _alwaysShowControls:Boolean;
		private var _controlBar:MovieClip;
		private var _controlBarBg:MovieClip;
		private var _scrubBar:MovieClip;
		private var _scrubTrack:MovieClip;
		private var _scrubOverlay:MovieClip;
		private var _scrubLoaded:MovieClip;
		private var _hoverTime:MovieClip;
		private var _hoverTimeText:TextField;
		private var _playButton:SimpleButton;
		private var _pauseButton:SimpleButton;
		private var _duration:TextField;
		private var _currentTime:TextField;
		private var _fullscreenIcon:SimpleButton;
		private var _volumeMuted:SimpleButton;
		private var _volumeUnMuted:SimpleButton;
		private var _scrubTrackColor:String;
		private var _scrubBarColor:String;
		private var _scrubLoadedColor:String;

		// IDLE Timer for mouse for showing/hiding controls
		private var _inactiveTime:int;
        private var _timer:Timer;
        private var _idleTime:int;
        private var _isMouseActive:Boolean
		private var _isOverStage:Boolean = false;

		// security checkes
		private var securityIssue:Boolean = false; // When SWF parameters contain illegal characters
		private var directAccess:Boolean = false; // When SWF visited directly with no parameters (or when security issue detected)


		public function FlashMediaElement() {
			// check for security issues (borrowed from jPLayer)
			checkFlashVars(loaderInfo.parameters);

			// allows this player to be called from a different domain than the HTML page hosting the player
            CONFIG::cdnBuild {
                Security.allowDomain("*");
                Security.allowInsecureDomain('*');
			}

			
			if (securityIssue) {
				return;
			}

			// get parameters
			// Use only FlashVars, ignore QueryString
			var params:Object, pos:int, query:Object;

			params = LoaderInfo(this.root.loaderInfo).parameters;
			pos = root.loaderInfo.url.indexOf('?');
			if (pos !== -1) {
				query = parseStr(root.loaderInfo.url.substr(pos + 1));

				for (var key:String in params) {
					if (query.hasOwnProperty(trim(key))) {
						delete params[key];
					}
				}
			}

			_mediaUrl = (params['file'] != undefined) ? String(params['file']) : "";
			_jsInitFunction = (params['jsinitfunction'] != undefined) ? String(params['jsinitfunction']) : "";
			_jsCallbackFunction = (params['jscallbackfunction'] != undefined) ? String(params['jscallbackfunction']) : "";
			_autoplay = (params['autoplay'] != undefined) ? (String(params['autoplay']) == "true") : false;
			
			// no debug info for OWASP
			CONFIG::debugBuild {
				_debug = (params['debug'] != undefined) ? (String(params['debug']) == "true") : false;

				// add debug output
				_output = new TextField();
				_output.textColor = 0xeeeeee;
				_output.width = stage.stageWidth - 100;
				_output.height = stage.stageHeight;
				_output.multiline = true;
				_output.wordWrap = true;
				_output.border = false;
				_output.filters = [new DropShadowFilter(1, 0x000000, 45, 1, 2, 2, 1)];
				_output.text = "Initializing Flash...\n";
				
				addChild(_output);
				_output.visible = _debug;				
			}
			_isVideo = (params['isvideo'] != undefined) ? ((String(params['isvideo']) == "false") ? false : true  ) : true;
			_timerRate = (params['timerrate'] != undefined) ? (parseInt(params['timerrate'], 10)) : 250;
			_alwaysShowControls = (params['controls'] != undefined) ? (String(params['controls']) == "true") : false;
			_enableSmoothing = (params['smoothing'] != undefined) ? (String(params['smoothing']) == "true") : false;
			_startVolume = (params['startvolume'] != undefined) ? (parseFloat(params['startvolume'])) : 0.8;
			_preload = (params['preload'] != undefined) ? params['preload'] : "none";
			_controlStyle = (params['controlstyle'] != undefined) ? (String(params['controlstyle'])) : ""; // blank or "floating"
			_autoHide = (params['autohide'] != undefined) ? (String(params['autohide']) == "true") : true;
			_scrubTrackColor = (params['scrubtrackcolor'] != undefined) ? (String(params['scrubtrackcolor'])) : "0x333333";
			_scrubBarColor = (params['scrubbarcolor'] != undefined) ? (String(params['scrubbarcolor'])) : "0xefefef";
			_scrubLoadedColor = (params['scrubloadedcolor'] != undefined) ? (String(params['scrubloadedcolor'])) : "0x3CACC8";
			_enablePseudoStreaming = (params['pseudostreaming'] != undefined) ? (String(params['pseudostreaming']) == "true") : false;
			_pseudoStreamingStartQueryParam = (params['pseudostreamstart'] != undefined) ? (String(params['pseudostreamstart'])) : "start";
			_streamer = (params['flashstreamer'] != undefined) ? (String(params['flashstreamer'])) : "";

			// for audio them controls always show them

			if (!_isVideo && _alwaysShowControls) {
				_autoHide = false;
			}



			if (isNaN(_timerRate))
				_timerRate = 250;

			// setup stage and player sizes/scales
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			_stageWidth = stage.stageWidth;
			_stageHeight = stage.stageHeight;
			this.addChild(_mediaElementDisplay);
			stage.addChild(this);

			//_autoplay = true;
			//_mediaUrl  = "http://mediafiles.dts.edu/chapel/mp4/20100609.mp4";
			//_alwaysShowControls = true;
			//_mediaUrl  = "../media/Parades-PastLives.mp3";
			//_mediaUrl  = "../media/echo-hereweare.mp4";

			//_mediaUrl = "http://video.ted.com/talks/podcast/AlGore_2006_480.mp4";
			//_mediaUrl = "rtmp://stream2.france24.yacast.net/france24_live/en/f24_liveen";

			//_mediaUrl = "http://www.youtube.com/watch?feature=player_embedded&v=yyWWXSwtPP0"; // hosea
			//_mediaUrl = "http://www.youtube.com/watch?feature=player_embedded&v=m5VDDJlsD6I"; // railer with notes

			//_alwaysShowControls = true;

			//_debug=true;




			// position and hide
			_fullscreenButton = _mediaElementDisplay.getChildByName("fullscreen_btn") as SimpleButton;
			_fullscreenButton.visible = _isVideo;
			_fullscreenButton.alpha = 0;
			_fullscreenButton.addEventListener(MouseEvent.CLICK, fullscreenClick, false);
			_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width;
			_fullscreenButton.y = stage.stageHeight - _fullscreenButton.height;


			// create media element
			if (_isVideo) {
				if (_mediaUrl.search(/(https?|file)\:\/\/.*?\.m3u8(\?.*)?/i) !== -1) {

					_mediaElement = new HLSMediaElement(this, _autoplay, _preload, _timerRate, _startVolume);
					_video = (_mediaElement as HLSMediaElement).video;
					_video.width = _stageWidth;
					_video.height = _stageHeight;
					(_video as Video).smoothing = _enableSmoothing;
					addChild(_video);

					_paramVideoWidth = (params['width'] != undefined) ? (parseInt(params['width'], 10)) : 0;
					_paramVideoHeight = (params['height'] != undefined) ? (parseInt(params['height'], 10)) : 0;


				} else if (_mediaUrl.indexOf("youtube.com") > -1 || _mediaUrl.indexOf("youtu.be") > -1) {

					//Security.allowDomain("http://www.youtube.com");

					_mediaElement = new YouTubeElement(this, _autoplay, _preload, _timerRate, _startVolume);
					_video = (_mediaElement as YouTubeElement).player;

					// these are set and then used once the player is loaded
					(_mediaElement as YouTubeElement).initWidth = _stageWidth;
					(_mediaElement as YouTubeElement).initHeight = _stageHeight;

				} else if (_mediaUrl.indexOf("dailymotion.com") > -1 || _mediaUrl.indexOf("dai.ly") > -1) {

					Security.allowDomain("http://www.dailymotion.com");

					_mediaElement = new DailyMotionElement(this, _autoplay, _preload, _timerRate, _startVolume);
					_video = (_mediaElement as DailyMotionElement).player;

					// these are set and then used once the player is loaded
					(_mediaElement as DailyMotionElement).initWidth = _stageWidth;
					(_mediaElement as DailyMotionElement).initHeight = _stageHeight;
					
					
					
				} else {

					_mediaElement = new VideoElement(this, _autoplay, _preload, _timerRate, _startVolume, _streamer);
					_video = (_mediaElement as VideoElement).video;
					_video.width = _stageWidth;
					_video.height = _stageHeight;
					(_video as Video).smoothing = _enableSmoothing;
					(_mediaElement as VideoElement).setReference(this);
					(_mediaElement as VideoElement).setPseudoStreaming(_enablePseudoStreaming);
					(_mediaElement as VideoElement).setPseudoStreamingStartParam(_pseudoStreamingStartQueryParam);
					//_video.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
					addChild(_video);
				}
			} else {

				//var player2:AudioDecoder = new com.automatastudios.audio.audiodecoder.AudioDecoder();
				_mediaElement = new AudioElement(this, _autoplay, _preload, _timerRate, _startVolume);
			}


			// controls!
			_controlBar = _mediaElementDisplay.getChildByName("controls_mc") as MovieClip;
			_controlBarBg = _controlBar.getChildByName("controls_bg_mc") as MovieClip;
			_scrubTrack = _controlBar.getChildByName("scrubTrack") as MovieClip;
			_scrubBar = _controlBar.getChildByName("scrubBar") as MovieClip;
			_scrubOverlay = _controlBar.getChildByName("scrubOverlay") as MovieClip;
			_scrubLoaded = _controlBar.getChildByName("scrubLoaded") as MovieClip;

			_scrubOverlay.buttonMode = true;
			_scrubOverlay.useHandCursor = true;

			applyColor(_scrubTrack, _scrubTrackColor);
			applyColor(_scrubBar, _scrubBarColor);
			applyColor(_scrubLoaded, _scrubLoadedColor);

			_fullscreenIcon = _controlBar.getChildByName("fullscreenIcon") as SimpleButton;
			_fullscreenIcon.visible = _isVideo;

			// New fullscreenIcon for new fullscreen floating controls
			//if(_alwaysShowControls && _controlStyle.toUpperCase()=="FLOATING") {
				_fullscreenIcon.addEventListener(MouseEvent.CLICK, fullScreenIconClick, false);
			//}

			_volumeMuted = _controlBar.getChildByName("muted_mc") as SimpleButton;
			_volumeUnMuted = _controlBar.getChildByName("unmuted_mc") as SimpleButton;

			_volumeMuted.addEventListener(MouseEvent.CLICK, toggleVolume, false);
			_volumeUnMuted.addEventListener(MouseEvent.CLICK, toggleVolume, false);

			_playButton = _controlBar.getChildByName("play_btn") as SimpleButton;
			_playButton.addEventListener(MouseEvent.CLICK, function(e:MouseEvent):void {
				_mediaElement.play();
			});
			_pauseButton = _controlBar.getChildByName("pause_btn") as SimpleButton;
			_pauseButton.addEventListener(MouseEvent.CLICK, function(e:MouseEvent):void {
				_mediaElement.pause();
			});
			_pauseButton.visible = false;
			_duration = _controlBar.getChildByName("duration_txt") as TextField;
			_currentTime = _controlBar.getChildByName("currentTime_txt") as TextField;
			_hoverTime = _controlBar.getChildByName("hoverTime") as MovieClip;
			_hoverTimeText = _hoverTime.getChildByName("hoverTime_txt") as TextField;
			_hoverTime.visible=false;
			_hoverTime.y=(_hoverTime.height/2)+1;
			_hoverTime.x=0;



			// Add new timeline scrubber events
			_scrubOverlay.addEventListener(MouseEvent.MOUSE_MOVE, scrubMove);
			_scrubOverlay.addEventListener(MouseEvent.CLICK, scrubClick);
			_scrubOverlay.addEventListener(MouseEvent.MOUSE_OVER, scrubOver);
			_scrubOverlay.addEventListener(MouseEvent.MOUSE_OUT, scrubOut);

			if (_autoHide) { // && _alwaysShowControls) {
				// Add mouse activity for show/hide of controls
				stage.addEventListener(Event.MOUSE_LEAVE, mouseActivityLeave);
				stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseActivityMove);
				_inactiveTime = 2500;
				_timer = new Timer(_inactiveTime)
				_timer.addEventListener(TimerEvent.TIMER, idleTimer);
				_timer.start();
				// set
			}

			if(_startVolume<=0) {
				trace("INITIAL VOLUME: "+_startVolume+" MUTED");
				_volumeMuted.visible=true;
				_volumeUnMuted.visible=false;
			} else {
				trace("INITIAL VOLUME: "+_startVolume+" UNMUTED");
				_volumeMuted.visible=false;
				_volumeUnMuted.visible=true;
			}

			_controlBar.visible = _alwaysShowControls;

			setControlDepth();

			
			logMessage("stage: " + stage.stageWidth + "x" + stage.stageHeight);
			logMessage("file: " + _mediaUrl);
			logMessage("autoplay: " + _autoplay.toString());
			logMessage("preload: " + _preload.toString());
			logMessage("isvideo: " + _isVideo.toString());
			logMessage("smoothing: " + _enableSmoothing.toString());
			logMessage("timerrate: " + _timerRate.toString());
			logMessage("displayState: " +(stage.hasOwnProperty("displayState")).toString());

			// attach javascript
			logMessage("ExternalInterface.available: " + ExternalInterface.available.toString());
			logMessage("ExternalInterface.objectID: " + ((ExternalInterface.objectID != null)? ExternalInterface.objectID.toString() : "null"));
	

			if (_mediaUrl != "") {
				_mediaElement.setSrc(_mediaUrl);
			}

			positionControls();

			// Fire this once just to set the width on some dynamically sized scrub bar items;
			_scrubBar.scaleX=0;
			_scrubLoaded.scaleX=0;


			if (ExternalInterface.available) { //  && !_alwaysShowControls

				
				logMessage("Adding callbacks: " + _jsCallbackFunction + " ...");
				
				try {
					if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {

						// add HTML media methods
						ExternalInterface.addCallback("playMedia", playMedia);
						ExternalInterface.addCallback("loadMedia", loadMedia);
						ExternalInterface.addCallback("pauseMedia", pauseMedia);
						ExternalInterface.addCallback("stopMedia", stopMedia);

						ExternalInterface.addCallback("setSrc", setSrc);
						ExternalInterface.addCallback("setCurrentTime", setCurrentTime);
						ExternalInterface.addCallback("setVolume", setVolume);
						ExternalInterface.addCallback("setMuted", setMuted);

						ExternalInterface.addCallback("setFullscreen", setFullscreen);
						ExternalInterface.addCallback("setVideoSize", setVideoSize);

						ExternalInterface.addCallback("positionFullscreenButton", positionFullscreenButton);
						ExternalInterface.addCallback("hideFullscreenButton", hideFullscreenButton);

						// fire init method
						ExternalInterface.call(_jsInitFunction, ExternalInterface.objectID);
					}
										
					logMessage("Success: " + _jsInitFunction + " ...");

				} catch (error:SecurityError) {					
					logMessage("A SecurityError occurred: " + error.message);			
				} catch (error:Error) {
					logMessage("An Error occurred: " + error.message);
				}

			}

			if (_preload != "none") {
				_mediaElement.load();

				if (_autoplay) {
					_mediaElement.play();
				}
			} else if (_autoplay) {
				_mediaElement.load();
				_mediaElement.play();
			}

			// listen for resize
			stage.addEventListener(Event.RESIZE, resizeHandler);

			// send click events up to javascript
			stage.addEventListener(MouseEvent.CLICK, stageClicked);

			// resize
			stage.addEventListener(FullScreenEvent.FULL_SCREEN, stageFullScreenChanged);

			stage.addEventListener(KeyboardEvent.KEY_DOWN, stageKeyDown);
		}

		public function setControlDepth():void {
			// put these on top
			if (_output != null) {
				addChild(_output);
			}
			addChild(_controlBar);
			addChild(_fullscreenButton);

		}

        public function logMessage(txt:String):void {
            CONFIG::debugBuild {
	            _output.appendText(txt + "\n");
	        }
        }

		// borrowed from jPLayer
		// https://github.com/happyworm/jPlayer/blob/e8ca190f7f972a6a421cb95f09e138720e40ed6d/actionscript/Jplayer.as#L228
		private function checkFlashVars(p:Object):void {
			var i:Number = 0;
			for (var s:String in p) {
				if (isIllegalChar(p[s], s === 'file')) {
					securityIssue = true; // Illegal char found
				}
				i++;
			}
			if(i === 0 || securityIssue) {
				directAccess = true;
			}
		}

		private static function parseStr (str:String) : Object {
			var hash:Object = {},
				arr1:Array, arr2:Array;

			str = unescape(str).replace(/\+/g, " ");

			arr1 = str.split('&');
			if (!arr1.length) {
				return {};
			}

			for (var i:uint = 0, length:uint = arr1.length; i < length; i++) {
				arr2 = arr1[i].split('=');
				if (!arr2.length) {
					continue;
				}
				hash[trim(arr2[0])] = trim(arr2[1]);
			}
			return hash;
		}


		private static function trim(str:String) : String {
			if (!str) {
				return str;
			}

			return str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
		}

		private function isIllegalChar(s:String, isUrl:Boolean):Boolean {
			var illegals:String = "' \" ( ) { } * + \\ < >";
			if(isUrl) {
				illegals = "\" { } \\ < >";
			}
			if(Boolean(s)) { // Otherwise exception if parameter null.
				for each (var illegal:String in illegals.split(' ')) {
					if(s.indexOf(illegal) >= 0) {
						return true; // Illegal char found
					}
				}
			}
			return false;
		}


		// START: Controls and events
		private function mouseActivityMove(event:MouseEvent):void {

			// if mouse is in the video area
			if (_autoHide && (mouseX>=0 && mouseX<=stage.stageWidth) && (mouseY>=0 && mouseY<=stage.stageHeight)) {

				// This could be move to a nice fade at some point...
				_controlBar.visible = (_alwaysShowControls || _isFullScreen);
				_isMouseActive = true;
				_idleTime = 0;
				_timer.reset();
				_timer.start()
			}
		}

		private function mouseActivityLeave(event:Event):void {
			if (_autoHide) {
				_isOverStage = false;
				// This could be move to a nice fade at some point...
				_controlBar.visible = false;
				_isMouseActive = false;
				_idleTime = 0;
				_timer.reset();
				_timer.stop();
			}
		}

		private function idleTimer(event:TimerEvent):void    {

			if (_autoHide) {
				// This could be move to a nice fade at some point...
				_controlBar.visible = false;
				_isMouseActive = false;
				_idleTime += _inactiveTime;
				_idleTime = 0;
				_timer.reset();
				_timer.stop();
			}
		}


		private function scrubMove(event:MouseEvent):void {

			//if (_alwaysShowControls) {
				if (_hoverTime.visible) {
					var seekBarPosition:Number =  ((event.localX / _scrubTrack.width) *_mediaElement.duration())*_scrubTrack.scaleX;
					var hoverPos:Number = (seekBarPosition / _mediaElement.duration()) *_scrubTrack.scaleX;

					if (_isFullScreen) {
						_hoverTime.x=event.target.parent.mouseX;
					} else {
						_hoverTime.x=mouseX;
					}
					_hoverTime.y = _scrubBar.y - (_hoverTime.height/2);
					_hoverTimeText.text = secondsToTimeCode(seekBarPosition);
				}
			//}
			//trace(event);
		}

		private function scrubOver(event:MouseEvent):void {
			_hoverTime.y = _scrubBar.y-(_hoverTime.height/2)+1;
			_hoverTime.visible = true;
			trace(event);
		}

		private function scrubOut(event:MouseEvent):void {
			_hoverTime.y = _scrubBar.y+(_hoverTime.height/2)+1;
			_hoverTime.visible = false;
			//_hoverTime.x=0;
			//trace(event);
		}

		private function scrubClick(event:MouseEvent):void {
			//trace(event);
			var seekBarPosition:Number = ((event.localX / _scrubTrack.width) * _mediaElement.duration()) * _scrubTrack.scaleX;

			var canSeekToPosition:Boolean = isNaN(_mediaElement.seekLimit()) ||  ( seekBarPosition <= _mediaElement.duration() && seekBarPosition >= 0 );

			if (canSeekToPosition) {
					_mediaElement.setCurrentTime(seekBarPosition);
			}
		}

		public function toggleVolume(event:MouseEvent):void {
			trace(event.currentTarget.name);
			switch(event.currentTarget.name) {
				case "muted_mc":
					setMuted(false);
					break;
				case "unmuted_mc":
					setMuted(true);
					break;
			}
		}

		private function toggleVolumeIcons(volume:Number):void {
			if(volume<=0) {
				_volumeMuted.visible = true;
				_volumeUnMuted.visible = false;
			} else {
				_volumeMuted.visible = false;
				_volumeUnMuted.visible = true;
			}
		}

		private function positionControls(forced:Boolean=false):void {


			if ( _controlStyle.toUpperCase() == "FLOATING" && _isFullScreen) {

				trace("CONTROLS: floating");
				_hoverTime.y=(_hoverTime.height/2)+1;
				_hoverTime.x=0;
				_controlBarBg.width = 300;
				_controlBarBg.height = 93;
				//_controlBarBg.x = (stage.stageWidth/2) - (_controlBarBg.width/2);
				//_controlBarBg.y  = stage.stageHeight - 300;

				_pauseButton.scaleX = _playButton.scaleX=3.5;
				_pauseButton.scaleY= _playButton.scaleY=3.5;
				// center the play button and make it big and at the top
				_pauseButton.x = _playButton.x = (_controlBarBg.width/2)-(_playButton.width/2)+7;
				_pauseButton.y = _playButton.y = _controlBarBg.height-_playButton.height-(14)

				_controlBar.x = (stage.stageWidth/2) -150;
				_controlBar.y = stage.stageHeight - _controlBar.height-100;


				// reposition the time and duration items

				_duration.x = _controlBarBg.width - _duration.width - 10;
				_duration.y = _controlBarBg.height - _duration.height -7;
				//_currentTime.x = _controlBarBg.width - _duration.width - 10 - _currentTime.width - 10;
				_currentTime.x = 5
				_currentTime.y= _controlBarBg.height - _currentTime.height-7;

				_fullscreenIcon.x = _controlBarBg.width - _fullscreenIcon.width - 7;
				_fullscreenIcon.y = 7;

				_volumeMuted.x = _volumeUnMuted.x = 7;
				_volumeMuted.y = _volumeUnMuted.y = 7;

				_scrubLoaded.x = _scrubBar.x = _scrubOverlay.x = _scrubTrack.x =_currentTime.x+_currentTime.width+7;
				_scrubLoaded.y = _scrubBar.y = _scrubOverlay.y = _scrubTrack.y=_controlBarBg.height-_scrubTrack.height-10;

				_scrubBar.width =  _scrubOverlay.width = _scrubTrack.width = (_duration.x-_duration.width-14);


			} else {
				trace("CONTROLS: normal, original");

				/*
				// Original style bottom display
				_hoverTime.y=(_hoverTime.height/2)+1;
				_hoverTime.x=0;
				_controlBarBg.width = stage.stageWidth;
				_controlBar.y = stage.stageHeight - _controlBar.height;
				_duration.x = stage.stageWidth - _duration.width - 10;
				//_currentTime.x = stage.stageWidth - _duration.width - 10 - _currentTime.width - 10;
				_currentTime.x = _playButton.x+_playButton.width;
				_scrubTrack.width = (_duration.x-_duration.width-10)-_duration.width+10;
				_scrubOverlay.width = _scrubTrack.width;
				_scrubBar.width = _scrubTrack.width;
				*/

				// FLOATING MODE BOTTOM DISPLAY - similar to normal
				trace("THAT WAY!");
				_hoverTime.y=(_hoverTime.height/2)+1;
				_hoverTime.x=0;
				_controlBarBg.width = stage.stageWidth;
				_controlBarBg.height = 30;
				_controlBarBg.y=0;
				_controlBarBg.x=0;
				// _controlBarBg.x = 0;
				// _controlBarBg.y  = stage.stageHeight - _controlBar.height;

				_pauseButton.scaleX = _playButton.scaleX=1;
				_pauseButton.scaleY = _playButton.scaleY=1;

				_pauseButton.x = _playButton.x = 7;
				_pauseButton.y = _playButton.y = _controlBarBg.height-_playButton.height-2;


				//_currentTime.x = stage.stageWidth - _duration.width - 10 - _currentTime.width - 10;
				_currentTime.x = _playButton.x+_playButton.width;

				_fullscreenIcon.x = _controlBarBg.width - _fullscreenIcon.width - 7;
				_fullscreenIcon.y = 8;

				_volumeMuted.x = _volumeUnMuted.x = (_isVideo ? _fullscreenIcon.x : _controlBarBg.width) - _volumeMuted.width - 10;
				_volumeMuted.y = _volumeUnMuted.y = 10;

				_duration.x = _volumeMuted.x - _volumeMuted.width - _duration.width + 5;
				_duration.y = _currentTime.y = _controlBarBg.height - _currentTime.height - 7;

				_scrubLoaded.x = _scrubBar.x = _scrubOverlay.x = _scrubTrack.x = _currentTime.x + _currentTime.width + 10;
				_scrubLoaded.y = _scrubBar.y = _scrubOverlay.y = _scrubTrack.y = _controlBarBg.height - _scrubTrack.height - 9;

				_scrubBar.width =  _scrubOverlay.width = _scrubTrack.width =  (_duration.x-_duration.width-10)-_duration.width+5;
				_controlBar.x = 0;
				_controlBar.y = stage.stageHeight - _controlBar.height;

			}

		}

		// END: Controls


		public function stageClicked(e:MouseEvent):void {
			//logMessage("click: " + e.stageX.toString() +","+e.stageY.toString() + "\n");
			if (e.target == stage) {
				sendEvent("click", "");
			}
		}

		public function stageKeyDown(e:KeyboardEvent):void {
			sendEvent(HtmlMediaEvent.KEYDOWN, "keyCode:'" + e.keyCode + "'");
		}

		public function resizeHandler(e:Event):void {

			//_video.scaleX = stage.stageWidth / _stageWidth;
			//_video.scaleY = stage.stageHeight / _stageHeight;
			//positionControls();

			repositionVideo();
		}

		// START: Fullscreen
		private function enterFullscreen():void {

			logMessage("enterFullscreen()");

			var screenRectangle:Rectangle = new Rectangle(0, 0, flash.system.Capabilities.screenResolutionX, flash.system.Capabilities.screenResolutionY);
			stage.fullScreenSourceRect = screenRectangle;

			stage.displayState = StageDisplayState.FULL_SCREEN;

			repositionVideo();
			positionControls();
			updateControls(HtmlMediaEvent.FULLSCREENCHANGE);

			_controlBar.visible = true;

			_isFullScreen = true;
		}

		private function exitFullscreen():void {

			stage.displayState = StageDisplayState.NORMAL;


			_controlBar.visible = false;

			_isFullScreen = false;
		}

		public function setFullscreen(gofullscreen:Boolean):void {

			logMessage("setFullscreen: " + gofullscreen.toString());

			try {
				//_fullscreenButton.visible = false;

				if (gofullscreen) {
					enterFullscreen();

				} else {
					exitFullscreen();
				}

			} catch (error:Error) {

				// show the button when the security error doesn't let it work
				//_fullscreenButton.visible = true;
				_fullscreenButton.alpha = 1;

				_isFullScreen = false;

				logMessage("error setting fullscreen: " + error.message.toString());
			}
		}

		// control bar button/icon
		public function fullScreenIconClick(e:MouseEvent):void {
			try {
				_controlBar.visible = true;
				setFullscreen(!_isFullScreen);
				repositionVideo();
			} catch (error:Error) {
			}
		}

		// special floating fullscreen icon
		public function fullscreenClick(e:MouseEvent):void {
			//_fullscreenButton.visible = false;
			_fullscreenButton.alpha = 0;

			try {
				_controlBar.visible = true;
				setFullscreen(true);
				repositionVideo();
				positionControls();
			} catch (error:Error) {
			}
		}


		public function stageFullScreenChanged(e:FullScreenEvent):void {
			logMessage("fullscreen event: " + e.fullScreen.toString());

			//_fullscreenButton.visible = false;
			_fullscreenButton.alpha = 0;
			_isFullScreen = e.fullScreen;

			sendEvent(HtmlMediaEvent.FULLSCREENCHANGE, "isFullScreen:" + e.fullScreen );

			if (!e.fullScreen) {
				_controlBar.visible = _alwaysShowControls;
			}
		}
		// END: Fullscreen

		// START: external interface
		public function playMedia():void {
			logMessage("play");
			_mediaElement.play();
		}

		public function loadMedia():void {
			logMessage("load");
			_mediaElement.load();
		}

		public function pauseMedia():void {
			logMessage("pause");
			_mediaElement.pause();
		}

		public function setSrc(url:String):void {
			logMessage("setSrc: " + url);
			_mediaElement.setSrc(url);
		}

		public function stopMedia():void {
			logMessage("stop");
			_mediaElement.stop();
		}

		public function setCurrentTime(time:Number):void {
			logMessage("seek: " + time.toString());
			_mediaElement.setCurrentTime(time);
		}

		public function setVolume(volume:Number):void {
			logMessage("volume: " + volume.toString());
			_mediaElement.setVolume(volume);
			toggleVolumeIcons(volume);
		}

		public function setMuted(muted:Boolean):void {
			logMessage("muted: " + muted.toString());
			_mediaElement.setMuted(muted);
			toggleVolumeIcons(_mediaElement.getVolume());
		}

		public function setVideoSize(width:Number, height:Number):void {
			logMessage("setVideoSize: " + width.toString() + "," + height.toString());

			_stageWidth = width;
			_stageHeight = height;

			if (_video != null) {
				repositionVideo();
				positionControls();
				//_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width - 10;
				logMessage("result: " + _video.width.toString() + "," + _video.height.toString());
			}


		}

		public function positionFullscreenButton(x:Number, y:Number, visibleAndAbove:Boolean ):void {

			logMessage("position FS: " + x.toString() + "x" + y.toString());

			// bottom corner
			/*
			_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width
			_fullscreenButton.y = stage.stageHeight - _fullscreenButton.height;
			*/

			// position just above
			if (visibleAndAbove) {
				_fullscreenButton.x = x+1;
				_fullscreenButton.y = y - _fullscreenButton.height+1;
			} else {
				_fullscreenButton.x = x;
				_fullscreenButton.y = y;
			}

			// check for oversizing
			if ((_fullscreenButton.x + _fullscreenButton.width) > stage.stageWidth)
				_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width;

			// show it!
			if (visibleAndAbove) {
				_fullscreenButton.alpha = 1;
			}
		}

		public function hideFullscreenButton():void {

			//_fullscreenButton.visible = false;
			_fullscreenButton.alpha = 0;
		}

		// END: external interface


		private function repositionVideo():void {
            var fullscreen:Boolean;

			if (stage.displayState == "fullScreen") {
				fullscreen = true;
			} else {
				fullscreen = false;
			}

			logMessage("positioning video "+stage.displayState);

			if (_mediaElement is VideoElement || _mediaElement is HLSMediaElement) {

				if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
					logMessage("ERR: I dont' have the native dimension");
					return;
				}

				// calculate ratios
				var stageRatio:Number, nativeRatio:Number;

				_video.x = 0;
				_video.y = 0;

				if(fullscreen == true) {
					stageRatio = flash.system.Capabilities.screenResolutionX/flash.system.Capabilities.screenResolutionY;
					nativeRatio = _nativeVideoWidth/_nativeVideoHeight;

					// adjust size and position
					if (nativeRatio > stageRatio) {
						_mediaElement.setSize(flash.system.Capabilities.screenResolutionX, _nativeVideoHeight * flash.system.Capabilities.screenResolutionX / _nativeVideoWidth);
						_video.y = flash.system.Capabilities.screenResolutionY/2 - _video.height/2;
					} else if (stageRatio > nativeRatio) {
						_mediaElement.setSize(_nativeVideoWidth * flash.system.Capabilities.screenResolutionY / _nativeVideoHeight, flash.system.Capabilities.screenResolutionY);
						_video.x = flash.system.Capabilities.screenResolutionX/2 - _video.width/2;
					} else if (stageRatio == nativeRatio) {
						_mediaElement.setSize(flash.system.Capabilities.screenResolutionX, flash.system.Capabilities.screenResolutionY);
					}

				} else {
					stageRatio = _stageWidth/_stageHeight;
					nativeRatio = _nativeVideoWidth/_nativeVideoHeight;

					// adjust size and position
					if (nativeRatio > stageRatio) {
						_mediaElement.setSize(_stageWidth, _nativeVideoHeight * _stageWidth / _nativeVideoWidth);
						_video.y = _stageHeight/2 - _video.height/2;
					} else if (stageRatio > nativeRatio) {
						_mediaElement.setSize( _nativeVideoWidth * _stageHeight / _nativeVideoHeight, _stageHeight);
						_video.x = _stageWidth/2 - _video.width/2;
					} else if (stageRatio == nativeRatio) {
						_mediaElement.setSize(_stageWidth, _stageHeight);
					}

				}

			} else if (_mediaElement is YouTubeElement || _mediaElement is DailyMotionElement) {
				if(fullscreen == true) {
					_mediaElement.setSize(flash.system.Capabilities.screenResolutionX, flash.system.Capabilities.screenResolutionY);

				} else {
					_mediaElement.setSize(_stageWidth, _stageHeight);

				}

			}

			positionControls();
		}

		// SEND events to JavaScript
		public function sendEvent(eventName:String, eventValues:String):void {

			// special video event
			if (eventName == HtmlMediaEvent.LOADEDMETADATA && _isVideo) {

				logMessage("METADATA RECEIVED: ");

				try {
					if (_mediaElement is VideoElement) {
						_nativeVideoWidth = (_mediaElement as VideoElement).videoWidth;
						_nativeVideoHeight = (_mediaElement as VideoElement).videoHeight;
					} else if(_mediaElement is HLSMediaElement) {
						_nativeVideoWidth = (_mediaElement as HLSMediaElement).videoWidth;
						_nativeVideoHeight = (_mediaElement as HLSMediaElement).videoHeight;

						// Can not get video dimensions from HLS stream, use parameters in FlashVars instead.
						if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
							_nativeVideoWidth = _paramVideoWidth;
							_nativeVideoHeight = _paramVideoHeight;
						}
					}
				} catch (e:Error) {
					logMessage(e.toString());
				}

				logMessage(_nativeVideoWidth.toString() + "x" + _nativeVideoHeight.toString());


				if(stage.displayState == "fullScreen" ) {
					setVideoSize(_nativeVideoWidth, _nativeVideoHeight);
				}
				repositionVideo();

			}

			updateControls(eventName);

			//trace((_mediaElement.duration()*1).toString() + " / " + (_mediaElement.currentTime()*1).toString());
			//trace("CurrentProgress:"+_mediaElement.currentProgress());

			if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {

				//logMessage("event:" + eventName + " : " + eventValues);
				//trace("event", eventName, eventValues);

				if (eventValues == null)
					eventValues == "";

				if (_isVideo) {
					eventValues += (eventValues != "" ? "," : "") + "isFullScreen:" + _isFullScreen;
				}

				eventValues = "{" + eventValues + "}";

				/*
				OLD DIRECT METHOD
				ExternalInterface.call(
					"function(id, name) { mejs.MediaPluginBridge.fireEvent(id,name," + eventValues + "); }",
					ExternalInterface.objectID,
					eventName);
				*/

				// use set timeout for performance reasons
				//if (!_alwaysShowControls) {
					ExternalInterface.call("setTimeout", _jsCallbackFunction + "('" + ExternalInterface.objectID + "','" + eventName + "'," + eventValues + ")",0);
				//}
			}
		}


		private function updateControls(eventName:String):void {

			//trace("updating controls");

			try {
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

				if (eventName == HtmlMediaEvent.TIMEUPDATE ||
					eventName == HtmlMediaEvent.PROGRESS ||
					eventName == HtmlMediaEvent.FULLSCREENCHANGE) {

					//_duration.text = (_mediaElement.duration()*1).toString();
					_duration.text =  secondsToTimeCode(_mediaElement.duration());
					//_currentTime.text = (_mediaElement.currentTime()*1).toString();
					_currentTime.text =  secondsToTimeCode(_mediaElement.currentTime());

					var pct:Number =  (_mediaElement.currentTime() / _mediaElement.duration()) *_scrubTrack.scaleX;

					_scrubBar.scaleX = pct;
					_scrubLoaded.scaleX = (_mediaElement.currentProgress()*_scrubTrack.scaleX)/100;
				}
			} catch (error:Error) {
				trace("error: " + error.toString());

			}

		}

		// START: utility
		private function secondsToTimeCode(seconds:Number):String {
			var timeCode:String = "";
			seconds = Math.round(seconds);
			var minutes:Number = Math.floor(seconds / 60);
			timeCode = (minutes >= 10) ? minutes.toString() : "0" + minutes.toString();
			seconds = Math.floor(seconds % 60);
			timeCode += ":" + ((seconds >= 10) ? seconds.toString() : "0" + seconds.toString());
			return timeCode; //minutes.toString() + ":" + seconds.toString();
		}

		private function applyColor(item:Object, color:String):void {

			var myColor:ColorTransform = new ColorTransform(0, 0, 0, 1);
      var components:Array = color.split(",");
      switch (components.length) {
        case 4:
          myColor.redOffset = components[0];
          myColor.greenOffset = components[1];
          myColor.blueOffset = components[2];
          myColor.alphaMultiplier = components[3];
          break;

        case 3:
          myColor.redOffset = components[0];
          myColor.greenOffset = components[1];
          myColor.blueOffset = components[2];
          break;

        default:
          myColor.color = Number(color);
          break;
      }
//      trace("Length: "+components.length+" String: "+color+" transform: "+myColor.toString());
			item.transform.colorTransform = myColor;
		}
		// END: utility

	}
}
