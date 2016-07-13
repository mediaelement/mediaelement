var teststreams = [{
    file:'http://streambox.fr/playlists/test_001/stream.m3u8',
    title: 'VOD (6 levels) - ffmpeg internal segmenter x264+aac'
},{
    file:'http://edge-1.2gzr.com/5178d5fe531a484b777dacf1.m3u8',
    title: 'simple HLS stream'
},{
    file:'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8',
    title: 'BigBuckBunny 2 Levels'
},{
    file:'http://m4stv.inqb8r.tv/studentTV/studentTV.stream_360p/playlist.m3u8',
    title: 'Live'
},{
    file:'http://www.codecomposer.net/hls/playlist.m3u8',
    title: 'Discontinuity'
},{
    file:'http://streambox.fr/playlists/issue_002/test.m3u8',
    title: 'HLSprovider/issues/2'
},{
    file:'http://streambox.fr/playlists/issue_003/index.m3u8',
    title: 'HLSprovider/issues/3 - envivio encoder, big delay between audio and video PTS'
},{
    file:'http://streambox.fr/playlists/issue_004_1/index.m3u8',
    title: 'HLSprovider/issues/4 - envivio encoder, AAC frames cut between 2 fragments, PES parsing robustness'
},{
    file:'http://streambox.fr/playlists/issue_004_2/index.m3u8',
    title: 'HLSprovider/issues/4 - envivio encoder, AAC frames cut between 2 fragments, TS parsing robustness'
},{
    file:'http://streambox.fr/playlists/issue_005/index.m3u8',
    title: 'HLSprovider/issues/5'
},{
    file:'http://streambox.fr/playlists/issue_006/sample.m3u8',
    title: 'HLSprovider/issues/6 - TS parsing robustness'
},{
    file:'http://streambox.fr/playlists/issue_010/list.m3u8',
    title: 'HLSprovider/issues/10 - drift between segment and playlist duration'
},{
    file:'http://streambox.fr/playlists/issue_012/playlist.m3u8',
    title: 'HLSprovider/issues/12 - PTS/seqnum not synchronized accross adaptive playlists'
},{
    file:'http://streambox.fr/playlists/issue_020/new/test.m3u8',
    title: 'HLSprovider/issues/20 - AVC NAL unit parsing issue'
},{
    file:'http://streambox.fr/playlists/issue_026/stream_multi.m3u8',
    title: 'HLSprovider/issues/26 - bad segmentation - adaptive'
},{
    file:'http://streambox.fr/playlists/issue_026/stream_cell_16x9_440k.m3u8',
    title: 'HLSprovider/issues/26 - bad segmentation - 440k'
},{
    file:'http://inx-con001.inqb8r.tv/live/e4/playlist.m3u8',
    title: 'HLSprovider/issues/43 - discontinuity on live streams - multiple bitrate'
  },{
    file:'http://avideos.5min.com/28/5180028/518002744_20131106_212846.m3u8',
    title: 'HLSprovider/issues/48 - multiple bitrate - first level = AAC elementary stream'
  },{
    file:'http://streambox.fr/playlists/issue_066/prog_index.m3u8',
    title: 'HLSprovider/issues/66 - accurate seeking - multiple keyframes per segment - playback artifacts'
  },{
    file:'http://streambox.fr/playlists/issue_067/stream.m3u8',
    title: 'HLSprovider/issues/67 - VLC as HLS server - decoding issues'
  },{
    file:'http://193.218.104.234:8080/hls/test_1200.m3u8',
    title: 'No Audio - Live Playlist'
},{
    file:'http://live.gamt.su/20131128/archive-m3u8-aapl.ism/Manifest(format=m3u8-aapl).m3u8',
    title: 'Mariinsky Theatre - HD (5 A/V levels from 640kb/s to 4.7 Mb/s + 1 audio fallback 260kb/s)'
},{
    file:'http://playertest.longtailvideo.com/adaptive/mandolin2/optimized.m3u8',
    title: 'adaptive playlist - first level = AAC elementary streams with 2 ID3 tag'
},{
    file:'http://dev.movingbits.nl/playlist/testing/encrypted/index.m3u8?player_id=Testing123456789&public=true',
    title: 'one level - AES 128 - one key, no IV. movingbits.nl'
}
];
