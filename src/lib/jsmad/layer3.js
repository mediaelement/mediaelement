
/*
 * MPEG-1 scalefactor band widths
 * derived from Table B.8 of ISO/IEC 11172-3
 */
var sfb_48000_long = [
    4,  4,  4,  4,  4,  4,  6,  6,  6,   8,  10,
    12, 16, 18, 22, 28, 34, 40, 46, 54,  54, 192
];

var sfb_44100_long = [
    4,  4,  4,  4,  4,  4,  6,  6,  8,   8,  10,
    12, 16, 20, 24, 28, 34, 42, 50, 54,  76, 158
];

var sfb_32000_long = [
    4,  4,  4,  4,  4,  4,  6,  6,  8,  10,  12,
    16, 20, 24, 30, 38, 46, 56, 68, 84, 102,  26
];

var sfb_48000_short = [
    4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  6,
    6,  6,  6,  6,  6, 10, 10, 10, 12, 12, 12, 14, 14,
    14, 16, 16, 16, 20, 20, 20, 26, 26, 26, 66, 66, 66
];

var sfb_44100_short = [
    4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  6,
    6,  6,  8,  8,  8, 10, 10, 10, 12, 12, 12, 14, 14,
    14, 18, 18, 18, 22, 22, 22, 30, 30, 30, 56, 56, 56
];

var sfb_32000_short = [
    4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  6,
    6,  6,  8,  8,  8, 12, 12, 12, 16, 16, 16, 20, 20,
    20, 26, 26, 26, 34, 34, 34, 42, 42, 42, 12, 12, 12
];

var sfb_48000_mixed = [
    /* long */   4,  4,  4,  4,  4,  4,  6,  6,
    /* short */  4,  4,  4,  6,  6,  6,  6,  6,  6, 10,
    10, 10, 12, 12, 12, 14, 14, 14, 16, 16,
    16, 20, 20, 20, 26, 26, 26, 66, 66, 66
];

var sfb_44100_mixed = [
    /* long */   4,  4,  4,  4,  4,  4,  6,  6,
    /* short */  4,  4,  4,  6,  6,  6,  8,  8,  8, 10,
    10, 10, 12, 12, 12, 14, 14, 14, 18, 18,
    18, 22, 22, 22, 30, 30, 30, 56, 56, 56
];

var sfb_32000_mixed = [
    /* long */   4,  4,  4,  4,  4,  4,  6,  6,
    /* short */  4,  4,  4,  6,  6,  6,  8,  8,  8, 12,
    12, 12, 16, 16, 16, 20, 20, 20, 26, 26,
    26, 34, 34, 34, 42, 42, 42, 12, 12, 12
];

var sfbwidth_table = [
    { l: sfb_48000_long, s: sfb_48000_short, m: sfb_48000_mixed },
    { l: sfb_44100_long, s: sfb_44100_short, m: sfb_44100_mixed },
    { l: sfb_32000_long, s: sfb_32000_short, m: sfb_32000_mixed } /*, // fuck MPEG 2.5
                                                                    { l: sfb_24000_long, s: sfb_24000_short, m: sfb_24000_mixed },
                                                                    { l: sfb_22050_long, s: sfb_22050_short, m: sfb_22050_mixed },
                                                                    { l: sfb_16000_long, s: sfb_16000_short, m: sfb_16000_mixed },
                                                                    { l: sfb_12000_long, s: sfb_12000_short, m: sfb_12000_mixed },
                                                                    { l: sfb_11025_long, s: sfb_11025_short, m: sfb_11025_mixed },
                                                                    { l:  sfb_8000_long, s:  sfb_8000_short, m:  sfb_8000_mixed }*/
];

var pretab /* [22] */ = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 3, 2, 0
];

/*
 * fractional powers of two
 * used for requantization and joint stereo decoding
 *
 * root_table[3 + x] = 2^(x/4)
 */
var root_table /* 7 */ = [
    /* 2^(-3/4) */ 0.59460355750136,
    /* 2^(-2/4) */ 0.70710678118655,
    /* 2^(-1/4) */ 0.84089641525371,
    /* 2^( 0/4) */ 1.00000000000000,
    /* 2^(+1/4) */ 1.18920711500272,
    /* 2^(+2/4) */ 1.41421356237310,
    /* 2^(+3/4) */ 1.68179283050743
];

var cs = [
        +0.857492926 , +0.881741997,
        +0.949628649 , +0.983314592,
        +0.995517816 , +0.999160558,
        +0.999899195 , +0.999993155
];

var ca = [
        -0.514495755, -0.471731969,
        -0.313377454, -0.181913200,
        -0.094574193, -0.040965583,
        -0.014198569, -0.003699975
];


Mad.count1table_select = 0x01;
Mad.scalefac_scale     = 0x02;
Mad.preflag            = 0x04;
Mad.mixed_block_flag   = 0x08;

Mad.I_STEREO  = 0x1;
Mad.MS_STEREO = 0x2;

/*
 * windowing coefficients for long blocks
 * derived from section 2.4.3.4.10.3 of ISO/IEC 11172-3
 *
 * window_l[i] = sin((PI / 36) * (i + 1/2))
 */
var window_l /* [36] */ = [
    0.043619387, 0.130526192,
    0.216439614, 0.300705800,
    0.382683432, 0.461748613,
    0.537299608, 0.608761429,
    0.675590208, 0.737277337,
    0.793353340, 0.843391446,

    0.887010833, 0.923879533,
    0.953716951, 0.976296007,
    0.991444861, 0.999048222,
    0.999048222, 0.991444861,
    0.976296007, 0.953716951,
    0.923879533, 0.887010833,

    0.843391446, 0.793353340,
    0.737277337, 0.675590208,
    0.608761429, 0.537299608,
    0.461748613, 0.382683432,
    0.300705800, 0.216439614,
    0.130526192, 0.043619387
];

/*
 * windowing coefficients for short blocks
 * derived from section 2.4.3.4.10.3 of ISO/IEC 11172-3
 *
 * window_s[i] = sin((PI / 12) * (i + 1/2))
 */
var window_s /* [12] */ = [
    0.130526192, 0.382683432,
    0.608761429, 0.793353340,
    0.923879533, 0.991444861,
    0.991444861, 0.923879533,
    0.793353340, 0.608761429,
    0.382683432, 0.130526192
];

/*
 * coefficients for intensity stereo processing
 * derived from section 2.4.3.4.9.3 of ISO/IEC 11172-3
 *
 * is_ratio[i] = tan(i * (PI / 12))
 * is_table[i] = is_ratio[i] / (1 + is_ratio[i])
 */
var is_table /* [7] */ = [
    0.000000000,
    0.211324865,
    0.366025404,
    0.500000000,
    0.633974596,
    0.788675135,
    1.000000000
];

/*
 * coefficients for LSF intensity stereo processing
 * derived from section 2.4.3.2 of ISO/IEC 13818-3
 *
 * is_lsf_table[0][i] = (1 / sqrt(sqrt(2)))^(i + 1)
 * is_lsf_table[1][i] = (1 /      sqrt(2)) ^(i + 1)
 */
