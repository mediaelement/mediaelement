/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.handlers {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.boxes.FLVTag;

import flash.utils.ByteArray;

public class VideoSegmentHandler extends MediaSegmentHandler {
    public function VideoSegmentHandler(context:DashContext, segment:ByteArray, messages:Vector.<FLVTag>,
                                        defaultSampleDuration:uint, timescale:uint, timestamp:Number) {
        super(context, segment, messages, defaultSampleDuration, timescale, timestamp);
    }

    protected override function buildMessage(sampleTimestamp:Number, sampleSize:uint, sampleDependsOn:uint,
                                             sampleIsDependedOn:uint, compositionTimeOffset:Number,
                                             dataOffset:uint, ba:ByteArray):FLVTag {
        var message:FLVTag = _context.buildFLVTag();

        message.markAsVideo();

        message.timestamp = sampleTimestamp;
        message.length = sampleSize;
        message.dataOffset = dataOffset;

        message.data = new ByteArray();
        ba.position = message.dataOffset;
        ba.readBytes(message.data, 0, sampleSize);

        if (sampleDependsOn == 2) {
            message.frameType = FLVTag.I_FRAME;
        } else if (sampleDependsOn == 1 && sampleIsDependedOn == 1) {
            message.frameType = FLVTag.P_FRAME;
        } else if (sampleDependsOn == 1 && sampleIsDependedOn == 2) {
            message.frameType = FLVTag.B_FRAME;
        } else {
            message.frameType = _context.nalUnit.parse(message.data);
        }

        if (!isNaN(compositionTimeOffset)) {
            message.compositionTimestamp = compositionTimeOffset * 1000 / _timescale;
        }

        return message;
    }

}
}
