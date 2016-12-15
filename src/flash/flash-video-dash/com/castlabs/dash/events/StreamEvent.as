/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.events {
import flash.events.Event;

public class StreamEvent extends Event {
    public static const READY:String = "streamReady";
    public static const END:String = "streamEnd";
    public static const ERROR:String = "streamError";

    private var _live:Boolean;
    private var _duration:Number;

    public function StreamEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                live:Boolean = false, duration:Number = 0) {
        super(type, bubbles, cancelable);
        _live = live;
        _duration = duration;
    }

    public function get live():Boolean {
        return _live;
    }

    public function get duration():Number {
        return _duration;
    }

    // override to support re-dispatching
    override public function clone():Event {
        return new StreamEvent(type, bubbles, cancelable, live, duration);
    }
}
}
