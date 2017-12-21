/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const newer = require('gulp-newer');
const logger = require('gulp-logger');
const del = require('del');
const project = require('../lib/project'); // 得到当前项目的类型和名称
const config = require('../config/config.' + project.type)(project.page).images; // 读取配置文件
const handleErrors = require('../lib/handleErrors');

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
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
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