
/* Global namespace */
Mad = {};

Mad.recoverable = function (error) {
    return (error & 0xff00) != 0;
};

// credit: http://blog.stevenlevithan.com/archives/fast-string-multiply
Mad.mul = function (str, num) {
        var     i = Math.ceil(Math.log(num) / Math.LN2), res = str;
        do {
                res += res;
        } while (0 < --i);
        return res.slice(0, str.length * num);
};

Mad.memcpy = function (dst, dstOffset, src, srcOffset, length) {
    // this is a pretty weird memcpy actually - it constructs a new version of dst, because we have no other way to do it
    return dst.slice(0, dstOffset) + src.slice(srcOffset, srcOffset + length) + dst.slice(dstOffset + length);
};

Mad.rshift = function (num, bits) {
    return Math.floor(num / Math.pow(2, bits));
};

Mad.lshiftU32 = function (num, bits) {
    return Mad.bitwiseAnd(Mad.lshift(num, bits), 4294967295 /* 2^32 - 1 */);
};

Mad.lshift = function (num, bits) {
    return num * Math.pow(2, bits);
};

Mad.bitwiseOr = function (a, b) {
    var w = 2147483648; // 2^31

    var aHI = (a / w) << 0;
    var aLO = a % w;
    var bHI = (b / w) << 0;
    var bLO = b % w;

    return ((aHI | bHI) * w + (aLO | bLO));
};

Mad.bitwiseAnd = function (a, b) {
    var w = 2147483648; // 2^31

    var aHI = (a / w) << 0;
    var aLO = a % w;
    var bHI = (b / w) << 0;
    var bLO = b % w;

    return ((aHI & bHI) * w + (aLO & bLO));
};
