<template>
  <div style="overflow-y: auto" :style="{height}">
    <a-spin tip="加载中..." :spinning="loading">
      <vue-pdf v-for="i in numPages" :key="i" :page="i" :src="src" />
    </a-spin>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: { VuePdf: pdf },
  props: {
    path: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      loading: false,
      numPages: 1,
      src: ''
    }
  },
  watch: {
    path: {
      deep: true,
      handler(val) {
        if (val) {
          this.loadPdf(val)
        }
      }
    }
  },
  mounted() {
    if (this.path) {
      this.loadPdf(this.path)
    }
  },
  methods: {
    loadPdf(src) {
      // src = 'https://oems.sdem.org.cn:8000/minio/oems/temp/6.生态环境统计技术规范 排放源统计（HJ 772—2022代替HJ 772—2015）.pdf'
      this.loading = true
      const loadingTask = pdf.createLoadingTask(src)
      this.src = loadingTask
      this.src.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch((err) => {
        console.error('pdf 加载失败', err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang='less'>

</style>
