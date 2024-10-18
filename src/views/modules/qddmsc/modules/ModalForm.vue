<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="one-col-form">
        <a-form-item label="一级菜单名称">
          <a-input v-decorator="['sysOrgCode',validatorRules.sysOrgCode]" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="二级菜单名称">
          <a-input v-decorator="['keyWord',validatorRules.keyWord]" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="上传人">
          <a-select v-decorator="['name',validatorRules.name]" placeholder="请选择上传人">
            <a-select-option value="王帅">王帅</a-select-option>
            <a-select-option value="张学强">张学强</a-select-option>
            <a-select-option value="徐静静">徐静静</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="vue代码">
          <j-upload v-decorator="['content',validatorRules.content]" :multiple="false" :number="1" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-decorator="['email']" placeholder="请输入" />
        </a-form-item>
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
        sysOrgCode: { rules: [{ required: true, message: '请输入一级菜单名称' }] },
        keyWord: { rules: [{ required: true, message: '请输入二级菜单名称' }] },
        name: { rules: [{ required: true, message: '请选择上传人' }] },
        content: { rules: [{ required: true, message: '请上传代码' }] }
      },
      url: {
        add: '/test/jeecgDemo/add',
        edit: '/test/jeecgDemo/edit',
        queryById: '/test/jeecgDemo/queryById'
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

