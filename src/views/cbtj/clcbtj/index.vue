<template>
  <div class="wrapper">
    <div class="top">
      <div class="top-left">
        <div class="cu-title">车辆成本总计</div>
        <div class="top-left-content">
          <CarCostChart style="height: 100%" :chart-data="carCostData" />
        </div>
      </div>
      <div class="top-right">
        <div class="cu-title">车辆分组统计</div>
        <div class="top-right-content">
          <CarDepartModal style="height: 100%" :chart-data="carDepartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CarCostChart from './components/CarCostChart'
import CarDepartModal from './components/CarDepartModal'
export default {
  name: 'Index',
  components: { CarCostChart, CarDepartModal },
  data() {
    return {
      carCostData: {},
      carDepartData: {}
    }
  },
  created() {
    // 车辆成本总计
    this.getAction('/baseVehicleExpense/baseVehicleExpense/totalCost').then(res => {
      this.carCostData = res.result || {}
    })
    // 车辆分组统计
    this.getAction('/baseVehicleExpense/baseVehicleExpense/groupCost').then(res => {
      this.carDepartData = res.result || {}
    })
  },
  methods: {}
}
</script>

<style scoped lang="less">
.cu-title {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  border-bottom: 1px solid #F0F0F0;

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 22px;
    background: #3D7CC6;
    border-radius: 2px;
    margin-right: 10px;
  }
}

.wrapper {
  width: 100%;
  padding: 16px 16px 0 16px;

  .top {
    display: flex;

    .top-left {
      background: white;
      border-radius: 4px;
      width: 50%;

      .top-left-content {
        height: 360px;
      }
    }

    .top-right {
      background: white;
      border-radius: 4px;
      width: 50%;
      margin-left: 16px;

      .top-right-content {
        height: 360px;
      }
    }
  }
}
</style>
