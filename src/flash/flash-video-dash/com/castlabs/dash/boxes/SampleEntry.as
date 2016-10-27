/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {

import com.castlabs.dash.DashContext;

import flash.utils.ByteArray;

public class SampleEntry extends Box {
    public static var channelCount:uint;
    public static var sampleSize:uint;

    private var _data:ByteArray;
    protected var _type:String;

    public function SampleEntry(context:DashContext, offset:uint, size:uint, type:String) {
        super(context, offset, size);
        _type = type;
    }

    public function get data():ByteArray {
        return _data;
    }

    public override function parse(ba:ByteArray):void {
        if (_type == "avc1") {
            parseAvc1(ba);
        }

        if (_type == "mp4a") {
            parseMp4a(ba);
        }

        ba.position = end;
    }

    protected function parseAvc1(ba:ByteArray):void {

        // skip
        ba.position += 78;

        parseAvc1Data(ba);
    }

    protected function parseMp4a(ba:ByteArray):void {
        ba.position += 16;

        channelCount = ba.readUnsignedShort();
        sampleSize = ba.readUnsignedShort();

        _data = parseMp4aData(ba);
    }

    private function parseAvc1Data(ba:ByteArray):void {
        ba.position = goToBox("avcC", ba);

        var size:Number = ba.readUnsignedInt();

        // skip: type("avcC")
        ba.position += 4;

        _data = new ByteArray();
        ba.readBytes(_data, 0, size - SIZE_AND_TYPE);
    }

    protected function goToBox(type:String, ba:ByteArray):uint {
        var typeBegin:String = type.slice(0, 1);
        var typeOther:String = type.slice(1);

        while (ba.bytesAvailable) {
            if (ba.readUTFBytes(typeBegin.length) != typeBegin) {
                continue;
            }

            if (ba.readUTFBytes(typeOther.length) == typeOther) {
                return ba.position - SIZE_AND_TYPE;
            }
        }

        throw _context.console.logAndBuildError("Couldn't find any '" + type + "' box");
    }

    private function parseMp4aData(ba:ByteArray):ByteArray {
        ba.position = goToBox("esds", ba);

//        // 4-bytes size
//        ba.position += 4;
//        // 4-bytes type
//        ba.position += 4;

        ba.position += 8;

//        // 4-bytes version/flags
//        ba.position += 4;
//        // 1-byte type (0x03)
//        ba.position += 1;

        ba.position += 5;

        // 3-bytes header (optional) and 1-byte size
        getDescriptorSize(ba);

//        // 2-bytes ID
//        ba.position += 2;
//        // 1-byte priority
//        ba.position += 1;
//        // 1-byte type (0x04)
//        ba.position += 1;

        ba.position += 4;

        // 3-bytes header (optional) and 1-byte size
        getDescriptorSize(ba);

//        // 1-byte ID
//        ba.position += 1;
//        // 1-byte type/flags
//        ba.position += 1;
//        // 3-bytes buffer size
//        ba.position += 3;
//        // 4-bytes maximum bit rate
//        ba.position += 4;
//        // 4-bytes average bit rate
//        ba.position += 4;
//        // 1-byte type (0x05)
//        ba.position += 1;

        ba.position += 14;

        var sdf:ByteArray = new ByteArray();
        ba.readBytes(sdf, 0, getDescriptorSize(ba));

        return sdf;
    }

    private function getDescriptorSize(ba:ByteArray):uint {
        var headerOrSize:uint = ba.readUnsignedByte();

        if (headerOrSize == 0x80) {

            // 2-bytes header
            ba.position += 2;

            // size
            return ba.readUnsignedByte();
        }

        // size
        return headerOrSize;
    }
}
}