/**
 * 移动端列表加载组件
 */
define('commonlistv2', function (require, exports, module) {
  var $ = require('zepto'),
    mDemandLoad = require('commonjs/demandLoad'),
    mLocalcache = require('commonjs/localcache'),
    mPullRefresh = require('commonjs/pullrefresh'),
    mLog = require('log');

  function Commonlist(opt) {
    var me = this,
      _opt = $.extend({
        id: location.pathname + location.search,
        // 列表容器dom id
        domId: '',
        // 请求数据的URL
        reqUrl: '',
        // 初始请求的页码
        pageno: 1,
        // 每页请求个数
        pagesize: 10,
        // 起始页码
        startPageno: 1,
        // 请求参数
        params: {},
        // 列表内容模板id，如果为空，表示使用html字符串直接展示
        tmplId: '',
        // 列表外层提供垂直滚动条的容器，默认为body
        scrollDom: '',
        // 每行元素的高度
        preHeight: 0,
        // 数据为空的提示
        emptyMsg: '暂无数据',
        errMsgId: 'emptyTips',
        // 请求失败的提示
        errMsg: '系统繁忙，请稍后再试',
        // 禁用缓存
        disableCache: false,
        // 数据缓存时间
        cacheTime: 20,
        // 请求超时时间
        requestTimeout: 10000,
        // 直出部分的列表对象
        firstList: document.querySelector('.J_first'),
        // 使用下拉刷新
        usePullRefresh: false,
        // 捕获节点点击
        captureClick: true,
        // 请求数据成功回调
        success: function (obj, callback) {
        },
        // 请求数据失败回调
        error: function (obj) {
        },
        render: function (contentObj, datas, pageno, total) {
        }
      }, opt),
      _domObj,
      _dl,
      _reqStateCacheKey,
      _reqStateCacheData,
      _loadingTag,
      _jMsg,
      _dataCache = {},
      _arrRenderCallback = [];

    // 初始化基本变量
    function _init() {
      _domObj = $('#' + _opt.domId);
      if (_domObj.length === 0) {
        console.error('根据domId找不到dom元素');
        return false;
      }

      _opt.scrollDom = _opt.scrollDom ? $(_opt.scrollDom) : $(document.body);

      _jMsg = $('#' + _opt.errMsgId);

      // 获取最近一次请求参数
      _reqStateCacheKey = _getCacheKey('reqstate');
      _reqStateCacheData = mLocalcache.get(_reqStateCacheKey);
      mLocalcache.remove(_reqStateCacheKey);
      _pushDataToCacheFromLocalstorage();
      _initRefresh();
      _initDemandLoad();
    }

    /**
     * 获取缓存key
     * @method _getCacheKey
     * @param {string} name 缓存key的名称
     * @return {string} 缓存key全称
     */
    function _getCacheKey(name) {
      return['cl' , _opt.id, _opt.domId, name].join('_');
    }

    // 保存数据到localstorage
    function _setCacheData(cacheKey, cacheData) {
      mLocalcache.set(cacheKey, cacheData, _opt.cacheTime);
    }

    // 初始化滚动加载组件
    function _initDemandLoad(resetConf, isPullRefresh) {
      if (_dl) {
        _dl.reset(resetConf, isPullRefresh);
      } else {
        _dl = mDemandLoad.init({
          pageno: (_reqStateCacheData && _reqStateCacheData.reqParams.pageno) || _opt.pageno,
          pagesize: (_reqStateCacheData && _reqStateCacheData.reqParams.pagesize) || _opt.pagesize,
          startPageno: _opt.startPageno,
          preHeight: _opt.preHeight,
          domObj: _domObj,
          scrollDom: _opt.scrollDom[0],
          tmplId: _opt.tmplId,
          siblingPageNum: 4,
          // 初始高度，表示空白占位高度
          startHeight: (_reqStateCacheData && _reqStateCacheData.pageState.startHeight) || 0,
          // 滚动条位置
          initScrollTop: (_reqStateCacheData && _reqStateCacheData.pageState.initScrollTop) || 0,
          itemTag: _opt.itemTag,
          // 触发加载数据接口
          IloadData: function (pageno, pagesize, loadtype, isPullRefresh) {
            var func = arguments.callee,
              args = arguments,
              context = this,
              reqParams = (_reqStateCacheData && _reqStateCacheData.reqParams) || _opt.params;

            clearTimeout(_loadingTag);
            hideMsg();

            // 下拉刷新场景下不出现尾部loading
            if (!isPullRefresh) {
              showMsg(0, '<div style="padding:10px;"><img style="margin:0 5px;width:20px;" src="//img.mdcdn.cn/h5/img/common/loading32.gif" />加载中，请稍候...</div>');

              _loadingTag = setTimeout(function () {
                showMsg(0, '<div onclick="requestReload();">轻触此处重新加载。</div>');
                window.requestReload = function () {
                  func.apply(context, args);
                }
              }, _opt.requestTimeout);
            }

            // 进行异步加载数据，数据返回后调用demandLoadObj的渲染方法
            reqParams.pageno = pageno;
            reqParams.pagesize = pagesize;
            _getDataList(reqParams,
              // 创建回调函数，将demandLoadObj，当前页码和数据加载方向设置在闭包内，供回调使用
              (function (demandLoadObj, pageno, loadtype) {
                // 获取返回的数据进行模板渲染
                return function (datas, total) {
                  clearTimeout(_loadingTag);
                  hideMsg();

                  var contentObj = demandLoadObj.renderData(datas, pageno, loadtype, total);
                  // 绑定列表事件，捕获点击对象
                  _bindEventForList(contentObj);

                  // 渲染完成回调函数
                  _arrRenderCallback.push(function () {
                    _opt.render(contentObj, datas, pageno, total);
                  });

                  _execCallbacks(_arrRenderCallback);
                }
              })(this, pageno, loadtype));
          }
        });

        // 考虑直出的部分定位
        $(_opt.firstList).click(function () {
          if (!_opt.captureClick) {
            return true;
          }
          _setReqStateCache({
            initScrollTop: _getScrollTop()
          });
        });
      }
    }

    // 异步拉取数据
    function _getDataList(oReq, dataLoaded) {
      var oCacheData = _getDataListCache(oReq.pageno);

      if (oCacheData) {
        _opt.success(oCacheData, execData);
      } else {
        $.ajax({
          url: _opt.reqUrl,
          data: $.extend({t: Math.random()}, oReq),
          type: "get",
          dataType: "json",
          success: function (obj) {
            if (obj.errcode == 0) {
              _opt.success(obj, execData);
              if (obj.pageno == 1 && ($.trim(obj.data) == '' || obj.data.length == 0)) {
                showMsg(1, _opt.emptyMsg);
              } else {
                // 缓存到内存中
                _setDataListCache(obj, 1);
              }
            } else {
              showMsg(1, obj.errmsg);
              _opt.error(obj);
            }
          },
          error: function (e) {
            var obj = {errCode: '-1', errcode: '-1', errmsg: '请求异常，请稍后再试。'};
            showMsg(1, obj.errmsg);
            _opt.error(obj);
          }
        });
      }

      function execData(arrData, nTotal) {
        dataLoaded(arrData, nTotal);
      }
    }

    // 获取滚动条高度
    function _getScrollTop() {
      return _opt.scrollDom ? _opt.scrollDom.scrollTop() : window.scrollY;
    }

    // 绑定点击事件
    function _bindEventForList(contentObj) {
      contentObj.unbind('click').click(function () {
        if (!_opt.captureClick) {
          return true;
        }
        // 计算当前列表往上的兄弟列表高度之和，用于记录页面回调的时候设置占位高度
        var pageno = contentObj.attr('data-pageno') * 1,
          startHeight = 0,
          prevObj = this.previousSibling;

        while (prevObj) {
          if (prevObj.nodeType == 1) {
            startHeight += $(prevObj).height();
          }
          prevObj = prevObj.previousSibling;
        }

        startHeight += $('.tempUp').height();

        // 记录当前列表加载的参数状态
        _setReqStateCache({
          pageno: pageno,
          pagesize: _opt.pagesize,
          initScrollTop: _getScrollTop(),
          startHeight: startHeight
        });

        // 存储当前页以及上下关联页的数据到localstorage中，便于返回时展示
        _setDataListCache([_dataCache[pageno - 1], _dataCache[pageno], _dataCache[pageno + 1]], 2);
      });
    }

    function _initRefresh() {
      if (_opt.usePullRefresh) {
        mPullRefresh.init({
          refreshDom: _domObj,
          onRelease: function () {
            _arrRenderCallback.push(this.afterPull);
            me.reset({
              pageno: 1,
              startHeight: 0,
              initScrollTop: 0
            }, true);
          }
        })
      }
    }

    // 缓存当前列表状态（当前页码，每页个数，当前滚动条高度，空白占位div起始高度）
    function _setReqStateCache(data) {
      if (!_reqStateCacheData) {
        _reqStateCacheData = {reqParams: {}, pageState: {} };
      }

      // 记录请求的参数
      _reqStateCacheData.reqParams = _opt.params;
      _reqStateCacheData.reqParams.pageno = data.pageno;
      _reqStateCacheData.reqParams.pagesize = data.pagesize;
      _reqStateCacheData.pageState.initScrollTop = data.initScrollTop;
      _reqStateCacheData.pageState.startHeight = data.startHeight;
      _setCacheData(_reqStateCacheKey, _reqStateCacheData);
    }

    // 缓存当前列表数据
    function _setDataListCache(data, cacheType) {
      if (!_opt.disableCache) {
        if (!$.isArray(data)) {
          data = [data];
        }

        for (var i = 0; i < data.length; i++) {
          if (cacheType === 1) {
            // 内存
            _dataCache[data[i].pageno] = data[i];
          } else {
            if (data[i]) {
              // localstorage
              _setCacheData(['cl' , _opt.id, _opt.domId , 'list' , data[i].pageno].join('_'), data[i]);
            }
          }
        }
      }
    }

    // 获取当前列表数据，默认从内存中取，没有就到localstorage找
    function _getDataListCache(pageno) {
      if (!_opt.disableCache) {
        return _dataCache[pageno];
      }
    }

    // 将localstorage存储的数据放到内存中
    function _pushDataToCacheFromLocalstorage() {
      var keys = mLocalcache.getAllKeys();
      for (var i = 0; i < keys.length; i++) {
        var prefix = ['cl' , _opt.id, _opt.domId , 'list'].join('_');
        if (keys[i].indexOf(prefix) > -1) {
          var pageno = keys[i].split(prefix + '_')[1] * 1,
            key = prefix + '_' + pageno,
            data = mLocalcache.getItem(key);

          mLocalcache.remove(key);
          _dataCache[pageno] = data;
        }
      }
    }

    // 清除改列表所有缓存
    function _clearCache() {
      mLocalcache.remove(_reqStateCacheKey);
      _reqStateCacheData = null;
      _dataCache = [];
    }

    function showMsg(type, msg) {
      var errMsg = msg;
      if (!errMsg) {
        errMsg = '系统繁忙，请稍后再试';
      }

      _jMsg.html(errMsg).show();
    }

    function hideMsg() {
      _jMsg.html('').hide();
    }

    function _execCallbacks(cbs) {
      var cb;
      while ((cb = cbs.shift())) {
        cb();
      }
    }

    this.reset = function (opt, isPullRefresh) {
      _clearCache();
      _opt = $.extend(_opt, opt);
      _initDemandLoad(opt, isPullRefresh);
      return this;
    };

    // 返回顶部按钮
    this.backToTop = function () {
      if (_domObj.find('div[attr-pageno="' + _opt.startPageno + '"]').length === 0) {
        this.reset();
      }

      if (_opt.scrollDom) {
        _opt.scrollDom.scrollTop(0);
      } else {
        window.scrollTo(0, 0);
      }
      return this;
    };

    _init();
  }

  exports.init = function (opt) {
    return new Commonlist(opt);
  }
});