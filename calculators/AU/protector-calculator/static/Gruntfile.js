module.exports = function(grunt) {

    var globalConfig = {
        jsSrc:       'dev/js',
        jsDest:      'dist/js',
        lessSrc:     'dev/less',
        cssDest:     'dist/css',
        iconSrc:     'img/icons',
        webfontDest: 'fonts',
        imgSrc:      'img'
    };

    grunt.initConfig({

        globalConfig: globalConfig,

        // Read in the package details
        pkg: grunt.file.readJSON('package.json'),

        // JS linting
        jshint: {
            grunt: ["Gruntfile.js"],
            app:   ["<%= globalConfig.jsSrc %>/core.js"]
        },

        // Uglify Javascript files
        uglify: {
            options: {
                sourceMapPrefix: true,
                sourceMapRoot: '../..',
                sourceMappingURL: function(a) {
                    return a.replace(/^httpdocs/, '').replace(/\.min\.js/, '.map.js');
                },
                report:'min'
            },
            production: {
                options: { sourceMap: '<%= globalConfig.jsDest %>/optimized.map.js' },
                files: {
                    '<%= globalConfig.jsDest %>/combined.min.js':
                        [
                            '<%= globalConfig.jsSrc %>/libs/jquery-1.9.1.min.js',
                            '<%= globalConfig.jsSrc %>/libs/jquery.responsiveTabs.js',
                            '<%= globalConfig.jsSrc %>/libs/jquery.matchHeight-min.js',
                            '<%= globalConfig.jsSrc %>/libs/jquery.debouncedresize.js',
                            '<%= globalConfig.jsSrc %>/libs/imagesloaded.js',
                            '<%= globalConfig.jsSrc %>/libs/hoverintent.js',
                            '<%= globalConfig.jsSrc %>/libs/icheck.js',                           // Radio and checkbox styles
                            '<%= globalConfig.jsSrc %>/libs/jquery.carouFredSel-6.2.1-packed.js', // Carousel
                            '<%= globalConfig.jsSrc %>/libs/jquery.fancybox-1.3.4.pack.js', // Im so fancy
                            '<%= globalConfig.jsSrc %>/libs/jquery.validate.min.js', // validation
                            '<%= globalConfig.jsSrc %>/libs/picturefill.min.js',
                            '<%= globalConfig.jsSrc %>/libs/jquery.touchSwipe.min.js',

                            '<%= globalConfig.jsSrc %>/core.js',

                            '<%= globalConfig.jsSrc %>/modules/home.js',
                            '<%= globalConfig.jsSrc %>/modules/accordion.js',
                            '<%= globalConfig.jsSrc %>/modules/nav.js',
                            '<%= globalConfig.jsSrc %>/modules/gallery.js',
                            '<%= globalConfig.jsSrc %>/modules/tabs.js',
                            '<%= globalConfig.jsSrc %>/modules/faq.js'
                        ]
                }
            },
            calculator: {
                options: { sourceMap: '<%= globalConfig.jsDest %>/calculator.map.js' },
                files: {
                    '<%= globalConfig.jsDest %>/calculator.min.js':
                        [
                            '<%= globalConfig.jsSrc %>/libs/snap.svg.js',
                            '<%= globalConfig.jsSrc %>/libs/underscore.js',
                            '<%= globalConfig.jsSrc %>/libs/backbone.js',
                            '<%= globalConfig.jsSrc %>/libs/backbone.marionette.js',
                            '<%= globalConfig.jsSrc %>/calculator.js'
                        ]
                }
            }
        },


        //  Less compilation
        less: {
            production: {
                options: {
                    paths: ["<%= globalConfig.lessSrc  %>"],
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: '<%= globalConfig.cssDest  %>/core.css.map',
                    sourceMapURL: '<%= globalConfig.cssDest  %>/core.css.map',
                    outputSourceFiles: true,
                    cleancss: true
                },
                files: {
                    "<%= globalConfig.cssDest  %>/core.css": "<%= globalConfig.lessSrc  %>/core.less"
                }
            },
            ie: {
                options: {
                    paths: ["<%= globalConfig.lessSrc  %>"],
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: '<%= globalConfig.cssDest  %>/ie.css.map',
                    sourceMapURL: '<%= globalConfig.cssDest  %>/ie.css.map',
                    outputSourceFiles: true,
                    cleancss: true
                },
                files: {
                    "<%= globalConfig.cssDest  %>/ie.css": "<%= globalConfig.lessSrc  %>/ie.less"
                }
            }
        },

        // Lint LESS
        // lesslint: {
        //     src: ['<%= globalConfig.lessSrc  %>/core.less']
        // },

        // Automatically add css vendor prefixes
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            production: {
                options: {
                    map: true
                },
                src: '<%= globalConfig.cssDest  %>/core.css',
                dest: '<%= globalConfig.cssDest  %>/core.css'
            },
        },

        // Generates icon fonts from a directory of SVG files.
        webfont: {
            production: {
                src: '<%= globalConfig.iconSrc  %>/*',
                dest: '<%= globalConfig.webfontDest  %>/',
                destCss: '<%= globalConfig.lessSrc  %>/modules/',
                options: {
                    stylesheet: 'less',
                    relativeFontPath: '../../fonts/',
                    types: 'eot,woff,ttf,svg',
                    engine: 'node'
                }
            }
        },

        sprite:{
            all: {
                src: '<%= globalConfig.iconSrc %>/*.png',
                destImg: '<%= globalConfig.imgSrc %>/sprite.png',
                destCSS: '<%= globalConfig.lessSrc  %>/modules/sprite.less',
                padding: 30,
                imgPath: '../../img/sprite.png'
            },
            retina: {
                src: '<%= globalConfig.iconSrc %>/retina/*.png',
                destImg: '<%= globalConfig.imgSrc %>/sprite@2x.png',
                destCSS: '<%= globalConfig.lessSrc  %>/modules/sprite-retina.less',
                padding: 60,
                imgPath: '../../img/sprite@2x.png'
            },
            transform: {
                src: '<%= globalConfig.imgSrc %>/transform/sprites/*.png',
                destImg: '<%= globalConfig.imgSrc %>/transform/sprite.png',
                destCSS: '<%= globalConfig.lessSrc  %>/modules/sprite-transform.less',
                padding: 30,
                imgPath: '../../img/transform/sprite.png'
            },
            transformRetina: {
                src: '<%= globalConfig.imgSrc %>/transform/sprites/retina/*.png',
                destImg: '<%= globalConfig.imgSrc %>/transform/sprite@2x.png',
                destCSS: '<%= globalConfig.lessSrc  %>/modules/sprite-transform-retina.less',
                padding: 60,
                imgPath: '../../img/transform/sprite@2x.png'
            }
        },

        // Watch and rebuild files
        watch: {
            svg: {
                files: ['<%= globalConfig.iconSrc  %>/*.svg'],
                tasks: ['webfont']
            },
            less: {
                files: ['<%= globalConfig.lessSrc  %>/**/*.less'],
                tasks: ['less', 'autoprefixer']
            },
            javascript: {
                files: ['<%= globalConfig.jsSrc %>/core.js', '<%= globalConfig.jsSrc %>/modules/*.js'],
                tasks: ['jshint', 'uglify:production']
            },
            calculator: {
                files: ['<%= globalConfig.jsSrc %>/calculator.js'],
                tasks: ['jshint', 'uglify:calculator']
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['jshint']
            }
        },

        // Simple server for local testing localhost:8000 by running `grunt connect watch`
        connect: {
            server: {
                options: {
                    base: 'web'
                }
            }
        },


        styleguide: {
            styledocco: {
                options: {
                    framework: {
                        name: 'kss'
                    },
                    name: 'Style Guide',
                    template: {
                        src: '<%= globalConfig.lessSrc  %>/styleguide_template'
                    }
                },
                files: {
                    '<%= globalConfig.lessSrc  %>/styleguide': '<%= globalConfig.lessSrc  %>/core.less'
                },
            }
        }

    });

    // Third party modules
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-styleguide');

    // Register default task
    grunt.registerTask('default', ['jshint', 'autoprefixer', 'less', 'uglify', 'sprite', 'styleguide']);

};