var is_lsf_table /* [2][15] */ = [
    [
        0.840896415,
        0.707106781,
        0.594603558,
        0.500000000,
        0.420448208,
        0.353553391,
        0.297301779,
        0.250000000,
        0.210224104,
        0.176776695,
        0.148650889,
        0.125000000,
        0.105112052,
        0.088388348,
        0.074325445
    ], [
        0.707106781,
        0.500000000,
        0.353553391,
        0.250000000,
        0.176776695,
        0.125000000,
        0.088388348,
        0.062500000,
        0.044194174,
        0.031250000,
        0.022097087,
        0.015625000,
        0.011048543,
        0.007812500,
        0.005524272
    ]
];

Mad.SideInfo = function() {
    this.gr = []; // array of Mad.Granule
    this.scfsi = []; // array of ints
};

/*
 * scalefactor bit lengths
 * derived from section 2.4.2.7 of ISO/IEC 11172-3
 */
var sflen_table = [
    { slen1: 0, slen2: 0 }, { slen1: 0, slen2: 1 }, { slen1: 0, slen2: 2 }, { slen1: 0, slen2: 3 },
    { slen1: 3, slen2: 0 }, { slen1: 1, slen2: 1 }, { slen1: 1, slen2: 2 }, { slen1: 1, slen2: 3 },
    { slen1: 2, slen2: 1 }, { slen1: 2, slen2: 2 }, { slen1: 2, slen2: 3 }, { slen1: 3, slen2: 1 },
    { slen1: 3, slen2: 2 }, { slen1: 3, slen2: 3 }, { slen1: 4, slen2: 2 }, { slen1: 4, slen2: 3 }    
];

Mad.Granule = function() {
    this.ch = []; // list of Mad.Channel 
}

Mad.Channel = function() {
    this.table_select = []; // list of Numbers (I guess)
    this.scalefac = []; // list of integers
    this.subblock_gain = [];
}


/* we must take care that sz >= bits and sz < sizeof(long) lest bits == 0 */
Mad.MASK = function (cache, sz, bits) {
    // return Mad.bitwiseAnd(Mad.rshift(cache, sz - bits), Mad.lshift(1, bits) - 1);
    return (((cache) >> ((sz) - (bits))) & ((1 << (bits)) - 1));
}

Mad.MASK1BIT = function (cache, sz) {
    // return Mad.bitwiseAnd(cache, Mad.lshift(1, sz - 1));
    return ((cache) & (1 << ((sz) - 1)));
}

/*
 * NAME:    III_huffdecode()
 * DESCRIPTION: decode Huffman code words of one channel of one granule
 */
