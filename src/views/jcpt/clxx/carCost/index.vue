<template>
  <div>
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="费用类型">
        <j-dict-select-tag v-model="queryParam.expenseType" dict-code="expense_type" placeholder="请选择" />
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
          title: '费用类型',
          align: 'center',
          dataIndex: 'expenseType_dictText'
        },
        {
          title: '费用发生时间',
          align: 'center',
          dataIndex: 'expenseDate'
        },
        {
          title: '费用描述',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '费用金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '申报人',
          align: 'center',
          dataIndex: 'reportPerson'
        },
        {
          title: '保险开始时间',
          align: 'center',
          dataIndex: 'insureStartTime'
        },
        {
          title: '保险结束时间',
          align: 'center',
          dataIndex: 'insureEndTime'
        },
        {
          title: '加油时间',
          align: 'center',
          dataIndex: 'refuelDate'
        },
        {
          title: '燃料类型',
          align: 'center',
          dataIndex: 'fuelType_dictText'
        },
        {
          title: '里程数',
          align: 'center',
          dataIndex: 'mileage'
        },
        {
          title: '加油数（升）或充电时长/度数',
          align: 'center',
          dataIndex: 'fuelCount'
        },
        {
          title: '燃料单价（元/升，元/度）',
          align: 'center',
          dataIndex: 'unitPrice'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remarks'
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
        list: '/baseVehicleExpense/baseVehicleExpense/list',
        delete: '/baseVehicleExpense/baseVehicleExpense/delete',
        deleteBatch: '/baseVehicleExpense/baseVehicleExpense/deleteBatch'
      }
    }
  },
  methods: {
    connectParams(params) {
      params.vehicleId = this.parentInfo.id
    }
  }
}
</script>
