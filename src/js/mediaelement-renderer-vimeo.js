(function(win, doc, mejs, undef) {

    /**
     * Register Vimeo type
     */
    mejs.Utils.typeChecks.push(function(url) {

        url = url.toLowerCase();

        if (url.indexOf('vimeo') > -1) {
            return 'video/x-vimeo';
        } else {
            return null;
        }
    });

    var vimeoApi = {

        /**
         * @var {boolean}
         */
        isIframeStarted: false,
        /**
         * @var {boolean}
         */
        isIframeLoaded: false,
        /**
         * @var {Array}
         */
        iframeQueue: [],

        /**
         *
         * @param {Object} vimeo
         */
        enqueueIframe: function(vimeo) {

            if (this.isLoaded) {
                this.createIframe(vimeo);
            } else {
                this.loadIframeApi();
                this.iframeQueue.push(vimeo);
            }
        },

        /**
         *
         */
        loadIframeApi: function() {
            if (!this.isIframeStarted) {

                var head = doc.getElementsByTagName("head")[0] || doc.documentElement,
                    script = doc.createElement("script"),
                    done = false;

                script.src = 'https://player.vimeo.com/api/player.js';

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function() {
                    if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                        done = true;
                        vimeoApi.iFrameReady();

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }
                    }
                };
                head.appendChild(script);
                this.isIframeStarted = true;
            }
        },

        /**
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
         *
         * @param {Object} settings
         */
        createIframe: function(settings) {
            var player = new Vimeo.Player(settings.iframe);
            window['__ready__' + settings.id](player);
        },

        /**
         *
         * @param {String} url
         * @return int
         */
        getVimeoId: function(url) {
            // https://player.vimeo.com/video/59777392
            if (url == undefined || url == null) {
                return null;
            }

            var parts = url.split('?');

            url = parts[0];

            return parseInt(url.substring(url.lastIndexOf('/') + 1));
        },

        /**
         *
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

    window['onVimeoPlayerAPIReady'] = function() {
        vimeoApi.iFrameReady();
    };
    var vimeoIframeRenderer = {

        name: 'vimeo_iframe',

        options: {
            prefix: 'vimeo_iframe'
        },
        /**
         *
         * @param {String} type
         * @return {boolean}
         */
        canPlayType: function(type) {
            var mediaTypes = ['video/vimeo', 'video/x-vimeo'];

            return mediaTypes.indexOf(type) > -1;
        },
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

                    // add to flash state that we will store

                    var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                    vimeo['get' + capName] = function() {
                        if (vimeoPlayer !== null) {
                            var value = null;

                            switch (propName) {
                                case 'currentTime':
                                    currentTime = vimeoPlayer.getCurrentTime();
                                    return currentTime;

                                case 'duration':
                                    duration = vimeoPlayer.getDuration();
                                    return duration;

                                case 'volume':
                                    volume = vimeoPlayer.getVolume();
                                    return volume;

                                case 'paused':
                                    paused = vimeoPlayer.getPaused();
                                    return paused;

                                case 'ended':
                                    ended = vimeoPlayer.getEnded();
                                    return ended;

                                case 'src':
                                    return vimeoPlayer.getVideoUrl();

                                case 'loop':
                                    return vimeoPlayer.getLoop();

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
                        //console.log('[' + options.prefix + ' set]: ' + propName + ' = ' + value, t.flashApi);

                        if (vimeoPlayer !== null) {

                            // do something
                            switch (propName) {

                                case 'src':
                                    var url = typeof value == 'string' ? value : value[0].src,
                                        videoId = vimeoApi.getVimeoId(url);

                                    vimeoPlayer.loadVideo(videoId).then(function() {

                                        if (mediaElement.getAttribute('autoplay')) {
                                            vimeoPlayer.play();
                                        }

                                    }).catch(function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;

                                case 'currentTime':
                                    vimeoPlayer.setCurrentTime(value).catch(function(error) {
                                        vimeoApi.errorHandler(error);
                                    });;
                                    break;

                                case 'volume':
                                    vimeoPlayer.setVolume(value).then(function() {
                                        mediaElement.dispatchEvent({type:'volumechange'});
                                    }).catch(function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
                                    break;

                                case 'loop':
                                    vimeoPlayer.setLoop(value).catch(function(error) {
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

                    // run the method on the native HTMLMediaElement
                    vimeo[methodName] = function() {
                        if (vimeoPlayer !== null && vimeoPlayer[methodName]()) {
                            return vimeoPlayer[methodName]().catch(function(error) {
                                vimeoApi.errorHandler(error);
                            });
                        } else {
                            apiStack.push({type: 'call', methodName: methodName});
                        }
                    };

                })(methods[i]);
            }

            win['__ready__' + vimeo.id] = function(_vimeoPlayer) {

                vimeoApiReady = true;
                mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

                console.log('Vimeo ready', vimeo.id, vimeoPlayer);

                // do call stack
                for (i=0, il=apiStack.length; i<il; i++) {

                    var stackItem = apiStack[i];

                    console.log('Vimeo stack', stackItem.type);

                    if (stackItem.type === 'set') {
                        var propName = stackItem.propName,
                            capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                        vimeo['set' + capName](stackItem.value);
                    } else if (stackItem.type === 'call') {
                        vimeo[stackItem.methodName]();
                    }
                }

                vimeoPlayer.on('loaded', function() {
                    vimeoPlayer.getDuration().then(function(duration) {
                        duration = _duration/1000;

                        var event = mejs.Utils.createEvent('loadedmetadata', vimeo);
                        mediaElement.dispatchEvent(event);

                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });
                vimeoPlayer.on('progress', function() {
                    vimeoPlayer.getDuration().then(function(loadProgress) {
                        if (duration > 0) {
                            bufferedTime = duration * loadProgress;

                            var event = mejs.Utils.createEvent('progress', vimeo);
                            mediaElement.dispatchEvent(event);
                        }
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                    vimeoPlayer.getDuration().then(function(_duration) {
                        duration = _duration;

                        var event = mejs.Utils.createEvent('loadedmetadata', vimeo);
                        mediaElement.dispatchEvent(event);
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });
                vimeoPlayer.on('play', function() {
                    vimeoPlayer.play().then(function() {

                        paused = false;
                        ended = false;

                        event = mejs.Utils.createEvent(eventName, vimeo);
                        mediaElement.dispatchEvent(event);
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });
                vimeoPlayer.on('pause', function() {
                    vimeoPlayer.pause().then(function() {

                        paused = true;

                        event = mejs.Utils.createEvent(eventName, vimeo);
                        mediaElement.dispatchEvent(event);
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });

                // give initial events
                var initEvents = ['rendererready','loadeddata','loadedmetadata','canplay'];

                for (i=0, il=initEvents.length; i<il; i++) {
                    var event = mejs.Utils.createEvent(initEvents[i], vimeo);
                    mediaElement.dispatchEvent(event);
                }
            };

            // CREATE Vimeo
            var
                height = mediaElement.originalNode.height,
                width = mediaElement.originalNode.width,
                vimeoContainer = doc.createElement('iframe')
                ;

            vimeoContainer.id = vimeo.id;
            vimeoContainer.width = width;
            vimeoContainer.height = height;
            vimeoContainer.frameBorder = 0;
            vimeoContainer.src = mediaFiles[0].src;
            mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
            mediaElement.originalNode.style.display = 'none';

            // send it off for async loading and creation
            vimeoApi.enqueueIframe({
                iframe: vimeoContainer,
                id: vimeo.id
            });

            vimeo.hide = function() {
                vimeo.pause();
                if (vimeoPlayer) {
                    vimeoPlayer.style.display = 'none';
                }
            };
            vimeo.show = function() {
                if (vimeoPlayer) {
                    vimeoPlayer.style.display = '';
                }
            };

            return vimeo;
        }

    };

    mejs.Renderers.add(vimeoIframeRenderer);

})(window, document, window.mejs || {});