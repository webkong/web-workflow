/**
 * Created by mandy on 2017/4/7.
 * 倒计时 组件
 */
define('act.count.down.v2',function(require,exports,module){
  var countDown=function(){
    this.timeInterVal=null;
    this.init=function(timeObj,callback){
      //当前服务器 时间戳
      this.curTime=timeObj.serverTime||Date.parse(new Date());
      //开始时间转换为时间戳 - 当前服务器时间
      this.leftTime=Date.parse((timeObj.startTime).replace(/-/g,'/')) - this.curTime;
      var self=this;
      this.updateTime(callback);
      if(self.timeInterVal){
        clearInterval(self.timeInterVal);
      }
      if(timeObj.index){
        self.index=timeObj.index;
      }
      this.timeInterVal=setInterval(function(){
        self.updateTime(callback);
      },1000);
    };
    //更新 倒计时剩余时间
    this.updateTime=function(callback){
      var self=this;
      var t=self.getRemainTime();
      callback(t);
    };
    // 倒计时 剩余时间
    this.getRemainTime=function(){
      var self=this;
      this.leftTime=this.leftTime-1000;
      var t=this.leftTime;
      var seconds = Math.floor( (t/1000) % 60 );
      var minutes = Math.floor( (t/1000/60) % 60 );
      var hours = Math.floor( (t/(1000*60*60)) % 24 );
      var days = Math.floor( t/(1000*60*60*24) );
      return {
        'obj':self,
        'total': t,
        'days': days,
        'hours': ('0' + hours).slice(-2),
        'minutes': ('0' + minutes).slice(-2),
        'seconds': ('0' + seconds).slice(-2)
      };
    } ;
  };

  exports.countDown=function(){
    return new countDown();
  }
});
