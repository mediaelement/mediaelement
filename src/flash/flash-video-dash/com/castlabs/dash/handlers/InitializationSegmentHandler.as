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
import com.castlabs.dash.boxes.MovieBox;
import com.castlabs.dash.boxes.SampleEntry;
import com.castlabs.dash.boxes.TrackBox;
import com.castlabs.dash.boxes.TrackExtendsBox;

import flash.errors.IllegalOperationError;
import flash.utils.ByteArray;

public class InitializationSegmentHandler extends SegmentHandler {
    private var _timescale:Number = 0;
    private var _defaultSampleDuration:uint = 0;
    private var _messages:Vector.<FLVTag> = new Vector.<FLVTag>();

    public function InitializationSegmentHandler(context:DashContext, ba:ByteArray) {
        super(context);
        parseMovieBox(ba);
    }

    public function get timescale():Number {
        return _timescale;
    }

    public function get defaultSampleDuration():Number {
        return _defaultSampleDuration;
    }

    public function get messages():Vector.<FLVTag> {
        return _messages.concat(); // a shallow copy
    }

    private function parseMovieBox(ba:ByteArray):void {
        var offsetAndSize:Object = goToBox("moov", ba);
        var offset:uint = offsetAndSize.offset;
        var size:uint = offsetAndSize.size;

        var movie:MovieBox = _context.buildMovieBox(offset, size);
        movie.parse(ba);

        var track:TrackBox = findTrackWithSpecifiedType(movie);

        loadTimescale(track);
        loadMessages(track);
        loadDefaultSampleDuration(movie, track.tkhd.id);
    }

    private function findTrackWithSpecifiedType(movie:MovieBox):TrackBox {
        for each (var track:TrackBox in movie.traks) {
            if (track.mdia.hdlr.type == expectedTrackType) {
                return track;
            }
        }

        throw _context.console.logAndBuildError("Track isn't defined, type='" + expectedTrackType + "'");
    }

    protected function get expectedTrackType():String {
        throw new IllegalOperationError("Method isn't implemented");
    }

    private function loadTimescale(track:TrackBox):void {
        _timescale = track.mdia.mdhd.timescale;
    }

    private function loadMessages(track:TrackBox):void {
        var sampleEntry:SampleEntry = buildSampleEntry(track);
        var message:FLVTag = buildMessage(sampleEntry);
        _messages.push(message);
    }

    private function loadDefaultSampleDuration(movie:MovieBox, trackId:uint):void {
        for each (var trex:TrackExtendsBox in movie.mvex.trexs) {
            if (trackId == trex.trackId) {
                _defaultSampleDuration = trex.defaultSampleDuration;
                return;
            }
        }

        _context.console.warn("Default sample duration isn't defined, trackId='" + trackId + "'");
    }

    private function buildSampleEntry(track:TrackBox):SampleEntry {
        return track.mdia.minf.stbl.stsd.sampleEntries[0];
    }

    protected function buildMessage(sampleEntry:SampleEntry):FLVTag {
        throw new IllegalOperationError("Method isn't implemented");
    }

    public function toString():String {
        return "timescale='" + _timescale + "', defaultSampleDuration='" + _defaultSampleDuration
                + "', messagesCount='" + _messages.length + "'";
    }
}
}