Mad.III_huffdecode = function(ptr, xr /* Float64Array(576) */, channel, sfbwidth, part2_length) {
    var exponents = new Int32Array(new ArrayBuffer(4 * 39));
    var expptr = 0;
    var bits_left, cachesz;
    var xrptr;
    var sfbound;
    var bitcache;
    var sfbwidthptr = 0;
    
    bits_left = channel.part2_3_length - part2_length;
    
    if (bits_left < 0)
        return Mad.Error.BADPART3LEN;

    Mad.III_exponents(channel, sfbwidth, exponents);

    var peek = ptr.clone();
    ptr.skip(bits_left);
    
    /* align bit reads to byte boundaries */
    cachesz  = peek.left;
    cachesz += ((32 - 1 - 24) + (24 - cachesz)) & ~7;
    
    bitcache   = peek.read(cachesz);
    //console.log("bitcache peek.read = " + bitcache);
    bits_left -= cachesz;

    xrptr = 0;

    /* big_values */
    {
        var region = 0, rcount;
        
        // var reqcache = new Float64Array(new ArrayBuffer(8 * 16));
        var reqcache = [];

        sfbound = xrptr + sfbwidth[sfbwidthptr++];
        rcount  = channel.region0_count + 1;

        var entry = Mad.huff_pair_table[channel.table_select[region]];
        var table     = entry.table;
        var linbits   = entry.linbits;
        var startbits = entry.startbits;

        if (typeof(table) == 'undefined')
            return Mad.Error.BADHUFFTABLE;

        expptr = 0;
        exp     = exponents[expptr++];
        var reqhits = 0;
        var big_values = channel.big_values;

        while (big_values-- && cachesz + bits_left > 0) {
            var pair;
            var clumpsz, value;
            var requantized;

            //console.log("big_values = " + big_values + ", cachesz = " + cachesz + ", bits_left = " + bits_left);

            if (xrptr == sfbound) {
                sfbound += sfbwidth[sfbwidthptr++];

                /* change table if region boundary */
                if (--rcount == 0) {
                    if (region == 0)
                        rcount = channel.region1_count + 1;
                    else
                        rcount = 0;  /* all remaining */

                    entry     = Mad.huff_pair_table[channel.table_select[++region]];
                    table     = entry.table;
                    linbits   = entry.linbits;
                    startbits = entry.startbits;

                    if (typeof(table) == 'undefined')
                        return Mad.Error.BADHUFFTABLE;
                }

                if (exp != exponents[expptr]) {
                    exp = exponents[expptr];
                    reqhits = 0;
                }

                ++expptr;
            }
            

            if (cachesz < 21) {
                var bits       = ((32 - 1 - 21) + (21 - cachesz)) & ~7;
                bitcache   = (bitcache << bits) | peek.read(bits);
                cachesz   += bits;
                bits_left -= bits;
            }

            /* hcod (0..19) */
            clumpsz = startbits;
            pair    = table[ (((bitcache) >> ((cachesz) - (clumpsz))) & ((1 << (clumpsz)) - 1))];
            
            while (!pair['final']) {
                cachesz -= clumpsz;

                clumpsz = pair.ptr.bits;
                pair    = table[pair.ptr.offset +  (((bitcache) >> ((cachesz) - (clumpsz))) & ((1 << (clumpsz)) - 1))];
            }

            cachesz -= pair.value.hlen;

            if (linbits) {
                /* x (0..14) */
                value = pair.value.x;
                var x_final = false;

                switch (value) {
                case 0:
                    xr[xrptr] = 0;
                    break;

                case 15:
                    if (cachesz < linbits + 2) {
                        bitcache   = (bitcache << 16) | peek.read(16);
                        cachesz   += 16;
                        bits_left -= 16;
                    }

                    value +=  (((bitcache) >> ((cachesz) - (linbits))) & ((1 << (linbits)) - 1));
                    cachesz -= linbits;

                    requantized = Mad.III_requantize(value, exp);
                    x_final = true; // simulating goto, yay
                    break;

                default:
                    if (reqhits & (1 << value))
                        requantized = reqcache[value];
                    else {
                        reqhits |= (1 << value);
                        requantized = reqcache[value] = Mad.III_requantize(value, exp);
                    }
                    x_final = true;
                }
                
                if(x_final) {
                    xr[xrptr] = ((bitcache) & (1 << ((cachesz--) - 1))) ?
                        -requantized : requantized;
                }

                /* y (0..14) */
                value = pair.value.y;
                var y_final = false;

                switch (value) {
                case 0:
                    xr[xrptr + 1] = 0;
                    break;

                case 15:
                    if (cachesz < linbits + 1) {
                        bitcache   = (bitcache << 16) | peek.read(16);
                        cachesz   += 16;
                        bits_left -= 16;
                    }

                    value +=  (((bitcache) >> ((cachesz) - (linbits))) & ((1 << (linbits)) - 1));
                    cachesz -= linbits;

                    requantized = Mad.III_requantize(value, exp);
                    y_final = true;
                    break; // simulating goto, yayzor

                default:
                    if (reqhits & (1 << value))
                        requantized = reqcache[value];
                    else {
                        reqhits |= (1 << value);
                        reqcache[value] = Mad.III_requantize(value, exp);
                        requantized = reqcache[value];
                    }
                    y_final = true;
                }
                
                if(y_final) {
                    xr[xrptr + 1] = ((bitcache) & (1 << ((cachesz--) - 1))) ?
                        -requantized : requantized;
                }
            } else {
                /* x (0..1) */
                value = pair.value.x;

                if (value == 0) {
                    xr[xrptr] = 0;
                } else {
                    if (reqhits & (1 << value))
                        requantized = reqcache[value];
                    else {
                        reqhits |= (1 << value);
                        requantized = reqcache[value] = Mad.III_requantize(value, exp);
                    }

                    xr[xrptr] = ((bitcache) & (1 << ((cachesz--) - 1))) ?
                        -requantized : requantized;
                }

                /* y (0..1) */
                value = pair.value.y;

                if (value == 0)
                    xr[xrptr + 1] = 0;
                else {
                    if (reqhits & (1 << value))
                        requantized = reqcache[value];
                    else {
                        reqhits |= (1 << value);
                        requantized = reqcache[value] = Mad.III_requantize(value, exp);
                    }

                    xr[xrptr + 1] = ((bitcache) & (1 << ((cachesz--) - 1))) ?
                        -requantized : requantized;
                }
            }

            xrptr += 2;
            //console.log("big_values = " + big_values + ", cachesz = " + cachesz +
            //  ", bits_left = " + bits_left + ", xrptr = " + xrptr);
        }
    }

    //console.log("bits_left (before big_values overrun) = " + bits_left);

    if (cachesz + bits_left < 0)
        return Mad.Error.BADHUFFDATA;  /* big_values overrun */

    /* count1 */
    {
        var table = Mad.huff_quad_table[channel.flags & Mad.count1table_select];
        var requantized = Mad.III_requantize(1, exp);

        while (cachesz + bits_left > 0 && xrptr <= 572) {
            /* hcod (1..6) */
            if (cachesz < 10) {
                bitcache   = (bitcache << 16) | peek.read(16);
                cachesz   += 16;
                bits_left -= 16;
            }
            
            var quad = table[ (((bitcache) >> ((cachesz) - (4))) & ((1 << (4)) - 1))];

            /* quad tables guaranteed to have at most one extra lookup */
            if (!quad['final']) {
                cachesz -= 4;

                quad = table[quad.ptr.offset +
                              (((bitcache) >> ((cachesz) - (quad.ptr.bits))) & ((1 << (quad.ptr.bits)) - 1))];
            }

            cachesz -= quad.value.hlen;

            if (xrptr == sfbound) {
                sfbound += sfbwidth[sfbwidthptr++];

                if (exp != exponents[expptr]) {
                    exp = exponents[expptr];
                    requantized = Mad.III_requantize(1, exp);
                }

                ++expptr;
            }

            /* v (0..1) */
            xr[xrptr] = quad.value.v ?
                (((bitcache) & (1 << ((cachesz--) - 1))) ? -requantized : requantized) : 0;

            /* w (0..1) */
            xr[xrptr + 1] = quad.value.w ?
                (((bitcache) & (1 << ((cachesz--) - 1))) ? -requantized : requantized) : 0;

            xrptr += 2;

            if (xrptr == sfbound) {
                sfbound += sfbwidth[sfbwidthptr++];

                if (exp != exponents[expptr]) {
                    exp = exponents[expptr];
                    requantized = Mad.III_requantize(1, exp);
                }

                ++expptr;
            }

            /* x (0..1) */
            xr[xrptr] = quad.value.x ?
                (((bitcache) & (1 << ((cachesz--) - 1))) ? -requantized : requantized) : 0;

            /* y (0..1) */
            xr[xrptr + 1] = quad.value.y ?
                (((bitcache) & (1 << ((cachesz--) - 1))) ? -requantized : requantized) : 0;

            xrptr += 2;
        }

        if (cachesz + bits_left < 0) {
            //# if 0 && defined(DEBUG)
            //console.log("huffman count1 overrun (" + (-(cachesz + bits_left)) + " bits)");
            //# endif

            /* technically the bitstream is misformatted, but apparently
               some encoders are just a bit sloppy with stuffing bits */
            xrptr -= 4;
        }
    }

    if (!(-bits_left <= Mad.BUFFER_GUARD * CHAR_BIT)) {
        throw new Error("assertion failed: (-bits_left <= Mad.BUFFER_GUARD * CHAR_BIT)");
    }

    /*
      # if 0 && defined(DEBUG)
      if (bits_left < 0)
      console.log("read " + (-bits_left) + " bits too many");
      else if (cachesz + bits_left > 0)
      console.log((cachesz + bits_left) + " stuffing bits");
      else
      console.log("bits_left " + bits_left);
      # endif
    */

    /* rzero */
    while (xrptr < 576) {
        xr[xrptr]     = 0;
        xr[xrptr + 1] = 0;

        xrptr += 2;
    }

    return Mad.Error.NONE;
}

/*
 * NAME:    III_sideinfo()
 * DESCRIPTION: decode frame side information from a bitstream
 * 
 * Since several values are passed by reference to this function, instead
 * we're just returning a hash containing:
 * {
 *   ptr (Mad.Bit)
 *   sideinfo (Mad.Sideinfo) 
 *   data_bitlen (Number)
 *   priv_bitlen (Number)
 * }
 */
Mad.III_sideinfo = function (ptr, nch, lsf) {
    
    var si = new Mad.SideInfo();
    var result = Mad.Error.NONE;

    var data_bitlen = 0;
    var priv_bitlen = lsf ? ((nch == 1) ? 1 : 2) : ((nch == 1) ? 5 : 3);
    
    si.main_data_begin = ptr.read(lsf ? 8 : 9);
    si.private_bits    = ptr.read(priv_bitlen);

    var ngr = 1;
    if (!lsf) {
        ngr = 2;

        for (var ch = 0; ch < nch; ++ch)
            si.scfsi[ch] = ptr.read(4);
    }

    for (var gr = 0; gr < ngr; ++gr) {
        var granule = new Mad.Granule();
        si.gr[gr] = granule;
        
        for (var ch = 0; ch < nch; ++ch) {
            var channel = new Mad.Channel();
            granule.ch[ch] = channel;
            
            channel.part2_3_length    = ptr.read(12);
            channel.big_values        = ptr.read(9);
            channel.global_gain       = ptr.read(8);
            channel.scalefac_compress = ptr.read(lsf ? 9 : 4);

            data_bitlen += channel.part2_3_length;

            if (channel.big_values > 288 && result == 0)
                result = Mad.Error.BADBIGVALUES;

            channel.flags = 0;

            /* window_switching_flag */
            if (ptr.read(1)) {
                channel.block_type = ptr.read(2);

                if (channel.block_type == 0 && result == 0)
                    result = Mad.Error.BADBLOCKTYPE;

                if (!lsf && channel.block_type == 2 && si.scfsi[ch] && result == 0)
                    result = Mad.Error.BADSCFSI;

                channel.region0_count = 7;
                channel.region1_count = 36;

                if (ptr.read(1))
                    channel.flags |= Mad.mixed_block_flag;
                else if (channel.block_type == 2)
                    channel.region0_count = 8;

                for (var i = 0; i < 2; ++i)
                    channel.table_select[i] = ptr.read(5);

                for (var i = 0; i < 3; ++i)
                    channel.subblock_gain[i] = ptr.read(3);
            } else {
                channel.block_type = 0;

                for (var i = 0; i < 3; ++i)
                    channel.table_select[i] = ptr.read(5);

                channel.region0_count = ptr.read(4);
                channel.region1_count = ptr.read(3);
            }

            /* [preflag,] scalefac_scale, count1table_select */
            channel.flags |= ptr.read(lsf ? 2 : 3);
        }
    }

    return {
        ptr: ptr,
        si: si,
        data_bitlen: data_bitlen,
        priv_bitlen: priv_bitlen
    };
}

