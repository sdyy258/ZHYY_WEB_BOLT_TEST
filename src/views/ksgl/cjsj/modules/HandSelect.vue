<template>
  <a-modal
    centered
    title="选择试题"
    :class="$store.state.app.layout"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="loading"
    cancel-text="关闭"
    :destroy-on-close="true"
    width="1300px"
    @ok="handleOk"
    @cancel="cancel"
  >
    <div>
      <a-form layout="inline" class="search-form" @keyup.enter.native="search">
        <a-form-item label="试题分类" style="flex: 1;">
          <a-tree-select
            v-model.trim="categoryId"
            :tree-data="questionList"
            style="width: 380px"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            placeholder="请选择"
            multiple
            allow-clear
            tree-node-filter-prop="title"
            @change="categoryChange"
          />
        </a-form-item>
        <a-form-item label="试题类型" style="flex: 1;">
          <a-select v-model="queryParam.questionType" placeholder="请选择试题类型" allow-clear show-search>
            <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="监测类别" style="flex: 1;">
          <j-dict-select-tag
            v-model="queryParam.monitoringCategory"
            :show-null-select="false"
            :trigger-change="true"
            placeholder="请选择监测类别"
            dict-code="monitoringCategory"
          />
        </a-form-item>
        <a-form-item label="方法原理（岗位）" style="flex: 1;">
          <JDictSelectTag
            v-model="queryParam.methodPrinciple"
            placeholder="请选择方法原理"
            :show-null-select="false"
            dict-code="sys_post,post_name,id"
          />
        </a-form-item>
        <a-form-item label="标准号" style="flex: 1;">
          <j-input v-model.trim="queryParam.standardNumber" placeholder="请输入标准号" />
        </a-form-item>
        <a-form-item label="试题内容" style="flex: 1;">
          <j-input v-model.trim="queryParam.name" placeholder="请输入试题内容" style="width: 468px;" />
        </a-form-item>
        <!-- <a-form-item label="试题是否已使用" style="flex: 1;">
          <a-select v-model="queryParam.prop5" placeholder="请选择试题难度" allow-clear show-search>
            <a-select-option v-for="i in maskList" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item class="search-button">
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        </a-form-item>
      </a-form>
      <!-- <a-badge style="position: absolute;top: 26%;left: 15%;" :count="dataSource2.length" /> -->

      <a-tabs type="card" style="position: relative;" @change="tabChange">
        <a-tab-pane key="1" tab="试题列表">
          <a-table
            ref="table"
            size="middle"
            class="table-nowrap totalTable"
            bordered
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onSelect: onSelect,
              onSelectAll: onSelectAll,
              onChange: onSelectChange
            }"
            :columns="columns"
            :data-source="dataSource"
            row-key="id"
            :pagination="ipagination"
            :loading="loading"
            :expanded-row-keys.sync="expandedRowKeys"
            @change="handleTableChange"
            @expand="expandedChange(expandedRowKeys)"
          >
            <template slot="name" slot-scope="text" class="table-action">
              <span class="col-sql" v-html="text" />
            </template>
            <span slot="expandedRowRender" slot-scope="record">
              <div style="width: 100%;overflow: overlay;">
                <div style="padding-left: 20px;padding-right: 40px;">
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">题干</span>
                    <span class="htmlStyle" v-html="record.name" />
                  </p>
                  <p
                    v-for="(i, itemIndex) in record.itemList"
                    v-if="record.questionType == 3 || record.questionType == 1 || record.questionType == 2"
                    :key="itemIndex"
                    class="htmlStyle"
                    style="padding-left: 40px;"
                  >
                    {{ i.value }}、<span v-html="i.item" />
                  </p>
                </div>
                <div style="padding: 20px 40px 0px 20px;">
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">答案</span>
                    <span v-for="(i, itemIndex) in record.itemList" :key="itemIndex">
                      <span
                        v-if="
                          record.questionType == 4 ||
                            record.questionType == 5 ||
                            record.questionType == 6 ||
                            record.questionType == 7 ||
                            record.questionType == 8
                        "
                        style="white-space: break-spaces;"
                        class="htmlStyle"
                        ><span v-html="i.item + '  '"
                      /></span>
                      <span v-if="i.isRight == 1" style="white-space: break-spaces;">{{ i.value }} </span>
                    </span>
                    <!-- <span v-else style="white-space: break-spaces;">{{record.isRight}}</span> -->
                  </p>
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">解析</span>
                    <span class="htmlStyle" v-html="record.analysis" />
                  </p>
                </div>
              </div>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab" class="tab-title">已选试题<a-badge :count="dataSource2.length" class="tab-badge"/></span>
          <a-table
            ref="table"
            size="middle"
            class="table-nowrap totalTable"
            bordered
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onSelect: onSelect,
              onSelectAll: onSelectAll,
              onChange: onSelectChange
            }"
            :columns="columns"
            :data-source="dataSource2"
            row-key="id"
            :pagination="ipagination1"
            :loading="loading"
            :expanded-row-keys.sync="expandedRowKeys"
            @change="handleTableChange1"
            @expand="expandedChange(expandedRowKeys)"
          >
            <template slot="name" slot-scope="text" class="table-action">
              <span class="col-sql" v-html="text" />
            </template>
            <span slot="expandedRowRender" slot-scope="record">
              <div style="width: 100%;overflow: overlay;">
                <div style="padding-left: 20px;padding-right: 40px;">
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">题干</span>
                    <span class="htmlStyle" v-html="record.name" />
                  </p>
                  <p
                    v-for="(i, itemIndex) in record.itemList"
                    v-if="record.questionType == 3 || record.questionType == 1 || record.questionType == 2"
                    :key="itemIndex"
                    class="htmlStyle"
                    style="padding-left: 40px;"
                  >
                    {{ i.value }}、<span v-html="i.item" />
                  </p>
                </div>
                <div style="padding: 20px 40px 0px 20px;">
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">答案</span>
                    <span v-for="(i, itemIndex) in record.itemList" :key="itemIndex">
                      <span
                        v-if="
                          record.questionType == 4 ||
                            record.questionType == 5 ||
                            record.questionType == 6 ||
                            record.questionType == 7 ||
                            record.questionType == 8
                        "
                        style="white-space: break-spaces;"
                        class="htmlStyle"
                        ><span v-html="i.item + '  '"
                      /></span>
                      <span v-if="i.isRight == 1" style="white-space: break-spaces;">{{ i.value }} </span>
                    </span>
                    <!-- <span v-else style="white-space: break-spaces;">{{record.isRight}}</span> -->
                  </p>
                  <p>
                    <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">解析</span>
                    <span class="htmlStyle" v-html="record.analysis" />
                  </p>
                </div>
              </div>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
