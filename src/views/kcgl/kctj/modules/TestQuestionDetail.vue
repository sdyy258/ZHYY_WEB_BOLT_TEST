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
        <a-form-item label="试题分类">
          <j-tree-select
            ref="treeSelect"
            v-model="queryParam.categoryId"
            placeholder="请选择试题分类"
            dict="sys_category,name,id"
            pid-field="pid"
            pid-value="0"
            condition="{&quot;type&quot;:&quot;1&quot;}"
            style="maxHeight: 200p';overflow: auto;width: 160px;"
          />
        </a-form-item>
        <!-- <a-form-item label="试题难度">
          <a-select v-model.trim="queryParam.difficult" style="width: 120px" class="inputClass">
            <a-select-option :value="1">简单</a-select-option>
            <a-select-option :value="2">普通</a-select-option>
            <a-select-option :value="3">困难</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item label="创建时间">
          <a-date-picker v-model.trim="queryParam.prop3" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
          至
          <a-date-picker v-model.trim="queryParam.prop4" value-format="YYYY-MM-DD" placeholder="" :trigger-change="true" />
        </a-form-item> -->
        <a-form-item label="试题题型">
          <a-select v-model.trim="queryParam.questionType" placeholder="请选择试题题型" style="width: 150px" class="inputClass">
            <a-select-option :value="1">单选题</a-select-option>
            <a-select-option :value="2">多选题</a-select-option>
            <a-select-option :value="3">判断题</a-select-option>
            <a-select-option :value="4">填空题</a-select-option>
            <!-- <a-select-option :value="5">简答题</a-select-option>
            <a-select-option :value="6">计算题</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-model-item label="监测类别" style="flex: 1;">
          <j-dict-select-tag v-model="queryParam.monitoringCategory" :show-null-select="false" :trigger-change="true" placeholder="请选择监测类别" dict-code="monitoringCategory" />
        </a-form-model-item>
        <a-form-model-item label="科目(方法原理)" style="flex: 1;">
          <JDictSelectTag v-model="queryParam.methodPrinciple" placeholder="请选择科目(方法原理)" :show-null-select="false" dict-code="sys_post,post_name,id,del_flag=0" />
        </a-form-model-item>
        <a-form-model-item label="标准号" style="flex: 1;">
          <j-input v-model.trim="queryParam.standardNumber" placeholder="请输入标准号" />
        </a-form-model-item>
        <a-form-item label="试题内容">
          <a-input v-model.trim="queryParam.name" placeholder="请输入试题内容" />
        </a-form-item>
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <div class="tabBtn">
        <a-button @click="questionListClick">试题列表</a-button>
        <a-button style="display: flex;align-items: center;margin-left: 5px;" @click="selectedQuestionClick">已选试题<a-badge :count="count" :show-zero="true" /></a-button>
      </div>
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
        @expand="expandedChange"
      >
        <template slot="name" slot-scope="text">
          <span class="col-sql" v-html="text" />
        </template>
        <template slot="expandedRowRender" slot-scope="record">
          <div class="table-expand">
            <div class="left-content">
              <span class="title">题干</span>
              <span class="htmlStyle" v-html="record.name" />
              <div v-for="(item,index) in record.itemList" v-if="record.questionType ==1 ||record.questionType ==2 || record.questionType ==3" :key="index" class="line htmlStyle">
                <span>{{ item._option }}、<span v-html="item.item " /></span>
              </div>
            </div>
            <div class="right-content">
              <div class="line">
                <span class="title">答案</span>
                <span v-for="(i,ind) in record.itemList" :key="ind">
                  <span v-if="record.questionType ==4" style="white-space: break-spaces;margin-right: 10px;" class="htmlStyle"><span v-html="i.item +'  '" /></span>
                  <span v-if="record.questionType !=4 && i.isRight == 1" style="white-space: break-spaces;margin-right: 10px;" class="htmlStyle">{{ i._option }}、<span v-html="i.item " /></span>
                </span>
              </div>
              <div class="line">
                <span class="title">解析</span>
                <span class="htmlStyle" v-html="record.analysis" />
              </div>
              <!-- <div class="line">
                <span class="title">难度</span>
                <span>{{ record.difficult_dictText }}</span>
              </div> -->
            </div>
          </div>
        </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      loading: false,
      title: '选择试题',
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      readOnly: false,
      // 表头
      columns: [{
        title: '题型',
        align: 'center',
        dataIndex: 'questionType_dictText',
        width: 100
      },
      {
        title: '试题内容',
        align: 'center',
        dataIndex: 'name',
        ellipsis: true,
        scopedSlots: { customRender: 'name' }
      },
      {
        title: '分数',
        align: 'center',
        dataIndex: 'score',
        key: 'score',
        width: 100
      },
      // {
      //   title: '创建人',
      //   align: 'center',
      //   dataIndex: 'createBy',
      //   key: 'createBy',
      //   width: 150
      // },
      // {
      //   title: '创建时间',
      //   align: 'center',
      //   dataIndex: 'createTime',
      //   key: 'createTime',
      //   width: 150
      // }
      {
        title: '监测类别',
        align: 'center',
        dataIndex: 'monitoringCategory_dictText',
        key: 'monitoringCategory_dictText',
        ellipsis: true,
        width: 150
      },
      {
        title: '科目(方法原理)',
        align: 'center',
        dataIndex: 'methodPrinciple_dictText',
        key: 'methodPrinciple_dictText',
        width: 150,
        ellipsis: true
      },
      {
        title: '标准号',
        align: 'center',
        dataIndex: 'standardNumber',
        key: 'standardNumber',
        width: 150,
        ellipsis: true
      }
      ],
      dataSource: [],
      dataList: [],
      selectedRowKeys: [],
      selectedRows: [],
      number: null,
      count: 0,
      url: {
        list: '/tQuestion/tQuestion/list?isReview=1'
      },
      allDataSource: []
    }
  },
  created() {
    this.getAllData()
  },
  methods: {
    // 编辑进入页面
    add() {
      this.edit({})
    },
    edit(index, selectRows) {
      this.queryParam.noQuery_JD_JS = true
      this.queryParam.noQuery_STLX = true
      this.loadData()
      this.number = index
      if (selectRows) {
        this.selectedRowKeys = selectRows.map(item => {
          return item.questionId || item.id
        })
        this.selectedRows = selectRows
        this.count = this.selectedRowKeys.length
      } else {
        this.count = 0
        this.selectedRowKeys = []
        this.selectedRows = []
      }
      this.visible = true
    },
    getAllData() {
      getAction(this.url.list, { pageSize: 0x7fffffff }).then((res) => {
        if (res.success) {
          this.allDataSource = res.result.records
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 打开题目内容
    expandedChange(expanded, record) {
      if (expanded) {
        getAction('/tQuestion/tQuestion/queryById', { id: record.id }).then(res => {
          if (res.success) {
            this.dataSource.forEach((item, index) => {
              if (item.id === record.id) {
                this.dataSource[index].itemList = res.result.itemList.map((i, _index) => {
                  i._option = this.$utils.getABCD(_index)
                  i.label = i._option + '、' + i.item
                  return i
                })
              }
            })
            this.allDataSource.forEach((item, index) => {
              if (item.id === record.id) {
                this.allDataSource[index].itemList = res.result.itemList.map((i, _index) => {
                  i._option = this.$utils.getABCD(_index)
                  i.label = i._option + '、' + i.item
                  return i
                })
              }
            })
          }
        })
      }
    },
    searchQuery() {
      this.loadData(1)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = this.allDataSource.filter(item => this.selectedRowKeys.indexOf(item.id) > -1).map((res, index) => {
        res.questionId = res.id
        res.sort = index + 1
        return res
      })
      this.count = this.selectedRowKeys.length
      this.dataList = this.selectedRows
      if (selectedRowKeys.length > 0) {
        this.selectedRows.forEach(val => {
          this.expandedChange(true, val)
        })
      }
    },
    // 试题列表点击
    questionListClick() {
      this.loadData(1)
    },
    // 已选列表点击
    selectedQuestionClick() {
      this.dataSource = this.dataList
      this.ipagination.total = this.count
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$emit('ok', this.selectedRows, this.number)
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
  <style scoped lang="less">
    .tabBtn{
      margin: 10px 0;
      display: flex;
    }
    .table-expand{
        display: flex;
        justify-content: space-between;
        .left-content{
            width: 600px;
            padding-top: 15px;
            padding-bottom: 5px;
            white-space: pre-wrap;
            margin-right: 10px;
            .title{
                color: #B4B6BD;
                font-size: 12px;
                display: block;
                margin-bottom: 10px;
            }
            .line{
                margin-bottom: 10px;
            }
        }
        .right-content{
            width: calc(100% - 600px);
            padding-top: 15px;
            padding-bottom: 5px;
            white-space: pre-wrap;
            .line{
                margin-bottom: 10px;
                .title{
                    color: #b4b6bd;
                    font-size: 12px;
                    line-height: 17px;
                    padding-right: 20px;
                }
            }
        }
    }
    .col-sql {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // display: inline-block;
      width: 580px;
    }
    /deep/ .col-sql>p>img{
      width: 15%;
    }
    .htmlStyle{
      white-space: break-spaces;
      /deep/ p{
      display: inline;
      }
      /deep/ p>img{
        width: 15%;
      }
    }
    /deep/ .ant-badge{
      margin-left: 5px;
    }
  </style>

