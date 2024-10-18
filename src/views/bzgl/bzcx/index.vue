<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="wrap-header">
        <img src="./img/banner.png" alt="" class="img">
        <div class="image-text">
          <img src="./img/titleName.png" alt="">
          <a-input-search v-model="queryParam.name" placeholder="请输入标准名称搜索" allow-clear enter-button class="search" @search="searchQuery" />
        </div>
      </div>
      <div class="wrap-boby flex">
        <div class="boby-left">
          <a-list item-layout="vertical" size="large" :data-source="dataSource">
            <a-list-item slot="renderItem" slot-scope="item, index" class="list-class" :class="listIndex == index?'active':''" @click="secondClick(item,1,index)">
              <img src="./img/folder.png" alt="">
              <span class="boby-text">{{ item.categoryName }}</span>
            </a-list-item>
          </a-list>
          <div v-if="dataSource.length" style="margin-top: 20px;float: right;">
            <Pagination
              v-show="ipagination.total>0"
              :total="ipagination.total"
              :current.sync="ipagination.current"
              :page-size.sync="ipagination.pageSize"
              :page-size-options="ipagination.pageSizeOptions"
              @change="loadData"
            />
          </div>
        </div>
        <div class="boby-right">
          <div v-if="secondSource.length>0">
            <div v-for="(i,index) in secondSource" :key="i.categoryId" class="all-list">
              <div class="right-title flex">
                <div class="borderStyle" />
                <span class="title-text">{{ i.title }}</span>
              </div>
              <a-list item-layout="vertical" size="large" bordered :data-source="i.systemList">
                <a-list-item slot="renderItem" slot-scope="item" class="flex">
                  <div @click="openUrl(item)">{{ item.standardName }}</div>
                  <div>
                    <a-button icon="download" @click="handleClickDownloadFile(item)"> 下载</a-button>
                  </div>
                </a-list-item>
              </a-list>
            </div>
          </div>
          <div v-else>
            <a-list item-layout="vertical" size="large" bordered :data-source="secondSource" style="max-height:236px;overflow: auto;" />
          </div>
          <Pagination
            v-show="ipagination1.total>0"
            :total="ipagination1.total"
            :current.sync="ipagination1.current"
            :page-size.sync="ipagination1.pageSize"
            :page-size-options="ipagination1.pageSizeOptions"
            @change="secondClick({ categoryId: pid })"
          />
        </div>
      </div>
    </div>
    <pdf-modal ref="pdfModal" />
  </a-card>

