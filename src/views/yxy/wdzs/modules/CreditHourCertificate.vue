<template>
  <a-modal
    :width="1200"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    :footer="null"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <div style="width: 100%;height:50px;position: relative;">
        <a-button type="primary" style="position: absolute;right: 24px;top: 10px" @click="downloadImage">证书下载</a-button>
      </div>
      <div ref="document" class="content">
        <div style="position: relative;">
          <img src="../img/2.png" width="100%" alt="">
          <div class="name">
            <span>{{ model.realname }}</span>
          </div>
          <div  class="yearStart">
            <span>{{model.studyYearStart}}</span>
          </div>
          <div class="mouthStart">
            <span>{{ model.studyMouthStart }}</span>
          </div>
          <div class="dayStart">
            <span>{{ model.studyDayStart }}</span>
          </div>
          <div  class="yearEnd">
            <span>{{model.studyYearEnd}}</span>
          </div>
          <div class="mouthEnd">
            <span>{{ model.studyMouthEnd }}</span>
          </div>
          <div class="dayEnd">
            <span>{{ model.studyDayEnd }}</span>
          </div>
          <div class="text">
            <span>{{ model.duration }}</span>
          </div>
          <div class="creatYear">
            <span>{{ model.creatYear }}</span>
          </div>
          <div class="creatMouth">
            <span>{{ model.creatMouth }}</span>
            <!-- <span>{{ model.studyMouthEnd }}</span> -->
          </div>
          <div class="creatDay">
            <span>{{ model.creatDay }}</span>
            <!-- <span>{{ model.studyDayEnd }}</span> -->
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      readOnly: false,
      model: {},
      url: {
        list: '/tExamCertificate/tExamCertificate/certificatePreview'
      }
    }
  },
  methods: {
    showModal(record,year) {
      this.confirmLoading = true
      getAction(this.url.list, { id: record.id,year:Number(year) || null}).then(async(res) => {
        if (res.success) {
          this.model = res.result
          // 开始年
          this.model.studyYearStart = res.result.studyHourStart && res.result.studyHourStart.split(' ')[0].split('-')[0] || ''
          // 开始月
          this.model.studyMouthStart = res.result.studyHourStart && res.result.studyHourStart.split(' ')[0].split('-')[1] || ''
          // 开始日
          this.model.studyDayStart = res.result.studyHourStart && res.result.studyHourStart.split(' ')[0].split('-')[2] || ''
          // 结束年
          this.model.studyYearEnd = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[0] || ''
          // 结束月
          this.model.studyMouthEnd = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[1] || ''
          // 结束日
          this.model.studyDayEnd = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[2] || ''
          // 下发年
          this.model.creatYear = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[0] || ''
          // 下发月
          this.model.creatMouth = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[1] || ''
          // 下发日
          this.model.creatDay = res.result.studyHourEnd && res.result.studyHourEnd.split(' ')[0].split('-')[2] || ''
          this.visible = true
        } else {
          this.$message.warning(res.message)
          this.visible = false
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    downloadImage() {
      const element = this.$refs.document
      html2canvas(element, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        backgroundColor: null
      }).then(canvas => {
        this.$utils.canvasToBlob(canvas, '山东省生态环境监测培训云中心培训学习证书')
        // const a = document.createElement('a')
        // a.href = canvas.toDataURL('image/png')
        // a.download = '山东省生态环境监测培训云中心培训学习证书'
        // a.click()
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

  <style scoped lang="less">
  .content{
  .name{
    position: absolute;
    top: 275px;
    left: 160px;
    width: 132px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .yearStart{
    position: absolute;
    top: 354px;
    left: 295px;
    width: 60px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .mouthStart{
    position: absolute;
    top: 353px;
    left: 397px;
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .dayStart{
    position: absolute;
    top: 353px;
    left: 476px;
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .yearEnd{
    position: absolute;
    top: 354px;
    left: 610px;
    width: 60px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .mouthEnd{
    position: absolute;
    top: 353px;
    left: 713px;
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .dayEnd{
    position: absolute;
    top: 353px;
    left: 792px;
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .text{
    position: absolute;
    top: 413px;
    left: 570px;
    width: 75px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }
  .creatYear{
    position: absolute;
    top: 607px;
    left: 740px;
    width: 40px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }
  .creatMouth{
    position: absolute;
    top: 607px;
    left: 818px;
    width: 40px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }
  .creatDay{
    position: absolute;
    top: 607px;
    left: 890px;
    width: 40px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }
}
  </style>

