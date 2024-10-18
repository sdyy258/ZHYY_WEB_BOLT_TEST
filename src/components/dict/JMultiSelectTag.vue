<template>
  <a-checkbox-group v-if="tagType=='checkbox'" :value="arrayValue" :disabled="disabled" @change="onChange">
    <a-checkbox v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text || item.label }}</a-checkbox>
  </a-checkbox-group>

  <a-select
    v-else-if="tagType=='select'"
    :value="arrayValue"
    :disabled="disabled"
    mode="multiple"
    :placeholder="placeholder"
    :get-popup-container="getParentContainer"
    option-filter-prop="children"
    :filter-option="filterOption"
    :allow-clear="allowClear"
    :dropdown-match-select-width="false"
    @change="onChange"
    @deselect="onDeselect"
  >
    <a-select-option
      v-for="(item,index) in dictOptions"
      :key="index"
      :value="item.value"
    >
      <span style="display: inline-block;width: 100%" :title=" item.text || item.label ">
        {{ item.text || item.label }}
      </span>
    </a-select-option>
  </a-select>

</template>

<script>
import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/api'
export default {
  name: 'JMultiSelectTag',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    dictCode: String,
    placeholder: String,
    disabled: Boolean,
    value: String,
    type: String,
    options: Array,
    spliter: {
      type: String,
      required: false,
      default: ','
    },
    popContainer: {
      type: String,
      default: '',
      required: false
    },
    hasDelFlag: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dictOptions: [],
      tagType: '',
      arrayValue: !this.value ? [] : this.value.split(this.spliter)
    }
  },
  watch: {
    options: function(val) {
      this.setCurrentDictOptions(val)
    },
    dictCode: {
      immediate: true,
      handler(value) {
        this.initDictData()
      }
    },
    value(val) {
      if (!val) {
        this.arrayValue = []
      } else {
        this.arrayValue = this.value.split(this.spliter)
      }
    }
  },
  created() {
    if (!this.type || this.type === 'list_multi') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    // 获取字典数据
    // this.initDictData();
  },
  methods: {
    initDictData() {
      if (this.options && this.options.length > 0) {
        this.dictOptions = [...this.options]
      } else {
        if (!this.dictCode) {
          this.dictOptions = []
          return
        }
        // 优先从缓存中读取字典配置
        const cacheOption = getDictItemsFromCache(this.dictCode)
        if (cacheOption && cacheOption.length > 0) {
          this.dictOptions = cacheOption
          return
        }
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
        // 根据字典Code, 初始化字典数组
        ajaxGetDictItems(dictCode, null).then((res) => {
          if (res.success) {
            this.dictOptions = res.result
          }
        })
      }
    },
    onChange(selectedValue) {
      this.$emit('change', selectedValue.join(this.spliter))
    },
    onDeselect(value, option) {
      this.$emit('deselect', value, option)
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    },
    getParentContainer(node) {
      return this.$utils.getPopupContainer(node)
      // if (!this.popContainer) {
      //   return node.parentNode
      // } else {
      //   return document.querySelector(this.popContainer)
      // }
    },
    // update--begin--autor:lvdandan-----date:20201120------for：LOWCOD-1086 下拉多选框,搜索时只字典code进行搜索不能通过字典text搜索
    filterOption(input, option) {
      return option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    // update--end--autor:lvdandan-----date:20201120------for：LOWCOD-1086 下拉多选框,搜索时只字典code进行搜索不能通过字典text搜索
  }
}
</script>
