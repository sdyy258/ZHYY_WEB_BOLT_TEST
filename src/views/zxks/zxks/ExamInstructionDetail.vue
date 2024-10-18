<template>
  <a-modal
    :width="1000"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    :footer="null"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="examTop">
        <div class="examName">
          {{ model.name }}
        </div>
        <div class="examTime">
          <div class="examTimeDiv">
            <span>考试时间：{{ model.limitStartTime + '~' + model.limitEndTime }}</span>
          </div>
        </div>
      </div>
      <div class="examDiv">
        <div class="examTitle">
          <span>考试须知</span>
        </div>
        <div>{{ data.examExplain }}</div>
      </div>
      <div class="examDiv">
        <div class="examTitle">
          <span>设备检查</span>
        </div>
        <div class="exam-box">
          <div class="question">
            <span>本次考试须确保以下环境全部检查正常，如有检查异常，请根据提示信息查看帮助或更换设备环境，否则无法顺利完成考试。</span>
          </div>
          <div class="check">
            <div class="checkTitle">
              <img src="./image/llq.png" alt="">
              <span class="checkText">浏览器检查</span>
            </div>
            <div v-if="checkStatusBrowser" class="checkStatus">
              <a-icon type="check-circle" theme="filled" class="success" style="font-size: 16px;margin-right: 5px;" />
              <span class="success">检查正常</span>
            </div>
            <div v-else class="checkStatus">
              <a-icon type="close-circle" theme="filled" class="error" style="font-size: 16px;margin-right: 5px;" />
              <span class="error">检查异常</span>
            </div>
          </div>
          <div v-if="data.isPreventingCheating == 1 && (data.isCameraCapture == 1 || data.isBeforePic == 1)" class="check">
            <div class="checkTitle">
              <img src="./image/sxt.png" alt="">
              <span class="checkText">摄像头检查</span>
            </div>
            <div v-if="checkStatusCamera" class="checkStatus">
              <a-icon type="check-circle" theme="filled" class="success" style="font-size: 16px;margin-right: 5px;" />
              <span class="success">检查正常</span>
            </div>
            <div v-else class="checkStatus">
              <a-icon type="close-circle" theme="filled" class="error" style="font-size: 16px;margin-right: 5px;cursor: pointer" @click="initialize" />
              <span class="error">检查异常</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="data.identityCheck == 2 || data.identityCheck == 3" class="examDiv">
        <div class="examTitle">
          <span>身份认证</span>
        </div>
        <div class="exam-box">
          <div v-if="data.identityCheck == 2" class="checkBox">
            <div class="checkTitle">
              <img src="./image/sjh.png" alt="">
              <span class="checkText">手机号验证</span>
            </div>
            <div class="checkStatus">
              <div style="display: flex;">
                <a-input v-model="model.phone" class="checkInput" placeholder="请输入手机号" />
                <a-input v-model="model.verificationCode" class="checkInput" placeholder="验证码" />
                <a-button class="checkInput" style="background-color: #DFDFDF;color: #333333;" @click="getCode">获取验证码</a-button>
                <a-button class="checkInput" type="primary" @click="authenticationPhone">认证</a-button>
              </div>
              <div>
                <span v-if="!checkPhone">待认证</span>
                <span v-else class="success">已认证</span>
              </div>
            </div>
          </div>
          <div v-if="data.identityCheck == 3" class="checkBox">
            <div class="checkTitle">
              <img src="./image/sfz.png" alt="">
              <span class="checkText">身份证验证</span>
            </div>
            <div class="checkStatus">
              <div style="display: flex;">
                <a-input v-model="model.cardId" class="checkInput" placeholder="请输入身份证号" />
                <a-button class="checkInput" type="primary" @click="authenticationId">认证</a-button>
              </div>
              <div>
                <span v-if="!checkId">待认证</span>
                <span v-else class="success">已认证</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="data.isPreventingCheating == 1 && data.isBeforePic == 1" class="examDiv">
        <div class="examTitle">
          <span>考前拍照</span>
        </div>
        <div class="exam-box">
          <div class="question">
            <span>请将摄像头对准人脸完成拍照，确保摄像头能正常使用。如摄像头无法拍照，请检查设备，否则本次成绩无效。</span>
          </div>
          <div class="check">
            <div class="checkCamera">
              <video id="video" width="540" height="380" />
              <a-button type="primary" @click="captureImage">拍照</a-button>
            </div>
            <!-- <div v-if="!model.picUrl" class="checkCamera">
              <video id="video" width="540" height="380" />
              <a-button type="primary" @click="captureImage">拍照</a-button>
            </div>
            <div v-else class="checkCamera">
              <img :src="model.picUrl" alt="">
            </div> -->
          </div>
        </div>
      </div>
      <div class="examBottom">
        <div class="examCheckbox">
          <a-checkbox v-model="examNotice">
            我已阅读考试须知
          </a-checkbox>
        </div>
        <div class="examButton">
          <a-button type="primary" @click="handleOk">开始考试</a-button>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
