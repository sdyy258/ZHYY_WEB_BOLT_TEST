<template>
  <a-spin :spinning="loading">
    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
      <div>
        <span style="margin-right: 10px;font-weight: 600">课程内容</span>
        <a-rate v-model="data.courseEvaluation" :disabled="data.isEvaluation" />
      </div>
      <div>
        <span style="margin-right: 10px;font-weight: 600">教学效果</span>
        <a-rate v-model="data.teachEvaluation" :disabled="data.isEvaluation" />
      </div>
      <div>
        <span style="margin-right: 10px;font-weight: 600">讲师评价</span>
        <a-rate v-model="data.lecturerEvaluation" :disabled="data.isEvaluation" />
      </div>
      <a-button v-if="!data.isEvaluation" type="primary" style="margin-top: 40px" @click="handleSubmit">提交评价</a-button>
    </div>
  </a-spin>
</template>

<script>
import { getAction, postAction } from '@api/manage'

export default {
  name: 'CourseEvaluation',
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
      disabled: false,
      loading: false,
      data: {}
    }
  },
  watch: {
    courseCoursewareId(val) {
      if (val) {
        this.searchQuery()
      }
    }
  },
  created() {
    this.searchQuery()
  },
  methods: {
    searchQuery() {
      this.loading = true
      getAction('/cCourseUser/cCourseUser/queryById', { id: this.courseId, courseCoursewareId: this.courseCoursewareId }).then(res => {
        this.loading = false
        this.data = res.result.courseCoursewareList[0] || {}
      })
    },
    handleSubmit() {
      const params = {
        courseId: this.courseId,
        courseCoursewareId: this.courseCoursewareId,
        courseEvaluation: this.data.courseEvaluation,
        teachEvaluation: this.data.teachEvaluation,
        lecturerEvaluation: this.data.lecturerEvaluation,
        isEvaluation: 1
      }
      postAction('/cCourseUser/cCourseUser/praiseCourse', params).then(res => {
        if (res.success) {
          this.searchQuery()
          this.$emit('reloadAvg')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
