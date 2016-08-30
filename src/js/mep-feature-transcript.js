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
            player.transcript = $('<div class="mejs-transcript"><div class="mejs-transcript-area"></div><div class="mejs-clear"></div></div>')
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
                        lines = mejs.TrackFormatParser.dfxp.parse(d);
                    } else {
                        lines = mejs.TrackFormatParser.webvtt.parse(d);
                    }


                    player.transcript.find('.mejs-transcript-area').html('<div class="mejs-transcript-line">' +
                        lines.text.join('</div><div class="mejs-transcript-line">') + '</div>');
                },
                error: function() {
                }
            });

            t.transcriptText = player.transcript.find('.mejs-transcript-line');

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
                    if (t.media.currentTime >= track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop) {
                        // Set the line before the timecode as a class so the cue can be targeted if needed
                        t.captionsText.html(track.entries.text[i]).attr('class', 'mejs-captions-text ' + (track.entries.times[i].identifier || ''));
                        t.captions.show().height(0);
                        return; // exit out if one is visible;
                    }
                }
                t.captions.hide();
            } else {
                t.captions.hide();
            }
        }
    });

})(mejs.$);