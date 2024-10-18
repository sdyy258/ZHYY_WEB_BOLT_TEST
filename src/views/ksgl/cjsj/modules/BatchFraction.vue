<template>
  <a-modal
    centered
    title="批量设置分数"
    :class="$store.state.app.layout"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="关闭"
    :destroy-on-close="true"
    width="900px"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <div v-for="(i, index) in tableNumber" :key="index" class="center">
      <div class="left">
        <span>{{ i.name || '暂无大题名称' }}</span>
      </div>
      <div class="right">
        共
        <span style="color:#58a8e2">{{ i.smallQuestionCount }}</span
        >题
      </div>
      <div class="right">
        <span>每题</span>
        <a-input-number v-model="i.score" placeholder="最少0.5分" style="margin: 0 5px;" :min="0.5" :precision="1" />
        <span>分</span>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { indexOf } from 'lodash'
import BatchTabs from '../../../stgl/tjtm/BatchTabs'
export default {
  components: { BatchTabs },
  data() {
    return {
      visible: false,
      number: 0,
      fraction: '',
      tableNumber: [
        {
          score: '',
          name: '',
          smallQuestionCount: ''
        }
      ]
    }
  },
  methods: {
    // change(e, val) {
    //   debugger
    //   var str = /^[1-9][0-9]*([\.][0-9]{1,2})?$/
    //   if (!str.test(e)) {
    //     this.$set(val, 'score', 1)
    //     return
    //   }
    //   this.$forceUpdate()
    // },
    showModal(tableNumber) {
      this.tableNumber = []
      this.visible = true
      this.tableNumber = tableNumber.map(item => {
        const obj = {
          score: '',
          name: item.name,
          smallQuestionCount: item.smallQuestionCount
        }
        return obj
      })
    },
    handleOk() {
      this.visible = false
      this.$emit('ok', this.tableNumber)
    }
  }
}
</script>
<style lang="less" scoped>
.center {
  display: flex;
  font-size: 18px;
  color: black;
  margin-bottom: 30px;
  .left {
    width: 40%;
    text-align: center;
  }
  .right {
    width: 30%;
    text-align: center;
    display: flex;
  }
}
/deep/ .ant-input {
  width: 30%;
}
</style>
