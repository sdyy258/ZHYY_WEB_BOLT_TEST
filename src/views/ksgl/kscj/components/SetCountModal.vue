<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <template slot="footer">
      <a-button type="primary" @click="handleOk">确认</a-button>
    </template>
    <div v-if="dataSource.length>0" style="display: flex;justify-content: flex-end;margin-bottom: 10px">
      <a-button type="primary" @click="distribution">重新分配</a-button>
    </div>
    <a-table
      ref="table"
      size="middle"
      class="table-nowrap"
      :scroll="{x:true}"
      bordered
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    />
    <div v-if="dataSource.length>0" style="text-align: right">
      <span>占比总和：</span>
      <span style="font-size: 18px">{{ percentTotal }}</span>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: ['questionList', 'categoryId'],
  data() {
    return {
      title: '设置题目分类比例',
      visible: false,
      model: {},
      dataSource: [],
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
          title: '题目分类',
          align: 'center',
          dataIndex: 'id',
          customRender: text => this.$utils.getDictText(this.allList, text, 'value', 'title')
        },
        {
          title: '占比（%）',
          align: 'center',
          customRender: (text, record) => <a-input-number value={record['percent']} onChange={value => record['percent'] = value} min={0} precision={0}></a-input-number>
        }
      ]
    }
  },
  computed: {
    allList() {
      return this.$utils.getListForTree(this.questionList)
    },
    percentTotal() {
      const percentArray = this.dataSource.map(i => i.percent)
      return percentArray.reduce((accumulator, currentValue) => accumulator + (currentValue || 0), 0)
    },
    // 向后端传递参数： isSetCategoryNumber：是否设置题目数量占比，0否1是，默认为否
    isSetCategoryNumber() {
      return this.dataSource.length === 0 ? 0 : 1
    },
    // 向后端传递参数
    categoryNumberList() {
      return this.dataSource
      // return this.dataSource.map(i => {
      //   return {
      //     id: i.value,
      //     percent: i.percent
      //   }
      // })
    }
  },
  watch: {
    categoryId: {
      immediate: true,
      handler() {
        this.distribution()
      }
    }
  },
  methods: {
    // 编辑时回显设置
    setDataSource(dataSource) {
      this.$nextTick(() => {
        const list = dataSource || []
        this.dataSource = [...list]
      })
    },
    distribution() {
      const list = this.categoryId || []
      const dataSource = this.allList.filter(i => ~list.indexOf(i.value))
      const percentArray = this.$utils.distributePercentage(dataSource.length)
      this.dataSource = dataSource.map((item, index) => ({
        id: item.value,
        percent: percentArray[index]
      }))
    },
    showModal() {
      this.visible = true
    },
    handleOk() {
      if (this.dataSource.length > 0 && this.percentTotal !== 100) {
        this.$message.warning('题目分类占比之和应为100')
        return
      }
      this.visible = false
    }
  }
}
</script>

