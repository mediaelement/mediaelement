
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

        /**
         * Simplified version of HTML5 seekable attribute, returns upper time bound for
         * seek or duration() if seek can be any position
         *
         * @return
         */
        function seekLimit():Number;

        /**
         * This is the percentage loaded, in HTML5 MediaElement terms it would be the duration attribute
         * divided by the end of the first buffered attribute (this range is assumed to contain the current time,
         * that is buffered.end(0) >= currentTime, w3c is not clear on where 'back-buffer' ranges fall in)
         *
         * http://dev.w3.org/html5/spec-preview/media-elements.html#dom-mediacontroller-buffered
         *
         * @return percentage loaded, 0 - 100.  Returns 0 if duration unknown.
         */
		function currentProgress():Number;
		
	}

}
