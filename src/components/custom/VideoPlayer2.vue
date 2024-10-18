<template>
  <div :id="componentId" :style="{width,height}" />
</template>

<script>

const polyvPlayer = window.polyvPlayer

export default {
  name: 'VideoPlayer',
  props: {
    url: {
      type: String,
      required: true
    },
    isDoubleSpeed: {// 是否允许倍速 0否1是
      type: Number,
      default: 1
    },
    watchStartTime: {// 跳转播放时间
      type: Number,
      default: 0
    },
    isBanSeekByLimitTime: {// 是否允许拖放
      type: String,
      default: 'on'
    },
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
    }
  },
  data() {
    return {
      player: null
    }
  },
  watch: {
    url() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
      this.$nextTick(() => {
        this.initPlayer()
      })
    }
  },
  mounted() {
    if (this.url) {
      this.initPlayer()
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy()
    }
  },
  methods: {
    initPlayer() {
      this.player = polyvPlayer({
        wrap: `#${this.componentId}`,
        url: location.protocol + '//' + location.host + this.url,
        speed: this.isDoubleSpeed === 1 ? [0.5, 1, 1.5, 2, 3] : false,
        // ban_seek: 'on',
        ban_seek_by_limit_time: this.isBanSeekByLimitTime,
        hideSwitchPlayer: true,
        watchStartTime: this.watchStartTime
      })
    }
  }
}
</script>

<style scoped>

</style>
