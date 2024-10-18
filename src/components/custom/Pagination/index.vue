<template>
  <div class="pagination-container">
    <a-pagination
      v-model="currentPage"
      size="small"
      :page-size.sync="limit"
      :total="total"
      :page-size-options="pageSizeOptions"
      v-bind="ipagination"
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
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30']
    }
  },
  data() {
    return {
      ipagination: {
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  computed: {
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
    float: right;
    margin: 16px 0;
  }
</style>
