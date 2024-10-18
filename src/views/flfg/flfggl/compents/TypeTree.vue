<template>
  <a-card>
    <div>
      <div class="main-class">
        <a-icon
          type="folder"
          theme="filled"
          style="color:#FFC35E;font-size: 18px;margin-right: 5px;"
        />
        <a-tooltip>
          <template slot="title">新增分类</template>
          <a-icon type="plus-circle" @click="handleAdd" />
        </a-tooltip>
      </div>
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
        <span slot="name" slot-scope="text, record" class="nameStytle" @click="folderClick(record)">
          <a>
            <a-icon
              type="folder"
              theme="filled"
              style="color:#FFC35E;font-size: 18px;margin-right: 5px;"
            />
            <span :title="text">{{ text }}</span>
            <!-- <a-tooltip>
              <template slot="title">{{ text }}</template>
              <span v-if="text.length>5">{{ `${text.slice(0, 5)}...` }}</span>
              <span v-else>{{ text }}</span>
            </a-tooltip> -->
          </a>
        </span>
        <span slot="action" slot-scope="text, record" class="button">
          <a-icon type="form" @click="handleEdit(record)" />
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a-icon type="rest" />
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-tooltip v-if="record.pid == '0'">
            <template slot="title">添加子分类</template>
            <a-icon type="plus" @click="handleAddSub(record)" />
          </a-tooltip>
          <a-divider v-if="record.pid == '0'" type="vertical" />
          <a-tooltip v-if="record.pid == '0'">
            <template slot="title">同级添加</template>
            <a-icon type="plus-circle" @click="handleAdd" />
          </a-tooltip>
          <a-icon />
        </span>
      </a-table>
    </div>
    <sysCategory-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction } from '@/api/manage'
import SysCategoryModal from './TypeTreeModal'

export default {
  name: 'TypeTree',
  components: {
    SysCategoryModal
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      columns: [
        {
          title: '分类名称',
          align: 'left',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '65%',
          ellipsis: true

        },
        {
          title: '',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: '35%'
        }
      ],
      url: {
        list: '/sys/category/rootList',
        childList: '/sys/category/childList',
        getChildListBatch: '/sys/category/getChildListBatch',
        delete: '/sys/category/delete',
        deleteBatch: '/sys/category/deleteBatch'
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      subExpandedKeys: []
    }
  },
  created() {

  },
  methods: {
    // 重置
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
      this.loading = true
      const params = this.getQueryParams()
      params.type = 11
      params.pageSize = 500
      return new Promise((resolve) => {
        getAction(this.url.list, params).then(res => {
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
          }
        }).finally(() => {
          this.loading = false
        })
      })
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
    handleDelete(record) {
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
    // 新增子分类
    handleAddSub(record) {
      this.subExpandedKeys = []
      this.getExpandKeysByPid(record.id, this.dataSource, this.dataSource)
      this.$refs.modalForm.subExpandedKeys = this.subExpandedKeys
      this.$refs.modalForm.title = '添加子分类'
      this.$refs.modalForm.edit({ 'pid': record.id, type: record.type })
      this.$refs.modalForm.disableSubmit = false
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
    // 同级添加
    handleAdd() {
      this.$refs.modalForm.add(1)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.disableSubmit = false
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';

.main-class {
  position: absolute;
  z-index: 99;
  margin: 16px 0 0 79%;
}

/deep/ .ant-card-body {
  padding: 20;
}

/deep/ .ant-table {
  @selected-color: #dff1ff; //表格悬浮行背景色
  table {
    tr {
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
