<template>
  <div>
    <a-list class="comment-list" :header="`共 ${ipagination.total} 条评论`" item-layout="horizontal" :data-source="dataSource">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-comment :author="item.realname" :avatar="item.avatar||defaultAvatar">
          <p slot="content">{{ item.courseComment }}</p>
          <!--          <span slot="datetime">{{ item.createTime }}</span>-->
          <a-tooltip slot="datetime" :title="item.createTime">
            <span>{{ fromNow(item) }}</span>
          </a-tooltip>
        </a-comment>
      </a-list-item>
    </a-list>
    <div style="display: flex;justify-content: flex-end">
      <Pagination
        v-show="ipagination.total>0"
        :total="ipagination.total"
        :current.sync="ipagination.current"
        :page-size.sync="ipagination.pageSize"
        :page-size-options="ipagination.pageSizeOptions"
        @change="loadData"
      />
    </div>
    <a-comment>
      <a-avatar slot="avatar" :src="$store.getters.userInfo.avatar||defaultAvatar" />
      <div slot="content">
        <a-form-item>
          <a-textarea v-model="courseComment" :rows="4" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" :loading="loading" type="primary" style="float: right" @click="submitComment">提交评论</a-button>
        </a-form-item>
      </div>
    </a-comment>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@comp/oems/Pagination'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@api/manage'

export default {
  name: 'CourseEvaluation',
  components: { Pagination },
  mixins: [JeecgListMixin],
  props: {
    courseId: {
      type: String,
      required: true
    },
    courseCoursewareId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      defaultAvatar: require('@/assets/defaultAvatar.png'),
      url: {
        list: '/cCourseComment/cCourseComment/list'
      },
      courseComment: ''
    }
  },
  watch: {
    courseCoursewareId(val) {
      if (val) {
        this.searchQuery()
      }
    }
  },
  methods: {
    fromNow(item) {
      const value = moment(item.createTime).fromNow()
      return value === '几秒后' ? '几秒前' : value // 处理某些电脑时间与服务器的微小时间差
    },
    connectParams(params) {
      params.courseId = this.courseId
      params.courseCoursewareId = this.courseCoursewareId
    },
    // 提交评论
    submitComment() {
      postAction('/cCourseUser/cCourseUser/evaluateCourse', { courseId: this.courseId, courseCoursewareId: this.courseCoursewareId, courseComment: this.courseComment }).then(res => {
        this.$message.success('评价成功')
        this.searchQuery()
        this.courseComment = ''
      })
    }
  }
}
</script>

<style scoped>

</style>
