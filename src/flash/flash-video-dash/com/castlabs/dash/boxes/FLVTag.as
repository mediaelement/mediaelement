/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {
import flash.utils.ByteArray;

public class FLVTag {
    public static const I_FRAME:uint = 1;
    public static const P_FRAME:uint = 2;
    public static const B_FRAME:uint = 3;
    public static const UNKNOWN:uint = 4;

    public var length:uint;
    public var timestamp:uint;
    public var frameType:uint;
    public var compositionTimestamp:int;
    public var dataOffset:uint;
    public var data:ByteArray;
    public var setup:Boolean = false;

    private var _type:uint;

    public function FLVTag() {
    }

    public function get type():uint {
        return _type;
    }

    public function isVideo():Boolean {
        return _type == videoType;
    }

    public function isAudio():Boolean {
        return _type == audioType;
    }

    public function markAsVideo():void {
        _type = videoType;
    }

    public function markAsAudio():void {
        _type = audioType;
    }

    protected function get videoType():uint {
        return 9;
    }

    protected function get audioType():uint {
        return 8;
    }
}
}