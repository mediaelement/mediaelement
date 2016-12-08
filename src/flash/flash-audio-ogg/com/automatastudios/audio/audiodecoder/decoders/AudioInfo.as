package com.automatastudios.audio.audiodecoder.decoders {
	public class AudioInfo {
		
		public var decoder:String;
		public var format:String;
		public var channels:uint;
		public var sampleRate:uint;
		public var bitRateUpper:uint;
		public var bitRateLower:uint;
		public var bitRateNominal:uint;
		public var blockAlign:uint;
		public var bitsPerSample:uint;
		public var sampleMultiplier:uint;
		public var commentList:Array;
		public var commentTable:Object;
		
		public function AudioInfo():void {
			commentList = new Array();
			commentTable = new Object();
		}
		
		public function toString():String {
			var result:String = "";
			var i:uint;
			var p:String;
			var max:uint = commentList.length;
			
			result += "decoder: " + decoder + "\n";
			result += "format: " + format + "\n";
			result += "channels: " + channels + "\n";
			result += "sampleRate: " + sampleRate + "\n";
			result += "bitRateUpper: " + bitRateUpper + "\n";
			result += "bitRateLower: " + bitRateLower + "\n";
			result += "bitRateNominal: " + bitRateNominal + "\n";
			result += "blockAlign: " + blockAlign + "\n";
			result += "bitsPerSample: " + bitsPerSample + "\n";
			result += "sampleMultiplier: " + sampleMultiplier + "\n";
			
			result += "commentList: \n";
			for (i=0; i<max; ++i) {
				result += "\t" + i + ": " + commentList[i] + "\n";
			}
			
			result += "commentTable: \n";
			for (p in commentTable) {
				result += "\t" + p + ": " + commentTable[p] + "\n";
			}
			
			return result;
		}
	}
}