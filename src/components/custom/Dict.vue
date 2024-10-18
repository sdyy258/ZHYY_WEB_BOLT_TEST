<template>
  <span>{{ $utils.getDictText(dictOptions,dictValue) }}</span>
</template>

<script>
import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/api'

export default {
  name: 'Dict',
  props: {
    dictCode: {
      type: String,
      required: true
    },
    dictValue: {
      type: [String, Number],
      required: true
    },
    hasDelFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dictOptions: []
    }
  },
  created() {
    this.initDictData()
  },
  methods: {
    initDictData() {
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
    }
  }
}
</script>

<style scoped>

</style>
