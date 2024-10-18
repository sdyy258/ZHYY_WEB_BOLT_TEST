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
          <a-form-item label="所属运维组">
            <a-tree-select
              v-decorator="['deptId',validatorRules.deptId]"
              :tree-data="sysDepartTree"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择所属运维组"
              allow-clear
              tree-default-expand-all
              tree-node-filter-prop="title"
            />
          </a-form-item>
          <a-form-item label="车辆名称">
            <a-input v-decorator="['name']" placeholder="请输入车辆名称" />
          </a-form-item>
          <a-form-item label="车牌号">
            <a-input v-decorator="['noPlate']" placeholder="请输入车牌号" />
          </a-form-item>
          <a-form-item label="制造商">
            <a-input v-decorator="['make']" placeholder="请输入制造商" />
          </a-form-item>
          <a-form-item label="车型">
            <a-input v-decorator="['model']" placeholder="请输入车型" />
          </a-form-item>
          <a-form-item label="生产年份">
            <a-input v-decorator="['year']" placeholder="请输入生产年份" />
          </a-form-item>
          <a-form-item label="车辆颜色">
            <a-input v-decorator="['color']" placeholder="请输入车辆颜色" />
          </a-form-item>
          <a-form-item label="车辆类型">
            <j-dict-select-tag v-decorator="['vehicleType']" dict-code="vehicle_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="燃料类型">
            <j-dict-select-tag v-decorator="['fuelType']" dict-code="fuel_type" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="购买日期">
            <j-date v-decorator="['purchaseDate']" placeholder="请选择购买日期" style="width: 100%" />
          </a-form-item>
          <a-form-item label="车辆图片">
            <j-image-upload v-decorator="['fileUrl']" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: ['sysDepartTree'],
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        deptId: { rules: [{ required: true, message: '请选择所属运维组' }] }
      },
      url: {
        add: '/baseVehicleInfo/baseVehicleInfo/add',
        edit: '/baseVehicleInfo/baseVehicleInfo/edit'
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

