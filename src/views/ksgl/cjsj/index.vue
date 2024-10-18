<template>
  <div style="margin: 0;">
    <a-spin :spinning="loading">
      <!-- 顶部 -->
      <div class="header-paper">
        <div class="title">{{ title }}</div>
        <a-button type="danger" style="background: red;color: #fff;" @click="submit">保存</a-button>
        <a-button type="primary" style="margin-left:15px ;" @click="$router.push('/ksgl/sjgl')">返回</a-button>
      </div>
      <a-form>
        <a-form-item>
          <div id="components-layout-demo-basic">
            <!-- layout布局 -->
            <a-layout>
              <!-- 头部 -->
              <a-layout-header>
                <div class="title-class">
                  <div class="title-left flex1">
                    <a-input v-model="model.name" placeholder="试卷名称，点此编辑" class="title-left" />
                  </div>
                  <div class="title-right">
                    <span style="margin-right: 5px;font-size: 18px;display: flex;">
                      {{ model.bigQuestionCount || '0' }}大题 | {{ model.smallQuestionCount || '0' }} 小题 | 总分
                      {{ model.score || '0' }} 分
                      <!-- | 总时长
                      <span style="text-align: center;">
                        <a-input-number v-model="model.suggestTime" :min="0" />
                      </span>
                      分钟 -->
                    </span>
                  </div>
                </div>
                <div class="title-class">
                  <div class="bottom-left">
                    试卷分类：
                    <span>
                      <span>
                        <a-tree-select
                          v-model="model.categoryId"
                          :replace-fields="{ key: 'value' }"
                          :selected-keys="selectedKeys"
                          :tree-data="paperList"
                          tree-default-expand-all
                          style="width: 200px;"
                          @select="onSelect"
                        ><a-tree-select-node key="value" title="title" />
                        </a-tree-select>
                      </span>
                    </span>
                  </div>
                  <div class="bottom-button">
                    <a-popover placement="bottom" style="overflow:hidden; ">
                      <template slot="content">
                        <a-checkbox-group>
                          <a-row v-for="i in checkOptions" :key="i">
                            <a-col :span="24">
                              <a-checkbox :value="i.value">{{ i.label }}</a-checkbox>
                            </a-col>
                          </a-row>
                        </a-checkbox-group>
                      </template>
                    </a-popover>
                    <!-- <a-button icon="eye" style="color: #1a8cfe;">预览</a-button> -->
                    <!-- <a-button icon="download" style="color: #1a8cfe;">下载</a-button> -->
                  </div>
                </div>
              </a-layout-header>
              <a-layout style="margin-bottom: 0!important;">
                <!-- 左侧 -->
                <a-layout-sider style="background: white;height: calc(100vh - 382px);overflow-y: auto">
                  <div class="wrap">
                    <div class="warrp">
                      <div class="warp-top" @click="$refs.batchFraction.showModal(model.bigList)">批量设置分数</div>
                      <div v-for="(i,index) in model.bigList" :key="i" class="warp-center">
                        <div class="center-outline">
                          <div class="center-outline-title">
                            <span>{{ i.name || '暂无大题名称' }}（共{{ i.smallQuestionCount || '0' }}题,合计{{ i.score || '0' }}分）</span>
                          </div>
                          <div v-if="i.smallQuestionCount > 0" class="center-fract">
                            <div
                              v-for="(fract, fractindex) in i.smallList"
                              :key="fractindex"
                              class="center-fract-title"
                              @click="clickLeftItem(`${index}-${fractindex}`)"
                            >
                              {{ fractindex + 1 || '0' }}
                            </div>
                          </div>
                          <div v-else>当前暂无小题题目</div>
                        </div>
                      </div>
                      <div class="warp-foot">
                        <a-icon type="plus-circle" theme="filled" />
                        <span style="margin-left: 5px;" @click="addTest">新增题型</span>
                      </div>
                    </div>
                  </div>
                </a-layout-sider>
                <!-- 右侧内容 -->
                <a-layout-content id="layoutRight" style="height: calc(100vh - 382px);overflow-y: auto">
                  <div v-for="(i, index) in model.bigList" :key="index" style="margin-bottom: 30px;">
                    <!-- <div
                      style="background: transparent;height: 20px;width: 100%;position: absolute;top: 100px;left: 0;z-index: 9999;"
                    ></div> -->
                    <a-collapse
                      default-active-key="1"
                      :bordered="false"
                      expand-icon-position="right"
                      class="collapse-all"
                    >
                      <a-collapse-panel key="1">
                        <!-- 折叠面板头部区域 -->
                        <div slot="header" @click.stop="handleClick">
                          <div class="collapse-head">
                            <div class="collapse-top">
                              <!-- <j-dict-select-tag
                                v-model="i.name"
                                trigger-change
                                dict-code="dataType"
                                :show-null-select="false"
                                placeholder="请选择试题类型"
                              /> -->

                              <a-select
                                v-model="i.name"
                                class="choose-select"
                                placeholder="请选择试题类型"
                                :allow-clear="false"
                                show-search
                              >
                                <a-select-option v-for="j in dataType" :key="j.text" :value="j.text">{{
                                  j.text
                                }}</a-select-option>
                              </a-select>
                            </div>
                            <span>共{{ i.smallQuestionCount || '0' }}题,合计{{ i.score || '0' }}分</span>
                          </div>
                          <div class="collapse-head" style="padding: 10px 0 10px 45px;">
                            <div>
                              <a-checkbox
                                v-model="i.explainShow"
                                style="font-size: 16px;"
                                @change="bigChange($event, i, '1')"
                              >大题说明</a-checkbox>
                              <a-checkbox
                                v-model="i.questionMess"
                                style="font-size: 16px;"
                                @change="bigChange($event, i, '2')"
                              >题目乱序</a-checkbox>
                              <a-checkbox
                                v-model="i.questionItemMess"
                                style="font-size: 16px;"
                                @change="bigChange($event, i, '3')"
                              >选项乱序</a-checkbox>
                            </div>
                            <div style="font-size: 18px;">
                              <!-- 删除 -->
                              <a-icon type="rest" style="padding: 0px 5px;" @click="deleteRest(index)" />
                              <a-icon type="arrow-up" style="padding: 0px 5px;" @click="arrowUp(index)" />
                              <a-icon type="arrow-down" style="padding: 0px 5px;" @click="arrowDown(index)" />
                            </div>
                          </div>
                        </div>
                        <!-- 折叠面板boby -->
                        <div class="collapse-boby">
                          <div v-if="i.explainShow == 1" class="colboby-top">
                            <a-textarea
                              v-model="i.bigExplain"
                              autosize
                              class="title"
                              placeholder="大题说明，点此编辑"
                            />
                          </div>
                          <div class="colboby-center">
                            <div v-if="i.smallQuestionCount <= 0" style="padding: 50px;">请为当前大题添加题目</div>
                            <div v-for="(small, smallIndex) in i.smallList" v-else :key="small._flagiId">
                              <big-title
                                :id="`${index}-${smallIndex}`"
                                ref="bigTitle"
                                :up-data="small"
                                :big-list="i"
                                :up-index="smallIndex"
                                :up-id="small._flagiId"
                                @moveUp="moveUp($event, i)"
                                @moveDown="moveDown($event, i)"
                                @deleteAll="deleteAll($event, i)"
                                @fracChange="fracChange"
                              />
                            </div>
                          </div>
                          <div class="colboby-foot">
                            <a-popover>
                              <template slot="content">
                                <p class="addtype" @click="handle(index, i.name)">手动选题</p>
                                <!-- <p class="addtype" @click="fixedSelect(index)">固定选题</p> -->
                                <p class="addtype" @click="fixedSelect(index, i.name)">随机选题</p>
                              </template>
                              <a-button
                                type="primary"
                                icon="plus-circle"
                                style="margin-right: 10px;"
                              >添加题目</a-button>
                            </a-popover>
                          </div>
                        </div>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                  <!-- <div class="warp-foot" style="margin-top: -45px;">
                  <a-icon type="plus-circle" theme="filled" />
                  <span style="margin-left: 5px;" @click="addTest">新增题型</span>
                </div> -->
                </a-layout-content>
              </a-layout>
            </a-layout>
          </div>
        </a-form-item>
      </a-form>
      <!-- <enter-form ref="enterForm" /> -->
      <fixed-select ref="fixedSelect" :question-list="questionList" @ok="fixedCall" />
      <hand-select ref="handSelect" @ok="handCall" />
      <batch-fraction ref="batchFraction" @ok="batchCallBack" />
    </a-spin>
  </div>