let _mediaStream
export default {
  data() {
    return {
      loading: false,
      visible: false,
      confirmLoading: false,
      readOnly: false,
      model: {},
      data: {},
      examNotice: false,
      checkStatusBrowser: true, // 浏览器检查
      checkStatusCamera: false, // 摄像头检查
      checkPhone: false, // 认证手机号
      checkId: false, // 认证身份证号
      url: {
        list: '/tExam/tExam/examInstructions',
        sendVerificationCode: '/tExam/tExam/sendVerificationCode',
        checkVerificationCode: '/tExam/tExam/checkVerificationCode',
        checkIdNo: '/tExam/tExam/checkIdNo'
      }
    }
  },
  methods: {
    showModal(item, result) {
      this.data = result
      this.$set(this.model, 'phone', this.data.phone)
      // this.model.cardId = this.data.idNo
      if (this.data.isPreventingCheating == 1 && (this.data.isCameraCapture === 1 || this.data.isBeforePic === 1)) {
        this.initialize()
      }
      this.model = item
      this.model.picUrl = ''
      this.checkPhone = false // 认证手机号
      this.checkId = false // 认证身份证号
      this.examNotice = false
      this.visible = true
      // this.getNotice(item.id)
    },
    // 获取考试须知内容
    getNotice(id) {
      getAction(this.url.list, { examId: id }).then((res) => {
        if (res.success) {
          this.data = res.result
          this.$set(this.model, 'phone', this.data.phone)
          // this.model.cardId = this.data.idNo
          if (this.data.isPreventingCheating == 1 && (this.data.isCameraCapture === 1 || this.data.isBeforePic === 1)) {
            this.initialize()
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 获取验证码
    getCode() {
      if (!this.model.phone) {
        this.$message.warning('请先输入手机号')
        return
      }
      if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(this.model.phone)) {
        getAction(this.url.sendVerificationCode, { phone: this.model.phone }).then((res) => {
          if (res.success) {
            this.$message.success('验证码已发送')
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning('请输入正确格式的手机号码!')
      }
    },
    // 认证手机号
    authenticationPhone() {
      if (!this.model.verificationCode) {
        this.$message.warning('请先获取验证码！')
        return
      }
      getAction(this.url.checkVerificationCode, { verificationCode: this.model.verificationCode }).then((res) => {
        if (res.success) {
          this.checkPhone = true
          this.$message.success('手机号认证成功！')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 认证身份证
    authenticationId() {
      if (new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).test(this.model.cardId)) {
        getAction(this.url.checkIdNo, { id: this.model.cardId }).then((res) => {
          if (res.success) {
            this.checkId = true
            this.$message.success('身份证号认证成功！')
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning('请输入正确格式的身份证号码!')
      }
    },
    initialize() {
      //  判断浏览器, 获得用户设备的兼容方法
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      var constraints = { audio: true, video: { width: 1280, height: 720 }}

      // 调用摄像头
      navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
          _mediaStream = mediaStream
          console.log('# 初始化 摄像头')
          // 成功后获取视频流：mediaStream
          var video = document.querySelector('video')
          // 静音
          video.muted = true
          //  赋值 video 并开始播放
          video.srcObject = mediaStream
          video.onloadedmetadata = function(e) {
            video.play()
          }
          this.checkStatusCamera = true
        })
        .catch(err => {
          alert('请打开摄像头，否则将无法考试')
          this.checkStatusCamera = false
        })
    },
    // 拍照
    captureImage() {
      if (!this.checkStatusCamera) {
        this.$message.warning('请先检查摄像头')
        return
      }
      const canvas = document.createElement('canvas')
      const video = document.getElementById('video')
      // canvas.width = video.videoWidth * this.scale
      // canvas.height = video.videoHeight * this.scale
      canvas.width = 520
      canvas.height = 400
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      const img = document.createElement('img')
      img.src = canvas.toDataURL()
      const data = canvas.toDataURL()
      console.log(data)
      postAction('/tExamPaperUserBeforePic/tExamPaperUserBeforePic/upload', { base64Str: data }).then(res => {
        if (res.success) {
          this.model.picUrl = res.result
          this.$message.success('拍照成功')
          this.$forceUpdate()
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      if (!this.examNotice) {
        this.$message.warning('请先阅读考试须知！')
        return
      }
      if (!this.checkStatusBrowser) {
        this.$message.warning('请先检查浏览器是否正常！')
        return
      }
      if (this.data.isPreventingCheating == 1 && this.data.isCameraCapture === 1 && !this.checkStatusCamera) {
        this.$message.warning('请先检查摄像头是否正常！')
        return
      }
      if (this.data.identityCheck === 2 && !this.checkPhone) {
        this.$message.warning('请先认证手机号！')
        return
      }
      if (this.data.identityCheck === 3 && !this.checkId) {
        this.$message.warning('请先认证身份证号！')
        return
      }
      if (this.data.isPreventingCheating == 1 && this.data.isBeforePic === 1 && !this.model.picUrl) {
        this.$message.warning('请先拍照！')
        return
      }
      const params = {
        examId: this.model.id,
        paperId: this.model.paperId,
        picUrl: this.model.picUrl,
        isFullScreen: this.data.isFullScreen,
        isCameraCapture: this.data.isCameraCapture,
        cameraCaptureStart: this.data.cameraCaptureStart,
        cameraCaptureTime: this.data.cameraCaptureTime,
        cameraCaptureNum: this.data.cameraCaptureNum,
        name: this.data.name,
        examPaperUserRecordId: this.data.examPaperUserRecordId
      }
      this.$router.push({
        path: '/zxks/detail',
        query: { ...params }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

  <style scoped lang="less">
    .examTop{
      text-align: center;
      padding: 20px;
      .examName{
        font-size: 20px;
        font-weight: bold;
      }
      .examTime{
        font-size: 15px;
        display: flex;
        justify-content: center;
        margin-top: 5px;
        .examTimeDiv{
          background-color: #F6F6F6;
          padding: 10px 20px;
          border-radius: 25px;
        }
      }
    }
    .examDiv{
      text-align: left;
      padding: 20px;
      .examTitle{
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        &:before{
          content: '';
          display: inline-block;
          width: 5px;
          height: 15px;
          background-color: #128BEB;
          margin-right: 5px;
        }
      }
      .exam-box{
          overflow: auto;
          padding: 20px 25px 0;
          position: relative;
          margin-bottom: 10px;
          .question{
              font-size: 14px;
              color: #3a3e51;
              font-weight: 600;
              margin-bottom: 10px;
              cursor: default;
          }
          .answer{
              margin: 10px 0;
              font-size: 14px;
          }
          .check{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            background-color: #F6F6F4;
            padding: 20px 50px;
            .checkTitle{
              img{
                margin-right: 10px;
                width: 20px;
                height: auto;
              }
              .checkText{

              }
            }
            .checkStatus{
              display: flex;
              align-items: center;
              justify-content: center;
              .success{
                color: #20B759;
              }
              .error{
                color: red;
              }
            }
            .checkCamera{
              width: 100%;
              position: relative;
              text-align: center;
              button{
                position: absolute;
                bottom: 50px;
                right: 46%;
              }
            }
          }
          .checkBox{
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            background-color: #F6F6F4;
            padding: 20px 50px;
            .checkTitle{
              img{
                margin-right: 10px;
                width: 20px;
                height: auto;
              }
              .checkText{

              }
            }
            .checkStatus{
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 10px;
              .checkInput{
                margin-right: 10px;
              }
              .success{
                color: #20B759;
              }
              .error{
                color: red;
              }
            }
          }
      }
      .exam-box:not(:first-child){
          border-bottom: 1px solid #f1f3f8;
      }
    }
    .examBottom{
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .examCheckbox{

      }
      .examButton{
        width: 100%;
        button{
          width: 50%;
          height: 36px;
          margin: 10px 0;
        }
      }
    }
  </style>

