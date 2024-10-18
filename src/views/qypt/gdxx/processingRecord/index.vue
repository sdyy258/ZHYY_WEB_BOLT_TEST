<template>
  <div>
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="处理状态">
        <j-dict-select-tag v-model="queryParam.assignedStatus" dict-code="assigned_status" placeholder="请选择处理状态" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <!--        <a-button v-if="$store.getters.userInfo.userType!==2" type="primary" icon="plus" @click="handleAdd">新增</a-button>-->
      </a-form-item>
    </a-form>
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
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <modal-form ref="modalForm" :parent-info="parentInfo" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
export default {
  name: 'Index',
  components: { ModalForm },
  mixins: [JeecgListMixin],
  props: ['parentInfo'],
  data() {
    return {
      // 表头
      columns: [
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
          title: '所属运维组',
          align: 'center',
          dataIndex: 'deptId_dictText'
        },
        {
          title: '处理人员',
          align: 'center',
          dataIndex: 'assignedId_dictText'
        },
        {
          title: '工单处理时间',
          align: 'center',
          dataIndex: 'assignedTime'
        },
        {
          title: '处理状态',
          align: 'center',
          dataIndex: 'assignedStatus_dictText'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'action' },
        //   width: 1
        // }
      ],
      url: {
        list: '/ywTicketHandler/ywTicketHandler/list',
        delete: '/ywTicketHandler/ywTicketHandler/delete',
        deleteBatch: '/ywTicketHandler/ywTicketHandler/deleteBatch'
      }
    }
  },
  // created() {
  //   if (this.$store.getters.userInfo.userType === 2) {
  //     this.columns = this.columns.filter(i => i.dataIndex !== 'action')
  //   }
  // },
  methods: {
    connectParams(params) {
      params.ticketId = this.parentInfo.id
    }
  }
}
</script>
