/**
 * Created by mandy on 2017/5/9.
 */

/**
 * @desc 取cookie
 * @param name
 * @returns {string}
 */
    function getCookie(name) {
        var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)")
            , val = document.cookie.match(reg);
        return val ? (val[2] ? decodeURIComponent(val[2]) : "") : "";
    }
/**
 * @desc 设置cookie
 * @param name
 * @param value
 * @param expires  到期时间
 * @param path
 * @param domain
 * @param secure
 */
function setCookie(name, value, expires, path, domain, secure) {
        var exp = new Date()
            , expires = arguments[2] || null
            , path = arguments[3] || "/"
            , domain = arguments[4] || null
            , secure = arguments[5] || false;
        expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
        document.cookie = name + '=' + encodeURIComponent(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }
/**
 * @desc 删除cookie
 * @param name
 * @param path
 * @param domain
 * @param secure
 */
function delCookie(name, path, domain, secure) {
        var value = getCookie(name);
        if (value != null ) {
            var exp = new Date();
            exp.setMinutes(exp.getMinutes() - 1000);
            path = path || "/";
            document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
        }
    }

module.exports = {
    get: getCookie,
    set: setCookie,
    del: delCookie
}