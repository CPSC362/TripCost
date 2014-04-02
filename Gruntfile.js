module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('grunt.json'),

        concat: {
            css: {
                src: [
                    'assets/css/vendor/bootstrap.css',
                    'assets/css/style.css'
                ],
                dest: 'assets/css/dist/combined.css'
            },

            js: {
                src: [
                    // Vendor JS
                    'bower_components/jquery/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/handlebars/handlebars.runtime.js',
                    'bower_components/momentjs/moment.js',
                    'assets/js/vendor/v3_epoly.js',
                    'assets/js/vendor/EdmundsAPI-sdk-javascript/edmunds.api.sdk.js',

                    // Utility JS
                    'assets/js/handlebars-helpers.js',
                    'assets/js/momentjs-helpers.js',
                    'assets/js/jquery-helpers.js',

                    // Developer JS
                    'assets/js/marker-generator.js',
                    'assets/js/trip-cost.js',
                    'assets/js/vehicle.js',
                    'assets/js/fuel-economy.js',
                    'assets/js/gas-feed.js',
                    'assets/js/persistence.js',
                    'assets/js/main.js',

                    // Handlebars Templates
                    'assets/js/.tmp/templates.js'
                ],
                dest: 'assets/js/dist/combined.js'
            }
        },

        cssmin: {
            css: {
                src: 'assets/css/dist/combined.css',
                dest: 'assets/css/dist/combined.min.css'
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: 'TripCostTemplates',
                    processName: function(filePath) {
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1].replace(/\.[^/.]+$/, "");
                    }
                },
                files: {
                    'assets/js/.tmp/templates.js': 'assets/templates/**/*.hbs'
                }
            },
            compilerOptions: {
                knownHelpers: {
                    "formatNumber": true
                },
                knownHelpersOnly: true
            }
        },

        uglify: {
            js: {
                files: {
                    'assets/js/dist/combined.min.js': ['assets/js/dist/combined.js']
                }
            }
        },

        watch: {
            files: ['assets/js/*', 'assets/css/*', 'assets/templates/*'],
            tasks: [
                'concat:css',
                'cssmin:css',
                'handlebars',
                'concat:js',
                'uglify:js'
            ],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.registerTask('default', [
        'concat:css',
        'cssmin:css',
        'handlebars',
        'concat:js',
        'uglify:js'
    ]);
};