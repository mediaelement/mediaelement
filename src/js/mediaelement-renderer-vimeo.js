/**
 * Vimeo renderer
 *
 * Uses <iframe> approach and uses Vimeo API to manipulate it.
 * All Vimeo calls return a Promise so this renderer accounts for that
 * to update all the necessary values to interact with MediaElement player.
 * Note: IE8 implements ECMAScript 3 that does not allow bare keywords in dot notation;
 * that's why instead of using .catch ['catch'] is being used.
 * @see https://github.com/vimeo/player.js
 *
 */
(function(win, doc, mejs, undefined) {

    /**
     * Register Vimeo type based on URL structure
     *
     */
    mejs.Utils.typeChecks.push(function(url) {

        url = url.toLowerCase();

        if (url.indexOf('vimeo') > -1) {
            return 'video/vimeo';
        } else {
            return null;
        }
    });

    var vimeoApi = {

        /**
         * @type {Boolean}
         */
        isIframeStarted: false,
        /**
         * @type {Boolean}
         */
        isIframeLoaded: false,
        /**
         * @type {Array}
         */
        iframeQueue: [],

        /**
         * Create a queue to prepare the creation of <iframe>
         *
         * @param {Object} settings - an object with settings needed to create <iframe>
         */
        enqueueIframe: function(settings) {

            if (this.isLoaded) {
                this.createIframe(settings);
            } else {
                this.loadIframeApi();
                this.iframeQueue.push(settings);
            }
        },

        /**
         * Load Vimeo API's script on the header of the document
         *
         */
        loadIframeApi: function() {

            if (!this.isIframeStarted) {

                var
                    script = doc.createElement('script'),
                    firstScriptTag = doc.getElementsByTagName('script')[0],
                    done = false;

                script.src = 'https://player.vimeo.com/api/player.js';

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function() {
                    if (!done && (!this.readyState || typeof this.readyState === 'undefined' ||
                        this.readyState === "loaded" || this.readyState === "complete") ) {
                        done = true;
                        vimeoApi.iFrameReady();
                        script.onload = script.onreadystatechange = null;
                    }
                };
                firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
                this.isIframeStarted = true;
            }
        },

        /**
         * Process queue of Vimeo <iframe> element creation
         *
         */
        iFrameReady: function() {

            this.isLoaded = true;
            this.isIframeLoaded = true;

            while (this.iframeQueue.length > 0) {
                var settings = this.iframeQueue.pop();
                this.createIframe(settings);
            }
        },

        /**
         * Create a new instance of Vimeo API player and trigger a custom event to initialize it
         *
         * @param {Object} settings - an object with settings needed to create <iframe>
         */
        createIframe: function(settings) {
            var player = new Vimeo.Player(settings.iframe);
            win['__ready__' + settings.id](player);
        },

        /**
         * Extract numeric value from Vimeo to be loaded through API
         * Valid URL format(s):
         *  - https://player.vimeo.com/video/59777392
         *
         * @param {String} url - Vimeo full URL to grab the number Id of the source
         * @return {int}
         */
        getVimeoId: function(url) {
            if (url == undefined || url == null) {
                return null;
            }

            var parts = url.split('?');

            url = parts[0];

            return parseInt(url.substring(url.lastIndexOf('/') + 1));
        },

        /**
         * Generate custom errors for Vimeo based on the API specifications
         *
         * @see https://github.com/vimeo/player.js#error
         * @param {Object} error
         */
        errorHandler: function(error) {
            switch (error.name) {
                case 'TypeError':
                    // the id was not a number
                    break;

                case 'PasswordError':
                    // the video is password-protected and the viewer needs to enter the
                    // password first
                    break;

                case 'PrivacyError':
                    // the video is password-protected or private
                    break;

                case 'RangeError':
                    // the time was less than 0 or greater than the video’s duration
                    break;

                case 'InvalidTrackLanguageError':
                    // no track was available with the specified language
                    break;

                case 'InvalidTrackError':
                    // no track was available with the specified language and kind
                    break;

                default:
                    // some other error occurred
                    break;
            }
        }
    };

    /*
     * Register Vimeo event globally
     *
     */
    win['onVimeoPlayerAPIReady'] = function() {
        console.log('onVimeoPlayerAPIReady');
        vimeoApi.iFrameReady();
    };

    var vimeoIframeRenderer = {

        name: 'vimeo_iframe',

        options: {
            prefix: 'vimeo_iframe'
        },
        /**
         * Determine if a specific element type can be played with this render
         *
         * @param {String} type
         * @return {Boolean}
         */
        canPlayType: function(type) {
            var mediaTypes = ['video/vimeo', 'video/x-vimeo'];

            return mediaTypes.indexOf(type) > -1;
        },
        /**
         * Create the player instance and add all native events/methods/properties as possible
         *
         * @param {MediaElement} mediaElement Instance of mejs.MediaElement already created
         * @param {Array} options All the player configuration options passed through constructor
         * @param {Array} mediaFiles List of sources with format: {src: url, type: x/y-z}
         * @return {Object}
         */
        create: function (mediaElement, options, mediaFiles) {

            // exposed object
            var
                apiStack = [],
                vimeoApiReady = false,
                vimeo = {},
                vimeoPlayer = null,
                paused = true,
                volume = 0,
                currentTime = 0,
                bufferedTime = 0,
                ended = false,
                duration = 0,
                url = "",
                i,
                il;

            vimeo.options = options;
            vimeo.id = mediaElement.id + '_' + options.prefix;
            vimeo.mediaElement = mediaElement;

            // wrappers for get/set
            var props = mejs.html5media.properties;
            for (i=0, il=props.length; i<il; i++) {

                // wrap in function to retain scope
                (function(propName) {

                    var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                    vimeo['get' + capName] = function() {
                        if (vimeoPlayer !== null) {
                            var value = null;

                            switch (propName) {
                                case 'currentTime':
                                    return currentTime;

                                case 'duration':
                                    return duration;

                                case 'volume':
                                    return volume;

                                case 'paused':
                                    return paused;

                                case 'ended':
                                    return ended;

                                case 'src':
                                    return url;

                                case 'buffered':
                                    return {
                                        start: function() {
                                            return 0;
                                        },
                                        end: function () {
                                            return bufferedTime * duration;
                                        },
                                        length: 1
                                    };
                            }

                            return value;
                        } else {
                            return null;
                        }
                    };

                    vimeo['set' + capName] = function(value) {

                        if (vimeoPlayer !== null) {

                            // do something
                            switch (propName) {

                                case 'src':
                                    var url = typeof value === 'string' ? value : value[0].src,
                                        videoId = vimeoApi.getVimeoId(url);

                                    vimeoPlayer.loadVideo(videoId).then(function() {
                                        if (mediaElement.getAttribute('autoplay')) {
                                            vimeoPlayer.play();
                                        }

                                    })['catch'](function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;

                                case 'currentTime':
                                    vimeoPlayer.setCurrentTime(value).then(function() {
                                        currentTime = value;
                                        mediaElement.dispatchEvent({type:'timeupdate'});
                                    })['catch'](function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;

                                case 'volume':
                                    vimeoPlayer.setVolume(value).then(function() {
                                        mediaElement.dispatchEvent({type:'volumechange'});
                                    })['catch'](function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;

                                case 'loop':
                                    vimeoPlayer.setLoop(value)['catch'](function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;
                                default:
                                    console.log('vimeo ' + id, propName, 'UNSUPPORTED property');
                            }

                        } else {
                            // store for after "READY" event fires
                            apiStack.push({type: 'set', propName: propName, value: value});
                        }
                    }

                })(props[i]);
            }

            // add wrappers for native methods
            var methods = mejs.html5media.methods;
            for (i=0, il=methods.length; i<il; i++) {
                (function(methodName) {

                    // run the method on the Soundcloud API
                    vimeo[methodName] = function() {

                        if (vimeoPlayer !== null) {

                            // DO method
                            switch (methodName) {
                                case 'play':
                                    return vimeoPlayer.play();
                                case 'pause':
                                    return vimeoPlayer.pause();
                                case 'load':
                                    return null;

                            }

                        } else {
                            apiStack.push({type: 'call', methodName: methodName});
                        }
                    };

                })(methods[i]);
            }

            // Initial method to register all Vimeo events when initializing <iframe>
            win['__ready__' + vimeo.id] = function(_vimeoPlayer) {

                vimeoApiReady = true;
                mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

                console.log('vimeo ready', vimeoPlayer);

                // do call stack
                for (i=0, il=apiStack.length; i<il; i++) {

                    var stackItem = apiStack[i];

                    if (stackItem.type === 'set') {
                        var propName = stackItem.propName,
                            capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                        vimeo['set' + capName](stackItem.value);
                    } else if (stackItem.type === 'call') {
                        vimeo[stackItem.methodName]();
                    }
                }

                var vimeoIframe = doc.getElementById(vimeo.id), events;

                // a few more events
                events = ['mouseover','mouseout'];
                for (var j in events) {
                    var eventName = events[j];
                    mejs.addEvent(vimeoIframe, eventName, function(e) {
                        var event = mejs.Utils.createEvent(e.type, vimeo);
                        mediaElement.dispatchEvent(event);
                    });
                }

                // Vimeo events
                vimeoPlayer.on('loaded', function() {

                    vimeoPlayer.getDuration().then(function(loadProgress) {

                        if (duration > 0) {
                            bufferedTime = duration * loadProgress;
                        }

                        var event = mejs.Utils.createEvent('timeupdate', vimeo);
                        mediaElement.dispatchEvent(event);

                    })['catch'](function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    vimeoPlayer.getDuration().then(function(seconds) {

                        duration = seconds;

                        var event = mejs.Utils.createEvent('loadedmetadata', vimeo);
                        mediaElement.dispatchEvent(event);
                    })['catch'](function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    vimeoPlayer.getVideoUrl().then(function(_url) {
                        url = _url;
                    });
                });

                vimeoPlayer.on('progress', function() {

                    paused = vimeo.mediaElement.getPaused();

                    vimeoPlayer.getDuration().then(function(loadProgress) {

                        duration = loadProgress;

                        if (duration > 0) {
                            bufferedTime = duration * loadProgress;
                        }

                    })['catch'](function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    var event = mejs.Utils.createEvent('timeupdate', vimeo);
                    mediaElement.dispatchEvent(event);
                });
                vimeoPlayer.on('timeupdate', function() {

                    paused = vimeo.mediaElement.getPaused();
                    ended = false;

                    vimeoPlayer.getCurrentTime().then(function(seconds) {
                        currentTime = seconds;
                    });

                    var event = mejs.Utils.createEvent('timeupdate', vimeo);
                    mediaElement.dispatchEvent(event);

                });
                vimeoPlayer.on('play', function() {
                    paused = false;
                    ended = false;

                    vimeoPlayer.play()['catch'](function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    event = mejs.Utils.createEvent('play', vimeo);
                    mediaElement.dispatchEvent(event);
                });
                vimeoPlayer.on('pause', function() {
                    paused = true;
                    ended = false;

                    vimeoPlayer.pause()['catch'](function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    event = mejs.Utils.createEvent('pause', vimeo);
                    mediaElement.dispatchEvent(event);
                });
                vimeoPlayer.on('ended', function() {
                    paused = false;
                    ended = true;

                    var event = mejs.Utils.createEvent('ended', vimeo);
                    mediaElement.dispatchEvent(event);
                });

                // give initial events
                events = ['rendererready','loadeddata','loadedmetadata','canplay'];

                for (i=0, il=events.length; i<il; i++) {
                    var event = mejs.Utils.createEvent(events[i], vimeo);
                    mediaElement.dispatchEvent(event);
                }
            };

            var
                height = mediaElement.originalNode.height,
                width = mediaElement.originalNode.width,
                vimeoContainer = doc.createElement('iframe')
                ;

            // Create Vimeo <iframe> markup
            vimeoContainer.setAttribute('id', vimeo.id);
            vimeoContainer.setAttribute('width', width);
            vimeoContainer.setAttribute('height', height);
            vimeoContainer.setAttribute('frameBorder', '0');
            vimeoContainer.setAttribute('src', mediaFiles[0].src);
            vimeoContainer.setAttribute('webkitallowfullscreen', '');
            vimeoContainer.setAttribute('mozallowfullscreen', '');
            vimeoContainer.setAttribute('allowfullscreen', '');

            mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
            mediaElement.originalNode.style.display = 'none';

            vimeoApi.enqueueIframe({
                iframe: vimeoContainer,
                id: vimeo.id
            });

            vimeo.hide = function() {
                vimeo.pause();
                if (vimeoPlayer) {
                    vimeoContainer.style.display = 'none';
                }
            };
            vimeo.show = function() {
                if (vimeoPlayer) {
                    vimeoContainer.style.display = '';
                }
            };

            return vimeo;
        }

    };

    mejs.Renderers.add(vimeoIframeRenderer);

})(window, document, window.mejs || {});