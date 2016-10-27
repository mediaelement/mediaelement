package com.automatastudios.audio.audiodecoder {
	import com.automatastudios.audio.audiodecoder.decoders.AudioInfo;
	import com.automatastudios.audio.audiodecoder.decoders.IDecoder;
	
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.errors.EOFError;
	import flash.net.URLStream;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	import flash.utils.IDataInput;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.Socket;
	
	public class AudioDecoder extends EventDispatcher {
		private var _decoder:IDecoder;
		private var _sound:Sound;
		private var _soundChannel:SoundChannel;
		
		public function AudioDecoder():void {
			_sound = new Sound();
		}
		
		public function load(data:IDataInput, decoder:Class, bufferSize:uint = 1000, progressEventName:String = null):void {
			if (progressEventName == null) {
				if (data is URLStream) {
					progressEventName = ProgressEvent.PROGRESS;
				} else if (data is Socket) {
					progressEventName = ProgressEvent.SOCKET_DATA;
				}
			}
			
			_sound.addEventListener("sampleData", onSamplesRequest);
			
			_decoder = (new decoder() as IDecoder);
			_decoder.addEventListener(Event.INIT, onDecoderInit);
			_decoder.addEventListener(Event.COMPLETE, onDecoderComplete);
			_decoder.addEventListener(IOErrorEvent.IO_ERROR, onDecoderIOError);
			
			_decoder.init(data, bufferSize, progressEventName);
		}

		public function play():SoundChannel {
			_soundChannel = _sound.play();
			return _soundChannel;
		}
		
		public function get sound():Sound {
			return _sound;
		}

		public function get audioInfo():AudioInfo {
			return _decoder.getAudioInfo();
		}

		public function getTotalTime():Number {
			return _decoder.getTotalTime();
		}
		
		public function getPosition():Number {
			return _decoder.getPosition();
		}

		private function onDecoderInit(event:Event):void {
			dispatchEvent(event);
		}
		
		private function onDecoderComplete(event:Event):void {
			dispatchEvent(event);
		}
		
		private function onDecoderIOError(event:IOErrorEvent):void {
			dispatchEvent(event);
		}
		
		private function onSamplesRequest(event:*):void {
			_decoder.getSamples(event.position, 4096, event.data); 
		}

	}
}