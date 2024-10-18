<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <template v-if="editShow" slot="footer">
      <a-spin :spinning="confirmLoading">
        <div style="display: flex;justify-content: space-between;">
          <div style="color:#9090A4;font-size: 12px;">
            <span>注：更换课件不会清除此小节的学员学习数据。</span>
          </div>
          <div>
            <a-button @click="handleCancel">关闭</a-button>
            <a-button v-if="!disableSubmit" type="primary" @click="handleOk()">确认</a-button>
          </div>
        </div>
      </a-spin>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="12">
        <a-col :span="4">
          <a-tree
            v-model="checkedKeys"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :auto-expand-parent="false"
            @expand="onExpand"
            @select="onSelect"
          />
        </a-col>
        <a-col :span="20">
          <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
            <a-form-item label="">
              <a-input v-model.trim="queryParam.coursewareName" placeholder="请输入名称" />
            </a-form-item>
            <a-form-item class="search-button">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              <template v-if="$store.getters.userInfo.roles.indexOf('admin')==-1 && $store.getters.userInfo.roles.indexOf('stadmin')==-1 && $store.getters.userInfo.roles.indexOf('dsgly')>-1">
                <a-button type="primary" icon="upload" @click="uploadFiles">上传</a-button>
              </template>
            </a-form-item>
          </a-form>
          <!-- <div class="searchData">
            <span v-for="(item,index) in searchData" :key="index" :class="{'checked':prop == index +1}" @click="searchDataClick(item)">{{ item.label }}</span>
          </div> -->
          <def-columns :columns="columns" @setColumns="columns=$event" />
          <a-table
            ref="table"
            size="middle"
            class="table-nowrap"
            :scroll="{x:true}"
            bordered
            row-key="id"
            :columns="columns"
            :data-source="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type:selectType, getCheckboxProps:getCheckboxProps }"
            @change="handleTableChange"
          />
        </a-col>
      </a-row>
      <local-detail ref="localDetail" @ok="localDetailCallBack" />
    </a-spin>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import LocalDetail from './LocalDetail.vue'
