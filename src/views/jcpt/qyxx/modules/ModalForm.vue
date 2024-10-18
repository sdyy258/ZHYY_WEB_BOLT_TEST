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
      <a-form :form="form" class="two-col-form">
        <div class="flex flex-wrap">
          <a-form-item label="企业名称">
            <a-input v-decorator="['enterpriseName',validatorRules.enterpriseName]" placeholder="请输入企业名称" />
          </a-form-item>
          <a-form-item label="统一社会信用代码">
            <a-input v-decorator="['creditCode',validatorRules.creditCode]" placeholder="请输入统一社会信用代码" />
          </a-form-item>
          <a-form-item label="所属部门">
            <a-tree-select
              v-decorator="['departId',validatorRules.departId]"
              :tree-data="sysDepartTree"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择所属部门"
              allow-clear
              tree-default-expand-all
              tree-node-filter-prop="title"
            />
          </a-form-item>
          <a-form-item label="所属街道">
            <a-tree-select
              v-decorator="['townId']"
              :tree-data="townTree"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择所属街道"
              allow-clear
              tree-node-filter-prop="title"
              :tree-default-expanded-keys="['37']"
              :replace-fields="	{children:'childList', title:'name', key:'id', value: 'id' }"
            />
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
          <a-form-item label="详细地址">
            <a-input v-decorator="['address']" placeholder="请输入详细地址" />
          </a-form-item>
          <a-form-item label="环保负责人">
            <a-input v-decorator="['telLeader']" placeholder="请输入环保负责人" />
          </a-form-item>
          <a-form-item label="环保负责人电话">
            <a-input v-decorator="['telManager']" placeholder="请输入环保负责人电话" />
          </a-form-item>
          <a-form-item label="排污许可证编号">
            <a-input v-decorator="['permitNumber']" placeholder="请输入排污许可证编号" />
          </a-form-item>
          <a-form-item label="企业法人">
            <a-input v-decorator="['legalRepresentative']" placeholder="请输入企业法人" />
          </a-form-item>
          <a-form-item label="营业执照图片">
            <j-image-upload v-decorator="['businessLicense']" />
          </a-form-item>
          <a-form-item label="厂区大门图片">
            <j-image-upload v-decorator="['enterpriseGate']" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
    <map-modal ref="mapModal" @mapClick="mapClick" />
  </a-modal>
</template>

<script>
import MapModal from '@/components/custom/MapModal'
export default {
  components: { MapModal },
  props: ['sysDepartTree', 'townTree'],
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        enterpriseName: { rules: [{ required: true, message: '请输入企业名称' }] },
        departId: { rules: [{ required: true, message: '请选择所属部门' }] },
        creditCode: { rules: [{ required: true, message: '请输入统一社会信用代码' }, { pattern: this.pattern.creditCode.pattern, message: this.pattern.creditCode.message }] }
      },
      url: {
        add: '/baseEnterprise/baseEnterprise/add',
        edit: '/baseEnterprise/baseEnterprise/edit'
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
      const { longitude, latitude, address } = e
      this.$nextTick(() => {
        this.form.setFieldsValue({ longitude, latitude, address })
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

