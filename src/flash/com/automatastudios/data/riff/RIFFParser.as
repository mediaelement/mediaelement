package com.automatastudios.data.riff {
	import flash.errors.EOFError;
	import com.automatastudios.audio.audiodecoder.events.AudioDecoderEvent;
	import com.automatastudios.audio.audiodecoder.events.AudioDecoderEvent;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.errors.EOFError;
	import flash.net.URLStream;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	import flash.utils.IDataInput;	
		
	public class RIFFParser {
		private var _data:IDataInput;
		private var _currentSize:uint;
		private var _chunkSize:uint;
		private var _currentPosition:uint;
		private var _startPosition:uint;
		private var _isDataComplete:Boolean;
		private var _dataSize:uint;
		
		private var _positionStack:Array;
		private var _sizeStack:Array;
		
		public function RIFFParser(data:IDataInput = null) {
			_data = data;
			_sizeStack = new Array();
			_positionStack = new Array();
			_currentPosition = 0;
			_currentSize = 0;
			_startPosition = 0;
			_isDataComplete = false;			
			
			if (_data is ByteArray) {
				_dataSize = (_data as ByteArray).length;
			} else {	
				(_data as EventDispatcher).addEventListener(ProgressEvent.PROGRESS, onDataProgress);
			}
		}
		
		public function get isDataComplete():Boolean {
			return _isDataComplete;
		}
		
		public function parse(data:IDataInput):void {
			_data = data;
			_sizeStack = new Array();
			_positionStack = new Array();
			_currentPosition = 0;
			_currentSize = 0;
			_startPosition = 0;
			
			if (_data is ByteArray) {
				_isDataComplete = true;
			} else {
				_isDataComplete = false;
			}
		}
		
		public function readChunk():RIFFChunkInfo {
			var chunkInfo:RIFFChunkInfo;
			
			_data.endian = Endian.BIG_ENDIAN;
			
			if (_data.bytesAvailable >= 8) {

				// move on to next chunk
				if (_currentSize > 0) {
					_data.readBytes(new ByteArray(), 0, _currentSize - (_currentPosition - _startPosition));
				}
				
				// check to see if we need to pop up the stack
				while(_sizeStack.length > 0 && _sizeStack[_sizeStack.length - 1] - _currentPosition - _positionStack[_positionStack.length - 1] < 1) {
					_sizeStack.pop();
					_positionStack.pop();
				}
				
				// if on an odd byte remove the padding byte
				if (_currentPosition % 2 == 1) {
					_data.readUnsignedByte();
					++_currentPosition;
				}
	
				chunkInfo = new RIFFChunkInfo();
				chunkInfo.chunkId = String.fromCharCode(_data.readUnsignedByte(), 
												_data.readUnsignedByte(), 
												_data.readUnsignedByte(), 
												_data.readUnsignedByte());
				
				_data.endian = Endian.LITTLE_ENDIAN;				
				chunkInfo.size = 
				_chunkSize = 
				_currentSize = _data.readUnsignedInt();
				
				_currentPosition += 8;
				_startPosition = _currentPosition;
												
				return chunkInfo;
			} else {
				throw new EOFError("Not enough data available to read chunk");
			}
		}
		
		public function readSubChunk():String {
			var subChunkId:String = "";
			
			if (_data.bytesAvailable >= 4) {
		
				_sizeStack.push(_currentSize);
				_positionStack.push(_startPosition);
				
				_currentSize = 0;
				_startPosition = 0;
				
				_data.endian = Endian.BIG_ENDIAN;
	
				subChunkId = String.fromCharCode(_data.readUnsignedByte(), 
												_data.readUnsignedByte(), 
												_data.readUnsignedByte(), 
												_data.readUnsignedByte());
								
				
				_currentPosition += 4;
	
				return subChunkId;
			} else {
				throw new EOFError("Not enough data avilable to read sub chunk");
			}
		}
		
		public function readChunkData():ByteArray {
			var chunkData:ByteArray;
			
			if (_data.bytesAvailable >= _currentSize) {
				chunkData = new ByteArray();
				_data.readBytes(chunkData, 0, _currentSize);
				_currentPosition += _currentSize;
				_currentSize = 0;

				return chunkData;
			} else {
				throw new EOFError("Not enough data avilable to read chunk data");
			}
		}
		
		public function streamChunkData(bufferSize:uint, streamData:ByteArray):uint {
			var readSize:int = Math.min(bufferSize, _currentSize);
			var maxPosition:uint = Math.min(_chunkSize, _currentPosition + _data.bytesAvailable);
			var movedPosition:uint;
					
			readSize = Math.max(readSize, 0);

			if (_data.bytesAvailable >= readSize) {
				if (readSize > 0) {
					_data.readBytes(streamData, streamData.length, readSize);
					_currentPosition += readSize;
					_currentSize -= readSize;
				}
				
				if (_currentSize == 0 && _dataSize > 0) {
					_isDataComplete = true;
				}
				
				return readSize;
			} else {
				throw new EOFError("Not enough data avilable to read " + readSize + " bytes from chunk data");
			}	
		}
		
		private function onDataProgress(event:ProgressEvent):void {
			_dataSize = event.bytesTotal;
		}
	}
}