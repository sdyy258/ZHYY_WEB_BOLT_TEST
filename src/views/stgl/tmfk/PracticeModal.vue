<template>
  <a-modal :visible="visible" title="练习" :width="900" :height="500" @ok="visible = false" @cancel="visible = false">
    <template slot="footer">
      <a-button type="primary" @click="visible = false">
        返回
      </a-button>
    </template>
    <a-card class="cardStyle">
      <div class="content">
        <div class="content-left">
          <div class="topic-content">
            <div v-if="dataSource.questionType == 1" class="content-type">单</div>
            <div v-else-if="dataSource.questionType == 2" class="content-type">多</div>
            <div v-else-if="dataSource.questionType == 3" class="content-type">判</div>
            <div v-else-if="dataSource.questionType == 4" class="content-type">填</div>
            <div v-else-if="dataSource.questionType == 5" class="content-type">简</div>
            <div v-else-if="dataSource.questionType == 6" class="content-type">计</div>
            <div v-else-if="dataSource.questionType == 7" class="content-type">分</div>
            <div v-else-if="dataSource.questionType == 8" class="content-type">论</div>
            <span><span class="htmlStyle" v-html="dataSource.name"/></span>
          </div>
          <!-- 单选 -->
          <div v-if="dataSource.questionType == 1" class="answer-sheet">
            <a-radio-group
              v-model="dataSource.value"
              class="radioGroup htmlStyle"
              :disabled="dataSource.analysisShow"
              @change="isRight"
            >
              <a-radio v-for="i in dataSource.itemList" :key="i.value" :value="i.value">
                <span class="radioGroup-text">{{ i._option }}、</span>
                <span class="htmlStyle" v-html="i.item" />
              </a-radio>
            </a-radio-group>
          </div>
          <!-- 多选 -->
          <div v-else-if="dataSource.questionType == 2" class="answer-sheet">
            <a-checkbox-group
              v-model="dataSource.value"
              :disabled="dataSource.analysisShow"
              class="checkboxGroup htmlStyle"
              @change="$forceUpdate()"
            >
              <a-checkbox
                v-for="i in dataSource.itemList"
                :key="i.value"
                :value="i.value"
                @change="checkBoxChange($event, i)"
              >
                <span class="radioGroup-text">{{ i._option }}、</span>
                <span v-html="i.item" />
              </a-checkbox>
            </a-checkbox-group>
          </div>
          <!-- 判断 -->
          <div v-else-if="dataSource.questionType == 3" class="answer-sheet">
            <a-radio-group
              v-model="dataSource.value"
              class="radioGroup htmlStyle"
              :disabled="dataSource.analysisShow"
              @change="isRight"
            >
              <a-radio v-for="i in dataSource.itemList" :key="i.value" :value="i.value"
                ><span v-html="i.item"
              /></a-radio>
            </a-radio-group>
          </div>
          <!-- 填空 -->
          <div v-else-if="dataSource.questionType == 4">
            <div v-for="i in dataSource.itemCount" :key="i" style="display: flex;align-items: center">
              <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
              <j-editor
                v-model="dataSource.value[i - 1]"
                :disabled="dataSource.analysisShow"
                toolbar="superscript subscript"
                :height="100"
                style="flex: 1;margin-bottom: 10px"
                @change="$forceUpdate()"
              />
            </div>
          </div>
          <!-- 主观题 -->
          <div
            v-else-if="
              dataSource.questionType == 5 ||
                dataSource.questionType == 6 ||
                dataSource.questionType == 7 ||
                dataSource.questionType == 8
            "
          >
            <div v-for="i in dataSource.itemCount" :key="i" style="display: flex;align-items: center">
              <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
              <j-editor
                v-model="dataSource.value"
                :disabled="dataSource.analysisShow"
                toolbar="superscript subscript"
                :height="100"
                style="flex: 1;margin-bottom: 10px"
                @change="$forceUpdate()"
              />
            </div>
          </div>
          <div v-if="dataSource.questionType == 2 || dataSource.questionType == 4">
            <a-button type="primary" @click="isRight">确定</a-button>
          </div>
          <div
            v-else-if="
              dataSource.questionType == 5 ||
                dataSource.questionType == 6 ||
                dataSource.questionType == 7 ||
                dataSource.questionType == 8
            "
          >
            <a-button type="primary" @click="kgisRight">确定</a-button>
          </div>
          <div
            v-if="
              dataSource.analysisShow &&
                (dataSource.questionType == 1 ||
                  dataSource.questionType == 2 ||
                  dataSource.questionType == 3 ||
                  dataSource.questionType == 4)
            "
            class="answerStatus"
          >
            <div v-if="dataSource.isError == 0">
              <a-icon type="check-circle" theme="filled" class="success" style="font-size: 16px;margin-right: 5px;" />
              <span class="success">正确</span>
            </div>
            <div v-else>
              <a-icon type="close-circle" theme="filled" class="error" style="font-size: 16px;margin-right: 5px;" />
              <span class="error">错误</span>
            </div>
          </div>
          <!-- <div class="panel-bottom">
              <button :class="nextTopicShow?'unchange':'change'" style="margin-right:30px" @click="toPrev">上一题</button>
              <button :class="nextTopicShow?'change':'unchange'" style="margin-right:30px" @click="toNext">下一题</button>
              <button v-if="type == 4 && !dataSource.removeErrorShow" class="remove" @click="removeError">移出错题集</button>
            </div> -->
        </div>
      </div>
      <div v-if="dataSource.analysisShow" class="questionAnalysis">
        <div class="analysisTitle">
          试题讲解
        </div>
        <div class="analysisContent">
          <div class="analysisText">
            正确答案：
            <span v-for="(ans, a) in dataSource.itemList" :key="a">
              <span
                v-if="
                  dataSource.questionType == 4 ||
                    dataSource.questionType == 5 ||
                    dataSource.questionType == 6 ||
                    dataSource.questionType == 7 ||
                    dataSource.questionType == 8
                "
                style="white-space: break-spaces;margin-right: 10px;"
                ><span class="htmlStyle" v-html="ans.item"
              /></span>
              <span
                v-if="
                  !(
                    dataSource.questionType == 4 ||
                    dataSource.questionType == 5 ||
                    dataSource.questionType == 6 ||
                    dataSource.questionType == 7 ||
                    dataSource.questionType == 8
                  ) && ans.isRight == 1
                "
                style="white-space: break-spaces;margin-right: 10px;"
              >
                <span v-if="dataSource.questionType != 3"><span class="htmlStyle" v-html="ans.label"/></span>
                <span v-else><span class="htmlStyle" v-html="ans.item"/></span>
              </span>
            </span>
          </div>
          <div class="analysisText">
            <span style="color:#E3C5A0"><span class="htmlStyle" v-html="dataSource.analysis"/></span>
          </div>
        </div>
      </div>
    </a-card>
  </a-modal>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
