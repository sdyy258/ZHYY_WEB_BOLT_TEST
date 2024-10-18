<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="课程名称">
          <a-input v-model.trim="queryParam.prop1" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="课程分类">
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
        <a-form-item label="课程开始时间">
          <a-date-picker v-model.trim="queryParam.prop3" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop4" show-time value-format="YYYY-MM-DD HH:mm:ss" placeholder="" :trigger-change="true" />
        </a-form-item>
        <a-form-item label="课程结束时间">
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
      title: '选择课程',
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      readOnly: false,
      queryParam: {
        prop2: ''
      },
      sysDepartTree: [
        {
          title: '课程分类',
          value: '0-0',
          key: '0-0'
        }],
      // 表头
      columns: [{
        title: '课程名称',
        align: 'center',
        dataIndex: 'prop1'
      }, {
        title: '分类',
        align: 'center',
        dataIndex: 'prop2'
      }, {
        title: '状态',
        align: 'center',
        dataIndex: 'prop3'
      }, {
        title: '关联项目',
        align: 'center',
        dataIndex: 'prop4'
      }, {
        title: '开始时间',
        align: 'center',
        dataIndex: 'prop5'
      }, {
        title: '结束时间',
        align: 'center',
        dataIndex: 'prop6'
      }, {
        title: '创建人',
        align: 'center',
        dataIndex: 'prop7'
      }],
      dataSource: [{
        prop1: '如何提高客服人员的应变能力',
        prop2: '课程分类',
        prop3: '正常',
        prop4: '否',
        prop5: '2023-04-14 09:41:14',
        prop6: '2023-04-14 09:41:14',
        prop7: '公司'
      }, {
        prop1: '如何提高客服人员的应变能力',
        prop2: '课程分类',
        prop3: '正常',
        prop4: '否',
        prop5: '2023-04-14 09:41:14',
        prop6: '2023-04-14 09:41:14',
        prop7: '公司'
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

