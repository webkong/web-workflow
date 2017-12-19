<template>
  <div class="main_wrapper" ref="index">
    <div class="wrapper">
      <div class="search_wrapper">
        <div class="search">
          <a-search></a-search>
        </div>
        <div class="collect" @click="save">
          <img src="../static/images/collect.png" alt="">
          <span>Save this page</span>
        </div>
      </div>
      <div class="card" v-for="(playlist, index) in playlists" :key="index">
        <div class="title">
          <div class="line"></div>
          <div class="txt">{{playlist.name}}</div>
          <div class="more" @click="goMore(index)">MORE</div>
        </div>
        <div class="card_content">
          <div class="song_wrapper">
            <div class="song" v-for="(song, index) in playlist.content" :key="index">
              <div class="cover" @click.prevent="play(song)">
                <img v-lazy="song.artwork" alt="">
                <div class="ctrl" :class="{'pause':(play_id === song.id)}"></div>
              </div>
              <div class="info">
                <p class="title2">{{song.name}}</p>
                <p class="name">{{song.artist}}</p>
                <a class="download" @click="down(song)">Download</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="power">
        <img src="../static/images/powered_by.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import Search from './Search';
  import songs from '../data/songs.json';
  import BetterScroll from 'better-scroll';

  let client_id = '?client_id=oZTFwmE20x1Lc35dFEHWmOMdxjjFEJdF';
  export default {
    name: 'app',
    props:{
      play_id:{
        type:Number
      },
      pause:Blob
    },
    data() {
      return {
        autoplay: false,
        songs: songs.content,
      };
    },
    computed: {
      playlists: function () {
        let playlist = [];
        this.songs.map(function (elem) {
          let content = elem.content;
          playlist.push({name: elem.name, content: content.slice(0, 3)});
        });
        return playlist;
      }
    },
    created: function () {
      this.$nextTick(() => {
        this._initScroll();
      });
      document.getElementsByTagName('title')[0].innerHTML = 'Recommended Music for You';
    },
    methods: {
      play: function (song, event) {
        this.$emit('play-song', {song: song, type: 'index'});
      },
      down: function (song) {
        this.$emit('down-song', {song: song, type: 'index'});
      },
      goMore: function (index) {
        this.$emit('go-more', {index: index});
      },
      save: function () {
        this.$emit('save-page', {save: true});
      },
      _initScroll() {
        this.menuScroll = new BetterScroll(this.$refs['index'], {
          click: true
        });
      }
    },
    components: {
      'a-search': Search
    }
  };
</script>

<style lang="scss" rel="stylesheet/sass" scoped="scoped">
  @import "../assets/reset";
  @import "../assets/function";

  .main_wrapper {
    width: 100%;
    height: 100%;
    background: #F4F4F4;
    overflow: hidden;
  }

  .wrapper {
  }

  .search_wrapper {
    padding: rem(10px) rem(10px) rem(1px) rem(10px);
    height: rem(56px);
  }

  .search {
    float: left;
    width: rem(460px);
  }

  .collect {
    float: right;
    width: rem(260px);
    margin-left: rem(10px);
    height: rem(60px);
    border-radius: rem(30px);
    background: #2F9CF6;
    cursor: pointer;
    text-align: center;
    img {
      margin-top: rem(14px);
      width: rem(32px);
      height: rem(32px);
    }
    span {
      padding-left: rem(8px);
      line-height: rem(60px);
      font-size: 12px;
      color: #FFFFFF;
    }

  }

  .card {
    margin: rem(20px) auto;
    background: #fff;
  }

  .title {
    font-size: 0;
    height: rem(80px);
    .line {
      float: left;
      display: block;
      height: rem(32px);
      width: rem(6px);
      background: #2F9CF6;
      margin: rem(24px) rem(14px) auto rem(23px);
    }
    .txt {
      float: left;
      display: block;
      line-height: rem(80px);
      font-size: rem(30px);
      color: #191919;
      font-weight: 700;
    }
    .more {
      margin: 0 rem(22px) auto auto;
      display: block;
      float: right;
      color: #2F9CF6;
      font-size: rem(24px);
      cursor: pointer;
      line-height: rem(80px);
    }
  }

  .card_content {
    overflow: auto;
  }

  .song_wrapper {
    width: 100%;
  }

  .song {
    float: left;
    width: rem(240px);
    padding-right: rem(15px);
    &:last-child {
      padding-right: rem(0);
    }
    .cover {
      position: relative;
      width: rem(240px);
      height: rem(240px);
      img {
        width: 100%;
      }
      .ctrl {
        position: absolute;
        bottom: rem(10px);
        right: rem(10px);
        width: rem(52px);
        height: rem(52px);
        background: url("../static/images/play.png") no-repeat center center;
        background-size: 100%;
        &.pause {
          background-image: url("../static/images/pause.png");
        }
      }
    }
    .info {
      margin: 0 auto;
      width: rem(200px);
      .title2, .name {
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .title2 {
        margin: rem(11px) auto rem(4px) auto;
        font-size: rem(26px);
        color: #191919;
        line-height: rem(26px);
      }
      .name {
        margin: auto auto rem(19px) auto;
        font-size: rem(20px);
        color: #666666;
        line-height: rem(19px);
      }
      a {
        display: block;
        width: rem(150px);
        height: rem(40px);
        text-align: center;
        margin: 0 auto rem(30px) auto;
        font-size: rem(22px);
        color: #2F9CF6;
        line-height: rem(40px);
        border: 1px solid #2F9CF6;
        border-radius: rem(22px);
      }
    }
  }
  .power{
    height: rem(100px);
    width: 100%;
    padding:0;
    margin:0;
    text-align: center;
    img{
      width: rem(200px);
    }
  }
</style>
