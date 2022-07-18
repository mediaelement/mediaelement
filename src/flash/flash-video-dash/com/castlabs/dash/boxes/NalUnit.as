/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {
import flash.utils.ByteArray;

public class NalUnit {
    private static const HEADER:uint = 1;

    public function NalUnit() {
    }

    public function parse(ba:ByteArray):uint {
        ba.position = 0;

        var pPresent:Boolean = false;
        var bPresent:Boolean = false;
        var iPresent:Boolean = false;

        while (ba.bytesAvailable) {
            var nalUnitLength:uint = ba.readUnsignedInt();
            var nalUnitHeader:uint = ba.readUnsignedByte();
            var nalUnitType:uint = nalUnitHeader & 0x1f;

            if ((nalUnitHeader & 0x80) != 0x0) {
                return FLVTag.UNKNOWN;
            }

            if (nalUnitType == 0x5) {
                return FLVTag.I_FRAME;
            }

            if (nalUnitType == 0x1) {
                var bits:BitArray = new BitArray(ba);

                // firstMbInSlice
                readUnsignedIntegerFromGolombCode(bits);

                var sliceType:uint = readUnsignedIntegerFromGolombCode(bits);

                switch (sliceType) {
                    case 0:
                        pPresent = true;
                        break;
                    case 1:
                        bPresent = true;
                        break;
                    case 2:
                        iPresent = true;
                        break;
                    case 5:
                        return FLVTag.P_FRAME;
                    case 6:
                        return FLVTag.B_FRAME;
                    case 7:
                        return FLVTag.I_FRAME;
                    case 8:
                        return FLVTag.UNKNOWN;
                    case 9:
                        return FLVTag.UNKNOWN;
                }
            }

            ba.position += nalUnitLength - HEADER;
        }

        if (bPresent) {
            return FLVTag.B_FRAME;
        }

        if (pPresent) {
            return FLVTag.P_FRAME;
        }

        if (iPresent) {
            return FLVTag.I_FRAME;
        }

        return FLVTag.UNKNOWN;
    }

    private function readUnsignedIntegerFromGolombCode(ba:BitArray):uint {
        var leadingZeroBits:uint = 0;

        // count number of zeros
        while (ba.readBit() == 0) {
            leadingZeroBits++;
        }

        // code = 2^(leadingZeroBits) – 1
        var code:uint = (1 << leadingZeroBits) - 1;

        // code += read_bits(leadingZeroBits)
        for (var i:int = (leadingZeroBits - 1); i >= 0; i--) {
            code += ba.readBit() << i;
        }

        return code;
    }
}
}

import flash.utils.ByteArray;

class BitArray {
    private var _ba:ByteArray;
    private var _offset:uint;

    public function BitArray(ba:ByteArray) {
        _ba = ba;
        _offset = ba.position * 8;
    }

    public function readBit():uint {
        var byte:uint = _ba[(_offset >> 0x3)];
        var byteOffset:uint = 0x7 - (_offset & 0x7);

        _offset++;

        return (byte >> byteOffset) & 0x1;
    }
}
