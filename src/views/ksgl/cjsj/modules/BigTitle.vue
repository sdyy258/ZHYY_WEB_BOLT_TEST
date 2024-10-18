<template>
  <div class="wrap">
    <div>
      <div class="wrap-header">
        <div class="header-left">{{ upIndex + 1 }}.<span v-html="upData.name" /></div>
        <div class="header-right">
          <a-icon type="rest" class="right-icon" @click="deleteAll(upId)" />
          <a-icon type="arrow-up" class="right-icon" @click="moveUp(upIndex)" />
          <a-icon type="arrow-down" class="right-icon" @click="moveDown(upIndex)" />
          <span>
            分数
            <a-input v-model="upData.score" type="text" class="right-input" @change="fracWatch" />
          </span>
        </div>
      </div>
      <div class="wrap-boby">
        <!-- 中间选项 -->
        <div v-for="(i, index) in upData.itemList" :key="index" class="boby-stem">
          <div
            v-if="
              upData.questionType == 1 ||
                upData.questionType == 2 ||
                upData.questionType == 3 ||
                upData.questionType == 4
            "
          >
            <span v-html="i.value" />、<span v-html="i.item" />
          </div>
        </div>
        <!-- 答案 -->
        <div class="boby-analysis">
          <div class="analysis-title">答案：</div>
          <div class="input-border-class">
            <span style="color: black;" v-html="isRight" />
          </div>
          <!-- <div v-for="i in upData.itemList" v-else :key="i" class="input-border-class">
            <span style="color: black;">{{ i.item }}</span>
          </div> -->
        </div>
        <!-- 解析 -->
        <div class="boby-analysis">
          <div class="analysis-title">解析：</div>
          <div class="input-border-class">
            <span style="color: black;" v-html="upData.analysis" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script>
var characterList = []
export default {
  props: {
    upData: {
      type: Object,
      required: true
    },
    upIndex: {
      type: Number,
      required: true
    },
    upId: {
      type: Number,
      required: true
    },
    bigList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modal: {
        name: '',
        analysis: '',
        scoringValue: 1,
        allfraction: '', // 总分数
        score: '', // 分数
        itemList: []
      },
      isRight: []
    }
  },
  created() {
    this.character()
    this.isRight = []
    if (
      this.upData.questionType == 4 ||
      this.upData.questionType == 5 ||
      this.upData.questionType == 6 ||
      this.upData.questionType == 7 ||
      this.upData.questionType == 8
    ) {
      this.upData.itemList.map(item => {
        this.isRight.push(item.item)
      })
    } else {
      this.upData.itemList.map(item => {
        if (item.isRight == 1) {
          const obj = item.value + '、' + item.item
          this.isRight.push(obj)
        }
      })
    }
    this.isRight = this.isRight
      .map(item => {
        return item
      })
      .join(' ')
    this.$emit('fracChange', this.upData, this.bigList, this.upIndex)
  },
  methods: {
    // 生成小题选项
    character() {
      for (var i = 0; i < 26; i++) {
        characterList.push(String.fromCharCode(65 + i))
      }
      this.upData.itemList.map((item, index) => {
        item.value = characterList[index]
        return item
      })
    },
    edit(val) {
      this.upData = val
      this.character()
      this.isRight = []
      if (
        this.upData.questionType == 4 ||
        this.upData.questionType == 5 ||
        this.upData.questionType == 6 ||
        this.upData.questionType == 7 ||
        this.upData.questionType == 8
      ) {
        this.upData.itemList.map(item => {
          this.isRight.push(item.item)
        })
      } else {
        this.upData.itemList.map(item => {
          if (item.isRight == 1) {
            const obj = item.value + '、' + item.item
            this.isRight.push(obj)
          }
        })
      }
      this.isRight = this.isRight
        .map(item => {
          return item
        })
        .join(' ')
    },
    // 监听分数变化计算总分数
    fracWatch(e) {
      this.$emit('fracChange', this.upData, this.bigList, this.upIndex)
    },
    // 删除本小题
    deleteAll(upId) {
      const that = this
      this.$confirm({
        title: '确认移除已添加的小题？',
        content: '',
        onOk() {
          that.$emit('deleteAll', upId)
        },
        onCancel() {}
      })
    },
    // 位置上移
    moveUp(index) {
      this.$emit('moveUp', index)
    },
    // // 位置下移
    moveDown(index) {
      this.$emit('moveDown', index)
    }
  }
}
</script>
<style lang="less" scoped>
.wrap {
  border: 1px solid #ccc;
  .wrap-header {
    padding: 16px 20px 16px 30px;
    // height: 56px;
    line-height: 24px;
    background: #f5f7fa;
    border-radius: 2px 2px 0 0;
    display: flex;
    justify-content: space-between;
    .header-left {
      width: 80%;
      font-size: 16px;
      font-weight: 500;
      color: #3a3e51;
      text-align: left;
      /deep/ p {
        display: inline;
        img {
          width: 10%;
        }
      }
    }
    .header-right {
      .right-icon {
        padding: 0px 5px;
      }
      .right-input {
        width: 50px;
        margin-left: 5px;
      }
    }
  }
  .wrap-boby {
    padding: 20px;
    .boby-stem {
      margin-bottom: 15px;
      // border-bottom: 1px dashed #ccc;
      padding-bottom: 15px;
      text-align: left;
      /deep/ p {
        display: inline;
        img {
          width: 10%;
        }
      }
    }
    .boby-analysis {
      margin-top: 10px;
    }
    .analysis-title {
      background: #ccc;
      width: 62px;
      padding: 5px 0 4px 11px;
    }
    .input-border-class {
      color: #9090a4;
      padding-left: 20px;
      line-height: 30px;
      text-align: initial;
      /deep/ p {
        display: inline;
        img {
          width: 10%;
        }
      }
    }
    .input-border-class:hover {
      border: 1px solid #2f54eb;
    }
  }
}
</style>
