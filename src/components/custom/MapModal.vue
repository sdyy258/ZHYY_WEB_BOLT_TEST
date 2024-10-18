<template>
  <a-modal
    title="查看地图"
    :centered="false"
    :width="1400"
    :visible="visible"
    :mask-closable="true"
    cancel-text="关闭"
    :footer="null"
    :dialog-style="{top: '0px'}"
    @cancel="visible=false"
  >
    <a-form layout="inline" style="width: 80%;margin-bottom: 20px">
      <a-input-group compact style="display: flex;">
        <a-input v-model="longitude" addon-before="选中经度" placeholder="请点击地图选择" disabled style="flex: 1" />
        <a-input v-model="latitude" addon-before="选中纬度" placeholder="请点击地图选择" disabled style="flex: 1" />
        <a-input v-model="address" addon-before="选中地址" placeholder="请点击地图选择" disabled style="flex: 2" />
        <a-button v-show="longitude&&latitude" type="primary" style="transform: translateY(-1px)" @click="handleOk">确定</a-button>
      </a-input-group>
    </a-form>
    <div style="border: 1px solid #c9ac17">
      <baidu-map
        :center="center"
        :zoom="zoom"
        scroll-wheel-zoom
        style="width:100%; height:620px;display: flex"
        @click="mapClick"
        @ready="onBaiduMapReady"
      >
        <bm-control>
          <a-input v-model="keyword" placeholder="请输入地名关键字" style="width: 300px;" />
        </bm-control>
        <bm-local-search id="bmLocalSearch" :keyword="keyword" :auto-viewport="true" :panel="true" @searchcomplete="searchcomplete" />
      </baidu-map>
    </div>
  </a-modal>
</template>

<script>
import coordtransform from 'coordtransform'
import $ from 'jquery'
const center = { lng: 117, lat: 34.8 }
const zoom = 10
export default {
  data() {
    return {
      panelPointList: [], // 搜索面板点
      visible: false,
      center,
      zoom,
      BMap: null,
      keyword: null,
      address: null, // 选中地址
      longitude: null, // 选中经度
      latitude: null// 选中纬度
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    onBaiduMapReady(e) {
      this.BMap = e.BMap
    },
    mapClick(e) {
      const geoCoder = new this.BMap.Geocoder()
      geoCoder.getLocation(e.point, res => {
        this.address = res.address
        // this.longitude = res.point.lng
        // this.latitude = res.point.lat
        const [longitude, latitude] = coordtransform.bd09togcj02(res.point.lng, res.point.lat)
        this.longitude = longitude.toFixed(10)
        this.latitude = latitude.toFixed(10)
      })
    },
    searchcomplete(results) {
      if (!results) {
        return
      }
      const that = this
      this.panelPointList = results.as || []
      $(document).on('click', '#bmLocalSearch ol li', function() {
        const index = $(this).index()
        const obj = that.panelPointList[index]
        if (!obj) {
          return
        }
        const { address, point, title } = obj
        that.address = address + title
        const [longitude, latitude] = coordtransform.bd09togcj02(point.lng, point.lat)
        that.longitude = longitude.toFixed(10)
        that.latitude = latitude.toFixed(10)
      })
    },
    handleOk() {
      this.$emit('mapClick', { longitude: this.longitude, latitude: this.latitude, address: this.address })
      this.visible = false
    }
  }
}
</script>
<style scoped lang='less'>
/deep/ .BMap_pop {
  display: none;
}

/deep/ .BMap_shadow {
  display: none;
}
</style>
