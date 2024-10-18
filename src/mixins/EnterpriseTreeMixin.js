export const EnterpriseTreeMixin = {
  data() {
    return {
      disableMixinTreeCreated: false, // 是否取消左侧树混入js中的created方法执行
      enterpriseRequired: false, // 企业是否必选
      disableMixinTreeEnterpriseWatch: false // 是否取消左侧树混入js中的currentEnterprise监听方法
    }
  },
  computed: {
    currentEnterprise() {
      return this.$store.getters.currentEnterprise
    },
    enterpriseCity() {
      return this.$store.getters.enterpriseCity
    },
    enterpriseDistrict() {
      return this.$store.getters.enterpriseDistrict
    },
    enterpriseChecked() {
      return Object.keys(this.currentEnterprise).length !== 0
    }
  },
  watch: {
    currentEnterprise() {
      if (!this.disableMixinTreeEnterpriseWatch) {
        this.initEnterPriseParams()
        // 当企业不是必选或者选中某个企业时  当前企业状态改变时触发
        if (!this.enterpriseRequired || this.enterpriseChecked) {
          this.searchQuery()
        }
      }
    }
  },
  created() {
    if (!this.disableMixinTreeCreated) {
      this.searchReset()
    }
  },
  methods: {
    initEnterPriseParams() {
      this.queryParam.enterpriseId = this.currentEnterprise.id
      this.queryParam.cityId = this.enterpriseCity
      this.queryParam.districtId = this.enterpriseDistrict
      this.queryParam.creditCode = this.currentEnterprise.creditCode
    },
    clickEnterpriseCity(params) {
      this.$nextTick(() => {
        this.$bus.$emit('clickEnterpriseCity', params)
      })
    },
    clickEnterprise(params) {
      this.$nextTick(() => {
        this.$bus.$emit('clickEnterprise', params)
      })
    },
    resetEnterpriseTree() {
      this.$nextTick(() => {
        this.$bus.$emit('resetEnterpriseTree')
      })
    },
    setDefaultEnterprise() {
      this.$nextTick(() => {
        if (JSON.stringify(this.$store.getters.currentEnterprise) === '{}') {
          this.clickEnterprise(this.$store.getters.firstEnterprise)
        }
      })
    }
  }
}
