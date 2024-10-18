<template>
  <a-modal
    :visible="visible"
    class="full-screen-modal modalWrap"
    :footer="null"
    :mask-closable="false"
    :mask="false"
    :z-index="99"
	destroyOnClose
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
              <p class="liP">{{ model.categoryId_dictText }}</p>
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
              <span class="color" @click="download(i)">{{ `${i.slice(i.lastIndexOf('/'),i.lastIndexOf('_')).split('/')[1]}${i.slice(i.lastIndexOf('.'))}` }}</span>
            </div>
          </span>
        </div>
      </a-card>
    </div>
    <a-button type="primary" style="position: absolute;right: 24px;top: 12px" @click="visible=false">返回</a-button>
    <div />
  </a-modal>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      visible: false,
      model: {}
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
      // this.model = Object.assign({}, record)
    },
    download(url) {
      window.open(url)
    }
  }
}
</script>

<style scoped lang='less'>
/deep/ .ant-modal-header, /deep/ .ant-modal-close {
  display: none;
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
	/deep/ li{
		list-style: none !important;
	}
</style>
