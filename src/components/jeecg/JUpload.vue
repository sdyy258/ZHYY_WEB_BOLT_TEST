<template>
  <div :id="containerId" style="position: relative">

    <!--  ---------------------------- begin 图片左右换位置 ------------------------------------- -->
    <div class="movety-container" :style="{top:top+'px',left:left+'px',display:moveDisplay}" style="padding:0 8px;position: absolute;z-index: 91;height: 32px;width: 104px;text-align: center;">
      <div :id="containerId+'-mover'" :class="showMoverTask?'uploadty-mover-mask':'movety-opt'" style="margin-top: 12px">
        <a style="margin: 0 5px;" @click="moveLast"><a-icon type="arrow-left" style="color: #fff;font-size: 16px" /></a>
        <a style="margin: 0 5px;" @click="moveNext"><a-icon type="arrow-right" style="color: #fff;font-size: 16px" /></a>
      </div>
    </div>
    <!--  ---------------------------- end 图片左右换位置 ------------------------------------- -->

    <a-upload
      name="file"
      :multiple="multiple"
      :action="uploadAction"
      :headers="headers"
      :data="{'biz':bizPath}"
      :file-list="fileList"
      :accept="accept"
      :before-upload="doBeforeUpload"
      :disabled="disabled"
      :return-url="returnUrl"
      :list-type="complistType"
      :class="{'uploadty-disabled':disabled}"
      @change="handleChange"
      @preview="handlePreview"
    >
      <template>
        <div v-if="isImageComp">
          <a-icon type="plus" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
        <a-button v-else-if="buttonVisible">
          <a-icon type="upload" />{{ text }}
        </a-button>
        <div v-else-if="textVisible"><a>{{ text }}</a></div>
      </template>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage">
    </a-modal>
  </div>
</template>

<script>

