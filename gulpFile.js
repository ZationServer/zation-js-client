const gulp            = require('gulp');
const typescript      = require('gulp-typescript');
const browserify      = require('browserify');
const babel           = require('gulp-babel');
const derequire       = require('gulp-derequire');
const insert          = require('gulp-insert');
const rename          = require('gulp-rename');
const source          = require('vinyl-source-stream');
const uglifyes        = require('uglify-es');
const composer        = require('gulp-uglify/composer');
const ignore          = require('browserify-ignore-code');
const uglify          = composer(uglifyes, console);
const convertNewline  = require('gulp-convert-newline');
const tscConfig       = require('./tsconfig.json');
const DIST            = './dist/';
const VERSION         = require('./package.json').version;

const HEADER = (
    '/**\n' +
    ' * Zation JavaScript client version:' + VERSION + '\n' +
    ' */\n');

gulp.task('ts', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist'));
});

gulp.task('cof', function() {
    return gulp
        .src(['src/**/*','!src/**/*.ts','!src/**/*.scss'])
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function() {
    return new Promise(((resolve) =>
    {
        let stream = browserify({
            transform: [[ignore]],
            builtins: ['_process', 'events', 'buffer', 'querystring'],
            entries: 'index.js',
            standalone: 'zation'
        })
            .ignore('_process')
            .ignore('zationReader.js')
            .bundle();

        stream.pipe(source('zation.js'))
            .pipe(convertNewline({
                newline: 'lf',
                encoding: 'utf8'
            }))
            .pipe(derequire())
            .pipe(insert.prepend(HEADER))
            .pipe(gulp.dest(DIST));
        resolve();
    }));
});

gulp.task('minify', function() {
    return gulp.src(DIST + 'zation.js')
        .pipe(babel({
            comments: false
        }))
        .pipe(babel({
            plugins: ['minify-dead-code-elimination']
        }))
        .pipe(uglify())
        .pipe(insert.prepend(HEADER))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(DIST))
});

gulp.task('compile', ['cof','ts'], () =>
{
    // noinspection JSUnresolvedFunction
    gulp.start('browserVersion');

});

gulp.task('browserVersion', ['browserify'], () =>
{
    // noinspection JSUnresolvedFunction
    gulp.start('minify');

});

gulp.task('default', ['compile', 'watch']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['ts']);
    gulp.watch(['src/**/*','!src/**/*.ts','!src/**/*.scss'], ['cof']);
});