export default {
  data() {
    return {
      tableKey: 0
    }
  },
  watch: {
    dataSource(oldVal, newVal) {
      if (oldVal.length !== newVal.length) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.tableResize()
          }, 200)
        })
      }
    }
  },
  methods: {
    tableResize() {
      let scrollLeft = 0
      const collection = document.getElementsByClassName('ant-table-body')
      const element = collection[collection.length - 1]
      if (element) {
        scrollLeft = element.scrollLeft
      }
      this.tableKey++
      this.$nextTick(function() {
        setTimeout(() => {
          const collection = document.getElementsByClassName('ant-table-body')
          const element = collection[collection.length - 1]
          if (element) {
            element.scrollLeft = scrollLeft
          }
        }, 20)
      })
    }
  }
}

