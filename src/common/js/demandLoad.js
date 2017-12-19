/**
 * 按需加载组件
 */
define('demandLoad', function (require, exports, module) {
  var $ = require('zepto'),
    fj = require('formatJson'),
    scrollCtrl = require('scrollCtrl'),
    mLog = require('log');

  function DemandLoad(opt) {
    !DemandLoad.guid && (DemandLoad.guid = 100);
    DemandLoad.guid++;

    var _opt = $.extend({
        pageno: 1,
        pagesize: 20,
        startPageno: 1,
        startHeight: 0,
        total: 0,
        preHeight: 0,
        itemTag: 'li',
        isLast: null,
        domObj: null,
        scrollDom: null,
        tmplId: null,
        isDeleteNode: true,
        siblingPageNum: 99,
        initScrollTop: 0,
        IloadData: null,
        timeout: 5000
      }, opt),
      me = this,
      _contentPrefix = 'datapage' + DemandLoad.guid + '_',
      _tmpl,
      _scrCtrl,
      _tempUp,
      _upLine,
      _downLine,
      _maxPageno,
      _upPageno,
      _renderCallbacks = [];

    typeof _opt.domObj === 'string' ? (_opt.domObj = $('#' + _opt.domObj)) : '';

    // 异步加载数据完成后，调用此渲染函数
    this.renderData = function (datas, pageno, loadtype, total) {
      mLog('render pageno：' + pageno);
      var pagesize = _opt.pagesize,
        contentStr,
        contentId,
        contentObj;

      _opt.total = total;
      // 判断该页是否为最后一页
      _opt.isLast = _checkIsLast(pageno);

      datas.pageno = pageno;
      datas.pagesize = pagesize;

      contentId = _contentPrefix + pageno;

      // 如果有模板，则通过json数据进行渲染模板，否则为已拼接好的html字符串
      if (_tmpl) {
        contentStr = fj.render(_tmpl, {
          data: datas
        });
      } else {
        contentStr = datas;
      }

      contentObj = $('#' + contentId);

      if (contentObj.length > 0) {
        contentObj.html(contentStr);
      } else {
        contentStr = '<div id="' + contentId + '" class="list_page" data-pageno=' + pageno + '>' + contentStr + '</div>';
        loadtype === 'next' ? _opt.domObj.append(contentStr) : _opt.domObj.prepend(contentStr);
        contentObj = $('#' + contentId);
      }

      if (_opt.initScrollTop > 0) {
        _setScrollTop(_opt.initScrollTop);
        _opt.initScrollTop = null;
      }

      // 执行渲染完成回调函数
      while (_renderCallbacks.length > 0) {
        var func = _renderCallbacks.shift();
        func(contentObj, pageno);
      }

      // 滚动加载图片
      _scrCtrl.on(contentObj.find('img[init_src]'), function () {
        var imgUrl = this.getAttribute('init_src');
        var imgObj = new Image();
        var that = this;
        imgObj.onload = function () {
          that.src = imgUrl;
        };
        imgObj.src = imgUrl;
        this.removeAttribute('init_src');
      });

      setTimeout(function () {
        _initDownBorder();
        _initUpBorder();
        _clearDoms(pageno);
      }, 100);

      return contentObj;
    };

    // 重置设置，清空数据
    this.reset = function (opt, isPullRefresh) {
      _opt = $.extend(_opt, {
        pageno: _opt.startPageno,
        pagesize: 20
      }, opt);

      _scrCtrl.clear();
      _scrCtrl = null;

      if (isPullRefresh) {
        _opt.domObj.find('>div').map(function (index, item) {
          if (index != 0) {
            $(item).remove();
          }
        });
      } else {
        _opt.domObj.html('');
      }

      _tempUp.remove();
      _upLine.remove();
      _downLine.remove();

      _init(isPullRefresh);
    };

    // 计算dom相关数据
    function _calcDom() {
      if (_opt.pageno < _opt.startPageno) {
        _opt.pageno = _opt.startPageno;
      }
      _opt.isLast = _checkIsLast(_opt.pageno);
      _upPageno = _opt.pageno;
    }

    // 初始化页面结构
    function _initPageStructor() {
      _tempUp = _createDom('DIV', '_tempUp' + DemandLoad.guid);
      _upLine = _createDom('DIV', '_upLine' + DemandLoad.guid);
      _downLine = _createDom('DIV', '_downLine' + DemandLoad.guid);
      _opt.domObj.before(_tempUp);
      _opt.domObj.before(_upLine);
      _opt.domObj.after(_downLine);
      _tempUp = $('#_tempUp' + DemandLoad.guid);
      _upLine = $('#_upLine' + DemandLoad.guid);
      _downLine = $('#_downLine' + DemandLoad.guid);

      _tempUp.addClass('tempUp');
      if (_opt.preHeight) {
        _tempUp.css('height', (_opt.pageno - _opt.startPageno) * _opt.pagesize * _opt.preHeight);
      } else {
        _tempUp.css('height', _opt.startHeight);
      }

      if (_opt.tmplId) {
        _tmpl = $('#' + _opt.tmplId).html();
      }

      _scrCtrl = scrollCtrl.init(_opt.scrollDom);
    }

    // 加载下一页
    function _next() {
      if (_maxPageno >= (_opt.pageno + 1)) {
        ++_opt.pageno;
        _opt.IloadData && _opt.IloadData.apply(me, [_opt.pageno, _opt.pagesize, 'next']);
        //log('render next page:' + _opt.pageno);
      }
    }

    // 加载上一页
    function _prev() {
      var pageno = _upPageno - 1;
      //log('_upPageno: ' + pageno);
      if (pageno >= _opt.startPageno) {
        _opt.IloadData && _opt.IloadData.apply(me, [pageno, _opt.pagesize, 'prev']);
        --_upPageno;
        //log('render prev page:' + --_upPageno);
      }
    }

    // 节点回收
    function _clearDoms(pageno) {
      if (_opt.isDeleteNode) {
        var prevno = pageno - _opt.siblingPageNum,
          nextno = pageno + _opt.siblingPageNum,
          contentObj,
          lis;
        if (prevno > (_opt.startPageno - 1)) {
          contentObj = $('#' + _contentPrefix + prevno);
          lis = contentObj.find(_opt.itemTag);

          if (lis.length > 0) {
            _tempUp.css('height', _tempUp.height() + contentObj.height());
            contentObj.html('');
            _upPageno = prevno + 1;
          }
        }

        if (nextno > 0) {
          contentObj = $('#' + _contentPrefix + nextno);
          lis = contentObj.find(_opt.itemTag);
          if (lis.length > 0) {
            contentObj.html('');
            _opt.pageno = nextno - 1;

            _maxPageno = (Math.ceil(_opt.total / _opt.pagesize)).toFixed(0) * 1;
          }
        }
      }
    }

    // 监控下拉边界
    function _initDownBorder() {
      _scrCtrl.on(_downLine[0], function (obj) {
        if (!_opt.isLast) {
          _next();
        }
      });
    }

    // 监控上拉边界
    function _initUpBorder() {
      _scrCtrl.on(_upLine[0], 'beforeTop', function (obj) {
        mLog('_upPageno:' + _upPageno);
        // prev是异步操作，须等待prev渲染完成后再执行设置_tempUp的高度，否则页面会产生跳动
        _renderCallbacks.push((function () {
          return function (contentObj, pageno) {
            var difHeight = _tempUp.height() - contentObj.height();
            _tempUp.css('height', difHeight < 0 ? 0 : difHeight);
          }
        })());

        _prev();
      });
    }

    // 判断是否为最后一页
    function _checkIsLast(pageno) {
      _maxPageno = (Math.ceil(_opt.total / _opt.pagesize)).toFixed(0) * 1;
      return  _maxPageno <= pageno;
    }

    // 创建节点
    function _createDom(tag, id) {
      var dom = document.createElement(tag);
      dom.id = id;
      return dom;
    }

    // 设置滚动条
    function _setScrollTop(st) {
      _opt.scrollDom ? $(_opt.scrollDom).scrollTop(st) : window.scrollTo(0, st);
    }

    // 组件初始化函数
    function _init(isPullRefresh) {
      _initPageStructor();
      _calcDom();

      // 直出场景下特殊处理，解决不能立即调整位置bug
      if (_opt.initScrollTop > 0) {
        _setScrollTop(_opt.initScrollTop);
      }

      if(isPullRefresh){
        _opt.IloadData && _opt.IloadData.apply(me, [_opt.pageno, _opt.pagesize, 'next', isPullRefresh]);
        _scrCtrl.clear();
      } else {
        setTimeout(function () {
          // 监控占位元素，开始加载数据
          _scrCtrl.on(_tempUp, 'beforeBottom', function () {
            _opt.IloadData && _opt.IloadData.apply(me, [_opt.pageno, _opt.pagesize, 'next']);
          });
        }, 100);
      }
    }

    _init();
  }

  exports.init = function (opt) {
    return new DemandLoad(opt);
  }
});