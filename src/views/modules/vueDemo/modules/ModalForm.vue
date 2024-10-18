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
          <a-form-item label="输入框">
            <a-input v-decorator="['prop1',validatorRules.prop1]" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="数字框">
            <a-input-number v-decorator="['prop2']" placeholder="请输入" :min="0" :precision="0" style="width: 100%" />
          </a-form-item>
          <a-form-item label="下拉字典单选框">
            <j-dict-select-tag v-decorator="['prop3']" dict-code="is_open" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="下拉字典多选框">
            <j-multi-select-tag v-decorator="['prop4']" dict-code="company_size" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="日期">
            <a-date-picker v-decorator="['prop5']" value-format="YYYY-MM-DD" placeholder="请选择日期" />
          </a-form-item>
          <a-form-item label="日期时间">
            <a-date-picker v-decorator="['prop6']" value-format="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择日期" />
          </a-form-item>
          <a-form-item label="文本框">
            <a-textarea v-decorator="['prop7']" :rows="3" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="上传图片">
            <j-image-upload v-decorator="['prop8']" />
          </a-form-item>
          <a-form-item label="上传文件">
            <j-upload v-decorator="['prop9']" :multiple="false" :number="1" />
          </a-form-item>
          <!--          <a-form-item label="时间段带时分秒">-->
          <!--            <a-range-picker v-decorator="['rangeDate',validatorRules.rangeDate]" value-format="YYYY-MM-DD HH:mm:ss" show-time style="width: 100%;" />-->
          <!--          </a-form-item>-->
          <!--          <a-form-item label="时间段不带时分秒">-->
          <!--            <a-range-picker v-decorator="['rangeDate',validatorRules.rangeDate]" value-format="YYYY-MM-DD" style="width: 100%;" />-->
          <!--          </a-form-item>-->
        </div>
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
        prop1: { rules: [{ required: true, message: '请输入输入框' }] },
        rangeDate: { rules: [{ required: false, message: '请选择时间范围' }] }
      },
      url: {
        add: '/energy/testDemoVue/add',
        edit: '/energy/testDemoVue/edit'
      },
      rangeDate: [],
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
          // 有时间范围时使用
          // this.form.setFieldsValue({
          //   rangeDate: [record.startTime, record.endTime]
          // })
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

