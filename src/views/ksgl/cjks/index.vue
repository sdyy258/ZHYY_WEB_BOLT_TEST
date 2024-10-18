<template>
  <div>
    <div class="card-module">
      <div class="form-class">
        <a-form-model ref="form" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="考试名称" prop="name">
            <a-input v-model="model.name" placeholder="请输入考试名称" :max-length="30" />
          </a-form-model-item>
          <a-form-model-item label="考试分类" prop="categoryId">
            <a-tree-select
              v-model="model.categoryId"
              :tree-data="questionList"
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-node-filter-prop="title"
              style="width: 75%; margin-right: 10px"
            />
            <a-button type="primary" @click="mainTenance">维护分类</a-button>
          </a-form-model-item>
          <a-form-model-item label="身份认证" prop="identityCheck">
            <!-- <a-checkbox-group v-model="model.identityCheck" :options="options" @change="checkChange" /> -->
            <a-radio-group v-model="model.identityCheck">
              <a-radio :value="0"> 账号登录 </a-radio>
              <a-radio :value="2"> 手机短信验证 </a-radio>
              <a-radio :value="3">身份证号验证</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="考试时间" prop="limitTime">
            <a-range-picker
              v-model="model.limitTime"
              :disabled-date="disLimitDate"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment(), moment('23:59:59', 'HH:mm:ss')],
              }"
              value-format="YYYY-MM-DD HH:mm:ss"
              :allow-clear="false"
              @change="pickChange"
            />
          </a-form-model-item>
          <a-form-model-item label="指定时间段" prop="isTimeSlot">
            <a-radio-group v-model="model.isTimeSlot" @change="isTimeSlotChange">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="model.isTimeSlot == 1" label="考试固定时段" prop="slotStartTime">
            <a-time-picker
              v-model="model.slotStartTime"
              value-format="HH:mm:ss"
              placeholder="选择开始时间"
              @change="slotTimeChange"
            />
            <span>~</span>
            <a-time-picker
              v-model="model.slotEndTime"
              value-format="HH:mm:ss"
              placeholder="选择结束时间"
              @change="slotTimeChange"
            />
          </a-form-model-item>
          <a-form-model-item label="答卷时长" prop="isTimeLimit">
            <a-radio-group v-model="model.isTimeLimit">
              <a-radio :value="1">
                <span v-if="model.isTimeLimit == 1"> <a-input-number v-model="model.examTime" :min="1" />分钟 </span>
                <span v-else>限制时长</span>
              </a-radio>
              <!-- <a-radio :value="0">不限时长</a-radio> -->
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="答题次数" prop="isNumLimit">
            <a-radio-group v-model="model.isNumLimit">
              <a-radio :value="0">不限次数</a-radio>
              <a-radio :value="1">
                <span v-if="model.isNumLimit == 1"> <a-input-number v-model="model.numLimit" :min="1" />次 </span>
                <!-- <span>1次</span> -->
              </a-radio>
              <!-- <a-radio :value="2">每天考一次</a-radio> -->
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="是否在APP考试" prop="isShowOnApp">
            <a-radio-group v-model="model.isShowOnApp">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
              <!-- <a-radio :value="2">每天考一次</a-radio> -->
            </a-radio-group>
          </a-form-model-item>
          <!-- <a-form-item label="关联项">
			<a-switch v-model="validatorRules.prop8" />
			</a-form-item>-->
          <a-form-model-item label="及格分数" prop="passScore">
            <a-input-number v-model="model.passScore" :min="1" @change="scoreChange" />
          </a-form-model-item>
          <a-form-model-item label="成绩设置" prop="scoreSet" @change="scoreSetChange">
            <a-radio-group v-model="model.scoreSet" :default-value="1" @change="achievementChange">
              <a-radio :value="1">答题后显示成绩</a-radio>
              <a-radio :value="2">定时显示成绩</a-radio>
              <a-radio :value="3">答题后不显示成绩</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="model.scoreSet == 2" label="成绩公布时间" prop="scoreShowTime">
            <a-date-picker
              v-model="model.scoreShowTime"
              show-time
              :disabled-date="disScoreDate"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择时间"
              @change="onChange"
            />
          </a-form-model-item>
          <!-- <a-form-model-item label="参与学员" prop="prop10">
			  <a-radio-group v-model="model.prop10">
				<a-radio :value="0">组织内全部学员</a-radio>
				<a-radio :value="1">仅部分学员</a-radio>
			  </a-radio-group>
			</a-form-model-item> -->
          <a-form-model-item label="参与方式" prop="examWay">
            <a-radio-group v-model="model.examWay" @change="examWayChange">
              <a-radio :value="0">指定地市</a-radio>
              <a-radio :value="1">指定人员</a-radio>
              <a-radio :value="2">学员自主报名</a-radio>
              <!-- <a-radio v-if="role.indexOf('admin') > -1" :value="3">省站用户</a-radio> -->
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="model.examWay == 0" label="参与地市范围" prop="departIds">
            <a-tree-select
              v-model="departIds"
              placeholder="请选择参与地市范围"
              :tree-data="departList"
              multiple
              allow-clear
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              @change="departChange"
            />
            <!-- <j-multi-select-tag v-model="model.departIds" trigger-change :options="departList" placeholder="请选择参与地市范围" /> -->
          </a-form-model-item>
          <a-form-model-item v-if="model.examWay == 1" label="用户选择" prop="userIdList">
            <a-input v-model="model.userIdList" @click="handleAddUserRole" @keyup.backspace="onDeleteKeyDown"
              >添加用户</a-input
            >
          </a-form-model-item>
          <a-form-model-item v-if="model.examWay == 2" label="报名范围" prop="enrollLevel">
            <a-checkbox-group v-model="enrollLevel" @change="enrollLevelChange">
              <!-- <a-checkbox v-if="role.indexOf('admin') > -1" value="1">省站用户</a-checkbox> -->
              <a-checkbox value="2"> 市站用户</a-checkbox>
              <a-checkbox value="3">县级用户</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item v-if="model.examWay == 2" label="报名时间" prop="enrollTimelist">
            <a-range-picker
              v-model="model.enrollTimelist"
              :disabled-date="disabledDate"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment(), moment('23:59:59', 'HH:mm:ss')],
              }"
              value-format="YYYY-MM-DD HH:mm:ss"
              :allow-clear="false"
              @change="pickEnroll"
            />
          </a-form-model-item>
          <!-- <a-form-model-item label="是否有考试证书" prop="isCertificate">
			  <a-radio-group v-model="model.isCertificate">
				<a-radio :value="1">是</a-radio>
				<a-radio :value="0">否</a-radio>
			  </a-radio-group>
			</a-form-model-item> -->
          <a-form-model-item label="是否开启防作弊" prop="isPreventingCheating">
            <a-radio-group v-model="model.isPreventingCheating">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div v-if="model.isPreventingCheating == 1" class="hide-box">
            <!-- <a-form-model-item label="是否限制复制粘贴">
				<a-radio-group v-model="model.isCopyPaste">
				  <a-radio :value="1">限制</a-radio>
				  <a-radio :value="0">不限制</a-radio>
				</a-radio-group>
			  </a-form-model-item> -->
            <a-form-model-item label="是否开启全屏考试" prop="isFullScreen">
              <a-radio-group v-model="model.isFullScreen">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <!-- <a-form-model-item label="是否限制切屏次数" >
				<a-radio-group v-model="model.isScreenCutting">
				  <a-radio :value="1">
					<span v-if="model.isScreenCutting ==1">
					  限制切屏
					  <a-input-number v-model="model.screenCuttingNum" :min="1" />次
					</span>
					<span v-else>是</span>
				  </a-radio>
				  <a-radio :value="0">否</a-radio>
				</a-radio-group>
			  </a-form-model-item> -->
            <a-form-model-item label="是否需要考前拍照" prop="isBeforePic">
              <a-radio-group v-model="model.isBeforePic">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="是否开启摄像头抓拍" prop="isCameraCapture">
              <a-radio-group v-model="model.isCameraCapture">
                <a-radio :value="1">
                  <span v-if="model.isCameraCapture == 1">
                    抓拍在考试开始
                    <a-input-number
                      v-model="model.cameraCaptureStart"
                      :min="1"
                      @change="numberChange($event, 'cameraCaptureStart')"
                    />分钟后进行
                  </span>
                  <span v-else>是</span>
                </a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-if="model.isCameraCapture == 1" label="摄像头抓拍时机" prop="cameraCaptureTime	">
              <a-radio-group v-model="model.cameraCaptureTime">
                <a-radio :value="1">
                  <span v-if="model.cameraCaptureTime == 1">
                    开始答题后，平均
                    <a-input-number
                      v-model="model.cameraCaptureNum"
                      :min="1"
                      @change="numberChange($event, 'cameraCaptureNum')"
                    />
                    分钟抓拍一次
                  </span>
                  <span v-else>指定间间隔</span>
                </a-radio>
                <a-radio :value="0">随机</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
          <a-form-model-item label="考试封面" prop="pictureUrl">
            <!-- <img v-if="!model.pictureUrl" src="/minio/oems/temp/考试默认图(1)_1686018124451.png" alt="" style="height:102px;width:102px;vertical-align:top;"> -->
            <j-image-upload
              v-model="model.pictureUrl"
              text="上传"
              style="display: inline-block; margin-left: 10px"
              @change="handleChange"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="show-class">
        <div class="questions-module show-module" style="margin-bottom: 30px; height: 370px">
          <div class="show-title top-title">
            <div style="flex: 1">
              已选试卷：<span style="color: darkgreen">{{ selectList.name }}</span>
            </div>
            <div v-if="!model.detailShow" class="a-class">
              <!-- <a style="padding-right: 10px;">预览试卷</a> -->
              <a style="padding-right: 10px" @click="$refs.replacePaper.showModal()">选择试卷</a>
              <a-button
                v-if="saveShow"
                type="primary"
                style="padding-left: 13px"
                :disabled="disabled"
                @click="releaseExamination()"
                >保存考试</a-button
              >
              <a-button
                v-else
                type="primary"
                style="padding-left: 13px"
                :disabled="disabled"
                @click="releaseExamination()"
                >发布考试</a-button
              >
              <a-button type="primary" style="margin-left: 13px" @click="backReturn">返回</a-button>
            </div>
            <div v-else class="a-class">
              <a-button type="primary" style="margin-left: 13px" @click="backReturn">返回</a-button>
            </div>
          </div>
          <div class="content-class">
            <div class="content-item">
              <span class="text-color">总分:</span>
              {{ selectList.score }}
            </div>
            <div class="content-item">
              <span class="text-color">创建人:</span>
              {{ selectList.createBy_dictText }}
            </div>
            <div class="content-item">
              <span class="text-color">试题数量:</span>
              {{ `${selectList.smallQuestionCount || '0'} ` }}
            </div>
            <div class="content-item">
              <span class="text-color">创建日期:</span>
              {{ selectList.createTime }}
            </div>
          </div>
        </div>
        <div class="examination-module show-module" style="height: 250px">
          <div class="top-title">考试须知</div>
          <div class="content-class">
            <a-textarea
              v-model="model.examExplain"
              placeholder="请输入考试须知"
              style="border: 0"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            />
          </div>
        </div>
      </div>
    </div>
    <cread-link ref="creadLink" />
    <Select-User-Modal ref="selectUserModal" :depart-list="departList" @selectFinished="userSelectOK" />
    <replace-paper ref="replacePaper" @ok="replaceBack" />
    <main-tenance ref="mainTenance" @ok="getClassification()" />
  </div>
