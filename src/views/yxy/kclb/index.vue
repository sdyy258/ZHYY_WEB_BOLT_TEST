<template>
  <div>
    <div style="margin:10px 0 -10px 0" class="flex justify-between">
      <a-radio-group v-model="selectValue" button-style="solid" @change="getTreeData">
        <a-radio-button value="">
          全部
        </a-radio-button>
        <a-radio-button :value="0">
          未开始
        </a-radio-button>
        <a-radio-button :value="1">
          进行中
        </a-radio-button>
        <a-radio-button :value="2">
          已完成
        </a-radio-button>
      </a-radio-group>
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="课程名称">
          <a-input v-model.trim="name" placeholder="请输入课程名称" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-card v-for="i in treeData" :key="i.value" style="margin-bottom: 15px;" v-if="treeData || treeData.length>0">
      <ItemList :key="i.value" ref="itemRef" :category="i" :course-learn-status="selectValue" :course-title="courseName" :showCollect="showCollect"/>
    </a-card>
    <a-card  style="margin-bottom: 15px;" v-if="!treeData || treeData.length == 0">
      <a-empty />
    </a-card>
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction } from '@/api/manage'
import ItemList from './components/ItemList.vue'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'yxy-kclb',
  components: { ItemList },
  mixins: [JeecgListMixin],
  props:['showCollect'],
  data() {
    return {
      disableMixinCreated: true,
      treeData: [],
      url: {
        rootListNew: '/cCourseUser/cCourseUser/rootListNew'
      },
      selectValue: '',
      name: '',
      courseName: ''
    }
  },
  created() {
    // postAction('/cCourseUser/cCourseUser/addCourseUser').then((res) => {
    //   if (res.success) {
    this.getTreeData()
    //   }
    // })
  },
  methods: {
    getTreeData() {
      this.loading = true
      getAction(this.url.rootListNew, { courseLearnStatus: this.selectValue, type: 4, pageSize: 500, courseName: this.name,isCollect:this.showCollect }).then((res) => {
        if (res.success) {
          this.treeData = res.result
          this.courseName = this.name
        }
      }).finally(() => {
        this.loading = false
      })
    },
    reset() {
      this.name = ''
      this.getTreeData()
    },
    searchQuery() {
      this.getTreeData()
      // setTimeout(() => {
      //   this.courseName = this.name
      // })
      // this.courseTitle = this.courseName
      // this.$refs.itemRef[this.selectValue].showModal()
    }
  }
}
</script>

