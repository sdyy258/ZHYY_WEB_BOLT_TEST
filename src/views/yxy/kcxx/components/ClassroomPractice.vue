<template>
  <a-spin :spinning="loading">
    <div class="cu-list">
      <a-card v-for="(i,index) in dataSource" :key="i.questionId" class="cu-item" :class="isAnswer?'events-disabled':''">
        <div style="display: flex;align-items: center">
          <img :src="icon['questionIcon'+i.questionType]">
          <img v-if="i.difficult" :src="icon['difficult'+i.difficult]" class="ml5">
          <!--          <div style="flex: 1;margin-left: 5px">{{ index + 1 }}、{{ i.questionStem }}</div>-->
          <div style="flex: 1;margin-left: 5px;display: flex">
            <span>{{ index + 1 }}、</span>
            <span class="rich-text-html" v-html="i.questionStem" />
          </div>
        </div>
        <div style="margin-top: 20px;padding-left: 20px">
          <!-- 单选 -->
          <div v-if="i.questionType == 1">
            <a-radio-group v-model="i.value">
              <a-radio v-for="i in i.questionItemList" :key="i.value" :value="i.value" style="display: flex"><span class="rich-text-html" v-html="i.label" /></a-radio>
            </a-radio-group>
          </div>
          <!-- 多选 -->
          <div v-else-if="i.questionType == 2">
            <j-checkbox v-model="i.value" is-rich-text :options="i.questionItemList" />
          </div>
          <!-- 判断 -->
          <div v-else-if="i.questionType == 3">
            <a-radio-group v-model="i.value">
              <a-radio v-for="i in i.questionItemList" :key="i.value" :value="i.value" style="display: flex"><span class="rich-text-html" v-html="i.item" /></a-radio>
            </a-radio-group>
          </div>
          <!-- 填空 -->
          <div v-else-if="i.questionType == 4">
            <template v-if="!isAnswer">
              <div v-for="j in i.itemCount" :key="j" style="display: flex;align-items: center">
                <div style="width: 30px;font-size: 20px;font-weight: 600;">{{ j }}</div>
                <j-editor v-model="i.value[j-1]" toolbar="superscript subscript" :height="100" style="flex: 1;margin-bottom: 10px" />
              </div>
            </template>
            <template v-else>
              <div v-for="j in i.itemCount" :key="j" style="display: flex">
                <div style="margin-right: 10px">{{ j }}：</div>
                <div v-html="i.value[j-1]" />
              </div>
            </template>
            <!--            <a-input-->
            <!--              v-for="j in i.itemCount"-->
            <!--              :key="j"-->
            <!--              v-model.trim="i.value[j-1]"-->
            <!--              :addon-before="j"-->
            <!--              :placeholder="`请输入第${j}个填空的答案`"-->
            <!--              class="mb10"-->
            <!--            />-->
          </div>
        </div>
        <template v-if="isAnswer">
          <!--          <div class="answer">-->
          <!--            <span>答案：</span>-->
          <!--            <template v-if="i.questionType===1||i.questionType===2">-->
          <!--              <span>{{ i.answer && i.answer.toString() }}</span>-->
          <!--            </template>-->
          <!--            <template v-if="i.questionType===3">-->
          <!--              <span>{{ (i.answer && i.answer.toString()) === 'A' ? '正确' : '错误' }}</span>-->
          <!--            </template>-->
          <!--            <template v-if="i.questionType===4">-->
          <!--              <div v-for="(a,aIndex) in i.answer" :key="aIndex" style="padding-left: 50px">{{ a }}</div>-->
          <!--            </template>-->
          <!--          </div>-->
          <div style="position: absolute;right: 80px;top: 30px">
            <img :src="isRight(i)?icon.rightIcon:icon.errorIcon">
          </div>
        </template>
      </a-card>
    </div>
    <template>
      <div v-if="dataSource.length>0" style="display: flex;justify-content: flex-end">
        <a-button v-if="!isAnswer" type="primary" @click="handleSubmit">提 交</a-button>
        <a-button v-else type="primary" @click="isAnswer=false">重新答题</a-button>
      </div>
      <a-empty v-else />
    </template>
  </a-spin>
</template>

<script>
import { getAction, postAction } from '@api/manage'

