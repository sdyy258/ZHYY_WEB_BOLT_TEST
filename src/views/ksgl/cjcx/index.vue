<template>
  <div>
    <a-card :bordered="false">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item v-if="roles.indexOf('stadmin') > -1 || roles.indexOf('admin') > -1" label="考试创建人">
          <a-select
            v-model="queryParam.examCreate"
            show-search
            placeholder="请选择人员"
            option-filter-prop="children"
            :filter-option="filterOption"
            allow-clear
            @change="changeCreate"
          >
            <a-select-option v-for="item in userOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="考试名称" style="flex: 1;">
          <j-multi-select-tag
            v-if="queryParam.examCreate"
            v-model="queryParam.examId"
            :dict-code="`t_exam,name,id,del_flag=0 and create_by='${queryParam.examCreate}' order by create_time desc`"
            :has-del-flag="false"
            placeholder="请选择"
            style="width: 400px"
          />
          <j-multi-select-tag
            v-else
            v-model="queryParam.examId"
            dict-code="t_exam,name,id,del_flag=0  order by create_time desc"
            :has-del-flag="false"
            placeholder="请选择"
            style="width: 400px"
          />

          <!-- <j-multi-select-tag v-if="selectShow" v-model="queryParam.examId" class="choose-select" placeholder="请选择" dict-code="t_exam,name,id,del_flag=0" />-->
          <!-- <a-input v-model="queryParam.examName" placeholder="请输入考试名称" /> -->
        </a-form-item>
        <a-form-item label="上级机构">
          <j-select-depart
            v-if="selectShow"
            v-model="queryParam.parentDepartId"
            :multi="true"
            :back-depart="true"
            :tree-opera="true"
            @back="backParentDepartInfo"
          />
        </a-form-item>
        <a-form-item label="所属机构">
          <j-select-depart
            v-if="selectShow"
            v-model="queryParam.departId"
            :multi="true"
            :back-depart="true"
            :tree-opera="true"
            @back="backDepartInfo"
          />
        </a-form-item>
        <!-- <a-form-item label="创建人"> -->
        <a-form-item label="用户名称" style="flex: 1;">
          <a-input v-model.trim="queryParam.userName" placeholder="请输入用户名称" />
        </a-form-item>
        <a-form-item label="是否已参考" style="flex: 1;">
          <j-dict-select-tag
            v-model="queryParam.status"
            allow-clear
            placeholder="请选择"
            dict-code="exam_status"
            :show-null-select="false"
          />
        </a-form-item>
        <a-form-item label="是否及格" style="flex: 1;">
          <j-dict-select-tag
            v-model="queryParam.result"
            allow-clear
            placeholder="请选择"
            dict-code="exam_result"
            :show-null-select="false"
          />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <!--          <a-button type="primary" icon="reload" @click="reset">重置</a-button>-->
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
          <a-button type="primary" icon="download" @click="handleExportXlsx('成绩文件')">导出</a-button>
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
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="isCameraCapture" slot-scope="text, record">
          <span v-if="record.isCameraCapture == 0">{{ text }}</span>
          <a v-else @click="recordClick(record)">{{ text }}</a>
        </span>
        <span slot="action" slot-scope="text, record" class="table-action">
          <a v-if="record.status" @click="reviewPaper(record)">试卷回看</a>
          <a-popconfirm v-if="rolesShow" title="确定重置该考试记录吗?" @confirm="resetExam(record)">
            <a>重置考试</a>
          </a-popconfirm>
          <a-popconfirm v-if="rolesShow" title="确定删除该考生吗?" @confirm="deleteRecord(record)">
            <a>删除考生</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <snap-record ref="snapRecord" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SnapRecord from './SnapRecord'
