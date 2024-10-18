<template>
  <a-card :visible="visible">
    <a-form-model ref="form" :model="model">
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="机构名称"
      >
        <a-input v-model="model.departName" style="border:0;" placeholder="" />
      </a-form-model-item>
      <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="上级部门">
        <a-tree-select
          v-model="model.parentId"
          disabled
          style="width:100%;border: 0;border: none;outline:none;"
          :dropdown-style="{maxHeight:'200px',overflow:'auto'}"
          :tree-data="treeData"
          placeholder="无"
        />
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="机构编码"
      >
        <a-input v-model="model.orgCode" style="border:0;" placeholder="" />
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="机构类型"
      >
        <a-radio-group v-model="model.orgCategory" :disabled="true" read-only>
          <a-radio value="1">
            公司
          </a-radio>
          <a-radio value="2">
            部门
          </a-radio>
          <a-radio value="3">
            岗位
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="排序"
      >
        <a-input-number v-model="model.departOrder" style="border:0;" />
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="手机号"
      >
        <a-input v-model="model.mobile" style="border:0;" placeholder="" />
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="地址"
      >
        <a-input v-model="model.address" style="border:0;" placeholder="" />
      </a-form-model-item>
      <a-form-model-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="备注"
      >
        <a-textarea v-model="model.memo" style="border:0;" placeholder="" />
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>
<script>
import { queryIdTree } from '@/api/api'

export default {
  name: 'DeptBaseInfo',
  components: {},
  data() {
    return {
      departTree: [],
      id: '',
      model: {},
      visible: false,
      disable: true,
      treeData: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      queryIdTree().then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            const temp = res.result[i]
            this.treeData.push(temp)
          }
        }
      })
    },
    open(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.model = Object.assign({}, record)
      })
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.treeData = []
    }
  }
}
</script>
<style scoped lang="less">
  @import '~@assets/less/common.less';

  /deep/ .ant-radio-disabled + span {
    color: #999;
  }
</style>
