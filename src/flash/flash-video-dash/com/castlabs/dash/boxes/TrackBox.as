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

public class TrackBox extends Box {
    private var _tkhd:TrackHeaderBox;
    private var _mdia:MediaBox;

    public function TrackBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get tkhd():TrackHeaderBox {
        return _tkhd;
    }

    public function get mdia():MediaBox {
        return _mdia;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "tkhd") {
            parseTrackHeaderBox(offset, size, ba);
            return true;
        }

        if (type == "mdia") {
            parseMediaBox(offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseTrackHeaderBox(offset:uint, size:uint, ba:ByteArray):void {
        _tkhd = _context.buildTrackHeaderBox(offset, size);
        _tkhd.parse(ba);
    }

    private function parseMediaBox(offset:uint, size:uint, ba:ByteArray):void {
        _mdia = _context.buildMediaBox(offset, size);
        _mdia.parse(ba);
    }
}
}