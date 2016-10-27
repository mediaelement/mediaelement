/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.events {
import com.castlabs.dash.descriptors.segments.Segment;

import flash.events.Event;
import flash.utils.ByteArray;

public class SegmentEvent extends Event {
    public static const LOADED:String = "segmentLoaded";
    public static const ERROR:String = "segmentError";

    private var _segment:Segment;
    private var _bytes:ByteArray;

    public function SegmentEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                 segment:Segment = null, bytes:ByteArray = null) {
        super(type, bubbles, cancelable);

        _segment = segment;
        _bytes = bytes;
    }

    public function get segment():Segment {
        return _segment;
    }

    public function get bytes():ByteArray {
        return _bytes;
    }

    // override to support re-dispatching
    override public function clone():Event {
        return new SegmentEvent(type, bubbles, cancelable, segment, bytes);
    }
}
}
