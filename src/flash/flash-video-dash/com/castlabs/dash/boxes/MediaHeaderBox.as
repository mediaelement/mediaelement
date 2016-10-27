/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {
import com.castlabs.dash.DashContext;

import flash.utils.ByteArray;

public class MediaHeaderBox extends FullBox {
    private var _timescale:uint;

    public function MediaHeaderBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get timescale():uint {
        return _timescale;
    }

    override protected function parseBox(ba:ByteArray):void {
        if (version == 1) {
            parseVersion1(ba);
        }

        if (version == 0) {
            parseVersion2(ba);
        }
    }

    private function parseVersion1(ba:ByteArray):void {

//        // creation time MSB
//        ba.readUnsignedInt();  // 4 bytes
//        // creation time LSB
//        ba.readUnsignedInt();  // 4 bytes
//        // modification time MSB
//        ba.readUnsignedInt();  // 4 bytes
//        // modification time LSB
//        ba.readUnsignedInt();  // 4 bytes

        // skip
        ba.position += 16;

        // timescale
        _timescale = ba.readUnsignedInt(); // 4 bytes
    }

    private function parseVersion2(ba:ByteArray):void {

//        // creation time LSB
//        ba.readUnsignedInt(); // 4 bytes
//        // modification time LSB
//        ba.readUnsignedInt(); // 4 bytes

        // skip
        ba.position += 8;

        // timescale
        _timescale = ba.readUnsignedInt();
    }
}
}