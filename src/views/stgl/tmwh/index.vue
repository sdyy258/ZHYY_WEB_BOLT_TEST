<template>
  <div class="card-module">
    <!-- 试卷分类树 -->
    <div :class="treeShow ? 'card-class' : 'card-hidden'">
      <div class="iconStyle">
        <a-icon
          :type="treeShow ? 'left-square' : 'right-square'"
          style="font-size: 24px;"
          @click="treeShow = !treeShow"
        />
        <span v-show="!treeShow" style="writing-mode: vertical-rl; transform: rotate(0deg);">分类展开</span>
      </div>
      <div v-show="treeShow" class="tree-module ">
        <question-tree ref="questionTree" :tree-type="treeType" @ok="questCallBack" />
      </div>
    </div>
    <!-- 列表搜索框重置等按钮 -->
    <div class="content-module card-class">
      <div class="top-button">
        <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
          <a-form-item label="试题类型" style="flex: 1;">
            <a-select v-model="queryParam.questionType" placeholder="请选择试题类型" allow-clear show-search>
              <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-model-item label="监测类别" style="flex: 1;">
            <j-dict-select-tag
              v-model="queryParam.monitoringCategory"
              :show-null-select="false"
              :allow-clear="true"
              :trigger-change="true"
              placeholder="请选择监测类别"
              dict-code="monitoringCategory"
            />
          </a-form-model-item>
          <a-form-model-item label="科目方法" style="flex: 1;">
            <JDictSelectTag
              v-model="queryParam.methodPrinciple"
              placeholder="请选择方法原理"
              :allow-clear="true"
              :show-null-select="false"
              dict-code="sys_post,post_name,id"
            />
          </a-form-model-item>
          <a-form-model-item label="标准号" style="flex: 1;">
            <j-input v-model.trim="queryParam.standardNumber" placeholder="请输入标准号" />
          </a-form-model-item>
          <a-form-item label="试题内容" style="flex: 1;">
            <j-input v-model.trim="queryParam.name" placeholder="请输入试题内容" style="width: 468px;" />
          </a-form-item>
          <!--          <a-form-item label="审核状态" style="flex: 1;">-->
          <!--            <JDictSelectTag-->
          <!--              v-model="queryParam.isReview"-->
          <!--              placeholder="请选择审核状态"-->
          <!--              :allow-clear="true"-->
          <!--              :show-null-select="false"-->
          <!--              dict-code="isReview"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-form-item label="是否维护" style="flex: 1;">
            <JDictSelectTag
              v-model="queryParam.isMaintain"
              placeholder="请选择是否维护"
              :allow-clear="true"
              :show-null-select="false"
              dict-code="yn"
            />
          </a-form-item>
          <a-form-item class="search-button">
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button type="primary" icon="reload" @click="reset">重置</a-button>
            <!-- <a-button type="primary" icon="download" @click="testRepeat">试题查重</a-button> -->
          </a-form-item>
        </a-form>
      </div>
      <!-- table区域 -->
      <!-- <div style="height: 67vh;"> -->
      <def-columns :columns="columns" @setColumns="columns = $event" />
      <a-table
        ref="table"
        size="middle"
        class="table-nowrap"
        bordered
        :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: onSelectChange }"
        :columns="columns"
        :data-source="dataSource"
        row-key="id"
        :pagination="ipagination"
        :loading="loading"
        :expanded-row-keys.sync="expandedRowKeys"
        @change="handleTableChange"
        @expand="expandedChange(expandedRowKeys)"
      >
        <span slot="action" slot-scope="text, record" class="table-action">
          <a @click="handleEdit(record)">编辑</a>
        </span>
        <template slot="name" slot-scope="text, record" class="table-action">
          <span class="col-sql" v-html="record.name" />
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
                  ><span
                    v-html="i.item + '  '"
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
      <!-- </div> -->
    </div>
    <!-- <practice-modal ref="practiceModal" /> -->
    <!-- <examine-modal ref="examineModal" @ok="modalFormOk" /> -->
  </div>
</template>