/*
 * NAME:    III_scalefactors()
 * DESCRIPTION: decode channel scalefactors of one granule from a bitstream
 */
Mad.III_scalefactors = function (ptr, channel, gr0ch, scfsi) {
    var start; /* Mad.Bit */
    var slen1, slen2, sfbi;

    var start = ptr.clone();

    var slen1 = sflen_table[channel.scalefac_compress].slen1;
    var slen2 = sflen_table[channel.scalefac_compress].slen2;

    if (channel.block_type == 2) {
        sfbi = 0;

        var nsfb = (channel.flags & Mad.mixed_block_flag) ? 8 + 3 * 3 : 6 * 3;
        while (nsfb--)
            channel.scalefac[sfbi++] = ptr.read(slen1);

        nsfb = 6 * 3;
        while (nsfb--)
            channel.scalefac[sfbi++] = ptr.read(slen2);

        nsfb = 1 * 3;
        while (nsfb--)
            channel.scalefac[sfbi++] = 0;
    }
    else {  /* channel.block_type != 2 */
        if (scfsi & 0x8) {
            for (var sfbi = 0; sfbi < 6; ++sfbi)
                channel.scalefac[sfbi] = gr0ch.scalefac[sfbi];
        }
        else {
            for (var sfbi = 0; sfbi < 6; ++sfbi)
                channel.scalefac[sfbi] = ptr.read(slen1);
        }

        if (scfsi & 0x4) {
            for (var sfbi = 6; sfbi < 11; ++sfbi)
                channel.scalefac[sfbi] = gr0ch.scalefac[sfbi];
        }
        else {
            for (var sfbi = 6; sfbi < 11; ++sfbi)
                channel.scalefac[sfbi] = ptr.read(slen1);
        }

        if (scfsi & 0x2) {
            for (var sfbi = 11; sfbi < 16; ++sfbi)
                channel.scalefac[sfbi] = gr0ch.scalefac[sfbi];
        }
        else {
            for (var sfbi = 11; sfbi < 16; ++sfbi)
                channel.scalefac[sfbi] = ptr.read(slen2);
        }

        if (scfsi & 0x1) {
            for (var sfbi = 16; sfbi < 21; ++sfbi)
                channel.scalefac[sfbi] = gr0ch.scalefac[sfbi];
        }
        else {
            for (var sfbi = 16; sfbi < 21; ++sfbi)
                channel.scalefac[sfbi] = ptr.read(slen2);
        }

        channel.scalefac[21] = 0;
    }

    return start.length(ptr);
}

var c0 = 2 * Math.cos( 1 * Math.PI / 18);
var c1 = 2 * Math.cos( 3 * Math.PI / 18);
var c2 = 2 * Math.cos( 4 * Math.PI / 18);
var c3 = 2 * Math.cos( 5 * Math.PI / 18);
var c4 = 2 * Math.cos( 7 * Math.PI / 18);
var c5 = 2 * Math.cos( 8 * Math.PI / 18);
var c6 = 2 * Math.cos(16 * Math.PI / 18);

var fastsdct = function (x /* [9] */, y /* [18] */, offset) {
    var a0,  a1,  a2,  a3,  a4,  a5,  a6,  a7,  a8,  a9,  a10, a11, a12;
    var a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25;
    var m0,  m1,  m2,  m3,  m4,  m5,  m6,  m7;

    a0 = x[3] + x[5];
    a1 = x[3] - x[5];
    a2 = x[6] + x[2];
    a3 = x[6] - x[2];
    a4 = x[1] + x[7];
    a5 = x[1] - x[7];
    a6 = x[8] + x[0];
    a7 = x[8] - x[0];

    a8  = a0  + a2;
    a9  = a0  - a2;
    a10 = a0  - a6;
    a11 = a2  - a6;
    a12 = a8  + a6;
    a13 = a1  - a3;
    a14 = a13 + a7;
    a15 = a3  + a7;
    a16 = a1  - a7;
    a17 = a1  + a3;

    m0 = a17 * -c3;
    m1 = a16 * -c0;
    m2 = a15 * -c4;
    m3 = a14 * -c1;
    m4 = a5  * -c1;
    m5 = a11 * -c6;
    m6 = a10 * -c5;
    m7 = a9  * -c2;

    a18 =     x[4] + a4;
    a19 = 2 * x[4] - a4;
    a20 = a19 + m5;
    a21 = a19 - m5;
    a22 = a19 + m6;
    a23 = m4  + m2;
    a24 = m4  - m2;
    a25 = m4  + m1;

    /* output to every other slot for convenience */
    y[offset +  0] = a18 + a12;
    y[offset +  2] = m0  - a25;
    y[offset +  4] = m7  - a20;
    y[offset +  6] = m3;
    y[offset +  8] = a21 - m6;
    y[offset + 10] = a24 - m1;
    y[offset + 12] = a12 - 2 * a18;
    y[offset + 14] = a23 + m0;
    y[offset + 16] = a22 + m7;
}

/* sdctII_scale[i] = 2 * cos(PI * (2 * i + 1) / (2 * 18)) */
var sdctII_scale = [];
for(var i = 0; i < 9; ++i) {
    sdctII_scale[i] = 2 * Math.cos(Math.PI * (2 * i + 1) / (2 * 18));
}


sdctII = function (x /* [18] */, X /* [18] */) {
    /* divide the 18-point SDCT-II into two 9-point SDCT-IIs */

    // var tmp = new Float64Array(new ArrayBuffer(8 * 9));

    var tmp = [];

    /* even input butterfly */

    for (var i = 0; i < 9; ++i) {
        tmp[i] = x[i] + x[18 - i - 1];
    }

    fastsdct(tmp, X, 0);

    /* odd input butterfly and scaling */

    for (var i = 0; i < 9; ++i) {
        tmp[i] = (x[i] - x[18 - i - 1]) * sdctII_scale[i];
    }

    fastsdct(tmp, X, 1);

    /* output accumulation */
    
    for (var i = 3; i < 18; i += 2) {
        X[i] -= X[i - 2];
    }
}

/* dctIV_scale[i] = 2 * cos(PI * (2 * i + 1) / (4 * 18)) */  
var dctIV_scale = [];
for(i = 0; i < 18; i++) {
    dctIV_scale[i] = 2 * Math.cos(Math.PI * (2 * i + 1) / (4 * 18));
}

