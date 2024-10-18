<template>
  <div>
    <div v-if="dataSource.length>0">
      <div class="item">
        <div v-for="(item,index) in dataSource" :key="index" style="width: 20%;display: flex;justify-content: center;">
          <div class="item-exam animate">
            <div v-if="item.enrollStatus == 0" class="corner"><span style="transform: scale(0.9);">未报名</span></div>
            <div v-else-if="item.enrollStatus == 1" class="success"><span style="transform: scale(0.9);">已报名</span></div>
            <div class="item-img">
              <img :src="item.pictureUrl" alt>
            </div>
            <div class="item-title" :title="item.name">{{ item.name }}</div>
            <div class="item-row item-end-time">
              <span>报名开始时间：{{ item.enrollStartTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>报名结束时间：{{ item.enrollEndTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>考试开始时间：{{ item.limitStartTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>考试结束时间：{{ item.limitEndTime }}</span>
            </div>
            <div class="item-row item-row-time">
              <span>考试时长：{{ item.examTime }}分钟</span>
            </div>
            <div class="item-footer">
              <a-button v-if="item.enrollStatus == 0" type="primary" @click="application(item)">考试报名</a-button>
              <a-button v-else-if="item.enrollStatus == 1" type="primary" @click="examEnroll(item)">取消报名</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <a-empty />
    </div>
    <Pagination
      v-show="ipagination.total>0"
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
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@/api/manage'
import Pagination from '@/components/oems/Pagination'
export default {
  components: { Pagination },
  mixins: [JeecgListMixin],
  data() {
    return {
      examId: '',
      modalVisible: false,
      confirmLoading: false,
      url: {
        list: '/tExam/tExam/queryEnroll'
      },
      model: {}
    }
  },
  methods: {
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
          postAction('/tExamPaperUser/tExamPaperUser/enroll', param).then(res => {
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
          }).finally(() => {
            that.modalVisible = false
            that.confirmLoading = false
          })
        }
      })
    },
    // 取消报名
    examEnroll(item) {
      const that = this
      this.$confirm({
        title: '提示',
        content: '您是否确认取消报名？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          postAction('/tExamPaperUser/tExamPaperUser/enroll', { examId: item.id, type: 0 }).then((res) => {
            if (res.success) {
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
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
        // height: 380px;
        // margin-right: 25px;
        margin-bottom: 25px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgb(58 62 81 / 20%);
        border-radius: 4px;
        overflow: hidden;
        position: relative;

        .corner{
          background: #1890FF;
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
        .success{
          background: #F08A20;
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
        button{
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
      letter-spacing: 1px;
    }
    </style>

