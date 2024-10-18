<template>
  <div class="whole">
    <a-card :bordered="false">
      <div class="whole-header">
        <div v-if="!saveShow && !createShow" class="header-title">快速创建考试</div>
        <div v-else class="header-title">编辑考试</div>

        <div v-if="detailShow" class="header-button">
          <a-button type="primary" @click="backReturn">返回</a-button>
        </div>
        <div v-else class="header-button">
          <a-button v-if="!saveShow && !createShow" type="primary" @click="CreateExam('1')">创建考试</a-button>
          <a-button v-if="!saveShow && !createShow" type="primary" @click="CreateExam('2')">创建并预览</a-button>
          <a-button v-if="saveShow && !createShow" type="primary" @click="CreateExam('3')">保存</a-button>
          <a-button v-if="createShow && !saveShow" type="primary" @click="Preview">预览</a-button>
          <a-button type="primary" @click="backReturn">返回</a-button>
        </div>
      </div>
      <a-form-model ref="form" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="whole-top flex">
          <div class="left-type flex1">
            <div
              class="title-class"
              style="display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between"
            >
              <div class="flex">
                <div class="icon-title" />
                <div class="text-title">题型设定</div>
              </div>
              <div style="display: flex; align-items: center; flex-wrap: wrap">
                <div>
                  试卷分类：
                  <a-tree-select
                    v-model.trim="examPaperRule.paperCategoryId"
                    :tree-data="parperList"
                    :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
                    allow-clear
                    tree-node-filter-prop="title"
                    placeholder="请选择"
                    style="width: 200px"
                  />
                </div>
                <div class="scroe">分数合计(50/100分)：{{ model.totalScore || '0' }}分</div>
                <div class="scroe">
                  及格分数：
                  <a-input-number v-model="model.passScore" class="input" />
                </div>
              </div>
            </div>
            <table border="0" width="100%" height="260px">
              <tr class="type-table">
                <td>题型</td>
                <td>题目数量</td>
                <td>每题分数</td>
                <td>分数小计</td>
              </tr>
              <tr class="type-table1">
                <td>单选题</td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.single"
                    :precision="0"
                    :min="0"
                    :max="50"
                    @change="fillChange($event, 'single', 'singleScore')"
                  />
                </td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.singleScore"
                    :precision="0"
                    :min="1"
                    @change="scoreChange($event, 'single', 'singleScore')"
                  />
                </td>
                <td>{{ singleScore1 || '0' }}</td>
              </tr>
              <tr class="type-table1">
                <td>多选题</td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.multiple"
                    :precision="0"
                    :min="0"
                    :max="30"
                    @change="fillChange($event, 'multiple', 'multipleScore')"
                  />
                </td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.multipleScore"
                    :precision="0"
                    :min="1"
                    @change="scoreChange($event, 'multiple', 'multipleScore')"
                  />
                </td>
                <td>{{ multipleScore1 || '0' }}</td>
              </tr>
              <tr class="type-table1">
                <td>判断题</td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.judge"
                    :precision="0"
                    :min="0"
                    :max="30"
                    @change="fillChange($event, 'judge', 'judgeScore')"
                  />
                </td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.judgeScore"
                    :precision="0"
                    :min="1"
                    @change="scoreChange($event, 'judge', 'judgeScore')"
                  />
                </td>
                <td>{{ judgeScore1 || '0' }}</td>
              </tr>
              <tr class="type-table1">
                <td>填空题</td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.fill"
                    :precision="0"
                    :min="0"
                    :max="20"
                    @change="fillChange($event, 'fill', 'fillScore')"
                  />
                </td>
                <td>
                  <a-input-number
                    v-model="examPaperRule.fillScore"
                    :precision="0"
                    :min="1"
                    @change="scoreChange($event, 'fill', 'fillScore')"
                  />
                </td>
                <td>{{ fillScore1 || '0' }}</td>
              </tr>
              <!-- <tr class="type-table1">
                <td>简答题</td>
                <td><a-input-number v-model="examPaperRule.shortAnswer " :min="0" @change="fillChange($event,'shortAnswer','shortAnswerScore')" /></td>
                <td><a-input-number v-model="examPaperRule.shortAnswerScore" :min="1" @change="scoreChange($event,'shortAnswer','shortAnswerScore')" /></td>
                <td>{{ shortAnswerScore1 || '0' }}</td>
              </tr> -->
              <!-- <tr class="type-table1">
                <td>计算题</td>
                <td><a-input-number v-model="examPaperRule.calculate " :min="0" @change="fillChange($event,'calculate','calculateScore')" /></td>
                <td><a-input-number v-model="examPaperRule.calculateScore" :min="1" @change="fillChange($event,'calculate','calculateScore')" /></td>
                <td>{{ calculateScore1 || '0' }}</td>
              </tr> -->
            </table>

            <div style="color: red; margin-top: 15px">
              最多可选：单选题(50道)，多选题(30道)，判断题(30道)，填空题(20道)。
            </div>
            <div style="color: red">备注：每题分数必须为整数且不得小于1分；满分为50分或100分。</div>
          </div>
          <div class="right-sample flex1">
            <div class="title-class">
              <div class="icon-title" />
              <div class="text-title">抽题设定</div>
            </div>
            <div class="sample-all" style="height: auto">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="题目分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                    <a-tree-select
                      v-model.trim="categoryId"
                      :tree-data="questionList"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      placeholder="全部"
                      allow-clear
                      tree-node-filter-prop="title"
                      multiple
                      style="width: 400px; margin-right: 10px"
                      @change="getQuestionType"
                    />
                    <a-button type="primary" @click="$refs.setCountModal.showModal()">设置题目分类比例</a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-model-item label="监测类别" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                    <j-multi-select-tag
                      v-model="examPaperRule.monitoringCategory"
                      placeholder="全部"
                      :options="monitorList"
                      dict-code="monitoringCategory"
                      @change="getQuestionNum"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="科目(方法原理)" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                    <j-multi-select-tag
                      v-model="examPaperRule.methodPrinciple"
                      placeholder="全部"
                      dict-code="sys_post,post_name,id"
                      @change="getMethod"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="标准号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                    <a-input
                      v-model="examPaperRule.standardNumber"
                      placeholder="请输入标准号"
                      @change="getQuestionNum"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div
                v-if="role.indexOf('admin') > -1 || role.indexOf('stadmin') > -1 || role.indexOf('dsgly') == -1"
                class="sample-foot"
              >
                <div class="foot-text">满足当前所选条件题目数:</div>
                <div>
                  <span class="foot-label">单选题: {{ extractList.single || '0' }}个</span>
                  <span class="foot-label">多选题: {{ extractList.multiple || '0' }}个</span>
                  <span class="foot-label">判断题: {{ extractList.judge || '0' }}个</span>
                  <span class="foot-label">填空题: {{ extractList.fill || '0' }}个</span>
                  <!-- <span class="foot-label">简答题:  {{ extractList.shortAnswer || '0' }}个</span> -->
                  <!-- <span class="foot-label">计算题:  {{ extractList.calculate || '0' }}个</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="whole-top flex">
          <div class="right-sample flex1">
            <div class="title-class">
              <div class="icon-title" />
              <div class="text-title">考试信息</div>
            </div>
            <div class="sample-all">
              <!-- <a-row :gutter="24"> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="考试名称" prop="name">
                <a-input v-model="model.name" placeholder="请输入考试名称" :max-length="30" />
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="考试分类" prop="categoryId">
                <a-tree-select
                  v-model="model.categoryId"
                  :tree-data="examList"
                  :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
                  placeholder="请选择"
                  allow-clear
                  tree-node-filter-prop="title"
                  style="width: 75%; margin-right: 10px"
                />
                <a-button type="primary" @click="mainTenance">维护分类</a-button>
                <!-- <tree-search :tree-data="examList" /> -->
              </a-form-model-item>
              <a-form-model-item label="身份认证" prop="identityCheck">
                <a-radio-group v-model="model.identityCheck">
                  <a-radio :value="0"> 账号登录 </a-radio>
                  <a-radio :value="2"> 手机短信验证 </a-radio>
                  <a-radio :value="3">身份证号验证</a-radio>
                </a-radio-group>
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- </a-row> -->
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
                    <span v-if="model.isTimeLimit == 1">
                      <a-input-number v-model="model.examTime" :min="1" />分钟
                    </span>
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
                  <a-radio :value="1"><span>是</span></a-radio>
                  <!-- <a-radio :value="2">每天考一次</a-radio> -->
                </a-radio-group>
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
              <a-form-model-item label="参与方式" prop="examWay">
                <a-radio-group v-model="model.examWay" @change="examWayChange">
                  <a-radio :value="0">指定地市</a-radio>
                  <a-radio :value="1">指定人员</a-radio>
                  <a-radio :value="2">学员自主报名</a-radio>
                  <!-- <a-radio v-if="orgLevel == 1" :value="3">省站用户</a-radio> -->
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item v-if="model.examWay == 0" label="参与地市范围" prop="departIds">
                <a-tree-select
                  v-model="departIds"
                  placeholder="请选择参与地市范围"
                  :tree-data="departList"
                  multiple
                  allow-clear
                  tree-node-filter-prop="title"
                  :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
                  @change="departChange"
                />
              </a-form-model-item>
              <a-form-model-item v-if="model.examWay == 1" label="用户选择" prop="userIdList">
                <a-input v-model="model.userIdList" @click.stop="handleAddUserRole" @keyup.backspace="onDeleteKeyDown"
                  >添加用户
                </a-input>
              </a-form-model-item>
              <a-form-model-item v-if="model.examWay == 2" label="报名范围" prop="enrollLevel">
                <a-checkbox-group v-model="enrollLevel" @change="enrollLevelChange">
                  <!-- <a-checkbox
                    v-if="role.indexOf('admin') > -1 || role.indexOf('stadmin') == -1 || role.indexOf('dsgly') == -1"
                    value="1"
                    >省站用户</a-checkbox
                  > -->
                  <a-checkbox value="2">市站用户</a-checkbox>
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
              <a-form-model-item label="考试封面" prop="pictureUrl">
                <!-- <img :src="model.pictureUrl" alt="" style="height:102px;width:102px;vertical-align:top;"> -->
                <j-image-upload
                  v-model="model.pictureUrl"
                  text="上传"
                  style="display: inline-block; margin-left: 10px"
                  @change="handleChange"
                />
              </a-form-model-item>
              <a-form-model-item label="考试须知" prop="examExplain">
                <a-textarea
                  v-model="model.examExplain"
                  placeholder="请输入考试须知"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="right-sample flex1">
            <div class="title-class">
              <div class="icon-title" />
              <div class="text-title">防作弊设定</div>
            </div>
            <div class="sample-all">
              <a-form-model-item label="防作弊">
                <a-switch
                  v-model="switchList.isPreventingCheating"
                  active-value="1"
                  @change="isPreventChange($event, 'isPreventingCheating', switchList.isPreventingCheating)"
                />
              </a-form-model-item>
              <!-- <div v-show="switchList.isPreventingCheating"> -->
              <a-form-model-item label="开启全屏">
                <a-switch
                  v-model="switchList.isFullScreen"
                  :disabled="switchShow"
                  @change="switchChange($event, 'isFullScreen')"
                />
              </a-form-model-item>
              <a-form-model-item label="考前拍照:">
                <a-switch
                  v-model="switchList.isBeforePic"
                  :disabled="switchShow"
                  @change="switchChange($event, 'isBeforePic')"
                />
              </a-form-model-item>
              <a-form-model-item label="摄像头抓拍">
                <a-switch
                  v-model="switchList.isCameraCapture"
                  :disabled="switchShow"
                  @change="cameraChange($event, 'isCameraCapture')"
                />
              </a-form-model-item>
              <div
                v-if="switchList.isCameraCapture"
                style="background: aliceblue; padding: 10px 115px 1px 115px; margin: -18px 0 0 0"
              >
                <div style="margin-left: 36px">
                  <span>
                    抓拍在考试开始
                    <a-input-number
                      v-model="model.cameraCaptureStart"
                      :min="1"
                      @change="numberChange($event, 'cameraCaptureStart')"
                    />
                    分钟后进行
                  </span>
                </div>
                <a-form-model-item label="摄像头抓拍时机" prop="cameraCaptureTime	">
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
              <!-- </div> -->
            </div>
          </div>
        </div>
      </a-form-model>
    </a-card>
    <cread-link ref="creadLink" />
    <Select-User-Modal ref="selectUserModal" :depart-list="departList" @selectFinished="userSelectOK" />
    <paper-preview-modal ref="paperPreviewModal" />
    <main-tenance ref="mainTenance" @ok="getClassification()" />
    <SetCountModal ref="setCountModal" :category-id="categoryId" :question-list="questionList" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction } from '@/api/manage'
