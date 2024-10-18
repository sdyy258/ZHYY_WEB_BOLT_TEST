<template>
  <div class="wrapper">
    <a-spin :spinning="loading">
      <a-row :gutter="12" style="position: relative;padding-bottom: 10px">
        <a-col :span="18" class="col-left">
          <div style="height: 760px;background: white">
            <template v-if="currentCourse.filePath && currentCourse.filePath.endsWith('.pdf')">
              <div style="border-bottom: 1px solid #ccc">
                <pdf-preview :key="currentCourse.filePath" :path="currentCourse.filePath" height="649px" />
              </div>
              <!--              <vue-pdf-app-->
              <!--                style="height: 650px"-->
              <!--                :pdf="currentCourse.filePath"-->
              <!--              />-->
            </template>
            <template v-else>
              <video-player
                :url="currentCourse.filePath || ''"
                :courseware-id="currentCourse.id || ''"
                :watch-start-time="currentCourse.lengthOfTime || 0"
                :is-double-speed="data.isDoubleSpeed"
                is-get-play-info
                height="650px"
                @setPlayInfo="setPlayInfo"
              />
            </template>
            <div class="course-info">
              <div>
                <div class="course-name">{{ data.courseName }}</div>
                <div class="course-author">讲师：{{ currentCourse.author }}</div>
              </div>
              <a-rate v-model="courseAvg" allow-half disabled />
              <div v-if="data.isAllowedDz === 1" class="thumbs-collect">
                <div style="margin-right: 15px;">
                  <a-tooltip placement="bottom" style="display: flex;">
                    <template slot="title">
                      点击收藏
                    </template>
                    <div class="flex align-center">
                      <img v-if="data.isCollect === 1" :src="icon.collectHL" @click="collect" />
                      <img v-else :src="icon.collect" @click="collect" />
                    </div>
                  </a-tooltip>
                </div>
                <a-tooltip placement="bottom" style="display: flex;">
                  <template slot="title"> 点赞：{{ currentCourse.dzNum }}次 </template>
                  <div class="flex align-center">
                    <img v-if="currentCourse.isDz === 1" :src="icon.thumbsHL" @click="changeDz" />
                    <img v-else :src="icon.thumbs" @click="changeDz" />
                    <span style="margin-left: 2px">{{ currentCourse.dzNum }}次</span>
                  </div>
                </a-tooltip>
                <a-tooltip placement="bottom" style="display: flex;">
                  <template slot="title"> 点击量：{{ data.allBroadCast || 0 }} </template>
                  <div class="flex align-center" style="margin-left: 10px;">
                    <!--                  <img v-else :src="icon.thumbs" @click="changeDz">-->
                    <!-- <div>点击量：</div> -->
                    <img :src="icon.hits" />
                    <span style="margin-left: 2px">{{ data.allBroadCast || 0 }}次</span>
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
          <a-card style="margin-top: 15px;min-height: 300px">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="课程介绍">
                <div v-html="data.courseDetail" />
              </a-tab-pane>
              <a-tab-pane key="2" tab="随堂练习">
                <classroom-practice
                  :key="currentCourse.id"
                  :course-id="model.id || ''"
                  :course-courseware-id="currentCourse.id || ''"
                  :question-list="currentCourse.exercisesRecordList || []"
                />
              </a-tab-pane>
              <a-tab-pane v-if="data.isAllowedComment === 1" key="3" tab="课程评论">
                <course-comment :course-id="model.id" :course-courseware-id="currentCourse.id || ''" />
              </a-tab-pane>
              <a-tab-pane key="4" tab="课程评价">
                <course-evaluation
                  :course-id="model.id"
                  :course-courseware-id="currentCourse.id || ''"
                  @reloadAvg="getCourseAvg"
                />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
        <a-col :span="6" class="col-right">
          <a-card
            style="min-height: 100%"
            :head-style="{ background: '#CAD8F5' }"
            :body-style="{ padding: '20px 12px' }"
          >
            <div slot="title" style="display: flex;justify-content: space-between">
              <span>课程目录</span>
              <a-button @click="returnBack">返回</a-button>
            </div>
            <div class="cu-list">
              <div
                v-for="i in courseList"
                :key="i.id"
                class="cu-item"
                :class="i.id === currentCourse.id ? 'active' : ''"
                @click="changeCourse(i)"
              >
                <div class="flex">
                  <div><img :src="i.id === currentCourse.id ? icon.playHL : icon.play" /></div>
                  <div style="font-weight: 600;font-size: 16px;flex: 1;margin: 0 7px">{{ i.lessonName }}</div>
                  <div v-if="i.id === currentCourse.id"><img :src="icon.looking" /></div>
                </div>
                <template v-if="!(currentCourse.filePath && currentCourse.filePath.endsWith('.pdf'))">
                  <div class="fileLengthTime">
                    <span>时长:</span>
                    <span>{{ $utils.secondToMinute(i.fileLengthTime) }}分钟</span>
                  </div>
                  <div>
                    <a-progress
                      :key="currentCourse.id"
                      :percent="$utils.toPercent(i.lengthOfTime, i.fileLengthTime)"
                      stroke-color="#589BF2"
                    />
                  </div>
                </template>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import VideoPlayer from '@/components/custom/VideoPlayer'
