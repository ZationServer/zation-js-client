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
const ascjsify        = require('ascjsify');
const OptimizeJs      = require('gulp-optimize-js');
const clean           = require('gulp-clean');

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
        .pipe(gulp.dest(DIST));
});

gulp.task('cof', function() {
    return gulp
        .src(['src/**/*','!src/**/*.ts','!src/**/*.scss'])
        .pipe(gulp.dest(DIST));
});

gulp.task('browserify', function() {
        return browserify({
        transform: [[ignore]],
        builtins: ['_process', 'events', 'buffer', 'querystring'],
        entries: DIST+'index.js',
        standalone: 'Zation'
    })
        .transform(ascjsify, { global: true })
        .ignore('_process')
        .bundle()
        .on('error', function(err){
            console.error(err);
        })
        .pipe(source('zation.js'))
        .pipe(convertNewline({
            newline: 'lf',
            encoding: 'utf8'
        }))
        .pipe(derequire())
        .pipe(insert.prepend(HEADER))
        .pipe(derequire())
        .pipe(gulp.dest(DIST));
});

gulp.task('optimize', function () {
    return gulp
        .src('dist/**/*.js')
        .pipe(OptimizeJs())
        .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
    return gulp.src(DIST + 'zation.js')
        .pipe(babel({
            comments: false,
            compact : false
        }))
        .pipe(babel({
            plugins: ['minify-dead-code-elimination'],
            compact : false
        }))
        .pipe(uglify())
        .pipe(insert.prepend(HEADER))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(DIST))
});

gulp.task('cleanDist', function () {
    return gulp.src('dist', {read: false,allowEmpty : true})
        .pipe(clean());
});

gulp.task('browserVersion', gulp.series('browserify'));

gulp.task('compile', gulp.series(gulp.parallel('cof','ts'),'optimize','browserVersion','minify'));

gulp.task('build', gulp.series('cleanDist','compile'));

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', gulp.parallel('ts'));
    gulp.watch(['src/**/*','!src/**/*.ts','!src/**/*.scss'], gulp.parallel('cof'));
});

gulp.task('default', gulp.series('compile', 'watch'));