/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {
import com.castlabs.dash.DashContext;

import flash.errors.IllegalOperationError;
import flash.utils.ByteArray;

internal class Box {
    protected const SIZE_AND_TYPE:uint = 8;

    protected var _context:DashContext;
    private var _end:uint;

    public function Box(context:DashContext, offset:uint, size:uint) {
        _context = context;
        _end = offset + size;
    }

    public function get end():uint {
        return _end;
    }

    public function parse(ba:ByteArray):void {
        while (ba.bytesAvailable) {
            var offset:uint = ba.position;
            var size:uint = ba.readUnsignedInt();
            var type:String = ba.readUTFBytes(4);

            var parsed:Object = parseChildBox(type, offset, size, ba);

            if (parsed == false) {
                if (ba.position < _end) { // skip
                    ba.position += size - SIZE_AND_TYPE;
                } else { // quit
                    ba.position = _end;
                    return;
                }
            }
        }
    }

    protected function parseChildBox(type:String, offset:uint, size:uint, ba:ByteArray):Boolean {
        throw new IllegalOperationError("Method not implemented");
    }
}
}