<template>
  <div class="warpp">
    <div class="content-class">
      <div class="tree-module card-class">
        <question-tree ref="questionTree" :tree-type="treeType" @ok="questCallBack" />
        <!-- <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
    				<a-tree-node key="0-0" title="试卷分类">
      					<a-tree-node key="0-0-0" title="示例1" is-leaf />
      					<a-tree-node key="0-0-1" title="示例2" is-leaf />
    				</a-tree-node>
        </a-directory-tree>-->
      </div>
      <div class="content-module">
        <div class="search-class">
          <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
            <a-form-item label="试卷名称">
              <a-input v-model.trim="queryParam.name" placeholder="请输入试卷名称" />
            </a-form-item>
            <a-form-item label="试卷创建时间">
              <a-date-picker
                v-model="queryParam.createTime"
                placeholder="请选择试卷创建时间"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
            <!-- <a-form-item label="试卷更新时间">
              <a-date-picker
                v-model="queryParam.updateTime"
                placeholder="请选择试卷更新时间"
                value-format="YYYY-MM-DD"
              />
            </a-form-item> -->
            <a-form-item class="search-button">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              <a-button type="primary" icon="plus" @click="$router.push({ name: 'ksgl-cjsj' })">创建试卷</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="list-class">
          <div class="list-title">当前试卷总计：{{ dataSource.length }}份</div>
          <a-radio-group
            v-for="(i, index) in dataSource"
            :key="index"
            v-model="checked"
            class="list-item"
            @change="radioChange"
          >
            <div class="flex">
              <div class="list-item-left">
                <a-radio :value="index" />
              </div>
              <div class="list-item-middle">
                <div class="middle-item" style="font-size: 21px;">{{ i.name }}</div>
                <div class="middle-item" style="font-size: 16px;">试卷分类：{{ i.categoryId_dictText }}</div>
                <!-- <div v-else class="middle-item" style="font-size: 16px;">{{ }}</div> -->

                <div class="middle-item" style="font-size: 14px;">
                  {{ i.createBy_dictText }}：创建于{{ i.createTime }}
                </div>
              </div>
              <div class="list-item-right">
                <div class="right-tilte">
                  <div class="title-item">{{ i.combinationType_dictText }}</div>
                  <div class="title-item">{{ i.bigQuestionCount }} 大题</div>
                  <div class="title-item">{{ i.smallQuestionCount }}小题</div>
                  <div class="title-item">总分 {{ i.score }} 分</div>
                  <div class="title-item" style="border: 0;">
                    应用考试
                    <a @click="$refs.applicatExam.showModal(i)">{{ i.useCount }}场</a>
                  </div>
                </div>
                <div class="right-icon">
                  <div>
                    <a-icon type="download" style="color: #2F54EB;" />
                    <span
                      style="margin-left: 8px;"
                      @click="$refs.paperPreviewModal.showModal(i.id, { isFixedTopic: i.combinationType === 1 })"
                      >导出试卷</span
                    >
                  </div>
                  <div v-if="i.combinationType == 1" @click="handleEdit(i)">
                    <!-- <div @click="handleEdit(i)"> -->
                    <a-icon type="form" style="color: #2F54EB;margin-left: 15px;" />
                    <span style="margin-left: 8px;">编辑</span>
                  </div>
                  <div v-else @click="SampleRules(i)">
                    <a-icon type="bars" style="color: #2F54EB;margin-left: 15px;" />
                    <span style="margin-left: 8px;">抽题规则</span>
                  </div>
                  <div>
                    <a-popconfirm title="确定删除吗?" @confirm="hDelete(i.id)">
                      <a-icon type="rest" style="color: #2F54EB;margin-left: 15px;" />
                      <span style="margin-left: 8px;">删除</span>
                    </a-popconfirm>
                  </div>
                </div>
              </div>
            </div>
            <a-divider dashed />
            <!-- </div> -->
          </a-radio-group>
        </div>
        <div v-if="dataSource.length" style="margin-top: 20px;float: right;">
          <Pagination
            v-show="ipagination.total > 0"
            :total="ipagination.total"
            :current.sync="ipagination.current"
            :page-size.sync="ipagination.pageSize"
            :page-size-options="ipagination.pageSizeOptions"
            @change="loadData"
          />
        </div>
      </div>
    </div>
    <applicat-exam ref="applicatExam" />
    <sample-rules ref="sampleRules" @ok="rulesBack" />
    <sample-rulesXx ref="sampleRulesXx" @ok="rulesBack" />
    <PaperPreviewModal ref="paperPreviewModal" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import QuestionTree from '../../stgl/tkgl/QuestionTree'
