LIVERELOAD_PORT = 35728;

module.exports = function(grunt) {
  grunt.initConfig({
    app: '.',
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'nested'
        },
        files: {
          'assets/css/app.css': 'assets/scss/app.scss'
        }
      }
    },
    concat: {
      dist: {
        src: ['assets/js/app.js', 'assets/js/api.js'],
        dest: 'assets/js/production.js'
      }
    },
    watch: {
      css: {
        files: 'assets/scss/**.scss',
        tasks: 'sass',
        options: {
          livereload: LIVERELOAD_PORT
        }
      },
      scripts: {
        files: ['assets/js/app.js', 'assets/js/api.js'],
        options: {
          livereload: LIVERELOAD_PORT
        },
        tasks: 'concat'
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          "**/*.html"
        ]
      }
    },
    open: {
      server: {
        url: "http://localhost:<%= connect.server.options.port %>"
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          livereload: LIVERELOAD_PORT,
          base: {
            path: '.',
            options: {
              index: 'index.html',
              maxAge: 300000
            }
          }
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('serve', ['concat', 'connect:server', 'open', 'watch']);
}
