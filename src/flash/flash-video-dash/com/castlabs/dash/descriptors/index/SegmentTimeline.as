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

public class SegmentTimeline extends SegmentTemplate implements SegmentIndex {
    private var _segments:Vector.<Object> = new Vector.<Object>();

    public function SegmentTimeline(context:DashContext, representation:XML) {
        super(context, representation);
        update(representation);
    }

    public override function getSegment(timestamp:Number, representationId:String, bandwidth:Number, baseUrl:String,
                                        duration:Number, internalRepresentationId:Number):Segment {
        if (_segments.length == 0) {
            return null;
        }

        if (_live && isLast(timestamp)) {
            return _context.buildWaitSegment(internalRepresentationId);
        }

        var segment:Object = null;

        //TODO simplify this condition
        if (timestamp == 0) {
            if (_live) {
                var last:Object = _segments[_segments.length - 1];
                timestamp = seconds(last.time + last.duration) - _minBufferTime;
                segment = findSegment(timestamp);
            } else {
                segment = _segments[0];
            }
        } else {
            segment = findSegment(timestamp);
        }

        if (segment == null) {
            return null;
        }

        var url:String = String(_segmentFilename);

        url = url.replace("$Time$", segment.time);
        url = url.replace("$Number$", segment.num);
        url = url.replace("$RepresentationID$", representationId);

        var startTimestamp:Number = seconds(segment.time);
        var endTimestamp:Number = startTimestamp + seconds(segment.duration);

        return _context.buildMediaDataSegment(internalRepresentationId, baseUrl + url, "0-", startTimestamp,
                endTimestamp);
    }

    private function findSegment(timestamp:Number):Object {
        for (var i:uint = 0; i < _segments.length; i++) {
            var end:Number = seconds(_segments[i].time) + seconds(_segments[i].duration);
            if (timestamp < end) {
                return _segments[i];
            }
        }

        return null;
    }

    public override function update(representation:XML):void {
        super.update(representation);

        if (_live) {
            removeOutdatedSegments();
        }

        appendNewSegments(representation);
    }

    private function appendNewSegments(xml:XML):void {
        var items:XMLList = traverseAndBuildTimeline(xml);

        var time:Number = 0;
        var num:Number = _startNumber;
        for (var i:uint = 0; i < items.length(); i++) {

            // read time if present
            if (items[i].hasOwnProperty("@t")) {
                time = Number(items[i].@t.toString());
            }

            // read duration
            var duration:Number = Number(items[i].@d.toString());

            // read repeats if present
            var repeats:Number = 0;
            if (items[i].hasOwnProperty("@r")) {
                repeats = Number(items[i].@r.toString());
            }

            // add duplicates if repeats > 0
            for (var j:uint = 0; j <= repeats; j++) {
                if (!isTimeExists(time)) { // unique
                    _segments.push({ time: time, duration: duration, num: num});
                }

                time += duration;
                num++;
            }
        }
    }

    private function isTimeExists(time:Number):Object {
        for (var i:uint = 0; i < _segments.length; i++) {
            if (time == _segments[i].time) {
                return true;
            }
        }

        return false;
    }

    private function removeOutdatedSegments():void {
        while (seconds(calculateBufferDepth()) > _timeShiftBuffer) {
            _segments.shift();
        }
    }

    private function calculateBufferDepth():Number {
        var sum:uint = 0;

        for each (var segment:Object in _segments) {
            sum += segment.duration;
        }

        return sum;
    }

    private function seconds(value:Number):Number {
        return value / _timescale;
    }

    private function isLast(timestmap:Number):Boolean {
        if (_segments.length == 0) {
            return false;
        }

        var last:uint = _segments.length - 1;
        // #31 workaround for rounding issue; TODO solve this issue more elegant
        return (seconds(_segments[last].time) - timestmap) < 0.1;
    }

    private function traverseAndBuildTimeline(node:XML):XMLList {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any S tag");
        }

        if (node.SegmentTemplate.length() == 1
                && node.SegmentTemplate.SegmentTimeline.length() == 1
                && node.SegmentTemplate.SegmentTimeline.S.length() > 0) {
            return node.SegmentTemplate.SegmentTimeline.S;
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildTimeline(node.parent());
    }

    protected override function traverseAndBuildDuration(node:XML):Number {
        return NaN;
    }

    override public function toString():String {
        var a:String = "isLive='" + _live;
        var b:String = "";
        var c:String = "', segmentsCount='" + _segments.length + "'";

        if (_live) {
            b = ", minBufferTime[s]='" + _minBufferTime + ", timeShiftBuffer[s]='" + _timeShiftBuffer;
        }

        return a + b + c;
    }
}
}
