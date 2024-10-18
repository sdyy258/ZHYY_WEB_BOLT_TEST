export default {
  /**
   * 验证电子邮箱格式
   */
  email: {
    pattern: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    message: ''
  },
  /**
   * 验证手机格式
   */
  mobile: {
    pattern: /^1[23456789]\d{9}$/,
    message: '请输入正确格式的手机号码'
  },
  /**
   * 验证URL格式
   */
  url: {
    pattern: /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
    message: ''
  },
  /**
   * 验证日期格式
   */
  date: {
    pattern: !/Invalid|NaN/,
    message: ''
  },
  /**
   * 验证ISO类型的日期格式
   */
  dateISO: {
    pattern: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
    message: ''
  },
  /**
   * 验证十进制数字
   */
  number: {
    pattern: /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
    message: ''
  },
  /**
   * 验证整数
   */
  digits: {
    pattern: /^\d+$/,
    message: '只能由数字组成'
  },
  /**
   * 验证身份证号码
   */
  idCard: {
    pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
    message: '请输入正确格式的身份证号码'
  },
  /**
   * 金额,只允许2位小数
   */
  amount: {
    pattern: /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/,
    message: ''
  },
  /**
   * 中文
   */
  chinese: {
    pattern: /^[\u4e00-\u9fa5]+$/gi,
    message: ''
  },
  /**
   * 只能输入字母
   */
  letter: {
    pattern: /^[a-zA-Z]*$/,
    message: ''
  },
  /**
   * 只能是字母或者数字
   */
  enOrNum: {
    pattern: /^[0-9a-zA-Z]*$/g,
    message: ''
  },
  /**
   * 24位字母或者数字
   */
  enOrNum24: {
    pattern: /^[0-9a-zA-Z]{24}$/g,
    message: '请输入24位英文字母或数字'
  },
  /**
   * 是否固定电话
   */
  landline: {
    pattern: /^\d{3,4}-\d{7,8}(-\d{3,4})?$/,
    message: '请输入正确的固定电话'
  },
  /**
   * 统一社会信用代码
   */
  creditCode: {
    pattern: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g,
    message: '请输入18位数字或大写字母(3-8位为数字),字母不包括 I、O、Z、S、V'
  },
  /**
   * 法人代码
   */
  legalPersonCode: {
    pattern: /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$/,
    message: '请输入合法的法人代码(XXXXXXXX-X)'
  },
  /**
   * 传真
   */
  fax: {
    pattern: '((^\\d{11}$)|(^\\d{12}$))|(^\\d{3}-\\d{8}$)|(^\\d{4}-\\d{7}$)|(^\\d{4}-\\d{8}$)',
    message: ''
  },
  /**
   * 经度
   */
  longitude: {
    pattern: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
    message: '请输入正确的经度'
  },
  /**
   * 纬度
   */
  latitude: {
    pattern: /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
    message: '请输入正确的纬度'
  },
  /**
   * 经纬度 1-6位小数
   */
  latLng: {
    pattern: /^[\-\+]?(0?\d{1,2}\.\d{1,6}|1[0-7]?\d{1}\.\d{1,6}|180\.0{1,6})$/,
    message: '请输入正确的经纬度(数值型保留1至6位小数)'
  },
  /**
   * 6-13位数字或固话号码
   */
  mobileAndLandline: {
    pattern: /^\d{3,4}-\d{6,8}(-\d{3,4})?$|^\d{6,13}?$/,
    message: '请输入格式正确的手机号码或固话号码'
  },
  /**
   * 排口编号
   */
  code: {
    // pattern: /^[DA]{2}|[DW]{2}\d{3}$/,
    pattern: /^(DW|DA)\d{3}$/,
    message: '请输入格式正确的排口编号(DW+3位数字或DA+3位数字)'
  },
  /**
   * 设施编码
   */
  facilityCode: {
    // pattern: /^[TA]{2}|[TW]{2}\d{3}$/,
    pattern: /^(TW|TA)\d{3}$/,
    message: '请输入格式正确的设施编码(TW+3位数字或TA+3位数字)'
  },
  /**
   * 产污设施编码
   */
  pollutionCode: {
    pattern: /^[MF]{2}\d{4}$/,
    message: '请输入格式正确的设施编码(MF+4位数字)'
  }
}
