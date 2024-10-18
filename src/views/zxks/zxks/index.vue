<template>
  <div>
    <a-tabs type="card" :active-key="tabKey" @change="tabChange">
      <a-tab-pane key="5" tab="全部">
        <AllExamDeatil ref="allExamDeatil" />
      </a-tab-pane>
      <a-tab-pane key="1" tab="考试报名">
        <exam-registration-detail ref="examRegistrationDetail" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="在线考试">
        <online-exam-detail ref="onlineExamDetail" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="历史考试">
        <history-exam-detail ref="historyExamDetail" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="缺考列表">
        <miss-exam-detail ref="missExamDetail" />
      </a-tab-pane>
      <!-- <a-tab-pane key="4" tab="错题本">
        <wrong-question-detail ref="wrongQuestionDetail" />
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>
<script>
import ExamRegistrationDetail from './modules/ExamRegistrationDetail.vue'
import HistoryExamDetail from './modules/HistoryExamDetail.vue'
import MissExamDetail from './modules/MissExamDetail.vue'
import OnlineExamDetail from './modules/OnlineExamDetail'
import AllExamDeatil from './modules/AllExamDeatil'
// import WrongQuestionDetail from './modules/WrongQuestionDetail.vue'

export default {
  components: { OnlineExamDetail, ExamRegistrationDetail, HistoryExamDetail, MissExamDetail, AllExamDeatil },
  data() {
    return {
      tabKey: '5',
      tabOption: []
    }
  },
  created() {
    const m = this.$route.query
    if (m[0]) {
      this.tabKey = m[0]
      if (m[0] == '2') {
        this.$nextTick(() => {
          this.$refs.onlineExamDetail.loadData()
        })
      } else if (m[0] == '3') {
        this.$nextTick(() => {
          this.$refs.historyExamDetail.loadData()
        })
      }
    }
  },
  methods: {
    tabChange(e) {
      this.tabKey = e
      if (e === '1') {
        this.$nextTick(() => {
          this.$refs.examRegistrationDetail.loadData()
        })
      } else if (e === '2') {
        this.$nextTick(() => {
          this.$refs.onlineExamDetail.loadData()
        })
      } else if (e === '3') {
        this.$nextTick(() => {
          this.$refs.historyExamDetail.loadData()
        })
      } else if (e === '4') {
        this.$nextTick(() => {
          this.$refs.missExamDetail.loadData()
        })
      } else if (e === '5') {
        this.$nextTick(() => {
          this.$refs.allExamDeatil.loadData()
        })
      }
      //  else if (e === '4') {
      //   this.$nextTick(() => {
      //     this.$refs.wrongQuestionDetail.loadData()
      //   })
      // }
    }
  }
}
</script>
