/**
 * @file
 * Configure grunt clean.
 */

module.exports = {
  build: [
    'build/*.js',
    'build/*.css',
    'build/*.gif',
    'build/*.png',
    'build/*.svg',
    '!build/jquery.js'
  ],
  local: ['local-build'],
  temp: ['tmp']
};