export default {
  mixins: [JeecgListMixin],
  components: { LocalDetail },
  data() {
    return {
      disableMixinCreated: true,
      loading: false,
      title: '从课件库选择课件',
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      readOnly: false,
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      // 表头
      columns: [{
        title: '序号',
        dataIndex: '',
        key: 'rowIndex',
        width: 60,
        align: 'center',
        customRender: function(t, r, index) {
          return parseInt(index) + 1
        }
      }, {
        title: '文件名称',
        align: 'center',
        dataIndex: 'coursewareName'
      },
      {
        title: '大小(MB)',
        align: 'center',
        dataIndex: 'coursewareSize'
      },
      {
        title: '创建人',
        align: 'center',
        dataIndex: 'createBy'
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'createTime'
      },
      {
        title: '课件代码',
        align: 'center',
        dataIndex: 'coursewareCode',
        scopedSlots: { customRender: 'coursewareCode' }
      }],
      searchData: [{
        value: 1,
        label: '全部'
      }, {
        value: 2,
        label: '文档'
      }, {
        value: 3,
        label: '音频'
      }, {
        value: 4,
        label: '视频'
      }],
      dataSource: [],
      prop: 1,
      selectedRowKeys: [],
      selectedRows: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      url: {
        list: '/sys/category/rootList',
        childList: '/sys/category/childList',
        fileList: '/cCoursewareInfo/cCoursewareInfo/fileList?isAudit=1'
      },
      editShow: false,
      index: null,
      selectType: 'checkbox',
      allDataSource: [],
      courseCoursewareId: null, // 小节id
      disabledId: null
    }
  },
  created() {
    getAction(this.url.fileList, { pageSize: 0x7fffffff }).then((res) => {
      if (res.success) {
        this.allDataSource = res.result.records.map(item => {
          item.lessonName = item.coursewareName.replace('_' + item.coursewareName.split('_').slice(-1).toString(), '')
          item.type = 2
          item.coursewareId = item.id
          return item
        })
      } else {
        this.$message.warning(res.message)
      }
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    // 上传
    uploadFiles(){
      // 单条数据点击不需要上传目录，文件夹点击后不需要再选择目录
      let categoryName =''
      this.treeData.map(item=>{
        if(this.selectedKeys[0] === item.id){
          categoryName = item.name
        }
      })
      this.$refs.localDetail.edit({},{ categoryId: this.selectedKeys[0], categoryName: categoryName })
    },
    add() {
      this.edit({})
    },
    edit(record, index, selectedRows) {
      if (index != null) {
        this.title = '更换课件'
        this.editShow = true
        this.selectType = 'radio'
        this.selectedRowKeys = [record.coursewareId || record.id]
        this.selectedRows = [record]
        this.index = index
        this.courseCoursewareId = record.courseCoursewareId
        this.disabledId = this.selectedRowKeys
      } else {
        this.title = '从课件库选择课件'
        this.editShow = false
        this.selectType = 'checkbox'
        this.selectedRowKeys = selectedRows.map(item => {
          return item.coursewareId || item.id
        })
        this.selectedRows = selectedRows
        this.courseCoursewareId = null
        this.disabledId = this.selectedRowKeys
      }
      this.queryParam = {}// 默认查询条件为空
      this.visible = true
      getAction(this.url.list).then(res => {
        if (res.success) {
          getAction(this.url.list, { type: 9, pageSize: 500 }).then(res => {
            if (res.success) {
              const result = res.result
              if (Number(result.total) > 0) {
                this.ipagination.total = Number(result.total)
                this.treeData = this.getDataByResult(res.result.records)
                console.log('treeData', this.treeData)
                this.loadData(this.selectedKeys[0])// 默认有选中显示选中的，没选中显示全部数据
                // return this.loadDataByExpandedRows(this.dataSource)
              } else {
                this.ipagination.total = 0
                this.treeData = []
              }
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 查询
    searchQuery() {
      this.loadData(this.selectedKeys[0], 1)
      // this.selectedRowKeys = []
      // this.selectionRows = []
    },
    // 重置
    searchReset() {
      this.queryParam = {}
      this.loadData(this.selectedKeys[0], 1)
    },
    loadData(id, arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      params.categoryId = id
      getAction(this.url.fileList, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData(this.selectedKeys[0])
    },
    getDataByResult(result) {
      if (result && result.length > 0) {
        return result.map(item => {
          // 判断是否标记了带有子节点
          if (item[this.hasChildrenField] == '1') {
            const loadChild = { key: item.id + '_loadChild', title: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          item.title = item.name
          item.key = item.id
          return item
        })
      }
    },
    // 文档、音频、视频选择
    searchDataClick(item) {
      this.prop = item.value
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      if (expandedKeys.length > 0) {
        let list = []
        expandedKeys.forEach(item => {
          list = this.treeData.filter(res => res.key == item)
          list.forEach(record => {
            const params = {}
            params[this.pidField] = record.key
            getAction(this.url.childList, params).then((res) => {
              if (res.success) {
                if (res.result && res.result.length > 0) {
                  record.children = this.getDataByResult(res.result)
                  this.treeData = [...this.treeData]
                } else {
                  record.children = ''
                  record.hasChildrenField = '0'
                }
              } else {
                this.$message.warning(res.message)
              }
            })
          })
        })
      }
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.loadData(selectedKeys[0], 1)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: this.disabledId && this.disabledId.indexOf(record.id) > -1
        }
      }
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.selectedRows = this.allDataSource.filter(item => this.selectedRowKeys.indexOf(item.coursewareId) > -1)
      if (this.courseCoursewareId) {
        this.selectedRows[0].id = this.courseCoursewareId
      }
      this.$emit('ok', this.selectedRows, this.editShow, this.index)
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
<style scoped lang="less">
.searchData{
    margin-bottom: 10px;

    span{
        margin-right: 20px;
        cursor: pointer;
        &.checked{
            color: #1A8CFE;
        }
    }
}
</style>
