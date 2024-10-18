<template>
  <div>
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="运维类型">
        <j-dict-select-tag v-model="queryParam.type" dict-code="maintenance_type" placeholder="请选择运维类型" />
      </a-form-item>
      <a-form-item label="故障类型">
        <j-dict-select-tag v-model="queryParam.faultType" dict-code="fault_type" placeholder="请选择故障类型" />
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
          title: '运维类型',
          align: 'center',
          dataIndex: 'type_dictText'
        },
        {
          title: '故障类型',
          align: 'center',
          dataIndex: 'faultType_dictText'
        },
        {
          title: '现场打卡经度',
          align: 'center',
          dataIndex: 'longitude'
        },
        {
          title: '现场打卡纬度',
          align: 'center',
          dataIndex: 'latitude'
        },
        {
          title: '现场情况描述',
          align: 'center',
          dataIndex: 'utf8mb4'
        },
        {
          title: '解决方案',
          align: 'center',
          dataIndex: 'solution'
        },
        {
          title: '运维人员',
          align: 'center',
          dataIndex: 'maintenancePerson'
        },
        {
          title: '记录时间',
          align: 'center',
          dataIndex: 'recordTime'
        },
        {
          title: '确认人',
          align: 'center',
          dataIndex: 'confirmBy'
        },
        {
          title: '确认时间',
          align: 'center',
          dataIndex: 'confirmTime'
        },
        {
          title: '确认意见',
          align: 'center',
          dataIndex: 'confirmReason'
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
        list: '/baseEquMaintenanceRecord/baseEquMaintenanceRecord/list',
        delete: '/baseEquMaintenanceRecord/baseEquMaintenanceRecord/delete',
        deleteBatch: '/baseEquMaintenanceRecord/baseEquMaintenanceRecord/deleteBatch'
      }
    }
  },
  methods: {
    connectParams(params) {
      params.equipmentId = this.parentInfo.id
    }
  }
}
</script>
