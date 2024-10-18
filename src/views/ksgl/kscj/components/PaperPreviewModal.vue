<template>
  <a-modal
    :class="$route.name==='ksgl-ksgl'?'detailModal':''"
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
      <div style="position: relative">
        <!--        <a-button type="primary" style="position: absolute;right: 24px;top: 10px" @click="downloadImage">试卷下载</a-button>-->
        <a-button v-if="roleShow" type="primary" style="position: absolute;right: 24px;top: 10px" @click="Print($refs.document)">试卷下载</a-button>
        <div ref="document" style="min-height: 80vh;background: white;padding: 24px">
          <div style="text-align: center;font-size: 20px;font-weight: 600">{{ data.name }}</div>
          <div style="text-align: right;font-weight: 600">考试时间：{{ data.examTime }}分钟</div>
          <div style="font-size: 20px;font-weight: 600">考试须知</div>
          <div style="margin-top: 10px;margin-bottom: 10px" v-html="formatExplain(data.examExplain)" />
          <div v-for="(item,itemIndex) in paper.bigList" :key="item.id">
            <div>
              <div style="font-weight: 600;font-size: 18px">
                <span>{{ $utils.getChineseNumber(itemIndex) }}、{{ item.name }}</span>
                <span style="margin-left: 3px">(共计{{ item.smallQuestionCount }}题目,总计{{ item.score }}分)</span>
              </div>
              <div v-for="(i,iIndex) in item.questionList" :key="i.id" style="margin: 20px 0">
                <div style="margin-bottom: 10px;display: flex;">{{ iIndex + 1 }}、<span class="rich-text-html" v-html="i.name" ></span></div>
                <div v-if="i.questionType!==3&&i.questionType!==4" style="display: flex;flex-wrap:wrap;padding: 0 20px">
                  <div v-for="(j,jIndex) in i.itemList" :key="j.id" style="width: 25%;padding:0 5px">
                    <span style="color: #666;display: flex;">{{ $utils.getABCD(jIndex) }}、<span class="rich-text-html" v-html="j.item" ></span></span>
                  </div>
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

export default {
  data() {
    return {
      title: '试卷预览',
      visible: false,
      data: {},
      paper: {},
      loading: false,
      roleShow: false,
      originalTitle: ''
    }
  },
  mounted() {
    // this.showModal()
    const role = this.$store.getters.userInfo.roles
    if (role.indexOf('admin') > -1 || role.indexOf('stadmin') > -1 || role.indexOf('dsgly') > -1) {
      this.roleShow = true
    }
  },
  methods: {
    // showModal(examId = '1665548219347161090') {
    showModal(examId) {
      this.originalTitle = document.title
      this.visible = true
      this.loading = true
      getAction('/tExamPaper/tExamPaper/getRandomExamPaper', { examId }).then(res => {
        this.loading = false
        if (res.success) {
          this.data = res.result
          this.paper = this.data.paper || {}
        } else {
          this.data = {}
          this.paper = {}
          this.$message.warning(res.message)
        }
      })
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

<style scoped lang='less'>
/deep/ .ant-modal-body{
  padding:0!important;
}
</style>
<style scoped media="print" lang="less">
@page {
  size: A4 portrait;
  margin: 0;
  padding: 0; /* 国家标准公文页边距 GB/T 9704-2012 */
}
</style>
