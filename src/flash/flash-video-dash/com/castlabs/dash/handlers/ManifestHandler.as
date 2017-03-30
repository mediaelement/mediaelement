/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.handlers {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.descriptors.Representation;
import com.castlabs.dash.events.ManifestEvent;
import com.castlabs.dash.loaders.ManifestLoader;
import com.castlabs.dash.utils.Manifest;

import flash.events.TimerEvent;
import flash.utils.Timer;

public class ManifestHandler {
    private var _context:DashContext;
    private var _url:String;

    private var _live:Boolean;
    private var _duration:Number;
    private var _audioRepresentations:Vector.<Representation>;
    private var _videoRepresentations:Vector.<Representation>;

    private var _nextInternalRepresentationId:Number = 0;

    private var _updateTimer:Timer;

    public function ManifestHandler(context:DashContext, url:String, xml:XML, ignoreUpdate:Boolean = false) {
        _context = context;

        _url = url;
        _duration = buildDuration(xml);

        var baseUrl:String = buildBaseUrl(url);
        _audioRepresentations = buildRepresentations(baseUrl, _duration, findAudioRepresentationNodes(xml));
        _videoRepresentations = buildRepresentations(baseUrl, _duration, findVideoRepresentationNodes(xml));

        sortByBandwidth(_audioRepresentations);
        sortByBandwidth(_videoRepresentations);

        _live = buildLive(xml);
        if (_live) {
            var minimumUpdatePeriod:Number = buildMinimumUpdatePeriod(xml);

            if (!ignoreUpdate && minimumUpdatePeriod) {
                _updateTimer = new Timer(minimumUpdatePeriod * 1000);
                _updateTimer.addEventListener(TimerEvent.TIMER, onUpdate);
                _updateTimer.start();
            }
        }
    }

    public function get live():Boolean {
        return _live;
    }

    public function get duration():Number {
        return _duration;
    }

    public function get audioRepresentations():Vector.<Representation> {
        return _audioRepresentations;
    }

    public function get videoRepresentations():Vector.<Representation> {
        return _videoRepresentations
    }

    private function onUpdate(timerEvent:TimerEvent):void {
        var loader:ManifestLoader = _context.buildManifestLoader(_url);
        loader.addEventListener(ManifestEvent.LOADED, onLoad);

        function onLoad(event:ManifestEvent):void {
            _context.console.info("Loaded changed manifest. Updating representations...");

            for each (var representation1:Representation in _videoRepresentations) {
                representation1.update(event.xml..Representation.(@id == representation1.id)[0]);
            }

            for each (var representation2:Representation in _audioRepresentations) {
                representation2.update(event.xml..Representation.(@id == representation2.id)[0]);
            }

            _context.console.info("Updated representations");
        }

        loader.load();
    }

    private function buildMinimumUpdatePeriod(xml:XML):Number {
        if (xml.hasOwnProperty("@minimumUpdatePeriod")) {
            return Manifest.toSeconds(xml.@minimumUpdatePeriod.toString());
        }

        _context.console.warn("Couldn't find minimum update period");
        return NaN;
    }

    private static function buildBaseUrl(url:String):String {
        return url.slice(0, url.lastIndexOf("/")) + "/";
    }

    private function buildDuration(xml:XML):Number {
        if (xml.hasOwnProperty("@mediaPresentationDuration")) {
            return Manifest.toSeconds(xml.@mediaPresentationDuration.toString());
        }

        _context.console.warn("Couldn't find media presentation duration");
        return NaN;
    }

    private static function buildLive(xml:XML):Boolean {
        if (xml.hasOwnProperty("@type")) {
            return xml.@type.toString() == "dynamic";
        }

        return false;
    }

    private function findVideoRepresentationNodes(xml:XML):* {
        return findRepresentationNodes("video/mp4", xml);
    }

    private function findAudioRepresentationNodes(xml:XML):* {
        try {
            return findRepresentationNodes("audio/mp4", xml);
        } catch (e:RepresentationNotFoundError) {
            _context.console.warn("Ignored missed audio representation");
            return new XMLList();
        }
    }

    private function findRepresentationNodes(mimeType:String, xml:XML):* {
        var representations:* = null;

        representations = xml..AdaptationSet.(attribute('mimeType') == mimeType).Representation;
        if (representations.length() > 0) {
            return representations;
        }

        representations = xml..Representation.(@mimeType == mimeType);
        if (representations.length() > 0) {
            return representations;
        }

        _context.console.error("Couldn't find any representations, mimeType='" + mimeType + "'");
        throw new RepresentationNotFoundError();
    }

    private function buildRepresentations(baseUrl:String, duration:Number, nodes:XMLList):Vector.<Representation> {
        var representations:Vector.<Representation> = new Vector.<Representation>();

        for each (var node:XML in nodes) {
            _context.console.debug("Processing next representation...");
            var representation:Representation = _context.buildRepresentation(_nextInternalRepresentationId++,
                    baseUrl, duration, node);
            _context.console.info("Created representation, " + representation.toString());

            representations.push(representation);
        }

        return representations;
    }

    private static function sortByBandwidth(representations:Vector.<Representation>):void {
        representations.sort(function compare(a:Representation, b:Representation):Number {
            if (a.bandwidth < b.bandwidth) {
                return -1; // a should appear before b
            }

            if (a.bandwidth > b.bandwidth) {
                return 1; // b should appear before a
            }

            return 0; // a equals b
        });
    }

    public function toString():String {
        return "isLive='" + _live + "', duration[s]='" + _duration + "', videoRepresentationsCount='"
                + _videoRepresentations.length + "', audioRepresentationsCount='" + _audioRepresentations.length + "'";
    }
}
}

class RepresentationNotFoundError extends Error {}
