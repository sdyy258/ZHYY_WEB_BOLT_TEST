<template>
  <a-modal
    entered
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="取消"
    :ok-text="okText"
    :destroy-on-close="true"
    width="1000px"
    :footer="null"
    @cancel="cancel"
  >
    <a-form layout="inline" class="search-form">
      <a-form-item label="所属机构">
        <j-select-depart
          v-model="queryParam.departIds"
          :multi="false"
          :back-depart="true"
          :tree-opera="true"
          @back="backDepartInfo"
        />
      </a-form-item>
      <a-form-item label="学员名称">
        <a-input v-model="queryParam.realname" placeholder="请输入学员名称" />
      </a-form-item>
      <a-form-item label="是否参考">
        <j-dict-select-tag
          v-model="queryParam.status"
          allow-clear
          placeholder="请选择"
          dict-code="exam_status"
          :show-null-select="false"
        />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls('考生信息')">导出</a-button>
        <a-button
          v-if=" (examWay == 2 && isCurrentUserCreated == 1)"
          type="primary"
          icon="plus"
          @click="$refs.addExaminee.showModal(queryParam.examId)"
          >添加考生</a-button
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
      :loading="loading"
      @change="handleTableChange"
    />
    <add-examinee ref="addExaminee" @ok="callBack" />
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { downloadFile, downFile } from '@/api/manage'
import AddExaminee from './AddExaminee'
export default {
  components: { AddExaminee },
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '考生列表',
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
          title: '考试名称',
          align: 'center',
          dataIndex: 'examName'
        },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '考生姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '是否参考',
          align: 'center',
          dataIndex: 'status_dictText'
        }
        // {
        //   title: '报名方式',
        //   align: 'center',
        //   dataIndex: 'name'
        // }
      ],
      examId: '',
      url: {
        list: '',
        exportXlsUrl: '/tExamPaperUser/tExamPaperUser/exportExamUser'
      },
      examWay: '',
      isCurrentUserCreated: ''
    }
  },
  created() {},
  methods: {
    // 拼接其它参数
    connectParams(params) {
      params.examId = this.examId
    },
    showModal(record) {
      this.visible = true
      this.disableMixinCreated = false
      this.url.list = '/tExamPaperUser/tExamPaperUser/examSelectedUserList'
      this.queryParam.examId = record.id
      this.examId = record.id
      this.loadData()
      this.examWay = record.examWay
      this.isCurrentUserCreated = record.isCurrentUserCreated
    },
    backDepartInfo(info) {
      this.queryParam.departIds = info[0].value
      this.$forceUpdate()
    },
    callBack() {
      this.disableMixinCreated = false
      this.loadData()
    },
    cancel() {
      this.queryParam = {}
      this.visible = false
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
