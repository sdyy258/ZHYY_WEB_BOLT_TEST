<template>
  <div class="whole">
    <a-modal
      centered
      title="抽题规则"
      :visible="visible"
      :mask-closable="false"
      :confirm-loading="loading"
      width="1000px"
      :destroy-on-close="true"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-form-model ref="form" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="whole-top flex">
          <div class="left-type flex1">
            <div class="title-class title-excess">
              <div class="flex">
                <div class="icon-title" />
                <div class="text-title">题型设定</div>
              </div>
              <div>
                <span>分数合计：{{ model.totalScore || '0' }}分</span>
                <div>
                  试卷分类：
                  <a-tree-select
                    v-model.trim="examPaperRule.paperCategoryId"
                    :tree-data="parperList"
                    :dropdown-style="{ maxHeight: '100px', overflow: 'auto' }"
                    allow-clear
                    tree-node-filter-prop="title"
                    style="width:200px ;"
                  />
                </div>
                <!-- <span class="scroe">及格分数：<a-input-number v-model="model.passScore" class="input" /></span> -->
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
                <td><a-input-number v-model="examPaperRule.shortAnswerScore" :min="1" @change="fillChange($event,'shortAnswer','shortAnswerScore')" /></td>
                <td>{{ shortAnswerScore1 || '0' }}</td>
              </tr> -->
              <!-- <tr class="type-table1">
                <td>计算题</td>
                <td><a-input-number v-model="examPaperRule.calculate " :min="0" @change="fillChange($event,'calculate','calculateScore')" /></td>
                <td><a-input-number v-model="examPaperRule.calculateScore" :min="1" @change="fillChange($event,'calculate','calculateScore')" /></td>
                <td>{{ calculateScore1 || '0' }}</td>
              </tr> -->
            </table>

            <div style="color:red;margin-top: 15px;">
              最多可选：单选题(50道)，多选题(30道)，判断题(30道)，填空题(20道)。
            </div>
            <div style="color:red;">
              备注：每题分数必须为整数且不得小于1分；满分为100分。
            </div>
          </div>
          <div class="right-sample flex1">
            <div class="title-class">
              <div class="icon-title" />
              <div class="text-title">抽题设定</div>
            </div>
            <div class="sample-all" style="height: auto;">
              <!-- <a-row :gutter="24"> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="题目分类">
                <a-tree-select
                  v-model.trim="categoryId"
                  :tree-data="questionList"
                  :dropdown-style="{ overflow: 'auto' }"
                  placeholder="全部"
                  allow-clear
                  tree-node-filter-prop="title"
                  multiple
                  style="width:200px ;"
                  @change="getQuestionNum"
                />
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="监测类别">
                <j-multi-select-tag
                  v-model="examPaperRule.monitoringCategory"
                  placeholder="全部"
                  dict-code="monitoringCategory"
                  @change="getQuestionNum"
                />
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="科目(方法原理)">
                <j-multi-select-tag
                  v-model="examPaperRule.methodPrinciple"
                  placeholder="全部"
                  dict-code="sys_post,post_name,id"
                  @change="getQuestionNum"
                />
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- <a-col :span="12"> -->
              <a-form-model-item label="标准号">
                <a-input v-model="examPaperRule.standardNumber" placeholder="请输入标准号" @change="getQuestionNum" />
              </a-form-model-item>
              <!-- </a-col> -->
              <!-- </a-row> -->
              <div
                v-if="role.indexOf('admin') > -1 || role.indexOf('stadmin') > -1 || role.indexOf('dsgly') == -1"
                class="sample-foot"
              >
                <div class="foot-text">
                  满足当前所选条件题目数:
                </div>
                <div>
                  <span class="foot-label">单选题: {{ extractList.single || '0' }}个</span>
                  <span class="foot-label">多选题: {{ extractList.multiple || '0' }}个</span>
                  <span class="foot-label">判断题: {{ extractList.judge || '0' }}个</span>
                  <span class="foot-label">填空题: {{ extractList.fill || '0' }}个</span>
                  <!-- <span class="foot-label">简答题:  {{ extractList.shortAnswer || '0' }}个</span> -->
                  <!-- <span class="foot-label">计算题:  {{ extractList.calculate || '0' }}个</span> -->
                </div>
              </div>
              <!-- </a-col> -->
            </div>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction } from '@/api/manage'
