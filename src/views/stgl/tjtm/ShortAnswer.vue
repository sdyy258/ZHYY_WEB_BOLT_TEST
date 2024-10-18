<template>
  <div>
    <div v-for="(i, index) in dataList" :key="index" class="option-class">
      <div class="coreKeywords">
        <div class="key-title">
          <span>{{ index + 1 }}</span>
        </div>
        <div v-if="editorShow == '5' + index" class="key-answer">
          <div>
            <j-editor v-model="i.item" :height="100" />
          </div>
        </div>
        <div v-else class="input-border-class" @click="checkChange(index)">
          <span v-if="i.item" style="color: black;" v-html="i.item" />
          <span v-else>点此编辑；</span>
        </div>
      </div>
    </div>
    <a-divider dashed style="margin: 0; margin-top: 20px;" />
  </div>
</template>
<script>
var numberList = []
export default {
  props: {
    radioForm: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editorShow: '',
      dataList: [{ item: '', isRight: 0, keyItem: '', sort: 0 }],
    }
  },
  watch: {
    dataList: {
      handler(val) {
        this.$emit('ok', val)
      },
      deep: true
    },
    radioForm() {
      this.init()
    }
  },
  created() {
    console.log(this.radioForm)
    this.getNumberList()
    this.init()
  },
  methods: {
    init() {
      if (this.radioForm.length > 0) {
        this.dataList = this.radioForm
        this.dataList = this.dataList.map((item, index) => {
          const obj = {
            item: item.item,
            isRight: 0,
            keyItem: '',
            sort: index
            // groupNum: item.groupNum
          }
          return obj
        })
      }
    },
    checkChange(val) {
      this.editorShow = '5' + val
    },
    // 编辑时重置内容
    reset(val) {
      this.radioForm = [...val]
      this.dataList = [...this.radioForm]
    },
    // 新增时重置内容
    showModal() {
      this.dataList = [{ item: '', isRight: 0, keyItem: '', sort: 0 }]
    },
    // 循环得出数字
    getNumberList() {
      for (let i = 1; i < 26; i++) {
        numberList.push(i)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.option-class {
  flex: 24;
  height: auto;
  display: flex;
}

.input-border-class {
  width: 90%;
  // height: 40px;
  // line-height: 40px;
  padding-left: 20px;
  overflow-y: overlay;
  word-wrap: break-word;
  padding-top: 10px;
}

// .input-border-class:hover {
//   border: 1px solid #2f54eb;
// }
.key-icon {
  z-index: 99;
  align-items: center;
  display: flex;
  margin-left: 10px;
}
.option-card {
  display: flex;
  margin-bottom: 30px;
  padding-top: 9px;
}
.append-radio {
  font-size: 16px;
  color: #2f54eb;
  cursor: pointer;
  text-align: left;
}
.coreKeywords {
  display: flex;
  position: relative;
  margin-bottom: 4px;
  width: 1300px;
}
.key-title {
  width: 7%;
  min-height: 36px;
  background: #f1f3f8;
  border: 1px solid #dcdfe6;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-self: stretch;
  font-size: 14px;
}
.key-answer {
  flex: 1;
  position: relative;
  padding: 0 108px 0 0;
  border: 1px solid transparent;
  font-size: 16px;
  padding: 10px;
  width: 93%;
  text-align: left;
}
.coreKeywords:hover {
  border: 1px solid #1a8cfe;
  .key-title {
    border: 1px solid #1a8cfe;
  }
}

/deep/ .ant-input {
  border: 0;
  max-width: 100%;
  font-size: 16px;
  padding: 5px;
  height: 100%;
  min-width: 0;
}
/dedp/.ant-radio {
  padding: 9px;
}
</style>
