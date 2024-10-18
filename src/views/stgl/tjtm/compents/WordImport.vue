<template>
  <div class="import-panel">
    <div class="content">
      <div class="step step-1">
        <div class="step-title">第一步：下载Word试题模版</div>
        <div class="step-content">
          <div class="desc">
            <img src="../img/illustrate.png" class="img" style="margin: 0 5px;">
            <span>请下载模板，按照模板格式要求编辑后上传，完成导入。</span>
          </div>
          <a-button type="primary" icon="download" @click="handleClickDownloadFile('试题模板')">下载模板</a-button>
        </div>
      </div>
      <div class="step step-2" style="margin-top: 15px;">
        <div class="step-title">第二步：上传完善后的文档</div>
        <div class="step-text">
          <div class="title-img">
            <img src="../img/Word.png" class="img">
            <br>
            <div class="desc">
              <img src="../img/illustrate.png" class="img" style="margin: 0 5px;">
              <span> Word批量导入功能仅支持“单选题、多选题、判断题、填空题”四类题型(支持大小在1MB内的文件)</span>
            </div>
            <div class="step-2-button">
              <a-upload
                name="file"
                :multiple="false"
                :action="importWord1"
                :headers="tokenHeader"
                :show-upload-list="false"
                @change="handleImportExcel"
              >
                <a-button>
                  <a-icon type="upload" />上传文件
                </a-button>
              </a-upload>
              <a-upload
                name="file"
                :multiple="false"
                :action="importWord2"
                :headers="tokenHeader"
                :show-upload-list="false"
                @change="handleImportExcel"
              >
                <a-button>
                  <a-icon type="upload" />持证上岗导入
                </a-button>
              </a-upload>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="step-button">
        <a-button size="large">取消</a-button>
        <a-upload
          name="file"
          :multiple="false"
          :action="importWord1"
          :headers="tokenHeader"
          :show-upload-list="false"
          @change="handleImportExcel"
        >
          <a-button type="primary" size="large">导入</a-button>
        </a-upload>
      </div> -->
    </div>
  </div>
</template>
<script>
import { getFileAccessHttpUrl, downloadFile, uploadAction, downFile } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      url: {
        list: '/sys/user/list',
        exportXlsUrl: '/tQuestion/tQuestion/downloadWordTemplate',
        importWord: '/tQuestion/tQuestion/importWord',
        importWord1: '/tQuestion/tQuestion/importWord1',
        importWord2: '/tQuestion/tQuestion/importWord2'
      }
    }
  },
  computed: {
    importWord: function() {
      const url = this.$baseUrl + this.url.importWord
      return url
    },
    importWord1: function() {
      return `${this.$baseUrl}${this.url.importWord1}`
    },
    importWord2: function() {
      return `${this.$baseUrl}${this.url.importWord2}`
    }
  },
  methods: {
    handleClickDownloadFile(fileName) {
      if (!fileName || typeof fileName !== 'string') {
        fileName = '导出文件'
      }
      downFile('/tQuestion/tQuestion/downloadWordTemplate', '', 'post').then(data => {
        if (!data || data.size === 0) {
          Vue.prototype['$message'].warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-word' }), fileName + '.docx')
        } else {
          const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-word' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.docx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
      // let url = getFileAccessHttpUrl('')
      // window.open(url)
    },
    handleImportExcel(info) {
      this.loading = true
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const { message, result: { msg, fileUrl, fileName }} = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (<div>
                <span>{msg}</span><br/>
                <span>具体详情请 <a href={href} target='_blank' download={fileName}>点击下载</a> </span>
              </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.$router.push({
            name: 'stgl-tkgl',
            query: { queryType: true }
          })
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        if (info.file.response.status === 500) {
          const data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes('Token失效')) {
            this.$error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上传失败: ${info.file.msg} `)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.import-panel {
  width: 800px;
  margin: auto;
  padding-bottom: 65px;
}
.content {
  line-height: 20px;
  border-radius: 4px;
  padding: 20px 40px;
  .step {
    background-image: url(../img/stepBack2.png);
    text-align: left;
    padding: 10px 20px;
    .step-title {
      font-weight: 500;
    }
    .step-text{
      background: #fff;
      margin: 20px;
      border: 1px dashed #ccc;
      padding: 80px 68px;;
      text-align: center;
      .step-2-button{
        margin-top: 20px;
      }
    }
    .step-content {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding-top: 14px;
      .desc {
        margin-bottom: 10px;
      }
    }
    .step-2-button{
      justify-content: space-around;
      display: flex;
    }
  }
  .title-img{
    .img{
      margin-bottom: 20px;
    }
  }
  .step-button{
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;

  }
}
</style>
