import { message } from 'ant-design-vue'
import axios from 'axios'
// export function getDictText(Options, textValue, value = 'value', text = 'text') {
//   const actions = []
//   Object.keys(Options).some((key) => {
//     // eslint-disable-next-line eqeqeq
//     if (Options[key][value] == textValue) {
//       actions.push(Options[key][text])
//       return true
//     }
//   })
//   return actions.join('')
// }
export function getDictText(array, value, originalKey = 'value', replaceKey = 'text') {
  const obj = array.find(i => i[originalKey] == value) || {}
  return obj[replaceKey]
  // const actions = []
  // Object.keys(Options).some((key) => {
  //   // eslint-disable-next-line eqeqeq
  //   if (Options[key][value] == textValue) {
  //     actions.push(Options[key][text])
  //     return true
  //   }
  // })
  // return actions.join('')
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id = 'id', parentId = 'parentId', rootId = '0', children = 'children') {
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      // eslint-disable-next-line eqeqeq
      return father[id] == child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回第一层
    // eslint-disable-next-line eqeqeq
    return father[parentId] == rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * 树数据转list数据
 * @param data
 * @param dataList
 * @returns {*[]}
 */
export function getListForTree(data, dataList = [], children = 'children') {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    dataList.push({ ...node, ...{ [children]: undefined }})
    if (node[children]) {
      getListForTree(node[children], dataList)
    }
  }
  return dataList
}

// 下拉列表筛选
export function $filterOption(input, option) {
  return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 全屏
export function fullscreen() {
  try {
    var docElm = document.documentElement
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen()
    }
  } catch (e) {
    console.log(e)
  }
}

// 退出全屏
export function exitFullscreen() {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  } catch (e) {
    console.log(e)
  }
}

/**
 * 数组分组
 * @param array
 * @param f 传一个方法
 */
export function groupBy(array, f) {
  const groups = {}
  array.forEach(item => {
    const group = JSON.stringify(f(item))
    groups[group] = groups[group] || []
    groups[group].push(item)
  })
  return Object.keys(groups).map(function(group) {
    return groups[group]
  })
}

export function htmlToString(htmlStr) {
  return htmlStr ? htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g, '') : ''
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0
    var v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 判断某个数组中是否包含另一个数组
export function isContained(a, b) {
  if (!(a instanceof Array) || !(b instanceof Array)) return false
  if (a.length < b.length) return false
  const aStr = a.toString()
  for (let i = 0, len = b.length; i < len; i++) {
    if (aStr.indexOf(b[i]) === -1) return false
  }
  return true
}

export function latLngToDMS(decimalDegrees) {
  const degrees = Math.floor(Math.abs(decimalDegrees))
  const minutes = Math.floor((Math.abs(decimalDegrees) - degrees) * 60)
  const seconds = ((Math.abs(decimalDegrees) - degrees - minutes / 60) * 3600).toFixed(2)
  return {
    d: degrees,
    f: minutes,
    m: seconds
  }
}

export function DMStoLatLng(degrees, minutes, seconds) {
  return (degrees + (minutes / 60) + (seconds / 3600)).toFixed(5)
}

export function isNull(value) {
  if (value === 0) {
    return false
  } else if (!value) {
    return true
  } else {
    return false
  }
}

export function getPopupContainer(node) {
  return document.getElementById('fullScreenId') || document.body
}

let _debounceTimeout = null
let _throttleRunning = false
/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const debounce = (fn, delay = 500) => {
  clearTimeout(_debounceTimeout)
  _debounceTimeout = setTimeout(() => {
    fn()
  }, delay)
}
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return
  }
  _throttleRunning = true
  fn()
  setTimeout(() => {
    _throttleRunning = false
  }, delay)
}

