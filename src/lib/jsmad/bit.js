
// Well duh.
var CHAR_BIT = 8;

/*
 * NAME:    bit.init()
 * DESCRIPTION: initialize bit pointer struct
 */
Mad.Bit = function (stream, offset) {
    if (typeof(stream) == 'string') {
        this.stream = new Mad.StringStream(stream);
    } else {
        this.stream = stream;
    }
    
    this.offset = offset;
    
    this.cache = 0;
    this.left = CHAR_BIT;
}

Mad.Bit.prototype.clone = function() {
    var c = new Mad.Bit(this.stream, this.offset);
    
    c.cache = this.cache;
    c.left = this.left;
    
    return c;
}

/*
 * NAME:    bit.length()
 * DESCRIPTION: return number of bits between start and end points
 */
Mad.Bit.prototype.length = function(end) {
    return this.left + CHAR_BIT * (end.offset - (this.offset + 1)) + (CHAR_BIT - end.left);
}

/*
 * NAME:    bit.nextbyte()
 * DESCRIPTION: return pointer to next unprocessed byte
 */
Mad.Bit.prototype.nextbyte = function() {
    return this.left == CHAR_BIT ? this.offset : this.offset + 1;
}

/*
 * NAME:    bit.skip()
 * DESCRIPTION: advance bit pointer
 */
Mad.Bit.prototype.skip = function(len) {
    this.offset += (len / CHAR_BIT) >> 0; // javascript trick to get integer divison
    this.left   -= len % CHAR_BIT;
    
    if (this.left > CHAR_BIT) {
        this.offset++;
        this.left += CHAR_BIT;
    }
    
    if (this.left < CHAR_BIT) {
        this.cache = this.stream.getU8(this.offset);
    }
}

/*
 * NAME:    bit.read()
 * DESCRIPTION: read an arbitrary number of bits and return their UIMSBF value
 */
Mad.Bit.prototype.read = function(len) {
    if(len > 16) {
        return this.readBig(len);
    }
    
    var value = 0;

    if (this.left == CHAR_BIT) {
        this.cache = this.stream.getU8(this.offset);
    }

    if (len < this.left) {
        value = (this.cache & ((1 << this.left) - 1)) >> (this.left - len);
        this.left -= len;
        
        return value;
    }
    
    /* remaining bits in current byte */
    value = this.cache & ((1 << this.left) - 1);
    len  -= this.left;
    
    this.offset++;
    this.left = CHAR_BIT;
    
    /* more bytes */
    while (len >= CHAR_BIT) {
        value = (value << CHAR_BIT) | this.stream.getU8(this.offset++);
        len  -= CHAR_BIT;
    }
    
    if (len > 0) {
        this.cache = this.stream.getU8(this.offset);
        
        value = (value << len) | (this.cache >> (CHAR_BIT - len));
        this.left -= len;
    }
    
    return value;
}

Mad.Bit.prototype.readBig = function(len) {
    var value = 0;
    
    if (this.left == CHAR_BIT) {
        this.cache = this.stream.getU8(this.offset);
    }
    
    if (len < this.left) {
        value = (this.cache & ((1 << this.left) - 1)) >> (this.left - len);
        this.left -= len;
        
        return value;
    }
    
    /* remaining bits in current byte */
    value = this.cache & ((1 << this.left) - 1);
    len  -= this.left;
    
    this.offset++;
    this.left = CHAR_BIT;
    
    /* more bytes */
    while (len >= CHAR_BIT) {
        value = Mad.bitwiseOr(Mad.lshift(value, CHAR_BIT), this.stream.getU8(this.offset++));
        len  -= CHAR_BIT;
    }
    
    if (len > 0) {
        this.cache = this.stream.getU8(this.offset);
        
        value = Mad.bitwiseOr(Mad.lshift(value, len), (this.cache >> (CHAR_BIT - len)));
        this.left -= len;
    }
    
    return value;
}

