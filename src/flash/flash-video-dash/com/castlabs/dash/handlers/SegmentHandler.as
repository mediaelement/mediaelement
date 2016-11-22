/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.handlers {
import com.castlabs.dash.DashContext;

import flash.utils.ByteArray;

public class SegmentHandler {
    protected var _context:DashContext;

    public function SegmentHandler(context:DashContext) {
        _context = context;
    }

    protected function goToBox(expectedType:String, ba:ByteArray):Object {
        var offset:uint = 0;
        var size:uint = 0;
        var type:String;

        do {
            ba.position = offset + size;

            offset = ba.position;
            size = ba.readUnsignedInt();
            type = ba.readUTFBytes(4);

            validateSize(size);
        } while (expectedType != type && ba.bytesAvailable);

        validateType(expectedType, type);

        return { offset: offset, size: size };
    }

    protected function validateType(expectedType:String, actualType:String):void {
        if (actualType != expectedType) {
            throw _context.console.logAndBuildError("Couldn't find any '" + expectedType + "' box");
        }
    }

    protected function validateSize(size:uint):void {
        if (size == 1) {
            // don't support "large box", because default size is sufficient for fragmented movie
            throw _context.console.logAndBuildError("Large box isn't supported");
        }
    }

    protected function validateTracksNumber(number:int):void {
        if (number > 1) {
            throw _context.console.logAndBuildError("Multiple tracks aren't supported");
        }

        if (number < 1) {
            throw _context.console.logAndBuildError("Track isn't defined");
        }
    }
}
}
