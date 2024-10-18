<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="所属运维组">
        <a-tree-select
          v-model="queryParam.deptId"
          :tree-data="sysDepartTree"
          show-search
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择所属运维组"
          allow-clear
          tree-default-expand-all
          tree-node-filter-prop="title"
        />
      </a-form-item>
      <a-form-item label="车辆名称">
        <j-input v-model.trim="queryParam.name" placeholder="请输入车辆名称" />
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
        <a @click="$refs.carCostModal.showModal(record)">车辆费用</a>
      </span>
    </a-table>
    <modal-form ref="modalForm" :sys-depart-tree="sysDepartTree" @ok="modalFormOk" />
    <car-cost-modal ref="carCostModal" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import { getSysDepartTree } from '@api/custom'
import CarCostModal from './carCost/IndexModal.vue'
export default {
  name: 'Index',
  components: { ModalForm, CarCostModal },
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
          title: '所属运维组',
          align: 'center',
          dataIndex: 'deptId_dictText'
        },
        {
          title: '车辆名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '车牌号',
          align: 'center',
          dataIndex: 'noPlate'
        },
        {
          title: '制造商',
          align: 'center',
          dataIndex: 'make'
        },
        {
          title: '车型',
          align: 'center',
          dataIndex: 'model'
        },
        {
          title: '生产年份',
          align: 'center',
          dataIndex: 'year'
        },
        {
          title: '车辆颜色',
          align: 'center',
          dataIndex: 'color'
        },
        {
          title: '车辆类型',
          align: 'center',
          dataIndex: 'vehicleType_dictText'
        },
        {
          title: '燃料类型',
          align: 'center',
          dataIndex: 'fuelType_dictText'
        },
        {
          title: '购买日期',
          align: 'center',
          dataIndex: 'purchaseDate'
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
        list: '/baseVehicleInfo/baseVehicleInfo/list',
        delete: '/baseVehicleInfo/baseVehicleInfo/delete',
        deleteBatch: '/baseVehicleInfo/baseVehicleInfo/deleteBatch'
      },
      sysDepartTree: []
    }
  },
  created() {
    getSysDepartTree().then((res) => {
      this.sysDepartTree = res.result
    })
  }
}
</script>
