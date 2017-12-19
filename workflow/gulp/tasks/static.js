let gulp = require('gulp');
let plumber = require('gulp-plumber');
let clone = require('gulp-clone'); //移动文件
let newer = require('gulp-newer');
let logger = require('gulp-logger');
let del = require('del');
let project = require('../lib/project'); // 得到当前项目的类型和名称

let config = require('../config/config.' + project.type)(project.page).static; // 读取配置文件
let handleErrors = require('../lib/handleErrors');


gulp.task('static', false, function () {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors))
        .pipe(newer(config.dest))
        .pipe(logger({
            showChange: true
        }))
        .pipe(clone())
        .pipe(gulp.dest(config.dest));
});

gulp.task('build:static', false, ['static']);

gulp.task('clean:static', false, function () {
    return del([
        config.dest
    ], {
        force: true
    });
});