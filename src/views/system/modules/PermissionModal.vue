<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @close="handleCancel"
  >

    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="model" :rules="validatorRules">

          <a-form-model-item label="菜单类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-radio-group v-model="model.menuType" @change="onChangeMenuType">
              <a-radio :value="0">一级菜单</a-radio>
              <a-radio :value="1">子菜单</a-radio>
              <!--            <a-radio :value="2">按钮/权限</a-radio>-->
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :label="menuLabel"
            prop="name"
            has-feedback
          >
            <a-input v-model="model.name" placeholder="请输入菜单名称" :read-only="disableSubmit" />
          </a-form-model-item>

          <a-form-model-item
            v-show="model.menuType!=0"
            label="上级菜单"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :validate-status="validateStatus"
            :has-feedback="true"
            :required="true"
          >
            <span slot="help">{{ validateStatus=='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              v-model="model.parentId"
              style="width:100%"
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择父级菜单"
              :disabled="disableSubmit"
              @change="handleParentIdChange"
            />
          </a-form-model-item>

          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            prop="url"
            label="菜单路径"
          >
            <a-input v-model="model.url" placeholder="请输入菜单路径" :read-only="disableSubmit" />
          </a-form-model-item>

          <a-form-model-item
            v-show="show"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            prop="component"
            label="前端组件"
          >
            <a-input v-model="model.component" placeholder="请输入前端组件" :read-only="disableSubmit" />
          </a-form-model-item>

          <!--          <a-form-model-item-->
          <!--            v-show="model.menuType==0"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="默认跳转地址"-->
          <!--          >-->
          <!--            <a-input v-model="model.redirect" placeholder="请输入路由参数 redirect" :read-only="disableSubmit" />-->
          <!--          </a-form-model-item>-->

          <!--          <a-form-model-item-->
          <!--            v-show="!show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            prop="perms"-->
          <!--            label="授权标识"-->
          <!--          >-->
          <!--            <a-input v-model="model.perms" placeholder="请输入授权标识, 如: user:list" :read-only="disableSubmit" />-->
          <!--          </a-form-model-item>-->

          <!--          <a-form-model-item-->
          <!--            v-show="!show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="授权策略"-->
          <!--          >-->
          <!--            <j-dict-select-tag v-model="model.permsType" placeholder="请选择授权策略" :type="'radio'" dict-code="global_perms_type" />-->

          <!--          </a-form-model-item>-->
          <!--          <a-form-model-item-->
          <!--            v-show="!show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="状态"-->
          <!--          >-->
          <!--            <j-dict-select-tag v-model="model.status" placeholder="请选择状态" :type="'radio'" dict-code="valid_status" />-->

          <!--          </a-form-model-item>-->

          <!--          <a-form-model-item-->
          <!--            v-show="show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="菜单图标"-->
          <!--          >-->
          <!--            <a-input v-model="model.icon" placeholder="点击选择图标" :read-only="disableSubmit">-->
          <!--              <a-icon slot="addonAfter" type="setting" @click="selectIcons" />-->
          <!--            </a-input>-->
          <!--          </a-form-model-item>-->

          <a-form-model-item
            v-show="show"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            prop="sortNo"
            label="排序"
          >
            <a-input-number v-model="model.sortNo" placeholder="请输入菜单排序" style="width: 200px" :read-only="disableSubmit" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            prop="description"
            label="备注"
          >
            <a-input v-model="model.description" placeholder="请输入备注" :read-only="disableSubmit" />
          </a-form-model-item>
          <a-form-model-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="菜单图标"
          >
            <a-input v-model="model.icon" placeholder="点击选择图标" :read-only="disableSubmit">
              <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
            </a-input>
          </a-form-model-item>
          <!--          <a-form-model-item-->
          <!--            v-show="show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="是否路由菜单"-->
          <!--          >-->
          <!--            <a-switch v-model="model.route" checked-children="是" un-checked-children="否" />-->
          <!--          </a-form-model-item>-->

          <a-form-model-item
            v-show="show"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="隐藏路由"
          >
            <a-switch v-model="model.hidden" checked-children="是" un-checked-children="否" />
          </a-form-model-item>

          <!--          <a-form-model-item-->
          <!--            v-show="show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="是否缓存路由"-->
          <!--          >-->
          <!--            <a-switch v-model="model.keepAlive" checked-children="是" un-checked-children="否" />-->
          <!--          </a-form-model-item>-->

          <!--          <a-form-model-item-->
          <!--            v-show="show"-->
          <!--            :label-col="labelCol"-->
          <!--            :wrapper-col="wrapperCol"-->
          <!--            label="聚合路由"-->
          <!--          >-->
          <!--            <a-switch v-model="model.alwaysShow" checked-children="是" un-checked-children="否" />-->
          <!--          </a-form-model-item>-->

          <a-form-model-item
            v-show="show"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="打开方式"
          >
            <a-switch v-model="model.internalOrExternal" checked-children="外部" un-checked-children="内部" />
          </a-form-model-item>

        </a-form-model>

        <!-- 选择图标 -->
        <icons :icon-choose-visible="iconChooseVisible" @choose="handleIconChoose" @close="handleIconCancel" />
      </a-spin>
      <a-row :style="{textAlign:'right'}" style="position: absolute;bottom:20px;right: 30px">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" type="primary" @click="handleOk">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { addPermission, editPermission, queryTreeList, duplicateCheck } from '@/api/api'
import Icons from './icon/Icons'

export default {
  name: 'PermissionModal',
  components: { Icons },
  data() {
    return {
      drawerWidth: 700,
      treeData: [],
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      menuLabel: '菜单名称',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      iconChooseVisible: false,
      validateStatus: ''
    }
  },
  computed: {
    validatorRules: function() {
      return {
        name: [{ required: true, message: '请输入菜单标题!' }],
        component: [{ required: this.show, message: '请输入前端组件!' }],
        url: [{ required: this.show, message: '请输入菜单路径!' }],
        permsType: [{ required: true, message: '请输入授权策略!' }],
        perms: [{ required: false, message: '请输入授权标识!' }, { validator: this.validatePerms }]
      }
    }
  },
  created() {
  },
  methods: {
    loadTree() {
      var that = this
      queryTreeList().then((res) => {
        if (res.success) {
          console.log(res)
          that.treeData = []
          const treeList = res.result.treeList
          for (let a = 0; a < treeList.length; a++) {
            const temp = treeList[a]
            temp.isLeaf = temp.leaf
            that.treeData.push(temp)
          }
        }
      })
    },
    add() {
      // 初始化默认值
      this.edit({ status: '1', permsType: '1', sortNo: 1.0, route: true, menuType: 0 })
    },
    edit(record) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.model = Object.assign({}, record)

      // 根据菜单类型，动态展示页面字段
      console.log('record: ', record)
      this.show = record.menuType != 2
      this.menuLabel = record.menuType == 2 ? '按钮/权限' : '菜单名称'

      this.visible = true
      this.loadTree()
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          if ((this.model.menuType == 1 || this.model.menuType == 2) && !this.model.parentId) {
            that.validateStatus = 'error'
            that.$message.error('请检查你填的类型以及信息是否正确！')
            return
          } else {
            that.validateStatus = 'success'
          }
          that.confirmLoading = true
          let obj
          if (!this.model.id) {
            obj = addPermission(this.model)
          } else {
            obj = editPermission(this.model)
          }
          obj.then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
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
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        callback()
      } else {
        callback('请输入正整数!')
      }
    },
    validatePerms(rule, value, callback) {
      if (value && value.length > 0) {
        // 校验授权标识是否存在
        var params = {
          tableName: 'sys_permission',
          fieldName: 'perms',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback('授权标识已存在!')
          }
        })
      } else {
        callback()
      }
    },
    onChangeMenuType(e) {
      if (this.model.menuType == 2) {
        this.show = false
        this.menuLabel = '按钮/权限'
      } else {
        this.show = true
        this.menuLabel = '菜单名称'
      }
      this.$nextTick(() => {
        this.$refs.form.validateField(['url', 'component'])
      })
    },
    selectIcons() {
      this.iconChooseVisible = true
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleIconChoose(value) {
      console.log(value)
      this.model.icon = value
      this.iconChooseVisible = false
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
    handleParentIdChange(value) {
      if (!value) {
        this.validateStatus = 'error'
      } else {
        this.validateStatus = 'success'
      }
    }
  }
}
</script>

<style scoped>

</style>
