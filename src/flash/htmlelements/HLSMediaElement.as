package htmlelements
{
  import flash.display.Sprite;

  import org.mangui.HLS.HLS;
  import org.mangui.HLS.HLSEvent;

public class HLSMediaElement extends Sprite implements IMediaElement {

    private var _element:FlashMediaElement;
    private var _autoplay:Boolean = true;
    private var _preload:String = "";
    private var _preMuteVolume:Number = 0;
    private var _hls:HLS;
    private var _url:String;

  // event values
  private var _position:Number = 0;
  private var _duration:Number = 0;
  private var _framerate:Number;
  private var _isPaused:Boolean = true;
  private var _isEnded:Boolean = false;
  private var _volume:Number = 1;
  private var _isMuted:Boolean = false;

  private var _bytesLoaded:Number = 0;
  private var _bytesTotal:Number = 0;
  private var _bufferedTime:Number = 0;
  private var _bufferEmpty:Boolean = false;
  private var _bufferingChanged:Boolean = false;
  private var _seekOffset:Number = 0;


  private var _videoWidth:Number = -1;
  private var _videoHeight:Number = -1;


    public function HLSMediaElement(element:FlashMediaElement, autoplay:Boolean, preload:String, timerRate:Number, startVolume:Number)
    {
      _element = element;
      _autoplay = autoplay;
      _volume = startVolume;
      _preload = preload;
      _video = new Video();
      addChild(_video);
      _hls = new HLS();
      _hls.addEventListener(HLSEvent.PLAYBACK_COMPLETE,_completeHandler);
      _hls.addEventListener(HLSEvent.ERROR,_errorHandler);
      _hls.addEventListener(HLSEvent.MANIFEST_LOADED,_manifestHandler);
      _hls.addEventListener(HLSEvent.MEDIA_TIME,_mediaTimeHandler);
      _hls.addEventListener(HLSEvent.STATE,_stateHandler);
      _hls.stream.soundTransform = new SoundTransform(_volume);
      video.attachNetStream(_hls.stream);
    }

    private function _completeHandler(event:HLSEvent):void {
      _isEnded = true;
      _isPaused = false;
      sendEvent(HtmlMediaEvent.ENDED);
    };

    private function _errorHandler(event:HLSEvent):void {
    };

    private function _manifestHandler(event:HLSEvent):void {
      _duration = event.levels[0].duration;
      sendEvent(HtmlMediaEvent.LOADEDDATA);
      sendEvent(HtmlMediaEvent.CANPLAY);
    };

    private function _mediaTimeHandler(event:HLSEvent):void {
      _position = event.mediatime.position;
      _duration = event.mediatime.duration;
      _bufferedTime = event.mediatime.buffer;
      sendEvent(HtmlMediaEvent.PROGRESS);
      sendEvent(HtmlMediaEvent.TIMEUPDATE);
    };

    private function _stateHandler(event:HLSEvent):void {
      switch(event.state) {
          case HLSStates.IDLE:
            break;
          case HLSStates.BUFFERING:
            break;
          case HLSStates.PLAYING:
            _video.visible = true;
            sendEvent(HtmlMediaEvent.PLAY);
            sendEvent(HtmlMediaEvent.PLAYING);
            break;
          case HLSStates.PAUSED:
            sendEvent(HtmlMediaEvent.PAUSE);
            break;
      }
    };

    public function play():void {
      _hls.stream.play();
    }

    public function pause():void {
      _hls.stream.pause();
    }

    public function load():void{
      if(_url) {
        sendEvent(HtmlMediaEvent.LOADSTART);
        _hls.load(_url);
      }
    }

    public function stop():void{
      _hls.stream.close();
    }

    public function setSrc(url:String):void{
      _url = url;
    }

    public function setSize(width:Number, height:Number):void{
    _video.width = width;
    _video.height = height;
    }

    public function setCurrentTime(pos:Number):void{
      sendEvent(HtmlMediaEvent.SEEKING);
      _hls.stream.seek(pos);
    }

    public function setVolume(vol:Number):void{
      _volume = vol;
      _isMuted = (_volume == 0);
      _hls.stream.soundTransform = new SoundTransform(vol);
      sendEvent(HtmlMediaEvent.VOLUMECHANGE);
    }

    public function getVolume():Number {
      if(_isMuted) {
        return 0;
      } else {
        return _volume;
      }
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

    public function duration():Number{
      return _duration;
    }

    public function currentTime():Number{
      return _position;
    }

    public function currentProgress():Number{
    }

  private function sendEvent(eventName:String) {

    // build JSON
    var values:String =
      "duration:" + _duration +
        ",framerate:" + _hls.stream.framerate +
        ",currentTime:" + _position +
        ",muted:" + _isMuted +
        ",paused:" + _isPaused +
        ",ended:" + _isEnded +
        ",volume:" + _volume +
        ",src:\"" + _url + "\"" +
        ",bytesTotal:" + Math.round(1000*_duration) +
        ",bufferedBytes:" + Math.round(1000*_(_position+_bufferedTime)) +
        ",bufferedTime:" + _bufferedTime +
        ",videoWidth:" + _videoWidth +
        ",videoHeight:" + _videoHeight +
        "";
    _element.sendEvent(eventName, values);
  }

  }
}
