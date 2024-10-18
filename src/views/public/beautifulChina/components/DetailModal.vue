<template>
  <a-modal
    class="customModal"
    centered
    :width="900"
    :visible="visible"
    :mask-closable="true"
    destroy-on-close
    :footer="null"
    cancel-text="关闭"
    @cancel="visible=false"
  >
    <template slot="title">
      <div style="text-align: center;font-size: 24px;font-weight: 600;font-family: cursive">{{ model.title }}</div>
    </template>
    <div style="padding-bottom: 30px;border-bottom: 1px solid #ccc;">
      <div style="background:#F0F5FF;padding: 10px 15px;border-radius: 6px;">
        <div style="display: flex">
          <img v-viewer :src="model.coverImage" style="width: 120px;max-height: 80px">
          <div style="flex: 1;margin-left: 20px">
            <div style="font-size: 18px;font-weight: 600;display: flex;justify-content: space-between">
              <div>内容摘要</div>
              <div v-if="model.tags">
                <a-tag v-for="(i,index) in model.tags.split(',')" :key="index" color="#108EE9">{{ i }}</a-tag>
              </div>
            </div>
            <div class="text-cut2" style="margin-top: 5px;color: #495E78">{{ model.summary }}</div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 30px;padding-bottom: 30px;border-bottom: 1px solid #ccc;">
      <!--富文本-->
      <div v-if="model.contentType==1" v-html="model.content" />
      <template v-if="model.fileUrl">
        <div v-if="model.contentType==2">
          <PdfPreview :path="model.fileUrl" height="600px" />
        </div>
        <!-- 视频或音频-->
        <div v-if="model.contentType==3||model.contentType==4">
          <video style="width: 100%;height: 450px;border: 1px solid #0e34a5" controls>
            <source :src="model.fileUrl">
          </video>
        </div>
      </template>
    </div>
    <div style="margin-top: 20px">
      <div style="font-size: 18px;font-weight: 600">文件列表</div>
    </div>
    <div>
      <div v-for="i in fileList" :key="i.id" style="background: #F8F8F8;padding: 10px 15px;margin: 10px 0;border-radius: 6px;display: flex;justify-content: space-between">
        <div class="text-cut" style="flex: 1">{{ i.fileName }}</div>
        <div style="margin-left: 20px">
          <!--          <a @click="handlePreviewItem(i)">预览</a>-->
          <a style="margin-left: 20px" @click="handleDownloadItem(i)">下载</a>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PdfPreview from '@/components/custom/PdfPreview'
export default {
  components: { PdfPreview },
  data() {
    return {
      visible: false,
      model: {},
      loading: false,
      fileList: []
    }
  },
  methods: {
    showModal(record) {
      this.visible = true
      this.model = Object.assign({}, record)
      this.loading = true
      this.getAction('/article/info/view', { id: record.id }).then(res => {
        this.$emit('view')
        this.loading = false
        this.model = res.result
        this.fileList = res.result.annexList || []
      })
    },
    iframeLoaded() {
      this.loading = false
    },
    handlePreviewItem(item) {
      if (item.fileUrl) {
        window.open(this.$utils.getPreviewFileUrl(item.fileUrl))
      } else {
        this.$message.warning('文件地址不存在')
      }
    },
    handleDownloadItem(item) {
      this.$utils.downloadFile(item.fileUrl)
    }
  }
}
</script>
<style scoped lang="less">
.customModal {
  /deep/ .ant-modal {
    padding-bottom: 0 !important;

    .ant-modal-body {
      height: calc(100vh - 60px);
      overflow: auto;
    }
  }
}

.text-cut2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
