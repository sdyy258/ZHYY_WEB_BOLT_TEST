<template>
  <a-modal
    centered
    :title="title"
    :class="$store.state.app.layout"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    :destroy-on-close="true"
    width="800px"
    @cancel="cancel"
  >
    <span slot="footer">
      <a-button type="primary" @click="cancel">返回</a-button>
    </span>
    <div class="table-wrap">
      <div style="margin: 0 106px;">
        <span><a-icon
          type="folder"
          theme="filled"
          style="color:#FFC35E;font-size: 18px;margin-right: 5px;"
        /></span>
        <a-tooltip>
          <template slot="title">新增分类</template>
          <el-button
            type="text"
            class="el-icon-circle-plus"
            size="mini"
            @click="handleAdd"
          />
        </a-tooltip>
      </div>
      <a-table
        ref="table"
        size="middle"
        row-key="id"
        :show-header="false"
        :columns="columns"
        :data-source="dataSource"
        :expanded-row-keys="expandedRowKeys"
        :pagination="false"
        :loading="loading"
        style="padding: 0px 100px;"
        @change="handleTableChange"
        @expand="handleExpand"
      >
        <span slot="name" slot-scope="text, record" class="nameStytle">
          <a @click="folderClick(record)">
            <a-icon
              type="folder"
              theme="filled"
              style="color:#FFC35E;font-size: 18px;margin-right: 5px;"
            />
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              <span v-if="text.length>20">{{ `${text.slice(0, 20)}...` }}</span>
              <span v-else>{{ text }}</span>
            </a-tooltip>
          </a>
        </span>
        <span slot="action" slot-scope="text, record" class="button">
          <i class="el-icon-edit-outline" @click="handleEdit(record)" />
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <el-button type="text" class="el-icon-delete" size="mini" />
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-tooltip v-if="queryParam.type ==10">
            <template v-if="record.pid == '0'" slot="title">添加子分类</template>
            <el-button v-if="record.pid == '0'" type="text" class="el-icon-plus" size="mini" @click="handleAddSub(record)" />
          </a-tooltip>
          <a-tooltip v-else>
            <template slot="title">添加子分类</template>
            <el-button type="text" class="el-icon-plus" size="mini" @click="handleAddSub(record)" />
          </a-tooltip>
          <a-divider v-if="record.pid == '0'" type="vertical" />
          <a-tooltip v-if="record.pid == '0'">
            <template slot="title">同级添加</template>
            <el-button
              type="text"
              class="el-icon-circle-plus"
              size="mini"
              @click="handleAdd"
            />
          </a-tooltip>
        </span>
      </a-table>
    </div>
    <main-modal ref="modalForm" @ok="modalFormOk" />
  </a-modal>

</template>
<script>
import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MainModal from './MainModal'
import { deleteAction } from '@/api/manage'
export default {
  name: 'SysCategoryList',
  components: {
    MainModal
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      visible: false,
      title: '',
      disableMixinCreated: true,
      queryParam: {
        type: ''
      },
      // 分页
      // 表头
      columns: [
        {
          title: '考核项维护',
          align: 'left',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        // {
        //   title: '分类编码',
        //   align: 'left',
        //   dataIndex: 'code'
        // },
        {
          title: '',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/category/rootList',
        // list: '/blindExamine/blindExamine/addBlindCategory',
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
      type: ''
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
    }
  },
  methods: {
    showModal(type) {
      this.visible = true
      this.queryParam.type = type
      this.type = type
      this.disableMixinCreated = false
      this.loadData()
    },
    //  点击节点
    folderClick(e) {
      const element = document.getElementsByClassName('ant-table-row')
      for (let i = 0; i < element.length; i++) {
        const key = element[i].getAttribute('data-row-key')
        if (key === e.id) {
          element[i].classList.add('cu-selected')
        } else {
          element[i].classList.remove('cu-selected')
        }
      }
      const that = this
      const params = {
        categoryId: e.id
      }
      that.$emit('ok', e.id)
    },
    //  重置选择
    reset() {
      const element = document.getElementsByClassName('ant-table-row')
      for (let i = 0; i < element.length; i++) {
        element[i].classList.remove('cu-selected')
      }
      this.loadData()
    },
    loadData(arg) {
      if (arg == 1) {
        this.ipagination.current = 1
      }
      const param = {
        type: this.type,
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
          })
      })
    },
    handleAdd() {
      this.$refs.modalForm.add(this.type)
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
      this.$refs.modalForm.edit({ 'pid': record.id, type: record.type })
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete: function(record) {
      const that = this
      deleteAction(that.url.delete, { id: record.id }).then(res => {
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
        return getAction(this.url.getChildListBatch, { parentIds: this.expandedRowKeys.join(','), needCountItem: 1 }).then(res => {
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
    },
    handleOk() {
      this.$emit('ok', '')
      this.visible = false
    },
    cancel() {
      this.$emit('ok', '')
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
.table-wrap{
  max-height: 500px;
  overflow-y: scroll;
}
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
.button{
  cursor: pointer;
}
</style>
