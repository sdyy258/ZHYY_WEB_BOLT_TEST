<template>
  <a-drawer
    :title="title"
    :mask-closable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    :visible="visible"
    style="height: 100%;overflow: auto;padding-bottom: 53px;"
    @close="handleCancel"
  >

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button icon="appstore" style="height:20px;width:20px;border:0px" @click="toggleScreen" />
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="disableSubmit">
        <a-form-model ref="form" :model="model" :rules="validatorRules" style="padding-bottom: 30px;">

          <a-form-model-item label="用户账号" :label-col="labelCol" :wrapper-col="wrapperCol" prop="username">
            <a-input v-model="model.username" placeholder="请输入用户账号" :read-only="!!model.id" />
          </a-form-model-item>
          <template v-if="!model.id">
            <a-form-model-item label="登录密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="password">
              <a-input v-model="model.password" type="password" placeholder="请输入登录密码" />
            </a-form-model-item>

            <a-form-model-item label="确认密码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="confirmpassword">
              <a-input v-model="model.confirmpassword" type="password" placeholder="请重新输入登录密码" @blur="handleConfirmBlur" />
            </a-form-model-item>
          </template>
          <a-form-model-item label="用户姓名" :label-col="labelCol" :wrapper-col="wrapperCol" prop="realname">
            <a-input v-model="model.realname" placeholder="请输入用户姓名" />
          </a-form-model-item>
          <!-- <a-form-model-item label="身份证号" :label-col="labelCol" :wrapper-col="wrapperCol" prop="idNo">
            <a-input v-model="model.idNo" placeholder="请输入身份证号" />
          </a-form-model-item> -->
          <!--        <a-form-model-item label="工号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workNo">-->
          <!--          <a-input placeholder="请输入工号" v-model="model.workNo" />-->
          <!--        </a-form-model-item>-->

          <!--        <a-form-model-item label="职务" :label-col="labelCol" :wrapper-col="wrapperCol">-->
          <!--          <j-select-position v-model="model.post" placeholder="请选择职务" :multiple="false" :buttons="!disableSubmit" :disabled="disableSubmit" />-->
          <!--        </a-form-model-item>-->

          <a-form-model-item v-show="!roleDisabled" label="角色分配" :label-col="labelCol" :wrapper-col="wrapperCol" prop="selectedroles">
            <j-search-select-tag
              v-model="model.selectedroles"
              :dict-options="rolesOptions"
              trigger-change
              placeholder="请选择角色"
            />
          </a-form-model-item>
          <!--部门分配-->
          <a-form-model-item v-if="!departDisabled" label="部门分配" :label-col="labelCol" :wrapper-col="wrapperCol" prop="selecteddeparts">
            <j-select-depart v-model="model.selecteddeparts" :multi="false" :back-depart="true" :tree-opera="true" @back="backDepartInfo">></j-select-depart>
          </a-form-model-item>

          <!--        &lt;!&ndash;租户分配&ndash;&gt;-->
          <!--        <a-form-model-item label="租户分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">-->
          <!--          <j-multi-select-tag-->
          <!--            :disabled="disableSubmit"-->
          <!--            v-model="model.relTenantIds"-->
          <!--            :options="tenantsOptions"-->
          <!--            placeholder="请选择租户">-->
          <!--          </j-multi-select-tag>-->
          <!--        </a-form-model-item>-->

          <!--        <a-form-model-item label="身份" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
          <!--          <a-radio-group  v-model="model.userIdentity"  @change="identityChange">-->
          <!--            <a-radio :value="1">普通用户</a-radio>-->
          <!--            <a-radio :value="2">上级</a-radio>-->
          <!--          </a-radio-group>-->
          <!--        </a-form-model-item>-->
          <!--        <a-form-model-item label="负责部门" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-if="departIdShow==true">-->
          <!--          <j-multi-select-tag-->
          <!--            :disabled="disableSubmit"-->
          <!--            v-model="model.departIds"-->
          <!--            :options="nextDepartOptions"-->
          <!--            placeholder="请选择负责部门">-->
          <!--          </j-multi-select-tag>-->
          <!--        </a-form-model-item>-->

          <a-form-model-item label="头像" :label-col="labelCol" :wrapper-col="wrapperCol">
            <j-image-upload v-model="model.avatar" class="avatar-uploader" text="上传" />
          </a-form-model-item>

          <!--        <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
          <!--          <a-date-picker-->
          <!--            style="width: 100%"-->
          <!--            placeholder="请选择生日"-->
          <!--            v-model="model.birthday"-->
          <!--            :format="dateFormat"-->
          <!--            :getCalendarContainer="node => node.parentNode"/>-->
          <!--        </a-form-model-item>-->

          <!--          <a-form-model-item label="性别" :label-col="labelCol" :wrapper-col="wrapperCol">-->
          <!--            <a-select v-model="model.sex" placeholder="请选择性别" :get-popup-container="(target) => target.parentNode">-->
          <!--              <a-select-option :value="1">男</a-select-option>-->
          <!--              <a-select-option :value="2">女</a-select-option>-->
          <!--            </a-select>-->
          <!--          </a-form-model-item>-->

          <!--        <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">-->
          <!--          <a-input placeholder="请输入邮箱" v-model="model.email" />-->
          <!--        </a-form-model-item>-->

          <a-form-model-item label="手机号码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="phone">
            <a-input v-model="model.phone" placeholder="请输入手机号码" />
          </a-form-model-item>

          <!--        <a-form-model-item label="座机" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="telephone">-->
          <!--          <a-input placeholder="请输入座机" v-model="model.telephone" />-->
          <!--        </a-form-model-item>-->

          <!--        <a-form-model-item label="工作流引擎" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
          <!--          <j-dict-select-tag  v-model="model.activitiSync"  placeholder="请选择是否同步工作流引擎" :type="'radio'" dictCode="activiti_sync"/>-->
          <!--        </a-form-model-item>-->

        </a-form-model>
      </j-form-container>
    </a-spin>

    <div v-show="!disableSubmit" class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="handleCancel">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { addUser, editUser, queryUserRole, queryall, queryAllYyRole } from '@/api/api'
