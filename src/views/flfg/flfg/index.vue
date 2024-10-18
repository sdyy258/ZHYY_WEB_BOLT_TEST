<template>
  <div class="app-container">
    <a-tabs v-model="activeKey" class="tab-class" >
      <a-tab-pane v-for="pane in dataSource" :key="pane.id">
        <span slot="tab" @click="tabChange(pane.id,pane.children)">{{ pane.name }}</span>
        <!-- 二级文件名称 -->
        <div v-if="pane['hasChild'] == '1'" class="childtab-class">
          <a-tabs v-model="childKey" type="card">
            <a-tab-pane v-for="i in pane.children" :key="i.id">
              <span slot="tab" class="button-class" @click="buttonChange(i.id)">{{ i.name }}</span>
            </a-tab-pane>
          </a-tabs>
        </div>
        <!-- 文件列表 -->
        <div class="file-class">
          <a-list :data-source="dataList" :loading="loading">
            <a-list-item slot="renderItem" slot-scope="item">
              <a slot="actions" @click="$refs.detailModal.showModal(item)">{{ item.createTime }}</a>
              <a-list-item-meta :description="item.email" @click="$refs.detailModal.showModal(item)">
                <a v-if="item.lawName.length>50" slot="title" :href="item.href">{{ `${item.lawName.slice(0,50)}...` }}</a>
                <a v-else slot="title" :href="item.href">{{ `${item.lawName}` }}</a>
                <a-avatar
                  slot="avatar"
                />
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          <Pagination
            v-show="ipagination.total>0"
            :total="ipagination.total"
            :current.sync="ipagination.current"
            :page-size.sync="ipagination.pageSize"
            :page-size-options="ipagination.pageSizeOptions"
            @change="getDataList('',childKey )"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
    <detail-modal ref="detailModal" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import DetailModal from './components/DetailModal'
import Pagination from '@/components/custom/Pagination'
export default {
  name: 'AbnormalScreenWebIndex',
  components: { DetailModal, Pagination },
  mixins: [JeecgListMixin],
  data() {
    return {
      loading: true,
      activeKey: 1,
      dataList: [],
      childKey: '',
      dataSource: [
        // { name: '1', id: 1, children: [{ id: 1, name: '111' }] },
        // { name: '2', id: 2 },
        // { name: '3', id: 3 }

      ],
      url: {
        list: '/sys/category/rootList',
        childList: '/sys/category/childList',
        getChildListBatch: '/sys/category/getChildListBatch'
      }
    }
  },

  mounted() {

  },

  methods: {
    // tab页切换
    tabChange(key, data) {
      this.childKey = data[0].id
      // this.dataList=[]
      this.getDataList(1, data[0].id)
      // this.queryParam = {}
      this.$forceUpdate()
    },
    buttonChange(id) {
      this.childKey = id
      this.getDataList(1, id)
      this.$forceUpdate()
    },
    // 获取dataList数据
    getDataList(arg, cId) {
      if (arg == 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.type = 1
      params.categoryId = cId
      getAction('/baseLawRegulation/baseLawRegulation/list', params).then((res) => {
        if (res.success) {
          if (res.result.total) {
            this.ipagination.total = res.result.total
            this.dataList = res.result.records || res.result
          } else {
            this.ipagination.total = 0
            this.dataList = []
          }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // tab树的列表
    loadData() {
      this.loading = true
      const params = this.getQueryParams()
      params.type = 11
      params.pageSize = 500
      return new Promise((resolve) => {
        getAction(this.url.list, params).then(res => {
          if (res.success) {
            const result = res.result
            if (Number(result.total) > 0) {
              // this.dataSource = res.result.records
              this.dataSource = this.getDataByResult(res.result.records)
            } else {
              this.dataSource = []
            }
            if (this.dataSource.length > 0) {
              this.activeKey = this.dataSource[0].id
              console.log(this.dataSource);
              // this.getDataList(1, this.dataSource[0].id)
              setTimeout(()=>{
                this.childKey = this.dataSource[0].children[0].id
                this.getDataList(1, this.childKey)
                this.$forceUpdate()
              },500)
            }
            // 判断第一个有没有子节点，如果有则通过子节点id走list接口获取数据，如果没有通过第一个节点id获取数据
            // if (this.dataSource[0]['hasChild'] == '1') {
            //   this.getDataList(1, this.dataSource[0]['hasChild'].id)
            // } else {
            //   this.getDataList(1, this.dataSource[0].id)
            // }
            // 通过第一个父节点获取list数据
          }
        }).finally(() => {
          this.loading = false
        })
      })
    },
    getDataByResult(result) {
      if (result && result.length > 0) {
        return result.map(item => {
          // 判断是否标记了带有子节点
          if (item['hasChild'] == '1') {
            item.children = this.handleExpand(item)
          }
          return item
        })
      }
    },
    // 获取子节点
    handleExpand(record) {
      const params = this.getQueryParams()// 查询条件
      params['pid'] = record.id
      getAction(this.url.childList, params).then((res) => {
        if (res.success) {
          if (res.result && res.result.length > 0) {
            record.children = [...res.result]

          } else {
            record.children = ''
            record.hasChildrenField = '0'
          }
        } else {
          this.$message.warning(res.message)
        }
        return record.children
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tab-class{
  width: 80%;
  margin: auto;
  .flex{
    display: flex;
  }
}
.childtab-class{
  /deep/.ant-tabs-bar{
    border-bottom: none !important;
  }
  /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
    margin-right:15px;
    background: #e8e8e8;
    border-color: #e5e5e5 !important;
    border-radius:4px;
  }
    /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
      color: #fff !important;
      background: #d24646 !important;
    }
}
.button-class{
  font-size: 18px;
}
.file-class{
  margin: auto;
  text-align: initial;
}
/deep/.ant-btn{
    height: 42px;
}
/deep/.ant-tabs-tab{
  font-size: 20px;
}
/deep/.ant-tabs-tab-active{
  font-size: 22px;
}
/deep/.ant-list-items{
  list-style: auto;
}
/deep/.ant-list-split .ant-list-item{
  border-bottom: 1px dashed #4988c9;
}
/deep/.ant-list-item-meta{
  align-items: center;
}
/deep/.ant-list-item-meta-title{
  font-size: 18px;
}
/deep/.ant-list-item-action{
  li{
    font-size: 18px;
  }
}
/deep/.ant-avatar{
    width: 8px;
    height: 8px;
    line-height: 8px;
    background: #4988c9;
  }
</style>
