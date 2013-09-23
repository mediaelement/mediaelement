
package htmlelements
{

	public interface IMediaElement {

		function play():void;

		function pause():void;

		function load():void;

		function stop():void;

		function setSrc(url:String):void;
		
		function setSize(width:Number, height:Number):void;

		function setCurrentTime(pos:Number):void;

		function setVolume(vol:Number):void;
		
		function getVolume():Number;

		function setMuted(muted:Boolean):void;

		function duration():Number;

		function currentTime():Number;
		
		function currentProgress():Number;
		
	}

}
