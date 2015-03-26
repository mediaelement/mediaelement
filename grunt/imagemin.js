/**
 * @file
 * Configure grunt imagemin.
 */

module.exports = {
  options: {
    cache: false
  },
  gif: {
    files: [
      {
        expand: true,
        cwd: 'src/images',
        src: ['**/*.gif', '!**/min/**'],
        dest: './local-build/'
      }
    ]
  },
  png: {
    files: [
      {
        expand: true,
        cwd: 'src/images',
        src: ['**/*.png', '!**/min/**'],
        dest: './local-build/'
      }
    ]
  },
  svg: {
    files: [
      {
        expand: true,
        cwd: 'src/images',
        src: ['**/*.svg', '!**/min/**'],
        dest: './local-build/'
      }
    ]
  }
};
