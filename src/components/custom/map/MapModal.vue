<template>
  <a-modal
    title="查看地图"
    centered
    :width="1400"
    :visible="visible"
    :mask-closable="true"
    cancel-text="关闭"
    :footer="null"
    destroy-on-close
    @cancel="visible=false"
  >
    <Map :longitude="longitude" :latitude="latitude" :enterprise-name="enterpriseName" height="800px" @mapClick="mapClick" />
  </a-modal>
</template>

<script>

import Map from './Map'

export default {
  components: { Map },
  data() {
    return {
      visible: false,
      disabled: false,
      longitude: null, // 选中经度
      latitude: null, // 选中纬度
      enterpriseName: null// 企业名称
    }
  },
  methods: {
    showModal({ longitude, latitude, enterpriseName, disabled = false }) {
      this.longitude = longitude
      this.latitude = latitude
      this.enterpriseName = enterpriseName
      this.disabled = disabled
      this.visible = true
    },
    mapClick(e) {
      this.$emit('mapClick', e)
      this.visible = false
    }
  }
}
</script>

