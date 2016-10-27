/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import flash.net.NetStream;

import org.osmf.net.NetStreamSeekTrait;
import org.osmf.traits.LoadTrait;
import org.osmf.traits.TimeTrait;

public class DashSeekTrait extends NetStreamSeekTrait {
    public function DashSeekTrait(temporal:TimeTrait, loadTrait:LoadTrait, netStream:NetStream) {
        super(temporal, loadTrait, netStream);
    }

    override public function canSeekTo(time:Number):Boolean {
        return timeTrait
                ? (isNaN(time) == false && time >= 0 &&	(time <= timeTrait.duration || time <= timeTrait.currentTime))
                : false;
    }
}
}
