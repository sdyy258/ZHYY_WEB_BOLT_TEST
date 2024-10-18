<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="企业名称">
        <j-input v-model.trim="queryParam.enterpriseName" placeholder="请输入企业名称" />
      </a-form-item>
      <a-form-item label="所属部门">
        <a-tree-select
          v-model="queryParam.departId"
          :tree-data="sysDepartTree"
          show-search
          style="width: 240px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择所属部门"
          allow-clear
          tree-default-expand-all
          tree-node-filter-prop="title"
        />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <a-button type="primary" icon="delete" @click="batchDel">批量删除</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls_Url('企业模板',url.downloadTemplate)">导入模板下载</a-button>
        <a-upload name="file" :show-upload-list="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">企业导入</a-button>
        </a-upload>
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
    <modal-form ref="modalForm" :sys-depart-tree="sysDepartTree" :town-tree="townTree" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import { getSysDepartTree, getTownTree } from '@/api/custom'
export default {
  name: 'Index',
  components: { ModalForm },
  mixins: [JeecgListMixin],
  data() {
    return {
      sysDepartTree: [],
      townTree: [],
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
          title: '企业名称',
          align: 'center',
          dataIndex: 'enterpriseName'
        },
        {
          title: '统一社会信用代码',
          align: 'center',
          dataIndex: 'creditCode'
        },
        {
          title: '所属部门',
          align: 'center',
          dataIndex: 'departId_dictText'
        },
        {
          title: '所属街道',
          align: 'center',
          dataIndex: 'townId_dictText'
        },
        {
          title: '详细地址',
          align: 'center',
          dataIndex: 'address',
          customCell: () => ({ style: { 'white-space': 'normal', 'max-width': '350px' }})
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
        // {
        //   title: '营业执照图片',
        //   align: 'center',
        //   dataIndex: 'businessLicense'
        // },
        // {
        //   title: '厂区大门图片',
        //   align: 'center',
        //   dataIndex: 'enterpriseGate'
        // },
        {
          title: '环保负责人',
          align: 'center',
          dataIndex: 'telLeader'
        },
        {
          title: '环保负责人电话',
          align: 'center',
          dataIndex: 'telManager'
        },
        {
          title: '排污许可证编号',
          align: 'center',
          dataIndex: 'permitNumber'
        },
        {
          title: '企业法人',
          align: 'center',
          dataIndex: 'legalRepresentative'
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
        list: '/baseEnterprise/baseEnterprise/list',
        delete: '/baseEnterprise/baseEnterprise/delete',
        deleteBatch: '/baseEnterprise/baseEnterprise/deleteBatch',
        downloadTemplate: '/baseEnterprise/baseEnterprise/downloadExcelTemplate',
        importExcelUrl: '/baseEnterprise/baseEnterprise/importExcel'
      }
    }
  },
  created() {
    getSysDepartTree().then((res) => {
      this.sysDepartTree = res.result
    })
    getTownTree().then((res) => {
      this.townTree = res.result
      this.townTree.forEach(i => {
        i.disabled = true
        i.childList.forEach(i => {
          i.disabled = true
          i.childList.forEach(i => {
            i.disabled = true
          })
        })
      })
    })
  },
  methods: {

  }
}
</script>
