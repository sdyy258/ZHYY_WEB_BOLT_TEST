<template>
  <a-spin :spinning="loading" style="user-select:none;">
    <div style="width:100%;height: 50px;display: flex;justify-content: end;align-items: center;padding: 0 100px;">
      <a-button type="primary" @click="callBack">返回</a-button>
    </div>
    <div style="height:calc(100vh - 190px);background-color: #F0F2F5;overflow-x: hidden">
      <div style="height: 100%;padding: 0px 100px;display: flex">
        <div :span="20" style="height:100%;flex: 1">
          <a-card style="height:100%">
            <div style="position: relative;height: 100%;">
              <div style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;overflow-y: auto;">
                <div class="title">
                  <span v-if="type == 0">我的收藏</span>
                  <span v-else-if="type == 1">专项练习</span>
                  <span v-else-if="type == 2">随机练习</span>
                  <span v-else-if="type == 3">已做题目</span>
                  <span v-else-if="type == 4">错题练习</span>
                  <span v-else-if="type == 5">大比武错题练习</span>
                  <span v-else-if="type == 6">大比武练习</span>
                </div>
                <div class="content">
                  <div class="content-left">
                    <div class="topic-content">
                      <div v-if="data.questionType == 1" class="content-type">单</div>
                      <div v-else-if="data.questionType == 2" class="content-type">多</div>
                      <div v-else-if="data.questionType == 3" class="content-type">判</div>
                      <div v-else-if="data.questionType == 4" class="content-type">填</div>
                      <div v-else-if="data.questionType == 5" class="content-type">简</div>
                      <div v-else-if="data.questionType == 6" class="content-type">计</div>
                      <div v-else-if="data.questionType == 7" class="content-type">分</div>
                      <div v-else-if="data.questionType == 8" class="content-type">论</div>
                      <span
                        v-if="
                          (type == 0 || type == 4 || type == 3 || type == 5 || type == 6) &&
                            data.serialNumber &&
                            data.totalNumber
                        "
                        >{{ data.serialNumber + '/' + data.totalNumber }}、<span class="htmlStyle" v-html="data.name"
                      /></span>
                      <span v-else><span class="htmlStyle" v-html="data.name"/></span>
                    </div>
                    <!-- 单选 -->
                    <div v-if="data.questionType == 1" class="answer-sheet">
                      <a-radio-group
                        v-model="data.value"
                        class="radioGroup htmlStyle"
                        :disabled="data.analysisShow"
                        @change="isRight"
                      >
                        <a-radio v-for="i in data.itemList" :key="i.value" :value="i.value"
                          >{{ i._option }}、<span v-html="i.item"
                        /></a-radio>
                      </a-radio-group>
                    </div>
                    <!-- 多选 -->
                    <div v-else-if="data.questionType == 2" class="answer-sheet">
                      <a-checkbox-group
                        v-model="data.value"
                        :disabled="data.analysisShow"
                        class="checkboxGroup htmlStyle"
                        @change="$forceUpdate()"
                      >
                        <a-checkbox
                          v-for="i in data.itemList"
                          :key="i.value"
                          :value="i.value"
                          @change="checkBoxChange($event, i)"
                          >{{ i._option }}、<span v-html="i.item"
                        /></a-checkbox>
                      </a-checkbox-group>
                      <!-- <j-checkbox v-model="data.value" :options="data.itemList" :disabled="data.analysisShow" class="checkboxGroup" @change="$forceUpdate()" /> -->
                    </div>
                    <!-- 判断 -->
                    <div v-else-if="data.questionType == 3" class="answer-sheet">
                      <a-radio-group
                        v-model="data.value"
                        class="radioGroup htmlStyle"
                        :disabled="data.analysisShow"
                        @change="isRight"
                      >
                        <a-radio v-for="i in data.itemList" :key="i.value" :value="i.value"
                          ><span v-html="i.item"
                        /></a-radio>
                      </a-radio-group>
                    </div>
                    <!-- 填空 -->
                    <div v-else-if="data.questionType == 4">
                      <div v-for="i in data.itemCount" :key="i" style="display: flex;align-items: center">
                        <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
                        <j-editor
                          v-model="data.value[i - 1]"
                          :disabled="data.analysisShow"
                          toolbar="superscript subscript"
                          :height="100"
                          style="flex: 1;margin-bottom: 10px"
                          @change="$forceUpdate()"
                        />
                      </div>
                      <!-- <a-input
                    v-for="i in data.itemCount"
                    :key="i"
                    v-model="data.value[i-1]"
                    :disabled="data.analysisShow"
                    :addon-before="i"
                    :placeholder="`请输入第${i}个填空的答案`"
                    class="mb10"
                    @change="$forceUpdate()"
                  /> -->
                    </div>
                    <!-- 主观题 -->
                    <div
                      v-else-if="
                        data.questionType == 5 ||
                          data.questionType == 6 ||
                          data.questionType == 7 ||
                          data.questionType == 8
                      "
                    >
                      <div v-for="i in data.itemCount" :key="i" style="display: flex;align-items: center">
                        <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ i }}</div>
                        <j-editor
                          v-model="data.value"
                          :disabled="data.analysisShow"
                          toolbar="superscript subscript"
                          :height="100"
                          style="flex: 1;margin-bottom: 10px"
                          @change="$forceUpdate()"
                        />
                      </div>
                    </div>
                    <div v-if="data.questionType == 2 || data.questionType == 4">
                      <a-button type="primary" @click="isRight">确定</a-button>
                    </div>
                    <div
                      v-else-if="
                        data.questionType == 5 ||
                          data.questionType == 6 ||
                          data.questionType == 7 ||
                          data.questionType == 8
                      "
                    >
                      <a-button type="primary" @click="kgisRight">确定</a-button>
                    </div>
                    <div
                      v-if="
                        data.analysisShow &&
                          (data.questionType == 1 ||
                            data.questionType == 2 ||
                            data.questionType == 3 ||
                            data.questionType == 4)
                      "
                      class="answerStatus"
                    >
                      <div v-if="data.isError == 0">
                        <a-icon
                          type="check-circle"
                          theme="filled"
                          class="success"
                          style="font-size: 16px;margin-right: 5px;"
                        />
                        <span class="success">正确</span>
                      </div>
                      <div v-else>
                        <a-icon
                          type="close-circle"
                          theme="filled"
                          class="error"
                          style="font-size: 16px;margin-right: 5px;"
                        />
                        <span class="error">错误</span>
                      </div>
                    </div>
                    <div class="panel-bottom">
                      <div>
                        <button
                          :class="nextTopicShow ? 'unchange' : 'change'"
                          style="margin-right:30px"
                          @click="toPrev"
                        >
                          上一题
                        </button>
                        <button
                          :class="nextTopicShow ? 'change' : 'unchange'"
                          style="margin-right:30px"
                          @click="toNext"
                        >
                          下一题
                        </button>
                        <button
                          v-if="(type == 4 || type == 5) && !data.removeErrorShow"
                          class="remove"
                          @click="removeError(type)"
                        >
                          移出错题集
                        </button>
                      </div>
                      <div
                        style="margin-left: 30px;"
                        v-if="type == '0' || type == '4' || type == '5' || type == '3' || type == '6'"
                      >
                        <a-button
                          type="link"
                          style="font-size: 16px;font-weight: bold;margin-right: -5px;"
                          @click="jumpTo"
                        >
                          跳转</a-button
                        >
                        <a-input-number
                          :min="1"
                          style="font-size: 14px;font-weight: bold;"
                          v-model="jumpToNum"
                        ></a-input-number>
                        <span style="font-size: 16px;font-weight: bold;margin-left: 10px;">题</span>
                      </div>
                    </div>
                  </div>
                  <div class="content-right">
                    <div
                      class="collect"
                      :class="data.isStar == 1 ? 'select' : 'collect'"
                      style="margin-right:10px"
                      @click="collectClick"
                    >
                      <a-icon type="star" theme="filled" :style="{ color: data.isStar == 1 ? '#FFCE43' : '#AFAFAF' }" />
                      <span>收藏</span>
                    </div>
                    <div
                      class="collect"
                      :class="data.feedbackShow ? 'select' : 'collect'"
                      style="margin-right:10px"
                      @click=";(visible = true), (feedbackContent = data.feedbackContent || '')"
                    >
                      <a-icon
                        type="star"
                        theme="filled"
                        :style="{ color: data.feedbackShow ? '#FFCE43' : '#AFAFAF' }"
                      />
                      <span>反馈</span>
                    </div>
                    <div
                      class="collect"
                      v-if="type == 0 || type == 4 || type == 5"
                      :class="data.isRemark ? 'select' : 'collect'"
                      style="margin-right:10px"
                      @click=";(remarkVisible = true), (remark = data.remark || '')"
                    >
                      <a-icon type="star" theme="filled" :style="{ color: data.isRemark ? '#FFCE43' : '#AFAFAF' }" />
                      <span>个人备注</span>
                    </div>
                  </div>
                </div>
                <div v-if="data.analysisShow" class="questionAnalysis">
                  <div class="analysisTitle">
                    试题讲解
                  </div>
                  <div class="analysisContent">
                    <div class="analysisText">
                      正确答案：
                      <span v-for="(ans, a) in data.itemList" :key="a">
                        <span
                          v-if="
                            data.questionType == 4 ||
                              data.questionType == 5 ||
                              data.questionType == 6 ||
                              data.questionType == 7 ||
                              data.questionType == 8
                          "
                          style="white-space: break-spaces;margin-right: 10px;"
                          ><span class="htmlStyle" v-html="ans.item"
                        /></span>
                        <span
                          v-if="
                            !(
                              data.questionType == 4 ||
                              data.questionType == 5 ||
                              data.questionType == 6 ||
                              data.questionType == 7 ||
                              data.questionType == 8
                            ) && ans.isRight == 1
                          "
                          style="white-space: break-spaces;margin-right: 10px;"
                        >
                          <span v-if="data.questionType != 3"><span class="htmlStyle" v-html="ans.label"/></span>
                          <span v-else><span class="htmlStyle" v-html="ans.item"/></span>
                        </span>
                      </span>
                    </div>
                    <!-- <div class="analysisText">难度等级：<a-rate v-model="data.difficult" disabled /></div> -->
                    <div class="analysisText">
                      <span style="color:#E3C5A0"><span class="htmlStyle" v-html="data.analysis"/></span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="data.analysisShow && (type == 0 || type == 4 || type == 5)"
                  class="questionAnalysis"
                  style="margin-top: 10px;"
                >
                  <div class="analysisTitle">
                    个人备注：
                  </div>
                  <div class="analysisText">{{ data.remark }}</div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </div>
    <a-modal
      title="反馈"
      :width="400"
      :visible="visible"
      centered
      :confirm-loading="confirmLoading"
      @ok="feedbackOk"
      @cancel="handleCancel"
    >
      <a-textarea
        v-model="feedbackContent"
        placeholder="如有疑问，请填写问题进行反馈！"
        :auto-size="{ minRows: 4, maxRows: 6 }"
      />
    </a-modal>
    <a-modal
      title="备注"
      :width="400"
      :visible="remarkVisible"
      :destroy-on-close="true"
      centered
      :confirm-loading="confirmLoading"
      @ok="remarkOk"
      @cancel="remarkVisible = false"
    >
      <a-textarea
        v-model="remark"
        placeholder="请填写备注！"
        :auto-size="{ minRows: 4, maxRows: 6 }"
        :maxLength="500"
      />
    </a-modal>
  </a-spin>
