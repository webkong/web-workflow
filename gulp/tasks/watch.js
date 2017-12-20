let gulp = require('gulp');
let watch = require('gulp-watch');
let livereload = require('gulp-livereload');
let project = require('../lib/project'); // 得到当前项目的类型和名称

let config = require('../config/config.' + project.type)(project.page); // 读取配置文件
gulp.task('watch', '组合：监听src目录', [
    'views',
    'images',
    'static',
    'watch:webpack'
], function () {
    // 监听指定文件的变动，然后出发指定子任务
    livereload.listen();
    watch([
        config.views.src
    ], function () {
        gulp.start('views');
    });
    watch(config.images.src, function () {
        gulp.start('images');
    });
    watch(config.static.src, function () {
        gulp.start('static');
    });
});