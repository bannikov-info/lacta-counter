"use strict";

var gulp = require('gulp'),
    stylus = require('gulp-stylus'), //плагин, обрабатывающий stylus-файлы
    concat = require('gulp-concat'), // плагин, объединяющий входящие файлы в один
    debug = require('gulp-debug'), // плагин для вывода отладочной информации
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    newer = require('gulp-newer'),
    autoprefixer = require('gulp-autoprefixer')

var isDevelopment = !process.env.NODE_ENV || (process.env.NODE_ENV == 'development');

var paths ={
  vendorJsSrc: [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-aria/angular-aria.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/md-letter-avatar/md-letter-avatar.js',
    'bower_components/angular-websql/angular-websql.min.js',
  ],
  vendorJsDest: 'dist/js/vendor.js',
  appJsSrc: [
    'app/src/lacta-counter/LactaCounter.js',
    'app/src/lacta-counter/LactationsController.js',
    'app/src/lacta-counter/LactationsService.js',
    'app/src/app.js'
  ]
};

gulp.task('app:js', function () {
  return gulp.src('app/src/**/*.js', {since: gulp.lastRun('app:assets')})
            .pipe(debug({title: 'app:js#src'}))
            .pipe(concat('app.js', {newLine: ';'}))
            .pipe(debug({title: 'app:js#concat'}))
            .pipe(gulp.dest('dist/js'));
});
gulp.task('vendor:js', function () {
  return gulp.src([
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-aria/angular-aria.js',
          'bower_components/angular-material/angular-material.js',
          'bower_components/md-letter-avatar/md-letter-avatar.js',
          'bower_components/angular-websql/angular-websql.min.js  '
        ]).pipe(debug({title: 'vendor:js#src'}))
          .pipe(concat('vendor.js', {newLine: ';'}))
          .pipe(debug({title: 'vendor:js#concat'}))
          .pipe(gulp.dest('dist/js'));
})


gulp.task('app:styles', function () {
  return gulp.src('app/assets/app.styl')
             .pipe(debug({title: 'app:styles#src'}))
             .pipe(gulpIf(isDevelopment, sourcemaps.init()))
             .pipe(stylus({'include css': true}))
             .pipe(debug({title: 'app:styles#stylus'}))
             .pipe(autoprefixer())
             .pipe(gulpIf(isDevelopment, sourcemaps.write()))
             .pipe(gulp.dest('dist/css'));
});

gulp.task('app:assets', function () {
  return gulp.src(['app/assets/**/*.*', '!app/assets/**/*.{css,styl}', 'app/**/*.*', '!app/src/**/*.*'],
                  {base: 'app', since: gulp.lastRun('app:assets')})
            .pipe(debug({title: 'app:assets#src'}))
            .pipe(newer('dist'))
            .pipe(debug({title: 'app:assets#newer'}))
            .pipe(gulp.dest('dist'));
})

gulp.task('vendor:styles', function () {
  return gulp.src([
    'bower_components/angular-material/angular-material.css'
  ]).pipe(debug({title: 'vendor:styles#src'}))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(concat('vendor.css')).pipe(debug({title: 'concat'}))
  .pipe(gulpIf(isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('styles', gulp.parallel('app:styles', 'vendor:styles'));
gulp.task('js', gulp.parallel('app:js', 'vendor:js'));

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'app:assets', 'js')));

gulp.task('watch', function () {
  gulp.watch('app/assets/**/*.{styl,css}', gulp.series('app:styles'));
  gulp.watch(['app/assets/**/*.*', '!app/assets/**/*.{css,styl}', 'app/**/*.*', '!app/src/**/*.*'],
              gulp.series('app:assets'));
  gulp.watch('app/src/**/*.*', gulp.series('app:js'))
});

gulp.task('dev', gulp.series('build', 'watch'));