<script>
import { dataType, difficultyLevel, columns } from '../tkgl/dataSources'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import QuestionTree from './components/QuestionTree'
import { getAction, deleteAction, postAction, downFile } from '@/api/manage'
import JTreeSelect from '@/components/jeecg/JTreeSelect'
// import PracticeModal from '../tmfk/PracticeModal'
// import ExamineModal from '../tkgl/modules/ExamineModal'
import StandAlone from '../tjtm/StandAlone'
var characterList = []
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'stgl-tmwh',
  components: { QuestionTree, JTreeSelect },
  mixins: [JeecgListMixin],
  data() {
    return {
      // disableMixinCreated: true,
      treeShow: true, // 展开收起左侧
      dataSource: '',
      dataType: dataType, // 试题类型
      difficultyLevel: difficultyLevel, // 试题难度
      columns: [
        {
          title: '试题内容',
          align: 'center',
          dataIndex: 'name',
          key: 'name',
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '题型',
          align: 'center',
          dataIndex: 'questionType_dictText',
          key: 'questionType_dictText',
          ellipsis: true,
          width: 80
        },
        // {
        //   title: '分类',
        //   align: 'center',
        //   dataIndex: 'prop3',
        //   key: 'prop3'
        // },
        // {
        //   title: '难度',
        //   align: 'center',
        //   dataIndex: 'difficult_dictText',
        //   key: 'difficult_dictText'
        // },
        {
          title: '分数',
          align: 'center',
          dataIndex: 'score',
          key: 'score',
          defaultHide: true,
          width: 80,
          ellipsis: true
        },
        // {
        // 	title: '创建人',
        // 	align: 'center',
        // 	dataIndex: 'createBy',
        // 	key: 'createBy'
        // },
        // {
        // 	title: '创建时间',
        // 	align: 'center',
        // 	dataIndex: 'createTime',
        // 	key: 'createTime',
        // 	width: 100
        // },
        {
          title: '监测类别',
          align: 'center',
          dataIndex: 'monitoringCategory_dictText',
          key: 'monitoringCategory_dictText',
          ellipsis: true,
          width: 100
        },
        {
          title: '科目(方法原理)',
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
          ellipsis: true,
          width: 150
        },
        {
          title: '拒绝原因',
          align: 'center',
          dataIndex: 'reason',
          key: 'reason',
          ellipsis: true,
          width: 150
        },
        {
          title: '是否维护',
          align: 'center',
          dataIndex: 'isMaintain_dictText',
          ellipsis: true,
          width: 100
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          // fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // table表格
      selectedRowKeys: [],
      selectedRows: [],
      selectChangeShow: true,
      expandedRowKeys: [],
      // 试题调整或分类
      //   classType: '',
      //   categoryId: '', // 分类id
      //   awansValue: '', // 答案
      //   score: 1, // 分数
      //   monitoringCategory: '', // 监测类别
      //   standardNumber: '', // 标准号
      //   methodPrinciple: '', // 方法原理
      //   isShow: '', // 是否公开
      // 试题分类节点树
      recordLength: '', // 展开题目长度
      expandedKeys: [],
      selectedKeys: [],
      questionList: '', // 节点树数据
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      treeType: '1',
      /* 排序参数 */
      isorter: {
        column: 'createTime,id',
        order: 'desc'
      },
      url: {
        list: '/tQuestion/tQuestion/list?isReview=1',
        childList: '/sys/category/childList',
        delete: '/tQuestion/tQuestion/delete'
        // exportXlsUrl: '/tQuestion/tQuestion/downQuestionExcel'
      },
      queryParam: {
        // isMaintain: '0'
      }
    }
  },
  created() {
    this.character()
  },
  activated() {
    this.loadData()
    this.$nextTick(() => {
      this.$refs.questionTree.refreshSelect()
    })
  },
  methods: {
    // P span便签 过滤出字符
    htmlToString(htmlStr) {
      // str1.replace(/&nbsp;/gi, ""
      return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '').replaceAll('&nbsp;', ' ') : ''
    },
    // 搜索
    search() {
      this.expandedRowKeys = []
      // this.recordLength = ''
      this.queryParam.checkRepeatQuery = false
      this.searchQuery()
    },
    // 重置
    reset() {
      this.expandedRowKeys = []
      // this.recordLength = ''
      this.$refs.questionTree.reset()
      this.searchReset()
      // this.queryParam = {}
      // this.loadData(1)
    },
    // 试题查重
    // testRepeat() {
    //   this.queryParam.checkRepeatQuery = true
    //   var params = this.getQueryParams() // 查询条件
    //   delete params.order
    //   delete params.column
    //   this.loading = true
    //   getAction(this.url.list, params)
    //     .then(res => {
    //       if (res.success) {
    //         this.dataSource = res.result.records || res.result
    //         if (res.result.total) {
    //           this.ipagination.total = res.result.total
    //         } else {
    //           this.ipagination.total = 0
    //         }
    //         this.loadDataSuccess(res)
    //       } else {
    //         this.$message.warning(res.message)
    //       }
    //     })
    //     .finally(() => {
    //       this.loading = false
    //     })
    // },
    loadDataSuccess() {
      this.expendData()
    },
    handleTableChange(pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      this.expandedRowKeys = []
      // this.recordLength = ''
      // this.$refs.questionTree.reset()
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    // 循环26个字母
    character() {
      for (var i = 0; i < 26; i++) {
        characterList.push(String.fromCharCode(65 + i))
      }
    },
    // 打开获取题目内容
    expandedChange(record) {
      let id = ''
      if (record.length > 0) {
        id = record[record.length - 1]
        getAction('/tQuestion/tQuestion/queryById', { id: id }, 'get').then(res => {
          console.log(res, this.dataSource)
          this.dataSource.forEach((item, index) => {
            if (item.id == id) {
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
      // this.recordLength = record.length
      this.$forceUpdate()
    },
    // 获取已打开的题目的内容
    expendData() {
      const that = this
      if (this.expandedRowKeys.length > 0) {
        for (const i in that.expandedRowKeys) {
          that.dataSource.forEach((item, index) => {
            if (item.id == that.expandedRowKeys[i]) {
              getAction('/tQuestion/tQuestion/queryById', { id: that.expandedRowKeys[i] }, 'get').then(res => {
                if (res.success) {
                  const itemList = res.result.itemList
                  if (res.result.questionType == 1 || res.result.questionType == 2 || res.result.questionType == 3) {
                    itemList.forEach((item, itemIndex) => {
                      item.value = characterList[itemIndex]
                    })
                  }
                  this.$set(that.dataSource[index], 'itemList', itemList)
                  this.$forceUpdate()
                }
              })
            }
          })
        }
      }
      this.$forceUpdate()
    },
    // 编辑
    handleEdit(data) {
      const ids = []
      ids.push(data.id)
      // 获取题目内容
      this.expandedChange(ids)
      setTimeout(() => {
        // this.$refs.standAlone.showModal(data)
        this.$router.push({
          // name: 'stgl-tjtm',
          name: 'stgl-stwhbj',
          params: { data, searchParams: { ...this.queryParam }},
          query: { type: 'editWh' }
        })
      }, 500)
    },
    // 试题分类树刷新table
    questCallBack(val) {
      this.queryParam.categoryId = val
      this.search()
    },
    // 获取批量更新分类节点树
    getQuestion() {
      getAction('sys/category/rootListNew', { type: 1, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.questionList = result
            console.log('questionList', this.questionList)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 勾选多选框变化
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      if (this.selectedRows.length > 0) {
        this.selectChangeShow = false
      } else {
        this.selectChangeShow = true
      }
    },
    // // 树选择
    // onSelect(selectedKeys) {
    //   this.categoryId = selectedKeys[0]
    //   this.selectedKeys = selectedKeys
    // },
    // 、、监测类别
    monSelect(value, node, extra) {
      this.queryParam.monitoringCategory = extra.selectedNodes[0].key
    }
  }
}
</script>

<style lang="less" scoped>
.card-module {
  display: flex;
  .card-hidden {
    min-width: 37px;
    position: relative;
    margin: 0 5px;
    background: #ffffff;
    .iconStyle {
      top: 40%;
      z-index: 999;
      position: absolute;
      color: #1890ff;
      text-align: center;
      margin: auto;
    }
  }
  .card-class {
    position: relative;
    padding: 20px 30px;
    margin: 0 5px;
    background: #ffffff;
    .iconStyle {
      top: 45%;
      left: 93%;
      z-index: 999;
      position: absolute;
      color: #1890ff;
    }
  }
  .top-button {
    margin-bottom: 20px;
  }
  .tree-module {
    margin-right: 10px;
    max-height: 88vh;
    overflow-y: auto;
    min-width: 335px;
  }

  .content-module {
    min-width: calc(100% - 435px);
    flex: 5;
    // height: 100%;
  }
}
.col-sql {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // display: inline-block;
  width: 580px;
}
/deep/ .col-sql table {
  display: none;
  vertical-align: middle;
}
/deep/ .col-sql > p {
  display: inline-block;
}
/deep/ .col-sql > p > img {
  width: 10%;
}
.popover-cont {
  font-size: 16px;
  padding: 0 12px;
}
.popover-cont:hover {
  background: aliceblue;
  color: #2485dd;
  font-size: 16px;
  padding: 0 12px;
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

// .AStockOutDetailTable{
/deep/ .ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 8px 8px;
  overflow-wrap: break-word;
}
/deep/ .ant-table-tbody .ant-table-row td {
  padding-top: 8px;
  padding-bottom: 8px;
}
// }
</style>
