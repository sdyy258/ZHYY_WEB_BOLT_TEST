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
          <a-form-item label="监测项目">
            <j-search-select-tag v-decorator="['itemId',validatorRules.itemId]" dict="base_item,item_name,id" />
          </a-form-item>
          <a-form-item label="测量方法原理">
            <j-dict-select-tag v-decorator="['principle']" dict-code="principle" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="采样方式">
            <j-dict-select-tag v-decorator="['sampleMode']" dict-code="sample_mode" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="样品采集量">
            <a-input-number v-decorator="['sampleCount']" placeholder="请输入样品采集量" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="检出限">
            <a-input-number v-decorator="['monitorLimit']" placeholder="请输入检出限" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="废液产生量">
            <a-input-number v-decorator="['liquidWaste']" placeholder="请输入废液产生量" style="width: 100%" :min="0" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: ['parentInfo'],
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        itemId: { rules: [{ required: true, message: '请选择监测项目' }] }
      },
      url: {
        add: '/baseItemEquipment/baseItemEquipment/add',
        edit: '/baseItemEquipment/baseItemEquipment/edit'
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
          values.equipmentId = this.parentInfo.id
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

