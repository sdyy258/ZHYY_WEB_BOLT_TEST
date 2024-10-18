<template>
  <div
    style="width:100%;height:calc(100vh - 150px);padding: 15px;display: flex;justify-content: center;align-items: center;"
  >
    <div class="exercise">
      <div class="collect">
        <div class="collect-top">
          <a-badge :count="model.wdsc" :overflow-count="9999" show-zero :offset="[10, -5]">
            <span class="text">我的收藏</span>
          </a-badge>
        </div>
        <div class="collect-center">
          <img src="./image/wjj.png" alt="">
        </div>
        <div class="collect-bottom" @click="RandomExerciseClick(0)">
          <img src="./image/xzan.png" alt="">
          <div class="select">选择</div>
        </div>
        <div class="collect-button">
          <a-popconfirm title="确定全部清空吗?" @confirm="collectEmpty">
            <a-button type="danger">清空</a-button>
            <!-- <a style="color: #f5222d;">清空</a> -->
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div class="exercise-box">
      <div class="exerciseBoxTop" @click="specialExerciseClick(1)">
        <img src="./image/zxlxIcon.png" alt="">
        <div>
          <!-- <a-badge :count="model.zxlx" :overflow-count="9999" show-zero :offset="[10,-5]"> -->
          <span class="text">专项练习</span>
          <!-- </a-badge> -->
        </div>
      </div>
      <div class="exerciseBoxBottom" @click="RandomExerciseClick(2)">
        <img src="./image/sjlxicon.png" alt="">
        <div>
          <!-- <a-badge :count="model.sjlx" :overflow-count="9999" show-zero :offset="[10,-5]"> -->
          <span class="text">随机练习</span>
          <!-- </a-badge> -->
        </div>
      </div>
    </div>
    <div class="exercise-box2">
      <div class="exerciseBoxTop" @click="RandomExerciseClick(3)">
        <img src="./image/yztmicon.png" alt="">
        <div>
          <a-badge :count="model.yztm" :overflow-count="9999" show-zero :offset="[-2, -10]">
            <span class="text">已做题目</span>
          </a-badge>
        </div>
      </div>
      <div class="exerciseBoxBottom">
        <img src="./image/ctlxicon.png" alt="" @click="RandomExerciseClick(4)">
        <div>
          <a-badge
            :count="model.ctlx"
            :overflow-count="9999"
            show-zero
            :offset="[-2, -10]"
            @click="RandomExerciseClick(4)"
          >
            <span class="text">错题练习</span>
          </a-badge>
          <div>
            <a-popconfirm title="确定全部清空吗?" @confirm="errorEmpty">
              <a-button class="button-class" type="danger">清空</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="exercise">
      <div class="collect backwq">
        <div class="collect-top" @click="WrongQuestionClick()">
          <a-badge :count="wqConut" :overflow-count="9999" show-zero :offset="[10, -5]">
            <span class="text">大比武错题集</span>
          </a-badge>
        </div>
        <div class="collect-center" @click="WrongQuestionClick()">
          <img src="./image/wq.png" alt="" />
        </div>
        <div class="collect-button">
          <a-popconfirm title="确定全部清空吗?" @confirm="wqEmpty">
            <a-button type="danger">清空</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div> -->
    <div class="exercise-box2">
      <div class="exerciseBoxBottom">
        <img src="./image/wq.png" alt="" @click="WrongQuestionClick()">
        <div>
          <a-badge :count="wqConut" :overflow-count="9999" show-zero :offset="[-2, -10]" @click="WrongQuestionClick()">
            <span class="text">大比武错题集</span>
          </a-badge>
          <div>
            <a-popconfirm title="确定全部清空吗?" @confirm="wqEmpty">
              <a-button class="button-class" type="danger">清空</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
      <div class="exerciseBoxBottom" @click="$refs.categoryTreeModal.showModal()">
        <img src="./image/zxlxIcon.png" alt="">
        <div>
          <span class="text">大比武练习</span>
        </div>
      </div>
    </div>
    <special-exercises-detail ref="specialExercisesDetail" />
    <wrong-question-detail ref="wrongQuestionDetail" />
    <category-tree-modal ref="categoryTreeModal" />
  </div>
