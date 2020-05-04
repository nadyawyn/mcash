var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber')
browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
    del = require('del');
imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-csso'),
    webp = require('gulp-webp'),
    posthtml = require('gulp-posthtml'),
    //    svgstore = require('gulp-svgstore'),
    include = require('posthtml-include'),
    //    gulpStylelint = require('gulp-stylelint');

    gulp.task('sass', function () {
        return gulp.src('app/sass/**/*.scss')
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
            .pipe(gulp.dest('app/css'))
            .pipe(minify())
            .pipe(rename('style.min.css'))
            .pipe(gulp.dest('app/css'))

            .pipe(browserSync.reload({ stream: true }))
    });


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
            //            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('scripts', function () {
    return gulp.src(['app/js/common.js', 'app/libs/**/*.js'])
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});
/*
gulp.task('scripts', function() {
	return gulp.src([ 
		'app/libs/jquery/dist/jquery.min.js', 
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});
*/
gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});

gulp.task('clean', async function () {
    return del.sync('dist');
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*.{png,jpg,svg}')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        //.pipe(gulp.dest('dist/img'));
        .pipe(gulp.dest('app/img'));
});

gulp.task('webp', function () {
    return gulp.src('app/img/**/*.{png,jpg}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest('app/img'));
});
/*
gulp.task('sprite', function() {
    return gulp.src('app/img/icon-*.svg')
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('app/img'));
});
*/
gulp.task('buildCss', function () {
    return gulp.src(['app/css/style.min.css', 'app/css/libs.min.css'])
        .pipe(gulp.dest('dist/css'));
});

gulp.task('buildFonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('buildJs', function () {
    return gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('buildHtml', function () {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('posthtml', function () {
    return gulp.src('app/*.html')
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest('app'));
});

gulp.task('default', gulp.parallel('sass', 'posthtml', 'browser-sync', 'watch'));

gulp.task('build', gulp.series('clean', 'img', 'sass', 'scripts', 'posthtml', 'buildCss', 'buildFonts', 'buildJs', 'buildHtml'));