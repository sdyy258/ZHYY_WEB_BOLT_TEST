<template>
  <a-modal
    class="scrollModal"
    centered
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
          <a-form-item label="所属企业">
            <j-search-select-tag v-decorator="['enterpriseId',validatorRules.enterpriseId]" dict="base_enterprise,enterprise_name,id" />
          </a-form-item>
          <a-form-item label="排放口名称">
            <a-input v-decorator="['name']" placeholder="请输入排放口名称" />
          </a-form-item>
          <a-form-item label="排放口编号">
            <a-input v-decorator="['code']" placeholder="请输入排放口编号" />
          </a-form-item>
          <a-form-item label="经纬度">
            <a-input-group style="display: flex; transform: translateY(5px)">
              <div style="flex: 1;display: flex">
                <a-input-number v-decorator="['longitude']" addon-before="经度" style="width: 50%;" placeholder="经度" :min="0" />
                <a-input-number v-decorator="['latitude']" addon-before="纬度" style="width: 50%;" placeholder="纬度" :min="0" />
              </div>
              <a-button type="primary" style="transform: translateY(-1px)" @click="showMapModal">地图</a-button>
            </a-input-group>
          </a-form-item>
          <a-form-item label="排放方式">
            <j-dict-select-tag v-decorator="['portType']" dict-code="port_type" placeholder="请选择排放方式" />
          </a-form-item>
          <a-form-item label="排口类型">
            <j-dict-select-tag v-decorator="['type']" dict-code="portType" placeholder="请选择排口类型" />
          </a-form-item>
          <a-form-item label="联网级别">
            <j-dict-select-tag v-decorator="['netLevel']" dict-code="net_level" placeholder="请选择联网级别" />
          </a-form-item>
          <a-form-item label="管理类别">
            <j-dict-select-tag v-decorator="['manageType']" dict-code="manage_type" placeholder="请选择管理类别" />
          </a-form-item>
          <a-form-item label="是否折算">
            <j-dict-select-tag v-decorator="['isDiscount']" dict-code="yn" placeholder="请选择排放方式" />
          </a-form-item>
          <a-form-item label="探头安装位置">
            <a-input v-decorator="['monitorLocation']" placeholder="请输入探头安装位置" />
          </a-form-item>
          <a-form-item label="采样处当量直径">
            <a-input-number v-decorator="['monitorDiameter']" placeholder="请输入采样处当量直径" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="监测平台高度">
            <a-input-number v-decorator="['monitorHeight']" placeholder="请输入监测平台高度" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="采样处烟道截面积">
            <a-input-number v-decorator="['monitorArea']" placeholder="请输入采样处烟道截面积" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="排气筒高度(m)">
            <a-input-number v-decorator="['height']" placeholder="请输入排气筒高度(m)" style="width: 100%" :min="0" />
          </a-form-item>
          <a-form-item label="运维方式">
            <a-input v-decorator="['maintenMode']" placeholder="请输入运维方式" />
          </a-form-item>
          <a-form-item label="运维公司名称">
            <a-input v-decorator="['maintenCom']" placeholder="请输入运维公司名称" />
          </a-form-item>
          <a-form-item label="运维人员">
            <a-input v-decorator="['maintenPerson']" placeholder="请输入运维人员" />
          </a-form-item>
          <a-form-item label="运维人员手机号">
            <a-input v-decorator="['maintenPersonPhone']" placeholder="请输入运维人员手机号" />
          </a-form-item>
          <a-form-item label="采样点照片">
            <j-image-upload v-decorator="['photoOne']" is-multiple />
          </a-form-item>
          <a-form-item label="站房外全景照片">
            <j-image-upload v-decorator="['photoTwo']" is-multiple />
          </a-form-item>
          <a-form-item label="站房内全景照片">
            <j-image-upload v-decorator="['photoThree']" is-multiple />
          </a-form-item>
          <a-form-item label="各设备照片">
            <j-image-upload v-decorator="['photoFour']" is-multiple />
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
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        enterpriseId: { rules: [{ required: true, message: '请选择企业' }] }
      },
      url: {
        add: '/baseDischargePort/baseDischargePort/add',
        edit: '/baseDischargePort/baseDischargePort/edit'
      },
      rangeDate: [],
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

