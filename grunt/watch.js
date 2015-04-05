/**
 * @file
 * Configure grunt watch
 */

module.exports = {
   scripts: {
    files: ['src/js/**/*.js'],
    tasks: ['concat'],
    options: {
      spawn: false
    }
  },
   styles: {
    files: ['src/sass/**/*.scss'],
    tasks: ['compass', 'autoprefixer', 'csscomb', 'cssmin', 'copy:build'],
    options: {
      spawn: false
    }
  }
};
