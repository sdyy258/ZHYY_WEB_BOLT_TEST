<template>
  <a-modal
    centered
    :title="title"
    :width="1150"
    :visible="visible"
    :mask-closable="false"
    :footer="null"
    @cancel="cancel"
  >
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      bordered
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    />
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '',
      visible: false,
      openModal: false,
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
        }, {
          title: '反馈人',
          align: 'center',
          dataIndex: 'userName',
          width: 100,
          ellipsis: true
        }, {
          title: '联系方式',
          align: 'center',
          dataIndex: 'phone',
          width: 100,
          ellipsis: true
        },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'departName',
          width: 100,
          ellipsis: true
        },
        {
          title: '反馈时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 100,
          ellipsis: true
        },
        {
          title: '反馈内容',
          align: 'center',
          dataIndex: 'feedbackContent',
          width: 400,
          ellipsis: true
        },
        {
          title: '处理内容',
          align: 'center',
          dataIndex: 'handleContent',
          width: 230,
          ellipsis: true
        }
      ]
    }
  },
  methods: {
    edit(record) {
      this.dataSource = ''
      this.dataSource = [...record]
    },
    cancel() {
      this.visible = false
      this.disabled = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-nowrap td, .table-nowrap th{
  white-space: pre-line;
}
/deep/.one-col-form-longLabel.ant-form .ant-form-item .ant-form-item-label {
  width: 100px;
}
</style>

