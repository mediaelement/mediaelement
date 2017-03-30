/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.index {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.descriptors.segments.Segment;
import com.castlabs.dash.utils.Manifest;

public class SegmentTemplate implements SegmentIndex {

    /*
        WORKAROUND: Some content publishers can't keep stream head running stable (a lot of 404 errors).
        Shit head a little in the past. Get ride of this in the future.
    */
    private static const HEAD_FIX:uint = 5;
    private static const MIX_BUFFER_TIME:uint = 15;

    protected var _context:DashContext;
    protected var _initializationSegmentFilename:String;
    protected var _segmentFilename:String;
    protected var _duration:Number; //TODO rename to avoid confusion with video duration
    protected var _timescale:Number;
    protected var _startNumber:Number;
    protected var _live:Boolean;
    protected var _minBufferTime:Number; // seconds
    protected var _timeShiftBuffer:Number; // seconds
    protected var _availabilityStartTime:Number; // unix timestamp

    public function SegmentTemplate(context:DashContext, representation:XML) {
        _context = context;
        _initializationSegmentFilename = traverseAndBuildInitializationFilename(representation);
        _segmentFilename = traverseAndBuildSegmentFilename(representation);
        _duration = traverseAndBuildDuration(representation);
        _timescale = traverseAndBuildTimescale(representation);
        _startNumber = traverseAndBuildStartNumber(representation);

        _live = traverseAndBuildLive(representation);

        update(representation);
    }

    public function getInitializationSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                             internalRepresentationId:Number):Segment {
        var url:String = String(_initializationSegmentFilename);

        url = url.replace("$RepresentationID$", representationId);
        url = url.replace("$Bandwidth$", bandwidth);

        return _context.buildDataSegment(internalRepresentationId, baseUrl + url);
    }

    public function getIndexSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                    internalRepresentationId:Number):Segment {
        return _context.buildNullSegment(internalRepresentationId);
    }

    public function getSegment(timestamp:Number, representationId:String, bandwidth:Number, baseUrl:String,
                               duration:Number, internalRepresentationId:Number):Segment {
        var index:Number;

        if (_live) {
            var head:Number = Manifest.toUnixTimestamp(new Date()) - _availabilityStartTime - HEAD_FIX;
            var tail:Number = head - _timeShiftBuffer;

            if (timestamp == 0) {
                index = Math.round((head - _minBufferTime) / segmentDuration);
            } else if (tail <= timestamp && timestamp <= head) {
                index = Math.round(timestamp / segmentDuration);
            } else if (timestamp > head) {
                _context.console.warn("Next timestamp is above stream head. Wait.");
                return _context.buildWaitSegment(internalRepresentationId);
            } else if (timestamp < tail) {
                _context.console.warn("Next timestamp is below stream head. Stop.");
                return null;
            }
        } else {
            index = Math.round(timestamp / segmentDuration);
        }

        if (isOutOfRange(index, duration)) {
            return null;
        }

        var url:String = String(_segmentFilename);

        url = url.replace("$Number$", _startNumber + index);
        url = url.replace("$RepresentationID$", representationId);
        url = url.replace("$Bandwidth$", bandwidth);

        var startTimestamp:Number = index * segmentDuration;
        var endTimestamp:Number = startTimestamp + segmentDuration;

        return _context.buildMediaDataSegment(internalRepresentationId, baseUrl + url, "0-", startTimestamp,
                endTimestamp);
    }

    public function update(representation:XML):void {
        if (_live) {
            _minBufferTime = traverseAndBuildMinBufferTime(representation);
            _timeShiftBuffer = traverseAndBuildTimeShiftBufferDepth(representation);
            _availabilityStartTime = traverseAndBuildAvailabilityStartTime(representation);

            if (_timeShiftBuffer < HEAD_FIX) {
                _context.console.warn("@timeShiftBuffer is smaller than hardcoded head fix.");
            }

            if (_timeShiftBuffer < _minBufferTime) {
                _context.console.warn("@timeShiftBuffer is smaller than @minBufferTime value.");
            }
        }
    }

    private function get segmentDuration():Number {
        return _duration / _timescale;
    }

    private function isOutOfRange(index:Number, duration:Number):Boolean {

        if (isNaN(duration)) {

            // live streams doesn't define sometimes any duration; ignore and continue
            return false;
        }

        var predictedTimestamp:Number = segmentDuration * index;
        return predictedTimestamp >= duration;
    }

    private function traverseAndBuildInitializationFilename(node:XML):String {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'sourceURL' or 'initialization' attribute");
        }

        if (node.SegmentBase.length() == 1
                && node.SegmentBase.Initialization.length() == 1
                && node.SegmentBase.Initialization.hasOwnProperty("@sourceURL")) {
            return node.SegmentBase.Initialization.@sourceURL.toString();
        }

        if (node.SegmentTemplate.length() == 1
                && node.SegmentTemplate.Initialization.length() == 1
                && node.SegmentTemplate.Initialization.hasOwnProperty("@sourceURL")) {
            return node.SegmentTemplate.Initialization.@sourceURL.toString();
        }

        if (node.SegmentTemplate.length() == 1
                && node.SegmentTemplate.hasOwnProperty("@initialization")) {
            return node.SegmentTemplate.@initialization.toString();
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildInitializationFilename(node.parent());
    }

    private function traverseAndBuildSegmentFilename(node:XML):String {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'media' attribute");
        }

        if (node.SegmentTemplate.length() == 1 && node.SegmentTemplate.hasOwnProperty("@media")) {
            return node.SegmentTemplate.@media.toString();
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildSegmentFilename(node.parent());
    }

    protected function traverseAndBuildDuration(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'duration' attribute");
        }

        if (node.SegmentTemplate.length() == 1 && node.SegmentTemplate.hasOwnProperty("@duration")) {
            return Number(node.SegmentTemplate.@duration.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildDuration(node.parent());
    }

    private function traverseAndBuildTimescale(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'timescale' attribute");
        }

        if (node.SegmentTemplate.length() == 1 && node.SegmentTemplate.hasOwnProperty("@timescale")) {
            return Number(node.SegmentTemplate.@timescale.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildTimescale(node.parent());
    }

    protected function traverseAndBuildStartNumber(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'startNumber' attribute");
        }

        if (node.SegmentTemplate.length() == 1 && node.SegmentTemplate.hasOwnProperty("@startNumber")) {
            return Number(node.SegmentTemplate.@startNumber.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildStartNumber(node.parent());
    }

    private function traverseAndBuildLive(node:XML):Boolean {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'type' attribute");
        }

        if (node.hasOwnProperty("@type")) {
            return node.@type.toString() == "dynamic";
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildLive(node.parent());
    }

    private function traverseAndBuildTimeShiftBufferDepth(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'timeShiftBufferDepth' attribute");
        }

        if (node.hasOwnProperty("@timeShiftBufferDepth")) {
            return Manifest.toSeconds(node.@timeShiftBufferDepth.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildTimeShiftBufferDepth(node.parent());
    }

    private function traverseAndBuildMinBufferTime(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'minBufferTime' attribute");
        }

        if (node.hasOwnProperty("@minBufferTime")) {
            return Math.max(MIX_BUFFER_TIME, Manifest.toSeconds(node.@minBufferTime.toString()));
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildMinBufferTime(node.parent());
    }

    private function traverseAndBuildAvailabilityStartTime(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'availabilityStartTime' attribute");
        }

        if (node.hasOwnProperty("@availabilityStartTime")) {
            return Manifest.toUnixTimestamp(Manifest.parseW3CDTF(node.@availabilityStartTime.toString()));
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildAvailabilityStartTime(node.parent());
    }

    public function toString():String {
        return "segmentDuration[u]='" + _duration + ", timescale='" + _timescale + "', initializationFilename='"
                + _initializationSegmentFilename + "', segmentFilename='" + _segmentFilename
                + "', startNumber='" + _startNumber + "'";
    }
}
}
