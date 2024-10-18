<template>
  <a-modal
    centered
    :title="title"
    :width="800"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @cancel="cancel"
  >
    <span slot="footer">
      <a-button v-if="disabled == false" @click="cancel">取消</a-button>
      <a-button v-if="disabled == false" type="primary" @click="handleOk">确定</a-button>
    </span>
    <!-- <span v-else slot="footer" /> -->
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="one-col-form-longLabel">
        <a-form-item label="题型">
          <a-input v-decorator="['questionType_dictText']" disabled placeholder="请输入题型" />
        </a-form-item>
        <a-form-item label="试题内容">
          <span class="col-sql" v-html="model.questionName" />
        </a-form-item>
        <a-form-item label="处理内容">
          <a-textarea
            v-decorator="['handleContent',validatorRules.handleContent]"
            placeholder="请输入处理内容"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :disabled="disabled"
          />
        </a-form-item>
        <!-- <a-form-item label="处理状态">
          <a-input v-decorator="['handleStatus',validatorRules.handleStatus]" placeholder="请输入处理状态" />
        </a-form-item> -->
        <!-- <a-form-item label="是否已处理">
          <a-radio-group v-decorator="['isHandle',validatorRules.isHandle]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item> -->
        <!-- <a-form-item label="处理人">
          <a-input v-decorator="['userId',validatorRules.userId]" placeholder="请输入处理人" />
        </a-form-item> -->
        <!-- <a-form-item label="处理时间">
          <a-input v-decorator="['feedbackTime',validatorRules.feedbackTime]" placeholder="请输入处理状态" />
        </a-form-item> -->
        <!-- <a-form-item label="未处理反馈数">
          <a-input v-decorator="['unHandleNum',validatorRules.unHandleNum]" placeholder="请输入未处理反馈数" />
        </a-form-item> -->
        <!-- <a-form-item label="历史反馈数">
          <a-input v-decorator="['allFeedBackNum',validatorRules.allFeedBackNum]" placeholder="请输入历史反馈数" />
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { postAction } from '@/api/manage'
export default {
  data() {
    return {
      title: '操作',
      visible: false,
      disabled: false,
      model: {},
      confirmLoading: false,
      fileList: '',
      form: this.$form.createForm(this),
      validatorRules: {
        questionType_dictText: { rules: [{ required: true, message: '请输入题型' }] },
        isHandle: { rules: [{ required: true, message: '处理状态' }] },
        handleContent: { rules: [{ required: true, message: '请输入处理内容' }] }
      },
      url: {
        add: '',
        edit: '',
        queryById: ''
      },
      readOnly: false
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record, show) {
      if (show == true) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.visible = true
      this.form.resetFields()
      if (record) {
        this.$nextTick(() => {
          this.form.setFieldsValue(this.pick(record, Object.keys(this.form.getFieldsValue())))
        })
        this.model = { ...record }
      } else {
        this.form = this.$form.createForm(this)
      }
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign(this.model, values)
          const params = {}
          // formData.unHandle = [{ handleContent: formData.handleContent }]
          // formData.unHandle[0].handleContent = formData.handleContent
          const arr = []
          for (const i in formData.unHandle) {
            const obj = {
              id: formData.unHandle[i].id,
              handleContent: formData.handleContent
            }
            arr.push(obj)
          }
          params.unHandle = [...arr]
          let url = ''
          if (this.model.id) {
            url = '/tQuestionFeedback/tQuestionFeedback/edit'
            // params.id = this.model.id
          } else {
            url = '/tQuestionFeedback/tQuestionFeedback/add'
          }
          postAction(url, params).then(res => {
            if (res.success) {
              this.$emit('ok', '')
              this.visible = false
              this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    cancel() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.col-sql{
    max-height: 100px;
    overflow: scroll;
    border: 1px solid #e9e9e9;
    display: flex;
    padding: 5px 10px;
    border-radius: 5px;
    line-height: 1.5;
    color: #b6b6b6;
    background: whitesmoke;
}
/deep/ .col-sql>p>img{
  width: 20%;
}
/deep/.one-col-form-longLabel.ant-form .ant-form-item .ant-form-item-label {
	width: 100px;
}
</style>
