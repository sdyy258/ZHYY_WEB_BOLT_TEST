<template>
  <a-modal
    destroy-on-close
    class="detailModal"
    title="维修记录"
    width="80%"
    :visible="visible"
    :mask-closable="false"
    cancel-text="关闭"
    @cancel="visible=false"
  >
    <index-page v-bind="$attrs" :parent-info="model" />
  </a-modal>
</template>

<script>
import IndexPage from './index'
export default {
  name: 'IndexModal',
  components: { IndexPage },
  data() {
    return {
      visible: false,
      model: {}
    }
  },
  methods: {
    showModal(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
