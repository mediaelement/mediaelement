/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.segments {
public class ReflexiveSegment extends DataSegment {
    private var _callback:Function;

    public function ReflexiveSegment(internalRepresentationId:Number, url:String, range:String, callback:Function) {
        super(internalRepresentationId, url, range);
        _callback = callback;
    }

    public function get callback():Function {
        return _callback;
    }
}
}
