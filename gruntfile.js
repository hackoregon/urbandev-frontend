// TODO: Uglify (minify) *.js files (https://github.com/gruntjs/grunt-contrib-uglify).
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/'], // Deletes dist/ directory, which contains the results of build process.
    jshint: {
      // Verifies the code written for this project, but not the libs.
      files: ['Gruntfile.js', 'src/js/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    sass: {
      dist: {
        options: {
          // Output style is one of: [nested, compact, compressed, expanded].
          style: 'nested'
        },
        files: {
          'dist/css/app.css': 'src/scss/app.scss'
        }
      }
    },
    concat: {
      // Concatenates project-specific code into single file to improve performance.
      dist: {
        // Lists the source files in the order in which they are to be concatenated.
        src: [
          'src/js/app.js',
          'src/js/ui.js',
          'src/js/api.js'
        ],
        dest: 'dist/js/production.js',
        options: {
          banner: ';(function($) {',
          footer: '})(jQuery);'
        }
      }
    },
    copy: {
      // Copies files as-is, so no minifying, no concatenating, etc.
      dist: {
        files: [
          // 'flatten' means just copy the leaf file, not the whole path structure.
          {expand: true, flatten: true, src: 'src/index.html', dest: 'dist/'},
          /* Puts the libs/*.js files in the same directory as the project-specific code,
           * so all of the js files are at the same level in dist/js directory.
           */
          {expand: true, flatten: true,
            src: [
              'src/libs/*.js',
              'src/libs/leaflet-groupedlayercontrol/*.js',
              '!src/libs/taffy-orig.js', // TODO: Delete from source control? (no longer referenced)
              '!src/libs/taffy-safari-patch.patch' // TODO: Delete from source control? (no longer referenced)
            ],
            dest: 'dist/js/'},
          {expand: true, flatten: true, src: ['src/img/*'], dest: 'dist/img/'},
          {expand: true, flatten: true, src: ['src/css/*.css'], dest: 'dist/css/'},
          {expand: true, flatten: true,
            src: [
              'src/css/*.css',
              'src/libs/leaflet-groupedlayercontrol/*.css'
            ],
            dest: 'dist/css/'}
        ]
      }
    },
    watch: {
      // Runs tasks automatically when source files change.
      html: {
        files: 'src/index.html',
        tasks: ['copy']
      },
      css: {
        files: 'src/scss/*.scss',
        tasks: ['sass']
      },
      scripts: {
        files: [
          'src/js/api.js',
          'src/js/app.js',
          'src/js/ui.js'
        ],
        // TODO: Run jshint before 'concat'.
        tasks: ['concat']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // TODO: Run jshint before 'clean'.
  grunt.registerTask('default', ['clean', 'copy', 'concat', 'sass']);
};
