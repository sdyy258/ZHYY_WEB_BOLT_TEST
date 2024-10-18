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
          <a-form-item label="运维类型">
            <j-dict-select-tag v-decorator="['type',validatorRules.type]" dict-code="maintenance_type" trigger-change placeholder="请选择运维类型" />
          </a-form-item>
          <a-form-item label="故障类型">
            <j-dict-select-tag v-decorator="['faultType']" dict-code="fault_type" trigger-change placeholder="请选择故障类型" />
          </a-form-item>
          <a-form-item label="现场打卡经纬度">
            <a-input-group style="display: flex; transform: translateY(5px)">
              <div style="flex: 1;display: flex">
                <a-input-number v-decorator="['longitude']" addon-before="经度" style="width: 50%;" placeholder="经度" :min="0" />
                <a-input-number v-decorator="['latitude']" addon-before="纬度" style="width: 50%;" placeholder="纬度" :min="0" />
              </div>
              <a-button type="primary" style="transform: translateY(-1px)" @click="showMapModal">地图</a-button>
            </a-input-group>
          </a-form-item>
          <a-form-item label="现场情况描述">
            <a-input v-decorator="['utf8mb4']" placeholder="请输入现场情况描述" />
          </a-form-item>
          <a-form-item label="解决方案">
            <a-input v-decorator="['solution']" placeholder="请输入解决方案" />
          </a-form-item>
          <a-form-item label="运维人员">
            <a-input v-decorator="['maintenancePerson']" placeholder="请输入运维人员" />
          </a-form-item>
          <a-form-item label="记录时间">
            <j-date v-decorator="['recordTime']" placeholder="请选择记录时间" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-item>
          <a-form-item label="确认人">
            <a-input v-decorator="['confirmBy']" placeholder="请输入确认人" />
          </a-form-item>
          <a-form-item label="确认时间">
            <j-date v-decorator="['confirmTime']" placeholder="请选择确认时间" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-item>
          <a-form-item label="确认意见">
            <a-input v-decorator="['confirmReason']" placeholder="请输入确认意见" />
          </a-form-item>
          <a-form-item label="维修记录文件">
            <j-upload v-decorator="['fileUrl']" />
          </a-form-item>
          <a-form-item label="备注">
            <a-input v-decorator="['remarks']" placeholder="请输入备注" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
    <map-modal ref="mapModal" @mapClick="mapClick" />
  </a-modal>
</template>

<script>
import MapModal from '@comp/custom/MapModal'

export default {
  components: { MapModal },
  props: ['parentInfo'],
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        type: { rules: [{ required: true, message: '请选择运维类型' }] }
      },
      url: {
        add: '/baseEquMaintenanceRecord/baseEquMaintenanceRecord/add',
        edit: '/baseEquMaintenanceRecord/baseEquMaintenanceRecord/edit'
      },
      readOnly: false
    }
  },
  methods: {
    showMapModal() {
      const longitude = this.form.getFieldValue('longitude')
      const latitude = this.form.getFieldValue('latitude')
      this.$refs.mapModal.showModal({ longitude, latitude })
    },
    // 地图
    mapClick(e) {
      const { longitude, latitude } = e
      this.$nextTick(() => {
        this.form.setFieldsValue({ longitude, latitude })
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

