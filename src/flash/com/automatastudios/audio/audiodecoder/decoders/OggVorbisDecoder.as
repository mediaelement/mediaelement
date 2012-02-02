package com.automatastudios.audio.audiodecoder.decoders {
	import cmodule.oggvorbis.CLibInit;	

	import flash.errors.EOFError;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.errors.EOFError;
	import flash.net.URLStream;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	import flash.utils.IDataInput;		
	
	public class OggVorbisDecoder extends EventDispatcher implements IDecoder{
		private static const READ_ERROR:int = -128;
		private static const READ_NOT_VORBIS:int = -132;
		private static const READ_VERSION:int = -134;
		private static const READ_BAD_HEADER:int = -133;
		private static const READ_FAULT:int = -129;
		
		private static var decoder:*;
		private var _rawData:IDataInput;
		private var _data:ByteArray;
		private var _bufferSize:uint;
		private var _vorbisFileId:int;
		
		private var _position:uint
		private var _bytesTotal:uint;
		
		private var _audioInfo:AudioInfo;
		private var _convertMethod:Function;
		
		private var _nextMethod:Function;
		
		public function OggVorbisDecoder():void {
			// do nothing, wait for init
		}
		
		public function init(data:IDataInput, bufferSize:uint, progressEventName:String):void {
			var libInit:CLibInit;
			
			_nextMethod = setupDecoder;
			
			_rawData = data;
			_data = new ByteArray();
			_bufferSize = bufferSize;
			
			if (decoder == null) {
				libInit = new CLibInit();
				decoder = libInit.init();			
			}
			
				
			if (_rawData is ByteArray) {
				_bytesTotal = (_rawData as ByteArray).length;
				_data.length = _bytesTotal;
			}
				
			if (progressEventName != null) {
				(data as EventDispatcher).addEventListener(progressEventName, onDataProgress);
			} else {
				_nextMethod();
			}			
		}
			
		public function getSamples(position:Number, numSamples:uint, sampleData:ByteArray):void {
			var numBytes:uint = numSamples * _audioInfo.blockAlign / _audioInfo.sampleMultiplier;
			var dataReadSize:int;
			var sampleReadSize:int;
			var rawSampleData:ByteArray = new ByteArray();
			var i:uint;
			
			rawSampleData.endian = Endian.LITTLE_ENDIAN;
			
			dataReadSize = decoder.getSampleData(_vorbisFileId, numBytes, rawSampleData);
			
			sampleReadSize = dataReadSize/_audioInfo.blockAlign;
			
			if (dataReadSize == -1) {
				dispatchEvent(new Event(Event.COMPLETE));
			} else {
				_position += dataReadSize;
				rawSampleData.position = 0;

				_convertMethod(sampleReadSize, rawSampleData, sampleData);
				// pad with extra 0s as needed
				for (i=sampleReadSize * _audioInfo.sampleMultiplier; i<numSamples; ++i) {
					sampleData.writeFloat(0);
					sampleData.writeFloat(0);
				}
			}
		}
		
		public function getAudioInfo():AudioInfo {
			return _audioInfo; 
		}
		
		public function getTotalTime():Number {
			return decoder.getLength(_vorbisFileId);
		}
		
		public function getPosition():Number {
			return decoder.getPosition(_vorbisFileId);
		}
		
		private function onDataProgress(event:ProgressEvent):void {
			var size:uint
			
			// need to move the data into a proper ByteArray
			// FlaCC only works with ByteArrays at this timessss
			_rawData.readBytes(_data, _data.length, _rawData.bytesAvailable);
			
			_bytesTotal = event.bytesTotal;

			_position += size;
			
			if (_nextMethod != null) {
				if (_bytesTotal > 0 && _data.bytesAvailable >= _bufferSize || _data.length == _bytesTotal) {
					
					_nextMethod();
				}
			}
		}
		
		private function setupDecoder():void {
			var result:int
			
			result = decoder.setupDecoder(_data, _bytesTotal);
						
			if (result > 0) {
				_vorbisFileId = result;
				_nextMethod = getHeaders;
				_nextMethod();
			} else {
				_nextMethod = null;
				dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));	
			}
		}
		
		private function getHeaders():void {
			var infoObj:Object = decoder.getHeader(_vorbisFileId);
			var p:String;
			var i:uint;
			var max:uint = infoObj.commentList.length;
			var comment:String;
			var equalIndex:int;
			
			_audioInfo = new AudioInfo();
			_audioInfo.decoder = "com.automatastudios.audio.audiodecoder.decoders.OggVorbisDecoder";
			_audioInfo.format = "PCM";
			_audioInfo.channels = infoObj.channels;
			_audioInfo.sampleRate = infoObj.sampleRate;
			_audioInfo.sampleMultiplier = 44100 / infoObj.sampleRate;
			_audioInfo.bitRateUpper = infoObj.bitRateUpper;
			_audioInfo.bitRateLower = infoObj.bitRateLower;
			_audioInfo.bitRateNominal = infoObj.bitRateNominal;
			_audioInfo.bitsPerSample = 16;
			
			for (i=0; i<max; ++i) {
				comment = infoObj.commentList[i];
				_audioInfo.commentList.push(comment);
				
				equalIndex = comment.indexOf("=");
				if (equalIndex > -1) {
					_audioInfo.commentTable[comment.substring(0, equalIndex)] = comment.substring(equalIndex + 1);
				}
			}
			
			// hardcode 2 bytes-per-sample
			_audioInfo.blockAlign = _audioInfo.channels * 2;
			
			_nextMethod = null;
			
			if (_audioInfo.sampleRate != 44100 && _audioInfo.sampleRate != 22050 && _audioInfo.sampleRate != 11025) {
				dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad sample rate"));
			} else {
				
				if (_audioInfo.channels == 1) {
					_convertMethod = convertMono;
				} else {
					_convertMethod = convertStereo;
				}
				
				dispatchEvent(new Event(Event.INIT));
			}
		}
		
		private function convertMono(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var sample:Number;
			
			for (i=0; i<numSamples; ++i) {
				sample = inputData.readShort() / 32767;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
					outputData.writeFloat(sample);
				}
			}		
		}
		
		private function convertStereo(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var sample:Number;
			
			for (i=0; i<numSamples; ++i) {
				sample = inputData.readShort() / 32767;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
				}
				
				sample = inputData.readShort() / 32767;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
				}
			}
		}	
	}
}