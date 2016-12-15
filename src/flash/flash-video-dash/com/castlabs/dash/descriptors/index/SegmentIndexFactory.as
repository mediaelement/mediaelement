/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.descriptors.index {
import com.castlabs.dash.DashContext;

public class SegmentIndexFactory {
    private var _context:DashContext;

    public function SegmentIndexFactory(context:DashContext) {
        _context = context;
    }

    public function create(representation:XML):SegmentIndex {
        return traverseAndCreate(representation, representation);
    }

    private function traverseAndCreate(node:XML, representation:XML):SegmentIndex {
        if (node == null) {
            throw _context.console.logAndBuildError("Couldn't find any 'SegmentTimeline', 'SegmentTemplate', " +
                    "'SegmentTemplate', 'SegmentList' or 'BaseURL' tag");
        }

        var segmentIndex:SegmentIndex = null;

        if (node.SegmentTemplate.length() == 1
                && node.SegmentTemplate.SegmentTimeline.length() == 1) {
            _context.console.info("Creating segment time line...");
            segmentIndex = _context.buildSegmentTimeline(representation);
            _context.console.info("Created segment time line, " + segmentIndex.toString());
            return segmentIndex;
        }

        if (node.SegmentTemplate.length() == 1) {
            _context.console.info("Creating segment template...");
            segmentIndex = _context.buildSegmentTemplate(representation);
            _context.console.info("Created segment template, " + segmentIndex.toString());
            return segmentIndex;
        }

        if (node.SegmentList.length() == 1) {
            _context.console.info("Creating segment list...");
            segmentIndex = _context.buildSegmentList(representation);
            _context.console.info("Created segment list, " + segmentIndex.toString());
            return segmentIndex;
        }

        if (node.BaseURL.length() == 1) {
            _context.console.info("Creating segment base URL...");
            segmentIndex = _context.buildSegmentRange(representation);
            _context.console.info("Created segment base URL, " + segmentIndex.toString());
            return segmentIndex;
        }

        return traverseAndCreate(node.parent(), representation);
    }
}
}