export default {
  name: 'ClassroomPractice',
  props: {
    questionList: {
      type: Array,
      default: () => []
    },
    courseId: {
      type: String,
      required: true
    },
    courseCoursewareId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      dataSource: [],
      allData: [],
      isAnswer: false, // 查看答案界面
      icon: {
        questionIcon1: require('@/assets/danxuan.png'),
        questionIcon2: require('@/assets/duoxuan.png'),
        questionIcon3: require('@/assets/panduan.png'),
        questionIcon4: require('@/assets/tiankong.png'),
        difficult1: require('@/assets/jiandan.png'),
        difficult2: require('@/assets/zhongdeng.png'),
        difficult3: require('@/assets/kunnan.png'),
        rightIcon: require('@/assets/right.png'),
        errorIcon: require('@/assets/error.png')
      },
      fillBlanksIsRight: {}// 填空题对错集合
    }
  },
  created() {
    this.searchQuery()
  },
  methods: {
    searchQuery() {
      this.loading = true
      getAction('/cCourseUser/cCourseUser/queryByQuestionId', { courseCoursewareId: this.courseCoursewareId }).then(res => {
        this.loading = false
        const { isQuestionCompleted, paperJson } = res.result
        this.isAnswer = isQuestionCompleted === 1
        this.dataSource = paperJson.map(i => JSON.parse(i))
        this.dataSource.forEach((item, index) => {
          item._order = index + 1
          item.value = item.value || []
          if (item.questionItemList) {
            item.questionItemList.forEach((i, _index) => {
              i._option = this.$utils.getABCD(_index)
              i.value = i.id + '&&' + i._option
              i.label = i._option + '、' + i.item
            })
          }
          if (item.questionType !== 4) {
            item.value = this.$utils.arrayToString(item.value)
          }
          // 已答题时回显答案
          if (this.isAnswer) {
            if (item.questionType !== 4) {
              const array = item.rightList.map(right => {
                const questionItem = item.questionItemList.find(i => i.id === right.id)
                return questionItem._option
              })
              item.answer = array
            } else {
              item.answer = item.rightItemList
            }
          }
        })
        // 获取填空题答案是否对错
        if (this.isAnswer) {
          const array = this.dataSource.filter(i => i.questionType === 4).map(i => ({ id: i.questionId, itemList: i.value }))
          if (array.length > 0) {
            postAction('/tExamPaper/tExamPaper/judgeFillBlank', array).then(res => {
              this.fillBlanksIsRight = res.result || {}
              console.log('fillBlanksIsRight', this.fillBlanksIsRight)
            })
          } else {
            this.fillBlanksIsRight = {}
          }
        } else {
          this.fillBlanksIsRight = {}
        }
      })
    },
    // 判断对错
    isRight(data) {
      try {
        let isTrue
        const item = Object.assign({}, data)
        if (item.questionType !== 4) {
          // 如果没选答案
          if (!item.value) {
            isTrue = false
            return isTrue
          }
          if (item.questionType == 2) {
            const array = this.$utils.stringToArray(item.value).map(i => {
              if (!i) {
                return ''
              } else {
                return i.split('&&')[0]
              }
            })
            if (array.length < item.rightList.length) {
              // 多选题少选
              isTrue = false
            } else {
              for (const i in item.rightList) {
                for (const j in array) {
                  if (item.rightList[i].id === array[j]) {
                    array.splice(j, 1)
                  }
                }
              }
              if (array.length === 0) {
                isTrue = true
              } else {
                isTrue = false
              }
            }
          } else {
            const a = item.answer.toString()// 答案
            const array = this.$utils.stringToArray(item.value).map(i => {
              if (!i) {
                return ''
              } else {
                return i.split('&&')[1]
              }
            })
            const b = array.toString()// 用户选择的选项
            if (a === b) {
              isTrue = true
            } else {
              isTrue = false
            }
          }
          return isTrue
        } else {
          // return item.answer.toString() === item.value.toString()
          return this.fillBlanksIsRight[item.questionId] === 1
        }
      } catch (e) {
        console.log('isRightMethodError', e)
        return false
      }
    },
    handleSubmit() {
      const dataSource = JSON.parse(JSON.stringify(this.dataSource))
      dataSource.forEach(item => {
        const userSelectList = []
        item.value = this.$utils.stringToArray(item.value)
        item.value.forEach(i => {
          if (item.questionType === 4) {
            userSelectList.push({
              content: i,
              id: '',
              option: ''
            })
          } else {
            userSelectList.push({
              content: '',
              id: i.split('&&')[0],
              option: i.split('&&')[1]
            })
          }
        })
        item.userSelectList = userSelectList
      })
      const isExitUnanswered = dataSource.find(i => i.value.length === 0)// 是否有未答的题目
      this.$confirm({
        title: '提交',
        content: isExitUnanswered ? `有题目未填写，是否确认提交` : '确认提交',
        onOk: () => {
          const params = {
            courseId: this.courseId,
            courseCoursewareId: this.courseCoursewareId,
            paperJson: dataSource.map(i => JSON.stringify(i))
          }
          this.loading = true
          postAction('/cCourseUser/cCourseUser/add', params).then(res => {
            this.searchQuery()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.cu-list {
  .cu-item {
    margin-bottom: 15px;
    position: relative;
  }

  .answer {
    margin-top: 20px;
  }

  .events-disabled {
    background: #f2f2f2;
  }
}
</style>
