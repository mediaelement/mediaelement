/**
 * @file
 * Configure grunt cssComb.
 */

module.exports = {
  options: {
    config: 'src/sass/config/csscomb.json'
  },
  mep: {
    cwd: 'src/css',
    expand: true,
    src: ['*.css', '!**/*.min.css'],
    dest: 'src/css'
  }
};
