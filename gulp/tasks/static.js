/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const clone = require('gulp-clone'); //移动文件
const newer = require('gulp-newer');
const logger = require('gulp-logger');
const del = require('del');
const project = require('../lib/project'); // 得到当前项目的类型和名称
const livereload = require('gulp-livereload');
const config = require('../config/config.' + project.type)(project.page).static; // 读取配置文件
const handleErrors = require('../lib/handleErrors');


gulp.task('static', false, function () {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors))
        .pipe(newer(config.dest))
        .pipe(logger({
            showChange: true
        }))
        .pipe(clone())
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

gulp.task('build:static', false, ['static']);

gulp.task('clean:static', false, function () {
    return del([
        config.dest
    ], {
        force: true
    });
});