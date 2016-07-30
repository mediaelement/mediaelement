package {
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

	[SWF(backgroundColor="0x000000")] // Set SWF background color
	public class FlashMediaElement extends MovieClip {

		private var _mediaUrl:String;
		private var _autoplay:Boolean;
		private var _preload:String;
		private var _debug:Boolean = false;
		private var _isVideo:Boolean;
		private var _video:DisplayObject;
		private var _timerRate:Number;
		private var _enableSmoothing:Boolean;
		private var _allowedPluginDomain:String;
		private var _isFullScreen:Boolean = false;
		private var _startVolume:Number;
		private var _streamer:String = "";
		private var _enablePseudoStreaming:Boolean;
		private var _pseudoStreamingStartQueryParam:String;
		private var _fill:Boolean;

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

		// CONTROLS
		private var _alwaysShowControls:Boolean;
		private var _controlsStyle:String;
		private var _controlsAutoHide:Boolean = true;
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

			if (isIllegalQuerystring()) {
				return;
			}

			// allows this player to be called from a different domain than the HTML page hosting the player
			CONFIG::cdnBuild {
				Security.allowDomain("*");
				Security.allowInsecureDomain('*');
			}

			var params:Object = LoaderInfo(this.root.loaderInfo).parameters;

			CONFIG::debugBuild {
				_debug = (params['debug'] != undefined) ? (String(params['debug']) == "true") : false;
			}
			if (_debug) {
				// add debug output
				var _outputFormat:TextFormat = new TextFormat();
				_outputFormat.size = 14;
				_outputFormat.bold = true;
				_output = new TextField();
				_output.defaultTextFormat = _outputFormat;
				_output.textColor = 0xeeeeee;
				_output.width = stage.stageWidth;
				_output.height = stage.stageHeight;
				_output.multiline = true;
				_output.wordWrap = true;
				_output.border = false;
				_output.filters = [new DropShadowFilter(1, 0x000000, 45, 1, 2, 2, 1)];
				_output.text = "Initializing Flash...\n";
				_output.visible = _debug;
				addChild(_output);
			}
			_mediaUrl = (params['file'] != undefined) ? String(params['file']) : "";
			_autoplay = (params['autoplay'] != undefined) ? (String(params['autoplay']) == "true") : false;
			_isVideo = (params['isvideo'] != undefined) ? ((String(params['isvideo']) == "false") ? false : true  ) : true;
			_timerRate = (params['timerrate'] != undefined) ? (parseInt(params['timerrate'], 10)) : 250;
			_enableSmoothing = (params['smoothing'] != undefined) ? (String(params['smoothing']) == "true") : false;
			_startVolume = (params['startvolume'] != undefined) ? (parseFloat(params['startvolume'])) : 0.8;
			_preload = (params['preload'] != undefined) ? params['preload'] : "none";
			_alwaysShowControls = (params['controls'] != undefined) ? (String(params['controls']) == "true") : false;
			_controlsStyle = (params['controlstyle'] != undefined) ? (String(params['controlstyle'])) : ""; // blank or "floating"
			_controlsAutoHide = (params['autohide'] != undefined) ? (String(params['autohide']) == "true") : true;
			_scrubTrackColor = (params['scrubtrackcolor'] != undefined) ? (String(params['scrubtrackcolor'])) : "0x333333";
			_scrubBarColor = (params['scrubbarcolor'] != undefined) ? (String(params['scrubbarcolor'])) : "0xefefef";
			_scrubLoadedColor = (params['scrubloadedcolor'] != undefined) ? (String(params['scrubloadedcolor'])) : "0x3CACC8";
			_enablePseudoStreaming = (params['pseudostreaming'] != undefined) ? (String(params['pseudostreaming']) == "true") : false;
			_pseudoStreamingStartQueryParam = (params['pseudostreamstart'] != undefined) ? (String(params['pseudostreamstart'])) : "start";
			_streamer = (params['flashstreamer'] != undefined) ? (String(params['flashstreamer'])) : "";
			_fill = (params['fill'] != undefined) ? (String(params['fill']) == "true") : false;

			// always show controls for audio files
			if (!_isVideo && _alwaysShowControls)
				_controlsAutoHide = false;

			if (isNaN(_timerRate))
				_timerRate = 250;

			// setup stage and player sizes/scales
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
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

			// create media element
			if (_mediaUrl.search(/(https?|file)\:\/\/.*?\.m3u8(\?.*)?/i) !== -1) {
				_mediaElement = new HLSMediaElement(this, _autoplay, _preload, _timerRate, _startVolume);
				_video = (_mediaElement as HLSMediaElement).video;
				_video.width = stage.stageWidth;
				_video.height = stage.stageHeight;
				(_video as Video).smoothing = _enableSmoothing;
				addChild(_video);

				_paramVideoWidth = (params['width'] != undefined) ? (parseInt(params['width'], 10)) : 0;
				_paramVideoHeight = (params['height'] != undefined) ? (parseInt(params['height'], 10)) : 0;

			}else if (_isVideo) {
				if (_mediaUrl.indexOf("youtube.com") > -1 || _mediaUrl.indexOf("youtu.be") > -1) {
					//Security.allowDomain("http://www.youtube.com");

					_mediaElement = new YouTubeElement(this, _autoplay, _preload, _timerRate, _startVolume);
					_video = (_mediaElement as YouTubeElement).player;

					// these are set and then used once the player is loaded
					(_mediaElement as YouTubeElement).initWidth = stage.stageWidth;
					(_mediaElement as YouTubeElement).initHeight = stage.stageHeight;

				} else if (_mediaUrl.indexOf("dailymotion.com") > -1 || _mediaUrl.indexOf("dai.ly") > -1) {
					Security.allowDomain("http://www.dailymotion.com");

					_mediaElement = new DailyMotionElement(this, _autoplay, _preload, _timerRate, _startVolume);
					_video = (_mediaElement as DailyMotionElement).player;

					// these are set and then used once the player is loaded
					(_mediaElement as DailyMotionElement).initWidth = stage.stageWidth;
					(_mediaElement as DailyMotionElement).initHeight = stage.stageHeight;

				} else {
					_mediaElement = new VideoElement(this, _autoplay, _preload, _timerRate, _startVolume, _streamer);
					_video = (_mediaElement as VideoElement).video;
					_video.width = stage.stageWidth;
					_video.height = stage.stageHeight;
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

			buildControls();
						
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
			logMessage("ExternalInterface.objectID: " + ((ExternalInterface.objectID != null) ? ExternalInterface.objectID.toString() : "null"));

			if (_mediaUrl != "") {
				_mediaElement.setSrc(_mediaUrl);
			}

			if (_output != null) {
				addChild(_output);
			}
			if (_alwaysShowControls) {
				positionControls();
				// Fire this once just to set the width on some dynamically sized scrub bar items;
				_scrubBar.scaleX=0;
				_scrubLoaded.scaleX=0;
			}

			if (ExternalInterface.available) {
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
						ExternalInterface.call(ExternalInterface.objectID + '_init');
						logMessage("Init js function \"" + ExternalInterface.objectID + '_init' + "\" successfully called.");
					}
					else {
						logMessage("ExternalInterface has no object id:");
					}
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

		private function removeControls():void {
			try {
				_fullscreenButton = _mediaElementDisplay.getChildByName("fullscreen_btn") as SimpleButton;
				_fullscreenButton.parent.removeChild(_fullscreenButton);
				_controlBar = _mediaElementDisplay.getChildByName("controls_mc") as MovieClip;
				_controlBar.parent.removeChild(_controlBar);
			} catch (error:Error) {
				logMessage("Failed to remove controls: " + error.message);
			}
		}

		private function buildControls():void {
			_fullscreenButton = _mediaElementDisplay.getChildByName("fullscreen_btn") as SimpleButton;
			_fullscreenButton.visible = _isVideo;
			_fullscreenButton.alpha = 0;
			_fullscreenButton.addEventListener(MouseEvent.CLICK, fullscreenClick, false);
			_fullscreenButton.x = stage.stageWidth - _fullscreenButton.width;
			_fullscreenButton.y = 0;

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
			_fullscreenIcon.addEventListener(MouseEvent.CLICK, fullScreenIconClick, false);

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

			if (_controlsAutoHide) {
				// Add mouse activity for show/hide of controls
				stage.addEventListener(Event.MOUSE_LEAVE, mouseActivityLeave);
				stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseActivityMove);
				_inactiveTime = 2500;
				_timer = new Timer(_inactiveTime)
				_timer.addEventListener(TimerEvent.TIMER, idleTimer);
				_timer.start();
			}

			if (_startVolume <= 0) {
				logMessage("INITIAL VOLUME: "+_startVolume+" MUTED");
				_volumeMuted.visible=true;
				_volumeUnMuted.visible=false;
			} else {
				logMessage("INITIAL VOLUME: "+_startVolume+" UNMUTED");
				_volumeMuted.visible=false;
				_volumeUnMuted.visible=true;
			}

			_controlBar.visible = _alwaysShowControls;

			setControlDepth();
		}

		public function setControlDepth():void {
			//if (!_alwaysShowControls) {
			//	return;
			//}
			// put these on top
			if (_output != null) {
				addChild(_output);
			}
			addChild(_controlBar);
			addChild(_fullscreenButton);
		}

		public function logMessage(txt:String):void {
			if (!_debug) {
				return;
			}
			
			ExternalInterface.call("console.log", txt);
			
			if (_output != null) {
				_output.appendText(txt + "\n");
				if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {
					var pattern:RegExp = /'/g; //'
					ExternalInterface.call("setTimeout", ExternalInterface.objectID + "_event('message','" + txt.replace(pattern, "’") + "')", 0);
				}
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

		private static function trim(str:String) : String {
			if (!str) {
				return str;
			}

			return str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
		}

		// START: Controls and events
		private function mouseActivityMove(event:MouseEvent):void {

			// if mouse is in the video area
			if (_controlsAutoHide && (mouseX>=0 && mouseX<=stage.stageWidth) && (mouseY>=0 && mouseY<=stage.stageHeight)) {
				// This could be move to a nice fade at some point...
				_controlBar.visible = (_alwaysShowControls || _isFullScreen);
				_isMouseActive = true;
				_idleTime = 0;
				_timer.reset();
				_timer.start()
			}
		}

		private function mouseActivityLeave(event:Event):void {
			if (_controlsAutoHide) {
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
			if (_controlsAutoHide) {
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
		}

		private function scrubOver(event:MouseEvent):void {
			_hoverTime.y = _scrubBar.y-(_hoverTime.height/2)+1;
			_hoverTime.visible = true;
			//logMessage(event);
		}

		private function scrubOut(event:MouseEvent):void {
			_hoverTime.y = _scrubBar.y+(_hoverTime.height/2)+1;
			_hoverTime.visible = false;
			//_hoverTime.x=0;
			//logMessage(event);
		}

		private function scrubClick(event:MouseEvent):void {
			//logMessage(event);
			var seekBarPosition:Number = ((event.localX / _scrubTrack.width) * _mediaElement.duration()) * _scrubTrack.scaleX;

			var canSeekToPosition:Boolean = isNaN(_mediaElement.seekLimit()) ||  (seekBarPosition <= _mediaElement.duration() && seekBarPosition >= 0);

			if (canSeekToPosition) {
				_mediaElement.setCurrentTime(seekBarPosition);
			}
		}

		public function toggleVolume(event:MouseEvent):void {
			//logMessage(event.currentTarget.name);
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
			if (volume <= 0) {
				_volumeMuted.visible = true;
				_volumeUnMuted.visible = false;
			} else {
				_volumeMuted.visible = false;
				_volumeUnMuted.visible = true;
			}
		}

		private function positionControls(forced:Boolean=false):void {
			//if (!_alwaysShowControls) {
			//	return;
			//}
			
			
			
			var contWidth:Number;
			var contHeight:Number;
			if (_isFullScreen) {
				contWidth = stage.fullScreenWidth;
				contHeight = stage.fullScreenHeight;
			} else {
				contWidth = stage.stageWidth;
				contHeight = stage.stageHeight;
			}

			if (_controlsStyle.toUpperCase() == "FLOATING" && _isFullScreen) {
				trace("CONTROLS: floating");
				_hoverTime.y=(_hoverTime.height/2)+1;
				_hoverTime.x=0;
				_controlBarBg.width = 300;
				_controlBarBg.height = 93;
				//_controlBarBg.x = (contWidth/2) - (_controlBarBg.width/2);
				//_controlBarBg.y  = contHeight - 300;

				_pauseButton.scaleX = _playButton.scaleX=3.5;
				_pauseButton.scaleY= _playButton.scaleY=3.5;
				// center the play button and make it big and at the top
				_pauseButton.x = _playButton.x = (_controlBarBg.width/2)-(_playButton.width/2)+7;
				_pauseButton.y = _playButton.y = _controlBarBg.height-_playButton.height-(14)

				_controlBar.x = (contWidth/2) -150;
				_controlBar.y = contHeight - _controlBar.height-100;

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
				_controlBarBg.width = contWidth;
				_controlBar.y = contHeight - _controlBar.height;
				_duration.x = contWidth - _duration.width - 10;
				//_currentTime.x = contWidth - _duration.width - 10 - _currentTime.width - 10;
				_currentTime.x = _playButton.x+_playButton.width;
				_scrubTrack.width = (_duration.x-_duration.width-10)-_duration.width+10;
				_scrubOverlay.width = _scrubTrack.width;
				_scrubBar.width = _scrubTrack.width;
				*/

				// FLOATING MODE BOTTOM DISPLAY - similar to normal
				trace("THAT WAY!");
				_hoverTime.y=(_hoverTime.height/2)+1;
				_hoverTime.x=0;
				_controlBarBg.width = contWidth;
				_controlBarBg.height = 30;
				_controlBarBg.y=0;
				_controlBarBg.x=0;
				// _controlBarBg.x = 0;
				// _controlBarBg.y  = contHeight - _controlBar.height;

				_pauseButton.scaleX = _playButton.scaleX=1;
				_pauseButton.scaleY = _playButton.scaleY=1;

				_pauseButton.x = _playButton.x = 7;
				_pauseButton.y = _playButton.y = _controlBarBg.height-_playButton.height-2;


				//_currentTime.x = contWidth - _duration.width - 10 - _currentTime.width - 10;
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
				_controlBar.y = contHeight - _controlBar.height;
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
			repositionVideo();
		}

		// START: Fullscreen
		private function enterFullscreen():void {
			logMessage("enterFullscreen()");

			var screenRectangle:Rectangle = new Rectangle(0, 0, stage.fullScreenWidth, stage.fullScreenHeight);
			stage.fullScreenSourceRect = screenRectangle;

			stage.displayState = StageDisplayState.FULL_SCREEN;

			repositionVideo();

			//if (_alwaysShowControls) {
				_controlBar.visible = true;
				updateControls(HtmlMediaEvent.FULLSCREENCHANGE);				
			//}

			_isFullScreen = true;
		}

		private function exitFullscreen():void {
			stage.displayState = StageDisplayState.NORMAL;

			repositionVideo();

			if (!_alwaysShowControls) {
				_controlBar.visible = false;
			}

			_isFullScreen = false;
		}

		public function setFullscreen(gofullscreen:Boolean):void {

			logMessage("setFullscreen: " + gofullscreen.toString());

			try {
				if (gofullscreen) {
					enterFullscreen();
				} else {
					exitFullscreen();
				}
			} catch (error:Error) {
				// show the button when the security error doesn't let it work
				if (_fullscreenButton != null) {
					_fullscreenButton.alpha = 1;
				}

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
			hideFullscreenButton();

			try {
				//if (_alwaysShowControls) {
					_controlBar.visible = true;
				//}
				setFullscreen(true);
				repositionVideo();
				positionControls();
			} catch (error:Error) {
			}
		}


		public function stageFullScreenChanged(e:FullScreenEvent):void {
			logMessage("fullscreen event: " + e.fullScreen.toString());

			_isFullScreen = e.fullScreen;
			
			if (!_isFullScreen) {
				_controlBar.visible = _alwaysShowControls;
			}			
			
			repositionVideo();			
			hideFullscreenButton();

			sendEvent(HtmlMediaEvent.FULLSCREENCHANGE, "isFullScreen:" + e.fullScreen );


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

			if (_video != null) {
				_nativeVideoWidth = width;
				_nativeVideoHeight = height;
				repositionVideo();
				positionControls();
				logMessage("result: " + _video.width.toString() + "," + _video.height.toString());
			}
		}

		public function positionFullscreenButton(x:Number, y:Number, visibleAndAbove:Boolean ):void {
			logMessage("position FS: " + x.toString() + "x" + y.toString());
			//if (!_fullscreenButton)
			//	return;

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
			if (_fullscreenButton != null) {
				_fullscreenButton.alpha = 0;
			}
		}
		// END: external interface

		private function repositionVideo():void {
			var fill:Boolean = _fill;
			var contWidth:Number;
			var contHeight:Number;
			if (_isFullScreen) {
				contWidth = stage.fullScreenWidth;
				contHeight = stage.fullScreenHeight;
			} else {
				contWidth = stage.stageWidth;
				contHeight = stage.stageHeight;
			}

			logMessage("Positioning video ("+stage.displayState+"). Container size: "+contWidth+"x"+contHeight+".");

			if (_mediaElement is VideoElement || _mediaElement is HLSMediaElement) {
				if (_isFullScreen && fill) {
					fill = false;
				}
				if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
					logMessage("Positionning: video's native dimension not found, using stage size.");
					fill = true;
				}
				// calculate ratios
				var stageRatio:Number, nativeRatio:Number;
				_video.x = 0;
				_video.y = 0;
				if (fill) {
					_mediaElement.setSize(contWidth, contHeight);
				} else {
					stageRatio = contWidth/contHeight;
					nativeRatio = _nativeVideoWidth/_nativeVideoHeight;
					// adjust size and position
					if (nativeRatio > stageRatio) {
						_mediaElement.setSize(contWidth, _nativeVideoHeight * contWidth / _nativeVideoWidth);
						_video.y = contHeight/2 - _video.height/2;
					} else if (stageRatio > nativeRatio) {
						_mediaElement.setSize(_nativeVideoWidth * contHeight / _nativeVideoHeight, contHeight);
						_video.x = contWidth/2 - _video.width/2;
					} else if (stageRatio == nativeRatio) {
						_mediaElement.setSize(contWidth, contHeight);
					}
				}
			} else if (_mediaElement is YouTubeElement || _mediaElement is DailyMotionElement) {
				_mediaElement.setSize(contWidth, contHeight);
			}
			positionControls();
		}

		// SEND events to JavaScript
		public function sendEvent(eventName:String, eventValues:String):void {

			// special video event
			if (eventName == HtmlMediaEvent.LOADEDMETADATA && _isVideo) {

				logMessage("Metadata received:");

				try {
					if (_mediaElement is VideoElement) {
						_nativeVideoWidth = (_mediaElement as VideoElement).videoWidth;
						_nativeVideoHeight = (_mediaElement as VideoElement).videoHeight;
					} else if (_mediaElement is HLSMediaElement) {
						_nativeVideoWidth = (_mediaElement as HLSMediaElement).videoWidth;
						_nativeVideoHeight = (_mediaElement as HLSMediaElement).videoHeight;

						// Can not get video dimensions from HLS stream, use parameters in FlashVars instead.
						if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
							_nativeVideoWidth = _paramVideoWidth;
							_nativeVideoHeight = _paramVideoHeight;
						}
					}
				} catch (e:Error) {
					logMessage("    No resolution: " + e.toString());
				}

				logMessage("    Resolution: " + _nativeVideoWidth.toString() + "x" + _nativeVideoHeight.toString());

				if (_isFullScreen) {
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

				// use set timeout for performance reasons
				ExternalInterface.call("setTimeout", ExternalInterface.objectID + '_event' + "('" + eventName + "'," + eventValues + ")", 0);
			}
		}


		private function updateControls(eventName:String):void {
			//if (!_controls.visible) {
			//	return;
			//}

			logMessage("updating controls");
			try {
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
				logMessage("Failed to update controls: " + error.toString());
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
			//trace("Length: "+components.length+" String: "+color+" transform: "+myColor.toString());
			item.transform.colorTransform = myColor;
		}
		// END: utility
	}
}