export default {
  data() {
    return {
      visible: false,
      dataSource: [],
      data: []
    }
  },
  methods: {
    showModal(record) {
      const that = this
      this.dataSource = []
      getAction('/tQuestion/tQuestion/testQuestionById', { id: record.id }, 'get').then(res => {
        console.log(res, this.dataSource)
        if (res.success) {
          this.dataSource = { ...res.result }
          this.dataSource.analysisShow = false // 默认不显示分析
          this.dataSource.value = res.result.value || []
          if (this.dataSource.itemList) {
            this.dataSource.itemList.forEach((i, _index) => {
              i._option = this.$utils.getABCD(_index)
              i.value = i.itemId + '&&' + i._option
              i.label = i._option + '、' + i.item
            })
          }
          that.visible = true
          console.log(this.dataSource)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    checkBoxChange(e, item) {
      item.isChecked = e.target.checked
      this.dataSource.itemList
      this.$forceUpdate()
    },
    // 判断对错
    isRight() {
      // isError =1 是错误，0是正确
      var that = this
      // isError =1 是错误，0是正确
      if (this.dataSource.questionType !== 4) {
        if (this.dataSource.questionType === 2) {
          for (let i = 0; i < this.dataSource.itemList.length; i++) {
            if (this.dataSource.itemList[i].isRight != 1 && this.dataSource.itemList[i].isChecked) {
              this.$set(this.dataSource, 'isError', 1)
              break
            } else if (this.dataSource.itemList[i].isRight === 1 && !this.dataSource.itemList[i].isChecked) {
              this.$set(this.dataSource, 'isError', 1)
              break
            } else {
              this.$set(this.dataSource, 'isError', 0)
            }
          }
        } else {
          const a = this.dataSource.itemList
            .filter(item => item.isRight === 1)
            .map(res => {
              return res.itemId
            }) // 答案
          const array = this.$utils.stringToArray(that.dataSource.value).map(i => {
            if (!i) {
              return ''
            } else {
              return i.split('&&')[0]
            }
          })
          const b = array.toString() // 用户选择的选项
          if (a.toString() === b) {
            this.$set(this.dataSource, 'isError', 0)
          } else {
            this.$set(this.dataSource, 'isError', 1)
          }
        }
      } else {
        // 获取填空题答案是否对错
        const array = []
        const obj = {
          id: this.dataSource.id,
          itemList: this.dataSource.value
        }
        array.push(obj)
        postAction('/tExamPaper/tExamPaper/judgeFillBlank', array).then(res => {
          if (res.result[this.dataSource.id] == 1) {
            this.$set(this.dataSource, 'isError', 0)
          } else {
            this.$set(this.dataSource, 'isError', 1)
          }
        })
      }
      this.dataSource.analysisShow = true
      this.$forceUpdate()
    },
    // 客观题确认答案
    kgisRight() {
      this.dataSource.analysisShow = true
      this.$forceUpdate()
    },
    // 取消关闭
    canlcel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.cardStyle {
  max-height: 600px;
  overflow: scroll;
  margin-top: 20px;
}
.content {
  display: flex;
  .content-left {
    width: 100%;
    .topic-content {
      padding-bottom: 15px;
      font-size: 16px;
      color: #333333;
      display: flex;
      .content-type {
        width: 25px;
        height: 25px;
        border-radius: 4px;
        padding: 5px;
        background-color: #f45744;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
  .content-right {
    width: 20%;
    display: flex;
    justify-content: center;
    .collect {
      width: 80px;
      height: 32px;
      border: 1px solid #c5c5c5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #afafaf;
      cursor: pointer;
    }
    .select {
      width: 80px;
      height: 32px;
      border: 1px solid #fdd973;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #ffce43;
    }
  }
}

.answer-sheet {
  .radioGroup {
    display: flex;
    flex-direction: column;
    .radioGroup-text {
      font-size: 14px;
      font-weight: bold;
    }
    .radioLabel {
      display: flex;
      align-items: center;
    }
  }

  .checkboxGroup {
    display: flex;
    flex-direction: column;
    .radioGroup-text {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .inputGroup {
    margin-bottom: 15px;
  }
}

.answerStatus {
  height: 50px;
  display: flex;
  align-items: center;
  .success {
    color: #20b759;
  }
  .error {
    color: red;
  }
}
.panel-bottom {
  height: 80px;
  display: flex;
  align-items: center;

  .unchange {
    width: 200px;
    height: 40px;
    background-color: #e5f1ff;
    color: #0080ff;
    border: none;
    cursor: pointer;
  }

  .change {
    width: 200px;
    height: 40px;
    background-color: #0080ff;
    color: #ffffff;
    border: none;
    cursor: pointer;
  }
  .remove {
    width: 200px;
    height: 40px;
    background-color: #e6a23c;
    color: #ffffff;
    border: none;
    cursor: pointer;
  }
}

.questionAnalysis {
  padding: 10px 20px;
  background-color: #fef9f3;
  border-radius: 5px;
  .analysisTitle {
    height: 43px;
    font-size: 18px;
    border-bottom: 2px solid #f8f4ef;
    padding: 5px 0;
  }
  .analysisContent {
    padding: 10px 0;
    .analysisText {
      margin: 5px 0;
    }
  }
}

.htmlStyle {
  white-space: break-spaces;
  /deep/ p {
    display: inline;
  }
  /deep/ p > img {
    width: 15%;
  }
}
/deep/ .ant-card-head {
  padding: 0 60px;
}

/deep/ .ant-card-body {
  padding: 24px 60px;
  height: 100%;
}

/deep/ .ant-radio-wrapper {
  line-height: 30px;
}

/deep/ .ant-checkbox-wrapper {
  line-height: 30px;
}

/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
