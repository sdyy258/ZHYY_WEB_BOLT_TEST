<template>
  <a-modal
    centered
    :title="title"
    :width="1300"
    :visible="visible"
    :mask-closable="false"
    cancel-text="关闭"
    :footer="null"
    destroy-on-close
    @ok="handleOk"
    @cancel="visible = false"
  >
    <index-modal ref="indexModal" :control-type="1" :data-list="result" :record-id="recordId" @handleOk="handleOk" @close="close" />
  </a-modal>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import IndexModal from '@/views/kcgl/kctj/IndexComponent.vue'
export default {
  components: { IndexModal },
  data() {
    return {
      loading: false,
      title: '课程添加',
      visible: false,
      result: {},
      recordId: ''
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    edit() {
      this.visible = true
      this.title = '课程编辑'
      // this.$refs.indexModal.showModal(r,id)
    },
    close() {
      this.visible = false
    },
    handleOk() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>
<style scoped lang="less">

</style>
