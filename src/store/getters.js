import Vue from 'vue'
import { USER_INFO, ENHANCE_PRE, HIDE_TOP } from '@/store/mutation-types'
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => { state.user.avatar = Vue.ls.get(USER_INFO).avatar; return state.user.avatar },
  username: state => state.user.info.username,
  nickname: state => { state.user.info.realname = Vue.ls.get(USER_INFO).realname; return state.user.info.realname },
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  // $store.getters.userInfo.userType  0、政府账号 1、企业账号
  // $store.getters.userInfo.enterpriseUserType  1管理员  2填报人员  3审核人员
  // userInfo: state => { state.user.info = (Vue.ls.get(USER_INFO) || {}); return state.user.info },
  userInfo: state => { state.user.info = (Object.assign({ roles: ['admin', 'stadmin', 'dsgly'] }, (Vue.ls.get(USER_INFO) || {}))); return state.user.info },
  addRouters: state => state.permission.addRouters,
  hideTop: state => state.user.hideTop || Vue.ls.get(HIDE_TOP),
  onlAuthFields: state => { return state.online.authFields },
  enhanceJs: (state) => (code) => {
    state.enhance.enhanceJs[code] = Vue.ls.get(ENHANCE_PRE + code)
    return state.enhance.enhanceJs[code]
  },
  sysSafeMode: state => state.user.sysSafeMode,
  isGovernment: (state, getters) => getters.userInfo.userType === 0, // 政府单位
  isEnterprise: (state, getters) => getters.userInfo.userType === 1, // 企业用户
  isEnterpriseAdmin: (state, getters) => getters.userInfo.userType === 1 && getters.userInfo.enterpriseUserType === 1, // 企业管理员
  isEnterpriseReport: (state, getters) => getters.userInfo.userType === 1 && getters.userInfo.enterpriseUserType === 2, // 企业填报人员
  isEnterpriseExamine: (state, getters) => getters.userInfo.userType === 1 && getters.userInfo.enterpriseUserType === 3// 企业审核人员
}

export default getters
