<template>
  <a-spin :spinning="loading">
    <div
      style="height:100vh;background-color: #F0F2F5;overflow-x: hidden"
      :class="remainTime <= 0 ? 'events-disabled' : ''"
    >
      <div class="title">{{ model.name || '' }}</div>
      <template v-if="success === true">
        <div style="height: calc(100% - 70px);padding: 30px 100px;display: flex">
          <div :span="20" style="height:100%;flex: 1">
            <a-card style="height:calc(100% - 100px);">
              <div slot="title">
                <span>{{ $utils.getChineseNumber(currentItem.bigSort - 1) }}</span>、
                <span>{{ currentItem.bigName }}</span>
                <span
                  style="color:#979596;font-size: 14px;margin-left: 10px;"
                >(共{{ currentItem.smallQuestionCount }}小题，合计{{ currentItem.bigScore }}分)</span>
              </div>
              <div style="height: 100%;overflow-y: auto;">
                <div class="topic-content">
                  <span>
                    <a-button
                      size="small"
                      :class="currentItem.isSign == 1 ? 'warning' : ''"
                      style="margin: 10px;"
                      @click="handleMark"
                    >标记</a-button>
                  </span>
                  <span>{{ currentItem._order + '.' }}</span>
                  <span class="rich-text-html" style="margin-left: 8px" v-html="currentItem.name" />
                </div>
                <!-- 单选 -->
                <div v-if="currentItem.questionType == 1" class="answer-sheet">
                  <a-radio-group v-model="currentItem.value" class="radioGroup">
                    <a-radio
                      v-for="i in currentItem.itemList"
                      :key="i.value"
                      :value="i.value"
                    ><span
                      class="rich-text-html"
                      v-html="i.label"
                    /></a-radio>
                  </a-radio-group>
                </div>
                <!-- 多选 -->
                <div v-else-if="currentItem.questionType == 2" class="answer-sheet">
                  <j-checkbox
                    v-model="currentItem.value"
                    is-rich-text
                    :options="currentItem.itemList"
                    class="checkboxGroup"
                  />
                </div>
                <!-- 判断 -->
                <div v-else-if="currentItem.questionType == 3" class="answer-sheet">
                  <a-radio-group v-model="currentItem.value" class="radioGroup">
                    <a-radio
                      v-for="i in currentItem.itemList"
                      :key="i.value"
                      :value="i.value"
                    ><span
                      class="rich-text-html"
                      v-html="i.item"
                    /></a-radio>
                  </a-radio-group>
                </div>
                <!-- 填空 -->
                <div v-else-if="currentItem.questionType == 4">
                  <div v-for="i in currentItem.itemCount" :key="i" style="display: flex;align-items: center">
                    <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
                    <j-editor
                      v-model="currentItem.value[i - 1]"
                      toolbar="superscript subscript table fullscreen"
                      show-sub-tip
                      :height="150"
                      style="flex: 1;margin-bottom: 10px"
                    />
                  </div>
                  <!--                  <a-input-->
                  <!--                    v-for="i in currentItem.itemCount"-->
                  <!--                    :key="i"-->
                  <!--                    v-model.trim="currentItem.value[i-1]"-->
                  <!--                    :addon-before="i"-->
                  <!--                    :placeholder="`请输入第${i}个填空的答案`"-->
                  <!--                    class="mb10"-->
                  <!--                  />-->
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
                      toolbar="superscript subscript table fullscreen"
                      show-sub-tip
                      show-maths
                      :height="350"
                      style="flex: 1;margin-bottom: 10px;margin-right: 10px;"
                    />
                  </div>
                </div>
              </div>
            </a-card>
            <div class="panel-bottom" style="height:100px;background-color: #FAFAFA;">
              <button :class="currentItem._order === 1 ? 'unchange' : 'change'" @click="toPrev">上一题</button>
              <button :class="currentItem._order === dataSource.length ? 'unchange' : 'change'" @click="toNext">
                下一题
              </button>
              <button v-if="currentItem._order === dataSource.length" class="change" @click="handleSubmit">
                交卷
              </button>
            </div>
          </div>
          <div style="height:100%;width: 300px;margin-left: 30px;display:flex;flex-direction: column">
            <div class="rightTop">
              <div class="topDiv">姓名：{{ $store.getters.userInfo.realname }}</div>
              <video-monitor
                v-if="model.isCameraCapture == 1"
                height="170px"
                :is-camera-capture="model.isCameraCapture == 1"
                :camera-capture-start="model.cameraCaptureStart"
                :camera-capture-time="model.cameraCaptureTime"
                :camera-capture-num="model.cameraCaptureNum"
                @captureImage="captureImage"
              />
            </div>
            <div class="divClass rightMiddle">
              <div class="remainingTime">剩余时间</div>
              <div class="time">{{ formatSeconds(remainTime) }}</div>
            </div>
            <div class="divClass rightBottom" style="flex: 1">
              <div class="answerSheet">答题卡</div>
              <div class="amountTo">
                <span style="font-size: 16px">共 {{ dataSource.length }} 题 | 总计 {{ data.score }} 分</span>
              </div>
              <div v-for="item in $utils.groupBy(dataSource, i => i.bigSort)" :key="item[0].bigSort">
                <div>
                  <span>{{ $utils.getChineseNumber(item[0].bigSort - 1) }}</span>、
                  <span>{{ item[0].bigName }}</span>
                </div>
                <div class="sdd-question-anchor">
                  <a-tag
                    v-for="i in item"
                    :key="i.id"
                    color="blue"
                    class="exam-tag"
                    :class="{
                      active:
                        i.questionType !== 4 ? !!i.value.toString() : i.value.filter(v => !!v).length === i.itemCount
                    }"
                    @click="changeTag(i)"
                  >
                    <div v-if="i.isSign == 1" class="mark" />
                    <div>{{ i._order }}</div>
                  </a-tag>
                </div>
              </div>
            </div>
            <div style="height:calc(10% - 30px);display: flex;align-items: center;">
              <a-button
                type="primary"
                size="large"
                style="width:100%"
                :disabled="remainTime <= 0"
                @click="handleSubmit"
              >交卷</a-button>
            </div>
          </div>
        </div>
      </template>
      <template v-if="success === false">
        <div style="text-align: center;font-weight: 600;font-size: 24px;margin-top: 20px">{{ message }}</div>
        <div style="text-align: center;margin-top: 30px">
          <a-button type="primary" class="events-auto" @click="$router.go(-1)">返 回</a-button>
        </div>
      </template>
      <end-exam-detail ref="endExamDetail" />
    </div>
  </a-spin>