var dctIV = function (y /* [18] */, X /* [18] */) {
    // var tmp = new Float64Array(new ArrayBuffer(8 * 18));
    var tmp = [];

    /* scaling */

    for (var i = 0; i < 18; ++i) {
        tmp[i] = y[i] * dctIV_scale[i];
    }

    /* SDCT-II */

    sdctII(tmp, X);

    /* scale reduction and output accumulation */

    X[0] /= 2;
    for (var i = 1; i < 18; ++i) {
        X[i] = X[i] / 2 - X[i - 1];
    }
}

/*
 * NAME:    imdct36
 * DESCRIPTION: perform X[18]->x[36] IMDCT using Szu-Wei Lee's fast algorithm
 */
var imdct36 = function (x /* [18] */, y /* [36] */) {
    // var tmp = new Float64Array(new ArrayBuffer(8 * 18));
    var tmp = [];

    /* DCT-IV */
    dctIV(x, tmp);

    /* convert 18-point DCT-IV to 36-point IMDCT */

    for (var i =  0; i <  9; ++i) {
        y[i] =  tmp[9 + i];
    }
    for (var i =  9; i < 27; ++i) {
        y[i] = -tmp[36 - (9 + i) - 1];
    }
    for (var i = 27; i < 36; ++i) {
        y[i] = -tmp[i - 27];
    }
}

/*
 * NAME:    III_imdct_s()
 * DESCRIPTION: perform IMDCT and windowing for short blocks
 */
Mad.III_imdct_s = function (X /* [18] */, z /* [36] */)
{
    var yptr = 0;
    var wptr;
    var Xptr = 0;
    
    // var imdct_s_y = new Float64Array(new ArrayBuffer(8 * 36));
    var y = [];
    var hi, lo;

    /* IMDCT */
    for (var w = 0; w < 3; ++w) {
        var s = Mad.imdct_s;
        var sptr = 0;

        for (var i = 0; i < 3; ++i) {
            lo =  X[Xptr + 0] * s[sptr][0] +
                X[Xptr + 1] * s[sptr][1] +
                X[Xptr + 2] * s[sptr][2] +
                X[Xptr + 3] * s[sptr][3] +
                X[Xptr + 4] * s[sptr][4] +
                X[Xptr + 5] * s[sptr][5];


            y[yptr + i + 0] = lo;
            y[yptr + 5 - i] = -y[yptr + i + 0];

            ++sptr;

            lo =  X[Xptr + 0] * s[sptr][0] +
                X[Xptr + 1] * s[sptr][1] +
                X[Xptr + 2] * s[sptr][2] +
                X[Xptr + 3] * s[sptr][3] +
                X[Xptr + 4] * s[sptr][4] +
                X[Xptr + 5] * s[sptr][5];

            y[yptr +  i + 6] = lo;
            y[yptr + 11 - i] = y[yptr + i + 6];

            ++sptr;
        }

        yptr += 12;
        Xptr += 6;
    }

    /* windowing, overlapping and concatenation */

    yptr = 0;
    var wptr = 0;

    for (var i = 0; i < 6; ++i) {
        z[i +  0] = 0;
        z[i +  6] = y[yptr +  0 + 0] * window_s[wptr + 0];

        lo = y[yptr +  0 + 6] * window_s[wptr + 6] +
            y[yptr + 12 + 0] * window_s[wptr + 0];

        z[i + 12] = lo;

        lo = y[yptr + 12 + 6] * window_s[wptr + 6] +
            y[yptr + 24 + 0] * window_s[wptr + 0];

        z[i + 18] = lo;

        z[i + 24] = y[yptr + 24 + 6] * window_s[wptr + 6];
        z[i + 30] = 0;

        ++yptr;
        ++wptr;
    }
}

/*
 * NAME:    III_imdct_l()
 * DESCRIPTION: perform IMDCT and windowing for long blocks
 */
Mad.III_imdct_l = function (X /* 18 */, z /* 36 */, block_type) {
    /* IMDCT */
    imdct36(X, z);

    /* windowing */

    switch (block_type) {
    case 0:  /* normal window */
        for (var i = 0; i < 36; ++i) z[i] = z[i] * window_l[i];
        break;

    case 1:  /* start block */
        for (var i =  0; i < 18; ++i) z[i] = z[i] * window_l[i];
        /*  (var i = 18; i < 24; ++i) z[i] unchanged */
        for (var i = 24; i < 30; ++i) z[i] = z[i] * window_s[i - 18];
        for (var i = 30; i < 36; ++i) z[i] = 0;
        break;

    case 3:  /* stop block */
        for (var i =  0; i <  6; ++i) z[i] = 0;
        for (var i =  6; i < 12; ++i) z[i] = z[i] * window_s[i - 6];
        /*  (var i = 12; i < 18; ++i) z[i] unchanged */
        for (var i = 18; i < 36; ++i) z[i] = z[i] * window_l[i];
        break;
    }
}


/*
 * NAME:    III_freqinver()
 * DESCRIPTION: perform subband frequency inversion for odd sample lines
 */
Mad.III_freqinver = function (sample /* [18][32] */, sb)
{
    for (var i = 1; i < 18; i += 2)
        sample[i][sb] = -sample[i][sb];
}

/*
 * NAME:    III_decode()
 * DESCRIPTION: decode frame main_data
 * 
 * result struct:
 */
