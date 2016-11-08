/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.events {
import flash.events.Event;
import flash.utils.ByteArray;

public class FragmentEvent extends Event {
    public static const LOADED:String = "fragmentLoaded";

    private var _bytes:ByteArray;
    private var _endTimestamp:Number;

    public function FragmentEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                  bytes:ByteArray = null, endTimestamp:Number = NaN) {
        super(type, bubbles, cancelable);

        _bytes = bytes;
        _endTimestamp = endTimestamp;
    }

    public function get bytes():ByteArray {
        return _bytes;
    }

    public function get endTimestamp():Number {
        return _endTimestamp;
    }
}
}
