// 视图
const gulp = require('gulp');
const gulpif = require('gulp-if');
const streamqueue = require('streamqueue');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const preprocess = require('gulp-preprocess');
const htmlmin = require('gulp-htmlmin');
const logger = require('gulp-logger');
const del = require('del');
const livereload = require('gulp-livereload');
const project = require('../lib/project'); // 得到当前项目的类型和名称

const config = require('../config/config.' + project.type)(project.page).views; // 读取配置文件
const handleErrors = require('../lib/handleErrors');

// 构建视图文件
gulp.task('views', false, function () {
    /**
     * 配合gulp.src的base属性，streamqueue特别适合用来解决多起点目录的问题。
     * 比如：获取src/components和src/pages下的文件，但是
     * src/components需要从src开始获取文件
     * src/pages需要从src/pages开始获取文件
     */
    return streamqueue({
                objectMode: true
            },
            gulp.src(config.src)
        )
        // 错误自启动，彻底解决gulp错误中断的问题
        .pipe(plumber(handleErrors))
        // 增量更新，加快gulp构建速度
        .pipe(newer(config.dest))
        // 变动日志输出，和前面的错误自启动、增量更新组成 必备三件套
        .pipe(logger({
            showChange: true
        }))
        /**
         * 根据传入的参数做预处理或条件编译，比如：
         * 1. 不同项目编译输出不同的代码。
         * 2. 不同的开发模式编译输出不同的逻辑。
         */
        .pipe(preprocess({
            context: {
                PROJECT: project.page
            }
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(livereload());
});

// 构建视图文件-build版本
gulp.task('build:views', false, ['clean:views'], function () {
    return streamqueue({
                objectMode: true
            },
            gulp.src(config.src)
        )
        .pipe(plumber(handleErrors))
        .pipe(logger({
            showChange: true
        }))
        .pipe(preprocess({
            context: {
                PROJECT: project.page
            }
        }))
        // 过滤gulp流中的文件
        .pipe(gulpif(function (file) {
                if (file.path.indexOf('.html') != -1) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * 压缩html文件及内嵌于HTML中的JS/CSS
             * 通过ignoreCustomFragments来适应不同的模板语言
             */
            htmlmin({
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
                ignoreCustomFragments: [
                    /<%[\s\S]*?%>/,
                    /<\?[\s\S]*?\?>/,
                    /<meta[\s\S]*?name="viewport"[\s\S]*?>/
                ]
            })))
        .pipe(gulp.dest(config.dest));
});

// 清理视图文件
gulp.task('clean:views', false, function () {
    /**
     * 删除指定的文件或目录
     * force表示强制删除
     */
    return del([
        config.dest + '/*.html'
    ], {
        force: false
    });
});