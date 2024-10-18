<template>
  <a-modal
    :class="$route.name === 'ksgl-ksgl' ? 'detailModal' : ''"
    :width="1000"
    :centered="true"
    :title="title"
    :visible="visible"
    :mask-closable="false"
    cancel-text="关闭"
    style="user-select:none;"
    @ok="handleOK"
    @cancel="handleClose"
  >
    <a-spin :spinning="loading">
      <div style="position: relative;min-height: 80vh">
        <!--        <a-button type="primary" style="position: absolute;right: 24px;top: 10px" @click="downloadImage">试卷下载</a-button>-->
        <div style="display: flex;align-items: flex-end;padding-top: 10px;padding-left: 20px;">
          <div v-if="!isFixedTopic" style="margin-right: 20px">
            <div style="font-weight: 600;font-size: 16px;margin-right: 5px">试卷数量：</div>
            <a-input-number v-model="count" placeholder="请输入试卷数量" :min="0" :precision="0" style="width: 100px" />
            <a-button type="primary" style="margin-left: 8px" @click="searchQuery">查看</a-button>
          </div>
          <a-radio-group v-model="showAnswer" button-style="solid">
            <a-radio-button :value="false">隐藏答案</a-radio-button>
            <a-radio-button :value="true">显示答案</a-radio-button>
          </a-radio-group>
        </div>
        <a-button
          v-if="roleShow"
          type="primary"
          style="position: absolute;right: 24px;top: 10px"
          @click="Print($refs.document)"
          >试卷下载</a-button
        >
        <div ref="document">
          <div
            v-for="(paper, paperIndex) in paperList"
            :key="paperIndex"
            class="pageItem"
            style="background: white;padding: 24px; page-break-after: always;"
          >
            <div style="text-align: center;font-size: 20px;font-weight: 600">{{ data.name }}</div>
            <div style="text-align: right;font-weight: 600">考试时间：{{ data.examTime }}分钟</div>
            <div style="font-size: 20px;font-weight: 600">考试须知</div>
            <div style="margin-top: 10px;margin-bottom: 10px" v-html="formatExplain(data.examExplain)" />
            <div v-for="(item, itemIndex) in paper.bigList" :key="item.id">
              <div>
                <div style="font-weight: 600;font-size: 18px">
                  <span>{{ $utils.getChineseNumber(itemIndex) }}、{{ item.name }}</span>
                  <span style="margin-left: 3px">(共计{{ item.smallQuestionCount }}题目,总计{{ item.score }}分)</span>
                </div>
                <div v-for="(i, iIndex) in item.questionList" :key="i.id" style="margin: 20px 0">
                  <!--题干-->
                  <!--                  <div style="margin-bottom: 10px;display: flex;">{{ iIndex + 1 }}、<span class="rich-text-html" v-html="i.name" /></div>-->
                  <div style="margin-bottom: 10px;">
                    {{ iIndex + 1 }}、<span v-html="i.name" /><span>({{ i.score || 0 }}分)</span>
                  </div>
                  <!--单选多选添加选项-->
                  <div
                    v-if="i.questionType == 1 || i.questionType == 2"
                    style="display: flex;flex-wrap:wrap;padding: 0 20px"
                  >
                    <div v-for="(j, jIndex) in i.itemList" :key="j.id" style="width: 25%;padding:0 5px">
                      <span style="color: #666;display: flex;"
                        >{{ $utils.getABCD(jIndex) }}、 <span class="rich-text-html" v-html="j.item"
                      /></span>
                    </div>
                  </div>
                  <!--简单、计算、分析、论述添加空白距离-->
                  <template v-if="!showAnswer">
                    <div
                      v-if="i.questionType === 5 || i.questionType == 6 || i.questionType == 7 || i.questionType == 8"
                      style="padding-top: 150px"
                    />
                  </template>
                  <!--添加答案-->
                  <template v-if="showAnswer">
                    <div style="padding: 2px 4px;margin: 4px;border: 1px dashed #333;border-radius: 4px">
                      <span>答案：</span>
                      <span style="margin-left: 5px" v-html="getQuestionAnswer(i.questionType, i.itemList)" />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { getAction } from '@api/manage'
