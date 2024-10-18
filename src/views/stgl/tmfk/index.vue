<template>
  <a-card :bordered="false">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-model-item label="试题分类" style="flex: 1;" prop="categoryId">
        <a-tree-select
          v-model.trim="queryParam.categoryId"
          :tree-data="questionList"
          :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          tree-node-filter-prop="title"
        />
      </a-form-model-item>
      <a-form-item label="试题类型" style="flex: 1;">
        <a-select
          v-model="queryParam.questionType"
          placeholder="请选择试题类型"
          allow-clear
          show-search
        >
          <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="处理状态" style="flex: 1;">
        <a-select v-model="queryParam.handleStatus" placeholder="请选择状态" @change="dictChange">
          <a-select-option :value="null">全部</a-select-option>
          <a-select-option :value="0">未处理</a-select-option>
          <a-select-option :value="1">已处理</a-select-option>
          <!-- <a-select-option v-for="i in dictOptions" :key="i.value" :value="i.value">{{ i.text }}</a-select-option> -->
        </a-select>
      </a-form-item>
      <a-form-item label="试题内容" style="flex: 1;">
        <a-input v-model.trim="queryParam.questionName" placeholder="请输入试题内容" style="width: 468px;" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="reset">重置</a-button>
        <a-button :disabled="selectedRowKeys.length<=0" type="delete" icon="delete" @click="batchDel">批量删除</a-button>
      </a-form-item>
    </a-form>
    <def-columns :columns="columns" @setColumns="columns=$event" />
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
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
    >
      <span slot="questionName" slot-scope="text, record">
        <span class="col-sql" :title="htmlToString(record.questionName)" v-html="record.questionName" />
      </span>
      <span slot="unHandleNum" slot-scope="text, record" class="table-action" @click="unHandTable(record)">
        <a>{{ record.unHandleNum }}</a>
      </span>
      <span slot="allFeedBackNum" slot-scope="text, record" class="table-action" @click="allFeedTable(record)">
        <a>{{ record.allFeedBackNum }}</a>
      </span>
      <span slot="action" slot-scope="text, record" class="table-action">
        <a v-if="record.isHandle == 0" @click="handleEdit(record)">处理</a>
        <a v-else @click="edit(record)">详情</a>
        <!-- <a @click="maintenance(record)">维护试题</a> -->
        <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
        <a @click="practiceClick(record)">练习</a>
      </span>
    </a-table>
    <modal-form ref="modalForm" @ok="modalFormOk" />
    <feedback-list ref="feedbackList" />
    <practice-modal ref="practiceModal" />
  </a-card>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ModalForm from './modules/ModalForm'
