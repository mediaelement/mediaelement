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

public class SampleDescriptionBox extends FullBox {
    private var _sampleEntries:Vector.<SampleEntry> = new Vector.<SampleEntry>();

    public function SampleDescriptionBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get sampleEntries():Vector.<SampleEntry> {
        return _sampleEntries;
    }

    override protected function parseBox(ba:ByteArray):void {
        var sampleEntriesLength:uint = ba.readUnsignedInt();

        for (var i:uint = 0; i < sampleEntriesLength; i++) {
            var offset:uint = ba.position;
            var size:uint = ba.readUnsignedInt();
            var type:String = ba.readUTFBytes(4);

            parseSampleEntry(offset, size, type, ba);
        }
    }

    private function parseSampleEntry(offset:uint, size:uint, type:String, ba:ByteArray):void {
        var sampleEntry:SampleEntry = _context.buildSampleEntry(offset, size, type);
        sampleEntry.parse(ba);
        _sampleEntries.push(sampleEntry);
    }
}
}