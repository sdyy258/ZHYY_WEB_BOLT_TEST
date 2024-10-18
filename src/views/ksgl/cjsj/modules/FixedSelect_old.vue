<template>
  <a-modal
    centered
    :title="title"
    :class="$store.state.app.layout"
    :visible="visible"
    :mask-closable="false"
    cancel-text="取消"
    :ok-text="okText"
    :destroy-on-close="true"
    :confirm-loading="confirmLoading"
    width="800px"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-form-model
      ref="form"
      :model="model"
      :rules="rules"
      class="ant-advanced-search-form"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 14 }"
    >
      <div class="guide">
        <div class="normal-text">您可通过设置抽题规则，点击开始抽题，从题库快速抽取题目填充至试卷中！</div>
        <div class="blue-text">
          <span @click="$router.push('/stgl/tkgl')">前往题库，导入更多题目</span>
          <a-icon type="right" />
        </div>
      </div>
      <div class="choose">
        <div class="choose-title">筛选条件：</div>
        <a-row style="margin-left: -25px;">
          <a-col :span="24" style="display: block;">
            <a-form-model-item label="分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
              <a-tree-select
                v-model.trim="categoryId"
                :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
                :tree-data="questionList"
                placeholder="全部"
                allow-clear
                multiple
                tree-node-filter-prop="title"
                style="width: 588px;"
                @change="categoryChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="display: block;">
            <a-form-model-item label="监测类别">
              <j-multi-select-tag
                v-model="model.monitoringCategorys"
                class="choose-select"
                placeholder="全部"
                dict-code="monitoringCategory"
                @change="getQuestionNum"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="display: block;">
            <a-form-model-item label="标准号" style="display: block;">
              <a-input
                v-model="model.standardNumber"
                placeholder="请输入标准号"
                class="choose-select"
                @change="getQuestionNum"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="display: block;">
            <a-form-model-item
              label="科目(方法原理)"
              style="display: block;"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 6 }"
            >
              <j-multi-select-tag
                v-model="model.methodPrinciples"
                class="choose-select"
                placeholder="全部"
                dict-code="sys_post,post_name,id"
                @change="getQuestionNum"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="display: block;">
            <a-form-model-item label="题型" prop="questionType" style="display: block;">
              <a-select
                v-model="model.questionType"
                class="choose-select"
                placeholder="请选择试题类型"
                allow-clear
                show-search
              >
                <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" style="display: block;">
              <a-form-model-item
                label="是否重复抽取题目"
                prop="isRepeatExtract"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 6 }"
              >
                <j-dict-select-tag v-model="model.isRepeatExtract" dict-code="yn" trigger-change placeholder="请选择" />
              </a-form-model-item>
            </a-col> -->
        </a-row>
        <div class="sample-foot">
          <div class="foot-text">
            满足当前所选条件题目数:
          </div>
          <div>
            <span class="foot-label">单选题: {{ extractList.single || '0' }}个</span>
            <span class="foot-label">多选题: {{ extractList.multiple || '0' }}个</span>
            <span class="foot-label">判断题: {{ extractList.judge || '0' }}个</span>
            <span class="foot-label">填空题: {{ extractList.fill || '0' }}个</span>
            <span class="foot-label">简答题: {{ extractList.shortAnswer || '0' }}个</span>
            <span class="foot-label">计算题: {{ extractList.calculate || '0' }}个</span>
            <span class="foot-label">分析题: {{ extractList.analysis || '0' }}个</span>
            <span class="foot-label">论述题: {{ extractList.essay || '0' }}个</span>
          </div>
        </div>
      </div>
      <div class="etx-num">
        <a-form-model-item label="抽题数量 " :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" prop="num">
          <a-input-number v-model="model.num" :min="1" />
          <!-- <span>共 0 道题</span> -->
        </a-form-model-item>
        <!-- <a-form-model-item label="每题分数" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number v-model="model.score" :min="1" :max="10" />
          </a-form-model-item> -->
      </div>
    </a-form-model>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export const dataType = [
  {
    value: 1,
    text: '单选题'
  },
  {
    value: 2,
    text: '多选题'
  },
  {
    value: 3,
    text: '判断题'
  },
  {
    value: 4,
    text: '填空题'
  },
  {
    value: 5,
    text: '简答题'
  },
  {
    value: 6,
    text: '计算题'
  },
  {
    value: 7,
    text: '分析题'
  },
  {
    value: 8,
    text: '论述题'
  }
]
export default {
  props: {
    questionList: {
      type: Object,
      required: true
    },
    questionId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 6 },
      dataType: dataType,
      model: {},
      categoryId: [],
      title: '',
      okText: '',
      index: '',
      extractList: {},
      rules: {
        categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
        questionType: [{ required: true, message: '请选择试题类型', trigger: 'blur' }],
        num: [{ required: true, message: '抽题数量', trigger: 'blur' }]
        // isRepeatExtract: [{ required: true, message: '是否重复抽取题目', trigger: 'blur' }]
      }
    }
  },
  methods: {
    showModal(val) {
      this.visible = true
      this.confirmLoading = false
      this.model = {
        isRepeatExtract: '1'
      }
      this.categoryId = []
      this.getQuestionNum()
      this.index = val
      //   this.questionList.map(item => {
      //     if (item.title.indexOf('大比武') > -1) {
      //       this.categoryId.push(item.value)
      //       // return item.value
      //     }
      //   })
      //   this.categoryChange(this.categoryId)
    },
    categoryChange(value) {
      this.model.categoryIds = value
        .map(item => {
          return item
        })
        .join(',')
      console.log('categoryId', this.categoryId)

      this.getQuestionNum()
    },
    // 抽题数量
    getQuestionNum(e) {
      const params = {
        categoryId: this.model.categoryIds,
        monitoringCategory: this.model.monitoringCategorys,
        standardNumber: this.model.standardNumber,
        methodPrinciple: this.model.methodPrinciples,
        questionType: this.questionType,
        selectQuestionIds: this.questionId,
        isRepeatExtract: this.model.isRepeatExtract
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
      if (this.model.questionType === 1) {
        if (this.model.num > this.extractList.single) {
          this.$message.warning('抽题数量应小于试题数量')
          return false
        }
      }
      if (this.model.questionType === 2) {
        if (this.model.num > this.extractList.multiple) {
          this.$message.warning('抽题数量应小于试题数量')
          return false
        }
      }
      if (this.model.questionType === 3) {
        if (this.model.num > this.extractList.judge) {
          this.$message.warning('抽题数量应小于试题数量')
          return false
        }
      }
      if (this.model.questionType === 4) {
        if (this.model.num > this.extractList.fill) {
          this.$message.warning('抽题数量应小于试题数量')
          return false
        }
      }
      // if (this.model.questionType === 5) {
      //   if (this.model.num > this.extractList.shortAnswer) {
      //     this.$message.warning('抽题数量应小于试题数量')
      //     return false
      //   }
      // }
      // if (this.model.questionType === 6) {
      //   if (this.model.num > this.extractList.calculate) {
      //     this.$message.warning('抽题数量应小于试题数量')
      //     return false
      //   }
      // }
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          // 已选题目的id
          that.model.selectQuestionIds = that.questionId
          getAction('/tQuestion/tQuestion/paperExtractQuestions', that.model)
            .then(res => {
              if (res.success) {
                const result = res.result
                that.$emit('ok', result, this.index, this.model.isRepeatExtract)
                console.log('result', result)
              } else {
                this.$message.warning(res.message)
              }
              this.visible = false
              this.confirmLoading = false
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.visible = false
      this.model = {}
      this.categoryId = []
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-modal-header {
  border-bottom: none;
  padding: 24px 24px 0 24px;
  text-align: center;
  .ant-modal-title {
    font-size: 25px;
  }
}
.ant-advanced-search-form {
  // padding: 24px;
  // background: #fbfbfb;
  // border: 1px solid #d9d9d9;
  // border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
/deep/.ant-form-item-control {
  line-height: 0px;
}
/deep/.ant-modal-footer {
  padding: 24px 16px;
  text-align: center;
  margin-top: -25px;
}
/deep/ .ant-col-12 {
  display: flex;
  box-sizing: border-box;
  width: 50%;
  align-items: center;
}
/deep/.ant-select-selection--multiple {
  max-height: 90px;
  overflow-y: scroll;
}
// .class-form {
// padding: 20px;
.guide {
  .normal-text {
    font-size: 16px;
  }
  .blue-text {
    color: #1a8cfe;
  }
}
.choose {
  font-size: 16px;
  padding: 30px 0;
  border-bottom: 1px solid #ccc;
  .choose-title {
    margin-bottom: 20px;
  }
  .choose-select {
    width: 200px;
  }
}
.etx-num {
  font-size: 16px;
  margin: 20px;
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
// }
</style>
