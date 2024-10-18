// 被除数，除数， 保留的小数点后的位数
export function division(arg1, arg2) {
  if (arg1 == '0' && arg2 == '0') {
    return '0'
  } else {
    var t1 = 0
    var t2 = 0
    var r1; var r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return Number((r1 / r2) * Math.pow(10, t2 - t1))
  }
}
// 乘法
export function multiplication(arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
export default {
  division,
  multiplication
}
