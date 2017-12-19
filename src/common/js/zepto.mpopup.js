/**
 * Created by mandy on 2017/4/10.
 * Zepto弹窗插件
 */
var $ = require('../js/zepto');

/**
 * Class Slider
 */
var Mpopup = function(options){
  this.options = $.extend({}, Mpopup.defaults, options);

  this.style = '<style type="text/css" id="mpopupStyle">.mod_tips_popup{opacity:0;-webkit-transition:all linear .2s;z-index:-1;position:fixed;max-width: 50%;left:50%;top:20%;box-sizing:border-box;padding:15px;-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);-o-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);width:auto;margin-left:auto;border-radius:10px;background-color:rgba(0,0,0,0.83)}.mod_tips_popup.no_transform{width:50%;margin-left:-25%;-webkit-transform: rotateX(0);-moz-transform: rotateX(0);-o-transform: rotateX(0);-ms-transform: rotateX(0);transform: rotateX(0);}.mod_tips_popup.mod_tips_popup_show{opacity:1;z-index:10000}.mod_tips_popup .mod_tips_cnt{color:#fff;text-align:center}.mod_tips_popup .mod_tips_cnt .mod_tips_ico{display:block;margin:0 auto 10px}.mod_tips_popup  .mod_tips_ico_right{width:31px;height:19px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAA6CAMAAAAHgr5qAAAAn1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8Kd3m4AAAANHRSTlMABQPz+ewJExwY4tknDeTTzjgxIgvdthHoyMTBppeSg1tFLA8HurGiilZPSz6qnXxzYa1sYvLAsgAAAYtJREFUWMO12NlygjAAheEEF3ABFcV937e22ub9n60jHiedQRhCT/47wfkcZEmCsFJ4O0thpYVSKoDNlh8tBb+jirvx5bl61rUm3+nyDDL/n/6EfKLLB8hnujyFfGHDzgfkFV3eW5P7kK/W5A5d3tmS5QRySJfHkNd0eWRNbkNu2pLLdHnbgtxly9UGZE8ka45LC/lfufROdh97RrKgHEGuvdv7E+9rF7J79SxZ3J97W1tz2X/Jbsovl2FXjeVAxVUgJ/NgNwztzRDyQKTmlVRcZGQPKpkyqsGu9/LLLuThRohctm8qBz7vm+bHqY/PRI56nLOSPO+NquG15ArEu1r9IJ/d1feY+X1byyVvaU8b1ITclgWfkV6qrJ6NJG3MQGvIY8hmdtZIF0KeSPYoqmX22N+BvHO4MxYt9x32POuKjXuHMjsM9bYVNn077DntBRumDnsmfn7J9PXDCR8O5FWPlmf0tdpSy+wVJpoLYtO/8lFQO9iR8Q4CLciwfnPyJSw0h2yjZRBdRKF+AXABgz00U2lzAAAAAElFTkSuQmCC") no-repeat;background-size:30px auto}.mod_tips_popup  .mod_tips_ico_error{width:22px;height:22px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAe1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NgkbwAAAAKHRSTlMAAQQHCg7q4tkRyqbUr6PlwLm1md3QzMiVw7yqnpCzgsVf7mZKQS8oNgOW6wAAAWlJREFUWMOd0dlywjAMhWHLZSv7vtOQAsXv/4RV00zPeIaB5j9Xtix9F1YIX0UZA0wsi7sLKaVdhELfh++hSDKIkIpwST+ZRiqk0g/Q0CA14ibpC2RQwa/r6rqPjYWzjzBDgkpvzYx4rto33g6NXJCxqsqz+A9hJwEYuUAMCX1vg0acSnhkDKvnecSCDEPCa0PC2gVoxP2v8Obn18aHYcGNnownAjHirCqvXCBGLjQyqCBjZFTwtGQECUMXoGFzCcSggoyDYUGGBGAs0196EoAhgRtc0DZ9L1gYpToD40JmUKHXlQGFVosadqiFEGpjbFgghoSlC5mBBGjYQEKdtgwmyDhaA6HrQmZMZAAhN6ggY2ENBGTYWMIjoyMDCLnBhNyggoytPRPaIUDDjhKAIWHiwqu8y4CCjFxYSGhgYEHGiQsycqHjAjRsKwEaEqhxhYIbn9XoLZwkMKMIVwnMuIVwWQ5cgMaoV4Zv6hd0ggaJuq4AAAAASUVORK5CYII=") no-repeat;background-size:22px auto}.mod_tips_popup  .mod_tips_ico_info{width:30px;height:30px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAjVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8DizOFAAAALnRSTlMArDSB9e3YtBsUPtR6JPpODAfaeF8u8MUpwa6OnpJCyJk6HuOiZOfmsHNySMxX8IUYOgAAAhFJREFUWMOtmOdu6kAQhY/xete9N3pPCEnm/R/vStElSgjrMQznDxKyP6097YxhVZBVSxN5aepFZlllAe7UNtaKqJyamePMzLQkUjreYrT8s6Z0HYdJcfmnSMJ4nZI+++MAc0VdvcMf7eqO1JyHFJWixQQWTRakqmKYsIrIaTCgxqFohQG5pDMwyjS59jCeaJODVb6hkyXESURHjNKRogQ31L+2K4zUqn3tb5xh/zLBaE1e9n/OEUSthWBhtPr6fRgKcZdCMtfRrHGnanJ/Ixe4W4ufB8+1zq3JEvxOaMtdMb3bCJ8eTW2t4p3i79pUDmyapR9kDZWjLnU7px7Wq7zKjuhpfjnEAQMI147A4f8x3qh5FNHQ29dv2eFRBLryq9NS/Tiipi0AV/mPI3zlAtBrPI7AWgOBiiWIWAXIKJQgQspQpYkE0VOFZVlIEPl+CTOFBIGpQWRkCBPBm8kQMw+pI0M46TMQ8gd5xuuUB1WaWkW5lCZ4klZ8mcVcmXHFflIHrti5luMStQnTcpjGV2SfDZjGx7RfRjVtmSHAqiv5UYQmy8GMImYgHlP62A0NRHYs+8rJaDMwlnlz0JMbqJPdHOxGWJQNUTthLApjlIp63jBGSWbX5Kbx2dYVgZYaaLmNly8T8pXmosCMXaxMIF7v5EumfNUVL9wj1/6SVHe99neKyrN/R/re+vhgKwH5J5B/sT0yx2fHhIoAAAAASUVORK5CYII=") no-repeat;background-size:30px auto;}.mod_tips_popup  .mod_tips_ico_star{width:30px;height:29px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABXCAMAAACz6KLuAAAAnFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+TINBkAAAAM3RSTlMAAgX7IwzzNlY/t7CbMOjayLyYi4R/eGxCGRAKCPfupqGTY1ErJ93OxHBnW01HquLVOpczDW4QAAACUklEQVRYw7TS2W6CYBiE4fmhbBYXBGUROHDBWDRq5v7vraYx1ioQK9//XMDkPRi8bjMty+kGGoT8EUJczKsYwizeWJA1480MohYmfy0gac47cwjKTd4xc/l7aDiJYfIP04CUJR98iUUXfFBIZdd8UkOEsvnEVpDgsoErEl2yQSmRvWejvUD0iI1G/bMPbHFAX0e2OKInj6089FOxVYVeHHZw0MeJHU7oYchOQ7zH+kh2FTtVu+TDwj/k6Xnpj/mysb88pzk6GalThxO+aRLWTmrgUbZeRUFBAUUQrdYZrlRsU5gdK1wYW2qwNQD41MIHMmqSIaEmCVxq4sKjJh4samIBEbWIAKiAGgQKF2pAcQMF3Lbll6/bupYB9Sm9rGf7uxZ7yU0YCIIAWmMPNsh8jAkSBBL+wiDCInX/u0ViQWTCuGc6wztArWrRXYVBg7kykqvBA7OKmtwUJXtlgNdkr+Cw5j+t4dSPkxw/u49WFdUqCDZU+gZelL2Bh02E5IgdXIdMNjLNsDNmsDH8fDBYCi8LKizgw1LBal9n2ZfnEKkwhY+aCjV8pFRIFQWJWRFLFQvZhSoXyN60R6+spEoJGZUg6ugfDMmBSgdIdlTaQTKhW1HQbQLJkS61BWxNl6O6IKMBbgYjOigLMuzhrjd0/fvt9nwi6za/k13GJ/bhO3h6TvAgOafyWi7fINMlnlhOg2+RE5uqdzh0KjadgpbfYo4W8yJoGU4y3pUWAlvyLksgyBtFFv3WPIcoz25FnsHT7FbzzxweTH7e7hHg0N0ODP74AY0RLzpq6NE6AAAAAElFTkSuQmCC") no-repeat;background-size:30px auto}.mod_tips_loading{width:68px;height:68px;margin-left:auto;top:40%}.mod_tips_loading.no_transform{width: 68px;left: 50%;   margin-left: -34px;-webkit-transform: rotateX(0);-moz-transform: rotateX(0);-o-transform: rotateX(0);-ms-transform: rotateX(0);transform: rotateX(0);}.mod_tips_loading .loader{-webkit-transform:scale(.5);transform:scale(.5);height:32px;margin-left:7px;margin-top:5px}.ball-spin-fade-loader{position:relative}.ball-spin-fade-loader > div:nth-child(1){top:25px;left:0;-webkit-animation:ball-spin-fade-loader 1s 0s infinite linear;animation:ball-spin-fade-loader 1s 0s infinite linear}.ball-spin-fade-loader > div:nth-child(2){top:17.04545px;left:17.04545px;-webkit-animation:ball-spin-fade-loader 1s .12s infinite linear;animation:ball-spin-fade-loader 1s .12s infinite linear}.ball-spin-fade-loader > div:nth-child(3){top:0;left:25px;-webkit-animation:ball-spin-fade-loader 1s .24s infinite linear;animation:ball-spin-fade-loader 1s .24s infinite linear}.ball-spin-fade-loader > div:nth-child(4){top:-17.04545px;left:17.04545px;-webkit-animation:ball-spin-fade-loader 1s .36s infinite linear;animation:ball-spin-fade-loader 1s .36s infinite linear}.ball-spin-fade-loader > div:nth-child(5){top:-25px;left:0;-webkit-animation:ball-spin-fade-loader 1s .48s infinite linear;animation:ball-spin-fade-loader 1s .48s infinite linear}.ball-spin-fade-loader > div:nth-child(6){top:-17.04545px;left:-17.04545px;-webkit-animation:ball-spin-fade-loader 1s .6s infinite linear;animation:ball-spin-fade-loader 1s .6s infinite linear}.ball-spin-fade-loader > div:nth-child(7){top:0;left:-25px;-webkit-animation:ball-spin-fade-loader 1s .72s infinite linear;animation:ball-spin-fade-loader 1s .72s infinite linear}.ball-spin-fade-loader > div:nth-child(8){top:17.04545px;left:-17.04545px;-webkit-animation:ball-spin-fade-loader 1s .84s infinite linear;animation:ball-spin-fade-loader 1s .84s infinite linear}.ball-spin-fade-loader > div{background-color:#fff;width:15px;height:15px;border-radius:100%;margin:2px;-webkit-animation-fill-mode:both;animation-fill-mode:both;position:absolute}@-webkit-keyframes ball-spin-fade-loader{50%{opacity:.3;-webkit-transform:scale(0.4);transform:scale(0.4)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes ball-spin-fade-loader{50%{opacity:.3;-webkit-transform:scale(0.4);transform:scale(0.4)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}.mod_popup.mod_popup_show{opacity:1;z-index:10000}.mod_popup{position:fixed;z-index:-1;top:100px;left:50%;width:60%;margin-left:-30%;background:#fff;border-radius:5px;opacity:0;-webkit-transition:all linear .2s;z-index:-1}.mod_popup_confirm_hd{padding:25px 20px 10px;text-align:center;font-size:16px}.mod_popup_confirm_bd{padding:0 20px 10px}.mod_popup_confirm_ft{margin-top:15px;text-align:center;border-top:#eee solid 1px}.mod_popup_confirm_ft .mod_popup_btn{height:46px;line-height:46px;font-size:15px;color:#008fdb}.mod_popup_btns_inline .mod_popup_btn{position:relative;float:left;width:50%}.mod_popup_btns_inline .mod_popup_btn:first-child::after{content:"";position:absolute;width:1px;height:100%;background:#eee;right:0;top:0}.mod_popup_btns_block .mod_popup_btn{display:block;border-top:#eee solid 1px}.mod_popup_btns_block .mod_popup_btn:first-child{border-top:none}.mod_popup .mod_popup_confirm_ft:first-child{margin-top:0;border-top:none}</style>';
  this.loadingTpl = '<div class="mod_tips_popup mod_tips_loading" id="tips"><div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>';
  this.loadingToggleCls = 'mod_tips_popup_show';
  this.confirmV2Tpl = '<div class="mod_popup mod_popup_confirm"><h3 class="mod_popup_confirm_hd">{#title#}</h3><div class="mod_popup_confirm_bd J_popup_confirm_content">{#content#}</div>{#buttons#}</div>';
  this.popupToggleCls = 'mod_popup_show';
  this.buttonsPopupTpl = '<div class="mod_popup mod_popup_button">{#buttons#}</div>';
  //this.confirmV2ToggleCls = 'mod_popup_confirm_show';
  this._init();
}

