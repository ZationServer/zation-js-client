const gulp            = require('gulp');
const browserify      = require('browserify');
const babel           = require('gulp-babel');
const derequire       = require('gulp-derequire');
const insert          = require('gulp-insert');
const rename          = require('gulp-rename');
const source          = require('vinyl-source-stream');
const uglify          = require('gulp-uglify');
const convertNewline  = require('gulp-convert-newline');

const DIST = './';
const VERSION = require('./package.json').version;

const HEADER = (
    '/**\n' +
    ' * Zation JavaScript client version:' + VERSION + '\n' +
    ' */\n');

gulp.task('browserify', function() {
    let stream = browserify({
        builtins: ['_process', 'events', 'buffer', 'querystring'],
        entries: 'index.js',
        standalone: 'zation'
    })
        .ignore('_process')
        .bundle();

    return stream.pipe(source('zation.js'))
        .pipe(convertNewline({
            newline: 'lf',
            encoding: 'utf8'
        }))
        .pipe(derequire())
        .pipe(insert.prepend(HEADER))
        .pipe(gulp.dest(DIST));
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