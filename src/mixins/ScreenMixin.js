// 屏幕适配 适应于系统中不包含菜单的界面
export default {
  data() {
    return {
      screenWidth: null,
      screenHeight: null,
      scale: 1
    }
  },
  computed: {
    parentDivStyle() {
      return {
        width: this.screenWidth + 'px',
        height: this.screenHeight + 'px',
        overflow: 'hidden',
        position: 'relative'
      }
    },
    screenAdapterStyle() {
      this.scale = this.screenWidth / 1920
      return {
        width: '1920px',
        height: '1080px',
        transform: `scale(${this.scale})`,
        transformOrigin: '0 0'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.screenWidth = document.body.clientWidth
      this.screenHeight = this.screenWidth / (1920 / 1080)
      // this.screenHeight = window.innerHeight
    })
    window.addEventListener('resize', () => {
      this.screenWidth = document.body.clientWidth
      this.screenHeight = this.screenWidth / (1920 / 1080)
      // this.screenHeight = window.innerHeight
    })
  }
}
