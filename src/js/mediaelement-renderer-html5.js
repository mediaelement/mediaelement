(function(win, doc, mejs, undefined) {

// wraps the native HTML5 <audio> or <video> tag and bubbles its properties, events, and methods up to the mediaElement
    var HtmlMediaElement = {
        name: 'html5',

        canPlayType: function(type) {

            var
                mediaElement = doc.createElement('video'),
                mediaTypes = mejs.html5media.mediaTypes,
                isMseSource = type.indexOf('mpegURL') > -1 || type.indexOf('dash+xml') > -1
                ;

            // Test for MSE elements before going for HTML5 default ones
            if (mejs.MediaFeatures.hasMse && isMseSource) {

                if (type.indexOf('mpegURL') > -1 && mediaTypes.indexOf('application/x-mpegURL') === -1) {
                    mediaTypes.push('application/x-mpegURL', 'vnd.apple.mpegURL', 'audio/mpegURL', 'audio/hls', 'video/hls');
                } else if (type.indexOf('dash+xml') > -1) {
                    mediaTypes.push('application/dash+xml');
                }

                return mediaTypes.indexOf(type) > -1;
            }

            if (mediaElement.canPlayType) {
                return mediaElement.canPlayType(type).replace(/no/,'');
            } else {
                return '';
            }
        },
        options: null,

        create: function (mediaElement, options, mediaFiles) {

            var node = null,
                i,
                il,
                id = mediaElement.id + '_html5';

            // CREATE NODE
            if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {

                node =  document.createElement('audio');
                mediaElement.appendChild(node);

            } else {
                node = mediaElement.originalNode;
            }

            node.setAttribute('id', id);

            // WRAPPERS for PROPs
            var props = mejs.html5media.properties;
            for (i=0, il=props.length; i<il; i++) {

                // wrap in function to retain scope
                (function(propName) {
                    var capName = propName.substring(0,1).toUpperCase() + propName.substring(1);

                    node['get' + capName] = function() {
                        return node[propName];
                    };

                    node['set' + capName] = function(value) {
                        node[propName] = value;
                    };

                })(props[i]);
            }

            // BUBBLE EVENTS
            var events = mejs.html5media.events;

            events = events.concat(['click','mouseover','mouseout']);

            for (i=0, il=events.length; i<il; i++) {
                (function(eventName) {

                    node.addEventListener(eventName, function(e) {
                        // copy event

                        var event = doc.createEvent('HTMLEvents');
                        event.initEvent(e.type, e.bubbles, e.cancelable);
                        event.srcElement = e.srcElement;
                        event.target = e.srcElement;

                        //var ev = mejs.Utils.extend({}, e);

                        mediaElement.dispatchEvent(event);
                    });

                })(events[i]);
            }

            // HELPER METHODS
            node.setSize = function(width, height) {
                node.style.width = width + 'px';
                node.style.height = height + 'px';

                return node;
            };

            node.hide = function() {
                node.style.display = 'none';

                return node;
            };

            node.show = function() {
                node.style.display = '';

                return node;
            };

            if (mediaFiles && mediaFiles.length > 0) {

                node.src = mediaFiles[0].src;

                var
                    extension = mejs.Utils.getExtension(node.src),
                    player
                    ;

                if (mejs.MediaFeatures.supportsHls && extension === 'm3u8') {

                    var hlsEvents = Hls.Events;

                    player = new Hls(options.hls);
                    player.attachMedia(node);

                    player.on(hlsEvents.MEDIA_ATTACHED, function() {
                        player.loadSource(mediaFiles[0].src);

                        player.on(hlsEvents.MANIFEST_PARSED, function() {
                            if (node.getAttribute('autoplay')) {
                                node.play();
                            }
                        });
                    });

                    Object.keys(hlsEvents).forEach(function (key) {
                        var etype = hlsEvents[key];

                        player.on(etype, function (e) {
                            var event = new Event(e, { bubbles: false, cancelable: false });
                            mediaElement.dispatchEvent(event);
                        });
                    });

                } else if (mejs.MediaFeatures.supportsDash && extension === 'mpd') {

                    player = dashjs.MediaPlayerFactory.create(node);
                }
            }

            var event = mejs.Utils.createEvent('rendererready', node);
            mediaElement.dispatchEvent(event);

            return node;
        }
    };

// add to list of possible renderers
    mejs.Renderers.add(HtmlMediaElement);

    window.HtmlMediaElement = mejs.HtmlMediaElement = HtmlMediaElement;

})(window, document, window.mejs || {});