<template>
  <IndexComponent :key="$route.fullPath" />
</template>
<script>
import IndexComponent from './IndexComponent.vue'
export default {
  components: {
    IndexComponent
  }
}
</script>

<style scoped lang='less'>

</style>
