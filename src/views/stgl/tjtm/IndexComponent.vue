<template>
  <div>
    <a-tabs v-model="activeKey" type="card">
      <a-tab-pane v-if="disabledShow" key="2" tab="批量录入">
        <batch-tabs :controlType="controlType" @close="$emit('close')"  @handleOk="$emit('handleOk')"/>
      </a-tab-pane>
      <a-tab-pane key="1" :tab="tabs">
        <stand-alone   :controlType="controlType" :dataList="dataList" :type="type" @close="$emit('close')"  @handleOk="$emit('handleOk')"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import StandAlone from './StandAlone'
import BatchTabs from './BatchTabs'
export default {
  components: {
    StandAlone,
    BatchTabs
  },
  props:{
    controlType:{
      type: Number,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    dataList: {
      type: Array,
      required: false
    },
  },
  data() {
    return {
      activeKey: '2',
      disabledShow: true,
      tabs: '单题录入'
    }
  },
  created() {
    const that = this
    const middleData = this.controlType==1?this.dataList:this.$route.params.data
    if (middleData.id) {
      this.activeKey = '1'
      this.tabs = '编辑录入'
      this.disabledShow = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-tabs-bar {
  margin: 0;
}
</style>
