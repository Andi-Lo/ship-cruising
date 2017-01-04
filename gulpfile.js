'use strict';

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')({
    pattern: '*',
    rename: {
        'run-sequence': 'runSequence',
        'browserSync': 'browser-sync',
        'browserify': 'browserify',
        'vinyl-buffer': 'buffer',
        'babelify': 'babelify',
        'eslint': 'gulp-eslint',
        'vinyl-source-stream': 'source'
      }
    }
);

gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe($.connect.reload());
});

gulp.task('css', function() {
  gulp.src('./src/**/*.css')
    .pipe($.connect.reload());
});

function swallowError(error) {
  // If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

gulp.task('lint', function() {
  return gulp.src(['./src/js/**/*.js', '!./src/js/!bundle.js', '!./src/js/!bundle.js.map'])
    .pipe($.eslint({}))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe($.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe($.eslint.failAfterError());
});

gulp.task('build', ['lint'], function() {
  return $.browserify('./src/js/app.js')
    .transform("babelify")
    .bundle()
    .on('error', swallowError)
    .pipe($.source('bundle.js'))
    .pipe($.buffer())
    .pipe($.sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./src/js/'))
    .pipe($.connect.reload());
});

gulp.task('build-dev', ['lint'], function() {
  return $.browserify('./src/js/app.js')
    .transform("babelify")
    .bundle()
    .pipe($.source('bundle.min.js'))
    .pipe($.buffer())
    .pipe($.uglify({mangle: false}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.start('build');
  gulp.watch(['./src/js/**/*.js', '!./src/js/bundle.js'], ['build']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/**/*.css', ['css']);
});

gulp.task('serve', function(event) {
  $.connect.server({
    baseDir: "./src",
    root: '.',
    port: 3000,
    livereload: true
  });
  gulp.start('watch');
});

gulp.task('default', ['serve']);
