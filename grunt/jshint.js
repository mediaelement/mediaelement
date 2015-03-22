/**
 * @file
 * Configure grunt jshint.
 */

module.exports = {
  options: {
    curly: true,
    eqeqeq: true,
    eqnull: true,
    browser: true,
    globals: {
      jQuery: true
    }
  },
  js: [
    'build/**/*.js',
    '!**/*.min.js'
  ]
};
