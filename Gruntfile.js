module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks("grunt-remove-logging");

	var featureSources;

	// if commandline list of features, (e.g. --features=playpause,stop,...) build only these included
	var featureList = grunt.option('features');
	if (featureList) {
		featureList = featureList.split(',');
		featureSources = [];
		featureList.forEach(function(feature) {
			var path = 'src/js/mediaelementplayer-feature-' + feature + '.js';
			if (grunt.file.isFile(path)) {
				featureSources.push(path);
			}
		});
	}
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js', 'src/js/**/*.js']
		},
		concat: {
			me: {
				src: [
					'src/js/mediaelement-header.js',
					'src/js/mediaelement-namespace.js',
					'src/js/mediaelement-utility.js',
					'src/js/mediaelement-core.js',
					'src/js/mediaelement-renderer-html5.js',
					'src/js/mediaelement-renderer-hls.js',
					'src/js/mediaelement-renderer-mdash.js',
					'src/js/mediaelement-renderer-flv.js',
					'src/js/mediaelement-renderer-youtube-iframe.js',
					'src/js/mediaelement-renderer-vimeo.js',
					'src/js/mediaelement-renderer-dailymotion-iframe.js',
					'src/js/mediaelement-renderer-facebook.js',
					'src/js/mediaelement-renderer-soundcloud.js',
					'src/js/mediaelement-renderer-flash.js',
					'src/js/mediaelement-i18n.js',
					'src/js/mediaelement-i18n-locale-en.js',
				],
				dest: 'build/mediaelement.js'
			},
			mep: {
				src: [
					'src/js/mediaelement-header.js',
					'src/js/mediaelementplayer-library.js',
					'src/js/mediaelementplayer-player.js'
				].concat(featureSources || [
					'src/js/mediaelementplayer-feature-playpause.js',
					'src/js/mediaelementplayer-feature-stop.js',
					'src/js/mediaelementplayer-feature-progress.js',
					'src/js/mediaelementplayer-feature-time.js',
					'src/js/mediaelementplayer-feature-volume.js',
					'src/js/mediaelementplayer-feature-fullscreen.js',
					'src/js/mediaelementplayer-feature-speed.js',
					'src/js/mediaelementplayer-feature-tracks.js',
					'src/js/mediaelementplayer-feature-sourcechooser.js',
					'src/js/mediaelementplayer-feature-contextmenu.js',
					'src/js/mediaelementplayer-feature-skipback.js',
					'src/js/mediaelementplayer-feature-jumpforward.js',
					'src/js/mediaelementplayer-feature-postroll.js',
					'src/js/mediaelementplayer-feature-markers.js'
					]),
				dest: 'build/mediaelementplayer.js'
			},
			bundle: {
				src: [
					'build/mediaelement.js',
					'build/mediaelementplayer.js'
				],
				dest: 'build/mediaelement-and-player.js'
			}
		},
		removelogging: {
			dist: {
				src: [
					'build/mediaelement.js',
					'build/mediaelementplayer.js',
					'build/mediaelement-and-player.js'
				]
			},
			options: {
				// Keep `warn` and other methods from the console API
				methods: ['log']
			}
		},
		uglify: {
			me: {
				src	   : ['build/mediaelement.js'],
				dest   : 'build/mediaelement.min.js',
				banner : 'src/js/mediaelement-header.js'
			},
			mep: {
				src	   : ['build/mediaelementplayer.js'],
				dest   : 'build/mediaelementplayer.min.js',
				banner : 'src/js/mediaelement-header.js'
			},
			bundle: {
				src	 : ['build/mediaelement-and-player.js'],
				dest : 'build/mediaelement-and-player.min.js'
			},
			options: {
				// Preserve comments that start with a bang (like the file header)
				preserveComments: "some"
			}
		},
		postcss: {
			options: {
				processors: [
					// Add vendor prefixes.
					require('autoprefixer')({browsers: 'last 2 versions, ie > 8'}),
					 // Minify the result.
					require('cssnano')()
				]
			},
			main: {
				src: 'src/css/mediaelementplayer.css',
				dest: 'build/mediaelementplayer.min.css'
			}
		},
		copy: {
			build: {
				expand  : true,
				cwd     : 'src/css/',
				src     : ['*.png', '*.svg', '*.gif', '!*-simple*'],
				dest    : 'build/',
				flatten : true,
				filter  : 'isFile'
			},
			translation: {
				expand  : true,
				cwd     : 'src/js/',
				src     : ['mediaelement-i18n-locale-*.js'],
				dest    : 'build/lang/',
				flatten : true,
				filter  : 'isFile',
				rename: function(dest, src) {
					return dest + src.replace('mediaelement-i18n-locale-', '');
				}
			}
		},
		clean: {
			build: ['build'],
			temp:  ['tmp']
		},

		// Task that compiles all SWF files using the free Flex SDK on Linux/Mac.
		// There are a few prerequisite steps involved in running this task.
		//
		// 1) Install the Flex SDK version 4.6 (only needs to be done once)
		//	 Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
		//	 Unzip it to a directory on your local machine (eg: /usr/local/flex_sdk_4.6)
		//	 Create a symlink from the install location to this directory
		//	 (eg: ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
		//
		// 2) Update the `flexPath` variable below to reflect the name of the symlink you created
		//
		// 3) Run this task from the command line: `grunt shell:buildFlash`
		//
		flexPath: './src/flash/flex_sdk_4.6',
		flexVersion: '10.1',
		buildFlashCommand: [
			'<%= flexPath %>/bin/mxmlc -strict=false -compiler.debug -warnings=true',
			'<%= sourceFile %> -o <%= flashOut %>',
			'-library-path+="<%= flexPath %>/lib"',
			'-use-network=true -target-player <%= flexVersion %> -source-path <%= sourcePath %>',
			'-headless-server -static-link-runtime-shared-libraries',
			'<%= externalLibraries %>'
		].join(" "),

		shell: {
			buildFlashVideo: {
				command: function() {
					grunt.config.set("sourceFile", 'src/flash/flash-video/VideoMediaElement.as');
					grunt.config.set("sourcePath", 'src/flash/flash-video');
					grunt.config.set("flashOut", 'build/mediaelement-flash-video.swf');
					grunt.config.set("externalLibraries", '');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashVideoHls: {
				command: function() {
					grunt.config.set("sourceFile", 'src/flash/flash-video-hls/HlsMediaElement.as');
					grunt.config.set("sourcePath", 'src/flash/flash-video-hls');
					grunt.config.set("flashOut", 'build/mediaelement-flash-video-hls.swf');
					grunt.config.set("externalLibraries", '-include-libraries+=src/flash/flash-video-hls/flashls.swc');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashVideoMDash: {
				command: function() {
					grunt.config.set("sourceFile", 'src/flash/flash-video-dash/DashMediaElement.as');
					grunt.config.set("sourcePath", 'src/flash/flash-video-dash');
					grunt.config.set("flashOut", 'build/mediaelement-flash-video-mdash.swf');
					grunt.config.set("externalLibraries", '-include-libraries+=src/flash/flash-video-dash/OSMF.swc');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashAudio: {
				command: function() {
					grunt.config.set("sourceFile", 'src/flash/flash-audio/AudioMediaElement.as');
					grunt.config.set("sourcePath", 'src/flash/flash-audio');
					grunt.config.set("flashOut", 'build/mediaelement-flash-audio.swf');
					grunt.config.set("externalLibraries", '');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashAudioOgg: {
				command: function() {
					grunt.config.set("sourceFile", 'src/flash/flash-audio-ogg/OggMediaElement.as');
					grunt.config.set("sourcePath", 'src/flash/flash-audio-ogg');
					grunt.config.set("flashOut", 'build/mediaelement-flash-audio-ogg.swf');
					grunt.config.set("externalLibraries", '-include-libraries+=src/flash/flash-audio-ogg/oggvorbis.swc');
					return grunt.config.get("buildFlashCommand");
				}
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'concat', 'removelogging', 'uglify', 'postcss', 'shell', 'copy', 'clean:temp']);
	grunt.registerTask('html5only', ['jshint', 'concat', 'removelogging', 'uglify', 'postcss', 'copy', 'clean:temp']);
	grunt.registerTask('html5debug', ['jshint', 'concat', 'uglify', 'postcss', 'copy', 'clean:temp']);

};
