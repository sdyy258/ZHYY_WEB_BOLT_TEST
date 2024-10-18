<template>
  <div style="position:relative;">
    <div class="wrapper">
      <a-dropdown v-model="visible">
        <a-icon type="setting" class="setting" @click="e => e.preventDefault()" />
        <div slot="overlay">
          <a-card>
            <a-checkbox-group v-model="settingColumns" :default-value="settingColumns" @change="onColSettingsChange">
              <template v-for="(item) in defColumns">
                <div v-if="item.key!='rowIndex'&& item.dataIndex!='action'" :key="item.dataIndex">
                  <a-checkbox :value="item.dataIndex">{{ item.title }}
                  </a-checkbox>
                </div>
              </template>
            </a-checkbox-group>
          </a-card>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefColumns',
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      settingColumns: [],
      defColumns: []
    }
  },
  mounted() {
    this.initColumns()
  },
  methods: {
    initColumns() {
      this.defColumns = [...this.columns]
      const allSettingColumns = []
      let existsDefaultHide = false
      this.defColumns.forEach(function(item) {
        if (item.defaultHide !== true) {
          allSettingColumns.push(item.dataIndex)
        } else {
          existsDefaultHide = true
        }
      })
      this.settingColumns = allSettingColumns
      if (existsDefaultHide) {
        this.settingsChange()
      }
    },
    onColSettingsChange(checkedValues) {
      this.settingColumns = checkedValues
      this.settingsChange()
    },
    settingsChange() {
      const cols = this.defColumns.filter(item => {
        if (item.key === 'rowIndex' || item.dataIndex === 'action') {
          return true
        }
        return this.settingColumns.includes(item.dataIndex)
      })
      this.$emit('setColumns', cols)
    }
  }
}
</script>
<style scoped>
  .wrapper{
    position: absolute;
    z-index: 10;
    right: 2px;
    top: -24px;
  }
  .setting{
    font-size:16px;
    color:#108ee9;
  }
</style>
