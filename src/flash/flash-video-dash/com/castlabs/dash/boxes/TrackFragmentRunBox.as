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

public class TrackFragmentRunBox extends FullBox {
    private var _sampleDurationPresent:Boolean = false;
    private var _sampleDuration:Vector.<uint> = new Vector.<uint>();
    private var _sampleDependsOn:Vector.<uint> = new Vector.<uint>();
    private var _sampleIsDependedOn:Vector.<uint> = new Vector.<uint>();
    private var _sampleSize:Vector.<uint> = new Vector.<uint>();
    private var _sampleCompositionTimeOffset:Vector.<int> = new Vector.<int>();
    private var _dataOffset:int;

    public function TrackFragmentRunBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get dataOffset():int {
        return _dataOffset;
    }

    public function get sampleDurationPresent():Boolean {
        return _sampleDurationPresent;
    }

    public function get sampleCompositionTimeOffset():Vector.<int> {
        return _sampleCompositionTimeOffset;
    }

    public function get sampleSize():Vector.<uint> {
        return _sampleSize;
    }

    public function get sampleDuration():Vector.<uint> {
        return _sampleDuration;
    }

    public function get sampleDependsOn():Vector.<uint> {
        return _sampleDependsOn;
    }

    public function get sampleIsDependedOn():Vector.<uint> {
        return _sampleIsDependedOn;
    }

    override protected function parseBox(ba:ByteArray):void {
        if ((flags & 0x1) != 0x1) {
            throw _context.console.logAndBuildError("[TrackFragmentBox]: 'dataOffset' isn't present");
        }

        var firstSampleFlagsPresent:Boolean = false;
        if ((flags & 0x4) == 0x4) {
            firstSampleFlagsPresent = true;
        }

        if ((flags & 0x100) == 0x100) {
            _sampleDurationPresent = true;
        }

        var sampleSizePresent:Boolean = false;
        if ((flags & 0x200) == 0x200) {
            sampleSizePresent = true;
        }

        var secondSampleFlagsPresent:Boolean = false;
        if ((flags & 0x400) == 0x400) {
            secondSampleFlagsPresent = true;
        }

        var sampleCompositionTimeOffsetsPresent:Boolean = false;
        if ((flags & 0x800) == 0x800) {
            sampleCompositionTimeOffsetsPresent = true;
        }

        var sampleCount:uint = Bytes.readNumber(ba);

        _dataOffset = Bytes.readNumber(ba);
        Bytes.skipNumberIfNeeded(firstSampleFlagsPresent, ba);

        for (var i:uint = 0; i < sampleCount; i++) {
            parseSampleDurationIfNeeded(i, ba);
            parseSampleSizeIfNeeded(sampleSizePresent, i, ba);
            parseSampleFlagsIfNeeded(secondSampleFlagsPresent, i, ba);
            parseSampleCompositionTimeOffsetsIfNeeded(sampleCompositionTimeOffsetsPresent, i, ba);
        }
    }

    private function parseSampleCompositionTimeOffsetsIfNeeded(present:Boolean, i:uint, ba:ByteArray):void {
        if (present) {
            if (version == 0) {
                parseSampleCompositionTimeOffsetsVersion0(i, ba);
            }

            if (version == 1) {
                parseSampleCompositionTimeOffsetsVersion1(i, ba);
            }
        }
    }

    private function parseSampleCompositionTimeOffsetsVersion1(i:uint, ba:ByteArray):void {
        var cts:uint = Bytes.readNumber(ba);

        if (((cts >> 31) & 0x1) == 1) {
            _sampleCompositionTimeOffset[i] = cts - 0xffffffff;
        } else {
            _sampleCompositionTimeOffset[i] = cts;
        }
    }

    private function parseSampleCompositionTimeOffsetsVersion0(i:uint, ba:ByteArray):void {
        _sampleCompositionTimeOffset[i] = Bytes.readNumber(ba);
    }

    private function parseSampleSizeIfNeeded(present:Boolean, i:uint, ba:ByteArray):void {
        if (present) {
            _sampleSize[i] = Bytes.readNumber(ba);
        }
    }

    private function parseSampleDurationIfNeeded(i:uint, ba:ByteArray):void {
        if (_sampleDurationPresent) {
            _sampleDuration[i] = Bytes.readNumber(ba);
        }
    }

    private function parseSampleFlagsIfNeeded(present:Boolean, i:uint, ba:ByteArray):void {
        if (present) {
            var sampleFlags:uint = ba.readUnsignedInt();
            _sampleDependsOn[i] = (sampleFlags >> 24) & 0x03;
            _sampleIsDependedOn[i] = (sampleFlags >> 22) & 0x03;
        }
    }
}
}