<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="所属企业">
        <j-search-select-tag v-model="queryParam.enterpriseId" dict="base_enterprise,enterprise_name,id" @change="$set(queryParam,'portId',undefined)" />
      </a-form-item>
      <a-form-item label="所属排口">
        <j-search-select-tag
          v-model="queryParam.portId"
          :dict="queryParam.enterpriseId ? `base_discharge_port,name,id,enterprise_id=${queryParam.enterpriseId}` : 'base_discharge_port,name,id'"
        />
      </a-form-item>
      <a-form-item label="设备类型">
        <j-dict-select-tag v-model="queryParam.equipmentType" dict-code="equipment_type" placeholder="请选择设备类型" />
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
        <a @click="$refs.monitorItemModal.showModal(record)">监测项目</a>
        <a @click="$refs.maintenanceRecordModal.showModal(record)">维修记录</a>
      </span>
    </a-table>
    <modal-form ref="modalForm" @ok="modalFormOk" />
    <monitor-item-modal ref="monitorItemModal" @reload="loadData" />
    <maintenance-record-modal ref="maintenanceRecordModal" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import MonitorItemModal from './monitorItem/IndexModal.vue'
import MaintenanceRecordModal from './maintenanceRecord/IndexModal.vue'
export default {
  name: 'Index',
  components: { ModalForm, MonitorItemModal, MaintenanceRecordModal },
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
          title: '所属企业',
          align: 'center',
          dataIndex: 'enterpriseId_dictText'
        },
        {
          title: '所属排口',
          align: 'center',
          dataIndex: 'portId_dictText'
        },
        {
          title: '设备类型',
          align: 'center',
          dataIndex: 'equipmentType_dictText'
        },
        {
          title: '品牌',
          align: 'center',
          dataIndex: 'brand'
        },
        {
          title: '型号',
          align: 'center',
          dataIndex: 'deviceModel'
        },
        {
          title: '联网日期',
          align: 'center',
          dataIndex: 'netTime'
        },
        {
          title: '自验收日期',
          align: 'center',
          dataIndex: 'selfCheckedTime'
        },
        {
          title: '环保产品认证编号',
          align: 'center',
          dataIndex: 'enviNo'
        },
        // {
        //   title: '环保产品认证编号发证日期',
        //   align: 'center',
        //   dataIndex: 'enviStartTime'
        // },
        // {
        //   title: '环保产品认证编号有效日期',
        //   align: 'center',
        //   dataIndex: 'enviEndTime'
        // },
        // {
        //   title: '计量器具型式标准证书',
        //   align: 'center',
        //   dataIndex: 'measureValidity'
        // },
        // {
        //   title: '计量器具型式标准证书发证日期',
        //   align: 'center',
        //   dataIndex: 'measureStartTime'
        // },
        // {
        //   title: '计量器具型式标准证书有效日期',
        //   align: 'center',
        //   dataIndex: 'measureEndTime'
        // },
        // {
        //   title: '环保适用性检测证书',
        //   align: 'center',
        //   dataIndex: 'detectionCert'
        // },
        // {
        //   title: '环保适用性检测证书发证日期',
        //   align: 'center',
        //   dataIndex: 'detectionStartTime'
        // },
        // {
        //   title: '环保适用性检测证书有效日期',
        //   align: 'center',
        //   dataIndex: 'detectionEndTime'
        // },
        {
          title: '监测项目',
          align: 'center',
          dataIndex: 'itemName_dictText'
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
        list: '/baseEquipment/baseEquipment/pageList',
        delete: '/baseEquipment/baseEquipment/delete',
        deleteBatch: '/baseEquipment/baseEquipment/deleteBatch'
      }
    }
  }
}
</script>
