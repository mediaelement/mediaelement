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

public class TrackExtendsBox extends FullBox {
    private var _trackId:uint;
    private var _defaultSampleDuration:uint;

    public function TrackExtendsBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get trackId():uint {
        return _trackId;
    }

    public function get defaultSampleDuration():uint {
        return _defaultSampleDuration;
    }

    override protected function parseBox(ba:ByteArray):void {

        // track ID
        _trackId = ba.readUnsignedInt();

//        // default sample description index
//        ba.readUnsignedInt(); // 4 bytes

        // skip
        ba.position += 4;

        _defaultSampleDuration = ba.readUnsignedInt();
    }
}
}