<template>
  <div>
    <div v-if="dataSource.length > 0">
      <div class="item">
        <div v-for="(item, index) in dataSource" :key="index" style="width: 20%;display: flex;justify-content: center;">
          <div class="item-exam animate">
            <div v-if="item.type == 1">
              <div class="corner"><span style="transform: scale(0.9);">未报名</span></div>
            </div>
            <div v-if="item.type == 3">
              <div v-if="item.isShowResult == 1 && item.result != null" :class="item.result == 1 ? 'pass' : 'unpass'">
                <span class="passValue">{{ item.result == 1 ? '及格' : '不及格' }}</span>
              </div>
            </div>
            <div class="item-img">
              <img :src="item.pictureUrl" alt />
            </div>

            <div class="item-title" :title="item.name">{{ item.name }}</div>
            <div class="item-concent">
              <div v-if="item.type == 3 && item.isShowResult == 1" class="item-row item-end-time" :title="item.score">
                <span>
                  分数：
                  <span style="color:#FF4B50">{{ item.score }}</span>
                </span>
              </div>
              <div class="item-row item-end-time" v-if="item.type == 1" :title="item.enrollStartTime">
                <span>报名开始时间：{{ item.enrollStartTime }}</span>
              </div>
              <div class="item-row item-end-time" v-if="item.type == 1" :title="item.enrollEndTime">
                <span>报名结束时间：{{ item.enrollEndTime }}</span>
              </div>
              <div class="item-row item-end-time" :title="item.limitStartTime">
                <span>考试开始时间：{{ item.limitStartTime }}</span>
              </div>
              <div class="item-row item-end-time" :title="item.limitEndTime">
                <span>考试结束时间：{{ item.limitEndTime }}</span>
              </div>
              <div class="item-row item-row-time" v-if="item.type != 3" :title="item.examTime">
                <span>考试时长：{{ item.examTime }}分钟</span>
              </div>
              <div class="item-row item-end-time" v-if="item.type == 3" :title="item.tookTime">
                <span>耗时(分钟)：{{ item.tookTime }}</span>
              </div>
            </div>
            <!-- type 1 考试报名 type 2 开始考试 type 3 历史考试 -->
            <!-- 查看按钮：存在历史考试中，type 3； 复合考试时：isOnline==0，如果isOnlineNew==0线下考试时不显示查看，如果isOnlineNew==1线上考试则判断isShowResult==1，显示查看按钮 -->
            <div class="item-footer" v-if="item.isOnline == 0">
              <a-button v-if="item.type == 1" type="primary" @click="application(item)">考试报名</a-button>
              <a-button type="primary" v-if="item.type == 2" @click="examStart(item)">开始考试</a-button>
              <template v-if="item.type == 3">
                <a-button
                  v-if="item.isOnlineNew == 0"
                  type="primary"
                  style="background-color: #ccc;border-color:#ccc"
                  color="rgba(0, 0, 0, 0.25);"
                  @click="$message.warning('线下考试,无需线上答题')"
                  >线下考试</a-button
                >
                <a-button
                  v-if="item.isOnlineNew == 1 && item.isShowResult == 1"
                  type="primary"
                  @click="historyQuestionView(item)"
                  v-else
                  >查看</a-button
                >
              </template>
              <!-- <a-button
                v-if="item.type == 3 && item.isOnlineNew == 0"
                type="primary"
                style="background-color: #ccc;border-color:#ccc"
                color="rgba(0, 0, 0, 0.25);"
                @click="$message.warning('线下考试,无需线上答题')"
                >线下考试</a-button
              >
              <a-button
                v-if="item.type == 3 && item.isOnlineNew == 1 && item.isShowResult == 1"
                type="primary"
                @click="historyQuestionView(item)"
                v-else
                >查看</a-button
              > -->
            </div>
            <!-- 查看按钮：存在历史考试中，type 3； 正常考试时：判断isShowResult==1，显示查看按钮 -->
            <div class="item-footer" v-else>
              <a-button v-if="item.type == 1" type="primary" @click="application(item)">考试报名</a-button>
              <a-button type="primary" v-if="item.type == 2" @click="examStart(item)">开始考试</a-button>
              <a-button
                type="primary"
                v-if="item.type == 3 && item.isShowResult == 1"
                @click="historyQuestionView(item)"
                >查看</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <a-empty />
    </div>
    <Pagination
      v-show="ipagination.total > 0"
      :total="ipagination.total"
      :current.sync="ipagination.current"
      :page-size.sync="ipagination.pageSize"
      :page-size-options="ipagination.pageSizeOptions"
      style="margin-right: 35px;"
      @change="loadData"
    />
    <a-modal
      v-model="modalVisible"
      title="报名确认"
      ok-text="确认"
      cancel-text="取消"
      :confirm-loading="confirmLoading"
      centered
      width="400px"
      @ok="handleOk"
    >
      <div style="text-align: left;margin-left: 5px;">
        <p>考试名称：{{ model.name }}</p>
        <p>报名开始时间：{{ model.enrollStartTime }}</p>
        <p>报名结束时间：{{ model.enrollEndTime }}</p>
        <p>考试开始时间：{{ model.limitStartTime }}</p>
        <p>考试结束时间：{{ model.limitEndTime }}</p>
        <p>考试须知：{{ model.examExplain }}</p>
      </div>
    </a-modal>
    <exam-instruction-detail ref="examInstructionDetail" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@/api/manage'
