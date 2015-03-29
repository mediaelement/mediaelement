/**
 * @file
 * Configure grunt clean.
 */

module.exports = {
  local: ['local-build/**/*.[js,css,gif,png,svg]'],
  build: [
    'build/*.js',
    'build/*.css',
    'build/*.gif',
    'build/*.png',
    'build/*.svg',
    '!build/jquery.js'
  ],
  temp: ['tmp']
};
