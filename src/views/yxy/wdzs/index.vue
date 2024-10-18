<template>
  <a-card>
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <!-- <a-form-item label="证书名称">
        <a-input v-model.trim="queryParam.certificateName" placeholder="请输入名称" />
      </a-form-item> -->
      <a-form-item label="年度">
        <a-date-picker 
          v-model="queryParam.year"
          format="YYYY"
          value-format="YYYY"
          mode="year" 
          placeholder="请选择年度"
          :disabled-date="disabledDate"
          style="width: 280px;"
          :allow-clear="false"
          @panelChange="$set(queryParam,'year',$time.moment($event).format('YYYY')),$forceUpdate()">
        </a-date-picker>
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
      </a-form-item>
    </a-form>
    <div v-if="dataSource.length>0">
      <div class="item">
        <div v-for="(item,index) in dataSource" :key="index" style="width: 20%;display: flex;justify-content: center;">
          <div class="item-exam animate">
            <div class="item-img">
              <img :src="item.certificatePhoto" alt="" @click="certificateDetail(item)">
            </div>
            <div class="item-title" :title="item.certificateName">
              {{ item.certificateName }}
            </div>
            <div class="item-row item-end-time">
              获取时间：{{ item.createTime }}
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
    <credit-hour-certificate ref="creditHourCertificate" />
    <training-certificate ref="trainingCertificate" />
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Pagination from '@/components/oems/Pagination'
import CreditHourCertificate from './modules/CreditHourCertificate.vue'
import TrainingCertificate from './modules/TrainingCertificate.vue'
import moment from 'moment'
export default {
  components: {
    Pagination,
    CreditHourCertificate,
    TrainingCertificate
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      moment,
      queryParam:{
        year:moment().format('YYYY')
      },
      url: {
        list: '/tExamCertificate/tExamCertificate/list'
      }
    }
  },
  methods: {
    certificateDetail(item) {
      if (item.itemType == 2) {
        // this.putAction('/tExamCertificate/tExamCertificate/certificatenUpdate',{year:Number(this.queryParam.year)}).then(res => {
          this.$refs.creditHourCertificate.showModal(item,this.queryParam.year)
        // })
      } else if (item.itemType == 3 || item.itemType == 1) {
        this.$refs.trainingCertificate.showModal(item)
      }
    },
    disabledDate(current) {
      if(current < moment('2023') ){
        return true
      }else if(current > moment()){
        return true
      }else{
        return false
      }
    },
  }
}
</script>
  <style scoped lang="less">.item{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item-exam{
      width: 90%;
      height: 280px;
      /* /margin-right: 20px; */
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0 2px 4px 0 rgb(58 62 81 / 20%);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      box-shadow: -1px 5px 10px #F4F4F4;
      cursor: pointer;
    }
    .animate{
      transition: all 0.5s;
    }

    .item-img{
      width: 100%;
      height: 180px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-title{
      height: 60px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #27274A;
      line-height: 20px;
      padding: 15px 12px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-row{
      margin-left: 6px;
    }
    .item-end-time{
      font-size: 14px;
      transform: scale(0.94);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #656577;
      line-height: 17px;
      height: 40px;
    }
  }
  </style>

