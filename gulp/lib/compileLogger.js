/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
var gutil = require("gulp-util")

var handleErrors = require('./handleErrors');

// 美化webpack的日志输出
module.exports = function (err, stats) {
    if (err) {
        throw new gutil.PluginError("webpack", err);
    }

    var statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

    if (stats.compilation.errors.length > 0) {
        stats.compilation.errors.forEach(function (error) {
            handleErrors(error);
            statColor = 'red';
        });
    } else {
        gutil.log(stats.toString({
            colors: gutil.colors.supportsColor,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
            version: false,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false
        }));
    }
};