<template>
  <div>
    <a-modal
      centered
      title="选择试卷"
      :width="1000"
      :visible="visible"
      @cancel="cancel"
      @ok="handleOK"
    >
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="试卷名称">
          <a-input v-model.trim="queryParam.name" placeholder="请输入试卷名称" />
        </a-form-item>
        <a-form-item label="试卷分类">
          <a-tree-select
            v-model.trim="queryParam.categoryId"
            :tree-data="paperList"
            style="width: 380px"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            placeholder="请选择"
            allow-clear
            tree-node-filter-prop="title"
          />
        </a-form-item>
        <a-form-item label="试卷创建时间">
          <a-date-picker
            v-model="queryParam.createTime"
            placeholder="请选择试卷创建时间"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <a-table
        ref="table"
        class="table-nowrap totalTable"
        bordered
        :row-selection="{ selectedRowKeys: selectedRowKeys,selectedRows:selectedRows, onChange: onSelectChange,}"
        :columns="columns"
        :data-source="dataSource"
        row-key="id"
        :pagination="ipagination"
        :loading="loading"
        size="middle"
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
    title: '总分',
    dataIndex: 'score',
    width: 150,
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
      queryParam: {
        combinationType: 1
      },
      paperList: [],
      selectedRowKeys: [],
      selectedRows: [],
      url: {
        list: ''
      }
    }
  },
  created() {
    this.getQuestion()
  },
  methods: {
    showModal(data) {
      this.visible = true
      this.disableMixinCreated = false
      this.url.list = '/tExamPaper/tExamPaper/list'
      this.loadData()
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.combinationType = 1
      this.loadData(1)
    },
    // 获取树
    getQuestion() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.paperList = result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = []
      this.selectedRowKeys.push(selectedRowKeys[selectedRowKeys.length - 1])
      this.selectionRows = selectedRows[selectedRows.length - 1]
    },
    handleOK() {
      if (!this.selectionRows || this.selectionRows.length == 0) {
        // this.$message.warning('试卷没有更改')
        this.visible = false
        return
      }
      this.$emit('ok', this.selectionRows)
      this.selectedRowKeys = []
      this.selectionRows = []
      this.visible = false
    },
    cancel() {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.visible = false
    }

  }
}
</script>

