var gulp = require('gulp'),
  googleWebFonts = require('gulp-google-webfonts'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  zip=require('gulp-gzip');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');

gulp.task('svgstore', function () {
  var country="Belgium,Bulgaria,Croatia,Cyprus,Czech Republic,Denmark,Estonia,Finland,France,Germany,Greece,Hungary,Ireland,Italy,Latvia,Lithuania,Luxembourg,Malta,Netherlands,Poland,Portugal,Romania,Slovakia,Slovenia,Spain,Sweden,United Kingdom,Austria";
  var iso="ie,fr,de";
  var files=[];
  iso.split(",").map((c)=>{ files.push("img/country/"+c+".svg")});
  console.log(files);
    return gulp
        .src(files)
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  var options = {
	fontsDir: 'fonts/',
	cssDir: 'css/',
	cssFilename: 'fonts.css',
  relativePaths: true
  };
	return gulp.src('./src/fonts.list')
		.pipe(googleWebFonts(options))
		.pipe(gulp.dest('dist'))
		;
	});

gulp.task('html',function(){
  return gulp
    .src(['src/index.html'])
    .pipe(htmlmin({
        collapseWhitespace: true
    }))

    .pipe(gulp.dest('./dist/'));
});

gulp.task('css',function(){
  return gulp
    .src([
      'css/dc.css'
      ,'src/dcfix.css'
      ,'node_modules/daemonite-material/css/material.css'
    ], { base: 'node_modules' })
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(zip({gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('dc-copy',function(){
  return gulp
    .src([
      'node_modules/crossfilter2/crossfilter.js',
      'node_modules/reductio/reductio.js',
      'node_modules/d3/dist/d3.js',
      'node_modules/d3-queue/build/d3-queue.js',
      'node_modules/d3-tip/dist/index.js',
      'node_modules/dc/dc.js'
    ], { base: 'node_modules' })
    .pipe(sourcemaps.init())
    .pipe(concat('dcbundle.js'))
//    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(zip({gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-copy',function(){
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/popper.js/dist/umd/popper.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/daemonite-material/js/material.js'
    ], { base: 'node_modules' })
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(zip({gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('./dist/js/'));
});


gulp.task('css-minify',['css-compile'], function() {
    gulp.src(['./dist/css/*.css', '!dist/css/*.min.css'])
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./dist/css'))
      .pipe(zip({gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('./dist/css/'));
});


gulp.task('default', ['fonts','css-copy','js-copy']);

