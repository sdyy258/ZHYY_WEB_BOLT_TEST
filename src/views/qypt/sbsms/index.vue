<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="所属分类">
        <a-tree-select
          v-model="queryParam.categoryId"
          :tree-data="categoryTreeData"
          show-search
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择所属分类"
          allow-clear
          tree-default-expand-all
          tree-node-filter-prop="title"
        />
      </a-form-item>
      <a-form-item label="名称">
        <a-input v-model="queryParam.explainName" placeholder="请输入名称" />
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
    <modal-form ref="modalForm" :category-tree-data="categoryTreeData" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import { getCategoryItemTree } from '@api/custom'
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
          title: '所属分类',
          align: 'center',
          dataIndex: 'categoryId_dictText'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'explainName'
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
        list: '/ywEquipmentManual/ywEquipmentManual/list',
        delete: '/ywEquipmentManual/ywEquipmentManual/delete',
        deleteBatch: '/ywEquipmentManual/ywEquipmentManual/deleteBatch'
      },
      categoryTreeData: []
    }
  },
  created() {
    getCategoryItemTree(14).then(res => {
      this.categoryTreeData = res.result
    })
  }
}
</script>
