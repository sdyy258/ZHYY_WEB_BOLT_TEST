<template>
  <div :style="{width,height}">
    <div v-show="!isError" :id="componentId" style="height: 100%" />
    <div v-show="isError" :style="{width,height}" style="background: #333;display: flex;align-items: center;justify-content: center">
      <a-button type="primary" @click="playerReplay">视频文件加载失败，请点击重试</a-button>
    </div>
  </div>

</template>

<script>

const polyvPlayer = window.polyvPlayer
// import { WebsocketMixin } from '@/mixins/WebsocketMixin'
import { getAction } from '@api/manage'
import { Modal } from 'ant-design-vue'

export default {
  name: 'VideoPlayer',
  // mixins: [WebsocketMixin],
  props: {
    componentId: {
      type: String,
      default: 'polyvPlayer'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    url: {
      type: String,
      required: true
    },
    isDoubleSpeed: {// 是否允许倍速 0否1是
      type: Number,
      default: 1
    },
    watchStartTime: {
      type: Number,
      default: 0
    },
    isGetPlayInfo: {// 是否需要获取当前播放信息
      type: Boolean,
      default: false
    },
    isBanSeekByLimitTime: {// 是否允许拖放
      type: String,
      default: 'on'
    }
  },
  data() {
    return {
      isError: false, // 是否错误
      socketUrl: '/websocket',
      player: null,
      playInfo: {},
      intervalId: null,
      uuid: '',
      isPlaying: false// 是否正在播放
    }
  },
  watch: {
    url() {
      if (this.player) {
        this.player.destroy()
        this.player = null
        this.isPlaying = false
      }
      this.$nextTick(() => {
        this.initPlayer()
      })
    },
    playInfo: {
      deep: true,
      handler(val) {
        if (val.second === val.duration) {
          this.$emit('setPlayInfo', this.playInfo)
        }
      }
    }
  },
  mounted() {
    if (this.url) {
      this.initPlayer()
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
    this.intervalId = null
    this.destroyPlayer()
  },
  methods: {
    // websocketOnmessage(res) {
    //   try {
    //     const data = JSON.parse(res.data)
    //     console.log(`接收消息:${this.uuid}`, res.data)
    //     if (data.type === 'cancel') {
    //       if (data.userId === this.$store.getters.userInfo.id) {
    //         if (this.uuid && this.isPlaying && data.videoPlayId !== this.uuid) {
    //           this.player.j2s_pauseVideo()
    //           this.isPlaying = false
    //           Modal.error({
    //             title: '当前用户已观看其他视频',
    //             content: '很抱歉，当前用户已观看其他视频，当前视频已暂停播放',
    //             mask: false,
    //             onOk: () => {}
    //           })
    //         }
    //       }
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    initPlayer() {
      this.destroyPlayer()
      this.isError = false
      this.player = polyvPlayer({
        wrap: `#${this.componentId}`,
        url: location.protocol + '//' + location.host + this.url,
        speed: this.isDoubleSpeed === 1 ? [0.5, 1, 1.5, 2, 3] : false,
        // ban_seek: 'on',
        ban_seek_by_limit_time: this.isBanSeekByLimitTime,
        hideSwitchPlayer: true,
        watchStartTime: this.watchStartTime
      })
      if (this.isGetPlayInfo) {
        this.render()
      }
      // 视频初次播放或由暂停恢复播放时触发
      this.player.on('s2j_onVideoPlay', () => {
        this.isPlaying = true
        this.uuid = this.$utils.guid()
        const params = {
          userId: this.$store.getters.userInfo.id,
          videoPlayId: this.uuid
        }
        // getAction('/cCourseUser/cCourseUser/pushVedioId', params).then(res => {
        // })
      })
      // 暂停时
      this.player.on('s2j_onVideoPause', () => {
        this.isPlaying = false
      })
      // 播放完毕
      this.player.on('s2j_onPlayOver', () => {
        this.isPlaying = false
        if (this.isGetPlayInfo) {
          this.setPlayInfo()
        }
      })
      // 播放出现错误时触发
      this.player.on('s2j_onPlayerError', () => {
        this.isError = true
      })
    },
    playerReplay() {
      this.initPlayer()
    },
    // 播放时长格式化
    getPlayProgress(current, all) {
      if (!current || !all) {
        return 0
      } else {
        return (current / all).toFixed(2)
      }
    },
    destroyPlayer() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
    },
    setPlayInfo() {
      if (this.player) {
        const second = this.player.j2s_getCurrentTime() || 0
        const duration = this.player.j2s_getDuration() || 0
        this.playInfo = {
          second: parseInt(second),
          duration: parseInt(duration)
        }
        this.$emit('setPlayInfo', this.playInfo)
      }
    },
    render() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      this.intervalId = setInterval(() => {
        this.setPlayInfo()
      }, 1000 * 20)
    }
  }
}
</script>

<style scoped>

</style>
