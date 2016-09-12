(function(win, doc, mejs, undef) {

    /**
     * Register Vimeo type based on URL structure
     */
    mejs.Utils.typeChecks.push(function(url) {

        url = new String(url).toLowerCase();

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
                var tag = document.createElement('script');
                tag.src = "//player.vimeo.com/api/player.js";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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

    // Register Vimeo event globally
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
                                    vimeoPlayer.getVideoUrl().then(function(url) {
                                        return url;
                                    });
                                    break;
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
                                    vimeoPlayer.setCurrentTime(value).then(function() {
                                        currentTime = value;
                                        mediaElement.dispatchEvent({type:'timeupdate'});
                                    }).catch(function(error) {
                                        vimeoApi.errorHandler(error);
                                    });
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

            win['__ready__' + vimeo.id] = function(_vimeoPlayer) {

                vimeoApiReady = true;
                mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

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

                vimeoPlayer.on('loaded', function() {

                    vimeoPlayer.getDuration().then(function(loadProgress) {

                        if (duration > 0) {
                            bufferedTime = duration * loadProgress;
                        }

                        var event = mejs.Utils.createEvent('timeupdate', vimeo);
                        mediaElement.dispatchEvent(event);

                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    vimeoPlayer.getDuration().then(function(seconds) {
                        duration = seconds;

                        var event = mejs.Utils.createEvent('loadmetadata', vimeo);
                        mediaElement.dispatchEvent(event);
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });

                });

                vimeoPlayer.on('progress', function() {

                    paused = vimeo.mediaElement.getPaused();

                    vimeoPlayer.getDuration().then(function(loadProgress) {

                        if (duration > 0) {
                            bufferedTime = duration * loadProgress;
                        }

                        var event = mejs.Utils.createEvent('timeupdate', vimeo);
                        mediaElement.dispatchEvent(event);

                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });

                    vimeoPlayer.getDuration().then(function(seconds) {
                        duration = seconds;

                        var event = mejs.Utils.createEvent('loadmetadata', vimeo);
                        mediaElement.dispatchEvent(event);
                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });

                });

                vimeoPlayer.on('timeupdate', function() {

                    paused = vimeo.mediaElement.getPaused();
                    ended = false;

                    vimeoPlayer.getCurrentTime().then(function(seconds) {
                        currentTime = seconds;

                        var event = mejs.Utils.createEvent('timeupdate', vimeo);
                        mediaElement.dispatchEvent(event);
                    });

                });
                vimeoPlayer.on('play', function() {
                    paused = false;
                    ended = false;

                    vimeoPlayer.play().then(function() {
                        event = mejs.Utils.createEvent('play', vimeo);
                        mediaElement.dispatchEvent(event);

                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });
                vimeoPlayer.on('pause', function() {
                    paused = true;
                    ended = false;

                    vimeoPlayer.pause().then(function() {

                        event = mejs.Utils.createEvent('pause', vimeo);
                        mediaElement.dispatchEvent(event);

                    }).catch(function(error) {
                        vimeoApi.errorHandler(error);
                    });
                });
                vimeoPlayer.on('ended', function() {
                    paused = false;
                    ended = true;

                    var event = mejs.Utils.createEvent('ended', vimeo);
                    mediaElement.dispatchEvent(event);
                });

                // give initial events
                var initEvents = ['rendererready','loadeddata','loadedmetadata','canplay'];

                for (i=0, il=initEvents.length; i<il; i++) {
                    var event = mejs.Utils.createEvent(initEvents[i], vimeo);
                    mediaElement.dispatchEvent(event);
                }
            };

            var
                height = mediaElement.originalNode.height,
                width = mediaElement.originalNode.width,
                vimeoContainer = doc.createElement('iframe')
                ;

            // Create Vimeo <iframe>
            vimeoContainer.setAttribute('id', vimeo.id);
            vimeoContainer.setAttribute('width', width);
            vimeoContainer.setAttribute('height', height);
            vimeoContainer.setAttribute('frameBorder', 0);
            vimeoContainer.setAttribute('src', mediaFiles[0].src);
            vimeoContainer.setAttribute('webkitallowfullscreen', '');
            vimeoContainer.setAttribute('mozallowfullscreen', '');
            vimeoContainer.setAttribute('allowfullscreen', '');

            mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
            mediaElement.originalNode.style.display = 'none';

            // send it off for async loading and creation
            vimeoApi.enqueueIframe({
                iframe: vimeoContainer,
                id: vimeo.id
            });

            vimeo.hide = function() {
                vimeo.pause();
                vimeoContainer.style.display = 'none';
            };
            vimeo.show = function() {
                vimeoContainer.style.display = '';
            };

            return vimeo;
        }

    };

    mejs.Renderers.add(vimeoIframeRenderer);

})(window, document, window.mejs || {});