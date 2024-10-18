<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    :footer="null"
    @cancel="visible=false"
  >
    <a-spin :spinning="confirmLoading">
      <def-columns :columns="columns" @setColumns="columns=$event" />
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        :scroll="{x:true}"
        bordered
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <!-- <span slot="avatar" slot-scope="text">
          <img :src="getImgView(text)" alt="" style="width: 100px;height: auto;">
        </span> -->
      </a-table>
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
      title: '课程评论',
      visible: false,
      confirmLoading: false,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '评论内容',
          align: 'center',
          dataIndex: 'courseComment'
        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        // {
        //   title: '头像',
        //   align: 'center',
        //   dataIndex: 'avatar',
        //   scopedSlots: { customRender: 'avatar' }
        // },
        {
          title: '小节名称',
          align: 'center',
          dataIndex: 'lessonName'
        }
      ],
      url: {
        list: '/cCourseComment/cCourseComment/list'
      }
    }
  },
  methods: {
    showModal(id) {
      this.queryParam.courseId = id
      this.loadData()
      this.visible = true
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

