<template>
    <a-modal
    centered
    title="盲样考核信息添加"
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
    </a-modal>
</template>
<script>
export default {
    data(){
        return{
            visible:false,
        }
    },
    methods:{
        showModal(){
            this.visible=true
        }
    }
}
</script>
<style lang="less" scoped>

</style>
