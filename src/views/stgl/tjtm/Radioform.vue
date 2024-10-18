<template>
  <div class="option-class">
    <a-radio-group
      v-for="(i,radioIndex) in radioOption"
      :key="radioIndex"
      v-model="checked"
      class="option-card"
      @change="groupChange($event,radioIndex)"
    >
      <a-radio
        :value="i.value"
        :class="editorShow == '1'+ radioIndex?'trends-height2':'trends-height1'"
        style="display: flex;"
      />
      <div class="card-wrap">
        <div class="wrap-title">{{ i.value }}</div>
        <j-editor v-if="editorShow =='1'+ radioIndex" v-model="i.item" :height="100" />
        <div v-else class="input-border-class" @click="checkChange(radioIndex)">
          <span v-if="i.item" style="color: black;" v-html="i.item" />
          <span v-else>选项，点此编辑；选中既设置为正确答案(必填)</span>
        </div>
        <div class="wrap-icon">
          <a-icon type="rest" class="right-icon" @click="deleteradioClick(i,radioIndex)" />
          <a-icon type="arrow-up" class="right-icon" @click="upData(i,radioIndex)" />
          <a-icon type="arrow-down" class="right-icon" @click="downData(i,radioIndex)" />
        </div>
        <div style="clear:both;" />
      </div>
      <div style="clear:both;" />
    </a-radio-group>
    <div
      v-if="radioOption.length < 6"
      class="append-radio"
      @click="appendRadioClick()"
    >＋ 添加选项</div>
    <a-divider dashed style="margin: 0; margin-top: 20px;" />
  </div>
</template>
<script>
import { letter } from './compents/dataType'
import { baseURL } from '@/utils/request.js'
import { getFileAccessHttpUrl } from '@/api/manage'
const characterList = []
export default {
  props: {
    radioForm: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: '',
      letter: letter,
      editorShow: '',
      radioOption: [
        {
          sort: 0,
          value: 'A',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 1,
          value: 'B',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 2,
          value: 'C',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 3,
          value: 'D',
          item: '',
          isRight: '',
          keyItem: ''
        }
      ],
    }
  },
  watch: {
    radioOption: {
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
  },
  methods: {
    init() {
      if (this.radioForm.length > 0) {
        this.radioOption = this.radioForm.map((item, index) => {
          const obj = {
            sort: index,
            value: characterList[index],
            item: item.item,
            checked: item.isRight,
            isRight: item.isRight,
            keyItem: item.keyItem
          }
          if (item.isRight == '1') {
            this.checked = characterList[index]
          }
          return obj
        })
      }
    },
    // change(){debugger
    //   this.$emit('ok', this.radioOption)
    // },
    // 编辑时重置内容
    reset(val) {
      this.character()
      this.radioForm = [...val]
      this.radioOption = this.radioForm.map((item, index) => {
        const obj = {
          sort: index,
          value: characterList[index],
          item: item.item,
          checked: item.isRight,
          isRight: item.isRight,
          keyItem: item.keyItem
        }
        if (item.isRight == '1') {
          this.checked = characterList[index]
        }
        return obj
      })
    },
    showModal() {
      this.checked = ''
      this.radioOption = [
        {
          sort: 0,
          value: 'A',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 1,
          value: 'B',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 2,
          value: 'C',
          item: '',
          isRight: '',
          keyItem: ''
        },
        {
          sort: 3,
          value: 'D',
          item: '',
          isRight: '',
          keyItem: ''
        }
      ]
    },
    // 输出26个字母
    character() {
      for (var i = 0; i < 26; i++) {
        console.log(String.fromCharCode(65 + i)) //
        characterList.push(String.fromCharCode(65 + i))
      }
    },
    // blur(quill){

    // },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
      this.editorShow = ''
    },
    // P span便签 过滤出字符
    htmlToString(htmlStr) {
      // str1.replace(/&nbsp;/gi, ""
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 富文本框显示
    checkChange(index) {
      this.editorShow = '1' + index
      console.log('editorShow', this.editorShow)
    },
    groupChange(e, index) {
      console.log('e', e.target.value)
      this.radioOption.forEach((item, i) => {
        if (index == i) {
          item.isRight = 1
        } else {
          item.isRight = 0
        }
      })
    },
    // 添加选项
    appendRadioClick() {
      const index = this.radioOption.length
      this.radioOption.push({
        sort: index,
        value: characterList[index],
        item: '',
        checked: '',
        isRight: '',
        keyItem: ''
      })
      console.log('radioOption', this.radioOption)
    },
    // s删除选项
    deleteradioClick(item, index) {
      this.radioOption.splice(index, 1)
      for (let i = 0; i < this.radioOption.length; i++) {
        this.radioOption[i].value = characterList[i]
        this.radioOption[i].sort = i
        if (this.radioOption[i].isRight == 1) {
          this.checked = characterList[i]
        } else {
          this.checked = ''
        }
      }
    },
    // 位置上移
    upData(item, index) {
      let arr = []
      if (index > 0) {
        arr = this.radioOption[index - 1]
        this.radioOption[index - 1] = this.radioOption[index]
        this.radioOption[index] = arr
        for (let i = 0; i < this.radioOption.length; i++) {
          this.radioOption[i].value = characterList[i]
          this.radioOption[i].sort = i
          if (this.radioOption[i].isRight == 1) {
            this.checked = characterList[i]
          }
        }
      }
      this.$forceUpdate()
    },
    // 位置下移
    downData(item, index) {
      let arr = []
      if (index < this.radioOption.length - 1) {
        arr = this.radioOption[index + 1]
        this.radioOption[index + 1] = this.radioOption[index]
        this.radioOption[index] = arr
        for (let i = 0; i < this.radioOption.length; i++) {
          this.radioOption[i].value = characterList[i]
          this.radioOption[i].sort = i
          if (this.radioOption[i].isRight == 1) {
            this.checked = characterList[i]
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
.option-card {
  display: flex;
  margin-bottom: 30px;
  align-items: center;
}
.card-wrap {
  display: flex;
  flex: 24;
  flex-shrink: 0;
  width: 95%;
  align-items: center;
  .wrap-title {
    font-size: 18px;
    margin-right: 10px;
    line-height: 40px;
  }
  .wrap-icon {
    display: flex;
    margin-left: 10px;
    .right-icon {
      margin-right: 10px;
    }
  }
}
.trends-height1 {
  height: 50px;
  align-items: center;
}
.trends-height2 {
  height: 120px;
  align-items: center;
}
.input-border-class {
  width: 1300px;
  // height: 40px;
  line-height: 40px;
  padding-left: 20px;
  text-align: initial;
  // max-height: 40px;
  // overflow-y: overlay;
  // margin: -10px 10px;
}

.input-border-class:hover {
  border: 1px solid #2f54eb;
}
.append-radio {
  font-size: 16px;
  color: #2f54eb;
  cursor: pointer;
  text-align: left;
}
/deep/.ant-radio-checked::after {
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
