<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <!-- <a-form-model-item label="类型" :label-col="labelCol" :wrapper-col="wrapperCol" prop="type">
				<JDictSelectTag v-model="model.type" placeholder="请输入类型" dict-code="categoryType" :disabled="disabled" @change="changeType" />
			</a-form-model-item> -->
        <a-form-model-item label="父级节点" :label-col="labelCol" :wrapper-col="wrapperCol" prop="pid">
          <j-tree-select
            ref="treeSelect"
            v-model="model.pid"
            placeholder="请选择父级节点"
            dict="sys_category,name,id"
            pid-field="pid"
            pid-value="0"
            :disabled="true"
            :condition="condition"
          />
        </a-form-model-item>
        <a-form-model-item label="分类名称" :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
          <a-input v-model="model.name" placeholder="请输入分类名称" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>

import { httpAction, getAction } from '@/api/manage'
import JTreeSelect from '@/components/jeecg/JTreeSelect'

export default {
  name: 'SysCategoryModal',
  components: {
    JTreeSelect
  },
  data() {
    return {
      title: '操作',
      width: 800,
      visible: false,
      model: {},
      // condition: '',
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
        pid: {},
        name: [{ required: true, message: '请输入类型名称!' }]
      },
      url: {
        add: '/sys/category/add',
        edit: '/sys/category/edit',
        checkCode: '/sys/category/checkCode'
      },
      expandedRowKeys: [],
      pidField: 'pid',
      subExpandedKeys: [],
      type: ''

    }
  },
  computed: {
    disabled() {
      return !!this.model.id
    },
    condition() {
      if (this.model.type) {
        return `{"type":"${this.model.type}"}`
      } else {
        return ''
      }
    }
  },
  created() {
  },
  methods: {
    add(type) {
      this.type = type
      this.edit({})
    },
    edit(record) {
      this.visible = true
      this.model = Object.assign({}, record)
      if (!this.model.type) {
        this.model.type = this.type
      }
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.resetFields()
    },
    changeType(val) {
      // if (val) {
      //   this.condition = `{"type":"${val}"}`
      // } else {
      //   this.condition = ''
      // }
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              // close的时候清空了表单的值 导致model为空 修改值在列表页没有变 此处需要复制一下model
              that.submitSuccess({ ...this.model })
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
    submitSuccess(formData) {
      if (!formData.id) {
        const treeData = this.$refs.treeSelect.getCurrTreeData()
        this.expandedRowKeys = []
        this.getExpandKeysByPid(formData[this.pidField], treeData, treeData)
        if (formData.pid && this.expandedRowKeys.length == 0) {
          this.expandedRowKeys = this.subExpandedKeys
        }
        this.$emit('ok', formData, this.expandedRowKeys.reverse())
      } else {
        this.$emit('ok', formData)
      }
    },
    getExpandKeysByPid(pid, arr, all) {
      if (pid && arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].key == pid) {
            this.expandedRowKeys.push(arr[i].key)
            this.getExpandKeysByPid(arr[i]['parentId'], all, all)
          } else {
            this.getExpandKeysByPid(pid, arr[i].children, all)
          }
        }
      }
    }

  }
}
</script>

