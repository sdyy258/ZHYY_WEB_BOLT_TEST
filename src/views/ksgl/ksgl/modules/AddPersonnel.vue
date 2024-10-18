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
    @cancel="cancel"
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
      <a-form-item label="手机号">
        <a-input v-model="queryParam.phone" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
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
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="text, record" class="table-action">
        <a @click="addClick(record)">添加</a>
      </span>
    </a-table>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@/api/manage'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '添加打分人员',
      disableMixinCreated: true,
      visible: false,
      value: '',
      dataSource: '',
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
          title: '所属监测中心',
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
          dataIndex: 'action',
          align: 'center',
          //   fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      examId: '',
      url: {
        list: '/tExamExpert/tExamExpert/selectableScoringExpertList'
      }
    }
  },
  created() {},
  methods: {
    connectParams(params) {
      params.examId = this.examId
    },
    showModal(recordId) {
      this.visible = true
      this.disableMixinCreated = false
      this.examId = recordId
      this.loadData()
    },
    backDepartInfo(info) {
      this.queryParam.departIds = info[0].value
      this.$forceUpdate()
    },
    addClick(record) {
      const params = {
        examId: this.examId,
        userId: record.id
      }
      postAction('/tExamExpert/tExamExpert/add', params).then(res => {
        if (res.success) {
          this.$message.success(res.message || '成功')
          this.loadData()
          this.$emit('ok', '')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    cancel() {
      this.queryParam = {}
      this.visible = false
      this.$emit('ok', '')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-body {
  padding: 42px 34px;
}
/deep/.search-form .ant-form-item {
  margin-bottom: 15px !important;
}
</style>
