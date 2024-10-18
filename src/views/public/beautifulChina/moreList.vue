<template>
  <div class="wrapper">
    <div class="topContent">
      <div class="top-left">
        <img :src="img.mlzg" style="width: 40px;">
        <span class="topTitle">智慧运维</span>
      </div>
      <div class="top-right">
        <div style="cursor: pointer" @click="$router.push('/user/login')">登录</div>
        <div style="margin-left: 40px;cursor: pointer" @click="$router.go(-1)">返回</div>
      </div>
    </div>
    <div class="mainContainer">
      <div class="leftContainer">
        <div class="leftContent">
          <div style="margin-bottom: 10px;font-size: 16px;font-weight: 600">所有文档</div>
          <a-input-search v-model="filterText" placeholder="搜索分类" />
          <div class="treeContent">
            <el-tree
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              :default-expand-all="true"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
              <template slot-scope="{node,data}">
                <div style="display: flex;align-items: center">
                  <template>
                    <img :src="img.folder" style="width: 15px">
                  </template>
                  <span style="margin-left: 5px">{{ data.name }}</span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="rightContainer">
        <div class="right-top">
          <div class="customSearch">
            <a-input v-model="queryParam.tags" placeholder="请输入关键字" size="large">
              <template slot="addonAfter">
                <div style="color: #2a64d9;padding: 0 10px;font-size: 20px;font-weight: 600;letter-spacing: 2px;cursor: pointer" @click="searchQuery">搜索</div>
              </template>
            </a-input>
          </div>
        </div>
        <div class="listContent">
          <div v-if="!loading&&dataSource.length===0" style="padding-top: 30px">
            <a-empty />
          </div>
          <div class="cu-list">
            <div v-for="i in dataSource" :key="i.id" class="cu-item" @click="$refs.detailModal.showModal(i)">
              <div class="item-left">
                <div class="item-left-top">
                  <div class="item-title text-cut">{{ i.title }}</div>
                  <div class="viewContent">
                    <img :src="img.view">
                    <span class="viewCount">{{ i.views }}</span>
                  </div>
                </div>
                <div class="item-left-bottom">{{ i.summary }}</div>
                <div v-if="i.tags" style="margin-top: 5px">
                  <a-tag v-for="(tag,index) in i.tags.split(',')" :key="index" color="#108EE9">{{ tag }}</a-tag>
                </div>
              </div>
              <div class="item-right">
                <img v-viewer :src="i.coverImage" @click.stop="">
              </div>
            </div>
          </div>
          <Pagination
            v-show="ipagination.total>0"
            style="display: flex;justify-content: center;padding-top: 10px"
            :total="ipagination.total"
            :current.sync="ipagination.current"
            :page-size.sync="ipagination.pageSize"
            :page-size-options="ipagination.pageSizeOptions"
            @change="loadData"
          />
        </div>
      </div>
    </div>
    <detail-modal ref="detailModal" @view="loadData"/>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DetailModal from './components/DetailModal'

export default {
  name: 'MoreList',
  components: { DetailModal },
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      categoryCode: '',
      queryParam: {
        tags: ''
      },
      url: {
        list: '/article/info/listNoAuth'
      },
      ipagination: {
        current: 1,
        pageSize: 8,
        pageSizeOptions: ['8', '20', '50'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      img: {
        mlzg: require('./img/mlzg2.png'),
        folder: require('./img/folder.png'),
        detailTop: require('./img/detailTop.png'),
        view: require('./img/view.png'),
        demo: require('./img/demo.png')
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
    if (this.$route.query.categoryCode) {
      this.categoryCode = this.$route.query.categoryCode
    }
    this.searchQuery()
  },
  methods: {
    searchReset() {
      this.queryParam = {}
      this.categoryCode = ''
      this.loadData(1)
    },
    connectParams(params) {
      params.categoryCode = this.categoryCode
    },
    getTreeData() {
      this.getAction('/sys/category/allList').then(res => {
        this.treeData = this.$utils.handleTree(res.result, 'id', 'pid')
        console.log('所有文档', this.treeData)
      })
    },
    handleNodeClick(data) {
      this.categoryCode = data.code
      this.searchQuery()
    },
    filterNode(value, data, node) {
      if (!value) {
        // node.expanded = false
        return true
      }
      let parentNode = node.parent
      let labels = [node.label]
      let level = 1
      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent
        level++
      }
      return labels.some(label => label.indexOf(value) !== -1)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  .topContent {
    background: linear-gradient(to right, #005CEB, #00C5FA);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-right: 6%;
    height: 50px;

    .top-left {
      display: flex;
      align-items: center;

      .topTitle {
        font-family: cursive, fonsong;
        margin-left: 10px;
        color: white;
        font-size: 24px;
        letter-spacing: 2px;
      }
    }

    .top-right {
      display: flex;
      align-items: center;
      color: white;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }

  .mainContainer {
    display: flex;
    background: #F5F6FA;
    width: 100%;
    height: calc(100vh - 50px);
    overflow-y: auto;

    .leftContainer {
      height: 100%;
      background: linear-gradient(to bottom, #DBF1FE, #F6F7FB);
      width: 18%;
      min-width: 18%;
      padding: 10px;

      .leftContent {
        background: white;
        height: 100%;
        border-radius: 10px;
        padding: 15px;

        .treeContent {
          padding: 5px 0;
          height: calc(100vh - 160px);
          overflow-y: auto;
        }
      }
    }

    .rightContainer {
      flex: 1;
      padding: 20px 30px;

      .right-top {
        background: url("./img/detailTop.png") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 110px;
        display: flex;
        align-items: center;
        padding-left: 40px;

        .customSearch {
          width: 65%;

          /deep/ input {
            border-radius: 30px 0 0 30px;
            height: 50px;
            padding: 0 20px;
          }

          /deep/ .ant-input-group-addon {
            background: white;
            border-radius: 0 30px 30px 0;
          }
        }
      }

      .listContent {
        background: #FFFFFF;
        padding: 10px 20px;
        margin-top: 10px;
        height: calc(100vh - 202px);
        border-radius: 8px;
        overflow-y: auto;

        .cu-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .cu-item {
            background: #F1F5FF;
            border-radius: 10px;
            display: flex;
            width: 48%;
            height: 120px;
            margin: 10px 0;
            padding: 15px 20px;

            .item-left {
              flex: 1;
              padding-right: 20px;

              .item-left-top {
                display: flex;
                align-items: center;

                .item-title {
                  font-size: 20px;
                  font-weight: 600;
                  max-width: 300px;
                }

                .viewContent {
                  margin-left: 15px;
                }

                .viewCount {
                  margin-left: 5px;
                  color: #2aa2ee;
                  font-size: 16px;
                  vertical-align: middle;
                }
              }

              .item-left-bottom {
                margin-top: 5px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .item-right {
              height: 100%;
              display: flex;
              align-items: center;

              img {
                width: 140px;
                max-height: 100%;
              }
            }
          }

        }
      }
    }
  }

}
</style>
