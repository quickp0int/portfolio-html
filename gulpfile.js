var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var fileinclude = require('gulp-file-include');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var beeper = require('beeper');
var gcmq = require('gulp-group-css-media-queries');
var cleanCSS = require('gulp-clean-css');
var purgecss = require('gulp-purgecss');

gulp.task('css', function() {
  return gulp.src('src/scss/stylesheet.scss')
    .pipe(plumbError())    
    .pipe(sass())
      .pipe(purgecss({content:['*.html']}))
      .pipe(gcmq())
      .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('fileinclude', async function() {
  gulp.src(['./src/html/**/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  // once processed, browserSync will reload them
  gulp.watch('./src/html/**/*', gulp.series('fileinclude')).on('change', function() {browserSync.reload()});

  // watch, compile and stream the CSS
  gulp.watch('src/scss/stylesheet.scss', gulp.series('css'));
});

function plumbError() {
  return plumber({
    errorHandler: function(err) {
      notify.onError({
        templateOptions: {
          date: new Date()
        },
        title: "Gulp error in " + err.plugin,
        message:  err.formatted
      })(err);
      beeper();
      this.emit('end');
    }
  })
}
