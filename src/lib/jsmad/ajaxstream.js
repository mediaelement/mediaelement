Mad.AjaxStream = function(url) {
    this.state = { 'offset': 0 };
    
    var request = window.XMLHttpRequest ? new XMLHttpRequest() :  ActiveXObject("Microsoft.XMLHTTP");
    
    // pseudo-binary XHR
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.open('GET', url);
    
    this.state['request'] = request;
    this.state['amountRead'] = 0;
    this.state['inProgress'] = true;
    this.state['callbacks'] = [];
    
    var self = this;
    
    var iteration = 0;
    
    var onstatechange = function () {
        iteration += 1;
        if ((self.state['callbacks'].length > 0 && iteration % 64 == 0) || iteration % 256 == 0) {
            self.updateBuffer();
            
            var newCallbacks = [];
            
            for (var i = 0; i < self.state['callbacks'].length; i++) {
                var callback = self.state['callbacks'][i];
                
                if (callback[0] < self.state['amountRead']) {
					try {
						callback[1]();
					} catch (e) {
						console.log(e);
					}
                } else {
                    newCallbacks.push(callback);
                }
            }
            
            self.state['callbacks'] = newCallbacks;
        }
        
        if (request.readyState == 4) {
			self.state['amountRead'] = self.state['contentLength'];
            for (var i = 0; i < self.state['callbacks'].length; i++) {
                var callback = self.state['callbacks'][i];
                callback[1]();
            }
            
            window.clearInterval(self.state['timer']);
            
            self.state['inProgress'] = false;
        }
    }
    
    request.onreadystatechange = onstatechange;
    
    this.state['timer'] = window.setInterval(onstatechange, 250);
    
    request.send(null);
}

Mad.AjaxStream.prototype = new Mad.ByteStream();

Mad.AjaxStream.prototype.updateBuffer = function() {
    if (!this.state['finalAmount']) {
        this.state['arrayBuffer'] = this.state['request'].mozResponseArrayBuffer;
		
        if(this.state['arrayBuffer']) {
			this.state['byteBuffer'] = new Uint8Array(this.state['arrayBuffer']);
			this.state['amountRead'] = this.state['arrayBuffer'].byteLength;
		} else {
			this.state['buffer'] = this.state['request'].responseText
			this.state['amountRead'] = this.state['buffer'].length;
		}
        
		this.state['contentLength'] = this.state['request'].getResponseHeader('Content-Length');
		if(!this.state['contentLength']) {
			// if the server doesn't send a Content-Length Header, just use amountRead instead
			// it's less precise at first, but once everything is buffered it becomes accurate.
			this.state['contentLength'] = this.state['amountRead'];
		}
    
        if (!this.state['inProgress']) {
            this.state['finalAmount'] = true;
        }
        
        return true;
    } else {
        return false;
    }
}

Mad.AjaxStream.prototype.absoluteAvailable = function(n, updated) {
    if (n > this.state['amountRead']) {
        if (updated) {
            throw new Error("buffer underflow with absoluteAvailable!");
        } else if (this.updateBuffer()) {
            return this.absoluteAvailable(n, true);
        } else {
            return false;
        }
    } else {
        return true;
    }
}

Mad.AjaxStream.prototype.seek = function(n) {
    this.state['offset'] += n;
}

Mad.AjaxStream.prototype.read = function(n) {
    var result = this.peek(n);
    
    this.seek(n);
    
    return result;
}

Mad.AjaxStream.prototype.peek = function(n) {
    if (this.available(n)) {
        var offset = this.state['offset'];
        
        var result = this.get(offset, n);
        
        return result;
    } else {
        throw new Error("buffer underflow with peek!");
    }
}

Mad.AjaxStream.prototype.get = function(offset, length) {
    if (this.absoluteAvailable(offset + length)) {
		var tmpbuffer = "";
		if(this.state['byteBuffer']) {
			for(var i = offset; i < offset + length; i += 1) {
				tmpbuffer = tmpbuffer + String.fromCharCode(this.state['byteBuffer'][i]);
			}
		} else {
			for(var i = offset; i < offset + length; i += 1) {
				tmpbuffer = tmpbuffer + String.fromCharCode(this.state['buffer'].charCodeAt(i) & 0xff);
			}
		}
		return tmpbuffer;
    } else {
		throw new Error("buffer underflow with get!");
    }
}

Mad.ByteStream.prototype.getU8 = function(offset, bigEndian) {
	if(this.state['byteBuffer']) {
		return this.state['byteBuffer'][offset];
	}
		
    return this.get(offset, 1).charCodeAt(0);
}

Mad.AjaxStream.prototype.requestAbsolute = function(n, callback) {
    if (n < this.state['amountRead']) {
        callback();
    } else {
        this.state['callbacks'].push([n, callback]);
    }
}

Mad.AjaxStream.prototype.request = function(n, callback) {
    this.requestAbsolute(this.state['offset'] + n, callback);
}
