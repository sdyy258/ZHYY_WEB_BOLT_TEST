<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="one-col-form">
        <div class="flex flex-wrap">
          <a-form-item label="处理状态">
            <j-dict-select-tag v-decorator="['assignedStatus',validatorRules.assignedStatus]" dict-code="assigned_status" placeholder="请选择" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      title: '工单处理',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        assignedStatus: { rules: [{ required: true, message: '请选择处理状态' }] }
      }
    }
  },
  methods: {
    showModal(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          values.id = this.model.id
          values.ticketId = this.model.id
          this.postAction('/ywTicketHandler/ywTicketHandler/add', values).then((res) => {
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

