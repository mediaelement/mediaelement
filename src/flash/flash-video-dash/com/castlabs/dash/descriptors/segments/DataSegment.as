/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.segments {
public class DataSegment extends Segment {
    protected var _url:String;
    protected var _range:String;

    public function DataSegment(internalRepresentationId:Number, url:String, range:String="0-") {
        super(internalRepresentationId);

        _url = url;
        _range = range;
    }

    public function get url():String {
        return _url + "?bytes=" + _range;
    }

    public function get isRange():Boolean {
        return _range != null && _range != '0-';
    }

    override public function toString():String {
        return "internalRepresentationId='" + _internalRepresentationId
                + "', url='" + _url + "', range='" + _range + "'";
    }
}
}
