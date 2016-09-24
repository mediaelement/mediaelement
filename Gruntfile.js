module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
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
		})
	}
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			me: {
				src: [
					'src/js/mediaelement-header.js',
					'src/js/mediaelement-namespace.js',
					'src/js/mediaelement-utility.js',
					'src/js/mediaelement-core.js',
					'src/js/mediaelement-renderer-html5.js',
					'src/js/mediaelement-renderer-flash.js',
					'src/js/mediaelement-renderer-youtube-iframe.js',
					'src/js/mediaelement-renderer-dailymotion-iframe.js',
					'src/js/mediaelement-renderer-soundcloud.js'
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
					'src/js/mediaelementplayer-feature-postroll.js'
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
		cssmin: {
			build: {
				src	 : ['src/css/mediaelementplayer.css'],
				dest : 'build/mediaelementplayer.min.css'
			}
		},
		copy: {
			build: {
				expand  : true,
				cwd     : 'src/css/',
				src     : ['*.png', '*.svg', '*.gif', '*.css'],
				dest    : 'build/',
				flatten : true,
				filter  : 'isFile'
			},
			translation: {
				expand  : true,
				cwd     : 'src/js/',
				src     : ['me-i18n-locale-*.js'],
				dest    : 'build/lang',
				flatten : true,
				filter  : 'isFile'
			}
		},
        clean: {
          build: ['build'],
          temp:  ['tmp']
        },

		// Task that compiles flashmediaelement.swf using the free Flex SDK on Linux/Mac.
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
		// 3) Build the SWC file (only needs to be done if you have changed something in the FLA file)
		//	 Open the FlashMediaElement.fla file in the Flash Professional IDE.
		//	 Goto the menu item 'File->Publish Settings'
		//	 Click the 'Flash' tab
		//	 Make sure the box 'Export SWC' is checked
		//	 Click 'Publish'
		//	 Quit out of the Flash IDE
		//
		// 4) Run this task from the command line: `grunt shell:buildFlash`
		//
		// Note: There doesn't seem to be an available SWC library that defines the YouTube player API.
		//		 Remove the -strict compiler option to see warnings coming from YouTube API calls.
		//
		flexPath: '../flex_sdk_4.6',
		buildFlashCommand: [
			'<%= flexPath %>/bin/mxmlc -strict=false -compiler.debug -warnings=true',
			'src/flash/FlashMediaElement.as -o <%= flashOut %>',
			'-define+=CONFIG::cdnBuild,<%= cdnBuild %>',
			'-define+=CONFIG::debugBuild,<%= debugBuild %>',
			'-library-path+="<%= flexPath %>/lib"',
			'-include-libraries+=src/flash/flashmediaelement.swc',
			'-include-libraries+=src/flash/flashls.swc -use-network=true',
			'-source-path src/flash',
			'-target-player 10.0',
			'-headless-server -static-link-runtime-shared-libraries'
		].join(" "),

		shell: {
			buildFlash: {
				command: function() {
					grunt.config.set("cdnBuild", 'false');
					grunt.config.set("debugBuild", 'false');
					grunt.config.set("flashOut", 'build/flashmediaelement.swf');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashCDN: {
				command: function() {
					grunt.config.set("cdnBuild", 'true');
					grunt.config.set("debugBuild", 'false');
					grunt.config.set("flashOut", 'build/flashmediaelement-cdn.swf');
					return grunt.config.get("buildFlashCommand");
				}
			},
			buildFlashDebug: {
				command: function() {
					grunt.config.set("cdnBuild", 'true');
					grunt.config.set("debugBuild", 'true');
					grunt.config.set("flashOut", 'build/flashmediaelement-debug.swf');
					return grunt.config.get("buildFlashCommand");
				}
			}
		}
	});

	grunt.registerTask('default', ['concat', 'removelogging', 'uglify', 'cssmin', 'copy',
		'shell:buildFlash', 'shell:buildFlashCDN', 'shell:buildFlashDebug', 'clean:temp']);

    grunt.registerTask('html5only', ['concat', 'removelogging', 'uglify', 'cssmin', 'copy', 'clean:temp']);
    grunt.registerTask('debug_html5', ['concat', 'uglify', 'cssmin', 'copy', 'clean:temp']);

};
