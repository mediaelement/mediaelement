/**
 * @file
 * Configure grunt compass.
 *
 * OutputStyle: expanded | nested | compact | compressed
 */

module.exports = {
  compile: {
    options: {
      sassDir: 'src/sass',
      cssDir: 'src/css',
      environment: 'development',
      outputStyle: 'nested'
    }
  }
};
