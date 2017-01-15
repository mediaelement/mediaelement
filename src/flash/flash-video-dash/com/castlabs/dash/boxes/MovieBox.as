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

public class MovieBox extends Box {
    private var _traks:Vector.<TrackBox> = new Vector.<TrackBox>();
    private var _mvex:MovieExtendsBox;

    public function MovieBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get traks():Vector.<TrackBox> {
        return _traks;
    }

    public function get mvex():MovieExtendsBox {
        return _mvex;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "trak") {
            parseTrackBox(offset, size, ba);
            return true;
        }

        if (type == "mvex") {
            parseMovieExtendsBox(offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseMovieExtendsBox(offset:uint, size:uint, ba:ByteArray):void {
        _mvex = _context.buildMovieExtendsBox(offset, size);
        _mvex.parse(ba);
    }

    private function parseTrackBox(offset:uint, size:uint, ba:ByteArray):void {
        var trak:TrackBox = _context.buildTrackBox(offset, size);
        trak.parse(ba);
        _traks.push(trak);
    }
}
}