/**
 * @file
 * Configure grunt copy.
 */

module.exports = {
  local: {
    expand: true,
    cwd: 'src/css/',
    src: ['*.css'],
    dest: 'local-build/',
    flatten: true,
    filter: 'isFile'
  },
  build: {
    expand: true,
    src: [
      'src/css/*.css',
      'local-build/*.js',
      'local-build/*.gif',
      'local-build/*.png',
      'local-build/*.svg'
    ],
    dest: 'build/',
    flatten: true,
    filter: 'isFile'
  }
};