import { downFile, getAction } from '@/api/manage'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'ksgl-cjcx',
  components: { SnapRecord },
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      dataSource: [],
      disabled: true,
      selectShow: false,
      id: '',
      userOptions: [], // 人员列表
      roles: '', // 角色
      rolesShow: true,
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
          title: '创建人',
          align: 'center',
          dataIndex: 'examCreate_dictText'
        },
        // {
        //   title: '试卷名称',
        //   align: 'center',
        //   dataIndex: 'paperName'
        // },
        {
          title: '上级机构',
          align: 'center',
          dataIndex: 'parentDepartName'
        },
        {
          title: '所属机构',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '用户名称',
          align: 'center',
          dataIndex: 'realName'
        },
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '是否抓拍',
          align: 'center',
          dataIndex: 'isCameraCapture_dictText',
          scopedSlots: { customRender: 'isCameraCapture' }
        },
        {
          title: '得分',
          align: 'center',
          dataIndex: 'score',
          customRender: function(t, r, index) {
            return t || '0'
          }
        },
        {
          title: '耗时(分钟)',
          align: 'center',
          dataIndex: 'tookTime',
          customRender: function(t, r, index) {
            return t || '0'
          }
        },
        {
          title: '是否参考',
          align: 'center',
          dataIndex: 'status_dictText'
        },
        {
          title: '是否及格',
          align: 'center',
          dataIndex: 'result_dictText'
        },
        // {
        //   title: '提交时间',
        //   align: 'center',
        //   dataIndex: 'updateTime'
        // }
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 1,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/tExamPaperUser/tExamPaperUser/examScore',
        exportXlsUrl: '/tExamPaperUser/tExamPaperUser/exportExamScore'
      }
    }
  },
  created() {
    // 是否从试卷回看进入
    if (this.$route.query.showCache) {
      if (this.$store.getters.pageState['ksgl-cjcx']) {
        this.ipagination = this.$store.getters.pageState['ksgl-cjcx']
      }
    }
    // 区分是否从考试列表查询的成绩
    if (this.$route.query.feedbackShow) {
      if (this.$store.getters.queryState['ksgl-ksgl']) {
        this.queryParam = this.$store.getters.queryState['ksgl-ksgl']
      }
    }
    // this.roles = this.$store.getters.userInfo.roles
    // const roleList = this.roles.split(',')
    // for (const i in roleList) {
    //   if (roleList[i] === 'admin') {
    //     this.rolesShow = true
    //     break
    //   }
    // }
    const m = this.$route.query.record
    if (m) {
      this.disableMixinCreated = false
      this.$set(this.queryParam, 'examId', m.id)
      // this.queryParam.examId = m.id
      this.id = m.id
      this.disabled = false
      this.searchQuery()
      this.$forceUpdate()
    } else {
      this.disableMixinCreated = false
      this.loadData()
    }
    setTimeout(() => {
      this.selectShow = true
      this.getanaly()
    })
  },
  methods: {
    handleExportXlsx(fileName, type = 2, id) {
      if (!fileName || typeof fileName !== 'string') {
        fileName = '导出文件'
      }
      let param
      if (type === 3) {
        param = {
          orderId: id
        }
      } else {
        param = this.getQueryParams()
      }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        // param['selections'] = this.selectedRowKeys.join(',')
        if (type === 1) {
          param['selections'] = this.selectedRowKeys.join(',')
        } else {
          param['idList'] = this.selectedRowKeys
        }
      }
      // console.log('导出参数', param)
      downFile(this.url.exportXlsUrl, param).then(data => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
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
    // 试卷回看
    reviewPaper(record) {
      record.queryType = true
      const params = { ...record }
      // 区分是否从考试列表查询的成绩
      if (this.id) {
        params.feedbackShow = true
      }
      this.$router.push({
        path: '../../zxks/historyDetail',
        query: { ...params }
      })
      this.$store.commit('SET_PAGE_STATE', { componentName: 'ksgl-cjcx', ipagination: this.ipagination })
      this.$store.commit('SET_QUERY_STATE', { componentName: 'ksgl-cjcx', queryParam: this.queryParam })
    },
    // 重置考试
    resetExam(record) {
      getAction('/tExamPaperUser/tExamPaperUser/resetExamPaperUser', { id: record.id }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除记录
    deleteRecord(record) {
      getAction('/tExamPaperUser/tExamPaperUser/deleteExamPaperUser', { id: record.id }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    backDepartInfo(info) {
      if (info.length > 0) {
        this.queryParam.departId = info
          .map(item => {
            return item.value
          })
          .join(',')
      }
      // this.queryParam.departId = info[0].value
      this.$forceUpdate()
    },
    backParentDepartInfo(info) {
      if (info.length > 0) {
        this.queryParam.parentDepartId = info
          .map(item => {
            return item.value
          })
          .join(',')
      }
      // this.queryParam.parentDepartId = info[0].value
      this.$forceUpdate()
    },
    recordClick(record) {
      this.$refs.snapRecord.showModal(record)
    },
    // 重置
    reset() {
      if (!this.disabled) {
        this.queryParam = {}
        this.queryParam.examId = this.id
        this.loadData(1)
      } else {
        this.searchReset()
      }
    },
    changeCreate() {
      this.$set(this.queryParam, 'examId', undefined)
    }
  }
}
</script>
<style lang="less" scoped>
.choose-select {
  width: 300px !important;
}
/deep/.ant-select-selection {
  max-height: 50px;
  overflow-y: auto;
}
</style>