import { multiplication } from '../../kscj/modal/data'
export default {
  components: {},
  mixins: [JeecgListMixin],
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      visible: false,
      role: '',
      model: {},
      examPaperRule: {}, // 试题数组
      extractList: {}, // 抽题数量
      questionList: [], // 题目分类
      examList: [], // 考试分类
      parperList: [], // 试卷分类
      categoryId: [],
      singleScore1: 0,
      multipleScore1: 0,
      judgeScore1: 0,
      fillScore1: 0,
      // shortAnswerScore1: 0,
      // calculateScore1: 0,
      // paperCategoryId: '',
      rules: {
        name: { required: true, message: '请输入考试名称', trigger: 'blur' },
        categoryId: { required: true, message: '请选择', trigger: 'change' }
      }
    }
  },
  created() {
    this.getQuestion()
    this.getParper()
    this.getExam()
    // const m = this.$route.query
    // if (m && m.length > 0) {
    //   this.model = { ...m }
    //   this.examPaperRule = { ...m.examPaperRule }
    // }
  },
  methods: {
    showModal(val) {
      this.visible = true
      this.role = this.$store.getters.userInfo.roles
      this.examPaperRule = {}
      this.model = {}
      this.categoryId = []
      this.examPaperRule = { ...val }
      for (const key in this.examPaperRule) {
        // 计算每题的分数
        if (key === 'single' || key === 'multiple' || key === 'judge' || key === 'fill') {
          this[key + 'Score1'] = multiplication(this.examPaperRule[key], this.examPaperRule[key + 'Score'])
        }
      }
      if (val.categoryId) {
        this.categoryId = val.categoryId.split(',')
      }
      this.getQuestionNum()
      this.countTotal()
    },
    // 计算分数
    fillChange(e, num, val) {
      if (num == 'single' && e > this.extractList.single) {
        this.$message.warning('所选试题数量超过题库数量')
      }
      if (num == 'multiple' && e > this.extractList.multiple) {
        this.$message.warning('所选试题数量超过题库数量')
      }
      if (num == 'judge' && e > this.extractList.judge) {
        this.$message.warning('所选试题数量超过题库数量')
      }
      if (num == 'fill' && e > this.extractList.fill) {
        this.$message.warning('所选试题数量超过题库数量')
      }
      this[val + '1'] = multiplication(this.examPaperRule[num], this.examPaperRule[val])
      this.countTotal()
    },
    // 分数变化计算
    scoreChange(e, num, val) {
      this[val + '1'] = multiplication(this.examPaperRule[num], this.examPaperRule[val])
      this.countTotal()
    },
    // 计算分数小计
    // 计算总分 和及格分数
    countTotal() {
      const num1 = Number(this.singleScore1 || '0') + Number(this.multipleScore1 || '0')
      const num2 = Number(this.judgeScore1 || '0') + Number(this.fillScore1 || '0')

      // const num3 = Number(this.shortAnswerScore1 || '0') + Number(this.calculateScore1 || '0')
      // this.model.totalScore = Number(num1 || '0') + Number(num2 || '0') + Number(num3 || '0')
      this.model.totalScore = Number(num1 || '0') + Number(num2 || '0')
      // const num4 = multiplication(this.model.totalScore, 0.6)
      // this.model.passScore = Math.round(num4)
    },
    // 获取试题分类树
    getQuestion() {
      getAction('sys/category/rootListWithOutPrc', { type: 1, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.questionList = result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取试卷分类树
    getParper() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.parperList = result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取考试树
    getExam() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 })
        .then(res => {
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
    // 抽题数量
    getQuestionNum(e) {
      if (this.categoryId && this.categoryId.length > 0) {
        this.examPaperRule.categoryId = this.categoryId
          .map(item => {
            return item
          })
          .join(',')
      }
      const params = {
        categoryId: this.examPaperRule.categoryId,
        monitoringCategory: this.examPaperRule.monitoringCategory,
        standardNumber: this.examPaperRule.standardNumber,
        methodPrinciple: this.examPaperRule.methodPrinciple
      }
      getAction('/tQuestion/tQuestion/countByParam', params).then(res => {
        if (res.success) {
          const data = res.result
          this.extractList = data
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleOk() {
      if (this.model.totalScore != 100) {
        this.$message.warning('满分必须为100分')
        return false
      }
      for (const i in this.extractList) {
        for (const j in this.examPaperRule) {
          if (i == j) {
            const num1 = Number(this.extractList[i])
            const num2 = Number(this.examPaperRule[j])
            if (num1 < num2) {
              this.$message.warning('输入的试题对应数量不足')
              return false
            }
          }
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.model,
            ...this.examPaperRule
          }
          postAction('/tExamPaperRule/tExamPaperRule/edit', params).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('ok', '')
              this.visible = false
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    }
  }
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
    /deep/.ant-btn {
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
  // 右边抽提
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
</style>
