// list dependeces
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const browsersync = require('browser-sync').create();

// create functions

// scss
function compileScss() {
    return src('minifolio/src/scss/*.scss')
            .pipe(sass())
            .pipe(prefix('last 2 versions'))
            .pipe(minify())
            .pipe(dest('minifolio/dist/css'))
}

// js
function jsMin() {
    return src('minifolio/src/js/*.js')
            .pipe(terser())
            .pipe(dest('minifolio/dist/js'))
}

// images
function optimizeImg() {
    return src('minifolio/src/images/*.{jpg,png}')
            .pipe(imagemin(
                [
                    imagemin.mozjpeg({ quality:80, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 2 })
                ]
            ))
            .pipe(dest('minifolio/dist/images'))
}

//webp images
function webImage() {
    return src('minifolio/dist/images/*.{jpg,png}')
            .pipe(imagewebp())
            .pipe(dest('minifolio/dist/images'))
}

// browsersync tasks
function browsersyncServer(cb) {
    browsersync.init({
        proxy: 'http://localhost/minifolio/'
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// create watch tasks
function watchTask() {
    watch('minifolio/src/scss/*.scss', browsersyncReload);
    watch('minifolio/src/scss/*.scss', compileScss);
    watch('minifolio/src/js/*.js', jsMin);
    watch('minifolio/src/images/*.{jpg,png}', optimizeImg);
    watch('minifolio/dist/images/*.{jpg,png}', webImage);
}

// default gulp
exports.default = series(
    compileScss,
    jsMin,
    optimizeImg,
    webImage,
    browsersyncServer,
    watchTask
);
