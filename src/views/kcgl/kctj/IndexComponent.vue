<template>
  <div>
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-card :bordered="false">
        <a-form-item label="课程名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea v-decorator="['courseName', validatorRules.courseName]" placeholder="请输入课程名称" auto-size />
        </a-form-item>
        <a-form-item label="课程分类" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-cascader
            v-decorator="['categoryIdId', validatorRules.categoryIdId]"
            :options="treeData"
            placeholder="请选择课程分类"
            allow-clear
            :field-names="{ label: 'title', value: 'value', children: 'children' }"
            @change="treeSelectchange"
          />
        </a-form-item>
        <a-form-item label="课程状态" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="['courseStatus']">
            <a-radio :value="0">已禁用</a-radio>
            <a-radio :value="1">使用中</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="参与学员"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-radio-group
            v-decorator="['participationMethods']"
            @change="model.participationMethods = $event.target.value"
          >
            <a-radio :value="1">全员参与</a-radio>
            <a-radio :value="2">按地市参与</a-radio>
            <!-- <a-radio :value="3">省站用户</a-radio> -->
            <a-radio :value="4">指定用户</a-radio>
          </a-radio-group>
          <div v-if="model.participationMethods == 1" style="display: inline-block;">
            <span style="color:#F5222D;font-size: 12px;">*</span>
            <span style="color:#B4B6BD;font-size: 12px;">注：组织内全部学员均可参加</span>
          </div>
        </a-form-item>
        <a-form-item
          v-if="model.participationMethods == 2"
          label="参与地市范围"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <j-multi-select-tag
            v-decorator="['departIds', validatorRules.departIds]"
            trigger-change
            :options="departList"
            placeholder="请选择参与地市范围"
          />
        </a-form-item>
        <a-form-item
          v-if="model.participationMethods == 4"
          label="指定用户"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-model="userIdList" @click.stop="handleAddUserRole" @keyup.backspace="onDeleteKeyDown"
            >添加用户</a-input
          >
        </a-form-item>
        <a-form-item label="课程封面" :label-col="labelCol" :wrapper-col="wrapperCol">
          <img
            v-if="!form.getFieldValue('courseTitleAddress')"
            src="./picture.png"
            alt=""
            style="height:102px;width:102px;vertical-align:top;"
          />
          <j-image-upload
            v-decorator="['courseTitleAddress']"
            text="上传"
            upload-url="/cCourseInfo/cCourseInfo/upload"
            style="display: inline-block;margin-left: 10px;"
            @change="handleChange"
          />
        </a-form-item>
        <a-form-item label="课程介绍" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea
            v-decorator="['courseDetail', validatorRules.courseDetail]"
            placeholder="请输入课程介绍"
            :auto-size="{ minRows: 5, maxRows: 8 }"
          />
        </a-form-item>
        <a-form-item label="视频倍速播放" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group v-decorator="['isDoubleSpeed']">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-card title="互动设置" :bordered="false">
          <a-form-item label="是否允许点赞" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-switch v-model="isAllowedDz" @change="isAllowedDzChange" />
            <span v-if="model.isAllowedDz === 1 && !isNull(model.dzNum)" style="margin-left: 20px;"
              >点赞总数：{{ model.dzNum }}</span
            >
          </a-form-item>
          <a-form-item label="是否允许评论" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-switch v-model="isAllowedComment" @change="isAllowedCommentChange" />
            <a
              v-if="model.isAllowedComment === 1 && !isNull(model.commentNum)"
              style="margin-left: 20px;"
              @click="$refs.commentDetail.showModal(model.id)"
              >评论总数：{{ model.commentNum }}</a
            >
          </a-form-item>
        </a-card>
      </a-card>
      <div style="margin-top:20px;background-color: #ffffff;padding: 30px;">
        <div v-for="(item, index) in coursewareList" :key="index">
          <a-form-item :label="'第' + item.sort + '节'" :label-col="labelCol" :wrapper-col="{ span: 18 }">
            <div class="item-content">
              <div class="course-file">
                <div class="operation-box">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>删除小节，将同步清空此小节的学员学习时长</span>
                    </template>
                    <a-icon type="delete" class="icon" style="font-size: 24px;" @click="DeleteMeasures(index, item)" />
                  </a-tooltip>
                </div>
                <div class="file">
                  <a-button
                    v-if="item.lessonName"
                    class="change-exercise-refresh"
                    style="margin-right: 10px;margin-left: 0;"
                    @click="$refs.previewCourseware.showModal(item.filePath, item.lessonName)"
                    >预览播放</a-button
                  >
                  <span>{{ item.lessonName }}</span>
                  <a-button class="change-exercise-refresh" @click="$refs.coursewareDetail.edit(item, index)"
                    >更换课件</a-button
                  >
                  <a-upload
                    name="file"
                    :number="1"
                    :multiple="false"
                    :action="importExcel"
                    :headers="tokenHeader"
                    :show-upload-list="false"
                    :data="{ courseCoursewareId: item.courseCoursewareId }"
                    :before-upload="beforeUpload"
                    style="float: right;margin-top: -15px;margin-left: 10px;"
                    @change="handleImportExcel($event, index)"
                  >
                    <a-button
                    >
                      <a-icon type="upload" />课程练习试题导入
                    </a-button>
                  </a-upload>
                  <a-button v-if="!item.exerciseShow" class="add-exercise" @click="addExercise(index)"
                    >添加课程中练习</a-button
                  >
                </div>
                <div>
                  <span v-if="model.isAllowedDz === 1 && !isNull(model.dzNum)">点赞次数：{{ item.dzNum }}</span>
                  <span v-if="!isNull(model.allBroadCast)" style="margin-left: 20px;"
                    >视频点击量：{{ item.broadcastNum }}</span
                  >
                </div>
              </div>
              <div v-if="item.exerciseShow" class="exercises">
                <div class="mark">练习1</div>
                <div class="exercise-info">
                  <div class="operation-box">
                    <a-button
                      v-if="!item.questionList || item.questionList.length == 0"
                      class="add-exercise"
                      @click="continueSelectExercise(index)"
                      >选择试题</a-button
                    >
                    <a-button v-else class="add-exercise" @click="continueSelectExercise(index, item.questionList)"
                      >继续选择试题</a-button
                    >
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>删除</span>
                      </template>
                      <a-icon type="delete" class="icon" style="font-size: 24px;" @click="deleteExercise(index)" />
                    </a-tooltip>
                  </div>
                </div>
                <div class="questions">
                  <div v-for="(val, v) in item.questionList" :key="v" class="exercise">
                    <div>
                      <div class="question">
                        <span>{{ val.sort }}.</span>
                        <span class="htmlStyle" v-html="val.name" />
                      </div>
                      <div
                        v-for="(res, i) in val.itemList"
                        v-if="val.questionType == 3 || val.questionType == 1 || val.questionType == 2"
                        :key="i"
                        class="multiple htmlStyle"
                      >
                        <span>{{ res._option }}、<span v-html="res.item"/></span>
                      </div>
                      <div class="answer">
                        <span>正确答案：</span>
                        <span v-for="(ans, a) in val.itemList" :key="a">
                          <span
                            v-if="val.questionType == 4"
                            style="white-space: break-spaces;margin-right: 10px;"
                            class="htmlStyle"
                            ><span v-html="ans.item + '  '"
                          /></span>
                          <span
                            v-if="val.questionType != 4 && ans.isRight == 1"
                            style="white-space: break-spaces;margin-right: 10px;"
                            class="htmlStyle"
                            >{{ ans._option }}、<span v-html="ans.item" />
                          </span>
                        </span>
                      </div>
                      <div class="analysis">
                        <span>解析说明：</span>
                        <span class="htmlStyle" v-html="val.analysis" />
                      </div>
                    </div>
                    <div class="operation-box">
                      <a-icon type="delete" class="icon" style="font-size: 24px;" @click="deleteTopic(index, v)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-form-item>
        </div>
        <div style="width:100%;display: flex;justify-content: space-around;height: 100px;">
          <div style="position: relative;" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <a-button type="primary" @click="$refs.coursewareDetail.edit({}, null, coursewareList)">选择课件</a-button>
            <!-- <ul v-if="chooseShow" class="el-dropdown-menu">
              <li class="el-dropdown-menu__item" @click="$refs.coursewareDetail.edit()">从课件库选择课件</li>
              <li class="el-dropdown-menu__item" @click="localChoose">本地上传课件</li>
            </ul> -->
            <a-button type="primary" icon="download" style="margin-left: 8px" @click="handleExportXlsx('随堂练习模板')"
              >课程练习模板下载</a-button
            >
          </div>
          <div>
            <!-- <a-button type="primary" style="margin-right: 10px;" @click="handleOk">存草稿</a-button> -->
            <a-button style="background-color: #E6A23C;color: #ffffff;" @click="handleOk">发布</a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="handleCallBack">返回</a-button>
          </div>
        </div>
      </div>
    </a-form>
    <courseware-detail ref="coursewareDetail" @ok="coursewareOk" />
    <local-detail ref="localDetail" @ok="coursewareOk" />
    <exercise-detail ref="exerciseDetail" @ok="exerciseOk" />
    <test-question-detail ref="testQuestionDetail" @ok="testQuestionOk" />
    <comment-detail ref="commentDetail" />
    <preview-courseware ref="previewCourseware" />
    <Select-User-Modal ref="selectUserModal" :depart-list="departList" @selectFinished="userSelectOK" />
  </div>
