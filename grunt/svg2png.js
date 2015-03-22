/**
 * @file
 * Configure grunt svg2png.
 */

module.exports = {
  images: {
    files: [
      {
        cwd: 'src/css',
        src: ['*.svg'],
        dest: 'src/css'
      }
    ]
  }
};