Mad.III_decode = function (ptr, frame, si, nch) {
    var header = frame.header;
    var sfreqi;
    
    {
        var sfreq = header.samplerate;

        if (header.flags & Mad.Flag.MPEG_2_5_EXT)
            sfreq *= 2;

        /* 48000 => 0, 44100 => 1, 32000 => 2,
           24000 => 3, 22050 => 4, 16000 => 5 */
        sfreqi = ((sfreq >>  7) & 0x000f) +
            ((sfreq >> 15) & 0x0001) - 8;

        if (header.flags & Mad.Flag.MPEG_2_5_EXT)
            sfreqi += 3;
    }
    
    /* scalefactors, Huffman decoding, requantization */
    var ngr = (header.flags & Mad.Flag.LSF_EXT) ? 1 : 2;
    
    for (var gr = 0; gr < ngr; ++gr) {
        var granule = si.gr[gr];
        var sfbwidth = [];
        /* unsigned char const *sfbwidth[2]; */
        var l = 0;
        // var xr = [ new Float64Array(new ArrayBuffer(8 * 576)), new Float64Array(new ArrayBuffer(8 * 576)) ];
        var xr = [[], []];
        var error;

        for (var ch = 0; ch < nch; ++ch) {
            var channel = granule.ch[ch];
            var part2_length;

            sfbwidth[ch] = sfbwidth_table[sfreqi].l;

            if (channel.block_type == 2) {
                sfbwidth[ch] = (channel.flags & Mad.mixed_block_flag) ?
                    sfbwidth_table[sfreqi].m : sfbwidth_table[sfreqi].s;
            }

            if (header.flags & Mad.Flag.LSF_EXT) {
                part2_length = Mad.III_scalefactors_lsf(ptr, channel,
                                                        ch == 0 ? 0 : si.gr[1].ch[1], header.mode_extension);
            } else {
                part2_length = Mad.III_scalefactors(ptr, channel, si.gr[0].ch[ch],
                                                    gr == 0 ? 0 : si.scfsi[ch]);
            }

            error = Mad.III_huffdecode(ptr, xr[ch], channel, sfbwidth[ch], part2_length);
            
            if (error)
                return error;
        }

        if (Mad.debug) {
            Mad.debug.huffdecode.write(Mad.debug.iteration + "\t");

            for (var i = 0; i < 576; i++) {
                Mad.debug.huffdecode.write(xr[0][i].toFixed(8) + "\t");
            }
            Mad.debug.huffdecode.write("\n");
        }

        /* joint stereo processing */
        if ((header.mode == Mad.Mode.JOINT_STEREO) && (header.mode_extension != 0)) {
            error = Mad.III_stereo(xr, granule, header, sfbwidth[0]);
            
            if (error)
                return error;
        }

        /* reordering, alias reduction, IMDCT, overlap-add, frequency inversion */
        for (var ch = 0; ch < nch; ++ch) {
            var channel = granule.ch[ch];
            var sample = frame.sbsample[ch].slice(18 * gr);
            
            var sb, l = 0, i, sblimit;
            // var output = new Float64Array(new ArrayBuffer(8 * 36));
            var output = [];

            if (channel.block_type == 2) {
                Mad.III_reorder(xr[ch], channel, sfbwidth[ch]);

                /*
                 * According to ISO/IEC 11172-3, "Alias reduction is not applied for
                 * granules with block_type == 2 (short block)." However, other
                 * sources suggest alias reduction should indeed be performed on the
                 * lower two subbands of mixed blocks. Most other implementations do
                 * this, so by default we will too.
                 */
                if (channel.flags & Mad.mixed_block_flag)
                    Mad.III_aliasreduce(xr[ch], 36);
            } else {
                Mad.III_aliasreduce(xr[ch], 576);
            }

            /* subbands 0-1 */
            if (channel.block_type != 2 || (channel.flags & Mad.mixed_block_flag)) {
                var block_type = channel.block_type;
                if (channel.flags & Mad.mixed_block_flag)
                    block_type = 0;

                /* long blocks */
                for (var sb = 0; sb < 2; ++sb, l += 18) {
                    Mad.III_imdct_l(xr[ch].slice(l, l + 18), output, block_type);
                    Mad.III_overlap(output, frame.overlap[ch][sb], sample, sb);

                    // var sys = require('sys');
                    // sys.print("\nblocktype: " + block_type + " sb: " + sb + "\n");
                    // for (var i = 0; i < 18; i++) {
                    //     sys.print(output[i].toFixed(8) + "\t");
                    //     if (i % 8 == 7) sys.print("\n");
                    // }

                }
            } else {
                /* short blocks */
                for (var sb = 0; sb < 2; ++sb, l += 18) {
                    Mad.III_imdct_s(xr[ch].slice(l, l + 18), output);
                    Mad.III_overlap(output, frame.overlap[ch][sb], sample, sb);
                }
            }

            Mad.III_freqinver(sample, 1);

            /* (nonzero) subbands 2-31 */
            i = 576;
            while (i > 36 && xr[ch][i - 1] == 0)
                --i;

            sblimit = 32 - (((576 - i) / 18) << 0);

            if (channel.block_type != 2) {
                /* long blocks */
                for (var sb = 2; sb < sblimit; ++sb, l += 18) {
                    Mad.III_imdct_l(xr[ch].slice(l, l + 18), output, channel.block_type);
                    Mad.III_overlap(output, frame.overlap[ch][sb], sample, sb);

                    if (sb & 1)
                        Mad.III_freqinver(sample, sb);
                }
            } else {
                /* short blocks */
                for (var sb = 2; sb < sblimit; ++sb, l += 18) {
                    Mad.III_imdct_s(xr[ch].slice(l, l + 18), output);
                    Mad.III_overlap(output, frame.overlap[ch][sb], sample, sb);

                    if (sb & 1)
                        Mad.III_freqinver(sample, sb);
                }
            }

            // remaining (zero) subbands
            for (var sb = sblimit; sb < 32; ++sb) {
                Mad.III_overlap_z(frame.overlap[ch][sb], sample, sb);

                if (sb & 1)
                    Mad.III_freqinver(sample, sb);
            }

            if (Mad.debug) {
                for (var i = 0; i < 18; i++) {
                    Mad.debug.sample.write(Mad.debug.iteration * 18 + i + "\t");
                    for (var j = 0; j < 32; j++) {
                        Mad.debug.sample.write(sample[i][j].toFixed(8) + "\t");
                    }
                    Mad.debug.sample.write("\n");
                }
                Mad.debug.iteration += 1;
            }       
        }
    }

    return Mad.Error.NONE;
}


/*
 * NAME:    layer.III()
 * DESCRIPTION: decode a single Layer III frame
 */
