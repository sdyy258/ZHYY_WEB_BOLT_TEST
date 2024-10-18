<template>
  <a-modal
    centered
    :title="title"
    :footer="null"
    :visible="visible"
    :mask-closable="false"
    width="900px"
    :destroy-on-close="true"
    @cancel="visible=false"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div class="left_container">
          <div class="linkImgDownLoad">
            <div class="content">
              <div class="logo">
                <img
                  class="img"
                  src="../img/logo.png"
                >
              </div>
              <div class="case">
                <img src="../img/left.png" alt="">
                <div class="title_content">
                  <a-tooltip>
                    <template slot="title">
                      {{ modal.name }}
                    </template>
                    <span v-if="modal.name.length>15 && modal.name.length!=16">{{ `${modal.name.slice(0,15)}...` }}{{ `${modal.name.slice(-1)}` }}</span>
                    <span v-else-if="modal.name.length==16">{{ `${modal.name.slice(0,15)}...` }}</span>
                    <span v-else> {{ modal.name }}</span>
                  </a-tooltip>
                </div>
              </div>
              <div class="time">
                <div class="start_time">
                  开始时间：
                  <span>{{ modal.limitStartTime }}</span>
                </div>
                <div class="start_time">
                  结束时间：
                  <span>{{ modal.limitEndTime }}</span>
                </div>
                <div class="start_time">
                  考试时长：
                  <span>{{ modal.examTime }}分钟</span>
                </div>
              </div>
              <!-- 二维码 -->
              <!-- <div class="qrcode">
                <img src="../img/1.png" />
                <div class="qrcode-text">识别二维码参加考试</div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="right_container">
          <div v-if="disabled" class="link_title">通知发送！</div>
          <div v-else class="link_title">发布成功！</div>
          <div class="right_container-center">
            <div class="guide">
              <div class="title-icon">
                <div class="icon-title" />
                <span class="address">考试地址</span>
              </div>
              <div class="link-boby">
                <div id="link" class="exam_url">{{ modal.linkValue }}</div>
                <a-button @click="copeLink">
                  <img src="../img/copy.png" alt="" style="margin-right: 5px;">
                  复制链接</a-button>
              </div>
            </div>
            <div class="guide">
              <div class="title-icon">
                <div class="icon-title" />
                <span class="address">发送考试通知</span>
              </div>
              <div class="prompt">
                点击确定，将根据设定，进行通知
              </div>
              <div class="link-boby">
                <a-checkbox-group v-model="noticeMethod1" :disabled="!disabled" :options="options1" @change="checkChange1" />
                <a-checkbox-group v-model="noticeMethod" :disabled="!disabled" :options="options" @change="checkChange" />
              </div>
            </div>
            <!-- <div class="guide">
              <span class="address">通知设置</span>
              <div style="padding: 20px 0;">
                <div style="margin-bottom: 20px;">
                  <a-select v-model="modal.noticeTime" style="width: 120px">
                    <a-select-option :value="1">立即推送</a-select-option>
                    <a-select-option :value="2">定时推送</a-select-option>
                  </a-select>
                </div>
                <a-radio-group v-model="modal.peopel">
                  <a-radio :value="1">全部应参考学员</a-radio>
                  <a-radio :value="2">未参考学员</a-radio>
                </a-radio-group>
              </div>
            </div> -->
          </div>
          <div class="btn-div">
            <!-- <a-button>下载图片</a-button>
            <a-button>考一下</a-button> -->
            <a-button v-if="disabled == true" type="primary" @click="handleOk">确定</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
