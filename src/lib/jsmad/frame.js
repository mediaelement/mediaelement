
var bitrate_table /* [5][15] */ = [
  /* MPEG-1 */
  [ 0,  32000,  64000,  96000, 128000, 160000, 192000, 224000,  /* Layer I   */
       256000, 288000, 320000, 352000, 384000, 416000, 448000 ],
  [ 0,  32000,  48000,  56000,  64000,  80000,  96000, 112000,  /* Layer II  */
       128000, 160000, 192000, 224000, 256000, 320000, 384000 ],
  [ 0,  32000,  40000,  48000,  56000,  64000,  80000,  96000,  /* Layer III */
       112000, 128000, 160000, 192000, 224000, 256000, 320000 ],

  /* MPEG-2 LSF */
  [ 0,  32000,  48000,  56000,  64000,  80000,  96000, 112000,  /* Layer I   */
       128000, 144000, 160000, 176000, 192000, 224000, 256000 ],
  [ 0,   8000,  16000,  24000,  32000,  40000,  48000,  56000,  /* Layers    */
        64000,  80000,  96000, 112000, 128000, 144000, 160000 ] /* II & III  */
];

var samplerate_table /* [3] */ = [ 44100, 48000, 32000 ];

var decoder_table = [
    function() { console.log("Layer I decoding is not implemented!"); },
    function() { console.log("Layer II decoding is not implemented!"); },
    Mad.layer_III
];

Mad.Layer = {
    I: 1,
    II: 2,
    III: 3
};

Mad.Mode = {
    SINGLE_CHANNEL      : 0,
    DUAL_CHANNEL        : 1,      /* dual channel */
    JOINT_STEREO        : 2,      /* joint (MS/intensity) stereo */
    STEREO              : 3       /* normal LR stereo */
};

Mad.Emphasis = {
    NONE       : 0,     /* no emphasis */
    _50_15_US  : 1,     /* 50/15 microseconds emphasis */
    CCITT_J_17 : 3,     /* CCITT J.17 emphasis */
    RESERVED   : 2      /* unknown emphasis */
};

Mad.Header = function () {
    this.layer          = 0;            /* audio layer (1, 2, or 3) */
    this.mode           = 0;            /* channel mode (see above) */
    this.mode_extension = 0;            /* additional mode info */
    this.emphasis       = 0;            /* de-emphasis to use (see above) */    

    this.bitrate        = 0;            /* stream bitrate (bps) */
    this.samplerate     = 0;            /* sampling frequency (Hz) */

    this.crc_check      = 0;            /* frame CRC accumulator */
    this.crc_target     = 0;            /* final target CRC checksum */

    this.flags          = 0;            /* flags (see below) */
    this.private_bits   = 0;            /* private bits (see below) */

    //this.duration       = mad_timer_zero;         /* audio playing time of frame */
};

Mad.Header.prototype.nchannels = function () {
    return this.mode == 0 ? 1 : 2;
}

Mad.Header.prototype.nbsamples = function() {
    return (this.layer == Mad.Layer.I ? 12 : 
        ((this.layer == Mad.Layer.III && (this.flags & Mad.Flag.LSF_EXT)) ? 18 : 36));
}

/* libmad's decode_header */
Mad.Header.actually_decode = function(stream) {
    var header = new Mad.Header();
    
    header.flags        = 0;
    header.private_bits = 0;

    /* header() */

    /* syncword */
    stream.ptr.skip(11);
    
    /* MPEG 2.5 indicator (really part of syncword) */
    if (stream.ptr.read(1) == 0) {
        header.flags |= Mad.Flag.MPEG_2_5_EXT;
    }

    /* ID */
    if (stream.ptr.read(1) == 0) {
        header.flags |= Mad.Flag.LSF_EXT;
    } else if (header.flags & Mad.Flag.MPEG_2_5_EXT) {
        stream.error = Mad.Error.LOSTSYNC;
        return null;
    }

    /* layer */
    header.layer = 4 - stream.ptr.read(2);

    if (header.layer == 4) {
        stream.error = Mad.Error.BADLAYER;
        return header;
    }

    /* protection_bit */
    if (stream.ptr.read(1) == 0) {
        header.flags    |= Mad.Flag.PROTECTION;
        // TODO: crc
        //header.crc_check = mad_bit_crc(stream.ptr, 16, 0xffff);
        stream.ptr.skip(16);
    }

    /* bitrate_index */
    var index = stream.ptr.read(4);
    if (index == 15) {
        stream.error = Mad.Error.BADBITRATE;
        return header;
    }

    if (header.flags & Mad.Flag.LSF_EXT) {
        header.bitrate = bitrate_table[3 + (header.layer >> 1)][index];
    } else {
        header.bitrate = bitrate_table[header.layer - 1][index];
    }

    /* sampling_frequency */
    index = stream.ptr.read(2);

    if (index == 3) {
        stream.error = Mad.Error.BADSAMPLERATE;
        return header;
    }

    header.samplerate = samplerate_table[index];

    if (header.flags & Mad.Flag.LSF_EXT) {
        header.samplerate /= 2;

        if (header.flags & Mad.Flag.MPEG_2_5_EXT)
            header.samplerate /= 2;
    }

    /* padding_bit */
    if (stream.ptr.read(1))
        header.flags |= Mad.Flag.PADDING;

    /* private_bit */
    if (stream.ptr.read(1))
        header.private_bits |= Mad.Private.HEADER;

    /* mode */
    header.mode = 3 - stream.ptr.read(2);

    /* mode_extension */
    header.mode_extension = stream.ptr.read(2);

    /* copyright */
    if (stream.ptr.read(1))
        header.flags |= Mad.Flag.COPYRIGHT;

    /* original/copy */
    if (stream.ptr.read(1))
        header.flags |= Mad.Flag.ORIGINAL;

    /* emphasis */
    header.emphasis = stream.ptr.read(2);
    
    /* error_check() */

    /* crc_check */
    if (header.flags & Mad.Flag.PROTECTION)
        header.crc_target = stream.ptr.read(16);
    
    return header;
}

