/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {
import com.castlabs.dash.DashContext;

import flash.errors.IllegalOperationError;
import flash.utils.ByteArray;

public class FullBox extends Box {
    private var _version:uint;
    private var _flags:uint;

    public function FullBox(context:DashContext, offset:uint, size:uint) {
        super(context, offset, size);
    }

    public function get version():uint {
        return _version;
    }

    public function get flags():uint {
        return _flags;
    }

    public override function parse(ba:ByteArray):void {
        parseVersion(ba);
        parseFlags(ba);

        parseBox(ba);

        ba.position = end;
    }

    protected function parseBox(ba:ByteArray):void {
        throw new IllegalOperationError("Method not implemented");
    }

    private function parseVersion(ba:ByteArray):void {
        _version = ba.readUnsignedByte();
    }

    private function parseFlags(ba:ByteArray):void {
        _flags = 0;

        for (var i:uint = 0; i < 3; i++) {
            _flags = _flags << 8;
            _flags += ba.readUnsignedByte();
        }
    }
}
}