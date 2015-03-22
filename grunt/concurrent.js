/**
 * @file
 * Define grunt tasks to run concurrently.
 */

module.exports = {
  watch: ['watch'],
  dist0: [
    'clean:build'
  ],
  dist1: [
    'compass',
    'concat'
    // 'svg2png'
  ],
  dist2: [
    'autoprefixer',
    'closurecompiler',
    //'uglify',
    'imagemin'
  ],
  dist3: [
    'csscomb'
  ],
  dist4: [
    'replace'
  ],
  dist5: [
    'cssmin'
  ],
  dist6: [
    //'shell'
  ],
  dist7: [
    'copy',
    'clean:temp'
  ]
};
