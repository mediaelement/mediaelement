/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import com.castlabs.dash.events.FragmentEvent;
import com.castlabs.dash.events.SegmentEvent;
import com.castlabs.dash.events.StreamEvent;
import com.castlabs.dash.loaders.FragmentLoader;

import flash.events.NetStatusEvent;
import flash.events.TimerEvent;
import flash.net.NetConnection;
import flash.net.NetStream;
import flash.net.NetStreamAppendBytesAction;
import flash.utils.ByteArray;
import flash.utils.Timer;

import org.osmf.net.NetStreamCodes;

public class DashNetStream extends NetStream {
    private const MIN_BUFFER_TIME:Number = 5;
    private const MAX_BUFFER_TIME:Number = 30;

    // actions
    private const PLAY:uint = 1;
    private const PAUSE:uint = 2;
    private const RESUME:uint = 3;
    private const STOP:uint = 4;
    private const SEEK:uint = 5;
    private const BUFFER:uint = 6;

    // states
    private const INITIALIZING:uint = 0;
    private const PLAYING:uint = 1;
    private const BUFFERING:uint = 2;
    private const SEEKING:uint = 3;
    private const PAUSED:uint = 4;
    private const STOPPED:uint = 5;

    protected var _context:DashContext;

    private var _state:uint = INITIALIZING;

    private var _loader:FragmentLoader;

    private var _loaded:Boolean = false;

    private var _offset:Number = 0;
    private var _loadedTimestamp:Number = 0;
    private var _duration:Number = 0;
    private var _live:Boolean;

    private var _bufferTimer:Timer;
    private var _fragmentTimer:Timer;

    public function DashNetStream(context:DashContext, connection:NetConnection) {
        super(connection);

        _context = context;

        addEventListener(NetStatusEvent.NET_STATUS, onNetStatus);

        _bufferTimer = new Timer(250); // 250 ms
        _bufferTimer.addEventListener(TimerEvent.TIMER, onBufferTimer);

        _fragmentTimer = new Timer(250); // 250 ms
        _fragmentTimer.addEventListener(TimerEvent.TIMER, onFragmentTimer);

        inBufferSeek = false;
        bufferTime = 0;
        bufferTimeMax = 0;
        maxPauseBufferTime = 0;
        useHardwareDecoder = true;
    }

    override public function play(...rest):void {
        super.play(null);

        appendBytesAction(NetStreamAppendBytesAction.RESET_BEGIN);
        appendFileHeader();

        notifyPlayStart();

        _bufferTimer.start();

        jump();

        updateState(PLAY);
    }

    private function onBufferTimer(timerEvent:TimerEvent):void {
        var bufferTime:Number = _loadedTimestamp - time;

        switch(_state) {
            case PLAYING:
                if (!_loaded && bufferTime < MIN_BUFFER_TIME) {
                    pause();
                    notifyBufferEmpty();
                    updateState(BUFFER);
                    return;
                }
                break;
            case BUFFERING:
                if (bufferTime > MIN_BUFFER_TIME) {
                    resume();
                    notifyBufferFull();
                    return;
                }
                break;
        }
    }

    override public function pause():void {
        super.pause();
        updateState(PAUSE);
    }

    override public function resume():void {
        switch (_state) {
            case PAUSED:
            case BUFFERING:
                super.resume();
                break;
            case STOPPED:
                play();
                break;
            case SEEKING:
                jump();
                break;
        }

        updateState(RESUME);
    }

    override public function seek(offset:Number):void {
        switch (_state) {
            case PAUSED:
            case SEEKING:
            case STOPPED:
                _fragmentTimer.stop();
                _loader.close();
                _offset = offset;
                super.seek(_offset);
                break;
            case PLAYING:
            case BUFFERING:
                _fragmentTimer.stop();
                _loader.close();
                _offset = offset;
                super.seek(_offset);
                jump();
                break;
        }

        updateState(SEEK);
    }

    override public function get time():Number {
        return super.time + _offset;
    }

    override public function close():void {
        super.close();

        appendBytesAction(NetStreamAppendBytesAction.END_SEQUENCE);
        appendBytesAction(NetStreamAppendBytesAction.RESET_SEEK);

        _bufferTimer.stop();

        notifyPlayStop();

        reset();

        updateState(STOP);
    }

    override public function get bytesLoaded():uint {
        if (_live) {
            return 1;
        } else {
            if (_loadedTimestamp == 0) {

                //WORKAROUND ScrubBar:531 ignores zero value
                return 1;
            }

            // seconds
            return _loadedTimestamp;
        }
    }

    override public function get bytesTotal():uint {
        if (_live) {
            return 1;
        } else {
            if (_loadedTimestamp == 0) {

                //WORKAROUND ScrubBar:531 ignore zero value; generate smallest possible fraction
                return uint.MAX_VALUE;
            }

            // seconds
            return _duration;
        }
    }

