module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-remove-logging");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            me: {
                src: [
                    'src/js/me-header.js',
                    'src/js/me-namespace.js',
                    'src/js/me-utility.js',
                    'src/js/me-plugindetector.js',
                    'src/js/me-featuredetection.js',
                    'src/js/me-mediaelements.js',
                    'src/js/me-shim.js',
                    'src/js/me-i18n.js',
                    // Bug #1263
                    //'src/js/me-i18n-locale-de.js',
                    //'src/js/me-i18n-locale-zh.js'
                ],
                dest: 'local-build/mediaelement.js'
            },
            mep: {
                src: [
                    'src/js/mep-header.js',
                    'src/js/mep-library.js',
                    'src/js/mep-player.js',
                    'src/js/mep-feature-playpause.js',
                    'src/js/mep-feature-stop.js',
                    'src/js/mep-feature-progress.js',
                    'src/js/mep-feature-time.js',
                    'src/js/mep-feature-volume.js',
                    'src/js/mep-feature-fullscreen.js',
                    'src/js/mep-feature-speed.js',
                    'src/js/mep-feature-tracks.js',
                    'src/js/mep-feature-contextmenu.js',
                    'src/js/mep-feature-postroll.js'
                ],
                dest: 'local-build/mediaelementplayer.js'
            },
            bundle: {
                src: [
                    'local-build/mediaelement.js',
                    'local-build/mediaelementplayer.js'
                ],
                dest: 'local-build/mediaelement-and-player.js'
            }
        },
        removelogging: {
            dist: {
                src: [
                    'local-build/mediaelement.js',
                    'local-build/mediaelementplayer.js',
                    'local-build/mediaelement-and-player.js'
                ]
            },
            options: {
                // Keep `warn` and other methods from the console API
                methods: ['log']
            }
        },
        uglify: {
            me: {
                src    : ['local-build/mediaelement.js'],
                dest   : 'local-build/mediaelement.min.js',
                banner : 'src/js/me-header.js'
            },
            mep: {
                src    : ['local-build/mediaelementplayer.js'],
                dest   : 'local-build/mediaelementplayer.min.js',
                banner : 'src/js/mep-header.js'
            },
            bundle: {
                src  : ['local-build/mediaelement-and-player.js'],
                dest : 'local-build/mediaelement-and-player.min.js'
            },
            options: {
                // Preserve comments that start with a bang (like the file header)
                preserveComments: "some"
            }
        },
        cssmin: {
            build: {
                src  : ['src/css/mediaelementplayer.css'],
                dest : 'local-build/mediaelementplayer.min.css'
            }
        },
        copy: {
            build: {
                expand  : true,
                cwd     : 'src/css/',
                src     : ['*.png', '*.svg', '*.gif', '*.css'],
                dest    : 'local-build/',
                flatten : true,
                filter  : 'isFile'
            }
        },
        replace: {
            cdnBuild: {
                src: ['src/flash/FlashMediaElement.as'],
                dest: 'tmp/FlashMediaElement.as',
                replacements: [{
                    from: '//Security.allowDomain("*");',
                    to:   'Security.allowDomain("*");'
                }, {
                    from: '//Security.allowInsecureDomain("*");',
                    to:   'Security.allowInsecureDomain("*");'
                }]
            }
        },
        clean: {
          build: ['local-build'],
          temp:  ['tmp']
        },

        // Task that compiles flashmediaelement.swf using the free Flex SDK on Linux/Mac.
        // There are a few prerequisite steps involved in running this task.
        //
        // 1) Install the Flex SDK version 4.6 (only needs to be done once)
        //   Download the free flex sdk from http://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204.6/
        //   Unzip it to a directory on your local machine (eg: /usr/local/flex_sdk_4.6)
        //   Create a symlink from the install location to this directory
        //   (eg: ln -s /usr/local/flex_sdk_4.6 mediaelement/src/flash)
        //
        // 2) Update the `flexPath` variable below to reflect the name of the symlink you created
        //
        // 3) Build the SWC file (only needs to be done if you have changed something in the FLA file)
        //   Open the FlashMediaElement.fla file in the Flash Professional IDE.
        //   Goto the menu item 'File->Publish Settings'
        //   Click the 'Flash' tab
        //   Make sure the box 'Export SWC' is checked
        //   Click 'Publish'
        //   Quit out of the Flash IDE
        //
        // 4) Run this task from the command line: `grunt shell:buildFlash`
        //
        // Note: There doesn't seem to be an available SWC library that defines the YouTube player API.
        //       Remove the -strict compiler option to see warnings coming from YouTube API calls.
        //
        flexPath: '../flex_sdk_4.6',
        buildFlashCommand: [
            '<%= flexPath %>/bin/mxmlc -strict=false -warnings=true',
            '<%= flashIn %> -o <%= flashOut %>',
            '-library-path+="<%= flexPath %>/lib"',
            '-include-libraries+=src/flash/flashmediaelement.swc',
            '-include-libraries+=src/flash/flashls.swc -use-network=true',
            '-headless-server -static-link-runtime-shared-libraries'
        ].join(" "),

        shell: {
            buildFlash: {
                command: function() {
                    grunt.config.set("flashIn", 'src/flash/FlashMediaElement.as');
                    grunt.config.set("flashOut", 'local-build/flashmediaelement.swf');
                    return grunt.config.get("buildFlashCommand");
                }
            },
            buildFlashCDN: {
                command: function() {
                    grunt.config.set("flashIn", 'tmp/FlashMediaElement.as');
                    grunt.config.set("flashOut", 'local-build/flashmediaelement-cdn.swf');
                    return grunt.config.get("buildFlashCommand");
                }
            }
        }
    });


    grunt.registerTask('default', ['concat', 'removelogging', 'uglify', 'cssmin', 'copy',
        'shell:buildFlash', 'replace:cdnBuild', 'shell:buildFlashCDN', 'clean:temp']);

};