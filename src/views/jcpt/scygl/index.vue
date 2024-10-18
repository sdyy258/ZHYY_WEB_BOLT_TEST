<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="所属企业">
        <j-search-select-tag v-model="queryParam.enterpriseId" dict="base_enterprise,enterprise_name,id" />
      </a-form-item>
      <a-form-item label="数采仪生产商">
        <j-input v-model.trim="queryParam.brand" placeholder="请输入数采仪生产商" />
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
          title: '数采仪生产商',
          align: 'center',
          dataIndex: 'brand'
        },
        {
          title: '是否2017版212规约',
          align: 'center',
          dataIndex: 'isOld_dictText'
        },
        {
          title: '数采仪型号',
          align: 'center',
          dataIndex: 'scyType'
        },
        {
          title: '数采仪出厂编号',
          align: 'center',
          dataIndex: 'scyCode'
        },
        {
          title: '网络类型',
          align: 'center',
          dataIndex: 'netType_dictText'
        },
        {
          title: '无线传输卡号',
          align: 'center',
          dataIndex: 'iccId'
        },
        {
          title: 'mn号',
          align: 'center',
          dataIndex: 'mn'
        },
        {
          title: '设备地址',
          align: 'center',
          dataIndex: 'scyAddress'
        },
        {
          title: '适用性及监测报告文号',
          align: 'center',
          dataIndex: 'scyReportNo'
        },
        {
          title: '报告文号发证日期',
          align: 'center',
          dataIndex: 'reportStartTime'
        },
        {
          title: '报告文号有效日期',
          align: 'center',
          dataIndex: 'reportEndTime'
        },
        {
          title: '生产许可证编号',
          align: 'center',
          dataIndex: 'licenceCode'
        },
        {
          title: '许可证发证日期',
          align: 'center',
          dataIndex: 'licenceStartTime'
        },
        {
          title: '许可证有效日期',
          align: 'center',
          dataIndex: 'licenceEndTime'
        },
        {
          title: '环保产品认证编号',
          align: 'center',
          dataIndex: 'envirProductCode'
        },
        {
          title: '环保认证发证日期',
          align: 'center',
          dataIndex: 'envirStartTime'
        },
        {
          title: '环保认证有效期',
          align: 'center',
          dataIndex: 'envirEndTime'
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
        list: '/baseScyInfo/baseScyInfo/list',
        delete: '/baseScyInfo/baseScyInfo/delete',
        deleteBatch: '/baseScyInfo/baseScyInfo/deleteBatch'
      }
    }
  }
}
</script>
