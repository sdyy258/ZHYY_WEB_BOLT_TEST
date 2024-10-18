<template>
    <div class="card-module">
      <!-- 试卷分类树 -->
      <div class="tree-module card-class">
        <question-tree ref="questionTree" :tree-type="treeType" @ok="questCallBack" quest-type="fx"/>
      </div>
      <!-- 列表搜索框重置等按钮 -->
      <div class="content-module card-class">
        <div class="top-button">
          <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
            <a-form-item label="试题类型" style="flex: 1;">
              <a-select
                v-model="queryParam.questionType"
                placeholder="请选择试题类型"
                allow-clear
                show-search
              >
                <a-select-option v-for="i in dataType" :key="i.value" :value="i.value">{{ i.text }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-model-item label="监测类别" style="flex: 1;">
              <j-dict-select-tag v-model="queryParam.monitoringCategory" :show-null-select="false" :trigger-change="true" placeholder="请选择监测类别" dict-code="monitoringCategory" />
            </a-form-model-item>
            <a-form-model-item label="科目方法" style="flex: 1;">
              <JDictSelectTag v-model="queryParam.methodPrinciple" placeholder="请选择方法原理" :show-null-select="false" dict-code="sys_post,post_name,id" />
            </a-form-model-item>
            <a-form-model-item label="标准号" style="flex: 1;">
              <j-input v-model.trim="queryParam.standardNumber" placeholder="请输入标准号" />
            </a-form-model-item>
            <a-form-item label="试题内容" style="flex: 1;">
              <j-input v-model.trim="queryParam.name" placeholder="请输入试题内容" style="width: 468px;" />
            </a-form-item>
            <a-form-item label="审核状态" style="flex: 1;">
              <JDictSelectTag v-model="queryParam.isReview" placeholder="请选择审核状态" :allow-clear="true" :show-null-select="false" dict-code="isReview" @change="$forceUpdate()" />
            </a-form-item>
            <a-form-item class="search-button">
              <a-button type="primary" icon="search" @click="search">查询</a-button>
              <a-button type="primary" icon="reload" @click="reset">重置</a-button>
              <template v-if="$store.getters.userInfo.roles!=='yanshi'">
                <a-button type="primary" icon="plus" @click="addTitle">添加试题</a-button>
                <a-button type="primary" icon="download" @click="handleExportXlsByCategory('试题')">导出试题</a-button>
              </template>
              <a-button type="primary" icon="download" @click="testRepeat">试题查重</a-button>
              <!-- 批量更新下拉菜单 -->
              <a-button type icon="rollback" :disabled="selectChangeShow" @click="adjustClassif">批量更新</a-button>
              <a-button type icon="delete" :disabled="selectChangeShow" @click="handleDeleteAll">批量删除</a-button>
            </a-form-item>
          </a-form>
          <!-- 批量更新弹窗 -->
          <a-modal
            centered
            :mask-closable="false"
            title="调整试题"
            width="400px"
            :visible="classifVisible"
            cancel-text="关闭"
            ok-text="选择"
            @cancel="()=>(classifVisible=false)"
            @ok="classifConfirm"
          >
            <div>
              <div style="margin: 10px">
                <span>试题分类：</span>
                <a-tree-select
                  v-model.trim="categoryId"
                  :tree-data="questionList"
                  :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
                  style="width: 200px;"
                  placeholder="请选择"
                  allow-clear
                  tree-node-filter-prop="title"
                />
              </div>
              <div style="margin: 10px">
                <span>监测类别：</span>
                <j-dict-select-tag v-model="monitoringCategory" :show-null-select="false" style="width: 200px;" :trigger-change="true" placeholder="请选择监测类别" dict-code="monitoringCategory" />
              </div>
              <div style="margin: 10px">
                <span>方法原理：</span>
                <JDictSelectTag v-model="methodPrinciple" placeholder="请选择方法原理" style="width: 200px;" :show-null-select="false" dict-code="sys_post,post_name,id" />
              </div>
              <div style="margin: 10px">
                <span style="margin-right: 13px;"> 标准号：</span>
                <a-input v-model="standardNumber" placeholder="请输入标准号" maxlength="25" style="width: 200px;" />
              </div>
              <div style="margin: 10px">
                <span>是否公开：</span>
                <j-dict-select-tag v-model="isShow" :show-null-select="false" style="width: 200px;" :trigger-change="true" placeholder="请选择是否公开" dict-code="question_is_show" />
              </div>
              <div style="margin: 10px">
                <span>试题分数：</span>
                <a-input-number v-model="score" placeholder="请输入试题分数" :min="1" />
              </div>
            </div>
          </a-modal>
        </div>
        <!-- table区域 -->
        <!-- <div style="height: 67vh;"> -->
        <def-columns :columns="columns" @setColumns="columns=$event" />
        <a-table
          ref="table"
          size="middle"
          class="table-nowrap"
          bordered
          :row-selection="{ selectedRowKeys: selectedRowKeys,selectedRows:selectedRows, onChange: onSelectChange, }"
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
            <a-popconfirm title="确定删除吗?" @confirm="deleteId(record.id)">
              <a>删除</a>
            </a-popconfirm>
            <a
              v-if="record.questionType==1 || record.questionType==2 ||record.questionType==3 ||record.questionType==4"
              @click="$refs.practiceModal.showModal(record)"
            >练习</a>
          </span>
          <template slot="name" slot-scope="text,record" class="table-action">
            <span class="col-sql" v-html="record.name" />
          </template>
          <span slot="expandedRowRender" slot-scope="record">
            <div style="width: 100%;overflow: overlay;">
              <div style="padding-left: 20px;padding-right: 40px;">
                <p>
                  <span
                    style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;"
                  >题干</span>
                  <span class="htmlStyle" v-html="record.name" />
                </p>
                <p
                  v-for="(i,itemIndex) in record.itemList"
                  v-if="record.questionType ==3 ||record.questionType ==1 ||record.questionType ==2"
                  :key="itemIndex"
                  class="htmlStyle"
                  style="padding-left: 40px;"
                >{{ i.value }}、<span v-html="i.item " /></p>
              </div>
              <div style="padding: 20px 40px 0px 20px;">
                <p>
                  <span style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;">答案</span>
                  <span v-for="(i,itemIndex) in record.itemList" :key="itemIndex">
                    <span v-if="record.questionType ==4 || record.questionType ==5 ||record.questionType ==6||record.questionType ==7||record.questionType ==8" style="white-space: break-spaces;" class="htmlStyle"><span v-html="i.item +'  '" /></span>
                    <span v-if="i.isRight == 1" style="white-space: break-spaces;">{{ i.value }}  </span>
                  </span>
                  <!-- <span v-else style="white-space: break-spaces;">{{record.isRight}}</span> -->
                </p>
                <p>
                  <span
                    style="background: #DBDCDF;margin-right: 5px;border-radius: 4px;padding: 1px 3px;"
                  >解析</span>
                  <span class="htmlStyle" v-html="record.analysis" />
                </p>
              </div>
            </div>
          </span>
        </a-table>
        <!-- </div> -->
      </div>
      <practice-modal ref="practiceModal" />
      <modal-form ref="modalForm" @close="loadData"></modal-form>
    </div>
  </template>

  <script>
  import { dataType, difficultyLevel, columnsFx } from '../../stgl/tkgl/dataSources'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import QuestionTree from './modules/QuestionTree'
  import { getAction, deleteAction, postAction, downFile } from '@/api/manage'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import PracticeModal from '../../stgl/tmfk/PracticeModal'
  import ModalForm from './modules/ModalForm'
  var characterList = []
  export default {
    components: { QuestionTree, JTreeSelect, PracticeModal,ModalForm },
    mixins: [JeecgListMixin],
    data() {
      return {
        dataSource: '',
        dataType: dataType, // 试题类型
        difficultyLevel: difficultyLevel, // 试题难度
        columns: columnsFx, // table表格
        disableMixinCreated: true,
        // table表格
        selectedRowKeys: [],
        selectedRows: [],
        selectChangeShow: true,
        expandedRowKeys: [],
        // 试题调整或分类
        classifVisible: false,
        classType: '',
        categoryId: '', // 分类id
        awansValue: '', // 答案
        score: 1, // 分数
        monitoringCategory: '', // 监测类别
        standardNumber: '', // 标准号
        methodPrinciple: '', // 方法原理
        isShow: '', // 是否公开
        // 试题分类节点树
        recordLength: '', // 展开题目长度
        expandedKeys: [],
        selectedKeys: [],
        questionList: '', // 节点树数据
        hasChildrenField: 'hasChild',
        pidField: 'pid',
        treeType: '1',
        queryParam:{
          isReview:0
        },
        url: {
          list: '/tQuestion/tQuestion/list',
          childList: '/sys/category/childList',
          delete: '/tQuestion/tQuestion/delete',
          exportXlsUrl: '/tQuestion/tQuestion/downQuestionExcel'
        }
      }
    },
    created() {
      this.disableMixinCreated = false
      this.loadData()
      setTimeout(() => {
        this.getQuestion()
        this.character()
      })

      // 题目反馈进入页面
      // setInterval(() => {
      //   // console.log(1111, this.questionList)
      // }, 2000)
    },
    activated() {
      // 题目单题、导入编辑进入页面
      const queryType = this.$route.query.queryType
      if (queryType) {
        this.disableMixinCreated = false
        this.$refs.questionTree.reset()
        this.loadData()
      }
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
        this.queryParam.isReviewPage = 1
        this.searchQuery()
      },
      // 重置
      reset() {
        this.expandedRowKeys = []
        // this.recordLength = ''
        this.$refs.questionTree.reset()
        // this.searchReset()
        this.queryParam = {}
        this.queryParam.isReview = 0
        this.loadData(1)
      },
      // 试题查重
      testRepeat() {
        this.queryParam.checkRepeatQuery = true
        var params = this.getQueryParams()// 查询条件
        delete params.order
        delete params.column
        this.loading = true
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records || res.result
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            this.loadDataSuccess(res)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      loadDataSuccess() {
        this.expendData()
      },
      handleTableChange(pagination, filters, sorter) {
        // 分页、排序、筛选变化时触发
        // TODO 筛选
        this.expandedRowKeys = []
        // this.recordLength = ''
        this.$refs.questionTree.reset()
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
      // 添加试题进入单题录入页面
      addTitle() {
        // this.$router.push('/stgl/tjtm')
        this.$refs.modalForm.result= {}
        this.$refs.modalForm.showModal()
      },
      // 编辑
      handleEdit(data) {
        const ids = []
        ids.push(data.id)
        // 获取题目内容
        this.expandedChange(ids)
        setTimeout(() => {
          this.$refs.modalForm.result= data
          this.$refs.modalForm.type= 'edit'
          this.$refs.modalForm.edit()
          // this.$router.push({
          //   name: 'stgl-tjtm',
          //   params: { data },
          //   query: { type: 'edit' }
          // })
        }, 500)
      },
      // 试题分类树刷新table
      questCallBack(val) {
        this.queryParam.categoryId = val
        this.search()
      },
      // 批量更新确认
      classifConfirm(e) {
        let categoryId = ''
        let monitoringCategory = ''
        let standardNumber = ''
        let methodPrinciple = ''
        let isShow = ''
        let score = ''
        // 判断是分类还是难度
        score = this.score
        monitoringCategory = this.monitoringCategory
        standardNumber = this.standardNumber
        methodPrinciple = this.methodPrinciple
        isShow = this.isShow
        categoryId = this.categoryId
        const ids = this.selectedRows.map(item => {
          return item.id
        })
        const param = {
          categoryId: categoryId,
          idList: ids,
          score: score,
          monitoringCategory: monitoringCategory,
          standardNumber: standardNumber,
          methodPrinciple: methodPrinciple,
          isShow: isShow
        }
        postAction('/tQuestion/tQuestion/batchEdit', param).then(res => {
          if (res.success) {
            this.$refs.questionTree.reset()
            // 重新计算分页问题
            this.reCalculatePage(1)
            this.$message.success(res.message)
            this.loadData()
          } else {
            this.$message.warning(res.message)
          }
          this.selectChangeShow = true
          this.classifVisible = false
        })
      },
      // 试题调整或分类
      adjustClassif(val) {
        if (this.selectChangeShow) {
          return false
        }
        this.getQuestion()
        this.classifVisible = true
        this.monitoringCategory = ''
        this.awansValue = ''
        this.score = 1
        this.standardNumber = ''
        this.methodPrinciple = ''
        this.categoryId = ''
        this.isShow = ''
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
      // 删除
      deleteId(id) {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete属性!')
          return
        }
        var that = this
        deleteAction(that.url.delete, { id: id }).then((res) => {
          if (res.success) {
            this.$refs.questionTree.reset()
            // 重新计算分页问题
            that.reCalculatePage(1)
            that.$message.success(res.message)
            that.loadData()
            // this.$nextTick(() => {
            //   this.expendData()
            // }, 100)
          } else {
            that.$message.warning(res.message)
          }
        })
      },
      // 批量删除
      handleDeleteAll() {
        const that = this
        const ids = this.selectedRows
          .map(item => {
            return item.id
          })
          .join(',')
        deleteAction('/tQuestion/tQuestion/deleteBatch', { ids: ids }, 'detlete').then(res => {
          console.log('批量删除', res)
          if (res.success) {
            // 重新计算分页问题
            that.reCalculatePage(1)
            that.$message.success(res.message)
            this.$refs.questionTree.reset()
            that.loadData()
            this.selectChangeShow = true
          } else {
            that.$message.warning(res.message)
          }
        })
      },
      // 树选择
      onSelect(selectedKeys) {
        this.categoryId = selectedKeys[0]
        this.selectedKeys = selectedKeys
      },
      // 、、监测类别
      monSelect(value, node, extra) {
        this.queryParam.monitoringCategory = extra.selectedNodes[0].key
      },
      handleExportXlsByCategory(fileName) {
        if (!fileName || typeof fileName !== 'string') {
          fileName = '导出文件'
        }
        if (!this.queryParam.categoryId) {
          this.$message.error(`请选择要导出的分类！`)
          return
        }
        const param = {}
        param['categoryId'] = this.queryParam.categoryId
        console.log('导出参数', param)
        downFile(this.url.exportXlsUrl, param).then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
          } else {
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // 下载完成移除元素
            window.URL.revokeObjectURL(url) // 释放掉blob对象
          }
        })
      }
    }
  }
  </script>

  <style lang="less" scoped>
  .card-module {
    display: flex;

    .card-class {
      padding: 20px 30px;
      margin: 0 5px;
      background: #ffffff;
    }
    .top-button {
      margin-bottom: 20px;
    }
    .tree-module {
      margin-right: 10px;
      /* max-height: 88vh; */
      overflow-y: auto;
      // width: 30%;
      min-width: 314px;
    }

    .content-module {
      min-width: calc(100% - 314px);
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
  /deep/ .col-sql table{
    display: none;
    vertical-align: middle;
  }
  /deep/ .col-sql>p{
    display: inline-block;
  }
  /deep/ .col-sql>p>img{
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
  .htmlStyle{
    white-space: break-spaces;
    /deep/ p{
    display: inline;
    }
    /deep/ p>img{
      width: 15%;
    }
  }

  // .AStockOutDetailTable{
      /deep/ .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        padding: 8px 8px;
        overflow-wrap: break-word;
      }
      /deep/ .ant-table-tbody .ant-table-row td {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    // }
  </style>
