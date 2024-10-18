<template>
    <a-modal
    centered
    title="批量导入题目"
    :class="$store.state.app.layout"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="关闭"
    :destroy-on-close="true"
    @ok="handleOk"
    width="1300px"
    @cancel="visible=false"
  >
  
  <batch-tabs></batch-tabs>
  </a-modal>
</template>
<script>
import BatchTabs from '../../../stgl/tjtm/BatchTabs'
export default {
    components:{BatchTabs},
    data(){
        return{
            visible:false
        }
    },
    methods:{
        showModal(){
            this.visible =true
        }
    }
}
</script>
<style lang="less" scoped>

</style>