/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash {
import com.castlabs.dash.events.ManifestEvent;
import com.castlabs.dash.events.StreamEvent;
import com.castlabs.dash.handlers.ManifestHandler;
import com.castlabs.dash.loaders.ManifestLoader;
import com.castlabs.dash.utils.SmoothMonitor;

import flash.net.NetConnection;
import flash.net.NetStream;

import org.osmf.events.MediaError;
import org.osmf.events.MediaErrorCodes;
import org.osmf.events.MediaErrorEvent;
import org.osmf.media.MediaResourceBase;
import org.osmf.media.URLResource;
import org.osmf.net.NetLoader;
import org.osmf.net.NetStreamLoadTrait;
import org.osmf.net.StreamingURLResource;
import org.osmf.traits.LoadState;

public class DashNetLoader extends NetLoader {
    private var _context:DashContext;

    public function DashNetLoader(context:DashContext) {
        super(null);
        _context = context;
    }

    override public function canHandleResource(resource:MediaResourceBase):Boolean {
        return true;
    }

    override protected function createNetStream(connection:NetConnection, resource:URLResource):NetStream {
        var netStream:NetStream = _context.buildDashNetStream(connection);

        var smoothMonitor:SmoothMonitor = _context.smoothMonitor;
        smoothMonitor.appendListeners(netStream);

        return netStream;
    }

    override protected function processFinishLoading(loadTrait:NetStreamLoadTrait):void {
        updateLoadTrait(loadTrait, LoadState.LOADING);

        var stream:DashNetStream = loadTrait.netStream as DashNetStream;
        stream.addEventListener(StreamEvent.READY, onReady);
        stream.addEventListener(StreamEvent.ERROR, onError);

        function onReady(event:StreamEvent):void {
            if (event.live && loadTrait.resource is StreamingURLResource) {
                StreamingURLResource(loadTrait.resource).streamType = "live";
            } else {
                var timeTrait:DashTimeTrait = _context.buildDashTimeTrait(stream, event.duration);
                loadTrait.setTrait(timeTrait);
                loadTrait.setTrait(_context.buildDashSeekTrait(timeTrait, loadTrait, stream));
            }

            updateLoadTrait(loadTrait, LoadState.READY);
        }

        function onError(event:StreamEvent):void {
            loadTrait.dispatchEvent(new MediaErrorEvent(MediaErrorEvent.MEDIA_ERROR, false, false,
                    new MediaError(MediaErrorCodes.MEDIA_LOAD_FAILED)));
        }

        var manifest:URLResource = loadTrait.resource as URLResource;
        loadManifest(loadTrait, manifest.url, stream);
    }

    private function loadManifest(loadTrait:NetStreamLoadTrait, url:String, stream:DashNetStream):void {
        var loader:ManifestLoader = _context.buildManifestLoader(url);

        loader.addEventListener(ManifestEvent.LOADED, onLoad);
        loader.addEventListener(ManifestEvent.ERROR, onError);

        function onLoad(event:ManifestEvent):void {
            _context.console.info("Creating manifest...");

            var manifest:ManifestHandler = _context.createManifestHandler(event.url, event.xml);
            _context.console.info("Created manifest, " + manifest.toString());

            stream.init();
        }

        function onError(event:ManifestEvent):void {
            loadTrait.dispatchEvent(new MediaErrorEvent(MediaErrorEvent.MEDIA_ERROR, false, false,
                    new MediaError(MediaErrorCodes.MEDIA_LOAD_FAILED)));
        }

        loader.load();
    }
}
}
