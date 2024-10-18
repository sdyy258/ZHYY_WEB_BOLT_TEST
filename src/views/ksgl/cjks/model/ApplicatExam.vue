<template>
  <div>
    <a-modal
      centered
      title="应用考试列表"
      :width="1000"
      :visible="visible"
      :footer="null"
      @cancel="visible=false"
    >
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        :scroll="{x:true}"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      /></a-modal>
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
const columns = [
  {
    title: '考试名称',
    dataIndex: 'name',
    align: 'center',
    width: 200,
    ellipsis: true
  },
  {
    title: '开始时间',
    dataIndex: 'limitStartTime',
    width: 150,
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'limitEndTime',
    align: 'center',
    width: 150
  }
]
export default {
  name: 'ApplicatExam',
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      visible: false,
      columns,
      url: {
        list: ''
      }
    }
  },
  methods: {
    showModal(data) {
      this.visible = true
      this.disableMixinCreated = false
      this.url.list = '/tExam/tExam/list'
      this.queryParam.paperId = data.id
      this.loadData()
    }

  }
}
</script>