/*
 * Popup实例集合
 * @private
 */
Mpopup._list = {};


/**
 * prototype
 */
Mpopup.prototype = {
  constructor: Mpopup,


  /*
   * 初始化
   * @private
   */
  _init: function(){
    var opts = this.options, cls = opts.className, self = this;
    this.id = opts.id || 'Mpopup' + new Date().getTime() + parseInt(Math.random()*100);

    //如果id相同的实例存在，不重复生成
    if (Mpopup._list[this.id]) {
      this.$popup = $('#' + this.id);
      return ;
    }
    Mpopup._list[this.id] = this;
    if($('#' + this.id).length == 0){
      this._create();
    }




    if($('#mpopupStyle').length == 0){
      $('head').append(this.style);
    }


    this._getPopupElem();
    this.$popup.css(opts.css|| {});
    this.$popup.addClass(this.options.setClass || '')


    this.hasMask = opts.mask;
    this.onShow = opts.onShow;
    this.onClose = opts.onClose;
    this.onConfirm = opts.onConfirm;

    this._bindEvent();


  },
  _getPopupElem : function(){
    var opts = this.options;
    if(opts.id == ''){
      var $popup = $('#' + this.id).children().eq(0);
    }else{
      var $popup = $('#' + this.id);
    }
    this.$popup = $popup;
  },

  _bindEvent : function(){
    var self = this;

    this.$popup.find('[data-mpopup-close]').on('click',function(e){
      e.preventDefault
      self.close();
    });







    this.confirm();


  },


  _create : function(){
    var opts = this.options,
      popupTpl = opts.popupTpl,
      contentTpl = opts.contentTpl,
      content = opts.content,
      title = opts.title,
      contentTxt = opts.contentTxt,
      appendTo = opts.popupAppendTo == '' ? 'body' : opts.popupAppendTo,
      icoHtml = '',
      buttonsHtml = '',
      contentHtml = '',
      popupHtml = '';


    if(opts.type == 'confirm'){
      if(opts.icoType !== '' ){

        icoHtml =  this._getIcoHtml();
      }else{
        icoHtml = '';
      }
      if(opts.buttons !== null){
        buttonsHtml =  this._getButtonsHtml();
      }else{
        buttonsHtml = '';
      }

      contentHtml = contentTpl.replace(/\{#contentTxt#\}/,contentTxt).replace(/\{#icoType#\}/,icoHtml).replace(/\{#buttons#\}/,buttonsHtml);

      popupHtml = popupTpl.replace(/\{#content#\}/,contentHtml);

    }else if(opts.type == 'info'){
      opts.contentAppendTo = '.J_tips_content';
      if(opts.icoType !== '' ){

        icoHtml =  this._getIcoHtml();

      }else{
        icoHtml = '';
      }
      buttonsHtml = '';

      contentHtml = contentTpl.replace(/\{#contentTxt#\}/,contentTxt).replace(/\{#icoType#\}/,icoHtml).replace(/\{#buttons#\}/,buttonsHtml);
      //console.log(contentHtml);
      popupHtml = popupTpl.replace(/\{#content#\}/,contentHtml);

    }else if(opts.type == 'loading'){

      popupHtml = this.loadingTpl;

    }else if(opts.type == 'confirmV2'){
      opts.contentAppendTo = '.J_popup_confirm_content';
      contentTpl = this.confirmV2Tpl;

      if(opts.buttons !== null){
        buttonsHtml =  this._getButtonsHtml();
      }else{
        buttonsHtml = '';
      }
      popupHtml = contentTpl.replace(/\{#content#\}/,content).replace(/\{#title#\}/,title).replace(/\{#buttons#\}/,buttonsHtml);


    }else if(opts.type == 'buttons'){
      contentTpl = this.buttonsPopupTpl
      if(opts.buttons !== null){
        buttonsHtml =  this._getButtonsHtml();
      }else{
        buttonsHtml = '';
      }
      popupHtml = contentTpl.replace(/\{#buttons#\}/,buttonsHtml);

    }




    var $html = $('<div id="'+ this.id +'" >'+ popupHtml +'</div>');
    if(!this._isSupport('transform')){
      $html.addClass('no_transform');
    }
    $html.appendTo(appendTo);

  },

  _getIcoHtml : function(){

    var opts = this.options;
    for(var i in opts.icoTypeGroup){
      if(this.options.icoType == opts.icoTypeGroup[i].type){
        return opts.icoTypeGroup[i].tpl;
      }
    }

  },

  _getButtonsHtml : function(){
    var opts = this.options;
    var buttonHtml = '',
      buttonWrap = '';
    if(opts.buttons.length > 2 || opts.type == 'buttons') {

      buttonWrap = '<div class="mod_popup_confirm_ft mod_popup_btns_block">{#buttons#}</div>';
    }else if(opts.buttons.length == 1){
      buttonWrap = '<div class="mod_popup_confirm_ft mod_popup_btns_block">{#buttons#}</div>';
    }else{
      buttonWrap = '<div class="mod_popup_confirm_ft mod_popup_btns_inline">{#buttons#}</div>';
    }
    for(var i = 0; i < opts.buttons.length;i++){
      buttonHtml += opts.buttons[i].tpl;
    }

    buttonHtml = buttonWrap.replace(/\{#buttons#\}/,buttonHtml)



    return buttonHtml;

  },


  _isSupport : function(prop){

    var div = document.createElement('div'),
      vendors = 'Khtml O Moz Webkit'.split(' '),
      len = vendors.length;
    if ( prop in div.style ) return true;
    if ('-ms-' + prop in div.style) return true;
    prop = prop.replace(/^[a-z]/, function(val) {
      return val.toUpperCase();
    });
    while(len--) {
      if ( vendors[len] + prop in div.style ) {
        return true;
      }
    }
    return false;

  },



  setContent : function(tpl){
    var opts = this.options;

    // 如果要插入内容到已有的弹出框，但没有填插入到哪里，则直接返回
    if(opts.contentAppendTo == ''){
      return;
    }

    if(!tpl){

      this.$popup.find(opts.contentAppendTo).html(opts.contentTpl);
    }else{

      this.$popup.find(opts.contentAppendTo).html(tpl);
    }

    return this;
  },

  show: function(clsName){
    var self = this;
    if (this.isShow) {
      return ;
    }


    var opts = this.options;

    var $popup = this.$popup;



    if(clsName !== undefined){

      this.toggleClass = clsName;
      setTimeout(function(){
        $popup.toggleClass(clsName);
      },0);

    }else{
      if(opts.toggleCls !== ''){
        this.toggleClass = opts.toggleCls;
        if(opts.type == 'loading'){
          this.toggleClass = this.loadingToggleCls;
        }else if(opts.type == 'confirmV2' || opts.type == 'buttons'){
          this.toggleClass = this.popupToggleCls;
        }
        var toggleCls = this.toggleClass;
        setTimeout(function(){
          $popup.toggleClass(toggleCls);
        },0);
      }else{
        $popup.show();
      }

    }

    if (typeof this.onShow === 'function') {
      this.onShow($('#' + this.id));
    }

    $(this).trigger('show:mpopup',[this.$popup]);


    if (opts.autoClose) {
      window.setTimeout(function(){
        self.close(this.toggleClass);
      }, opts.autoClose);
    }

    if (this.hasMask) {
      Mpopup.mask.show();
      if (opts.clickMaskClose){
        $('#mpopupMask').on('click',function(e){
          e.preventDefault();

          self.close();

        });
      }
    }
    this.isShow = true;

    return this;
  },

  confirm : function(){
    var self = this;
    var opts = self.options;

    self.$popup.find('[data-mpopup-confirm]').on('click',function(e){
      e.preventDefault;
      if (typeof self.onConfirm === 'function') {
        self.onConfirm($(e.target));
        //self.onConfirm($('#' + self.id));

      }

      $(self).trigger('confirm:mpopup',[$(e.target)]);

      if (opts.destroyAfterClose) {
        self.destory();
      } else {
        self.hide();
      }


    });





    return this;
  },



  hide: function(){

    if (!this.isShow) {
      return ;
    }

    var opts = this.options;

    var $popup = this.$popup;

    var closeMask = true;

    if(this.toggleClass !== undefined){
      $popup.toggleClass(this.toggleClass);
    }else{
      $popup.hide();
    }

    if (this.hasMask) {
      //判断是否需要隐藏遮罩层
      for(var id in Mpopup._list){

        var instance = Mpopup._list[id];

        if (instance !== this && instance.hasMask && instance.isShow) {
          closeMask = false;
          break ;
        }
      }
      if (closeMask) {
        closeMask && Mpopup.mask.hide();
      }
    }
    this.isShow = false;

    $(this).trigger('hide:mpopup',[this.$popup]);
    return this;
  },

  /*
   * 关闭弹窗
   * 该方法会根据配置中的destroyAfterClose决定是隐藏还是销毁弹窗
   * @public
   */

  close: function(){

    var opts = this.options;
    if (typeof this.onClose ==='function') {
      this.onClose($('#' + this.id));
    }

    if (opts.destroyAfterClose) {

      this.destory();
    } else {

      this.hide();
    }

    $(this).trigger('close:mpopup',[this.$popup]);
  },

  /*
   * 销毁弹窗
   */
  destory: function(){
    var self = this;
    var opts = this.options;
    var $popup = this.$popup;

    this.hide();

    if(this.toggleClass){
      if($popup.css('-webkit-transition-duration') !== '0s'){

        $popup.on('webkitTransitionEnd',function(){
          if (!Mpopup._list[self.id]) {
            return ;
          }
          $('#' + self.id).remove();
          delete Mpopup._list[self.id];
        },false);
      }else{
        $('#' + this.id).remove();
        delete Mpopup._list[this.id];
      }

    }else{
      $('#' + this.id).remove();
      delete Mpopup._list[this.id];
    }

    $(this).trigger('destory:mpopup',[]);


  },


  /*
   * 设置弹窗的样式
   * @public
   */
  css: function(style){
    this.$popup.css(style);
    return this;
  }
}


/*
 * Popup类公共的遮罩层
 */
Mpopup.mask = {

  isShow: false,

  layer: null,

  show: function(){
    if (this.isShow) {
      return ;
    }
    if(!this.layer){
      this.layer = $('<div id="mpopupMask" />').css({
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        background: 'rgba(0,0,0,0.2)',
        //opacity: '0.2',
        zIndex: 999
      }).appendTo('body');
    }
    this.layer.show();
    this.isShow = true;
  },

  hide: function(){
    if (!this.isShow || !this.layer) {
      return ;
    }
    this.layer.hide();
    this.isShow = false;
  },

  setStyle: function(background, opacity){
    this.layer.css({
      background: background,
      opacity: opacity
    });
  },

  setZIndex: function(zIndex){
    this.layer.css('z-Index', zIndex);
  }
}





/**
 * 基本设置
 * @param {string}  type 浮层类型 confirm / info
 * @param {string}  icoType 图标 info / right / 空
 * @param {string}  icoType 图标 info / right / 空
 * @param {string}  contentTxt 浮层内容文字
 * @param {boolean}  destroyAfterClose 关闭浮层后是否从DOM删除这个浮层
 * @param {object} autoClose 是否自动关闭浮层，默认不自动关闭，如果autoClose是数字则启动，如3000即3秒后自动关闭
 * @param {object} onShow 浮层打开的回调函数，参数为浮层的DOM
 * @param {object} onClose 浮层关闭的回调函数，参数为浮层的DOM
 * @param {object} onConfirm 点击浮层中确认按钮(data-mpopup-confirm)的回调函数，参数为浮层的DOM
 */
Mpopup.defaults = {
  id: '',
  type : 'confirm',// confirm / confirmNoIco  / info / infoIco / infoWranIco
  popupAppendTo : '',
  popupTpl : '<div class="mod_tips_popup">{#content#}</div>',
  contentTpl: '<div class="mod_tips_cnt">{#icoType#}<div class="J_tips_content">{#contentTxt#}</div></div><div class="mod_tips_ft">{#buttons#}</div>',
  contentAppendTo : '.mod_tips_cnt',
  content : '',
  contentTxt : '',
  toggleCls : 'mod_tips_popup_show',
  title : '',
  css : null,
  setClass : null,
  mask: true,
  destroyAfterClose: false,
  clickMaskClose : false,
  autoClose: false,
  zIndex : null,
  icoType : 'info',
  icoTypeGroup : [{type : 'info',tpl: '<i class="mod_tips_ico mod_tips_ico_info"></i>'},{type : 'right',tpl: '<i class="mod_tips_ico mod_tips_ico_right"></i>'},{type : 'error',tpl: '<i class="mod_tips_ico mod_tips_ico_error"></i>'},{type : 'star',tpl: '<i class="mod_tips_ico mod_tips_ico_star"></i>'}], //info,right
  buttons : [{tpl:'<a  class="mod_popup_btn " href="javascript:void(0)" data-mpopup-confirm>确认</a>'},{tpl:'<a  class="mod_popup_btn" data-mpopup-close href="javascript:void(0)">取消</a>'}],
  onConfirm : null,
  onShow : null,
  onClose : null
};

window.Mpopup = Mpopup;

$.mpopup = function(options){
  return new Mpopup(options);
}


