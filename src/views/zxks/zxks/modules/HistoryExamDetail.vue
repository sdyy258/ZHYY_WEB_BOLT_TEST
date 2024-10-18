<template>
  <div>
    <div v-if="dataSource.length > 0">
      <div class="item">
        <div v-for="(item, index) in dataSource" :key="index" style="width: 20%;display: flex;justify-content: center;">
          <div class="item-exam animate">
            <div v-if="item.isShowResult == 1 && item.result != null" :class="item.result == 1 ? 'pass' : 'unpass'">
              <span class="passValue">{{ item.resultStr }}</span>
            </div>
            <div class="item-img">
              <img :src="item.pictureUrl" alt />
            </div>
            <div class="item-title" :title="item.name">{{ item.name }}</div>
            <div v-if="item.isShowResult == 1" class="item-row item-end-time">
              <span>
                分数：
                <span style="color:#FF4B50">{{ item.score }}</span>
              </span>
            </div>
            <div class="item-row item-end-time">
              <span>开始考试时间：{{ item.startTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>结束考试时间：{{ item.endTime }}</span>
            </div>
            <div class="item-row item-end-time">
              <span>耗时(分钟)：{{ item.tookTime }}</span>
            </div>
            <!-- <div v-if="item.isShowResult == 1" class="item-footer">
              <a-button
                v-if="item.isOnline == 0 && item.isOnlineNew == 0"
                type="primary"
                style="background-color: #ccc;border-color:#ccc"
                color="rgba(0, 0, 0, 0.25);"
                @click="$message.warning('线下考试,无需线上答题')"
                >线下考试</a-button
              >
              <a-button type="primary" @click="historyQuestionView(item)" v-else>查看</a-button>
            </div> -->
            <div class="item-footer" v-if="item.isOnline == 0">
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
                >查看</a-button
              >
              <!-- <a-button type="primary" @click="historyQuestionView(item)" v-else>查看</a-button> -->
            </div>
            <div class="item-footer" v-else>
              <a-button v-if="item.isShowResult == 1" type="primary" @click="historyQuestionView(item)">查看</a-button>
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
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Pagination from '@/components/oems/Pagination'

export default {
  components: { Pagination },
  mixins: [JeecgListMixin],
  data() {
    return {
      url: {
        list: '/tExam/tExam/historyPageListByUser'
      }
    }
  },
  methods: {
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
    // height: 360px;
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
    }
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
  letter-spacing: 3px;
}
</style>
