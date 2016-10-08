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

public class MediaInformationBox extends Box {
    private var _stbl:SampleTableBox;

    public function MediaInformationBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get stbl():SampleTableBox {
        return _stbl;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "stbl") {
            parseSampleTableBox(offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseSampleTableBox(offset:uint, size:uint, ba:ByteArray):void {
        _stbl = _context.buildSampleTableBox(offset, size);
        _stbl.parse(ba);
    }
}
}