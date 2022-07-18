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

public class MediaBox extends Box {
    private var _mdhd:MediaHeaderBox;
    private var _hdlr:HandlerReferenceBox;
    private var _minf:MediaInformationBox;

    public function MediaBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get mdhd():MediaHeaderBox {
        return _mdhd;
    }

    public function get hdlr():HandlerReferenceBox {
        return _hdlr;
    }

    public function get minf():MediaInformationBox {
        return _minf;
    }

    override protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        if (type == "mdhd") {
            parseMediaHeaderBox(offset, size, ba);
            return true;
        }

        if (type == "hdlr") {
            parseHandlerReferenceBox(offset, size, ba);
            return true;
        }

        if (type == "minf") {
            parseMediaInformationBox(offset, size, ba);
            return true;
        }

        return false;
    }

    private function parseMediaInformationBox(offset:uint, size:uint, ba:ByteArray):void {
        _minf = _context.buildMediaInformationBox(offset, size);
        _minf.parse(ba);
    }

    private function parseHandlerReferenceBox(offset:uint, size:uint, ba:ByteArray):void {
        _hdlr = _context.buildHandlerReferenceBox(offset, size);
        _hdlr.parse(ba);
    }

    private function parseMediaHeaderBox(offset:uint, size:uint, ba:ByteArray):void {
        _mdhd = _context.buildMediaHeaderBox(offset, size);
        _mdhd.parse(ba);
    }
}
}