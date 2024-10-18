<template>
  <div style="height:100vh;background-color: #F0F2F5;overflow-x: hidden">
    <div class="title">{{ name || '' }}</div>
    <div style="height: calc(100% - 70px);padding: 30px 100px;display: flex">
      <div :span="20" style="height:100%;flex: 1">
        <a-card style="height:calc(100% - 100px)">
          <div slot="title">
            <span>{{ $utils.getChineseNumber(currentItem.bigSort - 1) }}</span
            >、
            <span>{{ currentItem.bigName }}</span>
            <span style="color:#979596;font-size: 14px;margin-left: 10px;"
              >(共{{ currentItem.smallQuestionCount }}小题，合计{{ currentItem.bigScore }}分)</span
            >
          </div>
          <div style="position: relative;height: 100%;">
            <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;overflow-y: auto;">
              <div class="topic-content">
                <span>{{ currentItem._order + '.' }}</span>
                <span style="margin-left: 8px"><span class="htmlStyle" v-html="currentItem.name"/></span>
              </div>
              <!-- 单选 -->
              <div v-if="currentItem.questionType == 1" class="answer-sheet">
                <a-radio-group v-model="currentItem.value" class="radioGroup htmlStyle" disabled>
                  <a-radio v-for="i in currentItem.itemList" :key="i.value" :value="i.value"
                    >{{ i._option }}、<span v-html="i.item"
                  /></a-radio>
                </a-radio-group>
              </div>
              <!-- 多选 -->
              <div v-else-if="currentItem.questionType == 2" class="answer-sheet">
                <a-checkbox-group v-model="currentItem.value" disabled class="checkboxGroup htmlStyle">
                  <a-checkbox v-for="i in currentItem.itemList" :key="i.value" :value="i.value"
                    >{{ i._option }}、<span v-html="i.item"
                  /></a-checkbox>
                </a-checkbox-group>
                <!-- <j-checkbox v-model="currentItem.value" :options="currentItem.itemList" disabled class="checkboxGroup" /> -->
              </div>
              <!-- 判断 -->
              <div v-else-if="currentItem.questionType == 3" class="answer-sheet">
                <a-radio-group v-model="currentItem.value" class="radioGroup htmlStyle" disabled>
                  <a-radio v-for="i in currentItem.itemList" :key="i.value" :value="i.value"
                    ><span v-html="i.item"
                  /></a-radio>
                </a-radio-group>
              </div>
              <!-- 填空 -->
              <div v-else-if="currentItem.questionType == 4">
                <div v-for="i in currentItem.itemCount" :key="i" style="display: flex;align-items: center">
                  <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
                  <j-editor
                    v-model="currentItem.value[i - 1]"
                    disabled
                    toolbar="superscript subscript"
                    :height="150"
                    style="flex: 1;margin-bottom: 10px"
                  />
                </div>
                <!-- <a-input
                v-for="i in currentItem.itemCount"
                :key="i"
                v-model.trim="currentItem.value[i-1]"
                :addon-before="i"
                :placeholder="`请输入第${i}个填空的答案`"
                class="mb10"
                disabled
              /> -->
              </div>
              <!-- 应用题 -->
              <div
                v-else-if="
                  currentItem.questionType == 5 ||
                    currentItem.questionType == 6 ||
                    currentItem.questionType == 7 ||
                    currentItem.questionType == 8
                "
              >
                <div style="display: flex;align-items: center">
                  <div style="width: 30px;font-size: 20px;font-weight: 600;">答：</div>
                  <j-editor
                    v-model="currentItem.value"
                    disabled
                    toolbar="superscript subscript"
                    show-sub-tip
                    :height="350"
                    style="flex: 1;margin-bottom: 10px;margin-right: 10px;"
                  />
                </div>
              </div>
              <div class="analysis">
                <div
                  class="analysis-row"
                  v-if="
                    currentItem.questionType == 1 ||
                      currentItem.questionType == 2 ||
                      currentItem.questionType == 3 ||
                      currentItem.questionType == 4
                  "
                >
                  <div v-if="currentItem.rightOrWrong == 2" style="display: flex;align-items: center;">
                    <a-icon
                      type="smile"
                      style="font-size: 18px;color: #ffffff;background-color: #1DC88C;border-radius: 4px;padding: 2px;"
                    />
                    <span style="margin-left: 10px;font-size: 16px;">恭喜你答对啦</span>
                  </div>
                  <div v-else style="display: flex;align-items: center;">
                    <a-icon
                      type="meh"
                      style="font-size: 18px;color: #ffffff;background-color: #FF4B50;border-radius: 4px;padding: 2px;"
                    />
                    <span style="margin-left: 10px;font-size: 16px;">答错了</span>
                  </div>
                </div>
                <div class="analysis-row">
                  <span>实际得分：{{ currentItem.answerScore }}</span>
                </div>
                <div
                  class="analysis-row"
                  v-if="
                    currentItem.questionType == 1 ||
                      currentItem.questionType == 2 ||
                      currentItem.questionType == 3 ||
                      currentItem.questionType == 4
                  "
                >
                  <span v-if="currentItem.questionType == 4"
                    >学员答案：<span class="htmlStyle" v-html="currentItem.value.join(' ')"
                  /></span>
                  <!-- <span
                    v-else-if="
                      currentItem.questionType == 5 ||
                        currentItem.questionType == 6 ||
                        currentItem.questionType == 7 ||
                        currentItem.questionType == 8
                    "
                    >学员答案：<span class="htmlStyle" v-html="currentItem.value"
                  /></span> -->
                  <span v-else-if="currentItem.questionType == 2">
                    学员答案：
                    <template v-if="currentItem.value.length > 0">
                      <span v-for="(cur, c) in currentItem.value" :key="c" style="margin-right:10px">
                        <span class="htmlStyle" v-html="cur.split('&&')[1]" />
                      </span>
                    </template>
                  </span>
                  <span v-else>
                    学员答案：
                    <template v-if="currentItem.value">
                      <span v-for="(cur, c) in currentItem.value.split(',')" :key="c" style="margin-right:10px">
                        <span v-if="currentItem.questionType == 3">{{
                          cur.split('&&')[1] === 'A' ? '正确' : '错误'
                        }}</span>
                        <span v-else><span class="htmlStyle" v-html="cur.split('&&')[1]"/></span>
                      </span>
                    </template>
                  </span>
                </div>
                <div class="analysis-row">
                  <span>
                    <span
                      v-if="
                        currentItem.questionType == 1 ||
                          currentItem.questionType == 2 ||
                          currentItem.questionType == 3 ||
                          currentItem.questionType == 4
                      "
                      >正确答案：</span
                    >
                    <span v-else>参考答案：</span>
                    <span v-for="(ans, a) in currentItem.itemList" :key="a">
                      <span
                        v-if="
                          currentItem.questionType == 4 ||
                            currentItem.questionType == 5 ||
                            currentItem.questionType == 6 ||
                            currentItem.questionType == 7 ||
                            currentItem.questionType == 8
                        "
                        style="white-space: break-spaces;margin-right: 10px;"
                        ><span class="htmlStyle" v-html="ans.item"
                      /></span>
                      <span
                        v-if="currentItem.questionType != 4 && ans.isRight == 1"
                        style="white-space: break-spaces;margin-right: 10px;"
                      >
                        <span v-if="currentItem.questionType == 3"><span class="htmlStyle" v-html="ans.item"/></span>
                        <span v-else><span class="htmlStyle" v-html="ans.label.split('、')[0]"/></span>
                      </span>
                    </span>
                  </span>
                </div>
                <div class="analysis-row">
                  <span>解释说明：<span class="htmlStyle" v-html="currentItem.analysis"/></span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
        <div class="panel-bottom" style="height:100px;background-color: #FAFAFA;">
          <button :class="currentItem._order === 1 ? 'unchange' : 'change'" @click="toPrev">上一题</button>
          <button :class="currentItem._order === dataSource.length ? 'unchange' : 'change'" @click="toNext">
            下一题
          </button>
        </div>
      </div>
      <div style="height:100%;width: 300px;margin-left: 30px;display:flex;flex-direction: column">
        <div class="divClass rightBottom" style="flex: 1">
          <div class="answerSheet">答题卡</div>
          <div class="amountTo">
            <span style="font-size: 16px">共 {{ dataSource.length }} 题 | 总计 {{ data.score }} 分</span>
          </div>
          <div v-for="item in $utils.groupBy(dataSource, i => i.bigSort)" :key="item[0].bigSort">
            <div>
              <span>{{ $utils.getChineseNumber(item[0].bigSort - 1) }}</span
              >、
              <span>{{ item[0].bigName }}</span>
            </div>
            <div class="sdd-question-anchor">
              <a-tag
                v-for="i in item"
                :key="i.id"
                color="blue"
                class="exam-tag"
                :class="
                  i.questionType == 5 || i.questionType == 6 || i.questionType == 7 || i.questionType == 8
                    ? 'warning'
                    : i.rightOrWrong === 2
                    ? 'active'
                    : 'error'
                "
                @click="changeTag(i)"
              >
                {{ i._order }}
              </a-tag>
            </div>
          </div>
          <div class="legend">
            <div><img src="./blue.png" alt />答案正确</div>
            <div><img src="./red.png" alt />答案错误</div>
            <div><img src="./orange.png" alt />简答题、论述题、计算题、分析题</div>
          </div>
        </div>
        <div style="height:calc(10% - 30px);display: flex;align-items: center;">
          <a-button type="primary" size="large" style="width:100%" @click="callBackClick">返回</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAction } from '@api/manage'
