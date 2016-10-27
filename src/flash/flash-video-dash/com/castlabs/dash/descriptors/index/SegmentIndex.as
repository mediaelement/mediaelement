/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.index {
import com.castlabs.dash.descriptors.segments.Segment;

public interface SegmentIndex {
    function getInitializationSegment(representationId:String, bandwidth:Number, baseUrl:String,
                                      internalRepresentationId:Number):Segment;

    function getIndexSegment(representationId:String, bandwidth:Number, baseUrl:String,
                             internalRepresentationId:Number):Segment;

    function getSegment(timestamp:Number, representationId:String, bandwidth:Number, baseUrl:String, duration:Number,
                        internalRepresentationId:Number):Segment;

    function update(xml:XML):void;

    function toString():String;
}
}
