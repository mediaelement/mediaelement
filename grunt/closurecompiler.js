/**
 * @file
 * Configure grunt closure compiler.
 */

module.exports = {
  build: {
    options: {
      compilation_level: 'SIMPLE_OPTIMIZATIONS' // 'WHITESPACE_ONLY'
      //banner: $banner
    },
    files: {
      'local-build/mediaelement.min.js': 'local-build/mediaelement.js',
      'local-build/mediaelementplayer.min.js': 'local-build/mediaelementplayer.js',
      'local-build/mediaelement-and-player.min.js': 'local-build/mediaelement-and-player.js'
    }
  }
};
