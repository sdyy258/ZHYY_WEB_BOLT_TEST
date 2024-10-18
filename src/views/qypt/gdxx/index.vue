<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="客户">
        <j-search-select-tag v-model="queryParam.customerId" dict="base_enterprise,enterprise_name,id" placeholder="请选择客户" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <a-button type="primary" icon="delete" @click="batchDel">批量删除</a-button>
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
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
        <template v-if="$store.getters.userInfo.userType===1">
          <a v-if="record.ticketStatus!==2" @click="$refs.processingModal.showModal(record)">处理</a>
          <a @click="$refs.processingRecordModal.showModal(record)">处理记录</a>
        </template>
        <template>
          <a v-if="record.isComment===1" @click="$refs.evaluateModal.showModal(record)">评价详情</a>
          <template v-else>
            <a v-if="$store.getters.userInfo.username==='admin' || $store.getters.userInfo.userType===2" @click="$refs.evaluateModal.showModal(record)">工单评价</a>
          </template>
        </template>
      </span>
    </a-table>
    <modal-form ref="modalForm" @ok="modalFormOk" />
    <processing-record-modal ref="processingRecordModal" />
    <processing-modal ref="processingModal" />
    <evaluate-modal ref="evaluateModal" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import ProcessingRecordModal from './processingRecord/IndexModal'
import processingModal from './modules/ProcessingModal'
import EvaluateModal from './modules/EvaluateModal'

export default {
  name: 'Index',
  components: { ModalForm, ProcessingRecordModal, EvaluateModal, processingModal },
  mixins: [JeecgListMixin],
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
          title: '客户',
          align: 'center',
          dataIndex: 'customerId_dictText'
        },
        {
          title: '工单标题',
          align: 'center',
          dataIndex: 'ticketTitle'
        },
        {
          title: '工单描述',
          align: 'center',
          dataIndex: 'ticketDescription',
          customCell: () => ({ style: { 'white-space': 'normal', 'max-width': '400px' }})
        },
        {
          title: '工单状态',
          align: 'center',
          dataIndex: 'ticketStatus_dictText'
        },
        {
          title: '工单的优先级',
          align: 'center',
          dataIndex: 'priority_dictText'
        },
        {
          title: '是否收费',
          align: 'center',
          dataIndex: 'isCharge_dictText'
        },
        {
          title: '服务类型',
          align: 'center',
          dataIndex: 'serviceType_dictText'
        },
        {
          title: '免费服务类型',
          align: 'center',
          dataIndex: 'freeType_dictText'
        },
        {
          title: '收费服务类型',
          align: 'center',
          dataIndex: 'chargeType_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width: 1
        }
      ],
      url: {
        list: '/ywTicketInfo/ywTicketInfo/list',
        delete: '/ywTicketInfo/ywTicketInfo/delete',
        deleteBatch: '/ywTicketInfo/ywTicketInfo/deleteBatch'
      }
    }
  }
}
</script>
