<template>
  <div style="height: 100%">
    <a-form v-if="!disabled" layout="inline" style="width: 80%;margin-bottom: 20px">
      <a-input-group compact style="display: flex;">
        <a-input v-model="lng" addon-before="选中经度" placeholder="请点击地图选择" disabled style="flex: 1" />
        <a-input v-model="lat" addon-before="选中纬度" placeholder="请点击地图选择" disabled style="flex: 1" />
        <a-button v-show="lng&&lat" type="primary" style="transform: translateY(-1px)" @click="handleOk">确定</a-button>
      </a-input-group>
    </a-form>
    <div style="border: 1px solid #c9ac17;height: 100%">
      <l-map ref="map" v-bind="mapOptions" :style="{width,height}" @click="mapClick">
<!--        <l-geo-json :geojson="geoJson" :options="{color:'#00CCFF',weight:3,fill:false}" />-->
        <l-layer-group>
          <l-tile-layer :url="TianDiTu.Satellite.Map" />
          <l-tile-layer :url="TianDiTu.Satellite.Annotion" />
        </l-layer-group>
        <template v-if="lat&&lng">
          <l-marker :lat-lng="[lat,lng]">
            <l-icon>
              <img :src="enterpriseIcon">
            </l-icon>
            <l-tooltip v-if="enterpriseName">
              <div>{{ enterpriseName }}</div>
            </l-tooltip>
          </l-marker>
        </template>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LLayerGroup, LTileLayer, LGeoJson, LMarker, LIcon, LTooltip } from 'vue2-leaflet'
import geoJson from '@/utils/geoJson/140521.json'
import { TianDiTu } from '@/utils/custom/constant'

export default {
  components: { LMap, LLayerGroup, LTileLayer, LGeoJson, LMarker, LIcon, LTooltip },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: [String, Number],
      default: ''
    },
    latitude: {
      type: [String, Number],
      default: ''
    },
    enterpriseName: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      mapOptions: {
        zoom: 11,
        // minZoom: 9,
        center: [35.80, 112.35],
        options: {
          zoomControl: false,
          attributionControl: false
        }
      },
      TianDiTu,
      geoJson,
      enterpriseIcon: require('@/assets/img/qiye.png'),
      lng: null,
      lat: null
    }
  },
  watch: {
    longitude: {
      immediate: true,
      handler(val) {
        this.lng = val
        this.setView()
      }
    },
    latitude: {
      immediate: true,
      handler(val) {
        this.lat = val
        this.setView()
      }
    }
  },
  methods: {
    mapClick(e) {
      if (!this.disabled) {
        this.lat = e.latlng.lat.toFixed(6)
        this.lng = e.latlng.lng.toFixed(6)
      } else {
        this.$emit('mapClick', { longitude: this.lng, latitude: this.lat })
      }
    },
    handleOk() {
      this.$emit('mapClick', { longitude: this.lng, latitude: this.lat })
    },
    setView() {
      this.$nextTick(() => {
        if (this.lat && this.lng) {
          this.$refs.map.mapObject.setView([this.lat, this.lng], this.mapOptions.zoom)
        } else {
          this.$refs.map.mapObject.setView([35.80, 112.35], this.mapOptions.zoom)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "~leaflet/dist/leaflet.css";
</style>