import ClassroomPractice from './components/ClassroomPractice'
import CourseEvaluation from './components/CourseEvaluation'
import CourseComment from './components/CourseComment'
import { getAction, postAction, putAction } from '@api/manage'
// import VuePdfApp from 'vue-pdf-app'
// import 'vue-pdf-app/dist/icons/main.css'
import PdfPreview from '@/components/custom/PdfPreview.vue'
export default {
  name: 'Index',
  components: { ClassroomPractice, CourseEvaluation, CourseComment, VideoPlayer, PdfPreview },
  data() {
    return {
      model: {},
      data: {},
      courseList: [],
      currentCourse: {}, // 当前播放课程
      // isCollect: '', // 是否收藏
      loading: false,
      icon: {
        collect: require('@/assets/collect.png'),
        collectHL: require('@/assets/collectHL.png'),
        thumbsHL: require('@/assets/thumbsHL.png'),
        thumbs: require('@/assets/thumbs.png'),
        play: require('@/assets/play.png'),
        playHL: require('@/assets/play_hl.png'),
        looking: require('@/assets/looking.png'),
        hits: require('@/assets/dianjiliang.png')
      },
      courseAvg: 0
    }
  },
  created() {
    this.model = this.$route.query
    this.loading = true
    getAction('/cCourseUser/cCourseUser/queryById', { id: this.model.id }).then(async res => {
      this.loading = false
      this.data = res.result
      this.courseList = this.data.courseCoursewareList.sort((a, b) => a.sort - b.sort)
      // this.getCurrentCourse(this.courseList[0] || {})
      this.currentCourse = this.courseList[0] || {}
      this.getCourseAvg()
      await postAction('/cCourseUser/cCourseUser/addCoursewareUser', { courseId: this.model.id })
      this.changePdfStatus()
      // postAction('/cCourseUser/cCourseUser/addTrifle', { courseCoursewareId: this.currentCourse.id })
    })
    // 进来时调一次该接口
  },
  // beforeRouteEnter(to, form, next) {
  //   next(vm => {
  //     document.getElementById('app').style.overflowY = 'hidden'
  //   })
  // },
  // beforeRouteLeave(to, form, next) {
  //   document.getElementById('app').style.overflowY = 'unset'
  //   next()
  // },
  methods: {
    changePdfStatus() {
      // 1pdf 2视频
      if (this.currentCourse.coursewareType === 1) {
        putAction('/cCourseUser/cCourseUser/editLearnStatus', {
          courseId: this.model.id,
          courseCoursewareId: this.currentCourse.id
        })
      }
    },
    /**
     * 获取或刷新当前小结内容
     * @param item
     */
    getCurrentCourse(item) {
      getAction('/cCourseUser/cCourseUser/queryById', { id: this.model.id, courseCoursewareId: item.id }).then(res => {
        this.currentCourse = res.result.courseCoursewareList[0] || {}
        this.courseList = this.courseList.map(item => {
          if (item.id === this.currentCourse.id) {
            return this.currentCourse
          } else {
            return item
          }
        })
      })
    },
    /**
     * 切换小结
     * @param item
     */
    changeCourse(item) {
      this.getCurrentCourse(item)
      postAction('/cCourseUser/cCourseUser/addTrifle', { courseCoursewareId: this.currentCourse.id })
      this.changePdfStatus()
    },
    // 当前小结播放时长修改
    setPlayInfo(data) {
      if (this.currentCourse.learnStatus !== 2) {
        putAction('/cCourseUser/cCourseUser/editTrifle', {
          courseId: this.model.id,
          courseCoursewareId: this.currentCourse.id,
          lengthOfTime: data.second
        }).then(res => {
          if (res.success) {
            this.$set(this.currentCourse, 'lengthOfTime', data.second)
            this.$forceUpdate()
          } else {
            if (res.message) {
              this.$message.warning(res.message)
            }
          }
        })
      } else {
        if (this.currentCourse.lengthOfTime < Number(this.currentCourse.fileLengthTime || 0)) {
          putAction('/cCourseUser/cCourseUser/editTrifle', {
            courseId: this.model.id,
            courseCoursewareId: this.currentCourse.id,
            lengthOfTime: data.second
          }).then(res => {
            if (res.success) {
              this.$set(this.currentCourse, 'lengthOfTime', data.second)
              this.$forceUpdate()
            } else {
              if (res.message) {
                this.$message.warning(res.message)
              }
            }
          })
        }
      }
      if (data.second == this.currentCourse.fileLengthTime) {
        this.$set(this.currentCourse, 'learnStatus', 2)
      }
    },
    // 收藏
    collect() {
      const isCollect = this.data.isCollect === 1 ? 0 : 1
      postAction('/cCourseUser/cCourseUser/collectCourseByUser', {
        courseId: this.model.id,
        isCollect: isCollect
      }).then(res => {
        if (res.success) {
          const message = this.data.isCollect === 1 ? '取消收藏' : res.message
          this.$message.success(message)
          getAction('/cCourseUser/cCourseUser/queryById', { id: this.model.id }).then(res1 => {
            this.loading = false
            this.data = res1.result
            this.courseList = this.data.courseCoursewareList.sort((a, b) => a.sort - b.sort)
            this.currentCourse = this.courseList[0] || {}
            this.getCourseAvg()
            this.getCurrentCourse(this.currentCourse)
          })
        }
      })
    },
    // 修改点赞
    changeDz() {
      const isDz = this.currentCourse.isDz === 1 ? 0 : 1
      postAction('/cCourseUser/cCourseUser/praiseCourse', {
        courseId: this.model.id,
        courseCoursewareId: this.currentCourse.id,
        isDz: isDz
      }).then(res => {
        if (res.success) {
          this.getCurrentCourse(this.currentCourse)
        }
      })
    },
    // 获取评价平均分
    getCourseAvg() {
      getAction('/cCourseUser/cCourseUser/courseAvg', { courseId: this.model.id }).then(res => {
        this.courseAvg = Math.round(res.result * 2) / 2 || 0
      })
    },
    returnBack() {
      if (this.model.showCollect == 1) {
        this.$router.push('/yxy/kcsc')
      } else {
        this.$router.push('/yxy/kclb')
      }
    }
  }
}
</script>

<style scoped lang="less">
@height: calc(100vh - 140px);
.wrapper {
  .col-left {
    min-height: @height;
    overflow-y: auto;
    overflow-x: hidden;

    .course-info {
      display: flex;
      justify-content: space-between;
      padding: 20px 40px;

      .course-name {
        font-weight: 600;
        font-size: 24px;
        letter-spacing: 1px;
      }

      .course-author {
        display: inline-block;
        margin-top: 10px;
        background: #ececee;
        padding: 3px 10px;
        border-radius: 6px;
        color: #666;
      }

      .thumbs-collect {
        display: flex;
        align-items: center;
        height: 30px;
        img {
          cursor: pointer;
        }
      }
    }
  }

  .col-right {
    //min-height: @height;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 10px;

    .cu-list {
      .cu-item {
        margin-bottom: 20px;
        cursor: pointer;
        padding: 8px 15px;
        border-radius: 6px;

        &.active {
          background: #ebf3fe;
        }

        .fileLengthTime {
          background: #f1f2f4;
          padding: 3px 10px;
          border-radius: 6px;
          color: #666;
          display: inline-block;
          margin-left: 15px;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
