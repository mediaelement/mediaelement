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

public class MovieFragmentBox extends Box {
    private var _trafs:Vector.<TrackFragmentBox> = new Vector.<TrackFragmentBox>();
    private var _offset:uint;

    public function MovieFragmentBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
        _offset = offset;
    }

    public function get trafs():Vector.<TrackFragmentBox> {
        return _trafs;
    }

    public function get offset():uint {
        return _offset;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "traf") {
            parseTrackFragmentBox(_offset /* moof offset */, offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseTrackFragmentBox(moofOffset:uint, offset:uint, size:uint, ba:ByteArray):void {
        var traf:TrackFragmentBox = _context.buildTrackFragmentBox(moofOffset, offset, size);
        traf.parse(ba);
        _trafs.push(traf);
    }
}
}