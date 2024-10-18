<template>
  <div class="wrapper">
    <div class="container">
      <div class="smallBack">
        <!-- <div class="title-container">  -->
        <div class="titleTop"><img :src="logoIcon" class="logoImg">智慧运维管理系统</div>
        <!-- </div> -->
        <a-form
          id="formLogin"
          ref="formLogin"
          :form="form"
          class="login-form"
          auto-complete="off"
          label-position="left"
        >
          <a-form-item prop="userName">
            <a-input
              v-decorator="['username', validatorRules.username]"
              class="inputClass"
              placeholder="请输入用户名"
              type="text"
            >
              <span slot="prefix" class="loginIcon"><img :src="peoicon" style="width: 23px; height: 23px"></span>
            </a-input>
          </a-form-item>

          <a-form-item prop="passWord">
            <a-input
              v-decorator="['password', validatorRules.password]"
              class="inputClass"
              type="password"
              placeholder="请输入密码"
            >
              <span slot="prefix" class="loginIcon"><img :src="scricon" style="width: 23px; height: 23px"></span>
            </a-input>
          </a-form-item>
          <a-form-item>
            <div style="display: flex">
              <a-input
                v-decorator="['inputCode', validatorRules.inputCode]"
                class="inputClass"
                style="width: 60%; margin-right: 20px"
                type="text"
                placeholder="请输入验证码"
                @change="inputCodeChange"
              ><span slot="prefix" class="loginIcon"><img :src="keyicon" style="width: 23px; height: 23px"></span>
              </a-input>
              <img
                v-if="requestCodeSuccess"
                v-decorator="['inputCode', validatorRules.inputCode]"
                style="width: 113px; height: 40px; margin: 5px"
                :src="randCodeImage"
                @click="handleChangeCheckCode"
              >
              <img
                v-else
                style="width: 113px; height: 40px; margin: 5px"
                src="../../assets/checkcode.png"
                @click="handleChangeCheckCode"
              >
            </div>
          </a-form-item>
          <a-button
            :loading="loginBtn"
            :disabled="loginBtn"
            type="primary"
            html-type="submit"
            class="dlButton"
            @click.stop.prevent="handleSubmit"
          >登 录
          </a-button>
        </a-form>
      </div>
      <!-- <article
        class="wrapper_box"
      >
        <div class="rgba" />
      </article> -->
      <two-step-captcha
        v-if="requiredTwoStepCaptcha"
        :visible="stepCaptchaVisible"
        @success="stepCaptchaSuccess"
        @cancel="stepCaptchaCancel"
      />
    </div>
    <!-- <div class="loginBottom">
      <span>山东益源环保科技有限公司</span>
      <span class="ml10">山东向明环保科技有限公司</span>
    </div> -->
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      loginBtn: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      // logoIcon: require('./img/logo.png'),
      logoIcon: require('@/assets/img/logo2.png'),
      peoicon: require('./img/user.png'),
      scricon: require('./img/password.png'),
      keyicon: require('./img/code.png'),

      state: {
        time: 60,
        smsSendBtn: false
      },
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
        inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
      },
      inputCodeContent: '',
      inputCodeNull: true,
      currdatetime: '',
      randCodeImage: '',
      requestCodeSuccess: false
    }
  },
  created() {
    this.currdatetime = new Date().getTime()
    Vue.ls.remove(ACCESS_TOKEN)
    this.handleChangeCheckCode()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleSubmit() {
      const loginParams = {}
      this.loginBtn = true
      this.form.validateFields(['username', 'password', 'inputCode'], { force: true }, (err, values) => {
        if (!err) {
          loginParams.username = values.username
          loginParams.password = values.password
          loginParams.captcha = this.inputCodeContent
          loginParams.checkKey = this.currdatetime
          console.log('登录参数', loginParams)
          this.Login(loginParams).then((res) => {
            this.loginSuccess()
          }).catch((err) => {
            this.requestFailed(err)
          })
        } else {
          this.loginBtn = false
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    handleChangeCheckCode() {
      this.currdatetime = new Date().getTime()
      getAction(`/sys/randomImage/${this.currdatetime}`)
        .then((res) => {
          if (res.success) {
            this.randCodeImage = res.result
            this.requestCodeSuccess = true
          } else {
            this.$message.error(res.message)
            this.requestCodeSuccess = false
          }
        })
        .catch(() => {
          this.requestCodeSuccess = false
        })
    },
    loginSuccess() {
      this.$router.push({ path: '/' })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    },
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
    },
    toBeautifulChina() {
      this.$router.push('/public/beautifulChina')
    }
  }
}
</script>
<style lang="less" scoped>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}

.wrapper {
  width: 100%;
  min-height: 100%;
  background: url('./img/bg.jpg') bottom;
  background-size: 100%;
  display: flex;
  align-items: center;

  .container {
    height: 100%;
    margin-left: auto;
    margin-right: 10%;
    .smallBack {
      background: url('./img/inputBg.png');
      background-size: 100% 100%;
      width: 552px;
      height: 672px;
      padding:  60px 90px 0 90px;
      .logoImg {
        width: 36px;
        height: 36px;
        margin-right: 7px;
        transform: translateY(-2px);
      }

      .titleTop {
        text-align: center;
        font-size: 28px;
        color: #333;
        font-weight: bold;
        margin-top: 12px;
      }
    }

    .login-form {
      margin-top: 50px;
      /deep/ .ant-form-item{
        margin-bottom: 30px!important;
      }
      .formTitle {
        color: #ffffff;
        text-align: center;
      }

      .formTitleTop {
        font-size: 20px;
        letter-spacing: 2px;
        margin-bottom: 0px;
        font-weight: 300;
      }

      .formTitleBottom {
        font-size: 15px;
        font-weight: 100;
        margin-bottom: 25px;
      }

      .dlButton {
        width: 100%;
        margin-top: 5px;
        height: 54px;
        font-size: 20px;
        border-radius: 8px;
        background: linear-gradient(to right, #07b8ff, #0542f3);
      }
    }
  }

  .loginBottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
    background: rgb(0 0 0 / 37%);
  }
  /deep/ .ant-input-affix-wrapper .ant-input {
    height: 48px;
    border-radius: 8px;
  }
  /deep/ .ant-form-item {
    margin-bottom: 15px;
  }
  /deep/ .ant-input-affix-wrapper .ant-input {
    padding-left: 56px;
  }
  /deep/ .ant-input-affix-wrapper .ant-input-prefix {
    left: 17px;
    top: 23px;
  }
}
</style>
