<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    :footer="null"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <video-player
        :url="filePath||''"
        :is-double-speed="1"
        :is-ban-seek-by-limit-time="'off'"
        height="650px"
      />
    </a-spin>
  </a-modal>
</template>

<script>
import VideoPlayer from '@/components/custom/VideoPlayer2'
export default {
  components: { VideoPlayer },
  data() {
    return {
      title: '预览课件',
      visible: false,
      confirmLoading: false,
      filePath: '' // 播放路径
    }
  },
  methods: {
    showModal(filePath, lessonName) {
      this.filePath = filePath
      this.title = lessonName
      this.visible = true
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

