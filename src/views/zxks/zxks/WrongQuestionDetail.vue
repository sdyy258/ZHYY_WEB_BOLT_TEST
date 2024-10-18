<template>
  <div style="height:100%;background-color: #F0F2F5;">
    <a-row>
      <a-col :span="24">
        <div class="title">
          <span>第二季度综合类考试</span>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16" style="height: calc(100% - 70px);padding: 30px 130px;">
      <a-col :span="20" style="height:100%">
        <a-card v-for="(item, index) in swiperList" :key="index" style="height:calc(100% - 100px)">
          <div slot="title">
            <span v-if="item.bigSort == 1">一、{{ item.bigName }}</span>
            <span v-else-if="item.bigSort == 2">二、{{ item.bigName }}</span>
            <span v-else-if="item.bigSort == 3">三、{{ item.bigName }}</span>
            <span v-else-if="item.bigSort == 4">四、{{ item.bigName }}</span>
            <span v-else>五、{{ item.bigName }}</span>
            <span style="color:#979596;font-size: 14px;margin-left: 10px;">(共{{ item.smallQuestionCount }}小题，合计{{ item.bigScore }}分)</span>
          </div>
          <div>
            <div class="topic-content">
              <span>{{ topicIndex + 1 + '.' }}</span>
              <span>{{ item.name }}</span>
            </div>
            <!-- 单选 -->
            <div v-if="item.questionType == 1" class="answer-sheet">
              <a-radio-group class="radioGroup">
                <a-radio v-for="(res,i) in item.itemList" :key="i" :value="i + 1" disabled>
                  <span v-if="i == 0">A、{{ res.item }}</span>
                  <span v-else-if="i == 1">B、{{ res.item }}</span>
                  <span v-else-if="i == 2">C、{{ res.item }}</span>
                  <span v-else>D、{{ res.item }}</span>
                </a-radio>
              </a-radio-group>
            </div>
            <!-- 多选 -->
            <div v-else-if="item.questionType == 2" class="answer-sheet">
              <a-checkbox-group class="checkboxGroup" style="width: 100%">
                <a-checkbox v-for="(res,i) in item.itemList" :key="i" :value="i + 1" disabled>
                  <span v-if="i == 0">A、{{ res.item }}</span>
                  <span v-else-if="i == 1">B、{{ res.item }}</span>
                  <span v-else-if="i == 2">C、{{ res.item }}</span>
                  <span v-else>D、{{ res.item }}</span>
                </a-checkbox>
              </a-checkbox-group>
            </div>
            <!-- 判断 -->
            <div v-else-if="item.questionType == 3" class="answer-sheet">
              <a-radio-group class="radioGroup">
                <a-radio v-for="(res,i) in item.itemList" :key="i" :value="i + 1" disabled>
                  <span v-if="i == 0">A、{{ res.item }}</span>
                  <span v-else>B、{{ res.item }}</span>
                </a-radio>
              </a-radio-group>
            </div>
            <!-- 填空 -->
            <div v-else-if="item.questionType == 4" class="answer-sheet">
              <div v-for="(res,i) in item.itemList" :key="i" class="inputGroup">
                <a-input style="width:50%" disabled />
              </div>
            </div>
            <!-- 简答 -->
            <div v-else class="answer-sheet">
              <j-editor disabled />
            </div>
            <div class="analysis">
              <div class="analysis-row">
                <span>学员答案：{{ item.prop1 }}</span>
              </div>
              <div class="analysis-row">
                <span>正确答案：{{ item.prop2 }}</span>
              </div>
              <div class="analysis-row">
                <span>解释说明：{{ item.prop3 }}</span>
              </div>
            </div>
          </div>
        </a-card>
        <div class="panel-bottom" style="height:100px;background-color: #FAFAFA;">
          <button v-for="(res, i) in changeBtn" :key="i" :class="{ change: i + 1 == changeStatus, unchange: i + 1 != changeStatus}" @click="changeBtnClick(res.value)">{{ res.label }}</button>
        </div>
      </a-col>
      <a-col :span="4" style="height:100%">
        <div style="height:90%;" class="divClass rightBottom">
          <div class="answerSheet">答题卡</div>
          <span class="sdd-question-anchor">
            <a-tag v-for="(val,v) in dataSource" :key="v" class="exam-tag" :class="{active: v == topicIndex}" @click="pickerTopic(v)">
              {{ v + 1 }}
            </a-tag>
          </span>
        </div>
        <div style="height:calc(10% - 30px);display: flex;align-items: center;">
          <a-button type="primary" size="large" style="width:100%" @click="callBackClick">返回</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      remainTime: 0,
      changeBtn: [{
        label: '上一题',
        value: 1
      },
      {
        label: '下一题',
        value: 2
      }
      ], // 底部按钮
      changeStatus: '', // 选择上一题/下一题
      topicIndex: 0, // 题目位置
      swiperList: [], // 轮播图数据列表
      swiperIndex: 0, // 轮播图当前位置
      isChange: false, // 是否切换
      duration: 200, // 动画过渡时长
      model: {
        'bigQuestionCount': 2, // 大题数目
        'id': 'pidpidpidpidpidpid',
        'name': 'pnamepnamepname',
        'questionList': [{
          'bigId': 'bid1bid1bid1bid1bid1',
          'bigName': '单选题', // 大题题目
          'bigScore': 1, // 大题分数
          'bigSort': 1, // 答题顺序
          'difficult': 1, // 难度：1简单、2普通、3困难
          'explain': '大题说明解释解释解释解释解释', // 大题描述
          'explainShow': 1, // 是否展示大题描述：0否、1是
          'id': 'qidqidqidqidqidqid',
          'name': '根据《中华人民共和国水污染防治法》，水污染防治应当坚持的原则是', // 小题题目
          'questionType': 1, // 试题类型：1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
          'score': 1, // 小题分数
          'smallQuestionCount': 1, // 小题数目
          'prop1': 'B',
          'prop2': 'C',
          'prop3': '无',
          'itemList': [{
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '预防为主、限期治理、综合整治',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 1
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '预防为主、防治结合、限期整改',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 2
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '预防为主、防治结合、综合整治',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 3
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '预防为主、防治结合、区域限批',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 4
          }]
        },
        {
          'bigId': 'bid2bid2bid2bid2bid2',
          'bigName': '多选题',
          'bigScore': 1,
          'bigSort': 2,
          'difficult': 1,
          'explain': '大题说明222222222',
          'explainShow': 1,
          'id': 'qidqidqidqidqidqid',
          'name': '根据《中华人民共和国环境保护法》，排放污染物的企业事业单位和其他生产经营者应当采取措施，防治在生产建设或者其他活动中产生的____对环境的污染危害。',
          'questionType': 2,
          'score': 1,
          'smallQuestionCount': 1,
          'prop1': 'AB',
          'prop2': 'AC',
          'prop3': '无',
          'itemList': [{
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '废气、废水、废渣',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 1
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '粉尘、恶臭气体、电磁辐射',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 2
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '噪声、振动、放射性物质、医疗废物',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 3
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '光辐射',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 4
          }]
        },
        {
          'bigId': 'bid3bid3bid3bid3bid3',
          'bigName': '判断题',
          'bigScore': 1,
          'bigSort': 3,
          'difficult': 1,
          'explain': '大题说明222222222',
          'explainShow': 1,
          'id': 'qidqidqidqidqidqid',
          'name': '《生态环境监测网站建设方案》（国办发【2015】56号）要求：重点排污单位要按照行业主管部门要求将自行监测结果及时上传。',
          'questionType': 3,
          'score': 1,
          'smallQuestionCount': 1,
          'prop1': '正确',
          'prop2': '错误',
          'prop3': '无',
          'itemList': [{
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '正确',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 1
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '错误',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 2
          }]
        },
        {
          'bigId': 'bid4bid4bid4bid4bid4',
          'bigName': '填空题',
          'bigScore': 1,
          'bigSort': 4,
          'difficult': 1,
          'explain': '大题说明222222222',
          'explainShow': 1,
          'id': 'qidqidqidqidqidqid',
          'name': '《环境监测数据弄虚作假行为判定及处理方法》（环发【2015】175号）所称环境监测数据，系指按照相关技术规范和规定，通过手工或者自动监测方式取得的环境监测_____、____、____等信息。',
          'questionType': 4,
          'score': 1,
          'smallQuestionCount': 1,
          'prop1': '',
          'prop2': '1',
          'prop3': '无',
          'itemList': [{
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 1
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 2
          },
          {
            'id': 'iidiidiidiidiidiidiidiid',
            'item': '',
            'questionId': 'qidqidqidqidqidqid',
            'sort': 3
          }]
        },
        {
          'bigId': 'bid5bid5bid5bid5bid5',
          'bigName': '简答题',
          'bigScore': 1,
          'bigSort': 5,
          'difficult': 1,
          'explain': '大题说明222222222',
          'explainShow': 1,
          'id': 'qidqidqidqidqidqid',
          'name': '请简述《水污染防治行动计划》（国发【2015】17号）到2020年的主要指标',
          'questionType': 5,
          'score': 1,
          'smallQuestionCount': 1,
          'prop1': '',
          'prop2': '1',
          'prop3': '无',
          'itemList': []
        }],
        'score': 5, // 总分
        'suggestTime': 10// 考试时长
      },
      dataSource: []
    }
  },
  created() {
    this.dataSource = this.model.questionList
    this.remainTime = this.model.suggestTime * 60
    this.renderSwiper(0)
    // this.timeReduce()
  },
  methods: {
    changeBtnClick(val) {
      this.changeStatus = val
      this.isChange = true
      if (val === 2) {
        if (this.topicIndex + 1 === this.model.questionList.length) {
          this.$message.warning('已为最后一题，不能再点击')
          return
        }
        this.topicIndex++
      } else {
        if (this.topicIndex === 0) {
          this.$message.warning('已为第一题，不能再点击')
          return
        }
        this.topicIndex--
      }
      setTimeout(() => {
        this.renderSwiper(this.topicIndex)
      }, 10)
    },
    // 渲染 swiper
    renderSwiper(index) {
      const list = []

      list.push(this.dataSource[index])

      this.duration = 0

      setTimeout(() => {
        this.swiperList = list
        setTimeout(() => {
          this.duration = 200
        }, 100)
      }, 50)
    },
    // 选择题目
    pickerTopic(index) {
      this.topicIndex = index
      this.renderSwiper(index)
    },
    // formatSeconds(theTime) {
    //   return formatSeconds(theTime)
    // },
    // timeReduce() {
    //   const _this = this
    //   setInterval(function() {
    //     if (_this.remainTime <= 0) {
    //       this.$message.warning('请停止答题，即将交卷')
    //     } else {
    //       --_this.remainTime
    //     }
    //   }, 1000)
    // },
    // 交卷
    // handleSubmit() {
    //   // const unoption = this.dataSource.filter((item) => !item.userAnswer || item.userAnswer.length === 0)
    //   let mesag = ''
    //   // if (unoption.length > 0) {
    //   //   mesag = '还有未完成题目，确认交卷？'
    //   // } else {
    //   mesag = '请确定是否要交卷？'
    //   // }
    //   this.$confirm({
    //     title: '提示',
    //     content: mesag,
    //     okText: '确定',
    //     okType: 'danger',
    //     cancelText: '取消',
    //     onOk() {

    //     }
    //   })
    // }
    // 返回
    callBackClick() {
      this.$router.push({
        path: '/zxks/zxks'
      })
    }
  }
}
</script>
    <style scoped lang="less">
    .title{
      width: 100%;
      height: 70px;
      background-color: #1A8CFE;
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 22px;
      font-weight: bold;
      padding-left: 130px;
    }
    .topic-content{
        padding-bottom: 15px;
        font-size: 16px;
        color: #333333;
    }
    .answer-sheet{
        .radioGroup{
            display: flex;
            flex-direction: column;
        }
        .checkboxGroup{
            display: flex;
            flex-direction: column;
        }

        .inputGroup{
          margin-bottom: 15px;
        }
    }
    .analysis{
        border-radius: 4px;
        padding: 20px;
        line-height: 24px;
        margin-top: 20px;
        background: #FAFAFA;
        position: relative;
        .analysis-row{
            min-height: 30px;
            padding-right: 60px;
            position: relative;
        }
    }
    .panel-bottom{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .unchange {
            width: 200px;
            height: 40px;
            background-color: #E5F1FF;
            color: #0080ff;
            border: none;
        }
        .change {
            width: 200px;
            height: 40px;
            background-color: #0080ff;
            color: #ffffff;
            border: none;
        }
    }

    .divClass{
        background-color: #ffffff;
        margin-bottom: 10px;
        padding: 15px;
    }

    .rightBottom{
        .answerSheet{
            height: 40px;
            color: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sdd-question-anchor {
            height: calc(100% - 80px);
            padding: 15px 0px;
            display: flex;
            .exam-tag {
                margin: 0 3px 6px;
                cursor: pointer;
                width: 36px;
                height: 36px;
                text-align: center;
                border-radius: 0px;
                padding: 0px;
                display: flex;
                justify-content: center;
                align-items: center;

                &.active {
                    border: #0080ff solid 1px;
                    background-color: #ffffff;
                }
            }
        }
    }
    /deep/ .ant-card-head{
      padding: 0 60px;
    }
    /deep/ .ant-card-body{
      padding: 24px 60px;
    }
    /deep/ .ant-radio-wrapper{
        line-height: 30px;
    }
    /deep/ .ant-checkbox-wrapper{
        line-height: 30px;
    }
    /deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper{
        margin-left: 0;
    }
    </style>

