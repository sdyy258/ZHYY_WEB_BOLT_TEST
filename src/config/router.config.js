
/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = []

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user/login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/public/beautifulChina',
    component: () => import(/* webpackChunkName: "user" */ '@/views/public/beautifulChina')
  },
  {
    path: '/public/beautifulChina/moreList',
    component: () => import(/* webpackChunkName: "user" */ '@/views/public/beautifulChina/moreList')
  },
  {
    path: '/zxks/detail',
    component: () => import(/* webpackChunkName: "zxks" */ '@/views/zxks/zxks/detail')
  },
  {
    path: '/zxks/historyDetail',
    component: () => import(/* webpackChunkName: "zxks" */ '@/views/zxks/zxks/HistoryQuestionDetail')
  },
  {
    path: '/zxks/wrongDetail',
    component: () => import(/* webpackChunkName: "zxks" */ '@/views/zxks/zxks/WrongQuestionDetail')
  }
]
