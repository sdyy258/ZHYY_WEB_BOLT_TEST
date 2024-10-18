<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="所属企业">
        <j-search-select-tag v-model="queryParam.enterpriseId" dict="base_enterprise,enterprise_name,id" />
      </a-form-item>
      <a-form-item label="排放口名称">
        <a-input v-model.trim="queryParam.name" placeholder="请输入排放口名称" />
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
    <modal-form ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
export default {
  name: 'Index',
  components: { ModalForm },
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
          title: '排放口名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '排放口编号',
          align: 'center',
          dataIndex: 'code'
        },
        // {
        //   title: '经度',
        //   align: 'center',
        //   dataIndex: 'longitude'
        // },
        // {
        //   title: '纬度',
        //   align: 'center',
        //   dataIndex: 'latitude'
        // },
        {
          title: '排放方式',
          align: 'center',
          dataIndex: 'portType_dictText'
        },
        {
          title: '排口类型',
          align: 'center',
          dataIndex: 'type_dictText'
        },
        {
          title: '联网级别',
          align: 'center',
          dataIndex: 'netLevel_dictText'
        },
        {
          title: '管理类别',
          align: 'center',
          dataIndex: 'manageType_dictText'
        },
        {
          title: '是否折算',
          align: 'center',
          dataIndex: 'isDiscount_dictText'
        },
        {
          title: '探头安装位置',
          align: 'center',
          dataIndex: 'monitorLocation'
        },
        {
          title: '采样处当量直径',
          align: 'center',
          dataIndex: 'monitorDiameter'
        },
        {
          title: '监测平台高度',
          align: 'center',
          dataIndex: 'monitorHeight'
        },
        {
          title: '采样处烟道截面积',
          align: 'center',
          dataIndex: 'monitorArea'
        },
        {
          title: '排气筒高度(m)',
          align: 'center',
          dataIndex: 'height'
        },
        {
          title: '运维方式',
          align: 'center',
          dataIndex: 'maintenMode'
        },
        {
          title: '运维公司名称',
          align: 'center',
          dataIndex: 'maintenCom'
        },
        {
          title: '运维人员',
          align: 'center',
          dataIndex: 'maintenPerson'
        },
        {
          title: '运维人员手机号',
          align: 'center',
          dataIndex: 'maintenPersonPhone'
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
        list: '/baseDischargePort/baseDischargePort/list',
        delete: '/baseDischargePort/baseDischargePort/delete',
        deleteBatch: '/baseDischargePort/baseDischargePort/deleteBatch'
      }
    }
  }
}
</script>