Mad.layer_III = function (stream, frame) {
    var header = frame.header;
    var nch, next_md_begin = 0;
    var si_len, data_bitlen, md_len = 0;
    var frame_space, frame_used, frame_free;
    var /* Mad.Error */ error;
    var ptr;
    var result = 0;

    /* allocate Layer III dynamic structures */
    nch = header.nchannels();
    si_len = (header.flags & Mad.Flag.LSF_EXT) ?
        (nch == 1 ? 9 : 17) : (nch == 1 ? 17 : 32);

    /* check frame sanity */
    if (stream.next_frame - stream.ptr.nextbyte() < si_len) {
        stream.error = Mad.Error.BADFRAMELEN;
        stream.md_len = 0;
        return -1;
    }

    /* check CRC word */
    if (header.flags & Mad.Flag.PROTECTION) {
        header.crc_check = mad_bit_crc(stream.ptr, si_len * CHAR_BIT, header.crc_check);

        if (header.crc_check != header.crc_target &&
            !(frame.options & Mad.Option.IGNORECRC)) {
            stream.error = Mad.Error.BADCRC;
            result = -1;
        }
    }

    /* decode frame side information */
    var sideinfoResult = Mad.III_sideinfo(stream.ptr, nch, header.flags & Mad.Flag.LSF_EXT);
    
    stream.ptr = sideinfoResult.ptr;
    var si = sideinfoResult.si;
    var data_bitlen = sideinfoResult.data_bitlen;
    var priv_bitlen = sideinfoResult.priv_bitlen;
    
    //console.log("We're at " + stream.ptr.offset + ", data_bitlen = " + data_bitlen + ", priv_bitlen = " + priv_bitlen);
    
    if (error && result == 0) {
        stream.error = error;
        result = -1;
    }

    header.flags        |= priv_bitlen;
    header.private_bits |= si.private_bits;

    /* find main_data of next frame */
    {
        var peek = new Mad.Bit(stream.stream, stream.next_frame);

        header = peek.read(32);
        
        if (Mad.bitwiseAnd(header, 0xffe60000) /* syncword | layer */ == 0xffe20000) { 
            if (!(Mad.bitwiseAnd(header, 0x00010000)))  /* protection_bit */
                peek.skip(16);  /* crc_check */

            next_md_begin = peek.read(Mad.bitwiseAnd(header, 0x00080000) /* ID */ ? 9 : 8);
        }
    }

    /* find main_data of this frame */
    frame_space = stream.next_frame - stream.ptr.nextbyte();

    //console.log("next_frame = " + stream.next_frame + ", nextbyte = " + stream.ptr.nextbyte() + ", frame_space = " + frame_space);

    //console.log("before, next_md_begin = " + next_md_begin);

    if (next_md_begin > si.main_data_begin + frame_space)
        next_md_begin = 0;

    //console.log("so far, md_len = " + md_len + ", si.main_data_begin = " + si.main_data_begin + ", frame_space = " + frame_space + ", next_md_begin = " + next_md_begin);
    
    md_len = si.main_data_begin + frame_space - next_md_begin;

    frame_used = 0;
    
    if (si.main_data_begin == 0) {
        ptr = stream.ptr;
        stream.md_len = 0;

        frame_used = md_len;
    } else {
        //console.log("si.main_data_begin = " + si.main_data_begin + ", stream.md_len = " + stream.md_len);
        if (si.main_data_begin > stream.md_len) {
            if (result == 0) {
                stream.error = Mad.Error.BADDATAPTR;
                result = -1;
            }
        } else {
            var old_md_len = stream.md_len;
            
            if (md_len > si.main_data_begin) {
                if(!(stream.md_len + md_len - si.main_data_begin <= Mad.BUFFER_MDLEN)) {
                    throw new Error("Assertion failed: (stream.md_len + md_len - si.main_data_begin <= MAD_BUFFER_MDLEN)");
                }
                
                frame_used = md_len - si.main_data_begin;
                
                /* memcpy(dst, dstOffset, src, srcOffset, length) - returns a copy of dst with modified bytes */
                stream.main_data = Mad.memcpy(stream.main_data, stream.md_len, stream.ptr.stream, stream.ptr.nextbyte(), frame_used);
                
                /*
                // Keeping this here as a handy little reference
                memcpy(*stream.main_data + stream.md_len,
                mad_bit_nextbyte(&stream.ptr),
                frame_used = md_len - si.main_data_begin
                );
                */
                stream.md_len += frame_used;
            }
            
            ptr = new Mad.Bit(stream.main_data, old_md_len - si.main_data_begin);
        }
    }

    frame_free = frame_space - frame_used;

    /* decode main_data */
    if (result == 0) {
        error = Mad.III_decode(ptr, frame, si, nch);
        
        if (error) {
            stream.error = error;
            result = -1;
        }
        
        /* designate ancillary bits */
        stream.anc_ptr    = ptr;
        stream.anc_bitlen = md_len * CHAR_BIT - data_bitlen;
    }
    
    // DEBUG
    /*
      console.log(
      "main_data_begin:" + si.main_data_begin +
      ", md_len:" + md_len +
      ", frame_free:" + frame_free +
      ", data_bitlen:" + data_bitlen +
      ", anc_bitlen: " + stream.anc_bitlen);
    */

    /* preload main_data buffer with up to 511 bytes for next frame(s) */
    if (frame_free >= next_md_begin) {
        stream.main_data = Mad.memcpy(stream.main_data, 0, stream.stream, stream.next_frame - next_md_begin, next_md_begin);
        /*
        // Keeping here for reference
        memcpy(*stream.main_data, stream.next_frame - next_md_begin, next_md_begin);
        */
        stream.md_len = next_md_begin;
    } else {
        if (md_len < si.main_data_begin) {
            var extra = si.main_data_begin - md_len;
            if (extra + frame_free > next_md_begin)
                extra = next_md_begin - frame_free;

            if (extra < stream.md_len) {
                stream.main_data = Mad.memcpy(stream.main_data, 0, stream.main_data, stream.md_len - extra, extra);
                /*
                // Keeping here for reference
                memmove(*stream.main_data, *stream.main_data + stream.md_len - extra, extra);
                */
                stream.md_len = extra;
            }
        } else {
            stream.md_len = 0;
        }

        stream.main_data = Mad.memcpy(stream.main_data, stream.md_len, stream.stream, stream.next_frame - frame_free, frame_free);
        /*
        // Keeping here for reference
        memcpy(*stream.main_data + stream.md_len, stream.next_frame - frame_free, frame_free);
        */
        stream.md_len += frame_free;
    }

    return result;
}

Mad.III_exponents = function(channel, sfbwidth, exponents) {
    var gain = channel.global_gain - 210;
    var scalefac_multiplier = (channel.flags & Mad.scalefac_scale) ? 2 : 1;
    
    if (channel.block_type == 2) {
        var sfbi = 0, l = 0;
        
        if (channel.flags & Mad.mixed_block_flag) {
            var premask = (channel.flags & Mad.preflag) ? ~0 : 0;
            
            /* long block subbands 0-1 */
            
            while (l < 36) {
                exponents[sfbi] = gain - ((channel.scalefac[sfbi] + (pretab[sfbi] & premask)) << scalefac_multiplier);
                
                l += sfbwidth[sfbi++]
            }
        }
        
        /* this is probably wrong for 8000 Hz short/mixed blocks */
        
        var gain0 = gain - 8 * channel.subblock_gain[0];
        var gain1 = gain - 8 * channel.subblock_gain[1];
        var gain2 = gain - 8 * channel.subblock_gain[2];
        
        while (l < 576) {
            exponents[sfbi + 0] = gain0 - (channel.scalefac[sfbi + 0] << scalefac_multiplier);
            exponents[sfbi + 1] = gain1 - (channel.scalefac[sfbi + 1] << scalefac_multiplier);
            exponents[sfbi + 2] = gain2 - (channel.scalefac[sfbi + 2] << scalefac_multiplier);
            
            l    += 3 * sfbwidth[sfbi];
            sfbi += 3;
        }
    } else { /* channel.block_type != 2 */
        if (channel.flags & Mad.preflag) {
            for (var sfbi = 0; sfbi < 22; ++sfbi) {
                exponents[sfbi] = gain - ((channel.scalefac[sfbi] + pretab[sfbi]) << scalefac_multiplier);
            }
        } else {
            for (var sfbi = 0; sfbi < 22; ++sfbi) {
                exponents[sfbi] = gain - (channel.scalefac[sfbi] << scalefac_multiplier);
            }
        }
    }
}

Mad.III_requantize = function(value, exp) {
    // usual (x >> 0) tricks to make sure frac and exp stay integers
    var frac = (exp % 4) >> 0;  /* assumes sign(frac) == sign(exp) */
    exp = (exp / 4) >> 0;

    var requantized = Math.pow(value, 4.0 / 3.0);
    requantized *= Math.pow(2.0, (exp / 4.0));
    
    if(frac) {
        requantized *= Math.pow(2.0, (frac / 4.0));
    }
    
    if(exp < 0) {
        requantized /= Math.pow(2.0, -exp * (3.0 / 4.0));
    }

    return requantized;
}

Mad.III_aliasreduce = function(xr, lines) {
    var xrPointer = 0;
    
    for (xrPointer += 18; xrPointer < lines; xrPointer += 18) {
        for (var i = 0; i < 8; ++i) {
            var a = xr[xrPointer - i - 1];
            var b = xr[xrPointer + i];

            var lo =  a * cs[i] - b * ca[i];

            xr[xrPointer - i - 1] = lo;

            lo =  b * cs[i] + a * ca[i];

            xr[xrPointer + i] = lo
        }
    }
}

Mad.III_overlap = function (output /* [36] */, overlap /* [18] */, sample /* [18][32] */, sb) {
    for (var i = 0; i < 18; ++i) {
        sample[i][sb] = output[i +  0] + overlap[i];
        overlap[i]    = output[i + 18];
    }
}

Mad.III_overlap_z = function (overlap /* [18] */, sample /* [18][32] */, sb) {
    for (var i = 0; i < 18; ++i) {
        sample[i][sb] = overlap[i];
        overlap[i]    = 0;
    }
}

