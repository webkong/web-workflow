var $ = require('jquery');

/**
 * jQuery弹窗插件
 * require: jquery
 * version: 2.5
 */
/**
 * Class Slider
 */
function Mpopup(options) {
    this.options = $.extend({}, Mpopup.defaults, options);

    this.style = '<style type="text/css" id="mpopupStyle">.mod_popup{display:none;position:fixed;left:50%;top:50%;min-width:360px;padding-top:40px;background:#fff;*border:#e6e6e6 solid 1px;border-radius:3px;z-index:10000}.mod_popup_mask{filter:alpha(opacity=50)}.mod_info_popup .ico_right,.mod_confirm_popup .ico_right,.mod_info_popup .ico_error,.mod_confirm_popup .ico_error{display:block;width:48px;height:48px;background:url(//img.mdcdn.cn/h5/img/module/mod_mpoup_ico.png);margin:0 auto 20px}.mod_info_popup .ico_error,.mod_confirm_popup .ico_error{background-position:0 -49px!important}.mod_popup_tips .ico_right,.mod_popup_tips .ico_error{display:inline-block;width:16px;height:16px;margin-right:7px;background:url(//img.mdcdn.cn/h5/img/module/mod_mpoup_ico.png);vertical-align:-3px}.mod_info_popup .ico_right,.mod_confirm_popup .ico_right{background-position:0 0}.mod_popup_tips .ico_right{background-position:-50px 0}.mod_popup_tips .ico_error{background-position:-50px -17px}.mod_confirm_popup,.mod_info_popup{*width:360px}.mod_popup_close{position:absolute;right:13px;top:8px;color:#999;font-size:16px;font-weight:700}.mod_popup_close:hover{text-decoration:none;color:#333;}.mod_popup_hd{margin-top:-5px;padding:0 60px;font-size:18px;color:#333;text-align:center}.mod_popup_bd{margin-top:10px;padding:0 60px;color:#a1a1a1;text-align:center}.mod_popup_ft{margin-top:30px;border-top:#e6e6e6 solid 1px;overflow:hidden}.mod_popup_ft .mod_popup_btn{height:50px;margin-left:-1px;line-height:50px;color:#0085cf;text-align:center}.mod_popup_btns_inline .mod_popup_btn{float:left;border-left:#e6e6e6 solid 1px}.mod_popup_btns_inline1 .mod_popup_btn{width:100%}.mod_popup_btns_inline2 .mod_popup_btn{width:50%}.mod_popup_btns_inline3 .mod_popup_btn{width:33.3%}.mod_popup_btns_inline4 .mod_popup_btn{width:25%}.mod_popup_btns_block .mod_popup_btn{display:block;height:50px;margin-top:-1px;line-height:50px;border-top:#e6e6e6 solid 1px}.mod_popup_tips{display:none;position:fixed;left:50%;top:50%;z-index:10000;padding:10px 15px;background:#000;color:#fff;border-radius:3px}.mod_popup_tips.show{display:inline-block;*display:inline;*zoom:1}.mod_popup_tips_content{display:inline-block;*display:inline;*zoom:1;vertical:middle}.text_center{text-align:center}.prompt_txt{font-size:18px}.red_txt{color:#f30}.gray_txt{color:#999}</style>';

    this.confirmV2Tpl =
        '<div class="mod_popup mod_confirm_popup">{#closeX#}{#icoType#}{#title#}<div class="mod_popup_bd J_popup_confirm_content">{#content#}</div>{#buttons#}</div>';
    this.tipsTpl =
        '<div class="mod_popup_tips">{#icoType#} <div class="mod_popup_tips_content J_popup_content">{#content#}</div></div>';
    this.infoTpl =
        '<div class="mod_popup mod_info_popup">{#closeX#}{#icoType#}{#title#}<div class="mod_popup_bd J_popup_info_content">{#content#}</div>{#buttons#}</div>';
    this.closeXTpl =
        '<a class="mod_popup_close" data-mpopup-close href="javascript:;">&times;</a>';

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
    _init: function() {

        var opts = this.options,
            cls = opts.className,
            self = this;
        this.id = opts.id || 'Mpopup' + new Date().getTime() + parseInt(
            Math.random() * 100);
        //console.log(Mpopup._list);
        //如果id相同的实例存在，不重复生成
        if (Mpopup._list[this.id]) {
            this.$popup = $('#' + this.id);
            //return ;
        } else {
            Mpopup._list[this.id] = this;
            if ($('#' + this.id).length == 0) {
                this._create();
            }
        }

        if ($('#mpopupStyle').length == 0) {
            $('head').append(this.style);
        }

        this._getPopupElem();

        this.$popup.css(opts.css || {});
        this.$popup.addClass(this.options.setClass || '');


        this.hasMask = opts.mask;
        this.onShow = opts.onShow;
        this.onClose = opts.onClose;
        this.onConfirm = opts.onConfirm;
        this.buttonsTxt = opts.buttonsTxt;

        this._bindEvent();
        if (opts.autoClose) {
            window.setTimeout(function() {
                self.close(this.toggleClass);
            }, opts.autoClose);
        }
    },
    _getPopupElem: function() {
        var opts = this.options;
        if (opts.id == '') {
            var $popup = $('#' + this.id).children().eq(0);
        } else {
            var $popup = $('#' + this.id);
        }
        this.$popup = $popup;
    },

    _bindEvent: function() {
        var self = this;

        this.$popup.find('[data-mpopup-close]').off('click').on('click', function(e) {
            e.preventDefault;

            self.close();
        });

        this.confirm();


    },
    //组装提示内容
    _create: function() {
        var opts = this.options,
            content = opts.content,
            title = opts.title,
            contentTpl = opts.contentTpl, //mod_layer_bd
            contentTxt = opts.contentTxt,
            appendTo = opts.popupAppendTo == '' ? 'body' : opts.popupAppendTo,
            popupTpl = '',
            icoHtml = '',
            buttonsHtml = '',
            contentHtml = '',
            popupHtml = '';

        if (opts.icoType !== '') {
            icoHtml = this._getIcoHtml();
        } else {
            icoHtml = '';
        }

        if (opts.type == 'tip') {
            popupTpl =
                '<div class="mod_layer mod_tip">{#icoType#}{#contentTxt#}</div>';
            popupHtml = popupTpl.replace(/\{#icoType#\}/, icoHtml).replace(
                /\{#contentTxt#\}/, contentTxt);
        } else if (opts.type == 'confirmV2') {

            opts.contentAppendTo = '.J_popup_confirm_content';
            contentTpl = this.confirmV2Tpl;

            if (opts.title !== '') {
                title = '<div class="mod_popup_hd">' + opts.title +
                    '</div>';
            }

            if (opts.buttons !== '' && opts.buttons !== null) {
                buttonsHtml = this._getButtonsHtml();
            }

            if (opts.icoType !== '') {
                icoHtml = this._getIcoHtml();
            } else {
                icoHtml = '';
            }

            popupHtml = contentTpl.replace(/\{#content#\}/, content).replace(
                /\{#title#\}/, title).replace(/\{#buttons#\}/,
                buttonsHtml).replace(/\{#icoType#\}/, icoHtml);

        } else if (opts.type == 'tips') {


            opts.contentAppendTo = '.J_popup_content';
            contentTpl = this.tipsTpl;

            if (opts.icoType !== '') {
                icoHtml = this._getIcoHtml();
            } else {
                icoHtml = '';
            }


            popupHtml = contentTpl.replace(/\{#content#\}/, content).replace(
                /\{#icoType#\}/, icoHtml);

        } else if (opts.type == 'info') {

            opts.contentAppendTo = '.J_popup_info_content';
            contentTpl = this.infoTpl;


            if (opts.icoType !== '') {
                icoHtml = this._getIcoHtml();
            } else {
                icoHtml = '';
            }


            if (opts.title !== '') {

                title = '<div class="mod_popup_hd">' + opts.title +
                    '</div>';
            }

            if (opts.buttons !== '' && opts.buttons !== null) {
                buttonsHtml = this._getButtonsHtml();
            }


            popupHtml = contentTpl.replace(/\{#content#\}/, content).replace(
                /\{#title#\}/, title).replace(/\{#buttons#\}/,
                buttonsHtml).replace(/\{#icoType#\}/, icoHtml);


        } else {
            popupTpl = '<div class="mod_layer">{#content#}</div>';
            buttonsHtml = this._getButtonsHtml();
            contentHtml = contentTpl.replace(/\{#contentTxt#\}/,
                contentTxt).replace(/\{#icoType#\}/, icoHtml).replace(
                /\{#buttons#\}/, buttonsHtml);
            popupHtml = popupTpl.replace(/\{#content#\}/, contentHtml);
        }

        popupHtml = popupHtml.replace(/\{#closeX#\}/, opts.closeX ?
            this.closeXTpl : '');

        var html = '<div id="' + this.id + '" >' + popupHtml + '</div>';
        $(html).appendTo(appendTo);

    },

    _getIcoHtml: function() {
        var opts = this.options;
        for (var i in opts.icoTypeGroup) {
            if (this.options.icoType == opts.icoTypeGroup[i].type) {
                return opts.icoTypeGroup[i].tpl;
            }
        }

        return "";
    },

    _getButtonsHtml: function() {
        var opts = this.options;
        var buttonsHtml = '';

        var buttonWrap;
        if (opts.buttons.length > 2) {

            var buttonWrap =
                '<div class="mod_popup_ft mod_popup_btns_block">{#buttons#}</div>';
        } else {
            var buttonWrap =
                '<div class="mod_popup_ft mod_popup_btns_inline mod_popup_btns_inline' +
                opts.buttons.length + '">{#buttons#}</div>';
        }

        for (var i = 0; i < opts.buttons.length; i++) {
            buttonsHtml += opts.buttons[i].tpl;
        }

        buttonsHtml = buttonWrap.replace(/\{#buttons#\}/, buttonsHtml);


        return buttonsHtml;

    },

    //生成提示div
    setContent: function(tpl) {
        var opts = this.options;

        // 如果要插入内容到已有的弹出框，但没有填插入到哪里，则直接返回
        if (opts.contentAppendTo == '') {
            return;
        }

        if (!tpl) {

            this.$popup.find(opts.contentAppendTo).html(opts.contentTpl);
        } else {

            this.$popup.find(opts.contentAppendTo).html(tpl);
        }

        return this;
    },

    show: function(clsName) {

        var self = this;

        if (this.isShow) {
            return;
        }


        var opts = this.options;

        var $popup = this.$popup;

        var marginTp = -Math.floor($popup.height() / 2) - 100;
        var marginLt = -Math.floor($popup.width() / 2);
        $popup.css({
            "margin-top": marginTp,
            "margin-left": marginLt
        });

        if (clsName !== undefined) {

            this.toggleClass = clsName;
            setTimeout(function() {
                $popup.toggleClass(clsName);
            }, 0);

        } else {
            if (opts.toggleCls !== '') {
                this.toggleClass = opts.toggleCls;
                var toggleCls = opts.toggleCls;
                setTimeout(function() {
                    $popup.toggleClass(toggleCls);
                }, 0);
            } else {
                $popup.show();
            }

        }

        if (typeof this.onShow === 'function') {
            this.onShow($('#' + this.id));
        }

        this.$popup.trigger('show:mpopup', [this.$popup]);

        if (this.hasMask) {
            Mpopup.mask.show();
            if (opts.clickMaskClose) {
                $('#mpopupMask').on('click', function(e) {
                    e.preventDefault();

                    self.close();

                });
            }
        }
        this.isShow = true;

        return this;
    },

    confirm: function() {
        var self = this;
        var opts = self.options;

        self.$popup.find('[data-mpopup-confirm]').off('click').on('click', function(
            e) {
            e.preventDefault;
            if (typeof self.onConfirm === 'function') {

                self.onConfirm($(e.target));
                return;
            }

            if (opts.destroyAfterClose) {
                self.destory();
            } else {
                self.hide();
            }
            self.$popup.trigger('confirm:mpopup', [$(e.target)]);
        });


        return this;
    },


    hide: function() {

        if (!this.isShow) {
            return;
        }

        var opts = this.options;

        var $popup = this.$popup;

        var closeMask = true;

        if (this.toggleClass !== undefined) {
            $popup.removeClass(this.toggleClass);
        } else {
            $popup.hide();
        }

        if (this.hasMask) {
            //判断是否需要隐藏遮罩层
            for (var id in Mpopup._list) {

                var instance = Mpopup._list[id];

                if (instance !== this && instance.hasMask && instance.isShow) {
                    closeMask = false;
                    break;
                }
            }
            if (closeMask) {
                closeMask && Mpopup.mask.hide();
            }
        }
        this.isShow = false;

        this.$popup.trigger('hide:mpopup', [this.$popup]);
        return this;
    },

    /*
     * 关闭弹窗
     * 该方法会根据配置中的destroyAfterClose决定是隐藏还是销毁弹窗
     * @public
     */

    close: function() {

        var opts = this.options;
        if (typeof this.onClose === 'function') {
            this.onClose($('#' + this.id));
        }

        if (opts.destroyAfterClose) {
            this.destory();
        } else {
            this.hide();
        }

        this.$popup.trigger('close:mpopup', [this.$popup]);
    },

    /*
     * 销毁弹窗
     */
    destory: function() {
        var self = this;
        var opts = this.options;
        var $popup = this.$popup;

        this.hide();

        if (this.toggleClass) {
            // if ($popup.css('-webkit-transition-duration') !== '0s') {
            //
            //     $popup.on('webkitTransitionEnd', function () {
            //         $('#' + self.id).remove();
            //         if (!Mpopup._list[self.id]) {
            //             return;
            //         }
            //         delete Mpopup._list[self.id];
            //     }, false);
            // } else {
            $('#' + this.id).remove();
            delete Mpopup._list[this.id];
            // }

        } else {
            $('#' + this.id).remove();
            delete Mpopup._list[this.id];
        }

        this.$popup.trigger('destory:mpopup', []);
    },


    /*
     * 设置弹窗的样式
     * @public
     */
    css: function(style) {
        this.$popup.css(style);
        return this;
    }
};


/*
 * Popup类公共的遮罩层
 */
Mpopup.mask = {

    isShow: false,

    layer: null,

    show: function() {
        if (this.isShow) {
            return;
        }
        if (!this.layer) {
            this.layer = $(
                '<div class="mod_mpopup_mask" id="mpopupMask" />').css({
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100%',
                width: '100%',
                background: '#000',
                opacity: '0.2',
                zIndex: 9999
            }).appendTo('body');
        }
        this.layer.show();
        this.isShow = true;
    },

    hide: function() {
        if (!this.isShow || !this.layer) {
            return;
        }
        // fix close mask by byends
        this.layer = $('body').find('#mpopupMask');

        this.layer.hide();
        this.isShow = false;
    },

    setStyle: function(background, opacity) {
        this.layer.css({
            background: background,
            opacity: opacity
        });
    },

    setZIndex: function(zIndex) {
        this.layer.css('z-Index', zIndex);
    }
};


/**
 * 基本设置
 * @param {string}  type 浮层类型 confirm / tip / unknowError / alert
 * @param {string}  icoType 图标 info / right / 空
 * @param {string}  contentTxt 浮层内容文字，或者自定义样式的结构
 * @param {boolean}  destroyAfterClose 关闭浮层后是否从DOM删除这个浮层
 * @param {object} autoClose 是否自动关闭浮层，默认不自动关闭，如果autoClose是数字则启动，如3000即3秒后自动关闭
 * @param {array}  buttonsTxt 按钮文字['关闭弹窗的文字/取消','下一步操作/确认']
 * @param {object} onShow 浮层打开的回调函数，参数为浮层的DOM
 * @param {object} onClose 浮层关闭的回调函数，参数为浮层的DOM
 * @param {object} onConfirm 点击浮层中确认按钮(data-mpopup-confirm)的回调函数，参数为浮层的DOM
 */
Mpopup.defaults = {
    id: '',
    type: 'confirm', // confirm / tip / confirmV2 / info / tips
    popupAppendTo: '',
    popupTpl: {
        'confirm': '<div class="mod_layer">{#content#}</div>',
        'tip': '<div class="mod_layer mod_tip">{#content#}</div>'
    },
    contentTpl: '<div class="mod_layer_hd"><i class="close_ico" data-mpopup-close></i></div><div class="mod_layer_bd">{#icoType#}{#contentTxt#}</div><div class="mod_layer_ft">{#buttons#}</div>',
    contentAppendTo: '.mod_layer',
    content: '',
    title: '',
    contentTxt: '',
    toggleCls: 'show',
    css: null,
    setClass: null,
    mask: true,
    closeX: true,
    destroyAfterClose: false,
    autoClose: false,
    clickMaskClose: false,
    zIndex: null,
    icoType: 'success', //success / failed /...
    icoTypeGroup: [{
        type: 'right',
        tpl: '<i class="ico_right"></i>'
    }, {
        type: 'error',
        tpl: '<i class="ico_error"></i>'
    }],
    buttons: [{
        tpl: '<a  class="mod_popup_btn " href="javascript:void(0)" data-mpopup-confirm>确 认</a>'
    }, {
        tpl: '<a  class="mod_popup_btn" data-mpopup-close href="javascript:void(0)">取 消</a>'
    }],
    onConfirm: null,
    onShow: null,
    onClose: null
};

window.Mpopup = Mpopup;
$.mpopup = function(options) {
    return new Mpopup(options);
};

module.exports = Mpopup;
