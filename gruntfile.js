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
    watch: {
      css: {
        files: 'assets/scss/**.scss',
        tasks: 'sass'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', []);
}