</template>
<script>
import { getAction, postAction } from '@api/manage'

export default {
  data() {
    return {
      data: {},
      inter: null,
      loading: true,
      intervalId: null,
      nextTopicShow: true, // 上一题、下一题样式
      url: {
        list: '/tQuestion/tQuestion/random', // 随机题目
        // specialList: '/tQuestion/tQuestion/randomByType', // 专项练习
        specialList: '/tQuestion/tQuestion/randomByPost',
        collectList: '/tQuestion/tQuestion/randomByStar', // 收藏题目
        doneList: '/tQuestion/tQuestion/randomByRecord', // 已做题目
        errorList: '/tQuestion/tQuestion/randomByError', // 错题
        wrongList: '/tQuestion/tQuestion/randomByExamError', // 大比武错题
        bigList: '/tQuestion/tQuestion/randomByCategroy', // 大比武
        add: '/tQuestionStar/tQuestionStar/add', // 收藏
        cancel: '/tQuestionStar/tQuestionStar/cancel', // 取消收藏
        FeedbackAdd: '/tQuestionFeedback/tQuestionFeedback/add', // 反馈
        addPracticeRecord: '/tQuestionPracticeRecord/tQuestionPracticeRecord/addPracticeRecord', // 添加做题记录
        addPracticeRecordNew: '/tQuestionPracticeRecord/tQuestionPracticeRecord/addPracticeRecordNew', // 添加做题记录-已做题目
        addPracticeErrorRecord: '/tQuestionPracticeRecord/tQuestionPracticeRecord/addPracticeErrorRecord', // 添加做题记录-错题练习
        queryById: '/tQuestionPracticeRecord/tQuestionPracticeRecord/queryRecordById', // 查做题记录
        deleteErrorRecord: '/tQuestionPracticeRecord/tQuestionPracticeRecord/deleteErrorRecord', // 移出错题集
        deleteWrongRecord: '/tQuestionPracticeRecord/tQuestionPracticeRecord/deleteExamErrorRecord' // 移出大比武错题集
      },
      confirmLoading: false,
      visible: false,
      remarkVisible: false, // 个人备注modal
      previousQuestionId: [], // 题目id
      index: 0, // 题目索引值
      // startIndex: 0, //进入时题目索引值
      type: null,
      id: null, // 专项练习分类id
      cancleNum: 0, // 移除的错题数量/取消收藏得试题数量
      remark: '',
      feedbackContent: '',
      jumpToNum: 1
    }
  },
  created() {
    const { type, id } = this.$route.query
    this.type = type
    this.id = id
    if (this.type == 0 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 6) {
      this.getTopic(id, '', this.cancleNum)
    } else {
      this.getTopic(id, 1, this.cancleNum)
    }
    this.keyDown()
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  destroyed() {
    this.clearInterval()
  },
  methods: {
    checkBoxChange(e, item) {
      item.isChecked = e.target.checked
      this.data.itemList
      this.$forceUpdate()
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
    },
    // 获取题目
    getTopic(id, num, cancleNum) {
      let url = ''
      const params = {}
      params.serialNumber = num
      if (this.type == 0) {
        url = this.url.collectList
        params.cancleNum = cancleNum
      } else if (this.type == 1) {
        url = this.url.specialList
        // params.categoryId = id
        params.methodPrinciple = id
      } else if (this.type == 2) {
        url = this.url.list
      } else if (this.type == 3) {
        url = this.url.doneList
      } else if (this.type == 4) {
        url = this.url.errorList
        params.cancleNum = cancleNum
      } else if (this.type == 5) {
        url = this.url.wrongList
        params.categoryId = id
        params.cancleNum = cancleNum
      } else if (this.type == 6) {
        url = this.url.bigList
        params.categoryId = id
        params.cancleNum = cancleNum
      }
      getAction(url, params).then(res => {
        this.loading = false
        if (res.success) {
          this.data = res.result
          this.data.feedbackShow = false // 点击反馈
          this.data.analysisShow = false // 默认不显示分析
          // this.data.remarkShow = false // 默认不显示个人备注
          this.data.value = res.result.value || []
          if (this.data.itemList) {
            this.data.itemList.forEach((i, _index) => {
              i._option = this.$utils.getABCD(_index)
              i.value = i.itemId + '&&' + i._option
              i.label = i._option + '、' + i.item
            })
          }
          // if (this.data.questionType !== 4 && this.data.questionType !== 2 && this.data.questionType !== 5 && this.data.questionType !== 6 && this.data.questionType !== 7 && this.data.questionType !== 8) {
          if (this.data.questionType === 1 || this.data.questionType == 3) {
            this.data.value = this.$utils.arrayToString(this.data.value)
          }
          // 专项练习 循环到最后一个时 显示第一题
          if (this.type == 1) {
            if (num != this.data.serialNumber) {
              this.index = this.data.serialNumber - 1
              this.previousQuestionId = []
              // this.getTopic(this.id, this.index + 1, this.cancleNum)
            }
          }
          if (num == '' && num != 1) {
            this.index = this.data.serialNumber - 1
            // this.startIndex = this.data.serialNumber
          }
          this.remark = this.data.remark
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取上一题记录
    getPracticeRecord(id, num = '') {
      getAction(this.url.queryById, { id: id, serialNumber: num, type: this.type }).then(res => {
        if (res.result.questionJson) {
          this.data = JSON.parse(res.result.questionJson)
        }
      })
    },
    // 添加练习题做题记录
    addPractice() {
      this.loading = true
      let url = ''
      if (this.type == 3) {
        url = this.url.addPracticeRecordNew
      } else if (this.type == 4) {
        url = this.url.addPracticeErrorRecord
      } else {
        url = this.url.addPracticeRecord
      }
      const params = {
        questionJson: JSON.stringify(this.data),
        questionId: this.data.id,
        isError: this.data.isError === 0 ? 0 : 1
      }
      postAction(url, params).then(res => {
        this.loading = false
        if (res.success) {
          // 有做题记录的替换id，取最后一次id
          if (this.previousQuestionId[this.index]) {
            this.previousQuestionId.splice(this.index, 1, res.result.id)
          } else {
            // this.previousQuestionId.push(res.result.id)
            this.previousQuestionId[this.index] = res.result.id
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 判断对错
    isRight() {
      var that = this
      // isError =1 是错误，0是正确
      if (this.data.questionType !== 4) {
        if (this.data.questionType === 2) {
          for (let i = 0; i < this.data.itemList.length; i++) {
            if (this.data.itemList[i].isRight != 1 && this.data.itemList[i].isChecked) {
              this.$set(this.data, 'isError', 1)
              break
            } else if (this.data.itemList[i].isRight === 1 && !this.data.itemList[i].isChecked) {
              this.$set(this.data, 'isError', 1)
              break
            } else {
              this.$set(this.data, 'isError', 0)
            }
          }
        } else {
          const a = this.data.itemList
            .filter(item => item.isRight === 1)
            .map(res => {
              return res.itemId
            }) // 答案
          const array = this.$utils.stringToArray(that.data.value).map(i => {
            if (!i) {
              return ''
            } else {
              return i.split('&&')[0]
            }
          })
          const b = array.toString() // 用户选择的选项
          if (a.toString() === b) {
            this.$set(this.data, 'isError', 0)
          } else {
            this.$set(this.data, 'isError', 1)
          }
        }
      } else {
        // 获取填空题答案是否对错
        const array = []
        const obj = {
          id: this.data.id,
          itemList: this.data.value
        }
        array.push(obj)
        postAction('/tExamPaper/tExamPaper/judgeFillBlank', array).then(res => {
          if (res.result[this.data.id] == 1) {
            this.$set(this.data, 'isError', 0)
          } else {
            this.$set(this.data, 'isError', 1)
          }
        })
        // const answer = this.data.itemList.map(item => { return item.item })
        // if (answer.toString() === this.data.value.toString()) {
        //   this.data.isError = 0
        // } else {
        //   this.data.isError = 1
        // }
      }
      this.data.analysisShow = true
      this.addPractice()
      this.$forceUpdate()
    },
    // 客观题确认答案
    kgisRight() {
      this.data.analysisShow = true
      this.addPractice()
      this.$forceUpdate()
    },
    // 上一题
    toPrev() {
      this.$utils.debounce(() => {
        console.log(this.index)
        if (this.index > 0) {
          this.index--
        } else {
          this.$message.warning('已为第一题，不能再点击！')
          return
        }
        console.log(this.previousQuestionId)
        if (this.type == 0 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 6) {
          this.nextTopicShow = false
          if (!this.previousQuestionId[this.index]) {
            this.getTopic(this.id, this.index + 1, this.cancleNum)
          } else {
            this.getPracticeRecord(this.previousQuestionId[this.index], this.index + 1)
          }
        } else {
          if (!this.previousQuestionId) {
            this.$message.warning('已为第一题，不能再点击！')
            return
          } else {
            this.nextTopicShow = false
            this.getPracticeRecord(this.previousQuestionId[this.index])
          }
        }
      })
    },
    // 下一题
    toNext() {
      this.$utils.debounce(() => {
        if (!this.data.analysisShow) {
          this.$message.warning('请先答题，再点击下一题！')
          return
        }
        if (
          (this.type == 0 || this.type == 4 || this.type == 3 || this.type == 5 || this.type == 6) &&
          this.data.serialNumber === this.data.totalNumber
        ) {
          this.$message.warning('已为最后一题，不能再点击！')
          return
        }
        this.index++
        this.nextTopicShow = true
        // 有做题记录的不再走添加做题记录接口
        if (!this.previousQuestionId[this.index - 1]) {
          this.addPractice()
        }
        // 有做题记录的获取做题记录，否则获取随机题目
        if (this.previousQuestionId[this.index]) {
          if (this.type == 0 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 6) {
            this.getPracticeRecord(this.previousQuestionId[this.index], this.index + 1)
          } else {
            this.getPracticeRecord(this.previousQuestionId[this.index])
          }
        } else {
          this.getTopic(this.id, this.index + 1, this.cancleNum)
        }
      })
    },
    // 移出错题集
    removeError(type) {
      const that = this
      this.$confirm({
        title: '温馨提示',
        content: '是否确认移出错题集？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.loading = true
          let url = ''
          if (type == 4) {
            url = that.url.deleteErrorRecord
          } else if (type == 5) {
            url = that.url.deleteWrongRecord
          }
          postAction(url, { questionId: that.data.id }).then(res => {
            that.loading = false
            if (res.success) {
              that.cancleNum++
              that.data.removeErrorShow = true
              that.addPractice()
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 跳转
    jumpTo() {
      if (!this.jumpToNum) {
        return
      }
      if (
        (this.type == 0 || this.type == 4 || this.type == 3 || this.type == 5 || this.type == 6) &&
        this.jumpToNum > this.data.totalNumber
      ) {
        this.$message.warning('题目数量不足，请重新输入！')
        return
      }
      this.index = this.jumpToNum - 1
      if (this.previousQuestionId[this.index]) {
        if (this.type == 0 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 6) {
          this.getPracticeRecord(this.previousQuestionId[this.index], this.index + 1)
        } else {
          this.getPracticeRecord(this.previousQuestionId[this.index])
        }
      } else {
        this.getTopic(this.id, this.index + 1, this.cancleNum)
      }
    },
    // 收藏
    collectClick() {
      if (this.data.isStar === 0) {
        this.data.isStar = 1
      } else {
        this.data.isStar = 0
      }
      let url = ''
      if (this.data.isStar === 1) {
        url = this.url.add
      } else {
        url = this.url.cancel
      }
      this.loading = true
      postAction(url, { questionId: this.data.id, isStar: this.data.isStar }).then(res => {
        this.loading = false
        if (res.success) {
          if (this.type == 0 && this.data.isStar === 0) {
            this.cancleNum++
            this.addPractice()
          }
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 反馈
    feedbackOk() {
      if (!this.feedbackContent) {
        this.$message.warning('请先填写反馈问题！')
        return
      }
      this.data.feedbackShow = true
      this.loading = true
      this.data.feedbackContent = this.feedbackContent
      const params = {
        feedbackContent: this.data.feedbackContent,
        feedbackSourse: 1,
        questionId: this.data.id
      }
      postAction(this.url.FeedbackAdd, params).then(res => {
        this.loading = false
        if (res.success) {
          this.visible = false
          this.addPractice()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 备注
    remarkOk() {
      let url = ''
      if (this.type == 0) {
        url = '/tQuestionStar/tQuestionStar/remark'
      } else if (this.type == 4) {
        url = '/tQuestionPracticeRecord/tQuestionPracticeRecord/remark'
      } else if (this.type == 5) {
        url = '/tExamPaperQuestionUserRecord/tExamPaperQuestionUserRecord/remark'
      }
      if (!this.remark) {
        this.$message.warning('请先填写备注！')
        return
      }
      // this.data.isRemark = !this.data.isRemark
      this.loading = true
      const params = {
        remark: this.remark,
        isRemark: 1,
        questionId: this.data.id
      }
      postAction(url, params).then(res => {
        this.loading = false
        if (res.success) {
          this.remarkVisible = false
          this.data.remark = this.remark
          this.data.isRemark = 1
          this.addPractice()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 返回
    callBack() {
      this.$router.push({
        path: '/yxy/stlx'
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
<style scoped lang="less">
.title {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;
}
.content {
  display: flex;
  .content-left {
    width: 80%;
    .topic-content {
      padding-bottom: 15px;
      font-size: 16px;
      color: #333333;
      display: flex;
      .content-type {
        width: 25px;
        height: 25px;
        padding: 5px;
        border-radius: 4px;
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
  }

  .checkboxGroup {
    display: flex;
    flex-direction: column;
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
  .jump {
    width: 50px;
    height: 40px;
    background-color: #0080ff;
    color: #ffffff;
    border: none;
    cursor: pointer;
    margin-right: 10px;
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
