module.exports = function(grunt) {
  grunt.initConfig({
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
        src: [
          'assets/js/app.js',
          'assets/js/ui.js',
          'assets/js/api.js'
        ],
        dest: 'assets/js/production.js',
        options: {
          banner: ';(function($) {',
          footer: '})(jQuery);'
        }
      }
    },
    watch: {
      css: {
        files: 'assets/scss/**.scss',
        tasks: 'sass'
      },
      scripts: {
        files: ['assets/js/app.js', 'assets/js/api.js', 'assets/js/ui.js'],
        tasks: 'concat'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concat', 'sass']);
}
