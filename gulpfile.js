var gulp = require('gulp');

var uglify = require('gulp-uglify');
var pump = require('pump');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
//var es6transpiler = require('gulp-es6-transpiler');
var babel = require('gulp-babel');
var tsc = require('gulp-typescript');
var cssnano = require('gulp-cssnano');
var gVersionAppend = require('gulp-version-append');
var htmlmin = require('gulp-htmlmin');
var gulpSequence = require('gulp-sequence');
var jsonminify = require('gulp-jsonminify');
var concat = require('gulp-concat');
var run = require('gulp-run');
var spawn = require('child_process').spawn;


gulp.task('version-client-scripts', function () {
    return gulp.src('./src/client/**/*.js')
        .pipe(gVersionAppend(['json'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(rename({ suffix: '.ver' })).pipe(gulp.dest("./temp/scripts/"))
});

gulp.task('version-html', function () {
    return gulp.src('./src/html/*.html')
        .pipe(gVersionAppend(['html', 'js', 'css'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(gulp.dest("./temp/html"))
});

gulp.task('version-gen-main-html', function () {
    return gulp.src('./dist/out-html/*.html')
        .pipe(gVersionAppend(['html', 'js', 'css'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(gulp.dest("./temp/html"))
});

gulp.task('version-gen-course-html', function () {
    return gulp.src('./dist/out-html/course/*.html')
        .pipe(gVersionAppend(['html', 'js', 'css'], { appendType: 'version', versionFile: 'version.json' }))
        .pipe(gulp.dest("./temp/html/course"))
});

gulp.task('version', [`version-client-scripts`, `version-html`, `version-gen-main-html`, `version-gen-course-html`], function () {
    console.log('versioning files');
});

gulp.task('main-html', function () {
    return gulp.src('temp/html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('course-html', function () {
    return gulp.src('temp/html/course/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./course/'));
});

gulp.task('scripts', function (cb) {
    pump(
        [
            gulp.src('temp/scripts/*.ver.js'),
            babel({
                presets: ['env']
            }),
            uglify(),
            concat('all.js'),
            rename({ suffix: '.min' }),
            gulp.dest('./scripts/')
        ],
        cb
    );
    /*return gulp.src('temp/scripts/*.ver.js')
        //.pipe(babel())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' })).pipe(gulp.dest("./scripts/"));
        */
});

gulp.task('tsc', function () {
    var tsProject = tsc.createProject('tsconfig.json');
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist/out-tsc'));
});


gulp.task('gen-index', function () {
    spawn('node', ['dist/out-tsc/index-builder.js'], { stdio: 'inherit' });
});

gulp.task('gen-details', function () {
    spawn('node', ['dist/out-tsc/detail-builder.js'], { stdio: 'inherit' });
});

gulp.task('gen', ['gen-index', 'gen-details'], function () {
    console.log('Generating html files');
});

gulp.task('json', function () {
    return gulp.src(['src/coursesdata.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
    return gulp.src('styles/style.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' })).pipe(gulp.dest("./styles/"));
});


gulp.task('minify', ['scripts', 'styles', 'main-html', 'course-html'], function () {
    console.log('Minifying files');
});

gulp.task('build', gulpSequence('tsc', 'gen', 'version', 'minify'));