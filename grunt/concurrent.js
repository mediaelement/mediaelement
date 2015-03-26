/**
 * @file
 * Define grunt tasks to run concurrently.
 */

module.exports = {
  watch: ['watch'],
  dist0: [
    'removelogging',
    'compass',
    'concat',
    'imagemin',
    'replace'
    // 'svg2png'
  ],
  dist1: [
    'autoprefixer'
    //'closurecompiler'
  ],
  dist2: [
    'csscomb',
    'uglify'
  ],
  dist3: [
    'cssmin',
    'jshint:js'
    //'shell'
  ],
  dist4: [
  ],
  dist5: [
  ],
  dist6: [
  ],
  dist7: [
  ]
};
