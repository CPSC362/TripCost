module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('grunt.json'),

        concat: {
            css: {
                src: [
                    'assets/css/vendor/bootstrap.css',
                    'assets/css/style.css'
                ],
                dest: 'assets/css/combined.css'
            },

            js: {
                src: [
                    'assets/js/vendor/jquery-2.0.3.js',
                    'assets/js/vendor/bootstrap.js',
                    'assets/js/vendor/handlebars-v1.3.0.js',
                    'assets/js/vendor/v3_epoly.js',
                    'assets/js/marker-generator.js',
                    'assets/js/vendor/EdmundsAPI-sdk-javascript/edmunds.api.sdk.js',
                    'assets/js/trip-cost.js',
                    'assets/js/vehicle.js',
                    'assets/js/fuel-economy.js',
                    'assets/js/persistence.js',
                    'assets/js/main.js'
                ],
                dest: 'assets/js/dist/combined.js'
            }
        },

        cssmin: {
            css: {
                src: 'assets/css/combined.css',
                dest: 'assets/css/combined.min.css'
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
            files: ['assets/js/*', 'assets/css/*'],
            tasks: [
                'concat:css',
                'cssmin:css',
                'concat:js',
                'uglify:js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', [
        'concat:css',
        'cssmin:css',
        'concat:js',
        'uglify:js'
    ]);
};