</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import Pagination from '@/components/custom/Pagination'
import { filterObj } from '@/utils/util'
import PdfModal from '@/components/custom/PdfModal'
import axios from 'axios'
export default {
  name: 'OEMSWebIndex',
  components: { Pagination, PdfModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      dataSource: [],
      secondSource: [],
      /* 分页参数 */
      ipagination1: {
        current: 1,
        pageSize: 3,
        pageSizeOptions: ['3', '6', '9'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      pid: '',
      rootCategoryName: '', // 一级分类，名称
      listIndex: '0', // 判断一级文件夹变化
      url: {
        list: '/standardSystem/standardSystem/folderList',
        childerList: '/standardSystem/standardSystem/childCategoryList'
      }
    }
  },
  created() {
    // this.listIndex = '0'
    // 一级文件查询
    var params = this.getQueryParams()// 查询条件
    getAction(this.url.list, params).then(res => {
      if (res.success) {
        this.dataSource = [...res.result.records]
        if (res.result.total) {
          this.ipagination.total = res.result.total
        } else {
          this.ipagination.total = 0
        }
        this.secondClick({ categoryId: this.dataSource[0].categoryId }, 1)
      } else {
        this.$message.warning(res.message)
      }
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    // 下载
    handleClickDownloadFile(item) {
      const path = item.filePath
      axios.get(path, { responseType: 'blob' }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        const fileName = item.standardName
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    openUrl(item) {
      // this.$refs.pdfModal.showModal(item.filePath)
      // 文件以pdf形式进行预览
      const url = item.filePath
      window.open(url)
    },
    // 搜索
    searchQuery(value) {
      var params = this.getQueryParams1()// 查询条件
      params.id = this.pid
      params.type = 12
      params.name = value
      getAction(this.url.childerList, params).then(res => {
        if (res.success) {
          let resData = []
          let result = []
          if (res.result) {
            resData = res.result[0].childPage
            result = res.result[0].childPage.records
            this.secondSource = [...result]
          } else {
            this.secondSource = []
            this.$message.warning('暂无数据')
          }
          if (resData.total) {
            this.ipagination1.total = resData.total
          } else {
            this.ipagination1.total = 0
          }
          this.$forceUpdate()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取二级文件
    secondClick(record, current, index) {
      if (current === 1) {
        this.ipagination1.current = 1
      }
      this.pid = record.categoryId
      this.rootCategoryName = record.categoryName
      var params = this.getQueryParams1()// 查询条件
      params.id = record.categoryId
      params.type = 12
      getAction(this.url.childerList, params).then(res => {
        if (res.success) {
          this.listIndex = index
          let resData = []
          let result = []
          if (res.result) {
            resData = res.result[0].childPage
            result = res.result[0].childPage.records
            this.secondSource = [...result]
          } else {
            this.secondSource = []
            this.$message.warning('暂无数据')
          }
          if (resData.total) {
            this.ipagination1.total = resData.total
          } else {
            this.ipagination1.total = 0
          }
          this.$forceUpdate()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getQueryParams1() {
      // 二级文件获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination1.current
      param.pageSize = this.ipagination1.pageSize
      this.connectParams(param)
      return filterObj(param)
    }
  }
}
</script>

<style lang="less" scoped>
.flex{
  display: flex;
}
.wrap{
  width: 90%;
  margin: auto;
}
.wrap-header{
  position: relative;
	text-align: center;
  width: 100%;
  .img{
    width: 100%;
  }
	.image-text{
		position: absolute;
		left:32%;
		top: 25%;
	}
  .search{
    margin-top: 33px;
  }
  /deep/.ant-input{
	height: 38px;
  background-color:transparent;
  text-align: center;
  color:#fff;
  border-bottom-left-radius: 26px;
    border-top-left-radius: 26px;
}
/deep/.ant-input-group > .ant-input:first-child, .ant-input-group-addon:first-child{
	border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 26px;
    border-top-left-radius: 26px;
}
// deep/.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input{
//   border-bottom-left-radius: 26px;
//     border-top-left-radius: 26px;
// }
/deep/.ant-input-group-addon{
	border-bottom-right-radius: 26px;
    border-top-right-radius: 26px;
	width: 30%;
}
/deep/.ant-input-search-button{
	border-bottom-right-radius: 26px;
    border-top-right-radius: 26px;
}
/deep/.ant-btn{
	height: 38px;
	line-height: 1.5;
	width: 100%;
	background-color: #9daef2;
	border-color:#9daef2;
}
}
.wrap-boby{
  justify-content: center;
  margin-top: 10px;
  height: 75vh;
  cursor: pointer;
  .boby-left{
    background: #f4f5f8;
    margin-right: 10px;
    width: 30%;
    // height: 70vh;
    overflow: auto;
    .list-class{
      &.active{
        background: #fff !important;
        color: #298bf9 !important;
      }
    }
  }
  .boby-text{
    margin-left: 10px;
    line-height: 1.5;
    font-weight: bolder;
  }
  /deep/.ant-list-split .ant-list-item{
    padding: 13px;
  }
  /deep/.ant-list-split .ant-list-item:hover,.ant-list-split .ant-list-item:hover:active{
    background: #fff;
    color: #298bf9;
    border-left: 1px solid #298bf9;

  }
}
// 二级文件列表
.boby-right{
  background: #fafafa;
  width: 70%;
  // height: 70vh;
  overflow: auto;
  .all-list{
    margin-bottom: 10px;
    // margin: 60px 0;
    /deep/.ant-list-items{
      max-height: 165px;
      overflow: auto;
    }
    .moreStyle{
      text-align: center;
      margin: 10px;
      font-size: 16px;
      color: #588bf5;
      font-weight: bold;
    }
    /deep/.pagination-container{
      float: left;
    }
  }
  .right-title{
    align-items: center;
    border: 1px solid #d9d9d9;
    border-bottom: 0;
    background: #fff;
    padding: 5px 10px;
  }
}
.borderStyle{
  width: 5px;
  height: 21px;
  background: #298bf9;
}
.title-text{
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}

</style>
