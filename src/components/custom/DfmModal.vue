<template>
  <a-modal
    centered
    title="度分秒"
    :width="500"
    :visible="visible"
    :mask-closable="false"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-form-item label="经度">
      <a-input-group style="display:flex;transform: translateY(5px)">
        <div style="display: flex;align-items: center">
          <a-input-number v-model="d" :min="0" :precision="0" />
          <span class="ml5">度</span>
          <a-input-number v-model="f" :min="0" :precision="0" class="ml20" />
          <span class="ml5">分</span>
          <a-input-number v-model="m" :min="0" :precision="3" class="ml20" />
          <span class="ml5">秒</span>
        </div>
      </a-input-group>
    </a-form-item>
    <a-form-item label="纬度">
      <a-input-group style="display:flex;transform: translateY(5px)">
        <div style="display: flex;align-items: center">
          <a-input-number v-model="du" :min="0" :precision="0" />
          <span class="ml5">度</span>
          <a-input-number v-model="fen" :min="0" :precision="0" class="ml20" />
          <span class="ml5">分</span>
          <a-input-number v-model="miao" :min="0" :precision="3" class="ml20" />
          <span class="ml5">秒</span>
        </div>
      </a-input-group>
    </a-form-item>
  </a-modal>
</template>

<script>
export default {
  name: 'DfmModal',
  data() {
    return {
      visible: false,
      d: '',
      f: '',
      m: '',
      du: '',
      fen: '',
      miao: ''
    }
  },
  methods: {
    showModal(options = {}) {
      this.d = ''
      this.f = ''
      this.m = ''
      this.du = ''
      this.fen = ''
      this.miao = ''
      const { longitude, latitude } = options
      if (longitude) {
        const { d, f, m } = this.$utils.latLngToDMS(longitude)
        this.d = d
        this.f = f
        this.m = m
      }
      if (latitude) {
        const { d, f, m } = this.$utils.latLngToDMS(latitude)
        this.du = d
        this.fen = f
        this.miao = m
      }
      this.visible = true
    },
    handleOk() {
      if (!this.d || !this.du) {
        this.$message.warning('请输入度')
        return
      }
      const longitude = (this.d + this.f / 60 + this.m / 3600).toFixed(5)
      const latitude = (this.du + this.fen / 60 + this.miao / 3600).toFixed(5)
      this.$emit('ok', { longitude: longitude, latitude: latitude })
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
