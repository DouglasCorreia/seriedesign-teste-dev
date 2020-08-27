"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const gulp = require("gulp");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const image = require('gulp-image');
const mergeMedia = require('gulp-merge-media-queries');
const stripCssComments = require('gulp-strip-css-comments');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    //proxy: "localhost:8888/objetiva/"
    proxy: "pet-store.test:8888/"
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Font Awesome
  var fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
    .pipe(gulp.dest('assets/vendor/fontawesome-free/css'));
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(gulp.dest('assets/vendor/fontawesome-free/webfonts'));

  // jQuery
  var jquery = gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('assets/vendor/jquery'));

  return merge(fontAwesomeCSS, fontAwesomeWebfonts, jquery);
}

// CSS task
function css() {
  return gulp
    // Find the file
    .src('assets/scss/**/style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(stripCssComments())
    .pipe(mergeMedia({
      log: true
    }))
    .pipe(gulp.dest("./assets/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./assets/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    // Find the file
    .src([
      './assets/js/*.js',
      '!./assets/js/*.min.js'
    ])
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/js'))
    .pipe(browsersync.stream());
}

// Image minify
function imageMinify() {
  return gulp.src('assets/images/*')
    .pipe(image())
    .pipe(gulp.dest('assets/images'))
}

// Watch files
function watchFiles() {
  gulp.watch("assets/scss/**/*", css);
  gulp.watch(["assets/js/**/*", "!./assets/js/**/*.min.js"], js);
  gulp.watch("./**/*{.html,.php}", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.imageMinify = imageMinify;