<template>
  <div class="option-class">
    <a-radio-group
      v-for="(i,index) in determineoption"
      :key="index"
      v-model="checked"
      style="width: 95%;"
      @change="groupChange($event,index)"
    >
      <a-radio :value="i.value" class="trends-height1" style="display: flex;margin-bottom: 10px;">
        <div style="display: flex;flex: 24;flex-shrink: 0;">
          <div style="font-size: 18px;margin-right: 10px;flex: 1;line-height: 40px;">{{ i.value }}.</div>
          <div class="input-border-class">
            <span>{{ i.item }}</span>
          </div>
          <div style="clear:both;" />
        </div>
      </a-radio>
      <div style="clear:both;" />
    </a-radio-group>
    <a-divider dashed style="margin: 0; margin-top: 20px;" />
  </div>
</template>
<script>
export default {
  props: {
    radioForm: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: '',
      determineoption: [
        { index: 0, value: 'A', item: '正确', isRight: '', sort: 0 },
        { index: 1, value: 'B', item: '错误', isRight: '', sort: 1 }
      ]
    }
  },
  watch: {
    determineoption: {
      handler(val) {
        this.$emit('ok', val)
      },
      deep: true
    },
    radioForm() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const arr = ['A', 'B']
      if (this.radioForm.length > 0) {
        this.determineoption = this.radioForm.map((item, index) => {
          if (item.isRight == '1') {
            this.checked = arr[index]
          }
          const obj = {
            index: index,
            value: arr[index],
            item: item.item,
            isRight: item.isRight,
            sort: index
          }
          return obj
        })
      }
    },
    // 编辑时重置内容
    reset(val) {
      const arr = ['A', 'B']
      this.radioForm = [...val]
      this.determineoption = this.radioForm.map((item, index) => {
        if (item.isRight == '1') {
          this.checked = arr[index]
        }
        const obj = {
          index: index,
          value: arr[index],
          item: item.item,
          isRight: item.isRight,
          sort: index
        }
        return obj
      })
    },
    showModal() {
      this.checked = ''
      this.determineoption = [
        { index: 0, value: 'A', item: '正确', isRight: '', sort: 0 },
        { index: 1, value: 'B', item: '错误', isRight: '', sort: 1 }
      ]
    },
    // pressEnter(e, index) {
    //   const arrValue = e.currentTarget._value
    //   this.dataList[index].tagList.push(arrValue)
    //   this.dataList[index].keywords = ''
    // },
    // appendcheckClick() {
    //   const item = { title: '1', keywords: '', tagList: [] }
    //   var arr = ['1', '2', '3', '4', '5', '6', '7', '8']
    //   item.title = arr[this.dataList.length]
    //   this.dataList.push(item)
    // },
    groupChange(e, index) {
      this.determineoption.forEach((item, i) => {
        if (index == i) {
          item.isRight = 1
        } else {
          item.isRight = 0
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.option-class {
  flex: 24;
  height: auto;
}

.input-border-class {
  width: 1300px;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  text-align: left;
}

.input-border-class:hover {
  border: 1px solid #2f54eb;
  width: 900px;
}
.trends-height1 {
  height: 50px;
  align-items: center;
}
/deep/.ant-radio-checked::after {
  border: none;
}
</style>
