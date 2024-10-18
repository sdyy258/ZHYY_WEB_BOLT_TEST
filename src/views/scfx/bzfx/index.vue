<template>
    <a-card :bordered="false">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item v-if="!disabledClick && !secondFileShow " label="文件夹名称">
          <a-input v-model.trim="queryParam.pidCategoryName" placeholder="请输入文件名称" allow-clear />
        </a-form-item>
        <a-form-item v-if="secondFileShow" label="文件夹名称">
          <a-input v-model.trim="queryParam.categoryName" placeholder="请输入文件名称" allow-clear />
        </a-form-item>
        <a-form-item v-if="disabledClick" label="标准文件名称">
          <a-input v-model.trim="queryParam.standardName" placeholder="请输入文件名称" allow-clear />
        </a-form-item>
        <!-- 文件夹审核 -->
        <a-form-item v-if="!disabledClick" label="审核状态">
          <j-dict-select-tag v-model="queryParam.auditStatus" placeholder="请选择" allow-clear :show-null-select="false" dict-code="auditStatus" @change="$forceUpdate()"></j-dict-select-tag>
        </a-form-item>
        <a-form-item  v-if="disabledClick" label="审核状态">
          <j-dict-select-tag v-model="queryParam.isAudit" placeholder="请选择" allow-clear :show-null-select="false" dict-code="is_audit" @change="$forceUpdate()"></j-dict-select-tag>
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery()">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="operateBtn">
        <a-button v-if="!disabledClick&&secondFileShow" icon="upload" @click="uploadFilesbtn(2)">上传文件</a-button>
        <a-button v-if="disabledClick&&!allFileShow" icon="upload" @click="uploadFiles">上传文件</a-button>
