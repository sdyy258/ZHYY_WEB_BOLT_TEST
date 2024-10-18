<template>
  <div />
</template>

<script>
import * as echarts from 'echarts'

require('echarts/theme/macarons')
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      const xAxisData = Object.keys(chartData)
      const seriesData = Object.values(chartData)
      this.chart.setOption({
        legend: {
          data: ['车辆成本'],
          top: 20,
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 15,
          top: 80,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#0c3b71'
              }
            },
            axisLabel: {
              show: true,
              color: '#333',
              fontSize: 12,
              formatter: (value) => {
                const array = value.split('')
                let index = 0
                while (index < array.length) {
                  if (index % 6 === 5) {
                    array.splice(index, 0, '\n')
                  }
                  index++
                }
                return array.join('')
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '车辆成本',
            nameTextStyle: {
              color: '#333',
              lineHeight: 30
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#eee']
              }
            },
            axisTick: { show: true },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#0c3b71'
              }
            },
            axisLabel: {
              color: '#333'
            }
          }
        ],
        series: [
          {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00d3ff' },
              { offset: 1, color: '#00acff' }
            ]),
            name: '车辆成本',
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 0, 0]
              }
            },
            data: seriesData
          }
        ]
      })
    }
  }
}
</script>
