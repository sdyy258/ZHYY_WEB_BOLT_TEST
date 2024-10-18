<template>
  <div class="app-container">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="账号">
        <j-input v-model="queryParam.username" placeholder="输入账号模糊查询" />
      </a-form-item>
      <a-form-item label="用户姓名">
        <j-input v-model="queryParam.realname" placeholder="请输入用户姓名" />
      </a-form-item>
      <!--      <a-form-item label="性别">-->
      <!--        <a-select v-model="queryParam.sex" placeholder="请选择性别">-->
      <!--          <a-select-option value="">请选择</a-select-option>-->
      <!--          <a-select-option value="1">男</a-select-option>-->
      <!--          <a-select-option value="2">女</a-select-option>-->
      <!--        </a-select>-->
      <!--      </a-form-item>-->
      <a-form-item label="手机号码">
        <a-input v-model="queryParam.phone" placeholder="请输入手机号码查询" />
      </a-form-item>
      <a-form-item label="用户状态">
        <a-select v-model="queryParam.status" placeholder="请选择">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option value="1">正常</a-select-option>
          <a-select-option value="2">冻结</a-select-option>
        </a-select>
      </a-form-item>
<!--      <a-form-item label="账号种类">-->
<!--        <j-dict-select-tag v-model="queryParam.userType" :disabled="role==1" dict-code="user_type" style="width:100%" trigger-change placeholder="请选择" />-->
<!--      </a-form-item>-->
      <!--      <a-form-item label="企业用户类型" v-if="queryParam.userType==1">-->
      <!--        <j-dict-select-tag v-model="queryParam.enterpriseUserType" dict-code="enterprise_user_type" style="width:100%" trigger-change placeholder="请选择" />-->
      <!--      </a-form-item>-->
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <a-button type="primary" icon="delete" @click="batchDel">批量删除</a-button>
        <a-button v-if="$store.getters.userInfo.username == 'admin'" type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>
        <a-button v-if="$store.getters.userInfo.username == 'admin'" type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
        <a-upload v-if="$store.getters.userInfo.username == 'admin'" name="file" :show-upload-list="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>
      </a-form-item>
    </a-form>

    <!--    &lt;!&ndash; 操作按钮区域 &ndash;&gt;-->
    <!--    <div class="table-operator" style="border-top: 5px">-->
    <!--      <a-button type="primary" icon="plus" @click="handleAdd">添加用户</a-button>-->
    <!--      <j-third-app-button biz-type="user" :selected-row-keys="selectedRowKeys" sync-to-app sync-to-local @sync-finally="onSyncFinally" />-->
    <!--      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>-->
    <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
    <!--        <a-menu slot="overlay" @click="handleMenuClick">-->
    <!--          <a-menu-item key="1">-->
    <!--            <a-icon type="delete" @click="batchDel" />-->
    <!--            删除-->
    <!--          </a-menu-item>-->
    <!--          <a-menu-item key="2">-->
    <!--            <a-icon type="lock" @click="batchFrozen('2')" />-->
    <!--            冻结-->
    <!--          </a-menu-item>-->
    <!--          <a-menu-item key="3">-->
    <!--            <a-icon type="unlock" @click="batchFrozen('1')" />-->
    <!--            解冻-->
    <!--          </a-menu-item>-->
    <!--        </a-menu>-->
    <!--        <a-button style="margin-left: 8px">-->
    <!--          批量操作-->
    <!--          <a-icon type="down" />-->
    <!--        </a-button>-->
    <!--      </a-dropdown>-->
    <!--      <j-super-query :field-list="superQueryFieldList" @handleSuperQuery="handleSuperQuery" />-->
    <!--    </div>-->
    <a-table
      ref="table"
      :scroll="{x:true}"
      class="table-nowrap"
      bordered
      size="middle"
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
    >
      <template slot="avatarslot" slot-scope="text, record, index">
        <div class="anty-img-wrap">
          <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user" />
        </div>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <!--              <a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>-->
              <a @click="resetPassword(record)">重置密码</a>
            </a-menu-item>
            <a-menu-item v-if="record.enterpriseUserType!=1">
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item v-if="record.status==1 && record.enterpriseUserType!=1">
              <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id,2,record.username)">
                <a>冻结</a>
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item v-if="record.status==2 ">
              <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id,1,record.username)">
                <a>解冻</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <user-modal ref="modalForm" @ok="modalFormOk" />
    <password-modal ref="passwordmodal" @ok="passwordModalOk" />
    <reset-password ref="resetPassword" @ok="passwordModalOk" />
    <sys-user-agent-modal ref="sysUserAgentModal" />

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk" />
  </div>
