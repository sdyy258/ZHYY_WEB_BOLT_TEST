<template>
  <a-modal
    centered
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
        <a-form-item label="审核状态">
          <a-select v-decorator="['isReview',validatorRules.isReview]" placeholder="请选择审核状态" @change="$set(model,'isReview',$event)">
            <a-select-option :value="1">通过</a-select-option>
            <a-select-option :value="2">拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="model.isReview==2" label="拒绝原因">
          <a-input v-decorator="['reason']" placeholder="请输入拒绝原因" />
        </a-form-item>
      </a-form>
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
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        isReview: { rules: [{ required: true, message: '请选择审核状态' }] }
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
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.model.id
          if (values.isReview != 2) {
            values.reason = ''
          }
          this.putAction('/tQuestion/tQuestion/review', values).then(res => {
            if (res.success) {
              this.$message.success('审核成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    }
  }
}
</script>

