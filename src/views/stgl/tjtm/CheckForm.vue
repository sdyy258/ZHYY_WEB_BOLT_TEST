<template>
  <div class="option-class">
    <a-checkbox-group
      v-for="(i,index) in checkOption"
      :key="index"
      :value="checked"
      style="display:flex;"
      @change="groupChange($event,index)"
    >
      <a-checkbox
        :value="i.label"
        :class="editorShow =='2'+ index?'trends-height2':'trends-height1'"
        style="margin: 10px;"
      />
      <div style="display: flex;flex: 24;flex-shrink: 0;width: 90%;">
        <div style="font-size: 18px;margin-right: 10px;line-height: 40px;">{{ i.label }}</div>
        <j-editor v-if="editorShow =='2'+ index" v-model="i.item" :height="100" />
        <div v-else class="input-border-class" @click="checkChange(index)">
          <span v-if="i.item" style="color: black;" v-html="i.item" />
          <span v-else>选项，点此编辑；选中既设置为正确答案(必填)</span>
        </div>
        <div class="wrap-icon">
          <a-icon type="rest" class="right-icon" @click="deletecheckClick(i,index)" />
          <a-icon type="arrow-up" class="right-icon" @click="upData(i,index)" />
          <a-icon type="arrow-down" class="right-icon" @click="downData(i,index)" />
        </div>
        <div style="clear:both;" />
      </div>
      <div style="clear:both;" />
    </a-checkbox-group>
    <div v-if="checkOption.length < 6" class="append-radio" @click="appendcheckClick()">＋ 添加选项</div>
    <a-divider dashed style="margin: 0; margin-top: 20px;" />
  </div>
</template>
<script>
import { letter } from './compents/dataType'
import { baseURL } from '@/utils/request.js'
import { getFileAccessHttpUrl } from '@/api/manage'
var characterList = []
export default {
  props: {
    radioForm: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: [],
      letter: letter,
      editorShow: '',
      checkOption: [
        { label: 'A', isRight: '', item: '', keyItem: '', sort: 0 },
        { label: 'B', isRight: '', item: '', keyItem: '', sort: 1 },
        { label: 'C', isRight: '', item: '', keyItem: '', sort: 2 },
        { label: 'D', isRight: '', item: '', keyItem: '', sort: 3 }
      ],
    }
  },
  watch: {
    checkOption: {
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
    this.character()
    this.init()
    this.$forceUpdate()
    console.log(this.checked)
    console.log(this.checkOption)
  },
  methods: {
    init() {
      if (this.radioForm.length > 0) {
        this.checkOption = this.radioForm.map((item, index) => {
          if (item.isRight == '1') {
            this.checked.push(characterList[index])
          }
          const obj = {
            label: characterList[index],
            isRight: item.isRight,
            item: item.item,
            keyItem: item.keyItem,
            sort: index
          }
          return obj
        })
      }
    },
    // 编辑时重置内容
    reset(val) {
      this.character()
      this.radioForm = [...val]
      this.checked = []
      this.checkOption = this.radioForm.map((item, index) => {
        if (item.isRight == '1') {
          this.checked.push(characterList[index])
        }
        const obj = {
          label: characterList[index],
          isRight: item.isRight,
          item: item.item,
          keyItem: item.keyItem,
          sort: index
        }
        return obj
      })
    },
    showModal() {
      this.checked = []
      this.checkOption = [
        { label: 'A', isRight: '', item: '', keyItem: '', sort: 0 },
        { label: 'B', isRight: '', item: '', keyItem: '', sort: 1 },
        { label: 'C', isRight: '', item: '', keyItem: '', sort: 2 },
        { label: 'D', isRight: '', item: '', keyItem: '', sort: 3 }
      ]
    },
    // 输出A-Z 26个大写字母
    character() {
      for (var i = 0; i < 26; i++) {
        console.log(String.fromCharCode(65 + i)) //
        characterList.push(String.fromCharCode(65 + i))
      }
    },
    htmlToString(htmlStr) {
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 富文本显示
    checkChange(index) {
      this.editorShow = '2' + index
      console.log('editorShow', this.editorShow)
    },
    groupChange(e, index) {
      if (e.length > 0) {
        this.checked.push(characterList[index])
        this.checkOption[index].isRight = 1
      } else {
        this.checkOption[index].isRight = 0
        this.checked = this.checked.filter(item => item != characterList[index])
      }
    },
    appendcheckClick() {
      var item = { label: '', isRight: '', item: '', keyItem: '', sort: '' }
      item.label = characterList[this.checkOption.length]
      item.sort = this.checkOption.length
      this.checkOption.push(item)
    },
    deletecheckClick(item, index) {
      // var item = [{ label: 'A', isRight: '', item: '', keyItem: '', sort: '' }]
      this.checkOption.splice(index, 1)
      this.checked = []
      for (let i = 0; i < this.checkOption.length; i++) {
        this.checkOption[i].label = characterList[i]
        this.checkOption[i].sort = i
        if (this.checkOption[i].isRight == '1') {
          this.checked.push(characterList[i])
        }
      }
    },
    // 位置上移
    upData(item, index) {
      let arr = []
      if (index > 0) {
        this.checked = []
        arr = this.checkOption[index - 1]
        this.checkOption[index - 1] = this.checkOption[index]
        this.checkOption[index] = arr
        const obj = []
        for (let i = 0; i < this.checkOption.length; i++) {
          this.checkOption[i].label = characterList[i]
          this.checkOption[i].sort = i
          if (this.checkOption[i].isRight == '1') {
            this.checked.push(characterList[i])
            // this.checked = [...obj]
          }
        }
      }
      this.$forceUpdate()
    },
    // 位置下移
    downData(item, index) {
      let arr = []
      if (index < this.checkOption.length - 1) {
        arr = this.checkOption[index + 1]
        this.checkOption[index + 1] = this.checkOption[index]
        this.checkOption[index] = arr
        this.checked = []
        const obj = []
        for (let i = 0; i < this.checkOption.length; i++) {
          this.checkOption[i].label = characterList[i]
          this.checkOption[i].sort = i
          if (this.checkOption[i].isRight == '1') {
            this.checked.push(characterList[i])
            // this.checked = [...obj]
          }
        }
      }
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
.option-class {
  flex: 24;
  height: auto;
}
.trends-height1 {
  height: 50px;
}
.trends-height2 {
  height: 120px;
}
.input-border-class {
  width: 1300px;
  // height: 40px;
  line-height: 40px;
  padding-left: 20px;
  text-align: left;
  margin-bottom: 10px;
  // max-height: 40px;
  // overflow-y: overlay;
}

.input-border-class:hover {
  border: 1px solid #2f54eb;
}
.wrap-icon {
  display: flex;
  margin-left: 10px;
  .right-icon {
    margin-right: 10px;
  }
}
.append-radio {
  font-size: 16px;
  color: #2f54eb;
  cursor: pointer;
  text-align: left;
}
/deep/ .ant-radio-checked:after {
  border: none;
}
/deep/ .ant-input {
  border: 0;
  min-width: 1300px;
  font-size: 16px;
  padding: 5px;
  height: 100%;
}
</style>