/* libmad's mad_header_decode */
Mad.Header.decode = function(stream) {
    var header = null;
    
    // those are actually pointers. javascript powa.
    var ptr = stream.next_frame;
    var end = stream.bufend;
    var pad_slot = 0;
    var N = 0;
    
    /* stream skip */
    if (stream.skiplen) {
        if (!stream.sync)
            ptr = stream.this_frame;

        if (end - ptr < stream.skiplen) {
            stream.skiplen   -= end - ptr;
            stream.next_frame = end;

            stream.error = Mad.Error.BUFLEN;
            return null;
        }

        ptr += stream.skiplen;
        stream.skiplen = 0;

        stream.sync = 1;
    }

    // emulating goto in JS, yay! this was a 'sync:' label
    var syncing = true;

    while(syncing) {
        syncing = false;
 
        /* synchronize */
        try {
            if (stream.sync) {
                if (end - ptr < Mad.BUFFER_GUARD) {
                    stream.next_frame = ptr;

                    stream.error = Mad.Error.BUFLEN;
                    return null;
                } else if (!(stream.getU8(ptr) == 0xff && (stream.getU8(ptr + 1) & 0xe0) == 0xe0)) {
                    /* mark point where frame sync word was expected */
                    stream.this_frame = ptr;
                    stream.next_frame = ptr + 1;

                    stream.error = Mad.Error.LOSTSYNC;
                    return null;
                }
            } else {
                stream.ptr = new Mad.Bit(stream.stream, ptr);

                if (stream.doSync() == -1) {
                    if (end - stream.next_frame >= Mad.BUFFER_GUARD)
                        stream.next_frame = end - Mad.BUFFER_GUARD;
                    stream.error = Mad.Error.BUFLEN;
                    return null;
                }

                ptr = stream.ptr.nextbyte();
            }
        } catch (e) {
            console.log("Synchronization error: " + e);
            
            stream.error = Mad.Error.BUFLEN;
            
            return null;
        }

        /* begin processing */
        stream.this_frame = ptr;
        stream.next_frame = ptr + 1;  /* possibly bogus sync word */

        stream.ptr = new Mad.Bit(stream.stream, stream.this_frame);
        
        header = Mad.Header.actually_decode(stream);
        if(header == null) return null; // well Duh^2

        // console.log("============= Decoding layer " + header.layer + " audio mode " +
        //     header.mode + " with " + header.bitrate +
        //     " bps and a samplerate of " + header.samplerate);

        /* calculate frame duration */
        //mad_timer_set(&header.duration, 0, 32 * MAD_NSBSAMPLES(header), header.samplerate);

        /* calculate free bit rate */
        if (header.bitrate == 0) {
            console.log("Uh oh, a free bitrate stream. We're fucked.");
            stream.error = Mad.Error.BADDATAPTR; // best guess
            return null;
            
    //        if ((stream.freerate == 0 || !stream.sync ||
    //                        (header.layer == Mad.Layer.III && stream.freerate > 640000)) &&
    //                free_bitrate(stream, header) == -1)
    //            return null;
    //
    //        header.bitrate = stream.freerate;
    //        header.flags  |= Mad.Flag.FREEFORMAT;
        }

        /* calculate beginning of next frame */
        pad_slot = (header.flags & Mad.Flag.PADDING) ? 1 : 0;

        if (header.layer == Mad.Layer.I) {
            N = (((12 * header.bitrate / header.samplerate) << 0) + pad_slot) * 4;
        } else {
            var slots_per_frame = (header.layer == Mad.Layer.III &&
                   (header.flags & Mad.Flag.LSF_EXT)) ? 72 : 144;
            //console.log("slots_per_frame = " + slots_per_frame + ", bitrate = " + header.bitrate + ", samplerate = " + header.samplerate);

            N = ((slots_per_frame * header.bitrate / header.samplerate) << 0) + pad_slot;
        }
            

        /* verify there is enough data left in buffer to decode this frame */
        if (N + Mad.BUFFER_GUARD > end - stream.this_frame) {
            stream.next_frame = stream.this_frame;

            stream.error = Mad.Error.BUFLEN;
            return null;
        }

        stream.next_frame = stream.this_frame + N;

        // console.log("N = " + N + ", pad_slot = " + pad_slot + ", next_frame = " + stream.next_frame);

        if (!stream.sync) {
            /* check that a valid frame header follows this frame */
            ptr = stream.next_frame;
            if (!(stream.getU8(ptr) == 0xff && (stream.getU8(ptr + 1) & 0xe0) == 0xe0)) {
                ptr = stream.next_frame = stream.this_frame + 1;
          
                // emulating 'goto sync'
                syncing = true;
                continue;
            }
            stream.sync = 1;
        }
    } // end of goto emulation (label 'sync')
    
    header.flags |= Mad.Flag.INCOMPLETE;
    return header;
}

