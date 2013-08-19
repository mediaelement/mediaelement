module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
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
                    'src/js/me-i18n-locale-de.js',
                    'src/js/me-i18n-locale-zh.js'
                ],
                dest: 'build/mediaelement.js'
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
                    'src/js/mep-feature-tracks.js',
                    'src/js/mep-feature-contextmenu.js',
                    'src/js/mep-feature-postroll.js'
                ],
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
        uglify: {
            me: {
                src    : ['build/mediaelement.js'],
                dest   : 'build/mediaelement.min.js',
                banner : 'src/js/me-header.js'
            },
            mep: {
                src    : ['build/mediaelementplayer.js'],
                dest   : 'build/mediaelementplayer.min.js',
                banner : 'src/js/mep-header.js'
            },
            bundle: {
                src  : ['build/mediaelement-and-player.js'],
                dest : 'build/mediaelement-and-player.min.js'
            }
        },
        cssmin: {
            build: {
                src  : ['src/css/mediaelementplayer.css'],
                dest : 'build/mediaelementplayer.min.css'
            }
        },
        copy: {
            build: {
                src     : ['src/css/*.png', 'src/css/*.svg', 'src/css/*.gif', 'src/css/*.css'],
                dest    : 'build/',
                flatten : true,
                filter  : 'isFile'
            }
        }
    });

    
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);

};