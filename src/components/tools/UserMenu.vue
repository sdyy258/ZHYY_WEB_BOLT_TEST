<template>
  <div class="user-wrapper" style="display: flex; align-items: center">
    <!--    <header-notice class="action" />-->
    <a-dropdown style="margin-left: 5px">
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="getAvatar()" />
        <span v-if="isDesktop()" style="margin-left: 8px">{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!--        <a-menu-item key="0">-->
        <!--          <router-link :to="{ name: 'account-center' }">-->
        <!--            <a-icon type="user" />-->
        <!--            <span>个人中心</span>-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="1" @click="showUserInfo">
          <a-icon type="setting" />
          <span>账户信息</span>
        </a-menu-item>
        <a-menu-item key="2" @click="toBeautifulChina">
          <a-icon type="profile" />
          <span>美丽中国</span>
        </a-menu-item>
        <!--        <a-menu-item key="1">-->
        <!--          <router-link :to="{ name: 'account-settings-base' }">-->
        <!--            <a-icon type="setting" />-->
        <!--            <span>账户设置</span>-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-item key="3" @click="systemSetting">-->
        <!--          <a-icon type="tool" />-->
        <!--          <span>系统设置</span>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting" />
          <span>密码修改</span>
        </a-menu-item>
        <!--        <a-menu-item key="5" @click="updateCurrentDepart">-->
        <!--          <a-icon type="cluster" />-->
        <!--          <span>切换部门</span>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="6" @click="clearCache">
          <a-icon type="sync" />
          <span>清理缓存</span>
        </a-menu-item>
        <a-menu-item key="7" @click="handleLogout">
          <a-icon type="logout" />
          <span>退出登录</span>
        </a-menu-item>
        <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>
    <!--    <span class="action">-->
    <!--      <a class="logout_title" href="javascript:;" @click="handleLogout">-->
    <!--        <a-icon type="logout" />-->
    <!--        <span v-if="isDesktop()">&nbsp;退出登录</span>-->
    <!--      </a>-->
    <!--    </span>-->
    <user-password ref="userPassword" />
    <!--    <depart-select ref="departSelect" :closable="true" title="部门切换" />-->
    <!--    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置" />-->
    <user-modal ref="modalForm" />
  </div>
</template>

<script>
import HeaderNotice from '@/components/tools/HeaderNotice'
import UserPassword from '@/components/tools/UserPassword'
// import SettingDrawer from '@/components/setting/SettingDrawer'
// import DepartSelect from '@/components/tools/DepartSelect'
import { mapActions, mapGetters, mapState } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'
import { getFileAccessHttpUrl, getAction } from '@/api/manage'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import UserModal from '@/views/system/modules/UserModal'

export default {
  name: 'UserMenu',
  components: {
    HeaderNotice,
    UserPassword,
    // DepartSelect,
    // SettingDrawer,
    UserModal
  },
  mixins: [mixinDevice],
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  data() {
    return {
      // update-begin author:sunjianlei date:20200219 for: 头部菜单搜索规范命名 --------------
      searchMenuOptions: [],
      searchMenuComp: 'span',
      searchMenuVisible: false
      // update-begin author:sunjianlei date:20200219 for: 头部菜单搜索规范命名 --------------
    }
  },
  /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  created() {
    const lists = []
    this.searchMenus(lists, this.permissionMenuList)
    this.searchMenuOptions = [...lists]
  },
  mounted() {
    // 如果是单点登录模式
    if (process.env.VUE_APP_SSO == 'true') {
      const depart = this.userInfo().orgCode
      if (!depart) {
        this.updateCurrentDepart()
      }
    }
  },
  computed: {
    ...mapState({
      // 后台菜单
      permissionMenuList: (state) => state.user.permissionList
    })
  },
  /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  watch: {
    // update-begin author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框
    device: {
      immediate: true,
      handler() {
        this.searchMenuVisible = false
        this.searchMenuComp = this.isMobile() ? 'a-modal' : 'span'
      }
    }
    // update-end author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框
  },
  methods: {
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    showClick() {
      this.searchMenuVisible = true
    },
    hiddenClick() {
      this.shows = false
    },
    /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar() {
      return getFileAccessHttpUrl(this.avatar())
    },
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that.Logout({}).then(() => {
            that.$router.push({ path: '/user/login' })
            window.location.reload()
          }).catch((err) => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel() {
        }
      })
    },
    updatePassword() {
      const username = this.userInfo().username
      this.$refs.userPassword.show(username)
    },
    updateCurrentDepart() {
      this.$refs.departSelect.show()
    },
    systemSetting() {
      this.$refs.settingDrawer.showDrawer()
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    searchMenus(arr, menus) {
      for (const i of menus) {
        if (!i.hidden && i.component !== 'layouts/RouteView') {
          arr.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.searchMenus(arr, i.children)
        }
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // update_begin author:sunjianlei date:20191230 for: 解决外部链接打开失败的问题
    searchMethods(value) {
      const route = this.searchMenuOptions.filter((item) => item.id === value)[0]
      if (route.meta.internalOrExternal === true || route.component.includes('layouts/IframePageView')) {
        window.open(route.meta.url, '_blank')
      } else {
        this.$router.push({ path: route.path })
      }
      this.searchMenuVisible = false
    },
    // update_end author:sunjianlei date:20191230 for: 解决外部链接打开失败的问题
    /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    /* update_begin author:liushaoqian date:20200507 for: 刷新缓存*/
    clearCache() {
      getAction('sys/dict/refleshCache')
        .then((res) => {
          if (res.success) {
            // 重新加载缓存
            getAction('sys/dict/queryAllDictItems').then((res) => {
              if (res.success) {
                Vue.ls.remove(UI_CACHE_DB_DICT_DATA)
                Vue.ls.set(UI_CACHE_DB_DICT_DATA, res.result, 7 * 24 * 60 * 60 * 1000)
              }
            })
            this.$message.success('刷新缓存完成！')
          }
        })
        .catch((e) => {
          this.$message.warn('刷新缓存失败！')
          console.log('刷新失败', e)
        })
    },
    /* update_end author:liushaoqian date:20200507 for: 刷新缓存*/
    /**
     * 显示账户详情
     * @author nizhihao
     */
    showUserInfo() {
      const id = this.$store.getters.userInfo.id
      this.getAction('/sys/user/queryById', { id }).then(res => {
        const record = res.result
        this.$refs.modalForm.edit(record)
        this.$refs.modalForm.title = '账户信息'
        this.$refs.modalForm.disableSubmit = true
        this.$refs.modalForm.roleDisabled = true
      })
    },
    toBeautifulChina() {
      window.open('/public/beautifulChina')
    }
  }
}
</script>

<style lang="less" scoped>
/* update_begin author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
/* update-begin author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
.user-wrapper .search-input {
  width: 180px;
  color: inherit;

  /deep/ .ant-select-selection {
    background-color: inherit;
    border: 0;
    border-bottom: 1px solid white;

    &__placeholder,
    &__field__placeholder {
      color: inherit;
    }
  }
}

/* update-end author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
/* update_end author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
</style>

<style scoped>
.logout_title {
  color: inherit;
  text-decoration: none;
}
</style>
