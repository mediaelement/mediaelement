/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.segments {

public class Segment {
    protected var _internalRepresentationId:Number;

    public function Segment(internalRepresentationId:Number) {
        _internalRepresentationId = internalRepresentationId;
    }

    public function get internalRepresentationId():Number {
        return _internalRepresentationId;
    }

    public function toString():String {
        return "internalRepresentationId='" + _internalRepresentationId;
    }
}
}
