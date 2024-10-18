<template>
  <a-card class="j-address-list-right-card-box" :loading="cardLoading" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :model="queryParam">
        <a-row :gutter="10">

          <a-col :md="6" :sm="12">
            <a-form-model-item label="姓名" prop="realname" style="margin-left:8px">
              <a-input v-model="queryParam.realname" placeholder="请输入姓名查询" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="12">
            <a-form-model-item label="账号" prop="username" style="margin-left:8px">
              <a-input v-model="queryParam.username" placeholder="请输入账号查询" />
            </a-form-model-item>
          </a-col>

          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="search" style="margin-left: 18px" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form-model>
    </div>

    <a-table
      ref="table"
      size="middle"
      bordered
      row-key="userId"
      :pagination="ipagination"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="action" slot-scope="text,record">
        <a @click="handleEdit(record)">编辑</a>
      </template>
    </a-table>
    <user-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import UserModal from './UserModal'
export default {
  name: 'AddressListRight',
  components: { UserModal },
  mixins: [JeecgListMixin],
  props: ['value'],
  data() {
    return {
      description: '用户信息',
      cardLoading: true,
      positionInfo: {},
      columns: [
        {
          title: '序号',
          key: 'rowIndex',
          dataIndex: '',
          width: '8%',
          align: 'center',
          customRender: (t, r, i) => parseInt(i) + 1
        },
        {
          title: '账号',
          width: '15%',
          align: 'center',
          dataIndex: 'username',
          ellipsis: true
        },
        {
          title: '姓名',
          width: '15%',
          align: 'center',
          dataIndex: 'realname',
          ellipsis: true
        },
        {
          title: '部门',
          width: '20%',
          align: 'center',
          dataIndex: 'orgCodePid_dictText',
          ellipsis: true
        },
        // {
        //   title: '身份证号码',
        //   width: '20%',
        //   align: 'center',
        //   dataIndex: 'idNoEncryption',
        //   ellipsis: true
        // },
        {
          title: '手机',
          width: '15%',
          align: 'center',
          dataIndex: 'phone',
          ellipsis: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: '12%'
        }
      ],
      url: {
        list: '/sys/user/addressBook',
        listByPosition: '/sys/position/list'
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(orgCode) {
        this.dataSource = []
        this.loadData(1, orgCode)
      }
    }
  },
  created() {
    this.queryPositionInfo()
  },
  methods: {

    loadData(pageNum, orgCode) {
      this.loading = true
      if (pageNum === 1) {
        this.ipagination.current = 1
      }
      // update-begin- --- author:wangshuai ------ date:20200102 ---- for:传过来的部门编码为空全查
      if (!orgCode) {
        getAction(this.url.list, {
          ...this.getQueryParams()
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
          this.cardLoading = false
        })
        // update-end- --- author:wangshuai ------ date:20200102 ---- for:传过来的部门编码为空全查
      } else {
        // 加载数据 若传入参数1则加载第一页的内容
        getAction(this.url.list, {
          orgCode,
          ...this.getQueryParams()
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
          this.cardLoading = false
        })
      }
    },

    searchQuery() {
      this.loadData(1, this.value)
    },
    searchReset() {
      this.$emit('resetTree')
      this.queryParam = {}
      // this.loadData(1, this.value)
      this.loadData(1, null)
    },

    handleTableChange(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData(null, this.value)
    },

    // 查询职务信息
    queryPositionInfo() {
      getAction(this.url.listByPosition, { pageSize: 99999 }).then(res => {
        if (res.success) {
          const positionInfo = {}
          res.result.records.forEach(record => {
            positionInfo[record['code']] = record['name']
          })
          this.positionInfo = positionInfo
        }
      })
    },
    modalFormOk() {
      this.loadData()
    }

  }
}
</script>
<style>
  .j-address-list-right-card-box .ant-table-placeholder {
    min-height: 46px;
  }
</style>
<style scoped>
  .j-address-list-right-card-box {
    height: 100%;
    min-height: 300px;
  }
</style>
