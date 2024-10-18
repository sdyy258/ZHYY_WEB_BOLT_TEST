<template>
  <div>
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="监测项目">
        <j-search-select-tag v-model="queryParam.itemId" dict="base_item,item_name,id" />
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
          title: '监测项目',
          align: 'center',
          dataIndex: 'itemId_dictText'
        },
        {
          title: '测量方法原理',
          align: 'center',
          dataIndex: 'principle_dictText'
        },
        {
          title: '采样方式',
          align: 'center',
          dataIndex: 'sampleMode_dictText'
        },
        {
          title: '样品采集量',
          align: 'center',
          dataIndex: 'sampleCount'
        },
        {
          title: '检出限',
          align: 'center',
          dataIndex: 'monitorLimit'
        },
        {
          title: '废液产生量',
          align: 'center',
          dataIndex: 'liquidWaste'
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
        list: '/baseItemEquipment/baseItemEquipment/list',
        delete: '/baseItemEquipment/baseItemEquipment/delete',
        deleteBatch: '/baseItemEquipment/baseItemEquipment/deleteBatch'
      }
    }
  },
  methods: {
    connectParams(params) {
      params.equipmentId = this.parentInfo.id
    },
    loadDataSuccess() {
      this.$emit('reload')
    }
  }
}
</script>
