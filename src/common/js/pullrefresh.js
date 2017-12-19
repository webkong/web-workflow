/**
 * 下拉刷新组件组件
 */
define('pullrefresh', function (require, exports, module) {
  var $ = require('zepto');

  var PullRefresh = function (opt) {
    var _opt = $.extend({
        refreshDom: null,
        scrollDom: null,
        tipHeight: 100,
        onRelease: function () {

        }
      }, opt),
      that = this,
      arrow = 'data:image/png;base64,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';

    var rfTip = document.createElement('DIV'),
      rfWrap,
      refreshDom = $(_opt.refreshDom),
      rfIcon,
      rfText;

    // 使用独立div包裹
    refreshDom.wrap('<div style="overflow: hidden;"><div class="commonlist_pull_refresh_wrap"></div></div>');
    refreshDom.before(rfTip);
    rfTip = $(rfTip);
    rfTip.html('<div style="display:table-cell; vertical-align:middle;padding-top:20px;"><img class="commonlist_pull_refresh_icon" style="margin: 0 5px;width:20px;" /><span class="commonlist_pull_refresh_text"></span></div>');

    rfWrap = $('.commonlist_pull_refresh_wrap');
    rfTip.css({
      position: 'absolute',
      top: '-' + _opt.tipHeight + 'px',
      width: '100%',
      height: _opt.tipHeight,
      'text-align': 'center',
      'vertical-align': 'middle',
      'display': 'table'
    });

    rfIcon = rfTip.find('.commonlist_pull_refresh_icon');
    rfText = rfTip.find('.commonlist_pull_refresh_text');

    var _start = 0,
      _end,
      _pullTag = 0;

    refreshDom.on('touchstart', function (event) {
      // 滚动条在最顶，并且_pullTag为0才可以触发
      if (_getScrollTop() == 0 && _pullTag == 0) {
        var touch = event.targetTouches[0];
        _start = touch.pageY;
        _pullTag = 1;
        _beforePull();
      }
    }).on('touchmove', function (event) {
      if (_pullTag >= 1) {
        var touch = event.targetTouches[0];
        _end = touch.pageY - _start;
        // 浮层下滑速度等比例降低，为了不让人感觉一下子滑到底了
        var curHeight = _end / 2.2;
        if (_end > 0 && curHeight < _opt.tipHeight) {
          // 可刷新阈值为下拉浮层高度的70%，大于此值可以释放刷新
          if (curHeight >= _opt.tipHeight * 0.7) {
            _pullTag = 2;
            _canRefresh();
          } else if (curHeight < _opt.tipHeight * 0.7) {
            // 否则变回刷新提示
            _pullTag = 1;
            _beforePull();
          }

          // 更新下拉框的位移
          _pulling(curHeight);
          event.preventDefault();
        }
      }
    }).on('touchend', function () {
      if (_pullTag == 2) {
        if (_end > 0) {
          // 手指放开，浮层往上移动
          _release();
          // 触发释放回调事件，可在此异步请求数据
          _opt.onRelease.apply(that, []);
        }
      } else {
        // 不符合刷新要求，仅回收浮层
        _pullTag = 0;
        that.afterPull();
      }
    });

    function _beforePull() {
      var state = rfTip.attr('data-state');
      if (state != 'beforePull') {
        rfIcon.attr('src', arrow);
        rfIcon.css({
          '-webkit-transition': 'all 0.5s',
          '-webkit-transform': 'rotateZ(0)'
        });
        rfText.html('下拉即可刷新');

        rfTip.attr('data-state', 'beforePull');
      }
    }

    function _canRefresh() {
      var state = rfTip.attr('data-state');
      if (state != 'canRefresh') {
        rfIcon.attr('src', arrow);
        rfIcon.css({
          '-webkit-transition': 'all 0.5s',
          '-webkit-transform': 'rotateZ(180deg)'
        });
        rfText.html('释放即可刷新');

        rfTip.attr('data-state', 'canRefresh');
      }
    }

    function _pulling(curHeight) {
      rfWrap.css({
        '-webkit-transition': 'all 0s',
        '-webkit-transform': 'translateY(' + curHeight + 'px)'
      });
    }

    function _release() {
      rfWrap.css({
        '-webkit-transition': 'all 0.3s ease',
        '-webkit-transform': 'translateY(' + _opt.tipHeight * 0.9 + 'px)'
      });

      rfIcon.attr('src', 'http://st.midea.com/h5/img/common/loading32.gif');
      rfIcon.css({
        '-webkit-transition': 'none',
        '-webkit-transform': 'rotateZ(0deg)'
      });

      rfText.html('加载中，请稍候...');

      rfTip.attr('data-state', 'release');
    }

    function _getScrollTop() {
      return _opt.scrollDom ? _opt.scrollDom.scrollTop() : window.scrollY;
    }

    // 更新完成回调事件
    this.afterPull = function () {
      rfWrap.css({
        '-webkit-transition': 'all 0.5s ease',
        '-webkit-transform': 'translateY(0px)'
      }).on('webkitTransitionEnd', function () {
        // 浮层回缩完毕后，修改状态
        _pullTag = 0;
        rfTip.attr('data-state', '');
        $(this).unbind('webkitTransitionEnd');
      });
    }
  };

  exports.init = function (opt) {
    return new PullRefresh(opt);
  }
});