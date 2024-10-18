<template>
  <a-modal
    :title="title"
    :width="820"
    :visible="visible"
    :mask-closable="false"
    :footer="false"
    :keyboard="false"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <div style="padding: 20px;">
      <div style="width: 100%;text-align: center;">
        <img src="./ksjs.png" alt="">
        <div style="margin-bottom: 10px;">
          <span style="font-size: 26px;font-weight: bold;">考试结束</span>
        </div>
        <div style="margin-bottom: 20px;">
          <span style="font-size: 18px;">您的正确率为</span>
          <span style="font-size: 24px;">{{ model.accuracy }}%</span>
        </div>
      </div>
      <div style="width:100%;display: flex;background-color: #F6F6F6;border-radius: 10px;">
        <div class="centerDiv">
          <div><span class="text">{{ model.rightNum }}</span></div>
          <div><span>正确（道）</span></div>
        </div>
        <div class="centerDiv">
          <div><span class="text">{{ model.errorNum }}</span></div>
          <div><span>错误（道）</span></div>
        </div>
        <div class="centerDiv">
          <div><span class="text">{{ model.score }}</span></div>
          <div><span>得分</span></div>
        </div>
        <div class="centerDiv">
          <div><span class="text">{{ model.tookTime }}</span></div>
          <div><span>总用时（分）</span></div>
        </div>
        <div class="centerDiv">
          <div><span class="text">{{ model.result }}</span></div>
          <div><span>考试结果</span></div>
        </div>
      </div>
      <div style="width: 100%;text-align: center;margin-top: 30px;">
        <a-button type="primary" style="width:40%;font-size: 16px;height: 40px;" @click="handleOk">确认</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>

export default {
  data() {
    return {
      title: '考试结果',
      visible: false,
      model: {}
    }
  },
  methods: {
    showModal(record) {
      this.visible = true
      const accuracy = parseFloat((record.rightNum / (record.rightNum + record.errorNum) * 100).toFixed(2))
      this.model = { ...record, accuracy: accuracy }
    },
    handleOk() {
      this.$router.push({
        path: '/zxks/zxks'
      })
    }

  }
}
</script>
<style scoped lang='less'>
/deep/ .ant-modal-header {
  display: none;
}

/deep/
.ant-modal-close {
  display: none;
}

.centerDiv {
  width: 20%;
  padding: 30px;
  text-align: center;

  .text {
    font-size: 26px;
    font-weight: bold;
  }
}

.centerDiv:not(:first-child) {
  border-left: 1px solid #EAEAEA;
}
</style>

