<template>
  <div id="app">
    <div class="content" ref="content">
      <transition name="fade">
        <router-view
          :play_id="play_id"
          @play-song="player"
          @down-song="download"
          @save-page="savePage"
          @go-more="goMore"/>
      </transition>
    </div>
    <div class="box"></div>
    <div class="minPlayer">
      <a-player ref="player" :autoplay="autoplay" theme="#2F9CF6" :music="music"></a-player>
    </div>
  </div>
</template>

<script>
  import List from './List';
  import Index from './Index';
  import VueAplayer from 'vue-aplayer';
  import songs from '../data/songs.json';
  import BetterScroll from 'better-scroll';

  let client_id = '?client_id=oZTFwmE20x1Lc35dFEHWmOMdxjjFEJdF';
  export default {
    name: 'app',
    data() {
      return {
        play_id: 0,
        pause: false,
        device_id: 'web',
        autoplay: false,
        songs: songs.content,
        listIndex: -1,
        music: [{
          title: 'Taylor Swift - Look What You Made Me Do (KUST Remix)',
          author: "KUST",
          url: 'http://cdn.ushareit.com/sz2/m/171102/TaylorSwift-LookWhatYouMadeMeDo(KUSTRemix).mp3',
          pic: 'https://i1.sndcdn.com/artworks-000240082060-9yq33c-t300x300.jpg'
        }],
        host: 'https://fucard.ushareit.com'
      };
    },
    mounted() {
      let that = this;
      this.$aplayer = this.$refs.player.control;
      this.$aplayer.on('pause', function () {
        that.play_id = 0;
      });
      this.$aplayer.on('play', function () {
        that.play_id = that.$aplayer.music.id;
      });
    },
    created: function () {
      console.log(1);
      try {
        let info = JSON.parse(client.getDeviceInfo());
        this.device_id = info.device_id || '';
      } catch (e) {
      }
      this.log({
        eventName: 'web_init',
        label: 'init',
        msg: '页面初始化',
        tag: 'click'
      });
    },
    methods: {
      player: function (res) {
        let type = res.type;
        let palyer = this.$aplayer;

        if (this.play_id !== res.song.id) {
          palyer.addMusic([{
            title: res.song.name,
            author: res.song.artist,
            url: res.song.url,
            pic: res.song.artwork,
            id: res.song.id
          }]);
          palyer.setMusic(this.$aplayer.playIndex + 1);
          palyer.pause();
          palyer.play();
          this.play_id = res.song.id;
          this.log({
            eventName: 'play_song_btn_click-' + type,
            label: res.song.name,
            msg: '歌曲 "' + res.song.name + '" 播放',
            tag: 'play_' + type
          });
          return;
        }
        if (this.play_id === res.song.id) {
          console.log(this.play_id);
          palyer.pause();
          this.play_id = 0;
        }
      },
      download: function (res) {
        let song = res.song;
        let da = document.createElement("a");
        da.href = song.url;
        da.download = song.url;
        document.body.appendChild(da);
        da.click();
        da.remove();

        let type = res.type;
        this.log({
          eventName: 'download_song_btn_click-' + type,
          label: res.song.name,
          msg: '歌曲 "' + res.song.name + '" 下载',
          tag: 'download_' + type
        });
      },
      goMore: function (index) {
        this.$router.push({name: 'list', params: {id: index.index}});
        this.log({
          eventName: 'click_more_list',
          label: 'click_more_' + (index.index + 1),
          msg: '歌单' + (index.index + 1) + 'More按钮的点击',
          tag: 'click'
        });
      },
      savePage: function (res) {
        this.log({
          eventName: 'save_page_btn_click',
          label: 'savePage',
          msg: '收藏'
        });
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
      },
      _initScroll() {
        if (this.menuScroll) {
          this.$nextTick(() => {
            this.menuScroll.refresh();
          });
        } else {
          this.menuScroll = new BetterScroll(this.$refs['content'], {
            click: true
          });
        }
      }
    },
    components: {
      'a-list': List,
      'a-card': Index,
      'a-player': VueAplayer
    }
  };
</script>

<style lang="scss" rel="stylesheet/sass">
  @import "../assets/reset";
  @import "../assets/function";

  body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;
    font-size: 0;
    background: rgba(0, 0, 0, 0);
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .content {
    opacity: 1;
    flex: 1;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  .minPlayer {
    height: 69px;
    flex: 0 1 69px;
    box-shadow: 0 -2px 20px 0px rgba(0, 0, 0, .14);
  }

  .box {
    height: 80px;
    width: 100%;
    display: block;
    background: url("../static/images/cover.png") no-repeat center top;
    background-size: 100%;
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 0;
  }

  .aplayer {
    position: relative;
    z-index: 2;
    margin: 3px 0 0 0;
  }
  .aplayer-list {
    display: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
