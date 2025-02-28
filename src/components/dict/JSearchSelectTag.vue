<template>

  <a-select
    v-if="async"
    v-model="selectedAsyncValue"
    v-bind="$attrs"
    show-search
    label-in-value
    :disabled="disabled"
    :get-popup-container="getParentContainer"
    :placeholder="placeholder"
    style="width: 100%"
    :filter-option="false"
    allow-clear
    :not-found-content="loading ? undefined : null"
    :mode="mode"
    :dropdown-match-select-width="false"
    @search="loadData"
    @change="handleAsyncChange"
  >
    <a-spin v-if="loading" slot="notFoundContent" size="small" />
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>

  <a-select
    v-else
    v-model="selectedValue"
    v-bind="$attrs"
    :get-popup-container="getParentContainer"
    show-search
    :dropdown-match-select-width="false"
    :disabled="disabled"
    :placeholder="placeholder"
    option-filter-prop="children"
    :filter-option="filterOption"
    allow-clear
    :not-found-content="loading ? undefined : null"
    :mode="mode"
    @change="handleChange"
  >
    <a-spin v-if="loading" slot="notFoundContent" size="small" />
    <a-select-option v-for="d in options" :key="d.value" :value="d.value" :disabled="d.disabled">{{ d.text ||d.label }}</a-select-option>
  </a-select>

</template>

<script>
import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/api'
import debounce from 'lodash/debounce'
import { getAction } from '../../api/manage'
// import { getEnterpriseList } from '@api/custom'

