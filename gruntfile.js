module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'nested'
        },
        files: {
          'dist/assets/css/app.css': 'src/scss/app.scss'
        }
      }
    },
  concat: {
      dist: {
        src: [
          'src/js/app.js',
          'src/js/ui.js',
          'src/js/api.js'
        ],
        dest: 'dist/assets/js/production.js',
        options: {
          banner: ';(function($) {',
          footer: '})(jQuery);'
        }
      }
    },
    copy: {
      html: {
        files: [
          {src: 'index.html', dest: 'dist/assets/'},
          {src: 'libs/', dest: 'dist/assets/js/'}
        ]
      }
    },
    watch: {
      css: {
        files: 'src/scss/**.scss',
        tasks: 'sass'
      },
      scripts: {
        files: ['src/js/app.js', 'src/js/api.js', 'src/js/ui.js'],
        tasks: 'concat'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concat', 'sass', 'copy']);
}
