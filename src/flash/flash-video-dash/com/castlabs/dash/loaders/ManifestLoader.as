/*
 * Copyright (c) 2014 castLabs GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package com.castlabs.dash.loaders {
import com.castlabs.dash.DashContext;
import com.castlabs.dash.events.ManifestEvent;

import flash.events.AsyncErrorEvent;
import flash.events.ErrorEvent;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IOErrorEvent;
import flash.events.SecurityErrorEvent;
import flash.net.URLLoader;
import flash.net.URLLoaderDataFormat;
import flash.net.URLRequest;

public class ManifestLoader extends EventDispatcher {
    private var _context:DashContext;
    private var _url:String;

    public function ManifestLoader(context:DashContext, url:String) {
        _context = context;
        _url = url;
    }

    public function load():void {
        var http:URLLoader = new URLLoader();

        http.dataFormat = URLLoaderDataFormat.TEXT;

        http.addEventListener(Event.COMPLETE, onComplete);
        http.addEventListener(ErrorEvent.ERROR, onError);
        http.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onError);
        http.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
        http.addEventListener(IOErrorEvent.IO_ERROR, onError);

        _context.console.debug("Loading manifest, url='" + _url + "'");

        http.load(new URLRequest(_url));
    }

    private function onError(event:Event):void {
        _context.console.error("Connection was interrupted: " + event.toString());
        dispatchEvent(_context.buildManifestEvent(ManifestEvent.ERROR));
    }

    private function onComplete(event:Event):void {
        _context.console.debug("Loaded manifest, url='" + _url + "'");

        var response:String = URLLoader(event.target).data;
        var xml:XML = removeNamespacesAndBuildXml(response);
        dispatchEvent(_context.buildManifestEvent(ManifestEvent.LOADED, false, false, _url, xml));
    }

    protected function removeNamespacesAndBuildXml(response:String):XML {

        // define the regex pattern to remove the namespaces from the string
        var xmlnsPattern:RegExp = new RegExp("(xmlns|xsi)[^\"]*\"[^\"]*\"", "gi");

        // remove the namespaces from the string representation of the XML
        var responseWithRemovedNamespaces:String = response.replace(xmlnsPattern, "");

        return new XML(responseWithRemovedNamespaces);
    }
}
}
