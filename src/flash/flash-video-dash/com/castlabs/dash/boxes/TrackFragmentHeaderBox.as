/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {

import com.castlabs.dash.DashContext;
import com.castlabs.dash.utils.Bytes;

import flash.utils.ByteArray;

public class TrackFragmentHeaderBox extends FullBox {
    private var _baseDataOffsetPresent:Boolean = false;
    private var _baseDataOffset:Number;
    private var _defaultSampleDurationPresent:Boolean = false;
    private var _defaultSampleDuration:uint;

    public function TrackFragmentHeaderBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get defaultSampleDurationPresent():Boolean {
        return _defaultSampleDurationPresent;
    }

    public function get baseDataOffsetPresent():Boolean {
        return _baseDataOffsetPresent;
    }

    public function get defaultSampleDuration():uint {
        return _defaultSampleDuration;
    }

    public function get baseDataOffset():Number {
        return _baseDataOffset;
    }

    override protected function parseBox(ba:ByteArray):void {
        if ((flags & 0x1) == 0x1) {
            _baseDataOffsetPresent = true;
        }

        var sampleDescriptionIndexPresent:Boolean = false;
        if ((flags & 0x2) == 0x2) {
            sampleDescriptionIndexPresent = true;
        }

        if ((flags & 0x8) == 0x8) {
            _defaultSampleDurationPresent = true;
        }

        // trafId
        Bytes.readNumber(ba);

        if (_baseDataOffsetPresent) {
            _baseDataOffset = Bytes.readNumber(ba, 8);
        }

        Bytes.skipNumberIfNeeded(sampleDescriptionIndexPresent, ba);

        if (_defaultSampleDurationPresent) {
            _defaultSampleDuration = Bytes.readNumber(ba);
        }
    }
}
}