Mad.Frame = function () {
    this.header = new Mad.Header();     /* MPEG audio header */
    
    this.options = 0;                   /* decoding options (from stream) */

    // sbsample[2][36][32]
    this.sbsample = [];   /* synthesis subband filter samples */
    for(var ch = 0; ch < 2; ch++) {
        this.sbsample[ch] = [];
        for(var grp = 0; grp < 36; grp++) {
            // this.sbsample[ch][grp] = new Float64Array(new ArrayBuffer(8 * 32));
            this.sbsample[ch][grp] = [];
            for(var i = 0; i < 32; i++) {
                this.sbsample[ch][grp][i] = 0;
            }
        }
    }
    
    // overlap[2][32][18]
    this.overlap = []; /* Layer III block overlap data */
    for(var ch = 0; ch < 2; ch++) {
        this.overlap[ch] = [];
        for(var sb = 0; sb < 32; sb++) {
            // this.overlap[ch][sb] = new Float64Array(new ArrayBuffer(8 * 18));
            this.overlap[ch][sb] = [];
            for(var i = 0; i < 18; i++) {
                this.overlap[ch][sb][i] = 0;
            }
        }
    }
};

Mad.Frame.decode = function(frame, stream) {
    frame.options = stream.options;
    
    /* header() */
    /* error_check() */

    if (!(frame.header.flags & Mad.Flag.INCOMPLETE)) {
        frame.header = Mad.Header.decode(stream);
        if(frame.header == null) {
            // something went wrong
            return null;
        }
    }

    /* audio_data() */

    frame.header.flags &= ~Mad.Flag.INCOMPLETE;

    // TODO: actually decode the data :)
    if (decoder_table[frame.header.layer - 1](stream, frame) == -1) {
    
        if (!Mad.recoverable(stream.error))
            stream.next_frame = stream.this_frame;
        return null;
    }
    
    return frame;
};

Mad.sbsampleIndex = function (i, j, k) {
    return i * 36 * 32 + j * 32 + k;
};

Mad.overlapIndex = function (i, j, k) {
    return i * 32 * 18 + j * 18 + k;
};

Mad.Flag = {
    NPRIVATE_III   : 0x0007,   /* number of Layer III private bits */
    INCOMPLETE : 0x0008,   /* header but not data is decoded */

    PROTECTION : 0x0010,   /* frame has CRC protection */
    COPYRIGHT  : 0x0020,   /* frame is copyright */
    ORIGINAL   : 0x0040,   /* frame is original (else copy) */
    PADDING    : 0x0080,   /* frame has additional slot */

    I_STEREO   : 0x0100,   /* uses intensity joint stereo */
    MS_STEREO  : 0x0200,   /* uses middle/side joint stereo */
    FREEFORMAT : 0x0400,   /* uses free format bitrate */

    LSF_EXT    : 0x1000,   /* lower sampling freq. extension */
    MC_EXT : 0x2000,   /* multichannel audio extension */
    MPEG_2_5_EXT   : 0x4000    /* MPEG 2.5 (unofficial) extension */
};

Mad.Private = {
    HEADER  : 0x0100,   /* header private bit */
    III : 0x001f    /* Layer III private bits (up to 5) */
};
