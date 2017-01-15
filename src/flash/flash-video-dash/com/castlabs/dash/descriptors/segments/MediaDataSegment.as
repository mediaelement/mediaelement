/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.segments {
public class MediaDataSegment extends DataSegment {
    protected var _startTimestamp:Number; // seconds
    protected var _endTimestamp:Number; // seconds

    public function MediaDataSegment(internalRepresentationId:Number, url:String, range:String,
                                     startTimestamp:Number, endTimestamp:Number) {
        super(internalRepresentationId, url, range);
        _startTimestamp = startTimestamp;
        _endTimestamp = endTimestamp;
    }

    public function get startTimestamp():Number {
        return _startTimestamp;
    }

    public function get endTimestamp():Number {
        return _endTimestamp;
    }

    override public function toString():String {
        return "internalRepresentationId='" + _internalRepresentationId
                + "', url='" + _url + "', range='" + _range
                + "', startTimestamp='" + _startTimestamp + "', endTimestamp='" + _endTimestamp + "'";
    }
}
}
