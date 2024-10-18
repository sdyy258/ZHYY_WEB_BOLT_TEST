<template>
  <div>
    <div v-for="(i, index) in dataList" :key="index" class="option-class">
      <div class="coreKeywords">
        <div class="key-title">
          <span>{{ index + 1 }}</span>
        </div>
        <div v-if="editorShow == '4' + index" class="key-answer">
          <div>
            <j-editor v-model="i.item" :height="100" />
          </div>
        </div>
        <div v-else class="input-border-class" @click="checkChange(index)">
          <span v-if="i.item" style="color: black;" v-html="i.item" />
          <span v-else>点此编辑；</span>
        </div>
      </div>
      <div class="key-icon">
        <a-icon type="rest" class="right-icon" @click="deleteClick(i, index)" />
      </div>
      <div v-if="answerMess == 2" class="key-icon">
        <a-input-number v-model="i.groupNum" :min="0" precision="0" />
        <span>组</span>
      </div>
    </div>
    <div v-if="dataList.length < 6" class="append-radio" @click="appendcheckClick()">＋ 添加一个空</div>
    <div class="append-radio" style="margin-top: 15px;">
      <a-radio-group v-model="answerMess" @change="groupChange($event, radioIndex)">
        <a-radio :value="0">答案顺序固定</a-radio>
        <a-radio :value="1">允许学员答案与参考答案顺序不一致</a-radio>
        <a-radio :value="2">答案顺序部分不固定</a-radio>
      </a-radio-group>
      <!-- <a-checkbox v-model="answerMess" style="font-size: 16px;" @change="change">允许学员答案与参考答案顺序不一致</a-checkbox> -->
    </div>
    <a-divider dashed style="margin: 0; margin-top: 20px;" />
  </div>
</template>
<script>
import { baseURL } from '@/utils/request.js'
import { getFileAccessHttpUrl } from '@/api/manage'
var numberList = []
export default {
  props: {
    radioForm: {
      type: Array,
      default: () => []
    },
    answerMess: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorShow: '',
      dataList: [{ item: '', isRight: 0, keyItem: '', sort: 0, groupNum: '1' }],
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
    if (!this.answerMess) {
      this.answerMess = 0
    }
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
            sort: index,
            groupNum: item.groupNum
          }
          return obj
        })
      }
    },
    checkChange(val) {
      this.editorShow = '4' + val
    },
    // 编辑时重置内容
    reset(val) {
      this.radioForm = [...val]
      this.dataList = [...this.radioForm]
    },
    // 新增时重置内容
    showModal() {
      this.dataList = [{ item: '', isRight: 0, keyItem: '', sort: 0, groupNum: '1' }]
    },
    // 循环得出数字
    getNumberList() {
      for (let i = 1; i < 26; i++) {
        numberList.push(i)
      }
    },
    htmlToString(htmlStr) {
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 添加一个空
    appendcheckClick() {
      this.dataList.push({
        sort: this.dataList.length,
        item: '',
        isRight: 0,
        keyItem: '',
        groupNum: '1'
      })
    },
    // 删除一个空
    deleteClick(val, index) {
      this.dataList.splice(index, 1)
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].value = numberList[i]
      }
    },
    // 多选框
    groupChange(e) {
      this.$emit('ansCall', e.target.value)
    }
    // change(e) {
    //   this.answerMess = e.target.checked
    //   if (e.target.checked == false) {
    //     this.answerMess = 0
    //   } else {
    //     this.answerMess = 1
    //   }
    //   this.$emit('ansCall', this.answerMess)
    // }
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
