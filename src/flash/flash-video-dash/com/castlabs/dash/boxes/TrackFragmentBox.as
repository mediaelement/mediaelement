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

public class TrackFragmentBox extends Box {
    private var _truns:Vector.<TrackFragmentRunBox> = new Vector.<TrackFragmentRunBox>();
    private var _tfhd:TrackFragmentHeaderBox;

    public function TrackFragmentBox(context:DashContext, moofOffset:uint, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get truns():Vector.<TrackFragmentRunBox> {
        return _truns;
    }

    public function get tfhd():TrackFragmentHeaderBox {
        return _tfhd;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "tfhd") {
            parseTrackFragmentHeaderBox(offset, size, ba);
            return true;
        }

        if (type == "trun") {
            parseTrackFragmentRunBox(offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseTrackFragmentRunBox(offset:uint, size:uint, ba:ByteArray):void {
        var trun:TrackFragmentRunBox = _context.buildTrackFragmentRunBox(offset, size);
        trun.parse(ba);
        _truns.push(trun);
    }

    private function parseTrackFragmentHeaderBox(offset:uint, size:uint, ba:ByteArray):void {
        _tfhd = _context.buildTrackFragmentHeaderBox(offset, size);
        _tfhd.parse(ba);
    }
}
}