</template>

<script>
import { httpAction, getAction, downFile } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CoursewareDetail from './modules/CoursewareDetail.vue'
import LocalDetail from './modules/LocalDetail.vue'
import JEditor from '../../../components/jeecg/JEditor.vue'
import ExerciseDetail from './modules/ExerciseDetail.vue'
import TestQuestionDetail from './modules/TestQuestionDetail.vue'
import CommentDetail from './modules/CommentDetail.vue'
import JUpload from '../../../components/jeecg/JUpload.vue'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from '@/store'
import PreviewCourseware from './modules/PreviewCourseware.vue'
import SelectUserModal from './modules/SelectUserModal.vue'
export default {
  name: 'Index',
  components: {
    CoursewareDetail,
    LocalDetail,
    JEditor,
    ExerciseDetail,
    TestQuestionDetail,
    CommentDetail,
    JUpload,
    PreviewCourseware,
    SelectUserModal
  },
  mixins: [JeecgListMixin],
  // 课程分享页面获取的数据
  props: {
    controlType: {
      type: Number,
      required: false
    },
    recordId: {
      type: String,
      required: false
    },
    dataList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      disableMixinCreated: true,
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
      form: this.$form.createForm(this),
      model: {},
      validatorRules: {
        courseName: { rules: [{ required: true, message: '请输入课程名称' }] },
        categoryIdId: { rules: [{ required: true, message: '请选择课程分类' }] },
        courseDetail: { rules: [{ required: true, message: '请输入课程介绍' }] },
        departIds: { rules: [{ required: true, message: '请选择地市参与范围' }] }
      },
      dataSource: [
        {
          prop: ''
        }
      ],
      chooseShow: false,
      coursewareList: [],
      url: {
        add: '/cCourseInfo/cCourseInfo/add',
        edit: '/cCourseInfo/cCourseInfo/edit',
        departList: '/blindExamine/blindExamine/departList',
        importExcel: '/tQuestion/tQuestion/importExcelToCourse',
        exportXlsUrl: '/tQuestion/tQuestion/downloadExcelTemplate'
      },
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      treeData: [],
      selectedKeys: [],
      departList: [], // 地市范围
      isAllowedDz: true, // 是否允许点赞
      isAllowedComment: true, // 是否允许评论
      coursewareChangeList: [],
      userIds: [],
      userIdList: []
    }
  },
  computed: {
    importExcel: function() {
      const url = this.$baseUrl + this.url.importExcel
      return url
    }
  },
  created() {
    const m = this.controlType == 1 ? this.dataList : this.$route.params
    const { recordId } = this.controlType == 1 ? this.recordId : this.$route.query
    this.model = m
    if (!(JSON.stringify(m) === '{}')) {
      this.$nextTick(() => {
        this.form.setFieldsValue(this.pick(m, Object.keys(this.form.getFieldsValue())))
        this.form.setFieldsValue({
          // 根据父级id、子级id给categoryIdId赋值
          categoryIdId: [this.model.categoryRootId, this.model.categoryId]
        })
      })
      // participationMethods==4并且map有用户时指定用户
      if (this.model.participationMethods == 4 && m.map) {
        let idList = []
        let nameList = []
        for (const [key, value] of Object.entries(m.map)) {
          idList.push(key)
          nameList.push(value)
        }
        this.userIds = idList
        this.model.userIds = idList.map(item => item).join(',')
        this.userIdList = nameList
      }

      this.isAllowedDz = this.model.isAllowedDz === 1
      this.isAllowedComment = this.model.isAllowedComment === 1
      if (Array.isArray(m.courseCoursewareList)) {
        m.courseCoursewareList = m.courseCoursewareList.sort((a, b) => a.sort - b.sort)
        this.coursewareList = m.courseCoursewareList.map((item, index) => {
          // item.exerciseShow = true
          item.courseCoursewareId = item.id
          item.type = 2
          if (item.questionList && item.questionList.length > 0) {
            item.exerciseShow = true
            item.questionList = item.questionList.map((res, i) => {
              res.questionId = res.id
              if (res.itemList) {
                res.itemList.forEach((i, _index) => {
                  i._option = this.$utils.getABCD(_index)
                  i.label = i._option + '、' + i.item
                })
              }
              return res
            })
          }
          return item
        })
      } else {
        this.coursewareList = []
      }
    } else if (recordId) {
      getAction('/cCourseInfo/cCourseInfo/queryById', { id: recordId }).then(res => {
        if (res.success) {
          this.model = res.result
          this.$nextTick(() => {
            this.form.setFieldsValue(this.pick(res.result, Object.keys(this.form.getFieldsValue())))
            this.form.setFieldsValue({
              // 根据父级id、子级id给categoryIdId赋值
              categoryIdId: [this.model.categoryRootId, this.model.categoryId]
            })
          })
          // participationMethods==4并且map有用户时指定用户
          if (this.model.participationMethods == 4 && this.model.map) {
            let idList = []
            let nameList = []
            for (const [key, value] of Object.entries(m.map)) {
              idList.push(key)
              nameList.push(value)
            }
            this.userIds = idList
            this.model.userIds = idList.map(item => item).join(',')
            this.userIdList = nameList
          }
          this.isAllowedDz = this.model.isAllowedDz === 1
          this.isAllowedComment = this.model.isAllowedComment === 1
          if (Array.isArray(res.result.courseCoursewareList)) {
            res.result.courseCoursewareList = res.result.courseCoursewareList.sort((a, b) => a.sort - b.sort)
            this.coursewareList = res.result.courseCoursewareList.map((item, index) => {
              // item.exerciseShow = true
              item.courseCoursewareId = item.id
              item.type = 2
              if (item.questionList && item.questionList.length > 0) {
                item.exerciseShow = true
                item.questionList = item.questionList.map((res, i) => {
                  res.questionId = res.id
                  if (res.itemList) {
                    res.itemList.forEach((i, _index) => {
                      i._option = this.$utils.getABCD(_index)
                      i.label = i._option + '、' + i.item
                    })
                  }
                  return res
                })
              }
              return item
            })
          } else {
            this.coursewareList = []
          }
        }
      })
    } else {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          courseStatus: 1,
          // watermark: 1,
          participationMethods: 1,
          isDoubleSpeed: 0
        })
      })
      this.model.isAllowedDz = 1
      this.model.isAllowedComment = 1
    }
    this.getTreeData()
    this.getDepartList()
  },
  methods: {
    // 退格键使用无效
    onDeleteKeyDown(e) {
      this.userIdList = e.currentTarget._value
      this.$forceUpdate()
    },
    // 获取人员
    handleAddUserRole() {
      if (this.model.userIds) {
        // this.$refs.selectUserModal.selectedRowKeys = this.model.userIds
        this.$refs.selectUserModal.showModal(this.userIds, this.userIdList)
      }
      this.$refs.selectUserModal.visible = true
    },
    // 人员返回值
    userSelectOK(data, datList) {
      this.userIds = data
      if (datList) {
        this.model.userIds = data
          .map(item => {
            return item
          })
          .join(',')
        this.userIdList = datList.map(item => {
          return item.realname
        })
        // this.$refs.form.validateField(['userIdList'])
        this.$forceUpdate()
      } else {
        this.model.userIds = ''
        this.userIdList = []
      }
    },
    // 获取课程分类树
    getTreeData() {
      this.loading = true
      getAction('sys/category/rootListNew', { type: 4, pageSize: 500 })
        .then(res => {
          if (res.success) {
            this.treeData = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 选中树节点
    treeSelectchange(value) {
      this.model.categoryId = value[1] // 子级id
      this.model.categoryRootId = value[0] // 父级id
    },
    // 获取参与地市范围数据
    getDepartList() {
      getAction(this.url.departList).then(res => {
        if (res.success) {
          const list = res.result.map(item => {
            return { label: item.departName, value: item.id }
          })
          this.$set(this, 'departList', list)
          getAction(this.url.departList).then(res => {
            if (res.success) {
              const list = res.result.map(item => {
                return { label: item.departName, value: item.id }
              })
              this.$set(this, 'departList', list)
            }
          })
        }
      })
    },
    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        const files = file.name.split('.')
        const num = files.length - 1
        const type = file.name.split('.')[num]
        if (type !== 'xlsx' && type !== 'xls') {
          this.$message.warning('请上传.xlsx格式或.xls格式的文件!')
          return reject(false)
        }
        return resolve(true)
      })
    },
    /* 导入 */
    handleImportExcel(info, index) {
      this.loading = true
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const {
              message,
              result: { msg, fileUrl, fileName }
            } = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span>
                  <br />
                  <span>
                    具体详情请{' '}
                    <a href={href} target="_blank" download={fileName}>
                      点击下载
                    </a>{' '}
                  </span>
                </div>
              )
            })
          } else {
            if (info.file.response.result.success) {
              this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
              // 查询导入进来的试题
              this.loading = true
              if (info.file.response.result.result) {
                this.$set(this.coursewareList[index], 'exerciseShow', true)
                this.testQuestionOk(info.file.response.result.result, index, true)
                this.$refs.testQuestionDetail.getAllData()
              }
            } else {
              this.$message.error(info.file.response.result.message || `${info.file.name} 文件上传失败`)
            }
          }
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        if (info.file.response.status === 500) {
          const data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes('Token失效')) {
            this.$error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上传失败: ${info.file.msg} `)
        }
      }
    },
    // 课程封面上传
    handleChange(value) {
      const courseTitleAddress = value.split(';')[0]
      const courseLittlePicture = value.split(';')[1]
      this.$nextTick(() => {
        this.form.setFieldsValue({
          courseTitleAddress: courseTitleAddress
        })
      })
      this.model.courseLittlePicture = courseLittlePicture
    },
    // 鼠标移入'添加小节'
    mouseenter() {
      this.chooseShow = true
    },
    // 鼠标移出'添加小节'
    mouseleave() {
      this.chooseShow = false
    },
    // 点赞change事件
    isAllowedDzChange(checked) {
      if (checked) {
        this.model.isAllowedDz = 1
        this.isAllowedDz = true
      } else {
        this.model.isAllowedDz = 0
        this.isAllowedDz = false
      }
    },
    // 评论change事件
    isAllowedCommentChange(checked) {
      if (checked) {
        this.model.isAllowedComment = 1
        this.isAllowedComment = true
      } else {
        this.model.isAllowedComment = 0
        this.isAllowedComment = false
      }
    },
    // // 本地上传课件
    // localChoose() {
    //   this.$refs.localDetail.edit()
    // },
    // 从课件库选择课件回显
    coursewareOk(selectedRows, editShow, index) {
      const array = []
      const list = selectedRows.map(item => {
        item.courseCoursewareId = item.id
        return item
      })
      if (editShow) {
        // 更换课件
        const obj = this.coursewareList.find(i => i.coursewareId === list[0].coursewareId)
        if (obj) {
          this.$message.warning('更换课件与已有课件重复，请重新选择')
          return
        }
        if (!this.coursewareList[index].flag) {
          this.$set(this.coursewareList[index], 'flag', 3)
        }
        list[0].flag = this.coursewareList[index].flag
        this.coursewareList[index] = list[0]
        this.coursewareList[index].sort = index + 1
        if (this.coursewareChangeList.length === 0) {
          this.coursewareChangeList.push(this.coursewareList[index])
        } else {
          const obj = this.coursewareChangeList.find(i => i.id === this.coursewareList[index].id)
          if (obj) {
            const n = this.coursewareChangeList.findIndex(i => i.id === this.coursewareList[index].id)
            this.coursewareChangeList[n] = this.coursewareList[index]
          } else {
            this.coursewareChangeList.push(this.coursewareList[index])
          }
        }
      } else {
        // 选择课件
        list.forEach(item => {
          const obj = this.coursewareList.find(i => i.coursewareId === item.coursewareId)
          if (obj) {
            array.push(obj)
          } else {
            item.flag = 2
            item.courseCoursewareId = this.$utils.guid().replace(/-/g, '')
            item.id = item.courseCoursewareId
            array.push(item)
          }
        })
        this.coursewareList = [...array]
        this.coursewareList = this.coursewareList.map((val, v) => {
          val.sort = v + 1
          return val
        })
        if (this.coursewareChangeList.length === 0) {
          this.coursewareChangeList = this.coursewareList.map(res => {
            if (!res.flag) {
              res.flag = 3
            }
            return res
          })
        } else {
          this.coursewareList.forEach(item => {
            const obj = this.coursewareChangeList.find(i => i.coursewareId === item.coursewareId)
            if (!obj) {
              if (!item.flag) {
                item.flag = 3
              }
              this.coursewareChangeList.push(item)
            }
          })
        }
      }
      this.$forceUpdate()
    },
    // 删除小节
    DeleteMeasures(index, item) {
      const that = this
      this.$confirm({
        title: '确认删除课件？',
        content: '删除课件将取消此课件下添加的练习，是否继续？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.coursewareList.splice(index, 1)
          that.coursewareList = that.coursewareList.map((item, i) => {
            item.sort = i + 1
            item.flag = 3
            return item
          }) // 删除小节后，重置小节顺序
          if (that.coursewareChangeList.length === 0) {
            that.coursewareChangeList = that.coursewareList.map(res => {
              if (!res.flag) {
                res.flag = 0
              }
              return res
            })
            item.flag = 1
            that.coursewareChangeList.push(item)
          } else {
            const obj = that.coursewareChangeList.find(i => i.id === item.id)
            if (obj) {
              const n = that.coursewareChangeList.findIndex(i => i.id === item.id)
              that.coursewareChangeList[n].flag = 1
            } else {
              item.flag = 1
              that.coursewareChangeList.push(item)
            }
          }
        }
      })
    },
    // 添加课程中练习
    addExercise(index) {
      // this.$refs.exerciseDetail.edit(index)
      this.$set(this.coursewareList[index], 'exerciseShow', true)
      this.$refs.testQuestionDetail.edit(index)
    },
    // 添加课程中练习-下一步
    exerciseOk(data, index) {
      if (data === true) {
        this.$set(this.coursewareList[index], 'exerciseShow', true)
        this.$refs.testQuestionDetail.edit(index)
      }
    },
    // 添加课程中练习回显
    testQuestionOk(selectRows, index, value) {
      if (!this.coursewareList[index].flag) {
        this.$set(this.coursewareList[index], 'flag', 3)
      }
      // 判断是导入还是选择，先选择后导入的list合并，其他情况直接赋值
      if (value) {
        if (!this.coursewareList[index].questionList || this.coursewareList[index].questionList.length === 0) {
          this.$set(this.coursewareList[index], 'questionList', selectRows)
        } else {
          this.coursewareList[index].questionList = this.coursewareList[index].questionList.concat(selectRows)
        }
      } else {
        this.$set(this.coursewareList[index], 'questionList', selectRows)
      }
      this.coursewareList[index].questionList.forEach((item, index) => {
        item.sort = index + 1
        if (item.itemList) {
          item.itemList.forEach((i, _index) => {
            i._option = this.$utils.getABCD(_index)
            i.label = i._option + '、' + i.item
          })
        }
      })
      if (this.coursewareChangeList.length === 0) {
        this.coursewareChangeList.push(this.coursewareList[index])
      } else {
        const obj = this.coursewareChangeList.find(i => i.id === this.coursewareList[index].id)
        if (obj) {
          const n = this.coursewareChangeList.findIndex(i => i.id === this.coursewareList[index].id)
          this.$set(this.coursewareChangeList[n], 'questionList', this.coursewareList[index].questionList)
          if (!this.coursewareChangeList[n].flag) {
            this.$set(this.coursewareChangeList[n], 'flag', 3)
          }
        } else {
          this.coursewareChangeList.push(this.coursewareList[index])
        }
      }
      this.$forceUpdate()
    },
    // 删除练习
    deleteExercise(index) {
      const that = this
      this.$confirm({
        title: '确认删除练习？',
        content: '删除练习将不可恢复，是否继续？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$set(that.coursewareList[index], 'exerciseShow', false)
          that.$set(that.coursewareList[index], 'questionList', [])
          if (!that.coursewareList[index].flag) {
            that.$set(that.coursewareList[index], 'flag', 3)
          }
          if (that.coursewareChangeList.length === 0) {
            that.coursewareChangeList.push(that.coursewareList[index])
          } else {
            const obj = that.coursewareChangeList.find(i => i.id === that.coursewareList[index].id)
            if (obj) {
              const n = that.coursewareChangeList.findIndex(i => i.id === that.coursewareList[index].id)
              that.$set(that.coursewareChangeList[n], 'questionList', [])
              if (!that.coursewareChangeList[n].flag) {
                that.$set(that.coursewareChangeList[n], 'flag', 3)
              }
            } else {
              that.coursewareChangeList.push(that.coursewareList[index])
            }
          }
        }
      })
    },
    // 继续选择试题
    continueSelectExercise(index, questionList) {
      this.$refs.testQuestionDetail.edit(index, questionList)
    },
    // 删除试题
    deleteTopic(index, v) {
      if (!this.coursewareList[index].flag) {
        this.$set(this.coursewareList[index], 'flag', 3)
      }
      this.coursewareList[index].questionList.splice(v, 1)
      this.coursewareList[index].questionList = this.coursewareList[index].questionList.map((item, i) => {
        item.sort = i + 1
        return item
      }) // 删除试题后，重置试题顺序
      if (this.coursewareChangeList.length === 0) {
        this.coursewareChangeList.push(this.coursewareList[index])
      } else {
        const obj = this.coursewareChangeList.find(i => i.id === this.coursewareList[index].id)
        if (obj) {
          const n = this.coursewareChangeList.findIndex(i => i.id === this.coursewareList[index].id)
          this.$set(this.coursewareChangeList[n], 'questionList', this.coursewareList[index].questionList)
          if (!this.coursewareChangeList[n].flag) {
            this.$set(this.coursewareChangeList[n], 'flag', 3)
          }
        } else {
          this.coursewareChangeList.push(this.coursewareList[index])
        }
      }
    },
    handleOk() {
      // if (
      //   this.$store.getters.userInfo.roles.indexOf('admin') == -1 &&
      //   this.$store.getters.userInfo.roles.indexOf('stadmin') == -1 &&
      //   this.$store.getters.userInfo.roles.indexOf('dsgly') > -1
      // ) {
      //   this.model.participationMethods = 5
      // }
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign(this.model, values)
          if (this.coursewareList.length === 0) {
            this.$message.warning('请先选择课件')
            return
          }
          this.confirmLoading = true
          let url = ''
          let method = ''
          if (!this.model.id) {
            url = this.url.add
            method = 'post'
            formData.coursewareList = this.coursewareList
          } else {
            url = this.url.edit
            method = 'put'
            formData.coursewareList = this.coursewareChangeList.map(item => {
              item.courseId = this.model.id // 课程id
              return item
            })
          }
          httpAction(url, formData, method)
            .then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.visible = false
                if (this.controlType) {
                  this.$emit('handleOk')
                } else {
                  this.$nextTick(() => {
                    this.$router.push({
                      name: 'kcgl-kclb'
                    })
                  })
                }
              } else {
                this.$message.warning(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    // 返回
    handleCallBack() {
      if (this.controlType) {
        this.$emit('close')
      } else {
        this.$router.push({
          path: '/kcgl/kclb'
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.sub-item-container {
  font-size: 14px;
  color: #666;
  line-height: 17px;
  background: #f7f8fa;
  padding: 15px 10px;
  border-radius: 4px;
  .sub-item {
    margin-bottom: 10px;
  }
}
.learningProcessMonitor {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 20px;
  line-height: 28px;
  max-width: 610px;
  .line {
    width: 100%;
    height: 1px;
    background: #dcdfe6;
    margin: 10px 0 !important;
  }
}
.evaluate-content {
  width: 610px;
  background: #f7f8fa;
  border-radius: 4px;
  padding: 20px;
  .title {
    color: #b4b6bd;
    margin-left: 5px;
    font-size: 16px;
  }
  .dimensionContent {
    border: 1px solid #dcdfe6;
    padding: 10px;
    margin-top: 10px;
    .dimensionDiv {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .dimensionInput {
        width: 200px;
        margin-right: 5px;
      }
    }
    .dimensionAdd {
      cursor: pointer;
      background: none;
      border: none;
      &.add {
        color: #1a8cfe;
      }
      &.addDis {
        color: #6d717c;
      }
    }
  }
}

.el-dropdown-menu {
  width: 155px;
  position: absolute;
  top: 30px;
  left: 0;
  padding: 10px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 #cccdd3;
  li {
    list-style: none;
  }
  .el-dropdown-menu__item {
    list-style: none;
    line-height: 36px;
    padding: 0 20px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    outline: 0;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: rgb(232, 244, 255);
    color: rgb(72, 164, 255);
  }
}
.item-content {
  padding: 20px 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  position: relative;
  min-width: 80%;

  .course-file {
    margin-bottom: 20px;
    .file-info {
      max-width: calc(100% - 130px);
      display: flex;
      .file-name {
        margin-right: 20px;
      }
    }
    .operation-box {
      position: absolute;
      right: 14px;
      top: 31px;
      font-size: 0;
      .icon {
        margin-left: 20px;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .file {
      margin-top: 20px;
      font-size: 14px;
      color: #6d717c;
      margin-right: 30px;
      .change-exercise-refresh {
        margin-left: 20px;
        border: none;
        padding: 0 !important;
        width: 72px;
        height: 28px;
        line-height: 28px;
        background: #e8f3ff;
        font-size: 14px;
        font-weight: 400;
        color: #1a8cfe;
      }
      .add-exercise {
        margin-top: -10px;
        float: right;
        border: 1px solid #1a8cfe;
        color: #1a8cfe;
      }
    }
  }
  .exercises {
    background: #f7f8fa;
    border-radius: 4px;
    padding: 20px 20px 0 70px;
    margin-bottom: 20px;
    position: relative;
    .mark {
      width: 60px;
      height: 40px;
      line-height: 40px;
      padding-left: 13px;
      background: #dcdfe6;
      font-size: 14px;
      color: #3a3e51;
      position: absolute;
      left: 0;
      top: 20px;
      border-radius: 0 40px 40px 0;
    }
    .exercise-info {
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      .operation-box {
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        .add-exercise {
          border: 1px solid #1a8cfe;
          color: #1a8cfe;
          margin-right: 10px;
        }
      }
    }
    .questions {
      .exercise {
        line-height: 21px;
        padding: 20px 0;
        border-top: 1px solid #dcdfe6;
        display: flex;
        justify-content: space-between;
        .question {
          font-size: 14px;
          color: #3a3e51;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .multiple {
          margin-bottom: 15px;
          color: #1a8cfe;
        }
        .answer {
          margin-bottom: 10px;
        }
      }
    }
  }
}
.htmlStyle {
  white-space: break-spaces;
  /deep/ p {
    display: inline;
  }
  /deep/ p > img {
    width: 15%;
  }
}
/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
