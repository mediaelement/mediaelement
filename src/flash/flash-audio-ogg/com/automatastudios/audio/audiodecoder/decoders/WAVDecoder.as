package com.automatastudios.audio.audiodecoder.decoders {
	import com.automatastudios.audio.audiodecoder.events.AudioDecoderEvent;
	import com.automatastudios.data.riff.RIFFChunkInfo;
	import com.automatastudios.data.riff.RIFFParser;
	
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
		
	
	public class WAVDecoder extends EventDispatcher implements IDecoder {
		private var _data:IDataInput;
		private var _riffParser:RIFFParser;
		private var _audioInfo:AudioInfo;
		private var _nextMethod:Function;
		private var _convertMethod:Function;
		private var _isBuffering:Boolean;
		private var _bufferSize:uint;
		
		private var _dataSize:uint;
		private var _position:uint;
		private var _isSmallFile:Boolean;
		
		public function WAVDecoder():void {
			// do nothing, wait for init
		}
		
		public function init(data:IDataInput, bufferSize:uint, progressEventName:String):void {
			_data = data;
			_riffParser = new RIFFParser(data);
			_bufferSize = bufferSize;
			
			_position = 0;
			_dataSize = 0;
			
			_nextMethod = parseRIFFChunk;
			
			if (progressEventName != null) {
				_isSmallFile = true;
				(data as EventDispatcher).addEventListener(progressEventName, onDataProgress);
				(data as EventDispatcher).addEventListener(Event.COMPLETE, onDataComplete);
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
			
			try {
				dataReadSize = _riffParser.streamChunkData(numBytes, rawSampleData);
				
				sampleReadSize = dataReadSize / _audioInfo.blockAlign;
				
				_position += dataReadSize;
				rawSampleData.endian = Endian.LITTLE_ENDIAN;
				
				_convertMethod(sampleReadSize, rawSampleData, sampleData);
				
				if (!_riffParser.isDataComplete) {
					// padd with extra 0s as needed
					for (i=sampleReadSize * _audioInfo.sampleMultiplier; i<numSamples; ++i) {
						sampleData.writeFloat(0);
						sampleData.writeFloat(0);
					}
				} else {
					dispatchEvent(new Event(Event.COMPLETE));
				}
				
			} catch (error:EOFError) {
				// padd with extra 0s as needed
				for (i=0; i<numSamples; ++i) {
					sampleData.writeFloat(0);
					sampleData.writeFloat(0);
				}
			}
		}
		
		public function getAudioInfo():AudioInfo {
			return _audioInfo;
		}
		
		public function getTotalTime():Number {
			return ((_dataSize / (_audioInfo.blockAlign * _audioInfo.sampleMultiplier)) / 44100);
		}
		
		public function getPosition():Number {
			return ((_position / (_audioInfo.blockAlign * _audioInfo.sampleMultiplier)) / 44100);
		}

		private function onDataProgress(event:Event):void {
			if (_nextMethod != null) {
				if (_data.bytesAvailable >= _bufferSize) {
					_isSmallFile = false;
					_nextMethod();
				}
			}
		}
		
		private function onDataComplete(event:Event):void {
			if (_isSmallFile) {
				_bufferSize = _data.bytesAvailable;
				
				_nextMethod();
			}
		}
		
		private function parseRIFFChunk():void {
			var headerInfo:RIFFChunkInfo;
		
			try {
				headerInfo = _riffParser.readChunk();
				
				if (headerInfo.chunkId == "RIFF") {
					
					_nextMethod = parseRIFFSubChunk;
					_nextMethod();
				} else {
					dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));	
				}
			} catch (error:EOFError) {
				// do nothing, wait for next attempt
			}
		}
		
		private function parseRIFFSubChunk():void {
			var subChunkFormat:String;
			
			try {
				subChunkFormat = _riffParser.readSubChunk();
				
				if (subChunkFormat == "WAVE") {
					_nextMethod = locateFormatChunk;
					_nextMethod();
				} else {
					dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));
				}
			} catch (error:EOFError) {
				// do nothing, wait for next attempt
			}
		}
		
		private function locateFormatChunk():void {
			var chunkInfo:RIFFChunkInfo;

			try {
				chunkInfo = _riffParser.readChunk();
				
				while (chunkInfo.chunkId != "fmt " && chunkInfo != null) {
					chunkInfo = _riffParser.readChunk();
				}
				
				if (chunkInfo.chunkId == "fmt ") {
					_nextMethod = parseFormatChunk; 
					_nextMethod();
				} else {
					dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));		
				}
			} catch (error:EOFError) {
				// do nothing, wait for next attempt
			}			
		}
		
		private function parseFormatChunk():void {
			var chunkData:ByteArray;
			
			try {
				chunkData = _riffParser.readChunkData();
				chunkData.endian = Endian.LITTLE_ENDIAN;


				if (chunkData.length >= 16) {
					_audioInfo = new AudioInfo();
					_audioInfo.decoder = "com.automatastudios.audio.audiodecoder.decoders.WAVDecoder";
					_audioInfo.format = (chunkData.readUnsignedShort() == 1 ? "PCM" : "Unknown");
					_audioInfo.channels = chunkData.readUnsignedShort();
					_audioInfo.sampleRate = chunkData.readUnsignedInt();
					_audioInfo.bitRateUpper =
					_audioInfo.bitRateLower = chunkData.readUnsignedInt()/8;
					_audioInfo.blockAlign = chunkData.readUnsignedShort();
					_audioInfo.bitsPerSample = chunkData.readUnsignedShort();
					_audioInfo.sampleMultiplier =  44100 / _audioInfo.sampleRate;
					
					trace(_audioInfo.toString());

					if (_audioInfo.channels == 1) {
						if (_audioInfo.bitsPerSample == 8) {
							_convertMethod = convert8BitMono;
						} else if (_audioInfo.bitsPerSample == 16) {
							_convertMethod = convert16BitMono;
						}
					} else if (_audioInfo.channels == 2) {
						if (_audioInfo.bitsPerSample == 8) {
							_convertMethod = convert8BitStereo;
						} else if (_audioInfo.bitsPerSample == 16) {
							_convertMethod = convert16BitStereo;
						}						
					}

					if (_audioInfo.format != "PCM" || _convertMethod == null) {
						dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));
						_nextMethod = null;	
					} else if (_audioInfo.sampleRate != 44100 && _audioInfo.sampleRate != 22050 && _audioInfo.sampleRate != 11025) {
						dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad sample rate"));
						_nextMethod = null;	
					} else {
						_nextMethod = locateDataChunk;
						_nextMethod();
					}
				
				} else {
					dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));	
				}

			} catch (error:EOFError) {
				// do nothing, wait for next attempt
			}			
		}
		
		private function locateDataChunk():void {
			var chunkInfo:RIFFChunkInfo;

			try {
				_nextMethod = null;
				chunkInfo = _riffParser.readChunk();
				
				while (chunkInfo.chunkId != "data" && chunkInfo != null) {
					chunkInfo = _riffParser.readChunk();
				}

				if (chunkInfo.chunkId == "data") {
					_dataSize = chunkInfo.size;
					dispatchEvent(new Event(Event.INIT));
					
					_nextMethod = null;
				} else {
					dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "Bad audio format"));		
				}

				
			} catch (error:EOFError) {
				// do nothing, wait for next attempt
			}			
		}
		
		private function convert8BitMono(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var sample:Number;
			
			for (i=0; i<numSamples; ++i) {
				sample = (inputData.readUnsignedByte() - 128) / 128;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
					outputData.writeFloat(sample);
				}
			}
		}
		
		private function convert16BitMono(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var sample:Number;
			
			for (i=0; i<numSamples; ++i) {
				sample = inputData.readShort();
				sample /= 32768;
				
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
					outputData.writeFloat(sample);
				}
			}			
		}
		
		private function convert8BitStereo(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var sample:Number;
			
			for (i=0; i<numSamples; ++i) {
				sample = (inputData.readUnsignedByte() - 128) / 128;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
				}
				
				sample = (inputData.readUnsignedByte() - 128) / 128;
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(sample);
				}
			}			
		}
		
		private function convert16BitStereo(numSamples:uint, inputData:ByteArray, outputData:ByteArray):void {
			var i:uint;
			var j:uint;
			var leftSample:Number;
			var rightSample:Number;
			var count:uint = 0;
			
			for (i=0; i<numSamples; ++i) {
				leftSample = inputData.readShort() / 32767;
				rightSample = inputData.readShort() / 32767;
				
				for (j=0; j< _audioInfo.sampleMultiplier; ++j) {
					outputData.writeFloat(leftSample);
					outputData.writeFloat(rightSample);
					++count;
					++count;
				}
			}
		}				
	}
}