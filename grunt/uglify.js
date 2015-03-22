/**
 * @file
 * Configure grunt uglify.
 */

module.exports = {
  me: {
    src: ['local-build/mediaelement.js'],
    dest: 'local-build/mediaelement.min.js',
    banner: 'src/js/me-header.js'
  },
  mep: {
    src: ['local-build/mediaelementplayer.js'],
    dest: 'local-build/mediaelementplayer.min.js',
    banner: 'src/js/mep-header.js'
  },
  bundle: {
    src: ['local-build/mediaelement-and-player.js'],
    dest: 'local-build/mediaelement-and-player.min.js'
  },
  options: {
    // Preserve comments that start with a bang (like the file header)
    preserveComments: "some"
  }
};
