<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="uploadFileModal">
        <div class="gray-bg">
          <div class="upload-item upload-url">
            <span>上传目录：</span>
            <span class="name">{{ pathName }}</span>
            <a-button v-if="!pathName" type="primary" @click="selectPath">选择目录</a-button>
            <a-button v-else-if="pathName && pathShow" type="primary" @click="selectPath">变更目录</a-button>
          </div>
          <div class="upload-item upload-file">
            <span>上传文件：</span>
            <j-upload v-model="fileList" :disabled="!pathName && pathShow" :before-upload="beforeUpload" :multiple="false" upload-url="/cCoursewareInfo/cCoursewareInfo/upload" text="选择文件" style="width:80%" @change="handleChange" />
          </div>
        </div>
        <div class="white-bg">
          <div class="upload-item upload-format">
            <span>支持格式：</span>
            <ul class="detail-list">
              <li>
                <div>文本文件：.pdf</div>
                <!-- <div>表格文件：.xls、.xlsx</div> -->
                <!-- <div>演示文稿：.ppt、.pptx</div> -->
              </li>
              <li>
                <!-- <div>音频文件：.mp3</div> -->
                <div>视频文件：.mp4</div>
              </li>
            </ul>
          </div> 
          <div class="upload-item upload-limit">
            <span>上传说明：</span>
            <span class="detail">mp4文件需小于1GB；</span>
            <!-- <span class="detail">pdf文件需小于100MB</span> -->
            <!-- <span class="detail">pdf文件需小于100MB，其他文件需小于1GB</span> -->
          </div>
          <!-- <div class="upload-item upload-hint"> -->
          <!-- <a>说明</a> -->
          <!-- <span class="detail">上传mp4格式文件请查看编码说明</span> -->
          <!-- </div> -->
        </div>
      </div>
    </a-spin>
    <a-modal v-model="visibleDetail" title="选择路径" @ok="selectPathOk">
      <a-tree
        v-model="checkedKeys"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        :auto-expand-parent="false"
        @expand="onExpand"
        @select="onSelect"
      />
    </a-modal>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, postAction } from '@/api/manage'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      loading: false,
      title: '上传文件',
      visible: false,
      confirmLoading: false,
      disableSubmit: false,
      readOnly: false,
      visibleDetail: false,
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      selectedName: '',
      treeData: [],
      pathName: '',
      fileList: [],
      urlList: [],
      hasChildrenField: 'hasChild',
      pidField: 'pid',
      url: {
        list: '/sys/category/rootList',
        childList: '/sys/category/childList',
        uploadFile: '/cCoursewareInfo/cCoursewareInfo/uploadFile'
      },
      pathShow: true,
      categoryId: ''
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record, data) {
      this.visible = true
      this.pathName = ''// 目录名默认为空
      this.fileList = []// 上传地址默认空
      if (record.categoryId) {
        this.pathShow = false
        this.pathName = record.categoryName
        this.categoryId = record.categoryId
      } else {
        this.pathShow = true
      }
      if (data.categoryId) {
        this.selectedKeys = [data.categoryId]
        this.pathName = data.categoryName
      } else {
        this.selectedKeys = []
      }
      getAction(this.url.list).then(res => {
        if (res.success) {
          getAction(this.url.list, { type: 9, pageSize: 500 }).then(res => {
            if (res.success) {
              const result = res.result
              if (Number(result.total) > 0) {
                this.ipagination.total = Number(result.total)
                this.treeData = this.getDataByResult(res.result.records)
                console.log('treeData', this.treeData)
                // return this.loadDataByExpandedRows(this.dataSource)
              } else {
                this.ipagination.total = 0
                this.treeData = []
              }
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getDataByResult(result) {
      if (result && result.length > 0) {
        return result.map(item => {
          // 判断是否标记了带有子节点
          if (item[this.hasChildrenField] == '1') {
            const loadChild = { key: item.id + '_loadChild', title: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          item.title = item.name
          item.key = item.id
          return item
        })
      }
    },
    //   选择路径
    selectPath() {
      this.visibleDetail = true
      if (!this.pathName) {
        this.selectedKeys = []
      }
    },
    //   选择路径提交
    selectPathOk() {
      this.pathName = this.selectedName
      this.visibleDetail = false
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      if (expandedKeys.length > 0) {
        let list = []
        expandedKeys.forEach(item => {
          list = this.treeData.filter(res => res.key == item)
          list.forEach(record => {
            const params = {}
            params[this.pidField] = record.key
            getAction(this.url.childList, params).then((res) => {
              if (res.success) {
                if (res.result && res.result.length > 0) {
                  record.children = this.getDataByResult(res.result)
                  this.treeData = [...this.treeData]
                } else {
                  record.children = ''
                  record.hasChildrenField = '0'
                }
              } else {
                this.$message.warning(res.message)
              }
            })
          })
        })
      }
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.selectedName = info.node.title
    },
    // 文件上传前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const files = file.name.split('.')
        const num = files.length - 1
        const type = file.name.split('.')[num]
        // if (type !== 'doc' && type !== 'docx' && type !== 'pdf' && type !== 'xls' && type !== 'xlsx' && type !== 'ppt' && type !== 'pptx' && type !== 'mp3' && type !== 'mp4' && type !== 'wmv') {
        if (type !== 'mp4' && type !== 'pdf' ) {
          this.$message.warning('请上传支持的格式文件!')
          return reject(false)
        }
        return resolve(true)
      })
    },
    handleChange(value) {
      this.urlList = []
      value.split(',').forEach(item => {
        const obj = {}
        const filePath = item.split(';')[0]
        const second = item.split(';')[1]
        if (!this.pathShow) {
          obj.categoryId = this.categoryId
        } else {
          obj.categoryId = this.selectedKeys.join(',')
        }
        obj.fileTimeLength = second.split(':')[1]
        obj.filePath = filePath
        obj.coursewareName = filePath.split('/')[filePath.split('/').length - 1]
        this.urlList.push(obj)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      if (this.urlList.length === 0) {
        this.$message.warning('请先上传文件！')
        return
      }
      const params = {
        coursewareList: this.urlList
      }
      postAction(this.url.uploadFile, params).then((res) => {
        if (res.success) {
          this.$message.success('上传成功')
          this.visible = false
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
  <style scoped lang="less">
    .uploadFileModal .gray-bg .upload-item{
        padding: 20px 30px;
        background: #f1f3f8;
        min-height: 74px;
        position: relative;
        display: flex;
        align-items: center;
    }
    .uploadFileModal .upload-file, .uploadFileModal .upload-limit{
        margin-top: 10px;
    }
    .uploadFileModal .upload-item .name{
        font-size: 14px;
        display: inline-block;
        // width: 280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: bottom;
        // line-height: 34px;
        // height: 34px;
        cursor: pointer;
        margin-right: 10px;
    }
    .uploadFileModal .white-bg{
        padding: 20px 30px 30px;
    }
    .uploadFileModal .upload-item .detail-list{
        display: inline-block;
        vertical-align: top;
        padding-left: 0;
        li{
            width: 200px;
            // height: 60px;
            float: left;
            font-size: 14px;
        }
    }
    .uploadFileModal .upload-hint{
        display: flex;
        padding-left: 70px;
        align-items: center;
        font-size: 14px;
    }
    ul li{
        list-style: none;
    }
  </style>