import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getFileAccessHttpUrl } from '@/api/manage'
import { baseURL } from '@/utils/request.js'
const FILE_TYPE_ALL = 'all'
const FILE_TYPE_IMG = 'image'
const FILE_TYPE_TXT = 'file'
const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10)
}
const getFileName = (path) => {
  if (path.lastIndexOf('\\') >= 0) {
    const reg = new RegExp('\\\\', 'g')
    path = path.replace(reg, '/')
  }
  return path.substring(path.lastIndexOf('/') + 1)
}
export default {
  name: 'JUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    text: {
      type: String,
      required: false,
      default: '点击上传'
    },
    fileType: {
      type: String,
      required: false,
      default: FILE_TYPE_ALL
    },
    /* 这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: 'temp'
    },
    value: {
      type: [String, Array],
      required: false
    },
    // update-begin- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // update-end- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    // 此属性被废弃了
    triggerChange: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
       * update -- author:lvdandan -- date:20190219 -- for:Jupload组件增加是否返回url，
       * true：仅返回url
       * false：返回fileName filePath fileSize
       */
    returnUrl: {
      type: Boolean,
      required: false,
      default: true
    },
    number: {
      type: Number,
      required: false,
      default: 0
    },
    buttonVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    textVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    beforeUpload: {
      type: Function
    },
    uploadUrl: {
      type: String,
      default: '/sys/common/upload'
    },
    accept: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      uploadAction: baseURL + this.uploadUrl,
      headers: {},
      fileList: [],
      newFileList: [],
      uploadGoOn: true,
      previewVisible: false,
      // ---------------------------- begin 图片左右换位置 -------------------------------------
      previewImage: '',
      containerId: '',
      top: '',
      left: '',
      moveDisplay: 'none',
      showMoverTask: false,
      moverHold: false,
      currentImg: ''
      // ---------------------------- end 图片左右换位置 -------------------------------------
    }
  },
  computed: {
    isImageComp() {
      return this.fileType === FILE_TYPE_IMG
    },
    complistType() {
      return this.fileType === FILE_TYPE_IMG ? 'picture-card' : 'text'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        const val = this.value
        if (val instanceof Array) {
          if (this.returnUrl) {
            this.initFileList(val.join(','))
          } else {
            this.initFileListArr(val)
          }
        } else {
          this.initFileList(val)
        }
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    // ---------------------------- begin 图片左右换位置 -------------------------------------
    this.headers = { 'X-Access-Token': token }
    this.containerId = 'container-ty-' + new Date().getTime()
    // ---------------------------- end 图片左右换位置 -------------------------------------
  },
  mounted() {
    const moverObj = document.getElementById(this.containerId + '-mover')
    if (moverObj) {
      moverObj.addEventListener('mouseover', () => {
        this.moverHold = true
        this.moveDisplay = 'block'
      })
      moverObj.addEventListener('mouseout', () => {
        this.moverHold = false
        this.moveDisplay = 'none'
      })
    }

    const picList = document.getElementById(this.containerId) ? document.getElementById(this.containerId).getElementsByClassName('ant-upload-list-picture-card') : []
    if (picList && picList.length > 0) {
      picList[0].addEventListener('mouseover', (ev) => {
        ev = ev || window.event
        const target = ev.target || ev.srcElement
        if (target.className == 'ant-upload-list-item-info') {
          this.showMoverTask = false
          const item = target.parentElement
          this.left = item.offsetLeft
          this.top = item.offsetTop + item.offsetHeight - 50
          this.moveDisplay = 'block'
          this.currentImg = target.getElementsByTagName('img')[0].src
        }
      })

      picList[0].addEventListener('mouseout', (ev) => {
        ev = ev || window.event
        const target = ev.target || ev.srcElement
        // console.log('移除',target)
        if (target.className == 'ant-upload-list-item-info') {
          this.showMoverTask = true
          setTimeout(() => {
            if (this.moverHold === false) { this.moveDisplay = 'none' }
          }, 100)
        }
        if (target.className == 'ant-upload-list-item ant-upload-list-item-done' || target.className == 'ant-upload-list ant-upload-list-picture-card') {
          this.moveDisplay = 'none'
        }
      })
      // ---------------------------- end 图片左右换位置 -------------------------------------
    }
  },

  methods: {
    initFileListArr(val) {
      if (!val || val.length == 0) {
        this.fileList = []
        return
      }
      const fileList = []
      for (var a = 0; a < val.length; a++) {
        const url = getFileAccessHttpUrl(val[a].filePath)
        fileList.push({
          uid: uidGenerator(),
          name: val[a].fileName,
          status: 'done',
          url: url,
          response: {
            status: 'history',
            message: val[a].filePath
          }
        })
      }
      this.fileList = fileList
    },
    initFileList(paths) {
      if (!paths || paths.length == 0) {
        // return [];
        // update-begin- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Jupload组件初始化bug
        this.fileList = []
        return
        // update-end- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Jupload组件初始化bug
      }
      const fileList = []
      const arr = paths.split(',')
      for (var a = 0; a < arr.length; a++) {
        const url = getFileAccessHttpUrl(arr[a])
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: 'history',
            message: arr[a]
          }
        })
      }
      this.fileList = fileList
    },
    handlePathChange(info) {
      const uploadFiles = this.fileList
      let path = ''
      if (!uploadFiles || uploadFiles.length == 0) {
        path = ''
      }
      const arr = []

      for (var a = 0; a < uploadFiles.length; a++) {
        // update-begin-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
        if (uploadFiles[a].status === 'done') {
          arr.push(uploadFiles[a].response.message)
        } else {
          return
        }
        // update-end-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
      }
      if (arr.length > 0) {
        path = arr.join(',')
      }
      if (info.file.response.success) {
        this.$emit('change', path)
        this.$emit('uploadSuccess', info)
      } else {
        this.$message.warning(info.file.response.message)
      }
    },
    doBeforeUpload(file) {
      this.uploadGoOn = true
      var fileType = file.type
      if (this.fileType === FILE_TYPE_IMG) {
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片')
          this.uploadGoOn = false
          return false
        }
      }
      // 扩展 beforeUpload 验证
      if (typeof this.beforeUpload === 'function') {
        return this.beforeUpload(file)
      }
      if (this.accept) {
        const fileNameType = file.name.split('.').slice(-1)[0]
        const allowFileType = this.accept.split(',').map(item => item.substr(1))
        if (allowFileType.indexOf(fileNameType) === -1) {
          const str = allowFileType.toString()
          this.$message.warning(`请上传${str}文件`)
          return false
        }
      }
      return true
    },
    handleChange(info) {
      console.log('--文件列表改变--')
      if (!info.file.status && this.uploadGoOn === false) {
        info.fileList.pop()
      }
      let fileList = info.fileList
      if (info.file.status === 'done') {
        if (this.number > 0) {
          fileList = fileList.slice(-this.number)
        }
        if (info.file.response.success) {
          fileList = fileList.map((file) => {
            if (file.response) {
              const reUrl = file.response.message
              file.url = getFileAccessHttpUrl(reUrl)
            }
            return file
          })
        }
        // this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        // returnUrl为true时仅返回文件路径
        if (this.returnUrl) {
          this.handlePathChange(info)
        } else {
          // returnUrl为false时返回文件名称、文件路径及文件大小
          this.newFileList = []
          for (var a = 0; a < fileList.length; a++) {
            // update-begin-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
            if (fileList[a].status === 'done') {
              var fileJson = {
                fileName: fileList[a].name,
                filePath: fileList[a].response.message,
                fileSize: fileList[a].size
              }
              this.newFileList.push(fileJson)
            } else {
              return
            }
            // update-end-author:lvdandan date:20200603 for:【TESTA-514】【开源issue】多个文件同时上传时，控制台报错
          }
          this.$emit('change', this.newFileList)
        }
      }
    },
    handleDelete(file) {
      // 如有需要新增 删除逻辑
      console.log(file)
    },
    handlePreview(file) {
      if (this.fileType === FILE_TYPE_IMG) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      } else {
        location.href = file.url
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    // ---------------------------- begin 图片左右换位置 -------------------------------------
    moveLast() {
      // console.log(ev)
      // console.log(this.fileList)
      // console.log(this.currentImg)
      const index = this.getIndexByUrl()
      if (index == 0) {
        this.$message.warn('未知的操作')
      } else {
        const curr = this.fileList[index].url
        const last = this.fileList[index - 1].url
        const arr = []
        for (let i = 0; i < this.fileList.length; i++) {
          if (i == index - 1) {
            arr.push(curr)
          } else if (i == index) {
            arr.push(last)
          } else {
            arr.push(this.fileList[i].url)
          }
        }
        this.currentImg = last
        this.$emit('change', arr.join(','))
      }
    },
    moveNext() {
      const index = this.getIndexByUrl()
      if (index == this.fileList.length - 1) {
        this.$message.warn('已到最后~')
      } else {
        const curr = this.fileList[index].url
        const next = this.fileList[index + 1].url
        const arr = []
        for (let i = 0; i < this.fileList.length; i++) {
          if (i == index + 1) {
            arr.push(curr)
          } else if (i == index) {
            arr.push(next)
          } else {
            arr.push(this.fileList[i].url)
          }
        }
        this.currentImg = next
        this.$emit('change', arr.join(','))
      }
    },
    getIndexByUrl() {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === this.currentImg || encodeURI(this.fileList[i].url) === this.currentImg) {
          return i
        }
      }
      return -1
    }
  }
}
</script>

<style lang="less">
.uploadty-disabled{
  .ant-upload-list-item {
    .anticon-close{
      display: none;
    }
    .anticon-delete{
      display: none;
    }
  }
  /*update-begin-author:taoyan date:2022-12-5 for: issues/4250 建议JUpload组件，disabled为true的时候上传button能够变灰或者其他样式图案，便于知晓无法再点击上传*/
  .ant-btn, .ant-upload-disabled{
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
  }
  /*update-end-author:taoyan date:2022-12-5 for: issues/4250 建议JUpload组件，disabled为true的时候上传button能够变灰或者其他样式图案，便于知晓无法再点击上传*/

}
  //---------------------------- begin 图片左右换位置 -------------------------------------
  .uploadty-mover-mask{
    background-color: rgba(0, 0, 0, 0.5);
    opacity: .8;
    color: #fff;
    height: 28px;
    line-height: 28px;
  }
  //---------------------------- end 图片左右换位置 -------------------------------------
</style>
