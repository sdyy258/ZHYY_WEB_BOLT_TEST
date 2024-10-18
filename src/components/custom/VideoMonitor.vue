<template>
  <video id="video" :width="width" :height="height" />
</template>

<script>
export default {
  name: 'VideoMonitor',
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    isCameraCapture: {// 是否开启抓拍
      type: Boolean,
      default: false
    },
    cameraCaptureStart: {// 开始抓拍时间
      type: [String, Number],
      default: 10
    },
    cameraCaptureTime: {// 0随机抓拍 1间隔抓拍
      type: [String, Number],
      default: 0
    },
    cameraCaptureNum: {// 抓拍间隔时间
      type: [String, Number],
      default: 10
    }
  },
  data() {
    return {
      mediaStream: null,
      scale: 1, // 控制 图片的缩放比率
      intervalId: null
    }
  },
  mounted() {
    this.initialize()
    if (this.isCameraCapture) {
      if (this.cameraCaptureTime == 1) {
        setTimeout(() => {
          this.captureImage()
          this.intervalId = setInterval(() => {
            this.captureImage()
          }, 1000 * 60 * (parseInt(this.cameraCaptureNum) || 1))
        }, 1000 * 60 * (parseInt(this.cameraCaptureStart) || 0.1))
      } else {
        const array = [1, 5, 15, 30, 58, 80, 119, 149, 200]
        for (let i = 0; i < array.length; i++) {
          setTimeout(() => {
            this.captureImage()
          }, 1000 * 60 * array[i])
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
    this.intervalId = null
    this.closeMedia()
  },
  methods: {
    // 初始化
    initialize() {
      //  判断浏览器, 获得用户设备的兼容方法
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      const constraints = { audio: true, video: { width: 1280, height: 720 }}
      // 调用摄像头
      navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
        this.mediaStream = mediaStream
        console.log('# 初始化 摄像头')
        // 成功后获取视频流：mediaStream
        const video = document.getElementById('video')
        // 静音
        video.muted = true
        //  赋值 video 并开始播放
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          video.play()
        }
        // 初始化录制器
        // initMediaRecorder(mediaStream)
      })
    },
    // 关闭摄像头
    closeMedia() {
      this.mediaStream.getVideoTracks().forEach(function(track) {
        track.stop()
      })
    },
    // 图片抓拍
    captureImage() {
      const canvas = document.createElement('canvas')
      const video = document.getElementById('video')
      // canvas.width = video.videoWidth * this.scale
      // canvas.height = video.videoHeight * this.scale
      canvas.width = 520
      canvas.height = 400
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      const img = document.createElement('img')
      img.src = canvas.toDataURL()
      const data = canvas.toDataURL()
      console.log(data)
      this.$emit('captureImage', data)
    }
  }
}
</script>

<style scoped>

</style>
