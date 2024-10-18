<template>
  <a-card :bordered="false">
    <!-- 查询区域   -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="类型">
              <JDictSelectTag v-model="queryParam.type" placeholder="请输入类型" dict-code="categoryType" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('分类字典')">导出</a-button>
      <a-upload name="file" :show-upload-list="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon" /> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expanded-row-keys="expandedRowKeys"
        v-bind="tableProps"
        @change="handleTableChange"
        @expand="handleExpand"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleAddSub(record)">添加下级</a>
        </span>

      </a-table>
    </div>

    <sysCategory-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>

import { getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SysCategoryModal from './modules/SysCategoryModal'
import { deleteAction } from '@/api/manage'

export default {
  name: 'SysCategoryList',
  components: {
    SysCategoryModal
  },
  mixins: [JeecgListMixin],
  data() {
    return {

      isorter: {
        column: 'categorySort',
        order: 'asc'
      },
      description: '分类字典管理页面',
      // 表头
      columns: [
        {
          title: '分类名称',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title: '分类编码',
          align: 'left',
          dataIndex: 'code'
        },
        {
          title: '排序',
          align: 'left',
          dataIndex: 'categorySort'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/category/rootList',
        childList: '/sys/category/childList',
        getChildListBatch: '/sys/category/getChildListBatch',
        delete: '/sys/category/delete',
        deleteBatch: '/sys/category/deleteBatch',
        exportXlsUrl: '/sys/category/exportXls',
        importExcelUrl: 'sys/category/importExcel'
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      dictOptions: {
      },
      subExpandedKeys: []
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    tableProps() {
      const _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selectedRowKeys: _this.selectedRowKeys,
          onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  methods: {
    loadData(arg) {
      if (arg == 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      return new Promise((resolve) => {
        getAction(this.url.list, params).then(res => {
          if (res.success) {
            const result = res.result
            if (Number(result.total) > 0) {
              this.ipagination.total = Number(result.total)
              this.dataSource = this.getDataByResult(res.result.records)
              // update--begin--autor:lvdandan-----date:20201204------for：JT-31 删除成功后默认展开已展开信息
              return this.loadDataByExpandedRows(this.dataSource)
              // update--end--autor:lvdandan-----date:20201204------for：JT-31 删除成功后默认展开已展开信息
            } else {
              this.ipagination.total = 0
              this.dataSource = []
            }
          } else {
            this.$message.warning(res.message)
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
          if (item[this.hasChildrenField] == '1') {
            const loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      }
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.id)
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          const params = this.getQueryParams()// 查询条件
          params[this.pidField] = record.id
          getAction(this.url.childList, params).then((res) => {
            if (res.success) {
              if (res.result && res.result.length > 0) {
                record.children = this.getDataByResult(res.result)
                this.dataSource = [...this.dataSource]
              } else {
                record.children = ''
                record.hasChildrenField = '0'
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        const keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    initDictConfig() {
    },
    modalFormOk(formData, arr) {
      if (!formData.id) {
        this.addOk(formData, arr)
      } else {
        this.editOk(formData, this.dataSource)
        this.dataSource = [...this.dataSource]
      }
    },
    editOk(formData, arr) {
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == formData.id) {
            arr[i] = formData
            break
          } else {
            this.editOk(formData, arr[i].children)
          }
        }
      }
    },
    async addOk(formData, arr) {
      if (!formData[this.pidField]) {
        this.loadData()
      } else {
        this.expandedRowKeys = []
        console.log('22222', arr)
        for (const i of arr) {
          await this.expandTreeNode(i)
        }
      }
    },
    expandTreeNode(nodeId) {
      return new Promise((resolve, reject) => {
        this.getFormDataById(nodeId, this.dataSource)
        const row = this.parentFormData
        this.expandedRowKeys.push(nodeId)
        const params = this.getQueryParams()// 查询条件
        params[this.pidField] = nodeId
        getAction(this.url.childList, params).then((res) => {
          console.log('11111', res)
          if (res.success) {
            if (res.result && res.result.length > 0) {
              row.children = this.getDataByResult(res.result)
              this.dataSource = [...this.dataSource]
              resolve()
            } else {
              row.children = ''
              row.hasChildrenField = '0'
              reject()
            }
          } else {
            reject()
          }
        })
      })
    },
    getFormDataById(id, arr) {
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == id) {
            this.parentFormData = arr[i]
          } else {
            this.getFormDataById(id, arr[i].children)
          }
        }
      }
    },
    handleAddSub(record) {
      this.subExpandedKeys = []
      this.getExpandKeysByPid(record.id, this.dataSource, this.dataSource)
      this.$refs.modalForm.subExpandedKeys = this.subExpandedKeys
      this.$refs.modalForm.title = '添加子分类'
      this.$refs.modalForm.edit({ 'pid': record.id, type: record.type })
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete: function(record) {
      const that = this
      deleteAction(that.url.delete, { id: record.id }).then((res) => {
        if (res.success) {
          // update--begin--autor:lvdandan-----date:20201204------for：JT-31 删除成功后默认展开已展开信息
          that.loadData()
          // update--end--autor:lvdandan-----date:20201204------for：JT-31 删除成功后默认展开已展开信息
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    // 添加子分类时获取所有父级id
    getExpandKeysByPid(pid, arr, all) {
      if (pid && arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == pid) {
            this.subExpandedKeys.push(arr[i].id)
            this.getExpandKeysByPid(arr[i]['pid'], all, all)
          } else {
            this.getExpandKeysByPid(pid, arr[i].children, all)
          }
        }
      }
    },
    // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
    loadDataByExpandedRows(dataList) {
      if (this.expandedRowKeys.length > 0) {
        return getAction(this.url.getChildListBatch, { parentIds: this.expandedRowKeys.join(',') }).then(res => {
          if (res.success && res.result.records.length > 0) {
            // 已展开的数据批量子节点
            const records = res.result.records
            const listMap = new Map()
            for (const item of records) {
              const pid = item[this.pidField]
              if (this.expandedRowKeys.join(',').includes(pid)) {
                let mapList = listMap.get(pid)
                if (mapList == null) {
                  mapList = []
                }
                mapList.push(item)
                listMap.set(pid, mapList)
              }
            }
            const childrenMap = listMap
            const fn = (list) => {
              if (list) {
                list.forEach(data => {
                  if (this.expandedRowKeys.includes(data.id)) {
                    data.children = this.getDataByResult(childrenMap.get(data.id))
                    fn(data.children)
                  }
                })
              }
            }
            fn(dataList)
          }
        })
      } else {
        return Promise.resolve()
      }
    }

  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
