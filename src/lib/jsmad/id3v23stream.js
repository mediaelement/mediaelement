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

var decodeTerminatedString = function(header, stream) {

	// skip text encoding (nobody cares, always ISO-8559-15)
	stream.read(1);

	var c;
	
	var mimetype = "";
	while(true) {
		c = stream.read(1);
		if(c == "\0") {
			break;
		}
		mimetype += c;
	}
	console.log("mimetype = " + mimetype);
	
	var filename = "";
	while(true) {
		c = stream.read(1);
		if(c == "\0") {
			break;
		}
		filename += c;
	}
	console.log("filename = " + filename);
	
	var contentDescription = "";
	while(true) {
		c = stream.read(1);
		if(c == "\0") {
			break;
		}
		contentDescription += c;
	}
	console.log("contentDescription = " + contentDescription);
	
	var objectName = stream.read(4);
	
	// skip 4 bytes, then read binary length
	stream.read(4);
	var length = stream.readU32(true) - 4;
	
	if(length > header.length) return null;
	var value = stream.read(length);
	
	return {
		'header': header,
		'mimetype': mimetype,
		'filename': filename,
		'contentDescription': contentDescription,
		'objectName': objectName,
		'value': value
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

var decodeAttachedPictureFrame = function(header, stream) {
    var encoding = stream.readU8();
    
    var data = stream.read(header['length'] - 1);
    
    var array = data.split("\0");
    
    return {
        'header': header,
        'mime': stringToEncoding(array[0], 0),
        'type': array[1].charCodeAt(0),
        'description': array[1].slice(1, array[1].length - 1),
        'value': array.slice(2, array.length - 2).join("\0")
    };
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

var decodeBinaryFrame = function(header, stream) {
    var data = stream.read(header['length']);
    
    return {
        'header': header,
        'value': data
    };
}

var decodeUserDefinedLinkFrame = function(header, stream) {
    var encoding = stream.readU8();
    var data = stream.read(header['length'] - 1);
    
    var array = data.split("\0", 2);
    
    return {
        'header': header,
        'description': stringToEncoding(array[0], 0),
        'value': stringToEncoding(array[1], encoding)
    };
}

var extendWithValueFrame = function(tags, frame) {
    tags[frame['name']] = frame['value'];
    
    return tags;
}

var extendWithPictureFrame = function(tags, frame) {
    if (!tags[frame['name']]) {
        tags[frame['name']] = []
    }
    
    tags[frame['name']].push({
        'mime': frame['mime'],
        'type': frame['type'],
        'description': frame['description'],
        'value': frame['value']
    });
    
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

var extendWithUserDefinedLinkFrame = function(tags, frame) {
    if (!tags[frame['name']]) {
        tags[frame['name']] = {}
    }
    
    tags[frame['name']][frame['description']] = frame['value'];
    
    return tags;
}

var extendWithPrivateFrame = function(tags, frame) {
    if (!tags[frame['name']]) {
        tags[frame['name']] = []
    }
    
    tags[frame['name']].push(frame['value']);
    
    return tags;
}

Mad.ID3v23Stream = function(header, stream) {
    this.offset = 0;
    
    this.header = header;
    this.stream = stream;
    
    this.decoders = {
        /* Identification Frames */
        'TIT1': decodeTextFrame,
        'TIT2': decodeTextFrame,
        'TIT3': decodeTextFrame,
        'TALB': decodeTextFrame,
        'TOAL': decodeTextFrame,
        'TRCK': decodeTextFrame,
        'TPOS': decodeTextFrame,
        'TSST': decodeTextFrame,
        'TSRC': decodeTextFrame,
        
        /* Involved Persons Frames */
        'TPE1': decodeTextFrame,
        'TPE2': decodeTextFrame,
        'TPE3': decodeTextFrame,
        'TPE4': decodeTextFrame,
        'TOPE': decodeTextFrame,
        'TEXT': decodeTextFrame,
        'TOLY': decodeTextFrame,
        'TCOM': decodeTextFrame,
        'TMCL': decodeTextFrame,
        'TIPL': decodeTextFrame,
        'TENC': decodeTextFrame,
        
        /* Derived and Subjective Properties Frames */
        'TBPM': decodeTextFrame,
        'TLEN': decodeTextFrame,
        'TKEY': decodeTextFrame,
        'TLAN': decodeTextFrame,
        'TCON': decodeTextFrame,
        'TFLT': decodeTextFrame,
        'TMED': decodeTextFrame,
        'TMOO': decodeTextFrame,
        
        /* Rights and Licence Frames */
        'TCOP': decodeTextFrame,
        'TPRO': decodeTextFrame,
        'TPUB': decodeTextFrame,
        'TOWN': decodeTextFrame,
        'TRSN': decodeTextFrame,
        'TRSO': decodeTextFrame,
        
        /* Other Text Frames */
        'TOFN': decodeTextFrame,
        'TDLY': decodeTextFrame,
        'TDEN': decodeTextFrame,
        'TDOR': decodeTextFrame,
        'TDRC': decodeTextFrame,
        'TDRL': decodeTextFrame,
        'TDTG': decodeTextFrame,
        'TSSE': decodeTextFrame,
        'TSOA': decodeTextFrame,
        'TSOP': decodeTextFrame,
        'TSOT': decodeTextFrame,
        
        /* Attached Picture Frame */
        'APIC': decodeAttachedPictureFrame,
        
        /* Unique Identifier Frame */
        'UFID': decodeIdentifierFrame,
        
        /* Music CD Identifier Frame */
        'MCDI': decodeBinaryFrame,
        
        /* Comment Frame */
        'COMM': decodeCommentFrame,
        
        /* User Defined URL Link Frame */
        'WXXX': decodeUserDefinedLinkFrame,
        
        /* Private Frame */
        'PRIV': decodeBinaryFrame,
        
        /* Deprecated ID3v2 Frames */
        'TDAT': decodeTextFrame,
        'TIME': decodeTextFrame,
        'TORY': decodeTextFrame,
        'TRDA': decodeTextFrame,
        'TSIZ': decodeTextFrame,
        'TYER': decodeTextFrame,
        
        /* General encapsulated object */
        'GEOB': decodeTerminatedString
    };
    
    this.names = {
        /* Identification Frames */
        'TIT1': 'Content group description',
        'TIT2': 'Title/Songname/Content description',
        'TIT3': 'Subtitle/Description refinement',
        'TALB': 'Album/Movie/Show title',
        'TOAL': 'Original album/movie/show title',
        'TRCK': 'Track number/Position in set',
        'TPOS': 'Part of a set',
        'TSST': 'Set subtitle',
        'TSRC': 'ISRC',
        
        /* Involved Persons Frames */
        'TPE1': 'Lead artist/Lead performer/Soloist/Performing group',
        'TPE2': 'Band/Orchestra/Accompaniment',
        'TPE3': 'Conductor',
        'TPE4': 'Interpreted, remixed, or otherwise modified by',
        'TOPE': 'Original artist/performer',
        'TEXT': 'Lyricist/Text writer',
        'TOLY': 'Original lyricist/text writer',
        'TCOM': 'Composer',
        'TMCL': 'Musician credits list',
        'TIPL': 'Involved people list',
        'TENC': 'Encoded by',
        
        /* Derived and Subjective Properties Frames */
        'TBPM': 'BPM',
        'TLEN': 'Length',
        'TKEY': 'Initial key',
        'TLAN': 'Language',
        'TCON': 'Content type',
        'TFLT': 'File type',
        'TMED': 'Media type',
        'TMOO': 'Mood',
        
        /* Rights and Licence Frames */
        'TCOP': 'Copyright message',
        'TPRO': 'Produced notice',
        'TPUB': 'Publisher',
        'TOWN': 'File owner/licensee',
        'TRSN': 'Internet radio station name',
        'TRSO': 'Internet radio station owner',
        
        /* Other Text Frames */
        'TOFN': 'Original filename',
        'TDLY': 'Playlist delay',
        'TDEN': 'Encoding time',
        'TDOR': 'Original release time',
        'TDRC': 'Recording time',
        'TDRL': 'Release time',
        'TDTG': 'Tagging time',
        'TSSE': 'Software/Hardware and settings used for encoding',
        'TSOA': 'Album sort order',
        'TSOP': 'Performer sort order',
        'TSOT': 'Title sort order',
        
        /* Attached Picture Frame */
        'APIC': 'Attached picture',
        
        /* Unique Identifier Frame */
        'UFID': 'Unique identifier',
        
        /* Music CD Identifier Frame */
        'MCDI': 'Music CD identifier',
        
        /* Comment Frame */
        'COMM': 'Comment',
        
        /* User Defined URL Link Frame */
        'WXXX': 'User defined URL link',
        
        /* Private Frame */
        'PRIV': 'Private',
        
        /* Deprecated ID3v2 frames */
        'TDAT': 'Date',
        'TIME': 'Time',
        'TORY': 'Original release year',
        'TRDA': 'Recording dates',
        'TSIZ': 'Size',
        'TYER': 'Year'
    };
    
    this.extenders = {
        /* Identification Frames */
        'TIT1': extendWithValueFrame,
        'TIT2': extendWithValueFrame,
        'TIT3': extendWithValueFrame,
        'TALB': extendWithValueFrame,
        'TOAL': extendWithValueFrame,
        'TRCK': extendWithValueFrame,
        'TPOS': extendWithValueFrame,
        'TSST': extendWithValueFrame,
        'TSRC': extendWithValueFrame,
        
        /* Involved Persons Frames */
        'TPE1': extendWithValueFrame,
        'TPE2': extendWithValueFrame,
        'TPE3': extendWithValueFrame,
        'TPE4': extendWithValueFrame,
        'TOPE': extendWithValueFrame,
        'TEXT': extendWithValueFrame,
        'TOLY': extendWithValueFrame,
        'TCOM': extendWithValueFrame,
        'TMCL': extendWithValueFrame,
        'TIPL': extendWithValueFrame,
        'TENC': extendWithValueFrame,
        
        /* Derived and Subjective Properties Frames */
        'TBPM': extendWithValueFrame,
        'TLEN': extendWithValueFrame,
        'TKEY': extendWithValueFrame,
        'TLAN': extendWithValueFrame,
        'TCON': extendWithValueFrame,
        'TFLT': extendWithValueFrame,
        'TMED': extendWithValueFrame,
        'TMOO': extendWithValueFrame,
        
        /* Rights and Licence Frames */
        'TCOP': extendWithValueFrame,
        'TPRO': extendWithValueFrame,
        'TPUB': extendWithValueFrame,
        'TOWN': extendWithValueFrame,
        'TRSN': extendWithValueFrame,
        'TRSO': extendWithValueFrame,
        
        /* Other Text Frames */
        'TOFN': extendWithValueFrame,
        'TDLY': extendWithValueFrame,
        'TDEN': extendWithValueFrame,
        'TDOR': extendWithValueFrame,
        'TDRC': extendWithValueFrame,
        'TDRL': extendWithValueFrame,
        'TDTG': extendWithValueFrame,
        'TSSE': extendWithValueFrame,
        'TSOA': extendWithValueFrame,
        'TSOP': extendWithValueFrame,
        'TSOT': extendWithValueFrame,
        
        /* Attached Picture Frame */
        'APIC': extendWithPictureFrame,
        
        /* Unique Identifier Frame */
        'UFID': extendWithIdentifierFrame,
        
        /* Music CD Identifier */
        'MCDI': extendWithValueFrame,
        
        /* Comment Frame */
        'COMM': extendWithCommentFrame,
        
        /* User Defined URL Link Frame */
        'WXXX': extendWithUserDefinedLinkFrame,
        
        /* Private Frame */
        'PRIV': extendWithPrivateFrame,
        
        /* Deprecated ID3v2 Frames */
        'TDAT': extendWithValueFrame,
        'TIME': extendWithValueFrame,
        'TORY': extendWithValueFrame,
        'TRDA': extendWithValueFrame,
        'TSIZ': extendWithValueFrame,
        'TYER': extendWithValueFrame
    };
}

Mad.ID3v23Stream.prototype.readFrame = function() {
    if (this.offset >= this.header.length) {
        return null;
    }
    
    var identifier = this.stream.read(4);
    
    if (identifier.charCodeAt(0) == 0) {
        this.offset = this.header.length + 1;
        return null;
    }
    
    var length = this.stream.readU32(true);
    var flags = this.stream.readU16(true);
    
    var header = {
        'identifier': identifier,
        'length': length,
        'flags': flags
    };
    
    var result = null;
    
    if (this.decoders[identifier]) {
        result = this.decoders[identifier](header, this.stream);
    } else {
        result = {
            'identifier': identifier,
            'header': header
        };
        
        this.stream.read(Math.min(length, this.header.length - this.offset));
	}
    
    if(result) {
		result['name'] = this.names[identifier] ? this.names[identifier] : 'UNKNOWN';
    }
    
    this.offset += 10 + length;
    
    return result;
}

Mad.ID3v23Stream.prototype.read = function() {
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

Mad.ID3v23Stream.prototype.toHash = function() {
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
