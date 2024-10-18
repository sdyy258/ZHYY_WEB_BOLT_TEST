<template>
  <div>
    <a-card :bordered="false">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="考试创建人员">
          <a-select
            v-model="queryParam.createBy"
            show-search
            placeholder="请选择人员"
            option-filter-prop="children"
            :filter-option="$filterOption"
            allow-clear
            @change="changeTown"
          >
            <a-select-option v-for="item in userOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="考试名称">
          <j-multi-select-tag
            v-if="queryParam.createBy"
            v-model="queryParam.id"
            :dict-code="`t_exam,name,id,del_flag=0 and create_by='${queryParam.createBy}' order by create_time desc`"
            :has-del-flag="false"
            placeholder="请选择"
            style="width: 400px"
          />
          <j-multi-select-tag
            v-else
            v-model="queryParam.id"
            dict-code="t_exam,name,id,del_flag=0 order by create_time desc"
            :has-del-flag="false"
            placeholder="请选择"
            style="width: 400px"
          />

          <!--          <j-multi-select-tag v-if="selectShow" v-model="queryParam.id" class="choose-select" placeholder="请选择" dict-code="t_exam,name,id,del_flag=0" />-->
          <!-- <j-input v-model.trim="queryParam.name" placeholder="请输入考试名称" /> -->
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker
            v-model="checkoutRangeDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            :show-time="{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
            }"
            allow-clear
            @change="checkoutRangeChange"
          />
        </a-form-item>

        <a-form-item label="是否结束">
          <a-select
            v-model="queryParam.isEnd"
            placeholder="请选择是否结束"
            option-filter-prop="children"
            style="width: 200px;"
            allow-clear
          >
            <a-select-option :key="0" :value="0"> 未结束 </a-select-option>
            <a-select-option :key="1" :value="1"> 已结束 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否显示成绩">
          <j-dict-select-tag
            v-model.trim="queryParam.scoreSet"
            trigger-change
            dict-code="scoreSet"
            placeholder="请选择成绩设置"
            :show-null-select="false"
            :allow-clear="true"
          />
        </a-form-item>
        <a-form-item label="是否普通试卷">
          <j-dict-select-tag
            v-model.trim="queryParam.isOnline"
            trigger-change
            dict-code="yn"
            placeholder="请选择是否普通试卷"
            :show-null-select="false"
            :allow-clear="true"
          />
        </a-form-item>
        <!-- <a-form-item label="考试类型">
          <j-dict-select-tag v-model="queryParam.combinationType" placeholder="请选择试卷类型" dict-code="combination_type" />
        </a-form-item> -->
        <!-- <a-form-model-item label="试卷分类" style="flex: 1;" prop="categoryId">
          <a-tree-select
            v-model.trim="queryParam.categoryId"
            :tree-data="paperList"
            style="width: 380px"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            placeholder="请选择"
            allow-clear
            tree-node-filter-prop="title"
          />
        </a-form-model-item> -->
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="reset">重置</a-button>
          <!-- <a-button type="primary" icon="plus" @click="$router.push('/ksgl/cjks')">创建考试</a-button> -->
          <a-button type="primary" icon="download" @click="handleExportXls('考试列表')">导出</a-button>
          <a-button
            type="primary"
            icon="download"
            @click="$refs.gradeSetting.show(selectedRowKeys)"
          >批量修改答题成绩显示</a-button>
        </a-form-item>
      </a-form>
      <def-columns :columns="columns" @setColumns="columns = $event" />
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        :scroll="{ x: true }"
        bordered
        row-key="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span v-if="record.isCurrentUserCreated == 1" slot="action" slot-scope="text, record" class="table-action">
          <a
            v-if="moment(record.limitEndTime) > moment().startOf() && record.examined == 0"
            @click="handleEdit(record, false)"
          >编辑</a>
          <a v-else @click="handleEdit(record, true)">详情</a>
          <!-- <a @click="$router.push('/kcgl/kclb/znsclx')">智能生成练习/考试</a> -->
          <a
            v-if="record.isOnline == 0"
            @click="$refs.paperPreviewModal.showModal(record.id, { isFixedTopic: record.combinationType === 1 })"
          >导出试卷</a>
          <a @click="achievement(record)">成绩查询</a>
          <a @click="examineeClick(record)">考生列表</a>
          <a v-if="record.isOnline == 0 && record.isOnlineNew == 1" @click="scoringClick(record)">打分人员</a>
          <a v-if="moment(record.limitEndTime) > moment().startOf()" @click="sending(record)">发送通知</a>
          <!-- <a>试卷导出</a> -->
          <!-- <a>复制</a> -->
          <a
            @click="$refs.gradeSetting.showModal(record)"
          >公布成绩</a>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        <span v-else slot="action" slot-scope="text, record" class="table-action">
          <a @click="examineeClick(record)">考生列表</a>
        </span>
      </a-table>
    </a-card>
    <cread-link ref="creadLink" @ok="linkCall" />
    <examinee-list ref="examineeList" />
    <scoring-list ref="scoringList" />
    <grade-setting ref="gradeSetting" @ok="modalFormOk" />
    <paper-preview-modal ref="paperPreviewModal" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction, httpAction } from '@/api/manage'
