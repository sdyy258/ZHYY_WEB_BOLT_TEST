<template>
  <div>
    <!--创建考试-->
    <create-index v-if="combinationType == 1" ref="createIndex" :key="$route.fullPath" />
    <!--快速创建考试-->
    <create-indexks v-if="combinationType == 2" :key="$route.fullPath" ref="createIndexks" />
  </div>
</template>

<script>
import CreateIndex from '../cjks/index'
import CreateIndexks from '../kscj/index'
// import createIndexXx from '../xxks/index'
// import createIndexDbw from '../dbwks/index'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'ksgl-bjks',
  components: { CreateIndex, CreateIndexks },
  data() {
    return {
      combinationType: '',
    }
  },
  created() {
    this.combinationType = this.$route.query.combinationType
  },
}
</script>
