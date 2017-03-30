/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.handlers {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.boxes.FLVTag;
import com.castlabs.dash.boxes.MovieFragmentBox;
import com.castlabs.dash.boxes.TrackFragmentHeaderBox;
import com.castlabs.dash.boxes.TrackFragmentRunBox;

import flash.errors.IllegalOperationError;
import flash.utils.ByteArray;

public class MediaSegmentHandler extends SegmentHandler {
    protected var _messages:Vector.<FLVTag>;
    protected var _timescale:uint;
    protected var _timestamp:Number;

    private var _bytes:ByteArray;
    protected var _movieFragmentBox:MovieFragmentBox;
    private var _defaultSampleDuration:uint;

    public function MediaSegmentHandler(context:DashContext, ba:ByteArray, messages:Vector.<FLVTag>,
                                        defaultSampleDuration:uint, timescale:uint, timestamp:Number) {
        super(context);

        _messages = messages;
        _defaultSampleDuration = defaultSampleDuration;
        _timescale = timescale;
        _timestamp = timestamp;

        parseMovieFragmentBox(ba);
        parseMediaDataBox(ba);
    }

    public function get bytes():ByteArray {
        return _bytes;
    }

    private function parseMovieFragmentBox(ba:ByteArray):void {
        var offsetAndSize:Object = goToBox("moof", ba);
        var offset:uint = offsetAndSize.offset;
        var size:uint = offsetAndSize.size;

        _movieFragmentBox = _context.buildMovieFragmentBox(offset, size);
        _movieFragmentBox.parse(ba);
    }

    private function parseMediaDataBox(ba:ByteArray):void {
        var size:Number = ba.readUnsignedInt();
        var type:String = ba.readUTFBytes(4);

        validateType("mdat", type);
        validateSize(size);

        processTrackBox(ba);

        _bytes = _context.muxer.mux(_messages);
        _bytes.position = 0; // reset
    }

    public function processTrackBox(ba:ByteArray):void {
        validateTracksNumber(_movieFragmentBox.trafs.length);

        var headerBox:TrackFragmentHeaderBox = _movieFragmentBox.trafs[0].tfhd;
        var runBoxes:Vector.<TrackFragmentRunBox> = _movieFragmentBox.trafs[0].truns;

        for each (var runBox:TrackFragmentRunBox in runBoxes) {
            var baseDataOffset:Number = loadBaseDataOffset(headerBox);

            setDefaultDurationIfNeeded(runBox, headerBox);
            loadMessages(runBox, baseDataOffset, ba);
        }
    }

    private function loadBaseDataOffset(headerBox:TrackFragmentHeaderBox):Number {

        // otherwise point to segment's begin
        return (headerBox.baseDataOffsetPresent) ? headerBox.baseDataOffset : _movieFragmentBox.offset;
    }

    private function setDefaultDurationIfNeeded(runBox:TrackFragmentRunBox, headerBox:TrackFragmentHeaderBox):void {
        if (!runBox.sampleDurationPresent && headerBox.defaultSampleDurationPresent) {
            _defaultSampleDuration = headerBox.defaultSampleDuration;
        }
    }

    private function loadMessages(runBox:TrackFragmentRunBox, baseDataOffset:Number, ba:ByteArray):void {
        var dataOffset:uint = runBox.dataOffset + baseDataOffset;
        var sampleSizes:Vector.<uint> = runBox.sampleSize;

        var samplesDuration:uint = 0;
        for (var i:uint = 0; i < sampleSizes.length; i++) {
            var sampleDuration:uint = loadSampleDuration(runBox, i);
            var compositionTimeOffset:int = loadCompositionTimeOffset(runBox, i);
            var sampleDependsOn:uint = loadSampleDependsOn(runBox, i);
            var sampleIsDependedOn:uint = loadSampleIsDependedOn(runBox, i);

            samplesDuration += sampleDuration;
            var sampleTimestamp:Number = _timestamp + ((samplesDuration * 1000) / _timescale);

            var message:FLVTag = buildMessage(sampleTimestamp, sampleSizes[i], sampleDependsOn, sampleIsDependedOn,
                    compositionTimeOffset, dataOffset, ba);

            _messages.push(message);

            dataOffset = dataOffset + sampleSizes[i];
        }
    }

    private function loadSampleDuration(runBox:TrackFragmentRunBox, i:uint):uint {
        return i < runBox.sampleDuration.length ? runBox.sampleDuration[i] : _defaultSampleDuration;
    }

    private function loadCompositionTimeOffset(runBox:TrackFragmentRunBox, i:uint):int {
        return i < runBox.sampleCompositionTimeOffset.length ? runBox.sampleCompositionTimeOffset[i] : NaN;
    }

    private function loadSampleDependsOn(runBox:TrackFragmentRunBox, i:uint):uint {
        return i < runBox.sampleDependsOn.length ? runBox.sampleDependsOn[i] : 0;
    }

    private function loadSampleIsDependedOn(runBox:TrackFragmentRunBox, i:uint):uint {
        return i < runBox.sampleIsDependedOn.length ? runBox.sampleIsDependedOn[i] : 0;
    }

    protected function buildMessage(sampleTimestamp:Number, sampleSize:uint, sampleDependsOn:uint,
                                    sampleIsDependedOn:uint, compositionTimeOffset:Number,
                                    dataOffset:uint, ba:ByteArray):FLVTag {
        throw new IllegalOperationError("Method isn't implemented");
    }
}
}
