package com.automatastudios.audio.audiodecoder.events {
	import flash.events.Event;

	public class AudioDecoderEvent extends Event {
		public static const INVALID_SAMPLE_RATE:String = "audioDecoderInvalidSampleRate";
		public static const INVALID_FORMAT:String = "audioDecoderInvalidFormat";
		
		public function AudioDecoderEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false) {
			super(type, bubbles, cancelable);
		}
		
	}
}