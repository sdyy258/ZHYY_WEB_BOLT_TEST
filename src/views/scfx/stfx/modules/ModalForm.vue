<template>
    <a-modal :title="title" :width="1300" :visible="visible" :mask-closable="false"
        cancel-text="关闭" @ok="handleOk" @cancel="visible = false" :footer="null" destroy-on-close>
            <index-modal ref="indexModal" :controlType="1" :dataList="result" :type="type" @handleOk="handleOk" @close="close"></index-modal>
    </a-modal>
</template>

<script>
    import { getAction, postAction } from '@/api/manage'
    import IndexModal from '@/views/stgl/tjtm/IndexComponent.vue'
    export default {
        components:{IndexModal},
        data() {
            return {
                loading: false,
                title: '试题添加',
                visible: false,
                result:{},
                type:''
            }
        },
        methods: {
            showModal() {
                this.visible = true
            },
            edit() {
                this.visible = true
                this.title ='试题编辑'
            },
            close() {
                this.visible = false
            },
            handleOk() {
                this.$emit('close')
                this.visible = false
            }
        }
    }
</script>
<style scoped lang="less">

</style>