/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.boxes {

import flash.utils.ByteArray;

public class Muxer {
    public function Muxer() {
    }

    public function mux(messages:Vector.<FLVTag>):ByteArray {
        var ba:ByteArray = new ByteArray();

        while (messages.length > 0) {
            var message:FLVTag = messages.shift();
            writeMsg(message, ba);
        }

        return ba;
    }

    private function writeMsg(message:FLVTag, ba:ByteArray):void {
        var messageSize:uint = calculateSize(message);

        writeType(message, ba);
        writeSize(messageSize, ba);
        writeTimestamp(message, ba);
        writeStreamId(message, ba);
        writeHeader(message, ba);
        writeData(message, ba);

        // write previous tag size
        ba.writeUnsignedInt(messageSize + 11); // 4 bytes
    }

    protected function calculateSize(message:FLVTag):uint {
        var size:uint = message.length;

        if (message.isVideo()) {
            size += 5;
        } else if (message.isAudio()) {
            size += 2;
        }

        return size;
    }

    private function writeType(message:FLVTag, ba:ByteArray):void {
        ba.writeByte(message.type);
    }

    private function writeData(message:FLVTag, ba:ByteArray):void {
        if (message.data != null) {
            ba.writeBytes(message.data);
        }
    }

    protected function writeHeader(message:FLVTag, ba:ByteArray):void {
        if (message.isVideo()) {
            writeVideoHeader(message, ba);
            writeCompositionTimestamp(message, ba);
        }

        if (message.isAudio()) {
            writeAudioHeader(message, ba);
        }
    }

    private function writeStreamId(message:FLVTag, ba:ByteArray):void {
        writeNumber(0, ba); // always the same ID
    }

    private function writeTimestamp(message:FLVTag, ba:ByteArray):void {
        var timestamp:Number = Math.round(message.timestamp);
        writeNumber(timestamp, ba);
        ba.writeByte(0);
    }

    private function writeSize(messageSize:uint, ba:ByteArray):void {
        writeNumber(messageSize, ba);
    }

    private function writeAudioHeader(message:FLVTag, ba:ByteArray):void {
        var sampleSize:uint;
        if (SampleEntry.sampleSize == 16) { // 16 bit
            sampleSize = 1;
        } else {
            sampleSize = 0;
        }

        var channelCount:uint;
        if (SampleEntry.channelCount == 2) { // stereo
            channelCount = 1;
        } else {
            channelCount = 0;
        }

        ba.writeByte((10 << 4) + (3 << 2) + (sampleSize << 1) + channelCount);

        if (message.setup) {
            ba.writeByte(0);
        } else {
            ba.writeByte(1);
        }
    }

    private function writeVideoHeader(message:FLVTag, ba:ByteArray):void {
        switch (message.frameType) {
            case FLVTag.I_FRAME:
                ba.writeByte(0x17);
                ba.writeByte(1);
                break;
            case FLVTag.P_FRAME:
                ba.writeByte(0x27);
                ba.writeByte(1);
                break;
            case FLVTag.B_FRAME:
                ba.writeByte(0x37);
                ba.writeByte(1);
                break;
            default:
                ba.writeByte(0x17);
                ba.writeByte(0);
        }
    }

    private function writeCompositionTimestamp(message:FLVTag, ba:ByteArray):void {
        writeNumber(message.compositionTimestamp, ba);
    }

    private function writeNumber(number:int, ba:ByteArray):void {
        ba.writeByte(number >> 16);
        ba.writeByte(number >> 8);
        ba.writeByte(number);
    }
}
}