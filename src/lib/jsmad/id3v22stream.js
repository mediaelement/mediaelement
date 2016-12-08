var trimString = function (string) {
  return string.replace(/\0$/, "");
};

var stringToEncoding = function(string, encoding) {
    switch (encoding) {
        case 0:
            return trimString(string);
        case 1:
            var ix = 2, offset1 = 1, offset2 = 0;
            
            if (string.slice(0, 2) == "\xFE\xFF") {
                offset1 = 0, offset2 = 1;
            } else {
                offset1 = 1, offset2 = 0;
            }
            
            var result = "";
            
            for (var ix = 2; ix < string.length; ix += 2) {
                var byte1 = string[ix + offset1].charCodeAt(0);
                var byte2 = string[ix + offset2].charCodeAt(0);
                
                var word1 = (byte1 << 8) | byte2;
                
                if (byte1 < 0xD8 || byte1 >= 0xE0) {
                    result += String.fromCharCode(word1);
                } else {
                    ix += 2;
                    
                    var byte3 = string[ix + offset1].charCodeAt(0);
                    var byte4 = string[ix + offset2].charCodeAt(0);
                    
                    var word2 = (byte3 << 8) | byte4;
                    
                    result += String.fromCharCode(word1, word2);
                }
            }
            
            return trimString(result);
        default:
            return string;
    }
}

var decodeIdentifierFrame = function(header, stream) {
    var data = stream.read(header['length']);
    
    var array = data.split("\0", 2);
    
    return {
        'header': header,
        'owner': array[0],
        'identifier': array[1]
    };
}

var decodeTextFrame = function(header, stream) {
    var encoding = stream.readU8();
    var data = stream.read(header['length'] - 1);
    
    return {
        'header': header,
        'value': stringToEncoding(data, encoding)
    };
}

var decodeCommentFrame = function(header, stream) {
    var encoding = stream.readU8();
    var language = stream.read(3);
    
    var data = stream.read(header['length'] - 4);
    
    var array = data.split("\0", 2);
    
    return {
        'header': header,
        'language': stringToEncoding(language, 0),
        'description': stringToEncoding(array[0], 0),
        'value': stringToEncoding(array[1], encoding)
    };
}

var extendWithValueFrame = function(tags, frame) {
    tags[frame['name']] = frame['value'];
    
    return tags;
}


var extendWithIdentifierFrame = function(tags, frame) {
    tags[frame['name']] = {
        'owner': frame['value'],
        'identifier': frame['identifier']
    };
    
    return tags;
}

var extendWithCommentFrame = function(tags, frame) {
    if (!tags[frame['name']]) {
        tags[frame['name']] = []
    }
    
    tags[frame['name']][frame['description']] = {
        'language': frame['language'],
        'value': frame['value']
    };
    
    return tags;
}

