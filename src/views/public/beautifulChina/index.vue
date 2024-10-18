<template>
  <div class="wrapper">
    <div class="topContent">
      <div class="top-left">
        <img :src="img.mlzg" style="width: 45px;">
        <span class="topTitle">智慧运维</span>
      </div>
      <div class="top-right">
        <div style="cursor: pointer" @click="$router.push('/')">登录</div>
      </div>
    </div>
    <div class="titleContent">
      <div style="display:flex;justify-content: center">
        <img :src="img.gxbg">
      </div>
      <div style="padding: 0 25%;margin-top: 20px">
        <img :src="img.titleContent">
        <div class="customSearch">
          <a-input v-model="keyword" placeholder="请输入关键字" size="large" @keyup.enter.native="searchQuery">
            <template slot="addonAfter">
              <div style="color: #2a64d9;padding: 0 10px;font-size: 20px;font-weight: 600;letter-spacing: 2px;cursor: pointer" @click="searchQuery">搜索</div>
            </template>
          </a-input>
        </div>
      </div>
    </div>
    <a-spin :spinning="loading">
      <div class="mainContent">
        <div class="box-list">
          <div v-for="(group,groupIndex) in groupList" :key="groupIndex" class="box-item">
            <div class="box-top">
              <div class="box-top-left">
                <img class="box-icon" :src="img.ggzl">
                <div class="box-title">{{ group.categoryName }}</div>
              </div>
              <div class="box-more" @click="toMoreList(group)">更多</div>
            </div>
           <div style="padding-top: 20px">
             <a-empty v-if="!group.articleInfoList || (group.articleInfoList&&group.articleInfoList.length===0)" />
           </div>
            <div class="cu-list">
              <div v-for="i in group.articleInfoList" :key="i.id" class="cu-item text-cut" @click="$refs.detailModal.showModal(i)">{{ i.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <detail-modal ref="detailModal" />
  </div>
</template>

<script>
import DetailModal from './components/DetailModal'
export default {
  name: 'Index',
  components: { DetailModal },
  data() {
    return {
      img: {
        mlzg: require('./img/mlzg.png'),
        top: require('./img/top.png'),
        gxbg: require('./img/gxbg.png'),
        titleContent: require('./img/titleContent.png'),
        ggzl: require('./img/ggzl.png'),
        zcfg: require('./img/zcfg.png'),
        nbgl: require('./img/nbgl.png'),
        xwzl: require('./img/xwzl.png'),
        jslt: require('./img/jslt.png'),
        grfx: require('./img/grfx.png')
      },
      loading: false,
      keyword: '',
      groupList: []
    }
  },
  created() {
    this.searchQuery()
  },
  methods: {
    searchQuery() {
      this.loading = true
      this.getAction('/article/info/categoryGroupList', { tags: this.keyword }).then(res => {
        this.loading = false
        this.groupList = res.result
      })
    },
    toMoreList(group) {
      this.$router.push('/public/beautifulChina/moreList?categoryCode=' + (group.categoryCode || ''))
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  .topContent {
    background: #F9FDFF;
    display: flex;
    justify-content: space-between;
    padding: 8px 7%;

    .top-left {
      display: flex;
      align-items: center;

      .topTitle {
        font-family: cursive, fonsong;
        margin-left: 10px;
        color: #2a64d9;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 2px;
      }
    }

    .top-right {
      display: flex;
      align-items: center;
      color: #2a64d9;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }

  .titleContent {
    background-image: url("./img/top.png");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: bottom;
    width: 100%;
    height: 550px;
    padding-top: 30px;

    .customSearch {
      margin-top: 20px;

      /deep/ input {
        border-radius: 40px 0 0 40px;
        height: 60px;
        padding: 0 20px;
      }

      /deep/ .ant-input-group-addon {
        background: white;
        border-radius: 0 40px 40px 0;
      }
    }
  }

  .mainContent {
    margin-top: -200px;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    max-width: 1500px;

    .box-list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .box-item {
        background: url("./img/itemBox.png");
        width: 452px;
        height: 342px;
        padding: 30px 40px;
        .box-top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 5px;
          border-bottom: 2px solid #C3D3DF;
          .box-top-left{
            display: flex;
            align-items: center;
            .box-icon{

            }
            .box-title{
              font-size: 22px;
              font-weight: 600;
              color: #2a64d9;
              margin-left: 10px;
              letter-spacing: 1px;
            }
          }
          .box-more{
            color: #666;
            cursor: pointer;
          }
        }
        .cu-list{
          margin-top: 10px;
          .cu-item{
            font-size: 16px;
            padding: 6px 0;
            font-weight: 700;
            cursor: pointer;
            &:hover{
              color: #1c84c6;
            }
          }
        }
      }
    }
  }
}
</style>
