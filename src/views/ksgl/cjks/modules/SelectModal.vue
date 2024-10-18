<template>
  <div class="warpp-classs">
    <div class="card-class">
      <div class="title-class">
        <div class="title-left flex1">请选择一张试卷</div>
        <div class="title-right">
          <!-- <span style="margin-right: 5px;">没有想用的试卷?</span> -->
          <!-- <a style="margin-right: 25px;" @click="$router.push({name:'ksgl-cjsj'})">创建试卷></a> -->
          <a-button type="primary" @click="releaseExamination()">下一步</a-button>
        </div>
      </div>
      <div class="form-class">
        <a-form layout="inline" class="search-form" @keyup.enter.native="searchQuery">
          <a-form-item label="试卷名称">
            <a-input v-model.trim="queryParam.name" placeholder="请输入试卷名称" />
          </a-form-item>
          <a-form-item label="试卷分类">
            <a-tree-select
              v-model.trim="queryParam.categoryId"
              :tree-data="paperList"
              style="width: 380px"
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              placeholder="请选择"
              allow-clear
              tree-node-filter-prop="title"
            />
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
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="list-class">
      <div class="list-title">当前试卷总计：{{ dataSource.length }}份</div>
      <a-radio-group
        v-for="(i,index) in dataSource"
        :key="i.id"
        v-model="checked"
        class="list-item"
        @change="radioChange($event,index)"
      >
        <div class="flex">
          <div class="list-item-left">
            <a-radio :value="i.id" />
          </div>
          <div class="list-item-middle">
            <div class="middle-item" style="font-size: 22px;">{{ i.name }}</div>
            <div class="middle-item" style="font-size: 17px;">试卷分类：{{ i.categoryId_dictText }}</div>
            <div class="middle-item" style="font-size: 15px;">{{ i.createBy_dictText }}：创建于{{ i.createTime }}</div>
          </div>
          <div class="list-item-right">
            <div class="right-tilte">
              <div class="title-item">{{ i.bigQuestionCount }} 大题</div>
              <div class="title-item">{{ i.smallQuestionCount }} 小题</div>
              <div class="title-item">总分 {{ i.score }} 分</div>
              <div class="title-item" style="border: 0;">
                应用考试
                <a @click="$refs.applicatExam.showModal(i)">{{ i.useCount || 0 }}场</a>
              </div>
            </div>
            <div class="right-icon">
              <!-- <a-icon type="eye" style="color: #2F54EB;" />
              <span style="margin-left: 8px;">预览</span> -->
              <div @click="handleEdit(i)">
                <a-icon type="form" style="color: #2F54EB;margin-left: 15px;" />
                <span style="margin-left: 8px;">编辑</span>
              </div>
            </div>
          </div>
        </div>
        <a-divider dashed />
      </a-radio-group>
    </div>
    <div v-if="dataSource.length" style="margin-top: 20px;float: right;">
      <Pagination
        v-show="ipagination.total>0"
        :total="ipagination.total"
        :current.sync="ipagination.current"
        :page-size.sync="ipagination.pageSize"
        :page-size-options="ipagination.pageSizeOptions"
        @change="loadData"
      />
    </div>
    <applicat-exam ref="applicatExam" />
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import Pagination from '@/components/oems/Pagination'
import ApplicatExam from '../model/ApplicatExam'
export default {
  components: { Pagination, ApplicatExam },
  mixins: [JeecgListMixin],
  props: {
    upData: {
      type: Object,
      required: ''
    }
  },
  data() {
    return {
      queryParam: {},
      dataSource: '',
      checked: '',
      selectList: '',
      paperList: [], // 试卷分类
      url: {
        list: '/tExamPaper/tExamPaper/list'
      }
    }
  },
  created() {
    this.getPaper()
    if (this.upData) {
      this.selectList = this.upData
      this.checked = this.upData.id
    }
  },
  methods: {
    // 获取试卷分类节点树
    getPaper() {
      getAction('sys/category/rootListNew', { type: 2, pageSize: 500 })
        .then(res => {
          if (res.success) {
            const result = res.result
            this.paperList = result
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 选择试卷
    radioChange(e, index) {
      this.selectList = this.dataSource[index]
      this.selectList.checked = e.target.value
    },
    // 获取试卷数据
    expandedChange(id) {
      getAction('/tExamPaper/tExamPaper/queryById', { id: id }).then(res => {
        if (res.success) {
          const data = res.result
          this.$router.push({
            name: 'ksgl-cjsj',
            params: { data }
          })
        }
      })
    },
    handleEdit(data) {
      this.expandedChange(data.id)
    },
    // 下一步发布考试
    releaseExamination() {
      if (this.selectList.length == 0) {
        this.$message.warning('请先选择一张试卷')
        return
      }
      this.$parent.stepOk(this.selectList)
    }
  }
}
</script>
<style lang="less" scoped>
.flex1 {
  flex: 1;
}
.flex {
  display: flex;
}
.warpp-classs {
  padding: 10px 10px;

  .card-class {
    height: 140px;
    background: #ffffff;
    .title-class {
      display: flex;
      padding: 0 10px;
      border-bottom: 3px solid #f5f7fa;
      .title-left {
        font-size: 20px;
        text-align: left;
        line-height: 70px;
        padding-left: 20px;
      }
      .title-right {
        font-size: 16px;
        text-align: right;
        line-height: 70px;
        padding-right: 20px;
      }
    }

    .form-class {
      height: 70px;
      padding: 20px 30px;
    }
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
      // height: 145px;
      padding: 0 40px;

      .list-item-left {
        flex: 1;
        text-align: center;
        line-height: 105px;
      }

      .list-item-middle {
        flex: 15;
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
          padding-left: 45px;

          .title-item {
            padding: 0 18px;
            font-size: 16px;
            border-right: 1px solid #000000;
          }
        }

        .right-icon {
          font-size: 16px;
          text-align: right;
          padding-top: 55px;
          padding-right: 20px;
        }
      }
    }
  }
}
/deep/ .ant-divider-horizontal{
  margin: 6px 0;
}
</style>
