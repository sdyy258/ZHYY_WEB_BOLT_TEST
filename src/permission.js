import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ACCESS_TOKEN, INDEX_MAIN_PAGE_PATH } from '@/store/mutation-types'
import { generateIndexRouter } from '@/utils/util'
import { message } from 'ant-design-vue'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/public/beautifulChina', '/public/beautifulChina/moreList']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // if (to.path === '/ssoLogin') {
  //   Vue.ls.remove(ACCESS_TOKEN)
  //   const { username, password, hideTop } = to.query
  //   // const params = { username, password, hideTop: hideTop === '1', loginType: 'sso' }
  //   const params = {
  //     username: Buffer.from(username, 'base64').toString(),
  //     password: Buffer.from(password, 'base64').toString(),
  //     hideTop: hideTop === '1',
  //     loginType: 'sso'
  //   }
  //   store.dispatch('Login', params).then(res => {
  //     next({ path: '/' })
  //   }).catch(err => {
  //     message.error(err.message)
  //     NProgress.done()
  //   })
  //   return
  // }
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: INDEX_MAIN_PAGE_PATH })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
          const menuData = res.result.menu
          if (menuData === null || menuData === '' || menuData === undefined) {
            return
          }
          let constRoutes = []
          constRoutes = generateIndexRouter(menuData)
          // 添加主界面路由
          store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        })
          .catch(() => {
            /* notification.error({
              message: '系统提示',
              description: '请求用户信息失败，请重试！'
            })*/
            store.dispatch('Logout').then(() => {
              // next({ path: '/user/login', query: { redirect: to.fullPath }})
              next({ path: '/user/login' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      NProgress.done()
    } else {
      next({ path: '/user/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
