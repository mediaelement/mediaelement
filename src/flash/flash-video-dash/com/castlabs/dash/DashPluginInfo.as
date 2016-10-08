/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import org.osmf.media.MediaFactoryItem;
import org.osmf.media.PluginInfo;

public class DashPluginInfo extends PluginInfo {
    public function DashPluginInfo() {
        super(Vector.<MediaFactoryItem>([ new MediaFactoryItem("com.castlabs.dash", DashPlugin.canHandleResource,
                DashPlugin.mediaElementCreationFunction)]));
    }
}
}