import html2canvas from 'html2canvas'
import Print from '@/utils/print'
import TenantModal from '@views/system/modules/TenantModal'

export default {
  components: { TenantModal },
  data() {
    return {
      title: '试卷预览',
      visible: false,
      data: {},
      // paper: {},
      paperList: [],
      loading: false,
      roleShow: false,
      examId: '',
      count: 1,
      originalTitle: '',
      isFixedTopic: false, // 是否固定选题
      showAnswer: false // 是否展示参考答案
    }
  },
  mounted() {
    // this.showModal('1763412808441004034')
    const role = this.$store.getters.userInfo.roles
    if (role.indexOf('admin') > -1 || role.indexOf('stadmin') > -1 || role.indexOf('dfzj') > -1) {
      this.roleShow = true
    }
  },
  methods: {
    /**
     * @param examId
     * @param options ={isFixedTopic:是否固定选题}
     */
    showModal(examId, options = { isFixedTopic: false }) {
      this.originalTitle = document.title
      this.examId = examId
      this.count = 1
      this.visible = true
      this.isFixedTopic = options.isFixedTopic
      this.showAnswer = false
      this.data = {}
      this.paperList = []
      if (this.isFixedTopic) {
        this.getFixedExamPaper()
      } else {
        this.searchQuery()
      }
    },
    // 获取随机抽提
    searchQuery() {
      this.loading = true
      this.getAction('/tExamPaper/tExamPaper/getRandomExamPaperBatch', { examId: this.examId, count: this.count }).then(
        res => {
          if (res.success) {
            this.loading = false
            this.data = res.result[0]
            this.paperList = res.result.map(item => item.paper)
          } else {
            this.$message.warning(res.message)
          }
        }
      )
    },
    // 获取固定选题
    getFixedExamPaper() {
      this.loading = true
      this.getAction('/tExamPaper/tExamPaper/standardAnswer', { examId: this.examId }).then(res => {
        this.loading = false
        if (res.success) {
          this.data = JSON.parse(res.result)
          this.paperList = [this.data]
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取题目答案
    getQuestionAnswer(questionType, itemList) {
      const list = itemList ? JSON.parse(JSON.stringify(itemList)) : []
      // 单选题，多选题
      if (questionType === 1 || questionType === 2) {
        const array = []
        list.forEach((i, index) => {
          if (i.isRight === 1) {
            const answer = this.$utils.getABCD(index)
            array.push(answer)
          }
        })
        return array.toString()
      }
      // 判断题
      if (questionType === 3) {
        return list
          .filter(i => i.isRight === 1)
          .map(i => i.item)
          .toString()
      }
      // 填空题
      if (questionType === 4) {
        return list.map(i => i.item).join('， ')
      }
      // 简单、计算、分析、论述
      if (questionType === 5 || questionType === 6 || questionType === 7 || questionType === 8) {
        return list.map(i => i.item).toString()
      }
    },
    formatExplain(val) {
      if (!val) {
        return ''
      } else {
        return val.replaceAll('\\n', '<br/>')
      }
    },
    Print(element) {
      document.title = this.data.name
      Print(element)
    },
    downloadImage() {
      const element = this.$refs.document
      html2canvas(element, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        backgroundColor: null
      }).then(canvas => {
        this.$utils.canvasToBlob(canvas, this.data.name)
        // const a = document.createElement('a')
        // a.href = canvas.toDataURL('image/png')
        // a.download = this.data.name
        // a.click()
      })
    },
    handleOK() {
      this.$router.push({
        name: 'ksgl-ksgl',
        query: { queryType: true }
      })
      this.handleClose()
    },
    handleClose() {
      document.title = this.originalTitle
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
  padding: 0 !important;
}
</style>
<style scoped media="print" lang="less">
@page {
  size: A4 portrait;
  margin: 0;
  padding: 0;
}

@media print {
  .pageItem {
    page-break-after: always;
  }
}
</style>
