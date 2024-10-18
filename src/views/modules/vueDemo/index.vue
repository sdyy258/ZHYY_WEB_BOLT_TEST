<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="输入框">
        <j-input v-model.trim="queryParam.prop1" placeholder="请输入输入框" />
      </a-form-item>
      <a-form-item label="下拉字典单选框">
        <j-dict-select-tag v-model.trim="queryParam.prop3" dict-code="is_open" placeholder="请选择下拉字典单选框" />
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
          title: '输入框',
          align: 'center',
          dataIndex: 'prop1'
        },
        {
          title: '数字框',
          align: 'center',
          dataIndex: 'prop2'
        },
        {
          title: '下拉字典单选框',
          align: 'center',
          dataIndex: 'prop3_dictText'
        },
        {
          title: '下拉字典多选框',
          align: 'center',
          dataIndex: 'prop4_dictText'
        },
        {
          title: '日期',
          align: 'center',
          dataIndex: 'prop5'
        },
        {
          title: '日期时间',
          align: 'center',
          dataIndex: 'prop6'
        },
        {
          title: '文本框',
          align: 'center',
          dataIndex: 'prop7',
          customCell: () => ({ style: { 'white-space': 'normal', 'max-width': '500px' }})
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
        list: '/energy/testDemoVue/list',
        delete: '/energy/testDemoVue/delete',
        deleteBatch: '/energy/testDemoVue/deleteBatch'
      }
    }
  }
}
</script>
