<template>
  <a-modal
    :class="readOnly?'detailModal':''"
    :title="title"
    :width="800"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-spin :spinning="loading">
      <j-form-container :disabled="readOnly">
        <a-form :form="form" class="one-col-form">
          <a-form-item label="评价等级">
            <a-rate v-decorator="['rating',validatorRules.rating]" />
          </a-form-item>
          <a-form-item label="评价内容">
            <a-textarea v-decorator="['comment',validatorRules.comment]" :auto-size="{minRows:4}" placeholder="请填写评价内容" />
          </a-form-item>
        </a-form>
      </j-form-container>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      loading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        rating: { rules: [{ required: true, message: '请选择评价等级' }] },
        comment: { rules: [{ required: false, message: '请输入评价内容' }] }
      },
      readOnly: false
    }
  },
  methods: {
    showModal(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.readOnly = this.model.isComment === 1
      this.$nextTick(() => {
        this.loading = true
        this.getAction('/ywTicketInfo/ywTicketInfo/queryById', { id: record.id }).then(res => {
          this.loading = false
          const evaluationInfo = res.result.evaluation || {}
          this.form.setFieldsValue(this.pick(evaluationInfo, Object.keys(this.form.getFieldsValue())))
        })
      })
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.ticketId = this.model.id
          this.postAction('/ywTicketEvaluation/ywTicketEvaluation/add', values).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

