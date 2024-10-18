<template>
  <a-modal
    centered
    :title="title"
    :width="1200"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="two-col-form-longLabel-lg">
        <div class="flex flex-wrap">
          <a-form-item label="所属企业">
            <j-search-select-tag v-decorator="['enterpriseId',validatorRules.enterpriseId]" dict="base_enterprise,enterprise_name,id" @change="changeEnterprise" />
          </a-form-item>
          <a-form-item label="所属排口">
            <j-search-select-tag
              v-decorator="['portId',validatorRules.portId]"
              :dict="form.getFieldValue('enterpriseId') ? `base_discharge_port,name,id,enterprise_id=${form.getFieldValue('enterpriseId')}` : 'base_discharge_port,name,id'"
            />
          </a-form-item>
          <a-form-item label="设备类型">
            <j-dict-select-tag v-decorator="['equipmentType']" dict-code="equipment_type" placeholder="请选择设备类型" />
          </a-form-item>
          <a-form-item label="品牌">
            <a-input v-decorator="['brand']" placeholder="请输入品牌" />
          </a-form-item>
          <a-form-item label="型号">
            <a-input v-decorator="['deviceModel']" placeholder="请输入型号" />
          </a-form-item>
          <a-form-item label="联网日期">
            <j-date v-decorator="['netTime']" placeholder="请选择联网日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="自验收日期">
            <j-date v-decorator="['selfCheckedTime']" placeholder="请选择自验收日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保产品认证编号">
            <a-input v-decorator="['enviNo']" placeholder="请输入环保产品认证编号" />
          </a-form-item>
          <a-form-item label="环保产品认证编号发证日期">
            <j-date v-decorator="['enviStartTime']" placeholder="请选择环保产品认证编号发证日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保产品认证编号有效日期">
            <j-date v-decorator="['enviEndTime']" placeholder="请选择环保产品认证编号有效日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="计量器具型式标准证书发证日期">
            <j-date v-decorator="['measureStartTime']" placeholder="请选择计量器具型式标准证书发证日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="计量器具型式标准证书有效日期">
            <j-date v-decorator="['measureEndTime']" placeholder="请选择计量器具型式标准证书有效日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保适用性检测证书发证日期">
            <j-date v-decorator="['detectionStartTime']" placeholder="请选择环保适用性检测证书发证日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保适用性检测证书有效日期">
            <j-date v-decorator="['detectionEndTime']" placeholder="请选择环保适用性检测证书有效日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="计量器具型式标准证书">
            <j-image-upload v-decorator="['measureValidity']" />
          </a-form-item>
          <a-form-item label="环保适用性检测证书">
            <j-image-upload v-decorator="['detectionCert']" />
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
        enterpriseId: { rules: [{ required: true, message: '请选择所属企业' }] },
        portId: { rules: [{ required: true, message: '请选择所属排口' }] }
      },
      url: {
        add: '/baseEquipment/baseEquipment/add',
        edit: '/baseEquipment/baseEquipment/edit'
      },
      rangeDate: [],
      readOnly: false
    }
  },
  methods: {
    changeEnterprise() {
      this.form.setFieldsValue({
        portId: undefined
      })
    },
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