Mad.ID3v22Stream = function(header, stream) {
    this.offset = 0;
    
    this.header = header;
    this.stream = stream;
    
    this.decoders = {
        'UFI': decodeIdentifierFrame,
        'TT1': decodeTextFrame,
        'TT2': decodeTextFrame,
        'TT3': decodeTextFrame,
        'TP1': decodeTextFrame,
        'TP2': decodeTextFrame,
        'TP3': decodeTextFrame,
        'TP4': decodeTextFrame,
        'TCM': decodeTextFrame,
        'TXT': decodeTextFrame,
        'TLA': decodeTextFrame,
        'TCO': decodeTextFrame,
        'TAL': decodeTextFrame,
        'TPA': decodeTextFrame,
        'TRK': decodeTextFrame,
        'TRC': decodeTextFrame,
        'TYE': decodeTextFrame,
        'TDA': decodeTextFrame,
        'TIM': decodeTextFrame,
        'TRD': decodeTextFrame,
        'TMT': decodeTextFrame,
        'TFT': decodeTextFrame,
        'TBP': decodeTextFrame,
        'TCR': decodeTextFrame,
        'TPB': decodeTextFrame,
        'TEN': decodeTextFrame,
        'TSS': decodeTextFrame,
        'TOF': decodeTextFrame,
        'TLE': decodeTextFrame,
        'TSI': decodeTextFrame,
        'TDY': decodeTextFrame,
        'TKE': decodeTextFrame,
        'TOT': decodeTextFrame,
        'TOA': decodeTextFrame,
        'TOL': decodeTextFrame,
        'TOR': decodeTextFrame,
        
        'COM': decodeCommentFrame
    };
    
    this.names = {
        /* Identification Frames */
        'TT1': 'Content group description',
        'TT2': 'Title/Songname/Content description',
        'TT3': 'Subtitle/Description refinement',
        'TAL': 'Album/Movie/Show title',
        'TOT': 'Original album/movie/show title',
        'TRK': 'Track number/Position in set',
        'TPA': 'Part of a set',
        'TRC': 'ISRC',
        
        /* Involved Persons Frames */
        'TP1': 'Lead artist/Lead performer/Soloist/Performing group',
        'TP2': 'Band/Orchestra/Accompaniment',
        'TP3': 'Conductor',
        'TP4': 'Interpreted, remixed, or otherwise modified by',
        'TOA': 'Original artist/performer',
        'TXT': 'Lyricist/Text writer',
        'TOL': 'Original lyricist/text writer',
        'TCO': 'Composer',
        'TEN': 'Encoded by',
        
        /* Derived and Subjective Properties Frames */
        'TBP': 'BPM',
        'TLE': 'Length',
        'TKE': 'Initial key',
        'TLA': 'Language',
        'TMT': 'Media type',
        
        /* Rights and Licence Frames */
        'TCR': 'Copyright message',
        'TPB': 'Publisher',
        
        /* Other Text Frames */
        'TOF': 'Original filename',
        'TDY': 'Playlist delay',
        'TSS': 'Software/Hardware and settings used for encoding',
        'TFT': 'File type',
        
        /* Buffering */
        'BUF': 'Recommended buffer size',
        
        /* Attached Picture Frame */
        'PIC': 'Attached picture',
        
        /* Unique Identifier Frame */
        'UFI': 'Unique identifier',
        
        /* Music CD Identifier Frame */
        'MCI': 'Music CD identifier',
        
        /* Comment Frame */
        'COM': 'Comment',
        
        /* User Defined URL Link Frame */
        'WXX': 'User defined URL link',
        
        /* Deprecated ID3v2 frames */
        'TDA': 'Date',
        'TIM': 'Time',
        'TOR': 'Original release year',
        'TRD': 'Recording dates',
        'TSI': 'Size',
        'TYE': 'Year'
    };
    
    this.extenders = {
        'UFI': extendWithIdentifierFrame,
        'TT1': extendWithValueFrame,
        'TT2': extendWithValueFrame,
        'TT3': extendWithValueFrame,
        'TP1': extendWithValueFrame,
        'TP2': extendWithValueFrame,
        'TP3': extendWithValueFrame,
        'TP4': extendWithValueFrame,
        'TCM': extendWithValueFrame,
        'TXT': extendWithValueFrame,
        'TLA': extendWithValueFrame,
        'TCO': extendWithValueFrame,
        'TAL': extendWithValueFrame,
        'TPA': extendWithValueFrame,
        'TRK': extendWithValueFrame,
        'TRC': extendWithValueFrame,
        'TYE': extendWithValueFrame,
        'TDA': extendWithValueFrame,
        'TIM': extendWithValueFrame,
        'TRD': extendWithValueFrame,
        'TMT': extendWithValueFrame,
        'TFT': extendWithValueFrame,
        'TBP': extendWithValueFrame,
        'TCR': extendWithValueFrame,
        'TPB': extendWithValueFrame,
        'TEN': extendWithValueFrame,
        'TSS': extendWithValueFrame,
        'TOF': extendWithValueFrame,
        'TLE': extendWithValueFrame,
        'TSI': extendWithValueFrame,
        'TDY': extendWithValueFrame,
        'TKE': extendWithValueFrame,
        'TOT': extendWithValueFrame,
        'TOA': extendWithValueFrame,
        'TOL': extendWithValueFrame,
        'TOR': extendWithValueFrame,
        
        'COM': extendWithCommentFrame
    };
}

Mad.ID3v22Stream.prototype.readFrame = function() {
    if (this.offset >= this.header.length) {
        return null;
    }
    
    var identifier = this.stream.read(3);
    
    if (identifier.charCodeAt(0) == 0) {
        this.offset = this.header.length + 1;
        
        return null;
    }
    
    var length = this.stream.readU24(true);
    
    var header = {
        identifier: identifier,
        length: length
    };
    
    if (this.decoders[identifier]) {
        var result = this.decoders[identifier](header, this.stream);
    } else {
        var result = {
            identifier: identifier,
            header: header
        };
        
        this.stream.read(length);
    }
    
    result.name = this.names[identifier] ? this.names[identifier] : 'UNKNOWN';
    
    this.offset += 10 + length;
    
    return result;
}

Mad.ID3v22Stream.prototype.read = function() {
    if (!this.array) {
        this.array = [];
        
        var frame = null;
        
        try {
            while (frame = this.readFrame()) {
                this.array.push(frame);
            }
        } catch (e) {
			throw(e);
            //console.log("ID3 Error: " + e);
        }
    }
    
    return this.array;
}

Mad.ID3v22Stream.prototype.toHash = function() {
    var frames = this.read();
    
    var hash = {};
    
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        
        var extender = this.extenders[frame['header']['identifier']];
        
        if (extender) {
            hash = extender(hash, frames[i]);
        }
    }
    
    return hash;
}
