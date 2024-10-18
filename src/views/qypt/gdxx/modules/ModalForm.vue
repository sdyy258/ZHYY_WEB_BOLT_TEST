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
          <!--          <a-form-item label="客户">-->
          <!--            <j-search-select-tag v-decorator="['customerId',validatorRules.customerId]" dict="base_enterprise,enterprise_name,id" placeholder="请选择" />-->
          <!--          </a-form-item>-->
          <a-form-item label="工单标题">
            <a-input v-decorator="['ticketTitle',validatorRules.ticketTitle]" placeholder="请输入工单标题" />
          </a-form-item>
          <a-form-item label="工单描述">
            <a-textarea v-decorator="['ticketDescription']" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请输入工单描述" />
          </a-form-item>
          <a-form-item label="工单状态">
            <j-dict-select-tag v-decorator="['ticketStatus']" dict-code="assigned_status" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="工单优先级">
            <j-dict-select-tag v-decorator="['priority']" dict-code="ticket_priority" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="是否收费">
            <j-dict-select-tag v-decorator="['isCharge']" dict-code="yn" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="服务类型">
            <j-dict-select-tag v-decorator="['serviceType']" dict-code="service_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="免费服务类型">
            <j-dict-select-tag v-decorator="['freeType']" dict-code="free_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="收费服务类型">
            <j-dict-select-tag v-decorator="['chargeType']" dict-code="charge_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="附件">
            <j-upload v-decorator="['annex']" />
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
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        // customerId: { rules: [{ required: true, message: '请选择客户' }] }
        ticketTitle: { rules: [{ required: true, message: '请填写工单标题' }] }
      },
      url: {
        add: '/ywTicketInfo/ywTicketInfo/add',
        edit: '/ywTicketInfo/ywTicketInfo/edit'
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

