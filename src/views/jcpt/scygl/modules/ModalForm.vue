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
          <a-form-item label="所属企业">
            <j-search-select-tag v-decorator="['enterpriseId',validatorRules.enterpriseId]" dict="base_enterprise,enterprise_name,id" />
          </a-form-item>
          <a-form-item label="数采仪生产商">
            <a-input v-decorator="['brand']" placeholder="请输入数采仪生产商" />
          </a-form-item>
          <a-form-item label="是否2017版212规约">
            <j-dict-select-tag v-decorator="['isOld']" dict-code="yn" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="数采仪型号">
            <a-input v-decorator="['scyType']" placeholder="请输入数采仪型号" />
          </a-form-item>
          <a-form-item label="数采仪出厂编号">
            <a-input v-decorator="['scyCode']" placeholder="请输入数采仪出厂编号" />
          </a-form-item>
          <a-form-item label="网络类型">
            <j-dict-select-tag v-decorator="['netType']" dict-code="netType" placeholder="请选择" />
          </a-form-item>
          <a-form-item label="无线传输卡号">
            <a-input v-decorator="['iccId']" placeholder="请输入无线传输卡号" />
          </a-form-item>
          <a-form-item label="mn号">
            <a-input v-decorator="['mn']" placeholder="请输入mn号" />
          </a-form-item>
          <a-form-item label="设备地址">
            <a-input v-decorator="['scyAddress']" placeholder="请输入设备地址" />
          </a-form-item>
          <a-form-item label="适用性及监测报告文号">
            <a-input v-decorator="['scyReportNo']" placeholder="请输入适用性及监测报告文号" />
          </a-form-item>
          <a-form-item label="报告文号发证日期">
            <j-date v-decorator="['reportStartTime']" placeholder="请选择报告文号发证日期" date-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="报告文号有效日期">
            <j-date v-decorator="['reportEndTime']" placeholder="请选择报告文号有效日期" date-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="生产许可证编号">
            <a-input v-decorator="['licenceCode']" placeholder="请输入生产许可证编号" />
          </a-form-item>
          <a-form-item label="许可证发证日期">
            <j-date v-decorator="['licenceStartTime']" placeholder="请选择许可证发证日期" date-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="许可证有效日期">
            <j-date v-decorator="['licenceEndTime']" placeholder="请选择许可证有效日期" date-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保产品认证编号">
            <a-input v-decorator="['envirProductCode']" placeholder="请输入环保产品认证编号" />
          </a-form-item>
          <a-form-item label="环保认证发证日期">
            <j-date v-decorator="['envirStartTime']" placeholder="请选择环保认证发证日期" date-format="YYYY-MM-DD" style="width: 100%" />
          </a-form-item>
          <a-form-item label="环保认证有效期">
            <j-date v-decorator="['envirEndTime']" placeholder="请选择环保认证有效期" date-format="YYYY-MM-DD" style="width: 100%" />
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
        enterpriseId: [{ required: true, message: '请选择企业' }]
      },
      url: {
        add: '/baseScyInfo/baseScyInfo/add',
        edit: '/baseScyInfo/baseScyInfo/edit'
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