</template>
<script>
import Vue from 'vue'
import CreadLink from '../ksgl/modules/CreadLink'
import { getAction, postAction } from '@/api/manage'
import SelectUserModal from './model/SelectUserModal'
import ReplacePaper from './model/ReplacePaper'
import moment from 'moment'
import { multiplication } from '@/utils/count'
import MainTenance from '@/views/ksgl/kscj/components/MainTenance'
export default {
  components: { CreadLink, SelectUserModal, ReplacePaper, MainTenance },
  data() {
    return {
      moment,
      selectList: {},
      disabled: false, // 发布考试是否可以回显
      saveShow: false, // 是保存还是发布
      model: {
        identityCheck: 0,
        isTimeLimit: 1,
        isTimeSlot: 0,
        isNumLimit: 1,
        isShowOnApp: 0,
        numLimit: '1',
        examTime: '90',
        passScore: '60',
        scoreSet: 1,
        // prop10: 0,
        examWay: 0,
        isCertificate: 0, // 是否有考试证书
        isPreventingCheating: 0,
        enrollLevel: '', // 报名范围
        userIdList: [], // 用户姓名
        pictureUrl: '/minio/oems/temp/考试默认图(1)_1686018050614.png',
        departIds: '',
        cameraCaptureTime: 0,
        cameraCaptureStart: 1,
        cameraCaptureNum: 1,
        examExplain:
          '1.每人只有一次考试机会，未在规定时间内参加考试的，其成绩按零分计。\n2.考试期间严格遵守考试纪律，独立完成答题，不得违规作弊，被发现违规作弊的，其成绩按零分计。',
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      orgLevel: '', // 省级用户
      departIds: [],
      role: '',
      rules: {
        name: { required: true, message: '请输入考试名称', trigger: 'blur' },
        categoryId: { required: true, message: '请选择', trigger: 'change' },
        identityCheck: { required: true, message: '请选择', trigger: 'blur' },
        limitTime: { required: true, message: '请选择考试时间', trigger: 'change' },
        isTimeSlot: { required: true, message: '是否指定每天的考试时间段', trigger: 'blur' },
        slotStartTime: { required: true, message: '请选择指定时间段', trigger: 'change' },
        isTimeLimit: { required: true, message: '请选择答卷时长', trigger: 'blur' },
        examTime: { required: true, message: '请选择答卷时长', trigger: 'blur' },
        isNumLimit: { required: true, message: '请选择答题次数', trigger: 'blur' },
        isShowOnApp: { required: true, message: '请选择可否在APP考试', trigger: 'blur' },
        passScore: { required: true, message: '请输入整数', trigger: 'blur' },
        scoreSet: { required: true, message: '请选择成绩设置', trigger: 'blur' },
        scoreShowTime: { required: true, message: '请选择成绩公布时间', trigger: 'change' },
        examWay: { required: true, message: '请选择参与方式', trigger: 'blur' },
        departIds: { required: true, message: '请选择地市', trigger: 'change' },
        userIdList: { type: 'array', required: true, message: '请选择用户', trigger: 'change' },
        isCertificate: { required: true, message: '是否有考试证书', trigger: 'blur' },
        isPreventingCheating: { required: true, message: '是否开启防作弊', trigger: 'blur' },
        pictureUrl: { required: true, message: '请上传考试封面', trigger: 'blur' },
        enrollLevel: { required: true, message: '请选择报名范围', trigger: 'blur' },
        enrollTimelist: { required: true, message: '请选择报名时间', trigger: 'change' },
      },
      questionList: [], // 考试分类树
      // enrollStartTime: [],
      // userIdList: [],
      departList: [], // 地市范围
      enrollLevel: [],
      url: {
        departList: '/sys/sysDepart/queryExamDepartTree',
      },
    }
  },
  created() {
    this.$nextTick(() => {
      this.getQuestion()
      this.getDepartList()
    })
    // const szUser = Vue.ls.get('DEPART')[0].orgLevel
    // this.orgLevel = szUser
    this.role = this.$store.getters.userInfo.roles
    const middleData = this.$route.query
    if (middleData.id) {
      // 编辑进入
      this.saveShow = true
      getAction('/tExam/tExam/queryById', { id: middleData.id }).then((res) => {
        if (res.success) {
          debugger
          this.model = { ...res.result }
          this.selectList = this.model.paper
          this.selectList.createBy_dictText = this.model.paper.createUsername
          this.model.limitTime = []
          this.model.limitTime.push(this.model.limitStartTime)
          this.model.limitTime.push(this.model.limitEndTime)
          this.model.enrollTimelist = []
          this.model.enrollTimelist.push(this.model.enrollStartTime)
          this.model.enrollTimelist.push(this.model.enrollEndTime)
          this.model.userIdList = []
          if (this.model.examWay == 0) {
            // 地市用户显示
            if (this.model.departIds) {
              this.departIds = this.model.departIds.split(',')
            }
          } else if (this.model.examWay == 1) {
            if (this.model.userList.length > 0) {
              // 用户id
              this.model.userIds = this.model.userList.map((item) => {
                return item.id
              })
              // 用户名字
              this.model.userIdList = this.model.userList.map((item) => {
                return item.realname
              })
            }
          } else if (this.model.examWay == 2) {
            const enrollLevel = this.model.enrollLevel.split(',')
            this.$set(this, 'enrollLevel', enrollLevel)
          }
        }
      })
    } else {
      this.$set(this.model, 'name', this.selectList.name)
      if (this.selectList.score) {
        const num1 = multiplication(this.selectList.score, 0.6)
        this.model.passScore = Math.round(num1)
      }
    }
  },
  methods: {
    showModal(data) {},
    // 考试固定时段必选
    isTimeSlotChange(e) {
      this.rules.slotStartTime =
        e.target.value === 1 ? { required: true, message: '请选择指定时间段', trigger: 'change' } : {}
    },
    // 成绩公布时间必选
    scoreSetChange(e) {
      this.rules.scoreShowTime =
        e.target.value === 2 ? { required: true, message: '请选择成绩公布时间', trigger: 'change' } : {}
    },
    // 参与方式必选
    examWayChange(e) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate(['departIds', 'enrollTimelist', 'userIdList', 'enrollLevel'])
      })
      if (e.target.value === 0 || e.target.value === 1 || e.target.value === 3) {
        this.model.enrollTimelist = []
        this.model.enrollStartTime = ''
        this.model.enrollEndTime = ''
        this.enrollLevel = []
        this.model.enrollLevel = ''
      }
      this.$forceUpdate()
    },
    // 报名范围选择赋值
    enrollLevelChange(e) {
      const enrollLevel = e
        .map((item) => {
          return item
        })
        .join(',')
      this.$set(this.model, 'enrollLevel', enrollLevel)
      this.$forceUpdate()
      if (this.model.enrollLevel) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate(['enrollLevel'])
        })
      }
    },
    // 及格分数取整
    scoreChange(e) {
      const num1 = Math.round(e)
      this.$set(this.model, 'passScore', num1)
    },
    // 时间段限制
    slotTimeChange(e) {
      if (this.model.slotEndTime <= this.model.slotStartTime) {
        this.$message.warning('晚于开始时段')
        this.model.slotEndTime = ''
        this.$forceUpdate()
      }
      console.log() // true
      // slotStartTime slotEndTime
    },
    // 考试时间小于报名时间
    disLimitDate(current) {
      if (this.model.enrollEndTime) {
        return current < new Date(this.model.enrollEndTime)
      } else {
        return current < moment().startOf('day')
      }
    },
    // 成绩时间小于考试结束时间
    disScoreDate(current) {
      if (this.model.limitEndTime) {
        return current < moment(this.model.limitEndTime).subtract(1, 'minutes')
      } else {
        return current < moment().startOf('day')
      }
    },
    // 成绩公布时间
    onChange(e) {
      this.model.scoreShowTime = e
      const min = moment().format('YYYY-MM-DD HH:mm:ss')
      const date = this.model.limitEndTime || min
      if (e < date) {
        this.$nextTick(() => {
          this.$set(this.model, 'scoreShowTime', date)
          this.$forceUpdate()
        })
      }
    },
    // 报名时间大于考试时间
    disabledDate(current) {
      // 报名结束时间要早于考试开始时间
      // 报名开始时间要晚于此刻
      if (current && current < moment().startOf('day')) {
        return true
      } else if (current && current > moment(this.model.limitEndTime).subtract(-1, 'minutes')) {
        return true
      } else {
        return false
      }
    },
    // 考试时间取值
    pickChange(e) {
      this.model.limitStartTime = e[0]
      this.model.limitEndTime = e[1]
      if (new Date(this.model.scoreShowTime) < new Date(this.model.limitEndTime)) {
        this.model.scoreShowTime = ''
      }
      const min = moment().format('YYYY-MM-DD HH:mm:ss')
      if (e[0] < min) {
        this.$nextTick(() => {
          this.model.limitTime[0] = min
          this.$set(this.model, 'limitStartTime', min)
          this.$forceUpdate()
        })
      }
      this.$forceUpdate()
    },
    // 报名时间
    pickEnroll(e) {
      this.$set(this.model, 'enrollStartTime', e[0])
      this.$set(this.model, 'enrollEndTime', e[1])
      this.$forceUpdate()
      const min = moment().format('YYYY-MM-DD HH:mm:ss')
      if (e[0] < min) {
        this.$nextTick(() => {
          this.model.enrollTimelist[0] = min
          this.$set(this.model, 'enrollStartTime', min)
          this.$forceUpdate()
        })
      }
      if (e[1] > this.model.limitEndTime) {
        this.$nextTick(() => {
          this.model.enrollTimelist[1] = this.model.limitEndTime
          this.$set(this.model, 'enrollEndTime', this.model.limitEndTime)
          this.$forceUpdate()
        })
      }
      if (e.length > 0) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate(['enrollTimelist'])
        })
        this.$forceUpdate()
      }
    },
    // 退格键使用无效
    onDeleteKeyDown(e) {
      this.model.userIdList = e.currentTarget._value
      this.$forceUpdate()
    },
    // 获取人员
    handleAddUserRole() {
      if (this.model.userIds) {
        // this.$refs.selectUserModal.selectedRowKeys = this.model.userIds
        this.$refs.selectUserModal.showModal(this.model.userIds, this.model.userIdList)
      }
      this.$refs.selectUserModal.visible = true
    },
    // 人员返回值
    userSelectOK(data, datList) {
      this.model.userIds = data
      if (datList) {
        this.model.userIdList = datList.map((item) => {
          return item.realname
        })
        this.$refs.form.validateField(['userIdList'])
        this.$forceUpdate()
      } else {
        this.model.userIdList = []
      }
      this.$forceUpdate()
    },
    // 获取参与地市范围数据
    getDepartList() {
      getAction(this.url.departList).then((res) => {
        if (res.success) {
          const list = res.result.map((item) => {
            // item.isLeaf = false
            return item
          })
          this.$set(this, 'departList', list)
        }
      })
    },
    // 地市用户id
    departChange(value) {
      this.model.departIds = value
        .map((item) => {
          return item
        })
        .join(',')
    },
    // 抓拍时间最小值
    numberChange(e, val) {
      if (e) {
        this.model[val] = e
      } else {
        this.model[val] = 1
      }
    },
    // 选择试卷返回值
    replaceBack(val) {
      this.selectList = []
      this.selectList = val
      // 编辑时之前的试卷id去掉
      this.model.paperId = val.id
      this.$set(this.model, 'name', val.name)
      // 计算及格分数
      if (this.selectList.score) {
        const num1 = multiplication(this.selectList.score, 0.6)
        this.model.passScore = Math.round(num1)
      }
    },
    // 考试封面上传
    handleChange(value) {
      const courseTitleAddress = value.split(';')[0]
      this.$set(this.model, 'pictureUrl', courseTitleAddress)
    },
    // 发布考试
    releaseExamination() {
      const selectList = this.selectList
      if (!selectList.id) {
        this.$message.warning('请选择试卷')
        return false
      }
      if (
        Number(this.model.passScore) > Number(this.selectList.score) ||
        this.model.passScore == this.selectList.score
      ) {
        this.$message.warning('及格分数不能大于试卷总分')
        return false
      }
      // if (!this.model.pictureUrl) {
      //   this.model.pictureUrl = '/minio/oems/temp/考试默认图(1)_1686018124451.png'
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.model,
          }
          params.totalScore = selectList.score
          params.paperId = this.model.paperId || selectList.id
          // this.$refs.creadLink.showModal(params, true)
          let url = ''
          if (!this.model.id) {
            url = '/tExam/tExam/add'
          } else {
            url = '/tExam/tExam/edit'
          }
          // this.model.limitTime = ''
          postAction(url, params).then((res) => {
            if (res.success) {
              // this.visible = false
              this.$message.success(res.message || '成功')
              if (this.model.id) {
                this.saveShow = false
                this.$router.push({
                  name: 'ksgl-ksgl',
                  query: { queryType: true },
                })
              } else {
                this.disabled = true
                this.$refs.creadLink.showModal(res.result, true)
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 获取考试树
    getQuestion() {
      getAction('sys/category/rootListNew', { type: 3, pageSize: 500 })
        .then((res) => {
          if (res.success) {
            const result = res.result
            this.questionList = result
            console.log('questionList', this.questionList)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 维护考试分类
    mainTenance() {
      this.$refs.mainTenance.title = '考试分类维护'
      this.$refs.mainTenance.showModal('3')
    },
    // 分类回显刷新
    getClassification() {
      this.getQuestion()
    },
    checkChange(e) {
      this.model.identityCheck = e
        .map((item) => {
          return item
        })
        .join(',')
    },
    // 成绩设置
    achievementChange(e) {
      this.$forceUpdate()
    },
    // 返回
    backReturn() {
      // if (this.model.id) {
      this.$router.push('/ksgl/ksgl')
      // } else {
      //   this.$parent.stepClick(this.selectList)
      // }
    },
  },
}
</script>
<style lang="less" scoped>
.card-module {
  display: flex;
  margin: 0 10px;
  margin-top: 10px;
  background: #ffffff;
  .form-class {
    flex: 1;
    width: 100%;
    padding-top: 30px;
    padding-left: 30px;
  }
  .show-class {
    flex: 1;
    width: 100%;
    padding: 30px 10px;
    padding-right: 20px;
    .show-module {
      border-radius: 4px;
      border: 1px solid #d8d8d8;

      .top-title {
        height: 60px;
        font-size: 16px;
        line-height: 60px;
        padding-left: 20px;
        border-radius: 4px;
        color: #808080;
        background: #fafafa;
      }

      .show-title {
        display: flex;

        .a-class {
          flex: 1;
          text-align: right;
          font-size: 14px;
          padding-right: 15px;
        }
      }
    }

    .content-class {
      padding: 20px;

      .content-item {
        font-size: 16px;
        line-height: 40px;
        margin-bottom: 10px;

        .text-color {
          color: #b5b5b5;
          margin-right: 10px;
        }
      }
    }
  }
}
// 是否作弊的盒子
.hide-box {
  background: aliceblue;
  margin: 0 20px 20px 20px;
  padding: 10px 0 5px 35px;
  border-radius: 5px;
}
/deep/ .one-col-form-longLabel.ant-form .ant-form-item .ant-form-item-label {
  width: 140px;
}
.more {
  width: 100%;
  margin-top: 20px;
}
</style>
