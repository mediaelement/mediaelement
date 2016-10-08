/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import com.castlabs.dash.boxes.FLVTag;
import com.castlabs.dash.boxes.HandlerReferenceBox;
import com.castlabs.dash.boxes.MediaBox;
import com.castlabs.dash.boxes.MediaHeaderBox;
import com.castlabs.dash.boxes.MediaInformationBox;
import com.castlabs.dash.boxes.MovieBox;
import com.castlabs.dash.boxes.MovieExtendsBox;
import com.castlabs.dash.boxes.MovieFragmentBox;
import com.castlabs.dash.boxes.Muxer;
import com.castlabs.dash.boxes.NalUnit;
import com.castlabs.dash.boxes.SampleDescriptionBox;
import com.castlabs.dash.boxes.SampleEntry;
import com.castlabs.dash.boxes.SampleTableBox;
import com.castlabs.dash.boxes.TrackBox;
import com.castlabs.dash.boxes.TrackExtendsBox;
import com.castlabs.dash.boxes.TrackFragmentBox;
import com.castlabs.dash.boxes.TrackFragmentHeaderBox;
import com.castlabs.dash.boxes.TrackFragmentRunBox;
import com.castlabs.dash.boxes.TrackHeaderBox;
import com.castlabs.dash.descriptors.Representation;
import com.castlabs.dash.descriptors.index.SegmentIndexFactory;
import com.castlabs.dash.descriptors.index.SegmentList;
import com.castlabs.dash.descriptors.index.SegmentRange;
import com.castlabs.dash.descriptors.index.SegmentTemplate;
import com.castlabs.dash.descriptors.index.SegmentTimeline;
import com.castlabs.dash.descriptors.segments.DataSegment;
import com.castlabs.dash.descriptors.segments.MediaDataSegment;
import com.castlabs.dash.descriptors.segments.NullSegment;
import com.castlabs.dash.descriptors.segments.ReflexiveSegment;
import com.castlabs.dash.descriptors.segments.Segment;
import com.castlabs.dash.descriptors.segments.WaitSegment;
import com.castlabs.dash.events.FragmentEvent;
import com.castlabs.dash.events.ManifestEvent;
import com.castlabs.dash.events.SegmentEvent;
import com.castlabs.dash.events.StreamEvent;
import com.castlabs.dash.handlers.AudioSegmentHandler;
import com.castlabs.dash.handlers.IndexSegmentHandler;
import com.castlabs.dash.handlers.InitializationAudioSegmentHandler;
import com.castlabs.dash.handlers.InitializationVideoSegmentHandler;
import com.castlabs.dash.handlers.ManifestHandler;
import com.castlabs.dash.handlers.VideoSegmentHandler;
import com.castlabs.dash.loaders.DataSegmentLoader;
import com.castlabs.dash.loaders.FragmentLoader;
import com.castlabs.dash.loaders.ManifestLoader;
import com.castlabs.dash.loaders.NullSegmentLoader;
import com.castlabs.dash.loaders.ReflexiveSegmentLoader;
import com.castlabs.dash.loaders.SegmentLoader;
import com.castlabs.dash.utils.AdaptiveSegmentDispatcher;
import com.castlabs.dash.utils.BandwidthMonitor;
import com.castlabs.dash.utils.Console;
import com.castlabs.dash.utils.SmoothMonitor;

import flash.net.NetConnection;
import flash.net.NetStream;
import flash.utils.ByteArray;

import org.osmf.traits.LoadTrait;
import org.osmf.traits.TimeTrait;

public class DashContext {
    private static var _instance:DashContext;

    private static var _console:Console;
    private static var _dashNetLoader:DashNetLoader;
    private static var _smoothMonitor:SmoothMonitor;
    private static var _bandwidthMonitor:BandwidthMonitor;
    private static var _muxer:Muxer;
    private static var _segmentIndexFactory:SegmentIndexFactory;
    private static var _nalUnit:NalUnit;
    private static var _manifestHandler:ManifestHandler;
    private static var _adaptiveSegmentDispatcher:AdaptiveSegmentDispatcher;
    private static var _fragmentLoader:FragmentLoader;

    public function DashContext() {}

    public static function getInstance():DashContext {
        if (_instance == null) {
            _instance = new DashContext();
        }

        return _instance;
    }

    public function get console():Console {
        if (_console == null) {
            _console = new Console();
        }

        return _console;
    }

    public function get dashNetLoader():DashNetLoader {
        if (_dashNetLoader == null) {
            _dashNetLoader = new DashNetLoader(this);
        }

        return _dashNetLoader;
    }

