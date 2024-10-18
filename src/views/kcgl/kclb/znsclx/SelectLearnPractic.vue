<template>
  <a-modal
    :width="1200"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <template slot="title">
      <div style="width: 98%;display: flex;justify-content: space-between;align-items: center;">
        <span>选择每日学练</span>
        <a-button style="background-color: #FEF2EC;color: #FE8545;border: 1px solid #FFE7DA;">注：不可选择智能生成的每日学练/考试</a-button>
      </div>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="每日学练名称">
          <a-input v-model.trim="queryParam.prop1" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="练习分类">
          <a-tree-select
            v-model.trim="queryParam.prop2"
            :tree-data="sysDepartTree"
            style="width: 200px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择"
            allow-clear
            tree-default-expand-all
            tree-node-filter-prop="title"
          />
        </a-form-item>
        <a-form-item label="推送开始日期">
          <a-date-picker v-model.trim="queryParam.prop3" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop4" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
        </a-form-item>
        <a-form-item label="推送结束日期">
          <a-date-picker v-model.trim="queryParam.prop5" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop6" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="empty-tip">
        <div class="tip">暂无可选每日学练</div>
        <div class="tip-jump">
          请
          <a href="#">点击此处前往线下每日学练管理页面</a>
          编辑现有每日学练或创建每日学练
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      loading: false,
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      readOnly: false,
      queryParam: {
        prop2: ''
      },
      sysDepartTree: [
        {
          title: '练习分类',
          value: '0-0',
          key: '0-0'
        }]
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$confirm({
        title: '请确认是否提交',
        onOk: () => {
          const httpurl = ''
          that.confirmLoading = true
          this.getAction(httpurl,)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                this.visible = false
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
        <style scoped lang="less">
        .empty-tip{
            text-align: center;
            padding-top: 150px;
            padding-bottom: 150px;
            line-height: 30px;
            font-size: 18px;
            color: #6d717c;
        }
        </style>