</template>

<script>
import UserModal from './modules/UserModal'
import PasswordModal from './modules/PasswordModal'
import ResetPassword from './modules/resetPassword.vue'
import { putAction, getFileAccessHttpUrl } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SysUserAgentModal from './modules/SysUserAgentModal'
import JInput from '@/components/jeecg/JInput'
import UserRecycleBinModal from './modules/UserRecycleBinModal'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import JThirdAppButton from '@/components/jeecgbiz/thirdApp/JThirdAppButton'

export default {
  name: 'UserList',
  components: {
    JThirdAppButton,
    SysUserAgentModal,
    UserModal,
    PasswordModal,
    JInput,
    UserRecycleBinModal,
    JSuperQuery,
    ResetPassword
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      description: '这是用户管理页面',
      queryParam: {},
      recycleBinVisible: false,
      passVisible: false,
      columns: [
        /* {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username',
          width: 120,
          sorter: true
        },
        {
          title: '用户姓名',
          align: 'center',
          width: 100,
          dataIndex: 'realname'
        },
        {
          title: '头像',
          align: 'center',
          width: 120,
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatarslot' }
        },
        //
        // {
        //   title: '性别',
        //   align: 'center',
        //   width: 80,
        //   dataIndex: 'sex_dictText',
        //   sorter: true
        // },
        // {
        //   title: '生日',
        //   align: 'center',
        //   width: 100,
        //   dataIndex: 'birthday'
        // },
        {
          title: '手机号码',
          align: 'center',
          width: 100,
          dataIndex: 'phone'
        },
        // {
        //   title: '部门',
        //   align: 'center',
        //   width: 180,
        //   dataIndex: 'orgCodeTxt'
        // },
        // {
        //   title: '负责部门',
        //   align: 'center',
        //   width: 180,
        //   dataIndex: 'departIds_dictText'
        // },
        {
          title: '状态',
          align: 'center',
          width: 80,
          dataIndex: 'status_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }

      ],
      superQueryFieldList: [
        { type: 'input', value: 'username', text: '用户账号' },
        { type: 'input', value: 'realname', text: '用户姓名' },
        { type: 'select', value: 'sex', dbType: 'int', text: '性别', dictCode: 'sex' }
      ],
      url: {
        syncUser: '/act/process/extActProcess/doSyncUser',
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        deleteBatch: '/sys/user/deleteBatch',
        exportXlsUrl: '/sys/user/exportXls',
        importExcelUrl: 'sys/user/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    getAvatarView: function(avatar) {
      return getFileAccessHttpUrl(avatar)
    },

    batchFrozen: function(status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return false
      } else {
        let ids = ''
        const that = this
        let isAdmin = false
        that.selectionRows.forEach(function(row) {
          if (row.username == 'admin') {
            isAdmin = true
          }
        })
        if (isAdmin) {
          that.$message.warning('管理员账号不允许此操作,请重新选择！')
          return
        }
        that.selectedRowKeys.forEach(function(val) {
          ids += val + ','
        })
        that.$confirm({
          title: '确认操作',
          content: '是否' + (status == 1 ? '解冻' : '冻结') + '选中账号?',
          onOk: function() {
            frozenBatch({ ids: ids, status: status }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel()
      } else if (e.key == 2) {
        this.batchFrozen(2)
      } else if (e.key == 3) {
        this.batchFrozen(1)
      }
    },
    handleFrozen: function(id, status, username) {
      const that = this
      // TODO 后台校验管理员角色
      if (username == 'admin') {
        that.$message.warning('管理员账号不允许此操作！')
        return
      }
      frozenBatch({ ids: id, status: status }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username)
    },
    // 重置密码
    resetPassword(record) {
      this.$refs.resetPassword.show(record)
      // this.$confirm({
      //   title: '重置密码',
      //   content: `是否确认重置${record.username}账号密码`,
      //   onOk: () => {
      //     this.putAction('/sys/user/changePassword', { id: record.id, username: record.username }).then(res => {
      //       if (res.success) {
      //         this.$message.success(res.message)
      //       } else {
      //         this.$message.warning(res.message)
      //       }
      //     })
      //   }
      // })
    },
    passwordModalOk() {
      // TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    },
    onSyncFinally({ isToLocal }) {
      // 同步到本地时刷新下数据
      if (isToLocal) {
        this.loadData()
      }
    }
  }

}
</script>

