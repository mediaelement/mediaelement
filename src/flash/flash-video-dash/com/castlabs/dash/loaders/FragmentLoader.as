/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.loaders {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.descriptors.Representation;
import com.castlabs.dash.descriptors.segments.MediaDataSegment;
import com.castlabs.dash.descriptors.segments.Segment;
import com.castlabs.dash.descriptors.segments.WaitSegment;
import com.castlabs.dash.events.FragmentEvent;
import com.castlabs.dash.events.SegmentEvent;
import com.castlabs.dash.events.StreamEvent;
import com.castlabs.dash.handlers.InitializationSegmentHandler;
import com.castlabs.dash.handlers.MediaSegmentHandler;

import flash.events.EventDispatcher;
import flash.events.TimerEvent;
import flash.utils.ByteArray;
import flash.utils.Dictionary;
import flash.utils.Timer;

public class FragmentLoader extends EventDispatcher {
    private var _initializationSegmentHandlers:Dictionary = new Dictionary();
    private var _indexSegmentFlags:Dictionary = new Dictionary();

    private var _audioSegmentHandler:MediaSegmentHandler;
    private var _videoSegmentHandler:MediaSegmentHandler;

    private var _audioSegmentLoaded:Boolean = false;
    private var _videoSegmentLoaded:Boolean = false;

    private var _audioSegmentLoader:SegmentLoader;
    private var _videoSegmentLoader:SegmentLoader;

    private var _audioSegment:MediaDataSegment;
    private var _videoSegment:MediaDataSegment;

    private var _audioOffset:Number = 0;
    private var _videoOffset:Number = 0;

    private var _waitTimer:Timer;

    private var _context:DashContext;

    public function FragmentLoader(context:DashContext) {
        _context = context;

        _waitTimer = new Timer(250); // 250 ms
        _waitTimer.addEventListener(TimerEvent.TIMER, loadNextFragment);
    }

    public function init():void {
        loadInitializationSegments(_context.manifestHandler.audioRepresentations, onInitializationAudioSegmentLoaded);
        loadInitializationSegments(_context.manifestHandler.videoRepresentations, onInitializationVideoSegmentLoaded);

        loadIndexSegments(_context.manifestHandler.audioRepresentations, onIndexSegmentLoaded);
        loadIndexSegments(_context.manifestHandler.videoRepresentations, onIndexSegmentLoaded);
    }

    public function seek(timestamp:Number):Number {
        close();

        _videoSegment = MediaDataSegment(_context.adaptiveSegmentDispatcher.getVideoSegment(timestamp));
        _audioSegment = MediaDataSegment(getAudioOrSilentSegment(_videoSegment.startTimestamp));

        _audioOffset = _audioSegment.startTimestamp;
        _videoOffset = _videoSegment.startTimestamp;

        _context.console.info("Seek to audio segment: " + _audioSegment);
        _context.console.info("Seek to video segment: " + _videoSegment);

        return Math.min(_videoOffset, _audioOffset);
    }

    public function loadFirstFragment():void {
        _videoSegmentLoaded = false;
        _audioSegmentLoaded = isSilent();

        logMediaBandwidth();

        if (!_audioSegmentLoaded) {
            _audioSegmentLoader = loadSegment(_audioSegment, onAudioSegmentLoaded);
        }

        if (!_videoSegmentLoaded) {
            _videoSegmentLoader = loadSegment(_videoSegment, onVideoSegmentLoaded);
        }
    }

    public function loadNextFragment(timerEvent:TimerEvent = null):void {
        _waitTimer.stop();

        markIfAudioAndVideoLoaded();

        if (!_audioSegmentLoaded) {
            var segment1:Segment = _context.adaptiveSegmentDispatcher.getAudioSegment(_audioSegment.endTimestamp);

            if (segment1 is WaitSegment) {
                _waitTimer.start();
                _context.console.debug("Received wait segment.");
                return;
            }

            _audioSegment = MediaDataSegment(segment1);
        }

        if (!_videoSegmentLoaded) {
            var segment2:Segment = _context.adaptiveSegmentDispatcher.getVideoSegment(_videoSegment.endTimestamp);

            if (segment2 is WaitSegment) {
                _waitTimer.start();
                _context.console.debug("Received wait segment.");
                return;
            }

            _videoSegment = MediaDataSegment(segment2);
        }

        if (!_audioSegment || !_videoSegment) { // notify end
            _context.console.info("Reached the end");
            dispatchEvent(_context.buildStreamEvent(StreamEvent.END));
            reset();
            return;
        }

        logMediaBandwidth();

        if (!_audioSegmentLoaded) {
            _context.console.info("Next audio segment: " + _audioSegment);
            _audioSegmentLoader = loadSegment(_audioSegment, onAudioSegmentLoaded);
        }

        if (!_videoSegmentLoaded) {
            _context.console.info("Next video segment: " + _videoSegment);
            _videoSegmentLoader = loadSegment(_videoSegment, onVideoSegmentLoaded);
        }
    }

    private function markIfAudioAndVideoLoaded():void {
        if (_videoSegment.endTimestamp < _audioSegment.endTimestamp) {
            // next fragment with longer audio or silent;
            _videoSegmentLoaded = false;
            _audioSegmentLoaded = true;
        } else if (_videoSegment.endTimestamp > _audioSegment.endTimestamp) {
            // next fragment with shorter audio
            _videoSegmentLoaded = true;
            _audioSegmentLoaded = false;
        } else if (_videoSegment.endTimestamp == _audioSegment.endTimestamp) {
            // next fragment with equal audio
            _videoSegmentLoaded = false;
            _audioSegmentLoaded = false;
        }
    }

    private function isSilent():Boolean {
        return _audioSegment.startTimestamp == Infinity;
    }

    private function logMediaBandwidth():void {
        for each (var representation1:Representation in _context.manifestHandler.audioRepresentations) {
            if (representation1.internalId == _audioSegment.internalRepresentationId) {
                _context.console.appendAudioBandwidth(representation1.bandwidth);
                break;
            }
        }

        for each (var representation2:Representation in _context.manifestHandler.videoRepresentations) {
            if (representation2.internalId == _videoSegment.internalRepresentationId) {
                _context.console.appendVideoBandwidth(representation2.bandwidth);
                break;
            }
        }
    }

    public function close():void {
        if (_audioSegmentLoader != null) {
            _audioSegmentLoader.close();
        }

        if (_videoSegmentLoader != null) {
            _videoSegmentLoader.close();
        }

        _waitTimer.stop();

        reset();
    }

    private function onInitializationAudioSegmentLoaded(event:SegmentEvent):void {
        _context.console.debug("Creating audio initialization segment...");

        var handler:InitializationSegmentHandler = _context.buildInitializationAudioSegmentHandler(event.bytes);

        _context.console.debug("Created audio initialization segment, " + handler.toString());

        _initializationSegmentHandlers[event.segment.internalRepresentationId] = handler;

        notifyReadyIfNeeded();
    }

    private function onInitializationVideoSegmentLoaded(event:SegmentEvent):void {
        _context.console.debug("Creating video initialization segment...");

        var handler:InitializationSegmentHandler = _context.buildInitializationVideoSegmentHandler(event.bytes);

        _context.console.debug("Created video initialization segment, " + handler.toString());

        _initializationSegmentHandlers[event.segment.internalRepresentationId] = handler;

        notifyReadyIfNeeded();
    }

    private function onIndexSegmentLoaded(event:SegmentEvent):void {
        _indexSegmentFlags[event.segment.internalRepresentationId] = true;
        notifyReadyIfNeeded();
    }

    private function loadInitializationSegments(representations:Vector.<Representation>, callback:Function):void {
        for each (var representation:Representation in representations) {
            var segment:Segment = representation.getInitializationSegment();
            loadSegment(segment, callback);
        }
    }

    private function loadIndexSegments(representations:Vector.<Representation>, callback:Function):void {
        for each (var representation:Representation in representations) {
            var segment:Segment = representation.getIndexSegment();
            loadSegment(segment, callback);
        }
    }

    private function notifyReadyIfNeeded():void {
        var expectedLength:Number = _context.manifestHandler.audioRepresentations.length
                + _context.manifestHandler.videoRepresentations.length;
        var initializationSegmentsLoaded:Boolean = getLength(_initializationSegmentHandlers) == expectedLength;
        var indexSegmentsLoaded:Boolean = getLength(_indexSegmentFlags) == expectedLength;

        if (initializationSegmentsLoaded && indexSegmentsLoaded) {
            dispatchEvent(_context.buildStreamEvent(StreamEvent.READY, false, false,
                    _context.manifestHandler.live, _context.manifestHandler.duration));
        }
    }

    public static function getLength(dict:Dictionary):Number {
        var n:int = 0;

        for (var key:* in dict) {
            n++;
        }

        return n;
    }

    private function onAudioSegmentLoaded(event:SegmentEvent):void {
        var _initializationSegmentHandler:InitializationSegmentHandler =
                _initializationSegmentHandlers[event.segment.internalRepresentationId];

        var offset:Number = Math.min(_videoOffset, _audioOffset);

        _context.console.debug("Processing audio segment...");

        _audioSegmentHandler = _context.buildAudioSegmentHandler(event.bytes, _initializationSegmentHandler.messages,
                _initializationSegmentHandler.defaultSampleDuration, _initializationSegmentHandler.timescale,
                (_audioSegment.startTimestamp - offset) * 1000);

        _context.console.debug("Processed audio segment");

        _audioSegmentLoaded = true;

        notifyLoadedIfNeeded();
    }

    private function onVideoSegmentLoaded(event:SegmentEvent):void {
        var _initializationSegmentHandler:InitializationSegmentHandler =
                _initializationSegmentHandlers[event.segment.internalRepresentationId];

        var offset:Number = Math.min(_videoOffset, _audioOffset);

        _context.console.debug("Processing video segment...");

        _videoSegmentHandler = _context.buildVideoSegmentHandler(event.bytes, _initializationSegmentHandler.messages,
                _initializationSegmentHandler.defaultSampleDuration, _initializationSegmentHandler.timescale,
                (_videoSegment.startTimestamp - offset) * 1000);

        _context.console.debug("Processed video segment");

        _videoSegmentLoaded = true;

        notifyLoadedIfNeeded();
    }

    private function onError(event:SegmentEvent):void {
        dispatchEvent(event);
    }

    private function loadSegment(segment:Segment, callback:Function):SegmentLoader {
        var loader:SegmentLoader = _context.buildSegmentLoader(segment);
        loader.addEventListener(SegmentEvent.LOADED, callback);
        loader.addEventListener(SegmentEvent.ERROR, onError);
        loader.load();
        return loader;
    }

    private function notifyLoadedIfNeeded():void {
        if (_audioSegmentLoaded && _videoSegmentLoaded) {
            var bytes:ByteArray = new ByteArray();

            // _audioSegmentHandler is null if not loaded
            if (_audioSegmentHandler != null) {
                bytes.writeBytes(_audioSegmentHandler.bytes);
            }

            // _videoSegmentHandler is null if not loaded
            if (_videoSegmentHandler != null) {
                bytes.writeBytes(_videoSegmentHandler.bytes);
            }

            _audioSegmentLoaded = false;
            _videoSegmentLoaded = false;

            _audioSegmentHandler = null;
            _videoSegmentHandler = null;

            var endTimestamp:Number = Math.min(_videoSegment.endTimestamp, _audioSegment.endTimestamp);

            dispatchEvent(_context.buildFragmentEvent(FragmentEvent.LOADED, false, false, bytes, endTimestamp));
        }
    }

    private function getAudioOrSilentSegment(timestamp:Number):Segment {
        var segment:Segment = _context.adaptiveSegmentDispatcher.getAudioSegment(timestamp);
        return segment ? segment : new MediaDataSegment(NaN, null, null, Infinity, Infinity);
    }

    private function reset():void {
        _audioSegmentLoader = null;
        _videoSegmentLoader = null;

        _audioSegmentHandler = null;
        _videoSegmentHandler = null;

        _audioSegmentLoaded = false;
        _videoSegmentLoaded = false;
    }
}
}
