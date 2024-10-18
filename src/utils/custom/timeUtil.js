import moment from 'moment'

const time = {
  moment,
  today: moment().startOf('day').format('YYYY-MM-DD'), // 今天
  month: moment().format('YYYY-MM'), // 本月
  year: moment().format('YYYY'), // 本年
  lastDay: moment().subtract(1, 'days').format('YYYY-MM-DD'), // 昨天
  dayRealTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 此刻时间   每次拿到的都是第一次调用该值得时间
  getCurrentTime: function() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  },
  // 查询当天 00:00:00~23:59:59
  getCurrentDayRange: function(showTime = true) {
    const day = moment().startOf('day').format('YYYY-MM-DD')
    const startTime = day + (showTime === true ? ' 00:00:00' : '')
    const endTime = day + (showTime === true ? ' 23:59:59' : '')
    return [startTime, endTime]
  }
}
export default time
