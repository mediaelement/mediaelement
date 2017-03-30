/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.events {
import flash.events.Event;

public class ManifestEvent extends Event {
    public static const LOADED:String = "manifestLoaded";
    public static const ERROR:String = "manifestError";

    private var _url:String;
    private var _xml:XML;

    public function ManifestEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                  url:String = null, xml:XML = null) {
        super(type, bubbles, cancelable);

        _url = url;
        _xml = xml;
    }

    public function get url():String {
        return _url;
    }

    public function get xml():XML {
        return _xml;
    }
}
}
