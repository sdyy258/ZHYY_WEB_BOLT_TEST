<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1000"
      :visible="visible"
      cancel-text="关闭"
      @ok="handleOk"
      @cancel="handleCancel"
    >

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="用户账号">
                <a-input v-model="queryParam.username" placeholder="请输入用户账号" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.realname" placeholder="请输入姓名" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="所属机构">
                <a-tree-select
                  v-model="queryParam.departIds"
                  placeholder="请选择所属机构"
                  :tree-data="departList"
                  allow-clear
                  :dropdown-style="{maxHeight: '200px',overflow: 'auto'}"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
                <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- table区域-begin -->
      <div>
        <a-table
          size="small"
          bordered
          row-key="id"
          :columns="columns1"
          :data-source="dataSource1"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ y: 400 }"
          :row-selection="{selectedRowKeys: selectedRowKeys,selectedRows:selectedRows,onSelectAll:onSelectAll,onSelect:onSelect,onChange: onSelectChange}"
          @change="handleTableChange"
        />
      </div>
      <!-- table区域-end -->

    </a-modal>
  </div>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'

export default {
  name: 'SelectUserModal',
  props: {
    departList: {
      type: Array,
      default: ''
    }
  },
  data() {
    return {
      title: '添加已有用户',
      names: [],
      visible: false,
      placement: 'right',
      description: '',
      // 查询条件
      queryParam: {},
      // 表头
      columns1: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 50,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '用户账号',
          align: 'center',
          width: 100,
          dataIndex: 'username'
        },
        {
          title: '姓名',
          align: 'center',
          width: 100,
          dataIndex: 'realname'
        },
        // {
        //   title: '性别',
        //   align: 'center',
        //   width: 100,
        //   dataIndex: 'sex_dictText'
        // },
        // {
        //   title: '电话',
        //   align: 'center',
        //   width: 100,
        //   dataIndex: 'phone'
        // },
        {
          title: '所属机构',
          align: 'center',
          width: 150,
          dataIndex: 'departIds_dictText'
        }
      ],
      columns2: [
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username'

        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 数据集
      dataSource1: [],
      dataSource2: [],
      // 分页参数
      ipagination: {
        current: 1,
        pageSize: 20,
        pageSizeOptions: ['20', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      url: {
        list: '/tExamPaperUser/tExamPaperUser/examSelectableUsers'
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    showModal(userIds, name) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.dataSource2 = []
      this.selectedRowKeys = [...userIds]
      const realname = [...name]
      console.log(this.selectedRowKeys, this.dataSource1)
      this.selectedRowKeys.map((item, index) => {
        const obj = {
          id: item,
          realname: realname[index]
        }
        this.selectedRows.push(obj)
        this.dataSource2.push(obj)
      })
      // for (const i in this.selectedRowKeys) {
      //   this.dataSource1.forEach(item => {
      //     if (this.selectedRowKeys[i] == item.id) {
      //       this.selectedRows.push(item)
      //       this.dataSource2.push(item)
      //     }
      //   })
      // }
      console.log(1111, this.dataSource2)
    },
    searchQuery() {
      this.loadData(1)
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      // this.dataSource1.map(item => {
      //   this.selectionRows = this.selectedRowKeys.find(i => i === item.id)
      // })
      // this.dataSource2 = this.selectedRowKeys
      console.log('data:' + this.dataSource2)
      this.$emit('selectFinished', this.selectedRowKeys, this.dataSource2)
      this.visible = false
    },
    add() {
      this.visible = true
    },
    loadData(arg) {
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource1 = res.result.records
          this.ipagination.total = res.result.total
        }
      })
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField() {
      // TODO 字段权限控制
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected === true) {
        for (var a = 0; a < changeRows.length; a++) {
          this.dataSource2.push(changeRows[a])
        }
      } else {
        for (var b = 0; b < changeRows.length; b++) {
          this.dataSource2.splice(this.dataSource2.indexOf(changeRows[b]), 1)
        }
      }
      // console.log(selected, selectedRows, changeRows);
    },
    onSelect(record, selected) {
      if (selected === true) {
        this.dataSource2.push(record)
        // const unique = this.dataSource2.filter(
        //   (obj, index) =>
        //     this.dataSource2.findIndex((item) => item.location === obj.location) === index
        // )
      } else {
        this.dataSource2.forEach((item, index) => {
          if (item.id == record.id) {
            this.dataSource2.splice(index, 1)
          }
        })
        // var index = this.dataSource2.indexOf(record)
        // if (index >= 0) {
        //   this.dataSource2.splice(this.dataSource2.indexOf(record), 1)
        // }
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectedRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    handleDelete: function(record) {
      this.dataSource2.splice(this.dataSource2.indexOf(record), 1)
    },
    handleTableChange(pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      console.log(sorter)
      // TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    }
  }
}
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>
