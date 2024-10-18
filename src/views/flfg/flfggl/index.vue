<template>
  <div class="wrap">
    <div class="wrap-tree">
      <type-tree ref="typeTree" @ok="callBackTree" />
    </div>
    <div class="app-container">
      <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
        <a-form-item label="法律法规名称">
          <a-input v-model.trim="queryParam.lawName" placeholder="请输入法律法规名称" />
        </a-form-item>
        <a-form-item label="索引号">
          <a-input v-model.trim="queryParam.indexNumber" placeholder="请输入索引号" />
        </a-form-item>
        <a-form-item label="主题词">
          <a-input v-model.trim="queryParam.keyword" placeholder="请输入主题词" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="reset">重置</a-button>
          <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
          <a-button type="primary" icon="delete" @click="batchDel">批量删除</a-button>
        </a-form-item>
      </a-form>
      <def-columns :columns="columns" @setColumns="columns=$event" />
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        bordered
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="lawName" slot-scope="text,record">
          <div class="flex" :title="text" @click="$refs.modalDetail.showModal(record)">
            <!-- <div class="circle" /> -->
            {{ record.lawName }}
          </div>
        </span>

        <span slot="action" slot-scope="text, record" class="table-action">
          <a @click="handleEdit(record)">编辑</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <modal-form ref="modalForm" @ok="modalFormOk" />
      <modal-detail ref="modalDetail" />
    </div>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction } from '@/api/manage'
import ModalForm from './modules/ModalForm'
import ModalDetail from './modules/ModalDetail'
import TypeTree from './compents/TypeTree.vue'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'flfg-flfg',
  components: { ModalForm, ModalDetail, TypeTree },
  mixins: [JeecgListMixin],
  data() {
    return {
      // 表头
      columns: [
        // {
        //   title: '序号',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 60,
        //   align: 'center',
        //   customRender: function(t, r, index) {
        //     return parseInt(index) + 1
        //   }
        // },
        {
          title: '法律法规名称',
          align: 'center',
          dataIndex: 'lawName',
          scopedSlots: { customRender: 'lawName' },
          width: 200,
          ellipsis: true
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'categoryId_dictText',
          width: 150,
          ellipsis: true
        },
        {
          title: '索引号',
          align: 'center',
          dataIndex: 'indexNumber',
          width: 150,
          ellipsis: true
        },
        {
          title: '主题词',
          align: 'center',
          dataIndex: 'keyword',
          width: 150,
          ellipsis: true
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true
        },
        // {
        //   title: '文件地址',
        //   align: 'center',
        //   dataIndex: 'filePath'
        // },
        // {
        //   title: '内容',
        //   align: 'center',
        //   dataIndex: 'content'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          // fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width: 150,
          ellipsis: true
        }
      ],
      url: {
        list: '/baseLawRegulation/baseLawRegulation/list',
        delete: '/baseLawRegulation/baseLawRegulation/delete',
        deleteBatch: '/baseLawRegulation/baseLawRegulation/deleteBatch',
        exportXlsUrl: '/baseLawRegulation/baseLawRegulation/exportXls',
        importExcelUrl: 'baseLawRegulation/baseLawRegulation/importExcel'
      }
    }
  },
  methods: {
    // 重置
    reset() {
      this.$refs.typeTree.reset()
      this.searchReset()
    },
    // 试题分类树刷新table
    callBackTree(val) {
      this.queryParam.categoryId = val
      this.searchQuery()
    },
    // 删除
    handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          this.$refs.typeTree.reset()
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.flex{
  display: flex;
  align-items: center;
}
.wrap{
  display: flex;

  .wrap-tree{
    width: 30%;
    margin-right: 20px;
  }
  .app-container{
    width: 70%;
  }
  .circle{
    background: #9babb7;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 50%;
    line-height: 8px;
  }
}
</style>>

