<template>
  <a-radio-group v-if="tagType == 'radio'" :value="getValueSting" :disabled="disabled" @change="handleInput">
    <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text }}</a-radio>
  </a-radio-group>

  <a-radio-group
    v-else-if="tagType == 'radioButton'"
    button-style="solid"
    :value="getValueSting"
    :disabled="disabled"
    @change="handleInput"
  >
    <a-radio-button v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text }}</a-radio-button>
  </a-radio-group>

  <!--  <a-select v-else-if="tagType=='select'" :get-popup-container="getPopupContainer" :placeholder="placeholder" :disabled="disabled" :value="getValueSting" :allow-clear="allowClear" @change="handleInput">-->
  <a-select
    v-else-if="tagType == 'select'"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="getValueSting"
    :allow-clear="allowClear"
    :dropdown-match-select-width="false"
    :get-popup-container="getParentContainer"
    @change="handleInput"
  >
    <a-select-option v-if="showNullSelect" :value="undefined">请选择</a-select-option>
    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
      <span style="display: inline-block; width: 100%" :title="item.text || item.label">
        {{ item.text || item.label }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/api'
// import { getEnterpriseList } from '@api/custom'

export default {
  name: 'JDictSelectTag',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    dictUrl: String,
    dictCode: String,
    placeholder: String,
    disabled: Boolean,
    value: [String, Number],
    type: String,
    getPopupContainer: {
      type: Function,
      default: (node) => node.parentNode
    },
    showNullSelect: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    hasDelFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dictOptions: [],
      tagType: ''
    }
  },
  computed: {
    getValueSting() {
      // update-begin author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
      // 当有null或“” placeholder不显示
      return this.value != null ? this.value.toString() : undefined
      // update-end author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
    }
  },
  watch: {
    dictUrl: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initDictData()
        }
      }
    },
    dictCode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initDictData()
        }
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          const dictSelectItem = this.dictOptions.find((i) => i.value === val) || {}
          this.$emit('changeDictSelectItem', dictSelectItem)
          if (val && Object.keys(dictSelectItem).length === 0) {
            setTimeout(() => {
              const dictSelectItem = this.dictOptions.find((i) => i.value === val) || {}
              this.$emit('changeDictSelectItem', dictSelectItem)
            }, 1000)
          }
        } else {
          this.$emit('changeDictSelectItem', {})
        }
      }
    }
  },
  created() {
    // console.log(this.dictCode);
    if (!this.type || this.type === 'list') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    // 获取字典数据
    // this.initDictData();
  },
  methods: {
    initDictData() {
      if (!this.dictUrl && !this.dictCode) {
        this.dictOptions = []
        return
      }
      if (this.dictUrl) {
        this.getAction(this.dictUrl).then((res) => {
          this.dictOptions = res.result.records || res.result
        })
        return
      }
      // if (this.dictCode && this.dictCode.split(',')[0] === 'base_enterprise') {
      //   getEnterpriseList().then((res) => {
      //     this.dictOptions = res.result.records.map((i) => ({
      //       value: i.id,
      //       label: i.enterpriseName,
      //       text: i.enterpriseName,
      //     }))
      //   })
      //   return
      // }
      let dictCode = this.dictCode
      if (this.hasDelFlag === true && this.dictCode) {
        const params = dictCode.split(',')
        if (params.length === 3) {
          dictCode += ',del_flag=0'
        }
        if (params.length === 4) {
          dictCode += ' and del_flag=0'
        }
      }
      // 优先从缓存中读取字典配置
      if (getDictItemsFromCache(dictCode)) {
        this.dictOptions = getDictItemsFromCache(dictCode)
        return
      }

      // 根据字典Code, 初始化字典数组
      ajaxGetDictItems(dictCode, null).then((res) => {
        if (res.success) {
          //                console.log(res.result);
          this.dictOptions = res.result
        }
      })
    },
    handleInput(e = '') {
      let val
      if (Object.keys(e).includes('target')) {
        val = e.target.value
      } else {
        val = e
      }
      console.log(val)
      this.$emit('change', val === 0 ? val : val || undefined)
      // LOWCOD-2146 【菜单】数据规则，选择自定义SQL 规则值无法输入空格
      this.$emit('input', val === 0 ? val : val || undefined)
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    },
    getParentContainer(node) {
      // return this.$utils.getPopupContainer(node)
      if (typeof this.getPopupContainer === 'function') {
        return this.getPopupContainer(node)
      } else if (!this.popContainer) {
        return node.parentNode
      } else {
        return document.querySelector(this.popContainer)
      }
    }
  }
}
</script>

<style scoped></style>