export default {
  name: 'JSearchSelectTag',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    disabled: Boolean,
    value: [String, Number],
    dictOptions: Array,
    async: Boolean,
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    },
    dict: {
      type: String,
      default: '',
      required: false
    },
    popContainer: {
      type: String,
      default: '',
      required: false
    },
    pageSize: {
      type: Number,
      default: 10,
      required: false
    },
    getPopupContainer: {
      type: Function,
      default: null
    },
    mode: {
      type: String,
      default: ''
    },
    hasDelFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    this.loadData = debounce(this.loadData, 800)// 消抖
    this.lastLoad = 0
    return {
      loading: false,
      selectedValue: [],
      selectedAsyncValue: [],
      options: []
    }
  },
  watch: {
    'value': {
      immediate: true,
      handler(val) {
        if (!val) {
          if (val == 0) {
            this.initSelectValue()
          } else {
            this.selectedValue = []
            this.selectedAsyncValue = []
          }
        } else {
          this.initSelectValue()
        }
      }
    },
    'dict': {
      handler() {
        this.initDictData()
      }
    },
    'dictOptions': {
      deep: true,
      handler(val) {
        if (val && val.length > 0) {
          this.options = [...val]
        }
      }
    }
  },
  created() {
    this.initDictData()
  },
  methods: {
    initSelectValue() {
      if (this.async) {
        if (!this.selectedAsyncValue || !this.selectedAsyncValue.key || this.selectedAsyncValue.key != this.value) {
          console.log('这才请求后台')
          // update-begin-author:taoyan date:20220112 for: 方法initSelectValue 根据下拉框实际值查询下拉框的显示的文本 因后台接口只处理3个参数，所以将过滤条件去掉
          // TODO 隐患 查询效率问题 还是应该在后台作筛选
          let itemDictStr = this.dict
          const arr = itemDictStr.split(',')
          if (arr && arr.length == 4) {
            // 删除最后一个元素
            arr.pop()
            itemDictStr = arr.join(',')
          }
          // update-end-author:taoyan date:20220112 for: 方法initSelectValue 根据下拉框实际值查询下拉框的显示的文本 因后台接口只处理3个参数，所以将过滤条件去掉
          getAction(`/sys/dict/loadDictItem/${itemDictStr}`, { key: this.value }).then(res => {
            if (res.success) {
              // update-begin---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
              // 判断是否多选
              if (this.mode === 'multiple') {
                if (res.result && res.result.length > 0) {
                  const itemArray = []
                  const valueArray = this.value.split(',')
                  for (let i = 0; i < res.result.length; i++) {
                    itemArray.push({
                      key: valueArray[i],
                      label: res.result[i]
                    })
                  }
                  this.selectedAsyncValue = itemArray
                } else {
                  this.selectedAsyncValue = []
                  this.selectedValue = []
                }
              } else {
                const obj = {
                  key: this.value,
                  label: res.result
                }
                this.selectedAsyncValue = { ...obj }
              }
              // update-end---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选--------------
            }
          })
        }
      } else {
        // update-begin---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
        // 判断是否为多选
        if (this.mode === 'multiple') {
          if (this.value) {
            this.selectedValue = this.value.split(',')
          } else {
            this.selectedValue = []
          }
        } else {
          this.selectedValue = this.value.toString()
        }
        // update-end---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
      }
    },
    loadData(value) {
      console.log('数据加载', value)
      this.lastLoad += 1
      const currentLoad = this.lastLoad
      this.options = []
      this.loading = true
      // 字典code格式：table,text,code
      getAction(`/sys/dict/loadDict/${this.dict}`, { keyword: value, pageSize: this.pageSize }).then(res => {
        this.loading = false
        if (res.success) {
          if (currentLoad != this.lastLoad) {
            return
          }
          this.options = res.result
          console.log('我是第一个', res)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    initDictData() {
      // if (this.dict && this.dict.split(',')[0] === 'base_enterprise') {
      //   getEnterpriseList().then(res => {
      //     this.options = res.result.records.map(i => ({ value: i.id, label: i.enterpriseName, text: i.enterpriseName }))
      //   })
      //   return
      // }
      if (!this.async) {
        // 如果字典项集合有数据
        if (this.dictOptions && this.dictOptions.length > 0) {
          this.options = [...this.dictOptions]
        } else {
          // 根据字典Code, 初始化字典数组
          let dictStr = ''
          if (this.dict) {
            const arr = this.dict.split(',')
            if (arr[0].indexOf('where') > 0) {
              const tbInfo = arr[0].split('where')
              dictStr = tbInfo[0].trim() + ',' + arr[1] + ',' + arr[2] + ',' + encodeURIComponent(tbInfo[1])
            } else {
              dictStr = this.dict
            }
            if (this.hasDelFlag === true && this.dict) {
              const params = dictStr.split(',')
              if (params.length === 3) {
                dictStr += ',del_flag=0'
              }
              if (params.length === 4) {
                dictStr += ' and del_flag=0'
              }
            }
            if (this.dict.indexOf(',') == -1) {
              // 优先从缓存中读取字典配置
              if (getDictItemsFromCache(this.dictCode)) {
                this.options = getDictItemsFromCache(this.dictCode)
                return
              }
            }
            ajaxGetDictItems(dictStr, null).then((res) => {
              if (res.success) {
                this.options = res.result
              }
            })
          }
        }
      } else {
        if (!this.dict) {
          console.error('搜索组件未配置字典项')
        } else {
          // 异步一开始也加载一点数据
          this.loading = true
          getAction(`/sys/dict/loadDict/${this.dict}`, { pageSize: this.pageSize, keyword: '' }).then(res => {
            this.loading = false
            if (res.success) {
              this.options = res.result
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(selectedValue) {
      console.log('selectedValue', selectedValue)
      this.selectedValue = selectedValue
      this.callback()
    },
    handleAsyncChange(selectedObj) {
      // update-begin-author:scott date:20201222 for:【搜索】搜索查询组件，删除条件，默认下拉还是上次的缓存数据，不好 JT-191
      if (selectedObj) {
        this.selectedAsyncValue = selectedObj
        // update-begin---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
        if (this.mode === 'multiple') {
          const keyArray = []
          for (let i = 0; i < selectedObj.length; i++) {
            keyArray.push(selectedObj[i].key)
          }
          this.selectedValue = keyArray
        } else {
          this.selectedValue = selectedObj.key
        }
        // update-end---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
      } else {
        this.selectedAsyncValue = null
        this.selectedValue = null
        this.options = null
        this.loadData('')
      }
      this.callback()
      // update-end-author:scott date:20201222 for:【搜索】搜索查询组件，删除条件，默认下拉还是上次的缓存数据，不好 JT-191
    },
    callback() {
      // update-begin---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
      if (this.mode === 'multiple') {
        this.$emit('change', this.selectedValue.join(','))
      } else {
        this.$emit('change', this.selectedValue)
      }
      // update-end---author:wangshuai ---date:20221115  for：[issues/4213]JSearchSelectTag改造支持多选------------
    },
    setCurrentDictOptions(dictOptions) {
      this.options = dictOptions
    },
    getCurrentDictOptions() {
      return this.options
    },
    getParentContainer(node) {
      return this.$utils.getPopupContainer(node)
      // if (typeof this.getPopupContainer === 'function') {
      //   return this.getPopupContainer(node)
      // } else if (!this.popContainer) {
      //   return node.parentNode
      // } else {
      //   return document.querySelector(this.popContainer)
      // }
    }

  }
}
</script>

<style scoped>

</style>
