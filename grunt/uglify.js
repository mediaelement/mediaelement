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
    minme: {
      src: ['local-build/mediaelement.base.js'],
      dest: 'local-build/mediaelement.base.min.js',
      banner: 'src/js/me-header.js'
    },
    minmep: {
      src: ['local-build/mediaelement.player.js'],
      dest: 'local-build/mediaelement.player.min.js',
      banner: 'src/js/mep-header.js'
    },
    minbundle: {
      src: ['local-build/mediaelement.js'],
      dest: 'local-build/mediaelement.min.js'
    },
    // I18n
    minmei18n: {
      src: ['local-build/mediaelement.base.i18n.js'],
      dest: 'local-build/mediaelement.base.i18n.min.js',
      banner: 'src/js/me-header.js'
    },
    minmepi18n: {
      src: ['local-build/mediaelement.player.i18n.js'],
      dest: 'local-build/mediaelement.player.i18n.min.js',
      banner: 'src/js/mep-header.js'
    },
    minbundlei18n: {
      src: ['local-build/mediaelement.i18n.js'],
      dest: 'local-build/mediaelement.i18n.min.js'
    }
  
};
