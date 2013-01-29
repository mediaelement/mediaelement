(function($) {

    $.extend(MediaElementPlayer.prototype, {
        buildplaylist : function(player, controls, layers, media) {

            var opened = false;

            var panel = 
                $('<div class="mejs-playlist">' +
                    '<div class="mejs-block">' +
                        '<div class="mejs-button mejs-close"><button type="button"></button></div>' +
                        '<nav class="mejs-playlist-paging"></nav>' +
                        '<div class="mejs-playlist-content"></div>' +
                    '</div>' +
                '</div>')
                .appendTo(layers)
                .on('click', '.mejs-playlist-content a[href]', function(e){
                    e.preventDefault();
                    var playlistIndex = $(e.currentTarget).closest('.mejs-playlist-content').find('li a').index(e.currentTarget);
                    player.setItem(playlistIndex);
                    if(player.isVideo) player.closePlaylistPanel();
                    return false;
                });

            var closeButton = panel.find('.mejs-close');
            closeButton.click(function(e){
                player.closePlaylistPanel();
            });

            var button = 
                $('<div class="mejs-button mejs-playlist-openclose mejs-playlist-open" type="button">' +
                    '<button type="button"></button>' +
                '</div>')
                .appendTo(controls)
                .mouseenter(function(){
                    player.openPlaylistPanel();
                })
                .click(function(){
                    if(opened) player.closePlaylistPanel();
                    else player.openPlaylistPanel();
                });   

            this.openPlaylistPanel = function(){
                if(!opened) {
                    panel.slideDown(function(){ 
                        opened = true;
                        
                        if(!player.isVideo) return;
                        
                        // pagination
                        var paging = panel.find('.mejs-playlist-paging');
                        var items = panel.find('.mejs-playlist-content ol li');
                        var cols = Math.floor(panel.width() / items.width());
                        var lines = Math.floor(panel.height() / items.height());
                        var pages = Math.ceil(items.length / (cols*lines));
                        var current = 1;
                        var list = document.createElement('ul');
                        paging.empty().append(list);
                        
                        if(pages > 1) {
                            for(var i=1; i<=pages; i++){
                                var li = document.createElement('li');
                                li.innerHTML = i;
                                li.className = "mejs-page";
                                list.appendChild(li);
                            }
                            var next = document.createElement('button');
                            next.innerHTML = "Next page";
                            next.className = "mejs-page-next";
                            var prev = document.createElement('button');
                            prev.innerHTML = "Previous page";
                            prev.className = "mejs-page-prev";
                            list.appendChild(prev);
                            list.appendChild(next);
                            
                            paging.find('.mejs-page').click(function(e){
                                $e = $(e.currentTarget);
                                current = $e.index() + 1;
                                items.parent().css('top', (-panel.height() + parseInt(items.parent().css('margin-top'), 10)) * $e.index());
                                $e.siblings().andSelf().removeClass('mejs-page-current');
                                $e.addClass('mejs-page-current');
                            });
                            $(prev).click(function(e){
                                if(current > 1) paging.find('.mejs-page').eq(current-1-1).click();
                            });
                            $(next).click(function(e){
                                if(current < pages) paging.find('.mejs-page').eq(current-1+1).click();
                            });
                            
                            // select the current playlist element page
                            paging.find('.mejs-page').eq(Math.floor(player.playlist.current / (cols*lines))).click();
                        }
                        
                    });
                    $(button).addClass('mejs-playlist-close').removeClass('mejs-playlist-open');
                }
            };

            this.closePlaylistPanel = function(){
                if(opened) {
                    panel.slideUp(function(){ opened = false; });
                    $(button).addClass('mejs-playlist-open').removeClass('mejs-playlist-close');
                }
            };
            
            // use the media tag title attribute if present, or else the media file name
            var title = media.getAttribute('title');
            if(!title) {
                var path = media.src.split('/');
                title = path[path.length-1];
            }
            
            // load the initial playlist with the current media
            var props = {src: media.src, title: title, poster: media.getAttribute('poster')};
            var $url = player.$media.find('meta[itemprop="url"]');
            if($url.length) props.url = $url.attr('content');
            player.loadPlaylist([props]);

        },
        
        loadPlaylist : function(entries){
            var player = this;
            var panel = this.container.find('.mejs-playlist-content');
            var $prev = this.container.find('.mejs-prev button');
            var $next = this.container.find('.mejs-next button');

            // reset the playlist
            this.playlist = {list:[], current: -1};

            // reset playlist panel
            if(panel.length) panel.empty();

            // filter entries and add them to the internal playlist
            var currentNb = 1;
            for(var i=0; i<entries.length; i++){
                var entry = {};
                if(entries[i].src) entry.src = entries[i].src;
                if(entries[i].poster) entry.poster = entries[i].poster;
                entry.title = entries[i].title ?  entries[i].title : "";
                if(entries[i].disk) {
                    entry.disk = entries[i].disk;
                    currentNb = 1;
                }
                entry.nb = entries[i].nb ?  entries[i].nb : currentNb++;
                if(entries[i].url) entry.url = entries[i].url;
                
                this.playlist.list.push(entry);

                if(panel.length){
                    var content = '<span class="mejs-playlist-nb">'+entry.nb+'.</span>';
                    if(entry.poster && player.isVideo) content += '<span class="mejs-playlist-poster"><img src="'+entry.poster+'"/></span>';
                    content += '<span class="mejs-playlist-title">'+entry.title+'</span>';
                                  
                    if(entry.url) content += '<meta itemprop="url" content="'+entry.url+'" />';
                    
                    if(entry.src) $entry = $('<li><a href="'+entry.src+'">'+content+'</a></li>');
                    else $entry = $('<li><a>'+content+'</a></li>');
                    
                    if(panel.find('ol').length == 0 || entry.disk) panel.append(document.createElement('ol'));
                    
                    if(entry.disk) panel.find('ol:last-child').append('<li class="mejs-playlist-disk">'+entry.disk+'</li>');
                    
                    panel.find('ol:last-child').append($entry);
                }
            }

            // update the current title and poster
            if(this.setTrackTitle) this.setTrackTitle(this.playlist.list[0].title);
            this.setPoster(this.playlist.list[0].poster);

            // publicly available method to load a track from the playlist
            this.setItem = function(i){
                if(this.playlist.list[i].src == undefined || this.playlist.list[i].src == '') return;

                this.playlist.current = i;
                this.pause();
                this.setSrc(this.playlist.list[i].src);
                this.load();
                if(this.setTrackTitle) this.setTrackTitle(this.playlist.list[i].title);
                this.setPoster(this.playlist.list[i].poster);
                
                // update audio node meta
                var $url = player.$media.find('meta[itemprop="url"]');
                if($url.length){
                    if(this.playlist.list[i].url) 
                        $url.attr('content', this.playlist.list[i].url);
                    else 
                        $url.remove();
                } else {
                    if(this.playlist.list[i].url) 
                        $(document.createElement('meta'))
                            .attr('itemprop', 'url')
                            .attr('content', this.playlist.list[i].url)
                            .appendTo(player.$media);
                }

                // update next and previous buttons states if needed
                updateButtons();

                return this;
            };

            // publicly available method to go backward through the playlist
            this.setPrevItem = function(){
                var i = this.playlist.current;
                
                // find an entry that has a source
                while(i>0){
                    i--;
                    if(this.playlist.list[i].src == undefined || this.playlist.list[i].src == '') continue;
                    this.setItem(i);
                    break;
                }
                return this;
            };

            // publicly available method to go forward through the playlist
            this.setNextItem = function(){
                var i = this.playlist.current;
                
                // find an entry that has a source
                while(i+1 < this.playlist.list.length){
                    i++;
                    if(this.playlist.list[i].src == undefined || this.playlist.list[i].src == '') continue;
                    this.setItem(i);
                    break;
                }
                return this;
            };

            // prevent the handler to be attached more than once
            if(!this.playlist.alreadyAttached) {
            
                // event handler to load the next one at the end of a track
                player.media.addEventListener('ended', function(){
                    var previous = player.playlist.current;
                    player.pause();
                    player.setNextItem();
                    
                    if(player.playlist.current != previous)
                        // the player seems to not be available immediately
                        setTimeout(function(){
                            player.load();
                            player.play();
                        },0);
                        
                }, false);
                
            }
            this.playlist.alreadyAttached = true;

            // private method to update next and previous buttons states if needed
            function updateButtons(){
                var i, disable;
                if($prev.length){
                    i = player.playlist.current;
                    disable = true;
                    
                    // find an entry that has a source
                    while(i>0){
                        i--;
                        if(player.playlist.list[i].src == undefined || player.playlist.list[i].src == '') continue;
                        disable = false;
                        break;
                    }
                    
                    // if no track with source is found, disable the button
                    if(disable) $prev.attr('disabled','disabled');
                    else $prev.removeAttr('disabled');
                }

                if($next.length){
                    i = player.playlist.current;
                    disable = true;
                    
                    // find an entry that has a source
                    while(i+1 < player.playlist.list.length){
                        i++;
                        if(player.playlist.list[i].src == undefined || player.playlist.list[i].src == '') continue;
                        disable = false;
                        break;
                    }
                    
                    // if no track with source is found, disable the button
                    if(disable) $next.attr('disabled','disabled');
                    else $next.removeAttr('disabled');
                }
            }
            updateButtons();
            
            // load the first track
            this.setNextItem();
            return this;
        },

        buildprev : function(player, controls, layers, media) {
            // set previous track button
            var prev = 
                $('<div class="mejs-button mejs-prev" type="button">' +
                    '<button type="button" disabled></button>' +
                '</div>')
                .appendTo(controls)
                .click(function(e) {
                    e.preventDefault();

                    player.setPrevItem();

                    return false;
                });
        },

        buildnext : function(player, controls, layers, media) {
            // set next track button
            var next = 
                $('<div class="mejs-button mejs-next" type="button">' +
                    '<button type="button" disabled></button>' +
                '</div>')
                .appendTo(controls)
                .click(function(e) {
                    e.preventDefault();

                    player.setNextItem();

                    return false;
                });
        }
    });

})(mejs.$);