// allocating typed arrays once and for all, outside the function
// var reorder_tmp = new Float64Array(new ArrayBuffer(8 * 32 * 3 * 6));
// var reorder_sbw = new Float64Array(new ArrayBuffer(8 * 3));
// var reorder_sw  = new Float64Array(new ArrayBuffer(8 * 3));

Mad.III_reorder = function (xr /* [576] */, channel, sfbwidth /* [39] */) {
    var sfbwidthPointer = 0;
    var tmp = [];

    for (var i = 0; i < 32; i++) {
        tmp[i] = [];
        for (var j = 0; j < 3; j++) {
            tmp[i][j] = [];
            for (var k = 0; k < 6; k++) {
                tmp[i][j][k] = 0;
            }
        }
    }

    var sbw = [];
    var sw  = [];
    
    /* this is probably wrong for 8000 Hz mixed blocks */

    var sb = 0;
    if (channel.flags & Mad.mixed_block_flag) {
        var sb = 2;

        var l = 0;
        while (l < 36)
            l += sfbwidth[sfbwidthPointer++];
    }

    for (var w = 0; w < 3; ++w) {
        sbw[w] = sb;
        sw[w]  = 0;
    }

    f = sfbwidth[sfbwidthPointer++];
    w = 0;

    for (var l = 18 * sb; l < 576; ++l) {
        if (f-- == 0) {
            f = sfbwidth[sfbwidthPointer++] - 1;
            w = (w + 1) % 3;
        }
        
        tmp[sbw[w]][w][sw[w]++] = xr[l];

        if (sw[w] == 6) {
            sw[w] = 0;
            ++sbw[w];
        }
    }

    var tmp2 = [];
    var ptr = 0;

    for (var i = 0; i < 32; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 6; k++) {
                tmp2[ptr++] = tmp[i][j][k];
            }
        }
    }
    
    var len = (576 - 18 * sb);

    for (var i = 0; i < len; i++) {
        xr[18 * sb + i] = tmp2[sb + i];
    }
}

Mad.III_stereo = function(xr /* [2][576] */, granule, header, sfbwidth) {
    var modes = [];
    var sfbi, l, n, i;

    if (granule.ch[0].block_type !=
        granule.ch[1].block_type ||
        (granule.ch[0].flags & Mad.mixed_block_flag) !=
        (granule.ch[1].flags & Mad.mixed_block_flag))
        return Mad.Error.BADSTEREO;

    for (i = 0; i < 39; ++i)
        modes[i] = header.mode_extension;

    /* intensity stereo */

    if (header.mode_extension & Mad.I_STEREO) {
        var right_ch = granule.ch[1];
        var right_xr = xr[1];
        var is_pos;

        header.flags |= Mad.Flag.I_STEREO;

        /* first determine which scalefactor bands are to be processed */

        if (right_ch.block_type == 2) {
            var lower, start, max, bound = [], w;

            lower = start = max = bound[0] = bound[1] = bound[2] = 0;

            sfbi = l = 0;

            if (right_ch.flags & Mad.mixed_block_flag) {
                while (l < 36) {
                    n = sfbwidth[sfbi++];

                    for (i = 0; i < n; ++i) {
                        if (right_xr[i]) {
                            lower = sfbi;
                            break;
                        }
                    }

                    right_xr += n;
                    l += n;
                }

                start = sfbi;
            }

            w = 0;
            while (l < 576) {
                n = sfbwidth[sfbi++];

                for (i = 0; i < n; ++i) {
                    if (right_xr[i]) {
                        max = bound[w] = sfbi;
                        break;
                    }
                }

                right_xr += n;
                l += n;
                w = (w + 1) % 3;
            }

            if (max)
                lower = start;

            /* long blocks */

            for (i = 0; i < lower; ++i)
                modes[i] = header.mode_extension & ~Mad.I_STEREO;

            /* short blocks */

            w = 0;
            for (i = start; i < max; ++i) {
                if (i < bound[w])
                    modes[i] = header.mode_extension & ~Mad.I_STEREO;

                w = (w + 1) % 3;
            }
        }
        else {  /* right_ch.block_type != 2 */
            var bound;

            bound = 0;
            for (sfbi = l = 0; l < 576; l += n) {
                n = sfbwidth[sfbi++];

                for (i = 0; i < n; ++i) {
                    if (right_xr[i]) {
                        bound = sfbi;
                        break;
                    }
                }

                right_xr += n;
            }

            for (i = 0; i < bound; ++i)
                modes[i] = header.mode_extension & ~Mad.I_STEREO;
        }

        /* now do the actual processing */

        if (header.flags & Mad.Flag.LSF_EXT) {
            illegal_pos = granule[1].ch[1].scalefac;
            var lsf_scale;

            /* intensity_scale */
            lsf_scale = is_lsf_table[right_ch.scalefac_compress & 0x1];

            for (sfbi = l = 0; l < 576; ++sfbi, l += n) {
                n = sfbwidth[sfbi];

                if (!(modes[sfbi] & Mad.I_STEREO))
                    continue;

                if (illegal_pos[sfbi]) {
                    modes[sfbi] &= ~Mad.I_STEREO;
                    continue;
                }

                is_pos = right_ch.scalefac[sfbi];

                for (i = 0; i < n; ++i) {
                    var left;

                    left = xr[0][l + i];

                    if (is_pos == 0)
                        xr[1][l + i] = left;
                    else {
                        var opposite;

                        opposite = left * lsf_scale[(is_pos - 1) / 2];

                        if (is_pos & 1) {
                            xr[0][l + i] = opposite;
                            xr[1][l + i] = left;
                        }
                        else
                            xr[1][l + i] = opposite;
                    }
                }
            }
        }
        else {  /* !(header.flags & MAD_FLAG_LSF_EXT) */
            for (sfbi = l = 0; l < 576; ++sfbi, l += n) {
                n = sfbwidth[sfbi];

                if (!(modes[sfbi] & Mad.I_STEREO))
                    continue;

                is_pos = right_ch.scalefac[sfbi];

                if (is_pos >= 7) {  /* illegal intensity position */
                    modes[sfbi] &= ~Mad.I_STEREO;
                    continue;
                }

                for (i = 0; i < n; ++i) {
                    var left;

                    left = xr[0][l + i];

                    xr[0][l + i] = left * is_table[    is_pos];
                    xr[1][l + i] = left * is_table[6 - is_pos];
                }
            }
        }
    }

    /* middle/side stereo */

    if (header.mode_extension & Mad.MS_STEREO) {
        var invsqrt2;

        header.flags |= Mad.Flag.MS_STEREO;

        invsqrt2 = root_table[3 + -2];

        for (sfbi = l = 0; l < 576; ++sfbi, l += n) {
            n = sfbwidth[sfbi];

            if (modes[sfbi] != Mad.MS_STEREO)
                continue;

            for (i = 0; i < n; ++i) {
                var m, s;

                m = xr[0][l + i];
                s = xr[1][l + i];

                xr[0][l + i] = (m + s) * invsqrt2;  /* l = (m + s) / sqrt(2) */
                xr[1][l + i] = (m - s) * invsqrt2;  /* r = (m - s) / sqrt(2) */
            }
        }
    }

    return Mad.Error.NONE;    
};