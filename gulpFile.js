const gulp            = require('gulp');
const typescript      = require('gulp-typescript');
const browserify      = require('browserify');
const babel           = require('gulp-babel');
const derequire       = require('gulp-derequire');
const gulpIgnore      = require('gulp-ignore');
const gulpReplace     = require('gulp-replace');
const insert          = require('gulp-insert');
const rename          = require('gulp-rename');
const source          = require('vinyl-source-stream');
const uglifyes        = require('uglify-es');
const composer        = require('gulp-uglify/composer');
const ignore          = require('browserify-ignore-code');
const uglify          = composer(uglifyes, console);
const print           = require('gulp-print').default;
const convertNewline  = require('gulp-convert-newline');
const path            = require('path');
const ascjsify        = require('ascjsify');


const tscConfig       = require('./tsconfig.json');
const DIST            = './dist/';
const VERSION         = require('./package.json').version;

const HEADER = (
    '/**\n' +
    ' * Zation JavaScript client version:' + VERSION + '\n' +
    ' */\n');

const isInterfaceComputedFile = (file) =>
{
    return file.path.match(`^.*src${path.sep}lib${path.sep}api${path.sep}zationOptions.ts$`);
};

const replaceConst = (match) =>
{
    const Const          = require('./dist/lib/helper/constants/constWrapper');
    const pathToConstant =  match.replace(new RegExp(/[\[\]]*/, 'g'),'').split('.');
    let tempRes = Const;
    for(let i= 1; i < pathToConstant.length; i++) {
        if(tempRes.hasOwnProperty(pathToConstant[i])) {
            tempRes = tempRes[pathToConstant[i]];
        }
        else {
            return undefined;
        }
    }
    return `'${tempRes}' `;
};

gulp.task('cetTs', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(gulpIgnore.include(isInterfaceComputedFile))
        .pipe(gulpReplace(/\[Const[a-zA-Z_.]*]/g,replaceConst))
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist'));
});

gulp.task('mainTs', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(gulpIgnore.exclude(isInterfaceComputedFile))
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
        .ignore('zationReader.js')
        .bundle()
        .on('error', function(err){
            console.error(err);
        })
        .pipe(source('zation.js'))
        .pipe(print())
        .pipe(convertNewline({
            newline: 'lf',
            encoding: 'utf8'
        }))
        .pipe(derequire())
        .pipe(insert.prepend(HEADER))
        .pipe(derequire())
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

gulp.task('ts', gulp.series('mainTs','cetTs'));

gulp.task('browserVersion', gulp.series('browserify'));

gulp.task('compile', gulp.series(gulp.parallel('cof','ts'),'browserVersion','minify'));

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', gulp.parallel('ts'));
    gulp.watch(['src/**/*','!src/**/*.ts','!src/**/*.scss'], gulp.parallel('cof'));
});

gulp.task('default', gulp.series('compile', 'watch'));