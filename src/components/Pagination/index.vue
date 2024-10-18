<template>
  <div class="pagination-container">
    <a-pagination
      v-model="currentPage"
      size="small"
      :page-size.sync="limit"
      :total="total"
      v-bind="configs"
      @change="handleCurrentChange"
      @showSizeChange="handleSizeChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    current: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    otherConfigs: {
      type: Object,
      default: () => {}
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30']
    }
  },
  data() {
    return {
      ipagination: {
        pageSizeOptions: this.pageSizeOptions,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  computed: {
    configs() {
      return Object.assign({ ...this.ipagination, ...this.otherConfigs })
    },
    currentPage: {
      get() {
        return this.current
      },
      set(val) {
        this.$emit('update:current', val)
      }
    },
    limit: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  methods: {
    handleSizeChange(current, size) {
      this.$nextTick(() => {
        this.$emit('change', { current: this.currentPage, pageSize: size })
      })
    },
    handleCurrentChange(val) {
      this.$nextTick(() => {
        this.$emit('change', { current: val, pageSize: this.limit })
      })
    }
  }
}
</script>
<style scoped>
  .pagination-container {
    margin: 16px 0;
  }
</style>
