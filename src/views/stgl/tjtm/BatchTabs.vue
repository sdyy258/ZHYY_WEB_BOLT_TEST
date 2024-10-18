<template>
  <div class="card-class">
    <div class="card-tabs">
      <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
        <a-radio-button value="left">
          Excel批量导入试题
        </a-radio-button>
        <!-- <a-radio-button value="right">
          Word批量导入试题
        </a-radio-button> -->
      </a-radio-group>
      <div v-if="mode =='left'">
        <execl-import ref="execlImport" />
      </div>
      <div v-if="mode =='right'">
        <word-import ref="wordImport" />
      </div>

    </div>
  </div>
</template>
<script>
import ExeclImport from './compents/ExeclImport'
import WordImport from './compents/WordImport'
import { getAction } from '@/api/manage'
export default {
  components: { ExeclImport, WordImport },
  props:{
    controlType:{
      type: Number,
      required: false
    },
  },
  data() {
    return {
      mode: 'left'
    }
  },
  created() {
    // this.getQuestion()
    var str = /^\\d+$/ // 非负整数
  },
  methods: {
    handleOk(){
      this.$emit('handleOk')
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.card-class{
  height: auto;
  padding: 10px;
  background: #ffffff;
  overflow-y: auto;
  .card-tabs{
    text-align: center;
    margin-top: 30px;
    .tabs{
      width: 800px;
      margin: auto;
      padding-top: 80px;
      padding-bottom: 65px;
    }
  }
}
/deep/.ant-radio-button-wrapper-checked:first-child{
  border-radius: 4px;
}
</style>
