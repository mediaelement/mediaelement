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
      'local-build/mediaelement.base.min.js': 'local-build/mediaelement.base.js',
      'local-build/mediaelement.player.min.js': 'local-build/mediaelement.player.js',
      // i18n
      'local-build/mediaelement.i18n.min.js': 'local-build/mediaelement.i18n.js',
      'local-build/mediaelement.base.i18n.min.js': 'local-build/mediaelement.base.i18n.js',
      'local-build/mediaelement.player.i18n.min.js': 'local-build/mediaelement.player.i18n.js'
    }
  }
};