</template>
<script>
import { getAction, deleteAction } from '@api/manage'
import SpecialExercisesDetail from './modules/SpecialExercisesDetail.vue'
import WrongQuestionDetail from './modules/WrongQuestionDetail.vue'
import CategoryTreeModal from './modules/CategoryTreeModal'
export default {
  name: 'Index',
  components: { SpecialExercisesDetail, WrongQuestionDetail, CategoryTreeModal },
  data() {
    return {
      currentUsername: this.$store.getters.userInfo.username,
      model: {},
      url: {
        list: '/tQuestion/tQuestion/random', // 随机题目
        collectList: '/tQuestion/tQuestion/randomByStar', // 收藏题目
        doneList: '/tQuestion/tQuestion/randomByRecord', // 已做题目
        errorList: '/tQuestion/tQuestion/randomByError', // 错题
        wrongList: '/sys/category/dbwCategory' // 大比武错题集
      },
      wqConut: 0
    }
  },
  created() {
    this.getQuestionCount()
    this.getCountdbw()
  },
  methods: {
    getQuestionCount() {
      this.loading = true
      getAction('/tQuestion/tQuestion/questionCount').then(res => {
        this.loading = false
        if (res.success) {
          this.model = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    getCountdbw() {
      this.loading = true
      getAction('/tQuestion/tQuestion/questionExamErrorCount').then(res => {
        this.loading = false
        if (res.success) {
          this.wqConut = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 练习点击
    RandomExerciseClick(type) {
      let url = ''
      const params = {}
      if (type == 0) {
        url = this.url.collectList
        params.cancleNum = 0
        params.serialNumber = ''
      } else if (type == 2) {
        url = this.url.list
        params.serialNumber = 1
      } else if (type == 3) {
        url = this.url.doneList
        params.serialNumber = ''
      } else if (type == 4) {
        url = this.url.errorList
        params.cancleNum = 0
        params.serialNumber = ''
      }

      getAction(url, params).then(res => {
        this.loading = false
        if (res.success) {
          const obj = { type: type }
          this.$router.push({
            path: '/yxy/sjlx',
            query: { ...obj }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 专项练习点击
    specialExerciseClick() {
      // if (this.currentUsername == 'admin') {
      // 管理员账号不禁用
      this.$refs.specialExercisesDetail.showModal(1)
      // } else {
      //   this.$message.warning('此功能禁用！')
      // }
    },
    // 收藏清空
    collectEmpty() {
      getAction('/tQuestion/tQuestion/removeAllStar').then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getQuestionCount()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 错题清空
    errorEmpty() {
      getAction('/tQuestion/tQuestion/removeAllError').then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getQuestionCount()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    WrongQuestionClick() {
      this.$refs.wrongQuestionDetail.showModal(5)
    },
    // 大比武错题清空
    wqEmpty() {
      getAction('/tQuestion/tQuestion/removeAllExamError').then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getCountdbw()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.flex {
  display: flex;
  width: 85%;
}
.exercise {
  width: 17%;
  height: 380px;
  padding-top: 20px;
  background-color: #ecebea;
  border-radius: 10px;
  margin-right: 20px;
  .backwq {
    background-image: url(./image/wqback.png) !important;
    width: 82% !important;
    height: 93% !important;
    /* background-image: url(./image/sc.png); */
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: auto !important;
  }
  .collect {
    width: 100%;
    height: 100%;
    background-image: url(./image/sc.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .collect-top {
      width: 60%;
      height: 30%;
      border-bottom: 2px solid #f8deb0;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        font-size: 24px;
        font-weight: bold;
      }
    }
    .collect-center {
      height: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 90%;
        height: auto;
      }
    }
    .collect-bottom {
      height: 20%;
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
        height: auto;
      }
      .select {
        position: absolute;
        top: 32%;
        left: 40%;
        color: #ffffff;
        font-size: 16px;
      }
    }
    .collect-button {
      height: 22%;
      position: relative;
      cursor: pointer;
    }
  }
}
.exercise-box {
  width: 23%;
  height: 380px;
  padding: 20px 0;
  background-color: #ecebea;
  border-radius: 10px;
  margin-right: 20px;
  .exerciseBoxTop {
    width: 100%;
    height: 50%;
    background-image: url(./image/zxlx.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    padding: 20px;
    .text {
      font-size: 22px;
      font-weight: bold;
      // margin-left: 50px;
    }
  }
  .exerciseBoxBottom {
    width: 100%;
    height: 50%;
    background-image: url(./image/sjlx.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    padding: 20px;
    .text {
      font-size: 22px;
      font-weight: bold;
      // margin-left: 50px;
    }
  }
}
.exercise-box2 {
  width: 23%;
  height: 380px;
  padding: 20px 0;
  background-color: #ecebea;
  border-radius: 10px;
  margin-right: 20px;
  .exerciseBoxTop {
    width: 100%;
    height: 50%;
    background-image: url(./image/yztm.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    padding: 20px;
    .text {
      font-size: 22px;
      font-weight: bold;
      // margin-left: 50px;
    }
  }
  .exerciseBoxBottom {
    width: 100%;
    height: 50%;
    background-image: url(./image/ctlx.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
    padding: 20px;
    .text {
      font-size: 22px;
      font-weight: bold;
      // margin-left: 50px;
    }
    .button-class {
      top: 20px !important;
      left: 10% !important;
    }
  }
}
</style>
