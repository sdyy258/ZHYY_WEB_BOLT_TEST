<template>
  <a-modal
    :width="600"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    :destroy-on-close="true"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="examTop">
        <div class="examName">
          专项练习
        </div>
      </div>
      <div class="examDiv">
        <!-- <a-tree
          v-model="checkedKeys"
          :replace-fields="{key:'value' }"
          :auto-expand-parent="false"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          @select="onSelect"
        /> -->

        <a-tag
          v-for="i in treeData"
          :key="i.id"
          class="exam-tag"
          :color="i.color"
          @click="changeTag(i)"
        >
          <a-tooltip>
            <template slot="title">
              {{ i.postName }}
            </template>
            <a-icon type="check" style="margin-right: 5px;" />
            <span v-if="i.postName.length>5"> {{ `${i.postName.slice(0, 5)}...` }} </span>
            <span v-else>{{ i.postName }}</span>
          </a-tooltip>
        </a-tag>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction } from '@api/manage'

export default {
  data() {
    return {
      loading: false,
      visible: false,
      confirmLoading: false,
      model: {},
      treeData: [],
      checkedKeys: [],
      selectedKeys: [],
      type: null
    }
  },
  methods: {
    getNum(array) {
      array.forEach(item => {
        item.title = item.title + '（' + item.itemCount + '）'
        if (item.children) {
          this.getNum(item.children)
        }
      })
    },
    showModal(type) {
      this.type = type
      this.loading = true
      // getAction('sys/category/rootListNew', { type: 1, pageSize: 500, needCountItem: 1 }).then(res => {
      //   if (res.success) {
      //     this.treeData = res.result.map(item => {
      //       item.title = item.title + '（' + item.itemCount + '）'
      //       if (item.children) {
      //         this.getNum(item.children)
      //       }
      //       return item
      //     })
      //     this.visible = true
      //   } else {
      //     this.$message.warning(res.message)
      //   }
      // }).finally(() => {
      //   this.loading = false
      // })
      getAction('/sys/post/postList', { type: 1, pageSize: 500 }).then(res => {
        if (res.success) {
          this.treeData = res.result.map(item => {
            // item.postName = item.postName
            // item.id = item.id
            item.color = ''
            return item
          })
          this.visible = true
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    changeTag(i) {
      this.treeData.forEach(item => {
        item.color = ''
      })
      i.color = 'blue'
      this.selectedKeys = []
      this.selectedKeys.push(i.id)
    },
    // onSelect(selectedKeys, info) {
    //   console.log('onSelect', info)
    //   this.selectedKeys = selectedKeys
    // },
    handleOk() {
      if (this.selectedKeys.length === 0) {
        this.$message.warning('请先选择具体专项！')
        return
      }
      getAction('/tQuestion/tQuestion/randomByPost', { methodPrinciple: this.selectedKeys.join(','), serialNumber: 1 }).then(res => {
        this.loading = false
        if (res.success) {
          const params = { type: this.type, id: this.selectedKeys.join(',') }
          this.$router.push({
            path: '/yxy/sjlx',
            query: { ...params }
          })
        } else {
          this.$message.warning(res.message)
        }
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
      .exam-tag {
            margin: 5px 8px;
            cursor: pointer;
            width: 20%;
            height: auto;
            text-align: center;
            // display: flex;
            // justify-content: center;
            // align-items: center;
            padding: 5px 5px;
            // white-space: inherit;
            overflow: hidden;
            &.active {
              border: #0080ff solid 1px;
              background-color: #1A8CFE;
              color: white;
            }
            &.error {
              border: red solid 1px;
              background-color: red;
              color: white;
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
                  bottom: 40px;
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

