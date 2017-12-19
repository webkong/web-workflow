/**
 * @desc 上报统计方法
 * @param {*} activeName 
 * @param {*} p 
 * @apiVersion: '1.0',
    deviceId: '',
    activeName: ''
    action: '',
    type: '',
    msg: '',
    tag: '',
    push_from: ''
 */
function logger(activeName, p, url) {
  if (
    activeName === null ||
    activeName === undefined ||
    p === null ||
    p === undefined
  ) {
    console.log('logger function params error');
    return false;
  }
  if (url === null || url === undefined) {
    url = 'https://fucard.ushareit.com/active/reportOperationLog';
  }
  var param_default = {
    apiVersion: p.apiVersion || '1.0',
    params: {
      deviceId: p.eventName || 'default_device_id',
      operationInfo: {
        action: p.action || 'default_event_name',
        type: p.type || 'default_label',
        msg: p.msg || 'default_msg',
        tag: p.tag || 'default_tag' + '+' + p.push_from || 'default_push_from'
      },
      activeName: activeName
    }
  };
  //GA统计,必须引入GA统计代码
  try {
    gtag('event', param_default.eventName, {
      event_category: param_default.tag,
      event_label: param_default.label,
      msg: param_default.msg,
      deviceId: device_id
    });
  } catch (e) {}
  //先提交给日志上报接口，失败上报beyla
  $.post(url, JSON.stringify(param_default)).then(
    function(data) {
      console.log('上报成功');
    },
    function(e) {
      try {
        var pushData = {
          url: window.location.href, //当前的url
          push_from: p.push_from || '', //push来源
          deviceId: param_default.device_id,
          operationInfo: param_default.params.operationInfo,
          activeName: param_default.activeName
        };
        var p = JSON.stringify(pushData);
        client.analyticsEvent('WB_active_2017_guidePage', p);
      } catch (e) {}
    }
  );
}

module.exports = logger;
