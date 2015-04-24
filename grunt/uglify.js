/**
 * @file
 * Configure grunt uglify.
 */

module.exports = {
  options: {
    preserveComments: "some",
    compress: true,
    mangle: true
  },
  base: {
    src: ['local-build/mediaelement.base.js'],
    dest: 'local-build/mediaelement.base.min.js',
    banner: 'src/js/me-header.js'
  },
  player: {
    src: ['local-build/mediaelement.player.js'],
    dest: 'local-build/mediaelement.player.min.js',
    banner: 'src/js/mep-header.js'
  },
  bundle: {
    src: ['local-build/mediaelement.js'],
    dest: 'local-build/mediaelement.min.js'
  }
};
