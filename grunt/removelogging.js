/**
 * @file
 * Configure grunt remove logging.
 */

module.exports = {
  options: {
    // Keep `warn` and other methods from the console API
    methods: ['log']
  },
  dist: {
    src: [
      'local-build/mediaelement.js',
      'local-build/mediaelementplayer.js',
      'local-build/mediaelement-and-player.js'
    ]
  }
};