    public function get smoothMonitor():SmoothMonitor {
        if (_smoothMonitor == null) {
            _smoothMonitor = new SmoothMonitor(this);
        }

        return _smoothMonitor;
    }

    public function get bandwidthMonitor():BandwidthMonitor {
        if (_bandwidthMonitor == null) {
            _bandwidthMonitor = new BandwidthMonitor(this);
        }

        return _bandwidthMonitor;
    }

    public function get muxer():Muxer {
        if (_muxer == null) {
            _muxer = new Muxer();
        }

        return _muxer;
    }

    public function get segmentIndexFactory():SegmentIndexFactory {
        if (_segmentIndexFactory == null) {
            _segmentIndexFactory = new SegmentIndexFactory(this);
        }

        return _segmentIndexFactory;
    }

    public function get nalUnit():NalUnit {
        if (_nalUnit == null) {
            _nalUnit = new NalUnit();
        }

        return _nalUnit;
    }

    public function get manifestHandler():ManifestHandler {
        if (_manifestHandler == null) {
            throw new Error("'manifestHandler' is undefined");
        }

        return _manifestHandler;
    }

    public function get adaptiveSegmentDispatcher():AdaptiveSegmentDispatcher {
        if (_adaptiveSegmentDispatcher == null) {
            _adaptiveSegmentDispatcher = new AdaptiveSegmentDispatcher(this);
        }

        return _adaptiveSegmentDispatcher;
    }

    public function get fragmentLoader():FragmentLoader {
        if (_fragmentLoader == null) {
            _fragmentLoader = new FragmentLoader(this);
        }

        return _fragmentLoader;
    }

    public function buildDashNetStream(connection:NetConnection):DashNetStream {
        return new DashNetStream(this, connection);
    }

    public function buildDashTimeTrait(stream:DashNetStream, duration:Number):DashTimeTrait {
        return new DashTimeTrait(stream, duration);
    }

    public function buildDashSeekTrait(temporal:TimeTrait, loadTrait:LoadTrait, netStream:NetStream):DashSeekTrait {
        return new DashSeekTrait(temporal, loadTrait, netStream);
    }

    public function buildManifestLoader(url:String):ManifestLoader {
        return new ManifestLoader(this, url);
    }

    public function createManifestHandler(url:String, xml:XML):ManifestHandler {
        if (_manifestHandler != null) {
            throw new Error("'manifestHandler' is already defined");
        }

        _manifestHandler = new ManifestHandler(this, url, xml);

        return _manifestHandler;
    }

    public function buildInitializationAudioSegmentHandler(bytes:ByteArray):InitializationAudioSegmentHandler {
        return new InitializationAudioSegmentHandler(this, bytes);
    }

    public function buildInitializationVideoSegmentHandler(bytes:ByteArray):InitializationVideoSegmentHandler {
        return new InitializationVideoSegmentHandler(this, bytes);
    }

