<template>
  <div>
    <a-collapse default-active-key="1" :bordered="false">
      <template #expandIcon="props">
        <a-icon
          type="caret-right"
          :rotate="props.isActive ? 90 : 0"
          style="left: 55%;font-size: 20px"
        />
      </template>
      <a-collapse-panel key="1" header="更多设置" :style="customStyle">
        <a-row class="row-centent">
          <a-col :span="8">
            <div class="col-leftTitle">考试防作弊</div>
            <div>
              <span class="col-textStyle">答题前人脸身份核验</span>
              <a-switch v-model="model.identityCheck" default-checked @change="onChange($event,'identityCheck')" />
              <div v-if="model.identityCheck==1" class="col-hidden">
                <div
                  class="hidden-header"
                >使用人脸对比监测照片进行对比，如果学员没有人脸对比监测照片， 将使用公安身份数据进行对比,并自动补充为学员人脸对比监测照片</div>
                <div class="hidden-header">
                  <p>
                    考试开始前 0 分钟开始身份认证，每个学员支持认证 2
                    次
                  </p>
                  <p>核验时学员姓名与身份证号 需要 与个人信息一致</p>
                  <p>认证次数用尽后 不允许进入考试 ，允许申请人工审核</p>
                </div>
              </div>
            </div>
            <div>
              <span class="col-textStyle">是否需要考前拍照</span>
              <a-switch v-model="model.isBeforePic" default-checked @change="onChange($event,'isBeforePic')" />
            </div>
            <div>
              <span class="col-textStyle">是否开启摄像头抓拍</span>
              <a-switch v-model="model.isCameraCapture" @change="onChange($event,'isCameraCapture')" />
              <div v-if="model.isCameraCapture==1" class="col-hidden">
                <p>
                  <span class="col-textStyle">摄像头抓拍时机</span>
                  <a-radio-group v-model="model.cameraCaptureTime">
                    <a-radio :value="1">
                      <span v-if="model.cameraCaptureTime ==1">
                        <a-input-number v-model="model.cameraCaptureTime" :min="1" />分钟
                      </span>
                      <span v-else>指定间间隔</span>
                    </a-radio>
                    <a-radio :value="0">随机</a-radio>
                  </a-radio-group>
                </p>
                <div class="hidden-header">
                  <p>
                    抓拍在考试开始
                    <span>
                      <a-input v-model="model.cameraCaptureStart" style="width: 55px;" />
                    </span>分钟后进行
                  </p>
                  <p>
                    学员开始答题后，平均
                    <span>
                      <a-input v-model="model.isCameraCapture" style="width: 55px;" />
                    </span> 分钟抓拍一张学员答题照片
                  </p>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customStyle: {
        textAlign: 'center',
        fontSize: '20px'
      },
      model: {}
    }
  },
  methods: {
    onChange(checked, event) {
      if (checked == true) {
        this.model.event = 1
      } else {
        this.model.event = 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.row-centent {
  text-align: left;
  font-size: 14px;
  margin: 0 20px;
  .col-leftTitle {
    font-size: 16px;
    margin: 20px 0;
  }
  .col-textStyle {
    margin-right: 10px;
  }
  .col-hidden {
    background: #e9e9e9;
    padding: 20px;
    margin: 20px 0;
    .hidden-header {
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
  }
}
</style>
