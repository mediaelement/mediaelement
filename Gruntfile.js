module.exports = function(grunt) {
  // Measure the time each task takes.
  require('time-grunt')(grunt);
  // Load grunt tasks.
  require('load-grunt-config')(grunt, {
        loadGruntTasks: {
            pattern: ['grunt-*'],
            scope: 'devDependencies',
            config: require('./package.json')
        }
    });
};
