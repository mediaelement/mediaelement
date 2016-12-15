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

public class TrackHeaderBox extends FullBox {
    private var _id:uint;

    public function TrackHeaderBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get id():uint {
        return _id;
    }

    override protected function parseBox(ba:ByteArray):void {
        if (version == 0) {

//            // created mac UTC date
//            ba.position += 4;
//            // modified mac UTC date
//            ba.position += 4;

            ba.position += 8;
        } else if (version == 1) {

//            // created mac UTC date
//            ba.position += 8;
//            // modified mac UTC date
//            ba.position += 8;

            ba.position += 16;
        } else {
            throw _context.console.logAndBuildError("Unknown TrackHeaderBox version");
        }

        _id = ba.readUnsignedInt();
    }
}
}
