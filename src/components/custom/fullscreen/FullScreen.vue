<template>
  <div style="transform: translateY(-10px);display: flex;flex-direction: column;align-items: center;cursor: pointer" @click="handleFullScreen">
    <!--    <a-tooltip :title="fullscreen?'缩小':'全屏'" placement="bottom" @click="handleFullScreen">-->
    <!--      <a-icon :type="fullscreen?'fullscreen-exit':'fullscreen'" style="font-size: 26px;font-weight: 600;color: red" />-->
    <!--    </a-tooltip>-->
    <a-icon :type="fullscreen?'fullscreen-exit':'fullscreen'" style="font-size: 26px;font-weight: 600;color: red" />
    <div style="color: red">全屏填报</div>
  </div>
</template>

<script>
export default {
  name: 'FullScreen',
  props: {
    containerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fullscreen: false
    }
  },
  // mounted() {
  //   let fullscreenchange
  //   if ('onfullscreenchange' in document) {
  //     fullscreenchange = 'fullscreenchange'
  //   } else if ('onmozfullscreenchange' in document) {
  //     fullscreenchange = 'mozfullscreenchange'
  //   } else if ('onwebkitfullscreenchange' in document) {
  //     fullscreenchange = 'webkitfullscreenchange'
  //   } else if ('onmsfullscreenchange' in document) {
  //     fullscreenchange = 'MSFullscreenChange'
  //   }
  //   const that = this
  //   window.addEventListener(fullscreenchange, function() {
  //     that.fullscreen = !that.fullscreen
  //     that.$emit('changeFullScreen', that.fullscreen)
  //   })
  // },
  methods: {
    handleFullScreen() {
      if (this.fullscreen) {
        this.$utils.exitFullscreen()
      } else {
        this.$utils.fullscreen()
      }
    }
    // // 全屏事件
    // handleFullScreen() {
    //   // const element = document.documentElement// 设置后就是我们平时的整个页面全屏效果
    //   const element = document.getElementById(this.containerId)
    //   if (this.fullscreen) {
    //     if (document.exitFullscreen) {
    //       document.exitFullscreen()
    //     } else if (document.webkitCancelFullScreen) {
    //       document.webkitCancelFullScreen()
    //     } else if (document.mozCancelFullScreen) {
    //       document.mozCancelFullScreen()
    //     } else if (document.msExitFullscreen) {
    //       document.msExitFullscreen()
    //     }
    //   } else {
    //     if (element.requestFullscreen) {
    //       element.requestFullscreen()
    //     } else if (element.webkitRequestFullScreen) {
    //       element.webkitRequestFullScreen()
    //     } else if (element.mozRequestFullScreen) {
    //       element.mozRequestFullScreen()
    //     } else if (element.msRequestFullscreen) {
    //       // IE11
    //       element.msRequestFullscreen()
    //     }
    //   }
    //   // this.fullscreen = !this.fullscreen
    // }
  }
}
</script>

<style scoped>

</style>
