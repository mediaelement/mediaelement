/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.handlers {

import com.castlabs.dash.utils.Bytes;

import flash.utils.ByteArray;

public class IndexSegmentHandler {
    public static const SEGMENT_INDEX_BOX_TYPE:String = "sidx";

    private var _references:Vector.<Object> = new Vector.<Object>();

    public function IndexSegmentHandler(segment:ByteArray, indexSegmentRangeBegin:Number) {
        processSegment(segment, indexSegmentRangeBegin);
    }

    private function processSegment(segment:ByteArray, indexSegmentRangeBegin:Number):void {
        segment.position = 0;

        var size:Number = segment.readUnsignedInt();
        var type:String = segment.readUTFBytes(4);

        while (SEGMENT_INDEX_BOX_TYPE != type) {
            segment.position += size - 8;
            size = segment.readUnsignedInt();
            type = segment.readUTFBytes(4);
        }

        segment.position -= 8;

        var box:ByteArray = new ByteArray();
        segment.readBytes(box, 0, size);
        processSegmentIndexBox(box, indexSegmentRangeBegin);
    }

    private function processSegmentIndexBox(box:ByteArray, indexSegmentRangeBegin:Number):void {
        var size:Number = box.readUnsignedInt();
        var type:String = box.readUTFBytes(4);

        if (size == 1) {

            // large size box used, read next 8 bytes
            var msb:uint = box.readUnsignedInt();
            var lsb:uint = box.readUnsignedInt();
            size = (Number(msb) * Math.pow(2, 32)) + Number(lsb);
        }

        if ((SEGMENT_INDEX_BOX_TYPE == type) && (box.bytesAvailable >= size - 8)) {
            var version:Number = box.readUnsignedInt();
            box.position += 4;
            var timescale:Number = box.readUnsignedInt();

            var earliestPresentationTime:Number;
            var firstOffset:Number;

            if (version == 0) {
                earliestPresentationTime = box.readUnsignedInt();
                firstOffset = box.readUnsignedInt();
            } else {
                earliestPresentationTime = Bytes.readNumber(box, 8);
                firstOffset = Bytes.readNumber(box, 8);
            }

            firstOffset += size + indexSegmentRangeBegin;

            box.position += 2;
            var referenceCount:Number = box.readUnsignedShort();

            var offset:Number = firstOffset;
            var time:Number = earliestPresentationTime;

            for (var i:int = 0; i < referenceCount; i++) {
                var referenceTypeAndSize:uint = box.readUnsignedInt();
                var referenceType:uint = referenceTypeAndSize >>> 31;
                var referenceSize:uint = referenceTypeAndSize & 0x7fffffff;
                var referenceDuration:uint = box.readUnsignedInt();
                box.position += 4;

                var reference:Object = {};
                reference.range = offset + "-" + (offset + referenceSize - 1);
                reference.startTimestamp = time / timescale; // seconds
                reference.endTimestamp = (time + referenceDuration) / timescale; // seconds

                _references.push(reference);

                offset += referenceSize;
                time += referenceDuration;
            }
        }
    }

    public function get references():Vector.<Object> {
        return _references;
    }

    public function toString():String {
        return "referencesCount='" + _references.length + "'";
    }
}
}
