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

public class SegmentList implements SegmentIndex {
    private var _context:DashContext;
    private var _initializationSegment:Object;
    private var _segments:Vector.<Object>;
    private var _duration:Number; //TODO rename to avoid confusion with video duration
    private var _timescale:Number;

    public function SegmentList(context:DashContext, representation:XML) {
        _context = context;
        _initializationSegment = traverseAndBuildInitializationSegment(representation);
        _segments = traverseAndBuildSegments(representation);
        _duration = traverseAndBuildDuration(representation);
        _timescale = traverseAndBuildTimescale(representation);
    }

    public function getInitializationSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                             internalRepresentationId:Number):Segment {
        return _context.buildDataSegment(internalRepresentationId, baseUrl + _initializationSegment.filename,
                _initializationSegment.range);
    }

    public function getIndexSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                    internalRepresentationId:Number):Segment {
        return _context.buildNullSegment(internalRepresentationId);
    }

    public function getSegment(timestamp:Number, representationId:String, bandwidth:Number, baseUrl:String,
                               duration:Number, internalRepresentationId:Number):Segment {
        var index:Number = calculateIndex(timestamp);

        if (index < 0 || index >= _segments.length) {
            return null;
        }

        var startTimestamp:Number = index * segmentDuration;
        var endTimestamp:Number = startTimestamp + segmentDuration;

        return _context.buildMediaDataSegment(internalRepresentationId, baseUrl + _segments[index].filename,
                _segments[index].range, startTimestamp, endTimestamp);
    }

    public function update(xml:XML):void {
    }

    private function get segmentDuration():Number {
        return _duration / _timescale;
    }

    private function calculateIndex(timestamp:Number):Number {
        return Math.round(timestamp / segmentDuration);
    }

    private function traverseAndBuildSegments(node:XML):Vector.<Object> {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'SegmentURL' tag");
        }

        if (node.SegmentList.length() == 1 && node.SegmentList.SegmentURL.length() > 0) {
            var segments:Vector.<Object> = new Vector.<Object>();

            for each (var item:XML in node.SegmentList.SegmentURL) {
                segments.push(buildSegment(item));
            }

            return segments;
        }

        return traverseAndBuildSegments(node.parent());
    }

    private function traverseAndBuildInitializationSegment(node:XML):Object {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'sourceURL' attribute");
        }

        if (node.SegmentBase.length() == 1 && node.SegmentBase.Initialization.length() == 1) {
            return buildSegment(node.SegmentBase.Initialization[0]);
        }

        if (node.SegmentList.length() == 1 && node.SegmentList.Initialization.length() == 1) {
            return buildSegment(node.SegmentList.Initialization[0]);
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildInitializationSegment(node.parent());
    }

    private function buildSegment(node:XML):Object {
        var filename:String;

        if (node.hasOwnProperty("@sourceURL")) {
            filename = node.@sourceURL.toString();
        } else if (node.hasOwnProperty("@media")) {
            filename = node.@media.toString();
        } else {
            filename = traverseAndBuildBaseUrl(node);
        }

        var range:String;

        if (node.hasOwnProperty("@range")) {
            range = node.@range.toString();
        } else if (node.hasOwnProperty("@mediaRange")) {
            range = node.@mediaRange.toString();
        } else {
            range = "0-";
        }

        return { filename: filename, range: range };
    }

    private function traverseAndBuildBaseUrl(node:XML):String {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'BaseURL' tag");
        }

        if (node.BaseURL.length() == 1) {
            return node.BaseURL;
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildBaseUrl(node.parent());
    }

    private function traverseAndBuildDuration(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'duration' attribute");
        }

        if (node.SegmentList.length() == 1 && node.SegmentList.hasOwnProperty("@duration")) {
            return Number(node.SegmentList.@duration.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildDuration(node.parent());
    }

    private function traverseAndBuildTimescale(node:XML):Number {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'timescale' attribute");
        }

        if (node.SegmentList.length() == 1 && node.SegmentList.hasOwnProperty("@timescale")) {
            return Number(node.SegmentList.@timescale.toString());
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildTimescale(node.parent());
    }

    public function toString():String {
        return "segmentDuration[u]='" + _duration + ", timescale='" + _timescale + "', initializationFilename='"
                + _initializationSegment + "', segmentsCount='" + _segments.length + "'";
    }
}
}
