(function(win, doc, shimi, undef) {

    if (mejs.MediaFeatures.canSupportHls) {

        // register native HLS type
        mejs.Utils.typeChecks.push(function (url) {

            url = new String(url).toLowerCase();

            if (url.indexOf('.m3u8') > -1) {
                return 'application/x-mpegURL';
            } else {
                return null;
            }
        });

        var HlsNativeRenderer = {
            name: 'native_hls',

            options: {
                prefix: 'native_hls'
            },

            canPlayType: function (type) {

                var mediaTypes = ['application/x-mpegURL'];

                return mejs.MediaFeatures.canSupportHls && mediaTypes.indexOf(type) > -1;
            },

            create: function (mediaElement, options, mediaFiles) {

                if (typeof options.hlsDebug !== 'undefined') {
                    options.debug = options.hlsDebug;
                }

                var hls = {}, node = mediaElement.originalNode, player = null;
                hls.options = options;
                hls.id = mediaElement.id + '_' + hls.options.prefix;
                
                hls.loadSrc = function (filename) {

                    player = new Hls(options);
                    player.attachMedia(node);

                    player.on(Hls.Events.MEDIA_ATTACHED, function() {
                        player.loadSource(filename);

                        player.on(Hls.Events.MANIFEST_PARSED, function() {
                            node.play();
                        });
                    });
                };

                if (mediaFiles && mediaFiles.length > 0) {
                    hls.loadSrc(mediaFiles[0].src);
                }

                // mediaElements for get/set
                var props = mejs.html5media.properties;
                for (var i=0, il=props.length; i<il; i++) {

                    // wrap in function to retain scope
                    (function(propName) {
                        var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                        hls['get' + capName] = function() {
                            return node[propName];
                        };

                        hls['set' + capName] = function(value) {
                            node[propName] = value;
                        };

                    })(props[i]);
                }

                // add wrappers for native methods
                var methods = mejs.html5media.methods;
                methods.push('stop');
                for (var i=0, il=methods.length; i<il; i++) {
                    (function(methodName) {

                        hls[methodName] = function() {
                            if (methodName === 'stop') {
                                return player.stopLoad();
                            }

                            return node[methodName](arguments);
                        };

                    })(methods[i]);
                }

                var events = mejs.html5media.events, hlsEvents = Hls.Events;
                events = events.concat(['click','mouseover','mouseout']);

                for (var i=0, il=events.length; i<il; i++) {
                    (function(eventName) {

                        switch (eventName) {
                            case 'loadedmetadata':
                                player.trigger(hlsEvents.MEDIA_ATTACHED);
                                break;
                            case 'loadeddata':
                                player.trigger(hlsEvents.MANIFEST_PARSED);
                                break;
                        }

                    })(events[i]);
                }

                // Object.keys(hlsEvents).forEach(function (key) {
                //     var etype = hlsEvents[key];
                //
                //     player.on(etype, function (e, data) {
                //         var event = new Event(e, { bubbles: false, cancelable: false });
                //         mediaElement.dispatchEvent(event);
                //     });
                // });

                hls.hide = function() {};
                hls.show = function() {};

                return hls;
            }
        };

        mejs.Renderers.add(HlsNativeRenderer);
    }

})(window, document, window.mejs || {});