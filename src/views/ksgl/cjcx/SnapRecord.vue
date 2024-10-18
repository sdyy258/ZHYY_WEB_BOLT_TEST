<template>
  <div>
    <a-modal
      :width="1000"
      class="modalClass"
      :centered="true"
      :title="title"
      :visible="visible"
      :mask-closable="false"
      :footer="null"
      @cancel="visible=false"
    >
      <div class="certificate-wrapper">
        <div v-if="dataSource.length==0" class="noData">
          <div>
            <a-icon type="inbox" style="font-size: 80px;color: rgb(126 123 123 / 25%);" />
          </div>
          <p class="ant-empty-description">暂无数据</p>
        </div>
        <div v-else class="certificate-fix-block">
          <div v-for="(item,index) in dataSource" :key="index" class="certificate-block">
            <div class="certificate-main">
              <div class="certificate-img">
                <img :src="item.picUrl" alt="" @click="certificateDetail(item.picUrl)">
              </div>
            </div>
            <div class="certificate-descript">
              <!-- <div class="certificate-name">
              {{ item.title }}
            </div>
            <div class="certificate-exam-name">
              考试名称：{{ item.text }}
            </div> -->
              <div class="certificate-exam-name">
                时间：{{ item.createTime }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="dataSource.length" style="margin-top: 20px;float: right;">
          <Pagination
            v-show="ipagination.total>0"
            :total="ipagination.total"
            :current.sync="ipagination.current"
            :page-size.sync="ipagination.pageSize"
            :page-size-options="ipagination.pageSizeOptions"
            @change="loadData"
          />
        </div>
      </div>
    </a-modal>
    <div>
      <a-modal
        :width="1000"
        class="modalClass"
        :centered="true"
        title="抓拍照片预览"
        :visible="smallModal"
        :mask-closable="false"
        :footer="null"
        @cancel="smallModal=false"
      ><img :src="imgUrlModal" width="100%" alt="">
      </a-modal></div>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Pagination from '@/components/oems/Pagination'
export default {
  name: 'OEMSWebSnapRecord',
  components: { Pagination },
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '抓拍记录',
      visible: false,
      smallModal: false,
      disableMixinCreated: true,
      ipagination: {
        current: 1,
        pageSize: 8,
        pageSizeOptions: ['4', '8'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      model: {},
      imgUrlModal: '',
      url: {
        list: '/tExamPaperUserRecordPic/tExamPaperUserRecordPic/list'
      }
    }
  },
  methods: {
    showModal(record) {
      this.visible = true
      this.model = record
      this.disableMixinCreated = false
      this.queryParam.examId = record.examId
      this.queryParam.userId = record.userId
      this.searchQuery()
    },
    certificateDetail(imgsrc) {
      this.imgUrlModal = imgsrc
      this.smallModal = true
      // const image = new Image()
      // image.src = imgsrc
      // image.onload = () => {
      //   // 创建弹出层
      //   const previewContainer = document.createElement('div')
      //   previewContainer.style.position = 'fixed'
      //   previewContainer.style.top = 0
      //   previewContainer.style.bottom = 0
      //   previewContainer.style.left = 0
      //   previewContainer.style.right = 0
      //   previewContainer.style.backgroundColor = 'rgba(0,0,0,0.8)'
      //   previewContainer.style.display = 'flex'
      //   previewContainer.style.justifyContent = 'center'
      //   previewContainer.style.alignItems = 'center'
      //   previewContainer.style.zIndex = '999'
      //   document.body.appendChild(previewContainer)
      //   // 在弹出层中添加图片
      //   const previewImage = document.createElement('img')
      //   previewImage.src = imgsrc
      //   previewImage.style.maxWidth = '80%'
      //   previewImage.style.maxHeight = '80%'
      //   previewContainer.appendChild(previewImage)
      //   // 点击弹出层，关闭预览
      //   previewContainer.addEventListener('click', () => {
      //     document.body.removeChild(previewContainer)
      //   })
      // }
      // window.location.href = imgsrc

      // const newWindow = window.open('')
      // newWindow.document.body.innerHTML = '<img src="' + this.$baseUrl + imgsrc + '" alt="">'
      // newWindow.document.title = '抓拍记录图片'
    }
  }
}
</script>

<style lang="less" scoped>
.certificate-wrapper{
    width: 100%;
    max-height: 800px;
    overflow-y: scroll;
    .noData{
      font-size: 18px;
      line-height: 22px;
      margin: 32px 0;
      color: rgba(0, 0, 0, 0.25);
      text-align: center !important;
        // height: 40px;
    }
    .certificate-fix-block{
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;

        .certificate-block{
            width: 210px;
            height: 283px;
            background: #FFFFFF;
            border: 1px solid #ebeef6;
            border-radius: 4px;
            position: relative;
            transform: translateY(0);
            margin: 0 8px 17px 8px;
            cursor: pointer;
            text-align: center;
            .certificate-main{
                height: 209px;
                background: #ffffff;
                position: relative;
                overflow: hidden;
                line-height: 180px;
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
                .certificate-img{
                    text-align: center;
                    padding: 7px;
                    img{
                        width: 100%;
                    }
                }
            }
            .certificate-descript{
                // height: 73px;
                // padding: 16px;
                .certificate-name{
                    font-size: 16px;
                    font-weight: 500;
                    color: #27274a;
                    // line-height: 20px;
                    margin-bottom: 6px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .certificate-exam-name{
                    font-size: 16px;
                    color: #656577;
                    // line-height: 12px;
                    transform: scale(0.9);
                    transform-origin: left center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
