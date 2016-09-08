(function($) {

    // add extra default options
    $.extend(mejs.MepDefaults, {
        // this will automatically turn on a <track>
        enableTranscript: false
    });

    $.extend(MediaElementPlayer.prototype, {

        /**
         *
         * @param player
         * @param jQuery controls
         * @param layers
         * @param media
         * @return void
         */
        buildtranscript: function(player, controls, layers, media) {

            var t = this;

            if (player.tracks.length === 0 || !t.options.enableTranscript || !t.isVideo) {
                return;
            }

            var scope = media.closest('.mejs-inner'),
                languageSelect = [];

            // Create transcript area
            t.transcript = player.transcript =
                $('<div class="mejs-transcript"><div class="mejs-transcript-area"></div><div class="mejs-clear"></div></div>')
                .insertAfter(scope);

            // Only create toggle list of more than 1 language is available
            for (var i = 0, total = player.tracks.length; i < total && total > 1; i++) {
                var track = player.tracks[i],
                    kind = track.kind;

                if (kind === 'subtitles' || kind === 'captions') {
                    languageSelect.push('<option value="' + track.srclang+ '">' + (track.label || mejs.i18n.t('English')) + '</option>');
                }
            }

            if (languageSelect.length > 1) {
                player.transcriptToggle = $('<select class="mejs-transcript-language">' + languageSelect.join('') + '</select>')
                    .prependTo(player.transcript);
            }

            t.selectedTrack = player.tracks[0];

            // Mute video completely to favor transcript
            media.setMuted(true);

            // Build content of transcript area with first caption content
            $.ajax({
                url: t.selectedTrack.src,
                dataType: 'text',
                success: function(d) {
                    var lines = "";
                    // parse the loaded file
                    if (typeof d === 'string' && (/<tt\s+xml/ig).exec(d)) {
                        t.selectedTrack.entries = mejs.TrackFormatParser.dfxp.parse(d);
                    } else {
                        t.selectedTrack.entries = mejs.TrackFormatParser.webvtt.parse(d);
                    }

                    player.transcript.find('.mejs-transcript-area').html('<div class="mejs-transcript-line">' +
                        t.selectedTrack.entries.text.join('</div><div class="mejs-transcript-line">') + '</div>');
                },
                error: function() {
                }
            });

            // Update transcript position
            media.addEventListener('timeupdate',function() {
                t.updateTranscriptPosition();
            }, false);
        },
        updateTranscriptPosition: function() {
            if (typeof this.tracks === 'undefined') {
                return;
            }

            var
                t = this,
                track = t.selectedTrack;

            if (track !== null) {
                for (var i = 0, total = track.entries.times.length; i < total; i++) {
                    var currentLine = t.transcript.find('.mejs-transcript-line:eq(' + i + ')');
                    if (t.media.currentTime >= track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop) {
                        // Scroll to the position
                        currentLine.addClass('current').attr('tabindex', 1).focus();
                        return;
                    } else {
                        currentLine.removeClass('current').removeAttr('tabindex').blur();
                    }
                }
            }
        }
    });

})(mejs.$);