import { getAction, deleteAction } from '@/api/manage'
import Pagination from '@/components/oems/Pagination'
import ApplicatExam from '../cjks/model/ApplicatExam.vue'
import SampleRules from './modules/SampleRules'
import SampleRulesXx from './modules/SampleRulesXx'
import PaperPreviewModal from './modules/PaperPreviewModal'
export default {
  components: { QuestionTree, Pagination, ApplicatExam, SampleRules, SampleRulesXx, PaperPreviewModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      // dataSource: [],
      treeType: '2',
      queryParam: {},
      selectList: [],
      checked: '',
      url: {
        list: '/tExamPaper/tExamPaper/list',
        delete: '/tExamPaper/tExamPaper/delete'
      }
    }
  },
  created() {},
  methods: {
    // 获取试卷数据
    expandedChange(id) {
      getAction('/tExamPaper/tExamPaper/queryById', { id: id }).then(res => {
        console.log('试卷111', res)
        if (res.success) {
          const data = res.result
          this.$router.push({
            name: 'ksgl-cjsj',
            params: { data }
          })
        }
      })
    },
    // 选择试卷
    radioChange(e) {
      this.selectList = this.dataSource[e.target.value]
      this.selectList.checked = e.target.value
    },
    handleEdit(data) {
      this.$router.push({
        name: 'ksgl-cjsj',
        query: { ...data }
      })
      // this.expandedChange(data.id)
    },
    SampleRules(i) {
      getAction('/tExamPaper/tExamPaper/queryRuleByPaperId', { id: i.id }).then(res => {
        if (res.success) {
          const data = res.result
          // this.$message.success(res.message || '成功')
        } else {
          this.$message.warning(res.message)
        }
        if (i.isOnline === 0) {
          this.$refs.sampleRulesXx.showModal(res.result)
        } else {
          this.$refs.sampleRules.showModal(res.result)
        }
      })
    },
    hDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then(res => {
        if (res.success) {
          this.$refs.questionTree.reset()
          // 重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    rulesBack() {
      this.loadData()
    },
    questCallBack(val) {
      this.queryParam.categoryId = val
      this.searchQuery()
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.content-class {
  display: flex;
  .tree-module {
    flex: 1.5;
    max-height: 85vh;
    margin: 5px;
    margin-right: 10px;
    padding: 20px 30px;
    background: #ffffff;
    overflow-y: scroll;
    min-width: 435px;
  }

  .content-module {
    min-width: calc(100% - 430px);
    flex: 5;
    margin: 5px;
    max-height: 85vh;
    overflow-y: scroll;

    .search-class {
      // height: 23%;
      padding: 22px 15px 2px 15px;
      background: #ffffff;
    }

    .list-class {
      margin-top: 20px;
      background: #ffffff;
      .list-title {
        width: 100%;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        padding-left: 30px;
        border-bottom: 1px solid #e9eaea;
        margin-bottom: 6px;
      }

      .list-item {
        width: 100%;
        // height: 130px;
        padding: 0 30px;

        .list-item-left {
          flex: 1;
          text-align: center;
          line-height: 90px;
        }

        .list-item-middle {
          flex: 12;
          padding-left: 20px;

          .middle-item {
            margin-bottom: 8px;
          }
        }
        .list-item-right {
          // flex: 7;

          .right-tilte {
            display: flex;
            height: 20px;
            padding-left: 20px;

            .title-item {
              padding: 0 18px;
              font-size: 15px;
              border-right: 1px solid #000000;
            }
          }

          .right-icon {
            display: flex;
            font-size: 15px;
            text-align: right;
            padding-top: 45px;
            padding-right: 20px;
            float: right;
            cursor: pointer;
          }
        }
      }
    }
  }
}
/deep/ .ant-divider-horizontal {
  margin: 6px 0;
}
</style>
