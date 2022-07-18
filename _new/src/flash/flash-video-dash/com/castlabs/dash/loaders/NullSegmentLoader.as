/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.loaders {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.descriptors.segments.Segment;
import com.castlabs.dash.events.SegmentEvent;

import flash.utils.ByteArray;

public class NullSegmentLoader extends SegmentLoader {
    public function NullSegmentLoader(context:DashContext, segment:Segment) {
        super(context, segment);
    }

    override public function load():void {
        dispatchEvent(_context.buildSegmentEvent(SegmentEvent.LOADED, false, false, _segment, new ByteArray()));
    }
}
}
