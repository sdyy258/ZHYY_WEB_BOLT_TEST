<template>
  <div>
    <a-card :bordered="false">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="所属机构">
          <j-select-depart
            v-model="queryParam.departId"
            :multi="false"
            :back-depart="true"
            :tree-opera="true"
            @back="backDepartInfo"
          />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model.trim="queryParam.realname" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model.trim="queryParam.courseName" placeholder="请输入课程名称" />
        </a-form-item>
        <!-- <a-form-item label="小节名称">
          <j-input v-model.trim="queryParam.name" placeholder="请输入小节名称" />
        </a-form-item> -->
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('考试列表')">导出</a-button> -->
        </a-form-item>
      </a-form>
      <def-columns :columns="columns" @setColumns="columns = $event" />
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        :scroll="{ x: true }"
        bordered
        :row-key="(record, index) => index"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="newTime" slot-scope="text, record" class="table-action">
          <a-progress :stroke-color="getPercentColor(record.newTime)" :percent="record.newTime" style="width: 80%;" />
        </span>
        <span v-if="record.isCurrentUserCreated == 1" slot="action" slot-scope="text, record" class="table-action">
          <a @click="handleEdit(record, false)">编辑</a>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction, httpAction } from '@/api/manage'
import moment from 'moment'
export default {
  components: {},
  mixins: [JeecgListMixin],
  data() {
    return {
      // disableMixinCreated: true,
      dataSource: [],
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
          title: '所属机构',
          align: 'center',
          dataIndex: 'departIds_dictText',
          width: 100,
          ellipsis: true
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname',
          width: 60,
          ellipsis: true
        },
        {
          title: '课程名称',
          align: 'center',
          dataIndex: 'courseName',
          width: 180,
          ellipsis: true
        },
        {
          title: '小节名称',
          align: 'center',
          dataIndex: 'lessonName',
          width: 180,
          ellipsis: true
        },
        {
          title: '百分比',
          align: 'center',
          dataIndex: 'newTime',
          width: 200,
          scopedSlots: { customRender: 'newTime' }
          //   defaultHide: true
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'action' },
        //   width: 1
        // }
      ],
      roles: '', // 角色
      queryParam: {},
      url: {
        list: '/cCourseUser/cCourseUser/studentLearnTimePage',
        exportXlsUrl: '/tExam/tExam/exportXls',
        delete: '/tExam/tExam/delete'
      }
    }
  },
  created() {
    this.roles = this.$store.getters.userInfo.roles
  },
  methods: {
    backDepartInfo(info) {
      if (info.length > 0) {
        this.queryParam.departId = info
          .map(item => {
            return item.value
          })
          .join(',')
      }
      this.$forceUpdate()
    },
    getPercentColor(value) {
      let p = Number(value)
      if (p >= 60 && p < 100) {
        return '#108ee9'
      } else if (p >= 100) {
        return '#87d068'
      } else {
        return 'red'
      }
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
