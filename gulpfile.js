var gulp = require('gulp');

var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var es6transpiler = require('gulp-es6-transpiler');
var cssnano = require('gulp-cssnano');
var gVersionAppend = require('gulp-version-append');
var htmlmin = require('gulp-htmlmin');
var gulpSequence = require('gulp-sequence')


gulp.task('version-main-vm', function () {
    return gulp.src('./scripts/main-vm.js')
        .pipe(gVersionAppend(['json'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(rename({ suffix: '.ver' })).pipe(gulp.dest("./scripts/"))
});

gulp.task('version-html', function () {
    return gulp.src('./src/*.html')
        .pipe(gVersionAppend(['html', 'js', 'css'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(gulp.dest("./temp"))
});

gulp.task('version', [`version-main-vm`, `version-html`], function () {
    console.log('versioning files');
})


gulp.task('html', function () {
    return gulp.src('temp/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./'));
});


gulp.task('scripts', function () {
    return gulp.src('scripts/main-vm.ver.js')
        .pipe(es6transpiler())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' })).pipe(gulp.dest("./scripts/"));
});

gulp.task('styles', function () {
    return gulp.src('styles/style.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' })).pipe(gulp.dest("./styles/"));
});


gulp.task('minify', ['scripts', 'styles', 'html'], function () {
    console.log('Minifying files');
});

gulp.task('build', gulpSequence('version', 'minify'));