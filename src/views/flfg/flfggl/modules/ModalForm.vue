<template>
  <j-modal
    centered
    switch-fullscreen
    :title="title"
    :width="1400"
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
          <a-form-item label="法律法规名称">
            <a-input v-decorator="['lawName',validatorRules.lawName]" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="索引号">
            <a-input v-decorator="['indexNumber']" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="分类">
            <a-tree-select v-decorator="['categoryId',validatorRules.categoryId]" :tree-data="treeData" show-search allow-clear placeholder="请选择分类" tree-node-filter-prop="title" />
          </a-form-item>
          <a-form-item label="文号">
            <a-input v-decorator="['documentNumber']" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="主题词">
            <a-input v-decorator="['keyword']" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="文件">
            <j-upload v-decorator="['filePath']" :multiple="false" :number="1" />
          </a-form-item>
          <a-form-item label="内容" style="width: 100%">
            <j-editor v-decorator="['content']" :trigger-change="true" :toolbar="toolbar" @change="$forceUpdate()" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import { getAction } from '@/api/manage'
export default {
  components: {
    JEditor
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        lawName: { rules: [{ required: true, message: '请输入法律法规名称' }] },
        categoryId: { rules: [{ required: true, message: '请选择分类' }] }
      },
      treeData: [],
      toolbar: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent  | removeformat | fullscreen',
      url: {
        add: '/baseLawRegulation/baseLawRegulation/add',
        edit: '/baseLawRegulation/baseLawRegulation/edit',
        queryById: '/baseLawRegulation/baseLawRegulation/queryById'
      },
      readOnly: false
    }
  },
  created() {

  },
  methods: {
    getTreeList() {
      // 获取分类树
      getAction('/sys/category/rootListNew', { type: 11 }).then(res => {
        if (res.success) {
          this.treeData = [...res.result]
        }
      })
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.getTreeList()
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

