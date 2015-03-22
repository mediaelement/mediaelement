/**
 * @file
 * Configure grunt replace
 */

module.exports = {
  cdnBuild: {
    src: ['src/flash/FlashMediaElement.as'],
    dest: 'tmp/FlashMediaElement.as',
    replacements: [{
        from: '//Security.allowDomain("*");',
        to: 'Security.allowDomain("*");'
      }, {
        from: '//Security.allowInsecureDomain("*");',
        to: 'Security.allowInsecureDomain("*");'
      }]
  }
};
