<template>
  <div style="display: flex;height: 100%">
    <person-tree :key="treeKey" @select="selectPersonTree" />
    <div class="app-container" style="margin-left: 10px;flex: 1">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="姓名">
          <a-input v-model.trim="queryParam.realname" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model.trim="queryParam.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
          <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls_Url('人员分组模板',url.downloadTemplate)">导入模板下载</a-button>
          <a-upload name="file" :show-upload-list="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">人员分组导入</a-button>
          </a-upload>
          <a-button type="primary" icon="export" @click="handleExportXls('人员分组')">导出数据</a-button>
        </a-form-item>
      </a-form>
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record" class="table-action">
          <a @click="handleEdit(record)">编辑</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <user-modal ref="modalForm" @ok="modalFormOk" page="ryfz"/>
  </div>
</template>

<script>
import PersonTree from './components/PersonTree.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import UserModal from '@/views/system/modules/UserModal'
export default {
  name: 'Index',
  components: { PersonTree, UserModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      departIds: '',
      treeKey: 0,
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
          title: '部门',
          align: 'center',
          dataIndex: 'departIds_dictText'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
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
        list: '/sys/user/addressBook',
        delete: '/sys/user/delete',
        exportXlsUrl: '/sys/user/exportGroupUser',
        downloadTemplate: '/sys/user/downloadExcelTemplate',
        importExcelUrl: '/sys/user/importGroupUser'
      }
    }
  },
  methods: {
    selectPersonTree(data) {
      this.departIds = data.id
      this.searchQuery()
    },
    searchReset() {
      this.departIds = ''
      this.queryParam = {}
      this.treeKey++
      this.searchQuery()
    },
    connectParams(params) {
      params.departIds = this.departIds
    }
  }
}
</script>

<style scoped>

</style>
