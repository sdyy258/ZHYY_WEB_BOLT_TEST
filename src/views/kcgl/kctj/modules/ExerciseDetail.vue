<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <template slot="footer">
      <a-spin :spinning="confirmLoading">
        <a-button type="primary" @click="handleOk()">下一步</a-button>
      </a-spin>
    </template>
    <a-spin :spinning="confirmLoading">
      <div class="trigger-set">
        <span>练习触发时间</span>
        <a-time-picker v-model="model.prop1" value-format="HH:mm:ss" />
      </div>
      <div class="finish-set">
        <span>学员必须</span>
        <a-input v-model="model.prop2" style="width:150px" class="inputClass" />
        <span>分钟内完成练习，完成以后</span>
        <a-select default-value="1" style="width: 120px" class="inputClass">
          <a-select-option value="1">
            可以
          </a-select-option>
          <a-select-option value="2">
            不可以
          </a-select-option>
        </a-select>
        <span>查看答案解析</span>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      loading: false,
      title: '练习触发时间设置',
      visible: false,
      confirmLoading: false,
      readOnly: false,
      model: {
        prop2: 10
      },
      index: ''
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(index) {
      this.index = index
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$emit('ok', true, this.index)
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
  <style scoped lang="less">
    .trigger-set{
        margin-top: 25px;
        span{
            margin-right: 10px;
        }
    }
    .finish-set{
        margin-top: 15px;
        .inputClass{
            margin: 0 10px;
        }
    }
  </style>

