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
import com.castlabs.dash.handlers.IndexSegmentHandler;

import flash.utils.ByteArray;

public class SegmentRange implements SegmentIndex {
    private var _context:DashContext;
    private var _baseUrl:String;
    private var _indexRange:String;
    private var _initializationRange:String;
    private var _indexSegmentHandler:IndexSegmentHandler;

    public function SegmentRange(context:DashContext, representation:XML) {
        _context = context;
        _baseUrl = traverseAndBuildBaseUrl(representation);
        _indexRange = traverseAndBuildIndexRange(representation);
        _initializationRange = traverseAndBuildInitializationRange(representation);
    }

    public function getInitializationSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                             internalRepresentationId:Number):Segment {
        return _context.buildDataSegment(internalRepresentationId, baseUrl + _baseUrl, _initializationRange);
    }

    public function getIndexSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                    internalRepresentationId:Number):Segment {
        return _context.buildReflexiveSegment(internalRepresentationId, baseUrl + _baseUrl, _indexRange,
                onIndexSegmentLoaded);
    }

    public function getSegment(timestamp:Number, representationId:String, bandwidth:Number, baseUrl:String,
                               duration:Number, internalRepresentationId:Number):Segment {
        var index:Number = calculateIndex(timestamp);

        if (index < 0 || index >= _indexSegmentHandler.references.length) {
            return null;
        }

        var reference:Object = _indexSegmentHandler.references[index];

        return _context.buildMediaDataSegment(internalRepresentationId, baseUrl + _baseUrl, reference.range,
                reference.startTimestamp, reference.endTimestamp);
    }

    public function update(xml:XML):void {
    }

    private function calculateIndex(timestamp:Number):Number {
        var references:Vector.<Object> = _indexSegmentHandler.references;
        for (var i:uint = 0; i < references.length; i++) {
            if (timestamp < references[i].endTimestamp) {
                return i;
            }
        }

        return -1;
    }

    public function onIndexSegmentLoaded(bytes:ByteArray):void {
        var match:Array = _indexRange.match(/([\d.]+)-/);
        var begin:Number = match ? Number(match[1]) : 0;

        _context.console.debug("Creating index segment...");

        _indexSegmentHandler = _context.buildIndexSegmentHandler(bytes, begin);

        _context.console.debug("Created index segment, " + _indexSegmentHandler.toString());
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

    private function traverseAndBuildIndexRange(node:XML):String {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'indexRange' attribute");
        }

        if (node.SegmentBase.length() == 1 && node.SegmentBase.hasOwnProperty("@indexRange")) {
            return node.SegmentBase.@indexRange.toString();
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildIndexRange(node.parent());
    }

    private function traverseAndBuildInitializationRange(node:XML):String {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'range' attribute");
        }

        if (node.SegmentBase.length() == 1
                && node.SegmentBase.Initialization.length() == 1
                && node.SegmentBase.Initialization.hasOwnProperty("@range")) {
            return node.SegmentBase.Initialization.@range.toString();
        }

        // go up one level in hierarchy, e.g. adaptionSet and period
        return traverseAndBuildInitializationRange(node.parent());
    }

    public function toString():String {
        return "baseUrl='" + _baseUrl + ", initializationRange='" + _initializationRange + "', indexRange='"
                + _indexRange + "'";
    }
}
}
