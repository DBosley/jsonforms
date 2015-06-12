module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Config for Concat Task
        concat: {
            options: {
                // Remove all existing banners
                stripBanners: true,

                // Replace all 'use strict' statements in the code with a single one at the top
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },

                // Add new banner on top of generated file
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> Copyright (c) EclipseSource Muenchen GmbH and others. */ \n' +
                "'use strict';\n"
            },
            dist: {
                // Concat all files from js directory
                src: ['js/**'],
                filter: 'isFile',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        copy: {
            dist: {
                files: [
                    // templates
                    {expand:true, cwd: 'templates/', src: ['**'], dest: 'dist/templates'}
                ]
            },
            app: {
                files: [
                    // dist to app
                    {expand:true, cwd: 'dist/', src: ['**'], dest: 'app'},
                ]
            }
        },

        // Config for Uglify (= Minify) Task
        uglify: {
            options: {
                // Use default

                // Uncomment to ease debugging
                // mangle: false
            },
            dist: {
                src: 'dist/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },

        // Config for Jshint Task
        jshint: {
            beforeconcat: ['js/**'],
            afterconcat: ['dist/js/<%= pkg.name %>.js'],
            options: { jshintrc: '.jshintrc' }
        },

        less: {
            bootstrap: {
                options: {
                    modifyVars: {
                        "grid-columns": 100
                    }
                },
                files: {
                    'temp/bootstrap100col.css': 'node_modules/bootstrap/less/bootstrap.less'
                }
            },
            jsonforms: {
                options: {
                    paths: ['temp']
                },
                files: {
                    'dist/css/jsonforms.css': 'css/jsonforms.css'
                }
            }
        },

        // Config for Karma (Unit Test) Task
        karma: {
            unit: {
                configFile: 'tests/unit-tests/karma.conf.js',
                singleRun: true
            }
        },

        // Config for Connect (Start Webserver) Task
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'app'
                }
            }
        },

        // Config for Protractor (e2e Test) Task
        protractor: {
            options: {
                configFile: 'tests/e2e-tests/protractor.conf.js'
            },
            run: {}
        },

        watch: {
            js: {
                files: 'js/**',
                tasks: ['concat:dist', 'uglify:dist']
            },
            css: {
                files: 'css/**',
                tasks: ['less:bootstrap', 'less:jsonforms']
            },
            templates: {
                files: 'templates/**',
                tasks: ['copy:dist']
            },
            app: {
                files: ['dist/**'],
                tasks: ['copy:app']
            }
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-less');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    // Load the plugin that provides the "connect" task.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Load the plugin that provides the "protractor" task.
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.loadNpmTasks('grunt-contrib-watch');

    // Build distribution
    grunt.registerTask('dist', [
        'less:bootstrap',
        'less:jsonforms',
        'concat:dist',
        'uglify:dist',
        'copy:dist',
    ]);

    // Build example application
    grunt.registerTask('app', [
        'dist',
        'copy:app'
    ]);

    // Test unit and e2e tests
    grunt.registerTask('test', [
        'karma',
        'connect',
        'protractor'
    ]);

    // Hint task
    grunt.registerTask('hint', [
        'jshint'
    ]);

    // Build distribution as default
    grunt.registerTask('default', [
        'dist'
    ]);

};