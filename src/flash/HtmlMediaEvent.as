package  {

	public class HtmlMediaEvent {

		public static var LOADED_DATA:String = "loadeddata";
		public static var PROGRESS:String = "progress";
		public static var TIMEUPDATE:String = "timeupdate";
		public static var SEEKED:String = "seeked";
		public static var PLAY:String = "play";
		public static var PLAYING:String = "playing";
		public static var PAUSE:String = "pause";
		public static var LOADEDMETADATA:String = "loadedmetadata";
		public static var ENDED:String = "ended";
		public static var VOLUMECHANGE:String = "volumechange";
		public static var STOP:String = "stop";
		
		// new : 2/15/2011
		public static var LOADSTART:String = "loadstart";
		public static var CANPLAY:String = "canplay";
		// new : 3/3/2011
		public static var LOADEDDATA:String = "loadeddata";
		
		// new : 4/12/2011
		public static var SEEKING:String = "seeking";		
		
		// new : 1/2/2012
		public static var FULLSCREENCHANGE:String = "fullscreenchange";
		
		// new : 5/14/2013
		public static var ERROR:String = "error";
		public static var MEDIA_ERR_ABORTED:Number = 1;
		public static var MEDIA_ERR_NETWORK:Number = 2;
		public static var MEDIA_ERR_DECODE:Number = 3;
		public static var MEDIA_ERR_SRC_NOT_SUPPORTED:Number = 4
	}
}
