var gulp = require('gulp');
var plumber = require('gulp-plumber');
var clone = require('gulp-clone'); //移动文件
var newer = require('gulp-newer');
var logger = require('gulp-logger');
var del = require('del');
var project = require('../lib/project'); // 得到当前项目的类型和名称

var config = require('../config/config.' + project.type)(project.page).fonts; // 读取配置文件
var handleErrors = require('../lib/handleErrors');


gulp.task('fonts', false, function () {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors))
        .pipe(newer(config.dest))
        .pipe(logger({
            showChange: true
        }))
        .pipe(clone())
        .pipe(gulp.dest(config.dest));
});

gulp.task('build:fonts', false, ['fonts']);

gulp.task('clean:fonts', false, function () {
    return del([
        config.dest
    ], {
        force: true
    });
});