export default {
  data() {
    return {
      confirmLoading: false,
      title: '',
      visible: false,
      disabled: true,
      options1: [
        { label: '无通知', value: '0' }
      ],
      options: [
        // { label: '无通知', value: '0' },
        { label: '邮件', value: '2' },
        { label: '短信(无需回复)', value: '1' }
      ],
      noticeMethod1: ['0'],
      noticeMethod: [], // 通知方式
      noticeTime: 1,
      modal: {
        linkValue: 'https://oems.sdem.org.cn:8000/zxks/zxks',
        // peopel: 1,
        noticeTime: 1
      }
    }
  },
  methods: {
    // handleOk() {
    //   let url = ''
    //   if (!this.modal.id) {
    //     url = '/tExam/tExam/add'
    //   } else {
    //     url = '/tExam/tExam/edit'
    //   }
    //   this.modal.limitTime = ''
    //   const params = {
    //     ...this.modal
    //   }
    //   postAction(url, params).then(res => {
    //     if (res.success) {
    //       this.visible = false
    //       this.$message.success(res.message || '成功')
    //       this.$router.push('/ksgl/ksgl')
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   })
    // },
    handleOk() {
      // this.confirmLoading = true
      const params = {
        id: this.modal.id,
        noticeMethod: this.modal.noticeMethod
      }
      postAction('/tExam/tExam/sendNotice', params).then(res => {
        if (res.success) {
          this.visible = false
          this.$message.success(res.message || '成功')
          this.$emit('ok', '')
          // this.$router.push('/ksgl/ksgl')
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        // this.confirmLoading = false
      })
    },
    showModal(data, val) {
      this.disabled = val
      this.visible = true
      this.modal.id = data.id
      this.modal = { ...this.modal, ...data }
      this.noticeMethod = []
      if (this.modal.noticeMethod === 3) {
        this.noticeMethod = ['1', '2']
        this.noticeMethod1 = []
      } else if (this.modal.noticeMethod === 0) {
        this.noticeMethod1 = ['0']
      } else if (this.modal.noticeMethod === 1 || this.modal.noticeMethod === 2) {
        this.noticeMethod1 = []
        this.noticeMethod.push(String(this.modal.noticeMethod))
      } else {
        this.noticeMethod1 = ['0']
        this.modal.noticeMethod = 0
      }
      this.modal.linkValue = 'https://oems.sdem.org.cn:8000/zxks/zxks/'
    },
    // 复制链接
    copeLink() {
      var Url2 = document.getElementById('link').innerText
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('copy')
      oInput.style.display = 'none'
      this.$message.success('复制链接成功', 10)
    },
    checkChange1(e) {
      if (e[0] == '0') {
        // 有0 则没有12
      // 只要有1或2 就不会有0
        this.modal.noticeMethod = 0
        this.noticeMethod = []
      }
    },
    checkChange(e) {
      // 有1 则不会有0
      // 有2则不会有0
      // 有1或2 不会有0
      if (e.length > 0) {
        this.noticeMethod1 = []
        this.modal.noticeMethod = ''
      }
      const arr = e.map(item => {
        return item
      }).join(',')
      if (arr.indexOf('2,1') > -1 || arr.indexOf('1,2') > -1) {
        this.modal.noticeMethod = 3
      } else {
        this.modal.noticeMethod = Number(e[0])
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
  padding: 0;
}
.modal-content {
  height: 600px;
  width: 100%;
  border-radius: 4px;
  box-shadow: unset;
  .modal-body {
    height: 100%;
    width: 100%;
    padding: 0;
    position: relative;
    display: flex;
    .left_container {
      .linkImgDownLoad {
        height: 600px;
        background: #dcdfe6 !important;
        padding: 22px;
        .content {
          background-image: url(../img/leftBack.png);
          border-radius: 6px;
          height: 100%;
          background-repeat: no-repeat;
          background-position:center;
        }
        .case{
          text-align: center;
        }
        .logo {
          text-align: center;
          padding-top: 35px;
          margin-bottom: 30px;
          .img {
            height: 39px;
            max-width: 67%;
          }
        }
        .title_content {
          font-size: 18px;
          color: #ffffff;
          font-weight: bold;
          margin-top: -20%;
        }
        .time {
          margin-top: 17%;
          margin-left: 14%;
          .start_time {
            background: #f7f8fa;
            border-radius: 2px;
            font-size: 15px;
            color: #656577;
            width: 260px;
            margin-bottom: 12px;
            padding-left: 24px;
            padding: 5px 0 5px 24px;
          }
        }
        .qr_code {
          position: absolute;
          top: 356px;
          left: 113px;
          text-align: center;
          .tip {
            font-size: 12px;
            color: #c1c1cb;
            margin-top: 10px;
          }
        }
      }
    }
    .right_container {
      height: 100%;
      width: 500px;
      padding: 0 40px;
    }
    .link_title {
      font-size: 22px;
      color: #27274a;
      padding: 61px 0 41px 0;
      text-align: center;
      font-weight: 700;
      letter-spacing: 2px;
    }
    .right_container-center {
      max-height: 600px;
      overflow-x: hidden;
      height: 410px;
      .guide {
        position: relative;
        .title-icon{
          display: flex;
          align-items: center;
        }
        .icon-title {
          width: 5px;
          height: 21px;
          background: #298bf9;
          margin-right: 10px;
        }
        .address {
          font-size: 16px;
          font-weight: bold;
          color: black;
          .content {
            display: flex;
            padding: 20px 0;
          }
        }
        .prompt{
          color: crimson;
          padding: 20px 0px 0 0px;
          font-size: 16px;
        }
        .link-boby{
          display:flex;
          padding: 20px 0px 25px 0;
        }
        .exam_url {
          font-weight: bold;
          padding: 6px 10px 6px 0;
          font-size: 15px;
        }
      }
    }
    .btn-div {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
