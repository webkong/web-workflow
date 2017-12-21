/**
 * Created by wangsw on 08/05/2016.
 * @version 1.0.4
 */
var notify = require("gulp-notify");

module.exports = function(errorObject, callback) {
    // 错误通知
    console.log(errorObject.toString());
    notify.onError(errorObject.toString().split(': ').join(':\n'))
        .apply(this, arguments);

    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
};