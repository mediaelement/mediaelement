module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-stylelint');

	var rendererSources;

	// if commandline list of renderers, (e.g. --renderers=hls,dash,...) build only these
	var rendererList = grunt.option('features');
	if (rendererList) {
		rendererList = rendererList.split(',');
		rendererSources = [];
		rendererList.forEach(function (renderer) {
			var path = 'src/js/renderers/' + renderer + '.js';
			if (grunt.file.isFile(path)) {
				rendererSources.push(path);
			}
		});
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			scripts: {
				files: ['src/js/**/*.js', 'test/core/*.js'],
				tasks: ['eslint', 'browserify', 'concat', 'uglify', 'copy:translation']
			},
			stylesheet: {
				files: ['src/css/**/*.css', 'src/css/**/*.png', 'src/css/**/*.svg', 'src/css/**/*.gif'],
				tasks: ['postcss', 'copy:build']
			}
		},

		stylelint: {
			all: ['src/css/*.css']
		},

		eslint: {
			target: [
				'Gruntfile.js',
				'src/js/core/*.js',
				'src/js/features/*.js',
				'src/js/languages/*.js',
				'src/js/renderers/*.js',
				'src/js/utils/*.js',
				'src/js/library.js',
				'src/js/player.js',
				'src/js/index.js',
				'test/core/*.js'
			]
		},
		browserify: {
			dist: {
				files: {
					// core element
					'build/mediaelement.js': [
						'src/js/utils/polyfill.js',
						'src/js/core/mediaelement.js',
						'src/js/core/i18n.js',
						'src/js/languages/en.js',
						'src/js/renderers/html5.js',
						'src/js/renderers/flash.js',
					].concat(rendererSources || [
						'src/js/renderers/dash.js',
						'src/js/renderers/flv.js',
						'src/js/renderers/hls.js',
						'src/js/renderers/youtube.js',
					]),
					// all bundle
					'build/mediaelement-and-player.js': [
						'src/js/utils/polyfill.js',
						'src/js/core/mediaelement.js',
						'src/js/core/i18n.js',
						'src/js/languages/en.js',
						'src/js/renderers/html5.js',
						'src/js/renderers/flash.js',
					].concat(rendererSources || [
						'src/js/renderers/dash.js',
						'src/js/renderers/flv.js',
						'src/js/renderers/hls.js',
						'src/js/renderers/youtube.js',
					]).concat([
						'src/js/player.js',
						'src/js/player/library.js',
						'src/js/player/default.js',
						'src/js/features/fullscreen.js',
						'src/js/features/playpause.js',
						'src/js/features/progress.js',
						'src/js/features/time.js',
						'src/js/features/tracks.js',
						'src/js/features/volume.js'
					]),

					// new renderers
					'build/renderers/dailymotion.js': 'src/js/renderers/dailymotion.js',
					'build/renderers/facebook.js': 'src/js/renderers/facebook.js',
					'build/renderers/soundcloud.js': 'src/js/renderers/soundcloud.js',
					'build/renderers/twitch.js': 'src/js/renderers/twitch.js',
					'build/renderers/vimeo.js': 'src/js/renderers/vimeo.js'
				},
				options: {
					plugin: [
						'browserify-derequire', 'bundle-collapser/plugin'
					]
				}
			}
		},
		concat: {
			dist: {
				options: {
					banner: grunt.file.read('src/js/header.js')
				},
				expand: true,
				src: ['build/**/*.js', '!build/lang/*.js', '!build/jquery.js', '!build/**/*.min.js'],
				ext: '.js'
			}
		},
		removelogging: {
			dist: {
				src: ['build/**/*.js', '!build/lang/*.js', '!build/jquery.js', '!build/**/*.min.js'],
			},
			options: {
				// Keep `warn` and other methods from the console API
				methods: ['log']
			}
		},
		uglify: {
			build: {
				files: [{
					expand: true,
					src: ['build/**/*.js', '!build/lang/*.js', '!build/jquery.js', '!build/**/*.min.js'],
					ext: '.min.js'
				}]
			},
			options: {
				output: {comments: false},
				banner: grunt.file.read('src/js/header.js')
			}
		},
		postcss: {
			main: {
				options: {
					processors: [
						// Add vendor prefixes.
						require('autoprefixer')({browsers: 'last 5 versions, ie > 10, ios > 7, android > 3'})
					]
				},
				src: 'src/css/mediaelementplayer.css',
				dest: 'build/mediaelementplayer.css'
			},
			legacy: {
				options: {
					processors: [
						// Add vendor prefixes.
						require('autoprefixer')({browsers: 'last 5 versions, ie > 10, ios > 7, android > 3'})
					]
				},
				src: 'src/css/mediaelementplayer-legacy.css',
				dest: 'build/mediaelementplayer-legacy.css'
			},
			mainMin: {
				options: {
					processors: [
						// Add vendor prefixes.
						require('autoprefixer')({browsers: 'last 5 versions, ie > 10, ios > 7, android > 3'}),
						// Minify the result.
						require('cssnano')()
					]
				},
				src: 'build/mediaelementplayer.css',
				dest: 'build/mediaelementplayer.min.css'
			},
			legacyMin: {
				options: {
					processors: [
						// Add vendor prefixes.
						require('autoprefixer')({browsers: 'last 5 versions, ie > 10, ios > 7, android > 3'}),
						// Minify the result.
						require('cssnano')()
					]
				},
				src: 'build/mediaelementplayer-legacy.css',
				dest: 'build/mediaelementplayer-legacy.min.css'
			}
		},
		copy: {
			build: {
				expand: true,
				cwd: 'src/css/',
				src: ['*.png', '*.svg', '*.gif'],
				dest: 'build/',
				flatten: true,
				filter: 'isFile'
			},
			translation: {
				expand: true,
				cwd: 'src/js/languages/',
				src: ['*.js', '!*en.js'],
				dest: 'build/lang/',
				flatten: true,
				filter: 'isFile',
				options: {
					processContent: function (content) {
						content = content.replace(/\/\/.*?\.js/gm, '');
						return content.replace(/\n{2,}/gm, '');
					}
				}
			}
		}
	});

	grunt.registerTask('default', ['eslint', 'stylelint', 'browserify', 'concat', 'removelogging', 'uglify', 'postcss', 'copy']);
	grunt.registerTask('debug', ['eslint', 'stylelint', 'browserify', 'concat', 'uglify', 'postcss', 'copy']);
	grunt.registerTask('flash', '', function () {
		var exec = require('child_process').execSync;
		var result = exec("sh compile_swf.sh", {encoding: 'utf8'});
		grunt.log.writeln(result);
	});
};
