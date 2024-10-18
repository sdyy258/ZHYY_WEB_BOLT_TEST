<template>
  <a-modal
    :title="title"
    :width="800"
    :ok="false"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :ok-button-props="{ props: {disabled: disableSubmit} }"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="机构名称"
          prop="departName"
          :hidden="false"
          has-feedback
        >
          <a-input id="departName" v-model="model.departName" placeholder="请输入机构/部门名称" />
        </a-form-model-item>
        <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :hidden="seen" label="上级部门" has-feedback>
          <a-tree-select
            v-model="model.parentId"
            style="width:100%"
            :dropdown-style="{maxHeight:'200px',overflow:'auto'}"
            :tree-data="departTree"
            placeholder="请选择上级部门"
            :disabled="condition"
          />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="机构类型"
        >
          <template v-if="seen">
            <a-radio-group v-model="model.orgCategory" placeholder="请选择机构类型">
              <a-radio value="1">
                公司
              </a-radio>
            </a-radio-group>
          </template>
          <template v-else>
            <a-radio-group v-model="model.orgCategory" placeholder="请选择机构类型">
              <a-radio value="2">
                部门
              </a-radio>
              <a-radio value="3">
                岗位
              </a-radio>
            </a-radio-group>
          </template>
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="mobile"
          label="电话"
        >
          <a-input v-model="model.mobile" placeholder="请输入电话" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="传真"
        >
          <a-input v-model="model.fax" placeholder="请输入传真" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="地址"
        >
          <a-input v-model="model.address" placeholder="请输入地址" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="排序"
        >
          <a-input-number v-model="model.departOrder" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="备注"
        >
          <a-textarea v-model="model.memo" placeholder="请输入备注" />
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { queryIdTree } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'SysDepartModal',
  components: { ATextarea },
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      seen: false,
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      defaultModel: {
        departOrder: 0,
        orgCategory: '1'
      },
      menuhidden: false,
      menuusing: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      validatorRules: {
        departName: [{ required: true, message: '请输入机构/部门名称!' }],
        orgCode: [{ required: true, message: '请输入机构编码!' }],
        mobile: [{ validator: this.validateMobile }],
        orgCategory: [{ required: true, message: '请输入机构类型!' }]
      },
      url: {
        add: '/sys/sysDepart/add'
      },
      dictDisabled: true
    }
  },
  created() {
  },
  methods: {
    loadTreeData() {
      var that = this
      queryIdTree().then((res) => {
        if (res.success) {
          that.departTree = []
          for (let i = 0; i < res.result.length; i++) {
            const temp = res.result[i]
            that.departTree.push(temp)
          }
        }
      })
    },
    add(depart) {
      if (depart) {
        this.seen = false
        this.dictDisabled = false
      } else {
        this.seen = true
        this.dictDisabled = true
      }
      this.edit(depart)
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, this.defaultModel, record)
      this.loadTreeData()
      this.model.parentId = record != null ? record.toString() : null
      if (this.seen) {
        this.model.orgCategory = '1'
        // this.model.orgLevel = '2'
      } else {
        this.model.orgCategory = '2'
        this.model.orgLevel = '3'
      }
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          httpAction(this.url.add, this.model, 'post').then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadTreeData()
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    }
  }
}
</script>

<style scoped>

</style>
