<template>
  <a-card :bordered="false" class="card-area">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="名称" :label-col="{span: 5}" :wrapper-col="{span: 18, offset: 1}">
              <a-input v-model="queryParam.roleName" placeholder="请输入名称查询" />
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="创建时间" :label-col="{span: 5}" :wrapper-col="{span: 18, offset: 1}">
              <j-date v-model="queryParam.createTime_begin" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择开始时间" />
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.createTime_end" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery">查询</a-button>
              <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('角色信息')">导出</a-button>
      <a-upload name="file" :show-upload-list="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon" /> 已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handlePerssion(record.id)">授权</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <role-modal ref="modalForm" @ok="modalFormOk" />
    <user-role-modal ref="modalUserRole" />
  </a-card>
</template>

<script>
import RoleModal from './modules/RoleModal'
import UserRoleModal from './modules/UserRoleModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'RoleList',
  components: {
    RoleModal,
    UserRoleModal,
    JDate
  },
  mixins: [JeecgListMixin],
  data() {
    return {

      description: '角色管理页面',
      // 查询条件
      queryParam: { roleName: '' },
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
          title: '角色名称',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '角色编码',
          align: 'center',
          dataIndex: 'roleCode'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/role/list',
        delete: '/sys/role/delete',
        deleteBatch: '/sys/role/deleteBatch',
        exportXlsUrl: '/sys/role/exportXls',
        importExcelUrl: 'sys/role/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handlePerssion: function(roleId) {
      // alert(roleId);
      this.$refs.modalUserRole.show(roleId)
    },
    onChangeDate(date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
