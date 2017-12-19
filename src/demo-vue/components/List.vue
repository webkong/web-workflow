<template>
  <div class="list_wrapper" ref="list">
    <div>
      <div class="list">
        <div class="item bdr-1px" v-for="(song, index) in playlist.content"  @click="play(song,index)">
          <div class="cover">
            <img v-lazy="song.artwork" alt="" width="100%">
          </div>
          <div class="info">
            <p class="title">{{song.name}}</p>
            <p class="name">{{song.artist}}</p>
          </div>
          <div class="ctrl">
            <div class="down" @click.prevent="down(song,index)"></div>
            <div class="play" :class="{'pause':(play_id === song.id)}"></div>
          </div>
        </div>
      </div>
      <div class="power">
        <img src="../static/images/powered_by.png" class="img" alt="">
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6" charset="utf-8">
  import songs from '../data/songs.json';
  import BetterScroll from 'better-scroll';

  export default {
    name: 'playlist',
    props:{
      play_id:{
        type:Number
      },
      pause:Blob
    },
    data() {
      return {
        playlist: {}
      };
    },
    mounted: function () {

    },
    methods: {
      play: function (song, index) {
        this.$emit('play-song', {song: song, type: 'list', index: index});
      },
      down: function (song) {
        this.$emit('down-song', {song: song, type: 'list', index: index});
      },
      _initScroll() {
        if (this.menuScroll) {
          this.menuScroll.refresh();
        } else {
          this.menuScroll = new BetterScroll(this.$refs['list'], {
            click: true
          });
        }
      }
    },
    created: function () {
      this.playlist = songs.content[this.$route.params.id];
      this.$nextTick(() => {
        this._initScroll();
      });
      console.log('list');
      document.getElementsByTagName('title')[0].innerHTML = this.playlist.name;
    }
  };
</script>

<style lang="scss" rel="stylesheet/sass" scoped="scoped">
  @import "../assets/function";

  .list_wrapper {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
  }

  .list {
    padding-left: rem(26px);
    .item {
      height: rem(140px);
      border-bottom: rem(1px) solid #D8D8D8;
      clear: both;
      .cover {
        float: left;
        width: rem(100px);
        height: rem(100px);
        margin: rem(20px) rem(26px) rem(26px) rem(0);
      }
      .info {
        float: left;
        padding-top: rem(30px);
        text-align: left;
        .title {
          width: rem(360px);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: rem(30px);
          color: #000000;
        }
        .name {
          padding-top: rem(13px);
          font-size: rem(24px);
          color: #999999;
        }
      }
      .ctrl {
        padding-top: rem(45px);
        float: right;
        .down, .play {
          float: left;
          cursor: pointer;
          width: rem(50px);
          height: rem(50px);
          background: url("../static/images/download.png") no-repeat center center;
          background-size: 100%;
        }
        .down {

        }
        .play {
          margin: auto rem(26px) auto rem(21px);
          background-image: url("../static/images/play0.png");
          &.pause {
            background-image: url("../static/images/pause.png");
          }
        }
      }

    }
    @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-aspect-ratio: 1.5) {
      .bdr-1px {
        &::after {
          -webkit-transform: scaleY(0.7);
          transform: scaleY(0.7)
        }
      }
    }
    @media (-webkit-min-device-pixel-ratio: 2), (min-device-aspect-ratio: 2) {
      .bdr-1px {
        &::after {
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5)
        }
      }
    }
  }
  .power{
    height: rem(100px);
    width: 100%;
    padding:0;
    margin:0;
    .img{
      width: rem(200px);
      padding-left: rem(139px);
      padding-top: rem(10px);
    }
  }
</style>
