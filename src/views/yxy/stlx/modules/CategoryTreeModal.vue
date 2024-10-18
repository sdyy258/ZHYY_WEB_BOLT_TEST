<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @cancel="visible = false"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <a-tree-select
        v-model="value"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
        :tree-data="treeData"
        show-search
        tree-node-filter-prop="title"
        placeholder="请选择分类"
        tree-default-expand-all
      />
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      title: '分类选择',
      visible: false,
      model: {},
      confirmLoading: false,
      value: undefined,
      treeData: []
    }
  },
  methods: {
    showModal() {
      this.visible = true
      this.getTreeData()
    },
    getTreeData() {
      this.loading = true
      this.getAction('/sys/category/getRandomCategroy', { type: 1 }).then(res => {
        this.loading = false
        this.treeData = res.result
      })
    },
    handleOk() {
      this.getAction('/tQuestion/tQuestion/randomByCategroy', { categoryId: this.value }).then(res => {
        if (res.success) {
          this.$router.push({
            path: '/yxy/sjlx',
            query: {
              type: 6,
              id: this.value
            }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
