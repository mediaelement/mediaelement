/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.loaders {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.descriptors.segments.DataSegment;
import com.castlabs.dash.descriptors.segments.Segment;
import com.castlabs.dash.events.SegmentEvent;

import flash.events.AsyncErrorEvent;
import flash.events.ErrorEvent;
import flash.events.Event;
import flash.events.HTTPStatusEvent;
import flash.events.IOErrorEvent;
import flash.events.SecurityErrorEvent;
import flash.events.TimerEvent;
import flash.net.URLLoader;
import flash.net.URLLoaderDataFormat;
import flash.net.URLRequest;
import flash.utils.ByteArray;
import flash.utils.Timer;

public class DataSegmentLoader extends SegmentLoader {
    private var _status:int = 0;
    private var _http:URLLoader;

    private var _countdown:int = 5; // five tries; otherwise error
    private var _waitTimer:Timer;

    public function DataSegmentLoader(context:DashContext, segment:Segment) {
        super(context, segment);

        _waitTimer = new Timer(1000); // 1 seconds
        _waitTimer.addEventListener(TimerEvent.TIMER, load2);
    }

    override public function load():void {
        load2();
    }

    private function load2(timerEvent:TimerEvent = null):void {
        _waitTimer.stop();

        _http = new URLLoader();

        _http.dataFormat = URLLoaderDataFormat.BINARY;

        _http.addEventListener(HTTPStatusEvent.HTTP_STATUS, onStatus);
        _http.addEventListener(Event.COMPLETE, onComplete);
        _http.addEventListener(ErrorEvent.ERROR, onError);
        _http.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError);
        _http.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
        _http.addEventListener(IOErrorEvent.IO_ERROR, onError);

        _context.bandwidthMonitor.appendListeners(_http);

        _context.console.debug("Loading segment, url='" + getUrl() + "'");

        _http.load(new URLRequest(getUrl()));
    }

    override public function close():void {
        _waitTimer.stop();
        _http.close();
    }

    private function onStatus(event:HTTPStatusEvent):void {
        _status = event.status;
    }

    private function onError(event:Event):void {
        _context.console.error("Connection was interrupted: " + event.toString());

        if (_countdown > 0) {
            _context.console.warn("Try again, countdown='" + _countdown + "'");
            _countdown--;
            _waitTimer.start();
            return;
        }

        _context.console.error("Exceed the maximum number of tries");
        dispatchEvent(_context.buildSegmentEvent(SegmentEvent.ERROR));
    }

    protected function getUrl():String {
        return DataSegment(_segment).url;
    }

    protected function onComplete(event:Event):void {
        _context.console.debug("Loaded segment, url='" + getUrl() + "', status='" + _status + "'");

        if (DataSegment(_segment).isRange && _status == 200) {
            _context.console.error("Partial content wasn't returned. Please make sure that range requests " +
                    "are handle properly on the server side: https://github.com/castlabs/dashas/wiki/htaccess");
            dispatchEvent(_context.buildSegmentEvent(SegmentEvent.ERROR));
            return;
        }

        var bytes:ByteArray = URLLoader(event.target).data;
        dispatchEvent(_context.buildSegmentEvent(SegmentEvent.LOADED, false, false, _segment, bytes));
    }
}
}