import { getAction } from '@/api/manage'
import { dataType } from '../tjtm/compents/dataType'
import FeedbackList from './modules/FeedbackList'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import PracticeModal from './PracticeModal'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'stgl-tmfk',
  components: { ModalForm, FeedbackList, PracticeModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      dataSource: [],
      dataType,
      questionList: [],
      queryParam: {
        handleStatus: 0
      },
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
          title: '题型',
          align: 'center',
          dataIndex: 'questionType_dictText',
          width: 100,
          ellipsis: true
        }, {
          title: '分类',
          align: 'center',
          dataIndex: 'categoryName',
          width: 200,
          ellipsis: true
        }, {
          title: '试题内容',
          align: 'center',
          dataIndex: 'questionName',
          width: 260,
          ellipsis: true,
          scopedSlots: { customRender: 'questionName' }
        }, {
          title: '处理状态',
          align: 'center',
          dataIndex: 'handleStatus_dictText',
          width: 100
        }, {
          title: '处理时间',
          align: 'center',
          dataIndex: 'handleTime',
          width: 150
        }, {
          title: '最新反馈时间',
          align: 'center',
          dataIndex: 'feedbackTime',
          width: 150,
          ellipsis: true
        }, {
          title: '未处理反馈数',
          align: 'center',
          dataIndex: 'unHandleNum',
          width: 100,
          scopedSlots: { customRender: 'unHandleNum' }
        }, {
          title: '历史反馈数',
          align: 'center',
          dataIndex: 'allFeedBackNum',
          width: 100,
          scopedSlots: { customRender: 'allFeedBackNum' }
        }, {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }],
      url: {
        list: '/tQuestionFeedback/tQuestionFeedback/list',
        delete: '/tQuestionFeedback/tQuestionFeedback/delete',
        deleteBatch: '/tQuestionFeedback/tQuestionFeedback/deleteBatch'
      },
      dictOptions: []
    }
  },
  created() {
    setTimeout(() => {
      this.getQuestion()
    })
    // this.getinitDictOptions()
  },
  activated() {
    this.searchQuery()
  },
  methods: {
    // 获取‘handleStatus’字典
    // getinitDictOptions() {
    //   initDictOptions('handleStatus').then(res => {
    //     if (res.success) {
    //       this.dictOptions = res.result
    //     }
    //   })
    // },
    // 获取树
    getQuestion() {
      getAction('sys/category/rootListNew', { type: 1, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.questionList = result
            console.log('questionList', this.questionList)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // P span便签 过滤出字符
    htmlToString(htmlStr) {
      // str1.replace(/&nbsp;/gi, ""
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 重置
    reset() {
      this.queryParam = {}
      this.queryParam.handleStatus = 0
      this.loadData(1)
    },
    // 处理状态变化
    dictChange(e) {
      this.queryParam.handleStatus = e
      this.$forceUpdate()
    },
    // 处理
    handleEdit(record) {
      let arr = ''
      // record.id 试题id
      // 获取未反馈内容
      getAction('/tQuestionFeedback/tQuestionFeedback/feedbackNumAndList', { questionId: record.id }).then(res => {
        if (res.success) {
          console.log(res)
          arr = res.result.unHandle
          record.unHandle = { ...arr }
          this.maintenance(record)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 处理后回显（现在用不到）
    modalFormOk() {
      this.loadData()
    },
    // 跳到详情
    edit(record) {
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disabled = true
      this.$refs.modalForm.edit(record, true)
    },
    // 练习
    practiceClick(record) {
      this.$refs.practiceModal.showModal(record)
    },
    // 打开未处理反馈数列表
    unHandTable(record) {
      let arr = ''
      getAction('/tQuestionFeedback/tQuestionFeedback/feedbackNumAndList', { questionId: record.id }).then(res => {
        if (res.success) {
          console.log(res)
          arr = res.result.unHandle
          this.$refs.feedbackList.visible = true
          this.$refs.feedbackList.title = '未处理反馈数'
          this.$refs.feedbackList.edit(arr)
        }
      })
    },
    // 打开历史反馈数列表
    allFeedTable(record) {
      let arr = ''
      getAction('/tQuestionFeedback/tQuestionFeedback/feedbackNumAndList', { questionId: record.id }).then(res => {
        if (res.success) {
          console.log(res)
          arr = res.result.allFeedBack
          this.$refs.feedbackList.visible = true
          this.$refs.feedbackList.title = '历史反馈数'
          this.$refs.feedbackList.edit(arr)
        }
      })
    },
    // 维护试题
    maintenance(record) {
      // questionId 获取试题内容
      getAction('/tQuestion/tQuestion/queryById', { id: record.id }, 'get').then(res => {
        console.log(res, this.dataSource)
        if (res.success) {
          const data = res.result
          // data.unHandle = record.unHandle
          this.$router.push({
            name: 'stgl-tjtm',
            params: { data },
            query: { record, type: 'handle' }
          })
        }
      })
      // this.$router.push({
      //   name: 'stgl-tkgl',
      //   query: { ...record }
      // })
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
.col-sql {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // display: inline-block;
  width: 580px;
}
/deep/ .col-sql>p>img{
  width: 15%;
}
</style>
