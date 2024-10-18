<template>
  <a-spin :spinning="loading">
    <div class="card-class">
      <a-form-model
        ref="form"
        :model="model"
        class="two-col-form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="validatorRules"
      >
        <!-- 上 选择框 -->
        <div style="display: flex;">
          <a-form-model-item label="试题分类" style="flex: 1;" prop="categoryId">
            <a-tree-select
              v-model="model.categoryId"
              :tree-data="questionList"
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-node-filter-prop="title"
              :treeExpandedKeys.sync="treeExpandedKeys"
            />
          </a-form-model-item>
          <a-form-model-item label="试题类型" style="flex: 1;" prop="questionType">
            <a-select
              v-model="model.questionType"
              :disabled="disabledShow"
              placeholder="请选择试题类型"
              allow-clear
              show-search
              @change="changeType"
            >
              <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="监测类别" style="flex: 1;">
            <j-dict-select-tag
              v-model="model.monitoringCategory"
              placeholder="请选择监测类别"
              dict-code="monitoringCategory"
              :show-null-select="false"
            />
          </a-form-model-item>
          <!-- <a-form-model-item label="试题难度" style="flex: 1;" prop="difficult">
          <a-select v-model="model.difficult" placeholder="请选择试题难度" allow-clear show-search>
            <a-select-option
              v-for="i in difficultyLevel"
              :key="i.value"
              :value="i.value"
            >{{ i.text }}</a-select-option>
          </a-select>
        </a-form-model-item> -->
          <!-- <a-form-model-item label="试题标签" style="flex: 1;" prop="prop4">
          <a-tree-select
            v-model="model.prop4"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData2"
            placeholder="请选择试题标签"
            tree-default-expand-all
          />
        </a-form-model-item>-->
        </div>
        <div style="display: flex;">
          <a-form-model-item label="科目(方法原理)" style="flex: 1;">
            <JDictSelectTag
              v-model="model.methodPrinciple"
              :show-null-select="false"
              placeholder="请选择方法原理"
              dict-code="sys_post,post_name,id"
            />
          </a-form-model-item>
          <a-form-model-item label="标准号" style="flex: 1;">
            <a-input v-model="model.standardNumber" placeholder="请输入标准号" />
          </a-form-model-item>
          <a-form-model-item label="是否公开" style="flex: 1;">
            <j-dict-select-tag
              v-model="model.isShow"
              :show-null-select="false"
              :trigger-change="true"
              placeholder="请选择是否公开"
              dict-code="question_is_show"
            />
          </a-form-model-item>
          <a-form-model-item label="备注" style="flex: 1;">
            <a-input v-model="model.remarks" placeholder="请输入备注" />
          </a-form-model-item>
        </div>
        <!-- 输入框 -->
        <div style="border-top: 1px solid #DCDFE6;padding: 0 10px;">
          <!-- 题干 -->
          <div class="top-enter">
            <div class="label-div">
              <span class="label-class">题干</span>
            </div>
            <div class="editor-div">
              <div style="height: 140px;">
                <j-editor v-if="editorShow === 0" v-model="model.name" :height="120" />
                <div
                  v-else
                  class="input-border-class"
                  style="height: 110px;max-height: 140px;overflow-y: overlay;"
                  @click="quillShow(0)"
                >
                  <span v-if="model.name" style="color: black;" v-html="model.name" />
                  <span v-else>题干，点此编辑(必填)</span>
                </div>
              </div>
              <a-divider dashed style="margin: 0;" />
            </div>
          </div>
          <!-- 中间 -->
          <div class="top-enter">
            <div v-if="currentType == 1 || currentType == 2 || currentType == 3" class="boby-stem">
              <div class="label-div">
                <span class="label-class">选项</span>
              </div>
              <div class="editor-div">
                <!-- 单选题 -->
                <radio-form v-if="currentType == 1" ref="radioForm" :radio-form="radioForm" @ok="callback" />
                <!-- 多选题 -->
                <check-form v-if="currentType == 2" ref="radioForm" :radio-form="radioForm" @ok="callback" />
                <!-- 判断 -->
                <deter-mine v-if="currentType == 3" ref="radioForm" :radio-form="radioForm" @ok="callback" />
              </div>
            </div>
            <div
              v-if="currentType == 4 || currentType == 5 || currentType == 6 || currentType == 7 || currentType == 8"
              class="boby-stem"
            >
              <div class="label-div">
                <span class="label-class">答案</span>
              </div>
              <div class="editor-div">
                <!-- 填空题 -->
                <cloze-blank
                  v-if="currentType == 4"
                  ref="radioForm"
                  :radio-form="radioForm"
                  :answer-mess="model.answerMess"
                  :group-num="model.groupNum"
                  @ok="callback"
                  @ansCall="ansCall"
                />
                <!-- 简答 -->
                <short-answer v-if="currentType == 5" ref="radioForm" :radio-form="radioForm" @ok="callback" />
                <!-- 计算 -->
                <calcula-tion v-if="currentType == 6" ref="radioForm" :radio-form="radioForm" @ok="callback" />
                <!-- 分析 -->
                <analysis-type v-if="currentType == 7" ref="radioForm" :radio-form="radioForm" @ok="callback" />
                <!--论述  -->
                <discuss-type v-if="currentType == 8" ref="radioForm" :radio-form="radioForm" @ok="callback" />
              </div>
            </div>
          </div>
          <!-- 解析 -->
          <div class="bottom-class" style="display: flex;">
            <div class="label-div">
              <span class="label-class">解析</span>
            </div>
            <div class="editor-div">
              <div style="height: 190px;">
                <j-editor v-if="editorShow === 11" v-model="model.analysis" :height="180" />
                <div
                  v-else
                  class="input-border-class"
                  style="height: 170px;max-height: 170px;overflow-y: overlay;"
                  @click="quillShow(11)"
                >
                  <span v-if="model.analysis" style="color: black;" v-html="model.analysis" />
                  <span v-else>题目解析，点此编辑(选填)</span>
                </div>
              </div>
              <a-divider dashed style="margin: 0;" />
            </div>
          </div>
          <!-- 处理框 -->
          <div v-if="handleModal" class="handle-bottom">
            <div>
              <span class="label-class">处理内容</span>
            </div>
            <div class="editor-div">
              <a-textarea
                v-model="handleContent"
                placeholder="请输入处理内容（必填）"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
            </div>
          </div>
          <div class="button-class">
            <a-button style="margin-right: 20px;" @click="searchReset">重置</a-button>
            <a-button v-if="handleModal" type="primary" style="margin-right: 20px;" @click="handleok"
              >处理试题</a-button
            >
            <a-button v-if="!handleModal" type="primary" style="margin-right: 20px;" @click="handleClick"
              >录入</a-button
            >
            <a-button v-if="handleModal" type="primary" @click="callBackFk">返回</a-button>
            <a-button v-if="!handleModal" type="primary" @click="callBackClick">返回</a-button>
            <a-button v-if="handleModal" type="primary" style="margin-left: 20px;" @click="handleDeletes"
              >删除此题</a-button
            >
          </div>
          <div v-if="pageType === 'editWh'" style="display: flex;justify-content: center;margin-top: 10px">
            <a-button type="primary" style="margin-left: 20px;width: 150px;" @click="handleBeforeAndAfter(1)"
              >上一题</a-button
            >
            <a-button type="primary" style="margin-left: 20px;width: 150px;" @click="handleBeforeAndAfter(2)"
              >下一题</a-button
            >
          </div>
        </div>
      </a-form-model>
    </div>
  </a-spin>
