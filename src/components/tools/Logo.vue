<template>
  <div class="logo">
    <router-link :to="routerLinkTo">
      <img :src="require('@/assets/img/logo.png')" style="height:33px">
      <h1 v-if="showTitle" style="font-size: 22px">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import { mixin } from '@/utils/mixin.js'

export default {
  name: 'Logo',
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: '智慧运维',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    },
    // 点击Logo跳转地址
    routerLinkTo: {
      type: Object,
      default: () => ({ name: 'dashboard' })
    }
  }
}
</script>
<style lang="less" scoped>
/*缩小首页布 局顶部的高度*/
@height: 59px;

.sider {
  box-shadow: none !important;
  .logo {
    height: @height !important;
    line-height: @height !important;
    box-shadow: none !important;
    transition: background 300ms;

    a {
      color: white;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  &.light .logo {
    background-color: @primary-color;
  }
}
</style>
