<template>
  <div class="main">
    <keep-alive :include="includedComponents">
      <router-view v-if="keepAlive" />
    </keep-alive>
    <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
import Vue from 'vue'
import { CACHE_INCLUDED_ROUTES } from '@/store/mutation-types'

export default {
  name: 'RouteView',
  computed: {
    // update-begin--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
    includedComponents() {
      const includedRouters = Vue.ls.get(CACHE_INCLUDED_ROUTES)
      console.log('includedRouters：' + includedRouters)

      // 如果是缓存路由，则加入到 cache_included_routes
      if (this.$route.meta.keepAlive && this.$route.name) {
        const cacheRouterArray = Vue.ls.get(CACHE_INCLUDED_ROUTES) || []
        if (!cacheRouterArray.includes(this.$route.name)) {
          cacheRouterArray.push(this.$route.name)
          // cacheRouterArray.push("OnlCgformHeadList")
          console.log('Vue ls set componentName ：' + this.$route.name)
          Vue.ls.set(CACHE_INCLUDED_ROUTES, cacheRouterArray)
          console.log('Vue ls includedRouterArrays ：' + Vue.ls.get(CACHE_INCLUDED_ROUTES))
          return cacheRouterArray
        }
      }
      return includedRouters
    },
    // update-end--Author:scott  Date:20201015 for：路由缓存问题，关闭了tab页时再打开就不刷新 #842
    keepAlive() {
      return this.$route.meta.keepAlive
    }
  }
}
</script>
<style scoped lang='less'>
@import "~@/assets/less/custom/variables.less";

.main{
  margin-top: 10px;
  height: calc(100vh - (@headerHeight + 21px));
  overflow-y: auto;
  padding: 0 10px;
}
</style>
