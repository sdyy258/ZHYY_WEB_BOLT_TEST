<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    class="modalWrap"
    :footer="null"
    @cancel="visible=false"
  >
    <h1>信息详情</h1>
    <div class="cardWrap">
      <a-card :bordered="true" class="cardTop">
        <ul>
          <li class="first">
            <div class="firstDiv">
              <span class="firstSpan">名 称</span>
              <p class="firstP">{{ model.lawName }}</p>
            </div>
          </li>
          <li class="first">
            <div class="liDiv">
              <span class="firstSpan">索 引 号</span>
              <p class="liP">{{ model.indexNumber }}</p>
            </div>
            <div class="liDiv">
              <span class="firstSpan">分　类</span>
              <p class="liP">{{ model.categoryName }}</p>
            </div>
          </li>
          <li class="first">
            <div class="liDiv">
              <span class="firstSpan">文　号</span>
              <p class="liP">{{ model.documentNumber }}</p>
            </div>
            <div class="liDiv">
              <span class="firstSpan">主 题 词</span>
              <p class="liP">{{ model.keyword }}</p>
            </div>
          </li>
        </ul>
      </a-card>
      <a-card :bordered="false" class="cardBoby">
        <h2 class="title">{{ model.lawName }}</h2>
        <span v-html="model.content" />
        <div v-if="filePath.length>0" class="flex content">
          解读：<span>
            <div v-for="(i,index) in filePath" :key="index">
              {{ index+1 }}.
              <span class="color" @click="download(i)">{{ `${i.split('/')[1].slice(0,i.split('/')[1].lastIndexOf('_'))}${i.slice(i.lastIndexOf('.'))}` }}</span>
            </div>
          </span>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ModalDetail',

  data() {
    return {
      confirmLoading: false,
      visible: false,
	  title: '',
	  model: {},
	  filePath: []
    }
  },
  methods: {
    showModal(record) {
      this.visible = true
	  this.model = { ...record }
	  this.filePath = []
	  if (this.model.filePath) {
        this.filePath = this.model.filePath.split(',')
	  }
    },
    download(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="less" scoped>
	.flex{
		display: flex;
	}
	.modalWrap{
		text-align: center;
	}
	.cardWrap{
		background:#ECECEC;
		padding:30px;
		height: 600px;
    	overflow-y: scroll;
		.cardTop{
			margin-bottom: 30px;
			text-align: left;
			border: 1px #F2F2F2 solid;
			background: #fff;
			padding: 10px 18px;
			-webkit-box-shadow: 0 0 10px #E8E8E8;
			-moz-box-shadow: 0 0 10px #E8E8E8;
			box-shadow: 0 0 10px #E8E8E8;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s 0.12s;
			ul{
				list-style: none;
			}
			.first{
				overflow: hidden;
				border-bottom: 1px #F0F0F0 solid;
				line-height: 46px;
				font-size: 16px;
				clear: both;
				.firstDiv{
					width: 100%;
				}
				.liDiv{
					width: 50%;
					float: left;
				}
				.firstSpan{
					float: left;color: #0B7BCD;
					padding-right: 15px;
					border-right: 2px #E6E6E6 solid;
					margin-right: 12px;
					text-align: justify;
					text-align-last: justify;
					width: 82px;
					display: block;
					float: left;
					height: 26px;
					line-height: 26px;
					margin-top: 12px;
				}
				.firstP{
					font-size: 16px;
					float: left;
					width: 87.2%;
					height: 26px;
				}
				.liP{
					height: 26px;
				}
			}
		}
		.cardBoby{
			.title{
				color: 	#C60002;
				border-bottom: 1.5px solid #C60002;
				padding-bottom: 20px;
			}
			.content{
				margin-left: 2em;
				.color{
					color: #0B7BCD;

				}
			}

		}
	}

</style>
