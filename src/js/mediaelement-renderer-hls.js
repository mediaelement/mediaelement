(function(win, doc, mejs, undef) {

    if (mejs.MediaFeatures.hasMse) {

        /**
         * Register Native HLS type based on URL structure
         *
         */
        mejs.Utils.typeChecks.push(function (url) {

            url = url.toLowerCase();

            if (url.indexOf('m3u8') > -1) {
                return 'application/x-mpegURL';
            } else {
                return null;
            }
        });

        var NativeHls = {
            /**
             * @var {boolean}
             */
            isScriptLoaded: false,
            /**
             * @var {Array}
             */
            creationQueue: [],

            prepareSettings: function(settings) {
                if (this.isLoaded) {
                    this.createInstance(settings);
                } else {
                    this.loadScript();
                    this.creationQueue.push(settings);
                }
            },

            loadScript: function() {
                if (!this.isScriptLoaded) {

                    var
                        script = doc.createElement('script'),
                        firstScriptTag = doc.getElementsByTagName('script')[0],
                        done = false;

                    script.src = '//cdn.jsdelivr.net/hls.js/latest/hls.min.js';

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState || typeof this.readyState === 'undefined' ||
                            this.readyState === 'loaded' || this.readyState === 'complete')) {
                            done = true;
                            NativeHls.mediaReady();
                            script.onload = script.onreadystatechange = null;
                        }
                    };

                    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
                    this.isScriptLoaded = true;
                }
            },

            mediaReady: function() {

                this.isLoaded = true;
                this.isScriptLoaded = true;

                while (this.creationQueue.length > 0) {
                    var settings = this.creationQueue.pop();
                    this.createInstance(settings);
                }
            },

            createInstance: function (settings) {
                var player = new Hls(settings.options);
                win['__ready__' + settings.id](player);
            }
        };

        var HlsNativeRenderer = {
            name: 'native_hls',

            options: {
                prefix: 'native_hls',
                hlsVars: {}
            },

            canPlayType: function (type) {

                var mediaTypes = ['application/x-mpegURL', 'vnd.apple.mpegURL', 'audio/mpegURL', 'audio/hls', 'video/hls'];
                return mediaTypes.indexOf(type) > -1;
            },

            create: function (mediaElement, options, mediaFiles) {

                var
                    node = null,
                    originalNode = mediaElement.originalNode,
                    i,
                    il,
                    id = mediaElement.id + '_' + options.prefix,
                    hlsPlayer,
                    stack = {}
                    ;

                node = originalNode.cloneNode(true);

                // WRAPPERS for PROPs
                var props = mejs.html5media.properties;
                for (i = 0, il = props.length; i < il; i++) {

                    // wrap in function to retain scope
                    (function (propName) {
                        var capName = propName.substring(0, 1).toUpperCase() + propName.substring(1);

                        node['get' + capName] = function () {
                            if (hlsPlayer !== null) {
                                return node[propName];
                            } else {
                                return null;
                            }
                        };

                        node['set' + capName] = function (value) {
                            if (hlsPlayer !== null) {
                                if (propName === 'src') {

                                    hlsPlayer.detachMedia();
                                    hlsPlayer.attachMedia(node);

                                    hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function () {
                                        hlsPlayer.loadSource(mediaFiles[0].src);

                                        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
                                            if (node.getAttribute('autoplay')) {
                                                node.play();
                                            }
                                        });
                                    });
                                }

                                node[propName] = value;
                            } else {
                                // store for after "READY" event fires
                                stack.push({type: 'set', propName: propName, value: value});
                            }
                        };

                    })(props[i]);
                }

                // Initial method to register all HLS events
                win['__ready__' + id] = function(_hlsPlayer) {

                    mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;

                    console.log('Native HLS ready', hlsPlayer);

                    // do call stack
                    for (i=0, il=stack.length; i<il; i++) {

                        var stackItem = stack[i];

                        if (stackItem.type === 'set') {
                            var propName = stackItem.propName,
                                capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                            node['set' + capName](stackItem.value);
                        } else if (stackItem.type === 'call') {
                            node[stackItem.methodName]();
                        }
                    }

                    // BUBBLE EVENTS
                    var events = mejs.html5media.events;

                    events = events.concat(['click', 'mouseover', 'mouseout']);

                    for (i = 0, il = events.length; i < il; i++) {
                        (function (eventName) {

                            if (eventName === 'loadedmetadata') {

                                hlsPlayer.attachMedia(node);
                                hlsPlayer.on(Hls.Events.MEDIA_ATTACHED, function() {
                                    hlsPlayer.loadSource(mediaFiles[0].src);
                                });
                            }

                            node.addEventListener(eventName, function (e) {
                                // copy event

                                var event = doc.createEvent('HTMLEvents');
                                event.initEvent(e.type, e.bubbles, e.cancelable);
                                event.srcElement = e.srcElement;
                                event.target = e.srcElement;

                                mediaElement.dispatchEvent(event);
                            });

                        })(events[i]);
                    }
                };

                node.setAttribute('id', id);
                node.setAttribute('src', mediaFiles[0].src);

                originalNode.parentNode.insertBefore(node, originalNode);
                originalNode.removeAttribute('autoplay');
                originalNode.style.display = 'none';

                NativeHls.prepareSettings({
                    options: options.hlsVars,
                    id: id
                });

                // HELPER METHODS
                node.setSize = function (width, height) {
                    node.style.width = width + 'px';
                    node.style.height = height + 'px';

                    return node;
                };

                node.hide = function () {
                    node.style.display = 'none';
                    return node;
                };

                node.show = function () {
                    node.style.display = '';
                    return node;
                };

                var event = mejs.Utils.createEvent('rendererready', node);
                mediaElement.dispatchEvent(event);

                return node;
            }
        };

        mejs.Renderers.add(HlsNativeRenderer);
    }

})(window, document, window.mejs || {});