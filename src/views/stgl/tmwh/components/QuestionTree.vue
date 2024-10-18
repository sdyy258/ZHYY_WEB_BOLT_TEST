<template>
  <a-card :bordered="false">
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :expanded-row-keys="expandedRowKeys"
        :pagination="false"
        :loading="loading"
        style="margin: -20px;"
        @change="handleTableChange"
        @expand="handleExpand"
      >
        <span slot="name" slot-scope="text, record" class="nameStytle">
          <a @click="folderClick(record)">
            <template slot="title">{{ text }}</template>
            <a-icon type="folder" theme="filled" style="color:#FFC35E;font-size: 18px;margin-right: 5px;" />
            <a-tooltip v-if="roleList.indexOf('dsgly') > -1">
              <span v-if="text.length > 12">{{ `${text.slice(0, 12)}...` }}</span>
              <span v-else>{{ text }}</span>
            </a-tooltip>
            <a-tooltip v-else>
              <template slot="title">{{ text }}</template>
              <span v-if="text.length > 10">{{ `${text.slice(0, 10)}...` }}（{{ record.itemCount || '0' }}）</span>
              <span v-else>{{ text }}（{{ record.itemCount || '0' }}）</span>
            </a-tooltip>
            <!-- <span>{{ text }}（0）</span> -->
          </a>
        </span>
        <!-- <span slot="action" slot-scope="text, record" class="button">
          <i class="el-icon-edit-outline" @click="handleEdit(record)" />
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <el-button type="text" class="el-icon-delete" size="mini" />
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-tooltip>
            <template slot="title">添加子分类</template>
            <el-button type="text" class="el-icon-plus" size="mini" @click="handleAddSub(record)" />
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip>
            <template slot="title">同级添加</template>
            <el-button
              v-if="record.pid == '0'"
              type="text"
              class="el-icon-circle-plus"
              size="mini"
              @click="handleAdd"
            />
          </a-tooltip>
        </span> -->
      </a-table>
    </div>
    <!-- <sysCategory-modal ref="modalForm" @ok="modalFormOk" /> -->
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
// import SysCategoryModal from './modules/QuestionModal'
import { deleteAction } from '@/api/manage'

export default {
  name: 'SysCategoryList',
  components: {
    // SysCategoryModal
  },
  mixins: [JeecgListMixin],
  props: {
    // 树的类型
    treeType: {
      type: String
      // default:''
    }
  },
  data() {
    return {
      description: '分类字典管理页面',
      queryParam: {
        type: ''
      },
      // 分页
      columns: [],
      // 表头
      columns1: [
        {
          title: '试题分类',
          align: 'left',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '试卷分类',
          align: 'left',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '',
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
      dictOptions: {},
      subExpandedKeys: [],
      activeId: ''
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
          onChange: selectedRowKeys => (_this.selectedRowKeys = selectedRowKeys)
        }
      }
    },
    roleList() {
      return this.$store.getters.userInfo.roles.split(',')
    }
  },
  watch: {
    queryParam: {
      handler(val) {
        val.type = this.treeType
      }
    }
  },
  created() {
    if (this.treeType == 1) {
      this.columns = this.columns1
    } else {
      this.columns = this.columns2
    }
  },
  methods: {
    //  点击节点
    folderClick(e) {
      this.activeId = e.id
      this.setCurrentSelected()
      this.$emit('ok', e.id)
    },
    setCurrentSelected() {
      this.$nextTick(() => {
        const element = document.getElementsByClassName('ant-table-row')
        for (let i = 0; i < element.length; i++) {
          const key = element[i].getAttribute('data-row-key')
          if (key === this.activeId) {
            element[i].classList.add('cu-selected')
          } else {
            element[i].classList.remove('cu-selected')
          }
        }
      })
    },
    // 刷新选择
    refreshSelect() {
      this.loadData()
    },
    //  重置选择
    reset() {
      const element = document.getElementsByClassName('ant-table-row')
      for (let i = 0; i < element.length; i++) {
        element[i].classList.remove('cu-selected')
      }
    },
    loadData(arg) {
      if (arg == 1) {
        this.ipagination.current = 1
      }
      const treeType = this.treeType
      const param = {
        type: treeType,
        pageSize: 500,
        needCountItem: 1,
        column: 'categorySort',
        order: 'asc'
      }
      this.loading = true
      // let params = this.getQueryParams()
      return new Promise(resolve => {
        getAction(this.url.list, param)
          .then(res => {
            if (res.success) {
              const result = res.result
              if (Number(result.total) > 0) {
                this.ipagination.total = Number(result.total)
                this.dataSource = this.getDataByResult(res.result.records)
                return this.loadDataByExpandedRows(this.dataSource)
              } else {
                this.ipagination.total = 0
                this.dataSource = []
              }
            } else {
              this.$message.warning(res.message)
            }
          })
          .finally(() => {
            this.loading = false
            this.setCurrentSelected()
          })
      })
    },
    handleAdd() {
      this.$refs.modalForm.add(this.treeType)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.disableSubmit = false
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
          const params = this.getQueryParams() // 查询条件
          params[this.pidField] = record.id
          params['needCountItem'] = 1
          params['column'] = 'categorySort'
          params['order'] = 'asc'
          getAction(this.url.childList, params).then(res => {
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
    initDictConfig() {},
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
        this.loadData()
      }
    },
    expandTreeNode(nodeId) {
      return new Promise((resolve, reject) => {
        this.getFormDataById(nodeId, this.dataSource)
        const row = this.parentFormData
        this.expandedRowKeys.push(nodeId)
        const params = this.getQueryParams() // 查询条件
        params[this.pidField] = nodeId
        getAction(this.url.childList, params).then(res => {
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
      this.$refs.modalForm.edit({ pid: record.id, type: record.type })
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete: function(record) {
      const that = this
      deleteAction(that.url.delete, { id: record.id }).then(res => {
        if (res.success) {
          // update--begin--autor:lvdandan-----date:20201204------for：JT-31 删除成功后默认展开已展开信息
          that.loadData()
          // 走管理页面，分类置空
          this.$emit('ok', '')
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
        return getAction(this.url.getChildListBatch, {
          parentIds: this.expandedRowKeys.join(','),
          needCountItem: 1
        }).then(res => {
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
            const fn = list => {
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
<style lang="less" scoped>
@import '~@assets/less/common.less';
/deep/ .ant-card-body {
  padding: 20;
}

/deep/ .ant-table {
  @selected-color: #dff1ff; //表格悬浮行背景色
  table {
    tr {
      // &.ant-table-row:hover > td { //无固定列
      //   background: @selected-color;
      // }

      // &.ant-table-row-hover td { //有固定列
      //   background: @selected-color;
      // }

      &.cu-selected {
        background: @selected-color;
      }
    }
  }
}
.button {
  cursor: pointer;
}
</style>