import { columns, dataSource, multiplication, division } from './modal/data'
import SelectUserModal from '../cjks/model/SelectUserModal'
import CreadLink from '../ksgl/modules/CreadLink'
import moment from 'moment'
import PaperPreviewModal from './components/PaperPreviewModal'
import { initDictOptions } from '@comp/dict/JDictSelectUtil'
import TreeSearch from '../cjsj/modal/TreeSearch'
import MainTenance from './components/MainTenance'
import Vue from 'vue'
import SetCountModal from './components/SetCountModal'

export default {
  components: { SelectUserModal, CreadLink, PaperPreviewModal, MainTenance, SetCountModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      moment,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      createShow: false, // 预览按钮显示
      saveShow: false, // 保存按钮显示
      parerId: '',
      parperList: [], // 试卷分类
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
        // isPreventingCheating: 1,
        enrollLevel: '', // 报名范围
        userIdList: [], // 用户姓名
        totalScore: 0,
        cameraCaptureTime: 0,
        cameraCaptureStart: 1,
        cameraCaptureNum: 1,
        pictureUrl: '/minio/oems/temp/考试默认图(1)_1686018050614.png',
        examExplain:
          '1.每人只有一次考试机会，未在规定时间内参加考试的，其成绩按零分计。\n2.考试期间严格遵守考试纪律，独立完成答题，不得违规作弊，被发现违规作弊的，其成绩按零分计。',
      },
      examPaperRule: {
        single: 0,
        singleScore: 1,
        multiple: 0,
        multipleScore: 1,
        judge: 0,
        judgeScore: 1,
        fill: 0,
        fillScore: 1,
        // shortAnswer: 0,
        // shortAnswerScore: 1,
        // calculate: 0,
        // calculateScore: 1,
        paperCategoryId: undefined,
      }, // 试题数组
      singleScore1: 0,
      multipleScore1: 0,
      judgeScore1: 0,
      fillScore1: 0,
      // shortAnswerScore1: 0,
      // calculateScore1: 0,
      extractList: {}, // 抽题数量
      questionList: [], // 题目分类
      examList: [], // 考试分类
      departList: [], // 地市列表
      // enrollStartTime: [], // 报名时间
      switchList: [], // 开关列表
      categoryId: [],
      switchShow: true,
      methodList: [],
      monitorList: [],
      year: '',
      month: '',
      typeName: '',
      methodName: '',
      orgLevel: '', // 省级用户
      departIds: [], // 地市用户id
      enrollLevel: [], // 报名范围
      role: '',
      detailShow: false, // 返回按钮显示
      rules: {
        name: { required: true, message: '请输入考试名称', trigger: 'blur' },
        categoryId: { required: true, message: '请选择考试分类', trigger: 'change' },
        identityCheck: { required: true, message: '请选择', trigger: 'blur' },
        // categoryIdSt: { type: 'array', required: true, message: '请选择试题分类', trigger: 'change' },
        limitTime: { required: true, message: '请选择考试时间', trigger: 'change' },
        isTimeLimit: { required: true, message: '请选择答卷时长', trigger: 'blur' },
        isTimeSlot: { required: true, message: '是否指定每天的考试时间段', trigger: 'blur' },
        slotStartTime: { required: true, message: '请选择指定时间段', trigger: 'change' },
        isNumLimit: { required: true, message: '请选择答题次数', trigger: 'blur' },
        isShowOnApp: { required: true, message: '请选择可否在APP考试', trigger: 'blur' },
        scoreSet: { required: true, message: '请选择成绩设置', trigger: 'blur' },
        scoreShowTime: { required: true, message: '请选择成绩公布时间', trigger: 'change' },
        examWay: { required: true, message: '请选择参与方式', trigger: 'blur' },
        departIds: { required: true, message: '请选择地市', trigger: 'change' },
        userIdList: { required: true, message: '请选择用户', trigger: 'change' },
        isPreventingCheating: { required: true, message: '是否开启防作弊', trigger: 'blur' },
        pictureUrl: { required: true, message: '请上传考试封面', trigger: 'blur' },
        enrollTimelist: { required: true, message: '请选择报名时间', trigger: 'change' },
        enrollLevel: { required: true, message: '请选择报名范围', trigger: 'blur' },
      },
    }
  },
  created() {
    this.$nextTick(() => {
      this.getQuestion()
      this.getParper()
      this.getExam()
      this.getDepartList()
      this.getQuestionNum()
    })
    const date = new Date()
    this.year = date.getFullYear() // 年
    this.month = date.getMonth() + 1 // 月
    const name = this.year + '年' + this.month + '月' + '考试'
    this.$set(this.model, 'name', name)
    this.getinitDictOptions()
    this.switchList.isPreventingCheating = this.model.isPreventingCheating === 1
    const szUser = Vue.ls.get('DEPART')[0].orgLevel
    this.orgLevel = szUser
    this.role = this.$store.getters.userInfo.roles

    setTimeout(() => {
      const list = JSON.stringify(this.$route.query)
      if (JSON.parse(list).detailShow) {
        this.detailShow = JSON.parse(list).detailShow
      }
      let arr = ''
      if (JSON.parse(list).id) {
        this.saveShow = true
        getAction('/tExam/tExam/queryRandomById', { id: JSON.parse(list).id }).then((res) => {
          if (res.success) {
            arr = res.result
            this.model = { ...arr }
            this.$nextTick(() => {
              // 编辑时回显分类比例
              this.$refs.setCountModal.setDataSource(this.model.examPaperRule.categoryNumberList)
            })
            this.examPaperRule = { ...arr.examPaperRule }
            if (!this.model.scoreSet) {
              this.model.scoreSet = 1
            }
            this.model.limitTime = []
            this.model.limitTime.push(this.model.limitStartTime)
            this.model.limitTime.push(this.model.limitEndTime)
            this.model.enrollTimelist = []
            this.model.enrollTimelist.push(this.model.enrollStartTime)
            this.model.enrollTimelist.push(this.model.enrollEndTime)
            this.switchList.isPreventingCheating = this.model.isPreventingCheating === 1
            this.switchList.isFullScreen = this.model.isFullScreen === 1
            this.switchList.isBeforePic = this.model.isBeforePic === 1
            this.switchList.isCameraCapture = this.model.isCameraCapture === 1
            this.switchShow = this.model.isPreventingCheating !== 1
            for (const key in this.examPaperRule) {
              if (key === 'single' || key === 'multiple' || key === 'judge' || key === 'fill') {
                this[key + 'Score1'] = multiplication(this.examPaperRule[key], this.examPaperRule[key + 'Score'])
              }
            }
            this.model.userIdList = []
            if (this.model.examWay == 0) {
              // 地市显示
              if (this.model.departIds) {
                this.departIds = this.model.departIds.split(',')
              }
            } else if (this.model.examWay == 1) {
              // 用户
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
            // 题目分类显示
            if (this.examPaperRule.categoryId) {
              this.categoryId = this.examPaperRule.categoryId.split(',')
            }
            this.getQuestionNum()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    }, 50)
  },
  methods: {
    getinitDictOptions() {
      initDictOptions('sys_post,post_name,id,del_flag=0').then((res) => {
        // const ids = res.result.map(item => item.value).join(',')
        // this.$set(this.examPaperRule, 'methodPrinciple', ids)
        if (res.success) {
          const result = res.result
          this.methodList = { ...result }
          console.log(this.methodList)
          this.$forceUpdate()
        }
        this.$forceUpdate()
      })
    },
    getmonDictOptions() {
      initDictOptions('monitoringCategory').then((res) => {
        if (res.success) {
          const result = res.result
          const obj = {
            label: '全部',
            text: '全部',
            title: '全部',
            value: 'all',
          }
          const arr = []
          arr.push(obj)
          this.monitorList = { ...result, ...arr }
          console.log(this.monitorList)
        }
        this.$forceUpdate()
      })
    },
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
    // 成绩设置
    achievementChange(e) {
      this.$forceUpdate()
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
    // 计算分数
    fillChange(e, num, val) {
      if (num == 'single' && e > this.extractList.single) {
        this.$message.warning('单选题所选数量超过题库数量')
      }
      if (num == 'multiple' && e > this.extractList.multiple) {
        this.$message.warning('多选题所选数量超过题库数量')
      }
      if (num == 'judge' && e > this.extractList.judge) {
        this.$message.warning('判断题所选数量超过题库数量')
      }
      if (num == 'fill' && e > this.extractList.fill) {
        this.$message.warning('填空题所选数量超过题库数量')
      }
      this[val + '1'] = multiplication(this.examPaperRule[num], this.examPaperRule[val])
      // this.examPaperRule[val] = multiplication(this.examPaperRule[num], this.examPaperRule[val + '1'])
      this.countTotal()
    },
    // 分数变化计算
    scoreChange(e, num, val) {
      this[val + '1'] = multiplication(this.examPaperRule[num], this.examPaperRule[val])
      this.countTotal()
    },
    // 计算总分（totalScore）和及格分数（passScore）
    countTotal() {
      const num1 = Number(this.singleScore1 || '0') + Number(this.multipleScore1 || '0')
      const num2 = Number(this.judgeScore1 || '0') + Number(this.fillScore1 || '0')
      // const num3 = Number(this.shortAnswerScore1 || '0') + Number(this.calculateScore1 || '0')
      // this.model.totalScore = Number(num1 || '0') + Number(num2 || '0') + Number(num3 || '0')
      this.model.totalScore = Number(num1 || '0') + Number(num2 || '0')
      const num3 = multiplication(this.model.totalScore, 0.6)
      this.model.passScore = Math.round(num3)
    },
    // 获取试题分类树
    getQuestion() {
      getAction('sys/category/rootListWithOutPrc', { type: 1, pageSize: 500 })
        .then((res) => {
          if (res.success) {
            const result = res.result
            // const obj = {
            //   title: '全部',
            //   hasChild: null,
            //   pid: '0',
            //   value: 'all'
            // }
            // const arr = []
            // arr.push(obj)
            this.questionList = [...result]
          } else {
            this.$message.warning(res.message)
          }
          this.$forceUpdate()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取试卷分类树
    getParper() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 })
        .then((res) => {
          if (res.success) {
            const result = res.result
            this.parperList = [...result]
          } else {
            this.$message.warning(res.message)
          }
          this.$forceUpdate()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取考试树
    getExam() {
      getAction('sys/category/rootListNew', { type: 3, pageSize: 500 })
        .then((res) => {
          if (res.success) {
            const result = res.result
            this.examList = result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 考试维护分类
    mainTenance() {
      this.$refs.mainTenance.title = '考试分类维护'
      this.$refs.mainTenance.showModal('3')
    },
    // 维护分类回显
    getClassification() {
      // 刷新获取最新的考试树
      this.getExam()
    },
    // 参与方式必选
    examWayChange(e) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate(['departIds', 'enrollTimelist', 'userIdList', 'enrollLevel'])
      })
      // this.rules.departIds = e.target.value === 0 ? { required: true, message: '请选择地市', trigger: 'change' } : {}
      // this.rules.userIdList = e.target.value === 1 ? { type: 'array', required: true, message: '请选择用户', trigger: 'change' } : {}
      // this.rules.enrollStartTime = e.target.value === 2 ? { required: true, message: '请选择报名时间', trigger: 'change' } : {}
      if (e.target.value === 0 || e.target.value === 1 || e.target.value === 3) {
        this.model.enrollTimelist = []
        this.model.enrollStartTime = ''
        this.model.enrollEndTime = ''
        this.enrollLevel = []
        this.model.enrollLevel = ''
      }
    },
    // 报名范围选择赋值
    enrollLevelChange(value) {
      const enrollLevel = value ? value.toString() : []
      this.$set(this.model, 'enrollLevel', enrollLevel)
      this.$refs.form.validateField(['enrollLevel'])
      this.$forceUpdate()
    },
    // 考试时间小于报名时间
    disLimitDate(current) {
      if (this.model.enrollEndTime) {
        return current < new Date(this.model.enrollEndTime)
      } else {
        return current < moment().startOf('day')
      }
    },
    // 报名时间大于考试时间
    disabledDate(current) {
      // 报名结束时间要早于考试结束时间
      // 报名开始时间要晚于此刻
      if (current && current < moment().startOf('day')) {
        return true
      } else if (current && current > moment(this.model.limitEndTime).subtract(-1, 'minutes')) {
        return true
      } else {
        return false
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
    // 成绩时间取值
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
      // 如果有值则去掉校验
      if (e.length > 0) {
        // this.$nextTick(() => {
        //   this.$refs.form.validateField(['enrollTimelist'])
        //   // this.$refs.form.clearValidate(['enrollTimelist'])
        // })
        this.$forceUpdate()
      }
      setTimeout(() => {
        this.$refs.form.validateField(['enrollTimelist'])
      }, 500)
    },
    // 获取参与地市范围数据
    getDepartList() {
      getAction('/sys/sysDepart/queryExamDepartTree').then((res) => {
        if (res.success) {
          const list = res.result.map((item) => {
            // item.isLeaf = false
            return item
          })
          this.$set(this, 'departList', list)
          // this.$set(this, 'departList', res.result)
        }
      })
    },
    // 地市用户id
    departChange(value) {
      const departIds = value ? value.toString() : undefined
      this.$set(this.model, 'departIds', departIds)
      // this.$refs.form.validateField(['departIds'])
    },
    // 题目分类 改变考试名称
    getQuestionType(value, label, extra) {
      this.typeName = label.join(',')
      const name = this.year + '年' + this.month + '月' + this.typeName + this.methodName + '考试'
      this.$set(this.model, 'name', name)
      this.getQuestionNum()
    },
    // 科目(方法原理) 改变考试名称
    getMethod(value, valName) {
      const typeData = value.split(',')
      const nameDate = []
      typeData.forEach((item) => {
        for (const i in this.methodList) {
          item == this.methodList[i].value ? nameDate.push(this.methodList[i].text) : ''
        }
      })
      this.methodName = nameDate.join(',')
      const name = this.year + '年' + this.month + '月' + this.typeName + this.methodName + '考试'
      this.$set(this.model, 'name', name)
      this.getQuestionNum()
    },
    // 抽题数量
    getQuestionNum(e) {
      if (this.categoryId && this.categoryId.length > 0) {
        this.examPaperRule.categoryId = this.categoryId
          .map((item) => {
            return item
          })
          .join(',')
      } else {
        this.examPaperRule.categoryId = ''
      }
      const params = {
        categoryId: this.examPaperRule.categoryId,
        monitoringCategory: this.examPaperRule.monitoringCategory,
        standardNumber: this.examPaperRule.standardNumber,
        methodPrinciple: this.examPaperRule.methodPrinciple,
      }
      getAction('/tQuestion/tQuestion/countByParam', params).then((res) => {
        if (res.success) {
          const data = res.result
          this.extractList = data
        } else {
          this.$message.warning(res.message)
        }
      })
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
    },
    // 防作弊开启
    isPreventChange(checked, val, data) {
      this.switchList[val] = checked
      this.model[val] = checked === true ? 1 : 0
      this.switchShow = checked !== true
      if (checked !== true) {
        this.model[val] = 0
        this.model.isFullScreen = 0
        this.model.isBeforePic = 0
        this.model.isCameraCapture = 0
        this.switchList.isFullScreen = false
        this.switchList.isBeforePic = false
        this.switchList.isCameraCapture = false
      }
      this.$forceUpdate()
    },
    // 开启全屏、考前拍照
    switchChange(checked, val) {
      this.switchList[val] = checked
      this.model[val] = checked === true ? 1 : 0
      this.$forceUpdate()
    },
    // 开启摄像头抓拍
    cameraChange(checked, val) {
      this.switchList[val] = checked
      this.model[val] = checked === true ? 1 : 0
      // this.model.cameraCaptureStart = 1
      // this.model.cameraCaptureNum = 1
      this.$forceUpdate()
    },
    //
    numberChange(e, val) {
      if (e) {
        this.model[val] = e
      } else {
        this.model[val] = 1
      }
    },
    // 考试封面上传
    handleChange(value) {
      const courseTitleAddress = value.split(';')[0]
      this.$set(this.model, 'pictureUrl', courseTitleAddress)
      // if (!value) {
      //   this.$set(this.model, 'pictureUrl', '/minio/oems/temp/考试默认图(1)_1686018124451.png')
      // }
    },
    // 创建考试
    CreateExam(val) {
      if (this.model.totalScore != 100 && this.model.totalScore != 50) {
        this.$message.warning('满分必须为50分或100分')
        return false
      }
      for (const i in this.extractList) {
        for (const j in this.examPaperRule) {
          if (i == j) {
            const num1 = Number(this.extractList[i])
            const num2 = Number(this.examPaperRule[j])
            let name = ''
            if (i == 'single') {
              name = '单选题'
            } else if (i == 'multiple') {
              name = '多选题'
            } else if (i == 'judge') {
              name = '判断题'
            } else if (i == 'fill') {
              name = '填空题'
            }
            if (num1 < num2) {
              this.$message.warning(name + '输入的试题对应数量不足')
              return false
            }
          }
        }
      }
      if (!this.examPaperRule.paperCategoryId) {
        this.$message.warning('请选择试卷类型')
        return false
      }
      // if (!this.model.pictureUrl) {
      //   this.model.pictureUrl = '/minio/oems/temp/考试默认图(1)_1686018050614.png'
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = ''
          if (!this.model.id) {
            url = '/tExam/tExam/addRandomExam'
          } else {
            url = '/tExam/tExam/editRandomExam'
          }
          this.model.examPaperRule = {
            ...this.examPaperRule,
            isSetCategoryNumber: this.$refs.setCountModal.isSetCategoryNumber,
            categoryNumberList: this.$refs.setCountModal.categoryNumberList,
          }
          const params = {
            ...this.model,
          }
          console.log('params', params)
          postAction(url, params).then((res) => {
            if (res.success) {
              if (val == '2') {
                this.createShow = true
                this.saveShow = false
                this.parerId = res.result.id
                this.$refs.paperPreviewModal.showModal(res.result.id)
              } else {
                this.saveShow = false
                this.$message.success(res.message || '成功')
                // this.$router.push('/ksgl/ksgl')
                this.$router.push({
                  name: 'ksgl-ksgl',
                  query: { queryType: true },
                })
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 预览考试
    Preview() {
      this.$refs.paperPreviewModal.showModal(this.parerId)
    },
    // 返回
    backReturn() {
      this.$router.push('/ksgl/ksgl')
    },
  },
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
}

.flex1 {
  flex: 1;
}

.title-excess {
  justify-content: space-between;
  align-items: center;
}

.title-class {
  // height: 5vh;
  display: flex;
  padding: 14px 0;
  box-sizing: border-box;
  // align-items: center;
  .icon-title {
    width: 5px;
    height: 21px;
    background: #298bf9;
  }

  .text-title {
    font-size: 16px;
    // color: #000000;
    margin-left: 10px;
    font-weight: bold;
    line-height: 18px;
    letter-spacing: 2px;
  }

  .input {
    width: 80px;
  }

  .scroe {
    margin-left: 10px;
  }
}

.whole-header {
  .header-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    // color: #000000;
    line-height: 18px;
    letter-spacing: 2px;
  }

  .header-button {
    float: right;
    margin-top: -30px;

    /deep/ .ant-btn {
      margin: 0 5px;
    }
  }
}

// 上面部分
.whole-top {
  width: 100%;
  margin: 30px 0;

  .left-type {
    margin: 0 30px;

    .type-table {
      text-align: center;
      border: 1px solid #ccc;
      background: #ebebeb;
    }

    .type-table1 {
      text-align: center;
      border: 1px solid #ccc;
    }
  }

  // 右边抽题
  .right-sample {
    margin: 0 30px;

    .sample-all {
      border: 1px solid #ccc;
      padding: 20px;
      height: auto;
    }

    .sample-foot {
      background: #f4f5f5;
      padding: 15px;
      margin-top: 10px;

      .foot-text {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 12px;
      }

      .foot-label {
        margin-right: 20px;
      }
    }
  }
}

// .ant-advanced-search-form {
//   padding: 24px;
//   background: #fbfbfb;
//   border: 1px solid #d9d9d9;
//   border-radius: 6px;
// }

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

// .ant-advanced-search-form .ant-form-item-control-wrapper {
//   flex: 1;
// }
/deep/ .ant-select-tree {
  height: 200px !important;
}
</style>
