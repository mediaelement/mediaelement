package com.automatastudios.audio.audiodecoder.decoders {
	import flash.events.IEventDispatcher;
	import flash.utils.IDataInput;
	import flash.utils.ByteArray;
	
	public interface IDecoder extends IEventDispatcher {
		function init(data:IDataInput, buffer:uint, progressEventName:String):void;
		function getSamples(position:Number, numSamples:uint, sampleData:ByteArray):void;
		function getAudioInfo():AudioInfo;
		function getTotalTime():Number;
		function getPosition():Number;
	}
}