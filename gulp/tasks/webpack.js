/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
var _ = require('lodash');
var del = require('del');
var webpack = require('webpack');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var newer = require('gulp-newer');
var logger = require('gulp-logger');

var project = require('../lib/project');
var config = require('../config/config.' + project.type)(project.page).webpack;
var compileLogger = require('../lib/compileLogger');
var handleErrors = require('../lib/handleErrors');
let livereload = require('gulp-livereload');

// 生成js/css
gulp.task('webpack', false, ['clean:webpack'], function (callback) {
    webpack(require('../webpack.config.js')(), function (err, stats) {
        compileLogger(err, stats);
        callback();
    });
});

// 生成js/css-监听模式
gulp.task('watch:webpack', false, ['clean:webpack'], function () {
    webpack(_.merge(require('../webpack.config.js')(), {
        watch: true
    })).watch(200, function (err, stats) {
        livereload.changed(config.dest)
        compileLogger(err, stats);
    });
});

// 生成js/css-build模式
gulp.task('build:webpack', false, ['clean:webpack'], function (callback) {
    webpack(_.merge(require('../webpack.config.js')('production'), {
        devtool: false
    }), function (err, stats) {
        compileLogger(err, stats);
        callback();
    });
});

// 清理js/css
gulp.task('clean:webpack', false, function () {
    return del([
        config.jsDest,
        config.cssDest
    ], {
        force: true
    });
});