</template>
<script>
import { formatSeconds } from '@/utils/util'
import EndExamDetail from './EndExamDetail.vue'
import VideoMonitor from '@/components/custom/VideoMonitor'
import { getAction, postAction, putAction } from '@api/manage'
import { isPageFullscreen } from '@/utils/custom/utils'

export default {
  components: { EndExamDetail, VideoMonitor },
  data() {
    return {
      model: {},
      data: {},
      dataSource: [], // 试题列表
      currentItem: {}, // 当前试题
      remainTime: 0, // 剩余答题时间
      inter: null,
      loading: true,
      intervalId: null,
      examId: '',
      paperId: '',
      picUrl: '',
      examPaperUserRecordId: '',
      success: false,
      message: '',
      fullScreenInterval: null,
      hasFullSceenTip: false
    }
  },
  beforeRouteLeave(to, form, next) {
    this.$utils.exitFullscreen()
    this.clearInterval()
    next()
  },
  created() {
    this.loading = true
    this.model = this.$route.query
    const { examId, paperId, picUrl, isFullScreen, examPaperUserRecordId } = this.model
    this.examId = examId
    this.paperId = paperId
    this.picUrl = picUrl
    this.examPaperUserRecordId = examPaperUserRecordId
    getAction('/tExamPaper/tExamPaper/startExamAndGetExamPaperTwo', { examId, paperId, examPaperUserRecordId }).then(
      res => {
        this.loading = false
        if (res.success) {
          if (isFullScreen == 1) {
            this.$utils.fullscreen()
          }
          this.success = true
          this.data = res.result
          this.remainTime = this.data.suggestSecondTime
          this.dataSource = this.data.questionList
          this.dataSource.forEach((item, index) => {
            item._order = index + 1
            if (item.itemList) {
              item.itemList.forEach((i, _index) => {
                i._option = this.$utils.getABCD(_index)
                i.value = i.id + '&&' + i._option
                i.label = i._option + '、' + i.item
              })
            }
            if (item.questionType !== 4) {
              item.value = this.$utils.arrayToString(item.value)
            }
          })
          this.currentItem = this.dataSource[0]
          this.capturePhoto()
          this.setInterval()
          this.fullScreenConsole()
        } else {
          this.success = false
          this.message = res.message
          this.data = res.result | {}
        }
      }
    )
    this.keyDown()
  },
  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  beforeDestroy() {
    document.onkeydown = null
    this.clearInterval()
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        console.log('页面现在显示')
        getAction('/tExamPaper/tExamPaper/startExamAndGetExamPaperTwo', {
          examId: this.examId,
          paperId: this.paperId,
          examPaperUserRecordId: this.examPaperUserRecordId
        }).then(res => {
          if (res.success) {
            this.remainTime = res.result.suggestSecondTime > 0 ? res.result.suggestSecondTime : 0
            console.log(11111, this.remainTime)
          }
        })
      } else if (document.visibilityState === 'hidden') {
        console.log('页面现在隐藏')
      }
    },
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
    clearInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (this.fullScreenInterval) {
        clearInterval(this.fullScreenInterval)
        this.fullScreenInterval = null
      }
    },
    // 上一题
    toPrev() {
      const _order = this.currentItem._order
      if (_order !== 1) {
        this.submitItem()
        this.currentItem = this.dataSource.find(item => item._order === _order - 1)
      } else {
        this.$message.info('当前已是第一道题')
      }
    },
    // 下一题
    toNext() {
      const _order = this.currentItem._order
      if (_order !== this.dataSource.length) {
        this.submitItem()
        this.currentItem = this.dataSource.find(item => item._order === _order + 1)
      } else {
        this.$message.info('已经是最后一题了')
      }
    },
    handleMark() {
      if (this.currentItem.isSign && this.currentItem.isSign == 1) {
        this.currentItem.isSign = 0
      } else {
        this.currentItem.isSign = 1
      }
      const item = { ...this.currentItem }
      item.value = this.$utils.stringToArray(item.value)
      putAction('/tExamPaper/tExamPaper/singleSubmit', item)
    },
    changeTag(item) {
      console.log(11, this.currentItem, item)
      this.submitItem()
      this.currentItem = item
    },
    formatSeconds(theTime) {
      return formatSeconds(theTime)
    },
    setInterval() {
      this.intervalId = setInterval(() => {
        if (this.remainTime > 0) {
          this.remainTime--
        } else {
          this.remainTime = 0
          this.handleSubmit(false)
          this.clearInterval()
        }
      }, 1000)
    },
    submitItem() {
      const item = { ...this.currentItem }
      item.value = this.$utils.stringToArray(item.value)
      if (item.value.length > 0) {
        putAction('/tExamPaper/tExamPaper/singleSubmit', item)
        // putAction('/tExamPaper/tExamPaper/singleSubmit', item).then(res => {
        //   if (!res.success) {
        //     this.$Jmodal.error({
        //       title: '系统提示',
        //       content: '提交失败',
        //       okText: '确认',
        //       mask: true,
        //       onOk: () => {}
        //     })
        //   }
        // }).catch(err => {
        //   this.$Jmodal.error({
        //     title: '请求失败',
        //     content: '请检查你的网络',
        //     okText: '确认',
        //     mask: true,
        //     onOk: () => {}
        //   })
        // })
      }
    },

    /**
     * 交卷
     * @param isPrompt  交卷时是否提示，  到时间未交卷时无需提示，直接交卷
     */
    handleSubmit(isPrompt = true) {
      const dataSource = JSON.parse(JSON.stringify(this.dataSource))
      dataSource.forEach(item => {
        item.value = this.$utils.stringToArray(item.value)
      })
      const isExitUnanswered = dataSource.find(i => {
        if (i.questionType !== 4) {
          return i.value.length === 0
        } else {
          return i.value.filter(v => !!v).length !== i.itemCount
        }
      }) // 是否有未答的题目
      const request = () => {
        const params = {
          ...this.data,
          questionList: dataSource
        }
        this.loading = true
        putAction('/tExamPaper/tExamPaper/submitPaper', params).then(res => {
          this.loading = false
          if (res.success) {
            if (res.result.isShowResult == 1) {
              this.$refs.endExamDetail.showModal(res.result || {})
            } else {
              this.$message.success('交卷成功')
              this.$router.push({
                path: '/zxks/zxks'
              })
            }
            this.clearInterval()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      if (isPrompt) {
        this.$confirm({
          title: '交卷',
          content: isExitUnanswered ? `有题目未填写，是否确认交卷` : '确认交卷',
          onOk: () => {
            request()
          }
        })
      } else {
        request()
      }
    },
    // 考前拍照上传
    capturePhoto() {
      if (!this.picUrl) {
        return
      }
      const params = {
        picUrl: this.picUrl,
        examId: this.examId,
        paperId: this.paperId,
        recordId: this.data.recordId
      }
      postAction('/tExamPaperUserBeforePic/tExamPaperUserBeforePic/add', params).then(res => {})
    },
    // 图片抓拍
    captureImage(base64Str) {
      const params = {
        base64Str: base64Str,
        examId: this.examId,
        paperId: this.paperId,
        recordId: this.data.recordId
      }
      postAction('/tExamPaperUserRecordPic/tExamPaperUserRecordPic/add', params).then(res => {})
    },
    // 全屏控制
    fullScreenConsole() {
      // eslint-disable-next-line eqeqeq
      if (this.model.isFullScreen == 1) {
        this.fullScreenInterval = setInterval(() => {
          if (this.hasFullSceenTip || isPageFullscreen()) {
            return
          }
          this.hasFullSceenTip = true
          this.$warning({
            title: '警告',
            content: '当前考试需全屏状态下考试',
            okText: '全屏模式',
            onOk: () => {
              this.$utils.fullscreen()
              this.hasFullSceenTip = false
            }
          })
          // this.hasFullSceenTip = false
        }, 1000)
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
  .warning {
    border: orange solid 1px;
    background-color: orange;
    color: white;
  }
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

      .mark {
        width: 8px;
        height: 8px;
        background: orange;
        position: relative;
        top: -13px;
        right: 7px;
        border-radius: 4px;
        /* border: solid #ffffff 1px; */
      }
    }
  }
}

/deep/ .ant-card-head {
  padding: 0 60px;
}

/deep/ .ant-card-body {
  padding: 24px 60px;
  overflow-y: auto;
  height: calc(100% - 60px);
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
