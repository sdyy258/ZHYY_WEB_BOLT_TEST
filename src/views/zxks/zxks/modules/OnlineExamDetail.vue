<template>
  <div>
    <div v-if="dataSource.length > 0">
      <div class="item">
        <div v-for="(item, index) in dataSource" :key="index" style="width: 20%;display: flex;justify-content: center;">
          <div class="item-exam animate">
            <div class="item-img">
              <img :src="item.pictureUrl" alt />
            </div>
            <div class="item-title" :title="item.name">{{ item.name }}</div>
            <div class="item-row item-end-time">
              <span>考试开始时间：{{ item.limitStartTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>考试结束时间：{{ item.limitEndTime }}</span>
            </div>
            <div class="item-row item-row-time">
              <span>考试时长：{{ item.examTime }}</span>
            </div>
            <div class="item-footer">
              <a-button type="primary" v-if="item.isOnline == 0 && item.isOnlineNew == 0">线下考试</a-button>
              <a-button type="primary" @click="examStart(item)" v-else>开始考试</a-button>
              <!-- <a-button v-if="item.enrollEndTime>date && item.examWay == 2" type="primary" @click="examEnroll(item)">取消报名</a-button> -->
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
    <exam-instruction-detail ref="examInstructionDetail" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ExamInstructionDetail from '../ExamInstructionDetail.vue'
import Pagination from '@/components/oems/Pagination'
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'

export default {
  components: { Pagination, ExamInstructionDetail },
  mixins: [JeecgListMixin],
  data() {
    return {
      url: {
        list: '/tExam/tExam/queryPageListByUser'
      },
      date: null
    }
  },
  created() {
    this.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    // 取消报名
    // examEnroll(item) {
    //   const that = this
    //   this.$confirm({
    //     title: '提示',
    //     content: '您是否确认取消报名？',
    //     okText: '确定',
    //     okType: 'danger',
    //     cancelText: '取消',
    //     onOk() {
    //       postAction('/tExamPaperUser/tExamPaperUser/enroll', { examId: item.id, type: 0 }).then((res) => {
    //         if (res.success) {
    //           that.loadData()
    //         } else {
    //           that.$message.warning(res.message)
    //         }
    //       })
    //     }
    //   })
    // },
    // 开始考试
    examStart(item) {
      getAction('/tExam/tExam/examInstructions', { examId: item.id }).then(res => {
        if (res.success) {
          this.$refs.examInstructionDetail.showModal(item, res.result)
        } else {
          this.$message.warning(res.message)
        }
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
    // height: 340px;
    // margin-right: 25px;
    margin-bottom: 25px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgb(58 62 81 / 20%);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
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
  .item-row {
    margin-left: 6px;
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
    box-sizing: border-box;
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
      margin: 0 10px;
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
    display: block;
    width: 54px;
    height: 20px;
    text-align: center;
    font-size: 12px;
    transform: scale(0.9);
    line-height: 20px;
    color: #ffffff;
  }
  .pass {
    color: #1a8cfe;
    background-color: #1a8cfe;
  }
  .unpass {
    color: #ff0000;
    background-color: #ff0000;
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
  letter-spacing: 3px;
}
</style>
