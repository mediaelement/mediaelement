/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import flash.events.NetStatusEvent;

import org.osmf.net.NetStreamCodes;
import org.osmf.traits.TimeTrait;

public class DashTimeTrait extends TimeTrait {
    private var _duration:Number;
    private var _stream:DashNetStream;

    public function DashTimeTrait(stream:DashNetStream, duration:Number) {
        super(NaN);

        _duration = duration;

        _stream = stream;
        _stream.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus);
    }

    override public function get duration():Number {
        return _duration;
    }

    override public function get currentTime():Number {
        return _stream.time;
    }

    private function onNetStatus(event:NetStatusEvent):void {
        switch (event.info.code) {
            case NetStreamCodes.NETSTREAM_PLAY_UNPUBLISH_NOTIFY:
                signalComplete();
                break;
        }
    }
}
}
