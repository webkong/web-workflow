<template>
  <div class="search">
    <div class="input">
      <input ref="search" type="search"
             v-model="query"
             @focus="onFocus"
             @blur="onBlur"
             @keyup.enter="onBlur">
    </div>
    <div class="icon_wrapper" :class="{left:isfocuse}">
      <span class="icon"></span>
      <span class="txt" v-if="!isfocuse">Search</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6" charset="utf-8">
  export default {
    name: '',
    data() {
      return {
        isfocuse: false,
        query: '',
        action: ''
      };
    },
    methods: {
      onFocus: function () {
        this.$refs['search'].focus();
        this.isfocuse = true;
      },
      onBlur: function () {
        console.log(this.query);
        if (this.query !== '') {
          this.log({
            eventName: 'search_song',
            label: this.query,
            msg: '歌曲搜索',
            tag: 'search'
          });
          window.location.href = this.action;
        } else {
          this.isfocuse = false;
        }
      },
      log: function (data) {
        let params = {
          "apiVersion": '1.0',
          "params": {
            "deviceId": this.device_id,
            "operationInfo": {
              "action": data.eventName,
              "type": data.label,
              "msg": data.msg,
              "tag": data.tag
            },
            'activeName': 'shareit_test_player'
          }
        };
        try {
          gtag('event', data.eventName, {
            'event_category': 'shareit_test_player',
            'event_label': data.label,
            'msg': data.msg,
            'deviceId': this.device_id
          });
        } catch (e) {

        }
        this.$http.post(this.host + '/active/reportOperationLogDev', params).then(res => {
          console.log(res);
        });
      }
    },
    watch: {
      query: function (newValue, oldValue) {
        this.action = 'https://m.soundcloud.com/search?q=' + newValue;
      }
    }
  }
  ;
</script>

<style lang="scss" rel="stylesheet/sass">
  @import "../assets/function";

  .search {
    width: 100%;
    height: rem(60px);
    .input {
      width: 100%;
      height: rem(60px);
      border-radius: rem(30px);
      background: #fff;
      input {
        width: 90%;
        margin-left: 5%;
        height: rem(60px);
        line-height: rem(60px);
        font-size: rem(26px);
        text-align: center;
        color: #999;
      }
    }
    .icon_wrapper {
      height: rem(60px);
      width: rem(120px);
      position: relative;
      text-align: center;
      top: rem(-60px);
      margin:0 auto;
      transition: left 0.5s;

      &.left {
        margin:0 auto 0 rem(10px);
      }
    }
    .icon {
      display: block;
      float: left;
      margin-top: rem(14px);
      margin-right: rem(4px);
      width: rem(32px);
      height: rem(32px);
      background: url("../static/images/search.png") no-repeat center center;
      background-size: 100%;
    }
    .txt {
      border: 1px solid transparent;
      display: table-cell;
      vertical-align: baseline;
      float: left;
      font-size: 12px;
      line-height: rem(60px);
      text-align: center;
      color: #999;
    }
  }
</style>
