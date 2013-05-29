package {
	
	import flash.external.ExternalInterface;

	public class ConsoleDebug {
	
		public var debugOn:Boolean = false;
	
		public function ConsoleDebug() {
		    print(this.id+"Constructor");
		}
		
		private function get id():String {
			return "--- MEJS ConsoleDebug: ";
		}

		public function print (s:String):void {
			if (debugOn) {
				try {
					ExternalInterface.call("console.info", this.id+s);			
				} catch(e:*) {
					debugOn = false;
				}
			}
		}
	}
}