<!--        <template v-if="$store.getters.userInfo.roles.indexOf('admin') > -1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">-->
        <template>
          <a-button v-if="!disabledClick" icon="folder-open" @click="newFolderClick">新建文件夹</a-button>
        </template>
      </div>
      <div>
        <a :class="{'gary':!secondFileShow,'blue':disabledClick}" @click="allFileClick(1)">全部文件</a>
        <a :disabled="!disabledClick" :class="{'gary':!disabledClick,'blue':disabledClick}" @click="secondFileClick('',1)">{{ secondfileName }}</a>
        <span style="color:#D8D8D8">{{ fileName }}</span>
      </div>
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
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
          <span v-else>标准名称</span>
        </template>

        <span slot="categoryName" slot-scope="text, record">
          <!--一级文件夹名称 点击二级文件夹 -->
          <a v-if="!disabledClick && !secondFileShow" :title="text" @click="secondFileClick(record,1)">
            <a-icon type="folder" theme="filled" style="color:#FFC35E;font-size: 18px;margin-right: 5px;" />
            {{ text }}
          </a>
          <!--二级文件夹名称 点击文件 -->
          <a v-if="secondFileShow && !disabledClick" :title="text" @click="folderClick(record,1)">
            <a-icon type="folder" theme="filled" style="color:#FFC35E;font-size: 18px;margin-right: 5px;" />
            {{ text }}
          </a>
          <!-- 文件目录 -->
          <span v-if="disabledClick" :title="record.standardName">{{ record.standardName }}</span>
        </span>

        <span slot="filePath" slot-scope="text, record">
          <a-icon type="file-pdf" theme="filled" style="color:#3C82FD;font-size: 18px;margin-right: 5px;cursor: default;" />
          <span :title="record.filePath.split('/')[4] ">
            {{ `${record.filePath.split('/')[4]}` }}
          </span>
        </span>

        <span slot="operation" slot-scope="text, record" class="table-action">
          <!-- 一级文件夹上传 -->
          <template v-if="!disabledClick&&!secondFileShow">
            <a @click="uploadFilesbtn(1,record)">上传文件</a>
            <a-popconfirm   title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,1)">
              <a>删除</a>
            </a-popconfirm>

            <!-- <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
              <a-popconfirm   title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,1)">
                <a>删除</a>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm  v-if="$store.getters.userInfo.roles.indexOf('dsgly') ==-1" title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,1)">
                <a>删除</a>
              </a-popconfirm>
            </template> -->
          </template>
          <!-- 二级文件上传 -->
          <template v-if="!disabledClick && secondFileShow">
            <a @click="secUploadFile(record)">上传文件</a>
            <a-popconfirm   title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,2)">
              <a>删除</a>
            </a-popconfirm>
            <!-- <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
              <a-popconfirm   title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,2)">
                <a>删除</a>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm  v-if="$store.getters.userInfo.roles.indexOf('dsgly') ==-1 " title="确定删除吗?" @confirm="() => handleDelete(record.categoryId,2)">
                <a>删除</a>
              </a-popconfirm>
            </template> -->
          </template>
          <template v-if="disabledClick">
            <!-- <a @click="handleEdit(record)">保存</a> -->
            <!-- <template v-if="$store.getters.userInfo.roles.indexOf('admin')>-1 || $store.getters.userInfo.roles.indexOf('stadmin')>-1">
              <a v-if="record.isAudit!=1" @click="$refs.examineModal.showModal(record)">审核</a>
            </template> -->
            <a-popconfirm   title="确定删除吗?" @confirm="() => handleDeleteFile(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
      <a-modal v-if="!secondFileShow" v-model="visible" title="新建文件夹" @ok="handleOk(1)" @cancel="handleCancel">
        <a-textarea v-model="model.name" placeholder="请输入文件夹名称" auto-size />
      </a-modal>
      <a-modal v-else v-model="visible" title="新建文件夹" @ok="handleOk(2)" @cancel="handleCancel">
        <a-textarea v-model="model.name" placeholder="请输入文件夹名称" auto-size />
      </a-modal>
      <local-detail ref="localDetail" @ok="localDetailCallBack" />
      <!-- <examine-modal ref="examineModal" @ok="localDetailCallBack"></examine-modal> -->
    </a-card>
  </template>

  <script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LocalDetail from '@/views/bzgl/bzlb/modules/LocalDetail.vue'
  import { getAction, postAction, deleteAction, uploadAction } from '@/api/manage'
  // import ExamineModal from '@/views/bzgl/bzlb/modules/ExamineModal'
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
      slots: { title: 'categoryTitle' },
      width: 250,
      ellipsis: true
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'realname',
      width: 150,
      ellipsis: true
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      width: 150
    },
    {
      title: '大小(MB)',
      align: 'center',
      dataIndex: 'fileSize',
      width: 100,
      ellipsis: true
    },
    {
      title: '标准',
      align: 'center',
      dataIndex: 'filePath',
      scopedSlots: { customRender: 'filePath' },
      width: 250,
      ellipsis: true
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'isAuditStr',
      width: 80,
      ellipsis: true
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'isAudit_dictText',
      width: 100,
      ellipsis: true
    },
    {
      title: '驳回原因',
      align: 'center',
      dataIndex: 'backReason',
      width: 150,
      ellipsis: true
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: 200,
      ellipsis: true
    }
  ]
  const columns1 = columns.filter(item => item.dataIndex !== 'standardName' && item.dataIndex !== 'fileSize' && item.dataIndex !== 'filePath' && item.dataIndex !== 'isAudit_dictText' && item.dataIndex !== 'backReason' && item.dataIndex !== 'realname'&& item.dataIndex !== 'createTime')
  const columns2 = columns.filter(item => item.dataIndex !== 'isAuditStr')
  export default {
    name: 'Index',
    components: { LocalDetail },
    mixins: [JeecgListMixin],
    data() {
      return {
        dataSource: [],
        model: {},
        rowKey: 'categoryId',
        // 表头
        columns: columns1,
        url: {
          add: '/sys/category/add',
          list: '/standardSystem/standardSystem/folderList',
          childrenList: '/standardSystem/standardSystem/folderChildList',
          fileList: '/standardSystem/standardSystem/fileList',
          deleteOut: '/standardSystem/standardSystem/deleteById',
          delete: '/standardSystem/standardSystem/delete',
          deleteFile: '/standardSystem/standardSystem/deleteFile', // 删除文件
          edit: '/standardSystem/standardSystem/edit ',
          importExcel: '/standardSystem/standardSystem/importExcel'
        },
        allFileShow: true, // 一级文件夹显示
        secondFileShow: false, // 二级文件夹显示
        disabledClick: false, // 文件显示
        fileName: '', // 目录文件名
        secondfileName: '', // 目录二级文件夹名
        visible: false,
        categoryId: '',
        categoryName: '',
        firstName: '', // 一级文件名
        pid: '', // 二级文件夹新建文件参数
        queryParam: {
          auditStatus: 0,
          isAudit:0
        },
      }
    },
    // computed: {
    //   importExcel: function() {
    //     const url = this.$baseUrl + this.url.importExcel
    //     return url
    //   }
    // },
    methods: {
      // 按钮上传文件
      uploadFilesbtn(current, record) {
        if (record) {
          this.$refs.localDetail.editBtn(current, { categoryId: record.categoryId })
        } else {
          this.$refs.localDetail.editBtn(current, { categoryId: this.pid })
        }
      },
      // 二级文件夹时上传文件
      secUploadFile(record) {
        this.$refs.localDetail.edit(record, {})
      },
      // 文件中上传文件
      uploadFiles() {
        // 单条数据点击不需要上传目录，文件夹点击后不需要再选择目录
        this.$refs.localDetail.edit({}, { categoryId: this.categoryId, categoryName: this.categoryName })
      },
      // 全部文件点击
      allFileClick(current) {
        this.loading = true
        this.categoryId = ''
        // this.categoryName = ''
        if (current === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams()// 查询条件
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.allFileShow = true
            this.disabledClick = false
            this.secondFileShow = false
            this.secondfileName = ''
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
          this.categoryId = ''
          this.categoryName = ''
        })
      },
      // 二级文件夹点击
      secondFileClick(record, current) {
        this.loading = true
        if (record) {
          this.$set(this, 'pid', record.categoryId)
          this.firstName = record.categoryName
        }
        if (current === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams()// 查询条件
        params.pid = this.pid
        getAction(this.url.childrenList, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.allFileShow = false
            this.disabledClick = false
            this.secondFileShow = true
            this.secondfileName = '/' + this.firstName
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
      folderClick(record, current, tabCurrent) {
        this.categoryId = record.categoryId
        this.categoryName = record.categoryName
        this.loading = true
        if (current === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams()// 查询条件
        params.categoryId = record.categoryId
        // params.standardName = record.categoryName
        getAction(this.url.fileList, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records

            this.disabledClick = true
            this.secondFileShow = false
            this.fileName = '/' + record.categoryName
            this.rowKey = 'id'
            this.columns = columns2
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            if (tabCurrent == 1) {
              this.allFileShow = true
            } else {
              this.allFileShow = false
            }
            console.log(1111, this.allFileShow)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 上传目录回显
      localDetailCallBack() {
        if (this.disabledClick && !this.secondFileShow) {
          this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
        } else if (!this.disabledClick && this.secondFileShow) {
          this.secondFileClick()
        } else if (!this.disabledClick && !this.secondFileShow) {
          this.allFileClick()
        }
      },
      // 查询
      searchQuery() {
        if (this.secondFileShow) {
          this.secondFileClick()
        }
        if (this.disabledClick && !this.allFileShow) {
          // 在第三层
          this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
        } else if (this.allFileShow) {
          // 在第一层
          if (this.queryParam.standardName) {
            this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1, 1)
          } else {
            this.allFileClick()
          }
        }
      },
      // 重置
      searchReset() {
        this.queryParam = {}
        this.queryParam.auditStatus = 0
        this.queryParam.isAudit = 0
        if (this.secondFileShow) {
          this.secondFileClick()
        }
        if (this.disabledClick && !this.allFileShow) {
          this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName }, 1)
        } else if (this.allFileShow) {
          this.allFileClick(1)
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
        if (this.disabledClick && !this.secondFileShow) {
          this.folderClick({ categoryId: this.categoryId, categoryName: this.categoryName })
        } else if (!this.disabledClick && this.secondFileShow) {
          this.secondFileClick()
        } else if (!this.disabledClick && !this.secondFileShow) {
          this.allFileClick()
        }
      },
      // 新建文件夹
      newFolderClick() {
        this.visible = true
      },
      // 文件编辑
      handleEdit(record) {
        this.loading = true
        postAction(this.url.edit, { author: record.author, id: record.id }).then((res) => {
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
      // 删除文件夹
      handleDelete(id, index) {
        var that = this
        that.loading = true
        let url = ''
        if (index == 1) {
          url = that.url.deleteOut
        } else {
          url = that.url.delete
        }
        deleteAction(url, { id: id }).then((res) => {
          if (res.success) {
            // 重新计算分页问题
            that.reCalculatePage(1)
            that.$message.success(res.message)
            if (index == 1) {
              that.loadData()
              // that.allFileClick(1)
            } else {
              const record = {
                categoryId: that.pid,
                categoryName: that.firstName
              }
              that.secondFileClick(record, 1)
            }
          } else {
            that.$message.warning(res.message)
          }
        }).finally(() => {
          that.loading = false
        })
      },
      // 删除文件
      handleDeleteFile(id, index) {
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
      // 新建文件夹确认
      handleOk(index) {
        const that = this
        if (!this.model.name) {
          this.$message.warning('请先输入文件夹名称')
          return
        }
        if (index == 2) {
          this.model.pid = this.pid
          this.model.type = 12
        } else {
          this.model.pid = ''
          this.model.type = 12
        }
        that.confirmLoading = true
        postAction(this.url.add, this.model).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            if (index == 2) {
              const record = {
                categoryId: that.pid,
                categoryName: that.firstName
              }
              that.secondFileClick(record, 1)
            } else {
              that.loadData()
            }
          } else {
            that.$message.warning(res.message)
          }
        }).finally(() => {
          that.confirmLoading = false
          that.visible = false
          that.model.name = ''
        })
      },
      handleCancel() {
        this.visible = false
        this.model.name = ''
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

