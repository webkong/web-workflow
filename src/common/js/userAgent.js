/**
 *@desc 判断设备类型
 */
var _userAgent=navigator.userAgent;
module.exports={
  deviceType:function () {
    if(/(Android)/i.test(_userAgent)){
      return 'Android';
    }else if(/(iPhone|iPad|iPod|iOS)/i.test(_userAgent)){
      return 'iPhone';
    }else if(/(Firefox)/i.test(_userAgent)){
      return "Firefox";
    }else if(/(Opera)/i.test(_userAgent)){
      return 'Opera';
    }else if(/(Chrome)/i.test(_userAgent)){
      return "Chrome";
    }else if(/(Safari)/i.test(_userAgent)){
      return "Safari";
    }else if (ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1 && ua.indexOf("Opera") == -1) {
      //判断是否IE浏览器
      if(ua.indexOf("MSIE 9.0")>-1 ||ua.indexOf("MSIE 8.0")>-1 ||ua.indexOf("MSIE 7.0")>-1	||ua.indexOf("MSIE 6.0")>-1){
        return "NOTIE";
      }
    }else if (ua.indexOf("MSIE 10.0")> -1 || ua.indexOf("rv:11.0")> -1 ) {

      return "IE";
    }else{
      return "NOT";
    }
  }

}