export default {
  data() {
    return {
      data: {},
      dataSource: [], // 试题列表
      currentItem: {}, // 当前试题
      inter: null,
      loading: true,
      intervalId: null,
      recordId: null,
      name: null,
      queryType: false, // 区分是成绩查询进入（queryType=true）， 还是历史考试
      backList: '',
      feedbackShow: false
    }
  },
  created() {
    this.loading = true
    const middleData = this.$route.query
    let url = ''
    const params = {}
    if (middleData.queryType) {
      params.examId = middleData.examId
      params.userId = middleData.userId
      this.queryType = middleData.queryType
      this.name = middleData.examName
      this.feedbackShow = middleData.feedbackShow
      url = '/tExamPaperUser/tExamPaperUser/paperReview'
    } else {
      const { recordId, name } = this.$route.query
      this.recordId = recordId
      this.name = name
      url = '/tExam/tExam/getPaperByRecordId'
      params.recordId = recordId
    }

    getAction(url, params).then(res => {
      this.loading = false
      this.data = res.result
      this.dataSource = this.data.questionList
      this.dataSource.forEach((item, index) => {
        item._order = index + 1
        item.value = item.value || []
        if (item.itemList) {
          item.itemList.forEach((i, _index) => {
            i._option = this.$utils.getABCD(_index)
            i.value = i.id + '&&' + i._option
            i.label = i._option + '、' + i.item
          })
        }
        if (item.questionType !== 4 && item.questionType !== 2) {
          item.value = this.$utils.arrayToString(item.value)
        }
      })
      this.currentItem = this.dataSource[0]
    })
    this.keyDown()
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  methods: {
    keyDown() {
      document.onkeydown = e => {
        if (e.keyCode === 39 || e.keyCode === 40) {
          this.toNext()
          // 取消原来的后续事件
          e.preventDefault()
        } else if (e.keyCode === 37 || e.keyCode === 38) {
          this.toPrev()
          // 取消原来的后续事件
          e.preventDefault()
        }
      }
    },
    // 上一题
    toPrev() {
      const _order = this.currentItem._order
      if (_order !== 1) {
        this.currentItem = this.dataSource.find(item => item._order === _order - 1)
      } else {
        this.$message.warning('已为第一题，不能再点击！')
      }
    },
    // 下一题
    toNext() {
      const _order = this.currentItem._order
      if (_order !== this.dataSource.length) {
        this.currentItem = this.dataSource.find(item => item._order === _order + 1)
      } else {
        this.$message.warning('已为最后一题，不能再点击！')
      }
    },
    changeTag(item) {
      this.currentItem = item
    },
    // 返回
    callBackClick() {
      if (this.queryType) {
        this.$router.push({
          path: '../../ksgl/cjcx',
          query: { showCache: true, feedbackShow: this.feedbackShow }
        })
      } else {
        this.$router.push({
          path: '/zxks/zxks'
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.title {
  width: 100%;
  height: 70px;
  background-color: #1a8cfe;
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
  padding-left: 130px;
}

.topic-content {
  padding-bottom: 15px;
  font-size: 16px;
  color: #333333;
}

.answer-sheet {
  .radioGroup {
    display: flex;
    flex-direction: column;
  }

  .checkboxGroup {
    display: flex;
    flex-direction: column;
  }

  .inputGroup {
    margin-bottom: 15px;
  }
}
.analysis {
  border-radius: 4px;
  padding: 20px;
  line-height: 24px;
  margin-top: 20px;
  background: #fafafa;
  position: relative;
  .analysis-row {
    min-height: 30px;
    padding-right: 60px;
    position: relative;
  }
}
.panel-bottom {
  display: flex;
  justify-content: space-around;
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
}

.divClass {
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 15px;
}

.rightTop {
  padding: 0;
  border-radius: 10px 10px 0 0;
  position: relative;

  .topDiv {
    height: 40px;
    color: #ffffff;
    background-color: #0080ff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px 10px 0 0;
  }

  .topImg {
    width: 100%;
    height: calc(100% - 40px);

    img {
      width: 100%;
      height: 100%;
    }
  }

  .topPhoto {
    position: absolute;
    right: 0;
    top: 40px;
    width: 70px;
    height: auto;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.rightMiddle {
  margin-top: 10px;
  .remainingTime {
    height: 40px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .time {
    height: calc(100% - 40px);
    font-size: 28px;
    color: #0080ff;
    font-weight: bold;
    background-color: #f4fafa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.rightBottom {
  .answerSheet {
    height: 40px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .amountTo {
    height: 40px;
    color: #979596;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sdd-question-anchor {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;

    .exam-tag {
      margin: 5px 8px;
      cursor: pointer;
      width: 36px;
      height: 36px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        border: #0080ff solid 1px;
        background-color: #1a8cfe;
        color: white;
      }
      &.error {
        border: red solid 1px;
        background-color: red;
        color: white;
      }
      &.warning {
        border: orange solid 1px;
        background-color: orange;
        color: white;
      }
    }
  }
}
.legend {
  img {
    width: 15px;
    margin-right: 5px;
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
  height: calc(100% - 57px);
  overflow-y: auto;
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
