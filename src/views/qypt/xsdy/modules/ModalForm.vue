<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="two-col-form">
        <div class="flex flex-wrap">
          <a-form-item label="所属分类">
            <a-tree-select
              v-decorator="['categoryId',validatorRules.categoryId]"
              :tree-data="categoryTreeData"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择所属分类"
              allow-clear
              tree-default-expand-all
              tree-node-filter-prop="title"
            />
          </a-form-item>
          <a-form-item label="标题">
            <a-input v-decorator="['title',validatorRules.title]" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="主题词">
            <a-input v-decorator="['keyword']" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="附件">
            <j-upload v-decorator="['filePath']" />
          </a-form-item>
          <a-form-item label="内容" style="width: 100%;">
            <j-editor v-decorator="['content']" trigger-change />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: ['categoryTreeData'],
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        categoryId: { rules: [{ required: true, message: '请选择分类' }] },
        title: { rules: [{ required: true, message: '请输入标题' }] }
      },
      url: {
        add: '/ywOnlineQa/ywOnlineQa/add',
        edit: '/ywOnlineQa/ywOnlineQa/edit'
      },
      readOnly: false
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (record.id) {
        this.readOnly = true
        this.$nextTick(() => {
          this.form.setFieldsValue(this.pick(record, Object.keys(this.form.getFieldsValue())))
        })
      } else {
        this.readOnly = false
      }
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const httpUrl = this.model.id ? this.url.edit : this.url.add
          const method = this.model.id ? 'put' : 'post'
          values.id = this.model.id
          this.httpAction(httpUrl, values, method).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>

