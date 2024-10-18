<template>
  <j-modal
    class="detailModal"
    :width="1000"
    switch-fullscreen
    title="pdf查看"
    centered
    :visible="visible"
    :mask-closable="true"
    cancel-text="关闭"
    :footer="null"
    @cancel="visible=false"
  >
    <a-spin tip="加载中..." :spinning="loading" >
      <vue-pdf v-for="i in numPages" :key="i" :page="i" :src="src" />
    </a-spin>
  </j-modal>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'PdfModal',
  components: { VuePdf: pdf },
  data() {
    return {
      loading: false,
      visible: false,
      src: '',
      numPages: 1
    }
  },
  methods: {
    showModal(src) {
      this.visible = true
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

<style scoped lang="less">
  /deep/ .ant-modal-header {
    display: none;
  }
  /deep/ .ant-modal-body {
    height: 100% !important;
    background: #f2f2f2;
    padding:24px 10%;
  }
</style>
