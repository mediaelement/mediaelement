/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.utils {
import flash.events.TimerEvent;
import flash.external.ExternalInterface;
import flash.utils.Timer;

public class Console {
    private static const ERROR:String = "error";
    private static const WARN:String = "warn";
    private static const INFO:String = "info";
    private static const DEBUG:String = "debug";

    private var enabled:Boolean = false;
    private var events:Array = [];

    public function Console() {
    }

    public function enable():void {
        enabled = true;

        var timer:Timer = new Timer(2000); // 2 second
        timer.addEventListener(TimerEvent.TIMER, send);
        timer.start();
    }

    private function send(event:TimerEvent):void {
        if (events.length == 0) {
            return;
        }

        ExternalInterface.call("handleEvents", events);

        while (events.length > 0) {
            events.pop();
        }
    }

    public function error(message:String):void {
        log(ERROR, message);
    }

    public function warn(message:String):void {
        log(WARN, message);
    }

    public function info(message:String):void {
        log(INFO, message);
    }

    public function debug(message:String):void {
        log(DEBUG, message);
    }

    public function logAndBuildError(message:String):Error {
        log(ERROR, message);
        return new Error(message);
    }

    public function log(level:String, message:String):void {
        if (!enabled) {
            return;
        }

        trace(message);

        events.push({
            id: "log",
            level: level,
            message: message
        });
    }

    public function appendRealUserBandwidth(bandwidth:Number):void {
        appendUserBandwidth("real", bandwidth);
    }

    public function appendAverageUserBandwidth(bandwidth:Number):void {
        appendUserBandwidth("average", bandwidth);
    }

    public function appendUserBandwidth(type:String, bandwidth:Number):void {
        if (!enabled) {
            return;
        }

        events.push({
            id: "appendUserBandwidth",
            dataset: type,
            bandwidth: bandwidth
        });
    }

    public function appendVideoBandwidth(bandwidth:Number):void {
        appendMediaBandwidth("video", bandwidth);
    }

    public function appendAudioBandwidth(bandwidth:Number):void {
        appendMediaBandwidth("audio", bandwidth);
    }

    public function appendMediaBandwidth(type:String, bandwidth:Number):void {
        if (!enabled) {
            return;
        }

        events.push({
            id: "appendMediaBandwidth",
            dataset: type,
            bandwidth: bandwidth
        });
    }
}
}
