<template>
  <a-checkbox-group v-if="!isRichText" :options="options" :value="checkboxArray" v-bind="$attrs" @change="onChange" />
  <a-checkbox-group v-else :value="checkboxArray" v-bind="$attrs" @change="onChange">
    <a-checkbox v-for="i in options" :key="i.value" :value="i.value"><span class="rich-text-html" v-html="i.label" /></a-checkbox>
  </a-checkbox-group>
</template>

<script>
export default {
  name: 'JCheckbox',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: false
    },
    /* label value*/
    options: {
      type: Array,
      required: true
    },
    isRichText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkboxArray: !this.value ? [] : this.value.split(',')
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.checkboxArray = []
      } else {
        this.checkboxArray = this.value.split(',')
      }
    }
  },
  methods: {
    onChange(checkedValues) {
      this.$emit('change', checkedValues.join(','))
    }
  }
}
</script>
