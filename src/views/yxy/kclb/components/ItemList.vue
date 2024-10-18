<template>
  <a-card :bordered="false">
    <template slot="title">
      <div class="titleCard">
        <div class="title" @click="clickCategoryTitle"><span>{{ category.title }}</span></div>
        <div class="tabTitle">
          <div style="display: flex;flex-wrap: wrap;">
            <div v-for="i in category.children" :key="i.value" :class="i.value===queryParam.categoryId?'selected':''" class="tabCla" @click="clickCategoryItem(i)">
              {{ i.title + '(' + i.categoryNum + ')' }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="item">
      <div v-for="val in dataSource" :key="val.id" style="width: 20%;display: flex;justify-content: center;" @click="examStart(val)">
        <div class="item-exam animate">
          <div class="item-img">
            <img :src="val.courseTitleAddress" alt="">
          </div>
          <div class="item-title" :title="val.courseName">
            {{ val.courseName }}
          </div>
          <div class="item-row item-end-time">
            <div class="item-status" :class="{'incomplete':val.courseLearnStatus == 0 || !val.courseLearnStatus,'notParticipat':val.courseLearnStatus == 1,'completed':val.courseLearnStatus == 2}">
              <span class="passValue">{{ val.courseLearnStatus_dictText || '未开始' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      v-show="ipagination.total>0"
      :total="ipagination.total"
      :current.sync="ipagination.current"
      :page-size.sync="ipagination.pageSize"
      :page-size-options="ipagination.pageSizeOptions"
      @change="loadData"
    />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Pagination from '@/components/oems/Pagination'

export default {
  name: 'Index',
  components: { Pagination },
  mixins: [JeecgListMixin],
  props: {
    category: {
      type: Object,
      required: true
    },
    courseLearnStatus: {
      type: [Number, String],
      required: true
    },
    courseTitle: {
      type: String
      // require: false
    },
    showCollect:{
      type: String,
      default:''
    }
  },
  data() {
    return {
      queryParam: {
        categoryId: null,
        courseName: null
      },
      // 表头
      url: {
        list: '/cCourseUser/cCourseUser/studentCourselist'
      }
    }
  },
  watch: {
    courseLearnStatus() {
      this.searchQuery()
    },
    courseTitle() {
      this.searchQuery()
    }
  },
  activated() {
    this.searchQuery()
  },
  methods: {
    connectParams(params) {
      params.categoryRootId = this.category.value
      params.courseLearnStatus = this.courseLearnStatus
      params.courseName = this.courseTitle
      params.isCollect = this.showCollect
    },
    // 点击根目录查询全部
    clickCategoryTitle() {
      this.queryParam.categoryId = null
      this.searchQuery()
    },
    // 点击分类查询分类下的数据
    clickCategoryItem(item) {
      if (item.value === this.queryParam.categoryId) {
        this.queryParam.categoryId = null
      } else {
        this.queryParam.categoryId = item.value
      }
      this.searchQuery()
    },
    examStart(item) {
      item.showCollect = this.showCollect
      this.$router.push({
        path: '/yxy/kcxx',
        query: { ...item }
      })
    }
  }
}
</script>
<style scoped lang="less">
 .titleCard{
    display: flex;
    align-items: center;
    .title{
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
    .tabTitle{
      font-size: 14px;
      margin: 0 10px;
      color: #989898;
      width: 90%;
      // height: 20px;
      // overflow: hidden;
      .tabCla{
        cursor: pointer;
        margin: 0 10px;
        margin-bottom: 10px;
        &.selected{
          color: #1A8CFE;
          border-bottom: 1px solid #1A8CFE;
        }
      }
    }
  }

  .item{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item-exam{
      width: 90%;
      height: 280px;
      // margin-right: 20px;
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
      font-size: 14px;
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
      font-size: 12px;
      transform: scale(0.94);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #656577;
      line-height: 17px;
      height: 40px;
    }
    .item-footer{
      position: absolute;
      bottom: 10px;
      right: 12px;
    }
    .item-status{
      width: 54px;
      height: 20px;
      position: absolute;
      right: -3px;
      top: -2px;
    }
    .passValue{
      display: block;
      width: 54px;
      height: 20px;
      text-align: center;
      font-size: 12px;
      transform: scale(0.9);
      line-height: 20px;
      color: #FFFFFF;
    }

    .incomplete{
      color: #ffffff;
      background-color: #5B616C;
      border-radius: 4px;
    }
    .notParticipat{
      color: #ffffff;
      background-color: #206DE9;
      border-radius: 4px;
    }
    .completed{
      color: #ffffff;
      background-color: #349F71;
      border-radius: 4px;
    }
  }
</style>
