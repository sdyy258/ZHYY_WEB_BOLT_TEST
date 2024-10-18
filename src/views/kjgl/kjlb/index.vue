<template>
  <a-card :bordered="false">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item v-if="disabledClick" label="文件名称">
        <a-input v-model.trim="queryParam.coursewareName" placeholder="请输入文件名称" />
      </a-form-item>
      <a-form-item v-if="!disabledClick" label="审核状态">
        <JDictSelectTag v-model="queryParam.auditStatus" placeholder="请选择审核状态" :allow-clear="true" :show-null-select="false" dict-code="is_audit" />
      </a-form-item>
      <a-form-item v-if="disabledClick" label="审核状态">
        <JDictSelectTag v-model="queryParam.isAudit" placeholder="请选择审核状态" :allow-clear="true" :show-null-select="false" dict-code="isReview" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
      </a-form-item>
    </a-form>
    <div class="operateBtn">
      <a-button icon="upload" @click="uploadFiles">上传文件</a-button>
      <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
        <a-button v-if="!disabledClick" icon="folder-open" @click="newFolderClick">新建文件夹1</a-button>
      </template>
      <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
        <a-button v-if="!disabledClick" icon="delete" @click="batchDel">删除</a-button>
        <a-button v-else-if="disabledClick" icon="delete" @click="batchDelFile">删除</a-button>
      </template>
      <template v-else>
        <a-button v-if="!disabledClick && $store.getters.userInfo.roles.indexOf('dsgly')==-1" icon="delete" @click="batchDel">删除</a-button>
        <a-button v-else-if="disabledClick&&$store.getters.userInfo.roles.indexOf('dsgly')==-1" icon="delete" @click="batchDelFile">删除</a-button>
      </template>
    </div>
    <div>
      <a :disabled="!disabledClick" :class="{'gary':!disabledClick,'blue':disabledClick}" @click="allFileClick(1)">全部文件</a>
      <span style="color:#D8D8D8">{{ fileName }}</span>
    </div>
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      :scroll="{x:true}"
      bordered
      :row-key="rowKey"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="categoryTitle">
        <span v-if="!disabledClick">文件夹名称</span>
        <span v-else>文件名称</span>
      </template>
      <span slot="categoryName" slot-scope="text, record">
        <a v-if="!disabledClick" @click="folderClick(record,1)">
          <a-icon type="folder" theme="filled" style="color:#FFC35E;font-size: 18px;margin-right: 5px;" />
          {{ text }}
        </a>
        <div v-else style="display: flex;justify-content: center;align-items: center;">
          <!-- <a-icon v-else-if="record.coursewareName.split('.')[1] == 'doc' || record.coursewareName.split('.')[1] == 'docx'" type="file-word" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" /> -->
          <!-- <a-icon v-else-if="record.coursewareName.split('.')[1] == 'ppt' || record.coursewareName.split('.')[1] == 'pptx'" type="file-ppt" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" /> -->
          <!-- <a-icon v-else-if="record.coursewareName.split('.')[1] == 'xls' || record.coursewareName.split('.')[1] == 'xlsx'" type="file-excel" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" /> -->
          <a-icon v-if="record.coursewareName.substr(-4, 4) == '.pdf'" type="file-pdf" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" />
          <!-- <a-icon v-else-if="record.coursewareName.split('.')[1] == 'mp3'" type="sound" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" /> -->
          <a-icon v-else-if="record.coursewareName.substr(-4, 4) == '.mp4'" type="youtube" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" />
          <span>{{ record.coursewareName }}</span>
        </div>
      </span>
      <span slot="coursewareCode" slot-scope="text, record">
        <a-input v-model="record.coursewareCode" @focus="focusId=record.id" />
      </span>
      <span slot="author" slot-scope="text, record">
        <a-input v-model="record.author" @focus="focusId=record.id" />
      </span>
      <span slot="operation" slot-scope="text, record" class="table-action">
        <!-- <a @click="$router.push('/kjgl/kjlb/video')">播放</a> -->
        <template v-if="!disabledClick">
          <a @click="uploadFiles(record)">上传文件</a>
          <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.categoryId)">
              <a>删除</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm v-if="$store.getters.userInfo.roles.indexOf('dsgly') ==-1" title="确定删除吗?" @confirm="() => handleDelete(record.categoryId)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
        <template v-else>
          <a @click="handleEdit(record)">保存</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteFile(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
            <a v-if="record.isAudit!=1" @click="$refs.examineModal.showModal(record)">审核</a>
          </template>
        </template>
      </span>
    </a-table>
    <a-modal v-model="visible" title="新建文件夹" @ok="handleOk">
      <a-textarea v-model="model.name" placeholder="请输入文件夹名称" auto-size />
    </a-modal>
    <local-detail ref="localDetail" @ok="localDetailCallBack" />
    <examine-modal ref="examineModal" @ok="localDetailCallBack" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import LocalDetail from '../../kcgl/kctj/modules/LocalDetail.vue'
import { getAction, postAction, deleteAction } from '@/api/manage'
import ExamineModal from './components/ExamineModal'
const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    align: 'center',
    dataIndex: 'categoryName',
    scopedSlots: { customRender: 'categoryName' },
    slots: { title: 'categoryTitle' }
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
  },
  {
    title: '讲师',
    align: 'center',
    dataIndex: 'author',
    scopedSlots: { customRender: 'author' }
  },
  {
    title: '审核状态',
    align: 'center',
    dataIndex: 'isAuditStr'
  },
  {
    title: '审核状态',
    align: 'center',
    dataIndex: 'isAudit_dictText'
  },
  {
    title: '退回原因',
    align: 'center',
    dataIndex: 'backReason'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const columns1 = columns.filter(item => item.dataIndex !== 'coursewareSize' && item.dataIndex !== 'coursewareCode' && item.dataIndex !== 'author' && item.dataIndex !== 'isAudit_dictText' && item.dataIndex !== 'backReason')
const columns2 = columns.filter(item => item.dataIndex !== 'isAuditStr')
export default {
  name: 'Index',
  components: { LocalDetail, ExamineModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      focusId: '', // 焦点id
      dataSource: [],
      copyDataSource: [],
      model: {},
      rowKey: 'categoryId',
      // 表头
      columns: columns1,
      url: {
        add: '/sys/category/add',
        list: '/cCoursewareInfo/cCoursewareInfo/folderList',
        fileList: '/cCoursewareInfo/cCoursewareInfo/fileList',
        delete: '/cCoursewareInfo/cCoursewareInfo/delete',
        deleteBatch: '/cCoursewareInfo/cCoursewareInfo/deleteBatch', // 批量删除文件夹
        deleteFile: '/cCoursewareInfo/cCoursewareInfo/deleteFile', // 删除文件
        deleteBatchFile: '/cCoursewareInfo/cCoursewareInfo/deleteBatchFile', // 批量删除文件
        edit: '/cCoursewareInfo/cCoursewareInfo/edit'
      },
      disabledClick: false,
      fileName: '',
      visible: false,
      folderName: '',
      categoryId: '',
      categoryName: '',
      queryParam: {
        // auditStatus:0,
        isAudit: 0
      }
    }
  },
  watch: {
    focusId(val) {
      const array = this.dataSource.map(item => {
        if (item.id !== val) {
          const originalData = this.copyDataSource.find(i => i.id === item.id) || {}
          return originalData
        } else {
          return item
        }
      })
      this.dataSource = JSON.parse(JSON.stringify(array))
      // this.$forceUpdate()
    }
  },
  methods: {
    // 上传文件
    uploadFiles(record) {
      // 单条数据点击不需要上传目录，文件夹点击后不需要再选择目录
      this.$refs.localDetail.edit(record, { categoryId: this.categoryId, categoryName: this.categoryName })
    },
    // 全部文件点击
    allFileClick(current) {
      this.loading = true
      this.categoryId = ''
      this.categoryName = ''
      if (current === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.disabledClick = false
          this.fileName = ''
          this.rowKey = 'categoryId'
          this.columns = columns1
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
    // 文件点击
    folderClick(record, current) {
      this.categoryId = record.categoryId
      this.categoryName = record.categoryName
      this.loading = true
      if (current === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      params.categoryId = record.categoryId
      getAction(this.url.fileList, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.copyDataSource = JSON.parse(JSON.stringify(this.dataSource))
          this.disabledClick = true
          this.fileName = '/' + record.categoryName
          this.rowKey = 'id'
          this.columns = columns2
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
    // 上传目录回显
    localDetailCallBack() {
      if (!this.disabledClick) {
        this.allFileClick(1)
      } else {
        this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
      }
    },
    // 查询
    searchQuery() {
      if (!this.disabledClick) {
        this.allFileClick(1)
      } else {
        this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
      }
    },
    // 重置
    searchReset() {
      this.queryParam = {}
      this.queryParam.auditStatus = 0
      this.queryParam.isAudit = 0
      if (!this.disabledClick) {
        this.allFileClick(1)
      } else {
        this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
      }
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
      if (this.disabledClick) {
        this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName })
      } else {
        this.allFileClick()
      }
      // this.loadData()
    },
    // 新建文件夹
    newFolderClick() {
      this.visible = true
    },
    // 文件编辑
    handleEdit(record) {
      this.loading = true
      postAction(this.url.edit, { categoryId: record.categoryId, coursewareCode: record.coursewareCode, author: record.author, id: record.id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName })
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除文件
    handleDeleteFile(id) {
      var that = this
      that.loading = true
      deleteAction(that.url.deleteFile, { id: id }).then((res) => {
        if (res.success) {
          // 重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.folderClick({ categoryId: that.categoryId, categoryName: that.categoryName })
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        that.loading = false
      })
    },
    // 批量删除文件
    batchDelFile() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            that.loading = true
            deleteAction(that.url.deleteBatchFile, { ids: ids }).then((res) => {
              if (res.success) {
                // 重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.folderClick({ categoryId: that.categoryId, categoryName: that.categoryName })
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.loading = false
            })
          }
        })
      }
    },
    handleOk() {
      const that = this
      if (!this.model.name) {
        this.$message.warning('请先输入文件夹名称')
        return
      }
      that.confirmLoading = true
      this.model.type = 9
      postAction(this.url.add, this.model).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData(1)
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        that.confirmLoading = false
        that.visible = false
        that.model.name = ''
      })
    }
  }
}
</script>
  <style scoped lang="less">
    .operateBtn{
        margin-bottom: 10px;
        display: flex;
        justify-content: end;

        button{
            margin: 0 5px;
        }
    }
    .gary{
        color: #D8D8D8;
    }
    .blue{
        color: #189EFF;
    }
  </style>