import { disabledAuthFilter } from '@/utils/authFilter'
import { duplicateCheck } from '@/api/api'
import { getSysDepartTree } from '@api/custom'
export default {
  name: 'UserModal',
  components: {
  },
  props: ['page'],
  data() {
    return {
      departDisabled: false, // 是否是我的部门调用该页面
      roleDisabled: false, // 是否是角色维护调用该页面
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      userId: '', // 保存用户id
      disableSubmit: false,
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        username: [{ required: true, message: '请输入用户账号!' },
          { validator: this.validateUsername }],
        password: [{ required: true, message: '密码由8位数字、大小写字母和特殊符号组成!' },
          { validator: this.validateToNextPassword, trigger: 'change' }],
        confirmpassword: [{ required: true, message: '请重新输入登录密码!' },
          { validator: this.compareToFirstPassword }],
        realname: [{ required: true, message: '请输入用户名称!' }],
        phone: [{ required: true, message: '请输入手机号!' }, { validator: this.validatePhone }],
        email: [{ validator: this.validateEmail }],
        roles: {},
        workNo: [{ required: true, message: '请输入工号' },
          { validator: this.validateWorkNo }],
        telephone: [{ pattern: /^0\d{2,3}-[1-9]\d{6,7}$/, message: '请输入正确的座机号码' }],
        selectedroles: [{ required: true, message: '请选择角色' }],
        enterpriseId: [{ required: true, message: '请选择企业' }],
        enterpriseUserType: [{ required: true, message: '请选择企业用户类型' }],
        selecteddeparts: [{ required: true, message: '请选择部门' }]
        // idNo: [{ required: false, message: '请输入身份证号!' }, { validator: this.validateIdNo }]
      },
      departIdShow: false,
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      url: {
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        userWithDepart: '/sys/user/userDepartList', // 引入为指定用户查看部门信息需要的url
        userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
        syncUserByUserName: '/act/process/extActProcess/doSyncUserByUserName', // 同步用户到工作流
        queryTenantList: '/sys/tenant/queryList'
      },
      tenantsOptions: [],
      rolesOptions: [],
      nextDepartOptions: [],
      deptList: [] // 部门列表,
    }
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.initRoleList()
    this.initTenantList()
    getSysDepartTree().then(res => {
      this.deptList = this.$utils.getListForTree(res.result)
    })
  },
  methods: {
    add() {
      this.refresh()
      this.edit({ activitiSync: '1', userIdentity: 1 })
    },
    edit(record) {
      const that = this
      that.visible = true
      // 根据屏幕宽度自适应抽屉宽度
      this.resetScreenSize()
      that.userId = record.id
      that.model = Object.assign({}, { selectedroles: undefined, selecteddeparts: '' }, record)
      // 身份为上级显示负责部门，否则不显示
      if (this.model.userIdentity == 2) {
        this.departIdShow = true
      } else {
        this.departIdShow = false
      }
      if (record.hasOwnProperty('id')) {
        that.getUserRoles(record.id)
        that.getUserDeparts(record.id)
      }
      console.log('that.model=', that.model)
    },
    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },
    // 窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    // 初始化租户字典
    initTenantList() {
      getAction(this.url.queryTenantList).then(res => {
        if (res.success) {
          this.tenantsOptions = res.result.map((item, index, arr) => {
            const c = { label: item.name, value: item.id + '' }
            return c
          })
          console.log('this.tenantsOptions: ', this.tenantsOptions)
        }
      })
    },
    // 初始化角色字典
    initRoleList() {
      if (this.page === 'ryfz') {
        queryAllYyRole().then((res) => {
          if (res.success) {
            this.rolesOptions = res.result.map((item, index, arr) => {
              const c = { label: item.roleName, text: item.roleName, value: item.id }
              return c
            })
            console.log('this.rolesOptions: ', this.rolesOptions)
          }
        })
      } else {
        queryall().then((res) => {
          if (res.success) {
            this.rolesOptions = res.result.map((item, index, arr) => {
              const c = { label: item.roleName, text: item.roleName, value: item.id }
              return c
            })
            console.log('this.rolesOptions: ', this.rolesOptions)
          }
        })
      }
    },
    getUserRoles(userid) {
      queryUserRole({ userid: userid }).then((res) => {
        if (res.success) {
          this.model.selectedroles = res.result.join(',')
          console.log('that.model.selectedroles=', this.model.selectedroles)
        }
      })
    },
    getUserDeparts(userid) {
      const that = this
      getAction(that.url.userWithDepart, { userId: userid }).then((res) => {
        if (res.success) {
          const departOptions = []
          const selectDepartKeys = []
          for (let i = 0; i < res.result.length; i++) {
            selectDepartKeys.push(res.result[i].key)
            // 新增负责部门选择下拉框
            departOptions.push({
              value: res.result[i].key,
              label: res.result[i].title
            })
          }
          that.model.selecteddeparts = selectDepartKeys.join(',')
          that.nextDepartOptions = departOptions
          console.log('that.nextDepartOptions=', that.nextDepartOptions)
        }
      })
    },
    backDepartInfo(info) {
      this.model.departIds = this.model.selecteddeparts
      this.nextDepartOptions = info.map((item, index, arr) => {
        const c = { label: item.text, value: item.value + '' }
        return c
      })
    },
    refresh() {
      this.userId = ''
      this.nextDepartOptions = []
      this.departIdShow = false
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.nextDepartOptions = []
      this.departIdShow = false
      this.$refs.form.resetFields()
    },
    moment,
    handleSubmit() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          const orgCodeList = []
          if (this.model.selecteddeparts) {
            this.model.selecteddeparts.split(',').forEach(departId => {
              const obj = this.deptList.find(i => i.value === departId) || {}
              orgCodeList.push(obj.orgCode)
            })
          }
          that.confirmLoading = true
          // 如果是上级择传入departIds,否则为空
          if (this.model.userIdentity !== 2) {
            this.model.departIds = ''
          }
          let obj
          if (!this.model.id) {
            this.model.id = this.userId
            obj = addUser({ ...this.model, departIds: this.model.selecteddeparts, orgCode: orgCodeList.toString() })
          } else {
            obj = editUser({ ...this.model, departIds: this.model.selecteddeparts, orgCode: orgCodeList.toString() })
          }
          obj.then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.confirmLoading = false
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.close()
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const confirmpassword = this.model.confirmpassword
      if (value && confirmpassword && value !== confirmpassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmpassword'])
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      if (value && value !== this.model.password) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId
          }
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId
          }
          duplicateCheck(params).then((res) => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback('邮箱已存在!')
            }
          })
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },
    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('用户名已存在!')
        }
      })
    },
    validateWorkNo(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('工号已存在!')
        }
      })
    },
    // validateIdNo(rule, value, callback) {
    //   if (!value) {
    //     callback()
    //   } else {
    //     // /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    //     if (new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value)) {
    //       var params = {
    //         tableName: 'sys_user',
    //         fieldName: 'id_no',
    //         fieldVal: value,
    //         dataId: this.userId
    //       }
    //       duplicateCheck(params).then(res => {
    //         if (res.success) {
    //           callback()
    //         } else {
    //           callback('身份证号码已存在!')
    //         }
    //       })
    //     } else {
    //       callback('请输入正确格式的身份证号码!')
    //     }
    //   }
    // },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      // TODO 验证文件大小
    },
    identityChange(e) {
      if (e.target.value === 1) {
        this.departIdShow = false
      } else {
        this.departIdShow = true
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width:104px;
  height:104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td{
  padding-top:10px;
  padding-bottom:10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