    public function buildStreamEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                     live:Boolean = false, duration:Number = 0):StreamEvent {
        return new StreamEvent(type, bubbles, cancelable, live, duration);
    }

    public function buildAudioSegmentHandler(segment:ByteArray, messages:Vector.<FLVTag>, defaultSampleDuration:uint,
                                             timescale:uint, timestamp:Number):AudioSegmentHandler {
        return new AudioSegmentHandler(this, segment, messages, defaultSampleDuration, timescale, timestamp);
    }

    public function buildVideoSegmentHandler(segment:ByteArray, messages:Vector.<FLVTag>, defaultSampleDuration:uint,
                                             timescale:uint, timestamp:Number):VideoSegmentHandler {
        return new VideoSegmentHandler(this, segment, messages, defaultSampleDuration, timescale, timestamp);
    }

    public function buildFragmentEvent(type:String, bubbles:Boolean, cancelable:Boolean,
                                       bytes:ByteArray, endTimestamp:Number):FragmentEvent {
        return new FragmentEvent(type, bubbles, cancelable, bytes, endTimestamp);
    }

    public function buildRepresentation(internalId:Number, baseUrl:String, duration:Number, xml:XML):Representation {
        return new Representation(this, internalId, baseUrl, duration, xml);
    }

    public function buildSegmentLoader(segment:Segment):SegmentLoader {
        if (segment is ReflexiveSegment) {
            return new ReflexiveSegmentLoader(this, segment);
        }

        if (segment is DataSegment) {
            return new DataSegmentLoader(this, segment);
        }

        if (segment is NullSegment) {
            return new NullSegmentLoader(this, segment);
        }

        throw console.logAndBuildError("Unknown segment type");
    }

    public function buildSegmentEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                    segment:Segment = null, bytes:ByteArray = null):SegmentEvent {
        return new SegmentEvent(type, bubbles, cancelable, segment, bytes);
    }

    public function buildManifestEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false,
                                     url:String = null, xml:XML = null):ManifestEvent {
        return new ManifestEvent(type, bubbles, cancelable, url, xml);
    }

    public function buildSegmentTimeline(representation:XML):SegmentTimeline {
        return new SegmentTimeline(this, representation);
    }

    public function buildSegmentTemplate(representation:XML):SegmentTemplate {
        return new SegmentTemplate(this, representation);
    }

    public function buildSegmentList(representation:XML):SegmentList {
        return new SegmentList(this, representation);
    }

    public function buildSegmentRange(representation:XML):SegmentRange {
        return new SegmentRange(this, representation);
    }

    public function buildDataSegment(internalRepresentationId:Number, url:String, range:String="0-"):DataSegment {
        return new DataSegment(internalRepresentationId, url, range);
    }

    public function buildNullSegment(internalRepresentationId:Number):NullSegment {
        return new NullSegment(internalRepresentationId);
    }

    public function buildMediaDataSegment(internalRepresentationId:Number, url:String, range:String,
                                          startTimestamp:Number, endTimestamp:Number):MediaDataSegment {
        return new MediaDataSegment(internalRepresentationId, url, range, startTimestamp, endTimestamp);
    }

    public function buildReflexiveSegment(internalRepresentationId:Number, url:String, range:String,
                                          callback:Function):ReflexiveSegment {
        return new ReflexiveSegment(internalRepresentationId, url, range, callback);
    }

    public function buildMovieBox(offset:uint, size:uint):MovieBox {
        return new MovieBox(this, offset, size);
    }

    public function buildMovieFragmentBox(offset:uint, size:uint):MovieFragmentBox {
        return new MovieFragmentBox(this, offset, size);
    }

    public function buildFLVTag():FLVTag {
        return new FLVTag();
    }

    public function buildIndexSegmentHandler(segment:ByteArray, indexSegmentRangeBegin:Number):IndexSegmentHandler {
        return new IndexSegmentHandler(segment, indexSegmentRangeBegin);
    }

    public function buildWaitSegment(internalRepresentationId:Number):WaitSegment {
        return new WaitSegment(internalRepresentationId);
    }

    public function buildMediaInformationBox(offset:uint, size:uint):MediaInformationBox {
        return new MediaInformationBox(this, offset, size);
    }

    public function buildHandlerReferenceBox(offset:uint, size:uint):HandlerReferenceBox {
        return new HandlerReferenceBox(this, offset, size);
    }

    public function buildMediaHeaderBox(offset:uint, size:uint):MediaHeaderBox {
        return new MediaHeaderBox(this, offset, size);
    }

    public function buildSampleTableBox(offset:uint, size:uint):SampleTableBox {
        return new SampleTableBox(this, offset, size);
    }

    public function buildMovieExtendsBox(offset:uint, size:uint):MovieExtendsBox {
        return new MovieExtendsBox(this, offset, size);
    }

    public function buildTrackBox(offset:uint, size:uint):TrackBox {
        return new TrackBox(this, offset, size);
    }

    public function buildTrackExtendsBox(offset:uint, size:uint):TrackExtendsBox {
        return new TrackExtendsBox(this, offset, size);
    }

    public function buildTrackFragmentBox(moofOffset:uint, offset:uint, size:uint):TrackFragmentBox {
        return new TrackFragmentBox(this, moofOffset, offset, size);
    }

    public function buildSampleEntry(offset:uint, size:uint, type:String):SampleEntry {
        return new SampleEntry(this, offset, size, type);
    }

    public function buildSampleDescriptionBox(offset:uint, size:uint):SampleDescriptionBox {
        return new SampleDescriptionBox(this, offset, size);
    }

    public function buildTrackHeaderBox(offset:uint, size:uint):TrackHeaderBox {
        return new TrackHeaderBox(this, offset, size);
    }

    public function buildMediaBox(offset:uint, size:uint):MediaBox {
        return new MediaBox(this, offset, size);
    }

    public function buildTrackFragmentRunBox(offset:uint, size:uint):TrackFragmentRunBox {
        return new TrackFragmentRunBox(this, offset, size);
    }

    public function buildTrackFragmentHeaderBox(offset:uint, size:uint):TrackFragmentHeaderBox {
        return new TrackFragmentHeaderBox(this, offset, size);
    }
}
}
