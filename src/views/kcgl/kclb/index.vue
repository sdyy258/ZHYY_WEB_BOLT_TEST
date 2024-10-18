<template>
  <a-card :bordered="false">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="课程名称">
        <a-input v-model.trim="queryParam.courseName" placeholder="请输入课程名称" />
      </a-form-item>
      <a-form-item label="课程分类">
        <a-tree-select
          v-model.trim="queryParam.categoryId"
          :tree-data="treeData"
          style="width: 200px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择课程分类"
          allow-clear
          tree-node-filter-prop="value"
          tree-default-expand-all
        />
      </a-form-item>
      <a-form-item label="课程状态">
        <j-dict-select-tag v-model.trim="queryParam.courseStatus" trigger-change dict-code="course_status" :show-null-select="false" placeholder="请选择课程状态" />
      </a-form-item>
      <a-form-item label="课件数量">
        <a-input-number v-model.trim="queryParam.coursewareNumber" :min="0" :precision="0" placeholder="请输入课件数量" style="width: 100%;" />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        <a-button type="primary" icon="delete" @click="batchDel">批量删除</a-button>
        <a-button type="primary" icon="download" @click="handleExportXlsx('课程列表模板导入')">导入模板下载</a-button>
        <j-upload type="upload" text="导入" :number="1" :multiple="false" :before-upload="beforeUpload" style="display: inline-block;" @change="handleChange" />
      </a-form-item>
    </a-form>
    <def-columns :columns="columns" @setColumns="columns=$event" />
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      :scroll="{x:true}"
      bordered
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="courseLittlePicture" slot-scope="text">
        <img :src="getImgView(text)" alt="">
      </span>
      <span slot="operation" slot-scope="text, record" class="table-action">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
        <!-- <a>复制</a> -->
        <!-- <a @click="$router.push('/kcgl/kclb/znsclx')">智能生成练习/考试</a> -->
      </span>
    </a-table>
  </a-card>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: 'Index',
  mixins: [JeecgListMixin],
  data() {
    return {
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
          title: '预览图',
          align: 'center',
          dataIndex: 'courseLittlePicture',
          scopedSlots: { customRender: 'courseLittlePicture' }
        },
        {
          title: '课程名称',
          align: 'center',
          dataIndex: 'courseName'
        },
        {
          title: '课程大类',
          align: 'center',
          dataIndex: 'firstCategoryName'
        },
        {
          title: '课程小类',
          align: 'center',
          dataIndex: 'categoryName'
        },
        {
          title: '课程状态',
          align: 'center',
          dataIndex: 'courseStatus_dictText'
        },
        {
          title: '课件数量',
          align: 'center',
          dataIndex: 'coursewareNumber'
        },
        {
          title: '视频点击量',
          align: 'center',
          dataIndex: 'allBroadCast'
        },
        {
          title: '课程试题数量',
          align: 'center',
          dataIndex: 'questionNum'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      url: {
        list: '/cCourseInfo/cCourseInfo/list',
        delete: '/cCourseInfo/cCourseInfo/delete',
        deleteBatch: '/cCourseInfo/cCourseInfo/deleteBatch',
        exportXlsUrl: '/cCourseInfo/cCourseInfo/downloadTemplate',
        importExcelUrl: '/cCourseInfo/cCourseInfo/importExcel',
        queryById: '/cCourseInfo/cCourseInfo/queryById'
      },
      treeData: []
    }
  },
  created() {
    getAction('sys/category/rootListNew', { type: 4, pageSize: 500 }).then(res => {
      if (res.success) {
        this.treeData = res.result.map(item => {
          item.selectable = false
          return item
        })
      } else {
        this.$message.warning(res.message)
      }
    })
  },
  methods: {
    handleAdd() {
      this.$router.push({
        name: 'kcgl-kctj'
      })
    },
    handleEdit(record) {
      getAction(this.url.queryById, { id: record.id }).then((res) => {
        if (res.success) {
          const params = { recordId: record.id }
          this.$router.push({
            name: 'kcgl-kctj',
            params: { ...res.result },
            query: { ...params }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        const files = file.name.split('.')
        const num = files.length - 1
        const type = file.name.split('.')[num]
        if (type !== 'xlsx') {
          this.$message.warning('请上传.xlsx格式的文件!')
          return reject(false)
        }
        return resolve(true)
      })
    },
    handleChange(value) {
      postAction(this.url.importExcelUrl, { fileUrl: value }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
  /deep/ .ant-upload-list{
    display: none !important;
  }
</style>
