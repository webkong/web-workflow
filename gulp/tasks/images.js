var gulp = require('gulp');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');

var newer = require('gulp-newer');
var logger = require('gulp-logger');
var del = require('del');
var project = require('../lib/project'); // 得到当前项目的类型和名称

var config = require('../config/config.' + project.type)(project.page).images; // 读取配置文件
var handleErrors = require('../lib/handleErrors');

// 图片构建
gulp.task('images', false, function () {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors))
        .pipe(newer(config.dest))
        .pipe(logger({
            showChange: true
        }))
        // 压缩图片
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest));
});

// 图片构建-build版本
gulp.task('build:images', false, ['images']);

// 清理图片
gulp.task('clean:images', false, function () {
    return del([
        config.dest
    ], {
        force: true
    });
});