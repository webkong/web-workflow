/*获取语言种类 中文：zh | 英文：en */
module.exports={
  getLang:function () {
    var language = '';
    var languagesBox = ['zh', 'en','ar','bn','pt-br','bg','hr','cs','et','fa','fi','fr','el','de','iw','hi','zh-hk','hu','in','it','ja','ko','lt','lv','ms','pl','pt','ro','ru','sk','sl','es','sr','zh-tw','th','tr','uk','ur','vi'];
    if (navigator.appName == 'Netscape') {
      language = navigator.language.toLowerCase();
    } else {
      language = navigator.browserLanguage.toLowerCase();
    }
    if(this.index(languagesBox,language)>-1){
        return languagesBox[this.index(languagesBox,language)];
    }else if(this.index(languagesBox,language.split('-')[0])>-1){
       return languagesBox[this.index(languagesBox,language.split('-')[0])];
    }else{
      return 'en'
    }
  },
  /**
   * @des 返回在数组中陪陪的位置匹配
   * @param languagesBox 匹配的数组
   * @param language  匹配的字符串
   */
  index:function (languagesBox,language) {
    return   languagesBox.indexOf(language);
  }
};