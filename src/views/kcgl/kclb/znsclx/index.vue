<template>
  <a-card :bordered="false">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="请添加培训内容">
        <a-button icon="plus-circle" @click="selectCoursesClick">课程</a-button>
        <a-button icon="plus-circle" @click="selectLiveBroadcastClick">直播</a-button>
        <a-button icon="plus-circle" @click="selectOfflineTrainingClick">线下培训</a-button>
        <a-button icon="plus-circle" @click="selectLearnPracticClick">每日学练</a-button>
        <a-button icon="plus-circle" @click="selectExaminationClick">考试</a-button>
        <a-button icon="plus-circle" @click="selectLearningProjectsClick">学习项目</a-button>
      </a-form-item>
    </a-form>
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      :scroll="{x:true}"
      bordered
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="operation" slot-scope="text, record" class="table-action">
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <div class="panel-bottom">
      <a-button type="primary" @click="creatLearnPractic">开始创建每日学练</a-button>
      <a-button type="primary">开始创建考试</a-button>
    </div>
    <!-- 课程 -->
    <select-courses ref="selectCourses" />
    <!-- 直播 -->
    <select-live-broadcast ref="selectLiveBroadcast" />
    <!-- 线下培训 -->
    <select-offline-training ref="selectOfflineTraining" />
    <!-- 每日学练 -->
    <select-learn-practic ref="selectLearnPractic" />
    <!-- 考试 -->
    <select-examination ref="selectExamination" />
    <!-- 学习项目 -->
    <select-learning-projects ref="selectLearningProjects" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SelectCourses from './SelectCourses.vue'
import SelectExamination from './SelectExamination.vue'
import SelectLiveBroadcast from './SelectLiveBroadcast.vue'
import SelectOfflineTraining from './SelectOfflineTraining.vue'
import SelectLearnPractic from './SelectLearnPractic.vue'
import SelectLearningProjects from './SelectLearningProjects.vue'
const dataSource = [{ prop1: '如何培养销售人员的销售技巧', prop2: '课程分类', prop3: '正常', prop4: '2023-04-14 09:41', prop5: '2024-04-14 09:41', prop6: '公司', prop7: '2024-04-14 09:41', prop8: '否' },
  { prop1: '如何培养销售人员的销售技巧', prop2: '课程分类', prop3: '正常', prop4: '2023-04-14 09:41', prop5: '2024-04-14 09:41', prop6: '公司', prop7: '2024-04-14 09:41', prop8: '否' },
  { prop1: '如何培养销售人员的销售技巧', prop2: '课程分类', prop3: '正常', prop4: '2023-04-14 09:41', prop5: '2024-04-14 09:41', prop6: '公司', prop7: '2024-04-14 09:41', prop8: '否' }]
export default {
  name: 'Index',
  components: { SelectCourses, SelectExamination, SelectLiveBroadcast, SelectOfflineTraining, SelectLearnPractic, SelectLearningProjects },
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      dataSource: dataSource,
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
          title: '名称',
          align: 'center',
          dataIndex: 'prop1'
        },
        {
          title: '所属模块',
          align: 'center',
          dataIndex: 'prop2'
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'prop3'
        },
        {
          title: '关联学习项目',
          align: 'center',
          dataIndex: 'prop4'
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'prop5'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
      }
    }
  },
  methods: {
    // 课程
    selectCoursesClick() {
      this.$refs.selectCourses.edit()
    },
    // 直播
    selectLiveBroadcastClick() {
      this.$refs.selectLiveBroadcast.edit()
    },
    // 线下培训
    selectOfflineTrainingClick() {
      this.$refs.selectOfflineTraining.edit()
    },
    // 每日学练
    selectLearnPracticClick() {
      this.$refs.selectLearnPractic.edit()
    },
    // 考试
    selectExaminationClick() {
      this.$refs.selectExamination.edit()
    },
    // 学习项目
    selectLearningProjectsClick() {
      this.$refs.selectLearningProjects.edit()
    },
    // 创建每日学练
    creatLearnPractic() {

    }
  }
}
</script>
<style scoped>
.panel-bottom{
    display: flex;
    justify-content: space-around;
}
</style>