    public function init():void {
        _live = _context.manifestHandler.live;
        _duration = _context.manifestHandler.duration;

        _loader = _context.fragmentLoader;
        _loader.addEventListener(StreamEvent.READY, onReady);
        _loader.addEventListener(FragmentEvent.LOADED, onLoaded);
        _loader.addEventListener(StreamEvent.END, onEnd);
        _loader.addEventListener(SegmentEvent.ERROR, onError);
        _loader.init();
    }

    protected function appendFileHeader():void {
        var output:ByteArray = new ByteArray();
        output.writeByte(0x46);	// 'F'
        output.writeByte(0x4c); // 'L'
        output.writeByte(0x56); // 'V'
        output.writeByte(0x01); // version 0x01

        var flags:uint = 0;

        flags |= 0x01;

        output.writeByte(flags);

        var offsetToWrite:uint = 9; // minimum file header byte count

        output.writeUnsignedInt(offsetToWrite);

        var previousTagSize0:uint = 0;

        output.writeUnsignedInt(previousTagSize0);

        appendBytes(output);
    }

    private function updateState(action:Number):void {
        switch (action) {
            case PLAY:
                _context.console.debug("Received PLAY action and changed to PLAYING state");
                _state = PLAYING;
                break;
            case PAUSE:
                _context.console.debug("Received PAUSE action and changed to PAUSED state");
                _state = PAUSED;
                break;
            case RESUME:
                _context.console.debug("Received RESUME action and changed to PLAYING state");
                _state = PLAYING;
                break;
            case STOP:
                _context.console.debug("Received STOP action and changed to STOPPED state");
                _state = STOPPED;
                break;
            case SEEK:
                switch (_state) {
                    case PAUSED:
                        _context.console.debug("Received SEEK action and changed to SEEKING state");
                        _state = SEEKING;
                        break;
                    case PLAYING:
                    case BUFFERING:
                        _context.console.debug("Received SEEK action and changed to PLAYING state");
                        _state = PLAYING;
                        break;
                }
                break;
            case BUFFER:
                _context.console.debug("Received BUFFER action and changed to BUFFERING state");
                _state = BUFFERING;
                break;
        }
    }

    private function jump():void {
        _offset = _loader.seek(_offset);
        _loadedTimestamp = 0;

        super.seek(_offset);

        appendBytesAction(NetStreamAppendBytesAction.RESET_SEEK);

        _loader.loadFirstFragment();
    }

    private function notifyPlayStart():void {
        dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                { code: NetStreamCodes.NETSTREAM_PLAY_START, level: "status" }));
    }

    private function notifyPlayStop():void {
        dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                { code: NetStreamCodes.NETSTREAM_PLAY_STOP, level: "status" }));
    }

    private function notifyPlayUnpublish():void {
        dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                { code: NetStreamCodes.NETSTREAM_PLAY_UNPUBLISH_NOTIFY, level: "status" }));
    }

    private function notifyBufferFull():void {
        dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                { code: NetStreamCodes.NETSTREAM_BUFFER_FULL, level: "status" }));
    }

    private function notifyBufferEmpty():void {
        dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                { code: NetStreamCodes.NETSTREAM_BUFFER_EMPTY, level: "status" }));
    }

    private function reset():void {
        _offset = 0;
        _loadedTimestamp = 0;
        _loaded = false;
    }

    private function onReady(event:StreamEvent):void {
        _state = STOPPED;
        dispatchEvent(event);
    }

    private function onLoaded(event:FragmentEvent):void {
        _loadedTimestamp = event.endTimestamp;
        appendBytes(event.bytes);
        onFragmentTimer();
    }

    private function onError(event:SegmentEvent):void {
        if (_state == INITIALIZING) {
            dispatchEvent(_context.buildStreamEvent(StreamEvent.ERROR));
        } else {
            dispatchEvent(new NetStatusEvent(NetStatusEvent.NET_STATUS, false, false,
                    { code: NetStreamCodes.NETSTREAM_FAILED, level: "status" }));
        }
    }

    private function onFragmentTimer(timerEvent:TimerEvent = null):void {
        _fragmentTimer.stop();

        if ((_loadedTimestamp - time) < MAX_BUFFER_TIME) {
            _loader.loadNextFragment();
        } else {
            _fragmentTimer.start();
        }
    }

    private function onNetStatus(event:NetStatusEvent):void {
        switch(event.info.code) {
            case NetStreamCodes.NETSTREAM_BUFFER_EMPTY:
                if  (_loaded) {
                    close();
                    notifyPlayUnpublish();
                }
                break;
            case NetStreamCodes.NETSTREAM_PLAY_STREAMNOTFOUND:
                close();
                break;
        }
    }

    private function onEnd(event:StreamEvent):void {
        _loaded = true;
        _loadedTimestamp = _duration;
    }
}
}
