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
        <span>选择考试</span>
        <a-button style="background-color: #FEF2EC;color: #FE8545;border: 1px solid #FFE7DA;">注：不可选择智能生成的每日学练/考试</a-button>
      </div>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="考试名称">
          <a-input v-model.trim="queryParam.prop1" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="考试分类">
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
        <a-form-item label="考试开始时间">
          <a-date-picker v-model.trim="queryParam.prop3" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop4" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
        </a-form-item>
        <a-form-item label="考试结束时间">
          <a-date-picker v-model.trim="queryParam.prop5" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop6" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        :scroll="{x:true}"
        bordered
        :row-key="(record,index)=>{return index}"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      />
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
          title: '考试分类',
          value: '0-0',
          key: '0-0',
          children: [
            {
              title: '示例',
              value: '0-0-0',
              key: '0-0-0'
            }
          ]
        }],
      // 表头
      columns: [{
        title: '考试名称',
        align: 'center',
        dataIndex: 'prop1'
      }, {
        title: '分类',
        align: 'center',
        dataIndex: 'prop2'
      }, {
        title: '总分',
        align: 'center',
        dataIndex: 'prop3'
      }, {
        title: '状态',
        align: 'center',
        dataIndex: 'prop4'
      }, {
        title: '关联项目',
        align: 'center',
        dataIndex: 'prop5'
      }, {
        title: '智能生成',
        align: 'center',
        dataIndex: 'prop6'
      }, {
        title: '开始时间',
        align: 'center',
        dataIndex: 'prop7'
      }, {
        title: '结束时间',
        align: 'center',
        dataIndex: 'prop8'
      }, {
        title: '创建人',
        align: 'center',
        dataIndex: 'prop9'
      }, {
        title: '创建时间',
        align: 'center',
        dataIndex: 'prop10'
      }],
      dataSource: [{
        prop1: '考试示例',
        prop2: '示例',
        prop3: '100',
        prop4: '正常',
        prop5: '否',
        prop6: '否',
        prop7: '2023-04-14 09:41:14',
        prop8: '2023-04-14 09:41:14',
        prop9: '公司',
        prop10: '2023-04-14 09:41:14'
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

    </style>

