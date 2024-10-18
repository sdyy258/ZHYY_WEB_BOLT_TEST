<template>
  <a-card :bordered="false">
    <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
      <a-form-item label="课程名称">
        <a-input v-model.trim="queryParam.courseName" placeholder="请输入课程名称" />
      </a-form-item>
      <a-form-item label="课程大类">
        <a-select v-model="queryParam.categoryRootId" placeholder="请输入课程大类" :allow-clear="true">
          <a-select-option v-for="i in treeData" :key="i.value">
            {{ i.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程小类">
        <a-tree-select
          v-model.trim="queryParam.categoryId"
          :tree-data="treeData"
          style="width: 200px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择课程小类"
          allow-clear
          tree-node-filter-prop="value"
          tree-default-expand-all
        />
      </a-form-item>
      <a-form-item label="学习状态">
        <j-dict-select-tag
          v-model.trim="queryParam.learnStatus"
          trigger-change
          dict-code="course_learn_status"
          :show-null-select="false"
          placeholder="请选择学习状态"
        />
      </a-form-item>
      <a-form-item label="年度">
        <a-date-picker
          v-model="queryParam.year"
          format="YYYY"
          value-format="YYYY"
          mode="year"
          placeholder="请选择年度"
          :disabled-date="disabledDate"
          :allow-clear="false"
          style="width: 280px;"
          @panelChange="$set(queryParam, 'year', $time.moment($event).format('YYYY'))"
        >
        </a-date-picker>
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
      </a-form-item>
    </a-form>
    <def-columns :columns="columns" @setColumns="columns = $event" />
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
    >
      <!-- <span slot="operation" slot-scope="text, record" class="table-action">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </span> -->
    </a-table>
  </a-card>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import moment from 'moment'
export default {
  name: 'Index',
  mixins: [JeecgListMixin],
  data() {
    return {
      moment,
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
          title: '课程名称',
          align: 'center',
          dataIndex: 'courseName',
          width: 250,
          ellipsis: true
        },
        {
          title: '课程大类',
          align: 'center',
          dataIndex: 'firstCategoryName',
          width: 200,
          ellipsis: true
        },
        {
          title: '课程小类',
          align: 'center',
          dataIndex: 'categoryName',
          width: 200,
          ellipsis: true
        },
        // {
        //   title: '视频数量',
        //   align: 'center',
        //   dataIndex: 'coursewareNumber',
        //   width: 100,
        //   ellipsis: true
        // },
        // {
        //   title: '视频总时长',
        //   align: 'center',
        //   dataIndex: 'coursewareNumber',
        //   width: 100,
        //   ellipsis: true
        // },
        {
          title: '学习状态',
          align: 'center',
          dataIndex: 'learnStatus_dictText',
          width: 100,
          ellipsis: true
        },
        {
          title: '已看时长(分钟)',
          align: 'center',
          dataIndex: 'sumTime',
          width: 100,
          ellipsis: true,
          customRender: function(t, r, index) {
            return t || '0'
          }
        }
        // {
        //   title: '操作',
        //   align: 'center',
        //   dataIndex: 'operation',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
      url: {
        list: '/cCourseUser/cCourseUser/courseInfoList',
        delete: '/cCourseInfo/cCourseInfo/delete',
        deleteBatch: '/cCourseInfo/cCourseInfo/deleteBatch',
        queryById: '/cCourseInfo/cCourseInfo/queryById'
      },
      treeData: [],
      queryParam: {
        year: moment().format('YYYY')
      }
    }
  },
  created() {
    setTimeout(() => {
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
    })
  },
  methods: {
    disabledDate(current) {
      if (current < moment('2023')) {
        return true
      } else if (current > moment()) {
        return true
      } else {
        return false
      }
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.year = moment().format('YYYY')
      this.loadData(1)
    }
    // handleAdd() {
    //   this.$router.push({
    //     name: 'kcgl-kctj'
    //   })
    // },
    // handleEdit(record) {
    //   getAction(this.url.queryById, { id: record.id }).then((res) => {
    //     if (res.success) {
    //       const params = { recordId: record.id }
    //       this.$router.push({
    //         name: 'kcgl-kctj',
    //         params: { ...res.result },
    //         query: { ...params }
    //       })
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   })
    // }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-upload-list {
  display: none !important;
}
</style>
