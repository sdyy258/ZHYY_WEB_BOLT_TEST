import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import { VueAxios } from '@/utils/request'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less' // or 'ant-design-vue/dist/antd.less'
import '@/assets/less/custom/index.less'
import '@/permission'
import '@/utils/filter'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import config from '@/defaultSettings'
import JDictSelectTag from './components/dict/index.js'
import vueBus from '@/utils/vueBus'
import JeecgComponents from '@/components/jeecg/index'

require('@jeecg/antd-online-mini')
require('@jeecg/antd-online-mini/dist/OnlineForm.css')
import '@/components/jeecg/JVxeTable/install'
import '@/components/JVxeCells/install'
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(JDictSelectTag)
Vue.use(vueBus)
Vue.use(JeecgComponents)
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)
import { getAction, postAction, putAction, deleteAction, httpAction, postFormAction, putFormAction } from '@/api/manage'
Vue.prototype.getAction = getAction
Vue.prototype.postAction = postAction
Vue.prototype.putAction = putAction
Vue.prototype.deleteAction = deleteAction
Vue.prototype.httpAction = httpAction
Vue.prototype.postFormAction = postFormAction
Vue.prototype.putFormAction = putFormAction

import pick from 'lodash.pick'
Vue.prototype.pick = pick
import timeUtil from '@/utils/custom/timeUtil'
Vue.prototype.$time = timeUtil
import * as utils from '@/utils/custom/utils'
Vue.prototype.$utils = utils
Vue.prototype.$filterOption = utils.$filterOption
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
Vue.prototype.$getDictOption = initDictOptions
import pattern from '@/utils/custom/pattern'
Vue.prototype.pattern = pattern
import DefColumns from '@/components/custom/DefColumns'
Vue.component('DefColumns', DefColumns)
import Dict from '@/components/custom/Dict'
Vue.component('Dict', Dict)
import FullScreen from '@/components/custom/fullscreen/FullScreen'
Vue.component('FullScreen', FullScreen)
import BaiduMap from 'vue-baidu-map'
// 只使用element-ui的Tree组件，其余组件使用ant-design-vue
import { Tree } from 'element-ui'
Vue.use(Tree)
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'A6Zez5vVauoUBgqxQPsVGnpRtDbRoHC8'
})
import { isNull } from '@/utils/util'
Vue.prototype.isNull = isNull
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
import { baseURL } from '@/utils/request'
Vue.prototype.$baseUrl = baseURL
Vue.config.productionTip = false
new Vue({
  router,
  store,
  mounted() {
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  },
  render: h => h(App)
}).$mount('#app')