import Pagination from '@/components/oems/Pagination'
import ExamInstructionDetail from '../ExamInstructionDetail.vue'
export default {
  components: { Pagination, ExamInstructionDetail },
  mixins: [JeecgListMixin],
  data() {
    return {
      examId: '',
      modalVisible: false,
      confirmLoading: false,
      url: {
        list: '/tExam/tExam/allExamPage'
      },
      model: {}
    }
  },
  methods: {
    // 考试报名
    application(item) {
      this.examId = item.id
      this.model = item
      this.modalVisible = true
      this.loadData()
    },
    // 报名确认
    handleOk(e) {
      const that = this
      this.$confirm({
        title: '报名',
        content: '请确认是否报名！',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const param = {
            examId: that.examId,
            type: 1
          }
          that.confirmLoading = true
          postAction('/tExamPaperUser/tExamPaperUser/enroll', param)
            .then(res => {
              if (res.success) {
                let secondsToGo = 2
                const modal = that.$success({
                  title: '报名成功',
                  content: ` ${secondsToGo} 秒后自动关闭`
                })
                const interval = setInterval(() => {
                  secondsToGo -= 1
                  modal.update({
                    content: `${secondsToGo} 秒后自动关闭`
                  })
                }, 1000)
                setTimeout(() => {
                  clearInterval(interval)
                  modal.destroy()
                }, secondsToGo * 1000)
                that.loadData()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.modalVisible = false
              that.confirmLoading = false
            })
        }
      })
    },
    // 开始考试
    examStart(item) {
      this.getAction('/tExam/tExam/examInstructions', { examId: item.id }).then(res => {
        if (res.success) {
          this.$refs.examInstructionDetail.showModal(item, res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 历史考试查看
    historyQuestionView(item) {
      const params = {
        recordId: item.recordId,
        name: item.name
      }
      this.$router.push({
        path: '/zxks/historyDetail',
        query: { ...params }
      })
    }
  }
}
</script>
<style scoped lang="less">
.item {
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .item-exam {
    width: 90%;
    // height: 380px;
    // margin-right: 25px;
    margin-bottom: 25px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgb(58 62 81 / 20%);
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    .corner {
      background: #1890ff;
      color: white;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      line-height: 2;
      text-align: center;
      position: absolute;
      top: -50px;
      right: -50px;
      transform: rotate(45deg);
    }
    .success {
      background: #f08a20;
      color: white;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      line-height: 2;
      text-align: center;
      position: absolute;
      top: -50px;
      right: -50px;
      transform: rotate(45deg);
    }
  }
  .animate {
    transition: all 0.5s;
  }

  .item-img {
    width: 100%;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item-title {
    font-size: 14px;
    // font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #27274a;
    line-height: 20px;
    padding: 0px 12px;
    box-sizing: border-box;
    margin-bottom: 5px;
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-concent {
    height: 108px;
    margin-bottom: 10px;
    /* max-height: 300px; */
    overflow: hidden;
  }
  .item-row {
    margin-left: 6px;
    overflow: hidden;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-end-time {
    font-size: 12px;
    transform: scale(0.94);
    // font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #656577;
    // line-height: 17px;
    // height: 17px;
    margin-bottom: 5px;
  }
  .item-row-time {
    font-size: 12px;
    transform: scale(0.94);
    // font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #656577;
    line-height: 17px;
    height: 17px;
  }
  .item-footer {
    // position: absolute;
    height: 50px;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 80%;
    }
  }
  .item-status {
    width: 54px;
    height: 20px;
    position: absolute;
    right: -3px;
    top: -2px;
  }
  .passValue {
    transform: scale(0.9);
    line-height: 2;
  }
  .pass {
    background: #1890ff;
    color: white;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    line-height: 2;
    text-align: center;
    position: absolute;
    top: -50px;
    right: -50px;
    transform: rotate(45deg);
  }
  .unpass {
    background: red;
    color: white;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    line-height: 2;
    text-align: center;
    position: absolute;
    top: -50px;
    right: -50px;
    transform: rotate(45deg);
  }
}
/deep/ .ant-modal-header {
  text-align: center;
  padding: 14px 24px;
}
/deep/.ant-modal-title {
  font-weight: bold;
  font-size: 18px;
  padding: 5px;
}
/deep/.ant-modal-body {
  text-align: center;
  padding: 13px;
  font-size: 17px;
  line-height: 1.5;
  letter-spacing: 1px;
}
</style>
