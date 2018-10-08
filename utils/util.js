const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//转发所需要携带的信息
function tran(that) {
  var _that = that.data
  var tranJsonData = {
    starttime: _that.starttime,
    endtime: _that.endtime,
    year: _that.year,
    month: _that.month,
    day: _that.day,
    num: _that.numArr[_that.index],
    invitor: _that.invitor,
    reason: _that.reason,
    address: _that.address
  }
  return JSON.stringify(tranJsonData)
  // return JSON.parse(tranJsonData)
}

//设置邀请数据
function inviteInfo(that,initData){
  var data = JSON.parse(initData)
  that.setData({
    reason: data.reason,
    year: data.year,
    month: data.month,
    day: data.day,
    starttime: data.starttime,
    endtime: data.endtime,
    address: data.address,
    num: data.num,
    invitor: data.invitor,
    show: data.show,
  })
}

//邮箱以及手机的正则表达式
function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  }
  return reg;
}

//获取日期列表
function getPickerList(tag){
  const years = []
  const months = []
  const days = []
  const nums = []
  for (let i = 2017; i <= 2048; i++) {
    years.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  for (let i = 1; i <= 20; i++) {
    nums.push(i)
  }
  if(tag=='years'){
    return years
  }else if(tag=='months'){
    return months
  }else if(tag=='days'){
    return days
  }else if(tag=='nums'){
    return nums
  }
}
//获取日期
function getPicker(tag){
  const date = new Date()
  if(tag=='year'){
    return date.getFullYear()
  }else if(tag=='month'){
    return date.getMonth() + 1
  }else if(tag=='day'){
    return date.getDate()
  }else if('arr'){
    return [date.getFullYear()-2017,date.getMonth(),date.getDate()-1]
  }
}

//表单验证
function checkForm(that){
  if(checkName(that)&&checkPhone(that)&&checkCode(that)){
    return true
  }else{
    return false
  }
}
function checkPerInfo(that) {
  if (checkName(that) && checkPhone(that)) {
    return true
  } else {
    return false
  }
}
function checkName(that) {
  if (that.data.name.trim() == "") {
    wx.showToast({
      title: '姓名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  if (that.data.phone == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.phone)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkCode(that) {
  if (that.data.code == "") {
    wx.showToast({
      title: '验证码不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (that.data.code != that.data.iscode) {
    wx.showToast({
      title: '验证码错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}

module.exports = {
  formatTime: formatTime,
  regexConfig: regexConfig,
  getPicker: getPicker,
  getPickerList: getPickerList,
  tran: tran,
  checkPhone: checkPhone,
  checkForm: checkForm,
  checkPerInfo: checkPerInfo,
  inviteInfo: inviteInfo
}
