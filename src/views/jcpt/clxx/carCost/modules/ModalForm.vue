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
      <a-form :form="form" class="two-col-form-longLabel">
        <div class="flex flex-wrap">
          <a-form-item label="费用类型">
            <j-dict-select-tag v-decorator="['expenseType',validatorRules.expenseType]" dict-code="expense_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="费用发生时间">
            <j-date v-decorator="['expenseDate']" placeholder="请选择费用发生时间" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-item>
          <a-form-item label="费用描述">
            <a-input v-decorator="['description']" placeholder="请输入费用描述" />
          </a-form-item>
          <a-form-item label="费用金额">
            <a-input-number v-decorator="['amount']" placeholder="请输入费用金额" style="width: 100%" :min="0" :precision="2" />
          </a-form-item>
          <a-form-item label="申报人">
            <a-input v-decorator="['reportPerson']" placeholder="请输入申报人" />
          </a-form-item>
          <a-form-item label="保险时间范围">
            <a-range-picker v-decorator="['insureTimeRangeDate']" value-format="YYYY-MM-DD" style="width: 100%;" />
          </a-form-item>
          <a-form-item label="加油时间">
            <j-date v-decorator="['refuelDate']" placeholder="请选择加油日期" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-item>
          <a-form-item label="燃料类型">
            <j-dict-select-tag v-decorator="['fuelType']" dict-code="fuel_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="里程数">
            <a-input-number v-decorator="['mileage']" placeholder="请输入里程数" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="加油数（升）或充电时长/度数" class="longLabel">
            <a-input-number v-decorator="['fuelCount']" placeholder="请输入加油数（升）或充电时长/度数" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="燃料单价（元/升，元/度）" class="longLabel">
            <a-input-number v-decorator="['unitPrice']" placeholder="请输入燃料单价（元/升，元/度）" style="width: 100%" :min="0" :precision="2" />
          </a-form-item>
          <a-form-item label="费用文件">
            <j-upload v-decorator="['fileUrl']" />
          </a-form-item>
          <a-form-item label="备注">
            <a-input v-decorator="['remarks']" placeholder="请输入备注" />
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
        expenseType: { rules: [{ required: true, message: '请选择费用类型' }] }
      },
      url: {
        add: '/baseVehicleExpense/baseVehicleExpense/add',
        edit: '/baseVehicleExpense/baseVehicleExpense/edit'
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
          this.form.setFieldsValue({
            insureTimeRangeDate: [record.insureStartTime, record.insureEndTime]
          })
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
          values.vehicleId = this.parentInfo.id
          if (values.insureTimeRangeDate) {
            values.insureStartTime = values.insureTimeRangeDate[0]
            values.insureEndTime = values.insureTimeRangeDate[1]
            delete values.insureTimeRangeDate
          }
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

