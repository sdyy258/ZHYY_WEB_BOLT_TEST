<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @cancel="visible = false"
  >
    <template slot="footer">
      <a-spin :spinning="confirmLoading">
        <a-button type="primary" @click="handleCancel()">关闭</a-button>
      </a-spin>
    </template>
    <a-spin :spinning="confirmLoading">
      <div v-for="(item,index) in dataSource" :key="index" class="exam-box">
        <div class="question">
          <span>{{ index +1 + '.('+ item.prop1 + ')' + item.prop6 }}</span>
        </div>
        <div class="multiple">
          <div v-for="(res,i) in item.prop11" :key="i" class="line">
            <template v-if="item.prop1 == '多选'">
              <a-checkbox-group>
                <a-checkbox :value="res.option">
                  {{ res.option }}、{{ res.text }}
                </a-checkbox>
              </a-checkbox-group>
            </template>
            <template v-else-if="item.prop1 == '判断'||item.prop1 == '单选'">
              <a-radio-group>
                <a-radio :value="res.option">
                  {{ res.option }}、{{ res.text }}
                </a-radio>
              </a-radio-group>
            </template>
          </div>
        </div>
        <div class="answer">
          <span>学员答案：{{ item.prop7 }}</span>
        </div>
        <div class="answer">
          <span>正确答案：{{ item.prop7 }}</span>
        </div>
        <div class="analysis">
          <span>解析说明：{{ item.prop8 }}</span>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      disableMixinCreated: true,
      loading: false,
      title: '练习1答题记录',
      visible: false,
      confirmLoading: false,
      readOnly: false,
      dataSource: [{
        prop1: '多选',
        prop2: '试题分类/土壤和沉积物',
        prop3: '根据《中华人民共和国环境保护法》，排放污染物的企业事业单位和其他生产经营者应当采取措施，防治在生产建设或者其他活动中产生的____对环境的污染危害。',
        prop4: '简单',
        prop5: '2023-04-14 09:41:14',
        prop6: '根据《中华人民共和国环境保护法》，排放污染物的企业事业单位和其他生产经营者应当采取措施，防治在生产建设或者其他活动中产生的____对环境的污染危害。',
        prop7: 'ABCD',
        prop8: '无',
        prop9: '简单',
        prop10: '',
        prop11: [{
          index: 1,
          option: 'A',
          text: '废气、废水、废渣'
        }, {
          index: 2,
          option: 'B',
          text: '粉尘、恶臭气体、电磁辐射'
        }, {
          index: 3,
          option: 'C',
          text: '噪声、振动、放射性物质、医疗废物 '
        }, {
          index: 4,
          option: 'D',
          text: '光辐射 '
        }]
      }, {
        prop1: '判断',
        prop2: '试题分类/气和废气',
        prop3: '《生态环境监测网站建设方案》（国办发【2015】56号）要求：重点排污单位要按照行业主管部门要求将自行监测结果及时上传。',
        prop4: '简单',
        prop5: '2023-04-14 09:41:14',
        prop6: '《生态环境监测网站建设方案》（国办发【2015】56号）要求：重点排污单位要按照行业主管部门要求将自行监测结果及时上传。',
        prop7: 'A',
        prop8: '无',
        prop9: '简单',
        prop10: '',
        prop11: [{
          index: 1,
          option: 'A',
          text: '正确'
        }, {
          index: 2,
          option: 'B',
          text: '错误'
        }]
      }, {
        prop1: '单选',
        prop2: '试题分类/土壤和沉积物',
        prop3: '根据《中华人民共和国水污染防治法》，水污染防治应当坚持的原则是',
        prop4: '简单',
        prop5: '2023-04-14 09:41:14',
        prop6: '根据《中华人民共和国水污染防治法》，水污染防治应当坚持的原则是',
        prop7: 'A',
        prop8: '无',
        prop9: '简单',
        prop10: '',
        prop11: [{
          index: 1,
          option: 'A',
          text: '预防为主、限期治理、综合整治'
        }, {
          index: 2,
          option: 'B',
          text: '预防为主、防治结合、限期整改'
        }, {
          index: 3,
          option: 'C',
          text: '预防为主、防治结合、综合整治'
        }, {
          index: 4,
          option: 'D',
          text: '预防为主、防治结合、区域限批'
        }]
      }]
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit() {
      this.visible = true
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
    .exam-box{
        overflow: auto;
        padding: 20px 25px 0;
        position: relative;
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
        .analysis{
            font-size: 14px;
            margin-bottom: 10px;
        }
    }
    .exam-box:not(:first-child){
        border-top: 1px solid #f1f3f8;
    }
</style>

