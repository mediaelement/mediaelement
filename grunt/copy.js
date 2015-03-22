/**
 * @file
 * Configure grunt copy.
 */

module.exports = {
  build: {
    expand: true,
    cwd: 'src/css/',
    src: ['*.css'],
    dest: 'local-build/',
    flatten: true,
    filter: 'isFile'
  }
};