export function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.match('audio.*') && !file.type.match('video.*')) {
      reject(new Error('请上传音频或视频文件！'))
      return
    }

    const mediaUrl = URL.createObjectURL(file)
    const mediaElement = document.createElement('video') // 对于音频文件，也可以改用'audio'

    // 监听元数据加载完成
    mediaElement.addEventListener('loadedmetadata', function() {
      // 获取并解析时长
      const duration = mediaElement.duration
      resolve(duration)

      // 释放URL对象
      URL.revokeObjectURL(mediaUrl)
    })

    // 监听错误事件
    mediaElement.addEventListener('error', function() {
      reject(new Error('无法加载媒体文件或文件不是有效的音频/视频文件。'))
      URL.revokeObjectURL(mediaUrl) // 即使出错也释放URL
    })

    // 设置视频源并开始加载
    mediaElement.src = mediaUrl
    mediaElement.load() // 触发加载过程
  })
}

export function convertBytes(bytes) {
  if (bytes === '' || bytes == null) return ''
  if (bytes == 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + '' + sizes[i]
}

export function formatSeconds(theTime) {
  let theTime1 = 0
  let theTime2 = 0
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }
  let result = `${parseInt(theTime)}秒`
  if (theTime1 > 0) {
    result = `${parseInt(theTime1)}分${result}`
  }
  if (theTime2 > 0) {
    result = `${parseInt(theTime2)}小时${result}`
  }
  return result
}
export function downloadFile(url) {
  if (!url) {
    message.warning('文件地址不存在')
    return
  }
  const fileName = url.split('/').slice(-1)[0]
  axios({
    method: 'get',
    url: url,
    responseType: 'blob'
  }).then(function(response) {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }).catch(function(error) {
    console.error('下载文件出错:', error)
  })
}
export function isPageFullscreen() {
  const explorer = window.navigator.userAgent.toLowerCase()
  if (explorer.indexOf('chrome') > 0) { // webkit
    if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
      return true
    } else {
      return false
    }
  } else { // IE 9+  fireFox
    if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
      return true
    } else {
      return false
    }
  }
}
export function canvasToBlob(canvas, fileName = '图片') {
  const link = document.createElement('a')
  const imgData = canvas.toDataURL({ format: 'png', multiplier: 4 })
  const blob = dataURLtoBlob(imgData)
  const objUrl = URL.createObjectURL(blob)
  link.download = fileName + '.png'
  link.href = objUrl
  link.click()
}
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
// base64文件上传，base转文件上传后端
export function base64ToFile(base64Data, filename) {
  // 将base64的数据部分提取出来
  const arr = base64Data.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  // 创建Blob对象
  const blob = new Blob([u8arr], { type: mime })

  // 创建File对象
  const file = new File([blob], filename, { type: mime })

  return file
}
// 秒转分
export function secondToMinute(second) {
  if (!second) {
    return 0
  } else {
    return (second / 60).toFixed(2)
  }
}
export function toPercent(a, b) {
  if (!a || !b) {
    return 0
  } else if (a > b) {
    return 100
  } else {
    return parseFloat((a / b * 100).toFixed(2))
  }
}

export function getABCD(index) {
  const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return array[index]
}
export function getChineseNumber(index) {
  const array = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  return array[index]
}
export function stringToArray(value) {
  if (!value) {
    return []
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value.split(',')
  } else {
    return value
  }
}
export function arrayToString(value) {
  if (!value) {
    return ''
  } else {
    return value.toString()
  }
}
export function distributePercentage(quantity) {
  if (quantity <= 0) {
    return []
  }
  // 计算每个单位应该获得的百分比（向下取整）
  const basePercentage = Math.floor(100 / quantity)
  // 初始化结果数组，除了最后一个元素外，都填充为basePercentage
  const percentages = Array(quantity).fill(basePercentage)
  // 当前分配数据求和
  const percentagesTotal = percentages.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  // 计算剩余未分配的百分比
  const remainingPercentage = 100 - percentagesTotal
  // 将剩余的百分比加到最后一个元素上
  percentages[percentages.length - 1] += remainingPercentage
  return percentages
}
export function previewFile(path) {
  if (!path) {
    message.warning('文件不存在')
  } else {
    // 好阿婆后端文件转换服务
    const url = 'http://101.132.36.246:8012/onlinePreview?url=' + new Buffer(path).toString('base64')
    window.open(url)
  }
}
export function getPreviewFileUrl(url) {
  if (!url) {
    return ''
  }
  return 'http://101.132.36.246:8012/onlinePreview?url=' + new Buffer(url).toString('base64')
}