</template>
<script>
import { dataType, difficultyLevel, treeData2 } from './compents/dataType'
import { getAction, postAction, httpAction, getFileAccessHttpUrl, deleteAction } from '@/api/manage'
import ClozeBlank from './ClozeBlank'
import RadioForm from './Radioform.vue'
import CheckForm from './CheckForm'
import DeterMine from './Determine.vue'
import ShortAnswer from './ShortAnswer'
import CalculaTion from './CalculaTion'
import AnalysisType from './AnalysisType'
import DiscussType from './DiscussType'
import { baseURL } from '@/utils/request.js'
export default {
  components: {
    ClozeBlank,
    RadioForm,
    CheckForm,
    DeterMine,
    ShortAnswer,
    CalculaTion,
    AnalysisType,
    DiscussType
  },
  props: {
    controlType: {
      type: Number,
      required: false
    },
    type: {
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
      loading: false,
      isTrue: false,
      checkTrue: false,
      excessiveTrue: true,
      name: '',
      analysis: '',
      editorShow: '',
      dataType: dataType,
      difficultyLevel: difficultyLevel,
      treeData2: treeData2,
      questionList: [],
      disabledShow: false, // 是否可以更改
      validatorRules: {
        categoryId: [{ required: true, message: '请选择试题分类!', trigger: 'change' }],
        questionType: [{ required: true, message: '请选择试题类型!', trigger: 'change' }],
        difficult: [{ required: true, message: '请选择试题难度!', trigger: 'change' }],
        name: [{ required: true, message: '请录入题干!' }]
      },
      model: {
        analysis: '',
        author: '',
        categoryId: '',
        categoryStr: '',
        difficult: 1,
        id: '',
        itemList: [],
        labelList: [],
        methodPrinciple: '',
        monitoringCategory: '',
        name: '',
        questionType: 1,
        score: 1,
        standardNumber: '',
        isShow: ''
      },
      labelCol: { style: 3 },
      wrapperCol: { span: 15 },
      currentType: '1',
      radioForm: [],
      cacheList: {},
      unHandle: '',
      handleContent: '',
      handleModal: false, // 处理时处理框是否显示
      questionId: '', // 从试题反馈获取的试题id
      pageType: '',
      url: {
        add: '/tQuestion/tQuestion/add',
        edit: '/tQuestion/tQuestion/edit'
      },
      currentId: '',
      treeExpandedKeys: []
    }
  },
  created() {
    this.getQuestion()
    let middleData = {}
    this.pageType = ''
    // 试题管理编辑/试题反馈 进入
    if (this.controlType == 1) {
      // 试题分享页面
      middleData = { ...this.dataList }
    } else {
      middleData = { ...this.$route.params.data }
    }
    if (middleData.id) {
      this.currentId = middleData.id
      this.cacheList = { ...this.$route.params.data }
      // this.model = JSON.parse(JSON.stringify(middleData))
      // this.currentType = this.model.questionType
      // this.radioForm = [...this.model.itemList]
      this.disabledShow = true
      this.getInfo()
      // 题目维护页面进入
      if (this.$route.query.type == 'editWh') {
        this.pageType = this.$route.query.type
      }
      if (this.$route.query.type == 'handle') {
        // 试题反馈时
        this.handleModal = true
        this.unHandle = this.$route.query.record.unHandle
        this.questionId = this.$route.query.record.id
      }
    }
  },
  methods: {
    getInfo() {
      this.loading = true
      this.getAction('/tQuestion/tQuestion/queryById', { id: this.currentId }).then(res => {
        if (res.success) {
          this.model = res.result
          this.treeExpandedKeys = []
          if (this.model.categoryId) {
            this.treeExpandedKeys = [this.model.categoryId]
          }
          this.currentType = this.model.questionType
          this.getAction('/tQuestion/tQuestion/queryById', { id: this.currentId }).then(res => {
            this.loading = false
            const itemList = res.result.itemList
            const characterList = []
            if (res.result.questionType == 1 || res.result.questionType == 2 || res.result.questionType == 3) {
              for (let i = 0; i < 26; i++) {
                characterList.push(String.fromCharCode(65 + i))
              }
              itemList.forEach((item, index) => {
                item.value = characterList[index]
              })
            }
            this.model.itemList = itemList
            this.radioForm = itemList
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleBeforeAndAfter(type) {
      const searchParams = this.$route.params.searchParams || {}
      const params = {
        id: this.currentId,
        beferAndAfter: type,
        ...searchParams,
        isMaintain: undefined // 录入后状态改变，上一题下一题就找不到了，所以不传此字段
      }
      this.getAction('/tQuestion/tQuestion/listResult', params).then(res => {
        if (res.success) {
          this.currentId = res.result.id
          this.getInfo()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 过滤html标签
    htmlToString(htmlStr) {
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 请选择试题类型
    changeType(e) {
      this.currentType = e
      this.radioForm = []
      this.model.itemList = []
    },
    // 富文本显示
    quillShow(e) {
      console.log(this.name)
      this.editorShow = e
    },
    // 获取树
    getQuestion() {
      getAction('sys/category/rootListNew', { type: 1, pageSize: 500 })
        .then(res => {
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
    // 重置
    searchReset() {
      this.$refs.form.resetFields()
      if (this.model.id) {
        this.getInfo()
        // // 编辑时重置内容
        // this.model = { ...this.cacheList }
        // this.radioForm = [...this.cacheList.itemList]
        // this.$refs.radioForm.reset(this.radioForm)
        // this.$forceUpdate()
      } else {
        // 新增时重置内容
        this.model = {
          analysis: '',
          author: '',
          categoryId: '',
          categoryStr: '',
          difficult: 1,
          id: '',
          itemList: [],
          labelList: [],
          methodPrinciple: '',
          monitoringCategory: '',
          name: '',
          questionType: 1,
          score: 1,
          standardNumber: '',
          isShow: ''
        }
        this.currentType = '1'
        this.radioForm = [...this.model.itemList]
        this.$refs.radioForm.showModal()
      }
    },
    // 删除此试题
    handleDeletes() {
      const that = this
      deleteAction('/tQuestion/tQuestion/delete', { id: this.questionId }).then(res1 => {
        if (res1.success) {
          deleteAction('/tQuestionFeedback/tQuestionFeedback/delete', { id: this.questionId }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.$router.push('/stgl/tmfk')
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.$message.warning(res1.message)
        }
      })
    },
    // 录入
    handleClick() {
      const that = this
      console.log(this.model.questionType)
      if (this.isTrue == false) {
        let blabkTrue = false
        let groupTrue = false
        if (
          this.model.questionType === 4 ||
          this.model.questionType === 5 ||
          this.model.questionType === 6 ||
          this.model.questionType === 7 ||
          this.model.questionType === 8
        ) {
          this.model.itemList.find(item => {
            if (item.item == '' || item.item == null) {
              blabkTrue = true
            }
          })
          if (this.model.itemList.length == 0) {
            blabkTrue = true
          }
          if (blabkTrue) {
            that.$message.warning('请填写答案')
            return
          }
          // 填空题填写分组
          if (this.model.questionType === 4) {
            if (this.model.answerMess == 2) {
              this.model.itemList.find(item => {
                if (item.groupNum == '' || item.groupNum == 0 || item.groupNum == null) {
                  groupTrue = true
                }
              })
              if (groupTrue) {
                that.$message.warning('请填写分组')
                return
              }
            }
          }
        } else {
          that.$message.warning('请选择并填写正确答案')
          return
        }
      }
      if (this.excessiveTrue == false) {
        that.$message.warning('请删除多余选项')
        return
      }
      if (this.currentType == '2' && this.checkTrue == false) {
        that.$message.warning('请至少选择俩个正确答案或填写相对应的答案')
        return
      }
      // 触发表单验证
      that.$refs.form.validate(valid => {
        if (valid) {
          console.log('提交参数1111', this.model)
          // that.model.name = this.htmlToString(this.model.name)
          // const analysis = this.htmlToString(this.model.analysis)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          const params = {
            ...that.model,
            isMaintain: 1
          }
          this.loading = true
          httpAction(httpurl, params, method)
            .then(res => {
              this.loading = false
              if (res.success) {
                that.$message.success(res.message)
                if (that.controlType == 1) {
                  that.$emit('handleOk')
                } else {
                  if (this.pageType == 'editWh') {
                  } else {
                    that.$router.push({
                      name: 'stgl-tkgl',
                      query: { queryType: true }
                    })
                  }
                }
                // that.searchReset()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 处理试题
    handleok() {
      const that = this
      if (!this.handleContent) {
        that.$message.warning('请填写处理内容')
        return
      }

      if (this.isTrue == false) {
        let blabkTrue = false
        let groupTrue = false
        if (
          this.model.questionType === 4 ||
          this.model.questionType === 5 ||
          this.model.questionType === 6 ||
          this.model.questionType === 7 ||
          this.model.questionType === 8
        ) {
          this.model.itemList.find(item => {
            if (item.item == '' || item.item == null) {
              blabkTrue = true
            }
          })
          if (this.model.itemList.length == 0) {
            blabkTrue = true
          }
          if (blabkTrue) {
            that.$message.warning('请填写答案')
            return
          }
          // 填空题填写分组
          if (this.model.questionType === 4) {
            if (this.model.answerMess == 2) {
              this.model.itemList.find(item => {
                if (item.groupNum == '' || item.groupNum == 0 || item.groupNum == null) {
                  groupTrue = true
                }
              })
              if (groupTrue) {
                that.$message.warning('请填写分组')
                return
              }
            }
          }
        } else {
          that.$message.warning('请选择并填写正确答案')
          return
        }
      }

      if (this.excessiveTrue == false) {
        that.$message.warning('请删除多余选项')
        return
      }

      if (this.currentType == '2' && this.checkTrue == false) {
        that.$message.warning('请至少选择俩个正确答案或填写相对应的答案')
        return
      }

      const params1 = {
        ...that.model
      }
      // 编辑接口更新试题
      httpAction(that.url.edit, params1, 'put')
        .then(res1 => {
          if (res1.success) {
            // 处理接口
            const params = {}
            const arr = []
            for (const i in that.unHandle) {
              const obj = {
                id: that.unHandle[i].id,
                handleContent: that.handleContent
              }
              arr.push(obj)
            }
            params.unHandle = [...arr]
            const url = '/tQuestionFeedback/tQuestionFeedback/edit'
            postAction(url, params).then(res => {
              if (res.success) {
                let secondsToGo = 3
                const modal = this.$success({
                  okText: '确认',
                  title: '处理成功',
                  content: `${secondsToGo} 秒后返回列表`
                })
                const interval = setInterval(() => {
                  secondsToGo -= 1
                  modal.update({
                    content: `${secondsToGo} 秒后返回列表`
                  })
                }, 1000)
                setTimeout(() => {
                  clearInterval(interval)
                  modal.destroy()
                  that.$router.push('/stgl/tmfk')
                }, secondsToGo * 1000)
                // that.$message.success('处理成功')
              } else {
                that.$message.warning(res.message)
              }
            })
          } else {
            that.$message.warning(res1.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    // 返回上一层（题目管理
    callBackClick() {
      if (this.controlType == 1) {
        this.$emit('close')
      } else {
        if (this.pageType == 'editWh') {
          this.$router.push('/stgl/tmwh')
        } else {
          this.$router.push('/stgl/tkgl')
        }
      }

      // this.$router.go(-1)
    },
    // 返回题目反馈页面
    callBackFk() {
      this.$router.push('/stgl/tmfk')
    },
    // 监听radioForm组件内容变化时返回的数据处理
    callback(value) {
      const val = JSON.parse(JSON.stringify(value))
      this.isTrue = false
      this.checkTrue = false
      this.excessiveTrue = true
      // 多选题
      if (this.currentType == '2') {
        const arr = []
        // 答案选择了 填写内容的一栏 checkTrue=true
        val.map(item => {
          if (item.isRight == 1 && item.item) {
            arr.push(item.isRight)
          }
        })
        if (arr.length > 1) {
          this.checkTrue = true
        }
        val.map(item => {
          // 答案选择了 没有填写答案 checkTrue = false
          if (item.isRight == 1 && item.item == '') {
            this.checkTrue = false
          }
        })
      }
      val.map(item => {
        if (item.isRight == 1 && item.item) {
          this.isTrue = true
        }
      })
      val.map(item => {
        // 多余选项 （没有选择答案，没有填写内容的为多余选项）
        if ((item.isRight == 0 || item.isRight == null) && item.item == '') {
          this.excessiveTrue = false
        }
      })
      // 赋值
      this.model.itemList = [...val]
    },
    // 填空题勾选答案顺序变化
    ansCall(status) {
      this.model.answerMess = status
    }
  }
}
</script>
<style lang="less" scoped>
.card-class {
  height: auto;
  padding: 10px;
  background: #ffffff;
  overflow-y: auto;
}
/deep/ .ant-row {
  display: flex;
}
/deep/ .ant-radio {
  padding-top: 14px;
}
.label-class {
  padding: 1px 6px;
  border-radius: 3px;
  background: #f1f3f8;
}
.label-div {
  flex: 1;
  width: 50px;
  // height: 100%;
}
.top-enter {
  padding: 10px 30px;
  margin-top: 15px;
  display: flex;
}
.boby-stem {
  margin-bottom: 30px;
  // border-bottom: 1px dashed #ccc;
  padding-bottom: 15px;
  display: flex;
}
.input-border-class {
  color: #9090a4;
  padding-left: 20px;
  line-height: 30px;
  text-align: initial;
}
.input-border-class:hover {
  border: 1px solid #2f54eb;
}

.editor-div {
  flex: 24;
  // height: 90px;
  margin: -10px 10px;
  width: 1300px;
}

.bottom-class {
  height: 240px;
  padding: 25px 30px;
}

.button-class {
  height: 80px;
  padding: 20px;
  text-align: center;
}
.trends-height1 {
  height: 50px;
}
.trends-height2 {
  height: 120px;
}

/deep/ .ant-radio-checked:after {
  border: none;
}
.handle-bottom {
  padding: 25px 30px;
  display: flex;
}

// ::v-deep .ant-input {
//   border: 0;
//   min-width: 1300px;
//   font-size: 16px;
//   padding: 5px;
//   height: 100%;
// }
</style>
