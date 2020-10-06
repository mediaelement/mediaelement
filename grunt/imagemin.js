/**
 * @file
 * Configure grunt imagemin.
 */

module.exports = {
  options: {
    cache: false
  },
  images: {
    files: [
      {
        expand: true,
        cwd: 'src/images',
        src: [
          '**/*.gif',
          '**/*.jpg',
          '**/*.png',
          '**/*.svg'
        ],
        dest: 'local-build'
      }
    ]
  }
};
