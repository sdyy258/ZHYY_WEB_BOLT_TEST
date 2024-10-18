<template>
  <div class="wrapper">
    <address-list-left :key="treeKey" v-model="currentOrgCode" class="address-left" />
    <address-list-right v-model="currentOrgCode" class="address-right" @resetTree="resetTree" />
  </div>
</template>

<script>
import AddressListLeft from './modules/AddressListLeft'
import AddressListRight from './modules/AddressListRight'

export default {
  name: 'AddressList',
  components: { AddressListLeft, AddressListRight },
  data() {
    return {
      currentOrgCode: '',
      treeKey: 1
    }
  },

  methods: {
    resetTree() {
      this.currentOrgCode = ''
      this.treeKey++
    }
  }
}
</script>
<style scoped lang='less'>
.wrapper {
  display: flex;
  height: calc(100% - 10px);

  .address-left {
    width: 21%;
    height: 100%;
    overflow-y: auto;
  }

  .address-right {
    margin-left: 12px;
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}

</style>
