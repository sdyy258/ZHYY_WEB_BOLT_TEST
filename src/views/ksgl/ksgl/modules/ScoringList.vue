<template>
  <a-modal
    entered
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="取消"
    :destroy-on-close="true"
    width="1000px"
    :footer="null"
    @cancel="visible = false"
  >
    <a-form layout="inline" class="search-form">
      <a-form-item label="所属监测中心">
        <j-select-depart
          v-model="queryParam.departIds"
          :multi="false"
          :back-depart="true"
          :tree-opera="true"
          @back="backDepartInfo"
        />
      </a-form-item>
      <a-form-item label="用户姓名">
        <a-input v-model="queryParam.realname" placeholder="请输入用户姓名" />
      </a-form-item>
      <!-- <a-form-item label="是否参考">
        <j-dict-select-tag
          v-model="queryParam.status"
          allow-clear
          placeholder="请选择"
          dict-code="exam_status"
          :show-null-select="false"
        />
      </a-form-item> -->
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a-popconfirm title="确定移除吗?" @confirm="handleDelete('')" :disabled="selectedRowKeys.length == 0">
          <a-button type="primary" icon="minus" :disabled="selectedRowKeys.length == 0" style="margin-left: 8px;"
            >批量移除</a-button
          >
        </a-popconfirm>
        <a-button
          v-if="$store.getters.userInfo.roles.indexOf('admin') > -1 || (examWay == 2 && isCurrentUserCreated == 1)"
          type="primary"
          icon="plus"
          @click="$refs.addPersonnel.showModal(examId)"
          >添加打分人员</a-button
        >
      </a-form-item>
    </a-form>
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      :scroll="{ x: true }"
      bordered
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <a-popconfirm title="确定移除吗?" @confirm="handleDelete(record.id)">
          <a>移除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <add-personnel ref="addPersonnel" @ok="loadData()"></add-personnel>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AddPersonnel from './AddPersonnel'
export default {
  mixins: [JeecgListMixin],
  components: { AddPersonnel },
  data() {
    return {
      title: '打分人员',
      visible: false,
      disableMixinCreated: true,
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
        // {
        //   title: '考试名称',
        //   align: 'center',
        //   dataIndex: 'examName'
        // },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'departIds_dictText'
        },
        {
          title: '用户姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/tExamExpert/tExamExpert/selectedScoringExpertList',
        delete: '/tExamExpert/tExamExpert/deleteBatch'
      },
      examId: ''
    }
  },
  methods: {
    connectParams(params) {
      params.examId = this.examId
    },
    showModal(record) {
      this.visible = true
      this.queryParam.examId = record.id
      this.examId = record.id
      this.disableMixinCreated = false
      this.loadData()
    },
    backDepartInfo(info) {
      this.queryParam.departIds = info[0].value
      this.$forceUpdate()
    },
    handleDelete(id) {
      var that = this
      let ids
      if (!id) {
        ids = this.selectedRowKeys.map(item => item).join(',')
      } else {
        ids = id
      }
      const params = {
        examId: this.examId,
        ids: ids
      }
      this.deleteAction(this.url.delete, params).then(res => {
        if (res.success) {
          // 重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.loadData()
          if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
            this.selectedRowKeys.map((item, index) => {
              if (item == ids) {
                this.selectedRowKeys.splice(index, 1)
              }
            })
          }
          console.log('删除后', this.selectedRowKeys)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
