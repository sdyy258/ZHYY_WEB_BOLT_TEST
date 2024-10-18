<template>
  <div>
    <div class="option-class">
      <a-radio-group
        v-model="checked"
        v-for="(i, radioIndex) in radioOption"
        :key="radioIndex"
        @change="groupChange($event, radioIndex)"
        class="option-card"
      >
        <a-radio :value="i.value" class="card-circle">
          <div style="display: flex; flex: 24; flex-shrink: 0">
            <div style="font-size: 18px; margin-right: 10px; line-height: 40px">{{ i.value }}</div>
            <j-editor v-if="editorShow == '1' + radioIndex" v-model="i.content" @blur="onEditorBlur(radioIndex)" />
            <div class="input-border-class" @click="checkChange(radioIndex)" v-else>
              <span v-if="i.content" style="color: black">{{ htmlToString(i.content) }}</span>
              <span v-else>选项，点此编辑；选中既设置为正确答案(必填)</span>
            </div>
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </a-radio>
        <div style="clear: both"></div>
      </a-radio-group>
      <div class="append-radio" v-if="this.radioOption.length !== 8" @click="appendRadioClick()">＋ 添加选项</div>
      <a-divider dashed style="margin: 0; margin-top: 20px" />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      checked: '',
      letter: letter,
      editorShow: '',
      radioOption: [
        {
          index: 1,
          value: 'A',
          content: '',
        },
        {
          index: 2,
          value: 'B',
          content: '',
        },
        {
          index: 3,
          value: 'C',
          content: '',
        },
        {
          index: 4,
          value: 'D',
          content: '',
        },
      ],
    }
  },
  methods: {
    endit(val) {
      let data = val.prop11
      this.radioOption = []
      for (let i in data) {
        let obj = {
          index: data[i].index,
          content: data[i].text,
          value: data[i].option,
        }
        this.radioOption.push(obj)
      }
      this.checked = val.prop8
    },
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
      // this.editorShow =''
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
      this.$forceUpdate()
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
      this.editorShow = ''
    },
    htmlToString(htmlStr) {
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '') : ''
    },
    checkChange(index) {
      this.editorShow = '1' + index
      console.log('editorShow', this.editorShow)
    },
    groupChange(e, index) {
      console.log('e', e.target.value)
      let arr = this.letter.find((item) => item.text === e.target.value).index
      this.editorShow = '1' + index
      console.log('editorShow', this.editorShow)
    },
    appendRadioClick() {
      if (this.radioOption.length === 8) {
        return
      } else {
        const index = this.radioOption[this.radioOption.length - 1].index + 1
        this.radioOption.push({
          index: index,
          value: this.letter.find((item) => item.index === index).text,
        })
        console.log('radioOption', this.radioOption)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.option-card {
  display: flex;
}
.card-circle {
  display: flex;
  margin-bottom: 10px;
}
/deep/.ant-radio {
  padding: 14px;
}
/deep/.ant-radio-checked::after {
  border: none;
}
.input-border-class {
  color: #9090a4;
  padding-left: 20px;
  line-height: 30px;
}
.input-border-class:hover {
  border: 1px solid #2f54eb;
}

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
  //   width: 1300px;
  //   height: 40px;
  line-height: 40px;
  padding-left: 20px;
}

.input-border-class:hover {
  border: 1px solid #2f54eb;
}
.append-radio {
  font-size: 16px;
  color: #2f54eb;
  cursor: pointer;
  float: left;
}

/deep/ .ant-input {
  border: 0;
  min-width: 1300px;
  font-size: 16px;
  padding: 5px;
  height: 100%;
}
</style>
