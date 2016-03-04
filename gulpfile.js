// Gulp
// =======================================================
// Installation:
// $ npm install gulp -g
//
// Gulp Tutorials:
// - http://gulpjs.com
// - https://laracasts.com/lessons/gulp-this
// - http://markgoodyear.com/2014/01/getting-started-with-gulp
// =======================================================

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    livereload   = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    connect      = require('gulp-connect'),
    zip          = require('gulp-zip'),
    del          = require('del');

$exec   = require('child_process').exec;

var paths_dir = {
  docs: 'docs',
  docsasset: 'assets',
  site: 'dev',
  templates : 'templates',
  dist: 'dist',
  sitejs: 'js',
  sitecss: 'css',
  sitesass: 'scss'
};

var paths = {
  docs: paths_dir.docs,
  docsasset: paths_dir.docs + '/' + paths_dir.docsasset,
  site: paths_dir.site,
  templates: paths_dir.site + '/' + paths_dir.templates,
  dist: paths_dir.dist,
  sitejs: paths_dir.site + '/' + paths_dir.sitejs,
  sitecss: paths_dir.site + '/' + paths_dir.sitecss,
  sitesass: paths_dir.site + '/' + paths_dir.sitesass
};


// ===================================================
// Styles
// ===================================================

gulp.task('sass', function() {
  var stream = gulp.src(paths.sitesass + '/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitesass))
    .pipe(connect.reload());

  return stream;
});


// ===================================================
// Server
// ===================================================

gulp.task('serve', function() {
  connect.server({
    root: ['index.html'],
    port: 9001,
    livereload: true
  });

  $exec('open http://localhost:9001');
});


gulp.task('watch', function() {
  gulp.watch('dev/scss/**.scss', ['sass']);
});

gulp.task('cleandev', function(cb) {
  del([
    'dev/scss/*.css',
    'dev/scss/*.css.map'
  ], cb);
});

gulp.task('cleandist', function(cb) {
  del([
    'dist/scss/styles.scss'
  ], cb);
});

gulp.task('copy', function() {
  gulp.src('dev/css/**')
    .pipe(gulp.dest('dist/css'));

  gulp.src('dev/scss/**')
    .pipe(gulp.dest('dist/scss'));

  gulp.src('license.txt')
    .pipe(gulp.dest('dist'));

  gulp.src('dev/*.{md,json}')
    .pipe(gulp.dest('dist'));

  gulp.src('README.md')
    .pipe(gulp.dest('dist'));
});

gulp.task('zipit', function() {
  return gulp.src('dev/scss/**.scss')
    .pipe(zip('typeplate-sk.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['serve', 'watch']);
gulp.task('prep', ['cleandev']);
gulp.task('build', ['zipit', 'copy']);
gulp.task('ship', ['cleandist']);