</template>
<script>
import { getAction, httpAction } from '@/api/manage'
import { multiplication } from './modal/data'
import BigTitle from './modules/BigTitle'
// import EnterForm from './modules/EnterForm'
import FixedSelect from './modules/FixedSelect'
import HandSelect from './modules/HandSelect'
import BatchFraction from './modules/BatchFraction'
export default {
  name: 'AAA',
  components: { FixedSelect, HandSelect, BigTitle, BatchFraction },
  data() {
    return {
      title: '创建试卷',
      loading: true,
      model: {
        type: 1,
        bigQuestionCount: 1,
        suggestTime: '90',
        bigList: [
          {
            bigExplain: '',
            explainShow: 0,
            id: '',
            // name: '',
            paperId: '',
            questionItemMess: 0,
            questionMess: 0,
            score: '',
            smallList: [],
            smallQuestionCount: 0,
            sort: ''
          }
        ]
      },
      // 试题分类节点树
      checkedKeys: [],
      expandedKeys: [],
      selectedKeys: [],
      paperList: [], // 试卷分类
      questionList: '', // 节点树数据
      categoryId: '',
      checkOptions: [
        { label: '线下作答', value: '1' },
        { label: '音视频播放限制', value: '2' },
        { label: '单体限制时长', value: '3' }
      ],
      dataType: [
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
      ],
      questionItemMess: '',
      questionId: '',
      fixedCategoryId: []
    }
  },
  created() {
    this.getPaper()
    this.getQuestion()
    const middleData = this.$route.query
    if (middleData.id) {
      this.title = '编辑试卷'
      getAction('/tExamPaper/tExamPaper/queryById', { id: middleData.id })
        .then(res => {
          console.log('试卷111', res)
          if (res.success) {
            this.model = res.result
            this.model.bigList.forEach(item => {
              item.smallList = item.questionList.map((item, index) => {
                item.questionId = item.id
                item._flagiId = this.$utils.guid()
                return item
              })
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    } else {
      this.loading = false
    }
  },
  methods: {
    clickLeftItem(id) {
      const anchorElement = document.getElementById(id)
      const scrollPosition = anchorElement.offsetTop
      const myElement = document.getElementById('layoutRight')
      myElement.scrollTo({
        left: 0,
        top: scrollPosition - 180,
        behavior: 'smooth'
      })
    },
    // 获取试卷分类节点树
    getPaper() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 }).then(res => {
        if (res.success) {
          const result = res.result
          this.paperList = result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取试题分类节点树
    getQuestion() {
      getAction('sys/category/rootListWithOutPrc', { type: 1, pageSize: 500 }).then(res => {
        if (res.success) {
          const result = res.result
          // this.questionList = []
          // result.map(item => {
          //   if (item.title == '大比武') {
          //     // item.disabled = true
          //     this.questionList.push(item)
          //   }
          //   // return item
          // })
          this.questionList = result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 只折叠头部箭头
    handleClick(event) {
      event.stopPropagation()
    },
    // 获取已选题目的id
    getQuestId() {
      let questionId = ''
      const list = this.model.bigList
      // 只有一个大题的时候
      if (list.length == 1) {
        questionId = list[0].smallList
          .map(item => {
            return item.questionId
          })
          .join(',')
      } else {
        const questionId1 = []
        for (const i in list) {
          if (list[i].smallList.length > 0) {
            const smallId = list[i].smallList.map(item => {
              return item.questionId
            })
            questionId1.push(smallId)
          }
        }
        questionId = questionId1.map(item => item.toString()).join(',')
      }
      this.$forceUpdate()
      return questionId
      // console.log('已选试题id', this.questionId)
    },
    // 新增题型
    addTest() {
      this.model.bigList.push({
        bigExplain: '',
        explainShow: 0,
        id: '',
        // name: '',
        paperId: '',
        questionItemMess: 0,
        questionMess: 0,
        score: '',
        smallList: [],
        smallQuestionCount: 0,
        sort: ''
      })
      this.model.bigQuestionCount = this.model.bigList.length
    },
    // 删除大题
    deleteRest(val) {
      const that = this
      this.$confirm({
        title: '确认移除已添加的大题？',
        content: '',
        onOk() {
          for (let i = 0; i < that.model.bigList.length; i++) {
            if (i === val) {
              that.model.bigList.splice(val, 1)
            }
          }
          that.model.bigQuestionCount = that.model.bigList.length
          // 计算总的小题
          that.countSmallNum()
          // 计算总分
          that.countTotalscore()
        },
        onCancel() {}
      })
    },
    // 大提位置上移
    arrowUp(index) {
      let arr = []
      // const list = this.model.bigList
      if (index > 0) {
        arr = this.model.bigList[index - 1]
        this.model.bigList[index - 1] = this.model.bigList[index]
        this.model.bigList[index] = arr
        for (let i = 0; i < this.model.bigList.length; i++) {
          this.model.bigList[i].sort = i + 1
        }
      }
      this.$forceUpdate()
    },
    // 大提位置上移
    arrowDown(index) {
      let arr = []
      if (index < this.model.bigList.length - 1) {
        arr = this.model.bigList[index + 1]
        this.model.bigList[index + 1] = this.model.bigList[index]
        this.model.bigList[index] = arr
        for (let i = 0; i < this.model.bigList.length; i++) {
          this.model.bigList[i].sort = i + 1
        }
      }
      this.$forceUpdate()
    },
    // 固定选题/随机选题
    fixedSelect(index, name) {
      if (!name) {
        this.$message.warning('请先选择试题类型')
        return false
      }
      this.questionId = this.getQuestId()
      this.$forceUpdate()
      // this.$nextTick(() => {
      this.$refs.fixedSelect.showModal(index, name, this.questionId, this.fixedCategoryId)
      this.$refs.fixedSelect.title = '随机抽题'
      this.$refs.fixedSelect.okText = '开始抽题'
      this.$forceUpdate()
      // })
    },
    // 手动选题
    handle(index, name) {
      if (!name) {
        this.$message.warning('请先选择试题类型')
        return false
      }
      this.questionId = this.getQuestId()
      this.$forceUpdate()
      // this.$nextTick(() => {
      this.$refs.handSelect.showModal(index, this.questionId, name, this.fixedCategoryId)
      // })
    },
    // 题目数据整合
    integration(val, upIndex) {
      this.model.bigList[upIndex].smallList = [...this.model.bigList[upIndex].smallList, ...val]
      this.model.bigList[upIndex].smallList = this.model.bigList[upIndex].smallList.map((item, index) => {
        item.questionId = item.id
        // item.id = ''
        item.sort = index + 1
        item._flagiId = this.$utils.guid()
        return item
      })
      this.$forceUpdate()
    },
    // 固定抽题、随机抽题获取值
    fixedCall(val, upIndex, isRepeatExtract, categoryId) {
      // 获取已有的id
      this.integration(val, upIndex)
      if (this.model.bigList[upIndex].smallQuestionCount == 0) {
        this.model.bigList[upIndex].smallQuestionCount = val.length
      } else {
        this.model.bigList[upIndex].smallQuestionCount = this.model.bigList[upIndex].smallQuestionCount + val.length
      }
      this.model.isRepeatExtract = isRepeatExtract
      this.fixedCategoryId = categoryId
      this.countSmallNum()
    },
    // 手动抽题获取值
    handCall(val, upIndex, categoryId) {
      this.integration(val, upIndex)
      if (this.model.bigList[upIndex].smallQuestionCount == 0) {
        this.model.bigList[upIndex].smallQuestionCount = val.length
      } else {
        this.model.bigList[upIndex].smallQuestionCount = this.model.bigList[upIndex].smallQuestionCount + val.length
      }
      this.fixedCategoryId = categoryId
      this.countSmallNum()
    },
    // 删除小题题目
    deleteAll(id, data) {
      for (const j in data.smallList) {
        if (id == data.smallList[j]._flagiId) {
          data.smallList.splice(j, 1)
        }
      }
      // 重置选项答案
      for (const j in data.smallList) {
        this.$refs.bigTitle[j].upData = data.smallList[j]
      }
      // 计算小题数量
      this.countSmallNum()
      // 计算每一题的总分
      const list = this.model.bigList
      list.forEach(item => {
        let sum = 0
        for (let i = 0; i < item.smallList.length; i++) {
          sum = sum + Number(item.smallList[i].score)
        }
        item.score = sum
      })
      // 计算总分
      this.countTotalscore()
    },
    // 复选框勾选
    bigChange(e, data, val) {
      if (e.target.checked == false) {
        if (val == 1) {
          data.explainShow = 0
        } else if (val == 2) {
          data.questionMess = 0
        } else if (val == 3) {
          data.questionItemMess = 0
        }
      } else {
        if (val == 1) {
          data.explainShow = 1
        } else if (val == 2) {
          data.questionMess = 1
        } else if (val == 3) {
          data.questionItemMess = 1
        }
      }
    },
    // 位置互换
    // 分数变化
    fracChange(val, data, index) {
      // 给大题列表赋值
      data.smallList[index] = val
      // 计算每一大题的总分
      const arr = data.smallList.map(item => {
        return item.score
      })
      if (arr.length == 1) {
        data.score = Number(arr[0])
      } else if (arr.length > 1) {
        data.score = 0
        for (let i = 0; i < arr.length; i++) {
          data.score = data.score + Number(arr[i])
        }
      }
      this.$forceUpdate()
      this.countTotalscore()
    },
    // 批量设置分数
    batchCallBack(val) {
      const list = this.model.bigList
      list.map((item, index) => {
        // 给每一大题总分赋值
        const numSamll = item.smallList.length
        // 总分 *数量 =
        if (val[index].score) {
          const oneScore = multiplication(Number(val[index].score), Number(numSamll))
          item.score = oneScore
          item.smallList.map(i => {
            i.score = val[index].score
            return i
          })
        }
        return item
      })
      this.countTotalscore()
    },
    // 计算试卷总分
    countTotalscore() {
      const list = this.model.bigList
      const brr = list.map(item => {
        return item.score
      })
      if (brr.length == 1) {
        this.model.score = Number(brr[0])
      } else if (brr.length > 1) {
        let sum = 0
        for (let i = 0; i < brr.length; i++) {
          sum = sum + Number(brr[i])
        }
        this.model.score = sum
      }
      this.$forceUpdate()
    },
    // 计算总的小题数量
    countSmallNum() {
      const list = this.model.bigList
      if (list.length == 1) {
        list[0].smallQuestionCount = list[0].smallList.length
        this.model.smallQuestionCount = list[0].smallQuestionCount
      } else if (list.length > 1) {
        this.model.smallQuestionCount = 0
        for (let i = 0; i < list.length; i++) {
          list[i].smallQuestionCount = list[i].smallList.length
          this.model.smallQuestionCount = this.model.smallQuestionCount + Number(list[i].smallQuestionCount)
        }
      }
    },
    // 树选择
    onSelect(selectedKeys) {
      this.model.categoryId = selectedKeys[0]
      this.selectedKeys = selectedKeys
    },
    // 位置上移
    moveUp(index, data) {
      let arr = []
      if (index > 0) {
        arr = data.smallList[index - 1]
        data.smallList[index - 1] = data.smallList[index]
        data.smallList[index] = arr
        for (let i = 0; i < data.smallList.length; i++) {
          data.smallList[i].sort = i + 1
        }
      }
      this.$forceUpdate()
    },
    // 位置下移
    moveDown(index, data) {
      let arr = []
      if (index < data.smallList.length - 1) {
        arr = data.smallList[index + 1]
        data.smallList[index + 1] = data.smallList[index]
        data.smallList[index] = arr
        for (let i = 0; i < data.smallList.length; i++) {
          data.smallList[i].sort = i + 1
        }
      }

      this.$forceUpdate()
    },
    // 保存
    submit() {
      // for (const i in this.model.bigList) {
      //   this.model.bigList[i].smallList = this.model.bigList[i].smallList.map((item, index) => {
      //     item.questionId = item.id
      //     // item.id = ''
      //     return item
      //   })
      // }
      const nameNo = this.model.bigList.find(item => !item.name)
      if (nameNo) {
        this.$message.warning('请输入大题题目')
        return
      }
      this.loading = true
      const params = {
        ...this.model
      }
      let url = ''
      let method = ''
      if (!this.model.id) {
        (url = '/tExamPaper/tExamPaper/add'), (method = 'post')
      } else {
        (url = '/tExamPaper/tExamPaper/edit'), (method = 'put')
      }
      httpAction(url, params, method)
        .then(res => {
          console.log(res)
          if (res.success) {
            this.$message.success(res.message)
            this.$router.push('/ksgl/sjgl')
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 下一步
    nextClick() {
      const record = {
        type: '2'
      }
      this.$router.push({
        name: 'ksgl-cjks',
        query: { ...record }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// 顶部样式
.header-paper {
  display: flex;
  background: #f7f8fa;
  height: 69px;
  padding: 20px 30px 21px;
  border-bottom: 1px solid #dcdfe6;
  .title {
    width: 100%;
    font-size: 20px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #27274a;
    line-height: 28px;
  }
}
//
// layout布局头部样式
.title-class {
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  .title-left {
    font-size: 24px;
    text-align: left;
    height: 50px;
    width: 500px;
    padding-left: 20px;
    border: none;
    border-radius: 0px;
  }
  .title-right {
    font-size: 16px;
    text-align: right;
    line-height: 70px;
    // padding-right: 20px;
  }
  .bottom-left {
    padding: 9px 45px;
    font-size: 18px;
    display: flex;
  }
  .bottom-button {
    display: flex;
    justify-content: space-around;
    width: 10%;
  }
}
// 右侧样式
.wrap {
  margin-top: 20px;
  height: calc(100% - 220px);
  .warrp {
    height: auto;
    min-height: 220px;
    .warp-top {
      padding: 16px 20px 0;
      font-size: 16px;
      font-weight: 400;
      text-align: left;
      color: #1a8cfe;
      line-height: 20px;
      cursor: pointer;
    }
    .warp-center {
      position: relative;
      width: 100%;
      padding: 0 20px;
      max-height: calc(100% - 86px);
      //overflow-y: scroll;
      .center-outline {
        border-bottom: 1px solid #ebeef6;
        text-align: left;
        padding: 10px 0;
        .center-outline-title {
          margin-top: 10px;
          font-size: 18px;
          color: #3a3e51;
          font-weight: 500;
          line-height: 34px;
          word-wrap: break-word;
        }
        .center-fract {
          display: flex;
          flex-wrap: wrap;
          .center-fract-title {
            border: 1px solid #efe9e9;
            padding: 14px;
            width: 0;
            align-items: center;
            height: 0;
            display: flex;
            justify-content: center;
            text-align: center;
            margin-right: 5px;
            margin-top: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.warp-foot {
  text-align: left;
  padding-left: 18px;
  font-size: 20px;
  color: #1a8cfe;
  cursor: pointer;
}
// 左侧内容区域
.collapse-all {
  background-color: #fff;
  border-radius: 0;
  .collapse-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .collapse-top {
      font-size: 24px;
      text-align: left;
      height: 50px;
      width: 500px;
      padding-left: 20px;
      border: none;
      border-radius: 0px;
    }
  }
  .collapse-boby {
    border-top: 1px solid #ccc;
    padding: 30px;
    .colboby-top {
      width: 100%;
      border-bottom: 1px solid #ccc;
      padding-bottom: 20px;
      margin-bottom: 20px;
      .title {
        width: 100%;
        border-bottom: 1px solid #ccc;
        padding-bottom: 20px;
      }
    }
    .colboby-center {
      /* max-height: 300px; */
      /* overflow-y: scroll; */
      width: 100%;
      // padding: 50px;
      font-size: 16px;
      border-bottom: 1px dashed #ccc;
      margin-bottom: 30px;
    }
  }
  .colboby-foot {
    float: left;
  }
}
// layout布局
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header {
  height: 140px;
  background: #ffffff;
  margin-top: 15px;
  margin-bottom: 15px;
}
#components-layout-demo-basic .ant-layout-sider {
  flex: 0 0 400px !important;
  max-width: 400px !important;
  min-width: 400px !important;
  width: 400px !important;
  background: #ffffff;
  // line-height: 120px;
  // margin-top: 20px;
  height: calc(100% - 70px);
  margin-right: 30px;
}
#components-layout-demo-basic .ant-layout-content {
  min-height: 120px;
  line-height: 120px;
}
//#components-layout-demo-basic > .ant-layout {
//  margin-bottom: 48px;
//}
.addtype:hover {
  color: #40a9ff;
}
/deep/ .ant-popover-buttons button {
  margin-left: 47px;
}
</style>
