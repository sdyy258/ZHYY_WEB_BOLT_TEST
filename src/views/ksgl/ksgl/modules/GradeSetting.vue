<template>
  <a-modal
    centered
    title="成绩设置"
    :visible="visible"
    :mask-closable="false"
    width="500px"
    :destroy-on-close="true"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <div class="modal-content">
      <a-form :form="form" layout="inline" class="search-form">
        <a-form-item label="成绩设置">
          <j-dict-select-tag v-decorator="['scoreSet',validatorRules.scoreSet]" trigger-change dict-code="scoreSet" :show-null-select="false" :allow-clear="true" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('scoreSet')==2" label="成绩公布时间">
          <a-date-picker
            v-model="model.scoreShowTime"
            show-time
            :disabled-date="disScoreDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择时间"
            @change="onChange"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'
export default {
  data() {
    return {
      moment,
      confirmLoading: false,
      title: '',
      visible: false,
      model: {},
      modelIds: [],
      form: this.$form.createForm(this),
      validatorRules: {
        scoreSet: { rules: [{ required: true, message: '请选择审核状态' }] },
        scoreShowTime: { rules: [{ required: true, message: '请选择时间' }] }
      }
    }
  },
  methods: {
    handleOk() {
      if (this.form.getFieldValue('scoreSet') == 2 && this.model.scoreShowTime == '') {
        this.$message.warning('请选择成绩公布时间')
        return
      }
      let ids
      if (this.model.id) {
        ids = this.model.id
      } else {
        ids = this.modelIds.map(item => item).join(',')
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = ids
          values.scoreShowTime = this.model.scoreShowTime
          postAction('/tExam/tExam/scoreSet', values).then(res => {
            if (res.success) {
              this.visible = false
              this.$message.success(res.message || '成功')
              this.$emit('ok',)
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    showModal(data) {
      console.log(11111, data)
      this.form.resetFields()
      this.visible = true
      this.modelIds = []
      this.model = Object.assign({}, data)
      this.$nextTick(() => {
        this.form.setFieldsValue(this.pick(data, Object.keys(this.form.getFieldsValue())))
        // this.form.setFieldsValue({
        //   // 根据父级id、子级id给categoryIdId赋值
        //   scoreShowTime: data.scoreShowTime
        // })
        this.$forceUpdate()
      })
    },
    show(data) {
      if (data.length === 0) {
        this.$message.warning('请至少选择一条记录')
        return
      }
      this.form.resetFields()
      this.model = {}
      this.visible = true
      this.modelIds = data
      this.$nextTick(() => {
        this.form.setFieldsValue({
          scoreSet: 1
        })
        this.$forceUpdate()
      })
    },
    // 成绩时间小于考试结束时间
    disScoreDate(current) {
      if (this.model.limitEndTime) {
        return current < moment(this.model.limitEndTime).subtract(1, 'minutes')
      } else {
        return current < moment().startOf('day')
      }
    },
    // 成绩时间取值
    onChange(e) {
      this.model.scoreShowTime = e
      // this.$nextTick(() => {
      //   this.form.setFieldsValue({
      //     // 根据父级id、子级id给categoryIdId赋值
      //     scoreShowTime: e
      //   })
      //   this.$forceUpdate()
      // })
      const min = moment().format('YYYY-MM-DD HH:mm:ss')
      const date = this.model.limitEndTime || min
      if (e < date) {
        this.$nextTick(() => {
          this.$set(this.model, 'scoreShowTime', date)
          this.$forceUpdate()
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
///deep/ .ant-modal-body {
//  padding: 0;
//}
//.modal-content {
//  height: 600px;
//  width: 100%;
//  border-radius: 4px;
//  box-shadow: unset;
//
//}
</style>
