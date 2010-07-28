
package htmlelements
{
	
	public interface IMediaElement {		
		
		function play(url:String):void;
		
		function pause():void;
		
		function setUrl(url:String):void;
		
		function setCurrentTime(pos:Number):void;
		
		function setVolume(vol:Number):void;
		
		function setMuted(muted:Boolean):void;
		
	}
	
}