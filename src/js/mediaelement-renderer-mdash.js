/**
 * Native M-Dash renderer
 *
 * Uses dash.js, a reference client implementation for the playback of MPEG DASH via Javascript and compliant browsers.
 * It relies on HTML5 video and MediaSource Extensions for playback.
 * This renderer integrates new events associated with mpd files.
 * @see https://github.com/Dash-Industry-Forum/dash.js
 *
 */
(function(win, doc, mejs, undefined) {

    if (mejs.MediaFeatures.hasMse) {

        /**
         * Register Native M-Dash type based on URL structure
         *
         */
        mejs.Utils.typeChecks.push(function (url) {

            url = url.toLowerCase();

            if (url.indexOf('mpd') > -1) {
                return 'application/dash+xml';
            } else {
                return null;
            }
        });

        var NativeDash = {
            /**
             * @var {boolean}
             */
            isMediaLoaded: false,
            /**
             * @var {Array}
             */
            creationQueue: [],

            /**
             * Create a queue to prepare the loading of an HLS source
             * @param {Object} settings - an object with settings needed to load an HLS player instance
             */
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

                    script.src = '//cdn.dashjs.org/latest/dash.all.min.js';

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState || typeof this.readyState === 'undefined' ||
                            this.readyState === 'loaded' || this.readyState === 'complete')) {
                            done = true;
                            NativeDash.mediaReady();
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
                var player = dashjs.MediaPlayer().create();
                player.getDebug().setLogToBrowserConsole(false);
                win['__ready__' + settings.id](player);
            }
        };

        var DashNativeRenderer = {
            name: 'native_mdash',

            options: {
                prefix: 'native_mdash',
                dashVars: {}
            },

            canPlayType: function (type) {

                var mediaTypes = ['application/dash+xml'];
                return mediaTypes.indexOf(type) > -1;
            },

            create: function (mediaElement, options, mediaFiles) {

                var
                    node = null,
                    originalNode = mediaElement.originalNode,
                    i,
                    il,
                    id = mediaElement.id + '_' + options.prefix,
                    dashPlayer,
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
                            if (dashPlayer !== null) {
                                return node[propName];
                            } else {
                                return null;
                            }
                        };

                        node['set' + capName] = function (value) {
                            if (dashPlayer !== null) {
                                if (propName === 'src') {

                                    dashPlayer.attachSource(value);

                                    if (node.getAttribute('autoplay')) {
                                        node.play();
                                    }
                                }

                                node[propName] = value;
                            } else {
                                // store for after "READY" event fires
                                stack.push({type: 'set', propName: propName, value: value});
                            }
                        };

                    })(props[i]);
                }

                // Initial method to register all M-Dash events
                win['__ready__' + id] = function(_dashPlayer) {

                    mediaElement.dashPlayer = dashPlayer = _dashPlayer;

                    console.log('Native M-Dash ready', dashPlayer);

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

                                console.log(node);

                                dashPlayer.initialize(node, node.src, false);
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

                    // Custom Dash events
                };

                var filteredAttributes = ['id', 'src', 'style'];
                for (var j = 0, total = originalNode.attributes.length; j < total; j++) {
                    var attribute = originalNode.attributes[j];
                    if (attribute.specified && filteredAttributes.indexOf(attribute.name) === -1) {
                        node.setAttribute(attribute.name, attribute.value);
                    }
                }

                node.setAttribute('id', id);
                node.setAttribute('src', mediaFiles[0].src);
                node.className = '';

                originalNode.parentNode.insertBefore(node, originalNode);
                originalNode.removeAttribute('autoplay');
                originalNode.style.display = 'none';

                NativeDash.prepareSettings({
                    options: options.dashVars,
                    id: id
                });

                // HELPER METHODS
                node.setSize = function (width, height) {
                    node.style.width = width + 'px';
                    node.style.height = height + 'px';

                    return node;
                };

                node.hide = function () {
                    node.pause();
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

        mejs.Renderers.add(DashNativeRenderer);
    }

})(window, document, window.mejs || {});