// import { dataType } from '../../../stgl/tkgl/dataSources'
import { getAction } from '@/api/manage'
var characterList = []
export const dataType = [
  {
    value: 1,
    text: '单选题'
  },
  {
    value: 2,
    text: '多选题'
  },
  {
    value: 3,
    text: '判断题'
  },
  {
    value: 4,
    text: '填空题'
  },
  {
    value: 5,
    text: '简答题'
  },
  {
    value: 6,
    text: '计算题'
  },
  {
    value: 7,
    text: '分析题'
  },
  {
    value: 8,
    text: '论述题'
  }
]
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      visible: false,
      tabs: '1',
      /* 分页参数 */
      ipagination1: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      columns: [
        {
          title: '题型',
          align: 'center',
          dataIndex: 'questionType_dictText',
          key: 'questionType_dictText',
          width: 50,
          ellipsis: true
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'categoryId_dictText',
          key: 'categoryId_dictText',
          width: 50,
          ellipsis: true
        },
        {
          title: '试题内容',
          align: 'center',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '分数',
          align: 'center',
          dataIndex: 'score',
          key: 'score',
          width: 50,
          ellipsis: true
        },
        {
          title: '监测类别',
          align: 'center',
          dataIndex: 'monitoringCategory_dictText',
          key: 'monitoringCategory_dictText',
          width: 100,
          ellipsis: true
        },
        {
          title: '方法原理',
          align: 'center',
          dataIndex: 'methodPrinciple_dictText',
          key: 'methodPrinciple_dictText',
          width: 100,
          ellipsis: true
        },
        {
          title: '标准号',
          align: 'center',
          dataIndex: 'standardNumber',
          key: 'standardNumber',
          width: 100,
          ellipsis: true
        }
      ],
      dataSource: [],
      dataSource2: [],
      questionList: [],
      dataType: dataType,
      expandedRowKeys: [],
      recordLength: '', // 展开题目长度
      index: '',
      selectQuestionIds: '', // 选择试题的id
      maskList: [
        { value: '1', text: '全部' },
        { value: '2', text: '已使用' },
        { value: '3', text: '未使用' }
      ],
      url: {
        list: '/tQuestion/tQuestion/list?isReview=1'
      },
      categoryId: []
    }
  },
  created() {
    this.getQuestion()
    this.character()
  },
  methods: {
    // 进入页面 需要传参走list接口
    showModal(index, questionId, name, fixedCategoryId) {
      this.visible = true
      this.categoryId = []
      this.selectQuestionIds = questionId
      this.queryParam.selectQuestionIds = questionId
      this.queryParam.noQuery_JD_JS = false
      this.queryParam.noQuery_STLX = true
      const questionType = this.$utils.getDictText(dataType, name, 'text', 'value')
      this.$set(this.queryParam, 'questionType', questionType ? parseInt(questionType) : '')
      if (fixedCategoryId.length > 0) {
        this.categoryId = fixedCategoryId
        this.queryParam.categoryId = fixedCategoryId.join(',')
      }
      this.index = index
      this.searchQuery()
    },
    // 拼接
    // connectParams(params) {
    //   params.categoryId = this.categoryId
    // },
    // 切换tab页
    tabChange(key) {
      this.tabs = key
    },
    // 获取树
    getQuestion() {
      getAction('sys/category/rootListWithOutPrc', { type: 1, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            // this.questionList = []
            // result.map(item => {
            //   if (item.title == '大比武') {
            //     // item.disabled = true
            //     this.questionList.push(item)
            //   }
            //   // return item
            // })

            this.questionList = result

            // this.categoryId = this.questionList[0].value
            // this.queryParam.categoryId = this.categoryId

            console.log('questionList', this.questionList)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    //
    character() {
      for (var i = 0; i < 26; i++) {
        characterList.push(String.fromCharCode(65 + i))
      }
    },
    // 搜索
    search() {
      this.expandedRowKeys = []
      this.recordLength = ''
      this.queryParam.selectQuestionIds = this.selectQuestionIds
      this.queryParam.noQuery_JD_JS = false
      this.queryParam.noQuery_STLX = true
      // this.searchQuery()
      this.loadData(1)
    },
    // 重置
    searchReset() {
      this.expandedRowKeys = []
      this.recordLength = ''
      this.queryParam = {}
      this.categoryId = []
      this.queryParam.noQuery_JD_JS = false
      this.queryParam.noQuery_STLX = true
      // this.queryParam.categoryId = this.categoryId
      // this.loadData(1)
      this.queryParam.selectQuestionIds = this.selectQuestionIds
      this.loadData(1)
    },
    // 打开获取题目内容
    expandedChange(record) {
      let id = ''
      if (this.recordLength < record.length) {
        id = record[record.length - 1]
        getAction('/tQuestion/tQuestion/queryById', { id: id }, 'get').then(res => {
          console.log(res, this.dataSource)
          this.dataSource.forEach((item, index) => {
            if (item.id === id) {
              const itemList = res.result.itemList
              if (res.result.questionType == 1 || res.result.questionType == 2 || res.result.questionType == 3) {
                itemList.forEach((item, index) => {
                  item.value = characterList[index]
                })
              }
              this.dataSource[index].itemList = itemList
            }
          })
          console.log(res, this.dataSource)
        })
      }
      setTimeout(() => {
        this.recordLength = record.length
      }, 100)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected === true) {
        this.dataSource2 = [...this.dataSource2, ...changeRows]
      } else {
        changeRows.map(i => {
          this.dataSource2 = this.dataSource2.filter(item => item.id !== i.id)
        })
      }
    },
    // tab1勾选多选框变化 本列表+1已选列表+1
    onSelect(selectedRowKeys, selected) {
      if (selected === true) {
        this.dataSource2.push(selectedRowKeys)
      } else {
        this.dataSource2 = this.dataSource2.filter(item => item.id !== selectedRowKeys.id)
      }
    },
    // // tab2勾选多选框变化 本列表+1已选列表+1
    // onSelect2(selectedRowKeys, selected) {
    //   this.onSelect(selectedRowKeys, selected)
    //   // this.dataSource2 = this.dataSource2.filter(item => item.id !== selectedRowKeys.id)
    // },
    handleTableChange1(pagination, filters, sorter) {
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination1 = pagination
    },
    categoryChange(value) {
      this.categoryId = value
      this.queryParam.categoryId = value
        .map(item => {
          return item
        })
        .join(',')
      // console.log('categoryId', this.categoryId)
      this.$forceUpdate()
    },
    cancel() {
      this.visible = false
      this.reset()
      this.dataSource2 = []
      this.recordLength = ''
      this.expandedRowKeys = []
    },
    handleOk() {
      if (this.dataSource2.length == 0) {
        this.$message.warning('请选择题目')
        return
      }
      const ids = this.dataSource2
        .map(item => {
          return item.id
        })
        .join(',')
      getAction('/tQuestion/tQuestion/getQuestionByIds', { ids: ids }).then(res => {
        if (res.success) {
          const result = res.result
          this.$emit('ok', result, this.index, this.categoryId)
          console.log('questionList', result)
          this.visible = false
          this.dataSource2 = []
          this.recordLength = ''
          this.expandedRowKeys = []
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tab-title {
  display: flex;
  align-items: center;
  .tab-badge {
    margin-left: 10px;
  }
}
.col-sql {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // display: inline-block;
  width: 580px;
}
/deep/ .col-sql > p > img {
  width: 15%;
}
.htmlStyle {
  white-space: break-spaces;
  /deep/ p {
    display: inline;
  }
  /deep/ p > img {
    width: 15%;
  }
}
</style>