import CreadLink from './modules/CreadLink'
import ExamineeList from './modules/ExamineeList'
import ScoringList from './modules/ScoringList'
import GradeSetting from './modules/GradeSetting.vue'
import PaperPreviewModal from '../components/PaperPreviewModal'
import moment from 'moment'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'ksgl-ksgl',
  components: { CreadLink, ExamineeList, ScoringList, GradeSetting, PaperPreviewModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      dataSource: '',
      moment,
      selectShow: false,
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
          dataIndex: 'name'
        },
        {
          title: '考试类型',
          align: 'center',
          dataIndex: 'combinationType_dictText'
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'categoryId_dictText'
        },
        {
          title: '总分',
          align: 'center',
          dataIndex: 'totalScore',
          defaultHide: true
        },
        {
          title: '及格分数',
          align: 'center',
          dataIndex: 'passScore',
          defaultHide: true
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'limitStartTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'limitEndTime'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy_dictText'
        },
        {
          title: '成绩设置',
          align: 'center',
          dataIndex: 'scoreSet_dictText'
        },
        {
          title: '是否普通试卷',
          align: 'center',
          dataIndex: 'isOnline',
          customRender: function(t, r, index) {
            if (t == 0) {
              return '否'
            } else if (t == 1) {
              return '是'
            }
          }
        },
        // {
        //   title: '创建时间',
        //   align: 'center',
        //   dataIndex: 'createTime',
        //   width: 160,
        //   ellipsis: true
        // },
        // {
        //   title: '关联项',
        //   align: 'center',
        //   dataIndex: 'prop8'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width: 1
        }
      ],
      paperList: [], // 试卷分类
      dataList: {},
      userOptions: [], // 人员列表
      roles: '', // 角色
      checkoutRangeDate: '', // 时间
      queryParam: {
        isEnd: 0
      },
      url: {
        list: '/tExam/tExam/list',
        exportXlsUrl: '/tExam/tExam/exportXls',
        delete: '/tExam/tExam/delete'
      }
    }
  },
  created() {
    setTimeout(() => {
      this.selectShow = true
      this.getPaper()
      this.getanaly()
    })
    this.roles = this.$store.getters.userInfo.roles
  },
  activated() {
    // 保存、编辑考试刷新列表
    const queryType = this.$route.query.queryType
    if (queryType) {
      this.loadData()
    }
  },
  methods: {
    // 获取人员列表
    getanaly() {
      getAction('/tExam/tExam/getAdminAccount', {}).then(res => {
        if (res.success) {
          this.userOptions = []
          res.result.map(item => {
            const obj = {
              label: item.realname,
              value: item.username
            }
            this.userOptions.push(obj)
          })
        }
      })
    },
    createByChange(selevalue) {},
    // 获取试卷分类节点树
    getPaper() {
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
    // 日期赋值
    checkoutRangeChange(val) {
      this.queryParam.limitStartTime = val[0]
      this.queryParam.limitEndTime = val[1]
    },
    reset() {
      this.checkoutRangeDate = []
      this.searchReset()
    },
    // 编辑
    handleEdit(record, detailShow) {
      const that = this
      let url = ''
      let name = ''
      // 固定选题
      if (record.combinationType === 1) {
        url = '/tExam/tExam/queryById'
        name = 'ksgl-bjks'
      } else {
        url = '/tExam/tExam/queryRandomById'
        name = 'ksgl-bjks'
      }
      // combinationType==1 固定选题； combinationType==2随机选题（快速创建试卷）；combinationType==3 随机（复合试卷）
      getAction(url, { id: record.id }).then(res => {
        if (res.success) {
          this.dataList = res.result
          console.log('考试列表', res.result)
          const list = that.dataList
          list.type = '2'
          if (record.isOnline === 0) {
            list.combinationType = 3
            if (record.combinationType == 1) {
              list.combinationType = 4
            }
          } else {
            list.combinationType = record.combinationType
          }
          list.detailShow = detailShow
          that.$router.push({
            name: name,
            query: { ...list }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 成绩查询
    achievement(record) {
      this.$router.push({
        path: '/ksgl/cjcx',
        query: { record: record }
      })
      this.$store.commit('SET_QUERY_STATE', { componentName: 'ksgl-ksgl', queryParam: { examId: record.id }})
    },
    // 链接
    handleLink(record) {
      this.$refs.creadLink.showModal(record, false)
    },
    // 发送考试通知
    sending(record) {
      this.$refs.creadLink.showModal(record, true)
    },
    linkCall() {
      this.loadData()
    },
    // 考生列表
    examineeClick(record) {
      this.$refs.examineeList.showModal(record)
    },
    scoringClick(record) {
      this.$refs.scoringList.showModal(record)
    },
    changeTown() {
      this.$set(this.queryParam, 'id', undefined)
    }
  }
}
</script>
<style lang="less" scoped>
.choose-select {
  width: 300px !important;
}
.table-nowrap {
  margin-top: 15px;
}
/deep/.ant-select-selection {
  max-height: 60px;
  overflow-y: auto;
}
</style>
