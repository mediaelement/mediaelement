/**
 * @file
 * Configure grunt cssmin
 */

module.exports = {
  css: {
    files: [{
      expand: true,
      cwd: 'src/css',
      src: ['*.css', '!*.min.css'],
      dest: 'src/css',
      ext: '.min.css'
    }]
  }
};
